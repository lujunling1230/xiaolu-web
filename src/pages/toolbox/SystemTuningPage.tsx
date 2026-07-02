import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { callAI } from "../../utils/aiClient";

/**
 * 系统调频 · System Tuning
 *
 * 认知轨解忧工具 —— 基于李松蔚《5%的改变》。
 * 与「解忧杂货铺」（情绪轨）形成双轨：杂货铺温柔倾听，调频给最小行动。
 * 收音机调频隐喻：描述困扰 → 旋钮扫频 → 信号清晰 → 输出 5% 微改变。
 */

/* ============================================================
   调频师人设 & 频段库
   ============================================================ */
interface Tune {
  freq: string;   // 调频刻度文案
  signal: string; // 清晰后的信号（调频师回复正文）
}

/** 调频师 System Prompt（人设） */
const TUNER_SYSTEM_PROMPT =
  `你是"调频师"，一位温柔、缓慢、像深夜电台主持人的老朋友。你说话不用感叹号，句子有长有短，偶尔停顿。你不用专业术语，用生活化比喻（如"卡住的拉链""生锈的门铰链"）。你先接纳情绪，再轻轻引导，绝不指责，不说"你应该"。回复控制在 3-5 句话，结尾必须署名"—— 调频师 (FM 95.8)"。`;

/** 可用频段（调频刻度） */
const FREQS: string[] = [
  "FM 88.6",
  "FM 92.1",
  "FM 95.8",
  "FM 98.3",
  "FM 103.7",
  "FM 106.5",
];

/* ============================================================
   Web Audio：调频扫频音 + 信号清晰"叮"
   ============================================================ */
let audioCtx: AudioContext | null = null;
const getCtx = () => {
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    audioCtx = new Ctor();
  }
  return audioCtx;
};

/** 调频扫频：模拟旋钮转动时的沙沙扫频声 */
const playSweep = () => {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    // 白噪声经带通滤波，模拟调频杂音
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 4;
    bp.frequency.setValueAtTime(600, now);
    bp.frequency.linearRampToValueAtTime(2400, now + 0.5);
    bp.frequency.linearRampToValueAtTime(900, now + 0.75);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    noise.connect(bp);
    bp.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.8);
  } catch {
    /* 静音 */
  }
};

/** 信号清晰：一声清脆"叮" */
const playClear = () => {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1046, now); // C6
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  } catch {
    /* 静音 */
  }
};

/* ============================================================
   主组件
   ============================================================ */
const SystemTuningPage: React.FC = () => {
  const [trouble, setTrouble] = useState("");
  const [status, setStatus] = useState<"idle" | "tuning" | "clear">("idle");
  const [tune, setTune] = useState<Tune | null>(null);

  const handleTune = async () => {
    const t = trouble.trim();
    if (!t) return;
    playSweep();
    setStatus("tuning");
    setTune(null);

    // 同时发起 AI 请求，保留至少 1.2s 的扫频体验
    const startedAt = Date.now();
    const aiSignal = await callAI(TUNER_SYSTEM_PROMPT, t);
    const elapsed = Date.now() - startedAt;
    const minDelay = 1200 - elapsed;
    if (minDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, minDelay));
    }

    const freq = FREQS[Math.floor(Math.random() * FREQS.length)];
    setTune({ freq, signal: aiSignal });
    setStatus("clear");
    playClear();
  };

  const handleReset = () => {
    setStatus("idle");
    setTune(null);
    setTrouble("");
  };

  // 旋钮角度（调频时转动）
  const knobAngle = useMemo(() => {
    if (status === "tuning") return 720;
    if (status === "clear") return 135;
    return 0;
  }, [status]);

  return (
    <div className="tune-page">
      {/* 顶部返回 */}
      <header className="tune-topbar">
        <Link to="/mickey" className="tune-back">
          ← 回到妙妙工具箱
        </Link>
        <span className="tune-topbar-meta">System Tuning</span>
      </header>

      {/* 标题区 */}
      <section className="tune-hero">
        <motion.div
          className="tune-knob-wrap"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="tune-knob"
            animate={{ rotate: knobAngle }}
            transition={{ duration: status === "tuning" ? 1.2 : 0.5, ease: "easeInOut" }}
          >
            <span className="tune-knob-indicator" />
          </motion.div>
          <div className="tune-knob-ticks">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="tune-tick"
                style={{ transform: `rotate(${i * 30}deg)` }}
              />
            ))}
          </div>
        </motion.div>

        <motion.h1
          className="tune-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          系统调频
        </motion.h1>
        <motion.p
          className="tune-subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          校准频率，让信号重新清晰。
        </motion.p>
      </section>

      {/* 调频输入区 */}
      <motion.section
        className="tune-console"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="tune-console-screen">
          <div className="tune-screen-top">
            <span className="tune-screen-label">
              {status === "idle" && "● 待机"}
              {status === "tuning" && "◉ 调频中…"}
              {status === "clear" && "✦ 信号清晰"}
            </span>
            {tune && <span className="tune-screen-freq">{tune.freq}</span>}
          </div>

          <textarea
            className="tune-input"
            placeholder="当前信号不稳定，描述你的困扰…"
            value={trouble}
            rows={3}
            onChange={(e) => setTrouble(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleTune();
            }}
            disabled={status === "tuning"}
          />
        </div>

        <button
          type="button"
          className="tune-btn"
          onClick={handleTune}
          disabled={!trouble.trim() || status === "tuning"}
        >
          {status === "tuning" ? "正在调频…" : "开始调频"}
        </button>
      </motion.section>

      {/* 调频结果 */}
      <AnimatePresence>
        {status === "tuning" && (
          <motion.div
            className="tune-static"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="tune-static-text">沙沙沙… 正在搜索清晰频段</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status === "clear" && tune && (
          <motion.section
            className="tune-signal"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="tune-signal-head">
              <span className="tune-signal-badge">5% 微改变</span>
              <span className="tune-signal-freq">{tune.freq}</span>
            </div>
            <div className="tune-signal-text">
              {tune.signal.split("\n").map((line, i) => {
                if (!line.trim()) return <br key={i} />;
                return <p key={i} className="tune-signal-para">{line}</p>;
              })}
            </div>
            <button type="button" className="tune-again" onClick={handleReset}>
              重新调频
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 双轨说明 */}
      <section className="tune-dual">
        <span className="tune-dual-line" />
        <p className="tune-dual-text">
          情绪找<span className="tune-dual-link">解忧杂货铺</span>，认知找<span className="tune-dual-self">系统调频</span>。
        </p>
        <span className="tune-dual-line" />
      </section>

      <style>{`
        .tune-page,
        .tune-page * { cursor: auto; }
        .tune-page a, .tune-page button { cursor: pointer; }
        .tune-page textarea { cursor: text; }

        .tune-page {
          min-height: 100vh;
          color: #e8e4dc;
          background:
            radial-gradient(120% 80% at 50% 0%, #2a2620 0%, #1c1916 50%, #14110f 100%);
          font-family: "Noto Sans SC", system-ui, sans-serif;
          padding: 0 24px 80px;
        }

        /* 顶部 */
        .tune-topbar {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 640px; margin: 0 auto; padding: 24px 4px 0;
        }
        .tune-back {
          font-size: 14px; color: #8a8478; text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease, transform 0.25s ease;
        }
        .tune-back:hover { color: #d4a85a; transform: translateX(-3px); }
        .tune-topbar-meta {
          font-size: 11px; color: #5a5448; letter-spacing: 0.28em; text-transform: uppercase;
        }

        /* 标题区 + 旋钮 */
        .tune-hero {
          max-width: 640px; margin: 0 auto; padding: 40px 4px 28px; text-align: center;
        }
        .tune-knob-wrap {
          position: relative; width: 96px; height: 96px; margin: 0 auto 22px;
        }
        .tune-knob {
          position: relative; width: 72px; height: 72px; border-radius: 50%;
          margin: 12px auto;
          background: radial-gradient(circle at 35% 30%, #6a6258, #3a342c 70%, #2a241e);
          box-shadow: 0 6px 18px -4px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.1);
        }
        .tune-knob-indicator {
          position: absolute; top: 6px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 16px; border-radius: 2px;
          background: #d4a85a; box-shadow: 0 0 8px rgba(212,168,90,0.6);
        }
        .tune-knob-ticks {
          position: absolute; inset: 0; pointer-events: none;
        }
        .tune-tick {
          position: absolute; top: 0; left: 50%; width: 2px; height: 6px;
          margin-left: -1px; background: #5a5448; transform-origin: 50% 48px;
        }
        .tune-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(28px, 4.5vw, 38px); font-weight: 600;
          color: #e8e4dc; margin: 0 0 10px; letter-spacing: 0.08em;
        }
        .tune-subtitle {
          font-size: 15px; color: #9a9488; margin: 0; letter-spacing: 0.06em;
        }

        /* 控制台 */
        .tune-console {
          max-width: 640px; margin: 0 auto; padding: 28px;
          background: linear-gradient(160deg, #2a2620, #1f1c18);
          border: 1px solid #3a342c; border-radius: 16px;
          box-shadow: 0 14px 40px -16px rgba(0,0,0,0.6);
        }
        .tune-console-screen {
          background: #14110f; border: 1px solid #2a241e; border-radius: 10px;
          padding: 16px; margin-bottom: 18px;
        }
        .tune-screen-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 12px;
        }
        .tune-screen-label {
          font-size: 12px; color: #d4a85a; letter-spacing: 0.1em;
          font-family: "Courier New", monospace;
        }
        .tune-screen-freq {
          font-size: 13px; color: #6a9a7a; font-family: "Courier New", monospace;
          letter-spacing: 0.08em;
        }
        .tune-input {
          width: 100%; border: none; resize: none; outline: none;
          background: transparent; font-family: inherit;
          font-size: 15px; line-height: 1.8; color: #d8d4cc;
        }
        .tune-input::placeholder { color: #5a5448; }
        .tune-input:disabled { opacity: 0.6; }

        .tune-btn {
          display: block; width: 100%; padding: 13px; border: none; border-radius: 10px;
          font-size: 15px; font-family: inherit; font-weight: 600; letter-spacing: 0.08em;
          color: #1c1916;
          background: linear-gradient(135deg, #d4a85a, #b88838);
          box-shadow: 0 6px 20px -6px rgba(212,168,90,0.4);
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .tune-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .tune-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* 调频中 */
        .tune-static { max-width: 640px; margin: 22px auto 0; text-align: center; }
        .tune-static-text {
          font-size: 13px; color: #8a8478; letter-spacing: 0.1em;
          font-family: "Courier New", monospace;
          animation: tune-blink 1s steps(2) infinite;
        }
        @keyframes tune-blink { 50% { opacity: 0.4; } }

        /* 信号结果 */
        .tune-signal {
          position: relative; max-width: 640px; margin: 22px auto 0;
          padding: 28px;
          background: linear-gradient(160deg, #1f2a24, #1a2420);
          border: 1px solid #3a4a40; border-radius: 16px;
          box-shadow: 0 16px 48px -20px rgba(106,154,122,0.3);
        }
        .tune-signal-head {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;
        }
        .tune-signal-badge {
          padding: 4px 12px; border-radius: 6px;
          font-size: 12px; font-weight: 700; color: #6a9a7a;
          background: rgba(106,154,122,0.12); border: 1px solid rgba(106,154,122,0.3);
          letter-spacing: 0.05em;
        }
        .tune-signal-freq {
          font-size: 13px; color: #d4a85a; font-family: "Courier New", monospace;
        }
        .tune-signal-text {
          margin: 0 0 18px;
        }
        .tune-signal-para {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 16px; line-height: 2; color: #e0dcd2; margin: 0;
          letter-spacing: 0.02em;
        }
        .tune-signal-note {
          font-size: 13px; color: #6a9a7a; margin: 0 0 22px; font-style: italic;
          opacity: 0.85;
        }
        .tune-again {
          display: block; margin: 0 auto; padding: 9px 24px;
          border: 1px solid #3a4a40; border-radius: 999px;
          background: transparent; font-size: 13px; font-family: inherit;
          color: #9ac48a; letter-spacing: 0.05em;
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .tune-again:hover { background: rgba(106,154,122,0.08); border-color: #6a9a7a; }

        /* 双轨说明 */
        .tune-dual {
          max-width: 640px; margin: 56px auto 0;
          display: flex; align-items: center; gap: 16px;
        }
        .tune-dual-line { flex: 1; height: 1px; background: #2a241e; }
        .tune-dual-text {
          font-size: 13px; color: #6a6258; margin: 0; white-space: nowrap;
          letter-spacing: 0.04em;
        }
        .tune-dual-link { color: #c89868; }
        .tune-dual-self { color: #6a9a7a; }

        @media (max-width: 520px) {
          .tune-console, .tune-signal { padding: 22px 18px; }
          .tune-dual { display: none; }
        }
      `}</style>
    </div>
  );
};

export default SystemTuningPage;
