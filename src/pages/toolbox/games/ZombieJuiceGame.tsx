import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ZombieJuice - 僵尸榨汁机
 *
 * 美漫扁平风 Canvas 塔防经营游戏。
 * 10关、4种武器、杯子售卖、海绵宝宝居民、徽章系统。
 */

/* ============================================================
   Types
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
  hp: number;
  maxHp: number;
  isSmall: boolean;
  isInvisible: boolean;
  hasArmor: boolean;
  isBoss: boolean;
  dodgeDir: number;
  dodgeCooldown: number;
}

interface JuiceDrop {
  x: number;
  y: number;
  vy: number;
  r: number;
  color: string;
  life: number;
}

interface SplashParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  color: string;
}

interface Cup {
  id: number;
  type: "normal" | "rare";
}

interface Customer {
  id: number;
  x: number;
  y: number;
  state: "walking_in" | "buying" | "walking_out";
  wobble: number;
}

interface WeaponEffect {
  type: string;
  x: number;
  y: number;
  life: number;
}

interface BadgeInfo {
  level: number;
  name: string;
  icon: string;
}

interface WeaponDef {
  id: string;
  name: string;
  price: number;
  unlockLevel: number;
  description: string;
}

interface LevelDef {
  target: number;
  speed: number;
  reward: number;
  description: string;
}

interface GameState {
  phase: "menu" | "playing" | "levelComplete" | "allClear";
  level: number;
  gold: number;
  juiced: number;
  target: number;
  ownedWeapons: string[];
  currentWeapon: string;
  badges: number[];
  cups: Cup[];
  highestLevel: number;
}

/* ============================================================
   Constants
   ============================================================ */
const CANVAS_W = 600;
const CANVAS_H_DESKTOP = 380;
const CANVAS_H_MOBILE = 320;
const ZOMBIE_W = 48;
const ZOMBIE_H = 64;
const JUICER_W = 120;
const JUICER_H = 90;
const MAX_ZOMBIES = 8;
const MAX_CUPS = 6;
const STORAGE_KEY = "zombie_juice_save";

const BG_TOP = "#f8faf6";
const BG_BOTTOM = "#f0f2ec";

const SPEED_SLOW = 0.35;
const SPEED_MEDIUM = 0.65;
const SPEED_FAST = 1.0;
const SPEED_VERY_FAST = 1.5;

const WEAPONS: WeaponDef[] = [
  { id: "harpoon", name: "鱼叉枪", price: 0, unlockLevel: 1, description: "单体点击，僵尸飞入榨汁机" },
  { id: "lightning", name: "闪电枪", price: 200, unlockLevel: 2, description: "范围电击，同时击中2只僵尸" },
  { id: "net", name: "网枪", price: 500, unlockLevel: 4, description: "网住僵尸，自动捕获" },
  { id: "grenade", name: "手雷", price: 1000, unlockLevel: 7, description: "范围爆炸，同时击中3只僵尸" },
];

const LEVELS: LevelDef[] = [
  { target: 5, speed: SPEED_SLOW, reward: 50, description: "无特殊条件" },
  { target: 8, speed: SPEED_SLOW, reward: 80, description: "解锁闪电枪" },
  { target: 10, speed: SPEED_MEDIUM, reward: 120, description: "出现跑得快的僵尸" },
  { target: 12, speed: SPEED_MEDIUM, reward: 150, description: "解锁网枪" },
  { target: 15, speed: SPEED_MEDIUM, reward: 200, description: "僵尸会躲闪" },
  { target: 18, speed: SPEED_FAST, reward: 250, description: "出现小僵尸（更难点击）" },
  { target: 20, speed: SPEED_FAST, reward: 300, description: "解锁手雷" },
  { target: 25, speed: SPEED_FAST, reward: 400, description: "僵尸有护甲（需点击2次）" },
  { target: 30, speed: SPEED_VERY_FAST, reward: 500, description: "僵尸会隐身（半透明闪烁）" },
  { target: 40, speed: SPEED_VERY_FAST, reward: 800, description: "BOSS关卡，超大僵尸需5次点击" },
];

const BADGES: BadgeInfo[] = [
  { level: 1, name: "新手榨工", icon: "\u{1F9C3}" },
  { level: 2, name: "雷电使者", icon: "\u26A1" },
  { level: 3, name: "疾风猎手", icon: "\u{1F4A8}" },
  { level: 4, name: "天网恢恢", icon: "\u{1F578}" },
  { level: 5, name: "闪避大师", icon: "\u{1F3AF}" },
  { level: 6, name: "小鬼克星", icon: "\u{1F47B}" },
  { level: 7, name: "爆破专家", icon: "\u{1F4A3}" },
  { level: 8, name: "破甲勇士", icon: "\u{1F6E1}" },
  { level: 9, name: "隐形猎手", icon: "\u{1F52E}" },
  { level: 10, name: "终极榨神", icon: "\u{1F3C6}" },
];

/* ============================================================
   Web Audio
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
  } catch { /* silent */ }
};

const playJuiceSound = () => {
  try {
    const ctx = new AudioContext();
    const o1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    o1.type = "sine"; o1.connect(g1); g1.connect(ctx.destination);
    o1.frequency.setValueAtTime(180, ctx.currentTime);
    o1.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.4);
    g1.gain.setValueAtTime(0.2, ctx.currentTime);
    g1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    o1.start(); o1.stop(ctx.currentTime + 0.4);

    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    o2.type = "sine"; o2.connect(g2); g2.connect(ctx.destination);
    o2.frequency.setValueAtTime(800, ctx.currentTime);
    o2.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
    g2.gain.setValueAtTime(0.06, ctx.currentTime);
    g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    o2.start(); o2.stop(ctx.currentTime + 0.2);

    const o3 = ctx.createOscillator();
    const g3 = ctx.createGain();
    o3.type = "sine"; o3.connect(g3); g3.connect(ctx.destination);
    o3.frequency.setValueAtTime(1000, ctx.currentTime + 0.1);
    o3.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.25);
    g3.gain.setValueAtTime(0.04, ctx.currentTime + 0.1);
    g3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    o3.start(ctx.currentTime + 0.1); o3.stop(ctx.currentTime + 0.3);
  } catch { /* silent */ }
};

const playDingSound = () => {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch { /* silent */ }
};

const playLevelUpSound = () => {
  try {
    const ctx = new AudioContext();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.2);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.2);
    });
  } catch { /* silent */ }
};

/* ============================================================
   Helpers
   ============================================================ */
const zombieColors = ["#6b8e5a", "#7a9e68", "#5e8050", "#8aad76", "#68905c"];
const eyeColors = ["#ffffa0", "#ffe880", "#fff0a0"];
const randItem = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const randRange = (min: number, max: number) => Math.random() * (max - min) + min;
const darkenColor = (hex: string, amt: number): string => {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - amt);
  const g = Math.max(0, ((n >> 8) & 0xff) - amt);
  const b = Math.max(0, (n & 0xff) - amt);
  return `rgb(${r},${g},${b})`;
};

let _id = 0;
const nextId = () => ++_id;

const defaultState = (): GameState => ({
  phase: "menu",
  level: 1,
  gold: 0,
  juiced: 0,
  target: LEVELS[0].target,
  ownedWeapons: ["harpoon"],
  currentWeapon: "harpoon",
  badges: [],
  cups: [],
  highestLevel: 0,
});

/* ============================================================
   Save / Load
   ============================================================ */
const saveGame = (s: GameState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch { /* silent */ }
};

const loadGame = (): GameState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch { return null; }
};

/* ============================================================
   Canvas Drawing
   ============================================================ */
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

const drawBackground = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, BG_TOP);
  grad.addColorStop(1, BG_BOTTOM);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(0,0,0,0.04)";
  for (let dx = 24; dx < w; dx += 24) {
    for (let dy = 24; dy < h; dy += 24) {
      ctx.beginPath();
      ctx.arc(dx, dy, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

const drawZombieBody = (
  ctx: CanvasRenderingContext2D, z: Zombie, time: number,
) => {
  ctx.save();
  const cx = z.x + z.w / 2;
  const cy = z.y + z.h / 2;
  const flying = z.state === "flying";

  const wobbleAngle = flying
    ? Math.sin(time * 0.008 + z.wobble) * 0.3
    : Math.sin(time * 0.003 + z.wobble) * 0.08;
  ctx.translate(cx, cy);
  ctx.rotate(wobbleAngle);
  ctx.translate(-cx, -cy);

  // Invisible: flickering alpha
  if (z.isInvisible && z.state === "idle") {
    ctx.globalAlpha = 0.3 + 0.4 * Math.abs(Math.sin(time * 0.005 + z.id));
  }

  const bx = z.x, by = z.y, bw = z.w, bh = z.h;

  // Body
  const bodyGrad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
  bodyGrad.addColorStop(0, z.color);
  bodyGrad.addColorStop(1, darkenColor(z.color, 30));
  ctx.fillStyle = bodyGrad;
  roundRect(ctx, bx + 8, by + 22, bw - 16, bh - 22, 6);
  ctx.fill();

  // Arms
  const armY = by + 30;
  ctx.strokeStyle = z.color;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(bx + 10, armY);
  ctx.bezierCurveTo(bx - 10, armY + 8, bx - 18, armY + 20, bx - 22, armY + 15);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bx + bw - 10, armY);
  ctx.bezierCurveTo(bx + bw + 10, armY + 8, bx + bw + 18, armY + 20, bx + bw + 22, armY + 15);
  ctx.stroke();

  // Head
  const hx = bx + 4, hy = by, hw = bw - 8, hh = 28;
  const headGrad = ctx.createLinearGradient(hx, hy, hx + hw, hy + hh);
  headGrad.addColorStop(0, z.color);
  headGrad.addColorStop(1, darkenColor(z.color, 20));
  ctx.fillStyle = headGrad;
  roundRect(ctx, hx, hy, hw, hh, 10);
  ctx.fill();

  // Head crack + brain
  ctx.strokeStyle = darkenColor(z.color, 50);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(hx + hw * 0.6, hy + 2);
  ctx.lineTo(hx + hw * 0.55, hy + 8);
  ctx.lineTo(hx + hw * 0.65, hy + 12);
  ctx.stroke();
  ctx.fillStyle = "#f0a0b0";
  ctx.beginPath();
  ctx.ellipse(hx + hw * 0.62, hy + 5, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#d08090";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(hx + hw * 0.58, hy + 3);
  ctx.quadraticCurveTo(hx + hw * 0.65, hy + 5, hx + hw * 0.6, hy + 7);
  ctx.stroke();

  // Sutures
  ctx.strokeStyle = "#4a3a2a";
  ctx.lineWidth = 1.2;
  ctx.setLineDash([3, 2]);
  ctx.beginPath();
  ctx.moveTo(hx + hw * 0.3, hy + 2);
  ctx.lineTo(hx + hw * 0.35, hy + 14);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(hx + hw * 0.28, hy + 5);
  ctx.lineTo(hx + hw * 0.38, hy + 5);
  ctx.moveTo(hx + hw * 0.29, hy + 9);
  ctx.lineTo(hx + hw * 0.37, hy + 9);
  ctx.stroke();

  // Blood
  ctx.fillStyle = "rgba(120,20,20,0.4)";
  ctx.beginPath();
  ctx.ellipse(hx + hw * 0.15, hy + 18, 4, 3, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  const eyeY = hy + 12;
  const leX = hx + hw * 0.35;
  const reX = hx + hw * 0.65;
  ctx.fillStyle = "rgba(30,30,20,0.5)";
  ctx.beginPath(); ctx.ellipse(leX, eyeY, 5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(reX, eyeY, 5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = z.eyeColor;
  ctx.beginPath(); ctx.ellipse(leX, eyeY, 3.5, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(reX, eyeY, 3.5, 3, 0, 0, Math.PI * 2); ctx.fill();
  const pAngle = flying ? time * 0.01 : 0;
  const pOff = flying ? 1.2 : 0.5;
  const pColor = flying ? "#ff2020" : "#cc3030";
  ctx.fillStyle = pColor;
  ctx.beginPath();
  ctx.arc(leX + Math.cos(pAngle) * pOff, eyeY + Math.sin(pAngle) * pOff * 0.5, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(reX + Math.cos(pAngle + 0.5) * pOff, eyeY + Math.sin(pAngle + 0.5) * pOff * 0.5, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath(); ctx.arc(leX - 1, eyeY - 1, 0.8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(reX - 1, eyeY - 1, 0.8, 0, Math.PI * 2); ctx.fill();

  // Mouth
  const mY = hy + hh - 3;
  const mX = hx + hw * 0.5;
  if (flying) {
    ctx.fillStyle = "#2a1a0a";
    ctx.beginPath(); ctx.ellipse(mX, mY, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#8a2020";
    ctx.beginPath(); ctx.ellipse(mX, mY, 2.5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.fillStyle = "#2a1a0a";
    ctx.beginPath(); ctx.ellipse(mX, mY, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#e8e0d0";
    ctx.fillRect(mX - 5, mY - 3, 2.5, 2.5);
    ctx.fillRect(mX + 2.5, mY - 3, 2.5, 2.5);
    ctx.fillRect(mX - 3, mY + 1, 2.5, 2.5);
    ctx.fillRect(mX + 1, mY + 1, 2.5, 2.5);
  }

  // Armor shield
  if (z.hasArmor) {
    ctx.fillStyle = "rgba(139,90,43,0.55)";
    ctx.beginPath();
    ctx.moveTo(cx - bw * 0.55, by + 15);
    ctx.lineTo(cx + bw * 0.55, by + 15);
    ctx.lineTo(cx + bw * 0.45, by + bh - 8);
    ctx.lineTo(cx, by + bh + 2);
    ctx.lineTo(cx - bw * 0.45, by + bh - 8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#8b5a2b";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // HP bar (for armor / boss)
  if (z.maxHp > 1) {
    const barW = bw + 10;
    const barH = 5;
    const barX = cx - barW / 2;
    const barY = by - 10;
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    roundRect(ctx, barX, barY, barW, barH, 2);
    ctx.fill();
    ctx.fillStyle = z.hp > z.maxHp * 0.5 ? "#66BB6A" : "#EF5350";
    roundRect(ctx, barX, barY, barW * (z.hp / z.maxHp), barH, 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  ctx.restore();
};

const drawJuicer = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  shaking: boolean, time: number,
) => {
  ctx.save();
  if (shaking) ctx.translate(Math.sin(time * 0.04) * 3, 0);
  const jw = JUICER_W, jh = JUICER_H;

  ctx.fillStyle = "#8b6914";
  roundRect(ctx, x, y + jh - 12, jw, 12, 3);
  ctx.fill();

  const bodyGrad = ctx.createLinearGradient(x, y, x + jw, y + jh);
  bodyGrad.addColorStop(0, "#5a3a1a");
  bodyGrad.addColorStop(0.5, "#6b4520");
  bodyGrad.addColorStop(1, "#4a2a10");
  ctx.fillStyle = bodyGrad;
  roundRect(ctx, x + 10, y + 20, jw - 20, jh - 30, 4);
  ctx.fill();

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

  ctx.fillStyle = "#4a2a10";
  ctx.fillRect(x + jw - 8, y + 40, 8, 6);
  ctx.fillStyle = "#3a1a08";
  ctx.beginPath();
  ctx.moveTo(x + jw, y + 40);
  ctx.lineTo(x + jw + 6, y + 42);
  ctx.lineTo(x + jw, y + 46);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#4a2a10";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 30);
  ctx.quadraticCurveTo(x - 12, y + 40, x + 8, y + 55);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 15, y + 35);
  ctx.lineTo(x + jw - 15, y + 35);
  ctx.stroke();

  ctx.restore();
};

const drawCupIcon = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  // Trapezoid cup
  ctx.fillStyle = "#e8e0d0";
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 16);
  ctx.lineTo(x + 12, y - 16);
  ctx.lineTo(x + 9, y + 8);
  ctx.lineTo(x - 9, y + 8);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#bbb0a0";
  ctx.lineWidth = 1;
  ctx.stroke();
  // Green juice
  ctx.fillStyle = "#66BB6A";
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 6);
  ctx.lineTo(x + 10, y - 6);
  ctx.lineTo(x + 8, y + 6);
  ctx.lineTo(x - 8, y + 6);
  ctx.closePath();
  ctx.fill();
  // Straw
  ctx.strokeStyle = "#e53935";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 3, y - 16);
  ctx.lineTo(x + 6, y - 28);
  ctx.stroke();
};

const drawCustomer = (ctx: CanvasRenderingContext2D, c: Customer, time: number) => {
  ctx.save();
  const sway = Math.sin(time * 0.006 + c.wobble) * 3;
  ctx.translate(c.x, c.y);

  // Legs (walking animation)
  ctx.fillStyle = "#8B4513";
  const legSwing = Math.sin(time * 0.008 + c.wobble) * 4;
  ctx.fillRect(-8 + legSwing, 18, 6, 10);
  ctx.fillRect(2 - legSwing, 18, 6, 10);

  // Body (yellow square)
  ctx.fillStyle = "#FFE135";
  roundRect(ctx, -15, -20 + sway * 0.3, 30, 40, 4);
  ctx.fill();

  // Brown pants
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(-15, 10 + sway * 0.3, 30, 10);

  // White tie
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.moveTo(0, -15 + sway * 0.3);
  ctx.lineTo(4, -5 + sway * 0.3);
  ctx.lineTo(0, 5 + sway * 0.3);
  ctx.lineTo(-4, -5 + sway * 0.3);
  ctx.closePath();
  ctx.fill();

  // Blue eyes
  ctx.fillStyle = "#4FC3F7";
  ctx.beginPath();
  ctx.arc(-6, -8 + sway * 0.3, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(6, -8 + sway * 0.3, 4, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.arc(-5, -8 + sway * 0.3, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(7, -8 + sway * 0.3, 2, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  ctx.strokeStyle = "#e53935";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, -2 + sway * 0.3, 4, 0, Math.PI);
  ctx.stroke();

  ctx.restore();
};

const drawWeaponEffect = (ctx: CanvasRenderingContext2D, e: WeaponEffect) => {
  ctx.save();
  ctx.globalAlpha = Math.min(1, e.life / 15);
  if (e.type === "lightning") {
    ctx.strokeStyle = "#FFD600";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let px = e.x, py = e.y - 30;
    ctx.moveTo(px, py);
    for (let i = 0; i < 5; i++) {
      px += randRange(-12, 12);
      py += 12;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.strokeStyle = "#FFF9C4";
    ctx.lineWidth = 1;
    ctx.stroke();
  } else if (e.type === "net") {
    ctx.strokeStyle = "#8D6E63";
    ctx.lineWidth = 1.5;
    const s = 35;
    for (let i = -s; i <= s; i += 10) {
      ctx.beginPath();
      ctx.moveTo(e.x + i, e.y - s);
      ctx.lineTo(e.x + i * 0.6, e.y + s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.x - s, e.y + i * 0.8);
      ctx.lineTo(e.x + s, e.y + i * 0.8);
      ctx.stroke();
    }
  } else if (e.type === "grenade") {
    const r = 40 * (1 - e.life / 30);
    ctx.strokeStyle = "#FF6F00";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,111,0,0.15)";
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
};

/* ============================================================
   Main Component
   ============================================================ */
const ZombieJuiceGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zombiesRef = useRef<Zombie[]>([]);
  const dropsRef = useRef<JuiceDrop[]>([]);
  const splashRef = useRef<SplashParticle[]>([]);
  const effectsRef = useRef<WeaponEffect[]>([]);
  const customersRef = useRef<Customer[]>([]);
  const animRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const dropTimerRef = useRef(0);
  const shakeRef = useRef(0);
  const customerTimerRef = useRef(0);
  const cupIdRef = useRef(0);

  const [state, setState] = useState<GameState>(defaultState);
  const [showWeaponPanel, setShowWeaponPanel] = useState(false);
  const [newBadge, setNewBadge] = useState<BadgeInfo | null>(null);
  const [canvasH, setCanvasH] = useState(CANVAS_H_DESKTOP);

  // Load saved game
  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      saved.phase = "menu";
      saved.juiced = 0;
      saved.cups = [];
      setState(saved);
    }
  }, []);

  // Responsive canvas
  useEffect(() => {
    const check = () => setCanvasH(window.innerWidth < 640 ? CANVAS_H_MOBILE : CANVAS_H_DESKTOP);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const stateRef = useRef(state);
  stateRef.current = state;

  // Spawn zombie based on level
  const createZombie = useCallback((cw: number, ch: number, level: number): Zombie => {
    const ld = LEVELS[level - 1];
    const isSmall = level >= 6 && Math.random() < 0.35;
    const isInvisible = level >= 9 && Math.random() < 0.3;
    const hasArmor = level >= 8 && Math.random() < 0.4;
    const isBoss = level === 10 && zombiesRef.current.filter(z => z.isBoss && z.state === "idle").length === 0 && Math.random() < 0.08;
    const isFast = level >= 3 && Math.random() < 0.25;
    const canDodge = level >= 5 && Math.random() < 0.3;

    const scale = isBoss ? 2.0 : isSmall ? 0.7 : 1.0;
    const w = ZOMBIE_W * scale;
    const h = ZOMBIE_H * scale;
    const speedMul = isFast ? 1.6 : 1.0;

    return {
      id: nextId(),
      x: randRange(ZOMBIE_W, cw - ZOMBIE_W - JUICER_W - 40),
      y: randRange(20, ch * 0.5),
      w, h,
      vx: randRange(-0.3, 0.3) * ld.speed * speedMul,
      vy: 0,
      state: "idle",
      color: randItem(zombieColors),
      eyeColor: randItem(eyeColors),
      wobble: randRange(0, Math.PI * 2),
      targetX: 0,
      targetY: 0,
      hp: isBoss ? 5 : hasArmor ? 2 : 1,
      maxHp: isBoss ? 5 : hasArmor ? 2 : 1,
      isSmall, isInvisible, hasArmor, isBoss,
      dodgeDir: canDodge ? (Math.random() > 0.5 ? 1 : -1) : 0,
      dodgeCooldown: canDodge ? randRange(40, 100) : 0,
    };
  }, []);

  // Spawn splash
  const spawnSplash = useCallback((jx: number, jy: number) => {
    const colors = ["#4CAF50", "#66BB6A", "#81C784", "#A5D6A7", "#388E3C"];
    for (let i = 0; i < 12; i++) {
      const angle = randRange(0, Math.PI * 2);
      const speed = randRange(1.5, 4);
      splashRef.current.push({
        x: jx + JUICER_W / 2, y: jy + 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        r: randRange(2, 5),
        life: randRange(25, 45),
        color: randItem(colors),
      });
    }
  }, []);

  // Handle weapon hit
  const hitZombie = useCallback((z: Zombie, cw: number, ch: number) => {
    z.hp -= 1;
    if (z.hp <= 0) {
      z.state = "flying";
      const jx = cw - JUICER_W - 20;
      const jy = ch - JUICER_H - 10;
      z.targetX = jx + JUICER_W / 2 - z.w / 2;
      z.targetY = jy + 10;
      playClickSound();
    } else {
      playClickSound();
    }
  }, []);

  // Handle click/tap
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (stateRef.current.phase !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    const cw = canvas.width, ch = canvas.height;
    const weapon = stateRef.current.currentWeapon;

    if (weapon === "harpoon") {
      for (let i = zombiesRef.current.length - 1; i >= 0; i--) {
        const z = zombiesRef.current[i];
        if (z.state !== "idle") continue;
        if (mx >= z.x && mx <= z.x + z.w && my >= z.y && my <= z.y + z.h) {
          hitZombie(z, cw, ch);
          break;
        }
      }
    } else if (weapon === "lightning") {
      let hit = 0;
      const sorted = zombiesRef.current
        .filter(z => z.state === "idle")
        .map(z => ({ z, d: Math.hypot(mx - (z.x + z.w / 2), my - (z.y + z.h / 2)) }))
        .sort((a, b) => a.d - b.d);
      for (const { z } of sorted) {
        if (hit >= 2) break;
        hitZombie(z, cw, ch);
        hit++;
      }
      if (hit > 0) {
        effectsRef.current.push({ type: "lightning", x: mx, y: my, life: 25 });
      }
    } else if (weapon === "net") {
      for (let i = zombiesRef.current.length - 1; i >= 0; i--) {
        const z = zombiesRef.current[i];
        if (z.state !== "idle") continue;
        const d = Math.hypot(mx - (z.x + z.w / 2), my - (z.y + z.h / 2));
        if (d < 50) {
          // Net auto-captures: slow zombies get instant kill
          if (z.maxHp <= 2) {
            z.hp = 0;
          } else {
            z.hp = Math.max(1, z.hp - 2);
          }
          if (z.hp <= 0) {
            z.state = "flying";
            const jx = cw - JUICER_W - 20;
            const jy = ch - JUICER_H - 10;
            z.targetX = jx + JUICER_W / 2 - z.w / 2;
            z.targetY = jy + 10;
          }
          effectsRef.current.push({ type: "net", x: z.x + z.w / 2, y: z.y + z.h / 2, life: 20 });
          playClickSound();
          break;
        }
      }
    } else if (weapon === "grenade") {
      let hit = 0;
      const sorted = zombiesRef.current
        .filter(z => z.state === "idle")
        .map(z => ({ z, d: Math.hypot(mx - (z.x + z.w / 2), my - (z.y + z.h / 2)) }))
        .sort((a, b) => a.d - b.d);
      for (const { z } of sorted) {
        if (hit >= 3) break;
        const d = Math.hypot(mx - (z.x + z.w / 2), my - (z.y + z.h / 2));
        if (d < 80) {
          hitZombie(z, cw, ch);
          hit++;
        }
      }
      effectsRef.current.push({ type: "grenade", x: mx, y: my, life: 30 });
      playClickSound();
    }
  }, [hitZombie]);

  // Check level completion
  const checkLevelComplete = useCallback((juiced: number, target: number, level: number, gold: number, badges: number[]) => {
    if (juiced >= target) {
      const reward = LEVELS[level - 1].reward;
      const newGold = gold + reward;
      const newBadges = badges.includes(level) ? [...badges] : [...badges, level];
      const newHighest = Math.max(stateRef.current.highestLevel, level);

      if (level >= 10) {
        playLevelUpSound();
        setState(prev => ({
          ...prev,
          phase: "allClear",
          gold: newGold,
          badges: newBadges,
          highestLevel: newHighest,
        }));
        saveGame({ ...stateRef.current, phase: "allClear", gold: newGold, badges: newBadges, highestLevel: newHighest });
      } else {
        playLevelUpSound();
        setState(prev => ({
          ...prev,
          phase: "levelComplete",
          gold: newGold,
          badges: newBadges,
          highestLevel: newHighest,
        }));
        saveGame({ ...stateRef.current, phase: "levelComplete", gold: newGold, badges: newBadges, highestLevel: newHighest });
      }

      // Show badge
      const badge = BADGES[level - 1];
      if (!badges.includes(level)) {
        setNewBadge(badge);
        setTimeout(() => setNewBadge(null), 3000);
      }
      return true;
    }
    return false;
  }, []);

  // Main game loop
  const gameLoop = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    const st = stateRef.current;

    ctx.clearRect(0, 0, w, h);
    drawBackground(ctx, w, h);

    const jx = w - JUICER_W - 20;
    const jy = h - JUICER_H - 10;

    if (st.phase === "playing") {
      const ld = LEVELS[st.level - 1];

      // Spawn zombies
      const interval = Math.max(600, 1800 - st.juiced * 12);
      if (timestamp - lastSpawnRef.current >= interval) {
        if (zombiesRef.current.filter(z => z.state === "idle").length < MAX_ZOMBIES) {
          zombiesRef.current.push(createZombie(w, h, st.level));
        }
        lastSpawnRef.current = timestamp;
      }

      // Update zombies
      let newJuiced = st.juiced;
      for (const z of zombiesRef.current) {
        if (z.state === "idle") {
          z.wobble += 0.02;
          z.x += Math.sin(z.wobble) * 0.3 + z.vx;
          z.y += z.vy;

          // Dodge
          if (z.dodgeDir !== 0) {
            z.dodgeCooldown -= 1;
            if (z.dodgeCooldown <= 0) {
              z.x += z.dodgeDir * randRange(8, 16);
              z.dodgeDir *= -1;
              z.dodgeCooldown = randRange(40, 100);
            }
          }

          if (z.x < 10) { z.x = 10; z.vx *= -1; }
          if (z.x > w - z.w - JUICER_W - 10) { z.x = w - z.w - JUICER_W - 10; z.vx *= -1; }
          if (z.y < 10) { z.y = 10; z.vy *= -1; }
          if (z.y > h * 0.55) { z.y = h * 0.55; z.vy *= -1; }
        } else if (z.state === "flying") {
          const dx = z.targetX - (z.x + z.w / 2);
          const dy = z.targetY - (z.y + z.h / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 15) {
            z.state = "done";
            newJuiced += 1;
            shakeRef.current = 20;
            spawnSplash(jx, jy);
            playJuiceSound();

            // Add cup
            const cups = [...stateRef.current.cups];
            if (cups.length < MAX_CUPS) {
              const isRare = z.isSmall || z.isInvisible || z.hasArmor || z.isBoss;
              cups.push({ id: cupIdRef.current++, type: isRare ? "rare" : "normal" });
              setState(prev => ({ ...prev, cups }));
            }
          } else {
            const speed = 8;
            z.x += (dx / dist) * speed;
            z.y += (dy / dist) * speed;
          }
        }
      }

      zombiesRef.current = zombiesRef.current.filter(z => z.state !== "done");

      if (newJuiced !== st.juiced) {
        setState(prev => {
          const updated = { ...prev, juiced: newJuiced };
          checkLevelComplete(newJuiced, updated.target, updated.level, updated.gold, updated.badges);
          return updated;
        });
      }

      // Spawn customers
      customerTimerRef.current += 1;
      const customerInterval = Math.max(120, 300 - st.juiced * 5);
      if (customerTimerRef.current >= customerInterval && stateRef.current.cups.length > 0 && customersRef.current.length < 3) {
        customerTimerRef.current = 0;
        customersRef.current.push({
          id: nextId(),
          x: -40,
          y: h - 30,
          state: "walking_in",
          wobble: randRange(0, Math.PI * 2),
        });
      }

      // Update customers
      let earnedGold = 0;
      const counterX = w - JUICER_W - 60;
      for (const c of customersRef.current) {
        if (c.state === "walking_in") {
          c.x += 1.2;
          if (c.x >= counterX) {
            c.state = "buying";
            c.x = counterX;
          }
        } else if (c.state === "buying") {
          // Auto-buy after a short delay
          c.wobble += 0.05;
          if (c.wobble > Math.PI * 2) {
            c.state = "walking_out";
            const cups = [...stateRef.current.cups];
            if (cups.length > 0) {
              const sold = cups.shift()!;
              earnedGold += sold.type === "rare" ? 10 : 5;
              playDingSound();
              setState(prev => ({ ...prev, cups, gold: prev.gold + earnedGold }));
            }
          }
        } else if (c.state === "walking_out") {
          c.x -= 1.5;
        }
      }
      customersRef.current = customersRef.current.filter(c => c.x > -60 || c.state !== "walking_out");

      // Juice drops from spout
      if (st.juiced > 0) {
        dropTimerRef.current++;
        if (dropTimerRef.current > 8) {
          dropTimerRef.current = 0;
          dropsRef.current.push({
            x: jx + JUICER_W + 6, y: jy + 44,
            vy: randRange(0.5, 1.5),
            r: randRange(2, 4),
            color: randItem(["#4CAF50", "#66BB6A", "#81C784"]),
            life: randRange(40, 70),
          });
        }
      }
    }

    // Draw idle zombies
    for (const z of zombiesRef.current) {
      if (z.state === "idle") drawZombieBody(ctx, z, timestamp);
    }
    // Draw flying zombies
    for (const z of zombiesRef.current) {
      if (z.state === "flying") drawZombieBody(ctx, z, timestamp);
    }

    // Draw juicer
    const isShaking = shakeRef.current > 0;
    if (shakeRef.current > 0) shakeRef.current--;
    drawJuicer(ctx, jx, jy, isShaking, timestamp);

    // Draw drops
    for (const d of dropsRef.current) {
      d.y += d.vy; d.life -= 1;
      ctx.globalAlpha = Math.min(1, d.life / 30);
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    dropsRef.current = dropsRef.current.filter(d => d.life > 0 && d.y < h);

    // Draw splash
    for (const p of splashRef.current) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life -= 1;
      ctx.globalAlpha = Math.min(1, p.life / 25);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    splashRef.current = splashRef.current.filter(p => p.life > 0);

    // Draw weapon effects
    for (const e of effectsRef.current) {
      e.life -= 1;
      drawWeaponEffect(ctx, e);
    }
    effectsRef.current = effectsRef.current.filter(e => e.life > 0);

    // Draw customers
    for (const c of customersRef.current) {
      drawCustomer(ctx, c, timestamp);
    }

    animRef.current = requestAnimationFrame(gameLoop);
  }, [createZombie, spawnSplash, checkLevelComplete]);

  // Start/stop loop
  useEffect(() => {
    animRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animRef.current);
  }, [gameLoop]);

  // Start level
  const startLevel = useCallback((level: number) => {
    zombiesRef.current = [];
    dropsRef.current = [];
    splashRef.current = [];
    effectsRef.current = [];
    customersRef.current = [];
    customerTimerRef.current = 0;
    dropTimerRef.current = 0;
    shakeRef.current = 0;
    lastSpawnRef.current = performance.now();

    const newState: GameState = {
      ...stateRef.current,
      phase: "playing",
      level,
      juiced: 0,
      target: LEVELS[level - 1].target,
      cups: [],
    };
    setState(newState);
    saveGame(newState);
  }, []);

  const handleStart = useCallback(() => {
    startLevel(stateRef.current.highestLevel > 0 ? 1 : 1);
  }, [startLevel]);

  const handleNextLevel = useCallback(() => {
    const nextLvl = Math.min(stateRef.current.level + 1, 10);
    startLevel(nextLvl);
  }, [startLevel]);

  // Buy weapon
  const buyWeapon = useCallback((weaponId: string) => {
    const wp = WEAPONS.find(w => w.id === weaponId);
    if (!wp) return;
    const st = stateRef.current;
    if (st.gold < wp.price) return;
    if (st.ownedWeapons.includes(weaponId)) {
      setState(prev => ({ ...prev, currentWeapon: weaponId }));
      setShowWeaponPanel(false);
      saveGame({ ...stateRef.current, currentWeapon: weaponId });
      return;
    }
    const newState: GameState = {
      ...st,
      gold: st.gold - wp.price,
      ownedWeapons: [...st.ownedWeapons, weaponId],
      currentWeapon: weaponId,
    };
    setState(newState);
    saveGame(newState);
    setShowWeaponPanel(false);
  }, []);

  const currentWeaponDef = WEAPONS.find(w => w.id === state.currentWeapon);

  return (
    <div className="sr-zj-wrapper">
      {/* HUD */}
      {state.phase === "playing" && (
        <div className="sr-zj-hud">
          <span className="sr-zj-hud-item">
            <span className="sr-zj-hud-label">关卡</span>
            <span className="sr-zj-hud-value">{state.level}/10</span>
          </span>
          <span className="sr-zj-hud-item">
            <span className="sr-zj-hud-label">金币</span>
            <span className="sr-zj-hud-value" style={{ color: "#F9A825" }}>{state.gold}</span>
          </span>
          <span className="sr-zj-hud-item">
            <span className="sr-zj-hud-label">进度</span>
            <span className="sr-zj-hud-value">{state.juiced}/{state.target}</span>
          </span>
          <span className="sr-zj-hud-item">
            <span className="sr-zj-hud-label">武器</span>
            <span className="sr-zj-hud-value">{currentWeaponDef?.name || "-"}</span>
          </span>
        </div>
      )}

      {/* Canvas */}
      <div className="sr-zj-canvas-container">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={canvasH}
          onPointerDown={handlePointerDown}
          className="sr-zj-canvas"
          style={{ touchAction: "none" }}
        />

        {/* Menu overlay */}
        <AnimatePresence>
          {state.phase === "menu" && (
            <motion.div
              className="sr-zj-overlay"
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="sr-zj-overlay-card">
                <div className="sr-zj-title">ZombieJuice</div>
                <div className="sr-zj-subtitle">僵尸榨汁机</div>
                <button className="sr-zj-btn" onClick={handleStart}>
                  {state.highestLevel > 0 ? `继续 (最高关卡 ${state.highestLevel})` : "开始游戏"}
                </button>
                {state.highestLevel > 0 && (
                  <button className="sr-zj-btn sr-zj-btn-secondary" onClick={() => startLevel(1)}>
                    从第1关开始
                  </button>
                )}
                {state.badges.length > 0 && (
                  <div className="sr-zj-badge-row">
                    {BADGES.filter(b => state.badges.includes(b.level)).map(b => (
                      <span key={b.level} className="sr-zj-badge-icon" title={b.name}>{b.icon}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level complete overlay */}
        <AnimatePresence>
          {state.phase === "levelComplete" && (
            <motion.div
              className="sr-zj-overlay"
              key="levelComplete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="sr-zj-overlay-card"
                initial={{ scale: 0.7, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 18, stiffness: 260 }}
              >
                <div className="sr-zj-complete-title">关卡 {state.level} 通过!</div>
                <div className="sr-zj-reward">+{LEVELS[state.level - 1].reward} 金币</div>
                <button className="sr-zj-btn" onClick={handleNextLevel}>
                  下一关
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* All clear overlay */}
        <AnimatePresence>
          {state.phase === "allClear" && (
            <motion.div
              className="sr-zj-overlay"
              key="allClear"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="sr-zj-overlay-card"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 200 }}
              >
                <div className="sr-zj-complete-title">全部通关!</div>
                <div className="sr-zj-subtitle">你是终极榨神</div>
                <div className="sr-zj-badge-row">
                  {BADGES.filter(b => state.badges.includes(b.level)).map(b => (
                    <span key={b.level} className="sr-zj-badge-icon" title={b.name}>{b.icon}</span>
                  ))}
                </div>
                <button className="sr-zj-btn" onClick={() => {
                  setState(prev => ({ ...prev, phase: "menu" }));
                }}>
                  返回主菜单
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cups + Customers area */}
      {state.phase === "playing" && (
        <div className="sr-zj-bottom-area">
          <div className="sr-zj-cups-row">
            <span className="sr-zj-cups-label">杯子:</span>
            {state.cups.length === 0 && <span className="sr-zj-cups-empty">等待榨汁...</span>}
            {state.cups.map(c => (
              <span key={c.id} className="sr-zj-cup-item" title={c.type === "rare" ? "稀有果汁 10金" : "普通果汁 5金"}>
                {c.type === "rare" ? "\u2728" : ""}🧃
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Weapon bar */}
      {state.phase === "playing" && (
        <div className="sr-zj-weapon-bar">
          <div className="sr-zj-gold-display">金币: {state.gold}</div>
          <div className="sr-zj-weapon-selector" style={{ position: "relative" }}>
            <button
              className="sr-zj-weapon-btn"
              onClick={() => setShowWeaponPanel(prev => !prev)}
            >
              {currentWeaponDef?.name || "武器"}
              <span className="sr-zj-weapon-arrow">{showWeaponPanel ? "\u25B2" : "\u25BC"}</span>
            </button>
            <AnimatePresence>
              {showWeaponPanel && (
                <motion.div
                  className="sr-zj-weapon-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                >
                  {WEAPONS.map(wp => {
                    const owned = state.ownedWeapons.includes(wp.id);
                    const unlocked = state.level >= wp.unlockLevel;
                    const canAfford = state.gold >= wp.price;
                    const active = state.currentWeapon === wp.id;
                    const disabled = !unlocked || (!owned && !canAfford);

                    return (
                      <button
                        key={wp.id}
                        className={`sr-zj-wp-item ${active ? "sr-zj-wp-active" : ""} ${disabled ? "sr-zj-wp-disabled" : ""}`}
                        onClick={() => {
                          if (!disabled) buyWeapon(wp.id);
                        }}
                      >
                        <span className="sr-zj-wp-name">
                          {wp.name}
                          {active && " (当前)"}
                        </span>
                        <span className="sr-zj-wp-info">
                          {!unlocked ? `关卡${wp.unlockLevel}解锁` :
                            owned ? "已拥有" : `${wp.price}金`}
                        </span>
                        <span className="sr-zj-wp-desc">{wp.description}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Badge notification */}
      <AnimatePresence>
        {newBadge && (
          <motion.div
            className="sr-zj-achievement"
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <span className="sr-zj-achievement-icon">{newBadge.icon}</span>
            <span className="sr-zj-achievement-label">{newBadge.name}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS */}
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
          max-width: 600px;
          display: flex;
          justify-content: space-around;
          gap: 8px;
          margin-bottom: 6px;
          padding: 6px 12px;
          background: rgba(255,255,255,0.7);
          border-radius: 10px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .sr-zj-hud-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
          color: #3a3a3a;
        }
        .sr-zj-hud-label {
          color: #8a8a8a;
          font-weight: 400;
          font-size: 12px;
        }
        .sr-zj-hud-value {
          color: #4a7a3a;
          font-size: 15px;
          font-weight: 700;
          min-width: 20px;
          text-align: center;
        }
        .sr-zj-canvas-container {
          position: relative;
          width: 100%;
          max-width: 600px;
        }
        .sr-zj-canvas {
          width: 100%;
          height: ${canvasH}px;
          border-radius: 12px;
          cursor: crosshair;
          display: block;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .sr-zj-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(240,242,236,0.88);
          border-radius: 12px;
          z-index: 20;
        }
        .sr-zj-overlay-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 28px 36px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .sr-zj-title {
          font-size: 28px;
          font-weight: 800;
          color: #3a3a3a;
          letter-spacing: -0.5px;
        }
        .sr-zj-subtitle {
          font-size: 14px;
          color: #8a8a8a;
        }
        .sr-zj-complete-title {
          font-size: 22px;
          font-weight: 700;
          color: #4a7a3a;
        }
        .sr-zj-reward {
          font-size: 16px;
          color: #F9A825;
          font-weight: 600;
        }
        .sr-zj-btn {
          padding: 10px 32px;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #4a7a3a, #6b8e5a);
          border: none;
          border-radius: 20px;
          cursor: pointer;
          box-shadow: 0 3px 12px rgba(74,122,58,0.3);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .sr-zj-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 5px 16px rgba(74,122,58,0.4);
        }
        .sr-zj-btn:active {
          transform: scale(0.97);
        }
        .sr-zj-btn-secondary {
          background: linear-gradient(135deg, #8a8a8a, #aaa);
          box-shadow: 0 3px 12px rgba(0,0,0,0.1);
          font-size: 14px;
          padding: 8px 24px;
        }
        .sr-zj-badge-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 4px;
        }
        .sr-zj-badge-icon {
          font-size: 24px;
          cursor: default;
        }
        .sr-zj-bottom-area {
          width: 100%;
          max-width: 600px;
          margin-top: 6px;
          padding: 6px 12px;
          background: rgba(255,255,255,0.6);
          border-radius: 10px;
          min-height: 36px;
        }
        .sr-zj-cups-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #5a5a5a;
        }
        .sr-zj-cups-label {
          font-weight: 600;
          color: #3a3a3a;
        }
        .sr-zj-cups-empty {
          color: #bbb;
          font-style: italic;
          font-size: 12px;
        }
        .sr-zj-cup-item {
          font-size: 20px;
          line-height: 1;
        }
        .sr-zj-weapon-bar {
          width: 100%;
          max-width: 600px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          padding: 0 4px;
        }
        .sr-zj-gold-display {
          font-size: 14px;
          font-weight: 700;
          color: #F9A825;
          background: rgba(249,168,37,0.1);
          padding: 4px 12px;
          border-radius: 12px;
        }
        .sr-zj-weapon-selector {
          position: relative;
        }
        .sr-zj-weapon-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          font-size: 13px;
          font-weight: 600;
          color: #3a3a3a;
          background: #fff;
          border: 1.5px solid #ddd;
          border-radius: 14px;
          cursor: pointer;
          transition: border-color 0.15s;
        }
        .sr-zj-weapon-btn:hover {
          border-color: #4a7a3a;
        }
        .sr-zj-weapon-arrow {
          font-size: 10px;
          color: #aaa;
        }
        .sr-zj-weapon-panel {
          position: absolute;
          bottom: calc(100% + 6px);
          right: 0;
          width: 240px;
          background: #fff;
          border: 1.5px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          padding: 6px;
          z-index: 30;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sr-zj-wp-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1px;
          padding: 8px 10px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          background: transparent;
          text-align: left;
          transition: background 0.12s;
        }
        .sr-zj-wp-item:hover:not(.sr-zj-wp-disabled) {
          background: #f0f4ee;
        }
        .sr-zj-wp-active {
          background: #e8f0e4;
        }
        .sr-zj-wp-disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .sr-zj-wp-name {
          font-size: 13px;
          font-weight: 700;
          color: #3a3a3a;
        }
        .sr-zj-wp-info {
          font-size: 11px;
          color: #F9A825;
          font-weight: 600;
        }
        .sr-zj-wp-desc {
          font-size: 11px;
          color: #999;
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