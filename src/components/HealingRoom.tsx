import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * HealingRoom 疗愈室沉浸式交互模块
 *
 * 三个疗愈项目卡片（感恩日记/呼吸引导/冥想空间），
 * 点击展开详情面板，带呼吸感淡入动画。
 * 卡片左侧圆形标识用低饱和度颜色区分。
 */

interface HealingProject {
  id: string;
  initial: string;
  title: string;
  desc: string;
  color: string;
  detail: {
    image: string;
    text: string;
    cta: string;
  };
}

const healingProjects: HealingProject[] = [
  {
    id: "gratitude",
    initial: "G",
    title: "感恩日记",
    desc: "连续记录 42 天，培养发现美好的习惯",
    color: "#FADADD",
    detail: {
      image: "/healing-gratitude.jpg",
      text: "每天睡前写下三件值得感恩的小事——一杯温热的咖啡、同事的微笑、窗外偶然飘过的云。这个习惯让我学会在平凡日常里捕捉光亮，42 天的坚持不是任务，而是一场与自己温柔的对话。研究表明，感恩日记能显著提升主观幸福感，降低焦虑水平。",
      cta: "开始今日记录",
    },
  },
  {
    id: "breathing",
    initial: "B",
    title: "呼吸引导",
    desc: "总时长 18 小时，用呼吸锚定当下",
    color: "#E6E6FA",
    detail: {
      image: "/healing-breathing.jpg",
      text: "4-7-8 呼吸法：吸气 4 秒，屏息 7 秒，呼气 8 秒。这套简单的呼吸节奏像一只温柔的手，把涣散的注意力轻轻拉回身体。18 个小时的练习，让我在每一次会议前、每一个深夜焦虑时，都能找到一个随时可用的锚点。呼吸是免费的，但它改变了一切。",
      cta: "开始一次呼吸",
    },
  },
  {
    id: "meditation",
    initial: "M",
    title: "冥想空间",
    desc: "已更新 12 期，在声音中找到安宁",
    color: "#D8F3DC",
    detail: {
      image: "/healing-meditation.jpg",
      text: "雨声、风铃、远山鸟鸣——每一期冥想音频都是一次微型旅行。12 期的积累，从最初 3 分钟的坐立不安，到如今 20 分钟的安然沉浸。冥想不是清空念头，而是学会旁观它们，像看溪流中飘过的落叶。声音是入口，安静是归途。",
      cta: "进入冥想空间",
    },
  },
];

/* 单个疗愈卡片 */
const HealingCard: React.FC<{
  project: HealingProject;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ project, index, isOpen, onToggle }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.15 }}
  >
    <div
      className={`healing-card ${isOpen ? "healing-card-open" : ""}`}
      onClick={onToggle}
    >
      {/* 左侧圆形标识 */}
      <div className="healing-circle" style={{ background: project.color }}>
        <span className="healing-initial">{project.initial}</span>
      </div>

      {/* 右侧文字 */}
      <div className="healing-text">
        <h3 className="healing-title">{project.title}</h3>
        <p className="healing-desc">{project.desc}</p>
      </div>

      {/* 展开指示箭头 */}
      <svg
        className={`healing-arrow ${isOpen ? "healing-arrow-up" : ""}`}
        width="14" height="14" viewBox="0 0 14 14" fill="none"
      >
        <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>

    {/* 详情面板 — 高度平滑展开 */}
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          className="healing-detail"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          <div className="healing-detail-inner">
            <img
              src={project.detail.image}
              alt={project.title}
              className="healing-detail-img"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="healing-detail-content">
              <p className="healing-detail-text">{project.detail.text}</p>
              <button className="healing-cta-btn">{project.detail.cta}</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

/* 主组件 */
const HealingRoom: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-5">
      {healingProjects.map((project, index) => (
        <HealingCard
          key={project.id}
          project={project}
          index={index}
          isOpen={openId === project.id}
          onToggle={() => handleToggle(project.id)}
        />
      ))}

      <style>{`
        /* ===== 疗愈卡片 ===== */
        .healing-card {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          padding: 20px;
          border-radius: 16px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          cursor: pointer;
          transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          box-shadow: 0 2px 12px -6px rgba(60, 80, 60, 0.08);
        }
        .healing-card:hover {
          background: rgba(255, 255, 255, 0.7);
          box-shadow: 0 8px 28px -8px rgba(60, 80, 60, 0.15);
          border-color: rgba(122, 154, 130, 0.3);
        }
        [data-theme="night"] .healing-card:hover {
          background: rgba(30, 41, 59, 0.8);
        }
        .healing-card-open {
          border-color: rgba(122, 154, 130, 0.4);
          box-shadow: 0 8px 28px -8px rgba(122, 154, 130, 0.2);
        }

        /* ===== 左侧圆形标识 ===== */
        .healing-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }
        .healing-card:hover .healing-circle {
          transform: scale(1.1);
        }
        .healing-initial {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 16px;
          font-weight: 300;
          color: rgba(60, 60, 60, 0.8);
        }

        /* ===== 右侧文字 ===== */
        .healing-text {
          flex: 1;
        }
        .healing-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 17px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 4px;
        }
        .healing-desc {
          font-size: 13px;
          color: var(--text-soft);
          line-height: 1.6;
        }

        /* ===== 箭头 ===== */
        .healing-arrow {
          color: var(--text-soft);
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }
        .healing-arrow-up {
          transform: rotate(180deg);
        }

        /* ===== 详情面板 ===== */
        .healing-detail {
          margin-top: 8px;
        }
        .healing-detail-inner {
          display: flex;
          gap: 20px;
          padding: 20px;
          border-radius: 16px;
          background: rgba(122, 154, 130, 0.04);
          border: 1px solid var(--border);
        }
        .healing-detail-img {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 12px;
          flex-shrink: 0;
        }
        .healing-detail-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .healing-detail-text {
          font-size: 14px;
          line-height: 1.8;
          color: var(--text-soft);
          margin-bottom: 16px;
        }
        .healing-cta-btn {
          align-self: flex-start;
          padding: 8px 20px;
          font-size: 13px;
          border-radius: 999px;
          border: 1px solid var(--accent);
          background: transparent;
          color: var(--accent);
          cursor: pointer;
          transition: background 0.25s ease, color 0.25s ease;
        }
        .healing-cta-btn:hover {
          background: var(--accent);
          color: #fff;
        }

        /* ===== 响应式 ===== */
        @media (max-width: 768px) {
          .healing-detail-inner {
            flex-direction: column;
          }
          .healing-detail-img {
            width: 100%;
            height: 160px;
          }
        }
      `}</style>
    </div>
  );
};

export default HealingRoom;
