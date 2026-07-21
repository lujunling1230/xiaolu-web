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
        .rg-sidebar-back:hover { color: #6b8f71; }

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
          color: #6b8f71;
          background: rgba(107,143,113,0.06);
          transform: translateX(3px);
        }

        .rg-sidebar-link.active {
          color: #fff;
          background: linear-gradient(135deg, #8ec5a0, #6b8f71);
          font-weight: 500;
          box-shadow: 0 4px 14px rgba(107,143,113,0.25);
        }

        .rg-sidebar-link.active:hover { transform: translateX(0); }

        .rg-sidebar-link__icon {
          width: 22px;
          text-align: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        /* ===== "关于它" 侧边栏模块：天空蓝·玻璃质感·温柔 ===== */
        .rg-about {
          margin: 8px 10px 16px;
          padding: 18px 14px 16px;
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(135,206,235,0.25);
          border-radius: 20px;
          box-shadow:
            0 4px 20px rgba(91,164,207,0.06),
            inset 0 1px 0 rgba(255,255,255,0.6);
          position: relative;
          overflow: hidden;
        }

        /* 玻璃高光 */
        .rg-about::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 40%;
          background: linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%);
          pointer-events: none;
          border-radius: 20px 20px 0 0;
        }

        /* 底部微光 */
        .rg-about::after {
          content: "";
          position: absolute;
          bottom: -20px;
          right: -20px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(135,206,235,0.12) 0%, transparent 70%);
          pointer-events: none;
          animation: rg-glow-breathe 6s ease-in-out infinite;
        }

        @keyframes rg-glow-breathe {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        .rg-about-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          background: linear-gradient(135deg, rgba(135,206,235,0.15), rgba(176,212,232,0.1));
          border: 1px solid rgba(135,206,235,0.2);
          border-radius: 20px;
          font-size: 10px;
          color: #5BA4CF;
          letter-spacing: 1px;
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
        }

        .rg-about-title {
          font-size: 15px;
          font-weight: 600;
          color: #4a5568;
          margin: 0 0 6px;
          letter-spacing: 2px;
          position: relative;
          z-index: 1;
        }

        .rg-about-title em {
          font-style: normal;
          background: linear-gradient(135deg, #5BA4CF, #87CEEB);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .rg-about-desc {
          font-size: 11px;
          line-height: 1.8;
          color: #9CA3AF;
          margin: 0 0 14px;
          position: relative;
          z-index: 1;
        }

        .rg-about-chips {
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: relative;
          z-index: 1;
        }

        .rg-about-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(135,206,235,0.15);
          border-radius: 14px;
          font-size: 11px;
          color: #6B7280;
          transition: all 0.4s ease;
          cursor: default;
          position: relative;
          overflow: hidden;
        }

        .rg-about-chip::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%);
          pointer-events: none;
          border-radius: 14px 14px 0 0;
        }

        .rg-about-chip:hover {
          transform: translateX(3px);
          border-color: rgba(135,206,235,0.35);
          background: rgba(255,255,255,0.75);
          box-shadow: 0 4px 16px rgba(91,164,207,0.08);
        }

        .rg-about-chip__emoji {
          font-size: 16px;
          flex-shrink: 0;
          filter: drop-shadow(0 2px 4px rgba(91,164,207,0.15));
        }

        .rg-about-chip__text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .rg-about-chip__title {
          font-size: 11px;
          font-weight: 600;
          color: #4B5563;
        }

        .rg-about-chip__sub {
          font-size: 10px;
          color: #9CA3AF;
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
          .rg-about,
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

          {/* 关于它 */}
          <div className="rg-about">
            <div className="rg-about-badge">✨ AI 旅行向导</div>
            <h2 className="rg-about-title"><em>慢游去</em></h2>
            <p className="rg-about-desc">
              每一次出发都值得温柔记录。
            </p>
            <div className="rg-about-chips">
              <div className="rg-about-chip">
                <span className="rg-about-chip__emoji">🤔</span>
                <div className="rg-about-chip__text">
                  <span className="rg-about-chip__title">去哪儿好</span>
                  <span className="rg-about-chip__sub">AI 推荐宝藏城市</span>
                </div>
              </div>
              <div className="rg-about-chip">
                <span className="rg-about-chip__emoji">🗺️</span>
                <div className="rg-about-chip__text">
                  <span className="rg-about-chip__title">点亮地图</span>
                  <span className="rg-about-chip__sub">足迹一颗一颗亮</span>
                </div>
              </div>
              <div className="rg-about-chip">
                <span className="rg-about-chip__emoji">📒</span>
                <div className="rg-about-chip__text">
                  <span className="rg-about-chip__title">珍藏攻略</span>
                  <span className="rg-about-chip__sub">吃喝住玩随时看</span>
                </div>
              </div>
            </div>
          </div>
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