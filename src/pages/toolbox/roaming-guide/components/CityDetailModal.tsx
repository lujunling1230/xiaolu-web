import { motion, AnimatePresence } from "framer-motion";

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
  /** 是否为 AI 计划 */
  isAIPlan?: boolean;
  /** 天气标签 */
  weather?: string[];
  /** 经纬度 */
  lat?: number;
  lng?: number;
  /** 探索次数 */
  exploreCount?: number;
  /** AI 计划备注 */
  aiPlanNote?: string;
}

export interface CityDetailModalProps {
  city: City | null;
  open: boolean;
  onClose: () => void;
  onEdit: (city: City) => void;
  onDelete: (id: number) => void;
}

export default function CityDetailModal({
  city,
  open,
  onClose,
  onEdit,
  onDelete,
}: CityDetailModalProps) {
  if (!city) return null;

  return (
    <>
    <AnimatePresence>
      {open && (
        <motion.div
          className="rg-detail-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="rg-detail-modal"
            initial={{ scale: 0.92, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 30 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button className="rg-detail-close" onClick={onClose} aria-label="关闭">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* 操作栏 */}
            <div className="rg-detail-actions">
              <button className="rg-detail-action-btn" onClick={() => onEdit(city)} title="编辑">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
                编辑
              </button>
              <button className="rg-detail-action-btn delete" onClick={() => onDelete(city.id)} title="删除">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                删除
              </button>
            </div>

            {/* 封面图 */}
            <div className="rg-detail-cover">
              <img
                src={
                  city.imageUrl ||
                  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop"
                }
                alt={city.name}
              />
              <div className="rg-detail-cover-tint" />
              <div className="rg-detail-cover-text">
                <h3 className="rg-detail-name">{city.name}</h3>
                <p className="rg-detail-slogan">{city.slogan}</p>
              </div>
            </div>

            {/* 正文区域 */}
            <div className="rg-detail-body">
              {/* 天气标签 + 坐标 + 探索次数 */}
              <div className="rg-detail-info-bar">
                {city.weather && city.weather.length > 0 && (
                  <div className="rg-detail-weather">
                    {city.weather.map((w) => (
                      <span key={w} className="rg-detail-weather-tag">{w}</span>
                    ))}
                  </div>
                )}
                {(city.lat !== undefined && city.lng !== undefined) && (
                  <span className="rg-detail-coord">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {city.lat.toFixed(2)}, {city.lng.toFixed(2)}
                  </span>
                )}
                {city.exploreCount && city.exploreCount > 0 && (
                  <span className="rg-detail-explore-count">
                    探索 {city.exploreCount} 次
                  </span>
                )}
              </div>

              {/* AI 计划区域（特殊展示） */}
              {city.isAIPlan && (
                <div className="rg-detail-ai-plan">
                  <div className="rg-detail-ai-plan-header">
                    <span className="rg-detail-ai-plan-label">AI计划</span>
                    <span className="rg-detail-ai-plan-badge">智能推荐</span>
                  </div>
                  {city.aiPlanNote && (
                    <p className="rg-detail-ai-plan-note">{city.aiPlanNote}</p>
                  )}
                </div>
              )}

              {/* 玩 */}
              <div className="rg-detail-section">
                <h4 className="rg-detail-h4">🎯 玩</h4>
                <ul className="rg-detail-list">
                  {city.play.map((s) => (
                    <li key={s.name} className="rg-detail-list-item">
                      <span>{s.name}</span>
                      <span className="rg-detail-rating">
                        {"★".repeat(s.rating)}
                        <span className="rg-detail-rating-empty">
                          {"★".repeat(5 - s.rating)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 吃 */}
              <div className="rg-detail-section">
                <h4 className="rg-detail-h4">🍜 吃</h4>
                <ul className="rg-detail-list">
                  {city.eat.map((s) => (
                    <li key={s.name} className="rg-detail-list-item">
                      <span>
                        {s.name}
                        {s.signature && (
                          <em className="rg-detail-signature"> · {s.signature}</em>
                        )}
                      </span>
                      <span className="rg-detail-price">{s.price}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 住 */}
              <div className="rg-detail-section">
                <h4 className="rg-detail-h4">🛏️ 住</h4>
                <p className="rg-detail-text">{city.stay}</p>
              </div>

              {/* Tips */}
              <div className="rg-detail-section rg-detail-tips">
                <h4 className="rg-detail-h4">💡 Tips</h4>
                <p className="rg-detail-text">{city.tips}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    <style>{`
      /* ===== CityDetailModal - 城市详情弹窗 ===== */

      /* 遮罩层 */
      .rg-detail-overlay {
        position: fixed;
        inset: 0;
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: rgba(40, 32, 24, 0.7);
        backdrop-filter: blur(6px);
      }

      /* Modal 主体 */
      .rg-detail-modal {
        position: relative;
        width: 100%;
        max-width: 500px;
        background: #fffdf6;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.5);
        max-height: 90vh;
        overflow-y: auto;
      }

      /* 关闭按钮 */
      .rg-detail-close {
        position: absolute;
        top: 12px;
        right: 14px;
        z-index: 5;
        width: 34px;
        height: 34px;
        border: none;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.85);
        color: #4a4036;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.2s ease;
      }
      .rg-detail-close:hover {
        background: #fff;
        transform: scale(1.08);
      }

      /* 操作栏 */
      .rg-detail-actions {
        position: absolute;
        top: 12px;
        left: 14px;
        z-index: 5;
        display: flex;
        gap: 6px;
        opacity: 0;
        transform: translateY(-4px);
        transition: opacity 0.25s ease, transform 0.25s ease;
      }
      .rg-detail-modal:hover .rg-detail-actions {
        opacity: 1;
        transform: translateY(0);
      }
      .rg-detail-action-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        border: none;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.9);
        color: #5d8a6a;
        font-size: 12px;
        font-family: "Noto Serif SC", Georgia, serif;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        transition: background 0.2s ease, color 0.2s ease;
      }
      .rg-detail-action-btn:hover {
        background: #5d8a6a;
        color: #fff;
      }
      .rg-detail-action-btn.delete:hover {
        background: #c44536;
      }

      /* 封面 */
      .rg-detail-cover {
        position: relative;
        height: 200px;
        overflow: hidden;
      }
      .rg-detail-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: sepia(0.1) brightness(0.85);
      }
      .rg-detail-cover-tint {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, transparent 30%, rgba(0, 0, 0, 0.5));
      }
      .rg-detail-cover-text {
        position: absolute;
        bottom: 20px;
        left: 24px;
        right: 24px;
      }
      .rg-detail-name {
        font-family: "Noto Serif SC", Georgia, serif;
        font-size: 28px;
        font-weight: 700;
        color: #fff;
        margin: 0 0 4px;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
      }
      .rg-detail-slogan {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
        font-style: italic;
        font-family: "Noto Serif SC", Georgia, serif;
      }

      /* 正文 */
      .rg-detail-body {
        padding: 24px;
      }

      /* 信息栏：天气 + 坐标 + 探索次数 */
      .rg-detail-info-bar {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 16px;
        padding-bottom: 14px;
        border-bottom: 1px dashed #ece4d4;
      }
      .rg-detail-weather {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      .rg-detail-weather-tag {
        display: inline-flex;
        align-items: center;
        padding: 2px 10px;
        border-radius: 999px;
        font-size: 11px;
        color: #8B7D6B;
        border: 1px solid #e0d8cc;
        background: rgba(245, 240, 230, 0.6);
        font-family: "Noto Serif SC", Georgia, serif;
        letter-spacing: 0.03em;
      }
      .rg-detail-coord {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: #B0A090;
        font-family: "Noto Serif SC", Georgia, serif;
      }
      .rg-detail-coord svg {
        opacity: 0.6;
      }
      .rg-detail-explore-count {
        margin-left: auto;
        font-size: 11px;
        color: #C8924A;
        font-family: "Ma Shan Zheng", "ZCOOL XiaoWei", "STKaiti", cursive;
        letter-spacing: 0.04em;
      }

      /* AI 计划区域 */
      .rg-detail-ai-plan {
        margin-bottom: 20px;
        padding: 16px;
        border-radius: 10px;
        border: 1.5px solid rgba(46, 139, 87, 0.35);
        background: linear-gradient(145deg, rgba(46, 139, 87, 0.04) 0%, rgba(46, 139, 87, 0.08) 100%);
      }
      .rg-detail-ai-plan-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      .rg-detail-ai-plan-label {
        font-size: 15px;
        font-weight: 700;
        color: #2E8B57;
        font-family: "Ma Shan Zheng", "ZCOOL XiaoWei", "STKaiti", cursive;
        letter-spacing: 0.06em;
      }
      .rg-detail-ai-plan-badge {
        display: inline-flex;
        align-items: center;
        padding: 1px 8px;
        border-radius: 999px;
        font-size: 10px;
        color: #2E8B57;
        background: rgba(46, 139, 87, 0.1);
        border: 1px solid rgba(46, 139, 87, 0.25);
        font-family: "Noto Sans SC", system-ui, sans-serif;
      }
      .rg-detail-ai-plan-note {
        font-size: 13px;
        line-height: 1.7;
        color: #6b5e50;
        margin: 0;
        font-family: "Noto Serif SC", Georgia, serif;
      }

      /* 各个 section */
      .rg-detail-section {
        margin-bottom: 24px;
      }
      .rg-detail-h4 {
        font-size: 16px;
        font-weight: 700;
        color: #5d8a6a;
        margin: 0 0 12px;
        font-family: "Noto Serif SC", Georgia, serif;
      }
      .rg-detail-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .rg-detail-list-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px dashed #ece4d4;
        font-size: 14px;
        color: #4a4036;
      }
      .rg-detail-rating {
        color: #f5a623;
        font-size: 13px;
        letter-spacing: 1px;
      }
      .rg-detail-rating-empty {
        color: #ddd4c6;
      }
      .rg-detail-signature {
        font-style: normal;
        color: #b07832;
        font-size: 12px;
      }
      .rg-detail-price {
        color: #8a7a6e;
        font-size: 13px;
      }
      .rg-detail-text {
        font-size: 14px;
        line-height: 1.8;
        color: #6b5e50;
        margin: 0;
        font-family: "Noto Serif SC", Georgia, serif;
      }

      /* Tips 特殊样式 */
      .rg-detail-tips {
        padding: 16px;
        border-radius: 8px;
        background: rgba(176, 120, 50, 0.06);
        border-left: 3px solid #c8924a;
      }
      .rg-detail-tips .rg-detail-text {
        font-size: 13px;
      }

      @media (max-width: 640px) {
        .rg-detail-cover { height: 160px; }
        .rg-detail-body { padding: 20px; }
      }
    `}</style>
    </>
  );
}
