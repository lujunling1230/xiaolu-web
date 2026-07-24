import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { track } from "../../utils/track";
import { callAI } from "../../utils/aiClient";
import { CHARACTERS, getCharacter, resolveGroupChat, CHARACTER_FEEDS, type Character } from "../../data/characters";

/**
 * 爱情公寓·元宇宙客厅
 *
 * 3601 / 3602 / 3603 —— 全员 AI 在线插科打诨
 * 第 8 位房客（你）住在 3603，随时呼叫任意房客解决人生 Bug。
 */

/* ============================================================
   类型定义
   ============================================================ */
interface ChatMessage {
  id: string;
  role: "user" | "character";
  characterId?: string;
  content: string;
  timestamp: number;
}

/** 获取当前真实时间的中文描述，注入 systemPrompt 让角色知道现实时间 */
function getRealTimeContext(): string {
  const now = new Date();
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const hh = now.getHours();
  const mm = String(now.getMinutes()).padStart(2, "0");
  const weekday = weekdays[now.getDay()];
  let period = "";
  if (hh < 6) period = "凌晨";
  else if (hh < 9) period = "早上";
  else if (hh < 12) period = "上午";
  else if (hh < 14) period = "中午";
  else if (hh < 17) period = "下午";
  else if (hh < 19) period = "傍晚";
  else if (hh < 22) period = "晚上";
  else period = "深夜";
  return `【现实时间】现在是 ${y}年${m}月${d}日 星期${weekday} ${period} ${hh}:${mm}。你必须知道这个真实时间，当用户问"今天周几""几点了""现在是什么时候"等时间相关问题时，请根据这个真实时间回答，不要编造。`;
}

type ViewMode = "lobby" | "chat" | "groupchat" | "contacts" | "discover" | "me" | "profile";

/** 可复用的底部 Tab 栏 */
const WxTabBar: React.FC<{ active: "lobby" | "contacts" | "discover" | "me"; onTab: (v: ViewMode) => void }> = ({ active, onTab }) => (
  <nav className="wx-tabbar">
    <div className={`wx-tab ${active === "lobby" ? "wx-tab-active" : "wx-tab-disabled"}`} onClick={() => onTab("lobby")}>
      <span className="wx-tab-icon">💬</span>
      <span className="wx-tab-label">消息</span>
    </div>
    <div className={`wx-tab ${active === "contacts" ? "wx-tab-active" : "wx-tab-disabled"}`} onClick={() => onTab("contacts")}>
      <span className="wx-tab-icon">👥</span>
      <span className="wx-tab-label">通讯录</span>
    </div>
    <div className={`wx-tab ${active === "discover" ? "wx-tab-active" : "wx-tab-disabled"}`} onClick={() => onTab("discover")}>
      <span className="wx-tab-icon">🔍</span>
      <span className="wx-tab-label">发现</span>
    </div>
    <div className={`wx-tab ${active === "me" ? "wx-tab-active" : "wx-tab-disabled"}`} onClick={() => onTab("me")}>
      <span className="wx-tab-icon">👤</span>
      <span className="wx-tab-label">我</span>
    </div>
  </nav>
);

/* ============================================================
   Web Audio：连线音 + 收到回复音
   ============================================================ */
let audioCtx: AudioContext | null = null;
const getCtx = () => {
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new Ctor();
  }
  return audioCtx;
};

/** 格式化时间戳为 HH:mm */
const formatTime = (ts: number) => {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

/** 连线音：拨号/呼叫的"嘟"声 */
const playDial = () => {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now + i * 0.4);
      gain.gain.setValueAtTime(0.08, now + i * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.4 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.4);
      osc.stop(now + i * 0.4 + 0.2);
    }
  } catch { /* 静音 */ }
};

/** 接通音：清脆"叮" */
const playConnect = () => {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1318, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  } catch { /* 静音 */ }
};

/** 群聊提示音：轻快的和弦 */
const playGroupBell = () => {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.06, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.3);
    });
  } catch { /* 静音 */ }
};

/* ============================================================
   工具函数
   ============================================================ */
const uid = () => Math.random().toString(36).slice(2, 10);

/* ============================================================
   子组件：角色气泡装饰 SVG（每个角色独立风格）
   ============================================================ */

/** 线条小狗：从左侧探出头的线稿小狗（第八个住户专属） */
const LinePuppySVG = () => (
  <svg className="apt-linepuppy-svg" viewBox="0 0 48 48" style={{ pointerEvents: "none" }}>
    <ellipse cx="30" cy="20" rx="14" ry="12" fill="none" stroke="#A08060" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 14 Q10 6 18 8" fill="none" stroke="#A08060" strokeWidth="2" strokeLinecap="round" />
    <path d="M44 14 Q50 6 42 8" fill="none" stroke="#A08060" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="18" r="2" fill="#A08060" />
    <circle cx="36" cy="18" r="2" fill="#A08060" />
    <ellipse cx="30" cy="24" rx="3" ry="2" fill="#A08060" />
    <path d="M24 28 Q30 32 36 28" fill="none" stroke="#A08060" strokeWidth="2" strokeLinecap="round" />
    <path d="M22 32 Q18 40 28 38" fill="none" stroke="#A08060" strokeWidth="2" strokeLinecap="round" />
    <path d="M38 32 Q42 40 32 38" fill="none" stroke="#A08060" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** 星星装饰 */
const StarDeco = ({ color, size = 12, top, left, right }: { color: string; size?: number; top?: number; left?: number; right?: number }) => (
  <svg className="apt-star-deco" viewBox="0 0 24 24" style={{ position: "absolute", top, left, right, width: size, height: size, pointerEvents: "none" }}>
    <path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z" fill={color} opacity="0.6" />
  </svg>
);

/** 角色气泡主题色映射 */
const BUBBLE_THEMES: Record<string, { bg: string; border: string; deco: string; accent: string }> = {
  zeng: { bg: "#e8f4fc", border: "#90c0e8", deco: "#78b0e0", accent: "#a8d0f0" },
  fei: { bg: "#e8e0f0", border: "#7a6a8a", deco: "#6a5a7a", accent: "#b0a0c0" },
  meijia: { bg: "#e0f0fc", border: "#a0c8e8", deco: "#88b8e0", accent: "#c0e0f8" },
  lv: { bg: "#e8f5e0", border: "#8ac898", deco: "#78b888", accent: "#b0e0c0" },
  guangu: { bg: "#f0e8d8", border: "#a08060", deco: "#907050", accent: "#d0c0a0" },
  youyou: { bg: "#fce8f0", border: "#e8a0b8", deco: "#d890a8", accent: "#f8c8d8" },
  zhangwei: { bg: "#e0e4f0", border: "#6068a0", deco: "#505890", accent: "#a0a8d0" },
};

/** 曾小贤 → 望仔纸飞机：纸飞机 + 小心形 */
const BubbleDecoZeng = ({ color, accent }: { color: string; accent: string }) => (
  <svg className="apt-bubble-deco-svg" viewBox="0 0 120 40" preserveAspectRatio="none" style={{ position: "absolute", top: -6, right: -10, width: 52, height: 34, opacity: 0.55, pointerEvents: "none" }}>
    <path d="M90 8 L108 14 L90 20 L94 14 Z" fill={accent} stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
    <line x1="108" y1="14" x2="114" y2="14" stroke={color} strokeWidth="1" opacity="0.6" />
    <path d="M98 2 Q100 0 102 2 Q104 0 106 2 Q104 6 102 6 Q100 6 98 2" fill={accent} opacity="0.7" />
    <circle cx="82" cy="28" r="3" fill={accent} opacity="0.5" />
  </svg>
);

/** 胡一菲 → 严莉莉线框：恶魔角 + 爱心 */
const BubbleDecoFei = ({ color, accent }: { color: string; accent: string }) => (
  <svg className="apt-bubble-deco-svg" viewBox="0 0 120 40" preserveAspectRatio="none" style={{ position: "absolute", top: -8, left: -10, width: 56, height: 36, opacity: 0.5, pointerEvents: "none" }}>
    <polygon points="12,4 8,12 16,12" fill={accent} stroke={color} strokeWidth="1.2" />
    <polygon points="24,4 20,12 28,12" fill={accent} stroke={color} strokeWidth="1.2" />
    <path d="M6 18 Q10 14 14 18 Q18 14 22 18 Q18 26 14 26 Q10 26 6 18" fill={accent} stroke={color} strokeWidth="1" opacity="0.6" />
    <rect x="34" y="8" width="20" height="3" rx="1.5" fill={color} opacity="0.3" />
    <rect x="34" y="14" width="14" height="3" rx="1.5" fill={color} opacity="0.2" />
  </svg>
);

/** 陈美嘉 → 可爱蓝兔兔：兔子耳朵 + 蝴蝶结 */
const BubbleDecoMeijia = ({ color, accent }: { color: string; accent: string }) => (
  <svg className="apt-bubble-deco-svg" viewBox="0 0 120 40" preserveAspectRatio="none" style={{ position: "absolute", top: -8, right: -8, width: 48, height: 36, opacity: 0.55, pointerEvents: "none" }}>
    <ellipse cx="96" cy="10" rx="5" ry="10" fill="none" stroke={color} strokeWidth="1.5" transform="rotate(-15 96 10)" />
    <ellipse cx="108" cy="10" rx="5" ry="10" fill="none" stroke={color} strokeWidth="1.5" transform="rotate(15 108 10)" />
    <circle cx="102" cy="22" r="7" fill={accent} stroke={color} strokeWidth="1.2" />
    <circle cx="99" cy="20" r="1.5" fill={color} />
    <circle cx="105" cy="20" r="1.5" fill={color} />
    <path d="M98 10 L96 6 L100 8 L104 6 L102 10" fill={accent} stroke={color} strokeWidth="1" />
    <circle cx="88" cy="30" r="3" fill={accent} opacity="0.5" />
  </svg>
);

/** 吕子乔 → 斗骑贴贴：小熊 + 玫瑰花 */
const BubbleDecoLv = ({ color, accent }: { color: string; accent: string }) => (
  <svg className="apt-bubble-deco-svg" viewBox="0 0 120 40" preserveAspectRatio="none" style={{ position: "absolute", bottom: -4, left: -10, width: 52, height: 32, opacity: 0.5, pointerEvents: "none" }}>
    <circle cx="14" cy="18" r="8" fill={accent} stroke={color} strokeWidth="1.2" />
    <circle cx="10" cy="14" r="4" fill="none" stroke={color} strokeWidth="1" />
    <circle cx="18" cy="14" r="4" fill="none" stroke={color} strokeWidth="1" />
    <circle cx="12" cy="17" r="1" fill={color} />
    <circle cx="16" cy="17" r="1" fill={color} />
    <ellipse cx="14" cy="21" rx="2.5" ry="1.5" fill={color} opacity="0.5" />
    <path d="M32 12 Q36 8 40 12 Q38 18 36 20 Q34 18 32 12" fill={accent} stroke={color} strokeWidth="1" />
    <line x1="36" y1="20" x2="36" y2="28" stroke={color} strokeWidth="1.2" />
    <path d="M34 24 Q32 26 34 28" fill="none" stroke={color} strokeWidth="0.8" />
    <path d="M38 24 Q40 26 38 28" fill="none" stroke={color} strokeWidth="0.8" />
  </svg>
);

/** 关谷神奇 → 敦煌：神兽剪影 + 云纹 */
const BubbleDecoGuangu = ({ color, accent }: { color: string; accent: string }) => (
  <svg className="apt-bubble-deco-svg" viewBox="0 0 120 40" preserveAspectRatio="none" style={{ position: "absolute", top: -6, right: -8, width: 52, height: 34, opacity: 0.5, pointerEvents: "none" }}>
    <path d="M86 8 Q92 4 98 8 Q102 6 104 10 Q100 14 96 12 Q90 16 86 12 Q84 10 86 8" fill={accent} stroke={color} strokeWidth="1" opacity="0.7" />
    <path d="M90 16 Q94 14 98 16" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
    <path d="M82 22 Q88 18 96 20 Q102 22 106 20" fill="none" stroke={color} strokeWidth="1.2" opacity="0.5" />
    <path d="M80 26 Q86 24 92 26" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
    <circle cx="100" cy="28" r="2" fill={accent} opacity="0.4" />
  </svg>
);

/** 唐悠悠 → 绵绵约会日：樱桃 + 兔子 + 蝴蝶结 */
const BubbleDecoYouyou = ({ color, accent }: { color: string; accent: string }) => (
  <svg className="apt-bubble-deco-svg" viewBox="0 0 120 40" preserveAspectRatio="none" style={{ position: "absolute", top: -6, right: -10, width: 54, height: 34, opacity: 0.55, pointerEvents: "none" }}>
    <circle cx="96" cy="12" r="5" fill={accent} stroke={color} strokeWidth="1" />
    <circle cx="106" cy="12" r="5" fill={accent} stroke={color} strokeWidth="1" />
    <path d="M96 7 Q94 2 98 4" fill="none" stroke={color} strokeWidth="1" />
    <path d="M106 7 Q108 2 104 4" fill="none" stroke={color} strokeWidth="1" />
    <circle cx="88" cy="24" r="6" fill={accent} stroke={color} strokeWidth="1.2" />
    <ellipse cx="84" cy="20" rx="3" ry="6" fill="none" stroke={color} strokeWidth="1" transform="rotate(-20 84 20)" />
    <ellipse cx="92" cy="20" rx="3" ry="6" fill="none" stroke={color} strokeWidth="1" transform="rotate(20 92 20)" />
    <path d="M82 30 Q78 34 82 36" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />
    <path d="M94 30 Q98 34 94 36" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />
  </svg>
);

/** 张伟 → 亡灵之梦：蝙蝠翅膀 + 火焰 */
const BubbleDecoZhangwei = ({ color, accent }: { color: string; accent: string }) => (
  <svg className="apt-bubble-deco-svg" viewBox="0 0 120 40" preserveAspectRatio="none" style={{ position: "absolute", top: -4, left: -10, width: 56, height: 32, opacity: 0.5, pointerEvents: "none" }}>
    <path d="M6 8 Q14 4 18 10 Q16 16 10 14 Q6 18 6 8" fill={accent} stroke={color} strokeWidth="1.2" />
    <path d="M30 8 Q22 4 18 10 Q20 16 26 14 Q30 18 30 8" fill={accent} stroke={color} strokeWidth="1.2" />
    <path d="M10 22 Q14 18 18 22 Q14 30 10 22" fill={accent} stroke={color} strokeWidth="1" opacity="0.6" />
    <path d="M8 26 Q12 24 16 26" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
    <circle cx="24" cy="28" r="2" fill={accent} opacity="0.4" />
    <circle cx="28" cy="24" r="1.5" fill={accent} opacity="0.3" />
  </svg>
);

/** 根据角色 id 返回对应装饰组件 */
const getBubbleDeco = (charId: string) => {
  const theme = BUBBLE_THEMES[charId];
  if (!theme) return null;
  switch (charId) {
    case "zeng": return <BubbleDecoZeng color={theme.deco} accent={theme.accent} />;
    case "fei": return <BubbleDecoFei color={theme.deco} accent={theme.accent} />;
    case "lv": return <BubbleDecoLv color={theme.deco} accent={theme.accent} />;
    case "meijia": return <BubbleDecoMeijia color={theme.deco} accent={theme.accent} />;
    case "guangu": return <BubbleDecoGuangu color={theme.deco} accent={theme.accent} />;
    case "youyou": return <BubbleDecoYouyou color={theme.deco} accent={theme.accent} />;
    case "zhangwei": return <BubbleDecoZhangwei color={theme.deco} accent={theme.accent} />;
    default: return null;
  }
};

/* ============================================================
   子组件：单条消息气泡（个性化风格）
   ============================================================ */
const ChatBubble: React.FC<{
  msg: ChatMessage;
  char?: Character;
  userAvatar?: string;
}> = ({ msg, char, userAvatar }) => {
  const isUser = msg.role === "user";

  return (
    <motion.div
      className={`apt-bubble ${isUser ? "apt-bubble-user" : "apt-bubble-char"}`}
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {!isUser && char && (
        <div className="apt-bubble-avatar-wrap">
          <div
            className="apt-bubble-avatar"
            style={{
              background: `linear-gradient(135deg, ${BUBBLE_THEMES[char.id]?.bg || char.color}80, ${BUBBLE_THEMES[char.id]?.accent || char.accentColor}60)`,
              color: BUBBLE_THEMES[char.id]?.deco || char.color,
              boxShadow: `0 2px 8px ${BUBBLE_THEMES[char.id]?.deco || char.color}30`,
            }}
          >
            <span className="apt-bubble-avatar-emoji">{char.emoji}</span>
          </div>
          <div
            className="apt-bubble-avatar-tail"
            style={{
              borderRightColor: BUBBLE_THEMES[char.id]?.deco ? `${BUBBLE_THEMES[char.id].deco}20` : `${char.color}18`,
            }}
          />
        </div>
      )}
      {isUser && (
        <div className="apt-bubble-avatar-wrap">
          <div className="apt-bubble-avatar" style={{ background: "linear-gradient(135deg, #FFD0E025, #FFB8C815)", color: "#E88A9A" }}>
            {userAvatar ? (
              <img src={userAvatar} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <span className="apt-bubble-avatar-emoji">🐕</span>
            )}
          </div>
          <div className="apt-bubble-avatar-tail" style={{ borderLeftColor: "#E88A9A18" }} />
        </div>
      )}
      <div
        className={`apt-bubble-body ${isUser ? "apt-bubble-linepuppy" : ""} ${!isUser && char ? `apt-bubble-themed` : ""}`}
        style={
          isUser
            ? {
                background: "linear-gradient(135deg, #FFE0E8 0%, #FFD0E0 100%)",
                color: "#3D3830",
                boxShadow: "0 2px 12px -4px rgba(240,160,176,0.3)",
                border: "2px solid #F0A0B0",
              }
            : char && BUBBLE_THEMES[char.id]
              ? {
                  background: BUBBLE_THEMES[char.id].bg,
                  color: "#3D3830",
                  border: `2px solid ${BUBBLE_THEMES[char.id].border}`,
                  boxShadow: `0 2px 12px -4px ${BUBBLE_THEMES[char.id].deco}25`,
                }
              : char
                ? {
                    background: `linear-gradient(135deg, ${char.color}10, ${char.accentColor}08)`,
                    color: "#3D3830",
                    border: `1.5px solid ${char.color}22`,
                    boxShadow: `0 2px 12px -4px ${char.color}18`,
                  }
                : { background: "#2a2620", color: "#e0dcd2" }
        }
      >
        {/* 用户线条小狗装饰 */}
        {isUser && (
          <>
            <LinePuppySVG />
            <StarDeco color="#A0C0E8" size={14} top={-10} left={-20} />
            <StarDeco color="#F0A0C0" size={10} top={-4} left={10} />
            <div className="apt-bubble-knobs">
              <div className="apt-knob apt-knob-red" />
              <div className="apt-knob apt-knob-white" />
            </div>
          </>
        )}
        {/* 角色装饰 SVG */}
        {!isUser && char && getBubbleDeco(char.id)}
        {!isUser && char && (
          <span className="apt-bubble-name" style={{ color: BUBBLE_THEMES[char.id]?.deco || char.color }}>
            {char.name}
          </span>
        )}
        <div className="apt-bubble-text">
          {msg.content.split("\n").map((line, i) =>
            line.trim() ? <p key={i}>{line}</p> : <br key={i} />
          )}
        </div>
        <span className="apt-bubble-time">
          {msg.timestamp ? formatTime(msg.timestamp) : ""}
        </span>
      </div>
    </motion.div>
  );
};

/* ============================================================
   主组件
   ============================================================ */
const SystemTuningPage: React.FC = () => {
  const [view, setView] = useState<ViewMode>("lobby");
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  useEffect(() => { track("tool_enter", { tool_name: "爱情公寓" }); }, []);

  /* ===== 收藏/点赞系统 ===== */
  interface FavItem {
    itemId: string;
    charId: string;
    charName: string;
    charEmoji: string;
    feedText: string;
    charTitle: string;
    charColor: string;
    timestamp: number;
  }
  const [likedSet, setLikedSet] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wx_liked") || "[]")); } catch { return new Set(); }
  });
  const [favList, setFavList] = useState<FavItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("wx_favorites") || "[]"); } catch { return []; }
  });
  const [leafAnimations, setLeafAnimations] = useState<string[]>([]);
  const saveLiked = (s: Set<string>) => { setLikedSet(s); localStorage.setItem("wx_liked", JSON.stringify([...s])); };
  const saveFav = (l: FavItem[]) => { setFavList(l); localStorage.setItem("wx_favorites", JSON.stringify(l)); };

  const handleLike = (feedId: string) => {
    const next = new Set(likedSet);
    if (next.has(feedId)) next.delete(feedId); else next.add(feedId);
    saveLiked(next);
  };
  const handleFav = (feedId: string, char: Character, feedText: string) => {
    if (favList.some((f) => f.itemId === feedId)) return;
    const item: FavItem = {
      itemId: feedId,
      charId: char.id,
      charName: char.name,
      charEmoji: char.emoji,
      feedText,
      charTitle: char.title,
      charColor: char.color,
      timestamp: Date.now(),
    };
    saveFav([item, ...favList]);
    // 叶子飘落动画
    const id = `leaf-${Date.now()}`;
    setLeafAnimations((prev) => [...prev, id]);
    setTimeout(() => setLeafAnimations((prev) => prev.filter((x) => x !== id)), 1200);
  };
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contactSearch, setContactSearch] = useState("");
  const [groupTyping, setGroupTyping] = useState<string | null>(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ===== 朋友圈系统 ===== */
  interface MomentComment {
    id: string;
    author: string;
    authorAvatar: string;
    content: string;
    timestamp: number;
  }
  interface MomentItem {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    images: string[];
    tags: string[];
    visibility: "public" | "private" | "roommate";
    likes: number;
    likedByMe: boolean;
    likedBy: { name: string; avatar: string }[];
    comments: MomentComment[];
    timestamp: number;
    isMine: boolean;
  }
  const [moments, setMoments] = useState<MomentItem[]>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("wx_moments") || "[]");
      return raw;
    } catch { return []; }
  });

  // 启动时静默拉取远程最新朋友圈数据
  useEffect(() => {
    fetch("/api/moments")
      .then(r => r.json())
      .then(remote => {
        if (Array.isArray(remote) && remote.length > 0) {
          setMoments(remote);
          localStorage.setItem("wx_moments", JSON.stringify(remote));
        }
      })
      .catch(() => {});
  }, []);

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showPublishToast, setShowPublishToast] = useState(false);
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [workTitle, setWorkTitle] = useState("");
  const [workContent, setWorkContent] = useState("");
  const [workType, setWorkType] = useState<string>("ch2");
  const [workToast, setWorkToast] = useState(false);
  const [workLink, setWorkLink] = useState("");

  /* 章节定义（门牌号式） */
  const CHAPTER_OPTIONS = [
    { value: "ch1", icon: "🚪", num: "01", name: "初遇", placeholder: "推开 LeafBook 大门的那一刻…" },
    { value: "ch2", icon: "🛋️", num: "02", name: "陪伴", placeholder: "记录那些需要被听见的时刻…" },
    { value: "ch3", icon: "🔧", num: "03", name: "求助", placeholder: "写下一个问题，也许就有回音…" },
    { value: "ch4", icon: "📖", num: "04", name: "沉淀", placeholder: "深夜的思考，值得被好好安放…" },
  ] as const;

  type WorkItem = { id: string; title: string; content: string; chapterId: string; link: string; createdAt: number };

  const [works, setWorks] = useState<WorkItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("leafbook_works") || "[]"); } catch { return []; }
  });

  const saveWorkToast = (list: WorkItem[]) => {
    setWorks(list);
    localStorage.setItem("leafbook_works", JSON.stringify(list));
  };

  const handleSaveWork = () => {
    if (!workTitle.trim()) { alert("请填写作品标题"); return; }
    if (editingWorkId) {
      saveWorkToast(works.map((w) => w.id === editingWorkId ? { ...w, title: workTitle.trim(), content: workContent.trim(), chapterId: workType, link: workLink.trim() } : w));
    } else {
      const item: WorkItem = { id: `work-${Date.now()}`, title: workTitle.trim(), content: workContent.trim(), chapterId: workType, link: workLink.trim(), createdAt: Date.now() };
      saveWorkToast([...works, item]);
    }
    setWorkTitle("");
    setWorkContent("");
    setWorkLink("");
    setWorkType("ch2");
    setEditingWorkId(null);
    setShowWorkModal(false);
    setWorkToast(true);
    setTimeout(() => setWorkToast(false), 2000);
  };

  const openNewWorkModal = () => {
    setEditingWorkId(null);
    setWorkTitle("");
    setWorkContent("");
    setWorkLink("");
    setWorkType("ch2");
    setShowWorkModal(true);
  };

  const openEditWorkModal = (w: WorkItem) => {
    setEditingWorkId(w.id);
    setWorkTitle(w.title);
    setWorkContent(w.content);
    setWorkLink(w.link || "");
    setWorkType(w.chapterId);
    setShowWorkModal(true);
  };

  const closeWorkModal = () => {
    setEditingWorkId(null);
    setWorkTitle("");
    setWorkContent("");
    setWorkLink("");
    setWorkType("ch2");
    setShowWorkModal(false);
  };

  const getWorksByChapter = (chapterId: string) =>
    works.filter((w) => w.chapterId === chapterId).sort((a, b) => b.createdAt - a.createdAt);

  const handleDeleteWork = (id: string) => {
    saveWorkToast(works.filter((w) => w.id !== id));
    setWorkToast(true);
    setTimeout(() => setWorkToast(false), 1500);
  };
  const [publishText, setPublishText] = useState("");
  const [publishImages, setPublishImages] = useState<string[]>([]);
  const [publishTags, setPublishTags] = useState<string[]>([]);
  const [publishVisibility, setPublishVisibility] = useState<"public" | "private" | "roommate">("public");
  const [commentingMomentId, setCommentingMomentId] = useState<string | null>(null);
  const [expandedCommentsId, setExpandedCommentsId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const saveMoments = (list: MomentItem[]) => {
    setMoments(list);
    localStorage.setItem("wx_moments", JSON.stringify(list));
    // 异步推送到远程
    const payload = JSON.stringify({ password: "ling", data: list });
    if (payload.length > 900_000) {
      // GitHub Contents API 有 1MB 限制（base64 编码后体积约增 33%）
      console.warn("[moments] 数据过大，跳过远程同步:", (payload.length / 1024).toFixed(0), "KB");
      setSyncStatus("数据过大，仅保存在本地");
      setTimeout(() => setSyncStatus(null), 3000);
      return;
    }
    fetch("/api/moments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    })
      .then(async (r) => {
        if (r.ok) {
          setSyncStatus("已同步到云端");
          setTimeout(() => setSyncStatus(null), 2000);
        } else {
          const err = await r.text();
          console.warn("[moments] 远程同步失败:", r.status, err);
          setSyncStatus("同步失败，已保存本地");
          setTimeout(() => setSyncStatus(null), 3000);
        }
      })
      .catch((e) => {
        console.warn("[moments] 远程同步异常:", e);
        setSyncStatus("同步异常，已保存本地");
        setTimeout(() => setSyncStatus(null), 3000);
      });
  };
  const handlePublish = () => {
    if (!publishText.trim() && publishImages.length === 0) return;
    const newMoment: MomentItem = {
      id: `mom-${Date.now()}`,
      authorId: "me",
      authorName: meNickname,
      authorAvatar: meAvatar || "🍃",
      content: publishText.trim(),
      images: publishImages,
      tags: publishTags,
      visibility: publishVisibility,
      likes: 0,
      likedByMe: false,
      likedBy: [],
      comments: [],
      timestamp: Date.now(),
      isMine: true,
    };
    saveMoments([newMoment, ...moments]);
    track("apartment_post");
    setPublishText("");
    setPublishImages([]);
    setPublishTags([]);
    setPublishVisibility("public");
    setShowPublishModal(false);
    // toast 提示
    setShowPublishToast(true);
    setTimeout(() => setShowPublishToast(false), 2000);
    // 叶子动画
    const id = `leaf-pub-${Date.now()}`;
    setLeafAnimations((prev) => [...prev, id]);
    setTimeout(() => setLeafAnimations((prev) => prev.filter((x) => x !== id)), 1200);

    // AI 角色自动点赞 + 评论（延迟模拟真实朋友圈）
    triggerAIMomentReactions(newMoment.id, newMoment.content);
  };

  /** AI 角色自动对用户朋友圈进行点赞 + 评论 */
  const triggerAIMomentReactions = (momentId: string, content: string) => {
    // 随机选 2~4 个角色参与互动
    const shuffled = [...CHARACTERS].sort(() => Math.random() - 0.5);
    const reactors = shuffled.slice(0, 2 + Math.floor(Math.random() * 3));

    // 分配：部分点赞，部分评论，部分两者都做
    reactors.forEach((char, idx) => {
      const willLike = Math.random() > 0.15; // 85% 概率点赞
      const willComment = Math.random() > 0.4; // 60% 概率评论

      // 点赞（延迟 1~4 秒，错开时间）
      if (willLike) {
        const likeDelay = 1000 + Math.random() * 3000 + idx * 500;
        setTimeout(() => {
          setMoments(prev => {
            const updated = prev.map(m => {
              if (m.id !== momentId) return m;
              if (m.likedBy.some(l => l.name === char.name)) return m;
              return { ...m, likes: m.likes + 1, likedBy: [...m.likedBy, { name: char.name, avatar: char.emoji }] };
            });
            localStorage.setItem("wx_moments", JSON.stringify(updated));
            return updated;
          });
        }, likeDelay);
      }

      // 评论（延迟 3~8 秒，让点赞先到）
      if (willComment) {
        const commentDelay = 3000 + Math.random() * 5000 + idx * 800;
        setTimeout(async () => {
          try {
            const replyContent = await callAI(
              `${char.systemPrompt}\n\n你是爱情公寓的室友，看到室友发了条朋友圈，请用你的角色语气评论一句。评论要简短（20字以内），自然、有趣，符合你的性格。可以调侃、安慰、吐槽、附和。\n\n${getRealTimeContext()}`,
              [{ role: "user", content: `室友发了一条朋友圈：「${content.slice(0, 80)}」，你怎么评论？只输出评论内容，不要加引号或前缀。` }],
              { maxTokens: 60, temperature: 0.9 }
            );
            const trimmedReply = (replyContent || "").replace(/^["'「]|["'」]$/g, "").trim().slice(0, 40);
            if (!trimmedReply) return;
            setMoments(prev => {
              const updated = prev.map(m => {
                if (m.id !== momentId) return m;
                return {
                  ...m,
                  comments: [...m.comments, {
                    id: `cmt-ai-${Date.now()}-${idx}`,
                    author: char.name,
                    authorAvatar: char.emoji,
                    content: trimmedReply,
                    timestamp: Date.now(),
                  }],
                };
              });
              localStorage.setItem("wx_moments", JSON.stringify(updated));
              return updated;
            });
          } catch { /* AI 调用失败静默处理 */ }
        }, commentDelay);
      }
    });
  };
  const handleLikeMoment = (momentId: string) => {
    const list = moments.map((m) => {
      if (m.id !== momentId) return m;
      return { ...m, likes: m.likedByMe ? m.likes - 1 : m.likes + 1, likedByMe: !m.likedByMe };
    });
    saveMoments(list);
  };
  const handleDeleteMoment = (momentId: string) => {
    if (!confirm("确定删除这条动态吗？")) return;
    saveMoments(moments.filter((m) => m.id !== momentId));
  };
  const handleComment = (momentId: string) => {
    if (!commentText.trim()) return;
    const cmtId = `cmt-${Date.now()}`;
    const list = moments.map((m) => {
      if (m.id !== momentId) return m;
      return {
        ...m,
        comments: [...m.comments, {
          id: cmtId,
          author: meNickname,
          authorAvatar: meAvatar || "🍃",
          content: commentText.trim(),
          timestamp: Date.now(),
        }],
      };
    });
    saveMoments(list);
    setCommentText("");
    setCommentingMomentId(null);

    // AI 自动回复（随机延迟 500ms-2s）
    const targetMoment = list.find(m => m.id === momentId);
    if (!targetMoment) return;
    const charId = targetMoment.authorId !== "me" ? targetMoment.authorId : "zeng";
    const character = getCharacter(charId);
    if (!character) return;
    const delay = 500 + Math.random() * 1500;
    setTimeout(async () => {
      try {
        const replyContent = await callAI(
          `你是${character.name}（${character.title}），用你角色的语气回复朋友圈评论。回复要简短（15字以内），符合角色性格。\n\n${getRealTimeContext()}`,
          [{ role: "user", content: `有人评论了你的朋友圈「${targetMoment.content.slice(0, 50)}」：「${commentText.trim()}」，你怎么回复？只输出回复内容，不要加引号或前缀。` }],
          { maxTokens: 50, temperature: 0.85 }
        );
        const trimmedReply = (replyContent || "").replace(/^["'「]|["'」]$/g, "").trim().slice(0, 30);
        if (!trimmedReply) return;
        setMoments(prev => {
          const updated = prev.map((m) => {
            if (m.id !== momentId) return m;
            return {
              ...m,
              comments: [...m.comments, {
                id: `cmt-ai-${Date.now()}`,
                author: character.name,
                authorAvatar: character.avatar,
                content: trimmedReply,
                timestamp: Date.now(),
              }],
            };
          });
          localStorage.setItem("wx_moments", JSON.stringify(updated));
          return updated;
        });
      } catch { /* AI 调用失败静默处理 */ }
    }, delay);
  };
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return "刚刚";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    return `${Math.floor(diff / 86400000)}天前`;
  };

  const selectedChar = selectedCharId ? getCharacter(selectedCharId) : undefined;

  /** 关于弹窗 */
  const openAboutModal = () => setShowAboutModal(true);
  const closeAboutModal = () => setShowAboutModal(false);

  /* ===== 微信风格聊天列表数据 ===== */
  const chatList = [
    { id: "group", type: "group", name: "公寓群聊", avatar: "🏠", lastMsg: "点击发起群聊", time: "" },
    { id: "zeng", name: "曾小贤", avatar: "👨", lastMsg: "收听电台", time: "12:00" },
    { id: "fei", name: "胡一菲", avatar: "👩", lastMsg: "找一菲谈心", time: "11:58" },
    { id: "meijia", name: "陈美嘉", avatar: "🍭", lastMsg: "给美嘉发消息", time: "11:30" },
    { id: "lv", name: "吕子乔", avatar: "🃏", lastMsg: "讨教泡面秘籍", time: "10:15" },
    { id: "guangu", name: "关谷神奇", avatar: "✏️", lastMsg: "找关谷画画", time: "09:42" },
    { id: "youyou", name: "唐悠悠", avatar: "🎭", lastMsg: "看悠悠剧评", time: "昨天" },
    { id: "zhangwei", name: "张伟", avatar: "⚖️", lastMsg: "呼叫张益达", time: "周一" },
  ];

  /* ===== 通讯录：角色拼音首字母映射 ===== */
  const contactMap: Record<string, { id: string; name: string; avatar: string; letter: string }> = {
    zeng:     { id: "zeng",     name: "曾小贤",   avatar: "👨", letter: "Z" },
    fei:      { id: "fei",      name: "胡一菲",   avatar: "👩", letter: "H" },
    meijia:   { id: "meijia",   name: "陈美嘉",   avatar: "🍭", letter: "C" },
    lv:       { id: "lv",       name: "吕子乔",   avatar: "🃏", letter: "L" },
    guangu:   { id: "guangu",   name: "关谷神奇", avatar: "✏️", letter: "G" },
    youyou:   { id: "youyou",   name: "唐悠悠",   avatar: "🎭", letter: "T" },
    zhangwei: { id: "zhangwei", name: "张伟",     avatar: "⚖️", letter: "Z" },
  };
  const contactList = Object.values(contactMap).sort((a, b) => {
    if (a.letter !== b.letter) return a.letter.localeCompare(b.letter);
    return a.name.localeCompare(b.name, "zh-CN");
  });
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const groupedContacts = allLetters.map((letter) => ({
    letter,
    items: contactList.filter((c) => c.letter === letter),
  }));

  /* ===== 时间格式化工具 ===== */
  const formatDateLabel = (ts: number) => {
    const now = new Date();
    const t = new Date(ts);
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tDate = new Date(t.getFullYear(), t.getMonth(), t.getDate());
    const diff = Math.round((nowDate.getTime() - tDate.getTime()) / 86400000);
    if (diff === 0) return "今天";
    if (diff === 1) return "昨天";
    return `${String(t.getMonth() + 1).padStart(2, "0")}/${String(t.getDate()).padStart(2, "0")}`;
  };

  /* ===== localStorage 持久化 ===== */
  const LS_KEY_PREFIX = "apt_chat_";
  const LS_PROFILE_KEY = "apt_user_profile";
  const saveChatHistory = (charId: string, msgs: ChatMessage[]) => {
    try {
      localStorage.setItem(`${LS_KEY_PREFIX}${charId}`, JSON.stringify(msgs));
    } catch { /* ignore */ }
  };
  const loadChatHistory = (charId: string): ChatMessage[] => {
    try {
      const raw = localStorage.getItem(`${LS_KEY_PREFIX}${charId}`);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  };

  /* ===== 用户画像（可选） ===== */
  const [userProfile] = useState<{ tags: string[] }>(() => {
    try {
      const raw = localStorage.getItem(LS_PROFILE_KEY);
      return raw ? JSON.parse(raw) : { tags: ["失眠", "省钱"] };
    } catch { return { tags: ["失眠", "省钱"] }; }
  });

  /* ===== 个人中心状态 ===== */
  const LS_ME_KEY = "apt_me_profile";
  const [meProfile, setMeProfile] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_ME_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });
  const [meAvatar, setMeAvatar] = useState<string>(meProfile.avatar || "");
  const [meNickname, setMeNickname] = useState<string>(meProfile.nickname || "新晋房客");
  const [meSignature, setMeSignature] = useState<string>(meProfile.signature || "正在 LeafBook 里散步…");
  const [meMood, setMeMood] = useState<string>(meProfile.mood || "🌙 失眠中");
  const [showMoodPicker, setShowMoodPicker] = useState(false);

  /* ===== "我"页面折叠状态 ===== */
  const [foldFav, setFoldFav] = useState(false);
  const [foldMoments, setFoldMoments] = useState(true);
  const [foldWorks, setFoldWorks] = useState(false);
  const [foldCh1, setFoldCh1] = useState(false);
  const [foldCh2, setFoldCh2] = useState(false);
  const [foldCh3, setFoldCh3] = useState(false);
  const [foldCh4, setFoldCh4] = useState(false);

  /* ===== 聊天背景系统（按会话保存） ===== */
  const [sessionBgs, setSessionBgs] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem("wx_session_bg") || "{}"); } catch { return {}; }
  });
  const [bgFileInputRef] = useState<{ current: HTMLInputElement | null }>({ current: null });

  const getCurrentSessionId = (): string => {
    if (view === "groupchat") return "group";
    return selectedCharId || "unknown";
  };
  const currentBg = sessionBgs[getCurrentSessionId()] || "";

  const saveSessionBgs = (bgs: Record<string, string>) => {
    setSessionBgs(bgs);
    localStorage.setItem("wx_session_bg", JSON.stringify(bgs));
  };
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("图片不能超过 5MB"); return; }
    const url = URL.createObjectURL(file);
    const sid = getCurrentSessionId();
    // revoke old URL
    if (sessionBgs[sid]) URL.revokeObjectURL(sessionBgs[sid]);
    saveSessionBgs({ ...sessionBgs, [sid]: url });
  };

  /* ===== 发现页状态 ===== */
  const saveMeProfile = (updates: Partial<{ avatar: string; nickname: string; signature: string; mood: string }>) => {
    const next = { ...meProfile, ...updates };
    setMeProfile(next);
    try { localStorage.setItem(LS_ME_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setMeAvatar(dataUrl);
      saveMeProfile({ avatar: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleEditNickname = () => {
    const val = window.prompt("修改昵称（最多10字）:", meNickname);
    if (val !== null && val.trim()) {
      const trimmed = val.trim().slice(0, 10);
      setMeNickname(trimmed);
      saveMeProfile({ nickname: trimmed });
    }
  };

  const handleEditSignature = () => {
    const val = window.prompt("修改签名（最多20字）:", meSignature);
    if (val !== null && val.trim()) {
      const trimmed = val.trim().slice(0, 20);
      setMeSignature(trimmed);
      saveMeProfile({ signature: trimmed });
    }
  };

  const moodOptions = ["🌙 正在失眠", "🎧 收听电台", "💻 码农中", "🍔 寻找美食", "🤖 贤菲普通朋友", "😴 张伟的梦乡"];
  const handleSelectMood = (mood: string) => {
    setMeMood(mood);
    saveMeProfile({ mood });
    setShowMoodPicker(false);
  };
  const handleCustomMood = () => {
    const val = window.prompt("自定义状态（最多10字）:", "");
    if (val !== null && val.trim()) {
      const trimmed = val.trim().slice(0, 10);
      setMeMood(trimmed);
      saveMeProfile({ mood: trimmed });
      setShowMoodPicker(false);
    }
  };

  /* ===== 个人主页背景图 ===== */
  const [meBgUrl, setMeBgUrl] = useState<string>(() => {
    try { return JSON.parse(localStorage.getItem("leafbook_profile") || "{}").bg_url || ""; } catch { return ""; }
  });
  const handleMeBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("背景图不能超过 5MB"); return; }
    if (meBgUrl) URL.revokeObjectURL(meBgUrl);
    const url = URL.createObjectURL(file);
    setMeBgUrl(url);
    try {
      const p = JSON.parse(localStorage.getItem("leafbook_profile") || "{}");
      p.bg_url = url;
      localStorage.setItem("leafbook_profile", JSON.stringify(p));
    } catch {}
  };

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, []);

  /** 进入单个角色聊天 */
  const enterChat = (charId: string) => {
    playDial();
    setSelectedCharId(charId);
    const history = loadChatHistory(charId);
    setMessages(history);
    setInputText("");
    setView("chat");
    setTimeout(() => playConnect(), 400);
  };

  /** 返回客厅 */
  const backToLobby = () => {
    setView("lobby");
    setSelectedCharId(null);
    setMessages([]);
    setInputText("");
    setGroupTyping(null);
  };

  /** 发起群聊（从客厅大厅） */
  const startGroupChat = async (text: string, charIds: string[]) => {
    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    let currentMessages: ChatMessage[] = [userMsg];
    setMessages(currentMessages);
    setInputText("");
    setIsLoading(true);
    setView("groupchat");
    setSelectedCharId(charIds[0]);
    playGroupBell();
    scrollToBottom();

    for (const charId of charIds) {
      const char = getCharacter(charId);
      if (!char) continue;
      setGroupTyping(char.name);
      scrollToBottom();

      const historyMsgs = currentMessages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.role === "user" ? m.content : `${getCharacter(m.characterId!)?.name}说：${m.content}`,
      }));

      const fullPrompt = `${char.systemPrompt}\n\n你是群聊中的一员，请自然接话，不要重复别人的话。\n\n${getRealTimeContext()}`;
      const reply = await callAI(fullPrompt, historyMsgs, { maxTokens: 180 });

      const charMsg: ChatMessage = {
        id: uid(),
        role: "character",
        characterId: charId,
        content: reply,
        timestamp: Date.now(),
      };
      currentMessages = [...currentMessages, charMsg];
      setMessages(currentMessages);
      playConnect();
      scrollToBottom();
      await new Promise((r) => setTimeout(r, 600));
    }

    saveChatHistory(charIds[0], currentMessages);
    setGroupTyping(null);
    setIsLoading(false);
  };

  /** 发送消息（单聊或触发群聊） */
  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText("");
    setIsLoading(true);
    scrollToBottom();
    track("apartment_chat", { view });

    // 检测是否触发群聊（仅在从群聊页面发送时检测）
    const groupResult = (view === "groupchat") ? resolveGroupChat(text) : null;

    if (groupResult && groupResult.responders.length > 0) {
      // ===== 群聊模式（@提及 + 接力） =====
      setView("groupchat");
      playGroupBell();

      let currentMsgs = [...updatedMessages];

      for (const charId of groupResult.responders) {
        const char = getCharacter(charId);
        if (!char) continue;
        setGroupTyping(char.name);
        scrollToBottom();

        // 构建历史消息上下文（含前文所有角色回复）
        const historyMsgs = currentMsgs.map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.role === "user" ? m.content : `${getCharacter(m.characterId!)?.name}说：${m.content}`,
        }));

        // 构建 prompt：基础人设 + 群聊接话指令 + @提及指令
        const isMentioned = groupResult.mentionedId === charId;
        const mentionHint = isMentioned
          ? `\n\n【重要】用户直接@了你（${char.name}），请你优先回应用户的问题/话题，态度自然。`
          : "";
        const relayHint = groupResult.responders.length > 1
          ? `\n\n你是群聊中的一员。前面已有其他室友发言，请你自然地“接话”或“补刀”，不要重复别人说过的话。可以调侃、吐槽、附和，保持轻松氛围。`
          : "";
        const fullPrompt = `${char.systemPrompt}${mentionHint}${relayHint}\n\n${getRealTimeContext()}`;

        const reply = await callAI(fullPrompt, historyMsgs, { maxTokens: 180 });

        const charMsg: ChatMessage = {
          id: uid(),
          role: "character",
          characterId: charId,
          content: reply,
          timestamp: Date.now(),
        };
        currentMsgs = [...currentMsgs, charMsg];
        setMessages(currentMsgs);
        playConnect();
        scrollToBottom();

        // 随机延迟 800-1500ms，模拟真人打字
        const delay = 800 + Math.floor(Math.random() * 700);
        await new Promise((r) => setTimeout(r, delay));
      }

      saveChatHistory(groupResult.responders[0], currentMsgs);
      setGroupTyping(null);
      setIsLoading(false);
    } else if (selectedChar) {
      // ===== 单聊模式 =====
      const historyMsgs = updatedMessages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));

      const profileHint = userProfile.tags.length > 0
        ? `\n\n用户画像标签：${userProfile.tags.join("、")}。请根据这些标签调整回复风格，让对话更贴合用户状态。`
        : "";

      const reply = await callAI(
        selectedChar.systemPrompt + profileHint + "\n\n" + getRealTimeContext(),
        historyMsgs,
        { maxTokens: 200 }
      );

      const charMsg: ChatMessage = {
        id: uid(),
        role: "character",
        characterId: selectedChar.id,
        content: reply,
        timestamp: Date.now(),
      };
      const finalMessages = [...updatedMessages, charMsg];
      setMessages(finalMessages);
      saveChatHistory(selectedChar.id, finalMessages);
      playConnect();
      scrollToBottom();
      setIsLoading(false);
    }
  };

  return (
    <div className="apt-page">
      {/* ===== 顶部导航 ===== */}
      <header className="apt-topbar">
        <Link to="/mickey" className="apt-back">
          ← 回到作品集
        </Link>
        {view !== "lobby" && (
          <button className="apt-back apt-back-ghost" onClick={backToLobby}>
            ← 回到 3602
          </button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {/* ===== 微信风格聊天列表页 ===== */}
        {view === "lobby" && (
          <motion.div
            key="lobby"
            className="wx-lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 顶部导航栏 */}
            <header className="wx-header">
              <div className="wx-header-left" />
              <h1 className="wx-header-title">爱情公寓</h1>
              <button className="wx-header-easter" onClick={openAboutModal}>?</button>
            </header>

            {/* 关于弹窗 */}
            <AnimatePresence>
              {showAboutModal && (
                <motion.div
                  className="wx-modal-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={closeAboutModal}
                >
                  <motion.div
                    className="wx-modal wx-modal-about"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="wx-modal-title">📜 致第 8 位房客</h2>
                    <div className="wx-modal-body">
                      <p>一个人面对AI，总觉得少了点温度。</p>
                      <p>怕打扰别人，又不想一个人自言自语——</p>
                      <p>这种说不清道不明的孤独，我们都懂。</p>
                      <br />
                      <p>所以，我们把爱情公寓搬进了屏幕。</p>
                      <p>这里没有冰冷的对话框，</p>
                      <p>只有七位熟悉的室友，随时在线，随时接话。</p>
                      <br />
                      <p className="wx-modal-highlight">
                        你不再是第8位房客，<br />
                        你是这个客厅的主人。
                      </p>
                      <br />
                      <p>想吐槽就吐槽，想安静就安静。</p>
                      <p>这个公寓，永远为你亮着灯。</p>
                    </div>
                    <button
                      className="wx-modal-btn wx-modal-about-btn"
                      onClick={() => {
                        closeAboutModal();
                        console.log("🏠 第8位房客已入住 LeafBook");
                      }}
                    >
                      推门进屋
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 聊天列表 */}
            <div className="wx-list">
              {chatList.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="wx-item"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  whileTap={{ backgroundColor: "#e5e5e5" }}
                  onClick={() => {
                    if (item.type === "group") {
                      const text = "有人在吗？出来聊聊~";
                      const shuffled = [...CHARACTERS].sort(() => Math.random() - 0.5);
                      const picks = shuffled.slice(0, 3 + Math.floor(Math.random() * 2));
                      startGroupChat(text, picks.map((c) => c.id));
                    } else {
                      enterChat(item.id);
                    }
                  }}
                >
                  <div className="wx-avatar">{item.avatar}</div>
                  <div className="wx-info">
                    <div className="wx-info-top">
                      <span className="wx-name">{item.name}</span>
                      <span className="wx-time">
                        {(() => {
                          const history = loadChatHistory(item.id);
                          const last = history[history.length - 1];
                          return last?.timestamp ? formatDateLabel(last.timestamp) : item.time;
                        })()}
                      </span>
                    </div>
                    <div className="wx-msg">{item.lastMsg}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 底部 Tab 栏 */}
            <WxTabBar active="lobby" onTab={setView} />
          </motion.div>
        )}

        {/* ===== 通讯录页面 ===== */}
        {view === "contacts" && (
          <motion.div
            key="contacts"
            className="wx-lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 顶部导航栏 */}
            <header className="wx-header">
              <div className="wx-header-left" />
              <h1 className="wx-header-title">室友名录</h1>
              <div className="wx-header-left" />
            </header>

            {/* 搜索栏 */}
            <div className="wx-contact-search">
              <input
                type="text"
                placeholder="搜索室友"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                className="wx-contact-search-input"
              />
            </div>

            {/* 通讯录列表（按字母分组） */}
            <div className="wx-list" style={{ paddingTop: 0, position: "relative" }}>
              {groupedContacts
                .filter((g) => g.items.some((c) => c.name.includes(contactSearch)))
                .map((group) => (
                  <div key={group.letter} className="wx-contact-section" id={`contact-section-${group.letter}`}>
                    <div className="wx-contact-section-label">{group.letter}</div>
                    {group.items
                      .filter((c) => c.name.includes(contactSearch))
                      .map((item) => (
                        <div
                          key={item.id}
                          className="wx-contact-row"
                          onClick={() => enterChat(item.id)}
                        >
                          <div className="wx-contact-avatar">{item.avatar}</div>
                          <div className="wx-contact-name">{item.name}</div>
                        </div>
                      ))}
                  </div>
                ))}
            </div>

            {/* 右侧 A-Z 索引 */}
            <div className="wx-contact-index">
              {allLetters.map((letter) => {
                const hasItem = groupedContacts.find((g) => g.letter === letter)?.items.length ?? 0 > 0;
                return (
                  <div
                    key={letter}
                    className={`wx-contact-index-letter ${hasItem ? "wx-contact-index-active" : ""}`}
                    onClick={() => {
                      const el = document.getElementById(`contact-section-${letter}`);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>

            {/* 底部 Tab 栏 */}
            <WxTabBar active="contacts" onTab={setView} />
          </motion.div>
        )}

        {/* ===== 发现页面（爱情公寓客厅动态） ===== */}
        {view === "discover" && (
          <motion.div
            key="discover"
            className="wx-lobby wx-discover-lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 顶部导航栏 */}
            <header className="wx-header">
              <div className="wx-header-left" />
              <h1 className="wx-header-title">发现</h1>
              <div className="wx-header-left" />
            </header>

            {/* 发现页内容（角色特长入口） */}
            <div className="wx-discover-scroll">
              {/* 页面标题 */}
              <div className="wx-discover-header">
                <div className="wx-discover-header-title-sm">发现</div>
                <div className="wx-discover-header-sub">公寓室友的隐藏技能</div>
              </div>

              {/* 角色状态卡片列表 */}
              <div className="wx-discover-list">
                {CHARACTERS.map((char, idx) => (
                  <motion.div
                    key={char.id}
                    className="wx-discover-role-card"
                    style={{ borderLeft: `3px solid ${char.color}` }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.06 }}
                    whileTap={{ scale: 0.98, opacity: 0.85 }}
                    onClick={() => {
                      setSelectedProfileId(char.id);
                      setView("profile");
                    }}
                  >
                    <div className="wx-discover-role-icon">{char.emoji}</div>
                    <div className="wx-discover-role-info">
                      <div className="wx-discover-role-name">
                        {char.name}
                        <span className="wx-discover-role-title">{char.title}</span>
                      </div>
                      <div className="wx-discover-role-subtitle">{char.status}</div>
                    </div>
                    <div className="wx-discover-role-arrow">›</div>
                  </motion.div>
                ))}
              </div>

              {/* 用户朋友圈同步（发现广场） */}
              {moments.filter((m) => m.visibility !== "private").length > 0 && (
                <div className="wx-discover-feed-section">
                  <div className="wx-discover-feed-title">🌿 房客动态</div>
                  {moments
                    .filter((m) => m.visibility !== "private")
                    .map((m) => (
                      <div key={m.id} className="wx-discover-feed-card">
                        <div className="wx-discover-feed-header">
                          <span className="wx-discover-feed-avatar">{m.authorAvatar}</span>
                          <span className="wx-discover-feed-name">{m.authorName}</span>
                          <span className="wx-discover-feed-time">{formatTime(m.timestamp)}</span>
                        </div>
                        <div className="wx-discover-feed-text">{m.content}</div>
                        {m.images.length > 0 && (
                          <div className="wx-discover-feed-images">
                            {m.images.map((img, i) => (
                              <div key={i} className="wx-discover-feed-img" style={{ backgroundImage: `url(${img})` }} />
                            ))}
                          </div>
                        )}
                        {m.tags.length > 0 && (
                          <div className="wx-discover-feed-tags">
                            {m.tags.map((t) => (
                              <span key={t} className="wx-discover-feed-tag">{t}</span>
                            ))}
                          </div>
                        )}
                        <div className="wx-discover-feed-bottom">
                          <span className={`wx-discover-feed-action ${m.likedByMe ? "wx-moment-liked" : ""}`} onClick={() => handleLikeMoment(m.id)}>
                            {m.likedByMe ? "❤️" : "🤍"} {m.likes > 0 ? m.likes : ""}
                          </span>
                          <span
                            className="wx-discover-feed-action"
                            onClick={() => setCommentingMomentId(commentingMomentId === m.id ? null : m.id)}
                          >
                            💬 {m.comments.length > 0 ? m.comments.length : ""}
                          </span>
                          <span className="wx-discover-feed-leaf">🍃</span>
                        </div>

                        {/* AI 点赞展示 */}
                        {m.likedBy.length > 0 && (
                          <div className="wx-moment-liked-by">
                            ❤️ {m.likedBy.map((l) => l.avatar).join(" ")} {m.likedBy.map((l) => l.name).join("、")}
                            {m.likedByMe ? "、你" : ""}觉得很赞
                          </div>
                        )}

                        {/* 评论区（默认折叠） */}
                        {m.comments.length > 0 && (
                          <div
                            className="wx-moment-comments-toggle"
                            onClick={() => setExpandedCommentsId(expandedCommentsId === m.id ? null : m.id)}
                          >
                            {expandedCommentsId === m.id ? "收起评论" : `${m.comments.length}条评论 ▾`}
                          </div>
                        )}
                        {expandedCommentsId === m.id && m.comments.length > 0 && (
                          <div className="wx-moment-comments">
                            {m.comments.map((c) => (
                              <div key={c.id} className="wx-moment-comment">
                                <span className="wx-moment-comment-avatar">{c.authorAvatar}</span>
                                <div className="wx-moment-comment-body">
                                  <span className="wx-moment-comment-author">{c.author}</span>
                                  <span className="wx-moment-comment-text">{c.content}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 评论输入框 */}
                        {commentingMomentId === m.id && (
                          <div className="wx-moment-comment-input">
                            <input
                              type="text"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="写评论..."
                              onKeyDown={(e) => { if (e.key === "Enter") handleComment(m.id); }}
                            />
                            <button onClick={() => handleComment(m.id)}>发送</button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {/* Toast */}
              {showPublishToast && (
                <motion.div
                  className="wx-publish-toast"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  已同步到发现广场 🌿
                </motion.div>
              )}

              {/* 远程同步状态提示 */}
              {syncStatus && (
                <motion.div
                  className="wx-sync-toast"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {syncStatus}
                </motion.div>
              )}

              <div className="wx-discover-footer">LeafBook · 让情绪有处安放</div>
            </div>

            {/* 底部 Tab 栏 */}
            <WxTabBar active="discover" onTab={setView} />
          </motion.div>
        )}

        {/* ===== 角色详情页 ===== */}
        {view === "profile" && selectedProfileId && (
          <motion.div
            key="profile"
            className="wx-lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {(() => {
              const char = getCharacter(selectedProfileId);
              if (!char) return null;
              const feeds = CHARACTER_FEEDS[selectedProfileId] || [];
              return (
                <>
                  {/* 顶部导航栏 */}
                  <header className="wx-header">
                    <div className="wx-header-left" onClick={() => setView("discover")} style={{ cursor: "pointer", fontSize: 14 }}>
                      ‹ 返回
                    </div>
                    <h1 className="wx-header-title">{char.name}</h1>
                    <div className="wx-header-left" />
                  </header>

                  <div className="wx-profile-scroll">
                    {/* 顶部：大头像 + 昵称 + 标签 */}
                    <div className="wx-profile-hero" style={{ background: char.bgColor }}>
                      <div className="wx-profile-avatar">{char.emoji}</div>
                      <div className="wx-profile-name">{char.name}</div>
                      <div className="wx-profile-tag" style={{ background: char.color }}>{char.title}</div>
                      <div className="wx-profile-room">{char.room}</div>
                      <div className="wx-profile-catchphrase">"{char.catchphrase}"</div>
                    </div>

                    {/* 中部：动态流 */}
                    <div className="wx-profile-feed">
                      <div className="wx-profile-feed-title">动态</div>
                      {feeds.map((feed, idx) => (
                        <motion.div
                          key={feed.id}
                          className="wx-profile-feed-item"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.08 }}
                        >
                          <div className="wx-profile-feed-text">{feed.text}</div>
                          <div className="wx-profile-feed-bottom">
                            <div className="wx-profile-feed-time">{feed.time}</div>
                            <div className="wx-profile-feed-actions">
                              <span
                                className={`wx-feed-btn ${likedSet.has(`${char.id}_${feed.id}`) ? "wx-feed-btn-liked" : ""}`}
                                onClick={(e) => { e.stopPropagation(); handleLike(`${char.id}_${feed.id}`); }}
                              >
                                {likedSet.has(`${char.id}_${feed.id}`) ? "❤️" : "🤍"} {likedSet.has(`${char.id}_${feed.id}`) ? "1" : ""}
                              </span>
                              <span
                                className={`wx-feed-btn ${favList.some((f) => f.itemId === `${char.id}_${feed.id}`) ? "wx-feed-btn-faved" : ""}`}
                                onClick={(e) => { e.stopPropagation(); handleFav(`${char.id}_${feed.id}`, char, feed.text); }}
                              >
                                {favList.some((f) => f.itemId === `${char.id}_${feed.id}`) ? "⭐" : "☆"} {favList.some((f) => f.itemId === `${char.id}_${feed.id}`) ? "已收藏" : "收藏"}
                              </span>
                              {favList.some((f) => f.itemId === `${char.id}_${feed.id}`) && <span className="wx-feed-leaf-mark">🍃</span>}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* 底部：去聊天按钮 */}
                    <div className="wx-profile-actions">
                      <button
                        className="wx-profile-chat-btn"
                        style={{ background: char.color }}
                        onClick={() => {
                          enterChat(char.id);
                        }}
                      >
                        去聊天
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
            {/* 叶子飘落动画 */}
            {leafAnimations.map((id) => (
              <motion.div
                key={id}
                className="wx-leaf-fall"
                initial={{ opacity: 1, y: 0, x: 0, rotate: 0 }}
                animate={{ opacity: 0, y: 200, x: 30, rotate: 360 }}
                transition={{ duration: 1.2, ease: "easeIn" }}
              >
                🍃
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ===== 我（个人中心）页面 ===== */}
        {view === "me" && (
          <motion.div
            key="me"
            className="wx-lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 顶部导航栏 */}
            <header className="wx-header">
              <div className="wx-header-left" />
              <h1 className="wx-header-title">我</h1>
              <div className="wx-header-left" />
            </header>

            {/* 个人中心内容 */}
            <div className="wx-me-scroll">
              {/* 1. 个人身份区（背景图 + 毛玻璃卡片） */}
              <div className="wx-me-hero" style={meBgUrl ? { backgroundImage: `url(${meBgUrl})` } : { background: "linear-gradient(180deg, #E8F4E8 0%, #FFF8E7 100%)" }}>
                {/* 更换背景按钮 */}
                <label className="wx-me-bg-btn" title="更换背景">
                  🖼️
                  <input type="file" accept="image/*" style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} onChange={handleMeBgUpload} />
                </label>

                {/* 毛玻璃卡片 */}
                <div className="wx-me-glass-card">
                  <label className="wx-me-avatar wx-me-avatar-upload" style={{ cursor: "pointer", position: "relative" }}>
                    {meAvatar ? (
                      <img src={meAvatar} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "28px" }}>🍃</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                      onChange={handleAvatarUpload}
                    />
                  </label>
                  <div className="wx-me-info">
                    <div className="wx-me-name" onClick={handleEditNickname}>
                      {meNickname}
                      <span className="wx-me-edit">✏️</span>
                    </div>
                    <div className="wx-me-signature" onClick={handleEditSignature}>
                      {meSignature}
                      <span className="wx-me-edit" style={{ marginLeft: 4, fontSize: 10 }}>✏️</span>
                    </div>
                    <div className="wx-me-status-pill" onClick={() => setShowMoodPicker(true)}>
                      <span>{meMood}</span>
                      <span className="wx-me-edit" style={{ fontSize: 10 }}>✏️</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* 状态选择弹窗 */}

              {/* 新建作品弹窗 */}
              {showWorkModal && (
                <div className="wx-modal-overlay" onClick={() => closeWorkModal()}>
                  <motion.div
                    className="wx-modal"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.25 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="wx-modal-title">{editingWorkId ? "编辑这片叶子 🍃" : "收录一片新叶 🍃"}</h2>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#333", display: "block", marginBottom: 4 }}>作品标题 *</label>
                      <input
                        type="text"
                        className="wx-publish-textarea"
                        style={{ padding: "10px 14px", borderRadius: 12, width: "100%", boxSizing: "border-box", fontFamily: "inherit", fontSize: 14, border: "1px solid #e8e8e8", outline: "none" }}
                        value={workTitle}
                        onChange={(e) => setWorkTitle(e.target.value)}
                        placeholder="给你的作品起个名字"
                        maxLength={50}
                      />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#333", display: "block", marginBottom: 4 }}>作品内容</label>
                      <textarea
                        className="wx-publish-textarea"
                        style={{ borderRadius: 12 }}
                        value={workContent}
                        onChange={(e) => setWorkContent(e.target.value)}
                        placeholder={CHAPTER_OPTIONS.find((c) => c.value === workType)?.placeholder || "记录此刻的思考、代码片段或情绪…"}
                        maxLength={2000}
                        rows={5}
                      />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#333", display: "block", marginBottom: 4 }}>关联链接 <span style={{ fontWeight: 400, color: "#bbb", fontSize: 11 }}>（可选，如 /toolbox/travel）</span></label>
                      <input
                        type="text"
                        value={workLink}
                        onChange={(e) => setWorkLink(e.target.value)}
                        placeholder="粘贴或输入作品说明书内页路径"
                        maxLength={200}
                        style={{ padding: "10px 14px", borderRadius: 12, width: "100%", boxSizing: "border-box", fontFamily: "inherit", fontSize: 13, border: "1px solid #e8e8e8", outline: "none" }}
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#333", display: "block", marginBottom: 8 }}>选择旅程章节</label>
                      <div className="wx-chapter-picker">
                        {CHAPTER_OPTIONS.map((ch) => (
                          <div
                            key={ch.value}
                            className={`wx-chapter-picker-item ${workType === ch.value ? "wx-chapter-picker-active" : ""}`}
                            onClick={() => setWorkType(ch.value)}
                          >
                            <span className="wx-chapter-picker-icon">{ch.icon}</span>
                            <span className="wx-chapter-picker-num">{ch.num}</span>
                            <span className="wx-chapter-picker-name">{ch.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="wx-modal-btn" onClick={handleSaveWork}>保存</button>
                    <button className="wx-modal-btn" style={{ marginTop: 8, borderColor: "#ddd", color: "#999" }} onClick={() => closeWorkModal()}>取消</button>
                  </motion.div>
                </div>
              )}

              {/* 作品保存 Toast */}
              {workToast && (
                <motion.div
                  className="wx-publish-toast"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {works.length > 0 ? "🌿 收录成功" : "书卷尚空，先去收录一片叶子吧~"}
                </motion.div>
              )}

              {showMoodPicker && (
                <div className="wx-modal-overlay" onClick={() => setShowMoodPicker(false)}>
                  <div className="wx-modal" onClick={(e) => e.stopPropagation()}>
                    <h2 className="wx-modal-title">选择状态</h2>
                    <div style={{ marginBottom: 12 }}>
                      {moodOptions.map((m) => (
                        <div
                          key={m}
                          className="wx-me-cell"
                          style={{ borderBottom: "1px solid #eee" }}
                          onClick={() => handleSelectMood(m)}
                        >
                          <span className="wx-me-cell-label">{m}</span>
                        </div>
                      ))}
                    </div>
                    <button className="wx-modal-btn" onClick={handleCustomMood}>
                      自定义
                    </button>
                    <button className="wx-modal-btn" style={{ marginTop: 8, borderColor: "#ddd", color: "#999" }} onClick={() => setShowMoodPicker(false)}>
                      取消
                    </button>
                  </div>
                </div>
              )}

              {/* 2. 我的收藏（我的抽屉）- 折叠 */}
              <div className="wx-me-section">
                <div className="wx-me-fold-header" onClick={() => setFoldFav(!foldFav)}>
                  <div className="wx-me-fold-left">
                    <span className="wx-me-section-icon">📌</span>
                    <span className="wx-me-section-title">我的收藏夹</span>
                  </div>
                  <span className={`wx-me-fold-arrow ${foldFav ? "wx-me-fold-open" : ""}`}>▶</span>
                </div>
                {foldFav && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <div className="wx-me-section-desc">这里存放你从角色动态中点亮的心动瞬间</div>
                    <div className="wx-me-group">
                      {favList.length === 0 ? (
                        <div className="wx-me-empty">还没有收藏，去「发现」页看看吧~</div>
                      ) : (
                        favList.map((item) => (
                          <div
                            key={item.itemId}
                            className="wx-me-cell"
                            onClick={() => {
                              setSelectedProfileId(item.charId);
                              setView("profile");
                            }}
                          >
                            <span className="wx-me-cell-icon">{item.charEmoji}</span>
                            <div className="wx-me-cell-col">
                              <span className="wx-me-cell-label">{item.feedText}</span>
                              <span className="wx-me-cell-sub">来自 {item.charName} · {item.charTitle}</span>
                            </div>
                            <span className="wx-me-feed-leaf-mark">🍃</span>
                            <span className="wx-me-cell-arrow">›</span>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* 3. 朋友圈（公寓动态）- 折叠 */}
              <div className="wx-me-section">
                <div className="wx-me-fold-header" onClick={() => setFoldMoments(!foldMoments)}>
                  <div className="wx-me-fold-left">
                    <span className="wx-me-section-icon">👀</span>
                    <span className="wx-me-section-title">朋友圈</span>
                  </div>
                  <span className={`wx-me-fold-arrow ${foldMoments ? "wx-me-fold-open" : ""}`}>▶</span>
                </div>
                {foldMoments && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <div className="wx-me-section-desc">和室友分享你的每一天</div>

                    {/* 发布按钮 */}
                    <div className="wx-moment-publish-bar">
                      <button className="wx-moment-publish-btn" onClick={() => setShowPublishModal(true)}>
                        <span>+</span> 发布朋友圈
                      </button>
                    </div>

                    {/* 动态流 */}
                    <div className="wx-moments">
                      {moments.length === 0 ? (
                        <div className="wx-me-empty">还没有动态，点击上方按钮发布第一条吧~</div>
                      ) : (
                        moments.map((m) => (
                          <div key={m.id} className="wx-moment-card">
                            {/* 头部：头像+名字+时间 */}
                            <div className="wx-moment-header">
                              <span className="wx-moment-avatar">{m.authorAvatar}</span>
                              <div className="wx-moment-meta">
                                <span className="wx-moment-name">{m.authorName}</span>
                                <span className="wx-moment-time">{formatTime(m.timestamp)}</span>
                              </div>
                              {m.isMine && (
                                <div className="wx-moment-more-btn" onClick={() => handleDeleteMoment(m.id)}>
                                  ⋮
                                </div>
                              )}
                            </div>
                            {/* 内容 */}
                            <div className="wx-moment-content">{m.content}</div>
                            {/* 图片 */}
                            {m.images.length > 0 && (
                              <div className="wx-moment-images">
                                {m.images.map((img, i) => (
                                  <div key={i} className="wx-moment-img-thumb" style={{ backgroundImage: `url(${img})` }} />
                                ))}
                              </div>
                            )}
                            {/* 标签 */}
                            {m.tags.length > 0 && (
                              <div className="wx-moment-tags">
                                {m.tags.map((t) => (
                                  <span key={t} className="wx-moment-tag">{t}</span>
                                ))}
                              </div>
                            )}
                            {/* 互动栏 */}
                            <div className="wx-moment-actions">
                              <span
                                className={`wx-moment-action ${m.likedByMe ? "wx-moment-liked" : ""}`}
                                onClick={() => handleLikeMoment(m.id)}
                              >
                                {m.likedByMe ? "❤️" : "🤍"} {m.likes > 0 ? m.likes : ""}
                              </span>
                              <span
                                className="wx-moment-action"
                                onClick={() => setCommentingMomentId(commentingMomentId === m.id ? null : m.id)}
                              >
                                💬 {m.comments.length > 0 ? m.comments.length : ""}
                              </span>
                              <span className="wx-moment-leaf">🍃</span>
                            </div>
                            {/* AI 点赞展示 */}
                            {m.likedBy.length > 0 && (
                              <div className="wx-moment-liked-by">
                                ❤️ {m.likedBy.map((l) => l.avatar).join(" ")} {m.likedBy.map((l) => l.name).join("、")}
                                {m.likedByMe ? "、你" : ""}觉得很赞
                              </div>
                            )}
                            {/* 评论区（默认折叠，点击展开） */}
                            {m.comments.length > 0 && (
                              <div
                                className="wx-moment-comments-toggle"
                                onClick={() => setExpandedCommentsId(expandedCommentsId === m.id ? null : m.id)}
                              >
                                {expandedCommentsId === m.id ? "收起评论" : `${m.comments.length}条评论 ▾`}
                              </div>
                            )}
                            {expandedCommentsId === m.id && m.comments.length > 0 && (
                              <div className="wx-moment-comments">
                                {m.comments.map((c) => (
                                  <div key={c.id} className="wx-moment-comment">
                                    <span className="wx-moment-comment-avatar">{c.authorAvatar}</span>
                                    <div className="wx-moment-comment-body">
                                      <span className="wx-moment-comment-author">{c.author}</span>
                                      <span className="wx-moment-comment-text">{c.content}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* 评论输入框 */}
                            {commentingMomentId === m.id && (
                              <div className="wx-moment-comment-input">
                                <input
                                  type="text"
                                  value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  placeholder="写评论..."
                                  onKeyDown={(e) => { if (e.key === "Enter") handleComment(m.id); }}
                                  autoFocus
                                />
                                <button onClick={() => handleComment(m.id)}>发送</button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* 发布朋友圈弹窗 */}
              {showPublishModal && (
                <div className="wx-modal-overlay" onClick={() => setShowPublishModal(false)}>
                  <motion.div
                    className="wx-modal"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.25 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="wx-modal-title">发布朋友圈 🍃</h2>
                    <textarea
                      className="wx-publish-textarea"
                      value={publishText}
                      onChange={(e) => setPublishText(e.target.value)}
                      placeholder="分享你的心情..."
                      maxLength={500}
                      rows={4}
                    />
                    <div className="wx-publish-counter">{publishText.length}/500</div>
                    {/* 图片上传 */}
                    <div className="wx-publish-images">
                      {publishImages.map((img, i) => (
                        <div key={i} className="wx-publish-img-thumb" style={{ backgroundImage: `url(${img})` }}>
                          <span className="wx-publish-img-remove" onClick={() => setPublishImages(publishImages.filter((_, j) => j !== i))}>×</span>
                        </div>
                      ))}
                      {publishImages.length < 9 && (
                        <label className="wx-publish-img-add">
                          <span>+</span>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  setPublishImages((prev) => [...prev, ev.target?.result as string]);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                    {/* 标签 */}
                    <div className="wx-publish-tags">
                      {["#今日心情", "#创作碎片", "#公寓日常"].map((tag) => (
                        <span
                          key={tag}
                          className={`wx-publish-tag ${publishTags.includes(tag) ? "wx-publish-tag-active" : ""}`}
                          onClick={() => {
                            setPublishTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {/* 可见范围 */}
                    <div className="wx-publish-visibility">
                      <span>可见范围:</span>
                      <select value={publishVisibility} onChange={(e) => setPublishVisibility(e.target.value as any)}>
                        <option value="public">公开</option>
                        <option value="roommate">仅房客</option>
                        <option value="private">仅自己</option>
                      </select>
                    </div>
                    <button className="wx-modal-btn" onClick={handlePublish}>
                      发布
                    </button>
                    <button className="wx-modal-btn" style={{ marginTop: 8, borderColor: "#ddd", color: "#999" }} onClick={() => setShowPublishModal(false)}>
                      取消
                    </button>
                  </motion.div>
                </div>
              )}

              {/* 4. 我的作品集（我的书架）- 折叠 - 叙事结构 */}
              <div className="wx-me-section">
                <div className="wx-me-fold-header" onClick={() => setFoldWorks(!foldWorks)}>
                  <div className="wx-me-fold-left">
                    <span className="wx-me-section-icon">📚</span>
                    <span className="wx-me-section-title">我的作品集</span>
                  </div>
                  <span className={`wx-me-fold-arrow ${foldWorks ? "wx-me-fold-open" : ""}`}>▶</span>
                </div>
                {foldWorks && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <div className="wx-me-section-desc">在 LeafBook 留下的痕迹，按你的旅程排列</div>

                    {/* 第一章：初遇 */}
                    <div className="wx-me-chapter">
                      <div className="wx-me-chapter-header" onClick={() => setFoldCh1(!foldCh1)}>
                        <span className="wx-me-chapter-num">01</span>
                        <div className="wx-me-chapter-info">
                          <div className="wx-me-chapter-title">初遇</div>
                          <div className="wx-me-chapter-sub">Onboarding · 推开 LeafBook 的大门</div>
                        </div>
                        <span className={`wx-me-fold-arrow ${foldCh1 ? "wx-me-fold-open" : ""}`}>▶</span>
                      </div>
                      {foldCh1 && (
                        <motion.div className="wx-me-chapter-body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                          <div className="wx-me-narrative" onClick={() => window.open("/toolbox/travel", "_self")}>
                            <span className="wx-me-narrative-icon">🗺️</span>
                            <div className="wx-me-narrative-content">
                              <div className="wx-me-narrative-label">漫游指南</div>
                              <div className="wx-me-narrative-text">走过的路，看过的云。</div>
                            </div>
                          </div>
                          <div className="wx-me-narrative" onClick={() => window.open("/toolbox/quests", "_self")}>
                            <span className="wx-me-narrative-icon">🎯</span>
                            <div className="wx-me-narrative-content">
                              <div className="wx-me-narrative-label">通关清单</div>
                              <div className="wx-me-narrative-text">把人生变成一场 RPG。</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      {foldCh1 && getWorksByChapter("ch1").map((w) => (
                        <div key={w.id} className="wx-me-narrative" style={{ position: "relative" }}>
                            <span className="wx-me-narrative-icon">📝</span>
                            <div className="wx-me-narrative-content">
                              <div className="wx-me-narrative-label">{w.title}{w.link && <span style={{ fontSize: 10, color: "#4a7c59", marginLeft: 4 }}>🔗</span>}</div>
                              <div className="wx-me-narrative-text">{w.content.length > 30 ? w.content.slice(0, 30) + "…" : w.content || "（无内容）"}</div>
                            </div>
                            <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 4 }}>
                              <span onClick={(e) => { e.stopPropagation(); openEditWorkModal(w); }} style={{ fontSize: 11, cursor: "pointer", padding: "2px 6px", borderRadius: 4, background: "#f5f5f5" }}>✏️</span>
                              <span onClick={(e) => { e.stopPropagation(); handleDeleteWork(w.id); }} style={{ fontSize: 11, cursor: "pointer", padding: "2px 6px", borderRadius: 4, background: "#f5f5f5" }}>🗑️</span>
                            </div>
                          </div>
                      ))}
                    </div>

                    {/* 第二章：陪伴 */}
                    <div className="wx-me-chapter">
                      <div className="wx-me-chapter-header" onClick={() => setFoldCh2(!foldCh2)}>
                        <span className="wx-me-chapter-num">02</span>
                        <div className="wx-me-chapter-info">
                          <div className="wx-me-chapter-title">陪伴</div>
                          <div className="wx-me-chapter-sub">Companionship · 情绪低落时，有人在等你说话</div>
                        </div>
                        <span className={`wx-me-fold-arrow ${foldCh2 ? "wx-me-fold-open" : ""}`}>▶</span>
                      </div>
                      {foldCh2 && (
                        <motion.div className="wx-me-chapter-body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                          <div className="wx-me-narrative" onClick={() => window.open("/toolbox/answer", "_self")}>
                            <span className="wx-me-narrative-icon">🏠</span>
                            <div className="wx-me-narrative-content">
                              <div className="wx-me-narrative-label">爱情公寓</div>
                              <div className="wx-me-narrative-text">3601·3602·3603 全员在线。</div>
                            </div>
                          </div>
                          <div className="wx-me-narrative" onClick={() => window.open("/toolbox/advice", "_self")}>
                            <span className="wx-me-narrative-icon">🕯️</span>
                            <div className="wx-me-narrative-content">
                              <div className="wx-me-narrative-label">解忧杂货店</div>
                              <div className="wx-me-narrative-text">总有一句话，能解开你的心结。</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      {foldCh2 && getWorksByChapter("ch2").map((w) => (
                        <div key={w.id} className="wx-me-narrative" style={{ position: "relative" }}>
                            <span className="wx-me-narrative-icon">📝</span>
                            <div className="wx-me-narrative-content">
                              <div className="wx-me-narrative-label">{w.title}{w.link && <span style={{ fontSize: 10, color: "#4a7c59", marginLeft: 4 }}>🔗</span>}</div>
                              <div className="wx-me-narrative-text">{w.content.length > 30 ? w.content.slice(0, 30) + "…" : w.content || "（无内容）"}</div>
                            </div>
                            <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 4 }}>
                              {w.link && <span onClick={(e) => { e.stopPropagation(); window.open(w.link, "_self"); }} style={{ fontSize: 11, cursor: "pointer", padding: "2px 6px", borderRadius: 4, background: "#e8f0e8", color: "#4a7c59" }}>🔗</span>}
                              <span onClick={(e) => { e.stopPropagation(); openEditWorkModal(w); }} style={{ fontSize: 11, cursor: "pointer", padding: "2px 6px", borderRadius: 4, background: "#f5f5f5" }}>✏️</span>
                              <span onClick={(e) => { e.stopPropagation(); handleDeleteWork(w.id); }} style={{ fontSize: 11, cursor: "pointer", padding: "2px 6px", borderRadius: 4, background: "#f5f5f5" }}>🗑️</span>
                            </div>
                          </div>
                      ))}
                    </div>

                    {/* 第三章：求助 */}
                    <div className="wx-me-chapter">
                      <div className="wx-me-chapter-header" onClick={() => setFoldCh3(!foldCh3)}>
                        <span className="wx-me-chapter-num">03</span>
                        <div className="wx-me-chapter-info">
                          <div className="wx-me-chapter-title">求助</div>
                          <div className="wx-me-chapter-sub">Problem Solving · 现实中的麻烦也能在这里解决</div>
                        </div>
                        <span className={`wx-me-fold-arrow ${foldCh3 ? "wx-me-fold-open" : ""}`}>▶</span>
                      </div>
                      {foldCh3 && (
                        <motion.div className="wx-me-chapter-body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                          <div className="wx-me-narrative" onClick={() => window.open("/toolbox/supplies", "_self")}>
                            <span className="wx-me-narrative-icon">📦</span>
                            <div className="wx-me-narrative-content">
                              <div className="wx-me-narrative-label">物资管家</div>
                              <div className="wx-me-narrative-text">库存与保质期管理，生活从此不慌。</div>
                            </div>
                          </div>
                          <div className="wx-me-narrative" onClick={() => window.open("/toolbox/recharge", "_self")}>
                            <span className="wx-me-narrative-icon">🔋</span>
                            <div className="wx-me-narrative-content">
                              <div className="wx-me-narrative-label">回血清单</div>
                              <div className="wx-me-narrative-text">允许一切崩塌，只做一件极小的事。</div>
                            </div>
                          </div>

                        </motion.div>
                      )}
                      {foldCh3 && getWorksByChapter("ch3").map((w) => (
                        <div key={w.id} className="wx-me-narrative" style={{ position: "relative" }}>
                            <span className="wx-me-narrative-icon">📝</span>
                            <div className="wx-me-narrative-content">
                              <div className="wx-me-narrative-label">{w.title}{w.link && <span style={{ fontSize: 10, color: "#4a7c59", marginLeft: 4 }}>🔗</span>}</div>
                              <div className="wx-me-narrative-text">{w.content.length > 30 ? w.content.slice(0, 30) + "…" : w.content || "（无内容）"}</div>
                            </div>
                            <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 4 }}>
                              {w.link && <span onClick={(e) => { e.stopPropagation(); window.open(w.link, "_self"); }} style={{ fontSize: 11, cursor: "pointer", padding: "2px 6px", borderRadius: 4, background: "#e8f0e8", color: "#4a7c59" }}>🔗</span>}                              <span onClick={(e) => { e.stopPropagation(); openEditWorkModal(w); }} style={{ fontSize: 11, cursor: "pointer", padding: "2px 6px", borderRadius: 4, background: "#f5f5f5" }}>✏️</span>
                              <span onClick={(e) => { e.stopPropagation(); handleDeleteWork(w.id); }} style={{ fontSize: 11, cursor: "pointer", padding: "2px 6px", borderRadius: 4, background: "#f5f5f5" }}>🗑️</span>
                            </div>
                          </div>
                      ))}
                    </div>

                    {/* 第四章：沉淀 */}
                    <div className="wx-me-chapter">
                      <div className="wx-me-chapter-header" onClick={() => setFoldCh4(!foldCh4)}>
                        <span className="wx-me-chapter-num">04</span>
                        <div className="wx-me-chapter-info">
                          <div className="wx-me-chapter-title">沉淀</div>
                          <div className="wx-me-chapter-sub">Reflection · 所有的互动沉淀为专属记忆</div>
                        </div>
                        <span className={`wx-me-fold-arrow ${foldCh4 ? "wx-me-fold-open" : ""}`}>▶</span>
                      </div>
                      {foldCh4 && (
                        <motion.div className="wx-me-chapter-body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                          <div className="wx-me-narrative" onClick={() => window.open("/healing", "_self")}>
                            <span className="wx-me-narrative-icon">🌲</span>
                            <div className="wx-me-narrative-content">
                              <div className="wx-me-narrative-label">森林疗愈室</div>
                              <div className="wx-me-narrative-text">调节呼吸与情绪，最终与自己和解。</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      {foldCh4 && getWorksByChapter("ch4").map((w) => (
                        <div key={w.id} className="wx-me-narrative" style={{ position: "relative" }}>
                            <span className="wx-me-narrative-icon">📝</span>
                            <div className="wx-me-narrative-content">
                              <div className="wx-me-narrative-label">{w.title}{w.link && <span style={{ fontSize: 10, color: "#4a7c59", marginLeft: 4 }}>🔗</span>}</div>
                              <div className="wx-me-narrative-text">{w.content.length > 30 ? w.content.slice(0, 30) + "…" : w.content || "（无内容）"}</div>
                            </div>
                            <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 4 }}>
                              {w.link && <span onClick={(e) => { e.stopPropagation(); window.open(w.link, "_self"); }} style={{ fontSize: 11, cursor: "pointer", padding: "2px 6px", borderRadius: 4, background: "#e8f0e8", color: "#4a7c59" }}>🔗</span>}                              <span onClick={(e) => { e.stopPropagation(); openEditWorkModal(w); }} style={{ fontSize: 11, cursor: "pointer", padding: "2px 6px", borderRadius: 4, background: "#f5f5f5" }}>✏️</span>
                              <span onClick={(e) => { e.stopPropagation(); handleDeleteWork(w.id); }} style={{ fontSize: 11, cursor: "pointer", padding: "2px 6px", borderRadius: 4, background: "#f5f5f5" }}>🗑️</span>
                            </div>
                          </div>
                      ))}
                    </div>

                    <div className="wx-me-actions">
                      <button className="wx-me-action-btn" onClick={() => openNewWorkModal()}>+ 新建作品</button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* 底部版权 */}
              <div className="wx-me-footer">
                <div className="wx-me-slogan">让作品，有回声。</div>
              </div>
            </div>

            {/* 底部 Tab 栏 */}
            <WxTabBar active="me" onTab={setView} />
          </motion.div>
        )}

        {/* ===== 聊天界面（单聊 / 群聊共用） ===== */}
        {(view === "chat" || view === "groupchat") && selectedChar && (
          <motion.div
            key="chat"
            className="apt-chat"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {/* 聊天头部 */}
            <div
              className="apt-chat-header"
              style={{ borderBottomColor: view === "groupchat" ? "#e0e0e0" : `${selectedChar.color}25` }}
            >
              <div className="apt-chat-header-left">
                <span
                  className="apt-chat-emoji"
                  style={view === "groupchat"
                    ? { background: "#e8f0e8", color: "#4a7c59" }
                    : { background: `${selectedChar.color}18`, color: selectedChar.color }}
                >
                  {view === "groupchat" ? "🏠" : selectedChar.emoji}
                </span>
                <div className="apt-chat-header-info">
                  <span className="apt-chat-name" style={{ color: view === "groupchat" ? "#4a7c59" : selectedChar.color }}>
                    {view === "groupchat" ? "群聊模式" : selectedChar.ui.stationTitle}
                  </span>
                  <span className="apt-chat-meta">
                    {view === "groupchat"
                      ? "多人接力吐槽中…"
                      : `${selectedChar.name} · ${selectedChar.room} · ${selectedChar.ui.freq}`}
                  </span>
                </div>
              </div>
              <div
                className="apt-chat-status"
                style={{ color: isLoading ? "#d4a85a" : "#6a9a7a" }}
              >
                {isLoading ? "◉ 连线中…" : "● 在线"}
              </div>
              <div className="apt-chat-header-actions">
                <label className="apt-bg-btn" title="更换背景">
                  🖼️
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => { (bgFileInputRef as any).current = el; }}
                    onChange={handleBgUpload}
                    style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                  />
                </label>
              </div>
            </div>

            {/* 消息列表 */}
            <div
              className={`apt-chat-scroll ${currentBg ? "apt-chat-scroll-bg" : ""}`}
              style={currentBg ? { backgroundImage: `url(${currentBg})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
              ref={scrollRef}>
              {messages.length === 0 && (
                <div className="apt-chat-empty">
                  {view === "groupchat" ? (
                    <>
                      <span className="apt-chat-empty-emoji">🏠</span>
                      <p className="apt-chat-empty-text">爱情公寓 3602，全员在线</p>
                      <p className="apt-chat-empty-hint">输入你的近况，看看谁第一个抢话…</p>
                    </>
                  ) : (
                    <>
                      <span className="apt-chat-empty-emoji">{selectedChar.emoji}</span>
                      <p className="apt-chat-empty-text">{selectedChar.catchphrase}</p>
                      <p className="apt-chat-empty-hint">{selectedChar.ui.placeholder}</p>
                    </>
                  )}
                </div>
              )}
              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  msg={msg}
                  char={msg.characterId ? getCharacter(msg.characterId) : undefined}
                  userAvatar={meAvatar || undefined}
                />
              ))}
              {groupTyping && (
                <motion.div
                  className="apt-typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="apt-typing-dot" />
                  <span className="apt-typing-dot" />
                  <span className="apt-typing-dot" />
                  <span className="apt-typing-name">{groupTyping} 正在输入…</span>
                </motion.div>
              )}
            </div>

            {/* 输入区 */}
            <div className="apt-chat-inputbar">
              <textarea
                className="apt-chat-input"
                placeholder={view === "groupchat" ? "输入你的近况，看看谁第一个抢话…" : selectedChar.ui.placeholder}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                rows={2}
                disabled={isLoading}
              />
              <button
                className="apt-chat-send"
                onClick={sendMessage}
                disabled={!inputText.trim() || isLoading}
                style={
                  {
                    background: view === "groupchat" ? "#4a7c59" : selectedChar.color,
                    opacity: !inputText.trim() || isLoading ? 0.4 : 1,
                  } as React.CSSProperties
                }
              >
                {isLoading ? "发送中…" : "发送"}
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        html, body { margin: 0; padding: 0; }
        .apt-page {
          min-height: 100vh;
          background: #F5F1E8;
          color: #3D3830;
          font-family: "Noto Sans SC", system-ui, sans-serif;
          padding: 0 24px 60px;
        }
        .apt-page * { cursor: auto; }
        .apt-page a, .apt-page button { cursor: pointer; }
        .apt-page textarea { cursor: text; }

        /* ===== 顶部导航 ===== */
        .apt-topbar {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 720px; margin: 0 auto; padding: 24px 4px 0;
          gap: 12px;
        }
        .apt-back {
          font-size: 14px; color: #8A8378; text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease, transform 0.25s ease;
          background: none; border: none; padding: 0;
        }
        .apt-back:hover { color: #A08050; transform: translateX(-3px); }
        .apt-back-ghost { color: #9A9488; }
        .apt-back-ghost:hover { color: #7A7568; }

        /* ===== 微信风格聊天列表（紧凑手机 320px） ===== */
        .wx-lobby {
          max-width: 300px;
          margin: 12px auto;
          display: flex;
          flex-direction: column;
          flex: 1;
          background: #f5f5f5;
          font-family: "PingFang SC", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          min-height: calc(100vh - 24px);
          position: relative;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          border-radius: 12px;
          overflow: hidden;
        }

        /* 顶部导航栏 */
        .wx-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 48px;
          padding: 12px 16px;
          background: #ededed;
          border-bottom: 1px solid #d6d6d6;
          flex-shrink: 0;
          position: relative;
          z-index: 10;
          box-sizing: border-box;
        }
        .wx-header-left { width: 28px; }
        .wx-header-title {
          font-size: 16px;
          font-weight: 600;
          color: #000;
          margin: 0;
          text-align: center;
          flex: 1;
          letter-spacing: 0;
        }
        .wx-header-easter {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          font-size: 12px;
          color: #999;
          background: none;
          border: 1px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-weight: 500;
          line-height: 1;
          padding: 0;
          flex-shrink: 0;
          position: absolute;
          top: 14px;
          right: 16px;
        }
        .wx-header-easter:hover {
          color: #666;
          border-color: #999;
        }

        /* 关于弹窗 */
        .wx-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .wx-modal {
          background: #fff;
          border-radius: 8px;
          padding: 20px;
          max-width: 280px;
          width: 100%;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        }
        .wx-modal-title {
          font-size: 16px;
          font-weight: 600;
          color: #000;
          margin: 0 0 14px;
          text-align: center;
        }
        .wx-modal-body {
          font-size: 14px;
          line-height: 1.6;
          color: #333;
          margin: 0 0 18px;
          text-align: justify;
        }
        .wx-modal-btn {
          display: block;
          width: 100%;
          padding: 10px;
          font-size: 14px;
          color: #333;
          background: none;
          border: 1px solid #ccc;
          border-radius: 6px;
          cursor: pointer;
          font-family: inherit;
          transition: background-color 0.15s ease, border-color 0.15s ease;
        }
        .wx-modal-btn:hover {
          background: #f5f5f5;
          border-color: #999;
        }

        /* 关于弹窗（手写信风格） */
        .wx-modal-about {
          background: #FFF8E7;
          border: 1px solid #E0D5C5;
          border-radius: 12px;
          padding: 24px;
          max-width: 300px;
        }
        .wx-modal-about .wx-modal-title {
          font-size: 18px;
          font-weight: 700;
          color: #3D3830;
          margin: 0 0 18px;
          letter-spacing: 0.04em;
        }
        .wx-modal-about .wx-modal-body {
          font-size: 14px;
          line-height: 1.75;
          color: #4A453D;
          margin: 0 0 20px;
          text-align: left;
        }
        .wx-modal-about .wx-modal-body p {
          margin: 0;
        }
        .wx-modal-highlight {
          font-weight: 600;
          color: #2C2820;
        }
        .wx-modal-about-btn {
          border: 1px solid #D5C8B0;
          color: #5A5448;
          background: #FFF8E7;
          border-radius: 8px;
          padding: 12px;
          font-size: 15px;
          font-weight: 500;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .wx-modal-about-btn:hover {
          background: #F5F0E6;
          color: #3D3830;
          border-color: #C8B8A0;
        }

        /* 聊天列表（白色圆角卡片） */
        .wx-list {
          flex: 1;
          overflow-y: auto;
          background: #fff;
          border-radius: 12px;
          margin: 0 8px 0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .wx-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          height: 56px;
          box-sizing: border-box;
          cursor: pointer;
          background: #fff;
          border-bottom: 1px solid #eee;
          transition: background-color 0.15s ease;
          user-select: none;
        }
        .wx-item:last-child {
          border-bottom: none;
        }
        .wx-item:hover {
          background-color: #f9f9f9;
        }
        .wx-item:active {
          background-color: #e5e5e5;
        }
        .wx-avatar {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
          background: #f0f0f0;
        }
        .wx-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .wx-info-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }
        .wx-name {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .wx-time {
          font-size: 11px;
          color: #999;
          flex-shrink: 0;
        }
        .wx-msg {
          font-size: 12px;
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* 底部 Tab 栏 */
        .wx-tabbar {
          display: flex;
          align-items: center;
          justify-content: space-around;
          height: 44px;
          background: #fff;
          border-top: 1px solid #eee;
          flex-shrink: 0;
        }
        .wx-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1px;
          flex: 1;
          height: 100%;
          cursor: pointer;
        }
        .wx-tab-icon {
          font-size: 20px;
          line-height: 1;
        }
        .wx-tab-label {
          font-size: 11px;
          line-height: 1.2;
        }
        .wx-tab-active {
          color: #07c160;
        }
        .wx-tab-disabled {
          color: #999;
          cursor: default;
        }

        /* 发现页（角色特长入口） */
        .wx-discover-lobby {
          background: #FAF6F0;
        }
        .wx-discover-scroll {
          flex: 1;
          overflow-y: auto;
          background: #FAF6F0;
          display: flex;
          flex-direction: column;
        }

        /* 页面标题区（紧凑） */
        .wx-discover-header {
          padding: 10px 14px 6px;
        }
        .wx-discover-header-title-sm {
          font-size: 15px;
          font-weight: 600;
          color: #2C2820;
          margin-bottom: 2px;
        }
        .wx-discover-header-sub {
          font-size: 11px;
          color: #bbb;
        }

        /* 角色特长卡片列表 */
        .wx-discover-list {
          padding: 0 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .wx-discover-role-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
        }
        .wx-discover-role-card:hover {
          box-shadow: 0 3px 10px rgba(0,0,0,0.08);
          transform: translateY(-1px);
        }
        .wx-discover-role-icon {
          font-size: 28px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f8f8;
          border-radius: 12px;
          flex-shrink: 0;
        }
        .wx-discover-role-info {
          flex: 1;
          min-width: 0;
        }
        .wx-discover-role-name {
          font-size: 15px;
          font-weight: 600;
          color: #2C2820;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 3px;
        }
        .wx-discover-role-title {
          font-size: 12px;
          font-weight: 700;
          color: #07c160;
          background: #e8f5e9;
          padding: 2px 8px;
          border-radius: 10px;
        }
        .wx-discover-role-subtitle {
          font-size: 12px;
          color: #999;
          line-height: 1.4;
        }
        .wx-discover-role-arrow {
          font-size: 18px;
          color: #ccc;
          font-weight: 300;
          flex-shrink: 0;
        }

        /* 电台播放器 */
        .wx-radio-player {
          background: linear-gradient(135deg, #1a1a2e, #2d2d44);
          color: #fff;
          border: none;
        }
        .wx-radio-player .wx-modal-title {
          color: #fff;
        }
        .wx-radio-player .wx-modal-body {
          color: rgba(255,255,255,0.7);
        }
        .wx-radio-cover {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          margin: 0 auto 16px;
          box-shadow: 0 4px 16px rgba(255, 200, 0, 0.3);
          animation: radioSpin 8s linear infinite;
        }
        @keyframes radioSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .wx-radio-wave {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          margin: 16px 0;
          height: 24px;
        }
        .wx-radio-wave span {
          width: 3px;
          background: #FFD700;
          border-radius: 2px;
          animation: wave 1s ease-in-out infinite;
        }
        .wx-radio-wave span:nth-child(1) { height: 8px; animation-delay: 0s; }
        .wx-radio-wave span:nth-child(2) { height: 16px; animation-delay: 0.1s; }
        .wx-radio-wave span:nth-child(3) { height: 12px; animation-delay: 0.2s; }
        .wx-radio-wave span:nth-child(4) { height: 20px; animation-delay: 0.3s; }
        .wx-radio-wave span:nth-child(5) { height: 10px; animation-delay: 0.4s; }
        @keyframes wave {
          0%, 100% { transform: scaleY(0.6); opacity: 0.6; }
          50% { transform: scaleY(1); opacity: 1; }
        }

        .wx-discover-footer {
          text-align: center;
          padding: 16px 14px 24px;
          font-size: 11px;
          color: #ccc;
          letter-spacing: 0.03em;
        }

        /* 发现页：用户动态同步区 */
        .wx-discover-feed-section {
          margin: 0 12px 12px;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .wx-discover-feed-title {
          font-size: 13px;
          font-weight: 700;
          color: #3D3830;
          padding: 12px 14px 8px;
        }
        .wx-discover-feed-card {
          padding: 12px 14px;
          border-bottom: 1px solid #f0f0f0;
        }
        .wx-discover-feed-card:last-child {
          border-bottom: none;
        }
        .wx-discover-feed-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .wx-discover-feed-avatar {
          font-size: 20px;
          line-height: 1;
        }
        .wx-discover-feed-name {
          font-size: 13px;
          font-weight: 600;
          color: #333;
        }
        .wx-discover-feed-time {
          font-size: 11px;
          color: #bbb;
          margin-left: auto;
        }
        .wx-discover-feed-text {
          font-size: 13px;
          color: #444;
          line-height: 1.6;
          margin-bottom: 6px;
        }
        .wx-discover-feed-images {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          margin-bottom: 6px;
        }
        .wx-discover-feed-img {
          aspect-ratio: 1;
          border-radius: 6px;
          background-size: cover;
          background-position: center;
          background-color: #f0f0f0;
        }
        .wx-discover-feed-tags {
          display: flex;
          gap: 4px;
          margin-bottom: 6px;
        }
        .wx-discover-feed-tag {
          font-size: 10px;
          color: #07c160;
          background: #e8f5e9;
          padding: 2px 6px;
          border-radius: 8px;
        }
        .wx-discover-feed-bottom {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .wx-discover-feed-action {
          font-size: 12px;
          color: #bbb;
          cursor: pointer;
        }
        .wx-discover-feed-leaf {
          font-size: 12px;
          opacity: 0.5;
          margin-left: auto;
        }

        /* 发布成功 Toast */
        .wx-publish-toast {
          position: fixed;
          bottom: 120px;
          left: 50%;
          transform: translateX(-50%);
          padding: 10px 20px;
          background: rgba(0,0,0,0.75);
          color: #fff;
          font-size: 13px;
          border-radius: 20px;
          z-index: 999;
          pointer-events: none;
          white-space: nowrap;
        }
        .wx-sync-toast {
          position: fixed;
          bottom: 160px;
          left: 50%;
          transform: translateX(-50%);
          padding: 8px 18px;
          background: rgba(7, 193, 96, 0.85);
          color: #fff;
          font-size: 12px;
          border-radius: 20px;
          z-index: 999;
          pointer-events: none;
          white-space: nowrap;
          backdrop-filter: blur(4px);
        }

        /* 角色详情页（Profile Page） */
        .wx-profile-scroll {
          flex: 1;
          overflow-y: auto;
          background: #f5f5f5;
        }
        .wx-profile-hero {
          padding: 32px 20px;
          text-align: center;
          color: #fff;
        }
        .wx-profile-avatar {
          font-size: 64px;
          line-height: 1;
          margin-bottom: 12px;
        }
        .wx-profile-name {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .wx-profile-tag {
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          color: #fff;
          padding: 4px 12px;
          border-radius: 12px;
          margin-bottom: 6px;
        }
        .wx-profile-room {
          font-size: 12px;
          opacity: 0.7;
          margin-bottom: 8px;
        }
        .wx-profile-catchphrase {
          font-size: 13px;
          opacity: 0.85;
          font-style: italic;
        }
        .wx-profile-feed {
          background: #fff;
          padding: 16px;
          margin-bottom: 8px;
        }
        .wx-profile-feed-title {
          font-size: 14px;
          font-weight: 700;
          color: #333;
          margin-bottom: 12px;
        }
        .wx-profile-feed-item {
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .wx-profile-feed-item:last-child {
          border-bottom: none;
        }
        .wx-profile-feed-text {
          font-size: 14px;
          color: #333;
          line-height: 1.6;
          margin-bottom: 4px;
        }
        .wx-profile-feed-time {
          font-size: 11px;
          color: #bbb;
        }
        .wx-profile-actions {
          padding: 16px;
          background: #fff;
        }
        .wx-profile-chat-btn {
          display: block;
          width: 100%;
          padding: 14px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .wx-profile-chat-btn:hover {
          opacity: 0.9;
        }
        .wx-profile-chat-btn:active {
          transform: scale(0.98);
        }

        /* 动态流底部操作按钮 */
        .wx-profile-feed-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
        }
        .wx-profile-feed-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .wx-feed-btn {
          font-size: 12px;
          color: #bbb;
          cursor: pointer;
          transition: color 0.15s ease, transform 0.15s ease;
          user-select: none;
        }
        .wx-feed-btn:hover {
          color: #999;
        }
        .wx-feed-btn:active {
          transform: scale(0.9);
        }
        .wx-feed-btn-liked {
          color: #FF6B6B;
        }
        .wx-feed-btn-faved {
          color: #F5C842;
        }
        .wx-feed-leaf-mark {
          font-size: 12px;
          opacity: 0.7;
        }

        /* 叶子飘落动画 */
        .wx-leaf-fall {
          position: fixed;
          top: 40%;
          right: 20%;
          font-size: 20px;
          z-index: 999;
          pointer-events: none;
        }

        /* 收藏夹空状态 */
        .wx-me-empty {
          padding: 24px 14px;
          text-align: center;
          font-size: 13px;
          color: #bbb;
        }

        /* 朋友圈系统 */
        .wx-moment-publish-bar {
          padding: 10px 14px;
          background: #fff;
        }
        .wx-moment-publish-btn {
          width: 100%;
          padding: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #07c160;
          background: #f5f5f5;
          border: 1px dashed #07c160;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          transition: background-color 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .wx-moment-publish-btn:hover {
          background-color: #e8f5e9;
        }
        .wx-moment-publish-btn span {
          font-size: 18px;
          font-weight: 400;
        }
        .wx-moments {
          background: #fff;
        }
        .wx-moment-card {
          padding: 14px;
          border-bottom: 1px solid #f0f0f0;
        }
        .wx-moment-card:last-child {
          border-bottom: none;
        }
        .wx-moment-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .wx-moment-avatar {
          font-size: 28px;
          line-height: 1;
          flex-shrink: 0;
        }
        .wx-moment-meta {
          flex: 1;
          min-width: 0;
        }
        .wx-moment-name {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }
        .wx-moment-time {
          font-size: 11px;
          color: #bbb;
        }
        .wx-moment-more-btn {
          font-size: 16px;
          color: #ccc;
          cursor: pointer;
          padding: 2px 6px;
          transition: color 0.15s ease;
        }
        .wx-moment-more-btn:hover {
          color: #999;
        }
        .wx-moment-content {
          font-size: 14px;
          color: #333;
          line-height: 1.6;
          margin-bottom: 8px;
        }
        .wx-moment-images {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          margin-bottom: 8px;
        }
        .wx-moment-img-thumb {
          aspect-ratio: 1;
          border-radius: 6px;
          background-size: cover;
          background-position: center;
          background-color: #f0f0f0;
        }
        .wx-moment-tags {
          display: flex;
          gap: 6px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
        .wx-moment-tag {
          font-size: 11px;
          color: #07c160;
          background: #e8f5e9;
          padding: 2px 8px;
          border-radius: 10px;
        }
        .wx-moment-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 6px;
        }
        .wx-moment-liked-by {
          font-size: 11px;
          color: #888;
          background: #f8f8f8;
          border-radius: 8px;
          padding: 6px 10px;
          margin-bottom: 6px;
          line-height: 1.5;
        }
        .wx-moment-action {
          font-size: 12px;
          color: #bbb;
          cursor: pointer;
          user-select: none;
          transition: color 0.15s ease;
        }
        .wx-moment-action:hover {
          color: #999;
        }
        .wx-moment-liked {
          color: #FF6B6B;
        }
        .wx-moment-leaf {
          font-size: 12px;
          opacity: 0.5;
          margin-left: auto;
        }
        .wx-moment-comments {
          background: #f8f8f8;
          border-radius: 8px;
          padding: 8px 10px;
          margin-bottom: 6px;
        }
        .wx-moment-comments-toggle {
          font-size: 11px;
          color: #576b95;
          margin-top: 6px;
          cursor: pointer;
          padding: 2px 0;
        }
        .wx-moment-comments-toggle:hover {
          opacity: 0.7;
        }
        .wx-moment-comment {
          display: flex;
          gap: 6px;
          align-items: flex-start;
          font-size: 12px;
          line-height: 1.5;
          margin-bottom: 6px;
        }
        .wx-moment-comment:last-child {
          margin-bottom: 0;
        }
        .wx-moment-comment-avatar {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          flex-shrink: 0;
          background: rgba(0,0,0,0.03);
        }
        .wx-moment-comment-body {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
        }
        .wx-moment-comment-author {
          font-weight: 600;
          color: #07c160;
        }
        .wx-moment-comment-text {
          color: #666;
        }
        .wx-moment-comment-input {
          display: flex;
          gap: 8px;
          margin-top: 6px;
        }
        .wx-moment-comment-input input {
          flex: 1;
          padding: 8px 10px;
          font-size: 13px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          outline: none;
          font-family: inherit;
        }
        .wx-moment-comment-input button {
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          background: #07c160;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-family: inherit;
        }

        /* 发布弹窗 */
        .wx-publish-textarea {
          width: 100%;
          padding: 10px;
          font-size: 14px;
          font-family: inherit;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          resize: vertical;
          outline: none;
          box-sizing: border-box;
        }
        .wx-publish-counter {
          text-align: right;
          font-size: 11px;
          color: #bbb;
          margin-bottom: 10px;
        }
        .wx-publish-images {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-bottom: 10px;
        }
        .wx-publish-img-thumb {
          aspect-ratio: 1;
          border-radius: 6px;
          background-size: cover;
          background-position: center;
          position: relative;
          background-color: #f0f0f0;
        }
        .wx-publish-img-remove {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 18px;
          height: 18px;
          background: #ff4444;
          color: #fff;
          font-size: 12px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          line-height: 1;
        }
        .wx-publish-img-add {
          aspect-ratio: 1;
          border: 1px dashed #ccc;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #ccc;
          cursor: pointer;
          background: #fafafa;
          transition: border-color 0.15s ease;
        }
        .wx-publish-img-add:hover {
          border-color: #07c160;
          color: #07c160;
        }
        .wx-publish-tags {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        .wx-publish-tag {
          font-size: 11px;
          color: #999;
          background: #f5f5f5;
          padding: 4px 10px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .wx-publish-tag-active {
          color: #07c160;
          background: #e8f5e9;
        }
        .wx-publish-visibility {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 13px;
          color: #666;
        }
        .wx-publish-visibility select {
          padding: 4px 8px;
          font-size: 13px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-family: inherit;
          outline: none;
        }

        /* 通讯录样式（微信分组风格） */
        .wx-contact-section {
          background: #fff;
        }
        .wx-contact-section-label {
          font-size: 11px;
          color: #999;
          padding: 8px 14px 4px;
          background: #f5f5f5;
        }
        .wx-contact-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 14px;
          background: #fff;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .wx-contact-row:hover {
          background-color: #f9f9f9;
        }
        .wx-contact-row:active {
          background-color: #e5e5e5;
        }
        .wx-contact-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }
        .wx-contact-name {
          font-size: 15px;
          font-weight: 500;
          color: #000;
        }
        .wx-contact-search {
          padding: 8px 14px;
          background: #f5f5f5;
        }
        .wx-contact-search-input {
          width: 100%;
          padding: 8px 12px;
          font-size: 14px;
          border: none;
          border-radius: 6px;
          background: #fff;
          color: #333;
          outline: none;
          box-sizing: border-box;
        }
        .wx-contact-search-input::placeholder {
          color: #bbb;
        }
        .wx-contact-index {
          position: absolute;
          right: 4px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
          padding: 4px 2px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 10px;
        }
        .wx-contact-index-letter {
          font-size: 10px;
          color: #ccc;
          padding: 1.5px 4px;
          line-height: 1.2;
          cursor: default;
          user-select: none;
        }
        .wx-contact-index-active {
          color: #07c160;
          font-weight: 600;
          cursor: pointer;
        }

        /* 个人中心 */
        .wx-me-scroll {
          flex: 1;
          overflow-y: auto;
          background: #f5f5f5;
        }
        .wx-me-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 14px 12px;
          background: #FFF8E7;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .wx-me-card:hover { background-color: #FFF3D6; }
        .wx-me-card:active { background-color: #FFE8C2; }

        /* 个人主页 Hero 区域（背景图） */
        .wx-me-hero {
          position: relative;
          height: 240px;
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 16px;
        }
        .wx-me-bg-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          font-size: 16px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.7);
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.15s ease;
          z-index: 2;
        }
        .wx-me-bg-btn:hover {
          background: rgba(255,255,255,0.9);
        }

        /* 毛玻璃卡片 */
        .wx-me-glass-card {
          position: relative;
          z-index: 1;
          background: #FFFFFF;
          border-radius: 18px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }

        /* 状态胶囊 */
        .wx-me-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #fff;
          background: linear-gradient(135deg, #a8d8a8, #7ec87e);
          padding: 5px 14px;
          border-radius: 20px;
          margin-top: 6px;
          width: fit-content;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }
        .wx-me-status-pill:hover {
          opacity: 0.85;
        }
        .wx-me-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e0f5e8, #c8e8d8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }
        .wx-me-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .wx-me-name {
          font-size: 17px;
          font-weight: 600;
          color: #2C2820;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .wx-me-edit {
          font-size: 12px;
          opacity: 0.5;
        }
        .wx-me-signature {
          font-size: 11px;
          color: #999;
        }
        .wx-me-mood {
          display: inline-block;
          font-size: 11px;
          color: #E65100;
          background: #FFF3E0;
          padding: 3px 10px;
          border-radius: 12px;
          margin-top: 2px;
          width: fit-content;
        }
        /* 区块样式（折叠手风琴） */
        .wx-me-section {
          margin-bottom: 8px;
        }
        .wx-me-fold-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          background: #fff;
          cursor: pointer;
          transition: background-color 0.15s ease;
          border-bottom: 1px solid #f0f0f0;
        }
        .wx-me-fold-header:hover {
          background-color: #fafafa;
        }
        .wx-me-fold-header:active {
          background-color: #f0f0f0;
        }
        .wx-me-fold-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .wx-me-fold-arrow {
          font-size: 11px;
          color: #ccc;
          transition: transform 0.25s ease, color 0.15s ease;
          user-select: none;
        }
        .wx-me-fold-open {
          transform: rotate(90deg);
          color: #07c160;
        }
        .wx-me-section-header {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 14px 6px;
          background: #f5f5f5;
        }
        .wx-me-section-icon {
          font-size: 14px;
        }
        .wx-me-section-title {
          font-size: 13px;
          font-weight: 700;
          color: #666;
        }
        .wx-me-section-desc {
          font-size: 11px;
          color: #bbb;
          padding: 0 14px 8px;
          background: #f5f5f5;
        }
        .wx-me-group {
          background: #fff;
        }
        .wx-me-cell {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .wx-me-cell:last-child { border-bottom: none; }
        .wx-me-cell:hover { background-color: #f9f9f9; }
        .wx-me-cell:hover .wx-me-cell-arrow { color: #666; }
        .wx-me-cell:active { background-color: #e5e5e5; }
        .wx-me-cell-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
          flex-shrink: 0;
        }
        .wx-me-cell-col {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .wx-me-cell-label {
          font-size: 14px;
          color: #333;
        }
        .wx-me-cell-sub {
          font-size: 11px;
          color: #bbb;
        }
        .wx-me-cell-arrow {
          font-size: 18px;
          color: #ccc;
          font-weight: 300;
          flex-shrink: 0;
          transition: color 0.15s ease;
        }

        /* 室友朋友圈 */
        .wx-me-moments {
          background: #fff;
          padding: 6px 0;
        }
        .wx-me-moment-row {
          display: flex;
          gap: 10px;
          padding: 10px 14px;
          cursor: pointer;
          transition: background-color 0.15s ease;
          border-bottom: 1px solid #f5f5f5;
        }
        .wx-me-moment-row:last-of-type { border-bottom: none; }
        .wx-me-moment-row:hover { background-color: #fafafa; }
        .wx-me-moment-avatar {
          font-size: 22px;
          line-height: 1;
          flex-shrink: 0;
        }
        .wx-me-moment-body {
          flex: 1;
          min-width: 0;
        }
        .wx-me-moment-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 3px;
        }
        .wx-me-moment-name {
          font-size: 13px;
          font-weight: 600;
          color: #333;
        }
        .wx-me-moment-time {
          font-size: 11px;
          color: #bbb;
        }
        .wx-me-moment-text {
          font-size: 12px;
          color: #666;
          line-height: 1.5;
        }
        .wx-me-moment-more {
          text-align: center;
          font-size: 12px;
          color: #07c160;
          padding: 10px;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .wx-me-moment-more:hover { background-color: #f9f9f9; }

        /* 操作按钮 */
        .wx-me-actions {
          display: flex;
          gap: 8px;
          padding: 10px 14px;
          background: #fff;
        }
        .wx-me-action-btn {
          flex: 1;
          padding: 8px;
          font-size: 12px;
          color: #07c160;
          background: #f5f5f5;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          transition: background-color 0.15s ease;
        }
        .wx-me-action-btn:hover { background-color: #e8f5e9; }

        /* 叙事结构：作品集章节样式 */
        .wx-me-chapter {
          background: #fff;
          margin-bottom: 1px;
        }
        .wx-me-chapter-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          background: linear-gradient(135deg, #f9f9f9, #fff);
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .wx-me-chapter-header:hover {
          background: linear-gradient(135deg, #f5f5f5, #fafafa);
        }
        .wx-me-chapter-header:active {
          background: linear-gradient(135deg, #eee, #f5f5f5);
        }
        .wx-me-chapter-num {
          font-size: 24px;
          font-weight: 800;
          color: #e0e0e0;
          line-height: 1;
          min-width: 28px;
        }
        .wx-me-chapter-info {
          flex: 1;
          min-width: 0;
        }
        .wx-me-chapter-title {
          font-size: 15px;
          font-weight: 700;
          color: #2C2820;
          margin-bottom: 2px;
        }
        .wx-me-chapter-sub {
          font-size: 11px;
          color: #bbb;
        }
        .wx-me-chapter-body {
          padding: 0 14px 10px;
        }
        .wx-me-narrative {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #f8f8f8;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .wx-me-narrative:last-child {
          border-bottom: none;
        }
        .wx-me-narrative:hover {
          background-color: #fafafa;
          margin: 0 -14px;
          padding-left: 24px;
          padding-right: 14px;
        }
        .wx-me-narrative-icon {
          font-size: 24px;
          line-height: 1;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .wx-me-narrative-content {
          flex: 1;
          min-width: 0;
        }
        .wx-me-narrative-label {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 2px;
        }
        .wx-me-narrative-text {
          font-size: 12px;
          color: #999;
          line-height: 1.5;
        }

        .wx-me-footer {
          text-align: center;
          padding: 24px 14px 30px;
        }

        .wx-me-slogan {
          font-size: 11px;
          color: #ddd;
          letter-spacing: 0.04em;
        }

        /* 章节选择器（门牌号式） */
        .wx-chapter-picker {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .wx-chapter-picker-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 12px;
          background: #FFFBF0;
          cursor: pointer;
          transition: background-color 0.15s ease, box-shadow 0.15s ease;
          border: 2px solid transparent;
        }
        .wx-chapter-picker-item:hover {
          background: rgba(144, 238, 144, 0.2);
        }
        .wx-chapter-picker-active {
          border-color: #4a7c59;
          background: rgba(144, 238, 144, 0.15);
          box-shadow: 0 2px 8px rgba(74, 124, 89, 0.12);
        }
        .wx-chapter-picker-icon {
          font-size: 18px;
          flex-shrink: 0;
        }
        .wx-chapter-picker-num {
          font-size: 12px;
          font-weight: 700;
          color: #999;
          letter-spacing: 0.02em;
        }
        .wx-chapter-picker-name {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }
        .wx-chapter-picker-active .wx-chapter-picker-num {
          color: #4a7c59;
        }

        /* ===== 聊天界面 ===== */
        .apt-chat {
          max-width: 640px; margin: 0 auto;
          display: flex; flex-direction: column;
          height: 100vh;
        }
        .apt-chat-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 4px; border-bottom: 1px solid #E8E2D4;
          flex-shrink: 0;
          gap: 8px;
        }
        .apt-chat-header-left {
          display: flex; align-items: center; gap: 12px;
        }
        .apt-chat-header-actions {
          display: flex; align-items: center; gap: 4px; flex-shrink: 0;
        }
        .apt-bg-btn {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px;
          font-size: 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .apt-bg-btn:hover {
          background-color: rgba(0,0,0,0.05);
        }
        .apt-chat-emoji {
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .apt-chat-header-info {
          display: flex; flex-direction: column; gap: 2px;
        }
        .apt-chat-name {
          font-size: 15px; font-weight: 600; letter-spacing: 0.03em;
        }
        .apt-chat-meta {
          font-size: 11px; color: #B0A898; letter-spacing: 0.04em;
        }
        .apt-chat-status {
          font-size: 11px; letter-spacing: 0.08em;
          font-family: "Courier New", monospace;
        }

        /* 消息滚动区 */
        .apt-chat-scroll {
          flex: 1; overflow-y: auto;
          margin: 0; padding: 8px 12px;
          display: flex; flex-direction: column; gap: 8px;
          scrollbar-width: thin;
          scrollbar-color: rgba(0,0,0,0.06) transparent;
        }
        .apt-chat-scroll-bg {
          background-color: #FFFFFF;
          border-radius: 12px;
          margin: 0 4px;
          padding: 12px 16px;
        }
        .apt-chat-scroll::-webkit-scrollbar { width: 4px; }
        .apt-chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.06); border-radius: 2px;
        }

        .apt-chat-empty {
          text-align: center; padding: 40px 20px;
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .apt-chat-empty-emoji { font-size: 48px; display: block; margin-bottom: 14px; }
        .apt-chat-empty-text {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 18px; color: #A08050; margin: 0 0 8px;
          letter-spacing: 0.04em;
        }
        .apt-chat-empty-hint {
          font-size: 13px; color: #B0A898; margin: 0; line-height: 1.6;
        }

        /* 消息气泡 */
        .apt-bubble {
          display: flex; align-items: flex-end; gap: 8px;
          max-width: 85%;
          position: relative;
          margin: 0;
          padding: 0;
        }
        .apt-bubble-user {
          align-self: flex-end; flex-direction: row-reverse;
        }
        .apt-bubble-char {
          align-self: flex-start;
        }

        /* 头像容器：头像 + 尖角 */
        .apt-bubble-avatar-wrap {
          display: flex; flex-direction: column; align-items: center;
          flex-shrink: 0; margin-bottom: 4px;
          position: relative;
        }
        .apt-bubble-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
          border: 1.5px solid rgba(0,0,0,0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .apt-bubble-avatar:hover {
          transform: scale(1.1);
        }
        .apt-bubble-avatar-emoji {
          line-height: 1;
        }
        .apt-bubble-avatar-tail {
          width: 0; height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid #E8E2D4;
          margin-top: -1px;
          opacity: 0.7;
        }

        /* 气泡主体 */
        .apt-bubble-body {
          padding: 8px 12px; border-radius: 18px;
          font-size: 14px; line-height: 1.4;
          word-break: break-word;
          position: relative;
          overflow: visible;
        }
        .apt-bubble-user .apt-bubble-body {
          border-bottom-right-radius: 6px;
        }
        .apt-bubble-char .apt-bubble-body {
          border-bottom-left-radius: 6px;
        }

        /* 主题气泡额外样式 */
        .apt-bubble-themed {
          padding: 14px 18px;
          border-radius: 20px;
        }
        .apt-bubble-themed::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }
        .apt-bubble-themed .apt-bubble-name,
        .apt-bubble-themed .apt-bubble-text {
          position: relative; z-index: 1;
        }
        .apt-bubble-themed .apt-bubble-deco-svg {
          position: absolute !important;
          z-index: 0;
        }

        /* 线条小狗专属气泡 */
        .apt-bubble-linepuppy {
          padding: 14px 18px;
          border-radius: 20px;
          position: relative;
          overflow: visible;
        }
        .apt-bubble-linepuppy::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }
        .apt-bubble-linepuppy .apt-bubble-text {
          position: relative; z-index: 1;
          padding-right: 20px;
        }
        .apt-bubble-linepuppy .apt-linepuppy-svg {
          position: absolute !important;
          left: -36px;
          top: -8px;
          width: 48px;
          height: 48px;
          z-index: 2;
        }
        .apt-bubble-linepuppy .apt-star-deco {
          position: absolute !important;
          z-index: 2;
        }

        /* 电视旋钮 */
        .apt-bubble-knobs {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          gap: 6px;
          z-index: 2;
        }
        .apt-knob {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1.5px solid #C08080;
        }
        .apt-knob-red { background: #E88A8A; }
        .apt-knob-white { background: #FFF8F8; }

        .apt-bubble-name {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 600;
          margin-bottom: 5px; letter-spacing: 0.04em;
        }
        .apt-bubble-text { margin: 0; position: relative; z-index: 1; }
        .apt-bubble-text p { margin: 0; }
        .apt-bubble-time {
          display: block;
          font-size: 10px;
          color: #b0b0b0;
          margin-top: 4px;
          text-align: right;
          letter-spacing: 0.02em;
        }
        .apt-bubble-user .apt-bubble-time { text-align: left; }

        /* 输入中动画 */
        .apt-typing {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 12px; align-self: flex-start;
        }
        .apt-typing-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #C8B898; animation: apt-typing-bounce 1.2s infinite ease-in-out;
        }
        .apt-typing-dot:nth-child(2) { animation-delay: 0.15s; }
        .apt-typing-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes apt-typing-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        .apt-typing-name {
          font-size: 11px; color: #B0A898; margin-left: 4px;
          letter-spacing: 0.04em;
        }

        /* 输入区 */
        .apt-chat-inputbar {
          display: flex; gap: 10px; padding: 12px 4px 0;
          border-top: 1px solid #E8E2D4;
          flex-shrink: 0;
        }
        .apt-chat-input {
          flex: 1; background: #FFFFFF; border: 1px solid #E8E2D4;
          border-radius: 12px; padding: 10px 14px; color: #3D3830;
          font-size: 14px; line-height: 1.6; resize: none; outline: none;
          font-family: inherit;
        }
        .apt-chat-input::placeholder { color: #B0A898; }
        .apt-chat-input:focus { border-color: #C8B898; }
        .apt-chat-input:disabled { opacity: 0.5; }
        .apt-chat-send {
          padding: 10px 20px; border: none; border-radius: 12px;
          font-size: 14px; font-weight: 600; color: #FFFFFF;
          font-family: inherit; letter-spacing: 0.06em;
          transition: opacity 0.2s ease, transform 0.2s ease;
          flex-shrink: 0; align-self: flex-end;
        }
        .apt-chat-send:hover:not(:disabled) { transform: translateY(-1px); }
        .apt-chat-send:disabled { cursor: not-allowed; }

        /* ===== 移动端 ===== */
        @media (max-width: 520px) {
          .apt-page { padding: 0; }
          .wx-lobby {
            max-width: 100%;
            margin: 0 auto;
            border-radius: 0;
            box-shadow: none;
            min-height: 100vh;
          }
          .wx-header { height: 48px; padding: 12px 16px; }
          .wx-header-title { font-size: 16px; }
          .wx-item { padding: 10px 14px; height: 56px; }
          .wx-avatar { width: 36px; height: 36px; font-size: 20px; }
          .wx-name { font-size: 14px; }
          .wx-msg { font-size: 12px; }
          .wx-tabbar { height: 44px; }
          .wx-tab-icon { font-size: 20px; }

          .apt-chat { height: 100vh; }
          .apt-bubble { max-width: 92%; margin: 0; padding: 0; }
          .apt-bubble-body { padding: 8px 12px; font-size: 13px; border-radius: 16px; line-height: 1.4; }
          .apt-chat-scroll { padding: 8px 12px; gap: 8px; }
          .apt-bubble-themed { padding: 12px 14px; border-radius: 18px; }
          .apt-bubble-linepuppy { padding: 12px 14px; border-radius: 18px; }
          .apt-bubble-linepuppy .apt-bubble-text { padding-right: 16px; }
          .apt-bubble-avatar { width: 30px; height: 30px; font-size: 15px; }
          .apt-bubble-avatar-tail { border-left-width: 4px; border-right-width: 4px; border-top-width: 4px; }
          .apt-bubble-deco-svg { display: none; }
          .apt-linepuppy-svg { display: none; }
          .apt-star-deco { display: none; }
          .apt-bubble-knobs { display: none; }
          .apt-chat-inputbar { padding: 10px 0 0; }
          .apt-chat-send { padding: 8px 14px; font-size: 13px; }

          /* 「我」页面移动端适配 */
          .wx-me-bg-btn { width: 28px; height: 28px; font-size: 14px; top: 8px; right: 8px; }
          .wx-me-glass-card { padding: 14px; gap: 10px; }
          .wx-me-avatar { width: 48px; height: 48px; }
          .wx-me-name { font-size: 15px; }
          .wx-me-signature { font-size: 12px; }
          .wx-me-edit { font-size: 12px !important; }
          .wx-me-status-pill { font-size: 11px; padding: 4px 10px; }
          .wx-me-section-icon { font-size: 13px; }
          .wx-me-section-title { font-size: 12px; }
          .wx-me-cell { padding: 10px 12px; gap: 8px; }
          .wx-me-cell-icon { font-size: 16px; width: 20px; }
          .wx-me-cell-label { font-size: 13px; }
          .wx-moment-publish-btn { font-size: 12px; padding: 6px 14px; }
          .wx-moment-content { font-size: 13px; }
          .wx-moment-images { gap: 4px; }
          .wx-moment-img-thumb { width: 60px !important; height: 60px !important; }
          .wx-moment-comment-input input { font-size: 13px; padding: 8px 10px; }

          /* 发现页移动端适配 */
          .wx-discover-feed-card { padding: 12px; }
          .wx-discover-feed-text { font-size: 13px; }
          .wx-discover-feed-time { font-size: 10px; }

          /* 朋友圈动态流移动端 */
          .wx-moment-name { font-size: 13px; }
          .wx-moment-time { font-size: 10px; }
          .wx-moment-more-btn { font-size: 14px; }
          .wx-moment-actions { font-size: 12px; }
        }
      `}</style>
    </div>
  );
};

export default SystemTuningPage;
