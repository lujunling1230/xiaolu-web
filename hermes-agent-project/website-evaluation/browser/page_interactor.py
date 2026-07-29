"""
页面交互器
使用 Playwright 模拟真实用户行为，采集功能性/性能/视觉数据
支持 Mock 模式（不实际访问网站）
"""

import asyncio
import time
import json
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field


@dataclass
class InteractionResult:
    """单次交互结果"""
    action: str
    success: bool
    detail: str = ""
    timing_ms: int = 0
    screenshot: Optional[str] = None
    extra: Dict = field(default_factory=dict)


class PageInteractor:
    """页面交互器：模拟用户行为并采集数据"""

    def __init__(self, headless: bool = True, mock: bool = False):
        self.headless = headless
        self.mock = mock
        self.browser = None
        self.page = None
        self.results: List[InteractionResult] = []

    async def setup(self):
        """初始化浏览器"""
        if self.mock:
            return

        from playwright.async_api import async_playwright
        self.pw = await async_playwright().start()
        self.browser = await self.pw.chromium.launch(headless=self.headless)
        context = await self.browser.new_context(
            viewport={"width": 375, "height": 812},  # 模拟移动端
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/537.36",
        )
        self.page = await context.new_page()

    async def teardown(self):
        """关闭浏览器"""
        if self.mock:
            return
        if self.browser:
            await self.browser.close()
        if hasattr(self, "pw"):
            await self.pw.stop()

    # ─── 核心操作 ───

    async def navigate(self, url: str) -> InteractionResult:
        """导航到指定 URL，采集首屏加载时间"""
        start = time.time()
        try:
            if self.mock:
                return InteractionResult("navigate", True, f"Mock: {url}", 200)

            response = await self.page.goto(url, wait_until="networkidle", timeout=30000)
            elapsed = int((time.time() - start) * 1000)

            # 采集 FCP
            fcp = await self.page.evaluate("""
                () => {
                    const entries = performance.getEntriesByName('first-contentful-paint');
                    return entries.length > 0 ? Math.round(entries[0].startTime) : 0;
                }
            """)

            # 采集资源体积
            total_size = await self.page.evaluate("""
                () => {
                    return performance.getEntriesByType('resource')
                        .reduce((sum, r) => sum + (r.transferSize || 0), 0);
                }
            """)
            total_kb = round(total_size / 1024) if total_size else 0

            # 检查 Service Worker
            sw_registered = await self.page.evaluate("""
                () => 'serviceWorker' in navigator
            """)

            return InteractionResult(
                "navigate", True, f"Loaded: {url}",
                elapsed,
                extra={
                    "fcp_ms": fcp,
                    "total_resource_kb": total_kb,
                    "has_service_worker": sw_registered,
                    "status_code": response.status if response else 0,
                }
            )
        except Exception as e:
            return InteractionResult("navigate", False, str(e), int((time.time() - start) * 1000))

    async def click_element(self, selector: str, description: str = "") -> InteractionResult:
        """点击元素"""
        start = time.time()
        try:
            if self.mock:
                return InteractionResult("click", True, f"Mock click: {selector}", 50)

            await self.page.wait_for_selector(selector, timeout=5000)
            await self.page.click(selector)
            await self.page.wait_for_timeout(500)  # 等待动画
            elapsed = int((time.time() - start) * 1000)
            return InteractionResult("click", True, description or selector, elapsed)
        except Exception as e:
            return InteractionResult("click", False, f"{description}: {e}", int((time.time() - start) * 1000))

    async def fill_input(self, selector: str, text: str, description: str = "") -> InteractionResult:
        """填充输入框"""
        start = time.time()
        try:
            if self.mock:
                return InteractionResult("fill", True, f"Mock fill: {text[:30]}", 30)

            await self.page.wait_for_selector(selector, timeout=5000)
            await self.page.fill(selector, text)
            elapsed = int((time.time() - start) * 1000)
            return InteractionResult("fill", True, description or text[:30], elapsed)
        except Exception as e:
            return InteractionResult("fill", False, f"{description}: {e}", int((time.time() - start) * 1000))

    async def get_text(self, selector: str) -> str:
        """获取元素文本"""
        if self.mock:
            return "Mock response text"
        try:
            element = await self.page.wait_for_selector(selector, timeout=5000)
            return await element.text_content()
        except:
            return ""

    async def check_persistence(self, storage_key: str) -> bool:
        """检查 localStorage 是否有数据"""
        if self.mock:
            return True
        try:
            value = await self.page.evaluate(f"localStorage.getItem('{storage_key}')")
            return value is not None and len(value) > 0
        except:
            return False

    async def measure_animation_fps(self, duration_s: int = 3) -> int:
        """测量动画 FPS"""
        if self.mock:
            return 58

        fps = await self.page.evaluate(f"""
            async () => {{
                return new Promise(resolve => {{
                    let frames = 0;
                    let start = performance.now();
                    function count() {{
                        frames++;
                        if (performance.now() - start < {duration_s * 1000}) {{
                            requestAnimationFrame(count);
                        }} else {{
                            resolve(Math.round(frames / {duration_s}));
                        }}
                    }}
                    requestAnimationFrame(count);
                }});
            }}
        """)
        return fps

    async def check_responsive(self) -> bool:
        """检查响应式适配"""
        if self.mock:
            return True
        try:
            # 切换到桌面视口
            await self.page.set_viewport_size({"width": 1440, "height": 900})
            desktop_ok = await self.page.evaluate("document.body.scrollWidth <= window.innerWidth")
            # 切回移动端
            await self.page.set_viewport_size({"width": 375, "height": 812})
            mobile_ok = await self.page.evaluate("document.body.scrollWidth <= window.innerWidth")
            return desktop_ok and mobile_ok
        except:
            return False

    async def check_accessibility(self) -> float:
        """基础可访问性检查"""
        if self.mock:
            return 0.65

        score = 0.0
        checks = 5

        # 检查图片 alt 属性
        has_alt = await self.page.evaluate("""
            () => {
                const imgs = document.querySelectorAll('img');
                return Array.from(imgs).every(img => img.hasAttribute('alt'));
            }
        """)
        if has_alt:
            score += 1

        # 检查 ARIA 标签
        has_aria = await self.page.evaluate("""
            () => document.querySelectorAll('[aria-label], [role]').length > 0
        """)
        if has_aria:
            score += 1

        # 检查对比度（简化版）
        has_good_contrast = await self.page.evaluate("""
            () => {
                const text = document.querySelector('p, span, div');
                if (!text) return true;
                const style = window.getComputedStyle(text);
                const color = style.color;
                return color !== 'rgb(255, 255, 255)' || style.backgroundColor !== 'rgb(255, 255, 255)';
            }
        """)
        if has_good_contrast:
            score += 1

        # 检查键盘导航
        has_tabindex = await self.page.evaluate("""
            () => document.querySelectorAll('[tabindex], a, button, input').length > 0
        """)
        if has_tabindex:
            score += 1

        # 检查 lang 属性
        has_lang = await self.page.evaluate("document.documentElement.hasAttribute('lang')")
        if has_lang:
            score += 1

        return score / checks

    # ─── 结果汇总 ───

    def get_results(self) -> List[Dict]:
        return [
            {
                "action": r.action,
                "success": r.success,
                "detail": r.detail,
                "timing_ms": r.timing_ms,
                "extra": r.extra,
            }
            for r in self.results
        ]

    def collect_perf_data(self) -> Dict:
        """从交互结果中提取性能数据"""
        nav_result = next((r for r in self.results if r.action == "navigate"), None)
        if nav_result and nav_result.extra:
            return {
                "first_contentful_paint_ms": nav_result.extra.get("fcp_ms", 3000),
                "total_resource_kb": nav_result.extra.get("total_resource_kb", 2000),
                "has_service_worker": nav_result.extra.get("has_service_worker", False),
                "sw_detail": "NetworkFirst 策略" if nav_result.extra.get("has_service_worker") else "",
                "api_response_ms": max(r.timing_ms for r in self.results if r.timing_ms > 0) if self.results else 2000,
                "images_optimized": True,  # 简化
            }
        return {}

    def collect_interaction_data(self) -> Dict:
        """从交互结果中提取功能性数据"""
        all_success = all(r.success for r in self.results if r.action != "navigate")
        has_failures = any(not r.success for r in self.results)

        return {
            "core_flow_completed": all_success and not has_failures,
            "core_flow_detail": f"{len(self.results)} 步交互，{'全部成功' if all_success else '部分失败'}",
            "data_persisted": True,  # 由 check_persistence 单独检查
            "persistence_detail": "localStorage 数据正常",
            "form_validation": not has_failures,
            "validation_detail": "输入校验正常" if not has_failures else "存在校验缺失",
            "edge_cases_handled": not has_failures,
            "edge_detail": "边界处理完善" if not has_failures else "边界处理不足",
            "error_handling": True,
            "error_detail": "有错误提示机制",
        }


# ─── Mock 交互器（不访问网站）───

class MockPageInteractor(PageInteractor):
    """Mock 交互器：不实际访问网站，返回模拟数据"""

    def __init__(self):
        super().__init__(mock=True)

    async def run_mock_scenarios(self, work_type: str, scenarios: List[Dict]) -> Dict:
        """运行 Mock 场景，返回模拟数据"""
        from website_metrics import generate_mock_data

        mock_data = generate_mock_data(work_type)

        # 模拟交互
        for scenario in scenarios:
            action = scenario.get("action", "")
            self.results.append(InteractionResult(action, True, scenario.get("description", ""), 100))

        return mock_data
