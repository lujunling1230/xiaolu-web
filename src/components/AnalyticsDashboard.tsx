import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  getAllEvents,
  getEventsLastHours,
  countEvent,
  uniqueSessions,
  uniquePageViews,
  funnel,
  topEvents,
  dailyTrend,
  exportCSV,
  clearAnalytics,
} from "../utils/track";

/* ============================================================
 * AnalyticsDashboard 数据分析看板
 * 内置于管理员面板，实时查看埋点数据
 * ============================================================ */

type TimeRange = "24h" | "7d" | "30d" | "all";

const RANGE_HOURS: Record<TimeRange, number | undefined> = {
  "24h": 24,
  "7d": 24 * 7,
  "30d": 24 * 30,
  all: undefined,
};

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<TimeRange>("7d");
  const [refreshTick, setRefreshTick] = useState(0);

  const hours = RANGE_HOURS[range];

  // 强制刷新
  const refresh = () => setRefreshTick((t) => t + 1);

  // 数据计算
  const stats = useMemo(() => {
    const all = getAllEvents();
    const filtered = hours ? getEventsLastHours(hours) : all;

    return {
      totalEvents: filtered.length,
      totalAllTime: all.length,
      sessions: uniqueSessions(hours),
      pageViews: uniquePageViews(hours),
      toolEnters: countEvent("tool_enter", hours),
      contactSubmits: countEvent("contact_submit", hours),
      rgAiOpens: countEvent("rg_ai_open", hours),
      rgAiAdopts: countEvent("rg_ai_adopt_city", hours),
      ivItemAdds: countEvent("iv_item_add", hours),
      ivAiAsks: countEvent("iv_ai_ask", hours),
      top: topEvents(10, hours),
      trend: dailyTrend(7),
      recommendFunnel: funnel(
        ["rg_ai_open", "rg_ai_recommend_submit", "rg_ai_recommend_result", "rg_ai_adopt_city"],
        hours
      ),
      generateFunnel: funnel(
        ["rg_ai_open", "rg_ai_generate_submit", "rg_ai_generate_result", "rg_ai_save_plan"],
        hours
      ),
    };
  }, [hours, refreshTick]);

  // 自动刷新（每 10 秒）
  useEffect(() => {
    const id = setInterval(refresh, 10000);
    return () => clearInterval(id);
  }, []);

  const handleExport = () => {
    const csv = exportCSV();
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `luro-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm("确定要清空所有埋点数据吗？此操作不可恢复。")) {
      clearAnalytics();
      refresh();
    }
  };

  return (
    <div style={{ padding: "24px 28px", fontFamily: "'Noto Sans SC', sans-serif" }}>
      {/* 顶部栏 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              color: "#4a4038",
              letterSpacing: "0.04em",
            }}
          >
            📊 数据分析
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#a8a39b" }}>
            实时查看埋点事件与用户行为
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* 时间范围 */}
          {(["24h", "7d", "30d", "all"] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: "5px 12px",
                borderRadius: 999,
                border: "1px solid",
                borderColor: range === r ? "#8D9A8B" : "#E8E6E1",
                background: range === r ? "#8D9A8B" : "transparent",
                color: range === r ? "#fff" : "#7a7268",
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {r === "24h" ? "24小时" : r === "7d" ? "7天" : r === "30d" ? "30天" : "全部"}
            </button>
          ))}
          <button
            onClick={refresh}
            style={{
              padding: "5px 12px",
              borderRadius: 999,
              border: "1px solid #E8E6E1",
              background: "transparent",
              color: "#7a7268",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            🔄 刷新
          </button>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <StatCard label="总事件数" value={stats.totalEvents} sub={`累计 ${stats.totalAllTime}`} color="#8D9A8B" />
        <StatCard label="独立会话" value={stats.sessions} color="#E8853A" />
        <StatCard label="页面访问" value={stats.pageViews} color="#7BA89E" />
        <StatCard label="工具使用" value={stats.toolEnters} color="#C06A2E" />
        <StatCard label="AI 向导打开" value={stats.rgAiOpens} color="#7BA89E" />
        <StatCard label="采纳城市" value={stats.rgAiAdopts} color="#E8853A" />
        <StatCard label="物资入库" value={stats.ivItemAdds} color="#8D9A8B" />
        <StatCard label="AI 管家问答" value={stats.ivAiAsks} color="#C06A2E" />
        <StatCard label="留言提交" value={stats.contactSubmits} color="#7BA89E" />
      </div>

      {/* 双栏布局：漏斗 + TOP 事件 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* 漏斗分析 */}
        <div
          style={{
            background: "#FAF9F6",
            borderRadius: 14,
            padding: 20,
            border: "1px solid #E8E6E1",
          }}
        >
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "#4a4038" }}>
            🎯 AI 推荐转化漏斗
          </h3>
          <FunnelBars data={stats.recommendFunnel} />

          <h3 style={{ margin: "20px 0 16px", fontSize: 14, fontWeight: 600, color: "#4a4038" }}>
            🗺️ 攻略生成转化漏斗
          </h3>
          <FunnelBars data={stats.generateFunnel} />
        </div>

        {/* TOP 事件 */}
        <div
          style={{
            background: "#FAF9F6",
            borderRadius: 14,
            padding: 20,
            border: "1px solid #E8E6E1",
          }}
        >
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "#4a4038" }}>
            🔥 热门事件 TOP 10
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {stats.top.length === 0 && (
              <p style={{ color: "#a8a39b", fontSize: 13, textAlign: "center", padding: 20 }}>
                暂无数据
              </p>
            )}
            {stats.top.map((item, idx) => {
              const max = stats.top[0]?.count || 1;
              const pct = Math.round((item.count / max) * 100);
              return (
                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      color: idx < 3 ? "#E8853A" : "#a8a39b",
                      textAlign: "center",
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                        color: "#4a4038",
                        marginBottom: 3,
                      }}
                    >
                      <span>{item.name}</span>
                      <span style={{ fontWeight: 600 }}>{item.count}</span>
                    </div>
                    <div
                      style={{
                        height: 5,
                        borderRadius: 3,
                        background: "#E8E6E1",
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{
                          height: "100%",
                          borderRadius: 3,
                          background:
                            idx === 0
                              ? "#E8853A"
                              : idx === 1
                              ? "#7BA89E"
                              : idx === 2
                              ? "#C06A2E"
                              : "#8D9A8B",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 7 天趋势图（简易 SVG 柱状图） */}
      <div
        style={{
          background: "#FAF9F6",
          borderRadius: 14,
          padding: 20,
          border: "1px solid #E8E6E1",
          marginBottom: 24,
        }}
      >
        <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "#4a4038" }}>
          📈 近 7 天事件趋势
        </h3>
        <TrendChart data={stats.trend} />
      </div>

      {/* 底部操作 */}
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button
          onClick={handleExport}
          style={{
            padding: "8px 18px",
            borderRadius: 999,
            border: "1.5px solid #8D9A8B",
            background: "transparent",
            color: "#5d8a6a",
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          📥 导出 CSV
        </button>
        <button
          onClick={handleClear}
          style={{
            padding: "8px 18px",
            borderRadius: 999,
            border: "1.5px solid #E8E6E1",
            background: "transparent",
            color: "#a8a39b",
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          🗑️ 清空数据
        </button>
      </div>
    </div>
  );
}

/* ---------- 子组件 ---------- */

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#FAF9F6",
        borderRadius: 14,
        padding: "16px 18px",
        border: "1px solid #E8E6E1",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ fontSize: 11, color: "#a8a39b", marginBottom: 6, letterSpacing: "0.04em" }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#a8a39b", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function FunnelBars({ data }: { data: { step: string; count: number; rate: number }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((item, idx) => (
        <div key={item.step}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "#4a4038",
              marginBottom: 4,
            }}
          >
            <span>{formatStepName(item.step)}</span>
            <span>
              {item.count} {idx > 0 ? `(${item.rate}%)` : ""}
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: "#E8E6E1", overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(item.rate, 5)}%` }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              style={{
                height: "100%",
                borderRadius: 4,
                background: idx === 0 ? "#8D9A8B" : idx === data.length - 1 ? "#E8853A" : "#7BA89E",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function formatStepName(step: string): string {
  const map: Record<string, string> = {
    rg_ai_open: "打开 AI 向导",
    rg_ai_recommend_submit: "点击开始推荐",
    rg_ai_recommend_result: "收到推荐结果",
    rg_ai_adopt_city: "采纳城市",
    rg_ai_generate_submit: "点击生成攻略",
    rg_ai_generate_result: "收到攻略结果",
    rg_ai_save_plan: "保存攻略",
  };
  return map[step] || step;
}

function TrendChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const chartH = 120;
  const barW = 60;
  const gap = 20;
  const totalW = data.length * (barW + gap);

  return (
    <div style={{ overflowX: "auto" }}>
      <svg width={totalW} height={chartH + 30} style={{ display: "block" }}>
        {data.map((d, i) => {
          const h = (d.count / max) * chartH;
          const x = i * (barW + gap) + gap / 2;
          const y = chartH - h;
          return (
            <g key={d.date}>
              <motion.rect
                initial={{ height: 0, y: chartH }}
                animate={{ height: h, y }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                x={x}
                width={barW}
                rx={6}
                fill="#7BA89E"
                opacity={0.85}
              />
              <text x={x + barW / 2} y={chartH + 18} textAnchor="middle" fontSize={11} fill="#a8a39b">
                {d.date}
              </text>
              {d.count > 0 && (
                <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize={11} fill="#4a4038" fontWeight={600}>
                  {d.count}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
