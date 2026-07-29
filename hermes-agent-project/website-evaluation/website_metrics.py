"""
网站作品评测指标体系
五维评测：功能性 / AI能力 / 视觉交互 / 性能 / 情感体验
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional
import json


# ─── 维度权重 ───
DIMENSION_WEIGHTS = {
    "functionality": 0.25,
    "ai_capability": 0.25,
    "visual_interaction": 0.20,
    "performance": 0.15,
    "emotional_experience": 0.15,
}

# ─── 评分等级 ───
GRADE_THRESHOLDS = {
    "S": 90,
    "A": 80,
    "B": 70,
    "C": 60,
    "D": 0,
}

GRADE_LABELS = {
    "S": "卓越",
    "A": "优秀",
    "B": "良好",
    "C": "合格",
    "D": "待改进",
}


@dataclass
class DimensionScore:
    """单维度评分"""
    dimension: str
    score: float  # 0-100
    checks: List[Dict] = field(default_factory=list)  # 每项检查的明细

    def to_dict(self) -> Dict:
        return {
            "dimension": self.dimension,
            "score": round(self.score, 1),
            "weight": DIMENSION_WEIGHTS.get(self.dimension, 0),
            "weighted_score": round(self.score * DIMENSION_WEIGHTS.get(self.dimension, 0), 2),
            "checks": self.checks,
        }


@dataclass
class WorkEvaluation:
    """单个作品的完整评测结果"""
    work_id: str
    work_name: str
    url: str
    dimensions: List[DimensionScore] = field(default_factory=list)
    total_score: float = 0.0
    grade: str = "D"
    suggestions: List[str] = field(default_factory=list)
    strengths: List[str] = field(default_factory=list)

    def calculate_total(self):
        self.total_score = sum(
            d.score * DIMENSION_WEIGHTS.get(d.dimension, 0) for d in self.dimensions
        )
        for grade, threshold in GRADE_THRESHOLDS.items():
            if self.total_score >= threshold:
                self.grade = grade
                break

    def to_dict(self) -> Dict:
        return {
            "work_id": self.work_id,
            "work_name": self.work_name,
            "url": self.url,
            "total_score": round(self.total_score, 1),
            "grade": self.grade,
            "grade_label": GRADE_LABELS.get(self.grade, ""),
            "dimensions": [d.to_dict() for d in self.dimensions],
            "strengths": self.strengths,
            "suggestions": self.suggestions,
        }


class WebsiteMetricsCalculator:
    """网站评测指标计算器"""

    # ─── 1. 功能性指标 ───
    @staticmethod
    def check_functionality(interaction_data: Dict) -> DimensionScore:
        """检查功能性：核心流程、数据持久化、表单校验、边界处理"""
        checks = []
        score = 0.0
        max_score = 100.0

        # 核心流程通畅
        core_flow = interaction_data.get("core_flow_completed", False)
        checks.append({"item": "核心流程是否通畅", "passed": core_flow, "detail": interaction_data.get("core_flow_detail", "")})
        if core_flow:
            score += 30

        # 数据持久化
        data_persisted = interaction_data.get("data_persisted", False)
        checks.append({"item": "数据是否正确持久化（localStorage）", "passed": data_persisted, "detail": interaction_data.get("persistence_detail", "")})
        if data_persisted:
            score += 25

        # 表单校验
        form_validation = interaction_data.get("form_validation", False)
        checks.append({"item": "表单输入校验是否完善", "passed": form_validation, "detail": interaction_data.get("validation_detail", "")})
        if form_validation:
            score += 20

        # 边界处理
        edge_cases = interaction_data.get("edge_cases_handled", False)
        checks.append({"item": "边界情况处理（空输入/超长文本/异常操作）", "passed": edge_cases, "detail": interaction_data.get("edge_detail", "")})
        if edge_cases:
            score += 15

        # 错误提示
        error_handling = interaction_data.get("error_handling", False)
        checks.append({"item": "错误状态是否有友好提示", "passed": error_handling, "detail": interaction_data.get("error_detail", "")})
        if error_handling:
            score += 10

        return DimensionScore("functionality", min(score, max_score), checks)

    # ─── 2. AI 能力指标 ───
    @staticmethod
    def check_ai_capability(ai_data: Dict) -> DimensionScore:
        """检查 AI 能力：回复质量、检索准确度、角色一致性、响应速度"""
        checks = []
        score = 0.0

        # 如果该作品没有 AI 功能
        if not ai_data.get("has_ai_feature", False):
            checks.append({"item": "本作品无 AI 功能", "passed": True, "detail": "非 AI 类作品，此维度按默认分处理"})
            return DimensionScore("ai_capability", 75.0, checks)

        # LLM 回复质量
        reply_quality = ai_data.get("reply_quality", 0)  # 0-1
        checks.append({"item": "LLM 回复质量（相关性/连贯性/准确性）", "passed": reply_quality >= 0.7, "detail": f"质量评分: {reply_quality:.0%}"})
        score += reply_quality * 30

        # RAG 检索准确度
        rag_accuracy = ai_data.get("rag_accuracy", None)
        if rag_accuracy is not None:
            checks.append({"item": "RAG 检索准确度", "passed": rag_accuracy >= 0.7, "detail": f"准确率: {rag_accuracy:.0%}"})
            score += rag_accuracy * 20
        else:
            checks.append({"item": "RAG 检索准确度", "passed": True, "detail": "不适用（无 RAG 功能）"})
            score += 15

        # 角色一致性
        character_consistency = ai_data.get("character_consistency", None)
        if character_consistency is not None:
            checks.append({"item": "AI 角色性格一致性", "passed": character_consistency >= 0.7, "detail": f"一致性评分: {character_consistency:.0%}"})
            score += character_consistency * 20
        else:
            checks.append({"item": "AI 角色性格一致性", "passed": True, "detail": "不适用（无角色扮演）"})
            score += 15

        # 响应速度
        response_time = ai_data.get("response_time_ms", 5000)
        if response_time < 3000:
            speed_score = 1.0
        elif response_time < 5000:
            speed_score = 0.7
        elif response_time < 8000:
            speed_score = 0.5
        else:
            speed_score = 0.2
        checks.append({"item": "AI 响应速度", "passed": response_time < 5000, "detail": f"平均响应: {response_time}ms"})
        score += speed_score * 15

        # 多轮对话能力
        multi_turn = ai_data.get("multi_turn_coherent", False)
        checks.append({"item": "多轮对话上下文连贯性", "passed": multi_turn, "detail": ai_data.get("multi_turn_detail", "")})
        if multi_turn:
            score += 15

        return DimensionScore("ai_capability", min(score, 100.0), checks)

    # ─── 3. 视觉交互指标 ───
    @staticmethod
    def check_visual_interaction(visual_data: Dict) -> DimensionScore:
        """检查视觉交互：动画流畅度、响应式适配、可访问性、加载体验"""
        checks = []
        score = 0.0

        # 动画流畅度
        animation_fps = visual_data.get("animation_fps", 60)
        anim_score = min(animation_fps / 60, 1.0)
        checks.append({"item": "动画流畅度（FPS）", "passed": animation_fps >= 45, "detail": f"平均 FPS: {animation_fps}"})
        score += anim_score * 25

        # 响应式适配
        responsive = visual_data.get("responsive", False)
        checks.append({"item": "移动端响应式适配", "passed": responsive, "detail": visual_data.get("responsive_detail", "")})
        if responsive:
            score += 25

        # 可访问性
        a11y_score = visual_data.get("accessibility_score", 0)  # 0-1
        checks.append({"item": "可访问性（ARIA/对比度/键盘导航）", "passed": a11y_score >= 0.7, "detail": f"a11y 评分: {a11y_score:.0%}"})
        score += a11y_score * 20

        # 加载体验
        loading_experience = visual_data.get("loading_experience", "skeleton")  # skeleton/spinner/blank
        has_skeleton = loading_experience in ("skeleton", "progressive")
        checks.append({"item": "加载体验（骨架屏/渐进加载）", "passed": has_skeleton, "detail": f"加载方式: {loading_experience}"})
        if has_skeleton:
            score += 15

        # 微交互
        micro_interactions = visual_data.get("micro_interactions", False)
        checks.append({"item": "微交互反馈（hover/点击/过渡）", "passed": micro_interactions, "detail": visual_data.get("micro_detail", "")})
        if micro_interactions:
            score += 15

        return DimensionScore("visual_interaction", min(score, 100.0), checks)

    # ─── 4. 性能指标 ───
    @staticmethod
    def check_performance(perf_data: Dict) -> DimensionScore:
        """检查性能：首屏加载、资源体积、缓存策略、API 响应"""
        checks = []
        score = 0.0

        # 首屏加载时间
        fcp = perf_data.get("first_contentful_paint_ms", 3000)
        if fcp < 1500:
            fcp_score = 1.0
        elif fcp < 2500:
            fcp_score = 0.7
        elif fcp < 4000:
            fcp_score = 0.5
        else:
            fcp_score = 0.2
        checks.append({"item": "首屏内容绘制（FCP）", "passed": fcp < 2500, "detail": f"FCP: {fcp}ms"})
        score += fcp_score * 30

        # 资源体积
        total_size = perf_data.get("total_resource_kb", 2000)
        if total_size < 500:
            size_score = 1.0
        elif total_size < 1000:
            size_score = 0.7
        elif total_size < 2000:
            size_score = 0.5
        else:
            size_score = 0.2
        checks.append({"item": "页面总资源体积", "passed": total_size < 1000, "detail": f"总计: {total_size}KB"})
        score += size_score * 25

        # Service Worker 缓存
        has_sw = perf_data.get("has_service_worker", False)
        checks.append({"item": "Service Worker 缓存策略", "passed": has_sw, "detail": perf_data.get("sw_detail", "")})
        if has_sw:
            score += 20

        # API 响应时间
        api_response = perf_data.get("api_response_ms", 2000)
        if api_response < 1000:
            api_score = 1.0
        elif api_response < 2000:
            api_score = 0.7
        else:
            api_score = 0.3
        checks.append({"item": "API 响应时间", "passed": api_response < 2000, "detail": f"平均: {api_response}ms"})
        score += api_score * 15

        # 图片优化
        images_optimized = perf_data.get("images_optimized", False)
        checks.append({"item": "图片资源优化（懒加载/WebP）", "passed": images_optimized, "detail": perf_data.get("image_detail", "")})
        if images_optimized:
            score += 10

        return DimensionScore("performance", min(score, 100.0), checks)

    # ─── 5. 情感体验指标 ───
    @staticmethod
    def check_emotional_experience(emotion_data: Dict) -> DimensionScore:
        """检查情感体验：沉浸感、使用门槛、情感反馈、文案温度"""
        checks = []
        score = 0.0

        # 沉浸感
        immersion = emotion_data.get("immersion_score", 0)  # 0-1
        checks.append({"item": "沉浸感（视觉/音效/交互氛围）", "passed": immersion >= 0.7, "detail": f"沉浸感评分: {immersion:.0%}"})
        score += immersion * 30

        # 使用门槛
        low_barrier = emotion_data.get("low_barrier", False)
        checks.append({"item": "使用门槛低（零学习成本/极简交互）", "passed": low_barrier, "detail": emotion_data.get("barrier_detail", "")})
        if low_barrier:
            score += 25

        # 情感反馈
        emotional_feedback = emotion_data.get("emotional_feedback", False)
        checks.append({"item": "情感反馈机制（共情/鼓励/温暖）", "passed": emotional_feedback, "detail": emotion_data.get("feedback_detail", "")})
        if emotional_feedback:
            score += 25

        # 文案温度
        copy_temperature = emotion_data.get("copy_temperature", 0)  # 0-1
        checks.append({"item": "文案温度（自然/有同理心/非机械）", "passed": copy_temperature >= 0.7, "detail": f"文案评分: {copy_temperature:.0%}"})
        score += copy_temperature * 20

        return DimensionScore("emotional_experience", min(score, 100.0), checks)

    # ─── 汇总计算 ───
    @classmethod
    def calculate_all(cls, work_id: str, work_name: str, url: str,
                      interaction_data: Dict, ai_data: Dict,
                      visual_data: Dict, perf_data: Dict,
                      emotion_data: Dict) -> WorkEvaluation:
        """计算所有维度并生成完整评测结果"""
        dimensions = [
            cls.check_functionality(interaction_data),
            cls.check_ai_capability(ai_data),
            cls.check_visual_interaction(visual_data),
            cls.check_performance(perf_data),
            cls.check_emotional_experience(emotion_data),
        ]

        evaluation = WorkEvaluation(
            work_id=work_id,
            work_name=work_name,
            url=url,
            dimensions=dimensions,
        )
        evaluation.calculate_total()

        # 自动生成优点和建议
        evaluation.strengths = cls._extract_strengths(dimensions)
        evaluation.suggestions = cls._extract_suggestions(dimensions)

        return evaluation

    @staticmethod
    def _extract_strengths(dimensions: List[DimensionScore]) -> List[str]:
        """从高分项提取优点"""
        strengths = []
        for d in dimensions:
            if d.score >= 80:
                passed_items = [c["item"] for c in d.checks if c["passed"]]
                if passed_items:
                    strengths.append(f"{d.dimension}：{passed_items[0]}")
        return strengths[:3]

    @staticmethod
    def _extract_suggestions(dimensions: List[DimensionScore]) -> List[str]:
        """从低分项提取改进建议"""
        suggestions = []
        for d in dimensions:
            if d.score < 70:
                failed_items = [c["item"] for c in d.checks if not c["passed"]]
                for item in failed_items[:2]:
                    suggestions.append(f"[{d.dimension}] 建议改进：{item}")
        return suggestions[:5]


def generate_mock_data(work_type: str) -> Dict:
    """根据作品类型生成 Mock 评测数据（用于演示）"""
    base = {
        "interaction_data": {
            "core_flow_completed": True,
            "core_flow_detail": "核心流程可完成",
            "data_persisted": True,
            "persistence_detail": "localStorage 持久化正常",
            "form_validation": True,
            "validation_detail": "输入校验完善",
            "edge_cases_handled": False,
            "edge_detail": "空输入未拦截",
            "error_handling": True,
            "error_detail": "有友好错误提示",
        },
        "visual_data": {
            "animation_fps": 58,
            "responsive": True,
            "responsive_detail": "移动端适配良好",
            "accessibility_score": 0.65,
            "loading_experience": "skeleton",
            "micro_interactions": True,
            "micro_detail": "hover 和过渡动画丰富",
        },
        "perf_data": {
            "first_contentful_paint_ms": 1800,
            "total_resource_kb": 850,
            "has_service_worker": True,
            "sw_detail": "NetworkFirst 策略",
            "api_response_ms": 1500,
            "images_optimized": True,
            "image_detail": "图片懒加载",
        },
        "emotion_data": {
            "immersion_score": 0.8,
            "low_barrier": True,
            "barrier_detail": "零学习成本",
            "emotional_feedback": True,
            "feedback_detail": "有共情反馈",
            "copy_temperature": 0.85,
        },
    }

    # 根据作品类型定制 AI 数据
    if work_type in ("rag_chat", "role_play", "emotional_qa", "vision", "elderly_care", "travel_planning"):
        base["ai_data"] = {
            "has_ai_feature": True,
            "reply_quality": 0.82,
            "rag_accuracy": 0.78 if work_type == "rag_chat" else None,
            "character_consistency": 0.85 if work_type == "role_play" else None,
            "response_time_ms": 3200,
            "multi_turn_coherent": True,
            "multi_turn_detail": "多轮对话上下文连贯",
        }
    else:
        base["ai_data"] = {"has_ai_feature": False}

    return base


def grade_to_emoji(grade: str) -> str:
    """等级转标记"""
    return {"S": "★★★★★", "A": "★★★★☆", "B": "★★★☆☆", "C": "★★☆☆☆", "D": "★☆☆☆☆"}.get(grade, "★☆☆☆☆")
