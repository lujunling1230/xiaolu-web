import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { track } from "../../utils/track";
import { callAI } from "../../utils/aiClient";

/**
 * 伴龄 · AI 养老规划伴侣
 *
 * 5 Tab 底部导航结构：首页 / AI规划 / 报告 / 工具 / 我的
 * 暖橙黄主色 #FFB84D / 暖白背景 #FFF9F0 / 白色卡片 + 柔和阴影
 * 复用 /api/ai 通用 AI 代理
 */

/* ===== 类型 ===== */
type Tab = "home" | "ai" | "report" | "tools" | "profile";

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

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  messageCount: number;
  status: "ongoing" | "completed";
}

interface UserProfile {
  nickname: string;
  ageGroup: string;
  concern: string;
  createdAt: number;
}

/* ===== localStorage ===== */
const REPORTS_KEY = "banling_reports";
const PROFILE_KEY = "banling_profile";
const SESSIONS_KEY = "banling_sessions";

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

const loadSessions = (): ChatSession[] => {
  try {
    const r = localStorage.getItem(SESSIONS_KEY);
    return r ? JSON.parse(r) : [];
  } catch {
    return [];
  }
};

const saveSessions = (sessions: ChatSession[]) => {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
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
3. 用"我们"代替"你"，用"小目标"代替"强制储蓄"
4. 每轮回复控制在150字以内，语气像朋友聊天
5. 当采集到足够信息（至少3轮对话）后，主动引导用户查看规划报告

【采集信息清单】
- 年龄段（青年/中年/银发）
- 主要担忧（父母医疗/自己退休金/孤独感/怕被骗）
- 当前财务状况（收入水平/是否有社保/是否有商业保险）
- 期望退休年龄和生活方式`;

/* ===== 快捷回复 ===== */
const QUICK_REPLIES = ["25岁", "30岁", "35岁", "40岁以上"];

const CONCERN_REPLIES = [
  "我还年轻，养老太远了吧",
  "担心父母的医疗费用",
  "不知道退休金够不够",
  "怕老了孤独",
];

/* ===== 动态问候 ===== */
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "夜深了，还在想未来的事吗？";
  if (h < 12) return "早上好！今天也是美好的一天";
  if (h < 18) return "午后的阳光正好，聊聊我们的未来？";
  return "夜幕降临，让我们规划一下安心岁月。";
}

/* ===== 格式化时间 ===== */
const formatDate = (ts: number) => {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

const formatTime = (ts: number) => {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

/* ===== 导出报告 ===== */
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
  return lines.join("\n");
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/* ===== 工具箱计算 ===== */
interface CalcParams {
  currentAge: number;
  retireAge: number;
  monthlyIncome: number;
  pension: number;
  monthlyExpense: number;
  lifeExpectancy: number;
  returnRate: number;
}

function calcPensionGap(p: CalcParams) {
  const yearsToRetire = p.retireAge - p.currentAge;
  const yearsInRetire = p.lifeExpectancy - p.retireAge;
  const monthlyGap = p.monthlyExpense - p.pension;
  const totalGap = monthlyGap * 12 * yearsInRetire;
  const monthlySave = Math.max(0, (p.monthlyIncome * 0.2));
  const totalSave = monthlySave * 12 * yearsToRetire;
  const investGrowth = totalSave * (Math.pow(1 + p.returnRate / 100, yearsToRetire) - 1);
  const finalSavings = Math.round(totalSave + investGrowth);
  return { yearsToRetire, yearsInRetire, monthlyGap, totalGap, finalSavings };
}

/* ===== 滑块组件 ===== */
function Slider({
  label, value, min, max, step = 1, unit, onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number; unit: string;
  onChange: (v: number) => void;
}) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div className="bl-slider-row">
      <div className="bl-slider-label">
        <span>{label}</span>
        <span className="bl-slider-value">{unit === "¥" ? `¥${value.toLocaleString()}` : `${value}${unit}`}</span>
      </div>
      <div className="bl-slider-track-wrap">
        <div className="bl-slider-bg" />
        <div className="bl-slider-fill" style={{ width: `${percent}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="bl-slider-input"
        />
      </div>
      <div className="bl-slider-range">
        <span>{unit === "¥" ? `¥${min.toLocaleString()}` : `${min}${unit}`}</span>
        <span>{unit === "¥" ? `¥${max.toLocaleString()}` : `${max}${unit}`}</span>
      </div>
    </div>
  );
}

/* ===== 底部导航 ===== */
function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { key: Tab; label: string; icon: string }[] = [
    { key: "home", label: "首页", icon: "home" },
    { key: "ai", label: "AI规划", icon: "chat" },
    { key: "report", label: "报告", icon: "doc" },
    { key: "tools", label: "工具", icon: "tool" },
    { key: "profile", label: "我的", icon: "user" },
  ];
  return (
    <div className="bl-bottom-nav">
      {items.map((item) => (
        <button
          key={item.key}
          className={`bl-nav-item ${tab === item.key ? "active" : ""}`}
          onClick={() => onChange(item.key)}
        >
          <svg className="bl-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {item.icon === "home" && <path d="M3 12l9-9 9 9M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />}
            {item.icon === "chat" && <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" /></>}
            {item.icon === "doc" && <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 2v6h6M8 13h8M8 17h5" strokeLinecap="round" /></>}
            {item.icon === "tool" && <><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round" /></>}
            {item.icon === "user" && <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="7" r="4" /></>}
          </svg>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ============================================================
 * 主组件
 * ============================================================ */
export default function BanlingPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pwdInput, setPwdInput] = useState("");
  const [pwdError, setPwdError] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [viewingReport, setViewingReport] = useState<SavedReport | null>(null);
  const [adoptedActions, setAdoptedActions] = useState<boolean[]>([]);

  /* 密码校验 */
  const handleUnlock = useCallback(() => {
    if (pwdInput.trim() === "ling") {
      setUnlocked(true);
      setPwdError(false);
    } else {
      setPwdError(true);
      setPwdInput("");
    }
  }, [pwdInput]);

  /* 工具箱状态 */
  const [toolTab, setToolTab] = useState<"calc" | "plan" | "goal">("calc");
  const [calcResult, setCalcResult] = useState<ReturnType<typeof calcPensionGap> | null>(null);
  const [calcParams, setCalcParams] = useState<CalcParams>({
    currentAge: 30, retireAge: 65, monthlyIncome: 8000, pension: 3000,
    monthlyExpense: 6000, lifeExpectancy: 85, returnRate: 5,
  });
  const [planParams, setPlanParams] = useState({
    currentAge: 30, monthlyIncome: 8000, currentSavings: 50000, retireAge: 60,
  });
  const [planScenario, setPlanScenario] = useState<"early" | "normal" | "late">("normal");
  const [goalParams, setGoalParams] = useState({
    retireAge: 65, monthlyExpense: 6000, totalAssets: 1500000, lifeExpectancy: 85,
  });
  const [goalVision, setGoalVision] = useState("");

  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    track("tool_enter", { tool_name: "伴龄" });
    setSavedReports(loadReports());
    setProfile(loadProfile());
    setSessions(loadSessions());
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ===== AI 对话 ===== */
  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    track("banling_chat", { msg_length: trimmed.length });

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`, role: "user", content: trimmed, timestamp: Date.now(),
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
        setMessages((prev) => [...prev, {
          id: `a-${Date.now()}`, role: "assistant", content: reply, timestamp: Date.now(),
        }]);
      }
    } catch {
      /* 静默处理 */
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [messages, loading]);

  /* 开始新对话 */
  const handleStartChat = useCallback(() => {
    setTab("ai");
    const greeting: ChatMessage = {
      id: `a-${Date.now()}`, role: "assistant",
      content: "你好！我是伴龄，你的 AI 养老规划伴侣 🌟\n\n养老规划听起来很遥远，但就像给未来的自己写一封信——我们现在开始，就是最好的时机。\n\n先聊聊，请问你今年多大了？",
      timestamp: Date.now(),
    };
    setMessages([greeting]);

    /* 创建新会话记录 */
    const newSession: ChatSession = {
      id: `s-${Date.now()}`,
      title: "新的养老规划对话",
      createdAt: Date.now(),
      messageCount: 1,
      status: "ongoing",
    };
    const updated = [newSession, ...sessions].slice(0, 20);
    setSessions(updated);
    saveSessions(updated);
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [sessions]);

  /* 生成报告 */
  const handleGenerateReport = useCallback(async () => {
    setTab("report");
    setReportLoading(true);
    track("banling_report", { msg_count: messages.length });

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const reportPrompt = `基于以下对话内容，为用户生成一份养老规划报告。
要求返回严格 JSON 格式（不要 markdown 代码块），结构如下：
{
  "insight": "一句核心洞察",
  "metrics": [
    {"label": "安全感分数", "value": "75", "hint": "满分100"},
    {"label": "缺口估算", "value": "约200万", "hint": "按当前消费水平"},
    {"label": "建议起步", "value": "每月500元", "hint": "小目标定投"}
  ],
  "actions": ["第一步行动", "第二步行动", "第三步行动"],
  "summary": "温暖收尾寄语"
}

对话记录：
${messages.map((m) => `${m.role === "user" ? "用户" : "伴龄"}: ${m.content}`).join("\n")}`;

      const result = await callAI(
        "你是养老规划报告生成助手，只返回JSON格式数据。",
        [{ role: "user", content: reportPrompt }],
        { maxTokens: 600, temperature: 0.5, signal: controller.signal, model: "qwen-plus" }
      );

      let parsed: ReportData;
      try {
        const cleaned = result.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(cleaned);
      } catch {
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

      setAdoptedActions(new Array(parsed.actions.length).fill(false));

      const newReport: SavedReport = {
        id: `r-${Date.now()}`, data: parsed, createdAt: Date.now(),
        msgCount: messages.length,
        adoptedActions: new Array(parsed.actions.length).fill(false),
      };
      const updated = [newReport, ...savedReports].slice(0, 20);
      setSavedReports(updated);
      saveReports(updated);
      setViewingReport(newReport);

      /* 更新会话状态 */
      const updatedSessions = sessions.map((s, i) =>
        i === 0 ? { ...s, status: "completed" as const, messageCount: messages.length } : s
      );
      setSessions(updatedSessions);
      saveSessions(updatedSessions);
    } catch {
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
        summary: "未来很长，我们慢慢来。",
      };
      const newReport: SavedReport = {
        id: `r-${Date.now()}`, data: fallback, createdAt: Date.now(),
        msgCount: messages.length,
        adoptedActions: new Array(fallback.actions.length).fill(false),
      };
      const updated = [newReport, ...savedReports].slice(0, 20);
      setSavedReports(updated);
      saveReports(updated);
      setViewingReport(newReport);
    } finally {
      setReportLoading(false);
      abortRef.current = null;
    }
  }, [messages, savedReports, sessions]);

  /* 采纳建议 */
  const toggleAction = useCallback((index: number) => {
    setAdoptedActions((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      if (viewingReport) {
        const updated = savedReports.map((r) =>
          r.id === viewingReport.id ? { ...r, adoptedActions: next } : r
        );
        setSavedReports(updated);
        saveReports(updated);
      }
      return next;
    });
    track("banling_action_adopt", { index });
  }, [viewingReport, savedReports]);

  const handleExport = useCallback(() => {
    if (!viewingReport) return;
    const text = exportReportAsText(viewingReport.data, viewingReport.createdAt);
    downloadText(`伴龄规划报告_${new Date().toISOString().slice(0, 10)}.txt`, text);
    showToast("报告已导出");
  }, [viewingReport, showToast]);

  const handleCopy = useCallback(async () => {
    if (!viewingReport) return;
    const text = exportReportAsText(viewingReport.data, viewingReport.createdAt);
    const ok = await copyToClipboard(text);
    showToast(ok ? "报告已复制到剪贴板" : "复制失败");
  }, [viewingReport, showToast]);

  const handleDeleteReport = useCallback((id: string) => {
    const updated = savedReports.filter((r) => r.id !== id);
    setSavedReports(updated);
    saveReports(updated);
    if (viewingReport?.id === id) setViewingReport(null);
    showToast("已删除");
  }, [savedReports, viewingReport, showToast]);

  /* 保存昵称 */
  const [editNickname, setEditNickname] = useState("");
  const handleSaveNickname = useCallback(() => {
    const name = editNickname.trim() || "匿名用户";
    const p: UserProfile = {
      nickname: name,
      ageGroup: profile?.ageGroup || "",
      concern: profile?.concern || "",
      createdAt: profile?.createdAt || Date.now(),
    };
    setProfile(p);
    saveProfile(p);
    showToast("已保存");
  }, [editNickname, profile, showToast]);

  /* 计算按钮 */
  const handleCalc = () => {
    setCalcResult(calcPensionGap(calcParams));
  };

  /* 安心星进度计算 */
  const getProgress = useCallback((): { percent: number; label: string; stars: number } => {
    let stars = 0;
    if (profile?.nickname) stars++;
    if (sessions.length > 0) stars++;
    if (messages.length >= 4) stars++;
    if (savedReports.length > 0) stars++;
    if (savedReports.some((r) => r.adoptedActions.some((a) => a))) stars++;
    const percent = Math.round((stars / 5) * 100);
    const label =
      stars === 0 ? "尚未启程" :
      stars <= 1 ? "迈出第一步" :
      stars <= 2 ? "正在了解自己" :
      stars <= 3 ? "规划进行中" :
      stars <= 4 ? "方案已成形" : "安心在眼前";
    return { percent, label, stars };
  }, [profile, sessions, messages, savedReports]);

  /* 退休规划场景计算 */
  const planScenarios = {
    early: { age: 55, years: 55 - planParams.currentAge, label: "提前退休", tag: "激进", color: "#FFB3B3" },
    normal: { age: 60, years: 60 - planParams.currentAge, label: "正常退休", tag: "推荐", color: "#FFD56B" },
    late: { age: 65, years: 65 - planParams.currentAge, label: "延迟退休", tag: "保守", color: "#B3D9B3" },
  };
  const currentScenario = planScenarios[planScenario];
  const planEstimate = Math.round(
    planParams.monthlyIncome * 0.2 * 12 * currentScenario.years *
    (1 + 0.05 * currentScenario.years / 2) + planParams.currentSavings
  );

  /* ============================================================
   * 渲染：首页
   * ============================================================ */
  const renderHome = () => (
    <div className="bl-page bl-home">
      {/* 问候语 */}
      <div className="bl-greeting-bar">
        <span className="bl-greeting-text">✨ {getGreeting()}</span>
        <span className="bl-greeting-date">{formatDate(Date.now())}</span>
      </div>

      {/* Hero 区 */}
      <div className="bl-hero">
        <div className="bl-hero-logo">
          <div className="bl-logo-icon">💛</div>
          <span>伴龄</span>
        </div>
        <h1 className="bl-hero-title">
          养老不焦虑
          <br />
          <span className="bl-hero-accent">我们用数据说话</span>
        </h1>
        <p className="bl-hero-desc">
          结合 AI 智能算法与专业顾问经验，
          <br />
          为您量身定制个性化养老规划方案
        </p>

        {/* 养老金输入 */}
        <div className="bl-pension-input">
          <label>我的养老金</label>
          <div className="bl-pension-field">
            <span className="bl-currency">¥</span>
            <input type="text" placeholder="3000" defaultValue="" />
          </div>
        </div>

        {/* CTA */}
        <button className="bl-cta-main" onClick={handleStartChat}>
          测测我的养老缺口 →
        </button>

        {/* 信任标签 */}
        <div className="bl-trust-tags">
          <span>✓ 专业评估</span>
          <span>✓ 智能规划</span>
          <span>✓ 专属服务</span>
        </div>
      </div>

      {/* 安心星卡片 */}
      <div className="bl-star-card">
        <div className="bl-star-header">
          <span className="bl-star-title">🌟 我的安心星</span>
          <span className="bl-star-count">{getProgress().stars}/5</span>
        </div>
        <div className="bl-star-row">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`bl-star ${i < getProgress().stars ? "filled" : ""}`}>★</span>
          ))}
        </div>
        <div className="bl-star-progress">
          <div className="bl-star-track">
            <motion.div
              className="bl-star-fill"
              initial={{ width: 0 }}
              animate={{ width: `${getProgress().percent}%` }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </div>
          <span className="bl-star-label">🌱 {getProgress().label}</span>
        </div>
      </div>

      {/* 目标人群 */}
      <div className="bl-section">
        <h2 className="bl-section-title">我们是您身边的谁?</h2>
        <div className="bl-persona-grid">
          <div className="bl-persona-card bl-persona-green">
            <div className="bl-persona-icon">🌱</div>
            <h3>职场新鲜人</h3>
            <p className="bl-persona-age">20-30岁</p>
            <p>刚步入职场，趁年轻提前布局</p>
          </div>
          <div className="bl-persona-card bl-persona-orange">
            <div className="bl-persona-icon">🏠</div>
            <h3>家庭顶梁柱</h3>
            <p className="bl-persona-age">30-50岁</p>
            <p>事业稳定，优化资产配置</p>
          </div>
          <div className="bl-persona-card bl-persona-pink">
            <div className="bl-persona-icon">🌸</div>
            <h3>预备退休族</h3>
            <p className="bl-persona-age">50岁+</p>
            <p>退休在即，确保安享晚年</p>
          </div>
        </div>
      </div>

      {/* 价值主张 */}
      <div className="bl-section">
        <h2 className="bl-section-title">为什么选择伴龄?</h2>
        <div className="bl-value-grid">
          <div className="bl-value-card">
            <div className="bl-value-icon">🤖</div>
            <h3>智能AI测算</h3>
            <p>AI 驱动精准计算</p>
          </div>
          <div className="bl-value-card">
            <div className="bl-value-icon">📋</div>
            <h3>个性化规划</h3>
            <p>专属定制养老路径</p>
          </div>
          <div className="bl-value-card">
            <div className="bl-value-icon">📊</div>
            <h3>可视化分析</h3>
            <p>进度一目了然</p>
          </div>
          <div className="bl-value-card">
            <div className="bl-value-icon">🎧</div>
            <h3>专家1V1服务</h3>
            <p>专业顾问贴心陪伴</p>
          </div>
        </div>
      </div>

      {/* 4步流程 */}
      <div className="bl-section">
        <h2 className="bl-section-title">4步完成您的养老规划</h2>
        <div className="bl-steps">
          {[
            { num: "01", title: "评估测算", desc: "智能评估当前养老状况", color: "#FF9F43" },
            { num: "02", title: "缺口分析", desc: "精准分析养老金缺口", color: "#FFC107" },
            { num: "03", title: "定制方案", desc: "生成个性化规划方案", color: "#FFB74D" },
            { num: "04", title: "长期陪伴", desc: "持续跟踪定期复盘", color: "#FB8C00" },
          ].map((step) => (
            <div key={step.num} className="bl-step-card" style={{ background: step.color }}>
              <div className="bl-step-num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 底部 CTA */}
      <div className="bl-section bl-final-cta">
        <h2>现在就行动，未来的你会感谢今天</h2>
        <p>养老规划越早开始，收获越丰厚</p>
        <button className="bl-cta-main" onClick={handleStartChat}>
          免费获取我的养老方案 →
        </button>
      </div>

      {/* Footer */}
      <div className="bl-footer">
        <p>© 2026 伴龄 养老规划平台 All rights reserved</p>
      </div>
    </div>
  );

  /* ============================================================
   * 渲染：AI 规划对话
   * ============================================================ */
  const renderAI = () => (
    <div className="bl-page bl-ai-page">
      {/* 顶栏 */}
      <div className="bl-ai-topbar">
        <div className="bl-ai-topbar-logo">
          <div className="bl-logo-icon-sm">💛</div>
          <span>伴龄</span>
        </div>
        <span className="bl-ai-status">温暖模式 · 正在陪伴</span>
      </div>

      {/* 对话区 */}
      <div className="bl-ai-body">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bl-msg ${msg.role}`}
            >
              {msg.role === "assistant" && (
                <div className="bl-msg-avatar">
                  <span className="bl-ai-tag">AI</span>
                </div>
              )}
              <div className="bl-msg-bubble">
                {msg.content.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="bl-msg assistant">
            <div className="bl-msg-avatar">
              <span className="bl-ai-tag">AI</span>
            </div>
            <div className="bl-msg-bubble bl-typing">
              <span /> <span /> <span />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 快捷回复 */}
      {messages.length <= 2 && !loading && (
        <div className="bl-quick-replies">
          {QUICK_REPLIES.map((reply) => (
            <button key={reply} className="bl-quick-btn" onClick={() => handleSend(reply)}>
              {reply}
            </button>
          ))}
        </div>
      )}
      {messages.length > 2 && messages.length < 8 && !loading && (
        <div className="bl-quick-replies">
          {CONCERN_REPLIES.map((reply) => (
            <button key={reply} className="bl-quick-btn" onClick={() => handleSend(reply)}>
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* 生成报告按钮 */}
      {messages.length >= 4 && !loading && (
        <div className="bl-report-trigger">
          <button className="bl-report-trigger-btn" onClick={handleGenerateReport}>
            查看规划报告 →
          </button>
        </div>
      )}

      {/* 输入栏 */}
      <div className="bl-input-bar">
        <textarea
          ref={inputRef}
          className="bl-input"
          placeholder="说说你的想法... (Enter 发送, Shift+Enter 换行)"
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
          className="bl-send-btn"
          onClick={() => handleSend(input)}
          disabled={!input.trim() || loading}
        >
          {loading ? "…" : "➤"}
        </button>
      </div>
    </div>
  );

  /* ============================================================
   * 渲染：报告
   * ============================================================ */
  const renderReport = () => {
    if (reportLoading) {
      return (
        <div className="bl-page bl-report-page">
          <div className="bl-report-loading">
            <div className="bl-loading-spinner" />
            <p>正在生成您的规划报告...</p>
          </div>
        </div>
      );
    }

    if (viewingReport) {
      const r = viewingReport.data;
      return (
        <div className="bl-page bl-report-page">
          <div className="bl-report-header">
            <button className="bl-back-btn" onClick={() => setViewingReport(null)}>←</button>
            <h2>规划报告</h2>
          </div>
          <div className="bl-report-content">
            <div className="bl-report-meta">
              生成于 {formatTime(viewingReport.createdAt)} · 基于 {viewingReport.msgCount} 条对话
            </div>

            {/* 核心洞察 */}
            <div className="bl-report-card bl-insight-card">
              <h3>💡 核心洞察</h3>
              <p>{r.insight}</p>
            </div>

            {/* 关键指标 */}
            <div className="bl-report-card">
              <h3>📊 关键指标</h3>
              <div className="bl-metrics-grid">
                {r.metrics.map((m, i) => (
                  <div key={i} className="bl-metric-item">
                    <div className="bl-metric-label">{m.label}</div>
                    <div className="bl-metric-value">{m.value}</div>
                    <div className="bl-metric-hint">{m.hint}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 行动建议 */}
            <div className="bl-report-card">
              <h3>🎯 行动建议</h3>
              <div className="bl-actions-list">
                {r.actions.map((action, i) => (
                  <div key={i} className={`bl-action-item ${adoptedActions[i] ? "adopted" : ""}`}>
                    <button
                      className="bl-action-check"
                      onClick={() => toggleAction(i)}
                    >
                      {adoptedActions[i] ? "✓" : "○"}
                    </button>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 寄语 */}
            <div className="bl-report-card bl-summary-card">
              <h3>💌 寄语</h3>
              <p>{r.summary}</p>
            </div>

            {/* 操作按钮 */}
            <div className="bl-report-actions">
              <button className="bl-btn-outline" onClick={handleExport}>导出报告</button>
              <button className="bl-btn-outline" onClick={handleCopy}>复制内容</button>
            </div>
          </div>
        </div>
      );
    }

    /* 空状态 */
    return (
      <div className="bl-page bl-report-page">
        <div className="bl-report-empty">
          <div className="bl-empty-icon">📄</div>
          <h2>暂无规划报告</h2>
          <p>还没有生成养老规划报告，先和 AI 伴侣聊聊吧</p>
          <button className="bl-cta-main" onClick={handleStartChat}>
            开始 AI 规划对话 →
          </button>
        </div>

        {/* 历史报告列表 */}
        {savedReports.length > 0 && (
          <div className="bl-report-history">
            <h3 className="bl-history-title">历史报告</h3>
            {savedReports.map((r) => (
              <div key={r.id} className="bl-history-item">
                <div className="bl-history-info" onClick={() => { setViewingReport(r); setAdoptedActions(r.adoptedActions); }}>
                  <div className="bl-history-date">{formatDate(r.createdAt)}</div>
                  <div className="bl-history-insight">{r.data.insight}</div>
                </div>
                <button className="bl-history-delete" onClick={() => handleDeleteReport(r.id)}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ============================================================
   * 渲染：工具箱
   * ============================================================ */
  const renderTools = () => (
    <div className="bl-page bl-tools-page">
      <div className="bl-tools-header">
        <h1 className="bl-tools-title">规划工具箱</h1>
        <p className="bl-tools-sub">专业工具，精准规划你的养老未来</p>
      </div>

      {/* Tab 切换 */}
      <div className="bl-tools-tabs">
        <button
          className={`bl-tool-tab ${toolTab === "calc" ? "active" : ""}`}
          onClick={() => setToolTab("calc")}
        >
          <span className="bl-tab-icon">🔢</span>
          <span>养老金计算器</span>
        </button>
        <button
          className={`bl-tool-tab ${toolTab === "plan" ? "active" : ""}`}
          onClick={() => setToolTab("plan")}
        >
          <span className="bl-tab-icon">⏰</span>
          <span>退休规划</span>
        </button>
        <button
          className={`bl-tool-tab ${toolTab === "goal" ? "active" : ""}`}
          onClick={() => setToolTab("goal")}
        >
          <span className="bl-tab-icon">🎯</span>
          <span>目标设定</span>
        </button>
      </div>

      {/* 养老金计算器 */}
      {toolTab === "calc" && (
        <div className="bl-tool-content">
          <div className="bl-tool-card">
            <h3 className="bl-card-title">输入基本信息</h3>
            <Slider label="当前年龄" value={calcParams.currentAge} min={18} max={60} unit="岁" onChange={(v) => setCalcParams({ ...calcParams, currentAge: v })} />
            <Slider label="计划退休年龄" value={calcParams.retireAge} min={50} max={70} unit="岁" onChange={(v) => setCalcParams({ ...calcParams, retireAge: v })} />
            <Slider label="税后月收入" value={calcParams.monthlyIncome} min={2000} max={50000} step={500} unit="¥" onChange={(v) => setCalcParams({ ...calcParams, monthlyIncome: v })} />
            <Slider label="预计社保月养老金" value={calcParams.pension} min={0} max={10000} step={500} unit="¥" onChange={(v) => setCalcParams({ ...calcParams, pension: v })} />
            <Slider label="退休后月生活费" value={calcParams.monthlyExpense} min={2000} max={30000} step={500} unit="¥" onChange={(v) => setCalcParams({ ...calcParams, monthlyExpense: v })} />
            <Slider label="预期寿命" value={calcParams.lifeExpectancy} min={70} max={100} unit="岁" onChange={(v) => setCalcParams({ ...calcParams, lifeExpectancy: v })} />
            <Slider label="投资年化收益率" value={calcParams.returnRate} min={1} max={10} step={0.5} unit="%" onChange={(v) => setCalcParams({ ...calcParams, returnRate: v })} />
            <button className="bl-calc-btn" onClick={handleCalc}>立即计算</button>
          </div>

          {calcResult && (
            <div className="bl-tool-card bl-result-card">
              <h3 className="bl-card-title">计算结果</h3>
              <div className="bl-result-grid">
                <div className="bl-result-item">
                  <div className="bl-result-label">距离退休</div>
                  <div className="bl-result-value">{calcResult.yearsToRetire}年</div>
                </div>
                <div className="bl-result-item">
                  <div className="bl-result-label">退休生活期</div>
                  <div className="bl-result-value">{calcResult.yearsInRetire}年</div>
                </div>
                <div className="bl-result-item">
                  <div className="bl-result-label">月度缺口</div>
                  <div className="bl-result-value">¥{calcResult.monthlyGap.toLocaleString()}</div>
                </div>
                <div className="bl-result-item highlight">
                  <div className="bl-result-label">养老金总缺口</div>
                  <div className="bl-result-value">¥{calcResult.totalGap.toLocaleString()}</div>
                </div>
                <div className="bl-result-item">
                  <div className="bl-result-label">预计储蓄</div>
                  <div className="bl-result-value">¥{calcResult.finalSavings.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 退休规划 */}
      {toolTab === "plan" && (
        <div className="bl-tool-content">
          <div className="bl-tool-card">
            <h3 className="bl-card-title">基本参数</h3>
            <Slider label="当前年龄" value={planParams.currentAge} min={18} max={60} unit="岁" onChange={(v) => setPlanParams({ ...planParams, currentAge: v })} />
            <Slider label="税后月收入" value={planParams.monthlyIncome} min={2000} max={50000} step={500} unit="¥" onChange={(v) => setPlanParams({ ...planParams, monthlyIncome: v })} />
            <Slider label="现有储蓄" value={planParams.currentSavings} min={0} max={1000000} step={10000} unit="¥" onChange={(v) => setPlanParams({ ...planParams, currentSavings: v })} />
            <Slider label="目标退休年龄" value={planParams.retireAge} min={50} max={70} unit="岁" onChange={(v) => setPlanParams({ ...planParams, retireAge: v })} />
          </div>

          <div className="bl-tool-card">
            <h3 className="bl-card-title">退休场景对比</h3>
            <div className="bl-scenarios">
              {([
                { key: "early" as const, ...planScenarios.early },
                { key: "normal" as const, ...planScenarios.normal },
                { key: "late" as const, ...planScenarios.late },
              ]).map((s) => (
                <div
                  key={s.key}
                  className={`bl-scenario-card ${planScenario === s.key ? "selected" : ""}`}
                  style={{ background: planScenario === s.key ? undefined : s.color }}
                  onClick={() => setPlanScenario(s.key)}
                >
                  <div className="bl-scenario-header">
                    <span className="bl-scenario-label">{s.label}</span>
                    <span className="bl-scenario-tag">{s.tag}</span>
                  </div>
                  <div className="bl-scenario-age">{s.age}岁退休 · {s.years}年后</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bl-tool-card bl-projection-card">
            <div className="bl-projection-label">按目标退休年龄预计储蓄</div>
            <div className="bl-projection-value">¥{planEstimate.toLocaleString()}</div>
            <div className="bl-projection-note">基于月储蓄率20%、年化5%估算</div>
          </div>
        </div>
      )}

      {/* 目标设定 */}
      {toolTab === "goal" && (
        <div className="bl-tool-content">
          <div className="bl-tool-card">
            <h3 className="bl-card-title">设定养老目标</h3>
            <p className="bl-card-subtitle">设定清晰的目标，让规划更有方向感</p>
            <Slider label="目标退休年龄" value={goalParams.retireAge} min={50} max={70} unit="岁" onChange={(v) => setGoalParams({ ...goalParams, retireAge: v })} />
            <Slider label="退休后月生活费目标" value={goalParams.monthlyExpense} min={2000} max={30000} step={500} unit="¥" onChange={(v) => setGoalParams({ ...goalParams, monthlyExpense: v })} />
            <Slider label="目标养老总资产" value={goalParams.totalAssets} min={500000} max={5000000} step={100000} unit="¥" onChange={(v) => setGoalParams({ ...goalParams, totalAssets: v })} />
            <Slider label="预期寿命" value={goalParams.lifeExpectancy} min={70} max={100} unit="岁" onChange={(v) => setGoalParams({ ...goalParams, lifeExpectancy: v })} />

            <div className="bl-vision-field">
              <label>养老愿景描述（选填）</label>
              <textarea
                placeholder="例如：在南方小城养老，偶尔旅行，"
                value={goalVision}
                onChange={(e) => setGoalVision(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ============================================================
   * 渲染：我的
   * ============================================================ */
  const renderProfile = () => (
    <div className="bl-page bl-profile-page">
      {/* 用户头部 */}
      <div className="bl-profile-header">
        <div className="bl-profile-avatar">
          {profile?.nickname ? profile.nickname[0].toUpperCase() : "U"}
        </div>
        <div className="bl-profile-stats">
          <div className="bl-profile-name-row">
            <input
              className="bl-profile-name-input"
              value={editNickname || profile?.nickname || ""}
              placeholder={profile?.nickname || "用户名"}
              onChange={(e) => setEditNickname(e.target.value)}
            />
            <button className="bl-save-btn" onClick={handleSaveNickname}>保存</button>
          </div>
          <div className="bl-profile-meta">
            <span>注册于 {profile ? formatDate(profile.createdAt) : formatDate(Date.now())}</span>
            <span>·</span>
            <span>{sessions.length}次规划对话</span>
            <span>·</span>
            <span>{savedReports.length}份规划报告</span>
          </div>
        </div>
      </div>

      {/* 规划对话记录 */}
      <div className="bl-profile-section">
        <div className="bl-section-header">
          <h3>规划对话记录</h3>
          <button className="bl-link-btn" onClick={handleStartChat}>新建对话</button>
        </div>
        {sessions.length === 0 ? (
          <div className="bl-empty-mini">暂无对话记录</div>
        ) : (
          <div className="bl-session-list">
            {sessions.map((s) => (
              <div key={s.id} className="bl-session-item">
                <div className="bl-session-icon">🕐</div>
                <div className="bl-session-info">
                  <div className="bl-session-title">{s.title}</div>
                  <div className="bl-session-date">{formatDate(s.createdAt)}</div>
                </div>
                <span className={`bl-session-status ${s.status}`}>
                  {s.status === "ongoing" ? "进行中" : "已完成"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 规划报告历史 */}
      <div className="bl-profile-section">
        <div className="bl-section-header">
          <h3>规划报告历史</h3>
          <button className="bl-link-btn" onClick={() => setTab("report")}>查看报告</button>
        </div>
        {savedReports.length === 0 ? (
          <div className="bl-empty-mini">
            <div className="bl-empty-icon-sm">📄</div>
            <div>暂无规划报告</div>
            <div className="bl-empty-hint">完成AI规划对话后自动生成</div>
          </div>
        ) : (
          <div className="bl-report-list-mini">
            {savedReports.map((r) => (
              <div key={r.id} className="bl-report-item-mini" onClick={() => { setViewingReport(r); setAdoptedActions(r.adoptedActions); setTab("report"); }}>
                <div className="bl-report-date">{formatDate(r.createdAt)}</div>
                <div className="bl-report-insight">{r.data.insight}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 账号设置 */}
      <div className="bl-profile-section">
        <div className="bl-section-header">
          <h3>账号设置</h3>
        </div>
        <div className="bl-settings-list">
          <button className="bl-setting-item">
            <span>🔒 修改密码</span>
            <span className="bl-arrow">›</span>
          </button>
          <button className="bl-setting-item" onClick={() => setTab("report")}>
            <span>📋 查看所有规划报告</span>
            <span className="bl-arrow">›</span>
          </button>
          <Link to="/mickey" className="bl-setting-item danger">
            <span>🚪 退出伴龄</span>
            <span className="bl-arrow">›</span>
          </Link>
        </div>
      </div>

      <div className="bl-profile-footer">
        使用即代表同意《用户协议》和《隐私政策》
      </div>
    </div>
  );

  /* ============================================================
   * 渲染主结构
   * ============================================================ */

  /* 密码门 */
  if (!unlocked) {
    return (
      <div className="bl-lock-root">
        <div className="bl-lock-card">
          <Link to="/mickey" className="bl-back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            返回作品集
          </Link>

          <div className="bl-lock-icon">💛</div>
          <h1 className="bl-lock-title">伴龄</h1>
          <p className="bl-lock-sub">AI 养老规划伴侣</p>
          <p className="bl-lock-hint">请输入密码进入</p>

          <div className="bl-lock-input-wrap">
            <input
              type="password"
              className={`bl-lock-input ${pwdError ? "error" : ""}`}
              placeholder="请输入密码"
              value={pwdInput}
              onChange={(e) => { setPwdInput(e.target.value); setPwdError(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleUnlock(); }}
              autoFocus
            />
          </div>

          {pwdError && <p className="bl-lock-error">密码不正确，请重新输入</p>}

          <button className="bl-lock-btn" onClick={handleUnlock}>
            进入伴龄 →
          </button>
        </div>
        <BanlingStyles />
      </div>
    );
  }

  return (
    <div className="bl-root">
      <Link to="/mickey" className="bl-back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        返回作品集
      </Link>
      <div className="bl-content">
        {tab === "home" && renderHome()}
        {tab === "ai" && renderAI()}
        {tab === "report" && renderReport()}
        {tab === "tools" && renderTools()}
        {tab === "profile" && renderProfile()}
      </div>
      <BottomNav tab={tab} onChange={(t) => {
        if (t === "ai" && messages.length === 0) {
          handleStartChat();
        } else {
          setTab(t);
        }
      }} />
      <BanlingStyles />
      {toast && <div className="bl-toast">{toast}</div>}
    </div>
  );
}

/* ===== 样式 ===== */
function BanlingStyles() {
  return (
    <style>{`
      /* ===== 全局 ===== */
      .bl-root {
        --orange: #FFB84D;
        --orange-dark: #FFA726;
        --orange-light: #FFF3E0;
        --bg: #FFF9F0;
        --card: #FFFFFF;
        --text: #333333;
        --text-light: #999999;
        --border: #F0F0F0;
        --shadow: 0 2px 12px rgba(0,0,0,0.06);
        --shadow-hover: 0 4px 20px rgba(255,184,77,0.15);
        max-width: 480px;
        margin: 0 auto;
        min-height: 100vh;
        background: var(--bg);
        font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
        color: var(--text);
        position: relative;
        padding-bottom: 64px;
      }

      /* 电脑端适配：铺满全屏，内容区居中限宽 */
      @media (min-width: 768px) {
        .bl-root {
          max-width: 100%;
          min-height: 100vh;
          box-shadow: none;
        }
        .bl-content {
          max-width: 480px;
          margin: 0 auto;
        }
      }

      .bl-content {
        min-height: calc(100vh - 64px);
      }

      /* 返回作品集按钮 */
      .bl-back-link {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        position: fixed;
        top: 16px;
        left: 20px;
        z-index: 200;
        background: rgba(255,255,255,0.92);
        backdrop-filter: none;
        color: var(--text);
        font-size: 13px;
        text-decoration: none;
        padding: 6px 14px;
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        cursor: pointer;
        transition: all 0.2s;
      }

      .bl-back-link:hover {
        background: var(--orange);
        color: #fff;
      }

      .bl-back-link svg {
        width: 14px;
        height: 14px;
      }

      @media (max-width: 767px) {
        .bl-back-link {
          position: absolute;
        }
      }

      /* ===== 问候语栏 ===== */
      .bl-greeting-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;
        background: var(--card);
        border-bottom: 1px solid var(--border);
      }

      .bl-greeting-text {
        font-size: 14px;
        font-weight: 500;
        color: var(--text);
      }

      .bl-greeting-date {
        font-size: 12px;
        color: var(--text-light);
      }

      /* ===== 安心星卡片 ===== */
      .bl-star-card {
        background: var(--card);
        border-radius: 14px;
        padding: 20px;
        margin: 0 20px 20px;
        box-shadow: var(--shadow);
      }

      .bl-star-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .bl-star-title {
        font-size: 15px;
        font-weight: 600;
      }

      .bl-star-count {
        font-size: 16px;
        font-weight: 700;
        color: var(--orange-dark);
      }

      .bl-star-row {
        display: flex;
        gap: 6px;
        margin-bottom: 12px;
      }

      .bl-star {
        font-size: 24px;
        color: var(--border);
        transition: color 0.3s;
      }

      .bl-star.filled {
        color: var(--orange);
      }

      .bl-star-progress {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .bl-star-track {
        flex: 1;
        height: 8px;
        background: var(--border);
        border-radius: 4px;
        overflow: hidden;
      }

      .bl-star-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--orange), var(--orange-dark));
        border-radius: 4px;
      }

      .bl-star-label {
        font-size: 12px;
        color: var(--text-light);
        white-space: nowrap;
      }

      /* ===== 底部导航 ===== */
      .bl-bottom-nav {
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 480px;
        height: 64px;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: space-around;
        border-top: 1px solid var(--border);
        z-index: 100;
        box-shadow: 0 -2px 12px rgba(0,0,0,0.04);
      }

      /* 电脑端底部导航居中限宽 */
      @media (min-width: 768px) {
        .bl-bottom-nav {
          max-width: 480px;
        }
      }

      .bl-nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-light);
        font-size: 10px;
        transition: color 0.2s;
        padding: 4px 8px;
      }

      .bl-nav-item.active {
        color: var(--orange-dark);
      }

      .bl-nav-icon {
        width: 22px;
        height: 22px;
      }

      /* ===== 首页 ===== */
      .bl-home {
        padding: 0 20px;
      }

      .bl-hero {
        text-align: center;
        padding: 48px 0 32px;
      }

      .bl-hero-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 24px;
      }

      .bl-logo-icon {
        width: 40px;
        height: 40px;
        background: var(--orange);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }

      .bl-hero-logo span {
        font-size: 18px;
        font-weight: 700;
      }

      .bl-hero-title {
        font-size: 32px;
        font-weight: 800;
        line-height: 1.3;
        margin: 0 0 12px;
        color: var(--text);
      }

      .bl-hero-accent {
        background: linear-gradient(135deg, var(--orange), var(--orange-dark));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .bl-hero-sub {
        font-size: 15px;
        color: var(--orange-dark);
        font-weight: 500;
        margin: 0 0 16px;
      }

      .bl-hero-desc {
        font-size: 14px;
        color: var(--text-light);
        line-height: 1.6;
        margin: 0 0 32px;
      }

      .bl-pension-input {
        background: var(--card);
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: var(--shadow);
        text-align: left;
      }

      .bl-pension-input label {
        display: block;
        font-size: 13px;
        color: var(--text-light);
        margin-bottom: 8px;
      }

      .bl-pension-field {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .bl-currency {
        font-size: 24px;
        font-weight: 700;
        color: var(--orange-dark);
      }

      .bl-pension-field input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 28px;
        font-weight: 700;
        color: var(--text);
        background: transparent;
      }

      .bl-cta-main {
        width: 100%;
        background: linear-gradient(135deg, var(--orange), var(--orange-dark));
        color: #fff;
        border: none;
        border-radius: 12px;
        padding: 14px 0;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(255,167,38,0.3);
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .bl-cta-main:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255,167,38,0.4);
      }

      .bl-cta-main:active {
        transform: translateY(0);
      }

      .bl-trust-tags {
        display: flex;
        justify-content: center;
        gap: 16px;
        margin-top: 16px;
      }

      .bl-trust-tags span {
        font-size: 12px;
        color: var(--text-light);
      }

      /* ===== 通用 Section ===== */
      .bl-section {
        padding: 32px 0;
        border-top: 1px solid var(--border);
      }

      .bl-section-title {
        font-size: 20px;
        font-weight: 700;
        text-align: center;
        margin: 0 0 8px;
      }

      .bl-section-intro {
        font-size: 13px;
        color: var(--text-light);
        text-align: center;
        margin: 0 0 24px;
      }

      /* 目标人群 */
      .bl-persona-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .bl-persona-card {
        background: var(--card);
        border-radius: 12px;
        padding: 20px;
        box-shadow: var(--shadow);
        text-align: center;
        border-top: 3px solid transparent;
      }

      .bl-persona-card.bl-persona-green {
        border-top-color: #66BB6A;
      }

      .bl-persona-card.bl-persona-orange {
        border-top-color: #FF9F43;
      }

      .bl-persona-card.bl-persona-pink {
        border-top-color: #EC407A;
      }

      .bl-persona-icon {
        font-size: 32px;
        margin-bottom: 8px;
      }

      .bl-persona-card h3 {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 4px;
      }

      .bl-persona-age {
        font-size: 13px;
        color: var(--orange-dark);
        font-weight: 500;
        margin: 0 0 4px;
      }

      .bl-persona-card p:last-child {
        font-size: 13px;
        color: var(--text-light);
        margin: 0;
      }

      /* 价值主张 */
      .bl-value-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .bl-value-card {
        background: var(--card);
        border-radius: 12px;
        padding: 20px 16px;
        text-align: center;
        box-shadow: var(--shadow);
      }

      .bl-value-icon {
        font-size: 28px;
        margin-bottom: 8px;
      }

      .bl-value-card h3 {
        font-size: 14px;
        font-weight: 600;
        margin: 0 0 4px;
      }

      .bl-value-card p {
        font-size: 12px;
        color: var(--text-light);
        margin: 0;
      }

      /* 4步流程 */
      .bl-steps {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .bl-step-card {
        border-radius: 12px;
        padding: 20px 16px;
        box-shadow: var(--shadow);
        color: #fff;
      }

      .bl-step-num {
        font-size: 24px;
        font-weight: 800;
        color: #fff;
        opacity: 0.9;
        margin-bottom: 8px;
      }

      .bl-step-card h3 {
        font-size: 15px;
        font-weight: 600;
        margin: 0 0 4px;
        color: #fff;
      }

      .bl-step-card p {
        font-size: 12px;
        color: rgba(255,255,255,0.85);
        margin: 0;
      }

      /* 底部CTA */
      .bl-final-cta {
        text-align: center;
        padding: 40px 0;
      }

      .bl-final-cta h2 {
        font-size: 18px;
        font-weight: 700;
        margin: 0 0 8px;
      }

      .bl-final-cta p {
        font-size: 13px;
        color: var(--text-light);
        margin: 0 0 20px;
      }

      /* Footer */
      .bl-footer {
        text-align: center;
        padding: 20px 0 40px;
        border-top: 1px solid var(--border);
      }

      .bl-footer p {
        font-size: 11px;
        color: var(--text-light);
        margin: 0;
      }

      /* ===== AI 对话页 ===== */
      .bl-ai-page {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 64px);
        padding-top: 0;
      }

      .bl-ai-topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 20px;
        background: #fff;
        border-bottom: 1px solid var(--border);
      }

      .bl-ai-topbar-logo {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .bl-logo-icon-sm {
        width: 28px;
        height: 28px;
        background: var(--orange);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }

      .bl-ai-topbar-logo span {
        font-size: 16px;
        font-weight: 700;
      }

      .bl-ai-status {
        font-size: 12px;
        color: var(--text-light);
      }

      .bl-ai-body {
        flex: 1;
        overflow-y: auto;
        padding: 16px 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .bl-msg {
        display: flex;
        gap: 8px;
        max-width: 85%;
      }

      .bl-msg.user {
        align-self: flex-end;
        flex-direction: row-reverse;
      }

      .bl-msg-avatar {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .bl-ai-tag {
        background: var(--orange);
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
      }

      .bl-msg-bubble {
        background: #fff;
        padding: 12px 16px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.6;
        box-shadow: var(--shadow);
      }

      .bl-msg.user .bl-msg-bubble {
        background: var(--orange);
        color: #fff;
      }

      .bl-msg-bubble p {
        margin: 0;
      }

      .bl-typing span {
        display: inline-block;
        width: 6px;
        height: 6px;
        background: var(--text-light);
        border-radius: 50%;
        margin: 0 2px;
        animation: bl-bounce 1.4s infinite;
      }

      .bl-typing span:nth-child(2) { animation-delay: 0.2s; }
      .bl-typing span:nth-child(3) { animation-delay: 0.4s; }

      @keyframes bl-bounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-6px); }
      }

      .bl-quick-replies {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 0 20px 8px;
      }

      .bl-quick-btn {
        background: var(--orange-light);
        color: var(--orange-dark);
        border: 1px solid var(--orange);
        border-radius: 20px;
        padding: 6px 14px;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .bl-quick-btn:hover {
        background: var(--orange);
        color: #fff;
      }

      .bl-report-trigger {
        padding: 0 20px 8px;
      }

      .bl-report-trigger-btn {
        width: 100%;
        background: linear-gradient(135deg, var(--orange), var(--orange-dark));
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 10px 0;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
      }

      .bl-input-bar {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        padding: 12px 20px;
        background: #fff;
        border-top: 1px solid var(--border);
      }

      .bl-input {
        flex: 1;
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 10px 16px;
        font-size: 14px;
        outline: none;
        resize: none;
        max-height: 100px;
        font-family: inherit;
      }

      .bl-input:focus {
        border-color: var(--orange);
      }

      .bl-send-btn {
        width: 40px;
        height: 40px;
        background: var(--orange);
        color: #fff;
        border: none;
        border-radius: 50%;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }

      .bl-send-btn:disabled {
        background: var(--border);
        cursor: not-allowed;
      }

      /* ===== 报告页 ===== */
      .bl-report-page {
        padding: 20px;
      }

      .bl-report-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        gap: 16px;
        color: var(--text-light);
      }

      .bl-loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--border);
        border-top-color: var(--orange);
        border-radius: 50%;
        animation: bl-spin 0.8s linear infinite;
      }

      @keyframes bl-spin {
        to { transform: rotate(360deg); }
      }

      .bl-report-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 50vh;
        text-align: center;
        gap: 12px;
      }

      .bl-empty-icon {
        font-size: 48px;
        opacity: 0.5;
      }

      .bl-report-empty h2 {
        font-size: 20px;
        font-weight: 700;
        margin: 0;
      }

      .bl-report-empty p {
        font-size: 14px;
        color: var(--text-light);
        margin: 0 0 16px;
      }

      .bl-report-empty .bl-cta-main {
        max-width: 240px;
      }

      .bl-report-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
      }

      .bl-back-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--text);
      }

      .bl-report-header h2 {
        font-size: 18px;
        font-weight: 700;
        margin: 0;
      }

      .bl-report-meta {
        font-size: 12px;
        color: var(--text-light);
        margin-bottom: 16px;
      }

      .bl-report-card {
        background: var(--card);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 12px;
        box-shadow: var(--shadow);
      }

      .bl-report-card h3 {
        font-size: 15px;
        font-weight: 600;
        margin: 0 0 12px;
      }

      .bl-insight-card {
        background: linear-gradient(135deg, var(--orange-light), #fff);
      }

      .bl-insight-card p {
        font-size: 15px;
        line-height: 1.6;
        margin: 0;
      }

      .bl-metrics-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .bl-metric-item {
        text-align: center;
      }

      .bl-metric-label {
        font-size: 12px;
        color: var(--text-light);
        margin-bottom: 4px;
      }

      .bl-metric-value {
        font-size: 20px;
        font-weight: 700;
        color: var(--orange-dark);
      }

      .bl-metric-hint {
        font-size: 11px;
        color: var(--text-light);
      }

      .bl-actions-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .bl-action-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        font-size: 14px;
        line-height: 1.5;
      }

      .bl-action-check {
        flex-shrink: 0;
        width: 22px;
        height: 22px;
        border: 2px solid var(--orange);
        border-radius: 50%;
        background: none;
        cursor: pointer;
        font-size: 12px;
        color: transparent;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .bl-action-item.adopted .bl-action-check {
        background: var(--orange);
        color: #fff;
      }

      .bl-summary-card {
        background: var(--orange-light);
      }

      .bl-summary-card p {
        font-size: 14px;
        line-height: 1.6;
        margin: 0;
        color: var(--text);
      }

      .bl-report-actions {
        display: flex;
        gap: 12px;
        margin-top: 8px;
      }

      .bl-btn-outline {
        flex: 1;
        background: #fff;
        border: 1px solid var(--orange);
        color: var(--orange-dark);
        border-radius: 10px;
        padding: 10px 0;
        font-size: 14px;
        cursor: pointer;
      }

      .bl-report-history {
        margin-top: 32px;
      }

      .bl-history-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 12px;
      }

      .bl-history-item {
        display: flex;
        align-items: center;
        background: var(--card);
        border-radius: 10px;
        padding: 14px 16px;
        margin-bottom: 8px;
        box-shadow: var(--shadow);
      }

      .bl-history-info {
        flex: 1;
        cursor: pointer;
      }

      .bl-history-date {
        font-size: 12px;
        color: var(--text-light);
        margin-bottom: 4px;
      }

      .bl-history-insight {
        font-size: 14px;
        line-height: 1.4;
      }

      .bl-history-delete {
        background: none;
        border: none;
        font-size: 20px;
        color: var(--text-light);
        cursor: pointer;
        padding: 0 4px;
      }

      /* ===== 工具箱页 ===== */
      .bl-tools-page {
        padding: 20px;
      }

      .bl-tools-header {
        text-align: center;
        margin-bottom: 24px;
      }

      .bl-tools-title {
        font-size: 24px;
        font-weight: 800;
        margin: 0 0 8px;
        background: linear-gradient(135deg, var(--orange), var(--orange-dark));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .bl-tools-sub {
        font-size: 13px;
        color: var(--text-light);
        margin: 0;
      }

      .bl-tools-tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 20px;
      }

      .bl-tool-tab {
        flex: 1;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 10px 8px;
        font-size: 12px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        color: var(--text-light);
        transition: all 0.2s;
      }

      .bl-tool-tab.active {
        background: var(--text);
        color: #fff;
        border-color: var(--text);
      }

      .bl-tab-icon {
        font-size: 18px;
      }

      .bl-tool-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .bl-tool-card {
        background: var(--card);
        border-radius: 14px;
        padding: 20px;
        box-shadow: var(--shadow);
      }

      .bl-card-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 16px;
      }

      .bl-card-subtitle {
        font-size: 13px;
        color: var(--text-light);
        margin: 0 0 16px;
      }

      /* 滑块 */
      .bl-slider-row {
        margin-bottom: 20px;
      }

      .bl-slider-row:last-child {
        margin-bottom: 0;
      }

      .bl-slider-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .bl-slider-label span:first-child {
        font-size: 14px;
        color: var(--text);
      }

      .bl-slider-value {
        font-size: 16px;
        font-weight: 700;
        color: var(--orange-dark);
      }

      .bl-slider-track-wrap {
        position: relative;
        height: 6px;
        margin-bottom: 4px;
      }

      .bl-slider-bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 6px;
        background: var(--border);
        border-radius: 3px;
      }

      .bl-slider-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 6px;
        background: linear-gradient(90deg, var(--orange), var(--orange-dark));
        border-radius: 3px;
      }

      .bl-slider-input {
        position: absolute;
        top: -8px;
        left: 0;
        right: 0;
        width: 100%;
        height: 22px;
        opacity: 0;
        cursor: pointer;
        -webkit-appearance: none;
      }

      .bl-slider-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #fff;
        border: 3px solid var(--orange);
        cursor: pointer;
        opacity: 1;
      }

      .bl-slider-range {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: var(--text-light);
      }

      .bl-calc-btn {
        width: 100%;
        background: linear-gradient(135deg, var(--orange), var(--orange-dark));
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 12px 0;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 8px;
        box-shadow: 0 4px 12px rgba(255,167,38,0.3);
      }

      .bl-result-card {
        background: linear-gradient(135deg, var(--orange-light), #fff);
      }

      .bl-result-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .bl-result-item {
        text-align: center;
      }

      .bl-result-item.highlight {
        grid-column: span 2;
      }

      .bl-result-label {
        font-size: 12px;
        color: var(--text-light);
        margin-bottom: 4px;
      }

      .bl-result-value {
        font-size: 20px;
        font-weight: 700;
        color: var(--orange-dark);
      }

      .bl-result-item.highlight .bl-result-value {
        font-size: 28px;
      }

      /* 场景对比 */
      .bl-scenarios {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .bl-scenario-card {
        border-radius: 10px;
        padding: 14px 16px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.2s;
      }

      .bl-scenario-card.selected {
        background: var(--orange-light) !important;
        border-color: var(--orange);
      }

      .bl-scenario-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
      }

      .bl-scenario-label {
        font-size: 14px;
        font-weight: 600;
      }

      .bl-scenario-tag {
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 4px;
        background: rgba(255,255,255,0.6);
      }

      .bl-scenario-card.selected .bl-scenario-tag {
        background: var(--orange);
        color: #fff;
      }

      .bl-scenario-age {
        font-size: 13px;
        color: var(--text-light);
      }

      .bl-projection-card {
        text-align: center;
        background: linear-gradient(135deg, var(--orange), var(--orange-dark));
        color: #fff;
      }

      .bl-projection-label {
        font-size: 13px;
        opacity: 0.9;
        margin-bottom: 8px;
      }

      .bl-projection-value {
        font-size: 36px;
        font-weight: 800;
        margin-bottom: 8px;
      }

      .bl-projection-note {
        font-size: 11px;
        opacity: 0.7;
      }

      /* 目标设定 */
      .bl-vision-field {
        margin-top: 20px;
      }

      .bl-vision-field label {
        display: block;
        font-size: 14px;
        margin-bottom: 8px;
      }

      .bl-vision-field textarea {
        width: 100%;
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 12px;
        font-size: 14px;
        outline: none;
        resize: none;
        font-family: inherit;
      }

      .bl-vision-field textarea:focus {
        border-color: var(--orange);
      }

      /* ===== 我的页 ===== */
      .bl-profile-page {
        padding: 20px;
      }

      .bl-profile-header {
        display: flex;
        gap: 16px;
        align-items: center;
        padding: 20px 0;
        border-bottom: 1px solid var(--border);
        margin-bottom: 20px;
      }

      .bl-profile-avatar {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: var(--orange);
        color: #fff;
        font-size: 24px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .bl-profile-stats {
        flex: 1;
      }

      .bl-profile-name-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
      }

      .bl-profile-name-input {
        border: none;
        border-bottom: 1px solid var(--border);
        background: transparent;
        font-size: 18px;
        font-weight: 600;
        outline: none;
        padding: 2px 0;
        max-width: 120px;
      }

      .bl-profile-name-input:focus {
        border-bottom-color: var(--orange);
      }

      .bl-save-btn {
        background: var(--orange);
        color: #fff;
        border: none;
        border-radius: 6px;
        padding: 4px 12px;
        font-size: 12px;
        cursor: pointer;
      }

      .bl-profile-meta {
        font-size: 12px;
        color: var(--text-light);
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
      }

      .bl-profile-section {
        margin-bottom: 24px;
      }

      .bl-section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .bl-section-header h3 {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
      }

      .bl-link-btn {
        background: none;
        border: none;
        color: var(--orange-dark);
        font-size: 13px;
        cursor: pointer;
      }

      .bl-empty-mini {
        text-align: center;
        padding: 24px;
        color: var(--text-light);
        font-size: 14px;
      }

      .bl-empty-icon-sm {
        font-size: 32px;
        margin-bottom: 8px;
        opacity: 0.4;
      }

      .bl-empty-hint {
        font-size: 12px;
        margin-top: 4px;
      }

      .bl-session-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .bl-session-item {
        display: flex;
        align-items: center;
        gap: 12px;
        background: var(--card);
        border-radius: 10px;
        padding: 12px 16px;
        box-shadow: var(--shadow);
      }

      .bl-session-icon {
        font-size: 18px;
      }

      .bl-session-info {
        flex: 1;
      }

      .bl-session-title {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 2px;
      }

      .bl-session-date {
        font-size: 12px;
        color: var(--text-light);
      }

      .bl-session-status {
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 4px;
      }

      .bl-session-status.ongoing {
        background: var(--orange-light);
        color: var(--orange-dark);
      }

      .bl-session-status.completed {
        background: #E8F5E9;
        color: #4CAF50;
      }

      .bl-report-list-mini {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .bl-report-item-mini {
        background: var(--card);
        border-radius: 10px;
        padding: 12px 16px;
        box-shadow: var(--shadow);
        cursor: pointer;
      }

      .bl-report-date {
        font-size: 12px;
        color: var(--text-light);
        margin-bottom: 4px;
      }

      .bl-report-insight {
        font-size: 14px;
        line-height: 1.4;
      }

      .bl-settings-list {
        display: flex;
        flex-direction: column;
        gap: 1px;
        background: var(--card);
        border-radius: 10px;
        overflow: hidden;
        box-shadow: var(--shadow);
      }

      .bl-setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 16px;
        background: var(--card);
        border: none;
        cursor: pointer;
        font-size: 14px;
        color: var(--text);
        text-decoration: none;
        transition: background 0.2s;
      }

      .bl-setting-item:hover {
        background: var(--bg);
      }

      .bl-setting-item.danger {
        color: #E57373;
      }

      .bl-arrow {
        color: var(--text-light);
        font-size: 18px;
      }

      .bl-profile-footer {
        text-align: center;
        font-size: 11px;
        color: var(--text-light);
        padding: 20px 0;
        line-height: 1.6;
      }

      /* ===== Toast ===== */
      .bl-toast {
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: #fff;
        padding: 8px 20px;
        border-radius: 20px;
        font-size: 13px;
        z-index: 200;
        animation: bl-fade-in 0.3s;
      }

      @keyframes bl-fade-in {
        from { opacity: 0; transform: translate(-50%, 10px); }
        to { opacity: 1; transform: translate(-50%, 0); }
      }

      /* ===== 密码门 ===== */
      .bl-lock-root {
        min-height: 100vh;
        background: linear-gradient(135deg, #FFF9F0 0%, #FFF3E0 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        position: relative;
        font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
      }

      .bl-lock-card {
        background: #fff;
        border-radius: 20px;
        padding: 48px 40px;
        max-width: 380px;
        width: 100%;
        text-align: center;
        box-shadow: 0 8px 40px rgba(255,184,77,0.15);
        position: relative;
      }

      .bl-lock-card .bl-back-link {
        position: absolute;
        top: 16px;
        left: 16px;
      }

      .bl-lock-icon {
        font-size: 56px;
        margin-bottom: 16px;
      }

      .bl-lock-title {
        font-size: 28px;
        font-weight: 800;
        color: #333;
        margin: 0 0 4px;
      }

      .bl-lock-sub {
        font-size: 14px;
        color: #999;
        margin: 0 0 32px;
      }

      .bl-lock-hint {
        font-size: 13px;
        color: #666;
        margin: 0 0 16px;
      }

      .bl-lock-input-wrap {
        margin-bottom: 16px;
      }

      .bl-lock-input {
        width: 100%;
        border: 2px solid #F0F0F0;
        border-radius: 12px;
        padding: 14px 16px;
        font-size: 16px;
        text-align: center;
        outline: none;
        transition: border-color 0.2s;
        box-sizing: border-box;
      }

      .bl-lock-input:focus {
        border-color: #FFB84D;
      }

      .bl-lock-input.error {
        border-color: #E57373;
        animation: bl-shake 0.4s;
      }

      @keyframes bl-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
      }

      .bl-lock-error {
        color: #E57373;
        font-size: 12px;
        margin: 0 0 12px;
      }

      .bl-lock-btn {
        width: 100%;
        background: linear-gradient(135deg, #FFB84D, #FFA726);
        color: #fff;
        border: none;
        border-radius: 12px;
        padding: 14px 0;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(255,167,38,0.3);
        transition: transform 0.2s;
      }

      .bl-lock-btn:hover {
        transform: translateY(-2px);
      }
    `}</style>
  );
}
