/**
 * AI 通用调用客户端
 *
 * 所有请求通过自有服务端代理 /api/ai 转发，
 * 前端不持有任何 API Key。
 */

export interface CallAIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
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
  const {
    model = "deepseek-r1",
    temperature = 0.7,
    maxTokens = 200,
    signal,
  } = options;

  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemPrompt,
        messages,
        model,
        temperature,
        maxTokens,
      }),
      signal,
    });

    if (!response.ok) {
      const status = response.status;
      let errInfo = "";
      try {
        const errJson = await response.json();
        errInfo = errJson?.error || JSON.stringify(errJson);
      } catch {
        errInfo = await response.text();
      }
      console.warn(`[aiClient] 请求失败 (${status}):`, errInfo);
      return "🍃 信号受到干扰，请稍后再试… —— 调频师 (FM 95.8)";
    }

    const data = await response.json();
    const content = data?.content;

    if (typeof content === "string" && content.trim()) {
      return content.trim();
    }

    console.warn("[aiClient] 响应格式异常:", data);
    return "🍃 信号受到干扰，请稍后再试… —— 调频师 (FM 95.8)";
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return "";
    }
    console.warn("[aiClient] 请求异常:", err);
    return "🍃 信号受到干扰，请稍后再试… —— 调频师 (FM 95.8)";
  }
}
