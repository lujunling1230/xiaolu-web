/* ============================================================
 * Analytics / Track 埋点系统 v2
 * - P0 事件白名单 + Props 轻量校验
 * - 匿名访客 ID (anon_id) 用于 UV 统计
 * - 批量上报（队列满 10 条或 5 秒 flush，sendBeacon 兜底）
 * - 双写：localStorage（离线兜底）+ Vercel Blob API（跨设备）
 * ============================================================ */

export interface TrackEvent {
  id: string;
  name: string;
  props?: Record<string, unknown>;
  ts: number;
  session: string;
  anon_id: string;
  path: string;
}

/* ---- P0 事件白名单 ---- */
const ALLOWED_EVENTS = [
  "page_view",
  "nav_click",
  "tool_enter",
  "contact_submit",
  "rg_ai_open",
  "rg_ai_recommend_submit",
  "rg_ai_recommend_result",
  "rg_ai_adopt_city",
  "rg_ai_generate_submit",
  "rg_ai_generate_result",
  "rg_ai_save_plan",
  "iv_tab_switch",
  "iv_item_add",
  "iv_ai_ask",
  "iv_ai_answer",
  "iv_ai_api_fail",
  "xiaoye_open",
  "xiaoye_chat",
] as const;

const EVENT_SET = new Set<string>(ALLOWED_EVENTS);

/* ---- 轻量 Props 校验（仅校验关键字段，不过度设计） ---- */
function validateProps(name: string, p: Record<string, unknown>): boolean {
  switch (name) {
    case "nav_click":  return typeof p.nav_item === "string" && p.nav_item.length <= 50;
    case "tool_enter": return typeof p.tool_name === "string" && p.tool_name.length <= 50;
    default:           return true;
  }
}

/* ---- 常量 ---- */
const STORAGE_KEY = "luro_analytics_events";
const SESSION_KEY = "luro_analytics_session";
const ANON_KEY = "luro_anon_id";
const MAX_LOCAL_EVENTS = 2000;
/* 使用绝对路径确保裸域 / 局域网访问时 API 也能正确到达 */
const API_BASE = "https://www.xiaoluweb.com/api/analytics";
const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 5000;

/* ---- 环境检测 ---- */
function isCloudAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  );
}

/* ---- 匿名访客 ID（持久化，用于 UV 去重） ---- */
function getAnonId(): string {
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (id) return id;
    id = `anon_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(ANON_KEY, id);
    return id;
  } catch {
    return `anon_${Date.now()}`;
  }
}

/* ---- 会话 ID（标签页级别） ---- */
function getSessionId(): string {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const sid = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  sessionStorage.setItem(SESSION_KEY, sid);
  return sid;
}

/* ============================================================
 * 批量上报队列
 * 满 10 条立即发送，否则每 5 秒 flush
 * 页面卸载时 sendBeacon 兜底
 * ============================================================ */
let batchQueue: TrackEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;

function startFlushTimer() {
  if (flushTimer) return;
  flushTimer = setInterval(flushBatch, FLUSH_INTERVAL);
}

function flushBatch() {
  if (batchQueue.length === 0) return;
  if (!isCloudAvailable()) {
    batchQueue = [];
    return;
  }
  const batch = batchQueue.splice(0, BATCH_SIZE);
  const payload = JSON.stringify(batch);
  if (navigator.sendBeacon) {
    navigator.sendBeacon(`${API_BASE}?batch=1`, payload);
  } else {
    fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    }).catch(() => {});
  }
  if (batchQueue.length >= BATCH_SIZE) {
    setTimeout(flushBatch, 0);
  }
}

function enqueueEvent(evt: TrackEvent) {
  batchQueue.push(evt);
  if (batchQueue.length >= BATCH_SIZE) {
    flushBatch();
  }
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
    const trimmed =
      events.length > MAX_LOCAL_EVENTS ? events.slice(-MAX_LOCAL_EVENTS) : events;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    /* localStorage 满了则静默失败 */
  }
}

/* ============================================================
 * 核心 track 函数
 * ============================================================ */
export function track(eventName: string, props?: Record<string, unknown>) {
  /* 白名单校验 */
  if (!EVENT_SET.has(eventName)) {
    if (import.meta.env.DEV) console.warn("[Track] 未注册的事件:", eventName);
    return;
  }

  /* Props 校验 */
  if (props && !validateProps(eventName, props)) {
    if (import.meta.env.DEV) console.warn("[Track] Props 校验失败:", eventName, props);
    return;
  }

  const evt: TrackEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: eventName,
    props,
    ts: Date.now(),
    session: getSessionId(),
    anon_id: getAnonId(),
    path: window.location.pathname + window.location.search,
  };

  // 1. 始终写本地
  const all = readLocalEvents();
  all.push(evt);
  saveLocalEvents(all);

  // 2. 入队批量上报
  enqueueEvent(evt);

  // 3. GA4 回传（如果已加载）
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, props);
  }
}

/* ============================================================
 * 数据读取（看板用）
 * ============================================================ */

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

/** 获取全部本地事件 */
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
    ? hours
      ? getEventsLastHours(hours, events)
      : events
    : hours
      ? getEventsLastHours(hours)
      : getAllEvents();
  return src.filter((e) => e.name === name).length;
}

/* ---- PV / UV 核心指标 ---- */

/** PV: page_view 事件总数 */
export function countPV(hours?: number, events?: TrackEvent[]): number {
  return countEvent("page_view", hours, events);
}

/** 今日 PV（按服务器当前日期的 00:00 起） */
export function countTodayPV(events?: TrackEvent[]): number {
  const src = events || getAllEvents();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return src.filter(
    (e) => e.name === "page_view" && e.ts >= todayStart.getTime()
  ).length;
}

/** UV: 独立访客数（基于 anon_id 去重，旧数据兼容 session） */
export function countUV(hours?: number, events?: TrackEvent[]): number {
  const src = hours ? getEventsLastHours(hours, events) : events || getAllEvents();
  return new Set(src.map((e) => e.anon_id || e.session)).size;
}

/** 人均浏览页数 (PV / UV) */
export function pagesPerVisitor(hours?: number, events?: TrackEvent[]): number {
  const uv = countUV(hours, events);
  if (uv === 0) return 0;
  const pv = countPV(hours, events);
  return Math.round((pv / uv) * 10) / 10;
}

/** 统计独立会话数（兼容旧指标） */
export function uniqueSessions(hours?: number, events?: TrackEvent[]): number {
  const src = events
    ? hours
      ? getEventsLastHours(hours, events)
      : events
    : hours
      ? getEventsLastHours(hours)
      : getAllEvents();
  return new Set(src.map((e) => e.session)).size;
}

/** 统计独立页面访问数 */
export function uniquePageViews(hours?: number, events?: TrackEvent[]): number {
  const src = events
    ? hours
      ? getEventsLastHours(hours, events)
      : events
    : hours
      ? getEventsLastHours(hours)
      : getAllEvents();
  return new Set(
    src.filter((e) => e.name === "page_view").map((e) => e.session)
  ).size;
}

/** 漏斗分析 */
export function funnel(
  steps: string[],
  hours?: number,
  events?: TrackEvent[]
): { step: string; count: number; rate: number }[] {
  const src = events
    ? hours
      ? getEventsLastHours(hours, events)
      : events
    : hours
      ? getEventsLastHours(hours)
      : getAllEvents();
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
export function topEvents(
  n = 10,
  hours?: number,
  events?: TrackEvent[]
): { name: string; count: number }[] {
  const src = events
    ? hours
      ? getEventsLastHours(hours, events)
      : events
    : hours
      ? getEventsLastHours(hours)
      : getAllEvents();
  const map = new Map<string, number>();
  src.forEach((e) => {
    map.set(e.name, (map.get(e.name) || 0) + 1);
  });
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, count]) => ({ name, count }));
}

/** 各作品使用排行（按 tool_name 分组统计 tool_enter） */
export function topToolEnters(
  hours?: number,
  events?: TrackEvent[]
): { tool_name: string; count: number }[] {
  const src = events
    ? hours
      ? getEventsLastHours(hours, events)
      : events
    : hours
      ? getEventsLastHours(hours)
      : getAllEvents();
  const map = new Map<string, number>();
  src.filter((e) => e.name === "tool_enter").forEach((e) => {
    const name = (e.props?.tool_name as string) || "未命名工具";
    map.set(name, (map.get(name) || 0) + 1);
  });
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tool_name, count]) => ({ tool_name, count }));
}

/** 按天统计事件趋势 */
export function dailyTrend(
  days = 7,
  events?: TrackEvent[]
): { date: string; count: number }[] {
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
  const headers = ["time", "event", "path", "session", "anon_id", "props"];
  const rows = src.map((e) => [
    new Date(e.ts).toLocaleString("zh-CN"),
    e.name,
    e.path,
    e.session.slice(0, 12),
    e.anon_id?.slice(0, 16) || "",
    JSON.stringify(e.props ?? {}),
  ]);
  return [
    headers.join(","),
    ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
  ].join("\n");
}

/** 自动追踪页面访问 + 启动批量上报 */
export function initPageTracking() {
  const trackPage = () => {
    track("page_view", {
      path: window.location.pathname,
      title: document.title,
    });
  };

  trackPage();
  startFlushTimer();

  const origPush = history.pushState;
  history.pushState = function (...args) {
    origPush.apply(this, args);
    setTimeout(trackPage, 100);
  };

  const origReplace = history.replaceState;
  history.replaceState = function (...args) {
    origReplace.apply(this, args);
    setTimeout(trackPage, 100);
  };

  window.addEventListener("popstate", trackPage);
  window.addEventListener("beforeunload", () => {
    flushBatch();
  });
}
