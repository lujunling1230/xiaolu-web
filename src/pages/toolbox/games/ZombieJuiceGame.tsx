import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 僵尸榨汁机 · ZombieJuice
 *
 * 美漫扁平风 Canvas 微游戏。
 * 点击僵尸 → 飞入榨汁机 → 绿色果汁飞溅。
 * 无限模式，成就系统，localStorage 持久化。
 */

/* ============================================================
   类型
   ============================================================ */
interface Zombie {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  state: "idle" | "flying" | "done";
  color: string;
  eyeColor: string;
  wobble: number;
  targetX: number;
  targetY: number;
}

interface JuiceDrop {
  x: number;
  y: number;
  vy: number;
  r: number;
  color: string;
  life: number;
}

interface Achievement {
  threshold: number;
  label: string;
  icon: string;
}

/* ============================================================
   常量
   ============================================================ */
const CANVAS_W = 600;
const CANVAS_H_DESKTOP = 380;
const CANVAS_H_MOBILE = 320;

const MAX_ZOMBIES = 8;
const ZOMBIE_W = 48;
const ZOMBIE_H = 64;
const JUICER_W = 120;
const JUICER_H = 90;
const SPAWN_INTERVAL_BASE = 1800; // ms
const SPAWN_INTERVAL_MIN = 600;   // ms

const BG_TOP = "#f8faf6";
const BG_BOTTOM = "#f0f2ec";

const STORAGE_KEY = "zombie_juice_best";

const ACHIEVEMENTS: Achievement[] = [
  { threshold: 5, label: "初入榨道", icon: "🧃" },
  { threshold: 10, label: "你已超脱凡尘", icon: "🧟" },
  { threshold: 20, label: "万尸归汁", icon: "💀" },
  { threshold: 50, label: "榨汁大师", icon: "🏆" },
];

/* ============================================================
   Web Audio 音效
   ============================================================ */
const playClickSound = () => {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    /* 静音 */
  }
};

const playJuiceSound = () => {
  try {
    const ctx = new AudioContext();
    // 基础"咕噜"声
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.frequency.setValueAtTime(180, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.4);
    gain1.gain.setValueAtTime(0.2, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.4);

    // 高频气泡
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.setValueAtTime(800, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
    gain2.gain.setValueAtTime(0.06, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc2.start();
    osc2.stop(ctx.currentTime + 0.2);

    // 第二个气泡
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = "sine";
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.frequency.setValueAtTime(1000, ctx.currentTime + 0.1);
    osc3.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.25);
    gain3.gain.setValueAtTime(0.04, ctx.currentTime + 0.1);
    gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc3.start(ctx.currentTime + 0.1);
    osc3.stop(ctx.currentTime + 0.3);
  } catch {
    /* 静音 */
  }
};

/* ============================================================
   辅助函数
   ============================================================ */
const zombieColors = [
  "#6b8e5a",
  "#7a9e68",
  "#5e8050",
  "#8aad76",
  "#68905c",
];
const eyeColors = ["#ffffa0", "#ffe880", "#fff0a0"];

const randItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

let _zombieId = 0;
const nextZombieId = () => ++_zombieId;

const createZombie = (canvasW: number, canvasH: number): Zombie => ({
  id: nextZombieId(),
  x: randRange(ZOMBIE_W, canvasW - ZOMBIE_W - JUICER_W),
  y: randRange(20, canvasH * 0.55),
  w: ZOMBIE_W,
  h: ZOMBIE_H,
  vx: randRange(-0.3, 0.3),
  vy: 0,
  state: "idle",
  color: randItem(zombieColors),
  eyeColor: randItem(eyeColors),
  wobble: randRange(0, Math.PI * 2),
  targetX: 0,
  targetY: 0,
});

/* ============================================================
   Canvas 绘制函数
   ============================================================ */

/** 绘制背景 */
const drawBackground = (ctx: CanvasRenderingContext2D, w: number, h: number, _time: number) => {
  void _time;
  // 渐变背景
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, BG_TOP);
  grad.addColorStop(1, BG_BOTTOM);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // 点阵装饰
  ctx.fillStyle = "rgba(0,0,0,0.04)";
  const dotSpacing = 24;
  for (let dx = dotSpacing; dx < w; dx += dotSpacing) {
    for (let dy = dotSpacing; dy < h; dy += dotSpacing) {
      ctx.beginPath();
      ctx.arc(dx, dy, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

/** 绘制圆角矩形 */
const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

/** 绘制僵尸 */
const drawZombie = (
  ctx: CanvasRenderingContext2D,
  z: Zombie,
  time: number,
) => {
  ctx.save();
  const cx = z.x + z.w / 2;
  const cy = z.y + z.h / 2;
  const isFlying = z.state === "flying";

  // 摇摆旋转
  const wobbleAngle = isFlying
    ? Math.sin(time * 0.008 + z.wobble) * 0.3
    : Math.sin(time * 0.003 + z.wobble) * 0.08;
  ctx.translate(cx, cy);
  ctx.rotate(wobbleAngle);
  ctx.translate(-cx, -cy);

  const bx = z.x;
  const by = z.y;
  const bw = z.w;
  const bh = z.h;

  // ---- 身体 ----
  const bodyGrad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
  bodyGrad.addColorStop(0, z.color);
  bodyGrad.addColorStop(1, darkenColor(z.color, 30));
  ctx.fillStyle = bodyGrad;
  roundRect(ctx, bx + 8, by + 22, bw - 16, bh - 22, 6);
  ctx.fill();

  // ---- 手臂（贝塞尔曲线）----
  const armY = by + 30;
  ctx.strokeStyle = z.color;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";

  // 左臂
  ctx.beginPath();
  ctx.moveTo(bx + 10, armY);
  ctx.bezierCurveTo(bx - 10, armY + 8, bx - 18, armY + 20, bx - 22, armY + 15);
  ctx.stroke();
  // 手指
  for (let f = -1; f <= 1; f++) {
    ctx.beginPath();
    ctx.arc(bx - 22 + f * 3, armY + 15 + f * 2, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = z.color;
    ctx.fill();
  }

  // 右臂
  ctx.beginPath();
  ctx.moveTo(bx + bw - 10, armY);
  ctx.bezierCurveTo(bx + bw + 10, armY + 8, bx + bw + 18, armY + 20, bx + bw + 22, armY + 15);
  ctx.stroke();
  for (let f = -1; f <= 1; f++) {
    ctx.beginPath();
    ctx.arc(bx + bw + 22 + f * 3, armY + 15 + f * 2, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = z.color;
    ctx.fill();
  }

  // ---- 头部 ----
  const headX = bx + 4;
  const headY = by;
  const headW = bw - 8;
  const headH = 28;

  const headGrad = ctx.createLinearGradient(headX, headY, headX + headW, headY + headH);
  headGrad.addColorStop(0, z.color);
  headGrad.addColorStop(1, darkenColor(z.color, 20));
  ctx.fillStyle = headGrad;
  roundRect(ctx, headX, headY, headW, headH, 10);
  ctx.fill();

  // ---- 头部裂缝 + 脑组织 ----
  ctx.strokeStyle = darkenColor(z.color, 50);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(headX + headW * 0.6, headY + 2);
  ctx.lineTo(headX + headW * 0.55, headY + 8);
  ctx.lineTo(headX + headW * 0.65, headY + 12);
  ctx.stroke();

  // 脑组织（粉色椭圆）
  ctx.fillStyle = "#f0a0b0";
  ctx.beginPath();
  ctx.ellipse(headX + headW * 0.62, headY + 5, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // 脑回纹
  ctx.strokeStyle = "#d08090";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(headX + headW * 0.58, headY + 3);
  ctx.quadraticCurveTo(headX + headW * 0.65, headY + 5, headX + headW * 0.6, headY + 7);
  ctx.stroke();

  // ---- 头部缝线 ----
  ctx.strokeStyle = "#4a3a2a";
  ctx.lineWidth = 1.2;
  ctx.setLineDash([3, 2]);
  ctx.beginPath();
  ctx.moveTo(headX + headW * 0.3, headY + 2);
  ctx.lineTo(headX + headW * 0.35, headY + 14);
  ctx.stroke();
  ctx.setLineDash([]);
  // 横纹
  ctx.beginPath();
  ctx.moveTo(headX + headW * 0.28, headY + 5);
  ctx.lineTo(headX + headW * 0.38, headY + 5);
  ctx.moveTo(headX + headW * 0.29, headY + 9);
  ctx.lineTo(headX + headW * 0.37, headY + 9);
  ctx.stroke();

  // ---- 血迹 ----
  ctx.fillStyle = "rgba(120,20,20,0.4)";
  ctx.beginPath();
  ctx.ellipse(headX + headW * 0.15, headY + 18, 4, 3, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // ---- 眼窝 + 眼睛 ----
  const eyeY = headY + 12;
  const leftEyeX = headX + headW * 0.35;
  const rightEyeX = headX + headW * 0.65;

  // 眼窝暗影
  ctx.fillStyle = "rgba(30,30,20,0.5)";
  ctx.beginPath();
  ctx.ellipse(leftEyeX, eyeY, 5, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(rightEyeX, eyeY, 5, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 眼白
  ctx.fillStyle = z.eyeColor;
  ctx.beginPath();
  ctx.ellipse(leftEyeX, eyeY, 3.5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(rightEyeX, eyeY, 3.5, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // 瞳孔（飞行时红色旋转）
  const pupilAngle = isFlying ? time * 0.01 : 0;
  const pupilOffset = isFlying ? 1.2 : 0.5;
  const pupilColor = isFlying ? "#ff2020" : "#cc3030";

  ctx.fillStyle = pupilColor;
  ctx.beginPath();
  ctx.arc(
    leftEyeX + Math.cos(pupilAngle) * pupilOffset,
    eyeY + Math.sin(pupilAngle) * pupilOffset * 0.5,
    1.8, 0, Math.PI * 2,
  );
  ctx.fill();
  ctx.beginPath();
  ctx.arc(
    rightEyeX + Math.cos(pupilAngle + 0.5) * pupilOffset,
    eyeY + Math.sin(pupilAngle + 0.5) * pupilOffset * 0.5,
    1.8, 0, Math.PI * 2,
  );
  ctx.fill();

  // 眼睛高光
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath();
  ctx.arc(leftEyeX - 1, eyeY - 1, 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(rightEyeX - 1, eyeY - 1, 0.8, 0, Math.PI * 2);
  ctx.fill();

  // ---- 嘴巴 ----
  const mouthY = headY + headH - 3;
  const mouthX = headX + headW * 0.5;

  if (isFlying) {
    // O 型惊恐嘴
    ctx.fillStyle = "#2a1a0a";
    ctx.beginPath();
    ctx.ellipse(mouthX, mouthY, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8a2020";
    ctx.beginPath();
    ctx.ellipse(mouthX, mouthY, 2.5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // 张开的嘴
    ctx.fillStyle = "#2a1a0a";
    ctx.beginPath();
    ctx.ellipse(mouthX, mouthY, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // 牙齿（4颗中缺2颗：保留位置0和3，缺位置1和2）
    ctx.fillStyle = "#e8e0d0";
    // 上排：左1保留，左2缺失，右2缺失，右1保留
    ctx.fillRect(mouthX - 5, mouthY - 3, 2.5, 2.5);
    ctx.fillRect(mouthX + 2.5, mouthY - 3, 2.5, 2.5);
    // 下排：2颗
    ctx.fillRect(mouthX - 3, mouthY + 1, 2.5, 2.5);
    ctx.fillRect(mouthX + 1, mouthY + 1, 2.5, 2.5);
  }

  ctx.restore();
};

/** 颜色加深辅助 */
const darkenColor = (hex: string, amount: number): string => {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `rgb(${r},${g},${b})`;
};

/** 绘制榨汁机 */
const drawJuicer = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  shaking: boolean,
  time: number,
) => {
  ctx.save();

  // 晃动效果
  if (shaking) {
    const shakeX = Math.sin(time * 0.04) * 3;
    ctx.translate(shakeX, 0);
  }

  const jw = JUICER_W;
  const jh = JUICER_H;

  // ---- 底座 ----
  ctx.fillStyle = "#8b6914";
  roundRect(ctx, x, y + jh - 12, jw, 12, 3);
  ctx.fill();

  // ---- 机身 ----
  const bodyGrad = ctx.createLinearGradient(x, y, x + jw, y + jh);
  bodyGrad.addColorStop(0, "#5a3a1a");
  bodyGrad.addColorStop(0.5, "#6b4520");
  bodyGrad.addColorStop(1, "#4a2a10");
  ctx.fillStyle = bodyGrad;
  roundRect(ctx, x + 10, y + 20, jw - 20, jh - 30, 4);
  ctx.fill();

  // ---- 漏斗入口 ----
  ctx.fillStyle = "#7a5a30";
  ctx.beginPath();
  ctx.moveTo(x + jw / 2 - 25, y + 18);
  ctx.lineTo(x + jw / 2 + 25, y + 18);
  ctx.lineTo(x + jw / 2 + 15, y + 28);
  ctx.lineTo(x + jw / 2 - 15, y + 28);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#4a3015";
  ctx.lineWidth = 1;
  ctx.stroke();

  // ---- 出汁口 ----
  ctx.fillStyle = "#4a2a10";
  ctx.fillRect(x + jw - 8, y + 40, 8, 6);
  // 出汁口嘴
  ctx.fillStyle = "#3a1a08";
  ctx.beginPath();
  ctx.moveTo(x + jw, y + 40);
  ctx.lineTo(x + jw + 6, y + 42);
  ctx.lineTo(x + jw, y + 46);
  ctx.closePath();
  ctx.fill();

  // ---- 把手 ----
  ctx.strokeStyle = "#4a2a10";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 30);
  ctx.quadraticCurveTo(x - 12, y + 40, x + 8, y + 55);
  ctx.stroke();

  // ---- 装饰线 ----
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 15, y + 35);
  ctx.lineTo(x + jw - 15, y + 35);
  ctx.stroke();

  ctx.restore();
};

/** 绘制果汁滴 */
const drawJuiceDrops = (
  ctx: CanvasRenderingContext2D,
  drops: JuiceDrop[],
) => {
  for (const d of drops) {
    ctx.globalAlpha = Math.min(1, d.life / 30);
    ctx.fillStyle = d.color;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
};

/** 绘制飞溅粒子 */
const drawSplashParticles = (
  ctx: CanvasRenderingContext2D,
  particles: Array<{ x: number; y: number; vx: number; vy: number; r: number; life: number; color: string }>,
) => {
  for (const p of particles) {
    ctx.globalAlpha = Math.min(1, p.life / 25);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
};

/* ============================================================
   主组件
   ============================================================ */
const ZombieJuiceGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zombiesRef = useRef<Zombie[]>([]);
  const juiceDropsRef = useRef<JuiceDrop[]>([]);
  const splashRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; r: number; life: number; color: string }>>([]);
  const scoreRef = useRef(0);
  const bestScoreRef = useRef(0);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const unlockedRef = useRef<Set<number>>(new Set());
  const animFrameRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);
  const juiceDropTimerRef = useRef(0);
  const shakingRef = useRef(0);
  const startedRef = useRef(false);

  // 读取最佳分数
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val)) {
          bestScoreRef.current = val;
          setBestScore(val);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  // 成就检查
  const checkAchievement = useCallback((s: number) => {
    for (const a of ACHIEVEMENTS) {
      if (s >= a.threshold && !unlockedRef.current.has(a.threshold)) {
        unlockedRef.current.add(a.threshold);
        setAchievement(a);
        setTimeout(() => setAchievement(null), 2500);
        break;
      }
    }
  }, []);

  // 更新最佳分数
  const updateBest = useCallback((s: number) => {
    if (s > bestScoreRef.current) {
      bestScoreRef.current = s;
      setBestScore(s);
      try {
        localStorage.setItem(STORAGE_KEY, String(s));
      } catch {
        /* ignore */
      }
    }
  }, []);

  // 生成飞溅粒子
  const spawnSplash = useCallback((jx: number, jy: number) => {
    const colors = ["#4CAF50", "#66BB6A", "#81C784", "#A5D6A7", "#388E3C"];
    for (let i = 0; i < 12; i++) {
      const angle = randRange(0, Math.PI * 2);
      const speed = randRange(1.5, 4);
      splashRef.current.push({
        x: jx + JUICER_W / 2,
        y: jy + 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        r: randRange(2, 5),
        life: randRange(25, 45),
        color: randItem(colors),
      });
    }
  }, []);

  // 主循环
  const gameLoop = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // 清除
      ctx.clearRect(0, 0, w, h);

      // 背景
      drawBackground(ctx, w, h, timestamp);

      // 榨汁机位置
      const jx = w - JUICER_W - 20;
      const jy = h - JUICER_H - 10;

      // 生成僵尸
      if (startedRef.current && timestamp - lastSpawnRef.current > 0) {
        const interval = Math.max(
          SPAWN_INTERVAL_MIN,
          SPAWN_INTERVAL_BASE - scoreRef.current * 15,
        );
        if (timestamp - lastSpawnRef.current >= interval) {
          if (zombiesRef.current.filter((z) => z.state === "idle").length < MAX_ZOMBIES) {
            zombiesRef.current.push(createZombie(w, h));
          }
          lastSpawnRef.current = timestamp;
        }
      }

      // 更新僵尸
      for (const z of zombiesRef.current) {
        if (z.state === "idle") {
          // 缓慢摇摆移动
          z.wobble += 0.02;
          z.x += Math.sin(z.wobble) * 0.3 + z.vx;
          z.y += z.vy;

          // 边界检查
          if (z.x < 10) { z.x = 10; z.vx *= -1; }
          if (z.x > w - z.w - JUICER_W - 10) { z.x = w - z.w - JUICER_W - 10; z.vx *= -1; }
          if (z.y < 10) { z.y = 10; z.vy *= -1; }
          if (z.y > h * 0.55) { z.y = h * 0.55; z.vy *= -1; }
        } else if (z.state === "flying") {
          // 飞向榨汁机
          const dx = z.targetX - (z.x + z.w / 2);
          const dy = z.targetY - (z.y + z.h / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 15) {
            z.state = "done";
            scoreRef.current += 1;
            setScore(scoreRef.current);
            updateBest(scoreRef.current);
            checkAchievement(scoreRef.current);
            shakingRef.current = 20;
            spawnSplash(jx, jy);
            playJuiceSound();
          } else {
            const speed = 8;
            z.x += (dx / dist) * speed;
            z.y += (dy / dist) * speed;
          }
        }
      }

      // 移除已完成的僵尸
      zombiesRef.current = zombiesRef.current.filter((z) => z.state !== "done");

      // 绘制僵尸（先绘制idle，再绘制flying）
      for (const z of zombiesRef.current) {
        if (z.state === "idle") drawZombie(ctx, z, timestamp);
      }
      for (const z of zombiesRef.current) {
        if (z.state === "flying") drawZombie(ctx, z, timestamp);
      }

      // 绘制榨汁机
      const isShaking = shakingRef.current > 0;
      if (shakingRef.current > 0) shakingRef.current--;
      drawJuicer(ctx, jx, jy, isShaking, timestamp);

      // 出汁口的果汁滴
      if (startedRef.current && scoreRef.current > 0) {
        juiceDropTimerRef.current++;
        if (juiceDropTimerRef.current > 8) {
          juiceDropTimerRef.current = 0;
          juiceDropsRef.current.push({
            x: jx + JUICER_W + 6,
            y: jy + 44,
            vy: randRange(0.5, 1.5),
            r: randRange(2, 4),
            color: randItem(["#4CAF50", "#66BB6A", "#81C784"]),
            life: randRange(40, 70),
          });
        }
      }

      // 更新果汁滴
      for (const d of juiceDropsRef.current) {
        d.y += d.vy;
        d.life -= 1;
      }
      juiceDropsRef.current = juiceDropsRef.current.filter((d) => d.life > 0 && d.y < h);

      // 绘制果汁滴
      drawJuiceDrops(ctx, juiceDropsRef.current);

      // 更新飞溅粒子
      for (const p of splashRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // 重力
        p.life -= 1;
      }
      splashRef.current = splashRef.current.filter((p) => p.life > 0);
      drawSplashParticles(ctx, splashRef.current);

      animFrameRef.current = requestAnimationFrame(gameLoop);
    },
    [checkAchievement, updateBest, spawnSplash],
  );

  // 启动 / 停止游戏循环
  useEffect(() => {
    if (started) {
      startedRef.current = true;
      lastSpawnRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [started, gameLoop]);

  // 点击处理
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!started) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      // 从后往前遍历，优先点击最上层
      for (let i = zombiesRef.current.length - 1; i >= 0; i--) {
        const z = zombiesRef.current[i];
        if (z.state !== "idle") continue;
        if (
          mx >= z.x &&
          mx <= z.x + z.w &&
          my >= z.y &&
          my <= z.y + z.h
        ) {
          z.state = "flying";
          const jx = canvas.width - JUICER_W - 20;
          const jy = canvas.height - JUICER_H - 10;
          z.targetX = jx + JUICER_W / 2 - z.w / 2;
          z.targetY = jy + 10;
          playClickSound();
          break;
        }
      }
    },
    [started],
  );

  // 响应式 Canvas 高度
  const [canvasH, setCanvasH] = useState(CANVAS_H_DESKTOP);
  useEffect(() => {
    const checkMobile = () => {
      setCanvasH(window.innerWidth < 640 ? CANVAS_H_MOBILE : CANVAS_H_DESKTOP);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 开始游戏
  const handleStart = useCallback(() => {
    setStarted(true);
  }, []);

  return (
    <div className="sr-zj-wrapper">
      {/* HUD */}
      <div className="sr-zj-hud">
        <span className="sr-zj-hud-item">
          <span className="sr-zj-hud-label">已榨</span>
          <span className="sr-zj-hud-value">{score}</span>
        </span>
        <span className="sr-zj-hud-item">
          <span className="sr-zj-hud-label">最佳</span>
          <span className="sr-zj-hud-value">{bestScore}</span>
        </span>
      </div>

      {/* Canvas 容器 */}
      <div className="sr-zj-canvas-container">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={canvasH}
          onClick={handleClick}
          className="sr-zj-canvas"
        />

        {!started && (
          <button className="sr-zj-start-btn" onClick={handleStart}>
            开始
          </button>
        )}
      </div>

      {/* 成就通知 */}
      <AnimatePresence>
        {achievement && (
          <motion.div
            className="sr-zj-achievement"
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <span className="sr-zj-achievement-icon">{achievement.icon}</span>
            <span className="sr-zj-achievement-label">{achievement.label}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS-in-JS */}
      <style>{`
        .sr-zj-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }
        .sr-zj-hud {
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-bottom: 8px;
        }
        .sr-zj-hud-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 15px;
          font-weight: 600;
          color: #3a3a3a;
        }
        .sr-zj-hud-label {
          color: #8a8a8a;
          font-weight: 400;
        }
        .sr-zj-hud-value {
          color: #4a7a3a;
          font-size: 18px;
          min-width: 28px;
          text-align: center;
        }
        .sr-zj-canvas-container {
          position: relative;
          width: 100%;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .sr-zj-canvas {
          width: 100%;
          height: ${canvasH}px;
          border-radius: 12px;
          cursor: pointer;
          display: block;
        }
        .sr-zj-start-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 12px 40px;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #4a7a3a, #6b8e5a);
          border: none;
          border-radius: 24px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(74,122,58,0.3);
          transition: transform 0.15s, box-shadow 0.15s;
          z-index: 10;
        }
        .sr-zj-start-btn:hover {
          transform: translate(-50%, -50%) scale(1.05);
          box-shadow: 0 6px 20px rgba(74,122,58,0.4);
        }
        .sr-zj-start-btn:active {
          transform: translate(-50%, -50%) scale(0.97);
        }
        .sr-zj-achievement {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          background: rgba(74,122,58,0.92);
          color: #fff;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 3px 12px rgba(0,0,0,0.15);
          z-index: 10;
          pointer-events: none;
          white-space: nowrap;
        }
        .sr-zj-achievement-icon {
          font-size: 20px;
        }
        .sr-zj-achievement-label {
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
};

export default ZombieJuiceGame;
