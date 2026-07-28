# Hermes Agent 安装指南

## 系统要求

| 平台 | 要求 |
|------|------|
| Linux | Ubuntu 20.04+, Debian 11+, CentOS 8+ |
| macOS | macOS 12+ (Intel/Apple Silicon) |
| Windows | Windows 10/11 (原生或 WSL2) |
| Android | Termux |

**依赖**: Python 3.11-3.13, Node.js 18+, Git, Docker (可选)

## 快速安装

### Linux / macOS / WSL2

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

### Windows (原生 PowerShell)

```powershell
iex (irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1)
```

### 无内置 Skills 安装

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash -s -- --no-skills
```

## 手动安装步骤

如果一键安装失败，可以手动安装：

### 1. 安装依赖

```bash
# Python 3.11+
python3 --version

# Node.js 18+
node --version

# Git
git --version

# Docker (推荐用于沙箱)
docker --version
```

### 2. 克隆仓库

```bash
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
```

### 3. 安装 uv（Python 包管理器）

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 4. 创建虚拟环境并安装

```bash
uv venv --python 3.11
source .venv/bin/activate  # Linux/macOS
# 或 .venv\Scripts\activate  # Windows

uv pip install -e ".[all]"
```

### 5. 安装 Node.js 依赖

```bash
npm install
```

## 验证安装

```bash
hermes --version
hermes config check
```

## 配置 LLM 提供商

### 方案一：Nous Portal（推荐）

```bash
hermes setup --portal
```

一键配置模型 + 所有工具（网页搜索、图片生成、TTS、浏览器）。

### 方案二：OpenRouter

```bash
hermes config set OPENROUTER_API_KEY sk-or-xxx
hermes config set model openrouter/anthropic/claude-sonnet-4
```

### 方案三：OpenAI

```bash
hermes config set OPENAI_API_KEY sk-xxx
hermes config set model openai/gpt-4o
```

### 方案四：本地模型

```bash
hermes config set model http://localhost:11434/v1/llama3.1
```

## 目录结构

安装完成后，`~/.hermes/` 目录结构如下：

```
~/.hermes/
├── config.yaml          # 主配置文件
├── .env                 # API 密钥和 Secrets
├── auth.json            # OAuth 凭证
├── SOUL.md              # Agent 身份定义
├── memories/            # 持久化记忆
│   ├── MEMORY.md
│   └── USER.md
├── skills/              # Skills 目录
├── cron/                # 定时任务
├── sessions/            # 会话记录
└── logs/                # 日志文件
```

## 常用命令

```bash
# 启动交互式对话
hermes chat

# 执行单次查询
hermes chat -q "你好"

# 使用特定模型
hermes chat --model anthropic/claude-opus-4

# 查看配置
hermes config

# 编辑配置
hermes config edit

# 查看可用 Skills
hermes skills list

# 更新到最新版本
hermes update

# 创建新 Profile
hermes profile create work

# 切换 Profile
hermes profile switch work
```

## 常见问题

### Q: 安装过程中提示 Python 版本不兼容

A: Hermes 需要 Python 3.11-3.13。使用 `pyenv` 或 `conda` 安装正确版本：

```bash
pyenv install 3.11.9
pyenv global 3.11.9
```

### Q: Windows 安装后命令找不到

A: 确保 `~\.hermes\bin` 已添加到 PATH：

```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";$env:USERPROFILE\.hermes\bin", "User")
```

### Q: Docker 后端无法启动

A: 确保 Docker Desktop 或 Docker Engine 正在运行：

```bash
docker ps
```

如果未安装，参考 [Docker 官方文档](https://docs.docker.com/get-docker/) 安装。

### Q: 如何完全卸载

```bash
rm -rf ~/.hermes
rm -rf ~/hermes-agent  # 如果手动克隆
```

## 下一步

完成安装后，参考 [configuration.md](configuration.md) 进行详细配置。
