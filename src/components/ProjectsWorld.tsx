import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useView } from "../context/ViewContext";

/**
 * ProjectsWorld 子世界 —— 树下立体书
 *
 * 概念：在树下展开一本巨大的立体书，每一页是一个项目。
 * 全屏场景（无导航栏单页森林世界的子页面），独立背景与内容，
 * 通过 useView().back() 返回森林主世界。
 *
 * 结构：
 * - 背景：树荫斑驳光影（径向渐变）+ 泥土/苔绿地面 + 大树干轮廓 + 飘落叶片
 * - 中心：一本打开的大书（CSS 3D Transform）
 *   · 左右两页 + 中央书脊阴影 + 底部厚度阴影
 *   · 书页叶脉纹理（opacity 0.05）
 *   · 翻页：点击右下角→下一页（rotateY 0→-180），左下角→上一页
 *   · 页码指示 "1 / 2"
 * - 入场：书从中心放大展开（scale 0.5→1, rotateY -90→0），300ms
 * - 返回：左上角"合上书"按钮 或 点击书外区域 → 合上动画 → back()
 *
 * 所有自定义 CSS 内联在文件末尾 <style>，不依赖 index.css 新增类。
 */

// 项目数据（同步自 Projects.tsx）
interface ProjectTag {
  label: string;
  type: "tech" | "emotion";
}
interface Project {
  id: number;
  name: string;
  subtitle: string;
  tech: string;
  description: string;
  tags: ProjectTag[];
  image: string;
  link: string;
}

const projects: Project[] = [
  {
    id: 1,
    name: "智能手环商城",
    subtitle: "Smart Band E-Commerce",
    tech: "SpringBoot",
    description:
      "基于 SpringBoot 的智能手环电商平台，覆盖商品浏览、购物车、订单、支付的电商全链路。独立撰写 PRD 文档并完成数据库表结构设计，包含用户、商品、订单、支付等核心模块。",
    tags: [
      { label: "PRD 撰写", type: "tech" },
      { label: "数据库设计", type: "tech" },
      { label: "电商全链路", type: "tech" },
      { label: "SpringBoot", type: "tech" },
    ],
    image:
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&h=400&fit=crop",
    link: "#",
  },
  {
    id: 2,
    name: "Mindful Corner",
    subtitle: "AI 疗愈室",
    tech: "AI · 情感化交互",
    description:
      "探索 AI 在情绪健康领域的应用，包含感恩日记、冥想引导、疗愈播客三大模块。以情感化交互设计为核心，让 AI 成为温柔的情绪陪伴者，体现 Human-Centric AI 理念。",
    tags: [
      { label: "感恩日记", type: "emotion" },
      { label: "冥想引导", type: "emotion" },
      { label: "播客", type: "emotion" },
      { label: "情感化 AI", type: "emotion" },
    ],
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop",
    link: "#lab",
  },
];

/* ============================================
   1. 叶脉纹理 —— 书页背景（极淡）
   ============================================ */
const LeafVeinsBg: React.FC = () => (
  <svg
    className="pw-veins"
    viewBox="0 0 200 300"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="100" y1="15" x2="100" y2="285" stroke="var(--pw-vein)" strokeWidth="1.2" />
    <path d="M100 45 Q72 50 42 68"  stroke="var(--pw-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 85 Q68 90 32 112" stroke="var(--pw-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 130 Q62 135 28 162" stroke="var(--pw-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 175 Q65 180 35 205" stroke="var(--pw-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 45 Q128 50 158 68"  stroke="var(--pw-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 85 Q132 90 168 112" stroke="var(--pw-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 130 Q138 135 172 162" stroke="var(--pw-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 175 Q135 180 165 205" stroke="var(--pw-vein)" strokeWidth="0.7" fill="none" />
  </svg>
);

/* ============================================
   2. 单页内容 —— 项目图片 / 标题 / 描述 / 标签
   ============================================ */
const PageContent: React.FC<{ project: Project }> = ({ project }) => (
  <div className="pw-page-content">
    <div className="pw-page-image">
      <img src={project.image} alt={project.name} loading="lazy" />
      <div className="pw-page-image-mask" />
      <span className="pw-tech-badge">{project.tech}</span>
    </div>
    <h3 className="pw-page-title">{project.name}</h3>
    <p className="pw-page-subtitle">{project.subtitle}</p>
    <p className="pw-page-desc">{project.description}</p>
    <div className="pw-tags">
      {project.tags.map((t) => (
        <span key={t.label} className={`pw-tag ${t.type}`}>
          {t.label}
        </span>
      ))}
    </div>
  </div>
);

/* ============================================
   3. 飘落叶片 —— 背景装饰
   ============================================ */
const fallingLeaves = [
  { left: "12%", size: 18, delay: 0,  dur: 9,  color: "#c8a05a" },
  { left: "28%", size: 14, delay: 3,  dur: 11, color: "#9CAF88" },
  { left: "52%", size: 20, delay: 1.5,dur: 10, color: "#b88c6a" },
  { left: "71%", size: 16, delay: 4,  dur: 12, color: "#9CAF88" },
  { left: "88%", size: 13, delay: 2,  dur: 9.5,color: "#c8a05a" },
];

const FallingLeaves: React.FC = () => (
  <div className="pw-leaves" aria-hidden>
    {fallingLeaves.map((l, i) => (
      <span
        key={i}
        className="pw-leaf"
        style={{
          left: l.left,
          ["--leaf-size" as string]: `${l.size}px`,
          ["--leaf-dur" as string]: `${l.dur}s`,
          ["--leaf-delay" as string]: `${l.delay}s`,
          background: l.color,
        }}
      />
    ))}
  </div>
);

/* ============================================
   4. 主组件
   ============================================ */
const ProjectsWorld: React.FC = () => {
  const { back } = useView();
  const [currentPage, setCurrentPage] = useState(0);
  // phase: idle（静止）/ flipping（翻转中）/ snapping（无过渡瞬切回 0）
  const [phase, setPhase] = useState<"idle" | "flipping" | "snapping">("idle");
  const [flipDir, setFlipDir] = useState<1 | -1>(1);
  const [exiting, setExiting] = useState(false);

  const total = projects.length;
  const busy = phase !== "idle";
  const current = projects[currentPage];
  const targetIndex = flipDir === 1 ? currentPage + 1 : currentPage - 1;
  const target = projects[targetIndex] ?? current;

  // 下一页：书页翻转 0 → -180，背面显示目标项目；结束后瞬切回 0（正面已更新）
  const nextPage = () => {
    if (currentPage >= total - 1 || busy || exiting) return;
    setFlipDir(1);
    setPhase("flipping");
    window.setTimeout(() => {
      setCurrentPage((p) => p + 1);
      setPhase("snapping"); // 关闭过渡，瞬切回 rotateY(0)
      window.setTimeout(() => setPhase("idle"), 60); // 下一帧恢复过渡
    }, 760);
  };

  // 上一页：书页翻转 0 → 180
  const prevPage = () => {
    if (currentPage <= 0 || busy || exiting) return;
    setFlipDir(-1);
    setPhase("flipping");
    window.setTimeout(() => {
      setCurrentPage((p) => p - 1);
      setPhase("snapping");
      window.setTimeout(() => setPhase("idle"), 60);
    }, 760);
  };

  // 合上书 → 返回森林
  const handleClose = () => {
    if (busy || exiting) return;
    setExiting(true);
    window.setTimeout(() => back(), 420);
  };

  return (
    <motion.section
      className="projects-world-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 背景层：树荫斑驳光影 */}
      <div className="pw-bg" />
      {/* 噪点 */}
      <svg className="pw-noise" xmlns="http://www.w3.org/2000/svg">
        <filter id="pw-turb">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#pw-turb)" />
      </svg>

      {/* 顶部大树干轮廓 */}
      <svg
        className="pw-tree-top"
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMin slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 树冠光斑 */}
        <ellipse cx="300" cy="40" rx="260" ry="120" fill="var(--pw-canopy)" />
        <ellipse cx="1100" cy="30" rx="300" ry="130" fill="var(--pw-canopy)" />
        <ellipse cx="720" cy="60" rx="340" ry="140" fill="var(--pw-canopy)" opacity="0.85" />
        {/* 下垂枝干 */}
        <path d="M640 0 Q630 80 660 160 Q670 200 690 240" stroke="var(--pw-trunk)" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.55" />
        <path d="M820 0 Q840 70 810 150 Q800 190 780 230" stroke="var(--pw-trunk)" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.5" />
        <path d="M480 0 Q470 60 490 120" stroke="var(--pw-trunk)" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.4" />
        <path d="M980 0 Q990 60 970 120" stroke="var(--pw-trunk)" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.4" />
      </svg>

      {/* 飘落叶片 */}
      <FallingLeaves />

      {/* 书外点击区（点击合上书）—— 包裹整页但书体阻止冒泡 */}
      <div className="pw-outside-click" onClick={handleClose} data-clickable aria-hidden />

      {/* 左上角"合上书"按钮 */}
      <button className="pw-close-btn" onClick={handleClose} data-clickable aria-label="合上书，回到森林">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 5h6a2 2 0 0 1 2 2v12a1.5 1.5 0 0 0-1.5-1.5H4z" strokeLinejoin="round" />
          <path d="M20 5h-6a2 2 0 0 0-2 2v12a1.5 1.5 0 0 1 1.5-1.5H20z" strokeLinejoin="round" />
        </svg>
        <span>合上书</span>
      </button>

      {/* 书本舞台 */}
      <div className="pw-book-stage">
        <motion.div
          className="pw-book"
          initial={{ rotateY: -90, scale: 0.5, opacity: 0 }}
          animate={
            exiting
              ? { rotateY: 90, scale: 0.5, opacity: 0 }
              : { rotateY: 0, scale: 1, opacity: 1 }
          }
          transition={{ duration: exiting ? 0.4 : 0.3, ease: "easeInOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 书脊阴影 */}
          <div className="pw-spine" />
          {/* 书页叶脉纹理 */}
          <LeafVeinsBg />

          {/* 翻页叶片（双面） */}
          <div
            className={`pw-page-leaf ${phase === "snapping" ? "pw-snapping" : ""}`}
            style={{
              transform:
                phase === "flipping"
                  ? `rotateY(${flipDir === 1 ? -180 : 180}deg)`
                  : "rotateY(0deg)",
            }}
          >
            {/* 正面：当前项目 */}
            <div className="pw-face pw-face-front">
              <PageContent project={current} />
            </div>
            {/* 背面：目标项目 */}
            <div className="pw-face pw-face-back">
              <PageContent project={target} />
            </div>
          </div>

          {/* 书的厚度（底部侧面阴影） */}
          <div className="pw-book-edge" />

          {/* 翻页控制 */}
          <button
            className="pw-nav pw-nav-prev"
            onClick={prevPage}
            disabled={currentPage === 0 || busy}
            aria-label="上一页"
            data-clickable
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="pw-nav pw-nav-next"
            onClick={nextPage}
            disabled={currentPage === total - 1 || busy}
            aria-label="下一页"
            data-clickable
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* 页码指示 —— 翻页时数字淡入淡出 */}
          <div className="pw-page-indicator">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentPage}
                className="pw-page-indicator-num"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {currentPage + 1} / {total}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <p className="pw-hint">翻开书页，阅读每一段成长 · 点击书外合上返回</p>

      <style>{`
        /* ===== 主题变量（日/夜） ===== */
        .projects-world-scene {
          --pw-bg-1: #e8ddc8;
          --pw-bg-2: #c2b896;
          --pw-bg-3: #9ca882;
          --pw-ground: #8a7a5a;
          --pw-canopy: rgba(120, 150, 100, 0.55);
          --pw-trunk: #6b5340;
          --pw-vein: rgba(90, 110, 90, 0.08);
          --pw-book-bg: #fffdf9;
          --pw-book-border: rgba(184, 140, 106, 0.3);
          --pw-text: #3d3d3d;
          --pw-body: #5a5a5a;
          --pw-accent: #b88c6a;
          --pw-shadow: 0 30px 70px -25px rgba(60, 45, 25, 0.55);
        }
        [data-theme="night"] .projects-world-scene {
          --pw-bg-1: #14122a;
          --pw-bg-2: #1a2436;
          --pw-bg-3: #0d1a16;
          --pw-ground: #1e2a22;
          --pw-canopy: rgba(40, 60, 50, 0.6);
          --pw-trunk: #4a3a2a;
          --pw-vein: rgba(148, 163, 184, 0.08);
          --pw-book-bg: #1e293b;
          --pw-book-border: rgba(148, 163, 184, 0.28);
          --pw-text: #e8edf2;
          --pw-body: #cbd5e1;
          --pw-accent: #c9a87a;
          --pw-shadow: 0 30px 70px -25px rgba(0, 0, 0, 0.7);
        }

        /* ===== 场景 ===== */
        .projects-world-scene {
          position: fixed; inset: 0; z-index: 20;
          overflow: hidden;
          font-family: "Noto Sans SC", system-ui, sans-serif;
        }
        .pw-bg {
          position: absolute; inset: 0; z-index: 0;
          background:
            radial-gradient(circle at 22% 18%, rgba(255,250,220,0.55), transparent 30%),
            radial-gradient(circle at 75% 22%, rgba(255,245,200,0.4), transparent 32%),
            radial-gradient(circle at 50% 80%, rgba(140,120,80,0.25), transparent 45%),
            linear-gradient(180deg, var(--pw-bg-1) 0%, var(--pw-bg-2) 55%, var(--pw-bg-3) 100%);
        }
        .pw-noise {
          position: absolute; inset: 0; z-index: 0;
          width: 100%; height: 100%;
          opacity: 0.05; pointer-events: none; mix-blend-mode: overlay;
        }
        .pw-tree-top {
          position: absolute; top: 0; left: 0; z-index: 0;
          width: 100%; height: 30vh; pointer-events: none;
        }

        /* 飘落叶片 */
        .pw-leaves { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .pw-leaf {
          position: absolute; top: -40px;
          width: var(--leaf-size, 16px); height: calc(var(--leaf-size, 16px) * 1.3);
          border-radius: 0 100% 0 100%;
          opacity: 0.7;
          animation: pw-leaf-fall var(--leaf-dur, 10s) linear var(--leaf-delay, 0s) infinite;
          filter: drop-shadow(0 2px 3px rgba(60,45,25,0.2));
        }
        @keyframes pw-leaf-fall {
          0%   { transform: translateY(-40px) rotate(0deg);   opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(105vh) rotate(540deg); opacity: 0; }
        }

        /* 书外点击区 */
        .pw-outside-click {
          position: absolute; inset: 0; z-index: 1;
          cursor: pointer;
        }

        /* 合上书按钮 */
        .pw-close-btn {
          position: absolute; top: 24px; left: 24px; z-index: 6;
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px;
          font-size: 12px; letter-spacing: 0.05em;
          color: var(--pw-body);
          background: rgba(255, 253, 249, 0.7);
          border: 1px solid var(--pw-book-border);
          border-radius: 999px;
          backdrop-filter: blur(6px);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        [data-theme="night"] .pw-close-btn { background: rgba(30,41,59,0.7); }
        .pw-close-btn:hover {
          color: var(--pw-accent);
          border-color: var(--pw-accent);
          transform: translateX(-2px);
        }

        /* ===== 书本舞台 ===== */
        .pw-book-stage {
          position: absolute; inset: 0; z-index: 2;
          display: flex; align-items: center; justify-content: center;
          padding: 70px 20px 60px;
          perspective: 2200px;
        }
        .pw-book {
          position: relative;
          width: min(720px, 92vw);
          height: min(520px, 74vh);
          background: var(--pw-book-bg);
          border: 1px solid var(--pw-book-border);
          border-radius: 6px 14px 14px 6px;
          box-shadow: var(--pw-shadow);
          transform-style: preserve-3d;
        }

        /* 书脊（中央阴影） */
        .pw-spine {
          position: absolute; top: 0; bottom: 0; left: 50%;
          width: 26px; transform: translateX(-50%);
          background: linear-gradient(90deg, transparent, rgba(90,70,50,0.18) 35%, rgba(90,70,50,0.28) 50%, rgba(90,70,50,0.18) 65%, transparent);
          pointer-events: none; z-index: 3;
        }
        /* 叶脉纹理 */
        .pw-veins {
          position: absolute; inset: 0; width: 100%; height: 100%;
          opacity: 0.05; pointer-events: none; z-index: 1;
        }

        /* 翻页叶片 —— 双面 3D */
        .pw-page-leaf {
          position: absolute; inset: 0; z-index: 2;
          transform-style: preserve-3d;
          transform-origin: center center;
          transition: transform 0.76s cubic-bezier(0.45, 0, 0.25, 1);
          will-change: transform;
        }
        /* 瞬切阶段：关闭过渡，避免回翻可见 */
        .pw-page-leaf.pw-snapping { transition: none !important; }
        .pw-face {
          position: absolute; inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          padding: 30px 34px 56px;
          box-sizing: border-box;
        }
        .pw-face-front { transform: rotateY(0deg); }
        .pw-face-back  { transform: rotateY(180deg); }

        /* 单页内容 */
        .pw-page-content {
          width: 100%; max-width: 560px;
          display: flex; flex-direction: column; align-items: center;
          text-align: center;
        }
        .pw-page-image {
          position: relative;
          width: 100%; height: 150px;
          border-radius: 12px; overflow: hidden;
          margin-bottom: 16px;
          box-shadow: 0 8px 18px -8px rgba(60,45,25,0.4);
        }
        .pw-page-image img { width: 100%; height: 100%; object-fit: cover; }
        .pw-page-image-mask {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.22), transparent 50%);
        }
        .pw-tech-badge {
          position: absolute; top: 10px; left: 10px;
          padding: 4px 10px; font-size: 11px;
          color: var(--pw-accent);
          background: rgba(255,253,249,0.88);
          border: 1px solid rgba(184,140,106,0.2);
          border-radius: 999px;
        }
        [data-theme="night"] .pw-tech-badge { background: rgba(30,41,59,0.88); }
        .pw-page-title {
          font-family: "Noto Serif SC", serif;
          font-size: 22px; font-weight: 700;
          margin: 0 0 2px;
          color: var(--pw-text);
        }
        .pw-page-subtitle {
          font-size: 11px; letter-spacing: 0.1em;
          color: var(--pw-accent);
          margin: 0 0 12px;
        }
        .pw-page-desc {
          font-size: 13px; line-height: 1.75;
          color: var(--pw-body);
          margin: 0 0 14px;
          max-width: 480px;
        }
        .pw-tags { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
        .pw-tag {
          padding: 5px 12px; font-size: 11px;
          border-radius: 999px; border: 1px solid transparent;
        }
        .pw-tag.tech {
          color: #4a6b5a; background: rgba(90,138,122,0.14); border-color: rgba(90,138,122,0.25);
        }
        .pw-tag.emotion {
          color: #9c6a4a; background: rgba(184,140,106,0.14); border-color: rgba(184,140,106,0.25);
        }
        [data-theme="night"] .pw-tag.tech { color: #9fc7b0; }
        [data-theme="night"] .pw-tag.emotion { color: #d4b196; }

        /* 书的厚度（底部侧面） */
        .pw-book-edge {
          position: absolute; left: 6px; right: 14px; bottom: -8px;
          height: 10px;
          background: linear-gradient(180deg, #e0d2bc, #b89a72);
          border-radius: 0 0 8px 8px;
          box-shadow: 0 6px 14px -6px rgba(60,45,25,0.4);
          z-index: 0;
        }
        [data-theme="night"] .pw-book-edge {
          background: linear-gradient(180deg, #2a3a4a, #1a2230);
        }

        /* 翻页按钮 */
        .pw-nav {
          position: absolute; bottom: 14px; z-index: 5;
          width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          color: var(--pw-accent);
          background: rgba(255,253,249,0.7);
          border: 1px solid var(--pw-book-border);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        [data-theme="night"] .pw-nav { background: rgba(30,41,59,0.7); }
        .pw-nav:hover:not(:disabled) {
          background: var(--pw-accent); color: #fff;
          transform: translateY(-2px);
        }
        .pw-nav:disabled { opacity: 0.3; cursor: not-allowed; }
        .pw-nav-prev { left: 14px; }
        .pw-nav-next { right: 14px; }

        /* 页码 */
        .pw-page-indicator {
          position: absolute; bottom: 22px; left: 50%;
          transform: translateX(-50%);
          z-index: 5;
          font-size: 12px; letter-spacing: 0.15em;
          color: var(--pw-body); opacity: 0.7;
          font-family: "Noto Serif SC", serif;
        }

        /* 提示 */
        .pw-hint {
          position: absolute; bottom: 16px; left: 50%;
          transform: translateX(-50%);
          z-index: 4; margin: 0;
          font-size: 11px; letter-spacing: 0.08em;
          color: var(--pw-body); opacity: 0.55;
          pointer-events: none; text-align: center; white-space: nowrap;
        }

        /* ===== 响应式 ===== */
        @media (max-width: 768px) {
          .pw-book { height: min(560px, 80vh); }
          .pw-face { padding: 22px 18px 50px; }
          .pw-page-image { height: 120px; }
          .pw-page-title { font-size: 18px; }
          .pw-page-desc { font-size: 12px; line-height: 1.7; }
          .pw-tag { font-size: 10px; padding: 4px 9px; }
          .pw-hint { font-size: 10px; white-space: normal; width: 80%; }
          .pw-close-btn { top: 14px; left: 14px; }
          .pw-leaf { animation-duration: calc(var(--leaf-dur, 10s) * 0.8); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pw-leaf { animation: none; opacity: 0.4; }
          .pw-page-leaf { transition: none; }
        }
      `}</style>
    </motion.section>
  );
};

export default ProjectsWorld;
