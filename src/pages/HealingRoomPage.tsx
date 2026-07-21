import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import GratitudeJournal from "../components/GratitudeJournal";
import BreathingGuide from "../components/BreathingGuide";
import MeditationTimer from "../components/MeditationTimer";
import HealingCompanion from "../components/HealingCompanion";
import AchievementPage from "../components/AchievementPage";

/* ===== 图标 ===== */
const JournalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M4 3h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.4" />
    <path d="M13 3v4M9 3v4M4 9h12M4 13h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const BreathingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1" opacity="0.5" />
  </svg>
);
const MeditationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M4 16C4 13 6.5 11 10 11C13.5 11 16 13 16 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M6 11L4 8M14 11L16 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
  </svg>
);


type ModuleId = "welcome" | "journal" | "breathing" | "meditation" | "achievements" | "companion";

const CompanionIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M10 3C7 6 4 9 4 12.5C4 16 6.7 19 10 19C13.3 19 16 16 16 12.5C16 9 13 6 10 7C8 7.3 6.5 9.5 7.5 12C8 13.2 9 13.8 10 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M7 10L5.5 13M13 10L14.5 13M5 15L3.5 17.5M15 15L16.5 17.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
  </svg>
);

const AchievementIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M10 2L12 7L17 7L13 11L14.5 16L10 13.5L5.5 16L7 11L3 7L8 7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

const NAV_ITEMS = [
  { id: "journal" as ModuleId, label: "感恩日记", subtitle: "Gratitude Journal", icon: <JournalIcon /> },
  { id: "breathing" as ModuleId, label: "呼吸引导", subtitle: "Breathing Guide", icon: <BreathingIcon /> },
  { id: "meditation" as ModuleId, label: "冥想空间", subtitle: "Meditation Space", icon: <MeditationIcon /> },
];

/* ===== 欢迎卡片 ===== */
const WelcomeCard = () => (
  <div className="hl-welcome">
    <div className="hl-welcome-icon">🌿</div>
    <h3 className="hl-welcome-title">欢迎来到疗愈室</h3>
    <p className="hl-welcome-sub">哦~土豆，选一个工具，开始今天的疗愈吧。</p>
    <div className="hl-welcome-hint">
      <span>左侧任选一项</span>
      <span className="hl-welcome-arrow">→</span>
    </div>
  </div>
);

/* ===== 主组件 ===== */
const HealingRoomPage: React.FC = () => {
  const [active, setActive] = useState<ModuleId>("welcome");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const renderModule = () => {
    switch (active) {
      case "journal": return <GratitudeJournal />;
      case "breathing": return <BreathingGuide />;
      case "meditation": return <MeditationTimer />;
      case "achievements": return <AchievementPage />;
      case "companion": return <HealingCompanion />;
      default: return <WelcomeCard />;
    }
  };

  const handleSelect = (id: ModuleId) => {
    setActive(id);
    setMobileNavOpen(false);
  };

  return (
    <div className="hr-root">
      {/* ===== 森林背景层 ===== */}
      <div className="hr-bg" />

        {/* ===== 左侧导航 ===== */}
      <aside className="hl-sidebar">
        {/* 回到主站 */}
        <Link to="/" className="hl-back">
          ← 回到主站
        </Link>

        {/* 标题 */}
        <div className="hl-sidebar-title">疗愈室</div>

        {/* 导航列表 */}
        <nav className="hl-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`hl-nav-item ${active === item.id ? "hl-nav-active" : ""}`}
              onClick={() => handleSelect(item.id)}
            >
              {/* 左侧竖线指示器 */}
              {active === item.id && (
                <motion.span
                  className="hl-nav-bar"
                  layoutId="hl-nav-bar"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              )}
              <span className="hl-nav-icon">{item.icon}</span>
              <span className="hl-nav-text">
                <span className="hl-nav-label">{item.label}</span>
                <span className="hl-nav-sub">{item.subtitle}</span>
              </span>
            </button>
          ))}
          {/* 成就入口 */}
          <button
            className={`hl-nav-item ${active === "achievements" ? "hl-nav-active" : ""}`}
            onClick={() => handleSelect("achievements")}
          >
            {active === "achievements" && (
              <motion.span
                className="hl-nav-bar"
                layoutId="hl-nav-bar"
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            )}
            <span className="hl-nav-icon"><AchievementIcon /></span>
            <span className="hl-nav-text">
              <span className="hl-nav-label">疗愈成就</span>
              <span className="hl-nav-sub">Achievements</span>
            </span>
          </button>
          {/* 疗愈对话入口 */}
          <button
            className={`hl-nav-item ${active === "companion" ? "hl-nav-active" : ""}`}
            onClick={() => handleSelect("companion")}
          >
            {active === "companion" && (
              <motion.span
                className="hl-nav-bar"
                layoutId="hl-nav-bar"
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            )}
            <span className="hl-nav-icon"><CompanionIcon /></span>
            <span className="hl-nav-text">
              <span className="hl-nav-label">疗愈对话</span>
              <span className="hl-nav-sub">Companion</span>
            </span>
          </button>
        </nav>

        {/* 装饰语 */}
        <p className="hl-sidebar-quote">「平静是内心的力量」</p>
      </aside>

      {/* ===== 移动端顶部导航 ===== */}
      <div className="hl-mobile-header">
        <Link to="/" className="hl-mobile-back">← 主站</Link>
        <span className="hl-mobile-title">疗愈室</span>
        <button className="hl-mobile-menu-btn" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
          {mobileNavOpen ? "×" : "☰"}
        </button>
      </div>

      {/* ===== 移动端下拉导航 ===== */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            className="hl-mobile-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`hl-mobile-nav-item ${active === item.id ? "hl-mobile-nav-active" : ""}`}
                onClick={() => handleSelect(item.id)}
              >
                <span className="hl-nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
            <button
              className={`hl-mobile-nav-item ${active === "achievements" ? "hl-mobile-nav-active" : ""}`}
              onClick={() => handleSelect("achievements")}
            >
              <span className="hl-nav-icon"><AchievementIcon /></span>
              疗愈成就
            </button>
            <button
              className={`hl-mobile-nav-item ${active === "companion" ? "hl-mobile-nav-active" : ""}`}
              onClick={() => handleSelect("companion")}
            >
              <span className="hl-nav-icon"><CompanionIcon /></span>
              疗愈对话
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== 右侧内容卡片 ===== */}
      <main className="hl-main">
        <div className="hl-card-wrap">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="hl-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {renderModule()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style>{`
        /* ===== 根容器 ===== */
        .hr-root {
          position: relative;
          min-height: 100vh;
          display: flex;
          overflow: hidden;
        }

        /* ===== 森林背景（整体缓动） ===== */
        .hr-bg {
          position: fixed;
          inset: -10px;
          z-index: 0;
          background-image: url('/healing-forest.jpg');
          background-size: cover;
          background-position: center;
          filter: brightness(0.88) saturate(0.9);
          animation: hrBgSway 8s ease-in-out infinite;
        }
        @keyframes hrBgSway {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }

        /* ===== 渐变暗角 ===== */
        .hr-root::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            180deg,
            rgba(0,0,0,0.15) 0%,
            rgba(0,0,0,0.08) 30%,
            rgba(0,0,0,0.25) 70%,
            rgba(0,0,0,0.4) 100%
          );
          pointer-events: none;
        }

        /* ===== 左侧导航栏 ===== */
        .hl-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 10;
          width: 220px;
          display: flex;
          flex-direction: column;
          padding: 28px 16px 24px;
          background: rgba(10, 20, 10, 0.35);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* 回到主站 */
        .hl-back {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 12px;
          margin-bottom: 24px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.75);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 999px;
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: all 0.25s ease;
          width: fit-content;
        }
        .hl-back:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          transform: translateX(-2px);
        }

        /* 标题 */
        .hl-sidebar-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 16px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 20px;
          padding-left: 12px;
          letter-spacing: 0.08em;
        }

        /* 导航列表 */
        .hl-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .hl-nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 12px 12px 16px;
          border: none;
          border-radius: 10px;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition: background 0.25s ease, color 0.25s ease;
          color: rgba(255, 255, 255, 0.65);
          overflow: hidden;
        }
        .hl-nav-item:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.9);
        }
        .hl-nav-active {
          background: rgba(122, 154, 130, 0.2) !important;
          color: rgba(200, 230, 200, 0.95) !important;
        }
        .hl-nav-active:hover {
          background: rgba(122, 154, 130, 0.25) !important;
        }

        /* 左侧竖线指示器 */
        .hl-nav-bar {
          position: absolute;
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 3px;
          background: rgba(160, 200, 160, 0.8);
          border-radius: 0 3px 3px 0;
          box-shadow: 0 0 8px rgba(160, 200, 160, 0.5);
        }

        .hl-nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          opacity: 0.75;
        }
        .hl-nav-active .hl-nav-icon { opacity: 1; }

        .hl-nav-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .hl-nav-label {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.3;
        }
        .hl-nav-sub {
          font-size: 9px;
          opacity: 0.55;
          letter-spacing: 0.04em;
        }

        /* 底部语 */
        .hl-sidebar-quote {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.35);
          text-align: center;
          margin-top: 16px;
          letter-spacing: 0.06em;
        }

        /* ===== 右侧主内容区 ===== */
        .hl-main {
          position: relative;
          z-index: 5;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 24px 48px;
          margin-left: 220px;
          min-height: 100vh;
        }

        .hl-card-wrap {
          width: 100%;
          max-width: 700px;
        }

        .hl-card {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 20px;
          padding: 36px;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.18);
          color: rgba(255, 255, 255, 0.92);
        }

        /* ===== 欢迎卡片 ===== */
        .hl-welcome {
          text-align: center;
          padding: 24px 16px;
        }
        .hl-welcome-icon {
          font-size: 56px;
          margin-bottom: 20px;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        }
        .hl-welcome-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 24px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.92);
          margin: 0 0 14px;
        }
        .hl-welcome-sub {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.65);
          margin: 0 0 24px;
          line-height: 1.7;
        }
        .hl-welcome-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.06em;
        }
        .hl-welcome-arrow {
          animation: hrArrowBounce 1.5s ease-in-out infinite;
        }
        @keyframes hrArrowBounce {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }

        /* ===== 移动端顶部栏 ===== */
        .hl-mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 20;
          height: 56px;
          padding: 0 16px;
          background: rgba(10, 20, 10, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          align-items: center;
          justify-content: space-between;
        }
        .hl-mobile-back {
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          padding: 6px 0;
        }
        .hl-mobile-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px;
          color: rgba(255,255,255,0.85);
          font-weight: 500;
        }
        .hl-mobile-menu-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          color: rgba(255,255,255,0.8);
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ===== 移动端下拉导航 ===== */
        .hl-mobile-nav {
          display: none;
          position: fixed;
          top: 56px;
          left: 0;
          right: 0;
          z-index: 19;
          background: rgba(10, 20, 10, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 8px 16px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          flex-wrap: wrap;
          gap: 6px;
        }
        .hl-mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .hl-mobile-nav-active {
          background: rgba(122, 154, 130, 0.25);
          border-color: rgba(160, 200, 160, 0.4);
          color: rgba(200, 230, 200, 0.95);
        }

        /* ===== 响应式 ===== */
        @media (max-width: 768px) {
          .hl-sidebar { display: none; }
          .hl-mobile-header { display: flex; }
          .hl-mobile-nav { display: flex; }
          .hl-main {
            margin-left: 0;
            padding: 72px 16px 32px;
            align-items: flex-start;
          }
          .hl-card-wrap { max-width: 100%; }
          .hl-card { padding: 24px 20px; border-radius: 16px; }
          .hr-leaf { display: none; }
        }
      `}</style>
    </div>
  );
};

export default HealingRoomPage;
