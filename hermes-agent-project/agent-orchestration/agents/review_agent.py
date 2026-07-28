#!/usr/bin/env python3
"""
审查型 Agent

负责代码审查、文档审核和质量检查
"""

import logging
from typing import Any, Dict, List, Optional

from .base_agent import BaseAgent

logger = logging.getLogger(__name__)


class ReviewAgent(BaseAgent):
    """
    审查型 Agent
    
    擅长：
    - 代码审查和质量评估
    - 文档审核
    - 安全漏洞检测
    - 性能问题识别
    """
    
    def __init__(self, name: str = "review", config: Optional[Dict] = None):
        super().__init__(
            name=name,
            description="审查型 Agent，负责代码和文档审查",
            config=config
        )
        self.add_skill("code_review")
        self.add_skill("security_audit")
        self.add_skill("performance_check")
        self.add_skill("doc_review")
        self.review_rules = config.get("rules", []) if config else []
    
    async def execute(self, task: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """
        执行审查任务
        
        工作流程：
        1. 分析审查对象
        2. 制定审查清单
        3. 逐项检查
        4. 汇总问题
        5. 生成审查报告
        """
        context = context or {}
        
        logger.info(f"审查 Agent 开始审查: {task[:100]}...")
        
        # 获取审查内容
        content = context.get("content", task)
        content_type = self._detect_content_type(content)
        
        # 制定审查清单
        checklist = self._create_checklist(content_type)
        
        # 执行审查
        issues = []
        for item in checklist:
            found_issues = self._check_item(content, item)
            issues.extend(found_issues)
        
        # 评估严重程度
        severity = self._assess_severity(issues)
        
        # 生成报告
        report = self._generate_report(content_type, issues, severity)
        
        return {
            "success": True,
            "task": task,
            "content_type": content_type,
            "issues_found": len(issues),
            "issues": issues,
            "severity": severity,
            "report": report,
            "passed": len(issues) == 0 or severity != "critical"
        }
    
    def _detect_content_type(self, content: str) -> str:
        """检测内容类型"""
        if any(kw in content for kw in ["def ", "class ", "import ", "function"]):
            return "code"
        elif any(kw in content for kw in ["# ", "## ", "```"]):
            return "markdown"
        elif "<" in content and ">" in content:
            return "html"
        else:
            return "text"
    
    def _create_checklist(self, content_type: str) -> List[Dict]:
        """创建审查清单"""
        base_checks = [
            {"id": "format", "name": "格式规范", "weight": 1},
            {"id": "clarity", "name": "清晰可读", "weight": 2},
            {"id": "completeness", "name": "完整性", "weight": 2}
        ]
        
        type_checks = {
            "code": [
                {"id": "syntax", "name": "语法正确性", "weight": 3},
                {"id": "security", "name": "安全性", "weight": 3},
                {"id": "performance", "name": "性能", "weight": 2},
                {"id": "testing", "name": "测试覆盖", "weight": 2},
                {"id": "documentation", "name": "代码注释", "weight": 1}
            ],
            "markdown": [
                {"id": "structure", "name": "结构清晰", "weight": 2},
                {"id": "links", "name": "链接有效", "weight": 1},
                {"id": "images", "name": "图片引用", "weight": 1}
            ],
            "html": [
                {"id": "validity", "name": "HTML 有效性", "weight": 2},
                {"id": "accessibility", "name": "可访问性", "weight": 2},
                {"id": "responsive", "name": "响应式", "weight": 1}
            ]
        }
        
        return base_checks + type_checks.get(content_type, [])
    
    def _check_item(self, content: str, item: Dict) -> List[Dict]:
        """检查单个项目"""
        issues = []
        
        # 模拟各种检查
        check_id = item["id"]
        
        if check_id == "syntax" and "def " in content:
            if "pass" in content and "# TODO" not in content:
                issues.append({
                    "type": "warning",
                    "check": item["name"],
                    "message": "发现未完成的函数实现",
                    "line": content.find("def "),
                    "suggestion": "完成函数实现或添加 TODO 注释"
                })
        
        if check_id == "security":
            dangerous = ["eval(", "exec(", "innerHTML", "dangerouslySetInnerHTML"]
            for d in dangerous:
                if d in content:
                    issues.append({
                        "type": "critical",
                        "check": item["name"],
                        "message": f"发现潜在安全风险: {d}",
                        "line": content.find(d),
                        "suggestion": "使用安全的替代方案"
                    })
        
        if check_id == "performance":
            if "for " in content and "for " in content[content.find("for ")+1:]:
                issues.append({
                    "type": "warning",
                    "check": item["name"],
                    "message": "可能存在嵌套循环，注意性能影响",
                    "suggestion": "考虑优化算法复杂度"
                })
        
        if check_id == "documentation":
            if "def " in content and '"""' not in content:
                issues.append({
                    "type": "info",
                    "check": item["name"],
                    "message": "函数缺少文档字符串",
                    "suggestion": "添加函数文档说明参数和返回值"
                })
        
        return issues
    
    def _assess_severity(self, issues: List[Dict]) -> str:
        """评估严重程度"""
        if any(i["type"] == "critical" for i in issues):
            return "critical"
        elif any(i["type"] == "warning" for i in issues):
            return "warning"
        elif issues:
            return "info"
        return "none"
    
    def _generate_report(self, content_type: str, issues: List[Dict], severity: str) -> str:
        """生成审查报告"""
        report = f"# 审查报告\n\n"
        report += f"**内容类型**: {content_type}\n\n"
        report += f"**严重级别**: {severity.upper()}\n\n"
        report += f"**发现问题**: {len(issues)} 个\n\n"
        
        if issues:
            report += "## 问题列表\n\n"
            for i, issue in enumerate(issues, 1):
                report += f"### {i}. [{issue['type'].upper()}] {issue['check']}\n\n"
                report += f"- **描述**: {issue['message']}\n"
                report += f"- **建议**: {issue['suggestion']}\n\n"
        else:
            report += "## 结论\n\n"
            report += "✅ 审查通过，未发现明显问题。\n"
        
        return report
