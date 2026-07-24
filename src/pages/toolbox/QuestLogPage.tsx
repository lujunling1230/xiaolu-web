import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { track } from "../../utils/track";
import { legacyLoad, legacySave } from "../../utils/siteData";
import { useAdminGuard } from "../../hooks/useAdminGuard";

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
const XP_KEY = "quest_log_xp";
const XP_PER_LEVEL = 100;
// 各难度完成后获得的经验值（风险越高、收益越高）
const XP_REWARD: Record<Difficulty, number> = { easy: 5, normal: 60, hard: 100 };

const DIFF_LABEL: Record<Difficulty, string> = {
  easy: "先做 5 分钟",
  normal: "只要 60 分",
  hard: "直接挑战",
};

const DIFF_COLOR: Record<Difficulty, string> = {
  easy: "#4CAF50",   // 绿色
  normal: "#FFC107", // 黄色
  hard: "#F44336",   // 红色
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
  return legacyLoad<Quest[]>(STORAGE_KEY, DEFAULT_QUESTS) || DEFAULT_QUESTS;
}

function loadXP(): number {
  const raw = legacyLoad<string>(XP_KEY, "0");
  return raw ? Math.max(0, Number(raw) || 0) : 0;
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
      { f: 988, t: 0 },   // B5
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
   子组件：编辑任务模态框
   ============================================================ */
const EditModal: React.FC<{
  quest: Quest;
  onSave: (updated: Quest) => void;
  onClose: () => void;
}> = ({ quest, onSave, onClose }) => {
  const [text, setText] = useState(quest.text);
  const [difficulty, setDifficulty] = useState<Difficulty>(quest.difficulty);

  const canSave = text.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ ...quest, text: text.trim(), difficulty });
  };

  return (
    <motion.div
      className="quest-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="quest-modal quest-edit-modal"
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="quest-modal-title">编辑任务</h3>

        <div className="quest-edit-form">
          <div className="quest-edit-field">
            <label className="quest-edit-label">任务描述</label>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              className="quest-edit-input"
              placeholder="输入任务内容..."
              autoFocus
            />
          </div>

          <div className="quest-edit-field">
            <label className="quest-edit-label">挑战等级</label>
            <div className="quest-edit-difficulty">
              {/* 先做 5 分钟 */}
              <button
                type="button"
                className={cn("quest-edit-diff-btn", difficulty === "easy" && "quest-edit-diff-btn-active")}
                style={difficulty === "easy" ? {
                  borderColor: "#4CAF50",
                  background: "#1B2A22",
                  boxShadow: "0 0 8px #4CAF50",
                  color: "#fff",
                } : {
                  borderColor: "#4CAF50",
                  background: "transparent",
                  color: "#9ca3af",
                }}
                onClick={() => setDifficulty("easy")}
              >
                <span className="quest-edit-diff-icon">🕒</span>
                <span className="quest-edit-diff-label">先做 5 分钟</span>
                <span className="quest-edit-diff-xp" style={{ color: "#4CAF50" }}>+5分</span>
              </button>

              {/* 只要 60 分 */}
              <button
                type="button"
                className={cn("quest-edit-diff-btn", difficulty === "normal" && "quest-edit-diff-btn-active")}
                style={difficulty === "normal" ? {
                  borderColor: "#FFC107",
                  background: "#1F2A33",
                  boxShadow: "0 0 8px #FFC107",
                  color: "#fff",
                } : {
                  borderColor: "#FFC107",
                  background: "transparent",
                  color: "#9ca3af",
                }}
                onClick={() => setDifficulty("normal")}
              >
                <span className="quest-edit-diff-icon">🎯</span>
                <span className="quest-edit-diff-label">只要 60 分</span>
                <span className="quest-edit-diff-xp" style={{ color: "#FFC107" }}>+60分</span>
              </button>

              {/* 直接挑战 */}
              <button
                type="button"
                className={cn("quest-edit-diff-btn", difficulty === "hard" && "quest-edit-diff-btn-active")}
                style={difficulty === "hard" ? {
                  borderColor: "#F44336",
                  background: "#2A2222",
                  boxShadow: "0 0 8px #F44336",
                  color: "#fff",
                } : {
                  borderColor: "#F44336",
                  background: "transparent",
                  color: "#9ca3af",
                }}
                onClick={() => setDifficulty("hard")}
              >
                <span className="quest-edit-diff-icon">⚔️</span>
                <span className="quest-edit-diff-label">直接挑战</span>
                <span className="quest-edit-diff-xp" style={{ color: "#F44336" }}>+100分</span>
              </button>
            </div>
          </div>
        </div>

        <div className="quest-edit-actions">
          <button className="quest-edit-cancel" onClick={onClose}>取消</button>
          <button className="quest-edit-save" onClick={handleSave} disabled={!canSave}>保存</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ============================================================
   子组件：任务项（含粒子爆炸 + 编辑）
   ============================================================ */
const QuestItem: React.FC<{
  quest: Quest;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (quest: Quest) => void;
}> = ({ quest, onComplete, onDelete, onEdit }) => {
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
        {!quest.completed && (
          <button
            type="button"
            className="quest-btn-edit"
            onClick={() => onEdit(quest)}
            title="编辑任务"
          >
            ✏️
          </button>
        )}
        <button
          type="button"
          className="quest-btn-del"
          onClick={() => onDelete(quest.id)}
          title="删除任务"
        >
          🗑️
        </button>
      </div>
    </motion.li>
  );
};

/* ============================================================
   子组件：智能拆解 Modal（游戏化风险收益标签）
   ============================================================ */
const BreakdownModal: React.FC<{
  text: string;
  onPick: (mode: "five" | "pass" | "direct") => void;
  onCancel: () => void;
}> = ({ text, onPick, onCancel }) => (
  <motion.div
    className="quest-modal-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onCancel}
  >
    <motion.div
      className="quest-modal"
      initial={{ scale: 0.85, y: 30 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.85, y: 30 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="quest-modal-close"
        onClick={onCancel}
        aria-label="关闭"
      >
        ❌
      </button>
      <p className="quest-modal-title">这个任务看起来有点难</p>
      <p className="quest-modal-sub">「{text}」</p>
      <p className="quest-modal-ask">要不要拆解一下？</p>

      <div className="quest-modal-options">
        {/* 选项一：先做 5 分钟 - 低风险低收益 */}
        <button className="quest-modal-opt quest-modal-opt-easy" onClick={() => onPick("five")}>
          <span className="quest-modal-opt-icon">⏱️</span>
          <div className="quest-modal-opt-content">
            <span className="quest-modal-opt-label">先做 5 分钟</span>
            <span className="quest-modal-opt-desc">倒计时自动完成</span>
          </div>
          <span className="quest-modal-opt-xp quest-modal-opt-xp-green">+5分</span>
        </button>

        {/* 选项二：只要 60 分 - 中等风险中等收益 */}
        <button className="quest-modal-opt quest-modal-opt-normal" onClick={() => onPick("pass")}>
          <span className="quest-modal-opt-icon">🎯</span>
          <div className="quest-modal-opt-content">
            <span className="quest-modal-opt-label">只要 60 分</span>
            <span className="quest-modal-opt-desc">标为及格线，低难度</span>
          </div>
          <span className="quest-modal-opt-xp quest-modal-opt-xp-gold">+60分</span>
        </button>

        {/* 选项三：直接挑战 - 高风险高收益 */}
        <button className="quest-modal-opt quest-modal-opt-hard" onClick={() => onPick("direct")}>
          <span className="quest-modal-opt-icon">⚔️</span>
          <div className="quest-modal-opt-content">
            <span className="quest-modal-opt-label">直接挑战</span>
            <span className="quest-modal-opt-desc">满分完成，原样添加</span>
          </div>
          <span className="quest-modal-opt-xp quest-modal-opt-xp-orange">+100分</span>
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ============================================================
   主组件
   ============================================================ */
const QuestLogPage: React.FC = () => {
  const { isAdmin: adminMode, verifyAdmin, AdminGuardUI } = useAdminGuard();
  const [quests, setQuests] = useState<Quest[]>(() => loadQuests());

  useEffect(() => { track("tool_enter", { tool_name: "通关清单" }); }, []);
  const [xp, setXp] = useState<number>(() => loadXP());
  const [input, setInput] = useState("");
  // 智能拆解：待处理的新任务文本
  const [pending, setPending] = useState<string | null>(null);
  // 编辑任务
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  // 持久化
  useEffect(() => {
    legacySave(STORAGE_KEY, quests);
  }, [quests]);

  useEffect(() => {
    legacySave(XP_KEY, String(xp));
  }, [xp]);

  // 完成回调
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
    verifyAdmin(() => {
      setQuests((prev) => prev.filter((q) => q.id !== id));
    });
  };

  const handleEdit = (updated: Quest) => {
    verifyAdmin(() => {
      setQuests((prev) => prev.map(q => q.id === updated.id ? updated : q));
      setEditingQuest(null);
    });
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
      base.difficulty = "easy";
      base.countdown = 300; // 5 分钟
      base.text = `${pending}（5分钟挑战）`;
    } else if (mode === "pass") {
      base.difficulty = "normal";
      base.text = `${pending}（及格线）`;
    }
    setQuests((prev) => [base, ...prev]);
    setPending(null);
  };

  const handleCancel = () => {
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
          ← 回到作品集
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
                  onEdit={setEditingQuest}
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
          <BreakdownModal text={pending} onPick={handlePick} onCancel={handleCancel} />
        )}
      </AnimatePresence>

      {/* 编辑任务 Modal */}
      <AnimatePresence>
        {editingQuest && (
          <EditModal
            quest={editingQuest}
            onSave={handleEdit}
            onClose={() => setEditingQuest(null)}
          />
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
        .quest-actions { display: flex; gap: 8px; flex-shrink: 0; align-items: center; }
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
        .quest-btn-edit {
          font-size: 13px; background: none; border: none;
          padding: 5px 6px; transition: transform 0.2s ease, opacity 0.2s;
          opacity: 0.6;
        }
        .quest-btn-edit:hover { opacity: 1; transform: scale(1.15); }
        .quest-btn-del {
          font-size: 13px; background: none; border: none;
          padding: 5px 6px; transition: color 0.2s ease, opacity 0.2s;
          opacity: 0.5;
        }
        .quest-btn-del:hover { color: #f87171; opacity: 1; }

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
          position: relative;
        }
        .quest-modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: transparent;
          border: none;
          font-size: 18px;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
          opacity: 0.6;
          transition: opacity 0.2s;
        }
        .quest-modal-close:hover { opacity: 1; }
        .quest-modal-title { font-size: 17px; font-weight: 700; color: #fff; margin: 0 0 6px; }
        .quest-modal-sub { font-size: 14px; color: #fde047; margin: 0 0 4px; }
        .quest-modal-ask { font-size: 13px; color: #9ca3af; margin: 0 0 20px; }

        /* 智能拆解选项 - 游戏化风险收益标签 */
        .quest-modal-options { display: flex; flex-direction: column; gap: 12px; }
        .quest-modal-opt {
          display: flex; align-items: center; gap: 14px; text-align: left;
          padding: 16px 16px 16px 14px; border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04); transition: all 0.2s ease;
        }
        .quest-modal-opt:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          transform: translateX(4px);
        }
        .quest-modal-opt-easy:hover { border-color: rgba(76, 175, 80, 0.5); }
        .quest-modal-opt-normal:hover { border-color: rgba(255, 193, 7, 0.5); }
        .quest-modal-opt-hard:hover { border-color: rgba(255, 87, 34, 0.5); }

        .quest-modal-opt-icon { font-size: 24px; flex-shrink: 0; }
        .quest-modal-opt-content { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .quest-modal-opt-label { font-size: 15px; font-weight: 600; color: #f3f4f6; }
        .quest-modal-opt-desc { font-size: 11px; color: #9ca3af; }

        /* XP 标签 - 右侧居中 */
        .quest-modal-opt-xp {
          flex-shrink: 0; font-size: 12px; font-weight: 700;
          padding: 4px 10px; border-radius: 4px;
          letter-spacing: 0.02em;
        }
        .quest-modal-opt-xp-green {
          background: rgba(76, 175, 80, 0.2); color: #4CAF50;
          border: 1px solid rgba(76, 175, 80, 0.4);
        }
        .quest-modal-opt-xp-gold {
          background: rgba(255, 193, 7, 0.2); color: #FFC107;
          border: 1px solid rgba(255, 193, 7, 0.4);
        }
        .quest-modal-opt-xp-orange {
          background: rgba(244, 67, 54, 0.2); color: #F44336;
          border: 1px solid rgba(244, 67, 54, 0.4);
        }

        /* 编辑 Modal */
        .quest-edit-modal { max-width: 480px; }
        .quest-edit-form { display: flex; flex-direction: column; gap: 20px; margin-bottom: 24px; }
        .quest-edit-field { display: flex; flex-direction: column; gap: 8px; }
        .quest-edit-label { font-size: 12px; color: #9ca3af; font-weight: 500; letter-spacing: 0.05em; }
        .quest-edit-input {
          padding: 12px 14px; border-radius: 10px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          color: #fff; font-size: 14px; font-family: inherit; outline: none;
          transition: border-color 0.2s ease;
        }
        .quest-edit-input:focus { border-color: #fde047; }
        .quest-edit-input::placeholder { color: #6b7280; }
        .quest-edit-difficulty { display: flex; gap: 10px; }
        .quest-edit-diff-btn {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 16px 8px; border-radius: 12px; border: 1.5px solid;
          font-size: 12px; transition: all 0.25s ease; cursor: pointer;
        }
        .quest-edit-diff-icon { font-size: 24px; line-height: 1; }
        .quest-edit-diff-label { font-weight: 600; font-size: 14px; }
        .quest-edit-diff-xp { font-size: 13px; font-weight: 700; }
        .quest-edit-actions { display: flex; gap: 10px; }
        .quest-edit-cancel {
          flex: 1; padding: 11px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12);
          background: transparent; color: #9ca3af; font-size: 14px; font-family: inherit;
          cursor: pointer; transition: all 0.2s ease;
        }
        .quest-edit-cancel:hover { background: rgba(255,255,255,0.05); color: #f3f4f6; }
        .quest-edit-save {
          flex: 1; padding: 11px; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #fde047, #f59e0b); color: #06281f;
          font-size: 14px; font-weight: 600; font-family: inherit;
          cursor: pointer; transition: all 0.2s ease;
        }
        .quest-edit-save:hover:not(:disabled) { transform: scale(1.02); }
        .quest-edit-save:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 480px) {
          .quest-modal-opt-desc { display: none; }
          .quest-modal-opt-xp { font-size: 11px; padding: 3px 8px; }
          .quest-edit-difficulty { flex-direction: column; }
        }
      `}</style>

      {/* 浮动管理员入口 🔒 */}
      <button
        onClick={() => verifyAdmin(() => {})}
        title={adminMode ? "管理面板" : "管理员登录"}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 20,
          width: 44, height: 44, border: "none", borderRadius: "50%",
          background: adminMode ? "rgba(141,154,139,0.3)" : "rgba(255,255,255,0.5)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          cursor: "pointer", fontSize: 18,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.25s ease",
        }}
      >
        {adminMode ? "⚙" : "🔒"}
      </button>

      <AdminGuardUI />
    </div>
  );
};

export default QuestLogPage;
