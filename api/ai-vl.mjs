/**
 * AI Vision API（Vercel Serverless Function）
 * POST /api/ai-vl
 *
 * 用于库存管理页面的图片识别，密钥从 Vercel 环境变量读取。
 */

const AI_API_KEY = process.env.DASHSCOPE_API_KEY;
const AI_API_URL  = process.env.DASHSCOPE_VL_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const VL_MODEL     = process.env.VL_MODEL || "qwen-vl-plus";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { base64Image, prompt } = req.body ?? {};

    if (!base64Image) {
      return res.status(400).json({ error: "缺少 base64Image" });
    }

    if (!AI_API_KEY) {
      return res.status(500).json({ error: "AI 服务未配置" });
    }

    const systemText = prompt || '识别图片中的物品，返回JSON数组。每个物品包含：name（名称，必填）、count（数量，数字）、unit（单位，如瓶/盒/袋/罐/箱/个/支）、expiryDate（到期日，YYYY-MM-DD格式，如不确定可留空）、location（存放位置，如冰箱/浴室/储物间/厨房/客厅/卧室）、confidence（置信度0-100）。只返回JSON数组，不要其他文字。';

    const aiRes = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: VL_MODEL,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: systemText },
              { type: "image_url", image_url: { url: base64Image } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("[api/ai-vl] upstream error:", aiRes.status, errText);
      return res.status(502).json({ error: "AI 服务调用失败: " + aiRes.status });
    }

    const aiJson = await aiRes.json();
    const content = aiJson?.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({ error: "AI 返回内容为空" });
    }

    return res.status(200).json({ content });
  } catch (error) {
    console.error("[api/ai-vl] handler error:", error);
    return res.status(500).json({ error: "服务器内部错误" });
  }
}
