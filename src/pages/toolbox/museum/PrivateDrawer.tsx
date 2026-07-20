/**
 * 私藏匣 · Private Drawer
 *
 * 时光博物馆的私密抽屉 —— 收藏那些无处安放的、碎片化的、不愿示人的心事。
 * 设计理念："Intimate Chaos" —— 深夜、台灯、旧木抽屉、揉皱的纸条。
 *
 * v2 优化：
 *   - 拼贴式布局（随机尺寸、角度倾斜、轻微重叠）
 *   - 深炭灰背景 + 纸张木纹纹理 + Bokeh 光斑
 *   - 滚动阻尼 + 点击卡片聚焦放大 + 背景模糊
 *   - 图标文案：锁上（抽屉拉手）、藏进去（图钉）
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { legacyLoad, legacySave } from "../../../utils/siteData";

/* ============================================================
   Types
   ============================================================ */

export interface PrivateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PrivateItem {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: number;
  rotation: number;
  widthPercent: number;
  heightRatio: number; // 1:1 or 4:3
  hidden?: boolean;
}

/* ============================================================
   Constants & Helpers
   ============================================================ */

const STORAGE_KEY = "museum_private_drawer";

function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** 随机倾斜角度 -2° ~ +2° */
function randomRotation(): number {
  return -2 + Math.random() * 4;
}

/** 随机宽高比：1:1 或 4:3 */
function randomHeightRatio(): number {
  return Math.random() > 0.5 ? 1 : 0.75; // 1 = square, 0.75 = 4:3
}

/** Deterministic pseudo-random from string seed (0..1) */
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }
  return Math.abs(Math.sin(hash + 1)) % 1;
}

function stablePadding(id: string): number {
  return 20 + seededRandom(id + "-pd") * 10;
}

function stableMargin(id: string): number {
  return -4 + seededRandom(id + "-mg") * 8; // 轻微重叠: 负 margin
}

function loadItems(): PrivateItem[] {
  try {
    const data = legacyLoad<PrivateItem[]>(STORAGE_KEY);
    if (Array.isArray(data)) {
      // 迁移旧数据：补 heightRatio
      return data.map((item) => ({
        ...item,
        heightRatio: item.heightRatio ?? (seededRandom(item.id + "-hr") > 0.5 ? 1 : 0.75),
      }));
    }
    return [];
  } catch {
    return [];
  }
}

function saveItems(items: PrivateItem[]): void {
  try {
    legacySave(STORAGE_KEY, items);
  } catch {
    // ignore
  }
}

/* ============================================================
   Lock Progress Ring Component
   ============================================================ */

function LockProgressRing({
  progress,
  visible,
}: {
  progress: number;
  visible: boolean;
}) {
  const radius = 56;
  const stroke = 3;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={radius * 2}
      height={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s",
        pointerEvents: "none",
      }}
    >
      <circle
        stroke="rgba(196, 149, 58, 0.12)"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#c4953a"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        style={{
          strokeDashoffset,
          transformOrigin: "50% 50%",
          transform: "rotate(-90deg)",
          transition: "stroke-dashoffset 0.06s linear",
        } as React.CSSProperties}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
}

/* ============================================================
   Toast Component
   ============================================================ */

function Toast({ visible }: { visible: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s",
        pointerEvents: "none",
        zIndex: 100,
        fontSize: "15px",
        fontFamily: "'Noto Serif SC', serif",
        color: "#c4b8a0",
        letterSpacing: "2px",
        whiteSpace: "nowrap",
      }}
    >
      已收到。
    </div>
  );
}

/* ============================================================
   Drawer Handle Icon (抽屉拉手)
   ============================================================ */

function DrawerHandleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>
  );
}

/* ============================================================
   Pin Icon (图钉)
   ============================================================ */

function PinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 17v5" />
      <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76z" />
    </svg>
  );
}

/* ============================================================
   Component
   ============================================================ */

export default function PrivateDrawer({ isOpen, onClose }: PrivateDrawerProps) {
  /* ---- State ---- */
  const [unlocked, setUnlocked] = useState(false);
  const [items, setItems] = useState<PrivateItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [contextMenu, setContextMenu] = useState<{
    itemId: string;
    x: number;
    y: number;
  } | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [lockProgress, setLockProgress] = useState(0);
  const [lockPressing, setLockPressing] = useState(false);
  const [wobbleDegrees, setWobbleDegrees] = useState(0);
  const [wobbleSigns, setWobbleSigns] = useState<Record<string, number>>({});
  const [toastVisible, setToastVisible] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  /* ---- Refs ---- */
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unlockTimer = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editRef = useRef<HTMLTextAreaElement>(null);
  const lastScrollTop = useRef(0);
  const wobbleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---- Load items on mount / when opened ---- */
  useEffect(() => {
    if (isOpen) {
      setItems(loadItems());
    }
  }, [isOpen]);

  /* ---- Persist items ---- */
  useEffect(() => {
    if (isOpen && unlocked) {
      saveItems(items);
    }
  }, [items, isOpen, unlocked]);

  /* ---- Focus edit textarea when editing starts ---- */
  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus();
      const len = editRef.current.value.length;
      editRef.current.setSelectionRange(len, len);
    }
  }, [editingId]);

  /* ---- Cleanup timers on unmount ---- */
  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      if (unlockTimer.current !== null) cancelAnimationFrame(unlockTimer.current);
      if (wobbleTimeout.current) clearTimeout(wobbleTimeout.current);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  /* ---- Close context menu on any click ---- */
  useEffect(() => {
    const handleClick = () => {
      setContextMenu(null);
      setConfirmDeleteId(null);
    };
    if (contextMenu) {
      window.addEventListener("click", handleClick, true);
      return () => window.removeEventListener("click", handleClick, true);
    }
  }, [contextMenu]);

  /* ---- Unfocus card when clicking background ---- */
  useEffect(() => {
    if (focusedItem) {
      const handler = (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest(".pd-card") === null) {
          setFocusedItem(null);
        }
      };
      // Small delay to prevent immediate unfocus
      const t = setTimeout(() => {
        document.addEventListener("click", handler, true);
      }, 100);
      return () => {
        clearTimeout(t);
        document.removeEventListener("click", handler, true);
      };
    }
  }, [focusedItem]);

  /* ---- Scroll wobble effect (with dampened feel) ---- */
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const scrollTop = scrollRef.current.scrollTop;
    const velocity = Math.abs(scrollTop - lastScrollTop.current);
    lastScrollTop.current = scrollTop;

    // Reduced wobble for dampened feel
    const wobbleAmount = Math.min(velocity * 0.08, 1.5);
    setWobbleDegrees(wobbleAmount);

    setWobbleSigns((prev) => {
      const next: Record<string, number> = {};
      for (const key of Object.keys(prev)) {
        next[key] = Math.random() > 0.5 ? 1 : -1;
      }
      return next;
    });

    if (wobbleTimeout.current) clearTimeout(wobbleTimeout.current);
    wobbleTimeout.current = setTimeout(() => {
      setWobbleDegrees(0);
    }, 300);
  }, []);

  /* ---- Sync wobble signs with visible items ---- */
  useEffect(() => {
    if (unlocked) {
      setWobbleSigns((prev) => {
        const next: Record<string, number> = { ...prev };
        for (const item of items) {
          if (next[item.id] === undefined) {
            next[item.id] = Math.random() > 0.5 ? 1 : -1;
          }
        }
        return next;
      });
    }
  }, [items, unlocked]);

  /* ---- Toast helper ---- */
  const showToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => {
      setToastVisible(false);
    }, 1700);
  }, []);

  /* ---- Lock long press handlers (2 seconds) ---- */
  const handleLockPressStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setLockPressing(true);
      setLockProgress(0);

      const startTime = Date.now();
      const duration = 2000;

      const tick = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        setLockProgress(progress);
        if (progress < 100) {
          unlockTimer.current = requestAnimationFrame(tick);
        }
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
    },
    []
  );

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

  /* ---- Handlers ---- */
  const handleClose = useCallback(() => {
    setUnlocked(false);
    setUnlocking(false);
    setContextMenu(null);
    setEditingId(null);
    setInputValue("");
    setPendingImage(null);
    setFocusedItem(null);
    handleLockPressEnd();
    onClose();
  }, [onClose, handleLockPressEnd]);

  const handleAddItem = useCallback(() => {
    const text = inputValue.trim();
    if (!text && !pendingImage) return;
    const newItem: PrivateItem = {
      id: genId(),
      content: text,
      imageUrl: pendingImage || undefined,
      createdAt: Date.now(),
      rotation: randomRotation(),
      widthPercent: 45 + Math.random() * 50,
      heightRatio: pendingImage ? 1 : randomHeightRatio(),
    };
    setItems((prev) => [...prev, newItem]);
    setInputValue("");
    setPendingImage(null);
    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    showToast();
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  }, [inputValue, pendingImage, showToast]);

  /* ---- 图片选择处理 ---- */
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert("图片不能超过 4MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setPendingImage(result);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleAddItem();
      }
    },
    [handleAddItem]
  );

  const handleLongPressStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent, itemId: string) => {
      setContextMenu(null);
      setConfirmDeleteId(null);
      longPressTimer.current = setTimeout(() => {
        let clientX: number;
        let clientY: number;
        if ("touches" in e) {
          clientX = e.changedTouches[0].clientX;
          clientY = e.changedTouches[0].clientY;
        } else {
          clientX = e.clientX;
          clientY = e.clientY;
        }
        setContextMenu({ itemId, x: clientX, y: clientY });
      }, 600);
    },
    []
  );

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleEdit = useCallback((itemId: string) => {
    setContextMenu(null);
    setItems((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (item) {
        setEditContent(item.content);
        setEditingId(itemId);
      }
      return prev;
    });
  }, []);

  const handleEditSave = useCallback(() => {
    if (editingId) {
      const trimmed = editContent.trim();
      if (trimmed) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === editingId ? { ...item, content: trimmed } : item
          )
        );
      }
      setEditingId(null);
      setEditContent("");
    }
  }, [editingId, editContent]);

  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleEditSave();
      }
      if (e.key === "Escape") {
        setEditingId(null);
        setEditContent("");
      }
    },
    [handleEditSave]
  );

  const handleHide = useCallback((itemId: string) => {
    setContextMenu(null);
    setConfirmDeleteId(null);
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, hidden: true } : item
      )
    );
  }, []);

  const handleDelete = useCallback(
    (itemId: string) => {
      if (confirmDeleteId !== itemId) {
        setConfirmDeleteId(itemId);
        return;
      }
      setContextMenu(null);
      setConfirmDeleteId(null);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    },
    [confirmDeleteId]
  );

  /* ---- Visible items (exclude hidden) ---- */
  const visibleItems = items.filter((item) => !item.hidden);

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
          onClick={(e) => {
            if (e.target === e.currentTarget) return;
          }}
        >
          <style>{CSS}</style>

          {/* ======== LOCK STATE ======== */}
          <AnimatePresence mode="wait">
            {!unlocked ? (
              <motion.div
                key="lock-screen"
                initial={{ opacity: 0 }}
                animate={unlocking ? { opacity: 0 } : { opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={styles.lockContainer}
              >
                {/* Lock with progress ring */}
                <motion.div
                  animate={
                    unlocking
                      ? {
                          scale: [1, 0.8, 0],
                          opacity: [1, 0.6, 0],
                        }
                      : {
                          scale: [1, 1.02, 1],
                          opacity: 1,
                        }
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
                  <LockProgressRing
                    progress={lockProgress}
                    visible={lockPressing}
                  />
                  <svg
                    width="80"
                    height="100"
                    viewBox="0 0 80 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Shackle */}
                    <motion.path
                      d="M24 42 V32 C24 18 32 8 40 8 C48 8 56 18 56 32 V42"
                      stroke="#8B6B4F"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                      animate={
                        unlocking
                          ? { y: -12, opacity: 0 }
                          : { y: 0, opacity: 1 }
                      }
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                    {/* Lock body with metallic gradient */}
                    <defs>
                      <linearGradient
                        id="lockBodyGrad"
                        x1="16"
                        y1="40"
                        x2="64"
                        y2="80"
                        gradientUnits="userSpaceOnUse"
                      >
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
                      animate={
                        unlocking
                          ? { scale: 0.85, opacity: 0 }
                          : { scale: 1, opacity: 1 }
                      }
                      transition={{ duration: 0.45, ease: "easeIn" }}
                      style={{ originX: "50%", originY: "50%" }}
                    />
                    <rect
                      x="18"
                      y="42"
                      width="44"
                      height="36"
                      rx="4"
                      fill="none"
                      stroke="#7B5B3F"
                      strokeWidth="1"
                      opacity="0.4"
                    />
                    <circle cx="40" cy="56" r="5" fill="#1a1a1a" />
                    <rect
                      x="38"
                      y="56"
                      width="4"
                      height="8"
                      rx="1"
                      fill="#1a1a1a"
                    />
                    <rect
                      x="22"
                      y="44"
                      width="12"
                      height="3"
                      rx="1.5"
                      fill="#c4953a"
                      opacity="0.35"
                    />
                  </svg>
                </motion.div>

                {/* Title */}
                <motion.p
                  style={styles.lockTitle}
                  animate={unlocking ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  馆长私藏
                </motion.p>

                {/* Subtitle */}
                <motion.p
                  style={styles.lockSubtitle}
                  animate={unlocking ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                >
                  此处无展品，只有心事。
                </motion.p>

                {/* Hint */}
                <motion.p
                  style={styles.lockHint}
                  animate={unlocking ? { opacity: 0 } : { opacity: 0.45 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  （长按铜锁以打开）
                </motion.p>
              </motion.div>
            ) : (
              /* ======== UNLOCKED / CONTENT STATE ======== */
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
                  <button
                    onClick={handleClose}
                    className="pd-close-btn"
                    style={styles.closeBtn}
                  >
                    <DrawerHandleIcon size={14} />
                    <span style={{ marginLeft: 6 }}>锁上</span>
                  </button>
                </div>

                {/* Scrollable content */}
                <div
                  ref={scrollRef}
                  className="pd-scroll"
                  style={{
                    ...styles.scrollArea,
                    filter: focusedItem ? "blur(2px)" : "none",
                    transition: "filter 0.4s ease",
                  }}
                  onScroll={handleScroll}
                >
                  {/* Toast */}
                  <Toast visible={toastVisible} />

                  {visibleItems.length === 0 ? (
                    <div style={styles.emptyState}>
                      <p style={styles.emptyLine1}>抽屉是空的。</p>
                      <p style={styles.emptyLine2}>
                        试着放下那些无处安放的瞬间吧。
                      </p>
                      <p style={styles.emptyLine3}>
                        比如一场雨的气味，一个未完成的梦，
                        <br />
                        或者那个你从未告诉别人的名字。
                      </p>
                    </div>
                  ) : (
                    <div className="pd-collage">
                      <AnimatePresence>
                        {visibleItems.map((item, idx) => {
                          const isEditing = editingId === item.id;
                          const isFocused = focusedItem === item.id;
                          const showTape = idx % 3 === 1;
                          const pad = stablePadding(item.id);
                          const tapeRotation = -3 + seededRandom(item.id + "-tape") * 6;
                          const sign = wobbleSigns[item.id] ?? 1;
                          const totalRotation =
                            item.rotation + sign * wobbleDegrees;
                          // Collage: random width & height ratio
                          const cardWidth = item.widthPercent;
                          const cardMinHeight = item.heightRatio === 1
                            ? 120
                            : 90;

                          return (
                            <motion.div
                              key={item.id}
                              layout
                              initial={{ opacity: 0, scale: 0.85, y: 20 }}
                              animate={{
                                opacity: 1,
                                scale: isFocused ? 1.03 : 1,
                                y: isFocused ? -4 : 0,
                              }}
                              exit={{ opacity: 0, scale: 0.9, y: -10 }}
                              transition={{
                                duration: isFocused ? 0.35 : 0.35,
                                delay: Math.min(idx * 0.04, 0.5),
                                ease: isFocused ? "easeOut" : "easeOut",
                              }}
                              style={{
                                width: `${cardWidth}%`,
                                zIndex: isFocused ? 50 : idx,
                                position: "relative" as const,
                              }}
                              onClick={(e) => {
                                if (!isEditing) {
                                  e.stopPropagation();
                                  setFocusedItem(isFocused ? null : item.id);
                                }
                              }}
                            >
                              <div
                                className="pd-card"
                                style={{
                                  ...styles.card,
                                  transform: `rotate(${totalRotation}deg)`,
                                  padding: `${pad}px`,
                                  margin: `${stableMargin(item.id)}px 0`,
                                  minHeight: `${cardMinHeight}px`,
                                  transition:
                                    wobbleDegrees === 0
                                      ? "transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease"
                                      : "none",
                                  boxShadow: isFocused
                                    ? "6px 10px 28px rgba(0,0,0,0.55), -2px -2px 8px rgba(0,0,0,0.2), inset 0 0 24px rgba(90,74,58,0.25)"
                                    : undefined,
                                }}
                                onTouchStart={(e) =>
                                  handleLongPressStart(e, item.id)
                                }
                                onTouchEnd={handleLongPressEnd}
                                onTouchCancel={handleLongPressEnd}
                                onMouseDown={(e) =>
                                  handleLongPressStart(e, item.id)
                                }
                                onMouseUp={handleLongPressEnd}
                                onMouseLeave={handleLongPressEnd}
                                onContextMenu={(e) => e.preventDefault()}
                              >
                                {/* Tape decoration */}
                                {showTape && (
                                  <div
                                    style={{
                                      ...styles.tape,
                                      transform: `rotate(${tapeRotation}deg)`,
                                    }}
                                  />
                                )}

                                {isEditing ? (
                                  <textarea
                                    ref={editRef}
                                    className="pd-textarea"
                                    value={editContent}
                                    onChange={(e) =>
                                      setEditContent(e.target.value)
                                    }
                                    onBlur={handleEditSave}
                                    onKeyDown={handleEditKeyDown}
                                    style={styles.editTextarea}
                                  />
                                ) : (
                                  <>
                                    {item.imageUrl && (
                                      <img
                                        src={item.imageUrl}
                                        alt=""
                                        style={{
                                          width: "100%",
                                          borderRadius: "2px",
                                          marginBottom: item.content ? "8px" : 0,
                                          display: "block",
                                        }}
                                      />
                                    )}
                                    {item.content && (
                                      <p
                                        style={{
                                          ...styles.cardText,
                                          fontSize: `${14 + (idx % 5)}px`,
                                        }}
                                      >
                                        {item.content}
                                      </p>
                                    )}
                                  </>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* Input area */}
                <div style={styles.inputArea}>
                  {pendingImage && (
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <img
                        src={pendingImage}
                        alt="待藏"
                        style={{
                          width: 52,
                          height: 52,
                          objectFit: "cover",
                          borderRadius: 4,
                          border: "1px solid rgba(196,149,58,0.3)",
                        }}
                      />
                      <button
                        onClick={() => {
                          setPendingImage(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        style={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          border: "none",
                          background: "#a05040",
                          color: "#fff",
                          fontSize: 11,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          lineHeight: 1,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="(这里没有对错，只有真实......)"
                    className="pd-textarea"
                    style={styles.textarea}
                    rows={2}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: "none" }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="pd-add-btn"
                    style={{
                      ...styles.addBtn,
                      opacity: 1,
                      cursor: "pointer",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <span style={{ marginLeft: 4 }}>图片</span>
                  </button>
                  <button
                    onClick={handleAddItem}
                    className="pd-add-btn"
                    disabled={!inputValue.trim() && !pendingImage}
                    style={{
                      ...styles.addBtn,
                      opacity: inputValue.trim() || pendingImage ? 1 : 0.35,
                      cursor: inputValue.trim() || pendingImage ? "pointer" : "default",
                    }}
                  >
                    <PinIcon size={14} />
                    <span style={{ marginLeft: 4 }}>藏进去</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ======== CONTEXT MENU ======== */}
          <AnimatePresence>
            {contextMenu && (
              <motion.div
                key="ctx-menu"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                style={{
                  ...styles.contextMenu,
                  left: contextMenu.x,
                  top: contextMenu.y,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="pd-ctx-btn"
                  style={styles.ctxBtn}
                  onClick={() => handleEdit(contextMenu.itemId)}
                >
                  再说一会儿
                </button>
                <div style={styles.ctxDivider} />
                <button
                  className="pd-ctx-btn"
                  style={styles.ctxBtn}
                  onClick={() => handleHide(contextMenu.itemId)}
                >
                  收到角落去了
                </button>
                <div style={styles.ctxDivider} />
                <button
                  className="pd-ctx-btn"
                  style={{
                    ...styles.ctxBtn,
                    color:
                      confirmDeleteId === contextMenu.itemId
                        ? "#a05040"
                        : "#8a7a6a",
                  }}
                  onClick={() => handleDelete(contextMenu.itemId)}
                >
                  {confirmDeleteId === contextMenu.itemId
                    ? "确定扔掉？"
                    : "扔掉"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ======== LOCK INTERACTION OVERLAY ======== */}
          {!unlocked && (
            <motion.div
              key="lock-interaction-overlay"
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
   Styles
   ============================================================ */

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "#1C1C1E",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Noto Serif SC', serif",
    color: "#8a7a6a",
    overflow: "hidden",
    userSelect: "none",
  },
  /* Lock */
  lockContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    padding: "40px",
    position: "relative",
  },
  lockSvgWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
    position: "relative",
  },
  lockInteractionOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 10000,
    cursor: "pointer",
  },
  lockTitle: {
    fontSize: "22px",
    color: "#d4a84a",
    fontFamily: "'Noto Serif SC', serif",
    fontWeight: 600,
    letterSpacing: "4px",
    margin: 0,
  },
  lockSubtitle: {
    fontSize: "14px",
    color: "#b0a090",
    fontFamily: "'Noto Serif SC', serif",
    margin: 0,
    letterSpacing: "1px",
  },
  lockHint: {
    fontSize: "13px",
    color: "#8a7e72",
    fontFamily: "'Noto Serif SC', serif",
    margin: 0,
    marginTop: "8px",
    transition: "opacity 0.3s",
  },
  /* Content */
  contentContainer: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    background: "#1C1C1E",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    flexShrink: 0,
  },
  topBarTitle: {
    fontSize: "15px",
    color: "#8a7a6a",
    fontFamily: "'Ma Shan Zheng', 'Caveat', cursive, serif",
    letterSpacing: "2px",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#a09080",
    fontSize: "14px",
    fontFamily: "'Noto Serif SC', serif",
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: "4px",
    transition: "color 0.2s",
    display: "flex",
    alignItems: "center",
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "8px 24px 16px",
    WebkitOverflowScrolling: "touch" as const,
    position: "relative",
  },
  /* Empty state */
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    textAlign: "center" as const,
    padding: "40px 32px",
  },
  emptyLine1: {
    fontSize: "18px",
    color: "#a09080",
    fontFamily: "'Ma Shan Zheng', 'Caveat', cursive, serif",
    margin: "0 0 20px",
    letterSpacing: "2px",
  },
  emptyLine2: {
    fontSize: "15px",
    color: "#8a7e72",
    fontFamily: "'Ma Shan Zheng', 'Caveat', cursive, serif",
    margin: "0 0 12px",
    lineHeight: 1.8,
  },
  emptyLine3: {
    fontSize: "14px",
    color: "#7a7068",
    fontFamily: "'Ma Shan Zheng', 'Caveat', cursive, serif",
    margin: 0,
    lineHeight: 2,
  },
  /* Card */
  card: {
    position: "relative",
    backgroundColor: "#2a2520",
    borderRadius: "2px",
    boxShadow:
      "4px 6px 18px rgba(0,0,0,0.5), -2px -2px 6px rgba(0,0,0,0.2), inset 0 0 24px rgba(90,74,58,0.2)",
    cursor: "default",
    boxSizing: "border-box" as const,
    willChange: "transform, opacity",
  },
  tape: {
    position: "absolute" as const,
    top: "-6px",
    left: "50%",
    width: "48px",
    height: "14px",
    marginLeft: "-24px",
    backgroundColor: "rgba(196,149,58,0.18)",
    borderRadius: "1px",
    pointerEvents: "none" as const,
    zIndex: 1,
  },
  cardText: {
    margin: 0,
    color: "#c4b8a0",
    fontFamily: "'Ma Shan Zheng', 'Caveat', cursive, serif",
    lineHeight: 1.8,
    wordBreak: "break-word" as const,
    whiteSpace: "pre-wrap" as const,
  },
  /* Edit textarea */
  editTextarea: {
    width: "100%",
    minHeight: "60px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(196,149,58,0.25)",
    borderRadius: "2px",
    color: "#8a7a6a",
    fontFamily: "'Ma Shan Zheng', 'Caveat', cursive, serif",
    fontSize: "15px",
    lineHeight: 1.7,
    padding: "4px 6px",
    resize: "vertical" as const,
    outline: "none",
    boxSizing: "border-box" as const,
  },
  /* Input area */
  inputArea: {
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    padding: "12px 24px 20px",
    flexShrink: 0,
  },
  textarea: {
    flex: 1,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "4px",
    color: "#8a7a6a",
    fontFamily: "'Courier New', monospace",
    fontSize: "14px",
    lineHeight: 1.6,
    padding: "10px 14px",
    resize: "none" as const,
    outline: "none",
    transition: "border-color 0.25s",
    minHeight: "52px",
    boxSizing: "border-box" as const,
  },
  addBtn: {
    background: "none",
    border: "1px solid #3e362e",
    borderRadius: "4px",
    color: "#c4953a",
    fontFamily: "'Noto Serif SC', serif",
    fontSize: "14px",
    padding: "10px 18px",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    transition: "opacity 0.2s, border-color 0.2s",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
  },
  /* Context menu */
  contextMenu: {
    position: "fixed" as const,
    zIndex: 10001,
    background: "rgba(0,0,0,0.85)",
    border: "none",
    borderRadius: "6px",
    padding: "4px 0",
    boxShadow: "0 6px 24px rgba(0,0,0,0.6)",
    minWidth: "100px",
  },
  ctxBtn: {
    display: "block",
    width: "100%",
    background: "none",
    border: "none",
    color: "#8a7a6a",
    fontFamily: "'Noto Serif SC', serif",
    fontSize: "13px",
    padding: "10px 20px",
    cursor: "pointer",
    textAlign: "left" as const,
    transition: "background 0.15s",
  },
  ctxDivider: {
    height: "1px",
    background: "rgba(138,122,106,0.12)",
    margin: "2px 0",
  },
};

/* ============================================================
   CSS (inject via <style>)
   ============================================================ */

const CSS = `
  /* =============================================
     Background: 深炭灰 + 纸张木纹纹理 + Bokeh 光斑
     ============================================= */
  .pd-scroll::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;

    /* 纸张/木纹纹理叠加 */
    background-image:
      /* 微弱噪点纹理 */
      url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E"),
      /* 细微水平木纹线条 */
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 3px,
        rgba(139,107,79,0.015) 3px,
        rgba(139,107,79,0.015) 4px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 5px,
        rgba(100,80,60,0.01) 5px,
        rgba(100,80,60,0.01) 6px
      );
    opacity: 0.6;
  }

  /* Bokeh 光斑（缝隙透进来的微光） */
  .pd-scroll::after {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background:
      radial-gradient(ellipse 180px 180px at 12% 8%, rgba(196,149,58,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 120px 120px at 75% 15%, rgba(196,149,58,0.04) 0%, transparent 70%),
      radial-gradient(ellipse 200px 200px at 85% 75%, rgba(196,149,58,0.05) 0%, transparent 70%),
      radial-gradient(ellipse 90px 90px at 25% 85%, rgba(200,180,140,0.04) 0%, transparent 70%),
      radial-gradient(ellipse 150px 150px at 50% 45%, rgba(180,160,120,0.03) 0%, transparent 70%);
  }

  /* =============================================
     Collage layout: CSS columns with random widths
     ============================================= */
  .pd-collage {
    columns: 3;
    column-gap: 6px;
    padding-top: 4px;
    position: relative;
    z-index: 1;
  }

  @media (max-width: 640px) {
    .pd-collage {
      columns: 2;
    }
  }

  /* =============================================
     Scroll dampening
     ============================================= */
  .pd-scroll {
    scroll-behavior: auto;
  }

  /* =============================================
     Focus states
     ============================================= */
  .pd-textarea:focus {
    border-color: #c4953a !important;
  }

  /* Context menu buttons hover */
  .pd-ctx-btn:hover {
    background: rgba(196,149,58,0.06);
  }

  /* Close button hover */
  .pd-close-btn:hover {
    color: #c4953a !important;
  }

  /* Add button hover */
  .pd-add-btn:hover {
    border-color: #c4953a !important;
  }

  /* =============================================
     Scrollbar styling
     ============================================= */
  .pd-scroll::-webkit-scrollbar {
    width: 5px;
  }
  .pd-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .pd-scroll::-webkit-scrollbar-thumb {
    background: #2e2a24;
    border-radius: 3px;
  }
  .pd-scroll::-webkit-scrollbar-thumb:hover {
    background: #3e362e;
  }

  /* =============================================
     Card styles for collage layout
     ============================================= */
  .pd-card {
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    break-inside: avoid;
  }
  .pd-card p {
    -webkit-user-select: text;
    user-select: text;
    pointer-events: auto;
  }

  /* Card hover: subtle lift */
  .pd-card:hover {
    filter: brightness(1.04);
  }
`;
