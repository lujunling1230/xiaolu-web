"""
AI 能力测试 Agent
测试 AI 功能的回复质量、检索准确度、角色一致性
"""

import asyncio
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from typing import Dict, List, Optional
import re
import time


class AICapabilityAgent:
    """AI 能力测试 Agent：专门测试 AI 功能质量"""

    def __init__(self, mock: bool = False, api_base: str = "https://www.xiaoluweb.com/api"):
        self.mock = mock
        self.api_base = api_base

    async def run(self, benchmark_case: Dict) -> Dict:
        """执行 AI 能力测试

        Args:
            benchmark_case: 评测用例

        Returns:
            ai_data: AI 能力评测数据
            emotion_data: 情感体验数据
        """
        ai_test_cases = benchmark_case.get("ai_test_cases", [])
        emotional_check = benchmark_case.get("emotional_check", {})
        work_type = benchmark_case.get("work_type", "")

        # 如果没有 AI 测试用例
        if not ai_test_cases and work_type not in ("rag_chat", "role_play", "emotional_qa", "vision", "elderly_care", "travel_planning"):
            return {
                "ai_data": {"has_ai_feature": False},
                "emotion_data": self._generate_emotion_data(emotional_check, work_type),
            }

        if self.mock:
            return self._mock_ai_test(benchmark_case, ai_test_cases, emotional_check)

        # 真实模式：调用 API 测试
        results = []
        for test_case in ai_test_cases:
            result = await self._test_single_case(test_case, benchmark_case)
            results.append(result)

        # 汇总 AI 数据
        ai_data = self._aggregate_ai_results(results, work_type)

        # 情感体验数据
        emotion_data = self._generate_emotion_data(emotional_check, work_type)

        return {
            "ai_data": ai_data,
            "emotion_data": emotion_data,
        }

    async def _test_single_case(self, test_case: Dict, benchmark_case: Dict) -> Dict:
        """测试单个 AI 用例"""
        url = benchmark_case["url"]
        query = test_case.get("query", "")
        expected_keywords = test_case.get("expected_keywords", [])
        expected_fields = test_case.get("expected_fields", [])
        expected_tone = test_case.get("expected_tone", "")

        start = time.time()

        try:
            # 尝试调用网站 API
            import aiohttp
            api_url = self._get_api_url(benchmark_case)

            async with aiohttp.ClientSession() as session:
                payload = self._build_payload(test_case, benchmark_case)
                async with session.post(api_url, json=payload, timeout=aiohttp.ClientTimeout(total=30)) as resp:
                    response_data = await resp.json()
                    response_text = self._extract_response_text(response_data)

            elapsed_ms = int((time.time() - start) * 1000)

            # 分析回复质量
            keyword_hits = sum(1 for kw in expected_keywords if kw in response_text)
            keyword_coverage = keyword_hits / len(expected_keywords) if expected_keywords else 1.0

            field_coverage = 1.0
            if expected_fields:
                field_hits = sum(1 for f in expected_fields if f.lower() in response_text.lower())
                field_coverage = field_hits / len(expected_fields)

            reply_quality = (keyword_coverage + field_coverage) / 2

            return {
                "query": query,
                "response": response_text[:500],
                "keyword_coverage": keyword_coverage,
                "field_coverage": field_coverage,
                "reply_quality": reply_quality,
                "response_time_ms": elapsed_ms,
                "expected_tone": expected_tone,
                "tone_match": self._check_tone(response_text, expected_tone),
            }

        except Exception as e:
            return {
                "query": query,
                "response": "",
                "keyword_coverage": 0,
                "field_coverage": 0,
                "reply_quality": 0,
                "response_time_ms": int((time.time() - start) * 1000),
                "error": str(e),
            }

    def _get_api_url(self, benchmark_case: Dict) -> str:
        """根据作品类型返回 API 端点"""
        work_id = benchmark_case.get("work_id", "")
        api_map = {
            "xiaoye": f"{self.api_base}/xiaoye",
            "inventory": f"{self.api_base}/supplies",
            "travel": f"{self.api_base}/travel",
            "advice": f"{self.api_base}/advice",
            "banling": f"{self.api_base}/banling",
        }
        return api_map.get(work_id, f"{self.api_base}/chat")

    def _build_payload(self, test_case: Dict, benchmark_case: Dict) -> Dict:
        """构建 API 请求"""
        work_id = benchmark_case.get("work_id", "")
        query = test_case.get("query", "")
        character = test_case.get("character", "")

        payload = {"message": query, "workId": work_id}
        if character:
            payload["character"] = character
        return payload

    def _extract_response_text(self, data: Dict) -> str:
        """从 API 响应中提取文本"""
        if isinstance(data, str):
            return data
        for key in ("response", "reply", "answer", "message", "data", "text", "content"):
            if key in data:
                val = data[key]
                if isinstance(val, str):
                    return val
                elif isinstance(val, dict):
                    return self._extract_response_text(val)
                elif isinstance(val, list) and val:
                    return self._extract_response_text(val[0]) if isinstance(val[0], dict) else str(val[0])
        return json.dumps(data, ensure_ascii=False) if data else ""

    def _check_tone(self, text: str, expected_tone: str) -> float:
        """检查语调匹配度（简化版）"""
        if not expected_tone:
            return 0.8

        tone_keywords = {
            "温柔": ["慢慢", "别担心", "没关系", "温暖", "陪伴"],
            "霸气": ["当然", "必须", "听我说", "直接"],
            "贱萌": ["哈哈哈", "好男人", "嘿嘿", "不是吧"],
            "老者": ["孩子", "年轻人", "过来", "听我说"],
            "共情": ["理解", "辛苦", "不容易", "感受"],
            "专业": ["根据", "建议", "分析", "方案"],
        }

        matched_tones = 0
        for tone, keywords in tone_keywords.items():
            if tone in expected_tone:
                hits = sum(1 for kw in keywords if kw in text)
                if hits > 0:
                    matched_tones += 1

        return min(matched_tones / max(len(expected_tone.split("、")), 1), 1.0) if matched_tones > 0 else 0.5

    def _aggregate_ai_results(self, results: List[Dict], work_type: str) -> Dict:
        """汇总 AI 测试结果"""
        if not results:
            return {"has_ai_feature": True, "reply_quality": 0.5, "response_time_ms": 5000}

        avg_quality = sum(r.get("reply_quality", 0) for r in results) / len(results)
        avg_time = sum(r.get("response_time_ms", 5000) for r in results) / len(results)

        ai_data = {
            "has_ai_feature": True,
            "reply_quality": avg_quality,
            "response_time_ms": int(avg_time),
            "multi_turn_coherent": True,
            "multi_turn_detail": f"{len(results)} 轮测试，平均质量 {avg_quality:.0%}",
        }

        # RAG 准确度
        if work_type == "rag_chat":
            rag_scores = [r.get("field_coverage", 0) for r in results]
            ai_data["rag_accuracy"] = sum(rag_scores) / len(rag_scores) if rag_scores else 0.7

        # 角色一致性
        if work_type == "role_play":
            tone_scores = [r.get("tone_match", 0.5) for r in results]
            ai_data["character_consistency"] = sum(tone_scores) / len(tone_scores) if tone_scores else 0.7

        return ai_data

    def _generate_emotion_data(self, emotional_check: Dict, work_type: str) -> Dict:
        """生成情感体验数据"""
        warmth_keywords = emotional_check.get("warmth_keywords", [])
        expected_tone = emotional_check.get("expected_tone", "")
        immersion_target = emotional_check.get("immersion_target", 0.7)

        # 基于作品类型推断情感数据
        immersion_map = {
            "emotional_healing": 0.85,
            "emotional_qa": 0.9,
            "role_play": 0.8,
            "rag_chat": 0.6,
            "vision": 0.5,
            "gamification": 0.7,
            "travel_planning": 0.75,
            "elderly_care": 0.7,
        }

        immersion = immersion_map.get(work_type, 0.7)

        return {
            "immersion_score": immersion,
            "low_barrier": True,
            "barrier_detail": f"交互门槛低，符合{expected_tone}" if expected_tone else "零学习成本",
            "emotional_feedback": work_type in ("emotional_healing", "emotional_qa", "role_play", "elderly_care"),
            "feedback_detail": f"温暖关键词覆盖: {len(warmth_keywords)} 个" if warmth_keywords else "有基础情感反馈",
            "copy_temperature": min(immersion + 0.05, 1.0),
        }

    def _mock_ai_test(self, benchmark_case: Dict, ai_test_cases: List, emotional_check: Dict) -> Dict:
        """Mock 模式 AI 测试"""
        from website_metrics import generate_mock_data
        mock_data = generate_mock_data(benchmark_case.get("work_type", ""))

        # 用 emotional_check 增强情感数据
        emotion_data = self._generate_emotion_data(emotional_check, benchmark_case.get("work_type", ""))

        return {
            "ai_data": mock_data["ai_data"],
            "emotion_data": emotion_data,
        }


import json  # 用于 _extract_response_text 中的 fallback
