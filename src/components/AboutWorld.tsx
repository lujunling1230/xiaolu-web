import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useView } from "../context/ViewContext";
import { useTheme } from "../context/ThemeContext";
import { aboutPages, type AboutPage } from "../data/about";

/**
 * AboutWorld 子世界 —— 生命之书
 *
 * 概念：在树下展开一本"生命之书"，六页翻阅关于"我"的故事。
 * 与 ProjectsWorld 立体书风格统一：phase 三态翻页 + 双面 3D 叶片。
 * 通过 useView().back() 返回森林主世界；useTheme() 联动昼夜氛围光。
 *
 * 结构：
 * - 背景：暖纸渐变 + 噪点 + 叶脉 + 角落日光/月华（useTheme）
 * - 中心：一本翻开的书（CSS 3D），六页不同内容
 *   · PageRenderer 按 page.type 渲染：cover / intro / background / hobbies / contact / backcover
 * - 翻页：phase idle/flipping/snapping，叶片 rotateY 0→-180 / 0→180
 * - 页码 "1 / 6"，上一页 / 下一页按钮
 * - 合上书（右上角）或点击书外 → 合上动画 → back()
 *
 * 视觉：暖黄纸张 #FDFBF5（日）/ 深蓝灰（夜，CSS 变量 + data-theme），
 *      黑白线条插画 + 陶土棕点缀，微噪点 + 柔和阴影。
 * 所有自定义 CSS 内联在文件末尾 <style>，类名 aw- 前缀。
 */

/* ============================================
   1. 叶脉纹理 —— 书页 / 封面背景装饰（极淡）
   ============================================ */
const LeafVeinsBg: React.FC = () => (
  <svg
    className="aw-veins"
    viewBox="0 0 200 300"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="100" y1="15" x2="100" y2="285" stroke="var(--aw-vein)" strokeWidth="1.2" />
    <path d="M100 45 Q72 50 42 68" stroke="var(--aw-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 85 Q68 90 32 112" stroke="var(--aw-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 130 Q62 135 28 162" stroke="var(--aw-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 175 Q65 180 35 205" stroke="var(--aw-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 45 Q128 50 158 68" stroke="var(--aw-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 85 Q132 90 168 112" stroke="var(--aw-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 130 Q138 135 172 162" stroke="var(--aw-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 175 Q135 180 165 205" stroke="var(--aw-vein)" strokeWidth="0.7" fill="none" />
  </svg>
);

/* ============================================
   2. 爱好 SVG 插画 —— 黑白线条 + 陶土棕点缀
   ============================================ */
const HobbyIllustration: React.FC<{ icon: string }> = ({ icon }) => {
  switch (icon) {
    /* —— 阅读：打开的书 + 长出小树 —— */
    case "book":
      return (
        <svg viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 80 Q37 70 60 74 L60 88 Q37 84 14 92 Z"
            fill="var(--aw-accent-soft)"
            stroke="var(--aw-ink)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M60 74 Q83 70 106 80 L106 92 Q83 84 60 88 Z"
            fill="var(--aw-accent-soft)"
            stroke="var(--aw-ink)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M22 82 Q38 76 56 79" stroke="var(--aw-ink)" strokeWidth="0.8" opacity="0.5" />
          <path d="M64 79 Q82 76 98 82" stroke="var(--aw-ink)" strokeWidth="0.8" opacity="0.5" />
          <path d="M60 74 L60 44" stroke="var(--aw-ink)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="60" cy="34" r="11" fill="none" stroke="var(--aw-accent)" strokeWidth="2" />
          <circle cx="48" cy="40" r="7" fill="none" stroke="var(--aw-accent)" strokeWidth="2" />
          <circle cx="72" cy="40" r="7" fill="none" stroke="var(--aw-accent)" strokeWidth="2" />
          <path d="M60 23 q3 -5 6 0" stroke="var(--aw-accent)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );

    /* —— 自然：蜿蜒小路 + 远山 —— */
    case "nature":
      return (
        <svg viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="94" cy="26" r="9" fill="var(--aw-accent-soft)" stroke="var(--aw-accent)" strokeWidth="1.6" />
          <path
            d="M6 72 L34 38 L52 60 L70 30 L92 58 L114 72 Z"
            fill="var(--aw-accent-soft)"
            stroke="var(--aw-ink)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M28 46 L34 38 L40 46" stroke="var(--aw-ink)" strokeWidth="1" opacity="0.6" />
          <path d="M64 38 L70 30 L76 38" stroke="var(--aw-ink)" strokeWidth="1" opacity="0.6" />
          <path d="M4 96 L116 96" stroke="var(--aw-ink)" strokeWidth="1.2" opacity="0.7" />
          <path
            d="M60 96 Q44 84 58 76 Q72 68 56 60"
            stroke="var(--aw-accent)"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="1 5"
          />
          <path d="M22 96 L22 80 M22 80 q-5 -8 0 -14 q5 6 0 14" stroke="var(--aw-ink)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </svg>
      );

    /* —— 摄影：复古相机 —— */
    case "camera":
      return (
        <svg viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="16" y="44" width="88" height="48" rx="8" fill="var(--aw-accent-soft)" stroke="var(--aw-ink)" strokeWidth="1.8" />
          <rect x="44" y="34" width="24" height="12" rx="3" fill="var(--aw-accent-soft)" stroke="var(--aw-ink)" strokeWidth="1.6" />
          <circle cx="88" cy="40" r="4" fill="none" stroke="var(--aw-ink)" strokeWidth="1.6" />
          <circle cx="60" cy="68" r="18" fill="none" stroke="var(--aw-ink)" strokeWidth="1.8" />
          <circle cx="60" cy="68" r="11" fill="none" stroke="var(--aw-accent)" strokeWidth="1.8" />
          <circle cx="60" cy="68" r="5" fill="var(--aw-accent-soft)" stroke="var(--aw-accent)" strokeWidth="1.4" />
          <path d="M55 64 Q58 62 62 63" stroke="#fff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
          <circle cx="22" cy="48" r="2" stroke="var(--aw-ink)" strokeWidth="1.2" fill="none" />
          <circle cx="98" cy="48" r="2" stroke="var(--aw-ink)" strokeWidth="1.2" fill="none" />
        </svg>
      );

    /* —— 咖啡：冒热气杯子（热气 CSS 动画） —— */
    case "coffee":
      return (
        <svg viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g className="aw-steam">
            <path d="M48 38 Q42 30 48 22 Q54 14 48 6" stroke="var(--aw-ink)" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
            <path d="M60 40 Q54 32 60 24 Q66 16 60 8" stroke="var(--aw-ink)" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
            <path d="M72 38 Q66 30 72 22 Q78 14 72 6" stroke="var(--aw-ink)" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
          </g>
          <path
            d="M34 48 L36 86 Q36 92 42 92 L78 92 Q84 92 84 86 L86 48 Z"
            fill="var(--aw-accent-soft)"
            stroke="var(--aw-ink)"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <ellipse cx="60" cy="48" rx="26" ry="5" fill="var(--aw-accent-soft)" stroke="var(--aw-ink)" strokeWidth="1.8" />
          <ellipse cx="60" cy="49" rx="22" ry="3.4" fill="var(--aw-accent)" opacity="0.55" />
          <path d="M86 56 Q98 58 98 68 Q98 78 86 78" stroke="var(--aw-ink)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M26 96 Q60 102 94 96" stroke="var(--aw-ink)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </svg>
      );

    /* —— 音乐：五线谱 + 音符（音符 CSS 动画跳动） —— */
    case "music":
      return (
        <svg viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="var(--aw-ink)" strokeWidth="1" opacity="0.65">
            <line x1="10" y1="42" x2="110" y2="42" />
            <line x1="10" y1="52" x2="110" y2="52" />
            <line x1="10" y1="62" x2="110" y2="62" />
            <line x1="10" y1="72" x2="110" y2="72" />
            <line x1="10" y1="82" x2="110" y2="82" />
          </g>
          <path d="M24 86 Q16 76 24 66 Q34 58 28 46 Q22 40 28 34" stroke="var(--aw-accent)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="24" cy="86" r="3" fill="var(--aw-accent)" />
          <g className="aw-notes">
            <g>
              <ellipse cx="50" cy="70" rx="6" ry="4.5" fill="var(--aw-ink)" transform="rotate(-18 50 70)" />
              <line x1="55" y1="68" x2="55" y2="42" stroke="var(--aw-ink)" strokeWidth="1.8" />
            </g>
            <g>
              <ellipse cx="74" cy="62" rx="6" ry="4.5" fill="var(--aw-ink)" transform="rotate(-18 74 62)" />
              <line x1="79" y1="60" x2="79" y2="34" stroke="var(--aw-ink)" strokeWidth="1.8" />
              <path d="M79 34 Q88 38 86 50" stroke="var(--aw-ink)" strokeWidth="1.8" fill="none" />
            </g>
            <g>
              <ellipse cx="96" cy="74" rx="6" ry="4.5" fill="var(--aw-accent)" transform="rotate(-18 96 74)" />
              <line x1="101" y1="72" x2="101" y2="46" stroke="var(--aw-accent)" strokeWidth="1.8" />
            </g>
          </g>
        </svg>
      );

    default:
      return null;
  }
};

/* ============================================
   3. 联系方式图标
   ============================================ */
const ContactIcon: React.FC<{ type: "email" | "github" | "linkedin" }> = ({ type }) => {
  if (type === "email") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "github") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    );
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
};

/* ============================================
   4. 封面装饰 —— 叶枝分隔线
   ============================================ */
const LeafSprig: React.FC = () => (
  <svg className="aw-sprig" viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 10 L52 10" stroke="var(--aw-border)" strokeWidth="1" />
    <path d="M68 10 L114 10" stroke="var(--aw-border)" strokeWidth="1" />
    <path d="M60 4 q-7 6 0 12 q7 -6 0 -12 Z" fill="var(--aw-accent)" opacity="0.45" />
    <path d="M60 4 L60 16" stroke="var(--aw-accent)" strokeWidth="0.8" />
  </svg>
);

/* ============================================
   5. 各页内容渲染
   ============================================ */

/* P1 封面 */
const CoverPage: React.FC<{ page: AboutPage }> = ({ page }) => (
  <div className="aw-cover">
    <LeafSprig />
    <h1 className="aw-cover-name">{page.title}</h1>
    <p className="aw-cover-subtitle">{page.subtitle}</p>
    <div className="aw-cover-line" />
    <p className="aw-cover-slogan">{page.content}</p>
    <LeafSprig />
  </div>
);

/* P2 简介 —— 首字下沉 */
const IntroPage: React.FC<{ page: AboutPage }> = ({ page }) => (
  <div className="aw-intro">
    <h2 className="aw-page-heading">为何做产品</h2>
    <p className="aw-intro-text">{page.content}</p>
  </div>
);

/* P3 背景 —— 时间轴 */
const BackgroundPage: React.FC<{ page: AboutPage }> = ({ page }) => (
  <div className="aw-background">
    <h2 className="aw-page-heading">成长轨迹</h2>
    <div className="aw-timeline">
      {page.timeline?.map((node, i) => (
        <div className="aw-tl-node" key={i}>
          <div className="aw-tl-badge">{i + 1}</div>
          <div className="aw-tl-content">
            <span className="aw-tl-period">{node.period}</span>
            <h3 className="aw-tl-title">{node.title}</h3>
            <p className="aw-tl-desc">{node.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* P4 爱好 —— SVG 插画网格 */
const HobbiesPage: React.FC<{ page: AboutPage }> = ({ page }) => (
  <div className="aw-hobbies">
    <h2 className="aw-page-heading">心之所向</h2>
    <div className="aw-hobbies-grid">
      {page.hobbies?.map((h, i) => (
        <div className="aw-hobby-card" key={i}>
          <div className="aw-hobby-art">
            <HobbyIllustration icon={h.icon} />
          </div>
          <h3 className="aw-hobby-name">{h.name}</h3>
          <p className="aw-hobby-desc">{h.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

/* P5 联系 —— 火漆印章 */
const ContactPage: React.FC<{ page: AboutPage }> = ({ page }) => (
  <div className="aw-contact">
    <h2 className="aw-page-heading">保持联系</h2>
    <div className="aw-seals">
      {page.contacts?.map((c, i) => (
        <a
          className="aw-seal-card"
          href={c.link}
          key={i}
          target={c.type === "email" ? undefined : "_blank"}
          rel={c.type === "email" ? undefined : "noopener noreferrer"}
          data-clickable
        >
          <span className="aw-seal">
            <span className="aw-seal-icon">
              <ContactIcon type={c.type} />
            </span>
            <span className="aw-seal-label">{c.label}</span>
          </span>
          <span className="aw-seal-value">{c.value}</span>
        </a>
      ))}
    </div>
  </div>
);

/* P6 封底 */
const BackCoverPage: React.FC<{ page: AboutPage }> = ({ page }) => (
  <div className="aw-backcover">
    <svg className="aw-star" width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2 L14.2 9 L21.5 9 L15.6 13.4 L17.8 20.5 L12 16.1 L6.2 20.5 L8.4 13.4 L2.5 9 L9.8 9 Z"
        fill="var(--aw-accent)"
        opacity="0.85"
        strokeLinejoin="round"
      />
    </svg>
    <p className="aw-ending">{page.ending}</p>
    <p className="aw-theend">The End?</p>
  </div>
);

/* 页面分发器 */
const PageRenderer: React.FC<{ page: AboutPage }> = ({ page }) => {
  switch (page.type) {
    case "cover":
      return <CoverPage page={page} />;
    case "intro":
      return <IntroPage page={page} />;
    case "background":
      return <BackgroundPage page={page} />;
    case "hobbies":
      return <HobbiesPage page={page} />;
    case "contact":
      return <ContactPage page={page} />;
    case "backcover":
      return <BackCoverPage page={page} />;
    default:
      return null;
  }
};

/* ============================================
   6. 主组件
   ============================================ */
const AboutWorld: React.FC = () => {
  const { back } = useView();
  const { isNight } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  // phase: idle（静止）/ flipping（翻转中）/ snapping（无过渡瞬切回 0）
  const [phase, setPhase] = useState<"idle" | "flipping" | "snapping">("idle");
  const [flipDir, setFlipDir] = useState<1 | -1>(1);
  const [exiting, setExiting] = useState(false);

  const total = aboutPages.length;
  const busy = phase !== "idle";
  const current = aboutPages[currentPage];
  const targetIndex = flipDir === 1 ? currentPage + 1 : currentPage - 1;
  const target = aboutPages[targetIndex] ?? current;

  // 下一页：叶片 0 → -180，背面显示目标页；结束后瞬切回 0（正面已更新）
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

  // 上一页：叶片 0 → 180
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
      className="about-world-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 背景层：暖纸渐变 */}
      <div className="aw-bg" />
      {/* 噪点 */}
      <svg className="aw-noise" xmlns="http://www.w3.org/2000/svg">
        <filter id="aw-turb">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#aw-turb)" />
      </svg>

      {/* 角落日光 / 月华 —— useTheme 联动 */}
      <div className="aw-celestial" aria-hidden>
        {isNight ? (
          <svg width="58" height="58" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="16" fill="#f5efd9" opacity="0.85" />
            <circle cx="40" cy="28" r="16" fill="var(--aw-bg-1)" />
            <circle cx="32" cy="32" r="21" fill="none" stroke="#f5efd9" strokeWidth="0.6" opacity="0.4" />
          </svg>
        ) : (
          <svg width="66" height="66" viewBox="0 0 72 72" fill="none">
            <circle cx="36" cy="36" r="15" fill="#fff3c4" opacity="0.9" />
            <circle cx="36" cy="36" r="21" fill="none" stroke="#fff3c4" strokeWidth="0.8" opacity="0.5" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
              <line
                key={d}
                x1="36"
                y1="9"
                x2="36"
                y2="14"
                stroke="#fff3c4"
                strokeWidth="1.5"
                strokeLinecap="round"
                transform={`rotate(${d} 36 36)`}
              />
            ))}
          </svg>
        )}
      </div>

      {/* 书外点击区（点击合上书）—— 包裹整页但书体阻止冒泡 */}
      <div className="aw-outside-click" onClick={handleClose} data-clickable aria-hidden />

      {/* 右上角"合上书"按钮 */}
      <button className="aw-close-btn" onClick={handleClose} data-clickable aria-label="合上书，回到森林">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 5h6a2 2 0 0 1 2 2v12a1.5 1.5 0 0 0-1.5-1.5H4z" strokeLinejoin="round" />
          <path d="M20 5h-6a2 2 0 0 0-2 2v12a1.5 1.5 0 0 1 1.5-1.5H20z" strokeLinejoin="round" />
        </svg>
        <span>合上书</span>
      </button>

      {/* 书本舞台 */}
      <div className="aw-book-stage">
        <motion.div
          className="aw-book"
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
          <div className="aw-spine" />
          {/* 书页叶脉纹理 */}
          <LeafVeinsBg />

          {/* 翻页叶片（双面 3D） */}
          <div
            className={`aw-page-leaf ${phase === "snapping" ? "aw-snapping" : ""}`}
            style={{
              transform:
                phase === "flipping"
                  ? `rotateY(${flipDir === 1 ? -180 : 180}deg)`
                  : "rotateY(0deg)",
            }}
          >
            {/* 正面：当前页 */}
            <div className="aw-face aw-face-front">
              <PageRenderer page={current} />
            </div>
            {/* 背面：目标页 */}
            <div className="aw-face aw-face-back">
              <PageRenderer page={target} />
            </div>
          </div>

          {/* 书的厚度（底部侧面阴影） */}
          <div className="aw-book-edge" />

          {/* 翻页控制 */}
          <button
            className="aw-nav aw-nav-prev"
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
            className="aw-nav aw-nav-next"
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
          <div className="aw-page-indicator">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentPage}
                className="aw-page-indicator-num"
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

      <p className="aw-hint">翻开生命之书，阅读每一页故事 · 点击书外合上返回</p>

      <style>{`
        /* ===== 主题变量（日 / 夜） ===== */
        .about-world-scene {
          --aw-bg-1: #efe6d2;
          --aw-bg-2: #e3d6b8;
          --aw-bg-3: #cdbf9c;
          --aw-paper: #fdfbf5;
          --aw-paper-2: #f7f1e3;
          --aw-ink: #3d3d3d;
          --aw-body: #5a5a5a;
          --aw-accent: #b88c6a;
          --aw-accent-soft: rgba(184, 140, 106, 0.14);
          --aw-border: rgba(184, 140, 106, 0.3);
          --aw-vein: rgba(120, 90, 60, 0.1);
          --aw-shadow: 0 30px 70px -25px rgba(90, 70, 50, 0.5);
        }
        [data-theme="night"] .about-world-scene {
          --aw-bg-1: #14122a;
          --aw-bg-2: #1a2436;
          --aw-bg-3: #0d1a16;
          --aw-paper: #1e293b;
          --aw-paper-2: #243349;
          --aw-ink: #d8dde5;
          --aw-body: #cbd5e1;
          --aw-accent: #c9a87a;
          --aw-accent-soft: rgba(201, 168, 122, 0.16);
          --aw-border: rgba(148, 163, 184, 0.28);
          --aw-vein: rgba(148, 163, 184, 0.1);
          --aw-shadow: 0 30px 70px -25px rgba(0, 0, 0, 0.7);
        }

        /* ===== 场景 ===== */
        .about-world-scene {
          position: fixed; inset: 0; z-index: 20;
          overflow: hidden;
          font-family: "Noto Sans SC", system-ui, sans-serif;
        }
        .aw-bg {
          position: absolute; inset: 0; z-index: 0;
          background:
            radial-gradient(circle at 26% 20%, rgba(255, 250, 220, 0.5), transparent 32%),
            radial-gradient(circle at 76% 24%, rgba(255, 245, 200, 0.35), transparent 34%),
            radial-gradient(circle at 50% 82%, rgba(140, 120, 80, 0.2), transparent 46%),
            linear-gradient(180deg, var(--aw-bg-1) 0%, var(--aw-bg-2) 55%, var(--aw-bg-3) 100%);
        }
        .aw-noise {
          position: absolute; inset: 0; z-index: 0;
          width: 100%; height: 100%;
          opacity: 0.05; pointer-events: none; mix-blend-mode: overlay;
        }
        .aw-celestial {
          position: absolute; top: 30px; left: 36px; z-index: 1;
          pointer-events: none; opacity: 0.8;
        }

        /* 书外点击区 */
        .aw-outside-click {
          position: absolute; inset: 0; z-index: 1;
          cursor: pointer;
        }

        /* 合上书按钮 */
        .aw-close-btn {
          position: absolute; top: 24px; right: 24px; z-index: 6;
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px;
          font-size: 12px; letter-spacing: 0.05em;
          color: var(--aw-body);
          background: rgba(253, 251, 245, 0.72);
          border: 1px solid var(--aw-border);
          border-radius: 999px;
          backdrop-filter: blur(6px);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        [data-theme="night"] .aw-close-btn { background: rgba(30, 41, 59, 0.72); }
        .aw-close-btn:hover {
          color: var(--aw-accent);
          border-color: var(--aw-accent);
          transform: translateX(2px);
        }

        /* ===== 书本舞台 ===== */
        .aw-book-stage {
          position: absolute; inset: 0; z-index: 2;
          display: flex; align-items: center; justify-content: center;
          padding: 70px 20px 60px;
          perspective: 2200px;
        }
        .aw-book {
          position: relative;
          width: min(740px, 92vw);
          height: min(540px, 74vh);
          background: var(--aw-paper);
          border: 1px solid var(--aw-border);
          border-radius: 6px 14px 14px 6px;
          box-shadow: var(--aw-shadow);
          transform-style: preserve-3d;
        }

        /* 书脊（中央阴影） */
        .aw-spine {
          position: absolute; top: 0; bottom: 0; left: 50%;
          width: 26px; transform: translateX(-50%);
          background: linear-gradient(90deg, transparent, rgba(90, 70, 50, 0.16) 35%, rgba(90, 70, 50, 0.26) 50%, rgba(90, 70, 50, 0.16) 65%, transparent);
          pointer-events: none; z-index: 3;
        }
        /* 叶脉纹理 */
        .aw-veins {
          position: absolute; inset: 0; width: 100%; height: 100%;
          opacity: 0.06; pointer-events: none; z-index: 1;
        }

        /* 翻页叶片 —— 双面 3D */
        .aw-page-leaf {
          position: absolute; inset: 0; z-index: 2;
          transform-style: preserve-3d;
          transform-origin: center center;
          transition: transform 0.76s cubic-bezier(0.45, 0, 0.25, 1);
          will-change: transform;
        }
        .aw-page-leaf.aw-snapping { transition: none !important; }
        .aw-face {
          position: absolute; inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          padding: 30px 38px 58px;
          box-sizing: border-box;
          background: var(--aw-paper);
        }
        .aw-face-front { transform: rotateY(0deg); }
        .aw-face-back  { transform: rotateY(180deg); }

        /* 通用页内标题 */
        .aw-page-heading {
          font-family: "Noto Serif SC", serif;
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.18em;
          color: var(--aw-accent);
          margin: 0 0 18px;
          text-align: center;
          position: relative;
        }
        .aw-page-heading::before,
        .aw-page-heading::after {
          content: ""; display: inline-block;
          width: 22px; height: 1px;
          background: var(--aw-border);
          vertical-align: middle;
          margin: 0 10px;
        }

        /* —— P1 封面 —— */
        .aw-cover {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 14px; text-align: center;
          background:
            radial-gradient(circle at 50% 12%, var(--aw-accent-soft), transparent 46%),
            radial-gradient(circle at 50% 92%, var(--aw-accent-soft), transparent 46%);
        }
        .aw-cover-name {
          font-family: "Noto Serif SC", serif;
          font-size: 36px; font-weight: 700;
          letter-spacing: 0.14em;
          margin: 6px 0 0;
          color: var(--aw-ink);
        }
        .aw-cover-subtitle {
          font-size: 13px; letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--aw-body); margin: 0;
        }
        .aw-cover-line {
          width: 48px; height: 2px;
          background: var(--aw-accent);
          border-radius: 2px;
        }
        .aw-cover-slogan {
          font-family: "Noto Serif SC", serif;
          font-size: 15px; font-style: italic;
          color: var(--aw-accent); margin: 0;
          letter-spacing: 0.04em;
        }
        .aw-sprig { width: 120px; height: 20px; }

        /* —— P2 简介 —— 首字下沉 —— */
        .aw-intro {
          width: 100%; max-width: 560px;
        }
        .aw-intro-text {
          font-size: 15px; line-height: 1.9;
          color: var(--aw-body);
          text-align: justify;
          padding: 0 6px;
          margin: 0;
        }
        .aw-intro-text::first-letter {
          font-family: "Noto Serif SC", serif;
          font-size: 2em;
          font-weight: 700;
          color: var(--aw-accent);
          float: left;
          line-height: 1;
          margin: 4px 8px 0 0;
        }

        /* —— P3 背景 —— 时间轴 —— */
        .aw-background { width: 100%; max-width: 540px; }
        .aw-timeline { position: relative; padding-left: 6px; }
        .aw-timeline::before {
          content: ""; position: absolute;
          left: 22px; top: 14px; bottom: 8px;
          width: 2px;
          background: linear-gradient(var(--aw-accent), var(--aw-border));
        }
        .aw-tl-node {
          position: relative;
          display: flex; gap: 16px;
          padding: 6px 0 16px 52px;
        }
        .aw-tl-node:last-child { padding-bottom: 0; }
        .aw-tl-badge {
          position: absolute; left: 0; top: 4px;
          width: 38px; height: 38px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: "Noto Serif SC", serif;
          font-size: 15px; font-weight: 700;
          color: #fff; background: var(--aw-accent);
          border: 3px solid var(--aw-paper);
          box-shadow: 0 3px 8px -2px rgba(90, 60, 40, 0.4);
          z-index: 1;
        }
        .aw-tl-content { flex: 1; }
        .aw-tl-period {
          display: inline-block;
          font-size: 11px; letter-spacing: 0.1em;
          color: var(--aw-accent);
          margin-bottom: 2px;
        }
        .aw-tl-title {
          margin: 0 0 4px;
          font-family: "Noto Serif SC", serif;
          font-size: 15px; font-weight: 600;
          color: var(--aw-ink);
        }
        .aw-tl-desc {
          margin: 0; font-size: 12.5px; line-height: 1.65;
          color: var(--aw-body);
        }

        /* —— P4 爱好 —— 插画网格 —— */
        .aw-hobbies { width: 100%; }
        .aw-hobbies-grid {
          display: flex; flex-wrap: wrap;
          justify-content: center;
          gap: 14px 18px;
        }
        .aw-hobby-card {
          flex: 0 0 168px;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          padding: 10px 6px 8px;
          border-radius: 14px;
          background: var(--aw-paper-2);
          border: 1px solid var(--aw-border);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .aw-hobby-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 22px -12px rgba(90, 70, 50, 0.45);
        }
        .aw-hobby-art {
          width: 96px; height: 88px;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.35s ease;
        }
        .aw-hobby-art svg { width: 100%; height: 100%; }
        .aw-hobby-card:hover .aw-hobby-art {
          transform: scale(1.07) rotate(-1.5deg);
        }
        .aw-hobby-name {
          margin: 4px 0 2px;
          font-family: "Noto Serif SC", serif;
          font-size: 14px; font-weight: 600;
          color: var(--aw-ink);
        }
        .aw-hobby-desc {
          margin: 0; font-size: 11px; line-height: 1.5;
          color: var(--aw-body);
        }

        /* 咖啡热气飘动 */
        .aw-steam path {
          animation: aw-steam-rise 3s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .aw-steam path:nth-child(2) { animation-delay: 0.6s; }
        .aw-steam path:nth-child(3) { animation-delay: 1.2s; }
        @keyframes aw-steam-rise {
          0%   { opacity: 0; transform: translateY(4px); }
          30%  { opacity: 0.7; }
          70%  { opacity: 0.5; }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        /* 音乐音符跳动 */
        .aw-notes g {
          animation: aw-note-bounce 2.4s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .aw-notes g:nth-child(2) { animation-delay: 0.4s; }
        .aw-notes g:nth-child(3) { animation-delay: 0.8s; }
        @keyframes aw-note-bounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }

        /* —— P5 联系 —— 火漆印章 —— */
        .aw-contact { width: 100%; }
        .aw-seals {
          display: flex; flex-wrap: wrap;
          justify-content: center; align-items: flex-start;
          gap: 26px;
          padding: 6px 0;
        }
        .aw-seal-card {
          display: flex; flex-direction: column;
          align-items: center; gap: 10px;
          text-decoration: none;
          color: var(--aw-body);
        }
        .aw-seal {
          position: relative;
          width: 128px; height: 128px;
          border-radius: 50%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 6px;
          color: #fff5ea;
          background: radial-gradient(circle at 38% 32%, #d6a884 0%, #b07a52 52%, #7a4a2e 100%);
          box-shadow:
            0 8px 18px -6px rgba(90, 55, 35, 0.55),
            inset 0 -6px 12px rgba(70, 35, 15, 0.45),
            inset 0 5px 10px rgba(255, 210, 175, 0.35);
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .aw-seal::before {
          content: ""; position: absolute; inset: 7px;
          border-radius: 50%;
          border: 2px dashed rgba(255, 240, 225, 0.55);
        }
        .aw-seal::after {
          content: ""; position: absolute; inset: 13px;
          border-radius: 50%;
          border: 1px solid rgba(255, 240, 225, 0.32);
        }
        .aw-seal-icon { display: flex; }
        .aw-seal-label {
          font-family: "Noto Serif SC", serif;
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .aw-seal-card:hover .aw-seal {
          transform: rotate(-7deg) scale(1.08);
        }
        .aw-seal-value {
          font-size: 12px; letter-spacing: 0.04em;
          color: var(--aw-body);
          transition: color 0.3s ease;
        }
        .aw-seal-card:hover .aw-seal-value { color: var(--aw-accent); }

        /* —— P6 封底 —— */
        .aw-backcover {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 16px; text-align: center;
          background:
            radial-gradient(circle at 50% 50%, var(--aw-accent-soft), transparent 56%);
        }
        .aw-star {
          animation: aw-twinkle 3s ease-in-out infinite;
          filter: drop-shadow(0 2px 4px rgba(184, 140, 106, 0.4));
        }
        @keyframes aw-twinkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.85; }
          50%      { transform: scale(1.12) rotate(8deg); opacity: 1; }
        }
        .aw-ending {
          font-family: "Noto Serif SC", serif;
          font-size: 24px; font-style: italic;
          color: var(--aw-ink);
          margin: 0; letter-spacing: 0.02em;
          line-height: 1.5;
        }
        .aw-theend {
          font-size: 12px; letter-spacing: 0.3em;
          color: var(--aw-accent); margin: 0;
          text-transform: uppercase;
        }

        /* 书的厚度（底部侧面） */
        .aw-book-edge {
          position: absolute; left: 6px; right: 14px; bottom: -8px;
          height: 10px;
          background: linear-gradient(180deg, #e0d2bc, #b89a72);
          border-radius: 0 0 8px 8px;
          box-shadow: 0 6px 14px -6px rgba(60, 45, 25, 0.4);
          z-index: 0;
        }
        [data-theme="night"] .aw-book-edge {
          background: linear-gradient(180deg, #2a3a4a, #1a2230);
        }

        /* 翻页按钮 */
        .aw-nav {
          position: absolute; bottom: 14px; z-index: 5;
          width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          color: var(--aw-accent);
          background: rgba(253, 251, 245, 0.72);
          border: 1px solid var(--aw-border);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        [data-theme="night"] .aw-nav { background: rgba(30, 41, 59, 0.72); }
        .aw-nav:hover:not(:disabled) {
          background: var(--aw-accent); color: #fff;
          transform: translateY(-2px);
        }
        .aw-nav:disabled { opacity: 0.3; cursor: not-allowed; }
        .aw-nav-prev { left: 14px; }
        .aw-nav-next { right: 14px; }

        /* 页码 */
        .aw-page-indicator {
          position: absolute; bottom: 22px; left: 50%;
          transform: translateX(-50%);
          z-index: 5;
          font-size: 12px; letter-spacing: 0.15em;
          color: var(--aw-body); opacity: 0.75;
          font-family: "Noto Serif SC", serif;
        }

        /* 提示 */
        .aw-hint {
          position: absolute; bottom: 16px; left: 50%;
          transform: translateX(-50%);
          z-index: 4; margin: 0;
          font-size: 11px; letter-spacing: 0.08em;
          color: var(--aw-body); opacity: 0.55;
          pointer-events: none; text-align: center; white-space: nowrap;
        }

        /* ===== 响应式 ===== */
        @media (max-width: 768px) {
          .aw-book { height: min(580px, 80vh); }
          .aw-face { padding: 22px 18px 52px; }
          .aw-cover-name { font-size: 30px; }
          .aw-cover-slogan { font-size: 13px; }
          .aw-intro-text { font-size: 13.5px; line-height: 1.85; }
          .aw-page-heading { font-size: 12px; }
          .aw-hobby-card { flex: 0 0 140px; }
          .aw-hobby-art { width: 80px; height: 74px; }
          .aw-hobby-name { font-size: 13px; }
          .aw-hobby-desc { font-size: 10.5px; }
          .aw-seal { width: 108px; height: 108px; }
          .aw-seal-label { font-size: 11px; }
          .aw-ending { font-size: 20px; }
          .aw-tl-badge { width: 34px; height: 34px; font-size: 13px; }
          .aw-tl-title { font-size: 14px; }
          .aw-tl-desc { font-size: 11.5px; }
          .aw-hint { font-size: 10px; white-space: normal; width: 80%; }
          .aw-close-btn { top: 14px; right: 14px; }
          .aw-celestial { top: 16px; left: 16px; transform: scale(0.78); transform-origin: top left; }
        }
        @media (prefers-reduced-motion: reduce) {
          .aw-page-leaf { transition: none; }
          .aw-steam path, .aw-notes g, .aw-star { animation: none; }
        }
      `}</style>
    </motion.section>
  );
};

export default AboutWorld;
