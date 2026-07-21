import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

/**
 * AchievementPage — 疗愈成就页面
 *
 * 统计三个模块（感恩日记/呼吸引导/冥想空间）的累计数据，
 * 展示成就徽章、等级、连续记录等。
 */

/* ═══════════════════════════════════
   成就等级定义
   ═══════════════════════════════════ */

interface Tier {
  name: string;
  icon: string;
  min: number;
  color: string;
}

const DIARY_TIERS: Tier[] = [
  { name: "刚刚起步", icon: "🌱", min: 0, color: "#C4D4A0" },
  { name: "初露锋芒", icon: "🌿", min: 7, color: "#A5C4A0" },
  { name: "坚持记录", icon: "🌳", min: 30, color: "#7BAF8E" },
  { name: "心灵园丁", icon: "🏆", min: 100, color: "#5E8A6E" },
];

const BREATHING_TIERS: Tier[] = [
  { name: "还未开始", icon: "💤", min: 0, color: "#D4D4D4" },
  { name: "初识呼吸", icon: "🌬", min: 5, color: "#7EB8D4" },
  { name: "气息调和", icon: "💨", min: 20, color: "#5A9AC0" },
  { name: "呼吸大师", icon: "🌀", min: 50, color: "#3E7AA6" },
];

const MEDITATION_TIERS: Tier[] = [
  { name: "还未开始", icon: "💤", min: 0, color: "#D4D4D4" },
  { name: "初学冥想", icon: "🧘", min: 300, color: "#C4D4A0" },
  { name: "心灵旅者", icon: "✨", min: 1800, color: "#A5C4A0" },
  { name: "深度修行", icon: "🌟", min: 7200, color: "#7BAF8E" },
];

function getTier(tiers: Tier[], value: number): Tier {
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (value >= tiers[i].min) return tiers[i];
  }
  return tiers[0];
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return s > 0 ? `${m}m${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm > 0 ? `${h}h${rm}m` : `${h}h`;
}

/* ═══════════════════════════════════
   组件
   ═══════════════════════════════════ */

const AchievementPage: React.FC = () => {
  const [stats, setStats] = useState<{
    diaryTotal: number;
    breathingTotal: number;
    meditationTotal: number;
    streakDiary: number;
    longestStreak: number;
    totalDaysActive: number;
  } | null>(null);

  useEffect(() => {
    // 读取日记
    let entries: { date: string }[] = [];
    try {
      entries = JSON.parse(localStorage.getItem("gratitude_entries") || "[]");
    } catch { /* */ }

    // 读取呼吸
    let breathingRecords: { date: string }[] = [];
    try {
      breathingRecords = JSON.parse(localStorage.getItem("breathing_records") || "[]");
    } catch { /* */ }

    // 读取冥想
    let meditationTotal = 0;
    try {
      meditationTotal = parseInt(localStorage.getItem("meditation_total") || "0", 10);
    } catch { /* */ }

    // 计算日记连续天数
    const diaryDates = [...new Set(entries.map((e) => e.date))].sort();
    let streakDiary = 0;
    let longestStreak = 0;
    let currentStreak = 0;
    let prevDate: Date | null = null;

    for (const ds of diaryDates) {
      const d = new Date(ds);
      if (prevDate) {
        const diff = (d.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          currentStreak++;
        } else {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      prevDate = d;
    }
    longestStreak = Math.max(longestStreak, currentStreak);

    // 检查今天是否写了日记
    const todayStr = new Date().toISOString().slice(0, 10);
    streakDiary = entries.some((e) => e.date === todayStr) ? currentStreak : 0;

    // 活跃天数（至少做了日记/呼吸/冥想中的一项）
    const allDates = new Set([
      ...entries.map((e) => e.date),
      ...breathingRecords.map((r) => r.date),
    ]);
    const totalDaysActive = allDates.size;

    setStats({
      diaryTotal: entries.length,
      breathingTotal: breathingRecords.length,
      meditationTotal,
      streakDiary,
      longestStreak,
      totalDaysActive,
    });
  }, []);

  const diaryTier = useMemo(() => stats ? getTier(DIARY_TIERS, stats.diaryTotal) : DIARY_TIERS[0], [stats]);
  const breathingTier = useMemo(() => stats ? getTier(BREATHING_TIERS, stats.breathingTotal) : BREATHING_TIERS[0], [stats]);
  const meditationTier = useMemo(() => stats ? getTier(MEDITATION_TIERS, stats.meditationTotal) : MEDITATION_TIERS[0], [stats]);

  if (!stats) return null;

  const modules = [
    {
      key: "diary",
      title: "感恩日记",
      color: "#F4A6B8",
      bg: "rgba(244,166,184,0.08)",
      icon: "🌸",
      value: stats.diaryTotal,
      unit: "篇",
      tier: diaryTier,
      nextTier: DIARY_TIERS.find((t) => t.min > stats.diaryTotal),
      progress: diaryTier.min === 0
        ? Math.min(stats.diaryTotal / (DIARY_TIERS[1]?.min ?? 7), 1)
        : Math.min((stats.diaryTotal - diaryTier.min) / ((DIARY_TIERS[DIARY_TIERS.indexOf(diaryTier) + 1]?.min ?? diaryTier.min * 2) - diaryTier.min), 1),
    },
    {
      key: "breathing",
      title: "呼吸引导",
      color: "#7EB8D4",
      bg: "rgba(126,184,212,0.08)",
      icon: "🍃",
      value: stats.breathingTotal,
      unit: "次",
      tier: breathingTier,
      nextTier: BREATHING_TIERS.find((t) => t.min > stats.breathingTotal),
      progress: breathingTier.min === 0
        ? Math.min(stats.breathingTotal / (BREATHING_TIERS[1]?.min ?? 5), 1)
        : Math.min((stats.breathingTotal - breathingTier.min) / ((BREATHING_TIERS[BREATHING_TIERS.indexOf(breathingTier) + 1]?.min ?? breathingTier.min * 2) - breathingTier.min), 1),
    },
    {
      key: "meditation",
      title: "冥想空间",
      color: "#A5C4A0",
      bg: "rgba(165,196,160,0.08)",
      icon: "🕯",
      valueText: formatDuration(stats.meditationTotal),
      value: stats.meditationTotal,
      unit: "",
      tier: meditationTier,
      nextTier: MEDITATION_TIERS.find((t) => t.min > stats.meditationTotal),
      progress: meditationTier.min === 0
        ? Math.min(stats.meditationTotal / (MEDITATION_TIERS[1]?.min ?? 300), 1)
        : Math.min((stats.meditationTotal - meditationTier.min) / ((MEDITATION_TIERS[MEDITATION_TIERS.indexOf(meditationTier) + 1]?.min ?? meditationTier.min * 2) - meditationTier.min), 1),
    },
  ];

  return (
    <div className="ach-page">
      {/* 总览 */}
      <div className="ach-header">
        <motion.div
          className="ach-header-icon"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          🏅
        </motion.div>
        <div>
          <h2 className="ach-header-title">疗愈成就</h2>
          <p className="ach-header-desc">
            累计活跃 {stats.totalDaysActive} 天 · 最长连续 {stats.longestStreak} 天
            {stats.streakDiary > 0 && ` · 当前连续 ${stats.streakDiary} 天`}
          </p>
        </div>
      </div>

      {/* 三个模块 */}
      <div className="ach-modules">
        {modules.map((mod, idx) => (
          <motion.div
            key={mod.key}
            className="ach-mod-card"
            style={{ background: mod.bg, borderColor: `${mod.color}20` }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <div className="ach-mod-header">
              <span className="ach-mod-icon">{mod.icon}</span>
              <span className="ach-mod-title">{mod.title}</span>
            </div>

            <div className="ach-mod-value" style={{ color: mod.color }}>
              {mod.valueText ?? mod.value}
              {mod.unit && <span className="ach-mod-unit">{mod.unit}</span>}
            </div>

            {/* 等级徽章 */}
            <div className="ach-mod-tier">
              <span className="ach-mod-tier-icon" style={{ color: mod.tier.color }}>{mod.tier.icon}</span>
              <span className="ach-mod-tier-name">{mod.tier.name}</span>
            </div>

            {/* 进度条 */}
            {mod.nextTier && (
              <div className="ach-mod-progress-wrap">
                <div className="ach-mod-progress-track">
                  <motion.div
                    className="ach-mod-progress-fill"
                    style={{ background: mod.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${mod.progress * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + idx * 0.1 }}
                  />
                </div>
                <span className="ach-mod-progress-label">
                  再 {mod.nextTier.min - mod.value} {mod.unit || "秒"} 解锁「{mod.nextTier.name}」
                </span>
              </div>
            )}
            {!mod.nextTier && (
              <div className="ach-mod-max">已达最高等级 🎉</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* 小贴士 */}
      <p className="ach-hint">
        每天坚持一点点，疗愈就在不经意间发生。
      </p>

      <style>{`
        .ach-page {
          padding: 32px;
          max-width: 720px;
          margin: 0 auto;
        }
        .ach-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
        }
        .ach-header-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: rgba(122, 154, 130, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .ach-header-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 4px;
        }
        .ach-header-desc {
          font-size: 13px;
          color: var(--text-soft);
          opacity: 0.7;
          margin: 0;
        }

        .ach-modules {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .ach-mod-card {
          padding: 20px 22px;
          border-radius: 14px;
          border: 1px solid;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ach-mod-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ach-mod-icon { font-size: 18px; }
        .ach-mod-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }
        .ach-mod-value {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 32px;
          font-weight: 700;
          line-height: 1.1;
        }
        .ach-mod-unit {
          font-size: 14px;
          font-weight: 400;
          opacity: 0.6;
          margin-left: 4px;
        }
        .ach-mod-tier {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text-soft);
        }
        .ach-mod-tier-icon { font-size: 16px; }
        .ach-mod-tier-name { font-weight: 500; }

        .ach-mod-progress-wrap {
          margin-top: 4px;
        }
        .ach-mod-progress-track {
          height: 6px;
          background: rgba(0,0,0,0.04);
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 6px;
        }
        .ach-mod-progress-fill {
          height: 100%;
          border-radius: 999px;
          opacity: 0.75;
        }
        .ach-mod-progress-label {
          font-size: 11px;
          color: var(--text-soft);
          opacity: 0.55;
        }
        .ach-mod-max {
          font-size: 12px;
          color: var(--accent);
          font-weight: 500;
          margin-top: 2px;
        }

        .ach-hint {
          text-align: center;
          font-size: 12px;
          color: var(--text-soft);
          opacity: 0.45;
          margin-top: 24px;
          font-family: "Noto Serif SC", Georgia, serif;
        }

        @media (max-width: 768px) {
          .ach-page { padding: 20px 16px; }
          .ach-header-title { font-size: 18px; }
          .ach-mod-value { font-size: 26px; }
        }
      `}</style>
    </div>
  );
};

export default AchievementPage;
