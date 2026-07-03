/**
 * Projects API
 * GET  /api/projects    -> 从 GitHub 拉取最新 projects.json
 * POST /api/projects    -> 验证密码后更新 GitHub 上的 projects.json
 */

const { getGitHubFile, updateGitHubFile } = require("./lib/github");

const FILE_PATH = "data/projects.json";
const ADMIN_PASSWORD = "ling";

module.exports = async function handler(req, res) {
  // 允许跨域（方便本地调试）
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      const file = await getGitHubFile(FILE_PATH);
      if (file === null) {
        return res.status(404).json({
          error: "数据文件尚未初始化，请管理员先发布一次项目数据",
        });
      }
      return res.status(200).json(file.data);
    } catch (err) {
      console.error("[api/projects] GET error:", err);
      return res.status(500).json({ error: err.message || "服务器错误" });
    }
  }

  if (req.method === "POST") {
    const { password, projects } = req.body || {};

    if (password !== ADMIN_PASSWORD) {
      return res.status(403).json({ error: "密码错误，无权操作" });
    }

    if (!Array.isArray(projects)) {
      return res.status(400).json({ error: "projects 必须是数组" });
    }

    try {
      const file = await getGitHubFile(FILE_PATH);
      const sha = file ? file.sha : null;
      await updateGitHubFile(
        FILE_PATH,
        projects,
        sha,
        `update projects.json via admin panel (${new Date().toISOString()})`
      );
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("[api/projects] POST error:", err);
      return res.status(500).json({ error: err.message || "保存失败" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};
