import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ============================================================
 * XiaoyePanel — 小叶 AI 助手面板
 * 右侧滑出，380px 宽，支持最小化、关闭、打字机效果
 * ============================================================ */

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  isTyping?: boolean;
}

const QUICK_QUESTIONS = [
  "她最拿手的项目是什么？",
  "漫游指南的设计思路？",
  "她对 AI PM 的理解？",
];

const WELCOME_TEXT =
  '你好呀，我是小叶 🌿\n我熟悉俊玲的所有作品和思考，可以帮你快速了解她。';

const TYPE_SPEED = 28; // ms per char

const XiaoyePanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", text: WELCOME_TEXT, isTyping: true },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const msgEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---------- 自动滚动 ---------- */
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, displayedText]);

  /* ---------- 打字机效果 ---------- */
  const startTyping = useCallback((fullText: string, msgId: number) => {
    let idx = 0;
    setDisplayedText("");
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      idx++;
      setDisplayedText(fullText.slice(0, idx));
      if (idx >= fullText.length) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, isTyping: false } : m))
        );
      }
    }, TYPE_SPEED);
  }, []);

  /* ---------- 发送消息 ---------- */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      const userMsg: Message = { id: Date.now(), role: "user", text };
      const assistantId = Date.now() + 1;
      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        text: "",
        isTyping: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setLoading(true);

      try {
        const ctrl = new AbortController();
        abortRef.current = ctrl;

        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: text }),
          signal: ctrl.signal,
        });

        if (!res.ok) throw new Error("Network error");

        const data = await res.json();
        const answer = data.answer || "抱歉，我暂时无法回答这个问题 😔";

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, text: answer } : m
          )
        );
        startTyping(answer, assistantId);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        const fallback =
          "这个问题超出了我的知识范围啦～我是专门介绍路俊玲作品集的助手，你可以问问她的具体项目哦。";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, text: fallback, isTyping: false } : m
          )
        );
        setDisplayedText(fallback);
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [loading, startTyping]
  );

  /* ---------- 快捷提问 ---------- */
  const handleQuick = (q: string) => sendMessage(q);

  /* ---------- 关闭时清理 ---------- */
  useEffect(() => {
    if (!isOpen) {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      if (abortRef.current) abortRef.current.abort();
    }
  }, [isOpen]);

  /* ---------- 渲染单条消息 ---------- */
  const renderMessage = (msg: Message) => {
    const isUser = msg.role === "user";
    const textToShow = msg.isTyping
      ? msg.id === messages[messages.length - 1]?.id
        ? displayedText
        : msg.text
      : msg.text;

    return (
      <div
        key={msg.id}
        className={`xy-msg ${isUser ? "xy-msg--user" : "xy-msg--bot"}`}
      >
        {!isUser && <span className="xy-avatar">🌿</span>}
        <div className={`xy-bubble ${isUser ? "xy-bubble--user" : "xy-bubble--bot"}`}>
          {textToShow.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < textToShow.split("\n").length - 1 && <br />}
            </span>
          ))}
          {msg.isTyping && (
            <span className="xy-cursor">▍</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩 */}
          <motion.div
            className="xy-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 面板 */}
          <motion.div
            className={`xy-panel ${minimized ? "xy-panel--min" : ""}`}
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
          >
            {/* Header */}
            <div className="xy-header">
              <div className="xy-header-left">
                <span className="xy-header-icon">🌿</span>
                <span className="xy-header-title">小叶 · AI 助手</span>
              </div>
              <div className="xy-header-actions">
                <button
                  className="xy-btn-icon"
                  onClick={() => setMinimized((v) => !v)}
                  title={minimized ? "展开" : "最小化"}
                >
                  {minimized ? "▢" : "⎯"}
                </button>
                <button className="xy-btn-icon" onClick={onClose} title="关闭">
                  ✕
                </button>
              </div>
            </div>

            {/* 内容区 */}
            {!minimized && (
              <>
                {/* 消息流 */}
                <div className="xy-body">
                  {messages.map(renderMessage)}
                  <div ref={msgEndRef} />
                </div>

                {/* 快捷提问 */}
                <div className="xy-quick">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      className="xy-quick-btn"
                      onClick={() => handleQuick(q)}
                      disabled={loading}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* 输入区 */}
                <div className="xy-input-wrap">
                  <input
                    className="xy-input"
                    placeholder="想问点什么？"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(input);
                      }
                    }}
                    disabled={loading}
                  />
                  <button
                    className="xy-send"
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || loading}
                  >
                    {loading ? "…" : "➤"}
                  </button>
                </div>
              </>
            )}
          </motion.div>

          <style>{`
            .xy-overlay {
              position: fixed; inset: 0; z-index: 199;
              background: rgba(0,0,0,0.08);
            }
            .xy-panel {
              position: fixed; top: 0; right: 0; bottom: 0;
              width: 380px; z-index: 200;
              background: #FDF8F0;
              box-shadow: -4px 0 20px rgba(0,0,0,0.1);
              display: flex; flex-direction: column;
              font-family: "Noto Sans SC", system-ui, sans-serif;
            }
            .xy-panel--min { height: 60px; bottom: auto; }

            /* Header */
            .xy-header {
              display: flex; align-items: center; justify-content: space-between;
              padding: 14px 18px;
              background: #5C3A21;
              flex-shrink: 0;
            }
            .xy-header-left {
              display: flex; align-items: center; gap: 8px;
            }
            .xy-header-icon { font-size: 18px; }
            .xy-header-title {
              font-family: "Noto Serif SC", Georgia, serif;
              font-size: 15px; font-weight: 600; color: #fff;
              letter-spacing: 0.04em;
            }
            .xy-header-actions {
              display: flex; align-items: center; gap: 6px;
            }
            .xy-btn-icon {
              width: 28px; height: 28px; border-radius: 6px;
              background: rgba(255,255,255,0.1); border: none;
              color: rgba(255,255,255,0.8); font-size: 13px;
              cursor: pointer; display: flex; align-items: center; justify-content: center;
              transition: all 0.2s ease;
            }
            .xy-btn-icon:hover {
              background: rgba(255,255,255,0.2); color: #fff;
            }

            /* Body */
            .xy-body {
              flex: 1; overflow-y: auto;
              padding: 16px 18px;
              display: flex; flex-direction: column; gap: 14px;
            }
            .xy-msg {
              display: flex; align-items: flex-start; gap: 8px;
              max-width: 100%;
            }
            .xy-msg--user { justify-content: flex-end; }
            .xy-msg--bot { justify-content: flex-start; }
            .xy-avatar {
              width: 26px; height: 26px; border-radius: 50%;
              background: rgba(93,138,106,0.12);
              display: flex; align-items: center; justify-content: center;
              font-size: 13px; flex-shrink: 0; margin-top: 2px;
            }
            .xy-bubble {
              padding: 10px 14px; border-radius: 12px;
              font-size: 13.5px; line-height: 1.7;
              max-width: 280px; word-break: break-word;
              animation: xy-pop 0.25s ease;
            }
            .xy-bubble--bot {
              background: #E8F5E9; color: #2D5A3D;
              font-family: "Noto Serif SC", Georgia, serif;
              border-bottom-left-radius: 4px;
            }
            .xy-bubble--user {
              background: #2D5A3D; color: #fff;
              border-bottom-right-radius: 4px;
            }
            .xy-cursor {
              display: inline-block; margin-left: 2px;
              animation: xy-blink 1s step-end infinite;
              color: #5d8a6a;
            }
            @keyframes xy-pop {
              from { opacity: 0; transform: translateY(6px) scale(0.96); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes xy-blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }

            /* Quick questions */
            .xy-quick {
              display: flex; flex-wrap: wrap; gap: 8px;
              padding: 0 18px 12px; flex-shrink: 0;
            }
            .xy-quick-btn {
              padding: 6px 12px; border-radius: 999px;
              border: 1px solid rgba(93,138,106,0.2);
              background: rgba(93,138,106,0.06);
              color: #5d8a6a; font-size: 12px;
              cursor: pointer; transition: all 0.25s ease;
              white-space: nowrap;
            }
            .xy-quick-btn:hover {
              background: rgba(93,138,106,0.15);
              border-color: rgba(93,138,106,0.35);
            }
            .xy-quick-btn:disabled { opacity: 0.5; cursor: not-allowed; }

            /* Input */
            .xy-input-wrap {
              display: flex; align-items: center; gap: 8px;
              padding: 12px 18px 16px; flex-shrink: 0;
              border-top: 1px solid rgba(200,190,170,0.2);
            }
            .xy-input {
              flex: 1; padding: 10px 14px; border-radius: 10px;
              border: 1px solid rgba(180,170,160,0.25);
              background: #fff; font-size: 13px; color: #4a4038;
              outline: none; transition: all 0.25s ease;
              font-family: inherit;
            }
            .xy-input::placeholder { color: #b8aa9a; }
            .xy-input:focus {
              border-color: #5d8a6a;
              box-shadow: 0 0 0 3px rgba(93,138,106,0.08);
            }
            .xy-input:disabled { opacity: 0.6; }
            .xy-send {
              width: 36px; height: 36px; border-radius: 50%;
              border: none; background: #5d8a6a; color: #fff;
              font-size: 14px; cursor: pointer;
              display: flex; align-items: center; justify-content: center;
              transition: all 0.25s ease; flex-shrink: 0;
            }
            .xy-send:hover:not(:disabled) {
              background: #4a7a5a; transform: scale(1.05);
            }
            .xy-send:disabled {
              background: #c0c0c0; cursor: not-allowed;
            }

            /* 响应式 */
            @media (max-width: 640px) {
              .xy-panel { width: 100%; }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
};

export default XiaoyePanel;
