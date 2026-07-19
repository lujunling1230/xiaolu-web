/**
 * 通用 AI Chat API（Vercel Serverless Function）
 * POST /api/ai
 *
 * 前端不再持有任何 API Key，统一通过此代理转发请求。
 * 密钥从 Vercel 环境变量读取，不暴露给前端。
 */

const AI_API_KEY = process.env.DASHSCOPE_API_KEY;
const AI_API_URL  = process.env.DASHSCOPE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { systemPrompt, messages, model, temperature, maxTokens } = req.body ?? {};

    if (!systemPrompt && !(messages?.length)) {
      return res.status(400).json({ error: "缺少 systemPrompt 或 messages" });
    }

    if (!AI_API_KEY) {
      return res.status(500).json({ error: "AI 服务未配置" });
    }

    const formattedMessages = [];
    if (systemPrompt) {
      formattedMessages.push({ role: "system", content: systemPrompt });
    }
    if (Array.isArray(messages)) {
      for (const m of messages) {
        if (m.role && m.content) formattedMessages.push({ role: m.role, content: m.content });
      }
    }

    const body = {
      model: model || "deepseek-r1",
      messages: formattedMessages,
      temperature: temperature ?? 0.7,
      max_tokens: maxTokens || 200,
    };

    const aiRes = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!aiRes.ok) {
      const status = aiRes.status;
      let errInfo = "";
      try {
        const errJson = await aiRes.json();
        errInfo = errJson?.error?.message || JSON.stringify(errJson);
      } catch {
        errInfo = await aiRes.text();
      }
      console.error("[api/ai] upstream error:", status, errInfo);
      return res.status(502).json({ error: "AI 服务调用失败: " + status });
    }

    const aiJson = await aiRes.json();
    const content = aiJson?.choices?.[0]?.message?.content;

    if (typeof content === "string" && content.trim()) {
      return res.status(200).json({ content: content.trim() });
    }

    console.error("[api/ai] empty response:", JSON.stringify(aiJson).slice(0, 300));
    return res.status(502).json({ error: "AI 返回内容为空" });
  } catch (error) {
    console.error("[api/ai] handler error:", error);
    return res.status(500).json({ error: "服务器内部错误" });
  }
}
