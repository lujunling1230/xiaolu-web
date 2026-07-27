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
  bounceRate,
  pageDistribution,
  funnel,
  eventsByToolSessions,
  topToolEnters,
  dailyTrend,
  exportCSV,
  clearAnalytics,
  fetchCloudEvents,
  clearCloudAnalytics,
  countDAU,
  countMAU,
  dauMauRatio,
  retentionRate,
  newVsReturning,
  avgSessionDuration,
  modeDistribution,
  weekOverWeek,
  detectAnomalies,
  healthScore,
  userPathFlow,
  workComparisonMatrix,
  type PathFlowNode,
  type PathFlowLink,
  type WorkMetrics,
} from "../utils/track";

/* ============================================================
 * AnalyticsDashboard 数据分析看板 v2
 * 核心指标：PV / UV / 今日 PV / 人均浏览页数
 * 部署在 Vercel 时自动从云端拉取全站数据
 * 本地开发时使用 localStorage 数据
 * ============================================================ */

type TimeRange = "24h" | "7d" | "30d" | "all";
type SectionTab = "core" | "behavior" | "health";

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

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<TimeRange>("7d");
  const [refreshTick, setRefreshTick] = useState(0);
  const [cloudEvents, setCloudEvents] = useState<TrackEvent[] | null>(null);
  const [cloudTotal, setCloudTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [clearingCloud, setClearingCloud] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [funnelTab, setFunnelTab] = useState<string>("漫游指南");
  const [activeSection, setActiveSection] = useState<SectionTab>("core");

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
        /* 云端返回空数组时（如 Blob Store blocked），回退到 localStorage */
        if (events.length === 0) {
          setCloudEvents(null);
        } else {
          setCloudEvents(events);
        }
        fetchCloudEvents().then((all) => setCloudTotal(all.length)).catch(() => {});
      })
      .catch(() => setCloudEvents(null))
      .finally(() => setLoading(false));
  }, [hours, refreshTick, useCloud]);

  /* 数据源：云端有数据用云端，否则用 localStorage */
  const localEvents = getAllEvents();
  const events = useCloud && cloudEvents && cloudEvents.length > 0 ? cloudEvents : localEvents;
  const allEvents = useCloud && cloudEvents && cloudEvents.length > 0 ? cloudEvents : localEvents;

  const stats = useMemo(() => {
    const filtered = hours ? getEventsLastHours(hours, events) : events;

    return {
      /* 流量核心 */
      pv: countPV(hours, events),
      uv: countUV(hours, events),
      todayPV: countTodayPV(allEvents),
      pagesPerVisitor: pagesPerVisitor(hours, events),
      bounceRate: bounceRate(hours, events),
      /* 漫游指南 */
      rgAiOpens: countEvent("rg_ai_open", hours, events),
      rgAiAdopts: countEvent("rg_ai_adopt_city", hours, events),
      /* 物资管家 */
      ivItemAdds: countEvent("iv_item_add", hours, events),
      ivAiAsks: countEvent("iv_ai_ask", hours, events),
      /* 森林疗愈室 */
      healingBreath: countEvent("healing_breath", hours, events),
      healingJournal: countEvent("healing_journal", hours, events),
      healingMeditation: countEvent("healing_meditation", hours, events),
      /* 爱情公寓 */
      apartmentChat: countEvent("apartment_chat", hours, events),
      apartmentPost: countEvent("apartment_post", hours, events),
      /* 通关清单 */
      questComplete: countEvent("quest_complete", hours, events),
      questLevel: countEvent("quest_level", hours, events),
      /* 解忧杂货店 */
      adviceLetter: countEvent("advice_letter", hours, events),
      adviceReply: countEvent("advice_reply", hours, events),
      /* 回血清单 */
      rechargeAction: countEvent("recharge_action", hours, events),
      /* 伴龄 */
      banlingChats: countEvent("banling_chat", hours, events),
      banlingReports: countEvent("banling_report", hours, events),
      banlingAdopts: countEvent("banling_action_adopt", hours, events),
      /* 小叶 */
      xiaoyeOpens: countEvent("xiaoye_open", hours, events),
      xiaoyeChats: countEvent("xiaoye_chat", hours, events),
      /* 留言 */
      contactSubmits: countEvent("contact_submit", hours, events),
      /* 汇总 */
      totalEvents: filtered.length,
      totalAllTime: allEvents.length,
      /* 排行 + 趋势 + 漏斗 */
      toolRanking: topToolEnters(hours, events),
      pageDist: pageDistribution(8, hours, events),
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
      /* 各作品漏斗（基于进入该工具的会话） */
      adviceFunnel: funnel(
        ["tool_enter", "advice_letter", "advice_reply"],
        hours,
        eventsByToolSessions("解忧杂货店", events)
      ),
      inventoryFunnel: funnel(
        ["tool_enter", "iv_item_add", "iv_ai_ask"],
        hours,
        eventsByToolSessions("物资管家", events)
      ),
      apartmentFunnel: funnel(
        ["tool_enter", "apartment_chat", "apartment_post"],
        hours,
        eventsByToolSessions("爱情公寓", events)
      ),
      questFunnel: funnel(
        ["tool_enter", "quest_complete", "quest_level"],
        hours,
        eventsByToolSessions("通关清单", events)
      ),
      healingFunnel: funnel(
        ["tool_enter", "healing_breath", "healing_journal", "healing_meditation"],
        hours,
        eventsByToolSessions("森林疗愈室", events)
      ),
      rechargeFunnel: funnel(
        ["tool_enter", "recharge_action"],
        hours,
        eventsByToolSessions("回血清单", events)
      ),
      /* 伴龄漏斗 */
      banlingFunnel: funnel(
        ["tool_enter", "banling_chat", "banling_report", "banling_action_adopt"],
        hours,
        eventsByToolSessions("伴龄", events)
      ),
      /* 小叶漏斗（全局浮窗，不通过 tool_enter） */
      xiaoyeFunnel: funnel(
        ["xiaoye_open", "xiaoye_chat"],
        hours,
        events
      ),
      /* === 新增指标 === */
      dau: countDAU(allEvents),
      mau: countMAU(allEvents),
      dauMauRatio: dauMauRatio(countDAU(allEvents), countMAU(allEvents)),
      retention1d: retentionRate(1, allEvents),
      retention7d: retentionRate(7, allEvents),
      newVsReturning: newVsReturning(hours, events),
      avgDuration: avgSessionDuration(hours, events),
      modeDist: modeDistribution(hours, events),
      weekCompare: weekOverWeek(allEvents),
      anomalies: detectAnomalies(allEvents),
      health: healthScore(allEvents),
      pathFlow: userPathFlow(hours, events),
      workMatrix: workComparisonMatrix(hours, events),
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
            {useCloud && cloudEvents && cloudEvents.length > 0
              ? `全站数据（云端）${loading ? " · 加载中..." : ` · 累计 ${cloudTotal} 条`}`
              : useCloud
                ? "云端暂不可用，显示本地数据（仅当前设备）"
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

      {/* 板块 Tab 导航 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "1px solid #E8E6E1", paddingBottom: 12 }}>
        {([
          { key: "core" as SectionTab, label: "核心指标", desc: "流量与趋势概览" },
          { key: "behavior" as SectionTab, label: "行为分析", desc: "用户路径与作品对比" },
          { key: "health" as SectionTab, label: "系统健康", desc: "异常检测与评分" },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            style={{
              padding: "8px 18px",
              borderRadius: 10,
              border: "1.5px solid",
              borderColor: activeSection === tab.key ? "#8D9A8B" : "transparent",
              background: activeSection === tab.key ? "#FAF9F6" : "transparent",
              color: activeSection === tab.key ? "#4a4038" : "#a8a39b",
              fontSize: 13,
              fontWeight: activeSection === tab.key ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s ease",
              textAlign: "left",
            }}
          >
            <div>{tab.label}</div>
            <div style={{ fontSize: 10, fontWeight: 400, marginTop: 2, opacity: 0.7 }}>{tab.desc}</div>
          </button>
        ))}
      </div>

      {/* ==================== 核心指标板块 ==================== */}
      {activeSection === "core" && (
        <>
          {/* 流量概览卡片 - 5 格 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <StatCard label="PV (浏览量)" value={stats.pv} sub={"累计 " + stats.totalAllTime + " 事件"} color="#8D9A8B" />
            <StatCard label="UV (访客数)" value={stats.uv} color="#E8853A" />
            <StatCard label="今日 PV" value={stats.todayPV} color="#7BA89E" />
            <StatCard label="人均浏览" value={stats.pagesPerVisitor} sub="页/人" color="#C06A2E" />
            <StatCard label="跳出率" value={stats.bounceRate} sub="%" color="#b06a6a" />
          </div>

          {/* 新增指标：DAU/MAU + 留存 + 会话时长 + 访问模式 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 14,
              marginBottom: 20,
            }}
          >
            <StatCard label="DAU / MAU" value={stats.dau} sub={`MAU ${stats.mau} · 比值 ${stats.dauMauRatio}%`} color="#4d8a82" />
            <StatCard label="次日留存" value={stats.retention1d} sub="%" color="#7BA89E" />
            <StatCard label="7 日留存" value={stats.retention7d} sub="%" color="#8a5f8a" />
            <StatCard label="平均会话时长" value={stats.avgDuration} sub="秒" color="#a8814a" />
            <StatCard label="访问模式" value={stats.modeDist.full} sub={`Full ${stats.modeDist.fullPct}% · Solo ${stats.modeDist.soloPct}%`} color="#5d7a8a" />
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

          {/* 页面 PV 分布 + 各作品使用排行 双栏 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {/* 页面 PV 分布 */}
            <div style={{ background: "#FAF9F6", borderRadius: 14, padding: 20, border: "1px solid #E8E6E1" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "#4a4038" }}>
                页面 PV 分布
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {stats.pageDist.length === 0 && (
                  <p style={{ color: "#a8a39b", fontSize: 13, textAlign: "center", padding: 20 }}>
                    暂无数据
                  </p>
                )}
                {stats.pageDist.map((item, idx) => {
                  const max = stats.pageDist[0]?.count || 1;
                  const pct = Math.round((item.count / max) * 100);
                  return (
                    <div key={item.path} style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                            {formatPagePath(item.path)}
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
                                  ? "#8D9A8B"
                                  : idx === 1
                                    ? "#7BA89E"
                                    : idx === 2
                                      ? "#C06A2E"
                                      : "#a8a39b",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 各作品使用排行 */}
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
        </>
      )}

      {/* ==================== 行为分析板块 ==================== */}
      {activeSection === "behavior" && (
        <>
          {/* 用户路径分析 */}
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
              用户路径流转
            </h3>
            <PathFlowChart nodes={stats.pathFlow.nodes} links={stats.pathFlow.links} />
          </div>

          {/* 作品对比矩阵 */}
          <div
            style={{
              background: "#FAF9F6",
              borderRadius: 14,
              padding: 20,
              border: "1px solid #E8E6E1",
              marginBottom: 24,
              overflowX: "auto",
            }}
          >
            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "#4a4038" }}>
              作品对比矩阵
            </h3>
            <WorkComparisonTable data={stats.workMatrix} />
          </div>

          {/* 作品活跃度矩阵 */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: "#4a4038" }}>
              作品活跃度明细
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <WorkStatRow label="森林疗愈室">
                <StatCard label="呼吸练习" value={stats.healingBreath} color="#5d8a6a" compact />
                <StatCard label="感恩日记" value={stats.healingJournal} color="#7BA89E" compact />
                <StatCard label="冥想空间" value={stats.healingMeditation} color="#C06A2E" compact />
              </WorkStatRow>
              <WorkStatRow label="爱情公寓">
                <StatCard label="AI 聊天" value={stats.apartmentChat} color="#b06a6a" compact />
                <StatCard label="发布动态" value={stats.apartmentPost} color="#E8853A" compact />
              </WorkStatRow>
              <WorkStatRow label="通关清单">
                <StatCard label="任务完成" value={stats.questComplete} color="#a8814a" compact />
                <StatCard label="等级提升" value={stats.questLevel} color="#E8853A" compact />
              </WorkStatRow>
              <WorkStatRow label="物资管家">
                <StatCard label="物资入库" value={stats.ivItemAdds} color="#8D9A8B" compact />
                <StatCard label="AI 管家" value={stats.ivAiAsks} color="#C06A2E" compact />
              </WorkStatRow>
              <WorkStatRow label="解忧杂货店">
                <StatCard label="写信" value={stats.adviceLetter} color="#4d8a82" compact />
                <StatCard label="收到回信" value={stats.adviceReply} color="#7BA89E" compact />
              </WorkStatRow>
              <WorkStatRow label="漫游指南">
                <StatCard label="AI 向导" value={stats.rgAiOpens} color="#7BA89E" compact />
                <StatCard label="采纳城市" value={stats.rgAiAdopts} color="#E8853A" compact />
              </WorkStatRow>
              <WorkStatRow label="回血清单">
                <StatCard label="回血行动" value={stats.rechargeAction} color="#8a5f8a" compact />
              </WorkStatRow>
              <WorkStatRow label="伴龄">
                <StatCard label="AI 对话" value={stats.banlingChats} color="#C08020" compact />
                <StatCard label="生成报告" value={stats.banlingReports} color="#FFB042" compact />
                <StatCard label="采纳建议" value={stats.banlingAdopts} color="#8b7355" compact />
              </WorkStatRow>
              <WorkStatRow label="小叶">
                <StatCard label="打开" value={stats.xiaoyeOpens} color="#5d8a6a" compact />
                <StatCard label="对话" value={stats.xiaoyeChats} color="#7BA89E" compact />
              </WorkStatRow>
              <WorkStatRow label="联系留言">
                <StatCard label="留言提交" value={stats.contactSubmits} color="#7BA89E" compact />
              </WorkStatRow>
            </div>
          </div>

          {/* 转化漏斗 */}
          <div
            style={{
              background: "#FAF9F6",
              borderRadius: 14,
              padding: 20,
              border: "1px solid #E8E6E1",
              marginBottom: 24,
            }}
          >
            <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: "#4a4038" }}>
              转化漏斗
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {["漫游指南", "解忧杂货店", "物资管家", "爱情公寓", "通关清单", "森林疗愈室", "回血清单", "伴龄", "小叶"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFunnelTab(tab)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    border: "1px solid",
                    borderColor: funnelTab === tab ? "#8D9A8B" : "#E8E6E1",
                    background: funnelTab === tab ? "#8D9A8B" : "transparent",
                    color: funnelTab === tab ? "#fff" : "#7a7268",
                    fontSize: 11,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            {funnelTab === "漫游指南" && (
              <>
                <div style={{ fontSize: 12, color: "#a8a39b", marginBottom: 8 }}>AI 推荐</div>
                <FunnelBars data={stats.recommendFunnel} />
                <div style={{ fontSize: 12, color: "#a8a39b", margin: "20px 0 8px" }}>攻略生成</div>
                <FunnelBars data={stats.generateFunnel} />
              </>
            )}
            {funnelTab === "解忧杂货店" && (
              <>
                <div style={{ fontSize: 12, color: "#a8a39b", marginBottom: 8 }}>写信 → 收到回信</div>
                <FunnelBars data={stats.adviceFunnel} />
              </>
            )}
            {funnelTab === "物资管家" && (
              <>
                <div style={{ fontSize: 12, color: "#a8a39b", marginBottom: 8 }}>入库 → 问 AI 管家</div>
                <FunnelBars data={stats.inventoryFunnel} />
              </>
            )}
            {funnelTab === "爱情公寓" && (
              <>
                <div style={{ fontSize: 12, color: "#a8a39b", marginBottom: 8 }}>AI 聊天 → 发布动态</div>
                <FunnelBars data={stats.apartmentFunnel} />
              </>
            )}
            {funnelTab === "通关清单" && (
              <>
                <div style={{ fontSize: 12, color: "#a8a39b", marginBottom: 8 }}>完成任务 → 等级提升</div>
                <FunnelBars data={stats.questFunnel} />
              </>
            )}
            {funnelTab === "森林疗愈室" && (
              <>
                <div style={{ fontSize: 12, color: "#a8a39b", marginBottom: 8 }}>呼吸练习 → 感恩日记 → 冥想空间</div>
                <FunnelBars data={stats.healingFunnel} />
              </>
            )}
            {funnelTab === "回血清单" && (
              <>
                <div style={{ fontSize: 12, color: "#a8a39b", marginBottom: 8 }}>完成回血行动</div>
                <FunnelBars data={stats.rechargeFunnel} />
              </>
            )}
            {funnelTab === "伴龄" && (
              <>
                <div style={{ fontSize: 12, color: "#a8a39b", marginBottom: 8 }}>AI 对话 → 生成报告 → 采纳建议</div>
                <FunnelBars data={stats.banlingFunnel} />
              </>
            )}
            {funnelTab === "小叶" && (
              <>
                <div style={{ fontSize: 12, color: "#a8a39b", marginBottom: 8 }}>打开 → 发起对话</div>
                <FunnelBars data={stats.xiaoyeFunnel} />
              </>
            )}
          </div>
        </>
      )}

      {/* ==================== 系统健康板块 ==================== */}
      {activeSection === "health" && (
        <>
          {/* 异常告警横幅 */}
          {stats.anomalies.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              {stats.anomalies.map((alert, idx) => (
                <div
                  key={idx}
                  style={{
                    background: alert.type === "danger" ? "#FDF2F2" : alert.type === "warning" ? "#FFF8ED" : "#EFF6FF",
                    border: `1px solid ${alert.type === "danger" ? "#FECACA" : alert.type === "warning" ? "#FDE68A" : "#BFDBFE"}`,
                    borderRadius: 10,
                    padding: "10px 14px",
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: alert.type === "danger" ? "#EF4444" : alert.type === "warning" ? "#F59E0B" : "#3B82F6",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 12, color: "#4a4038", flex: 1 }}>{alert.message}</span>
                </div>
              ))}
            </div>
          )}
          {stats.anomalies.length === 0 && (
            <div
              style={{
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#166534" }}>当前系统运行正常，未检测到异常</span>
            </div>
          )}

          {/* 三栏：周对比 + 健康评分 + 用户构成 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {/* 周对比 */}
            <div style={{ background: "#FAF9F6", borderRadius: 14, padding: 20, border: "1px solid #E8E6E1" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "#4a4038" }}>
                本周 vs 上周
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <WoWRow label="PV" current={stats.weekCompare.thisWeek.pv} prev={stats.weekCompare.lastWeek.pv} change={stats.weekCompare.changes.pv} />
                <WoWRow label="UV" current={stats.weekCompare.thisWeek.uv} prev={stats.weekCompare.lastWeek.uv} change={stats.weekCompare.changes.uv} />
                <WoWRow label="事件数" current={stats.weekCompare.thisWeek.events} prev={stats.weekCompare.lastWeek.events} change={stats.weekCompare.changes.events} />
                <WoWRow label="会话时长" current={stats.weekCompare.thisWeek.avgDuration} prev={stats.weekCompare.lastWeek.avgDuration} change={stats.weekCompare.changes.avgDuration} unit="s" />
              </div>
            </div>

            {/* 健康评分 */}
            <div style={{ background: "#FAF9F6", borderRadius: 14, padding: 20, border: "1px solid #E8E6E1" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "#4a4038" }}>
                数据健康评分
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background:
                      stats.health.score >= 80
                        ? "#E8F5E9"
                        : stats.health.score >= 50
                          ? "#FFF8ED"
                          : "#FDF2F2",
                    border: `3px solid ${
                      stats.health.score >= 80 ? "#4CAF50" : stats.health.score >= 50 ? "#F59E0B" : "#EF4444"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 700,
                    color:
                      stats.health.score >= 80
                        ? "#4CAF50"
                        : stats.health.score >= 50
                          ? "#F59E0B"
                          : "#EF4444",
                    flexShrink: 0,
                  }}
                >
                  {stats.health.score}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#4a4038" }}>{stats.health.label}</div>
                  <div style={{ fontSize: 11, color: "#a8a39b", marginTop: 2 }}>综合四项核心指标</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {stats.health.details.map((d) => (
                  <div key={d.metric} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: d.status === "good" ? "#4CAF50" : d.status === "fair" ? "#F59E0B" : "#EF4444",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 12, color: "#4a4038", flex: 1 }}>{d.metric}</span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color:
                          d.status === "good" ? "#4CAF50" : d.status === "fair" ? "#F59E0B" : "#EF4444",
                      }}
                    >
                      {d.score}分
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 新用户 vs 回访用户 */}
            <div style={{ background: "#FAF9F6", borderRadius: 14, padding: 20, border: "1px solid #E8E6E1" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "#4a4038" }}>
                用户构成
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#4a4038", marginBottom: 4 }}>
                    <span>新用户</span>
                    <span style={{ fontWeight: 600 }}>{stats.newVsReturning.newUsers}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: "#E8E6E1", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${stats.newVsReturning.newUsers + stats.newVsReturning.returningUsers > 0 ? (stats.newVsReturning.newUsers / (stats.newVsReturning.newUsers + stats.newVsReturning.returningUsers)) * 100 : 0}%`,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      style={{ height: "100%", borderRadius: 4, background: "#7BA89E" }}
                    />
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#4a4038", marginBottom: 4 }}>
                    <span>回访用户</span>
                    <span style={{ fontWeight: 600 }}>{stats.newVsReturning.returningUsers}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: "#E8E6E1", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${stats.newVsReturning.newUsers + stats.newVsReturning.returningUsers > 0 ? (stats.newVsReturning.returningUsers / (stats.newVsReturning.newUsers + stats.newVsReturning.returningUsers)) * 100 : 0}%`,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                      style={{ height: "100%", borderRadius: 4, background: "#E8853A" }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: 4, paddingTop: 10, borderTop: "1px solid #E8E6E1" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#a8a39b" }}>
                    <span>总计活跃用户</span>
                    <span style={{ fontWeight: 600, color: "#4a4038" }}>
                      {stats.newVsReturning.newUsers + stats.newVsReturning.returningUsers}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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

function StatCard({ label, value, sub, color, compact }: { label: string; value: number; sub?: string; color: string; compact?: boolean }) {
  if (compact) {
    return (
      <div style={{ background: "#FAF9F6", borderRadius: 10, padding: "10px 14px", border: "1px solid #E8E6E1", flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#a8a39b", whiteSpace: "nowrap" }}>{label}</span>
          <span style={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
        </div>
      </div>
    );
  }
  return (
    <div style={{ background: "#FAF9F6", borderRadius: 14, padding: "16px 18px", border: "1px solid #E8E6E1" }}>
      <div style={{ fontSize: 11, color: "#a8a39b", marginBottom: 6, letterSpacing: "0.04em" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#a8a39b", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function WorkStatRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 80, flexShrink: 0,
        fontSize: 12, fontWeight: 500, color: "#4a4038",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {label}
      </div>
      <div style={{ display: "flex", gap: 10, flex: 1, minWidth: 0 }}>
        {children}
      </div>
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
    tool_enter: "进入工具",
    advice_letter: "写信",
    advice_reply: "收到回信",
    iv_item_add: "物资入库",
    iv_ai_ask: "问 AI 管家",
    apartment_chat: "AI 聊天",
    apartment_post: "发布动态",
    quest_complete: "完成任务",
    quest_level: "等级提升",
    /* 森林疗愈室 */
    healing_breath: "呼吸练习",
    healing_journal: "感恩日记",
    healing_meditation: "冥想空间",
    /* 回血清单 */
    recharge_action: "完成回血行动",
    /* 伴龄 */
    banling_chat: "AI 对话",
    banling_report: "生成报告",
    banling_action_adopt: "采纳建议",
    /* 小叶 */
    xiaoye_open: "打开小叶",
    xiaoye_chat: "发起对话",
  };
  return map[step] || step;
}

/** 把路径简写成可读的中文标签 */
function formatPagePath(rawPath: string): string {
  /* 先剥离 query string（如 ?mode=full），避免 /?mode=full 被当成独立路径 */
  const path = rawPath.split("?")[0];
  const map: Record<string, string> = {
    "/": "首页",
    "/zhiyong": "致用",
    "/mickey": "作品集页",
    "/toolbox": "工具箱",
    "/toolbox/healing": "森林疗愈室",
    "/toolbox/apartment": "爱情公寓",
    "/toolbox/quests": "通关清单",
    "/toolbox/inventory": "物资管家",
    "/toolbox/advice": "解忧杂货店",
    "/toolbox/travel": "漫游指南",
    "/toolbox/recharge": "回血清单",
    "/toolbox/banling": "伴龄",
    "/toolbox/answer": "系统调频",
    "/contact": "联系页",
  };
  /* 精确匹配 */
  if (map[path]) return map[path];
  /* 前缀匹配（如 /toolbox/travel/plan → 漫游指南/攻略） */
  const prefix = Object.keys(map)
    .filter((k) => k !== "/" && path.startsWith(k + "/"))
    .sort((a, b) => b.length - a.length)[0];
  if (prefix) {
    const sub = path.slice(prefix.length + 1).split("/")[0] || "";
    const subMap: Record<string, string> = {
      plan: "攻略",
      map: "地图",
      cities: "城市",
    };
    return map[prefix] + (subMap[sub] ? "/" + subMap[sub] : "");
  }
  /* 兜底显示路径 */
  return path.replace(/^\//, "") || "/";
}

function WoWRow({
  label,
  current,
  prev,
  change,
  unit,
}: {
  label: string;
  current: number;
  prev: number;
  change: number;
  unit?: string;
}) {
  const isUp = change > 0;
  const isDown = change < 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 12, color: "#a8a39b", width: 60, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#4a4038", flex: 1 }}>
        {current}
        {unit ? unit : ""}
      </span>
      <span style={{ fontSize: 11, color: "#a8a39b" }}>上周 {prev}</span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: isUp ? "#4CAF50" : isDown ? "#EF4444" : "#a8a39b",
          background: isUp ? "#E8F5E9" : isDown ? "#FDF2F2" : "#F5F5F5",
          padding: "2px 8px",
          borderRadius: 999,
          whiteSpace: "nowrap",
        }}
      >
        {isUp ? "+" : ""}
        {change}%
      </span>
    </div>
  );
}

function PathFlowChart({ nodes, links }: { nodes: PathFlowNode[]; links: PathFlowLink[] }) {
  if (nodes.length === 0) {
    return <p style={{ color: "#a8a39b", fontSize: 13, textAlign: "center", padding: 20 }}>暂无路径数据</p>;
  }

  /* 简化版：左侧入口节点 → 右侧目标节点，用连接线和流量标签 */
  const maxCount = Math.max(...nodes.map((n) => n.count), 1);
  const leftNodes = nodes.filter((n) => !links.some((l) => l.target === n.name) || links.some((l) => l.source === n.name));
  const rightNodes = nodes.filter((n) => links.some((l) => l.target === n.name));

  /* 去重 */
  const sourceSet = new Set(links.map((l) => l.source));
  const targetSet = new Set(links.map((l) => l.target));

  const leftItems = Array.from(sourceSet)
    .map((name) => nodes.find((n) => n.name === name))
    .filter(Boolean) as PathFlowNode[];
  const rightItems = Array.from(targetSet)
    .map((name) => nodes.find((n) => n.name === name))
    .filter(Boolean) as PathFlowNode[];

  if (leftItems.length === 0 || rightItems.length === 0) {
    return <p style={{ color: "#a8a39b", fontSize: 13, textAlign: "center", padding: 20 }}>路径数据不足</p>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "flex", gap: 40, minWidth: 400, padding: "10px 0" }}>
        {/* 左侧：入口页 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 11, color: "#a8a39b", marginBottom: 4, fontWeight: 600 }}>入口页</div>
          {leftItems.map((node) => {
            const pct = Math.round((node.count / maxCount) * 100);
            return (
              <div key={node.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#4a4038", marginBottom: 2 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.name}</span>
                    <span style={{ fontWeight: 600, marginLeft: 4, flexShrink: 0 }}>{node.count}</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: "#E8E6E1", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 2, background: "#7BA89E", transition: "width 0.6s ease" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 中间：连接线与流量 */}
        <div style={{ width: 120, display: "flex", flexDirection: "column", gap: 8, paddingTop: 20 }}>
          {links.slice(0, 6).map((link, idx) => {
            const maxLink = Math.max(...links.map((l) => l.count), 1);
            const opacity = Math.max(0.3, link.count / maxLink);
            return (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                <div style={{ flex: 1, height: 1, background: `rgba(125, 168, 158, ${opacity})`, position: "relative" }}>
                  <div style={{
                    position: "absolute",
                    right: -4,
                    top: -3,
                    width: 0,
                    height: 0,
                    borderTop: "3px solid transparent",
                    borderBottom: "3px solid transparent",
                    borderLeft: `5px solid rgba(125, 168, 158, ${opacity})`,
                  }} />
                </div>
                <span style={{ color: "#7a7268", fontWeight: 600, whiteSpace: "nowrap" }}>{link.count}</span>
              </div>
            );
          })}
        </div>

        {/* 右侧：流向页 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 11, color: "#a8a39b", marginBottom: 4, fontWeight: 600 }}>流向页</div>
          {rightItems.map((node) => {
            const pct = Math.round((node.count / maxCount) * 100);
            return (
              <div key={node.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#4a4038", marginBottom: 2 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.name}</span>
                    <span style={{ fontWeight: 600, marginLeft: 4, flexShrink: 0 }}>{node.count}</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: "#E8E6E1", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 2, background: "#E8853A", transition: "width 0.6s ease" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WorkComparisonTable({ data }: { data: WorkMetrics[] }) {
  if (data.length === 0) {
    return <p style={{ color: "#a8a39b", fontSize: 13, textAlign: "center", padding: 20 }}>暂无数据</p>;
  }

  const maxEnters = Math.max(...data.map((d) => d.enters), 1);
  const maxPV = Math.max(...data.map((d) => d.pv), 1);

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
      <thead>
        <tr style={{ borderBottom: "1px solid #E8E6E1" }}>
          <th style={{ textAlign: "left", padding: "8px 6px", color: "#a8a39b", fontWeight: 500 }}>作品</th>
          <th style={{ textAlign: "center", padding: "8px 6px", color: "#a8a39b", fontWeight: 500 }}>进入次数</th>
          <th style={{ textAlign: "center", padding: "8px 6px", color: "#a8a39b", fontWeight: 500 }}>PV</th>
          <th style={{ textAlign: "center", padding: "8px 6px", color: "#a8a39b", fontWeight: 500 }}>UV</th>
          <th style={{ textAlign: "center", padding: "8px 6px", color: "#a8a39b", fontWeight: 500 }}>均长</th>
          <th style={{ textAlign: "center", padding: "8px 6px", color: "#a8a39b", fontWeight: 500 }}>跳出率</th>
          <th style={{ textAlign: "left", padding: "8px 6px", color: "#a8a39b", fontWeight: 500 }}>最活跃功能</th>
        </tr>
      </thead>
      <tbody>
        {data.map((work, idx) => (
          <tr key={work.name} style={{ borderBottom: "1px solid #F0EDE8" }}>
            <td style={{ padding: "8px 6px", color: "#4a4038", fontWeight: 600 }}>{work.name}</td>
            <td style={{ padding: "8px 6px", textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <span style={{ fontWeight: 600, color: "#4a4038" }}>{work.enters}</span>
                <div style={{ width: 30, height: 3, background: "#E8E6E1", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${(work.enters / maxEnters) * 100}%`, height: "100%", background: "#8D9A8B", borderRadius: 2 }} />
                </div>
              </div>
            </td>
            <td style={{ padding: "8px 6px", textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <span style={{ fontWeight: 600, color: "#4a4038" }}>{work.pv}</span>
                <div style={{ width: 30, height: 3, background: "#E8E6E1", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${(work.pv / maxPV) * 100}%`, height: "100%", background: "#7BA89E", borderRadius: 2 }} />
                </div>
              </div>
            </td>
            <td style={{ padding: "8px 6px", textAlign: "center", color: "#4a4038", fontWeight: 600 }}>{work.uv}</td>
            <td style={{ padding: "8px 6px", textAlign: "center", color: "#7a7268" }}>{work.avgDuration}s</td>
            <td style={{ padding: "8px 6px", textAlign: "center" }}>
              <span style={{
                color: work.bounceRate > 60 ? "#EF4444" : work.bounceRate > 40 ? "#F59E0B" : "#4CAF50",
                fontWeight: 600,
              }}>
                {work.bounceRate}%
              </span>
            </td>
            <td style={{ padding: "8px 6px", color: "#7a7268" }}>
              {work.topEvent !== "-" ? `${work.topEvent} (${work.topEventCount})` : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TrendChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const chartH = 120;
  const chartW = 320;
  const padL = 28;
  const padR = 12;
  const padT = 16;
  const padB = 28;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const points = data.map((d, i) => {
    const x = padL + (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
    const y = padT + plotH - (d.count / max) * plotH;
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${padT + plotH} L ${points[0].x} ${padT + plotH} Z`
      : "";

  return (
    <div style={{ overflowX: "auto" }}>
      <svg width={chartW} height={chartH + 16} style={{ display: "block" }}>
        {/* 网格线 */}
        {[0, 0.5, 1].map((t) => {
          const y = padT + plotH - t * plotH;
          return (
            <line
              key={t}
              x1={padL}
              y1={y}
              x2={chartW - padR}
              y2={y}
              stroke="#E8E6E1"
              strokeWidth={1}
            />
          );
        })}
        {/* 区域填充 */}
        {areaPath && <path d={areaPath} fill="#7BA89E" opacity={0.12} />}
        {/* 折线 */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="#7BA89E"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        {/* 数据点 */}
        {points.map((p, i) => (
          <g key={p.date}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={3.5}
              fill="#fff"
              stroke="#7BA89E"
              strokeWidth={2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
            />
            {p.count > 0 && (
              <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize={10} fill="#4a4038" fontWeight={600}>
                {p.count}
              </text>
            )}
            <text x={p.x} y={chartH + 4} textAnchor="middle" fontSize={10} fill="#a8a39b">
              {p.date}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
