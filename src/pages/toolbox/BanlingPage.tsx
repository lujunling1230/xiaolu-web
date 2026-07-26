import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { track } from "../../utils/track";
import { callAI } from "../../utils/aiClient";

/**
 * 伴龄 · AI 养老规划伴侣
 *
 * 三阶段流程：首页（情绪感知）→ 对话页（AI Copilot）→ 报告页（结构化方案）
 * 暖橙主色 #FFB042 / 米白辅色 #FFF5E6
 * 复用 /api/ai 通用 AI 代理
 */

/* ===== 类型 ===== */
type Stage = "home" | "chat" | "report";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ReportData {
  insight: string;
  metrics: { label: string; value: string; hint: string }[];
  actions: string[];
  summary: string;
}

/* ===== System Prompt ===== */
const SYSTEM_PROMPT = `你是"伴龄"，一位兼具资深理财顾问和心理咨询师身份的AI伙伴。
你的语言风格温暖、包容，擅长用比喻解释复杂概念。
当用户焦虑时，先安抚情绪，再给出可执行的微小建议。
严禁使用恐吓式营销话术。

【对话策略】
1. 每次只问一个问题，不要一次性问完所有信息
2. 渐进式采集：先了解年龄段 → 再了解退休担忧 → 最后了解财务状况
3. 用"我们"代替"你"，用"小目标"代替"强制储蓄"，用"安心星"代替"完成度"
4. 每轮回复控制在150字以内，语气像朋友聊天
5. 当采集到足够信息（至少3轮对话）后，主动引导用户查看规划报告

【采集信息清单】
- 年龄段（青年/中年/银发）
- 主要担忧（父母医疗/自己退休金/孤独感/怕被骗）
- 当前财务状况（收入水平/是否有社保/是否有商业保险）
- 期望退休年龄和生活方式`;

/* ===== 快捷回复 ===== */
const QUICK_REPLIES = [
  "我还年轻，养老太远了吧",
  "担心父母的医疗费用",
  "不知道退休金够不够",
  "怕老了孤独",
  "想了解商业保险",
];

/* ===== 动态问候 ===== */
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "夜深了，还在想未来的事吗？";
  if (h < 12) return "早安，今天也是向着安心生活靠近的一天。";
  if (h < 18) return "午后的阳光正好，聊聊我们的未来？";
  return "夜幕降临，让我们规划一下安心岁月。";
}

/* ===== 组件 ===== */
export default function BanlingPage() {
  const [stage, setStage] = useState<Stage>("home");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    track("tool_enter", { tool_name: "伴龄" });
  }, []);

  /* 自动滚动到底部 */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* 发送消息 */
  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    track("banling_chat", { msg_length: trimmed.length });

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const reply = await callAI(
        SYSTEM_PROMPT,
        newMessages.map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content })),
        { maxTokens: 300, temperature: 0.75, signal: controller.signal }
      );

      if (reply) {
        const aiMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: reply,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      /* 中断或失败静默处理 */
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [messages, loading]);

  /* 开始对话 */
  const handleStart = useCallback(() => {
    setStage("chat");
    const greeting: ChatMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      content: "你好呀，我是伴龄 🌅\n很高兴我们能一起聊聊关于未来的事。\n不用紧张，我们就像朋友一样聊聊天就好。\n\n可以先告诉我，你大概在哪个年龄段吗？是刚步入职场，还是已经成家，或者已经享受退休生活了？",
      timestamp: Date.now(),
    };
    setMessages([greeting]);
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  /* 生成报告 */
  const handleGenerateReport = useCallback(async () => {
    setStage("report");
    setReportLoading(true);
    track("banling_report", { msg_count: messages.length });

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const reportPrompt = `基于以下对话内容，为用户生成一份养老规划报告。
要求返回严格 JSON 格式（不要 markdown 代码块），结构如下：
{
  "insight": "一句核心洞察，定性结论（如'你正处于起步阶段，时间是你最大的优势'）",
  "metrics": [
    {"label": "安全感分数", "value": "75", "hint": "满分100"},
    {"label": "缺口估算", "value": "约200万", "hint": "按当前消费水平"},
    {"label": "建议起步", "value": "每月500元", "hint": "小目标定投"}
  ],
  "actions": ["第一步可执行行动", "第二步行动", "第三步行动"],
  "summary": "一段温暖的收尾寄语（50字以内）"
}

对话记录：
${messages.map((m) => `${m.role === "user" ? "用户" : "伴龄"}: ${m.content}`).join("\n")}`;

      const result = await callAI(
        "你是养老规划报告生成助手，只返回JSON格式数据。",
        [{ role: "user", content: reportPrompt }],
        { maxTokens: 600, temperature: 0.5, signal: controller.signal, model: "qwen-plus" }
      );

      /* 尝试解析 JSON */
      let parsed: ReportData;
      try {
        const cleaned = result.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(cleaned);
      } catch {
        /* JSON 解析失败，使用兜底数据 */
        parsed = {
          insight: "你已经开始思考养老，这本身就是最大的优势。",
          metrics: [
            { label: "安全感分数", value: "70", hint: "满分100" },
            { label: "规划进度", value: "起步阶段", hint: "已迈出第一步" },
            { label: "建议起步", value: "每月小额定投", hint: "积少成多" },
          ],
          actions: [
            "设立一个专属的'安心账户'，每月存入一笔不影响生活的金额",
            "了解当地的社保政策，明确自己的基础保障范围",
            "和伴龄再聊一次，细化你的退休生活蓝图",
          ],
          summary: "未来很长，我们慢慢来。每一步小小的积累，都是通往安心岁月的路。",
        };
      }
      setReport(parsed);
    } catch {
      /* 失败使用兜底 */
      setReport({
        insight: "你已经开始思考养老，这本身就是最大的优势。",
        metrics: [
          { label: "安全感分数", value: "70", hint: "满分100" },
          { label: "规划进度", value: "起步阶段", hint: "已迈出第一步" },
          { label: "建议起步", value: "每月小额定投", hint: "积少成多" },
        ],
        actions: [
          "设立一个专属的'安心账户'，每月存入一笔不影响生活的金额",
          "了解当地的社保政策，明确自己的基础保障范围",
          "和伴龄再聊一次，细化你的退休生活蓝图",
        ],
        summary: "未来很长，我们慢慢来。每一步小小的积累，都是通往安心岁月的路。",
      });
    } finally {
      setReportLoading(false);
      abortRef.current = null;
    }
  }, [messages]);

  /* ===== 首页 ===== */
  if (stage === "home") {
    return (
      <div className="banling-root banling-home">
        <Link to="/mickey" className="banling-back">← 返回作品集</Link>
        <div className="banling-home-inner">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="banling-home-card"
          >
            <div className="banling-logo">🌅</div>
            <h1 className="banling-title">伴龄</h1>
            <p className="banling-subtitle">AI 养老规划伴侣</p>
            <p className="banling-greeting">{getGreeting()}</p>
            <p className="banling-desc">
              不用填表，不用算数。<br />
              像和朋友聊天一样，聊聊关于未来的事。<br />
              我们会一起把模糊的焦虑，变成清晰的小目标。
            </p>
            <div className="banling-progress">
              <div className="banling-progress-seed">🌱</div>
              <div className="banling-progress-track">
                <motion.div
                  className="banling-progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: "15%" }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                />
              </div>
              <span className="banling-progress-label">安心星 · 起步阶段</span>
            </div>
            <button className="banling-start-btn" onClick={handleStart}>
              开启第一次对话
            </button>
          </motion.div>
        </div>
        <BanlingStyles />
      </div>
    );
  }

  /* ===== 对话页 ===== */
  if (stage === "chat") {
    return (
      <div className="banling-root banling-chat-root">
        <Link to="/mickey" className="banling-back">← 返回作品集</Link>
        <div className="banling-chat-header">
          <button className="banling-chat-back" onClick={() => setStage("home")}>←</button>
          <span className="banling-chat-title">伴龄 · 规划对话</span>
          {messages.length >= 4 && (
            <button className="banling-report-btn" onClick={handleGenerateReport}>
              查看规划报告 →
            </button>
          )}
        </div>
        <div className="banling-chat-body">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`banling-msg ${msg.role}`}
              >
                <div className="banling-msg-avatar">
                  {msg.role === "assistant" ? "🌅" : "🙂"}
                </div>
                <div className="banling-msg-bubble">
                  {msg.content.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="banling-msg assistant">
              <div className="banling-msg-avatar">🌅</div>
              <div className="banling-msg-bubble banling-typing">
                <span /> <span /> <span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* 快捷回复 */}
        {messages.length <= 2 && !loading && (
          <div className="banling-quick-replies">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                className="banling-quick-btn"
                onClick={() => handleSend(reply)}
              >
                {reply}
              </button>
            ))}
          </div>
        )}
        {/* 输入栏 */}
        <div className="banling-input-bar">
          <textarea
            ref={inputRef}
            className="banling-input"
            placeholder="说说你的想法…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            rows={1}
          />
          <button
            className="banling-send-btn"
            onClick={() => handleSend(input)}
            disabled={!input.trim() || loading}
          >
            {loading ? "…" : "发送"}
          </button>
        </div>
        <BanlingStyles />
      </div>
    );
  }

  /* ===== 报告页 ===== */
  return (
    <div className="banling-root banling-report-root">
      <Link to="/mickey" className="banling-back">← 返回作品集</Link>
      <div className="banling-report-inner">
        {reportLoading ? (
          <div className="banling-report-loading">
            <div className="banling-loading-seed">🌱</div>
            <p>正在为你生成规划报告…</p>
            <p className="banling-loading-sub">把焦虑翻译成方案，需要一点时间</p>
          </div>
        ) : report ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* 核心洞察 */}
            <div className="banling-report-section banling-insight-card">
              <span className="banling-section-tag">核心洞察</span>
              <h2 className="banling-insight-text">{report.insight}</h2>
            </div>

            {/* 关键指标 */}
            <div className="banling-report-section">
              <span className="banling-section-tag">关键指标</span>
              <div className="banling-metrics-grid">
                {report.metrics.map((m, i) => (
                  <motion.div
                    key={i}
                    className="banling-metric-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <div className="banling-metric-label">{m.label}</div>
                    <div className="banling-metric-value">{m.value}</div>
                    <div className="banling-metric-hint">{m.hint}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 行动建议 */}
            <div className="banling-report-section">
              <span className="banling-section-tag">行动建议</span>
              <div className="banling-actions-list">
                {report.actions.map((action, i) => (
                  <motion.div
                    key={i}
                    className="banling-action-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <span className="banling-action-num">{i + 1}</span>
                    <span className="banling-action-text">{action}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 寄语 */}
            <div className="banling-report-summary">
              <p>{report.summary}</p>
            </div>

            {/* 操作按钮 */}
            <div className="banling-report-actions">
              <button
                className="banling-again-btn"
                onClick={() => {
                  setStage("chat");
                  setReport(null);
                }}
              >
                继续对话
              </button>
              <button
                className="banling-restart-btn"
                onClick={() => {
                  setStage("home");
                  setMessages([]);
                  setReport(null);
                }}
              >
                重新开始
              </button>
            </div>
          </motion.div>
        ) : null}
      </div>
      <BanlingStyles />
    </div>
  );
}

/* ===== 样式 ===== */
function BanlingStyles() {
  return (
    <style>{`
      .banling-root {
        min-height: 100vh;
        background: linear-gradient(180deg, #FFF5E6 0%, #FFEFD5 100%);
        font-family: 'Noto Sans SC', -apple-system, sans-serif;
        color: #4a3828;
        position: relative;
        overflow-x: hidden;
      }

      /* ===== 返回按钮 ===== */
      .banling-back {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 100;
        padding: 8px 16px;
        font-size: 14px;
        color: #8b6f47;
        text-decoration: none;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 999px;
        border: 1px solid rgba(255, 176, 66, 0.2);
        transition: all 0.2s ease;
      }
      .banling-back:hover {
        background: rgba(255, 176, 66, 0.15);
      }

      /* ===== 首页 ===== */
      .banling-home-inner {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
      }
      .banling-home-card {
        max-width: 480px;
        text-align: center;
      }
      .banling-logo {
        font-size: 56px;
        margin-bottom: 16px;
        animation: banling-float 3s ease-in-out infinite;
      }
      @keyframes banling-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      .banling-title {
        font-size: 36px;
        font-weight: 700;
        color: #C08020;
        margin: 0 0 8px;
        letter-spacing: 0.05em;
      }
      .banling-subtitle {
        font-size: 16px;
        color: #a0886a;
        margin: 0 0 32px;
      }
      .banling-greeting {
        font-size: 18px;
        color: #8b6f47;
        margin: 0 0 20px;
        font-weight: 500;
      }
      .banling-desc {
        font-size: 15px;
        line-height: 2;
        color: #7a6a5a;
        margin: 0 0 32px;
      }

      /* ===== 进度条 ===== */
      .banling-progress {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0 0 40px;
        justify-content: center;
      }
      .banling-progress-seed {
        font-size: 24px;
        animation: banling-grow 2s ease-in-out infinite;
      }
      @keyframes banling-grow {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.15); }
      }
      .banling-progress-track {
        width: 160px;
        height: 8px;
        background: rgba(255, 176, 66, 0.15);
        border-radius: 999px;
        overflow: hidden;
      }
      .banling-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #FFB042, #FFC766);
        border-radius: 999px;
      }
      .banling-progress-label {
        font-size: 12px;
        color: #a0886a;
        white-space: nowrap;
      }

      /* ===== 开始按钮 ===== */
      .banling-start-btn {
        padding: 14px 40px;
        font-size: 16px;
        font-weight: 600;
        color: #fff;
        background: linear-gradient(135deg, #FFB042, #FF9F1C);
        border: none;
        border-radius: 999px;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(255, 176, 66, 0.35);
        transition: all 0.3s ease;
      }
      .banling-start-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(255, 176, 66, 0.45);
      }

      /* ===== 对话页 ===== */
      .banling-chat-root {
        display: flex;
        flex-direction: column;
        height: 100vh;
        padding-top: 60px;
      }
      .banling-chat-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 20px;
        background: rgba(255, 245, 230, 0.95);
        border-bottom: 1px solid rgba(255, 176, 66, 0.15);
        flex-shrink: 0;
      }
      .banling-chat-back {
        background: none;
        border: none;
        font-size: 20px;
        color: #8b6f47;
        cursor: pointer;
        padding: 4px 8px;
      }
      .banling-chat-title {
        flex: 1;
        font-size: 15px;
        font-weight: 600;
        color: #6b5840;
      }
      .banling-report-btn {
        padding: 6px 14px;
        font-size: 13px;
        color: #fff;
        background: #FFB042;
        border: none;
        border-radius: 999px;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s ease;
      }
      .banling-report-btn:hover {
        background: #FF9F1C;
      }

      .banling-chat-body {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      /* ===== 消息 ===== */
      .banling-msg {
        display: flex;
        gap: 10px;
        max-width: 85%;
      }
      .banling-msg.user {
        flex-direction: row-reverse;
        align-self: flex-end;
      }
      .banling-msg-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 176, 66, 0.12);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        flex-shrink: 0;
      }
      .banling-msg.user .banling-msg-avatar {
        background: rgba(122, 106, 90, 0.12);
      }
      .banling-msg-bubble {
        padding: 12px 16px;
        border-radius: 16px;
        font-size: 14px;
        line-height: 1.7;
      }
      .banling-msg.assistant .banling-msg-bubble {
        background: #fff;
        color: #4a3828;
        border-top-left-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      }
      .banling-msg.user .banling-msg-bubble {
        background: #FFB042;
        color: #fff;
        border-top-right-radius: 4px;
      }
      .banling-msg-bubble p {
        margin: 0;
      }
      .banling-msg-bubble p + p {
        margin-top: 6px;
      }

      /* ===== 打字动画 ===== */
      .banling-typing {
        display: flex;
        gap: 4px;
        align-items: center;
      }
      .banling-typing span {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #FFB042;
        animation: banling-typing-bounce 1.2s infinite;
      }
      .banling-typing span:nth-child(2) { animation-delay: 0.15s; }
      .banling-typing span:nth-child(3) { animation-delay: 0.3s; }
      @keyframes banling-typing-bounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
        30% { transform: translateY(-6px); opacity: 1; }
      }

      /* ===== 快捷回复 ===== */
      .banling-quick-replies {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 0 20px 12px;
      }
      .banling-quick-btn {
        padding: 8px 14px;
        font-size: 13px;
        color: #8b6f47;
        background: rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(255, 176, 66, 0.2);
        border-radius: 999px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .banling-quick-btn:hover {
        background: rgba(255, 176, 66, 0.12);
        border-color: #FFB042;
      }

      /* ===== 输入栏 ===== */
      .banling-input-bar {
        display: flex;
        gap: 10px;
        padding: 12px 20px;
        background: rgba(255, 245, 230, 0.95);
        border-top: 1px solid rgba(255, 176, 66, 0.15);
        flex-shrink: 0;
      }
      .banling-input {
        flex: 1;
        padding: 10px 16px;
        font-size: 14px;
        border: 1px solid rgba(255, 176, 66, 0.2);
        border-radius: 12px;
        background: #fff;
        resize: none;
        outline: none;
        font-family: inherit;
        color: #4a3828;
        transition: border-color 0.2s ease;
      }
      .banling-input:focus {
        border-color: #FFB042;
      }
      .banling-send-btn {
        padding: 0 20px;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        background: #FFB042;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .banling-send-btn:disabled {
        background: #d4c4a8;
        cursor: not-allowed;
      }
      .banling-send-btn:not(:disabled):hover {
        background: #FF9F1C;
      }

      /* ===== 报告页 ===== */
      .banling-report-root {
        min-height: 100vh;
        padding-top: 60px;
      }
      .banling-report-inner {
        max-width: 640px;
        margin: 0 auto;
        padding: 20px;
      }
      .banling-report-loading {
        text-align: center;
        padding: 80px 20px;
      }
      .banling-loading-seed {
        font-size: 48px;
        margin-bottom: 16px;
        animation: banling-grow 1.5s ease-in-out infinite;
      }
      .banling-loading-sub {
        font-size: 13px;
        color: #a0886a;
        margin-top: 8px;
      }

      .banling-report-section {
        margin-bottom: 28px;
      }
      .banling-section-tag {
        display: inline-block;
        padding: 4px 12px;
        font-size: 12px;
        color: #C08020;
        background: rgba(255, 176, 66, 0.1);
        border-radius: 999px;
        margin-bottom: 14px;
      }
      .banling-insight-card {
        background: #fff;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
      }
      .banling-insight-text {
        font-size: 18px;
        line-height: 1.7;
        color: #4a3828;
        margin: 0;
        font-weight: 600;
      }

      /* ===== 指标网格 ===== */
      .banling-metrics-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }
      .banling-metric-card {
        background: #fff;
        border-radius: 14px;
        padding: 16px 12px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
      }
      .banling-metric-label {
        font-size: 12px;
        color: #a0886a;
        margin-bottom: 6px;
      }
      .banling-metric-value {
        font-size: 20px;
        font-weight: 700;
        color: #C08020;
        margin-bottom: 4px;
      }
      .banling-metric-hint {
        font-size: 11px;
        color: #bfa880;
      }

      /* ===== 行动建议 ===== */
      .banling-actions-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .banling-action-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        background: #fff;
        border-radius: 12px;
        padding: 14px 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
      }
      .banling-action-num {
        flex-shrink: 0;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: linear-gradient(135deg, #FFB042, #FF9F1C);
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .banling-action-text {
        font-size: 14px;
        line-height: 1.6;
        color: #4a3828;
      }

      /* ===== 寄语 ===== */
      .banling-report-summary {
        background: linear-gradient(135deg, rgba(255, 176, 66, 0.08), rgba(255, 199, 102, 0.05));
        border-radius: 16px;
        padding: 24px;
        text-align: center;
        margin-bottom: 28px;
      }
      .banling-report-summary p {
        font-size: 15px;
        line-height: 1.8;
        color: #6b5840;
        margin: 0;
        font-style: italic;
      }

      /* ===== 操作按钮 ===== */
      .banling-report-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }
      .banling-again-btn {
        padding: 12px 28px;
        font-size: 14px;
        font-weight: 600;
        color: #C08020;
        background: #fff;
        border: 1px solid #FFB042;
        border-radius: 999px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .banling-again-btn:hover {
        background: rgba(255, 176, 66, 0.08);
      }
      .banling-restart-btn {
        padding: 12px 28px;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        background: #FFB042;
        border: none;
        border-radius: 999px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .banling-restart-btn:hover {
        background: #FF9F1C;
      }

      /* ===== 响应式 ===== */
      @media (max-width: 640px) {
        .banling-metrics-grid {
          grid-template-columns: 1fr;
        }
        .banling-title { font-size: 28px; }
        .banling-desc { font-size: 14px; }
        .banling-msg { max-width: 92%; }
        .banling-report-actions {
          flex-direction: column;
        }
      }
    `}</style>
  );
}
