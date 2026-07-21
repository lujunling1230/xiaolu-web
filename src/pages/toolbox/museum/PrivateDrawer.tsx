/**
 * 私藏匣 · 手绘记忆卡片系统
 *
 * 把心事折成卡片，藏进抽屉。
 * 设计理念：旧照片、手写字、情绪色彩、角落的小装饰。
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ============================================================
   Types
   ============================================================ */

export interface PrivateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PrivateItem {
  id: string;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  color: "blue" | "red" | "yellow" | "green" | "cream";
  decoration: "flower" | "star" | "leaf" | "heart" | "none";
  createdAt: string;
  title?: string;
  hidden?: boolean;
}

/* ============================================================
   Constants & Helpers
   ============================================================ */

const STORAGE_KEY = "museum_private_drawer";

const COLOR_MAP: Record<PrivateItem["color"], string> = {
  blue: "#7A9CC6",
  red: "#C97B7B",
  yellow: "#C9B57A",
  green: "#7BA68A",
  cream: "#C8B8A0",
};

const BACK_TEXTS = [
  "这是你藏在心底的声音。",
  "有些话，不必说出口，卡片替你记得。",
  "时间会过去，但这一刻被留了下来。",
  "曾经的心情，现在看起来依然真实。",
  "记忆是另一种形式的永恒。",
  "抽屉里的光，是你自己点亮的。",
];

const COMPANION_LINES = [
  "这张卡片…是你什么时候藏起来的？",
  "摸摸它，也许能想起当时的心情。",
  "有些记忆，轻轻碰一下就会发光。",
  "这里的每一张，都是你的一部分。",
  "你还好吗？这张卡片看起来有点温柔。",
  "小时候的秘密，现在也值得被珍藏。",
];

function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }
  return Math.abs(Math.sin(hash + 1)) % 1;
}

function cardTilt(id: string): number {
  return -2 + seededRandom(id + "-tilt") * 4;
}

function cardRadius(id: string): string {
  const r = (n: string) => seededRandom(id + n);
  const f = (v: number) => (10 + v * 6).toFixed(1);
  return `${f(r("-br1"))}px ${f(r("-br2"))}px ${f(r("-br3"))}px ${f(r("-br4"))}px`;
}

function backTextFor(id: string): string {
  return BACK_TEXTS[Math.floor(seededRandom(id + "-back") * BACK_TEXTS.length)];
}

function formatDate(ts: string): string {
  try {
    return new Date(Number(ts) || ts).toLocaleDateString("zh-CN");
  } catch {
    return "";
  }
}

function loadItems(): PrivateItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as any[];
    if (!Array.isArray(data)) return [];
    const colors: PrivateItem["color"][] = ["blue", "red", "yellow", "green", "cream"];
    const decorations: PrivateItem["decoration"][] = ["flower", "star", "leaf", "heart", "none"];
    return data.map((item) => {
      if (item.text !== undefined && item.color !== undefined) {
        return { ...item, createdAt: String(item.createdAt) } as PrivateItem;
      }
      const id = item.id || genId();
      return {
        id,
        text: item.content || item.text || "",
        imageUrl: item.imageUrl,
        audioUrl: item.audioUrl,
        color: item.color || colors[Math.floor(seededRandom(id + "-color") * colors.length)],
        decoration:
          item.decoration || decorations[Math.floor(seededRandom(id + "-deco") * decorations.length)],
        createdAt: item.createdAt ? String(item.createdAt) : String(Date.now()),
        title: item.title,
      };
    });
  } catch {
    return [];
  }
}

function saveItems(items: PrivateItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

/* ============================================================
   Icons
   ============================================================ */

function FlowerIcon({ s = 16, c = "currentColor" }: { s?: number; c?: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
      <path d="M12 2C13 5 15 7 18 8C15 9 13 11 12 14C11 11 9 9 6 8C9 7 11 5 12 2Z" opacity="0.9" />
      <circle cx="12" cy="9" r="1.5" fill="rgba(255,255,255,0.6)" />
    </svg>
  );
}

function StarIcon({ s = 16, c = "currentColor" }: { s?: number; c?: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
      <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" opacity="0.9" />
    </svg>
  );
}

function LeafIcon({ s = 16, c = "currentColor" }: { s?: number; c?: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
      <path d="M12 2C7 4 4 9 4 14C4 17 6 20 9 21C7 18 7 14 9 11C10 13 13 14 15 13C13 15 13 18 15 20C18 18 20 14 20 10C20 6 16 2 12 2Z" opacity="0.9" />
    </svg>
  );
}

function HeartIcon({ s = 16, c = "currentColor" }: { s?: number; c?: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" opacity="0.9" />
    </svg>
  );
}

function WaveIcon({ s = 14, c = "currentColor" }: { s?: number; c?: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <path d="M2 10c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0" />
      <path d="M2 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0" opacity="0.6" />
    </svg>
  );
}

function PenIcon({ s = 20 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function CloseIcon({ s = 16 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

/* ============================================================
   Lock Progress Ring
   ============================================================ */

function LockProgressRing({ progress, visible }: { progress: number; visible: boolean }) {
  const radius = 56;
  const stroke = 3;
  const nr = radius - stroke;
  const circum = nr * 2 * Math.PI;
  const off = circum - (progress / 100) * circum;
  return (
    <svg
      width={radius * 2}
      height={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s",
        pointerEvents: "none",
      }}
    >
      <circle stroke="rgba(196,149,58,0.12)" fill="transparent" strokeWidth={stroke} r={nr} cx={radius} cy={radius} />
      <circle
        stroke="#c4953a"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circum} ${circum}`}
        style={{
          strokeDashoffset: off,
          transformOrigin: "50% 50%",
          transform: "rotate(-90deg)",
          transition: "stroke-dashoffset 0.06s linear",
        } as React.CSSProperties}
        r={nr}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
}

/* ============================================================
   Companion Ghost
   ============================================================ */

function CompanionGhost({ visible, line }: { visible: boolean; line: string }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.5 }}
          style={styles.companionWrap}
        >
          <div style={styles.companionBubble}>
            <span style={styles.companionText}>{line}</span>
          </div>
          <svg width="36" height="44" viewBox="0 0 32 40" fill="none" style={{ opacity: 0.6 }}>
            <path
              d="M16 4C10 4 6 9 6 16V36C6 36 8 34 10 34C12 34 14 36 16 36C18 36 20 34 22 34C24 34 26 36 26 36V16C26 9 22 4 16 4Z"
              fill="rgba(200,190,170,0.25)"
              stroke="rgba(200,190,170,0.35)"
              strokeWidth="1"
            />
            <circle cx="12" cy="16" r="1.5" fill="rgba(200,190,170,0.5)" />
            <circle cx="20" cy="16" r="1.5" fill="rgba(200,190,170,0.5)" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   Component
   ============================================================ */

export default function PrivateDrawer({ isOpen, onClose }: PrivateDrawerProps) {
  /* ---- Lock state ---- */
  const [unlocked, setUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [lockPressing, setLockPressing] = useState(false);
  const [lockProgress, setLockProgress] = useState(0);

  /* ---- Content state ---- */
  const [items, setItems] = useState<PrivateItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set());
  const [detailItem, setDetailItem] = useState<PrivateItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  /* ---- Companion state ---- */
  const [companionVisible, setCompanionVisible] = useState(false);
  const [companionLine, setCompanionLine] = useState(COMPANION_LINES[0]);

  /* ---- Card pagination state ---- */
  const [currentCardPage, setCurrentCardPage] = useState(0);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  /* ---- Form state ---- */
  const [formTitle, setFormTitle] = useState("");
  const [formText, setFormText] = useState("");
  const [formImage, setFormImage] = useState<string | null>(null);
  const [formColor, setFormColor] = useState<PrivateItem["color"]>("blue");
  const [formDecoration, setFormDecoration] = useState<PrivateItem["decoration"]>("none");

  /* ---- Audio state ---- */
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ---- Refs ---- */
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unlockTimer = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastClickTime = useRef<Record<string, number>>({});
  const companionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- Load / Persist ---- */
  useEffect(() => {
    if (isOpen) {
      setItems(loadItems());
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && unlocked) {
      saveItems(items);
    }
  }, [items, isOpen, unlocked]);

  /* ---- Companion lifecycle ---- */
  useEffect(() => {
    if (!unlocked) {
      setCompanionVisible(false);
      return;
    }
    const t1 = setTimeout(() => {
      setCompanionLine(COMPANION_LINES[Math.floor(Math.random() * COMPANION_LINES.length)]);
      setCompanionVisible(true);
    }, 3000);
    const t2 = setTimeout(() => setCompanionVisible(false), 8000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [unlocked]);

  /* ---- Escape key handler ---- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (detailItem) setDetailItem(null);
        else if (showForm) { resetForm(); setShowForm(false); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [detailItem, showForm]);

  /* ---- Cleanup on unmount ---- */
  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      if (unlockTimer.current !== null) cancelAnimationFrame(unlockTimer.current);
      if (companionTimer.current) clearTimeout(companionTimer.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  /* ---- Lock long-press (2s) ---- */
  const handleLockPressStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setLockPressing(true);
    setLockProgress(0);
    const start = Date.now();
    const dur = 2000;

    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min((elapsed / dur) * 100, 100);
      setLockProgress(p);
      if (p < 100) unlockTimer.current = requestAnimationFrame(tick);
    };
    unlockTimer.current = requestAnimationFrame(tick);

    longPressTimer.current = setTimeout(() => {
      setUnlocking(true);
      setLockPressing(false);
      setLockProgress(0);
      if (unlockTimer.current !== null) {
        cancelAnimationFrame(unlockTimer.current);
        unlockTimer.current = null;
      }
      setTimeout(() => {
        setUnlocked(true);
        setUnlocking(false);
      }, 500);
    }, 2000);
  }, []);

  const handleLockPressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (unlockTimer.current !== null) {
      cancelAnimationFrame(unlockTimer.current);
      unlockTimer.current = null;
    }
    setLockPressing(false);
    setLockProgress(0);
  }, []);

  /* ---- Close drawer ---- */
  const handleClose = useCallback(() => {
    setUnlocked(false);
    setUnlocking(false);
    setFlippedIds(new Set());
    setDetailItem(null);
    setShowForm(false);
    setCurrentCardPage(0);
    resetForm();
    handleLockPressEnd();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingAudioId(null);
    }
    onClose();
  }, [onClose, handleLockPressEnd]);

  /* ---- Form helpers ---- */
  const resetForm = () => {
    setFormTitle("");
    setFormText("");
    setFormImage(null);
    setFormColor("blue");
    setFormDecoration("none");
    setEditingCardId(null);
  };

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert("图片不能超过 4MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setFormImage(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleEditCard = useCallback((item: PrivateItem) => {
    setEditingCardId(item.id);
    setFormTitle(item.title || "");
    setFormText(item.text);
    setFormImage(item.imageUrl || null);
    setFormColor(item.color);
    setFormDecoration(item.decoration);
    setShowForm(true);
  }, []);

  const handleAddCard = useCallback(() => {
    const text = formText.trim();
    if (!text && !formImage) return;
    if (editingCardId) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingCardId
            ? { ...it, text, imageUrl: formImage || undefined, color: formColor, decoration: formDecoration, title: formTitle.trim() || undefined }
            : it
        )
      );
    } else {
      const newItem: PrivateItem = {
        id: genId(),
        text,
        imageUrl: formImage || undefined,
        color: formColor,
        decoration: formDecoration,
        createdAt: String(Date.now()),
        title: formTitle.trim() || undefined,
      };
      setItems((prev) => [...prev, newItem]);
    }
    resetForm();
    setShowForm(false);
  }, [formText, formImage, formColor, formDecoration, formTitle, editingCardId]);

  /* ---- Card interactions ---- */
  const toggleFlip = useCallback((id: string) => {
    setFlippedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }, []);

  const handleCardClick = useCallback(
    (id: string) => {
      const now = Date.now();
      const last = lastClickTime.current[id] || 0;
      lastClickTime.current[id] = now;
      if (now - last < 350) {
        const it = items.find((i) => i.id === id);
        if (it) setDetailItem(it);
      } else {
        setTimeout(() => {
          if (lastClickTime.current[id] === now) toggleFlip(id);
        }, 360);
      }
    },
    [items, toggleFlip]
  );

  const handleCardHover = useCallback(() => {
    if (Math.random() > 0.65) {
      if (companionTimer.current) clearTimeout(companionTimer.current);
      setCompanionLine(COMPANION_LINES[Math.floor(Math.random() * COMPANION_LINES.length)]);
      setCompanionVisible(true);
      companionTimer.current = setTimeout(() => setCompanionVisible(false), 3500);
    }
  }, []);

  const playAudio = useCallback(
    (url: string, id: string) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (playingAudioId === id) {
        setPlayingAudioId(null);
        return;
      }
      const a = new Audio(url);
      audioRef.current = a;
      setPlayingAudioId(id);
      a.play().catch(() => setPlayingAudioId(null));
      a.onended = () => setPlayingAudioId(null);
    },
    [playingAudioId]
  );

  const Deco = ({ t, c }: { t: PrivateItem["decoration"]; c: string }) => {
    if (t === "none") return null;
    const p = { s: 14, c };
    switch (t) {
      case "flower":
        return <FlowerIcon {...p} />;
      case "star":
        return <StarIcon {...p} />;
      case "leaf":
        return <LeafIcon {...p} />;
      case "heart":
        return <HeartIcon {...p} />;
      default:
        return null;
    }
  };

  /* ---- renderCard helper ---- */
  const renderCard = useCallback((item: PrivateItem, idx: number, total: number, onPrev?: () => void, onNext?: () => void, onEdit?: () => void) => {
    const isFlipped = flippedIds.has(item.id);
    const color = COLOR_MAP[item.color];
    const tilt = cardTilt(item.id);
    const radius = cardRadius(item.id);
    const pageNum = String(idx + 1).padStart(2, "0");
    const totalNum = String(total).padStart(2, "0");
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.6), ease: "easeOut" }}
        className={`memory-card memory-card--${item.color}`}
        style={{
          ["--card-color" as string]: color,
          transform: `rotate(${tilt}deg)`,
          borderRadius: radius,
        }}
        onClick={() => handleCardClick(item.id)}
        onMouseEnter={handleCardHover}
      >
        <div className={`memory-card__inner ${isFlipped ? "is-flipped" : ""}`}>
          {/* Front */}
          <div className="memory-card__front" style={{ borderColor: color, borderRadius: radius }}>
            {/* Corner decorations - positioned on the thick border */}
            {item.decoration !== "none" && (
              <>
                <div className="mc-deco mc-deco--tl"><Deco t={item.decoration} c={color} /></div>
                <div className="mc-deco mc-deco--br"><Deco t={item.decoration === "flower" ? "flower" : "star"} c={color} /></div>
              </>
            )}
            {/* Title area - on the colored border */}
            {item.title && (
              <div className="mc-title-bar" style={{ background: color }}>
                <span className="mc-title-bar__text">{item.title}</span>
              </div>
            )}
            {/* Inner white frame */}
            <div className="mc-inner-frame">
              <div className="mc-content-area">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="mc-content-img" />
                ) : (
                  <div className="mc-content-text">
                    <p>{item.text}</p>
                  </div>
                )}
              </div>
            </div>
            {/* Bottom player bar - navigation controls */}
            <div className="mc-player-bar" style={{ background: "#F5F0E6" }}>
              <div className="mc-player-bar__track">
                <div className="mc-player-bar__fill" style={{ background: color, width: total > 0 ? `${((idx + 1) / total) * 100}%` : "0%" }} />
              </div>
              <div className="mc-player-bar__controls">
                <button
                  className="mc-player-bar__nav-btn"
                  onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
                  title="上一张"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill={color}><polygon points="18,3 6,12 18,21" /></svg>
                </button>
                <button
                  className="mc-player-bar__edit-btn"
                  onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
                  title="编辑"
                  style={{ borderColor: color, color }}
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </button>
                <button
                  className="mc-player-bar__nav-btn"
                  onClick={(e) => { e.stopPropagation(); onNext?.(); }}
                  title="下一张"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill={color}><polygon points="6,3 18,12 6,21" /></svg>
                </button>
                <span className="mc-player-bar__page" style={{ color, marginLeft: "auto" }}>
                  {pageNum} / {totalNum}
                </span>
                {item.audioUrl && (
                  <div className="mc-player-bar__audio" style={{ color }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12 C2 12 6 8 10 12 C14 16 18 8 22 12" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Back */}
          <div className="memory-card__back" style={{ borderColor: color, borderRadius: radius }}>
            <div className="memory-card__back-text" style={{ color }}>
              {backTextFor(item.id)}
            </div>
            <div className="memory-card__back-date">
              {formatDate(item.createdAt)}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }, [flippedIds, handleCardClick, handleCardHover, handleEditCard]);

  /* ---- Render ---- */
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="private-drawer-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          style={styles.overlay}
          className="drawer-velvet"
        >
          <style>{CSS}</style>

          <AnimatePresence mode="wait">
            {!unlocked ? (
              /* ======== LOCK SCREEN ======== */
              <motion.div
                key="lock-screen"
                initial={{ opacity: 0 }}
                animate={unlocking ? { opacity: 0 } : { opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={styles.lockContainer}
              >
                <motion.div
                  animate={
                    unlocking
                      ? { scale: [1, 0.8, 0], opacity: [1, 0.6, 0] }
                      : { scale: [1, 1.02, 1], opacity: 1 }
                  }
                  transition={
                    unlocking
                      ? { duration: 0.5, ease: "easeIn" }
                      : {
                          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                          opacity: { duration: 0.3 },
                        }
                  }
                  style={styles.lockSvgWrap}
                >
                  <LockProgressRing progress={lockProgress} visible={lockPressing} />
                  <svg width="80" height="100" viewBox="0 0 80 100" fill="none">
                    <motion.path
                      d="M24 42 V32 C24 18 32 8 40 8 C48 8 56 18 56 32 V42"
                      stroke="#8B6B4F"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                      animate={unlocking ? { y: -12, opacity: 0 } : { y: 0, opacity: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="lockBodyGrad" x1="16" y1="40" x2="64" y2="80" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#A08060" />
                        <stop offset="100%" stopColor="#6B4B2F" />
                      </linearGradient>
                    </defs>
                    <motion.rect
                      x="16"
                      y="40"
                      width="48"
                      height="40"
                      rx="5"
                      fill="url(#lockBodyGrad)"
                      animate={unlocking ? { scale: 0.85, opacity: 0 } : { scale: 1, opacity: 1 }}
                      transition={{ duration: 0.45, ease: "easeIn" }}
                      style={{ originX: "50%", originY: "50%" }}
                    />
                    <rect x="18" y="42" width="44" height="36" rx="4" fill="none" stroke="#7B5B3F" strokeWidth="1" opacity="0.4" />
                    <circle cx="40" cy="56" r="5" fill="#1a1a1a" />
                    <rect x="38" y="56" width="4" height="8" rx="1" fill="#1a1a1a" />
                    <rect x="22" y="44" width="12" height="3" rx="1.5" fill="#c4953a" opacity="0.35" />
                  </svg>
                </motion.div>

                <motion.p style={styles.lockTitle} animate={unlocking ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  馆长私藏
                </motion.p>
                <motion.p style={styles.lockSubtitle} animate={unlocking ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
                  此处无展品，只有心事。
                </motion.p>
                <motion.p style={styles.lockHint} animate={unlocking ? { opacity: 0 } : { opacity: 0.45 }} transition={{ duration: 0.3, delay: 0.1 }}>
                  （长按铜锁以打开）
                </motion.p>
              </motion.div>
            ) : (
              /* ======== UNLOCKED CONTENT ======== */
              <motion.div
                key="content-screen"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                style={styles.contentContainer}
              >
                {/* Top bar */}
                <div style={styles.topBar}>
                  <span style={styles.topBarTitle}>私藏匣</span>
                  <button onClick={handleClose} className="pd-close-btn" style={styles.closeBtn}>
                    <CloseIcon s={14} />
                    <span style={{ marginLeft: 6 }}>锁上</span>
                  </button>
                </div>

                {/* Card grid */}
                <div style={styles.scrollArea}>
                  {items.length === 0 ? (
                    <div style={styles.emptyState}>
                      <p style={styles.emptyLine1}>抽屉是空的。</p>
                      <p style={styles.emptyLine2}>试着放下那些无处安放的瞬间吧。</p>
                      <p style={styles.emptyLine3}>
                        比如一场雨的气味，一个未完成的梦，
                        <br />
                        或者那个你从未告诉别人的名字。
                      </p>
                    </div>
                  ) : (
                    (() => {
                      const visibleItems = items.filter(i => !i.hidden);
                      if (visibleItems.length === 0) return null;
                      const safePage = Math.min(currentCardPage, visibleItems.length - 1);
                      const currentItem = visibleItems[safePage];
                      const handlePrev = () => setCurrentCardPage(prev => prev <= 0 ? visibleItems.length - 1 : prev - 1);
                      const handleNext = () => setCurrentCardPage(prev => (prev + 1) % visibleItems.length);
                      const handleEdit = () => handleEditCard(currentItem);
                      return (
                        <div className="pd-collage pd-collage--single">
                          <AnimatePresence mode="popLayout">
                            {renderCard(currentItem, safePage, visibleItems.length, handlePrev, handleNext, handleEdit)}
                          </AnimatePresence>
                        </div>
                      );
                    })()
                  )}
                </div>

                {/* Floating add button */}
                <button className="fab-add" onClick={() => setShowForm(true)} style={styles.fabAdd}>
                  <PenIcon s={20} />
                </button>

                {/* AI Companion */}
                <CompanionGhost visible={companionVisible} line={companionLine} />

                {/* Add card form overlay */}
                <AnimatePresence>
                  {showForm && (
                    <motion.div
                      className="form-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => { resetForm(); setShowForm(false); }}
                    >
                      <motion.div
                        className="form-card"
                        initial={{ opacity: 0, scale: 0.8, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 30 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="form-card__header">{editingCardId ? "编辑卡片" : "写一张新卡片"}</div>
                        <input
                          className="form-input"
                          placeholder="给这段记忆起个名字..."
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                        />
                        <textarea
                          className="form-textarea"
                          placeholder="写下你想记住的..."
                          value={formText}
                          onChange={(e) => setFormText(e.target.value)}
                          rows={4}
                        />
                        <div className="form-photo" onClick={() => fileInputRef.current?.click()}>
                          {formImage ? (
                            <img src={formImage} alt="预览" className="form-photo__preview" />
                          ) : (
                            <div>
                              <span className="form-photo__label">贴照片（可选）</span>
                              <span className="form-photo__hint">也可以只写文字</span>
                            </div>
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleImageSelect}
                        />

                        <div className="form-row">
                          <span className="form-label">天气</span>
                          <div className="form-picker">
                            {([
                              { key: "blue" as const, label: "雨" },
                              { key: "red" as const, label: "晴" },
                              { key: "yellow" as const, label: "云" },
                              { key: "green" as const, label: "雪" },
                              { key: "cream" as const, label: "风" },
                            ]).map(({ key, label }) => (
                              <button
                                key={key}
                                className={`color-dot color-dot--${key} color-dot--labeled ${formColor === key ? "color-dot--active" : ""}`}
                                onClick={() => setFormColor(key)}
                                style={{
                                  outline: formColor === key ? `2px solid ${COLOR_MAP[key]}` : "2px solid transparent",
                                  boxShadow: formColor === key ? `0 0 0 2px #1a1a1a, 0 0 0 4px ${COLOR_MAP[key]}` : "none",
                                }}
                              >
                                <span className="color-dot__label">{label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="form-row">
                          <span className="form-label">装饰</span>
                          <div className="form-picker">
                            {(["flower", "star", "leaf", "heart", "none"] as const).map((d) => (
                              <button
                                key={d}
                                className={`deco-btn ${formDecoration === d ? "deco-btn--active" : ""}`}
                                onClick={() => setFormDecoration(d)}
                              >
                                {d === "none" ? "无" : <Deco t={d} c="#a09080" />}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="form-actions">
                          <button className="form-btn form-btn--secondary" onClick={() => { resetForm(); setShowForm(false); }}>
                            收起
                          </button>
                          <button
                            className="form-btn form-btn--primary"
                            onClick={handleAddCard}
                            disabled={!formText.trim() && !formImage}
                            style={{
                              opacity: formText.trim() || formImage ? 1 : 0.4,
                              cursor: formText.trim() || formImage ? "pointer" : "default",
                            }}
                          >
                            记下了
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Detail overlay */}
                <AnimatePresence>
                  {detailItem && (
                    <motion.div
                      className="memory-detail"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setDetailItem(null)}
                    >
                      <motion.div
                        className="memory-detail__card"
                        initial={{ opacity: 0, scale: 0.6, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", stiffness: 280, damping: 24 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ ["--detail-color" as string]: COLOR_MAP[detailItem.color] }}
                      >
                        {detailItem.title && (
                          <div className="memory-detail__title">{detailItem.title}</div>
                        )}
                        {detailItem.imageUrl && (
                          <img src={detailItem.imageUrl} alt="" className="memory-detail__img" />
                        )}
                        <div className="memory-detail__text">{detailItem.text}</div>
                        <div className="memory-detail__meta">
                          <span>{formatDate(detailItem.createdAt)}</span>
                          {detailItem.audioUrl && (
                            <button
                              className="memory-detail__audio-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                playAudio(detailItem.audioUrl!, detailItem.id);
                              }}
                            >
                              <WaveIcon s={14} c={COLOR_MAP[detailItem.color]} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lock interaction overlay */}
          {!unlocked && (
            <motion.div
              style={styles.lockInteractionOverlay}
              onMouseDown={handleLockPressStart}
              onMouseUp={handleLockPressEnd}
              onMouseLeave={handleLockPressEnd}
              onTouchStart={handleLockPressStart}
              onTouchEnd={handleLockPressEnd}
              onTouchCancel={handleLockPressEnd}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   Inline Styles
   ============================================================ */

const styles: Record<string, React.CSSProperties> = {
  overlay: { position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Serif SC', serif", overflow: "hidden", userSelect: "none" },
  lockContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "40px", position: "relative" },
  lockSvgWrap: { display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px", position: "relative" },
  lockInteractionOverlay: { position: "absolute", inset: 0, zIndex: 10000, cursor: "pointer" },
  lockTitle: { fontSize: "22px", color: "#d4a84a", fontFamily: "'Noto Serif SC', serif", fontWeight: 600, letterSpacing: "4px", margin: 0 },
  lockSubtitle: { fontSize: "14px", color: "#b0a090", fontFamily: "'Noto Serif SC', serif", margin: 0, letterSpacing: "1px" },
  lockHint: { fontSize: "13px", color: "#8a8078", fontFamily: "'Noto Serif SC', serif", margin: 0, marginTop: "8px", transition: "opacity 0.3s" },
  contentContainer: { position: "absolute", inset: 0, display: "flex", flexDirection: "column" },
  topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", flexShrink: 0 },
  topBarTitle: { fontSize: "15px", color: "#8a7a6a", fontFamily: "'Ma Shan Zheng', 'Caveat', cursive, serif", letterSpacing: "2px" },
  closeBtn: { background: "none", border: "none", color: "#a09080", fontSize: "14px", fontFamily: "'Noto Serif SC', serif", cursor: "pointer", padding: "6px 12px", borderRadius: "4px", transition: "color 0.2s", display: "flex", alignItems: "center" },
  scrollArea: { flex: 1, overflowY: "auto", overflowX: "hidden", padding: "16px 20px 80px", WebkitOverflowScrolling: "touch", position: "relative" },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: "40px 32px" },
  emptyLine1: { fontSize: "18px", color: "#a09080", fontFamily: "'Ma Shan Zheng', 'Caveat', cursive, serif", margin: "0 0 20px", letterSpacing: "2px" },
  emptyLine2: { fontSize: "15px", color: "#8a7e72", fontFamily: "'Ma Shan Zheng', 'Caveat', cursive, serif", margin: "0 0 12px", lineHeight: 1.8 },
  emptyLine3: { fontSize: "14px", color: "#7a7068", fontFamily: "'Ma Shan Zheng', 'Caveat', cursive, serif", margin: 0, lineHeight: 2 },
  fabAdd: { position: "absolute", bottom: "24px", right: "24px", width: "56px", height: "56px", borderRadius: "50%", border: "1px solid #3e362e", background: "linear-gradient(135deg, #c4953a, #b08d57)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 50, transition: "transform 0.2s, border-color 0.2s", boxShadow: "0 4px 20px rgba(196,149,58,0.4)", fontSize: "20px" },
  companionWrap: { position: "absolute", bottom: "90px", right: "24px", zIndex: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", pointerEvents: "none" },
  companionBubble: { background: "rgba(40,38,34,0.9)", border: "1px solid rgba(160,144,128,0.2)", borderRadius: "12px", padding: "10px 14px", maxWidth: "180px", opacity: 0.9 },
  companionText: { fontSize: "13px", color: "#a09080", fontFamily: "'Ma Shan Zheng', 'Caveat', cursive, serif", lineHeight: 1.5 },
};

/* ============================================================
   CSS (injected via <style>)
   ============================================================ */

const CSS = `
.drawer-velvet { background-color: #1a1a1a; background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E"); }
.memory-card { perspective: 800px; cursor: pointer; opacity: 0.85; transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
.memory-card:hover { opacity: 1; transform: translateY(-6px) rotate(0deg) !important; z-index: 10; }
.memory-card__inner { position: relative; width: 100%; aspect-ratio: 3 / 4; transform-style: preserve-3d; transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1); }
.memory-card__inner.is-flipped { transform: rotateY(180deg); }
.memory-card__front, .memory-card__back { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; display: flex; flex-direction: column; box-sizing: border-box; overflow: hidden; }

/* Card front - thick border frame */
.memory-card__front {
  transform: rotateY(0deg);
  border: 8px solid var(--card-color);
  background: var(--card-color);
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: none;
}

/* Corner decorations on the thick border */
.mc-deco {
  position: absolute;
  z-index: 2;
  opacity: 0.9;
  pointer-events: none;
}
.mc-deco--tl { top: 2px; left: 2px; }
.mc-deco--br { bottom: 56px; right: 2px; }
.mc-deco--tr { top: 2px; right: 2px; }
.mc-deco--bl { bottom: 56px; left: 2px; }

/* Title on colored border area */
.mc-title-bar {
  padding: 6px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mc-title-bar__text {
  font-family: 'Ma Shan Zheng', 'Caveat', cursive, serif;
  font-size: 14px;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

/* Inner white frame (mat effect) */
.mc-inner-frame {
  margin: 0 0 0 0;
  padding: 0;
  background: #FFFFFF;
  border-top: 2px solid #F5F0E6;
  border-bottom: 2px solid #F5F0E6;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.mc-content-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 8px;
  min-height: 0;
}
.mc-content-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
}
.mc-content-text {
  width: 100%;
  padding: 4px 8px;
}
.mc-content-text p {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  line-height: 1.7;
  color: #5a5248;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
  word-break: break-word;
}

/* Bottom player bar */
.mc-player-bar {
  height: 40px;
  min-height: 40px;
  padding: 6px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}
.mc-player-bar__track {
  height: 2px;
  background: rgba(0,0,0,0.08);
  border-radius: 1px;
  position: relative;
}
.mc-player-bar__fill {
  height: 100%;
  border-radius: 1px;
  opacity: 0.6;
}
.mc-player-bar__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.mc-player-bar__play {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}
.mc-player-bar__audio {
  margin-left: auto;
  opacity: 0.5;
  display: flex;
  align-items: center;
}

/* Card back */
.memory-card__back { transform: rotateY(180deg); align-items: center; justify-content: center; text-align: center; padding: 12px; border: 3px solid var(--card-color); background: rgba(250,248,243,0.85); }
.memory-card__back-text { font-family: 'Ma Shan Zheng', 'Caveat', cursive, serif; font-size: 14px; line-height: 1.8; padding: 0 8px; opacity: 0.75; }
.memory-card__back-date { margin-top: 12px; font-size: 11px; color: #9a9088; font-family: 'Courier New', monospace; opacity: 0.6; }

/* Sections for image/text split */
.pd-collage { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; padding: 4px; }
@media(min-width:640px) { .pd-collage { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; padding: 8px 12px; } }
.mc-section { margin-bottom: 24px; }
.mc-section-label {
  font-size: 13px;
  color: #6a6058;
  font-family: 'Ma Shan Zheng', 'Caveat', cursive, serif;
  letter-spacing: 2px;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 2px solid rgba(200,168,130,0.3);
}
.fab-add:hover { transform: scale(1.08); border-color: #c4953a; }
.pd-collage--single { display: flex; align-items: center; justify-content: center; min-height: 100%; padding: 24px; }
.pd-collage--single .memory-card { width: 220px; max-width: 100%; }
@media(min-width:640px) { .pd-collage--single .memory-card { width: 260px; } }
.mc-player-bar__nav-btn { background: none; border: none; padding: 2px; cursor: pointer; display: flex; align-items: center; justify-content: center; opacity: 0.7; transition: opacity 0.2s; }
.mc-player-bar__nav-btn:hover { opacity: 1; }
.mc-player-bar__edit-btn { width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid; display: flex; align-items: center; justify-content: center; background: none; cursor: pointer; opacity: 0.7; transition: opacity 0.2s; padding: 0; }
.mc-player-bar__edit-btn:hover { opacity: 1; }
.mc-player-bar__page { font-size: 10px; font-family: 'Courier New', monospace; opacity: 0.6; white-space: nowrap; }
.color-dot--labeled { position: relative; width: 28px; height: 28px; }
.color-dot__label { font-size: 10px; color: #5a5248; font-family: 'Noto Serif SC', serif; pointer-events: none; }
.form-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; padding: 20px; }
.form-card { width: 100%; max-width: 360px; aspect-ratio: 3 / 4.2; background: rgba(250,248,243,0.92); border: 3px solid #8a7a6a; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 12px; box-sizing: border-box; overflow-y: auto; }
.form-card__header { font-family: 'Ma Shan Zheng', 'Caveat', cursive, serif; font-size: 16px; color: #5a5248; text-align: center; margin-bottom: 4px; }
.form-input, .form-textarea { background: rgba(255,255,255,0.6); border: 1px solid rgba(90,82,72,0.2); border-radius: 6px; padding: 8px 10px; font-family: 'Noto Serif SC', serif; font-size: 13px; color: #4a4238; outline: none; resize: none; width: 100%; box-sizing: border-box; }
.form-input:focus, .form-textarea:focus { border-color: #c4953a; }
.form-textarea { line-height: 1.6; }
.form-photo { height: 80px; border: 1px dashed rgba(90,82,72,0.3); border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: border-color 0.2s; overflow: hidden; }
.form-photo:hover { border-color: #c4953a; }
.form-photo__label { font-size: 13px; color: #8a7a6a; font-family: 'Ma Shan Zheng', 'Caveat', cursive, serif; }
.form-photo__hint {
  display: block;
  font-size: 10px;
  color: #7a7068;
  margin-top: 4px;
  font-family: "'Noto Serif SC', serif";
}
.form-photo__preview { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }
.form-row { display: flex; align-items: center; gap: 10px; }
.form-label { font-size: 12px; color: #8a7a6a; font-family: 'Noto Serif SC', serif; min-width: 36px; }
.form-picker { display: flex; gap: 10px; flex-wrap: wrap; }
.color-dot { width: 20px; height: 20px; border-radius: 50%; border: none; cursor: pointer; padding: 0; transition: transform 0.15s; }
.color-dot:hover { transform: scale(1.15); }
.color-dot--blue { background: #7A9CC6; } .color-dot--red { background: #C97B7B; } .color-dot--yellow { background: #C9B57A; } .color-dot--green { background: #7BA68A; } .color-dot--cream { background: #C8B8A0; }
.deco-btn { width: 28px; height: 28px; border-radius: 4px; border: 1px solid transparent; background: rgba(90,82,72,0.06); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #8a7a6a; transition: border-color 0.2s; }
.deco-btn--active { border-color: #c4953a; background: rgba(196,149,58,0.08); }
.form-actions { margin-top: auto; display: flex; justify-content: space-between; gap: 10px; }
.form-btn { flex: 1; padding: 8px 0; border-radius: 6px; font-size: 13px; font-family: 'Ma Shan Zheng', 'Caveat', cursive, serif; cursor: pointer; border: none; transition: opacity 0.2s; }
.form-btn--secondary { background: rgba(90,82,72,0.08); color: #8a7a6a; }
.form-btn--primary { background: #5a5248; color: #f0ece4; }
.memory-detail { position: fixed; inset: 0; z-index: 150; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; padding: 24px; }
.memory-detail__card { width: 100%; max-width: 400px; background: rgba(250,248,243,0.95); border: 3px solid var(--detail-color); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 14px; max-height: 80vh; overflow-y: auto; box-sizing: border-box; }
.memory-detail__title { font-family: 'Ma Shan Zheng', 'Caveat', cursive, serif; font-size: 18px; color: var(--detail-color); text-align: center; }
.memory-detail__img { width: 100%; border-radius: 8px; display: block; }
.memory-detail__text { font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.7; color: #4a4238; white-space: pre-wrap; word-break: break-word; }
.memory-detail__meta { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #9a9088; font-family: 'Courier New', monospace; border-top: 1px solid rgba(90,82,72,0.1); padding-top: 10px; }
.memory-detail__audio-btn { background: none; border: none; padding: 4px; cursor: pointer; opacity: 0.7; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center; }
.memory-detail__audio-btn:hover { opacity: 1; }
.pd-close-btn:hover { color: #c4953a !important; }
.pd-collage::-webkit-scrollbar, .form-card::-webkit-scrollbar, .memory-detail__card::-webkit-scrollbar { width: 4px; }
.pd-collage::-webkit-scrollbar-track, .form-card::-webkit-scrollbar-track, .memory-detail__card::-webkit-scrollbar-track { background: transparent; }
.pd-collage::-webkit-scrollbar-thumb, .form-card::-webkit-scrollbar-thumb, .memory-detail__card::-webkit-scrollbar-thumb { background: rgba(90,82,72,0.15); border-radius: 2px; }
`;
