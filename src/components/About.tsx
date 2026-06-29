import { useState } from "react";
import { motion } from "framer-motion";
import BookReader from "./BookReader";

/**
 * About 组件 — 关于我（项目树 + 双递书交互版）
 *
 * 布局：
 * - 左侧：主角人物（手持小树叶书）
 * - 右侧：项目树 + 考拉（手持大树叶书）
 * - 视觉引导：书从树上长出来，被人传递
 *
 * 双交互入口：
 * - 点击人物手中的小书 → 飞向屏幕 → 翻书视图
 * - 点击考拉手中的大书 → 飞向屏幕 → 翻书视图
 */

// 教育背景数据
const education = [
  {
    school: "河南工学院",
    degree: "本科 · 软件工程（专升本）",
    period: "本科阶段",
  },
  {
    school: "安阳职业技术学院",
    degree: "专科",
    period: "专科阶段",
  },
];

// 核心能力标签
const skills = [
  "需求分析",
  "原型设计",
  "SQL",
  "Prompt Engineering",
  "用户洞察",
];

// 项目数据 — 传给 BookReader
const projects = [
  {
    id: 1,
    name: "智能手环商城",
    subtitle: "Smart Band E-Commerce",
    tech: "SpringBoot",
    description:
      "基于 SpringBoot 的智能手环电商平台，覆盖商品浏览、购物车、订单、支付的电商全链路。独立撰写 PRD 文档并完成数据库表结构设计，包含用户、商品、订单、支付等核心模块。",
    tags: [
      { label: "PRD 撰写", type: "tech" as const },
      { label: "数据库设计", type: "tech" as const },
      { label: "电商全链路", type: "tech" as const },
      { label: "SpringBoot", type: "tech" as const },
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
      { label: "感恩日记", type: "emotion" as const },
      { label: "冥想引导", type: "emotion" as const },
      { label: "播客", type: "emotion" as const },
      { label: "情感化 AI", type: "emotion" as const },
    ],
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop",
    link: "#lab",
  },
];

/* ============================================
   1. 卡通人物（左侧）— 手持小树叶书
   ============================================ */
const CartoonCharacter: React.FC<{ blinking: boolean }> = ({ blinking }) => (
  <div className="cartoon-character" style={{ opacity: 0.9 }}>
    <svg
      width="160"
      height="220"
      viewBox="0 0 180 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 头部 */}
      <circle cx="90" cy="50" r="32" fill="#fffdf9" stroke="#3d3d3d" strokeWidth="2" />
      {/* 头发 */}
      <path d="M60 35 Q70 20 90 22 Q110 20 120 35 Q115 28 90 28 Q65 28 60 35 Z" fill="#3d3d3d" />
      <path d="M58 45 Q56 60 60 70 L64 65 Q60 55 62 45 Z" fill="#3d3d3d" />
      <path d="M122 45 Q124 60 120 70 L116 65 Q120 55 118 45 Z" fill="#3d3d3d" />
      {/* 眼睛 */}
      {blinking ? (
        <>
          <line x1="76" y1="52" x2="84" y2="52" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" />
          <line x1="96" y1="52" x2="104" y2="52" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="80" cy="52" r="2.5" fill="#3d3d3d" />
          <circle cx="100" cy="52" r="2.5" fill="#3d3d3d" />
        </>
      )}
      {/* 腮红 */}
      <ellipse cx="72" cy="62" rx="4" ry="2.5" fill="#B88C6A" opacity="0.3" />
      <ellipse cx="108" cy="62" rx="4" ry="2.5" fill="#B88C6A" opacity="0.3" />
      {/* 嘴巴 */}
      <path d="M84 66 Q90 70 96 66" stroke="#3d3d3d" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* 脖子 */}
      <rect x="84" y="80" width="12" height="10" fill="#fffdf9" stroke="#3d3d3d" strokeWidth="1.5" />
      {/* 身体 */}
      <path d="M60 90 Q55 95 52 120 L50 160 L130 160 L128 120 Q125 95 120 90 Z" fill="#fffdf9" stroke="#3d3d3d" strokeWidth="2" />
      <path d="M82 90 L90 100 L98 90" stroke="#3d3d3d" strokeWidth="1.5" fill="none" />
      {/* 左手臂 */}
      <path d="M58 95 Q40 110 50 135 Q55 140 65 138" fill="none" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" />
      <circle cx="66" cy="138" r="6" fill="#fffdf9" stroke="#3d3d3d" strokeWidth="1.5" />
      {/* 右手臂 */}
      <path d="M122 95 Q140 110 130 135 Q125 140 115 138" fill="none" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" />
      <circle cx="114" cy="138" r="6" fill="#fffdf9" stroke="#3d3d3d" strokeWidth="1.5" />
      {/* 腿 */}
      <rect x="72" y="160" width="14" height="40" fill="#3d3d3d" rx="3" />
      <rect x="94" y="160" width="14" height="40" fill="#3d3d3d" rx="3" />
      {/* 鞋子 */}
      <ellipse cx="79" cy="202" rx="9" ry="4" fill="#B88C6A" />
      <ellipse cx="101" cy="202" rx="9" ry="4" fill="#B88C6A" />
    </svg>
  </div>
);

/* ============================================
   2. 手中的小树叶书（左侧人物）
   ============================================ */
const HandheldLeafBook: React.FC<{ isFlying: boolean; onClick: () => void }> = ({
  isFlying,
  onClick,
}) => (
  <motion.button
    className="handheld-leaf-book"
    onClick={onClick}
    aria-label="点击打开项目阅读"
    title="点击翻开项目之书"
    data-clickable
    animate={isFlying ? { scale: 15, opacity: 0 } : { scale: 1, opacity: 1 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
    whileHover={{ y: -3 }}
  >
    <svg width="54" height="40" viewBox="0 0 60 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="book-cover-small" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--leaf-bg-1)" />
          <stop offset="100%" stopColor="var(--leaf-bg-2)" />
        </linearGradient>
      </defs>
      <path d="M6 8 Q6 4 10 4 L50 4 Q54 4 54 8 L54 40 Q54 44 50 44 L10 44 Q6 44 6 40 Z" fill="url(#book-cover-small)" stroke="var(--leaf-border)" strokeWidth="1" />
      <line x1="30" y1="6" x2="30" y2="42" stroke="var(--leaf-border)" strokeWidth="0.8" />
      <line x1="18" y1="10" x2="18" y2="38" stroke="var(--leaf-vein)" strokeWidth="0.5" opacity="0.8" />
      <path d="M18 16 L12 18 M18 22 L11 24 M18 28 L12 30 M18 34 L13 36" stroke="var(--leaf-vein)" strokeWidth="0.3" opacity="0.6" />
      <path d="M18 16 L24 18 M18 22 L25 24 M18 28 L24 30 M18 34 L23 36" stroke="var(--leaf-vein)" strokeWidth="0.3" opacity="0.6" />
      <line x1="42" y1="10" x2="42" y2="38" stroke="var(--leaf-vein)" strokeWidth="0.5" opacity="0.8" />
      <path d="M42 16 L36 18 M42 22 L35 24 M42 28 L36 30 M42 34 L37 36" stroke="var(--leaf-vein)" strokeWidth="0.3" opacity="0.6" />
      <path d="M42 16 L48 18 M42 22 L49 24 M42 28 L48 30 M42 34 L47 36" stroke="var(--leaf-vein)" strokeWidth="0.3" opacity="0.6" />
      <path d="M48 4 L48 14 L45 11 L42 14 L42 4 Z" fill="#B88C6A" opacity="0.7" />
    </svg>
  </motion.button>
);

/* ============================================
   3. 项目树 + 考拉（右侧）— 大树叶书
   ============================================ */

/**
 * 考拉 SVG — 慵懒抱着树干，手里拿着大树叶书
 * lookingAtBook: true 时眼睛看向下方书本
 * nodding: true 时头部微微点头
 */
const Koala: React.FC<{
  lookingAtBook: boolean;
  nodding: boolean;
  bookFlying: boolean;
  onBookClick: () => void;
  onBookHover: (hovering: boolean) => void;
}> = ({ lookingAtBook, nodding, bookFlying, onBookClick, onBookHover }) => (
  <div className="koala-container">
    <motion.div
      className="koala-body"
      animate={nodding ? { rotate: [0, -5, 0] } : { rotate: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <svg width="140" height="170" viewBox="0 0 140 170" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 考拉身体 — 灰色，圆胖 */}
        <ellipse cx="70" cy="110" rx="35" ry="30" fill="#b8c4cc" stroke="#7a8a92" strokeWidth="1.5" />
        {/* 胸口毛色变化 */}
        <ellipse cx="70" cy="105" rx="20" ry="22" fill="#d0dae0" opacity="0.6" />

        {/* 头部 — 大圆，灰色 */}
        <motion.g
          animate={nodding ? { rotate: [-3, 3, 0] } : { rotate: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ transformOrigin: "70px 75px" }}
        >
          <circle cx="70" cy="65" r="28" fill="#b8c4cc" stroke="#7a8a92" strokeWidth="1.5" />

          {/* 大耳朵 — 考拉标志性 */}
          <circle cx="45" cy="45" r="14" fill="#b8c4cc" stroke="#7a8a92" strokeWidth="1.5" />
          <circle cx="45" cy="45" r="8" fill="#d0dae0" opacity="0.7" />
          <circle cx="95" cy="45" r="14" fill="#b8c4cc" stroke="#7a8a92" strokeWidth="1.5" />
          <circle cx="95" cy="45" r="8" fill="#d0dae0" opacity="0.7" />

          {/* 大鼻子 — 黑色椭圆，考拉特征 */}
          <ellipse cx="70" cy="70" rx="10" ry="8" fill="#3d3d3d" />
          <ellipse cx="67" cy="67" rx="3" ry="2" fill="#5a5a5a" opacity="0.6" />

          {/* 眼睛 — lookingAtBook 时向下看 */}
          {lookingAtBook ? (
            <>
              {/* 向下看的眼睛 */}
              <circle cx="58" cy="58" r="3" fill="#3d3d3d" />
              <circle cx="82" cy="58" r="3" fill="#3d3d3d" />
              <path d="M56 62 Q58 64 60 62 M80 62 Q82 64 84 62" stroke="#7a8a92" strokeWidth="0.8" fill="none" />
            </>
          ) : (
            <>
              {/* 正常闭眼/半闭 — 考拉常眯眼 */}
              <path d="M54 58 Q58 60 62 58" stroke="#3d3d3d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M78 58 Q82 60 86 58" stroke="#3d3d3d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* 嘴巴 — 小弧线 */}
          <path d="M67 80 Q70 82 73 80" stroke="#7a8a92" strokeWidth="1" fill="none" strokeLinecap="round" />
        </motion.g>

        {/* 抱树干的爪子 — 上方 */}
        <ellipse cx="42" cy="95" rx="8" ry="6" fill="#b8c4cc" stroke="#7a8a92" strokeWidth="1.2" />
        <ellipse cx="98" cy="95" rx="8" ry="6" fill="#b8c4cc" stroke="#7a8a92" strokeWidth="1.2" />

        {/* 腿 — 垂在树干两侧 */}
        <ellipse cx="48" cy="145" rx="10" ry="8" fill="#b8c4cc" stroke="#7a8a92" strokeWidth="1.2" />
        <ellipse cx="92" cy="145" rx="10" ry="8" fill="#b8c4cc" stroke="#7a8a92" strokeWidth="1.2" />
      </svg>
    </motion.div>

    {/* 考拉手中的大树叶书 — 比 HandheldLeafBook 大，作为"源头" */}
    <motion.button
      className="tree-leaf-book"
      onClick={onBookClick}
      onMouseEnter={() => onBookHover(true)}
      onMouseLeave={() => onBookHover(false)}
      aria-label="点击打开项目阅读"
      title="书从树上长出来"
      data-clickable
      animate={bookFlying ? { scale: 15, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      whileHover={{ y: -4 }}
    >
      <svg width="80" height="58" viewBox="0 0 80 58" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="book-cover-large" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--leaf-bg-1)" />
            <stop offset="100%" stopColor="var(--leaf-bg-2)" />
          </linearGradient>
        </defs>
        {/* 书本外框 — 比小书更大 */}
        <path d="M8 10 Q8 5 13 5 L67 5 Q72 5 72 10 L72 52 Q72 57 67 57 L13 57 Q8 57 8 52 Z" fill="url(#book-cover-large)" stroke="var(--leaf-border)" strokeWidth="1.2" />
        {/* 书脊装订线 — 与小书完全一致 */}
        <line x1="40" y1="8" x2="40" y2="54" stroke="var(--leaf-border)" strokeWidth="1" />
        {/* 左页叶脉纹理 — 与 Projects 翻书组件一致 */}
        <line x1="24" y1="12" x2="24" y2="50" stroke="var(--leaf-vein)" strokeWidth="0.6" opacity="0.8" />
        <path d="M24 20 L16 23 M24 28 L15 31 M24 36 L16 39 M24 44 L17 47" stroke="var(--leaf-vein)" strokeWidth="0.4" opacity="0.6" />
        <path d="M24 20 L32 23 M24 28 L33 31 M24 36 L32 39 M24 44 L31 47" stroke="var(--leaf-vein)" strokeWidth="0.4" opacity="0.6" />
        {/* 右页叶脉纹理 */}
        <line x1="56" y1="12" x2="56" y2="50" stroke="var(--leaf-vein)" strokeWidth="0.6" opacity="0.8" />
        <path d="M56 20 L48 23 M56 28 L47 31 M56 36 L48 39 M56 44 L49 47" stroke="var(--leaf-vein)" strokeWidth="0.4" opacity="0.6" />
        <path d="M56 20 L64 23 M56 28 L65 31 M56 36 L64 39 M56 44 L63 47" stroke="var(--leaf-vein)" strokeWidth="0.4" opacity="0.6" />
        {/* 书签丝带 — 主题棕，与小书一致 */}
        <path d="M64 5 L64 18 L60 14 L56 18 L56 5 Z" fill="#B88C6A" opacity="0.7" />
      </svg>
    </motion.button>
  </div>
);

/**
 * 项目树 SVG — 简约线条，鼠尾草绿半透明树叶
 * 树干有自然纹理，枝叶轻微摇摆
 */
const ProjectTree: React.FC<{
  lookingAtBook: boolean;
  nodding: boolean;
  bookFlying: boolean;
  onBookClick: () => void;
  onBookHover: (hovering: boolean) => void;
}> = ({ lookingAtBook, nodding, bookFlying, onBookClick, onBookHover }) => (
  <div className="project-tree-container">
    <svg
      width="240"
      height="320"
      viewBox="0 0 240 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="project-tree-svg"
    >
      <defs>
        {/* 树干渐变 */}
        <linearGradient id="trunk-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6b5340" />
          <stop offset="50%" stopColor="#8a6f4a" />
          <stop offset="100%" stopColor="#5a4030" />
        </linearGradient>
      </defs>

      {/* 树干 — 主体，考拉抱着的位置 */}
      <path
        d="M105 60 Q100 120 102 200 Q103 260 105 310 L135 310 Q137 260 138 200 Q140 120 135 60 Z"
        fill="url(#trunk-grad)"
        stroke="#4a3525"
        strokeWidth="1.5"
      />
      {/* 树干纹理 */}
      <path d="M108 80 Q112 90 108 100 M132 90 Q128 100 132 110 M110 140 Q114 150 110 160 M130 170 Q126 180 130 190 M108 220 Q112 230 108 240 M132 250 Q128 260 132 270" stroke="#4a3525" strokeWidth="0.8" fill="none" opacity="0.4" />
      {/* 树皮节疤 */}
      <ellipse cx="118" cy="120" rx="4" ry="3" fill="#4a3525" opacity="0.3" />
      <ellipse cx="122" cy="210" rx="3" ry="2.5" fill="#4a3525" opacity="0.3" />

      {/* 树枝 — 左侧上 */}
      <path d="M108 90 Q80 75 55 60" stroke="#6b5340" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M55 60 Q45 55 38 48" stroke="#6b5340" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* 树枝 — 右侧上 */}
      <path d="M132 85 Q160 68 188 52" stroke="#6b5340" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M188 52 Q198 47 205 40" stroke="#6b5340" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* 树枝 — 左侧中 */}
      <path d="M105 140 Q82 135 60 132" stroke="#6b5340" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* 树枝 — 右侧中 */}
      <path d="M135 135 Q158 130 180 128" stroke="#6b5340" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* 树叶群 — 鼠尾草绿 #9CAF88，半透明，分组摇摆 */}
      <g className="leaf-cluster leaf-cluster-1">
        <ellipse cx="50" cy="45" rx="28" ry="22" fill="#9CAF88" opacity="0.4" />
        <ellipse cx="38" cy="38" rx="18" ry="15" fill="#9CAF88" opacity="0.5" />
        <ellipse cx="65" cy="50" rx="16" ry="13" fill="#9CAF88" opacity="0.35" />
      </g>
      <g className="leaf-cluster leaf-cluster-2">
        <ellipse cx="190" cy="38" rx="30" ry="24" fill="#9CAF88" opacity="0.4" />
        <ellipse cx="200" cy="30" rx="18" ry="15" fill="#9CAF88" opacity="0.5" />
        <ellipse cx="175" cy="45" rx="16" ry="13" fill="#9CAF88" opacity="0.35" />
      </g>
      <g className="leaf-cluster leaf-cluster-3">
        <ellipse cx="55" cy="125" rx="24" ry="20" fill="#9CAF88" opacity="0.38" />
        <ellipse cx="45" cy="118" rx="15" ry="12" fill="#9CAF88" opacity="0.45" />
      </g>
      <g className="leaf-cluster leaf-cluster-4">
        <ellipse cx="185" cy="122" rx="24" ry="20" fill="#9CAF88" opacity="0.38" />
        <ellipse cx="195" cy="115" rx="15" ry="12" fill="#9CAF88" opacity="0.45" />
      </g>
      {/* 顶部树冠 */}
      <g className="leaf-cluster leaf-cluster-top">
        <ellipse cx="120" cy="35" rx="40" ry="30" fill="#9CAF88" opacity="0.3" />
        <ellipse cx="105" cy="25" rx="22" ry="18" fill="#9CAF88" opacity="0.4" />
        <ellipse cx="135" cy="28" rx="20" ry="16" fill="#9CAF88" opacity="0.35" />
      </g>
    </svg>

    {/* 考拉 + 大树叶书 — 定位在树杈位置 */}
    <div className="koala-position">
      <Koala
        lookingAtBook={lookingAtBook}
        nodding={nodding}
        bookFlying={bookFlying}
        onBookClick={onBookClick}
        onBookHover={onBookHover}
      />
    </div>
  </div>
);

/* ============================================
   4. 主组件
   ============================================ */
const About: React.FC = () => {
  const [view, setView] = useState<"home" | "reading">("home");
  const [personBookFlying, setPersonBookFlying] = useState(false);
  const [treeBookFlying, setTreeBookFlying] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const [koalaLookingAtBook, setKoalaLookingAtBook] = useState(false);
  const [koalaNodding, setKoalaNodding] = useState(false);

  // 人物书本点击 → 飞行 → 翻书视图
  const handlePersonBookClick = () => {
    setBlinking(true);
    setTimeout(() => setBlinking(false), 200);
    setPersonBookFlying(true);
    setTimeout(() => {
      setView("reading");
      setPersonBookFlying(false);
    }, 600);
  };

  // 考拉书本点击 → 飞行 → 考拉点头 → 翻书视图
  const handleTreeBookClick = () => {
    setKoalaNodding(true);
    setTreeBookFlying(true);
    setTimeout(() => {
      setView("reading");
      setTreeBookFlying(false);
      setKoalaNodding(false);
    }, 600);
  };

  const handleCloseReader = () => {
    setView("home");
  };

  return (
    <section id="about" className="py-24 px-6 relative">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-medium text-[#3d3d3d] mb-2 tracking-wide">
            About
          </h2>
          <div className="flex items-center gap-2">
            <span className="h-px w-12 bg-[#b88c6a]" />
            <span className="text-xs text-[#b88c6a] tracking-widest">关于我</span>
          </div>
        </motion.div>

        {/* 双递书场景 — 左侧人物 + 右侧项目树考拉 */}
        <motion.div
          className="about-scene-grid"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          {/* 左侧：主角人物 + 小树叶书 */}
          <div className="about-left-side">
            <div className="relative">
              <CartoonCharacter blinking={blinking} />
              {/* 手中的小树叶书 */}
              <div className="handheld-book-wrapper">
                <HandheldLeafBook isFlying={personBookFlying} onClick={handlePersonBookClick} />
              </div>
              {/* 引导提示 */}
              <motion.div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <span className="text-xs text-[#b88c6a] tracking-wide animate-pulse">
                  📖 点击书本
                </span>
              </motion.div>
            </div>
          </div>

          {/* 视觉引导线 — 隐形连接，暗示"书从树上长出来，被人传递" */}
          <div className="about-connection-line">
            <svg width="100%" height="40" viewBox="0 0 200 40" fill="none" preserveAspectRatio="none">
              <path
                d="M10 20 Q100 5 190 20"
                stroke="var(--leaf-border)"
                strokeWidth="1"
                strokeDasharray="4 6"
                fill="none"
                opacity="0.4"
              />
              {/* 中间小叶子装饰 */}
              <ellipse cx="100" cy="10" rx="5" ry="3" fill="#9CAF88" opacity="0.3" transform="rotate(-15 100 10)" />
            </svg>
          </div>

          {/* 右侧：项目树 + 考拉 + 大树叶书 */}
          <div className="about-right-side">
            <ProjectTree
              lookingAtBook={koalaLookingAtBook}
              nodding={koalaNodding}
              bookFlying={treeBookFlying}
              onBookClick={handleTreeBookClick}
              onBookHover={setKoalaLookingAtBook}
            />
            {/* 引导提示 */}
            <motion.div
              className="tree-hint"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <span className="text-xs text-[#9CAF88] tracking-wide animate-pulse">
                🌿 书从树上长出来
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* 教育背景 + 核心能力 */}
        <div className="grid md:grid-cols-2 gap-12 mt-16">
          {/* 左侧：教育背景 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-lg font-medium text-[#3d3d3d] mb-6 flex items-center gap-2">
              <span className="text-[#b88c6a]">◆</span>
              教育背景
            </h3>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="relative pl-5 border-l-2 border-[#e8e0d5]">
                  <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-[#b88c6a] border-2 border-[#faf6f0]" />
                  <h4 className="text-base font-medium text-[#3d3d3d] mb-1">{edu.school}</h4>
                  <p className="text-sm text-[#8a8a8a]">{edu.degree}</p>
                  <p className="text-xs text-[#b0b0b0] mt-1">{edu.period}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 右侧：核心能力 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h3 className="text-lg font-medium text-[#3d3d3d] mb-6 flex items-center gap-2">
              <span className="text-[#b88c6a]">◆</span>
              核心能力
            </h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="px-4 py-2 text-sm glass-card text-[#6b6b6b] rounded-full border border-[#e8e0d5] card-shadow hover:border-[#b88c6a] hover:text-[#b88c6a] transition-all duration-300 cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
            <p className="mt-6 text-sm text-[#8a8a8a] leading-relaxed">
              从软件工程的代码世界走向 AI 产品的舞台，兼具技术理解力与产品同理心。
              擅长将复杂需求转化为清晰原型，用 Prompt 驾驭 AI 能力，以用户洞察驱动设计决策。
            </p>
          </motion.div>
        </div>
      </div>

      {/* BookReader 全屏翻书阅读视图 */}
      <BookReader
        isOpen={view === "reading"}
        onClose={handleCloseReader}
        projects={projects}
      />
    </section>
  );
};

export default About;
