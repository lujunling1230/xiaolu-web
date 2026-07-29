/**
 * 通用积分打卡模块
 *
 * 为所有产品提供统一的每日签到 + 积分体系。
 * 每个产品独立存储，互不干扰。
 *
 * 数据存储：
 * - uc_checkin_{productId}: 签到数据 { lastDate, streak, totalDays }
 * - uc_points_{productId}: 总积分
 * - uc_points_history_{productId}: 积分变动记录
 *
 * 通过 userStorage 实现用户隔离。
 */

import { userGetItem, userSetItem } from "../../utils/userStorage";

export interface CheckinData {
  lastDate: string; // YYYY-MM-DD
  streak: number;
  totalDays: number;
}

export interface PointRecord {
  id: string;
  type: "checkin" | "streak_bonus" | "cross_reward" | "other";
  points: number;
  desc: string;
  ts: number;
}

/* ========== 工具函数 ========== */

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isConsecutive(prevDate: string, today: string): boolean {
  if (!prevDate) return false;
  const prev = new Date(prevDate + "T00:00:00");
  const now = new Date(today + "T00:00:00");
  return Math.round((now.getTime() - prev.getTime()) / 86400000) === 1;
}

function load<T>(key: string, fallback: T): T {
  try {
    return userGetItem<T>(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  try {
    userSetItem(key, value);
  } catch { /* ignore */ }
}

/* ========== 公开 API ========== */

/**
 * 每日签到
 * @returns 签到结果
 */
export function doCheckin(productId: string): {
  success: boolean;
  pointsEarned: number;
  streak: number;
  totalDays: number;
  totalPoints: number;
  isStreakBonus: boolean;
} {
  const today = todayStr();
  const ckKey = `uc_checkin_${productId}`;
  const ptKey = `uc_points_${productId}`;
  const histKey = `uc_points_history_${productId}`;

  const data = load<CheckinData>(ckKey, { lastDate: "", streak: 0, totalDays: 0 });
  if (data.lastDate === today) {
    return {
      success: false,
      pointsEarned: 0,
      streak: data.streak,
      totalDays: data.totalDays,
      totalPoints: load<number>(ptKey, 0),
      isStreakBonus: false,
    };
  }

  let newStreak = 1;
  if (isConsecutive(data.lastDate, today)) {
    newStreak = data.streak + 1;
  }
  const totalDays = data.totalDays + 1;

  // 积分计算：签到+3，连续7天额外+10，连续30天额外+30
  let points = 3;
  let isStreakBonus = false;
  if (newStreak === 7 || newStreak === 14 || newStreak === 21) {
    points += 10;
    isStreakBonus = true;
  }
  if (newStreak === 30 || newStreak === 60) {
    points += 30;
    isStreakBonus = true;
  }

  // 保存签到数据
  save(ckKey, { lastDate: today, streak: newStreak, totalDays });

  // 添加积分
  const current = load<number>(ptKey, 0);
  const newTotal = current + points;
  save(ptKey, newTotal);

  // 积分历史
  const history = load<PointRecord[]>(histKey, []);
  history.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: isStreakBonus ? "streak_bonus" : "checkin",
    points,
    desc: isStreakBonus
      ? `连续签到 ${newStreak} 天，获得 ${points} 积分`
      : `每日签到，获得 ${points} 积分`,
    ts: Date.now(),
  });
  if (history.length > 50) history.length = 50;
  save(histKey, history);

  return { success: true, pointsEarned: points, streak: newStreak, totalDays, totalPoints: newTotal, isStreakBonus };
}

/** 获取签到数据 */
export function getCheckinData(productId: string): CheckinData {
  return load<CheckinData>(`uc_checkin_${productId}`, { lastDate: "", streak: 0, totalDays: 0 });
}

/** 是否今日已签到 */
export function hasCheckedInToday(productId: string): boolean {
  const data = getCheckinData(productId);
  return data.lastDate === todayStr();
}

/** 获取总积分 */
export function getPoints(productId: string): number {
  return load<number>(`uc_points_${productId}`, 0);
}

/** 手动增加积分（如体验卡领取） */
export function addPoints(productId: string, type: PointRecord["type"], points: number, desc: string): number {
  const ptKey = `uc_points_${productId}`;
  const histKey = `uc_points_history_${productId}`;
  const current = load<number>(ptKey, 0);
  const newTotal = current + points;
  save(ptKey, newTotal);

  const history = load<PointRecord[]>(histKey, []);
  history.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type, points, desc, ts: Date.now(),
  });
  if (history.length > 50) history.length = 50;
  save(histKey, history);
  return newTotal;
}

/**
 * 获取签到日历数据（最近30天）
 * 返回 [day, count] 数组，count = 0(未签) | 1(已签)
 */
export function getCheckinCalendar(productId: string, days: number = 30): { date: string; done: boolean }[] {
  const data = getCheckinData(productId);
  const result: { date: string; done: boolean }[] = [];
  const d = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const cur = new Date(d);
    cur.setDate(cur.getDate() - i);
    const str = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
    // 简单判断：如果日期 <= lastDate 且在连续范围内则标记为已签
    // 更精确的做法是存储每天记录，但为了轻量用 streak + lastDate 推算
    result.push({ date: str, done: false });
  }

  // 从 lastDate 往前推 streak 天标记
  if (data.lastDate && data.streak > 0) {
    const lastD = new Date(data.lastDate + "T00:00:00");
    for (let s = 0; s < data.streak; s++) {
      const cur = new Date(lastD);
      cur.setDate(cur.getDate() - s);
      const str = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
      const idx = result.findIndex(r => r.date === str);
      if (idx >= 0) result[idx].done = true;
    }
  }

  return result;
}

/* ========== 产品ID映射 ========== */
export const PRODUCT_IDS: Record<string, string> = {
  "森林疗愈室": "healing",
  "系统调频": "system_tuning",
  "物资管家": "inventory",
  "万能百事通": "advice",
  "漫游指南": "travel",
  "伴龄": "banling",
  "回血清单": "recharge",
  "通关清单": "quest",
} as const;
