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

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<TimeRange>("7d");
  const [refreshTick, setRefreshTick] = useState(0);
  const [cloudEvents, setCloudEvents] = useState<TrackEvent[] | null>(null);
  const [cloudTotal, setCloudTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [clearingCloud, setClearingCloud] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [funnelTab, setFunnelTab] = useState<string>("漫游指南");

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
        ["tool_enter", "healing_breath", "healing_journal"],
        hours,
        eventsByToolSessions("森林疗愈室", events)
      ),
      rechargeFunnel: funnel(
        ["tool_enter", "recharge_action"],
        hours,
        eventsByToolSessions("回血清单", events)
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

      {/* 流量概览卡片 - 5 格 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <StatCard label="PV (浏览量)" value={stats.pv} sub={"累计 " + stats.totalAllTime + " 事件"} color="#8D9A8B" />
        <StatCard label="UV (访客数)" value={stats.uv} color="#E8853A" />
        <StatCard label="今日 PV" value={stats.todayPV} color="#7BA89E" />
        <StatCard label="人均浏览" value={stats.pagesPerVisitor} sub="页/人" color="#C06A2E" />
        <StatCard label="跳出率" value={stats.bounceRate} sub="%" color="#b06a6a" />
      </div>

      {/* 作品活跃度矩阵 */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: "#4a4038" }}>
          作品活跃度
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* 森林疗愈室 */}
          <WorkStatRow label="森林疗愈室">
            <StatCard label="呼吸练习" value={stats.healingBreath} color="#5d8a6a" compact />
            <StatCard label="感恩日记" value={stats.healingJournal} color="#7BA89E" compact />
            <StatCard label="冥想空间" value={stats.healingMeditation} color="#C06A2E" compact />
          </WorkStatRow>
          {/* 爱情公寓 */}
          <WorkStatRow label="爱情公寓">
            <StatCard label="AI 聊天" value={stats.apartmentChat} color="#b06a6a" compact />
            <StatCard label="发布动态" value={stats.apartmentPost} color="#E8853A" compact />
          </WorkStatRow>
          {/* 通关清单 */}
          <WorkStatRow label="通关清单">
            <StatCard label="任务完成" value={stats.questComplete} color="#a8814a" compact />
            <StatCard label="等级提升" value={stats.questLevel} color="#E8853A" compact />
          </WorkStatRow>
          {/* 物资管家 */}
          <WorkStatRow label="物资管家">
            <StatCard label="物资入库" value={stats.ivItemAdds} color="#8D9A8B" compact />
            <StatCard label="AI 管家" value={stats.ivAiAsks} color="#C06A2E" compact />
          </WorkStatRow>
          {/* 解忧杂货店 */}
          <WorkStatRow label="解忧杂货店">
            <StatCard label="写信" value={stats.adviceLetter} color="#4d8a82" compact />
            <StatCard label="收到回信" value={stats.adviceReply} color="#7BA89E" compact />
          </WorkStatRow>
          {/* 漫游指南 */}
          <WorkStatRow label="漫游指南">
            <StatCard label="AI 向导" value={stats.rgAiOpens} color="#7BA89E" compact />
            <StatCard label="采纳城市" value={stats.rgAiAdopts} color="#E8853A" compact />
          </WorkStatRow>
          {/* 回血清单 */}
          <WorkStatRow label="回血清单">
            <StatCard label="回血行动" value={stats.rechargeAction} color="#8a5f8a" compact />
          </WorkStatRow>
          {/* 小叶 */}
          <WorkStatRow label="小叶">
            <StatCard label="打开" value={stats.xiaoyeOpens} color="#5d8a6a" compact />
            <StatCard label="对话" value={stats.xiaoyeChats} color="#7BA89E" compact />
          </WorkStatRow>
          {/* 留言 */}
          <WorkStatRow label="联系留言">
            <StatCard label="留言提交" value={stats.contactSubmits} color="#7BA89E" compact />
          </WorkStatRow>
        </div>
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
        {/* 左栏：漏斗（标签切换） */}
        <div style={{ background: "#FAF9F6", borderRadius: 14, padding: 20, border: "1px solid #E8E6E1" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: "#4a4038" }}>
            转化漏斗
          </h3>
          {/* 标签栏 */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {["漫游指南", "解忧杂货店", "物资管家", "爱情公寓", "通关清单", "森林疗愈室", "回血清单"].map((tab) => (
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
          {/* 漏斗内容 */}
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
              <div style={{ fontSize: 12, color: "#a8a39b", marginBottom: 8 }}>呼吸练习 → 感恩日记</div>
              <FunnelBars data={stats.healingFunnel} />
            </>
          )}
          {funnelTab === "回血清单" && (
            <>
              <div style={{ fontSize: 12, color: "#a8a39b", marginBottom: 8 }}>完成回血行动</div>
              <FunnelBars data={stats.rechargeFunnel} />
            </>
          )}
        </div>

        {/* 中栏：页面 PV 分布 */}
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

        {/* 右栏：各作品使用排行 */}
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
    "/toolbox/answer": "爱情公寓",
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
