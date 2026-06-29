import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * GratitudeJournal — 森林疗愈室 · 感恩日记
 *
 * 重构为「实体绘本」式沉浸体验：
 * - 封面页：手绘风「阳光透过树叶」插画 + 光斑漂移 / 树叶摇曳微动效
 * - 目录页：12 个月度篇章网格，当前月份高亮发光
 * - 日记页：当月引导语 + 心情/天气选择 + 书写区 + 历史记录
 *
 * 核心交互：
 * - 点击封面任意处 → 3D 翻书 → 进入目录
 * - 内页右下角「合上书」→ 书页合拢 → 平滑回到封面
 * - 心情圆点：选中放大 + 白边 + 发光，状态写入 LocalStorage
 * - 月度引导语：根据月份显示对应温柔引导
 * - 保存反馈：按钮旁微文案「已记录 ✨ 今天的温柔已存入心底。」2s 淡出
 */

/* ===== 类型 ===== */

interface GratitudeEntry {
  id: string;
  date: string;
  month: number;
  mood: string; // 天气 key
  color: string; // 心情色 key
  content: string;
}

interface Draft {
  weather: string;
  color: string;
  content: string;
}

/* ===== 常量 ===== */

const STORAGE_KEY = "gratitude_entries";
const DRAFT_KEY = "gratitude_drafts";

/** 月度主题（短标签，用于目录卡片与主题药丸） */
const MONTHLY_THEMES = [
  "新生",
  "接纳",
  "表达",
  "感恩",
  "身体",
  "小确幸",
  "平静",
  "创造",
  "韧性",
  "放下",
  "连接",
  "回顾",
];

/** 12 个月引导语（硬编码） */
const MONTHLY_GUIDANCE = [
  "新的一年，从写下今天最想开始的改变开始…",
  "今天，我允许自己不完美，接纳此刻的情绪和身体。",
  "情绪不是敌人，今天我选择用文字、绘画或声音表达它。",
  "今天，我感谢谁？哪怕只是一句问候、一个微笑。",
  "身体在告诉我什么？今天我倾听它的信号，给它一杯水、一次拉伸。",
  "今天，哪个微小瞬间让我嘴角上扬？一杯咖啡、一阵风、一句“你来了”。",
  "今天，我为自己创造了一刻宁静——也许是闭眼深呼吸，也许是看云发呆。",
  "今天，我允许自己“无用”地创造——画一笔、写一句、哼一段旋律。",
  "今天，我面对了一个小挑战，我对自己说：“我可以慢慢来。”",
  "今天，我放下了一件小事——也许是旧物、旧想法、旧情绪。",
  "今天，我和谁有了真实的对话？哪怕只是眼神交汇、指尖触碰。",
  "这一年，我感谢自己坚持下来的每一天。明年，我想继续温柔地生长。",
];

const MONTH_LABELS = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];

const WEEKDAYS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

interface WeatherOption {
  key: string;
  label: string;
}

const WEATHER_OPTIONS: WeatherOption[] = [
  { key: "sun", label: "晴天" },
  { key: "cloud", label: "多云" },
  { key: "rain", label: "雨天" },
  { key: "moon", label: "夜晚" },
];

const MOOD_COLORS = [
  { key: "joy", dot: "#F4D88A", label: "开心" },
  { key: "calm", dot: "#A5D6A7", label: "平静" },
  { key: "cool", dot: "#90CAF9", label: "冷静" },
  { key: "tender", dot: "#F4A6B8", label: "温柔" },
  { key: "soulful", dot: "#C5A3D6", label: "感性" },
  { key: "mellow", dot: "#D9C9B0", label: "平淡" },
];

type JournalView = "cover" | "directory" | "diary";

/* ===== 天气图标（细线 SVG，替代 emoji） ===== */

const WeatherGlyph: React.FC<{ name: string; size?: number }> = ({ name, size = 16 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "sun")
    return (
      <svg {...common}>
        <circle cx="10" cy="10" r="3.4" />
        <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4" />
      </svg>
    );
  if (name === "cloud")
    return (
      <svg {...common}>
        <path d="M6 14a3 3 0 0 1-.4-5.97 4 4 0 0 1 7.74-.78A2.7 2.7 0 0 1 15.5 14H6Z" />
      </svg>
    );
  if (name === "rain")
    return (
      <svg {...common}>
        <path d="M6 11a3 3 0 0 1-.4-5.97 4 4 0 0 1 7.74-.78A2.7 2.7 0 0 1 15.5 11H6Z" />
        <path d="M7 14.5l-1 2.5M11 14.5l-1 2.5M14 14.5l-1 2.5" opacity="0.7" />
      </svg>
    );
  // moon
  return (
    <svg {...common}>
      <path d="M16 12.5A6.5 6.5 0 1 1 8 3.5a5.2 5.2 0 0 0 8 9Z" />
    </svg>
  );
};

/** 合上书 / 书本图标 */
const BookCloseIcon: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4.5C4 3.7 4.7 3.5 5.5 3.5H10v13H5.5C4.7 16.5 4 16.3 4 15.5Z" />
    <path d="M16 4.5C16 3.7 15.3 3.5 14.5 3.5H10v13h4.5c.8 0 1.5-.2 1.5-1Z" />
  </svg>
);

/** 细叶图标 */
const LeafMini: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M10 2C5 3 3 7 3 11c0 3.5 3 6.5 7 6.5 0-5 2.5-9 7-11-3-2.5-5.5-4.5-7-4.5Z" fill="currentColor" opacity="0.85" />
    <path d="M5 16c2-4 5-7 9-9" stroke="rgba(255,255,255,0.5)" strokeWidth="0.9" strokeLinecap="round" />
  </svg>
);

/* ===== 工具函数 ===== */

const getToday = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const getMonthFromDate = (dateStr: string): number => {
  const parts = dateStr.split("-");
  return parts.length >= 2 ? parseInt(parts[1], 10) : new Date().getMonth() + 1;
};

const formatDateFull = (dateStr: string): string => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${y}年${m}月${d}日 ${WEEKDAYS[date.getDay()]}`;
};

/** 兼容旧数据（旧版 mood 字段存的是 emoji） */
const resolveWeather = (val: string | undefined): string => {
  if (!val) return "sun";
  if (WEATHER_OPTIONS.some((w) => w.key === val)) return val;
  if (val.includes("☀") || val.includes("晴")) return "sun";
  if (val.includes("☁")) return "cloud";
  if (val.includes("雨")) return "rain";
  if (val.includes("🌙") || val.includes("夜")) return "moon";
  return "sun";
};

const loadEntries = (): GratitudeEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, unknown>[];
    return parsed.map((e) => {
      const month =
        e.month != null ? (e.month as number) : getMonthFromDate((e.date as string) || getToday());
      return {
        id: (e.id as string) || (e.date as string) || `${Date.now()}`,
        date: (e.date as string) || getToday(),
        month,
        mood: resolveWeather(e.mood as string | undefined),
        color: (e.color as string) || "",
        content: (e.content as string) || (e.text as string) || "",
      };
    });
  } catch {
    return [];
  }
};

const saveEntries = (entries: GratitudeEntry[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

const loadDraft = (month: number): Draft | null => {
  try {
    const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}") as Record<string, Draft>;
    return all[String(month)] || null;
  } catch {
    return null;
  }
};

const writeDraft = (month: number, draft: Draft): void => {
  try {
    const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}") as Record<string, Draft>;
    all[String(month)] = draft;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
};

const clearDraft = (month: number): void => {
  try {
    const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}") as Record<string, Draft>;
    delete all[String(month)];
    localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
};

/* ===== 翻书动画变体 ===== */

const flipVariants = {
  enter: (dir: number) => ({
    rotateY: dir > 0 ? 95 : -95,
    opacity: 0,
  }),
  center: {
    rotateY: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    rotateY: dir > 0 ? -95 : 95,
    opacity: 0,
  }),
};

/* ============================================================
   封面场景插画：手绘水彩 · 马卡龙色系 · 慵懒小兔
   使用生成的发光封面图 + CSS 外发光层（适配暗色背景）
   ============================================================ */

const CoverScene: React.FC = () => (
  <div className="gj-cover-scene" aria-hidden="true">
    {/* 水彩封面图（object-fit 填满，亮度提升） */}
    <img
      src="/gratitude-cover.jpg"
      alt=""
      className="gj-cover-img"
      draggable={false}
    />
    {/* 柔光遮罩：中心提亮 + 边缘渐隐，确保文字可读 */}
    <div className="gj-cover-veil" />
    {/* 漂浮光斑（点缀，保留呼吸感） */}
    <span className="gj-bokeh gj-bokeh-1" />
    <span className="gj-bokeh gj-bokeh-2" />
  </div>
);

/* ============================================================
   目录页：月度篇章网格
   ============================================================ */

interface DirectoryPageProps {
  currentMonth: number;
  monthsWithEntries: Set<number>;
  onOpenMonth: (m: number) => void;
  onClose: () => void;
}

const DirectoryPage: React.FC<DirectoryPageProps> = ({
  currentMonth,
  monthsWithEntries,
  onOpenMonth,
  onClose,
}) => (
  <div className="gj-page-inner gj-directory">
    <header className="gj-page-head">
      <div>
        <h3 className="gj-page-title">月度篇章</h3>
        <p className="gj-page-sub">十二个月，十二种向内的探险</p>
      </div>
    </header>

    <div className="gj-grid">
      {Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const isCurrent = month === currentMonth;
        const hasEntries = monthsWithEntries.has(month);
        return (
          <motion.button
            key={month}
            type="button"
            className={`gj-month-card${isCurrent ? " gj-current" : ""}`}
            whileHover={{ y: -5, transition: { type: "spring", stiffness: 320, damping: 22 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpenMonth(month)}
            aria-label={`${MONTH_LABELS[i]} · ${MONTHLY_THEMES[i]}`}
          >
            {hasEntries && <span className="gj-month-dot" />}
            {isCurrent && <span className="gj-month-today">本月</span>}
            <span className="gj-month-num">{month}</span>
            <span className="gj-month-theme">{MONTHLY_THEMES[i]}</span>
          </motion.button>
        );
      })}
    </div>

    <button className="gj-close-book" onClick={onClose} aria-label="合上书">
      <BookCloseIcon />
      <span>合上书</span>
    </button>
  </div>
);

/* ============================================================
   日记页
   ============================================================ */

interface DiaryPageProps {
  selectedMonth: number;
  today: string;
  content: string;
  weather: string;
  color: string;
  savedFlash: boolean;
  entries: GratitudeEntry[];
  onContent: (v: string) => void;
  onWeather: (v: string) => void;
  onColor: (v: string) => void;
  onSave: () => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  onClose: () => void;
}

const DiaryPage: React.FC<DiaryPageProps> = ({
  selectedMonth,
  today,
  content,
  weather,
  color,
  savedFlash,
  entries,
  onContent,
  onWeather,
  onColor,
  onSave,
  onDelete,
  onBack,
  onClose,
}) => {
  const monthEntries = useMemo(
    () =>
      entries
        .filter((e) => e.month === selectedMonth)
        .sort((a, b) => (b.date > a.date ? 1 : -1)),
    [entries, selectedMonth]
  );

  return (
    <div className="gj-page-inner gj-diary">
      {/* 顶部：返回目录 + 主题药丸 */}
      <div className="gj-diary-top">
        <button className="gj-back-dir" onClick={onBack} aria-label="返回目录">
          <span aria-hidden="true">←</span> 目录
        </button>
        <span className="gj-detail-theme">
          {MONTH_LABELS[selectedMonth - 1]} · {MONTHLY_THEMES[selectedMonth - 1]}
        </span>
      </div>

      {/* 月度引导语 */}
      <div className="gj-guidance">
        <span className="gj-guidance-mark">
          <LeafMini size={13} />
        </span>
        <p className="gj-guidance-text">{MONTHLY_GUIDANCE[selectedMonth - 1]}</p>
      </div>

      <div className="gj-detail-body">
        {/* 左栏 */}
        <div className="gj-sidebar">
          <div>
            <div className="gj-sidebar-label">日期</div>
            <div className="gj-sidebar-date">{formatDateFull(today)}</div>
          </div>

          <div>
            <div className="gj-sidebar-label">天气</div>
            <div className="gj-weather-picker">
              {WEATHER_OPTIONS.map((w) => (
                <button
                  key={w.key}
                  type="button"
                  className={`gj-weather-btn${weather === w.key ? " gj-weather-active" : ""}`}
                  onClick={() => onWeather(w.key)}
                  title={w.label}
                  aria-label={w.label}
                >
                  <WeatherGlyph name={w.key} size={17} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="gj-sidebar-label">心情</div>
            <div className="gj-mood-picker">
              {MOOD_COLORS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className={`gj-mood-dot${color === c.key ? " gj-mood-active" : ""}`}
                  style={{ ["--gj-dot" as string]: c.dot, background: c.dot }}
                  onClick={() => onColor(color === c.key ? "" : c.key)}
                  title={c.label}
                  aria-label={c.label}
                  aria-pressed={color === c.key}
                />
              ))}
            </div>
            <p className="gj-mood-hint">
              {color ? MOOD_COLORS.find((c) => c.key === color)?.label : "轻触一颗，标记此刻"}
            </p>
          </div>
        </div>

        {/* 右栏 — 书写区 */}
        <div className="gj-writing">
          <textarea
            className="gj-textarea"
            value={content}
            onChange={(e) => onContent(e.target.value)}
            placeholder="在这里，写下今天的温柔…"
            spellCheck={false}
          />
        </div>
      </div>

      {/* 保存区 + 反馈微文案 */}
      <div className="gj-save-area">
        <AnimatePresence>
          {savedFlash && (
            <motion.span
              className="gj-save-feedback"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.4 }}
            >
              已记录 ✨ 今天的温柔已存入心底。
            </motion.span>
          )}
        </AnimatePresence>
        <button
          type="button"
          className={`gj-save-btn${savedFlash ? " gj-saved" : ""}`}
          onClick={onSave}
          disabled={!content.trim()}
        >
          {savedFlash ? "已保存 ✓" : "保存"}
        </button>
      </div>

      {/* 本月历史记录 */}
      {monthEntries.length > 0 && (
        <div className="gj-month-history">
          <h4 className="gj-month-history-title">
            本月记录 <span className="gj-month-history-count">{monthEntries.length}</span>
          </h4>
          <div className="gj-month-entry-list">
            {monthEntries.map((entry) => {
              const colorInfo = MOOD_COLORS.find((c) => c.key === entry.color);
              return (
                <div key={entry.id} className="gj-month-entry">
                  <div className="gj-month-entry-header">
                    <div className="gj-month-entry-date-row">
                      <span className="gj-month-entry-date">{entry.date}</span>
                      <span className="gj-month-entry-weather" title={WEATHER_OPTIONS.find((w) => w.key === entry.mood)?.label}>
                        <WeatherGlyph name={resolveWeather(entry.mood)} size={14} />
                      </span>
                      {colorInfo && (
                        <span
                          className="gj-month-entry-color-tag"
                          style={{ background: colorInfo.dot }}
                          title={colorInfo.label}
                        />
                      )}
                    </div>
                    <button
                      className="gj-month-entry-delete"
                      onClick={() => onDelete(entry.id)}
                      aria-label="删除"
                    >
                      ×
                    </button>
                  </div>
                  <p className="gj-month-entry-text">{entry.content}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button className="gj-close-book" onClick={onClose} aria-label="合上书">
        <BookCloseIcon />
        <span>合上书</span>
      </button>
    </div>
  );
};

/* ============================================================
   主组件
   ============================================================ */

const GratitudeJournal: React.FC = () => {
  const [view, setView] = useState<JournalView>("cover");
  const [flipDir, setFlipDir] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [content, setContent] = useState("");
  const [weather, setWeather] = useState<string>("sun");
  const [color, setColor] = useState<string>("");
  const [savedFlash, setSavedFlash] = useState(false);

  const today = useMemo(() => getToday(), []);
  const currentMonth = useMemo(() => new Date().getMonth() + 1, []);

  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  /** 哪些月份已有日记 */
  const monthsWithEntries = useMemo(() => {
    const set = new Set<number>();
    entries.forEach((e) => set.add(e.month));
    return set;
  }, [entries]);

  /** 草稿写入（心情/天气/正文即时持久化） */
  const persistDraft = useCallback(
    (m: number, next: { weather: string; color: string; content: string }) => {
      writeDraft(m, next);
    },
    []
  );

  /** 打开某月日记：优先读草稿，其次读最近一条记录 */
  const openMonth = useCallback(
    (m: number) => {
      setSelectedMonth(m);
      setFlipDir(1);
      setView("diary");

      const draft = loadDraft(m);
      if (draft) {
        setWeather(draft.weather);
        setColor(draft.color);
        setContent(draft.content);
      } else {
        const latest = entries
          .filter((e) => e.month === m)
          .sort((a, b) => (b.date > a.date ? 1 : -1))[0];
        if (latest) {
          setWeather(resolveWeather(latest.mood));
          setColor(latest.color);
          setContent(latest.content);
        } else {
          setWeather("sun");
          setColor("");
          setContent("");
        }
      }
    },
    [entries]
  );

  /** 封面 → 目录 */
  const openBook = useCallback(() => {
    setFlipDir(1);
    setView("directory");
  }, []);

  /** 目录/日记 → 封面（合上书） */
  const closeBook = useCallback(() => {
    setFlipDir(-1);
    setView("cover");
    setSelectedMonth(null);
  }, []);

  /** 日记 → 目录 */
  const backToDirectory = useCallback(() => {
    setFlipDir(-1);
    setView("directory");
    setSelectedMonth(null);
  }, []);

  /** 内容变更 + 草稿持久化 */
  const handleContent = useCallback(
    (v: string) => {
      setContent(v);
      if (selectedMonth !== null) persistDraft(selectedMonth, { weather, color, content: v });
    },
    [selectedMonth, weather, color, persistDraft]
  );

  const handleWeather = useCallback(
    (v: string) => {
      setWeather(v);
      if (selectedMonth !== null) persistDraft(selectedMonth, { weather: v, color, content });
    },
    [selectedMonth, color, content, persistDraft]
  );

  const handleColor = useCallback(
    (v: string) => {
      setColor(v);
      if (selectedMonth !== null) persistDraft(selectedMonth, { weather, color: v, content });
    },
    [selectedMonth, weather, content, persistDraft]
  );

  /** 保存为正式记录 */
  const handleSave = useCallback(() => {
    if (!content.trim() || selectedMonth === null) return;

    const todayDate = getToday();
    const newEntry: GratitudeEntry = {
      id: `${todayDate}-${Date.now()}`,
      date: todayDate,
      month: selectedMonth,
      mood: weather,
      color,
      content: content.trim(),
    };

    const existingIdx = entries.findIndex(
      (e) => e.date === todayDate && e.month === selectedMonth
    );

    let updated: GratitudeEntry[];
    if (existingIdx >= 0) {
      updated = entries.map((e, i) => (i === existingIdx ? { ...newEntry, id: e.id } : e));
    } else {
      updated = [newEntry, ...entries];
    }

    setEntries(updated);
    saveEntries(updated);
    clearDraft(selectedMonth); // 已保存，清除草稿
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  }, [content, selectedMonth, weather, color, entries]);

  /** 删除记录 */
  const handleDelete = useCallback(
    (id: string) => {
      const updated = entries.filter((e) => e.id !== id);
      setEntries(updated);
      saveEntries(updated);
    },
    [entries]
  );

  /* ===== 渲染 ===== */

  return (
    <div className="gj-root">
      <div className="gj-book-stand">
        <div className="gj-book">
          <div className="gj-spine" />

          <AnimatePresence mode="wait" custom={flipDir}>
            {/* ===== 封面 ===== */}
            {view === "cover" && (
              <motion.div
                key="cover"
                className="gj-page gj-cover"
                custom={flipDir}
                variants={flipVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.62, ease: [0.4, 0, 0.2, 1] }}
                onClick={openBook}
                role="button"
                tabIndex={0}
                aria-label="翻开感恩日记"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openBook();
                  }
                }}
              >
                <CoverScene />
                {/* 封面文案层 · Tailwind 响应式排版
                    图片自带英文标题，此处叠加中文主标题 + 副标题，
                    底部加渐变压暗保证文字对比度 */}
                <div className="gj-cover-text-veil" aria-hidden="true" />
                <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-10 py-24 text-center md:px-14 md:py-28">
                  {/* 第一层级 · 主标题：大号墨绿衬线体 */}
                  <h2 className="gj-cover-title m-0 font-medium leading-tight tracking-[0.12em] text-[2rem] md:text-[2.75rem] lg:text-[3.25rem]">
                    感恩日记
                  </h2>
                  {/* 第二层级 · 英文副标题：斜体衬线体，浅灰色，极简 */}
                  <p className="gj-cover-en mt-4 italic font-serif text-gray-500 text-[0.82rem] tracking-[0.18em] md:mt-5 md:text-[0.9rem]">
                    Gratitude Journal
                  </p>
                  {/* 第三层级 · 中文引导语：小号浅灰，字间距拉大 */}
                  <p className="gj-cover-sub mt-6 max-w-xs text-[0.8rem] leading-[2.15] tracking-[0.14em] md:mt-8 md:max-w-sm md:text-[0.92rem]">
                    在细碎的日常里，写下属于自己生命的注脚。
                  </p>
                  {/* 翻页提示 · 底部居中，极淡呼吸 */}
                  <span className="gj-cover-hint">轻触翻开</span>
                </div>
              </motion.div>
            )}

            {/* ===== 目录 ===== */}
            {view === "directory" && (
              <motion.div
                key="directory"
                className="gj-page gj-page-paper"
                custom={flipDir}
                variants={flipVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.62, ease: [0.4, 0, 0.2, 1] }}
              >
                <DirectoryPage
                  currentMonth={currentMonth}
                  monthsWithEntries={monthsWithEntries}
                  onOpenMonth={openMonth}
                  onClose={closeBook}
                />
              </motion.div>
            )}

            {/* ===== 日记 ===== */}
            {view === "diary" && selectedMonth !== null && (
              <motion.div
                key={`diary-${selectedMonth}`}
                className="gj-page gj-page-paper"
                custom={flipDir}
                variants={flipVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.62, ease: [0.4, 0, 0.2, 1] }}
              >
                <DiaryPage
                  selectedMonth={selectedMonth}
                  today={today}
                  content={content}
                  weather={weather}
                  color={color}
                  savedFlash={savedFlash}
                  entries={entries}
                  onContent={handleContent}
                  onWeather={handleWeather}
                  onColor={handleColor}
                  onSave={handleSave}
                  onDelete={handleDelete}
                  onBack={backToDirectory}
                  onClose={closeBook}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        /* ===== 根容器 ===== */
        .gj-root {
          position: relative;
          width: 100%;
        }
        .gj-book-stand {
          perspective: 1800px;
          perspective-origin: center 40%;
        }
        .gj-book {
          position: relative;
          min-height: 560px;
          transform-style: preserve-3d;
        }

        /* 书脊（左侧装订阴影） */
        .gj-spine {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 10px;
          z-index: 6;
          pointer-events: none;
          background: linear-gradient(to right, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.04) 55%, transparent 100%);
          border-radius: 14px 0 0 14px;
        }

        /* ===== 页面通用（翻书 3D） ===== */
        .gj-page {
          position: relative;
          width: 100%;
          min-height: 560px;
          border-radius: 6px 16px 16px 6px;
          transform-origin: left center;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          overflow: hidden;
        }

        /* 内页纸张（暖白 / 奶油）—— 水彩晕染 + 纸张质感
           不再用纯色平铺，而是叠加多层极淡水彩色斑，
           模拟森林光晕透入纸面的温润感，同时保留可读性 */
        .gj-page-paper {
          background-color: #F6EFE0;
          background-image:
            /* 左上 · 淡绿水彩（森林气息） */
            radial-gradient(ellipse 62% 52% at 18% 14%, rgba(150,180,150,0.11) 0%, transparent 62%),
            /* 右下 · 暖赭水彩（阳光余温） */
            radial-gradient(ellipse 56% 46% at 86% 88%, rgba(202,172,122,0.12) 0%, transparent 60%),
            /* 中部 · 淡米晕染（统一纸调） */
            radial-gradient(ellipse 72% 62% at 50% 52%, rgba(246,238,218,0.55) 0%, transparent 72%);
          box-shadow:
            0 1px 2px rgba(120,100,50,0.06),
            0 5px 14px -3px rgba(120,100,50,0.10),
            0 20px 50px -14px rgba(120,100,50,0.22),
            inset 0 0 70px rgba(255,250,235,0.45);
        }
        [data-theme="night"] .gj-page-paper {
          background-color: #232A24;
          background-image:
            radial-gradient(ellipse 62% 52% at 18% 14%, rgba(120,150,128,0.10) 0%, transparent 62%),
            radial-gradient(ellipse 56% 46% at 86% 88%, rgba(90,110,100,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 72% 62% at 50% 52%, rgba(40,52,44,0.5) 0%, transparent 72%);
          box-shadow:
            0 1px 2px rgba(0,0,0,0.3),
            0 5px 14px -3px rgba(0,0,0,0.35),
            0 20px 50px -14px rgba(0,0,0,0.55),
            inset 0 0 70px rgba(0,0,0,0.2);
        }
        /* 纸张纹理：横线 + 细腻纤维噪点（手造纸质感） */
        .gj-page-paper::before {
          content: "";
          position: absolute; inset: 0;
          background-image:
            repeating-linear-gradient(
              transparent, transparent 31px,
              rgba(180,160,120,0.085) 31px, rgba(180,160,120,0.085) 32px
            ),
            radial-gradient(circle at 30% 40%, rgba(120,100,60,0.022) 0.5px, transparent 1px),
            radial-gradient(circle at 70% 60%, rgba(120,100,60,0.018) 0.5px, transparent 1px);
          background-size: auto, 6px 6px, 9px 9px;
          pointer-events: none;
          z-index: 0;
        }
        [data-theme="night"] .gj-page-paper::before {
          background-image:
            repeating-linear-gradient(
              transparent, transparent 31px,
              rgba(140,160,140,0.07) 31px, rgba(140,160,140,0.07) 32px
            ),
            radial-gradient(circle at 30% 40%, rgba(200,210,200,0.016) 0.5px, transparent 1px),
            radial-gradient(circle at 70% 60%, rgba(200,210,200,0.014) 0.5px, transparent 1px);
          background-size: auto, 6px 6px, 9px 9px;
        }

        .gj-page-inner {
          position: relative;
          z-index: 1;
          padding: 36px 36px 80px 40px;
          min-height: 560px;
        }

        /* ===== 封面 ===== */
        .gj-cover {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: #FAF4E8;
          /* 外发光：暗色背景下让封面像一张发光的卡片 */
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.25),
            0 0 28px 4px rgba(255,250,240,0.18),
            0 12px 40px -8px rgba(0,0,0,0.25);
        }
        [data-theme="night"] .gj-cover {
          background: #1C2520;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.18),
            0 0 36px 6px rgba(255,250,240,0.14),
            0 16px 48px -8px rgba(0,0,0,0.5);
        }

        .gj-cover-scene {
          position: absolute; inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }

        /* 水彩封面图：填满封面，亮度提升，呈发光卡片感 */
        .gj-cover-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(1.08) saturate(0.92) contrast(0.96);
          will-change: transform, opacity;
        }
        [data-theme="night"] .gj-cover-img {
          filter: brightness(1.05) saturate(0.88) contrast(0.94);
        }

        /* 柔光遮罩：中心微亮 + 边缘渐隐，统一纸调并保证文字可读 */
        .gj-cover-veil {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 70% 55% at 50% 45%, rgba(250,244,232,0.35) 0%, rgba(250,244,232,0) 65%),
            linear-gradient(to bottom, rgba(250,244,232,0.12) 0%, rgba(250,244,232,0) 30%, rgba(250,244,232,0) 70%, rgba(250,244,232,0.15) 100%);
        }
        [data-theme="night"] .gj-cover-veil {
          background:
            radial-gradient(ellipse 70% 55% at 50% 45%, rgba(28,37,32,0.3) 0%, rgba(28,37,32,0) 65%),
            linear-gradient(to bottom, rgba(28,37,32,0.15) 0%, rgba(28,37,32,0) 30%, rgba(28,37,32,0) 70%, rgba(28,37,32,0.2) 100%);
        }

        /* 极淡光斑（点缀边缘留白，保留呼吸感） */
        .gj-bokeh {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,248,214,0.7) 0%, rgba(255,248,214,0) 70%);
          filter: blur(1px);
          will-change: transform, opacity;
        }
        .gj-bokeh-1 { width: 48px; height: 48px; left: 14%; top: 18%; animation: gj-drift1 12s ease-in-out infinite; }
        .gj-bokeh-2 { width: 36px; height: 36px; right: 16%; bottom: 22%; animation: gj-drift2 14s ease-in-out infinite; }
        [data-theme="night"] .gj-bokeh {
          background: radial-gradient(circle, rgba(200,230,180,0.55) 0%, rgba(200,230,180,0) 70%);
        }

        @keyframes gj-drift1 {
          0%,100% { transform: translate(0,0); opacity: 0.35; }
          50% { transform: translate(16px,-20px); opacity: 0.7; }
        }
        @keyframes gj-drift2 {
          0%,100% { transform: translate(0,0); opacity: 0.3; }
          50% { transform: translate(-14px,16px); opacity: 0.65; }
        }

        /* 封面文字（颜色/字体；尺寸/字重/间距由 Tailwind 控制） */
        /* 文字背后的渐变压暗层：让中文标题在花丛图片上清晰可读 */
        .gj-cover-text-veil {
          position: absolute; inset: 0;
          z-index: 1;
          background:
            radial-gradient(ellipse 60% 40% at 50% 42%, rgba(250,244,232,0.55) 0%, rgba(250,244,232,0) 70%);
          pointer-events: none;
        }
        [data-theme="night"] .gj-cover-text-veil {
          background:
            radial-gradient(ellipse 60% 40% at 50% 42%, rgba(20,28,24,0.5) 0%, rgba(20,28,24,0) 70%);
        }
        .gj-cover-title {
          font-family: "Noto Serif SC", Georgia, serif;
          color: #36533F;
          text-shadow: 0 2px 16px rgba(255,255,255,0.6), 0 0 24px rgba(255,250,240,0.3);
        }
        [data-theme="night"] .gj-cover-title {
          color: #E8F0E4;
          text-shadow: 0 2px 16px rgba(0,0,0,0.6), 0 0 24px rgba(200,230,180,0.15);
        }
        .gj-cover-sub {
          color: #9A958C;
        }
        [data-theme="night"] .gj-cover-sub { color: #9DB0A4; }
        .gj-cover-en {
          color: #9CA3AF;
          font-family: Georgia, "Times New Roman", serif;
        }
        [data-theme="night"] .gj-cover-en { color: #9CA3AF; }
        .gj-cover-hint {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          color: rgba(122,154,130,0.8);
          animation: gj-hint 2.6s ease-in-out infinite;
          white-space: nowrap;
        }
        [data-theme="night"] .gj-cover-hint { color: rgba(157,184,164,0.7); }
        @keyframes gj-hint {
          0%,100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }

        /* ===== 目录页 ===== */
        .gj-page-head { margin-bottom: 26px; }
        .gj-page-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 24px;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 6px;
          letter-spacing: 0.06em;
        }
        .gj-page-sub {
          font-family: Georgia, serif;
          font-size: 13px;
          font-style: italic;
          color: var(--text-soft);
          margin: 0;
          line-height: 1.95;
          letter-spacing: 0.04em;
        }

        .gj-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        @media (max-width: 640px) {
          .gj-grid { grid-template-columns: repeat(3, 1fr); gap: 11px; }
        }

        .gj-month-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 22px 10px 18px;
          border-radius: 14px;
          background: rgba(255,255,255,0.42);
          border: 1.5px solid rgba(180,160,120,0.22);
          cursor: pointer;
          transition: border-color 0.28s, box-shadow 0.28s, background 0.28s;
          overflow: visible;
        }
        [data-theme="night"] .gj-month-card {
          background: rgba(255,255,255,0.04);
          border-color: rgba(140,160,140,0.18);
        }
        .gj-month-card:hover {
          border-color: rgba(122,154,130,0.5);
          box-shadow: 0 8px 24px -6px rgba(60,80,60,0.18);
        }
        .gj-month-card.gj-current {
          border-color: rgba(122,154,130,0.7);
          background: rgba(122,154,130,0.1);
          box-shadow: 0 0 18px 2px rgba(122,154,130,0.22);
        }
        .gj-month-num {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 30px;
          font-weight: 700;
          color: var(--text);
          line-height: 1;
          margin-bottom: 8px;
        }
        .gj-current .gj-month-num { color: var(--accent); }
        .gj-month-theme {
          font-size: 12px;
          color: var(--text-soft);
          letter-spacing: 0.08em;
        }
        .gj-month-dot {
          position: absolute;
          top: 9px; right: 9px;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 6px 1px rgba(122,154,130,0.5);
        }
        .gj-month-today {
          position: absolute;
          top: 8px; left: 8px;
          font-size: 9px;
          letter-spacing: 0.1em;
          padding: 1px 6px;
          border-radius: 999px;
          background: var(--accent);
          color: #fff;
        }

        /* ===== 日记页 ===== */
        .gj-diary-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .gj-back-dir {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 12px;
          font-size: 12px;
          font-family: inherit;
          color: var(--text-soft);
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 999px;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .gj-back-dir:hover {
          color: var(--accent);
          border-color: var(--accent);
          background: rgba(122,154,130,0.06);
        }
        .gj-detail-theme {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: var(--accent);
          padding: 5px 16px;
          border-radius: 999px;
          background: rgba(122,154,130,0.1);
        }

        /* 引导语 */
        .gj-guidance {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px 16px 14px 18px;
          margin-bottom: 22px;
          border-radius: 12px;
          background: rgba(122,154,130,0.07);
          border-left: 3px solid var(--accent);
        }
        .gj-guidance-mark {
          color: var(--accent);
          margin-top: 2px;
          flex-shrink: 0;
        }
        .gj-guidance-text {
          font-family: Georgia, "Noto Serif SC", serif;
          font-size: 14px;
          font-style: italic;
          line-height: 1.7;
          color: var(--text);
          margin: 0;
          letter-spacing: 0.02em;
        }

        /* 左右两栏 */
        .gj-detail-body {
          display: flex;
          gap: 26px;
        }
        @media (max-width: 640px) {
          .gj-detail-body { flex-direction: column; gap: 18px; }
        }
        .gj-sidebar {
          flex: 0 0 150px;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        @media (max-width: 640px) {
          .gj-sidebar { flex: none; flex-direction: row; flex-wrap: wrap; gap: 16px; }
        }
        .gj-sidebar-label {
          font-size: 10px;
          color: var(--text-soft);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 7px;
        }
        .gj-sidebar-date {
          font-family: Georgia, "Noto Serif SC", serif;
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          line-height: 1.6;
        }

        /* 天气选择器 */
        .gj-weather-picker { display: flex; gap: 6px; }
        .gj-weather-btn {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid transparent;
          border-radius: 10px;
          background: rgba(255,255,255,0.5);
          color: var(--text-soft);
          cursor: pointer;
          transition: transform 0.2s, border-color 0.2s, color 0.2s, background 0.2s;
        }
        [data-theme="night"] .gj-weather-btn { background: rgba(255,255,255,0.06); }
        .gj-weather-btn:hover { transform: scale(1.12); color: var(--accent); }
        .gj-weather-btn.gj-weather-active {
          border-color: var(--accent);
          color: var(--accent);
          background: rgba(122,154,130,0.14);
        }

        /* 心情色环 */
        .gj-mood-picker { display: flex; gap: 9px; flex-wrap: wrap; }
        .gj-mood-dot {
          width: 26px; height: 26px;
          border-radius: 50%;
          border: 3px solid transparent;
          cursor: pointer;
          padding: 0;
          transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
        }
        .gj-mood-dot:hover { transform: scale(1.15); }
        .gj-mood-dot.gj-mood-active {
          transform: scale(1.35);
          border-color: #fff;
          box-shadow: 0 0 0 2px rgba(122,154,130,0.35), 0 0 14px 2px var(--gj-dot);
        }
        .gj-mood-hint {
          font-size: 11px;
          color: var(--text-soft);
          margin: 8px 0 0;
          letter-spacing: 0.04em;
          min-height: 14px;
        }

        /* 书写区 */
        .gj-writing { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .gj-textarea {
          width: 100%;
          min-height: 240px;
          border: none;
          border-radius: 12px;
          padding: 16px 18px;
          font-size: 15px;
          font-family: Georgia, "Noto Serif SC", serif;
          line-height: 1.9;
          color: var(--text);
          background: rgba(255,255,255,0.5);
          resize: vertical;
          outline: none;
          transition: box-shadow 0.3s;
        }
        [data-theme="night"] .gj-textarea { background: rgba(255,255,255,0.05); }
        .gj-textarea:focus { box-shadow: 0 0 0 3px rgba(122,154,130,0.16); }
        .gj-textarea::placeholder { color: var(--text-soft); opacity: 0.5; font-style: italic; }

        /* 保存区 */
        .gj-save-area {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 14px;
          margin-top: 20px;
          min-height: 44px;
        }
        .gj-save-feedback {
          font-family: Georgia, "Noto Serif SC", serif;
          font-size: 12px;
          font-style: italic;
          color: var(--accent);
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .gj-save-btn {
          padding: 10px 30px;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          border: none;
          border-radius: 6px;
          background: #FFF3C4;
          color: #5D4E37;
          cursor: pointer;
          box-shadow: 2px 3px 8px -2px rgba(0,0,0,0.14);
          transform: rotate(-2deg);
          transition: transform 0.2s, box-shadow 0.2s, background 0.3s, color 0.3s;
        }
        [data-theme="night"] .gj-save-btn {
          background: #3D3A2E;
          color: #E2D8C0;
          box-shadow: 2px 3px 8px -2px rgba(0,0,0,0.4);
        }
        .gj-save-btn:hover:not(:disabled) {
          transform: rotate(-1deg) translateY(-2px);
          box-shadow: 3px 5px 14px -2px rgba(0,0,0,0.2);
        }
        .gj-save-btn.gj-saved { background: #C8E6C9; color: #2E7D32; }
        [data-theme="night"] .gj-save-btn.gj-saved { background: #2D3A2E; color: #A5D6A7; }
        .gj-save-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: rotate(-2deg); }

        /* 历史记录 */
        .gj-month-history { margin-top: 26px; }
        .gj-month-history-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 12px;
          display: flex; align-items: center; gap: 8px;
        }
        .gj-month-history-count {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(122,154,130,0.14);
          color: var(--accent);
          font-weight: 400;
        }
        .gj-month-entry-list { display: flex; flex-direction: column; gap: 8px; }
        .gj-month-entry {
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.45);
          border: 1px solid var(--border);
          transition: border-color 0.2s;
        }
        [data-theme="night"] .gj-month-entry { background: rgba(255,255,255,0.04); }
        .gj-month-entry:hover { border-color: rgba(122,154,130,0.35); }
        .gj-month-entry-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 5px;
        }
        .gj-month-entry-date-row { display: flex; align-items: center; gap: 8px; }
        .gj-month-entry-date { font-size: 12px; color: var(--accent); font-weight: 500; }
        .gj-month-entry-weather { color: var(--text-soft); display: inline-flex; }
        .gj-month-entry-color-tag { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
        .gj-month-entry-delete {
          width: 22px; height: 22px;
          border: none; background: transparent;
          color: var(--text-soft); font-size: 18px;
          cursor: pointer; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, color 0.2s; opacity: 0;
        }
        .gj-month-entry:hover .gj-month-entry-delete { opacity: 1; }
        .gj-month-entry-delete:hover { background: rgba(217,119,87,0.12); color: #d97757; }
        .gj-month-entry-text {
          font-family: Georgia, "Noto Serif SC", serif;
          font-size: 13px; line-height: 1.75;
          color: var(--text-soft); margin: 0;
          white-space: pre-wrap; word-break: break-word;
        }

        /* ===== 合上书按钮（内页右下角固定） ===== */
        .gj-close-book {
          position: absolute;
          right: 24px; bottom: 22px;
          z-index: 5;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          font-size: 12px;
          font-family: inherit;
          letter-spacing: 0.06em;
          color: var(--text-soft);
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(180,160,120,0.3);
          border-radius: 999px;
          cursor: pointer;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          transition: color 0.22s, border-color 0.22s, background 0.22s, transform 0.22s;
        }
        [data-theme="night"] .gj-close-book {
          background: rgba(30,41,59,0.6);
          border-color: rgba(140,160,140,0.25);
        }
        .gj-close-book:hover {
          color: var(--accent);
          border-color: var(--accent);
          background: rgba(122,154,130,0.1);
          transform: translateY(-2px);
        }

        /* ===== 响应式 ===== */
        @media (max-width: 640px) {
          .gj-book { min-height: 520px; }
          .gj-page { min-height: 520px; }
          .gj-page-inner { padding: 26px 22px 76px 26px; }
          .gj-month-entry-delete { opacity: 1; }
          .gj-close-book { right: 16px; bottom: 16px; padding: 7px 13px; }
          /* 移动端降低动效幅度 */
          .gj-bokeh { animation-duration: 16s; }
        }

        @media (prefers-reduced-motion: reduce) {
          .gj-bokeh, .gj-cover-hint { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default GratitudeJournal;
