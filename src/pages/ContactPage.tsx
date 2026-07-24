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
          background: #F4FAF0;
          background-image:
            /* 大面积水彩晕染 */
            radial-gradient(ellipse 90% 55% at 25% 65%, rgba(195, 225, 185, 0.38) 0%, transparent 62%),
            radial-gradient(ellipse 65% 45% at 78% 28%, rgba(175, 215, 165, 0.28) 0%, transparent 58%),
            radial-gradient(ellipse 75% 50% at 48% 82%, rgba(205, 232, 195, 0.32) 0%, transparent 62%),
            radial-gradient(ellipse 55% 35% at 12% 12%, rgba(185, 222, 175, 0.22) 0%, transparent 52%),
            radial-gradient(ellipse 45% 30% at 88% 72%, rgba(195, 225, 180, 0.18) 0%, transparent 48%),
            /* 小面积水彩肌理 */
            radial-gradient(circle 120px at 8% 22%, rgba(200, 230, 180, 0.16) 0%, transparent 100%),
            radial-gradient(circle 90px at 82% 68%, rgba(178, 218, 168, 0.14) 0%, transparent 100%),
            radial-gradient(circle 100px at 45% 15%, rgba(210, 235, 190, 0.12) 0%, transparent 100%),
            radial-gradient(circle 80px at 18% 78%, rgba(190, 225, 175, 0.13) 0%, transparent 100%),
            /* 淡色网格 */
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='none'/%3E%3Crect x='0' y='0' width='48' height='48' fill='none' stroke='rgba(139,195,74,0.05)' stroke-width='0.5'/%3E%3C/svg%3E"),
            /* 细微噪点 */
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.022'/%3E%3C/svg%3E");
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
          background: #FAFDF7;
          background-image:
            radial-gradient(ellipse 65% 42% at 28% 18%, rgba(210, 238, 200, 0.22) 0%, transparent 72%),
            radial-gradient(ellipse 55% 35% at 72% 82%, rgba(185, 225, 175, 0.16) 0%, transparent 72%),
            radial-gradient(ellipse 45% 28% at 50% 50%, rgba(255, 255, 255, 0.5) 0%, transparent 100%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.018'/%3E%3C/svg%3E");
          border-radius: 24px;
          padding: 32px;
          border: 2px solid rgba(139, 195, 74, 0.14);
          box-shadow:
            0 3px 20px -4px rgba(104, 159, 56, 0.07),
            0 10px 44px -10px rgba(104, 159, 56, 0.09),
            inset 0 1px 0 rgba(255,255,255,0.85),
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
          border-radius: 24px;
          flex: 1;
          position: relative;
          padding-right: 32px;
        }
        .cp-card-right {
          border-radius: 24px;
          flex: 1;
          position: relative;
          padding-left: 32px;
        }
        /* 两侧卡片间距（去掉活页圈后的紧凑感） */
        .cp-right {
          gap: 0;
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
        }
      `}</style>
    </div>
  );
};

export default ContactPage;