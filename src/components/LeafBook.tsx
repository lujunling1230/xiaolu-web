import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, type Project } from "../data/projects";

/**
 * LeafBook 树叶书 — 出版级实体书翻阅体验（总页码 100 版）
 *
 * 翻页流：
 *   封皮(001) → 目录(002) → 金句A(003) → 预览A(004) → 金句B(005) → 预览B(006) → ...
 *
 * 全书总页数固定 100，制造"厚重典籍"感。
 * 页码公式：
 *   cover  = 1
 *   toc    = 2
 *   quote  = 3 + index * 2   (003, 005, 007, ... 019)
 *   preview= 4 + index * 2   (004, 006, 008, ... 020)
 */

/* ===== 常量 ===== */
const FLIP_MS = 650;
const TOTAL_PAGES = 100;

/** 作品路由映射（按 projects 数组顺序对应，点击预览页跳转） */
const ROUTES: string[] = [
  "/forest",              // 0 森林疗愈室
  "/toolbox/answer",      // 1 系统调频
  "/toolbox/quests",      // 2 通关清单
  "/toolbox/supplies",    // 3 物资管家
  "/toolbox/advice",      // 4 解忧杂货铺
  "/toolbox/travel",      // 5 漫游指南
  "/toolbox/recharge",    // 6 回血清单
  "/toolbox/games",       // 7 解压馆
  "/toolbox/memories",    // 8 时光博物馆
];

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

/* ===== 金句映射表（按 projects 数组顺序对应） ===== */
const QUOTES: string[] = [
  "在这里，你可以暂时停止思考，只管呼吸。",
  "当风暴来临，试着调整帆的角度，而不是对抗风。",
  "即使是巨树，也是从一颗种子开始生长的。",
  "照顾好根须，树木才能安然度过冬天。",
  "把心事折成纸船，顺着溪流漂走吧。",
  "森林里没有错误的路，只有不同的风景。",
  "苔藓不需要阳光也能生长，微小亦是生命力。",
  "落叶腐烂是为了滋养新的土壤，崩塌也是。",
  "年轮记录了每一段风雨，它们都是勋章。",
];

/* ===== 视图类型 ===== */
type View = "cover" | "toc" | "quote" | "preview";

/** 页码计算：cover=1, toc=2, quote=3+i*2, preview=4+i*2 */
const getPageNumber = (view: View, index: number): number => {
  if (view === "cover") return 1;
  if (view === "toc") return 2;
  if (view === "quote") return 3 + index * 2;
  if (view === "preview") return 4 + index * 2;
  return 1;
};

/* ===== 翻页动画 variants（x 轴位移 + rotateY 透视） ===== */
const pageVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    rotateY: dir > 0 ? 35 : -35,
    opacity: 0,
  }),
  center: { x: 0, rotateY: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    rotateY: dir > 0 ? -35 : 35,
    opacity: 0,
  }),
};

/** 页码显示组件（右下角） */
const PageNumber: React.FC<{ current: number }> = ({ current }) => (
  <span className="lb-page-number">
    {String(current).padStart(3, "0")} <span className="lb-page-number-slash">/</span> {TOTAL_PAGES}
  </span>
);

/* ============================================================
   Page 1 · 封皮
   ============================================================ */
const CoverPage: React.FC = () => (
  <div className="lb-page-content lb-cover">
    <div className="lb-cover-vein" />
    <div className="lb-cover-frame" />
    <div className="lb-cover-inner">
      <div className="lb-cover-leaf">
        <LeafIcon size={48} />
      </div>
      <p className="lb-cover-eyebrow">A Leaf Book of Works</p>
      <h1 className="lb-cover-title">LeafBook</h1>
      <div className="lb-cover-line" />
      <p className="lb-cover-subtitle">一个关于秩序、疗愈与生长的目录。</p>
      <p className="lb-cover-author">路俊玲 · 2026</p>
    </div>
    <p className="lb-cover-hint">轻触封面 · 翻开</p>
    <PageNumber current={1} />
  </div>
);

/* ============================================================
   Page 2 · 目录（长滚动列表）
   ============================================================ */
const TocPage: React.FC<{ onPick: (projectIndex: number) => void }> = ({
  onPick,
}) => (
  <div className="lb-page-content lb-index-page">
    <div className="lb-page-vein" />
    <div className="lb-catalog-container">
      <div className="lb-catalog-header">
        <span className="lb-index-label">CONTENTS</span>
        <h2 className="lb-index-title">目录</h2>
        <div className="lb-index-deco" />
        <p className="lb-index-count">共 {projects.length} 件作品 · 上下滚动浏览</p>
      </div>
      <ul className="lb-catalog-list">
        {projects.map((p, i) => (
          <li
            key={p.id}
            className="lb-catalog-item"
            onClick={(e) => {
              e.stopPropagation();
              onPick(i);
            }}
          >
            <span className="lb-catalog-num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="lb-catalog-item-text">
              <span className="lb-catalog-item-title">{p.title}</span>
              <span className="lb-catalog-item-pain">{p.painPoint}</span>
            </div>
            <span className="lb-catalog-arrow">→</span>
          </li>
        ))}
      </ul>
      <p className="lb-catalog-foot">点击任一作品 · 翻到卷首语</p>
    </div>
    <PageNumber current={2} />
  </div>
);

/* ============================================================
   Page 3 · 金句页（卷首语，点击翻到预览页）
   ============================================================ */
const QuotePage: React.FC<{ project: Project; index: number }> = ({
  project,
  index,
}) => (
  <div className="lb-page-content lb-quote-page">
    <div className="lb-page-vein" />
    <div className="lb-quote-wrap">
      <span className="lb-quote-mark">"</span>
      <motion.p
        className="lb-quote-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        {QUOTES[index] ?? "每一页都是新的开始。"}
      </motion.p>
      <span className="lb-quote-mark lb-quote-mark-end">"</span>
      <p className="lb-quote-attribution">— {project.title}</p>
    </div>
    <motion.p
      className="lb-quote-continue"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
    >
      点击继续 · 翻到作品
    </motion.p>
    <PageNumber current={getPageNumber("quote", index)} />
  </div>
);

/* ============================================================
   Page 4 · 作品预览页（截图 + 下一页按钮）
   ============================================================ */
const PreviewPage: React.FC<{
  project: Project;
  index: number;
  onNext: () => void;
  onJump: () => void;
}> = ({ project, index, onNext, onJump }) => (
  <div className="lb-page-content lb-preview-page">
    <div className="lb-page-vein" />
    <div className="lb-preview-grid">
      {/* 左栏 文字 */}
      <div className="lb-preview-text">
        <span className="lb-preview-num">
          No. {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </span>
        <h2 className="lb-preview-title">{project.title}</h2>
        <div className="lb-preview-pain-wrap">
          <span className="lb-preview-pain-bar" />
          <p className="lb-preview-pain">{project.painPoint}</p>
        </div>
        <p className="lb-preview-desc">{project.description}</p>
        {project.tags && project.tags.length > 0 && (
          <div className="lb-preview-tags">
            {project.tags.map((t) => (
              <span key={t} className="lb-preview-tag">{t}</span>
            ))}
          </div>
        )}
        <button
          className="lb-preview-visit"
          onClick={(e) => {
            e.stopPropagation();
            onJump();
          }}
        >
          打开作品 ↗
        </button>
      </div>

      {/* 右栏 截图（点击跳转） */}
      <a
        className="lb-preview-visual"
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.stopPropagation();
          onJump();
        }}
      >
        <img src={project.imageUrl} alt={project.title} className="lb-preview-media" />
        <span className="lb-preview-visual-overlay" />
        <span className="lb-preview-visual-hint">点击访问 ↗</span>
      </a>
    </div>

    {/* 下一页按钮（右下角悬浮） */}
    <button
      className="lb-preview-next-btn"
      onClick={(e) => {
        e.stopPropagation();
        onNext();
      }}
    >
      下一页 →
    </button>

    <PageNumber current={getPageNumber("preview", index)} />
  </div>
);

/* ============================================================
   主组件
   ============================================================ */
interface LeafBookProps {
  registerOpenBook?: (fn: () => void) => void;
}

const LeafBook: React.FC<LeafBookProps> = ({ registerOpenBook }) => {
  const [view, setView] = useState<View>("cover");
  const [direction, setDirection] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flipping, setFlipping] = useState(false);

  const viewRef = useRef<View>("cover");
  const selectedIndexRef = useRef(0);
  const flippingRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  /** 统一的视图切换（带方向 + 翻页锁） */
  const goTo = useCallback(
    (nextView: View, dir: number, opts?: { index?: number }) => {
      if (flippingRef.current) return;
      flippingRef.current = true;
      setFlipping(true);
      setDirection(dir);
      if (opts?.index !== undefined) setSelectedIndex(opts.index);
      setView(nextView);
      window.setTimeout(() => {
        flippingRef.current = false;
        setFlipping(false);
      }, FLIP_MS);
    },
    []
  );

  /** 前进逻辑（点击右半区 / 向左滑动） */
  const goForward = useCallback(() => {
    const cur = viewRef.current;
    if (cur === "cover") {
      goTo("toc", 1);
    } else if (cur === "quote") {
      // 金句页 → 预览页
      goTo("preview", 1);
    } else if (cur === "preview") {
      // 预览页 → 下一个金句页（循环）
      const nextIdx = (selectedIndexRef.current + 1) % projects.length;
      goTo("quote", 1, { index: nextIdx });
    }
  }, [goTo]);

  /** 后退逻辑（点击左半区 / 向右滑动） */
  const goBackward = useCallback(() => {
    const cur = viewRef.current;
    if (cur === "toc") {
      goTo("cover", -1);
    } else if (cur === "quote") {
      goTo("toc", -1);
    } else if (cur === "preview") {
      // 预览页 → 回到金句页
      goTo("quote", -1);
    }
  }, [goTo]);

  /** 点击目录项目 → 金句页 */
  const pickProject = useCallback(
    (index: number) => {
      goTo("quote", 1, { index });
    },
    [goTo]
  );

  /** 预览页 → 打开作品路由（新标签页） */
  const jumpToWork = useCallback(() => {
    const route = ROUTES[selectedIndexRef.current] ?? "/";
    window.open(route, "_blank", "noopener,noreferrer");
  }, []);

  /** 预览页「下一页」→ 下一个金句页（循环） */
  const goNextFromPreview = useCallback(() => {
    const nextIdx = (selectedIndexRef.current + 1) % projects.length;
    goTo("quote", 1, { index: nextIdx });
  }, [goTo]);

  /** 打开书（供 Hero "翻阅我的作品" 调用） */
  const openBook = useCallback(() => {
    if (viewRef.current === "cover") goTo("toc", 1);
    else if (viewRef.current !== "toc") {
      goTo("toc", -1);
    }
  }, [goTo]);

  useEffect(() => {
    if (registerOpenBook) registerOpenBook(openBook);
  }, [registerOpenBook, openBook]);

  /** 点击书页翻页 */
  const handleBookClick = (e: React.MouseEvent) => {
    const cur = viewRef.current;
    if (cur === "cover") {
      goTo("toc", 1);
      return;
    }
    // 金句页 / 预览页：左半后退，右半前进
    if (cur === "quote" || cur === "preview") {
      const rect = e.currentTarget.getBoundingClientRect();
      if (e.clientX - rect.left < rect.width / 2) goBackward();
      else goForward();
      return;
    }
    // 目录：仅左半区后退
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.clientX - rect.left < rect.width / 2) goBackward();
  };

  /** 触摸滑动 */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goForward();
      else goBackward();
    } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      const cur = viewRef.current;
      if (cur === "cover") goTo("toc", 1);
      else if (cur === "quote") goTo("preview", 1);
    }
    touchStartRef.current = null;
  };

  /** 渲染当前视图内容 */
  const renderPage = (): React.ReactNode => {
    if (view === "cover") return <CoverPage />;
    if (view === "toc") return <TocPage onPick={pickProject} />;
    if (view === "quote")
      return <QuotePage project={projects[selectedIndex]} index={selectedIndex} />;
    if (view === "preview")
      return (
        <PreviewPage
          project={projects[selectedIndex]}
          index={selectedIndex}
          onNext={goNextFromPreview}
          onJump={jumpToWork}
        />
      );
    return null;
  };

  const isCover = view === "cover";

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
                key={`${view}-${selectedIndex}`}
                className="lb-page"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: FLIP_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
              >
                {renderPage()}
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

          {/* 合上书 — 仅内容页（封皮不显示） */}
          {!isCover && (
            <button
              className="lb-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                goTo("cover", -1);
              }}
            >
              合上书
            </button>
          )}
        </div>

        {/* 桌面投影 */}
        <div className="lb-desk-shadow" />
      </div>

      {/* 底部翻页提示 */}
      {!isCover && (
        <div className="lb-controls">
          <span className="lb-view-label">
            {view === "toc" && "目录"}
            {view === "quote" && "卷首语"}
            {view === "preview" && `作品预览 · ${selectedIndex + 1} / ${projects.length}`}
          </span>
          <span className="lb-controls-hint">
            {view === "toc" && "上下滚动浏览 · 点击作品进入 · 左侧返回封皮"}
            {view === "quote" && "点击右半翻到作品 · 左侧返回目录"}
            {view === "preview" && "点击截图打开作品 · 下一页翻到下一篇金句"}
          </span>
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
          perspective: 2000px;
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
          left: 0; top: 0; bottom: 0;
          width: 12px;
          background: linear-gradient(to right, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.04) 50%, transparent 100%);
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
          animation: lb-shadow-fade 0.6s ease-out forwards;
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

        /* ===== 页码（右下角，所有页面统一） ===== */
        .lb-page-number {
          position: absolute;
          bottom: 14px;
          right: 18px;
          z-index: 15;
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 11px;
          color: var(--lb-text-soft);
          opacity: 0.5;
          letter-spacing: 0.1em;
          font-variant-numeric: tabular-nums;
          pointer-events: none;
        }
        .lb-page-number-slash {
          opacity: 0.5;
          margin: 0 1px;
        }

        /* ===== 封皮 ===== */
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
        .lb-cover-subtitle {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px;
          color: var(--lb-text-soft);
          margin: 0 0 24px;
          letter-spacing: 0.06em;
          line-height: 1.6;
        }
        .lb-cover-author {
          font-size: 13px;
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

        /* ===== 目录页（长滚动） ===== */
        .lb-index-page { display: flex; }
        .lb-catalog-container {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          scroll-behavior: smooth;
          padding: 40px 36px 60px;
          scrollbar-width: thin;
          scrollbar-color: rgba(184, 140, 106, 0.3) transparent;
        }
        .lb-catalog-container::-webkit-scrollbar { width: 4px; }
        .lb-catalog-container::-webkit-scrollbar-thumb {
          background: rgba(184, 140, 106, 0.3);
          border-radius: 2px;
        }
        .lb-catalog-container::-webkit-scrollbar-track { background: transparent; }

        .lb-catalog-header {
          text-align: center;
          margin-bottom: 28px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(184, 140, 106, 0.15);
        }
        .lb-index-label {
          font-size: 10px;
          letter-spacing: 0.3em;
          color: var(--lb-text-soft);
          opacity: 0.7;
          margin-bottom: 10px;
          display: block;
        }
        .lb-index-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 36px;
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
          margin: 14px auto;
        }
        .lb-index-count {
          font-size: 12px;
          color: var(--lb-text-soft);
          letter-spacing: 0.05em;
          margin: 0;
        }
        .lb-catalog-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .lb-catalog-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: transform 0.28s ease, background 0.28s ease, box-shadow 0.28s ease;
          border: 1px solid transparent;
        }
        .lb-catalog-item:hover {
          transform: translateX(6px);
          background: rgba(184, 140, 106, 0.08);
          border-color: rgba(184, 140, 106, 0.2);
          box-shadow: 0 4px 16px -8px rgba(184, 140, 106, 0.25);
        }
        .lb-catalog-item:active {
          transform: translateX(6px) scale(0.99);
        }
        .lb-catalog-num {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px;
          color: var(--accent);
          opacity: 0.7;
          font-variant-numeric: tabular-nums;
          min-width: 24px;
        }
        .lb-catalog-item-text {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
          min-width: 0;
        }
        .lb-catalog-item-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 16px;
          font-weight: 600;
          color: var(--lb-text);
        }
        .lb-catalog-item-pain {
          font-size: 11px;
          color: var(--lb-text-soft);
          opacity: 0.85;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .lb-catalog-arrow {
          font-size: 14px;
          color: var(--lb-text-soft);
          opacity: 0.5;
          transition: transform 0.28s ease, opacity 0.28s ease, color 0.28s ease;
        }
        .lb-catalog-item:hover .lb-catalog-arrow {
          transform: translateX(4px);
          opacity: 1;
          color: var(--accent);
        }
        .lb-catalog-foot {
          text-align: center;
          font-size: 10px;
          letter-spacing: 0.18em;
          color: var(--lb-text-soft);
          opacity: 0.45;
          margin-top: 24px;
        }

        /* ===== 金句页 ===== */
        .lb-quote-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 50px 44px;
        }
        .lb-quote-wrap {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 320px;
        }
        .lb-quote-mark {
          font-family: Georgia, "Noto Serif SC", serif;
          font-size: 64px;
          line-height: 0.6;
          color: var(--accent);
          opacity: 0.25;
          display: block;
          margin-bottom: 8px;
        }
        .lb-quote-mark-end {
          margin-top: 12px;
          margin-bottom: 0;
        }
        .lb-quote-text {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--lb-text);
          line-height: 1.85;
          letter-spacing: 0.06em;
          margin: 0;
        }
        .lb-quote-attribution {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 13px;
          color: var(--lb-text-soft);
          letter-spacing: 0.1em;
          margin: 18px 0 0;
        }
        .lb-quote-continue {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          letter-spacing: 0.22em;
          color: var(--lb-text-soft);
          opacity: 0.5;
          z-index: 2;
          animation: lb-hint-pulse 2.8s ease-in-out infinite;
        }

        /* ===== 作品预览页（左右分栏） ===== */
        .lb-preview-page { display: flex; }
        .lb-preview-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          width: 100%;
          height: 100%;
        }
        .lb-preview-text {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          padding: 44px 28px 60px;
          border-right: 1px solid rgba(184, 140, 106, 0.14);
          overflow-y: auto;
          scrollbar-width: none;
        }
        .lb-preview-text::-webkit-scrollbar { display: none; }
        .lb-preview-num {
          font-size: 11px;
          letter-spacing: 0.2em;
          color: var(--accent);
          opacity: 0.8;
          margin-bottom: 14px;
          font-variant-numeric: tabular-nums;
        }
        .lb-preview-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 26px;
          font-weight: 700;
          color: var(--lb-text);
          line-height: 1.25;
          margin: 0 0 16px;
          letter-spacing: 0.02em;
        }
        .lb-preview-pain-wrap {
          display: flex;
          align-items: stretch;
          gap: 12px;
          margin-bottom: 16px;
        }
        .lb-preview-pain-bar {
          width: 3px;
          border-radius: 2px;
          background: var(--accent);
          flex-shrink: 0;
          opacity: 0.8;
        }
        .lb-preview-pain {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px;
          font-weight: 600;
          color: var(--accent);
          line-height: 1.55;
          margin: 0;
        }
        .lb-preview-desc {
          font-size: 12px;
          line-height: 1.8;
          color: var(--lb-text-soft);
          margin: 0 0 16px;
        }
        .lb-preview-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }
        .lb-preview-tag {
          font-size: 10px;
          padding: 3px 9px;
          border-radius: 6px;
          background: rgba(184, 140, 106, 0.1);
          color: var(--lb-text-soft);
        }
        .lb-preview-visit {
          margin-top: auto;
          align-self: flex-start;
          font-size: 12px;
          color: var(--accent);
          font-weight: 500;
          padding: 7px 16px;
          border: 1px solid rgba(184, 140, 106, 0.3);
          border-radius: 999px;
          background: transparent;
          cursor: pointer;
          font-family: "Noto Sans SC", sans-serif;
          transition: border-color 0.25s ease, background 0.25s ease;
        }
        .lb-preview-visit:hover {
          border-color: var(--accent);
          background: rgba(184, 140, 106, 0.08);
        }

        /* 右栏 截图 */
        .lb-preview-visual {
          position: relative;
          z-index: 2;
          display: block;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #1a1f1a;
          cursor: pointer;
        }
        .lb-preview-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .lb-preview-visual:hover .lb-preview-media { transform: scale(1.04); }
        .lb-preview-visual-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28));
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .lb-preview-visual:hover .lb-preview-visual-overlay { opacity: 1; }
        .lb-preview-visual-hint {
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

        /* 预览页「下一页」按钮（右下角悬浮） */
        .lb-preview-next-btn {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          padding: 8px 22px;
          font-size: 13px;
          font-family: "Noto Sans SC", sans-serif;
          color: var(--accent);
          font-weight: 500;
          background: rgba(245, 240, 228, 0.85);
          border: 1px solid rgba(184, 140, 106, 0.35);
          border-radius: 999px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          letter-spacing: 0.05em;
          box-shadow: 0 4px 16px -6px rgba(0,0,0,0.15);
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        :root[data-theme="night"] .lb-preview-next-btn {
          background: rgba(42, 48, 40, 0.85);
        }
        .lb-preview-next-btn:hover {
          transform: translateX(-50%) translateY(-2px);
          box-shadow: 0 6px 20px -6px rgba(184, 140, 106, 0.35);
          background: rgba(184, 140, 106, 0.12);
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

        /* 预览页时合上书按钮上移，避开下一页按钮 */
        .lb-preview-page ~ .lb-close-btn,
        .lb-book:has(.lb-preview-page) .lb-close-btn {
          bottom: auto;
          top: 16px;
        }

        /* ===== 底部控制 ===== */
        .lb-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .lb-view-label {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px;
          color: var(--accent);
          font-weight: 600;
          letter-spacing: 0.08em;
        }
        .lb-controls-hint {
          font-size: 11px;
          color: var(--text-soft);
          letter-spacing: 0.05em;
          opacity: 0.7;
        }

        /* ===== 移动端 ===== */
        @media (max-width: 768px) {
          .lb-book {
            width: 300px;
            height: 424px;
            max-height: 68vh;
          }
          .lb-catalog-container { padding: 28px 20px 50px; }
          .lb-index-title { font-size: 26px; }
          .lb-catalog-item { padding: 10px 12px; gap: 10px; }
          .lb-catalog-item-title { font-size: 14px; }
          .lb-catalog-item-pain { font-size: 10px; }
          .lb-catalog-num { font-size: 12px; min-width: 20px; }
          .lb-cover-title { font-size: 30px; }
          .lb-cover-subtitle { font-size: 12px; }
          /* 金句页 */
          .lb-quote-page { padding: 36px 28px; }
          .lb-quote-text { font-size: 17px; line-height: 1.75; }
          .lb-quote-mark { font-size: 48px; }
          /* 预览页：移动端改为上下分栏 */
          .lb-preview-grid { grid-template-columns: 1fr; grid-template-rows: 1.2fr 0.8fr; }
          .lb-preview-text {
            padding: 24px 18px 14px;
            border-right: none;
            border-bottom: 1px solid rgba(184, 140, 106, 0.14);
          }
          .lb-preview-title { font-size: 19px; margin-bottom: 10px; }
          .lb-preview-pain { font-size: 12px; }
          .lb-preview-desc { font-size: 11px; line-height: 1.65; margin-bottom: 10px; }
          .lb-preview-tags { margin-bottom: 10px; }
          .lb-preview-visit { font-size: 11px; padding: 6px 12px; }
          /* 按钮 */
          .lb-close-btn { bottom: 12px; right: 12px; padding: 6px 12px; font-size: 11px; }
          .lb-preview-next-btn { padding: 6px 16px; font-size: 12px; }
          .lb-page-number { font-size: 10px; bottom: 10px; right: 14px; }
        }
      `}</style>
    </div>
  );
};

export default LeafBook;
