/*
 * Analytics API v2
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

import { put, list, del } from "@vercel/blob";

const BLOB_KEY = "luro-analytics/events.json";
const ADMIN_PASSWORD = "ling";
const MAX_EVENTS = 15000;

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

/* ---- 数据读写 ---- */
/* Private store 的 URL 需要 token 认证才能读取 */
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

async function readAllEvents() {
  try {
    const { blobs } = await list({ prefix: "luro-analytics/" });
    if (blobs.length === 0) return [];
    const blob = blobs.find((b) => b.pathname === BLOB_KEY);
    if (!blob) return [];
    const downloadUrl = blob.downloadUrl || blob.url;
    /* private store 需要携带 Authorization header */
    const res = await fetch(downloadUrl, {
      headers: BLOB_TOKEN
        ? { Authorization: `Bearer ${BLOB_TOKEN}` }
        : {},
    });
    if (!res.ok) {
      console.error("[analytics] fetch blob failed:", res.status, res.statusText);
      return [];
    }
    const text = await res.text();
    if (!text || text === "Forbidden") return [];
    return JSON.parse(text);
  } catch (err) {
    console.error("[analytics] readAllEvents error:", err.message);
    return [];
  }
}

async function writeAllEvents(events) {
  const json = JSON.stringify(events);
  const result = await put(BLOB_KEY, json, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return result;
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

      const all = await readAllEvents();
      all.push(...validEvents);
      if (all.length > MAX_EVENTS) {
        all.splice(0, all.length - MAX_EVENTS);
      }
      const writeResult = await writeAllEvents(all);

      return res.status(200).json({
        ok: true,
        accepted: validEvents.length,
        writeUrl: writeResult?.url?.slice(0, 60),
      });
    }

    /* ---- GET: 读取事件 ---- */
    if (req.method === "GET") {
      const { hours, debug } = req.query || {};

      /* 调试模式：查看 Blob 存储状态 + 尝试读取内容 */
      if (debug === "1") {
        const { blobs } = await list({ prefix: "luro-analytics/" });
        const blob = blobs.find((b) => b.pathname === BLOB_KEY);
        let readDebug = null;
        if (blob) {
          try {
            const downloadUrl = blob.downloadUrl || blob.url;
            const fetchRes = await fetch(downloadUrl, {
              headers: BLOB_TOKEN
                ? { Authorization: `Bearer ${BLOB_TOKEN}` }
                : {},
            });
            const text = await fetchRes.text();
            readDebug = {
              fetchStatus: fetchRes.status,
              fetchOk: fetchRes.ok,
              contentLength: text.length,
              contentPreview: text.slice(0, 300),
              isJson: text.startsWith("[") || text.startsWith("{"),
            };
          } catch (err) {
            readDebug = { error: err.message };
          }
        }
        return res.status(200).json({
          blobCount: blobs.length,
          blobs: blobs.map((b) => ({
            pathname: b.pathname,
            hasDownloadUrl: !!b.downloadUrl,
            hasUrl: !!b.url,
            size: b.size,
          })),
          readDebug,
        });
      }

      const all = await readAllEvents();
      if (hours) {
        const cutoff = Date.now() - Number(hours) * 3600_000;
        const filtered = all.filter((e) => e.ts >= cutoff);
        return res.status(200).json({ events: filtered, total: all.length });
      }
      return res.status(200).json({ events: all, total: all.length });
    }

    /* ---- DELETE: 清空数据 ---- */
    if (req.method === "DELETE") {
      const { password } = req.body || {};
      if (password !== ADMIN_PASSWORD) {
        return res.status(403).json({ error: "密码错误" });
      }
      try {
        const { blobs } = await list({ prefix: "luro-analytics/" });
        for (const blob of blobs) {
          await del(blob.url);
        }
      } catch {
        // 忽略删除失败
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (err) {
    return res.status(500).json({ error: err.message || "服务器错误" });
  }
}
