import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * MessageBoard 留言板
 *
 * - 4 条预设种子评价（破冰引导）
 * - 「留下你的感受」表单：昵称（可选）+ 星级评分 + 留言文本域 + 提交按钮
 * - 提交后留言实时展示在列表顶部（useState 管理，无后端）
 * - 样式沿用现有卡片风格，背景柔和
 */

interface Review {
  id: number;
  avatar: string;
  nickname: string;
  stars: number;
  content: string;
  isSeed?: boolean;
}

/** 4 条种子评价（静态，仅作破冰引导） */
const SEED_REVIEWS: Review[] = [
  { id: 1, avatar: "🌿", nickname: "访客 A", stars: 5, content: "呼吸引导的数字倒计时太有安全感了，焦虑的时候点开很管用。", isSeed: true },
  { id: 2, avatar: "🍂", nickname: "匿名用户", stars: 5, content: "配色很舒服，像真的在森林里一样。", isSeed: true },
  { id: 3, avatar: "🦌", nickname: "林间漫步者", stars: 4, content: "希望能增加自定义呼吸时长的功能。", isSeed: true },
  { id: 4, avatar: "🌙", nickname: "夜猫子", stars: 5, content: "感恩日记的 12 月主题很戳我，坚持写了三天了！", isSeed: true },
];

/** 用户留言随机头像池 */
const USER_AVATARS = ["🍃", "🌸", "🦋", "🍄", "🌱", "🌷", "🐦", "🦉"];

/** 星级渲染（只读） */
const Stars: React.FC<{ count: number }> = ({ count }) => (
  <span className="mb-stars">
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} className={i <= count ? "mb-star-filled" : "mb-star-empty"}>★</span>
    ))}
  </span>
);

/** 可点击评分组件 */
const StarRating: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  return (
    <span className="mb-star-rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= (hover || value) ? "mb-star-filled" : "mb-star-empty"}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
    </span>
  );
};

const MessageBoard: React.FC = () => {
  // 留言列表：种子评价 + 用户提交的留言
  const [messages, setMessages] = useState<Review[]>(SEED_REVIEWS);
  // 表单状态
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [userStars, setUserStars] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  /** 提交留言 */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const avatar = USER_AVATARS[Math.floor(Math.random() * USER_AVATARS.length)];
    const newMessage: Review = {
      id: Date.now(),
      avatar,
      nickname: nickname.trim() || "匿名访客",
      stars: userStars,
      content: content.trim(),
    };

    setMessages((prev) => [newMessage, ...prev]);
    setContent("");
    setNickname("");
    setUserStars(5);
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <div className="mb-container">
      {/* ===== 留言表单（一体化框） ===== */}
      <form className="mb-form" onSubmit={handleSubmit}>
        <div className="mb-form-header">
          <div>
            <h4 className="mb-form-title">留下你的感受</h4>
            <p className="mb-form-desc">你的只言片语，可能是某个人森林里的一束光。</p>
          </div>
          <div className="mb-form-rating">
            <span className="mb-rating-label">评分</span>
            <StarRating value={userStars} onChange={setUserStars} />
          </div>
        </div>

        <div className="mb-form-body">
          <input
            type="text"
            className="mb-input"
            placeholder="昵称（可选，留空即匿名）"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
          />

          <textarea
            className="mb-textarea"
            placeholder="写下你想说的话…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={200}
            rows={3}
          />
        </div>

        <div className="mb-form-footer">
          <span className="mb-char-count">{content.length}/200</span>
          <button
            type="submit"
            className="mb-submit-btn"
            disabled={!content.trim()}
          >
            发布留言
          </button>
        </div>

        {/* 提交成功反馈 */}
        <AnimatePresence>
          {submitted && (
            <motion.span
              className="mb-submit-feedback"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3 }}
            >
              已发布 ✨ 感谢你的分享。
            </motion.span>
          )}
        </AnimatePresence>
      </form>

      {/* ===== 留言列表 ===== */}
      <div className="mb-reviews-header">
        <h4 className="mb-reviews-title">来自访客的留言</h4>
        <span className="mb-reviews-count">{messages.length} 条</span>
      </div>

      <div className="mb-reviews-grid">
        <AnimatePresence initial={false}>
          {messages.map((review, idx) => (
            <motion.div
              key={review.id}
              className={`mb-review-card${review.isSeed ? "" : " mb-review-user"}`}
              initial={review.isSeed ? { opacity: 0, y: 16 } : { opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: review.isSeed ? idx * 0.1 : 0 }}
              whileHover={{ y: -3, boxShadow: "0 8px 24px -6px rgba(60,80,60,0.15)" }}
            >
              <div className="mb-review-top">
                <div className="mb-review-avatar">{review.avatar}</div>
                <div className="mb-review-info">
                  <span className="mb-review-name">
                    {review.nickname}
                    {!review.isSeed && <span className="mb-review-tag">新</span>}
                  </span>
                  {review.stars > 0 && <Stars count={review.stars} />}
                </div>
              </div>
              <p className="mb-review-text">{review.content}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style>{`
        .mb-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ===== 留言表单（一体化框） ===== */
        .mb-form {
          padding: 24px;
          border-radius: 16px;
          background: rgba(122, 154, 130, 0.05);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        [data-theme="night"] .mb-form {
          background: rgba(255, 255, 255, 0.03);
        }
        .mb-form-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .mb-form-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
          margin: 0;
        }
        .mb-form-desc {
          font-size: 12px;
          color: var(--text-soft);
          margin: 4px 0 0;
          line-height: 1.6;
        }
        .mb-form-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .mb-rating-label {
          font-size: 12px;
          color: var(--text-soft);
          letter-spacing: 0.05em;
        }
        .mb-star-rating {
          display: flex;
          gap: 2px;
          font-size: 18px;
          cursor: pointer;
        }
        .mb-star-rating span {
          transition: transform 0.15s ease;
          user-select: none;
        }
        .mb-star-rating span:hover {
          transform: scale(1.2);
        }
        .mb-form-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .mb-input {
          width: 100%;
          padding: 10px 14px;
          font-size: 13px;
          font-family: inherit;
          color: var(--text);
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
          box-sizing: border-box;
        }
        .mb-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(122, 154, 130, 0.12);
        }
        .mb-input::placeholder {
          color: var(--text-soft);
          opacity: 0.5;
        }
        .mb-textarea {
          width: 100%;
          min-height: 80px;
          padding: 12px 14px;
          font-size: 14px;
          font-family: Georgia, "Noto Serif SC", serif;
          line-height: 1.7;
          color: var(--text);
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          resize: vertical;
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
          box-sizing: border-box;
        }
        .mb-textarea:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(122, 154, 130, 0.12);
        }
        .mb-textarea::placeholder {
          color: var(--text-soft);
          opacity: 0.5;
          font-style: italic;
        }
        .mb-form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mb-char-count {
          font-size: 11px;
          color: var(--text-soft);
          opacity: 0.6;
        }
        .mb-submit-btn {
          padding: 9px 24px;
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          border: none;
          border-radius: 8px;
          background: var(--accent);
          color: #fff;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          box-shadow: 0 3px 12px -3px rgba(122, 154, 130, 0.4);
        }
        .mb-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px -3px rgba(122, 154, 130, 0.5);
        }
        .mb-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .mb-submit-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .mb-submit-feedback {
          font-family: Georgia, "Noto Serif SC", serif;
          font-size: 12px;
          font-style: italic;
          color: var(--accent);
          align-self: flex-end;
        }

        /* ===== 留言列表 ===== */
        .mb-reviews-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .mb-reviews-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
          margin: 0;
        }
        .mb-reviews-count {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(122, 154, 130, 0.12);
          color: var(--accent);
        }

        /* 评价卡片网格 */
        .mb-reviews-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .mb-review-card {
          padding: 16px;
          border-radius: 12px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          cursor: default;
          transition: box-shadow 0.25s ease;
        }
        /* 用户留言卡片：左侧加一条强调色边 */
        .mb-review-user {
          border-left: 3px solid var(--accent);
        }
        .mb-review-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .mb-review-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          background: rgba(122, 154, 130, 0.08);
          flex-shrink: 0;
        }
        .mb-review-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .mb-review-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .mb-review-tag {
          font-size: 9px;
          padding: 1px 6px;
          border-radius: 999px;
          background: var(--accent);
          color: #fff;
          letter-spacing: 0.05em;
        }
        .mb-stars {
          display: flex;
          gap: 1px;
          font-size: 11px;
        }
        .mb-star-filled {
          color: #f5a623;
        }
        .mb-star-empty {
          color: var(--border);
        }
        .mb-review-text {
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-soft);
          margin: 0;
        }

        @media (max-width: 640px) {
          .mb-reviews-grid {
            grid-template-columns: 1fr;
          }
          .mb-form-header {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default MessageBoard;
