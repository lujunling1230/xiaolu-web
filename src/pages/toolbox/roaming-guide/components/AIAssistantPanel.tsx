import { useState } from "react";
import {
  City,
  AIReverseRecommendRequest,
  AIForwardGenerateRequest,
  AIReverseRecommendResponse,
  AIForwardGenerateResponse,
} from "../types";

/* ============================================================
   类型定义
   ============================================================ */

interface AIAssistantPanelProps {
  cities: City[];
  recommendLoading: boolean;
  generateLoading: boolean;
  lastRecommendResult: AIReverseRecommendResponse | null;
  lastGenerateResult: AIForwardGenerateResponse | null;
  recommendError: string | null;
  generateError: string | null;
  onReverseRecommend: (
    req: AIReverseRecommendRequest
  ) => Promise<AIReverseRecommendResponse>;
  onForwardGenerate: (
    req: AIForwardGenerateRequest
  ) => Promise<AIForwardGenerateResponse>;
  onAdoptCity: (city: AIReverseRecommendResponse["cities"][0]) => void;
  onSavePlan: (city: City, plan: AIForwardGenerateResponse) => void;
}

/* ============================================================
   常量
   ============================================================ */

const SEASONS = [
  { label: "春", value: "春" },
  { label: "夏", value: "夏" },
  { label: "秋", value: "秋" },
  { label: "冬", value: "冬" },
] as const;

const BUDGETS = [
  { label: "低预算", value: "低" },
  { label: "中等", value: "中" },
  { label: "不限", value: "不限" },
] as const;

const INTERESTS = [
  "自然风光",
  "历史人文",
  "美食",
  "文艺",
  "户外",
  "海岛",
] as const;

type TabType = "reverse" | "forward";

/* ============================================================
   组件
   ============================================================ */

export default function AIAssistantPanel({
  cities,
  recommendLoading,
  generateLoading,
  lastRecommendResult,
  lastGenerateResult,
  recommendError,
  generateError,
  onReverseRecommend,
  onForwardGenerate,
  onAdoptCity,
  onSavePlan,
}: AIAssistantPanelProps) {
  /* ---- 状态 ---- */
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("reverse");

  /* 反向推荐表单 */
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  /* 正向生成表单 */
  const [selectedCity, setSelectedCity] = useState("");
  const [tripDays, setTripDays] = useState(3);

  /* 已点亮的推荐城市 name 集合 */
  const [adoptedNames, setAdoptedNames] = useState<Set<string>>(new Set());

  /* ---- 交互处理 ---- */

  const toggleSeason = (season: string) => {
    setSelectedSeasons((prev) =>
      prev.includes(season)
        ? prev.filter((s) => s !== season)
        : [...prev, season]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleReverseRecommend = async () => {
    try {
      await onReverseRecommend({
        preferences: {
          season: selectedSeasons.length > 0 ? selectedSeasons.join(",") : undefined,
          budget: selectedBudget || undefined,
          interests: selectedInterests,
        },
      });
    } catch {
      // 错误已通过 props 传递，此处仅静默
    }
  };

  const handleForwardGenerate = async () => {
    if (!selectedCity) return;
    try {
      await onForwardGenerate({
        city_name: selectedCity,
        days: tripDays,
      });
    } catch {
      // 错误已通过 props 传递
    }
  };

  const handleAdopt = (city: AIReverseRecommendResponse["cities"][0]) => {
    setAdoptedNames((prev) => new Set(prev).add(city.name));
    onAdoptCity(city);
  };

  const handleSavePlan = () => {
    if (!selectedCity || !lastGenerateResult) return;
    const matched = cities.find((c) => c.name === selectedCity);
    if (matched) {
      onSavePlan(matched, lastGenerateResult);
    }
  };

  /* ---- 渲染 ---- */

  return (
    <>
      <style>{CSS}</style>

      {/* ===== 浮动按钮 ===== */}
      <button
        className="rg-ai-fab"
        onClick={() => setOpen(true)}
        aria-label="打开 AI 助手"
      >
        <span className="rg-ai-fab__icon">&#x2793;</span>
      </button>

      {/* ===== 遮罩层 ===== */}
      <div
        className={`rg-ai-overlay${open ? " rg-ai-overlay--visible" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* ===== 侧栏抽屉 ===== */}
      <aside
        className={`rg-ai-drawer${open ? " rg-ai-drawer--open" : ""}`}
      >
        {/* 标题栏 */}
        <div className="rg-ai-drawer__header">
          <h3 className="rg-ai-drawer__title">AI 旅 行 助 手</h3>
          <button
            className="rg-ai-drawer__close"
            onClick={() => setOpen(false)}
            aria-label="关闭"
          >
            &#x2715;
          </button>
        </div>

        {/* Tab 切换 */}
        <div className="rg-ai-tabs">
          <button
            className={`rg-ai-tabs__btn${activeTab === "reverse" ? " rg-ai-tabs__btn--active" : ""}`}
            onClick={() => setActiveTab("reverse")}
          >
            帮我选城市
          </button>
          <button
            className={`rg-ai-tabs__btn${activeTab === "forward" ? " rg-ai-tabs__btn--active" : ""}`}
            onClick={() => setActiveTab("forward")}
          >
            生成攻略
          </button>
        </div>

        {/* 内容区 */}
        <div className="rg-ai-body">
          {activeTab === "reverse" ? (
            <ReverseTab
              selectedSeasons={selectedSeasons}
              selectedBudget={selectedBudget}
              selectedInterests={selectedInterests}
              loading={recommendLoading}
              error={recommendError}
              result={lastRecommendResult}
              adoptedNames={adoptedNames}
              onToggleSeason={toggleSeason}
              onSelectBudget={setSelectedBudget}
              onToggleInterest={toggleInterest}
              onSubmit={handleReverseRecommend}
              onAdopt={handleAdopt}
            />
          ) : (
            <ForwardTab
              cities={cities}
              selectedCity={selectedCity}
              tripDays={tripDays}
              loading={generateLoading}
              error={generateError}
              result={lastGenerateResult}
              onSelectCity={setSelectedCity}
              onDaysChange={setTripDays}
              onSubmit={handleForwardGenerate}
              onSave={handleSavePlan}
            />
          )}
        </div>
      </aside>
    </>
  );
}

/* ============================================================
   反向推荐 Tab
   ============================================================ */

interface ReverseTabProps {
  selectedSeasons: string[];
  selectedBudget: string;
  selectedInterests: string[];
  loading: boolean;
  error: string | null;
  result: AIReverseRecommendResponse | null;
  adoptedNames: Set<string>;
  onToggleSeason: (s: string) => void;
  onSelectBudget: (b: string) => void;
  onToggleInterest: (i: string) => void;
  onSubmit: () => void;
  onAdopt: (city: AIReverseRecommendResponse["cities"][0]) => void;
}

function ReverseTab({
  selectedSeasons,
  selectedBudget,
  selectedInterests,
  loading,
  error,
  result,
  adoptedNames,
  onToggleSeason,
  onSelectBudget,
  onToggleInterest,
  onSubmit,
  onAdopt,
}: ReverseTabProps) {
  return (
    <div className="rg-ai-reverse">
      {/* 季节选择 */}
      <section className="rg-ai-section">
        <h4 className="rg-ai-section__title">季节偏好</h4>
        <div className="rg-ai-seasons">
          {SEASONS.map((s) => (
            <button
              key={s.value}
              className={`rg-ai-season-btn${selectedSeasons.includes(s.value) ? " rg-ai-season-btn--active" : ""}`}
              onClick={() => onToggleSeason(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </section>

      {/* 预算选择 */}
      <section className="rg-ai-section">
        <h4 className="rg-ai-section__title">预算范围</h4>
        <div className="rg-ai-budgets">
          {BUDGETS.map((b) => (
            <button
              key={b.value}
              className={`rg-ai-budget-btn${selectedBudget === b.value ? " rg-ai-budget-btn--active" : ""}`}
              onClick={() => onSelectBudget(b.value)}
            >
              {b.label}
            </button>
          ))}
        </div>
      </section>

      {/* 兴趣标签 */}
      <section className="rg-ai-section">
        <h4 className="rg-ai-section__title">兴趣方向</h4>
        <div className="rg-ai-interests">
          {INTERESTS.map((tag) => (
            <button
              key={tag}
              className={`rg-ai-interest-tag${selectedInterests.includes(tag) ? " rg-ai-interest-tag--active" : ""}`}
              onClick={() => onToggleInterest(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* 提交按钮 */}
      <button
        className="rg-ai-submit-btn"
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? "推荐中..." : "开始推荐"}
      </button>

      {/* Loading 指南针动画 */}
      {loading && (
        <div className="rg-ai-loading">
          <span className="rg-ai-loading__compass">&#x2793;</span>
          <span className="rg-ai-loading__text">AI 正在为你寻觅远方...</span>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="rg-ai-error">
          <span className="rg-ai-error__icon">&#x26A0;</span>
          <span>{error}</span>
        </div>
      )}

      {/* 推荐结果 */}
      {result && !loading && (
        <div className="rg-ai-results">
          {result.summary && (
            <p className="rg-ai-results__summary">{result.summary}</p>
          )}
          <div className="rg-ai-results__list">
            {result.cities.map((city, idx) => (
              <div key={city.name} className="rg-ai-city-card">
                <div className="rg-ai-city-card__content">
                  <div className="rg-ai-city-card__header">
                    <span className="rg-ai-city-card__index">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="rg-ai-city-card__name">{city.name}</span>
                    <span className="rg-ai-city-card__province">
                      {city.province}
                    </span>
                  </div>
                  <p className="rg-ai-city-card__reason">{city.reason}</p>
                  <div className="rg-ai-city-card__meta">
                    <span className="rg-ai-city-card__label">
                      亮点：
                      {city.highlights.join(" / ")}
                    </span>
                    <span className="rg-ai-city-card__label">
                      最佳季节：{city.best_season}
                    </span>
                  </div>
                </div>
                <button
                  className={`rg-ai-city-card__adopt${adoptedNames.has(city.name) ? " rg-ai-city-card__adopt--done" : ""}`}
                  onClick={() => onAdopt(city)}
                  disabled={adoptedNames.has(city.name)}
                >
                  {adoptedNames.has(city.name) ? "已点亮" : "点亮"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   正向生成 Tab
   ============================================================ */

interface ForwardTabProps {
  cities: City[];
  selectedCity: string;
  tripDays: number;
  loading: boolean;
  error: string | null;
  result: AIForwardGenerateResponse | null;
  onSelectCity: (c: string) => void;
  onDaysChange: (d: number) => void;
  onSubmit: () => void;
  onSave: () => void;
}

function ForwardTab({
  cities,
  selectedCity,
  tripDays,
  loading,
  error,
  result,
  onSelectCity,
  onDaysChange,
  onSubmit,
  onSave,
}: ForwardTabProps) {
  return (
    <div className="rg-ai-forward">
      {/* 城市选择 */}
      <section className="rg-ai-section">
        <h4 className="rg-ai-section__title">选择城市</h4>
        <select
          className="rg-ai-select"
          value={selectedCity}
          onChange={(e) => onSelectCity(e.target.value)}
        >
          <option value="">请选择城市</option>
          {cities.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}（{c.province}）
            </option>
          ))}
        </select>
      </section>

      {/* 天数输入 */}
      <section className="rg-ai-section">
        <h4 className="rg-ai-section__title">旅行天数</h4>
        <div className="rg-ai-days-input">
          <button
            className="rg-ai-days-input__btn"
            onClick={() => onDaysChange(Math.max(1, tripDays - 1))}
            disabled={tripDays <= 1}
          >
            -
          </button>
          <span className="rg-ai-days-input__value">{tripDays} 天</span>
          <button
            className="rg-ai-days-input__btn"
            onClick={() => onDaysChange(Math.min(10, tripDays + 1))}
            disabled={tripDays >= 10}
          >
            +
          </button>
        </div>
      </section>

      {/* 提交按钮 */}
      <button
        className="rg-ai-submit-btn"
        onClick={onSubmit}
        disabled={loading || !selectedCity}
      >
        {loading ? "生成中..." : "生成攻略"}
      </button>

      {/* Loading */}
      {loading && (
        <div className="rg-ai-loading">
          <span className="rg-ai-loading__compass">&#x2793;</span>
          <span className="rg-ai-loading__text">AI 正在规划行程...</span>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="rg-ai-error">
          <span className="rg-ai-error__icon">&#x26A0;</span>
          <span>{error}</span>
        </div>
      )}

      {/* 生成结果 */}
      {result && !loading && (
        <div className="rg-ai-plan">
          {/* 摘要卡片 */}
          <div className="rg-ai-plan__summary">
            <h4 className="rg-ai-plan__summary-title">
              {result.plan.prompt}
            </h4>
            <p className="rg-ai-plan__summary-text">
              {result.plan.summary}
            </p>
            {result.plan.budget_hint && (
              <p className="rg-ai-plan__budget">{result.plan.budget_hint}</p>
            )}
            {result.plan.highlights.length > 0 && (
              <div className="rg-ai-plan__highlights">
                {result.plan.highlights.map((h, i) => (
                  <span key={i} className="rg-ai-plan__highlight-tag">
                    {h}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 按天行程 */}
          <div className="rg-ai-plan__days">
            {result.detailed_guide.map((day) => (
              <div key={day.day} className="rg-ai-day-card">
                <div className="rg-ai-day-card__header">
                  <span className="rg-ai-day-card__num">
                    DAY {String(day.day).padStart(2, "0")}
                  </span>
                  <span className="rg-ai-day-card__theme">
                    {day.theme}
                  </span>
                </div>
                <div className="rg-ai-day-card__body">
                  <div className="rg-ai-day-card__activities">
                    <span className="rg-ai-day-card__sub-title">行程安排</span>
                    <ul>
                      {day.activities.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rg-ai-day-card__food">
                    <span className="rg-ai-day-card__sub-title">美食推荐</span>
                    <ul>
                      {day.food_recommendations.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 保存按钮 */}
          <button className="rg-ai-save-btn" onClick={onSave}>
            保存攻略
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   CSS（内联 <style> 标签内容）
   ============================================================ */

const CSS = `
/* ================================================================
   变量
   ================================================================ */
.rg-ai-drawer,
.rg-ai-fab,
.rg-ai-overlay,
.rg-ai-tabs,
.rg-ai-reverse,
.rg-ai-forward,
.rg-ai-loading,
.rg-ai-error,
.rg-ai-results,
.rg-ai-plan {
  --ai-paper: #F5F0E6;
  --ai-ink: #5c3a21;
  --ai-ink-light: #8B7D6B;
  --ai-ink-faint: #C8B898;
  --ai-amber: #C49452;
  --ai-amber-light: #D9B574;
  --ai-amber-dark: #A07838;
  --ai-amber-bg: rgba(196, 148, 82, 0.10);
  --ai-amber-border: rgba(196, 148, 82, 0.45);
  --ai-font: "KaiTi", "STKaiti", "Noto Serif SC", serif;
  --ai-shadow-drawer: -6px 0 28px rgba(60, 40, 20, 0.18), -2px 0 8px rgba(60, 40, 20, 0.08);
}

/* ================================================================
   浮动按钮 (FAB)
   ================================================================ */
.rg-ai-fab {
  position: fixed;
  right: 28px;
  bottom: 28px;
  z-index: 9000;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #D9B574 0%, #A07838 100%);
  box-shadow: 0 4px 16px rgba(160, 120, 56, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  animation: rg-ai-pulse 2.4s ease-in-out infinite;
}

.rg-ai-fab:hover {
  transform: scale(1.15);
  box-shadow: 0 6px 24px rgba(160, 120, 56, 0.6);
}

.rg-ai-fab:active {
  transform: scale(1.05);
}

.rg-ai-fab__icon {
  font-size: 26px;
  color: #fff;
  line-height: 1;
  user-select: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

@keyframes rg-ai-pulse {
  0%, 100% { box-shadow: 0 4px 16px rgba(160, 120, 56, 0.45), 0 0 0 0 rgba(196, 148, 82, 0.3); }
  50% { box-shadow: 0 4px 16px rgba(160, 120, 56, 0.45), 0 0 0 12px rgba(196, 148, 82, 0); }
}

/* ================================================================
   遮罩层
   ================================================================ */
.rg-ai-overlay {
  position: fixed;
  inset: 0;
  z-index: 9001;
  background: rgba(44, 24, 12, 0.25);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.35s ease, visibility 0.35s ease;
  pointer-events: none;
}

.rg-ai-overlay--visible {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

/* ================================================================
   侧栏抽屉
   ================================================================ */
.rg-ai-drawer {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9002;
  width: 380px;
  height: 100vh;
  background: var(--ai-paper);
  box-shadow: var(--ai-shadow-drawer);
  font-family: var(--ai-font);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease;
  overflow: hidden;
}

.rg-ai-drawer--open {
  transform: translateX(0);
  opacity: 1;
}

/* 移动端全屏 */
@media (max-width: 640px) {
  .rg-ai-drawer {
    width: 100vw;
  }
}

/* ---- 标题栏 ---- */
.rg-ai-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--ai-ink-faint);
  flex-shrink: 0;
}

.rg-ai-drawer__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--ai-ink);
  letter-spacing: 6px;
  margin: 0;
}

.rg-ai-drawer__close {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
  color: var(--ai-ink-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, color 0.2s ease;
}

.rg-ai-drawer__close:hover {
  background: rgba(92, 58, 33, 0.08);
  color: var(--ai-ink);
}

/* ---- Tabs ---- */
.rg-ai-tabs {
  display: flex;
  padding: 12px 20px 0;
  gap: 0;
  border-bottom: 1px solid var(--ai-ink-faint);
  flex-shrink: 0;
}

.rg-ai-tabs__btn {
  flex: 1;
  padding: 10px 0;
  border: none;
  background: none;
  cursor: pointer;
  font-family: var(--ai-font);
  font-size: 15px;
  color: var(--ai-ink-light);
  letter-spacing: 2px;
  position: relative;
  transition: color 0.25s ease;
}

.rg-ai-tabs__btn::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 20%;
  width: 60%;
  height: 2.5px;
  background: var(--ai-amber);
  border-radius: 2px;
  transform: scaleX(0);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.rg-ai-tabs__btn--active {
  color: var(--ai-ink);
  font-weight: 700;
}

.rg-ai-tabs__btn--active::after {
  transform: scaleX(1);
}

/* ---- Body 滚动区 ---- */
.rg-ai-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 32px;
}

.rg-ai-body::-webkit-scrollbar {
  width: 4px;
}

.rg-ai-body::-webkit-scrollbar-track {
  background: transparent;
}

.rg-ai-body::-webkit-scrollbar-thumb {
  background: var(--ai-ink-faint);
  border-radius: 2px;
}

/* ================================================================
   通用 Section
   ================================================================ */
.rg-ai-section {
  margin-bottom: 18px;
}

.rg-ai-section__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ai-ink);
  letter-spacing: 3px;
  margin: 0 0 10px;
}

/* ================================================================
   反向推荐 — 季节按钮
   ================================================================ */
.rg-ai-seasons {
  display: flex;
  gap: 10px;
}

.rg-ai-season-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1.5px solid var(--ai-amber-border);
  background: transparent;
  cursor: pointer;
  font-family: var(--ai-font);
  font-size: 16px;
  color: var(--ai-ink);
  transition: all 0.25s ease;
}

.rg-ai-season-btn:hover {
  border-color: var(--ai-amber);
  background: var(--ai-amber-bg);
}

.rg-ai-season-btn--active {
  background: linear-gradient(135deg, #D9B574 0%, #A07838 100%);
  border-color: var(--ai-amber-dark);
  color: #fff;
  font-weight: 700;
}

/* ================================================================
   反向推荐 — 预算按钮
   ================================================================ */
.rg-ai-budgets {
  display: flex;
  gap: 10px;
}

.rg-ai-budget-btn {
  flex: 1;
  padding: 8px 0;
  border-radius: 8px;
  border: 1.5px solid var(--ai-amber-border);
  background: transparent;
  cursor: pointer;
  font-family: var(--ai-font);
  font-size: 14px;
  color: var(--ai-ink);
  letter-spacing: 1px;
  transition: all 0.25s ease;
}

.rg-ai-budget-btn:hover {
  border-color: var(--ai-amber);
  background: var(--ai-amber-bg);
}

.rg-ai-budget-btn--active {
  background: linear-gradient(135deg, #D9B574 0%, #A07838 100%);
  border-color: var(--ai-amber-dark);
  color: #fff;
  font-weight: 700;
}

/* ================================================================
   反向推荐 — 兴趣标签
   ================================================================ */
.rg-ai-interests {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.rg-ai-interest-tag {
  padding: 5px 14px;
  border-radius: 20px;
  border: 1.5px solid var(--ai-amber-border);
  background: transparent;
  cursor: pointer;
  font-family: var(--ai-font);
  font-size: 13px;
  color: var(--ai-ink-light);
  transition: all 0.25s ease;
  white-space: nowrap;
}

.rg-ai-interest-tag:hover {
  border-color: var(--ai-amber);
  color: var(--ai-ink);
  background: var(--ai-amber-bg);
}

.rg-ai-interest-tag--active {
  background: linear-gradient(135deg, #D9B574 0%, #A07838 100%);
  border-color: var(--ai-amber-dark);
  color: #fff;
}

/* ================================================================
   提交按钮
   ================================================================ */
.rg-ai-submit-btn {
  width: 100%;
  padding: 12px 0;
  border: 1.5px solid var(--ai-amber);
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  font-family: var(--ai-font);
  font-size: 16px;
  color: var(--ai-amber-dark);
  letter-spacing: 4px;
  transition: all 0.3s ease;
  margin-top: 4px;
}

.rg-ai-submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #D9B574 0%, #A07838 100%);
  color: #fff;
  border-color: var(--ai-amber-dark);
}

.rg-ai-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ================================================================
   Loading 动画（旋转指南针）
   ================================================================ */
.rg-ai-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 0 16px;
  gap: 12px;
}

.rg-ai-loading__compass {
  display: inline-block;
  font-size: 32px;
  color: var(--ai-amber);
  animation: rg-ai-spin 1.6s linear infinite;
}

@keyframes rg-ai-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.rg-ai-loading__text {
  font-size: 13px;
  color: var(--ai-ink-light);
  letter-spacing: 2px;
}

/* ================================================================
   错误提示
   ================================================================ */
.rg-ai-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(197, 61, 67, 0.08);
  border: 1px solid rgba(197, 61, 67, 0.2);
  font-size: 13px;
  color: #8B3A3A;
  margin-top: 12px;
}

.rg-ai-error__icon {
  font-size: 16px;
  flex-shrink: 0;
}

/* ================================================================
   反向推荐 — 结果区
   ================================================================ */
.rg-ai-results {
  margin-top: 20px;
}

.rg-ai-results__summary {
  font-size: 13px;
  color: var(--ai-ink-light);
  line-height: 1.7;
  margin: 0 0 16px;
  padding: 12px 14px;
  background: var(--ai-amber-bg);
  border-radius: 8px;
  border-left: 3px solid var(--ai-amber);
}

.rg-ai-results__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ---- 城市卡片 ---- */
.rg-ai-city-card {
  display: flex;
  gap: 12px;
  padding: 14px;
  border-radius: 10px;
  background: var(--ai-paper);
  border: 1px solid var(--ai-ink-faint);
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.rg-ai-city-card:hover {
  box-shadow: 0 4px 16px rgba(60, 40, 20, 0.1);
  transform: translateY(-1px);
}

.rg-ai-city-card__content {
  flex: 1;
  min-width: 0;
}

.rg-ai-city-card__header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}

.rg-ai-city-card__index {
  font-size: 12px;
  color: var(--ai-amber);
  font-weight: 700;
  letter-spacing: 1px;
}

.rg-ai-city-card__name {
  font-size: 17px;
  font-weight: 700;
  color: var(--ai-ink);
  letter-spacing: 2px;
}

.rg-ai-city-card__province {
  font-size: 12px;
  color: var(--ai-ink-light);
}

.rg-ai-city-card__reason {
  font-size: 13px;
  color: var(--ai-ink-light);
  line-height: 1.65;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rg-ai-city-card__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rg-ai-city-card__label {
  font-size: 12px;
  color: var(--ai-ink-faint);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ---- 点亮按钮 ---- */
.rg-ai-city-card__adopt {
  align-self: flex-start;
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1.5px solid var(--ai-amber-border);
  background: transparent;
  cursor: pointer;
  font-family: var(--ai-font);
  font-size: 13px;
  color: var(--ai-amber-dark);
  letter-spacing: 2px;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.rg-ai-city-card__adopt:hover:not(:disabled) {
  background: linear-gradient(135deg, #D9B574 0%, #A07838 100%);
  border-color: var(--ai-amber-dark);
  color: #fff;
}

.rg-ai-city-card__adopt--done {
  background: var(--ai-amber-bg);
  border-color: var(--ai-amber-border);
  color: var(--ai-ink-light);
  cursor: default;
}

.rg-ai-city-card__adopt:disabled {
  cursor: default;
}

/* ================================================================
   正向生成 — 下拉选择
   ================================================================ */
.rg-ai-select {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1.5px solid var(--ai-ink-faint);
  background: #fff;
  font-family: var(--ai-font);
  font-size: 14px;
  color: var(--ai-ink);
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235c3a21' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.rg-ai-select:focus {
  outline: none;
  border-color: var(--ai-amber);
}

/* ================================================================
   正向生成 — 天数输入
   ================================================================ */
.rg-ai-days-input {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
}

.rg-ai-days-input__btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid var(--ai-amber-border);
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  font-family: var(--ai-font);
  color: var(--ai-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

.rg-ai-days-input__btn:hover:not(:disabled) {
  background: var(--ai-amber-bg);
  border-color: var(--ai-amber);
}

.rg-ai-days-input__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.rg-ai-days-input__value {
  font-size: 20px;
  font-weight: 700;
  color: var(--ai-ink);
  letter-spacing: 2px;
  min-width: 50px;
  text-align: center;
}

/* ================================================================
   正向生成 — 行程结果
   ================================================================ */
.rg-ai-plan {
  margin-top: 20px;
}

/* ---- 摘要 ---- */
.rg-ai-plan__summary {
  padding: 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(196, 148, 82, 0.08) 0%, rgba(196, 148, 82, 0.03) 100%);
  border: 1px solid var(--ai-amber-border);
  margin-bottom: 16px;
}

.rg-ai-plan__summary-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--ai-ink);
  letter-spacing: 3px;
  margin: 0 0 8px;
}

.rg-ai-plan__summary-text {
  font-size: 13px;
  color: var(--ai-ink-light);
  line-height: 1.7;
  margin: 0 0 10px;
}

.rg-ai-plan__budget {
  font-size: 13px;
  color: var(--ai-amber-dark);
  margin: 0 0 10px;
  letter-spacing: 1px;
}

.rg-ai-plan__highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.rg-ai-plan__highlight-tag {
  padding: 3px 10px;
  border-radius: 12px;
  background: var(--ai-amber-bg);
  border: 1px solid var(--ai-amber-border);
  font-size: 12px;
  color: var(--ai-amber-dark);
  letter-spacing: 1px;
}

/* ---- 按天卡片 ---- */
.rg-ai-plan__days {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.rg-ai-day-card {
  border-radius: 10px;
  border: 1px solid var(--ai-ink-faint);
  background: #fff;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.rg-ai-day-card:hover {
  box-shadow: 0 4px 16px rgba(60, 40, 20, 0.08);
}

.rg-ai-day-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--ai-amber-bg);
  border-bottom: 1px solid var(--ai-ink-faint);
}

.rg-ai-day-card__num {
  font-size: 12px;
  font-weight: 700;
  color: var(--ai-amber-dark);
  letter-spacing: 2px;
  flex-shrink: 0;
}

.rg-ai-day-card__theme {
  font-size: 14px;
  color: var(--ai-ink);
  letter-spacing: 2px;
  font-weight: 700;
}

.rg-ai-day-card__body {
  padding: 12px 14px;
}

.rg-ai-day-card__sub-title {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: var(--ai-ink-light);
  letter-spacing: 2px;
  margin-bottom: 6px;
}

.rg-ai-day-card__activities {
  margin-bottom: 12px;
}

.rg-ai-day-card__activities ul,
.rg-ai-day-card__food ul {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: var(--ai-ink-light);
  line-height: 1.75;
}

.rg-ai-day-card__food {
  border-top: 1px dashed var(--ai-ink-faint);
  padding-top: 12px;
}

/* ---- 保存按钮 ---- */
.rg-ai-save-btn {
  width: 100%;
  padding: 12px 0;
  border: 1.5px solid var(--ai-amber);
  border-radius: 10px;
  background: linear-gradient(135deg, #D9B574 0%, #A07838 100%);
  cursor: pointer;
  font-family: var(--ai-font);
  font-size: 16px;
  color: #fff;
  letter-spacing: 4px;
  margin-top: 18px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(160, 120, 56, 0.25);
}

.rg-ai-save-btn:hover {
  box-shadow: 0 4px 16px rgba(160, 120, 56, 0.4);
  transform: translateY(-1px);
}

.rg-ai-save-btn:active {
  transform: translateY(0);
}
`;