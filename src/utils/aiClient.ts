/**
 * AI 通用调用客户端
 * 与「解忧杂货店」共用同一套环境变量配置
 */

export interface CallAIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * 调用 AI 接口（支持历史上下文）
 * @param systemPrompt - 系统人设（system role）
 * @param messages - 历史消息数组 {role, content}[]
 * @param options - 可选参数
 * @returns AI 回复文本，失败时返回兜底文案
 */
export async function callAI(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  options: CallAIOptions = {}
): Promise<string> {
  const apiUrl = import.meta.env.VITE_AI_API_URL;
  const apiKey = import.meta.env.VITE_AI_API_KEY;

  if (!apiUrl || !apiKey) {
    console.warn("[aiClient] 环境变量缺失：VITE_AI_API_URL 或 VITE_AI_API_KEY 未配置");
    return "🍃 信号受到干扰，请稍后再试… —— 调频师 (FM 95.8)";
  }

  const {
    model = "deepseek-r1",
    temperature = 0.7,
    maxTokens = 200,
  } = options;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      let errInfo = "";
      try {
        const errJson = await response.json();
        errInfo = errJson?.error?.message || JSON.stringify(errJson);
      } catch {
        errInfo = await response.text();
      }
      console.warn(`[aiClient] 请求失败 (${status}):`, errInfo);
      return "🍃 信号受到干扰，请稍后再试… —— 调频师 (FM 95.8)";
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (typeof content === "string" && content.trim()) {
      return content.trim();
    }

    console.warn("[aiClient] 响应格式异常:", data);
    return "🍃 信号受到干扰，请稍后再试… —— 调频师 (FM 95.8)";
  } catch (err) {
    console.warn("[aiClient] 请求异常:", err);
    return "🍃 信号受到干扰，请稍后再试… —— 调频师 (FM 95.8)";
  }
}
