import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

/**
 * 生活切面 · 胶卷音乐馆
 *
 * 暗房感胶卷布局：一条垂直贯穿屏幕的胶卷条，
 * 6 个生活切面以画框形式交错排列在胶卷两侧。
 * 点击「音乐/播客」画框 → 跳转 /music 子页。
 */

/* ===== 6 个生活切面 ===== */
interface Slice {
  id: string;
  label: string;
  icon: string;
  desc: string;
  url?: string; // 有 url 的可点击跳转
  tint: string; // 画框边框色
}

const slices: Slice[] = [
  { id: "reading", label: "阅读", icon: "📖", desc: "纸页间的呼吸", tint: "#a8814a" },
  { id: "photo", label: "摄影", icon: "📷", desc: "光与影的收藏", tint: "#5f76a0" },
  { id: "music", label: "音乐 / 播客", icon: "🎧", desc: "枯木生歌", url: "/music", tint: "#b06a6a" },
  { id: "sport", label: "运动", icon: "🏃", desc: "风从耳边掠过", tint: "#5d8a6a" },
  { id: "meditate", label: "冥想", icon: "🧘", desc: "向内走的路", tint: "#7e6aa3" },
  { id: "film", label: "追剧", icon: "🎬", desc: "别人的故事，自己的眼泪", tint: "#b06f55" },
];

const LifeSlicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFromFull = searchParams.get("from") === "full";
  const homePath = isFromFull ? "/?mode=full" : "/mickey";
  const fromQuery = isFromFull ? "?from=full" : "";

  const [spinning, setSpinning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /** 胶卷齿孔生成（左右各一列） */
  const perforations = Array.from({ length: 28 }, (_, i) => i);

  /** 点击画框 */
  const handleClick = (slice: Slice) => {
    if (slice.url) {
      navigate(`${slice.url}${fromQuery}`);
    }
  };

  /** 双击音乐画框 → 直接跳转 + 旋转标记 */
  const handleDoubleClick = (slice: Slice) => {
    if (slice.id === "music" && slice.url) {
      setSpinning(true);
      setTimeout(() => navigate(`${slice.url}${fromQuery}`), 400);
    }
  };

  return (
    <div className="ls-page" ref={scrollRef}>
      {/* 恢复系统光标 */}
      <style>{`.ls-page, .ls-page * { cursor: auto; } .ls-page button, .ls-page a, .ls-page [role="button"] { cursor: pointer; }`}</style>

      {/* 顶部返回条 */}
      <header className="ls-topbar">
        <Link to={homePath} className="ls-back">← 回到妙妙工具箱</Link>
        <span className="ls-topbar-meta">Life Slices · 35mm</span>
      </header>

      {/* 标题区 */}
      <section className="ls-hero">
        <motion.p
          className="ls-eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Life Slices
        </motion.p>
        <motion.h1
          className="ls-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          生活切面
        </motion.h1>
        <motion.p
          className="ls-subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          一卷胶片，六个画面 —— 记录生活的不同切面。
        </motion.p>
      </section>

      {/* 胶卷主体 */}
      <section className="ls-film-section">
        {/* 左侧齿孔 */}
        <div className="ls-perforations ls-perforations-left">
          {perforations.map((i) => (
            <span key={i} className="ls-perf" style={{ animationDelay: `${(i % 4) * 0.3}s` }} />
          ))}
        </div>
        {/* 右侧齿孔 */}
        <div className="ls-perforations ls-perforations-right">
          {perforations.map((i) => (
            <span key={i} className="ls-perf" style={{ animationDelay: `${(i % 4) * 0.3}s` }} />
          ))}
        </div>

        {/* 胶卷条 */}
        <div className="ls-film-strip">
          {/* 画框交错排列 */}
          {slices.map((slice, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={slice.id}
                className={`ls-frame-wrap ${isLeft ? "ls-frame-left" : "ls-frame-right"}`}
                initial={{ opacity: 0, x: isLeft ? -40 : 40, scale: 0.92 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <button
                  type="button"
                  className={`ls-frame ${slice.url ? "ls-frame-active" : ""} ${spinning && slice.id === "music" ? "ls-frame-spinning" : ""}`}
                  onClick={() => handleClick(slice)}
                  onDoubleClick={() => handleDoubleClick(slice)}
                  aria-label={slice.label}
                  style={{ "--tint": slice.tint } as React.CSSProperties}
                >
                  <span className="ls-frame-icon">{slice.icon}</span>
                  <span className="ls-frame-label">{slice.label}</span>
                  <span className="ls-frame-desc">{slice.desc}</span>
                  {slice.url && <span className="ls-frame-go">↗</span>}
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 页脚 */}
      <footer className="ls-foot">
        <span>双击「音乐/播客」直接播放</span>
        <span className="ls-foot-dot">·</span>
        <span>持续显影中</span>
      </footer>

      <style>{`
        /* ===== 基础 ===== */
        .ls-page {
          position: relative;
          min-height: 100vh;
          background: #0d0d0d;
          color: #e8e8e8;
          font-family: "Noto Sans SC", system-ui, -apple-system, sans-serif;
          overflow-x: hidden;
          padding: 0 0 80px;
        }

        /* ===== 顶部返回条 ===== */
        .ls-topbar {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 28px;
          background: rgba(13, 13, 13, 0.75);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ls-back {
          font-size: 13px; color: #999; text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease;
        }
        .ls-back:hover { color: #fff; }
        .ls-topbar-meta {
          font-size: 10px; color: #555; letter-spacing: 0.28em; text-transform: uppercase;
        }

        /* ===== 标题区 ===== */
        .ls-hero {
          text-align: center; padding: 56px 20px 40px;
        }
        .ls-eyebrow {
          font-size: 11px; color: #666; letter-spacing: 0.3em;
          text-transform: uppercase; margin: 0 0 12px;
        }
        .ls-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(32px, 5vw, 48px); font-weight: 700;
          color: #f0f0f0; margin: 0 0 14px; letter-spacing: 0.12em;
        }
        .ls-subtitle {
          font-size: 14px; color: #888; margin: 0; letter-spacing: 0.06em;
        }

        /* ===== 胶卷主体 ===== */
        .ls-film-section {
          position: relative;
          max-width: 720px; margin: 0 auto;
          padding: 20px 0;
        }

        /* 齿孔 */
        .ls-perforations {
          position: absolute; top: 0; bottom: 0;
          width: 22px; display: flex; flex-direction: column;
          align-items: center; justify-content: space-around;
          padding: 8px 0; z-index: 2;
        }
        .ls-perforations-left { left: 50%; transform: translateX(-360px); }
        .ls-perforations-right { right: 50%; transform: translateX(360px); }
        .ls-perf {
          width: 14px; height: 10px; border-radius: 3px;
          background: #f5f5f5; opacity: 0.85;
          box-shadow: 0 0 4px rgba(255,255,255,0.2);
        }
        @media (max-width: 768px) {
          .ls-perforations-left { left: 8px; transform: none; }
          .ls-perforations-right { right: 8px; transform: none; }
        }

        /* 胶卷条 */
        .ls-film-strip {
          position: relative;
          background: #1a1a1a;
          border-left: 1px solid rgba(255,255,255,0.08);
          border-right: 1px solid rgba(255,255,255,0.08);
          padding: 24px 60px;
          min-height: 400px;
        }
        @media (max-width: 768px) {
          .ls-film-strip { padding: 24px 40px; }
        }

        /* 画框容器 */
        .ls-frame-wrap {
          display: flex; margin-bottom: 36px;
        }
        .ls-frame-left { justify-content: flex-start; }
        .ls-frame-right { justify-content: flex-end; }

        /* 单个画框 */
        .ls-frame {
          position: relative;
          width: 240px;
          padding: 22px 20px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.1);
          background: linear-gradient(145deg, #1e1e1e, #161616);
          box-shadow: 0 8px 24px -8px rgba(0,0,0,0.6),
                      inset 0 1px 0 rgba(255,255,255,0.04);
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .ls-frame-active { cursor: pointer; }
        .ls-frame:hover {
          transform: scale(1.05);
          border-color: var(--tint, rgba(255,255,255,0.3));
          box-shadow: 0 12px 32px -8px rgba(0,0,0,0.7),
                      0 0 20px -4px var(--tint, rgba(255,255,255,0.2)),
                      inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .ls-frame-spinning {
          animation: ls-frame-pulse 0.4s ease-out;
        }
        @keyframes ls-frame-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.12); box-shadow: 0 0 30px var(--tint); }
          100% { transform: scale(1); }
        }

        .ls-frame-icon {
          font-size: 32px; margin-bottom: 4px;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
        }
        .ls-frame-label {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px; font-weight: 600; color: #e0e0e0;
          letter-spacing: 0.04em;
        }
        .ls-frame-desc {
          font-size: 11px; color: #777; letter-spacing: 0.04em;
        }
        .ls-frame-go {
          position: absolute; top: 10px; right: 12px;
          font-size: 12px; color: var(--tint, #888); opacity: 0.6;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .ls-frame:hover .ls-frame-go {
          opacity: 1; transform: translate(2px, -2px);
        }

        /* ===== 页脚 ===== */
        .ls-foot {
          text-align: center; padding: 20px;
          font-size: 11px; color: #555; letter-spacing: 0.08em;
        }
        .ls-foot-dot { margin: 0 8px; opacity: 0.5; }
      `}</style>
    </div>
  );
};

export default LifeSlicesPage;
