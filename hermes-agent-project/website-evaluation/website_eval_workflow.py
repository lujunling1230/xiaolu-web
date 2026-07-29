"""
网站评测工作流编排
基于 Hermes Agent 编排模式，协调三个 Agent 并行/顺序执行评测
"""

import asyncio
import sys
import os
import time
from typing import Dict, List, Optional

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from website_metrics import WebsiteMetricsCalculator, WorkEvaluation, DIMENSION_WEIGHTS, GRADE_LABELS
from agents.user_simulation_agent import UserSimulationAgent
from agents.quality_review_agent import QualityReviewAgent
from agents.ai_capability_agent import AICapabilityAgent


class WebsiteEvalWorkflow:
    """网站评测工作流：协调三个 Agent 完成五维评测"""

    def __init__(self, mock: bool = False, headless: bool = True):
        self.mock = mock
        self.headless = headless
        self.user_agent = UserSimulationAgent(mock=mock, headless=headless)
        self.quality_agent = QualityReviewAgent(mock=mock, headless=headless)
        self.ai_agent = AICapabilityAgent(mock=mock)

    async def evaluate_single(self, benchmark_case: Dict) -> WorkEvaluation:
        """评测单个作品

        工作流：
        1. 用户模拟 Agent + AI能力 Agent 并行执行（互相独立）
        2. 质量审查 Agent 串行执行（依赖用户 Agent 的页面状态）
        3. 汇总五维数据，计算总分
        """
        work_id = benchmark_case["work_id"]
        work_name = benchmark_case["work_name"]
        url = benchmark_case["url"]
        work_type = benchmark_case.get("work_type", "")

        print(f"\n{'='*60}")
        print(f"  评测作品: {work_name} ({work_id})")
        print(f"  URL: {url}")
        print(f"  类型: {work_type}")
        print(f"{'='*60}")

        start_time = time.time()

        # ─── Phase 1: 并行执行用户模拟 + AI 能力测试 ───
        print("\n[Phase 1] 用户模拟 + AI 能力测试 (并行)...")

        user_task = self.user_agent.run(benchmark_case)
        ai_task = self.ai_agent.run(benchmark_case)

        user_result, ai_result = await asyncio.gather(user_task, ai_task, return_exceptions=True)

        # 处理异常
        if isinstance(user_result, Exception):
            print(f"  [警告] 用户模拟 Agent 出错: {user_result}")
            user_result = {"interaction_data": {}, "visual_data": {}}
        if isinstance(ai_result, Exception):
            print(f"  [警告] AI 能力 Agent 出错: {ai_result}")
            ai_result = {"ai_data": {"has_ai_feature": False}, "emotion_data": {}}

        print(f"  用户模拟: {len(self.user_agent.results)} 步交互完成")
        print(f"  AI 测试: {'有 AI 功能' if ai_result.get('ai_data', {}).get('has_ai_feature') else '无 AI 功能'}")

        # ─── Phase 2: 质量审查（串行）───
        print("\n[Phase 2] 质量审查 Agent...")
        quality_result = await self.quality_agent.run(benchmark_case, user_result)
        print(f"  性能数据采集完成")

        # ─── Phase 3: 汇总计算 ───
        print("\n[Phase 3] 汇总五维评分...")

        interaction_data = user_result.get("interaction_data", {})
        visual_data = user_result.get("visual_data", {})
        ai_data = ai_result.get("ai_data", {"has_ai_feature": False})
        perf_data = quality_result.get("perf_data", {})
        emotion_data = ai_result.get("emotion_data", {})

        evaluation = WebsiteMetricsCalculator.calculate_all(
            work_id=work_id,
            work_name=work_name,
            url=url,
            interaction_data=interaction_data,
            ai_data=ai_data,
            visual_data=visual_data,
            perf_data=perf_data,
            emotion_data=emotion_data,
        )

        elapsed = time.time() - start_time
        print(f"\n  总分: {evaluation.total_score:.1f} ({evaluation.grade} - {GRADE_LABELS.get(evaluation.grade, '')})")
        print(f"  耗时: {elapsed:.1f}s")

        for d in evaluation.dimensions:
            print(f"    {d.dimension}: {d.score:.1f}")

        if evaluation.strengths:
            print(f"\n  优点:")
            for s in evaluation.strengths:
                print(f"    + {s}")

        if evaluation.suggestions:
            print(f"\n  改进建议:")
            for s in evaluation.suggestions:
                print(f"    - {s}")

        return evaluation

    async def evaluate_all(self, benchmark_cases: List[Dict]) -> List[WorkEvaluation]:
        """评测全部作品"""
        evaluations = []
        total = len(benchmark_cases)

        for i, case in enumerate(benchmark_cases, 1):
            print(f"\n[{i}/{total}] 开始评测...")
            evaluation = await self.evaluate_single(case)
            evaluations.append(evaluation)

        return evaluations

    def generate_summary_report(self, evaluations: List[WorkEvaluation]) -> Dict:
        """生成汇总报告"""
        if not evaluations:
            return {}

        total_scores = [e.total_score for e in evaluations]
        avg_score = sum(total_scores) / len(total_scores)
        max_score = max(total_scores)
        min_score = min(total_scores)

        # 各维度平均分
        dim_avgs = {}
        for dim in DIMENSION_WEIGHTS:
            scores = [e.total_score for e in evaluations]  # 简化
            dim_scores = []
            for e in evaluations:
                for d in e.dimensions:
                    if d.dimension == dim:
                        dim_scores.append(d.score)
            if dim_scores:
                dim_avgs[dim] = round(sum(dim_scores) / len(dim_scores), 1)

        # 等级分布
        grade_dist = {}
        for e in evaluations:
            grade_dist[e.grade] = grade_dist.get(e.grade, 0) + 1

        # 排名
        ranked = sorted(evaluations, key=lambda e: e.total_score, reverse=True)

        return {
            "total_works": len(evaluations),
            "average_score": round(avg_score, 1),
            "max_score": round(max_score, 1),
            "min_score": round(min_score, 1),
            "dimension_averages": dim_avgs,
            "grade_distribution": grade_dist,
            "ranking": [
                {
                    "rank": i + 1,
                    "work_name": e.work_name,
                    "work_id": e.work_id,
                    "score": round(e.total_score, 1),
                    "grade": e.grade,
                }
                for i, e in enumerate(ranked)
            ],
            "overall_strengths": self._extract_overall_strengths(evaluations),
            "overall_suggestions": self._extract_overall_suggestions(evaluations),
        }

    def _extract_overall_strengths(self, evaluations: List[WorkEvaluation]) -> List[str]:
        """提取全局优点"""
        strength_counts = {}
        for e in evaluations:
            for s in e.strengths:
                key = s.split("：")[0] if "：" in s else s
                strength_counts[key] = strength_counts.get(key, 0) + 1

        return [f"{k} (出现在 {v} 个作品中)" for k, v in
                sorted(strength_counts.items(), key=lambda x: -x[1])[:3]]

    def _extract_overall_suggestions(self, evaluations: List[WorkEvaluation]) -> List[str]:
        """提取全局建议"""
        suggestion_counts = {}
        for e in evaluations:
            for s in e.suggestions:
                key = s.split("]")[1].strip() if "]" in s else s
                suggestion_counts[key] = suggestion_counts.get(key, 0) + 1

        return [f"{k} (影响 {v} 个作品)" for k, v in
                sorted(suggestion_counts.items(), key=lambda x: -x[1])[:3]]
