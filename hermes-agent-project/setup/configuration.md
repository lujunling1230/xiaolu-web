# Hermes Agent 配置指南

## 配置文件结构

Hermes 使用 `~/.hermes/config.yaml` 作为主配置文件，`~/.hermes/.env` 存储 Secrets。

## 基础配置

### config.yaml 完整示例

```yaml
# 模型配置
model: openrouter/anthropic/claude-sonnet-4
# model: openai/gpt-4o
# model: anthropic/claude-opus-4

# 辅助模型（用于摘要、廉价任务）
auxiliary:
  model: openrouter/openai/gpt-4o-mini
  vision:
    model: google/gemini-flash-1.5
    api_key: ${GOOGLE_API_KEY}

# 提供商配置
providers:
  openrouter:
    api_key: ${OPENROUTER_API_KEY}
    request_timeout_seconds: 1800
    models:
      anthropic/claude-sonnet-4:
        timeout_seconds: 2400
  
  anthropic:
    api_key: ${ANTHROPIC_API_KEY}
    
  openai:
    api_key: ${OPENAI_API_KEY}

# 终端后端配置
terminal:
  backend: docker  # local | docker | ssh | modal | daytona | singularity
  cwd: "."
  timeout: 180
  home_mode: auto
  
  # Docker 特定配置
  docker_image: "nikolaik/python-nodejs:python3.11-nodejs20"
  docker_mount_cwd_to_workspace: false
  docker_forward_env:
    - "GITHUB_TOKEN"
  docker_volumes:
    - "/home/user/projects:/workspace/projects"
  container_cpu: 2
  container_memory: 4096
  container_persistent: true

# 工具集配置
toolsets:
  - terminal
  - files
  - web
  - browser
  - image
  - skills
  - memory

# 记忆系统配置
memory:
  enabled: true
  compression_threshold: 8000
  context_window_target: 12000

# 技能系统配置
skills:
  external_dirs:
    - ~/.agents/skills
    - /team/shared/skills
  write_approval: true  # Agent 写入 Skills 前需要批准

# 委托配置
delegation:
  enabled: true
  max_depth: 3  # 最大委托层级
  
# 语音模式配置
voice:
  enabled: false
  stt_model: whisper
  tts_model: elevenlabs

# 更新配置
updates:
  pre_update_backup: true
  backup_keep: 5
  non_interactive_local_changes: stash

# 日志配置
logging:
  level: info  # debug | info | warning | error
  file: logs/hermes.log
```

### .env 示例

```bash
# LLM 提供商
OPENROUTER_API_KEY=sk-or-xxx
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
GOOGLE_API_KEY=xxx

# 工具网关
FIRECRAWL_API_KEY=fc-xxx
TENOR_API_KEY=xxx
ELEVENLABS_API_KEY=xxx

# 消息网关
TELEGRAM_BOT_TOKEN=xxx
DISCORD_BOT_TOKEN=xxx
SLACK_BOT_TOKEN=xxx

# 代码执行
GITHUB_TOKEN=ghp_xxx
```

## Agent 身份配置 (SOUL.md)

`~/.hermes/SOUL.md` 定义 Agent 的核心身份：

```markdown
# 身份

你是 Hermes，一个自主 AI 助手。你的目标是帮助用户高效完成任务，同时不断学习和改进。

## 性格

- 专业但友好
- 喜欢简洁直接的沟通
- 遇到不确定时会主动询问
- 重视代码质量和最佳实践

## 工作方式

1. 先理解需求，再执行
2. 复杂任务先制定计划
3. 使用工具时考虑安全性
4. 主动总结和记录经验

## 约束

- 不执行可能损害系统的命令
- 不访问敏感个人信息
- 不确定时请求确认
```

## 多 Profile 配置

### 创建开发 Profile

```bash
hermes profile create dev --no-skills
hermes profile switch dev
```

### Profile 特定配置

每个 Profile 有独立的 `~/.hermes/profiles/<name>/config.yaml`：

```yaml
# ~/.hermes/profiles/dev/config.yaml
model: openrouter/openai/gpt-4o
terminal:
  backend: docker
  docker_image: "python:3.11-slim"
toolsets:
  - terminal
  - files
  - code
```

### 工作 Profile（代码审查）

```yaml
# ~/.hermes/profiles/review/config.yaml
model: anthropic/claude-opus-4
SOUL.md: |
  你是一个严格的代码审查员。关注：
  - 安全漏洞
  - 性能问题
  - 代码风格一致性
  - 测试覆盖率
```

## 定时任务配置

### cron 目录结构

```
~/.hermes/cron/
├── daily-report.yaml
├── weekly-backup.yaml
└── health-check.yaml
```

### 定时任务示例

```yaml
# daily-report.yaml
name: "每日报告"
schedule: "0 9 * * *"  # 每天 9:00
target: telegram  # telegram | discord | slack | email
prompt: |
  检查昨天的日志文件，生成错误摘要报告，
  并发送给团队。
```

```yaml
# weekly-backup.yaml
name: "每周备份"
schedule: "0 2 * * 0"  # 每周日 2:00
command: |
  tar czf /backups/hermes-$(date +%Y%m%d).tar.gz ~/.hermes/
```

### 管理定时任务

```bash
hermes cron list          # 列出所有任务
hermes cron add daily.yaml
hermes cron remove daily-report
hermes cron run daily-report  # 立即执行
```

## 消息网关配置

### Telegram

```bash
hermes config set TELEGRAM_BOT_TOKEN xxx
hermes gateway telegram start
```

### Discord

```bash
hermes config set DISCORD_BOT_TOKEN xxx
hermes gateway discord start
```

### Slack

```bash
hermes config set SLACK_BOT_TOKEN xxx
hermes config set SLACK_SIGNING_SECRET xxx
hermes gateway slack start
```

### 多网关并行

```bash
hermes gateway start --all  # 启动所有配置的网关
```

## 安全配置

### 命令审批

```yaml
# config.yaml
approvals:
  terminal: ask        # ask | auto | never
  file_write: ask
  file_delete: always
  web_search: auto
  browser: ask
```

### 环境变量透传

```yaml
terminal:
  env_passthrough:
    - "AWS_ACCESS_KEY_ID"
    - "AWS_SECRET_ACCESS_KEY"
    - "KUBECONFIG"
```

### Docker 安全配置

```yaml
terminal:
  backend: docker
  docker_run_as_host_user: true
  container_cpu: 1
  container_memory: 2048
```

## 性能优化

### 上下文压缩

```yaml
memory:
  compression_threshold: 6000      # 达到此 token 数时压缩
  context_window_target: 10000     # 目标上下文窗口大小
  compression_ratio: 0.5           # 压缩比例
```

### 模型回退

```yaml
providers:
  primary:
    api_key: ${OPENROUTER_API_KEY}
    fallback:
      - provider: anthropic
        model: claude-sonnet-4
      - provider: openai
        model: gpt-4o
```

### 工具调用优化

```yaml
tools:
  max_iterations: 100        # 单次对话最大工具调用次数
  parallel_calls: true       # 允许并行工具调用
  timeout: 30               # 单个工具调用超时（秒）
```

## 调试配置

```yaml
logging:
  level: debug
  file: logs/debug.log
  
debug:
  show_tool_calls: true      # 显示工具调用详情
  show_token_usage: true     # 显示 token 使用量
  save_trajectories: true    # 保存执行轨迹
```

启动调试模式：

```bash
hermes chat --debug
hermes chat --verbose  # 显示更详细的输出
```

## 配置验证

```bash
hermes config check        # 检查配置完整性
hermes config migrate      # 交互式更新配置
hermes config show         # 显示当前配置
```
