#!/usr/bin/env python3
"""
Step 1: Hermes Agent 配置脚本

配置 Hermes 使用 DashScope（通义千问）作为模型提供商。
Hermes 支持任何 OpenAI 兼容的 API 端点。

用法:
    python setup_hermes.py --api-key sk-xxxx --base-url https://dashscope.aliyuncs.com/compatible-mode/v1 --model qwen-plus

如果不传参数，会使用 .env 文件中的配置。
"""

import json
import os
import sys
from pathlib import Path

# Hermes 配置目录
HERMES_CONFIG_DIR = Path.home() / ".hermes"
HERMES_CONFIG_FILE = HERMES_CONFIG_DIR / "config.json"
HERMES_ENV_FILE = HERMES_CONFIG_DIR / ".env"


def write_config(api_key: str, base_url: str, model: str):
    """写入 Hermes 配置文件"""

    # 1. 写入 config.json
    HERMES_CONFIG_DIR.mkdir(parents=True, exist_ok=True)

    config = {
        "model": {
            "default": model,
            "provider": "custom",
        },
        "provider": {
            "name": "custom",
            "base_url": base_url,
            "api_key": api_key,
        },
        "iterations": 10,
        "auto_compress": True,
        "session_reset_threshold": 100000,
    }

    # 如果已有配置，合并
    if HERMES_CONFIG_FILE.exists():
        try:
            existing = json.loads(HERMES_CONFIG_FILE.read_text(encoding="utf-8"))
            existing.update(config)
            config = existing
        except Exception:
            pass

    HERMES_CONFIG_FILE.write_text(
        json.dumps(config, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"[OK] 配置已写入: {HERMES_CONFIG_FILE}")

    # 2. 写入 .env 文件
    env_lines = [
        f"# Hermes Agent 环境变量 — 由 setup_hermes.py 生成",
        f"OPENAI_API_KEY={api_key}",
        f"OPENAI_BASE_URL={base_url}",
        f"HERMES_MODEL={model}",
        f"# 可选：如果使用 Nous Portal",
        f"# NOUS_API_KEY=",
    ]
    HERMES_ENV_FILE.write_text("\n".join(env_lines) + "\n", encoding="utf-8")
    print(f"[OK] 环境变量已写入: {HERMES_ENV_FILE}")

    # 3. 验证配置
    print("\n--- 配置摘要 ---")
    print(f"  模型提供商: custom (OpenAI 兼容)")
    print(f"  API 端点:   {base_url}")
    print(f"  默认模型:   {model}")
    print(f"  API Key:    {api_key[:8]}...{api_key[-4:]}")
    print()


def main():
    import argparse

    parser = argparse.ArgumentParser(description="配置 Hermes Agent 模型提供商")
    parser.add_argument("--api-key", help="API Key（DashScope: sk-xxx）")
    parser.add_argument(
        "--base-url",
        default="https://dashscope.aliyuncs.com/compatible-mode/v1",
        help="OpenAI 兼容 API 端点",
    )
    parser.add_argument("--model", default="qwen-plus", help="默认模型名称")
    args = parser.parse_args()

    api_key = args.api_key
    if not api_key:
        # 尝试从环境变量读取
        api_key = os.environ.get("DASHSCOPE_API_KEY", "")
        if not api_key:
            print("[ERROR] 未提供 API Key")
            print("用法: python setup_hermes.py --api-key sk-xxxx")
            print("或设置环境变量 DASHSCOPE_API_KEY")
            sys.exit(1)

    write_config(api_key, args.base_url, args.model)
    print("[DONE] Hermes 配置完成！下一步运行:")
    print("  python custom_agent.py      # 测试 Agent")
    print("  python generate_benchmark.py # 生成 20 条评测集")
    print("  python run_eval.py           # 执行评测")


if __name__ == "__main__":
    main()
