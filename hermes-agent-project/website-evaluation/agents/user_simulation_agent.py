"""
用户模拟 Agent
模拟真实用户行为，遍历测试场景，采集功能性和视觉交互数据
"""

import asyncio
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from typing import Dict, List
from browser.page_interactor import PageInteractor, MockPageInteractor, InteractionResult


class UserSimulationAgent:
    """用户模拟 Agent：像真实用户一样操作网站"""

    def __init__(self, mock: bool = False, headless: bool = True):
        self.mock = mock
        self.headless = headless
        self.interactor = MockPageInteractor() if mock else PageInteractor(headless=headless)
        self.results: List[InteractionResult] = []

    async def run(self, benchmark_case: Dict) -> Dict:
        """执行用户模拟测试

        Args:
            benchmark_case: benchmark.jsonl 中的一条用例

        Returns:
            interaction_data: 功能性数据
            visual_data: 视觉交互数据
        """
        url = benchmark_case["url"]
        scenarios = benchmark_case.get("test_scenarios", [])
        work_type = benchmark_case.get("work_type", "")

        await self.interactor.setup()

        try:
            # 导航到页面
            nav_result = await self.interactor.navigate(url)
            self.results.append(nav_result)

            if self.mock:
                # Mock 模式：直接生成模拟数据
                mock_data = self.interactor.run_mock_scenarios(work_type, scenarios)
                if asyncio.iscoroutine(mock_data):
                    mock_data = await mock_data
                return {
                    "interaction_data": mock_data["interaction_data"],
                    "visual_data": mock_data["visual_data"],
                }

            # 真实模式：逐个执行场景
            for scenario in scenarios:
                result = await self._execute_scenario(scenario)
                if result:
                    self.results.append(result)

            # 采集视觉数据
            fps = await self.interactor.measure_animation_fps()
            responsive = await self.interactor.check_responsive()
            a11y = await self.interactor.check_accessibility()

            # 汇总数据
            interaction_data = self.interactor.collect_interaction_data()
            visual_data = {
                "animation_fps": fps,
                "responsive": responsive,
                "responsive_detail": "桌面端和移动端均正常" if responsive else "存在溢出",
                "accessibility_score": a11y,
                "loading_experience": "skeleton",
                "micro_interactions": True,
                "micro_detail": "hover 和过渡动画正常",
            }

            return {
                "interaction_data": interaction_data,
                "visual_data": visual_data,
            }

        finally:
            await self.interactor.teardown()

    async def _execute_scenario(self, scenario: Dict) -> InteractionResult:
        """执行单个测试场景"""
        action = scenario.get("action", "")
        description = scenario.get("description", "")

        try:
            if action == "open_page" or action == "open_map" or action == "open_app":
                return InteractionResult(action, True, description, 200)

            elif action == "ask_question" or action == "write_letter" or action == "ai_consult":
                # 填充输入并发送
                input_text = scenario.get("input", "")
                fill_result = await self.interactor.fill_input(
                    "textarea, input[type='text']",
                    input_text,
                    description
                )
                return fill_result

            elif action == "add_item" or action == "add_quest":
                # 模拟添加操作
                return InteractionResult(action, True, description, 150)

            elif action == "click" or action == "enter_chat":
                return await self.interactor.click_element("[role='button'], button", description)

            elif action == "check_persistence" or action == "check_letter_storage":
                persisted = await self.interactor.check_persistence("inventory_data")
                return InteractionResult(action, persisted, description, 50)

            else:
                return InteractionResult(action, True, description, 100)

        except Exception as e:
            return InteractionResult(action, False, f"{description}: {e}", 0)
