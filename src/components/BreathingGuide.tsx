import { useState, useEffect, useRef, useCallback } from "react";

/**
 * BreathingGuide 呼吸引导 — 森林疗愈室核心模块
 *
 * ═══════════════════════════════════════════════════════
 *  三种呼吸模式
 * ═══════════════════════════════════════════════════════
 *    😟 焦虑/压力大 → 方形呼吸   4-4-4-4  蓝   专注
 *       吸气4 → 屏息4 → 呼气4 → 空肺屏息4
 *    😴 疲惫/失眠   → 478 呼吸法  4-7-8    紫   放松
 *       吸气4 → 屏息7 → 呼气8
 *    😫 能量不足    → 能量呼吸法   3-1-2    橙   提神
 *       吸气3 → 屏息1 → 呼气2
 *
 * ═══════════════════════════════════════════════════════
 *  倒计时核心逻辑（状态机 + useEffect 监听阶段变化）
 * ═══════════════════════════════════════════════════════
 *
 *  【旧 Bug 根因】
 *    rAF effect 中 lastSecond 初始化为 duration，
 *    第一帧 display === lastSecond → setCountdown 不触发
 *    → 倒计时停留在上一阶段的 "1"，跳过新阶段的起始值
 *    → 序列变成 4,3,2,1 → 1,3,2,1（缺 "4"）
 *
 *  【修复方案】
 *    1. Effect A（阶段重置）：
 *       useEffect(() => { setCountdown(currentPhase.duration); }, [currentPhase]);
 *       → 阶段一变，数字立即归位为该阶段总秒数
 *
 *    2. Effect B（rAF 动画）：
 *       lastSecond = -1（强制首帧更新）
 *       → 确保新阶段第一帧一定调用 setCountdown(duration)
 *
 *    3. 阶段切换：rAF 检测 p >= 1 → setPhaseIndex(next)
 *       → 触发 Effect A 重置 countdown → 触发 Effect B 重建动画
 *
 *  全部动画仅使用 transform / opacity / stroke-dashoffset（GPU 友好）
 * ═══════════════════════════════════════════════════════
 */

/* ───────── 类型 ───────── */

type PhaseName = "inhale" | "hold" | "exhale" | "holdEmpty";

interface PhaseInfo {
  name: PhaseName;
  duration: number; // 该阶段总秒数
  label: string; // 短标签（节奏指示器用）
  fullLabel: string; // 完整标签（中心显示用）
}

interface BreathMode {
  id: string;
  emoji: string;
  label: string;
  desc: string;
  phases: PhaseInfo[];
  color: string;
  modeName: string;
}

/* ───────── 三种呼吸模式参数 ───────── */

const MODES: BreathMode[] = [
  {
    id: "anxiety",
    emoji: "😟",
    label: "焦虑/压力大",
    desc: "均匀节奏 · 找回专注",
    color: "#5B9BD5",
    modeName: "方形呼吸 · 专注模式",
    // 方形呼吸 = 4 阶段（含空肺屏息），形成完整"方形"
    phases: [
      { name: "inhale",    duration: 4, label: "吸气", fullLabel: "吸气" },
      { name: "hold",      duration: 4, label: "屏息", fullLabel: "屏息" },
      { name: "exhale",    duration: 4, label: "呼气", fullLabel: "呼气" },
      { name: "holdEmpty", duration: 4, label: "空肺", fullLabel: "屏息·空肺" },
    ],
  },
  {
    id: "tired",
    emoji: "😴",
    label: "疲惫/失眠",
    desc: "延长呼气 · 深度放松",
    color: "#7E57C2",
    modeName: "478 呼吸法",
    phases: [
      { name: "inhale", duration: 4, label: "吸气", fullLabel: "吸气" },
      { name: "hold",   duration: 7, label: "屏息", fullLabel: "屏息" },
      { name: "exhale", duration: 8, label: "呼气", fullLabel: "呼气" },
    ],
  },
  {
    id: "low_energy",
    emoji: "😫",
    label: "能量不足",
    desc: "快速节奏 · 唤醒活力",
    color: "#FF8A65",
    modeName: "能量呼吸法",
    phases: [
      { name: "inhale", duration: 3, label: "吸气", fullLabel: "吸气" },
      { name: "hold",   duration: 1, label: "屏息", fullLabel: "屏息" },
      { name: "exhale", duration: 2, label: "呼气", fullLabel: "呼气" },
    ],
  },
];

/* ───────── 常量 ───────── */

const REST_SCALE = 0.76; // 呼气末/空肺时光球缩放（收缩态）
const PEAK_SCALE = 1.14; // 吸气满/屏息时光球缩放（扩张态）

const RADIUS = 80;
const STROKE_WIDTH = 5;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SERIF_FONT = '"Noto Serif SC", Georgia, "Times New Roman", serif';

/* ───────── 阶段动画计算 ───────── */

/** 光球缩放：吸气扩张 / 屏息保持 / 呼气收缩 / 空肺保持收缩 */
function computeScale(name: PhaseName, p: number): number {
  switch (name) {
    case "inhale":    return REST_SCALE + (PEAK_SCALE - REST_SCALE) * p; // 0.76→1.14
    case "hold":      return PEAK_SCALE;                                  // 1.14
    case "exhale":    return PEAK_SCALE - (PEAK_SCALE - REST_SCALE) * p; // 1.14→0.76
    case "holdEmpty": return REST_SCALE;                                  // 0.76
  }
}

/** 圆弧进度：吸气填充 / 屏息保持满 / 呼气消退 / 空肺保持空 */
function computeArcProgress(name: PhaseName, p: number): number {
  switch (name) {
    case "inhale":    return p;     // 0→1
    case "hold":      return 1;     // 满
    case "exhale":    return 1 - p; // 1→0
    case "holdEmpty": return 0;     // 空
  }
}

/* ═══════════════════════════════════════
   组件
   ═══════════════════════════════════════ */

const BreathingGuide: React.FC = () => {
  /* ───── React state ───── */
  const [mode, setMode] = useState<BreathMode>(MODES[0]);
  const [running, setRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(MODES[0].phases[0].duration);
  const [cycleCount, setCycleCount] = useState(0);

  /* ───── DOM refs（高频更新，绕过 React） ───── */
  const orbRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);

  /* ───── 动画时间追踪 ───── */
  const elapsedRef = useRef(0); // 当前阶段已过毫秒数（支持暂停续接）

  /* ───── 派生 ───── */
  const phases = mode.phases;
  const currentPhase = phases[phaseIndex];

  /* ref：rAF 闭包内读取最新 phases 长度（阶段切换时用） */
  const phasesRef = useRef(phases);
  phasesRef.current = phases;
  const phaseIndexRef = useRef(phaseIndex);
  phaseIndexRef.current = phaseIndex;

  /* ═══════════════════════════════════════
     Effect A — 阶段切换时重置倒计时（核心修复）
     每当 currentPhase 变化（阶段推进 / 模式切换），
     立即将 countdown 归位为该阶段的总秒数。
     ═══════════════════════════════════════ */
  useEffect(() => {
    setCountdown(currentPhase.duration);
  }, [currentPhase]);

  /* ═══════════════════════════════════════
     Effect B — rAF 动画引擎
     依赖 [running, phaseIndex, mode]：
       running 变化   → 启动 / 停止
       phaseIndex 变化 → 进入新阶段（effect 重建）
       mode 变化       → 新模式参数
     ═══════════════════════════════════════ */
  useEffect(() => {
    if (!running) return;

    const duration = currentPhase.duration;
    const durationMs = duration * 1000;
    const name = currentPhase.name;

    /* 恢复断点：暂停后继续时从断点开始 */
    const startTime = performance.now() - elapsedRef.current;

    /* 关闭 CSS transition — 由 rAF 全权控制 */
    if (orbRef.current) orbRef.current.style.transition = "none";
    if (arcRef.current) arcRef.current.style.transition = "none";

    let raf = 0;
    /* ★ 关键修复：lastSecond = -1 强制首帧更新
       旧代码初始化为 duration，导致首帧 display===lastSecond 跳过更新 */
    let lastSecond = -1;

    /* ───── 每帧 tick ───── */
    const tick = (now: number) => {
      const elapsed = now - startTime;
      elapsedRef.current = elapsed;
      const p = Math.min(elapsed / durationMs, 1); // 阶段内进度 0→1

      /* ── 光球缩放（直接 DOM） ── */
      if (orbRef.current) {
        orbRef.current.style.transform = `scale(${computeScale(name, p)})`;
      }

      /* ── 圆弧进度（直接 DOM） ── */
      if (arcRef.current) {
        const arcP = computeArcProgress(name, p);
        arcRef.current.style.strokeDashoffset = String(
          CIRCUMFERENCE * (1 - arcP),
        );
      }

      /* ── 倒计时数字（仅整秒变化时更新 state） ── */
      const remaining = Math.ceil((durationMs - elapsed) / 1000);
      const display = Math.max(remaining, 1);
      if (display !== lastSecond) {
        lastSecond = display;
        setCountdown(display);
      }

      /* ── 阶段切换 ── */
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        /* 当前阶段完成 → 进入下一阶段 */
        elapsedRef.current = 0;
        const ps = phasesRef.current;
        const next = (phaseIndexRef.current + 1) % ps.length;
        setPhaseIndex(next);
        if (next === 0) setCycleCount((c) => c + 1);
        /* Effect A 会自动将 countdown 重置为 ps[next].duration */
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, phaseIndex, mode]);

  /* ═══════════════════════════════════════
     交互处理
     ═══════════════════════════════════════ */

  /** 选择情绪状态 → 加载对应呼吸模式 */
  const handleSelectMode = (m: BreathMode) => {
    setRunning(false);
    setHasStarted(false);
    setMode(m);
    setPhaseIndex(0);
    setCountdown(m.phases[0].duration);
    setCycleCount(0);
    elapsedRef.current = 0;
    // 平滑回到静止态
    if (orbRef.current) {
      orbRef.current.style.transition = "transform 0.5s ease";
      orbRef.current.style.transform = `scale(${REST_SCALE})`;
    }
    if (arcRef.current) {
      arcRef.current.style.transition = "stroke-dashoffset 0.5s ease";
      arcRef.current.style.strokeDashoffset = String(CIRCUMFERENCE);
    }
  };

  /** 记录呼吸引导使用（本地存储） */
  const recordBreathing = useCallback((cycles: number, modeId: string) => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const raw = localStorage.getItem("breathing_records");
      const records: { date: string; mode: string; cycles: number }[] = raw ? JSON.parse(raw) : [];
      records.push({ date: today, mode: modeId, cycles });
      localStorage.setItem("breathing_records", JSON.stringify(records));
    } catch { /* ignore */ }
  }, []);

  /** 开始 / 暂停 / 继续 */
  const handleToggleRun = () => {
    if (running && cycleCount > 0) {
      // 暂停时记录（只要完成过至少一轮）
      recordBreathing(cycleCount, mode.id);
    }
    if (!running) setHasStarted(true);
    setRunning((r) => !r);
  };

  /** 重置 → 回到当前模式初始值 */
  const handleReset = () => {
    setRunning(false);
    setHasStarted(false);
    setPhaseIndex(0);
    setCountdown(mode.phases[0].duration);
    setCycleCount(0);
    elapsedRef.current = 0;
    if (orbRef.current) {
      orbRef.current.style.transition = "transform 0.6s ease";
      orbRef.current.style.transform = `scale(${REST_SCALE})`;
    }
    if (arcRef.current) {
      arcRef.current.style.transition = "stroke-dashoffset 0.6s ease";
      arcRef.current.style.strokeDashoffset = String(CIRCUMFERENCE);
    }
  };

  /* ═══════════════════════════════════════
     派生显示值
     ═══════════════════════════════════════ */

  const rhythmString = phases.map((p) => p.duration).join("-");
  const atRest = !hasStarted;
  const buttonText = running ? "暂停" : atRest ? "开始" : "继续";
  const phaseDisplayText = atRest ? "准备开始" : currentPhase.fullLabel;
  const isFourPhase = phases.length > 3;

  /* ═══════════════════════════════════════
     渲染
     ═══════════════════════════════════════ */

  return (
    <div className="bg-root">
      <style>{`
        /* ===== 根容器 ===== */
        .bg-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          padding: 24px 16px 8px;
          font-family: "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: var(--text);
        }

        /* ===== 标题 ===== */
        .bg-header { text-align: center; }
        .bg-title {
          font-family: ${SERIF_FONT};
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 6px;
          letter-spacing: 0.06em;
        }
        .bg-subtitle {
          font-size: 12.5px;
          color: var(--text);
          opacity: 0.88;
          margin: 0;
          letter-spacing: 0.02em;
        }

        /* ===== 情绪选择按钮 ===== */
        .bg-state-bar {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .bg-state-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 7px 15px;
          border-radius: 999px;
          border: 1.5px solid var(--border);
          background: var(--card-bg);
          color: var(--text-soft);
          font-size: 13px;
          cursor: pointer;
          user-select: none;
          transition: transform 0.2s ease, background 0.25s ease,
                      color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .bg-state-btn:hover { transform: scale(1.04); }
        .bg-state-btn.active {
          border-color: transparent;
          color: #fff;
          box-shadow: 0 3px 12px -3px var(--state-color, #5B9BD5);
        }
        .bg-state-emoji { font-size: 15px; line-height: 1; }

        /* ===== 呼吸圆环区域 ===== */
        .bg-arc-area {
          position: relative;
          width: 230px;
          height: 230px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 4px 0;
        }

        /* 外圈柔光（氛围） */
        .bg-aura {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle, var(--aura-color, transparent) 0%, transparent 65%);
          opacity: ${running ? 0.35 : 0.12};
          transition: opacity 0.6s ease, background 0.5s ease;
          pointer-events: none;
        }

        /* SVG 圆弧 */
        .bg-arc-svg {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          transform: rotate(-90deg);
          opacity: ${running ? 1 : 0.5};
          transition: opacity 0.5s ease;
        }
        .bg-arc-track {
          fill: none;
          stroke: var(--border);
          stroke-width: ${STROKE_WIDTH};
          opacity: 0.5;
        }
        .bg-arc-progress {
          fill: none;
          stroke: var(--arc-color, #5B9BD5);
          stroke-width: ${STROKE_WIDTH};
          stroke-linecap: round;
        }

        /* 呼吸光球 */
        .bg-orb {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          will-change: transform;
          transform: scale(${REST_SCALE});
        }

        /* 中心文字 */
        .bg-center {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          pointer-events: none;
        }
        .bg-countdown {
          font-family: ${SERIF_FONT};
          font-size: 52px;
          font-weight: 700;
          line-height: 1;
          color: var(--text);
          margin: 0;
          text-shadow: 0 2px 16px rgba(0,0,0,0.12);
          transition: opacity 0.3s ease;
        }
        [data-theme="night"] .bg-countdown {
          text-shadow: 0 2px 16px rgba(0,0,0,0.5);
        }
        .bg-phase-label {
          font-size: 13px;
          color: var(--text);
          opacity: 0.92;
          margin: 8px 0 0;
          letter-spacing: 0.1em;
        }

        /* ===== 节奏指示器 ===== */
        .bg-rhythm {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bg-rhythm-item {
          display: flex;
          align-items: center;
          gap: 7px;
          position: relative;
        }
        .bg-rhythm-item:not(:last-child)::after {
          content: "";
          position: absolute;
          right: var(--sep-pos, -15px);
          width: 3px; height: 3px;
          border-radius: 50%;
          background: var(--border);
          opacity: 0.7;
        }
        .bg-rhythm-dot {
          width: 9px; height: 9px;
          border-radius: 50%;
          background: var(--border);
          transition: background 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease;
        }
        .bg-rhythm-dot.active {
          background: var(--arc-color, #5B9BD5);
          transform: scale(1.45);
          box-shadow: 0 0 10px 1px var(--arc-color, #5B9BD5);
        }
        .bg-rhythm-text {
          font-size: 12px;
          color: var(--text);
          opacity: 0.62;
          transition: opacity 0.3s, color 0.3s;
        }
        .bg-rhythm-text.active {
          color: var(--text);
          font-weight: 600;
          opacity: 1;
        }

        /* ===== 模式信息 ===== */
        .bg-mode-info { text-align: center; }
        .bg-mode-name {
          font-family: ${SERIF_FONT};
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
          margin: 0;
        }
        .bg-mode-desc {
          font-size: 11px;
          color: var(--text);
          opacity: 0.78;
          margin: 3px 0 0;
          letter-spacing: 0.04em;
        }
        .bg-cycle-count {
          font-size: 12px;
          color: var(--text);
          opacity: 0.82;
          margin: 6px 0 0;
        }
        .bg-cycle-count span {
          color: var(--arc-color, #5B9BD5);
          font-weight: 600;
          font-family: ${SERIF_FONT};
        }

        /* ===== 控制按钮 ===== */
        .bg-controls {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .bg-btn {
          padding: 10px 32px;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.25s ease, box-shadow 0.25s ease;
        }
        .bg-btn:hover { transform: scale(1.04); }
        .bg-btn:active { transform: scale(0.97); }
        .bg-btn-start {
          background: var(--arc-color, #4CAF50);
          color: #fff;
          box-shadow: 0 3px 14px -3px var(--arc-color, rgba(76,175,80,0.5));
        }
        .bg-btn-reset {
          background: transparent;
          color: var(--text-soft);
          border: 1px solid var(--border);
        }
        .bg-btn-reset:hover { background: rgba(0,0,0,0.04); }
        [data-theme="night"] .bg-btn-reset:hover { background: rgba(255,255,255,0.05); }

        /* ===== 响应式 ===== */
        @media (max-width: 480px) {
          .bg-arc-area { width: 200px; height: 200px; }
          .bg-orb { width: 130px; height: 130px; }
          .bg-countdown { font-size: 44px; }
          .bg-state-btn { padding: 6px 12px; font-size: 12px; }
          .bg-btn { padding: 9px 26px; font-size: 13px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .bg-aura { transition: none; }
        }
      `}</style>

      {/* ───── 标题 ───── */}
      <div className="bg-header">
        <p className="bg-title">呼吸引导</p>
        <p className="bg-subtitle">选择你当下的状态，开始调整</p>
      </div>

      {/* ───── 情绪状态选择 ───── */}
      <div className="bg-state-bar">
        {MODES.map((m) => (
          <button
            key={m.id}
            className={`bg-state-btn${mode.id === m.id ? " active" : ""}`}
            style={
              {
                "--state-color": m.color,
                background: mode.id === m.id ? m.color : undefined,
              } as React.CSSProperties
            }
            onClick={() => handleSelectMode(m)}
          >
            <span className="bg-state-emoji">{m.emoji}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* ───── 呼吸圆环 ───── */}
      <div
        className="bg-arc-area"
        style={
          {
            "--arc-color": mode.color,
            "--aura-color": `${mode.color}40`,
          } as React.CSSProperties
        }
      >
        {/* 外圈氛围光 */}
        <div className="bg-aura" />

        {/* 圆弧轨道 + 进度 */}
        <svg className="bg-arc-svg" viewBox="0 0 200 200">
          <circle className="bg-arc-track" cx="100" cy="100" r={RADIUS} />
          <circle
            ref={arcRef}
            className="bg-arc-progress"
            cx="100"
            cy="100"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            style={{
              strokeDashoffset: CIRCUMFERENCE,
              stroke: mode.color,
            }}
          />
        </svg>

        {/* 呼吸光球 */}
        <div
          ref={orbRef}
          className="bg-orb"
          style={{
            background: `radial-gradient(circle at center, ${mode.color}55 0%, ${mode.color}22 45%, ${mode.color}00 72%)`,
          }}
        />

        {/* 中心倒计时 + 阶段名 */}
        <div className="bg-center">
          <p className="bg-countdown">{countdown}</p>
          <p className="bg-phase-label">{phaseDisplayText}</p>
        </div>
      </div>

      {/* ───── 节奏指示器（动态阶段数：3 或 4） ───── */}
      <div
        className="bg-rhythm"
        style={
          {
            "--arc-color": mode.color,
            gap: isFourPhase ? "14px" : "22px",
            "--sep-pos": isFourPhase ? "-8px" : "-15px",
          } as React.CSSProperties
        }
      >
        {phases.map((p, i) => (
          <div key={i} className="bg-rhythm-item">
            <span
              className={`bg-rhythm-dot${hasStarted && phaseIndex === i ? " active" : ""}`}
            />
            <span
              className={`bg-rhythm-text${hasStarted && phaseIndex === i ? " active" : ""}`}
            >
              {p.label}
            </span>
          </div>
        ))}
      </div>

      {/* ───── 模式信息 ───── */}
      <div className="bg-mode-info">
        <p className="bg-mode-name">{mode.modeName}</p>
        <p className="bg-mode-desc">{mode.desc}</p>
        <p className="bg-cycle-count">
          {rhythmString} 节奏 · 已完成 <span>{cycleCount}</span> 个循环
        </p>
      </div>

      {/* ───── 控制按钮 ───── */}
      <div
        className="bg-controls"
        style={{ "--arc-color": mode.color } as React.CSSProperties}
      >
        <button className="bg-btn bg-btn-start" onClick={handleToggleRun}>
          {buttonText}
        </button>
        <button className="bg-btn bg-btn-reset" onClick={handleReset}>
          重置
        </button>
      </div>
    </div>
  );
};

export default BreathingGuide;
