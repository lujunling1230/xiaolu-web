#!/usr/bin/env python3
"""
条件工作流

根据条件选择执行路径
"""

import logging
from typing import Any, Callable, Dict, List, Optional

from .base_workflow import BaseWorkflow

logger = logging.getLogger(__name__)


class ConditionalWorkflow(BaseWorkflow):
    """
    条件工作流
    
    特点：
    - 根据条件动态选择执行路径
    - 支持多个条件和默认路径
    - 条件可以是任意判断函数
    
    适用场景：
    - 需要根据输入动态路由的任务
    - 多类型任务处理
    """
    
    def __init__(self, name: str = "conditional", description: str = ""):
        super().__init__(name, description or "条件工作流")
        self.conditions: List[Dict] = []
        self.default_agent: Optional[str] = None
    
    def add_condition(self, agent_name: str, condition: Callable[[Dict], bool], description: str = ""):
        """添加条件分支"""
        self.conditions.append({
            "agent": agent_name,
            "condition": condition,
            "description": description or f"条件: {agent_name}"
        })
        logger.info(f"工作流 {self.name} 添加条件: {agent_name}")
    
    def set_default(self, agent_name: str):
        """设置默认 Agent"""
        self.default_agent = agent_name
        logger.info(f"工作流 {self.name} 设置默认 Agent: {agent_name}")
    
    async def execute(self, task: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """
        条件执行工作流
        
        执行逻辑：
        1. 评估所有条件
        2. 选择匹配的 Agent
        3. 执行选中的 Agent
        4. 返回结果
        """
        context = context or {}
        context["task"] = task  # 将任务放入上下文供条件判断
        
        logger.info(f"条件工作流开始: {self.name}, 任务: {task[:100]}...")
        
        # 评估条件
        selected_agent = self._evaluate_conditions(context)
        
        if not selected_agent:
            return {
                "success": False,
                "workflow": self.name,
                "error": "没有匹配的条件且未设置默认 Agent"
            }
        
        logger.info(f"选择 Agent: {selected_agent}")
        
        # 执行选中的 Agent
        try:
            result = await self._execute_agent(selected_agent, task, context)
            return {
                "success": True,
                "workflow": self.name,
                "selected_agent": selected_agent,
                "result": result
            }
        except Exception as e:
            logger.error(f"Agent {selected_agent} 执行失败: {str(e)}")
            return {
                "success": False,
                "workflow": self.name,
                "selected_agent": selected_agent,
                "error": str(e)
            }
    
    def _evaluate_conditions(self, context: Dict) -> Optional[str]:
        """评估条件，返回匹配的 Agent 名称"""
        for condition in self.conditions:
            try:
                if condition["condition"](context):
                    return condition["agent"]
            except Exception as e:
                logger.warning(f"条件评估失败: {condition['agent']}, 错误: {str(e)}")
        
        # 返回默认 Agent
        return self.default_agent
    
    async def _execute_agent(self, agent_name: str, task: str, context: Dict) -> Dict:
        """执行 Agent"""
        # 实际实现中会调用对应的 Agent
        # 这里模拟返回
        return {
            "output": f"Agent {agent_name} 处理结果: {task[:50]}...",
            "agent": agent_name
        }
    
    def get_conditions(self) -> List[Dict]:
        """获取所有条件"""
        return [
            {
                "agent": c["agent"],
                "description": c["description"]
            }
            for c in self.conditions
        ]
