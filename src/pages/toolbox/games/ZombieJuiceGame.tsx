import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ZombieJuice - 僵尸榨汁机
 *
 * 美漫扁平风 Canvas 塔防经营游戏。
 * 20关、4种武器、杯子售卖、比奇堡居民、武器墙、徽章墙。
 * 三区域布局：榨僵尸区 | 榨汁装杯区 | 商店区
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
  customerType: string;
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

interface CustomerType {
  id: string;
  name: string;
  bodyColor: string;
  eyeColor: string;
  pantsColor: string;
  shape: "square" | "star" | "tall" | "round";
  accessory: string;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  life: number;
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
  { target: 45, speed: SPEED_VERY_FAST, reward: 900, description: "连续2只护甲僵尸" },
  { target: 50, speed: SPEED_VERY_FAST, reward: 1000, description: "全体加速50%" },
  { target: 55, speed: SPEED_VERY_FAST, reward: 1100, description: "僵尸更小（极难点击）" },
  { target: 60, speed: SPEED_VERY_FAST, reward: 1200, description: "护甲与隐身混合出现" },
  { target: 65, speed: SPEED_VERY_FAST, reward: 1300, description: "僵尸反向移动" },
  { target: 70, speed: SPEED_VERY_FAST, reward: 1400, description: "随机位置闪烁出现" },
  { target: 75, speed: SPEED_VERY_FAST, reward: 1500, description: "大小僵尸混合" },
  { target: 80, speed: SPEED_VERY_FAST, reward: 1600, description: "僵尸死亡分裂" },
  { target: 90, speed: SPEED_VERY_FAST, reward: 1800, description: "极限隐身关卡" },
  { target: 100, speed: SPEED_VERY_FAST, reward: 2000, description: "终极BOSS，需10次点击" },
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
  { level: 11, name: "钢铁粉碎者", icon: "\u{1F528}" },
  { level: 12, name: "疾风迅雷", icon: "\u{1F32A}" },
  { level: 13, name: "鹰眼射手", icon: "\u{1F441}" },
  { level: 14, name: "幻影猎杀者", icon: "\u{1F300}" },
  { level: 15, name: "逆流勇士", icon: "\u{1F504}" },
  { level: 16, name: "瞬影捕手", icon: "\u2728" },
  { level: 17, name: "万物制衡", icon: "\u2696" },
  { level: 18, name: "分裂终结者", icon: "\u2694" },
  { level: 19, name: "虚空行者", icon: "\u{1F311}" },
  { level: 20, name: "不灭传说", icon: "\u{1F451}" },
];

const CUSTOMER_TYPES: CustomerType[] = [
  { id: "spongebob", name: "海绵宝宝", bodyColor: "#FFE135", eyeColor: "#4FC3F7", pantsColor: "#8B4513", shape: "square", accessory: "白色领带" },
  { id: "patrick", name: "派大星", bodyColor: "#FF69B4", eyeColor: "#FFFFFF", pantsColor: "#4CAF50", shape: "star", accessory: "绿底短裤" },
  { id: "squidward", name: "章鱼哥", bodyColor: "#7EC8A0", eyeColor: "#8B0000", pantsColor: "#6B4226", shape: "tall", accessory: "长鼻子" },
  { id: "krabs", name: "蟹老板", bodyColor: "#E53935", eyeColor: "#FFFFFF", pantsColor: "#4A90D9", shape: "round", accessory: "大钳子钱袋" },
  { id: "sandy", name: "珊迪", bodyColor: "#8D6E63", eyeColor: "#212121", pantsColor: "#5D4037", shape: "square", accessory: "绿色头盔尾巴" },
];

const WEAPON_EMOJI: Record<string, string> = {
  harpoon: "\u{1F3AF}",
  lightning: "\u26A1",
  net: "\u{1F578}",
  grenade: "\u{1F4A3}",
};

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

/* Draw dashed separator line between left (zombie area) and right (juicer area) */
const drawSeparator = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const sepX = w - JUICER_W - 50;
  ctx.save();
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(sepX, 8);
  ctx.lineTo(sepX, h - 8);
  ctx.stroke();
  ctx.setLineDash([]);
  // Labels
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.font = "10px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("榨僵尸区", sepX / 2, 16);
  ctx.fillText("榨汁装杯区", sepX + (w - sepX) / 2, 16);
  ctx.restore();
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

const drawCustomerType = (ctx: CanvasRenderingContext2D, c: Customer, time: number) => {
  ctx.save();
  const sway = Math.sin(time * 0.006 + c.wobble) * 3;
  ctx.translate(c.x, c.y);

  const ct = CUSTOMER_TYPES.find(t => t.id === c.customerType) || CUSTOMER_TYPES[0];

  // Legs (walking animation)
  const legSwing = Math.sin(time * 0.008 + c.wobble) * 4;
  ctx.fillStyle = "#555";
  ctx.fillRect(-8 + legSwing, 18, 6, 10);
  ctx.fillRect(2 - legSwing, 18, 6, 10);

  if (ct.shape === "star") {
    // Patrick: star shape
    drawStarShape(ctx, 0, 0 + sway * 0.3, 18, ct.bodyColor);
    // Green shorts
    ctx.fillStyle = ct.pantsColor;
    ctx.fillRect(-15, 10 + sway * 0.3, 30, 10);
    // Dopey eyes (different sizes)
    ctx.fillStyle = ct.eyeColor;
    ctx.beginPath();
    ctx.arc(-8, -8 + sway * 0.3, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(6, -6 + sway * 0.3, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(-7, -9 + sway * 0.3, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7, -7 + sway * 0.3, 1.5, 0, Math.PI * 2);
    ctx.fill();
    // Mouth: dopey smile
    ctx.strokeStyle = "#d32f2f";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(1, -1 + sway * 0.3, 5, 0.2, Math.PI - 0.2);
    ctx.stroke();
  } else if (ct.shape === "tall") {
    // Squidward: tall blue-green
    ctx.fillStyle = ct.bodyColor;
    roundRect(ctx, -12, -30 + sway * 0.3, 24, 55, 5);
    ctx.fill();
    // Brown pants
    ctx.fillStyle = ct.pantsColor;
    ctx.fillRect(-12, 15 + sway * 0.3, 24, 12);
    // Long nose
    ctx.fillStyle = ct.bodyColor;
    ctx.beginPath();
    ctx.moveTo(0, -10 + sway * 0.3);
    ctx.lineTo(16, 0 + sway * 0.3);
    ctx.lineTo(0, 2 + sway * 0.3);
    ctx.closePath();
    ctx.fill();
    // Tired eyes (half-closed)
    ctx.fillStyle = ct.eyeColor;
    ctx.beginPath();
    ctx.ellipse(-5, -16 + sway * 0.3, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(5, -16 + sway * 0.3, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(-4, -16 + sway * 0.3, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(6, -16 + sway * 0.3, 1.5, 0, Math.PI * 2);
    ctx.fill();
    // Half-closed eyelids
    ctx.fillStyle = ct.bodyColor;
    ctx.fillRect(-9, -20 + sway * 0.3, 8, 4);
    ctx.fillRect(1, -20 + sway * 0.3, 8, 4);
    // Mouth: frown
    ctx.strokeStyle = "#4a2a0a";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -4 + sway * 0.3, 4, Math.PI, 0);
    ctx.stroke();
  } else if (ct.shape === "round") {
    // Mr. Krabs: round/square red body
    ctx.fillStyle = ct.bodyColor;
    roundRect(ctx, -15, -18 + sway * 0.3, 30, 38, 8);
    ctx.fill();
    // Blue pants
    ctx.fillStyle = ct.pantsColor;
    ctx.fillRect(-15, 10 + sway * 0.3, 30, 10);
    // Big claws
    ctx.fillStyle = ct.bodyColor;
    ctx.beginPath();
    ctx.ellipse(-20, 2 + sway * 0.3, 10, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(20, 2 + sway * 0.3, 10, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Money bag
    ctx.fillStyle = "#F9A825";
    ctx.beginPath();
    ctx.ellipse(0, 20 + sway * 0.3, 7, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#F57F17";
    ctx.font = "bold 8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("$", 0, 23 + sway * 0.3);
    // Eyes
    ctx.fillStyle = ct.eyeColor;
    ctx.beginPath();
    ctx.arc(-6, -8 + sway * 0.3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(6, -8 + sway * 0.3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(-5, -8 + sway * 0.3, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7, -8 + sway * 0.3, 2, 0, Math.PI * 2);
    ctx.fill();
    // Mouth: greedy grin
    ctx.strokeStyle = "#6d0000";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -2 + sway * 0.3, 5, 0.1, Math.PI - 0.1);
    ctx.stroke();
  } else if (ct.id === "sandy") {
    // Sandy: brown square with green helmet and squirrel tail
    ctx.fillStyle = ct.bodyColor;
    roundRect(ctx, -14, -18 + sway * 0.3, 28, 38, 4);
    ctx.fill();
    // Brown pants
    ctx.fillStyle = ct.pantsColor;
    ctx.fillRect(-14, 10 + sway * 0.3, 28, 10);
    // Green helmet
    ctx.fillStyle = "#4CAF50";
    ctx.beginPath();
    ctx.ellipse(0, -20 + sway * 0.3, 14, 10, 0, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = "#2E7D32";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Squirrel tail
    ctx.fillStyle = ct.bodyColor;
    ctx.beginPath();
    ctx.moveTo(14, -5 + sway * 0.3);
    ctx.quadraticCurveTo(28, -10 + sway * 0.3, 26, 5 + sway * 0.3);
    ctx.quadraticCurveTo(20, 0 + sway * 0.3, 14, 5 + sway * 0.3);
    ctx.fill();
    // Eyes
    ctx.fillStyle = ct.eyeColor;
    ctx.beginPath();
    ctx.arc(-6, -8 + sway * 0.3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(6, -8 + sway * 0.3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(-5, -8 + sway * 0.3, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7, -8 + sway * 0.3, 2, 0, Math.PI * 2);
    ctx.fill();
    // Mouth: smile
    ctx.strokeStyle = "#4a2a0a";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -2 + sway * 0.3, 4, 0.1, Math.PI - 0.1);
    ctx.stroke();
  } else {
    // SpongeBob: yellow square
    ctx.fillStyle = ct.bodyColor;
    roundRect(ctx, -15, -20 + sway * 0.3, 30, 40, 4);
    ctx.fill();
    // Brown pants
    ctx.fillStyle = ct.pantsColor;
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
    ctx.fillStyle = ct.eyeColor;
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
    // Mouth: smile
    ctx.strokeStyle = "#e53935";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -2 + sway * 0.3, 4, 0, Math.PI);
    ctx.stroke();
  }

  ctx.restore();
};

/* Draw a star shape for Patrick */
const drawStarShape = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) => {
  const spikes = 5;
  const outerR = r;
  const innerR = r * 0.45;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darkenColor(color, 40);
  ctx.lineWidth = 1;
  ctx.stroke();
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
  const [showWeaponWall, setShowWeaponWall] = useState(false);
  const [showBadgeWall, setShowBadgeWall] = useState(false);
  const [newBadge, setNewBadge] = useState<BadgeInfo | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
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
    const isBoss = (level === 10 || level === 20) && zombiesRef.current.filter(z => z.isBoss && z.state === "idle").length === 0 && Math.random() < 0.08;
    const isFast = level >= 3 && Math.random() < 0.25;
    const canDodge = level >= 5 && Math.random() < 0.3;

    const scale = isBoss ? 2.0 : isSmall ? 0.7 : 1.0;
    const w = ZOMBIE_W * scale;
    const h = ZOMBIE_H * scale;
    const speedMul = isFast ? 1.6 : 1.0;

    // Limiting zombies to the left area (before separator)
    const sepX = cw - JUICER_W - 50;
    const maxX = Math.max(ZOMBIE_W, sepX - ZOMBIE_W - 20);

    return {
      id: nextId(),
      x: randRange(ZOMBIE_W, maxX),
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
      hp: isBoss ? (level === 20 ? 10 : 5) : hasArmor ? 2 : 1,
      maxHp: isBoss ? (level === 20 ? 10 : 5) : hasArmor ? 2 : 1,
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

      if (level >= 20) {
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

    // Draw separator
    drawSeparator(ctx, w, h);

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
      const sepX = w - JUICER_W - 50;
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
          if (z.x > sepX - z.w - 10) { z.x = sepX - z.w - 10; z.vx *= -1; }
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
        const randType = randItem(CUSTOMER_TYPES);
        customersRef.current.push({
          id: nextId(),
          x: -40,
          y: h - 30,
          state: "walking_in",
          wobble: randRange(0, Math.PI * 2),
          customerType: randType.id,
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
          c.wobble += 0.05;
          if (c.wobble > Math.PI * 2) {
            c.state = "walking_out";
            const cups = [...stateRef.current.cups];
            if (cups.length > 0) {
              const sold = cups.shift()!;
              const goldEarned = sold.type === "rare" ? 10 : 5;
              earnedGold += goldEarned;
              playDingSound();
              setState(prev => ({ ...prev, cups, gold: prev.gold + earnedGold }));
              // Add floating text
              const ft: FloatingText = {
                id: nextId(),
                text: `+${goldEarned}`,
                x: counterX,
                y: h - 50,
                life: 60,
              };
              setFloatingTexts(prev => [...prev, ft]);
            }
          }
        } else if (c.state === "walking_out") {
          c.x -= 1.5;
        }
      }
      customersRef.current = customersRef.current.filter(c => c.x > -60 || c.state !== "walking_out");

      // Update floating texts
      const updatedTexts = floatingTexts.map(ft => ({ ...ft, life: ft.life - 1, y: ft.y - 0.5 })).filter(ft => ft.life > 0);
      if (updatedTexts.length !== floatingTexts.length) {
        setFloatingTexts(updatedTexts);
      }

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
      drawCustomerType(ctx, c, timestamp);
    }

    animRef.current = requestAnimationFrame(gameLoop);
  }, [createZombie, spawnSplash, checkLevelComplete, floatingTexts]);

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
    setFloatingTexts([]);

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
    startLevel(1);
  }, [startLevel]);

  const handleNextLevel = useCallback(() => {
    const nextLvl = Math.min(stateRef.current.level + 1, 20);
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
      setShowWeaponWall(false);
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
    setShowWeaponWall(false);
  }, []);

  const currentWeaponDef = WEAPONS.find(w => w.id === state.currentWeapon);
  const currentCustomerType = CUSTOMER_TYPES[0];

  return (
    <div className="sr-zj-wrapper">
      {/* HUD */}
      {state.phase === "playing" && (
        <div className="sr-zj-hud">
          <span className="sr-zj-hud-item">
            <span className="sr-zj-hud-label">关卡</span>
            <span className="sr-zj-hud-value">{state.level}/20</span>
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
                style={{ position: "relative" }}
              >
                <button className="sr-overlay-close" onClick={() => {
                  handleNextLevel();
                }} style={{ position: "absolute", top: 12, right: 14, background: "none", border: "none", fontSize: 20, color: "#aaa", cursor: "pointer", lineHeight: 1 }}>&times;</button>
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
                <div className="sr-zj-subtitle">你是不灭传说</div>
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

      {/* Shop area (cups + customer queue) */}
      {state.phase === "playing" && (
        <div className="sr-zj-shop-area">
          <div className="sr-zj-shop-label">商店 - 比奇堡居民排队购买</div>
          <div className="sr-zj-cups-row">
            <span className="sr-zj-cups-label">杯子队列:</span>
            {state.cups.length === 0 && <span className="sr-zj-cups-empty">等待榨汁...</span>}
            {state.cups.map(c => (
              <span key={c.id} className="sr-zj-cup-item" title={c.type === "rare" ? "稀有果汁 10金" : "普通果汁 5金"}>
                {c.type === "rare" ? "\u2728" : ""}{'\u{1F9C3}'}
              </span>
            ))}
          </div>
          <div className="sr-zj-customer-types">
            {CUSTOMER_TYPES.map(ct => (
              <span key={ct.id} className="sr-zj-ct-tag" title={ct.name + " - " + ct.accessory}>
                {ct.id === "spongebob" ? "\u{1F9FD}" : ct.id === "patrick" ? "\u2B50" : ct.id === "squidward" ? "\u{1F419}" : ct.id === "krabs" ? "\u{1F980}" : "\u{1F43F}"}
              </span>
            ))}
            <span className="sr-zj-ct-note">+5金普通 / +10金稀有</span>
          </div>
        </div>
      )}

      {/* Bottom buttons */}
      <div className="sr-zj-bottom-bar">
        <button
          className="sr-zj-bottom-btn"
          onClick={() => setShowWeaponWall(true)}
        >
          {'\u{1F6E1}'} 武器墙
        </button>
        <button
          className="sr-zj-bottom-btn"
          onClick={() => setShowBadgeWall(true)}
        >
          {'\u{1F3C6}'} 徽章墙
        </button>
        {state.phase === "menu" && (
          <button className="sr-zj-bottom-btn sr-zj-bottom-btn-primary" onClick={handleStart}>
            {'\u25B6'} 开始
          </button>
        )}
        {state.phase === "playing" && (
          <button
            className="sr-zj-bottom-btn"
            onClick={() => setShowWeaponPanel(prev => !prev)}
          >
            {'\u{1F52B}'} {currentWeaponDef?.name || "武器"}
            <span className="sr-zj-weapon-arrow">{showWeaponPanel ? " \u25B2" : " \u25BC"}</span>
          </button>
        )}
      </div>

      {/* Weapon quick-select panel */}
      <AnimatePresence>
        {showWeaponPanel && state.phase === "playing" && (
          <motion.div
            className="sr-zj-quick-weapon-panel"
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
                  <span className="sr-zj-wp-emoji">{WEAPON_EMOJI[wp.id] || "\u{1F52B}"}</span>
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

      {/* Weapon Wall Modal */}
      <AnimatePresence>
        {showWeaponWall && (
          <motion.div
            className="sr-zj-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWeaponWall(false)}
          >
            <motion.div
              className="sr-zj-modal-card"
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sr-zj-modal-title">{'\u{1F6E1}'} 武器墙</div>
              <div className="sr-zj-modal-subtitle">选择你的武器，击败僵尸！</div>
              <div className="sr-zj-weapon-grid">
                {WEAPONS.map(wp => {
                  const owned = state.ownedWeapons.includes(wp.id);
                  const unlocked = state.level >= wp.unlockLevel || state.highestLevel >= wp.unlockLevel;
                  const canAfford = state.gold >= wp.price;
                  const active = state.currentWeapon === wp.id;
                  const canBuy = unlocked && !owned && canAfford;
                  const canEquip = owned && !active;

                  return (
                    <div key={wp.id} className={`sr-zj-weapon-card ${active ? "sr-zj-weapon-card-active" : ""} ${!unlocked ? "sr-zj-weapon-card-locked" : ""}`}>
                      <div className="sr-zj-weapon-card-icon">{WEAPON_EMOJI[wp.id] || "\u{1F52B}"}</div>
                      <div className="sr-zj-weapon-card-name">{wp.name}</div>
                      <div className="sr-zj-weapon-card-info">
                        <span>价格: {wp.price === 0 ? "免费" : `${wp.price}金`}</span>
                        <span>解锁: 关卡{wp.unlockLevel}</span>
                      </div>
                      <div className="sr-zj-weapon-card-desc">{wp.description}</div>
                      <div className="sr-zj-weapon-card-status">
                        {active ? (
                          <span className="sr-zj-status-active">当前使用</span>
                        ) : owned ? (
                          <button className="sr-zj-btn-sm" onClick={() => buyWeapon(wp.id)}>装备</button>
                        ) : !unlocked ? (
                          <span className="sr-zj-status-locked">关卡{wp.unlockLevel}解锁</span>
                        ) : canBuy ? (
                          <button className="sr-zj-btn-sm sr-zj-btn-buy" onClick={() => buyWeapon(wp.id)}>购买 {wp.price}金</button>
                        ) : (
                          <span className="sr-zj-status-nogold">金币不足</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="sr-zj-btn sr-zj-btn-secondary" onClick={() => setShowWeaponWall(false)}>
                关闭
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge Wall Modal */}
      <AnimatePresence>
        {showBadgeWall && (
          <motion.div
            className="sr-zj-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBadgeWall(false)}
          >
            <motion.div
              className="sr-zj-modal-card"
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sr-zj-modal-title">{'\u{1F3C6}'} 徽章墙</div>
              <div className="sr-zj-modal-subtitle">已获得 {state.badges.length} / 20 个徽章</div>
              <div className="sr-zj-badge-grid">
                {BADGES.map(b => {
                  const earned = state.badges.includes(b.level);
                  const unlocked = state.highestLevel >= b.level || state.level >= b.level;
                  return (
                    <div key={b.level} className={`sr-zj-badge-card ${earned ? "sr-zj-badge-earned" : "sr-zj-badge-locked"}`}>
                      <div className="sr-zj-badge-card-icon">{earned ? b.icon : "?"}</div>
                      <div className="sr-zj-badge-card-name">{earned ? b.name : "???"}</div>
                      <div className="sr-zj-badge-card-level">
                        {earned ? `关卡${b.level}` : `通关关卡${b.level}解锁`}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="sr-zj-btn sr-zj-btn-secondary" onClick={() => setShowBadgeWall(false)}>
                关闭
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
        /* Shop area */
        .sr-zj-shop-area {
          width: 100%;
          max-width: 600px;
          margin-top: 6px;
          padding: 8px 12px;
          background: rgba(255,255,255,0.6);
          border-radius: 10px;
          min-height: 36px;
        }
        .sr-zj-shop-label {
          font-size: 11px;
          color: #aaa;
          font-weight: 600;
          margin-bottom: 4px;
          text-align: center;
        }
        .sr-zj-cups-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #5a5a5a;
          flex-wrap: wrap;
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
        .sr-zj-customer-types {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          flex-wrap: wrap;
        }
        .sr-zj-ct-tag {
          font-size: 16px;
          cursor: default;
        }
        .sr-zj-ct-note {
          font-size: 11px;
          color: #aaa;
          margin-left: 4px;
        }
        /* Bottom bar */
        .sr-zj-bottom-bar {
          width: 100%;
          max-width: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 8px;
          padding: 0 4px;
          flex-wrap: wrap;
        }
        .sr-zj-bottom-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 600;
          color: #3a3a3a;
          background: #fff;
          border: 1.5px solid #ddd;
          border-radius: 14px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .sr-zj-bottom-btn:hover {
          border-color: #4a7a3a;
          background: #f8faf6;
        }
        .sr-zj-bottom-btn-primary {
          background: linear-gradient(135deg, #4a7a3a, #6b8e5a);
          color: #fff;
          border-color: transparent;
        }
        .sr-zj-bottom-btn-primary:hover {
          background: linear-gradient(135deg, #5a8a4a, #7b9e6a);
          border-color: transparent;
        }
        .sr-zj-weapon-arrow {
          font-size: 10px;
          color: #aaa;
        }
        /* Quick weapon panel */
        .sr-zj-quick-weapon-panel {
          width: 100%;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 4px;
          padding: 8px;
          background: #fff;
          border: 1.5px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          z-index: 30;
        }
        .sr-zj-wp-item {
          display: flex;
          align-items: center;
          gap: 8px;
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
        .sr-zj-wp-emoji {
          font-size: 20px;
          flex-shrink: 0;
        }
        .sr-zj-wp-name {
          font-size: 13px;
          font-weight: 700;
          color: #3a3a3a;
          flex: 1;
        }
        .sr-zj-wp-info {
          font-size: 11px;
          color: #F9A825;
          font-weight: 600;
          white-space: nowrap;
        }
        .sr-zj-wp-desc {
          font-size: 11px;
          color: #999;
          white-space: nowrap;
        }
        /* Modal overlays */
        .sr-zj-modal-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.5);
          z-index: 100;
          padding: 20px;
        }
        .sr-zj-modal-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 24px 28px;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.2);
          max-width: 560px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
        }
        .sr-zj-modal-title {
          font-size: 22px;
          font-weight: 800;
          color: #3a3a3a;
        }
        .sr-zj-modal-subtitle {
          font-size: 13px;
          color: #8a8a8a;
        }
        /* Weapon wall grid */
        .sr-zj-weapon-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          width: 100%;
        }
        .sr-zj-weapon-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 14px 10px;
          border: 2px solid #e8e8e8;
          border-radius: 14px;
          background: #fafafa;
          transition: border-color 0.15s, background 0.15s;
        }
        .sr-zj-weapon-card-active {
          border-color: #4a7a3a;
          background: #f0f8ee;
        }
        .sr-zj-weapon-card-locked {
          opacity: 0.5;
        }
        .sr-zj-weapon-card-icon {
          font-size: 36px;
        }
        .sr-zj-weapon-card-name {
          font-size: 15px;
          font-weight: 700;
          color: #3a3a3a;
        }
        .sr-zj-weapon-card-info {
          display: flex;
          gap: 8px;
          font-size: 11px;
          color: #888;
        }
        .sr-zj-weapon-card-desc {
          font-size: 11px;
          color: #666;
          text-align: center;
          line-height: 1.4;
        }
        .sr-zj-weapon-card-status {
          margin-top: 2px;
        }
        .sr-zj-status-active {
          font-size: 12px;
          font-weight: 700;
          color: #4a7a3a;
          background: #e8f0e4;
          padding: 3px 10px;
          border-radius: 10px;
        }
        .sr-zj-status-locked {
          font-size: 12px;
          color: #999;
        }
        .sr-zj-status-nogold {
          font-size: 12px;
          color: #e53935;
        }
        .sr-zj-btn-sm {
          padding: 5px 16px;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #4a7a3a, #6b8e5a);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.12s;
        }
        .sr-zj-btn-sm:hover {
          transform: scale(1.05);
        }
        .sr-zj-btn-sm:active {
          transform: scale(0.95);
        }
        .sr-zj-btn-buy {
          background: linear-gradient(135deg, #F9A825, #FBC02D);
        }
        /* Badge wall grid */
        .sr-zj-badge-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          width: 100%;
        }
        .sr-zj-badge-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 10px 6px;
          border: 2px solid #e8e8e8;
          border-radius: 12px;
          background: #fafafa;
          transition: transform 0.12s;
        }
        .sr-zj-badge-earned {
          border-color: #F9A825;
          background: #fffde7;
        }
        .sr-zj-badge-earned:hover {
          transform: scale(1.05);
        }
        .sr-zj-badge-locked {
          opacity: 0.45;
          background: #f5f5f5;
        }
        .sr-zj-badge-card-icon {
          font-size: 28px;
        }
        .sr-zj-badge-card-name {
          font-size: 11px;
          font-weight: 600;
          color: #3a3a3a;
          text-align: center;
          line-height: 1.2;
        }
        .sr-zj-badge-card-level {
          font-size: 10px;
          color: #999;
          text-align: center;
        }
        /* Achievement */
        .sr-zj-achievement {
          position: fixed;
          bottom: 24px;
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
          z-index: 200;
          pointer-events: none;
          white-space: nowrap;
        }
        .sr-zj-achievement-icon {
          font-size: 20px;
        }
        .sr-zj-achievement-label {
          letter-spacing: 0.5px;
        }
        @media (max-width: 480px) {
          .sr-zj-weapon-grid {
            grid-template-columns: 1fr;
          }
          .sr-zj-badge-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          .sr-zj-modal-card {
            padding: 16px 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default ZombieJuiceGame;