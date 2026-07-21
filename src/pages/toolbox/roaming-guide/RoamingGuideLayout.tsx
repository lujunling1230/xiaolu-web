import { Outlet, NavLink, Link } from "react-router-dom";

export default function RoamingGuideLayout() {
  return (
    <div className="rg-layout">
      <style>{`
        /* ===== 全局 ===== */
        .rg-layout {
          min-height: 100vh;
          display: flex;
          font-family: 'Noto Sans SC', 'PingFang SC', system-ui, sans-serif;
          background: #faf7f0;
          position: relative;
          color: #4a4a4a;
        }

        /* 背景装饰 */
        .rg-layout::before {
          content: "";
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 15% 10%, rgba(255,183,120,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 85% 85%, rgba(160,210,180,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 50% 30% at 50% 50%, rgba(200,180,255,0.04) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        /* ===== 侧边栏 ===== */
        .rg-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 200px;
          z-index: 100;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-right: 1px solid rgba(200,190,175,0.25);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          box-shadow: 2px 0 24px rgba(0,0,0,0.03);
        }

        .rg-sidebar-top {
          padding: 32px 20px 18px;
          text-align: center;
          border-bottom: 1px solid rgba(200,190,175,0.15);
          position: relative;
        }

        .rg-sidebar-top::after {
          content: "☁";
          position: absolute;
          bottom: -11px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          opacity: 0.4;
        }

        .rg-sidebar-back {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #b0a597;
          text-decoration: none;
          letter-spacing: 1px;
          margin-bottom: 14px;
          transition: color 0.2s;
        }
        .rg-sidebar-back:hover { color: #5BA4CF; }

        .rg-sidebar-title {
          font-size: 19px;
          font-weight: 600;
          color: #5a5a5a;
          letter-spacing: 4px;
          margin: 0 0 4px;
        }

        .rg-sidebar-subtitle {
          font-size: 10px;
          color: #c4b9ab;
          letter-spacing: 2px;
          margin: 0;
        }

        /* 导航链接 */
        .rg-sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 24px 14px;
          gap: 6px;
        }

        .rg-sidebar-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-radius: 14px;
          color: #9e958a;
          font-size: 13px;
          letter-spacing: 1px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }

        .rg-sidebar-link:hover {
          color: #5BA4CF;
          background: rgba(91,164,207,0.06);
          transform: translateX(3px);
        }

        .rg-sidebar-link.active {
          color: #fff;
          background: linear-gradient(135deg, #87CEEB, #5BA4CF);
          font-weight: 500;
          box-shadow: 0 4px 14px rgba(91,164,207,0.2);
        }

        .rg-sidebar-link.active:hover { transform: translateX(0); }

        .rg-sidebar-link__icon {
          width: 22px;
          text-align: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        /* 侧边栏底部 */
        .rg-sidebar-footer {
          padding: 14px 20px;
          text-align: center;
          border-top: 1px solid rgba(200,190,175,0.12);
          font-size: 10px;
          color: #ccc3b6;
          letter-spacing: 1px;
        }

        /* ===== 主内容区 ===== */
        .rg-content {
          margin-left: 200px;
          flex: 1;
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }

        /* ===== 响应式 ===== */
        @media (max-width: 768px) {
          .rg-sidebar { width: 60px; }
          .rg-sidebar-top { padding: 20px 8px; }
          .rg-sidebar-back span,
          .rg-sidebar-title,
          .rg-sidebar-subtitle,
          .rg-sidebar-link span:not(.rg-sidebar-link__icon),
          .rg-sidebar-footer { display: none; }
          .rg-sidebar-back { font-size: 14px; margin-bottom: 8px; }
          .rg-sidebar-nav { padding: 16px 8px; }
          .rg-sidebar-link { justify-content: center; padding: 10px 0; }
          .rg-content { margin-left: 60px; }
        }
      `}</style>

      {/* ===== 侧边栏 ===== */}
      <aside className="rg-sidebar">
        <div className="rg-sidebar-top">
          <Link to="/toolbox?mode=full" className="rg-sidebar-back">
            ← <span>返回作品集</span>
          </Link>
          <h1 className="rg-sidebar-title">漫游指南</h1>
          <p className="rg-sidebar-subtitle">丙午年 · 启程</p>
        </div>

        <nav className="rg-sidebar-nav">
          <NavLink to="map" className="rg-sidebar-link" end>
            <span className="rg-sidebar-link__icon">🗺</span>
            <span>足迹地图</span>
          </NavLink>
          <NavLink to="cities" className="rg-sidebar-link">
            <span className="rg-sidebar-link__icon">🏛</span>
            <span>城市记忆</span>
          </NavLink>
          <NavLink to="plan" className="rg-sidebar-link">
            <span className="rg-sidebar-link__icon">🧭</span>
            <span>漫游向导</span>
          </NavLink>
          <NavLink to="about" className="rg-sidebar-link">
            <span className="rg-sidebar-link__icon">☁️</span>
            <span>关于它</span>
          </NavLink>
        </nav>

        <div className="rg-sidebar-footer">
          慢慢走，好好看
        </div>
      </aside>

      {/* ===== 主内容 ===== */}
      <main className="rg-content">
        <Outlet />
      </main>
    </div>
  );
}