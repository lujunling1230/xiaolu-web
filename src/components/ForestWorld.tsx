import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useView } from "../context/ViewContext";
import { useTheme } from "../context/ThemeContext";

/* ============================================
   Web Audio 合成音效 — 木屋门轴摩擦声
   低频锯齿波 + 低通滤波器模拟木质摩擦感（<0.5s）
   ============================================ */
type WindowWithWebkitAudio = Window &
  typeof globalThis & { webkitAudioContext?: typeof AudioContext };

let doorCreakCtx: AudioContext | null = null;

const playDoorCreak = () => {
  try {
    const w = window as WindowWithWebkitAudio;
    const Ctor = w.AudioContext || w.webkitAudioContext;
    if (!Ctor) return;
    if (!doorCreakCtx) doorCreakCtx = new Ctor();
    const ctx = doorCreakCtx;
    if (ctx.state === "suspended") void ctx.resume();

    const now = ctx.currentTime;
    // 锯齿波 150Hz → 128Hz 微下扫，模拟门轴滞涩
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(128, now + 0.4);

    // 低通滤波器削减高频泛音，留下木质摩擦质感
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(620, now);
    filter.Q.value = 1.2;

    // gain 包络：快速起音、缓慢归零
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
    gain.gain.linearRampToValueAtTime(0, now + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.42);
  } catch {
    /* 音频不可用时静默处理，不阻断导航 */
  }
};

/**
 * ForestWorld — 森林主世界枢纽组件
 *
 * 无导航栏单页森林世界核心场景，包含 4 个自然入口：
 * 1. 左下角：主角 + 小鹿 → navigate("about")
 * 2. 中心偏右：大树 + 考拉 + 立体树叶书 → navigate("projects")
 * 3. 右上角：木屋 → navigate("lab")
 * 4. 树枝上：猫头鹰 → navigate("lab")（隐藏捷径）
 *
 * 额外：太阳/月亮主题切换、场景雾气、飘落粒子（白天花瓣/夜间萤火虫）
 */

/* ============================================
   1. 主角 — 坐在小树下，手持小册子（140×180）
   ============================================ */
const Protagonist: React.FC<{ pageFlipping: boolean }> = ({ pageFlipping }) => (
  <div className="fw-protagonist" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))" }}>
    <svg width="140" height="180" viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="fw-char-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fw-leaf-small" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9CAF88" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7d9a6f" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* 地面阴影 */}
      <ellipse cx="70" cy="172" rx="45" ry="6" fill="url(#fw-char-shadow)" />
      {/* 小树冠 — 在主角身后 */}
      <ellipse cx="70" cy="32" rx="32" ry="22" fill="url(#fw-leaf-small)" />
      <ellipse cx="55" cy="28" rx="18" ry="14" fill="#9CAF88" opacity="0.45" />
      <ellipse cx="85" cy="30" rx="16" ry="12" fill="#9CAF88" opacity="0.4" />
      {/* 树干 */}
      <path d="M67 48 L66 92 L74 92 L73 48 Z" fill="#6b5340" stroke="#4a3525" strokeWidth="1" />
      {/* 头部 */}
      <circle cx="70" cy="72" r="18" fill="#fffdf9" stroke="#3d3d3d" strokeWidth="1.8" />
      {/* 头发 */}
      <path d="M53 65 Q58 54 70 55 Q82 54 87 65 Q83 58 70 58 Q57 58 53 65 Z" fill="#3d3d3d" />
      <path d="M52 70 Q50 80 54 86 L58 82 Q54 76 56 70 Z" fill="#3d3d3d" />
      <path d="M88 70 Q90 80 86 86 L82 82 Q86 76 84 70 Z" fill="#3d3d3d" />
      {/* 眼睛 */}
      <circle cx="64" cy="73" r="1.6" fill="#3d3d3d" />
      <circle cx="76" cy="73" r="1.6" fill="#3d3d3d" />
      {/* 腮红 */}
      <ellipse cx="59" cy="80" rx="3" ry="2" fill="#B88C6A" opacity="0.3" />
      <ellipse cx="81" cy="80" rx="3" ry="2" fill="#B88C6A" opacity="0.3" />
      {/* 嘴巴 */}
      <path d="M66 84 Q70 87 74 84" stroke="#3d3d3d" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* 脖子 */}
      <rect x="66" y="89" width="8" height="5" fill="#fffdf9" stroke="#3d3d3d" strokeWidth="1.2" />
      {/* 身体 — 坐姿 */}
      <path d="M54 94 Q50 100 50 114 L52 134 L88 134 L90 114 Q90 100 86 94 Z" fill="#fffdf9" stroke="#3d3d3d" strokeWidth="1.8" />
      <path d="M64 94 L70 101 L76 94" stroke="#3d3d3d" strokeWidth="1.2" fill="none" />
      {/* 手臂 — 抱册子 */}
      <path d="M54 100 Q44 110 52 122" fill="none" stroke="#3d3d3d" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M86 100 Q96 110 88 122" fill="none" stroke="#3d3d3d" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="52" cy="122" r="5" fill="#fffdf9" stroke="#3d3d3d" strokeWidth="1.2" />
      <circle cx="88" cy="122" r="5" fill="#fffdf9" stroke="#3d3d3d" strokeWidth="1.2" />
      {/* 小册子 — 翻页微动画 */}
      <g className="fw-booklet">
        {/* 册子底页 */}
        <rect x="55" y="112" width="30" height="22" rx="2" fill="#fffdf9" stroke="#3d3d3d" strokeWidth="1.2" />
        {/* 书脊 */}
        <line x1="70" y1="113" x2="70" y2="133" stroke="#3d3d3d" strokeWidth="0.8" opacity="0.4" />
        {/* 翻动的那一页 */}
        <motion.rect
          x="70"
          y="113"
          width="14"
          height="20"
          rx="1"
          fill="#fffaf0"
          stroke="#3d3d3d"
          strokeWidth="0.6"
          animate={{
            rotateY: pageFlipping ? -160 : 0,
            opacity: pageFlipping ? 0.6 : 1,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ transformOrigin: "70px 123px" }}
        />
        {/* 左页文字线 */}
        <line x1="58" y1="118" x2="66" y2="118" stroke="#9CAF88" strokeWidth="0.6" opacity="0.6" />
        <line x1="58" y1="122" x2="66" y2="122" stroke="#9CAF88" strokeWidth="0.6" opacity="0.6" />
        <line x1="58" y1="126" x2="64" y2="126" stroke="#9CAF88" strokeWidth="0.6" opacity="0.6" />
        {/* 右页文字线 */}
        <line x1="74" y1="118" x2="82" y2="118" stroke="#9CAF88" strokeWidth="0.6" opacity="0.6" />
        <line x1="74" y1="122" x2="82" y2="122" stroke="#9CAF88" strokeWidth="0.6" opacity="0.6" />
        <line x1="74" y1="126" x2="80" y2="126" stroke="#9CAF88" strokeWidth="0.6" opacity="0.6" />
      </g>
      {/* 腿 — 坐姿向前 */}
      <path d="M52 134 Q44 144 42 156 L50 159 L56 144 Z" fill="#3d3d3d" />
      <path d="M88 134 Q96 144 98 156 L90 159 L84 144 Z" fill="#3d3d3d" />
      {/* 鞋子 */}
      <ellipse cx="44" cy="159" rx="6" ry="3" fill="#B88C6A" />
      <ellipse cx="96" cy="159" rx="6" ry="3" fill="#B88C6A" />
    </svg>
  </div>
);

/* ============================================
   2. 小鹿 — fill=currentColor，100×120，抬头看主角
   ============================================ */
const ForestDeer: React.FC<{
  color: string;
  blinking: boolean;
}> = ({ color, blinking }) => (
  <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color }}>
    <defs>
      <radialGradient id="fw-deer-shadow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#000" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#000" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* 地面阴影 */}
    <ellipse cx="50" cy="112" rx="30" ry="5" fill="url(#fw-deer-shadow)" />
    {/* 鹿身 */}
    <g className="fw-deer-body">
      {/* 身体 */}
      <ellipse cx="42" cy="78" rx="24" ry="17" fill="currentColor" />
      {/* 颈部 — 向上抬 */}
      <path d="M58 72 Q60 55 64 42 L72 44 Q70 58 66 74 Z" fill="currentColor" />
      {/* 头部 — 抬头看主角 */}
      <ellipse cx="68" cy="38" rx="11" ry="10" fill="currentColor" />
      {/* 鼻部 */}
      <ellipse cx="76" cy="34" rx="5" ry="4" fill="currentColor" />
      {/* 鹿角 */}
      <path d="M64 30 L60 18 M60 18 L57 14 M60 18 L63 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M72 30 L76 18 M76 18 L79 14 M76 18 L73 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      {/* 耳朵 — 随白噪音节奏微动 */}
      <g className="fw-deer-ear">
        <ellipse cx="60" cy="30" rx="3" ry="6" fill="currentColor" transform="rotate(-20 60 30)" />
      </g>
      <g className="fw-deer-ear">
        <ellipse cx="76" cy="30" rx="3" ry="6" fill="currentColor" transform="rotate(20 76 30)" />
      </g>
      {/* 前腿 */}
      <path d="M38 92 L36 106 L41 108 L43 94 Z" fill="currentColor" />
      <path d="M48 92 L46 108 L51 109 L53 94 Z" fill="currentColor" />
      {/* 后腿 */}
      <path d="M26 90 L24 106 L29 107 L31 92 Z" fill="currentColor" />
      <path d="M32 92 L30 107 L35 108 L37 93 Z" fill="currentColor" />
      {/* 尾巴 */}
      <ellipse cx="20" cy="74" rx="4" ry="6" fill="currentColor" />
    </g>
    {/* 眼睛 — 眨眼 */}
    {blinking ? (
      <line x1="65" y1="37" x2="71" y2="37" stroke="#fffdf9" strokeWidth="1.5" strokeLinecap="round" />
    ) : (
      <circle cx="68" cy="37" r="1.6" fill="#fffdf9" />
    )}
    {/* 小白点鼻头 */}
    <circle cx="78" cy="33" r="1" fill="#fffdf9" opacity="0.7" />
  </svg>
);

/* ============================================
   3. 大树 + 考拉 + 立体树叶书（260×360）
   ============================================ */
const TreeScene: React.FC<{
  koalaBlinking: boolean;
  bookFlying: boolean;
  bookFlyMotion: { x: number; y: number; rotateX: number; rotateY: number } | null;
  bookHovered: boolean;
  onBookClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onBookHover: (h: boolean) => void;
}> = ({ koalaBlinking, bookFlying, bookFlyMotion, bookHovered, onBookClick, onBookHover }) => (
  <div className="fw-tree-scene" style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))" }}>
    <svg width="260" height="360" viewBox="0 0 260 360" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fw-trunk-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6b5340" />
          <stop offset="50%" stopColor="#8a6f4a" />
          <stop offset="100%" stopColor="#5a4030" />
        </linearGradient>
        <radialGradient id="fw-leaf-radial" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#9CAF88" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#7d9a6f" stopOpacity="0.35" />
        </radialGradient>
        <filter id="fw-noise-texture">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
          <feDisplacementMap in="SourceGraphic" scale="1.2" />
        </filter>
      </defs>

      {/* 树干 */}
      <path
        d="M115 70 Q110 130 112 210 Q113 280 115 350 L145 350 Q147 280 148 210 Q150 130 145 70 Z"
        fill="url(#fw-trunk-grad)"
        stroke="#4a3525"
        strokeWidth="1.5"
      />
      {/* 树干纹理 */}
      <path d="M118 90 Q122 100 118 110 M142 100 Q138 110 142 120 M120 150 Q124 160 120 170 M140 180 Q136 190 140 200 M118 240 Q122 250 118 260 M142 270 Q138 280 142 290" stroke="#4a3525" strokeWidth="0.8" fill="none" opacity="0.4" />
      <ellipse cx="128" cy="130" rx="4" ry="3" fill="#4a3525" opacity="0.3" />
      <ellipse cx="132" cy="220" rx="3" ry="2.5" fill="#4a3525" opacity="0.3" />

      {/* 树枝 */}
      <path d="M118 100 Q90 85 60 70" stroke="#6b5340" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M60 70 Q50 65 42 58" stroke="#6b5340" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M142 95 Q170 78 198 62" stroke="#6b5340" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M198 62 Q208 57 215 50" stroke="#6b5340" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M115 160 Q92 155 65 150" stroke="#6b5340" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M145 155 Q168 150 192 148" stroke="#6b5340" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* 树叶群 — 分组摇摆 */}
      <g className="fw-leaf-cluster fw-leaf-cluster-1">
        <ellipse cx="55" cy="55" rx="30" ry="24" fill="url(#fw-leaf-radial)" />
        <ellipse cx="42" cy="48" rx="18" ry="15" fill="#9CAF88" opacity="0.45" />
        <ellipse cx="70" cy="60" rx="16" ry="13" fill="#9CAF88" opacity="0.35" />
      </g>
      <g className="fw-leaf-cluster fw-leaf-cluster-2">
        <ellipse cx="200" cy="52" rx="32" ry="25" fill="url(#fw-leaf-radial)" />
        <ellipse cx="210" cy="44" rx="18" ry="15" fill="#9CAF88" opacity="0.45" />
        <ellipse cx="185" cy="59" rx="16" ry="13" fill="#9CAF88" opacity="0.35" />
      </g>
      <g className="fw-leaf-cluster fw-leaf-cluster-3">
        <ellipse cx="60" cy="143" rx="26" ry="21" fill="url(#fw-leaf-radial)" />
        <ellipse cx="48" cy="136" rx="15" ry="12" fill="#9CAF88" opacity="0.4" />
      </g>
      <g className="fw-leaf-cluster fw-leaf-cluster-4">
        <ellipse cx="195" cy="140" rx="26" ry="21" fill="url(#fw-leaf-radial)" />
        <ellipse cx="207" cy="133" rx="15" ry="12" fill="#9CAF88" opacity="0.4" />
      </g>
      {/* 顶部树冠 */}
      <g className="fw-leaf-cluster fw-leaf-cluster-top">
        <ellipse cx="130" cy="45" rx="42" ry="32" fill="url(#fw-leaf-radial)" />
        <ellipse cx="113" cy="35" rx="22" ry="18" fill="#9CAF88" opacity="0.4" />
        <ellipse cx="147" cy="38" rx="20" ry="16" fill="#9CAF88" opacity="0.35" />
      </g>
    </svg>

    {/* 考拉 — 坐在树杈上 */}
    <div className="fw-koala-position">
      <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 考拉身体 */}
        <ellipse cx="60" cy="90" rx="32" ry="27" fill="#b8c4cc" stroke="#7a8a92" strokeWidth="1.5" />
        <ellipse cx="60" cy="86" rx="18" ry="20" fill="#d0dae0" opacity="0.6" />
        {/* 头部 */}
        <circle cx="60" cy="54" r="25" fill="#b8c4cc" stroke="#7a8a92" strokeWidth="1.5" />
        {/* 大耳朵 */}
        <circle cx="38" cy="38" r="13" fill="#b8c4cc" stroke="#7a8a92" strokeWidth="1.5" />
        <circle cx="38" cy="38" r="7" fill="#d0dae0" opacity="0.7" />
        <circle cx="82" cy="38" r="13" fill="#b8c4cc" stroke="#7a8a92" strokeWidth="1.5" />
        <circle cx="82" cy="38" r="7" fill="#d0dae0" opacity="0.7" />
        {/* 大鼻子 */}
        <ellipse cx="60" cy="60" rx="9" ry="7" fill="#3d3d3d" />
        <ellipse cx="57" cy="57" rx="2.5" ry="2" fill="#5a5a5a" opacity="0.6" />
        {/* 眼睛 — 眨眼 */}
        {koalaBlinking ? (
          <>
            <line x1="46" y1="48" x2="54" y2="48" stroke="#3d3d3d" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="66" y1="48" x2="74" y2="48" stroke="#3d3d3d" strokeWidth="1.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path className="fw-koala-eye" d="M46 48 Q50 50 54 48" stroke="#3d3d3d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path className="fw-koala-eye" d="M66 48 Q70 50 74 48" stroke="#3d3d3d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </>
        )}
        {/* 嘴巴 */}
        <path d="M57 69 Q60 71 63 69" stroke="#7a8a92" strokeWidth="1" fill="none" strokeLinecap="round" />
        {/* 抱树爪子 */}
        <ellipse cx="34" cy="78" rx="7" ry="5" fill="#b8c4cc" stroke="#7a8a92" strokeWidth="1.2" />
        <ellipse cx="86" cy="78" rx="7" ry="5" fill="#b8c4cc" stroke="#7a8a92" strokeWidth="1.2" />
        {/* 腿 */}
        <ellipse cx="40" cy="120" rx="9" ry="7" fill="#b8c4cc" stroke="#7a8a92" strokeWidth="1.2" />
        <ellipse cx="80" cy="120" rx="9" ry="7" fill="#b8c4cc" stroke="#7a8a92" strokeWidth="1.2" />
      </svg>
    </div>

    {/* 立体树叶书 — 有厚度、叶脉、阴影 */}
    <motion.button
      className="fw-tree-book"
      onClick={onBookClick}
      onMouseEnter={() => onBookHover(true)}
      onMouseLeave={() => onBookHover(false)}
      aria-label="点击打开项目阅读"
      title="书从树上长出来"
      data-clickable
      animate={
        bookFlying && bookFlyMotion
          ? {
              x: bookFlyMotion.x,
              y: bookFlyMotion.y,
              scale: 1.6,
              rotateX: bookFlyMotion.rotateX,
              rotateY: bookFlyMotion.rotateY,
              opacity: 0,
            }
          : { x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0, opacity: 1 }
      }
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <svg className={`fw-book-idle ${bookFlying ? "fw-flying" : ""}`} width="72" height="52" viewBox="0 0 72 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fw-book-cover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9CAF88" />
            <stop offset="100%" stopColor="#7d9a6f" />
          </linearGradient>
          <linearGradient id="fw-book-pages" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fffdf9" />
            <stop offset="100%" stopColor="#e8e0d5" />
          </linearGradient>
        </defs>
        {/* 书的厚度侧面 — 模拟 3D */}
        <rect x="6" y="10" width="60" height="38" rx="1.5" fill="#e8e0d5" stroke="#B88C6A" strokeWidth="0.8" transform="translate(2,2)" opacity="0.6" />
        <rect x="6" y="10" width="60" height="38" rx="1.5" fill="#e8e0d5" stroke="#B88C6A" strokeWidth="0.8" transform="translate(1,1)" opacity="0.8" />
        {/* 书本主体封面 */}
        <rect x="6" y="10" width="60" height="38" rx="1.5" fill="url(#fw-book-cover)" stroke="#5a7a4a" strokeWidth="1.2" />
        {/* 书脊装订线 */}
        <line x1="36" y1="12" x2="36" y2="46" stroke="#5a7a4a" strokeWidth="1" />
        {/* 左页叶脉 */}
        <line className="fw-book-veins" x1="21" y1="14" x2="21" y2="44" stroke="#5a7a4a" strokeWidth="0.5" opacity="0.7" />
        <path className="fw-book-veins" d="M21 20 L14 23 M21 26 L13 29 M21 32 L14 35 M21 38 L15 41" stroke="#5a7a4a" strokeWidth="0.3" opacity="0.5" />
        <path className="fw-book-veins" d="M21 20 L28 23 M21 26 L29 29 M21 32 L28 35 M21 38 L27 41" stroke="#5a7a4a" strokeWidth="0.3" opacity="0.5" />
        {/* 右页叶脉 */}
        <line className="fw-book-veins" x1="51" y1="14" x2="51" y2="44" stroke="#5a7a4a" strokeWidth="0.5" opacity="0.7" />
        <path className="fw-book-veins" d="M51 20 L44 23 M51 26 L43 29 M51 32 L44 35 M51 38 L45 41" stroke="#5a7a4a" strokeWidth="0.3" opacity="0.5" />
        <path className="fw-book-veins" d="M51 20 L58 23 M51 26 L59 29 M51 32 L58 35 M51 38 L57 41" stroke="#5a7a4a" strokeWidth="0.3" opacity="0.5" />
        {/* 书签丝带 */}
        <path d="M58 10 L58 22 L54 18 L50 22 L50 10 Z" fill="#B88C6A" opacity="0.8" />
      </svg>
      {/* 绿色光晕 — hover 时显示 */}
      <div className={`fw-book-glow ${bookHovered ? "active" : ""}`} />
    </motion.button>
  </div>
);

/* ============================================
   4. 木屋（160×140）— 斜屋顶、烟囱、门缝暖光
   ============================================ */
const WoodenHouse: React.FC<{
  doorOpening: boolean;
  doorGlow: boolean;
  doorHovered: boolean;
  onDoorClick: () => void;
  onDoorHover: (h: boolean) => void;
}> = ({ doorOpening, doorGlow, doorHovered, onDoorClick, onDoorHover }) => (
  <div className="fw-house" style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.15))" }}>
    {/* 烟雾粒子 */}
    <div className="fw-smoke-group">
      <div className="fw-smoke fw-smoke-1" />
      <div className="fw-smoke fw-smoke-2" />
      <div className="fw-smoke fw-smoke-3" />
    </div>
    <svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fw-roof-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8a4a3a" />
          <stop offset="100%" stopColor="#6b3a2a" />
        </linearGradient>
        <linearGradient id="fw-wall-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c4a886" />
          <stop offset="100%" stopColor="#a88a6a" />
        </linearGradient>
        <radialGradient id="fw-door-light" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd97a" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#e8a85a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#e8a85a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 屋顶 — 斜屋顶 */}
      <path d="M20 60 L80 20 L140 60 L130 60 L80 28 L30 60 Z" fill="url(#fw-roof-grad)" stroke="#4a2515" strokeWidth="1.5" />
      {/* 屋顶纹理 */}
      <path d="M35 55 L80 30 L125 55" stroke="#4a2515" strokeWidth="0.5" opacity="0.3" fill="none" />

      {/* 烟囱 */}
      <rect x="105" y="28" width="14" height="22" fill="#8a6f4a" stroke="#4a3525" strokeWidth="1.2" />
      <rect x="103" y="26" width="18" height="5" rx="1" fill="#6b5340" stroke="#4a3525" strokeWidth="1" />

      {/* 墙体 */}
      <rect x="30" y="60" width="100" height="68" fill="url(#fw-wall-grad)" stroke="#6b5040" strokeWidth="1.5" />
      {/* 木板纹理 */}
      <line x1="30" y1="80" x2="130" y2="80" stroke="#6b5040" strokeWidth="0.6" opacity="0.4" />
      <line x1="30" y1="100" x2="130" y2="100" stroke="#6b5040" strokeWidth="0.6" opacity="0.4" />
      <line x1="55" y1="60" x2="55" y2="128" stroke="#6b5040" strokeWidth="0.4" opacity="0.3" />
      <line x1="105" y1="60" x2="105" y2="128" stroke="#6b5040" strokeWidth="0.4" opacity="0.3" />

      {/* 窗户 — 左侧 */}
      <rect x="38" y="72" width="16" height="16" rx="1" fill="#ffd97a" opacity="0.6" stroke="#4a3525" strokeWidth="1" />
      <line x1="46" y1="72" x2="46" y2="88" stroke="#4a3525" strokeWidth="0.6" />
      <line x1="38" y1="80" x2="54" y2="80" stroke="#4a3525" strokeWidth="0.6" />

      {/* 门后暖光 — 透过门缝 */}
      <ellipse cx="80" cy="110" rx="22" ry="26" fill="url(#fw-door-light)" className={`fw-door-glow ${doorHovered ? "bright" : ""}`} />

      {/* 门 — 可旋转打开 */}
      <motion.g
        animate={{ rotateY: doorOpening ? -65 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ transformOrigin: "68px 128px" }}
        onClick={onDoorClick}
        onMouseEnter={() => onDoorHover(true)}
        onMouseLeave={() => onDoorHover(false)}
        className="fw-door-clickable"
      >
        <rect x="68" y="86" width="24" height="42" rx="2" fill="#5a4030" stroke="#2d1e15" strokeWidth="1.5" />
        <line x1="73" y1="92" x2="87" y2="92" stroke="#2d1e15" strokeWidth="0.5" opacity="0.4" />
        <line x1="73" y1="102" x2="87" y2="102" stroke="#2d1e15" strokeWidth="0.5" opacity="0.4" />
        <line x1="73" y1="112" x2="87" y2="112" stroke="#2d1e15" strokeWidth="0.5" opacity="0.4" />
        {/* 门把手 */}
        <circle cx="86" cy="108" r="2" fill="#c9a87a" stroke="#8a6f4a" strokeWidth="0.6" />
        {/* 门缝光线 */}
        <line x1="68" y1="88" x2="68" y2="126" stroke="#ffd97a" strokeWidth="1.5" opacity="0.8" />
      </motion.g>

      {/* 门前台阶 */}
      <rect x="62" y="126" width="36" height="4" rx="1" fill="#8a6f4a" stroke="#4a3525" strokeWidth="0.8" />
    </svg>
    {/* 开门瞬间叠加的极淡白色 glow — 0.3s 淡入淡出 */}
    <div className={`fw-door-flash ${doorGlow ? "active" : ""}`} />
  </div>
);

/* ============================================
   5. 猫头鹰（50×60）— 停在树枝上
   ============================================ */
const Owl: React.FC<{
  turning: boolean;
  isNight: boolean;
  onClick: () => void;
}> = ({ turning, isNight, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className={`fw-owl ${isNight ? "fw-owl-night" : "fw-owl-day"}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      aria-label="猫头鹰隐藏入口"
      data-clickable
      animate={turning ? { rotate: [0, -15, 15, 0] } : { rotate: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      whileHover={{ scale: 1.12 }}
      style={{ filter: isNight ? "drop-shadow(0 0 6px rgba(255,230,150,0.6))" : "drop-shadow(0 3px 5px rgba(0,0,0,0.15))" }}
    >
      <svg className="fw-owl-svg" width="50" height="60" viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 身体 */}
        <ellipse cx="25" cy="35" rx="16" ry="20" fill="#6b5340" stroke="#3d2b1f" strokeWidth="1.5" />
        {/* 肚子纹理 */}
        <ellipse cx="25" cy="38" rx="10" ry="14" fill="#8a7a60" opacity="0.5" />
        <path d="M20 32 Q22 35 20 38 M25 30 Q27 33 25 36 M30 32 Q32 35 30 38" stroke="#6b5340" strokeWidth="0.5" fill="none" opacity="0.4" />
        {/* 头部耳簇 */}
        <path d="M12 18 L10 8 L16 16 Z" fill="#6b5340" stroke="#3d2b1f" strokeWidth="1" />
        <path d="M38 18 L40 8 L34 16 Z" fill="#6b5340" stroke="#3d2b1f" strokeWidth="1" />
        {/* 大眼睛底盘 */}
        <circle cx="18" cy="24" r="7" fill="#fffdf9" stroke="#3d2b1f" strokeWidth="1.2" />
        <circle cx="32" cy="24" r="7" fill="#fffdf9" stroke="#3d2b1f" strokeWidth="1.2" />
        {/* 眼珠 — 夜间睁眼(金色发光) / 白天闭眼(午睡眯线) */}
        {isNight ? (
          <>
            <circle className="fw-owl-eye" cx="18" cy="24" r="3.5" fill="#ffd97a" />
            <circle className="fw-owl-eye" cx="32" cy="24" r="3.5" fill="#ffd97a" />
            <circle cx="18" cy="23" r="1.2" fill="#fffdf9" />
            <circle cx="32" cy="23" r="1.2" fill="#fffdf9" />
          </>
        ) : (
          /* 白天闭眼 — 午睡眯线（Zzz 感） */
          <>
            <path d="M14 24 Q18 26.5 22 24" stroke="#3d2b1f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M28 24 Q32 26.5 36 24" stroke="#3d2b1f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </>
        )}
        {/* 喙 */}
        <path d="M25 28 L22 32 L28 32 Z" fill="#B88C6A" stroke="#8a6f4a" strokeWidth="0.6" />
        {/* 翅膀 */}
        <path d="M11 32 Q8 42 12 50" stroke="#3d2b1f" strokeWidth="1" fill="#6b5340" />
        <path d="M39 32 Q42 42 38 50" stroke="#3d2b1f" strokeWidth="1" fill="#6b5340" />
        {/* 爪子 — 抓树枝 */}
        <path d="M20 54 L18 58 M22 54 L22 58 M24 54 L26 58" stroke="#B88C6A" strokeWidth="1" strokeLinecap="round" />
        <path d="M28 54 L26 58 M30 54 L30 58 M32 54 L34 58" stroke="#B88C6A" strokeWidth="1" strokeLinecap="round" />
      </svg>

      {/* 白天午睡：半透明树叶遮挡层（视觉上"缩在树叶后"） */}
      {!isNight && (
        <svg
          className="fw-owl-leaf-cover"
          width="58"
          height="50"
          viewBox="0 0 58 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <ellipse cx="20" cy="20" rx="14" ry="9" fill="#9CAF88" opacity="0.55" transform="rotate(-25 20 20)" />
          <ellipse cx="38" cy="16" rx="12" ry="8" fill="#9CAF88" opacity="0.5" transform="rotate(20 38 16)" />
          <ellipse cx="30" cy="34" rx="13" ry="8" fill="#7d9a6f" opacity="0.45" transform="rotate(-10 30 34)" />
        </svg>
      )}

      {/* 白天 hover 提示文案 — React 状态控制，避免 CSS :hover 与 Framer Motion 冲突 */}
      {!isNight && (
        <div
          className="fw-owl-tooltip"
          style={{ opacity: hovered ? 0.95 : 0, transform: `translateX(-50%) translateY(${hovered ? -2 : 0}px)` }}
        >
          白天的猫头鹰在午睡，别吵它～ 晚上它会醒来带你进疗愈室。
        </div>
      )}
    </motion.div>
  );
};

/* ============================================
   6. 太阳 / 月亮 — 主题切换（48×48）
   ============================================ */
const CelestialBody: React.FC<{ isDay: boolean; onToggle: () => void }> = ({ isDay, onToggle }) => (
  <motion.button
    className="fw-celestial"
    onClick={onToggle}
    aria-label={isDay ? "切换到夜间模式" : "切换到白天模式"}
    data-clickable
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    animate={{ rotate: isDay ? 360 : 0 }}
    transition={{ rotate: { duration: 40, repeat: Infinity, ease: "linear" } }}
  >
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="fw-sun-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe08a" />
          <stop offset="100%" stopColor="#e8a85a" />
        </radialGradient>
        <radialGradient id="fw-moon-grad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f0f0f8" />
          <stop offset="100%" stopColor="#c8c8d8" />
        </radialGradient>
      </defs>
      {isDay ? (
        <>
          {/* 太阳光芒 */}
          <g stroke="#e8a85a" strokeWidth="2" strokeLinecap="round">
            <line x1="24" y1="2" x2="24" y2="8" />
            <line x1="24" y1="40" x2="24" y2="46" />
            <line x1="2" y1="24" x2="8" y2="24" />
            <line x1="40" y1="24" x2="46" y2="24" />
            <line x1="8" y1="8" x2="12" y2="12" />
            <line x1="36" y1="36" x2="40" y2="40" />
            <line x1="40" y1="8" x2="36" y2="12" />
            <line x1="12" y1="36" x2="8" y2="40" />
          </g>
          {/* 太阳本体 */}
          <circle cx="24" cy="24" r="12" fill="url(#fw-sun-grad)" stroke="#d49a4a" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="3" fill="#fff5b0" opacity="0.6" />
        </>
      ) : (
        <>
          {/* 月亮光晕 */}
          <circle cx="24" cy="24" r="20" fill="#e8e8f0" opacity="0.15" />
          {/* 月亮本体 */}
          <path d="M30 8 Q18 10 16 24 Q18 38 30 40 Q20 40 14 30 Q10 24 14 18 Q20 8 30 8 Z" fill="url(#fw-moon-grad)" stroke="#a8a8b8" strokeWidth="1.2" />
          {/* 陨石坑 */}
          <circle cx="22" cy="18" r="2" fill="#a8a8b8" opacity="0.4" />
          <circle cx="26" cy="26" r="1.5" fill="#a8a8b8" opacity="0.3" />
          <circle cx="20" cy="28" r="1" fill="#a8a8b8" opacity="0.3" />
          {/* 星星 */}
          <circle cx="38" cy="14" r="1" fill="#fffdf9" />
          <circle cx="40" cy="22" r="0.8" fill="#fffdf9" />
          <circle cx="36" cy="30" r="0.6" fill="#fffdf9" />
        </>
      )}
    </svg>
  </motion.button>
);

/* ============================================
   7. 飘落粒子 — 白天花瓣/叶片，夜间萤火虫
   ============================================ */
const FallingParticles: React.FC<{ isDay: boolean }> = ({ isDay }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        left: 10 + i * 18 + Math.random() * 8,
        size: isDay ? 10 + Math.random() * 8 : 6 + Math.random() * 4,
        delay: i * 1.8 + Math.random() * 2,
        duration: 9 + Math.random() * 5,
        drift: (Math.random() - 0.5) * 80,
        rotate: Math.random() * 360,
      })),
    [isDay]
  );

  return (
    <div className="fw-particles-layer">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`fw-particle ${isDay ? "fw-particle-day" : "fw-particle-night"}`}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--fw-drift" as string]: `${p.drift}px`,
            ["--fw-rotate" as string]: `${p.rotate}deg`,
          }}
        >
          {isDay ? (
            <svg width={p.size} height={p.size} viewBox="0 0 12 12" fill="none">
              <ellipse cx="6" cy="6" rx="5" ry="3" fill={p.id % 2 === 0 ? "#9CAF88" : "#B88C6A"} opacity="0.6" transform={`rotate(${p.rotate} 6 6)`} />
              <line x1="1" y1="6" x2="11" y2="6" stroke="#7d9a6f" strokeWidth="0.3" opacity="0.5" />
            </svg>
          ) : (
            <div
              style={{
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: "radial-gradient(circle, #fff5b0 0%, #e8c87a 50%, transparent 100%)",
                boxShadow: "0 0 8px 2px rgba(255,230,150,0.6)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

/* ============================================
   主组件 ForestWorld
   ============================================ */
const ForestWorld: React.FC = () => {
  const { navigate } = useView();
  const { isDay, isNight, toggleTheme } = useTheme();

  // 小鹿状态
  const [deerBlinking, setDeerBlinking] = useState(false);
  const [deerHovered, setDeerHovered] = useState(false);

  // 主角翻页
  const [pageFlipping, setPageFlipping] = useState(false);

  // 考拉 & 书
  // koalaBlinking 不再由 React 定时驱动，改由 CSS @keyframes fw-koala-blink 平滑眨眼
  const [koalaBlinking] = useState(false);
  const [bookFlying, setBookFlying] = useState(false);
  const [bookFlyMotion, setBookFlyMotion] = useState<{
    x: number;
    y: number;
    rotateX: number;
    rotateY: number;
  } | null>(null);
  const [bookHovered, setBookHovered] = useState(false);

  // 木屋门
  const [doorOpening, setDoorOpening] = useState(false);
  const [doorGlow, setDoorGlow] = useState(false);
  const [doorHovered, setDoorHovered] = useState(false);

  // 猫头鹰
  // 眨眼改由 CSS @keyframes fw-owl-blink 驱动（6s 循环），无需 React 定时器
  const [owlTurning, setOwlTurning] = useState(false);

  /* —— 主角翻页循环（每 6s 翻一次）—— */
  useEffect(() => {
    const interval = setInterval(() => {
      setPageFlipping(true);
      const t = setTimeout(() => setPageFlipping(false), 450);
      return () => clearTimeout(t);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  /* —— 考拉眨眼改由 CSS @keyframes fw-koala-blink 驱动（6s 循环），无需 React 定时器 —— */

  /* —— 猫头鹰眨眼改由 CSS @keyframes fw-owl-blink 驱动（6s 循环），无需 React 定时器 —— */

  /* —— 交互处理 —— */
  // 点击小鹿 → 眨眼 → 导航 about
  const handleDeerClick = () => {
    setDeerBlinking(true);
    setTimeout(() => {
      setDeerBlinking(false);
      navigate("about");
    }, 250);
  };

  // 点击书 → 捕获鼠标方向，书"飞向你" → 导航 projects
  const handleBookClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // 书中心 → 鼠标的方向向量（飞向你点击的位置）
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    setBookFlyMotion({
      x: dx,
      y: dy,
      // 方向决定轻微的 3D 倾斜，模拟"扑面飞来"
      rotateX: Math.max(-12, Math.min(12, dy * 0.12)),
      rotateY: Math.max(-12, Math.min(12, dx * 0.12)),
    });
    setBookFlying(true);
    setTimeout(() => {
      navigate("projects");
      setBookFlying(false);
      setBookFlyMotion(null);
    }, 600);
  };

  // 点击门 → 门轴音效 + 开门 glow → 导航 lab
  const handleDoorClick = () => {
    playDoorCreak();
    setDoorOpening(true);
    setDoorGlow(true);
    // glow 0.3s 淡入后淡出
    setTimeout(() => setDoorGlow(false), 300);
    setTimeout(() => {
      navigate("lab");
      setDoorOpening(false);
    }, 500);
  };

  // 点击猫头鹰 → 转头 → 导航 lab
  const handleOwlClick = () => {
    setOwlTurning(true);
    setTimeout(() => {
      navigate("lab");
      setOwlTurning(false);
    }, 500);
  };

  // 小鹿颜色 — 昼夜切换
  const deerColor = isDay ? "#8a6f4a" : "#2a2a3a";

  // 入场动画 variants
  const sceneVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1, staggerChildren: 0.18, when: "beforeChildren" },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      className={`fw-scene fixed inset-0 z-10 ${isDay ? "fw-day" : "fw-night"}`}
      variants={sceneVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ===== 氧气感背景：暖绿雾感渐变 + 径向光斑 ===== */}
      <div className="fw-sky-bg" />
      <div className="fw-light-spots" />
      {/* 远山剪影 */}
      <svg className="fw-distant-hills" viewBox="0 0 1200 300" preserveAspectRatio="none">
        <path d="M0 300 L0 180 L120 120 L250 170 L380 100 L520 160 L680 90 L820 150 L960 110 L1100 160 L1200 130 L1200 300 Z" fill={isDay ? "#8aa888" : "#1a2a1a"} opacity="0.22" />
        <path d="M0 300 L0 220 L150 170 L300 210 L450 160 L600 200 L750 170 L900 200 L1050 180 L1200 210 L1200 300 Z" fill={isDay ? "#6d8a6f" : "#0f1a0f"} opacity="0.28" />
      </svg>
      {/* 纸张/植物质感噪点 */}
      <div className="fw-paper-texture" />

      {/* ===== 飘落粒子（远景层） ===== */}
      <motion.div variants={itemVariants} className="fw-layer-far-particles">
        <FallingParticles isDay={isDay} />
      </motion.div>

      {/* ===== 太阳 / 月亮（右上远景） ===== */}
      <motion.div
        className="fw-celestial-wrapper absolute top-[5%] right-[8%] max-md:top-[4%] max-md:right-[6%]"
        variants={itemVariants}
      >
        <CelestialBody isDay={isDay} onToggle={toggleTheme} />
      </motion.div>

      {/* ===== 左上远景：木屋（blur + 低 opacity） ===== */}
      <motion.div
        className="fw-house-group fw-layer-far absolute top-[10%] left-[6%] max-md:top-[6%] max-md:left-[3%]"
        variants={itemVariants}
      >
        <WoodenHouse
          doorOpening={doorOpening}
          doorGlow={doorGlow}
          doorHovered={doorHovered}
          onDoorClick={handleDoorClick}
          onDoorHover={setDoorHovered}
        />
      </motion.div>

      {/* ===== 右上远景：猫头鹰（小、淡） ===== */}
      <motion.div
        className="fw-owl-position fw-layer-far absolute top-[16%] right-[18%] max-md:top-[14%] max-md:right-[12%]"
        variants={itemVariants}
      >
        <Owl
          turning={owlTurning}
          isNight={isNight}
          onClick={handleOwlClick}
        />
      </motion.div>

      {/* ===== 中景：大树 + 考拉 + 立体树叶书（微 blur） ===== */}
      <motion.div
        className="fw-tree-group fw-layer-mid absolute top-[18%] right-[10%] max-md:top-[22%] max-md:right-[3%] max-md:left-[3%]"
        variants={itemVariants}
      >
        <TreeScene
          koalaBlinking={koalaBlinking}
          bookFlying={bookFlying}
          bookFlyMotion={bookFlyMotion}
          bookHovered={bookHovered}
          onBookClick={handleBookClick}
          onBookHover={setBookHovered}
        />
      </motion.div>

      {/* ===== 左下前景：主角 + 小鹿（清晰、大） ===== */}
      <motion.div
        className="fw-character-group fw-layer-near absolute bottom-[6%] left-[6%] max-md:bottom-[4%] max-md:left-[2%]"
        variants={itemVariants}
      >
        <div className="fw-protagonist-wrapper">
          <Protagonist pageFlipping={pageFlipping} />
        </div>
        {/* 小鹿 — 在主角右侧，抬头看主角 */}
        <motion.div
          className="fw-deer-wrapper"
          style={{ color: deerColor }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          onMouseEnter={() => setDeerHovered(true)}
          onMouseLeave={() => setDeerHovered(false)}
          onClick={handleDeerClick}
          role="button"
          aria-label="走进花地"
          data-clickable
        >
          <motion.div
            animate={{ opacity: deerHovered ? 1 : 0.88 }}
            transition={{ duration: 0.3 }}
          >
            <ForestDeer
              color={deerColor}
              blinking={deerBlinking}
            />
          </motion.div>
          {/* 提示标签 */}
          <motion.span
            className="fw-hint-label"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: deerHovered ? 1 : 0, y: deerHovered ? 0 : 5 }}
            transition={{ duration: 0.25 }}
          >
            走进花地
          </motion.span>
        </motion.div>
      </motion.div>

      {/* ===== 场景雾气（底部） ===== */}
      <div className="fw-fog-layer fw-fog-1" />
      <div className="fw-fog-layer fw-fog-2" />

      {/* ===== 自定义 CSS（含 keyframes）===== */}
      <style>{`
        /* ===== 场景容器 + 8s 微呼吸 ===== */
        .fw-scene {
          overflow: hidden;
          font-family: -apple-system, "Noto Serif SC", serif;
          --fw-brown: #B88C6A;
          --fw-sage: #9CAF88;
          --fw-dark: #3d3d3d;
          --fw-cream: #fffdf9;
          pointer-events: none;
          animation: fw-scene-breathe 8s ease-in-out infinite;
        }
        @keyframes fw-scene-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.012); }
        }
        /* 交互元素重新启用点击 */
        .fw-character-group,
        .fw-tree-group,
        .fw-house-group,
        .fw-celestial-wrapper,
        .fw-owl-position {
          pointer-events: auto;
        }

        /* ===== 三层景深：远景模糊 → 前景清晰 ===== */
        .fw-layer-far {
          filter: blur(3px);
          opacity: 0.55;
          transition: filter 0.8s ease, opacity 0.8s ease;
        }
        .fw-layer-far:hover {
          filter: blur(1.5px);
          opacity: 0.75;
        }
        .fw-layer-far-particles {
          filter: blur(2px);
          opacity: 0.6;
        }
        .fw-layer-mid {
          filter: blur(0.8px);
          transition: filter 0.4s ease;
        }
        .fw-layer-mid:hover {
          filter: blur(0px);
        }
        .fw-layer-near {
          filter: blur(0px);
        }

        /* ===== 氧气感背景：暖绿雾感渐变（低饱和度） ===== */
        .fw-sky-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          transition: background 1.2s ease-in-out;
        }
        .fw-day .fw-sky-bg {
          background:
            linear-gradient(165deg, #e8efe2 0%, #dde8d8 30%, #e2ddd0 60%, #d8d0c2 100%);
        }
        .fw-night .fw-sky-bg {
          background:
            linear-gradient(165deg, #121826 0%, #1a2030 35%, #202538 70%, #1e2235 100%);
        }

        /* 径向光斑 — 模拟清晨森林透光 */
        .fw-light-spots {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 40% 35% at 30% 25%, rgba(255, 250, 220, 0.18) 0%, transparent 60%),
            radial-gradient(ellipse 35% 30% at 70% 20%, rgba(200, 220, 180, 0.12) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 45% 75%, rgba(180, 200, 160, 0.1) 0%, transparent 70%);
          transition: opacity 1.2s ease;
        }
        .fw-night .fw-light-spots {
          opacity: 0.3;
          background:
            radial-gradient(ellipse 40% 35% at 30% 25%, rgba(180, 190, 220, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 35% 30% at 70% 20%, rgba(160, 170, 200, 0.06) 0%, transparent 65%);
        }

        /* 纸张/植物质感噪点 */
        .fw-paper-texture {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .fw-night .fw-paper-texture { opacity: 0.05; }

        /* ===== 远山 ===== */
        .fw-distant-hills {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 40%;
          z-index: 1;
          pointer-events: none;
          transition: opacity 1s ease;
        }

        /* ===== 飘落粒子 ===== */
        .fw-layer-far-particles {
          position: absolute;
          inset: 0;
          z-index: 2;
          overflow: hidden;
        }
        .fw-particle {
          position: absolute;
          top: -30px;
          animation-name: fw-fall;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
        .fw-particle-day {
          opacity: 0.7;
        }
        .fw-particle-night {
          opacity: 0.9;
          animation-name: fw-fall-glow;
        }
        @keyframes fw-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 0.7; }
          50% {
            transform: translateY(50vh) translateX(var(--fw-drift, 30px)) rotate(180deg);
          }
          90% { opacity: 0.7; }
          100% {
            transform: translateY(105vh) translateX(calc(var(--fw-drift, 30px) * 1.5)) rotate(var(--fw-rotate, 360deg));
            opacity: 0;
          }
        }
        @keyframes fw-fall-glow {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% { opacity: 0.9; }
          50% {
            transform: translateY(50vh) translateX(var(--fw-drift, 20px));
            opacity: 1;
          }
          90% { opacity: 0.6; }
          100% {
            transform: translateY(105vh) translateX(calc(var(--fw-drift, 20px) * 1.5));
            opacity: 0;
          }
        }

        /* ===== 太阳/月亮 ===== */
        .fw-celestial-wrapper {
          z-index: 3;
        }
        .fw-celestial {
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          display: block;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.1));
        }

        /* ===== 主角 + 小鹿 ===== */
        .fw-character-group {
          z-index: 6;
          display: flex;
          align-items: flex-end;
          gap: 8px;
        }
        .fw-protagonist-wrapper {
          position: relative;
        }
        .fw-protagonist {
          opacity: 0.95;
          animation: fw-breathe 5s ease-in-out infinite;
          filter: drop-shadow(0 4px 12px rgba(60, 80, 60, 0.18));
        }
        @keyframes fw-breathe {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-2px) scale(1.005); }
        }
        .fw-deer-wrapper {
          position: relative;
          cursor: pointer;
          margin-left: -10px;
          margin-bottom: 10px;
        }
        .fw-hint-label {
          position: absolute;
          top: -28px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-size: 11px;
          color: var(--fw-brown);
          background: rgba(255, 253, 249, 0.85);
          padding: 3px 10px;
          border-radius: 10px;
          border: 1px solid rgba(184, 140, 106, 0.3);
          pointer-events: none;
          letter-spacing: 1px;
        }

        /* ===== 大树场景 ===== */
        .fw-tree-group {
          z-index: 4;
        }
        .fw-tree-scene {
          position: relative;
          width: 260px;
          height: 360px;
        }
        /* 树叶簇摇摆动画 */
        .fw-leaf-cluster {
          transform-box: fill-box;
          transform-origin: center bottom;
        }
        .fw-leaf-cluster-1 {
          animation: fw-sway 7s ease-in-out infinite;
          transform-origin: 55px 70px;
        }
        .fw-leaf-cluster-2 {
          animation: fw-sway 8s ease-in-out infinite;
          animation-delay: -1s;
          transform-origin: 200px 68px;
        }
        .fw-leaf-cluster-3 {
          animation: fw-sway 6s ease-in-out infinite;
          animation-delay: -2s;
          transform-origin: 60px 150px;
        }
        .fw-leaf-cluster-4 {
          animation: fw-sway 9s ease-in-out infinite;
          animation-delay: -3s;
          transform-origin: 195px 148px;
        }
        .fw-leaf-cluster-top {
          animation: fw-sway 7.5s ease-in-out infinite;
          animation-delay: -1.5s;
          transform-origin: 130px 60px;
        }
        @keyframes fw-sway {
          0%, 100% { transform: rotate(-2deg) translateX(0); }
          50% { transform: rotate(2deg) translateX(2px); }
        }

        /* 考拉定位 — 树杈位置 */
        .fw-koala-position {
          position: absolute;
          top: 145px;
          left: 70px;
          z-index: 2;
          animation: fw-koala-breathe 4s ease-in-out infinite;
        }
        @keyframes fw-koala-breathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }

        /* 立体树叶书定位 — 考拉爪子位置 */
        .fw-tree-book {
          position: absolute;
          top: 215px;
          left: 88px;
          z-index: 3;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          filter: drop-shadow(0 3px 6px rgba(0,0,0,0.2));
          perspective: 240px;
        }
        .fw-book-glow {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(156, 175, 136, 0.4) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .fw-book-glow.active {
          opacity: 1;
        }

        /* ===== 魔法生命力细节 ===== */
        /* 树叶书 idle：轻微合上再翻开 15 度，像在等人看 */
        .fw-book-idle {
          transform-box: fill-box;
          transform-origin: center center;
          animation: fw-book-idle 3s ease-in-out infinite;
          will-change: transform;
        }
        .fw-book-idle.fw-flying {
          animation-play-state: paused;
        }
        @keyframes fw-book-idle {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(15deg); }
          100% { transform: rotateY(0deg); }
        }
        /* 叶脉 hover：goldenrod 发光 + 透明度 0.2→0.5 */
        .fw-book-veins {
          opacity: 0.2;
          transition: opacity 0.4s ease, filter 0.4s ease;
        }
        .fw-tree-book:hover .fw-book-veins {
          opacity: 0.5;
          filter: drop-shadow(0 0 4px rgba(218, 165, 32, 0.5));
        }

        /* 考拉眨眼 — scaleY 压扁 */
        .fw-koala-eye {
          transform-box: fill-box;
          transform-origin: center;
          animation: fw-koala-blink 6s ease-in-out infinite;
        }
        @keyframes fw-koala-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          93%, 97% { transform: scaleY(0.1); }
        }

        /* 小鹿耳朵 — 随白噪音节奏微动 */
        .fw-deer-ear {
          transform-box: fill-box;
          transform-origin: center bottom;
          animation: fw-deer-ear-wiggle 4s ease-in-out infinite;
        }
        @keyframes fw-deer-ear-wiggle {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.03); }
        }

        /* ===== 猫头鹰定位（右上远景，独立于树组） ===== */
        .fw-owl-position {
          z-index: 3;
        }
        .fw-owl {
          cursor: pointer;
          transform-origin: center bottom;
          position: relative;
        }
        /* 夜晚：完全显示，睁眼发光 */
        .fw-owl-night {
          opacity: 1;
        }
        /* 白天：半隐藏，午睡状态 */
        .fw-owl-day {
          opacity: 0.6;
          transition: opacity 0.4s ease;
        }
        .fw-owl-day:hover {
          opacity: 0.85;
        }
        /* 白天暂停眨眼和歪头动画（猫头鹰在睡觉） */
        .fw-owl-day .fw-owl-eye {
          animation: none;
        }
        .fw-owl-day .fw-owl-svg {
          animation: none;
        }
        /* 白天树叶遮挡层 — 覆盖在猫头鹰上方，视觉上"缩在树叶后" */
        .fw-owl-leaf-cover {
          position: absolute;
          top: 2px;
          left: -4px;
          pointer-events: none;
          z-index: 2;
          transition: opacity 0.4s ease;
        }
        .fw-owl-day:hover .fw-owl-leaf-cover {
          opacity: 0.5;
        }
        /* 白天午睡提示 tooltip — 由 React hovered 状态控制 opacity/transform */
        .fw-owl-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          margin-bottom: 10px;
          padding: 7px 14px;
          font-size: 11px;
          line-height: 1.5;
          white-space: nowrap;
          background: rgba(255, 253, 249, 0.96);
          color: #5a5a5a;
          border: 1px solid rgba(184, 140, 106, 0.3);
          border-radius: 14px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          pointer-events: none;
          transition: opacity 0.15s ease;
          box-shadow: 0 6px 16px -6px rgba(0, 0, 0, 0.2);
          z-index: 9999;
        }
        .fw-owl-eye {
          transition: fill 0.6s ease;
          transform-box: fill-box;
          transform-origin: center;
          animation: fw-owl-blink 6s ease-in-out infinite;
        }
        @keyframes fw-owl-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          93%, 97% { transform: scaleY(0.1); }
        }
        /* 猫头鹰偶尔歪头 — 仅夜晚 */
        .fw-owl-night .fw-owl-svg {
          transform-box: fill-box;
          transform-origin: center bottom;
          animation: fw-owl-tilt 12s ease-in-out infinite;
        }
        @keyframes fw-owl-tilt {
          0%, 85%, 100% { transform: rotate(0deg); }
          90%, 95% { transform: rotate(-8deg); }
        }

        /* ===== 木屋 ===== */
        .fw-house-group {
          z-index: 5;
        }
        .fw-house {
          position: relative;
          width: 160px;
          height: 140px;
        }
        /* 烟雾粒子 */
        .fw-smoke-group {
          position: absolute;
          top: -5px;
          left: 112px;
          z-index: 0;
        }
        .fw-smoke {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          opacity: 0;
        }
        .fw-smoke-1 {
          animation: fw-smoke-rise 4s ease-out infinite;
          animation-delay: 0s;
        }
        .fw-smoke-2 {
          animation: fw-smoke-rise 4s ease-out infinite;
          animation-delay: 1.3s;
        }
        .fw-smoke-3 {
          animation: fw-smoke-rise 4s ease-out infinite;
          animation-delay: 2.6s;
        }
        @keyframes fw-smoke-rise {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          20% { opacity: 0.5; }
          100% {
            transform: translateY(-50px) scale(2.5);
            opacity: 0;
          }
        }
        /* 门缝光线呼吸 */
        .fw-door-glow {
          transition: opacity 0.4s ease;
          animation: fw-door-pulse 3s ease-in-out infinite;
        }
        .fw-door-glow.bright {
          animation: fw-door-pulse-bright 1.5s ease-in-out infinite;
        }
        @keyframes fw-door-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes fw-door-pulse-bright {
          0%, 100% { opacity: 1; }
          50% { opacity: 1; filter: brightness(1.3); }
        }
        .fw-door-clickable {
          cursor: pointer;
        }
        /* 开门瞬间叠加的极淡白色 radial glow — 0.3s 淡入淡出 */
        .fw-door-flash {
          position: absolute;
          left: 58px;
          top: 80px;
          width: 44px;
          height: 54px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.55) 0%,
            rgba(255, 255, 255, 0) 70%
          );
          opacity: 0;
          transition: opacity 0.3s ease-out;
          pointer-events: none;
          z-index: 4;
          mix-blend-mode: screen;
        }
        .fw-door-flash.active {
          opacity: 1;
        }

        /* ===== 场景雾气 ===== */
        .fw-fog-layer {
          position: absolute;
          bottom: 0;
          left: -10%;
          width: 120%;
          height: 30%;
          z-index: 3;
          pointer-events: none;
          background: linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.3) 100%);
        }
        .fw-night .fw-fog-layer {
          background: linear-gradient(180deg, transparent 0%, rgba(180,190,210,0.1) 50%, rgba(180,190,210,0.2) 100%);
        }
        .fw-fog-1 {
          animation: fw-fog-drift 18s ease-in-out infinite;
        }
        .fw-fog-2 {
          height: 20%;
          opacity: 0.6;
          animation: fw-fog-drift 24s ease-in-out infinite reverse;
          animation-delay: -6s;
        }
        @keyframes fw-fog-drift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(40px); }
        }

        /* ===== 入口提示 ===== */
        .fw-entry-hint {
          z-index: 7;
          pointer-events: none;
        }
        .fw-hint-text {
          font-size: 12px;
          letter-spacing: 2px;
          color: var(--fw-brown);
          opacity: 0.7;
          animation: fw-hint-fade 3s ease-in-out infinite;
        }
        .fw-night .fw-hint-text {
          color: #c8c8d8;
        }
        @keyframes fw-hint-fade {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.75; }
        }

        /* ===== 响应式：移动端缩小 ===== */
        @media (max-width: 768px) {
          .fw-tree-scene {
            width: 180px;
            height: 250px;
            transform: scale(0.7);
            transform-origin: top right;
          }
          .fw-character-group {
            transform: scale(0.65);
            transform-origin: bottom left;
          }
          .fw-house {
            transform: scale(0.55);
            transform-origin: top left;
          }
          .fw-celestial-wrapper svg {
            width: 36px;
            height: 36px;
          }
          /* 移动端减半动画幅度 */
          .fw-protagonist {
            animation: fw-breathe-mobile 5s ease-in-out infinite;
          }
          @keyframes fw-breathe-mobile {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-1px) scale(1.003); }
          }
          .fw-scene { animation: none; }
          .fw-leaf-cluster-1 { animation-duration: 7s; }
          .fw-leaf-cluster-2 { animation-duration: 8s; }
          .fw-fog-1 { animation-duration: 18s; }
          .fw-fog-2 { animation-duration: 24s; }
          /* 移动端猫头鹰缩小 */
          .fw-owl-position { transform: scale(0.6); transform-origin: top right; }
          /* 移动端 tooltip 允许换行，避免溢出 */
          .fw-owl-tooltip {
            white-space: normal;
            width: 140px;
            font-size: 10px;
            text-align: center;
          }
          /* 移动端远景层减弱模糊，避免过度模糊看不清 */
          .fw-layer-far { filter: blur(2px); opacity: 0.65; }
          .fw-layer-mid { filter: blur(0.5px); }
        }
      `}</style>
    </motion.div>
  );
};

export default ForestWorld;
