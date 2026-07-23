import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * HealingCompanion — 疗愈室全页面内嵌组件
 *
 * 全页面内嵌式聊天界面，包含两个 Tab：
 * 1. 「小愈」— AI 疗愈师聊天（情绪识别 + 共情话术库）
 * 2. 「统计」— 本周 / 本月 / 本年疗愈数据统计
 *
 * 零外部 AI 依赖，全部本地模板匹配。
 */

/* ═══════════════════════════════════
   话术库
   ═══════════════════════════════════ */

type EmotionKey = "anxiety" | "exhausted" | "low" | "neutral" | "calm" | "happy";

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
  {
    key: "happy",
    label: "开心",
    keywords: ["开心", "高兴", "快乐", "兴奋", "激动", "爽", "哈哈", "嘻嘻", "太好了", "棒", "开心死了", "幸福", "美滋滋", "欢", "乐"],
    responses: [
      "哇，能感受到你的快乐！这种能量真好，整个人都在发光呢。",
      "开心的时候，世界都变得更美好了。好好享受这一刻吧！",
      "你的快乐也感染了我。开心的时候，别忘了记下来，以后翻看会特别温暖。",
    ],
    followUps: ["是什么让你这么开心的呢？", "要不要把这份快乐写成感恩日记？", "开心的时候做冥想也特别舒服，试试看？"],
    toolSuggestion: "开心的时候特别适合写感恩日记！把这份快乐记录下来，以后翻看会特别温暖。",
  },
];

/* ═══════════════════════════════════
   小愈人设介绍
   ═══════════════════════════════════ */

const XIAOYU_PERSONA = `我是小愈，住在森林疗愈室里的一只温柔陪伴者。
我懂一点心理学，但不会说教——我更愿意像一个老朋友那样，安静地听你说说心里话。
在这里，没有评判，没有"你应该"——只有柔软的沙发、暖黄的灯光，和一杯永远温着的茶。
不管你带着什么样的心情走进来，我都会陪着你，慢慢来，不着急。`;

const GREETINGS = [
  // 温和自我介绍型
  "你好呀，我是小愈。我住在森林疗愈室里，专门听人讲心里话的那种。今天想聊些什么呢？",
  "你来啦。我是小愈，一个懂一点点心理学的朋友——但更多时候，我只是一个温柔的倾听者。",
  "欢迎推开疗愈室的门。我是小愈，这里没有沙发客，只有朋友。今天想怎么称呼你都可以。",
  // 关怀型
  "今天的你，辛苦了呀。我是小愈，外面风大，先进来坐坐吧。",
  "欢迎来到疗愈室。不管今天过得怎么样，我都陪着你。我是小愈，一个安静的陪伴者。",
  "你来了。先深呼吸一下，然后慢慢说。我是小愈，不着急，我们有一整天的时间。",
  // 温暖开场型
  "嘿，你终于来了。我刚刚泡了杯热茶，正好可以陪你聊聊天。我是小愈。",
  "今天的你，带了一身疲惫走进来呢。没关系，放下吧，这里很安全。我是小愈。",
  "看到你推门进来，我很开心。疗愈室今天的光线刚好，很适合坐下来慢慢聊。我是小愈。",
  // 诗意型
  "窗外有风吹过树叶的声音，屋里有我陪着你。我是小愈，今天想聊聊什么？",
  "你听见了吗？外面下雨了。这种天气最适合窝在疗愈室里说说话了。我是小愈。",
  "阳光正好，茶正温。你来了，一切就刚刚好。我是小愈，今天想怎么度过这段时光？",
];

const IDLE_BUBBLES = [
  // 发呆安抚型
  "在发呆也很好哦。发呆是大脑在做瑜伽呢。",
  "不说话也没关系，我就在旁边，看看窗外，听听风声，也很舒服。",
  "就这样安静地待着吧。有时候最好的陪伴，就是什么都不说。",
  // 温柔提醒型
  "想说话的时候，我耳朵已经准备好了。不想说话的时候，我嘴巴就会乖乖闭上。",
  "如果累了就休息一下吧，不用勉强自己。这里不是KPI考核现场。",
  "嘿，还在吗？没关系的，我每隔一会儿就问问，不是催促，只是确认你还在呼吸。",
  // 好奇型
  "今天有什么小事让你觉得还不错吗？哪怕只是喝到了一杯温度刚好的水。",
  "我刚刚看到窗外有只小鸟飞过，突然觉得，生活里的小瞬间其实挺治愈的。你最近有吗？",
  // 鼓励型
  "有什么想倾诉的吗？我是一棵会说话的树洞，绝对保密，绝不评判。",
  "你知道吗，你已经比昨天更勇敢了——因为你今天又来了这里。",
  "有时候什么都不做，就是最好的自我照顾。你已经在做了，很棒。",
  // 自我暴露型
  "我今天在森林里捡到一片很好看的叶子，压在了书里。你最近有什么小确幸吗？",
  "疗愈室里的茶快凉了，但我可以再泡一杯。就像你，可以重新开始很多次。",
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
  const [tab, setTab] = useState<Tab>("chat");

  // 聊天
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const lastInteractionRef = useRef(Date.now());

  // 统计
  const [stats, setStats] = useState<Stats | null>(null);

  // 滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 组件挂载 400ms 后自动发送问候
  useEffect(() => {
    const t = setTimeout(() => {
      const greeting = pickRandom(GREETINGS);
      setIsTyping(true);
      const typingDuration = Math.min(greeting.length * 80 + 400, 2000);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: `${Date.now()}`, role: "companion", text: greeting, timestamp: Date.now() },
        ]);
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, typingDuration);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  // 初始加载统计
  useEffect(() => {
    setStats(loadStats());
  }, []);

  const addCompanionMessage = useCallback((text: string, delay = 800) => {
    setIsTyping(true);
    const typingDuration = Math.min(text.length * 80 + 400, 2000);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}`, role: "companion", text, timestamp: Date.now() },
      ]);
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
          addCompanionMessage(pickRandom(emotion.responses));

          // 第一轮就推荐工具
          setTimeout(() => addCompanionMessage(emotion.toolSuggestion, 600), 2500);

          // 偶发追问（轮次靠后时）
          if (turnCount >= 1 && Math.random() > 0.4) {
            setTimeout(() => {
              addCompanionMessage(pickRandom(emotion.followUps), 800);
            }, 5000);
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

  const totalDiary = stats?.diary.total ?? 0;

  return (
    <div className="hc-fullpage">
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
          <AnimatePresence>
            {messages.length > 0 && !isTyping && (
              <motion.div
                className="hc-quick-bar"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {EMOTIONS.map((emo) => (
                  <button key={emo.key} className="hc-quick-btn" onClick={() => handleQuickEmotion(emo)}>
                    {emo.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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
              <div className="hc-stats-mod-icon" style={{ background: "rgba(244,166,184,0.18)" }}>
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
              <div className="hc-stats-mod-icon" style={{ background: "rgba(126,184,212,0.18)" }}>
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
              <div className="hc-stats-mod-icon" style={{ background: "rgba(165,196,160,0.18)" }}>
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

      <style>{`
        /* ===== 全页面容器 ===== */
        .hc-fullpage {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          font-family: "Noto Serif SC", Georgia, serif;
          /* 浅色毛玻璃背景，覆盖 hl-card 的深色半透明 */
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(16px) saturate(1.4);
          -webkit-backdrop-filter: blur(16px) saturate(1.4);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.4);
          /* 深色文字变量 */
          --text: #3D4A3E;
          --text-soft: #6B7A6E;
          --accent: #5E8A6E;
          --card-bg: rgba(61,74,62,0.06);
          --border: rgba(61,74,62,0.15);
        }

        /* Tab */
        .hc-tabs {
          display: flex;
          align-items: center;
          padding: 10px 20px;
          gap: 4px;
          flex-shrink: 0;
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
          background: rgba(61,74,62,0.04);
          color: var(--text-soft);
        }
        .hc-tab-active {
          background: var(--card-bg);
          color: var(--text);
          font-weight: 600;
        }

        /* 消息列表 */
        .hc-messages {
          flex: 1;
          overflow-y: auto;
          padding: 8px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 0;
        }
        .hc-msg { max-width: 85%; padding: 9px 13px; border-radius: 12px; font-size: 13px; line-height: 1.7; }
        .hc-msg p { margin: 0; }
        .hc-msg-companion {
          align-self: flex-start;
          background: var(--card-bg);
          color: var(--text);
          border: 1px solid rgba(61,74,62,0.08);
          border-radius: 12px 12px 12px 4px;
        }
        .hc-msg-user {
          align-self: flex-end;
          background: rgba(94, 138, 110, 0.12);
          color: var(--text);
          border-radius: 12px 12px 4px 12px;
        }

        .hc-typing { display: flex; gap: 4px; padding: 4px 0; }
        .hc-typing span {
          width: 5px; height: 5px; border-radius: 50%; background: var(--text); opacity: 0.4;
          animation: hcTypingDot 1.2s ease-in-out infinite;
        }
        .hc-typing span:nth-child(2) { animation-delay: 0.2s; }
        .hc-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes hcTypingDot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 0.9; transform: translateY(-3px); }
        }

        .hc-quick-bar { display: flex; flex-wrap: wrap; gap: 6px; padding: 6px 20px 8px; }
        .hc-quick-btn {
          padding: 5px 12px; font-size: 12px; font-family: inherit;
          border: 1px solid var(--border); border-radius: 999px;
          background: transparent; color: var(--text-soft); cursor: pointer; transition: all 0.2s;
        }
        .hc-quick-btn:hover {
          background: var(--card-bg);
          border-color: rgba(61,74,62,0.3);
          color: var(--text);
        }

        .hc-input-bar {
          display: flex; align-items: center; gap: 8px; padding: 10px 20px;
        }
        .hc-input {
          flex: 1; padding: 8px 12px; font-size: 13px; font-family: inherit;
          border: 1px solid var(--border); border-radius: 999px;
          background: rgba(61,74,62,0.04); color: var(--text); outline: none; transition: border-color 0.2s;
        }
        .hc-input:focus { border-color: rgba(61,74,62,0.2); }
        .hc-input::placeholder { color: rgba(61,74,62,0.35); }
        .hc-send-btn {
          width: 32px; height: 32px; border: none; border-radius: 50%;
          background: rgba(94, 138, 110, 0.25); color: var(--text); cursor: pointer;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: opacity 0.2s, transform 0.2s, background 0.2s;
        }
        .hc-send-btn:disabled { opacity: 0.35; cursor: default; }
        .hc-send-btn:not(:disabled):hover { background: rgba(94, 138, 110, 0.35); transform: scale(1.06); }

        .hc-disclaimer {
          font-size: 9.5px; color: rgba(61,74,62,0.3);
          text-align: center; padding: 6px 20px 10px; margin: 0; line-height: 1.4;
          flex-shrink: 0;
        }

        /* ===== 统计 Tab ===== */
        .hc-stats {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-height: 0;
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
          background: rgba(61,74,62,0.04);
          border: 1px solid rgba(61,74,62,0.08);
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
        }

        .hc-stats-section {}
        .hc-stats-section-title {
          font-size: 11px;
          color: rgba(61,74,62,0.4);
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
          background: var(--card-bg);
          transition: background 0.2s, box-shadow 0.2s;
        }
        .hc-dot-diary.hc-dot-active { background: #F4A6B8; box-shadow: 0 0 6px rgba(244, 166, 184, 0.6); }
        .hc-dot-breathing.hc-dot-active { background: #7EB8D4; box-shadow: 0 0 6px rgba(126, 184, 212, 0.6); }
        .hc-dot-meditation.hc-dot-active { background: #A5C4A0; box-shadow: 0 0 6px rgba(165, 196, 160, 0.6); }
        .hc-stats-day-label {
          font-size: 9px;
          color: rgba(61,74,62,0.4);
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
          background: rgba(61,74,62,0.03);
          border: 1px solid rgba(61,74,62,0.08);
        }
        .hc-stats-ach-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(61,74,62,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: var(--text);
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
          margin-top: 1px;
        }

        /* 响应式 */
        @media (max-width: 768px) {
          .hc-fullpage { padding: 0 4px; }
        }
      `}</style>
    </div>
  );
};

export default HealingCompanion;