import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * HealingCompanion — 疗愈室悬浮球
 *
 * 右下角悬浮球，点击展开面板，包含两个 Tab：
 * 1. 「小愈」— AI 疗愈师聊天（情绪识别 + 共情话术库）
 * 2. 「统计」— 本周 / 本月 / 本年疗愈数据统计
 *
 * 零外部 AI 依赖，全部本地模板匹配。
 */

/* ═══════════════════════════════════
   话术库
   ═══════════════════════════════════ */

type EmotionKey = "anxiety" | "exhausted" | "low" | "neutral" | "calm";

interface EmotionRule {
  key: EmotionKey;
  label: string;
  keywords: string[];
  responses: string[];
  followUps: string[];
  toolSuggestion: string;
}

const EMOTIONS: EmotionRule[] = [
  {
    key: "anxiety",
    label: "焦虑",
    keywords: ["焦虑", "紧张", "担心", "害怕", "恐慌", "不安", "心慌", "烦躁", "压力", "崩溃", "受不了", "快疯了", "着急", "慌"],
    responses: [
      "我听到你了。焦虑的感觉很难受，但请相信，它就像海浪，会来的，也会退去的。",
      "你现在一定很辛苦吧。试着把手放在胸口，感受心跳——它比你想象中更稳定。",
      "焦虑的时候，身体会以为我们遇到了危险。但实际上，你此刻是安全的。我会陪着你。",
    ],
    followUps: ["能告诉我，是什么让你感到不安吗？", "这种感觉持续多久了？", "有没有什么能让你暂时放松下来的事？"],
    toolSuggestion: "要不要试试呼吸引导？4-7-8 呼吸法对缓解焦虑特别有效。",
  },
  {
    key: "exhausted",
    label: "疲惫",
    keywords: ["累", "疲惫", "困", "没力气", "撑不住", "透支", "耗尽", "精疲力尽", "倦", "无力", "好累", "太累了", "加班", "熬夜", "没睡"],
    responses: [
      "你一定撑了很久吧。能走到今天，已经很了不起了。",
      "身体在提醒你需要休息了。这不是偷懒，是自我保护。",
      "疲惫的时候，允许自己什么都不做。你不需要时刻保持完美。",
    ],
    followUps: ["今天最让你消耗精力的事情是什么？", "有没有哪怕一分钟，是完全属于自己的？", "今晚能早些休息吗？"],
    toolSuggestion: "冥想空间里有 1 分钟的短冥想，适合睡前放松一下。",
  },
  {
    key: "low",
    label: "低落",
    keywords: ["难过", "伤心", "哭", "失落", "失望", "痛", "孤独", "寂寞", "无助", "绝望", "抑郁", "不开心", "不想", "没意思", "无聊", "没劲"],
    responses: [
      "我能感受到你心里下着雨。没关系的，我在这里，陪你等雨停。",
      "低落的时候，不需要强迫自己开心。允许自己难过，本身就是一种力量。",
      "你愿意把这些写下来告诉我，已经很勇敢了。你不需要独自承受。",
    ],
    followUps: ["有什么特别让你难过的事吗？还是说不清的无力感？", "你有多久没有好好照顾自己了？", "如果此刻能给过去的自己一个拥抱，你会说什么？"],
    toolSuggestion: "写下来也是一种疗愈。试试感恩日记，把心里的东西倒出来。",
  },
  {
    key: "neutral",
    label: "平淡",
    keywords: ["还好", "一般", "凑合", "就这样", "没什么", "不知道", "麻木", "没感觉"],
    responses: [
      "平淡也是一种状态，不需要每天都轰轰烈烈。你在用自己的节奏生活。",
      "今天虽然没什么特别的事，但你来了这里——说明你心里还有想要照顾自己的意愿。",
      "有些日子就是用来'没什么'的。这不代表生活没有意义。",
    ],
    followUps: ["今天有没有什么哪怕很小的、让你觉得还不错的事？", "如果可以选一种颜色形容今天，你会选什么？", "想试试呼吸或冥想吗？也许能让今天多一点点不一样。"],
    toolSuggestion: "试试呼吸引导中的'能量补充'模式，也许能帮你找回一点活力。",
  },
  {
    key: "calm",
    label: "平静",
    keywords: ["平静", "安静", "放松", "开心", "幸福", "感恩", "满足", "舒服", "好", "不错", "挺好的", "喜欢", "爱", "温暖", "美好", "期待", "希望"],
    responses: [
      "能感受到你此刻的平静，真好。这份安宁是你自己创造的，值得被珍惜。",
      "你现在的状态很棒。记住这种感觉，它会在你不那么好的日子里，成为你的力量。",
      "好开心看到你这么放松。你值得拥有这样的时刻。",
    ],
    followUps: ["是什么让你感到这么平静的呢？", "有没有想把它记录下来，以后翻看时提醒自己？", "你的平静能感染周围的人，包括我。"],
    toolSuggestion: "平静的时候特别适合写感恩日记，把这份美好存下来。",
  },
];

const GREETINGS = [
  "你好呀，我是小愈。今天想聊些什么呢？",
  "欢迎来到疗愈室。不管今天过得怎么样，我都陪着你。",
  "你来了。先深呼吸一下，然后慢慢说。",
  "今天的你，辛苦了。在这里可以放下所有防备。",
];

const IDLE_BUBBLES = [
  "在发呆也很好哦，不需要时刻保持忙碌。",
  "想说话就说话，不想说也没关系，我就在这里。",
  "今天过得怎么样？",
  "如果累了就休息一下吧，不用勉强自己。",
  "有什么想倾诉的吗？我一直在。",
];

function detectEmotion(text: string): EmotionRule | null {
  const lower = text.toLowerCase();
  for (const emo of EMOTIONS) {
    if (emo.keywords.some((kw) => lower.includes(kw))) return emo;
  }
  return null;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ═══════════════════════════════════
   统计数据
   ═══════════════════════════════════ */

interface ModuleStat {
  week: number;
  month: number;
  year: number;
  total: number;
}

interface Stats {
  diary: ModuleStat;
  breathing: ModuleStat;
  meditation: ModuleStat;
  moodDistribution: { label: string; color: string; count: number }[];
  recentDays: { date: string; hasDiary: boolean; hasBreathing: boolean; hasMeditation: boolean }[];
}

function loadStats(): Stats {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // 本周起始（周一）
  const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek + 1);
  weekStart.setHours(0, 0, 0, 0);
  const weekStartStr = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;

  // 本月起始
  const monthStartStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  // 本年起始
  const yearStartStr = `${now.getFullYear()}-01-01`;

  /* ── 日记 ── */
  let entries: { date: string; color: string; content: string }[] = [];
  try {
    entries = JSON.parse(localStorage.getItem("gratitude_entries") || "[]");
  } catch { /* */ }

  const diaryWeek = entries.filter((e) => e.date >= weekStartStr && e.date <= todayStr).length;
  const diaryMonth = entries.filter((e) => e.date >= monthStartStr && e.date <= todayStr).length;
  const diaryYear = entries.filter((e) => e.date >= yearStartStr && e.date <= todayStr).length;

  /* ── 呼吸引导 ── */
  let breathingRecords: { date: string; mode: string; cycles: number }[] = [];
  try {
    breathingRecords = JSON.parse(localStorage.getItem("breathing_records") || "[]");
  } catch { /* */ }

  const breathingWeek = breathingRecords.filter((r) => r.date >= weekStartStr && r.date <= todayStr).length;
  const breathingMonth = breathingRecords.filter((r) => r.date >= monthStartStr && r.date <= todayStr).length;
  const breathingYear = breathingRecords.filter((r) => r.date >= yearStartStr && r.date <= todayStr).length;

  /* ── 冥想 ── */
  let totalMeditationSec = 0;
  try {
    totalMeditationSec = parseInt(localStorage.getItem("meditation_total") || "0", 10);
  } catch { /* */ }

  // 心情分布（本月）
  const MOOD_MAP: Record<string, { label: string; color: string }> = {
    joy: { label: "喜悦", color: "#F4A6B8" },
    calm: { label: "平静", color: "#A5C4A0" },
    cool: { label: "清冷", color: "#7EB8D4" },
    tender: { label: "温柔", color: "#F5CEAA" },
    soulful: { label: "深情", color: "#C4A0D4" },
    mellow: { label: "慵懒", color: "#D4C47E" },
  };
  const moodFreq: Record<string, number> = {};
  for (const e of entries.filter((e) => e.date >= monthStartStr && e.date <= todayStr)) {
    if (e.color) moodFreq[e.color] = (moodFreq[e.color] || 0) + 1;
  }
  const moodDistribution = Object.entries(moodFreq)
    .map(([key, count]) => ({
      label: MOOD_MAP[key]?.label || key,
      color: MOOD_MAP[key]?.color || "#ccc",
      count,
    }))
    .sort((a, b) => b.count - a.count);

  // 最近 7 天活动热力图
  const recentDays: { date: string; hasDiary: boolean; hasBreathing: boolean; hasMeditation: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    recentDays.push({
      date: ds,
      hasDiary: entries.some((e) => e.date === ds),
      hasBreathing: breathingRecords.some((r) => r.date === ds),
      hasMeditation: false, // 冥想暂无法按天判断
    });
  }

  return {
    diary: { week: diaryWeek, month: diaryMonth, year: diaryYear, total: entries.length },
    breathing: { week: breathingWeek, month: breathingMonth, year: breathingYear, total: breathingRecords.length },
    meditation: { week: 0, month: 0, year: totalMeditationSec, total: totalMeditationSec },
    moodDistribution,
    recentDays,
  };
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return s > 0 ? `${m}m${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm > 0 ? `${h}h${rm}m` : `${h}h`;
}

function getWeekdayShort(dateStr: string): string {
  const days = ["日", "一", "二", "三", "四", "五", "六"];
  const d = new Date(dateStr);
  return days[d.getDay()];
}

/* ═══════════════════════════════════
   组件
   ═══════════════════════════════════ */

interface Message {
  id: string;
  role: "user" | "companion";
  text: string;
  timestamp: number;
}

type Tab = "chat" | "stats";

const HealingCompanion: React.FC = () => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("chat");
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [hovered, setHovered] = useState(false);

  // 聊天
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [expression, setExpression] = useState<"smile" | "concern" | "think">("smile");
  const [turnCount, setTurnCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastInteractionRef = useRef(Date.now());

  // 统计
  const [stats, setStats] = useState<Stats | null>(null);

  // 滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 页面加载 3s 主动问候
  useEffect(() => {
    const t = setTimeout(() => {
      setBubbleText(pickRandom(GREETINGS));
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 4500);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  // 主动关怀（15s 检查）
  useEffect(() => {
    if (panelOpen) return;
    idleTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - lastInteractionRef.current;
      if (elapsed > 15000 && !showBubble && !panelOpen) {
        if (Math.random() > 0.6) {
          setBubbleText(pickRandom(IDLE_BUBBLES));
          setShowBubble(true);
          lastInteractionRef.current = Date.now();
          setTimeout(() => setShowBubble(false), 5000);
        }
        lastInteractionRef.current = Date.now();
      }
    }, 15000);
    return () => {
      if (idleTimerRef.current) clearInterval(idleTimerRef.current);
    };
  }, [panelOpen, showBubble]);

  // 打开面板时加载统计
  useEffect(() => {
    if (panelOpen && !stats) {
      setStats(loadStats());
    }
  }, [panelOpen, stats]);

  const addCompanionMessage = useCallback((text: string, delay = 800) => {
    setIsTyping(true);
    setExpression("think");
    const typingDuration = Math.min(text.length * 80 + 400, 2000);
    setTimeout(() => {
      setIsTyping(false);
      setExpression("smile");
      setIsSpeaking(true);
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}`, role: "companion", text, timestamp: Date.now() },
      ]);
      setTimeout(() => setIsSpeaking(false), 1500);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, delay + typingDuration);
  }, []);

  const handleSend = useCallback(
    (text?: string) => {
      const msg = (text || inputValue).trim();
      if (!msg) return;
      setInputValue("");
      lastInteractionRef.current = Date.now();
      setTurnCount((t) => t + 1);

      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}`, role: "user", text: msg, timestamp: Date.now() },
      ]);

      const emotion = detectEmotion(msg);

      setTimeout(() => {
        if (emotion) {
          setExpression("concern");
          addCompanionMessage(pickRandom(emotion.responses));

          if (turnCount >= 1) {
            setTimeout(() => addCompanionMessage(emotion.toolSuggestion, 600), 2500);
          }
          if (Math.random() > 0.4) {
            setTimeout(() => {
              setExpression("think");
              addCompanionMessage(pickRandom(emotion.followUps), 800);
            }, turnCount >= 1 ? 5000 : 3500);
          }
        } else {
          const generic = [
            "嗯，我在听。能再多说一些吗？",
            "谢谢你愿意告诉我这些。你今天过得怎么样？",
            "我感受到了你的心声。如果累了，可以试试呼吸引导或冥想。",
            "每个人都需要一个倾听者。我在这里，不急，慢慢说。",
          ];
          addCompanionMessage(pickRandom(generic));
        }
      }, 300);
    },
    [inputValue, turnCount, addCompanionMessage]
  );

  const handleQuickEmotion = useCallback(
    (emo: EmotionRule) => {
      handleSend(emo.label);
    },
    [handleSend]
  );

  const handleBallClick = useCallback(() => {
    setPanelOpen((v) => {
      if (!v && messages.length === 0) {
        setTimeout(() => addCompanionMessage(pickRandom(GREETINGS), 300), 200);
      }
      if (!v) setStats(loadStats()); // 每次打开都刷新统计
      return !v;
    });
    setShowBubble(false);
    lastInteractionRef.current = Date.now();
  }, [messages.length, addCompanionMessage]);

  const totalDiary = stats?.diary.total ?? 0;

  return (
    <>
      {/* 悬浮球 */}
      <div
        className={`hc-ball-wrap ${hovered ? "hc-ball-hover" : ""}`}
        onMouseEnter={() => { setHovered(true); lastInteractionRef.current = Date.now(); }}
        onMouseLeave={() => setHovered(false)}
        onClick={handleBallClick}
      >
        {/* 对话气泡 */}
        <AnimatePresence>
          {showBubble && !panelOpen && (
            <motion.div
              className="hc-bubble"
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.35 }}
            >
              {bubbleText}
              <div className="hc-bubble-arrow" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 球体 */}
        <div className="hc-ball">
          <div className="hc-ball-glow" />
          <svg viewBox="0 0 40 40" className="hc-ball-icon" aria-hidden="true">
            <path
              d="M20 6 C14 6 8 12 8 20 C8 28 14 34 20 34 C26 34 32 28 32 20 C32 14 26 8 20 10 C16 11 14 16 16 20 C17 22 19 23 20 21"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M14 18 L12 22 M26 18 L28 22 M10 26 L8 30 M30 26 L32 30"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.4"
            />
          </svg>
          {/* 说话时脉动 */}
          {isSpeaking && <div className="hc-ball-speak-ring" />}
        </div>
        <span className="hc-ball-label">小愈</span>
      </div>

      {/* 面板 */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            className="hc-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Tab 切换 */}
            <div className="hc-tabs">
              <button
                className={`hc-tab ${tab === "chat" ? "hc-tab-active" : ""}`}
                onClick={() => setTab("chat")}
              >
                小愈
              </button>
              <button
                className={`hc-tab ${tab === "stats" ? "hc-tab-active" : ""}`}
                onClick={() => { setTab("stats"); setStats(loadStats()); }}
              >
                统计
              </button>
              <button className="hc-panel-close" onClick={() => setPanelOpen(false)} aria-label="关闭">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {/* 聊天 Tab */}
            {tab === "chat" && (
              <>
                <div className="hc-messages">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`hc-msg hc-msg-${msg.role}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p>{msg.text}</p>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="hc-msg hc-msg-companion">
                      <div className="hc-typing"><span /><span /><span /></div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                {messages.length === 0 && (
                  <div className="hc-quick-bar">
                    {EMOTIONS.map((emo) => (
                      <button key={emo.key} className="hc-quick-btn" onClick={() => handleQuickEmotion(emo)}>
                        {emo.label}
                      </button>
                    ))}
                  </div>
                )}
                <div className="hc-input-bar">
                  <input
                    className="hc-input"
                    value={inputValue}
                    onChange={(e) => { setInputValue(e.target.value); lastInteractionRef.current = Date.now(); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="说说你现在的感受…"
                  />
                  <button className="hc-send-btn" onClick={() => handleSend()} disabled={!inputValue.trim()} aria-label="发送">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" />
                    </svg>
                  </button>
                </div>
                <p className="hc-disclaimer">我是你的 AI 伙伴，不是医生。如果长期情绪低落，建议找专业咨询师。</p>
              </>
            )}

            {/* 统计 Tab */}
            {tab === "stats" && stats && (
              <div className="hc-stats">
                {/* 模块概览 */}
                <div className="hc-stats-modules">
                  <div className="hc-stats-mod">
                    <div className="hc-stats-mod-icon" style={{ background: "rgba(244,166,184,0.15)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F4A6B8" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2C8 6 4 10 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-4-8-8-12z"/></svg>
                    </div>
                    <div className="hc-stats-mod-info">
                      <div className="hc-stats-mod-title">感恩日记</div>
                      <div className="hc-stats-mod-row">
                        <span>周 {stats.diary.week}</span>
                        <span>月 {stats.diary.month}</span>
                        <span>年 {stats.diary.year}</span>
                      </div>
                    </div>
                  </div>
                  <div className="hc-stats-mod">
                    <div className="hc-stats-mod-icon" style={{ background: "rgba(126,184,212,0.15)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7EB8D4" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 3"/></svg>
                    </div>
                    <div className="hc-stats-mod-info">
                      <div className="hc-stats-mod-title">呼吸引导</div>
                      <div className="hc-stats-mod-row">
                        <span>周 {stats.breathing.week}</span>
                        <span>月 {stats.breathing.month}</span>
                        <span>年 {stats.breathing.year}</span>
                      </div>
                    </div>
                  </div>
                  <div className="hc-stats-mod">
                    <div className="hc-stats-mod-icon" style={{ background: "rgba(165,196,160,0.15)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A5C4A0" strokeWidth="1.8" strokeLinecap="round"><path d="M12 3v18M3 12h18M6 6l12 12M6 18L18 6"/></svg>
                    </div>
                    <div className="hc-stats-mod-info">
                      <div className="hc-stats-mod-title">冥想空间</div>
                      <div className="hc-stats-mod-row">
                        <span>{formatDuration(stats.meditation.total)}</span>
                        <span>累计</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 近 7 天热力图 */}
                <div className="hc-stats-section">
                  <div className="hc-stats-section-title">近 7 天</div>
                  <div className="hc-stats-days">
                    {stats.recentDays.map((d) => (
                      <div key={d.date} className="hc-stats-day">
                        <div className="hc-stats-day-dots">
                          <div className={`hc-stats-dot hc-dot-diary ${d.hasDiary ? "hc-dot-active" : ""}`} title="日记" />
                          <div className={`hc-stats-dot hc-dot-breathing ${d.hasBreathing ? "hc-dot-active" : ""}`} title="呼吸" />
                          <div className={`hc-stats-dot hc-dot-meditation ${d.hasMeditation ? "hc-dot-active" : ""}`} title="冥想" />
                        </div>
                        <span className="hc-stats-day-label">{getWeekdayShort(d.date)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 心情分布 */}
                {stats.moodDistribution.length > 0 && (
                  <div className="hc-stats-section">
                    <div className="hc-stats-section-title">本月心情</div>
                    <div className="hc-stats-mood-list">
                      {stats.moodDistribution.map((m) => (
                        <div key={m.label} className="hc-stats-mood-row">
                          <span className="hc-stats-mood-dot" style={{ background: m.color }} />
                          <span className="hc-stats-mood-name">{m.label}</span>
                          <span className="hc-stats-mood-count">{m.count} 次</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 累计成就 */}
                <div className="hc-stats-section">
                  <div className="hc-stats-section-title">累计成就</div>
                  <div className="hc-stats-achievements">
                    <div className="hc-stats-ach">
                      <span className="hc-stats-ach-icon">{totalDiary > 0 ? "|" : "-"}</span>
                      <div>
                        <div className="hc-stats-ach-title">{totalDiary} 篇日记</div>
                        <div className="hc-stats-ach-desc">{totalDiary >= 100 ? "心灵园丁" : totalDiary >= 30 ? "坚持记录" : totalDiary >= 7 ? "初露锋芒" : "刚刚起步"}</div>
                      </div>
                    </div>
                    <div className="hc-stats-ach">
                      <span className="hc-stats-ach-icon">{stats.breathing.total > 0 ? "°" : "-"}</span>
                      <div>
                        <div className="hc-stats-ach-title">{stats.breathing.total} 次呼吸</div>
                        <div className="hc-stats-ach-desc">{stats.breathing.total >= 50 ? "呼吸大师" : stats.breathing.total >= 20 ? "气息调和" : stats.breathing.total >= 5 ? "初识呼吸" : "还未开始"}</div>
                      </div>
                    </div>
                    <div className="hc-stats-ach">
                      <span className="hc-stats-ach-icon">{stats.meditation.total >= 3600 ? "~" : "-"}</span>
                      <div>
                        <div className="hc-stats-ach-title">{formatDuration(stats.meditation.total)} 冥想</div>
                        <div className="hc-stats-ach-desc">{stats.meditation.total >= 7200 ? "深度修行" : stats.meditation.total >= 1800 ? "心灵旅者" : stats.meditation.total >= 300 ? "初学冥想" : "还未开始"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* ===== 导航栏小愈按钮 ===== */
        .hc-ball-wrap {
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 10px;
          transition: background 0.25s, transform 0.2s;
          -webkit-tap-highlight-color: transparent;
          margin-top: auto;
        }
        .hc-ball-wrap:hover {
          background: rgba(255, 255, 255, 0.06);
        }
        .hc-ball {
          position: relative;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #A5C4A0 0%, #7BAF8E 50%, #5E8A6E 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px -2px rgba(46, 64, 55, 0.25), inset 0 1px 0 rgba(255,255,255,0.2);
          transition: box-shadow 0.3s;
          flex-shrink: 0;
        }
        .hc-ball-wrap:hover .hc-ball {
          box-shadow: 0 4px 16px -2px rgba(46, 64, 55, 0.35), inset 0 1px 0 rgba(255,255,255,0.25);
        }

        .hc-ball-glow {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: rgba(122, 154, 130, 0.15);
          animation: hcBallGlow 3s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes hcBallGlow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        .hc-ball-speak-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(122, 154, 130, 0.4);
          animation: hcSpeakRing 0.8s ease-out infinite;
          pointer-events: none;
        }
        @keyframes hcSpeakRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        .hc-ball-icon {
          width: 18px;
          height: 18px;
          color: rgba(255, 255, 255, 0.9);
        }

        .hc-ball-label {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.75);
          letter-spacing: 0.05em;
        }

        /* ===== 对话气泡 ===== */
        .hc-bubble {
          position: absolute;
          bottom: calc(100% + 12px);
          right: 0;
          min-width: 160px;
          max-width: 220px;
          padding: 10px 14px;
          background: var(--card-bg, #fff);
          border: 1px solid rgba(122, 154, 130, 0.2);
          border-radius: 12px 12px 4px 12px;
          box-shadow: 0 4px 16px -4px rgba(0, 0, 0, 0.1);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 12.5px;
          line-height: 1.7;
          color: var(--text);
          white-space: normal;
          pointer-events: none;
        }
        .hc-bubble-arrow {
          position: absolute;
          bottom: -5px;
          right: 16px;
          width: 10px;
          height: 10px;
          background: var(--card-bg, #fff);
          border-right: 1px solid rgba(122, 154, 130, 0.2);
          border-bottom: 1px solid rgba(122, 154, 130, 0.2);
          transform: rotate(45deg);
        }

        /* ===== 面板 ===== */
        .hc-panel {
          position: fixed;
          left: 236px;
          bottom: 20px;
          width: 340px;
          max-height: 520px;
          z-index: 90;
          background: var(--card-bg, #fff);
          border: 1px solid var(--border, rgba(0,0,0,0.08));
          border-radius: 16px;
          box-shadow: 0 12px 48px -12px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Tab */
        .hc-tabs {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          border-bottom: 1px solid var(--border, rgba(0,0,0,0.06));
          gap: 4px;
        }
        .hc-tab {
          padding: 6px 16px;
          font-size: 13px;
          font-family: "Noto Serif SC", Georgia, serif;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: var(--text-soft);
          cursor: pointer;
          transition: all 0.2s;
        }
        .hc-tab:hover {
          background: rgba(122, 154, 130, 0.06);
        }
        .hc-tab-active {
          background: rgba(122, 154, 130, 0.1);
          color: var(--accent);
          font-weight: 600;
        }
        .hc-panel-close {
          margin-left: auto;
          width: 28px;
          height: 28px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: var(--text-soft);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .hc-panel-close:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        /* 消息列表 */
        .hc-messages {
          flex: 1;
          overflow-y: auto;
          padding: 14px 14px 8px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 140px;
          max-height: 280px;
        }
        .hc-msg { max-width: 85%; padding: 9px 13px; border-radius: 12px; font-size: 13px; line-height: 1.7; }
        .hc-msg p { margin: 0; }
        .hc-msg-companion {
          align-self: flex-start;
          background: rgba(122, 154, 130, 0.08);
          color: var(--text);
          border: 1px solid rgba(122, 154, 130, 0.12);
          border-radius: 12px 12px 12px 4px;
        }
        .hc-msg-user {
          align-self: flex-end;
          background: rgba(122, 154, 130, 0.18);
          color: var(--text);
          border-radius: 12px 12px 4px 12px;
        }

        .hc-typing { display: flex; gap: 4px; padding: 4px 0; }
        .hc-typing span {
          width: 5px; height: 5px; border-radius: 50%; background: var(--accent); opacity: 0.4;
          animation: hcTypingDot 1.2s ease-in-out infinite;
        }
        .hc-typing span:nth-child(2) { animation-delay: 0.2s; }
        .hc-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes hcTypingDot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 0.9; transform: translateY(-3px); }
        }

        .hc-quick-bar { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 14px 10px; }
        .hc-quick-btn {
          padding: 5px 12px; font-size: 12px; font-family: inherit;
          border: 1px solid rgba(122, 154, 130, 0.25); border-radius: 999px;
          background: transparent; color: var(--accent); cursor: pointer; transition: all 0.2s;
        }
        .hc-quick-btn:hover { background: rgba(122, 154, 130, 0.1); border-color: var(--accent); }

        .hc-input-bar { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-top: 1px solid var(--border, rgba(0,0,0,0.06)); }
        .hc-input {
          flex: 1; padding: 8px 12px; font-size: 13px; font-family: inherit;
          border: 1px solid var(--border, rgba(0,0,0,0.08)); border-radius: 999px;
          background: rgba(0, 0, 0, 0.02); color: var(--text); outline: none; transition: border-color 0.2s;
        }
        .hc-input:focus { border-color: var(--accent); }
        .hc-input::placeholder { color: var(--text-soft); opacity: 0.5; }
        .hc-send-btn {
          width: 32px; height: 32px; border: none; border-radius: 50%;
          background: var(--accent); color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: opacity 0.2s, transform 0.2s;
        }
        .hc-send-btn:disabled { opacity: 0.35; cursor: default; }
        .hc-send-btn:not(:disabled):hover { transform: scale(1.06); }

        .hc-disclaimer {
          font-size: 9.5px; color: var(--text-soft); opacity: 0.4;
          text-align: center; padding: 6px 14px 10px; margin: 0; line-height: 1.4;
        }

        /* ===== 统计 Tab ===== */
        .hc-stats {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 440px;
        }
        /* 模块概览 */
        .hc-stats-modules {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .hc-stats-mod {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(122, 154, 130, 0.04);
          border: 1px solid rgba(122, 154, 130, 0.08);
        }
        .hc-stats-mod-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .hc-stats-mod-info { flex: 1; }
        .hc-stats-mod-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 2px;
        }
        .hc-stats-mod-row {
          display: flex;
          gap: 10px;
          font-size: 11px;
          color: var(--text-soft);
          opacity: 0.7;
        }

        .hc-stats-section {}
        .hc-stats-section-title {
          font-size: 11px;
          color: var(--text-soft);
          opacity: 0.6;
          letter-spacing: 0.08em;
          margin-bottom: 10px;
        }

        /* 近 7 天 */
        .hc-stats-days {
          display: flex;
          justify-content: space-between;
          gap: 2px;
        }
        .hc-stats-day {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }
        .hc-stats-day-dots {
          display: flex;
          gap: 2px;
        }
        .hc-stats-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(122, 154, 130, 0.1);
          transition: background 0.2s;
        }
        .hc-dot-diary.hc-dot-active { background: #F4A6B8; }
        .hc-dot-breathing.hc-dot-active { background: #7EB8D4; }
        .hc-dot-meditation.hc-dot-active { background: #A5C4A0; }
        .hc-stats-day-label {
          font-size: 9px;
          color: var(--text-soft);
          opacity: 0.5;
        }

        /* 心情分布 */
        .hc-stats-mood-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .hc-stats-mood-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hc-stats-mood-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .hc-stats-mood-name {
          font-size: 12px;
          color: var(--text);
          flex: 1;
        }
        .hc-stats-mood-count {
          font-size: 11px;
          color: var(--text-soft);
          opacity: 0.6;
        }

        /* 累计成就 */
        .hc-stats-achievements {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .hc-stats-ach {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(122, 154, 130, 0.04);
          border: 1px solid rgba(122, 154, 130, 0.08);
        }
        .hc-stats-ach-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(122, 154, 130, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: var(--accent);
          flex-shrink: 0;
        }
        .hc-stats-ach-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
        }
        .hc-stats-ach-desc {
          font-size: 11px;
          color: var(--text-soft);
          opacity: 0.6;
          margin-top: 1px;
        }

        /* 响应式 */
        @media (max-width: 768px) {
          .hc-panel { left: 8px; right: 8px; bottom: 16px; width: auto; max-height: 55vh; }
        }
      `}</style>
    </>
  );
};

export default HealingCompanion;