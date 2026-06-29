import { useState, useEffect, useRef } from "react";

/**
 * ForestBackground 森林背景装饰组件
 *
 * 功能：
 * - 分层视差：远景（山/雾 0.3）、中景（树 0.6）、前景固定
 * - forest-breathe 呼吸动画（CSS）
 * - 接收 labMode prop 切换"走进森林深处"氛围
 * - 纯 CSS transform，不 JS 重绘
 */

interface ForestBackgroundProps {
  /** 是否处于 Lab 模式（加快呼吸 + 提亮） */
  labMode?: boolean;
}

const ForestBackground: React.FC<ForestBackgroundProps> = ({ labMode = false }) => {
  const [scrollY, setScrollY] = useState(0);
  const tickingRef = useRef(false);

  // 滚动视差（rAF 节流，避免频繁 setState）
  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        tickingRef.current = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 远景视差 0.3，中景视差 0.6
  const farOffset = scrollY * 0.3;
  const midOffset = scrollY * 0.6;

  return (
    <div
      className={`forest-bg fixed inset-0 z-0 pointer-events-none ${labMode ? "lab-mode" : ""}`}
      aria-hidden="true"
    >
      {/* 夜间星空层 — 仅 data-theme="night" 时显示 */}
      <div className="night-stars" aria-hidden="true">
        <svg
          viewBox="0 0 1200 800"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* 星星 — 大小不一，闪烁延迟错开 */}
          <circle className="star" style={{ animationDelay: "0s" }} cx="120" cy="80" r="1.2" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "0.5s" }} cx="250" cy="140" r="0.8" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "1.2s" }} cx="380" cy="60" r="1.5" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "0.3s" }} cx="520" cy="120" r="1" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "1.8s" }} cx="680" cy="90" r="1.3" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "0.7s" }} cx="820" cy="50" r="0.9" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "2.2s" }} cx="960" cy="110" r="1.1" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "1.5s" }} cx="1080" cy="70" r="1.4" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "0.9s" }} cx="180" cy="220" r="0.7" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "2.5s" }} cx="340" cy="280" r="1" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "1.1s" }} cx="480" cy="200" r="1.2" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "0.4s" }} cx="620" cy="260" r="0.8" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "2s" }} cx="760" cy="220" r="1.3" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "1.3s" }} cx="900" cy="280" r="0.9" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "0.6s" }} cx="1040" cy="240" r="1.1" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "1.7s" }} cx="80" cy="340" r="1" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "0.2s" }} cx="280" cy="400" r="1.4" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "2.3s" }} cx="440" cy="360" r="0.8" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "1s" }} cx="580" cy="420" r="1.2" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "0.8s" }} cx="720" cy="380" r="0.9" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "1.9s" }} cx="860" cy="440" r="1.1" fill="#E2E8F0" />
          <circle className="star" style={{ animationDelay: "0.1s" }} cx="1000" cy="400" r="1.3" fill="#E2E8F0" />
          {/* 较亮的星 — 带微光晕 */}
          <circle className="star star-bright" style={{ animationDelay: "0.5s" }} cx="200" cy="160" r="1.8" fill="#F1F5F9" />
          <circle className="star star-bright" style={{ animationDelay: "1.4s" }} cx="640" cy="150" r="2" fill="#F1F5F9" />
          <circle className="star star-bright" style={{ animationDelay: "2.1s" }} cx="980" cy="180" r="1.6" fill="#F1F5F9" />
          <circle className="star star-bright" style={{ animationDelay: "0.3s" }} cx="420" cy="320" r="1.8" fill="#F1F5F9" />
          <circle className="star star-bright" style={{ animationDelay: "1.6s" }} cx="820" cy="350" r="1.7" fill="#F1F5F9" />
        </svg>
      </div>

      {/* 远景层：远山 + 雾气（视差 0.3） */}
      <div
        className="forest-far absolute inset-0"
        style={{ transform: `translateY(${farOffset * 0.5}px)`, opacity: labMode ? 0.1 : 0.06, transition: "opacity 0.8s ease" }}
      >
        <svg
          viewBox="0 0 1200 600"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* 远山轮廓 */}
          <path
            d="M0 420 L120 340 L220 380 L340 300 L460 360 L580 280 L720 350 L860 290 L1000 360 L1120 310 L1200 350 L1200 600 L0 600 Z"
            fill="#5a6e5a"
          />
          {/* 中景山 */}
          <path
            d="M0 470 L100 410 L240 440 L380 390 L520 430 L660 380 L800 420 L940 370 L1080 410 L1200 390 L1200 600 L0 600 Z"
            fill="#5a6e5a"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* 中景层：树木（视差 0.6） */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${midOffset * 0.3}px)`, opacity: labMode ? 0.09 : 0.05, transition: "opacity 0.8s ease" }}
      >
        <svg
          viewBox="0 0 1200 600"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* 左侧树木群 */}
          <g fill="#3d5238">
            <path d="M80 500 L80 440 Q80 420 90 420 Q100 420 100 440 L100 500 Z" />
            <ellipse cx="90" cy="430" rx="22" ry="34" />
            <path d="M140 500 L140 460 Q140 445 148 445 Q156 445 156 460 L156 500 Z" />
            <ellipse cx="148" cy="455" rx="18" ry="28" />
          </g>
          {/* 右侧树木群 */}
          <g fill="#3d5238">
            <path d="M1050 500 L1050 430 Q1050 410 1062 410 Q1074 410 1074 430 L1074 500 Z" />
            <ellipse cx="1062" cy="420" rx="26" ry="38" />
            <path d="M1120 500 L1120 450 Q1120 435 1130 435 Q1140 435 1140 450 L1140 500 Z" />
            <ellipse cx="1130" cy="445" rx="20" ry="32" />
          </g>
          {/* 中间散落的针叶树 */}
          <g fill="#4a6048">
            <path d="M300 500 L300 480 L296 480 L304 470 L300 470 L308 455 L304 455 L312 440 L308 440 L316 420 L312 420 L320 400 L324 420 L320 420 L328 440 L324 440 L332 455 L328 455 L336 470 L332 470 L340 480 L336 480 L340 500 Z" />
            <path d="M480 500 L480 485 L476 485 L484 475 L480 475 L488 460 L484 460 L492 445 L488 445 L496 425 L500 445 L496 445 L504 460 L500 460 L508 475 L504 475 L512 485 L508 485 L512 500 Z" />
            <path d="M720 500 L720 485 L716 485 L724 475 L720 475 L728 460 L724 460 L732 445 L728 445 L736 425 L740 445 L736 445 L744 460 L740 460 L748 475 L744 475 L752 485 L748 485 L752 500 Z" />
            <path d="M900 500 L900 482 L896 482 L904 472 L900 472 L908 457 L904 457 L912 442 L908 442 L916 422 L920 442 L916 442 L924 457 L920 457 L928 472 L924 472 L932 482 L928 482 L932 500 Z" />
          </g>
          {/* 地面草丛 */}
          <g fill="#5a6e5a" opacity="0.5">
            <path d="M0 520 Q60 510 120 520 T240 520 T360 520 T480 520 T600 520 T720 520 T840 520 T960 520 T1080 520 T1200 520 L1200 600 L0 600 Z" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default ForestBackground;
