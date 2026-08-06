#!/usr/bin/env python3
"""
Hermes 自动评测系统 — 20 条评测集运行器
针对 benchmark_20.jsonl 格式，真实调用网站 API 与页面进行评测

用法:
  python run_benchmark_20.py
  python run_benchmark_20.py --benchmark benchmark_20.jsonl --output reports/
  python run_benchmark_20.py --target xiaoye
  python run_benchmark_20.py --limit 5
"""

import argparse
import asyncio
import json
import os
import sys
import time
from datetime import datetime
from typing import Dict, List, Optional, Any

# ─── 依赖检查 ───
try:
    import aiohttp
except ImportError:
    print("缺少 aiohttp，正在安装...")
    os.system(f"{sys.executable} -m pip install aiohttp -q")
    import aiohttp


# ═══════════════════════════════════════════════════
#  评测结果数据结构
# ═══════════════════════════════════════════════════

class TestCaseResult:
    """单条测试用例结果"""

    def __init__(self, case: Dict):
        self.id: str = case["id"]
        self.work_id: str = case["work_id"]
        self.work_name: str = case["work_name"]
        self.category: str = case["category"]
        self.difficulty: str = case["difficulty"]
        self.test_type: str = case["test_type"]
        self.url: str = case.get("url", "")
        self.api_endpoint: Optional[str] = case.get("api_endpoint")
        self.request: Optional[Dict] = case.get("request")
        self.expected_keywords: List[str] = case.get("expected_keywords", [])
        self.expected_fields: List[str] = case.get("expected_fields", [])
        self.max_response_time_ms: int = case.get("max_response_time_ms", 10000)
        self.criteria: Dict = case.get("evaluation_criteria", {})

        # 运行时数据
        self.status: str = "pending"          # pending / passed / failed / error
        self.response_time_ms: float = 0
        self.http_status: int = 0
        self.response_body: Any = None
        self.response_text: str = ""
        self.score: float = 0.0               # 0~100
        self.sub_scores: Dict[str, float] = {}
        self.details: List[str] = []
        self.error_message: str = ""

    @property
    def passed(self) -> bool:
        return self.status == "passed"

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "work_id": self.work_id,
            "work_name": self.work_name,
            "category": self.category,
            "difficulty": self.difficulty,
            "test_type": self.test_type,
            "status": self.status,
            "score": round(self.score, 1),
            "response_time_ms": round(self.response_time_ms, 0),
            "http_status": self.http_status,
            "sub_scores": {k: round(v, 1) for k, v in self.sub_scores.items()},
            "details": self.details,
            "error_message": self.error_message,
            "request_preview": _truncate_json(self.request, 200) if self.request else None,
            "response_preview": _truncate_str(self.response_text, 300),
        }


def _truncate_json(obj: Any, max_len: int = 200) -> str:
    s = json.dumps(obj, ensure_ascii=False)
    return s[:max_len] + "..." if len(s) > max_len else s


def _truncate_str(s: str, max_len: int = 300) -> str:
    if not s:
        return ""
    s = s.strip()
    return s[:max_len] + "..." if len(s) > max_len else s


# ═══════════════════════════════════════════════════
#  评测引擎
# ═══════════════════════════════════════════════════

class HermesBenchmarkEngine:
    """Hermes 评测引擎：执行 API 与页面测试，计算多维评分"""

    BASE_URL = "https://www.xiaoluweb.com"
    TIMEOUT = aiohttp.ClientTimeout(total=30)

    # 分类中文映射
    CATEGORY_LABELS = {
        "ai_knowledge": "AI 知识问答",
        "ai_multi_turn": "AI 多轮对话",
        "ai_edge_case": "AI 边界场景",
        "ai_chat": "AI 库存助手",
        "ai_recommend": "AI 智能推荐",
        "ai_character": "AI 角色扮演",
        "ai_emotional": "AI 情感陪伴",
        "ai_consult": "AI 专业咨询",
        "page_accessibility": "页面可访问性",
        "page_content": "页面内容质量",
        "page_performance": "页面性能",
    }

    DIFFICULTY_LABELS = {
        "easy": "简单",
        "medium": "中等",
        "hard": "困难",
    }

    def __init__(self):
        self.results: List[TestCaseResult] = []

    async def run_api_test(self, case: Dict, session: aiohttp.ClientSession) -> TestCaseResult:
        """执行 API 测试用例"""
        result = TestCaseResult(case)
        endpoint = case["api_endpoint"]
        full_url = f"{self.BASE_URL}{endpoint}"
        request_body = case.get("request", {})

        result.details.append(f"请求: POST {full_url}")
        result.details.append(f"参数: {_truncate_json(request_body, 150)}")

        try:
            start = time.time()
            async with session.post(full_url, json=request_body) as resp:
                elapsed = (time.time() - start) * 1000
                result.response_time_ms = elapsed
                result.http_status = resp.status

                try:
                    resp_json = await resp.json()
                    result.response_body = resp_json
                    result.response_text = json.dumps(resp_json, ensure_ascii=False)
                except Exception:
                    result.response_text = await resp.text()

            # ─── 评分 ───
            self._evaluate_api_result(result, case)
            result.details.append(f"响应耗时: {elapsed:.0f}ms (限制 {result.max_response_time_ms}ms)")

        except asyncio.TimeoutError:
            result.status = "error"
            result.error_message = f"请求超时 ({result.max_response_time_ms}ms)"
            result.score = 0
        except Exception as e:
            result.status = "error"
            result.error_message = str(e)
            result.score = 0

        return result

    async def run_page_test(self, case: Dict, session: aiohttp.ClientSession) -> TestCaseResult:
        """执行页面测试用例"""
        result = TestCaseResult(case)
        url = case["url"]

        result.details.append(f"请求: GET {url}")

        try:
            start = time.time()
            async with session.get(url) as resp:
                elapsed = (time.time() - start) * 1000
                result.response_time_ms = elapsed
                result.http_status = resp.status
                result.response_text = await resp.text()

            result.details.append(f"HTTP 状态: {resp.status}")
            result.details.append(f"响应耗时: {elapsed:.0f}ms (限制 {result.max_response_time_ms}ms)")

            # ─── 评分 ───
            self._evaluate_page_result(result, case)

        except asyncio.TimeoutError:
            result.status = "error"
            result.error_message = "页面请求超时"
            result.score = 0
        except Exception as e:
            result.status = "error"
            result.error_message = str(e)
            result.score = 0

        return result

    # ─────────── 评分逻辑 ───────────

    def _evaluate_api_result(self, result: TestCaseResult, case: Dict):
        """API 测试评分"""
        criteria = result.criteria
        text = result.response_text or ""
        body = result.response_body
        sub_scores = {}

        # 1. 关键词覆盖率
        if "keyword_coverage" in criteria:
            weight = criteria["keyword_coverage"]
            keywords = result.expected_keywords
            if keywords:
                hit = sum(1 for kw in keywords if kw in text)
                ratio = hit / len(keywords)
                sub_scores["keyword_coverage"] = ratio * 100
                result.details.append(f"关键词命中: {hit}/{len(keywords)} ({ratio:.0%})")
            else:
                sub_scores["keyword_coverage"] = 100

        # 2. 字段完整性（针对 JSON 响应）
        if "field_coverage" in criteria:
            weight = criteria["field_coverage"]
            fields = result.expected_fields
            if fields and isinstance(body, dict):
                # 深度搜索 JSON 中的字段
                json_str = json.dumps(body, ensure_ascii=False)
                hit = sum(1 for f in fields if f in json_str)
                ratio = hit / len(fields)
                sub_scores["field_coverage"] = ratio * 100
                result.details.append(f"字段完整: {hit}/{len(fields)} ({ratio:.0%})")
            elif fields and isinstance(body, str):
                hit = sum(1 for f in fields if f in body)
                ratio = hit / len(fields)
                sub_scores["field_coverage"] = ratio * 100
                result.details.append(f"字段完整: {hit}/{len(fields)} ({ratio:.0%})")
            else:
                sub_scores["field_coverage"] = 100

        # 3. 响应相关性（通过 HTTP 状态 + 内容长度综合判断）
        if "response_relevance" in criteria:
            weight = criteria["response_relevance"]
            score = 0
            if result.http_status == 200:
                score += 50
            if len(text) > 20:
                score += 30
            if not any(err in text.lower() for err in ["error", "错误", "失败"]):
                score += 20
            sub_scores["response_relevance"] = score
            result.details.append(f"响应相关性: {score}/100")

        # 4. 响应长度合理性
        if "response_length" in criteria:
            weight = criteria["response_length"]
            length = len(text)
            if length < 5:
                score = 10
            elif length < 20:
                score = 40
            elif length < 100:
                score = 70
            elif length < 2000:
                score = 100
            else:
                score = 80  # 过长适当扣分
            sub_scores["response_length"] = score
            result.details.append(f"响应长度: {length} 字符 → {score}/100")

        # 5. 语气匹配度（角色扮演场景）
        if "tone_match" in criteria:
            weight = criteria["tone_match"]
            keywords = result.expected_keywords
            if keywords:
                hit = sum(1 for kw in keywords if kw in text)
                ratio = hit / len(keywords)
                sub_scores["tone_match"] = ratio * 100
                result.details.append(f"语气匹配: {hit}/{len(keywords)} ({ratio:.0%})")
            else:
                sub_scores["tone_match"] = 70

        # 6. 页面可访问性（API 层面也检查）
        if "page_accessible" in criteria:
            weight = criteria["page_accessible"]
            score = 100 if result.http_status == 200 else 0
            sub_scores["page_accessible"] = score
            result.details.append(f"接口可用: {'是' if score == 100 else '否'}")

        # ─── 计算加权总分 ───
        total_weight = sum(criteria.values())
        if total_weight > 0 and sub_scores:
            result.score = sum(
                sub_scores.get(k, 0) * (criteria.get(k, 0) / total_weight)
                for k in sub_scores
            )
        else:
            result.score = 50 if result.http_status == 200 else 0

        result.sub_scores = sub_scores

        # ─── 判定通过/失败 ───
        if result.http_status != 200:
            result.status = "failed"
            result.details.append(f"HTTP {result.http_status} 非预期状态码")
        elif result.score >= 60:
            result.status = "passed"
        else:
            result.status = "failed"

        # 响应时间检查
        if result.response_time_ms > result.max_response_time_ms:
            result.score *= 0.8  # 超时扣 20%
            result.details.append(f"⚠ 响应超时，扣分 20%")

    def _evaluate_page_result(self, result: TestCaseResult, case: Dict):
        """页面测试评分"""
        criteria = result.criteria
        text = result.response_text or ""
        sub_scores = {}

        # 1. 页面可访问性
        if "page_accessible" in criteria:
            weight = criteria["page_accessible"]
            score = 100 if result.http_status == 200 else 0
            sub_scores["page_accessible"] = score
            result.details.append(f"页面可访问: {'是' if score == 100 else '否'}")

        # 2. 关键词覆盖（页面内容）
        if "keyword_coverage" in criteria:
            weight = criteria["keyword_coverage"]
            keywords = result.expected_keywords
            if keywords:
                hit = sum(1 for kw in keywords if kw in text)
                ratio = hit / len(keywords)
                sub_scores["keyword_coverage"] = ratio * 100
                result.details.append(f"内容关键词: {hit}/{len(keywords)} ({ratio:.0%})")
            else:
                sub_scores["keyword_coverage"] = 100

        # 3. 视口/响应式（通过 HTML 标签判断）
        if "has_viewport" in criteria:
            weight = criteria["has_viewport"]
            has_vp = "viewport" in text.lower() or "width=device-width" in text.lower()
            score = 100 if has_vp else 50
            sub_scores["has_viewport"] = score
            result.details.append(f"响应式视口: {'有' if has_vp else '未检测到'}")

        # 4. 响应速度
        if "response_speed" in criteria:
            weight = criteria["response_speed"]
            if result.response_time_ms < 1000:
                score = 100
            elif result.response_time_ms < 2000:
                score = 80
            elif result.response_time_ms < 3000:
                score = 60
            else:
                score = 30
            sub_scores["response_speed"] = score
            result.details.append(f"加载速度: {result.response_time_ms:.0f}ms → {score}/100")

        # ─── 计算加权总分 ───
        total_weight = sum(criteria.values())
        if total_weight > 0 and sub_scores:
            result.score = sum(
                sub_scores.get(k, 0) * (criteria.get(k, 0) / total_weight)
                for k in sub_scores
            )
        else:
            result.score = 100 if result.http_status == 200 else 0

        result.sub_scores = sub_scores

        # ─── 判定 ───
        if result.http_status != 200:
            result.status = "failed"
        elif result.score >= 60:
            result.status = "passed"
        else:
            result.status = "failed"

        if result.response_time_ms > result.max_response_time_ms:
            result.score *= 0.8
            result.details.append("⚠ 加载超时，扣分 20%")


# ═══════════════════════════════════════════════════
#  报告生成
# ═══════════════════════════════════════════════════

def generate_report(results: List[TestCaseResult], output_dir: str) -> Dict:
    """生成评测报告"""
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    total = len(results)
    passed = sum(1 for r in results if r.passed)
    failed = sum(1 for r in results if r.status == "failed")
    errors = sum(1 for r in results if r.status == "error")
    avg_score = sum(r.score for r in results) / total if total else 0
    avg_time = sum(r.response_time_ms for r in results) / total if total else 0

    # 按作品分组
    work_groups: Dict[str, List[TestCaseResult]] = {}
    for r in results:
        work_groups.setdefault(r.work_id, []).append(r)

    work_summaries = []
    for wid, group in work_groups.items():
        work_summaries.append({
            "work_id": wid,
            "work_name": group[0].work_name,
            "test_count": len(group),
            "passed": sum(1 for g in group if g.passed),
            "avg_score": round(sum(g.score for g in group) / len(group), 1),
            "avg_time_ms": round(sum(g.response_time_ms for g in group) / len(group), 0),
        })

    # 按分类分组
    category_groups: Dict[str, List[TestCaseResult]] = {}
    for r in results:
        cat = r.category
        category_groups.setdefault(cat, []).append(r)

    category_summaries = []
    for cat, group in category_groups.items():
        category_summaries.append({
            "category": cat,
            "category_label": HermesBenchmarkEngine.CATEGORY_LABELS.get(cat, cat),
            "test_count": len(group),
            "passed": sum(1 for g in group if g.passed),
            "avg_score": round(sum(g.score for g in group) / len(group), 1),
        })

    # 按难度分组
    difficulty_groups: Dict[str, List[TestCaseResult]] = {}
    for r in results:
        difficulty_groups.setdefault(r.difficulty, []).append(r)

    difficulty_summaries = []
    for diff in ["easy", "medium", "hard"]:
        if diff in difficulty_groups:
            group = difficulty_groups[diff]
            difficulty_summaries.append({
                "difficulty": diff,
                "difficulty_label": HermesBenchmarkEngine.DIFFICULTY_LABELS.get(diff, diff),
                "test_count": len(group),
                "passed": sum(1 for g in group if g.passed),
                "pass_rate": round(sum(1 for g in group if g.passed) / len(group) * 100, 1),
            })

    report = {
        "timestamp": timestamp,
        "system": "Hermes 自动评测系统",
        "benchmark": "benchmark_20.jsonl",
        "summary": {
            "total": total,
            "passed": passed,
            "failed": failed,
            "errors": errors,
            "pass_rate": round(passed / total * 100, 1) if total else 0,
            "avg_score": round(avg_score, 1),
            "avg_response_time_ms": round(avg_time, 0),
        },
        "work_summaries": sorted(work_summaries, key=lambda x: -x["avg_score"]),
        "category_summaries": sorted(category_summaries, key=lambda x: -x["avg_score"]),
        "difficulty_summaries": difficulty_summaries,
        "test_cases": [r.to_dict() for r in results],
    }

    # 保存 JSON 报告
    json_path = os.path.join(output_dir, f"benchmark20_report_{timestamp}.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print(f"\nJSON 报告已保存: {json_path}")

    return report


def print_console_report(report: Dict):
    """控制台打印评测报告"""
    s = report["summary"]

    print(f"\n{'═' * 60}")
    print(f"  Hermes 自动评测系统 — 20 条评测集报告")
    print(f"{'═' * 60}")

    print(f"\n  评测总数: {s['total']}")
    print(f"  通过: {s['passed']}  失败: {s['failed']}  错误: {s['errors']}")
    print(f"  通过率: {s['pass_rate']}%")
    print(f"  平均分: {s['avg_score']}/100")
    print(f"  平均响应时间: {s['avg_response_time_ms']}ms")

    # 按作品
    print(f"\n{'─' * 60}")
    print(f"  按作品汇总:")
    for w in report["work_summaries"]:
        print(f"    {w['work_name']:<16} {w['passed']}/{w['test_count']} 通过  "
              f"均分 {w['avg_score']}  均时 {w['avg_time_ms']}ms")

    # 按分类
    print(f"\n{'─' * 60}")
    print(f"  按分类汇总:")
    for c in report["category_summaries"]:
        print(f"    {c['category_label']:<14} {c['passed']}/{c['test_count']} 通过  "
              f"均分 {c['avg_score']}")

    # 按难度
    print(f"\n{'─' * 60}")
    print(f"  按难度汇总:")
    for d in report["difficulty_summaries"]:
        print(f"    {d['difficulty_label']:<6} {d['passed']}/{d['test_count']} 通过  "
              f"通过率 {d['pass_rate']}%")

    # 逐条详情
    print(f"\n{'─' * 60}")
    print(f"  逐条详情:")
    for tc in report["test_cases"]:
        icon = "✓" if tc["status"] == "passed" else "✗" if tc["status"] == "failed" else "!"
        print(f"    {icon} [{tc['id']}] {tc['work_name']} · {tc['category']}")
        print(f"       分数: {tc['score']}  耗时: {tc['response_time_ms']}ms  HTTP: {tc['http_status']}")
        if tc.get("error_message"):
            print(f"       错误: {tc['error_message']}")
        for d in tc.get("details", []):
            print(f"       {d}")
        if tc.get("response_preview"):
            print(f"       响应预览: {tc['response_preview']}")

    print(f"\n{'═' * 60}")


# ═══════════════════════════════════════════════════
#  主入口
# ═══════════════════════════════════════════════════

def load_benchmark(filepath: str) -> List[Dict]:
    """加载 JSONL 评测集"""
    cases = []
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                cases.append(json.loads(line))
    return cases


async def main():
    parser = argparse.ArgumentParser(description="Hermes 自动评测系统 — 20 条评测集")
    parser.add_argument("--benchmark", default="benchmark_20.jsonl", help="评测集文件路径")
    parser.add_argument("--output", default="reports/", help="报告输出目录")
    parser.add_argument("--target", default=None, help="只评测指定 work_id")
    parser.add_argument("--limit", type=int, default=0, help="限制评测数量")
    args = parser.parse_args()

    # 加载评测集
    script_dir = os.path.dirname(os.path.abspath(__file__))
    benchmark_path = os.path.join(script_dir, args.benchmark) if not os.path.isabs(args.benchmark) else args.benchmark

    print(f"Hermes 自动评测系统")
    print(f"评测集: {benchmark_path}")
    cases = load_benchmark(benchmark_path)
    print(f"共加载 {len(cases)} 条测试用例")

    # 筛选
    if args.target:
        cases = [c for c in cases if c["work_id"] == args.target]
        print(f"筛选 work_id={args.target}: {len(cases)} 条")
    if args.limit > 0:
        cases = cases[:args.limit]
        print(f"限制前 {len(cases)} 条")

    # 执行评测
    engine = HermesBenchmarkEngine()
    results: List[TestCaseResult] = []

    print(f"\n开始评测（并发度: 3）...\n")

    connector = aiohttp.TCPConnector(limit=5, force_close=True)
    async with aiohttp.ClientSession(timeout=engine.TIMEOUT, connector=connector) as session:

        # 信号量控制并发
        sem = asyncio.Semaphore(3)

        async def run_one(case: Dict) -> TestCaseResult:
            async with sem:
                idx = len(results) + 1
                total = len(cases)
                print(f"[{idx}/{total}] {case['id']} → {case['work_name']} · {case['category']}")

                if case["test_type"] == "api":
                    r = await engine.run_api_test(case, session)
                else:
                    r = await engine.run_page_test(case, session)

                icon = "✓" if r.passed else "✗"
                print(f"       {icon} 分数 {r.score:.0f}  耗时 {r.response_time_ms:.0f}ms  HTTP {r.http_status}")
                results.append(r)
                return r

        tasks = [run_one(c) for c in cases]
        await asyncio.gather(*tasks)

    # 按原始顺序排序
    order = {c["id"]: i for i, c in enumerate(cases)}
    results.sort(key=lambda r: order.get(r.id, 999))

    # 生成报告
    output_dir = os.path.join(script_dir, args.output)
    report = generate_report(results, output_dir)
    print_console_report(report)


if __name__ == "__main__":
    asyncio.run(main())
