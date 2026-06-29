import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * BookReader 全屏翻书阅读组件
 *
 * 以"打开的书本"形式展示项目内容：
 * - 左右双页布局（左页：项目截图+标题，右页：详情+标签）
 * - 叶脉纹理封面风格（与 LeafCard 视觉统一）
 * - 翻页动画（3D rotateY 翻转）
 * - 关闭按钮返回 About 页面
 *
 * 视觉风格：树叶纹理 + 暖棕配色，昼夜模式自适应
 */

interface ProjectData {
  id: number;
  name: string;
  subtitle: string;
  tech: string;
  description: string;
  tags: { label: string; type: "tech" | "emotion" }[];
  image: string;
  link: string;
}

interface BookReaderProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectData[];
}

/** 叶脉纹理 SVG — 复用 LeafCard 视觉风格 */
const LeafVeinsBg = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 200 300"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.06 }}
  >
    <line x1="100" y1="15" x2="100" y2="285" stroke="var(--leaf-vein)" strokeWidth="1.2" />
    <path d="M100 45 Q72 50 42 68" stroke="var(--leaf-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 85 Q68 90 32 112" stroke="var(--leaf-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 130 Q62 135 28 162" stroke="var(--leaf-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 175 Q65 180 35 205" stroke="var(--leaf-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 45 Q128 50 158 68" stroke="var(--leaf-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 85 Q132 90 168 112" stroke="var(--leaf-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 130 Q138 135 172 162" stroke="var(--leaf-vein)" strokeWidth="0.7" fill="none" />
    <path d="M100 175 Q135 180 165 205" stroke="var(--leaf-vein)" strokeWidth="0.7" fill="none" />
  </svg>
);

const BookReader: React.FC<BookReaderProps> = ({ isOpen, onClose, projects }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const project = projects[currentPage];
  const totalPages = projects.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((p) => p + 1);
        setIsFlipping(false);
      }, 400);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((p) => p - 1);
        setIsFlipping(false);
      }, 400);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* 遮罩层 */}
          <div
            className="absolute inset-0 bg-[#3d3d3d]/50 backdrop-blur-md"
            onClick={onClose}
          />

          {/* 书本主体 */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl border border-[var(--leaf-border)]"
            style={{ backgroundColor: "var(--card-bg)" }}
            initial={{ scale: 0.85, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 40 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            {/* 叶脉纹理背景 */}
            <LeafVeinsBg />

            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-[var(--card-bg)] transition-all duration-200"
              aria-label="关闭阅读"
              data-clickable
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="var(--text)" style={{ opacity: 0.6 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 左页：项目截图 */}
            <motion.div
              className="relative w-full md:w-1/2 h-48 md:h-auto overflow-hidden border-b md:border-b-0 md:border-r border-[var(--border)]"
              key={`left-${currentPage}`}
              initial={{ opacity: 0, rotateY: isFlipping ? -15 : 0 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              {/* 技术栈角标 */}
              <div className="absolute top-4 left-4 px-3 py-1 text-xs rounded-full backdrop-blur-sm border" style={{ backgroundColor: "rgba(250,246,240,0.85)", color: "var(--accent)", borderColor: "rgba(184,140,106,0.2)" }}>
                {project.tech}
              </div>
            </motion.div>

            {/* 右页：项目详情 */}
            <motion.div
              className="relative w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col"
              key={`right-${currentPage}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h3 className="text-xl md:text-2xl font-extrabold mb-1" style={{ fontFamily: '"Noto Serif SC", serif', color: "var(--text)" }}>
                {project.name}
              </h3>
              <p className="text-xs mb-5 tracking-wide" style={{ color: "var(--body-text)", opacity: 0.6 }}>
                {project.subtitle}
              </p>

              <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--body-text)", lineHeight: 1.8 }}>
                {project.description}
              </p>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className={`specimen-tag ${tag.type}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>

              {/* 翻页控制 */}
              <div className="mt-auto flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-all duration-300 disabled:opacity-30"
                  style={{ color: "var(--accent)" }}
                  data-clickable
                >
                  <span>←</span> 上一页
                </button>

                {/* 页码指示 */}
                <span className="text-xs" style={{ color: "var(--body-text)", opacity: 0.5 }}>
                  {currentPage + 1} / {totalPages}
                </span>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-all duration-300 disabled:opacity-30"
                  style={{ color: "var(--accent)" }}
                  data-clickable
                >
                  下一页 <span>→</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookReader;
