import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ZhongjiPage 筑基 · 数字造物论
 *
 * 沉浸式竹简展开：深褐木纹背景 + 卷起→展开动画 + Web Audio 合成竹简声
 * 六章节切换：溯源·格物·致知·乘物·躬行·问心
 */

interface Volume {
  no: string;
  chapter: string;
  title: string;
  subtitle: string;
  quote: string;
  annotation?: string;
  path: string;
}

const VOLUMES: Volume[] = [
  {
    no: "卷一",
    chapter: "溯源",
    title: "技术底色",
    subtitle: "Software Fundamentals",
    quote:
      "曾以为代码只是逻辑，后来才懂那是另一种语言。从第一次在终端敲下 Hello World，到 Debug 到天明，我学会了与机器对话，更学会了严谨。HTML 是骨架，CSS 是皮相，JavaScript 是灵魂。每一个标签的嵌套，每一行样式的微调，每一次事件监听的绑定，都是通往产品世界的地基。不懂得技术的产品经理，如同不会画画的建筑师，终归纸上谈兵。",
    annotation: "地基不牢，地动山摇",
    path: "/zhongji/v1",
  },
  {
    no: "卷二",
    chapter: "格物",
    title: "产品初构",
    subtitle: "Product Thinking",
    quote:
      "产品不是画出来的，是推演出来的。每一个按钮的位置，每一次交互的反馈，背后都是对用户心智的揣摩。需求文档不是功能的罗列，而是对人性的一种理解。一个好的产品经理，要学会在混沌中找到秩序，在矛盾中找到平衡。从用户画像到用户旅程，从信息架构到交互原型，每一步都是对「人」的深度思考。这一卷，记录了从混沌的需求中梳理出清晰脉络的过程。",
    annotation: "从混沌中梳理脉络",
    path: "/zhongji/v2",
  },
  {
    no: "卷三",
    chapter: "致知",
    title: "交互与界面",
    subtitle: "UI/UX Design",
    quote:
      "界面是产品的脸，交互是产品的举止。我不追求炫技，只追求「刚刚好」。那种手指触碰屏幕时的顺滑感，是技术与艺术的交汇点。色彩不只是视觉，更是情绪；排版不只是美观，更是阅读的引导。留白不是浪费，而是呼吸。圆角不是妥协，而是温柔。每一个像素的对齐，每一帧动画的缓动，都是对用户感官的尊重。做界面，就是做一种无声的对话。",
    annotation: "参见《致用卷》工具箱",
    path: "/zhongji/v3",
  },
  {
    no: "卷四",
    chapter: "乘物",
    title: "AI 与工作流",
    subtitle: "AI Integration",
    quote:
      "AI 不是替代者，是副驾驶。这一卷记录了如何驯服大模型，让它成为我思维的延伸。从编写第一条 Prompt 到构建完整的 RAG 管道，这是一场关于效率的革命。Prompt 工程是心法，Chain of Thought 是路径，Function Calling 是桥梁。当你学会了与 AI 协作，你会发现它不是工具，而是伙伴。它帮你完成重复的劳动，而把创造力留给了你自己。",
    annotation: "Prompt 工程即心法",
    path: "/zhongji/v4",
  },
  {
    no: "卷五",
    chapter: "躬行",
    title: "项目深析",
    subtitle: "Project Retrospective",
    quote:
      "每一个成功的项目背后，都有十个失败的尝试。这里记录的不仅是光鲜的成果，更是那些被推翻的方案和深夜的反思。代码重构是勇气的体现，需求变更是常态的应对，上线延期是现实的妥协。真正的项目经验不在于你做了什么，而在于你从中学到了什么。失败是最好的老师，但前提是你真的去复盘了。每一个 Bug 都是通往更好产品的阶梯。",
    annotation: "失败是最好的老师",
    path: "/zhongji/v5",
  },
  {
    no: "卷六",
    chapter: "问心",
    title: "成长与反思",
    subtitle: "Growth Mindset",
    quote:
      "技术的浪潮奔涌不息，唯有保持空杯心态，方能不被淘汰。这一卷是我与自己的对话，关于成长，关于焦虑，关于在这个快速变化的时代如何安身立命。学了那么多技术，最终发现最难的不是写代码，而是知道自己为什么要写。做产品的意义不在于功能多少，而在于是否真的帮助了一个人。在效率与温度之间，我选择温度。在完美与完成之间，我选择完成。",
    annotation: "写于某个失眠的凌晨",
    path: "/zhongji/v6",
  },
];

/* ═══════════════════════════════════════════════════
   Web Audio API — 合成竹简展开摩擦声
   ═══════════════════════════════════════════════════ */
function playUnrollSound() {
  try {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();

    const duration = 1.3;
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // 合成带调制的噪声 → 模拟竹片摩擦
    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize;
      // 多层正弦调制，模拟不规则摩擦
      const mod = (Math.sin(t * Math.PI * 14) * 0.25 + 0.75) * (Math.sin(t * Math.PI * 3) * 0.2 + 0.8);
      // 添加随机颗粒
      const grain = Math.random() * 2 - 1;
      data[i] = grain * mod * 0.45;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // 带通滤波 — 突出"沙沙"的竹简质感
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2400;
    bp.Q.value = 0.6;

    // 高通滤波 — 去掉低频轰鸣
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 600;

    // 音量包络：快速起声 → 缓慢衰减
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.12);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(hp);
    hp.connect(bp);
    bp.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);

    // 清理
    setTimeout(() => ctx.close(), (duration + 0.2) * 1000);
  } catch {
    /* 静默降级 */
  }
}

/* ═══════════════════════════════════════════════════
   竹简端帽封皮
   ═══════════════════════════════════════════════════ */
const ScrollCap: React.FC<{ side: "left" | "right" }> = ({ side }) => (
  <div
    style={{
      position: "relative",
      width: 28,
      height: "100%",
      flexShrink: 0,
      background:
        side === "left"
          ? "linear-gradient(90deg, #2e1810 0%, #4e342e 40%, #5d4037 70%, #4e342e 100%)"
          : "linear-gradient(270deg, #2e1810 0%, #4e342e 40%, #5d4037 70%, #4e342e 100%)",
      borderRadius: side === "left" ? "14px 4px 4px 14px" : "4px 14px 14px 4px",
      boxShadow: `
        ${side === "left" ? "2px 0 8px rgba(0,0,0,0.25)" : "-2px 0 8px rgba(0,0,0,0.25)"}
        inset 0 2px 4px rgba(255,255,255,0.08),
        inset 0 -2px 4px rgba(0,0,0,0.3)
      `,
      zIndex: 5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {/* 金属轴芯 */}
    <div
      style={{
        width: 6,
        height: "70%",
        borderRadius: 3,
        background:
          "linear-gradient(180deg, #8d6e63 0%, #6d4c41 30%, #4e342e 60%, #6d4c41 100%)",
        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.15), 0 0 4px rgba(0,0,0,0.3)",
      }}
    />
  </div>
);

/* ═══════════════════════════════════════════════════
   竹简纹理背景
   ═══════════════════════════════════════════════════ */
const BAMBOO_TEXTURE = `
  repeating-linear-gradient(
    90deg,
    transparent 0px,
    transparent 36px,
    rgba(62, 39, 35, 0.18) 36px,
    rgba(62, 39, 35, 0.18) 37px
  ),
  repeating-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 0px,
    rgba(255, 255, 255, 0.04) 18px,
    transparent 18px,
    transparent 37px
  ),
  repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 160px,
    rgba(93, 64, 55, 0.12) 160px,
    rgba(93, 64, 55, 0.12) 163px
  ),
  linear-gradient(180deg, #dcc59a 0%, #dcc59a 100%)
`;

const WOOD_NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04 0.6' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.2 0 0 0 0 0.12 0 0 0 0 0.06 0 0 0 0.12 0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ═══════════════════════════════════════════════════
   毛笔笔触装饰线
   ═══════════════════════════════════════════════════ */
const BRUSH_STROKE = (
  <svg width="180" height="18" viewBox="0 0 180 18" fill="none" style={{ display: "block" }}>
    <path d="M0 9 Q30 5 60 8 Q90 12 120 7 Q150 3 180 9" stroke="#c4a974" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
    <path d="M0 9 Q30 10 60 8 Q90 6 120 9 Q150 11 180 9" stroke="#c4a974" strokeWidth="0.5" strokeLinecap="round" fill="none" opacity="0.25" />
  </svg>
);

/* 按句号拆分句子 */
const splitSentences = (text: string): string[] =>
  text.split(/(?<=。)/).filter((s) => s.trim().length > 0);

/* ═══════════════════════════════════════════════════
   单片竹简（带文字）
   ═══════════════════════════════════════════════════ */
const TextSlip: React.FC<{
  children: React.ReactNode;
  width: number;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  opacity?: number;
  fontStyle?: string;
  letterSpacing?: string;
  lineHeight?: number;
}> = ({
  children,
  width,
  fontSize = 15,
  color = "#3e2723",
  fontFamily = '"Noto Serif SC", serif',
  opacity = 1,
  fontStyle,
  letterSpacing = "0.08em",
  lineHeight = 2,
}) => (
  <div
    style={{
      width,
      flexShrink: 0,
      position: "relative",
      background: "#dcc59a",
      borderRight: "1px solid rgba(101, 80, 50, 0.22)",
      overflow: "hidden",
    }}
  >
    {/* 竖排文字 */}
    <div
      style={{
        writingMode: "vertical-rl",
        textOrientation: "mixed",
        fontFamily,
        fontSize,
        color,
        letterSpacing,
        lineHeight,
        opacity,
        fontStyle,
        padding: "20px 0",
        height: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════
   主页面
   ═══════════════════════════════════════════════════ */
type SlipState = "rolled" | "unfolding" | "unfolded";

const ZhongjiPage: React.FC = () => {
  const [slipState, setSlipState] = useState<SlipState>("rolled");
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [switching, setSwitching] = useState(false);
  const audioInitRef = useRef(false);

  // 动态加载 Ma Shan Zheng 书法字体
  useEffect(() => {
    const id = "ma-shan-zheng-font";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.href = "https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // 预热 AudioContext（用户首次交互后才能播放）
  const warmAudio = () => {
    if (audioInitRef.current) return;
    try {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      ctx.resume();
      ctx.close();
      audioInitRef.current = true;
    } catch {
      /* */
    }
  };

  // 点击展开
  const handleUnroll = () => {
    if (slipState !== "rolled") return;
    warmAudio();
    playUnrollSound();
    setSlipState("unfolding");
    setTimeout(() => setSlipState("unfolded"), 1400);
  };

  // 章节切换
  const handleChapterSwitch = (idx: number) => {
    if (idx === activeIdx || switching) return;
    setSwitching(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setTimeout(() => setSwitching(false), 400);
    }, 250);
  };

  const vol = VOLUMES[activeIdx];
  const isRolled = slipState === "rolled";
  const isUnfolded = slipState === "unfolded";

  /* 竹简宽度 */
  const slipWidth = isMobile ? "92vw" : 760;
  const slipHeight = isMobile ? 340 : 400;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `
          radial-gradient(ellipse at 50% 30%, rgba(109, 76, 65, 0.4) 0%, transparent 60%),
          linear-gradient(180deg, #5d4037 0%, #4e342e 50%, #3e2723 100%)
        `,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* 木纹噪点 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.12,
          backgroundImage: WOOD_NOISE,
          zIndex: 0,
        }}
      />

      {/* 科技蓝光点（右下角数字隐喻） */}
      <div
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#4A90E2",
          opacity: 0.3,
          boxShadow: "0 0 12px rgba(74, 144, 226, 0.4)",
          zIndex: 1,
          animation: "pulse 3s ease-in-out infinite",
        }}
      />
      <style>{`@keyframes pulse { 0%,100%{opacity:0.2} 50%{opacity:0.4} }`}</style>

      {/* 返回主站 */}
      <Link
        to="/"
        style={{
          position: "fixed",
          top: 24,
          left: 48,
          zIndex: 95,
          display: "flex",
          alignItems: "center",
          gap: 8,
          textDecoration: "none",
          fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif',
          fontSize: 13,
          color: "#c4a974",
          opacity: 0.7,
          transition: "all 0.3s ease",
          letterSpacing: "0.08em",
          padding: "6px 14px",
          border: "1px solid rgba(196, 169, 116, 0.2)",
          borderRadius: 4,
          background: "rgba(62, 39, 35, 0.4)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.background = "rgba(62, 39, 35, 0.7)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "0.7";
          e.currentTarget.style.background = "rgba(62, 39, 35, 0.4)";
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c4a974" strokeWidth="2" strokeLinecap="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        返回主站
      </Link>

      {/* ── 标题区 ── */}
      <header
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: isMobile ? "70px 24px 0" : "90px 80px 0",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: '"Noto Sans SC", sans-serif',
            fontSize: 11,
            letterSpacing: "0.4em",
            color: "#8d7b5a",
            margin: "0 0 20px",
            textTransform: "uppercase",
          }}
        >
          Digital Atelier · Vol.I
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          style={{
            fontFamily: '"Ma Shan Zheng", "Noto Serif SC", "Songti SC", Georgia, serif',
            fontSize: "clamp(2.2rem, 5.5vw, 3.5rem)",
            fontWeight: 400,
            color: "#dcc59a",
            margin: 0,
            letterSpacing: "0.1em",
            lineHeight: 1.2,
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          筑基 · 数字造物论
        </motion.h1>

        {/* 毛笔线 */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          style={{ display: "flex", justifyContent: "center", marginTop: 16, transformOrigin: "center" }}
        >
          {BRUSH_STROKE}
        </motion.div>

        {/* 副标题 — 当前卷次 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            style={{ marginTop: 20 }}
          >
            <p
              style={{
                fontFamily: '"Ma Shan Zheng", "Noto Serif SC", serif',
                fontSize: isMobile ? 18 : 22,
                color: "#c4a974",
                margin: 0,
                letterSpacing: "0.12em",
                opacity: isUnfolded ? 1 : 0.5,
                transition: "opacity 0.6s ease",
              }}
            >
              {vol.no} · {vol.chapter}篇
            </p>
          </motion.div>
        </AnimatePresence>
      </header>

      {/* ── 竹简主体 ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: isMobile ? "30px 0" : "40px 0",
        }}
      >
        {/* 竹简容器 */}
        <motion.div
          onClick={handleUnroll}
          initial={false}
          animate={{
            scaleX: isRolled ? 0.06 : 1,
            opacity: isRolled ? 0.85 : 1,
          }}
          transition={{
            duration: isRolled ? 0.3 : 1.2,
            ease: isRolled ? "easeOut" : [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            display: "flex",
            alignItems: "stretch",
            width: slipWidth,
            height: slipHeight,
            transformOrigin: "left center",
            cursor: isRolled ? "pointer" : "default",
            boxShadow: "0 10px 30px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {/* 左端帽 */}
          <ScrollCap side="left" />

          {/* 竹简内容区 */}
          <div
            style={{
              flex: 1,
              position: "relative",
              background: BAMBOO_TEXTURE,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "inset 0 0 20px rgba(62,39,35,0.08)",
            }}
          >
            {/* 卷起状态提示 */}
            <AnimatePresence>
              {isRolled && (
                <motion.div
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      border: "2px solid rgba(196,169,116,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 12,
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c4a974" strokeWidth="2" strokeLinecap="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </motion.div>
                  <p
                    style={{
                      fontFamily: '"Ma Shan Zheng", "Noto Serif SC", serif',
                      fontSize: 15,
                      color: "#8d6e63",
                      letterSpacing: "0.15em",
                      margin: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    点击展开竹简
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 展开后的竹简文字（逐句一片竹片） */}
            <AnimatePresence mode="wait">
              {!isRolled && (
                <motion.div
                  key={activeIdx + "-" + slipState}
                  initial={{ filter: "blur(8px)", opacity: 0 }}
                  animate={{
                    filter: switching ? "blur(4px)" : "blur(0px)",
                    opacity: switching ? 0.3 : 1,
                    x: switching ? -20 : 0,
                  }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{
                    duration: switching ? 0.3 : 0.8,
                    delay: slipState === "unfolding" ? 0.6 : 0,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "row-reverse",
                    alignItems: "stretch",
                    zIndex: 15,
                    overflow: "hidden",
                  }}
                >
                  {/* 卷号竹片（最右，书法大字） */}
                  <TextSlip width={isMobile ? 36 : 44} fontSize={isMobile ? 18 : 22} color="#5c3a21" fontFamily='"Ma Shan Zheng", serif' letterSpacing="0.12em" lineHeight={1.6}>
                    {vol.no}
                  </TextSlip>

                  {/* 章名竹片 */}
                  <TextSlip width={isMobile ? 34 : 42} fontSize={isMobile ? 20 : 26} color="#3e2723" fontFamily='"Ma Shan Zheng", serif' letterSpacing="0.12em" lineHeight={1.5}>
                    {vol.chapter}
                  </TextSlip>

                  {/* 标题竹片 */}
                  <TextSlip width={isMobile ? 32 : 38} fontSize={isMobile ? 14 : 16} color="#5d4037" opacity={0.7}>
                    {vol.title}
                  </TextSlip>

                  {/* 正文 — 逐句一片竹片 */}
                  {splitSentences(vol.quote).map((s, i) => (
                    <TextSlip
                      key={i}
                      width={isMobile ? 32 : 38}
                      fontSize={isMobile ? 14 : 16}
                      color="#3e2723"
                      letterSpacing="0.08em"
                      lineHeight={2.2}
                    >
                      {s}
                    </TextSlip>
                  ))}

                  {/* 批注竹片 */}
                  {vol.annotation && (
                    <TextSlip
                      width={isMobile ? 30 : 36}
                      fontSize={isMobile ? 12 : 13}
                      color="#7d6354"
                      opacity={0.6}
                      fontStyle="italic"
                      letterSpacing="0.06em"
                      lineHeight={1.8}
                    >
                      ——{vol.annotation}
                    </TextSlip>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 展开时光线扫过效果 */}
            {slipState === "unfolding" && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: "40%",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
                  pointerEvents: "none",
                  zIndex: 8,
                }}
              />
            )}

            {/* 竹简顶部微光（模拟上方光源） */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "30%",
                background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* 右端帽 */}
          <ScrollCap side="right" />
        </motion.div>

        {/* 展开后的章节按钮 */}
        <AnimatePresence>
          {isUnfolded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                display: "flex",
                gap: isMobile ? 8 : 14,
                marginTop: isMobile ? 28 : 36,
                flexWrap: "wrap",
                justifyContent: "center",
                maxWidth: isMobile ? "92vw" : 760,
              }}
            >
              {VOLUMES.map((v, i) => (
                <motion.button
                  key={v.chapter}
                  onClick={() => handleChapterSwitch(i)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: isMobile ? "8px 16px" : "10px 22px",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontFamily: '"Ma Shan Zheng", "Noto Serif SC", serif',
                    fontSize: isMobile ? 15 : 17,
                    letterSpacing: "0.1em",
                    transition: "all 0.4s ease",
                    background:
                      i === activeIdx
                        ? "linear-gradient(135deg, #c4a974 0%, #b8935e 100%)"
                        : "rgba(196,169,116,0.12)",
                    color: i === activeIdx ? "#3e2723" : "#a0907a",
                    boxShadow:
                      i === activeIdx
                        ? "0 4px 12px rgba(196,169,116,0.25), inset 0 1px 2px rgba(255,255,255,0.3)"
                        : "none",
                    opacity: switching ? 0.5 : 1,
                  }}
                >
                  {v.chapter}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 底部 ── */}
      <footer
        style={{
          position: "relative",
          zIndex: 2,
          padding: isMobile ? "16px 24px 24px" : "20px 80px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* 极细装饰线 */}
        <div
          style={{
            width: isMobile ? "50%" : 200,
            height: 1,
            background: "linear-gradient(90deg, transparent 0%, rgba(196,169,116,0.4) 30%, rgba(196,169,116,0.4) 70%, transparent 100%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontFamily: '"Noto Serif SC", serif',
              fontSize: 11,
              color: "#7d6354",
              letterSpacing: "0.15em",
            }}
          >
            小鹿 · 筑基卷
          </span>
          <span style={{ width: 1, height: 10, background: "rgba(196,169,116,0.2)" }} />
          <span
            style={{
              fontFamily: '"Noto Sans SC", sans-serif',
              fontSize: 10,
              color: "#6d5848",
              letterSpacing: "0.1em",
            }}
          >
            丙午年仲夏
          </span>
        </div>
      </footer>
    </div>
  );
};

export default ZhongjiPage;