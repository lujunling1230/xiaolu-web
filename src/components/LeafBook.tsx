import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, type Project } from "../data/projects";

/**
 * LeafBook 树叶书 — 实体书三段式翻阅
 *
 * 结构（页码模型）：
 *   page 0          封面 Cover
 *   page 1          目录 Index（第一页）
 *   page 2 .. N+1   作品详情 Detail（第 N 页）
 *
 * 交互：
 *   - 封面：点击任意处翻书进入目录（封面不显示"合上书"）
 *   - 目录：点击作品项 → 平滑翻到对应详情页
 *   - 详情：左栏文字（名称 / 痛点 / 简介），右栏视觉（截图或视频，点击新标签打开 liveUrl）
 *   - 目录与详情右下角"合上书"→ 书页合拢，回到封面
 *
 * 动画：Framer Motion 3D rotateY 翻页（transform-origin 左侧书脊）+ 翻页阴影
 */

const TOTAL_PROJECTS = projects.length;
const TOTAL_CONTENT_PAGES = TOTAL_PROJECTS + 1; // 目录(1) + 详情(N)
const FLIP_MS = 600;

/** 叶脉 SVG 纸纹理 */
const LEAF_VEIN_TEXTURE = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <pattern id="vein" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
      <path d="M100 10 L100 190 M100 40 Q70 60 50 90 M100 40 Q130 60 150 90 M100 80 Q60 100 40 140 M100 80 Q140 100 160 140 M100 120 Q70 140 55 170 M100 120 Q130 140 145 170" stroke="rgba(122,154,130,0.06)" stroke-width="0.8" fill="none"/>
    </pattern>
  </defs>
  <rect width="200" height="200" fill="url(#vein)"/>
</svg>
`)}`;

/** 小树叶 icon */
const LeafIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path
      d="M10 2C5 2 2 6 2 11c0 4 3 7 8 7 0-5 2-9 8-11-3-3-6-5-8-5z"
      fill="rgba(122,154,130,0.6)"
    />
    <path d="M6 16C8 12 11 9 15 7" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" strokeLinecap="round" />
  </svg>
);

/* ===== 翻页动画 variants（绕左侧书脊旋转） ===== */
const pageVariants = {
  enter: (dir: number) => ({ rotateY: dir > 0 ? 90 : -90, opacity: 0 }),
  center: { rotateY: 0, opacity: 1 },
  exit: (dir: number) => ({ rotateY: dir > 0 ? -90 : 90, opacity: 0 }),
};

/* ===== 封面页 ===== */
const CoverPage: React.FC = () => (
  <div className="lb-page-content lb-cover">
    <div className="lb-cover-vein" />
    <div className="lb-cover-frame" />
    <div className="lb-cover-inner">
      <div className="lb-cover-leaf">
        <LeafIcon size={42} />
      </div>
      <p className="lb-cover-eyebrow">A Leaf Book of Works</p>
      <h1 className="lb-cover-title">项目集</h1>
      <div className="lb-cover-line" />
      <p className="lb-cover-author">路俊玲 · 2026</p>
    </div>
    <p className="lb-cover-hint">轻触封面 · 翻开</p>
  </div>
);

/* ===== 目录页 ===== */
const IndexPage: React.FC<{ onPick?: (i: number) => void }> = ({ onPick }) => (
  <div className="lb-page-content lb-index-page">
    <div className="lb-page-vein" />
    <div className="lb-index-grid">
      <div className="lb-index-left">
        <span className="lb-index-label">CONTENTS</span>
        <h2 className="lb-index-title">目录</h2>
        <div className="lb-index-deco" />
        <p className="lb-index-count">共 {TOTAL_PROJECTS} 件作品</p>
      </div>
      <ul className="lb-index-list">
        {projects.map((p, i) => (
          <li
            key={p.id}
            className="lb-index-item"
            onClick={
              onPick
                ? (e) => {
                    e.stopPropagation();
                    onPick(i);
                  }
                : undefined
            }
          >
            <span className="lb-index-num">{String(i + 1).padStart(2, "0")}</span>
            <div className="lb-index-item-text">
              <span className="lb-index-item-title">{p.title}</span>
              <span className="lb-index-item-pain">{p.painPoint}</span>
            </div>
            <span className="lb-index-item-page">P.{i + 2}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

/* ===== 作品详情页（左右分栏） ===== */
const DetailPage: React.FC<{ project: Project; index: number }> = ({ project, index }) => (
  <div className="lb-page-content lb-detail-page">
    <div className="lb-page-vein" />
    <div className="lb-detail-grid">
      {/* 左栏 文字区 */}
      <div className="lb-detail-text">
        <span className="lb-detail-num">No. {String(index + 1).padStart(2, "0")}</span>
        <h2 className="lb-detail-title">{project.title}</h2>
        <div className="lb-detail-pain-wrap">
          <span className="lb-detail-pain-bar" />
          <p className="lb-detail-pain">{project.painPoint}</p>
        </div>
        <p className="lb-detail-desc">{project.description}</p>
        {project.tags && project.tags.length > 0 && (
          <div className="lb-detail-tags">
            {project.tags.map((t) => (
              <span key={t} className="lb-detail-tag">
                {t}
              </span>
            ))}
          </div>
        )}
        <a
          className="lb-detail-link"
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          访问作品 ↗
        </a>
      </div>

      {/* 右栏 视觉区（点击新标签打开 liveUrl） */}
      <a
        className="lb-detail-visual"
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        {project.videoUrl ? (
          <video
            src={project.videoUrl}
            className="lb-detail-media"
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          <img src={project.imageUrl} alt={project.title} className="lb-detail-media" />
        )}
        <span className="lb-detail-visual-overlay" />
        <span className="lb-detail-visual-hint">点击访问 ↗</span>
      </a>
    </div>
  </div>
);

/* ===== 主组件 ===== */
interface LeafBookProps {
  registerOpenBook?: (fn: () => void) => void;
}

const LeafBook: React.FC<LeafBookProps> = ({ registerOpenBook }) => {
  const [page, setPage] = useState(0); // 0=封面, 1=目录, 2..N+1=详情
  const [direction, setDirection] = useState(0); // 1=forward, -1=backward
  const [flipping, setFlipping] = useState(false);

  const pageRef = useRef(0);
  const flippingRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  /** 翻到指定页（带方向 + 翻页锁） */
  const goToPage = useCallback((p: number, dir: number) => {
    if (flippingRef.current) return;
    const clamped = Math.max(0, Math.min(TOTAL_PROJECTS + 1, p));
    if (clamped === pageRef.current) return;
    flippingRef.current = true;
    setFlipping(true);
    setDirection(dir);
    setPage(clamped);
    window.setTimeout(() => {
      flippingRef.current = false;
      setFlipping(false);
    }, FLIP_MS);
  }, []);

  const goPrev = useCallback(() => {
    if (pageRef.current > 1) goToPage(pageRef.current - 1, -1);
  }, [goToPage]);

  const goNext = useCallback(() => {
    if (pageRef.current < TOTAL_CONTENT_PAGES) goToPage(pageRef.current + 1, 1);
    else if (pageRef.current === 0) goToPage(1, 1); // 封面 → 目录
  }, [goToPage]);

  /** 打开书：从封面翻到目录（供 Hero "翻阅我的作品" 调用） */
  const openBook = useCallback(() => {
    const cur = pageRef.current;
    if (cur === 0) goToPage(1, 1);
    else if (cur > 1) goToPage(1, -1);
  }, [goToPage]);

  useEffect(() => {
    if (registerOpenBook) registerOpenBook(openBook);
  }, [registerOpenBook, openBook]);

  /** 点击书页空白处翻页；交互元素自行 stopPropagation */
  const handleBookClick = (e: React.MouseEvent) => {
    const cur = pageRef.current;
    if (cur === 0) {
      goToPage(1, 1);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.clientX - rect.left < rect.width / 2) goPrev();
    else goNext();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartRef.current = null;
  };

  /** 渲染某一页内容 */
  const renderPage = (p: number): React.ReactNode => {
    if (p === 0) return <CoverPage />;
    if (p === 1) return <IndexPage onPick={(i) => goToPage(i + 2, 1)} />;
    const idx = p - 2;
    if (idx >= 0 && idx < TOTAL_PROJECTS) {
      return <DetailPage project={projects[idx]} index={idx} />;
    }
    return null;
  };

  const isCover = page === 0;

  return (
    <div className="lb-wrapper">
      <div className="lb-book-stand">
        <div
          className="lb-book"
          onClick={handleBookClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 书脊阴影 */}
          <div className="lb-spine-shadow" />

          {/* 页面 + 翻页动画 */}
          <div className="lb-pages-container">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={page}
                className="lb-page"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: FLIP_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformOrigin: "left center" }}
              >
                {renderPage(page)}
              </motion.div>
            </AnimatePresence>

            {/* 翻页阴影叠加 */}
            {flipping && (
              <div
                className={`lb-flip-shadow ${
                  direction > 0 ? "lb-flip-shadow-fwd" : "lb-flip-shadow-bwd"
                }`}
              />
            )}
          </div>

          {/* 合上书 — 仅内容页（封面不显示） */}
          {!isCover && (
            <button
              className="lb-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                goToPage(0, -1);
              }}
            >
              合上书
            </button>
          )}
        </div>

        {/* 桌面投影 */}
        <div className="lb-desk-shadow" />
      </div>

      {/* 底部页码控制 — 仅内容页 */}
      {!isCover && (
        <div className="lb-controls">
          <button
            className="lb-nav-btn"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            disabled={page === 1}
            aria-label="上一页"
          >
            ←
          </button>
          <span className="lb-page-indicator">
            第 <span className="lb-page-current">{page}</span> / {TOTAL_CONTENT_PAGES} 页
          </span>
          <button
            className="lb-nav-btn"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            disabled={page === TOTAL_CONTENT_PAGES}
            aria-label="下一页"
          >
            →
          </button>
        </div>
      )}

      <style>{`
        .lb-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          margin-top: 32px;
        }

        /* ===== 书容器 + 木桌投影 ===== */
        .lb-book-stand {
          position: relative;
          perspective: 1800px;
        }
        .lb-book {
          position: relative;
          width: 420px;
          height: 594px;
          max-width: 90vw;
          max-height: 75vh;
          border-radius: 4px 12px 12px 4px;
          overflow: hidden;
          cursor: pointer;
          box-shadow:
            0 2px 8px -2px rgba(0,0,0,0.15),
            0 12px 40px -8px rgba(60, 50, 40, 0.25),
            inset 4px 0 12px -4px rgba(0,0,0,0.1);
          background: var(--lb-page-bg, #F5F0E4);
          transition: background 0.6s ease;
        }

        /* 主题变量 */
        :root[data-theme="day"] .lb-book {
          --lb-page-bg: #F5F0E4;
          --lb-vein-color: rgba(122, 154, 130, 0.06);
          --lb-text: #3d3d3d;
          --lb-text-soft: #6b6b6b;
        }
        :root[data-theme="night"] .lb-book {
          --lb-page-bg: #2A3028;
          --lb-vein-color: rgba(157, 184, 165, 0.05);
          --lb-text: #e2e8f0;
          --lb-text-soft: #a0aec0;
        }

        /* 桌面投影 */
        .lb-desk-shadow {
          width: 380px;
          max-width: 85vw;
          height: 20px;
          margin: 0 auto;
          background: radial-gradient(ellipse, rgba(60,50,40,0.15) 0%, transparent 70%);
          border-radius: 50%;
        }

        /* 书脊阴影 */
        .lb-spine-shadow {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 12px;
          background: linear-gradient(
            to right,
            rgba(0,0,0,0.12) 0%,
            rgba(0,0,0,0.04) 50%,
            transparent 100%
          );
          z-index: 6;
          pointer-events: none;
        }

        /* 页面容器 */
        .lb-pages-container {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }
        .lb-page {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        /* 翻页阴影 */
        .lb-flip-shadow {
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          animation: lb-shadow-fade 0.55s ease-out forwards;
        }
        .lb-flip-shadow-fwd {
          background: linear-gradient(to left, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.04) 35%, transparent 60%);
        }
        .lb-flip-shadow-bwd {
          background: linear-gradient(to right, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.04) 35%, transparent 60%);
        }
        @keyframes lb-shadow-fade {
          0% { opacity: 0.95; }
          60% { opacity: 0.5; }
          100% { opacity: 0; }
        }

        /* ===== 页面内容通用 ===== */
        .lb-page-content {
          position: relative;
          width: 100%;
          height: 100%;
          background: var(--lb-page-bg);
          overflow: hidden;
        }
        .lb-page-vein {
          position: absolute;
          inset: 0;
          background-image: url("${LEAF_VEIN_TEXTURE}");
          background-repeat: repeat;
          opacity: 0.7;
          pointer-events: none;
          z-index: 0;
        }

        /* ===== 封面 ===== */
        .lb-cover {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #E8E0D0 0%, #F0EAD8 50%, #E8E0D0 100%);
        }
        :root[data-theme="night"] .lb-cover {
          background: linear-gradient(135deg, #1E2820 0%, #2A3328 50%, #1E2820 100%);
        }
        .lb-cover-vein {
          position: absolute;
          inset: 0;
          background-image: url("${LEAF_VEIN_TEXTURE}");
          opacity: 0.5;
          z-index: 0;
        }
        .lb-cover-frame {
          position: absolute;
          inset: 22px;
          border: 1px solid rgba(184, 140, 106, 0.3);
          border-radius: 3px;
          box-shadow: inset 0 0 0 6px transparent, inset 0 0 0 7px rgba(184, 140, 106, 0.12);
          pointer-events: none;
          z-index: 1;
        }
        .lb-cover-inner {
          position: relative;
          text-align: center;
          z-index: 2;
        }
        .lb-cover-leaf {
          display: flex;
          justify-content: center;
          margin-bottom: 18px;
          opacity: 0.85;
        }
        .lb-cover-eyebrow {
          font-size: 11px;
          color: var(--lb-text-soft);
          letter-spacing: 0.28em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .lb-cover-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 40px;
          font-weight: 700;
          color: var(--lb-text);
          margin: 0 0 18px;
          letter-spacing: 0.16em;
        }
        .lb-cover-line {
          width: 44px;
          height: 1px;
          background: var(--lb-text-soft);
          margin: 0 auto 16px;
          opacity: 0.4;
        }
        .lb-cover-author {
          font-size: 14px;
          color: var(--lb-text-soft);
          font-family: "Noto Serif SC", Georgia, serif;
          letter-spacing: 0.05em;
        }
        .lb-cover-hint {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          letter-spacing: 0.24em;
          color: var(--lb-text-soft);
          opacity: 0.5;
          z-index: 2;
          animation: lb-hint-pulse 3.2s ease-in-out infinite;
        }
        @keyframes lb-hint-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.75; }
        }

        /* ===== 目录页 ===== */
        .lb-index-page { display: flex; }
        .lb-index-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 0.82fr 1.18fr;
          gap: 24px;
          width: 100%;
          height: 100%;
          padding: 48px 40px;
        }
        .lb-index-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-right: 1px solid rgba(184, 140, 106, 0.15);
          padding-right: 20px;
        }
        .lb-index-label {
          font-size: 10px;
          letter-spacing: 0.3em;
          color: var(--lb-text-soft);
          opacity: 0.7;
          margin-bottom: 10px;
        }
        .lb-index-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 38px;
          font-weight: 700;
          color: var(--lb-text);
          letter-spacing: 0.1em;
          margin: 0;
        }
        .lb-index-deco {
          width: 28px;
          height: 1px;
          background: var(--accent);
          opacity: 0.6;
          margin: 18px 0;
        }
        .lb-index-count {
          font-size: 12px;
          color: var(--lb-text-soft);
          letter-spacing: 0.05em;
        }
        .lb-index-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
        }
        .lb-index-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 11px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.28s ease, background 0.28s ease;
        }
        .lb-index-item:hover {
          transform: translateX(4px);
          background: rgba(184, 140, 106, 0.07);
        }
        .lb-index-num {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 13px;
          color: var(--accent);
          opacity: 0.7;
          font-variant-numeric: tabular-nums;
          min-width: 22px;
        }
        .lb-index-item-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }
        .lb-index-item-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--lb-text);
        }
        .lb-index-item-pain {
          font-size: 11px;
          color: var(--lb-text-soft);
          opacity: 0.85;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .lb-index-item-page {
          font-size: 11px;
          color: var(--lb-text-soft);
          opacity: 0.55;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.05em;
        }

        /* ===== 详情页（左右分栏） ===== */
        .lb-detail-page { display: flex; }
        .lb-detail-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          width: 100%;
          height: 100%;
        }
        .lb-detail-text {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          padding: 44px 30px 56px;
          border-right: 1px solid rgba(184, 140, 106, 0.14);
          overflow-y: auto;
          scrollbar-width: none;
        }
        .lb-detail-text::-webkit-scrollbar { display: none; }
        .lb-detail-num {
          font-size: 11px;
          letter-spacing: 0.2em;
          color: var(--accent);
          opacity: 0.8;
          margin-bottom: 14px;
          font-variant-numeric: tabular-nums;
        }
        .lb-detail-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 27px;
          font-weight: 700;
          color: var(--lb-text);
          line-height: 1.25;
          margin: 0 0 18px;
          letter-spacing: 0.02em;
        }
        .lb-detail-pain-wrap {
          display: flex;
          align-items: stretch;
          gap: 12px;
          margin-bottom: 18px;
        }
        .lb-detail-pain-bar {
          width: 3px;
          border-radius: 2px;
          background: var(--accent);
          flex-shrink: 0;
          opacity: 0.8;
        }
        .lb-detail-pain {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--accent);
          line-height: 1.55;
          margin: 0;
        }
        .lb-detail-desc {
          font-size: 13px;
          line-height: 1.85;
          color: var(--lb-text-soft);
          margin: 0 0 18px;
        }
        .lb-detail-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 18px;
        }
        .lb-detail-tag {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 6px;
          background: rgba(184, 140, 106, 0.1);
          color: var(--lb-text-soft);
        }
        .lb-detail-link {
          margin-top: auto;
          align-self: flex-start;
          font-size: 13px;
          color: var(--accent);
          font-weight: 500;
          text-decoration: none;
          padding: 7px 0;
          border-bottom: 1px solid rgba(184, 140, 106, 0.3);
          transition: border-color 0.25s ease;
        }
        .lb-detail-link:hover { border-color: var(--accent); }

        /* 右栏 视觉区 */
        .lb-detail-visual {
          position: relative;
          z-index: 2;
          display: block;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #1a1f1a;
        }
        .lb-detail-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .lb-detail-visual:hover .lb-detail-media { transform: scale(1.03); }
        .lb-detail-visual-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28));
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .lb-detail-visual:hover .lb-detail-visual-overlay { opacity: 1; }
        .lb-detail-visual-hint {
          position: absolute;
          top: 14px;
          left: 14px;
          padding: 4px 11px;
          font-size: 11px;
          border-radius: 999px;
          background: rgba(0,0,0,0.45);
          color: #fff;
          backdrop-filter: blur(4px);
          letter-spacing: 0.05em;
          opacity: 0.85;
        }

        /* ===== 合上书按钮 ===== */
        .lb-close-btn {
          position: absolute;
          bottom: 16px;
          right: 16px;
          z-index: 20;
          padding: 7px 16px;
          font-size: 12px;
          font-family: "Noto Sans SC", sans-serif;
          color: var(--lb-text-soft);
          background: rgba(245, 240, 228, 0.7);
          border: 1px solid rgba(184, 140, 106, 0.25);
          border-radius: 999px;
          cursor: pointer;
          backdrop-filter: blur(6px);
          transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
        }
        :root[data-theme="night"] .lb-close-btn {
          background: rgba(42, 48, 40, 0.7);
        }
        .lb-close-btn:hover {
          color: var(--accent);
          border-color: var(--accent);
          transform: translateY(-1px);
        }

        /* ===== 底部控制 ===== */
        .lb-controls {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .lb-nav-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          border-radius: 50%;
          background: var(--card-bg);
          color: var(--text-soft);
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.25s ease, border-color 0.25s ease, color 0.25s ease;
        }
        .lb-nav-btn:hover:not(:disabled) {
          border-color: var(--accent);
          color: var(--accent);
          transform: scale(1.06);
        }
        .lb-nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .lb-page-indicator {
          font-size: 13px;
          color: var(--text-soft);
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.05em;
        }
        .lb-page-current {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 16px;
          color: var(--accent);
          font-weight: 600;
        }

        /* ===== 移动端 ===== */
        @media (max-width: 768px) {
          .lb-book {
            width: 300px;
            height: 424px;
            max-height: 68vh;
          }
          .lb-index-grid { padding: 30px 20px; gap: 14px; grid-template-columns: 0.7fr 1.3fr; }
          .lb-index-title { font-size: 26px; }
          .lb-index-item { padding: 7px 8px; gap: 8px; }
          .lb-index-item-title { font-size: 13px; }
          .lb-index-item-pain { font-size: 10px; }
          .lb-cover-title { font-size: 30px; }
          /* 详情：移动端改为上下分栏 */
          .lb-detail-grid { grid-template-columns: 1fr; grid-template-rows: 1.15fr 0.85fr; }
          .lb-detail-text {
            padding: 24px 20px 16px;
            border-right: none;
            border-bottom: 1px solid rgba(184, 140, 106, 0.14);
          }
          .lb-detail-title { font-size: 20px; margin-bottom: 12px; }
          .lb-detail-pain { font-size: 13px; }
          .lb-detail-desc { font-size: 12px; line-height: 1.7; margin-bottom: 12px; }
          .lb-detail-tags { margin-bottom: 12px; }
          .lb-detail-link { font-size: 12px; }
          .lb-close-btn { bottom: 12px; right: 12px; padding: 6px 12px; font-size: 11px; }
        }
      `}</style>
    </div>
  );
};

export default LeafBook;
