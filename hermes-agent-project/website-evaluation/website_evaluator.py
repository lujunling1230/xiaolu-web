#!/usr/bin/env python3
"""
网站作品智能评测器 — 主入口
基于 Hermes Agent 编排框架，对小鹿作品集进行五维评测

用法:
  # 评测全部作品（Mock 模式，不实际访问网站）
  python website_evaluator.py --benchmark website_benchmark.jsonl --mock

  # 评测全部作品（真实模式，需要 Playwright）
  python website_evaluator.py --benchmark website_benchmark.jsonl --output reports/

  # 评测单个作品
  python website_evaluator.py --benchmark website_benchmark.jsonl --target xiaoye

  # 限制评测数量
  python website_evaluator.py --benchmark website_benchmark.jsonl --limit 3 --mock
"""

import argparse
import asyncio
import json
import os
import sys
import time
from datetime import datetime
from typing import Dict, List

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from website_eval_workflow import WebsiteEvalWorkflow
from website_metrics import DIMENSION_WEIGHTS, GRADE_LABELS


def load_benchmark(filepath: str) -> List[Dict]:
    """加载 benchmark.jsonl"""
    cases = []
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                cases.append(json.loads(line))
    return cases


def save_report(evaluations: List, summary: Dict, output_dir: str):
    """保存评测报告"""
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # 完整报告
    full_report = {
        "timestamp": timestamp,
        "total_works": len(evaluations),
        "evaluations": [e.to_dict() for e in evaluations],
        "summary": summary,
    }
    full_path = os.path.join(output_dir, f"report_{timestamp}.json")
    with open(full_path, "w", encoding="utf-8") as f:
        json.dump(full_report, f, ensure_ascii=False, indent=2)
    print(f"\n完整报告已保存: {full_path}")

    # 简洁报告
    simple_report = {
        "timestamp": timestamp,
        "average_score": summary.get("average_score", 0),
        "ranking": summary.get("ranking", []),
        "grade_distribution": summary.get("grade_distribution", {}),
    }
    simple_path = os.path.join(output_dir, f"summary_{timestamp}.json")
    with open(simple_path, "w", encoding="utf-8") as f:
        json.dump(simple_report, f, ensure_ascii=False, indent=2)
    print(f"简洁报告已保存: {simple_path}")


def print_console_summary(evaluations: List, summary: Dict):
    """控制台打印汇总"""
    print(f"\n{'='*60}")
    print(f"  评测汇总报告")
    print(f"{'='*60}")

    print(f"\n  评测作品数: {summary.get('total_works', 0)}")
    print(f"  平均分: {summary.get('average_score', 0)}")
    print(f"  最高分: {summary.get('max_score', 0)}")
    print(f"  最低分: {summary.get('min_score', 0)}")

    # 等级分布
    print(f"\n  等级分布:")
    for grade in ["S", "A", "B", "C", "D"]:
        count = summary.get("grade_distribution", {}).get(grade, 0)
        if count > 0:
            print(f"    {grade} ({GRADE_LABELS.get(grade, '')}): {count} 个")

    # 维度平均
    print(f"\n  各维度平均分:")
    dim_labels = {
        "functionality": "功能性",
        "ai_capability": "AI 能力",
        "visual_interaction": "视觉交互",
        "performance": "性能",
        "emotional_experience": "情感体验",
    }
    for dim, label in dim_labels.items():
        avg = summary.get("dimension_averages", {}).get(dim, 0)
        weight = DIMENSION_WEIGHTS.get(dim, 0)
        print(f"    {label} (权重 {weight:.0%}): {avg}")

    # 排名
    print(f"\n  作品排名:")
    for item in summary.get("ranking", []):
        print(f"    #{item['rank']} {item['work_name']} — {item['score']} ({item['grade']})")

    # 全局优点
    if summary.get("overall_strengths"):
        print(f"\n  全局优点:")
        for s in summary["overall_strengths"]:
            print(f"    + {s}")

    # 全局建议
    if summary.get("overall_suggestions"):
        print(f"\n  全局改进建议:")
        for s in summary["overall_suggestions"]:
            print(f"    - {s}")

    print(f"\n{'='*60}")


async def main():
    parser = argparse.ArgumentParser(description="网站作品智能评测器")
    parser.add_argument("--benchmark", required=True, help="benchmark.jsonl 文件路径")
    parser.add_argument("--output", default="reports/", help="报告输出目录")
    parser.add_argument("--target", default=None, help="只评测指定 work_id 的作品")
    parser.add_argument("--limit", type=int, default=0, help="限制评测数量 (0=全部)")
    parser.add_argument("--mock", action="store_true", help="Mock 模式（不实际访问网站）")
    parser.add_argument("--headless", default=True, help="浏览器无头模式")

    args = parser.parse_args()

    # 加载 benchmark
    print(f"加载评测用例: {args.benchmark}")
    cases = load_benchmark(args.benchmark)
    print(f"共 {len(cases)} 个作品待评测")

    # 筛选
    if args.target:
        cases = [c for c in cases if c["work_id"] == args.target]
        if not cases:
            print(f"未找到 work_id={args.target} 的用例")
            return
        print(f"筛选后: {len(cases)} 个")

    if args.limit > 0:
        cases = cases[:args.limit]
        print(f"限制评测: 前 {len(cases)} 个")

    mode_label = "Mock（模拟）" if args.mock else "真实访问"
    print(f"运行模式: {mode_label}")
    print(f"\n开始评测...")

    # 执行评测
    workflow = WebsiteEvalWorkflow(mock=args.mock, headless=args.headless)
    start = time.time()
    evaluations = await workflow.evaluate_all(cases)
    elapsed = time.time() - start

    # 生成汇总
    summary = workflow.generate_summary_report(evaluations)

    # 打印控制台汇总
    print_console_summary(evaluations, summary)
    print(f"\n总耗时: {elapsed:.1f}s")

    # 保存报告
    save_report(evaluations, summary, args.output)


if __name__ == "__main__":
    asyncio.run(main())
