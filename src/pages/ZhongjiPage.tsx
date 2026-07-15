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
      "曾以为代码只是冰冷的逻辑，后来才懂那是另一种语言。初见终端那漆黑屏幕时满心茫然，连一个分号的位置都纠结半日。后来渐渐入了门，竟着了迷，Debug 到天明也不觉疲倦。HTML 是骨架，撑起万物的形态；CSS 是皮相，赋予肌肤以光彩；JavaScript 是灵魂，让一切活过来动起来。每一个标签的嵌套，每一行样式的微调，每一次事件监听的绑定，都是通往产品世界的地基。不懂得技术的产品经理，如同不会画画的建筑师，终归纸上谈兵。",
    annotation: "入门如攀岩，越过高处方见风景",
    path: "/zhongji/v1",
  },
  {
    no: "卷二",
    chapter: "格物",
    title: "产品初构",
    subtitle: "Product Thinking",
    quote:
      "产品不是画出来的，是推演出来的。真正做过产品才知道，需求冲突是家常便饭——业务方要快，技术方要稳，用户要简单，老板还总想花哨。资源永远不够，排期永远紧张，用户反馈还时常互相矛盾。好的产品经理，要学会在混沌中找到秩序，在矛盾中找到平衡。需求文档不是功能的罗列，而是对人性的一种理解。从用户画像到用户旅程，每一步都是对「人」的深度思考。这一卷记录了从混沌需求中梳理脉络的历程。",
    annotation: "混沌不是无序，是尚未被理解的秩序",
    path: "/zhongji/v2",
  },
  {
    no: "卷三",
    chapter: "致知",
    title: "交互与界面",
    subtitle: "UI/UX Design",
    quote:
      "界面是产品的脸，交互是产品的举止。我不追求炫技，只追求「刚刚好」。留白不是浪费，而是呼吸——它给眼睛休息的空间，让真正重要的内容自然浮现。动效要有节制，过度的动画是噪音，恰如其分的过渡才是语言。色彩不只是视觉，更是情绪；排版不只是美观，更是阅读的引导。圆角不是妥协，而是温柔。每一个像素的对齐，每一帧动画的缓动，都是对用户感官的尊重。设计即沟通，做界面就是做一种无声的对话。",
    annotation: "好设计是隐形的",
    path: "/zhongji/v3",
  },
  {
    no: "卷四",
    chapter: "乘物",
    title: "AI 与工作流",
    subtitle: "AI Integration",
    quote:
      "AI 不是替代者，是副驾驶。这一卷记录了如何驯服大模型，让它成为思维的延伸。从编写第一条 Prompt 到构建完整的 RAG 管道，这是一场效率的革命。RAG 改变了知识管理的方式——再也不用在文档海洋中打捞，让向量索引替你记住一切。编写 Prompt 渐渐成了日常习惯，像早晨泡咖啡一样自然。但我也清醒地认识到 AI 的局限：它会一本正经地胡说八道，它不理解语境中的弦外之音。Prompt 工程是心法，Chain of Thought 是路径，当你学会与 AI 协作，创造力终归留给了你自己。",
    annotation: "驯服工具，而非被工具驯服",
    path: "/zhongji/v4",
  },
  {
    no: "卷五",
    chapter: "躬行",
    title: "项目深析",
    subtitle: "Project Retrospective",
    quote:
      "每一个成功的项目背后，都有十个失败的尝试。这里记录的不只是光鲜成果，更是被推翻的方案和深夜的反思。代码重构是勇气的体现，需求变更是常态的应对，上线延期是现实的妥协。真正的项目经验不只在于技术，更在于软技能——跨团队协作需要同理心，向上汇报要把复杂说简单，需求优先级排序则需要得罪人的勇气。带团队后才发现最难的不是管事，是管人心。失败是最好的老师，但前提是你真的复盘了。",
    annotation: "复盘是最高效的学习方式",
    path: "/zhongji/v5",
  },
  {
    no: "卷六",
    chapter: "问心",
    title: "成长与反思",
    subtitle: "Growth Mindset",
    quote:
      "技术的浪潮奔涌不息，唯有保持空杯心态方能不被淘汰。AI 时代的 PM，角色正从功能定义者变为体验编排者。学了那么多技术，最终发现最难的不是写代码，而是知道自己为什么要写。做产品的意义不在于功能多少，而在于是否真的帮助了一个人。在效率与温度之间，我选择温度。在完美与完成之间，我选择完成。长期主义不是口号，是内心的一种平静。这一卷是我与自己的对话，关于成长，关于如何安身立命。",
    annotation: "长期主义是一种选择",
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
const ScrollCap: React.FC<{ side: "top" | "bottom" }> = ({ side }) => (
  <div
    style={{
      position: "relative",
      width: "100%",
      height: 28,
      flexShrink: 0,
      background:
        side === "top"
          ? "linear-gradient(180deg, #2e1810 0%, #4e342e 40%, #5d4037 70%, #4e342e 100%)"
          : "linear-gradient(0deg, #2e1810 0%, #4e342e 40%, #5d4037 70%, #4e342e 100%)",
      borderRadius: side === "top" ? "14px 14px 4px 4px" : "4px 4px 14px 14px",
      boxShadow: `
        ${side === "top" ? "0 2px 8px rgba(0,0,0,0.25)" : "0 -2px 8px rgba(0,0,0,0.25)"}
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
        width: "70%",
        height: 6,
        borderRadius: 3,
        background:
          "linear-gradient(90deg, #8d6e63 0%, #6d4c41 30%, #4e342e 60%, #6d4c41 100%)",
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
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  opacity?: number;
  fontStyle?: string;
  letterSpacing?: string;
  lineHeight?: number;
  align?: "left" | "center";
  padY?: number;
}> = ({
  children,
  fontSize = 15,
  color = "#3e2723",
  fontFamily = "'Ma Shan Zheng', 'ZCOOL XiaoWei', 'Noto Serif SC', serif",
  opacity = 1,
  fontStyle,
  letterSpacing = "0.06em",
  lineHeight = 1.9,
  align = "left",
  padY = 12,
}) => (
  <div
    style={{
      width: "100%",
      flexShrink: 0,
      position: "relative",
      background: "rgba(220, 197, 154, 0.92)",
      borderBottom: "1px solid rgba(101, 80, 50, 0.22)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        fontFamily,
        fontSize,
        color,
        letterSpacing,
        lineHeight,
        opacity,
        fontStyle,
        padding: `${padY}px 24px`,
        boxSizing: "border-box",
        wordBreak: "keep-all",
        textAlign: align,
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
    const id2 = "zcool-xiaowei-font";
    if (!document.getElementById(id2)) {
      const link2 = document.createElement("link");
      link2.id = id2;
      link2.href = "https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&display=swap";
      link2.rel = "stylesheet";
      document.head.appendChild(link2);
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

  /* 竹简尺寸 */
  const slipWidth = isMobile ? "92vw" : 560;
  const slipMaxHeight = isMobile ? "70vh" : 600;

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
            scaleY: isRolled ? 0.12 : 1,
            opacity: isRolled ? 0.85 : 1,
          }}
          transition={{
            duration: isRolled ? 0.3 : 1.2,
            ease: isRolled ? "easeOut" : [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            width: slipWidth,
            minHeight: isRolled ? 100 : slipMaxHeight,
            maxHeight: isRolled ? 140 : slipMaxHeight,
            transformOrigin: "center top",
            cursor: isRolled ? "pointer" : "default",
            boxShadow: "0 10px 30px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {/* 上端帽 */}
          <ScrollCap side="top" />

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
            {/* 左绑绳 */}
            <div style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 18,
              width: 6,
              background: "linear-gradient(90deg, #5d4037 0%, #3e2723 40%, #2e1810 60%, #3e2723 100%)",
              boxShadow: "1px 0 3px rgba(0,0,0,0.3), inset 1px 0 1px rgba(255,255,255,0.08)",
              zIndex: 20,
              opacity: 0.85,
            }} />
            {/* 右绑绳 */}
            <div style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 18,
              width: 6,
              background: "linear-gradient(90deg, #3e2723 0%, #2e1810 40%, #3e2723 60%, #5d4037 100%)",
              boxShadow: "-1px 0 3px rgba(0,0,0,0.3), inset -1px 0 1px rgba(255,255,255,0.08)",
              zIndex: 20,
              opacity: 0.85,
            }} />

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
                      <path d="M12 5v14M6 13l6 6 6-6" />
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
                    flexDirection: "column",
                    alignItems: "stretch",
                    zIndex: 25,
                    overflow: "auto",
                  }}
                >
                  {/* 卷号竹片（顶部，书法大字） */}
                  <TextSlip fontSize={isMobile ? 20 : 24} color="#4a2c1a" fontFamily="'Ma Shan Zheng', 'ZCOOL XiaoWei', 'Noto Serif SC', serif" letterSpacing="0.12em" lineHeight={1.6} align="center" padY={16}>
                    {vol.no}
                  </TextSlip>

                  {/* 章名竹片 */}
                  <TextSlip fontSize={isMobile ? 22 : 28} color="#3e2723" fontFamily="'Ma Shan Zheng', 'ZCOOL XiaoWei', 'Noto Serif SC', serif" letterSpacing="0.12em" lineHeight={1.5} align="center" padY={14}>
                    {vol.chapter}
                  </TextSlip>

                  {/* 标题竹片 */}
                  <TextSlip fontSize={isMobile ? 13 : 15} color="#5d4037" opacity={0.7} align="center" padY={8}>
                    {vol.title}
                  </TextSlip>

                  {/* 正文 — 逐句一片竹片 */}
                  {splitSentences(vol.quote).map((s, i) => (
                    <TextSlip
                      key={i}
                      fontSize={isMobile ? 14 : 16}
                      color="#3e2723"
                      letterSpacing="0.06em"
                      lineHeight={1.9}
                    >
                      {s}
                    </TextSlip>
                  ))}

                  {/* 批注竹片 */}
                  {vol.annotation && (
                    <TextSlip
                      fontSize={isMobile ? 12 : 13}
                      color="#7d6354"
                      opacity={0.6}
                      fontStyle="italic"
                      letterSpacing="0.04em"
                      lineHeight={1.7}
                      align="center"
                      padY={10}
                    >
                      —— {vol.annotation}
                    </TextSlip>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 展开时光线扫过效果 */}
            {slipState === "unfolding" && (
              <motion.div
                initial={{ y: "-100%" }}
                animate={{ y: "100%" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: "40%",
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
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

          {/* 下端帽 */}
          <ScrollCap side="bottom" />
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