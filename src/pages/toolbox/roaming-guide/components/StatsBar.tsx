interface StatsBarProps {
  provinces: number;
  cities: number;
  days: number;
}

export default function StatsBar({ provinces, cities, days }: StatsBarProps) {
  return (
    <>
      <style>{`
        /* ===== 木质告示牌统计 ===== */
        .rg-stats-bar {
          position: relative;
          max-width: 480px;
          margin: 28px auto 0;
          padding: 20px 32px;
          background: linear-gradient(180deg, #8B6914 0%, #7A5C10 50%, #6B4F0C 100%);
          border-radius: 8px;
          box-shadow:
            0 6px 20px -4px rgba(60,40,10,0.35),
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -2px 0 rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          animation: rg-sign-appear 1s 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .rg-stats-bar::before {
          content: "";
          position: absolute;
          top: -6px;
          left: 24px;
          width: 8px;
          height: 14px;
          background: linear-gradient(180deg, #A08060, #6B5344);
          border-radius: 2px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .rg-stats-bar::after {
          content: "";
          position: absolute;
          top: -6px;
          right: 24px;
          width: 8px;
          height: 14px;
          background: linear-gradient(180deg, #A08060, #6B5344);
          border-radius: 2px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        @keyframes rg-sign-appear {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* 左侧文字区 */
        .rg-stats-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .rg-stats-label {
          font-family: var(--rg-font-hand, var(--font-hand));
          font-size: 20px;
          color: #F5E6D0;
          letter-spacing: 0.1em;
          text-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }
        .rg-stats-detail {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .rg-stats-paper-tag {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-family: var(--rg-font-serif);
          font-size: var(--rg-text-caption, 13px);
          color: var(--rg-ink-light, #8B7D6B);
          background: #F5F0E6;
          padding: 2px 10px;
          border-radius: 3px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.15);
          transform: rotate(-0.5deg);
        }
        .rg-stats-paper-tag + .rg-stats-paper-tag {
          transform: rotate(0.5deg);
          margin-left: 2px;
        }
        .rg-stats-paper-tag .rg-stats-num {
          font-weight: var(--rg-weight-title, 600);
          color: var(--rg-primary, #4A8B6F);
          font-family: var(--rg-font-hand, var(--font-hand));
          font-size: var(--rg-text-h2, 18px);
        }

        /* 分隔线 */
        .rg-stats-divider {
          width: 1px;
          height: 36px;
          background: rgba(255,255,255,0.15);
          flex-shrink: 0;
        }

        /* ===== 地球小伙伴 ===== */
        .rg-earth-pal {
          width: 56px;
          height: 56px;
          position: relative;
          animation: rg-earth-float 3s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes rg-earth-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(3deg); }
        }
        .rg-earth-pal-face {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: linear-gradient(145deg, #4A90D9 0%, #2E8B57 40%, #4A90D9 100%);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(0,0,0,0.15);
          overflow: hidden;
        }
        .rg-earth-pal-face::before {
          content: "";
          position: absolute;
          top: 20%;
          left: 15%;
          width: 70%;
          height: 40%;
          background: linear-gradient(180deg, rgba(255,255,255,0.15), transparent);
          border-radius: 50%;
        }
        .rg-earth-pal-eyes {
          position: absolute;
          top: 38%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
        }
        .rg-earth-pal-eye {
          width: 7px;
          height: 9px;
          background: #2C3E50;
          border-radius: 50%;
          animation: rg-earth-blink 4s ease-in-out infinite;
        }
        @keyframes rg-earth-blink {
          0%, 96%, 100% { transform: scaleY(1); }
          98% { transform: scaleY(0.1); }
        }
        .rg-earth-pal-smile {
          position: absolute;
          bottom: 28%;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 6px;
          border-bottom: 2px solid #2C3E50;
          border-radius: 0 0 14px 14px;
        }
        .rg-earth-pal-blush {
          position: absolute;
          top: 48%;
          width: 8px;
          height: 5px;
          background: rgba(255,150,150,0.35);
          border-radius: 50%;
        }
        .rg-earth-pal-blush.left { left: 18%; }
        .rg-earth-pal-blush.right { right: 18%; }

        @media (max-width: 640px) {
          .rg-stats-bar {
            padding: 16px 20px;
            margin: 20px auto 0;
          }
          .rg-stats-label { font-size: 16px; }
          .rg-stats-paper-tag { font-size: 12px; padding: 2px 8px; }
          .rg-earth-pal { width: 44px; height: 44px; }
        }
      `}</style>
      <div className="rg-stats-bar">
        <div className="rg-stats-text">
          <span className="rg-stats-label">已探索</span>
          <div className="rg-stats-detail">
            <span className="rg-stats-paper-tag">
              <span className="rg-stats-num">{provinces}</span> 省
            </span>
            <span className="rg-stats-paper-tag">
              <span className="rg-stats-num">{cities}</span> 城
            </span>
            <span className="rg-stats-paper-tag">
              <span className="rg-stats-num">{days}</span> 天
            </span>
          </div>
        </div>
        <div className="rg-stats-divider" />
        <div className="rg-earth-pal">
          <div className="rg-earth-pal-face">
            <div className="rg-earth-pal-eyes">
              <div className="rg-earth-pal-eye" />
              <div className="rg-earth-pal-eye" />
            </div>
            <div className="rg-earth-pal-smile" />
            <div className="rg-earth-pal-blush left" />
            <div className="rg-earth-pal-blush right" />
          </div>
        </div>
      </div>
    </>
  );
}