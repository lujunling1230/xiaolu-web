import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface ScrollHeaderProps {
  onScrollToMap?: () => void;
}

export default function ScrollHeader({ onScrollToMap }: ScrollHeaderProps) {
  const [scrollUnrolled, setScrollUnrolled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setScrollUnrolled(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        /* ===== Hero 羊皮纸卷轴 ===== */
        .travel-hero {
          position: relative; min-height: 420px; height: auto;
          display: flex; align-items: stretch;
          overflow: hidden;
          background: linear-gradient(180deg, #E0D8C8 0%, #EDE5D5 25%, #F5F0E6 60%, #F5F0E6 100%);
          border-bottom: 2px solid #D4C8B0;
          padding: 0;
        }

        /* ---- 仿真卷轴整体容器 ---- */
        .travel-scroll-rod {
          position: relative; z-index: 5;
          width: 0; flex-shrink: 0;
          transition: width 2.5s cubic-bezier(0.65, 0, 0.35, 1);
          overflow: visible;
        }
        .travel-hero.unrolled .travel-scroll-rod {
          width: 28px;
        }

        /* ---- 轴杆（木纹杆身） ---- */
        .travel-scroll-shaft {
          position: absolute; top: 0; bottom: 0; left: 50%;
          width: 18px; transform: translateX(-50%);
          background: linear-gradient(90deg, #5C4538 0%, #7A6655 18%, #A08060 42%, #B89A78 50%, #A08060 58%, #7A6655 82%, #5C4538 100%);
          border-radius: 9px;
          box-shadow: 2px 0 8px rgba(0,0,0,0.2), -2px 0 8px rgba(0,0,0,0.2);
        }
        /* 木纹纹理叠加 */
        .travel-scroll-shaft::before {
          content: ""; position: absolute; inset: 0;
          border-radius: 9px;
          background: repeating-linear-gradient(
            0deg,
            transparent 0px, transparent 6px,
            rgba(0,0,0,0.04) 6px, rgba(0,0,0,0.04) 7px
          );
        }
        /* 高光条 */
        .travel-scroll-shaft::after {
          content: ""; position: absolute;
          top: 4px; bottom: 4px; left: 4px; width: 4px;
          background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.12) 100%);
          border-radius: 2px;
        }

        /* ---- 轴头（上下装饰端帽） ---- */
        .travel-scroll-knob-top,
        .travel-scroll-knob-bottom {
          position: absolute; left: 50%;
          width: 38px; height: 16px;
          transform: translateX(-50%);
          z-index: 6;
          background: linear-gradient(180deg, #4A3828 0%, #6B5344 30%, #8B7355 50%, #6B5344 70%, #4A3828 100%);
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.12);
          opacity: 0;
          transition: opacity 0.5s ease 2.2s;
        }
        .travel-hero.unrolled .travel-scroll-knob-top,
        .travel-hero.unrolled .travel-scroll-knob-bottom {
          opacity: 1;
        }
        .travel-scroll-knob-top {
          top: -4px;
          border-radius: 6px 6px 3px 3px;
        }
        .travel-scroll-knob-bottom {
          bottom: -4px;
          border-radius: 3px 3px 6px 6px;
        }
        /* 轴头装饰线 */
        .travel-scroll-knob-top::after,
        .travel-scroll-knob-bottom::after {
          content: ""; position: absolute;
          left: 4px; right: 4px; height: 1px;
          background: rgba(255,255,255,0.15);
          border-radius: 1px;
        }
        .travel-scroll-knob-top::after { bottom: 3px; }
        .travel-scroll-knob-bottom::after { top: 3px; }

        /* ---- 内容区：flex 子项，clip-path 展开 ---- */
        .travel-hero-content {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          position: relative; z-index: 2; text-align: center;
          padding: 48px 56px;
          opacity: 0;
          clip-path: inset(0 50% 0 50%);
          transition: clip-path 2.5s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.6s ease 1.2s;
        }
        .travel-hero.unrolled .travel-hero-content {
          clip-path: inset(0 0% 0 0%);
          opacity: 1;
        }
        /* 卷轴纸面卷曲阴影（展开后可见） */
        .travel-hero-content::before {
          content: ""; position: absolute; inset: 0;
          pointer-events: none; z-index: 1;
          box-shadow: inset 12px 0 18px -8px rgba(90,75,60,0.12),
                      inset -12px 0 18px -8px rgba(90,75,60,0.12);
          opacity: 0;
          transition: opacity 1s ease 2s;
        }
        .travel-hero.unrolled .travel-hero-content::before {
          opacity: 1;
        }

        /* ---- 返回按钮 ---- */
        .travel-back {
          position: absolute; top: 16px; left: 16px; z-index: 10;
          font-size: 14px; color: var(--warm-brown); text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease, opacity 0.8s ease 2s;
          font-family: var(--font-serif);
          opacity: 0;
        }
        .travel-hero.unrolled .travel-back { opacity: 1; }
        .travel-back:hover { color: var(--ink-blue); }

        /* ---- 标题 ---- */
        .travel-hero-title {
          font-family: "KaiTi", "STKaiti", "Noto Serif SC", var(--font-hand), serif;
          font-size: clamp(36px, 6vw, 56px); font-weight: 400;
          color: #5c3a21; margin: 0 0 6px;
          letter-spacing: 0.22em;
          text-shadow: 1px 1px 0 rgba(180,160,130,0.4);
          opacity: 0; transform: translateY(12px);
          transition: opacity 1s ease 1.5s, transform 1s ease 1.5s;
        }
        .travel-hero.unrolled .travel-hero-title { opacity: 1; transform: translateY(0); }

        /* 装饰线 */
        .travel-hero-ornament {
          width: 60px; height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold-accent), transparent);
          margin: 8px auto;
          opacity: 0;
          transition: opacity 0.6s ease 1.6s;
        }
        .travel-hero.unrolled .travel-hero-ornament { opacity: 0.5; }

        /* 元年 · 启程 */
        .travel-hero-year {
          font-size: 15px; color: #8B7D6B;
          letter-spacing: 0.3em; margin-bottom: 20px;
          font-family: "KaiTi", "STKaiti", "Noto Serif SC", serif;
          opacity: 0;
          transition: opacity 0.8s ease 1.7s;
        }
        .travel-hero.unrolled .travel-hero-year { opacity: 1; }

        /* 题记正文 */
        .travel-hero-text {
          max-width: 520px; margin: 0 auto;
          text-align: center; line-height: 2;
          font-size: 16px; color: #5c3a21;
          letter-spacing: 0.1em;
          font-family: "KaiTi", "STKaiti", "Noto Serif SC", "SimSun", serif;
        }
        .travel-hero-text p {
          margin-bottom: 8px;
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .travel-hero.unrolled .travel-hero-text p:nth-child(1) { opacity: 1; transform: translateY(0); transition-delay: 1.9s; }
        .travel-hero.unrolled .travel-hero-text p:nth-child(2) { opacity: 1; transform: translateY(0); transition-delay: 2.2s; }
        .travel-hero.unrolled .travel-hero-text p:nth-child(3) { opacity: 1; transform: translateY(0); transition-delay: 2.5s; }
        .travel-hero.unrolled .travel-hero-text p:nth-child(4) { opacity: 1; transform: translateY(0); transition-delay: 2.8s; }
        .travel-hero.unrolled .travel-hero-text p:nth-child(5) { opacity: 1; transform: translateY(0); transition-delay: 3.1s; }
        .travel-hero.unrolled .travel-hero-text p:nth-child(6) { opacity: 1; transform: translateY(0); transition-delay: 3.4s; }

        /* 署名 */
        .travel-hero-signature {
          margin-top: 24px;
          display: flex; align-items: center; justify-content: center;
          gap: 14px;
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.8s ease 3.6s, transform 0.8s ease 3.6s;
        }
        .travel-hero.unrolled .travel-hero-signature { opacity: 1; transform: translateY(0); }
        .travel-hero-name {
          font-size: 14px; color: #8B7D6B;
          letter-spacing: 0.12em;
          font-family: "KaiTi", "STKaiti", "Noto Serif SC", serif;
        }

        /* 红色印章 */
        .travel-hero-seal {
          width: 40px; height: 40px;
          background: #C53D43; border: 2px solid #A82830;
          display: flex; align-items: center; justify-content: center;
          position: relative;
          box-shadow: 0 1px 4px rgba(197,61,67,0.3);
          opacity: 0; transform: scale(0.6) rotate(15deg);
          transition: opacity 0.6s ease 3.9s, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 3.9s;
        }
        .travel-hero.unrolled .travel-hero-seal { opacity: 1; transform: scale(1) rotate(-3deg); }
        .travel-hero-seal::before {
          content: ""; position: absolute; inset: 3px;
          border: 1px solid rgba(255,255,255,0.25);
        }
        .travel-hero-seal span {
          color: #fff; font-size: 12px; font-weight: 700;
          letter-spacing: 0.15em; line-height: 1;
          font-family: "KaiTi", "STKaiti", serif;
          text-shadow: 0 1px 2px rgba(0,0,0,0.15);
        }

        /* 开启旅程按钮 */
        .travel-hero-stamp {
          display: inline-flex; align-items: center; justify-content: center;
          margin-top: 24px; width: 80px; height: 80px;
          border-radius: 50%; border: 3px solid var(--gold-accent);
          background: linear-gradient(145deg, #F5E6D0 0%, #E8D5BE 100%);
          color: var(--pine-green);
          font-family: var(--font-hand); font-size: 14px;
          letter-spacing: 0.06em; line-height: 1.3;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(200,146,74,0.25), inset 0 1px 2px rgba(255,255,255,0.5);
          transition: transform 0.35s var(--ease-bounce), box-shadow 0.3s ease, opacity 0.8s ease 4.1s;
          position: relative;
          opacity: 0; transform: scale(0.6) rotate(20deg);
        }
        .travel-hero.unrolled .travel-hero-stamp { opacity: 1; transform: scale(1) rotate(0deg); }
        .travel-hero-stamp::before {
          content: ""; position: absolute; inset: -7px;
          border-radius: 50%; border: 1px dashed var(--gold-accent);
          opacity: 0.35;
        }
        .travel-hero-stamp:hover {
          transform: scale(1.1) rotate(-5deg);
          box-shadow: 0 8px 24px rgba(200,146,74,0.35);
        }

        /* ---- 展开完成后：持续微风摇曳 ---- */
        @keyframes scrollSway {
          0%, 100% { transform: perspective(1200px) rotateY(-0.5deg) rotateX(0.15deg); }
          50% { transform: perspective(1200px) rotateY(0.5deg) rotateX(-0.1deg); }
        }
        .travel-hero.unrolled {
          animation: scrollSway 8s ease-in-out 2.2s infinite;
          transform-style: preserve-3d;
        }

        /* ---- 展开完成后：轴杆微呼吸 ---- */
        @keyframes barBreathe {
          0%, 100% { transform: translateX(-50%) scaleX(1); }
          50% { transform: translateX(-50%) scaleX(1.04); }
        }
        .travel-hero.unrolled .travel-scroll-shaft {
          animation: barBreathe 5s ease-in-out 2.5s infinite;
        }
        /* 轴头微转 */
        @keyframes knobTurnTop {
          0%, 100% { transform: translateX(-50%) rotate(0deg); }
          50% { transform: translateX(-50%) rotate(1.5deg); }
        }
        @keyframes knobTurnBottom {
          0%, 100% { transform: translateX(-50%) rotate(0deg); }
          50% { transform: translateX(-50%) rotate(-1.5deg); }
        }
        .travel-hero.unrolled .travel-scroll-knob-top {
          animation: knobTurnTop 6s ease-in-out 2.5s infinite;
        }
        .travel-hero.unrolled .travel-scroll-knob-bottom {
          animation: knobTurnBottom 6s ease-in-out 2.8s infinite;
        }

        /* 金色尘埃 */
        @keyframes dustFloat {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          15% { opacity: 0.6; }
          85% { opacity: 0.4; }
          100% { transform: translateY(-120px) translateX(30px) scale(0.3); opacity: 0; }
        }
        .travel-dust {
          position: absolute; width: 3px; height: 3px; opacity: 0;
          background: radial-gradient(circle, rgba(212,180,100,0.9) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none; z-index: 3;
          transition: opacity 1s ease 2s;
        }
        .travel-hero.unrolled .travel-dust { opacity: 1; }
        .travel-dust:nth-child(1) { left: 18%; bottom: 15%; animation: dustFloat 5s 2.2s ease-in-out infinite; }
        .travel-dust:nth-child(2) { left: 35%; bottom: 25%; animation: dustFloat 7s 3.5s ease-in-out infinite; width: 2px; height: 2px; }
        .travel-dust:nth-child(3) { left: 62%; bottom: 18%; animation: dustFloat 6s 2.8s ease-in-out infinite; }
        .travel-dust:nth-child(4) { left: 78%; bottom: 30%; animation: dustFloat 8s 4.2s ease-in-out infinite; width: 2.5px; height: 2.5px; }
        .travel-dust:nth-child(5) { left: 45%; bottom: 10%; animation: dustFloat 5.5s 5s ease-in-out infinite; }

        /* ===== 减少动画偏好 ===== */
        @media (prefers-reduced-motion: reduce) {
          .travel-scroll-rod, .travel-scroll-shaft, .travel-scroll-knob-top, .travel-scroll-knob-bottom,
          .travel-hero-content, .travel-back,
          .travel-hero-title, .travel-hero-ornament, .travel-hero-year,
          .travel-hero-text p, .travel-hero-signature, .travel-hero-seal,
          .travel-hero-stamp, .travel-dust {
            transition: none !important;
            animation: none !important;
          }
          .travel-hero:not(.unrolled) .travel-scroll-rod {
            width: 28px;
          }
          .travel-hero:not(.unrolled) .travel-scroll-knob-top,
          .travel-hero:not(.unrolled) .travel-scroll-knob-bottom {
            opacity: 1;
          }
          .travel-hero:not(.unrolled) .travel-hero-content {
            clip-path: inset(0 0% 0 0%);
            opacity: 1;
          }
          .travel-hero:not(.unrolled) .travel-back,
          .travel-hero:not(.unrolled) .travel-hero-title,
          .travel-hero:not(.unrolled) .travel-hero-ornament,
          .travel-hero:not(.unrolled) .travel-hero-year,
          .travel-hero:not(.unrolled) .travel-hero-text p,
          .travel-hero:not(.unrolled) .travel-hero-signature,
          .travel-hero:not(.unrolled) .travel-hero-seal,
          .travel-hero:not(.unrolled) .travel-hero-stamp,
          .travel-hero:not(.unrolled) .travel-dust {
            opacity: 1; transform: none; filter: none;
          }
        }
      `}</style>
      <header className={`travel-hero ${scrollUnrolled ? "unrolled" : ""}`}>
        {/* ---- 左侧仿真卷轴 ---- */}
        <div className="travel-scroll-rod left">
          <div className="travel-scroll-knob-top" />
          <div className="travel-scroll-shaft" />
          <div className="travel-scroll-knob-bottom" />
        </div>
        {/* ---- 右侧仿真卷轴 ---- */}
        <div className="travel-scroll-rod right">
          <div className="travel-scroll-knob-top" />
          <div className="travel-scroll-shaft" />
          <div className="travel-scroll-knob-bottom" />
        </div>
        {/* 金色尘埃粒子 */}
        <div className="travel-dust" />
        <div className="travel-dust" />
        <div className="travel-dust" />
        <div className="travel-dust" />
        <div className="travel-dust" />
        <Link to="/mickey" className="travel-back">
          ← 返回妙妙工具箱
        </Link>
        <div className="travel-hero-content">
          <h1 className="travel-hero-title">漫游指南</h1>
          <div className="travel-hero-ornament" />
          <div className="travel-hero-year">丙午年 · 启程</div>

          <div className="travel-hero-text">
            <p>世界是一张未折叠的地图，亦是无数条待踏足的路径。</p>
            <p>余性好游，尝遍历山川城郭。</p>
            <p>每至一城，必察其街巷肌理，尝其市井烟火，录其食宿交通。</p>
            <p>积岁累月，汇为此卷。</p>
            <p>非为奇谈志异，实乃一己之攻略备忘。</p>
            <p>愿后来者，持此卷，少走弯路，多遇良辰。</p>
          </div>

          <div className="travel-hero-signature" style={{ display: 'none' }}>
            <span className="travel-hero-name">—— 漫游使 小叶 识</span>
            <div className="travel-hero-seal"><span>漫游</span></div>
          </div>

          <button className="travel-hero-stamp" onClick={() => onScrollToMap?.()}>
            开启<br/>旅程
          </button>
        </div>
      </header>
    </>
  );
}