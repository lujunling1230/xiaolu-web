import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, type Project } from "../data/projects";

/**
 * LeafBook 树叶书 — 出版级实体书翻阅体验（spread 双页版）
 *
 * 翻页流（每个 spread = 翻开书后看到的双页）：
 *   Spread 0: 封皮（单页）
 *   Spread 1: 目录（自带双页布局）
 *   Spread 2-11: 作品（左=卷首语, 右=详情预览）
 *   Spread 12: 封底（左=colophon, 右=空白）
 *
 * 全书总页数固定 100，制造"厚重典籍"感。
 * 页码公式：
 *   spread 0  → page 1 (cover)
 *   spread 1  → pages 2-3 (toc)
 *   spread i  → pages (2i+1)-(2i+2) for i >= 2
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

/* ===== Spread 定义 ===== */
/** Spread 定义：每个 spread 表示翻开书后看到的双页 */
interface SpreadData {
  id: string;
  left: React.ReactNode;
  right: React.ReactNode;
  leftPageNum?: number;
  rightPageNum?: number;
  isSingle?: boolean; // true for cover, toc, origin
}

/** 页码计算 */
function getSpreadPageNums(spreadIndex: number): { left: number; right: number } {
  // cover = no page number, toc spread = pages 1-2, each project spread = 2 pages
  if (spreadIndex === 0) return { left: 0, right: 0 }; // cover (no page num)
  return { left: spreadIndex * 2 - 1, right: spreadIndex * 2 };
}

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
const PageNumber: React.FC<{ current: number }> = ({ current }) => {
  if (!current) return null;
  return (
    <span className="lb-page-number">
      {String(current).padStart(3, "0")} <span className="lb-page-number-slash">/</span> {TOTAL_PAGES}
    </span>
  );
};

/* ============================================================
   Page 1 · 封皮
   ============================================================ */
const CoverPage: React.FC = () => (
  <div className="lb-page-content lb-cover">
    <div className="lb-cover-vein" />
    <div className="lb-cover-frame" />
    <div className="lb-cover-spine" />
    <div className="lb-cover-inner">
      <div className="lb-cover-leaf-wrap">
        <div className="lb-cover-leaf">
          <LeafIcon size={48} />
        </div>
      </div>
      <h1 className="lb-cover-title">LeafBook</h1>
      <p className="lb-cover-subtitle">路俊玲 · AI 产品实践集</p>
      <p className="lb-cover-year">2026</p>
    </div>
    <p className="lb-cover-hint">轻触封面 · 翻开</p>
  </div>
);

/* ============================================================
   Page 2 · 目录（真实对页书页布局）
   ============================================================ */
const TocPage: React.FC<{ onPick: (projectIndex: number) => void; onClose?: () => void }> = ({
  onPick,
  onClose,
}) => {
  const leftProjects = projects.slice(0, 5);
  const rightProjects = projects.slice(5, 10);
  return (
    <div className="lb-page-content lb-index-page">
      <div className="lb-page-vein" />
      {/* 对页容器 */}
      <div className="lb-spread">
        {/* 左页 */}
        <div className="lb-spread-page lb-spread-left">
          <div className="lb-spread-page-shadow" />
          <div className="lb-spread-inner">
            <header className="lb-spread-header">
              <span className="lb-spread-label">CONTENTS</span>
              <h2 className="lb-spread-title">目录</h2>
              <div className="lb-spread-deco-line" />
            </header>
            <ul className="lb-spread-list">
              {leftProjects.map((p, i) => (
                <motion.li
                  key={p.id}
                  className="lb-spread-item"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
                  onClick={(e) => { e.stopPropagation(); onPick(i); }}
                  whileHover={{ x: 3, transition: { duration: 0.2 } }}
                >
                  <span className="lb-spread-num">{String(i + 1).padStart(2, "0")}</span>
                  <div className="lb-spread-item-body">
                    <span className="lb-spread-item-title">{p.title}</span>
                    <span className="lb-spread-item-sub">{p.painPoint}</span>
                  </div>
                  <span className="lb-spread-item-dot">·</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* 书脊 */}
        <div className="lb-spine-gap">
          <div className="lb-spine-groove" />
        </div>

        {/* 右页 */}
        <div className="lb-spread-page lb-spread-right">
          <div className="lb-spread-page-shadow" />
          <div className="lb-spread-inner">
            <header className="lb-spread-header">
              <span className="lb-spread-label">CONT'D</span>
              <h2 className="lb-spread-title">续</h2>
              <div className="lb-spread-deco-line" />
            </header>
            <ul className="lb-spread-list">
              {rightProjects.map((p, i) => (
                <motion.li
                  key={p.id}
                  className="lb-spread-item"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (i + 5) * 0.08, ease: "easeOut" }}
                  onClick={(e) => { e.stopPropagation(); onPick(i + 5); }}
                  whileHover={{ x: 3, transition: { duration: 0.2 } }}
                >
                  <span className="lb-spread-num">{String(i + 6).padStart(2, "0")}</span>
                  <div className="lb-spread-item-body">
                    <span className="lb-spread-item-title">{p.title}</span>
                    <span className="lb-spread-item-sub">{p.painPoint}</span>
                  </div>
                  <span className="lb-spread-item-dot">·</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 书签式合上书按钮 */}
      {onClose && (
        <motion.button
          className="lb-bookmark-close"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
        >
          <span className="lb-bookmark-ribbon" />
          <span className="lb-bookmark-text">合上书</span>
        </motion.button>
      )}

      <PageNumber current={1} />
    </div>
  );
};

/* ============================================================
   QuotePage — 卷首语（左页）
   ============================================================ */
const QuotePage: React.FC<{ project: Project; index: number }> = ({
  project,
  index,
}) => {
  const pn = getSpreadPageNums(index + 2);
  return (
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
        点击右侧翻页
      </motion.p>
      <PageNumber current={pn.left} />
    </div>
  );
};

/* ============================================================
   PreviewPage — 作品预览页（右页）
   ============================================================ */
const PreviewPage: React.FC<{
  project: Project;
  index: number;
  onNext: () => void;
  onJump: () => void;
}> = ({ project, index, onNext, onJump }) => {
  const pn = getSpreadPageNums(index + 2);
  return (
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

      <PageNumber current={pn.right} />
    </div>
  );
};

/* ============================================================
   OriginPage — 封底内页 / Colophon
   ============================================================ */
const OriginPage: React.FC = () => (
  <div className="lb-page-content lb-origin-page">
    <div className="lb-page-vein" />
    {/* 底部渐变遮罩，增强文字可读性 */}
    <div className="lb-origin-shade" />

    <motion.div
      className="lb-origin-inner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
    >
      <h2 className="lb-origin-title">关于这本 LeafBook</h2>

      <div className="lb-origin-body">
        <p>它不是一本"完成"的书，</p>
        <p>而是一本"正在生长"的笔记。</p>
        <br />
        <p>每一片叶子都独一无二，有着自己的脉络与纹理；</p>
        <p>每一页记录都承载着思考与成长。</p>
        <br />
        <p>叶子会飘落，但落在书页间，便成了永恒的书签。</p>
        <p>愿这些实践与探索，如落叶般自然地沉淀为收获。</p>
      </div>

      <p className="lb-origin-sign">—— 路俊玲 · 2026</p>

      <div className="lb-origin-continued">
        <span className="lb-origin-leaf-icon">🍃</span>
        <span>未完待续 · 敬请期待</span>
      </div>
    </motion.div>

    <PageNumber current={23} />
  </div>
);

/* ============================================================
   BlankPage — 空白装饰页（封底右页）
   ============================================================ */
const BlankPage: React.FC = () => (
  <div className="lb-page-content lb-blank-page">
    <div className="lb-page-vein" />
    <div className="lb-blank-inner">
      <div className="lb-blank-leaf">
        <LeafIcon size={28} />
      </div>
      <p className="lb-blank-text">LeafBook</p>
    </div>
  </div>
);

/* ============================================================
   主组件
   ============================================================ */
interface LeafBookProps {
  registerOpenBook?: (fn: () => void) => void;
  /** ProjectsPage 专用：暴露翻书函数到外部 ref */
  flipTriggerRef?: React.MutableRefObject<(() => void) | null>;
  /** 进入页面后自动翻书的延迟（毫秒），不传则不自动翻 */
  autoFlipDelay?: number;
}

const LeafBook: React.FC<LeafBookProps> = ({ registerOpenBook, flipTriggerRef, autoFlipDelay }) => {
  /* ===== 状态 ===== */
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [flipping, setFlipping] = useState(false);

  const spreadIndexRef = useRef(0);
  const flippingRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    spreadIndexRef.current = spreadIndex;
  }, [spreadIndex]);

  /* ===== 导航函数 ===== */

  /** Navigate to a spread by index */
  const goToSpread = useCallback(
    (targetIndex: number, dir: number) => {
      if (flippingRef.current) return;
      if (targetIndex < 0 || targetIndex >= projects.length + 3) return;
      flippingRef.current = true;
      setFlipping(true);
      setDirection(dir);
      setSpreadIndex(targetIndex);
      window.setTimeout(() => {
        flippingRef.current = false;
        setFlipping(false);
      }, FLIP_MS);
    },
    []
  );

  /** 前进逻辑 */
  const goForward = useCallback(() => {
    const next = spreadIndexRef.current + 1;
    if (next < projects.length + 3) goToSpread(next, 1);
  }, [goToSpread]);

  /** 后退逻辑 */
  const goBackward = useCallback(() => {
    const prev = spreadIndexRef.current - 1;
    if (prev >= 0) goToSpread(prev, -1);
  }, [goToSpread]);

  /** 点击目录项目 → 跳到对应 spread */
  const pickProject = useCallback(
    (projectIndex: number) => {
      // TOC is spread 1, projects start at spread 2
      goToSpread(projectIndex + 2, 1);
    },
    [goToSpread]
  );

  /** 预览页 → 打开作品路由（新标签页） */
  const jumpToWork = useCallback(() => {
    const idx = spreadIndexRef.current;
    const projectIdx = idx <= 1 ? 0 : idx - 2;
    const route = ROUTES[projectIdx] ?? "/";
    window.open(route, "_blank", "noopener,noreferrer");
  }, []);

  /** 打开书（供 Hero "翻阅我的作品" 调用） */
  const openBook = useCallback(() => {
    if (spreadIndexRef.current === 0) goToSpread(1, 1);
    else goToSpread(1, -1);
  }, [goToSpread]);

  /* ===== Build all spreads ===== */
  const spreads = useMemo<SpreadData[]>(() => {
    const result: SpreadData[] = [];

    // Spread 0: Cover (single page)
    result.push({
      id: "cover",
      left: <CoverPage />,
      right: null,
      leftPageNum: 0,
      rightPageNum: 0,
      isSingle: true,
    });

    // Spread 1: TOC (already dual-page internally)
    result.push({
      id: "toc",
      left: <TocPage onPick={pickProject} onClose={() => goToSpread(0, -1)} />,
      right: null, // TocPage already renders both columns internally
      leftPageNum: 2,
      rightPageNum: 3,
      isSingle: true, // toc manages its own dual-page layout
    });

    // Spreads 2-11: Projects (quote left, preview right)
    projects.forEach((project, index) => {
      const pn = getSpreadPageNums(index + 2);
      result.push({
        id: `project-${index}`,
        left: <QuotePage project={project} index={index} />,
        right: <PreviewPage project={project} index={index} onNext={goForward} onJump={jumpToWork} />,
        leftPageNum: pn.left,
        rightPageNum: pn.right,
        isSingle: false,
      });
    });

    // Last spread: Origin (left) + blank (right)
    const lastPn = getSpreadPageNums(projects.length + 2);
    result.push({
      id: "origin",
      left: <OriginPage />,
      right: <BlankPage />,
      leftPageNum: lastPn.left,
      rightPageNum: lastPn.right,
      isSingle: false,
    });

    return result;
  }, [pickProject, goToSpread, goForward, jumpToWork]);

  /* ===== Derived values ===== */
  const selectedIndex = spreadIndex <= 1 ? 0 : spreadIndex - 2;
  const currentSpread = spreads[spreadIndex] ?? spreads[0];

  /* ===== Effects ===== */
  useEffect(() => {
    if (registerOpenBook) registerOpenBook(openBook);
  }, [registerOpenBook, openBook]);

  /* ProjectsPage 专用：暴露翻书函数 */
  useEffect(() => {
    if (flipTriggerRef) {
      flipTriggerRef.current = openBook;
    }
  }, [flipTriggerRef, openBook]);

  /* 自动翻书延迟 */
  useEffect(() => {
    if (autoFlipDelay !== undefined) {
      const timer = setTimeout(() => {
        openBook();
      }, autoFlipDelay);
      return () => clearTimeout(timer);
    }
  }, [autoFlipDelay, openBook]);

  /* ===== 事件处理 ===== */

  /** 点击书页翻页 */
  const handleBookClick = (e: React.MouseEvent) => {
    if (spreadIndexRef.current === 0) {
      goToSpread(1, 1);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.clientX - rect.left < rect.width / 2) goBackward();
    else goForward();
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
      if (spreadIndexRef.current === 0) goToSpread(1, 1);
      else {
        const rect = e.currentTarget.getBoundingClientRect();
        const touchX = touchStartRef.current.x;
        if (touchX - rect.left < rect.width / 2) goBackward();
        else goForward();
      }
    }
    touchStartRef.current = null;
  };

  /* ===== 渲染 ===== */

  /** Render current spread (dual pages) */
  const renderSpread = (): React.ReactNode => {
    const spread = spreads[spreadIndex];
    if (!spread) return null;

    if (spread.isSingle || !spread.right) {
      // Single page (cover, toc, origin)
      return spread.left;
    }

    // Dual page spread: left + right
    return (
      <div className="lb-spread-container">
        <div className="lb-spread-half lb-spread-half-left">
          {spread.left}
        </div>
        <div className="lb-spine-gap">
          <div className="lb-spine-groove" />
        </div>
        <div className="lb-spread-half lb-spread-half-right">
          {spread.right}
        </div>
      </div>
    );
  };

  const isSinglePage = currentSpread?.isSingle ?? true;
  const isToc = spreadIndex === 1;
  const isCover = spreadIndex === 0;
  const isOrigin = spreadIndex === spreads.length - 1;

  return (
    <div className={`lb-wrapper ${isToc ? "lb-wrapper-spread" : ""} ${!isSinglePage ? "lb-wrapper-spread" : ""}`}>
      <div className="lb-book-stand">
        <div
          className={`lb-book ${!isSinglePage ? "lb-book-spread" : ""} ${isToc ? "lb-book-spread" : ""}`}
          onClick={handleBookClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 书脊阴影 */}
          <div className="lb-spine-shadow" />

          {/* Pages */}
          <div className="lb-pages-container">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={spreadIndex}
                className="lb-page"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: FLIP_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
              >
                {renderSpread()}
              </motion.div>
            </AnimatePresence>

            {flipping && (
              <div className={`lb-flip-shadow ${direction > 0 ? "lb-flip-shadow-fwd" : "lb-flip-shadow-bwd"}`} />
            )}
          </div>

          {!isCover && !isToc && (
            <button
              className="lb-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                goToSpread(0, -1);
              }}
            >
              合上书
            </button>
          )}
        </div>

        <div className="lb-desk-shadow" />
      </div>

      {/* Controls hint */}
      {!isCover && (
        <div className="lb-controls">
          <span className="lb-view-label">
            {isToc && "目录"}
            {!isSinglePage && !isCover && !isToc && !isOrigin && `作品 · ${selectedIndex + 1} / ${projects.length}`}
            {isOrigin && "封底"}
          </span>
          <span className="lb-controls-hint">
            {isToc && "点击作品进入 · 左侧返回封皮 · 右侧进入作品"}
            {!isSinglePage && "左页卷首语 · 右页详情 · 点击两侧翻页"}
            {isOrigin && "最后一页 · 左侧返回"}
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
        .lb-book-spread ~ .lb-desk-shadow {
          width: 1100px;
          max-width: 88vw;
          height: 28px;
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

        /* ===== 双页展开容器（卷首语+详情） ===== */
        .lb-spread-container {
          display: flex;
          width: 100%;
          height: 100%;
          position: relative;
        }
        .lb-spread-half {
          flex: 1;
          position: relative;
          overflow: hidden;
          min-width: 0;
          background: var(--lb-page-bg, #F5F0E4);
        }
        /* Ensure page-content fills the half properly */
        .lb-spread-half > .lb-page-content {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        /* 左半页：书脊内侧阴影 + 外缘暗角 */
        .lb-spread-half-left {
          border-radius: 4px 0 0 4px;
          box-shadow:
            inset -12px 0 24px -10px rgba(0,0,0,0.08),
            inset 0 0 60px rgba(0,0,0,0.02),
            2px 0 8px -4px rgba(0,0,0,0.06);
        }
        .lb-spread-half-left::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
          background: linear-gradient(to right,
            rgba(0,0,0,0.04) 0%,
            rgba(0,0,0,0.01) 6%,
            transparent 15%,
            transparent 85%,
            rgba(0,0,0,0.03) 94%,
            rgba(0,0,0,0.07) 100%
          );
        }
        /* 右半页：书脊内侧阴影 + 外缘暗角 */
        .lb-spread-half-right {
          border-radius: 0 10px 10px 0;
          box-shadow:
            inset 12px 0 24px -10px rgba(0,0,0,0.06),
            inset 0 0 60px rgba(0,0,0,0.02),
            -2px 0 8px -4px rgba(0,0,0,0.04);
        }
        .lb-spread-half-right::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
          background: linear-gradient(to left,
            rgba(0,0,0,0.04) 0%,
            rgba(0,0,0,0.01) 6%,
            transparent 15%,
            transparent 85%,
            rgba(0,0,0,0.03) 94%,
            rgba(0,0,0,0.05) 100%
          );
        }
        /* 夜间模式双页阴影加深 */
        :root[data-theme="night"] .lb-spread-half-left {
          box-shadow:
            inset -12px 0 24px -10px rgba(0,0,0,0.18),
            inset 0 0 60px rgba(0,0,0,0.06),
            2px 0 8px -4px rgba(0,0,0,0.12);
        }
        :root[data-theme="night"] .lb-spread-half-left::after {
          background: linear-gradient(to right,
            rgba(0,0,0,0.15) 0%,
            rgba(0,0,0,0.05) 6%,
            transparent 15%,
            transparent 85%,
            rgba(0,0,0,0.08) 94%,
            rgba(0,0,0,0.18) 100%
          );
        }
        :root[data-theme="night"] .lb-spread-half-right {
          box-shadow:
            inset 12px 0 24px -10px rgba(0,0,0,0.14),
            inset 0 0 60px rgba(0,0,0,0.06),
            -2px 0 8px -4px rgba(0,0,0,0.08);
        }
        :root[data-theme="night"] .lb-spread-half-right::after {
          background: linear-gradient(to left,
            rgba(0,0,0,0.15) 0%,
            rgba(0,0,0,0.05) 6%,
            transparent 15%,
            transparent 85%,
            rgba(0,0,0,0.06) 94%,
            rgba(0,0,0,0.12) 100%
          );
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

        /* ===== 封皮（立体书籍感） ===== */
        .lb-cover {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--lb-page-bg, #F5F0E4);
          border-radius: 2px 6px 6px 2px;
          padding: 60px 40px;
          position: relative;
          /* 立体透视：微微倾斜，斜靠桌面 */
          transform: perspective(1200px) rotateX(1.5deg) rotateY(-2deg);
          transform-origin: left center;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          /* 多层阴影：书本阴影 + 环境光 */
          box-shadow:
            0 20px 40px rgba(0,0,0,0.12),
            0 0 60px rgba(0,0,0,0.04),
            2px 2px 8px rgba(0,0,0,0.06);
          /* 微弱的纸张凹陷感 */
          box-shadow:
            inset 0 0 30px rgba(0,0,0,0.02),
            0 20px 40px rgba(0,0,0,0.12),
            0 0 60px rgba(0,0,0,0.04);
        }
        /* 悬停：阴影加深，旋转微调 */
        .lb-cover:hover {
          transform: perspective(1200px) rotateX(0.5deg) rotateY(-0.5deg);
          box-shadow:
            inset 0 0 30px rgba(0,0,0,0.02),
            0 28px 56px rgba(0,0,0,0.16),
            0 0 80px rgba(0,0,0,0.06);
        }
        :root[data-theme="night"] .lb-cover {
          background: var(--lb-page-bg);
        }
        /* 叶脉纹理（极淡） */
        .lb-cover-vein {
          position: absolute;
          inset: 0;
          background-image: url("${LEAF_VEIN_TEXTURE}");
          opacity: 0.06;
          z-index: 0;
          border-radius: inherit;
          pointer-events: none;
        }
        /* 内框装饰线 */
        .lb-cover-frame {
          position: absolute;
          inset: 20px;
          border: 1px solid rgba(120, 130, 100, 0.12);
          border-radius: 4px;
          pointer-events: none;
          z-index: 1;
        }
        /* 书脊效果（左侧深色渐变） */
        .lb-cover-spine {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 14px;
          background: linear-gradient(to right,
            rgba(60, 50, 35, 0.10) 0%,
            rgba(60, 50, 35, 0.04) 40%,
            transparent 100%
          );
          z-index: 1;
          pointer-events: none;
          border-radius: 2px 0 0 2px;
        }
        .lb-cover-inner {
          position: relative;
          text-align: center;
          z-index: 2;
          width: 100%;
          max-width: 540px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        /* 叶子图标容器 */
        .lb-cover-leaf-wrap {
          margin-bottom: 24px;
        }
        .lb-cover-leaf {
          display: flex;
          justify-content: center;
          color: #2E4037;
          opacity: 0.75;
          animation: lb-cover-leaf-float 3.5s ease-in-out infinite;
          filter: drop-shadow(0 2px 4px rgba(46, 64, 55, 0.15));
        }
        :root[data-theme="night"] .lb-cover-leaf {
          color: #6a8a6a;
          filter: drop-shadow(0 2px 4px rgba(106, 138, 106, 0.15));
        }
        @keyframes lb-cover-leaf-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        /* 主标题 */
        .lb-cover-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 52px;
          font-weight: 700;
          color: #2d3436;
          margin: 0 0 12px;
          letter-spacing: 1px;
          line-height: 1.1;
          text-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }
        :root[data-theme="night"] .lb-cover-title {
          color: #e8e8e8;
          text-shadow: none;
        }
        /* 副标题 */
        .lb-cover-subtitle {
          font-size: 16px;
          font-weight: 400;
          color: #5A6B5C;
          margin: 0 0 36px;
          letter-spacing: 0.06em;
          line-height: 1.5;
        }
        :root[data-theme="night"] .lb-cover-subtitle {
          color: #8a9a7c;
        }
        /* 年份（右下角藏书章风格） */
        .lb-cover-year {
          font-size: 12px;
          font-weight: 300;
          color: #999;
          letter-spacing: 0.1em;
          align-self: flex-end;
          margin-top: auto;
          font-family: "Noto Serif SC", Georgia, serif;
        }
        :root[data-theme="night"] .lb-cover-year {
          color: #555;
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

        /* ===== 目录页（真实对页书页） ===== */
        .lb-wrapper.lb-wrapper-spread {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .lb-book.lb-book-spread {
          width: 1200px;
          max-width: 92vw;
          height: 750px;
          max-height: 85vh;
          border-radius: 6px 14px 14px 6px;
          box-shadow:
            0 4px 24px -4px rgba(40, 35, 25, 0.2),
            0 24px 60px -12px rgba(60, 50, 35, 0.3),
            inset 6px 0 16px -6px rgba(0,0,0,0.12);
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s ease;
        }
        .lb-index-page {
          display: flex;
          background: transparent;
        }

        /* 对页容器 */
        .lb-spread {
          position: relative;
          z-index: 1;
          display: flex;
          width: 100%;
          height: 100%;
          padding: 8px 12px;
          gap: 0;
        }
        /* 单页 */
        .lb-spread-page {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          background: var(--lb-page-bg, #F5F0E4);
          overflow: hidden;
        }
        .lb-spread-left {
          border-radius: 4px 0 0 4px;
          box-shadow:
            inset -8px 0 20px -10px rgba(0,0,0,0.08),
            2px 0 8px -4px rgba(0,0,0,0.06);
        }
        .lb-spread-right {
          border-radius: 0 10px 10px 0;
          box-shadow:
            inset 8px 0 20px -10px rgba(0,0,0,0.06),
            -2px 0 8px -4px rgba(0,0,0,0.04);
        }
        /* 页面卷曲阴影 */
        .lb-spread-page-shadow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }
        .lb-spread-left .lb-spread-page-shadow {
          background: linear-gradient(to right,
            rgba(0,0,0,0.04) 0%,
            rgba(0,0,0,0.01) 6%,
            transparent 12%,
            transparent 88%,
            rgba(0,0,0,0.03) 94%,
            rgba(0,0,0,0.08) 100%
          );
        }
        .lb-spread-right .lb-spread-page-shadow {
          background: linear-gradient(to left,
            rgba(0,0,0,0.04) 0%,
            rgba(0,0,0,0.01) 6%,
            transparent 12%,
            transparent 88%,
            rgba(0,0,0,0.03) 94%,
            rgba(0,0,0,0.06) 100%
          );
        }
        :root[data-theme="night"] .lb-spread-left .lb-spread-page-shadow {
          background: linear-gradient(to right,
            rgba(0,0,0,0.15) 0%,
            rgba(0,0,0,0.05) 6%,
            transparent 12%,
            transparent 88%,
            rgba(0,0,0,0.08) 94%,
            rgba(0,0,0,0.18) 100%
          );
        }
        :root[data-theme="night"] .lb-spread-right .lb-spread-page-shadow {
          background: linear-gradient(to left,
            rgba(0,0,0,0.15) 0%,
            rgba(0,0,0,0.05) 6%,
            transparent 12%,
            transparent 88%,
            rgba(0,0,0,0.06) 94%,
            rgba(0,0,0,0.12) 100%
          );
        }
        /* 书脊间隙 */
        .lb-spine-gap {
          width: 48px;
          flex-shrink: 0;
          display: flex;
          align-items: stretch;
          justify-content: center;
          position: relative;
          z-index: 3;
        }
        .lb-spine-groove {
          width: 2px;
          height: 100%;
          background: linear-gradient(to bottom,
            transparent 0%,
            rgba(120, 100, 70, 0.15) 10%,
            rgba(120, 100, 70, 0.25) 50%,
            rgba(120, 100, 70, 0.15) 90%,
            transparent 100%
          );
          box-shadow:
            -1px 0 2px rgba(255,255,255,0.3),
            1px 0 2px rgba(0,0,0,0.08);
        }
        :root[data-theme="night"] .lb-spine-groove {
          background: linear-gradient(to bottom,
            transparent 0%,
            rgba(0,0,0,0.3) 10%,
            rgba(0,0,0,0.5) 50%,
            rgba(0,0,0,0.3) 90%,
            transparent 100%
          );
          box-shadow:
            -1px 0 2px rgba(255,255,255,0.05),
            1px 0 2px rgba(0,0,0,0.2);
        }
        /* 内边距区域 */
        .lb-spread-inner {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          padding: 40px 32px 56px;
          height: 100%;
          overflow: hidden;
        }
        .lb-spread-right .lb-spread-inner {
          padding: 40px 36px 56px 28px;
        }
        /* 页眉 */
        .lb-spread-header {
          text-align: center;
          margin-bottom: 28px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(140, 110, 80, 0.1);
          position: relative;
        }
        .lb-spread-header::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 1px;
          background: rgba(140, 110, 80, 0.25);
        }
        .lb-spread-label {
          font-size: 9px;
          letter-spacing: 0.35em;
          color: var(--lb-text-soft);
          opacity: 0.5;
          margin-bottom: 10px;
          display: block;
          font-family: "Noto Serif SC", Georgia, serif;
        }
        .lb-spread-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 32px;
          font-weight: 700;
          color: #4a3f2e;
          letter-spacing: 0.12em;
          margin: 0;
          line-height: 1.2;
        }
        :root[data-theme="night"] .lb-spread-title {
          color: #c9bfb0;
        }
        .lb-spread-deco-line {
          width: 32px;
          height: 1px;
          background: rgba(140, 110, 80, 0.35);
          margin: 12px auto 0;
        }
        /* 列表 */
        .lb-spread-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(140, 110, 80, 0.15) transparent;
        }
        .lb-spread-list::-webkit-scrollbar { width: 3px; }
        .lb-spread-list::-webkit-scrollbar-thumb {
          background: rgba(140, 110, 80, 0.15);
          border-radius: 2px;
        }
        .lb-spread-list::-webkit-scrollbar-track { background: transparent; }
        /* 每一项 */
        .lb-spread-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 10px;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.25s ease;
          border-radius: 4px;
          border-bottom: 1px solid rgba(140, 110, 80, 0.06);
          position: relative;
        }
        .lb-spread-item:last-child {
          border-bottom: none;
        }
        .lb-spread-item:hover {
          background: rgba(140, 110, 80, 0.04);
          transform: translateY(-1px);
        }
        .lb-spread-item:active {
          transform: translateY(0) scale(0.995);
        }
        /* 序号 - 页码风格 */
        .lb-spread-num {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 11px;
          color: rgba(140, 110, 80, 0.5);
          font-variant-numeric: tabular-nums;
          min-width: 22px;
          padding-top: 2px;
          letter-spacing: 0.04em;
          font-weight: 600;
        }
        :root[data-theme="night"] .lb-spread-num {
          color: rgba(180, 170, 150, 0.4);
        }
        /* 文字区域 */
        .lb-spread-item-body {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
          min-width: 0;
        }
        .lb-spread-item-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px;
          font-weight: 600;
          color: #3d3528;
          line-height: 1.4;
          letter-spacing: 0.02em;
        }
        :root[data-theme="night"] .lb-spread-item-title {
          color: #d4c9b8;
        }
        .lb-spread-item-sub {
          font-size: 11px;
          color: rgba(140, 110, 80, 0.55);
          line-height: 1.45;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 400;
        }
        :root[data-theme="night"] .lb-spread-item-sub {
          color: rgba(180, 170, 150, 0.4);
        }
        /* 装饰点 */
        .lb-spread-item-dot {
          font-size: 20px;
          color: rgba(140, 110, 80, 0.25);
          line-height: 1;
          padding-top: 2px;
          transition: color 0.25s ease, transform 0.25s ease;
          font-weight: 300;
        }
        .lb-spread-item:hover .lb-spread-item-dot {
          color: rgba(140, 110, 80, 0.6);
          transform: scale(1.2);
        }
        :root[data-theme="night"] .lb-spread-item-dot {
          color: rgba(180, 170, 150, 0.2);
        }
        :root[data-theme="night"] .lb-spread-item:hover .lb-spread-item-dot {
          color: rgba(180, 170, 150, 0.5);
        }

        /* 书签式合上书按钮 — 右上角 */
        .lb-bookmark-close {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.12));
          transition: filter 0.25s ease;
        }
        .lb-bookmark-close:hover {
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.18));
        }
        .lb-bookmark-ribbon {
          width: 28px;
          height: 40px;
          background: linear-gradient(180deg, #a08060 0%, #8a6d4f 100%);
          clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%);
          position: relative;
          display: block;
          transform: rotate(2deg);
        }
        :root[data-theme="night"] .lb-bookmark-ribbon {
          background: linear-gradient(180deg, #6a5540 0%, #544332 100%);
        }
        .lb-bookmark-ribbon::after {
          content: "";
          position: absolute;
          inset: 2px;
          background: linear-gradient(180deg, #b89470 0%, #9a7b5a 100%);
          clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%);
          opacity: 0.5;
        }
        :root[data-theme="night"] .lb-bookmark-ribbon::after {
          background: linear-gradient(180deg, #7a6350 0%, #63503e 100%);
        }
        .lb-bookmark-text {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 11px;
          color: #5a4a38;
          margin-top: 6px;
          letter-spacing: 0.08em;
          writing-mode: horizontal-tb;
        }
        :root[data-theme="night"] .lb-bookmark-text {
          color: #b0a08c;
        }

        /* ===== 封底内页 ===== */
        .lb-origin-page {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--lb-page-bg, #F5F0E4);
          position: relative;
        }
        /* 极淡的竖向渐变遮罩，增强文字可读性 */
        .lb-origin-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.35) 30%,
            rgba(255,255,255,0.35) 70%,
            rgba(255,255,255,0) 100%
          );
          z-index: 1;
          pointer-events: none;
        }
        .lb-origin-inner {
          position: relative;
          z-index: 2;
          max-width: 520px;
          padding: 40px 48px;
          text-align: left;
        }
        .lb-origin-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 22px;
          font-weight: 500;
          color: #3A4F3A;
          margin: 0 0 28px;
          letter-spacing: 0.04em;
        }
        :root[data-theme="night"] .lb-origin-title {
          color: #8a9a7a;
        }
        .lb-origin-body {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px;
          line-height: 1.8;
          color: #4A5A4A;
          margin: 0 0 32px;
        }
        :root[data-theme="night"] .lb-origin-body {
          color: #b0b8a8;
        }
        .lb-origin-body p {
          margin: 0 0 0.8em;
        }
        .lb-origin-body br {
          display: block;
          content: "";
          margin-top: 1em;
        }
        .lb-origin-sign {
          text-align: right;
          font-style: italic;
          font-size: 14px;
          color: #5A6B5C;
          margin: 0 0 40px;
          font-family: "Noto Serif SC", Georgia, serif;
        }
        :root[data-theme="night"] .lb-origin-sign {
          color: #8a9a7a;
        }
        .lb-origin-continued {
          text-align: center;
          font-size: 13px;
          font-weight: 300;
          color: #5A6B5C;
          opacity: 0.7;
          letter-spacing: 0.06em;
          font-family: "Noto Sans SC", system-ui, sans-serif;
        }
        :root[data-theme="night"] .lb-origin-continued {
          color: #8a9a7a;
        }
        /* 浮动动画 */
        .lb-origin-leaf-icon {
          display: inline-block;
          margin-right: 6px;
          animation: lb-leaf-float 3s ease-in-out infinite;
        }
        @keyframes lb-leaf-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        /* ===== 空白装饰页（封底右页） ===== */
        .lb-blank-page {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--lb-page-bg);
        }
        .lb-blank-inner {
          text-align: center;
          opacity: 0.25;
        }
        .lb-blank-leaf {
          color: var(--lb-text-soft);
          margin-bottom: 8px;
        }
        .lb-blank-text {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px;
          color: var(--lb-text-soft);
          letter-spacing: 0.12em;
          margin: 0;
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
          .lb-book.lb-book-spread {
            width: 340px;
            max-width: 92vw;
            height: 520px;
            max-height: 72vh;
          }
          /* 目录对页：移动端改为单页堆叠 */
          .lb-spread {
            flex-direction: column;
            padding: 6px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(140, 110, 80, 0.15) transparent;
          }
          .lb-spread::-webkit-scrollbar { width: 3px; }
          .lb-spread::-webkit-scrollbar-thumb {
            background: rgba(140, 110, 80, 0.15);
            border-radius: 2px;
          }
          .lb-spread-page {
            border-radius: 6px;
            margin-bottom: 8px;
            box-shadow: 0 2px 8px -2px rgba(0,0,0,0.1);
          }
          .lb-spread-left {
            border-radius: 6px;
            box-shadow: inset 0 -4px 12px -6px rgba(0,0,0,0.06), 0 2px 6px -2px rgba(0,0,0,0.08);
          }
          .lb-spread-right {
            border-radius: 6px;
            box-shadow: inset 0 4px 12px -6px rgba(0,0,0,0.06), 0 2px 6px -2px rgba(0,0,0,0.08);
          }
          .lb-spine-gap { display: none; }
          .lb-spread-inner {
            padding: 20px 18px 32px;
          }
          .lb-spread-right .lb-spread-inner {
            padding: 20px 18px 32px;
          }
          .lb-spread-header {
            margin-bottom: 16px;
            padding-bottom: 12px;
          }
          .lb-spread-title { font-size: 22px; }
          .lb-spread-item { padding: 10px 8px; gap: 10px; }
          .lb-spread-item-title { font-size: 13px; }
          .lb-spread-item-sub { font-size: 10px; }
          .lb-spread-num { font-size: 10px; min-width: 20px; }
          .lb-bookmark-close {
            top: auto;
            bottom: 12px;
            right: 14px;
          }
          .lb-bookmark-ribbon {
            width: 28px;
            height: 38px;
          }
          .lb-bookmark-text {
            font-size: 10px;
            margin-top: 4px;
          }
          .lb-cover {
            padding: 40px 20px;
            transform: perspective(1200px) rotateX(0.5deg) rotateY(-1deg);
            box-shadow:
              inset 0 0 20px rgba(0,0,0,0.02),
              0 12px 24px rgba(0,0,0,0.10),
              0 0 40px rgba(0,0,0,0.03);
          }
          .lb-cover:hover {
            transform: perspective(1200px) rotateX(0deg) rotateY(0deg);
          }
          .lb-cover-title { font-size: 36px; }
          .lb-cover-subtitle { font-size: 15px; margin-bottom: 24px; }
          .lb-cover-leaf-wrap { margin-bottom: 16px; }
          .lb-cover-intro { font-size: 13px; max-width: 100%; padding: 0 8px; margin-bottom: 20px; }
          .lb-cover-year { font-size: 11px; }
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
          /* 起名来源页移动端 */
          .lb-origin-title { font-size: 20px; margin-bottom: 20px; }
          .lb-origin-inner { padding: 32px 24px; max-width: 100%; }
          .lb-origin-body { font-size: 14px; }
          .lb-origin-sign { font-size: 13px; margin-bottom: 32px; }
          .lb-origin-continued { font-size: 12px; }
          /* 按钮 */
          .lb-close-btn { bottom: 12px; right: 12px; padding: 6px 12px; font-size: 11px; }
          .lb-page-number { font-size: 10px; bottom: 10px; right: 14px; }
          /* 双页展开容器：移动端改为单列 */
          .lb-spread-container {
            flex-direction: column;
          }
          .lb-spread-half {
            border-radius: 6px;
            margin-bottom: 8px;
            box-shadow: 0 2px 8px -2px rgba(0,0,0,0.1);
          }
          .lb-spread-half:last-child {
            margin-bottom: 0;
          }
          .lb-spread-half-left,
          .lb-spread-half-right {
            box-shadow: inset 0 0 30px rgba(0,0,0,0.02), 0 2px 8px -2px rgba(0,0,0,0.1);
          }
          .lb-spread-half-left::after,
          .lb-spread-half-right::after {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default LeafBook;
