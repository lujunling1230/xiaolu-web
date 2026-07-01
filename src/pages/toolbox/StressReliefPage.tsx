import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * 解压馆 · Stress Relief Room
 *
 * 三个解压小游戏，马卡龙色系，即点即玩。
 * 1. 无限捏泡泡 Pop It —— SVG 网格气泡，点击爆裂 + 星星粒子 + 啵声
 * 2. 禅意切割 Zen Cut —— 拖拽划线，物体裂成两半坠落旋转
 * 3. 重力涂鸦 Gravity Doodle —— Canvas 画线，圆点受重力下坠堆积
 */

/* ============================================================
   通用：马卡龙色板 + Web Audio
   ============================================================ */
const MACARON = ["#ffb6c1", "#b6d5e8", "#b8e0d2", "#d4c5e2", "#f5e1b8", "#f6c6c6"];

let audioCtx: AudioContext | null = null;
const getCtx = () => {
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    audioCtx = new Ctor();
  }
  return audioCtx;
};
/** 气泡"啵"声 */
const playPop = () => {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(720, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    /* 静音 */
  }
};

/* ============================================================
   游戏 1：无限捏泡泡 Pop It
   ============================================================ */
interface Bubble {
  id: number;
  cx: number;
  cy: number;
  r: number;
  color: string;
  popped: boolean;
}
interface Star {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
}

const COLS = 6;
const ROWS = 6;
const GAP = 14;
const CELL = 44;

const makeBubbles = (): Bubble[] => {
  const list: Bubble[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      list.push({
        id: r * COLS + c,
        cx: c * (CELL + GAP) + CELL / 2 + GAP,
        cy: r * (CELL + GAP) + CELL / 2 + GAP,
        r: CELL / 2 - 2,
        color: MACARON[(r * COLS + c) % MACARON.length],
        popped: false,
      });
    }
  }
  return list;
};

const PopItGame: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>(makeBubbles);
  const [stars, setStars] = useState<Star[]>([]);
  const starId = useRef(0);

  const pop = (b: Bubble) => {
    playPop();
    // 爆裂星星
    const ns: Star[] = Array.from({ length: 6 }, () => ({
      id: starId.current++,
      x: b.cx,
      y: b.cy,
      dx: (Math.random() - 0.5) * 70,
      dy: (Math.random() - 0.5) * 70 - 10,
      color: MACARON[Math.floor(Math.random() * MACARON.length)],
    }));
    setStars((prev) => [...prev, ...ns]);
    // 标记爆裂
    setBubbles((prev) =>
      prev.map((x) => (x.id === b.id ? { ...x, popped: true } : x))
    );
    // 600ms 后原地重生新气泡（换色）
    window.setTimeout(() => {
      setBubbles((prev) =>
        prev.map((x) =>
          x.id === b.id
            ? {
                ...x,
                popped: false,
                color: MACARON[Math.floor(Math.random() * MACARON.length)],
              }
            : x
        )
      );
    }, 600);
    // 清理星星
    window.setTimeout(() => {
      setStars((prev) => prev.filter((s) => !ns.some((nn) => nn.id === s.id)));
    }, 700);
  };

  const W = COLS * (CELL + GAP) + GAP;
  const H = ROWS * (CELL + GAP) + GAP;

  return (
    <div className="sr-game-stage">
      <svg width={W} height={H} className="sr-pop-svg">
        {bubbles.map((b) => (
          <motion.circle
            key={b.id}
            cx={b.cx}
            cy={b.cy}
            r={b.r}
            fill={b.color}
            initial={false}
            animate={{ scale: b.popped ? 0 : 1, opacity: b.popped ? 0 : 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ transformOrigin: `${b.cx}px ${b.cy}px`, cursor: "pointer" }}
            onClick={() => !b.popped && pop(b)}
          />
        ))}
        {/* 星星粒子 */}
        {stars.map((s) => (
          <motion.text
            key={s.id}
            x={s.x}
            y={s.y}
            fontSize={16}
            fill={s.color}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: s.dx, y: s.dy, scale: 0.3, rotate: 180 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            ✦
          </motion.text>
        ))}
      </svg>
      <p className="sr-game-tip">点点看，永远捏不完。</p>
    </div>
  );
};

/* ============================================================
   游戏 2：禅意切割 Zen Cut
   ============================================================ */
interface Block {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  cut: { rx1: number; ry1: number; rx2: number; ry2: number; key: number } | null;
}

const makeBlocks = (): Block[] =>
  Array.from({ length: 5 }, (_, i) => ({
    id: i,
    x: 40 + (i % 3) * 120 + (i % 2) * 20,
    y: 50 + Math.floor(i / 3) * 130 + (i % 2) * 30,
    w: 90 + (i % 2) * 20,
    h: 70,
    color: MACARON[i % MACARON.length],
    cut: null,
  }));

const ZenCutGame: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState<Block[]>(makeBlocks);
  const [dragPts, setDragPts] = useState<{ x: number; y: number }[]>([]);
  const cutting = useRef(false);
  const cutKey = useRef(0);

  const relPos = (e: React.PointerEvent) => {
    const rect = stageRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onDown = (e: React.PointerEvent) => {
    cutting.current = true;
    setDragPts([relPos(e)]);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!cutting.current) return;
    setDragPts((prev) => [...prev, relPos(e)]);
  };
  const onUp = () => {
    if (!cutting.current) return;
    cutting.current = false;
    const pts = dragPts;
    if (pts.length < 2) {
      setDragPts([]);
      return;
    }
    // 找到穿过每个 block 的首尾点，生成切割
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.cut) return b;
        const inside = pts.filter(
          (p) => p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h
        );
        if (inside.length < 2) return b;
        const first = inside[0];
        const last = inside[inside.length - 1];
        return {
          ...b,
          cut: {
            rx1: first.x - b.x,
            ry1: first.y - b.y,
            rx2: last.x - b.x,
            ry2: last.y - b.y,
            key: cutKey.current++,
          },
        };
      })
    );
    setDragPts([]);
  };

  // 切割完成后重生
  const respawn = (id: number) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              cut: null,
              x: 40 + Math.random() * 260,
              y: 50 + Math.random() * 180,
              color: MACARON[Math.floor(Math.random() * MACARON.length)],
            }
          : b
      )
    );
  };

  const polyTop = (b: Block) =>
    `polygon(0% 0%, 100% 0%, ${b.cut!.rx2}px ${b.cut!.ry2}px, ${b.cut!.rx1}px ${b.cut!.ry1}px)`;
  const polyBot = (b: Block) =>
    `polygon(${b.cut!.rx1}px ${b.cut!.ry1}px, ${b.cut!.rx2}px ${b.cut!.ry2}px, 100% 100%, 0% 100%)`;

  return (
    <div
      className="sr-game-stage sr-zencut"
      ref={stageRef}
      style={{ touchAction: "none" }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
    >
      <div className="sr-zencut-area">
        {/* 物体 */}
        {blocks.map((b) =>
          b.cut ? (
            <div key={b.id} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h }}>
              {/* 上半 */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: b.color,
                  borderRadius: 16,
                  clipPath: polyTop(b),
                }}
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                animate={{ x: -6, y: -50, rotate: -14, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeIn" }}
                onAnimationComplete={() => respawn(b.id)}
              />
              {/* 下半 */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: b.color,
                  borderRadius: 16,
                  clipPath: polyBot(b),
                }}
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                animate={{ x: 8, y: 80, rotate: 18, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeIn" }}
              />
            </div>
          ) : (
            <motion.div
              key={b.id}
              style={{
                position: "absolute",
                left: b.x,
                top: b.y,
                width: b.w,
                height: b.h,
                background: b.color,
                borderRadius: 16,
                boxShadow: "0 8px 20px -8px rgba(0,0,0,0.15), inset 0 -6px 12px rgba(255,255,255,0.3)",
              }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3 + b.id * 0.3, repeat: Infinity, ease: "easeInOut" }}
            />
          )
        )}
        {/* 切割轨迹 */}
        {dragPts.length > 1 && (
          <svg className="sr-cut-line" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <polyline
              points={dragPts.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="#fff"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.85}
            />
          </svg>
        )}
      </div>
      <p className="sr-game-tip">拖动划线，切开它们。</p>
    </div>
  );
};

/* ============================================================
   游戏 3：重力涂鸦 Gravity Doodle
   ============================================================ */
interface GDot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  settled: boolean;
}

const GravityDoodleGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<GDot[]>([]);
  const drawingRef = useRef(false);
  const lastPt = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  // 高度图：按列记录已堆积的最高 y（值越小越高）
  const heightMap = useRef<number[]>([]);

  const resize = () => {
    const cv = canvasRef.current!;
    const dpr = window.devicePixelRatio || 1;
    const rect = cv.getBoundingClientRect();
    sizeRef.current = { w: rect.width, h: rect.height };
    cv.width = rect.width * dpr;
    cv.height = rect.height * dpr;
    const ctx = cv.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cols = Math.ceil(rect.width / 8);
    heightMap.current = new Array(cols).fill(rect.height);
  };

  useEffect(() => {
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const loop = () => {
      const { w, h } = sizeRef.current;
      const ctx = canvasRef.current!.getContext("2d")!;
      ctx.clearRect(0, 0, w, h);
      const gravity = 0.35;
      const dots = dotsRef.current;
      for (const d of dots) {
        if (!d.settled) {
          d.vy += gravity;
          d.x += d.vx;
          d.y += d.vy;
          // 列高度检测堆积
          const col = Math.max(0, Math.min(heightMap.current.length - 1, Math.floor(d.x / 8)));
          if (d.y + d.r >= heightMap.current[col]) {
            d.y = heightMap.current[col] - d.r;
            d.vy = 0;
            d.vx = 0;
            d.settled = true;
            // 更新该列及邻近列高度（形成堆积斜面）
            for (let c = Math.max(0, col - 1); c <= Math.min(heightMap.current.length - 1, col + 1); c++) {
              heightMap.current[c] = Math.max(0, Math.min(heightMap.current[c], d.y - d.r));
            }
          }
          // 越界回收
          if (d.x < -20 || d.x > w + 20) d.settled = true;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const relPos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onDown = (e: React.PointerEvent) => {
    drawingRef.current = true;
    lastPt.current = relPos(e);
    spawnDot(lastPt.current);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drawingRef.current) return;
    const p = relPos(e);
    const lp = lastPt.current!;
    // 在两点间插值生成连续圆点
    const dx = p.x - lp.x;
    const dy = p.y - lp.y;
    const dist = Math.hypot(dx, dy);
    const steps = Math.max(1, Math.floor(dist / 4));
    for (let i = 1; i <= steps; i++) {
      spawnDot({ x: lp.x + (dx * i) / steps, y: lp.y + (dy * i) / steps });
    }
    lastPt.current = p;
  };
  const onUp = () => {
    drawingRef.current = false;
    lastPt.current = null;
  };

  const spawnDot = (p: { x: number; y: number }) => {
    dotsRef.current.push({
      x: p.x,
      y: p.y,
      vx: 0,
      vy: 0,
      r: 4 + Math.random() * 3,
      color: MACARON[Math.floor(Math.random() * MACARON.length)],
      settled: false,
    });
    // 限制总量避免卡顿
    if (dotsRef.current.length > 600) {
      dotsRef.current.splice(0, 100);
    }
  };

  const clearAll = () => {
    dotsRef.current = [];
    const { h } = sizeRef.current;
    heightMap.current = new Array(Math.ceil(sizeRef.current.w / 8)).fill(h);
  };

  return (
    <div className="sr-game-stage sr-doodle">
      <canvas
        ref={canvasRef}
        className="sr-doodle-canvas"
        style={{ touchAction: "none" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      />
      <button className="sr-trash" onClick={clearAll} aria-label="清空画布">
        🗑
      </button>
      <p className="sr-game-tip">画几笔，看它们落下。</p>
    </div>
  );
};

/* ============================================================
   主页面
   ============================================================ */
type GameKey = "pop" | "cut" | "doodle";

const GAMES: {
  key: GameKey;
  name: string;
  desc: string;
  icon: string;
  gradient: string;
}[] = [
  {
    key: "pop",
    name: "无限捏泡泡",
    desc: "永远捏不完的满足。",
    icon: "🫧",
    gradient: "linear-gradient(135deg, #ffd6e0, #b6d5e8)",
  },
  {
    key: "cut",
    name: "禅意切割",
    desc: "一刀两半，万物可裂。",
    icon: "🔪",
    gradient: "linear-gradient(135deg, #b8e0d2, #d4c5e2)",
  },
  {
    key: "doodle",
    name: "重力涂鸦",
    desc: "画下的都会落下。",
    icon: "✏️",
    gradient: "linear-gradient(135deg, #f5e1b8, #ffb6c1)",
  },
];

const StressReliefPage: React.FC = () => {
  const [active, setActive] = useState<GameKey | null>(null);

  return (
    <div className="sr-page">
      {/* 顶部返回 */}
      <header className="sr-topbar">
        <Link to="/mickey" className="sr-back">
          ← 回到妙妙工具箱
        </Link>
        <span className="sr-topbar-meta">Stress Relief Room</span>
      </header>

      {/* 标题区 */}
      <section className="sr-hero">
        <motion.h1
          className="sr-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          解压馆
        </motion.h1>
        <motion.p
          className="sr-subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          允许一切崩塌。
        </motion.p>
      </section>

      {/* 内容区 */}
      <section className="sr-content">
        <AnimatePresence mode="wait">
          {active === null ? (
            <motion.div
              key="cards"
              className="sr-cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {GAMES.map((g) => (
                <motion.button
                  key={g.key}
                  className="sr-card"
                  onClick={() => setActive(g.key)}
                  whileHover={{ y: -6 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="sr-card-icon" style={{ background: g.gradient }}>
                    {g.icon}
                  </div>
                  <h3 className="sr-card-name">{g.name}</h3>
                  <p className="sr-card-desc">{g.desc}</p>
                  <span className="sr-card-play">开始 →</span>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="game"
              className="sr-game-view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <button className="sr-game-back" onClick={() => setActive(null)}>
                ← 换一个
              </button>
              {active === "pop" && <PopItGame />}
              {active === "cut" && <ZenCutGame />}
              {active === "doodle" && <GravityDoodleGame />}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <style>{`
        .sr-page,
        .sr-page * { cursor: auto; }
        .sr-page a, .sr-page button { cursor: pointer; }

        .sr-page {
          min-height: 100vh;
          color: #5a4a52;
          background:
            radial-gradient(120% 80% at 50% 0%, #fdf6f8 0%, #f7f3f5 50%, #f0eaef 100%);
          font-family: "Noto Sans SC", system-ui, sans-serif;
          padding: 0 24px 80px;
        }

        /* 顶部 */
        .sr-topbar {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 860px; margin: 0 auto; padding: 24px 4px 0;
        }
        .sr-back {
          font-size: 14px; color: #9a8a92; text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease, transform 0.25s ease;
        }
        .sr-back:hover { color: #d48a9a; transform: translateX(-3px); }
        .sr-topbar-meta {
          font-size: 11px; color: #b8a8b0; letter-spacing: 0.28em; text-transform: uppercase;
        }

        /* 标题区 */
        .sr-hero {
          max-width: 860px; margin: 0 auto; padding: 44px 4px 32px; text-align: center;
        }
        .sr-title {
          font-size: clamp(30px, 5vw, 44px); font-weight: 800; color: #6b5560;
          margin: 0 0 10px; letter-spacing: 0.06em;
        }
        .sr-subtitle {
          font-size: 15px; color: #a898a0; margin: 0; letter-spacing: 0.08em;
        }

        /* 内容区 */
        .sr-content { max-width: 860px; margin: 0 auto; }

        /* 卡片列表（横向滚动，移动端纵向） */
        .sr-cards {
          display: flex; gap: 20px; padding: 8px 4px;
          overflow-x: auto; scrollbar-width: thin;
        }
        .sr-cards::-webkit-scrollbar { height: 6px; }
        .sr-cards::-webkit-scrollbar-thumb { background: rgba(180,140,160,0.3); border-radius: 3px; }
        @media (max-width: 640px) {
          .sr-cards { flex-direction: column; }
        }

        .sr-card {
          flex-shrink: 0; width: 240px; text-align: left; padding: 28px 24px;
          background: #fff; border: 1px solid #ece4e8; border-radius: 18px;
          box-shadow: 0 10px 30px -14px rgba(150,120,140,0.2);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .sr-card:hover {
          border-color: rgba(212,138,154,0.4);
          box-shadow: 0 18px 40px -14px rgba(150,120,140,0.3);
        }
        @media (max-width: 640px) { .sr-card { width: 100%; } }
        .sr-card-icon {
          width: 56px; height: 56px; border-radius: 16px; display: flex;
          align-items: center; justify-content: center; font-size: 28px; margin-bottom: 18px;
          box-shadow: inset 0 -4px 10px rgba(255,255,255,0.4);
        }
        .sr-card-name { font-size: 17px; font-weight: 700; color: #5a4a52; margin: 0 0 6px; }
        .sr-card-desc { font-size: 13px; color: #a898a0; margin: 0 0 16px; line-height: 1.6; }
        .sr-card-play { font-size: 13px; color: #d48a9a; font-weight: 600; letter-spacing: 0.04em; }

        /* 游戏视图 */
        .sr-game-view { position: relative; padding: 8px 4px; }
        .sr-game-back {
          font-size: 13px; color: #9a8a92; background: none; border: none;
          padding: 0 0 16px; font-family: inherit; transition: color 0.2s ease;
        }
        .sr-game-back:hover { color: #d48a9a; }

        .sr-game-stage {
          display: flex; flex-direction: column; align-items: center;
          background: #fff; border: 1px solid #ece4e8; border-radius: 18px;
          padding: 32px 24px; min-height: 420px;
          box-shadow: 0 10px 30px -14px rgba(150,120,140,0.15);
        }
        .sr-game-tip { margin: 20px 0 0; font-size: 13px; color: #b8a8b0; letter-spacing: 0.05em; }
        .sr-pop-svg { max-width: 100%; }

        /* 禅意切割 */
        .sr-zencut { align-items: stretch; }
        .sr-zencut-area {
          position: relative; width: 100%; height: 360px; border-radius: 14px;
          background: linear-gradient(160deg, #f7f3f5, #efe9ee);
          overflow: hidden;
        }
        .sr-cut-line { width: 100%; height: 100%; }

        /* 重力涂鸦 */
        .sr-doodle { padding: 0; overflow: hidden; position: relative; }
        .sr-doodle-canvas { display: block; width: 100%; height: 420px; border-radius: 18px; }
        .sr-trash {
          position: absolute; bottom: 56px; right: 20px; z-index: 5;
          width: 44px; height: 44px; border-radius: 50%; border: none;
          background: #fff; font-size: 18px; box-shadow: 0 4px 14px -4px rgba(0,0,0,0.2);
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .sr-trash:hover { transform: scale(1.1); background: #fff5f7; }
      `}</style>
    </div>
  );
};

export default StressReliefPage;
