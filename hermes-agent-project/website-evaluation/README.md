# 网站作品智能评测系统

基于 Hermes Agent 编排框架，对小鹿作品集（xiaoluweb.com）的 9 个 AI 产品进行自动化评测。

## 评测架构

```
website-evaluation/
├── README.md                        # 本文件
├── website_evaluator.py             # 主评测器入口
├── website_eval_workflow.py          # 评测工作流编排
├── website_metrics.py                # 五维评测指标体系
├── website_benchmark.jsonl           # 9 个作品的评测用例
├── browser/
│   ├── __init__.py
│   └── page_interactor.py            # 页面交互器（模拟用户行为）
├── agents/
│   ├── __init__.py
│   ├── user_simulation_agent.py      # 用户模拟 Agent
│   ├── quality_review_agent.py       # 质量审查 Agent
│   └── ai_capability_agent.py        # AI 能力测试 Agent
└── reports/                          # 评测报告输出目录
```

## 评测维度

| 维度 | 权重 | 检查内容 |
|------|------|---------|
| 功能性 (Functionality) | 25% | 核心流程通畅、数据持久化、表单校验、边界处理 |
| AI 能力 (AI Capability) | 25% | LLM 回复质量、RAG 检索准确度、角色一致性、响应速度 |
| 视觉交互 (Visual & Interaction) | 20% | 动画流畅度、响应式适配、可访问性、加载体验 |
| 性能 (Performance) | 15% | 首屏加载、资源体积、缓存策略、API 响应 |
| 情感体验 (Emotional Experience) | 15% | 沉浸感、使用门槛、情感反馈、文案温度 |

## 评测流程

```
                    ┌─────────────────┐
                    │  加载评测用例     │
                    │  (benchmark)     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  页面交互器       │
                    │  (浏览器模拟)     │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───────┐ ┌───▼────────┐ ┌──▼───────────────┐
     │ 用户模拟 Agent  │ │ 质量审查    │ │ AI 能力测试 Agent │
     │ (模拟真实用户)  │ │ Agent      │ │ (测试 AI 功能)    │
     └────────┬───────┘ └───┬────────┘ └──┬───────────────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
                    ┌────────▼────────┐
                    │  汇总评分 + 生成  │
                    │  改进建议报告      │
                    └─────────────────┘
```

## 快速开始

```bash
cd website-evaluation

# 评测全部作品
python website_evaluator.py --benchmark website_benchmark.jsonl --output reports/

# 评测单个作品
python website_evaluator.py --benchmark website_benchmark.jsonl --target xiaoye

# 生成 Mock 报告（不实际访问网站，用于演示）
python website_evaluator.py --benchmark website_benchmark.jsonl --mock
```

## 被测作品清单

| ID | 作品名称 | URL | 类型 |
|----|---------|-----|------|
| xiaoye | 网站助手（小叶） | xiaoluweb.com | RAG 对话 |
| inventory | 物资管家 | xiaoluweb.com/toolbox/supplies | AI 视觉识别 |
| travel | 漫游指南 | xiaoluweb.com/toolbox/travel | AI 旅行规划 |
| healing | 森林疗愈室 | xiaoluweb.com/healing | 情绪疗愈 |
| apartment | 爱情公寓 | xiaoluweb.com/toolbox/answer | AI 角色扮演 |
| quests | 通关清单 | xiaoluweb.com/toolbox/quests | 游戏化待办 |
| advice | 解忧杂货店 | xiaoluweb.com/toolbox/advice | AI 情感问答 |
| recharge | 回血清单 | xiaoluweb.com/toolbox/recharge | 低能耗回血 |
| banling | 伴龄 | xiaoluweb.com/toolbox/banling | AI 养老规划 |

## 依赖

```bash
pip install playwright
playwright install chromium
```

## License

MIT
