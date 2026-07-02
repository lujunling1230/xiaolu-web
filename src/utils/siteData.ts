/**
 * siteData.ts
 *
 * 站点统一数据管理模块。
 *
 * 核心逻辑：
 * - 页面加载时，优先读取 localStorage 中的 life_film_site_seed。
 * - 若该 Key 不存在，则用 defaultData.js 进行初始化。严禁覆盖已有数据。
 *
 * 数据隔离策略：
 * - 管理员：直接读写原始 key（如 lf_reading），可编辑/删除源数据。
 * - 访客：读取时合并「原始数据 + 访客草稿」；写入时只保存增量到 draft_ 前缀。
 * - 访客的添加/上传操作不会污染 life_film_site_seed 或原始 key。
 * - 管理员「发布草稿」可将访客数据合并到主 seed。
 *
 * 安全红线：
 * - 代码中不得包含任何自动清空 localStorage 的逻辑。
 * - 删除数据需二次确认（由调用方实现）。
 */

import defaultData from "../data/defaultData.js";

export const SEED_KEY = "life_film_site_seed";
export const ADMIN_PASSWORD = "ling";

/** 管理员状态 */
let _isAdmin = false;

export function isAdmin(): boolean {
  return _isAdmin;
}

export function unlockAdmin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    _isAdmin = true;
    try {
      localStorage.setItem("life_film_admin", "1");
    } catch {}
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  _isAdmin = false;
  try {
    localStorage.removeItem("life_film_admin");
  } catch {}
}

export function loadAdminSession(): void {
  try {
    _isAdmin = localStorage.getItem("life_film_admin") === "1";
  } catch {
    _isAdmin = false;
  }
}

/** 初始化站点数据 */
export function initSiteData(): void {
  try {
    const existing = localStorage.getItem(SEED_KEY);
    if (existing) return; // 已存在，严禁覆盖
    localStorage.setItem(SEED_KEY, JSON.stringify(defaultData));
  } catch (e) {
    console.warn("[siteData] init failed:", e);
  }
}

/** 从主数据 seed 读取某个字段 */
export function getSeedData<T>(key: string, fallback?: T): T | undefined {
  try {
    const raw = localStorage.getItem(SEED_KEY);
    if (!raw) return fallback;
    const data = JSON.parse(raw);
    return data[key] !== undefined ? data[key] : fallback;
  } catch {
    return fallback;
  }
}

/** 向主数据 seed 写入某个字段（仅管理员） */
export function setSeedData(key: string, value: unknown): boolean {
  if (!_isAdmin) return false;
  try {
    const raw = localStorage.getItem(SEED_KEY);
    const data = raw ? JSON.parse(raw) : {};
    data[key] = value;
    localStorage.setItem(SEED_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn("[siteData] setSeedData failed:", e);
    return false;
  }
}

/**
 * 获取「基础数据」：原始 key → seed → fallback
 * 这是管理员/源数据层面的数据，不含访客草稿。
 */
function getBaseData(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      try { return JSON.parse(raw); } catch { return raw; }
    }
  } catch {}
  return getSeedData(key);
}

/**
 * 兼容旧 key 的读取：合并 base data + visitor draft data
 *
 * - 数组类型：base + draft 中不存在于 base 的条目（按 id 去重）
 * - 非数组类型：draft 优先（访客的值覆盖 base）
 */
export function legacyLoad<T>(key: string, fallback?: T): T | undefined {
  try {
    const base = getBaseData(key);

    const draftRaw = localStorage.getItem(`draft_${key}`);
    if (draftRaw === null) {
      return base !== undefined ? (base as T) : fallback;
    }

    const draft: unknown = JSON.parse(draftRaw);

    // 数组：合并 base + draft（按 id 去重）
    if (Array.isArray(base) && Array.isArray(draft)) {
      const baseIds = new Set(
        (base as any[]).map((item: any) => item.id).filter(Boolean)
      );
      const merged = [...(base as any[])];
      for (const item of draft as any[]) {
        if (item.id && baseIds.has(item.id)) continue; // 跳过已存在的
        merged.push(item);
      }
      return merged as T;
    }

    // 非数组：draft 优先
    return draft as T;
  } catch {
    return fallback;
  }
}

/**
 * 兼容旧 key 的保存：管理员写原 key，访客只写增量到 draft_
 *
 * - 管理员：直接覆盖原始 key（这就是源数据）
 * - 访客（数组）：对比 base，只保存不存在于 base 中的条目到 draft_
 * - 访客（非数组）：直接保存到 draft_
 */
export function legacySave(key: string, value: unknown): void {
  try {
    if (isAdmin()) {
      // 管理员：直接写原始 key
      const toSave = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, toSave);
    } else {
      // 访客：只保存增量到 draft_ key
      const base = getBaseData(key);

      if (Array.isArray(value) && Array.isArray(base)) {
        // 数组：过滤掉已存在于 base 中的条目，只保存访客新增的
        const baseIds = new Set(
          (base as any[]).map((item: any) => item.id).filter(Boolean)
        );
        const visitorItems = (value as any[]).filter(
          (item: any) => !item.id || !baseIds.has(item.id)
        );
        if (visitorItems.length > 0) {
          localStorage.setItem(`draft_${key}`, JSON.stringify(visitorItems));
        }
      } else {
        // 非数组：直接保存到 draft_
        const toSave = typeof value === "string" ? value : JSON.stringify(value);
        localStorage.setItem(`draft_${key}`, toSave);
      }
    }
  } catch (e) {
    console.warn("[siteData] legacySave failed:", e);
  }
}

/** 读取本地存储（新版，使用 effective key 隔离） */
export function siteLoad<T>(key: string, fallback?: T): T | undefined {
  const effectiveKey = isAdmin() ? key : `draft_${key}`;
  try {
    const raw = localStorage.getItem(effectiveKey);
    if (raw !== null) {
      try { return JSON.parse(raw) as T; } catch { return raw as unknown as T; }
    }
    // 回退到主数据 seed
    const seedVal = getSeedData<T>(key);
    if (seedVal !== undefined) return seedVal;
  } catch {}
  return fallback;
}

/** 保存到本地存储（管理员写原 key，访客写 draft_） */
export function siteSave(key: string, value: unknown): void {
  const effectiveKey = isAdmin() ? key : `draft_${key}`;
  try {
    const toSave = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(effectiveKey, toSave);
  } catch (e) {
    console.warn("[siteData] siteSave failed:", e);
  }
}

/** 显式保存到 draft（管理员编辑时也先写入 draft，再统一发布） */
export function saveDraft(key: string, value: unknown): void {
  try {
    const toSave = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(`draft_${key}`, toSave);
  } catch (e) {
    console.warn("[siteData] saveDraft failed:", e);
  }
}

/** 管理员发布：将 draft 数据合并到主 seed */
export function publishDrafts(): { success: boolean; merged: string[] } {
  if (!_isAdmin) return { success: false, merged: [] };
  const merged: string[] = [];
  try {
    const seedRaw = localStorage.getItem(SEED_KEY);
    const seed = seedRaw ? JSON.parse(seedRaw) : {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("draft_")) continue;
      const realKey = key.slice(6);
      const val = localStorage.getItem(key);
      if (val === null) continue;

      // 合并策略：数组则拼接去重，其他则覆盖
      try {
        const draftData = JSON.parse(val);
        const existing = seed[realKey];
        if (Array.isArray(existing) && Array.isArray(draftData)) {
          const existingIds = new Set(existing.map((item: any) => item.id).filter(Boolean));
          const newItems = draftData.filter((item: any) => !item.id || !existingIds.has(item.id));
          seed[realKey] = [...existing, ...newItems];
        } else {
          seed[realKey] = draftData;
        }
      } catch {
        seed[realKey] = val;
      }
      merged.push(realKey);
      localStorage.removeItem(key);
    }

    localStorage.setItem(SEED_KEY, JSON.stringify(seed));
    return { success: true, merged };
  } catch (e) {
    console.warn("[siteData] publish failed:", e);
    return { success: false, merged };
  }
}
