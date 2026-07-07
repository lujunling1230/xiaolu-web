import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useView, type View } from "../context/ViewContext";

/**
 * ForestNavbar 森林风导航栏
 *
 * 固定顶部，64px 高度，半透明磨砂 + 树皮草地质感纹理。
 * 4 个导航项：首页 | 关于我 | 项目集 | 疗愈室
 * 每项配森林图标（树叶/小鹿/书本/小屋），hover 图标上浮+发光。
 * 导航项标记 data-cursor="nav"，供蝴蝶光标识别并飞向。
 * 移动端折叠为汉堡菜单。
 */

interface NavItem {
  key: View;
  label: string;
  icon: React.ReactNode;
}

/* 树叶图标 */
const LeafIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1.5C4.5 3 2.5 6 2.5 9.5C2.5 12 4 14 8 14.5C12 14 13.5 12 13.5 9.5C13.5 6 11.5 3 8 1.5Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M8 2.5L8 13.5" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
    <path d="M8 6L5.5 8.5M8 6L10.5 8.5M8 9L6 11M8 9L10 11" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
  </svg>
);

/* 小鹿图标 */
const DeerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 5L3 2.5M4 5L2.5 4M4 5L5 2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M12 5L13 2.5M12 5L13.5 4M12 5L11 2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <ellipse cx="8" cy="8.5" rx="4" ry="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="6.5" cy="7.5" r="0.5" fill="currentColor" />
    <circle cx="9.5" cy="7.5" r="0.5" fill="currentColor" />
    <path d="M7 10L8 11L9 10" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
    <line x1="5.5" y1="12" x2="5.5" y2="14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <line x1="10.5" y1="12" x2="10.5" y2="14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

/* 书本图标 */
const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 3.5C2.5 3 3 2.5 3.5 2.5H7.5V13H3.5C3 13 2.5 12.5 2.5 12V3.5Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M13.5 3.5C13.5 3 13 2.5 12.5 2.5H8.5V13H12.5C13 13 13.5 12.5 13.5 12V3.5Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <line x1="8" y1="2.5" x2="8" y2="13" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
    <line x1="4" y1="6" x2="6.5" y2="6" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
    <line x1="4" y1="8" x2="6.5" y2="8" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
    <line x1="9.5" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
    <line x1="9.5" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
  </svg>
);

/* 小屋图标 */
const HouseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 7L8 3L13 7V12.5C13 13 12.5 13.5 12 13.5H4C3.5 13.5 3 13 3 12.5V7Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M6.5 13.5V9.5H9.5V13.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    <line x1="2" y1="7.5" x2="14" y2="7.5" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
  </svg>
);

const navItems: NavItem[] = [
  { key: "forest", label: "首页", icon: <LeafIcon /> },
  { key: "about", label: "关于我", icon: <DeerIcon /> },
  { key: "projects", label: "项目集", icon: <BookIcon /> },
];

const ForestNavbar: React.FC = () => {
  const { view, navigate } = useView();
  const [mobileOpen, setMobileOpen] = useState(false);

  // 视图变化时关闭移动菜单
  useEffect(() => {
    setMobileOpen(false);
  }, [view]);

  return (
    <>
      <motion.nav
        className="forest-navbar"
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        aria-label="主导航"
      >
        {/* 树皮/草地质感纹理叠加层 */}
        <div className="fn-texture" aria-hidden="true" />

        {/* 移动端汉堡按钮 */}
        <button
          className="fn-hamburger"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="切换菜单"
          aria-expanded={mobileOpen}
          data-clickable
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <motion.line
              x1="3" y1={mobileOpen ? 10 : 6} x2="17" y2={mobileOpen ? 10 : 6}
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
              animate={{ y: mobileOpen ? 10 : 6 }}
            />
            <motion.line
              x1="3" y1={mobileOpen ? 10 : 14} x2="17" y2={mobileOpen ? 10 : 14}
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
              animate={{ y: mobileOpen ? 10 : 14, opacity: mobileOpen ? 0 : 1 }}
            />
          </svg>
        </button>

        {/* 导航项列表 */}
        <ul className={`fn-list ${mobileOpen ? "fn-list-open" : ""}`}>
          {navItems.map((item) => {
            const active = view === item.key;
            return (
              <li key={item.key}>
                <button
                  className={`fn-item ${active ? "fn-item-active" : ""}`}
                  onClick={() => navigate(item.key)}
                  data-cursor="nav"
                  data-nav-view={item.key}
                  data-clickable
                >
                  <span className="fn-icon">{item.icon}</span>
                  <span className="fn-label">{item.label}</span>
                  {/* hover 微光下划线 */}
                  <span className="fn-underline" />
                </button>
              </li>
            );
          })}
        </ul>
      </motion.nav>

      {/* 移动端展开时的遮罩（点击关闭） */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fn-mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <style>{`
        /* ===== 森林风导航栏 ===== */
        .forest-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 253, 249, 0.55);
          backdrop-filter: blur(16px) saturate(1.1);
          -webkit-backdrop-filter: blur(16px) saturate(1.1);
          border-bottom: 1px solid rgba(184, 140, 106, 0.12);
          box-shadow: 0 2px 20px -8px rgba(60, 80, 60, 0.12);
          opacity: 0.92;
          transition: background 0.8s ease, opacity 0.4s ease;
        }
        [data-theme="night"] .forest-navbar {
          background: rgba(20, 28, 42, 0.55);
          border-bottom-color: rgba(148, 163, 184, 0.12);
          box-shadow: 0 2px 20px -8px rgba(0, 0, 0, 0.3);
        }

        /* 树皮/草地质感纹理 — 极淡 */
        .fn-texture {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.025;
          background-image:
            repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(90, 110, 90, 0.4) 3px, rgba(90, 110, 90, 0.4) 4px),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
          border-radius: inherit;
        }

        /* 导航项列表 */
        .fn-list {
          display: flex;
          align-items: center;
          gap: 6px;
          list-style: none;
          margin: 0;
          padding: 0;
          position: relative;
          z-index: 1;
        }

        /* 导航项按钮 */
        .fn-item {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border: none;
          background: transparent;
          color: #3e3e3e;
          font-family: "Noto Serif SC", "Noto Sans SC", serif;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.04em;
          border-radius: 12px;
          cursor: pointer;
          position: relative;
          transition: color 0.3s ease, background 0.3s ease;
        }
        [data-theme="night"] .fn-item {
          color: #cbd5e1;
        }

        /* 图标 */
        .fn-icon {
          display: flex;
          align-items: center;
          transition: transform 0.3s ease, filter 0.3s ease;
          color: var(--accent, #b88c6a);
        }

        /* hover：图标上浮 + 发光 */
        .fn-item:hover .fn-icon {
          transform: translateY(-3px);
          filter: drop-shadow(0 0 5px rgba(218, 165, 32, 0.4));
        }

        /* active 状态 */
        .fn-item-active {
          color: var(--accent, #b88c6a);
          background: rgba(184, 140, 106, 0.06);
        }
        .fn-item-active .fn-icon {
          filter: drop-shadow(0 0 4px rgba(218, 165, 32, 0.3));
        }
        [data-theme="night"] .fn-item-active {
          background: rgba(201, 168, 122, 0.08);
          color: #c9a87a;
        }

        /* hover 微光下划线 */
        .fn-underline {
          position: absolute;
          bottom: 4px;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #DAA520, transparent);
          border-radius: 1px;
          transform: translateX(-50%);
          opacity: 0;
          transition: width 0.35s ease, opacity 0.35s ease;
        }
        .fn-item:hover .fn-underline,
        .fn-item-active .fn-underline {
          width: 60%;
          opacity: 0.6;
        }

        /* 汉堡按钮 — 仅移动端显示 */
        .fn-hamburger {
          display: none;
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #3e3e3e;
          padding: 8px;
          cursor: pointer;
          z-index: 2;
        }
        [data-theme="night"] .fn-hamburger { color: #cbd5e1; }

        /* 移动端遮罩 */
        .fn-mobile-overlay {
          position: fixed;
          inset: 0;
          top: 64px;
          z-index: 99;
          background: rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(2px);
        }

        /* ===== 移动端 ===== */
        @media (max-width: 768px) {
          .fn-hamburger { display: block; }
          .fn-list {
            position: fixed;
            top: 64px;
            right: 0;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            padding: 12px;
            min-width: 160px;
            background: rgba(255, 253, 249, 0.92);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-radius: 0 0 0 16px;
            border-left: 1px solid rgba(184, 140, 106, 0.12);
            border-bottom: 1px solid rgba(184, 140, 106, 0.12);
            box-shadow: -4px 8px 20px -8px rgba(60, 80, 60, 0.15);
            transform: translateX(100%);
            opacity: 0;
            pointer-events: none;
            transition: transform 0.3s ease, opacity 0.3s ease;
          }
          [data-theme="night"] .fn-list {
            background: rgba(20, 28, 42, 0.92);
            border-left-color: rgba(148, 163, 184, 0.12);
            border-bottom-color: rgba(148, 163, 184, 0.12);
          }
          .fn-list-open {
            transform: translateX(0);
            opacity: 1;
            pointer-events: auto;
          }
          .fn-item {
            padding: 12px 16px;
            font-size: 15px;
            border-radius: 10px;
            width: 100%;
            justify-content: flex-start;
          }
          .fn-underline {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default ForestNavbar;
