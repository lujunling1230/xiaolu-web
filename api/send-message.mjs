/**
 * Send Message API
 * POST /api/send-message -> 通过 QQ 邮箱 SMTP 发送留言到站长邮箱
 *
 * 环境变量（在 Vercel 控制台配置）:
 *   SMTP_HOST       - SMTP 服务器地址 (qq: smtp.qq.com)
 *   SMTP_PORT       - 端口 (465 SSL / 587 STARTTLS)
 *   SMTP_USER       - 发件邮箱地址
 *   SMTP_PASS       - 邮箱授权码（非登录密码）
 *   CONTACT_TO_EMAIL - 收件邮箱（不填则默认同 SMTP_USER）
 */

import nodemailer from "nodemailer";

/* 简易内存频率限制（同一 IP 60 秒内最多 3 次） */
const rateMap = new Map();
const RATE_WINDOW = 60_000;
const RATE_MAX = 3;

function rateLimit(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.ts > RATE_WINDOW) {
    rateMap.set(ip, { ts: now, count: 1 });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_MAX;
}

export default async function handler(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();

    if (req.method !== "POST") {
      return res.status(405).json({ error: "仅支持 POST 请求" });
    }

    /* ---------- 环境变量检查 ---------- */
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const TO_EMAIL = process.env.CONTACT_TO_EMAIL || SMTP_USER;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.error("[send-message] 缺少 SMTP 环境变量");
      return res.status(500).json({
        error: "邮件服务未配置，请在 Vercel 控制台设置 SMTP_HOST / SMTP_USER / SMTP_PASS",
      });
    }

    /* ---------- 频率限制 ---------- */
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
    if (!rateLimit(ip)) {
      return res.status(429).json({ error: "发送过于频繁，请稍后再试" });
    }

    /* ---------- 参数校验 ---------- */
    const { message, contactInfo } = req.body || {};
    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: "留言内容不能为空" });
    }
    const msg = String(message).slice(0, 2000);
    const contact = contactInfo ? String(contactInfo).slice(0, 200) : "未填写";

    /* ---------- 创建邮件传输器 ---------- */
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    /* ---------- 组装邮件内容 ---------- */
    const now = new Date();
    const timeStr = now.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });

    const mailOptions = {
      from: `luro.site 留言板 <${SMTP_USER}>`,
      to: TO_EMAIL,
      subject: `【luro.site】新留言 · ${timeStr}`,
      html: `
        <div style="font-family: -apple-system, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #fffbf6; border-radius: 16px; border: 1px solid #f0e6d8;">
          <h2 style="color: #4a3a2e; margin: 0 0 20px; font-size: 20px; letter-spacing: 0.04em;">你有一条新留言</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #b8a090; font-size: 13px; width: 80px; vertical-align: top;">留言内容</td>
              <td style="padding: 8px 0; color: #4a3a2e; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${msg.replace(/</g, "&lt;")}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #b8a090; font-size: 13px; vertical-align: top;">联系方式</td>
              <td style="padding: 8px 0; color: #4a3a2e; font-size: 14px;">${contact.replace(/</g, "&lt;")}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #b8a090; font-size: 13px; vertical-align: top;">提交时间</td>
              <td style="padding: 8px 0; color: #4a3a2e; font-size: 14px;">${timeStr}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #b8a090; font-size: 13px; vertical-align: top;">来源 IP</td>
              <td style="padding: 8px 0; color: #4a3a2e; font-size: 14px;">${ip}</td>
            </tr>
          </table>
          <p style="margin: 24px 0 0; color: #ccc; font-size: 12px; text-align: center; letter-spacing: 0.04em;">— 来自 luro.site 留言板 —</p>
        </div>
      `,
      replyTo: contact.includes("@") ? contact : undefined,
    };

    /* ---------- 发送邮件 ---------- */
    const info = await transporter.sendMail(mailOptions);
    console.log("[send-message] 邮件发送成功:", info.messageId);

    return res.status(200).json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error("[send-message] 发送失败:", err);
    return res.status(500).json({
      error: "邮件发送失败，请稍后重试",
      detail: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
}
