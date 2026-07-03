/**
 * GitHub API 工具函数
 * 通过 GitHub Contents API 读写仓库文件，实现无数据库持久化。
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || "main";

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

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub GET ${filePath} 失败: ${res.status} ${text}`);
  }

  const json = await res.json();
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
  if (sha) {
    body.sha = sha;
  }

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

module.exports = { getGitHubFile, updateGitHubFile };
