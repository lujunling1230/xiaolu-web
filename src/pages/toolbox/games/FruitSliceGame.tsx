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

interface LevelConfig {
  targetScore: number;
  fruitSpeed: number;
  bombChance: number;
  fruitSizeMulti: number;
  rotSpeedMulti: number;
  bombSizeMulti: number;
  spawnIntervalMin: number;
  spawnIntervalMax: number;
  extraFruits: number;
  chainSlice: boolean;
  badge: string;
}

interface FruitSaveData {
  highestLevel: number;
  badges: number[];
  bestScore: number;
}

type Phase = "menu" | "playing" | "levelComplete" | "gameOver";

/* ---------- 关卡配置 ---------- */
const LEVELS: LevelConfig[] = [
  { targetScore: 15,  fruitSpeed: 1.0,  bombChance: 0.10, fruitSizeMulti: 1.0, rotSpeedMulti: 1.0, bombSizeMulti: 1.0, spawnIntervalMin: 45, spawnIntervalMax: 65, extraFruits: 0, chainSlice: false, badge: "初入刀道" },
  { targetScore: 25,  fruitSpeed: 1.0,  bombChance: 0.12, fruitSizeMulti: 1.0, rotSpeedMulti: 1.0, bombSizeMulti: 1.0, spawnIntervalMin: 40, spawnIntervalMax: 60, extraFruits: 1, chainSlice: false, badge: "刀锋渐利" },
  { targetScore: 40,  fruitSpeed: 1.25, bombChance: 0.13, fruitSizeMulti: 1.15, rotSpeedMulti: 1.0, bombSizeMulti: 1.0, spawnIntervalMin: 40, spawnIntervalMax: 58, extraFruits: 0, chainSlice: false, badge: "果雨初降" },
  { targetScore: 55,  fruitSpeed: 1.25, bombChance: 0.14, fruitSizeMulti: 1.0, rotSpeedMulti: 1.0, bombSizeMulti: 1.0, spawnIntervalMin: 38, spawnIntervalMax: 55, extraFruits: 0, chainSlice: false, badge: "一刀两断" },
  { targetScore: 70,  fruitSpeed: 1.25, bombChance: 0.15, fruitSizeMulti: 1.0, rotSpeedMulti: 1.0, bombSizeMulti: 1.0, spawnIntervalMin: 36, spawnIntervalMax: 52, extraFruits: 0, chainSlice: true,  badge: "连锁反应" },
  { targetScore: 90,  fruitSpeed: 1.5,  bombChance: 0.15, fruitSizeMulti: 1.0, rotSpeedMulti: 1.0, bombSizeMulti: 1.0, spawnIntervalMin: 34, spawnIntervalMax: 50, extraFruits: 0, chainSlice: false, badge: "快刀手" },
  { targetScore: 110, fruitSpeed: 1.5,  bombChance: 0.16, fruitSizeMulti: 1.0, rotSpeedMulti: 1.8, bombSizeMulti: 1.0, spawnIntervalMin: 32, spawnIntervalMax: 48, extraFruits: 0, chainSlice: false, badge: "旋风刀" },
  { targetScore: 130, fruitSpeed: 1.75, bombChance: 0.17, fruitSizeMulti: 1.0, rotSpeedMulti: 1.0, bombSizeMulti: 1.0, spawnIntervalMin: 30, spawnIntervalMax: 46, extraFruits: 0, chainSlice: false, badge: "万剑归宗" },
  { targetScore: 160, fruitSpeed: 1.75, bombChance: 0.18, fruitSizeMulti: 1.0, rotSpeedMulti: 1.2, bombSizeMulti: 0.7, spawnIntervalMin: 28, spawnIntervalMax: 44, extraFruits: 0, chainSlice: true,  badge: "炸弹专家" },
  { targetScore: 200, fruitSpeed: 2.0,  bombChance: 0.20, fruitSizeMulti: 1.15, rotSpeedMulti: 2.0, bombSizeMulti: 0.7, spawnIntervalMin: 26, spawnIntervalMax: 42, extraFruits: 1, chainSlice: true,  badge: "你已超脱凡尘" },
  { targetScore: 230, fruitSpeed: 2.1,  bombChance: 0.21, fruitSizeMulti: 1.0,  rotSpeedMulti: 2.1, bombSizeMulti: 0.68, spawnIntervalMin: 25, spawnIntervalMax: 40, extraFruits: 0, chainSlice: false, badge: "刀气纵横" },
  { targetScore: 265, fruitSpeed: 2.2,  bombChance: 0.22, fruitSizeMulti: 0.95, rotSpeedMulti: 2.2, bombSizeMulti: 0.66, spawnIntervalMin: 24, spawnIntervalMax: 38, extraFruits: 1, chainSlice: true,  badge: "千刀万剐" },
  { targetScore: 300, fruitSpeed: 2.3,  bombChance: 0.22, fruitSizeMulti: 1.1,  rotSpeedMulti: 2.3, bombSizeMulti: 0.64, spawnIntervalMin: 23, spawnIntervalMax: 36, extraFruits: 0, chainSlice: false, badge: "果海无涯" },
  { targetScore: 335, fruitSpeed: 2.4,  bombChance: 0.23, fruitSizeMulti: 0.9,  rotSpeedMulti: 2.4, bombSizeMulti: 0.62, spawnIntervalMin: 22, spawnIntervalMax: 35, extraFruits: 1, chainSlice: true,  badge: "影刀无形" },
  { targetScore: 375, fruitSpeed: 2.5,  bombChance: 0.24, fruitSizeMulti: 1.05, rotSpeedMulti: 2.5, bombSizeMulti: 0.60, spawnIntervalMin: 21, spawnIntervalMax: 34, extraFruits: 0, chainSlice: false, badge: "刀王降临" },
  { targetScore: 420, fruitSpeed: 2.6,  bombChance: 0.24, fruitSizeMulti: 0.85, rotSpeedMulti: 2.7, bombSizeMulti: 0.58, spawnIntervalMin: 20, spawnIntervalMax: 32, extraFruits: 1, chainSlice: true,  badge: "破空斩" },
  { targetScore: 465, fruitSpeed: 2.7,  bombChance: 0.25, fruitSizeMulti: 1.15, rotSpeedMulti: 2.9, bombSizeMulti: 0.56, spawnIntervalMin: 19, spawnIntervalMax: 31, extraFruits: 0, chainSlice: false, badge: "万物皆斩" },
  { targetScore: 510, fruitSpeed: 2.8,  bombChance: 0.26, fruitSizeMulti: 0.9,  rotSpeedMulti: 3.1, bombSizeMulti: 0.54, spawnIntervalMin: 18, spawnIntervalMax: 30, extraFruits: 1, chainSlice: true,  badge: "刀神附体" },
  { targetScore: 555, fruitSpeed: 2.9,  bombChance: 0.27, fruitSizeMulti: 1.0,  rotSpeedMulti: 3.3, bombSizeMulti: 0.52, spawnIntervalMin: 17, spawnIntervalMax: 28, extraFruits: 0, chainSlice: false, badge: "修罗刀域" },
  { targetScore: 600, fruitSpeed: 3.0,  bombChance: 0.28, fruitSizeMulti: 0.8,  rotSpeedMulti: 3.5, bombSizeMulti: 0.50, spawnIntervalMin: 16, spawnIntervalMax: 26, extraFruits: 1, chainSlice: true,  badge: "无上刀圣" },
];

/* ---------- 常量 ---------- */
const GRAVITY = 0.22;
const CANVAS_H = window.innerWidth < 600 ? 300 : 360;
const STORAGE_KEY = "fruit_slice_save";

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

/* ---------- 存档读写 ---------- */
function loadSaveData(): FruitSaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as FruitSaveData;
  } catch { /* ignore */ }
  return { highestLevel: 0, badges: [], bestScore: 0 };
}

function writeSaveData(data: FruitSaveData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
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
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 1.15, r * 0.9, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#2d6a2d";
  ctx.fill();
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
  ctx.beginPath();
  ctx.ellipse(-r * 0.3, -r * 0.3, r * 0.45, r * 0.25, -0.4, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fill();
}

function drawOrange(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = "#e67e22";
  ctx.fill();
  ctx.fillStyle = "rgba(200,120,30,0.5)";
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2 + 0.3;
    const d = r * 0.55 + (i % 3) * r * 0.12;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * d, Math.sin(a) * d, 1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, r * 0.82, r * 0.15, 0, Math.PI * 2);
  ctx.fillStyle = "#c0692b";
  ctx.fill();
  ctx.fillStyle = "#5d4037";
  ctx.fillRect(-1.5, -r - 4, 3, 6);
  ctx.beginPath();
  ctx.ellipse(4, -r - 2, 6, 3, 0.5, 0, Math.PI * 2);
  ctx.fillStyle = "#27ae60";
  ctx.fill();
}

function drawApple(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.moveTo(0, -r * 1.05);
  ctx.bezierCurveTo(-r * 0.25, -r * 0.8, -r * 1.1, -r * 0.5, -r, r * 0.2);
  ctx.bezierCurveTo(-r * 0.85, r * 0.9, -r * 0.3, r * 1.1, 0, r * 0.95);
  ctx.bezierCurveTo(r * 0.3, r * 1.1, r * 0.85, r * 0.9, r, r * 0.2);
  ctx.bezierCurveTo(r * 1.1, -r * 0.5, r * 0.25, -r * 0.8, 0, -r * 1.05);
  ctx.fillStyle = "#c0392b";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, -r * 1.05);
  ctx.quadraticCurveTo(2, -r * 1.35, 1, -r * 1.55);
  ctx.strokeStyle = "#5d4037";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(6, -r * 1.3, 8, 3.5, 0.4, 0, Math.PI * 2);
  ctx.fillStyle = "#27ae60";
  ctx.fill();
}

function drawGrape(ctx: CanvasRenderingContext2D, r: number) {
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
    ctx.beginPath();
    ctx.arc(px - sr * 0.3, py - sr * 0.3, sr * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fill();
  }
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.55 - sr);
  ctx.lineTo(0, -r * 0.55 - sr - 10);
  ctx.strokeStyle = "#5d4037";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawLemon(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  ctx.moveTo(-r * 1.3, 0);
  ctx.bezierCurveTo(-r * 0.8, -r * 0.7, r * 0.8, -r * 0.7, r * 1.3, 0);
  ctx.bezierCurveTo(r * 0.8, r * 0.7, -r * 0.8, r * 0.7, -r * 1.3, 0);
  ctx.fillStyle = "#f1c40f";
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-r * 0.2, -r * 0.25, r * 0.55, r * 0.2, -0.2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fill();
}

function drawBomb(ctx: CanvasRenderingContext2D, r: number) {
  const s = r * 0.85;
  ctx.fillStyle = "#2c3e50";
  ctx.beginPath();
  ctx.roundRect(-s, -s, s * 2, s * 2, 4);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fillRect(-s, -s, s * 2, s);
  ctx.beginPath();
  ctx.moveTo(s * 0.5, -s);
  ctx.quadraticCurveTo(s * 0.7, -s - 10, s * 0.3, -s - 16);
  ctx.strokeStyle = "#7f8c8d";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  const sparkTime = Date.now() * 0.01;
  for (let i = 0; i < 5; i++) {
    const a = sparkTime + i * 1.256;
    const dist = 4 + Math.sin(sparkTime * 2 + i) * 3;
    ctx.beginPath();
    ctx.arc(s * 0.3 + Math.cos(a) * dist, -s - 16 + Math.sin(a) * dist, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? "#e74c3c" : "#f39c12";
    ctx.fill();
  }
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

  ctx.beginPath();
  ctx.arc(0, 0, h.r, 0, Math.PI * 2);
  ctx.fillStyle = h.innerColor;
  ctx.fill();

  switch (h.shape) {
    case "watermelon":
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

  ctx.beginPath();
  ctx.arc(0, 0, h.r, 0, Math.PI * 2);
  ctx.strokeStyle = h.color;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.restore();
}

/* ---------- 生成水果 ---------- */
let nextId = 0;

function spawnFruit(canvasW: number, canvasH: number, levelCfg: LevelConfig): Fruit {
  const isBomb = Math.random() < levelCfg.bombChance;
  const shape: Fruit["shape"] = isBomb ? "bomb" : SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const cfg = isBomb
    ? { color: "#2c3e50", innerColor: "#2c3e50", leafColor: "#7f8c8d", r: Math.round(22 * levelCfg.bombSizeMulti) }
    : fruitConfig(shape as Exclude<Fruit["shape"], "bomb">);
  const x = canvasW * 0.15 + Math.random() * canvasW * 0.7;
  const speedMulti = levelCfg.fruitSpeed;
  const vx = ((x - canvasW / 2) * 0.008 + (Math.random() - 0.5) * 2) * speedMulti;
  const vy = -(canvasH * 0.018 + Math.random() * canvasH * 0.008) * speedMulti;
  const r = isBomb ? cfg.r : Math.round(cfg.r * levelCfg.fruitSizeMulti);
  return {
    id: nextId++,
    x,
    y: canvasH + 10,
    r,
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
    rotV: (Math.random() - 0.5) * 0.08 * levelCfg.rotSpeedMulti,
  };
}

/* ---------- 碰撞检测 ---------- */
function hitTest(f: Fruit, x1: number, y1: number, x2: number, y2: number): boolean {
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

/* ---------- 创建切半辅助函数 ---------- */
let halvesRefGlobal: { current: SliceHalf[] } = { current: [] };

function createHalves(f: Fruit, prevX: number, prevY: number, curX: number, curY: number) {
  const angle = Math.atan2(curY - prevY, curX - prevX) + Math.PI / 2;
  const spd = 1.5;
  for (const dir of [-1, 1]) {
    halvesRefGlobal.current.push({
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
}

/* ============================================================
   主组件
   ============================================================ */
export default function FruitSliceGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setCanvasW] = useState(400);

  /* ---------- 游戏阶段与关卡 ---------- */
  const [phase, setPhase] = useState<Phase>("menu");
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [notification, setNotification] = useState<string | null>(null);
  const [saveData, setSaveData] = useState<FruitSaveData>(() => loadSaveData());

  /* ---------- Refs ---------- */
  const fruitsRef = useRef<Fruit[]>([]);
  const halvesRef = useRef<SliceHalf[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const trailRef = useRef<TrailPoint[]>([]);
  const prevPointerRef = useRef<{ x: number; y: number } | null>(null);
  const pointerDownRef = useRef(false);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(1);
  const phaseRef = useRef<Phase>("menu");
  const rafRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const scoreInLevelRef = useRef(0);

  halvesRefGlobal = halvesRef;

  /* ---------- 获取当前关卡配置 ---------- */
  const getLevelCfg = useCallback(() => LEVELS[Math.min(levelRef.current - 1, LEVELS.length - 1)], []);

  /* ---------- 核心循环 ---------- */
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#faf8f5");
    grad.addColorStop(1, "#f3f0ed");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (phaseRef.current !== "playing") {
      rafRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const levelCfg = getLevelCfg();

    // 生成水果
    spawnTimerRef.current++;
    const spawnThreshold = levelCfg.spawnIntervalMin + Math.random() * (levelCfg.spawnIntervalMax - levelCfg.spawnIntervalMin);
    if (spawnTimerRef.current > spawnThreshold) {
      spawnTimerRef.current = 0;
      fruitsRef.current.push(spawnFruit(w, h, levelCfg));
      for (let i = 0; i < levelCfg.extraFruits; i++) {
        fruitsRef.current.push(spawnFruit(w, h, levelCfg));
      }
    }

    // 更新水果
    const fruits = fruitsRef.current;
    for (let i = fruits.length - 1; i >= 0; i--) {
      const f = fruits[i];
      f.vy += GRAVITY;
      f.x += f.vx;
      f.y += f.vy;
      f.rot += f.rotV;
      if (f.y > h + 60 && f.vy > 0) {
        if (f.type === "fruit" && !f.sliced) {
          livesRef.current--;
          setLives(livesRef.current);
          if (livesRef.current <= 0) {
            phaseRef.current = "gameOver";
            setPhase("gameOver");
            setNotification("坚持到了第" + levelRef.current + "关");
            setTimeout(() => setNotification(null), 3000);
            const saved = loadSaveData();
            if (scoreRef.current > saved.bestScore) saved.bestScore = scoreRef.current;
            writeSaveData(saved);
          }
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

    // 检查关卡通过
    if (phaseRef.current === "playing" && scoreInLevelRef.current >= levelCfg.targetScore) {
      if (levelRef.current >= LEVELS.length) {
        phaseRef.current = "gameOver";
        setPhase("gameOver");
        setNotification("恭喜通关全部关卡！");
        setTimeout(() => setNotification(null), 3000);
        const saved = loadSaveData();
        if (scoreRef.current > saved.bestScore) saved.bestScore = scoreRef.current;
        if (levelRef.current > saved.highestLevel) saved.highestLevel = levelRef.current;
        if (!saved.badges.includes(levelRef.current)) saved.badges.push(levelRef.current);
        writeSaveData(saved);
        setSaveData({ ...saved });
      } else {
        phaseRef.current = "levelComplete";
        setPhase("levelComplete");
        const saved = loadSaveData();
        let gotBadge = false;
        if (levelRef.current > saved.highestLevel) saved.highestLevel = levelRef.current;
        if (!saved.badges.includes(levelRef.current)) {
          saved.badges.push(levelRef.current);
          gotBadge = true;
        }
        if (scoreRef.current > saved.bestScore) saved.bestScore = scoreRef.current;
        writeSaveData(saved);
        setSaveData({ ...saved });

        const badgeName = LEVELS[levelRef.current - 1].badge;
        setNotification(gotBadge ? "获得徽章: " + badgeName : "第" + levelRef.current + "关 通过！");

        setTimeout(() => {
          if (phaseRef.current === "levelComplete") {
            levelRef.current++;
            setLevel(levelRef.current);
            scoreInLevelRef.current = 0;
            fruitsRef.current = [];
            halvesRef.current = [];
            particlesRef.current = [];
            trailRef.current = [];
            spawnTimerRef.current = 0;
            prevPointerRef.current = null;
            phaseRef.current = "playing";
            setPhase("playing");
          }
        }, 2000);
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

    // ---- 绘制 ----

    for (const t of trail) {
      const alpha = t.life / 12;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 3 * alpha, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + (alpha * 0.8) + ")";
      ctx.fill();
    }

    for (const f of fruits) {
      if (!f.sliced) {
        drawFruit(ctx, f);
      }
    }

    for (const hh of halves) {
      drawSliceHalf(ctx, hh);
    }

    for (const p of parts) {
      const alpha = p.life / p.maxLife;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * alpha, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace("1)", String(alpha) + ")");
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [getLevelCfg]);

  /* ---------- 切割处理 ---------- */
  const handleSlice = useCallback((x: number, y: number) => {
    if (phaseRef.current !== "playing") return;

    trailRef.current.push({ x, y, life: 12 });

    const prev = prevPointerRef.current;
    prevPointerRef.current = { x, y };

    if (!prev) return;

    const fruits = fruitsRef.current;
    const levelCfg = getLevelCfg();
    const slicedIds: number[] = [];

    for (let i = fruits.length - 1; i >= 0; i--) {
      const f = fruits[i];
      if (f.sliced) continue;
      if (!hitTest(f, prev.x, prev.y, x, y)) continue;

      f.sliced = true;
      slicedIds.push(f.id);

      if (f.type === "bomb") {
        playBombSound();
        livesRef.current--;
        setLives(livesRef.current);
        if (livesRef.current <= 0) {
          phaseRef.current = "gameOver";
          setPhase("gameOver");
          setNotification("坚持到了第" + levelRef.current + "关");
          setTimeout(() => setNotification(null), 3000);
          const saved = loadSaveData();
          if (scoreRef.current > saved.bestScore) saved.bestScore = scoreRef.current;
          writeSaveData(saved);
        }
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
        scoreInLevelRef.current += 1;
        setScore(scoreRef.current);

        createHalves(f, prev.x, prev.y, x, y);

        // 果汁粒子
        const juiceColor = f.innerColor;
        const tempEl = document.createElement("canvas");
        const tmpCtx = tempEl.getContext("2d");
        if (tmpCtx) {
          tmpCtx.fillStyle = juiceColor;
          const parsed = tmpCtx.fillStyle;
          const cr = parseInt(parsed.slice(1, 3), 16);
          const cg = parseInt(parsed.slice(3, 5), 16);
          const cb = parseInt(parsed.slice(5, 7), 16);
          const rgba = "rgba(" + cr + "," + cg + "," + cb + ",1)";
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

    // 连锁切割
    if (levelCfg.chainSlice && slicedIds.length > 0) {
      for (let i = fruits.length - 1; i >= 0; i--) {
        const f = fruits[i];
        if (f.sliced || f.type === "bomb") continue;
        for (const sid of slicedIds) {
          const slicedFruit = fruits.find((ff) => ff.id === sid);
          if (!slicedFruit) continue;
          const dist = Math.hypot(f.x - slicedFruit.x, f.y - slicedFruit.y);
          if (dist < (f.r + slicedFruit.r) * 1.8) {
            f.sliced = true;
            playSliceSound();
            scoreRef.current += 1;
            scoreInLevelRef.current += 1;
            setScore(scoreRef.current);
            createHalves(f, f.x, f.y - 10, f.x + 10, f.y);
            const tempEl = document.createElement("canvas");
            const tmpCtx = tempEl.getContext("2d");
            if (tmpCtx) {
              tmpCtx.fillStyle = f.innerColor;
              const parsed = tmpCtx.fillStyle;
              const cr = parseInt(parsed.slice(1, 3), 16);
              const cg = parseInt(parsed.slice(3, 5), 16);
              const cb = parseInt(parsed.slice(5, 7), 16);
              const rgba = "rgba(" + cr + "," + cg + "," + cb + ",1)";
              for (let j = 0; j < 6; j++) {
                const a = Math.random() * Math.PI * 2;
                const s = 1 + Math.random() * 2;
                particlesRef.current.push({
                  x: f.x + (Math.random() - 0.5) * f.r,
                  y: f.y + (Math.random() - 0.5) * f.r,
                  vx: Math.cos(a) * s,
                  vy: Math.sin(a) * s - 1,
                  r: 2 + Math.random() * 2,
                  color: rgba,
                  life: 15 + Math.random() * 10,
                  maxLife: 25,
                });
              }
            }
            break;
          }
        }
      }
    }
  }, [getLevelCfg]);

  /* ---------- Pointer 事件 ---------- */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (phaseRef.current !== "playing") return;
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

  /* ---------- 开始游戏 ---------- */
  const startGame = useCallback(() => {
    fruitsRef.current = [];
    halvesRef.current = [];
    particlesRef.current = [];
    trailRef.current = [];
    prevPointerRef.current = null;
    scoreRef.current = 0;
    scoreInLevelRef.current = 0;
    livesRef.current = 3;
    levelRef.current = 1;
    spawnTimerRef.current = 0;
    setScore(0);
    setLives(3);
    setLevel(1);
    setPhase("playing");
    setNotification(null);
    phaseRef.current = "playing";
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

  /* ---------- 当前关卡目标分 ---------- */
  const currentTarget = LEVELS[Math.min(level - 1, LEVELS.length - 1)]?.targetScore ?? 15;

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
          top: 8px;
          left: 12px;
          right: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          pointer-events: none;
          font-size: 13px;
          font-weight: 600;
          color: #333;
          font-family: system-ui, -apple-system, sans-serif;
          gap: 6px;
          flex-wrap: wrap;
        }
        .sr-fs-hud-item {
          background: rgba(255,255,255,0.75);
          padding: 4px 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }
        .sr-fs-lives {
          display: flex;
          gap: 3px;
        }
        .sr-fs-heart {
          width: 14px;
          height: 14px;
          display: inline-block;
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
        .sr-fs-notification {
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
        .sr-fs-level-transition {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 15;
          background: rgba(250,248,245,0.9);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .sr-fs-level-transition h2 {
          font-size: 28px;
          font-weight: 800;
          color: #c0392b;
          margin: 0 0 8px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .sr-fs-level-transition p {
          font-size: 15px;
          color: #666;
          margin: 0;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .sr-fs-idle-hint {
          font-size: 13px;
          color: #999;
          margin-top: 16px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .sr-fs-badge-section {
          margin-top: 16px;
          text-align: center;
        }
        .sr-fs-badge-section h4 {
          font-size: 13px;
          color: #999;
          margin: 0 0 8px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .sr-fs-badge-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: center;
        }
        .sr-fs-badge-item {
          padding: 4px 10px;
          background: rgba(192,57,43,0.1);
          color: #c0392b;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .sr-fs-badge-item.locked {
          background: rgba(0,0,0,0.05);
          color: #ccc;
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

        {phase === "playing" && (
          <div className="sr-fs-hud">
            <span className="sr-fs-hud-item">第 {level}/10 关</span>
            <span className="sr-fs-hud-item">{score} / {currentTarget}</span>
            <span className="sr-fs-hud-item">
              <span className="sr-fs-lives">
                {[1, 2, 3].map((i) => (
                  <svg key={i} className="sr-fs-heart" viewBox="0 0 24 24">
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill={i <= lives ? "#e74c3c" : "#ddd"}
                    />
                  </svg>
                ))}
              </span>
            </span>
            <span className="sr-fs-hud-item">徽章 {saveData.badges.length}/10</span>
          </div>
        )}

        <AnimatePresence>
          {notification && (
            <motion.div
              className="sr-fs-notification"
              key={notification}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "levelComplete" && (
            <motion.div
              className="sr-fs-level-transition"
              key="level-complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4 }}
            >
              <button className="sr-overlay-close" onClick={() => {
                if (levelRef.current < LEVELS.length) {
                  const nextLvl = levelRef.current + 1;
                  scoreInLevelRef.current = 0;
                  fruitsRef.current = [];
                  halvesRef.current = [];
                  particlesRef.current = [];
                  trailRef.current = [];
                  spawnTimerRef.current = 0;
                  prevPointerRef.current = null;
                  levelRef.current = nextLvl;
                  setLevel(nextLvl);
                  phaseRef.current = "playing";
                  setPhase("playing");
                } else {
                  phaseRef.current = "menu";
                  setPhase("menu");
                }
              }} style={{ position: "absolute", top: 12, right: 14, background: "none", border: "none", fontSize: 20, color: "#aaa", cursor: "pointer", lineHeight: 1 }}>&times;</button>
              <h2>第 {level} 关 通过！</h2>
              <p>准备进入第 {level + 1} 关 ...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === "menu" && (
          <div className="sr-fs-overlay">
            <button className="sr-fs-start-btn" onClick={startGame}>
              开始
            </button>
            <div className="sr-fs-idle-hint">滑动鼠标或手指切割水果</div>
            {saveData.badges.length > 0 && (
              <div className="sr-fs-badge-section">
                <h4>已获徽章</h4>
                <div className="sr-fs-badge-list">
                  {saveData.badges.map((b) => (
                    <span key={b} className="sr-fs-badge-item">
                      {LEVELS[b - 1]?.badge ?? ("关卡" + b)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {phase === "gameOver" && (
          <div className="sr-fs-overlay">
            <div className="sr-fs-over-title">游戏结束</div>
            <div className="sr-fs-over-score">
              坚持到了第 {level} 关 | 得分: {score} | 最佳: {Math.max(saveData.bestScore, score)}
            </div>
            <button className="sr-fs-start-btn" onClick={startGame}>
              再来一次
            </button>
            {/* 徽章墙 */}
            {saveData.badges.length > 0 && (
              <div style={{ marginTop: 12, width: '100%', maxHeight: 280, overflowY: 'auto' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#5a4a52', textAlign: 'center', marginBottom: 8 }}>
                  徽章墙 ({saveData.badges.length}/20)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: '0 8px' }}>
                  {LEVELS.map((lvl, i) => {
                    const earned = saveData.badges.includes(i + 1);
                    return (
                      <div key={i} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        gap: 2, padding: 6, opacity: earned ? 1 : 0.4,
                      }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: earned ? '#FFD700' : '#e0e0e0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, color: '#fff', fontWeight: 700,
                        }}>
                          {earned ? '★' : '🔒'}
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: earned ? '#5a4a52' : '#aaa', textAlign: 'center' }}>
                          {lvl.badge}
                        </span>
                        <span style={{ fontSize: 10, color: '#aaa' }}>第{i+1}关</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
