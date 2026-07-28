#!/usr/bin/env python3
"""
评测指标模块

提供各种评测指标的计算方法
"""

import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class MetricsCalculator:
    """评测指标计算器"""
    
    @staticmethod
    def keyword_coverage(response: str, expected_keywords: List[str]) -> float:
        """
        关键词覆盖率
        
        计算响应中包含的预期关键词比例
        """
        if not expected_keywords:
            return 1.0
        
        response_lower = response.lower()
        matched = sum(1 for kw in expected_keywords if kw.lower() in response_lower)
        return matched / len(expected_keywords)
    
    @staticmethod
    def weighted_score(criteria_scores: Dict[str, float], weights: Dict[str, float]) -> float:
        """
        加权得分
        
        根据权重计算综合得分
        """
        total_weight = sum(weights.values())
        if total_weight == 0:
            return 0.0
        
        score = sum(
            criteria_scores.get(k, 0) * v
            for k, v in weights.items()
        )
        return score / total_weight
    
    @staticmethod
    def response_length_score(response: str, min_length: int = 100, max_length: int = 5000) -> float:
        """
        响应长度得分
        
        评估响应长度是否在合理范围内
        """
        length = len(response)
        if length < min_length:
            return length / min_length
        elif length > max_length:
            return max(0, 1 - (length - max_length) / max_length)
        return 1.0
    
    @staticmethod
    def code_correctness(response: str, test_cases: Optional[List] = None) -> float:
        """
        代码正确性得分
        
        评估代码的正确性
        """
        # 基础检查
        checks = {
            "has_syntax": 0.2,
            "no_obvious_errors": 0.2,
            "has_logic": 0.2,
            "has_comments": 0.1,
            "proper_formatting": 0.1
        }
        
        score = 0.0
        
        # 检查是否包含代码块
        if "```" in response or "def " in response or "class " in response:
            score += checks["has_syntax"]
        
        # 检查是否有明显的语法错误标记
        error_markers = ["SyntaxError", "Error:", "Exception", "Traceback"]
        if not any(marker in response for marker in error_markers):
            score += checks["no_obvious_errors"]
        
        # 检查是否包含逻辑结构
        logic_markers = ["if ", "for ", "while ", "return", "try:", "except"]
        if any(marker in response for marker in logic_markers):
            score += checks["has_logic"]
        
        # 检查是否有注释
        if "#" in response or "//" in response or '"""' in response:
            score += checks["has_comments"]
        
        # 检查格式
        if response.count("(") == response.count(")") and response.count("[") == response.count("]"):
            score += checks["proper_formatting"]
        
        return min(1.0, score)
    
    @staticmethod
    def security_awareness(response: str) -> float:
        """
        安全意识得分
        
        评估对安全问题的识别能力
        """
        security_keywords = [
            "安全", "security", "注入", "injection", "XSS", "CSRF",
            "验证", "validate", "转义", "escape", "加密", "encrypt",
            "权限", "permission", "认证", "auth"
        ]
        
        response_lower = response.lower()
        matched = sum(1 for kw in security_keywords if kw.lower() in response_lower)
        return min(1.0, matched / 3)  # 至少提到3个安全相关概念得满分
    
    @staticmethod
    def completeness(response: str, expected_sections: Optional[List[str]] = None) -> float:
        """
        完整性得分
        
        评估响应是否包含预期的章节或内容
        """
        if not expected_sections:
            # 默认检查常见章节
            expected_sections = ["结论", "总结", "建议", "方案", "分析"]
        
        response_lower = response.lower()
        matched = sum(1 for section in expected_sections if section in response_lower)
        return matched / len(expected_sections)
    
    @classmethod
    def calculate_all(cls, response: str, benchmark: Dict) -> Dict[str, float]:
        """
        计算所有相关指标
        
        Args:
            response: Agent 的响应
            benchmark: 测评条目
            
        Returns:
            各项指标得分
        """
        results = {}
        
        # 关键词覆盖率
        if "expected_keywords" in benchmark:
            results["keyword_coverage"] = cls.keyword_coverage(
                response, benchmark["expected_keywords"]
            )
        
        # 代码正确性（针对代码类任务）
        if benchmark.get("category") == "code":
            results["code_correctness"] = cls.code_correctness(response)
        
        # 安全意识（针对安全类任务）
        if benchmark.get("category") in ["security", "review"]:
            results["security_awareness"] = cls.security_awareness(response)
        
        # 完整性
        results["completeness"] = cls.completeness(response)
        
        # 长度得分
        results["length_score"] = cls.response_length_score(
            response, 
            min_length=benchmark.get("min_length", 100),
            max_length=benchmark.get("max_tokens", 5000)
        )
        
        # 计算加权总分
        criteria = benchmark.get("evaluation_criteria", {})
        if criteria:
            # 映射指标到评分标准
            mapped_scores = {}
            for criterion, weight in criteria.items():
                if criterion in results:
                    mapped_scores[criterion] = results[criterion]
                elif "keyword" in criterion:
                    mapped_scores[criterion] = results.get("keyword_coverage", 0)
                elif "code" in criterion:
                    mapped_scores[criterion] = results.get("code_correctness", 0)
                elif "security" in criterion:
                    mapped_scores[criterion] = results.get("security_awareness", 0)
                else:
                    mapped_scores[criterion] = results.get("completeness", 0)
            
            results["total_score"] = cls.weighted_score(mapped_scores, criteria)
        else:
            # 默认平均分
            scores = [v for v in results.values() if isinstance(v, (int, float))]
            results["total_score"] = sum(scores) / len(scores) if scores else 0
        
        return results
