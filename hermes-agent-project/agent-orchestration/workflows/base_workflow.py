#!/usr/bin/env python3
"""
基础工作流类

所有工作流的基类
"""

import logging
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class BaseWorkflow(ABC):
    """
    工作流基类
    
    定义工作流的通用接口
    """
    
    def __init__(self, name: str, description: str = ""):
        self.name = name
        self.description = description or f"{name} 工作流"
        self.steps = []
        self.results = []
        logger.info(f"工作流初始化: {name}")
    
    @abstractmethod
    async def execute(self, task: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """
        执行工作流
        
        Args:
            task: 任务描述
            context: 上下文信息
            
        Returns:
            执行结果
        """
        pass
    
    def add_step(self, agent_name: str, description: str):
        """添加步骤"""
        step = {
            "id": len(self.steps) + 1,
            "agent": agent_name,
            "description": description
        }
        self.steps.append(step)
        logger.info(f"工作流 {self.name} 添加步骤: {description}")
    
    def get_steps(self) -> List[Dict]:
        """获取所有步骤"""
        return self.steps
    
    def to_dict(self) -> Dict[str, Any]:
        """序列化为字典"""
        return {
            "name": self.name,
            "description": self.description,
            "steps": self.steps
        }
