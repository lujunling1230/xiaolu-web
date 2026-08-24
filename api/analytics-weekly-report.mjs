/*
 * 每周数据分析报告 API
 * GET /api/analytics-weekly-report?secret=xxx&test=1
 *
 * 用法：
 *   1. Vercel Cron 每周一 09:00 定时触发（见 vercel.json）
 *   2. 也可手动 GET 调用（加 ?test=1 可测试发送）
 *
 * 环境变量：
 *   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS — 复用 QQ 邮箱 SMTP
 *   REPORT_TO_EMAIL — 收件邮箱（不填默认同 SMTP_USER）
 *   REPORT_SECRET  — 调用密钥，防止被滥用
 *   SUPABASE_URL / SUPABASE_SERVICE_KEY — 复用埋点数据库
 */

import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const TABLE_NAME = "analytics_events";
const SITE_URL = "https://www.xiaoluweb.com";

/* ---- Supabase ---- */
let supabase = null;
function getSupabase() {
  if (!supabase && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabase;
}

async function queryEvents(hours) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase 未配置");
  const cutoff = Date.now() - hours * 3600_000;
  const { data, error } = await sb
    .from(TABLE_NAME)
    .select("*")
    .gte("ts", cutoff)
    .order("ts", { ascending: true });
  if (error) throw new Error(`查询失败: ${error.message}`);
  return data || [];
}

/* ---- 数据分析函数 ---- */

function countByName(events, name) {
  return events.filter((e) => e.name === name).length;
}

function uniqueCount(events, key) {
  return new Set(events.map((e) => e[key]).filter(Boolean)).size;
}

function getBounceRate(events) {
  const sessionMap = new Map();
  events.filter((e) => e.name === "page_view").forEach((e) => {
    const s = e.session || "";
    sessionMap.set(s, (sessionMap.get(s) || 0) + 1);
  });
  if (sessionMap.size === 0) return 0;
  const bounced = Array.from(sessionMap.values()).filter((c) => c === 1).length;
  return Math.round((bounced / sessionMap.size) * 1000) / 10;
}

/** 简易漏斗：基于进入过指定工具的会话 */
function calcFunnel(events, toolName, steps) {
  const toolSessions = new Set(
    events
      .filter((e) => e.name === "tool_enter" && e.props?.tool_name === toolName)
      .map((e) => e.session)
  );
  const toolEvents = events.filter((e) => toolSessions.has(e.session));
  let prevCount = toolSessions.size;
  return steps.map((step) => {
    const count = new Set(toolEvents.filter((e) => e.name === step).map((e) => e.session)).size;
    const rate = prevCount > 0 ? Math.round((count / prevCount) * 1000) / 10 : 0;
    prevCount = count;
    return { step, count, rate };
  });
}

/** 按天分组统计事件数 */
function dailyCounts(events, days) {
  const result = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const start = new Date(dateStr).getTime();
    const end = start + 86400_000;
    const count = events.filter((e) => e.ts >= start && e.ts < end).length;
    result.push({ date: dateStr, count });
  }
  return result;
}

/* ---- 周报指标计算 ---- */

function getWAU(events) {
  return uniqueCount(events.filter((e) => e.name === "page_view"), "anon_id");
}

function getMAU(events) {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 3600_000;
  return new Set(
    events.filter((e) => e.name === "page_view" && e.ts >= thirtyDaysAgo).map((e) => e.anon_id)
  ).size;
}

function getAvgSessionDuration(events) {
  const sessionMap = new Map();
  events.forEach((e) => {
    const existing = sessionMap.get(e.session);
    if (!existing) sessionMap.set(e.session, { min: e.ts, max: e.ts });
    else {
      existing.min = Math.min(existing.min, e.ts);
      existing.max = Math.max(existing.max, e.ts);
    }
  });
  if (sessionMap.size === 0) return 0;
  let total = 0;
  let valid = 0;
  sessionMap.forEach(({ min, max }) => {
    const dur = (max - min) / 1000;
    if (dur <= 3600) { total += dur; valid++; }
  });
  return valid > 0 ? Math.round((total / valid) * 10) / 10 : 0;
}

function getModeDistribution(events) {
  let full = 0, solo = 0;
  events.filter((e) => e.name === "page_view").forEach((e) => {
    if (e.mode === "solo") solo++; else full++;
  });
  const total = full + solo;
  return total === 0 ? { full: 0, solo: 0, fullPct: 0, soloPct: 0 } : {
    full, solo,
    fullPct: Math.round((full / total) * 1000) / 10,
    soloPct: Math.round((solo / total) * 1000) / 10,
  };
}

function getNewVsReturning(events, weekStartTs) {
  const firstSeen = new Map();
  events.forEach((e) => {
    const date = new Date(e.ts).toISOString().slice(0, 10);
    const existing = firstSeen.get(e.anon_id);
    if (!existing || date < existing) firstSeen.set(e.anon_id, date);
  });
  const activeUsers = new Set(events.filter((e) => e.name === "page_view").map((e) => e.anon_id));
  let newUsers = 0, returning = 0;
  activeUsers.forEach((id) => {
    const firstDate = firstSeen.get(id);
    if (!firstDate) return;
    const firstTs = new Date(firstDate).getTime();
    if (firstTs >= weekStartTs) newUsers++;
    else returning++;
  });
  return { newUsers, returning };
}

function getHealthScore(events) {
  const br = getBounceRate(events);
  let brScore = 100;
  if (br > 80) brScore = 30; else if (br > 60) brScore = 60; else if (br > 40) brScore = 80;
  const pv = countByName(events, "page_view");
  const uv = uniqueCount(events, "anon_id");
  const ppv = uv > 0 ? pv / uv : 0;
  let ppvScore = 100;
  if (ppv < 1.2) ppvScore = 30; else if (ppv < 2) ppvScore = 60; else if (ppv < 3) ppvScore = 80;
  const dur = getAvgSessionDuration(events);
  let durScore = 100;
  if (dur < 15) durScore = 30; else if (dur < 30) durScore = 60; else if (dur < 60) durScore = 80;
  const wau = getWAU(events);
  const mau = getMAU(events);
  const ratio = mau > 0 ? Math.round((wau / mau) * 1000) / 10 : 0;
  let ratioScore = 100;
  if (ratio < 10) ratioScore = 30; else if (ratio < 20) ratioScore = 60; else if (ratio < 30) ratioScore = 80;
  const score = Math.round((brScore + ppvScore + durScore + ratioScore) / 4);
  let label = "健康";
  if (score < 50) label = "需关注"; else if (score < 70) label = "一般";
  return { score, label };
}

/* ---- 周报提升建议生成 ---- */

function generateSuggestions(thisWeek, lastWeek) {
  const suggestions = [];

  const pvThis = countByName(thisWeek, "page_view");
  const pvLast = countByName(lastWeek, "page_view");
  const uvThis = uniqueCount(thisWeek, "anon_id");
  const uvLast = uniqueCount(lastWeek, "anon_id");

  if (pvLast > 0) {
    const pvChange = ((pvThis - pvLast) / pvLast * 100).toFixed(1);
    if (pvChange < -20) {
      suggestions.push({ type: "down", text: `本周 PV 环比下降 ${pvChange}%（${pvLast} → ${pvThis}），建议检查是否有 SEO 排名波动、外链失效或站点可访问性问题` });
    } else if (pvChange > 20) {
      suggestions.push({ type: "up", text: `本周 PV 环比增长 ${pvChange}%（${pvLast} → ${pvThis}），表现优秀！建议分析流量来源，加大优质渠道投入` });
    }
  }

  if (uvLast > 0) {
    const uvChange = ((uvThis - uvLast) / uvLast * 100).toFixed(1);
    if (uvChange < -15) {
      suggestions.push({ type: "down", text: `本周 UV 环比下降 ${uvChange}%（${uvLast} → ${uvThis}），新访客减少，建议检查外链、社交媒体引流是否正常，或考虑增加内容营销` });
    } else if (uvChange > 20) {
      suggestions.push({ type: "up", text: `本周 UV 环比增长 ${uvChange}%（${uvLast} → ${uvThis}），用户规模在扩大，建议关注新用户留存` });
    }
  }

  const bounceThis = getBounceRate(thisWeek);
  if (bounceThis > 70) {
    suggestions.push({ type: "warn", text: `本周跳出率 ${bounceThis}% 偏高，用户进入后快速离开，建议优化首页内容吸引力、加载速度，或增加引导用户进入工具箱的入口` });
  }

  const ppv = uvThis > 0 ? (pvThis / uvThis).toFixed(1) : 0;
  if (ppv < 1.5 && pvThis > 10) {
    suggestions.push({ type: "warn", text: `人均浏览 ${ppv} 页偏低，用户停留时间短，建议增加作品间互相推荐的引导，或优化内容深度` });
  }

  const dur = getAvgSessionDuration(thisWeek);
  if (dur < 30 && pvThis > 10) {
    suggestions.push({ type: "warn", text: `平均会话时长仅 ${dur} 秒，用户停留时间过短，建议优化页面加载速度、增加互动元素或内容吸引力` });
  }

  const wau = getWAU(thisWeek);
  const mau = getMAU(thisWeek);
  const ratio = mau > 0 ? ((wau / mau) * 100).toFixed(1) : 0;
  if (ratio < 10 && mau > 20) {
    suggestions.push({ type: "warn", text: `WAU/MAU 比值仅 ${ratio}%（周活 ${wau} / 月活 ${mau}），用户粘性较低，建议增加打卡签到、积分等留存激励机制（已上线的跨产品打卡系统可加强引导）` });
  }

  /* 作品转化漏斗分析 */
  const funnels = [
    { name: "伴龄", steps: ["tool_enter", "banling_chat", "banling_report", "banling_action_adopt"] },
    { name: "漫游指南", steps: ["tool_enter", "rg_ai_open", "rg_ai_recommend_submit", "rg_ai_adopt_city"] },
    { name: "物资管家", steps: ["tool_enter", "iv_item_add", "iv_ai_ask"] },
    { name: "爱情公寓", steps: ["tool_enter", "apartment_chat", "apartment_post"] },
    { name: "通关清单", steps: ["tool_enter", "quest_complete", "quest_level"] },
    { name: "森林疗愈室", steps: ["tool_enter", "healing_breath", "healing_journal", "healing_meditation"] },
    { name: "回血清单", steps: ["tool_enter", "recharge_action"] },
  ];

  for (const f of funnels) {
    const data = calcFunnel(thisWeek, f.name, f.steps);
    if (data[0].count < 3) continue;
    const lastStep = data[data.length - 1];
    const finalRate = data[0].count > 0
      ? Math.round((lastStep.count / data[0].count) * 100)
      : 0;

    if (finalRate < 10 && data.length >= 3) {
      suggestions.push({
        type: "warn",
        text: `${f.name}本周最终转化率仅 ${finalRate}%（${data[0].count}人进入 → ${lastStep.count}人完成最后一步），建议分析用户在"${data[data.length - 2].step.replace(/_/g, " ")}"步骤流失原因，优化交互流程或降低操作门槛`,
      });
    }

    for (let i = 1; i < data.length; i++) {
      if (data[i].rate < 20 && data[i - 1].count >= 5) {
        suggestions.push({
          type: "warn",
          text: `${f.name}在"${data[i].step.replace(/_/g, " ")}"步骤转化仅 ${data[i].rate}%（${data[i - 1].count} → ${data[i].count}），是主要流失节点，建议本周重点优化此环节`,
        });
      }
    }
  }

  if (suggestions.length === 0) {
    if (pvThis > 0) {
      suggestions.push({ type: "good", text: "本周各项指标表现正常，继续保持！" });
    } else {
      suggestions.push({ type: "info", text: "本周暂无访问数据，可能是低流量周，建议检查站点是否正常部署" });
    }
  }

  return suggestions;
}

/* ---- 邮件 HTML 生成 ---- */

function buildReportHTML(thisWeek, lastWeek, suggestions) {
  const pv = countByName(thisWeek, "page_view");
  const uv = uniqueCount(thisWeek, "anon_id");
  const ppv = uv > 0 ? (pv / uv).toFixed(1) : "0";
  const bounce = getBounceRate(thisWeek);
  const totalEvents = thisWeek.length;
  const wau = getWAU(thisWeek);
  const mau = getMAU(thisWeek);
  const wauMau = mau > 0 ? ((wau / mau) * 100).toFixed(1) : "0";
  const avgDur = getAvgSessionDuration(thisWeek);
  const modeDist = getModeDistribution(thisWeek);

  /* 本周起始时间 */
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);
  const newVsRet = getNewVsReturning(thisWeek, weekStart.getTime());
  const health = getHealthScore(thisWeek);

  /* 环比 */
  const pvPrev = countByName(lastWeek, "page_view");
  const uvPrev = uniqueCount(lastWeek, "anon_id");
  const pvChange = pvPrev > 0 ? ((pv - pvPrev) / pvPrev * 100).toFixed(1) : "--";
  const uvChange = uvPrev > 0 ? ((uv - uvPrev) / uvPrev * 100).toFixed(1) : "--";

  /* 近 7 天趋势 */
  const trend = dailyCounts(thisWeek, 7);
  const maxTrend = Math.max(...trend.map((d) => d.count), 1);

  /* 各作品使用排行 */
  const toolEnters = {};
  thisWeek.filter((e) => e.name === "tool_enter").forEach((e) => {
    const name = e.props?.tool_name || "未命名";
    toolEnters[name] = (toolEnters[name] || 0) + 1;
  });
  const toolRanking = Object.entries(toolEnters).sort((a, b) => b[1] - a[1]);
  const maxTool = toolRanking[0]?.[1] || 1;

  const metrics = [
    { label: "PV", value: pv, change: pvChange, color: "#8D9A8B" },
    { label: "UV", value: uv, change: uvChange, color: "#E8853A" },
    { label: "人均浏览", value: ppv, sub: "页", color: "#7BA89E" },
    { label: "跳出率", value: bounce, sub: "%", color: bounce > 70 ? "#b06a6a" : "#C06A2E" },
    { label: "WAU/MAU", value: wau, sub: `MAU ${mau} · ${wauMau}%`, color: "#4d8a82" },
    { label: "会话时长", value: avgDur, sub: "秒", color: "#a8814a" },
    { label: "事件总数", value: totalEvents, color: "#8b7355" },
  ];

  function changeTag(val) {
    if (val === "--") return '<span style="color:#a8a39b">--</span>';
    const n = parseFloat(val);
    if (n > 0) return `<span style="color:#5d8a6a">+${val}%</span>`;
    if (n < 0) return `<span style="color:#b06a6a">${val}%</span>`;
    return `<span style="color:#a8a39b">0%</span>`;
  }

  function suggestionBadge(type) {
    const colors = {
      up: { bg: "#E8F5E9", text: "#4CAF50", label: "上升" },
      down: { bg: "#FDF2F2", text: "#EF4444", label: "下降" },
      warn: { bg: "#FFF8ED", text: "#F59E0B", label: "注意" },
      good: { bg: "#E8F5E9", text: "#4CAF50", label: "良好" },
      info: { bg: "#EFF6FF", text: "#3B82F6", label: "提示" },
    };
    const c = colors[type] || colors.info;
    return `<span style="display:inline-block;padding:2px 8px;border-radius:999px;background:${c.bg};color:${c.text};font-size:11px;font-weight:600;margin-right:8px;">${c.label}</span>`;
  }

  const weekStartStr = weekStart.toISOString().slice(0, 10);
  const todayStr = now.toISOString().slice(0, 10);

  /* 趋势柱状图 */
  const trendBars = trend.map((d) => {
    const pct = Math.round((d.count / maxTrend) * 100);
    const dayLabel = d.date.slice(5);
    return `
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;">
        <div style="font-size:10px;color:#a8a39b;">${d.count}</div>
        <div style="width:100%;max-width:40px;height:${Math.max(pct * 1.2, 4)}px;background:linear-gradient(to top, #8D9A8B, #7BA89E);border-radius:3px 3px 0 0;"></div>
        <div style="font-size:10px;color:#a8a39b;">${dayLabel}</div>
      </div>
    `;
  }).join("");

  return `
    <div style="font-family: -apple-system, 'Segoe UI', 'PingFang SC', sans-serif; max-width: 620px; margin: 0 auto; padding: 32px; background: #FAF9F6; border-radius: 16px; border: 1px solid #E8E6E1;">
      <!-- 标题 -->
      <div style="margin-bottom: 28px;">
        <h1 style="margin: 0 0 6px; font-size: 22px; color: #4a4038; letter-spacing: 0.04em;">每周数据分析周报</h1>
        <p style="margin: 0; font-size: 13px; color: #a8a39b;">${weekStartStr} ~ ${todayStr} · luro.site</p>
      </div>

      <!-- 健康评分 -->
      <div style="display: flex; align-items: center; gap: 16px; background: #fff; border-radius: 12px; padding: 16px 20px; border: 1px solid #E8E6E1; margin-bottom: 20px;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: ${health.score >= 80 ? '#E8F5E9' : health.score >= 50 ? '#FFF8ED' : '#FDF2F2'}; border: 3px solid ${health.score >= 80 ? '#4CAF50' : health.score >= 50 ? '#F59E0B' : '#EF4444'}; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: ${health.score >= 80 ? '#4CAF50' : health.score >= 50 ? '#F59E0B' : '#EF4444'}; flex-shrink: 0;">
          ${health.score}
        </div>
        <div>
          <div style="font-size: 15px; font-weight: 600; color: #4a4038;">数据健康评分：${health.label}</div>
          <div style="font-size: 12px; color: #a8a39b; margin-top: 2px;">综合跳出率、人均浏览、会话时长、WAU/MAU 四项指标</div>
        </div>
      </div>

      <!-- 核心指标 -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 24px;">
        ${metrics.map((m) => `
          <div style="background: #fff; border-radius: 10px; padding: 14px 10px; text-align: center; border: 1px solid #E8E6E1;">
            <div style="font-size: 11px; color: #a8a39b; margin-bottom: 6px;">${m.label}</div>
            <div style="font-size: 22px; font-weight: 700; color: ${m.color}; line-height: 1;">${m.value}${m.sub && !m.sub.includes("MAU") ? `<span style="font-size:12px;font-weight:400;margin-left:2px;">${m.sub}</span>` : ""}</div>
            ${m.change ? `<div style="font-size: 11px; margin-top: 4px;">${changeTag(m.change)} 周环比</div>` : ""}
            ${m.sub && m.sub.includes("MAU") ? `<div style="font-size: 11px; color: #a8a39b; margin-top: 4px;">${m.sub}</div>` : ""}
          </div>
        `).join("")}
      </div>

      <!-- 7 天趋势 -->
      <div style="background: #fff; border-radius: 12px; padding: 20px; border: 1px solid #E8E6E1; margin-bottom: 24px;">
        <div style="font-size: 13px; color: #4a4038; font-weight: 600; margin-bottom: 16px;">近 7 天事件趋势</div>
        <div style="display: flex; align-items: flex-end; gap: 6px; height: 100px;">
          ${trendBars}
        </div>
      </div>

      <!-- 用户构成 + 访问模式 两栏 -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 24px;">
        <div style="background: #fff; border-radius: 10px; padding: 16px; border: 1px solid #E8E6E1;">
          <div style="font-size: 11px; color: #a8a39b; margin-bottom: 10px;">本周用户构成</div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 12px; color: #4a4038;">新用户</span>
            <span style="font-size: 14px; font-weight: 700; color: #7BA89E;">${newVsRet.newUsers}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="font-size: 12px; color: #4a4038;">回访用户</span>
            <span style="font-size: 14px; font-weight: 700; color: #E8853A;">${newVsRet.returning}</span>
          </div>
        </div>
        <div style="background: #fff; border-radius: 10px; padding: 16px; border: 1px solid #E8E6E1;">
          <div style="font-size: 11px; color: #a8a39b; margin-bottom: 10px;">访问模式</div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 12px; color: #4a4038;">Full 模式</span>
            <span style="font-size: 14px; font-weight: 700; color: #5d7a8a;">${modeDist.fullPct}%</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="font-size: 12px; color: #4a4038;">Solo 模式</span>
            <span style="font-size: 14px; font-weight: 700; color: #C06A2E;">${modeDist.soloPct}%</span>
          </div>
        </div>
      </div>

      ${toolRanking.length > 0 ? `
      <!-- 作品使用排行 -->
      <div style="margin-bottom: 24px;">
        <h2 style="margin: 0 0 14px; font-size: 15px; color: #4a4038; font-weight: 600;">本周作品使用排行</h2>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${toolRanking.slice(0, 8).map(([name, count], i) => {
            const pct = Math.round((count / maxTool) * 100);
            const colors = ["#8D9A8B", "#7BA89E", "#C06A2E", "#E8853A", "#8b7355", "#a8a39b", "#5d7a8a", "#a8814a"];
            return `
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="width: 18px; font-size: 11px; font-weight: 700; color: ${i < 3 ? "#E8853A" : "#a8a39b"}; text-align: center;">${i + 1}</span>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; font-size: 12px; color: #4a4038; margin-bottom: 3px;">
                    <span>${name}</span>
                    <span style="font-weight: 600;">${count}</span>
                  </div>
                  <div style="height: 6px; border-radius: 3px; background: #E8E6E1; overflow: hidden;">
                    <div style="height: 100%; width: ${pct}%; background: ${colors[i] || colors[7]}; border-radius: 3px;"></div>
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
      ` : ""}

      <!-- 优化建议 -->
      <div style="margin-bottom: 24px;">
        <h2 style="margin: 0 0 14px; font-size: 15px; color: #4a4038; font-weight: 600;">本周优化建议</h2>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${suggestions.map((s) => `
            <div style="background: #fff; border-radius: 10px; padding: 14px 16px; border: 1px solid #E8E6E1; font-size: 13px; color: #4a4038; line-height: 1.6;">
              ${suggestionBadge(s.type)}${s.text}
            </div>
          `).join("")}
        </div>
      </div>

      <!-- 页脚 -->
      <p style="margin: 0; color: #ccc; font-size: 11px; text-align: center; letter-spacing: 0.04em;">— luro.site 每周数据周报 · 每周一自动生成 —</p>
      <p style="margin: 8px 0 0; text-align: center;"><a href="${SITE_URL}" style="color: #8D9A8B; font-size: 12px; text-decoration: none;">查看数据面板 &rarr;</a></p>
    </div>
  `;
}

/* ---- 主逻辑 ---- */

export default async function handler(req, res) {
  try {
    // 鉴权：支持 Vercel Cron 自动调用 + 手动密钥调用
    // Vercel Cron 设置 CRON_SECRET 后会自动带 Authorization: Bearer <secret>
    const authHeader = req.headers["authorization"];
    const cronSecret = process.env.CRON_SECRET;
    const isCronCall = cronSecret && authHeader === `Bearer ${cronSecret}`;
    const manualSecret = req.query?.secret || req.headers["x-report-secret"];
    const isManualCall = manualSecret && manualSecret === process.env.REPORT_SECRET;

    if (!isCronCall && !isManualCall) {
      return res.status(403).json({ error: "密钥错误，请通过 Vercel Cron 或携带正确密钥调用" });
    }

    // 获取数据：本周 7 天 + 上周 7 天（用于环比）
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = todayStart - 7 * 86400_000;       // 本周起始（7天前）
    const lastWeekStart = weekStart - 7 * 86400_000;     // 上周起始（14天前）

    // 查询最近 14 天事件，再按时间分割
    const allRecent = await queryEvents(14 * 24 + 1); // 14天+1小时余量
    const thisWeek = allRecent.filter((e) => e.ts >= weekStart && e.ts < todayStart);
    const lastWeek = allRecent.filter((e) => e.ts >= lastWeekStart && e.ts < weekStart);

    // 生成建议
    const suggestions = generateSuggestions(thisWeek, lastWeek);

    // 构建邮件
    const html = buildReportHTML(thisWeek, lastWeek, suggestions);
    const weekStartStr = new Date(weekStart).toISOString().slice(0, 10);
    const todayStr = now.toISOString().slice(0, 10);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const toEmail = process.env.REPORT_TO_EMAIL || process.env.SMTP_USER;

    await transporter.sendMail({
      from: `luro.site 数据报告 <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `【luro.site】每周数据周报 · ${weekStartStr} ~ ${todayStr}`,
      html,
    });

    console.log(`[analytics-weekly-report] 周报已发送至 ${toEmail}，本周 PV=${countByName(thisWeek, "page_view")}, UV=${uniqueCount(thisWeek, "anon_id")}`);

    return res.status(200).json({
      ok: true,
      period: `${weekStartStr} ~ ${todayStr}`,
      pv: countByName(thisWeek, "page_view"),
      uv: uniqueCount(thisWeek, "anon_id"),
      events: thisWeek.length,
      sentTo: toEmail,
    });
  } catch (err) {
    console.error("[analytics-weekly-report] error:", err.message, err.stack);
    return res.status(500).json({ error: err.message });
  }
}
