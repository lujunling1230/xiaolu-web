#!/usr/bin/env python3
"""
研究型 Agent

负责信息收集、分析和研究任务
"""

import json
import logging
from typing import Any, Dict, Optional

from .base_agent import BaseAgent

logger = logging.getLogger(__name__)


class ResearchAgent(BaseAgent):
    """
    研究型 Agent
    
    擅长：
    - 网络搜索和信息收集
    - 数据分析和整理
    - 技术调研和文档阅读
    - 趋势分析和报告生成
    """
    
    def __init__(self, name: str = "research", config: Optional[Dict] = None):
        super().__init__(
            name=name,
            description="研究型 Agent，负责信息收集和分析",
            config=config
        )
        # 添加研究相关技能
        self.add_skill("web_search")
        self.add_skill("web_extract")
        self.add_skill("data_analysis")
        self.add_skill("report_writing")
    
    async def execute(self, task: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """
        执行研究任务
        
        工作流程：
        1. 分析任务需求
        2. 制定研究计划
        3. 执行信息收集
        4. 整理和分析
        5. 生成研究报告
        """
        context = context or {}
        
        logger.info(f"研究 Agent 开始研究: {task[:100]}...")
        
        # 步骤 1: 分析任务
        research_plan = self._create_research_plan(task)
        
        # 步骤 2: 执行研究（模拟）
        findings = []
        for step in research_plan:
            finding = await self._research_step(step, context)
            findings.append(finding)
        
        # 步骤 3: 综合分析
        analysis = self._analyze_findings(findings)
        
        # 步骤 4: 生成报告
        report = self._generate_report(task, findings, analysis)
        
        return {
            "success": True,
            "task": task,
            "findings": findings,
            "analysis": analysis,
            "report": report,
            "sources": self._extract_sources(findings)
        }
    
    def _create_research_plan(self, task: str) -> list:
        """制定研究计划"""
        # 根据任务关键词生成研究步骤
        plan = []
        
        if "技术" in task or "框架" in task:
            plan.extend([
                {"type": "search", "query": f"{task} 最新技术趋势"},
                {"type": "compare", "query": f"{task} 对比分析"},
                {"type": "doc", "query": f"{task} 官方文档"}
            ])
        elif "市场" in task or "行业" in task:
            plan.extend([
                {"type": "search", "query": f"{task} 市场规模"},
                {"type": "search", "query": f"{task} 主要玩家"},
                {"type": "analysis", "query": f"{task} 发展趋势"}
            ])
        else:
            plan.extend([
                {"type": "search", "query": task},
                {"type": "extract", "query": f"{task} 详细信息"},
                {"type": "summarize", "query": task}
            ])
        
        return plan
    
    async def _research_step(self, step: Dict, context: Dict) -> Dict:
        """执行单个研究步骤"""
        step_type = step["type"]
        query = step["query"]
        
        # 实际实现中会调用 Hermes 的工具
        # 这里模拟返回结果
        return {
            "type": step_type,
            "query": query,
            "result": f"模拟 {step_type} 结果: {query[:50]}...",
            "sources": [f"https://example.com/{step_type}"]
        }
    
    def _analyze_findings(self, findings: list) -> Dict:
        """分析研究结果"""
        return {
            "summary": f"共收集 {len(findings)} 条研究发现",
            "key_points": [f["query"] for f in findings],
            "confidence": "high" if len(findings) >= 3 else "medium"
        }
    
    def _generate_report(self, task: str, findings: list, analysis: Dict) -> str:
        """生成研究报告"""
        report = f"# 研究报告: {task}\n\n"
        report += f"## 摘要\n\n{analysis['summary']}\n\n"
        report += "## 主要发现\n\n"
        
        for i, finding in enumerate(findings, 1):
            report += f"### {i}. {finding['query']}\n\n"
            report += f"{finding['result']}\n\n"
        
        report += "## 结论\n\n"
        report += f"基于以上研究，我们对 '{task}' 有了全面的了解。"
        report += f"数据可信度: {analysis['confidence']}\n"
        
        return report
    
    def _extract_sources(self, findings: list) -> list:
        """提取来源"""
        sources = []
        for finding in findings:
            sources.extend(finding.get("sources", []))
        return list(set(sources))
