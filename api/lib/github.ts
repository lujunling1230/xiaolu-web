/**
 * GitHub API 工具函数
 * 通过 GitHub Contents API 读写仓库文件，实现无数据库持久化。
 *
 * 环境变量要求：
 * - GITHUB_TOKEN: 具有 repo 权限的 GitHub Personal Access Token
 * - GITHUB_REPO: 仓库名，格式 "owner/repo"
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || "main";

if (!GITHUB_TOKEN || !GITHUB_REPO) {
  console.warn(
    "[github] 环境变量 GITHUB_TOKEN 或 GITHUB_REPO 未设置，API 将无法正常工作"
  );
}

interface GitHubFileResponse {
  content: string;
  sha: string;
}

/** 从 GitHub 获取文件内容 */
export async function getGitHubFile(
  path: string
): Promise<{ data: unknown; sha: string } | null> {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error("GitHub 环境变量未配置");
  }

  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}?ref=${BRANCH}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "xiaoluweb-admin",
    },
  });

  if (res.status === 404) {
    return null; // 文件不存在
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub GET ${path} 失败: ${res.status} ${text}`);
  }

  const json = (await res.json()) as GitHubFileResponse;
  const decoded = Buffer.from(json.content, "base64").toString("utf-8");
  return { data: JSON.parse(decoded), sha: json.sha };
}

/** 更新 GitHub 文件内容 */
export async function updateGitHubFile(
  path: string,
  content: unknown,
  sha: string | null,
  message: string
): Promise<void> {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error("GitHub 环境变量未配置");
  }

  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;
  const body: Record<string, string> = {
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
    throw new Error(`GitHub PUT ${path} 失败: ${res.status} ${text}`);
  }
}
