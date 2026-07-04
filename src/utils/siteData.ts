/**
 * siteData.ts
 *
 * 站点统一数据管理模块（重构版）。
 *
 * 核心原则：
 * - SEED_KEY (life_film_site_seed) 是唯一的数据源，存储所有模块数据。
 * - 管理员编辑数据时，直接写入 SEED_KEY（不再经过原始 key 或 draft）。
 * - 访客添加数据时，写入 draft_* 前缀，不影响 SEED_KEY。
 * - 发布 = 将 SEED_KEY 推送到远程服务器（pushSiteData）。
 * - "合并访客草稿" = 将 draft_* 中的新条目追加到 SEED_KEY（publishDrafts）。
 * - 页面加载时 fetchSiteData() 更新 SEED_KEY，所有组件从 SEED_KEY 读取。
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

/** 初始化站点数据（仅在 SEED_KEY 不存在时写入默认值） */
export function initSiteData(): void {
  try {
    const existing = localStorage.getItem(SEED_KEY);
    if (existing) return;
    localStorage.setItem(SEED_KEY, JSON.stringify(defaultData));
  } catch (e) {
    console.warn("[siteData] init failed:", e);
  }
}

/** 从 SEED_KEY 读取某个字段 */
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

/** 向 SEED_KEY 写入某个字段 */
export function setSeedData(key: string, value: unknown): boolean {
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
 * 读取数据：SEED_KEY + 访客 draft 合并
 *
 * 优先级：
 * 1. SEED_KEY 中的数据（管理员发布的数据 + 远程同步的数据）
 * 2. draft_* 中的访客增量数据
 * 3. fallback 默认值
 */
export function legacyLoad<T>(key: string, fallback?: T): T | undefined {
  try {
    // 始终从 SEED_KEY 读取基础数据
    const base = getSeedData(key);

    const draftRaw = localStorage.getItem(`draft_${key}`);
    if (draftRaw === null) {
      return base !== undefined ? (base as T) : fallback;
    }

    const draft: unknown = JSON.parse(draftRaw);

    // 数组：合并 base + draft（按 id 去重，访客新增的追加到末尾）
    if (Array.isArray(base) && Array.isArray(draft)) {
      const baseIds = new Set(
        (base as any[]).map((item: any) => item.id).filter(Boolean)
      );
      const merged = [...(base as any[])];
      for (const item of draft as any[]) {
        if (item.id && baseIds.has(item.id)) continue;
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
 * 保存数据
 *
 * - 管理员：直接写入 SEED_KEY（这就是源数据，即时生效）
 * - 访客：只保存增量到 draft_* key
 */
export function legacySave(key: string, value: unknown): void {
  try {
    if (isAdmin()) {
      // 管理员：直接写 SEED_KEY
      setSeedData(key, value);
    } else {
      // 访客：只保存增量到 draft_ key
      const base = getSeedData(key);

      if (Array.isArray(value) && Array.isArray(base)) {
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

/**
 * 管理员发布：将访客 draft 数据合并到 SEED_KEY
 *
 * 合并策略（数组）：以 draft 为准覆盖已有 id，追加新 id
 * 合并策略（非数组）：draft 覆盖
 */
export function publishDrafts(): { success: boolean; merged: string[] } {
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

      try {
        const draftData = JSON.parse(val);
        const existing = seed[realKey];
        if (Array.isArray(existing) && Array.isArray(draftData)) {
          // 以 draft 为准：draft 中有的 id 覆盖 base 中同 id 的条目
          const draftMap = new Map(
            draftData.filter((item: any) => item.id).map((item: any) => [item.id, item])
          );
          const mergedArr = existing.map((item: any) =>
            item.id && draftMap.has(item.id) ? draftMap.get(item.id) : item
          );
          // 追加 draft 中不存在于 base 的新条目
          const existingIds = new Set(existing.map((item: any) => item.id).filter(Boolean));
          for (const item of draftData) {
            if (!item.id || !existingIds.has(item.id)) mergedArr.push(item);
          }
          seed[realKey] = mergedArr;
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

/* ================================================================
 * 远程同步层（Serverless API -> GitHub）
 * ================================================================ */

const API_URL = "/api/site-data";

/**
 * 从服务端拉取最新站点数据，成功后更新 SEED_KEY
 * @returns 远程数据或 null（失败时）
 */
export async function fetchSiteData(): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(API_URL, { method: "GET" });
    if (!res.ok) {
      if (res.status === 404) {
        console.info("[siteData] 远程数据尚未初始化，使用本地默认值");
        return null;
      }
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const data = (await res.json()) as Record<string, unknown>;
    localStorage.setItem(SEED_KEY, JSON.stringify(data));
    return data;
  } catch (e) {
    console.warn("[siteData] fetchSiteData failed:", e);
    return null;
  }
}

/**
 * 将 SEED_KEY 数据推送到服务端
 * @param password 管理员密码
 */
export async function pushSiteData(password: string): Promise<boolean> {
  try {
    const seedRaw = localStorage.getItem(SEED_KEY);
    const data = seedRaw ? JSON.parse(seedRaw) : {};
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, data }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return true;
  } catch (e) {
    console.warn("[siteData] pushSiteData failed:", e);
    return false;
  }
}
