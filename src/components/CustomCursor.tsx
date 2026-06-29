import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CustomCursor 自定义光标组件
 *
 * 桌面端专属：
 * - 默认显示一个小圆点
 * - hover 可点击元素（a/button/[role=button]）时放大
 * - hover 风铃（[data-cursor="chime"]）时显示风铃图标
 * - 触屏设备自动隐藏
 */
const CustomCursor: React.FC = () => {
  // 光标位置（用 motion value 实现高性能跟随）
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // 弹簧物理，让光标丝滑跟随
  const springX = useSpring(cursorX, { damping: 25, stiffness: 400, mass: 0.3 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 400, mass: 0.3 });

  // 光标状态
  const [variant, setVariant] = useState<"default" | "clickable" | "chime">("default");
  const [isVisible, setIsVisible] = useState(false);

  // 是否为触屏设备
  const isTouchRef = useRef(false);

  useEffect(() => {
    // 触屏设备不启用自定义光标
    isTouchRef.current = window.matchMedia("(hover: none)").matches;
    if (isTouchRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // 检测当前 hover 的元素类型
      const target = e.target as HTMLElement;
      if (!target) return;

      // 检查是否 hover 在风铃上
      const chimeEl = target.closest('[data-cursor="chime"]');
      if (chimeEl) {
        setVariant("chime");
        return;
      }

      // 检查是否 hover 在可点击元素上
      const clickableEl = target.closest('a, button, [role="button"], input, textarea, [data-clickable]');
      if (clickableEl) {
        setVariant("clickable");
        return;
      }

      setVariant("default");
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  // 触屏设备不渲染
  if (isTouchRef.current) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{
        x: springX,
        y: springY,
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* 内部内容根据状态变化，居中对齐到光标点 */}
      <div className="relative" style={{ transform: "translate(-50%, -50%)" }}>
        {variant === "chime" ? (
          // 风铃图标
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#b88c6a]/15 backdrop-blur-sm border border-[#b88c6a]/30"
          >
            <svg width="20" height="24" viewBox="0 0 60 84" fill="none">
              <line x1="30" y1="0" x2="30" y2="14" stroke="#b88c6a" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="30" cy="6" r="3" stroke="#b88c6a" strokeWidth="1.5" fill="none" />
              <path
                d="M30 14 C18 14, 12 24, 12 38 C12 50, 20 58, 30 58 C40 58, 48 50, 48 38 C48 24, 42 14, 30 14 Z"
                fill="#b88c6a"
                opacity="0.8"
              />
              <line x1="30" y1="52" x2="30" y2="66" stroke="#b88c6a" strokeWidth="1.2" strokeLinecap="round" />
              <rect x="26" y="66" width="8" height="14" rx="1" fill="#b88c6a" />
            </svg>
          </motion.div>
        ) : (
          // 默认圆点 / 可点击时放大
          <motion.div
            animate={{
              width: variant === "clickable" ? 36 : 12,
              height: variant === "clickable" ? 36 : 12,
              backgroundColor:
                variant === "clickable" ? "rgba(184, 140, 106, 0.15)" : "rgba(184, 140, 106, 0.6)",
              border:
                variant === "clickable"
                  ? "1.5px solid rgba(184, 140, 106, 0.5)"
                  : "0px solid transparent",
            }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="rounded-full"
          />
        )}
      </div>
    </motion.div>
  );
};

export default CustomCursor;
