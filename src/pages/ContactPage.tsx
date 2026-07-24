import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { track } from "../utils/track";

/* ============================================================
 * ContactPage 联系方式独立页面
 * 水彩手账风：图1背景 + 图2卡片质感 + 图3活页圈
 * ============================================================ */

const ContactPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!message.trim()) return;
    setSending(true);

    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, contactInfo }),
      });
      if (res.ok) {
        track("contact_submit", {
          message_length: message.length,
          has_contact_info: !!contactInfo.trim(),
          via_email: true,
        });
        setSubmitted(true);
        setMessage("");
        setContactInfo("");
        setTimeout(() => setSubmitted(false), 4000);
        setSending(false);
        return;
      }
      console.warn("[contact] 邮件发送失败，降级到本地存储");
    } catch {
      console.warn("[contact] 网络错误，降级到本地存储");
    }

    const entry = { message, contactInfo, time: Date.now() };
    const existing = JSON.parse(localStorage.getItem("guestbook") || "[]");
    localStorage.setItem("guestbook", JSON.stringify([entry, ...existing]));
    track("contact_submit", {
      message_length: message.length,
      has_contact_info: !!contactInfo.trim(),
      via_email: false,
    });
    setSubmitted(true);
    setMessage("");
    setContactInfo("");
    setTimeout(() => setSubmitted(false), 4000);
    setSending(false);
  }, [message, contactInfo]);

  const contactList = [
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      label: "手机号",
      value: "15294705967",
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      label: "QQ邮箱",
      value: "2974131824@qq.com",
      href: "mailto:2974131824@qq.com",
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      label: "网易邮箱",
      value: "15294705967@163.com",
      href: "mailto:15294705967@163.com",
    },
  ];

  return (
    <div className="cp-root">
      {/* 顶部导航栏 */}
      <nav className="cp-nav">
        <div className="cp-nav-inner">
          <Link to="/" className="cp-nav-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6C6 4 4 4 3 5C2 6 3 8 5 9" stroke="#558B2F" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 6C18 4 20 4 21 5C22 6 21 8 19 9" stroke="#558B2F" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <ellipse cx="12" cy="12" rx="5" ry="6" fill="rgba(85,139,47,0.08)" stroke="#558B2F" strokeWidth="1.2" />
              <ellipse cx="8" cy="9" rx="2" ry="3" fill="none" stroke="#558B2F" strokeWidth="1" transform="rotate(-20 8 9)" />
              <ellipse cx="16" cy="9" rx="2" ry="3" fill="none" stroke="#558B2F" strokeWidth="1" transform="rotate(20 16 9)" />
              <circle cx="10" cy="11" r="1" fill="#558B2F" />
              <circle cx="14" cy="11" r="1" fill="#558B2F" />
              <circle cx="12" cy="15" r="1.2" fill="#558B2F" opacity="0.6" />
            </svg>
            <span style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: "1.2rem", fontWeight: 600, color: "#558B2F", letterSpacing: "0.06em" }}>luro</span>
          </Link>
          <Link to="/" className="cp-nav-back">← 返回首页</Link>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="cp-main">
        {/* 背景装饰层 */}
        <div className="cp-bg-layer">
          {/* 左侧藤蔓装饰 */}
          <div className="cp-vine">
            <svg width="100" height="100%" viewBox="0 0 100 800" fill="none" preserveAspectRatio="xMidYMid slice">
              <path
                d="M50 0 C30 100 70 200 45 300 C20 400 60 500 35 600 C10 700 55 780 50 800"
                stroke="#8BC34A" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5"
              />
              <path
                d="M50 0 C30 100 70 200 45 300 C20 400 60 500 35 600 C10 700 55 780 50 800"
                stroke="#7CB342" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeDasharray="8 6" opacity="0.3"
              />
              {/* 藤蔓上的小圆点 */}
              <circle cx="42" cy="80" r="4" fill="#A5D6A7" opacity="0.6" />
              <circle cx="55" cy="160" r="3.5" fill="#81C784" opacity="0.55" />
              <circle cx="38" cy="240" r="4.5" fill="#A5D6A7" opacity="0.5" />
              <circle cx="52" cy="320" r="3" fill="#C8E6C9" opacity="0.6" />
              <circle cx="40" cy="400" r="4" fill="#81C784" opacity="0.5" />
              <circle cx="56" cy="480" r="3.5" fill="#A5D6A7" opacity="0.55" />
              <circle cx="38" cy="560" r="4.5" fill="#C8E6C9" opacity="0.5" />
              <circle cx="50" cy="640" r="3" fill="#81C784" opacity="0.6" />
              <circle cx="42" cy="720" r="4" fill="#A5D6A7" opacity="0.5" />
            </svg>
          </div>

          {/* 闪光星星 */}
          <div className="cp-sparkles">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" className="cp-sparkle" style={{ top: '15%', left: '18%' }}>
              <path d="M15 2L16.5 11L19 6L22 12L21 15L26 16L21 18L19 23L16 19L12 21L14 16L9 13L14 11L15 2Z" fill="#A5D6A7" opacity="0.5" />
            </svg>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="cp-sparkle" style={{ top: '35%', left: '14%' }}>
              <path d="M10 1L11 7L12.5 4L14.5 7.5L14 10L17 10.5L14 12L12.5 15L11 12.5L8 14L9.5 10.5L6.5 9L9.5 8L10 1Z" fill="#C8E6C9" opacity="0.45" />
            </svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="cp-sparkle" style={{ top: '55%', left: '16%' }}>
              <path d="M12 1.5L13 8.5L15 5L17 9L16.5 12L20 13L16.5 14.5L15 18.5L13 15L10 17L11.5 12.5L7.5 11L11.5 10L12 1.5Z" fill="#81C784" opacity="0.4" />
            </svg>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="cp-sparkle" style={{ top: '72%', left: '13%' }}>
              <path d="M9 1L10 6L11.5 3.5L13 7L12.5 9L15 10L12.5 11L11.5 14L10 11.5L7.5 13L8.5 9.5L5.5 8.5L8.5 7.5L9 1Z" fill="#A5D6A7" opacity="0.5" />
            </svg>
          </div>

          {/* 绿色苹果 */}
          <div className="cp-apple">
            <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
              <defs>
                <radialGradient id="appleGrad" cx="40%" cy="35%">
                  <stop offset="0%" stopColor="#C8E6C9" />
                  <stop offset="40%" stopColor="#81C784" />
                  <stop offset="100%" stopColor="#4CAF50" />
                </radialGradient>
                <radialGradient id="appleShine" cx="35%" cy="28%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
              </defs>
              <ellipse cx="40" cy="48" rx="28" ry="30" fill="url(#appleGrad)" opacity="0.9" />
              <ellipse cx="40" cy="48" rx="28" ry="30" fill="url(#appleShine)" />
              <path d="M40 18 C38 14 42 10 43 6" stroke="#6D4C41" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M36 12 C40 10 44 12 40 16" fill="#66BB6A" opacity="0.7" />
              <path d="M38 7 C40 5 42 6 40 10" fill="#66BB6A" opacity="0.6" />
              <path d="M35 38 C30 44 28 52 40 56 C52 52 50 44 45 38" stroke="none" fill="rgba(255,255,255,0.15)" />
              {/* 蝴蝶结 */}
              <path d="M43 3 C48 1 50 4 43 7" fill="#388E3C" opacity="0.7" />
              <path d="M43 3 C38 1 36 4 43 7" fill="#388E3C" opacity="0.7" />
              <circle cx="43" cy="5" r="2" fill="#2E7D32" opacity="0.8" />
            </svg>
          </div>

          {/* 蝴蝶结装饰 */}
          <div className="cp-bow" style={{ top: '25%', left: '12%' }}>
            <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
              <path d="M12 9L4 2C2 0 0 2 4 6L12 9Z" fill="#81C784" opacity="0.5" />
              <path d="M12 9L20 2C22 0 24 2 20 6L12 9Z" fill="#81C784" opacity="0.5" />
              <circle cx="12" cy="9" r="2.5" fill="#66BB6A" opacity="0.6" />
            </svg>
          </div>
          <div className="cp-bow" style={{ top: '60%', left: '10%' }}>
            <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
              <path d="M10 7.5L3 1.5C1.5 0 0 2 3 5L10 7.5Z" fill="#A5D6A7" opacity="0.45" />
              <path d="M10 7.5L17 1.5C18.5 0 20 2 17 5L10 7.5Z" fill="#A5D6A7" opacity="0.45" />
              <circle cx="10" cy="7.5" r="2" fill="#81C784" opacity="0.5" />
            </svg>
          </div>

          {/* 虚线弧线 */}
          <div className="cp-dashed-arc">
            <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
              <path
                d="M170 20 C140 10 100 5 70 20 C40 35 20 70 15 100"
                stroke="#A5D6A7" strokeWidth="1.6" fill="none" strokeDasharray="6 5" opacity="0.4" strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* 内容层 */}
        <div className="cp-inner">
          {/* 左侧装饰 */}
          <motion.div
            className="cp-left"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="cp-hi">Hi!</h1>
            <h2 className="cp-call">CALL ME</h2>
            <div className="cp-deco">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <path d="M40 10C24 14 14 26 14 42C14 58 26 70 40 70C54 70 66 58 66 42C66 26 56 14 40 10Z" stroke="#8BC34A" strokeWidth="2" fill="rgba(139,195,74,0.1)" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="40" y1="20" x2="40" y2="62" stroke="#8BC34A" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M40 30L30 35M40 30L50 35M40 42L28 48M40 42L52 48M40 54L32 58M40 54L48 58" stroke="#8BC34A" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
              </svg>
            </div>
          </motion.div>

          {/* 右侧卡片 */}
          <motion.div
            className="cp-right"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          >
            {/* 联系我卡片 */}
            <div className="cp-card cp-card-left">
              <h3 className="cp-card-title">联系我</h3>
              <div className="cp-list">
                {contactList.map((item) => (
                  <div key={item.label} className="cp-item">
                    <span className="cp-item-icon">{item.icon}</span>
                    <div className="cp-item-body">
                      <span className="cp-item-label">{item.label}</span>
                      {item.href ? (
                        <a href={item.href} className="cp-item-value">{item.value}</a>
                      ) : (
                        <span className="cp-item-value">{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 活页圈 - 6孔银环 */}
            <div className="cp-binder-rings">
              <svg className="cp-binder-ring" viewBox="0 0 22 30" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="cpRingGrad" x1="0" y1="0" x2="22" y2="30">
                    <stop offset="0%" stopColor="#BDBDBD" />
                    <stop offset="30%" stopColor="#E0E0E0" />
                    <stop offset="50%" stopColor="#F5F5F5" />
                    <stop offset="70%" stopColor="#E0E0E0" />
                    <stop offset="100%" stopColor="#9E9E9E" />
                  </linearGradient>
                </defs>
                <ellipse cx="11" cy="15" rx="8" ry="12.5" stroke="url(#cpRingGrad)" strokeWidth="4" fill="none" strokeLinecap="round"/>
                <ellipse cx="11" cy="15" rx="7" ry="11.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" strokeLinecap="round"/>
              </svg>
              <svg className="cp-binder-ring" viewBox="0 0 22 30" fill="none" aria-hidden="true">
                <ellipse cx="11" cy="15" rx="8" ry="12.5" stroke="url(#cpRingGrad)" strokeWidth="4" fill="none" strokeLinecap="round"/>
                <ellipse cx="11" cy="15" rx="7" ry="11.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" strokeLinecap="round"/>
              </svg>
              <svg className="cp-binder-ring" viewBox="0 0 22 30" fill="none" aria-hidden="true">
                <ellipse cx="11" cy="15" rx="8" ry="12.5" stroke="url(#cpRingGrad)" strokeWidth="4" fill="none" strokeLinecap="round"/>
                <ellipse cx="11" cy="15" rx="7" ry="11.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" strokeLinecap="round"/>
              </svg>
              <svg className="cp-binder-ring" viewBox="0 0 22 30" fill="none" aria-hidden="true">
                <ellipse cx="11" cy="15" rx="8" ry="12.5" stroke="url(#cpRingGrad)" strokeWidth="4" fill="none" strokeLinecap="round"/>
                <ellipse cx="11" cy="15" rx="7" ry="11.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" strokeLinecap="round"/>
              </svg>
              <svg className="cp-binder-ring" viewBox="0 0 22 30" fill="none" aria-hidden="true">
                <ellipse cx="11" cy="15" rx="8" ry="12.5" stroke="url(#cpRingGrad)" strokeWidth="4" fill="none" strokeLinecap="round"/>
                <ellipse cx="11" cy="15" rx="7" ry="11.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" strokeLinecap="round"/>
              </svg>
              <svg className="cp-binder-ring" viewBox="0 0 22 30" fill="none" aria-hidden="true">
                <ellipse cx="11" cy="15" rx="8" ry="12.5" stroke="url(#cpRingGrad)" strokeWidth="4" fill="none" strokeLinecap="round"/>
                <ellipse cx="11" cy="15" rx="7" ry="11.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" strokeLinecap="round"/>
              </svg>
            </div>

            {/* 留言板卡片 */}
            <div className="cp-card cp-card-right">
              <h3 className="cp-card-title">留言板</h3>
              {submitted ? (
                <motion.div
                  className="cp-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  留言已收到，感谢你的来信
                </motion.div>
              ) : (
                <>
                  <textarea
                    className="cp-textarea"
                    placeholder="Start Message……"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                  <input
                    className="cp-input"
                    placeholder="Your contact details?"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                  />
                  <button
                    className="cp-submit"
                    onClick={handleSubmit}
                    disabled={sending}
                    style={{ opacity: sending ? 0.7 : 1, cursor: sending ? "wait" : "pointer" }}
                  >
                    {sending ? "发送中…" : "发送留言"}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <style>{`
        /* ============================================
         * 页面根 - 水彩背景
         * ============================================ */
        .cp-root {
          min-height: 100vh;
          background: #F5FBF2;
          background-image:
            /* 水彩晕染大块 */
            radial-gradient(ellipse 80% 50% at 20% 60%, rgba(200, 230, 190, 0.35) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 75% 30%, rgba(180, 220, 170, 0.25) 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 50% 80%, rgba(210, 235, 200, 0.3) 0%, transparent 60%),
            radial-gradient(ellipse 50% 30% at 15% 15%, rgba(190, 225, 180, 0.2) 0%, transparent 50%),
            /* 水彩肌理 */
            radial-gradient(circle at 10% 20%, rgba(200, 230, 180, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 85% 70%, rgba(180, 220, 170, 0.12) 0%, transparent 35%),
            /* 网格图案 */
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='none'/%3E%3Crect x='0' y='0' width='40' height='40' fill='none' stroke='rgba(139,195,74,0.06)' stroke-width='0.5'/%3E%3C/svg%3E"),
            /* 噪点纹理 */
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
          font-family: "Noto Sans SC", -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* ============================================
         * 背景装饰层
         * ============================================ */
        .cp-bg-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .cp-vine {
          position: absolute;
          left: 3%;
          top: 0;
          bottom: 0;
          width: 100px;
          opacity: 0.7;
        }
        .cp-sparkles {
          position: absolute;
          left: 8%;
          top: 0;
          bottom: 0;
          width: 80px;
        }
        .cp-sparkle {
          position: absolute;
        }
        .cp-apple {
          position: absolute;
          right: 6%;
          bottom: 8%;
          filter: drop-shadow(2px 4px 8px rgba(76, 175, 80, 0.2));
        }
        .cp-bow {
          position: absolute;
        }
        .cp-dashed-arc {
          position: absolute;
          right: 3%;
          bottom: 5%;
        }

        /* ============================================
         * 导航栏
         * ============================================ */
        .cp-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.88);
          border-bottom: 1px solid rgba(139, 195, 74, 0.12);
        }
        .cp-nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 28px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .cp-nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .cp-nav-back {
          font-size: 14px;
          color: #7a9a6a;
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.25s ease;
        }
        .cp-nav-back:hover {
          color: #558B2F;
        }

        /* ============================================
         * 主内容
         * ============================================ */
        .cp-main {
          padding-top: 64px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }
        .cp-inner {
          max-width: 960px;
          width: 100%;
          margin: 0 auto;
          padding: 60px 24px;
          display: flex;
          gap: 60px;
          align-items: flex-start;
        }

        /* 左侧装饰 */
        .cp-left {
          flex: 0 0 260px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding-top: 40px;
        }
        .cp-hi {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(48px, 7vw, 72px);
          font-weight: 300;
          color: #3a4a2e;
          margin: 0;
          line-height: 1;
        }
        .cp-call {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(26px, 3.5vw, 38px);
          font-weight: 600;
          color: #7CB342;
          margin: 10px 0 32px;
          line-height: 1;
          letter-spacing: 0.1em;
        }
        .cp-deco {
          opacity: 0.6;
        }

        /* ============================================
         * 卡片 - 水彩质感
         * ============================================ */
        .cp-right {
          flex: 1;
          display: flex;
          flex-direction: row;
          align-items: stretch;
          gap: 0;
          max-width: 680px;
        }
        .cp-card {
          background: #FAFCF7;
          background-image:
            radial-gradient(ellipse 60% 40% at 30% 20%, rgba(210, 235, 200, 0.2) 0%, transparent 70%),
            radial-gradient(ellipse 50% 30% at 70% 80%, rgba(190, 225, 180, 0.15) 0%, transparent 70%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E");
          border-radius: 24px;
          padding: 32px;
          border: 2px solid rgba(139, 195, 74, 0.15);
          box-shadow:
            0 2px 16px -2px rgba(104, 159, 56, 0.06),
            0 8px 40px -8px rgba(104, 159, 56, 0.08),
            inset 0 1px 0 rgba(255,255,255,0.8),
            inset 0 0 0 1px rgba(255,255,255,0.5);
          position: relative;
        }
        /* 水彩边框效果 */
        .cp-card::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 26px;
          background: transparent;
          box-shadow:
            inset 0 0 20px rgba(139, 195, 74, 0.06),
            0 0 0 2px rgba(255,255,255,0.6);
          pointer-events: none;
          z-index: 0;
        }
        .cp-card > * {
          position: relative;
          z-index: 1;
        }

        .cp-card-left {
          border-radius: 24px 4px 4px 24px;
          flex: 1;
          position: relative;
          padding-right: 32px;
        }
        .cp-card-left::after {
          content: '';
          position: absolute;
          top: 0;
          right: 10px;
          width: 16px;
          height: 100%;
          background:
            radial-gradient(ellipse 6px 10px at 50% 10%, rgba(80,100,70,0.12) 0%, rgba(80,100,70,0.12) 30%, rgba(255,255,255,0.2) 38%, transparent 50%),
            radial-gradient(ellipse 6px 10px at 50% 26%, rgba(80,100,70,0.12) 0%, rgba(80,100,70,0.12) 30%, rgba(255,255,255,0.2) 38%, transparent 50%),
            radial-gradient(ellipse 6px 10px at 50% 42%, rgba(80,100,70,0.12) 0%, rgba(80,100,70,0.12) 30%, rgba(255,255,255,0.2) 38%, transparent 50%),
            radial-gradient(ellipse 6px 10px at 50% 58%, rgba(80,100,70,0.12) 0%, rgba(80,100,70,0.12) 30%, rgba(255,255,255,0.2) 38%, transparent 50%),
            radial-gradient(ellipse 6px 10px at 50% 74%, rgba(80,100,70,0.12) 0%, rgba(80,100,70,0.12) 30%, rgba(255,255,255,0.2) 38%, transparent 50%),
            radial-gradient(ellipse 6px 10px at 50% 90%, rgba(80,100,70,0.12) 0%, rgba(80,100,70,0.12) 30%, rgba(255,255,255,0.2) 38%, transparent 50%);
          pointer-events: none;
          z-index: 2;
        }
        .cp-card-right {
          border-radius: 4px 24px 24px 4px;
          flex: 1;
          position: relative;
          padding-left: 32px;
        }
        .cp-card-right::after {
          content: '';
          position: absolute;
          top: 0;
          left: 10px;
          width: 16px;
          height: 100%;
          background:
            radial-gradient(ellipse 6px 10px at 50% 10%, rgba(80,100,70,0.12) 0%, rgba(80,100,70,0.12) 30%, rgba(255,255,255,0.2) 38%, transparent 50%),
            radial-gradient(ellipse 6px 10px at 50% 26%, rgba(80,100,70,0.12) 0%, rgba(80,100,70,0.12) 30%, rgba(255,255,255,0.2) 38%, transparent 50%),
            radial-gradient(ellipse 6px 10px at 50% 42%, rgba(80,100,70,0.12) 0%, rgba(80,100,70,0.12) 30%, rgba(255,255,255,0.2) 38%, transparent 50%),
            radial-gradient(ellipse 6px 10px at 50% 58%, rgba(80,100,70,0.12) 0%, rgba(80,100,70,0.12) 30%, rgba(255,255,255,0.2) 38%, transparent 50%),
            radial-gradient(ellipse 6px 10px at 50% 74%, rgba(80,100,70,0.12) 0%, rgba(80,100,70,0.12) 30%, rgba(255,255,255,0.2) 38%, transparent 50%),
            radial-gradient(ellipse 6px 10px at 50% 90%, rgba(80,100,70,0.12) 0%, rgba(80,100,70,0.12) 30%, rgba(255,255,255,0.2) 38%, transparent 50%);
          pointer-events: none;
          z-index: 2;
        }

        /* 活页圈 - 银环 */
        .cp-binder-rings {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-evenly;
          gap: 0;
          padding: 14px 3px;
          z-index: 3;
        }
        .cp-binder-ring {
          width: 24px;
          height: 32px;
          flex-shrink: 0;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2)) drop-shadow(0 0 1px rgba(0,0,0,0.1));
        }

        .cp-card-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 20px;
          font-weight: 600;
          color: #3a4a2e;
          margin: 0 0 20px;
          letter-spacing: 0.06em;
        }

        /* 联系列表 */
        .cp-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .cp-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          background: rgba(241, 248, 233, 0.5);
          border-radius: 14px;
          border: 1px solid rgba(139, 195, 74, 0.15);
          transition: all 0.25s ease;
        }
        .cp-item:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateX(4px);
          border-color: rgba(124, 179, 66, 0.25);
        }
        .cp-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(124, 179, 66, 0.1);
          color: #7CB342;
          flex-shrink: 0;
        }
        .cp-item-body {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .cp-item-label {
          font-size: 12px;
          color: #8a9a7a;
          letter-spacing: 0.04em;
        }
        .cp-item-value {
          font-size: 14px;
          color: #3a4a2e;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: color 0.2s ease;
        }
        a.cp-item-value:hover {
          color: #689F38;
        }

        /* 留言板 */
        .cp-textarea,
        .cp-input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid rgba(139, 195, 74, 0.25);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.6);
          font-family: inherit;
          font-size: 14px;
          color: #3a4a2e;
          outline: none;
          transition: all 0.25s ease;
          resize: none;
          box-sizing: border-box;
        }
        .cp-textarea {
          margin-bottom: 10px;
          min-height: 100px;
          line-height: 1.6;
        }
        .cp-input {
          margin-bottom: 14px;
        }
        .cp-textarea::placeholder,
        .cp-input::placeholder {
          color: #8a9a7a;
          font-size: 13px;
        }
        .cp-textarea:focus,
        .cp-input:focus {
          border-color: rgba(124, 179, 66, 0.4);
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 0 3px rgba(124, 179, 66, 0.05);
        }
        .cp-submit {
          padding: 11px 28px;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #8BC34A, #7CB342);
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.04em;
        }
        .cp-submit:hover {
          background: linear-gradient(135deg, #7CB342, #689F38);
          transform: scale(1.05);
          box-shadow: 0 8px 24px -4px rgba(104, 159, 56, 0.35);
        }
        .cp-success {
          padding: 40px 16px;
          text-align: center;
          color: #7CB342;
          font-size: 15px;
          letter-spacing: 0.04em;
        }

        /* 响应式 */
        @media (max-width: 768px) {
          .cp-bg-layer {
            display: none;
          }
          .cp-inner {
            flex-direction: column;
            gap: 36px;
            align-items: center;
            padding: 40px 20px;
          }
          .cp-left {
            flex: none;
            padding-top: 0;
            align-items: center;
            text-align: center;
          }
          .cp-right {
            max-width: 100%;
            width: 100%;
            flex-direction: column;
            gap: 20px;
          }
          .cp-card {
            padding: 24px;
          }
          .cp-card-left,
          .cp-card-right {
            border-radius: 24px;
          }
          .cp-binder-rings {
            display: none;
          }
          .cp-card-left::after,
          .cp-card-right::after {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;