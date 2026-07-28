#!/usr/bin/env python3
"""
Hermes Agent 编排器
支持顺序、并行、条件等多种工作流模式
"""

import argparse
import asyncio
import json
import logging
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

from agents import AgentRegistry
from workflows import ConditionalWorkflow, ParallelWorkflow, SequentialWorkflow

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class Orchestrator:
    """
    Agent 编排器
    
    负责协调多个 Agent 的执行，管理工作流生命周期
    """
    
    def __init__(self, config_path: Optional[str] = None):
        self.config = self._load_config(config_path)
        self.registry = AgentRegistry()
        self.workflows = {}
        self.results = {}
        logger.info("编排器初始化完成")
    
    def _load_config(self, config_path: Optional[str]) -> Dict[str, Any]:
        """加载配置文件"""
        if config_path and Path(config_path).exists():
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return self._default_config()
    
    def _default_config(self) -> Dict[str, Any]:
        """默认配置"""
        return {
            "max_retries": 3,
            "timeout": 300,
            "parallel_limit": 5,
            "save_trajectory": True,
            "trajectory_dir": "./trajectories"
        }
    
    def register_workflow(self, name: str, workflow):
        """注册工作流"""
        self.workflows[name] = workflow
        logger.info(f"注册工作流: {name}")
    
    async def execute(self, workflow_name: str, task: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """
        执行工作流
        
        Args:
            workflow_name: 工作流名称
            task: 任务描述
            context: 上下文信息
            
        Returns:
            执行结果
        """
        if workflow_name not in self.workflows:
            raise ValueError(f"未知工作流: {workflow_name}")
        
        workflow = self.workflows[workflow_name]
        start_time = time.time()
        
        logger.info(f"开始执行工作流: {workflow_name}, 任务: {task}")
        
        try:
            result = await workflow.execute(task, context or {})
            
            execution_time = time.time() - start_time
            result["execution_time"] = execution_time
            result["workflow"] = workflow_name
            
            self.results[workflow_name] = result
            
            if self.config["save_trajectory"]:
                self._save_trajectory(workflow_name, task, result)
            
            logger.info(f"工作流执行完成: {workflow_name}, 耗时: {execution_time:.2f}s")
            return result
            
        except Exception as e:
            logger.error(f"工作流执行失败: {workflow_name}, 错误: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "workflow": workflow_name,
                "execution_time": time.time() - start_time
            }
    
    def _save_trajectory(self, workflow_name: str, task: str, result: Dict):
        """保存执行轨迹"""
        trajectory_dir = Path(self.config["trajectory_dir"])
        trajectory_dir.mkdir(parents=True, exist_ok=True)
        
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        filename = f"{workflow_name}_{timestamp}.json"
        
        trajectory = {
            "workflow": workflow_name,
            "task": task,
            "timestamp": timestamp,
            "result": result
        }
        
        with open(trajectory_dir / filename, 'w', encoding='utf-8') as f:
            json.dump(trajectory, f, ensure_ascii=False, indent=2)
        
        logger.info(f"执行轨迹已保存: {trajectory_dir / filename}")
    
    def get_results(self) -> Dict[str, Any]:
        """获取所有执行结果"""
        return self.results


def create_default_orchestrator() -> Orchestrator:
    """创建默认编排器（含预配置工作流）"""
    orchestrator = Orchestrator()
    
    # 注册顺序工作流：研究 -> 编码 -> 审查
    sequential = SequentialWorkflow(name="dev-pipeline")
    sequential.add_step("research", "研究 Agent")
    sequential.add_step("code", "代码 Agent")
    sequential.add_step("review", "审查 Agent")
    orchestrator.register_workflow("sequential", sequential)
    
    # 注册并行工作流：多 Agent 同时处理
    parallel = ParallelWorkflow(name="parallel-analysis", max_workers=3)
    parallel.add_branch("research", "研究 Agent")
    parallel.add_branch("code", "代码 Agent")
    parallel.add_branch("review", "审查 Agent")
    orchestrator.register_workflow("parallel", parallel)
    
    # 注册条件工作流：根据任务类型选择 Agent
    conditional = ConditionalWorkflow(name="smart-router")
    conditional.add_condition("research", lambda ctx: "研究" in ctx.get("task", ""))
    conditional.add_condition("code", lambda ctx: "代码" in ctx.get("task", ""))
    conditional.add_condition("review", lambda ctx: "审查" in ctx.get("task", ""))
    conditional.set_default("research")
    orchestrator.register_workflow("conditional", conditional)
    
    return orchestrator


async def main():
    parser = argparse.ArgumentParser(description="Hermes Agent 编排器")
    parser.add_argument("--workflow", choices=["sequential", "parallel", "conditional"],
                       default="sequential", help="工作流类型")
    parser.add_argument("--task", required=True, help="任务描述")
    parser.add_argument("--config", help="配置文件路径")
    parser.add_argument("--context", help="上下文 JSON 文件")
    
    args = parser.parse_args()
    
    # 加载上下文
    context = {}
    if args.context and Path(args.context).exists():
        with open(args.context, 'r', encoding='utf-8') as f:
            context = json.load(f)
    
    # 创建编排器
    orchestrator = create_default_orchestrator()
    
    # 执行工作流
    result = await orchestrator.execute(args.workflow, args.task, context)
    
    # 输出结果
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
