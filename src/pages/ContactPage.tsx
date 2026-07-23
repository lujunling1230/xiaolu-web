import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/* ============================================================
 * ContactPage 联系方式独立页面
 * 橘色/橙色/白色暖色调
 * ============================================================ */

/** Formspree 表单链接 —— 请替换为你自己的链接 */
const FORMSPREE_URL = ""; // 示例: "https://formspree.io/f/xayz1234"

const ContactPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!message.trim()) return;
    setSending(true);

    // 优先尝试 Formspree（配置了才走）
    if (FORMSPREE_URL) {
      try {
        const res = await fetch(FORMSPREE_URL, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            contact: contactInfo || "未填写",
            _subject: "【luro.site】新留言提醒",
            _replyto: contactInfo.includes("@") ? contactInfo : undefined,
          }),
        });
        if (res.ok) {
          setSubmitted(true);
          setMessage("");
          setContactInfo("");
          setTimeout(() => setSubmitted(false), 4000);
          setSending(false);
          return;
        }
      } catch {
        /* Formspree 失败则降级到本地存储 */
      }
    }

    // 降级：本地存储（未配置 Formspree 或网络失败时）
    const entry = { message, contactInfo, time: Date.now() };
    const existing = JSON.parse(localStorage.getItem("guestbook") || "[]");
    localStorage.setItem("guestbook", JSON.stringify([entry, ...existing]));
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
              <path d="M8 6C6 4 4 4 3 5C2 6 3 8 5 9" stroke="#C06A2E" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 6C18 4 20 4 21 5C22 6 21 8 19 9" stroke="#C06A2E" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <ellipse cx="12" cy="12" rx="5" ry="6" fill="rgba(192,106,46,0.08)" stroke="#C06A2E" strokeWidth="1.2" />
              <ellipse cx="8" cy="9" rx="2" ry="3" fill="none" stroke="#C06A2E" strokeWidth="1" transform="rotate(-20 8 9)" />
              <ellipse cx="16" cy="9" rx="2" ry="3" fill="none" stroke="#C06A2E" strokeWidth="1" transform="rotate(20 16 9)" />
              <circle cx="10" cy="11" r="1" fill="#C06A2E" />
              <circle cx="14" cy="11" r="1" fill="#C06A2E" />
              <circle cx="12" cy="15" r="1.2" fill="#C06A2E" opacity="0.6" />
            </svg>
            <span style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: "1.2rem", fontWeight: 600, color: "#C06A2E", letterSpacing: "0.06em" }}>luro</span>
          </Link>
          <Link to="/" className="cp-nav-back">← 返回首页</Link>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="cp-main">
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
                <path d="M40 10C24 14 14 26 14 42C14 58 26 70 40 70C54 70 66 58 66 42C66 26 56 14 40 10Z" stroke="#E8853A" strokeWidth="2" fill="rgba(232,133,58,0.1)" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="40" y1="20" x2="40" y2="62" stroke="#E8853A" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M40 30L30 35M40 30L50 35M40 42L28 48M40 42L52 48M40 54L32 58M40 54L48 58" stroke="#E8853A" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
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
            <div className="cp-card">
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
            <div className="cp-card">
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
        .cp-root {
          min-height: 100vh;
          background: #FFFAF6;
          background-image:
            radial-gradient(130% 70% at 50% -8%, rgba(255, 240, 220, 0.8) 0%, rgba(255, 250, 246, 0) 55%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          font-family: "Noto Sans SC", -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* 导航栏 */
        .cp-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(232, 160, 100, 0.15);
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
          color: #A08060;
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.25s ease;
        }
        .cp-nav-back:hover {
          color: #C06A2E;
        }

        /* 主内容 */
        .cp-main {
          padding-top: 64px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
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
          color: #4a3a2e;
          margin: 0;
          line-height: 1;
        }
        .cp-call {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(26px, 3.5vw, 38px);
          font-weight: 600;
          color: #E8853A;
          margin: 10px 0 32px;
          line-height: 1;
          letter-spacing: 0.1em;
        }
        .cp-deco {
          opacity: 0.6;
        }

        /* 右侧卡片 */
        .cp-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 480px;
        }
        .cp-card {
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 24px;
          padding: 32px;
          border: 1px solid rgba(232, 180, 130, 0.25);
          box-shadow: 0 8px 32px -12px rgba(192, 120, 60, 0.1);
        }
        .cp-card-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 20px;
          font-weight: 600;
          color: #4a3a2e;
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
          background: rgba(255, 248, 240, 0.6);
          border-radius: 14px;
          border: 1px solid rgba(232, 180, 130, 0.2);
          transition: all 0.25s ease;
        }
        .cp-item:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateX(4px);
          border-color: rgba(232, 133, 58, 0.35);
        }
        .cp-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(232, 133, 58, 0.1);
          color: #E8853A;
          flex-shrink: 0;
        }
        .cp-item-body {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .cp-item-label {
          font-size: 12px;
          color: #b8a090;
          letter-spacing: 0.04em;
        }
        .cp-item-value {
          font-size: 14px;
          color: #4a3a2e;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: color 0.2s ease;
        }
        a.cp-item-value:hover {
          color: #E8853A;
        }

        /* 留言板 */
        .cp-textarea,
        .cp-input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid rgba(232, 180, 130, 0.35);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.55);
          font-family: inherit;
          font-size: 14px;
          color: #4a3a2e;
          outline: none;
          transition: all 0.25s ease;
          resize: none;
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
          color: #b8a090;
          font-size: 13px;
        }
        .cp-textarea:focus,
        .cp-input:focus {
          border-color: rgba(232, 133, 58, 0.5);
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 0 3px rgba(232, 133, 58, 0.08);
        }
        .cp-submit {
          padding: 11px 28px;
          border: none;
          border-radius: 999px;
          background: #E8853A;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.04em;
        }
        .cp-submit:hover {
          background: #D4723A;
          transform: scale(1.05);
          box-shadow: 0 8px 24px -4px rgba(232, 133, 58, 0.45);
        }
        .cp-success {
          padding: 40px 16px;
          text-align: center;
          color: #E8853A;
          font-size: 15px;
          letter-spacing: 0.04em;
        }

        /* 响应式 */
        @media (max-width: 768px) {
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
          }
          .cp-card {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
