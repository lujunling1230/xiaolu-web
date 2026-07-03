# 跨设备数据同步部署指南

## 方案概述

为了解决管理员端上传的数据仅在当前浏览器可见的问题，项目新增了 **Vercel Serverless Functions + GitHub API** 方案：

- 所有项目数据（`projects.json`）和站点数据（`site-data.json`）持久化存储在 GitHub 仓库的 `data/` 目录下
- 管理员操作后通过 Serverless Function 调用 GitHub Contents API 写入数据
- 访客访问首页时，通过 `fetch` 从服务端拉取最新数据，确保任意设备看到的内容一致

---

## 环境变量配置

在 Vercel 控制台（Project Settings -> Environment Variables）添加以下变量：

| 变量名 | 说明 | 示例 |
|---|---|---|
| `GITHUB_TOKEN` | GitHub Personal Access Token，需具备 `repo` 权限 | `ghp_xxxxxxxxxxxx` |
| `GITHUB_REPO` | 仓库名，格式 `owner/repo` | `xiaolu-web/portfolio` |
| `GITHUB_BRANCH` | （可选）目标分支，默认 `main` | `main` |

### 如何创建 GitHub Token

1. 打开 GitHub -> Settings -> Developer settings -> Personal access tokens -> Tokens (classic)
2. 点击 **Generate new token (classic)**
3. 勾选 `repo` 权限（完整读写仓库内容）
4. 生成后复制 token，填入 Vercel 环境变量

---

## 初始化数据文件

首次部署前，需要在仓库中手动创建两个空数据文件（否则 API 会返回 404）：

```bash
# 在项目根目录执行
mkdir -p data

# 创建 projects.json（项目数据）
echo '[]' > data/projects.json

# 创建 site-data.json（站点模块数据）
echo '{}' > data/site-data.json

git add data/
git commit -m "init data files for remote sync"
git push
```

> 如果已有本地数据，可以先用浏览器控制台导出：
> ```js
> copy(JSON.parse(localStorage.getItem('portfolio_projects_v1')))
> ```
> 将内容粘贴到 `data/projects.json` 中。

---

## 部署步骤

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "feat: add remote sync via GitHub API"
   git push
   ```

2. **Vercel 自动部署**
   - 若已关联 GitHub，Vercel 会自动触发部署
   - 部署完成后，访问 `https://你的域名/api/projects` 应返回 `[]`

3. **验证管理员发布**
   - 打开网站首页，进入管理员端（输入 "have a nice day ～ling"）
   - 编辑或添加项目后保存
   - 观察提示是否出现 "发布成功，访客将看到最新内容"
   - 用手机或无痕窗口访问首页，确认数据已同步

---

## 数据流说明

### 访客访问首页
```
浏览器 -> GET /api/projects -> Serverless Function -> GitHub API -> data/projects.json
         -> 返回 JSON -> 更新 localStorage 缓存 -> LeafBook/PortfolioGallery 渲染
```

### 管理员发布项目
```
AdminPanel/AddProjectModal -> POST /api/projects (含密码)
         -> Serverless Function 验证密码
         -> GitHub API PUT data/projects.json
         -> 返回 success
         -> 提示"发布成功，访客将看到最新内容"
```

---

## 故障排查

| 现象 | 原因 | 解决 |
|---|---|---|
| API 返回 404 | `data/projects.json` 尚未创建 | 按上方步骤初始化数据文件 |
| API 返回 403 | GitHub Token 权限不足或密码错误 | 检查 Token 是否有 `repo` 权限，确认密码为 `ling` |
| API 返回 500 | 环境变量未配置 | 在 Vercel 控制台设置 `GITHUB_TOKEN` 和 `GITHUB_REPO` |
| 访客看不到更新 | 浏览器缓存了旧 localStorage | 首页已自动在启动时 fetch 远程数据，硬刷新即可 |

---

## 安全说明

- GitHub Token **仅存储在 Vercel 服务端环境变量中**，不会暴露给前端
- 管理员密码 `ling` 在 API 层验证，不依赖前端隐藏
- 建议定期轮换 GitHub Token，并启用 Vercel 的部署保护
