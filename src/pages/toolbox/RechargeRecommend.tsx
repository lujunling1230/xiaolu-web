import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  type UserState,
  type Recommendation,
  type Badge,
  type MoodType,
  type WeatherType,
  type EnergyLevel,
  type EnergyTag,
  type CompletionRecord,
  WEATHER_MAP,
  MOOD_MAP,
  ENERGY_MAP,
  TAG_MAP,
  SCENE_PRESETS,
  getRecommendations,
  loadUserState,
  saveUserState,
  loadHistory,
  saveCompletion,
  extractPreferenceKeywords,
  getTodayCount,
  getStreakDays,
  getBadges,
} from "./rechargeTags";

/* ============================================================
   接口
   ============================================================ */
interface RechargeRecommendProps {
  doneIds: Set<number>;
  onToggle: (id: number) => void;
  /** 推荐项被完成后的反馈回调 */
  onRecommendCompleted?: (id: number) => void;
}

/* ============================================================
   完成反馈 Toast
   ============================================================ */
const feedbackMessages = [
  "太棒了，能量 +10",
  "一件小事，一份治愈",
  "你正在好好照顾自己",
  "今天也很努力呢",
  "温柔地充好了一格电",
  "又多了一件值得记录的小事",
  "生活因为这些小事闪闪发光",
  "你值得被温柔以待",
];

interface FeedbackToast {
  id: number;
  text: string;
  icon: string;
}

/* ============================================================
   主组件
   ============================================================ */
const RechargeRecommend: React.FC<RechargeRecommendProps> = ({
  doneIds,
  onToggle,
  onRecommendCompleted,
}) => {
  // 用户状态
  const savedState = useMemo(() => loadUserState(), []);
  const [userState, setUserState] = useState<UserState>(
    savedState || { mood: "happy", weather: "sunny", energy: "medium" }
  );

  // 推荐面板展开/收起
  const [expanded, setExpanded] = useState(true);

  // 推荐结果
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // 反馈 toast 队列
  const [toasts, setToasts] = useState<FeedbackToast[]>([]);

  // 徽章弹窗
  const [newBadge, setNewBadge] = useState<Badge | null>(null);

  // 今日数据
  const [todayCount, setTodayCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState<Badge[]>([]);

  // 加载历史偏好
  const historyKeywords = useMemo(() => {
    const history = loadHistory();
    return extractPreferenceKeywords(history);
  }, []);

  // 生成推荐
  const generateRecommendations = useCallback(() => {
    const recs = getRecommendations(userState, doneIds, historyKeywords, 5);
    setRecommendations(recs);
  }, [userState, doneIds, historyKeywords]);

  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  // 加载统计
  useEffect(() => {
    const tc = getTodayCount();
    const sd = getStreakDays();
    const history = loadHistory();
    setTodayCount(tc);
    setStreak(sd);
    setBadges(getBadges(history, sd, tc));
  }, []);

  // 状态变更
  const updateState = useCallback(
    (partial: Partial<UserState>) => {
      setUserState((prev) => {
        const next = { ...prev, ...partial };
        saveUserState(next);
        return next;
      });
    },
    []
  );

  // 执行推荐项
  const handleDoIt = useCallback(
    (rec: Recommendation) => {
      onToggle(rec.node.id);
      // 保存完成记录（历史偏好）
      const record = saveCompletion(rec.node.id);
      // 更新今日统计
      const newTodayCount = getTodayCount();
      const newStreak = getStreakDays();
      const newHistory = loadHistory();
      const newBadges = getBadges(newHistory, newStreak, newTodayCount);
      setTodayCount(newTodayCount);
      setStreak(newStreak);
      setBadges(newBadges);

      // 检查是否有新解锁的徽章
      const prevBadges = badges;
      for (const b of newBadges) {
        if (b.unlocked && prevBadges.find((pb) => pb.id === b.id)?.unlocked === false) {
          setNewBadge(b);
          break;
        }
      }

      // 显示反馈 toast
      const msg = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
      const toast: FeedbackToast = {
        id: Date.now(),
        text: `${msg}`,
        icon: rec.node.icon,
      };
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);

      onRecommendCompleted?.(rec.node.id);
    },
    [onToggle, onRecommendCompleted, badges]
  );

  // 场景快捷
  const applyScene = useCallback((preset: typeof SCENE_PRESETS[number]) => {
    updateState(preset.state);
  }, [updateState]);

  return (
    <>
      <div className={`recommend-panel ${expanded ? "expanded" : "collapsed"}`}>
        {/* 折叠/展开按钮 */}
        <button
          className="recommend-toggle"
          onClick={() => setExpanded((e) => !e)}
        >
          <span className="recommend-toggle-icon">{expanded ? "∧" : "∨"}</span>
          <span className="recommend-toggle-label">
            {expanded ? "合上推荐" : "智能推荐"}
          </span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              className="recommend-body"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {/* 今日充能进度 */}
              <div className="recommend-progress">
                <div className="recommend-progress-header">
                  <span className="recommend-progress-title">今日充能</span>
                  <span className="recommend-progress-count">
                    {todayCount} / 5
                  </span>
                </div>
                <div className="recommend-progress-bar">
                  <motion.div
                    className="recommend-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((todayCount / 5) * 100, 100)}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                {streak > 0 && (
                  <span className="recommend-streak">
                    连续 {streak} 天
                  </span>
                )}
              </div>

              {/* 状态选择器 */}
              <div className="recommend-state-section">
                <h3 className="recommend-section-label">现在的你</h3>
                <div className="recommend-state-row">
                  {/* 心情 */}
                  <div className="recommend-state-group">
                    <span className="recommend-state-key">心情</span>
                    <div className="recommend-state-options">
                      {(Object.keys(MOOD_MAP) as MoodType[]).map((m) => (
                        <button
                          key={m}
                          className={`recommend-state-btn ${userState.mood === m ? "active" : ""}`}
                          onClick={() => updateState({ mood: m })}
                          title={MOOD_MAP[m].label}
                        >
                          {MOOD_MAP[m].icon}
                          <span className="recommend-state-btn-label">{MOOD_MAP[m].label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* 天气 */}
                  <div className="recommend-state-group">
                    <span className="recommend-state-key">天气</span>
                    <div className="recommend-state-options">
                      {(Object.keys(WEATHER_MAP) as WeatherType[]).map((w) => (
                        <button
                          key={w}
                          className={`recommend-state-btn ${userState.weather === w ? "active" : ""}`}
                          onClick={() => updateState({ weather: w })}
                          title={WEATHER_MAP[w].label}
                        >
                          {WEATHER_MAP[w].icon}
                          <span className="recommend-state-btn-label">{WEATHER_MAP[w].label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* 精力 */}
                  <div className="recommend-state-group">
                    <span className="recommend-state-key">精力</span>
                    <div className="recommend-state-options">
                      {(Object.keys(ENERGY_MAP) as EnergyLevel[]).map((e) => (
                        <button
                          key={e}
                          className={`recommend-state-btn ${userState.energy === e ? "active" : ""}`}
                          onClick={() => updateState({ energy: e })}
                          title={ENERGY_MAP[e].label}
                        >
                          <span className="recommend-energy-bars">
                            {Array.from({ length: 3 }, (_, i) => (
                              <span
                                key={i}
                                className={`recommend-energy-bar ${i < ENERGY_MAP[e].bars ? "on" : ""}`}
                              />
                            ))}
                          </span>
                          <span className="recommend-state-btn-label">{ENERGY_MAP[e].label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 场景快捷 */}
              <div className="recommend-scenes">
                <h3 className="recommend-section-label">场景速选</h3>
                <div className="recommend-scene-list">
                  {SCENE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      className="recommend-scene-btn"
                      onClick={() => applyScene(preset)}
                      title={preset.description}
                    >
                      <span className="recommend-scene-icon">{preset.icon}</span>
                      <span className="recommend-scene-label">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 重新推荐按钮 */}
              <button className="recommend-refresh" onClick={generateRecommendations}>
                换一批推荐
              </button>

              {/* 推荐卡片列表 */}
              <div className="recommend-cards">
                {recommendations.map((rec, i) => (
                  <motion.div
                    key={rec.node.id}
                    className="recommend-card"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
                  >
                    <div className="recommend-card-top">
                      <span className="recommend-card-icon">{rec.node.icon}</span>
                      <div className="recommend-card-content">
                        <p className="recommend-card-text">{rec.node.text}</p>
                        <div className="recommend-card-meta">
                          <span className="recommend-card-reason">{rec.reason}</span>
                          <div className="recommend-card-tags">
                            {rec.node.tags.map((tag) => (
                              <span
                                key={tag}
                                className="recommend-tag"
                                style={{ color: TAG_MAP[tag].color }}
                              >
                                {TAG_MAP[tag].label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="recommend-card-action"
                      onClick={() => handleDoIt(rec)}
                    >
                      接入电源
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* 已解锁徽章 */}
              {badges.some((b) => b.unlocked) && (
                <div className="recommend-badges">
                  <h3 className="recommend-section-label">已解锁</h3>
                  <div className="recommend-badge-list">
                    {badges
                      .filter((b) => b.unlocked)
                      .map((b) => (
                        <span key={b.id} className="recommend-badge" title={b.description}>
                          {b.icon}
                          <span className="recommend-badge-label">{b.label}</span>
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 反馈 Toast */}
      <div className="recommend-toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className="recommend-toast"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <span className="recommend-toast-icon">{toast.icon}</span>
              <span className="recommend-toast-text">{toast.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 徽章解锁弹窗 */}
      <AnimatePresence>
        {newBadge && (
          <motion.div
            className="badge-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNewBadge(null)}
          >
            <motion.div
              className="badge-popup"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="badge-popup-icon">{newBadge.icon}</div>
              <h3 className="badge-popup-title">解锁新徽章</h3>
              <p className="badge-popup-name">{newBadge.label}</p>
              <p className="badge-popup-desc">{newBadge.description}</p>
              <button className="badge-popup-close" onClick={() => setNewBadge(null)}>
                收下
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 样式 */}
      <style>{RECOMMEND_CSS}</style>
    </>
  );
};

export default RechargeRecommend;

/* ============================================================
   样式（与回血清单设计语言一致：暖白、日系文艺、克制动画）
   ============================================================ */
const RECOMMEND_CSS = `
/* ===== 推荐面板整体 ===== */
.recommend-panel {
  max-width: 680px;
  margin: 0 auto 24px;
  position: relative;
  z-index: 10;
  background: rgba(255, 253, 248, 0.95);
  border: 1px solid rgba(180, 170, 160, 0.12);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(160, 150, 140, 0.06);
}

/* 折叠/展开按钮 */
.recommend-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 16px;
  background: none;
  border: none;
  border-bottom: 1px solid rgba(180, 170, 160, 0.08);
  cursor: pointer;
  font-family: "Noto Sans SC", system-ui, sans-serif;
  transition: background 0.25s ease;
}
.recommend-toggle:hover {
  background: rgba(255, 253, 248, 0.6);
}
.recommend-toggle-icon {
  font-size: 12px;
  color: #b8aa9a;
  transition: transform 0.3s ease;
}
.recommend-panel.collapsed .recommend-toggle-icon {
  transform: rotate(180deg);
}
.recommend-toggle-label {
  font-size: 13px;
  color: #8a7a6e;
  letter-spacing: 0.06em;
  font-weight: 500;
}

/* 面板内容区 */
.recommend-body {
  padding: 0 20px 20px;
  overflow: hidden;
}

/* ===== 今日充能进度 ===== */
.recommend-progress {
  padding: 16px 0 12px;
}
.recommend-progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.recommend-progress-title {
  font-family: "Noto Serif SC", Georgia, serif;
  font-size: 15px;
  color: #5a5048;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.recommend-progress-count {
  font-size: 13px;
  color: #4cba4c;
  font-weight: 500;
  letter-spacing: 0.02em;
}
.recommend-progress-bar {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(180, 170, 160, 0.12);
  overflow: hidden;
}
.recommend-progress-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #6adc6a, #4cba4c);
  box-shadow: 0 0 6px rgba(100, 220, 120, 0.4);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.recommend-streak {
  display: inline-block;
  margin-top: 6px;
  font-size: 11px;
  color: #b8aa9a;
  letter-spacing: 0.04em;
}

/* ===== 区块标签 ===== */
.recommend-section-label {
  font-family: "Noto Serif SC", Georgia, serif;
  font-size: 13px;
  font-weight: 600;
  color: #8a7a6e;
  letter-spacing: 0.06em;
  margin: 12px 0 8px;
}

/* ===== 状态选择器 ===== */
.recommend-state-section {
  margin-bottom: 4px;
}
.recommend-state-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.recommend-state-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.recommend-state-key {
  flex-shrink: 0;
  width: 32px;
  font-size: 11px;
  color: #b8aa9a;
  text-align: right;
  letter-spacing: 0.04em;
}
.recommend-state-options {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.recommend-state-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border: 1px solid rgba(180, 170, 160, 0.15);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.5);
  font-family: "Noto Sans SC", system-ui, sans-serif;
  font-size: 13px;
  color: #8a7a6e;
  cursor: pointer;
  transition: all 0.25s ease;
}
.recommend-state-btn:hover {
  border-color: rgba(200, 180, 100, 0.3);
  background: rgba(255, 253, 248, 0.8);
}
.recommend-state-btn.active {
  border-color: rgba(200, 180, 100, 0.5);
  background: rgba(255, 250, 235, 0.7);
  box-shadow: 0 2px 8px rgba(200, 180, 100, 0.1);
}
.recommend-state-btn-label {
  font-size: 11px;
  letter-spacing: 0.02em;
}

/* 精力条 */
.recommend-energy-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 14px;
}
.recommend-energy-bar {
  width: 3px;
  border-radius: 1px;
  background: rgba(180, 170, 160, 0.2);
  transition: background 0.25s ease;
}
.recommend-energy-bar:nth-child(1) { height: 6px; }
.recommend-energy-bar:nth-child(2) { height: 10px; }
.recommend-energy-bar:nth-child(3) { height: 14px; }
.recommend-energy-bar.on {
  background: #e8a838;
}

/* ===== 场景速选 ===== */
.recommend-scenes {
  margin-bottom: 4px;
}
.recommend-scene-list {
  display: flex;
  gap: 8px;
}
.recommend-scene-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border: 1px solid rgba(180, 170, 160, 0.15);
  border-radius: 20px;
  background: rgba(255, 253, 248, 0.4);
  font-family: "Noto Sans SC", system-ui, sans-serif;
  cursor: pointer;
  transition: all 0.25s ease;
}
.recommend-scene-btn:hover {
  border-color: rgba(200, 180, 100, 0.35);
  background: rgba(255, 253, 248, 0.7);
  transform: translateY(-1px);
}
.recommend-scene-icon {
  font-size: 13px;
}
.recommend-scene-label {
  font-size: 11px;
  color: #8a7a6e;
  letter-spacing: 0.02em;
}

/* ===== 重新推荐按钮 ===== */
.recommend-refresh {
  display: block;
  width: 100%;
  margin: 12px 0;
  padding: 9px;
  border: 1px dashed rgba(180, 170, 160, 0.2);
  border-radius: 10px;
  background: none;
  font-family: "Noto Sans SC", system-ui, sans-serif;
  font-size: 12px;
  color: #b8aa9a;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.25s ease;
}
.recommend-refresh:hover {
  border-color: rgba(200, 180, 100, 0.35);
  color: #8a7a6e;
  background: rgba(255, 253, 248, 0.5);
}

/* ===== 推荐卡片 ===== */
.recommend-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.recommend-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid rgba(180, 170, 160, 0.12);
  border-radius: 12px;
  background: rgba(255, 253, 248, 0.5);
  transition: all 0.25s ease;
}
.recommend-card:hover {
  border-color: rgba(200, 180, 100, 0.25);
  background: rgba(255, 253, 248, 0.8);
  box-shadow: 0 2px 10px rgba(160, 150, 140, 0.06);
}
.recommend-card-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex: 1;
  min-width: 0;
}
.recommend-card-icon {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.recommend-card-content {
  flex: 1;
  min-width: 0;
}
.recommend-card-text {
  font-size: 13px;
  color: #5a5048;
  line-height: 1.5;
  margin: 0 0 4px;
  letter-spacing: 0.01em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.recommend-card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.recommend-card-reason {
  font-size: 11px;
  color: #b8aa9a;
  letter-spacing: 0.02em;
}
.recommend-card-tags {
  display: flex;
  gap: 6px;
}
.recommend-tag {
  font-size: 10px;
  letter-spacing: 0.02em;
  opacity: 0.7;
}
.recommend-card-action {
  flex-shrink: 0;
  padding: 6px 16px;
  border: 1px solid rgba(100, 220, 120, 0.3);
  border-radius: 8px;
  background: rgba(240, 255, 242, 0.6);
  font-family: "Noto Sans SC", system-ui, sans-serif;
  font-size: 12px;
  color: #4a8a5a;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
}
.recommend-card-action:hover {
  border-color: rgba(100, 220, 120, 0.5);
  background: rgba(240, 255, 242, 0.85);
  box-shadow: 0 2px 8px rgba(100, 220, 120, 0.12);
}

/* ===== 已解锁徽章 ===== */
.recommend-badges {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(180, 170, 160, 0.08);
}
.recommend-badge-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.recommend-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(255, 253, 248, 0.6);
  border: 1px solid rgba(180, 170, 160, 0.1);
}
.recommend-badge-label {
  font-size: 11px;
  color: #8a7a6e;
  letter-spacing: 0.02em;
}

/* ===== 反馈 Toast ===== */
.recommend-toast-container {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  align-items: center;
  pointer-events: none;
}
.recommend-toast {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  background: rgba(255, 253, 248, 0.95);
  border: 1px solid rgba(180, 220, 190, 0.3);
  box-shadow: 0 4px 16px rgba(100, 120, 100, 0.1);
  white-space: nowrap;
}
.recommend-toast-icon {
  font-size: 16px;
}
.recommend-toast-text {
  font-size: 13px;
  color: #5a5048;
  letter-spacing: 0.03em;
}

/* ===== 徽章解锁弹窗 ===== */
.badge-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(200, 195, 185, 0.25);
}
.badge-popup {
  text-align: center;
  max-width: 320px;
  width: 100%;
  padding: 36px 32px 28px;
  border-radius: 20px;
  background: rgba(245, 250, 247, 0.95);
  border: 1px solid rgba(180, 220, 190, 0.4);
  box-shadow: 0 2px 8px rgba(160, 180, 150, 0.06),
              0 8px 28px rgba(0,0,0,0.03),
              0 0 24px rgba(180, 220, 190, 0.12);
}
.badge-popup-icon {
  font-size: 48px;
  margin-bottom: 12px;
}
.badge-popup-title {
  font-family: "Noto Serif SC", Georgia, serif;
  font-size: 18px;
  font-weight: 600;
  color: #3a3a3a;
  margin: 0 0 8px;
  letter-spacing: 0.1em;
}
.badge-popup-name {
  font-size: 15px;
  color: #5a5048;
  margin: 0 0 6px;
  letter-spacing: 0.06em;
}
.badge-popup-desc {
  font-size: 12px;
  color: #9a8a7e;
  margin: 0 0 20px;
  letter-spacing: 0.03em;
}
.badge-popup-close {
  padding: 8px 28px;
  border: 1px solid rgba(100, 220, 120, 0.35);
  border-radius: 10px;
  background: rgba(240, 255, 242, 0.7);
  font-family: "Noto Sans SC", system-ui, sans-serif;
  font-size: 13px;
  color: #4a8a5a;
  cursor: pointer;
  transition: all 0.25s ease;
  letter-spacing: 0.04em;
}
.badge-popup-close:hover {
  background: rgba(240, 255, 242, 0.9);
  box-shadow: 0 2px 8px rgba(100, 220, 120, 0.12);
}

/* ===== 移动端适配 ===== */
@media (max-width: 640px) {
  .recommend-panel {
    margin: 0 0 20px;
    border-radius: 14px;
  }
  .recommend-body {
    padding: 0 16px 16px;
  }
  .recommend-state-group {
    flex-wrap: wrap;
  }
  .recommend-state-options {
    flex: 1;
  }
  .recommend-card {
    padding: 10px 12px;
    gap: 8px;
  }
  .recommend-card-text {
    font-size: 12px;
  }
  .recommend-card-action {
    padding: 5px 12px;
    font-size: 11px;
  }
  .recommend-scene-list {
    flex-wrap: wrap;
  }
  .recommend-toast-container {
    bottom: 70px;
    width: calc(100% - 32px);
  }
  .recommend-toast {
    width: 100%;
    justify-content: center;
  }
  .badge-popup {
    padding: 28px 24px 22px;
  }
}
`;
