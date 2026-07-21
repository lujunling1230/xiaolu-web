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
        .rg-sidebar-back:hover {
          color: #6b8f71;
        }

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

        .rg-sidebar-link.active:hover {
          transform: translateX(0);
        }

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

        /* ===== "关于它" Hero 模块 ===== */
        .rg-hero {
          position: relative;
          padding: 52px 40px 44px;
          overflow: hidden;
        }

        /* 毛玻璃卡片 */
        .rg-hero-inner {
          max-width: 680px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .rg-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(200,190,175,0.2);
          border-radius: 20px;
          font-size: 11px;
          color: #8ec5a0;
          letter-spacing: 1px;
          margin-bottom: 20px;
          animation: rg-badge-float 3s ease-in-out infinite;
        }

        @keyframes rg-badge-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .rg-hero-title {
          font-size: 32px;
          font-weight: 700;
          color: #4a4a4a;
          letter-spacing: 4px;
          margin: 0 0 12px;
          line-height: 1.3;
        }

        .rg-hero-title em {
          font-style: normal;
          background: linear-gradient(135deg, #8ec5a0, #6bb89d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .rg-hero-desc {
          font-size: 14px;
          line-height: 2;
          color: #8a8a8a;
          margin: 0 0 28px;
        }

        /* 胶囊卡片网格 */
        .rg-hero-cards {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .rg-hero-card {
          flex: 1;
          min-width: 140px;
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(200,190,175,0.15);
          border-radius: 20px;
          padding: 20px 18px;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: default;
        }

        .rg-hero-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 12px 32px rgba(0,0,0,0.06);
          border-color: rgba(142,197,160,0.3);
        }

        .rg-hero-card__icon {
          font-size: 28px;
          margin-bottom: 10px;
          display: block;
          animation: rg-icon-bounce 2.5s ease-in-out infinite;
        }

        .rg-hero-card:nth-child(2) .rg-hero-card__icon { animation-delay: 0.3s; }
        .rg-hero-card:nth-child(3) .rg-hero-card__icon { animation-delay: 0.6s; }

        @keyframes rg-icon-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-6px) scale(1.08); }
          60% { transform: translateY(0) scale(0.97); }
        }

        .rg-hero-card__title {
          font-size: 13px;
          font-weight: 600;
          color: #5a5a5a;
          margin: 0 0 6px;
          letter-spacing: 1px;
        }

        .rg-hero-card__text {
          font-size: 12px;
          color: #a0a0a0;
          line-height: 1.7;
          margin: 0;
        }

        /* 浮动装饰云朵 */
        .rg-hero-cloud {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(4px);
          pointer-events: none;
        }

        .rg-hero-cloud-1 {
          width: 80px;
          height: 50px;
          top: 20px;
          right: 10%;
          animation: rg-cloud-drift 8s ease-in-out infinite;
        }

        .rg-hero-cloud-2 {
          width: 55px;
          height: 35px;
          top: 60px;
          right: 6%;
          animation: rg-cloud-drift 10s ease-in-out infinite reverse;
          opacity: 0.6;
        }

        .rg-hero-cloud-3 {
          width: 40px;
          height: 26px;
          bottom: 30px;
          left: 8%;
          animation: rg-cloud-drift 12s ease-in-out infinite;
          opacity: 0.4;
        }

        @keyframes rg-cloud-drift {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(12px) translateY(-6px); }
          50% { transform: translateX(-8px) translateY(-10px); }
          75% { transform: translateX(6px) translateY(-4px); }
        }

        /* Hero 与内容分隔 */
        .rg-hero-divider {
          max-width: 680px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .rg-hero-divider__line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(200,190,175,0.25), transparent);
        }

        /* ===== 响应式 ===== */
        @media (max-width: 768px) {
          .rg-sidebar {
            width: 60px;
          }
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

          .rg-hero { padding: 32px 20px 28px; }
          .rg-hero-title { font-size: 24px; }
          .rg-hero-cards { flex-direction: column; }
          .rg-hero-card { min-width: auto; }
          .rg-hero-divider { padding: 0 20px; }
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
          慢慢走，好好看
        </div>
      </aside>

      {/* ===== 主内容 ===== */}
      <main className="rg-content">
        {/* "关于它" Hero 模块 */}
        <section className="rg-hero">
          <div className="rg-hero-cloud rg-hero-cloud-1" />
          <div className="rg-hero-cloud rg-hero-cloud-2" />
          <div className="rg-hero-cloud rg-hero-cloud-3" />

          <div className="rg-hero-inner">
            <div className="rg-hero-badge">✨ AI 旅行向导</div>
            <h2 className="rg-hero-title">
              <em>慢游去</em>，让旅途会讲故事
            </h2>
            <p className="rg-hero-desc">
              每一次出发，都值得被温柔记录。<br />
              这里是你的专属旅行手帐——用 AI 推荐城市，用地图点亮足迹，用攻略珍藏回忆。
            </p>

            <div className="rg-hero-cards">
              <div className="rg-hero-card">
                <span className="rg-hero-card__icon">🤔</span>
                <h3 className="rg-hero-card__title">去哪儿好</h3>
                <p className="rg-hero-card__text">不知道下一站？AI 根据你的偏好推荐宝藏城市</p>
              </div>
              <div className="rg-hero-card">
                <span className="rg-hero-card__icon">🗺️</span>
                <h3 className="rg-hero-card__title">点亮地图</h3>
                <p className="rg-hero-card__text">每去一座城，点亮一颗星，看足迹慢慢铺满</p>
              </div>
              <div className="rg-hero-card">
                <span className="rg-hero-card__icon">📒</span>
                <h3 className="rg-hero-card__title">珍藏攻略</h3>
                <p className="rg-hero-card__text">吃喝住玩全攻略，保存到城市记忆随时翻阅</p>
              </div>
            </div>
          </div>
        </section>

        <div className="rg-hero-divider">
          <div className="rg-hero-divider__line" />
        </div>

        {/* 子页面 */}
        <Outlet />
      </main>
    </div>
  );
}