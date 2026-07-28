#!/usr/bin/env python3
"""
评测脚本

执行测评集并生成评测报告
"""

import argparse
import json
import logging
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

from metrics import MetricsCalculator

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class Evaluator:
    """
    评测器
    
    负责执行测评集、计算指标和生成报告
    """
    
    def __init__(self, benchmark_path: str, output_dir: str = "./results"):
        self.benchmark_path = Path(benchmark_path)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.benchmarks = self._load_benchmarks()
        self.results = []
        
        logger.info(f"加载测评集: {len(self.benchmarks)} 条")
    
    def _load_benchmarks(self) -> List[Dict]:
        """加载测评数据"""
        benchmarks = []
        with open(self.benchmark_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line:
                    benchmarks.append(json.loads(line))
        return benchmarks
    
    def evaluate_response(self, benchmark: Dict, response: str) -> Dict[str, Any]:
        """
        评测单个响应
        
        Args:
            benchmark: 测评条目
            response: Agent 响应
            
        Returns:
            评测结果
        """
        start_time = time.time()
        
        # 计算指标
        metrics = MetricsCalculator.calculate_all(response, benchmark)
        
        evaluation = {
            "id": benchmark["id"],
            "category": benchmark["category"],
            "difficulty": benchmark["difficulty"],
            "task": benchmark["task"],
            "response": response,
            "metrics": metrics,
            "evaluation_time": time.time() - start_time
        }
        
        return evaluation
    
    def evaluate_agent(self, agent_fn, limit: Optional[int] = None) -> Dict[str, Any]:
        """
        评测 Agent
        
        Args:
            agent_fn: Agent 调用函数，接收 task 返回 response
            limit: 限制评测条数
            
        Returns:
            完整评测报告
        """
        benchmarks = self.benchmarks[:limit] if limit else self.benchmarks
        
        logger.info(f"开始评测，共 {len(benchmarks)} 条")
        
        evaluations = []
        category_scores = {}
        difficulty_scores = {}
        
        for i, benchmark in enumerate(benchmarks, 1):
            logger.info(f"[{i}/{len(benchmarks)}] 评测: {benchmark['id']} - {benchmark['task'][:50]}...")
            
            try:
                # 调用 Agent
                response = agent_fn(benchmark["task"])
                
                # 评测响应
                evaluation = self.evaluate_response(benchmark, response)
                evaluations.append(evaluation)
                
                # 分类统计
                category = benchmark["category"]
                difficulty = benchmark["difficulty"]
                score = evaluation["metrics"]["total_score"]
                
                if category not in category_scores:
                    category_scores[category] = []
                category_scores[category].append(score)
                
                if difficulty not in difficulty_scores:
                    difficulty_scores[difficulty] = []
                difficulty_scores[difficulty].append(score)
                
            except Exception as e:
                logger.error(f"评测失败 {benchmark['id']}: {str(e)}")
                evaluations.append({
                    "id": benchmark["id"],
                    "error": str(e),
                    "metrics": {"total_score": 0}
                })
        
        # 生成报告
        report = self._generate_report(evaluations, category_scores, difficulty_scores)
        
        # 保存结果
        self._save_results(report, evaluations)
        
        return report
    
    def _generate_report(self, evaluations: List[Dict], category_scores: Dict, difficulty_scores: Dict) -> Dict[str, Any]:
        """生成评测报告"""
        scores = [e["metrics"]["total_score"] for e in evaluations if "metrics" in e]
        
        report = {
            "summary": {
                "total_evaluated": len(evaluations),
                "average_score": sum(scores) / len(scores) if scores else 0,
                "max_score": max(scores) if scores else 0,
                "min_score": min(scores) if scores else 0,
                "median_score": sorted(scores)[len(scores) // 2] if scores else 0
            },
            "category_breakdown": {
                cat: {
                    "count": len(scores_list),
                    "average": sum(scores_list) / len(scores_list),
                    "max": max(scores_list),
                    "min": min(scores_list)
                }
                for cat, scores_list in category_scores.items()
            },
            "difficulty_breakdown": {
                diff: {
                    "count": len(scores_list),
                    "average": sum(scores_list) / len(scores_list),
                    "max": max(scores_list),
                    "min": min(scores_list)
                }
                for diff, scores_list in difficulty_scores.items()
            },
            "detailed_results": evaluations
        }
        
        return report
    
    def _save_results(self, report: Dict, evaluations: List[Dict]):
        """保存评测结果"""
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        
        # 保存完整报告
        report_path = self.output_dir / f"report_{timestamp}.json"
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        # 保存简洁报告
        summary = {
            "summary": report["summary"],
            "category_breakdown": report["category_breakdown"],
            "difficulty_breakdown": report["difficulty_breakdown"]
        }
        summary_path = self.output_dir / f"summary_{timestamp}.json"
        with open(summary_path, 'w', encoding='utf-8') as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
        
        logger.info(f"评测结果已保存: {report_path}")
    
    def print_report(self, report: Dict):
        """打印评测报告"""
        print("\n" + "=" * 60)
        print("评测报告")
        print("=" * 60)
        
        summary = report["summary"]
        print(f"\n总体得分: {summary['average_score']:.3f}")
        print(f"评测数量: {summary['total_evaluated']}")
        print(f"最高得分: {summary['max_score']:.3f}")
        print(f"最低得分: {summary['min_score']:.3f}")
        print(f"中位得分: {summary['median_score']:.3f}")
        
        print("\n分类统计:")
        for cat, stats in report["category_breakdown"].items():
            print(f"  {cat:12s}: 平均 {stats['average']:.3f} | 数量 {stats['count']}")
        
        print("\n难度统计:")
        for diff, stats in report["difficulty_breakdown"].items():
            print(f"  {diff:12s}: 平均 {stats['average']:.3f} | 数量 {stats['count']}")
        
        print("\n" + "=" * 60)


def mock_agent(task: str) -> str:
    """
    模拟 Agent 响应
    
    实际使用时替换为真实的 Agent 调用
    """
    # 根据任务类型返回模拟响应
    if "代码" in task or "函数" in task:
        return f"""```python
# {task[:30]}
def solution():
    # 实现代码
    return "result"
```

这是实现代码，包含注释和错误处理。"""
    elif "研究" in task or "调研" in task:
        return f"""# 研究报告

## 主要发现
- 发现了重要的技术趋势
- 分析了多个方案

## 结论
建议采用最佳实践方案。"""
    else:
        return f"""## 分析结果

针对 '{task[:50]}' 的分析：

1. 关键点一
2. 关键点二
3. 建议方案

## 总结
结论和建议。"""


def main():
    parser = argparse.ArgumentParser(description="Agent 评测工具")
    parser.add_argument("--benchmark", required=True, help="测评集文件路径")
    parser.add_argument("--output", default="./results", help="输出目录")
    parser.add_argument("--limit", type=int, help="限制评测条数")
    parser.add_argument("--mock", action="store_true", help="使用模拟 Agent")
    
    args = parser.parse_args()
    
    # 创建评测器
    evaluator = Evaluator(args.benchmark, args.output)
    
    # 选择 Agent
    if args.mock:
        agent_fn = mock_agent
    else:
        # 这里可以接入真实的 Agent
        # from agent_orchestration.orchestrator import create_default_orchestrator
        # orchestrator = create_default_orchestrator()
        # agent_fn = lambda task: asyncio.run(orchestrator.execute("sequential", task))
        print("请使用 --mock 参数进行测试，或修改代码接入真实 Agent")
        return
    
    # 执行评测
    report = evaluator.evaluate_agent(agent_fn, args.limit)
    
    # 打印报告
    evaluator.print_report(report)


if __name__ == "__main__":
    main()
