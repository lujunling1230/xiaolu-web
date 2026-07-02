import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isAdmin, unlockAdmin } from "../utils/siteData";
import AdminPanel from "./AdminPanel";

/* ============================================================
 * SecretKnock 组件 — 极简暗号彩蛋
 *
 * 入口：右下角 "have a nice day～ling"
 * 弹窗：纯文本浮于背景之上，无卡片/无磨砂
 * 密码：ling（精确匹配，小写）
 * 成功：叶子飘落 + 温柔文案 → 2.5s 后自动关闭 → 打开管理员面板
 * ============================================================ */

/* ---------- 落叶动画 ---------- */

/** 创建一片落叶，CSS transition 驱动（GPU 友好） */
const createLeaf = () => {
  const el = document.createElement("div");
  el.textContent = ["🍂", "🍁", "🍃"][Math.floor(Math.random() * 3)];
  const size = Math.random() * 12 + 16;
  const x = Math.random() * 100;
  const dur = 2.4 + Math.random() * 1.6; // 2.4 ~ 4s
  const rot = Math.random() * 720 - 360;
  const drift = Math.random() * 100 - 50;

  Object.assign(el.style, {
    position: "fixed",
    left: `${x}vw`,
    top: "-40px",
    fontSize: `${size}px`,
    opacity: "0",
    zIndex: "9998",
    pointerEvents: "none",
    willChange: "transform, opacity",
    transition: `top ${dur}s ease-in, transform ${dur}s ease-in-out, opacity ${dur}s ease`,
  });

  document.body.appendChild(el);

  // 触发 reflow 后启动动画
  requestAnimationFrame(() => {
    el.style.top = "105vh";
    el.style.transform = `rotate(${rot}deg) translateX(${drift}px)`;
    el.style.opacity = "0.8";
    // 淡出
    setTimeout(() => {
      el.style.opacity = "0";
    }, dur * 700);
  });

  setTimeout(() => {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, dur * 1000 + 500);
};

/** 触发多片叶子飘落，持续约 4 秒 */
const triggerLeafFall = () => {
  let i = 0;
  const id = setInterval(() => {
    createLeaf();
    if (++i >= 18) clearInterval(id);
  }, 180);
};

/* ---------- 主组件 ---------- */

type Phase = "closed" | "input" | "success";

const SecretKnock: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("closed");
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  /* 已有管理员会话时直接标记 */
  useEffect(() => {
    if (isAdmin()) setPhase("closed"); // 仍需点击才能进面板
  }, []);

  /* ESC 关闭 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase === "input") closePopup();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  /** 打开弹窗 */
  const openPopup = useCallback(() => {
    setPhase("input");
    setInput("");
    setError(false);
    setErrorMsg("");
  }, []);

  /** 关闭弹窗（❌ 按钮），不做验证 */
  const closePopup = useCallback(() => {
    setPhase("closed");
    setInput("");
    setError(false);
    setErrorMsg("");
  }, []);

  /** 验证密码 */
  const handleVerify = useCallback(() => {
    if (!input) return;

    if (input === "ling") {
      // ✅ 正确
      unlockAdmin("ling");
      setPhase("success");
      triggerLeafFall();
      // 2.5 秒后自动关闭弹窗，打开管理员面板
      setTimeout(() => {
        setPhase("closed");
        setShowAdmin(true);
      }, 2500);
    } else {
      // ❌ 错误 — 抖动、清空、不关闭
      setError(true);
      setErrorMsg("再想想嘛，这是我们的秘密呀～");
      setShakeKey((k) => k + 1);
      setInput("");
      setTimeout(() => { setError(false); setErrorMsg(""); }, 500);
    }
  }, [input]);

  /** 关闭管理员面板 */
  const handleCloseAdmin = useCallback(() => setShowAdmin(false), []);

  return (
    <>
      {/* ============ 入口文字 ============ */}
      {!showAdmin && phase === "closed" && (
        <button
          onClick={() => {
            // 如果已有管理员权限，直接打开面板
            if (isAdmin()) {
              setShowAdmin(true);
            } else {
              openPopup();
            }
          }}
          className="secret-trigger"
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 50,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            color: "rgba(100, 100, 100, 0.6)",
            fontFamily: '"KaiTi", "STKaiti", "Noto Serif SC", serif',
            letterSpacing: "0.04em",
            padding: "6px 0",
            transition: "color 0.3s ease",
            animation: "secretFadeIn 1.5s ease 0.8s both",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "rgba(100, 100, 100, 1)";
            e.currentTarget.style.textDecoration = "underline";
            e.currentTarget.style.textDecorationStyle = "dotted";
            e.currentTarget.style.textUnderlineOffset = "3px";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(100, 100, 100, 0.6)";
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          have a nice day～ling
        </button>
      )}

      {/* ============ 极简弹窗（输入阶段） ============ */}
      {phase === "input" && (
        <div
          className="secret-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 容器 — 无背景、无卡片、无毛玻璃，文字直接浮于页面背景上 */}
          <div
            style={{
              position: "relative",
              width: "90%",
              maxWidth: 320,
              padding: "24px 0",
              textAlign: "center",
            }}
          >
            {/* 右上角 ❌ 关闭按钮 */}
            <button
              onClick={closePopup}
              style={{
                position: "absolute",
                top: "-4px",
                right: 0,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                color: "rgba(100, 100, 100, 0.4)",
                padding: "4px 8px",
                transition: "color 0.3s ease",
                lineHeight: 1,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#b06a6a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(100, 100, 100, 0.4)")}
            >
              ❌
            </button>

            {/* 提示语 */}
            <p
              style={{
                margin: "0 0 20px",
                fontSize: 14,
                color: "rgba(80, 80, 80, 0.7)",
                fontFamily: '"Noto Serif SC", Georgia, serif',
                letterSpacing: "0.06em",
              }}
            >
              请输入彩蛋密码：
            </p>

            {/* 输入框 — 极简：无圆角、无阴影、细底线 */}
            <input
              key={`sk-${shakeKey}`}
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleVerify();
              }}
              autoFocus
              style={{
                width: "100%",
                padding: "8px 4px",
                border: "none",
                borderBottom: `1px solid ${error ? "#e57373" : "rgba(100, 100, 100, 0.25)"}`,
                borderRadius: 0,
                outline: "none",
                background: "transparent",
                fontSize: 18,
                color: "#4a4038",
                textAlign: "center",
                letterSpacing: "0.1em",
                fontFamily: '"Noto Serif SC", Georgia, serif',
                boxSizing: "border-box",
                transition: "border-color 0.3s ease",
                animation: error ? "sk-shake 0.5s ease" : "none",
              }}
            />

            {/* 错误提示 */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                  style={{
                    marginTop: 12,
                    fontSize: 13,
                    color: "#e57373",
                    fontFamily: '"Noto Serif SC", serif',
                    letterSpacing: "0.04em",
                  }}
                >
                  再想想嘛，这是我们的秘密呀～
                </motion.div>
            )}
          </div>
        </div>
      )}

      {/* ============ 成功文案（替代弹窗内容） ============ */}
      {phase === "success" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: "38%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10000,
            fontSize: 20,
            color: "#5a7a5a",
            fontFamily: '"Noto Serif SC", Georgia, serif',
            letterSpacing: "0.04em",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            textShadow: "0 1px 4px rgba(90, 122, 90, 0.15)",
          }}
        >
          我就知道是你啊 ling ✨🌿
        </motion.div>
      )}

      {/* ============ 管理员面板 ============ */}
      {showAdmin && (
        <AdminPanel onClose={handleCloseAdmin} />
      )}

      {/* ============ 动画 keyframes ============ */}
      <style>{`
        /* 入口文字淡入 */
        @keyframes secretFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* 输入框抖动 */
        @keyframes sk-shake {
          0%, 100% { transform: translateX(0); }
          15%  { transform: translateX(-8px); }
          30%  { transform: translateX(7px); }
          45%  { transform: translateX(-5px); }
          60%  { transform: translateX(4px); }
          75%  { transform: translateX(-2px); }
        }
      `}</style>
    </>
  );
};

export default SecretKnock;
