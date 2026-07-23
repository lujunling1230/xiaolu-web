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

interface QuestionModule {
  label: string;
  emoji: string;
  questions: string[];
}

const QUESTION_MODULES: QuestionModule[] = [
  {
    label: "我是谁",
    emoji: "👤",
    questions: [
      "路俊玲是谁？她的背景是什么？",
      "她为什么从之前的领域转做 AI 产品经理？",
      "她有哪些核心技能？技术能力怎么样？",
      "她觉得自己最大的优势是什么？",
    ],
  },
  {
    label: "我做了什么",
    emoji: "🛠️",
    questions: [
      "漫游指南这个项目最难的技术点是什么？",
      "通关清单是如何把游戏化思维应用到产品里的？",
      "回血清单和普通的 To-Do List 有什么区别？",
      "物资管家的 AI 算法逻辑是怎样的？",
      "解忧杂货店是怎么实现情绪疏导的？",
      "这些作品里，哪个是她最满意的？为什么？",
    ],
  },
  {
    label: "我怎么想",
    emoji: "💭",
    questions: [
      "她怎么理解 AI 产品经理这个角色？",
      "在处理用户体验和技术实现的矛盾时，她一般怎么取舍？",
      "她对未来的 AI 产品趋势有什么看法？",
    ],
  },
  {
    label: "求职相关",
    emoji: "💼",
    questions: [
      "匹配度：她的经历为什么适合这个岗位？",
      "动机：她为什么想做 AI 产品经理？",
      "规划：入职后前三个月怎么开展工作？",
      "潜力：她还有什么没写在简历上的亮点？",
    ],
  },
];

const WELCOME_TEXT =
  '你好呀，我是小叶 🌿\n我熟悉俊玲的所有作品和思考，可以帮你快速了解她。';

const TYPE_SPEED = 28; // ms per char

/* ---------- 本地快捷回复（常见问题秒回，无需走 API） ---------- */
const LOCAL_REPLIES: { match: (q: string) => boolean; answer: string }[] = [
  {
    match: (q) => /还有别的|还有其他|还有什么项目|还有什么作品|其他项目|其他作品/.test(q),
    answer:
      '当然啦～俊玲一共做了七个作品，除了「漫游指南」和「通关清单」，还有：\n\n🌲 森林疗愈室 — 呼吸引导、冥想空间、感恩日记，给情绪一个落脚的地方\n🏠 爱情公寓 — 用 AI 帮你看见亲密关系里的相处模式\n📦 物资管家 — 拍照识别物品，智能管理家里的每一件小东西\n💌 解忧杂货店 — 把烦恼投进去，换一个温柔的视角回来\n💊 回血清单 — 把待办变成游戏关卡，打怪升级式回血\n\n想深入了解哪个，随时告诉我呀～',
  },
  {
    match: (q) => /七个作品|所有作品|全部作品|有哪些作品|有什么作品|做了哪些/.test(q),
    answer:
      '俊玲一共做了七个作品哦 🌿\n\n🗺️ 漫游指南 — 把旅行变成一场有温度的城市漫游\n📋 通关清单 — 用游戏化思维把人生目标变成关卡\n🌲 森林疗愈室 — 呼吸引导、冥想空间、感恩日记\n🏠 爱情公寓 — AI 视角下的亲密关系探索\n📦 物资管家 — 拍照识别，智能管理家中物品\n💌 解忧杂货店 — 把烦恼变成治愈的答案\n💊 回血清单 — 待办也能像打游戏一样有成就感\n\n想从哪个开始聊起呢？',
  },
];

const XiaoyePanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  autoMessage?: string | null;
  onAutoMessageDone?: () => void;
}> = ({ isOpen, onClose, autoMessage, onAutoMessageDone }) => {
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", text: WELCOME_TEXT, isTyping: false },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [activeModule, setActiveModule] = useState<string | null>(null);
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
      // 清空旧打字机状态和文本，防止新消息短暂显示旧文本
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      setDisplayedText("");
      // 重置所有旧消息的 isTyping，避免旧消息重新渲染时显示打字状态
      setMessages((prev) => prev.map((m) => ({ ...m, isTyping: false })));

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
      setActiveModule(null); // 收起模块

      // 先检查本地快捷回复（秒回，无需走 API，不显示打字机效果）
      const localReply = LOCAL_REPLIES.find((r) => r.match(text.trim()));
      if (localReply) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, text: localReply.answer, isTyping: false }
              : m
          )
        );
        setLoading(false);
        return;
      }

      try {
        const ctrl = new AbortController();
        abortRef.current = ctrl;

        const res = await fetch("/api/xiaoye", {
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

  /* ---------- 关闭时清理 ---------- */
  useEffect(() => {
    if (!isOpen) {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      if (abortRef.current) abortRef.current.abort();
    }
  }, [isOpen]);

  /* ---------- autoMessage：从首页召唤时自动发送 ---------- */
  const autoSentRef = useRef(false);
  useEffect(() => {
    if (isOpen && autoMessage && !autoSentRef.current) {
      autoSentRef.current = true;
      const timer = setTimeout(() => {
        const msgId = Date.now() + 1;
        setMessages((prev) => [
          ...prev,
          { id: msgId, role: "assistant", text: autoMessage, isTyping: true },
        ]);
        startTyping(autoMessage, msgId);
        onAutoMessageDone?.();
      }, 600);
      return () => clearTimeout(timer);
    }
    if (!isOpen) {
      autoSentRef.current = false;
    }
  }, [isOpen, autoMessage, startTyping, onAutoMessageDone]);

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
          {msg.isTyping && !textToShow && (
            <span className="xy-thinking">
              <span className="xy-thinking-dot" />
              <span className="xy-thinking-dot" />
              <span className="xy-thinking-dot" />
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="xy-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

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

                {/* 模块选择 + 子问题 */}
                <div className="xy-modules">
                  {/* 模块按钮行 */}
                  <div className="xy-module-row">
                    {QUESTION_MODULES.map((mod) => (
                      <button
                        key={mod.label}
                        className={`xy-module-btn ${activeModule === mod.label ? "is-active" : ""}`}
                        onClick={() =>
                          setActiveModule((prev) =>
                            prev === mod.label ? null : mod.label
                          )
                        }
                        disabled={loading}
                      >
                        <span className="xy-module-emoji">{mod.emoji}</span>
                        <span className="xy-module-label">{mod.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* 展开的问题列表 */}
                  <AnimatePresence>
                    {activeModule && (
                      <motion.div
                        className="xy-question-list"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        {QUESTION_MODULES.find((m) => m.label === activeModule)
                          ?.questions.map((q) => (
                            <button
                              key={q}
                              className="xy-question-btn"
                              onClick={() => sendMessage(q)}
                              disabled={loading}
                            >
                              {q}
                            </button>
                          ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
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
            .xy-thinking {
              display: inline-flex; align-items: center; gap: 4px;
              margin-left: 4px;
            }
            .xy-thinking-dot {
              display: inline-block; width: 6px; height: 6px;
              border-radius: 50%; background: #8AB69C;
              animation: xy-think-bounce 1.4s ease-in-out infinite both;
            }
            .xy-thinking-dot:nth-child(1) { animation-delay: -0.32s; }
            .xy-thinking-dot:nth-child(2) { animation-delay: -0.16s; }
            .xy-thinking-dot:nth-child(3) { animation-delay: 0s; }
            @keyframes xy-think-bounce {
              0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
              40% { transform: scale(1); opacity: 1; }
            }
            @keyframes xy-pop {
              from { opacity: 0; transform: translateY(6px) scale(0.96); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }

            /* 模块选择 */
            .xy-modules {
              flex-shrink: 0;
              padding: 0 18px 12px;
            }
            .xy-module-row {
              display: flex; gap: 6px;
              justify-content: space-between;
            }
            .xy-module-btn {
              flex: 1;
              display: flex; flex-direction: column; align-items: center; gap: 4px;
              padding: 8px 4px; border-radius: 12px;
              border: 1px solid rgba(93,138,106,0.18);
              background: rgba(93,138,106,0.05);
              color: #5d8a6a; font-size: 11px;
              cursor: pointer; transition: all 0.25s ease;
              font-family: inherit;
              line-height: 1.2;
            }
            .xy-module-btn:hover {
              background: rgba(93,138,106,0.12);
              border-color: rgba(93,138,106,0.3);
            }
            .xy-module-btn.is-active {
              background: rgba(93,138,106,0.18);
              border-color: rgba(93,138,106,0.4);
              color: #3A4F3A;
              font-weight: 500;
            }
            .xy-module-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            .xy-module-emoji { font-size: 16px; line-height: 1; }
            .xy-module-label { letter-spacing: 0.02em; }

            /* 问题列表 */
            .xy-question-list {
              overflow: hidden;
              display: flex; flex-direction: column; gap: 6px;
              padding-top: 10px;
            }
            .xy-question-btn {
              padding: 8px 12px; border-radius: 10px;
              border: 1px solid rgba(93,138,106,0.15);
              background: rgba(93,138,106,0.04);
              color: #4a6a4a; font-size: 12px;
              text-align: left; cursor: pointer;
              transition: all 0.2s ease;
              font-family: inherit; line-height: 1.5;
            }
            .xy-question-btn:hover {
              background: rgba(93,138,106,0.1);
              border-color: rgba(93,138,106,0.3);
              color: #2D5A3D;
            }
            .xy-question-btn:disabled { opacity: 0.5; cursor: not-allowed; }

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
