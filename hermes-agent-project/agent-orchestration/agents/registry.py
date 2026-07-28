#!/usr/bin/env python3
"""
Agent 注册表

管理所有可用的 Agent
"""

import logging
from typing import Any, Dict, List, Optional, Type

from .base_agent import BaseAgent

logger = logging.getLogger(__name__)


class AgentRegistry:
    """
    Agent 注册表
    
    负责注册、查找和管理 Agent
    """
    
    def __init__(self):
        self._agents: Dict[str, BaseAgent] = {}
        self._agent_classes: Dict[str, Type[BaseAgent]] = {}
        logger.info("Agent 注册表初始化")
    
    def register(self, agent: BaseAgent):
        """注册 Agent 实例"""
        self._agents[agent.name] = agent
        logger.info(f"注册 Agent: {agent.name}")
    
    def register_class(self, name: str, agent_class: Type[BaseAgent]):
        """注册 Agent 类"""
        self._agent_classes[name] = agent_class
        logger.info(f"注册 Agent 类: {name}")
    
    def get(self, name: str) -> Optional[BaseAgent]:
        """获取 Agent"""
        # 先查找实例
        if name in self._agents:
            return self._agents[name]
        
        # 再查找类并实例化
        if name in self._agent_classes:
            agent_class = self._agent_classes[name]
            agent = agent_class(name=name)
            self.register(agent)
            return agent
        
        logger.warning(f"Agent 未找到: {name}")
        return None
    
    def create(self, name: str, agent_type: str, config: Optional[Dict] = None) -> BaseAgent:
        """
        创建 Agent
        
        Args:
            name: Agent 名称
            agent_type: Agent 类型
            config: 配置
            
        Returns:
            创建的 Agent
        """
        if agent_type not in self._agent_classes:
            raise ValueError(f"未知的 Agent 类型: {agent_type}")
        
        agent_class = self._agent_classes[agent_type]
        agent = agent_class(name=name, config=config or {})
        self.register(agent)
        return agent
    
    def list_agents(self) -> List[Dict[str, Any]]:
        """列出所有 Agent"""
        return [agent.to_dict() for agent in self._agents.values()]
    
    def list_types(self) -> List[str]:
        """列出所有 Agent 类型"""
        return list(self._agent_classes.keys())
    
    def unregister(self, name: str):
        """注销 Agent"""
        if name in self._agents:
            del self._agents[name]
            logger.info(f"注销 Agent: {name}")
    
    def clear(self):
        """清空所有 Agent"""
        self._agents.clear()
        logger.info("清空所有 Agent")
