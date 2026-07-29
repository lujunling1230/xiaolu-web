import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "../utils/track";

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
const DURATIONS = [1, 3, 5, 10, 15]; // 分钟

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

        // 第三层：沙滩低频震感（极低频白噪音）
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
        // 第一层：低频闷燃烧（低沉持续）—— 极低通滤波白噪音
        const noise1 = ctx.createBufferSource();
        noise1.buffer = noiseBuf;
        noise1.loop = true;
        const lpf1 = ctx.createBiquadFilter();
        lpf1.type = "lowpass";
        lpf1.frequency.value = 80;
        lpf1.Q.value = 0.4;
        const emberGain = ctx.createGain();
        emberGain.gain.value = 0.5;
        noise1.connect(lpf1);
        lpf1.connect(emberGain);
        emberGain.connect(masterGain);
        noise1.start();
        sources.push(noise1);

        // 第二层：中低频火焰呼呼声（带通 200-600Hz）—— 无 LFO，避免海浪感
        const noise2 = ctx.createBufferSource();
        noise2.buffer = noiseBuf;
        noise2.loop = true;
        const bpf2 = ctx.createBiquadFilter();
        bpf2.type = "bandpass";
        bpf2.frequency.value = 350;
        bpf2.Q.value = 0.6;
        const whooshGain = ctx.createGain();
        whooshGain.gain.value = 0.35;
        noise2.connect(bpf2);
        bpf2.connect(whooshGain);
        whooshGain.connect(masterGain);
        noise2.start();
        sources.push(noise2);

        // 第三层：密集噼啪声（中频带通 + 高频随机脉冲）
        const noise3 = ctx.createBufferSource();
        noise3.buffer = noiseBuf;
        noise3.loop = true;
        const bpf3 = ctx.createBiquadFilter();
        bpf3.type = "bandpass";
        bpf3.frequency.value = 2200;
        bpf3.Q.value = 3.5;
        const crackleGain = ctx.createGain();
        crackleGain.gain.value = 0;
        noise3.connect(bpf3);
        bpf3.connect(crackleGain);
        crackleGain.connect(masterGain);
        noise3.start();
        sources.push(noise3);

        // 密集不规则噼啪脉冲
        const crackleInterval = setInterval(() => {
          if (crackleGain.gain) {
            const now = ctx.currentTime;
            const val = 0.08 + Math.random() * 0.4;
            crackleGain.gain.setValueAtTime(0, now);
            crackleGain.gain.linearRampToValueAtTime(val, now + 0.002);
            crackleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025 + Math.random() * 0.06);
          }
        }, 30 + Math.random() * 80);
        intervals.push(crackleInterval);

        // 第四层：高频爆裂尖刺（木柴迸裂瞬间）
        const noise4 = ctx.createBufferSource();
        noise4.buffer = noiseBuf;
        noise4.loop = true;
        const hpf4 = ctx.createBiquadFilter();
        hpf4.type = "highpass";
        hpf4.frequency.value = 5000;
        const snapGain = ctx.createGain();
        snapGain.gain.value = 0;
        noise4.connect(hpf4);
        hpf4.connect(snapGain);
        snapGain.connect(masterGain);
        noise4.start();
        sources.push(noise4);

        const snapInterval = setInterval(() => {
          if (snapGain.gain) {
            const now = ctx.currentTime;
            const val = 0.05 + Math.random() * 0.3;
            snapGain.gain.setValueAtTime(0, now);
            snapGain.gain.linearRampToValueAtTime(val, now + 0.001);
            snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02 + Math.random() * 0.04);
          }
        }, 250 + Math.random() * 600);
        intervals.push(snapInterval);

        // 第五层：温暖低频嗡鸣（模拟篝火热量感）
        const hum = ctx.createOscillator();
        hum.type = "triangle";
        hum.frequency.value = 55;
        const humGain = ctx.createGain();
        humGain.gain.value = 0.1;
        hum.connect(humGain);
        humGain.connect(masterGain);
        hum.start();
        sources.push(hum);
        break;
      }

      /* ===== 鸟鸣 ===== */
      case "birds": {
        // 轻微环境底噪（模拟树叶沙沙声）
        const noise1 = ctx.createBufferSource();
        noise1.buffer = noiseBuf;
        noise1.loop = true;
        const bpf = ctx.createBiquadFilter();
        bpf.type = "bandpass";
        bpf.frequency.value = 2000;
        bpf.Q.value = 0.2;
        const ambGain = ctx.createGain();
        ambGain.gain.value = 0.06;
        noise1.connect(bpf);
        bpf.connect(ambGain);
        ambGain.connect(masterGain);
        noise1.start();
        sources.push(noise1);

        // 鸟鸣类型库：不同鸟的叫声参数
        const birdTypes = [
          { baseFreq: 2200, freqRange: 600, duration: 0.08, notes: 3, interval: 0.04, wave: "triangle" as OscillatorType },
          { baseFreq: 2800, freqRange: 400, duration: 0.12, notes: 2, interval: 0.06, wave: "sine" as OscillatorType },
          { baseFreq: 1600, freqRange: 800, duration: 0.06, notes: 4, interval: 0.03, wave: "triangle" as OscillatorType },
          { baseFreq: 3200, freqRange: 300, duration: 0.15, notes: 2, interval: 0.08, wave: "sine" as OscillatorType },
          { baseFreq: 1800, freqRange: 500, duration: 0.1, notes: 3, interval: 0.05, wave: "triangle" as OscillatorType },
        ];

        function chirp() {
          const bird = birdTypes[Math.floor(Math.random() * birdTypes.length)];
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const now = ctx.currentTime;

          osc.type = bird.wave;
          g.gain.setValueAtTime(0, now);

          for (let i = 0; i < bird.notes; i++) {
            const t = now + i * (bird.duration + bird.interval + Math.random() * 0.04);
            const freq = bird.baseFreq + (Math.random() - 0.5) * bird.freqRange;
            osc.frequency.setValueAtTime(freq, t);
            // 每个音符向上或向下滑音
            osc.frequency.linearRampToValueAtTime(
              freq + (Math.random() > 0.5 ? 1 : -1) * (100 + Math.random() * 400),
              t + bird.duration * 0.7
            );
            g.gain.setValueAtTime(0.06 + Math.random() * 0.12, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + bird.duration);
          }

          osc.connect(g);
          g.connect(masterGain);
          osc.start(now);
          osc.stop(now + bird.notes * (bird.duration + bird.interval) + 0.1);
          sources.push(osc);
        }

        function scheduleNext() {
          const delay = 600 + Math.random() * 3000;
          const id = setTimeout(() => {
            chirp();
            if (Math.random() > 0.4) {
              const id2 = setTimeout(() => chirp(), 100 + Math.random() * 200);
              timeouts.push(id2);
              if (Math.random() > 0.5) {
                const id3 = setTimeout(() => chirp(), 300 + Math.random() * 300);
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

/** 引导词库：丰富短句，按时长动态选取，避免短时间内重复 */
const GUIDE_LIBRARY = {
  // 开场（固定，仅1次）
  start:
    "你好，欢迎来到冥想空间。找一个舒适的姿势，轻轻闭上双眼。让我们跟随呼吸的节律，让身心慢慢沉入这片宁静之中。",
  // 呼吸引导（18条，由浅入深）
  breath: [
    "吸气，感受空气充满胸腔。呼气，让肩膀自然下沉。",
    "再来一次。吸气，新鲜。呼气，释放。",
    "让呼吸变得更深更慢，每一次呼气都带走一点紧张。",
    "注意呼吸的间隙，那个短暂的停顿，是最安静的片刻。",
    "气息像潮汐，来了又走，你只需要跟随它的节奏。",
    "深吸一口气，想象清新的空气流遍全身。缓缓呼出，带走所有的疲惫。",
    "不必刻意控制呼吸，只是感受它自然的流动，像溪水穿过石头。",
    "试着让吸气和呼气的时间一样长，在平衡中找到安定。",
    "把注意力放在鼻尖，感受空气进出的温度，凉凉的进来，暖暖的出去。",
    "想象每次吸气都把月光吸进身体，每次呼气都把浊气还给大地。",
    "数自己的呼吸，一吸一呼为一次，数到十就重新开始。",
    "如果呼吸变浅了，没关系，给它一点时间，它会自己找到节奏。",
    "感受胸腔的扩张与收缩，那是生命最原始的节奏。",
    "吸气时，想象身体像气球一样慢慢鼓起。呼气时，轻轻放掉所有的空气。",
    "把注意力从鼻尖慢慢移到腹部，感受腹式呼吸的深沉与平稳。",
    "试着延长呼气，比吸气多停留两秒，让身体更深地放松。",
    "呼吸不需要完美，每一次进出都是对身体最好的礼物。",
    "想象自己坐在森林深处，呼吸与树木一起，一呼一吸都是自然的韵律。",
  ],
  // 身体放松（18条，从头到脚）
  body: [
    "放松你的额头，舒展眉心。让脸部肌肉变得柔软。",
    "放松肩膀和手臂，让它们自然垂落，不再紧绷。",
    "感受背部贴合地面或椅背的支撑，你是安全的。",
    "放松腹部，让它随着呼吸自然起伏。",
    "放松双腿和双脚，它们承载了你一整天的重量，现在可以休息了。",
    "从头顶到脚趾，全身都在放松，越来越轻，越来越温暖。",
    "感受头皮的放松，像有人用温暖的手轻轻抚过你的头顶。",
    "让眼睛周围的肌肉松弛下来，眼皮变得沉重而舒适。",
    "放松下颌，让牙齿微微分开，舌头轻轻贴住上颚。",
    "感受脖子和喉咙的放松，像融化的蜡烛一样柔软。",
    "让胸腔和肋骨随着呼吸自由扩张，没有任何束缚。",
    "感受腰部的放松，那里常常藏着紧张，现在让它全部流走。",
    "放松臀部和骨盆，它们是身体的根基，此刻稳稳地托住你。",
    "感受大腿前侧和后侧的放松，肌肉像棉花一样柔软。",
    "放松膝盖和小腿，让它们沉下去，被大地稳稳地承接。",
    "感受脚踝的灵活，脚底的每一寸皮肤都在放松。",
    "想象一道温暖的光从头顶缓缓流过全身，所到之处肌肉都变得柔软。",
    "全身上下像浸在温水中，每一个细胞都在说谢谢。",
  ],
  // 正念觉察（18条）
  mindfulness: [
    "如果思绪飘走了，没关系，温柔地把注意力带回呼吸。",
    "不必评判此刻的感受，只是观察，允许一切如其所是。",
    "外界的声音只是声音，让它来，让它走，不追逐，不抗拒。",
    "此刻你不需要做任何事，不需要去往任何地方，只是在这里。",
    "每一个念头都是天上的云，你看着它来，看着它走，自己始终是那片天空。",
    "允许自己什么都不想，也允许自己想着什么，不苛责，不催促。",
    "如果心里有不舒服的感觉，不要推开它，只是看着它，像看窗外的一场雨。",
    "觉察此刻身体最舒服的部位，把注意力停留在那里，感受那份舒适。",
    "如果有焦虑，试着给它命名：这是紧张，这是担忧。命名之后，它就不那么可怕了。",
    "你不需要改变任何东西，此刻的你就足够好。",
    "注意此刻的情绪，它是什么颜色？什么形状？只是观察，不评判。",
    "把此刻当作一个礼物，拆开它，看看里面有什么。",
    "如果心里有很多声音，没关系，让它们像合唱团一样各自歌唱。",
    "觉察自己此刻是紧张还是放松，只是知道，不需要做什么。",
    "想象你的心是一个湖，念头是湖面的涟漪，而你只是湖底静静观望的石头。",
    "无论此刻感受到什么，都是真实的，都是值得被接纳的。",
    "把注意力收回到当下，回到呼吸，回到身体，回到此刻。",
    "你拥有暂停的权利，此刻就是属于你的暂停键。",
  ],
  // 意象引导（15条，适合中长时冥想）
  imagery: [
    "想象你站在一片开满野花的草地上，风轻轻吹过，带来泥土和青草的香气。",
    "想象自己是一棵古老的树，根深深扎入大地，枝叶伸向天空，风吹过，你只是轻轻摇曳。",
    "想象你坐在山顶，看着云海在脚下缓缓流动，太阳慢慢升起，金色的光芒洒满全身。",
    "想象自己是一条小溪，清澈的水流过石头，绕过树根，向远方奔去，不回头，不犹豫。",
    "想象你走进一片竹林，阳光透过竹叶洒下斑驳的光影，风吹过，竹叶沙沙作响。",
    "想象自己躺在一片铺满落叶的森林里，头顶是金色的树冠，落叶轻轻飘落到身上。",
    "想象你站在海边，海浪一次次拍打着沙滩，又退回去，带走你所有的烦恼。",
    "想象自己是一只鸟，展开翅膀飞翔在蓝天白云之间，风从羽毛间穿过，自由而轻盈。",
    "想象你走进一间温暖的小木屋，壁炉里的火轻轻燃烧，外面下着雪，你安全而温暖。",
    "想象自己是一颗种子，在黑暗的土壤里安静地等待，感受周围湿润的泥土，等待春天的到来。",
    "想象你漂浮在星空之中，周围是闪烁的星星，你变得很小很小，又变得很大很大。",
    "想象自己是一朵云，在蓝天上慢慢移动，时而遮住太阳，时而让阳光穿透身体。",
    "想象你坐在一条小船上，河水缓缓流淌，两岸是垂柳和野花，你什么都不用想。",
    "想象自己是一块被溪水冲刷的石头，表面光滑圆润，水流过身体，带走所有棱角。",
    "想象你站在雨后的森林里，空气里弥漫着泥土和松针的味道，每一口呼吸都充满生命力。",
  ],
  // 结束语（固定，仅1次）
  end:
    "冥想即将结束。慢慢将意识带回身体，感受手脚的存在。轻轻活动手指和脚趾，缓缓睁开双眼。愿你带着这份平静，走进接下来的生活。",
};

/** 获取最温柔的中文女声 */
function getFriendlyVoice(): SpeechSynthesisVoice | undefined {
  if (typeof window === "undefined" || !window.speechSynthesis) return undefined;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return undefined;
  const zh = voices.filter((v) => v.lang.startsWith("zh") || v.lang.startsWith("cmn") || v.lang.includes("CN") || v.lang.includes("HK") || v.lang.includes("TW"));
  if (!zh.length) return voices[0];
  // 优先匹配温柔女声
  const prefer = zh.find(
    (v) =>
      /xiaoxiao|xiaoyi|yunxi|yunjian|晓晓|晓伊|云希|云健|meijia|meiyan|佳|燕|Tingting|tingting|Sinji|sinji/i.test(v.name) ||
      (v.name.includes("Female") && (v.lang.startsWith("zh") || v.lang.includes("CN")))
  );
  return prefer || zh[0];
}

/** 预加载语音列表（解决 getVoices() 异步加载问题） */
function ensureVoicesLoaded(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve();
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      resolve();
    };
    // 超时兜底 3 秒
    setTimeout(() => { resolve(); }, 3000);
  });
}

/** 检测浏览器语音合成是否可用 */
function checkVoiceAvailable(): { available: boolean; hasZh: boolean; voiceCount: number } {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return { available: false, hasZh: false, voiceCount: 0 };
  }
  const voices = window.speechSynthesis.getVoices();
  const hasZh = voices.some((v) =>
    v.lang.startsWith("zh") || v.lang.startsWith("cmn") || v.lang.includes("CN")
  );
  return { available: voices.length > 0, hasZh, voiceCount: voices.length };
}

/** 播放语音引导 */
function speakGuide(text: string, onEnd?: () => void): SpeechSynthesisUtterance | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const u = new SpeechSynthesisUtterance(text);
  const voice = getFriendlyVoice();
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang || "zh-CN";
  } else {
    // 无匹配语音时，仍尝试用默认语音 + 中文语言标记
    u.lang = "zh-CN";
    console.warn("[Meditation] 未找到中文语音，尝试使用默认语音播放");
  }
  u.rate = 0.78;
  u.pitch = 0.88;
  u.volume = 0.95;
  if (onEnd) u.onend = onEnd;
  u.onerror = (e) => {
    console.warn("[Meditation] speechSynthesis error:", e.error, "text:", text.slice(0, 20));
  };
  try {
    window.speechSynthesis.speak(u);
    return u;
  } catch (e) {
    console.warn("[Meditation] speechSynthesis speak failed:", e);
    return null;
  }
}

/** 停止语音 */
function stopVoiceGuide() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/** 根据冥想时长构建引导队列和触发时间
 *  - 1min: start + end（无中间段）
 *  - 3min: start + 2段 + end
 *  - 5min: start + 4段 + end
 *  - 10min: start + 8段 + end
 *  - 15min: start + 12段 + end
 *  段与段之间均匀分布，避免密集和稀疏
 */
function buildGuideQueue(duration: number): { queue: string[]; triggers: number[] } {
  const total = duration * 60;
  const START_DURATION = 10; // 开场语音约10秒
  const END_DURATION = 20;   // 结束语音约20秒，需提前触发

  // 1分钟：只播 start + end
  if (duration <= 1) {
    return { queue: [], triggers: [] };
  }

  // 根据时长确定中间段数
  let segmentCount: number;
  let gapSeconds: number;
  if (duration <= 3) {
    segmentCount = 2;
    gapSeconds = 25;
  } else if (duration <= 5) {
    segmentCount = 4;
    gapSeconds = 30;
  } else if (duration <= 10) {
    segmentCount = 8;
    gapSeconds = 35;
  } else {
    segmentCount = 12;
    gapSeconds = 40;
  }

  // 实际可用窗口（start 结束后 ~ end 开始前）
  const availableWindow = total - START_DURATION - END_DURATION;
  // 如果按 gap 算放不下，减少段数
  const maxByGap = Math.floor(availableWindow / gapSeconds);
  segmentCount = Math.min(segmentCount, maxByGap);

  // 选取内容：按类别轮换，从每个类别顺序取，不循环重复
  const categories: (keyof typeof GUIDE_LIBRARY)[] = ["breath", "body", "mindfulness", "imagery"];
  const queue: string[] = [];
  // 用当前日期作为随机种子偏移，每天不同顺序起点
  const dayOffset = new Date().getDate() % categories.length;
  for (let i = 0; i < segmentCount; i++) {
    const catIdx = (i + dayOffset) % categories.length;
    const cat = categories[catIdx];
    const itemIdx = Math.floor(i / categories.length); // 每个类别顺序取
    const arr = GUIDE_LIBRARY[cat] as string[];
    if (itemIdx < arr.length) {
      queue.push(arr[itemIdx]);
    } else {
      // 超出范围时回退到 mindfulness（最多条）
      queue.push(GUIDE_LIBRARY.mindfulness[itemIdx % GUIDE_LIBRARY.mindfulness.length]);
    }
  }

  // 计算触发时间：均匀分布在 start 结束后到 end 开始前
  const triggers: number[] = [];
  if (queue.length > 0) {
    const windowStart = total - START_DURATION;
    const windowEnd = END_DURATION;
    const step = (windowStart - windowEnd) / (queue.length + 1);
    for (let i = 0; i < queue.length; i++) {
      triggers.push(Math.round(windowStart - step * (i + 1)));
    }
  }

  return { queue, triggers };
}

/* ─── 主组件 ─── */
const MeditationTimer: React.FC = () => {
  const [selectedSound, setSelectedSound] = useState<SoundId>("ocean");
  const [duration, setDuration] = useState(5);
  const [voiceGuide, setVoiceGuide] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<{ available: boolean; hasZh: boolean } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  // 环境音引用
  const ambientRef = useRef<{ stop: () => void } | null>(null);
  // 语音引导引用
  const voiceRef = useRef<SpeechSynthesisUtterance | null>(null);
  // 记录已播报的引导阶段（避免重复）
  const guideStageRef = useRef<Set<string>>(new Set());
  // 开场语音引导延迟定时器（点击后 2 秒再播报，让环境音先淡入）
  const startGuideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 清理环境音 + 语音 + 开场定时器
  const stopAmbient = useCallback(() => {
    if (startGuideTimerRef.current) {
      clearTimeout(startGuideTimerRef.current);
      startGuideTimerRef.current = null;
    }
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

  // 组件挂载时预加载语音列表并检测可用性
  useEffect(() => {
    ensureVoicesLoaded().then(() => {
      setVoiceStatus(checkVoiceAvailable());
    });
  }, []);

  // 倒计时 + 语音引导调度
  useEffect(() => {
    if (!running) return;
    const total = duration * 60;

    // ── 语音引导调度策略（按时长动态构建队列）──
    const END_TRIGGER_REMAINING = 20; // 结束语需提前 20 秒触发
    const { queue: midGuideQueue, triggers: midTriggerTimes } = buildGuideQueue(duration);

    // Chrome 安卓端 bug：speechSynthesis 运行 15 秒后会自动暂停
    const resumeTimer = voiceGuide
      ? setInterval(() => {
          if (typeof window !== "undefined" && window.speechSynthesis) {
            try {
              if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
              }
            } catch { /* ignore */ }
          }
        }, 10000)
      : null;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        const next = prev - 1;
        const remaining = next;

        // 语音引导：基于剩余秒数触发
        if (voiceGuide) {
          // 中间引导队列
          midTriggerTimes.forEach((triggerTime, idx) => {
            const stageKey = `mid${idx}`;
            if (remaining <= triggerTime && !guideStageRef.current.has(stageKey)) {
              guideStageRef.current.add(stageKey);
              voiceRef.current = speakGuide(midGuideQueue[idx]);
            }
          });
          // 结束语：剩余 20 秒时触发，确保说完
          if (remaining <= END_TRIGGER_REMAINING && remaining > 0 && !guideStageRef.current.has("end")) {
            guideStageRef.current.add("end");
            voiceRef.current = speakGuide(GUIDE_LIBRARY.end);
          }
        }

        if (next <= 0) {
          clearInterval(interval);
          if (resumeTimer) clearInterval(resumeTimer);
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
    return () => {
      clearInterval(interval);
      if (resumeTimer) clearInterval(resumeTimer);
    };
  }, [running, duration, stopAmbient, voiceGuide]);

  const handleStart = () => {
    track("healing_meditation", { duration, sound: selectedSound, voice_guide: voiceGuide });
    setCompleted(false);
    setSeconds(duration * 60);
    setRunning(true);
    guideStageRef.current.clear();
    // 清掉旧的开场定时器
    if (startGuideTimerRef.current) {
      clearTimeout(startGuideTimerRef.current);
      startGuideTimerRef.current = null;
    }
    // 只停环境音，不调 cancel()（cancel 会干扰紧接着的 speak，导致 iOS 静默失败）
    if (ambientRef.current) {
      ambientRef.current.stop();
      ambientRef.current = null;
    }
    ambientRef.current = startAmbientSound(selectedSound);
    // 语音引导：必须在用户点击手势内立即触发 speak()，延迟会导致浏览器阻止播放
    if (voiceGuide && typeof window !== "undefined" && window.speechSynthesis) {
      // 先强制触发语音引擎加载（某些浏览器首次 speak 后才会加载 voices）
      const dummy = new SpeechSynthesisUtterance("开始");
      dummy.volume = 0.01;
      dummy.rate = 3;
      window.speechSynthesis.speak(dummy);
      // 立即播放开场引导（不延迟，保持在用户手势上下文内）
      voiceRef.current = speakGuide(GUIDE_LIBRARY.start);
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

  // 显示"更多音频"提示 toast
  const showMoreSoundToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setShowToast(true);
    toastTimerRef.current = setTimeout(() => setShowToast(false), 2000);
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
      {/* ===== 右上角关闭按钮（冥想完成时显示） ===== */}
      <AnimatePresence>
        {completed && (
          <motion.button
            className="ms-close-btn"
            onClick={() => {
              setCompleted(false);
              setRunning(false);
              setSeconds(0);
              stopAmbient();
              if (typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
            }}
            title="退出"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            ×
          </motion.button>
        )}
      </AnimatePresence>

      {/* ===== 标题 ===== */}
      <div className="ms-header">
        <h3 className="ms-title">冥想空间</h3>
        <p className="ms-subtitle">聆听自然，放空思绪</p>
      </div>

      {/* ===== Toast 提示 ===== */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="ms-toast"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            更多精彩还在路上~
          </motion.div>
        )}
      </AnimatePresence>

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

              {/* 更多音频卡片 */}
              <motion.button
                className="ms-sound-card ms-sound-more"
                onClick={showMoreSoundToast}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="ms-sound-icon">✨</span>
                <span className="ms-sound-label">更多音频</span>
                <span className="ms-sound-sub">More</span>
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
            {voiceStatus && !voiceStatus.available && (
              <p className="ms-voice-hint" style={{ color: "#C0392B", fontSize: 11, marginTop: 4 }}>
                当前浏览器不支持语音合成，请更换浏览器（推荐 Edge / Chrome）
              </p>
            )}
            {voiceStatus && voiceStatus.available && !voiceStatus.hasZh && (
              <p className="ms-voice-hint" style={{ color: "#E67E22", fontSize: 11, marginTop: 4 }}>
                未检测到中文语音包，引导可能无法朗读中文
              </p>
            )}

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
          position: relative;
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
        .ms-sound-more {
          opacity: 0.7;
          border-style: dashed !important;
        }
        .ms-sound-more:hover {
          opacity: 1;
          border-color: var(--accent);
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
        .ms-close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(61,74,62,0.15);
          background: rgba(255,255,255,0.6);
          color: #6B7A6E;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
          transition: all 0.2s;
        }
        .ms-close-btn:hover {
          background: rgba(61,74,62,0.1);
          color: #3D4A3E;
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

        /* ── Toast 提示 ── */
        .ms-toast {
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          padding: 8px 18px;
          border-radius: 999px;
          background: rgba(61, 74, 62, 0.9);
          color: #fff;
          font-size: 13px;
          white-space: nowrap;
          z-index: 20;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          letter-spacing: 0.04em;
        }
        [data-theme="night"] .ms-toast {
          background: rgba(165, 196, 160, 0.95);
          color: #1a2e1f;
        }

      `}</style>
    </motion.div>
    </>
  );
};

export default MeditationTimer;
