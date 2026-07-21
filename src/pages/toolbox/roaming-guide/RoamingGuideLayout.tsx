import { Outlet, NavLink, Link } from "react-router-dom";

export default function RoamingGuideLayout() {

  return (
    <div className="rg-page" style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, var(--rg-paper-deep) 0%, var(--rg-paper) 30%, var(--rg-paper-light) 100%)",
      fontFamily: "var(--rg-font-serif), serif",
    }}>
      {/* 全局布局样式 */}
      <style>{`
        .rg-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(250,248,243,0.92);
          border-bottom: 1px solid var(--rg-ink-border, #C8B898);
          padding: 8px 20px;
          display: flex;
          justify-content: center;
          gap: 8px;
          max-width: 1200px;
          margin: 0 auto;
          flex-wrap: wrap;
          backdrop-filter: none;
        }
        .rg-nav__link {
          background: none;
          border: 1px solid var(--rg-ink-border, #C8B898);
          border-radius: 20px;
          padding: 4px 16px;
          color: var(--rg-ink-light, #8B7D6B);
          font-size: 13px;
          font-family: var(--rg-font-serif, 'Noto Serif SC', serif);
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .rg-nav__link:hover {
          border-color: #8B7355;
          color: #5c3a21;
        }
        .rg-nav__link.active {
          border-color: #5c3a21;
          color: #5c3a21;
          background: rgba(92,58,33,0.06);
        }
        .rg-back-link {
          position: absolute;
          top: 16px;
          left: 20px;
          z-index: 110;
          font-size: 13px;
          font-family: var(--rg-font-serif, 'Noto Serif SC', serif);
          color: #8B7D6B;
          text-decoration: none;
          letter-spacing: 1px;
          transition: color 0.2s;
        }
        .rg-back-link:hover {
          color: #5c3a21;
        }
      `}</style>

      {/* 左上角 - 返回作品集 */}
      <Link to="/toolbox?mode=full" className="rg-back-link">← 返回作品集</Link>

      {/* 标题区域 */}
      <header style={{
        textAlign: "center",
        padding: "40px 20px 28px",
        maxWidth: 600,
        margin: "0 auto",
      }}>
        <h1 style={{
          fontSize: 26,
          fontFamily: "var(--rg-font-serif, 'Noto Serif SC', serif)",
          color: "var(--rg-ink, #5c3a21)",
          fontWeight: 600,
          letterSpacing: "6px",
          margin: "0 0 10px",
        }}>漫游指南</h1>
        <p style={{
          fontSize: 12,
          color: "var(--rg-ink-light, #8B7D6B)",
          letterSpacing: "2px",
          margin: "0 0 20px",
        }}>丙午年 · 启程</p>
        <div style={{
          fontSize: 13,
          lineHeight: 1.8,
          color: "var(--rg-ink, #5c3a21)",
          fontFamily: "var(--rg-font-serif, 'Noto Serif SC', serif)",
          opacity: 0.8,
        }}>
          <p style={{ margin: "0 0 4px" }}>世界是一张未折叠的地图，亦是无数条待踏足的路径。</p>
          <p style={{ margin: 0 }}>每至一城，必察其街巷肌理，尝其市井烟火，录其食宿交通。</p>
        </div>
      </header>

      {/* 导航栏 */}
      <nav className="rg-nav">
        <NavLink to="map" className="rg-nav__link" end>足迹地图</NavLink>
        <NavLink to="cities" className="rg-nav__link">城市记忆</NavLink>
        <NavLink to="plan" className="rg-nav__link">漫游向导</NavLink>
      </nav>

      {/* 子页面 */}
      <Outlet />
    </div>
  );
}
