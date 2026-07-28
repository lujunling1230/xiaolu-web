/**
 * UniversalCheckinPanel — 通用签到打卡面板
 *
 * 轻量、可嵌入任何产品页面的签到+积分面板。
 * 通过 productId 隔离各产品数据。
 *
 * 使用方式：
 *   <UniversalCheckinPanel productId="healing" accentColor="#5d8a6a" label="森林疗愈室" />
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  doCheckin as ucDoCheckin,
  getCheckinData,
  hasCheckedInToday,
  getPoints,
  getCheckinCalendar,
} from "../pages/toolbox/universalCheckin";

interface Props {
  productId: string;
  /** 强调色，用于按钮和进度条 */
  accentColor?: string;
  /** 产品名（展示用） */
  label?: string;
  /** 变体：full 完整版（深色卡片）；lite 轻量版（单行浅色，不抢眼） */
  variant?: "full" | "lite";
}

const DAYS_LABEL = ["一", "二", "三", "四", "五", "六", "日"];

export default function UniversalCheckinPanel({ productId, accentColor = "#5d8a6a", label = "", variant = "full" }: Props) {
  const [points, setPoints] = useState(() => getPoints(productId));
  const [ckData, setCkData] = useState(() => getCheckinData(productId));
  const [checkedToday, setCheckedToday] = useState(() => hasCheckedInToday(productId));
  const [anim, setAnim] = useState(false);
  const [showCal, setShowCal] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const calendar = getCheckinCalendar(productId, 28);

  const handleCheckin = useCallback(() => {
    if (checkedToday) return;
    const result = ucDoCheckin(productId);
    if (result.success) {
      setPoints(result.totalPoints);
      setCkData({ lastDate: new Date().toISOString().slice(0, 10), streak: result.streak, totalDays: result.totalDays });
      setCheckedToday(true);
      setAnim(true);
      setTimeout(() => setAnim(false), 600);
    }
  }, [checkedToday, productId]);

  // 点击外部关闭日历
  useEffect(() => {
    if (!showCal) return;
    const handler = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCal(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showCal]);

  const streakPercent = Math.min(100, (ckData.streak / 7) * 100);

  /* ====== lite 变体：单行浅色紧凑，不抢眼 ====== */
  if (variant === "lite") {
    return (
      <div ref={calendarRef} className="uc-lite" style={{ ["--uc-accent" as string]: accentColor }}>
        <div className="uc-lite-left">
          <span className="uc-lite-points" style={{ color: accentColor }}>{points}</span>
          <span className="uc-lite-unit">积分</span>
          {ckData.streak > 0 && (
            <span className="uc-lite-streak">连续 {ckData.streak} 天</span>
          )}
        </div>
        <div className="uc-lite-right">
          <div className="uc-lite-week">
            {calendar.slice(-7).map((d) => (
              <span
                key={d.date}
                className={`uc-lite-dot ${d.done ? "done" : ""}`}
                style={d.done ? { background: accentColor, borderColor: accentColor } : undefined}
              />
            ))}
          </div>
          <button
            className={`uc-lite-btn ${checkedToday ? "done" : ""} ${anim ? "pop" : ""}`}
            style={!checkedToday ? { borderColor: accentColor, color: accentColor } : undefined}
            onClick={handleCheckin}
            disabled={checkedToday}
          >
            {checkedToday ? "✓" : "签到"}
          </button>
        </div>
        <style>{`
          .uc-lite {
            display: flex; align-items: center; justify-content: space-between; gap: 10px;
            padding: 6px 14px;
            border-radius: 999px;
            background: rgba(255,255,255,0.5);
            border: 1px solid rgba(0,0,0,0.05);
            font-family: "Noto Sans SC", system-ui, sans-serif;
          }
          .uc-lite-left {
            display: flex; align-items: baseline; gap: 4px;
            flex-shrink: 0;
          }
          .uc-lite-points {
            font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; line-height: 1;
          }
          .uc-lite-unit { font-size: 11px; color: #9ca3af; }
          .uc-lite-streak {
            font-size: 11px; color: #9ca3af; margin-left: 6px;
            padding-left: 6px; border-left: 1px solid rgba(0,0,0,0.08);
          }
          .uc-lite-right { display: flex; align-items: center; gap: 10px; }
          .uc-lite-week { display: flex; gap: 4px; }
          .uc-lite-dot {
            width: 6px; height: 6px; border-radius: 50%;
            background: rgba(0,0,0,0.08); border: 1px solid transparent;
            transition: all 0.2s ease;
          }
          .uc-lite-dot.done { opacity: 0.85; }
          .uc-lite-btn {
            padding: 3px 12px; border-radius: 999px; border: 1px solid;
            font-size: 11px; font-weight: 600; font-family: inherit;
            cursor: pointer; transition: all 0.2s ease; white-space: nowrap;
            background: rgba(255,255,255,0.6); line-height: 1.4;
          }
          .uc-lite-btn:hover:not(:disabled) { transform: scale(1.05); }
          .uc-lite-btn:disabled {
            cursor: default; opacity: 0.45;
            border-color: rgba(0,0,0,0.08); color: #9ca3af; background: transparent;
          }
          .uc-lite-btn.done { border-color: rgba(72,187,120,0.3); color: #67c98b; background: rgba(72,187,120,0.06); }
          .uc-lite-btn.pop { animation: uc-lite-pop 0.5s ease; }
          @keyframes uc-lite-pop {
            0% { transform: scale(1); }
            30% { transform: scale(1.18); }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div ref={calendarRef} className="uc-panel">
      {/* 主行：积分 + 签到按钮 */}
      <div className="uc-main-row">
        <div className="uc-left">
          <div className="uc-points-area">
            <span className="uc-points-icon" style={{ color: accentColor }}>★</span>
            <span className="uc-points-value">{points}</span>
            <span className="uc-points-label">积分</span>
          </div>
          <div className="uc-streak-area">
            <div className="uc-streak-bar">
              <div className="uc-streak-fill" style={{ width: `${streakPercent}%`, background: accentColor }} />
            </div>
            <span className="uc-streak-text">
              {ckData.streak > 0
                ? `连续 ${ckData.streak} 天 · 累计 ${ckData.totalDays} 天`
                : "开始你的第一天"}
            </span>
          </div>
        </div>
        <button
          className={`uc-checkin-btn ${checkedToday ? "done" : ""} ${anim ? "pop" : ""}`}
          style={!checkedToday ? { borderColor: accentColor, color: accentColor, background: `${accentColor}08` } : undefined}
          onClick={handleCheckin}
          disabled={checkedToday}
        >
          {checkedToday ? "✓ 已签到" : "+3 签到"}
        </button>
      </div>

      {/* 7天周历预览 + 展开按钮 */}
      <div className="uc-week-row">
        <div className="uc-week-dots">
          {calendar.slice(-7).map((d) => (
            <div
              key={d.date}
              className={`uc-dot ${d.done ? "done" : ""}`}
              style={d.done ? { background: accentColor, borderColor: accentColor } : undefined}
              title={d.date}
            />
          ))}
        </div>
        <button className="uc-cal-toggle" onClick={() => setShowCal(!showCal)}>
          {showCal ? "收起" : "日历"}
        </button>
      </div>

      {/* 展开日历 */}
      <AnimatePresence>
        {showCal && (
          <motion.div
            className="uc-calendar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="uc-cal-grid">
              {calendar.map((d) => {
                const dayOfWeek = new Date(d.date + "T00:00:00").getDay();
                const dayLabel = DAYS_LABEL[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
                return (
                  <div key={d.date} className={`uc-cal-cell ${d.done ? "done" : ""}`} title={d.date}>
                    <span className="uc-cal-label">{dayLabel}</span>
                    <span className="uc-cal-num" style={d.done ? { color: accentColor } : undefined}>
                      {parseInt(d.date.slice(8), 10)}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .uc-panel {
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          font-family: "Noto Sans SC", system-ui, sans-serif;
        }
        .uc-main-row {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .uc-left { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .uc-points-area {
          display: flex; align-items: center; gap: 6px;
        }
        .uc-points-icon { font-size: 13px; }
        .uc-points-value { font-size: 16px; font-weight: 600; color: #9ca3af; font-variant-numeric: tabular-nums; }
        .uc-points-label { font-size: 11px; color: #9ca3af; }
        .uc-streak-bar {
          height: 3px; border-radius: 999px; overflow: hidden;
          background: rgba(255,255,255,0.08);
        }
        .uc-streak-fill {
          height: 100%; border-radius: 999px;
          transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .uc-streak-text { font-size: 11px; color: #9ca3af; margin-top: 3px; }
        .uc-checkin-btn {
          padding: 6px 14px; border-radius: 10px; border: 1px solid;
          font-size: 12px; font-weight: 500; font-family: inherit;
          cursor: pointer; transition: all 0.2s ease; white-space: nowrap;
          background: transparent;
        }
        .uc-checkin-btn:hover:not(:disabled) { transform: scale(1.02); }
        .uc-checkin-btn:disabled { cursor: not-allowed; opacity: 0.5; border-color: rgba(255,255,255,0.15); color: #9ca3af; background: rgba(255,255,255,0.04); }
        .uc-checkin-btn.done { border-color: rgba(52,211,153,0.35); color: #34d399; background: rgba(52,211,153,0.08); }
        .uc-checkin-btn.pop { animation: uc-pop 0.5s ease; }
        @keyframes uc-pop {
          0% { transform: scale(1); }
          30% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .uc-week-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 10px; padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .uc-week-dots { display: flex; gap: 6px; }
        .uc-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.12);
          transition: all 0.2s ease;
        }
        .uc-dot.done { }
        .uc-cal-toggle {
          font-size: 11px; color: #9ca3af; background: none; border: none;
          cursor: pointer; font-family: inherit; padding: 2px 6px;
          transition: color 0.2s;
        }
        .uc-cal-toggle:hover { color: #d1d5db; }
        .uc-calendar { overflow: hidden; margin-top: 8px; }
        .uc-cal-grid {
          display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;
        }
        .uc-cal-cell {
          display: flex; flex-direction: column; align-items: center; gap: 1px;
          padding: 4px 0; border-radius: 6px;
        }
        .uc-cal-cell.done { background: rgba(255,255,255,0.06); }
        .uc-cal-label { font-size: 9px; color: #6b7280; }
        .uc-cal-num { font-size: 12px; font-weight: 600; color: #6b7280; font-variant-numeric: tabular-nums; }
      `}</style>
    </div>
  );
}
