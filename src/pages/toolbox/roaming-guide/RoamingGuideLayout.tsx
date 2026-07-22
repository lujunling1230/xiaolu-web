import { Outlet, NavLink, Link } from "react-router-dom";

export default function RoamingGuideLayout() {
  return (
    <div className="rg-layout">
      <style>{`
        /* ===== 全局 ===== */
        .rg-layout {
          min-height: 100vh;
          display: flex;
          font-family: 'Source Han Serif SC', 'Noto Serif SC', 'PingFang SC', serif;
          background: #F5F3EE;
          position: relative;
          color: #2C3E50;
        }

        /* 背景装饰 - 黄昏雨后多层渐变 */
        .rg-layout::before {
          content: "";
          position: fixed;
          inset: 0;
          background:
            /* 左上角暖橘光 */
            radial-gradient(ellipse 70% 60% at 5% 5%, rgba(244,211,94,0.08) 0%, transparent 55%),
            /* 右下角雾蓝 */
            radial-gradient(ellipse 60% 50% at 92% 92%, rgba(123,168,158,0.07) 0%, transparent 50%),
            /* 中间偏上淡薰衣草 */
            radial-gradient(ellipse 40% 30% at 70% 15%, rgba(180,160,200,0.04) 0%, transparent 50%),
            /* 中间偏下淡薄荷 */
            radial-gradient(ellipse 45% 35% at 25% 75%, rgba(123,168,158,0.05) 0%, transparent 50%),
            /* 底部暖黄微光 */
            radial-gradient(ellipse 80% 30% at 50% 100%, rgba(244,211,94,0.04) 0%, transparent 45%);
          pointer-events: none;
          z-index: 0;
        }

        /* 胶片颗粒感 noise 纹理覆盖 */
        .rg-layout::after {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 256px 256px;
        }

        /* ===== 侧边栏 ===== */
        .rg-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 200px;
          z-index: 100;
          background: rgba(245,243,238,0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-right: 1px solid rgba(90,74,58,0.08);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          box-shadow: 2px 0 24px rgba(90,74,58,0.04);
        }

        .rg-sidebar-top {
          padding: 32px 20px 18px;
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
          transition: color 0.2s;
        }
        .rg-sidebar-back:hover { color: #7BA89E; }

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
          gap: 6px;
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

        .rg-sidebar-link:hover::after {
          width: 16px;
        }

        .rg-sidebar-link:hover {
          color: #5A4A3A;
          background: rgba(244,211,94,0.12);
          transform: translateX(3px);
        }

        .rg-sidebar-link.active {
          color: #5A4A3A;
          background: #F4D35E;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(90,74,58,0.08);
        }

        .rg-sidebar-link.active:hover { transform: translateX(0); }

        .rg-sidebar-link.active::after { display: none; }

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
          border-top: 1px solid rgba(90,74,58,0.08);
          font-size: 10px;
          color: #B0A898;
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
          .rg-sidebar-link::after { left: 50%; transform: translateX(-50%); }
          .rg-content { margin-left: 60px; }
        }
      `}</style>

      {/* ===== 侧边栏 ===== */}
      <aside className="rg-sidebar">
        <div className="rg-sidebar-top">
          <Link to="https://www.xiaoluweb.com/mickey" className="rg-sidebar-back">
            ← <span>回到作品集</span>
          </Link>
          <h1 className="rg-sidebar-title">漫游指南</h1>
          <p className="rg-sidebar-subtitle">丙午年 · 启程</p>
        </div>

        <nav className="rg-sidebar-nav">
          <NavLink to="map" className="rg-sidebar-link" end>
            <span className="rg-sidebar-link__icon">🗺</span>
            <span>足迹地图</span>
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