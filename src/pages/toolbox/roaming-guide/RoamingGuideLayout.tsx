import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSolo } from "../../../context/StandaloneContext";
import { track } from "../../../utils/track";

const NAV_ITEMS = [
  { to: "map", icon: "🗺", label: "足迹地图", en: "Atlas" },
  { to: "cities", icon: "🏙️", label: "城市记忆", en: "Memoir" },
  { to: "plan", icon: "🧭", label: "漫游向导", en: "Compass" },
  { to: "profile", icon: "👤", label: "我的", en: "Profile" },
  { to: "about", icon: "☁️", label: "关于它", en: "About" },
];

export default function RoamingGuideLayout() {
  const { isSolo } = useSolo();
  const location = useLocation();
  const fromQuery = isSolo ? "?solo=1" : "";

  useEffect(() => {
    track("tool_enter", { tool_name: "漫游指南" });
  }, []);

  return (
    <div className="rg-layout">
      <style>{`
        /* ===== 全局 ===== */
        .rg-layout {
          min-height: 100vh;
          display: flex;
          font-family: 'Source Han Serif SC', 'Noto Serif SC', 'PingFang SC', serif;
          background: linear-gradient(135deg, #F5F3EE 0%, #F0F4F1 40%, #F5F0F6 100%);
          position: relative;
          color: #2C3E50;
        }

        /* 背景装饰 - 多层径向渐变 */
        .rg-layout::before {
          content: "";
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 5% 5%, rgba(244,211,94,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 92% 92%, rgba(123,168,158,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 70% 15%, rgba(180,160,200,0.05) 0%, transparent 50%),
            radial-gradient(ellipse 45% 35% at 25% 75%, rgba(123,168,158,0.06) 0%, transparent 50%),
            radial-gradient(ellipse 80% 30% at 50% 100%, rgba(244,211,94,0.05) 0%, transparent 45%);
          pointer-events: none;
          z-index: 0;
        }

        /* 胶片颗粒感 noise 纹理 */
        .rg-layout::after {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 256px 256px;
        }

        /* SVG 装饰元素 */
        .rg-deco {
          position: fixed;
          pointer-events: none;
          z-index: 1;
          opacity: 0.5;
        }
        .rg-deco--cloud {
          top: 6%;
          right: 4%;
          width: 80px;
          animation: rgFloat 12s ease-in-out infinite;
        }
        .rg-deco--mountain {
          bottom: 10%;
          left: 3%;
          width: 60px;
          opacity: 0.35;
          animation: rgFloat 14s ease-in-out infinite reverse;
        }
        @keyframes rgFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }

        /* ===== 侧边栏 ===== */
        .rg-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 200px;
          z-index: 100;
          background: rgba(245,243,238,0.72);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-right: 1px solid rgba(90,74,58,0.08);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          box-shadow: 1px 0 20px rgba(90,74,58,0.04);
        }

        .rg-sidebar-top {
          padding: 28px 20px 18px;
          text-align: center;
          border-bottom: 1px solid rgba(90,74,58,0.08);
          position: relative;
        }
        .rg-sidebar-top::after {
          content: "☁";
          position: absolute;
          bottom: -11px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          opacity: 0.3;
          color: #B0A898;
        }

        .rg-sidebar-back {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #B0A898;
          text-decoration: none;
          letter-spacing: 1px;
          margin-bottom: 14px;
          transition: color 0.2s, transform 0.2s;
        }
        .rg-sidebar-back:hover { color: #7BA89E; transform: translateX(-2px); }

        .rg-sidebar-title {
          font-size: 19px;
          font-weight: 600;
          color: #5A4A3A;
          letter-spacing: 4px;
          margin: 0 0 4px;
        }
        .rg-sidebar-subtitle {
          font-size: 10px;
          color: #B0A898;
          letter-spacing: 2px;
          margin: 0;
        }

        /* 导航链接 */
        .rg-sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 24px 14px;
          gap: 4px;
        }

        .rg-sidebar-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-radius: 14px;
          color: #5A4A3A;
          font-size: 13px;
          letter-spacing: 1px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }
        .rg-sidebar-link::after {
          content: "";
          position: absolute;
          bottom: 4px;
          left: 14px;
          width: 0;
          height: 2px;
          border-radius: 1px;
          background: #F4D35E;
          transition: width 0.3s ease;
        }
        .rg-sidebar-link:hover::after { width: 16px; }
        .rg-sidebar-link:hover {
          color: #5A4A3A;
          background: rgba(244,211,94,0.12);
          transform: translateX(3px);
        }
        .rg-sidebar-link.active {
          color: #5A4A3A;
          background: rgba(244,211,94,0.22);
          font-weight: 500;
          box-shadow: 0 2px 10px rgba(90,74,58,0.06);
        }
        .rg-sidebar-link.active::after { width: 20px; }
        .rg-sidebar-link.active:hover { transform: translateX(0); }
        .rg-sidebar-link__icon {
          width: 22px;
          text-align: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        /* 侧边栏底部 */
        .rg-sidebar-footer {
          padding: 14px 20px 16px;
          text-align: center;
          border-top: 1px solid rgba(90,74,58,0.08);
          font-size: 10px;
          color: #B0A898;
          letter-spacing: 1px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .rg-sidebar-auth { padding-bottom: 4px; }

        /* 移动端浮动登录入口 */
        .rg-mobile-auth {
          display: none;
          position: fixed;
          top: 12px;
          right: 14px;
          z-index: 200;
        }

        /* ===== 主内容区 ===== */
        .rg-content {
          margin-left: 200px;
          flex: 1;
          min-height: 100vh;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
        }

        /* ===== 顶部 Header ===== */
        .rg-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(245,243,238,0.72);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(90,74,58,0.06);
        }
        .rg-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .rg-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #B0A898;
          text-decoration: none;
          letter-spacing: 1px;
          transition: color 0.2s, transform 0.2s;
          flex-shrink: 0;
        }
        .rg-header-left:hover { color: #7BA89E; transform: translateX(-2px); }
        .rg-header-center {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .rg-header-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #F4D35E;
          box-shadow: 0 0 0 3px rgba(244,211,94,0.2);
        }
        .rg-header-en {
          font-size: 11px;
          text-transform: uppercase;
          tracking: 0.15em;
          letter-spacing: 0.15em;
          color: #B0A898;
          font-family: 'Noto Sans SC', sans-serif;
        }

        /* 页面内容包裹 */
        .rg-page-wrap {
          flex: 1;
          position: relative;
          z-index: 2;
        }

        /* ===== 响应式：移动端底部标签栏 ===== */
        @media (max-width: 768px) {
          .rg-layout { flex-direction: column; }
          .rg-layout::after { display: none; }
          .rg-deco { display: none; }

          /* 侧边栏 → 底部固定标签栏 */
          .rg-sidebar {
            position: fixed;
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 58px;
            flex-direction: row;
            align-items: center;
            background: rgba(245,243,238,0.95);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-right: none;
            border-top: 1px solid rgba(90,74,58,0.08);
            z-index: 100;
            padding: 0 4px;
            box-shadow: 0 -2px 12px rgba(90,74,58,0.06);
          }

          .rg-sidebar-top { display: none; }
          .rg-sidebar-nav {
            flex: 1;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            padding: 0;
            gap: 0;
          }
          .rg-sidebar-link {
            flex-direction: column;
            align-items: center;
            font-size: 9px;
            gap: 2px;
            padding: 4px 6px;
            border-radius: 8px;
            letter-spacing: 0;
            min-width: 0;
            flex: 1;
            max-width: 72px;
          }
          .rg-sidebar-link__icon { font-size: 18px; width: auto; }
          .rg-sidebar-link:hover { transform: translateY(-2px); }
          .rg-sidebar-link.active {
            background: transparent;
            box-shadow: none;
          }
          .rg-sidebar-link.active::after {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%);
          }
          .rg-sidebar-footer { display: none; }
          .rg-mobile-auth { display: block; }

          .rg-content {
            margin-left: 0;
            margin-bottom: 64px;
            padding-bottom: 16px;
          }

          .rg-header-inner { padding: 10px 16px; }
          .rg-header-en { font-size: 10px; }
        }
      `}</style>

      {/* SVG 装饰元素 */}
      <svg className="rg-deco rg-deco--cloud" viewBox="0 0 80 40" fill="none">
        <path d="M12 32 Q4 32 4 24 Q4 16 14 16 Q16 8 26 8 Q36 8 38 16 Q48 14 52 22 Q60 20 62 28 Q64 32 58 32 Z" fill="rgba(180,160,200,0.15)" stroke="rgba(180,160,200,0.1)" strokeWidth="0.5"/>
      </svg>
      <svg className="rg-deco rg-deco--mountain" viewBox="0 0 60 40" fill="none">
        <path d="M5 38 L18 14 L26 24 L35 8 L55 38 Z" fill="rgba(123,168,158,0.12)" stroke="rgba(123,168,158,0.08)" strokeWidth="0.5"/>
        <path d="M18 14 L22 20 L26 24" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" fill="none"/>
      </svg>

      {/* ===== 侧边栏 ===== */}
      <aside className="rg-sidebar">
        <div className="rg-sidebar-top">
          {!isSolo && (
            <Link to={`/mickey${fromQuery}`} className="rg-sidebar-back">
              ← <span>回到作品集</span>
            </Link>
          )}
          <h1 className="rg-sidebar-title">漫游指南</h1>
          <p className="rg-sidebar-subtitle">丙午年 · 启程</p>
        </div>

        <nav className="rg-sidebar-nav">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} className="rg-sidebar-link" end={item.to === "map"}>
              <span className="rg-sidebar-link__icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="rg-sidebar-footer">
          <span>慢慢走，好好看</span>
        </div>
      </aside>

      {/* ===== 主内容 ===== */}
      <main className="rg-content">
        {/* 页面内容 + 切换动画 */}
        <div className="rg-page-wrap">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.34, 1.2, 0.64, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
