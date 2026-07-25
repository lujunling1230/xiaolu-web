/*
 * Analytics API v4 — Supabase 版
 * POST /api/analytics          -> 写入埋点事件（支持 ?batch=1 批量）
 * GET  /api/analytics          -> 读取全部埋点事件
 * GET  /api/analytics?hours=24 -> 读取最近 N 小时的事件
 * DELETE /api/analytics        -> 清空数据（需管理员密码）
 *
 * 安全措施：
 *   - 事件白名单校验
 *   - bot/crawler User-Agent 过滤
 *   - 服务端时间覆盖前端时间
 *   - 同 IP 60次/分钟 限流
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const TABLE_NAME = "analytics_events";
const ADMIN_PASSWORD = "ling";
const MAX_EVENTS = 15000;

/* ---- Supabase 客户端（服务端用 service_role key，绕过 RLS） ---- */
let supabase = null;

function getSupabase() {
  if (!supabase && SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabase;
}

/* ---- P0 事件白名单（与前端 track.ts 保持一致） ---- */
const ALLOWED_EVENTS = new Set([
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
  "healing_breath",
  "healing_journal",
  "healing_meditation",
  "apartment_chat",
  "apartment_post",
  "quest_complete",
  "quest_level",
  "advice_letter",
  "advice_reply",
  "recharge_action",
]);

/* ---- Bot / Crawler 检测 ---- */
const BOT_PATTERNS = /bot|crawler|spider|slurp|mediapartners|preview|fetch|curl|wget|python|java\//i;

function isBot(ua) {
  if (!ua) return false;
  return BOT_PATTERNS.test(ua);
}

/* ---- 简易 IP 限流（内存级，Vercel Serverless 单实例够用） ---- */
const rateLimitMap = new Map(); // ip -> { count, resetAt }
const RATE_LIMIT = 60; // 次/分钟
const RATE_WINDOW = 60_000; // ms

function isRateLimited(ip) {
  const now = Date.now();
  let entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + RATE_WINDOW };
    rateLimitMap.set(ip, entry);
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

/* ---- 客户端 IP 提取 ---- */
function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    "unknown"
  );
}

/* ---- 清洗单条事件 ---- */
function sanitizeEvent(evt) {
  return {
    id: evt.id || `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: String(evt.name).slice(0, 100),
    props: typeof evt.props === "object" && evt.props !== null ? evt.props : {},
    ts: Date.now(), // 强制服务端时间
    session: String(evt.session || "").slice(0, 30),
    anon_id: String(evt.anon_id || "").slice(0, 50),
    path: String(evt.path || "").slice(0, 200),
  };
}

/* ---- 数据读写 ---- */

/** 写入事件到 Supabase */
async function insertEvents(events) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase 未配置");

  const { error } = await sb.from(TABLE_NAME).insert(events);
  if (error) throw new Error(`Supabase insert failed: ${error.message}`);
}

/** 读取全部事件（按时间倒序） */
async function readAllEvents() {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase 未配置");

  const { data, error } = await sb
    .from(TABLE_NAME)
    .select("*")
    .order("ts", { ascending: false })
    .limit(MAX_EVENTS);

  if (error) throw new Error(`Supabase select failed: ${error.message}`);
  return data || [];
}

/** 读取最近 N 小时的事件 */
async function readRecentEvents(hours) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase 未配置");

  const cutoff = Date.now() - Number(hours) * 3600_000;

  const { data, error } = await sb
    .from(TABLE_NAME)
    .select("*")
    .gte("ts", cutoff)
    .order("ts", { ascending: false })
    .limit(MAX_EVENTS);

  if (error) throw new Error(`Supabase select failed: ${error.message}`);
  return data || [];
}

/** 清空全部事件 */
async function clearAllEvents() {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase 未配置");

  const { error } = await sb.from(TABLE_NAME).delete().neq("id", "___never___");
  if (error) throw new Error(`Supabase delete failed: ${error.message}`);
}

export default async function handler(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();

    const clientIp = getClientIp(req);
    const ua = req.headers["user-agent"] || "";

    /* ---- POST: 写入事件 ---- */
    if (req.method === "POST") {
      // Bot 过滤
      if (isBot(ua)) {
        return res.status(200).json({ ok: true, ignored: true });
      }

      // 限流
      if (isRateLimited(clientIp)) {
        return res.status(429).json({ error: "请求过于频繁，请稍后再试" });
      }

      const isBatch = req.query?.batch === "1";

      /* Vercel 对 text/plain 的 body 不会自动解析为 JSON，
         手动解析以确保 sendBeacon 等场景也能正确处理 */
      let body = req.body;
      if (typeof body === "string") {
        try { body = JSON.parse(body); } catch { body = null; }
      }

      let rawEvents = isBatch ? body : [body];

      if (!Array.isArray(rawEvents)) {
        return res.status(400).json({ error: "请求体格式错误" });
      }

      // 白名单过滤 + 清洗
      const validEvents = [];
      for (const evt of rawEvents) {
        if (!evt?.name || !ALLOWED_EVENTS.has(evt.name)) continue;
        validEvents.push(sanitizeEvent(evt));
      }

      if (validEvents.length === 0) {
        return res.status(200).json({ ok: true, accepted: 0 });
      }

      await insertEvents(validEvents);

      return res.status(200).json({
        ok: true,
        accepted: validEvents.length,
      });
    }

    /* ---- GET: 读取事件 ---- */
    if (req.method === "GET") {
      const { hours } = req.query || {};

      let events;
      if (hours) {
        events = await readRecentEvents(hours);
      } else {
        events = await readAllEvents();
      }

      return res.status(200).json({ events, total: events.length });
    }

    /* ---- DELETE: 清空数据 ---- */
    if (req.method === "DELETE") {
      const { password } = req.body || {};
      if (password !== ADMIN_PASSWORD) {
        return res.status(403).json({ error: "密码错误" });
      }
      await clearAllEvents();
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (err) {
    console.error("[analytics] handler error:", err.message, err.stack);
    return res.status(500).json({ error: err.message || "服务器错误" });
  }
}
