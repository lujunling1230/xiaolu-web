import { motion, AnimatePresence } from "framer-motion";

/**
 * ProjectModal 极简项目弹窗
 *
 * 白色卡片，文字列表，圆角矩形，柔和阴影。
 * 点击遮罩或关闭按钮关闭。
 */

export interface Project {
  id: string;
  title: string;
  desc: string;
  tags: string[];
}

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
}

const projects: Project[] = [
  {
    id: "bracelet",
    title: "智能手环商城",
    desc: "面向 C 端用户的智能手环电商平台，包含商品展示、购物车、订单管理、支付等完整购物流程。注重移动端体验与转化率优化。",
    tags: ["React", "TypeScript", "Tailwind CSS", "电商"],
  },
  {
    id: "mindful",
    title: "心灵角落",
    desc: "一款融合正念冥想与情绪记录的疗愈 App。提供呼吸引导、感恩日记、冥想空间三大模块，帮助用户建立日常心理健康习惯。",
    tags: ["React Native", "Web Audio API", "动画", "疗愈"],
  },
];

const ProjectModal: React.FC<ProjectModalProps> = ({ open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ background: "rgba(0, 0, 0, 0.3)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl p-8 md:p-10"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              background: "var(--card-bg)",
              boxShadow: "0 20px 60px -15px rgba(0,0,0,0.2)",
              border: "1px solid var(--border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              style={{ color: "var(--text-soft)" }}
              aria-label="关闭"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="13" y1="3" x2="3" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* 标题 */}
            <h2 className="text-2xl mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
              作品说明书
            </h2>
            <p className="text-sm mb-8" style={{ color: "var(--text-soft)" }}>
              以下是部分实践项目，点击了解更多。
            </p>

            {/* 项目列表 */}
            <div className="flex flex-col gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-6 rounded-xl"
                  style={{
                    border: "1px solid var(--border)",
                    background: "var(--bg-overlay)",
                  }}
                >
                  <h3 className="text-lg mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    {project.title}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: "var(--text-soft)", lineHeight: 1.7 }}>
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full"
                        style={{
                          background: "rgba(122, 154, 130, 0.12)",
                          color: "var(--accent)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
