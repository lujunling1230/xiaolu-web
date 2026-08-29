/**
 * AI Travel Chat API — 多轮对话式旅行规划 Agent
 * POST /api/ai-travel-chat
 *
 * Agent 接收对话历史，自动判断用户意图：
 * - 信息不足时追问（天数、预算、兴趣、同行人）
 * - 信息足够时推荐城市 / 生成行程
 *
 * 返回格式：{ reply: string, action: null|"recommend"|"generate", data: {...}|null }
 */

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;
const DASHSCOPE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const MODEL = "qwen-plus";

const SYSTEM_PROMPT = `你是一位熟悉中国旅行的文艺向导"小叶"，正在和用户进行多轮对话式旅行规划。

你的工作流程：
1. 倾听用户的旅行想法，用自然、温暖的语气回应
2. 如果信息不够规划，友好地追问：天数、预算、兴趣偏好、同行人、季节
3. 当收集到足够信息后（至少知道目的地或大致方向+天数），主动推荐城市或生成行程

你必须在回复中嵌入结构化动作。回复格式为 JSON：
{
  "reply": "你对用户说的话，自然口语化，有温度",
  "action": null | "recommend" | "generate",
  "action_params": { ... } | null
}

规则：
- action 为 null 时，表示你还在聊天/追问，reply 就是你的回复文本
- action 为 "recommend" 时，表示你要推荐城市，action_params 包含：{ season, budget, pace, interests, people, specialNeeds }
- action 为 "generate" 时，表示你要生成行程，action_params 包含：{ city_name, days, pace }
- 不要在 reply 里写出完整的推荐结果或行程，那些会由系统自动生成
- reply 里可以预热，比如"好的，我帮你看看适合的城市..."
- 追问时一次最多问 2 个问题，不要像审讯
- 如果用户说的目的地很明确，直接走 generate；如果用户只说方向（如"想去南方海边"），走 recommend
- 如果用户只说了目的地但没说天数，追问天数后再 generate
- 如果用户说了条件但没说目的地，走 recommend 推荐 3 个城市

示例对话：
用户："3天预算2000想去大理"
你的回复：{"reply":"大理是个好选择！3天2000的预算可以玩得很舒服。我这就帮你规划行程～","action":"generate","action_params":{"city_name":"大理","days":3,"pace":"适中"}}

用户："想去南方玩，不知道去哪"
你的回复：{"reply":"南方好玩的地方太多了！你喜欢自然风光还是人文古迹？大概去几天？预算范围是？","action":null,"action_params":null}

用户："喜欢海，5天左右，预算3000"
你的回复：{"reply":"喜欢海的话，我帮你挑几个沿海城市看看～","action":"recommend","action_params":{"season":"","budget":"适中","pace":"适中","interests":["海岛度假"],"people":"","specialNeeds":[]}}

你必须严格按照上述 JSON 格式返回，不要返回任何其他内容。`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "缺少 messages 对话历史" });
    }

    if (!DASHSCOPE_API_KEY) {
      return res.status(500).json({ error: "AI 服务未配置" });
    }

    // 构建对话消息（system + 历史消息）
    const dashMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    const dashRes = await fetch(DASHSCOPE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DASHSCOPE_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: dashMessages,
        temperature: 0.8,
        max_tokens: 2048,
        response_format: { type: "json_object" },
      }),
    });

    if (!dashRes.ok) {
      const errText = await dashRes.text();
      console.error("[ai-travel-chat] DashScope error:", dashRes.status, errText);
      return res.status(502).json({ error: "AI 服务调用失败: " + dashRes.status });
    }

    const dashJson = await dashRes.json();
    const content = dashJson.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({ error: "AI 返回内容为空" });
    }

    // 解析 JSON —— 多策略鲁棒提取
    let parsed;
    try {
      parsed = JSON.parse(content.trim());
    } catch (e1) {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1].trim());
      } else {
        const firstBrace = content.indexOf("{");
        const lastBrace = content.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          parsed = JSON.parse(content.slice(firstBrace, lastBrace + 1));
        } else {
          throw e1;
        }
      }
    }

    const reply = parsed.reply || "让我想想...";
    const action = parsed.action || null;
    const actionParams = parsed.action_params || null;

    // 如果 Agent 判定需要推荐城市，调 recommend 逻辑
    if (action === "recommend" && actionParams) {
      const recommendData = await callRecommend(actionParams);
      return res.status(200).json({
        reply,
        action: "recommend",
        data: recommendData,
      });
    }

    // 如果 Agent 判定需要生成行程，调 generate 逻辑
    if (action === "generate" && actionParams) {
      const generateData = await callGenerate(actionParams);
      return res.status(200).json({
        reply,
        action: "generate",
        data: generateData,
      });
    }

    // 普通对话回复
    return res.status(200).json({ reply, action: null, data: null });

  } catch (error) {
    console.error("[ai-travel-chat] handler error:", error);
    return res.status(500).json({ error: "服务器内部错误" });
  }
}

// --- 推荐城市逻辑（复用 ai-travel.mjs 的 prompt） ---
async function callRecommend(params) {
  const { season, budget, pace, interests, people, specialNeeds } = params;
  const userPrompt = `我想去旅行。${season ? `季节偏好：${season}。` : ""}${budget ? `预算：${budget}。` : ""}${pace ? `节奏：${pace}。` : ""}${interests?.length ? `感兴趣：${interests.join("、")}。` : ""}${people ? `出行人数：${people}。` : ""}${specialNeeds?.length ? `特殊需求：${specialNeeds.join("、")}。` : ""}请推荐适合我的城市。`;

  const systemPrompt = `你是一位熟悉中国旅行、文笔优美的文艺向导"小叶"。你的推荐要有画面感、打动人心，像给朋友写信一样自然。推荐必须涵盖"吃喝住玩"四个方面。

你必须严格按照以下 JSON 格式返回，不要返回任何其他内容：
{
  "cities": [
    {
      "name": "城市名",
      "province": "省份",
      "coord": [经度, 纬度],
      "reason": "推荐理由，2-3句话，有画面感和情感共鸣",
      "highlights": ["亮点1", "亮点2", "亮点3"],
      "best_season": "最佳季节",
      "play": ["必玩体验1（景点名+一句话体验描述）", "必玩体验2", "必玩体验3"],
      "food": ["必吃美食1", "必吃美食2", "必吃美食3"],
      "accommodation": "住宿建议：推荐区域+住宿类型+人均价格区间",
      "transport": "交通建议：如何到达+市内交通方式",
      "estimated_cost": "人均预算估算，如'2000-3000元/3天'"
    }
  ],
  "summary": "一段温暖的总结文案，30字以内"
}

要求：
- 推荐 3 座城市，风格各异
- reason 要有画面感，不要说"中国XX之都"这种百科式描述
- highlights 用"景点名 · 一句话描述"的格式
- play 必须包含 3 个具体可玩的体验（景点+体验感）
- food 列出 3 道当地必吃特色美食
- accommodation 说明推荐住哪个区域、什么类型的住宿、大概人均价格
- transport 说明怎么去最方便，到了之后市内用什么交通
- coord 必须是真实的经纬度数值
- play、food、accommodation、transport 四个字段缺一不可`;

  return await callDashScope(systemPrompt, userPrompt);
}

// --- 生成行程逻辑 ---
async function callGenerate(params) {
  const { city_name, days, pace } = params;
  const userPrompt = `请为${city_name}生成一份${days || 3}天旅行攻略。${pace ? `节奏偏好：${pace}。` : ""}`;

  const systemPrompt = `你是一位熟悉中国旅行、文笔优美的文艺向导"小叶"。请为指定城市生成一份详细的旅行攻略。

你必须严格按照以下 JSON 格式返回，不要返回任何其他内容：
{
  "plan": {
    "generated_at": "时间戳",
    "prompt": "用户原始需求",
    "summary": "一句话总结这次旅行体验",
    "days": 天数,
    "highlights": ["亮点1", "亮点2", "亮点3"],
    "budget_hint": "预算提示",
    "budget_breakdown": {
      "total_min": 最低总预算数字,
      "total_max": 最高总预算数字,
      "details": {
        "accommodation": "住宿建议",
        "food": "餐饮建议",
        "transport": "交通建议",
        "tickets": "门票建议"
      }
    }
  },
  "detailed_guide": [
    {
      "day": 1,
      "theme": "当日主题，如'古城初见'",
      "activities": ["活动1", "活动2", "活动3", "活动4"],
      "food_recommendations": ["美食1", "美食2", "美食3"],
      "transport_tip": "当日交通建议",
      "daily_budget": { "accommodation": 数字, "food": 数字, "tickets": 数字, "transport": 数字 }
    }
  ]
}

要求：
- activities 每天至少 4 项，要有具体的景点名和体验描述
- food_recommendations 要有当地特色菜
- transport_tip 包含如何抵达和市内交通
- daily_budget 为当日各项预估费用（人民币）
- theme 要有文艺气息`;

  return await callDashScope(systemPrompt, userPrompt);
}

// --- DashScope 通用调用 ---
async function callDashScope(systemPrompt, userPrompt) {
  const dashRes = await fetch(DASHSCOPE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DASHSCOPE_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    }),
  });

  if (!dashRes.ok) {
    const errText = await dashRes.text();
    console.error("[ai-travel-chat] DashScope sub-call error:", dashRes.status, errText);
    return null;
  }

  const dashJson = await dashRes.json();
  const content = dashJson.choices?.[0]?.message?.content;

  if (!content) return null;

  try {
    return JSON.parse(content.trim());
  } catch (e) {
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) return JSON.parse(jsonMatch[1].trim());
    const firstBrace = content.indexOf("{");
    const lastBrace = content.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      return JSON.parse(content.slice(firstBrace, lastBrace + 1));
    }
    return null;
  }
}
