"""
质量审查 Agent
审查页面性能、可访问性、代码质量，生成性能维度评分
"""

import asyncio
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from typing import Dict, List
from browser.page_interactor import PageInteractor, MockPageInteractor


class QualityReviewAgent:
    """质量审查 Agent：专注于性能和技术质量"""

    def __init__(self, mock: bool = False, headless: bool = True):
        self.mock = mock
        self.headless = headless
        self.interactor = MockPageInteractor() if mock else PageInteractor(headless=headless)

    async def run(self, benchmark_case: Dict, user_agent_data: Dict = None) -> Dict:
        """执行质量审查

        Args:
            benchmark_case: 评测用例
            user_agent_data: 用户模拟 Agent 已采集的数据（避免重复采集）

        Returns:
            perf_data: 性能数据
            visual_supplement: 视觉补充数据（如果有）
        """
        url = benchmark_case["url"]

        if self.mock:
            # Mock 模式：使用用户 Agent 的数据或生成模拟数据
            if user_agent_data and "visual_data" in user_agent_data:
                from website_metrics import generate_mock_data
                mock_data = generate_mock_data(benchmark_case.get("work_type", ""))
                return {
                    "perf_data": mock_data["perf_data"],
                }
            from website_metrics import generate_mock_data
            mock_data = generate_mock_data(benchmark_case.get("work_type", ""))
            return {"perf_data": mock_data["perf_data"]}

        await self.interactor.setup()
        try:
            # 导航并采集性能指标
            nav_result = await self.interactor.navigate(url)
            self.interactor.results.append(nav_result)

            # 从导航结果提取性能数据
            perf_data = self.interactor.collect_perf_data()

            # 补充采集
            if not perf_data:
                perf_data = {
                    "first_contentful_paint_ms": 2500,
                    "total_resource_kb": 1200,
                    "has_service_worker": False,
                    "sw_detail": "",
                    "api_response_ms": 2000,
                    "images_optimized": False,
                    "image_detail": "",
                }

            return {"perf_data": perf_data}

        finally:
            await self.interactor.teardown()

    def review_checklist(self, work_type: str) -> List[Dict]:
        """生成质量审查清单"""
        base_checks = [
            {"item": "页面无 console 错误", "weight": 10},
            {"item": "图片资源使用懒加载", "weight": 5},
            {"item": "CSS/JS 资源已压缩", "weight": 10},
            {"item": "Service Worker 缓存策略合理", "weight": 10},
            {"item": "API 请求有错误重试机制", "weight": 5},
            {"item": "localStorage 数据有大小限制保护", "weight": 5},
        ]

        if work_type in ("rag_chat", "role_play", "emotional_qa", "elderly_care"):
            base_checks.extend([
                {"item": "API Key 未暴露在前端代码中", "weight": 15},
                {"item": "AI 请求有超时处理", "weight": 10},
                {"item": "AI 响应有 fallback 方案", "weight": 10},
            ])

        if work_type == "vision":
            base_checks.extend([
                {"item": "图片上传有大小限制", "weight": 10},
                {"item": "图片上传前有压缩处理", "weight": 5},
            ])

        return base_checks
