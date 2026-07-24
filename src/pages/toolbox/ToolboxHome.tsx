import { motion } from "framer-motion";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { track } from "../../utils/track";

/**
 * 作品集 · 首页
 *
 * 森林疗愈室的延伸 —— 第一个数字造物场。
 * 以“纸张 / 工作台”质感呈现 9 个生活维度的作品，3×3 网格排布。
 * 点击卡片跳转到 /toolbox/:title 详情页（当前为占位）。
 */

/* ===== 9 个生活维度作品（严格按表） ===== */
const products = [
  { dimension: "身", title: "森林疗愈室", value: "生理调节" },
  { dimension: "心", title: "系统调频 + 回血清单", value: "情绪修复" },
  { dimension: "行", title: "通关清单", value: "执行力" },
  { dimension: "知", title: "作品集", value: "认知与求知欲" },
  { dimension: "游", title: "漫游指南", value: "探索与规划" },
  { dimension: "术", title: "万能百事通", value: "效率与工具" },
  { dimension: "管", title: "物资管家", value: "资源管理与反" },
];

/**
 * 9 维度柔和水墨底色 —— 低饱和、手账印章感
 * 仅用于维度圆形背景与字色，不改动上方 products 数据
 */
const tints = [
  { bg: "rgba(122,154,130,0.14)", fg: "#5d8a6a" }, // 身 · 鼠尾草
  { bg: "rgba(196,143,143,0.16)", fg: "#b06a6a" }, // 心 · 豆沙
  { bg: "rgba(196,163,107,0.16)", fg: "#a8814a" }, // 行 · 暖琥珀
  { bg: "rgba(120,138,168,0.16)", fg: "#5f76a0" }, // 知 · 雾蓝
  { bg: "rgba(106,158,150,0.16)", fg: "#4d8a82" }, // 游 · 青瓷
  { bg: "rgba(150,135,178,0.16)", fg: "#7e6aa3" }, // 术 · 藕荷
  { bg: "rgba(178,150,106,0.16)", fg: "#9a7d4a" }, // 管 · 赭石
  { bg: "rgba(196,138,118,0.16)", fg: "#b06f55" }, // 感 · 陶土
  { bg: "rgba(150,120,150,0.16)", fg: "#8a5f8a" }, // 魂 · 暮紫
];

const ToolboxHome: React.FC = () => {
  const navigate = useNavigate();
  // 读取来源标记：完整版入口带 from=full，回退时回到 /?mode=full 而非纯净版
  const [searchParams] = useSearchParams();
  const isFromFull = searchParams.get("from") === "full";
  // 回退目标 & 跳转详情时要透传的 query
  const homePath = isFromFull ? "/?mode=full" : "/";
  const fromQuery = isFromFull ? "?from=full" : "";

  const handleOpen = (title: string) => {
    track("tool_enter", { tool_name: title });

    // 各工具独立路由映射
    const routeMap: Record<string, string> = {
      "森林疗愈室": "/healing",
      "物资管家": "/toolbox/inventory",
      "万能百事通": "/toolbox/advice",
      "漫游指南": "/toolbox/travel",
      "通关清单": "/toolbox/quests",
      "系统调频 + 回血清单": "/toolbox/answer",
    };

    const route = routeMap[title];
    if (route) {
      navigate(`${route}${fromQuery}`);
      return;
    }

    // 其余：中文标题经编码后写入 URL，浏览器地址栏仍显示中文；react-router 会自动解码
    navigate(`/toolbox/${encodeURIComponent(title)}${fromQuery}`);
  };

  return (
    <div className="toolbox-page">
      {/* 顶部返回条 */}
      <header className="toolbox-topbar">
        <Link to={homePath} className="toolbox-back">
          ← 回到作品集
        </Link>
        <span className="toolbox-topbar-meta">数字造物场</span>
      </header>

      {/* 标题区 */}
      <section className="toolbox-hero">
        <motion.p
          className="toolbox-eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Miaomiao Toolbox
        </motion.p>
        <motion.h1
          className="toolbox-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          作品集
        </motion.h1>
        <motion.p
          className="toolbox-subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          我的第一个数字造物场 · 覆盖生活的 9 个维度
        </motion.p>
      </section>

      {/* 3×3 作品网格 */}
      <section className="toolbox-grid">
        {products.map((p, i) => {
          const tint = tints[i] ?? tints[0];
          return (
            <motion.button
              key={p.title}
              type="button"
              className="tool-card"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: (i % 3) * 0.08 + Math.floor(i / 3) * 0.05,
                ease: "easeOut",
              }}
              whileHover={{ y: -6 }}
              onClick={() => handleOpen(p.title)}
              aria-label={`打开 ${p.title}`}
            >
              <span className="tool-card-no">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="tool-card-dimension"
                style={{ background: tint.bg, color: tint.fg }}
              >
                {p.dimension}
              </span>
              <span className="tool-card-title">{p.title}</span>
              <span className="tool-card-value">{p.value}</span>
            </motion.button>
          );
        })}
      </section>

      {/* 页脚 */}
      <footer className="toolbox-foot">
        <span>九个维度，一座造物场</span>
        <span className="toolbox-foot-dot">·</span>
        <span>持续生长中</span>
      </footer>
    </div>
  );
};

export default ToolboxHome;
