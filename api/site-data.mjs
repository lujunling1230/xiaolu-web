/**
 * Site Data API
 * GET  /api/site-data   -> 从 GitHub 拉取最新 site-data.json
 * POST /api/site-data   -> 验证密码后更新 GitHub 上的 site-data.json
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || "main";
const FILE_PATH = "data/site-data.json";
const ADMIN_PASSWORD = "ling";

async function getGitHubFile(filePath) {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error("GitHub 环境变量未配置");
  }
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${BRANCH}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "xiaoluweb-admin",
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub GET ${filePath} 失败: ${res.status} ${text}`);
  }
  const json = await res.json();
  // 大文件（>1MB）GitHub 不返回 content，需通过 download_url 获取
  if (!json.content && json.download_url) {
    const rawRes = await fetch(json.download_url, {
      headers: { "User-Agent": "xiaoluweb-admin" },
    });
    if (!rawRes.ok) {
      throw new Error(`GitHub download ${filePath} 失败: ${rawRes.status}`);
    }
    const text = await rawRes.text();
    return { data: JSON.parse(text), sha: json.sha };
  }
  const decoded = Buffer.from(json.content, "base64").toString("utf-8");
  return { data: JSON.parse(decoded), sha: json.sha };
}

async function updateGitHubFile(filePath, content, sha, message) {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error("GitHub 环境变量未配置");
  }
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
  const body = {
    message,
    content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "xiaoluweb-admin",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub PUT ${filePath} 失败: ${res.status} ${text}`);
  }
}

export default async function handler(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();

    if (req.method === "GET") {
      const file = await getGitHubFile(FILE_PATH);
      if (file === null) {
        return res.status(404).json({ error: "数据文件尚未初始化，请管理员先发布一次站点数据" });
      }
      return res.status(200).json(file.data);
    }

    if (req.method === "POST") {
      const { password, data } = req.body || {};
      if (password !== ADMIN_PASSWORD) {
        return res.status(403).json({ error: "密码错误，无权操作" });
      }
      if (typeof data !== "object" || data === null) {
        return res.status(400).json({ error: "data 必须是对象" });
      }
      const file = await getGitHubFile(FILE_PATH);
      const sha = file ? file.sha : null;
      await updateGitHubFile(FILE_PATH, data, sha,
        `update site-data.json via admin (${new Date().toISOString()})`);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (err) {
    console.error("[api/site-data] error:", err);
    return res.status(500).json({ error: err.message || "服务器错误" });
  }
}
