import { useState } from "react";
import { useRoamingGuide } from "./RoamingGuideContext";
import AIAssistantPanel from "./components/AIAssistantPanel";
import CityDetailModal from "./components/CityDetailModal";

export default function PlanPage() {
  const {
    cities,
    recommendLoading, generateLoading,
    lastRecommendResult, lastGenerateResult,
    recommendError, generateError,
    reverseRecommend, forwardGenerate,
    handleAdoptCity, handleSavePlan,
    detailOpen, setDetailOpen,
    selectedCity, setSelectedCity,
    handleEditCity, handleDeleteCity,
  } = useRoamingGuide();

  const [expandedPlan, setExpandedPlan] = useState(false);

  const hasRecommend = lastRecommendResult && lastRecommendResult.cities.length > 0;
  const hasGenerate = lastGenerateResult && lastGenerateResult.plan;

  return (
    <>
      <style>{`
        .rg-plan-wrap {
          max-width: 720px;
          margin: 0 auto;
          padding: 32px 20px 80px;
          background: #F5F3EE;
          min-height: 100vh;
          font-family: 'PingFang SC', system-ui, sans-serif;
        }
        .rg-plan-card {
          background: #fff;
          border: none;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(90, 74, 58, 0.08);
        }
        .rg-plan-card h3 {
          font-family: 'Source Han Serif SC', 'Noto Serif SC', serif;
          font-size: 16px;
          color: #2C3E50;
          margin: 0 0 12px;
          letter-spacing: 2px;
        }
        .rg-plan-card p {
          font-size: 13px;
          line-height: 1.8;
          color: #5A4A3A;
          margin: 0;
        }
        .rg-plan-city {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: rgba(244,211,94,0.06);
          border-radius: 8px;
          margin-bottom: 8px;
          font-size: 13px;
          color: #5A4A3A;
        }
        .rg-plan-city__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #7BA89E;
          flex-shrink: 0;
        }
        .rg-plan-empty {
          text-align: center;
          padding: 60px 20px;
          color: #5A4A3A;
        }
        .rg-plan-empty h3 {
          font-family: 'Source Han Serif SC', 'Noto Serif SC', serif;
          font-size: 18px;
          color: #2C3E50;
          margin: 0 0 12px;
          letter-spacing: 2px;
        }
        .rg-plan-empty p {
          font-size: 13px;
          line-height: 1.8;
          margin: 0 0 8px;
        }
        .rg-plan-hint {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 16px;
          padding: 6px 14px;
          background: rgba(244,211,94,0.1);
          border-radius: 20px;
          font-size: 12px;
          color: #F4D35E;
        }
      `}</style>

      <div className="rg-plan-wrap">
        {/* 欢迎引导 */}
        <div className="rg-plan-empty">
          <h3>漫游向导</h3>
          <p>不知道下一站去哪？</p>
          <p>或者已经选好了目的地，想要一份详细的行程？</p>
          <div className="rg-plan-hint">
            <span>点击下方地球，开启 AI 旅行向导</span>
          </div>
          {/* 居中地球按钮 */}
          <div style={{ marginTop: 24 }}>
            <AIAssistantPanel
              cities={cities}
              recommendLoading={recommendLoading}
              generateLoading={generateLoading}
              lastRecommendResult={lastRecommendResult}
              lastGenerateResult={lastGenerateResult}
              recommendError={recommendError}
              generateError={generateError}
              onReverseRecommend={reverseRecommend}
              onForwardGenerate={forwardGenerate}
              onAdoptCity={handleAdoptCity}
              onSavePlan={handleSavePlan}
              centered
            />
          </div>
        </div>

        {/* 最近推荐 */}
        {hasRecommend && (
          <div className="rg-plan-card">
            <h3>最近推荐</h3>
            <p style={{ marginBottom: 12, fontSize: 12, color: '#5A4A3A' }}>
              {lastRecommendResult!.summary}
            </p>
            {lastRecommendResult!.cities.map((c, i) => (
              <div key={i} className="rg-plan-city">
                <span className="rg-plan-city__dot" />
                <span>{c.name} · {c.reason.slice(0, 30)}...</span>
              </div>
            ))}
          </div>
        )}

        {/* 最近攻略 */}
        {hasGenerate && (
          <div className="rg-plan-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>最近规划</h3>
              <button
                onClick={() => setExpandedPlan(!expandedPlan)}
                style={{
                  background: "rgba(244,211,94,0.1)",
                  border: "none",
                  borderRadius: 20,
                  padding: "3px 12px",
                  fontSize: 12,
                  color: "#F4D35E",
                  cursor: "pointer",
                  fontFamily: "'Source Han Serif SC', 'Noto Serif SC', serif",
                  letterSpacing: "1px",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {expandedPlan ? "收起" : "查看详情"}
              </button>
            </div>
            <p style={{ marginBottom: 8 }}>
              <strong>{lastGenerateResult!.plan.prompt}</strong>
            </p>
            <p>{lastGenerateResult!.plan.summary}</p>
            {lastGenerateResult!.plan.budget_hint && (
              <p style={{ marginTop: 8, fontSize: 12, color: "#5A4A3A" }}>
                {lastGenerateResult!.plan.budget_hint}
              </p>
            )}

            {/* 展开后的完整攻略详情 */}
            {expandedPlan && lastGenerateResult!.detailed_guide.length > 0 && (
              <div style={{ marginTop: 16, borderTop: "1px solid rgba(90,74,58,0.1)", paddingTop: 16 }}>
                {lastGenerateResult!.plan.highlights.length > 0 && (
                  <div style={{ marginBottom: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {lastGenerateResult!.plan.highlights.map((h, i) => (
                      <span key={i} style={{
                        padding: "3px 10px",
                        background: "rgba(244,211,94,0.12)",
                        borderRadius: 12,
                        fontSize: 12,
                        color: "#5A4A3A",
                      }}>{h}</span>
                    ))}
                  </div>
                )}
                {lastGenerateResult!.detailed_guide.map((day) => (
                  <div key={day.day} style={{
                    marginBottom: 16,
                    padding: "14px 16px",
                    background: "rgba(244,211,94,0.04)",
                    borderRadius: 10,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#F4D35E",
                        letterSpacing: "1px",
                        background: "rgba(244,211,94,0.12)",
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}>
                        DAY {String(day.day).padStart(2, "0")}
                      </span>
                      <span style={{ fontSize: 14, color: "#2C3E50", fontWeight: 500 }}>
                        {day.theme}
                      </span>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: "#7BA89E", fontWeight: 600 }}>行程安排</span>
                      <ul style={{ margin: "4px 0 0", paddingLeft: 18, fontSize: 13, lineHeight: 1.8, color: "#5A4A3A" }}>
                        {day.activities.map((a, i) => <li key={i}>{a}</li>)}
                      </ul>
                    </div>
                    <div>
                      <span style={{ fontSize: 12, color: "#7BA89E", fontWeight: 600 }}>美食推荐</span>
                      <ul style={{ margin: "4px 0 0", paddingLeft: 18, fontSize: 13, lineHeight: 1.8, color: "#5A4A3A" }}>
                        {day.food_recommendations.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                    {day.transport_tip && (
                      <p style={{ marginTop: 8, fontSize: 12, color: "#5A4A3A", fontStyle: "italic" }}>
                        交通：{day.transport_tip}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 城市统计 */}
        <div className="rg-plan-card">
          <h3>我的足迹</h3>
          <p>已记录 {cities.length} 座城市，点击向导可以基于你的足迹做智能推荐。</p>
        </div>
      </div>

      {/* 详情 Modal */}
      <CityDetailModal
        city={selectedCity}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onEdit={handleEditCity}
        onDelete={handleDeleteCity}
      />
    </>
  );
}
