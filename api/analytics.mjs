/**
 * Analytics API
 * POST /api/analytics/track   -> 写入一条埋点事件到 Vercel Blob
 * GET  /api/analytics          -> 读取全部埋点事件
 * GET  /api/analytics?hours=24 -> 读取最近 N 小时的事件
 * DELETE /api/analytics        -> 清空数据（需管理员密码）
 */

import { put, list, del } from "@vercel/blob";

const BLOB_KEY = "luro-analytics/events.json";
const ADMIN_PASSWORD = "ling";

/** 读取当前所有事件 */
async function readAllEvents() {
  try {
    const { blobs } = await list({ prefix: "luro-analytics/" });
    if (blobs.length === 0) return [];
    const blob = blobs.find((b) => b.pathname === BLOB_KEY);
    if (!blob) return [];
    const res = await fetch(blob.downloadUrl);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

/** 写入所有事件（覆盖） */
async function writeAllEvents(events) {
  const json = JSON.stringify(events);
  await put(BLOB_KEY, json, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export default async function handler(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();

    /* POST /api/analytics/track — 写入一条事件 */
    if (req.method === "POST") {
      const event = req.body;
      if (!event || !event.name) {
        return res.status(400).json({ error: "事件缺少 name 字段" });
      }
      // 基本字段校验
      const clean = {
        id: event.id || `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: String(event.name).slice(0, 100),
        props: event.props || {},
        ts: typeof event.ts === "number" ? event.ts : Date.now(),
        session: String(event.session || "").slice(0, 30),
        path: String(event.path || "").slice(0, 200),
      };

      const all = await readAllEvents();
      all.push(clean);
      // 最多保留 10000 条
      if (all.length > 10000) {
        all.splice(0, all.length - 10000);
      }
      await writeAllEvents(all);
      return res.status(200).json({ ok: true });
    }

    /* GET /api/analytics — 读取事件 */
    if (req.method === "GET") {
      const { hours } = req.query || {};
      const all = await readAllEvents();
      if (hours) {
        const cutoff = Date.now() - Number(hours) * 3600_000;
        const filtered = all.filter((e) => e.ts >= cutoff);
        return res.status(200).json({ events: filtered, total: all.length });
      }
      return res.status(200).json({ events: all, total: all.length });
    }

    /* DELETE /api/analytics — 清空数据 */
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
    console.error("[api/analytics] error:", err);
    return res.status(500).json({ error: err.message || "服务器错误" });
  }
}
