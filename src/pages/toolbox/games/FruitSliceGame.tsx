import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ============================================================
   切水果 · Fruit Slice
   一刀两断，万念皆空
   ============================================================ */

/* ---------- 接口 ---------- */
interface Fruit {
  id: number;
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  color: string;
  innerColor: string;
  leafColor: string;
  type: "fruit" | "bomb";
  shape: "watermelon" | "orange" | "apple" | "grape" | "lemon" | "bomb";
  sliced: boolean;
  opacity: number;
  rot: number;
  rotV: number;
}

interface SliceHalf {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  color: string;
  innerColor: string;
  leafColor: string;
  shape: "watermelon" | "orange" | "apple" | "grape" | "lemon" | "bomb";
  rot: number;
  rotV: number;
  life: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  life: number;
  maxLife: number;
}

interface TrailPoint {
  x: number;
  y: number;
  life: number;
}

/* ---------- 常量 ---------- */
const GRAVITY = 0.22;
const BOMB_CHANCE = 0.15;
const CANVAS_H = window.innerWidth < 600 ? 300 : 360;
const STORAGE_KEY = "game_best_fruitslice";
const ACHIEVEMENTS = [
  { score: 10, title: "初入刀道" },
  { score: 30, title: "刀锋渐利" },
  { score: 50, title: "刀光剑影" },
  { score: 100, title: "你已超脱凡尘" },
];

const SHAPES: Array<Exclude<Fruit["shape"], "bomb">> = ["watermelon", "orange", "apple", "grape", "lemon"];

/* ---------- 水果配置 ---------- */
function fruitConfig(shape: Exclude<Fruit["shape"], "bomb">): Pick<Fruit, "color" | "innerColor" | "leafColor" | "r"> {
  switch (shape) {
    case "watermelon":
      return { color: "#2d6a2d", innerColor: "#e74c3c", leafColor: "#1a4d1a", r: 32 };
    case "orange":
      return { color: "#e67e22", innerColor: "#f39c12", leafColor: "#27ae60", r: 24 };
    case "apple":
      return { color: "#c0392b", innerColor: "#fdebd0", leafColor: "#27ae60", r: 24 };
    case "grape":
      return { color: "#8e44ad", innerColor: "#d2b4de", leafColor: "#27ae60", r: 22 };
    case "lemon":
      return { color: "#f1c40f", innerColor: "#fef9e7", leafColor: "#27ae60", r: 22 };
  }
}

/* ---------- 音效 ---------- */
const playSliceSound = () => {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    /* 静音处理 */
  }
};

const playBombSound = () => {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    /* 静音处理 */
  }
};

/* ---------- 绘制水果（完整） ---------- */
function drawFruit(ctx: CanvasRenderingContext2D, f: Fruit) {
  ctx.save();
  ctx.globalAlpha = f.opacity;
  ctx.translate(f.x, f.y);
  ctx.rotate(f.rot);

  if (f.type === "bomb") {
    drawBomb(ctx, f.r);
  } else {
    switch (f.shape) {
      case "watermelon":
        drawWatermelon(ctx, f.r);
        break;
      case "orange":
        drawOrange(ctx, f.r);
        break;
      case "apple":
        drawApple(ctx, f.r);
        break;
      case "grape":
        drawGrape(ctx, f.r);
        break;
      case "lemon":
        drawLemon(ctx, f.r);
        break;
    }
  }

  ctx.restore();
}

function drawWatermelon(ctx: CanvasRenderingContext2D, r: number) {
  // 椭圆深绿皮
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 1.15, r * 0.9, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#2d6a2d";
  ctx.fill();
  // 深色条纹
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = "#1a4d1a";
  ctx.lineWidth = 2;
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(i * r * 0.35, -r);
    ctx.quadraticCurveTo(i * r * 0.3, 0, i * r * 0.35, r);
    ctx.stroke();
  }
  ctx.restore();
  // 高光弧面
  ctx.beginPath();
  ctx.ellipse(-r * 0.3, -r * 0.3, r * 0.45, r * 0.25, -0.4, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fill();
}

function drawOrange(ctx: CanvasRenderingContext2D, r: number) {
  // 正圆
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = "#e67e22";
  ctx.fill();
  // 表面小点纹理
  ctx.fillStyle = "rgba(200,120,30,0.5)";
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2 + 0.3;
    const d = r * 0.55 + (i % 3) * r * 0.12;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * d, Math.sin(a) * d, 1, 0, Math.PI * 2);
    ctx.fill();
  }
  // 脐部凹陷
  ctx.beginPath();
  ctx.arc(0, r * 0.82, r * 0.15, 0, Math.PI * 2);
  ctx.fillStyle = "#c0692b";
  ctx.fill();
  // 蒂
  ctx.fillStyle = "#5d4037";
  ctx.fillRect(-1.5, -r - 4, 3, 6);
  // 小叶
  ctx.beginPath();
  ctx.ellipse(4, -r - 2, 6, 3, 0.5, 0, Math.PI * 2);
  ctx.fillStyle = "#27ae60";
  ctx.fill();
}

function drawApple(ctx: CanvasRenderingContext2D, r: number) {
  // 上部凹陷贝塞尔曲线轮廓
  ctx.beginPath();
  ctx.moveTo(0, -r * 1.05);
  ctx.bezierCurveTo(-r * 0.25, -r * 0.8, -r * 1.1, -r * 0.5, -r, r * 0.2);
  ctx.bezierCurveTo(-r * 0.85, r * 0.9, -r * 0.3, r * 1.1, 0, r * 0.95);
  ctx.bezierCurveTo(r * 0.3, r * 1.1, r * 0.85, r * 0.9, r, r * 0.2);
  ctx.bezierCurveTo(r * 1.1, -r * 0.5, r * 0.25, -r * 0.8, 0, -r * 1.05);
  ctx.fillStyle = "#c0392b";
  ctx.fill();
  // 茎
  ctx.beginPath();
  ctx.moveTo(0, -r * 1.05);
  ctx.quadraticCurveTo(2, -r * 1.35, 1, -r * 1.55);
  ctx.strokeStyle = "#5d4037";
  ctx.lineWidth = 2;
  ctx.stroke();
  // 叶
  ctx.beginPath();
  ctx.ellipse(6, -r * 1.3, 8, 3.5, 0.4, 0, Math.PI * 2);
  ctx.fillStyle = "#27ae60";
  ctx.fill();
}

function drawGrape(ctx: CanvasRenderingContext2D, r: number) {
  // 8颗小圆组成的一串
  const positions = [
    [0, -r * 0.55],
    [-r * 0.42, -r * 0.18],
    [r * 0.42, -r * 0.18],
    [-r * 0.62, r * 0.2],
    [0, r * 0.18],
    [r * 0.62, r * 0.2],
    [-r * 0.3, r * 0.58],
    [r * 0.3, r * 0.58],
  ];
  const sr = r * 0.32;
  for (const [px, py] of positions) {
    ctx.beginPath();
    ctx.arc(px, py, sr, 0, Math.PI * 2);
    ctx.fillStyle = "#8e44ad";
    ctx.fill();
    // 高光
    ctx.beginPath();
    ctx.arc(px - sr * 0.3, py - sr * 0.3, sr * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fill();
  }
  // 茎
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.55 - sr);
  ctx.lineTo(0, -r * 0.55 - sr - 10);
  ctx.strokeStyle = "#5d4037";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawLemon(ctx: CanvasRenderingContext2D, r: number) {
  // 两端尖锐曲线椭圆
  ctx.beginPath();
  ctx.moveTo(-r * 1.3, 0);
  ctx.bezierCurveTo(-r * 0.8, -r * 0.7, r * 0.8, -r * 0.7, r * 1.3, 0);
  ctx.bezierCurveTo(r * 0.8, r * 0.7, -r * 0.8, r * 0.7, -r * 1.3, 0);
  ctx.fillStyle = "#f1c40f";
  ctx.fill();
  // 轻微高光
  ctx.beginPath();
  ctx.ellipse(-r * 0.2, -r * 0.25, r * 0.55, r * 0.2, -0.2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fill();
}

function drawBomb(ctx: CanvasRenderingContext2D, r: number) {
  // 方形炸弹
  const s = r * 0.85;
  ctx.fillStyle = "#2c3e50";
  ctx.beginPath();
  ctx.roundRect(-s, -s, s * 2, s * 2, 4);
  ctx.fill();
  // 高光
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fillRect(-s, -s, s * 2, s);
  // 引信
  ctx.beginPath();
  ctx.moveTo(s * 0.5, -s);
  ctx.quadraticCurveTo(s * 0.7, -s - 10, s * 0.3, -s - 16);
  ctx.strokeStyle = "#7f8c8d";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  // 火花
  const sparkTime = Date.now() * 0.01;
  for (let i = 0; i < 5; i++) {
    const a = sparkTime + i * 1.256;
    const dist = 4 + Math.sin(sparkTime * 2 + i) * 3;
    ctx.beginPath();
    ctx.arc(s * 0.3 + Math.cos(a) * dist, -s - 16 + Math.sin(a) * dist, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? "#e74c3c" : "#f39c12";
    ctx.fill();
  }
  // X 标记
  ctx.strokeStyle = "#e74c3c";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-s * 0.4, -s * 0.4);
  ctx.lineTo(s * 0.4, s * 0.4);
  ctx.moveTo(s * 0.4, -s * 0.4);
  ctx.lineTo(-s * 0.4, s * 0.4);
  ctx.stroke();
}

/* ---------- 绘制切面半片 ---------- */
function drawSliceHalf(ctx: CanvasRenderingContext2D, h: SliceHalf) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, h.life / 60);
  ctx.translate(h.x, h.y);
  ctx.rotate(h.rot);

  // 裁剪为半圆/半椭圆
  ctx.beginPath();
  if (h.shape === "lemon") {
    ctx.ellipse(0, 0, h.r * 1.3, h.r * 0.7, 0, -Math.PI / 2, Math.PI / 2);
  } else if (h.shape === "watermelon") {
    ctx.ellipse(0, 0, h.r * 1.15, h.r * 0.9, 0, -Math.PI / 2, Math.PI / 2);
  } else {
    ctx.arc(0, 0, h.r, -Math.PI / 2, Math.PI / 2);
  }
  ctx.closePath();
  ctx.clip();

  // 果肉切面
  ctx.beginPath();
  ctx.arc(0, 0, h.r, 0, Math.PI * 2);
  ctx.fillStyle = h.innerColor;
  ctx.fill();

  // 切面细节
  switch (h.shape) {
    case "watermelon":
      // 黑籽
      ctx.fillStyle = "#1a1a1a";
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI + 0.2;
        const d = h.r * 0.45;
        ctx.beginPath();
        ctx.ellipse(Math.cos(a) * d, Math.sin(a) * d, 2.5, 1.5, a, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case "orange":
      // 橘瓣线
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * h.r * 0.9, Math.sin(a) * h.r * 0.9);
        ctx.stroke();
      }
      break;
    case "apple":
      // 果核种子
      ctx.fillStyle = "#5d4037";
      ctx.beginPath();
      ctx.ellipse(3, 0, 2, 3.5, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(-2, -3, 1.8, 3, -0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "grape":
      ctx.fillStyle = "rgba(100,40,120,0.3)";
      ctx.beginPath();
      ctx.arc(0, 0, h.r * 0.25, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "lemon":
      // 柠檬瓣线
      ctx.strokeStyle = "rgba(200,180,100,0.5)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * h.r * 1.1, Math.sin(a) * h.r * 0.7);
        ctx.stroke();
      }
      break;
    case "bomb":
      break;
  }

  // 外皮边缘
  ctx.beginPath();
  ctx.arc(0, 0, h.r, 0, Math.PI * 2);
  ctx.strokeStyle = h.color;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.restore();
}

/* ---------- 生成水果 ---------- */
let nextId = 0;

function spawnFruit(canvasW: number, canvasH: number): Fruit {
  const isBomb = Math.random() < BOMB_CHANCE;
  const shape: Fruit["shape"] = isBomb ? "bomb" : SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const cfg = isBomb ? { color: "#2c3e50", innerColor: "#2c3e50", leafColor: "#7f8c8d", r: 22 } : fruitConfig(shape as Exclude<Fruit["shape"], "bomb">);
  const x = canvasW * 0.15 + Math.random() * canvasW * 0.7;
  const vx = (x - canvasW / 2) * 0.008 + (Math.random() - 0.5) * 2;
  const vy = -(canvasH * 0.018 + Math.random() * canvasH * 0.008);
  return {
    id: nextId++,
    x,
    y: canvasH + 10,
    r: cfg.r,
    vx,
    vy,
    color: cfg.color,
    innerColor: cfg.innerColor,
    leafColor: cfg.leafColor,
    type: isBomb ? "bomb" : "fruit",
    shape,
    sliced: false,
    opacity: 1,
    rot: 0,
    rotV: (Math.random() - 0.5) * 0.08,
  };
}

/* ---------- 碰撞检测 ---------- */
function hitTest(f: Fruit, x1: number, y1: number, x2: number, y2: number): boolean {
  // 点到线段距离
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) {
    const d = Math.hypot(f.x - x1, f.y - y1);
    return d < f.r + 5;
  }
  let t = ((f.x - x1) * dx + (f.y - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const px = x1 + t * dx;
  const py = y1 + t * dy;
  const dist = Math.hypot(f.x - px, f.y - py);
  return dist < f.r + 5;
}

/* ============================================================
   主组件
   ============================================================ */
export default function FruitSliceGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setCanvasW] = useState(400);
  const [gameState, setGameState] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    } catch {
      return 0;
    }
  });
  const [achievement, setAchievement] = useState<string | null>(null);

  const fruitsRef = useRef<Fruit[]>([]);
  const halvesRef = useRef<SliceHalf[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const trailRef = useRef<TrailPoint[]>([]);
  const prevPointerRef = useRef<{ x: number; y: number } | null>(null);
  const pointerDownRef = useRef(false);
  const scoreRef = useRef(0);
  const bestRef = useRef(bestScore);
  const achievedRef = useRef<Set<number>>(new Set());
  const rafRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const gameStateRef = useRef<"idle" | "playing" | "over">("idle");
  const missedRef = useRef(0);
  // 同步 ref
  bestRef.current = bestScore;
  gameStateRef.current = gameState;

  /* ---------- 核心循环 ---------- */
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // 背景渐变
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#faf8f5");
    grad.addColorStop(1, "#f3f0ed");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (gameStateRef.current !== "playing") {
      rafRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    // 生成水果
    spawnTimerRef.current++;
    if (spawnTimerRef.current > 45 + Math.random() * 20) {
      spawnTimerRef.current = 0;
      fruitsRef.current.push(spawnFruit(w, h));
    }

    // 更新水果
    const fruits = fruitsRef.current;
    for (let i = fruits.length - 1; i >= 0; i--) {
      const f = fruits[i];
      f.vy += GRAVITY;
      f.x += f.vx;
      f.y += f.vy;
      f.rot += f.rotV;
      // 出界移除
      if (f.y > h + 60 && f.vy > 0) {
        if (f.type === "fruit" && !f.sliced) {
          missedRef.current++;
        }
        fruits.splice(i, 1);
        continue;
      }
      if (f.sliced) {
        f.opacity -= 0.05;
        if (f.opacity <= 0) {
          fruits.splice(i, 1);
        }
      }
    }

    // 更新切面半片
    const halves = halvesRef.current;
    for (let i = halves.length - 1; i >= 0; i--) {
      const hh = halves[i];
      hh.vy += GRAVITY * 0.6;
      hh.x += hh.vx;
      hh.y += hh.vy;
      hh.rot += hh.rotV;
      hh.life--;
      if (hh.life <= 0 || hh.y > h + 80) {
        halves.splice(i, 1);
      }
    }

    // 更新粒子
    const parts = particlesRef.current;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.vy += 0.12;
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) {
        parts.splice(i, 1);
      }
    }

    // 更新轨迹
    const trail = trailRef.current;
    for (let i = trail.length - 1; i >= 0; i--) {
      trail[i].life--;
      if (trail[i].life <= 0) {
        trail.splice(i, 1);
      }
    }

    // 检查游戏结束（漏掉10个水果）
    if (missedRef.current >= 10) {
      gameStateRef.current = "over";
      setGameState("over");
      if (scoreRef.current > bestRef.current) {
        const newBest = scoreRef.current;
        setBestScore(newBest);
        try {
          localStorage.setItem(STORAGE_KEY, String(newBest));
        } catch {
          /* ignore */
        }
      }
    }

    // ---- 绘制 ----

    // 绘制轨迹
    for (const t of trail) {
      const alpha = t.life / 12;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 3 * alpha, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.8})`;
      ctx.fill();
    }

    // 绘制水果
    for (const f of fruits) {
      if (!f.sliced) {
        drawFruit(ctx, f);
      }
    }

    // 绘制切面半片
    for (const hh of halves) {
      drawSliceHalf(ctx, hh);
    }

    // 绘制粒子
    for (const p of parts) {
      const alpha = p.life / p.maxLife;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * alpha, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace("1)", `${alpha})`);
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  }, []);

  /* ---------- 切割处理 ---------- */
  const handleSlice = useCallback((x: number, y: number) => {
    if (gameStateRef.current !== "playing") return;

    // 添加轨迹点
    trailRef.current.push({ x, y, life: 12 });

    const prev = prevPointerRef.current;
    prevPointerRef.current = { x, y };

    if (!prev) return;

    const fruits = fruitsRef.current;
    for (let i = fruits.length - 1; i >= 0; i--) {
      const f = fruits[i];
      if (f.sliced) continue;
      if (!hitTest(f, prev.x, prev.y, x, y)) continue;

      f.sliced = true;

      if (f.type === "bomb") {
        playBombSound();
        scoreRef.current = Math.max(0, scoreRef.current - 5);
        setScore(scoreRef.current);
        // 爆炸粒子
        for (let j = 0; j < 16; j++) {
          const a = (j / 16) * Math.PI * 2;
          const spd = 2 + Math.random() * 4;
          particlesRef.current.push({
            x: f.x,
            y: f.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            r: 3 + Math.random() * 3,
            color: j % 2 === 0 ? "rgba(231,76,60,1)" : "rgba(243,156,18,1)",
            life: 25 + Math.random() * 15,
            maxLife: 40,
          });
        }
      } else {
        playSliceSound();
        scoreRef.current += 1;
        setScore(scoreRef.current);

        // 检查成就
        for (const ach of ACHIEVEMENTS) {
          if (scoreRef.current >= ach.score && !achievedRef.current.has(ach.score)) {
            achievedRef.current.add(ach.score);
            setAchievement(ach.title);
            setTimeout(() => setAchievement(null), 2000);
          }
        }

        // 切成两半
        const angle = Math.atan2(y - prev.y, x - prev.x) + Math.PI / 2;
        const spd = 1.5;
        for (const dir of [-1, 1]) {
          halvesRef.current.push({
            x: f.x,
            y: f.y,
            r: f.r,
            vx: Math.cos(angle) * spd * dir + f.vx * 0.5,
            vy: -2 + f.vy * 0.3,
            color: f.color,
            innerColor: f.innerColor,
            leafColor: f.leafColor,
            shape: f.shape,
            rot: f.rot,
            rotV: dir * 0.05 + Math.random() * 0.02,
            life: 60,
          });
        }

        // 果汁粒子
        const juiceColor = f.innerColor;
        // 转为 rgba
        const tempEl = document.createElement("canvas");
        const tmpCtx = tempEl.getContext("2d");
        if (tmpCtx) {
          tmpCtx.fillStyle = juiceColor;
          const parsed = tmpCtx.fillStyle; // 浏览器标准化颜色
          const r = parseInt(parsed.slice(1, 3), 16);
          const g = parseInt(parsed.slice(3, 5), 16);
          const b = parseInt(parsed.slice(5, 7), 16);
          const rgba = `rgba(${r},${g},${b},1)`;
          for (let j = 0; j < 10; j++) {
            const a = Math.random() * Math.PI * 2;
            const s = 1 + Math.random() * 3;
            particlesRef.current.push({
              x: f.x + (Math.random() - 0.5) * f.r,
              y: f.y + (Math.random() - 0.5) * f.r,
              vx: Math.cos(a) * s,
              vy: Math.sin(a) * s - 1,
              r: 2 + Math.random() * 2.5,
              color: rgba,
              life: 20 + Math.random() * 15,
              maxLife: 35,
            });
          }
        }
      }
    }
  }, []);

  /* ---------- Pointer 事件 ---------- */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (gameStateRef.current !== "playing") return;
      pointerDownRef.current = true;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) * (canvasRef.current!.width / rect.width);
      const y = (e.clientY - rect.top) * (canvasRef.current!.height / rect.height);
      prevPointerRef.current = { x, y };
      trailRef.current.push({ x, y, life: 12 });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerDownRef.current) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) * (canvasRef.current!.width / rect.width);
      const y = (e.clientY - rect.top) * (canvasRef.current!.height / rect.height);
      handleSlice(x, y);
    },
    [handleSlice]
  );

  const handlePointerUp = useCallback(() => {
    pointerDownRef.current = false;
    prevPointerRef.current = null;
  }, []);

  /* ---------- 开始/重新开始 ---------- */
  const startGame = useCallback(() => {
    fruitsRef.current = [];
    halvesRef.current = [];
    particlesRef.current = [];
    trailRef.current = [];
    prevPointerRef.current = null;
    scoreRef.current = 0;
    missedRef.current = 0;
    spawnTimerRef.current = 0;
    achievedRef.current = new Set();
    setScore(0);
    setAchievement(null);
    setGameState("playing");
    gameStateRef.current = "playing";
  }, []);

  /* ---------- 初始化 Canvas 尺寸 ---------- */
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setCanvasW(w);
        if (canvasRef.current) {
          canvasRef.current.width = w;
          canvasRef.current.height = CANVAS_H;
        }
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  /* ---------- 动画循环 ---------- */
  useEffect(() => {
    rafRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [gameLoop]);

  return (
    <>
      <style>{`
        .sr-fs-wrap {
          position: relative;
          background: rgba(255,255,255,0.8);
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          overflow: hidden;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
        }
        .sr-fs-canvas {
          display: block;
          width: 100%;
          height: ${CANVAS_H}px;
          cursor: crosshair;
        }
        .sr-fs-hud {
          position: absolute;
          top: 12px;
          left: 16px;
          right: 16px;
          display: flex;
          justify-content: space-between;
          pointer-events: none;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .sr-fs-hud span {
          background: rgba(255,255,255,0.7);
          padding: 4px 12px;
          border-radius: 8px;
        }
        .sr-fs-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(250,248,245,0.85);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 10;
        }
        .sr-fs-start-btn {
          padding: 12px 40px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          background: #c0392b;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 3px 10px rgba(192,57,43,0.3);
          font-family: system-ui, -apple-system, sans-serif;
        }
        .sr-fs-start-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 16px rgba(192,57,43,0.4);
        }
        .sr-fs-start-btn:active {
          transform: translateY(0);
        }
        .sr-fs-over-title {
          font-size: 22px;
          font-weight: 700;
          color: #333;
          margin-bottom: 8px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .sr-fs-over-score {
          font-size: 15px;
          color: #666;
          margin-bottom: 20px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .sr-fs-achievement {
          position: absolute;
          top: 50px;
          left: 50%;
          transform: translateX(-50%);
          padding: 8px 20px;
          background: linear-gradient(135deg, #c0392b, #e74c3c);
          color: #fff;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          pointer-events: none;
          z-index: 20;
          font-family: system-ui, -apple-system, sans-serif;
          box-shadow: 0 2px 10px rgba(192,57,43,0.35);
        }
        .sr-fs-idle-hint {
          font-size: 13px;
          color: #999;
          margin-top: 16px;
          font-family: system-ui, -apple-system, sans-serif;
        }
      `}</style>

      <div className="sr-fs-wrap" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="sr-fs-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />

        {gameState === "playing" && (
          <div className="sr-fs-hud">
            <span>得分: {score}</span>
            <span>最佳: {bestScore}</span>
          </div>
        )}

        <AnimatePresence>
          {achievement && (
            <motion.div
              className="sr-fs-achievement"
              key={achievement}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {achievement}
            </motion.div>
          )}
        </AnimatePresence>

        {gameState === "idle" && (
          <div className="sr-fs-overlay">
            <button className="sr-fs-start-btn" onClick={startGame}>
              开始
            </button>
            <div className="sr-fs-idle-hint">滑动鼠标或手指切割水果</div>
          </div>
        )}

        {gameState === "over" && (
          <div className="sr-fs-overlay">
            <div className="sr-fs-over-title">游戏结束</div>
            <div className="sr-fs-over-score">
              得分: {score} &nbsp;|&nbsp; 最佳: {Math.max(bestScore, score)}
            </div>
            <button className="sr-fs-start-btn" onClick={startGame}>
              再来一次
            </button>
          </div>
        )}
      </div>
    </>
  );
}