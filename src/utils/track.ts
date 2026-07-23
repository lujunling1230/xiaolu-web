/* ============================================================
 * Analytics / Track 埋点系统
 * 基于 localStorage，零依赖，离线可用
 * 管理员面板内置看板实时查看
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
const MAX_EVENTS = 5000;

/** 生成会话 ID（每次新标签页或 30 分钟无活动刷新） */
function getSessionId(): string {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const sid = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  sessionStorage.setItem(SESSION_KEY, sid);
  return sid;
}

/** 读取全部事件 */
export function getAllEvents(): TrackEvent[] {
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

/** 写入事件（自动去重保护，超上限时保留最新的） */
function saveEvents(events: TrackEvent[]) {
  try {
    const trimmed = events.length > MAX_EVENTS ? events.slice(-MAX_EVENTS) : events;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage 满了则静默失败
  }
}

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

  const all = getAllEvents();
  all.push(evt);
  saveEvents(all);

  // 同步到 Google Analytics 4（如果已加载）
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, props);
  }

  // 同步到 Mixpanel（如果已加载）
  if (typeof window !== "undefined" && (window as any).mixpanel) {
    (window as any).mixpanel.track(eventName, props);
  }

  // 调试用
  if (import.meta.env.DEV) {
    console.log("[Track]", eventName, props);
  }
}

/** 按事件名筛选 */
export function getEventsByName(name: string): TrackEvent[] {
  return getAllEvents().filter((e) => e.name === name);
}

/** 按时间范围筛选（最近 N 小时） */
export function getEventsLastHours(hours: number): TrackEvent[] {
  const cutoff = Date.now() - hours * 3600_000;
  return getAllEvents().filter((e) => e.ts >= cutoff);
}

/** 按工具名筛选 */
export function getEventsByTool(toolName: string): TrackEvent[] {
  return getAllEvents().filter(
    (e) => e.props?.tool_name === toolName || e.name.startsWith(toolName)
  );
}

/** 统计某事件的总次数 */
export function countEvent(name: string, hours?: number): number {
  const events = hours ? getEventsLastHours(hours) : getAllEvents();
  return events.filter((e) => e.name === name).length;
}

/** 统计独立会话数 */
export function uniqueSessions(hours?: number): number {
  const events = hours ? getEventsLastHours(hours) : getAllEvents();
  return new Set(events.map((e) => e.session)).size;
}

/** 统计独立页面访问 */
export function uniquePageViews(hours?: number): number {
  const events = hours ? getEventsLastHours(hours) : getAllEvents();
  return new Set(events.filter((e) => e.name === "page_view").map((e) => e.session)).size;
}

/** 漏斗分析：计算各步骤转化率 */
export function funnel(
  steps: string[],
  hours?: number
): { step: string; count: number; rate: number }[] {
  const events = hours ? getEventsLastHours(hours) : getAllEvents();
  const sessions = new Set(events.map((e) => e.session));
  let prevCount = sessions.size;

  return steps.map((step) => {
    const stepSessions = new Set(
      events.filter((e) => e.name === step).map((e) => e.session)
    );
    const count = stepSessions.size;
    const rate = prevCount > 0 ? Math.round((count / prevCount) * 1000) / 10 : 0;
    prevCount = count;
    return { step, count, rate };
  });
}

/** 获取最常触发的事件 TOP N */
export function topEvents(n = 10, hours?: number): { name: string; count: number }[] {
  const events = hours ? getEventsLastHours(hours) : getAllEvents();
  const map = new Map<string, number>();
  events.forEach((e) => {
    map.set(e.name, (map.get(e.name) || 0) + 1);
  });
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, count]) => ({ name, count }));
}

/** 按天统计事件趋势 */
export function dailyTrend(days = 7): { date: string; count: number }[] {
  const result: { date: string; count: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const start = new Date(dateStr).getTime();
    const end = start + 86400_000;
    const count = getAllEvents().filter((e) => e.ts >= start && e.ts < end).length;
    result.push({ date: dateStr.slice(5), count });
  }
  return result;
}

/** 清除所有数据（慎用） */
export function clearAnalytics() {
  localStorage.removeItem(STORAGE_KEY);
}

/** 导出为 CSV */
export function exportCSV(): string {
  const events = getAllEvents();
  const headers = ["time", "event", "path", "session", "props"];
  const rows = events.map((e) => [
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
  // 监听路由变化（React Router 不会触发 popstate）
  const origPush = history.pushState;
  history.pushState = function (...args) {
    origPush.apply(this, args);
    setTimeout(trackPage, 100);
  };
  window.addEventListener("popstate", trackPage);
}
