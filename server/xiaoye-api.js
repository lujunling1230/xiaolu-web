/**
 * 小叶 AI 助手后端 API
 * 启动：node server/xiaoye-api.js
 * 依赖：npm install express cors
 *
 * 环境变量：
 *   DEEPSEEK_API_KEY=sk-xxx  （DeepSeek API 密钥）
 *   PORT=3001                （可选，默认 3001）
 */

const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.DEEPSEEK_API_KEY;

/* ---------- 读取 System Prompt + 知识库 ---------- */
const SYSTEM_PROMPT = fs.readFileSync(
  path.join(__dirname, "xiaoye-system-prompt.txt"),
  "utf-8"
);
const KNOWLEDGE = JSON.parse(
  fs.readFileSync(path.join(__dirname, "xiaoye-knowledge.json"), "utf-8")
);

const FULL_SYSTEM = `${SYSTEM_PROMPT}\n\n## 知识库\n${JSON.stringify(
  KNOWLEDGE,
  null,
  2
)}`;

/* ---------- /api/ask ---------- */
app.post("/api/ask", async (req, res) => {
  const { question } = req.body;
  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "question is required" });
  }

  /* 没有 API Key 时返回本地兜底回复 */
  if (!API_KEY) {
    const fallback = getLocalReply(question);
    return res.json({ answer: fallback });
  }

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: FULL_SYSTEM },
          { role: "user", content: question },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("DeepSeek API error:", err);
      return res.json({
        answer:
          "这个问题超出了我的知识范围啦～我是专门介绍路俊玲作品集的助手，你可以问问她的具体项目哦。",
      });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || "";
    res.json({ answer });
  } catch (err) {
    console.error("API call failed:", err);
    res.json({
      answer:
        "这个问题超出了我的知识范围啦～我是专门介绍路俊玲作品集的助手，你可以问问她的具体项目哦。",
    });
  }
});

/* ---------- 本地兜底回复（关键词匹配） ---------- */
function getLocalReply(q) {
  const lower = q.toLowerCase();
  const { projects, persona, methodology, job_search } = KNOWLEDGE;

  if (lower.includes("项目") || lower.includes("作品") || lower.includes("拿手")) {
    return `俊玲最拿手的项目是「${projects[0].name}」——${projects[0].tagline}。她用游戏化思维解决拖延症，体现了行为心理学 + 产品化的能力 🎮`;
  }
  if (lower.includes("漫游") || lower.includes("指南") || lower.includes("旅行")) {
    const p = projects.find((x) => x.name === "漫游指南");
    return `「漫游指南」的设计思路是：用真实地图 API 替代油画壁纸，保留文艺感的同时提升精准度。核心解决「攻略信息过载」的痛点 🗺️`;
  }
  if (lower.includes("ai") || lower.includes("pm") || lower.includes("产品经理")) {
    return `俊玲认为 AI PM 的核心不是「会用 AI 工具」，而是「知道在哪用、用多少、何时不用」。技术是骨架，人文是血肉 🌿`;
  }
  if (lower.includes("通关")) {
    const p = projects.find((x) => x.name === "通关清单");
    return `「通关清单」把人生变成 RPG，用经验值和成就解锁解决拖延症。选择 RPG 而非清单，因为即时反馈比「打勾」更有驱动力 ⚔️`;
  }
  if (lower.includes("回血")) {
    const p = projects.find((x) => x.name === "回血清单");
    return `「回血清单」每天推荐一件滋养自己的小事，情绪联动 + 追踪记录。不做 APP 做轻量页面，降低使用门槛 🌱`;
  }
  if (lower.includes("感恩")) {
    const p = projects.find((x) => x.name === "感恩日记");
    return `「感恩日记」用引导关键词替代写作要求，降低冷启动焦虑。每天写三件小事，给自己留一个温柔的角落 📝`;
  }
  if (lower.includes("求职") || lower.includes("方向") || lower.includes("团队")) {
    return `俊玲目标是 AI 应用落地型产品经理，偏好 AI 教育、健康/心理、文旅/内容、工具/效率等需要人文关怀的场景 💼`;
  }
  if (lower.includes("是谁") || lower.includes("介绍") || lower.includes("背景")) {
    return `路俊玲是一位应届毕业生，软件工程专业出身，对 AI 产品有浓厚兴趣。她关注技术可行性与人文温度的结合，定位是「最会用技术讲故事的 PM」✨`;
  }

  return "这个问题超出了我的知识范围啦～我是专门介绍路俊玲作品集的助手，你可以问问她的具体项目哦。";
}

app.listen(PORT, () => {
  console.log(`🌿 小叶 API 已启动：http://localhost:${PORT}/api/ask`);
  if (!API_KEY) {
    console.log("⚠️  未设置 DEEPSEEK_API_KEY，使用本地兜底回复");
  }
});
