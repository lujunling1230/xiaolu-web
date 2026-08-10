/*
 * Auth API — 跨浏览器用户认证
 *
 * POST /api/auth  body: { action, username, password, token }
 *   action=register  → 注册新账号（服务端存储）
 *   action=login     → 登录验证，返回 session token
 *   action=verify    → 验证 session token 是否有效
 *   action=logout    → 注销 session token
 *
 * 需要在 Supabase 创建表（只需执行一次）：
 *   CREATE TABLE IF NOT EXISTS user_accounts (
 *     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *     username TEXT UNIQUE NOT NULL,
 *     password_hash TEXT NOT NULL,
 *     session_token TEXT,
 *     session_expires BIGINT,
 *     created_at BIGINT DEFAULT (extract(epoch from now()) * 1000)::BIGINT
 *   );
 */

import { createClient } from "@supabase/supabase-js";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const TABLE_NAME = "user_accounts";
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 天（毫秒）

/* ---- Supabase 客户端 ---- */
let supabase = null;

function getSupabase() {
  if (!supabase && SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabase;
}

/* ---- 密码哈希（scrypt + salt） ---- */
function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  try {
    const [salt, hash] = storedHash.split(":");
    if (!salt || !hash) return false;
    const testHash = scryptSync(password, salt, 64).toString("hex");
    const hashBuf = Buffer.from(hash, "hex");
    const testBuf = Buffer.from(testHash, "hex");
    if (hashBuf.length !== testBuf.length) return false;
    return timingSafeEqual(hashBuf, testBuf);
  } catch {
    return false;
  }
}

/* ---- Session token 生成 ---- */
function generateToken() {
  return randomBytes(32).toString("hex");
}

/* ---- 简易 IP 限流 ---- */
const rateLimitMap = new Map();
const RATE_LIMIT = 20; // 20 次/分钟
const RATE_WINDOW = 60_000;

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

function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    "unknown"
  );
}

/* ---- 输入校验 ---- */
function validateUsername(username) {
  if (!username || typeof username !== "string") return "请输入用户名";
  const trimmed = username.trim();
  if (trimmed.length < 2) return "用户名至少2个字符";
  if (trimmed.length > 20) return "用户名最多20个字符";
  return null;
}

function validatePassword(password) {
  if (!password || typeof password !== "string") return "请输入密码";
  if (password.length < 4) return "密码至少4个字符";
  return null;
}

/* ---- 主处理函数 ---- */
export default async function handler(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    const clientIp = getClientIp(req);
    if (isRateLimited(clientIp)) {
      return res.status(429).json({ success: false, error: "请求过于频繁，请稍后再试" });
    }

    const { action, username, password, token } = req.body || {};
    const sb = getSupabase();
    if (!sb) {
      return res.status(500).json({ success: false, error: "认证服务暂不可用" });
    }

    /* ===== 注册 ===== */
    if (action === "register") {
      const usernameErr = validateUsername(username);
      if (usernameErr) return res.status(400).json({ success: false, error: usernameErr });
      const passwordErr = validatePassword(password);
      if (passwordErr) return res.status(400).json({ success: false, error: passwordErr });

      const trimmedName = username.trim();

      // 检查用户名是否已存在
      const { data: existing, error: queryErr } = await sb
        .from(TABLE_NAME)
        .select("username")
        .eq("username", trimmedName)
        .limit(1);

      if (queryErr) {
        console.error("Register query error:", queryErr);
        return res.status(500).json({ success: false, error: "注册失败，请稍后再试" });
      }

      if (existing && existing.length > 0) {
        return res.status(409).json({ success: false, error: "该用户名已被注册" });
      }

      // 创建账号
      const passwordHash = hashPassword(password);
      const sessionToken = generateToken();
      const sessionExpires = Date.now() + SESSION_DURATION;

      const { error: insertErr } = await sb.from(TABLE_NAME).insert({
        username: trimmedName,
        password_hash: passwordHash,
        session_token: sessionToken,
        session_expires: sessionExpires,
        created_at: Date.now(),
      });

      if (insertErr) {
        console.error("Register insert error:", insertErr);
        // 可能是并发注册导致唯一约束冲突
        if (insertErr.code === "23505") {
          return res.status(409).json({ success: false, error: "该用户名已被注册" });
        }
        return res.status(500).json({ success: false, error: "注册失败，请稍后再试" });
      }

      return res.status(200).json({
        success: true,
        token: sessionToken,
        username: trimmedName,
        expires: sessionExpires,
      });
    }

    /* ===== 登录 ===== */
    if (action === "login") {
      const usernameErr = validateUsername(username);
      if (usernameErr) return res.status(400).json({ success: false, error: usernameErr });
      if (!password) return res.status(400).json({ success: false, error: "请输入密码" });

      const trimmedName = username.trim();

      const { data: user, error: queryErr } = await sb
        .from(TABLE_NAME)
        .select("id, username, password_hash, session_token, session_expires")
        .eq("username", trimmedName)
        .limit(1)
        .single();

      if (queryErr || !user) {
        return res.status(401).json({ success: false, error: "用户名或密码错误" });
      }

      if (!verifyPassword(password, user.password_hash)) {
        return res.status(401).json({ success: false, error: "用户名或密码错误" });
      }

      // 生成新 session token
      const sessionToken = generateToken();
      const sessionExpires = Date.now() + SESSION_DURATION;

      const { error: updateErr } = await sb
        .from(TABLE_NAME)
        .update({ session_token: sessionToken, session_expires: sessionExpires })
        .eq("id", user.id);

      if (updateErr) {
        console.error("Login update error:", updateErr);
        return res.status(500).json({ success: false, error: "登录失败，请稍后再试" });
      }

      return res.status(200).json({
        success: true,
        token: sessionToken,
        username: trimmedName,
        expires: sessionExpires,
      });
    }

    /* ===== 验证 session token ===== */
    if (action === "verify") {
      if (!token) return res.status(400).json({ success: false, error: "缺少 token" });

      const { data: user, error: queryErr } = await sb
        .from(TABLE_NAME)
        .select("username, session_token, session_expires")
        .eq("session_token", token)
        .limit(1)
        .single();

      if (queryErr || !user) {
        return res.status(200).json({ success: false, valid: false });
      }

      // 检查是否过期
      if (!user.session_expires || user.session_expires < Date.now()) {
        return res.status(200).json({ success: false, valid: false });
      }

      return res.status(200).json({
        success: true,
        valid: true,
        username: user.username,
      });
    }

    /* ===== 注销 ===== */
    if (action === "logout") {
      if (!token) return res.status(200).json({ success: true });

      // 清除 session token
      await sb
        .from(TABLE_NAME)
        .update({ session_token: null, session_expires: null })
        .eq("session_token", token);

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ success: false, error: "未知的操作类型" });
  } catch (err) {
    console.error("Auth API error:", err);
    res.status(500).json({ success: false, error: "服务器错误" });
  }
}
