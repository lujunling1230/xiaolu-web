/**
 * AI Travel API
 * POST /api/ai-travel  -> 调用通义千问 DashScope，返回城市推荐或攻略生成结果
 */

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;
const DASHSCOPE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const MODEL = "qwen-plus";

export default async function handler(req, res) {
  // 只允许 POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { action, payload } = req.body;

    if (!action || !payload) {
      return res.status(400).json({ error: "缺少 action 或 payload" });
    }

    if (!DASHSCOPE_API_KEY) {
      return res.status(500).json({ error: "AI 服务未配置" });
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "recommend") {
      // 反向推荐：根据条件推荐城市
      systemPrompt = `你是一位熟悉中国旅行、文笔优美的文艺向导"小叶"。你的推荐要有画面感、打动人心，像给朋友写信一样自然。推荐必须涵盖"吃喝住玩"四个方面。

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
- play 必须包含 3 个具体可玩的体验（景点+体验感），要有画面感，比如"在漓江竹筏上看晨雾散开"而不是只写"漓江竹筏"
- food 列出 3 道当地必吃特色美食，附带简短描述如"酸辣鲜香，配米线绝了"
- accommodation 说明推荐住哪个区域、什么类型的住宿、大概人均价格
- transport 说明怎么去最方便，到了之后市内用什么交通
- coord 必须是真实的经纬度数值
- summary 要像朋友推荐一样亲切
- play、food、accommodation、transport 四个字段缺一不可`;

      const { season, budget, pace, interests, people, specialNeeds } = payload;
      userPrompt = `我想去旅行。${season ? `季节偏好：${season}。` : ""}${budget ? `预算：${budget}。` : ""}${pace ? `节奏：${pace}。` : ""}${interests?.length ? `感兴趣：${interests.join("、")}。` : ""}${people ? `出行人数：${people}。` : ""}${specialNeeds?.length ? `特殊需求：${specialNeeds.join("、")}。` : ""}请推荐适合我的城市。`;

    } else if (action === "generate") {
      // 正向生成：根据城市生成攻略
      systemPrompt = `你是一位熟悉中国旅行、文笔优美的文艺向导"小叶"。请为指定城市生成一份详细的旅行攻略。

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
- theme 要有文艺气息，如"古城初见 · 洱海日落"
- budget_breakdown 给出合理的预算区间和建议`;

      const { city_name, days, pace } = payload;
      userPrompt = `请为${city_name}生成一份${days || 3}天旅行攻略。${pace ? `节奏偏好：${pace}。` : ""}`;

    } else {
      return res.status(400).json({ error: "不支持的 action: " + action });
    }

    // 调用 DashScope API
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
      console.error("[ai-travel] DashScope error:", dashRes.status, errText);
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
      // 策略 1：直接解析（response_format 已强制 JSON）
      try {
        parsed = JSON.parse(content.trim());
      } catch (e1) {
        // 策略 2：从 markdown code block 提取
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[1].trim());
        } else {
          // 策略 3：提取第一个 { 到最后一个 } 之间的内容
          const firstBrace = content.indexOf("{");
          const lastBrace = content.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const jsonStr = content.slice(firstBrace, lastBrace + 1);
            parsed = JSON.parse(jsonStr);
          } else {
            throw e1;
          }
        }
      }
    } catch (e) {
      console.error("[ai-travel] JSON parse error:", e.message, "content (first 500):", content.slice(0, 500));
      // 如果解析失败，返回原始内容让前端处理
      return res.status(200).json({ raw: content, error: "AI 返回格式异常，已使用备用推荐" });
    }

    return res.status(200).json({ action, data: parsed });

  } catch (error) {
    console.error("[ai-travel] handler error:", error);
    return res.status(500).json({ error: "服务器内部错误" });
  }
}
