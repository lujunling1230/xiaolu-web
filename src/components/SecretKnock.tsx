import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isAdmin, unlockAdmin } from "../utils/siteData";
import AdminPanel from "./AdminPanel";

/* ============================================================
 * SecretKnock 组件
 * 右下角常驻入口 → 密码验证弹窗 → 叶子飘落 → 管理员面板
 * 密码：ling（不区分大小写）
 * ============================================================ */

/** 错误反馈文案池 */
const ERROR_MESSAGES = [
  "唔…不太对哦～",
  "再想想嘛，这是我们的秘密呀～",
  "Hint: 看看落款？🌿",
];

/** 创建一片飘落叶子并插入 DOM */
const createLeaf = () => {
  const leaf = document.createElement("div");
  leaf.textContent = ["🍃", "🌿", "🍂"][Math.floor(Math.random() * 3)];
  leaf.style.position = "fixed";
  leaf.style.left = Math.random() * 100 + "vw";
  leaf.style.top = "-40px";
  leaf.style.fontSize = Math.random() * 14 + 18 + "px";
  leaf.style.opacity = "0.85";
  leaf.style.zIndex = "9998";
  leaf.style.pointerEvents = "none";
  leaf.style.transition = "top 2.8s ease-in, transform 2.8s ease-in-out, opacity 2.8s ease";
  document.body.appendChild(leaf);

  requestAnimationFrame(() => {
    leaf.style.top = "110vh";
    leaf.style.transform = `rotate(${Math.random() * 720 - 360}deg) translateX(${Math.random() * 120 - 60}px)`;
    leaf.style.opacity = "0";
  });

  setTimeout(() => {
    if (leaf.parentNode) leaf.parentNode.removeChild(leaf);
  }, 3000);
};

/** 触发连续叶子飘落动画 */
const triggerLeafFall = () => {
  let count = 0;
  const interval = setInterval(() => {
    createLeaf();
    count++;
    if (count >= 20) clearInterval(interval);
  }, 140);
};

const SecretKnock: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [errorCount, setErrorCount] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [success, setSuccess] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const lockIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* 页面加载时，若已有管理员会话，直接标记成功 */
  useEffect(() => {
    if (isAdmin()) setSuccess(true);
  }, []);

  /* 锁定倒计时 */
  useEffect(() => {
    if (locked && lockTimer > 0) {
      lockIntervalRef.current = setInterval(() => {
        setLockTimer((prev) => {
          if (prev <= 1) {
            setLocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (lockIntervalRef.current) clearInterval(lockIntervalRef.current);
    };
  }, [locked, lockTimer]);

  /* ESC 关闭弹窗 */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  /** 验证密码 */
  const handleVerify = useCallback(() => {
    if (locked) return;
    if (!input.trim()) return;

    if (input.trim().toLowerCase() === "ling") {
      // ✅ 验证通过
      unlockAdmin("ling");
      setError(false);
      setErrorMsg("");
      setIsOpen(false);
      setSuccess(true);
      setShowBubble(true);
      triggerLeafFall();
      setTimeout(() => {
        setShowBubble(false);
        setShowAdmin(true);
      }, 2500);
    } else {
      // ❌ 验证失败
      const newCount = errorCount + 1;
      setErrorCount(newCount);
      setError(true);
      setShakeKey((k) => k + 1);
      setErrorMsg(ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]);

      setTimeout(() => setError(false), 500);

      if (newCount >= 3) {
        setLocked(true);
        setLockTimer(30);
        setErrorMsg("让我静静一会儿～😉");
      }
    }
  }, [input, locked, errorCount]);

  /** 关闭管理员面板 */
  const handleCloseAdmin = useCallback(() => {
    setShowAdmin(false);
  }, []);

  /** 退出登录后重置状态 */
  const handleLogout = useCallback(() => {
    setSuccess(false);
    setShowAdmin(false);
  }, []);

  return (
    <>
      {/* 右下角触发器 */}
      {!showAdmin && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          onClick={() => {
            if (success) {
              setShowAdmin(true);
            } else {
              setIsOpen(true);
              setInput("");
              setError(false);
              setErrorMsg("");
            }
          }}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 50,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            color: "rgba(120, 120, 120, 0.9)",
            fontFamily: '"KaiTi", "STKaiti", "Noto Serif SC", serif',
            letterSpacing: "0.04em",
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: 8,
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(120, 120, 120, 1)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(120, 120, 120, 0.9)")}
        >
          <span style={{ fontSize: 10, opacity: 0.7 }}>✦</span>
          have a nice day ~ ling
        </motion.button>
      )}

      {/* 磨砂玻璃验证弹窗 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(250,249,246,0.4)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                background: "rgba(255,255,255,0.88)",
                borderRadius: 20,
                padding: "36px 32px 28px",
                width: "90%",
                maxWidth: 340,
                boxShadow: "0 20px 60px rgba(80,76,66,0.12), 0 0 0 1px rgba(255,255,255,0.6) inset",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 装饰光晕 */}
              <div
                style={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(141,154,139,0.1) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -30,
                  left: -30,
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(200,180,160,0.08) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <h3
                style={{
                  fontFamily: '"Noto Serif SC", Georgia, serif',
                  fontSize: 17,
                  color: "#4a4038",
                  margin: "0 0 6px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                }}
              >
                ☁️ 今天过得好吗？
              </h3>
              <p
                style={{
                  fontSize: 12,
                  color: "#a8a39b",
                  margin: "0 0 26px",
                  letterSpacing: "0.04em",
                }}
              >
                只有你知道答案
              </p>

              {/* 输入框 */}
              <div style={{ position: "relative", marginBottom: errorMsg ? 10 : 18 }}>
                <input
                  ref={inputRef}
                  key={`sk-input-${shakeKey}`}
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (error) setError(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !locked) handleVerify();
                  }}
                  placeholder={locked ? `请等待 ${lockTimer} 秒` : "悄悄告诉我吧…"}
                  disabled={locked}
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: `1.5px solid ${error ? "#e57373" : locked ? "#e0ddd5" : "#d5cfc4"}`,
                    borderRadius: 12,
                    fontSize: 14,
                    outline: "none",
                    textAlign: "center",
                    boxSizing: "border-box",
                    background: locked ? "#f5f4f2" : "rgba(255,255,255,0.6)",
                    color: "#4a4038",
                    letterSpacing: "0.06em",
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                    animation: error ? `sk-shake 0.5s ease` : "none",
                  }}
                />
              </div>

              {/* 错误提示 */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      fontSize: 12,
                      color: error && !locked ? "#e57373" : "#a8a39b",
                      margin: "0 0 16px",
                      minHeight: 18,
                      fontFamily: '"Noto Serif SC", serif',
                    }}
                  >
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleVerify}
                disabled={locked || !input.trim()}
                style={{
                  width: "100%",
                  padding: "11px 0",
                  border: "none",
                  borderRadius: 999,
                  background: locked ? "#d5cfc4" : "#8D9A8B",
                  color: "#fff",
                  cursor: locked ? "not-allowed" : "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  transition: "all 0.3s ease",
                  opacity: locked ? 0.7 : 1,
                }}
              >
                {locked ? `让我静静一会儿～ (${lockTimer}s)` : "确认"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 成功气泡 */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            style={{
              position: "fixed",
              top: "38%",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10000,
              background: "rgba(255,255,255,0.96)",
              padding: "16px 32px",
              borderRadius: 999,
              boxShadow: "0 12px 40px rgba(141,154,139,0.22)",
              fontSize: 15,
              color: "#5a7a5a",
              fontFamily: '"Noto Serif SC", Georgia, serif',
              letterSpacing: "0.03em",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            🎉 我就知道是你呀，玲～
          </motion.div>
        )}
      </AnimatePresence>

      {/* 管理员面板 */}
      <AnimatePresence>
        {showAdmin && (
          <AdminPanel onClose={handleCloseAdmin} onLogout={handleLogout} />
        )}
      </AnimatePresence>

      {/* Shake 动画 keyframes */}
      <style>{`
        @keyframes sk-shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(7px); }
          45% { transform: translateX(-5px); }
          60% { transform: translateX(4px); }
          75% { transform: translateX(-2px); }
        }
      `}</style>
    </>
  );
};

export default SecretKnock;
