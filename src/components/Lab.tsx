import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GratitudeJournal from "./GratitudeJournal";
import BreathingGuide from "./BreathingGuide";
import MeditationTimer from "./MeditationTimer";
import MessageBoard from "./MessageBoard";

/**
 * Lab 疗愈室 — 四大交互模块
 *
 * 布局：左侧导航 + 右侧卡片
 * 模块：感恩日记 / 呼吸引导 / 冥想空间 / 留言板
 * 主题：浅/深双主题兼容，叶绿/陶土/米白配色
 * 数据：仅 localStorage，无后端
 */

type ModuleId = "journal" | "breathing" | "meditation" | "board";

interface NavItem {
  id: ModuleId;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
}

/* ===== 导航图标 ===== */
const JournalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <line x1="3" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="1.2" />
    <line x1="6" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <line x1="6" y1="13" x2="12" y2="13" stroke="currentColor" strokeWidth="1" opacity="0.5" />
  </svg>
);

const BreathingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1" opacity="0.5" />
  </svg>
);

const MeditationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M4 16C4 13 6.5 11 10 11C13.5 11 16 13 16 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M6 11L4 8M14 11L16 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const BoardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="3" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M7 15V18M13 15V18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M6 8H14M6 11H11" stroke="currentColor" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
  </svg>
);

const NAV_ITEMS: NavItem[] = [
  { id: "journal", label: "感恩日记", subtitle: "Gratitude Journal", icon: <JournalIcon /> },
  { id: "breathing", label: "呼吸引导", subtitle: "Breathing Guide", icon: <BreathingIcon /> },
  { id: "meditation", label: "冥想空间", subtitle: "Meditation Space", icon: <MeditationIcon /> },
  { id: "board", label: "留言板", subtitle: "Message Board", icon: <BoardIcon /> },
];

const Lab: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleId>("journal");

  return (
    <div className="lab-wrapper">
      <div className="lab-layout">
        {/* ===== 左侧导航 ===== */}
        <nav className="lab-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`lab-nav-item ${activeModule === item.id ? "lab-nav-active" : ""}`}
              onClick={() => setActiveModule(item.id)}
            >
              <span className="lab-nav-icon">{item.icon}</span>
              <span className="lab-nav-text">
                <span className="lab-nav-label">{item.label}</span>
                <span className="lab-nav-sub">{item.subtitle}</span>
              </span>
              {activeModule === item.id && (
                <motion.span
                  className="lab-nav-indicator"
                  layoutId="lab-nav-indicator"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* ===== 右侧内容区 ===== */}
        <div className="lab-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              className="lab-content-inner"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {activeModule === "journal" && <GratitudeJournal />}
              {activeModule === "breathing" && <BreathingGuide />}
              {activeModule === "meditation" && <MeditationTimer />}
              {activeModule === "board" && <MessageBoard />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .lab-wrapper {
          margin-top: 32px;
        }

        /* ===== 布局：左侧导航 + 右侧内容 ===== */
        .lab-layout {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 32px;
          align-items: start;
        }

        /* ===== 左侧导航 ===== */
        .lab-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: sticky;
          top: 88px;
        }
        .lab-nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 14px 16px;
          border: none;
          border-radius: 12px;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition: background 0.25s ease, color 0.25s ease;
          color: var(--text-soft);
        }
        .lab-nav-item:hover {
          background: rgba(122, 154, 130, 0.06);
          color: var(--text);
        }
        .lab-nav-active {
          background: rgba(122, 154, 130, 0.1);
          color: var(--accent);
        }
        .lab-nav-active:hover {
          background: rgba(122, 154, 130, 0.12);
          color: var(--accent);
        }
        .lab-nav-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          background: var(--accent);
          border-radius: 0 3px 3px 0;
        }
        .lab-nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          opacity: 0.7;
          transition: opacity 0.25s ease;
        }
        .lab-nav-active .lab-nav-icon {
          opacity: 1;
        }
        .lab-nav-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .lab-nav-label {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px;
          font-weight: 500;
        }
        .lab-nav-sub {
          font-size: 10px;
          opacity: 0.5;
          letter-spacing: 0.05em;
        }

        /* ===== 右侧内容区 ===== */
        .lab-content {
          min-height: 400px;
          padding: 32px;
          border-radius: 16px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          box-shadow: 0 4px 24px -8px rgba(60, 80, 60, 0.08);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .lab-content-inner {
          width: 100%;
        }

        /* ===== 响应式：移动端横向 Tab ===== */
        @media (max-width: 768px) {
          .lab-layout {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .lab-nav {
            position: static;
            flex-direction: row;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 4px;
          }
          .lab-nav-item {
            flex-shrink: 0;
            padding: 10px 16px;
          }
          .lab-nav-indicator {
            left: 50%;
            top: auto;
            bottom: 0;
            transform: translateX(-50%);
            width: 60%;
            height: 3px;
            border-radius: 3px 3px 0 0;
          }
          .lab-nav-sub {
            display: none;
          }
          .lab-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Lab;
