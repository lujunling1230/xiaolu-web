import { useEffect, useState, useCallback } from "react";
import type { CSSProperties } from "react";
import { track } from "../utils/track";

/**
 * 数据成果展示页 — 公开版
 *
 * 从 /api/analytics 拉取事件数据，聚合展示核心产品指标。
 * 用于简历截图、面试展示、对外数据背书。
 */

interface AnalyticsEvent {
  id: string;
  name: string;
  props: Record<string, unknown>;
  ts: number;
  session: string;
  anon_id: string;
  path: string;
}

interface Metrics {
  totalPV: number;
  totalUV: number;
  totalAICalls: number;
  aiSuccessRate: number;
  totalEvents: number;
  avgPagesPerVisitor: number;
  avgSessionDuration: number;
  toolRanking: { name: string; count: number }[];
  aiModelUsage: { model: string; count: number }[];
  dailyActive: { date: string; pv: number; uv: number }[];
  topPages: { path: string; count: number }[];
  registeredUsers: number;
}

const S: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8f6f1",
    color: "#2a2a2a",
    fontFamily: "'Noto Serif SC', 'Songti SC', serif",
    lineHeight: 1.8,
  },
  hero: {
    background: "linear-gradient(135deg, #1a2e1f 0%, #2d5f3f 100%)",
    color: "#f5f0e6",
    padding: "64px 24px 56px",
    textAlign: "center",
  },
  heroBadge: {
    display: "inline-block",
    padding: "5px 16px",
    border: "1px solid rgba(245,240,230,0.3)",
    borderRadius: 2,
    fontSize: 12,
    letterSpacing: "0.15em",
    color: "rgba(245,240,230,0.8)",
    marginBottom: 20,
    fontFamily: "'Noto Sans SC', sans-serif",
  },
  heroTitle: { fontSize: 36, fontWeight: 700, marginBottom: 8, letterSpacing: "0.04em" },
  heroSubtitle: {
    fontSize: 15,
    color: "rgba(245,240,230,0.65)",
    fontFamily: "'Noto Sans SC', sans-serif",
  },
  section: { maxWidth: 960, margin: "0 auto", padding: "48px 24px" },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1a2e1f",
    marginBottom: 24,
    letterSpacing: "0.03em",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
  },
  metricCard: {
    background: "#fffdf8",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 4,
    padding: "28px 24px",
    textAlign: "center",
  },
  metricNum: {
    fontSize: 36,
    fontWeight: 700,
    color: "#2d5f3f",
    fontFamily: "'Georgia', serif",
    lineHeight: 1.2,
  },
  metricLabel: {
    fontSize: 13,
    color: "#8b7355",
    marginTop: 8,
    fontFamily: "'Noto Sans SC', sans-serif",
  },
  metricSub: {
    fontSize: 11,
    color: "#bbb",
    marginTop: 4,
    fontFamily: "'Noto Sans SC', sans-serif",
  },
  card: {
    background: "#fffdf8",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 4,
    padding: 28,
    marginBottom: 20,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
    fontFamily: "'Noto Sans SC', sans-serif",
  },
  th: {
    textAlign: "left",
    padding: "10px 12px",
    borderBottom: "2px solid #2d5f3f",
    fontSize: 12,
    fontWeight: 600,
    color: "#1a2e1f",
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
    color: "#444",
  },
  barRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  barLabel: {
    width: 120,
    fontSize: 13,
    color: "#555",
    fontFamily: "'Noto Sans SC', sans-serif",
    flexShrink: 0,
  },
  barTrack: {
    flex: 1,
    height: 24,
    background: "rgba(0,0,0,0.04)",
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    background: "linear-gradient(90deg, #2d5f3f, #4a8a5f)",
    borderRadius: 3,
    transition: "width 0.6s ease",
  },
  barCount: {
    width: 50,
    fontSize: 13,
    fontWeight: 600,
    color: "#2d5f3f",
    textAlign: "right",
    flexShrink: 0,
  },
  loading: {
    textAlign: "center",
    padding: 80,
    color: "#8b7355",
    fontSize: 16,
    fontFamily: "'Noto Sans SC', sans-serif",
  },
  note: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 16,
    fontFamily: "'Noto Sans SC', sans-serif",
    textAlign: "center",
  },
  dateRange: {
    display: "inline-block",
    padding: "4px 12px",
    background: "rgba(45,95,63,0.08)",
    borderRadius: 2,
    fontSize: 12,
    color: "#2d5f3f",
    fontFamily: "'Noto Sans SC', sans-serif",
    marginBottom: 16,
  },
  resumeTip: {
    background: "#1a2e1f",
    color: "#f5f0e6",
    borderRadius: 4,
    padding: 28,
    marginTop: 20,
  },
  resumeTipTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 12,
  },
  resumeTipItem: {
    fontSize: 13,
    color: "rgba(245,240,230,0.8)",
    marginBottom: 8,
    fontFamily: "'Noto Sans SC', sans-serif",
    paddingLeft: 16,
    position: "relative",
  },
  resumeTipDot: {
    position: "absolute",
    left: 0,
    top: 8,
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#c4a35a",
  },
};

export default function DataAchievements() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string>("");

  const computeMetrics = useCallback((events: AnalyticsEvent[]): Metrics => {
    const anonIds = new Set<string>();
    const sessions = new Map<string, { first: number; last: number; pages: number }>();
    const toolCounts: Record<string, number> = {};
    const aiModelCounts: Record<string, number> = {};
    const pageCounts: Record<string, number> = {};
    const dailyMap: Record<string, { pv: number; uv: Set<string> }> = {};
    let totalPV = 0;
    let totalAICalls = 0;
    let aiSuccess = 0;

    for (const evt of events) {
      anonIds.add(evt.anon_id);

      if (evt.name === "page_view") {
        totalPV++;
        const day = new Date(evt.ts).toISOString().slice(0, 10);
        if (!dailyMap[day]) dailyMap[day] = { pv: 0, uv: new Set() };
        dailyMap[day].pv++;
        dailyMap[day].uv.add(evt.anon_id);

        const path = evt.path?.split("?")[0] || "/";
        pageCounts[path] = (pageCounts[path] || 0) + 1;
      }

      if (evt.name === "ai_call") {
        totalAICalls++;
        const model = (evt.props?.model as string) || "unknown";
        aiModelCounts[model] = (aiModelCounts[model] || 0) + 1;
        if (evt.props?.success) aiSuccess++;
      }

      if (evt.name === "tool_enter") {
        const tool = (evt.props?.tool_name as string) || "unknown";
        toolCounts[tool] = (toolCounts[tool] || 0) + 1;
      }

      const sid = evt.session;
      if (sid) {
        if (!sessions.has(sid)) sessions.set(sid, { first: evt.ts, last: evt.ts, pages: 0 });
        const s = sessions.get(sid)!;
        s.last = Math.max(s.last, evt.ts);
        s.first = Math.min(s.first, evt.ts);
        if (evt.name === "page_view") s.pages++;
      }
    }

    const totalSessionDuration = Array.from(sessions.values()).reduce((sum, s) => sum + (s.last - s.first), 0);
    const avgSessionDuration = sessions.size > 0 ? totalSessionDuration / sessions.size / 1000 : 0;
    const avgPagesPerVisitor = anonIds.size > 0 ? totalPV / anonIds.size : 0;

    const toolRanking = Object.entries(toolCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    const aiModelUsage = Object.entries(aiModelCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([model, count]) => ({ model, count }));

    const dailyActive = Object.entries(dailyMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-30)
      .map(([date, d]) => ({ date, pv: d.pv, uv: d.uv.size }));

    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([path, count]) => ({ path, count }));

    if (events.length > 0) {
      const oldest = events[events.length - 1]?.ts;
      const newest = events[0]?.ts;
      if (oldest && newest) {
        const fmt = (ts: number) => new Date(ts).toISOString().slice(0, 10);
        setDateRange(`${fmt(oldest)} ~ ${fmt(newest)}`);
      }
    }

    return {
      totalPV,
      totalUV: anonIds.size,
      totalAICalls,
      aiSuccessRate: totalAICalls > 0 ? (aiSuccess / totalAICalls) * 100 : 0,
      totalEvents: events.length,
      avgPagesPerVisitor,
      avgSessionDuration,
      toolRanking,
      aiModelUsage,
      dailyActive,
      topPages,
      registeredUsers: 0,
    };
  }, []);

  useEffect(() => {
    track("page_view", { page: "data_achievements" });
    document.title = "数据成果 | 小鹿的数字造物场";

    const controller = new AbortController();
    fetch("/api/analytics", { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        const events = (data?.events || []) as AnalyticsEvent[];
        setMetrics(computeMetrics(events));
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== "AbortError") {
          setError("数据加载失败，请稍后重试");
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [computeMetrics]);

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}秒`;
    return `${Math.floor(seconds / 60)}分${Math.round(seconds % 60)}秒`;
  };

  const maxToolCount = metrics?.toolRanking[0]?.count || 1;

  return (
    <div style={S.page}>
      {/* Hero */}
      <div style={S.hero}>
        <div style={S.heroBadge}>DATA ACHIEVEMENTS · 数据成果</div>
        <h1 style={S.heroTitle}>产品数据看板</h1>
        <p style={S.heroSubtitle}>
          10+ AI Web 应用的真实运营数据 · 持续追踪中
        </p>
      </div>

      {loading ? (
        <div style={S.loading}>正在加载运营数据…</div>
      ) : error ? (
        <div style={S.loading}>{error}</div>
      ) : metrics ? (
        <>
          {/* Core Metrics */}
          <div style={S.section}>
            {dateRange && <div style={S.dateRange}>数据周期：{dateRange}</div>}
            <div style={S.metricsGrid}>
              <div style={S.metricCard}>
                <div style={S.metricNum}>{metrics.totalPV.toLocaleString()}</div>
                <div style={S.metricLabel}>累计页面浏览 (PV)</div>
              </div>
              <div style={S.metricCard}>
                <div style={S.metricNum}>{metrics.totalUV.toLocaleString()}</div>
                <div style={S.metricLabel}>独立访客 (UV)</div>
              </div>
              <div style={S.metricCard}>
                <div style={S.metricNum}>{metrics.totalAICalls.toLocaleString()}</div>
                <div style={S.metricLabel}>AI 对话调用次数</div>
                <div style={S.metricSub}>成功率 {metrics.aiSuccessRate.toFixed(1)}%</div>
              </div>
              <div style={S.metricCard}>
                <div style={S.metricNum}>{metrics.totalEvents.toLocaleString()}</div>
                <div style={S.metricLabel}>用户交互事件总数</div>
              </div>
              <div style={S.metricCard}>
                <div style={S.metricNum}>{metrics.avgPagesPerVisitor.toFixed(1)}</div>
                <div style={S.metricLabel}>人均浏览页面数</div>
              </div>
              <div style={S.metricCard}>
                <div style={S.metricNum}>{formatDuration(metrics.avgSessionDuration)}</div>
                <div style={S.metricLabel}>平均会话时长</div>
              </div>
            </div>
          </div>

          {/* Tool Usage Ranking */}
          {metrics.toolRanking.length > 0 && (
            <div style={S.section}>
              <h2 style={S.sectionTitle}>作品使用排行</h2>
              <div style={S.card}>
                {metrics.toolRanking.map((tool, i) => (
                  <div key={tool.name} style={S.barRow}>
                    <div style={S.barLabel}>
                      {i + 1}. {tool.name}
                    </div>
                    <div style={S.barTrack}>
                      <div
                        style={{
                          ...S.barFill,
                          width: `${(tool.count / maxToolCount) * 100}%`,
                        }}
                      />
                    </div>
                    <div style={S.barCount}>{tool.count}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Model Usage */}
          {metrics.aiModelUsage.length > 0 && (
            <div style={S.section}>
              <h2 style={S.sectionTitle}>AI 模型调用分布</h2>
              <div style={S.card}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>模型</th>
                      <th style={S.th}>调用次数</th>
                      <th style={S.th}>占比</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.aiModelUsage.map(m => (
                      <tr key={m.model}>
                        <td style={S.td}>{m.model}</td>
                        <td style={{ ...S.td, fontWeight: 600, color: "#2d5f3f" }}>{m.count}</td>
                        <td style={S.td}>
                          {((m.count / metrics.totalAICalls) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Daily Activity */}
          {metrics.dailyActive.length > 0 && (
            <div style={S.section}>
              <h2 style={S.sectionTitle}>近 30 日活跃趋势</h2>
              <div style={S.card}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 120, marginBottom: 12 }}>
                  {metrics.dailyActive.map(d => {
                    const maxPV = Math.max(...metrics.dailyActive.map(x => x.pv), 1);
                    const h = (d.pv / maxPV) * 100;
                    return (
                      <div
                        key={d.date}
                        title={`${d.date}: PV ${d.pv}, UV ${d.uv}`}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          height: `${Math.max(h, 2)}%`,
                          background: "linear-gradient(180deg, #4a8a5f, #2d5f3f)",
                          borderRadius: "2px 2px 0 0",
                          transition: "height 0.4s ease",
                        }}
                      />
                    );
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#aaa", fontFamily: "'Noto Sans SC', sans-serif" }}>
                  <span>{metrics.dailyActive[0]?.date}</span>
                  <span>{metrics.dailyActive[metrics.dailyActive.length - 1]?.date}</span>
                </div>
              </div>
            </div>
          )}

          {/* Top Pages */}
          {metrics.topPages.length > 0 && (
            <div style={S.section}>
              <h2 style={S.sectionTitle}>热门页面</h2>
              <div style={S.card}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>页面路径</th>
                      <th style={S.th}>访问次数</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.topPages.map(p => (
                      <tr key={p.path}>
                        <td style={S.td}>{p.path}</td>
                        <td style={{ ...S.td, fontWeight: 600 }}>{p.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Resume Tips */}
          <div style={S.section}>
            <div style={S.resumeTip}>
              <div style={S.resumeTipTitle}>简历数据引用建议</div>
              <div style={{ ...S.resumeTipItem, ...S.resumeTipDot as CSSProperties }}>
                独立设计开发 10+ AI Web 应用，累计 {metrics.totalUV.toLocaleString()} 名独立访客，
                {metrics.totalPV.toLocaleString()} 次页面浏览
              </div>
              <div style={{ ...S.resumeTipItem, ...S.resumeTipDot as CSSProperties, top: "auto" }}>
                AI 对话系统累计处理 {metrics.totalAICalls.toLocaleString()} 次调用，
                成功率 {metrics.aiSuccessRate.toFixed(1)}%，集成 {metrics.aiModelUsage.length} 种大模型
              </div>
              <div style={{ ...S.resumeTipItem, ...S.resumeTipDot as CSSProperties }}>
                用户平均会话时长 {formatDuration(metrics.avgSessionDuration)}，
                人均浏览 {metrics.avgPagesPerVisitor.toFixed(1)} 个页面
              </div>
              <div style={{ ...S.resumeTipItem, ...S.resumeTipDot as CSSProperties }}>
                最受欢迎产品：{metrics.toolRanking[0]?.name || "—"}
                （{metrics.toolRanking[0]?.count || 0} 次访问）
              </div>
            </div>
            <p style={S.note}>
              数据由 Supabase 后端实时统计 · 每次 AI 调用均通过 /api/ai 统一代理 · 数据自动更新
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}
