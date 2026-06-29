import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "../context/AudioContext";

/**
 * Deer 小鹿装饰组件 — 联动版
 *
 * 交互逻辑：
 * - hover 小鹿：播放风铃声（共享 playChime），小鹿抬头，首次交互激活白噪音
 * - 点击小鹿：切换白噪音播放/暂停 + 弹出正念语录 Toast
 * - 离开小鹿：恢复浮动
 *
 * 状态联动：
 * - 白噪音播放时小鹿微亮（opacity 0.25）
 * - 白噪音暂停时小鹿变淡（opacity 0.15）
 * - 标签显示白噪音状态（🌲 森林中... / 🔇 静谧）
 *
 * Lab 模式：进入 Lab 区块时抬头 + 安静浮动
 */

interface DeerProps {
  labMode?: boolean;
}

// 正念语录库
const mindfulnessQuotes = [
  "此刻，呼吸便是归处。",
  "风过林梢，心若止水。",
  "不必赶路，每一步都是风景。",
  "允许一切如其所是。",
  "你本就是森林的一部分。",
  "静坐片刻，听风铃轻响。",
  "焦虑是云，而你是天空。",
  "温柔以待自己，如待挚友。",
  "活在当下，即是修行。",
  "心若安住，处处皆禅。",
];

const Deer: React.FC<DeerProps> = ({ labMode = false }) => {
  const { ambientPlaying, toggleAmbient, tryActivateAmbient, ambientLabel } = useAudio();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastText, setToastText] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const prevLabModeRef = useRef(false);

  // Lab 模式切换：进入时执行一次抬头动画
  useEffect(() => {
    if (labMode && !prevLabModeRef.current) {
      setIsLookingUp(true);
      const timer = setTimeout(() => setIsLookingUp(false), 600);
      return () => clearTimeout(timer);
    }
    prevLabModeRef.current = labMode;
  }, [labMode]);

  // hover 小鹿：激活白噪音（不再触发风铃，避免聒噪）
  const handleMouseEnter = useCallback(() => {
    tryActivateAmbient();
  }, [tryActivateAmbient]);

  // 点击小鹿：切换白噪音 + 弹正念语录
  const handleClick = useCallback(() => {
    toggleAmbient();
    const random = mindfulnessQuotes[Math.floor(Math.random() * mindfulnessQuotes.length)];
    setToastText(random);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  }, [toggleAmbient]);

  // 小鹿 opacity 随白噪音状态变化
  const deerOpacity = ambientPlaying ? 0.25 : 0.15;

  return (
    <>
      {/* 小鹿容器 */}
      <div
        className="deer-container"
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        role="button"
        aria-label="点击切换森林白噪音，悬停听风铃声"
        title={ambientPlaying ? "点击暂停白噪音" : "点击播放白噪音"}
        data-clickable
      >
        {/* 状态标签 — 显示白噪音状态 */}
        <div
          className="deer-label"
          style={{ opacity: ambientPlaying ? 0.85 : 0.5 }}
        >
          {ambientPlaying ? `🌲 ${ambientLabel}` : "🔇 静谧"}
        </div>

        {/* 小鹿 SVG — fill=currentColor 由 --deer-color 控制，夜间自动变剪影 */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`deer-svg ${labMode ? "lab-mode" : ""}`}
          style={{
            // hover 抬头由 CSS .deer-container:hover .deer-svg 控制
            // Lab 进入抬头由 isLookingUp 控制
            ...(isLookingUp
              ? {
                  animation: "none",
                  transform: "translateY(-8px) rotate(-3deg)",
                  opacity: 0.3,
                  transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                }
              : {
                  // 白噪音状态影响 opacity（CSS hover 会覆盖到 0.3）
                  opacity: deerOpacity,
                }),
          }}
        >
          {/* 小鹿身体 — currentColor 昼夜自动切换 */}
          <g className="deer-body">
            <ellipse cx="45" cy="62" rx="22" ry="16" fill="currentColor" />
            <ellipse cx="68" cy="48" rx="11" ry="10" fill="currentColor" />
            <ellipse cx="80" cy="52" rx="6" ry="5" fill="currentColor" />
            <path d="M62 40 L58 28 L66 36 Z" fill="currentColor" />
            <path d="M72 40 L70 27 L78 35 Z" fill="currentColor" />
            {/* 鹿角 */}
            <path
              d="M66 38 L63 25 L60 28 M63 25 L66 22 M68 37 L72 24 L75 27 M72 24 L69 21"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* 前腿 */}
            <path d="M52 74 L50 82 L55 84 L57 76 Z" fill="currentColor" />
            <path d="M42 74 L40 84 L45 85 L47 76 Z" fill="currentColor" />
            {/* 尾巴 */}
            <ellipse cx="25" cy="56" rx="4" ry="6" fill="currentColor" />
          </g>
          {/* 眼睛 — 夜间发光（deer-eye 类由 CSS 控制 drop-shadow） */}
          <circle className="deer-eye" cx="71" cy="46" r="1.5" fill="#FAF6F0" />
        </svg>
      </div>

      {/* 正念语录 Toast */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-24 right-8 z-50 max-w-xs px-5 py-4 rounded-2xl glass-card border border-[#b88c6a]/30 card-shadow"
          >
            <div className="flex items-start gap-2">
              <span className="text-lg leading-none">🌿</span>
              <p
                className="text-sm text-[#5a6e5a] leading-relaxed italic"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                {toastText}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Deer;
