export default function AboutPage() {
  return (
    <div className="rg-about-page">
      <style>{`
        .rg-about-page {
          padding: 56px 48px;
          font-family: 'PingFang SC', system-ui, sans-serif;
        }

        .rg-about-page__inner {
          max-width: 640px;
          margin: 0 auto;
        }

        .rg-about-page__badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 18px;
          background: rgba(244,211,94,0.1);
          border: 1px solid rgba(244,211,94,0.2);
          border-radius: 20px;
          font-size: 12px;
          color: #F4D35E;
          letter-spacing: 1px;
          margin-bottom: 24px;
          animation: rg-breathe-subtle 4s ease-in-out infinite;
        }

        /* 极微妙的 opacity 呼吸动画，替代浮动 */
        @keyframes rg-breathe-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }

        .rg-about-page__title {
          font-size: 30px;
          font-weight: 700;
          color: #2C3E50;
          letter-spacing: 3px;
          margin: 0 0 16px;
          font-family: 'Source Han Serif SC', 'Noto Serif SC', serif;
        }

        .rg-about-page__title em {
          font-style: normal;
          background: linear-gradient(135deg, #F4D35E, #7BA89E);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .rg-about-page__intro {
          font-size: 14px;
          line-height: 2;
          color: #7A7A7A;
          margin: 0 0 36px;
        }

        /* section 卡片 */
        .rg-about-page__section {
          margin-bottom: 40px;
          padding: 28px;
          background: #fff;
          border: 1px solid rgba(90,74,58,0.06);
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(90,74,58,0.08);
          position: relative;
          overflow: hidden;
        }

        .rg-about-page__section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 40%;
          background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%);
          pointer-events: none;
          border-radius: 16px 16px 0 0;
        }

        .rg-about-page__section-icon {
          font-size: 28px;
          margin-bottom: 12px;
          display: block;
          filter: drop-shadow(0 2px 4px rgba(90,74,58,0.06));
        }

        .rg-about-page__section-title {
          font-size: 15px;
          font-weight: 600;
          color: #2C3E50;
          margin: 0 0 10px;
          letter-spacing: 1px;
          position: relative;
          z-index: 1;
          font-family: 'Source Han Serif SC', 'Noto Serif SC', serif;
        }

        .rg-about-page__section-text {
          font-size: 13px;
          line-height: 1.9;
          color: #7A7A7A;
          margin: 0;
          position: relative;
          z-index: 1;
        }

        /* 欢迎语区块 */
        .rg-about-page__welcome {
          text-align: center;
          padding: 36px 28px;
          background: linear-gradient(135deg, rgba(244,211,94,0.06), rgba(123,168,158,0.04));
          border: 1px solid rgba(90,74,58,0.06);
          border-radius: 16px;
          position: relative;
          overflow: hidden;
        }

        .rg-about-page__welcome::after {
          content: "";
          position: absolute;
          bottom: -30px;
          right: -30px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(244,211,94,0.08) 0%, transparent 70%);
          pointer-events: none;
          animation: rg-breathe-subtle 6s ease-in-out infinite;
        }

        .rg-about-page__welcome-icon {
          font-size: 36px;
          margin-bottom: 12px;
          display: block;
          filter: drop-shadow(0 2px 6px rgba(90,74,58,0.08));
        }

        .rg-about-page__welcome-text {
          font-size: 15px;
          font-weight: 500;
          color: #7BA89E;
          line-height: 2;
          margin: 0;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .rg-about-page { padding: 28px 20px; }
          .rg-about-page__title { font-size: 22px; }
        }
      `}</style>

      <div className="rg-about-page__inner">
        <div className="rg-about-page__badge">✨ AI 旅行向导</div>
        <h1 className="rg-about-page__title">
          <em>慢游去</em>，让旅途会讲故事
        </h1>
        <p className="rg-about-page__intro">
          每一次出发，都值得被温柔记录。这里是你的专属旅行手帐——用 AI 推荐城市，用地图点亮足迹，用攻略珍藏回忆。
        </p>

        <div className="rg-about-page__section">
          <span className="rg-about-page__section-icon">🤔</span>
          <h2 className="rg-about-page__section-title">去哪儿好</h2>
          <p className="rg-about-page__section-text">
            不知道下一站该去哪？AI 根据你的季节偏好、预算、节奏、兴趣和出行人数，推荐风格各异的宝藏城市，附赠吃喝住玩全攻略。
          </p>
        </div>

        <div className="rg-about-page__section">
          <span className="rg-about-page__section-icon">🗺️</span>
          <h2 className="rg-about-page__section-title">点亮地图</h2>
          <p className="rg-about-page__section-text">
            每去一座城，就在地图上点亮一颗星。想去的地方先标记，去了之后换标签，看着足迹一颗一颗铺满整张地图。
          </p>
        </div>

        <div className="rg-about-page__section">
          <span className="rg-about-page__section-icon">📒</span>
          <h2 className="rg-about-page__section-title">珍藏攻略</h2>
          <p className="rg-about-page__section-text">
            城市记忆卡片记录每座城的游玩亮点、必吃美食、住宿推荐和交通贴士，随时随地翻阅，让旅途不会错过任何精彩。
          </p>
        </div>

        <div className="rg-about-page__welcome">
          <span className="rg-about-page__welcome-icon">☁️</span>
          <p className="rg-about-page__welcome-text">
            世界是一张未折叠的地图<br />
            慢慢走，好好看 🌿
          </p>
        </div>
      </div>
    </div>
  );
}
