/**
 * userStorage.ts
 *
 * 用户隔离的 localStorage 封装
 * - 登录用户：数据自动带上 `u_{username}_` 前缀
 * - 未登录访客：使用原始 key（向后兼容）
 * - 所有工具页面的 localStorage 读写应通过此模块
 */

import { getUserStorageKey, getCurrentUsername } from "./userAuth";

/** 读取当前用户隔离的数据 */
export function userGetItem<T>(baseKey: string, fallback?: T): T | undefined {
  try {
    const key = getUserStorageKey(baseKey);
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as unknown as T;
      }
    }
  } catch {
    /* ignore */
  }
  return fallback;
}

/** 写入当前用户隔离的数据 */
export function userSetItem(baseKey: string, value: unknown): void {
  try {
    const key = getUserStorageKey(baseKey);
    const toSave = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, toSave);
  } catch (e) {
    console.warn("[userStorage] setItem failed:", e);
  }
}

/** 删除当前用户隔离的数据 */
export function userRemoveItem(baseKey: string): void {
  try {
    const key = getUserStorageKey(baseKey);
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** 读取原始 key（不隔离，用于站点级配置） */
export function rawGetItem<T>(key: string, fallback?: T): T | undefined {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as unknown as T;
      }
    }
  } catch {
    /* ignore */
  }
  return fallback;
}

/** 写入原始 key */
export function rawSetItem(key: string, value: unknown): void {
  try {
    const toSave = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, toSave);
  } catch (e) {
    console.warn("[userStorage] rawSetItem failed:", e);
  }
}

/** 获取当前用户信息摘要（调试用） */
export function getUserStorageInfo(): { username: string | null; prefix: string } {
  return {
    username: getCurrentUsername(),
    prefix: getUserStorageKey(""),
  };
}
