#!/usr/bin/env python3
"""
Step 2: 自定义 Hermes Agent 定义

这个文件定义了一个自定义 Agent，它：
1. 使用 Hermes 配置的模型提供商（DashScope/OpenAI 兼容）
2. 通过 OpenAI SDK 发送请求（Hermes 内部也是用这个）
3. 支持系统提示词、多轮对话、温度控制
4. 可以被评测框架直接调用

核心概念：
  - Agent = 系统提示词 + 模型 + 工具调用能力
  - Hermes 的"自学习"能力体现在：记忆管理、技能创建、会话搜索
  - 在评测场景中，我们主要测试 Agent 的"单轮任务执行能力"
"""

import json
import os
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

# 尝试导入 openai SDK（Hermes 内部使用的同一个）
try:
    from openai import OpenAI
except ImportError:
    print("[ERROR] 需要安装 openai: pip install openai")
    raise


# ─── Hermes 配置加载 ───────────────────────────────────────────

def load_hermes_config() -> Dict[str, str]:
    """从 ~/.hermes/ 加载配置"""
    config_dir = Path.home() / ".hermes"
    config_file = config_dir / "config.json"
    env_file = config_dir / ".env"

    config = {}

    # 1. 从 .env 加载
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                config[k.strip()] = v.strip()

    # 2. 从 config.json 加载（覆盖 .env）
    if config_file.exists():
        try:
            json_config = json.loads(config_file.read_text(encoding="utf-8"))
            provider = json_config.get("provider", {})
            model_cfg = json_config.get("model", {})
            if isinstance(model_cfg, dict):
                config.setdefault("HERMES_MODEL", model_cfg.get("default", "qwen-plus"))
            if "base_url" in provider:
                config.setdefault("OPENAI_BASE_URL", provider["base_url"])
            if "api_key" in provider:
                config.setdefault("OPENAI_API_KEY", provider["api_key"])
        except Exception:
            pass

    # 3. 环境变量作为最终 fallback
    config.setdefault("OPENAI_API_KEY", os.environ.get("DASHSCOPE_API_KEY", ""))
    config.setdefault("OPENAI_BASE_URL", "https://dashscope.aliyuncs.com/compatible-mode/v1")
    config.setdefault("HERMES_MODEL", "qwen-plus")

    return config


# ─── 自定义 Agent ──────────────────────────────────────────────

class HermesCustomAgent:
    """
    自定义 Hermes Agent

    一个 Agent 由以下部分组成：
      - name: Agent 名称
      - system_prompt: 系统提示词（定义 Agent 的人格和能力）
      - model: 使用的 LLM 模型
      - temperature: 生成温度
      - max_tokens: 最大输出 token 数
      - skills: Agent 拥有的技能描述（让模型知道自己能做什么）
    """

    def __init__(
        self,
        name: str = "评测助手",
        system_prompt: str = "",
        model: str = "",
        temperature: float = 0.7,
        max_tokens: int = 2000,
        skills: Optional[List[str]] = None,
    ):
        config = load_hermes_config()

        self.name = name
        self.model = model or config.get("HERMES_MODEL", "qwen-plus")
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.api_key = config.get("OPENAI_API_KEY", "")
        self.base_url = config.get("OPENAI_BASE_URL", "")

        # 默认系统提示词
        self.system_prompt = system_prompt or self._default_system_prompt()
        self.skills = skills or ["信息检索", "代码编写", "分析推理", "文档撰写"]

        # 初始化 OpenAI 客户端（Hermes 内部也是用这个客户端）
        if not self.api_key:
            raise ValueError(
                "未找到 API Key。请先运行: python setup_hermes.py --api-key sk-xxxx"
            )

        self.client = OpenAI(api_key=self.api_key, base_url=self.base_url)

        # 会话历史（模拟 Hermes 的记忆功能）
        self.history: List[Dict[str, str]] = []

        print(f"[OK] Agent '{self.name}' 初始化完成")
        print(f"     模型: {self.model}")
        print(f"     端点: {self.base_url}")
        print(f"     技能: {', '.join(self.skills)}")

    def _default_system_prompt(self) -> str:
        """默认系统提示词"""
        return (
            "你是一个由 Hermes Agent 框架驱动的智能助手。"
            "你具备以下能力：信息检索、代码编写、分析推理、文档撰写。"
            "请用中文回答，回答要准确、简洁、有条理。"
        )

    def chat(self, user_message: str, use_history: bool = False) -> str:
        """
        发送消息并获取回复

        Args:
            user_message: 用户消息
            use_history: 是否使用会话历史（多轮对话）

        Returns:
            Agent 的回复文本
        """
        messages = [{"role": "system", "content": self.system_prompt}]

        if use_history:
            messages.extend(self.history)

        messages.append({"role": "user", "content": user_message})

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
            )

            reply = response.choices[0].message.content or ""

            # 更新历史
            if use_history:
                self.history.append({"role": "user", "content": user_message})
                self.history.append({"role": "assistant", "content": reply})

            return reply.strip()

        except Exception as e:
            return f"[Agent 错误] {str(e)}"

    def chat_with_prompt(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = None,
        max_tokens: int = None,
    ) -> str:
        """
        使用自定义系统提示词发送单次消息（评测用）

        这个方法允许每条评测用例使用不同的系统提示词，
        适用于角色扮演、情感对话等场景。
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message},
                ],
                temperature=temperature if temperature is not None else self.temperature,
                max_tokens=max_tokens or self.max_tokens,
            )
            return (response.choices[0].message.content or "").strip()
        except Exception as e:
            return f"[Agent 错误] {str(e)}"

    def reset_history(self):
        """清空会话历史"""
        self.history.clear()

    def to_dict(self) -> Dict[str, Any]:
        """序列化 Agent 信息"""
        return {
            "name": self.name,
            "model": self.model,
            "system_prompt": self.system_prompt[:100] + "...",
            "skills": self.skills,
            "history_length": len(self.history),
        }


# ─── 测试入口 ──────────────────────────────────────────────────

def main():
    """快速测试 Agent 是否正常工作"""
    print("=" * 60)
    print("Hermes 自定义 Agent 测试")
    print("=" * 60)

    try:
        agent = HermesCustomAgent(
            name="测试Agent",
            system_prompt="你是一个简洁的中文助手，回答不超过50字。",
        )
    except ValueError as e:
        print(f"\n[ERROR] {e}")
        return

    # 测试单轮对话
    print("\n--- 测试 1: 单轮对话 ---")
    reply = agent.chat("你好，请用一句话介绍你自己。")
    print(f"用户: 你好，请用一句话介绍你自己。")
    print(f"Agent: {reply}")

    # 测试自定义提示词
    print("\n--- 测试 2: 自定义系统提示词 ---")
    reply = agent.chat_with_prompt(
        system_prompt="你是胡一菲，性格霸气直接，说话简短有力。",
        user_message="我今天好累",
    )
    print(f"用户: 我今天好累")
    print(f"Agent (胡一菲): {reply}")

    print("\n[OK] Agent 测试通过！可以运行评测了。")


if __name__ == "__main__":
    main()
