# 测评集模块

## 概述

本模块提供完整的 Agent 评测方案，包含 50 条覆盖多场景、多难度的测评用例。

## 测评集统计

| 维度 | 分布 |
|------|------|
| **总条数** | 50 |
| **难度分布** | Easy: 17 | Medium: 19 | Hard: 14 |
| **类别分布** | Research: 5 | Code: 7 | Review: 3 | Delegation: 3 | Writing: 2 | Math: 3 | Debugging: 3 | Design: 3 | Security: 3 | DevOps: 3 | Database: 3 | Algorithm: 3 | System: 3 | Frontend: 3 | Testing: 3 |

## 测评维度

每条测评用例包含以下维度：

- **任务描述**：明确的任务要求
- **预期关键词**：响应中应包含的关键词
- **评估标准**：加权评分标准
- **最大 Token**：响应长度限制

## 评测指标

### 1. 关键词覆盖率（Keyword Coverage）

计算响应中包含的预期关键词比例。

```python
from metrics import MetricsCalculator

score = MetricsCalculator.keyword_coverage(response, ["React", "组件"])
```

### 2. 代码正确性（Code Correctness）

评估代码的语法正确性和逻辑完整性。

```python
score = MetricsCalculator.code_correctness(response)
```

### 3. 安全意识（Security Awareness）

评估对安全问题的识别能力。

```python
score = MetricsCalculator.security_awareness(response)
```

### 4. 完整性（Completeness）

评估响应是否包含预期的章节或内容。

```python
score = MetricsCalculator.completeness(response, ["结论", "建议"])
```

### 5. 综合得分（Total Score）

根据评测标准中的权重计算加权总分。

```python
metrics = MetricsCalculator.calculate_all(response, benchmark)
# metrics["total_score"] 即为综合得分
```

## 使用方法

### 命令行评测

```bash
# 使用模拟 Agent 测试
python evaluator.py --benchmark benchmark.jsonl --mock

# 限制评测条数
python evaluator.py --benchmark benchmark.jsonl --mock --limit 10

# 指定输出目录
python evaluator.py --benchmark benchmark.jsonl --mock --output ./my_results
```

### 编程方式评测

```python
from evaluator import Evaluator

# 创建评测器
evaluator = Evaluator("benchmark.jsonl", output_dir="./results")

# 定义 Agent 函数
def my_agent(task: str) -> str:
    # 调用你的 Agent
    return response

# 执行评测
report = evaluator.evaluate_agent(my_agent)

# 打印报告
evaluator.print_report(report)
```

### 单条评测

```python
from evaluator import Evaluator
from metrics import MetricsCalculator

evaluator = Evaluator("benchmark.jsonl")

# 加载单条测评
benchmark = evaluator.benchmarks[0]

# 获取 Agent 响应
response = my_agent(benchmark["task"])

# 评测
result = evaluator.evaluate_response(benchmark, response)
print(f"得分: {result['metrics']['total_score']}")
```

## 评测报告

评测完成后会生成以下文件：

- `report_YYYYMMDD_HHMMSS.json`：完整评测报告
- `summary_YYYYMMDD_HHMMSS.json`：简洁汇总报告

### 报告结构

```json
{
  "summary": {
    "total_evaluated": 50,
    "average_score": 0.75,
    "max_score": 0.95,
    "min_score": 0.45,
    "median_score": 0.78
  },
  "category_breakdown": {
    "code": {
      "count": 7,
      "average": 0.82,
      "max": 0.95,
      "min": 0.60
    }
  },
  "difficulty_breakdown": {
    "easy": {
      "count": 17,
      "average": 0.85,
      "max": 0.95,
      "min": 0.70
    }
  },
  "detailed_results": [...]
}
```

## 添加新的测评用例

在 `benchmark.jsonl` 中添加新行：

```json
{
  "id": "eval-051",
  "category": "code",
  "difficulty": "medium",
  "task": "新的任务描述",
  "expected_keywords": ["关键词1", "关键词2"],
  "evaluation_criteria": {
    "correctness": 0.4,
    "efficiency": 0.3,
    "code_quality": 0.3
  },
  "max_tokens": 2000
}
```

## 自定义评测指标

```python
from metrics import MetricsCalculator

class MyMetricsCalculator(MetricsCalculator):
    @staticmethod
    def custom_metric(response: str) -> float:
        # 实现自定义指标
        return score
```

## 最佳实践

1. **公平对比**：使用相同测评集对比不同 Agent
2. **多次评测**：多次运行取平均，减少随机性
3. **分析弱点**：关注得分低的类别，针对性优化
4. **人工复核**：自动评测后抽样人工复核
5. **持续更新**：定期更新测评集，跟进技术趋势

## 测评集设计原则

1. **覆盖全面**：涵盖研究、编码、审查、设计等多种能力
2. **难度分层**：Easy/Medium/Hard 三个难度级别
3. **客观可量化**：明确的评分标准和预期关键词
4. **实用导向**：贴近实际工作场景
5. **避免偏见**：不偏向特定技术栈或语言
