import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
  /** AI 计划详情 */
  ai_plan?: {
    budget_breakdown?: {
      total_min?: number;
      total_max?: number;
      details?: {
        accommodation?: string;
        food?: string;
        transport?: string;
        tickets?: string;
      };
    };
  };
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
  const [carouselIndex, setCarouselIndex] = useState(0);
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

            {/* 轮播图 */}
            <div className="rg-detail-carousel">
              <div className="rg-detail-carousel-track" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
                {(city.images?.length ? city.images : ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop"]).map((img, i) => (
                  <div key={i} className="rg-detail-carousel-slide rg-film-slide">
                    <div className="rg-film-frame">
                      <div className="rg-film-holes rg-film-holes--top" />
                      <img src={img} alt={`${city.name} ${i + 1}`} />
                      <div className="rg-film-holes rg-film-holes--bottom" />
                    </div>
                  </div>
                ))}
              </div>
              {((city.images?.length || 0) > 1) && (
                <>
                  <button className="rg-detail-carousel-prev" onClick={() => setCarouselIndex((p) => (p - 1 + (city.images!.length || 1)) % (city.images!.length || 1))}>‹</button>
                  <button className="rg-detail-carousel-next" onClick={() => setCarouselIndex((p) => (p + 1) % (city.images!.length || 1))}>›</button>
                  <div className="rg-detail-carousel-dots">
                    {(city.images || []).map((_, i) => (
                      <span key={i} className={`rg-dot${i === carouselIndex ? ' is-active' : ''}`} onClick={() => setCarouselIndex(i)} />
                    ))}
                  </div>
                </>
              )}
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
                  {city.ai_plan?.budget_breakdown && (
                    <div className="rg-detail-budget">
                      {city.ai_plan.budget_breakdown.total_min != null && city.ai_plan.budget_breakdown.total_max != null && (
                        <div className="rg-detail-budget-total">
                          预算参考：{city.ai_plan.budget_breakdown.total_min} - {city.ai_plan.budget_breakdown.total_max} 元/人
                        </div>
                      )}
                      {city.ai_plan.budget_breakdown.details && (
                        <table className="rg-detail-budget-table">
                          <tbody>
                            {city.ai_plan.budget_breakdown.details.accommodation && (
                              <tr>
                                <td className="rg-detail-budget-label">住宿</td>
                                <td>{city.ai_plan.budget_breakdown.details.accommodation}</td>
                              </tr>
                            )}
                            {city.ai_plan.budget_breakdown.details.food && (
                              <tr>
                                <td className="rg-detail-budget-label">餐饮</td>
                                <td>{city.ai_plan.budget_breakdown.details.food}</td>
                              </tr>
                            )}
                            {city.ai_plan.budget_breakdown.details.transport && (
                              <tr>
                                <td className="rg-detail-budget-label">交通</td>
                                <td>{city.ai_plan.budget_breakdown.details.transport}</td>
                              </tr>
                            )}
                            {city.ai_plan.budget_breakdown.details.tickets && (
                              <tr>
                                <td className="rg-detail-budget-label">门票</td>
                                <td>{city.ai_plan.budget_breakdown.details.tickets}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      )}
                    </div>
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
        background: var(--rg-primary-faint, rgba(74,139,111,0.1));
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
        background: var(--rg-primary-faint, rgba(74,139,111,0.1));
        color: var(--rg-primary, #4A8B6F);
        font-size: 12px;
        font-family: "Noto Serif SC", Georgia, serif;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        transition: background 0.2s ease, color 0.2s ease;
      }
      .rg-detail-action-btn:hover {
        background: var(--rg-primary, #4A8B6F);
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
        font-size: var(--rg-text-h1, 24px);
        font-weight: var(--rg-weight-title, 600);
        color: #fff;
        margin: 0 0 4px;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
      }
      .rg-detail-slogan {
        font-size: var(--rg-text-body, 15px);
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
        font-style: italic;
        font-family: "Noto Serif SC", Georgia, serif;
        letter-spacing: var(--rg-tracking-body, 0.06em);
      }

      /* 正文 */
      .rg-detail-body {
        padding: var(--rg-space-lg, 24px);
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
        color: var(--rg-primary, #4A8B6F);
        border: 1px solid rgba(74, 139, 111, 0.3);
        background: var(--rg-primary-faint, rgba(74,139,111,0.08));
        font-family: "Noto Serif SC", Georgia, serif;
        letter-spacing: 0.03em;
      }
      .rg-detail-coord {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: var(--rg-text-caption, 13px);
        color: var(--rg-ink-light, #8B7D6B);
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
        margin-bottom: var(--rg-space-md, 16px);
        padding: var(--rg-space-md, 16px);
        border-radius: var(--rg-radius-md, 8px);
        border: 1.5px solid var(--rg-primary, #4A8B6F);
        background: var(--rg-primary-faint, rgba(74,139,111,0.06));
      }
      .rg-detail-ai-plan-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      .rg-detail-ai-plan-label {
        font-size: var(--rg-text-body, 15px);
        font-weight: 700;
        color: var(--rg-primary, #4A8B6F);
        font-family: "Ma Shan Zheng", "ZCOOL XiaoWei", "STKaiti", cursive;
        letter-spacing: 0.06em;
      }
      .rg-detail-ai-plan-badge {
        display: inline-flex;
        align-items: center;
        padding: 1px 8px;
        border-radius: 999px;
        font-size: 10px;
        color: var(--rg-primary, #4A8B6F);
        background: var(--rg-primary-faint, rgba(74,139,111,0.1));
        border: 1px solid rgba(74, 139, 111, 0.25);
        font-family: "Noto Sans SC", system-ui, sans-serif;
      }
      .rg-detail-ai-plan-note {
        font-size: 13px;
        line-height: var(--rg-leading-body, 1.85);
        color: var(--rg-ink-body, #6B5D4F);
        margin: 0;
        font-family: "Noto Serif SC", Georgia, serif;
      }

      /* 预算明细 */
      .rg-detail-budget {
        margin-top: 12px;
        border-top: 1px dashed rgba(74, 139, 111, 0.25);
        padding-top: 10px;
      }
      .rg-detail-budget-total {
        font-size: var(--rg-text-caption, 13px);
        font-weight: var(--rg-weight-title, 600);
        color: var(--rg-primary, #4A8B6F);
        margin-bottom: 8px;
        font-family: "Noto Serif SC", Georgia, serif;
      }
      .rg-detail-budget-table {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--rg-text-caption, 13px);
        font-family: "Noto Serif SC", Georgia, serif;
        color: var(--rg-ink-body, #6B5D4F);
      }
      .rg-detail-budget-table td {
        padding: 4px 0;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.06);
        line-height: var(--rg-leading-body, 1.85);
      }
      .rg-detail-budget-label {
        font-weight: var(--rg-weight-title, 600);
        color: var(--rg-ink, #3D2B1F);
        white-space: nowrap;
        padding-right: 12px;
        width: 48px;
      }

      /* 各个 section */
      .rg-detail-section {
        margin-bottom: var(--rg-space-lg, 24px);
      }
      .rg-detail-h4 {
        font-size: var(--rg-text-body, 15px);
        font-weight: var(--rg-weight-subtitle, 500);
        color: var(--rg-ink-secondary, #5D4E37);
        margin: 0 0 var(--rg-space-md, 16px);
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
        font-size: var(--rg-text-body, 15px);
        color: var(--rg-ink-body, #6B5D4F);
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
        font-size: var(--rg-text-body, 15px);
        font-weight: var(--rg-weight-body, 400);
        line-height: var(--rg-leading-body, 1.85);
        color: var(--rg-ink-body, #6B5D4F);
        margin: 0;
        font-family: "Noto Serif SC", Georgia, serif;
      }

      /* Tips 特殊样式 */
      .rg-detail-tips {
        padding: var(--rg-space-md, 16px);
        border-radius: var(--rg-radius-md, 8px);
        background: rgba(176, 120, 50, 0.06);
        border-left: 3px solid #c8924a;
      }
      .rg-detail-tips .rg-detail-text {
        font-size: 13px;
      }

      /* 轮播图 */
      .rg-detail-carousel { position: relative; width: 100%; height: 260px; border-radius: 8px; overflow: hidden; margin-bottom: 20px; }
      .rg-detail-carousel-track { display: flex; height: 100%; transition: transform 0.4s ease; }
      .rg-detail-carousel-slide { flex: 0 0 100%; height: 100%; display: flex; align-items: center; }

      /* 胶片外框 */
      .rg-film-slide { padding: 0; }
      .rg-film-frame {
        width: 100%;
        height: 100%;
        background: #1a1a1a;
        display: flex;
        flex-direction: column;
        padding: 10px 14px;
        box-sizing: border-box;
        position: relative;
      }
      .rg-film-frame img {
        flex: 1;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 2px;
        min-height: 0;
      }
      .rg-film-holes {
        height: 8px;
        flex-shrink: 0;
        background: repeating-linear-gradient(
          to right,
          transparent 0px,
          transparent 5px,
          #f5f0e6 5px,
          #f5f0e6 9px,
          transparent 9px,
          transparent 14px
        );
        border-radius: 2px;
      }
      .rg-film-holes--top { margin-bottom: 8px; }
      .rg-film-holes--bottom { margin-top: 8px; }

      .rg-detail-carousel-prev, .rg-detail-carousel-next { position: absolute; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.8); border: none; color: #5A4A3A; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 5; }
      .rg-detail-carousel-prev { left: 10px; }
      .rg-detail-carousel-next { right: 10px; }
      .rg-detail-carousel-dots { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; }
      .rg-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.25s; }
      .rg-dot.is-active { background: #F4D35E; width: 18px; border-radius: 3px; }

      @media (max-width: 640px) {
        .rg-detail-overlay {
          padding: 0;
          align-items: stretch;
        }
        .rg-detail-modal {
          max-width: 100%;
          max-height: 100vh;
          height: 100vh;
          border-radius: 0;
        }
        .rg-detail-cover { height: 160px; }
        .rg-detail-body { padding: 20px; }
      }
    `}</style>
    </>
  );
}
