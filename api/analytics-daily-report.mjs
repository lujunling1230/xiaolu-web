/*
 * 每日数据分析报告 API
 * GET /api/analytics-daily-report?secret=xxx&test=1
 *
 * 用法：
 *   1. Vercel Cron 每天定时触发（见 vercel.json）
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

/* ---- 提升建议生成 ---- */

function generateSuggestions(yesterday, twoDaysAgo) {
  const suggestions = [];

  // PV 变化
  const pvToday = yesterday.filter((e) => e.name === "page_view").length;
  const pvYesterday = twoDaysAgo.filter((e) => e.name === "page_view").length;
  const uvToday = uniqueCount(yesterday, "anon_id");
  const uvYesterday = uniqueCount(twoDaysAgo, "anon_id");

  if (pvYesterday > 0) {
    const pvChange = ((pvToday - pvYesterday) / pvYesterday * 100).toFixed(1);
    if (pvChange < -20) {
      suggestions.push({ icon: "📉", text: `PV 环比下降 ${pvChange}%，建议检查是否有 SEO 排名波动或站点可访问性问题` });
    } else if (pvChange > 20) {
      suggestions.push({ icon: "📈", text: `PV 环比增长 ${pvChange}%，表现优秀！可以分析哪个渠道带来的流量增长，加大投入` });
    }
  }

  if (uvYesterday > 0) {
    const uvChange = ((uvToday - uvYesterday) / uvYesterday * 100).toFixed(1);
    if (uvChange < -15) {
      suggestions.push({ icon: "👥", text: `UV 环比下降 ${uvChange}%，新访客减少，建议检查外链、社交媒体引流是否正常` });
    }
  }

  // 跳出率
  const bounceToday = getBounceRate(yesterday);
  if (bounceToday > 70) {
    suggestions.push({ icon: "🚪", text: `跳出率 ${bounceToday}% 偏高，建议优化首页内容吸引力，或增加引导用户进入工具箱的入口` });
  }

  // 人均浏览页数
  const ppv = uvToday > 0 ? (pvToday / uvToday).toFixed(1) : 0;
  if (ppv < 1.5 && pvToday > 5) {
    suggestions.push({ icon: "📖", text: `人均浏览 ${ppv} 页偏低，用户停留时间短，建议增加作品间互相推荐的引导` });
  }

  // 作品转化漏斗分析
  const funnels = [
    { name: "伴龄", steps: ["tool_enter", "banling_chat", "banling_report", "banling_action_adopt"] },
    { name: "漫游指南", steps: ["tool_enter", "rg_ai_open", "rg_ai_recommend_submit", "rg_ai_adopt_city"] },
    { name: "解忧杂货店", steps: ["tool_enter", "advice_letter", "advice_reply"] },
    { name: "物资管家", steps: ["tool_enter", "iv_item_add", "iv_ai_ask"] },
    { name: "爱情公寓", steps: ["tool_enter", "apartment_chat", "apartment_post"] },
    { name: "通关清单", steps: ["tool_enter", "quest_complete", "quest_level"] },
    { name: "森林疗愈室", steps: ["tool_enter", "healing_breath", "healing_journal", "healing_meditation"] },
    { name: "回血清单", steps: ["tool_enter", "recharge_action"] },
  ];

  for (const f of funnels) {
    const data = calcFunnel(yesterday, f.name, f.steps);
    if (data[0].count < 3) continue; // 样本太少跳过
    const lastStep = data[data.length - 1];
    const finalRate = data[0].count > 0
      ? Math.round((lastStep.count / data[0].count) * 100)
      : 0;

    if (finalRate < 10 && data.length >= 3) {
      suggestions.push({
        icon: "🔧",
        text: `${f.name}最终转化率仅 ${finalRate}%（${data[0].count}人进入 → ${lastStep.count}人完成最后一步），建议分析用户在"${data[data.length - 2].step.replace(/_/g, " ")}"步骤流失原因，优化交互流程或降低操作门槛`,
      });
    }

    // 检查某一步骤骤降严重
    for (let i = 1; i < data.length; i++) {
      if (data[i].rate < 20 && data[i - 1].count >= 5) {
        suggestions.push({
          icon: "⚠️",
          text: `${f.name}在"${data[i].step.replace(/_/g, " ")}"步骤转化仅 ${data[i].rate}%，是主要流失节点，建议重点优化此环节`,
        });
      }
    }
  }

  // 如果没有问题，给正面反馈
  if (suggestions.length === 0) {
    if (pvToday > 0) {
      suggestions.push({ icon: "✅", text: "各项指标表现正常，继续保持！" });
    } else {
      suggestions.push({ icon: "💤", text: "昨日暂无访问数据，可能是低流量日" });
    }
  }

  return suggestions;
}

/* ---- 邮件 HTML 生成 ---- */

function buildReportHTML(yesterday, twoDaysAgo, suggestions) {
  const pv = countByName(yesterday, "page_view");
  const uv = uniqueCount(yesterday, "anon_id");
  const ppv = uv > 0 ? (pv / uv).toFixed(1) : "0";
  const bounce = getBounceRate(yesterday);
  const totalEvents = yesterday.length;

  // 环比
  const pvPrev = countByName(twoDaysAgo, "page_view");
  const uvPrev = uniqueCount(twoDaysAgo, "anon_id");
  const pvChange = pvPrev > 0 ? ((pv - pvPrev) / pvPrev * 100).toFixed(1) : "--";
  const uvChange = uvPrev > 0 ? ((uv - uvPrev) / uvPrev * 100).toFixed(1) : "--";

  // 近 7 天趋势
  const last48h = [...twoDaysAgo, ...yesterday];
  const trend = dailyCounts(last48h, 3);
  const maxTrend = Math.max(...trend.map((d) => d.count), 1);

  // 各作品使用排行
  const toolEnters = {};
  yesterday.filter((e) => e.name === "tool_enter").forEach((e) => {
    const name = e.props?.tool_name || "未命名";
    toolEnters[name] = (toolEnters[name] || 0) + 1;
  });
  const toolRanking = Object.entries(toolEnters).sort((a, b) => b[1] - a[1]);
  const maxTool = toolRanking[0]?.[1] || 1;

  // 关键指标卡片
  const metrics = [
    { label: "PV (浏览量)", value: pv, change: pvChange, color: "#8D9A8B" },
    { label: "UV (访客数)", value: uv, change: uvChange, color: "#E8853A" },
    { label: "人均浏览", value: ppv, sub: "页/人", color: "#7BA89E" },
    { label: "跳出率", value: bounce, sub: "%", color: bounce > 70 ? "#b06a6a" : "#C06A2E" },
    { label: "事件总数", value: totalEvents, color: "#8b7355" },
  ];

  function changeTag(val) {
    if (val === "--") return '<span style="color:#a8a39b">--</span>';
    const n = parseFloat(val);
    if (n > 0) return `<span style="color:#5d8a6a">↑${val}%</span>`;
    if (n < 0) return `<span style="color:#b06a6a">↓${Math.abs(val)}%</span>`;
    return `<span style="color:#a8a39b">→0%</span>`;
  }

  const yesterdayStr = new Date(Date.now() - 86400_000).toISOString().slice(0, 10);

  return `
    <div style="font-family: -apple-system, 'Segoe UI', 'PingFang SC', sans-serif; max-width: 620px; margin: 0 auto; padding: 32px; background: #FAF9F6; border-radius: 16px; border: 1px solid #E8E6E1;">
      <!-- 标题 -->
      <div style="margin-bottom: 28px;">
        <h1 style="margin: 0 0 6px; font-size: 22px; color: #4a4038; letter-spacing: 0.04em;">每日数据分析报告</h1>
        <p style="margin: 0; font-size: 13px; color: #a8a39b;">${yesterdayStr} · luro.site</p>
      </div>

      <!-- 核心指标 -->
      <div style="display: grid; grid-template-columns: repeat(${metrics.length}, 1fr); gap: 10px; margin-bottom: 28px;">
        ${metrics.map((m) => `
          <div style="background: #fff; border-radius: 10px; padding: 14px 12px; text-align: center; border: 1px solid #E8E6E1;">
            <div style="font-size: 11px; color: #a8a39b; margin-bottom: 6px;">${m.label}</div>
            <div style="font-size: 24px; font-weight: 700; color: ${m.color}; line-height: 1;">${m.value}${m.sub || ""}</div>
            ${m.change ? `<div style="font-size: 11px; margin-top: 4px;">${changeTag(m.change)} 环比</div>` : ""}
          </div>
        `).join("")}
      </div>

      ${toolRanking.length > 0 ? `
      <!-- 作品使用排行 -->
      <div style="margin-bottom: 28px;">
        <h2 style="margin: 0 0 14px; font-size: 15px; color: #4a4038; font-weight: 600;">昨日作品使用排行</h2>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${toolRanking.slice(0, 6).map(([name, count], i) => {
            const pct = Math.round((count / maxTool) * 100);
            const colors = ["#8D9A8B", "#7BA89E", "#C06A2E", "#E8853A", "#8b7355", "#a8a39b"];
            return `
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="width: 18px; font-size: 11px; font-weight: 700; color: ${i < 3 ? "#E8853A" : "#a8a39b"}; text-align: center;">${i + 1}</span>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; font-size: 12px; color: #4a4038; margin-bottom: 3px;">
                    <span>${name}</span>
                    <span style="font-weight: 600;">${count}</span>
                  </div>
                  <div style="height: 6px; border-radius: 3px; background: #E8E6E1; overflow: hidden;">
                    <div style="height: 100%; width: ${pct}%; background: ${colors[i] || colors[5]}; border-radius: 3px;"></div>
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
      ` : ""}

      <!-- 提升建议 -->
      <div style="margin-bottom: 24px;">
        <h2 style="margin: 0 0 14px; font-size: 15px; color: #4a4038; font-weight: 600;">提升建议</h2>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${suggestions.map((s) => `
            <div style="background: #fff; border-radius: 10px; padding: 14px 16px; border: 1px solid #E8E6E1; font-size: 13px; color: #4a4038; line-height: 1.6;">
              <span style="margin-right: 6px;">${s.icon}</span>${s.text}
            </div>
          `).join("")}
        </div>
      </div>

      <!-- 页脚 -->
      <p style="margin: 0; color: #ccc; font-size: 11px; text-align: center; letter-spacing: 0.04em;">— luro.site 每日数据分析报告 · 自动生成 —</p>
      <p style="margin: 8px 0 0; text-align: center;"><a href="${SITE_URL}" style="color: #8D9A8B; font-size: 12px; text-decoration: none;">查看数据面板 →</a></p>
    </div>
  `;
}

/* ---- 主逻辑 ---- */

export default async function handler(req, res) {
  try {
    // 密钥校验
    const secret = req.query?.secret || req.headers["x-report-secret"];
    if (secret !== process.env.REPORT_SECRET) {
      return res.status(403).json({ error: "密钥错误" });
    }

    // 获取数据：昨天 0~24 点 + 前天 0~24 点（用于环比）
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400_000;
    const twoDaysAgoStart = yesterdayStart - 86400_000;

    // 查询最近 48 小时事件，再按时间分割
    const allRecent = await queryEvents(48);
    const yesterday = allRecent.filter((e) => e.ts >= yesterdayStart && e.ts < todayStart);
    const twoDaysAgo = allRecent.filter((e) => e.ts >= twoDaysAgoStart && e.ts < yesterdayStart);

    // 生成建议
    const suggestions = generateSuggestions(yesterday, twoDaysAgo);

    // 构建邮件
    const html = buildReportHTML(yesterday, twoDaysAgo, suggestions);
    const yesterdayStr = new Date(yesterdayStart).toISOString().slice(0, 10);

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
      subject: `【luro.site】每日数据报告 · ${yesterdayStr}`,
      html,
    });

    console.log(`[analytics-daily-report] 报告已发送至 ${toEmail}，昨日 PV=${countByName(yesterday, "page_view")}, UV=${uniqueCount(yesterday, "anon_id")}`);

    return res.status(200).json({
      ok: true,
      date: yesterdayStr,
      pv: countByName(yesterday, "page_view"),
      uv: uniqueCount(yesterday, "anon_id"),
      events: yesterday.length,
      sentTo: toEmail,
    });
  } catch (err) {
    console.error("[analytics-daily-report] error:", err.message, err.stack);
    return res.status(500).json({ error: err.message });
  }
}
