import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { track } from "../../utils/track";
import { useAdminGuard } from "../../hooks/useAdminGuard";
import { useSolo } from "../../context/StandaloneContext";
import { useAppManifest } from "../../hooks/useAppManifest";
import PWAInstallPrompt from "../../components/PWAInstallPrompt";
import WeChatGuide from "../../components/WeChatGuide";
import UserAuthModal from "../../components/UserAuthModal";
import { useUserAuth } from "../../context/UserAuthContext";
import { userGetItem, userSetItem } from "../../utils/userStorage";
import { getCurrentUsername } from "../../utils/userAuth";
import {
  type RewardCard,
  checkAndGrantCard,
  getPendingCards,
  claimCard,
} from "./crossReward";

/**
 * 通关清单 · Quest Log
 *
 * 游戏化 To-Do —— 把人生变成一场 RPG。
 * 智能拆解降低启动阻力，完成时粒子爆炸 + 金币音效提供即时爽感。
 * 数据持久化于 localStorage（key: quest_log_data），通过 userStorage 隔离。
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

/* ========== 金币积分体系 ========== */
const COINS_KEY = "quest_log_coins";
const COINS_HISTORY_KEY = "quest_log_coins_history";
const CHECKIN_KEY = "quest_log_checkin";
const STREAK_KEY = "quest_log_streak";
const TOTAL_COMPLETED_KEY = "quest_log_total_completed";

interface CoinRecord {
  amount: number;
  reason: string;
  ts: number;
}

// 金币奖励配置
const COIN_REWARD = {
  easy: 2,
  normal: 5,
  hard: 10,
  daily: 5,
  levelup: 15,
  streak7: 20,
};

// 称号梯度
const TITLES = [
  { min: 0, label: "新手冒险者", color: "#9ca3af" },
  { min: 50, label: "见习勇者", color: "#34d399" },
  { min: 150, label: "资深探险家", color: "#60a5fa" },
  { min: 300, label: "传说英雄", color: "#f472b6" },
  { min: 500, label: "不朽传奇", color: "#fde047" },
];

function getTitle(coins: number): { label: string; color: string } {
  for (let i = TITLES.length - 1; i >= 0; i--) {
    if (coins >= TITLES[i].min) return TITLES[i];
  }
  return TITLES[0];
}

/* ========== 头像 ========== */
const AVATAR_KEY = "quest_log_avatar";

/* ========== 金币商店 ========== */
const SHOP_INVENTORY_KEY = "quest_log_shop_inventory";
const THEME_KEY = "quest_log_theme";

interface ShopItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  icon: string;
  /** 最大持有数量 */
  max: number;
  /** 一次性解锁（如主题），购买后不可重复购买 */
  oneTime?: boolean;
}

const SHOP_ITEMS: ShopItem[] = [
  { id: "streak_protect", name: "签到保护卡", desc: "断签时自动消耗，连续天数不归零", price: 30, icon: "🛡️", max: 3 },
  { id: "double_coin", name: "双倍金币 buff", desc: "下一次完成任务金币 ×2", price: 20, icon: "⚡", max: 1 },
  { id: "skip_breakdown", name: "跳过拆解券 ×3", desc: "添加任务时跳过拆解弹窗，直接添加", price: 10, icon: "🎫", max: 99 },
  { id: "theme_purple", name: "主题：暗夜紫", desc: "解锁紫色主题皮肤", price: 100, icon: "🎨", max: 1, oneTime: true },
  { id: "theme_blue", name: "主题：深海蓝", desc: "解锁蓝色主题皮肤", price: 100, icon: "🎨", max: 1, oneTime: true },
  { id: "theme_rose", name: "主题：玫瑰粉", desc: "解锁粉色主题皮肤", price: 100, icon: "🎨", max: 1, oneTime: true },
];

// 主题配置：背景渐变 + 强调色
const THEMES: Record<string, { bg: string; accent: string; name: string }> = {
  default: { bg: "radial-gradient(120% 80% at 50% -10%, #1f2937 0%, #111827 50%, #0b0f1a 100%)", accent: "#fde047", name: "默认" },
  theme_purple: { bg: "radial-gradient(120% 80% at 50% -10%, #2d1b4e 0%, #1a1033 50%, #0d0820 100%)", accent: "#c084fc", name: "暗夜紫" },
  theme_blue: { bg: "radial-gradient(120% 80% at 50% -10%, #1e3a5f 0%, #0f1f3a 50%, #060f1e 100%)", accent: "#60a5fa", name: "深海蓝" },
  theme_rose: { bg: "radial-gradient(120% 80% at 50% -10%, #8b2d5a 0%, #5a1d3a 50%, #2a0e1e 100%)", accent: "#f472b6", name: "玫瑰粉" },
};

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
  return userGetItem<Quest[]>(STORAGE_KEY, DEFAULT_QUESTS) || DEFAULT_QUESTS;
}

function loadXP(): number {
  const raw = userGetItem<string>(XP_KEY, "0");
  return raw ? Math.max(0, Number(raw) || 0) : 0;
}

function loadCoins(): number {
  const raw = userGetItem<string>(COINS_KEY, "0");
  return raw ? Math.max(0, Number(raw) || 0) : 0;
}

function loadCoinsHistory(): CoinRecord[] {
  return userGetItem<CoinRecord[]>(COINS_HISTORY_KEY, []) || [];
}

function saveCoins(coins: number, history: CoinRecord[]) {
  userSetItem(COINS_KEY, String(coins));
  userSetItem(COINS_HISTORY_KEY, history);
}

function loadCheckin(): string {
  return userGetItem<string>(CHECKIN_KEY, "") || "";
}

function loadStreak(): number {
  const raw = userGetItem<string>(STREAK_KEY, "0");
  return raw ? Math.max(0, Number(raw) || 0) : 0;
}

function loadTotalCompleted(): number {
  const raw = userGetItem<string>(TOTAL_COMPLETED_KEY, "0");
  return raw ? Math.max(0, Number(raw) || 0) : 0;
}

function loadShopInventory(): Record<string, number> {
  return userGetItem<Record<string, number>>(SHOP_INVENTORY_KEY, {}) || {};
}

function loadTheme(): string {
  return userGetItem<string>(THEME_KEY, "default") || "default";
}

function loadAvatar(): string {
  return userGetItem<string>(AVATAR_KEY, "") || "";
}

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isYesterday(checkinStr: string): boolean {
  if (!checkinStr) return false;
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yesterday = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return checkinStr === yesterday;
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
  useAppManifest("/manifests/quest.webmanifest");
  const { isSolo } = useSolo();
  const { verifyAdmin, AdminGuardUI } = useAdminGuard();
  const [quests, setQuests] = useState<Quest[]>(() => loadQuests());

  useEffect(() => { document.title = "通关清单"; track("tool_enter", { tool_name: "通关清单" }); }, []);
  const [xp, setXp] = useState<number>(() => loadXP());
  const [input, setInput] = useState("");
  // 智能拆解：待处理的新任务文本
  const [pending, setPending] = useState<string | null>(null);
  // 编辑任务
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  /* ========== 金币积分体系状态 ========== */
  const [coins, setCoins] = useState<number>(() => loadCoins());
  const [coinsHistory, setCoinsHistory] = useState<CoinRecord[]>(() => loadCoinsHistory());
  const [checkinDate, setCheckinDate] = useState<string>(() => loadCheckin());
  const [streak, setStreak] = useState<number>(() => loadStreak());
  const checkedInToday = checkinDate === getTodayStr();

  /* ========== 跨产品体验卡 ========== */
  const [pendingCards, setPendingCards] = useState<RewardCard[]>(() => getPendingCards("quest"));
  const [cardClaimAnim, setCardClaimAnim] = useState<string | null>(null);

  /* ========== Tab 导航 + 累计完成 + 商店 ========== */
  const [activeTab, setActiveTab] = useState<"todo" | "shop" | "mine">("todo");
  const [totalCompleted, setTotalCompleted] = useState<number>(() => loadTotalCompleted());
  const [shopInventory, setShopInventory] = useState<Record<string, number>>(() => loadShopInventory());
  const [activeTheme, setActiveTheme] = useState<string>(() => loadTheme());
  const [purchaseFlash, setPurchaseFlash] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string>(() => loadAvatar());
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [titlesExpanded, setTitlesExpanded] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);

  // 持久化
  useEffect(() => {
    userSetItem(STORAGE_KEY, quests);
  }, [quests]);

  useEffect(() => {
    userSetItem(XP_KEY, String(xp));
  }, [xp]);

  useEffect(() => {
    saveCoins(coins, coinsHistory);
  }, [coins, coinsHistory]);

  useEffect(() => {
    userSetItem(CHECKIN_KEY, checkinDate);
    userSetItem(STREAK_KEY, String(streak));
  }, [checkinDate, streak]);

  useEffect(() => {
    userSetItem(TOTAL_COMPLETED_KEY, String(totalCompleted));
  }, [totalCompleted]);

  useEffect(() => {
    userSetItem(SHOP_INVENTORY_KEY, shopInventory);
  }, [shopInventory]);

  useEffect(() => {
    userSetItem(THEME_KEY, activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    userSetItem(AVATAR_KEY, avatar);
  }, [avatar]);

  /* 等级变化追踪 */
  const prevLevelRef = useRef(Math.floor(xp / XP_PER_LEVEL) + 1);
  useEffect(() => {
    const newLevel = Math.floor(xp / XP_PER_LEVEL) + 1;
    if (newLevel > prevLevelRef.current) {
      track("quest_level", { level: newLevel });
      prevLevelRef.current = newLevel;
    }
  }, [xp]);

  /* 添加金币工具函数 */
  const addCoins = (amount: number, reason: string) => {
    setCoins((c) => c + amount);
    setCoinsHistory((h) => [...h, { amount, reason, ts: Date.now() }]);
  };

  /* 消耗金币 */
  const spendCoins = (amount: number, reason: string): boolean => {
    if (coins < amount) return false;
    setCoins((c) => c - amount);
    setCoinsHistory((h) => [...h, { amount: -amount, reason, ts: Date.now() }]);
    return true;
  };

  /* 购买商店物品 */
  const handlePurchase = (item: ShopItem) => {
    const owned = shopInventory[item.id] || 0;
    if (item.oneTime && owned >= 1) return; // 一次性物品已拥有
    if (!item.oneTime && owned >= item.max) return; // 已达上限
    if (!spendCoins(item.price, `购买「${item.name}」`)) return;

    setShopInventory((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));

    // 主题类物品购买后自动切换
    if (item.id.startsWith("theme_")) {
      setActiveTheme(item.id);
    }

    setPurchaseFlash(item.id);
    setTimeout(() => setPurchaseFlash(null), 600);
    playCoinSound();
    track("quest_shop_purchase", { itemId: item.id, price: item.price });
  };

  /* 切换主题（已解锁的主题间切换） */
  const handleSwitchTheme = (themeId: string) => {
    if (themeId !== "default" && !(shopInventory[themeId] >= 1)) return;
    setActiveTheme(themeId);
  };

  /* 头像上传：Canvas 压缩至 128×128，Base64 存储 */
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const SIZE = 128;
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        // 居中裁剪
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, SIZE, SIZE);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setAvatar(dataUrl);
        track("quest_avatar_upload", {});
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
    // 清空 input 使同一文件可重复选择
    e.target.value = "";
  };

  /* 每日签到 */
  const handleCheckin = () => {
    if (checkedInToday) return;
    const today = getTodayStr();
    let newStreak = streak;
    let usedProtect = false;
    if (isYesterday(checkinDate)) {
      newStreak = streak + 1;
    } else if (streak > 0 && (shopInventory["streak_protect"] || 0) > 0) {
      // 消耗签到保护卡，streak 不归零
      newStreak = streak + 1;
      usedProtect = true;
      setShopInventory((prev) => ({ ...prev, streak_protect: Math.max(0, (prev["streak_protect"] || 0) - 1) }));
    } else {
      newStreak = 1;
    }
    setCheckinDate(today);
    setStreak(newStreak);

    let reward = COIN_REWARD.daily;
    let reason = "每日签到";
    if (newStreak >= 7) {
      reward += COIN_REWARD.streak7;
      reason = `连续签到 ${newStreak} 天（含周奖励）`;
    }
    addCoins(reward, reason);
    track("quest_checkin", { streak: newStreak, reward, usedProtect });

    // 检测跨产品体验卡（回血清单连续7天 → 通关清单得卡）
    const newCard = checkAndGrantCard("recharge");
    if (newCard) {
      setPendingCards((prev) => [...prev, newCard]);
    }

    // 签到音效
    playCoinSound();
  };

  /* 领取体验卡 */
  const handleClaimCard = (card: RewardCard) => {
    const claimed = claimCard(card.id);
    if (!claimed) return;
    setCardClaimAnim(card.id);
    setTimeout(() => {
      setCardClaimAnim(null);
      setPendingCards((prev) => prev.filter((c) => c.id !== card.id));
    }, 800);
    // 发放金币奖励
    addCoins(card.rewardAmount, `领取「${card.title}」`);
    playCoinSound();
    track("quest_claim_card", { cardId: card.id, reward: card.rewardAmount });
  };

  // 完成回调 — 先查目标任务，再在 setQuests 外做副作用，避免 StrictMode 双执行
  const handleComplete = (id: string) => {
    const target = quests.find((q) => q.id === id);
    if (!target || target.completed) return;

    setQuests((prev) => prev.filter((q) => q.id !== id));
    setXp((x) => x + XP_REWARD[target.difficulty]);

    // 双倍金币 buff：消耗并翻倍
    const hasDoubleCoin = (shopInventory["double_coin"] || 0) > 0;
    let coinReward = COIN_REWARD[target.difficulty];
    if (hasDoubleCoin) {
      coinReward *= 2;
      setShopInventory((prev) => ({ ...prev, double_coin: 0 }));
    }
    addCoins(coinReward, `完成任务「${target.text}」${hasDoubleCoin ? "（双倍buff）" : ""}`);
    track("quest_complete", { difficulty: target.difficulty, coins: coinReward, doubleCoin: hasDoubleCoin });
    setTotalCompleted((c) => c + 1);
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

    // 跳过拆解券：直接以「直接挑战」难度添加
    if ((shopInventory["skip_breakdown"] || 0) > 0) {
      setShopInventory((prev) => ({ ...prev, skip_breakdown: Math.max(0, (prev["skip_breakdown"] || 0) - 1) }));
      setQuests((prev) => [{ id: genId(), text, difficulty: "hard", completed: false }, ...prev]);
      return;
    }

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

  // 缓存重复计算，避免每次渲染重复调用
  // 消费 UserAuthContext，登录/退出后自动刷新用户名
  const { username: authUsername, isLoggedIn, logout } = useUserAuth();
  const username = authUsername || getCurrentUsername();
  const currentTitle = getTitle(coins);
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;

  // 当前主题配置
  const themeConfig = THEMES[activeTheme] || THEMES["default"];

  return (
    <div className="quest-page" style={activeTheme !== "default" ? { background: themeConfig.bg } : undefined}>
      {/* 顶部返回 */}
      <header className="quest-topbar">
        {!isSolo && (
          <Link to="/mickey" className="quest-back">
            ← 回到作品集
          </Link>
        )}
        <span className="quest-topbar-meta">Quest Log</span>
      </header>

      {/* ===== 待办 Tab ===== */}
      {activeTab === "todo" && (
        <>
          {/* 标题 + 紧凑状态条 */}
          <div className="quest-title-area">
            <h1 className="quest-title">通关清单</h1>
            <p className="quest-subtitle">把人生变成一场 RPG。</p>
            <div className="quest-mini-status">
              <span className="quest-mini-item">
                <span className="quest-mini-level">Lv.{level}</span>
              </span>
              <span className="quest-mini-divider" />
              <span className="quest-mini-item">
                <span className="quest-mini-coin-icon">◆</span>
                <span className="quest-mini-coin-val">{coins}</span>
              </span>
              <span className="quest-mini-divider" />
              <span className="quest-mini-item">
                <span className="quest-mini-task-icon">📋</span>
                <span>{stats.active} 待办</span>
              </span>
              <span className="quest-mini-spacer" />
              <span className="quest-mini-title" style={{ color: currentTitle.color }}>
                {currentTitle.label}
              </span>
              {(shopInventory["double_coin"] || 0) > 0 && (
                <span className="quest-mini-buff">⚡×2</span>
              )}
            </div>
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
        </>
      )}

      {/* ===== 商店 Tab ===== */}
      {activeTab === "shop" && (
        <section className="quest-shop-section">
          {/* 金币余额 */}
          <div className="quest-shop-balance">
            <span className="quest-shop-balance-icon">◆</span>
            <motion.span
              key={coins}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="quest-shop-balance-val"
            >
              {coins}
            </motion.span>
            <span className="quest-shop-balance-label">金币</span>
          </div>

          {/* 活跃道具提示 */}
          {((shopInventory["double_coin"] || 0) > 0 || (shopInventory["streak_protect"] || 0) > 0 || (shopInventory["skip_breakdown"] || 0) > 0) && (
            <div className="quest-shop-buffs">
              {(shopInventory["double_coin"] || 0) > 0 && (
                <span className="quest-shop-buff">⚡ 双倍金币就绪</span>
              )}
              {(shopInventory["streak_protect"] || 0) > 0 && (
                <span className="quest-shop-buff">🛡️ 签到保护 ×{shopInventory["streak_protect"]}</span>
              )}
              {(shopInventory["skip_breakdown"] || 0) > 0 && (
                <span className="quest-shop-buff">🎫 跳过拆解 ×{shopInventory["skip_breakdown"]}</span>
              )}
            </div>
          )}

          {/* 道具 */}
          <h3 className="quest-section-h3">⚡ 道具</h3>
          <div className="quest-shop-grid">
            {SHOP_ITEMS.filter(item => !item.oneTime).map(item => {
              const owned = shopInventory[item.id] || 0;
              const maxed = owned >= item.max;
              const affordable = coins >= item.price;
              return (
                <motion.div
                  key={item.id}
                  className={cn("quest-shop-card", purchaseFlash === item.id && "quest-shop-card-flash")}
                  animate={purchaseFlash === item.id ? { scale: [1, 0.95, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <div className="quest-shop-card-top">
                    <span className="quest-shop-card-icon">{item.icon}</span>
                    <div className="quest-shop-card-info">
                      <span className="quest-shop-card-name">{item.name}</span>
                      <span className="quest-shop-card-desc">{item.desc}</span>
                    </div>
                  </div>
                  <div className="quest-shop-card-bottom">
                    {owned > 0 && <span className="quest-shop-owned">持有 {owned}</span>}
                    <button
                      className="quest-shop-buy-btn"
                      onClick={() => handlePurchase(item)}
                      disabled={maxed || !affordable}
                    >
                      {maxed ? "已满" : <>◆ {item.price}</>}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* 主题皮肤 */}
          <h3 className="quest-section-h3">🎨 主题皮肤</h3>
          <div className="quest-shop-grid">
            {/* 默认主题 */}
            <div className={cn("quest-shop-card", activeTheme === "default" && "quest-shop-card-active")}>
              <div className="quest-shop-card-top">
                <span className="quest-shop-card-icon">🎮</span>
                <div className="quest-shop-card-info">
                  <span className="quest-shop-card-name">默认</span>
                  <span className="quest-shop-card-desc">经典暗色背景</span>
                </div>
              </div>
              <div className="quest-shop-card-bottom">
                <button
                  className="quest-shop-use-btn"
                  onClick={() => handleSwitchTheme("default")}
                  disabled={activeTheme === "default"}
                >
                  {activeTheme === "default" ? "使用中" : "切换"}
                </button>
              </div>
            </div>
            {SHOP_ITEMS.filter(item => item.oneTime).map(item => {
              const owned = shopInventory[item.id] || 0;
              const isActive = activeTheme === item.id;
              const affordable = coins >= item.price;
              return (
                <div key={item.id} className={cn("quest-shop-card", isActive && "quest-shop-card-active")}>
                  <div className="quest-shop-card-top">
                    <span className="quest-shop-card-icon">{item.icon}</span>
                    <div className="quest-shop-card-info">
                      <span className="quest-shop-card-name">{item.name.replace("主题：", "")}</span>
                      <span className="quest-shop-card-desc">{item.desc}</span>
                    </div>
                  </div>
                  <div className="quest-shop-card-bottom">
                    {owned > 0 ? (
                      <button
                        className="quest-shop-use-btn"
                        onClick={() => handleSwitchTheme(item.id)}
                        disabled={isActive}
                      >
                        {isActive ? "使用中" : "切换"}
                      </button>
                    ) : (
                      <button
                        className="quest-shop-buy-btn"
                        onClick={() => handlePurchase(item)}
                        disabled={!affordable}
                      >
                        ◆ {item.price}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ===== 我的 Tab ===== */}
      {activeTab === "mine" && (
        <section className="quest-mine-section">
          {/* 用户卡片 */}
          <div className="quest-profile-card">
            {/* 头像：点击上传 */}
            <div className="quest-profile-avatar-wrap" onClick={() => avatarInputRef.current?.click()}>
              {avatar ? (
                <img src={avatar} alt="头像" className="quest-profile-avatar-img" />
              ) : (
                <div className="quest-profile-avatar">
                  {username ? username.charAt(0).toUpperCase() : "🎮"}
                </div>
              )}
              <span className="quest-profile-avatar-badge">📷</span>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: "none" }}
              />
            </div>
            <div className="quest-profile-info">
              <h2 className="quest-profile-name">{username || "匿名冒险者"}</h2>
              <div className="quest-profile-badges">
                <span className="quest-level-badge">Lv.{level}</span>
                <span
                  className="quest-title-badge"
                  style={{ color: currentTitle.color, borderColor: currentTitle.color + "40" }}
                >
                  {currentTitle.label}
                </span>
              </div>
              {/* 账户操作 */}
              <div className="quest-profile-account">
                {isLoggedIn ? (
                  <button
                    className="quest-logout-btn"
                    onClick={() => logout()}
                  >
                    退出登录
                  </button>
                ) : (
                  <button
                    className="quest-login-btn"
                    onClick={() => setShowLoginModal(true)}
                  >
                    登录 / 注册
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* XP 进度条 */}
          <XpBar xp={xp} />

          {/* 数据统计网格 */}
          <div className="quest-stats-grid">
            <div className="quest-stat-card">
              <span className="quest-stat-value">{coins}</span>
              <span className="quest-stat-label">累计金币</span>
            </div>
            <div className="quest-stat-card">
              <span className="quest-stat-value quest-stat-highlight">{totalCompleted}</span>
              <span className="quest-stat-label">累计完成</span>
            </div>
            <div className="quest-stat-card">
              <span className="quest-stat-value">{streak}</span>
              <span className="quest-stat-label">连续签到</span>
            </div>
            <div className="quest-stat-card">
              <span className="quest-stat-value">{stats.active}</span>
              <span className="quest-stat-label">进行中</span>
            </div>
          </div>

          {/* 每日签到 */}
          <div className="quest-checkin-section">
            <h3 className="quest-section-h3">📅 每日签到</h3>
            <button
              className={cn("quest-checkin-btn", checkedInToday && "quest-checkin-done")}
              onClick={handleCheckin}
              disabled={checkedInToday}
            >
              {checkedInToday ? (
                <>
                  <span>✓</span>
                  <span>今日已签到</span>
                </>
              ) : (
                <>
                  <span className="quest-checkin-gift">🎁</span>
                  <span>每日签到 +{COIN_REWARD.daily} 金币</span>
                </>
              )}
            </button>
            {streak > 0 && (
              <p className="quest-streak-text">🔥 已连续签到 {streak} 天</p>
            )}
          </div>

          {/* 称号成就（可折叠） */}
          <div className="quest-achievements">
            <button
              className="quest-section-toggle"
              onClick={() => setTitlesExpanded((v) => !v)}
            >
              <h3 className="quest-section-h3">🏆 称号成就</h3>
              <span className={cn("quest-toggle-arrow", titlesExpanded && "quest-toggle-open")}>▶</span>
            </button>
            {titlesExpanded && (
              <div className="quest-titles-list">
                {TITLES.map((t) => {
                  const unlocked = coins >= t.min;
                  return (
                    <div
                      key={t.label}
                      className={cn("quest-title-row", !unlocked && "quest-title-locked")}
                    >
                      <span
                        className="quest-title-dot"
                        style={{ background: unlocked ? t.color : "#374151" }}
                      />
                      <span
                        className="quest-title-name"
                        style={{ color: unlocked ? t.color : "#4b5563" }}
                      >
                        {t.label}
                      </span>
                      <span className="quest-title-req">{t.min}+ 金币</span>
                      {unlocked && <span className="quest-title-check">✓</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 金币记录（可折叠） */}
          {coinsHistory.length > 0 && (
            <div className="quest-history-section">
              <button
                className="quest-section-toggle"
                onClick={() => setHistoryExpanded((v) => !v)}
              >
                <h3 className="quest-section-h3">💰 金币记录</h3>
                <span className={cn("quest-toggle-arrow", historyExpanded && "quest-toggle-open")}>▶</span>
              </button>
              {historyExpanded && (
                <div className="quest-history-list">
                  {coinsHistory.slice(-20).reverse().map((rec, i) => (
                    <div key={i} className="quest-history-item">
                      <span className="quest-history-reason">{rec.reason}</span>
                      <span className={cn("quest-history-amount", rec.amount < 0 && "quest-history-spend")}>
                        {rec.amount > 0 ? "+" : ""}{rec.amount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 我的道具 */}
          {Object.values(shopInventory).some(v => v > 0) && (
            <div className="quest-inventory-section">
              <h3 className="quest-section-h3">🎒 我的道具</h3>
              <div className="quest-inventory-grid">
                {SHOP_ITEMS.filter(item => (shopInventory[item.id] || 0) > 0).map(item => (
                  <div key={item.id} className="quest-inventory-item">
                    <span className="quest-inventory-icon">{item.icon}</span>
                    <span className="quest-inventory-name">{item.name.replace("主题：", "").replace(" ×3", "")}</span>
                    <span className="quest-inventory-count">×{shopInventory[item.id]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 跨产品体验卡 */}
          <AnimatePresence>
            {pendingCards.length > 0 && (
              <motion.div
                className="quest-reward-cards"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="quest-reward-cards-title">联动礼券</p>
                <div className="quest-reward-cards-list">
                  {pendingCards.map((card) => (
                    <motion.div
                      key={card.id}
                      className={cn(
                        "quest-reward-card",
                        cardClaimAnim === card.id && "quest-reward-card-claiming"
                      )}
                      layout
                      exit={{ opacity: 0, scale: 0.8, x: 60 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="quest-reward-card-left">
                        <span className="quest-reward-card-icon">🎫</span>
                        <div className="quest-reward-card-info">
                          <span className="quest-reward-card-name">{card.title}</span>
                          <span className="quest-reward-card-desc">{card.desc}</span>
                        </div>
                      </div>
                      <div className="quest-reward-card-right">
                        <span className="quest-reward-card-amount">+{card.rewardAmount} 金币</span>
                        <button
                          className="quest-reward-card-btn"
                          onClick={() => handleClaimCard(card)}
                          disabled={cardClaimAnim === card.id}
                        >
                          {cardClaimAnim === card.id ? "领取中..." : "领取"}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* 底部固定区域：输入栏 + Tab 导航 */}
      <div className="quest-bottom-area">
        {activeTab === "todo" && (
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
        )}
        <nav className="quest-tabbar">
          <button
            className={cn("quest-tab", activeTab === "todo" && "quest-tab-active")}
            onClick={() => setActiveTab("todo")}
          >
            <span className="quest-tab-icon">📋</span>
            <span className="quest-tab-label">待办</span>
          </button>
          <button
            className={cn("quest-tab", activeTab === "shop" && "quest-tab-active")}
            onClick={() => setActiveTab("shop")}
          >
            <span className="quest-tab-icon">🛒</span>
            <span className="quest-tab-label">商店</span>
          </button>
          <button
            className={cn("quest-tab", activeTab === "mine" && "quest-tab-active")}
            onClick={() => setActiveTab("mine")}
          >
            <span className="quest-tab-icon">👤</span>
            <span className="quest-tab-label">我的</span>
          </button>
        </nav>
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

      {/* 登录/注册 Modal */}
      <UserAuthModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

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
          padding: 0 20px 160px;
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

        /* 玩家状态（XP 条仍复用） */
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
        .quest-title-badge {
          font-size: 11px; font-weight: 700;
          padding: 3px 10px; border-radius: 6px;
          border: 1.5px solid;
          background: rgba(0,0,0,0.2);
        }

        .quest-checkin-btn {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 10px; border-radius: 10px; border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: #9ca3af; font-size: 13px; font-weight: 500;
          font-family: inherit; cursor: pointer;
          transition: all 0.2s ease;
        }
        .quest-checkin-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-1px);
        }
        .quest-checkin-btn:disabled {
          opacity: 0.5; cursor: not-allowed; border-color: rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04); color: #9ca3af;
        }
        .quest-checkin-gift { font-size: 14px; }
        .quest-checkin-done { color: #34d399; border-color: rgba(52, 211, 153, 0.3); background: rgba(52, 211, 153, 0.08); }

        /* 跨产品体验卡 */
        .quest-reward-cards {
          max-width: 720px; margin: 0 auto 16px; padding: 0 4px;
        }
        .quest-reward-cards-title {
          font-size: 12px; color: #9ca3af; margin: 0 0 8px;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .quest-reward-cards-list {
          display: flex; flex-direction: column; gap: 8px;
        }
        .quest-reward-card {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 14px; border-radius: 12px;
          background: rgba(253, 224, 71, 0.06);
          border: 1.5px solid rgba(253, 224, 71, 0.25);
          transition: all 0.3s ease;
        }
        .quest-reward-card:hover {
          background: rgba(253, 224, 71, 0.1);
          border-color: rgba(253, 224, 71, 0.4);
          transform: translateX(2px);
        }
        .quest-reward-card-claiming {
          opacity: 0.5; transform: scale(0.98);
        }
        .quest-reward-card-left {
          display: flex; align-items: center; gap: 10px;
        }
        .quest-reward-card-icon {
          font-size: 22px; flex-shrink: 0;
        }
        .quest-reward-card-info {
          display: flex; flex-direction: column; gap: 2px;
        }
        .quest-reward-card-name {
          font-size: 14px; font-weight: 700; color: #fde047;
        }
        .quest-reward-card-desc {
          font-size: 11px; color: #9ca3af;
        }
        .quest-reward-card-right {
          display: flex; align-items: center; gap: 10px; flex-shrink: 0;
        }
        .quest-reward-card-amount {
          font-size: 13px; font-weight: 700; color: #fde047;
        }
        .quest-reward-card-btn {
          padding: 6px 14px; border-radius: 8px; border: none;
          background: linear-gradient(135deg, #fde047, #f59e0b);
          color: #06281f; font-size: 12px; font-weight: 700;
          font-family: inherit; cursor: pointer;
          transition: all 0.2s ease;
        }
        .quest-reward-card-btn:hover:not(:disabled) {
          transform: scale(1.08);
          box-shadow: 0 0 14px rgba(253, 224, 71, 0.5);
        }
        .quest-reward-card-btn:disabled {
          opacity: 0.5; cursor: not-allowed;
        }

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

        /* 底部固定区域（输入栏 + Tab 导航） */
        .quest-bottom-area {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
          max-width: 720px; margin: 0 auto;
          background: rgba(17, 24, 39, 0.97);
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .quest-input-bar {
          display: flex; gap: 10px; padding: 12px 20px;
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

        /* ===== 底部 Tab 导航栏 ===== */
        .quest-tabbar {
          display: flex;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 6px 0;
          padding-bottom: max(6px, env(safe-area-inset-bottom, 6px));
        }
        .quest-tab {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
          padding: 8px 0;
          background: none; border: none;
          color: #6b7280; font-size: 11px; font-family: inherit;
          cursor: pointer; transition: color 0.2s ease, transform 0.15s ease;
        }
        .quest-tab:active { transform: scale(0.92); }
        .quest-tab-active { color: #fde047; }
        .quest-tab-icon { font-size: 20px; line-height: 1; }
        .quest-tab-label { font-size: 11px; letter-spacing: 0.03em; }

        /* ===== 我的页面 ===== */
        .quest-mine-section {
          max-width: 720px; margin: 0 auto; padding: 28px 4px 20px;
        }

        /* 用户卡片 */
        .quest-profile-card {
          display: flex; align-items: center; gap: 16px;
          padding: 20px 18px; border-radius: 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 16px;
        }
        .quest-profile-avatar {
          width: 56px; height: 56px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; font-weight: 700; color: #fde047;
          background: linear-gradient(135deg, rgba(253,224,71,0.15), rgba(245,158,11,0.15));
          border: 2px solid rgba(253,224,71,0.3);
          flex-shrink: 0;
        }
        /* 头像上传包裹 */
        .quest-profile-avatar-wrap {
          position: relative; flex-shrink: 0;
          cursor: pointer; width: 56px; height: 56px;
        }
        .quest-profile-avatar-wrap:hover .quest-profile-avatar-badge {
          opacity: 1; transform: scale(1);
        }
        .quest-profile-avatar-img {
          width: 56px; height: 56px; border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(253,224,71,0.3);
        }
        .quest-profile-avatar-badge {
          position: absolute; bottom: -2px; right: -2px;
          width: 20px; height: 20px; border-radius: 50%;
          background: #1f2937; border: 1.5px solid rgba(253,224,71,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; opacity: 0; transform: scale(0.8);
          transition: all 0.2s ease;
        }
        .quest-profile-info { flex: 1; min-width: 0; }
        .quest-profile-name {
          font-size: 18px; font-weight: 700; color: #fff;
          margin: 0 0 8px; letter-spacing: 0.02em;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .quest-profile-badges { display: flex; gap: 8px; flex-wrap: wrap; }
        .quest-profile-account {
          display: flex; align-items: center; gap: 10px; margin-top: 10px;
          flex-wrap: wrap;
        }
        .quest-login-btn {
          padding: 6px 16px; border-radius: 8px; border: none;
          background: linear-gradient(135deg, #fde047, #f59e0b);
          color: #06281f; font-size: 13px; font-weight: 700;
          font-family: inherit; cursor: pointer;
          transition: all 0.15s ease;
        }
        .quest-login-btn:hover { transform: scale(1.05); }
        .quest-logout-btn {
          padding: 5px 14px; border-radius: 8px;
          border: 1px solid rgba(248,113,113,0.3);
          background: rgba(248,113,113,0.08);
          color: #f87171; font-size: 12px; font-family: inherit;
          cursor: pointer; transition: all 0.15s ease;
        }
        .quest-logout-btn:hover { background: rgba(248,113,113,0.15); }

        /* 可折叠区块 */
        .quest-section-toggle {
          width: 100%; display: flex; align-items: center;
          justify-content: space-between; gap: 8px;
          background: none; border: none;
          cursor: pointer; padding: 0; margin-bottom: 10px;
          font-family: inherit;
        }
        .quest-section-toggle .quest-section-h3 { margin: 0; }
        .quest-toggle-arrow {
          font-size: 11px; color: #6b7280;
          transition: transform 0.2s ease;
          transform: rotate(0deg);
        }
        .quest-toggle-open { transform: rotate(90deg); }

        /* XP bar on mine page */
        .quest-mine-section .quest-xp-wrap { margin-bottom: 16px; }

        /* 数据统计网格 */
        .quest-stats-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
          margin-bottom: 20px;
        }
        .quest-stat-card {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 18px 12px; border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: transform 0.2s ease;
        }
        .quest-stat-card:hover { transform: translateY(-2px); }
        .quest-stat-value {
          font-size: 28px; font-weight: 800; color: #9ca3af;
          font-variant-numeric: tabular-nums; line-height: 1;
        }
        .quest-stat-highlight { color: #fde047; }
        .quest-stat-label {
          font-size: 12px; color: #6b7280; letter-spacing: 0.05em;
        }

        /* 区块标题 */
        .quest-section-h3 {
          font-size: 15px; font-weight: 700; color: #f3f4f6;
          margin: 0 0 12px; letter-spacing: 0.03em;
        }

        /* 称号成就 */
        .quest-achievements { margin-bottom: 20px; }
        .quest-titles-list {
          display: flex; flex-direction: column; gap: 8px;
        }
        .quest-title-row {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px; border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.2s ease;
        }
        .quest-title-locked { opacity: 0.45; }
        .quest-title-dot {
          width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
        }
        .quest-title-name {
          flex: 1; font-size: 14px; font-weight: 600;
        }
        .quest-title-req {
          font-size: 11px; color: #6b7280; letter-spacing: 0.03em;
        }
        .quest-title-check {
          font-size: 14px; color: #34d399; font-weight: 700;
        }

        /* 签到区块 */
        .quest-checkin-section { margin-bottom: 20px; }
        .quest-streak-text {
          font-size: 12px; color: #9ca3af; margin: 8px 0 0; text-align: center;
        }

        /* 联动礼券 on mine page */
        .quest-mine-section .quest-reward-cards { max-width: none; padding: 0; margin-bottom: 16px; }

        /* ===== 待办页紧凑状态条 ===== */
        .quest-mini-status {
          display: flex; align-items: center; gap: 10px;
          margin-top: 14px; padding: 10px 14px; border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .quest-mini-item {
          display: flex; align-items: center; gap: 4px;
          font-size: 13px; color: #9ca3af;
        }
        .quest-mini-level {
          font-weight: 700; font-size: 13px; color: #fde047;
          padding: 2px 8px; border-radius: 5px;
          background: rgba(253, 224, 71, 0.12);
          border: 1px solid rgba(253, 224, 71, 0.3);
        }
        .quest-mini-coin-icon { font-size: 12px; color: #9ca3af; }
        .quest-mini-coin-val { font-weight: 600; font-variant-numeric: tabular-nums; color: #d1d5db; }
        .quest-mini-task-icon { font-size: 13px; }
        .quest-mini-divider {
          width: 1px; height: 16px; background: rgba(255,255,255,0.1); flex-shrink: 0;
        }
        .quest-mini-spacer { flex: 1; }
        .quest-mini-title {
          font-size: 11px; font-weight: 700; letter-spacing: 0.03em;
        }
        .quest-mini-buff {
          font-size: 10px; font-weight: 700; color: #fde047;
          padding: 2px 6px; border-radius: 4px;
          background: rgba(253,224,71,0.15);
          border: 1px solid rgba(253,224,71,0.3);
          animation: quest-buff-pulse 1.5s ease-in-out infinite;
        }
        @keyframes quest-buff-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        /* ===== 金币记录 ===== */
        .quest-history-section { margin-bottom: 20px; }
        .quest-history-list {
          display: flex; flex-direction: column; gap: 6px;
        }
        .quest-history-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 14px; border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .quest-history-reason {
          font-size: 13px; color: #9ca3af;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          flex: 1; margin-right: 12px;
        }
        .quest-history-amount {
          font-size: 14px; font-weight: 700; color: #fde047;
          font-variant-numeric: tabular-nums; flex-shrink: 0;
        }
        .quest-history-spend { color: #f87171; }

        /* ===== 金币商店 ===== */
        .quest-shop-section {
          max-width: 720px; margin: 0 auto; padding: 28px 4px 20px;
        }

        /* 金币余额 */
        .quest-shop-balance {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 20px; border-radius: 16px; margin-bottom: 16px;
          background: linear-gradient(135deg, rgba(253,224,71,0.08), rgba(245,158,11,0.06));
          border: 1px solid rgba(253,224,71,0.2);
        }
        .quest-shop-balance-icon { font-size: 18px; color: #9ca3af; }
        .quest-shop-balance-val {
          font-size: 32px; font-weight: 800; color: #fde047;
          font-variant-numeric: tabular-nums; line-height: 1;
        }
        .quest-shop-balance-label { font-size: 14px; color: #9ca3af; }

        /* 活跃道具提示 */
        .quest-shop-buffs {
          display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;
        }
        .quest-shop-buff {
          font-size: 12px; color: #fde047; font-weight: 500;
          padding: 5px 12px; border-radius: 999px;
          background: rgba(253,224,71,0.1);
          border: 1px solid rgba(253,224,71,0.25);
        }

        /* 商品网格 */
        .quest-shop-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
          margin-bottom: 20px;
        }

        /* 商品卡片 */
        .quest-shop-card {
          display: flex; flex-direction: column; gap: 10px;
          padding: 14px; border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.2s ease;
        }
        .quest-shop-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.15); }
        .quest-shop-card-active {
          border-color: rgba(253,224,71,0.4);
          background: rgba(253,224,71,0.06);
        }
        .quest-shop-card-flash { border-color: #34d399 !important; box-shadow: 0 0 12px rgba(52,211,153,0.3); }

        .quest-shop-card-top {
          display: flex; align-items: flex-start; gap: 10px;
        }
        .quest-shop-card-icon { font-size: 28px; flex-shrink: 0; line-height: 1; }
        .quest-shop-card-info { flex: 1; display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .quest-shop-card-name { font-size: 14px; font-weight: 700; color: #f3f4f6; }
        .quest-shop-card-desc { font-size: 11px; color: #6b7280; line-height: 1.4; }

        .quest-shop-card-bottom {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
        }
        .quest-shop-owned {
          font-size: 11px; color: #34d399; font-weight: 600;
          padding: 2px 8px; border-radius: 5px;
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.25);
        }

        /* 购买按钮 */
        .quest-shop-buy-btn {
          padding: 7px 14px; border-radius: 8px; border: none;
          font-size: 13px; font-weight: 700; font-family: inherit;
          color: #06281f;
          background: linear-gradient(135deg, #fde047, #f59e0b);
          cursor: pointer; transition: all 0.15s ease;
          margin-left: auto;
        }
        .quest-shop-buy-btn:hover:not(:disabled) { transform: scale(1.05); }
        .quest-shop-buy-btn:disabled {
          opacity: 0.35; cursor: not-allowed;
          background: rgba(255,255,255,0.1); color: #6b7280;
        }

        /* 使用/切换按钮 */
        .quest-shop-use-btn {
          padding: 7px 14px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.15);
          font-size: 12px; font-weight: 600; font-family: inherit;
          color: #9ca3af; background: rgba(255,255,255,0.04);
          cursor: pointer; transition: all 0.15s ease;
          margin-left: auto;
        }
        .quest-shop-use-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.08); color: #f3f4f6;
        }
        .quest-shop-use-btn:disabled {
          color: #fde047; border-color: rgba(253,224,71,0.3);
          background: rgba(253,224,71,0.08); cursor: default;
        }

        @media (max-width: 380px) {
          .quest-shop-grid { grid-template-columns: 1fr; }
        }

        /* ===== 我的道具 ===== */
        .quest-inventory-section { margin-bottom: 20px; }
        .quest-inventory-grid {
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .quest-inventory-item {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 12px; border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .quest-inventory-icon { font-size: 18px; line-height: 1; }
        .quest-inventory-name { font-size: 12px; color: #d1d5db; }
        .quest-inventory-count {
          font-size: 12px; font-weight: 700; color: #fde047;
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      <AdminGuardUI />
      <PWAInstallPrompt />
      <WeChatGuide />
    </div>
  );
};

export default QuestLogPage;
