#!/usr/bin/env python3
"""
顺序工作流

按顺序依次执行多个步骤
"""

import logging
from typing import Any, Dict, Optional

from .base_workflow import BaseWorkflow

logger = logging.getLogger(__name__)


class SequentialWorkflow(BaseWorkflow):
    """
    顺序工作流
    
    特点：
    - 步骤按顺序执行
    - 前一步的输出作为后一步的输入
    - 任何步骤失败则终止
    
    适用场景：
    - 有依赖关系的任务
    - 需要逐步构建结果的任务
    """
    
    def __init__(self, name: str = "sequential", description: str = ""):
        super().__init__(name, description or "顺序工作流")
        self.stop_on_error = True
    
    async def execute(self, task: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """
        顺序执行工作流
        
        执行逻辑：
        1. 初始化上下文
        2. 依次执行每个步骤
        3. 传递前一步的结果
        4. 汇总最终结果
        """
        context = context or {}
        results = []
        current_input = task
        
        logger.info(f"顺序工作流开始: {self.name}, 任务: {task[:100]}...")
        
        for step in self.steps:
            logger.info(f"执行步骤 {step['id']}: {step['description']}")
            
            try:
                # 模拟执行步骤（实际实现会调用 Agent）
                step_result = await self._execute_step(step, current_input, context)
                results.append({
                    "step_id": step["id"],
                    "agent": step["agent"],
                    "success": True,
                    "result": step_result
                })
                
                # 将结果传递给下一步
                current_input = step_result.get("output", str(step_result))
                
            except Exception as e:
                logger.error(f"步骤 {step['id']} 失败: {str(e)}")
                results.append({
                    "step_id": step["id"],
                    "agent": step["agent"],
                    "success": False,
                    "error": str(e)
                })
                
                if self.stop_on_error:
                    return {
                        "success": False,
                        "workflow": self.name,
                        "failed_at_step": step["id"],
                        "results": results,
                        "error": str(e)
                    }
        
        return {
            "success": all(r["success"] for r in results),
            "workflow": self.name,
            "total_steps": len(self.steps),
            "completed_steps": sum(1 for r in results if r["success"]),
            "results": results,
            "final_output": current_input
        }
    
    async def _execute_step(self, step: Dict, input_data: str, context: Dict) -> Dict:
        """执行单个步骤"""
        # 实际实现中会调用对应的 Agent
        # 这里模拟返回
        return {
            "output": f"步骤 {step['id']} ({step['agent']}) 处理结果: {input_data[:50]}...",
            "agent": step["agent"],
            "step_id": step["id"]
        }
