import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Project } from "../data/projects";
import { deleteProject, updateProject, pushProjects } from "../utils/projectStore";
import { useProjects } from "../hooks/useProjects";
import AddProjectModal from "./AddProjectModal";

/**
 * PortfolioGallery 森林图鉴式项目展示区
 *
 * 数据来源：projectStore（localStorage，可 CRUD）
 * 响应式 Grid 布局（大屏 2 列，小屏 1 列），毛玻璃卡片。
 * 每张卡片像明信片：封面区（图片/视频）+ 标题 + 标签 + 描述。
 * Hover 微浮 + 阴影加深；点击弹出详情 Modal。
 * 视频卡片：封面显示缩略图 + 播放按钮，点击在卡片内播放。
 *
 * Admin 彩蛋：右下角极小叶片图标，hover 显形，点击弹出添加项目表单。
 * 卡片 hover 显示编辑/删除按钮。
 */

/* 播放按钮图标 */
const PlayIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="rgba(255,255,255,0.85)" stroke="rgba(255,255,255,0.9)" strokeWidth="1" />
    <path d="M13 10L22 16L13 22Z" fill="#5d8a6a" />
  </svg>
);

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

/* ===== 单个项目卡片 ===== */
const ProjectCard: React.FC<{
  item: Project;
  index: number;
  onClick: (item: Project) => void;
  onEdit: (item: Project) => void;
}> = ({ item, index, onClick, onEdit }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const hasVideo = !!item.videoUrl;
  const tags = item.tags || [];

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (videoPlaying) {
      video.pause();
      setVideoPlaying(false);
    } else {
      video.play().catch(() => {
        /* 自动播放被拦截，忽略 */
      });
      setVideoPlaying(true);
    }
  };

  return (
    <motion.article
      className="gallery-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.12 }}
      onClick={() => onClick(item)}
    >
      {/* ① 封面区 */}
      <div className="gallery-media">
        {/* 图片上方操作栏 */}
        <div className="gallery-media-actions">
          <button
            className="gallery-media-btn"
            onClick={(e) => { e.stopPropagation(); onEdit(item); }}
            title="编辑"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            编辑
          </button>
          <label className="gallery-media-btn" onClick={(e) => e.stopPropagation()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            换图
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={async (e) => {
                e.stopPropagation();
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async (ev) => {
                  const base64 = ev.target?.result as string;
                  if (base64) {
                    updateProject(item.id, { imageUrl: base64 });
                    await pushProjects("ling");
                    window.location.reload();
                  }
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
          <button
            className="gallery-media-btn gallery-media-btn-delete"
            onClick={async (e) => {
              e.stopPropagation();
              if (confirm("确定删除此项目？")) {
                deleteProject(item.id);
                await pushProjects("ling");
                window.location.reload();
              }
            }}
            title="删除"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            删除
          </button>
        </div>

        {hasVideo ? (
          <>
            <video
              ref={videoRef}
              className="gallery-cover-video"
              src={item.videoUrl}
              poster={item.imageUrl}
              preload="metadata"
              playsInline
              onClick={handleVideoClick}
              onEnded={() => setVideoPlaying(false)}
            />
            {!videoPlaying && (
              <button
                className="gallery-play-btn"
                onClick={handleVideoClick}
                aria-label="播放视频"
              >
                <PlayIcon />
              </button>
            )}
          </>
        ) : (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="gallery-cover-img"
            loading="lazy"
          />
        )}
      </div>

      {/* ② 标题 */}
      <h3 className="gallery-title">{item.title}</h3>

      {/* ③ 标签 */}
      <span className="gallery-tag">{item.tag}</span>

      {/* ④ 描述（前两行） */}
      <p className="gallery-desc">{item.description}</p>

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
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const projectsList = useProjects();
  const selectedTags = selected?.tags || [];

  return (
    <>
      <div className="gallery-grid">
        {projectsList.map((item, index) => (
          <ProjectCard
            key={item.id}
            item={item}
            index={index}
            onClick={setSelected}
            onEdit={(p) => { setEditProject(p); setEditOpen(true); }}
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

              {/* 封面大图 / 视频 */}
              {selected.videoUrl ? (
                <video
                  className="gallery-modal-cover"
                  src={selected.videoUrl}
                  poster={selected.imageUrl}
                  controls
                  playsInline
                />
              ) : (
                <img src={selected.imageUrl} alt={selected.title} className="gallery-modal-cover" />
              )}

              <div className="gallery-modal-body">
                <h2 className="gallery-modal-title">{selected.title}</h2>
                <span className="gallery-tag">{selected.tag}</span>
                <p className="gallery-modal-desc">{selected.description}</p>
                {selectedTags.length > 0 && (
                  <div className="gallery-tech-tags">
                    {selectedTags.map((t) => (
                      <span key={t} className="gallery-tech-tag">{t}</span>
                    ))}
                  </div>
                )}
                {selected.link && (
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gallery-modal-link"
                  >
                    访问项目 →
                  </a>
                )}
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

      <AddProjectModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        mode="add"
      />
      <AddProjectModal
        open={editOpen}
        onClose={() => { setEditOpen(false); setEditProject(null); }}
        mode="edit"
        initialData={editProject || undefined}
        onDelete={async () => {
          if (editProject) {
            deleteProject(editProject.id);
            await pushProjects("ling");
            window.location.reload();
          }
        }}
      />

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

        /* ===== 卡片 — 毛玻璃明信片 ===== */
        .gallery-card {
          cursor: pointer;
          border-radius: 16px;
          overflow: hidden;
          background: var(--card-bg);
          border: 1px solid var(--border);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 4px 20px -8px rgba(60, 80, 60, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .gallery-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px -12px rgba(60, 80, 60, 0.2);
        }

        /* 图片上方操作栏 */
        .gallery-media-actions {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          gap: 1px;
          opacity: 0;
          transition: opacity 0.2s;
          z-index: 5;
          background: linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 70%, transparent 100%);
          padding: 6px 8px 18px;
        }
        .gallery-media:hover .gallery-media-actions,
        .gallery-card:hover .gallery-media-actions {
          opacity: 1;
        }
        .gallery-media-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 10px;
          font-size: 11px;
          font-weight: 500;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
          background: rgba(255,255,255,0.88);
          color: #3a4a3a;
          backdrop-filter: blur(8px);
        }
        .gallery-media-btn:hover {
          background: #fff;
          transform: translateY(-1px);
        }
        .gallery-media-btn-delete {
          background: rgba(217, 119, 87, 0.9);
          color: #fff;
        }
        .gallery-media-btn-delete:hover {
          background: rgba(200, 100, 70, 1);
        }

        /* ===== 封面区 ===== */
        .gallery-media {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f0f0f0;
        }
        .gallery-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .gallery-card:hover .gallery-cover-img {
          transform: scale(1.04);
        }
        .gallery-cover-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          cursor: pointer;
        }
        .gallery-play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: transform 0.2s ease;
        }
        .gallery-play-btn:hover {
          transform: translate(-50%, -50%) scale(1.1);
        }

        /* ===== 标题 ===== */
        .gallery-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--text);
          margin: 20px 20px 8px;
          letter-spacing: 0.02em;
        }

        /* ===== 标签 ===== */
        .gallery-tag {
          display: inline-block;
          margin: 0 20px 12px;
          padding: 4px 12px;
          font-size: 12px;
          border-radius: 999px;
          background: rgba(122, 154, 130, 0.1);
          color: var(--accent);
          letter-spacing: 0.03em;
        }

        /* ===== 描述 ===== */
        .gallery-desc {
          margin: 0 20px 16px;
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-soft);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ===== 技术标签 ===== */
        .gallery-tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 0 20px 20px;
        }
        .gallery-tech-tag {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 6px;
          background: rgba(184, 140, 106, 0.08);
          color: var(--text-soft);
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
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .gallery-modal {
          position: relative;
          width: 100%;
          max-width: 640px;
          max-height: 85vh;
          overflow-y: auto;
          border-radius: 20px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          box-shadow: 0 24px 64px -16px rgba(0,0,0,0.25);
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
        .gallery-modal-cover {
          width: 100%;
          height: 280px;
          object-fit: cover;
          display: block;
          border-radius: 20px 20px 0 0;
        }
        .gallery-modal-body {
          padding: 28px;
        }
        .gallery-modal-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 24px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 10px;
        }
        .gallery-modal-desc {
          font-size: 15px;
          line-height: 1.8;
          color: var(--text-soft);
          margin: 16px 0 20px;
        }
        .gallery-modal-link {
          display: inline-block;
          margin-top: 8px;
          font-size: 14px;
          color: var(--accent);
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .gallery-modal-link:hover {
          color: var(--accent-hover);
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
          .gallery-modal-cover {
            height: 200px;
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
