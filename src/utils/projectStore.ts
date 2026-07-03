import { Project } from "../data/projects";
import { DEFAULT_PROJECTS } from "../data/projects";

const STORAGE_KEY = "portfolio_projects_v1";
const API_URL = "/api/projects";

/* ================================================================
 * 本地缓存层（localStorage）
 * 保留原有同步接口，确保组件初次渲染不阻塞
 * ================================================================ */

/** 从 localStorage 读取项目，首次访问或数据异常时写入默认值 */
export function getProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
  return [...DEFAULT_PROJECTS];
}

/** 写入 localStorage */
export function saveProjects(projects: Project[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function addProject(project: Project): void {
  const list = getProjects();
  list.push(project);
  saveProjects(list);
}

export function updateProject(id: string, updates: Partial<Project>): void {
  const list = getProjects();
  const idx = list.findIndex((p) => p.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...updates };
    saveProjects(list);
  }
}

export function deleteProject(id: string): void {
  const list = getProjects().filter((p) => p.id !== id);
  saveProjects(list);
}

export function resetProjects(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
}

/* ================================================================
 * 远程同步层（Serverless API -> GitHub）
 * ================================================================ */

/**
 * 从服务端拉取最新项目数据，成功后更新 localStorage 缓存
 * @returns 远程数据或 null（失败时）
 */
export async function fetchProjects(): Promise<Project[] | null> {
  try {
    const res = await fetch(API_URL, { method: "GET" });
    if (!res.ok) {
      if (res.status === 404) {
        console.info("[projectStore] 远程数据尚未初始化，使用本地默认值");
        return null;
      }
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const data = (await res.json()) as Project[];
    saveProjects(data);
    return data;
  } catch (e) {
    console.warn("[projectStore] fetchProjects failed:", e);
    return null;
  }
}

/**
 * 将当前 localStorage 中的项目数据推送到服务端
 * 管理员操作成功后调用
 * @param password 管理员密码
 */
export async function pushProjects(password: string): Promise<boolean> {
  const projects = getProjects();
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, projects }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return true;
  } catch (e) {
    console.warn("[projectStore] pushProjects failed:", e);
    return false;
  }
}
