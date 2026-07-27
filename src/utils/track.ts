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
  /** 访问模式：full=全功能访问（HR/作品集内），solo=单作品独立访问 */
  mode: "full" | "solo";
}

/* ---- P0 事件白名单 ---- */
const ALLOWED_EVENTS = [
  "page_view",
  "nav_click",
  "tool_enter",
  "contact_submit",
  /* 漫游指南 */
  "rg_ai_open",
  "rg_ai_recommend_submit",
  "rg_ai_recommend_result",
  "rg_ai_adopt_city",
  "rg_ai_generate_submit",
  "rg_ai_generate_result",
  "rg_ai_save_plan",
  /* 物资管家 */
  "iv_tab_switch",
  "iv_item_add",
  "iv_ai_ask",
  "iv_ai_answer",
  "iv_ai_api_fail",
  /* 小叶 */
  "xiaoye_open",
  "xiaoye_chat",
  /* 森林疗愈室 */
  "healing_breath",
  "healing_journal",
  "healing_meditation",
  /* 爱情公寓 */
  "apartment_chat",
  "apartment_post",
  /* 通关清单 */
  "quest_complete",
  "quest_level",
  /* 解忧杂货店 */
  "advice_letter",
  "advice_reply",
  /* 回血清单 */
  "recharge_action",
  /* 伴龄 */
  "banling_chat",
  "banling_report",
  "banling_action_adopt",
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

/* ---- 访问模式检测（solo 单作品 / full 全功能）---- */
function getVisitMode(): "full" | "solo" {
  if (typeof window === "undefined") return "full";
  const params = new URLSearchParams(window.location.search);
  return params.get("solo") === "1" ? "solo" : "full";
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

  /* sendBeacon 需要 Blob 才能设置正确的 Content-Type，
     否则默认 text/plain 不会被 Vercel 解析为 JSON */
  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    const ok = navigator.sendBeacon(`${API_BASE}?batch=1`, blob);
    /* sendBeacon 失败时回退到 fetch */
    if (!ok) {
      fetch(`${API_BASE}?batch=1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } else {
    fetch(`${API_BASE}?batch=1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
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
    id: `${Date.now()}-${Math.random().toString(2, 6)}`,
    name: eventName,
    props,
    ts: Date.now(),
    session: getSessionId(),
    anon_id: getAnonId(),
    path: window.location.pathname + window.location.search,
    mode: getVisitMode(),
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

/** 跳出率：只有 1 次 page_view 的会话数 / 总会话数（百分比） */
export function bounceRate(hours?: number, events?: TrackEvent[]): number {
  const src = hours ? getEventsLastHours(hours, events) : events || getAllEvents();
  const sessionMap = new Map<string, number>();
  src.forEach((e) => {
    if (e.name === "page_view") {
      sessionMap.set(e.session, (sessionMap.get(e.session) || 0) + 1);
    }
  });
  if (sessionMap.size === 0) return 0;
  const bounced = Array.from(sessionMap.values()).filter((c) => c === 1).length;
  return Math.round((bounced / sessionMap.size) * 1000) / 10;
}

/** 页面 PV 分布：按 path 聚合 page_view，返回 TOP N */
export function pageDistribution(
  n = 10,
  hours?: number,
  events?: TrackEvent[]
): { path: string; count: number }[] {
  const src = hours ? getEventsLastHours(hours, events) : events || getAllEvents();
  const map = new Map<string, number>();
  src
    .filter((e) => e.name === "page_view")
    .forEach((e) => {
      const p = e.path || (e.props?.path as string) || "/";
      map.set(p, (map.get(p) || 0) + 1);
    });
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([path, count]) => ({ path, count }));
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

/** 筛选进入过指定工具的会话的所有事件（用于按作品计算漏斗） */
export function eventsByToolSessions(
  toolName: string,
  events?: TrackEvent[]
): TrackEvent[] {
  const src = events || getAllEvents();
  const toolSessions = new Set(
    src
      .filter(
        (e) => e.name === "tool_enter" && (e.props?.tool_name as string) === toolName
      )
      .map((e) => e.session)
  );
  return src.filter((e) => toolSessions.has(e.session));
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

/* ============================================================
 * DAU / MAU 指标
 * ============================================================ */

/** DAU：今日活跃用户数（今日有 page_view 的独立 anon_id） */
export function countDAU(events?: TrackEvent[]): number {
  const src = events || getAllEvents();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return new Set(
    src.filter((e) => e.name === "page_view" && e.ts >= todayStart.getTime()).map((e) => e.anon_id)
  ).size;
}

/** MAU：近 30 天活跃用户数 */
export function countMAU(events?: TrackEvent[]): number {
  const src = events || getAllEvents();
  const thirtyDaysAgo = Date.now() - 30 * 24 * 3600_000;
  return new Set(
    src.filter((e) => e.name === "page_view" && e.ts >= thirtyDaysAgo).map((e) => e.anon_id)
  ).size;
}

/** DAU/MAU 比值（百分比，保留一位小数） */
export function dauMauRatio(dau: number, mau: number): number {
  if (mau === 0) return 0;
  return Math.round((dau / mau) * 1000) / 10;
}

/* ============================================================
 * 留存率（次日 + 7 日）
 * 定义：N 天前首次出现的 anon_id 中，今天有 page_view 的比例
 * ============================================================ */

/** 获取每个 anon_id 的首次出现日期（YYYY-MM-DD） */
function getFirstSeenMap(events?: TrackEvent[]): Map<string, string> {
  const src = events || getAllEvents();
  const map = new Map<string, string>();
  src.forEach((e) => {
    const date = new Date(e.ts).toISOString().slice(0, 10);
    const existing = map.get(e.anon_id);
    if (!existing || date < existing) {
      map.set(e.anon_id, date);
    }
  });
  return map;
}

/** 留存率：days 天前首次出现的用户中，今天回访的比例 */
export function retentionRate(days: number, events?: TrackEvent[]): number {
  const src = events || getAllEvents();
  const firstSeen = getFirstSeenMap(src);
  const today = new Date().toISOString().slice(0, 10);
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - days);
  const targetDateStr = targetDate.toISOString().slice(0, 10);

  /* 找到 days 天前首次出现的用户 */
  const newUsers = Array.from(firstSeen.entries())
    .filter(([, date]) => date === targetDateStr)
    .map(([id]) => id);

  if (newUsers.length === 0) return 0;

  /* 今天回访的用户 */
  const todayUsers = new Set(
    src
      .filter((e) => e.name === "page_view" && new Date(e.ts).toISOString().slice(0, 10) === today)
      .map((e) => e.anon_id)
  );

  const returned = newUsers.filter((id) => todayUsers.has(id)).length;
  return Math.round((returned / newUsers.length) * 1000) / 10;
}

/* ============================================================
 * 新用户 vs 回访用户分布
 * ============================================================ */

export function newVsReturning(
  hours?: number,
  events?: TrackEvent[]
): { newUsers: number; returningUsers: number } {
  const src = hours ? getEventsLastHours(hours, events) : events || getAllEvents();
  const firstSeen = getFirstSeenMap(events || getAllEvents());

  /* 在时间范围内活跃的独立用户 */
  const activeUsers = new Set(src.filter((e) => e.name === "page_view").map((e) => e.anon_id));

  let newUsers = 0;
  let returningUsers = 0;

  const rangeStart = hours ? Date.now() - hours * 3600_000 : 0;

  activeUsers.forEach((id) => {
    const firstDate = firstSeen.get(id);
    if (!firstDate) return;
    const firstTs = new Date(firstDate).getTime();
    /* 如果首次出现时间在当前统计范围内，视为新用户 */
    if (firstTs >= rangeStart) {
      newUsers++;
    } else {
      returningUsers++;
    }
  });

  return { newUsers, returningUsers };
}

/* ============================================================
 * 平均会话时长（秒）
 * ============================================================ */

export function avgSessionDuration(hours?: number, events?: TrackEvent[]): number {
  const src = hours ? getEventsLastHours(hours, events) : events || getAllEvents();
  const sessionMap = new Map<string, { min: number; max: number }>();

  src.forEach((e) => {
    const existing = sessionMap.get(e.session);
    if (!existing) {
      sessionMap.set(e.session, { min: e.ts, max: e.ts });
    } else {
      existing.min = Math.min(existing.min, e.ts);
      existing.max = Math.max(existing.max, e.ts);
    }
  });

  if (sessionMap.size === 0) return 0;

  let totalDuration = 0;
  let validSessions = 0;

  sessionMap.forEach(({ min, max }) => {
    const duration = (max - min) / 1000;
    /* 过滤异常值：超过 30 分钟视为异常 */
    if (duration <= 1800) {
      totalDuration += duration;
      validSessions++;
    }
  });

  if (validSessions === 0) return 0;
  return Math.round((totalDuration / validSessions) * 10) / 10;
}

/* ============================================================
 * 访问模式分布（full / solo）
 * ============================================================ */

export function modeDistribution(
  hours?: number,
  events?: TrackEvent[]
): { full: number; solo: number; fullPct: number; soloPct: number } {
  const src = hours ? getEventsLastHours(hours, events) : events || getAllEvents();
  let full = 0;
  let solo = 0;

  src
    .filter((e) => e.name === "page_view")
    .forEach((e) => {
      if (e.mode === "solo") solo++;
      else full++;
    });

  const total = full + solo;
  if (total === 0) return { full: 0, solo: 0, fullPct: 0, soloPct: 0 };

  return {
    full,
    solo,
    fullPct: Math.round((full / total) * 1000) / 10,
    soloPct: Math.round((solo / total) * 1000) / 10,
  };
}

/* ============================================================
 * 周对比（本周 vs 上周）
 * ============================================================ */

export function weekOverWeek(events?: TrackEvent[]): {
  thisWeek: { pv: number; uv: number; events: number; avgDuration: number };
  lastWeek: { pv: number; uv: number; events: number; avgDuration: number };
  changes: { pv: number; uv: number; events: number; avgDuration: number };
} {
  const src = events || getAllEvents();
  const now = new Date();

  /* 本周：今天往前 7 天 */
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(thisWeekStart.getDate() - 7);
  const thisWeekStartTs = thisWeekStart.getTime();

  /* 上周：今天往前 14 天到 7 天前 */
  const lastWeekStart = new Date(now);
  lastWeekStart.setDate(lastWeekStart.getDate() - 14);
  const lastWeekStartTs = lastWeekStart.getTime();

  const thisWeekEvents = src.filter((e) => e.ts >= thisWeekStartTs);
  const lastWeekEvents = src.filter((e) => e.ts >= lastWeekStartTs && e.ts < thisWeekStartTs);

  const thisWeekPV = thisWeekEvents.filter((e) => e.name === "page_view").length;
  const lastWeekPV = lastWeekEvents.filter((e) => e.name === "page_view").length;

  const thisWeekUV = new Set(thisWeekEvents.map((e) => e.anon_id)).size;
  const lastWeekUV = new Set(lastWeekEvents.map((e) => e.anon_id)).size;

  const thisWeekDuration = avgSessionDuration(undefined, thisWeekEvents);
  const lastWeekDuration = avgSessionDuration(undefined, lastWeekEvents);

  const calcChange = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 1000) / 10;
  };

  return {
    thisWeek: {
      pv: thisWeekPV,
      uv: thisWeekUV,
      events: thisWeekEvents.length,
      avgDuration: thisWeekDuration,
    },
    lastWeek: {
      pv: lastWeekPV,
      uv: lastWeekUV,
      events: lastWeekEvents.length,
      avgDuration: lastWeekDuration,
    },
    changes: {
      pv: calcChange(thisWeekPV, lastWeekPV),
      uv: calcChange(thisWeekUV, lastWeekUV),
      events: calcChange(thisWeekEvents.length, lastWeekEvents.length),
      avgDuration: calcChange(thisWeekDuration, lastWeekDuration),
    },
  };
}

/* ============================================================
 * 异常检测
 * ============================================================ */

export interface AnomalyAlert {
  type: "warning" | "danger" | "info";
  metric: string;
  value: number;
  threshold: number;
  message: string;
}

export function detectAnomalies(events?: TrackEvent[]): AnomalyAlert[] {
  const src = events || getAllEvents();
  const alerts: AnomalyAlert[] = [];

  /* 跳出率检测 */
  const br = bounceRate(undefined, src);
  if (br > 80) {
    alerts.push({
      type: "danger",
      metric: "跳出率",
      value: br,
      threshold: 80,
      message: `跳出率高达 ${br}%，用户几乎只看一页就离开，需优化首屏内容`,
    });
  } else if (br > 60) {
    alerts.push({
      type: "warning",
      metric: "跳出率",
      value: br,
      threshold: 60,
      message: `跳出率 ${br}%，略高于健康水平`,
    });
  }

  /* 人均浏览页数检测 */
  const ppv = pagesPerVisitor(undefined, src);
  if (ppv < 1.2) {
    alerts.push({
      type: "warning",
      metric: "人均浏览",
      value: ppv,
      threshold: 1.2,
      message: `人均浏览仅 ${ppv} 页，用户探索深度不足`,
    });
  }

  /* 今日 PV 检测 */
  const tpv = countTodayPV(src);
  if (tpv === 0) {
    alerts.push({
      type: "danger",
      metric: "今日 PV",
      value: 0,
      threshold: 1,
      message: "今日暂无访问，请检查网站是否正常",
    });
  }

  /* 平均会话时长检测 */
  const duration = avgSessionDuration(undefined, src);
  if (duration < 15) {
    alerts.push({
      type: "warning",
      metric: "平均会话时长",
      value: duration,
      threshold: 15,
      message: `平均会话时长仅 ${duration} 秒，用户停留时间过短`,
    });
  }

  /* UV 骤降检测（对比昨日） */
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const todayUV = new Set(
    src.filter((e) => e.ts >= todayStart.getTime()).map((e) => e.anon_id)
  ).size;
  const yesterdayUV = new Set(
    src
      .filter((e) => e.ts >= yesterdayStart.getTime() && e.ts < todayStart.getTime())
      .map((e) => e.anon_id)
  ).size;

  if (yesterdayUV > 5 && todayUV < yesterdayUV * 0.5) {
    alerts.push({
      type: "danger",
      metric: "UV 骤降",
      value: todayUV,
      threshold: yesterdayUV * 0.5,
      message: `今日 UV（${todayUV}）较昨日（${yesterdayUV}）骤降超过 50%`,
    });
  }

  return alerts;
}

/* ============================================================
 * 指标健康评分（0-100）
 * ============================================================ */

export function healthScore(events?: TrackEvent[]): {
  score: number;
  label: string;
  details: { metric: string; score: number; status: "good" | "fair" | "poor" }[];
} {
  const src = events || getAllEvents();
  const details: { metric: string; score: number; status: "good" | "fair" | "poor" }[] = [];

  /* 跳出率评分（越低越好） */
  const br = bounceRate(undefined, src);
  let brScore = 100;
  if (br > 80) brScore = 30;
  else if (br > 60) brScore = 60;
  else if (br > 40) brScore = 80;
  details.push({
    metric: "跳出率",
    score: brScore,
    status: brScore >= 80 ? "good" : brScore >= 50 ? "fair" : "poor",
  });

  /* 人均浏览评分 */
  const ppv = pagesPerVisitor(undefined, src);
  let ppvScore = 100;
  if (ppv < 1.2) ppvScore = 30;
  else if (ppv < 2) ppvScore = 60;
  else if (ppv < 3) ppvScore = 80;
  details.push({
    metric: "人均浏览",
    score: ppvScore,
    status: ppvScore >= 80 ? "good" : ppvScore >= 50 ? "fair" : "poor",
  });

  /* 会话时长评分 */
  const duration = avgSessionDuration(undefined, src);
  let durScore = 100;
  if (duration < 15) durScore = 30;
  else if (duration < 30) durScore = 60;
  else if (duration < 60) durScore = 80;
  details.push({
    metric: "会话时长",
    score: durScore,
    status: durScore >= 80 ? "good" : durScore >= 50 ? "fair" : "poor",
  });

  /* DAU/MAU 活跃度评分 */
  const dau = countDAU(src);
  const mau = countMAU(src);
  const ratio = dauMauRatio(dau, mau);
  let ratioScore = 100;
  if (ratio < 5) ratioScore = 30;
  else if (ratio < 10) ratioScore = 60;
  else if (ratio < 20) ratioScore = 80;
  details.push({
    metric: "DAU/MAU",
    score: ratioScore,
    status: ratioScore >= 80 ? "good" : ratioScore >= 50 ? "fair" : "poor",
  });

  const totalScore = Math.round(details.reduce((sum, d) => sum + d.score, 0) / details.length);

  let label = "健康";
  if (totalScore < 50) label = "需关注";
  else if (totalScore < 70) label = "一般";

  return { score: totalScore, label, details };
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
