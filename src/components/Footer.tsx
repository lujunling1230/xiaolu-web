import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isAdmin, unlockAdmin } from "../utils/siteData";
import AdminPanel from "./AdminPanel";

/* ============================================================
 * Footer 组件
 *
 * 疗愈系胶片风页脚：无背景卡片，文字直接叠加在水彩背景上。
 * 三栏布局：左（版权）、中（邮箱+简历）、右（彩蛋+回顶）
 * ============================================================ */

/* -----------------------------------------------------------
 * 落叶动画
 * ----------------------------------------------------------- */
const createLeaf = () => {
  const el = document.createElement("div");
  el.textContent = ["🍂", "🍁", "🍃"][Math.floor(Math.random() * 3)];
  const size = Math.random() * 12 + 16;
  const dur = 2.4 + Math.random() * 1.6;
  Object.assign(el.style, {
    position: "fixed",
    left: Math.random() * 100 + "vw",
    top: "-40px",
    fontSize: size + "px",
    opacity: "0",
    zIndex: "9998",
    pointerEvents: "none",
    willChange: "transform, opacity",
    transition: `top ${dur}s ease-in, transform ${dur}s ease-in-out, opacity ${dur}s ease`,
  });
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.top = "105vh";
    el.style.transform = `rotate(${Math.random() * 720 - 360}deg) translateX(${Math.random() * 100 - 50}px)`;
    el.style.opacity = "0.8";
    setTimeout(() => { el.style.opacity = "0"; }, dur * 700);
  });
  setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, dur * 1000 + 500);
};

const triggerLeafFall = () => {
  let i = 0;
  const id = setInterval(() => { createLeaf(); if (++i >= 18) clearInterval(id); }, 180);
};

/* -----------------------------------------------------------
 * Footer 主组件
 * ----------------------------------------------------------- */

type Phase = "closed" | "input" | "success";

interface FooterProps {
  isFullMode?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isFullMode = true }) => {
  /* ---- 常规状态 ---- */
  const [toast, setToast] = useState<string | null>(null);
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const copyEmail = useCallback(() => {
    const email = "15294705967@163.com";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => showToast("邮箱已复制"));
    } else {
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("邮箱已复制");
    }
  }, [showToast]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ---- 彩蛋状态 ---- */
  const [eggPhase, setEggPhase] = useState<Phase>("closed");
  const [eggInput, setEggInput] = useState("");
  const [eggError, setEggError] = useState(false);
  const [eggErrorMsg, setEggErrorMsg] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const eggInputRef = useRef<HTMLInputElement>(null);

  /* ESC 关闭 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && eggPhase === "input") {
        setEggPhase("closed");
        setEggInput("");
        setEggError(false);
        setEggErrorMsg("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [eggPhase]);

  const handleEggClick = useCallback(() => {
    if (isAdmin()) {
      setShowAdmin(true);
    } else {
      setEggPhase("input");
      setEggInput("");
      setEggError(false);
      setEggErrorMsg("");
    }
  }, []);

  const handleEggVerify = useCallback(() => {
    if (!eggInput) return;
    if (eggInput === "ling") {
      unlockAdmin("ling");
      setEggPhase("success");
      triggerLeafFall();
      setTimeout(() => {
        setEggPhase("closed");
        setShowAdmin(true);
      }, 2500);
    } else {
      setEggError(true);
      setEggErrorMsg("再想想嘛，这是我们的秘密呀～");
      setShakeKey((k) => k + 1);
      setEggInput("");
      setTimeout(() => { setEggError(false); setEggErrorMsg(""); }, 500);
    }
  }, [eggInput]);

  const handleCloseAdmin = useCallback(() => setShowAdmin(false), []);

  /* 纯净模式不渲染 */
  if (!isFullMode) return null;

  return (
    <>
      <footer className="po-footer-wrap">
        {/* 底部渐变遮罩，增强文字可读性 */}
        <div className="po-footer-gradient" />

        {/* Toast 提示 */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 12, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 8, x: "-50%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="po-footer-toast"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 三栏布局 */}
        <div className="po-footer-inner">
          {/* ====== 左栏：版权 ====== */}
          <div className="po-footer-col po-footer-left">
            <p className="po-footer-copyright">
              © 2026 路俊玲 · AI 产品经理作品集
            </p>
          </div>

          {/* ====== 中栏：联系 ====== */}
          <div className="po-footer-col po-footer-center">
            <button className="po-footer-email" onClick={copyEmail}>
              邮箱：15294705967@163.com
            </button>
          </div>

          {/* ====== 右栏：彩蛋 + 回顶 ====== */}
          <div className="po-footer-col po-footer-right">
            <button className="po-footer-egg" onClick={handleEggClick}>
              have a nice day～ling
            </button>
            <button className="po-footer-top" onClick={scrollToTop}>
              ↑ 回到顶部
            </button>
          </div>
        </div>
      </footer>

      {/* ============ 彩蛋弹窗（输入阶段） ============ */}
      {eggPhase === "input" && (
        <div
          className="po-egg-overlay"
          onClick={() => { setEggPhase("closed"); setEggInput(""); }}
        >
          <div
            className="po-egg-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="po-egg-close"
              onClick={() => { setEggPhase("closed"); setEggInput(""); setEggError(false); setEggErrorMsg(""); }}
            >
              ✕
            </button>

            <p className="po-egg-hint">
              请输入访问口令：
            </p>

            <input
              key={`egg-${shakeKey}`}
              ref={eggInputRef}
              type="text"
              value={eggInput}
              onChange={(e) => setEggInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleEggVerify(); }}
              autoFocus
              className={`po-egg-input ${eggError ? "po-egg-input--error" : ""}`}
            />

            {eggErrorMsg && (
              <p className="po-egg-error">
                {eggErrorMsg}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ============ 成功文案 ============ */}
      {eggPhase === "success" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="po-egg-success"
        >
          我就知道是你啊 ling ✨🌿
        </motion.div>
      )}

      {/* ============ 管理员面板 ============ */}
      {showAdmin && <AdminPanel onClose={handleCloseAdmin} />}

      {/* Shake 动画 */}
      <style>{`
        @keyframes sk-shake {
          0%, 100% { transform: translateX(0); }
          15%  { transform: translateX(-8px); }
          30%  { transform: translateX(7px); }
          45%  { transform: translateX(-5px); }
          60%  { transform: translateX(4px); }
          75%  { transform: translateX(-2px); }
        }

        /* ===== Footer 容器 ===== */
        .po-footer-wrap {
          position: relative;
          z-index: 10;
          padding: 0 24px 32px;
          margin-top: 40px;
        }

        /* 底部渐变遮罩 */
        .po-footer-gradient {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 180px;
          background: linear-gradient(to top, rgba(250,249,246,0.55), transparent);
          pointer-events: none;
          z-index: -1;
        }

        /* 三栏布局 */
        .po-footer-inner {
          max-width: 860px;
          margin: 0 auto;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
        }

        .po-footer-col {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .po-footer-left {
          flex: 0 0 auto;
          align-items: flex-start;
        }

        .po-footer-center {
          flex: 1 1 auto;
          align-items: center;
        }

        .po-footer-right {
          flex: 0 0 auto;
          align-items: flex-end;
          text-align: right;
        }

        /* ===== 版权 ===== */
        .po-footer-copyright {
          margin: 0;
          font-size: 13px;
          color: #3a4a2c;
          letter-spacing: 0.04em;
          line-height: 1.6;
          white-space: nowrap;
        }

        /* ===== 邮箱 ===== */
        .po-footer-email {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 13px;
          color: #3a4a2c;
          letter-spacing: 0.02em;
          line-height: 1.6;
          transition: all 0.25s ease;
          border: 1px solid rgba(58, 74, 44, 0.2);
        }
        .po-footer-email:hover {
          color: #5d8a6a;
          border-color: rgba(93, 138, 106, 0.4);
          background: rgba(141, 154, 139, 0.06);
        }



        /* ===== 暗号彩蛋 ===== */
        .po-footer-egg {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 0;
          font-size: 14px;
          color: #5a6a4c;
          font-family: "KaiTi", "STKaiti", "Noto Serif SC", Georgia, serif;
          letter-spacing: 0.04em;
          line-height: 1.6;
          transition: all 0.3s ease;
        }
        .po-footer-egg:hover {
          color: #3a4a2c;
          text-decoration: underline;
          text-decoration-style: dotted;
          text-underline-offset: 3px;
        }

        /* ===== 回到顶部 ===== */
        .po-footer-top {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          font-size: 12px;
          color: #3a4a2c;
          letter-spacing: 0.04em;
          line-height: 1.6;
          transition: color 0.25s ease;
        }
        .po-footer-top:hover {
          color: #5d8a6a;
        }

        /* ===== Toast ===== */
        .po-footer-toast {
          position: fixed;
          bottom: 100;
          left: "50%";
          background: #8D9A8B;
          color: #fff;
          padding: 8px 20px;
          border-radius: 999;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.04em;
          zIndex: 9999;
          boxShadow: 0 4px 16px rgba(141,154,139,0.35);
        }

        /* ===== 彩蛋弹窗 ===== */
        .po-egg-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(250, 249, 246, 0.6);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .po-egg-dialog {
          position: relative;
          width: 90%;
          max-width: 320px;
          padding: 24px 0;
          text-align: center;
        }
        .po-egg-close {
          position: absolute;
          top: -4;
          right: 0;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: rgba(100,100,100,0.4);
          padding: 4px 8px;
          transition: color 0.3s ease;
          line-height: 1;
        }
        .po-egg-close:hover { color: #b06a6a; }
        .po-egg-hint {
          margin: 0 0 20px;
          font-size: 14px;
          color: rgba(80,80,80,0.7);
          font-family: "Noto Serif SC", Georgia, serif;
          letter-spacing: 0.06em;
        }
        .po-egg-input {
          width: 100%;
          padding: 8px 4px;
          border: none;
          border-bottom: 1px solid rgba(100,100,100,0.25);
          border-radius: 0;
          outline: none;
          background: transparent;
          font-size: 18px;
          color: #4a4038;
          text-align: center;
          letter-spacing: 0.1em;
          font-family: "Noto Serif SC", Georgia, serif;
          box-sizing: border-box;
          transition: border-color 0.3s ease;
        }
        .po-egg-input--error {
          border-bottom-color: #e57373;
          animation: sk-shake 0.5s ease;
        }
        .po-egg-error {
          margin-top: 12px;
          font-size: 13px;
          color: #e57373;
          font-family: "Noto Serif SC", serif;
          letter-spacing: 0.04em;
        }

        /* ===== 成功文案 ===== */
        .po-egg-success {
          position: fixed;
          top: 38%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10000;
          font-size: 20px;
          color: #5a7a5a;
          font-family: "Noto Serif SC", Georgia, serif;
          letter-spacing: 0.04em;
          pointer-events: none;
          white-space: nowrap;
          text-shadow: 0 1px 4px rgba(90, 122, 90, 0.15);
        }

        /* ===== 移动端适配 ===== */
        @media (max-width: 768px) {
          .po-footer-wrap {
            padding: 0 16px 24px;
            margin-top: 32px;
          }

          .po-footer-inner {
            flex-direction: column;
            align-items: center;
            gap: 16px;
            text-align: center;
          }

          .po-footer-left,
          .po-footer-center,
          .po-footer-right {
            align-items: center;
            text-align: center;
          }

          .po-footer-left { order: 3; }
          .po-footer-center { order: 1; }
          .po-footer-right { order: 2; }

          .po-footer-copyright {
            white-space: normal;
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;
