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
  images: string[];
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
  /** 城市状态：想去 / 已去 */
  status?: "want_to_go" | "visited";
}

export interface CityCardGalleryProps {
  cities: City[];
  selectedCity: City | null;
  onSelect: (city: City) => void;
  onAdd?: () => void;
  onToggleStatus?: (id: number) => void;
  title?: string;
  showAddButton?: boolean;
}

export default function CityCardGallery({
  cities,
  selectedCity,
  onSelect,
  onAdd,
  onToggleStatus,
  title,
  showAddButton = true,
}: CityCardGalleryProps) {
  return (
    <section className="rg-card-section" id="rg-cards">
      {title && (
        <div
          className="rg-card-section-head"
          style={{ justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span className="rg-stamp">攻略</span>
            <h2 className="rg-card-section-title">{title}</h2>
          </div>
        </div>
      )}

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
                initial={{ opacity: 0, y: 24, rotate: 1 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <button className="rg-card-main" onClick={() => onSelect(c)}>
                  <div className="rg-card-img-wrap">
                    <img
                      src={
                        (c.images?.[0]) ||
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

                  {/* 状态标签 + 手动/AI 标签 */}
                  <div className="rg-card-tag-row">
                    {c.status === "want_to_go" ? (
                      <span
                        className="rg-card-status-tag want-to-go"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStatus?.(c.id);
                        }}
                        title="点击切换为已去"
                        role="button"
                        tabIndex={0}
                      >
                        想去
                      </span>
                    ) : (
                      <span
                        className="rg-card-status-tag visited"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStatus?.(c.id);
                        }}
                        title="点击切换为想去"
                        role="button"
                        tabIndex={0}
                      >
                        已去
                      </span>
                    )}
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
          {showAddButton && onAdd && (
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
          )}
        </div>
      </div>

      <style>{`
        /* ===== CityCardGallery - 黄昏雨后温柔漫游卡片 ===== */

        .rg-card-section {
          max-width: 960px;
          margin: 0 auto;
          padding: 48px 24px;
          font-family: 'PingFang SC', system-ui, sans-serif;
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
          border: 2px solid #7BA89E;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 700;
          color: #7BA89E;
          font-family: 'Source Han Serif SC', 'Noto Serif SC', serif;
          transform: rotate(-3deg);
          opacity: 0.85;
          letter-spacing: 0.06em;
        }
        .rg-card-section-title {
          font-family: 'Source Han Serif SC', 'Noto Serif SC', serif;
          font-size: 30px;
          font-weight: 600;
          color: #2C3E50;
          margin: 0;
          letter-spacing: 0.15em;
        }

        /* 横向滚动容器 */
        .rg-cards-scroll {
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: #7BA89E transparent;
          -webkit-overflow-scrolling: touch;
        }
        .rg-cards-scroll::-webkit-scrollbar { height: 6px; }
        .rg-cards-scroll::-webkit-scrollbar-thumb {
          background: rgba(123, 168, 158, 0.35);
          border-radius: 3px;
        }
        .rg-cards-track {
          display: flex;
          gap: 15px;
          padding: 12px 4px 28px;
          scroll-snap-type: x mandatory;
        }

        /* 温柔漫游风格卡片 */
        .rg-city-card {
          position: relative;
          flex-shrink: 0;
          width: 260px;
          scroll-snap-align: start;
          background: #fff;
          padding: 12px 12px 16px;
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(90, 74, 58, 0.08);
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.3s ease;
          animation: rg-card-fly-in 0.7s cubic-bezier(0.4, 0, 0.2, 1) both;
          transform: rotate(0deg);
        }
        .rg-city-card:nth-child(even) {
          animation-delay: 0.1s;
        }
        .rg-city-card:nth-child(3n) {
          animation-delay: 0.2s;
        }
        @keyframes rg-card-fly-in {
          from {
            opacity: 0;
            transform: translateY(24px) rotate(1deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
        }
        .rg-city-card:hover {
          transform: rotate(-0.5deg) translateY(-6px) scale(1.02);
          box-shadow: 0 8px 24px rgba(90, 74, 58, 0.12);
          z-index: 2;
        }
        .rg-city-card:hover .rg-card-img-wrap img {
          transform: scale(1.05);
        }
        .rg-city-card:nth-child(even):hover {
          transform: rotate(-0.5deg) translateY(-6px) scale(1.02);
        }
        .rg-city-card.selected {
          outline: 2px solid #7BA89E;
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

        /* 图片容器 */
        .rg-card-img-wrap {
          position: relative;
          height: 170px;
          overflow: hidden;
          background: #E8ECEF;
          border-radius: 12px 12px 0 0;
        }
        .rg-card-img-wrap::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60%;
          background: linear-gradient(to top, rgba(44,62,80,0.4) 0%, transparent 60%);
          pointer-events: none;
          z-index: 1;
        }
        .rg-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        /* 胶带装饰 */
        .rg-card-tape {
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%) rotate(-3deg);
          width: 64px;
          height: 20px;
          background: rgba(244, 211, 94, 0.35);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
          border: 1px dashed rgba(244, 211, 94, 0.3);
          z-index: 2;
        }
        .rg-card-days {
          position: absolute;
          bottom: 10px;
          right: 10px;
          padding: 3px 10px;
          font-size: 11px;
          color: #9A9A9A;
          background: rgba(245,243,238,0.85);
          font-family: 'PingFang SC', system-ui, sans-serif;
          letter-spacing: 0.06em;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          z-index: 2;
        }

        /* 卡片文字区域 */
        .rg-card-body {
          padding: 14px 4px 6px;
        }
        .rg-card-name {
          font-family: 'Source Han Serif SC', 'Noto Serif SC', serif;
          font-size: 18px;
          font-weight: 600;
          color: #2C3E50;
          margin: 0 0 4px;
          letter-spacing: 0.06em;
        }
        .rg-card-slogan {
          font-family: 'PingFang SC', system-ui, sans-serif;
          font-size: 13px;
          color: #9A9A9A;
          margin: 0 0 10px;
          font-style: italic;
          line-height: 1.85;
        }
        .rg-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px dashed rgba(90,74,58,0.1);
          padding-top: 8px;
          margin-top: 6px;
        }
        .rg-card-mood {
          display: flex;
          gap: 2px;
          font-size: 13px;
        }
        .rg-card-mood-star { color: #F4D35E; }
        .rg-card-mood-star.empty { color: #E8ECEF; }
        .rg-card-province {
          font-size: 10px;
          color: #9A9A9A;
          letter-spacing: 0.12em;
          font-family: 'PingFang SC', system-ui, sans-serif;
        }

        /* 手动 / AI 标签行 */
        .rg-card-tag-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 4px 0;
          flex-wrap: wrap;
        }
        /* 想去/已去 状态标签 */
        .rg-card-status-tag {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          letter-spacing: 1px;
          padding: 2px 10px;
          border-radius: 10px;
          border: 1px solid;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Source Han Serif SC', 'Noto Serif SC', serif;
          line-height: 1.6;
        }
        .rg-card-status-tag:hover {
          opacity: 0.8;
          transform: scale(0.97);
        }
        .rg-card-status-tag.want-to-go {
          color: #5A4A3A;
          border-color: rgba(244, 211, 94, 0.5);
          background: rgba(244, 211, 94, 0.08);
        }
        .rg-card-status-tag.visited {
          color: #7BA89E;
          border-color: rgba(123, 139, 111, 0.5);
          background: rgba(123, 168, 158, 0.08);
        }
        .rg-card-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          letter-spacing: 0.04em;
        }
        .rg-card-tag.manual {
          color: #9A9A9A;
          font-family: 'PingFang SC', system-ui, sans-serif;
        }
        .rg-card-tag-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #7BA89E;
          display: inline-block;
        }
        .rg-card-tag.ai {
          color: #7BA89E;
          font-family: 'Source Han Serif SC', 'Noto Serif SC', serif;
          padding: 2px 8px;
          border: 1px solid rgba(123, 168, 158, 0.4);
          border-radius: 4px;
          background: rgba(123, 168, 158, 0.1);
        }
        .rg-card-explore {
          font-size: 11px;
          color: #9A9A9A;
          font-family: 'PingFang SC', system-ui, sans-serif;
          margin-left: auto;
        }

        /* 查看攻略 */
        .rg-card-cta {
          display: block;
          padding: 10px 4px 4px;
          font-size: 12px;
          color: #7BA89E;
          font-weight: 600;
          letter-spacing: 0.04em;
          font-family: 'PingFang SC', system-ui, sans-serif;
          transition: color 0.2s ease;
        }
        .rg-card-cta:hover { color: #5A8A7E; }

        /* 添加城市空白卡片 */
        .rg-add-card {
          border: 2px dashed rgba(90,74,58,0.1);
          background: rgba(245, 243, 238, 0.5);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 260px;
          border-radius: 16px;
        }
        .rg-add-card:hover {
          border-color: #7BA89E;
          background: rgba(123, 168, 158, 0.04);
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
          color: #7BA89E;
          line-height: 1;
          font-weight: 300;
        }
        .rg-add-card-text {
          font-size: 13px;
          color: #9A9A9A;
          font-family: 'Source Han Serif SC', 'Noto Serif SC', serif;
          letter-spacing: 0.06em;
        }
      `}</style>
    </section>
  );
}
