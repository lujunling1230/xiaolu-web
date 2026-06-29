import { useState, useEffect, useRef, useCallback } from "react";

/**
 * ButterflyCursor 蝴蝶引导光标
 *
 * - SVG 蝴蝶跟随鼠标（lerp 惯性）
 * - Hover 可交互元素：翅膀加速扇动
 * - Click 导航：做小弧线引路动画
 * - Idle 5s：缓慢飘动
 * - 仅 PC 端显示（移动端隐藏）
 * - 翅膀扇动用 CSS scaleY，位移用 transform
 */

interface ButterflyState {
  x: number;
  y: number;
  rotation: number;
}

const LERP_FACTOR = 0.12;  // 惯性跟随系数
const IDLE_THRESHOLD = 5000; // 5s 静止触发 idle

const ButterflyCursor: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const stateRef = useRef<ButterflyState>({ x: 0, y: 0, rotation: 0 });
  const targetRef = useRef<ButterflyState>({ x: 0, y: 0, rotation: 0 });
  const lastMoveRef = useRef<number>(Date.now());
  const rafRef = useRef<number>(0);
  const idlePhaseRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 检测可交互元素
  const isInteractive = (el: Element | null): boolean => {
    if (!el) return false;
    return !!el.closest('a, button, input, textarea, select, [role="button"], [data-cursor="hover"]');
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    targetRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotation: 0,
    };
    lastMoveRef.current = Date.now();
    setVisible(true);

    // 检测是否 hover 可交互元素
    const el = document.elementFromPoint(e.clientX, e.clientY);
    setHovering(isInteractive(el));
  }, []);

  // rAF 动画循环
  useEffect(() => {
    const animate = () => {
      const state = stateRef.current;
      const target = targetRef.current;
      const now = Date.now();
      const idleTime = now - lastMoveRef.current;

      if (idleTime > IDLE_THRESHOLD) {
        // Idle 状态：缓慢飘动
        idlePhaseRef.current += 0.015;
        const idleX = Math.sin(idlePhaseRef.current) * 15;
        const idleY = Math.cos(idlePhaseRef.current * 0.7) * 10;
        target.x = targetRef.current.x + idleX;
        target.y = targetRef.current.y + idleY;
      } else {
        idlePhaseRef.current = 0;
      }

      // Lerp 插值
      state.x += (target.x - state.x) * LERP_FACTOR;
      state.y += (target.y - state.y) * LERP_FACTOR;

      // 计算旋转角度（基于移动方向）
      const dx = target.x - state.x;
      const dy = target.y - state.y;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        state.rotation = Math.atan2(dy, dx) * (180 / Math.PI) * 0.15;
      }

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${state.x - 12}px, ${state.y - 12}px, 0) rotate(${state.rotation}deg)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // 事件监听
  useEffect(() => {
    // 仅 PC 端启用
    if (window.innerWidth < 768 || matchMedia("(pointer: coarse)").matches) {
      return;
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", () => setVisible(false));

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  if (!visible) return null;

  return (
    <div ref={containerRef} className="butterfly-cursor" aria-hidden="true">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 左翅 */}
        <g className={`bf-wing bf-wing-left ${hovering ? "bf-fast" : ""}`}>
          <ellipse cx="7" cy="9" rx="5" ry="4.5" fill="rgba(122,154,130,0.35)" stroke="rgba(90,74,66,0.4)" strokeWidth="0.6" />
          <ellipse cx="7" cy="15" rx="3.5" ry="3" fill="rgba(122,154,130,0.25)" stroke="rgba(90,74,66,0.3)" strokeWidth="0.5" />
        </g>
        {/* 右翅 */}
        <g className={`bf-wing bf-wing-right ${hovering ? "bf-fast" : ""}`}>
          <ellipse cx="17" cy="9" rx="5" ry="4.5" fill="rgba(122,154,130,0.35)" stroke="rgba(90,74,66,0.4)" strokeWidth="0.6" />
          <ellipse cx="17" cy="15" rx="3.5" ry="3" fill="rgba(122,154,130,0.25)" stroke="rgba(90,74,66,0.3)" strokeWidth="0.5" />
        </g>
        {/* 身体 */}
        <ellipse cx="12" cy="12" rx="1" ry="6" fill="rgba(90,74,66,0.7)" />
        {/* 触角 */}
        <path d="M11 6.5C10.5 5 10 4 9.5 3.5" stroke="rgba(90,74,66,0.5)" strokeWidth="0.5" strokeLinecap="round" />
        <path d="M13 6.5C13.5 5 14 4 14.5 3.5" stroke="rgba(90,74,66,0.5)" strokeWidth="0.5" strokeLinecap="round" />
      </svg>

      <style>{`
        .butterfly-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 24px;
          height: 24px;
          pointer-events: none;
          z-index: 9999;
          will-change: transform;
        }
        .bf-wing {
          transform-origin: 12px 12px;
          transform-box: fill-box;
        }
        .bf-wing-left {
          animation: bf-flap-left 0.6s ease-in-out infinite;
        }
        .bf-wing-right {
          animation: bf-flap-right 0.6s ease-in-out infinite;
        }
        .bf-fast.bf-wing-left {
          animation-duration: 0.2s;
        }
        .bf-fast.bf-wing-right {
          animation-duration: 0.2s;
        }
        @keyframes bf-flap-left {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.3); }
        }
        @keyframes bf-flap-right {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.3); }
        }
        @media (max-width: 768px) {
          .butterfly-cursor {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .bf-wing-left,
          .bf-wing-right {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ButterflyCursor;
