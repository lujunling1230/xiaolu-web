#!/usr/bin/env python3
"""
委派型 Agent

负责任务分解和子 Agent 委派
"""

import asyncio
import logging
from typing import Any, Dict, List, Optional

from .base_agent import BaseAgent

logger = logging.getLogger(__name__)


class DelegateAgent(BaseAgent):
    """
    委派型 Agent
    
    擅长：
    - 任务分解和规划
    - 子 Agent 委派
    - 结果汇总和整合
    - 进度跟踪和协调
    """
    
    def __init__(self, name: str = "delegate", config: Optional[Dict] = None):
        super().__init__(
            name=name,
            description="委派型 Agent，负责任务分解和协调",
            config=config
        )
        self.add_skill("task_decomposition")
        self.add_skill("agent_coordination")
        self.add_skill("result_aggregation")
        self.max_depth = config.get("max_depth", 3) if config else 3
        self.subagents = {}
    
    async def execute(self, task: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """
        执行委派任务
        
        工作流程：
        1. 分析任务复杂度
        2. 分解为子任务
        3. 选择合适的子 Agent
        4. 委派并监控执行
        5. 汇总结果
        """
        context = context or {}
        
        logger.info(f"委派 Agent 开始处理: {task[:100]}...")
        
        # 步骤 1: 分析任务
        analysis = self._analyze_task(task)
        
        # 步骤 2: 分解任务
        subtasks = self._decompose_task(task, analysis)
        
        # 步骤 3 & 4: 委派执行
        results = await self._delegate_subtasks(subtasks, context)
        
        # 步骤 5: 汇总结果
        final_result = self._aggregate_results(results)
        
        return {
            "success": final_result["success"],
            "task": task,
            "analysis": analysis,
            "subtasks_count": len(subtasks),
            "subtasks": [s["description"] for s in subtasks],
            "results": results,
            "final_result": final_result
        }
    
    def _analyze_task(self, task: str) -> Dict:
        """分析任务"""
        # 评估复杂度
        complexity = "simple"
        if len(task) > 200 or any(kw in task for kw in ["并且", "同时", "多个", "分别"]):
            complexity = "complex"
        elif len(task) > 100:
            complexity = "medium"
        
        # 检测任务类型
        task_types = []
        type_keywords = {
            "research": ["研究", "调研", "分析", "搜索"],
            "code": ["代码", "实现", "编写", "开发", "函数"],
            "review": ["审查", "检查", "评估", "审核"],
            "write": ["写作", "文档", "报告", "撰写"]
        }
        
        for t_type, keywords in type_keywords.items():
            if any(kw in task for kw in keywords):
                task_types.append(t_type)
        
        return {
            "complexity": complexity,
            "types": task_types or ["general"],
            "estimated_subtasks": self._estimate_subtasks(complexity)
        }
    
    def _estimate_subtasks(self, complexity: str) -> int:
        """估计子任务数量"""
        return {"simple": 1, "medium": 2, "complex": 3}.get(complexity, 2)
    
    def _decompose_task(self, task: str, analysis: Dict) -> List[Dict]:
        """分解任务"""
        subtasks = []
        
        if analysis["complexity"] == "simple":
            subtasks.append({
                "id": "1",
                "description": task,
                "type": analysis["types"][0],
                "agent": self._select_agent(analysis["types"][0]),
                "dependencies": []
            })
        else:
            # 根据任务类型分解
            if "research" in analysis["types"] and "code" in analysis["types"]:
                subtasks.extend([
                    {
                        "id": "1",
                        "description": f"研究: {task[:50]}...",
                        "type": "research",
                        "agent": "research",
                        "dependencies": []
                    },
                    {
                        "id": "2",
                        "description": f"实现: {task[:50]}...",
                        "type": "code",
                        "agent": "code",
                        "dependencies": ["1"]
                    },
                    {
                        "id": "3",
                        "description": "代码审查",
                        "type": "review",
                        "agent": "review",
                        "dependencies": ["2"]
                    }
                ])
            else:
                # 通用分解
                parts = task.split("。")
                for i, part in enumerate(parts[:3], 1):
                    if part.strip():
                        subtasks.append({
                            "id": str(i),
                            "description": part.strip(),
                            "type": analysis["types"][0] if analysis["types"] else "general",
                            "agent": self._select_agent(analysis["types"][0] if analysis["types"] else "general"),
                            "dependencies": []
                        })
        
        return subtasks
    
    def _select_agent(self, task_type: str) -> str:
        """选择 Agent 类型"""
        mapping = {
            "research": "research",
            "code": "code",
            "review": "review",
            "write": "research",
            "general": "research"
        }
        return mapping.get(task_type, "research")
    
    async def _delegate_subtasks(self, subtasks: List[Dict], context: Dict) -> List[Dict]:
        """委派子任务"""
        results = []
        completed = set()
        
        # 按依赖顺序执行
        while len(completed) < len(subtasks):
            ready = [
                s for s in subtasks 
                if s["id"] not in completed and all(d in completed for d in s["dependencies"])
            ]
            
            if not ready:
                break
            
            # 并行执行就绪的子任务
            tasks = [self._execute_subtask(s, context) for s in ready]
            batch_results = await asyncio.gather(*tasks, return_exceptions=True)
            
            for subtask, result in zip(ready, batch_results):
                if isinstance(result, Exception):
                    results.append({
                        "subtask_id": subtask["id"],
                        "success": False,
                        "error": str(result)
                    })
                else:
                    results.append(result)
                    completed.add(subtask["id"])
        
        return results
    
    async def _execute_subtask(self, subtask: Dict, context: Dict) -> Dict:
        """执行单个子任务"""
        logger.info(f"执行子任务 {subtask['id']}: {subtask['description'][:50]}...")
        
        # 实际实现中会调用对应的 Agent
        # 这里模拟返回
        return {
            "subtask_id": subtask["id"],
            "success": True,
            "agent": subtask["agent"],
            "result": f"子任务 {subtask['id']} 完成: {subtask['description'][:50]}...",
            "execution_time": 1.0
        }
    
    def _aggregate_results(self, results: List[Dict]) -> Dict:
        """汇总结果"""
        success_count = sum(1 for r in results if r.get("success"))
        total_count = len(results)
        
        return {
            "success": success_count == total_count,
            "success_rate": success_count / total_count if total_count > 0 else 0,
            "total_subtasks": total_count,
            "successful_subtasks": success_count,
            "summary": f"完成 {success_count}/{total_count} 个子任务"
        }
