import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext";

/**
 * DynamicBackground 三层微动背景
 *
 * 1) 远景：极慢水平漂移（0~6px, 30s）
 * 2) 中景：树干/大叶 rotate ±0.4deg（5s）
 * 3) 前景：6~10 个光尘/萤火虫（飘落 + 微旋转）
 * 12s breathe scale（1 → 1.015）
 * 主题联动：浅色=金色光尘，深色=绿色萤火虫
 * 移动端降级：减少粒子数量
 */

interface Particle {
  left: number;      // %
  delay: number;     // s
  duration: number;  // s
  size: number;      // px
  drift: number;     // px 水平偏移
}

/** 生成随机粒子 */
const generateParticles = (count: number): Particle[] =>
  Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 10 + Math.random() * 8,
    size: 2 + Math.random() * 3,
    drift: (Math.random() - 0.5) * 40,
  }));

const DynamicBackground: React.FC = () => {
  const { isNight } = useTheme();
  // 移动端降级：减少粒子
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const particleCount = isMobile ? 4 : 8;
  const particles = useMemo(() => generateParticles(particleCount), [particleCount]);

  return (
    <div className="dyn-bg" aria-hidden="true">
      {/* 基础背景图层 — 呼吸缩放 */}
      <div className="dyn-layer dyn-layer-base" />

      {/* 远景：极慢水平漂移 */}
      <div className="dyn-layer dyn-layer-far" />

      {/* 中景：轻微旋转 */}
      <div className="dyn-layer dyn-layer-mid" />

      {/* 前景：光尘 / 萤火虫 */}
      <div className="dyn-layer dyn-layer-front">
        {particles.map((p, i) => (
          <span
            key={i}
            className={`dyn-particle ${isNight ? "dyn-firefly" : "dyn-dust"}`}
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--drift": `${p.drift}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <style>{`
        .dyn-bg {
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
          pointer-events: none;
        }

        /* ===== 基础背景图 — 12s 呼吸 ===== */
        .dyn-layer-base {
          background: url("/forest-bg.jpg") center center / cover no-repeat;
          animation: dyn-breathe 12s ease-in-out infinite;
        }

        /* ===== 远景：极慢漂移 ===== */
        .dyn-layer-far {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(122, 154, 130, 0.03) 50%,
            transparent 100%
          );
          animation: dyn-drift 30s ease-in-out infinite alternate;
        }

        /* ===== 中景：轻微旋转 ===== */
        .dyn-layer-mid {
          background: radial-gradient(
            ellipse at 30% 60%,
            rgba(122, 154, 130, 0.04) 0%,
            transparent 60%
          );
          animation: dyn-sway 5s ease-in-out infinite alternate;
        }

        .dyn-layer {
          position: absolute;
          inset: -10px;
        }

        /* ===== 前景粒子 ===== */
        .dyn-layer-front {
          position: absolute;
          inset: 0;
        }
        .dyn-particle {
          position: absolute;
          top: -10px;
          border-radius: 50%;
          animation-name: dyn-fall;
          animation-timing-function: ease-in;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
        /* 浅色：金色光尘 */
        .dyn-dust {
          background: rgba(218, 165, 32, 0.5);
          box-shadow: 0 0 4px rgba(218, 165, 32, 0.3);
        }
        /* 深色：绿色萤火虫 */
        .dyn-firefly {
          background: rgba(157, 184, 165, 0.7);
          box-shadow: 0 0 6px rgba(157, 184, 165, 0.5), 0 0 12px rgba(157, 184, 165, 0.2);
          animation-name: dyn-fall, dyn-glow;
        }

        /* ===== 关键帧 ===== */
        @keyframes dyn-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }
        @keyframes dyn-drift {
          0% { transform: translateX(0); }
          100% { transform: translateX(6px); }
        }
        @keyframes dyn-sway {
          0% { transform: rotate(-0.4deg); }
          100% { transform: rotate(0.4deg); }
        }
        @keyframes dyn-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% {
            transform: translateY(100vh) translateX(var(--drift, 0px)) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes dyn-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @media (max-width: 768px) {
          .dyn-layer-mid {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .dyn-layer-base,
          .dyn-layer-far,
          .dyn-layer-mid,
          .dyn-particle {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DynamicBackground;
