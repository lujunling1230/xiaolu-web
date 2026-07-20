import { motion } from "framer-motion";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";

/**
 * 作品集 · 详情占位页
 *
 * 路由 /toolbox/:title —— react-router 会自动解码 :title 参数。
 * 后续在此填充各维度的真实内容，当前为“正在建造中”占位。
 */
const ToolboxDetail: React.FC = () => {
  // useParams 返回的已是解码后的标题，无需再 decodeURIComponent
  const { title } = useParams();
  const navigate = useNavigate();
  const name = title || "未知作品";
  // 透传来源标记：完整版入口进来时，回工具箱仍带 from=full
  const [searchParams] = useSearchParams();
  const fromQuery = searchParams.get("from") === "full" ? "?from=full" : "";

  return (
    <div className="toolbox-page">
      {/* 顶部返回条 */}
      <header className="toolbox-topbar">
        <button className="toolbox-back" onClick={() => navigate(-1)}>
          ← 回到作品集
        </button>
        <span className="toolbox-topbar-meta">造物详情</span>
      </header>

      {/* 标题区 */}
      <section className="detail-hero">
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
          {name}
        </motion.h1>
        <motion.div
          className="detail-status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="detail-status-dot" />
          正在建造中
        </motion.div>
      </section>

      {/* 占位内容卡 */}
      <motion.section
        className="detail-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        <p className="detail-placeholder-text">
          这里将是「{name}」的专属空间。维度的内容正在一笔一笔手写中，敬请期待。
        </p>
        <Link to={`/toolbox${fromQuery}`} className="detail-back-link">
          ← 回到工具箱
        </Link>
      </motion.section>
    </div>
  );
};

export default ToolboxDetail;
