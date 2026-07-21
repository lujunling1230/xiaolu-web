import { useState, useCallback, useEffect, useRef } from "react";
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
  /** 居中模式：地球按钮内联居中，不固定在右下角 */
  centered?: boolean;
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
  { label: "穷游也快乐", value: "穷游" },
  { label: "性价比之选", value: "适中" },
  { label: "随心不设限", value: "不限" },
] as const;

const PACES = [
  { label: "慢节奏", value: "慢节奏" },
  { label: "适中", value: "适中" },
  { label: "紧凑", value: "紧凑" },
] as const;

const INTERESTS = [
  "自然风光",
  "历史人文",
  "美食探店",
  "文艺手作",
  "户外徒步",
  "海岛度假",
] as const;

// 常用中国旅游城市库（用于"生成攻略"Tab 的城市下拉）
const POPULAR_CITIES = [
  "北京", "上海", "广州", "深圳", "杭州", "成都", "重庆", "西安",
  "南京", "苏州", "厦门", "长沙", "武汉", "青岛", "大连", "昆明",
  "大理", "丽江", "桂林", "三亚", "拉萨", "西宁", "兰州", "敦煌",
  "张家界", "凤凰", "景德镇", "黄山", "无锡", "扬州", "绍兴", "宁波",
  "福州", "泉州", "潮州", "汕头", "北海", "贵阳", "遵义", "九江",
  "洛阳", "开封", "平遥", "大同", "承德", "哈尔滨", "长春", "沈阳",
  "呼和浩特", "银川", "乌鲁木齐", "吐鲁番", "喀什", "阿勒泰", "稻城",
  "康定", "西双版纳", "腾冲", "香格里拉", "日喀则", "林芝", "青海湖",
  "秦皇岛", "威海", "烟台", "连云港", "舟山", "北海", "海口", "文昌",
] as const;

const COMPANIONS = [
  { label: "独行", value: "独行" },
  { label: "情侣", value: "情侣" },
  { label: "家庭", value: "家庭" },
  { label: "朋友", value: "朋友" },
] as const;

const CROWD_TAGS = ["带老人", "带小孩", "无特殊需求"] as const;

const COMPACTNESS_LABELS = ["轻松", "适中", "紧凑"] as const;

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
  centered = false,
}: AIAssistantPanelProps) {
  /* ---- 状态 ---- */
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("reverse");

  /* 监听导航栏打开事件 */
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("rg-open-ai", handler);
    return () => window.removeEventListener("rg-open-ai", handler);
  }, []);

  /* Toast 系统 */
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const toastIdRef = useRef(0);

  const showToast = useCallback((message: string) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  /* 反向推荐表单 */
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedPace, setSelectedPace] = useState<string>("");
  const [selectedCompanion, setSelectedCompanion] = useState<string>("");
  const [selectedCrowdTags, setSelectedCrowdTags] = useState<string[]>([]);

  /* 正向生成表单 */
  const [selectedCity, setSelectedCity] = useState("");
  const [tripDays, setTripDays] = useState(3);
  const [compactness, setCompactness] = useState(1); // 0=轻松, 1=适中, 2=紧凑

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

  const toggleCrowdTag = (tag: string) => {
    setSelectedCrowdTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleReverseRecommend = async () => {
    const hasSeasonOrInterest =
      selectedSeasons.length > 0 || selectedInterests.length > 0;
    if (!hasSeasonOrInterest && !selectedBudget) {
      showToast("请先选择您的旅行偏好哦~");
      return;
    }
    try {
      await onReverseRecommend({
        preferences: {
          season: selectedSeasons.length > 0 ? selectedSeasons.join(",") : undefined,
          budget: selectedBudget || undefined,
          pace: selectedPace || undefined,
          interests: selectedInterests,
        },
      });
    } catch {
      /* 错误已通过 props 传递 */
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
      /* 错误已通过 props 传递 */
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
      showToast("攻略已保存到城市记忆");
    } else {
      // 城市不在列表中，自动创建一个新城市记录
      const newCity: City = {
        id: Date.now(),
        name: selectedCity,
        province: "未知",
        coord: { lng: 0, lat: 0 },
        slogan: lastGenerateResult.plan.summary?.slice(0, 20) || "AI 推荐攻略",
        imageUrl: "",
        days: lastGenerateResult.plan.days || 3,
        play: [],
        eat: [],
        stay: "",
        tips: "",
        light_source: "ai_recommend",
        explore_count: 0,
        manual_guide: "",
        ai_plan: lastGenerateResult.plan,
        weather_tags: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      onSavePlan(newCity, lastGenerateResult);
      showToast("攻略已保存为新城市记忆");
    }
  };

  /* ---- 构建摘要文案 ---- */
  const buildSummary = () => {
    const seasonText =
      selectedSeasons.length > 0 ? selectedSeasons.join("") : undefined;
    const budgetText = selectedBudget || undefined;
    if (seasonText && budgetText) {
      return `为你挑选了 ${seasonText} 出行、${budgetText}友好的宝藏城市`;
    }
    if (seasonText) return `为你挑选了适合 ${seasonText} 出行的宝藏城市`;
    if (budgetText) return `为你挑选了 ${budgetText}友好的宝藏城市`;
    return undefined;
  };

  /* ---- 渲染 ---- */

  return (
    <>
      <style>{CSS}</style>

      {/* ===== 小地球悬浮按钮 ===== */}
      <button
        className={`rg-ai-globe${centered ? " rg-ai-globe--centered" : ""}`}
        onClick={() => setOpen(true)}
        aria-label="打开 AI 旅行向导"
        title="AI 旅行向导"
      >
        <svg className="rg-ai-globe__svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 地球外轮廓 */}
          <circle cx="32" cy="32" r="28" stroke="#5B9A8B" strokeWidth="2.5" fill="rgba(91,154,139,0.12)" />
          {/* 赤道 */}
          <ellipse cx="32" cy="32" rx="28" ry="8" stroke="#5B9A8B" strokeWidth="1.2" fill="none" opacity="0.6" />
          {/* 经线 */}
          <ellipse cx="32" cy="32" rx="12" ry="28" stroke="#5B9A8B" strokeWidth="1.2" fill="none" opacity="0.5" />
          <ellipse cx="32" cy="32" rx="22" ry="28" stroke="#5B9A8B" strokeWidth="1" fill="none" opacity="0.35" />
          {/* 大陆轮廓（简化） */}
          <path d="M20 24 Q26 20 30 26 T38 22 Q42 24 40 30 T44 36 Q40 42 34 40 T28 44 Q22 42 24 36 T20 30 Q18 26 20 24Z" fill="rgba(91,154,139,0.25)" stroke="#5B9A8B" strokeWidth="1" />
          {/* 定位标记 */}
          <circle cx="44" cy="20" r="3" fill="#C4953A" />
          <circle cx="44" cy="20" r="6" stroke="#C4953A" strokeWidth="1" fill="none" opacity="0.4">
            <animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
        <span className="rg-ai-globe__pulse" />
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
        {/* Toast 容器 */}
        <div className="rg-ai-toast-container">
          {toasts.map((t) => (
            <div key={t.id} className="rg-ai-toast">
              {t.message}
            </div>
          ))}
        </div>

        {/* 标题栏 */}
        <div className="rg-ai-drawer__header">
          <div className="rg-ai-drawer__brand">
            <svg className="rg-ai-drawer__globe-icon" viewBox="0 0 24 24" fill="none" stroke="#5B9A8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <div>
              <h3 className="rg-ai-drawer__title">漫游向导</h3>
              <span className="rg-ai-drawer__subtitle">为你指路，也为你留一盏灯</span>
            </div>
          </div>
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
            下一站去哪
          </button>
          <button
            className={`rg-ai-tabs__btn${activeTab === "forward" ? " rg-ai-tabs__btn--active" : ""}`}
            onClick={() => setActiveTab("forward")}
          >
            替我规划
          </button>
        </div>

        {/* 内容区 */}
        <div className="rg-ai-body">
          {activeTab === "reverse" ? (
            <ReverseTab
              selectedSeasons={selectedSeasons}
              selectedBudget={selectedBudget}
              selectedInterests={selectedInterests}
              selectedPace={selectedPace}
              selectedCompanion={selectedCompanion}
              selectedCrowdTags={selectedCrowdTags}
              loading={recommendLoading}
              error={recommendError}
              result={lastRecommendResult}
              adoptedNames={adoptedNames}
              customSummary={buildSummary()}
              onToggleSeason={toggleSeason}
              onSelectBudget={setSelectedBudget}
              onToggleInterest={toggleInterest}
              onSelectPace={setSelectedPace}
              onSelectCompanion={setSelectedCompanion}
              onToggleCrowdTag={toggleCrowdTag}
              onSubmit={handleReverseRecommend}
              onAdopt={handleAdopt}
            />
          ) : (
            <ForwardTab
              cities={cities}
              selectedCity={selectedCity}
              tripDays={tripDays}
              compactness={compactness}
              loading={generateLoading}
              error={generateError}
              result={lastGenerateResult}
              onSelectCity={setSelectedCity}
              onDaysChange={setTripDays}
              onCompactnessChange={setCompactness}
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
  selectedPace: string;
  selectedCompanion: string;
  selectedCrowdTags: string[];
  loading: boolean;
  error: string | null;
  result: AIReverseRecommendResponse | null;
  adoptedNames: Set<string>;
  customSummary: string | undefined;
  onToggleSeason: (s: string) => void;
  onSelectBudget: (b: string) => void;
  onToggleInterest: (i: string) => void;
  onSelectPace: (p: string) => void;
  onSelectCompanion: (c: string) => void;
  onToggleCrowdTag: (t: string) => void;
  onSubmit: () => void;
  onAdopt: (city: AIReverseRecommendResponse["cities"][0]) => void;
}

function ReverseTab({
  selectedSeasons,
  selectedBudget,
  selectedInterests,
  selectedPace,
  selectedCompanion,
  selectedCrowdTags,
  loading,
  error,
  result,
  adoptedNames,
  customSummary,
  onToggleSeason,
  onSelectBudget,
  onToggleInterest,
  onSelectPace,
  onSelectCompanion,
  onToggleCrowdTag,
  onSubmit,
  onAdopt,
}: ReverseTabProps) {
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const showEmptyState = result && !loading && result.cities.length === 0;

  return (
    <div className="rg-ai-reverse">
      {/* 1. 季节选择 */}
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

      {/* 2. 预算选择 */}
      <section className="rg-ai-section">
        <h4 className="rg-ai-section__title">预算范围</h4>
        <div className="rg-ai-tags-row">
          {BUDGETS.map((b) => (
            <button
              key={b.value}
              className={`rg-ai-tag${selectedBudget === b.value ? " rg-ai-tag--active" : ""}`}
              onClick={() =>
                onSelectBudget(selectedBudget === b.value ? "" : b.value)
              }
            >
              {b.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. 节奏选择 */}
      <section className="rg-ai-section">
        <h4 className="rg-ai-section__title">节奏偏好</h4>
        <div className="rg-ai-tags-row">
          {PACES.map((p) => (
            <button
              key={p.value}
              className={`rg-ai-tag${selectedPace === p.value ? " rg-ai-tag--active" : ""}`}
              onClick={() =>
                onSelectPace(selectedPace === p.value ? "" : p.value)
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* 4. 兴趣标签 */}
      <section className="rg-ai-section">
        <h4 className="rg-ai-section__title">兴趣方向</h4>
        <div className="rg-ai-tags-row">
          {INTERESTS.map((tag) => (
            <button
              key={tag}
              className={`rg-ai-tag${selectedInterests.includes(tag) ? " rg-ai-tag--active" : ""}`}
              onClick={() => onToggleInterest(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* 5. 出行人数（圆形按钮，单选） */}
      <section className="rg-ai-section">
        <h4 className="rg-ai-section__title">出行人数</h4>
        <div className="rg-ai-circle-group">
          {COMPANIONS.map((c) => (
            <button
              key={c.value}
              className={`rg-ai-circle-btn${selectedCompanion === c.value ? " rg-ai-circle-btn--active" : ""}`}
              onClick={() =>
                onSelectCompanion(
                  selectedCompanion === c.value ? "" : c.value
                )
              }
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* 6. 人群标签 */}
      <section className="rg-ai-section">
        <h4 className="rg-ai-section__title">人群标签</h4>
        <div className="rg-ai-tags-row">
          {CROWD_TAGS.map((tag) => (
            <button
              key={tag}
              className={`rg-ai-tag${selectedCrowdTags.includes(tag) ? " rg-ai-tag--active" : ""}`}
              onClick={() => onToggleCrowdTag(tag)}
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
          <span className="rg-ai-loading__compass" />
          <span className="rg-ai-loading__text">正在翻阅旅行手记...</span>
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
      {result && !loading && result.cities.length > 0 && (
        <div className="rg-ai-results rg-ai-fade-in-up">
          {(customSummary || result.summary) && (
            <p className="rg-ai-results__summary">
              {customSummary || result.summary}
            </p>
          )}
          <div className="rg-ai-results__list">
            {result.cities.map((city, idx) => {
              const isExpanded = expandedCity === city.name;
              return (
                <div
                  key={city.name}
                  className="rg-ai-city-card rg-ai-fade-in-up"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="rg-ai-city-card__content">
                    <div className="rg-ai-city-card__header">
                      <span className="rg-ai-city-card__index">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="rg-ai-city-card__name">
                        {city.name}
                      </span>
                      <span className="rg-ai-city-card__province">
                        {city.province}
                      </span>
                      <button
                        className="rg-ai-city-card__detail-btn"
                        onClick={() => setExpandedCity(isExpanded ? null : city.name)}
                      >
                        {isExpanded ? "收起" : "查看详情"}
                      </button>
                    </div>
                    <p className="rg-ai-city-card__reason">{city.reason}</p>
                    <div className="rg-ai-city-card__meta">
                      <span className="rg-ai-city-card__label">
                        亮点：{city.highlights.join(" / ")}
                      </span>
                      <span className="rg-ai-city-card__label">
                        最佳季节：{city.best_season}
                      </span>
                    </div>

                    {/* 展开详情：吃喝住玩 */}
                    {isExpanded && (
                      <div className="rg-ai-city-card__details">
                        {city.play && city.play.length > 0 && (
                          <div className="rg-ai-detail-row">
                            <span className="rg-ai-detail-label">🎯 玩</span>
                            <div className="rg-ai-detail-list">
                              {city.play.map((p, i) => (
                                <span key={i} className="rg-ai-detail-chip">{p}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {city.food && city.food.length > 0 && (
                          <div className="rg-ai-detail-row">
                            <span className="rg-ai-detail-label">🍜 美食</span>
                            <div className="rg-ai-detail-list">
                              {city.food.map((f, i) => (
                                <span key={i} className="rg-ai-detail-chip">{f}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {city.accommodation && (
                          <div className="rg-ai-detail-row">
                            <span className="rg-ai-detail-label">🏨 住宿</span>
                            <p className="rg-ai-detail-text">{city.accommodation}</p>
                          </div>
                        )}
                        {city.transport && (
                          <div className="rg-ai-detail-row">
                            <span className="rg-ai-detail-label">🚄 交通</span>
                            <p className="rg-ai-detail-text">{city.transport}</p>
                          </div>
                        )}
                        {city.estimated_cost && (
                          <div className="rg-ai-detail-row">
                            <span className="rg-ai-detail-label">💰 预算</span>
                            <p className="rg-ai-detail-text">{city.estimated_cost}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    className={`rg-ai-city-card__adopt${adoptedNames.has(city.name) ? " rg-ai-city-card__adopt--done" : ""}`}
                    onClick={() => onAdopt(city)}
                    disabled={adoptedNames.has(city.name)}
                  >
                    {adoptedNames.has(city.name) ? "\u2713 已加入" : "加入想去"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 空结果状态 */}
      {showEmptyState && (
        <div className="rg-ai-empty-state">
          <span className="rg-ai-empty-state__icon">&#x1F30D;</span>
          <p className="rg-ai-empty-state__text">
            暂未找到匹配城市，试试放宽条件吧
          </p>
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
  compactness: number;
  loading: boolean;
  error: string | null;
  result: AIForwardGenerateResponse | null;
  onSelectCity: (c: string) => void;
  onDaysChange: (d: number) => void;
  onCompactnessChange: (v: number) => void;
  onSubmit: () => void;
  onSave: () => void;
}

function ForwardTab({
  cities,
  selectedCity,
  tripDays,
  compactness,
  loading,
  error,
  result,
  onSelectCity,
  onDaysChange,
  onCompactnessChange,
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
          {/* 用户已添加的城市优先显示 */}
          {cities.length > 0 && (
            <optgroup label="我的城市记忆">
              {cities.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}（{c.province}）
                </option>
              ))}
            </optgroup>
          )}
          {/* 常用中国旅游城市库 */}
          <optgroup label="热门旅游城市">
            {POPULAR_CITIES.filter(
              (name) => !cities.some((c) => c.name === name)
            ).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </optgroup>
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

      {/* 行程紧凑度滑块 */}
      <section className="rg-ai-section">
        <h4 className="rg-ai-section__title">行程紧凑度</h4>
        <div className="rg-ai-compactness">
          <div className="rg-ai-compactness__labels">
            {COMPACTNESS_LABELS.map((label, i) => (
              <span
                key={label}
                className={`rg-ai-compactness__label${compactness === i ? " rg-ai-compactness__label--active" : ""}`}
              >
                {label}
              </span>
            ))}
          </div>
          <input
            type="range"
            className="rg-ai-compactness__slider"
            min={0}
            max={2}
            step={1}
            value={compactness}
            onChange={(e) => onCompactnessChange(Number(e.target.value))}
          />
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
          <span className="rg-ai-loading__compass" />
          <span className="rg-ai-loading__text">正在规划行程路线...</span>
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
        <div className="rg-ai-plan rg-ai-fade-in-up">
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
                    <span className="rg-ai-day-card__sub-title">
                      行程安排
                    </span>
                    <ul>
                      {day.activities.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rg-ai-day-card__food">
                    <span className="rg-ai-day-card__sub-title">
                      美食推荐
                    </span>
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
   ================================================================ */

const CSS = `
/* ================================================================
   动画关键帧
   ================================================================ */
@keyframes rg-ai-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rg-ai-fadeInUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rg-ai-toast-in {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rg-ai-toast-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-100%);
  }
}

/* ================================================================
   小地球悬浮按钮
   ================================================================ */
.rg-ai-globe {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9000;
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #f8f6f2 0%, #ede8e0 100%);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 16px rgba(0,0,0,0.12),
    0 0 0 1px rgba(176,141,87,0.15),
    inset 0 1px 0 rgba(255,255,255,0.8);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.3s ease;
  pointer-events: auto;
}

/* 居中模式：内联显示，不固定定位 */
.rg-ai-globe--centered {
  position: static;
  margin: 0 auto;
  width: 72px;
  height: 72px;
}

.rg-ai-globe__svg {
  width: 34px;
  height: 34px;
  animation: rg-globe-spin 12s linear infinite;
}

.rg-ai-globe__pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid rgba(196,149,58,0.3);
  opacity: 0;
  animation: rg-globe-pulse 2s ease-in-out infinite;
}

/* Hover: 上浮 + 脉冲加速 */
.rg-ai-globe:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow:
    0 8px 24px rgba(0,0,0,0.15),
    0 0 0 1px rgba(176,141,87,0.3),
    inset 0 1px 0 rgba(255,255,255,0.8);
}

.rg-ai-globe:hover .rg-ai-globe__pulse {
  animation-duration: 1.2s;
}

/* Click: 物理反馈 */
.rg-ai-globe:active {
  transform: scale(0.92);
  box-shadow:
    0 2px 8px rgba(0,0,0,0.1),
    0 0 0 1px rgba(176,141,87,0.2);
}

@keyframes rg-globe-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes rg-globe-pulse {
  0%, 100% { transform: scale(1); opacity: 0; }
  50%      { transform: scale(1.15); opacity: 0.5; }
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
  background: var(--rg-paper, #F5F0E6);
  box-shadow: -6px 0 28px rgba(60, 40, 20, 0.18), -2px 0 8px rgba(60, 40, 20, 0.08);
  font-family: "KaiTi", "STKaiti", "Noto Serif SC", serif;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease;
  overflow: hidden;
  color: var(--rg-ink, #5c3a21);
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

/* ================================================================
   Toast 提示系统
   ================================================================ */
.rg-ai-toast-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px 0;
  pointer-events: none;
  gap: 8px;
}

.rg-ai-toast {
  pointer-events: auto;
  padding: 10px 20px;
  border-radius: 8px;
  background: var(--rg-accent, #D4884A);
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.06em;
  line-height: 1.5;
  white-space: nowrap;
  animation: rg-ai-toast-in 0.3s ease forwards;
  box-shadow: 0 4px 12px rgba(212, 136, 74, 0.35);
}

.rg-ai-toast:last-child {
  animation: rg-ai-toast-in 0.3s ease forwards;
}

/* ================================================================
   标题栏
   ================================================================ */
.rg-ai-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--rg-ink-border, #C8B898);
  flex-shrink: 0;
}

.rg-ai-drawer__brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rg-ai-drawer__globe-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  opacity: 0.8;
}

.rg-ai-drawer__title {
  font-size: var(--rg-text-h3, 17px);
  font-weight: var(--rg-weight-title, 600);
  color: var(--rg-ink, #5c3a21);
  letter-spacing: 3px;
  margin: 0;
  line-height: 1.3;
}

.rg-ai-drawer__subtitle {
  font-size: 11px;
  color: var(--rg-ink-light, #8B7D6B);
  letter-spacing: 1px;
  display: block;
  margin-top: 2px;
}

.rg-ai-drawer__close {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
  color: var(--rg-ink-light, #8B7D6B);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, color 0.2s ease;
}

.rg-ai-drawer__close:hover {
  background: rgba(92, 58, 33, 0.08);
  color: var(--rg-ink, #5c3a21);
}

/* ================================================================
   Tabs
   ================================================================ */
.rg-ai-tabs {
  display: flex;
  padding: 12px 20px 0;
  gap: 0;
  border-bottom: 1px solid var(--rg-ink-border, #C8B898);
  flex-shrink: 0;
}

.rg-ai-tabs__btn {
  flex: 1;
  padding: 10px 0;
  border: none;
  background: none;
  cursor: pointer;
  font-family: "KaiTi", "STKaiti", "Noto Serif SC", serif;
  font-size: var(--rg-text-body, 15px);
  color: var(--rg-ink-light, #8B7D6B);
  letter-spacing: 2px;
  position: relative;
  transition: color 0.25s ease;
  border-bottom: 2.5px solid transparent;
}

.rg-ai-tabs__btn--active {
  color: var(--rg-primary, #4A8B6F);
  font-weight: var(--rg-weight-title, 600);
  border-bottom-color: var(--rg-primary, #4A8B6F);
}

.rg-ai-tabs__btn:hover:not(.rg-ai-tabs__btn--active) {
  color: var(--rg-ink, #5c3a21);
}

/* ================================================================
   Body 滚动区
   ================================================================ */
.rg-ai-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--rg-space-md, 16px) 20px 32px;
  font-size: var(--rg-text-body, 15px);
  font-weight: var(--rg-weight-body, 400);
  line-height: var(--rg-leading-body, 1.85);
  letter-spacing: var(--rg-tracking-body, 0.06em);
}

.rg-ai-body::-webkit-scrollbar {
  width: 4px;
}

.rg-ai-body::-webkit-scrollbar-track {
  background: transparent;
}

.rg-ai-body::-webkit-scrollbar-thumb {
  background: var(--rg-ink-border, #C8B898);
  border-radius: 2px;
}

/* ================================================================
   通用 Section
   ================================================================ */
.rg-ai-section {
  margin-bottom: 18px;
}

.rg-ai-section__title {
  font-size: var(--rg-text-h3, 18px);
  font-weight: var(--rg-weight-title, 600);
  color: var(--rg-ink, #5c3a21);
  letter-spacing: 3px;
  margin: 0 0 10px;
}

/* ================================================================
   标签行（通用）
   ================================================================ */
.rg-ai-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.rg-ai-tag {
  padding: 5px 14px;
  border-radius: 20px;
  border: 1.5px solid var(--rg-ink-border, #C8B898);
  background: transparent;
  cursor: pointer;
  font-family: "KaiTi", "STKaiti", "Noto Serif SC", serif;
  font-size: 13px;
  color: var(--rg-ink-light, #8B7D6B);
  transition: all 0.25s ease;
  white-space: nowrap;
}

.rg-ai-tag:hover {
  border-color: var(--rg-primary, #4A8B6F);
  color: var(--rg-ink, #5c3a21);
  background: rgba(74, 139, 111, 0.06);
}

.rg-ai-tag--active {
  background: var(--rg-primary, #4A8B6F);
  border-color: var(--rg-primary, #4A8B6F);
  color: #fff;
}

/* ================================================================
   反向推荐 -- 季节按钮（圆形）
   ================================================================ */
.rg-ai-seasons {
  display: flex;
  gap: 10px;
}

.rg-ai-season-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1.5px solid var(--rg-ink-border, #C8B898);
  background: transparent;
  cursor: pointer;
  font-family: "KaiTi", "STKaiti", "Noto Serif SC", serif;
  font-size: 16px;
  color: var(--rg-ink, #5c3a21);
  transition: all 0.25s ease;
}

.rg-ai-season-btn:hover {
  border-color: var(--rg-primary, #4A8B6F);
  background: rgba(74, 139, 111, 0.06);
}

.rg-ai-season-btn--active {
  background: var(--rg-primary, #4A8B6F);
  border-color: var(--rg-primary, #4A8B6F);
  color: #fff;
  font-weight: 700;
}

/* ================================================================
   出行人数 -- 圆形单选按钮
   ================================================================ */
.rg-ai-circle-group {
  display: flex;
  gap: 10px;
}

.rg-ai-circle-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 1.5px solid var(--rg-ink-border, #C8B898);
  background: transparent;
  cursor: pointer;
  font-family: "KaiTi", "STKaiti", "Noto Serif SC", serif;
  font-size: 14px;
  color: var(--rg-ink, #5c3a21);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.rg-ai-circle-btn:hover {
  border-color: var(--rg-primary, #4A8B6F);
  background: rgba(74, 139, 111, 0.06);
}

.rg-ai-circle-btn--active {
  background: var(--rg-primary, #4A8B6F);
  border-color: var(--rg-primary, #4A8B6F);
  color: #fff;
  font-weight: var(--rg-weight-title, 600);
}

/* ================================================================
   提交按钮
   ================================================================ */
.rg-ai-submit-btn {
  width: 100%;
  padding: 12px 0;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--rg-primary, #4A8B6F) 0%, #3a7a5e 100%);
  cursor: pointer;
  font-family: "KaiTi", "STKaiti", "Noto Serif SC", serif;
  font-size: var(--rg-text-h3, 18px);
  color: #fff;
  letter-spacing: 4px;
  font-weight: var(--rg-weight-title, 600);
  transition: all 0.3s ease;
  margin-top: 4px;
  box-shadow: 0 2px 8px rgba(74, 139, 111, 0.3);
}

.rg-ai-submit-btn:hover:not(:disabled) {
  box-shadow: 0 4px 16px rgba(74, 139, 111, 0.45);
  transform: translateY(-1px);
}

.rg-ai-submit-btn:active:not(:disabled) {
  transform: translateY(0);
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
  width: 36px;
  height: 36px;
  border: 3px solid var(--rg-ink-border, #C8B898);
  border-top-color: var(--rg-primary, #4A8B6F);
  border-radius: 50%;
  animation: rg-ai-spin 1.2s linear infinite;
}

.rg-ai-loading__text {
  font-size: 13px;
  color: var(--rg-ink-light, #8B7D6B);
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
   淡入上浮动画
   ================================================================ */
.rg-ai-fade-in-up {
  animation: rg-ai-fadeInUp 0.5s ease forwards;
}

/* ================================================================
   反向推荐 -- 结果区
   ================================================================ */
.rg-ai-results {
  margin-top: 20px;
}

.rg-ai-results__summary {
  font-size: 13px;
  color: var(--rg-ink-light, #8B7D6B);
  line-height: var(--rg-leading-body, 1.85);
  margin: 0 0 16px;
  padding: 12px 14px;
  background: rgba(74, 139, 111, 0.08);
  border-radius: 8px;
  border-left: 3px solid var(--rg-primary, #4A8B6F);
  letter-spacing: var(--rg-tracking-body, 0.06em);
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
  background: var(--rg-paper, #F5F0E6);
  border: 1px solid var(--rg-ink-border, #C8B898);
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
  flex-wrap: wrap;
}

.rg-ai-city-card__detail-btn {
  margin-left: auto;
  background: none;
  border: 1px solid var(--rg-ink-border, #C8B898);
  border-radius: 12px;
  padding: 2px 10px;
  font-size: 11px;
  color: var(--rg-ink-light, #8B7D6B);
  cursor: pointer;
  font-family: var(--rg-font-serif, 'Noto Serif SC', serif);
  letter-spacing: 1px;
  transition: all 0.2s;
}

.rg-ai-city-card__detail-btn:hover {
  border-color: #8B7355;
  color: #5c3a21;
}

.rg-ai-city-card__index {
  font-size: 12px;
  color: var(--rg-primary, #4A8B6F);
  font-weight: 700;
  letter-spacing: 1px;
}

.rg-ai-city-card__name {
  font-size: 17px;
  font-weight: 700;
  color: var(--rg-ink, #5c3a21);
  letter-spacing: 2px;
}

.rg-ai-city-card__province {
  font-size: 12px;
  color: var(--rg-ink-light, #8B7D6B);
}

.rg-ai-city-card__reason {
  font-size: 13px;
  color: var(--rg-ink-light, #8B7D6B);
  line-height: var(--rg-leading-body, 1.85);
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: var(--rg-tracking-body, 0.06em);
}

.rg-ai-city-card__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rg-ai-city-card__label {
  font-size: 12px;
  color: var(--rg-ink-border, #C8B898);
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
  border: 1.5px solid var(--rg-primary, #4A8B6F);
  background: transparent;
  cursor: pointer;
  font-family: "KaiTi", "STKaiti", "Noto Serif SC", serif;
  font-size: 13px;
  color: var(--rg-primary, #4A8B6F);
  letter-spacing: 2px;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.rg-ai-city-card__adopt:hover:not(:disabled) {
  background: var(--rg-primary, #4A8B6F);
  color: #fff;
}

.rg-ai-city-card__adopt--done {
  background: rgba(74, 139, 111, 0.1);
  border-color: var(--rg-ink-border, #C8B898);
  color: var(--rg-ink-light, #8B7D6B);
  cursor: default;
}

.rg-ai-city-card__adopt:disabled {
  cursor: default;
}

/* ---- 详情展开区域 ---- */
.rg-ai-city-card__details {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--rg-ink-border, #E0D8C8);
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: rg-ai-detail-fade 0.3s ease-out;
}

@keyframes rg-ai-detail-fade {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.rg-ai-detail-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.rg-ai-detail-label {
  flex-shrink: 0;
  font-size: 12px;
  color: var(--rg-primary, #4A8B6F);
  font-weight: 600;
  letter-spacing: 1px;
  min-width: 48px;
}

.rg-ai-detail-text {
  font-size: 12px;
  color: var(--rg-ink, #5c3a21);
  line-height: 1.7;
  margin: 0;
  flex: 1;
}

.rg-ai-detail-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
}

.rg-ai-detail-chip {
  font-size: 11px;
  color: var(--rg-ink, #5c3a21);
  background: rgba(92,58,33,0.06);
  padding: 2px 8px;
  border-radius: 10px;
  line-height: 1.6;
}

/* ================================================================
   空结果状态
   ================================================================ */
.rg-ai-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px;
  gap: 12px;
}

.rg-ai-empty-state__icon {
  font-size: 40px;
  line-height: 1;
}

.rg-ai-empty-state__text {
  font-size: var(--rg-text-body, 15px);
  color: var(--rg-ink-light, #8B7D6B);
  margin: 0;
  letter-spacing: var(--rg-tracking-body, 0.06em);
}

/* ================================================================
   正向生成 -- 下拉选择
   ================================================================ */
.rg-ai-select {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1.5px solid var(--rg-ink-border, #C8B898);
  background: #fff;
  font-family: "KaiTi", "STKaiti", "Noto Serif SC", serif;
  font-size: 14px;
  color: var(--rg-ink, #5c3a21);
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234A8B6F' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.rg-ai-select:focus {
  outline: none;
  border-color: var(--rg-primary, #4A8B6F);
}

/* ================================================================
   正向生成 -- 天数输入
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
  border: 1.5px solid var(--rg-ink-border, #C8B898);
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  font-family: "KaiTi", "STKaiti", "Noto Serif SC", serif;
  color: var(--rg-ink, #5c3a21);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

.rg-ai-days-input__btn:hover:not(:disabled) {
  background: rgba(74, 139, 111, 0.06);
  border-color: var(--rg-primary, #4A8B6F);
}

.rg-ai-days-input__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.rg-ai-days-input__value {
  font-size: 20px;
  font-weight: var(--rg-weight-title, 600);
  color: var(--rg-ink, #5c3a21);
  letter-spacing: 2px;
  min-width: 50px;
  text-align: center;
}

/* ================================================================
   正向生成 -- 行程紧凑度滑块
   ================================================================ */
.rg-ai-compactness {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rg-ai-compactness__labels {
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
}

.rg-ai-compactness__label {
  font-size: 13px;
  color: var(--rg-ink-light, #8B7D6B);
  transition: color 0.2s ease, font-weight 0.2s ease;
}

.rg-ai-compactness__label--active {
  color: var(--rg-primary, #4A8B6F);
  font-weight: var(--rg-weight-title, 600);
}

.rg-ai-compactness__slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--rg-ink-border, #C8B898);
  outline: none;
  cursor: pointer;
}

.rg-ai-compactness__slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--rg-primary, #4A8B6F);
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(74, 139, 111, 0.35);
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.rg-ai-compactness__slider::-webkit-slider-thumb:hover {
  box-shadow: 0 3px 10px rgba(74, 139, 111, 0.5);
}

.rg-ai-compactness__slider::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--rg-primary, #4A8B6F);
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(74, 139, 111, 0.35);
  cursor: pointer;
}

/* ================================================================
   正向生成 -- 行程结果
   ================================================================ */
.rg-ai-plan {
  margin-top: 20px;
}

/* ---- 摘要 ---- */
.rg-ai-plan__summary {
  padding: 16px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    rgba(74, 139, 111, 0.08) 0%,
    rgba(74, 139, 111, 0.03) 100%
  );
  border: 1px solid rgba(74, 139, 111, 0.25);
  margin-bottom: 16px;
}

.rg-ai-plan__summary-title {
  font-size: var(--rg-text-h3, 18px);
  font-weight: var(--rg-weight-title, 600);
  color: var(--rg-ink, #5c3a21);
  letter-spacing: 3px;
  margin: 0 0 8px;
}

.rg-ai-plan__summary-text {
  font-size: 13px;
  color: var(--rg-ink-light, #8B7D6B);
  line-height: var(--rg-leading-body, 1.85);
  margin: 0 0 10px;
  letter-spacing: var(--rg-tracking-body, 0.06em);
}

.rg-ai-plan__budget {
  font-size: 13px;
  color: var(--rg-accent, #D4884A);
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
  background: rgba(74, 139, 111, 0.08);
  border: 1px solid rgba(74, 139, 111, 0.25);
  font-size: 12px;
  color: var(--rg-primary, #4A8B6F);
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
  border: 1px solid var(--rg-ink-border, #C8B898);
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
  background: rgba(74, 139, 111, 0.06);
  border-bottom: 1px solid var(--rg-ink-border, #C8B898);
}

.rg-ai-day-card__num {
  font-size: 12px;
  font-weight: 700;
  color: var(--rg-primary, #4A8B6F);
  letter-spacing: 2px;
  flex-shrink: 0;
}

.rg-ai-day-card__theme {
  font-size: 14px;
  color: var(--rg-ink, #5c3a21);
  letter-spacing: 2px;
  font-weight: var(--rg-weight-title, 600);
}

.rg-ai-day-card__body {
  padding: 12px 14px;
}

.rg-ai-day-card__sub-title {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: var(--rg-ink-light, #8B7D6B);
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
  color: var(--rg-ink-light, #8B7D6B);
  line-height: var(--rg-leading-body, 1.85);
  letter-spacing: var(--rg-tracking-body, 0.06em);
}

.rg-ai-day-card__food {
  border-top: 1px dashed var(--rg-ink-border, #C8B898);
  padding-top: 12px;
}

/* ---- 保存按钮 ---- */
.rg-ai-save-btn {
  width: 100%;
  padding: 12px 0;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--rg-primary, #4A8B6F) 0%, #3a7a5e 100%);
  cursor: pointer;
  font-family: "KaiTi", "STKaiti", "Noto Serif SC", serif;
  font-size: var(--rg-text-h3, 18px);
  color: #fff;
  letter-spacing: 4px;
  font-weight: var(--rg-weight-title, 600);
  margin-top: 18px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(74, 139, 111, 0.3);
}

.rg-ai-save-btn:hover {
  box-shadow: 0 4px 16px rgba(74, 139, 111, 0.45);
  transform: translateY(-1px);
}

.rg-ai-save-btn:active {
  transform: translateY(0);
}
`;