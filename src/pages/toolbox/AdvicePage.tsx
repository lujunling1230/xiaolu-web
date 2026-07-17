import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * 解忧杂货店 · The Advice Shop
 *
 * 杂货店门面背景 + 左下角绿色牛奶箱交互
 * 流程：写信 → 信纸飞入牛奶箱 → 浪矢爷爷回信 → 回信放入牛奶箱 → 点击牛奶箱查看回信
 * 开场动画：纯 CSS @keyframes，每次进入都播放
 */

/* ===== 类型 ===== */
interface Letter {
  id: number;
  content: string;
  reply: string;
  createdAt: string;
}

/* ===== localStorage ===== */
const STORAGE_KEY = "leafbook_letters";
const STICKIES = [
  "地图是一张白纸，其实很幸福。",
  "每个选择都改变命运。",
  "善意会穿越时空。",
  "心之所向，便是阳关大道。",
];
const loadLetters = (): Letter[] => {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : []; }
  catch { return []; }
};
const saveLetters = (ls: Letter[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(ls));
const formatTime = (ts: number) => {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}  ${p(d.getHours())}:${p(d.getMinutes())}`;
};

/* ===== 阶段 ===== */
type Phase =
  | "idle"          // 初始状态（等待点击牛奶箱）
  | "writing"       // 写信中
  | "inserting"     // 信纸飞入牛奶箱
  | "waiting"       // 等待浪矢爷爷回信
  | "reply-arrived" // 回信已放入牛奶箱（点击开箱）
  | "reading";      // 打开牛奶箱，查看回信

/* ===== 牛奶箱组件（日式绿色配送箱） ===== */
const MilkBox: React.FC<{
  isOpen: boolean;
  isGlow: boolean;
  isShake: boolean;
  onClick?: () => void;
}> = ({ isOpen, isGlow, isShake, onClick }) => (
  <button
    id="milk-box"
    className={`milk-box ${isOpen ? "open" : ""} ${isGlow ? "milk-box--glow" : ""} ${isShake ? "milk-box--shake" : ""}`}
    onClick={onClick}
    aria-label="牛奶箱"
  >
    {/* 挂墙支架 */}
    <div className="milk-mount" aria-hidden="true" />
    {/* 箱体主体 */}
    <div className="milk-body">
      {/* 上层：投递口区域 */}
      <div className="milk-upper">
        {/* 弧形挡雨板 / 翻盖 */}
        <div className="milk-rain-guard" />
        {/* 投递口 */}
        <div className="milk-slot-area">
          <div className="milk-slot" />
        </div>
      </div>
      {/* 分隔线 */}
      <div className="milk-divider" aria-hidden="true" />
      {/* 下层：储物门 */}
      <div className="milk-lower">
        <div className="milk-door">
          {/* 锁孔 */}
          <div className="milk-keyhole" aria-hidden="true" />
          {/* 标签贴纸 */}
          <div className="milk-sticker" aria-hidden="true">
            <span>MILK</span>
          </div>
        </div>
      </div>
    </div>
  </button>
);

/* ===== 小狗妙妙（解忧杂货店版） ===== */
const AdviceMiao: React.FC<{
  letterCount: number;
  isOpen: boolean;
  onClick?: () => void;
}> = ({ letterCount, isOpen, onClick }) => (
  <button
    className={`advice-miao ${isOpen ? "advice-miao--open" : ""} ${letterCount > 0 ? "advice-miao--has-mail" : ""}`}
    onClick={onClick}
    aria-label={isOpen ? "收起信件箱" : "打开信件箱"}
  >
    <svg viewBox="0 0 80 80" className="advice-miao-svg">
      {/* 身体 */}
      <ellipse cx="40" cy="52" rx="22" ry="20" fill="#F5E6D0" />
      {/* 头 */}
      <circle cx="40" cy="32" r="18" fill="#F5E6D0" />
      {/* 左耳 */}
      <ellipse cx="26" cy="20" rx="8" ry="12" fill="#E8D5BE" transform="rotate(-15 26 20)" />
      <ellipse cx="26" cy="22" rx="5" ry="8" fill="#F2C4B8" transform="rotate(-15 26 22)" />
      {/* 右耳 */}
      <ellipse cx="54" cy="20" rx="8" ry="12" fill="#E8D5BE" transform="rotate(15 54 20)" />
      <ellipse cx="54" cy="22" rx="5" ry="8" fill="#F2C4B8" transform="rotate(15 54 22)" />
      {/* 眼睛 */}
      <circle cx="33" cy="30" r="2.8" fill="#4A3C30" />
      <circle cx="47" cy="30" r="2.8" fill="#4A3C30" />
      {/* 眼睛高光 */}
      <circle cx="34.2" cy="29" r="1" fill="#fff" />
      <circle cx="48.2" cy="29" r="1" fill="#fff" />
      {/* 鼻子 */}
      <ellipse cx="40" cy="35.5" rx="2.2" ry="1.6" fill="#4A3C30" />
      {/* 嘴巴 — 有信时开心 */}
      {letterCount > 0 ? (
        <path d="M35 38 Q40 43 45 38" stroke="#4A3C30" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M36 38 Q40 41 44 38" stroke="#4A3C30" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      )}
      {/* 腮红 */}
      <circle cx="28" cy="35" r="3" fill="#F2B8A8" opacity="0.45" />
      <circle cx="52" cy="35" r="3" fill="#F2B8A8" opacity="0.45" />
      {/* 前爪 */}
      <ellipse cx="28" cy="64" rx="5" ry="4" fill="#E8D5BE" />
      <ellipse cx="52" cy="64" rx="5" ry="4" fill="#E8D5BE" />
      {/* 尾巴 */}
      {letterCount > 0 ? (
        <path d="M58 50 Q68 40 64 30" stroke="#E8D5BE" strokeWidth="4" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M58 50 Q65 55 60 62" stroke="#E8D5BE" strokeWidth="4" fill="none" strokeLinecap="round" />
      )}
      {/* 背上的信件标记（有信时） */}
      {letterCount > 0 && (
        <rect x="36" y="44" width="8" height="10" rx="1" fill="#F5F0E1" stroke="#D4A373" strokeWidth="0.8" />
      )}
    </svg>
    <span className="advice-miao-label">
      {letterCount > 0 ? `${letterCount} 封信` : "信件箱"}
    </span>
  </button>
);

/* ===== 主组件 ===== */
const AdvicePage: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [loading, setLoading] = useState(false);

  const [flyingLetter, setFlyingLetter] = useState(false);
  const [replyFlyingIn, setReplyFlyingIn] = useState(false);
  const [mailboxShake, setMailboxShake] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const [letters, setLetters] = useState<Letter[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const currentLetterIdRef = useRef<number | null>(null);
  const [btnPressed, setBtnPressed] = useState(false);

  /* 写信卡片 / 信件箱 显隐 */
  const [showLetterCard, setShowLetterCard] = useState(false);
  const [showLetterBox, setShowLetterBox] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* 公告板 */
  const [showAbout, setShowAbout] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setLetters(loadLetters()); }, []);

  /* 锁定视口高度，防止移动端地址栏变化导致 fixed 元素跳动 */
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, []);

  /* 开场动画结束后提示 */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (phase === "idle") {
        setToast("📬 点击牛奶箱，开始写信吧。");
        setTimeout(() => setToast(null), 3000);
      }
    }, 5500);
    return () => clearTimeout(timer);
  }, [phase]);

  /* 点击外部关闭 about */
  useEffect(() => {
    if (!showAbout) return;
    const handle = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setShowAbout(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [showAbout]);

  const toggleExpand = useCallback((id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  /* ===== 核心提交流程 ===== */
  const handleSubmit = async () => {
    if (!question.trim() || loading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const letterId = Date.now();
    const newLetter: Letter = {
      id: letterId, content: question.trim(), reply: "",
      createdAt: formatTime(letterId),
    };
    currentLetterIdRef.current = letterId;
    const updated = [newLetter, ...letters];
    saveLetters(updated);
    setLetters(updated);
    setReply(null);

    /* === 阶段1: 信纸飞入牛奶箱 === */
    setPhase("inserting");
    setFlyingLetter(true);
    await wait(600);
    setFlyingLetter(false);
    await wait(400);
    await wait(500);

    /* === 阶段2: 等待回信 === */
    setPhase("waiting");
    setLoading(true);

    const systemPrompt = `你是浪矢爷爷，一个温和、睿智、有些幽默感的老人。你在解忧杂货店里帮人解答烦恼。

【核心风格】
- 温暖包容：像长辈一样耐心倾听，不评判、不说教。
- 人生智慧：用简短的故事或比喻来传达观点，而不是直接给建议。
- 轻松幽默：偶尔带一点自嘲或轻松的调侃，让气氛不那么沉重。
- 简短精炼：一段话能说清的，绝不说两段。

【绝对禁止】
- 严禁提及"AI"、"模型"、"程序"、"代码"等技术词汇。
- 严禁在正文末尾添加署名、落款或破折号。
- 严禁使用括号进行动作描写。
- 严禁使用"建议"、"希望"、"首先"、"相信"等客服式词汇。
- 仅输出正文内容，正文结束后直接换行结束。

【示例】
用户："好饿，不知道吃什么。"
你回：
饿了的时候，最香的往往是那碗最简单的东西。去煮碗面吧，加个蛋，吃完告诉我味道如何。

用户："我工作太累了，想辞职去流浪。"
你回：
累了就歇歇，这没什么丢人的。今天先不急着做决定，去睡个好觉，明天醒来，答案自会来敲你的门。`;

    const apiKey = import.meta.env.VITE_API_KEY;
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const model = import.meta.env.VITE_MODEL;

    if (!baseUrl || !apiKey) {
      await wait(600);
      const fallback = "网有点卡，稍等一会儿呗。";
      setReply(fallback);
      afterReplyReady(fallback);
      return;
    }

    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: model || "deepseek-r1",
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: question }],
          stream: false,
        }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`接口返回 ${res.status}`);
      const data = await res.json();
      const fullText = data.choices?.[0]?.message?.content || "";
      if (!fullText) throw new Error("空回复");

      for (let i = 0; i < fullText.length; i++) { await wait(20); }
      setReply(fullText);
      afterReplyReady(fullText);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      const msg = error instanceof Error ? error.message : "未知错误";
      const errReply = `信还在路上…\n\n（${msg}）`;
      setReply(errReply);
      afterReplyReady(errReply);
    } finally {
      setLoading(false);
      abortRef.current = null;
      currentLetterIdRef.current = null;
    }
  };

  const afterReplyReady = (text: string) => {
    setPhase("reply-arrived");
    setReplyFlyingIn(true);
    (async () => {
      await wait(500);
      setReplyFlyingIn(false);
      await wait(300);
      await wait(200);
      setMailboxShake(true);
      await wait(500);
      setMailboxShake(false);
    })();
    updateLetterReply(text);
  };

  const openMailbox = () => {
    /* 有回信待读 → 打开阅读 */
    if (phase === "reply-arrived") {
      setPhase("reading");
      setTimeout(() => {
        setToast("📬 里面有一封回信！");
        setTimeout(() => setToast(null), 2500);
      }, 400);
      return;
    }
    /* 正在写信 / 等待中 → 提示 */
    if (phase === "writing" || phase === "waiting") {
      setToast("📬 你还有一封信没写完呢。");
      setTimeout(() => setToast(null), 2200);
      return;
    }
    /* idle 或 reading → 打开写信卡片 */
    if (phase === "idle" || phase === "reading") {
      setShowLetterCard(true);
      setPhase("writing");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 600);
    }
  };

  const closeAndReset = () => {
    setPhase("idle");
    setReply(null);
    setQuestion("");
    setReplyFlyingIn(false);
    setFlyingLetter(false);
    setShowLetterCard(false);
  };

  const updateLetterReply = (text: string) => {
    const lid = currentLetterIdRef.current;
    if (lid) {
      setLetters((prev) => {
        const u = prev.map((l) => (l.id === lid ? { ...l, reply: text } : l));
        saveLetters(u);
        return u;
      });
    }
  };

  const greeting = useMemo(
    () => ["夜安，旅人。", "嘿，我在听。", "别急，慢慢说。"][question.length % 3],
    [question.length]
  );

  return (
    <div className="advice-page">
      {/* ===== 开场动画（纯CSS @keyframes，每次进入都播放） ===== */}
      <div className="intro-overlay" aria-hidden="true">
        <div className="intro-backdrop" />
        <div className="intro-sign">
          <h1 className="intro-sign-title">解忧杂货店</h1>
          <p className="intro-sign-sub">Namiya's General Store</p>
        </div>
        <div className="intro-scene">
          <div className="intro-scene-mailbox" />
          <div className="intro-scene-board">
            <div className="intro-scene-note">
              <p className="intro-scene-note-text">欢迎来信，答案在你心里。</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 背景图 ===== */}
      <div className="advice-bg" aria-hidden="true" />
      <div className="advice-bg-overlay" aria-hidden="true" />

      {/* ===== 牛奶箱（左下角固定） ===== */}
      <MilkBox
        isOpen={phase === "reading"}
        isGlow={phase === "reply-arrived"}
        isShake={mailboxShake}
        onClick={openMailbox}
      />

      {/* ===== 公告板（右下角） ===== */}
      <div className="notice-board" ref={aboutRef}>
        <div className="notice-board-wood">
          <div className="notice-pin" />
          <div className="notice-sticky-list">
            {STICKIES.map((text, i) => (
              <div className="notice-sticky" key={i}>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <div className="notice-about-panel notice-about-panel--open">
            <div className="notice-about-content">
              <h3>关于这间店</h3>
              <p>人与人，因烦恼而相连。浪矢爷爷相信，每个咨询者心中早已有了答案，写信只是为了确认自己的选择。</p>
              <p>我们不过是在时间长河里，替你亮着一盏灯。愿这间杂货店，能接住你那些无处安放的迷茫，让你有勇气对自己说出那句——"我决定了"。</p>
              <p className="notice-about-sign">——致每一个写信的你</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 右下角便签式写信卡片（点击牛奶箱后出现） ===== */}
      <AnimatePresence>
        {showLetterCard && (
          <motion.section className="advice-letter" key="letter-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: phase === "writing" ? 1 : 0, y: 0, scale: phase === "inserting" ? 0.95 : 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}>
            <button type="button" className="advice-letter-close" onClick={closeAndReset} aria-label="合上信纸">x</button>
            <p className="advice-letter-greeting">{greeting}</p>
            <textarea className="advice-input" ref={inputRef}
              placeholder="写下你的烦恼，它会穿过时光找到答案……"
              value={question} rows={4}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
              disabled={phase !== "writing"}
            />
            <button type="button" className="advice-submit"
              onClick={handleSubmit}
              disabled={!question.trim() || loading}
              onMouseDown={() => setBtnPressed(true)}
              onMouseUp={() => setBtnPressed(false)}
              onMouseLeave={() => setBtnPressed(false)}
              style={{ transform: btnPressed ? "scale(0.96)" : undefined }}>
              <span className="advice-submit-icon">📮</span>
              <span>投入牛奶箱</span>
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ===== 顶栏 ===== */}
      <header className="advice-topbar">
        <Link to="/mickey" className="advice-back">
          <span style={{ marginRight: 4 }}>←</span> 回到妙妙工具箱
        </Link>
        <span className="advice-topbar-meta">The Advice Shop</span>
      </header>

      {/* ===== 标题区（隐藏，由开场动画 & 顶栏承担） ===== */}
      <section className="advice-hero" aria-hidden="true" style={{ visibility: 'hidden', height: 0, overflow: 'hidden', padding: 0, margin: 0 }}>
        <h1 className="advice-title">解忧杂货店</h1>
        <p className="advice-subtitle">总有人愿意花一夜，替你认真想一想。</p>
      </section>

      {/* ===== 主交互区（等待/回信提示/回信阅读/信件箱） ===== */}
      <div className="advice-main">
        {/* --- 信纸飞入牛奶箱（从右下角便签飞向左下角牛奶箱） --- */}
        <AnimatePresence>
          {flyingLetter && (
            <motion.div className="advice-flying-letter"
              initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
              animate={{ opacity: 1, x: "-55vw", y: "-5vh", scale: 0.5, rotate: -15 }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.8, ease: "easeIn" }}>
              <svg viewBox="0 0 40 50" width="40" height="50" aria-hidden="true">
                <rect x="2" y="2" width="36" height="46" rx="3" fill="#F5F0E1" stroke="#D4A373" strokeWidth="1" />
                <line x1="8" y1="12" x2="32" y2="12" stroke="#BCAAA4" strokeWidth="0.8" />
                <line x1="8" y1="20" x2="28" y2="20" stroke="#BCAAA4" strokeWidth="0.8" />
                <line x1="8" y1="28" x2="30" y2="28" stroke="#BCAAA4" strokeWidth="0.8" />
                <path d="M2 6 L20 22 L38 6" fill="none" stroke="#A1887F" strokeWidth="0.8" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- 等待回信 --- */}
        <AnimatePresence>
          {phase === "waiting" && (
            <motion.div className="advice-waiting"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}>
              <div className="advice-waiting-icon">
                <motion.span animate={{ rotate: [-3, 3, -3] }}
                  transition={{ duration: 1.2, repeat: Infinity }}>✒️</motion.span>
              </div>
              <p className="advice-waiting-text">浪矢爷爷正在认真回信…</p>
              <p className="advice-waiting-hint">请稍候，信件穿越时光中</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- 回信已到达提示 --- */}
        <AnimatePresence>
          {phase === "reply-arrived" && (
            <motion.div className="advice-arrived"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}>
              <p className="advice-arrived-text">回信已放入牛奶箱</p>
              <p className="advice-arrived-hint">点击左下角牛奶箱查看</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- 打开牛奶箱 → 阅读回信 --- */}
        <AnimatePresence>
          {phase === "reading" && reply && (
            <motion.section className="advice-reply" key="reply-card"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}>
              <button type="button" className="advice-reply-close" onClick={closeAndReset} aria-label="关闭回信">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <p className="advice-reply-dear">Dear 旅人：</p>
              <div className="advice-reply-text-wrap advice-reply-text-wrap--reveal">
                <p className="advice-reply-text">{reply}</p>
              </div>
              <p className="advice-reply-sign">—— 浪矢 · 解忧杂货店</p>
              <button type="button" className="advice-again" onClick={closeAndReset}>
                再写一封
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* 回信飞入动画 */}
      <AnimatePresence>
        {replyFlyingIn && (
          <motion.div className="advice-reply-flying"
            initial={{ opacity: 0, y: -60, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}>
            <svg viewBox="0 0 40 50" width="40" height="50" aria-hidden="true">
              <rect x="2" y="2" width="36" height="46" rx="3" fill="#F5F0E1" stroke="#D4A373" strokeWidth="1" />
              <line x1="8" y1="12" x2="32" y2="12" stroke="#BCAAA4" strokeWidth="0.8" />
              <line x1="8" y1="20" x2="28" y2="20" stroke="#BCAAA4" strokeWidth="0.8" />
              <line x1="8" y1="28" x2="30" y2="28" stroke="#BCAAA4" strokeWidth="0.8" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== 小狗妙妙（右下角，点击展开信件箱） ===== */}
      {letters.length > 0 && (
        <AdviceMiao
          letterCount={letters.length}
          isOpen={showLetterBox}
          onClick={() => setShowLetterBox(p => !p)}
        />
      )}

      {/* ===== 信件箱（历史记录，点击小狗展开） ===== */}
      {letters.length > 0 && showLetterBox && (
        <motion.section className="advice-letterbox"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}>
          <h2 className="advice-letterbox-title">
            <span className="advice-letterbox-title-icon" aria-hidden="true">📮</span>
            我的信件箱
            <span className="advice-letterbox-count">{letters.length} 封</span>
          </h2>
          <div className="advice-letterbox-list">
            {letters.map((letter) => {
              const isExpanded = expandedId === letter.id;
              const hasReply = letter.reply.length > 0;
              return (
                <div key={letter.id}
                  className={`advice-letterbox-item ${isExpanded ? "advice-letterbox-item--open" : ""}`}>
                  <button type="button" className="advice-letterbox-summary"
                    onClick={() => toggleExpand(letter.id)} aria-expanded={isExpanded}>
                    <span className="advice-letterbox-time">{letter.createdAt}</span>
                    <span className="advice-letterbox-preview">
                      {letter.content.slice(0, 36)}{letter.content.length > 36 ? "…" : ""}
                    </span>
                    <span className="advice-letterbox-status-wrap">
                      {hasReply && <span className="advice-letterbox-dot" aria-hidden="true" />}
                      <span className={`advice-letterbox-status ${hasReply ? "advice-letterbox-status--replied" : ""}`}>
                        {hasReply ? "已回复" : "等待中"}
                      </span>
                    </span>
                    <span className={`advice-letterbox-arrow ${isExpanded ? "advice-letterbox-arrow--open" : ""}`}>▸</span>
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div className="advice-letterbox-detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}>
                        <div className="advice-letterbox-detail-inner">
                          <div className="advice-letterbox-envelope">
                            <p className="advice-letterbox-label">你的信</p>
                            <p className="advice-letterbox-content">{letter.content}</p>
                          </div>
                          <div className="advice-letterbox-reply">
                            <p className="advice-letterbox-label">浪矢爷爷回信</p>
                            {hasReply
                              ? <p className="advice-letterbox-content">{letter.reply}</p>
                              : <p className="advice-letterbox-content advice-letterbox-content--pending">回信正在路上…</p>}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* ===== Toast 提示 ===== */}
      {toast && <div className="advice-toast">{toast}</div>}

      <style>{`
        /* ============================================================
           解忧杂货店 · 杂货店门面背景 + 左下角牛奶箱交互
           ============================================================ */

        .advice-page, .advice-page * { cursor: auto; }
        .advice-page button, .advice-page a { cursor: pointer; }
        .advice-page textarea { cursor: text; }

        /* ---------- 页面基础 ---------- */
        .advice-page {
          min-height: 100vh;
          color: #4E342E;
          background: #2A1B14;
          position: relative;
          font-family: "Noto Sans SC", system-ui, sans-serif;
          padding: 0 24px 80px;
          color-scheme: light;
        }

        /* ---------- z-index 层级 ---------- */
        .advice-page > *:not(.advice-bg):not(.advice-bg-overlay):not(.intro-overlay):not(.advice-letter):not(.advice-letterbox):not(.advice-topbar):not(.milk-box):not(.notice-board):not(.advice-miao) {
          position: relative; z-index: 2;
        }
        .advice-topbar {
          position: fixed !important; top: 16px; left: 16px; z-index: 50 !important;
          display: flex; align-items: center; gap: 12px;
          padding: 0;
        }
        .advice-hero, .advice-main { z-index: 2; position: relative; }

        /* ============================================================
           纯 CSS 3D 透视杂货店场景（三店铺并排）
           ============================================================ */
        /* ---------- 背景图（cover 铺满全屏） ---------- */
        .advice-bg {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: url('/advice-shop-bg-v2.jpg?v=1');
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          -webkit-background-size: cover;
          z-index: 0;
        }

        /* 轻微暗色叠加（保持原图明亮度） */
        .advice-bg-overlay {
          position: fixed; inset: 0;
          background: rgba(0, 0, 0, 0.12);
          z-index: 1;
          pointer-events: none;
        }

        .advice-page > *:not(.advice-bg):not(.advice-bg-overlay):not(.intro-overlay):not(.advice-letter):not(.advice-letterbox) {
          position: relative; z-index: 2;
        }
        .advice-topbar, .advice-hero, .advice-main { z-index: 2; position: relative; }

        /* ============================================================
           牛奶箱（做旧绿漆质感 · 左下角固定）
           ============================================================ */
        .milk-box {
          position: fixed !important;
          bottom: 15px;
          left: 35%;
          transform: translateX(-50%);
          z-index: 15 !important;
          cursor: pointer;
          border: none;
          background: none;
          padding: 0;
          outline: none;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.25s ease;
        }
        .milk-box:hover {
          transform: translateX(-50%) translateY(-2px);
        }

        /* --- 挂墙支架 --- */
        .milk-mount {
          position: absolute;
          top: -12px; left: 50%;
          transform: translateX(-50%);
          width: 40px; height: 16px;
          background: #5C4033;
          border-radius: 4px 4px 0 0;
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .milk-mount::after {
          content: "";
          position: absolute;
          bottom: -6px; left: 50%;
          transform: translateX(-50%);
          width: 20px; height: 12px;
          background: #4A3528;
          border-radius: 0 0 4px 4px;
        }

        /* --- 箱体主体（做旧绿漆 + 噪点 + 磨损） --- */
        .milk-body {
          position: relative;
          width: 189px; height: 215px;
          background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E"),
            linear-gradient(160deg, #5A8A38 0%, #4A7030 40%, #3A5C24 70%, #2E4A1C 100%);
          background-blend-mode: overlay, normal;
          border-radius: 6px 6px 4px 4px;
          box-shadow:
            0 6px 16px rgba(0,0,0,0.45),
            inset 0 -6px 12px rgba(0,0,0,0.5),
            inset 0 3px 8px rgba(255,255,255,0.2),
            inset 2px 0 8px rgba(0,0,0,0.15),
            inset -2px 0 8px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: box-shadow 0.25s ease;
          filter: brightness(0.92) contrast(1.08) saturate(0.85);
        }
        .milk-box:hover .milk-body {
          filter: brightness(0.95) contrast(1.06) saturate(0.88);
          box-shadow:
            0 8px 20px rgba(0,0,0,0.5),
            inset 0 -6px 12px rgba(0,0,0,0.5),
            inset 0 3px 8px rgba(255,255,255,0.2),
            inset 2px 0 8px rgba(0,0,0,0.15),
            inset -2px 0 8px rgba(0,0,0,0.1);
        }

        /* --- 上层：投递口区域 --- */
        .milk-upper {
          position: relative;
          height: 68px;
          background: linear-gradient(180deg, #5A8C3D 0%, #4A7C2F 100%);
        }

        /* 弧形挡雨板 */
        .milk-rain-guard {
          position: absolute;
          top: 0; left: -8px; right: -8px;
          height: 32px;
          background: linear-gradient(180deg, #6A9E4A 0%, #5A8C3D 100%);
          border-radius: 6px 6px 2px 2px;
          box-shadow:
            0 2px 4px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.15);
          transform-origin: bottom center;
          transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .milk-box.open .milk-rain-guard {
          transform: rotateX(-75deg);
        }

        /* 投递口 */
        .milk-slot-area {
          position: absolute;
          bottom: 0; left: 50%;
          transform: translateX(-50%);
          width: 90%; height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .milk-slot {
          width: 80px; height: 16px;
          background: #3A5C2A;
          border-radius: 0 0 6px 6px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.35);
        }

        /* --- 分隔线 --- */
        .milk-divider {
          height: 6px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(0,0,0,0.2) 10%,
            rgba(0,0,0,0.25) 50%,
            rgba(0,0,0,0.2) 90%,
            transparent 100%);
        }

        /* --- 下层：储物门 --- */
        .milk-lower {
          height: 126px;
          background: linear-gradient(180deg, #4A7C2F 0%, #3A5C2A 50%, #2D4A20 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* 储物门面板 */
        .milk-door {
          position: relative;
          width: 90%; height: 85%;
          background: linear-gradient(180deg, #3A5C2A 0%, #2D4A20 100%);
          border-radius: 3px;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.08),
            inset 0 -1px 0 rgba(0,0,0,0.15),
            0 1px 2px rgba(0,0,0,0.15);
        }

        /* 锁孔 */
        .milk-keyhole {
          position: absolute;
          top: 50%; left: 18%;
          transform: translateY(-50%);
          width: 12px; height: 20px;
          background: #1E3A25;
          border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.4);
        }

        /* MILK 标签 */
        .milk-sticker {
          position: absolute;
          top: 50%; right: 14%;
          transform: translateY(-50%);
          width: 44px; height: 32px;
          background: #F5F5F5;
          border-radius: 2px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .milk-sticker span {
          font-size: 10px;
          font-weight: 700;
          color: #222;
          letter-spacing: 0.02em;
          font-family: "Courier New", monospace;
          text-shadow: 0 0.5px 0.5px rgba(0,0,0,0.1);
          user-select: none;
        }

        /* --- 箱体底部阴影线 --- */
        .milk-body::after {
          content: "";
          position: absolute;
          bottom: 0; left: 0;
          width: 100%; height: 12px;
          background: linear-gradient(180deg, transparent, rgba(0,0,0,0.2));
          border-radius: 0 0 4px 4px;
          pointer-events: none;
        }

        .milk-box--glow {
          animation: mailbox-glow 1.5s ease-in-out infinite;
        }
        @keyframes mailbox-glow {
          0%, 100% { filter: drop-shadow(0 4px 12px rgba(255,220,160,0.2)); }
          50% { filter: drop-shadow(0 4px 20px rgba(255,220,160,0.5)); }
        }
        .milk-box--shake {
          animation: mailbox-shake 0.5s ease-in-out;
        }
        @keyframes mailbox-shake {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-5deg); }
          40% { transform: rotate(5deg); }
          60% { transform: rotate(-3deg); }
          80% { transform: rotate(3deg); }
        }

        /* 回信飞入 */
        .advice-reply-flying {
          position: fixed;
          bottom: 0; right: 25%;
          z-index: 55;
          pointer-events: none;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3));
        }

        /* ============================================================
           小狗妙妙（右下角信件箱入口）
           ============================================================ */
        .advice-miao {
          position: fixed;
          bottom: -368px;
          right: -1740px;
          z-index: 20;
          display: flex; flex-direction: column;
          align-items: center; gap: 4px;
          background: none; border: none; padding: 0;
          cursor: pointer; outline: none;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.2s ease;
        }
        .advice-miao:hover { transform: scale(1.08); }
        .advice-miao-svg {
          width: 56px; height: 56px;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.1));
        }
        .advice-miao--has-mail .advice-miao-svg {
          animation: advice-miao-idle 3s ease-in-out infinite;
        }
        @keyframes advice-miao-idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .advice-miao--open .advice-miao-svg {
          animation: advice-miao-wag 0.6s ease-in-out infinite;
        }
        @keyframes advice-miao-wag {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        .advice-miao-label {
          font-size: 10px; font-weight: 500; color: #8D6E63;
          text-align: center; white-space: nowrap;
          padding: 2px 8px; border-radius: 999px;
          background: rgba(255,248,232,0.9);
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          font-family: "Noto Sans SC", sans-serif;
        }

        /* ---------- Toast 提示 ---------- */
        .advice-toast {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          z-index: 100;
          padding: 12px 24px;
          border-radius: 12px;
          background: rgba(93,64,55,0.9);
          color: #FFCCBC;
          font-size: 14px;
          font-family: "Noto Serif SC", serif;
          letter-spacing: 0.04em;
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
          pointer-events: none;
          animation: advice-toast-in 0.3s ease-out;
        }
        @keyframes advice-toast-in {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        /* ---------- 信件箱（小狗触发，做旧牛皮纸风格） ---------- */
        .advice-letterbox {
          position: fixed;
          right: 90px;
          bottom: 130px;
          width: 300px;
          max-width: 40vw;
          max-height: 55vh;
          overflow-y: auto;
          z-index: 11;
          padding: 18px 20px;
          border-radius: 4px 10px 10px 6px;
          border: 1px solid rgba(160,136,127,0.35);
          background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E"),
            linear-gradient(160deg, #EDE0C8 0%, #E2D4B8 50%, #D8C8A8 100%);
          background-blend-mode: overlay;
          box-shadow:
            0 4px 16px rgba(0,0,0,0.2),
            inset 0 2px 8px rgba(0,0,0,0.12);
          scrollbar-width: thin;
          scrollbar-color: #BCAAA4 transparent;
        }
        .advice-letterbox::-webkit-scrollbar { width: 4px; }
        .advice-letterbox::-webkit-scrollbar-thumb { background: #BCAAA4; border-radius: 2px; }
        .advice-letterbox-title {
          display: flex; align-items: center; gap: 8px;
          font-family: "Ma Shan Zheng", "Noto Serif SC", serif;
          font-size: 16px; font-weight: 600; color: #5D4037;
          margin: 0 0 12px; letter-spacing: 0.05em;
        }
        .advice-letterbox-title-icon { font-size: 16px; }
        .advice-letterbox-count {
          font-size: 11px; font-weight: 400; color: #8D6E63;
          background: rgba(141,110,99,0.12);
          padding: 2px 8px; border-radius: 999px;
          margin-left: auto; font-family: "Noto Sans SC", sans-serif;
        }
        .advice-letterbox-list {
          display: flex; flex-direction: column; gap: 8px;
        }
        .advice-letterbox-item {
          border-radius: 10px; border-left: 3px solid #8D6E63;
          overflow: hidden;
          background: rgba(255,248,232,0.6);
          box-shadow: 0 1px 6px rgba(0,0,0,0.1);
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .advice-letterbox-item:hover {
          box-shadow: 0 3px 10px rgba(0,0,0,0.15);
          transform: translateY(-1px);
        }
        .advice-letterbox-item--open { box-shadow: 0 4px 14px rgba(0,0,0,0.18); }
        .advice-letterbox-summary {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 12px 16px;
          border: none; background: transparent;
          font-family: inherit; font-size: 13px;
          color: #5D4037; cursor: pointer;
          text-align: left; letter-spacing: 0.02em;
          transition: background 0.2s ease;
        }
        .advice-letterbox-summary:hover { background: rgba(93,64,55,0.05); }
        .advice-letterbox-time {
          font-size: 11px; color: #8D6E63;
          white-space: nowrap;
          font-family: "Noto Serif SC", serif;
        }
        .advice-letterbox-preview {
          flex: 1; min-width: 0;
          white-space: nowrap; overflow: hidden;
          text-overflow: ellipsis; color: #5D4037;
        }
        .advice-letterbox-status-wrap {
          display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;
        }
        .advice-letterbox-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #7a9e6b; display: inline-block;
        }
        .advice-letterbox-status { font-size: 11px; color: #BCAAA4; }
        .advice-letterbox-status--replied {
          color: #5D4037;
          background: #D7CCC8;
          padding: 1px 6px;
          border-radius: 4px;
        }
        .advice-letterbox-arrow {
          font-size: 10px; color: #A1887F;
          transition: transform 0.3s ease; display: inline-block;
        }
        .advice-letterbox-arrow--open { transform: rotate(90deg); }
        .advice-letterbox-detail { overflow: hidden; }
        .advice-letterbox-detail-inner {
          padding: 0 16px 14px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .advice-letterbox-envelope {
          padding: 10px 14px;
          background: rgba(245,240,225,0.6);
          border-radius: 8px;
          border: 1px dashed rgba(161,136,127,0.3);
        }
        .advice-letterbox-reply {
          padding: 10px 14px;
          background: rgba(245,240,225,0.8);
          border-radius: 8px;
          border-left: 2px solid #D4A373;
        }
        .advice-letterbox-label {
          font-size: 11px; color: #A1887F;
          margin: 0 0 8px; letter-spacing: 0.06em; font-weight: 500;
        }
        .advice-letterbox-content {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px; line-height: 1.8;
          color: #4E342E; margin: 0;
          letter-spacing: 0.02em; white-space: pre-wrap;
        }
        .advice-letterbox-content--pending {
          color: #BCAAA4; font-style: italic; font-family: inherit;
        }

        /* ============================================================
           公告板（融入右侧黄色木板 · 暖黄旧木牌）
           ============================================================ */
        .notice-board {
          position: fixed !important;
          left: 68%;
          bottom: 138px;
          z-index: 10 !important;
          width: 252px;height: 500px;
          opacity: 1;
          transition: all 0.3s ease;
        }

        /* ---------- 返回按钮与顶栏 ---------- */
        .advice-back {
          position: relative;
          font-size: 13px; color: rgba(255,204,188,0.85); text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.25s ease, transform 0.25s ease;
          display: inline-flex; align-items: center;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
          padding: 6px 12px;
          border-radius: 6px;
          background: rgba(0,0,0,0.25);
        }
        .advice-back:hover { color: #FFCCBC; transform: translateX(-3px); background: rgba(0,0,0,0.35); }
        .advice-topbar-meta {
          font-size: 10px; color: rgba(255,204,188,0.4);
          letter-spacing: 0.28em; text-transform: uppercase;
          text-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }

        /* ---------- 标题区 ---------- */
        .advice-hero {
          max-width: 560px; margin: 0 auto;
          padding: 24px 4px 28px; text-align: center;
        }
        .advice-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 24px; font-weight: 700;
          color: #FFCCBC; margin: 0 0 8px; letter-spacing: 0.1em;
          text-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        .advice-subtitle {
          font-size: 13px; color: rgba(188,170,164,0.8);
          margin: 0; letter-spacing: 0.06em;
          text-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }

        /* ---------- 主交互区 ---------- */
        .advice-main {
          max-width: 560px; margin: 0 auto;
          padding: 0 4vw;
        }

        /* ---------- 写信便签 ---------- */
        .advice-letter {
          position: fixed;
          left: 34%;
          bottom: 28%;
          transform: translateX(-50%) rotate(-1.5deg);
          width: 300px;
          max-width: 85vw;
          z-index: 20;
          padding: 18px 22px 20px;
          border-radius: 3px 12px 10px 4px;
          border: 1px solid rgba(180, 150, 60, 0.5);
          background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.0' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E"),
            linear-gradient(135deg, #FFF9C4 0%, #F5E76E 100%);
          background-blend-mode: overlay;
          opacity: 0.95;
          box-shadow:
            0 6px 16px rgba(0,0,0,0.12),
            0 1px 3px rgba(0,0,0,0.08);
          animation: sticky-note-appear 0.4s ease-out;
        }
        .advice-letter::before {
          content: "";
          position: absolute;
          top: -8px; left: 50%;
          margin-left: -5px;
          width: 10px; height: 16px;
          background: rgba(180,150,60,0.35);
          border-radius: 2px 2px 3px 3px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        @keyframes sticky-note-appear {
          from { opacity: 0; transform: translateX(-50%) translateY(8px) rotate(-3deg); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) rotate(-1.5deg); }
        }

        /* × 关闭按钮 */
        .advice-letter-close {
          position: absolute;
          top: -6px; right: -6px;
          width: 20px; height: 20px;
          border: none; background: none;
          font-size: 11px; color: #8D6E63;
          cursor: pointer; padding: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          transition: background 0.2s ease, color 0.2s ease;
          font-family: serif;
          line-height: 1;
          background: rgba(255,255,255,0.6);
          box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        }
        .advice-letter-close:hover { background: #fff; color: #5D4037; }

        .advice-letter-greeting {
          font-family: "Ma Shan Zheng", "Noto Serif SC", serif;
          font-size: 14px; color: #5D4037;
          margin: 0 0 10px; letter-spacing: 0.06em;
        }
        .advice-input {
          width: 100%; border: 1px solid rgba(180,150,60,0.3);
          border-radius: 4px;
          resize: none; outline: none;
          background: rgba(255,255,245,0.85);
          font-family: inherit;
          font-size: 13px; line-height: 1.8;
          color: #5D4037; letter-spacing: 0.02em;
          padding: 10px 12px;
          min-height: 100px;
          box-sizing: border-box;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .advice-input:focus {
          border-color: rgba(180,150,60,0.6);
          box-shadow: 0 0 0 3px rgba(245,235,170,0.3);
        }
        .advice-input::placeholder {
          color: rgba(93,64,55,0.35);
        }
        .advice-submit {
          display: inline-flex; align-items: center;
          justify-content: center; gap: 8px;
          width: 100%; margin-top: 20px;
          padding: 10px; border: 1px solid rgba(180,150,60,0.4); border-radius: 6px;
          font-size: 14px; font-family: inherit;
          font-weight: 500; letter-spacing: 0.06em;
          color: #5D4037; background: rgba(245,235,170,0.7);
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .advice-submit:hover:not(:disabled) {
          background: rgba(240,225,140,0.85); transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(0,0,0,0.12);
        }
        .advice-submit:disabled { opacity: 0.4; cursor: not-allowed; background: rgba(245,235,170,0.4); }
        .advice-submit-icon { display: inline-flex; align-items: center; }

        /* ---------- 信纸飞入动画 ---------- */
        .advice-flying-letter {
          position: fixed;
          right: 10%;
          bottom: 20%;
          z-index: 60;
          pointer-events: none;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        }

        /* ---------- 等待回复 ---------- */
        .advice-waiting {
          text-align: center;
          padding: 40px 0 20px;
        }
        .advice-waiting-icon {
          font-size: 28px; margin-bottom: 12px;
          display: inline-block;
        }
        .advice-waiting-text {
          font-family: "Noto Serif SC", serif;
          font-size: 13px; color: rgba(188,170,164,0.7);
          margin: 0; letter-spacing: 0.04em;
        }

        /* ---------- 回复信封 ---------- */
        .advice-arrived {
          text-align: center;
          padding: 30px 0;
        }
        .advice-arrived-text {
          font-family: "Ma Shan Zheng", serif;
          font-size: 16px; color: #FFCCBC; margin: 0 0 8px;
          text-shadow: 0 1px 6px rgba(0,0,0,0.3);
          letter-spacing: 0.04em;
        }
        .advice-reply {
          position: relative;
          padding: 28px 24px 52px; border-radius: 12px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.35);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .advice-reply-close {
          position: absolute; top: 14px; right: 14px; z-index: 3;
          width: 30px; height: 30px; border-radius: 50%;
          border: none; background: rgba(93,64,55,0.08);
          color: #8D6E63; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .advice-reply-close:hover { background: rgba(93,64,55,0.15); color: #5D4037; transform: rotate(90deg); }
        .advice-reply:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 36px rgba(0,0,0,0.4);
        }
        .advice-reply-text-wrap {
          overflow: hidden;
          clip-path: inset(0 100% 0 0);
          transition: clip-path 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .advice-reply-text-wrap--reveal { clip-path: inset(0 0% 0 0); }
        .advice-reply-dear {
          font-family: "Ma Shan Zheng", "Noto Serif SC", serif;
          font-size: 14px; color: #8D6E63;
          margin: 0 0 14px; letter-spacing: 0.04em;
        }
        .advice-reply-text {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px; line-height: 1.8;
          color: #4E342E; margin: 0 0 12px;
          letter-spacing: 0.02em; white-space: pre-wrap;
        }
        .advice-reply-sign {
          font-size: 12px; color: #A1887F;
          text-align: right; margin: 0 0 20px;
          font-style: italic; letter-spacing: 0.04em;
        }
        .advice-again {
          display: block; margin: 0 auto;
          padding: 6px 20px;
          border: 1px dashed rgba(180,150,60,0.4); border-radius: 999px;
          background: transparent; font-size: 12px; font-family: inherit;
          font-weight: 400; color: #8D6E63; letter-spacing: 0.05em;
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.2s ease;
        }
        .advice-again:hover {
          background: rgba(180,150,60,0.1); border-color: rgba(180,150,60,0.6);
          transform: translateY(-1px);
        }

        /* ---------- 投信箱 ---------- */
        .advice-letterbox {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 30;
          width: 280px;
          max-width: 85vw;
          max-height: 60vh;
          overflow-y: auto;
          border-radius: 10px;
          border: 1px solid rgba(180, 150, 60, 0.35);
          background: rgba(255, 249, 196, 0.92);
          box-shadow: 0 8px 28px rgba(0,0,0,0.15);
          padding: 20px;
          animation: sticky-note-appear 0.3s ease-out;
        }
        .advice-letterbox-summary {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(180,150,60,0.2);
          display: flex; flex-direction: column; gap: 10px;
        }
        .advice-letterbox-detail-inner {
          padding: 0 16px 16px;
        }
        .advice-letterbox-envelope,
        .advice-letterbox-reply {
          padding: 14px 16px;
          border-radius: 8px;
        }
        .advice-letterbox-close {
          position: absolute;
          top: -6px; right: -6px;
          width: 22px; height: 22px;
          border: none; background: rgba(255,255,255,0.7);
          border-radius: 50%;
          font-size: 12px; color: #8D6E63;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: background 0.2s ease;
        }
        .advice-letterbox-close:hover { background: #fff; }

        .notice-board-wood {
          background: rgba(245, 220, 120, 0.85);
          border: 1px solid rgba(100, 60, 20, 0.4);
          border-radius: 8px 12px 6px 10px;
          padding: 16px;
          mix-blend-mode: multiply;
          backdrop-filter: blur(0.5px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          position: relative;
        }
        .notice-pin {
          position: absolute; top: 8px; left: 50%;
          transform: translateX(-50%);
          width: 10px; height: 10px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #B71C1C, #8B0000);
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          z-index: 2;
        }
        .notice-sticky-list {
          display: flex; flex-direction: column; gap: 10px;
          margin-top: 8px;
          position: relative; z-index: 1;
        }
        .notice-sticky {
          background: rgba(255,250,235,0.75);
          padding: 10px 12px;
          border-radius: 3px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          position: relative;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: default;
        }
        .notice-sticky:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 8px rgba(0,0,0,0.15);
        }
        .notice-sticky:nth-child(1) { transform: rotate(-1.5deg); }
        .notice-sticky:nth-child(2) { transform: rotate(1deg); }
        .notice-sticky:nth-child(3) { transform: rotate(-0.5deg); }
        .notice-sticky:hover { transform: translateY(-2px) rotate(0deg); }
        .notice-sticky p {
          font-family: "Noto Serif SC", serif;
          font-size: 12px; line-height: 1.6;
          color: #5C3A21; margin: 0;
        }
        .notice-about-panel {
          margin-top: 10px;
        }
        .notice-about-content {
          padding-top: 12px;
          border-top: 1px dashed rgba(80,50,20,0.25);
          margin-top: 8px;
          position: relative; z-index: 1;
        }
        .notice-about-content h3 {
          font-family: "Noto Serif SC", serif;
          font-size: 13px; color: #5C3A21;
          margin: 0 0 10px; letter-spacing: 0.06em;
        }
        .notice-about-content p {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 12px; line-height: 1.8;
          color: #5C3A21; margin: 0 0 8px;
        }
        .notice-about-content .notice-about-sign {
          text-align: right; color: #5C3A21;
          font-style: italic; margin-top: 10px;
        }

        /* ============================================================
           开场动画（纯 CSS @keyframes，5秒，每次进入都播放）
           ============================================================ */
        .intro-overlay {
          position: fixed; inset: 0; z-index: 100;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          pointer-events: none;
        }
        .intro-backdrop {
          position: absolute; inset: 0;
          background: rgba(42, 27, 20, 0.85);
          animation: intro-backdrop-fade 5s ease-out forwards;
        }
        @keyframes intro-backdrop-fade {
          0% { opacity: 1; }
          60% { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }
        .intro-sign {
          position: relative; z-index: 1;
          text-align: center;
          animation: intro-sign-show 5s ease-out forwards;
        }
        @keyframes intro-sign-show {
          0% { opacity: 0; transform: scale(0.9); }
          15% { opacity: 1; transform: scale(1); }
          60% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-20px); pointer-events: none; }
        }
        .intro-sign-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 42px; font-weight: 700;
          color: #F5E6D0; margin: 0 0 8px;
          letter-spacing: 0.08em;
          text-shadow: 0 2px 12px rgba(0,0,0,0.4);
        }
        .intro-sign-sub {
          font-size: 14px; color: #D4A373;
          letter-spacing: 0.15em; margin: 0;
          text-transform: uppercase;
        }
        .intro-scene {
          position: relative; z-index: 1;
          display: flex; align-items: flex-end; gap: 24px;
          margin-top: 40px;
          animation: intro-scene-slide 5s ease-out forwards;
        }
        @keyframes intro-scene-slide {
          0% { opacity: 0; transform: translateY(30px); }
          20% { opacity: 1; transform: translateY(0); }
          60% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-10px); pointer-events: none; }
        }
        .intro-scene-mailbox {
          width: 48px; height: 64px;
          background: linear-gradient(180deg, #5A8A38, #3A5C24);
          border-radius: 4px 4px 2px 2px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          position: relative;
        }
        .intro-scene-mailbox::before {
          content: "";
          position: absolute; top: 8px; left: 50%;
          transform: translateX(-50%);
          width: 60%; height: 6px;
          background: #2D4A20;
          border-radius: 3px;
        }
        .intro-scene-board {
          width: 140px; height: 90px;
          background: rgba(245, 220, 120, 0.85);
          border: 1px solid rgba(100, 60, 20, 0.4);
          border-radius: 4px;
          padding: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          display: flex; align-items: center; justify-content: center;
        }
        .intro-scene-note {
          background: rgba(255,250,235,0.8);
          padding: 6px 10px;
          border-radius: 2px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          transform: rotate(-2deg);
        }
        .intro-scene-note-text {
          font-family: "Noto Serif SC", serif;
          font-size: 11px; color: #5C3A21;
          margin: 0; white-space: nowrap;
        }

        /* ---------- 响应式（手机竖屏） ---------- */
        @media (max-width: 768px) {
          .advice-page { padding: 0 0 60px; }
          .advice-topbar { top: 12px; left: 12px; }
          .advice-hero { padding: 0; height: 0; }
          .advice-main { padding: 0 4vw; }
          .advice-miao-svg { width: 48px; height: 48px; }
          .advice-miao-label { font-size: 9px; }
          .advice-reply { padding: 16px; padding-bottom: 48px; }

          /* 背景图：底部对齐，确保牛奶箱和公告板可见 */
          .advice-bg { background-position: center bottom; }

          /* 写信便签 */
          .advice-letter {
            left: 50%;
            bottom: 35%;
            transform: translateX(-50%) rotate(-1deg);
            width: 85vw;
            max-width: 340px;
            padding: 16px 18px;
          }
          .advice-letter-greeting { font-size: 14px; margin-bottom: 10px; }
          .advice-input { font-size: 13px; padding: 8px 10px; }
          .advice-submit { padding: 14px; min-height: 44px; }
          .advice-letterbox {
            right: 12px;
            bottom: 80px;
            width: 88%;
            max-width: 330px;
            max-height: 50vh;
            padding: 16px;
          }
          .advice-letterbox-summary { padding: 12px 14px; gap: 8px; }
          .advice-letterbox-detail-inner { padding: 0 14px 14px; }
          .advice-letterbox-envelope,
          .advice-letterbox-reply { padding: 12px; }

          /* 牛奶箱：移动端底部定位 */
          .milk-box { bottom: 8%; left: 28%; }
          .milk-body { width: 86px; height: 108px; }
          .milk-upper { height: 54px; }
          .milk-rain-guard { height: 24px; left: -6px; right: -6px; }
          .milk-lower { height: 98px; }
          .milk-divider { height: 4px; }
          .milk-sticker { width: 34px; height: 24px; }
          .milk-sticker span { font-size: 8px; }

          /* 公告板：移动端右侧底部 */
          .notice-board { left: auto; right: 4%; bottom: 12%; width: 180px; height: auto; }
          .advice-miao { bottom: 8px; right: 16px; }
          .notice-board-wood { padding: 12px; }
          .intro-sign-title { font-size: 28px; }
          .intro-scene-mailbox { width: 36px; height: 48px; }
          .intro-scene-board { width: 100px; height: 65px; }
        }
        @media (min-width: 769px) {
          .advice-letter, .advice-reply, .advice-letterbox {
            margin-left: auto; margin-right: auto;
          }
        }
      `}</style>
    </div>
  );
};

function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export default AdvicePage;
