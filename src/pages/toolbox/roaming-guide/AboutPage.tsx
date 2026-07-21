export default function AboutPage() {
  return (
    <div className="rg-about-page">
      <style>{`
        .rg-about-page {
          padding: 48px 40px;
          font-family: 'Noto Sans SC', 'PingFang SC', system-ui, sans-serif;
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
          background: linear-gradient(135deg, rgba(135,206,235,0.12), rgba(176,212,232,0.08));
          border: 1px solid rgba(135,206,235,0.2);
          border-radius: 20px;
          font-size: 12px;
          color: #5BA4CF;
          letter-spacing: 1px;
          margin-bottom: 24px;
          animation: rg-float-soft 4s ease-in-out infinite;
        }

        @keyframes rg-float-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .rg-about-page__title {
          font-size: 28px;
          font-weight: 700;
          color: #4a5568;
          letter-spacing: 3px;
          margin: 0 0 16px;
        }

        .rg-about-page__title em {
          font-style: normal;
          background: linear-gradient(135deg, #5BA4CF, #87CEEB);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .rg-about-page__intro {
          font-size: 14px;
          line-height: 2;
          color: #7a8a9a;
          margin: 0 0 36px;
        }

        /* 痛点区块 */
        .rg-about-page__section {
          margin-bottom: 32px;
          padding: 28px;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(135,206,235,0.18);
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(91,164,207,0.05);
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
          border-radius: 20px 20px 0 0;
        }

        .rg-about-page__section-icon {
          font-size: 28px;
          margin-bottom: 12px;
          display: block;
          filter: drop-shadow(0 2px 4px rgba(91,164,207,0.12));
        }

        .rg-about-page__section-title {
          font-size: 15px;
          font-weight: 600;
          color: #4a5568;
          margin: 0 0 10px;
          letter-spacing: 1px;
          position: relative;
          z-index: 1;
        }

        .rg-about-page__section-text {
          font-size: 13px;
          line-height: 1.9;
          color: #8a9aaa;
          margin: 0;
          position: relative;
          z-index: 1;
        }

        /* 欢迎语 */
        .rg-about-page__welcome {
          text-align: center;
          padding: 36px 28px;
          background: linear-gradient(135deg, rgba(135,206,235,0.08), rgba(176,212,232,0.05));
          border: 1px solid rgba(135,206,235,0.15);
          border-radius: 20px;
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
          background: radial-gradient(circle, rgba(135,206,235,0.1) 0%, transparent 70%);
          pointer-events: none;
          animation: rg-glow-breathe 6s ease-in-out infinite;
        }

        @keyframes rg-glow-breathe {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        .rg-about-page__welcome-icon {
          font-size: 36px;
          margin-bottom: 12px;
          display: block;
          filter: drop-shadow(0 2px 6px rgba(91,164,207,0.15));
          animation: rg-float-soft 3s ease-in-out infinite;
        }

        .rg-about-page__welcome-text {
          font-size: 15px;
          font-weight: 500;
          color: #5BA4CF;
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
