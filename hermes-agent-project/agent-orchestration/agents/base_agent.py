#!/usr/bin/env python3
"""
基础 Agent 类

所有 Agent 的基类，定义通用接口和功能
"""

import logging
import time
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class BaseAgent(ABC):
    """
    Agent 基类
    
    属性:
        name: Agent 名称
        description: Agent 描述
        skills: Agent 拥有的技能列表
        memory: Agent 的记忆存储
        config: Agent 配置
    """
    
    def __init__(self, name: str, description: str = "", config: Optional[Dict] = None):
        self.name = name
        self.description = description or f"{name} Agent"
        self.skills = []
        self.memory = []
        self.config = config or {}
        self.stats = {
            "total_calls": 0,
            "success_calls": 0,
            "failed_calls": 0,
            "total_time": 0.0
        }
        logger.info(f"Agent 初始化: {name}")
    
    def add_skill(self, skill_name: str, skill_config: Optional[Dict] = None):
        """添加技能"""
        skill = {
            "name": skill_name,
            "config": skill_config or {},
            "acquired_at": time.time()
        }
        self.skills.append(skill)
        logger.info(f"Agent {self.name} 学习技能: {skill_name}")
    
    def recall(self, query: str, limit: int = 5) -> List[Dict]:
        """回忆相关记忆"""
        # 简单的关键词匹配，实际可实现向量检索
        relevant = []
        for memory in self.memory:
            if query.lower() in memory.get("content", "").lower():
                relevant.append(memory)
        return relevant[:limit]
    
    def remember(self, content: str, metadata: Optional[Dict] = None):
        """记录记忆"""
        memory = {
            "content": content,
            "timestamp": time.time(),
            "metadata": metadata or {}
        }
        self.memory.append(memory)
        
        # 记忆上限管理
        max_memory = self.config.get("max_memory", 1000)
        if len(self.memory) > max_memory:
            self.memory = self.memory[-max_memory:]
    
    @abstractmethod
    async def execute(self, task: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """
        执行任务
        
        Args:
            task: 任务描述
            context: 上下文信息
            
        Returns:
            执行结果
        """
        pass
    
    async def run(self, task: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """
        运行 Agent（包装 execute，添加统计和错误处理）
        """
        start_time = time.time()
        self.stats["total_calls"] += 1
        
        try:
            logger.info(f"Agent {self.name} 开始任务: {task[:100]}...")
            
            result = await self.execute(task, context or {})
            
            execution_time = time.time() - start_time
            self.stats["success_calls"] += 1
            self.stats["total_time"] += execution_time
            
            # 记录成功经验
            if result.get("success"):
                self.remember(
                    f"成功完成任务: {task[:200]}",
                    {"type": "success", "duration": execution_time}
                )
            
            result["agent"] = self.name
            result["execution_time"] = execution_time
            
            logger.info(f"Agent {self.name} 任务完成，耗时: {execution_time:.2f}s")
            return result
            
        except Exception as e:
            execution_time = time.time() - start_time
            self.stats["failed_calls"] += 1
            self.stats["total_time"] += execution_time
            
            # 记录失败经验
            self.remember(
                f"任务失败: {task[:200]}, 错误: {str(e)}",
                {"type": "failure", "error": str(e)}
            )
            
            logger.error(f"Agent {self.name} 任务失败: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "agent": self.name,
                "execution_time": execution_time
            }
    
    def get_stats(self) -> Dict[str, Any]:
        """获取统计信息"""
        total = self.stats["total_calls"]
        return {
            **self.stats,
            "success_rate": self.stats["success_calls"] / total if total > 0 else 0,
            "avg_time": self.stats["total_time"] / total if total > 0 else 0,
            "skill_count": len(self.skills),
            "memory_count": len(self.memory)
        }
    
    def to_dict(self) -> Dict[str, Any]:
        """序列化为字典"""
        return {
            "name": self.name,
            "description": self.description,
            "skills": [s["name"] for s in self.skills],
            "stats": self.get_stats()
        }
