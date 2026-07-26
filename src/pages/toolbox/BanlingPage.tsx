import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { track } from "../../utils/track";
import { callAI } from "../../utils/aiClient";

/**
 * 伴龄 · AI 养老规划伴侣
 *
 * 三阶段流程：首页（情绪感知）→ 对话页（AI Copilot）→ 报告页（结构化方案）
 * 暖米色 #f5f0e6 / 棕褐色 #6b5840 书籍式风格
 * 复用 /api/ai 通用 AI 代理
 * 报告持久化到 localStorage，支持导出分享
 */

/* ===== 类型 ===== */
type Stage = "home" | "chat" | "report" | "profile";

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

interface SavedReport {
  id: string;
  data: ReportData;
  createdAt: number;
  msgCount: number;
  adoptedActions: boolean[];
}

/* ===== localStorage ===== */
const REPORTS_KEY = "banling_reports";
const PROFILE_KEY = "banling_profile";

const loadReports = (): SavedReport[] => {
  try {
    const r = localStorage.getItem(REPORTS_KEY);
    return r ? JSON.parse(r) : [];
  } catch {
    return [];
  }
};

const saveReports = (reports: SavedReport[]) => {
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  } catch {
    /* 静默处理 */
  }
};

interface UserProfile {
  nickname: string;
  ageGroup: string;
  concern: string;
  createdAt: number;
}

const loadProfile = (): UserProfile | null => {
  try {
    const r = localStorage.getItem(PROFILE_KEY);
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
};

const saveProfile = (p: UserProfile | null) => {
  try {
    if (p) localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    else localStorage.removeItem(PROFILE_KEY);
  } catch {
    /* 静默处理 */
  }
};

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

/* ===== 格式化时间 ===== */
const formatTime = (ts: number) => {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

/* ===== 导出报告为文本 ===== */
function exportReportAsText(report: ReportData, createdAt: number): string {
  const lines: string[] = [];
  lines.push("═══════════════════════════════════");
  lines.push("        伴龄 · 养老规划报告");
  lines.push("═══════════════════════════════════");
  lines.push(`生成时间：${formatTime(createdAt)}`);
  lines.push("");
  lines.push("【核心洞察】");
  lines.push(report.insight);
  lines.push("");
  lines.push("【关键指标】");
  report.metrics.forEach((m) => {
    lines.push(`  ${m.label}：${m.value}（${m.hint}）`);
  });
  lines.push("");
  lines.push("【行动建议】");
  report.actions.forEach((a, i) => {
    lines.push(`  ${i + 1}. ${a}`);
  });
  lines.push("");
  lines.push("【寄语】");
  lines.push(report.summary);
  lines.push("");
  lines.push("───────────────────────────────────");
  lines.push("伴龄 · AI 养老规划伴侣");
  lines.push("把焦虑变成小目标，把未来变成安心岁月");
  lines.push("───────────────────────────────────");
  return lines.join("\n");
}

/* ===== 下载文本文件 ===== */
function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ===== 复制到剪贴板 ===== */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/* ===== 组件 ===== */
export default function BanlingPage() {
  const [stage, setStage] = useState<Stage>("home");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [adoptedActions, setAdoptedActions] = useState<boolean[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileInput, setProfileInput] = useState({ nickname: "", ageGroup: "", concern: "" });
  const [toast, setToast] = useState<string | null>(null);
  const [viewingReport, setViewingReport] = useState<SavedReport | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    track("tool_enter", { tool_name: "伴龄" });
    setSavedReports(loadReports());
    setProfile(loadProfile());
  }, []);

  /* 显示 toast 提示 */
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
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
      setAdoptedActions(new Array(parsed.actions.length).fill(false));

      /* 保存报告到 localStorage */
      const newReport: SavedReport = {
        id: `r-${Date.now()}`,
        data: parsed,
        createdAt: Date.now(),
        msgCount: messages.length,
        adoptedActions: new Array(parsed.actions.length).fill(false),
      };
      const updated = [newReport, ...savedReports].slice(0, 20);
      setSavedReports(updated);
      saveReports(updated);
      setCurrentReportId(newReport.id);
    } catch {
      /* 失败使用兜底 */
      const fallback: ReportData = {
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
      setReport(fallback);
      setAdoptedActions(new Array(fallback.actions.length).fill(false));
    } finally {
      setReportLoading(false);
      abortRef.current = null;
    }
  }, [messages, savedReports]);

  /* 切换行动建议采纳状态 */
  const toggleAction = useCallback((index: number) => {
    setAdoptedActions((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      /* 更新 localStorage */
      if (currentReportId) {
        const updated = savedReports.map((r) =>
          r.id === currentReportId ? { ...r, adoptedActions: next } : r
        );
        setSavedReports(updated);
        saveReports(updated);
      }
      return next;
    });
    track("banling_action_adopt", { index });
  }, [currentReportId, savedReports]);

  /* 导出报告 */
  const handleExport = useCallback(() => {
    if (!report || !currentReportId) return;
    const saved = savedReports.find((r) => r.id === currentReportId);
    const text = exportReportAsText(report, saved?.createdAt ?? Date.now());
    downloadText(`伴龄规划报告_${new Date().toISOString().slice(0, 10)}.txt`, text);
    showToast("报告已导出");
  }, [report, currentReportId, savedReports, showToast]);

  /* 复制报告 */
  const handleCopy = useCallback(async () => {
    if (!report || !currentReportId) return;
    const saved = savedReports.find((r) => r.id === currentReportId);
    const text = exportReportAsText(report, saved?.createdAt ?? Date.now());
    const ok = await copyToClipboard(text);
    showToast(ok ? "报告已复制到剪贴板" : "复制失败，请手动选择");
  }, [report, currentReportId, savedReports, showToast]);

  /* 删除历史报告 */
  const handleDeleteReport = useCallback((id: string) => {
    const updated = savedReports.filter((r) => r.id !== id);
    setSavedReports(updated);
    saveReports(updated);
    if (viewingReport?.id === id) {
      setViewingReport(null);
    }
    showToast("已删除");
  }, [savedReports, viewingReport, showToast]);

  /* 查看历史报告 */
  const handleViewReport = useCallback((r: SavedReport) => {
    setViewingReport(r);
  }, []);

  /* 保存个人档案 */
  const handleSaveProfile = useCallback(() => {
    const p: UserProfile = {
      nickname: profileInput.nickname.trim() || "匿名旅人",
      ageGroup: profileInput.ageGroup,
      concern: profileInput.concern,
      createdAt: profile?.createdAt ?? Date.now(),
    };
    setProfile(p);
    saveProfile(p);
    setShowProfileForm(false);
    showToast("档案已保存");
  }, [profileInput, profile, showToast]);

  /* 开始编辑档案 */
  const startEditProfile = useCallback(() => {
    setProfileInput({
      nickname: profile?.nickname ?? "",
      ageGroup: profile?.ageGroup ?? "",
      concern: profile?.concern ?? "",
    });
    setShowProfileForm(true);
  }, [profile]);

  /* 计算安心星进度 */
  const getProgress = useCallback((): { percent: number; label: string } => {
    const reportCount = savedReports.length;
    const adoptedCount = adoptedActions.filter(Boolean).length;
    if (reportCount === 0) return { percent: 15, label: "安心星 · 起步阶段" };
    if (reportCount === 1 && adoptedCount === 0) return { percent: 30, label: "安心星 · 探索阶段" };
    if (adoptedCount >= 1) return { percent: 60, label: "安心星 · 行动阶段" };
    if (reportCount >= 2) return { percent: 75, label: "安心星 · 稳步阶段" };
    return { percent: 45, label: "安心星 · 成长阶段" };
  }, [savedReports, adoptedActions]);

  /* ===== 首页 ===== */
  if (stage === "home") {
    const progress = getProgress();
    return (
      <div className="banling-root banling-home">
        <Link to="/mickey" className="banling-back">← 返回作品集</Link>
        <button className="banling-profile-entry" onClick={() => setStage("profile")}>
          {profile ? profile.nickname : "个人中心"}
        </button>
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
                  animate={{ width: `${progress.percent}%` }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                />
              </div>
              <span className="banling-progress-label">{progress.label}</span>
            </div>
            <button className="banling-start-btn" onClick={handleStart}>
              开启第一次对话
            </button>
            {savedReports.length > 0 && (
              <button className="banling-history-btn" onClick={() => setStage("profile")}>
                查看历史报告（{savedReports.length}）
              </button>
            )}
          </motion.div>
        </div>
        <BanlingStyles />
        <BanlingToast toast={toast} />
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
        <BanlingToast toast={toast} />
      </div>
    );
  }

  /* ===== 报告页 ===== */
  if (stage === "report") {
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
                <p className="banling-action-hint">点击勾选已采纳的建议</p>
                <div className="banling-actions-list">
                  {report.actions.map((action, i) => (
                    <motion.div
                      key={i}
                      className={`banling-action-item ${adoptedActions[i] ? "adopted" : ""}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      onClick={() => toggleAction(i)}
                    >
                      <span className="banling-action-num">
                        {adoptedActions[i] ? "✓" : i + 1}
                      </span>
                      <span className="banling-action-text">{action}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 寄语 */}
              <div className="banling-report-summary">
                <p>{report.summary}</p>
              </div>

              {/* 导出分享 */}
              <div className="banling-export-bar">
                <button className="banling-export-btn" onClick={handleExport}>
                  导出报告
                </button>
                <button className="banling-export-btn" onClick={handleCopy}>
                  复制分享
                </button>
              </div>

              {/* 操作按钮 */}
              <div className="banling-report-actions">
                <button
                  className="banling-again-btn"
                  onClick={() => {
                    setStage("chat");
                    setReport(null);
                    setCurrentReportId(null);
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
                    setCurrentReportId(null);
                    setAdoptedActions([]);
                  }}
                >
                  重新开始
                </button>
              </div>
            </motion.div>
          ) : null}
        </div>
        <BanlingStyles />
        <BanlingToast toast={toast} />
      </div>
    );
  }

  /* ===== 个人中心 ===== */
  return (
    <div className="banling-root banling-profile-root">
      <Link to="/mickey" className="banling-back">← 返回作品集</Link>
      <div className="banling-profile-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button className="banling-chat-back" onClick={() => setStage("home")}>←</button>
          <h1 className="banling-profile-title">个人中心</h1>

          {/* 个人档案 */}
          <div className="banling-report-section">
            <div className="banling-section-header">
              <span className="banling-section-tag">我的档案</span>
              {!showProfileForm && (
                <button className="banling-text-btn" onClick={startEditProfile}>
                  {profile ? "编辑" : "创建"}
                </button>
              )}
            </div>
            {showProfileForm ? (
              <div className="banling-profile-form">
                <input
                  className="banling-profile-input"
                  placeholder="昵称"
                  value={profileInput.nickname}
                  onChange={(e) => setProfileInput({ ...profileInput, nickname: e.target.value })}
                />
                <select
                  className="banling-profile-input"
                  value={profileInput.ageGroup}
                  onChange={(e) => setProfileInput({ ...profileInput, ageGroup: e.target.value })}
                >
                  <option value="">选择年龄段</option>
                  <option value="青年">青年（25-35）</option>
                  <option value="中年">中年（35-50）</option>
                  <option value="银发">银发（60+）</option>
                </select>
                <input
                  className="banling-profile-input"
                  placeholder="主要担忧（如：父母医疗、退休金）"
                  value={profileInput.concern}
                  onChange={(e) => setProfileInput({ ...profileInput, concern: e.target.value })}
                />
                <div className="banling-profile-form-actions">
                  <button className="banling-text-btn" onClick={() => setShowProfileForm(false)}>取消</button>
                  <button className="banling-save-btn" onClick={handleSaveProfile}>保存</button>
                </div>
              </div>
            ) : profile ? (
              <div className="banling-profile-info">
                <div className="banling-profile-row">
                  <span className="banling-profile-key">昵称</span>
                  <span className="banling-profile-val">{profile.nickname}</span>
                </div>
                {profile.ageGroup && (
                  <div className="banling-profile-row">
                    <span className="banling-profile-key">年龄段</span>
                    <span className="banling-profile-val">{profile.ageGroup}</span>
                  </div>
                )}
                {profile.concern && (
                  <div className="banling-profile-row">
                    <span className="banling-profile-key">主要担忧</span>
                    <span className="banling-profile-val">{profile.concern}</span>
                  </div>
                )}
                <div className="banling-profile-row">
                  <span className="banling-profile-key">加入时间</span>
                  <span className="banling-profile-val">{formatTime(profile.createdAt)}</span>
                </div>
              </div>
            ) : (
              <p className="banling-profile-empty">还没有档案，点击「创建」建立你的养老规划档案</p>
            )}
          </div>

          {/* 统计概览 */}
          <div className="banling-report-section">
            <span className="banling-section-tag">规划概览</span>
            <div className="banling-stats-grid">
              <div className="banling-stat-card">
                <div className="banling-stat-num">{savedReports.length}</div>
                <div className="banling-stat-label">规划报告</div>
              </div>
              <div className="banling-stat-card">
                <div className="banling-stat-num">
                  {savedReports.reduce((sum, r) => sum + r.adoptedActions.filter(Boolean).length, 0)}
                </div>
                <div className="banling-stat-label">采纳建议</div>
              </div>
              <div className="banling-stat-card">
                <div className="banling-stat-num">{getProgress().percent}%</div>
                <div className="banling-stat-label">安心星</div>
              </div>
            </div>
          </div>

          {/* 历史报告 */}
          <div className="banling-report-section">
            <span className="banling-section-tag">历史报告</span>
            {savedReports.length === 0 ? (
              <p className="banling-profile-empty">还没有生成过规划报告</p>
            ) : (
              <div className="banling-history-list">
                {savedReports.map((r) => (
                  <div key={r.id} className="banling-history-item">
                    <div className="banling-history-main" onClick={() => handleViewReport(r)}>
                      <div className="banling-history-insight">{r.data.insight}</div>
                      <div className="banling-history-meta">
                        {formatTime(r.createdAt)} · {r.msgCount} 轮对话 · 采纳 {r.adoptedActions.filter(Boolean).length}/{r.data.actions.length}
                      </div>
                    </div>
                    <button
                      className="banling-history-del"
                      onClick={() => handleDeleteReport(r.id)}
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 查看历史报告详情 */}
          <AnimatePresence>
            {viewingReport && (
              <motion.div
                className="banling-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setViewingReport(null)}
              >
                <motion.div
                  className="banling-modal"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="banling-modal-header">
                    <span>历史报告 · {formatTime(viewingReport.createdAt)}</span>
                    <button className="banling-modal-close" onClick={() => setViewingReport(null)}>×</button>
                  </div>
                  <div className="banling-modal-body">
                    <div className="banling-insight-card">
                      <span className="banling-section-tag">核心洞察</span>
                      <h2 className="banling-insight-text">{viewingReport.data.insight}</h2>
                    </div>
                    <div className="banling-metrics-grid">
                      {viewingReport.data.metrics.map((m, i) => (
                        <div key={i} className="banling-metric-card">
                          <div className="banling-metric-label">{m.label}</div>
                          <div className="banling-metric-value">{m.value}</div>
                          <div className="banling-metric-hint">{m.hint}</div>
                        </div>
                      ))}
                    </div>
                    <div className="banling-actions-list">
                      {viewingReport.data.actions.map((a, i) => (
                        <div key={i} className={`banling-action-item ${viewingReport.adoptedActions[i] ? "adopted" : ""}`}>
                          <span className="banling-action-num">
                            {viewingReport.adoptedActions[i] ? "✓" : i + 1}
                          </span>
                          <span className="banling-action-text">{a}</span>
                        </div>
                      ))}
                    </div>
                    <div className="banling-report-summary">
                      <p>{viewingReport.data.summary}</p>
                    </div>
                    <button
                      className="banling-export-btn"
                      onClick={() => {
                        const text = exportReportAsText(viewingReport.data, viewingReport.createdAt);
                        downloadText(`伴龄规划报告_${new Date(viewingReport.createdAt).toISOString().slice(0, 10)}.txt`, text);
                        showToast("报告已导出");
                      }}
                    >
                      导出此报告
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <BanlingStyles />
      <BanlingToast toast={toast} />
    </div>
  );
}

/* ===== Toast 组件 ===== */
function BanlingToast({ toast }: { toast: string | null }) {
  if (!toast) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="banling-toast"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        {toast}
      </motion.div>
    </AnimatePresence>
  );
}

/* ===== 样式 ===== */
function BanlingStyles() {
  return (
    <style>{`
      .banling-root {
        min-height: 100vh;
        background: #f5f0e6;
        font-family: 'Noto Serif SC', 'Songti SC', 'STSong', serif;
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
        font-size: 13px;
        color: #8b7355;
        text-decoration: none;
        background: #ffffff;
        border: 1px solid #d4c4a8;
        border-radius: 0;
        transition: all 0.2s ease;
      }
      .banling-back:hover {
        background: #ede4d3;
        border-color: #8b7355;
      }

      /* ===== 个人中心入口 ===== */
      .banling-profile-entry {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 100;
        padding: 8px 16px;
        font-size: 13px;
        color: #6b5840;
        background: #ffffff;
        border: 1px solid #d4c4a8;
        border-radius: 0;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s ease;
      }
      .banling-profile-entry:hover {
        background: #ede4d3;
        border-color: #8b7355;
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
        font-size: 48px;
        margin-bottom: 16px;
        animation: banling-float 3s ease-in-out infinite;
      }
      @keyframes banling-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      .banling-title {
        font-size: 34px;
        font-weight: 700;
        color: #6b5840;
        margin: 0 0 8px;
        letter-spacing: 0.08em;
      }
      .banling-subtitle {
        font-size: 14px;
        color: #8b7355;
        margin: 0 0 32px;
        letter-spacing: 0.1em;
      }
      .banling-greeting {
        font-size: 17px;
        color: #5d4e3a;
        margin: 0 0 20px;
        font-weight: 500;
      }
      .banling-desc {
        font-size: 14px;
        line-height: 2.1;
        color: #6b5d4a;
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
        font-size: 22px;
        animation: banling-grow 2s ease-in-out infinite;
      }
      @keyframes banling-grow {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.15); }
      }
      .banling-progress-track {
        width: 160px;
        height: 6px;
        background: #e8dcc8;
        border-radius: 0;
        overflow: hidden;
      }
      .banling-progress-fill {
        height: 100%;
        background: #8b7355;
        border-radius: 0;
      }
      .banling-progress-label {
        font-size: 12px;
        color: #8b7355;
        white-space: nowrap;
      }

      /* ===== 开始按钮 ===== */
      .banling-start-btn {
        padding: 13px 40px;
        font-size: 15px;
        font-weight: 600;
        color: #f5f0e6;
        background: #6b5840;
        border: 1px solid #6b5840;
        border-radius: 0;
        cursor: pointer;
        font-family: inherit;
        letter-spacing: 0.05em;
        transition: all 0.3s ease;
      }
      .banling-start-btn:hover {
        background: #5d4e3a;
        border-color: #5d4e3a;
        transform: translateY(-1px);
      }
      .banling-history-btn {
        display: block;
        margin: 16px auto 0;
        padding: 8px 20px;
        font-size: 13px;
        color: #8b7355;
        background: transparent;
        border: 1px solid #d4c4a8;
        border-radius: 0;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s ease;
      }
      .banling-history-btn:hover {
        background: #ede4d3;
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
        background: #ffffff;
        border-bottom: 1px solid #d4c4a8;
        flex-shrink: 0;
      }
      .banling-chat-back {
        background: none;
        border: none;
        font-size: 18px;
        color: #8b7355;
        cursor: pointer;
        padding: 4px 8px;
        font-family: inherit;
      }
      .banling-chat-title {
        flex: 1;
        font-size: 14px;
        font-weight: 600;
        color: #5d4e3a;
        letter-spacing: 0.04em;
      }
      .banling-report-btn {
        padding: 6px 14px;
        font-size: 12px;
        color: #f5f0e6;
        background: #6b5840;
        border: 1px solid #6b5840;
        border-radius: 0;
        cursor: pointer;
        white-space: nowrap;
        font-family: inherit;
        transition: all 0.2s ease;
      }
      .banling-report-btn:hover {
        background: #5d4e3a;
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
        width: 34px;
        height: 34px;
        border-radius: 0;
        background: #ede4d3;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 17px;
        flex-shrink: 0;
      }
      .banling-msg.user .banling-msg-avatar {
        background: #e0d4bc;
      }
      .banling-msg-bubble {
        padding: 12px 16px;
        border-radius: 0;
        font-size: 14px;
        line-height: 1.7;
      }
      .banling-msg.assistant .banling-msg-bubble {
        background: #ffffff;
        color: #4a3828;
        border: 1px solid #e8dcc8;
        border-top-left-radius: 0;
      }
      .banling-msg.user .banling-msg-bubble {
        background: #6b5840;
        color: #f5f0e6;
        border-top-right-radius: 0;
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
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #8b7355;
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
        padding: 7px 14px;
        font-size: 12px;
        color: #6b5840;
        background: #ffffff;
        border: 1px solid #d4c4a8;
        border-radius: 0;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s ease;
      }
      .banling-quick-btn:hover {
        background: #ede4d3;
        border-color: #8b7355;
      }

      /* ===== 输入栏 ===== */
      .banling-input-bar {
        display: flex;
        gap: 10px;
        padding: 12px 20px;
        background: #ffffff;
        border-top: 1px solid #d4c4a8;
        flex-shrink: 0;
      }
      .banling-input {
        flex: 1;
        padding: 10px 14px;
        font-size: 14px;
        border: 1px solid #d4c4a8;
        border-radius: 0;
        background: #fdfaf4;
        resize: none;
        outline: none;
        font-family: inherit;
        color: #4a3828;
        transition: border-color 0.2s ease;
      }
      .banling-input:focus {
        border-color: #8b7355;
      }
      .banling-send-btn {
        padding: 0 20px;
        font-size: 14px;
        font-weight: 600;
        color: #f5f0e6;
        background: #6b5840;
        border: 1px solid #6b5840;
        border-radius: 0;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s ease;
      }
      .banling-send-btn:disabled {
        background: #c8bca8;
        border-color: #c8bca8;
        cursor: not-allowed;
      }
      .banling-send-btn:not(:disabled):hover {
        background: #5d4e3a;
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
        font-size: 44px;
        margin-bottom: 16px;
        animation: banling-grow 1.5s ease-in-out infinite;
      }
      .banling-loading-sub {
        font-size: 12px;
        color: #8b7355;
        margin-top: 8px;
      }

      .banling-report-section {
        margin-bottom: 28px;
      }
      .banling-section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
      }
      .banling-section-tag {
        display: inline-block;
        padding: 4px 12px;
        font-size: 11px;
        color: #6b5840;
        background: transparent;
        border: 1px solid #8b7355;
        border-radius: 0;
        margin-bottom: 14px;
        letter-spacing: 0.05em;
      }
      .banling-section-header .banling-section-tag {
        margin-bottom: 0;
      }
      .banling-text-btn {
        background: none;
        border: none;
        font-size: 12px;
        color: #8b7355;
        cursor: pointer;
        font-family: inherit;
        text-decoration: underline;
        padding: 0;
      }
      .banling-text-btn:hover {
        color: #6b5840;
      }
      .banling-insight-card {
        background: #ffffff;
        border: 1px solid #e8dcc8;
        border-radius: 0;
        padding: 24px;
      }
      .banling-insight-text {
        font-size: 17px;
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
        background: #ffffff;
        border: 1px solid #e8dcc8;
        border-radius: 0;
        padding: 16px 12px;
        text-align: center;
      }
      .banling-metric-label {
        font-size: 11px;
        color: #8b7355;
        margin-bottom: 6px;
      }
      .banling-metric-value {
        font-size: 19px;
        font-weight: 700;
        color: #6b5840;
        margin-bottom: 4px;
      }
      .banling-metric-hint {
        font-size: 10px;
        color: #a89880;
      }

      /* ===== 行动建议 ===== */
      .banling-action-hint {
        font-size: 12px;
        color: #a89880;
        margin: 0 0 10px;
      }
      .banling-actions-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .banling-action-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        background: #ffffff;
        border: 1px solid #e8dcc8;
        border-radius: 0;
        padding: 14px 16px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .banling-action-item:hover {
        background: #fdfaf4;
        border-color: #d4c4a8;
      }
      .banling-action-item.adopted {
        background: #ede4d3;
        border-color: #8b7355;
      }
      .banling-action-item.adopted .banling-action-text {
        text-decoration: line-through;
        color: #8b7355;
      }
      .banling-action-num {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        border-radius: 0;
        background: #6b5840;
        color: #f5f0e6;
        font-size: 12px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: inherit;
      }
      .banling-action-item.adopted .banling-action-num {
        background: #5d8a6a;
      }
      .banling-action-text {
        font-size: 14px;
        line-height: 1.6;
        color: #4a3828;
      }

      /* ===== 寄语 ===== */
      .banling-report-summary {
        background: #ede4d3;
        border: 1px solid #d4c4a8;
        border-radius: 0;
        padding: 24px;
        text-align: center;
        margin-bottom: 28px;
      }
      .banling-report-summary p {
        font-size: 14px;
        line-height: 1.8;
        color: #5d4e3a;
        margin: 0;
        font-style: italic;
      }

      /* ===== 导出分享 ===== */
      .banling-export-bar {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-bottom: 20px;
      }
      .banling-export-btn {
        padding: 10px 24px;
        font-size: 13px;
        font-weight: 600;
        color: #6b5840;
        background: #ffffff;
        border: 1px solid #6b5840;
        border-radius: 0;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s ease;
      }
      .banling-export-btn:hover {
        background: #ede4d3;
      }

      /* ===== 操作按钮 ===== */
      .banling-report-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }
      .banling-again-btn {
        padding: 11px 28px;
        font-size: 13px;
        font-weight: 600;
        color: #6b5840;
        background: #ffffff;
        border: 1px solid #6b5840;
        border-radius: 0;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s ease;
      }
      .banling-again-btn:hover {
        background: #ede4d3;
      }
      .banling-restart-btn {
        padding: 11px 28px;
        font-size: 13px;
        font-weight: 600;
        color: #f5f0e6;
        background: #6b5840;
        border: 1px solid #6b5840;
        border-radius: 0;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s ease;
      }
      .banling-restart-btn:hover {
        background: #5d4e3a;
      }

      /* ===== 个人中心 ===== */
      .banling-profile-root {
        min-height: 100vh;
        padding-top: 60px;
      }
      .banling-profile-inner {
        max-width: 640px;
        margin: 0 auto;
        padding: 20px;
      }
      .banling-profile-title {
        font-size: 24px;
        font-weight: 700;
        color: #6b5840;
        margin: 0 0 28px;
        letter-spacing: 0.05em;
      }
      .banling-profile-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .banling-profile-input {
        padding: 10px 14px;
        font-size: 14px;
        border: 1px solid #d4c4a8;
        border-radius: 0;
        background: #fdfaf4;
        outline: none;
        font-family: inherit;
        color: #4a3828;
      }
      .banling-profile-input:focus {
        border-color: #8b7355;
      }
      .banling-profile-form-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        align-items: center;
      }
      .banling-save-btn {
        padding: 8px 24px;
        font-size: 13px;
        font-weight: 600;
        color: #f5f0e6;
        background: #6b5840;
        border: 1px solid #6b5840;
        border-radius: 0;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s ease;
      }
      .banling-save-btn:hover {
        background: #5d4e3a;
      }
      .banling-profile-info {
        background: #ffffff;
        border: 1px solid #e8dcc8;
        border-radius: 0;
        padding: 16px 20px;
      }
      .banling-profile-row {
        display: flex;
        padding: 8px 0;
        border-bottom: 1px solid #f0eadd;
      }
      .banling-profile-row:last-child {
        border-bottom: none;
      }
      .banling-profile-key {
        width: 100px;
        font-size: 13px;
        color: #8b7355;
        flex-shrink: 0;
      }
      .banling-profile-val {
        font-size: 14px;
        color: #4a3828;
      }
      .banling-profile-empty {
        font-size: 13px;
        color: #a89880;
        margin: 0;
        padding: 20px;
        background: #ffffff;
        border: 1px solid #e8dcc8;
        border-radius: 0;
      }

      /* ===== 统计概览 ===== */
      .banling-stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }
      .banling-stat-card {
        background: #ffffff;
        border: 1px solid #e8dcc8;
        border-radius: 0;
        padding: 20px 12px;
        text-align: center;
      }
      .banling-stat-num {
        font-size: 26px;
        font-weight: 700;
        color: #6b5840;
        margin-bottom: 4px;
      }
      .banling-stat-label {
        font-size: 11px;
        color: #8b7355;
      }

      /* ===== 历史报告 ===== */
      .banling-history-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .banling-history-item {
        display: flex;
        align-items: center;
        gap: 12px;
        background: #ffffff;
        border: 1px solid #e8dcc8;
        border-radius: 0;
        padding: 14px 16px;
        transition: all 0.2s ease;
      }
      .banling-history-item:hover {
        border-color: #d4c4a8;
      }
      .banling-history-main {
        flex: 1;
        cursor: pointer;
        min-width: 0;
      }
      .banling-history-insight {
        font-size: 14px;
        color: #4a3828;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .banling-history-meta {
        font-size: 11px;
        color: #a89880;
      }
      .banling-history-del {
        flex-shrink: 0;
        padding: 4px 12px;
        font-size: 11px;
        color: #b06a6a;
        background: transparent;
        border: 1px solid #d4b8b8;
        border-radius: 0;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s ease;
      }
      .banling-history-del:hover {
        background: #f5e8e8;
        border-color: #b06a6a;
      }

      /* ===== 弹窗 ===== */
      .banling-modal-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(74, 56, 40, 0.4);
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .banling-modal {
        background: #f5f0e6;
        border: 1px solid #8b7355;
        border-radius: 0;
        max-width: 560px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
      }
      .banling-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 20px;
        border-bottom: 1px solid #d4c4a8;
        font-size: 14px;
        color: #5d4e3a;
        font-weight: 600;
      }
      .banling-modal-close {
        background: none;
        border: none;
        font-size: 22px;
        color: #8b7355;
        cursor: pointer;
        font-family: inherit;
        padding: 0;
        line-height: 1;
      }
      .banling-modal-body {
        padding: 20px;
      }
      .banling-modal-body .banling-insight-card {
        margin-bottom: 20px;
      }
      .banling-modal-body .banling-metrics-grid {
        margin-bottom: 20px;
      }
      .banling-modal-body .banling-actions-list {
        margin-bottom: 20px;
      }
      .banling-modal-body .banling-action-item {
        cursor: default;
      }
      .banling-modal-body .banling-report-summary {
        margin-bottom: 20px;
      }

      /* ===== Toast ===== */
      .banling-toast {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px 24px;
        font-size: 13px;
        color: #f5f0e6;
        background: #6b5840;
        border: 1px solid #5d4e3a;
        border-radius: 0;
        z-index: 300;
        font-family: inherit;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      /* ===== 响应式 ===== */
      @media (max-width: 640px) {
        .banling-metrics-grid,
        .banling-stats-grid {
          grid-template-columns: 1fr;
        }
        .banling-title { font-size: 28px; }
        .banling-desc { font-size: 13px; }
        .banling-msg { max-width: 92%; }
        .banling-report-actions,
        .banling-export-bar {
          flex-direction: column;
        }
        .banling-profile-row {
          flex-direction: column;
          gap: 2px;
        }
        .banling-profile-key {
          width: auto;
        }
      }
    `}</style>
  );
}
