# Agent 编排模块# Agent 编排模块

## 概述

本模块提供# Agent 编排模块

## 概述

本模块提供多 Agent 协作的编排能力，支持顺序、并行、条件等多种工作流模式。
# Agent 编排模块

## 概述

本模块提供多 Agent 协作的编排能力，支持顺序、并行、条件等多种工作流模式。

## 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                     Orchestrator (编排器)                     │
│                     协调工作流执行                             │# Agent 编排模块

## 概述

本模块提供多 Agent 协作的编排能力，支持顺序、并行、条件等多种工作流模式。

## 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                     Orchestrator (编排器)                     │
│                     协调工作流执行                             │
└─────────────┬───────────────────────────────┬───────────────┘
              │# Agent 编排模块

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
    │   Agent Registry   │          │  Workflow# Agent 编排模块

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
    │   Agent 注册表      │          │   工作流# Agent 编排模块

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
    │  Research Agent    │          │# Agent 编排模块

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
    │  Review Agent      │          │# Agent 编排模块

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

负责信息收集# Agent 编排模块

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
result = await agent.run("调研# Agent 编排模块

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
from agents import CodeAgent# Agent 编排模块

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
result = await agent# Agent 编排模块

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

负责代码审查、文档审核和质量检查# Agent 编排模块

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
from agents import Review# Agent 编排模块

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
result = await agent.run("审查代码安全性", context# Agent 编排模块

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
from agents import DelegateAgent# Agent 编排模块

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

agent = DelegateAgent(config={"max# Agent 编排模块

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
result = await agent# Agent 编排模块

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

步骤按顺序执行，前一步的输出作为# Agent 编排模块

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

workflow = Sequential# Agent 编排模块

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
workflow.add# Agent 编排模块

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
workflow# Agent 编排模块

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

result = await workflow.execute("实现新# Agent 编排模块

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

### 并行# Agent 编排模块

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

workflow = ParallelWorkflow(name="parallel-analysis", max# Agent 编排模块

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
workflow.add_branch("code# Agent 编排模块

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
workflow.add_branch("# Agent 编排模块

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
```# Agent 编排模块

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

### 条件工作流（Conditional# Agent 编排模块

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
from workflows import# Agent 编排模块

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

workflow = ConditionalWorkflow(name="# Agent 编排模块

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
workflow.add_condition("research",