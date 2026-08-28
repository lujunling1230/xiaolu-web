#!/usr/bin/env python3
"""
Step 4: 端到端评测运行脚本

这个脚本把所有步骤串起来：
  1. 加载 20 条评测集（benchmark_20.jsonl）
  2. 初始化自定义 Hermes Agent
  3. 逐条执行评测：Agent 回答 -> 指标计算 -> 打分
  4. 生成 JSON 报告 + 终端可视化摘要

评测指标：
  - keyword_coverage:  关键词覆盖率（回复中包含的期望关键词比例）
  - response_relevance: 回复相关性（基于关键词密度和长度合理性）
  - response_length:   回复长度得分（是否在合理范围内）
  - total_score:       加权总分（0~1）

用法:
  python run_eval.py                          # 运行全部 20 条
  python run_eval.py --limit 5                # 只跑前 5 条（快速测试）
  python run_eval.py --benchmark benchmark_20.jsonl  # 指定评测集
"""

import json
import os
import sys
import time
from pathlib import Path
from typing import Any, Dict, List

# 确保能导入同目录下的模块
sys.path.insert(0, str(Path(__file__).parent))

from custom_agent import HermesCustomAgent


# ─── 评测指标计算 ──────────────────────────────────────────────

def calc_keyword_coverage(response: str, expected_keywords: List[str]) -> float:
    """关键词覆盖率"""
    if not expected_keywords:
        return 1.0
    response_lower = response.lower()
    matched = sum(1 for kw in expected_keywords if kw.lower() in response_lower)
    return matched / len(expected_keywords)


def calc_response_relevance(response: str, task: str, expected_keywords: List[str]) -> float:
    """
    回复相关性得分

    综合考虑：
    - 关键词密度（关键词出现次数 / 回复长度）
    - 回复是否非空且非错误
    - 回复是否与任务主题相关
    """
    if not response or response.startswith("[Agent 错误]"):
        return 0.0

    score = 0.0

    # 1. 非空且非错误 -> 基础分 0.3
    score += 0.3

    # 2. 关键词密度
    if expected_keywords:
        response_lower = response.lower()
        total_hits = sum(
            response_lower.count(kw.lower()) for kw in expected_keywords
        )
        # 密度：每 500 字出现 1 次关键词为合理
        density = min(1.0, total_hits / max(1, len(response) / 500))
        score += 0.4 * density

    # 3. 回复长度合理性（太短通常相关性低）
    if len(response) > 50:
        score += 0.15
    if len(response) > 200:
        score += 0.15

    return min(1.0, score)


def calc_response_length(response: str, min_len: int = 50, max_len: int = 5000) -> float:
    """回复长度得分"""
    length = len(response)
    if length < min_len:
        return length / min_len
    if length > max_len:
        return max(0, 1 - (length - max_len) / max_len)
    return 1.0


def calc_total_score(metrics: Dict[str, float], criteria: Dict[str, float]) -> float:
    """加权总分"""
    total_weight = sum(criteria.values())
    if total_weight == 0:
        return 0.0
    score = sum(metrics.get(k, 0) * w for k, w in criteria.items())
    return round(score / total_weight, 4)


def grade_from_score(score: float) -> str:
    """分数转等级"""
    if score >= 0.85:
        return "S"
    if score >= 0.75:
        return "A"
    if score >= 0.60:
        return "B"
    if score >= 0.40:
        return "C"
    return "D"


# ─── 评测执行器 ────────────────────────────────────────────────

class EvalRunner:
    """端到端评测执行器"""

    def __init__(self, benchmark_path: str, output_dir: str = "./reports"):
        self.benchmark_path = Path(benchmark_path)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.benchmarks = self._load_benchmarks()
        self.results: List[Dict] = []

    def _load_benchmarks(self) -> List[Dict]:
        """加载评测集"""
        benchmarks = []
        with open(self.benchmark_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    benchmarks.append(json.loads(line))
        return benchmarks

    def run(self, agent: HermesCustomAgent, limit: int = None) -> Dict[str, Any]:
        """
        执行评测

        Args:
            agent: 自定义 Hermes Agent
            limit: 限制评测条数（None = 全部）

        Returns:
            完整评测报告
        """
        benchmarks = self.benchmarks[:limit] if limit else self.benchmarks
        total = len(benchmarks)

        print(f"\n{'=' * 60}")
        print(f"Hermes Agent 评测开始")
        print(f"评测集: {self.benchmark_path.name}")
        print(f"总条数: {total}")
        print(f"模型:   {agent.model}")
        print(f"{'=' * 60}\n")

        for i, bm in enumerate(benchmarks, 1):
            task = bm["task"]
            system_prompt = bm.get("system_prompt", "")
            max_tokens = bm.get("max_tokens", 2000)
            expected_keywords = bm.get("expected_keywords", [])
            criteria = bm.get("evaluation_criteria", {})

            print(f"[{i}/{total}] {bm['id']} | {bm['category']} | {bm['difficulty']}")
            print(f"  任务: {task[:60]}...")

            start_time = time.time()

            # 调用 Agent
            if system_prompt:
                response = agent.chat_with_prompt(
                    system_prompt=system_prompt,
                    user_message=task,
                    max_tokens=max_tokens,
                )
            else:
                response = agent.chat(task)

            elapsed = round(time.time() - start_time, 2)

            # 计算指标
            metrics = {
                "keyword_coverage": calc_keyword_coverage(response, expected_keywords),
                "response_relevance": calc_response_relevance(response, task, expected_keywords),
                "response_length": calc_response_length(response),
            }

            total_score = calc_total_score(metrics, criteria)
            grade = grade_from_score(total_score)

            result = {
                "id": bm["id"],
                "category": bm["category"],
                "difficulty": bm["difficulty"],
                "task": task,
                "response": response,
                "response_preview": response[:200] + ("..." if len(response) > 200 else ""),
                "response_length": len(response),
                "response_time_s": elapsed,
                "metrics": metrics,
                "total_score": total_score,
                "grade": grade,
                "model": agent.model,
            }

            self.results.append(result)

            print(f"  回复: {result['response_preview'][:80]}...")
            print(f"  得分: {total_score:.2f} ({grade}) | 耗时: {elapsed}s | 长度: {len(response)}字")
            print()

        # 生成报告
        report = self._generate_report()
        self._save_report(report)
        self._print_summary(report)

        return report

    def _generate_report(self) -> Dict[str, Any]:
        """生成评测报告"""
        scores = [r["total_score"] for r in self.results]
        grades = [r["grade"] for r in self.results]

        # 分类统计
        category_stats = {}
        for r in self.results:
            cat = r["category"]
            if cat not in category_stats:
                category_stats[cat] = []
            category_stats[cat].append(r["total_score"])

        # 难度统计
        difficulty_stats = {}
        for r in self.results:
            diff = r["difficulty"]
            if diff not in difficulty_stats:
                difficulty_stats[diff] = []
            difficulty_stats[diff].append(r["total_score"])

        avg_score = sum(scores) / len(scores) if scores else 0

        report = {
            "summary": {
                "total_evaluated": len(self.results),
                "average_score": round(avg_score, 4),
                "max_score": max(scores) if scores else 0,
                "min_score": min(scores) if scores else 0,
                "grade_distribution": {
                    "S": grades.count("S"),
                    "A": grades.count("A"),
                    "B": grades.count("B"),
                    "C": grades.count("C"),
                    "D": grades.count("D"),
                },
                "avg_response_time": round(
                    sum(r["response_time_s"] for r in self.results) / len(self.results), 2
                ) if self.results else 0,
            },
            "category_breakdown": {
                cat: {
                    "count": len(scores_list),
                    "average": round(sum(scores_list) / len(scores_list), 4),
                    "max": max(scores_list),
                    "min": min(scores_list),
                }
                for cat, scores_list in category_stats.items()
            },
            "difficulty_breakdown": {
                diff: {
                    "count": len(scores_list),
                    "average": round(sum(scores_list) / len(scores_list), 4),
                    "max": max(scores_list),
                    "min": min(scores_list),
                }
                for diff, scores_list in difficulty_stats.items()
            },
            "detailed_results": self.results,
            "eval_timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        }

        return report

    def _save_report(self, report: Dict):
        """保存报告"""
        timestamp = time.strftime("%Y%m%d_%H%M%S")

        # JSON 完整报告
        json_path = self.output_dir / f"eval_report_{timestamp}.json"
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        print(f"[OK] JSON 报告已保存: {json_path}")

        # 简洁摘要
        summary = {
            "summary": report["summary"],
            "category_breakdown": report["category_breakdown"],
            "difficulty_breakdown": report["difficulty_breakdown"],
            "eval_timestamp": report["eval_timestamp"],
        }
        summary_path = self.output_dir / f"eval_summary_{timestamp}.json"
        with open(summary_path, "w", encoding="utf-8") as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
        print(f"[OK] 摘要已保存: {summary_path}")

    def _print_summary(self, report: Dict):
        """打印可视化摘要"""
        s = report["summary"]

        print(f"\n{'=' * 60}")
        print(f"评测报告摘要")
        print(f"{'=' * 60}")
        print(f"\n评测时间: {report['eval_timestamp']}")
        print(f"评测数量: {s['total_evaluated']}")
        print(f"平均得分: {s['average_score']:.2f}")
        print(f"最高得分: {s['max_score']:.2f}")
        print(f"最低得分: {s['min_score']:.2f}")
        print(f"平均耗时: {s['avg_response_time']}s")

        print(f"\n--- 等级分布 ---")
        for grade in ["S", "A", "B", "C", "D"]:
            count = s["grade_distribution"][grade]
            bar = "#" * count
            print(f"  {grade}: {count:2d} {bar}")

        print(f"\n--- 分类统计 ---")
        for cat, stats in report["category_breakdown"].items():
            print(f"  {cat:12s}: 平均 {stats['average']:.2f} | 数量 {stats['count']}")

        print(f"\n--- 难度统计 ---")
        for diff, stats in report["difficulty_breakdown"].items():
            print(f"  {diff:12s}: 平均 {stats['average']:.2f} | 数量 {stats['count']}")

        print(f"\n{'=' * 60}")


# ─── 主入口 ────────────────────────────────────────────────────

def main():
    import argparse

    parser = argparse.ArgumentParser(description="Hermes Agent 端到端评测")
    parser.add_argument(
        "--benchmark",
        default=str(Path(__file__).parent / "benchmark_20.jsonl"),
        help="评测集文件路径",
    )
    parser.add_argument("--limit", type=int, help="限制评测条数（快速测试）")
    parser.add_argument("--output", default="./reports", help="报告输出目录")
    args = parser.parse_args()

    # 检查评测集是否存在
    if not Path(args.benchmark).exists():
        print(f"[ERROR] 评测集不存在: {args.benchmark}")
        print("请先运行: python generate_benchmark.py")
        sys.exit(1)

    # 初始化 Agent
    try:
        agent = HermesCustomAgent(
            name="Hermes评测Agent",
            system_prompt=(
                "你是一个由 Hermes Agent 框架驱动的智能助手。"
                "你具备信息检索、代码编写、分析推理、角色扮演等能力。"
                "请根据用户的问题给出准确、有条理的中文回答。"
            ),
            temperature=0.7,
            max_tokens=3000,
        )
    except ValueError as e:
        print(f"\n[ERROR] {e}")
        print("\n请先配置 Hermes:")
        print("  python setup_hermes.py --api-key sk-xxxx")
        sys.exit(1)
    except ImportError:
        print("\n[ERROR] 缺少 openai 依赖")
        print("请安装: pip install openai")
        sys.exit(1)

    # 运行评测
    runner = EvalRunner(args.benchmark, args.output)
    report = runner.run(agent, args.limit)

    print(f"\n[DONE] 评测完成！查看报告: {args.output}/")


if __name__ == "__main__":
    main()
