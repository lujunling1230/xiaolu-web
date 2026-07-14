import { useState, useEffect, useRef, useCallback } from "react";

/**
 * AmbientSound 白噪音系统
 *
 * 四种白噪音（Web Audio API 合成，无需外部音频文件）：
 *   海浪 / 篝火 / 雨声 / 鸟鸣
 *
 * - 导航栏内联模式：点击展开四种选择
 * - 浮动模式：点击切换播放/暂停，长按或右键切换音效类型
 * - 音量 0.3，淡入淡出
 */

const VOLUME = 0.3;
const FADE_STEPS = 10;
const FADE_INTERVAL = 40;

type SoundType = "waves" | "campfire" | "rain" | "birds";

interface SoundDef {
  id: SoundType;
  label: string;
  icon: string; // emoji for selector
}

const SOUNDS: SoundDef[] = [
  { id: "waves",    label: "海浪",   icon: "~" },
  { id: "campfire", label: "篝火",   icon: "☀" },
  { id: "rain",     label: "雨声",   icon: "°" },
  { id: "birds",    label: "鸟鸣",   icon: "~" },
];

/* ================================================================
   Web Audio API 合成器
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
  activeNodes = null;
}

/* --- 海浪 --- */
function createWaves(ctx: AudioContext, dest: GainNode): { sources: AudioNode[]; intervalIds: ReturnType<typeof setInterval>[] } {
  const sources: AudioNode[] = [];
  const intervalIds: ReturnType<typeof setInterval>[] = [];

  // 低通滤波白噪音模拟海浪基底
  const bufSize = 2 * ctx.sampleRate;
  const buf = ctx.createBuffer(2, bufSize, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;

  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = 400;
  lpf.Q.value = 0.7;

  // LFO 调制音量制造潮汐感
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.5;
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.08; // ~12.5s 周期
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 0.35;
  lfo.connect(lfoDepth);
  lfoDepth.connect(lfoGain.gain);

  noise.connect(lpf);
  lpf.connect(lfoGain);
  lfoGain.connect(dest);

  noise.start();
  lfo.start();
  sources.push(noise, lfo);

  // 第二层：更高频的海浪碎波
  const buf2 = ctx.createBuffer(2, bufSize, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf2.getChannelData(ch);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  }
  const noise2 = ctx.createBufferSource();
  noise2.buffer = buf2;
  noise2.loop = true;
  const bpf = ctx.createBiquadFilter();
  bpf.type = "bandpass";
  bpf.frequency.value = 1200;
  bpf.Q.value = 0.3;
  const lfoGain2 = ctx.createGain();
  lfoGain2.gain.value = 0.2;
  const lfo2 = ctx.createOscillator();
  lfo2.type = "sine";
  lfo2.frequency.value = 0.12;
  const lfoDepth2 = ctx.createGain();
  lfoDepth2.gain.value = 0.15;
  lfo2.connect(lfoDepth2);
  lfoDepth2.connect(lfoGain2.gain);

  noise2.connect(bpf);
  bpf.connect(lfoGain2);
  lfoGain2.connect(dest);
  noise2.start();
  lfo2.start();
  sources.push(noise2, lfo2);

  return { sources, intervalIds };
}

/* --- 篝火 --- */
function createCampfire(ctx: AudioContext, dest: GainNode): { sources: AudioNode[]; intervalIds: ReturnType<typeof setInterval>[] } {
  const sources: AudioNode[] = [];
  const intervalIds: ReturnType<typeof setInterval>[] = [];

  const bufSize = 2 * ctx.sampleRate;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;

  // 带通滤波模拟噼啪声
  const bpf = ctx.createBiquadFilter();
  bpf.type = "bandpass";
  bpf.frequency.value = 600;
  bpf.Q.value = 2.5;

  // 随机增益抖动模拟柴火噼啪
  const crackleGain = ctx.createGain();
  crackleGain.gain.value = 0.6;

  const id = setInterval(() => {
    if (crackleGain.gain) {
      crackleGain.gain.setTargetAtTime(
        0.15 + Math.random() * 0.7,
        ctx.currentTime,
        0.05 + Math.random() * 0.15
      );
    }
  }, 100 + Math.random() * 200);
  intervalIds.push(id);

  // 低频隆隆声
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 40;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.08;
  lfo.connect(lfoGain);
  lfoGain.connect(dest);
  lfo.start();
  sources.push(lfo);

  noise.connect(bpf);
  bpf.connect(crackleGain);
  crackleGain.connect(dest);
  noise.start();
  sources.push(noise);

  return { sources, intervalIds };
}

/* --- 雨声 --- */
function createRain(ctx: AudioContext, dest: GainNode): { sources: AudioNode[]; intervalIds: ReturnType<typeof setInterval>[] } {
  const sources: AudioNode[] = [];

  const bufSize = 2 * ctx.sampleRate;
  const buf = ctx.createBuffer(2, bufSize, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;

  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass";
  hpf.frequency.value = 800;

  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = 6000;
  lpf.Q.value = 0.5;

  const gain = ctx.createGain();
  gain.gain.value = 0.45;

  noise.connect(hpf);
  hpf.connect(lpf);
  lpf.connect(gain);
  gain.connect(dest);
  noise.start();
  sources.push(noise);

  return { sources, intervalIds: [] };
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

  // 随机间隔啁啾
  function scheduleNext() {
    const delay = 400 + Math.random() * 2500;
    const id = setTimeout(() => {
      chirp();
      // 偶尔连叫两三声
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

const CREATORS: Record<SoundType, (ctx: AudioContext, dest: GainNode) => { sources: AudioNode[]; intervalIds: ReturnType<typeof setInterval>[] }> = {
  waves: createWaves,
  campfire: createCampfire,
  rain: createRain,
  birds: createBirds,
};

/* ================================================================
   SVG 图标
   ================================================================ */

const WaveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M2 12c1.5-3 3-3 4.5 0s3 3 4.5 0 3-3 4.5 0 3 3 4.5 0 3-3 4.5 0" />
  </svg>
);

const FireIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c-1 4-5 6-5 10.5C7 16.5 9.2 20 12 20s5-3.5 5-7.5c0-2-.8-3.5-2-5-.3-.3-.5-.7-.5-1.2 0-.8.5-1.6 1-2.3.3-.5.2-1.2-.3-1.5C14.5 1.8 13 2 12 2z" />
  </svg>
);

const RainIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M4 14l2 4M10 12l2 4M16 14l2 4M8 8l1.5 3M14 8l1.5 3" />
    <path d="M20 17.6A4 4 0 0017.6 10H17a6 6 0 10-11 2.5A3.5 3.5 0 008 19h11.5a4 4 0 002.5-1.4z" opacity="0" />
  </svg>
);

const BirdIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8c0-3.3-2.7-6-6-6S6 4.7 6 8c0 1.2.4 2.4 1 3.3L4 18h4l1-3h6l1 3h4l-3-6.7c.6-.9 1-2.1 1-3.3z" />
    <circle cx="10" cy="8" r="0.5" fill="currentColor" />
    <path d="M16 8l3-2" />
  </svg>
);

const ICONS: Record<SoundType, () => React.ReactElement> = {
  waves: WaveIcon,
  campfire: FireIcon,
  rain: RainIcon,
  birds: BirdIcon,
};

/* ================================================================
   组件
   ================================================================ */

interface AmbientSoundProps {
  variant?: "floating" | "navbar";
}

const AmbientSound: React.FC<AmbientSoundProps> = ({ variant = "floating" }) => {
  const [playing, setPlaying] = useState(false);
  const [soundType, setSoundType] = useState<SoundType>("waves");
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭面板
  useEffect(() => {
    if (!showPanel) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowPanel(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPanel]);

  // 清理
  useEffect(() => {
    return () => { stopAll(); };
  }, []);

  const togglePlay = useCallback(() => {
    if (playing) {
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
          setPlaying(false);
        }
      }, FADE_INTERVAL);
    } else {
      // 启动
      const { ctx, gain } = getAudioCtx();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      activeNodes = CREATORS[soundType](ctx, gain);
      // 淡入
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
      setPlaying(true);
    }
  }, [playing, soundType]);

  const selectSound = useCallback((type: SoundType) => {
    if (type === soundType && playing) {
      // 点击同一个 → 关闭
      togglePlay();
      setShowPanel(false);
      return;
    }
    const wasPlaying = playing;
    if (wasPlaying) {
      // 停止当前 → 切换 → 播放新
      stopAll();
    }
    setSoundType(type);
    setShowPanel(false);
    // 立即播放新的
    const { ctx, gain } = getAudioCtx();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    activeNodes = CREATORS[type](ctx, gain);
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
    setPlaying(true);
  }, [playing, soundType, togglePlay]);

  const ActiveIcon = ICONS[soundType];
  const currentLabel = SOUNDS.find((s) => s.id === soundType)?.label ?? "";

  if (variant === "navbar") {
    return (
      <div className="ambient-sound-root" ref={panelRef} style={{ position: "relative" }}>
        <button
          className={`ambient-nav-btn ${playing ? "ambient-nav-playing" : "ambient-nav-muted"}`}
          onClick={() => setShowPanel((v) => !v)}
          aria-label={playing ? `切换白噪音（当前：${currentLabel}）` : "开启白噪音"}
          title={playing ? `${currentLabel} · 点击切换` : "开启白噪音"}
        >
          <ActiveIcon />
        </button>

        {showPanel && (
          <div className="ambient-panel">
            <div className="ambient-panel-title">白噪音</div>
            {SOUNDS.map((s) => {
              const Icon = ICONS[s.id];
              const isActive = s.id === soundType && playing;
              return (
                <button
                  key={s.id}
                  className={`ambient-panel-item ${isActive ? "ambient-panel-active" : ""}`}
                  onClick={() => selectSound(s.id)}
                >
                  <span className="ambient-panel-icon"><Icon /></span>
                  <span className="ambient-panel-label">{s.label}</span>
                  {isActive && <span className="ambient-panel-dot" />}
                </button>
              );
            })}
          </div>
        )}

        <style>{`
          .ambient-sound-root { position: relative; }
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

          /* 选择面板 */
          .ambient-panel {
            position: absolute;
            top: calc(100% + 10px);
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
            min-width: 130px;
            padding: 6px 4px;
            background: var(--card-bg, #fff);
            border: 1px solid var(--border, rgba(0,0,0,0.08));
            border-radius: 12px;
            box-shadow: 0 8px 32px -8px rgba(0,0,0,0.12);
            animation: ambient-panel-in 0.2s ease-out;
          }
          @keyframes ambient-panel-in {
            from { opacity: 0; transform: translateX(-50%) translateY(-4px) scale(0.96); }
            to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
          }
          .ambient-panel-title {
            font-family: "Noto Serif SC", Georgia, serif;
            font-size: 10px;
            color: var(--text-soft);
            letter-spacing: 0.1em;
            text-align: center;
            padding: 4px 0 6px;
            opacity: 0.6;
          }
          .ambient-panel-item {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            padding: 8px 12px;
            border: none;
            border-radius: 8px;
            background: transparent;
            color: var(--text-soft);
            font-size: 13px;
            font-family: "Noto Sans SC", sans-serif;
            cursor: pointer;
            transition: background 0.2s ease, color 0.2s ease;
          }
          .ambient-panel-item:hover {
            background: rgba(122, 154, 130, 0.08);
            color: var(--text, #333);
          }
          .ambient-panel-active {
            background: rgba(122, 154, 130, 0.12);
            color: var(--accent);
          }
          .ambient-panel-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            flex-shrink: 0;
          }
          .ambient-panel-label {
            flex: 1;
            text-align: left;
          }
          .ambient-panel-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: var(--accent);
            opacity: 0.7;
          }
        `}</style>
      </div>
    );
  }

  // 浮动模式
  return (
    <div className="ambient-sound-root" ref={panelRef} style={{ position: "relative" }}>
      <button
        className={`ambient-btn ${playing ? "ambient-playing" : "ambient-muted"}`}
        onClick={() => setShowPanel((v) => !v)}
        aria-label={playing ? `切换白噪音（当前：${currentLabel}）` : "开启白噪音"}
        title={playing ? `${currentLabel} · 点击切换` : "开启白噪音"}
      >
        <ActiveIcon />
      </button>

      {showPanel && (
        <div className="ambient-panel ambient-panel-floating">
          <div className="ambient-panel-title">白噪音</div>
          {SOUNDS.map((s) => {
            const Icon = ICONS[s.id];
            const isActive = s.id === soundType && playing;
            return (
              <button
                key={s.id}
                className={`ambient-panel-item ${isActive ? "ambient-panel-active" : ""}`}
                onClick={() => selectSound(s.id)}
              >
                <span className="ambient-panel-icon"><Icon /></span>
                <span className="ambient-panel-label">{s.label}</span>
                {isActive && <span className="ambient-panel-dot" />}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        .ambient-sound-root { position: relative; }

        /* ===== 浮动模式（默认，右下角） ===== */
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

        /* 选择面板 */
        .ambient-panel {
          position: absolute;
          top: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          min-width: 130px;
          padding: 6px 4px;
          background: var(--card-bg, #fff);
          border: 1px solid var(--border, rgba(0,0,0,0.08));
          border-radius: 12px;
          box-shadow: 0 8px 32px -8px rgba(0,0,0,0.12);
          animation: ambient-panel-in 0.2s ease-out;
        }
        .ambient-panel-floating {
          right: 0;
          left: auto;
          transform: none;
        }
        @keyframes ambient-panel-in {
          from { opacity: 0; transform: translateY(-4px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ambient-panel-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 10px;
          color: var(--text-soft);
          letter-spacing: 0.1em;
          text-align: center;
          padding: 4px 0 6px;
          opacity: 0.6;
        }
        .ambient-panel-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: var(--text-soft);
          font-size: 13px;
          font-family: "Noto Sans SC", sans-serif;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .ambient-panel-item:hover {
          background: rgba(122, 154, 130, 0.08);
          color: var(--text, #333);
        }
        .ambient-panel-active {
          background: rgba(122, 154, 130, 0.12);
          color: var(--accent);
        }
        .ambient-panel-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
        .ambient-panel-label {
          flex: 1;
          text-align: left;
        }
        .ambient-panel-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.7;
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
    </div>
  );
};

export default AmbientSound;