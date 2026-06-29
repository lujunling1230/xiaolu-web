import { useAudio } from "../context/AudioContext";

/**
 * WindChime 精致版风铃组件
 *
 * SVG 视觉：
 * - 顶部小圆环（r=3, stroke）
 * - 垂直连线
 * - 铃身：竖向椭圆（rx=8 ry=14），线性渐变 #E8DCC8→#C9B99A，描边 #B88C6A
 * - 小舌：短竖线从铃身底部垂下
 * - 整体 36×52px
 *
 * 动画：
 * - 默认左右摇摆 rotate(-4deg)~(4deg)，3s ease-in-out infinite
 * - hover 幅度加大 rotate(-7deg)~(7deg)
 * - 载入后先单次轻晃，再进入循环
 *
 * 音效：
 * - onClick 调用共享 playChime()（带 800ms 防抖）
 * - 点击时激活白噪音（首次交互）
 * - 不再 hover 触发，避免聒噪
 *
 * 位置：fixed top-4 right-6 z-50
 */

interface WindChimeProps {
  /** 是否 fixed 定位在右上角 */
  fixed?: boolean;
  /** 尺寸，默认 36 */
  size?: number;
}

const WindChime: React.FC<WindChimeProps> = ({ fixed = false, size = 36 }) => {
  const { playChime, tryActivateAmbient } = useAudio();

  const handleClick = () => {
    playChime();
    tryActivateAmbient(); // 首次交互激活白噪音
  };

  const positionClass = fixed ? "fixed top-4 right-6 z-50" : "";

  return (
    <div
      className={`${positionClass} wind-chime-sway select-none`}
      onClick={handleClick}
      style={{
        width: size,
        height: size * 1.44,
        opacity: 0.85,
        filter: "drop-shadow(0 2px 4px rgba(90, 110, 90, 0.15))",
        transition: "opacity 0.3s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseOut={(e) => (e.currentTarget.style.opacity = "0.85")}
      role="button"
      aria-label="风铃 — 点击可听风铃声"
      title="风铃 · 点击听风声"
      data-cursor="chime"
      data-clickable
    >
      <svg
        width={size}
        height={size * 1.44}
        viewBox="0 0 36 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 铃身线性渐变 */}
          <linearGradient id="chime-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8DCC8" />
            <stop offset="100%" stopColor="#C9B99A" />
          </linearGradient>
        </defs>

        {/* 顶部小圆环 */}
        <circle cx="18" cy="4" r="3" stroke="#B88C6A" strokeWidth="0.8" fill="none" />

        {/* 垂直连线 */}
        <line
          x1="18"
          y1="7"
          x2="18"
          y2="16"
          stroke="#B88C6A"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* 铃身 — 竖向椭圆 */}
        <ellipse
          cx="18"
          cy="30"
          rx="8"
          ry="14"
          fill="url(#chime-body)"
          stroke="#B88C6A"
          strokeWidth="0.3"
        />

        {/* 铃身开口横线 */}
        <line
          x1="11"
          y1="40"
          x2="25"
          y2="40"
          stroke="#B88C6A"
          strokeWidth="0.5"
          opacity="0.4"
        />

        {/* 铃身装饰横纹 */}
        <line
          x1="12"
          y1="26"
          x2="24"
          y2="26"
          stroke="#B88C6A"
          strokeWidth="0.3"
          opacity="0.25"
        />

        {/* 小舌 — 从铃身底部中心垂下（摆动轴心） */}
        <line
          x1="18"
          y1="40"
          x2="18"
          y2="48"
          stroke="#B88C6A"
          strokeWidth="0.8"
          strokeLinecap="round"
        />

        {/* 小舌底部装饰点 */}
        <circle cx="18" cy="49" r="1" fill="#B88C6A" opacity="0.6" />
      </svg>
    </div>
  );
};

export default WindChime;
