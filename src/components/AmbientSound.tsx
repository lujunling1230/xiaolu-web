import { useState, useEffect, useRef, useCallback } from "react";

/**
 * AmbientSound 鸟鸣白噪音
 *
 * 仅保留鸟鸣一种音效（Web Audio API 合成，无需外部音频文件）。
 * 默认关闭，点击开启，再点关闭。
 * 音量 0.3，淡入淡出
 */

const VOLUME = 0.3;
const FADE_STEPS = 10;
const FADE_INTERVAL = 40;

/* ================================================================
   Web Audio API 合成器 — 鸟鸣
   ================================================================ */

let globalCtx: AudioContext | null = null;
let globalGain: GainNode | null = null;
let activeNodes: { sources: AudioNode[]; intervalIds: ReturnType<typeof setInterval>[] } | null = null;

function getAudioCtx(): { ctx: AudioContext; gain: GainNode } {
  if (!globalCtx || globalCtx.state === "closed") {
    globalCtx = new AudioContext();
    globalGain = globalCtx.createGain();
    globalGain.gain.value = 0;
    globalGain.connect(globalCtx.destination);
  }
  if (globalCtx.state === "suspended") globalCtx.resume();
  return { ctx: globalCtx, gain: globalGain! };
}

/** 停止所有活跃的音频节点 */
function stopAll() {
  if (!activeNodes) return;
  activeNodes.sources.forEach((n) => {
    try { (n as AudioScheduledSourceNode).stop(); } catch { /* already stopped */ }
    try { n.disconnect(); } catch { /* */ }
  });
  activeNodes.intervalIds.forEach(clearInterval);
  activeNodes.intervalIds.forEach(clearTimeout);
  activeNodes = null;
}

/* --- 鸟鸣 --- */
function createBirds(ctx: AudioContext, dest: GainNode): { sources: AudioNode[]; intervalIds: ReturnType<typeof setInterval>[] } {
  const sources: AudioNode[] = [];
  const intervalIds: ReturnType<typeof setInterval>[] = [];

  function chirp() {
    if (!globalCtx || globalCtx.state === "closed") return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const now = ctx.currentTime;

    const baseFreq = 1800 + Math.random() * 2400;
    const chirpLen = 0.06 + Math.random() * 0.12;
    const numNotes = 2 + Math.floor(Math.random() * 4);

    osc.type = "sine";
    g.gain.setValueAtTime(0, now);

    for (let i = 0; i < numNotes; i++) {
      const t = now + i * (chirpLen + 0.02 + Math.random() * 0.06);
      const freq = baseFreq + (Math.random() - 0.5) * 800;
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(
        freq + (Math.random() > 0.5 ? 1 : -1) * (200 + Math.random() * 600),
        t + chirpLen * 0.6
      );
      g.gain.setValueAtTime(0.08 + Math.random() * 0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + chirpLen);
    }

    osc.connect(g);
    g.connect(dest);
    osc.start(now);
    osc.stop(now + numNotes * (chirpLen + 0.1) + 0.1);
    sources.push(osc);
  }

  function scheduleNext() {
    const delay = 400 + Math.random() * 2500;
    const id = setTimeout(() => {
      chirp();
      if (Math.random() > 0.5) {
        setTimeout(() => chirp(), 80 + Math.random() * 150);
        if (Math.random() > 0.6) {
          setTimeout(() => chirp(), 200 + Math.random() * 200);
        }
      }
      scheduleNext();
    }, delay);
    intervalIds.push(id as unknown as ReturnType<typeof setInterval>);
  }
  scheduleNext();

  return { sources, intervalIds };
}

/* ================================================================
   SVG 图标 — 鸟鸣
   ================================================================ */

const BirdIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8c0-3.3-2.7-6-6-6S6 4.7 6 8c0 1.2.4 2.4 1 3.3L4 18h4l1-3h6l1 3h4l-3-6.7c.6-.9 1-2.1 1-3.3z" />
    <circle cx="10" cy="8" r="0.5" fill="currentColor" />
    <path d="M16 8l3-2" />
  </svg>
);

/* ================================================================
   组件 — 点击开启/关闭鸟鸣
   ================================================================ */

interface AmbientSoundProps {
  variant?: "floating" | "navbar";
}

const AmbientSound: React.FC<AmbientSoundProps> = ({ variant = "floating" }) => {
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(false);

  // 清理
  useEffect(() => {
    return () => { stopAll(); };
  }, []);

  const togglePlay = useCallback(() => {
    if (playingRef.current) {
      // 淡出
      const { gain } = getAudioCtx();
      let step = 0;
      const fade = setInterval(() => {
        step++;
        const v = VOLUME * (1 - step / FADE_STEPS);
        if (v > 0.01) {
          gain.gain.setTargetAtTime(v, globalCtx!.currentTime, 0.05);
        } else {
          clearInterval(fade);
          gain.gain.setValueAtTime(0, globalCtx!.currentTime);
          stopAll();
          playingRef.current = false;
          setPlaying(false);
        }
      }, FADE_INTERVAL);
    } else {
      // 淡入
      const { ctx, gain } = getAudioCtx();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      activeNodes = createBirds(ctx, gain);
      let step = 0;
      const fade = setInterval(() => {
        step++;
        const v = VOLUME * (step / FADE_STEPS);
        if (v < VOLUME - 0.01) {
          gain.gain.setTargetAtTime(v, ctx.currentTime, 0.05);
        } else {
          clearInterval(fade);
          gain.gain.setValueAtTime(VOLUME, ctx.currentTime);
        }
      }, FADE_INTERVAL);
      playingRef.current = true;
      setPlaying(true);
    }
  }, []);

  if (variant === "navbar") {
    return (
      <button
        className={`ambient-nav-btn ${playing ? "ambient-nav-playing" : "ambient-nav-muted"}`}
        onClick={togglePlay}
        aria-label={playing ? "关闭鸟鸣" : "开启鸟鸣"}
        title={playing ? "鸟鸣 · 点击关闭" : "开启鸟鸣"}
      >
        <BirdIcon />
        <style>{`
          .ambient-nav-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            border: 1px solid var(--border);
            background: transparent;
            color: var(--text-soft);
            cursor: pointer;
            transition: color 0.25s ease, border-color 0.25s ease, opacity 0.25s ease;
          }
          .ambient-nav-btn:hover {
            color: var(--accent);
            border-color: var(--accent);
          }
          .ambient-nav-playing {
            color: var(--accent);
            border-color: rgba(122, 154, 130, 0.4);
          }
          .ambient-nav-muted {
            opacity: 0.5;
          }
        `}</style>
      </button>
    );
  }

  // 浮动模式
  return (
    <button
      className={`ambient-btn ${playing ? "ambient-playing" : "ambient-muted"}`}
      onClick={togglePlay}
      aria-label={playing ? "关闭鸟鸣" : "开启鸟鸣"}
      title={playing ? "鸟鸣 · 点击关闭" : "开启鸟鸣"}
    >
      <BirdIcon />
      <style>{`
        .ambient-btn {
          position: fixed;
          right: 24px;
          bottom: 72px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--card-bg);
          color: var(--text-soft);
          cursor: pointer;
          opacity: 0.4;
          z-index: 50;
          box-shadow: 0 2px 12px -4px rgba(0,0,0,0.1);
          transition: opacity 0.3s ease, transform 0.3s ease, color 0.3s ease;
        }
        .ambient-btn:hover {
          opacity: 1;
          transform: translateY(-2px);
          color: var(--accent);
          box-shadow: 0 6px 20px -6px rgba(122, 154, 130, 0.3);
        }
        .ambient-playing {
          opacity: 0.7;
          color: var(--accent);
          animation: ambient-pulse 2.5s ease-in-out infinite;
        }
        .ambient-playing:hover {
          opacity: 1;
        }
        .ambient-muted {
          opacity: 0.4;
        }
        @keyframes ambient-pulse {
          0%, 100% { box-shadow: 0 2px 12px -4px rgba(122, 154, 130, 0.2); }
          50% { box-shadow: 0 2px 20px -2px rgba(122, 154, 130, 0.4); }
        }
        @media (max-width: 768px) {
          .ambient-btn {
            right: 16px;
            bottom: 64px;
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </button>
  );
};

export default AmbientSound;