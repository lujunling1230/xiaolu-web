import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 守卫小萝卜
 *
 * 保卫萝卜风格塔防 Canvas 微游戏。
 * S 形弯路、三种防御塔（可升级）、四种可爱小怪物、12 波敌人。
 * 浅色草地风格，与解压馆统一。
 */

/* ============================================================
   常量
   ============================================================ */
const CANVAS_W = 720;
const CANVAS_H = 340;
const PATH_WIDTH_OUTER = 28;
const PATH_WIDTH_INNER = 22;
const PATH_COLOR = "#C4A265";
const PATH_COLOR_INNER = "#D4B87A";
const TOTAL_WAVES = 20;
const STARTING_GOLD = 100;
const STARTING_LIVES = 10;
const WAVE_REWARD = 20;
const KILL_REWARD_BASE = 5;
const MAX_TOWER_LEVEL = 3;
const TOWER_UPGRADE_COST_BASE = 25; // 每级递增25

// S 形路径拐点 (8 个)
const WAYPOINTS = [
  { x: 40, y: 170 },
  { x: 160, y: 170 },
  { x: 160, y: 60 },
  { x: 380, y: 60 },
  { x: 380, y: 280 },
  { x: 560, y: 280 },
  { x: 560, y: 170 },
  { x: 680, y: 170 },
];

// 计算路径段长度及累计长度
const pathCumLen: number[] = [0];
let _totalLen = 0;
for (let i = 0; i < WAYPOINTS.length - 1; i++) {
  const dx = WAYPOINTS[i + 1].x - WAYPOINTS[i].x;
  const dy = WAYPOINTS[i + 1].y - WAYPOINTS[i].y;
  const len = Math.sqrt(dx * dx + dy * dy);
  _totalLen += len;
  pathCumLen.push(_totalLen);
}

// 根据进度获取路径上的位置和段索引
const getPosOnPath = (
  progress: number,
  cumLen: number[]
): { x: number; y: number; idx: number } => {
  const d = progress * cumLen[cumLen.length - 1];
  for (let i = 0; i < cumLen.length - 1; i++) {
    if (d <= cumLen[i + 1]) {
      const segLen = cumLen[i + 1] - cumLen[i];
      const t = segLen > 0 ? (d - cumLen[i]) / segLen : 0;
      return {
        x: WAYPOINTS[i].x + (WAYPOINTS[i + 1].x - WAYPOINTS[i].x) * t,
        y: WAYPOINTS[i].y + (WAYPOINTS[i + 1].y - WAYPOINTS[i].y) * t,
        idx: i,
      };
    }
  }
  const last = WAYPOINTS[WAYPOINTS.length - 1];
  return { x: last.x, y: last.y, idx: WAYPOINTS.length - 2 };
};

// 点到线段最短距离
const pointToSegmentDist = (
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): number => {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.sqrt((px - ax) ** 2 + (py - ay) ** 2);
  let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
};

// 点到路径最小距离
const distToPath = (px: number, py: number): number => {
  let minD = Infinity;
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    const d = pointToSegmentDist(
      px,
      py,
      WAYPOINTS[i].x,
      WAYPOINTS[i].y,
      WAYPOINTS[i + 1].x,
      WAYPOINTS[i + 1].y
    );
    if (d < minD) minD = d;
  }
  return minD;
};

/* ============================================================
   TOWER_TYPES 常量
   ============================================================ */
const TOWER_TYPES = {
  shooter: {
    name: "射手塔",
    cost: 30,
    range: 90,
    damage: 8,
    fireRate: 18,
    color: "#F59E0B",
    colorLight: "#FCD34D",
    projectileColor: "#FF9800",
    projectileType: "bullet" as const,
    splashRadius: 0,
  },
  freezer: {
    name: "冰冻塔",
    cost: 50,
    range: 80,
    damage: 4,
    fireRate: 30,
    color: "#3B82F6",
    colorLight: "#93C5FD",
    projectileColor: "#60A5FA",
    projectileType: "bullet" as const,
    splashRadius: 0,
  },
  cannon: {
    name: "炮弹塔",
    cost: 60,
    range: 100,
    damage: 15,
    fireRate: 40,
    color: "#B91C1C",
    colorLight: "#EF4444",
    projectileColor: "#991B1B",
    projectileType: "cannonball" as const,
    splashRadius: 40,
  },
} as const;

type TowerType = keyof typeof TOWER_TYPES;

/* ============================================================
   徽章系统
   ============================================================ */
const BADGES = [
  { wave: 1, name: "初入战阵", color: "#a8d8a8" },
  { wave: 2, name: "小试牛刀", color: "#b8d8a8" },
  { wave: 3, name: "渐入佳境", color: "#c8d8a8" },
  { wave: 4, name: "稳扎稳打", color: "#d4c8a0" },
  { wave: 5, name: "小有成就", color: "#d4b8a0" },
  { wave: 6, name: "步步为营", color: "#d0c0a0" },
  { wave: 7, name: "智勇双全", color: "#c8b8a0" },
  { wave: 8, name: "百折不挠", color: "#a0b8d4" },
  { wave: 9, name: "进退自如", color: "#b0c0d4" },
  { wave: 10, name: "固若金汤", color: "#c8a8d8" },
  { wave: 11, name: "坚不可摧", color: "#d0b0d8" },
  { wave: 12, name: "萝卜守护神", color: "#FFD700" },
  { wave: 13, name: "千锤百炼", color: "#e8c8a0" },
  { wave: 14, name: "铜墙铁壁", color: "#d4c8a0" },
  { wave: 15, name: "兵来将挡", color: "#c8c8b0" },
  { wave: 16, name: "万夫莫开", color: "#a8c8d8" },
  { wave: 17, name: "龙城飞将", color: "#b0d0e0" },
  { wave: 18, name: "战神附体", color: "#d8a8a0" },
  { wave: 19, name: "一夫当关", color: "#e0b0a0" },
  { wave: 20, name: "萝卜传说", color: "#E8B923" },
] as const;

interface TowerSaveData {
  highestWave: number;
  badges: number[];
}

const TD_SAVE_KEY = "tower_defense_save";

const loadTDSave = (): TowerSaveData => {
  try {
    const raw = localStorage.getItem(TD_SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { highestWave: 0, badges: [] };
};

const saveTDSave = (data: TowerSaveData) => {
  try {
    localStorage.setItem(TD_SAVE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
};

/** 在Canvas上绘制徽章图标 */
function drawBadgeIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string,
  badgeIndex: number
) {
  // 圆形底
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 高光
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.2, cy - r * 0.2, r * 0.5, r * 0.35, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // 根据index画不同图形
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 1.5;
  if (badgeIndex < 2) {
    // 星星
    drawStar(ctx, cx, cy, r * 0.55);
  } else {
    // 盾牌
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.5);
    ctx.lineTo(cx + r * 0.4, cy - r * 0.25);
    ctx.lineTo(cx + r * 0.4, cy + r * 0.1);
    ctx.lineTo(cx, cy + r * 0.5);
    ctx.lineTo(cx - r * 0.4, cy + r * 0.1);
    ctx.lineTo(cx - r * 0.4, cy - r * 0.25);
    ctx.closePath();
    ctx.stroke();
  }
}

/* ============================================================
   怪物类型定义
   ============================================================ */
const ENEMY_TYPE_SLIME = "#7bc67b";
const ENEMY_TYPE_MUSHROOM = "#b07bc6";
const ENEMY_TYPE_GHOST = "#7ba8c6";
const ENEMY_TYPE_ROCK = "#c6a07b";

interface EnemyTypeConfig {
  color: string;
  speedMult: number;
  hpMult: number;
  killSoundFreq: number;
  deathColors: string[];
}

const ENEMY_TYPE_CONFIG: Record<string, EnemyTypeConfig> = {
  [ENEMY_TYPE_SLIME]: {
    color: ENEMY_TYPE_SLIME,
    speedMult: 1.0,
    hpMult: 1.0,
    killSoundFreq: 1200,
    deathColors: ["#7bc67b", "#a8e6a8", "#ffffff"],
  },
  [ENEMY_TYPE_MUSHROOM]: {
    color: ENEMY_TYPE_MUSHROOM,
    speedMult: 0.7,
    hpMult: 1.3,
    killSoundFreq: 800,
    deathColors: ["#b07bc6", "#d4a8e6", "#ffffff"],
  },
  [ENEMY_TYPE_GHOST]: {
    color: ENEMY_TYPE_GHOST,
    speedMult: 1.3,
    hpMult: 0.7,
    killSoundFreq: 1000,
    deathColors: ["#7ba8c6", "#a8d4e6", "#ffffff"],
  },
  [ENEMY_TYPE_ROCK]: {
    color: ENEMY_TYPE_ROCK,
    speedMult: 0.5,
    hpMult: 2.0,
    killSoundFreq: 500,
    deathColors: ["#c6a07b", "#e6c8a8", "#ffffff"],
  },
};

/* ============================================================
   接口
   ============================================================ */
interface Enemy {
  id: number;
  pathIdx: number;
  progress: number;
  speed: number;
  hp: number;
  maxHp: number;
  r: number;
  color: string;
  x: number;
  y: number;
  dead: boolean;
  reachedEnd: boolean;
  wobble: number;
  slowTimer: number;
}

interface Tower {
  id: number;
  x: number;
  y: number;
  type: TowerType;
  range: number;
  damage: number;
  fireRate: number;
  cooldown: number;
  color: string;
  rot: number;
  level: number;
  flashTimer: number;
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  color: string;
  life: number;
  type: "bullet" | "cannonball";
  targetId: number;
  trail: { x: number; y: number }[];
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
  shape?: "star" | "circle" | "heart";
}

/* ============================================================
   可爱怪物绘制函数（模块级）
   ============================================================ */

// 绘制五角星
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number
) {
  const spikes = 5;
  const outerR = r;
  const innerR = r * 0.4;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const rad = (Math.PI * 2 * i) / (spikes * 2) - Math.PI / 2;
    const radius = i % 2 === 0 ? outerR : innerR;
    const sx = cx + Math.cos(rad) * radius;
    const sy = cy + Math.sin(rad) * radius;
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.closePath();
  ctx.fill();
}

// 绘制血条
function drawHpBar(
  ctx: CanvasRenderingContext2D,
  ex: number,
  ey: number,
  r: number,
  hp: number,
  maxHp: number
) {
  const barW = r * 2.4;
  const barH = 3;
  const barX = ex - barW / 2;
  const barY = ey - r - 8;
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, 1.5);
  ctx.fill();
  const hpRatio = hp / maxHp;
  const hpColor =
    hpRatio > 0.5 ? "#6ecf6e" : hpRatio > 0.25 ? "#eab308" : "#ef4444";
  ctx.fillStyle = hpColor;
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW * hpRatio, barH, 1.5);
  ctx.fill();
}

// 判断是否受伤（半血以下）
function isHurt(hp: number, maxHp: number): boolean {
  return hp < maxHp * 0.5;
}

// 绘制大眼睛（含高光和流泪）
function drawCuteEye(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  hurt: boolean,
  frozen: boolean
) {
  // 眼白
  ctx.fillStyle = frozen ? "#d0e8ff" : "#fff";
  ctx.beginPath();
  ctx.ellipse(cx, cy, r, r * 1.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // 瞳孔
  const pupilColor = frozen ? "#6aa8d0" : "#333";
  ctx.fillStyle = pupilColor;
  ctx.beginPath();
  ctx.arc(cx + 0.5, cy + 0.5, r * 0.55, 0, Math.PI * 2);
  ctx.fill();

  // 高光
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(cx + r * 0.2, cy - r * 0.3, r * 0.25, 0, Math.PI * 2);
  ctx.fill();

  // 流泪效果
  if (hurt) {
    ctx.fillStyle = "rgba(100,180,255,0.6)";
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.8, cy + r * 1.2, r * 0.25, r * 0.5, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 绘制冰晶效果
function drawIceCrystals(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number
) {
  ctx.strokeStyle = "rgba(150,210,255,0.7)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI * 2 * i) / 4 + 0.3;
    const ex2 = cx + Math.cos(angle) * (r + 3);
    const ey2 = cy + Math.sin(angle) * (r + 3);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r * 0.5, cy + Math.sin(angle) * r * 0.5);
    ctx.lineTo(ex2, ey2);
    ctx.stroke();
    // 小冰晶分叉
    ctx.beginPath();
    ctx.moveTo(ex2, ey2);
    ctx.lineTo(ex2 + Math.cos(angle + 0.5) * 2, ey2 + Math.sin(angle + 0.5) * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ex2, ey2);
    ctx.lineTo(ex2 + Math.cos(angle - 0.5) * 2, ey2 + Math.sin(angle - 0.5) * 2);
    ctx.stroke();
  }
}

// 史莱姆：水滴形 + 果冻高光 + 大眼 + 微笑
function drawSlime(
  ctx: CanvasRenderingContext2D,
  ex: number,
  ey: number,
  r: number,
  wobble: number,
  hp: number,
  maxHp: number,
  frozen: boolean
) {
  const hurt = isHurt(hp, maxHp);
  const scaleY = 1 + Math.sin(wobble * 2) * 0.08;
  const bodyColor = frozen ? "#a8d8ea" : ENEMY_TYPE_SLIME;

  ctx.save();
  ctx.translate(ex, ey);
  ctx.scale(1, scaleY);

  // 身体（水滴形，底部圆润）
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(0, -r * 1.1);
  ctx.bezierCurveTo(-r * 0.5, -r * 1.2, -r * 1.2, -r * 0.2, -r, r * 0.5);
  ctx.bezierCurveTo(-r * 0.8, r * 1.1, r * 0.8, r * 1.1, r, r * 0.5);
  ctx.bezierCurveTo(r * 1.2, -r * 0.2, r * 0.5, -r * 1.2, 0, -r * 1.1);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = frozen ? "#80b8d0" : "rgba(60,140,60,0.4)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // 果冻高光
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.beginPath();
  ctx.ellipse(-r * 0.25, -r * 0.3, r * 0.35, r * 0.5, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // 小高光点
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.beginPath();
  ctx.arc(-r * 0.15, -r * 0.6, r * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // 眼睛
  drawCuteEye(ctx, -r * 0.3, -r * 0.15, r * 0.28, hurt, frozen);
  drawCuteEye(ctx, r * 0.3, -r * 0.15, r * 0.28, hurt, frozen);

  // 微笑（害怕时变成波浪嘴）
  ctx.strokeStyle = frozen ? "#80b8d0" : "rgba(60,100,60,0.6)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (hurt) {
    // 波浪嘴（害怕）
    ctx.moveTo(-r * 0.25, r * 0.25);
    ctx.quadraticCurveTo(-r * 0.1, r * 0.2, 0, r * 0.28);
    ctx.quadraticCurveTo(r * 0.1, r * 0.35, r * 0.25, r * 0.25);
  } else {
    // 微笑
    ctx.arc(0, r * 0.1, r * 0.25, 0.15 * Math.PI, 0.85 * Math.PI);
  }
  ctx.stroke();

  ctx.restore();

  // 冰晶
  if (frozen) drawIceCrystals(ctx, ex, ey, r);
}

// 小蘑菇：蘑菇头 + 白点 + 小脚
function drawMushroom(
  ctx: CanvasRenderingContext2D,
  ex: number,
  ey: number,
  r: number,
  wobble: number,
  hp: number,
  maxHp: number,
  frozen: boolean
) {
  const hurt = isHurt(hp, maxHp);
  const legPhase = Math.sin(wobble * 3);
  const capColor = frozen ? "#c8b8e8" : ENEMY_TYPE_MUSHROOM;
  const bodyColor = frozen ? "#d8c8f0" : "#e8d8f0";

  // 蘑菇头
  ctx.fillStyle = capColor;
  ctx.beginPath();
  ctx.arc(ex, ey - r * 0.3, r * 1.1, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = frozen ? "#a898c8" : "rgba(120,60,140,0.3)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // 白色圆点
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath();
  ctx.arc(ex - r * 0.5, ey - r * 0.6, r * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(ex + r * 0.3, ey - r * 0.7, r * 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(ex + r * 0.1, ey - r * 0.35, r * 0.1, 0, Math.PI * 2);
  ctx.fill();

  // 身体（矩形）
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.roundRect(ex - r * 0.45, ey - r * 0.3, r * 0.9, r * 0.8, 2);
  ctx.fill();
  ctx.strokeStyle = frozen ? "#a898c8" : "rgba(120,60,140,0.2)";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // 两条小腿（交替走路）
  ctx.strokeStyle = bodyColor;
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  // 左脚
  ctx.beginPath();
  ctx.moveTo(ex - r * 0.25, ey + r * 0.45);
  ctx.lineTo(ex - r * 0.25 + legPhase * r * 0.2, ey + r * 0.8);
  ctx.stroke();
  // 右脚
  ctx.beginPath();
  ctx.moveTo(ex + r * 0.25, ey + r * 0.45);
  ctx.lineTo(ex + r * 0.25 - legPhase * r * 0.2, ey + r * 0.8);
  ctx.stroke();

  // 眼睛
  drawCuteEye(ctx, ex - r * 0.25, ey - r * 0.1, r * 0.2, hurt, frozen);
  drawCuteEye(ctx, ex + r * 0.25, ey - r * 0.1, r * 0.2, hurt, frozen);

  // 腮红
  ctx.fillStyle = "rgba(220,120,150,0.35)";
  ctx.beginPath();
  ctx.ellipse(ex - r * 0.5, ey + r * 0.05, r * 0.15, r * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(ex + r * 0.5, ey + r * 0.05, r * 0.15, r * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();

  // 冰晶
  if (frozen) drawIceCrystals(ctx, ex, ey, r);
}

// 小幽灵：波浪底部 + 圆眼 + 飘浮
function drawGhost(
  ctx: CanvasRenderingContext2D,
  ex: number,
  ey: number,
  r: number,
  wobble: number,
  hp: number,
  maxHp: number,
  frozen: boolean
) {
  const hurt = isHurt(hp, maxHp);
  const floatY = Math.sin(wobble) * 3;
  const gx = ex;
  const gy = ey + floatY;
  const bodyColor = frozen ? "#c0d8e8" : ENEMY_TYPE_GHOST;

  // 上半身（半圆）
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.arc(gx, gy - r * 0.2, r, Math.PI, 0);
  // 两侧直线
  ctx.lineTo(gx + r, gy + r * 0.8);
  // 底部波浪
  const waveCount = 3;
  const waveW = (r * 2) / waveCount;
  for (let i = waveCount - 1; i >= 0; i--) {
    const wx = gx - r + i * waveW;
    const waveOffset = Math.sin(wobble * 2 + i) * r * 0.15;
    ctx.quadraticCurveTo(
      wx + waveW * 0.5,
      gy + r * 0.8 + waveOffset + r * 0.25,
      wx,
      gy + r * 0.8
    );
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = frozen ? "#a0b8c8" : "rgba(60,100,120,0.3)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // 半透明感
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.beginPath();
  ctx.arc(gx - r * 0.2, gy - r * 0.5, r * 0.35, 0, Math.PI * 2);
  ctx.fill();

  // 眼睛
  drawCuteEye(ctx, gx - r * 0.3, gy - r * 0.25, r * 0.25, hurt, frozen);
  drawCuteEye(ctx, gx + r * 0.3, gy - r * 0.25, r * 0.25, hurt, frozen);

  // O型小嘴
  ctx.strokeStyle = frozen ? "#a0b8c8" : "rgba(50,80,100,0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (hurt) {
    // 害怕的嘴（更大）
    ctx.ellipse(gx, gy + r * 0.15, r * 0.2, r * 0.25, 0, 0, Math.PI * 2);
  } else {
    ctx.ellipse(gx, gy + r * 0.15, r * 0.12, r * 0.15, 0, 0, Math.PI * 2);
  }
  ctx.stroke();

  // 冰晶
  if (frozen) drawIceCrystals(ctx, gx, gy, r);

  // 返回浮动后的实际y用于血条
  return floatY;
}

// 小石头怪：方形圆角 + 小眼
function drawRock(
  ctx: CanvasRenderingContext2D,
  ex: number,
  ey: number,
  r: number,
  wobble: number,
  hp: number,
  maxHp: number,
  frozen: boolean
) {
  const hurt = isHurt(hp, maxHp);
  const tilt = Math.sin(wobble) * 0.1;
  const bodyColor = frozen ? "#d8c8b8" : ENEMY_TYPE_ROCK;

  ctx.save();
  ctx.translate(ex, ey);
  ctx.rotate(tilt);

  // 身体（圆角矩形）
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.roundRect(-r * 1.0, -r * 0.85, r * 2, r * 1.7, r * 0.35);
  ctx.fill();
  ctx.strokeStyle = frozen ? "#b8a898" : "rgba(120,80,50,0.35)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // 裂纹纹理
  ctx.strokeStyle = frozen ? "#a89888" : "rgba(100,60,30,0.25)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(-r * 0.2, -r * 0.5);
  ctx.lineTo(-r * 0.05, -r * 0.1);
  ctx.lineTo(-r * 0.3, r * 0.15);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(r * 0.3, -r * 0.3);
  ctx.lineTo(r * 0.15, r * 0.1);
  ctx.lineTo(r * 0.35, r * 0.3);
  ctx.stroke();

  // 小方眼
  const eyeR = r * 0.2;
  ctx.fillStyle = frozen ? "#d0e8ff" : "#fff";
  ctx.fillRect(-r * 0.42 - eyeR, -r * 0.2 - eyeR, eyeR * 2, eyeR * 1.6);
  ctx.fillRect(r * 0.42 - eyeR, -r * 0.2 - eyeR, eyeR * 2, eyeR * 1.6);

  ctx.fillStyle = frozen ? "#6aa8d0" : "#333";
  ctx.fillRect(-r * 0.42 - eyeR * 0.4, -r * 0.15 - eyeR * 0.2, eyeR * 0.8, eyeR * 0.8);
  ctx.fillRect(r * 0.42 - eyeR * 0.4, -r * 0.15 - eyeR * 0.2, eyeR * 0.8, eyeR * 0.8);

  // 流泪
  if (hurt) {
    ctx.fillStyle = "rgba(100,180,255,0.6)";
    ctx.beginPath();
    ctx.ellipse(-r * 0.42, r * 0.05, eyeR * 0.3, eyeR * 0.6, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(r * 0.42, r * 0.05, eyeR * 0.3, eyeR * 0.6, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 扁嘴
  ctx.strokeStyle = frozen ? "#a89888" : "rgba(80,50,30,0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (hurt) {
    // 害怕的嘴（波浪）
    ctx.moveTo(-r * 0.3, r * 0.35);
    ctx.quadraticCurveTo(-r * 0.1, r * 0.3, 0, r * 0.38);
    ctx.quadraticCurveTo(r * 0.1, r * 0.45, r * 0.3, r * 0.35);
  } else {
    ctx.moveTo(-r * 0.2, r * 0.35);
    ctx.lineTo(r * 0.2, r * 0.35);
  }
  ctx.stroke();

  ctx.restore();

  // 冰晶
  if (frozen) drawIceCrystals(ctx, ex, ey, r);
}

// 统一的可爱敌人绘制入口
function drawCuteEnemy(
  ctx: CanvasRenderingContext2D,
  en: Enemy
) {
  const wobbleX = Math.sin(en.wobble) * 2;
  const ex = en.x + wobbleX;
  const ey = en.y;
  const frozen = en.slowTimer > 0;

  // 减速效果（冰冻光环）
  if (frozen) {
    ctx.fillStyle = "rgba(100,180,255,0.15)";
    ctx.beginPath();
    ctx.arc(ex, ey, en.r + 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 根据颜色判断怪物类型
  if (en.color === ENEMY_TYPE_SLIME) {
    drawSlime(ctx, ex, ey, en.r, en.wobble, en.hp, en.maxHp, frozen);
  } else if (en.color === ENEMY_TYPE_MUSHROOM) {
    drawMushroom(ctx, ex, ey, en.r, en.wobble, en.hp, en.maxHp, frozen);
  } else if (en.color === ENEMY_TYPE_GHOST) {
    drawGhost(ctx, ex, ey, en.r, en.wobble, en.hp, en.maxHp, frozen);
  } else {
    drawRock(ctx, ex, ey, en.r, en.wobble, en.hp, en.maxHp, frozen);
  }

  // 血条（幽灵有浮动偏移）
  let hpY = ey;
  if (en.color === ENEMY_TYPE_GHOST) {
    hpY += Math.sin(en.wobble) * 3;
  }
  drawHpBar(ctx, ex, hpY - en.r - 2, en.r, en.hp, en.maxHp);
}

/* ============================================================
   Web Audio 音效
   ============================================================ */
const playShootSound = () => {
  try {
    const actx = new AudioContext();
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.connect(gain);
    gain.connect(actx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, actx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, actx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.12, actx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.1);
    osc.start();
    osc.stop(actx.currentTime + 0.1);
  } catch {
    /* 静音 */
  }
};

const playHitSound = () => {
  try {
    const actx = new AudioContext();
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.connect(gain);
    gain.connect(actx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(200, actx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, actx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.15, actx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.15);
    osc.start();
    osc.stop(actx.currentTime + 0.15);
  } catch {
    /* 静音 */
  }
};

const playPlaceSound = () => {
  try {
    const actx = new AudioContext();
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.connect(gain);
    gain.connect(actx.destination);
    osc.type = "triangle";
    osc.frequency.setValueAtTime(300, actx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, actx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, actx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.2);
    osc.start();
    osc.stop(actx.currentTime + 0.2);
  } catch {
    /* 静音 */
  }
};

const playUpgradeSound = () => {
  try {
    const actx = new AudioContext();
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.connect(gain);
    gain.connect(actx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(523, actx.currentTime);
    osc.frequency.setValueAtTime(659, actx.currentTime + 0.08);
    osc.frequency.setValueAtTime(784, actx.currentTime + 0.16);
    gain.gain.setValueAtTime(0.15, actx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.3);
    osc.start();
    osc.stop(actx.currentTime + 0.3);
  } catch {
    /* 静音 */
  }
};

// 根据怪物类型变化的击杀音效
const playKillSound = (enemyColor: string) => {
  try {
    const actx = new AudioContext();
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.connect(gain);
    gain.connect(actx.destination);
    osc.type = "sine";
    const freq = ENEMY_TYPE_CONFIG[enemyColor]?.killSoundFreq || 800;
    osc.frequency.setValueAtTime(freq, actx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, actx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.12, actx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.2);
    osc.start();
    osc.stop(actx.currentTime + 0.2);
  } catch {
    /* 静音 */
  }
};

/* ============================================================
   生成一波敌人（含怪物多样性）
   ============================================================ */
let _enemyIdCounter = 0;

const spawnWave = (waveNum: number): Enemy[] => {
  const count = 3 + waveNum * 2;
  const baseHp = 30 + waveNum * 20;
  const baseSpeed = 0.0012 + waveNum * 0.00005;
  const enemies: Enemy[] = [];

  // 可选怪物颜色池（根据波次递增）
  const availableTypes: string[] = [ENEMY_TYPE_SLIME];
  if (waveNum >= 3) availableTypes.push(ENEMY_TYPE_MUSHROOM);
  if (waveNum >= 5) availableTypes.push(ENEMY_TYPE_GHOST);
  if (waveNum >= 7) availableTypes.push(ENEMY_TYPE_ROCK);

  for (let i = 0; i < count; i++) {
    // 随机选取怪物类型，前面波次权重偏向简单怪物
    const typeIdx = Math.floor(Math.random() * availableTypes.length);
    const color = availableTypes[typeIdx];
    const config = ENEMY_TYPE_CONFIG[color];
    const hp = Math.floor(
      (baseHp + Math.floor(Math.random() * 10)) * config.hpMult
    );
    const speed = (baseSpeed + Math.random() * 0.0003) * config.speedMult;
    enemies.push({
      id: _enemyIdCounter++,
      pathIdx: 0,
      progress: -i * 0.03,
      speed,
      hp,
      maxHp: hp,
      r: 10,
      color,
      x: WAYPOINTS[0].x,
      y: WAYPOINTS[0].y,
      dead: false,
      reachedEnd: false,
      wobble: Math.random() * Math.PI * 2,
      slowTimer: 0,
    });
  }
  return enemies;
};

/* ============================================================
   canPlaceTower
   ============================================================ */
const canPlaceTower = (x: number, y: number, towers: Tower[]): boolean => {
  if (x < 10 || y < 10 || x > CANVAS_W - 10 || y > CANVAS_H - 10) return false;
  if (distToPath(x, y) < 12) return false;
  for (const t of towers) {
    const d = Math.sqrt((x - t.x) ** 2 + (y - t.y) ** 2);
    if (d < 26) return false;
  }
  return true;
};

// 获取塔的升级费用
const getUpgradeCost = (level: number): number => {
  return TOWER_UPGRADE_COST_BASE * level;
};

// 应用升级效果
function applyTowerUpgrade(tw: Tower): void {
  tw.level += 1;
  tw.damage = Math.floor(tw.damage * 1.5);
  tw.range = Math.floor(tw.range * 1.1);
  tw.fireRate = Math.max(5, Math.floor(tw.fireRate * 0.9));
  tw.flashTimer = 20;
}

/* ============================================================
   CSS-in-JS（浅色风格）
   ============================================================ */
const styles: Record<string, React.CSSProperties> = {
  root: {
    position: "relative",
    width: "100%",
    background: "linear-gradient(135deg, #f0f4e8 0%, #e8ecd8 100%)",
    borderRadius: 16,
    overflow: "hidden",
    fontFamily: "'Noto Sans SC', system-ui, sans-serif",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px",
    background: "rgba(255,255,255,0.7)",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    flexWrap: "wrap" as const,
    gap: 8,
  },
  hud: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    fontSize: 14,
    fontWeight: 600,
    color: "#5a4a52",
  },
  goldBadge: {
    color: "#d48a9a",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  waveBadge: {
    color: "#7b9ea8",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  livesBadge: {
    color: "#d48a9a",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  towerBar: {
    display: "flex",
    gap: 8,
    padding: "8px 16px",
    background: "rgba(255,255,255,0.5)",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    justifyContent: "center",
    flexWrap: "wrap" as const,
  },
  towerBtn: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 2,
    padding: "6px 14px",
    borderRadius: 10,
    border: "2px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.6)",
    cursor: "pointer",
    transition: "all 0.2s",
    color: "#5a4a52",
    fontSize: 11,
    fontWeight: 500,
    userSelect: "none" as const,
  },
  towerBtnSelected: {
    border: "2px solid",
    background: "rgba(255,255,255,0.9)",
    color: "#5a4a52",
    transform: "scale(1.05)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  towerBtnDisabled: {
    opacity: 0.4,
    cursor: "not-allowed" as const,
  },
  towerIcon: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    border: "2px solid rgba(0,0,0,0.1)",
  },
  towerBtnLabel: {
    fontSize: 11,
    fontWeight: 600,
  },
  towerBtnCost: {
    fontSize: 10,
    color: "#d48a9a",
  },
  canvasWrap: {
    position: "relative",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  canvas: {
    display: "block",
    width: "100%",
    maxWidth: CANVAS_W,
    height: 340,
    background: "linear-gradient(180deg, #e8ecd8 0%, #f0f4e8 100%)",
    touchAction: "none",
    cursor: "crosshair",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(4px)",
    zIndex: 10,
    color: "#5a4a52",
  },
  overlayTitle: {
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 8,
    color: "#5a4a52",
  },
  overlaySub: {
    fontSize: 14,
    color: "rgba(90,74,82,0.6)",
    marginBottom: 20,
  },
  restartBtn: {
    padding: "10px 28px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #d48a9a, #c47a8a)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 2px 8px rgba(212,138,154,0.3)",
  },
  startBtnWrap: {
    position: "absolute",
    bottom: 12,
    right: 12,
    zIndex: 5,
  },
  startBtn: {
    padding: "6px 18px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, #8bc48a, #6eb46e)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(110,180,110,0.3)",
  },
  upgradeBtnWrap: {
    position: "absolute",
    bottom: 12,
    left: 12,
    zIndex: 5,
  },
  upgradeBtn: {
    padding: "6px 14px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, #f0c060, #e0a840)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(240,192,96,0.3)",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  upgradeBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed" as const,
  },
  achievementBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    padding: "4px 10px",
    borderRadius: 6,
    background: "rgba(212,138,154,0.15)",
    border: "1px solid rgba(212,138,154,0.3)",
    color: "#d48a9a",
    fontSize: 11,
    fontWeight: 600,
    zIndex: 5,
    pointerEvents: "none" as const,
  },
};

/* ============================================================
   主组件
   ============================================================ */
const TowerDefenseGame: React.FC = () => {
  /* ---------- state ---------- */
  const [gold, setGold] = useState(STARTING_GOLD);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [wave, setWave] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selectedTower, setSelectedTower] = useState<TowerType | null>("shooter");
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [waveActive, setWaveActive] = useState(false);
  const [achievement, setAchievement] = useState<string | null>(null);
  const [upgradingTower, setUpgradingTower] = useState<Tower | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<number[]>(() => loadTDSave().badges);
  const [badgeNotify, setBadgeNotify] = useState<{ name: string; color: string } | null>(null);

  /* ---------- refs ---------- */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const playingRef = useRef(false);
  const selectedTowerRef = useRef<TowerType | null>("shooter");
  const goldRef = useRef(STARTING_GOLD);
  const livesRef = useRef(STARTING_LIVES);
  const waveRef = useRef(0);
  const gameOverRef = useRef(false);
  const victoryRef = useRef(false);
  const waveActiveRef = useRef(false);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const upgradingTowerRef = useRef<Tower | null>(null);

  // 游戏数据 refs
  const enemiesRef = useRef<Enemy[]>([]);
  const towersRef = useRef<Tower[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const frameCountRef = useRef(0);
  const spawnQueueRef = useRef<Enemy[]>([]);
  const towerIdRef = useRef(0);

  /* ---------- 同步 state → ref ---------- */
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);
  useEffect(() => {
    selectedTowerRef.current = selectedTower;
  }, [selectedTower]);
  useEffect(() => {
    goldRef.current = gold;
  }, [gold]);
  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);
  useEffect(() => {
    waveRef.current = wave;
  }, [wave]);
  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);
  useEffect(() => {
    victoryRef.current = victory;
  }, [victory]);
  useEffect(() => {
    waveActiveRef.current = waveActive;
  }, [waveActive]);
  useEffect(() => {
    upgradingTowerRef.current = upgradingTower;
  }, [upgradingTower]);

  /* ---------- 徽章检测 ---------- */
  useEffect(() => {
    if (wave < 1) return;
    // 更新最高波次
    const save = loadTDSave();
    if (wave > save.highestWave) {
      save.highestWave = wave;
    }
    // 检查新徽章
    let newBadgeName: string | null = null;
    let newBadgeColor = "";
    BADGES.forEach((b, idx) => {
      if (wave >= b.wave && !save.badges.includes(idx)) {
        save.badges.push(idx);
        newBadgeName = b.name;
        newBadgeColor = b.color;
      }
    });
    saveTDSave(save);
    if (!arraysEqual(save.badges, earnedBadges)) {
      setEarnedBadges([...save.badges]);
    }
    if (newBadgeName) {
      setBadgeNotify({ name: newBadgeName, color: newBadgeColor });
      setAchievement(newBadgeName);
      const timer = setTimeout(() => setBadgeNotify(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [wave]); // eslint-disable-line react-hooks/exhaustive-deps

/** 简单比较两个数组是否相等 */
const arraysEqual = (a: number[], b: number[]): boolean => {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
};

  /* ---------- 开始波次 ---------- */
  const startWave = useCallback(() => {
    if (gameOverRef.current || victoryRef.current) return;
    if (waveActiveRef.current) return;
    const nextWave = waveRef.current + 1;
    if (nextWave > TOTAL_WAVES) {
      setVictory(true);
      victoryRef.current = true;
      playingRef.current = false;
      setPlaying(false);
      return;
    }
    const newEnemies = spawnWave(nextWave);
    spawnQueueRef.current = [...spawnQueueRef.current, ...newEnemies];
    setWave(nextWave);
    waveRef.current = nextWave;
    setWaveActive(true);
    waveActiveRef.current = true;
    if (!playingRef.current) {
      setPlaying(true);
      playingRef.current = true;
    }
  }, []);

  /* ---------- 升级塔 ---------- */
  const handleUpgrade = useCallback(() => {
    const tw = upgradingTowerRef.current;
    if (!tw) return;
    if (tw.level >= MAX_TOWER_LEVEL) return;
    const cost = getUpgradeCost(tw.level);
    if (goldRef.current < cost) return;
    applyTowerUpgrade(tw);
    goldRef.current -= cost;
    setGold(goldRef.current);
    setUpgradingTower({ ...tw });
    playUpgradeSound();
    // 升级闪光粒子
    for (let k = 0; k < 12; k++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 1 + Math.random() * 3;
      particlesRef.current.push({
        x: tw.x,
        y: tw.y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        r: 1.5 + Math.random() * 2,
        color: ["#FFD700", "#FFF8DC", "#F0E68C", "#FFE4B5"][
          Math.floor(Math.random() * 4)
        ],
        life: 20 + Math.random() * 15,
        maxLife: 35,
        shape: "star",
      });
    }
  }, []);

  /* ---------- 放置塔 / 选中已有塔 ---------- */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const sel = selectedTowerRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_W / rect.width;
      const scaleY = CANVAS_H / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      // 检查是否点击已有塔（距离 < 20）
      let clickedTower: Tower | null = null;
      for (const t of towersRef.current) {
        const d = Math.sqrt((mx - t.x) ** 2 + (my - t.y) ** 2);
        if (d < 20) {
          clickedTower = t;
          break;
        }
      }

      if (clickedTower) {
        // 点击已有塔：弹出升级面板
        setUpgradingTower(clickedTower);
        return;
      }

      // 清除升级面板
      if (upgradingTowerRef.current) {
        setUpgradingTower(null);
        return;
      }

      if (!sel) return;
      const tt = TOWER_TYPES[sel];
      if (goldRef.current < tt.cost) return;
      if (!canPlaceTower(mx, my, towersRef.current)) return;
      const newTower: Tower = {
        id: towerIdRef.current++,
        x: mx,
        y: my,
        type: sel,
        range: tt.range,
        damage: tt.damage,
        fireRate: tt.fireRate,
        cooldown: 0,
        color: tt.color,
        rot: 0,
        level: 1,
        flashTimer: 0,
      };
      towersRef.current.push(newTower);
      setGold((g) => g - tt.cost);
      goldRef.current -= tt.cost;
      playPlaceSound();
    },
    []
  );

  /* ---------- 鼠标移动 ---------- */
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_W / rect.width;
      const scaleY = CANVAS_H / rect.height;
      mousePosRef.current = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const handlePointerLeave = useCallback(() => {
    mousePosRef.current = null;
  }, []);

  /* ---------- 重新开始 ---------- */
  const restart = useCallback(() => {
    _enemyIdCounter = 0;
    enemiesRef.current = [];
    towersRef.current = [];
    projectilesRef.current = [];
    particlesRef.current = [];
    spawnQueueRef.current = [];
    towerIdRef.current = 0;
    frameCountRef.current = 0;
    setGold(STARTING_GOLD);
    goldRef.current = STARTING_GOLD;
    setLives(STARTING_LIVES);
    livesRef.current = STARTING_LIVES;
    setWave(0);
    waveRef.current = 0;
    setPlaying(false);
    playingRef.current = false;
    setGameOver(false);
    gameOverRef.current = false;
    setVictory(false);
    victoryRef.current = false;
    setWaveActive(false);
    waveActiveRef.current = false;
    setAchievement(null);
    setBadgeNotify(null);
    setSelectedTower("shooter");
    selectedTowerRef.current = "shooter";
    setUpgradingTower(null);
    upgradingTowerRef.current = null;
  }, []);

  /* ---------- 游戏主循环 ---------- */
  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 始终调度下一帧
    animRef.current = requestAnimationFrame(loop);

    if (!playingRef.current) {
      // 游戏未开始时画简单等待画面
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      // 浅绿背景
      const g = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      g.addColorStop(0, "#f0f4e8");
      g.addColorStop(1, "#e8ecd8");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      // 提示文字
      if (!gameOverRef.current && !victoryRef.current && waveRef.current === 0) {
        ctx.fillStyle = "rgba(90,74,82,0.5)";
        ctx.font = "15px 'Noto Sans SC', system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          "\u70B9\u51FB\u4E0B\u65B9\u6309\u94AE\u5F00\u59CB\u7B2C\u4E00\u6CE2",
          CANVAS_W / 2,
          CANVAS_H / 2
        );
        // 放置提示
        ctx.font = "12px 'Noto Sans SC', system-ui, sans-serif";
        ctx.fillStyle = "rgba(90,74,82,0.35)";
        ctx.fillText(
          "\u70B9\u51FB\u7B7B\u8272\u533A\u57DF\u653E\u7F6E\u9632\u5FA1\u5854",
          CANVAS_W / 2,
          CANVAS_H / 2 + 22
        );
      }
      return;
    }

    frameCountRef.current++;

    const enemies = enemiesRef.current;
    const towers = towersRef.current;
    const projectiles = projectilesRef.current;
    const particles = particlesRef.current;
    const queue = spawnQueueRef.current;

    /* --- 生成队列 → 活跃敌人 --- */
    for (let i = queue.length - 1; i >= 0; i--) {
      const en = queue[i];
      en.progress += en.speed;
      if (en.progress >= 0) {
        queue.splice(i, 1);
        enemies.push(en);
      } else {
        const pos = getPosOnPath(0, pathCumLen);
        en.x = pos.x;
        en.y = pos.y;
      }
    }

    /* --- 更新敌人 --- */
    for (const en of enemies) {
      if (en.dead || en.reachedEnd) continue;
      const speedMult = en.slowTimer > 0 ? 0.4 : 1;
      if (en.slowTimer > 0) en.slowTimer--;
      en.progress += en.speed * speedMult;
      en.wobble += 0.15;
      if (en.progress >= 1) {
        en.reachedEnd = true;
        livesRef.current -= 1;
        setLives(livesRef.current);
        if (livesRef.current <= 0) {
          gameOverRef.current = true;
          setGameOver(true);
          playingRef.current = false;
          setPlaying(false);
          return;
        }
        continue;
      }
      const pos = getPosOnPath(en.progress, pathCumLen);
      en.x = pos.x;
      en.y = pos.y;
      en.pathIdx = pos.idx;
    }

    /* --- 塔攻击 --- */
    for (const tw of towers) {
      if (tw.cooldown > 0) {
        tw.cooldown--;
        continue;
      }
      if (tw.flashTimer > 0) tw.flashTimer--;
      let nearest: Enemy | null = null;
      let nearDist = Infinity;
      for (const en of enemies) {
        if (en.dead || en.reachedEnd) continue;
        const d = Math.sqrt((tw.x - en.x) ** 2 + (tw.y - en.y) ** 2);
        if (d < tw.range && d < nearDist) {
          nearDist = d;
          nearest = en;
        }
      }
      if (nearest) {
        tw.cooldown = tw.fireRate;
        tw.rot = Math.atan2(nearest.y - tw.y, nearest.x - tw.x);
        const speed = tw.type === "cannon" ? 4 : 6;
        const dx = nearest.x - tw.x;
        const dy = nearest.y - tw.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nx = dist > 0 ? dx / dist : 0;
        const ny = dist > 0 ? dy / dist : 0;
        const tt = TOWER_TYPES[tw.type];
        projectiles.push({
          x: tw.x + nx * 14,
          y: tw.y + ny * 14,
          vx: nx * speed,
          vy: ny * speed,
          damage: tw.damage,
          color: tt.projectileColor,
          life: 60,
          type: tt.projectileType,
          targetId: nearest.id,
          trail: [],
        });
        playShootSound();
      }
    }

    /* --- 更新子弹 --- */
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 5) p.trail.shift();

      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      let hit = false;

      // 炮弹到期爆破
      if (p.type === "cannonball" && p.life <= 0) {
        const tt = TOWER_TYPES.cannon;
        for (const en of enemies) {
          if (en.dead || en.reachedEnd) continue;
          const d = Math.sqrt((p.x - en.x) ** 2 + (p.y - en.y) ** 2);
          if (d < tt.splashRadius) {
            const dmg = p.damage * (1 - d / tt.splashRadius);
            en.hp -= dmg;
          }
        }
        for (let k = 0; k < 10; k++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = 1 + Math.random() * 3;
          particles.push({
            x: p.x,
            y: p.y,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            r: 2 + Math.random() * 3,
            color: ["#FF6B35", "#FF9800", "#FFD700"][
              Math.floor(Math.random() * 3)
            ],
            life: 20 + Math.random() * 15,
            maxLife: 35,
            shape: "star",
          });
        }
        playHitSound();
        hit = true;
      }

      // 子弹碰撞检测
      if (!hit) {
        for (const en of enemies) {
          if (en.dead || en.reachedEnd) continue;
          const d = Math.sqrt((p.x - en.x) ** 2 + (p.y - en.y) ** 2);
          if (d < en.r + 4) {
            en.hp -= p.damage;
            // 冰冻塔减速检测
            const isFreezerBullet =
              p.color === TOWER_TYPES.freezer.projectileColor;
            if (isFreezerBullet) {
              en.slowTimer = 60;
            }
            for (let k = 0; k < 4; k++) {
              const ang = Math.random() * Math.PI * 2;
              const spd = 0.5 + Math.random() * 2;
              particles.push({
                x: p.x,
                y: p.y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                r: 1.5 + Math.random() * 1.5,
                color: p.color,
                life: 12 + Math.random() * 8,
                maxLife: 20,
              });
            }
            playHitSound();
            hit = true;
            break;
          }
        }
      }

      if (
        hit ||
        p.life <= 0 ||
        p.x < -20 ||
        p.x > CANVAS_W + 20 ||
        p.y < -20 ||
        p.y > CANVAS_H + 20
      ) {
        projectiles.splice(i, 1);
      }
    }

    /* --- 处理死亡敌人（星星粒子） --- */
    for (let i = enemies.length - 1; i >= 0; i--) {
      const en = enemies[i];
      if (en.dead || en.reachedEnd) continue;
      if (en.hp <= 0) {
        en.dead = true;
        const reward = KILL_REWARD_BASE + Math.floor(en.maxHp / 20);
        goldRef.current += reward;
        setGold(goldRef.current);

        // 每种怪物不同的死亡粒子颜色
        const deathColors = ENEMY_TYPE_CONFIG[en.color]?.deathColors || [
          en.color,
          "#fff",
        ];
        for (let k = 0; k < 8; k++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = 0.8 + Math.random() * 2.5;
          particles.push({
            x: en.x,
            y: en.y,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd - 1,
            r: 2 + Math.random() * 2.5,
            color: deathColors[Math.floor(Math.random() * deathColors.length)],
            life: 20 + Math.random() * 15,
            maxLife: 35,
            shape: "star",
          });
        }
        playKillSound(en.color);
        enemies.splice(i, 1);
      }
    }

    // 清理已到达终点的敌人
    for (let i = enemies.length - 1; i >= 0; i--) {
      if (enemies[i].reachedEnd || enemies[i].dead) {
        enemies.splice(i, 1);
      }
    }

    /* --- 检测波次结束 --- */
    if (waveActiveRef.current && queue.length === 0 && enemies.length === 0) {
      waveActiveRef.current = false;
      setWaveActive(false);
      goldRef.current += WAVE_REWARD;
      setGold(goldRef.current);
      if (waveRef.current >= TOTAL_WAVES) {
        victoryRef.current = true;
        setVictory(true);
        playingRef.current = false;
        setPlaying(false);
        return;
      }
    }

    /* --- 更新粒子 --- */
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.vy += 0.02; // 轻微重力
      p.life--;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    /* ============ 绘制 ============ */
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // 浅色草地背景
    const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    bgGrad.addColorStop(0, "#e8ecd8");
    bgGrad.addColorStop(1, "#f0f4e8");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // 草地纹理（浅色小花点）
    ctx.fillStyle = "rgba(120,180,80,0.15)";
    for (let gx = 0; gx < CANVAS_W; gx += 20) {
      for (let gy = 0; gy < CANVAS_H; gy += 20) {
        if ((gx + gy) % 40 === 0) {
          ctx.beginPath();
          ctx.arc(gx + 5, gy + 5, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        if ((gx + gy) % 60 === 10) {
          ctx.fillStyle = "rgba(200,160,120,0.1)";
          ctx.beginPath();
          ctx.arc(gx + 12, gy + 8, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(120,180,80,0.15)";
        }
      }
    }

    // 路径（外层）
    ctx.strokeStyle = PATH_COLOR;
    ctx.lineWidth = PATH_WIDTH_OUTER;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(WAYPOINTS[0].x, WAYPOINTS[0].y);
    for (let i = 1; i < WAYPOINTS.length; i++) {
      ctx.lineTo(WAYPOINTS[i].x, WAYPOINTS[i].y);
    }
    ctx.stroke();

    // 路径（内层）
    ctx.strokeStyle = PATH_COLOR_INNER;
    ctx.lineWidth = PATH_WIDTH_INNER;
    ctx.beginPath();
    ctx.moveTo(WAYPOINTS[0].x, WAYPOINTS[0].y);
    for (let i = 1; i < WAYPOINTS.length; i++) {
      ctx.lineTo(WAYPOINTS[i].x, WAYPOINTS[i].y);
    }
    ctx.stroke();

    // 路径虚线
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.moveTo(WAYPOINTS[0].x, WAYPOINTS[0].y);
    for (let i = 1; i < WAYPOINTS.length; i++) {
      ctx.lineTo(WAYPOINTS[i].x, WAYPOINTS[i].y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    /* --- 绘制萝卜 --- */
    const carrotX = WAYPOINTS[WAYPOINTS.length - 1].x;
    const carrotY = WAYPOINTS[WAYPOINTS.length - 1].y;
    // 身体
    ctx.fillStyle = "#FF8C00";
    ctx.beginPath();
    ctx.moveTo(carrotX, carrotY - 16);
    ctx.lineTo(carrotX - 10, carrotY + 10);
    ctx.lineTo(carrotX + 10, carrotY + 10);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#E07000";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // 条纹
    ctx.strokeStyle = "rgba(200,100,0,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(carrotX - 5, carrotY - 5);
    ctx.lineTo(carrotX + 3, carrotY - 8);
    ctx.moveTo(carrotX - 3, carrotY);
    ctx.lineTo(carrotX + 5, carrotY - 3);
    ctx.stroke();
    // 叶子
    ctx.fillStyle = "#22C55E";
    ctx.beginPath();
    ctx.ellipse(carrotX - 5, carrotY - 18, 3, 7, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(carrotX, carrotY - 20, 3, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(carrotX + 5, carrotY - 18, 3, 7, 0.3, 0, Math.PI * 2);
    ctx.fill();
    // 眼睛
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(carrotX - 3, carrotY - 5, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(carrotX + 3, carrotY - 5, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(carrotX - 2.5, carrotY - 5.5, 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(carrotX + 3.5, carrotY - 5.5, 0.6, 0, Math.PI * 2);
    ctx.fill();
    // 嘴巴
    ctx.strokeStyle = "#C05000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(carrotX, carrotY - 1, 2, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    /* --- 入口标记 --- */
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.beginPath();
    ctx.arc(WAYPOINTS[0].x, WAYPOINTS[0].y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(90,74,82,0.4)";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("\u5165\u53E3", WAYPOINTS[0].x, WAYPOINTS[0].y + 4);

    /* --- 绘制塔 --- */
    for (const tw of towers) {
      // 射程范围（半透明）
      ctx.fillStyle = tw.color;
      ctx.globalAlpha = 0.08;
      ctx.beginPath();
      ctx.arc(tw.x, tw.y, tw.range, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // 闪光动画
      if (tw.flashTimer > 0) {
        ctx.fillStyle = "rgba(255,215,0,0.3)";
        ctx.beginPath();
        ctx.arc(tw.x, tw.y, 18 + (20 - tw.flashTimer) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 底座
      ctx.fillStyle = tw.color;
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(tw.x, tw.y, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // 外环
      ctx.strokeStyle = tw.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(tw.x, tw.y, 14, 0, Math.PI * 2);
      ctx.stroke();

      // 内圆
      ctx.fillStyle = tw.color;
      ctx.beginPath();
      ctx.arc(tw.x, tw.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // 炮管
      const tt = TOWER_TYPES[tw.type];
      ctx.fillStyle = tt.colorLight;
      ctx.save();
      ctx.translate(tw.x, tw.y);
      ctx.rotate(tw.rot);
      ctx.fillRect(4, -3, 12, 6);
      ctx.restore();

      // 中心点
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(tw.x, tw.y, 3, 0, Math.PI * 2);
      ctx.fill();

      // 等级标识（小星星）
      if (tw.level >= 2) {
        ctx.fillStyle = "#FFD700";
        for (let s = 0; s < tw.level - 1; s++) {
          const sx = tw.x - (tw.level - 2) * 4 + s * 8;
          const sy = tw.y + 14;
          drawStar(ctx, sx, sy, 3);
        }
      }
    }

    /* --- 绘制敌人（可爱小怪物） --- */
    for (const en of enemies) {
      if (en.dead || en.reachedEnd) continue;
      drawCuteEnemy(ctx, en);
    }

    /* --- 绘制子弹 --- */
    for (const p of projectiles) {
      for (let t = 0; t < p.trail.length; t++) {
        const alpha = ((t + 1) / (p.trail.length + 1)) * 0.4;
        const r = p.type === "cannonball" ? 3 : 2;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(
          p.trail[t].x,
          p.trail[t].y,
          r * (t / p.trail.length),
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.type === "cannonball" ? 4 : 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.type === "cannonball" ? 2 : 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    /* --- 绘制粒子（支持星星形状） --- */
    for (const p of particles) {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      if (p.shape === "star") {
        drawStar(ctx, p.x, p.y, p.r * (p.life / p.maxLife));
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (p.life / p.maxLife), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    /* --- 鼠标预览 --- */
    const mp = mousePosRef.current;
    const st = selectedTowerRef.current;
    if (mp && st) {
      const tt = TOWER_TYPES[st];
      const placeable =
        canPlaceTower(mp.x, mp.y, towers) && goldRef.current >= tt.cost;

      ctx.strokeStyle = placeable
        ? "rgba(90,74,82,0.2)"
        : "rgba(200,100,100,0.3)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(mp.x, mp.y, tt.range, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.globalAlpha = placeable ? 0.5 : 0.25;
      ctx.fillStyle = tt.color;
      ctx.beginPath();
      ctx.arc(mp.x, mp.y, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      if (!placeable) {
        ctx.strokeStyle = "rgba(200,100,100,0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mp.x - 6, mp.y - 6);
        ctx.lineTo(mp.x + 6, mp.y + 6);
        ctx.moveTo(mp.x + 6, mp.y - 6);
        ctx.lineTo(mp.x - 6, mp.y + 6);
        ctx.stroke();
      }
    }

    /* --- 升级面板高亮 --- */
    const utw = upgradingTowerRef.current;
    if (utw) {
      ctx.strokeStyle = "rgba(255,215,0,0.6)";
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(utw.x, utw.y, utw.range, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 高亮选中塔
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(utw.x, utw.y, 18, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 循环结束
  }, []);

  // 启动动画循环
  useEffect(() => {
    animRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [loop]);

  /* ---------- UI 渲染 ---------- */
  const towerKeys: TowerType[] = ["shooter", "freezer", "cannon"];

  const upgradeCost = upgradingTower
    ? getUpgradeCost(upgradingTower.level)
    : 0;
  const canUpgrade =
    upgradingTower !== null &&
    upgradingTower.level < MAX_TOWER_LEVEL &&
    gold >= upgradeCost;

  return (
    <div style={styles.root}>
      <style>{`
        .sr-td-badge-wall {
          width: 100%; max-width: 720px; margin-top: 12px;
          padding: 16px; background: rgba(255,255,255,0.7);
          border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          max-height: 280px; overflow-y: auto;
        }
        .sr-td-badge-wall-title {
          font-size: 15px; font-weight: 700; color: #5a4a52;
          text-align: center; margin: 0 0 12px;
        }
        .sr-td-badge-wall-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 10px; justify-items: center;
        }
        .sr-td-badge-wall-item {
          display: flex; flex-direction: column; align-items: center;
          gap: 4px; padding: 8px;
        }
        .sr-td-badge-wall-icon {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: #fff; transition: all 0.3s;
        }
        .sr-td-badge-wall-name {
          font-size: 11px; font-weight: 600; text-align: center;
        }
        .sr-td-badge-wall-wave {
          font-size: 10px; color: #aaa;
        }
      `}</style>
      {/* HUD */}
      <div className="sr-td-header" style={styles.header}>
        <div className="sr-td-hud" style={styles.hud}>
          <span className="sr-td-gold" style={styles.goldBadge}>
            <span>&#9733;</span> {gold}
          </span>
          <span className="sr-td-wave" style={styles.waveBadge}>
            第 {wave}/{TOTAL_WAVES} 波
          </span>
          <span className="sr-td-lives" style={styles.livesBadge}>
            {"\u2764"} {lives}
          </span>
          <span style={{ color: "#FFD700", display: "flex", alignItems: "center", gap: 4, fontSize: 14, fontWeight: 600 }}>
            <span>&#9733;</span> {earnedBadges.length}/{BADGES.length}
          </span>
        </div>
      </div>

      {/* 塔选择栏 */}
      <div className="sr-td-tower-bar" style={styles.towerBar}>
        {towerKeys.map((key) => {
          const tt = TOWER_TYPES[key];
          const sel = selectedTower === key;
          const canAfford = gold >= tt.cost;
          return (
            <button
              key={key}
              className={`sr-td-tower-btn ${sel ? "sr-td-tower-btn--selected" : ""} ${
                !canAfford ? "sr-td-tower-btn--disabled" : ""
              }`}
              style={{
                ...styles.towerBtn,
                ...(sel
                  ? { ...styles.towerBtnSelected, borderColor: tt.color }
                  : {}),
                ...(!canAfford ? styles.towerBtnDisabled : {}),
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                if (canAfford) {
                  setSelectedTower(selectedTower === key ? null : key);
                  setUpgradingTower(null);
                }
              }}
            >
              <div
                className="sr-td-tower-icon"
                style={{
                  ...styles.towerIcon,
                  background: tt.color,
                  borderColor: tt.colorLight,
                }}
              />
              <span className="sr-td-tower-btn-label" style={styles.towerBtnLabel}>
                {tt.name}
              </span>
              <span className="sr-td-tower-btn-cost" style={styles.towerBtnCost}>
                {tt.cost} 金
              </span>
            </button>
          );
        })}
      </div>

      {/* Canvas 区域 */}
      <div className="sr-td-canvas-wrap" style={styles.canvasWrap}>
        <canvas
          ref={canvasRef}
          className="sr-td-canvas"
          style={styles.canvas}
          width={CANVAS_W}
          height={CANVAS_H}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        />

        {/* 开始波次按钮 */}
        {playing && !gameOver && !victory && !waveActive && wave < TOTAL_WAVES && (
          <div className="sr-td-start-wrap" style={styles.startBtnWrap}>
            <motion.button
              className="sr-td-start-btn"
              style={styles.startBtn}
              onPointerDown={startWave}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {wave === 0 ? "\u5F00\u59CB\u6E38\u620F" : `\u7B2C ${wave + 1} \u6CE2`}
            </motion.button>
          </div>
        )}

        {/* 初始开始按钮 */}
        {!playing && !gameOver && !victory && wave === 0 && (
          <div className="sr-td-start-wrap" style={styles.startBtnWrap}>
            <motion.button
              className="sr-td-start-btn"
              style={styles.startBtn}
              onPointerDown={startWave}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {"\u5F00\u59CB\u6E38\u620F"}
            </motion.button>
          </div>
        )}

        {/* 升级按钮 */}
        {upgradingTower && (
          <div className="sr-td-upgrade-wrap" style={styles.upgradeBtnWrap}>
            <motion.button
              className="sr-td-upgrade-btn"
              style={{
                ...styles.upgradeBtn,
                ...(!canUpgrade ? styles.upgradeBtnDisabled : {}),
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                if (canUpgrade) handleUpgrade();
              }}
              whileHover={{ scale: canUpgrade ? 1.05 : 1 }}
              whileTap={{ scale: canUpgrade ? 0.95 : 1 }}
            >
              {upgradingTower.level >= MAX_TOWER_LEVEL
                ? `\u6EE1\u7EA7 Lv.${upgradingTower.level}`
                : `\u5347\u7EA7 Lv.${upgradingTower.level}\u2192${upgradingTower.level + 1} (${upgradeCost}\u91D1)`}
            </motion.button>
          </div>
        )}

        {/* 徽章通知 */}
        <AnimatePresence>
          {badgeNotify && (
            <motion.div
              className="sr-td-achievement"
              style={{
                ...styles.achievementBadge,
                background: `${badgeNotify.color}30`,
                borderColor: `${badgeNotify.color}50`,
                color: badgeNotify.color,
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              &#9733; {badgeNotify.name}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 游戏结束覆盖层 */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              className="sr-td-overlay"
              style={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="sr-td-overlay-title"
                style={styles.overlayTitle}
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                {"\u6E38\u620F\u7ED3\u675F"}
              </motion.div>
              <motion.div
                className="sr-td-overlay-sub"
                style={styles.overlaySub}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {"\u575A\u6301\u5230\u4E86\u7B2C"} {wave} {"\u6CE2"}
              </motion.div>
              {/* 徽章展示 */}
              {earnedBadges.length > 0 && (
                <motion.div
                  style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", justifyContent: "center" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  {earnedBadges.map((bi) => (
                    <span
                      key={bi}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3,
                        padding: "3px 8px",
                        borderRadius: 10,
                        background: `${BADGES[bi].color}30`,
                        border: `1px solid ${BADGES[bi].color}50`,
                        color: BADGES[bi].color,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      &#9733; {BADGES[bi].name}
                    </span>
                  ))}
                </motion.div>
              )}
              <motion.button
                className="sr-td-restart-btn"
                style={styles.restartBtn}
                onPointerDown={restart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                {"\u91CD\u65B0\u5F00\u59CB"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 胜利覆盖层 */}
        <AnimatePresence>
          {victory && (
            <motion.div
              className="sr-td-overlay"
              style={{ ...styles.overlay, position: "relative" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <button className="sr-overlay-close" onClick={() => {
                restart();
              }} style={{ position: "absolute", top: 12, right: 14, background: "none", border: "none", fontSize: 20, color: "#aaa", cursor: "pointer", lineHeight: 1, zIndex: 101 }}>&times;</button>
              <motion.div
                className="sr-td-overlay-title"
                style={styles.overlayTitle}
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                {"\u841D\u535C\u5B89\u5168\u4E86!"}
              </motion.div>
              <motion.div
                className="sr-td-overlay-sub"
                style={styles.overlaySub}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {"\u6210\u529F\u5B88\u536B\u4E86\u5168\u90E8"} {TOTAL_WAVES} {"\u6CE2 | \u5269\u4F59\u751F\u547D: "}
                {lives} {" | \u5269\u4F59\u91D1\u5E01: "}
                {gold}
              </motion.div>
              {/* 徽章展示 */}
              {earnedBadges.length > 0 && (
                <motion.div
                  style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", justifyContent: "center" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  {earnedBadges.map((bi) => (
                    <span
                      key={bi}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3,
                        padding: "3px 8px",
                        borderRadius: 10,
                        background: `${BADGES[bi].color}30`,
                        border: `1px solid ${BADGES[bi].color}50`,
                        color: BADGES[bi].color,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      &#9733; {BADGES[bi].name}
                    </span>
                  ))}
                </motion.div>
              )}
              <motion.button
                className="sr-td-restart-btn"
                style={styles.restartBtn}
                onPointerDown={restart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                {"\u518D\u6765\u4E00\u6B21"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 徽章墙 - 在游戏结束或胜利时显示 */}
        {(state === "gameover" || state === "victory") && (
          <div className="sr-td-badge-wall">
            <h3 className="sr-td-badge-wall-title">徽章墙</h3>
            <div className="sr-td-badge-wall-grid">
              {BADGES.map((b, i) => {
                const earned = earnedBadges.includes(i);
                return (
                  <div key={i} className={`sr-td-badge-wall-item ${earned ? "earned" : ""}`}>
                    <div className="sr-td-badge-wall-icon" style={{
                      background: earned ? b.color : "#e0e0e0",
                      opacity: earned ? 1 : 0.5,
                    }}>
                      {earned ? "★" : "🔒"}
                    </div>
                    <span className="sr-td-badge-wall-name" style={{ color: earned ? b.color : "#aaa" }}>
                      {b.name}
                    </span>
                    <span className="sr-td-badge-wall-wave">第{b.wave}波</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TowerDefenseGame;
