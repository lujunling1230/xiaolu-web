#!/usr/bin/env python3
"""
并行工作流

同时执行多个步骤，最后汇总结果
"""

import asyncio
import logging
from typing import Any, Callable, Dict, List, Optional

from .base_workflow import BaseWorkflow

logger = logging.getLogger(__name__)


class ParallelWorkflow(BaseWorkflow):
    """
    并行工作流
    
    特点：
    - 多个步骤同时执行
    - 各步骤独立运行
    - 最后汇总所有结果
    
    适用场景：
    - 无依赖关系的子任务
    - 需要多角度分析的任务
    """
    
    def __init__(self, name: str = "parallel", description: str = "", max_workers: int = 5):
        super().__init__(name, description or "并行工作流")
        self.max_workers = max_workers
        self.branches = []
    
    def add_branch(self, agent_name: str, description: str, condition: Optional[Callable] = None):
        """添加分支"""
        branch = {
            "id": len(self.branches) + 1,
            "agent": agent_name,
            "description": description,
            "condition": condition
        }
        self.branches.append(branch)
        logger.info(f"工作流 {self.name} 添加分支: {description}")
    
    async def execute(self, task: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """
        并行执行工作流
        
        执行逻辑：
        1. 筛选需要执行的分支
        2. 并行启动所有分支
        3. 等待所有分支完成
        4. 汇总结果
        """
        context = context or {}
        
        # 筛选分支
        active_branches = self._filter_branches(context)
        
        logger.info(f"并行工作流开始: {self.name}, 任务: {task[:100]}...")
        logger.info(f"活跃分支数: {len(active_branches)}")
        
        # 创建任务
        tasks = [
            self._execute_branch(branch, task, context)
            for branch in active_branches
        ]
        
        # 并行执行
        branch_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # 处理结果
        results = []
        success_count = 0
        
        for branch, result in zip(active_branches, branch_results):
            if isinstance(result, Exception):
                results.append({
                    "branch_id": branch["id"],
                    "agent": branch["agent"],
                    "success": False,
                    "error": str(result)
                })
            else:
                results.append({
                    "branch_id": branch["id"],
                    "agent": branch["agent"],
                    "success": True,
                    "result": result
                })
                success_count += 1
        
        # 汇总
        aggregated = self._aggregate_results(results)
        
        return {
            "success": success_count > 0,
            "workflow": self.name,
            "total_branches": len(active_branches),
            "successful_branches": success_count,
            "results": results,
            "aggregated": aggregated
        }
    
    def _filter_branches(self, context: Dict) -> List[Dict]:
        """根据条件筛选分支"""
        active = []
        for branch in self.branches:
            condition = branch.get("condition")
            if condition is None or condition(context):
                active.append(branch)
        return active
    
    async def _execute_branch(self, branch: Dict, task: str, context: Dict) -> Dict:
        """执行单个分支"""
        logger.info(f"执行分支 {branch['id']}: {branch['description']}")
        
        # 实际实现中会调用对应的 Agent
        # 这里模拟返回
        return {
            "output": f"分支 {branch['id']} ({branch['agent']}) 处理结果",
            "agent": branch["agent"],
            "branch_id": branch["id"]
        }
    
    def _aggregate_results(self, results: List[Dict]) -> Dict:
        """汇总分支结果"""
        successful = [r for r in results if r.get("success")]
        
        if not successful:
            return {"summary": "所有分支均失败", "outputs": []}
        
        outputs = []
        for r in successful:
            result_data = r.get("result", {})
            outputs.append(result_data.get("output", str(result_data)))
        
        return {
            "summary": f"成功 {len(successful)}/{len(results)} 个分支",
            "outputs": outputs,
            "consensus": self._find_consensus(outputs)
        }
    
    def _find_consensus(self, outputs: List[str]) -> Optional[str]:
        """寻找共识（简单实现）"""
        if not outputs:
            return None
        # 返回最长输出作为共识
        return max(outputs, key=len)
