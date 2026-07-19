/**
 * Vite Plugin: Vercel API Dev
 *
 * 在本地 `vite dev` 时，把 /api/*.mjs 作为中间件加载，
 * 让前端 fetch('/api/xxx') 能直接命中 Vercel Serverless Function。
 *
 * 同时读取 .env / .env.local，把非 VITE_ 前缀的变量注入 process.env，
 * 让 api/*.mjs 中的 process.env.DASHSCOPE_API_KEY 等可用。
 *
 * 仅用于本地开发；线上仍走 Vercel 原生 Serverless Functions。
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** 读取 .env / .env.local，注入 process.env（不覆盖已存在的） */
function loadEnvToProcess(envFiles) {
  for (const file of envFiles) {
    const full = path.resolve(__dirname, file);
    if (!fs.existsSync(full)) continue;
    const text = fs.readFileSync(full, "utf-8");
    for (const raw of text.split("\n")) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq < 0) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      // 去掉两端引号
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  }
}

/** 解析 request body（JSON） */
function readBody(req) {
  return new Promise((resolve) => {
    if (req.body) return resolve(req.body);
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf-8");
      if (!raw) return resolve(undefined);
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve(raw);
      }
    });
    req.on("error", () => resolve(undefined));
  });
}

/** 模拟 Vercel 的 res 对象（补充 status/json/send 等 Express 风格方法） */
function decorateRes(res) {
  if (res.__vercelPatched) return res;
  res.__vercelPatched = true;

  // res.status(code) - 设置 statusCode，返回 this 以支持链式调用
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };

  // res.json(body) - 发送 JSON 响应
  res.json = function (obj) {
    if (res.writableEnded) return res;
    res.statusCode = res.statusCode || 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(obj));
    return res;
  };

  // res.send(body) - 发送响应（自动判断类型）
  res.send = function (body) {
    if (res.writableEnded) return res;
    res.statusCode = res.statusCode || 200;
    if (body === undefined || body === null) {
      res.end();
    } else if (typeof body === "string") {
      if (!res.getHeader("Content-Type")) res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(body);
    } else if (Buffer.isBuffer(body)) {
      res.end(body);
    } else {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(body));
    }
    return res;
  };

  // res.redirect(code, url) - 重定向
  res.redirect = function (code, url) {
    if (typeof code === "string") {
      url = code;
      code = 302;
    }
    res.statusCode = code || 302;
    res.setHeader("Location", url);
    res.end();
    return res;
  };

  return res;
}

/** 模拟 Vercel 的 req 对象（补充 body） */
async function decorateReq(req) {
  if (req.body === undefined) {
    req.body = await readBody(req);
  }
  // 模拟 Vercel req.query
  const url = new URL(req.url, "http://localhost");
  req.query = Object.fromEntries(url.searchParams.entries());
}

export default function vercelApiDevPlugin() {
  // 启动时加载环境变量
  loadEnvToProcess([".env.local", ".env"]);

  // 缓存已加载的 handler（按文件路径 + mtime）
  const handlerCache = new Map();

  async function resolveHandler(apiPath) {
    // apiPath 形如 "/api/ai" -> 文件 "api/ai.mjs"
    const name = apiPath.replace(/^\/api\//, "");
    const candidates = [
      path.resolve(__dirname, "api", `${name}.mjs`),
      path.resolve(__dirname, "api", `${name}.js`),
      path.resolve(__dirname, "api", name, "index.mjs"),
      path.resolve(__dirname, "api", name, "index.js"),
    ];
    for (const file of candidates) {
      if (fs.existsSync(file)) {
        const mtime = fs.statSync(file).mtimeMs;
        const cacheKey = `${file}|${mtime}`;
        if (!handlerCache.has(cacheKey)) {
          // Windows ESM 要求 file:// URL，加 mtime 避免缓存
          const fileUrl = `${pathToFileURL(file).href}?t=${mtime}`;
          const mod = await import(fileUrl);
          handlerCache.set(cacheKey, mod.default || mod.handler || mod);
          // 清理旧缓存
          for (const key of handlerCache.keys()) {
            if (key !== cacheKey && key.startsWith(`${file}|`)) {
              handlerCache.delete(key);
            }
          }
        }
        return handlerCache.get(cacheKey);
      }
    }
    return null;
  }

  return {
    name: "vercel-api-dev",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/")) return next();

        // 静态资源（如 /api/foo.js）跳过
        if (/\.\w+$/.test(req.url.split("?")[0])) return next();

        try {
          const handler = await resolveHandler(req.url.split("?")[0]);
          if (!handler) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: `API route not found: ${req.url}` }));
            return;
          }

          await decorateReq(req);
          decorateRes(res);

          // 调用 Vercel 风格 handler(req, res)
          await handler(req, res);

          // 如果 handler 没有结束响应，交给后续
          if (!res.writableEnded) {
            next();
          }
        } catch (err) {
          console.error("[vercel-api-dev] handler error:", err);
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "服务器内部错误", detail: String(err?.message || err) }));
          }
        }
      });

      // 打印一次加载状态
      setTimeout(() => {
        const hasKey = !!process.env.DASHSCOPE_API_KEY;
        console.log(
          `\n[vercel-api-dev] /api/* 已启用. DASHSCOPE_API_KEY: ${hasKey ? "已加载 ✓" : "缺失 ✗ (请检查 .env.local)"}\n`
        );
      }, 200);
    },
  };
}
