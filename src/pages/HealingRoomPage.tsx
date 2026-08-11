import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "../utils/track";
import { useSolo } from "../context/StandaloneContext";
import { useAppManifest } from "../hooks/useAppManifest";
import GratitudeJournal from "../components/GratitudeJournal";
import BreathingGuide from "../components/BreathingGuide";
import MeditationTimer from "../components/MeditationTimer";
import AchievementPage from "../components/AchievementPage";
import WeChatGuide from "../components/WeChatGuide";
import PWAInstallPrompt from "../components/PWAInstallPrompt";


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


type ModuleId = "welcome" | "journal" | "breathing" | "meditation" | "achievements";

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
      <span>开启疗愈之旅</span>
      <span className="hl-welcome-arrow">→</span>
    </div>
  </div>
);

/* ===== 主组件 ===== */
const HealingRoomPage: React.FC = () => {
  useAppManifest("/manifests/healing.webmanifest");
  const { isSolo } = useSolo();
  const [active, setActive] = useState<ModuleId>("welcome");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => { document.title = "森林疗愈室"; track("tool_enter", { tool_name: "森林疗愈室" }); }, []);

  const renderModule = () => {
    switch (active) {
      case "journal": return <GratitudeJournal />;
      case "breathing": return <BreathingGuide />;
      case "meditation": return <MeditationTimer />;
      case "achievements": return <AchievementPage />;
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
        {/* 回到作品集 */}
        {!isSolo && (
          <Link to="/mickey" className="hl-back">
            ← 回到作品集
          </Link>
        )}

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
        </nav>

        {/* 装饰语 */}
        <p className="hl-sidebar-quote">「平静是内心的力量」</p>
      </aside>

      {/* ===== 移动端顶部导航 ===== */}
      <div className="hl-mobile-header">
        {!isSolo && <Link to="/mickey" className="hl-mobile-back">← 回到作品集</Link>}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== 右侧内容卡片 ===== */}
      <main className="hl-main">
        <div className="hl-card-wrap">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className={`hl-card${active === "welcome" ? " hl-card-welcome" : ""}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {active !== "welcome" && (
                <button
                  className="hl-close-btn"
                  onClick={() => handleSelect("welcome")}
                  aria-label="返回"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              )}
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
          border-right: 1px solid rgba(240, 232, 215, 0.12);
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
          color: rgba(240, 232, 215, 0.85);
          background: rgba(255, 248, 235, 0.08);
          border: 1px solid rgba(240, 232, 215, 0.2);
          border-radius: 999px;
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: all 0.25s ease;
          width: fit-content;
        }
        .hl-back:hover {
          background: rgba(255, 248, 235, 0.15);
          color: rgba(250, 244, 230, 1);
          transform: translateX(-2px);
        }

        /* 标题 */
        .hl-sidebar-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 16px;
          font-weight: 600;
          color: rgba(245, 238, 222, 0.95);
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
          color: rgba(235, 226, 208, 0.82);
          overflow: hidden;
        }
        .hl-nav-item:hover {
          background: rgba(255, 248, 235, 0.08);
          color: rgba(250, 244, 230, 0.98);
        }
        .hl-nav-active {
          background: rgba(94, 138, 110, 0.2) !important;
          color: rgba(250, 244, 230, 1) !important;
        }
        .hl-nav-active:hover {
          background: rgba(94, 138, 110, 0.28) !important;
        }

        /* 左侧竖线指示器 */
        .hl-nav-bar {
          position: absolute;
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 3px;
          background: rgba(94, 138, 110, 0.8);
          border-radius: 0 3px 3px 0;
          box-shadow: 0 0 6px rgba(94, 138, 110, 0.3);
        }

        .hl-nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          opacity: 0.9;
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
          opacity: 0.75;
          letter-spacing: 0.04em;
        }

        /* 底部语 */
        .hl-sidebar-quote {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 10px;
          color: rgba(230, 222, 205, 0.55);
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
          position: relative;
          background: #f5f0e6;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 20px;
          padding: 36px;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
          color: #1a1f1a;

          /* 覆盖子组件的 CSS 变量为深色文字，适配浅色卡片背景（树叶描边黑） */
          --text: #1a1f1a;
          --text-soft: rgba(26, 31, 26, 0.75);
          --accent: #5E8A6E;
          --card-bg: rgba(0, 0, 0, 0.03);
          --border: rgba(0, 0, 0, 0.08);
        }

        /* 欢迎页卡片：半透明绿调米色，透出森林背景 */
        .hl-card-welcome {
          background: rgba(238, 240, 232, 0.38);
          backdrop-filter: blur(28px) saturate(1.1);
          -webkit-backdrop-filter: blur(28px) saturate(1.1);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          text-shadow: 0 1px 4px rgba(255, 250, 240, 0.55);
        }

        /* 关闭按钮 */
        .hl-close-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 10;
          width: 30px;
          height: 30px;
          border: none;
          border-radius: 50%;
          background: rgba(26, 31, 26, 0.08);
          color: rgba(26, 31, 26, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .hl-close-btn:hover {
          background: rgba(26, 31, 26, 0.15);
          color: #1a1f1a;
          transform: rotate(90deg);
        }

        /* 强制子组件 night 模式在卡片内使用暖米色背景 + 深色文字 */
        [data-theme="night"] .hl-card .gj-page-paper {
          background-color: #f5f0e6 !important;
          background-image:
            radial-gradient(ellipse 62% 52% at 18% 14%, rgba(122,154,130,0.08) 0%, transparent 62%),
            radial-gradient(ellipse 56% 46% at 86% 88%, rgba(202,172,122,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 72% 62% at 50% 52%, rgba(246,238,218,0.4) 0%, transparent 72%) !important;
          --text: #1a1f1a !important;
          --text-soft: rgba(26, 31, 26, 0.75) !important;
          --accent: #5E8A6E !important;
          --card-bg: rgba(0, 0, 0, 0.03) !important;
          --border: rgba(0, 0, 0, 0.08) !important;
        }
        [data-theme="night"] .hl-card .ms-card {
          background: #f5f0e6 !important;
          border-color: rgba(0, 0, 0, 0.08) !important;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06) !important;
          --text: #1a1f1a !important;
          --text-soft: rgba(26, 31, 26, 0.75) !important;
          --accent: #5E8A6E !important;
          --card-bg: rgba(0, 0, 0, 0.03) !important;
          --border: rgba(0, 0, 0, 0.08) !important;
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
          color: #1a1f1a;
          margin: 0 0 14px;
        }
        .hl-welcome-sub {
          font-size: 15px;
          color: rgba(26, 31, 26, 0.85);
          margin: 0 0 24px;
          line-height: 1.7;
        }
        .hl-welcome-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 12px;
          color: rgba(26, 31, 26, 0.7);
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
          border-bottom: 1px solid rgba(240, 232, 215, 0.12);
          align-items: center;
          justify-content: space-between;
        }
        .hl-mobile-back {
          font-size: 13px;
          color: rgba(240, 232, 215, 0.85);
          text-decoration: none;
          padding: 6px 0;
        }
        .hl-mobile-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px;
          color: rgba(245, 238, 222, 0.95);
          font-weight: 500;
        }
        .hl-mobile-menu-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: rgba(255, 248, 235, 0.1);
          border-radius: 8px;
          color: rgba(240, 232, 215, 0.9);
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
          border-bottom: 1px solid rgba(240, 232, 215, 0.12);
          flex-wrap: wrap;
          gap: 6px;
        }
        .hl-mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: 1px solid rgba(240, 232, 215, 0.18);
          border-radius: 999px;
          background: rgba(255, 248, 235, 0.06);
          color: rgba(235, 226, 208, 0.85);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .hl-mobile-nav-active {
          background: rgba(94, 138, 110, 0.22);
          border-color: rgba(94, 138, 110, 0.45);
          color: rgba(250, 244, 230, 1);
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
      <PWAInstallPrompt />
      <WeChatGuide />
    </div>
  );
};

export default HealingRoomPage;
