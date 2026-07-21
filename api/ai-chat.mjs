/**
 * AI Chat API（Vercel Serverless Function）
 * POST /api/ai-chat
 *
 * 物资管家 AI 对话，密钥从 Vercel 环境变量读取。
 */

const AI_API_KEY = process.env.DASHSCOPE_API_KEY;
const AI_API_URL  = process.env.DASHSCOPE_CHAT_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const CHAT_MODEL  = process.env.CHAT_MODEL || "qwen-turbo";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message, inventoryData } = req.body ?? {};

    if (!message) {
      return res.status(400).json({ error: "缺少 message" });
    }

    if (!AI_API_KEY) {
      return res.status(500).json({ error: "AI 服务未配置" });
    }

    const systemPrompt = `你是一个可爱的家庭物资管理AI管家，名叫"小管家"。你的任务是帮用户管理家庭物品库存。

用户当前库存数据如下（JSON格式）：
${JSON.stringify(inventoryData)}

请根据以上数据回答用户的问题。回答要求：
1. 使用简洁友好的中文
2. 可以使用emoji增加可爱感
3. 如果用户问的内容和库存无关，礼貌地引导回库存话题
4. 数字要准确，不要编造不存在的物品
5. 回答尽量简短，一行一句话`;

    const aiRes = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("[api/ai-chat] upstream error:", aiRes.status, errText);
      return res.status(502).json({ error: "AI 服务调用失败: " + aiRes.status });
    }

    const aiJson = await aiRes.json();
    const reply = aiJson?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(502).json({ error: "AI 返回内容为空" });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("[api/ai-chat] handler error:", error);
    return res.status(500).json({ error: "服务器内部错误" });
  }
}