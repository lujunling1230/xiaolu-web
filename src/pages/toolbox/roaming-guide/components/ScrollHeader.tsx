import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

interface ScrollHeaderProps {
  onScrollToMap?: () => void;
}

export default function ScrollHeader({ onScrollToMap }: ScrollHeaderProps) {
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* 播放纸张摩擦音效 */
  const playPaperSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      // 创建噪声缓冲（模拟纸张摩擦的白噪声）
      const sampleRate = ctx.sampleRate;
      const duration = 0.35;
      const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        // 带衰减的噪声
        const env = Math.exp(-i / (sampleRate * 0.12));
        data[i] = (Math.random() * 2 - 1) * env * 0.15;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      // 带通滤波，模拟纸张质感
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 2500;
      filter.Q.value = 0.8;

      const gain = ctx.createGain();
      gain.gain.value = 0.15;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      source.onended = () => ctx.close();
    } catch {
      // 音频不可用时静默降级
    }
  }, []);

  const handleToggle = useCallback(() => {
    playPaperSound();
    setExpanded((prev) => !prev);
  }, [playPaperSound]);

  const handleStartJourney = useCallback(() => {
    onScrollToMap?.();
  }, [onScrollToMap]);

  return (
    <>
      <style>{CSS}</style>
      <header className={`scroll-wrap${expanded ? " scroll-wrap--expanded" : ""}`}>
        {/* 点击区域（卷起状态下可点击） */}
        <div className="scroll-click-area" onClick={handleToggle} role="button" tabIndex={0} aria-label={expanded ? "收起卷轴" : "展开卷轴"} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleToggle(); }}>

          {/* 左侧木棍 */}
          <div className="scroll-rod scroll-rod--left">
            <div className="scroll-knob scroll-knob--top" />
            <div className="scroll-shaft" />
            <div className="scroll-knob scroll-knob--bottom" />
          </div>

          {/* 右侧木棍 */}
          <div className="scroll-rod scroll-rod--right">
            <div className="scroll-knob scroll-knob--top" />
            <div className="scroll-shaft" />
            <div className="scroll-knob scroll-knob--bottom" />
          </div>

          {/* 内容区域 */}
          <div className="scroll-content">
            <div className="scroll-content-inner">
              <h1 className="scroll-title">漫游指南</h1>
              <p className="scroll-subtitle">丙午年 · 启程</p>
              <div className="scroll-body">
                <p>世界是一张未折叠的地图，亦是无数条待踏足的路径。</p>
                <p>每至一城，必察其街巷肌理，尝其市井烟火，录其食宿交通。</p>
                <p>积岁累月，汇为此卷，愿后来者少走弯路，多遇良辰。</p>
              </div>
              <button className="scroll-btn" onClick={handleStartJourney}>开始旅程</button>
            </div>
          </div>
        </div>

        {/* 返回链接 */}
        {expanded && (
          <Link to="/mickey" className="scroll-back">
            ← 返回作品集
          </Link>
        )}
      </header>
    </>
  );
}

/* ============================================================
   样式
   ============================================================ */
const CSS = /* css */ `
/* ---- 外层容器 ---- */
.scroll-wrap {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 0;
  min-height: 44px;
  transition: padding-bottom 1.2s ease-out;
}
.scroll-wrap--expanded {
  padding-bottom: 16px;
}

/* ---- 可点击区域（卷轴整体） ---- */
.scroll-click-area {
  position: relative;
  display: flex;
  align-items: stretch;
  cursor: pointer;
  /* 卷起态尺寸 */
  width: 70px;
  height: 44px;
  transition: width 1.2s ease-out, height 1.2s ease-out;
}
.scroll-wrap--expanded .scroll-click-area {
  width: min(600px, 90vw);
  height: auto;
  cursor: default;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  border-radius: 2px;
}

/* ---- 木棍（左右各一） ---- */
.scroll-rod {
  position: relative;
  z-index: 5;
  flex-shrink: 0;
  width: 10px;
  transition: width 1.2s ease-out;
}

/* ---- 轴杆（杆身） ---- */
.scroll-shaft {
  position: absolute;
  top: 14px;          /* 轴头直径14px，留出空间 */
  bottom: 14px;
  left: 50%;
  width: 100%;
  transform: translateX(-50%);
  background: linear-gradient(
    90deg,
    #A0784A 0%, #C9A86C 20%, #D4B87A 45%, #C9A86C 55%, #B89A68 80%, #A0784A 100%
  );
  border-radius: 5px;
  box-shadow: 1px 0 4px rgba(0,0,0,0.12), -1px 0 4px rgba(0,0,0,0.12);
}
/* 木纹纹理 */
.scroll-shaft::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 5px;
  background:
    repeating-linear-gradient(
      0deg,
      transparent 0px, transparent 8px,
      rgba(0,0,0,0.035) 8px, rgba(0,0,0,0.035) 9px
    ),
    repeating-linear-gradient(
      1.5deg,
      transparent 0px, transparent 16px,
      rgba(80,50,20,0.025) 16px, rgba(80,50,20,0.025) 17px
    );
}
/* 高光条 */
.scroll-shaft::after {
  content: "";
  position: absolute;
  top: 2px; bottom: 2px; left: 2px;
  width: 2px;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.18) 0%,
    rgba(255,255,255,0.06) 50%,
    rgba(255,255,255,0.14) 100%
  );
  border-radius: 1px;
}

/* ---- 轴头（上下圆帽） ---- */
.scroll-knob {
  position: absolute;
  left: 50%;
  width: 14px;
  height: 14px;
  transform: translateX(-50%);
  z-index: 6;
  border-radius: 50%;
  background: radial-gradient(
    circle at 40% 35%,
    #C4A060 0%, #A8884A 50%, #8A6E3A 100%
  );
  box-shadow:
    0 1px 3px rgba(0,0,0,0.2),
    inset 0 1px 2px rgba(255,255,255,0.2);
}
/* 轴头装饰环 */
.scroll-knob::before {
  content: "";
  position: absolute;
  inset: 2px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.12);
}
.scroll-knob--top {
  top: 0;
}
.scroll-knob--bottom {
  bottom: 0;
}

/* ---- 内容区域 ---- */
.scroll-content {
  flex: 1;
  overflow: hidden;
  /* 卷起态：无宽度 */
  max-width: 0;
  max-height: 0;
  opacity: 0;
  transition:
    max-width 1.2s ease-out,
    max-height 1.2s ease-out,
    opacity 0.8s ease-out 0.3s,
    padding 1.2s ease-out;
  padding: 0 20px;
  /* 米白色纸张背景 */
  background-color: #FAF9F6;
  /* 极淡纸张纹理 */
  background-image:
    repeating-linear-gradient(
      90deg,
      transparent 0px, transparent 120px,
      rgba(180,170,150,0.03) 120px, rgba(180,170,150,0.03) 121px
    ),
    repeating-linear-gradient(
      0deg,
      transparent 0px, transparent 100px,
      rgba(180,170,150,0.02) 100px, rgba(180,170,150,0.02) 101px
    ),
    radial-gradient(ellipse 90px 60px at 20% 30%, rgba(200,185,160,0.05) 0%, transparent 70%),
    radial-gradient(ellipse 70px 50px at 75% 65%, rgba(190,175,150,0.04) 0%, transparent 70%);
  /* 卷曲阴影 */
  box-shadow: inset 8px 0 14px -6px rgba(120,100,70,0.08),
              inset -8px 0 14px -6px rgba(120,100,70,0.08);
}
.scroll-wrap--expanded .scroll-content {
  max-width: 600px;
  max-height: 200px;
  opacity: 1;
  padding: 24px 28px;
}

/* ---- 内容内部 ---- */
.scroll-content-inner {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 标题 */
.scroll-title {
  font-family: "Noto Serif SC", "KaiTi", "STKaiti", serif;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 4px;
  letter-spacing: 0.18em;
}

/* 副标题 */
.scroll-subtitle {
  font-family: "Noto Serif SC", "KaiTi", "STKaiti", serif;
  font-size: 12px;
  color: #999;
  letter-spacing: 0.25em;
  margin: 0 0 12px;
}

/* 正文 */
.scroll-body {
  max-width: 460px;
  margin: 0 0 16px;
}
.scroll-body p {
  font-size: 12px;
  line-height: 1.7;
  color: #555;
  margin: 0 0 3px;
  letter-spacing: 0.06em;
  font-family: "Noto Serif SC", "KaiTi", "STKaiti", serif;
}

/* 开始旅程按钮 */
.scroll-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 1.5px solid rgba(160,140,100,0.35);
  background: linear-gradient(145deg, #F8F4EE 0%, #F0EBE3 100%);
  color: #5c4a2a;
  font-family: "Noto Serif SC", "KaiTi", serif;
  font-size: 12px;
  letter-spacing: 0.04em;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(120,100,70,0.1);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  line-height: 1.3;
}
.scroll-btn:hover {
  box-shadow: 0 4px 16px rgba(120,100,70,0.18);
  transform: translateY(-1px);
}
.scroll-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(120,100,70,0.12);
}

/* ---- 返回按钮 ---- */
.scroll-back {
  position: absolute;
  top: 8px;
  left: 12px;
  z-index: 10;
  font-size: 13px;
  color: #8B7D6B;
  text-decoration: none;
  letter-spacing: 0.04em;
  font-family: "Noto Serif SC", "KaiTi", serif;
  transition: color 0.2s ease;
  opacity: 0;
  animation: scrollFadeIn 0.5s ease forwards;
}
.scroll-back:hover {
  color: #5c3a21;
}

@keyframes scrollFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ---- 减少动画偏好 ---- */
@media (prefers-reduced-motion: reduce) {
  .scroll-click-area,
  .scroll-rod,
  .scroll-content,
  .scroll-wrap {
    transition: none !important;
  }
  .scroll-back {
    animation: none !important;
    opacity: 1;
  }
}
`;
