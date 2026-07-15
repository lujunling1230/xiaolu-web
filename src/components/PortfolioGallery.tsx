import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, type Project } from "../data/projects";
import AddProjectModal from "./AddProjectModal";

/**
 * PortfolioGallery 产品文档卡片展示区
 *
 * 数据来源：src/data/projects.ts
 * 响应式 Grid 布局（大屏 2 列，小屏 1 列）。
 * 每张卡片展示产品文档摘要，点击展开完整产品文档。
 * 纯文本驱动，无图片。
 *
 * Admin 彩蛋：右下角极小叶片图标，hover 显形，点击弹出添加项目表单。
 */

/* 关闭按钮图标 */
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="13" y1="3" x2="3" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* Admin 入口叶片图标 */
const LeafIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 2C5 2 2 6 2 11c0 4 3 7 8 7 0-5 2-9 8-11-3-3-6-5-8-5z"
      fill="currentColor"
      opacity="0.85"
    />
    <path d="M6 16C8 12 11 9 15 7" stroke="#fff" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
  </svg>
);

/* 模块图标 */
const ModuleIcon = ({ type }: { type: string }) => {
  const icons: Record<string, React.ReactNode> = {
    painPoints: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    ),
    targetUsers: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
    solutions: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    ),
    coreValue: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    ),
    useCases: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
    ),
    highlights: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.5 4.5H18l-3.7 2.7 1.4 4.3L12 12l-3.7 2.5 1.4-4.3L6 7.5h4.5z"/><path d="M5 19l1 3 3-1-2-2z"/></svg>
    ),
    futurePlans: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    ),
  };
  return <span style={{ display: "inline-flex", color: "var(--accent)" }}>{icons[type] || null}</span>;
};

const MODULE_META: { key: keyof Project; label: string; isInline?: boolean }[] = [
  { key: "painPoints", label: "用户痛点" },
  { key: "targetUsers", label: "适合人群", isInline: true },
  { key: "solutions", label: "解决方案" },
  { key: "coreValue", label: "核心价值" },
  { key: "useCases", label: "使用场景", isInline: true },
  { key: "highlights", label: "产品亮点" },
];

/* ===== 单个项目卡片 ===== */
const ProjectCard: React.FC<{
  item: Project;
  index: number;
  onClick: (item: Project) => void;
}> = ({ item, index, onClick }) => {
  const tags = item.tags || [];

  return (
    <motion.article
      className="gallery-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.12 }}
      onClick={() => onClick(item)}
    >
      {/* 卡片头部 */}
      <div className="gallery-card-header">
        <span className="gallery-card-num">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="gallery-title">{item.title}</h3>
        <span className="gallery-tag">{item.tag}</span>
      </div>

      {/* 核心痛点摘要 */}
      <p className="gallery-desc">{item.painPoints[0]}</p>

      {/* 技术标签 */}
      {tags.length > 0 && (
        <div className="gallery-tech-tags">
          {tags.map((t) => (
            <span key={t} className="gallery-tech-tag">{t}</span>
          ))}
        </div>
      )}
    </motion.article>
  );
};

/* ===== 主组件 ===== */
const PortfolioGallery: React.FC = () => {
  const [selected, setSelected] = useState<Project | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <div className="gallery-grid">
        {projects.map((item, index) => (
          <ProjectCard
            key={item.id}
            item={item}
            index={index}
            onClick={setSelected}
          />
        ))}
      </div>

      {/* 详情 Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="gallery-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="gallery-modal"
              initial={{ scale: 0.94, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="gallery-modal-close"
                onClick={() => setSelected(null)}
                aria-label="关闭"
              >
                <CloseIcon />
              </button>

              <div className="gallery-modal-body">
                <h2 className="gallery-modal-title">{selected.title}</h2>
                <span className="gallery-tag">{selected.tag}</span>

                {/* 产品文档模块 */}
                <div className="gallery-modal-modules">
                  {MODULE_META.map(({ key, label, isInline }) => {
                    const items = selected[key] as string[];
                    if (!items || items.length === 0) return null;
                    return (
                      <div key={key} className="gallery-modal-module">
                        <div className="gallery-module-header">
                          <ModuleIcon type={key as string} />
                          <span>{label}</span>
                        </div>
                        {isInline ? (
                          <div className="gallery-module-inline">
                            {items.map((item, i) => (
                              <span key={i} className="gallery-module-pill">{item}</span>
                            ))}
                          </div>
                        ) : (
                          <ul className="gallery-module-list">
                            {items.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}

                  {/* 未来规划 */}
                  {selected.futurePlans && selected.futurePlans.length > 0 && (
                    <div className="gallery-modal-module gallery-modal-module-future">
                      <div className="gallery-module-header">
                        <ModuleIcon type="futurePlans" />
                        <span>未来规划</span>
                      </div>
                      <ul className="gallery-module-list">
                        {selected.futurePlans.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* 技术标签 */}
                {selected.tags && selected.tags.length > 0 && (
                  <div className="gallery-tech-tags">
                    {selected.tags.map((t) => (
                      <span key={t} className="gallery-tech-tag">{t}</span>
                    ))}
                  </div>
                )}

                <a
                  href={selected.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gallery-modal-link"
                >
                  打开作品 →
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin 彩蛋入口 */}
      <button
        className="gallery-admin-fab"
        onClick={() => setAddOpen(true)}
        aria-label="添加新项目"
        title="添加新项目"
      >
        <LeafIcon />
      </button>

      <AddProjectModal open={addOpen} onClose={() => setAddOpen(false)} />

      <style>{`
        /* ===== Gallery Grid 布局 ===== */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 40px;
          margin-top: 32px;
        }
        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        /* ===== 卡片 ===== */
        .gallery-card {
          cursor: pointer;
          border-radius: 16px;
          overflow: hidden;
          background: var(--card-bg);
          border: 1px solid var(--border);
          box-shadow: 0 4px 20px -8px rgba(60, 80, 60, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          padding: 20px 22px 18px;
        }
        .gallery-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px -12px rgba(60, 80, 60, 0.2);
        }

        /* 卡片头部 */
        .gallery-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        .gallery-card-num {
          font-size: 11px;
          font-family: "Noto Serif SC", serif;
          color: var(--accent);
          opacity: 0.6;
          letter-spacing: 0.06em;
        }
        .gallery-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
          margin: 0;
          letter-spacing: 0.02em;
        }
        .gallery-tag {
          font-size: 11px;
          padding: 2px 10px;
          border-radius: 999px;
          background: rgba(122, 154, 130, 0.1);
          color: var(--accent);
          letter-spacing: 0.03em;
          white-space: nowrap;
        }

        /* 描述 */
        .gallery-desc {
          margin: 0 0 12px;
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-soft);
          opacity: 0.85;
        }

        /* 技术标签 */
        .gallery-tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        .gallery-tech-tag {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 4px;
          background: rgba(184, 140, 106, 0.08);
          color: var(--text-soft);
          opacity: 0.8;
        }

        /* ===== Modal ===== */
        .gallery-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(0, 0, 0, 0.35);
        }
        .gallery-modal {
          position: relative;
          width: 100%;
          max-width: 600px;
          max-height: 85vh;
          overflow-y: auto;
          border-radius: 20px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          box-shadow: 0 16px 48px -12px rgba(0,0,0,0.12);
        }
        .gallery-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.9);
          color: var(--text-soft);
          cursor: pointer;
          z-index: 2;
          transition: background 0.2s ease;
        }
        .gallery-modal-close:hover {
          background: #fff;
        }
        .gallery-modal-body {
          padding: 28px;
        }
        .gallery-modal-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 8px;
        }

        /* 模块网格 */
        .gallery-modal-modules {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 10px;
          margin: 16px 0;
        }
        .gallery-modal-module {
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(0,0,0,0.02);
          border: 1px solid var(--border);
        }
        .gallery-modal-module-future {
          background: rgba(184,140,106,0.03);
          border-style: dashed;
        }
        .gallery-module-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 600;
          color: var(--accent);
          letter-spacing: 0.03em;
          font-family: "Noto Sans SC", sans-serif;
        }
        .gallery-module-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .gallery-module-list li {
          font-size: 12px;
          line-height: 1.6;
          color: var(--text-soft);
          padding-left: 12px;
          position: relative;
        }
        .gallery-module-list li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 7px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(122,154,130,0.4);
        }
        .gallery-module-inline {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        .gallery-module-pill {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 999px;
          background: rgba(122,154,130,0.08);
          color: var(--text-soft);
          white-space: nowrap;
        }

        .gallery-modal-link {
          display: inline-block;
          margin-top: 12px;
          font-size: 14px;
          color: var(--accent);
          font-weight: 500;
          text-decoration: none;
          padding: 7px 16px;
          border: 1px solid rgba(122,154,130,0.3);
          border-radius: 999px;
          transition: background 0.2s ease;
        }
        .gallery-modal-link:hover {
          background: rgba(122,154,130,0.08);
        }

        /* ===== Admin 彩蛋入口 ===== */
        .gallery-admin-fab {
          position: fixed;
          right: 24px;
          bottom: 24px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--card-bg);
          color: var(--accent);
          cursor: pointer;
          opacity: 0.4;
          z-index: 50;
          box-shadow: 0 2px 12px -4px rgba(0,0,0,0.15);
          transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
        .gallery-admin-fab:hover {
          opacity: 1;
          transform: translateY(-2px) scale(1.06);
          box-shadow: 0 6px 20px -6px rgba(122, 154, 130, 0.4);
        }

        @media (max-width: 768px) {
          .gallery-modal {
            max-width: 100%;
          }
          .gallery-modal-modules {
            grid-template-columns: 1fr;
          }
          .gallery-admin-fab {
            right: 16px;
            bottom: 16px;
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </>
  );
};

export default PortfolioGallery;
