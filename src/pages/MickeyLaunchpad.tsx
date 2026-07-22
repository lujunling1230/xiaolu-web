import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * 作品集 · Mickey Launchpad
 *
 * 深色星空背景 + 闪烁星辰 + 金色发光圆形卡片。
 * 7 个作品，北斗七星布局，动态 SVG 连线。
 */

/* ===== 工具数据（严格按图） ===== */
interface Tool {
  name: string;
  slogan: string;
  icon: React.ReactNode;
  url: string;
  glow?: boolean;
  hoverHint?: string;
}

/* ===== 爱情公寓图标：八人 Q 版群像（内联 SVG，避免路径依赖） ===== */
const ApartmentIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width={48} height={48} style={{ borderRadius: "50%", filter: "drop-shadow(0 0 6px rgba(255,215,0,0.3))" }}>
    <defs>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFF3D6" stopOpacity={1}/>
        <stop offset="70%" stop-color="#FFE4B5" stopOpacity={0.9}/>
        <stop offset="100%" stop-color="#FFD700" stopOpacity={0.3}/>
      </radialGradient>
    </defs>
    <circle cx="24" cy="24" r="23" fill="url(#glow)"/>
    <circle cx="24" cy="24" r="23" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.25"/>
    {/* 一菲 */}
    <g transform="translate(24, 10)"><circle cx="0" cy="0" r="4.2" fill="#C41E3A"/></g>
    {/* 子乔 */}
    <g transform="translate(34, 14)"><circle cx="0" cy="0" r="4" fill="#5B4FC4"/></g>
    {/* 美嘉 */}
    <g transform="translate(37, 24)"><circle cx="0" cy="0" r="4" fill="#9B59B6"/></g>
    {/* 小贤 */}
    <g transform="translate(34, 34)"><circle cx="0" cy="0" r="4" fill="#4A90D9"/></g>
    {/* 悠悠 */}
    <g transform="translate(14, 34)"><circle cx="0" cy="0" r="4" fill="#E8A838"/></g>
    {/* 关谷 */}
    <g transform="translate(11, 24)"><circle cx="0" cy="0" r="4" fill="#8B5A2B"/></g>
    {/* 张伟 */}
    <g transform="translate(14, 14)"><circle cx="0" cy="0" r="4" fill="#6B2D5C"/></g>
    {/* 中心爱心 */}
    <path d="M 24,20.8 C 22,18.5 18,21 18,23.5 C 18,26.5 24,30 24,30 C 24,30 30,26.5 30,23.5 C 30,21 26,18.5 24,20.8 Z" fill="#FFD700" opacity="0.95"/>
  </svg>
);

const tools: Tool[] = [
  { name: "回血清单", slogan: "允许一切崩塌，只做一件极小的事。", icon: "🔋", url: "/toolbox/recharge", glow: true, hoverHint: "充一会儿电" },
  { name: "漫游指南", slogan: "走过的路，看过的云。", icon: "🗺️", url: "/toolbox/travel", glow: true, hoverHint: "出发吧" },
  { name: "森林疗愈室", slogan: "调节呼吸与情绪", icon: "🌲", url: "/healing", glow: true, hoverHint: "深呼吸" },
  { name: "爱情公寓", slogan: "3601·3602·3603 全员在线", icon: <ApartmentIcon />, url: "/toolbox/answer", glow: true, hoverHint: "聊聊呗" },
  { name: "通关清单", slogan: "把人生变成一场 RPG。", icon: "🎯", url: "/toolbox/quests", glow: true, hoverHint: "命中目标！" },
  { name: "物资管家", slogan: "库存与保质期管理", icon: "📦", url: "/toolbox/supplies", glow: true, hoverHint: "清点一下" },
  { name: "解忧杂货店", slogan: "总有一句话，能解开你的心结。", icon: "🕯️", url: "/toolbox/advice", glow: true, hoverHint: "进来坐坐？" },
];

/* ===== 北斗七星 Grid 定位 (column, row) ===== */
const gridPositions: Record<number, { col: number; row: number }> = {
  0: { col: 2, row: 4 }, // 回血清单
  1: { col: 3, row: 3 }, // 漫游指南
  2: { col: 1, row: 2 }, // 森林疗愈室
  3: { col: 2, row: 2 }, // 爱情公寓
  4: { col: 3, row: 2 }, // 通关清单
  5: { col: 4, row: 2 }, // 物资管家
  6: { col: 4, row: 1 }, // 解忧杂货店
};

/* ===== Web Audio 合成"叮"声 ===== */
let audioCtx: AudioContext | null = null;
const playDing = () => {
  try {
    if (!audioCtx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new Ctor();
    }
    const ctx = audioCtx;
    const now = ctx.currentTime;
    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(i === 0 ? 0.25 : 0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.4);
    });
  } catch { /* 静音处理 */ }
};

interface Star { top: number; left: number; size: number; delay: number; duration: number; }

/* ===== 单个工具按钮 ===== */
const ToolButton: React.FC<{ tool: Tool; index: number }> = ({ tool, index }) => {
  const [ripping, setRipping] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timer = useRef<number | null>(null);

  const handleClick = () => {
    if (ripping) return;
    playDing();
    setRipping(true);
    timer.current = window.setTimeout(() => {
      window.open(tool.url, "_blank", "noopener,noreferrer");
    }, 300);
    window.setTimeout(() => setRipping(false), 750);
  };

  return (
    <motion.div
      className="mickey-tool-wrap"
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay: (index % 2) * 0.07 + Math.floor(index / 2) * 0.05, ease: "easeOut" }}
    >
      <motion.button
        type="button"
        className={tool.glow ? "mickey-btn mickey-btn-glow" : "mickey-btn"}
        onClick={handleClick}
        whileHover={{ y: -8, scale: tool.glow ? 1.05 : 1 }}
        animate={ripping ? { scale: 1.5 } : { scale: 1 }}
        transition={{ duration: ripping ? 0.25 : 0.4, ease: "easeOut" }}
        aria-label={`打开 ${tool.name}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className="mickey-silhouette" aria-hidden="true" />
        <AnimatePresence>
          {ripping && (
            <motion.span
              className="mickey-ripple"
              initial={{ scale: 0.8, opacity: 0.85 }}
              animate={{ scale: 2.6, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
        <span className="mickey-icon">{tool.icon}</span>
      </motion.button>

      <AnimatePresence>
        {tool.hoverHint && hovered && (
          <motion.span
            className="mickey-hover-hint"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
          >
            {tool.hoverHint}
          </motion.span>
        )}
      </AnimatePresence>

      <div className="mickey-tool-text">
        <p className="mickey-tool-name">{tool.name}</p>
        <p className="mickey-tool-slogan">{tool.slogan}</p>
      </div>
    </motion.div>
  );
};

/* ===== 主组件 ===== */
const MickeyLaunchpad: React.FC = () => {
  const stars = useMemo<Star[]>(
    () => Array.from({ length: 70 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 4,
      duration: Math.random() * 2.5 + 1.8,
    })),
    []
  );

  const gridRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [linePoints, setLinePoints] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const computePositions = () => {
      const grid = gridRef.current;
      if (!grid) return;
      const gridRect = grid.getBoundingClientRect();
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i < tools.length; i++) {
        const el = itemRefs.current[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          points.push({
            x: rect.left + rect.width / 2 - gridRect.left,
            y: rect.top + rect.height / 2 - gridRect.top,
          });
        }
      }
      setLinePoints(points);
    };

    computePositions();
    const observer = new ResizeObserver(computePositions);
    if (gridRef.current) observer.observe(gridRef.current);
    window.addEventListener("resize", computePositions);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", computePositions);
    };
  }, []);

  const polylinePoints = linePoints.length === tools.length
    ? linePoints.map((p) => `${p.x},${p.y}`).join(" ")
    : "";

  return (
    <div className="mickey-page">
      {/* 星空层 */}
      <div className="mickey-stars" aria-hidden="true">
        {stars.map((s, i) => (
          <span
            key={i}
            className="mickey-star"
            style={{
              top: `${s.top}%`, left: `${s.left}%`,
              width: `${s.size}px`, height: `${s.size}px`,
              animationDelay: `${s.delay}s`, animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* 月亮装饰 */}
      <div className="mickey-moon" aria-hidden="true" />

      {/* 左上角退出按钮 */}
      <Link to="/?mode=full" className="mickey-exit" aria-label="回到主站">
        &larr; 回到主站 ✨
      </Link>

      {/* 标题区 */}
      <section className="mickey-hero">
        <motion.h1
          className="mickey-title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          作品集
        </motion.h1>
        <motion.p
          className="mickey-subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          哦~ 土豆！请选择你的工具。
        </motion.p>
      </section>

      {/* 工具网格 — 北斗七星布局 */}
      <section className="mickey-grid" ref={gridRef}>
        {polylinePoints && (
          <svg className="mickey-constellation" aria-hidden="true">
            <polyline
              points={polylinePoints}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              fill="none"
            />
          </svg>
        )}
        {tools.map((t, i) => {
          const pos = gridPositions[i];
          return (
            <div
              key={t.name}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="mickey-tool-wrap"
              style={{ gridColumn: pos.col, gridRow: pos.row }}
            >
              <ToolButton tool={t} index={i} />
            </div>
          );
        })}
      </section>

      {/* 页脚 */}
      <footer className="mickey-foot">
        <span>叮 ~ 魔法已就绪</span>
      </footer>

      <style>{`
        .mickey-page, .mickey-page * { cursor: auto; }
        .mickey-page button, .mickey-page a, .mickey-page [role="button"] { cursor: pointer; }

        .mickey-page {
          position: relative; min-height: 100vh; overflow: hidden;
          color: #f5f7ff;
          background: radial-gradient(120% 80% at 50% -10%, #1a2550 0%, #0a1024 45%, #050816 100%);
          font-family: "Noto Sans SC", system-ui, -apple-system, sans-serif;
          padding: 0 24px 80px;
        }

        /* 星辰 */
        .mickey-stars { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .mickey-star {
          position: absolute; border-radius: 50%; background: #fff;
          opacity: 0.7; animation: mickey-twinkle linear infinite;
        }
        @keyframes mickey-twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.7); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }

        /* 月亮 */
        .mickey-moon {
          position: absolute; top: 8%; right: 8%; z-index: 0;
          width: 90px; height: 90px; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fffdf0, #f4e8b8 60%, #d9c789 100%);
          box-shadow: 0 0 50px rgba(244, 232, 184, 0.35), 0 0 100px rgba(244, 232, 184, 0.15);
          opacity: 0.85;
        }

        /* 退出按钮 —— 魔法道具胶囊 */
        .mickey-exit {
          position: fixed; top: 20px; left: 20px; z-index: 50;
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 22px; border-radius: 999px;
          font-size: 13px; color: #ffffff; text-decoration: none;
          letter-spacing: 0.05em; font-weight: 500;
          background: rgba(20, 16, 40, 0.55);
          -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 216, 107, 0.35);
          box-shadow: 0 4px 18px -6px rgba(0, 0, 0, 0.5), 0 0 14px rgba(255, 216, 107, 0.15);
          transition: background 0.28s ease, color 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease, transform 0.28s ease;
        }
        .mickey-exit:hover {
          background: rgba(60, 44, 20, 0.65);
          color: #fff;
          border-color: rgba(255, 216, 107, 0.7);
          box-shadow: 0 6px 22px -6px rgba(255, 168, 76, 0.4), 0 0 24px rgba(255, 216, 107, 0.3);
          transform: translateX(-2px);
        }

        /* 标题区 */
        .mickey-hero {
          position: relative; z-index: 2;
          max-width: 640px; margin: 0 auto; padding: 56px 4px 44px; text-align: center;
        }
        .mickey-title {
          font-family: "Noto Sans SC", system-ui, sans-serif;
          font-size: clamp(34px, 5.5vw, 52px); font-weight: 700;
          color: #fff; margin: 0 0 14px; letter-spacing: 0.08em;
          text-shadow: 0 0 24px rgba(255, 216, 107, 0.35);
        }
        .mickey-subtitle {
          font-size: 16px; color: #d0daf5; margin: 0; letter-spacing: 0.06em;
        }

        /* 工具网格 — 北斗七星布局，4列4行 */
        .mickey-grid {
          position: relative; z-index: 2;
          max-width: 720px; margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: auto auto auto auto;
          gap: 32px 20px;
          padding: 8px 4px 0;
          justify-items: center;
        }

        /* 星座连线 SVG */
        .mickey-constellation {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .mickey-tool-wrap { display: flex; flex-direction: column; align-items: center; }

        /* 圆形按钮 */
        .mickey-btn {
          position: relative;
          width: 96px; height: 96px; border-radius: 50%;
          border: none; padding: 0;
          background: rgba(8, 12, 28, 0.55);
          box-shadow: 0 8px 24px -8px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255, 216, 107, 0.18);
          display: flex; align-items: center; justify-content: center;
          overflow: visible; isolation: isolate;
          transition: box-shadow 0.3s ease;
        }
        .mickey-btn:hover {
          box-shadow: 0 14px 30px -8px rgba(255, 216, 107, 0.35), inset 0 0 0 1px rgba(255, 216, 107, 0.4);
        }

        /* 暖光工具：暖橙光晕 */
        .mickey-btn-glow {
          background: rgba(40, 24, 8, 0.55);
          box-shadow: 0 8px 24px -6px rgba(255, 168, 76, 0.45), 0 0 22px rgba(255, 168, 76, 0.25), inset 0 0 0 1px rgba(255, 200, 120, 0.3);
          animation: mickey-glow-pulse 2.5s ease-in-out infinite;
        }
        @keyframes mickey-glow-pulse {
          0%, 100% { box-shadow: 0 8px 24px -6px rgba(255, 168, 76, 0.45), 0 0 22px rgba(255, 168, 76, 0.25), inset 0 0 0 1px rgba(255, 200, 120, 0.3); }
          50% { box-shadow: 0 8px 24px -6px rgba(255, 168, 76, 0.6), 0 0 34px rgba(255, 168, 76, 0.4), inset 0 0 0 1px rgba(255, 200, 120, 0.5); }
        }
        .mickey-btn-glow:hover {
          box-shadow: 0 14px 34px -6px rgba(255, 168, 76, 0.7), 0 0 44px rgba(255, 168, 76, 0.5), inset 0 0 0 1px rgba(255, 216, 107, 0.6);
        }

        .mickey-hover-hint {
          position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
          white-space: nowrap; font-size: 12px; color: #ffd49a;
          letter-spacing: 0.05em; pointer-events: none;
          text-shadow: 0 0 8px rgba(255, 168, 76, 0.5);
        }

        /* 米奇头剪影水印 */
        .mickey-silhouette {
          position: absolute; inset: 0; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='64' r='26' fill='%23000'/%3E%3Ccircle cx='28' cy='34' r='15' fill='%23000'/%3E%3Ccircle cx='72' cy='34' r='15' fill='%23000'/%3E%3C/svg%3E");
          background-size: 78% 78%; background-position: center 58%; background-repeat: no-repeat;
          opacity: 0.28; pointer-events: none;
        }

        .mickey-ripple {
          position: absolute; inset: 0; z-index: 1;
          border-radius: 50%; border: 2px solid #ffd86b; pointer-events: none;
        }

        .mickey-icon {
          position: relative; z-index: 2; font-size: 36px; line-height: 1;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
        }

        /* 文字 */
        .mickey-tool-text { margin-top: 14px; text-align: center; }
        .mickey-tool-name {
          font-size: 14px; font-weight: 600; color: #e8edff; margin: 0 0 3px;
          letter-spacing: 0.03em;
        }
        .mickey-tool-slogan {
          font-size: 12px; color: #b0bdd9; margin: 0; letter-spacing: 0.02em;
        }

        /* 页脚 */
        .mickey-foot {
          position: relative; z-index: 2;
          max-width: 640px; margin: 0 auto; padding: 56px 4px 0;
          text-align: center; font-size: 13px; color: #8a98c0; letter-spacing: 0.08em;
        }

        @media (max-width: 640px) {
          .mickey-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
          }
          .mickey-tool-wrap {
            grid-column: auto !important;
            grid-row: auto !important;
          }
          .mickey-constellation {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .mickey-btn { width: 80px; height: 80px; }
          .mickey-icon { font-size: 30px; }
          .mickey-moon { width: 64px; height: 64px; top: 5%; right: 5%; }
        }
      `}</style>
    </div>
  );
};

export default MickeyLaunchpad;