import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import type { TrackEvent } from "../utils/track";
import {
  getAllEvents,
  getEventsLastHours,
  countEvent,
  countPV,
  countTodayPV,
  countUV,
  pagesPerVisitor,
  funnel,
  topEvents,
  topToolEnters,
  dailyTrend,
  exportCSV,
  clearAnalytics,
  fetchCloudEvents,
  clearCloudAnalytics,
} from "../utils/track";

/* ============================================================
 * AnalyticsDashboard 数据分析看板 v2
 * 核心指标：PV / UV / 今日 PV / 人均浏览页数
 * 部署在 Vercel 时自动从云端拉取全站数据
 * 本地开发时使用 localStorage 数据
 * ============================================================ */

type TimeRange = "24h" | "7d" | "30d" | "all";

const RANGE_HOURS: Record<TimeRange, number | undefined> = {
  "24h": 24,
  "7d": 24 * 7,
  "30d": 24 * 30,
  all: undefined,
};

const RANGE_LABELS: Record<TimeRange, string> = {
  "24h": "24h",
  "7d": "7d",
  "30d": "30d",
  all: "all",
};

function isCloudEnv(): boolean {
  return window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";
}

/* ---- 事件中文名映射 ---- */
const EVENT_NAME_MAP: Record<string, string> = {
  page_view: "页面浏览",
  nav_click: "导航点击",
  tool_enter: "工具使用",
  contact_submit: "留言提交",
  rg_ai_open: "AI 向导打开",
  rg_ai_recommend_submit: "AI 推荐提交",
  rg_ai_recommend_result: "AI 推荐结果",
  rg_ai_adopt_city: "采纳城市",
  rg_ai_generate_submit: "攻略生成提交",
  rg_ai_generate_result: "攻略生成结果",
  rg_ai_save_plan: "保存攻略",
  iv_tab_switch: "Tab 切换",
  iv_item_add: "物资入库",
  iv_ai_ask: "AI 管家提问",
  iv_ai_answer: "AI 管家回复",
  iv_ai_api_fail: "AI 接口失败",
  xiaoye_open: "小叶打开",
  xiaoye_chat: "小叶对话",
};

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<TimeRange>("7d");
  const [refreshTick, setRefreshTick] = useState(0);
  const [cloudEvents, setCloudEvents] = useState<TrackEvent[] | null>(null);
  const [cloudTotal, setCloudTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [clearingCloud, setClearingCloud] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const hours = RANGE_HOURS[range];
  const useCloud = isCloudEnv();

  const refresh = useCallback(() => {
    setRefreshTick((t) => t + 1);
    setSpinning(true);
    setTimeout(() => setSpinning(false), 800);
  }, []);

  /* 从云端拉取数据 */
  useEffect(() => {
    if (!useCloud) {
      setCloudEvents(null);
      return;
    }
    setLoading(true);
    fetchCloudEvents(hours)
      .then((events) => {
        setCloudEvents(events);
        fetchCloudEvents().then((all) => setCloudTotal(all.length)).catch(() => {});
      })
      .catch(() => setCloudEvents(null))
      .finally(() => setLoading(false));
  }, [hours, refreshTick, useCloud]);

  /* 数据源 */
  const events = useCloud && cloudEvents ? cloudEvents : getAllEvents();
  const allEvents = useCloud && cloudEvents ? cloudEvents : getAllEvents();

  const stats = useMemo(() => {
    const filtered = hours ? getEventsLastHours(hours, events) : events;

    return {
      /* 流量核心 */
      pv: countPV(hours, events),
      uv: countUV(hours, events),
      todayPV: countTodayPV(allEvents),
      pagesPerVisitor: pagesPerVisitor(hours, events),
      /* 业务事件 */
      toolEnters: countEvent("tool_enter", hours, events),
      contactSubmits: countEvent("contact_submit", hours, events),
      rgAiOpens: countEvent("rg_ai_open", hours, events),
      rgAiAdopts: countEvent("rg_ai_adopt_city", hours, events),
      ivItemAdds: countEvent("iv_item_add", hours, events),
      ivAiAsks: countEvent("iv_ai_ask", hours, events),
      xiaoyeOpens: countEvent("xiaoye_open", hours, events),
      xiaoyeChats: countEvent("xiaoye_chat", hours, events),
      /* 汇总 */
      totalEvents: filtered.length,
      totalAllTime: allEvents.length,
      /* 排行 + 趋势 + 漏斗 */
      top: topEvents(10, hours, events),
      toolRanking: topToolEnters(hours, events),
      trend: dailyTrend(7, events),
      recommendFunnel: funnel(
        ["rg_ai_open", "rg_ai_recommend_submit", "rg_ai_recommend_result", "rg_ai_adopt_city"],
        hours,
        events
      ),
      generateFunnel: funnel(
        ["rg_ai_open", "rg_ai_generate_submit", "rg_ai_generate_result", "rg_ai_save_plan"],
        hours,
        events
      ),
    };
  }, [hours, events, allEvents]);

  /* 自动刷新 */
  useEffect(() => {
    const id = setInterval(refresh, 15000);
    return () => clearInterval(id);
  }, [refresh]);

  const handleExport = () => {
    const csv = exportCSV(events);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `xiaoluweb-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearLocal = () => {
    if (confirm("确定要清空本地埋点数据吗？")) {
      clearAnalytics();
      refresh();
    }
  };

  const handleClearCloud = () => {
    const pwd = prompt("请输入管理员密码以清空云端数据：");
    if (!pwd) return;
    setClearingCloud(true);
    clearCloudAnalytics(pwd).then((ok) => {
      setClearingCloud(false);
      if (ok) refresh();
      else alert("清空失败，密码可能不正确");
    });
  };

  return (
    <div style={{ padding: "24px 28px", fontFamily: "'Noto Sans SC', sans-serif", overflow: "hidden" }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      {/* 顶部栏 - 使用 flex-wrap + align-items:start 防止刷新按钮被挤出 */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: "12px 16px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#4a4038", letterSpacing: "0.04em" }}>
            数据分析
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#a8a39b" }}>
            {useCloud
              ? `全站数据（云端）${loading ? " · 加载中..." : ` · 累计 ${cloudTotal} 条`}`
              : "本地数据（仅当前设备）"}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
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
                whiteSpace: "nowrap",
              }}
            >
              {RANGE_LABELS[r]}
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
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                display: "inline-block",
                animation: spinning ? "spin 0.8s linear" : "none",
                fontSize: 13,
              }}
            >
              ↻
            </span>
            {loading || spinning ? "刷新中" : "刷新"}
          </button>
        </div>
      </div>

      {/* 流量概览卡片 - PV / UV / 今日PV / 人均浏览 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <StatCard label="PV (浏览量)" value={stats.pv} sub={"累计 " + stats.totalAllTime + " 事件"} color="#8D9A8B" />
        <StatCard label="UV (访客数)" value={stats.uv} color="#E8853A" />
        <StatCard label="今日 PV" value={stats.todayPV} color="#7BA89E" />
        <StatCard label="人均浏览" value={stats.pagesPerVisitor} sub="页/人" color="#C06A2E" />
      </div>

      {/* 业务事件卡片 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <StatCard label="工具使用" value={stats.toolEnters} color="#5a8a6a" />
        <StatCard label="AI 向导" value={stats.rgAiOpens} color="#7BA89E" />
        <StatCard label="采纳城市" value={stats.rgAiAdopts} color="#E8853A" />
        <StatCard label="物资入库" value={stats.ivItemAdds} color="#8D9A8B" />
        <StatCard label="AI 管家" value={stats.ivAiAsks} color="#C06A2E" />
        <StatCard label="小叶打开" value={stats.xiaoyeOpens} color="#5d8a6a" />
        <StatCard label="小叶对话" value={stats.xiaoyeChats} color="#E8853A" />
        <StatCard label="留言提交" value={stats.contactSubmits} color="#7BA89E" />
      </div>

      {/* 三栏布局 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ background: "#FAF9F6", borderRadius: 14, padding: 20, border: "1px solid #E8E6E1" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "#4a4038" }}>
            AI 推荐转化漏斗
          </h3>
          <FunnelBars data={stats.recommendFunnel} />
          <h3 style={{ margin: "20px 0 16px", fontSize: 14, fontWeight: 600, color: "#4a4038" }}>
            攻略生成转化漏斗
          </h3>
          <FunnelBars data={stats.generateFunnel} />
        </div>

        <div style={{ background: "#FAF9F6", borderRadius: 14, padding: 20, border: "1px solid #E8E6E1" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "#4a4038" }}>
            热门事件 TOP 10
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
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                        color: "#4a4038",
                        marginBottom: 3,
                      }}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {EVENT_NAME_MAP[item.name] || item.name}
                      </span>
                      <span style={{ fontWeight: 600, marginLeft: 8, flexShrink: 0 }}>{item.count}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 3, background: "#E8E6E1", overflow: "hidden" }}>
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

        <div style={{ background: "#FAF9F6", borderRadius: 14, padding: 20, border: "1px solid #E8E6E1" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "#4a4038" }}>
            各作品使用排行
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {stats.toolRanking.length === 0 && (
              <p style={{ color: "#a8a39b", fontSize: 13, textAlign: "center", padding: 20 }}>
                暂无数据
              </p>
            )}
            {stats.toolRanking.map((item, idx) => {
              const max = stats.toolRanking[0]?.count || 1;
              const pct = Math.round((item.count / max) * 100);
              return (
                <div key={item.tool_name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                        color: "#4a4038",
                        marginBottom: 3,
                      }}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.tool_name}
                      </span>
                      <span style={{ fontWeight: 600, marginLeft: 8, flexShrink: 0 }}>{item.count}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 3, background: "#E8E6E1", overflow: "hidden" }}>
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

      {/* 7 天趋势图 */}
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
          近 7 天事件趋势
        </h3>
        <TrendChart data={stats.trend} />
      </div>

      {/* 底部操作 */}
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
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
          }}
        >
          导出 CSV
        </button>
        {useCloud && (
          <button
            onClick={handleClearCloud}
            disabled={clearingCloud}
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              border: "1.5px solid #E8E6E1",
              background: "transparent",
              color: "#a8a39b",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {clearingCloud ? "清空中..." : "清空云端数据"}
          </button>
        )}
        <button
          onClick={handleClearLocal}
          style={{
            padding: "8px 18px",
            borderRadius: 999,
            border: "1.5px solid #E8E6E1",
            background: "transparent",
            color: "#a8a39b",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          清空本地数据
        </button>
      </div>
    </div>
  );
}

/* ---------- 子组件 ---------- */

function StatCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color: string }) {
  return (
    <div style={{ background: "#FAF9F6", borderRadius: 14, padding: "16px 18px", border: "1px solid #E8E6E1" }}>
      <div style={{ fontSize: 11, color: "#a8a39b", marginBottom: 6, letterSpacing: "0.04em" }}>{label}</div>
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
