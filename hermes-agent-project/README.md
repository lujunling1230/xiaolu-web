# Hermes Agent 项目

本项目包含使用 [Hermes Agent](https://github.com/NousResearch/hermes-agent) 搭建 AI Agent 的完整方案，涵盖环境搭建、Agent 编排设计和测评集构建。

## 项目结构

```
hermes-agent-project/
├── README.md                          # 项目说明
├── setup/                             # 搭建指南
│   ├── installation.md               # 安装指南
│   └── configuration.md              # 配置指南
├── agent-orchestration/               # Agent 编排
│   ├── orchestrator.py               # 主编排器
│   ├── agents/                       # Agent 定义
│   │   ├── __init__.py
│   │   ├── base_agent.py             # 基础 Agent 类
│   │   ├── research_agent.py         # 研究型 Agent
│   │   ├── code_agent.py             # 代码型 Agent
│   │   ├── review_agent.py           # 审查型 Agent
│   │   └── delegate_agent.py         # 委派型 Agent
│   ├── workflows/                    # 工作流定义
│   │   ├── __init__.py
│   │   ├── base_workflow.py          # 基础工作流
│   │   ├── sequential_workflow.py    # 顺序工作流
│   │   ├── parallel_workflow.py      # 并行工作流
│   │   └── conditional_workflow.py   # 条件工作流
│   └── skills/                       # Skill 定义
│       ├── research.md
│       ├── code-review.md
│       └── delegation.md
└── evaluation/                        # 测评集
    ├── benchmark.jsonl               # 测评数据（50条）
    ├── evaluator.py                  # 评测脚本
    └── metrics.py                    # 评测指标
```

## 快速开始

### 1. 环境搭建

参考 `setup/installation.md` 完成 Hermes Agent 的安装和配置。

### 2. 运行 Agent 编排

```bash
cd agent-orchestration
python orchestrator.py --workflow sequential --task "your task"
```

### 3. 执行测评

```bash
cd evaluation
python evaluator.py --benchmark benchmark.jsonl --output results.json
```

## 核心特性

- **多 Agent 编排**：支持顺序、并行、条件等多种工作流模式
- **技能系统**：基于 Hermes Skill 标准的可复用技能
- **自动测评**：50+ 条覆盖多场景的测评用例
- **可扩展架构**：易于添加新的 Agent 和工作流

## 文档

- [安装指南](setup/installation.md)
- [配置指南](setup/configuration.md)
- [Agent 编排说明](agent-orchestration/README.md)
- [测评集说明](evaluation/README.md)

## License

MIT
