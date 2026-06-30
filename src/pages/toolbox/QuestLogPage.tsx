import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * 通关清单 · Quest Log
 *
 * 游戏化 To-Do —— 把人生变成一场 RPG。
 * 智能拆解降低启动阻力，完成时粒子爆炸 + 金币音效提供即时爽感。
 * 数据持久化于 localStorage（key: quest_log_data）。
 */

/* ============================================================
   类型与常量
   ============================================================ */
type Difficulty = "easy" | "normal" | "hard";

interface Quest {
  id: string;
  text: string;
  difficulty: Difficulty;
  completed: boolean;
  /** "5分钟挑战"倒计时模式：剩余秒数 */
  countdown?: number;
}

const STORAGE_KEY = "quest_log_data";
const XP_PER_LEVEL = 100;
// 各难度完成后获得的经验值
const XP_REWARD: Record<Difficulty, number> = { easy: 15, normal: 30, hard: 50 };

const DIFF_LABEL: Record<Difficulty, string> = {
  easy: "及格线",
  normal: "常规",
  hard: "挑战",
};

const DIFF_COLOR: Record<Difficulty, string> = {
  easy: "#34d399", // 柠檬绿
  normal: "#60a5fa", // 电光蓝
  hard: "#f472b6", // 霓虹粉
};

/* ============================================================
   工具函数
   ============================================================ */
function cn(...c: (string | false | null | undefined)[]): string {
  return c.filter(Boolean).join(" ");
}

function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadQuests(): Quest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_QUESTS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_QUESTS;
    return parsed as Quest[];
  } catch {
    return DEFAULT_QUESTS;
  }
}

function loadXP(): number {
  try {
    const raw = localStorage.getItem("quest_log_xp");
    return raw ? Math.max(0, Number(raw) || 0) : 0;
  } catch {
    return 0;
  }
}

/* 预设数据 */
const DEFAULT_QUESTS: Quest[] = [
  { id: "q1", text: "读完 10 页书", difficulty: "easy", completed: false },
  { id: "q2", text: "搞定周报初稿", difficulty: "hard", completed: false },
  { id: "q3", text: "喝一杯水", difficulty: "easy", completed: true },
];

/* ============================================================
   Web Audio：合成"金币/消除"音效
   ============================================================ */
let audioCtx: AudioContext | null = null;
const playCoinSound = () => {
  try {
    if (!audioCtx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioCtx = new Ctor();
    }
    const ctx = audioCtx;
    const now = ctx.currentTime;
    // 两段升频方波，模拟经典金币音 B5→E6
    [
      { f: 988, t: 0 }, // B5
      { f: 1319, t: 0.08 }, // E6
    ].forEach(({ f, t }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.18, now + t);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + 0.18);
    });
  } catch {
    /* 静音处理 */
  }
};

/* ============================================================
   粒子数据
   ============================================================ */
interface Particle {
  id: number;
  dx: number;
  dy: number;
  color: string;
}

const PARTICLE_COLORS = [
  "#f472b6", // 霓虹粉
  "#60a5fa", // 电光蓝
  "#fde047", // 柠檬黄
  "#34d399", // 绿
  "#c084fc", // 紫
];

/* ============================================================
   子组件：XP 经验条
   ============================================================ */
const XpBar: React.FC<{ xp: number }> = ({ xp }) => {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const currentLevelXP = xp % XP_PER_LEVEL;
  const pct = (currentLevelXP / XP_PER_LEVEL) * 100;

  return (
    <div className="quest-xp-wrap">
      <div className="quest-xp-head">
        <span className="quest-level-badge">Lv.{level}</span>
        <span className="quest-xp-text">
          {currentLevelXP} / {XP_PER_LEVEL} XP
        </span>
      </div>
      <div className="quest-xp-track">
        <motion.div
          className="quest-xp-fill"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        />
      </div>
    </div>
  );
};

/* ============================================================
   子组件：任务项（含粒子爆炸）
   ============================================================ */
const QuestItem: React.FC<{
  quest: Quest;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ quest, onComplete, onDelete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [exiting, setExiting] = useState(false);
  const [displayCountdown, setDisplayCountdown] = useState<number | undefined>(
    quest.countdown
  );

  // 5分钟倒计时模式：每秒递减，归零自动完成
  useEffect(() => {
    if (quest.completed || displayCountdown === undefined) return;
    if (displayCountdown <= 0) {
      onComplete(quest.id);
      return;
    }
    const t = window.setTimeout(
      () => setDisplayCountdown((v) => (v ?? 1) - 1),
      1000
    );
    return () => window.clearTimeout(t);
  }, [displayCountdown, quest.completed, quest.id, onComplete]);

  const handleComplete = () => {
    playCoinSound();
    // 生成粒子
    const ps: Particle[] = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      dx: (Math.random() - 0.5) * 180,
      dy: (Math.random() - 0.5) * 160 - 40,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    }));
    setParticles(ps);
    setExiting(true);
    // 粒子动画后真正完成
    window.setTimeout(() => onComplete(quest.id), 600);
  };

  const isCounting = displayCountdown !== undefined && !quest.completed;
  const mm = displayCountdown !== undefined ? Math.floor(displayCountdown / 60) : 0;
  const ss = displayCountdown !== undefined ? displayCountdown % 60 : 0;

  return (
    <motion.li
      className={cn("quest-item", quest.completed && "quest-item-done")}
      layout
      exit={{ opacity: 0, x: 60, scale: 0.8, transition: { duration: 0.35 } }}
    >
      {/* 粒子层 */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="quest-particle"
            style={{ background: p.color }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: p.dx, y: p.dy, scale: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* 难度标签 */}
      <span
        className="quest-diff-tag"
        style={{ color: DIFF_COLOR[quest.difficulty], borderColor: DIFF_COLOR[quest.difficulty] }}
      >
        {DIFF_LABEL[quest.difficulty]}
      </span>

      {/* 文案 */}
      <span className="quest-text">
        {quest.text}
        {isCounting && (
          <span className="quest-countdown">
            {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
          </span>
        )}
      </span>

      {/* 操作 */}
      <div className="quest-actions">
        {!quest.completed && (
          <button
            type="button"
            className="quest-btn-complete"
            onClick={handleComplete}
            disabled={exiting}
          >
            完成
          </button>
        )}
        <button
          type="button"
          className="quest-btn-del"
          onClick={() => onDelete(quest.id)}
        >
          ✕
        </button>
      </div>
    </motion.li>
  );
};

/* ============================================================
   子组件：智能拆解 Modal
   ============================================================ */
const BreakdownModal: React.FC<{
  text: string;
  onPick: (mode: "five" | "pass" | "direct") => void;
}> = ({ text, onPick }) => (
  <motion.div
    className="quest-modal-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={() => onPick("direct")}
  >
    <motion.div
      className="quest-modal"
      initial={{ scale: 0.85, y: 30 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.85, y: 30 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      onClick={(e) => e.stopPropagation()}
    >
      <p className="quest-modal-title">这个任务看起来有点难</p>
      <p className="quest-modal-sub">「{text}」</p>
      <p className="quest-modal-ask">要不要拆解一下？</p>

      <div className="quest-modal-options">
        <button className="quest-modal-opt" onClick={() => onPick("five")}>
          <span className="quest-modal-opt-icon">⏱️</span>
          <span className="quest-modal-opt-label">先做 5 分钟</span>
          <span className="quest-modal-opt-desc">倒计时自动完成</span>
        </button>
        <button className="quest-modal-opt" onClick={() => onPick("pass")}>
          <span className="quest-modal-opt-icon">🎯</span>
          <span className="quest-modal-opt-label">只要 60 分</span>
          <span className="quest-modal-opt-desc">标为及格线，低难度</span>
        </button>
        <button className="quest-modal-opt" onClick={() => onPick("direct")}>
          <span className="quest-modal-opt-icon">⚔️</span>
          <span className="quest-modal-opt-label">直接挑战</span>
          <span className="quest-modal-opt-desc">原样添加</span>
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ============================================================
   主组件
   ============================================================ */
const QuestLogPage: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>(() => loadQuests());
  const [xp, setXp] = useState<number>(() => loadXP());
  const [input, setInput] = useState("");
  // 智能拆解：待处理的新任务文本
  const [pending, setPending] = useState<string | null>(null);

  // 持久化
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quests));
    } catch {
      /* ignore */
    }
  }, [quests]);

  useEffect(() => {
    try {
      localStorage.setItem("quest_log_xp", String(xp));
    } catch {
      /* ignore */
    }
  }, [xp]);

  // 完成回调（供 QuestItem 倒计时归零与点击完成共用）
  const handleComplete = (id: string) => {
    setQuests((prev) => {
      const target = prev.find((q) => q.id === id);
      if (target && !target.completed) {
        setXp((x) => x + XP_REWARD[target.difficulty]);
      }
      return prev.filter((q) => q.id !== id);
    });
  };

  const handleDelete = (id: string) => {
    setQuests((prev) => prev.filter((q) => q.id !== id));
  };

  const handleAdd = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    // 弹出智能拆解
    setPending(text);
  };

  const handlePick = (mode: "five" | "pass" | "direct") => {
    if (!pending) return;
    const base: Quest = {
      id: genId(),
      text: pending,
      difficulty: "hard",
      completed: false,
    };
    if (mode === "five") {
      base.difficulty = "normal";
      base.countdown = 300; // 5 分钟
      base.text = `${pending}（5分钟挑战）`;
    } else if (mode === "pass") {
      base.difficulty = "easy";
      base.text = `${pending}（及格线）`;
    }
    setQuests((prev) => [base, ...prev]);
    setPending(null);
  };

  // 统计
  const stats = useMemo(() => {
    const done = quests.filter((q) => q.completed).length;
    const active = quests.length - done;
    return { done, active, total: quests.length };
  }, [quests]);

  return (
    <div className="quest-page">
      {/* 顶部返回 */}
      <header className="quest-topbar">
        <Link to="/mickey" className="quest-back">
          ← 回到妙妙屋
        </Link>
        <span className="quest-topbar-meta">Quest Log</span>
      </header>

      {/* 玩家状态 */}
      <section className="quest-status">
        <XpBar xp={xp} />
        <div className="quest-stats-pills">
          <span className="quest-pill">⚔️ 进行中 {stats.active}</span>
          <span className="quest-pill quest-pill-done">✓ 已通关 {stats.done}</span>
        </div>
      </section>

      {/* 标题 */}
      <div className="quest-title-area">
        <h1 className="quest-title">通关清单</h1>
        <p className="quest-subtitle">把人生变成一场 RPG。</p>
      </div>

      {/* 任务列表 */}
      <section className="quest-list-section">
        {quests.length === 0 ? (
          <div className="quest-empty">
            <span className="quest-empty-icon">🎮</span>
            <p>还没有任务，输入一个开启冒险吧！</p>
          </div>
        ) : (
          <ul className="quest-list">
            <AnimatePresence>
              {quests.map((q) => (
                <QuestItem
                  key={q.id}
                  quest={q}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>

      {/* 底部输入框 */}
      <div className="quest-input-bar">
        <input
          className="quest-input"
          type="text"
          placeholder="输入新任务，按回车开始冒险…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
        />
        <button
          type="button"
          className="quest-add-btn"
          onClick={handleAdd}
          disabled={!input.trim()}
        >
          添加
        </button>
      </div>

      {/* 智能拆解 Modal */}
      <AnimatePresence>
        {pending && (
          <BreakdownModal text={pending} onPick={handlePick} />
        )}
      </AnimatePresence>

      <style>{`
        .quest-page,
        .quest-page * { cursor: auto; }
        .quest-page button,
        .quest-page a { cursor: pointer; }
        .quest-page input { cursor: text; }

        .quest-page {
          min-height: 100vh;
          color: #f3f4f6;
          background:
            radial-gradient(120% 80% at 50% -10%, #1f2937 0%, #111827 50%, #0b0f1a 100%);
          font-family: "Noto Sans SC", system-ui, sans-serif;
          padding: 0 20px 120px;
        }

        /* 顶部 */
        .quest-topbar {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 720px; margin: 0 auto; padding: 22px 4px 0;
        }
        .quest-back {
          font-size: 14px; color: #9ca3af; text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease, transform 0.25s ease;
        }
        .quest-back:hover { color: #fde047; transform: translateX(-3px); }
        .quest-topbar-meta {
          font-size: 11px; color: #4b5563; letter-spacing: 0.28em; text-transform: uppercase;
        }

        /* 玩家状态 */
        .quest-status {
          max-width: 720px; margin: 0 auto; padding: 32px 4px 0;
        }
        .quest-xp-wrap { margin-bottom: 14px; }
        .quest-xp-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 8px;
        }
        .quest-level-badge {
          font-weight: 700; font-size: 15px; color: #fde047;
          padding: 2px 10px; border-radius: 6px;
          background: rgba(253, 224, 71, 0.12);
          border: 1px solid rgba(253, 224, 71, 0.3);
        }
        .quest-xp-text { font-size: 12px; color: #9ca3af; letter-spacing: 0.05em; }
        .quest-xp-track {
          height: 10px; border-radius: 999px; overflow: hidden;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.06);
        }
        .quest-xp-fill {
          height: 100%; border-radius: 999px;
          background: linear-gradient(90deg, #f472b6, #fde047, #34d399);
          box-shadow: 0 0 12px rgba(253, 224, 71, 0.5);
        }
        .quest-stats-pills { display: flex; gap: 10px; }
        .quest-pill {
          font-size: 12px; color: #d1d5db; padding: 4px 12px; border-radius: 999px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
        }
        .quest-pill-done { color: #34d399; border-color: rgba(52, 211, 153, 0.3); }

        /* 标题 */
        .quest-title-area { max-width: 720px; margin: 0 auto; padding: 28px 4px 20px; }
        .quest-title {
          font-size: 26px; font-weight: 800; color: #fff; margin: 0 0 6px;
          letter-spacing: 0.04em;
        }
        .quest-subtitle { font-size: 13px; color: #9ca3af; margin: 0; }

        /* 任务列表 */
        .quest-list-section { max-width: 720px; margin: 0 auto; }
        .quest-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .quest-item {
          position: relative; display: flex; align-items: center; gap: 12px;
          padding: 14px 16px; border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: background 0.2s ease;
        }
        .quest-item:hover { background: rgba(255,255,255,0.07); }
        .quest-item-done { opacity: 0.5; }

        .quest-diff-tag {
          flex-shrink: 0; font-size: 11px; font-weight: 600;
          padding: 2px 8px; border-radius: 6px; border: 1px solid;
          background: rgba(0,0,0,0.2);
        }
        .quest-text { flex: 1; font-size: 14px; color: #f3f4f6; }
        .quest-countdown {
          margin-left: 8px; font-variant-numeric: tabular-nums;
          color: #fde047; font-weight: 700;
        }
        .quest-actions { display: flex; gap: 8px; flex-shrink: 0; }
        .quest-btn-complete {
          font-size: 13px; font-weight: 600; color: #059669;
          padding: 5px 14px; border-radius: 8px; border: none;
          background: linear-gradient(135deg, #34d399, #10b981);
          color: #06281f;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .quest-btn-complete:hover:not(:disabled) {
          transform: scale(1.08); box-shadow: 0 0 14px rgba(52, 211, 153, 0.6);
        }
        .quest-btn-complete:disabled { opacity: 0.5; }
        .quest-btn-del {
          font-size: 13px; color: #6b7280; background: none; border: none;
          padding: 4px 6px; transition: color 0.2s ease;
        }
        .quest-btn-del:hover { color: #f87171; }

        /* 粒子 */
        .quest-particle {
          position: absolute; left: 50%; top: 50%;
          width: 8px; height: 8px; border-radius: 50%;
          pointer-events: none; z-index: 10;
        }

        /* 空状态 */
        .quest-empty {
          text-align: center; padding: 48px 0; color: #6b7280;
        }
        .quest-empty-icon { font-size: 40px; display: block; margin-bottom: 12px; }

        /* 输入栏（固定底部） */
        .quest-input-bar {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 40;
          display: flex; gap: 10px; padding: 14px 20px;
          max-width: 720px; margin: 0 auto;
          background: rgba(17, 24, 39, 0.85);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .quest-input {
          flex: 1; padding: 11px 16px; border-radius: 10px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          color: #fff; font-size: 14px; font-family: inherit; outline: none;
          transition: border-color 0.2s ease;
        }
        .quest-input::placeholder { color: #6b7280; }
        .quest-input:focus { border-color: #fde047; }
        .quest-add-btn {
          padding: 11px 22px; border-radius: 10px; border: none;
          font-size: 14px; font-weight: 600; font-family: inherit;
          color: #06281f;
          background: linear-gradient(135deg, #fde047, #f59e0b);
          transition: transform 0.15s ease, opacity 0.2s ease;
        }
        .quest-add-btn:hover:not(:disabled) { transform: scale(1.05); }
        .quest-add-btn:disabled { opacity: 0.4; }

        /* Modal */
        .quest-modal-overlay {
          position: fixed; inset: 0; z-index: 100;
          display: flex; align-items: center; justify-content: center; padding: 24px;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
        }
        .quest-modal {
          width: 100%; max-width: 420px; padding: 28px 26px;
          border-radius: 18px;
          background: linear-gradient(160deg, #1f2937, #111827);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 24px 64px -16px rgba(0,0,0,0.6);
        }
        .quest-modal-title { font-size: 17px; font-weight: 700; color: #fff; margin: 0 0 6px; }
        .quest-modal-sub { font-size: 14px; color: #fde047; margin: 0 0 4px; }
        .quest-modal-ask { font-size: 13px; color: #9ca3af; margin: 0 0 20px; }
        .quest-modal-options { display: flex; flex-direction: column; gap: 10px; }
        .quest-modal-opt {
          display: flex; align-items: center; gap: 12px; text-align: left;
          padding: 14px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04); transition: background 0.2s ease, border-color 0.2s ease;
        }
        .quest-modal-opt:hover { background: rgba(255,255,255,0.09); border-color: rgba(253, 224, 71, 0.4); }
        .quest-modal-opt-icon { font-size: 22px; }
        .quest-modal-opt-label { font-size: 14px; font-weight: 600; color: #f3f4f6; flex: 1; }
        .quest-modal-opt-desc { font-size: 11px; color: #9ca3af; }

        @media (max-width: 480px) {
          .quest-modal-opt-desc { display: none; }
        }
      `}</style>
    </div>
  );
};

export default QuestLogPage;
