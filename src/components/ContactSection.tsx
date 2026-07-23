import { useState, useCallback } from "react";
import { motion } from "framer-motion";

/* ============================================================
 * ContactSection 联系方式
 * 参考 ONEAPPLE 风格：左侧装饰 + 右侧双卡片
 * 联系我卡片 + 留言板卡片
 * ============================================================ */

/** Formspree 表单链接 —— 请替换为你自己的链接 */
const FORMSPREE_URL = ""; // 示例: "https://formspree.io/f/xayz1234"

const ContactSection: React.FC = () => {
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

  return (
    <section id="contact" className="po-contact-section">
      <div className="po-contact-inner">
        {/* ---------- 左侧装饰 ---------- */}
        <motion.div
          className="po-contact-left"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="po-contact-hi">Hi!</h2>
          <h3 className="po-contact-call">CALL ME</h3>

          {/* 叶子装饰 */}
          <div className="po-contact-deco">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <path
                d="M36 8C20 12 12 24 12 38C12 52 22 62 36 62C50 62 60 52 60 38C60 24 52 12 36 8Z"
                stroke="#7a9a82"
                strokeWidth="1.8"
                fill="rgba(122,154,130,0.12)"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="36" y1="16" x2="36" y2="56" stroke="#7a9a82" strokeWidth="1.4" strokeLinecap="round" />
              <path
                d="M36 26L28 30M36 26L44 30M36 36L26 41M36 36L46 41M36 46L30 50M36 46L42 50"
                stroke="#7a9a82"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          </div>
        </motion.div>

        {/* ---------- 右侧卡片 ---------- */}
        <motion.div
          className="po-contact-right"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        >
          {/* 联系我卡片 */}
          <div className="po-contact-card">
            <h4 className="po-contact-card-title">联系我</h4>
            <div className="po-contact-list">
              <div className="po-contact-item">
                <span className="po-contact-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <span className="po-contact-text">15294705967</span>
              </div>

              <a href="mailto:2974131824@qq.com" className="po-contact-item">
                <span className="po-contact-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <span className="po-contact-text">2974131824@qq.com</span>
              </a>

              <a href="mailto:15294705967@163.com" className="po-contact-item">
                <span className="po-contact-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <span className="po-contact-text">15294705967@163.com</span>
              </a>
            </div>
          </div>

          {/* 留言板卡片 */}
          <div className="po-contact-card">
            <h4 className="po-contact-card-title">留言板</h4>
            {submitted ? (
              <motion.div
                className="po-contact-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                留言已收到，感谢你的来信
                <span style={{ marginLeft: 6 }}>✨</span>
              </motion.div>
            ) : (
              <>
                <textarea
                  className="po-contact-textarea"
                  placeholder="Start Message……"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
                <input
                  className="po-contact-input"
                  placeholder="Your contact details?"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                />
                <button
                  className="po-contact-submit"
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

      <style>{`
        .po-contact-section {
          padding: 100px 24px 60px;
          position: relative;
        }
        .po-contact-inner {
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          gap: 60px;
          align-items: flex-start;
        }

        /* ---------- 左侧装饰 ---------- */
        .po-contact-left {
          flex: 0 0 260px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding-top: 32px;
        }
        .po-contact-hi {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(44px, 7vw, 68px);
          font-weight: 300;
          color: #4a4038;
          margin: 0;
          line-height: 1;
          letter-spacing: 0.04em;
        }
        .po-contact-call {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(24px, 3.5vw, 36px);
          font-weight: 600;
          color: #5d8a6a;
          margin: 10px 0 28px;
          line-height: 1;
          letter-spacing: 0.1em;
        }
        .po-contact-deco {
          opacity: 0.55;
        }

        /* ---------- 右侧卡片 ---------- */
        .po-contact-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 22px;
          max-width: 480px;
        }
        .po-contact-card {
          background: rgba(255, 252, 245, 0.72);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 24px;
          padding: 30px 32px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 32px -12px rgba(80, 76, 66, 0.12);
        }
        .po-contact-card-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 20px;
          font-weight: 600;
          color: #4a4038;
          margin: 0 0 18px;
          letter-spacing: 0.06em;
        }

        /* 联系列表 */
        .po-contact-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .po-contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.55);
          border-radius: 14px;
          color: #4a4038;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.25s ease;
          border: 1px solid rgba(200, 210, 190, 0.25);
        }
        .po-contact-item:hover {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(122, 154, 130, 0.35);
          transform: translateX(4px);
        }
        .po-contact-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(122, 154, 130, 0.1);
          color: #5d8a6a;
          flex-shrink: 0;
        }
        .po-contact-text {
          color: #4a4038;
          letter-spacing: 0.02em;
        }

        /* 留言板输入 */
        .po-contact-textarea,
        .po-contact-input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid rgba(200, 210, 190, 0.45);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.5);
          font-family: inherit;
          font-size: 14px;
          color: #4a4038;
          outline: none;
          transition: all 0.25s ease;
          resize: none;
        }
        .po-contact-textarea {
          margin-bottom: 10px;
          min-height: 96px;
          line-height: 1.6;
        }
        .po-contact-input {
          margin-bottom: 14px;
        }
        .po-contact-textarea::placeholder,
        .po-contact-input::placeholder {
          color: #a8a39b;
          font-size: 13px;
        }
        .po-contact-textarea:focus,
        .po-contact-input:focus {
          border-color: rgba(122, 154, 130, 0.5);
          background: rgba(255, 255, 255, 0.85);
          box-shadow: 0 0 0 3px rgba(122, 154, 130, 0.08);
        }
        .po-contact-submit {
          padding: 11px 28px;
          border: none;
          border-radius: 999px;
          background: #4a7a5a;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.04em;
        }
        .po-contact-submit:hover {
          background: #3a6a4a;
          transform: scale(1.05);
          box-shadow: 0 8px 24px -4px rgba(74, 122, 90, 0.45);
        }
        .po-contact-success {
          padding: 36px 16px;
          text-align: center;
          color: #5d8a6a;
          font-size: 15px;
          letter-spacing: 0.04em;
        }

        /* ---------- 响应式 ---------- */
        @media (max-width: 768px) {
          .po-contact-section {
            padding: 60px 20px 40px;
          }
          .po-contact-inner {
            flex-direction: column;
            gap: 36px;
            align-items: center;
          }
          .po-contact-left {
            flex: none;
            padding-top: 0;
            align-items: center;
            text-align: center;
            width: 100%;
          }
          .po-contact-right {
            max-width: 100%;
            width: 100%;
          }
          .po-contact-card {
            padding: 24px;
          }
        }
      `}</style>
    </section>
  );
};

export default ContactSection;
