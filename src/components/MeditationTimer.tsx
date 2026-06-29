import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * MeditationTimer 冥想空间
 *
 * 功能：
 * - 环境音选择：海浪 / 森林 / 篝火 / 音乐
 * - 时长选择：1 / 3 / 5 / 10 min
 * - 语音引导 Toggle
 * - 倒计时 + SVG 圆环进度条
 * - 完成涟漪动画
 * - Web Audio API 环境音模拟（简版白噪音）
 *
 * 技术栈：React + TypeScript + 内联 CSS（组件级 <style>）
 * 动画：Framer Motion + transform/opacity/filter
 */

/* ─── 常量 ─── */
const DURATIONS = [1, 3, 5, 10]; // 分钟

const SOUND_OPTIONS = [
  { id: "ocean", icon: "\uD83C\uDF0A", label: "海浪", sub: "Ocean" },
  { id: "forest", icon: "\uD83C\uDF32", label: "森林", sub: "Forest" },
  { id: "fire", icon: "\uD83D\uDD25", label: "篝火", sub: "Fire" },
  { id: "music", icon: "\uD83C\uDFB5", label: "音乐", sub: "Music" },
] as const;

type SoundId = (typeof SOUND_OPTIONS)[number]["id"];

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

/* ─── Web Audio 环境音辅助 ─── */

/** 创建 AudioContext（懒加载，需要用户交互后才能 resume） */
let audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * 启动环境音
 * TODO: 真实环境音需要音频文件或更复杂的合成；
 *       以下仅用基础振荡器 + 白噪音做简单模拟。
 */
function startAmbientSound(soundId: SoundId): { stop: () => void } {
  const ctx = getAudioCtx();
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.15;
  masterGain.connect(ctx.destination);

  const nodes: AudioNode[] = [masterGain];

  const stopAll = () => {
    nodes.forEach((n) => {
      try {
        if ("stop" in n && typeof (n as OscillatorNode).stop === "function") {
          (n as OscillatorNode).stop();
        }
      } catch {
        /* already stopped */
      }
      try {
        n.disconnect();
      } catch {
        /* already disconnected */
      }
    });
  };

  try {
    switch (soundId) {
      case "ocean": {
        // 低频脉动：LFO 调制 GainNode
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 80;
        const oscGain = ctx.createGain();
        oscGain.gain.value = 0.6;
        osc.connect(oscGain).connect(masterGain);
        osc.start();
        nodes.push(osc, oscGain);

        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.15; // 极慢脉动
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.4;
        lfo.connect(lfoGain).connect(oscGain.gain);
        lfo.start();
        nodes.push(lfo, lfoGain);
        break;
      }
      case "forest": {
        // 中频沙沙：多个高频振荡器叠加
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator();
          osc.type = "triangle";
          osc.frequency.value = 800 + i * 400;
          const g = ctx.createGain();
          g.gain.value = 0.15 - i * 0.03;
          osc.connect(g).connect(masterGain);
          osc.start();
          nodes.push(osc, g);
        }
        // 加一层低频噪声感
        const noiseOsc = ctx.createOscillator();
        noiseOsc.type = "sawtooth";
        noiseOsc.frequency.value = 120;
        const ng = ctx.createGain();
        ng.gain.value = 0.05;
        const bpf = ctx.createBiquadFilter();
        bpf.type = "bandpass";
        bpf.frequency.value = 600;
        bpf.Q.value = 0.5;
        noiseOsc.connect(ng).connect(bpf).connect(masterGain);
        noiseOsc.start();
        nodes.push(noiseOsc, ng, bpf);
        break;
      }
      case "fire": {
        // 温暖低频 crackle 感
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.value = 60;
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 200;
        const fg = ctx.createGain();
        fg.gain.value = 0.5;
        osc.connect(lp).connect(fg).connect(masterGain);
        osc.start();
        nodes.push(osc, lp, fg);

        const crackle = ctx.createOscillator();
        crackle.type = "square";
        crackle.frequency.value = 30;
        const cg = ctx.createGain();
        cg.gain.value = 0.08;
        crackle.connect(cg).connect(masterGain);
        crackle.start();
        nodes.push(crackle, cg);
        break;
      }
      case "music": {
        // 简单正弦波旋律：C4-E4-G4 循环
        const melody = [261.63, 329.63, 392.0, 329.63];
        let idx = 0;
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = melody[0];
        const mg = ctx.createGain();
        mg.gain.value = 0.4;
        osc.connect(mg).connect(masterGain);
        osc.start();
        nodes.push(osc, mg);
        const interval = setInterval(() => {
          idx = (idx + 1) % melody.length;
          osc.frequency.setValueAtTime(melody[idx], ctx.currentTime);
        }, 1200);
        // 把 stop 也清除 interval
        const origStop = stopAll;
        return {
          stop: () => {
            clearInterval(interval);
            origStop();
          },
        };
      }
    }
  } catch {
    // Web Audio 不可用时静默失败
  }

  return { stop: stopAll };
}

/* ─── 主组件 ─── */
const MeditationTimer: React.FC = () => {
  const [selectedSound, setSelectedSound] = useState<SoundId>("ocean");
  const [duration, setDuration] = useState(5);
  const [voiceGuide, setVoiceGuide] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showComingToast, setShowComingToast] = useState(false);

  // 环境音引用
  const ambientRef = useRef<{ stop: () => void } | null>(null);

  // 清理环境音
  const stopAmbient = useCallback(() => {
    if (ambientRef.current) {
      ambientRef.current.stop();
      ambientRef.current = null;
    }
  }, []);

  // 组件卸载时清理
  useEffect(() => {
    return () => stopAmbient();
  }, [stopAmbient]);

  // 倒计时
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRunning(false);
          setCompleted(true);
          stopAmbient();
          // 累计冥想时长到 localStorage
          try {
            const stored = parseInt(
              localStorage.getItem("meditation_total") || "0",
              10
            );
            localStorage.setItem("meditation_total", String(stored + duration * 60));
          } catch {
            /* ignore */
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, duration, stopAmbient]);

  const handleStart = () => {
    setCompleted(false);
    setSeconds(duration * 60);
    setRunning(true);
    // 启动环境音
    stopAmbient();
    ambientRef.current = startAmbientSound(selectedSound);
  };

  const handleEnd = () => {
    setRunning(false);
    setSeconds(0);
    setCompleted(false);
    stopAmbient();
  };

  const handleRetry = () => {
    setCompleted(false);
    setSeconds(0);
  };

  const progress =
    running && seconds > 0
      ? 1 - seconds / (duration * 60)
      : completed
        ? 1
        : 0;

  const circumference = 2 * Math.PI * 92;

  return (
    <>
    <motion.div
      className="ms-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* ===== 标题 ===== */}
      <div className="ms-header">
        <h3 className="ms-title">冥想空间</h3>
        <p className="ms-subtitle">聆听自然，放空思绪</p>
      </div>

      <AnimatePresence mode="wait">
        {/* ===== 设置阶段 ===== */}
        {!running && !completed && (
          <motion.div
            key="setup"
            className="ms-setup"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {/* ── 环境音选择 ── */}
            <div className="ms-section-label">选择环境音</div>
            <div className="ms-sound-grid">
              {SOUND_OPTIONS.map((opt) => (
                <motion.button
                  key={opt.id}
                  className={`ms-sound-card ${
                    selectedSound === opt.id ? "ms-sound-active" : ""
                  }`}
                  onClick={() => setSelectedSound(opt.id)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="ms-sound-icon">{opt.icon}</span>
                  <span className="ms-sound-label">{opt.label}</span>
                  <span className="ms-sound-sub">{opt.sub}</span>
                </motion.button>
              ))}

              {/* Coming Soon 占位卡 */}
              <motion.button
                className="ms-sound-card ms-sound-coming"
                onClick={() => {
                  setShowComingToast(true);
                  setTimeout(() => setShowComingToast(false), 8000);
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="ms-sound-icon">✨</span>
                <span className="ms-sound-label">更多音频</span>
                <span className="ms-sound-sub">Coming Soon</span>
              </motion.button>
            </div>

            {/* ── 时长选择 ── */}
            <div className="ms-section-label">选择时长</div>
            <div className="ms-duration-pills">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  className={`ms-pill ${duration === d ? "ms-pill-active" : ""}`}
                  onClick={() => setDuration(d)}
                >
                  {d} min
                </button>
              ))}
            </div>

            {/* ── 语音引导 Toggle ── */}
            <div className="ms-toggle-row">
              <span className="ms-toggle-label">语音引导</span>
              <button
                className={`ms-toggle-track ${voiceGuide ? "ms-toggle-on" : ""}`}
                onClick={() => setVoiceGuide((v) => !v)}
                aria-label="语音引导开关"
              >
                <motion.span
                  className="ms-toggle-thumb"
                  animate={{ x: voiceGuide ? 18 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* ── 开始按钮 ── */}
            <motion.button
              className="ms-start-btn"
              onClick={handleStart}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {voiceGuide ? "开始冥想（带引导）" : "开始冥想"}
            </motion.button>
          </motion.div>
        )}

        {/* ===== 冥想进行中 ===== */}
        {running && (
          <motion.div
            key="running"
            className="ms-running"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
          >
            {/* 环境音标签 */}
            <motion.div
              className="ms-active-sound"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {SOUND_OPTIONS.find((o) => o.id === selectedSound)?.icon}{" "}
              {SOUND_OPTIONS.find((o) => o.id === selectedSound)?.label}
              {voiceGuide ? " + 语音引导" : ""}
            </motion.div>

            {/* 进度环 */}
            <div className="ms-progress-ring">
              <svg className="ms-ring-svg" viewBox="0 0 200 200">
                <circle
                  className="ms-ring-bg"
                  cx="100"
                  cy="100"
                  r="92"
                  fill="none"
                  strokeWidth="4"
                />
                <motion.circle
                  className="ms-ring-fill"
                  cx="100"
                  cy="100"
                  r="92"
                  fill="none"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{
                    strokeDashoffset: circumference * (1 - progress),
                  }}
                  transition={{ duration: 1, ease: "linear" }}
                  transform="rotate(-90 100 100)"
                />
              </svg>
              <div className="ms-countdown">
                <span className="ms-time">{formatTime(seconds)}</span>
                <span className="ms-time-label">剩余</span>
              </div>
            </div>

            {/* 结束按钮 */}
            <motion.button
              className="ms-end-btn"
              onClick={handleEnd}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              结束
            </motion.button>
          </motion.div>
        )}

        {/* ===== 冥想完成 ===== */}
        {completed && (
          <motion.div
            key="completed"
            className="ms-completed"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* 涟漪动画 */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="ms-ripple"
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                  delay: i * 0.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            ))}
            <div className="ms-complete-icon">✨</div>
            <p className="ms-complete-label">冥想完成</p>
            <p className="ms-complete-duration">本次冥想 {duration} 分钟</p>
            <motion.button
              className="ms-start-btn"
              onClick={handleRetry}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              再来一次
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== 样式 ===== */}
      <style>{`
        /* ── 卡片容器 ── */
        .ms-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          padding: 28px 24px 32px;
          max-width: 480px;
          margin: 0 auto;
        }

        /* ── 标题 ── */
        .ms-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .ms-title {
          font-family: "Noto Serif SC", Georgia, "Times New Roman", serif;
          font-size: 16px;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 4px;
        }
        .ms-subtitle {
          font-size: 12px;
          color: var(--text-soft);
          margin: 0;
        }

        /* ── 设置阶段 ── */
        .ms-setup {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .ms-section-label {
          font-size: 13px;
          color: var(--text-soft);
          margin: 0;
          align-self: flex-start;
        }

        /* ── 环境音网格 ── */
        .ms-sound-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          width: 100%;
        }
        .ms-sound-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 14px 6px 10px;
          border: 1.5px solid var(--border);
          border-radius: 12px;
          background: #fff;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .ms-sound-card:hover {
          border-color: var(--accent);
        }
        .ms-sound-active {
          border-color: var(--accent) !important;
          background: rgba(122, 154, 130, 0.1) !important;
        }
        [data-theme="night"] .ms-sound-card {
          background: rgba(255,255,255,0.03);
        }
        [data-theme="night"] .ms-sound-active {
          background: rgba(157, 184, 165, 0.15) !important;
        }
        .ms-sound-icon {
          font-size: 24px;
          line-height: 1;
        }
        .ms-sound-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
        }
        .ms-sound-sub {
          font-size: 10px;
          color: var(--text-soft);
        }

        /* ── 时长 pill ── */
        .ms-duration-pills {
          display: flex;
          gap: 10px;
          width: 100%;
        }
        .ms-pill {
          flex: 1;
          padding: 8px 0;
          font-size: 13px;
          text-align: center;
          border: 1.5px solid var(--border);
          border-radius: 999px;
          background: transparent;
          color: var(--text-soft);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ms-pill:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        .ms-pill-active {
          background: var(--accent) !important;
          color: #fff !important;
          border-color: var(--accent) !important;
        }

        /* ── Toggle 开关 ── */
        .ms-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .ms-toggle-label {
          font-size: 13px;
          color: var(--text-soft);
        }
        .ms-toggle-track {
          position: relative;
          width: 40px;
          height: 22px;
          border-radius: 999px;
          border: none;
          background: #ccc;
          cursor: pointer;
          padding: 0;
          transition: background 0.25s;
        }
        .ms-toggle-on {
          background: var(--accent) !important;
        }
        .ms-toggle-thumb {
          position: absolute;
          top: 2px;
          left: 0;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.18);
        }

        /* ── 开始按钮 ── */
        .ms-start-btn {
          padding: 12px 40px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          border-radius: 999px;
          background: var(--accent);
          color: #fff;
          cursor: pointer;
          margin-top: 4px;
        }
        .ms-start-btn:hover {
          background: var(--accent-hover);
        }

        /* ── 冥想进行中 ── */
        .ms-running {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }
        .ms-active-sound {
          font-size: 13px;
          color: var(--text-soft);
        }
        .ms-progress-ring {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ms-ring-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .ms-ring-bg {
          stroke: var(--border);
        }
        .ms-ring-fill {
          stroke: var(--accent);
        }
        .ms-countdown {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          z-index: 1;
        }
        .ms-time {
          font-family: "Noto Serif SC", Georgia, "Times New Roman", serif;
          font-size: 36px;
          font-weight: 600;
          color: var(--text);
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.05em;
        }
        .ms-time-label {
          font-size: 12px;
          color: var(--text-soft);
        }
        .ms-end-btn {
          padding: 8px 28px;
          font-size: 13px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: transparent;
          color: var(--text-soft);
          cursor: pointer;
        }
        .ms-end-btn:hover {
          background: rgba(0,0,0,0.04);
        }
        [data-theme="night"] .ms-end-btn:hover {
          background: rgba(255,255,255,0.05);
        }

        /* ── 完成阶段 ── */
        .ms-completed {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          position: relative;
          padding: 30px 0 10px;
        }
        .ms-ripple {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(122, 154, 130, 0.25);
          top: 18px;
          pointer-events: none;
        }
        [data-theme="night"] .ms-ripple {
          background: rgba(157, 184, 165, 0.2);
        }
        .ms-complete-icon {
          font-size: 48px;
          position: relative;
          z-index: 1;
        }
        .ms-complete-label {
          font-family: "Noto Serif SC", Georgia, "Times New Roman", serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--text);
          margin: 8px 0 0;
          position: relative;
          z-index: 1;
        }
        .ms-complete-duration {
          font-size: 13px;
          color: var(--text-soft);
          margin: 0 0 16px;
          position: relative;
          z-index: 1;
        }

        /* ── 响应式 ── */
        @media (max-width: 480px) {
          .ms-card {
            padding: 20px 16px 24px;
          }
          .ms-sound-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .ms-duration-pills {
            gap: 8px;
          }
          .ms-pill {
            padding: 7px 0;
            font-size: 12px;
          }
        }

        /* Coming Soon 占位卡样式 */
        .ms-sound-coming {
          border-style: dashed;
          opacity: 0.65;
        }
        .ms-sound-coming:hover {
          opacity: 1;
        }

        /* Coming Soon Toast */
        .ms-coming-toast {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          padding: 12px 24px;
          border-radius: 999px;
          background: var(--text);
          color: var(--card-bg);
          font-size: 13px;
          z-index: 300;
          box-shadow: 0 8px 32px -4px rgba(0,0,0,0.2);
        }
      `}</style>
    </motion.div>

      {/* Coming Soon Toast — 简洁渲染，避免 transform 上下文问题 */}
      {showComingToast && (
        <div className="ms-coming-toast" data-testid="coming-toast">
          更多精彩音频正在路上，敬请期待！
        </div>
      )}
    </>
  );
};

export default MeditationTimer;
