import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVisitor } from "../context/VisitorContext";

/**
 * VeilEntry — 穿越结界入口
 *
 * 仪式感入口交互：
 * 1. 全屏深蓝紫星空遮罩 + 缓慢移动星云粒子
 * 2. 中央发光石碑/树洞输入容器
 * 3. 输入名字 → Enter the Forest → 穿越动画
 * 4. 穿越动画：输入框 dissolve → 星空后退 blur → 遮罩淡出卸载
 * 5. 名字存入 VisitorContext，默认 "Explorer"
 *
 * 动画时长 1.2s ease-in-out，结束后 unmount 释放内存
 */

const VeilEntry: React.FC = () => {
  const { setVisitorName, markEntered } = useVisitor();
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<"idle" | "warping">("idle");
  const [unmount, setUnmount] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动聚焦输入框
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 800);
    return () => clearTimeout(timer);
  }, []);

  // 触发穿越
  const handleEnter = () => {
    if (phase === "warping") return;
    setVisitorName(name);
    setPhase("warping");

    // 1.2s 穿越动画结束后 → 标记进入 + 卸载遮罩
    setTimeout(() => {
      markEntered();
      setUnmount(true);
    }, 1200);
  };

  // Enter 键触发
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEnter();
    }
  };

  return (
    <AnimatePresence>
      {!unmount && (
        <motion.div
          className={`veil-overlay ${phase === "warping" ? "warping" : ""}`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* 深蓝紫星空背景 */}
          <div className="veil-starfield">
            {/* 星云粒子层 — CSS animation 缓慢移动 */}
            <div className="veil-nebula veil-nebula-1" />
            <div className="veil-nebula veil-nebula-2" />
            <div className="veil-nebula veil-nebula-3" />

            {/* 星星点 — 多层闪烁 */}
            <div className="veil-stars-layer">
              {Array.from({ length: 40 }).map((_, i) => (
                <span
                  key={i}
                  className="veil-star"
                  style={{
                    left: `${(i * 37) % 100}%`,
                    top: `${(i * 53) % 100}%`,
                    animationDelay: `${(i % 10) * 0.3}s`,
                    width: `${1 + (i % 3)}px`,
                    height: `${1 + (i % 3)}px`,
                  }}
                />
              ))}
            </div>

            {/* 穿越时：星空急速后退（scale up + blur） */}
            <div className="veil-warp-bg" />
          </div>

          {/* 中央输入容器 — 发光石碑/树洞 */}
          <motion.div
            className="veil-portal"
            animate={phase === "warping" ? { opacity: 0, scale: 1.3, filter: "blur(8px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* 标题 */}
            <motion.h1
              className="veil-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Are you ready to enter?
            </motion.h1>

            {/* 输入框 — 无边框，仅底线 */}
            <motion.div
              className="veil-input-wrapper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your name..."
                className="veil-input"
                maxLength={20}
                aria-label="输入你的名字"
              />
              <span className="veil-input-line" />
            </motion.div>

            {/* 按钮 */}
            <motion.button
              className="veil-enter-btn"
              onClick={handleEnter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              data-clickable
            >
              Enter the Forest
            </motion.button>

            {/* 装饰：底部小字提示 */}
            <motion.p
              className="veil-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.4, duration: 1 }}
            >
              穿过结界，走进森林
            </motion.p>
          </motion.div>

          {/* 穿越时光晕扩散 */}
          {phase === "warping" && (
            <motion.div
              className="veil-warp-glow"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 8, opacity: [0, 1, 0] }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VeilEntry;
