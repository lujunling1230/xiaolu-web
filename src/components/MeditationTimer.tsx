import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * MeditationTimer 冥想空间
 *
 * 功能：
 * - 环境音选择：海浪 / 雨声 / 篝火 / 鸟鸣
 * - 时长选择：1 / 3 / 5 / 10 min
 * - 语音引导 Toggle
 * - 倒计时 + SVG 圆环进度条
 * - 完成涟漪动画
 * - Web Audio API 环境音实时合成（白噪音 + 滤波）
 *
 * 技术栈：React + TypeScript + 内联 CSS（组件级 <style>）
 * 动画：Framer Motion + transform/opacity/filter
 */

/* ─── 常量 ─── */
const DURATIONS = [1, 3, 5, 10]; // 分钟

const SOUND_OPTIONS = [
  { id: "ocean", icon: "\uD83C\uDF0A", label: "海浪", sub: "Ocean" },
  { id: "rain", icon: "\uD83C\uDF27", label: "雨声", sub: "Rain" },
  { id: "fire", icon: "\uD83D\uDD25", label: "篝火", sub: "Fire" },
  { id: "birds", icon: "\uD83D\uDC26", label: "鸟鸣", sub: "Birds" },
] as const;

type SoundId = (typeof SOUND_OPTIONS)[number]["id"];

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

/* ─── 白噪音缓冲（单例复用） ─── */
let noiseBuffer: AudioBuffer | null = null;
function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) return noiseBuffer;
  const bufSize = 2 * ctx.sampleRate; // 2 秒循环
  const buf = ctx.createBuffer(2, bufSize, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  }
  noiseBuffer = buf;
  return buf;
}

/* ─── Web Audio 环境音辅助 ─── */

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

/** 启动环境音 — 全部用白噪音 + 滤波实时合成 */
function startAmbientSound(soundId: SoundId): { stop: () => void } {
  const ctx = getAudioCtx();
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(ctx.destination);
  // 淡入（音量提升，四层合成更饱满）
  masterGain.gain.linearRampToValueAtTime(0.24, ctx.currentTime + 0.8);

  const sources: AudioScheduledSourceNode[] = [];
  const intervals: ReturnType<typeof setInterval>[] = [];
  const timeouts: ReturnType<typeof setTimeout>[] = [];

  const stopAll = () => {
    // 淡出
    try {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    } catch { /* */ }
    // 延迟断开
    setTimeout(() => {
      sources.forEach((s) => {
        try { s.stop(); } catch { /* */ }
        try { s.disconnect(); } catch { /* */ }
      });
      try { masterGain.disconnect(); } catch { /* */ }
    }, 600);
    intervals.forEach(clearInterval);
    timeouts.forEach(clearTimeout);
  };

  try {
    const noiseBuf = getNoiseBuffer(ctx);

    switch (soundId) {
      /* ===== 海浪 ===== */
      case "ocean": {
        // 第一层：低频浪涌（低通滤波 + LFO 深度调制）
        const noise1 = ctx.createBufferSource();
        noise1.buffer = noiseBuf;
        noise1.loop = true;
        const lpf1 = ctx.createBiquadFilter();
        lpf1.type = "lowpass";
        lpf1.frequency.value = 180; // 更深沉的低频
        lpf1.Q.value = 0.8;
        const waveGain = ctx.createGain();
        waveGain.gain.value = 0.85;
        noise1.connect(lpf1);
        lpf1.connect(waveGain);
        waveGain.connect(masterGain);
        noise1.start();
        sources.push(noise1);

        // LFO 潮汐调制 — 更深更慢的浪涌 (~16s 一个周期)
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.06;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.55;
        lfo.connect(lfoGain);
        lfoGain.connect(waveGain.gain);
        lfo.start();
        sources.push(lfo);

        // 第二层：中频碎浪（带通滤波）
        const noise2 = ctx.createBufferSource();
        noise2.buffer = noiseBuf;
        noise2.loop = true;
        const bpf2 = ctx.createBiquadFilter();
        bpf2.type = "bandpass";
        bpf2.frequency.value = 900;
        bpf2.Q.value = 0.35;
        const surfGain = ctx.createGain();
        surfGain.gain.value = 0.35;
        noise2.connect(bpf2);
        bpf2.connect(surfGain);
        surfGain.connect(masterGain);
        noise2.start();
        sources.push(noise2);

        // 碎浪也随潮汐起伏（略快于主浪）
        const lfo2 = ctx.createOscillator();
        lfo2.type = "sine";
        lfo2.frequency.value = 0.10;
        const lfoGain2 = ctx.createGain();
        lfoGain2.gain.value = 0.25;
        lfo2.connect(lfoGain2);
        lfoGain2.connect(surfGain.gain);
        lfo2.start();
        sources.push(lfo2);

        // 第三层：泡沫水花（高频白噪音 + 随机脉冲）
        const noise3 = ctx.createBufferSource();
        noise3.buffer = noiseBuf;
        noise3.loop = true;
        const hpf = ctx.createBiquadFilter();
        hpf.type = "highpass";
        hpf.frequency.value = 2800;
        hpf.Q.value = 0.4;
        const foamGain = ctx.createGain();
        foamGain.gain.value = 0;
        noise3.connect(hpf);
        hpf.connect(foamGain);
        foamGain.connect(masterGain);
        noise3.start();
        sources.push(noise3);

        // 随机泡沫脉冲 — 模拟浪花溅起
        const foamInterval = setInterval(() => {
          if (foamGain.gain) {
            const now = ctx.currentTime;
            const intensity = 0.08 + Math.random() * 0.18;
            foamGain.gain.setValueAtTime(0, now);
            foamGain.gain.linearRampToValueAtTime(intensity, now + 0.02);
            foamGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1 + Math.random() * 0.2);
          }
        }, 120 + Math.random() * 200);
        intervals.push(foamInterval);

        // 第四层：沙滩低频震感（极低频白噪音）
        const noise4 = ctx.createBufferSource();
        noise4.buffer = noiseBuf;
        noise4.loop = true;
        const lpf4 = ctx.createBiquadFilter();
        lpf4.type = "lowpass";
        lpf4.frequency.value = 60;
        lpf4.Q.value = 0.5;
        const sandGain = ctx.createGain();
        sandGain.gain.value = 0.3;
        noise4.connect(lpf4);
        lpf4.connect(sandGain);
        sandGain.connect(masterGain);
        noise4.start();
        sources.push(noise4);
        break;
      }

      /* ===== 雨声 ===== */
      case "rain": {
        // 基底：中高频白噪音（高通 + 低通 = 沙沙雨声）
        const noise1 = ctx.createBufferSource();
        noise1.buffer = noiseBuf;
        noise1.loop = true;
        const hpf = ctx.createBiquadFilter();
        hpf.type = "highpass";
        hpf.frequency.value = 700;
        const lpf = ctx.createBiquadFilter();
        lpf.type = "lowpass";
        lpf.frequency.value = 6000;
        lpf.Q.value = 0.5;
        const rainGain = ctx.createGain();
        rainGain.gain.value = 0.55;
        noise1.connect(hpf);
        hpf.connect(lpf);
        lpf.connect(rainGain);
        rainGain.connect(masterGain);
        noise1.start();
        sources.push(noise1);

        // 稀疏的大雨滴（随机带通滤波脉冲）
        const dripNoise = ctx.createBufferSource();
        dripNoise.buffer = noiseBuf;
        dripNoise.loop = true;
        const dripBpf = ctx.createBiquadFilter();
        dripBpf.type = "bandpass";
        dripBpf.frequency.value = 2000;
        dripBpf.Q.value = 3;
        const dripGain = ctx.createGain();
        dripGain.gain.value = 0;
        dripNoise.connect(dripBpf);
        dripBpf.connect(dripGain);
        dripGain.connect(masterGain);
        dripNoise.start();
        sources.push(dripNoise);

        // 随机雨滴脉冲
        const dripInterval = setInterval(() => {
          if (dripGain.gain) {
            const now = ctx.currentTime;
            const intensity = 0.08 + Math.random() * 0.15;
            dripGain.gain.setValueAtTime(0, now);
            dripGain.gain.linearRampToValueAtTime(intensity, now + 0.01);
            dripGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08 + Math.random() * 0.12);
          }
        }, 150 + Math.random() * 250);
        intervals.push(dripInterval);
        break;
      }

      /* ===== 篝火 ===== */
      case "fire": {
        // 第一层：火焰"呼呼"声（带通白噪音 + LFO 扫频模拟风动）
        const noise1 = ctx.createBufferSource();
        noise1.buffer = noiseBuf;
        noise1.loop = true;
        const bpf1 = ctx.createBiquadFilter();
        bpf1.type = "bandpass";
        bpf1.frequency.value = 300;
        bpf1.Q.value = 0.5;
        const fireGain = ctx.createGain();
        fireGain.gain.value = 0.6;
        noise1.connect(bpf1);
        bpf1.connect(fireGain);
        fireGain.connect(masterGain);
        noise1.start();
        sources.push(noise1);

        // LFO 模拟火焰跳动
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.4;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.3;
        lfo.connect(lfoGain);
        lfoGain.connect(fireGain.gain);
        lfo.start();
        sources.push(lfo);

        // 第二层：中频噼啪声（更频繁、更响亮）
        const noise2 = ctx.createBufferSource();
        noise2.buffer = noiseBuf;
        noise2.loop = true;
        const bpf2 = ctx.createBiquadFilter();
        bpf2.type = "bandpass";
        bpf2.frequency.value = 1500;
        bpf2.Q.value = 2.5;
        const crackleGain = ctx.createGain();
        crackleGain.gain.value = 0;
        noise2.connect(bpf2);
        bpf2.connect(crackleGain);
        crackleGain.connect(masterGain);
        noise2.start();
        sources.push(noise2);

        // 随机噼啪脉冲 — 更密集、更大声
        const crackleInterval = setInterval(() => {
          if (crackleGain.gain) {
            const now = ctx.currentTime;
            const val = 0.12 + Math.random() * 0.35;
            crackleGain.gain.setValueAtTime(0, now);
            crackleGain.gain.linearRampToValueAtTime(val, now + 0.003);
            crackleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04 + Math.random() * 0.08);
          }
        }, 50 + Math.random() * 120);
        intervals.push(crackleInterval);

        // 第三层：高频爆裂尖刺（木柴爆裂瞬间）
        const noise3 = ctx.createBufferSource();
        noise3.buffer = noiseBuf;
        noise3.loop = true;
        const hpf3 = ctx.createBiquadFilter();
        hpf3.type = "highpass";
        hpf3.frequency.value = 4500;
        const snapGain = ctx.createGain();
        snapGain.gain.value = 0;
        noise3.connect(hpf3);
        hpf3.connect(snapGain);
        snapGain.connect(masterGain);
        noise3.start();
        sources.push(noise3);

        // 稀疏爆裂脉冲
        const snapInterval = setInterval(() => {
          if (snapGain.gain) {
            const now = ctx.currentTime;
            const val = 0.06 + Math.random() * 0.25;
            snapGain.gain.setValueAtTime(0, now);
            snapGain.gain.linearRampToValueAtTime(val, now + 0.001);
            snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03 + Math.random() * 0.05);
          }
        }, 300 + Math.random() * 500);
        intervals.push(snapInterval);

        // 第四层：低频底噪（木柴闷烧感）
        const noise4 = ctx.createBufferSource();
        noise4.buffer = noiseBuf;
        noise4.loop = true;
        const lpf4 = ctx.createBiquadFilter();
        lpf4.type = "lowpass";
        lpf4.frequency.value = 100;
        lpf4.Q.value = 0.5;
        const emberGain = ctx.createGain();
        emberGain.gain.value = 0.4;
        noise4.connect(lpf4);
        lpf4.connect(emberGain);
        emberGain.connect(masterGain);
        noise4.start();
        sources.push(noise4);

        // 低频温暖嗡鸣
        const hum = ctx.createOscillator();
        hum.type = "sine";
        hum.frequency.value = 55;
        const humGain = ctx.createGain();
        humGain.gain.value = 0.12;
        hum.connect(humGain);
        humGain.connect(masterGain);
        hum.start();
        sources.push(hum);
        break;
      }

      /* ===== 鸟鸣 ===== */
      case "birds": {
        // 轻微环境底噪（非常低音量的带通）
        const noise1 = ctx.createBufferSource();
        noise1.buffer = noiseBuf;
        noise1.loop = true;
        const bpf = ctx.createBiquadFilter();
        bpf.type = "bandpass";
        bpf.frequency.value = 300;
        bpf.Q.value = 0.3;
        const ambGain = ctx.createGain();
        ambGain.gain.value = 0.08;
        noise1.connect(bpf);
        bpf.connect(ambGain);
        ambGain.connect(masterGain);
        noise1.start();
        sources.push(noise1);

        // 随机鸟鸣（正弦波啁啾）
        function chirp() {
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
            g.gain.setValueAtTime(0.1 + Math.random() * 0.15, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + chirpLen);
          }

          osc.connect(g);
          g.connect(masterGain);
          osc.start(now);
          osc.stop(now + numNotes * (chirpLen + 0.1) + 0.1);
          sources.push(osc);
        }

        // 调度下一次鸟叫
        function scheduleNext() {
          const delay = 500 + Math.random() * 2500;
          const id = setTimeout(() => {
            chirp();
            // 偶尔连叫两三声
            if (Math.random() > 0.5) {
              const id2 = setTimeout(() => chirp(), 80 + Math.random() * 150);
              timeouts.push(id2);
              if (Math.random() > 0.6) {
                const id3 = setTimeout(() => chirp(), 200 + Math.random() * 200);
                timeouts.push(id3);
              }
            }
            scheduleNext();
          }, delay);
          timeouts.push(id);
        }
        scheduleNext();
        break;
      }
    }
  } catch {
    // Web Audio 不可用时静默失败
  }

  return { stop: stopAll };
}

/* ─── 语音引导 ─── */

const GUIDE_TEXTS: Record<string, string> = {
  start:
    "你好，欢迎来到冥想空间。找一个舒适的姿势，轻轻闭上双眼。让我们跟随呼吸的节律，让身心慢慢沉入这片宁静之中。",
  mid30:
    "保持深呼吸，感受空气流过鼻腔的温度。每一次呼气，都让身体更加放松。不必赶走任何念头，只是温柔地注视着它们，然后轻轻放下。",
  mid60:
    "此刻，你与自然融为了一体。外界的声音变得遥远，内心的湖泊平静如镜。继续安住在这份宁静里，不需要去往任何地方。",
  end:
    "冥想即将结束。慢慢将意识带回身体，感受手脚的存在。轻轻活动手指和脚趾，当你准备好了，缓缓睁开双眼。愿你带着这份平静，走进接下来的生活。",
};

/** 获取最温柔的中文女声 */
function getFriendlyVoice(): SpeechSynthesisVoice | undefined {
  if (typeof window === "undefined" || !window.speechSynthesis) return undefined;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return undefined;
  const zh = voices.filter((v) => v.lang.startsWith("zh"));
  const prefer = zh.find(
    (v) =>
      /xiaoxiao|xiaoyi|yunxi|yunjian|晓晓|晓伊|云希|云健|meijia|meiyan|佳|燕/i.test(v.name) ||
      (v.name.includes("Female") && v.lang.startsWith("zh"))
  );
  return prefer || zh[0] || voices[0];
}

/** 播放语音引导 */
function speakGuide(text: string, onEnd?: () => void): SpeechSynthesisUtterance | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  window.speechSynthesis.cancel(); // 先停止之前的
  const u = new SpeechSynthesisUtterance(text);
  const voice = getFriendlyVoice();
  if (voice) u.voice = voice;
  u.lang = "zh-CN";
  u.rate = 0.78;  // 更慢，更舒缓自然
  u.pitch = 0.88; // 更柔和，像耳语
  u.volume = 0.85;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
  return u;
}

/** 停止语音 */
function stopVoiceGuide() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
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
  // 语音引导引用
  const voiceRef = useRef<SpeechSynthesisUtterance | null>(null);
  // 记录已播报的引导阶段（避免重复）
  const guideStageRef = useRef<Set<string>>(new Set());

  // 清理环境音 + 语音
  const stopAmbient = useCallback(() => {
    if (ambientRef.current) {
      ambientRef.current.stop();
      ambientRef.current = null;
    }
    stopVoiceGuide();
  }, []);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      stopAmbient();
      stopVoiceGuide();
    };
  }, [stopAmbient]);

  // 倒计时 + 语音引导调度
  useEffect(() => {
    if (!running) return;
    const total = duration * 60;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const next = prev - 1;
        const elapsed = total - next;
        const progress = elapsed / total;

        // 语音引导：按进度触发
        if (voiceGuide) {
          if (progress >= 0.28 && progress < 0.35 && !guideStageRef.current.has("mid30")) {
            guideStageRef.current.add("mid30");
            voiceRef.current = speakGuide(GUIDE_TEXTS.mid30);
          }
          if (progress >= 0.55 && progress < 0.65 && !guideStageRef.current.has("mid60")) {
            guideStageRef.current.add("mid60");
            voiceRef.current = speakGuide(GUIDE_TEXTS.mid60);
          }
          if (progress >= 0.82 && progress < 0.92 && !guideStageRef.current.has("end")) {
            guideStageRef.current.add("end");
            voiceRef.current = speakGuide(GUIDE_TEXTS.end);
          }
        }

        if (next <= 0) {
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
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, duration, stopAmbient, voiceGuide]);

  const handleStart = () => {
    setCompleted(false);
    setSeconds(duration * 60);
    setRunning(true);
    guideStageRef.current.clear();
    // 启动环境音
    stopAmbient();
    ambientRef.current = startAmbientSound(selectedSound);
    // 播放初始语音引导（延迟 1.5s，等环境音淡入后再开始）
    if (voiceGuide) {
      setTimeout(() => {
        voiceRef.current = speakGuide(GUIDE_TEXTS.start);
      }, 1500);
    }
  };

  const handleEnd = () => {
    setRunning(false);
    setSeconds(0);
    setCompleted(false);
    guideStageRef.current.clear();
    stopAmbient();
    stopVoiceGuide();
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
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(16px) saturate(1.4);
          -webkit-backdrop-filter: blur(16px) saturate(1.4);
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.4);
          padding: 28px 24px 32px;
          max-width: 480px;
          margin: 0 auto;
          /* 覆盖 hl-card 的白色变量，毛玻璃是浅色背景，需要深色文字 */
          --text: #3D4A3E;
          --text-soft: #6B7A6E;
          --accent: #5E8A6E;
          --card-bg: rgba(61,74,62,0.06);
          --border: rgba(61,74,62,0.15);
        }
        [data-theme="night"] .ms-card {
          background: rgba(30,41,59,0.6);
          border-color: rgba(255,255,255,0.08);
          box-shadow: 0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
          /* night 模式深色背景，恢复浅色文字 */
          --text: rgba(255, 255, 255, 0.88);
          --text-soft: rgba(255, 255, 255, 0.58);
          --accent: #A5C4A0;
          --card-bg: rgba(255,255,255,0.06);
          --border: rgba(255,255,255,0.12);
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
          color: var(--text);
          opacity: 0.85;
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
          color: var(--text);
          opacity: 0.85;
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
          background: var(--card-bg);
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
          color: var(--text);
          opacity: 0.75;
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
          color: var(--text);
          opacity: 0.78;
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
          color: var(--text);
          opacity: 0.88;
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
          color: var(--text);
          opacity: 0.88;
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
          color: var(--text);
          opacity: 0.85;
        }
        .ms-end-btn {
          padding: 8px 28px;
          font-size: 13px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: transparent;
          color: var(--text);
          opacity: 0.85;
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
          color: var(--text);
          opacity: 0.85;
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
          opacity: 0.78;
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
