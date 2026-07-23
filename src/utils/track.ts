/* ============================================================
 * Analytics / Track 埋点系统
 * 双写：localStorage（离线兜底）+ Vercel Blob API（跨设备累计）
 * ============================================================ */

export interface TrackEvent {
  id: string;
  name: string;
  props?: Record<string, unknown>;
  ts: number;
  session: string;
  path: string;
}

const STORAGE_KEY = "luro_analytics_events";
const SESSION_KEY = "luro_analytics_session";
const MAX_LOCAL_EVENTS = 2000;
const API_BASE = "/api/analytics";

/** 检测是否部署在 Vercel（有 API 可用） */
function isCloudAvailable(): boolean {
  return typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";
}

/** 生成会话 ID */
function getSessionId(): string {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const sid = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  sessionStorage.setItem(SESSION_KEY, sid);
  return sid;
}

/* ---- localStorage 读写 ---- */

function readLocalEvents(): TrackEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as TrackEvent[];
  } catch {
    return [];
  }
}

function saveLocalEvents(events: TrackEvent[]) {
  try {
    const trimmed = events.length > MAX_LOCAL_EVENTS ? events.slice(-MAX_LOCAL_EVENTS) : events;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage 满了则静默失败
  }
}

/* ---- 云端同步 ---- */

/** 批量上报本地积压事件到云端（页面卸载或定期触发） */
async function syncToCloud() {
  if (!isCloudAvailable()) return;
  try {
    const local = readLocalEvents();
    if (local.length === 0) return;
    // 检查哪些还没同步过
    const synced = new Set(JSON.parse(localStorage.getItem("luro_analytics_synced") || "[]"));
    const pending = local.filter((e) => !synced.has(e.id));
    if (pending.length === 0) return;
    // 逐条发送（轻量，不怕失败）
    for (const evt of pending) {
      try {
        await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(evt),
        });
        synced.add(evt.id);
      } catch {
        break; // 网络断了就停
      }
    }
    localStorage.setItem("luro_analytics_synced", JSON.stringify([...synced]));
  } catch {
    // 静默失败
  }
}

/** 立即发送单条事件到云端（不经过本地积压） */
function sendToCloud(evt: TrackEvent) {
  if (!isCloudAvailable()) return;
  // 用 sendBeacon 保证页面关闭时也能发
  const payload = JSON.stringify(evt);
  if (navigator.sendBeacon) {
    navigator.sendBeacon(API_BASE, payload);
  } else {
    fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    }).catch(() => {});
  }
}

/* ---- 核心 track ---- */

/** 核心 track 函数 */
export function track(eventName: string, props?: Record<string, unknown>) {
  const evt: TrackEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: eventName,
    props,
    ts: Date.now(),
    session: getSessionId(),
    path: window.location.pathname + window.location.search,
  };

  // 1. 始终写本地
  const all = readLocalEvents();
  all.push(evt);
  saveLocalEvents(all);

  // 2. 云端环境直接发送
  sendToCloud(evt);

  // 3. 同步到 Google Analytics 4（如果已加载）
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, props);
  }

  // 4. 同步到 Mixpanel（如果已加载）
  if (typeof window !== "undefined" && (window as any).mixpanel) {
    (window as any).mixpanel.track(eventName, props);
  }

  // 调试用
  if (import.meta.env.DEV) {
    console.log("[Track]", eventName, props);
  }
}

/* ---- 数据读取（看板用） ---- */

/** 从云端拉取事件 */
export async function fetchCloudEvents(hours?: number): Promise<TrackEvent[]> {
  if (!isCloudAvailable()) return [];
  try {
    const url = hours ? `${API_BASE}?hours=${hours}` : API_BASE;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.events || [];
  } catch {
    return [];
  }
}

/** 获取全部事件（本地优先，云端补充） */
export function getAllEvents(): TrackEvent[] {
  return readLocalEvents();
}

/** 按事件名筛选 */
export function getEventsByName(name: string, events?: TrackEvent[]): TrackEvent[] {
  const src = events || getAllEvents();
  return src.filter((e) => e.name === name);
}

/** 按时间范围筛选（最近 N 小时） */
export function getEventsLastHours(hours: number, events?: TrackEvent[]): TrackEvent[] {
  const src = events || getAllEvents();
  const cutoff = Date.now() - hours * 3600_000;
  return src.filter((e) => e.ts >= cutoff);
}

/** 统计某事件的总次数 */
export function countEvent(name: string, hours?: number, events?: TrackEvent[]): number {
  const src = events
    ? (hours ? getEventsLastHours(hours, events) : events)
    : (hours ? getEventsLastHours(hours) : getAllEvents());
  return src.filter((e) => e.name === name).length;
}

/** 统计独立会话数 */
export function uniqueSessions(hours?: number, events?: TrackEvent[]): number {
  const src = events
    ? (hours ? getEventsLastHours(hours, events) : events)
    : (hours ? getEventsLastHours(hours) : getAllEvents());
  return new Set(src.map((e) => e.session)).size;
}

/** 统计独立页面访问 */
export function uniquePageViews(hours?: number, events?: TrackEvent[]): number {
  const src = events
    ? (hours ? getEventsLastHours(hours, events) : events)
    : (hours ? getEventsLastHours(hours) : getAllEvents());
  return new Set(src.filter((e) => e.name === "page_view").map((e) => e.session)).size;
}

/** 漏斗分析 */
export function funnel(
  steps: string[],
  hours?: number,
  events?: TrackEvent[]
): { step: string; count: number; rate: number }[] {
  const src = events
    ? (hours ? getEventsLastHours(hours, events) : events)
    : (hours ? getEventsLastHours(hours) : getAllEvents());
  const sessions = new Set(src.map((e) => e.session));
  let prevCount = sessions.size;

  return steps.map((step) => {
    const stepSessions = new Set(
      src.filter((e) => e.name === step).map((e) => e.session)
    );
    const count = stepSessions.size;
    const rate = prevCount > 0 ? Math.round((count / prevCount) * 1000) / 10 : 0;
    prevCount = count;
    return { step, count, rate };
  });
}

/** 获取最常触发的事件 TOP N */
export function topEvents(n = 10, hours?: number, events?: TrackEvent[]): { name: string; count: number }[] {
  const src = events
    ? (hours ? getEventsLastHours(hours, events) : events)
    : (hours ? getEventsLastHours(hours) : getAllEvents());
  const map = new Map<string, number>();
  src.forEach((e) => {
    map.set(e.name, (map.get(e.name) || 0) + 1);
  });
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, count]) => ({ name, count }));
}

/** 按天统计事件趋势 */
export function dailyTrend(days = 7, events?: TrackEvent[]): { date: string; count: number }[] {
  const src = events || getAllEvents();
  const result: { date: string; count: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const start = new Date(dateStr).getTime();
    const end = start + 86400_000;
    const count = src.filter((e) => e.ts >= start && e.ts < end).length;
    result.push({ date: dateStr.slice(5), count });
  }
  return result;
}

/** 清除本地数据 */
export function clearAnalytics() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("luro_analytics_synced");
}

/** 清除云端数据（需密码） */
export async function clearCloudAnalytics(password: string): Promise<boolean> {
  try {
    const res = await fetch(API_BASE, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** 导出为 CSV */
export function exportCSV(events?: TrackEvent[]): string {
  const src = events || getAllEvents();
  const headers = ["time", "event", "path", "session", "props"];
  const rows = src.map((e) => [
    new Date(e.ts).toLocaleString("zh-CN"),
    e.name,
    e.path,
    e.session.slice(0, 12),
    JSON.stringify(e.props ?? {}),
  ]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/** 自动追踪页面访问 */
export function initPageTracking() {
  const trackPage = () => {
    track("page_view", {
      path: window.location.pathname,
      title: document.title,
    });
  };
  trackPage();
  const origPush = history.pushState;
  history.pushState = function (...args) {
    origPush.apply(this, args);
    setTimeout(trackPage, 100);
  };
  window.addEventListener("popstate", trackPage);

  // 页面关闭前同步积压数据
  window.addEventListener("beforeunload", () => {
    syncToCloud();
  });

  // 每 30 秒同步一次积压数据
  setInterval(syncToCloud, 30000);
}
