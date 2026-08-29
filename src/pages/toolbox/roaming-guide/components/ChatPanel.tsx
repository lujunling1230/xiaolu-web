import { useState, useCallback, useRef, useEffect } from "react";
import { track } from "../../../../utils/track";
import {
  City,
  AIReverseRecommendResponse,
  AIForwardGenerateResponse,
} from "../types";

/* ============================================================
   ChatPanel — 多轮对话式旅行规划 Agent
   ============================================================ */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  /** Agent 返回的结构化动作结果 */
  action?: "recommend" | "generate" | null;
  recommendData?: AIReverseRecommendResponse | null;
  generateData?: AIForwardGenerateResponse | null;
  /** 城市推荐中已采纳的城市名 */
  adoptedNames?: Set<string>;
  /** 行程是否已保存 */
  planSaved?: boolean;
}

interface ChatPanelProps {
  cities: City[];
  onAdoptCity: (city: AIReverseRecommendResponse["cities"][0]) => void;
  onSavePlan: (city: City, plan: AIForwardGenerateResponse) => void;
}

const QUICK_PROMPTS = [
  "3天预算2000想去大理",
  "想去南方看海，5天左右",
  "国庆带家人去哪人少",
  "冬天想去暖和的地方",
  "成都3天怎么玩",
  "预算3000想去云南",
];

const SUGGESTION_VISIBLE_COUNT = 4;

export default function ChatPanel({ cities, onAdoptCity, onSavePlan }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "你好呀！我是小叶，你的旅行向导。告诉我你的旅行想法，我来帮你规划～",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /* 自动滚动到底部 */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  /* 发送消息 */
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setInput("");
    setLoading(true);
    track("rg_chat_send", { message_length: trimmed.length });

    // 添加用户消息
    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const conversationHistory = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/ai-travel-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || "AI 服务调用失败");
      }

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: json.reply || "让我想想...",
        action: json.action || null,
      };

      if (json.action === "recommend" && json.data) {
        const data = json.data as AIReverseRecommendResponse;
        assistantMsg.recommendData = {
          cities: (data.cities || []).map((c) => ({
            name: c.name,
            province: c.province,
            coord: c.coord,
            reason: c.reason,
            highlights: c.highlights,
            best_season: c.best_season,
          })),
          summary: data.summary || "为你精选了几座值得一去的城市。",
        };
        assistantMsg.adoptedNames = new Set();
        track("rg_chat_recommend_result", { city_count: data.cities?.length || 0 });
      } else if (json.action === "generate" && json.data) {
        const data = json.data as AIForwardGenerateResponse;
        assistantMsg.generateData = {
          plan: {
            ...(data.plan || {}),
            generated_at: new Date().toISOString(),
          },
          detailed_guide: (data.detailed_guide || []).map((d) => ({
            day: d.day,
            theme: d.theme,
            activities: d.activities,
            food_recommendations: d.food_recommendations,
            transport_tip: d.transport_tip,
            daily_budget: d.daily_budget,
          })),
        };
        track("rg_chat_generate_result", { days: data.plan?.days || 0 });
      }

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "出了点小问题，请再试一次";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMsg },
      ]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  /* 处理回车发送 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  /* 采纳推荐城市 */
  const handleAdopt = (msgIndex: number, city: AIReverseRecommendResponse["cities"][0]) => {
    onAdoptCity(city);
    setMessages((prev) => {
      const updated = [...prev];
      const msg = updated[msgIndex];
      if (msg.adoptedNames) {
        msg.adoptedNames = new Set(msg.adoptedNames).add(city.name);
      }
      return updated;
    });
  };

  /* 保存行程 */
  const handleSavePlan = (msgIndex: number, cityName: string, plan: AIForwardGenerateResponse) => {
    const matched = cities.find((c) => c.name === cityName);
    if (matched) {
      onSavePlan(matched, plan);
    } else {
      const newCity: City = {
        id: Date.now(),
        name: cityName,
        province: "未知",
        coord: { lng: 0, lat: 0 },
        slogan: plan.plan.summary?.slice(0, 20) || "AI 推荐攻略",
        images: [],
        days: plan.plan.days || 3,
        play: [],
        eat: [],
        stay: "",
        tips: "",
        light_source: "ai_recommend",
        explore_count: 0,
        manual_guide: "",
        ai_plan: plan.plan,
        weather_tags: [],
        status: "want_to_go",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      onSavePlan(newCity, plan);
    }
    setMessages((prev) => {
      const updated = [...prev];
      updated[msgIndex] = { ...updated[msgIndex], planSaved: true };
      return updated;
    });
  };

  /* 从 generate 结果中提取城市名 */
  const extractCityName = (plan: AIForwardGenerateResponse): string => {
    const prompt = plan.plan?.prompt || "";
    const match = prompt.match(/([\u4e00-\u9fa5]{2,})/);
    return match ? match[1] : "目的地";
  };

  const visibleSuggestions = showAllSuggestions
    ? QUICK_PROMPTS
    : QUICK_PROMPTS.slice(0, SUGGESTION_VISIBLE_COUNT);

  return (
    <>
      <style>{CHAT_CSS}</style>
      <div className="rg-chat">
        {/* 消息列表 */}
        <div className="rg-chat__messages" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`rg-chat__msg rg-chat__msg--${msg.role}`}>
              {msg.role === "assistant" && (
                <div className="rg-chat__avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
              )}
              <div className="rg-chat__bubble-wrap">
                <div className={`rg-chat__bubble rg-chat__bubble--${msg.role}`}>
                  {msg.content}
                </div>

                {/* 推荐城市卡片 */}
                {msg.recommendData && msg.recommendData.cities.map((city) => (
                  <div key={city.name} className="rg-chat__city-card">
                    <div className="rg-chat__city-header">
                      <span className="rg-chat__city-name">{city.name}</span>
                      <span className="rg-chat__city-province">{city.province}</span>
                    </div>
                    <p className="rg-chat__city-reason">{city.reason}</p>
                    <div className="rg-chat__city-highlights">
                      {city.highlights.map((h, i) => (
                        <span key={i} className="rg-chat__highlight-tag">{h}</span>
                      ))}
                    </div>
                    {msg.adoptedNames?.has(city.name) ? (
                      <span className="rg-chat__adopted">已加入想去</span>
                    ) : (
                      <button
                        className="rg-chat__adopt-btn"
                        onClick={() => handleAdopt(idx, city)}
                      >
                        加入想去
                      </button>
                    )}
                  </div>
                ))}

                {/* 行程卡片 */}
                {msg.generateData && (
                  <div className="rg-chat__plan-card">
                    <div className="rg-chat__plan-header">
                      <span className="rg-chat__plan-summary">{msg.generateData.plan.summary}</span>
                      <span className="rg-chat__plan-days">{msg.generateData.plan.days}天</span>
                    </div>
                    {msg.generateData.plan.highlights?.length > 0 && (
                      <div className="rg-chat__plan-highlights">
                        {msg.generateData.plan.highlights.map((h, i) => (
                          <span key={i} className="rg-chat__highlight-tag">{h}</span>
                        ))}
                      </div>
                    )}
                    {msg.generateData.detailed_guide.map((d) => (
                      <div key={d.day} className="rg-chat__day">
                        <div className="rg-chat__day-header">
                          <span className="rg-chat__day-num">DAY {String(d.day).padStart(2, "0")}</span>
                          <span className="rg-chat__day-theme">{d.theme}</span>
                        </div>
                        <ul className="rg-chat__activities">
                          {d.activities.map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                        {d.food_recommendations?.length > 0 && (
                          <div className="rg-chat__food">
                            <span className="rg-chat__food-label">美食</span>
                            {d.food_recommendations.map((f, i) => (
                              <span key={i} className="rg-chat__food-item">{f}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {msg.planSaved ? (
                      <span className="rg-chat__adopted">攻略已保存</span>
                    ) : (
                      <button
                        className="rg-chat__adopt-btn"
                        onClick={() => {
                          const cityName = extractCityName(msg.generateData!);
                          handleSavePlan(idx, cityName, msg.generateData!);
                        }}
                      >
                        保存攻略
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* 打字指示器 */}
          {loading && (
            <div className="rg-chat__msg rg-chat__msg--assistant">
              <div className="rg-chat__avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <div className="rg-chat__typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

        {/* 快捷建议 */}
        <div className="rg-chat__suggestions">
          {visibleSuggestions.map((s) => (
            <button
              key={s}
              className="rg-chat__suggestion"
              onClick={() => sendMessage(s)}
              disabled={loading}
            >
              {s}
            </button>
          ))}
          {QUICK_PROMPTS.length > SUGGESTION_VISIBLE_COUNT && (
            <button
              className="rg-chat__suggestion rg-chat__suggestion--more"
              onClick={() => setShowAllSuggestions(!showAllSuggestions)}
              disabled={loading}
            >
              {showAllSuggestions ? "收起" : "更多"}
            </button>
          )}
        </div>

        {/* 输入框 */}
        <div className="rg-chat__input-bar">
          <textarea
            ref={inputRef}
            className="rg-chat__input"
            placeholder="告诉我你的旅行想法..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={loading}
          />
          <button
            className="rg-chat__send"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            aria-label="发送"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   样式
   ============================================================ */
const CHAT_CSS = `
.rg-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

/* 消息列表 */
.rg-chat__messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  scroll-behavior: smooth;
}

.rg-chat__messages::-webkit-scrollbar {
  width: 4px;
}
.rg-chat__messages::-webkit-scrollbar-thumb {
  background: var(--rg-ink-border);
  border-radius: 2px;
}

/* 单条消息 */
.rg-chat__msg {
  display: flex;
  gap: 8px;
  max-width: 92%;
  animation: rg-chat-fade-in 0.3s var(--rg-ease-smooth);
}

.rg-chat__msg--user {
  flex-direction: row-reverse;
  align-self: flex-end;
}

.rg-chat__msg--assistant {
  align-self: flex-start;
}

@keyframes rg-chat-fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 头像 */
.rg-chat__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--rg-primary-faint);
  color: var(--rg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.rg-chat__avatar svg {
  width: 16px;
  height: 16px;
}

/* 气泡 */
.rg-chat__bubble-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rg-chat__bubble {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;
}

.rg-chat__bubble--user {
  background: var(--rg-primary);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.rg-chat__bubble--assistant {
  background: var(--rg-paper-light);
  color: var(--rg-ink);
  border: 1px solid var(--rg-ink-border);
  border-bottom-left-radius: 4px;
}

/* 打字指示器 */
.rg-chat__typing {
  display: flex;
  gap: 4px;
  padding: 12px 14px;
  background: var(--rg-paper-light);
  border: 1px solid var(--rg-ink-border);
  border-radius: 12px;
  border-bottom-left-radius: 4px;
}
.rg-chat__typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--rg-ink-light);
  animation: rg-chat-typing 1.4s infinite;
}
.rg-chat__typing span:nth-child(2) { animation-delay: 0.2s; }
.rg-chat__typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes rg-chat-typing {
  0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-4px); }
}

/* 城市推荐卡片 */
.rg-chat__city-card {
  background: var(--rg-paper-light);
  border: 1px solid var(--rg-ink-border);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rg-chat__city-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.rg-chat__city-name {
  font-family: var(--rg-font-serif);
  font-size: 16px;
  font-weight: 600;
  color: var(--rg-ink);
}

.rg-chat__city-province {
  font-size: 12px;
  color: var(--rg-ink-light);
}

.rg-chat__city-reason {
  font-size: 13px;
  line-height: 1.7;
  color: var(--rg-ink-body);
  margin: 0;
}

.rg-chat__city-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.rg-chat__highlight-tag {
  font-size: 11px;
  padding: 2px 8px;
  background: var(--rg-primary-faint);
  color: var(--rg-primary-dark);
  border-radius: 4px;
}

.rg-chat__adopt-btn {
  align-self: flex-start;
  padding: 5px 14px;
  font-size: 12px;
  background: var(--rg-accent);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.rg-chat__adopt-btn:hover {
  background: var(--rg-accent-dark);
}

.rg-chat__adopted {
  align-self: flex-start;
  font-size: 12px;
  color: var(--rg-primary);
  padding: 5px 14px;
  background: var(--rg-primary-faint);
  border-radius: 6px;
}

/* 行程卡片 */
.rg-chat__plan-card {
  background: var(--rg-paper-light);
  border: 1px solid var(--rg-ink-border);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rg-chat__plan-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.rg-chat__plan-summary {
  font-family: var(--rg-font-serif);
  font-size: 15px;
  font-weight: 600;
  color: var(--rg-ink);
}

.rg-chat__plan-days {
  font-size: 12px;
  color: var(--rg-accent-dark);
  background: var(--rg-accent-faint);
  padding: 2px 8px;
  border-radius: 4px;
}

.rg-chat__plan-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.rg-chat__day {
  border-top: 1px dashed var(--rg-ink-border);
  padding-top: 8px;
}

.rg-chat__day-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.rg-chat__day-num {
  font-size: 11px;
  font-weight: 600;
  color: var(--rg-accent);
  letter-spacing: 0.1em;
}

.rg-chat__day-theme {
  font-size: 13px;
  color: var(--rg-ink-secondary);
  font-family: var(--rg-font-serif);
}

.rg-chat__activities {
  list-style: none;
  padding: 0;
  margin: 0 0 4px 0;
}
.rg-chat__activities li {
  font-size: 12px;
  line-height: 1.7;
  color: var(--rg-ink-body);
  padding-left: 12px;
  position: relative;
}
.rg-chat__activities li::before {
  content: "·";
  position: absolute;
  left: 2px;
  color: var(--rg-primary);
}

.rg-chat__food {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.rg-chat__food-label {
  font-size: 11px;
  color: var(--rg-ink-light);
}

.rg-chat__food-item {
  font-size: 11px;
  padding: 1px 6px;
  background: var(--rg-accent-faint);
  color: var(--rg-accent-dark);
  border-radius: 3px;
}

/* 快捷建议 */
.rg-chat__suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 12px 4px;
  border-top: 1px solid var(--rg-ink-border);
}

.rg-chat__suggestion {
  padding: 5px 12px;
  font-size: 12px;
  background: transparent;
  border: 1px solid var(--rg-ink-border);
  border-radius: 16px;
  color: var(--rg-ink-secondary);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.rg-chat__suggestion:hover:not(:disabled) {
  border-color: var(--rg-primary);
  color: var(--rg-primary);
  background: var(--rg-primary-faint);
}
.rg-chat__suggestion:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.rg-chat__suggestion--more {
  border-style: dashed;
}

/* 输入栏 */
.rg-chat__input-bar {
  display: flex;
  gap: 8px;
  padding: 8px 12px 12px;
  align-items: flex-end;
}

.rg-chat__input {
  flex: 1;
  border: 1px solid var(--rg-ink-border);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-family: var(--rg-font-sans);
  background: var(--rg-paper-light);
  color: var(--rg-ink);
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  max-height: 80px;
}
.rg-chat__input:focus {
  border-color: var(--rg-primary);
}
.rg-chat__input::placeholder {
  color: var(--rg-ink-faint);
}

.rg-chat__send {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: var(--rg-primary);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  flex-shrink: 0;
}
.rg-chat__send:hover:not(:disabled) {
  background: var(--rg-primary-dark);
}
.rg-chat__send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.rg-chat__send svg {
  width: 16px;
  height: 16px;
}
`;
