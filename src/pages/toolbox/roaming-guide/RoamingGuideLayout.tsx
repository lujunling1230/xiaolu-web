import { Outlet, NavLink, Link } from "react-router-dom";

export default function RoamingGuideLayout() {
  return (
    <div className="rg-layout">
      <style>{`
        /* ===== 全局 ===== */
        .rg-layout {
          min-height: 100vh;
          display: flex;
          font-family: var(--rg-font-serif, 'Noto Serif SC', serif);
          background: #f3efe6;
          position: relative;
        }

        /* 背景装饰纹理 */
        .rg-layout::before {
          content: "";
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 90% 60% at 10% 20%, rgba(200,184,152,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 70% 50% at 90% 80%, rgba(180,160,130,0.08) 0%, transparent 60%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 40px,
              rgba(200,184,152,0.04) 40px,
              rgba(200,184,152,0.04) 41px
            );
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
          background: linear-gradient(180deg, #f8f6f0 0%, #f0ece0 100%);
          border-right: 1px solid rgba(200,184,152,0.4);
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow-y: auto;
          box-shadow: 2px 0 20px rgba(0,0,0,0.04);
        }

        /* 侧边栏顶部装饰 */
        .rg-sidebar-top {
          padding: 36px 20px 20px;
          text-align: center;
          border-bottom: 1px solid rgba(200,184,152,0.25);
          position: relative;
        }

        .rg-sidebar-top::after {
          content: "✦";
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          color: rgba(200,184,152,0.5);
        }

        .rg-sidebar-back {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #9a8c7a;
          text-decoration: none;
          letter-spacing: 1px;
          margin-bottom: 16px;
          transition: color 0.2s;
        }
        .rg-sidebar-back:hover {
          color: #5c3a21;
        }

        .rg-sidebar-title {
          font-size: 20px;
          font-weight: 600;
          color: #5c3a21;
          letter-spacing: 6px;
          margin: 0 0 4px;
        }

        .rg-sidebar-subtitle {
          font-size: 10px;
          color: #b8a892;
          letter-spacing: 3px;
          margin: 0;
        }

        /* 导航链接 */
        .rg-sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 28px 16px;
          gap: 4px;
        }

        .rg-sidebar-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          color: #8B7D6B;
          font-size: 13px;
          letter-spacing: 1px;
          text-decoration: none;
          transition: all 0.25s ease;
          position: relative;
        }

        .rg-sidebar-link:hover {
          color: #5c3a21;
          background: rgba(92,58,33,0.04);
        }

        .rg-sidebar-link.active {
          color: #5c3a21;
          background: rgba(92,58,33,0.08);
          font-weight: 500;
        }

        .rg-sidebar-link.active::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          border-radius: 0 3px 3px 0;
          background: linear-gradient(180deg, #C4953A, #D4884A);
        }

        .rg-sidebar-link__icon {
          width: 20px;
          text-align: center;
          font-size: 15px;
          flex-shrink: 0;
        }

        /* 侧边栏底部 */
        .rg-sidebar-footer {
          padding: 16px 20px;
          text-align: center;
          border-top: 1px solid rgba(200,184,152,0.2);
          font-size: 10px;
          color: #c8b898;
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

        /* ===== 响应式：窄屏侧边栏收窄 ===== */
        @media (max-width: 768px) {
          .rg-sidebar {
            width: 60px;
          }
          .rg-sidebar-top {
            padding: 20px 8px;
          }
          .rg-sidebar-back span,
          .rg-sidebar-title,
          .rg-sidebar-subtitle,
          .rg-sidebar-link span:not(.rg-sidebar-link__icon),
          .rg-sidebar-footer {
            display: none;
          }
          .rg-sidebar-back {
            font-size: 14px;
            margin-bottom: 8px;
          }
          .rg-sidebar-nav {
            padding: 16px 8px;
          }
          .rg-sidebar-link {
            justify-content: center;
            padding: 10px 0;
          }
          .rg-content {
            margin-left: 60px;
          }
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
        </nav>

        <div className="rg-sidebar-footer">
          世界是一张未折叠的地图
        </div>
      </aside>

      {/* ===== 主内容 ===== */}
      <main className="rg-content">
        <Outlet />
      </main>
    </div>
  );
}