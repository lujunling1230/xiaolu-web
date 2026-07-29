/**
 * 回血清单 · 积分体系
 *
 * 积分规则：
 * - 每日签到：+5 积分
 * - 完成一件小事：+2 积分
 * - 连续签到 7 天：额外 +10 积分
 * - 连续签到 30 天：额外 +50 积分
 * - 获得徽章：+10 积分
 *
 * 数据存储在 localStorage 中（key: recharge_points 等），
 * 通过 userStorage 实现用户隔离。
 */

import { userGetItem, userSetItem } from "../../utils/userStorage";

export interface PointRecord {
  id: string;
  type: "checkin" | "complete_task" | "streak_bonus" | "badge" | "other";
  points: number;
  desc: string;
  ts: number;
}

export interface CheckinData {
  lastDate: string; // YYYY-MM-DD
  streak: number;
}

const POINTS_KEY = "recharge_points";
const HISTORY_KEY = "recharge_points_history";
const CHECKIN_KEY = "recharge_checkin";

/** 获取当前总积分 */
export function getPoints(): number {
  try {
    const raw = userGetItem<string>(POINTS_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

/** 设置总积分 */
function setPoints(points: number): void {
  try {
    userSetItem(POINTS_KEY, String(Math.max(0, points)));
  } catch { /* ignore */ }
}

/** 获取积分变动历史 */
export function getPointsHistory(): PointRecord[] {
  try {
    return userGetItem<PointRecord[]>(HISTORY_KEY) || [];
  } catch {
    return [];
  }
}

/** 添加积分记录 */
function addPointRecord(record: PointRecord): void {
  try {
    const history = getPointsHistory();
    history.unshift(record);
    // 只保留最近 100 条
    if (history.length > 100) history.length = 100;
    userSetItem(HISTORY_KEY, history);
  } catch { /* ignore */ }
}

/** 增加积分 */
export function addPoints(
  type: PointRecord["type"],
  points: number,
  desc: string
): number {
  const current = getPoints();
  const newTotal = current + points;
  setPoints(newTotal);
  addPointRecord({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    points,
    desc,
    ts: Date.now(),
  });
  return newTotal;
}

/** 获取今日日期字符串 YYYY-MM-DD */
export function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** 获取签到数据 */
export function getCheckinData(): CheckinData {
  try {
    return userGetItem<CheckinData>(CHECKIN_KEY) || { lastDate: "", streak: 0 };
  } catch { /* ignore */ }
  return { lastDate: "", streak: 0 };
}

/** 保存签到数据 */
function setCheckinData(data: CheckinData): void {
  try {
    userSetItem(CHECKIN_KEY, data);
  } catch { /* ignore */ }
}

/** 计算两个日期字符串之间是否相差 1 天 */
function isConsecutive(prevDate: string, today: string): boolean {
  if (!prevDate) return false;
  const prev = new Date(prevDate + "T00:00:00");
  const now = new Date(today + "T00:00:00");
  const diffMs = now.getTime() - prev.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays === 1;
}

/** 检查今日是否已签到 */
export function hasCheckedInToday(): boolean {
  const data = getCheckinData();
  return data.lastDate === getTodayStr();
}

/** 执行每日签到，返回获得的积分和新的连续天数 */
export function doCheckin(): {
  success: boolean;
  pointsEarned: number;
  streak: number;
  totalPoints: number;
  isStreakBonus: boolean;
} {
  const today = getTodayStr();
  const data = getCheckinData();

  // 已经签到过了
  if (data.lastDate === today) {
    return {
      success: false,
      pointsEarned: 0,
      streak: data.streak,
      totalPoints: getPoints(),
      isStreakBonus: false,
    };
  }

  // 计算连续天数
  let newStreak = 1;
  if (isConsecutive(data.lastDate, today)) {
    newStreak = data.streak + 1;
  }

  // 基础签到积分
  let pointsEarned = 5;
  let isStreakBonus = false;

  // 连续 7 天额外奖励
  if (newStreak === 7) {
    pointsEarned += 10;
    isStreakBonus = true;
  }

  // 连续 30 天额外奖励
  if (newStreak === 30) {
    pointsEarned += 50;
    isStreakBonus = true;
  }

  // 保存签到数据
  setCheckinData({ lastDate: today, streak: newStreak });

  // 添加积分
  const totalPoints = addPoints(
    "checkin",
    pointsEarned,
    isStreakBonus
      ? `连续签到 ${newStreak} 天，获得 ${pointsEarned} 积分`
      : `每日签到，获得 ${pointsEarned} 积分`
  );

  return {
    success: true,
    pointsEarned,
    streak: newStreak,
    totalPoints,
    isStreakBonus,
  };
}

/** 完成任务时获得积分 */
export function addTaskCompletePoints(taskName: string): number {
  return addPoints("complete_task", 2, `完成小事：${taskName}`);
}

/** 获得徽章时获得积分 */
export function addBadgePoints(badgeName: string): number {
  return addPoints("badge", 10, `获得徽章：${badgeName}`);
}
