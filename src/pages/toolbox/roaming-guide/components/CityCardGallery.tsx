import { motion } from "framer-motion";

/* ============================================================
   数据类型（与主页面保持一致）
   ============================================================ */
interface Spot {
  name: string;
  rating: number;
}
interface Eat {
  name: string;
  price: string;
  signature?: string;
}
interface City {
  id: number;
  name: string;
  province: string;
  slogan: string;
  imageUrl: string;
  days: number;
  play: Spot[];
  eat: Eat[];
  stay: string;
  tips: string;
  /** 是否为 AI 计划（新增字段） */
  isAIPlan?: boolean;
  /** 天气标签（新增字段） */
  weather?: string[];
  /** 经纬度（新增字段） */
  lat?: number;
  lng?: number;
  /** 探索次数（新增字段） */
  exploreCount?: number;
}

export interface CityCardGalleryProps {
  cities: City[];
  selectedCity: City | null;
  onSelect: (city: City) => void;
  onAdd: () => void;
}

export default function CityCardGallery({
  cities,
  selectedCity,
  onSelect,
  onAdd,
}: CityCardGalleryProps) {
  return (
    <section className="rg-card-section" id="rg-cards">
      <div
        className="rg-card-section-head"
        style={{ justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span className="rg-stamp">攻略</span>
          <h2 className="rg-card-section-title">城市记忆</h2>
        </div>
      </div>

      <div className="rg-cards-scroll">
        <div className="rg-cards-track">
          {cities.map((c, i) => {
            const avgRating =
              c.play.length > 0
                ? Math.round(
                    c.play.reduce((s, x) => s + x.rating, 0) / c.play.length
                  )
                : 3;
            return (
              <motion.div
                key={c.id}
                className={`rg-city-card ${selectedCity?.id === c.id ? "selected" : ""}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <button className="rg-card-main" onClick={() => onSelect(c)}>
                  <div className="rg-card-img-wrap">
                    <img
                      src={
                        c.imageUrl ||
                        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop"
                      }
                      alt={c.name}
                      loading="lazy"
                    />
                    <div className="rg-card-tape" />
                    <span className="rg-card-days">{c.days}天</span>
                  </div>
                  <div className="rg-card-body">
                    <h3 className="rg-card-name">{c.name}</h3>
                    <p className="rg-card-slogan">{c.slogan}</p>
                    <div className="rg-card-meta">
                      <div className="rg-card-mood">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span
                            key={idx}
                            className={
                              idx < avgRating
                                ? "rg-card-mood-star"
                                : "rg-card-mood-star empty"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="rg-card-province">{c.province}</span>
                    </div>
                  </div>

                  {/* 手动 / AI 标签 */}
                  <div className="rg-card-tag-row">
                    {c.isAIPlan ? (
                      <span className="rg-card-tag ai">AI计划</span>
                    ) : (
                      <span className="rg-card-tag manual">
                        <span className="rg-card-tag-dot" />
                        手动记录
                      </span>
                    )}
                    {c.exploreCount && c.exploreCount > 0 && (
                      <span className="rg-card-explore">
                        探索 {c.exploreCount} 次
                      </span>
                    )}
                  </div>

                  <span className="rg-card-cta">查看攻略 →</span>
                </button>
              </motion.div>
            );
          })}

          {/* 添加城市空白卡片 */}
          <motion.button
            className="rg-city-card rg-add-card"
            onClick={onAdd}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: cities.length * 0.08 }}
          >
            <div className="rg-add-card-inner">
              <span className="rg-add-card-icon">+</span>
              <span className="rg-add-card-text">添加城市</span>
            </div>
          </motion.button>
        </div>
      </div>

      <style>{`
        /* ===== CityCardGallery - 城市记忆卡片横向滚动画廊 ===== */

        .rg-card-section {
          max-width: 960px;
          margin: 0 auto;
          padding: 48px 24px;
        }
        .rg-card-section-head {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .rg-stamp {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 3px 14px;
          border: 2px solid #C8924A;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 700;
          color: #C8924A;
          font-family: "Ma Shan Zheng", "ZCOOL XiaoWei", "STKaiti", cursive;
          transform: rotate(-3deg);
          opacity: 0.85;
          letter-spacing: 0.06em;
        }
        .rg-card-section-title {
          font-family: "Ma Shan Zheng", "ZCOOL XiaoWei", "STKaiti", cursive;
          font-size: var(--rg-text-h2, 30px);
          font-weight: var(--rg-weight-title, 600);
          color: var(--rg-ink, #3D2B1F);
          margin: 0;
          letter-spacing: var(--rg-tracking-heading, 0.15em);
        }

        /* 横向滚动容器 */
        .rg-cards-scroll {
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: #C8924A transparent;
          -webkit-overflow-scrolling: touch;
        }
        .rg-cards-scroll::-webkit-scrollbar { height: 6px; }
        .rg-cards-scroll::-webkit-scrollbar-thumb {
          background: rgba(200, 146, 74, 0.35);
          border-radius: 3px;
        }
        .rg-cards-track {
          display: flex;
          gap: 15px;
          padding: 12px 4px 28px;
          scroll-snap-type: x mandatory;
        }

        /* 拍立得风格卡片 */
        .rg-city-card {
          position: relative;
          flex-shrink: 0;
          width: 260px;
          scroll-snap-align: start;
          background: #fff;
          padding: 12px 12px 16px;
          box-shadow: 0 8px 24px -6px rgba(60, 40, 20, 0.18);
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.3s ease;
          animation: rg-card-fly-in 0.7s cubic-bezier(0.4, 0, 0.2, 1) both;
          /* 拍立得微微旋转 */
          transform: rotate(-1deg);
        }
        .rg-city-card:nth-child(even) {
          transform: rotate(1.5deg);
          animation-delay: 0.1s;
        }
        .rg-city-card:nth-child(3n) {
          animation-delay: 0.2s;
        }
        @keyframes rg-card-fly-in {
          from {
            opacity: 0;
            transform: translateY(30px) rotate(-4deg) scale(0.92);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotate(-1deg) scale(1);
          }
        }
        .rg-city-card:hover {
          transform: rotate(0deg) translateY(-6px) scale(1.02);
          box-shadow: 0 16px 40px -8px rgba(60, 40, 20, 0.28);
          z-index: 2;
        }
        .rg-city-card:nth-child(even):hover {
          transform: rotate(0deg) translateY(-6px) scale(1.02);
        }
        .rg-city-card.selected {
          outline: 2px solid #C8924A;
          outline-offset: 2px;
        }
        @media (max-width: 640px) {
          .rg-city-card { width: 78vw; }
        }

        /* 卡片主体按钮 */
        .rg-card-main {
          width: 100%;
          border: none;
          background: none;
          padding: 0;
          text-align: left;
          display: block;
          cursor: pointer;
        }

        /* 撕纸边缘效果 */
        .rg-card-img-wrap {
          position: relative;
          height: 170px;
          overflow: hidden;
          background: #f0ebe0;
          clip-path: polygon(
            0% 2%, 3% 0%, 7% 1%, 12% 0%, 18% 2%, 25% 0%, 32% 1%, 40% 0%,
            48% 2%, 55% 0%, 62% 1%, 70% 0%, 78% 2%, 85% 0%, 92% 1%, 100% 0%,
            100% 98%, 96% 100%, 90% 99%, 83% 100%, 75% 98%, 68% 100%, 60% 99%,
            52% 100%, 45% 98%, 38% 100%, 30% 99%, 22% 100%, 15% 98%, 8% 100%, 0% 99%
          );
        }
        .rg-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: sepia(0.08) saturate(0.92) contrast(1.02);
        }

        /* 胶带装饰 */
        .rg-card-tape {
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%) rotate(-3deg);
          width: 64px;
          height: 20px;
          background: rgba(255, 235, 180, 0.65);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
          border: 1px dashed rgba(200, 170, 100, 0.3);
        }
        .rg-card-days {
          position: absolute;
          bottom: 10px;
          right: 10px;
          padding: 3px 10px;
          font-size: 11px;
          color: var(--rg-primary, #4A8B6F);
          background: var(--rg-primary-faint, rgba(74,139,111,0.1));
          font-family: "Ma Shan Zheng", "ZCOOL XiaoWei", "STKaiti", cursive;
          letter-spacing: 0.06em;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        /* 卡片文字区域 */
        .rg-card-body {
          padding: 14px 4px 6px;
        }
        .rg-card-name {
          font-family: "Ma Shan Zheng", "ZCOOL XiaoWei", "STKaiti", cursive;
          font-size: var(--rg-text-h3, 18px);
          font-weight: var(--rg-weight-title, 600);
          color: var(--rg-ink, #3D2B1F);
          margin: 0 0 4px;
          letter-spacing: 0.06em;
        }
        .rg-card-slogan {
          font-family: "Noto Serif SC", Georgia, "STSong", serif;
          font-size: var(--rg-text-caption, 13px);
          color: var(--rg-ink-light, #8B7D6B);
          margin: 0 0 10px;
          font-style: italic;
          line-height: var(--rg-leading-body, 1.85);
        }
        .rg-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px dashed #D8D0C0;
          padding-top: 8px;
          margin-top: 6px;
        }
        .rg-card-mood {
          display: flex;
          gap: 2px;
          font-size: 13px;
        }
        .rg-card-mood-star { color: #D4A85A; }
        .rg-card-mood-star.empty { color: #DDD4C6; }
        .rg-card-province {
          font-size: 10px;
          color: #C8924A;
          letter-spacing: 0.12em;
          font-family: "Noto Serif SC", Georgia, serif;
        }

        /* 手动 / AI 标签行 */
        .rg-card-tag-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 4px 0;
        }
        .rg-card-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          letter-spacing: 0.04em;
        }
        .rg-card-tag.manual {
          color: #8B7D6B;
          font-family: "Noto Serif SC", Georgia, serif;
        }
        .rg-card-tag-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--rg-primary, #4A8B6F);
          display: inline-block;
        }
        .rg-card-tag.ai {
          color: var(--rg-accent-dark, #B06A30);
          font-family: "Ma Shan Zheng", "ZCOOL XiaoWei", "STKaiti", cursive;
          padding: 2px 8px;
          border: 1px solid rgba(212, 136, 74, 0.4);
          border-radius: 4px;
          background: var(--rg-accent-faint, rgba(212,136,74,0.1));
        }
        .rg-card-explore {
          font-size: var(--rg-text-small, 11px);
          color: var(--rg-ink-light, #8B7D6B);
          font-family: "Noto Serif SC", Georgia, serif;
          margin-left: auto;
        }

        /* 查看攻略 */
        .rg-card-cta {
          display: block;
          padding: 10px 4px 4px;
          font-size: 12px;
          color: #2E8B57;
          font-weight: 600;
          letter-spacing: 0.04em;
          font-family: "Noto Serif SC", Georgia, serif;
          transition: color 0.2s ease;
        }
        .rg-card-cta:hover { color: #1E6B3F; }

        /* 添加城市空白卡片 */
        .rg-add-card {
          border: 2px dashed #D8D0C0;
          background: rgba(245, 240, 230, 0.5);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 260px;
        }
        .rg-add-card:hover {
          border-color: var(--rg-primary, #4A8B6F);
          background: rgba(74, 139, 111, 0.04);
          transform: rotate(0deg) translateY(-4px) scale(1.02);
        }
        .rg-add-card-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .rg-add-card-icon {
          font-size: 32px;
          color: var(--rg-primary, #4A8B6F);
          line-height: 1;
          font-weight: 300;
        }
        .rg-add-card-text {
          font-size: 13px;
          color: #8B7D6B;
          font-family: "Ma Shan Zheng", "ZCOOL XiaoWei", "STKaiti", cursive;
          letter-spacing: 0.06em;
        }
      `}</style>
    </section>
  );
}
