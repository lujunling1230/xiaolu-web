import { useState, useEffect, type ReactNode } from "react";

/**
 * LeafCard 树叶形态卡片组件
 *
 * 设计要点：
 * - CSS clip-path 裁剪叶片形状（橡树叶灵感的椭圆轮廓）
 * - 飘落入场动画（leaf-fall keyframes）+ 落地后微风浮动（leaf-breeze）
 * - 叶脉 SVG 纹理叠加（opacity 0.05，hover 提升至 0.15）
 * - Hover 生长感：上浮 12px + 旋转归零 + 背景变亮 + 阴影扩散
 * - 每个卡片通过 delay 错开 0.2s 模拟先后落下
 *
 * 性能：所有动画使用 CSS transform + opacity，避免重绘
 */

type LeafVariant = "small" | "medium" | "large";

interface LeafCardProps {
  children: ReactNode;
  /** 飘落动画延迟（秒），错开 0.2s */
  delay?: number;
  /** 落地后静止旋转角度（模拟自然散落，-5deg ~ 5deg） */
  restRotate?: number;
  /** 链接地址 */
  href?: string;
  /** 卡片高度变化（模拟叶片大小不一） */
  variant?: LeafVariant;
}

const variantHeights: Record<LeafVariant, string> = {
  small: "min-h-[300px]",
  medium: "min-h-[360px]",
  large: "min-h-[420px]",
};

const LeafCard: React.FC<LeafCardProps> = ({
  children,
  delay = 0,
  restRotate = 0,
  href = "#",
  variant = "medium",
}) => {
  const [settled, setSettled] = useState(false);

  // 飘落动画结束后切换到微风浮动状态
  useEffect(() => {
    const totalDuration = (delay + 1.2) * 1000; // delay + leaf-fall duration
    const timer = setTimeout(() => setSettled(true), totalDuration);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <a
      href={href}
      className={`leaf-card group ${settled ? "settled" : ""} ${variantHeights[variant]}`}
      style={
        {
          "--leaf-delay": `${delay}s`,
          "--leaf-rest-rotate": `${restRotate}deg`,
        } as React.CSSProperties
      }
      data-clickable
    >
      {/* 叶脉纹理 SVG — 默认极淡，hover 变清晰 */}
      <svg
        className="leaf-veins"
        viewBox="0 0 200 300"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 主叶脉 */}
        <line x1="100" y1="15" x2="100" y2="285" stroke="var(--leaf-vein)" strokeWidth="1.2" />
        {/* 侧脉 — 左侧 */}
        <path d="M100 45 Q72 50 42 68" stroke="var(--leaf-vein)" strokeWidth="0.7" fill="none" />
        <path d="M100 85 Q68 90 32 112" stroke="var(--leaf-vein)" strokeWidth="0.7" fill="none" />
        <path d="M100 130 Q62 135 28 162" stroke="var(--leaf-vein)" strokeWidth="0.7" fill="none" />
        <path d="M100 175 Q65 180 35 205" stroke="var(--leaf-vein)" strokeWidth="0.7" fill="none" />
        <path d="M100 220 Q72 225 50 245" stroke="var(--leaf-vein)" strokeWidth="0.7" fill="none" />
        {/* 侧脉 — 右侧 */}
        <path d="M100 45 Q128 50 158 68" stroke="var(--leaf-vein)" strokeWidth="0.7" fill="none" />
        <path d="M100 85 Q132 90 168 112" stroke="var(--leaf-vein)" strokeWidth="0.7" fill="none" />
        <path d="M100 130 Q138 135 172 162" stroke="var(--leaf-vein)" strokeWidth="0.7" fill="none" />
        <path d="M100 175 Q135 180 165 205" stroke="var(--leaf-vein)" strokeWidth="0.7" fill="none" />
        <path d="M100 220 Q128 225 150 245" stroke="var(--leaf-vein)" strokeWidth="0.7" fill="none" />
        {/* 细脉 */}
        <path d="M100 60 L75 70 M100 60 L125 70" stroke="var(--leaf-vein)" strokeWidth="0.4" fill="none" opacity="0.6" />
        <path d="M100 105 L70 118 M100 105 L130 118" stroke="var(--leaf-vein)" strokeWidth="0.4" fill="none" opacity="0.6" />
        <path d="M100 150 L65 165 M100 150 L135 165" stroke="var(--leaf-vein)" strokeWidth="0.4" fill="none" opacity="0.6" />
        <path d="M100 195 L68 208 M100 195 L132 208" stroke="var(--leaf-vein)" strokeWidth="0.4" fill="none" opacity="0.6" />
      </svg>

      {/* 叶片内容区域 — 保证可读性 */}
      <div className="leaf-content">{children}</div>
    </a>
  );
};

export default LeafCard;
