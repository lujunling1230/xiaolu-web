import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useView } from "../context/ViewContext";
import Modal from "./Modal";
import GratitudeJournal from "./GratitudeJournal";
import BreathingGuide from "./BreathingGuide";
import MeditationSpace from "./MeditationSpace";

/**
 * LabWorld 子世界 —— 木屋疗愈室
 *
 * 概念：木屋内部，温暖灯光，三只动物围坐展示"疗愈实验"。
 * 全屏场景（无导航栏单页森林世界的子页面），独立背景与内容，
 * 通过 useView().back() 返回森林主世界。
 *
 * 结构：
 * - 背景：木屋内部暖色渐变（#FDFBF5→#F5EAD6→#E8D5B8）+ 木纹纹理（SVG + repeating-linear-gradient）
 * - 背景 SVG：墙壁木板、地板、一扇窗户（透出森林）、壁炉（跳动火焰动画）
 * - 火焰：CSS animation（scale + opacity，2s 循环）
 * - 中心：三只动物围坐（鹿角兔/树懒/萤火虫），横向排列（移动端纵向），轻微浮动
 *   · 鹿角兔（感恩日记）：粉红主题 + 小本子图标
 *   · 树懒（呼吸引导）：靛紫主题 + 呼吸圆环图标
 *   · 萤火虫（冥想空间）：翠绿主题 + 莲花图标
 * - 每只动物点击 → 打开对应 Modal（复用 Lab.tsx 的 Modal + 三模块引用模式）
 * - 入场：从中心放大 + 模糊到清晰（scale 1.2→1, blur 8px→0），"推门进入"感
 * - 返回：点击窗户（变亮透出森林光）→ back()；左上角"推门出去"按钮备选
 *
 * 所有自定义 CSS 内联在文件末尾 <style>，不依赖 index.css 新增类。
 */

type ModuleId = "gratitude" | "breathing" | "meditation";

const moduleInfo: Record<ModuleId, { title: string; subtitle: string }> = {
  gratitude: { title: "感恩日记", subtitle: "Gratitude Journal · 记录今日的温暖" },
  breathing: { title: "呼吸引导", subtitle: "Breathing Guide · 跟随圆圈呼吸" },
  meditation: { title: "冥想空间", subtitle: "Meditation Space · 静心片刻" },
};

/* ============================================
   1. 鹿角兔 —— 粉红主题，捧心形日记（适配自 Lab.tsx）
   ============================================ */
const LabDeerRabbit: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.button
    className="lw-animal"
    onClick={onClick}
    whileHover={{ scale: 1.05, y: -4 }}
    whileTap={{ scale: 0.97 }}
    data-clickable
    aria-label="感恩日记"
  >
    <motion.div
      className="lw-animal-float"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="100" height="130" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 软垫 */}
        <ellipse cx="50" cy="120" rx="38" ry="8" fill="#e88aa8" opacity="0.25" />
        {/* 身体 */}
        <ellipse cx="50" cy="95" rx="25" ry="22" fill="#f5d5e0" stroke="#c97a96" strokeWidth="1.5" />
        {/* 头部 */}
        <circle cx="50" cy="55" r="22" fill="#fce4ee" stroke="#c97a96" strokeWidth="1.5" />
        {/* 鹿角 */}
        <path d="M38 38 L34 18 L40 30 L38 38" fill="none" stroke="#c97a96" strokeWidth="2" strokeLinecap="round" />
        <path d="M36 35 L30 22 M36 35 L40 24" stroke="#c97a96" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M62 38 L66 18 L60 30 L62 38" fill="none" stroke="#c97a96" strokeWidth="2" strokeLinecap="round" />
        <path d="M64 35 L70 22 M64 35 L60 24" stroke="#c97a96" strokeWidth="1.5" strokeLinecap="round" />
        {/* 长耳朵 */}
        <ellipse cx="36" cy="30" rx="4" ry="14" fill="#fce4ee" stroke="#c97a96" strokeWidth="1" transform="rotate(-10 36 30)" />
        <ellipse cx="64" cy="30" rx="4" ry="14" fill="#fce4ee" stroke="#c97a96" strokeWidth="1" transform="rotate(10 64 30)" />
        {/* 眼睛 */}
        <circle cx="43" cy="55" r="2.5" fill="#3d2b1f" />
        <circle cx="57" cy="55" r="2.5" fill="#3d2b1f" />
        {/* 鼻子 */}
        <ellipse cx="50" cy="62" rx="2" ry="1.5" fill="#c97a96" />
        {/* 嘴巴 */}
        <path d="M50 64 Q47 68 44 66 M50 64 Q53 68 56 66" stroke="#c97a96" strokeWidth="1" fill="none" strokeLinecap="round" />
        {/* 腮红 */}
        <ellipse cx="38" cy="60" rx="4" ry="2.5" fill="#e88aa8" opacity="0.5" />
        <ellipse cx="62" cy="60" rx="4" ry="2.5" fill="#e88aa8" opacity="0.5" />
        {/* 手 */}
        <ellipse cx="35" cy="85" rx="6" ry="5" fill="#fce4ee" stroke="#c97a96" strokeWidth="1" />
        <ellipse cx="65" cy="85" rx="6" ry="5" fill="#fce4ee" stroke="#c97a96" strokeWidth="1" />
        {/* 心形日记本 */}
        <path d="M50 78 C46 74 40 74 40 80 C40 86 50 92 50 92 C50 92 60 86 60 80 C60 74 54 74 50 78 Z" fill="#e88aa8" stroke="#c97a96" strokeWidth="1" />
        <line x1="50" y1="80" x2="50" y2="92" stroke="#c97a96" strokeWidth="0.5" opacity="0.5" />
      </svg>
    </motion.div>
    {/* 小本子图标 */}
    <span className="lw-animal-icon lw-icon-pink" aria-hidden>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z" strokeLinejoin="round" />
        <path d="M5 18a2 2 0 0 1 2-2h11" />
        <path d="M9 8h6M9 11h6" strokeLinecap="round" />
      </svg>
    </span>
    <span className="lw-animal-label">感恩日记</span>
  </motion.button>
);

/* ============================================
   2. 树懒 —— 靛紫主题，拿呼吸沙漏（适配自 Lab.tsx）
   ============================================ */
const LabSloth: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.button
    className="lw-animal"
    onClick={onClick}
    whileHover={{ scale: 1.05, y: -4 }}
    whileTap={{ scale: 0.97 }}
    data-clickable
    aria-label="呼吸引导"
  >
    <motion.div
      className="lw-animal-float"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    >
      <svg width="100" height="140" viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 树干 */}
        <rect x="78" y="20" width="18" height="110" rx="4" fill="#6b5340" stroke="#3d2b1f" strokeWidth="1.5" />
        <path d="M82 35 Q85 40 82 45 M85 60 Q88 65 85 70 M82 90 Q85 95 82 100" stroke="#3d2b1f" strokeWidth="0.8" fill="none" opacity="0.4" />
        {/* 身体 —— 靛紫 */}
        <ellipse cx="45" cy="85" rx="28" ry="24" fill="#9aa6c8" stroke="#5a6a9a" strokeWidth="1.5" />
        <path d="M30 75 Q35 78 30 82 M40 70 Q45 73 40 77 M50 72 Q55 75 50 79 M35 90 Q40 93 35 97 M50 92 Q55 95 50 99" stroke="#5a6a9a" strokeWidth="0.6" fill="none" opacity="0.4" />
        {/* 头部 */}
        <circle cx="45" cy="50" r="20" fill="#b8c2dc" stroke="#5a6a9a" strokeWidth="1.5" />
        {/* 眼罩 */}
        <ellipse cx="45" cy="48" rx="14" ry="8" fill="#7a86b0" opacity="0.5" />
        {/* 眼睛 半闭 */}
        <path d="M36 48 Q38 50 40 48" stroke="#3d2b1f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M50 48 Q52 50 54 48" stroke="#3d2b1f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* 鼻子 */}
        <ellipse cx="45" cy="55" rx="2.5" ry="2" fill="#5a6a9a" />
        {/* 嘴 */}
        <path d="M42 58 Q45 60 48 58" stroke="#5a6a9a" strokeWidth="1" fill="none" strokeLinecap="round" />
        {/* 爪子抓树干 */}
        <path d="M68 78 Q76 75 78 80" stroke="#5a6a9a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M68 95 Q76 92 78 97" stroke="#5a6a9a" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* 另一只手 */}
        <ellipse cx="28" cy="80" rx="6" ry="5" fill="#b8c2dc" stroke="#5a6a9a" strokeWidth="1" />
        {/* 呼吸沙漏 */}
        <g transform="translate(15, 70)">
          <path d="M0 0 L16 0 L10 8 L6 8 L0 0 Z" fill="#c4ccea" stroke="#7a86b0" strokeWidth="0.8" />
          <path d="M6 8 L10 8 L16 16 L0 16 Z" fill="#c4ccea" stroke="#7a86b0" strokeWidth="0.8" />
          <path d="M4 2 L12 2 L9 6 L7 6 Z" fill="#9aa6c8" />
          <rect x="7" y="10" width="2" height="4" fill="#9aa6c8" />
        </g>
      </svg>
    </motion.div>
    {/* 呼吸圆环图标 */}
    <span className="lw-animal-icon lw-icon-indigo" aria-hidden>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" opacity="0.4" />
        <circle cx="12" cy="12" r="5.5" opacity="0.7" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    </span>
    <span className="lw-animal-label">呼吸引导</span>
  </motion.button>
);

/* ============================================
   3. 萤火虫 —— 翠绿主题，托冥想气泡（适配自 Lab.tsx）
   ============================================ */
const LabFirefly: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.button
    className="lw-animal"
    onClick={onClick}
    whileHover={{ scale: 1.05, y: -6 }}
    whileTap={{ scale: 0.97 }}
    data-clickable
    aria-label="冥想空间"
  >
    <motion.div
      className="lw-animal-float"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    >
      <svg width="90" height="110" viewBox="0 0 90 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="lw-firefly-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d8f5e0" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#7fc4a0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4a8a6a" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* 光晕 —— 翠绿 */}
        <circle cx="45" cy="55" r="35" fill="url(#lw-firefly-glow)" />
        {/* 翅膀 */}
        <ellipse cx="35" cy="50" rx="12" ry="18" fill="#d8f5e0" opacity="0.5" transform="rotate(-20 35 50)" />
        <ellipse cx="55" cy="50" rx="12" ry="18" fill="#d8f5e0" opacity="0.5" transform="rotate(20 55 50)" />
        {/* 身体 */}
        <ellipse cx="45" cy="58" rx="8" ry="14" fill="#7fc4a0" stroke="#4a8a6a" strokeWidth="1" />
        {/* 头部 */}
        <circle cx="45" cy="42" r="7" fill="#a8d8bf" stroke="#4a8a6a" strokeWidth="1" />
        {/* 眼睛 */}
        <circle cx="42" cy="41" r="1.5" fill="#3d2b1f" />
        <circle cx="48" cy="41" r="1.5" fill="#3d2b1f" />
        {/* 笑容 */}
        <path d="M42 45 Q45 47 48 45" stroke="#4a8a6a" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        {/* 发光腹部 */}
        <ellipse cx="45" cy="62" rx="5" ry="6" fill="#d8f5e0" opacity="0.9" />
        <ellipse cx="45" cy="62" rx="3" ry="4" fill="#f0fff5" />
        {/* 手托气泡 */}
        <path d="M45 50 L45 25" stroke="#4a8a6a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="45" cy="22" r="4" fill="#a8d8bf" stroke="#4a8a6a" strokeWidth="0.8" />
        {/* 冥想气泡 + 莲花 */}
        <circle cx="45" cy="15" r="10" fill="#d8f5e0" opacity="0.4" stroke="#7fc4a0" strokeWidth="0.8" />
        <circle cx="45" cy="15" r="6" fill="#f0fff5" opacity="0.5" />
        <text x="45" y="18" textAnchor="middle" fill="#4a8a6a" fontSize="7" fontStyle="italic">ॐ</text>
      </svg>
    </motion.div>
    {/* 莲花图标 */}
    <span className="lw-animal-icon lw-icon-emerald" aria-hidden>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M12 21c0-4 0-7 0-7" strokeLinecap="round" />
        <path d="M12 14c-3 0-6-2-6-5 3 0 6 2 6 5zM12 14c3 0 6-2 6-5-3 0-6 2-6 5zM12 14c0-3-1.5-6-4-7 0 3 1.5 6 4 7zM12 14c0-3 1.5-6 4-7 0 3-1.5 6-4 7z" strokeLinejoin="round" />
      </svg>
    </span>
    <span className="lw-animal-label">冥想空间</span>
  </motion.button>
);

/* ============================================
   4. 主组件
   ============================================ */
const LabWorld: React.FC = () => {
  const { back } = useView();
  const [activeModule, setActiveModule] = useState<ModuleId | null>(null);
  const [exiting, setExiting] = useState(false);

  // 点击窗户：变亮透出森林光 → 返回森林
  const handleWindowClick = () => {
    if (exiting) return;
    setExiting(true);
    window.setTimeout(() => back(), 560);
  };

  // 左上角按钮：推门出去
  const handleBackBtn = () => {
    if (exiting) return;
    setExiting(true);
    window.setTimeout(() => back(), 420);
  };

  return (
    <motion.section
      className="labworld-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 室内整体 —— 推门进入：放大 + 模糊到清晰 */}
      <motion.div
        className="lw-interior"
        initial={{ scale: 1.2, filter: "blur(8px)", opacity: 0 }}
        animate={
          exiting
            ? { scale: 1.06, filter: "blur(5px)", opacity: 0.4 }
            : { scale: 1, filter: "blur(0px)", opacity: 1 }
        }
        transition={{ duration: exiting ? 0.4 : 0.85, ease: "easeOut" }}
      >
        {/* 墙壁 + 木纹 */}
        <div className="lw-walls" />
        {/* 噪点 */}
        <svg className="lw-noise" xmlns="http://www.w3.org/2000/svg">
          <filter id="lw-turb">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#lw-turb)" />
        </svg>

        {/* 墙板纹理 SVG */}
        <svg className="lw-planks" viewBox="0 0 1440 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          {[120, 240, 360, 480, 600, 720].map((y) => (
            <line key={y} x1="0" y1={y} x2="1440" y2={y} stroke="#c9a87a" strokeWidth="1" opacity="0.18" />
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 104 + 30} y1="0" x2={i * 104 + 30} y2="760" stroke="#a88a6a" strokeWidth="0.6" opacity="0.12" />
          ))}
        </svg>

        {/* 地板 */}
        <div className="lw-floor">
          <svg className="lw-floor-lines" viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            {[30, 70, 110, 150, 190].map((y) => (
              <line key={y} x1="0" y1={y} x2="1440" y2={y} stroke="#8a6f4a" strokeWidth="1" opacity="0.22" />
            ))}
            {Array.from({ length: 18 }).map((_, i) => (
              <line key={`fv${i}`} x1={i * 84 + 40} y1="0" x2={i * 84 + 20} y2="200" stroke="#6b5040" strokeWidth="0.6" opacity="0.15" />
            ))}
          </svg>
        </div>

        {/* 窗户 —— 透出森林景色，点击返回 */}
        <motion.button
          className={`lw-window ${exiting ? "bright" : ""}`}
          onClick={handleWindowClick}
          data-clickable
          aria-label="推窗回到森林"
          whileHover={{ scale: 1.03 }}
        >
          <svg width="180" height="150" viewBox="0 0 180 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 窗框外圈 */}
            <rect x="2" y="2" width="176" height="146" rx="4" fill="#8a6f4a" stroke="#5a4030" strokeWidth="2" />
            {/* 森林景色 */}
            <rect x="12" y="12" width="156" height="126" fill="url(#lw-sky)" />
            <defs>
              <linearGradient id="lw-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#cfe6f0" />
                <stop offset="60%" stopColor="#e8f0d8" />
                <stop offset="100%" stopColor="#9CAF88" />
              </linearGradient>
            </defs>
            {/* 远树 */}
            <path d="M12 90 L40 60 L68 90 Z" fill="#7d9a6f" opacity="0.8" />
            <path d="M50 95 L82 55 L114 95 Z" fill="#6b8a5f" opacity="0.85" />
            <path d="M96 92 L126 58 L156 92 Z" fill="#7d9a6f" opacity="0.8" />
            {/* 地面 */}
            <rect x="12" y="110" width="156" height="28" fill="#8a9a6f" opacity="0.7" />
            {/* 窗格十字 */}
            <line x1="90" y1="12" x2="90" y2="138" stroke="#5a4030" strokeWidth="3" />
            <line x1="12" y1="75" x2="168" y2="75" stroke="#5a4030" strokeWidth="3" />
            {/* 透出光（白天） */}
            <rect className="lw-window-light" x="12" y="12" width="156" height="126" fill="#fff5b0" opacity="0" />
          </svg>
          <span className="lw-window-hint">推窗回到森林</span>
        </motion.button>

        {/* 壁炉 + 跳动火焰 */}
        <div className="lw-fireplace" aria-hidden>
          <svg width="150" height="160" viewBox="0 0 150 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 壁炉石框 */}
            <path d="M15 160 L15 70 Q15 50 35 48 L115 48 Q135 50 135 70 L135 160 Z" fill="#6b5340" stroke="#3d2b1f" strokeWidth="2" />
            {/* 砖纹 */}
            <line x1="15" y1="90" x2="135" y2="90" stroke="#3d2b1f" strokeWidth="0.8" opacity="0.4" />
            <line x1="15" y1="120" x2="135" y2="120" stroke="#3d2b1f" strokeWidth="0.8" opacity="0.4" />
            <line x1="50" y1="48" x2="50" y2="90" stroke="#3d2b1f" strokeWidth="0.6" opacity="0.3" />
            <line x1="100" y1="48" x2="100" y2="90" stroke="#3d2b1f" strokeWidth="0.6" opacity="0.3" />
            {/* 壁炉口黑色内膛 */}
            <rect x="35" y="80" width="80" height="70" rx="3" fill="#2d1e15" />
            {/* 木柴 */}
            <ellipse cx="60" cy="142" rx="14" ry="4" fill="#5a4030" />
            <ellipse cx="90" cy="142" rx="14" ry="4" fill="#5a4030" />
            {/* 火焰 —— 三层跳动 */}
            <path className="lw-flame lw-flame-1" d="M75 140 C60 120 70 100 75 85 C80 100 90 120 75 140 Z" fill="#ff8a3a" />
            <path className="lw-flame lw-flame-2" d="M75 138 C66 122 72 106 75 95 C78 106 84 122 75 138 Z" fill="#ffc04a" />
            <path className="lw-flame lw-flame-3" d="M75 134 C70 124 73 114 75 107 C77 114 80 124 75 134 Z" fill="#fff5b0" />
          </svg>
        </div>

        {/* 暖光晕（壁炉散发） */}
        <div className="lw-warm-glow" />

        {/* 三只动物围坐 */}
        <div className="lw-animals">
          <LabDeerRabbit onClick={() => setActiveModule("gratitude")} />
          <LabFirefly onClick={() => setActiveModule("meditation")} />
          <LabSloth onClick={() => setActiveModule("breathing")} />
        </div>

        <p className="lw-hint">与小动物围炉而坐，开始一段疗愈练习</p>
      </motion.div>

      {/* 左上角"推门出去"按钮 */}
      <button className="lw-back-btn" onClick={handleBackBtn} data-clickable aria-label="推门出去，回到森林">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z" strokeLinejoin="round" />
          <circle cx="15" cy="12" r="1" fill="currentColor" />
        </svg>
        <span>推门出去</span>
      </button>

      {/* 返回时的暖光涌出 */}
      <AnimatePresence>
        {exiting && (
          <motion.div
            className="lw-exit-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* 跟练模态框 —— 复用 Lab.tsx 的 Modal + 三模块引用模式 */}
      <Modal
        isOpen={activeModule !== null}
        onClose={() => setActiveModule(null)}
        title={activeModule ? moduleInfo[activeModule].title : ""}
        subtitle={activeModule ? moduleInfo[activeModule].subtitle : undefined}
      >
        {activeModule === "gratitude" && <GratitudeJournal />}
        {activeModule === "breathing" && <BreathingGuide />}
        {activeModule === "meditation" && <MeditationSpace />}
      </Modal>

      <style>{`
        /* ===== 场景容器（木屋内部暖色） ===== */
        .labworld-scene {
          position: fixed;
          inset: 0;
          z-index: 20;
          overflow: hidden;
          font-family: "Noto Sans SC", system-ui, sans-serif;
          background: linear-gradient(180deg, #fdfbf5 0%, #f5ead6 55%, #e8d5b8 100%);
        }
        .lw-interior {
          position: absolute;
          inset: 0;
          will-change: transform, filter;
        }

        /* 墙壁木纹 */
        .lw-walls {
          position: absolute; inset: 0;
          background:
            repeating-linear-gradient(0deg, rgba(168,138,106,0.06) 0px, rgba(168,138,106,0.06) 2px, transparent 2px, transparent 118px),
            linear-gradient(180deg, #fdfbf5 0%, #f5ead6 55%, #e8d5b8 100%);
        }
        .lw-noise {
          position: absolute; inset: 0; width: 100%; height: 100%;
          opacity: 0.05; pointer-events: none; mix-blend-mode: multiply;
        }
        .lw-planks {
          position: absolute; inset: 0; width: 100%; height: 100%;
          opacity: 0.5; pointer-events: none;
        }

        /* 地板 */
        .lw-floor {
          position: absolute; left: 0; right: 0; bottom: 0;
          height: 26%;
          background: linear-gradient(180deg, #c4a886 0%, #a88a6a 100%);
          box-shadow: inset 0 8px 18px rgba(60,40,20,0.18);
        }
        .lw-floor-lines {
          position: absolute; inset: 0; width: 100%; height: 100%;
          opacity: 0.6;
        }

        /* 窗户 */
        .lw-window {
          position: absolute; top: 9%; right: 8%;
          z-index: 2;
          background: none; border: none; padding: 0;
          cursor: pointer;
          filter: drop-shadow(0 8px 16px rgba(60,40,20,0.25));
          transition: filter 0.4s ease;
        }
        .lw-window.bright { filter: drop-shadow(0 0 24px rgba(255,245,176,0.9)) brightness(1.3); }
        .lw-window-light { transition: opacity 0.5s ease; }
        .lw-window.bright .lw-window-light { opacity: 0.85 !important; }
        .lw-window-hint {
          position: absolute; bottom: -22px; left: 50%;
          transform: translateX(-50%);
          font-size: 11px; letter-spacing: 0.08em;
          color: #8a6f4a; white-space: nowrap;
          opacity: 0; transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .lw-window:hover .lw-window-hint { opacity: 0.9; }

        /* 壁炉 */
        .lw-fireplace {
          position: absolute; left: 5%; bottom: 14%;
          z-index: 1;
          filter: drop-shadow(0 6px 12px rgba(60,40,20,0.2));
        }
        .lw-flame { transform-origin: 75px 140px; }
        .lw-flame-1 { animation: lw-flicker 2s ease-in-out infinite; }
        .lw-flame-2 { animation: lw-flicker 1.6s ease-in-out infinite reverse; }
        .lw-flame-3 { animation: lw-flicker 1.3s ease-in-out infinite; }
        @keyframes lw-flicker {
          0%, 100% { transform: scale(1, 1);   opacity: 0.95; }
          25%      { transform: scale(0.94, 1.08); opacity: 0.8; }
          50%      { transform: scale(1.06, 0.92); opacity: 1; }
          75%      { transform: scale(0.98, 1.05); opacity: 0.85; }
        }

        /* 暖光晕 */
        .lw-warm-glow {
          position: absolute; left: -4%; bottom: 0;
          width: 60%; height: 70%;
          background: radial-gradient(circle at 18% 80%, rgba(255,180,90,0.32), transparent 55%);
          pointer-events: none; z-index: 1;
          animation: lw-glow-pulse 5s ease-in-out infinite;
        }
        @keyframes lw-glow-pulse {
          0%, 100% { opacity: 0.8; }
          50%      { opacity: 1; }
        }

        /* 三只动物围坐 */
        .lw-animals {
          position: absolute; left: 50%; top: 50%;
          transform: translate(-50%, -42%);
          z-index: 3;
          display: flex; align-items: flex-end; justify-content: center;
          gap: 28px;
        }
        .lw-animal {
          position: relative;
          display: flex; flex-direction: column; align-items: center;
          background: none; border: none; padding: 0;
          cursor: pointer;
        }
        .lw-animal-float { display: block; }
        .lw-animal-icon {
          position: absolute; top: -6px; right: -6px;
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          background: rgba(255, 253, 249, 0.9);
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 4px 10px -4px rgba(60,40,20,0.3);
          animation: lw-icon-bob 3.5s ease-in-out infinite;
        }
        @keyframes lw-icon-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        .lw-icon-pink    { color: #d4756a; }
        .lw-icon-indigo  { color: #5a6a9a; }
        .lw-icon-emerald { color: #4a8a6a; }
        .lw-animal-label {
          margin-top: 6px;
          font-size: 13px; letter-spacing: 0.08em;
          color: #6b5040;
          font-family: "Noto Serif SC", serif;
        }

        /* 提示 */
        .lw-hint {
          position: absolute; bottom: 7%; left: 50%;
          transform: translateX(-50%);
          z-index: 3; margin: 0;
          font-size: 12px; letter-spacing: 0.08em;
          color: #8a6f4a; opacity: 0.7;
          pointer-events: none; white-space: nowrap;
          font-family: "Noto Serif SC", serif;
        }

        /* 返回按钮 */
        .lw-back-btn {
          position: absolute; top: 24px; left: 24px; z-index: 6;
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px;
          font-size: 12px; letter-spacing: 0.05em;
          color: #6b5040;
          background: rgba(255, 253, 249, 0.85);
          border: 1px solid rgba(184, 140, 106, 0.3);
          border-radius: 999px;
          backdrop-filter: blur(6px);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .lw-back-btn:hover {
          color: #b88c6a;
          border-color: #b88c6a;
          transform: translateX(-2px);
        }

        /* 返回暖光涌出 */
        .lw-exit-flash {
          position: fixed; inset: 0; z-index: 5;
          background: radial-gradient(circle at 82% 16%, rgba(255,245,176,0.95), rgba(255,220,150,0.6) 40%, transparent 75%);
          pointer-events: none;
        }

        /* ===== 响应式：移动端单列 ===== */
        @media (max-width: 768px) {
          .lw-window { top: 5%; right: 4%; transform: scale(0.72); transform-origin: top right; }
          .lw-fireplace { left: -2%; bottom: 10%; transform: scale(0.72); transform-origin: bottom left; }
          .lw-animals {
            flex-direction: column; gap: 14px;
            top: 50%; transform: translate(-50%, -50%);
          }
          .lw-animal svg { transform: scale(0.82); }
          .lw-hint { font-size: 11px; width: 84%; white-space: normal; text-align: center; bottom: 4%; }
          .lw-back-btn { top: 14px; left: 14px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lw-flame, .lw-warm-glow, .lw-animal-float, .lw-animal-icon { animation: none; }
        }
      `}</style>
    </motion.section>
  );
};

export default LabWorld;
