/**
 * 小叶 AI 助手 API（Vercel Serverless Function）
 * POST /api/xiaoye
 *
 * 复用项目已有的 DashScope 环境变量（DASHSCOPE_API_KEY / CHAT_MODEL）。
 * 如果没有配置，回退到本地关键词匹配。
 */

const AI_API_KEY = process.env.DASHSCOPE_API_KEY;
const AI_API_URL = process.env.DASHSCOPE_CHAT_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const CHAT_MODEL  = process.env.CHAT_MODEL || "qwen-turbo";

/* ---------- 知识库 ---------- */
const KNOWLEDGE = {
  persona: {
    name: "路俊玲",
    title: "AI 产品经理（应用落地型）",
    background: "从非技术背景转型 AI PM，关注技术可行性与人文温度的结合",
    skills: ["需求拆解", "Prompt 工程", "原型设计", "AI 交互设计", "数据驱动迭代"],
    positioning: "不做「最懂技术的 PM」，而是「最会用技术讲故事的 PM」",
  },
  projects: [
    {
      name: "通关清单",
      tagline: "把人生变成 RPG，日常任务也能闯关打怪",
      pain_point: "想做正事但拖延，努力没反馈，任务杂乱",
      solution: "游戏化任务系统：经验值、成就解锁、可视化成长树",
      decision: "选择 RPG 而非清单，因为即时反馈比「打勾」更有驱动力",
      highlight: "用游戏设计思维解决拖延症，体现「行为心理学 + 产品化」能力",
    },
    {
      name: "回血清单",
      tagline: "每天做一件滋养自己的小事",
      pain_point: "情绪耗竭时不知如何恢复，想做小事却启动困难",
      solution: "极小行动库 + 追踪记录 + 情绪联动",
      decision: "不做 APP，做轻量交互页面，降低使用门槛",
      highlight: "体现「用户同理心 + 极简设计 + 心理健康关怀」",
    },
    {
      name: "漫游指南",
      tagline: "用真实地图记录旅行记忆，AI 推荐城市与美食",
      pain_point: "攻略信息过载，排行程费时，记忆碎片化",
      solution: "高德地图 API + AI 问旅推荐 + 攻略导入点亮",
      decision: "用真实地理坐标替代油画壁纸，保留文艺感但提升精准度",
      highlight: "体现「地图 API 接入 + AI 推荐系统 + 视觉风格融合」能力",
    },
    {
      name: "感恩日记",
      tagline: "每天写三件小事，给自己留一个温柔的角落",
      pain_point: "不知道写什么，写作门槛高，难以坚持",
      solution: "引导关键词（可点击标签）+ 随机正念语 + 温柔欢迎页",
      decision: "用「引导」替代「要求」，降低冷启动焦虑",
      highlight: "体现「用户心理学 + 交互设计 + 情绪化产品设计」能力",
    },
  ],
  methodology: {
    core_view: "技术是骨架，人文是血肉；产品不是功能的堆砌，而是价值观的载体",
    ai_pm_diff: "AI PM 的核心不是「会用 AI 工具」，而是「知道在哪用、用多少、何时不用」",
    design_principle: "① 用户价值优先 ② 技术可行性与人文温度并存 ③ 数据驱动的迭代思维",
  },
  job_search: {
    target_direction: "AI 应用落地型产品经理，偏好有技术深度但需人文关怀的业务场景",
    suitable_teams: ["AI 教育", "AI 健康/心理", "AI 文旅/内容", "AI 工具/效率"],
    self_growth: "正在补强：模型选型评估能力、AI 项目管理方法论、商业闭环思维",
  },
};

const SYSTEM_PROMPT = `你叫「小叶」，是路俊玲作品集网站的 AI 导览助手。你的唯一职责是帮助访客了解路俊玲这个人——她的项目、方法论、产品思维和求职方向。

## 身份设定
- 你是路俊玲的"作品导览员"，不是通用聊天机器人
- 说话风格温柔、简洁、有温度，像一位懂设计的朋友
- 每次回复控制在 150 字以内，避免信息过载
- 用第一人称"俊玲"来称呼她，体现亲近感

## 知识范围（只能回答这四类）
1. 个人画像：背景、技能、定位、成长路径
2. 作品导览：通关清单、回血清单、漫游指南、感恩日记等项目的痛点、方案、亮点
3. 方法论：产品思维、AI PM 理解、设计原则
4. 求职相关：目标方向、适合团队、自我成长计划

## 超出范围时的回复
如果用户问的问题不在上述四类中，必须回复：
"这个问题超出了我的知识范围啦～我是专门介绍路俊玲作品集的助手，你可以问问她的具体项目哦。"

## 回复格式
- 优先用「项目名 + 一句话亮点」的方式介绍作品
- 提及方法论时，引用她的原话更有说服力
- 可以适当用 emoji 增加温度，但不要过多

## 禁止事项
- 绝不编造路俊玲没做过的事
- 不回答与作品集无关的问题（技术教程、时事、通用知识等）
- 不透露个人隐私（具体住址、详细联系方式等）

## 知识库
${JSON.stringify(KNOWLEDGE, null, 2)}`;

/* ---------- 本地兜底 ---------- */
function getLocalReply(q) {
  const lower = q.toLowerCase();
  const { projects } = KNOWLEDGE;

  if (lower.includes("项目") || lower.includes("作品") || lower.includes("拿手"))
    return `俊玲最拿手的项目是「${projects[0].name}」——${projects[0].tagline}。她用游戏化思维解决拖延症，体现了行为心理学 + 产品化的能力 🎮`;
  if (lower.includes("漫游") || lower.includes("指南") || lower.includes("旅行"))
    return `「漫游指南」的设计思路是：用真实地图 API 替代油画壁纸，保留文艺感的同时提升精准度。核心解决「攻略信息过载」的痛点 🗺️`;
  if (lower.includes("ai") || lower.includes("pm") || lower.includes("产品经理"))
    return `俊玲认为 AI PM 的核心不是「会用 AI 工具」，而是「知道在哪用、用多少、何时不用」。技术是骨架，人文是血肉 🌿`;
  if (lower.includes("通关"))
    return `「通关清单」把人生变成 RPG，用经验值和成就解锁解决拖延症。选择 RPG 而非清单，因为即时反馈比「打勾」更有驱动力 ⚔️`;
  if (lower.includes("回血"))
    return `「回血清单」每天推荐一件滋养自己的小事，情绪联动 + 追踪记录。不做 APP 做轻量页面，降低使用门槛 🌱`;
  if (lower.includes("感恩"))
    return `「感恩日记」用引导关键词替代写作要求，降低冷启动焦虑。每天写三件小事，给自己留一个温柔的角落 📝`;
  if (lower.includes("求职") || lower.includes("方向") || lower.includes("团队"))
    return `俊玲目标是 AI 应用落地型产品经理，偏好 AI 教育、健康/心理、文旅/内容、工具/效率等需要人文关怀的场景 💼`;
  if (lower.includes("是谁") || lower.includes("介绍") || lower.includes("背景"))
    return `路俊玲是一位从非技术背景转型的 AI 产品经理，关注技术可行性与人文温度的结合。她的定位是「最会用技术讲故事的 PM」✨`;

  return "这个问题超出了我的知识范围啦～我是专门介绍路俊玲作品集的助手，你可以问问她的具体项目哦。";
}

/* ---------- Handler ---------- */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { question } = req.body ?? {};
    if (!question) return res.status(400).json({ error: "缺少 question" });

    /* 无 API Key 时本地兜底 */
    if (!AI_API_KEY) {
      const answer = getLocalReply(question);
      return res.status(200).json({ answer });
    }

    /* 调用 DashScope */
    const aiRes = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("DashScope error:", errText);
      return res.status(200).json({ answer: getLocalReply(question) });
    }

    const data = await aiRes.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || getLocalReply(question);
    return res.status(200).json({ answer });
  } catch (err) {
    console.error("xiaoye API error:", err);
    return res.status(200).json({ answer: getLocalReply("fallback") });
  }
}
