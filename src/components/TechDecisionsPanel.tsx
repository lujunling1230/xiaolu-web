import { motion } from "framer-motion";

/* ============================================================
 * TechDecisionsPanel — 技术选型思考
 * 展示架构决策背后的技术原理与 trade-off 分析
 * 体现 "不只是会用工具，而是理解背后的技术原理和取舍"
 * ============================================================ */

interface TechDecisionsPanelProps {
  onClose: () => void;
}

interface TechDecision {
  id: string;
  category: string;
  decision: string;
  alternatives: string[];
  rationale: string;
  tradeoff: string;
  tags: string[];
}

const decisions: TechDecision[] = [
  {
    id: "ai-model",
    category: "AI 模型选型",
    decision: "选用 OpenAI API，而非自训练模型",
    alternatives: ["自训练大语言模型（如 LLaMA / ChatGLM 微调）", "使用国产模型 API（如通义千问 / 文心一言）"],
    rationale:
      "OpenAI API 的模型准确率在通用对话场景中处于行业领先水平，集成成本低，只需几行代码即可接入。对于早期产品而言，快速验证产品概念（MVP）比模型微调更重要——用户要的是一个能用的 AI 助手，而不是一个还在训练中的模型。",
    tradeoff:
      "代价是 API 调用成本随用户量增长而线性上升，且数据需经过第三方服务器。未来若用户量达到一定规模，可考虑迁移至自部署模型以降低成本，但当前阶段速度和稳定性优先。",
    tags: ["OpenAI", "LLM", "成本控制", "MVP"],
  },
  {
    id: "hermes-eval",
    category: "评测系统架构",
    decision: "选择 Hermes 多智能体协作架构搭建自动评测系统",
    alternatives: ["人工测试 + 用户反馈收集", "传统单元测试 + E2E 测试框架（如 Playwright）"],
    rationale:
      "Hermes 架构能让多个 AI 智能体（Research、Code、Review、Delegate）分工协作，实现端到端的自动化评测流程。每个智能体专注于自己的领域——研究智能体分析产品功能、代码智能体检查技术实现、审查智能体评估质量——最终协同生成多维度的评测报告。这比人工评测更高效、更客观，比传统测试框架覆盖面更广（不仅测功能，还测 AI 能力、情感体验）。",
    tradeoff:
      "Hermes 评测结果依赖于 AI 模型的判断能力，在情感体验等主观维度上可能不如真实用户反馈细腻。因此 Hermes 评测作为自动化质量保障的基础层，仍需配合用户反馈收集形成完整的质量闭环。",
    tags: ["Hermes", "Multi-Agent", "自动化评测", "质量保障"],
  },
  {
    id: "deployment",
    category: "部署方案",
    decision: "选用 Vercel Serverless + Supabase，而非自建服务器",
    alternatives: ["自建云服务器（如阿里云 ECS / AWS EC2）", "传统 VPS + Nginx 反向代理"],
    rationale:
      "Vercel 提供零配置的全球 CDN 部署，push 代码即自动构建上线，且免费额度对个人作品集网站完全够用。Supabase 作为开源 Firebase 替代方案，提供 PostgreSQL 数据库 + 实时订阅 + 身份认证，无需自己搭建后端服务。对于个人开发者而言，把精力集中在产品本身而非运维基础设施上，是更高效的选择。",
    tradeoff:
      "Serverless 冷启动可能导致首次 API 响应稍慢（约 200-500ms），且 Vercel 免费额度有带宽和函数执行时间限制。若未来流量增长超出免费额度，可考虑迁移至边缘计算方案或自建服务器。",
    tags: ["Vercel", "Supabase", "Serverless", "部署"],
  },
  {
    id: "frontend",
    category: "前端技术栈",
    decision: "选用 React + Vite + Tailwind CSS + framer-motion",
    alternatives: ["Next.js / Remix 等全栈框架", "Vue / Svelte 等其他前端框架"],
    rationale:
      "React 生态成熟、社区活跃，是 AI 产品领域最广泛使用的前端框架。Vite 提供极快的开发热更新和构建速度，Tailwind CSS 的原子化 CSS 让样式迭代效率极高，framer-motion 则提供了声明式的动画 API，完美契合本网站对沉浸式动画体验的高要求。选择 SPA 而非 SSR 框架，是因为作品集网站的 SEO 需求不高，而 SPA 的页面切换动画体验更好。",
    tradeoff:
      "SPA 的首屏加载时间比 SSR 长，且不利于搜索引擎收录。但对于以交互体验为核心的个人作品集，这些代价是可接受的。",
    tags: ["React", "Vite", "Tailwind", "framer-motion"],
  },
  {
    id: "storage",
    category: "数据存储",
    decision: "用户个人数据使用 localStorage 本地存储，不经过后端",
    alternatives: ["后端数据库存储（MySQL / PostgreSQL）", "云存储服务（如 Firebase Firestore）"],
    rationale:
      "个人作品集中的工具类应用（如通关清单、物资管家、回血清单）的数据本质上是用户私有的个人数据，不需要跨设备同步，也不涉及多用户协作。localStorage 零成本、零延迟、零网络依赖，完全离线可用，且天然实现了数据隔离——不同浏览器、不同设备的数据天然分离，无需额外开发权限系统。对于隐私敏感的用户，数据只存在于自己的浏览器中，反而更有安全感。",
    tradeoff:
      "用户换设备或清除浏览器数据后无法恢复。未来若用户对跨设备同步有需求，可引入可选的后端同步方案，但本地存储作为默认方案始终保留。",
    tags: ["localStorage", "隐私优先", "离线可用", "零成本"],
  },
  {
    id: "animation",
    category: "动画方案",
    decision: "使用 CSS Transform + opacity 实现动画，避免触发重排",
    alternatives: ["Canvas / WebGL 动画", "复杂物理引擎（如 Matter.js）"],
    rationale:
      "CSS Transform 和 opacity 是 GPU 加速属性，不会触发浏览器的重排（reflow）和重绘（repaint），能保证 60fps 的流畅体验。对于本网站的蝴蝶光标、风铃摇摆、卡片微动效等场景，纯 CSS 方案完全够用。使用 framer-motion 的声明式动画 API 进一步简化了动画编排，无需手动管理 requestAnimationFrame。",
    tradeoff:
      "CSS 动画的表达能力有限，无法实现复杂的物理模拟（如粒子系统、流体效果）。但本网站的设计风格偏向克制、含蓄的微动效，而非炫技式的视觉特效，CSS 方案的表达能力恰好匹配设计需求。",
    tags: ["CSS Transform", "GPU 加速", "性能优化", "framer-motion"],
  },
  {
    id: "pwa",
    category: "离线体验",
    decision: "使用 Service Worker + NetworkFirst 策略提供离线访问",
    alternatives: ["纯在线应用（无离线支持）", "CacheFirst 策略（优先缓存）"],
    rationale:
      "Service Worker 让网站可以在离线状态下访问已缓存的页面，提升用户体验。选择 NetworkFirst 策略而非 CacheFirst，是因为作品集网站内容会频繁更新，用户应该总是看到最新内容，只在网络不可用时才回退到缓存。HTML 文件不预缓存，避免 Service Worker 更新不及时导致用户看到旧版本。",
    tradeoff:
      "Service Worker 的更新机制复杂，用户可能需要刷新两次才能看到新版本。需要仔细管理缓存版本和更新策略，避免出现「更新了但用户看不到」的情况。",
    tags: ["PWA", "Service Worker", "离线", "缓存策略"],
  },
];

const TechDecisionsPanel: React.FC<TechDecisionsPanelProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10001,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{
          background: "#f5f0e6",
          width: "100%",
          maxWidth: 780,
          maxHeight: "88vh",
          overflow: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div
          style={{
            padding: "28px 32px 20px",
            borderBottom: "1px solid #d5cfc4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            background: "#f5f0e6",
            zIndex: 1,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: '"Noto Serif SC", Georgia, serif',
                fontSize: 20,
                color: "#4a4038",
                letterSpacing: "0.06em",
              }}
            >
              技术选型思考
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#a8a39b" }}>
              每个技术决策背后，都是一次对 trade-off 的深思熟虑
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#a8a39b", fontSize: 22, padding: 4, lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* 决策列表 */}
        <div style={{ padding: "24px 32px 40px" }}>
          {decisions.map((d, idx) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.4 }}
              style={{
                marginBottom: idx < decisions.length - 1 ? 28 : 0,
                padding: "24px 28px",
                background: "#fff",
                border: "1px solid #e8e6e1",
                borderLeft: "3px solid #8b7355",
              }}
            >
              {/* 分类标签 */}
              <div
                style={{
                  display: "inline-block",
                  fontSize: 11,
                  padding: "2px 10px",
                  background: "rgba(139,115,85,0.08)",
                  color: "#8b7355",
                  border: "1px solid rgba(139,115,85,0.2)",
                  marginBottom: 12,
                }}
              >
                {d.category}
              </div>

              {/* 决策 */}
              <h3
                style={{
                  margin: "0 0 14px",
                  fontSize: 16,
                  fontFamily: '"Noto Serif SC", Georgia, serif',
                  fontWeight: 700,
                  color: "#4a4038",
                  lineHeight: 1.5,
                }}
              >
                {d.decision}
              </h3>

              {/* 对比方案 */}
              <div style={{ marginBottom: 14 }}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#a8a39b",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  对比方案
                </span>
                <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {d.alternatives.map((alt, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 12,
                        padding: "3px 10px",
                        background: "rgba(168,163,155,0.1)",
                        color: "#7a7268",
                        border: "1px solid #d5cfc4",
                      }}
                    >
                      {alt}
                    </span>
                  ))}
                </div>
              </div>

              {/* 选择理由 */}
              <div style={{ marginBottom: 14 }}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b8f71",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  选择理由
                </span>
                <p style={{ margin: "6px 0 0", fontSize: 13, color: "#5c5348", lineHeight: 1.8 }}>
                  {d.rationale}
                </p>
              </div>

              {/* Trade-off */}
              <div style={{ marginBottom: 14 }}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#c4a060",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Trade-off
                </span>
                <p style={{ margin: "6px 0 0", fontSize: 13, color: "#5c5348", lineHeight: 1.8 }}>
                  {d.tradeoff}
                </p>
              </div>

              {/* 标签 */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {d.tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 11,
                      padding: "2px 8px",
                      background: "transparent",
                      color: "#8b7355",
                      border: "1px solid #c4b99a",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TechDecisionsPanel;