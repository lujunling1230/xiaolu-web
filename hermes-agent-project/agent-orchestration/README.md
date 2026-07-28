# Agent 编排模块

## 概述

本模块提供多 Agent 协作的编排能力，支持顺序、并行、条件等多种工作流模式。

## 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                     Orchestrator (编排器)                     │
│                     协调工作流执行                             │
└─────────────┬───────────────────────────────┬───────────────┘
              │                               │
    ┌─────────▼─────────┐          ┌─────────▼─────────┐
    │   Agent Registry   │          │  Workflow Engine   │
    │   Agent 注册表      │          │   工作流引擎        │
    └─────────┬─────────┘          └─────────┬─────────┘
              │                               │
    ┌─────────▼─────────┐          ┌─────────▼─────────┐
    │  Research Agent    │          │ Sequential Flow    │
    │  Code Agent        │          │ Parallel Flow      │
    │  Review Agent      │          │ Conditional Flow   │
    │  Delegate Agent    │          └────────────────────┘
    └────────────────────┘
```

## Agent 类型

### ResearchAgent（研究型）

负责信息收集、分析和研究任务。

```python
from agents import ResearchAgent

agent = ResearchAgent()
result = await agent.run("调研 React 19 新特性")
```

### CodeAgent（代码型）

负责代码编写、调试和优化。

```python
from agents import CodeAgent

agent = CodeAgent(config={"language": "python"})
result = await agent.run("实现一个 LRU Cache")
```

### ReviewAgent（审查型）

负责代码审查、文档审核和质量检查。

```python
from agents import ReviewAgent

agent = ReviewAgent()
result = await agent.run("审查代码安全性", context={"content": code})
```

### DelegateAgent（委派型）

负责任务分解和子 Agent 委派。

```python
from agents import DelegateAgent

agent = DelegateAgent(config={"max_depth": 3})
result = await agent.run("开发一个博客系统")
```

## 工作流类型

### 顺序工作流（SequentialWorkflow）

步骤按顺序执行，前一步的输出作为后一步的输入。

```python
from workflows import SequentialWorkflow

workflow = SequentialWorkflow(name="dev-pipeline")
workflow.add_step("research", "研究阶段")
workflow.add_step("code", "编码阶段")
workflow.add_step("review", "审查阶段")

result = await workflow.execute("实现新功能")
```

### 并行工作流（ParallelWorkflow）

多个步骤同时执行，最后汇总结果。

```python
from workflows import ParallelWorkflow

workflow = ParallelWorkflow(name="parallel-analysis", max_workers=3)
workflow.add_branch("research", "技术研究")
workflow.add_branch("code", "代码实现")
workflow.add_branch("review", "代码审查")

result = await workflow.execute("全面分析项目")
```

### 条件工作流（ConditionalWorkflow）

根据条件动态选择执行路径。

```python
from workflows import ConditionalWorkflow

workflow = ConditionalWorkflow(name="smart-router")
workflow.add_condition("research", lambda ctx: "研究" in ctx.get("task", ""))
workflow.add_condition("code", lambda ctx: "代码" in ctx.get("task", ""))
workflow.set_default("research")

result = await workflow.execute("研究新技术")
```

## 快速开始

### 使用编排器

```python
import asyncio
from orchestrator import create_default_orchestrator

async def main():
    # 创建默认编排器
    orchestrator = create_default_orchestrator()
    
    # 执行顺序工作流
    result = await orchestrator.execute("sequential", "开发新功能")
    print(result)
    
    # 执行并行工作流
    result = await orchestrator.execute("parallel", "全面分析项目")
    print(result)

asyncio.run(main())
```

### 命令行使用

```bash
# 顺序工作流
python orchestrator.py --workflow sequential --task "实现用户认证功能"

# 并行工作流
python orchestrator.py --workflow parallel --task "全面分析项目架构"

# 条件工作流
python orchestrator.py --workflow conditional --task "研究新技术趋势"

# 带上下文
python orchestrator.py --workflow sequential --task "开发功能" --context context.json
```

## 扩展开发

### 自定义 Agent

```python
from agents import BaseAgent

class MyAgent(BaseAgent):
    def __init__(self, name="my_agent", config=None):
        super().__init__(name, "自定义 Agent", config)
        self.add_skill("my_skill")
    
    async def execute(self, task, context=None):
        # 实现 Agent 逻辑
        return {
            "success": True,
            "result": f"处理结果: {task}"
        }
```

### 自定义工作流

```python
from workflows import BaseWorkflow

class MyWorkflow(BaseWorkflow):
    async def execute(self, task, context=None):
        # 实现工作流逻辑
        for step in self.steps:
            # 执行步骤
            pass
        return {"success": True, "result": "完成"}
```

## 配置文件

创建 `config.json`：

```json
{
  "max_retries": 3,
  "timeout": 300,
  "parallel_limit": 5,
  "save_trajectory": true,
  "trajectory_dir": "./trajectories"
}
```

使用配置：

```python
orchestrator = Orchestrator(config_path="config.json")
```

## Skill 系统

Skills 定义在 `skills/` 目录下，遵循 Hermes Skill 标准：

```markdown
---
name: my-skill
description: 我的技能
---

# 技能标题

## 何时使用

触发条件。

## 工作流程

1. 步骤一
2. 步骤二

## 注意事项

- 注意点
```

## 最佳实践

1. **任务分解**：复杂任务应分解为可独立执行的子任务
2. **错误处理**：每个步骤都应有错误处理和回退方案
3. **结果验证**：关键步骤执行后应验证结果
4. **超时控制**：设置合理的超时时间避免长时间阻塞
5. **日志记录**：记录完整的执行轨迹便于调试

## 集成 Hermes Agent

要将本编排系统与 Hermes Agent 集成：

1. 安装 Hermes Agent
2. 配置 LLM 提供商
3. 将 Agent 执行替换为 Hermes 工具调用
4. 使用 Hermes 的 Skill 系统管理技能

```python
# 集成示例
import subprocess

async def hermes_agent(task: str) -> str:
    result = subprocess.run(
        ["hermes", "chat", "-q", task],
        capture_output=True,
        text=True
    )
    return result.stdout

# 使用 Hermes Agent 执行工作流
orchestrator = create_default_orchestrator()
result = await orchestrator.execute("sequential", task, context={"agent_fn": hermes_agent})
```
