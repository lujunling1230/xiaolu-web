import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isAdmin, unlockAdmin } from "../utils/siteData";
import AdminPanel from "./AdminPanel";

/* ============================================================
 * Footer 组件
 * 作品集页脚：版权信息、邮箱复制、简历下载、社交图标、Slogan、回到顶部
 * 内嵌暗号彩蛋入口 "have a nice day～ling"
 * ============================================================ */

/** GitHub SVG 图标 */
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

/** LinkedIn SVG 图标 */
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/** 知乎 SVG 图标（知字） */
const ZhihuIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor">知</text>
  </svg>
);

/** 小红书 SVG 图标（书页） */
const XiaohongshuIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <rect x="4" y="2" width="16" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="1.2" />
    <line x1="8" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1.2" />
    <line x1="8" y1="15" x2="13" y2="15" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

/* -----------------------------------------------------------
 * 落叶动画（复用 SecretKnock 的逻辑）
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
      navigator.clipboard.writeText(email).then(() => showToast("✓ 已复制"));
    } else {
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("✓ 已复制");
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
      <footer
        style={{
          background: "transparent",
          borderTop: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 -4px 15px rgba(0, 0, 0, 0.02)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Toast 提示 */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 12, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 8, x: "-50%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                position: "fixed",
                bottom: 100,
                left: "50%",
                background: "#8D9A8B",
                color: "#fff",
                padding: "8px 20px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.04em",
                zIndex: 9999,
                boxShadow: "0 4px 16px rgba(141,154,139,0.35)",
              }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className="footer-inner"
          style={{
            maxWidth: 800,
            width: "100%",
            margin: "0 auto",
            padding: "16px 24px",
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: 8,
          }}
        >
          {/* 上部：左 / 中 / 右 */}
          <div
            className="footer-top"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 20,
              marginBottom: 28,
            }}
          >
            <div style={{ fontSize: 13, color: "#5A6B5C", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
              🌿 © 2026 路俊玲 · AI 产品经理作品集
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <button
                onClick={copyEmail}
                className="footer-link"
                style={{ fontSize: 13, color: "#5A6B5C", background: "none", border: "none", cursor: "pointer", padding: 0, letterSpacing: "0.02em", transition: "color 0.3s ease", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#8D9A8B")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#5A6B5C")}
              >
                邮箱：lujunling[at]163.com
              </button>
              <a
                href="/resume.pdf"
                download
                className="footer-link"
                style={{ fontSize: 13, color: "#5A6B5C", textDecoration: "none", letterSpacing: "0.02em", transition: "color 0.3s ease", display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#8D9A8B")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#5A6B5C")}
              >
                📄 下载简历 PDF
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {[
                { icon: <GitHubIcon />, label: "GitHub", href: "https://github.com" },
                { icon: <ZhihuIcon />, label: "知乎", href: "https://zhihu.com" },
                { icon: <XiaohongshuIcon />, label: "小红书", href: "https://xiaohongshu.com" },
                { icon: <LinkedInIcon />, label: "LinkedIn", href: "https://linkedin.com" },
              ].map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  style={{ color: "rgba(90, 107, 92, 0.7)", transition: "color 0.3s ease, transform 0.3s ease", display: "inline-flex" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#8D9A8B"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(90, 107, 92, 0.7)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* 分隔线 */}
          <div style={{ height: 1, background: "rgba(255, 255, 255, 0.25)", marginBottom: 14 }} />

          {/* 下部：Slogan + 暗号彩蛋 + 回到顶部 */}
          <div
            className="footer-bottom"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <p style={{ margin: 0, fontSize: 12, color: "#666", letterSpacing: "0.08em", fontFamily: '"Noto Serif SC", Georgia, serif' }}>
              用理性架构世界，用感性记录光阴
            </p>

            {/* ★★★ 暗号彩蛋入口 — 嵌在页脚内，滚动到底即可见 ★★★ */}
            <button
              onClick={handleEggClick}
              style={{
                fontSize: 11,
                color: "rgba(120, 120, 120, 0.7)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 0",
                fontFamily: '"KaiTi", "STKaiti", "Noto Serif SC", serif',
                letterSpacing: "0.04em",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgba(120, 120, 120, 1)";
                e.currentTarget.style.textDecoration = "underline";
                e.currentTarget.style.textDecorationStyle = "dotted";
                e.currentTarget.style.textUnderlineOffset = "3px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(120, 120, 120, 0.7)";
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              have a nice day～ling
            </button>

            <button
              onClick={scrollToTop}
              className="footer-link"
              style={{ fontSize: 12, color: "#5A6B5C", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", letterSpacing: "0.04em", transition: "color 0.3s ease", display: "inline-flex", alignItems: "center", gap: 4 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#8D9A8B")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#5A6B5C")}
            >
              ↑ 回到顶部
            </button>
          </div>
        </div>

        {/* 移动端响应式 */}
        <style>{`
          @media (max-width: 768px) {
            .footer-inner { padding: 12px 16px !important; border-radius: 6px !important; }
            .footer-top { flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 10px !important; margin-bottom: 14px !important; }
            .footer-bottom { flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 8px !important; }
          }
        `}</style>
      </footer>

      {/* ============ 彩蛋弹窗（输入阶段） ============ */}
      {eggPhase === "input" && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => { setEggPhase("closed"); setEggInput(""); }}
        >
          <div
            style={{ position: "relative", width: "90%", maxWidth: 320, padding: "24px 0", textAlign: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ❌ 关闭 */}
            <button
              onClick={() => { setEggPhase("closed"); setEggInput(""); setEggError(false); setEggErrorMsg(""); }}
              style={{ position: "absolute", top: -4, right: 0, background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "rgba(100,100,100,0.4)", padding: "4px 8px", transition: "color 0.3s ease", lineHeight: 1 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#b06a6a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(100,100,100,0.4)")}
            >
              ❌
            </button>

            <p style={{ margin: "0 0 20px", fontSize: 14, color: "rgba(80,80,80,0.7)", fontFamily: '"Noto Serif SC", Georgia, serif', letterSpacing: "0.06em" }}>
              请输入彩蛋密码：
            </p>

            <input
              key={`egg-${shakeKey}`}
              ref={eggInputRef}
              type="text"
              value={eggInput}
              onChange={(e) => setEggInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleEggVerify(); }}
              autoFocus
              style={{
                width: "100%", padding: "8px 4px", border: "none",
                borderBottom: `1px solid ${eggError ? "#e57373" : "rgba(100,100,100,0.25)"}`,
                borderRadius: 0, outline: "none", background: "transparent",
                fontSize: 18, color: "#4a4038", textAlign: "center",
                letterSpacing: "0.1em", fontFamily: '"Noto Serif SC", Georgia, serif',
                boxSizing: "border-box", transition: "border-color 0.3s ease",
                animation: eggError ? "sk-shake 0.5s ease" : "none",
              }}
            />

            {eggErrorMsg && (
              <p style={{ marginTop: 12, fontSize: 13, color: "#e57373", fontFamily: '"Noto Serif SC", serif', letterSpacing: "0.04em" }}>
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
          style={{
            position: "fixed", top: "38%", left: "50%", transform: "translate(-50%, -50%)",
            zIndex: 10000, fontSize: 20, color: "#5a7a5a",
            fontFamily: '"Noto Serif SC", Georgia, serif', letterSpacing: "0.04em",
            pointerEvents: "none", whiteSpace: "nowrap",
            textShadow: "0 1px 4px rgba(90, 122, 90, 0.15)",
          }}
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
      `}</style>
    </>
  );
};

export default Footer;
