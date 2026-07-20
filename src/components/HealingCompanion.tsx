import { useState, useEffect, useRef, useCallback } from "react";

/**
 * HealingCompanion — 疗愈师「小愈」
 *
 * 纯 SVG 角色浮于疗愈室右下角，具备：
 * - 5 种情绪识别（焦虑/疲惫/低落/平淡/平静）+ 关键词匹配话术库
 * - 页面加载 3s 主动问候气泡
 * - 悬停放大上浮，点击展开聊天面板
 * - 快捷情绪按钮、打字指示器、说话口型动画
 * - 长时间不交互每 15s 概率主动关怀
 * - 第 2 轮对话自动追加工具推荐
 * - 零第三方依赖（仅 React + 内联 SVG/CSS）
 */

/* ──────────────────────────────
   话术库
   ────────────────────────────── */

type EmotionKey = "anxiety" | "exhausted" | "low" | "neutral" | "calm";

interface EmotionRule {
  key: EmotionKey;
  label: string;
  keywords: string[];
  responses: string[];
  followUps: string[];
  toolSuggestion: string;
}

const EMOTIONS: EmotionRule[] = [
  {
    key: "anxiety",
    label: "焦虑",
    keywords: ["焦虑", "紧张", "担心", "害怕", "恐慌", "不安", "心慌", "烦躁", "压力", "崩溃", "受不了", "快疯了", "着急", "慌"],
    responses: [
      "我听到你了。焦虑的感觉很难受，但请相信，它就像海浪，会来的，也会退去的。",
      "你现在一定很辛苦吧。试着把手放在胸口，感受心跳——它比你想象中更稳定。",
      "焦虑的时候，身体会以为我们遇到了危险。但实际上，你此刻是安全的。我会陪着你。",
    ],
    followUps: ["能告诉我，是什么让你感到不安吗？", "这种感觉持续多久了？", "有没有什么能让你暂时放松下来的事？"],
    toolSuggestion: "要不要试试呼吸引导？4-7-8 呼吸法对缓解焦虑特别有效。",
  },
  {
    key: "exhausted",
    label: "疲惫",
    keywords: ["累", "疲惫", "困", "没力气", "撑不住", "透支", "耗尽", "精疲力尽", "倦", "无力", "好累", "太累了", "加班", "熬夜", "没睡"],
    responses: [
      "你一定撑了很久吧。能走到今天，已经很了不起了。",
      "身体在提醒你需要休息了。这不是偷懒，是自我保护。",
      "疲惫的时候，允许自己什么都不做。你不需要时刻保持完美。",
    ],
    followUps: ["今天最让你消耗精力的事情是什么？", "有没有哪怕一分钟，是完全属于自己的？", "今晚能早些休息吗？"],
    toolSuggestion: "冥想空间里有 1 分钟的短冥想，适合睡前放松一下。",
  },
  {
    key: "low",
    label: "低落",
    keywords: ["难过", "伤心", "哭", "失落", "失望", "痛", "孤独", "寂寞", "无助", "绝望", "抑郁", "伤心", "不开心", "不想", "没意思", "无聊", "没劲"],
    responses: [
      "我能感受到你心里下着雨。没关系的，我在这里，陪你等雨停。",
      "低落的时候，不需要强迫自己开心。允许自己难过，本身就是一种力量。",
      "你愿意把这些写下来告诉我，已经很勇敢了。你不需要独自承受。",
    ],
    followUps: ["有什么特别让你难过的事吗？还是说不清的无力感？", "你有多久没有好好照顾自己了？", "如果此刻能给过去的自己一个拥抱，你想说什么？"],
    toolSuggestion: "写下来也是一种疗愈。试试感恩日记，把心里的东西倒出来。",
  },
  {
    key: "neutral",
    label: "平淡",
    keywords: ["还好", "一般", "凑合", "就这样", "没什么", "不知道", "麻木", "没感觉", "normal", "哦", "嗯"],
    responses: [
      "平淡也是一种状态，不需要每天都轰轰烈烈。你在用自己的节奏生活。",
      "今天虽然没什么特别的事，但你来了这里——说明你心里还有想要照顾自己的意愿。",
      "有些日子就是用来'没什么'的。这不代表生活没有意义。",
    ],
    followUps: ["今天有没有什么哪怕很小的、让你觉得还不错的事？", "如果可以选一种颜色形容今天，你会选什么？", "想试试呼吸或冥想吗？也许能让今天多一点点不一样。"],
    toolSuggestion: "试试呼吸引导中的'能量补充'模式，也许能帮你找回一点活力。",
  },
  {
    key: "calm",
    label: "平静",
    keywords: ["平静", "安静", "放松", "开心", "幸福", "感恩", "满足", "舒服", "好", "不错", "挺好的", "喜欢", "爱", "温暖", "美好", "期待", "希望"],
    responses: [
      "能感受到你此刻的平静，真好。这份安宁是你自己创造的，值得被珍惜。",
      "你现在的状态很棒。记住这种感觉，它会在你不那么好的日子里，成为你的力量。",
      "好开心看到你这么放松。你值得拥有这样的时刻。",
    ],
    followUps: ["是什么让你感到这么平静的呢？", "有没有想把它记录下来，以后翻看时提醒自己？", "你的平静能感染周围的人，包括我。",
    ],
    toolSuggestion: "平静的时候特别适合写感恩日记，把这份美好存下来。",
  },
];

const GREETINGS = [
  "你好呀，我是小愈。今天想聊些什么呢？",
  "欢迎来到疗愈室。不管今天过得怎么样，我都陪着你。",
  "你来了。先深呼吸一下，然后慢慢说。",
  "今天的你，辛苦了。在这里可以放下所有防备。",
];

const IDLE_BUBBLES = [
  "在发呆也很好哦，不需要时刻保持忙碌。",
  "想说话就说话，不想说也没关系，我就在这里。",
  "今天过得怎么样？",
  "如果累了就休息一下吧，不用勉强自己。",
  "有什么想倾诉的吗？我一直在。",
];

/* ──────────────────────────────
   情绪分析
   ────────────────────────────── */

function detectEmotion(text: string): EmotionRule | null {
  const lower = text.toLowerCase();
  for (const emo of EMOTIONS) {
    if (emo.keywords.some((kw) => lower.includes(kw))) return emo;
  }
  return null;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ──────────────────────────────
   组件
   ────────────────────────────── */

interface Message {
  id: string;
  role: "user" | "companion";
  text: string;
  timestamp: number;
}

const HealingCompanion: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [expression, setExpression] = useState<"smile" | "concern" | "think">("smile");
  const [hovered, setHovered] = useState(false);
  const [turnCount, setTurnCount] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastInteractionRef = useRef(Date.now());

  // 滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 页面加载 3s 主动问候
  useEffect(() => {
    const t = setTimeout(() => {
      setBubbleText(pickRandom(GREETINGS));
      setShowBubble(true);
      setExpression("smile");
      // 4s 后隐藏
      setTimeout(() => setShowBubble(false), 4500);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  // 主动关怀（15s 检查）
  useEffect(() => {
    if (chatOpen) return; // 聊天面板打开时不弹出
    idleTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - lastInteractionRef.current;
      if (elapsed > 15000 && !showBubble && !chatOpen) {
        if (Math.random() > 0.6) {
          setBubbleText(pickRandom(IDLE_BUBBLES));
          setShowBubble(true);
          lastInteractionRef.current = Date.now();
          setTimeout(() => setShowBubble(false), 5000);
        }
        lastInteractionRef.current = Date.now();
      }
    }, 15000);
    return () => {
      if (idleTimerRef.current) clearInterval(idleTimerRef.current);
    };
  }, [chatOpen, showBubble]);

  // 添加消息 + 模拟打字
  const addCompanionMessage = useCallback((text: string, delay = 800) => {
    setIsTyping(true);
    setExpression("think");
    const typingDuration = Math.min(text.length * 80 + 400, 2000);
    setTimeout(() => {
      setIsTyping(false);
      setExpression("smile");
      setIsSpeaking(true);
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}`, role: "companion", text, timestamp: Date.now() },
      ]);
      // 说话动画 1.5s 后停止
      setTimeout(() => setIsSpeaking(false), 1500);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, delay + typingDuration);
  }, []);

  // 发送消息
  const handleSend = useCallback(
    (text?: string) => {
      const msg = (text || inputValue).trim();
      if (!msg) return;
      setInputValue("");
      lastInteractionRef.current = Date.now();
      setTurnCount((t) => t + 1);

      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}`, role: "user", text: msg, timestamp: Date.now() },
      ]);

      // 情绪识别
      const emotion = detectEmotion(msg);

      setTimeout(() => {
        if (emotion) {
          setExpression("concern");
          const response = pickRandom(emotion.responses);
          addCompanionMessage(response);

          // 第 2 轮追加工具推荐
          if (turnCount >= 1) {
            setTimeout(() => {
              addCompanionMessage(emotion.toolSuggestion, 600);
            }, 2500);
          }
          // 偶发追问
          if (Math.random() > 0.4) {
            setTimeout(() => {
              setExpression("think");
              addCompanionMessage(pickRandom(emotion.followUps), 800);
            }, turnCount >= 1 ? 5000 : 3500);
          }
        } else {
          // 无法识别情绪时的通用回复
          const generic = [
            "嗯，我在听。能再多说一些吗？",
            "谢谢你愿意告诉我这些。你今天过得怎么样？",
            "我感受到了你的心声。如果累了，可以试试左侧的呼吸引导或冥想。",
            "每个人都需要一个倾听者。我在这里，不急，慢慢说。",
          ];
          addCompanionMessage(pickRandom(generic));
        }
      }, 300);
    },
    [inputValue, turnCount, addCompanionMessage]
  );

  // 快捷情绪按钮
  const handleQuickEmotion = useCallback(
    (emo: EmotionRule) => {
      handleSend(emo.label);
    },
    [handleSend]
  );

  // 点击角色 → 展开聊天 + 欢迎语
  const handleCharacterClick = useCallback(() => {
    setChatOpen((v) => {
      if (!v && messages.length === 0) {
        // 首次打开，发送欢迎语
        setTimeout(() => {
          addCompanionMessage(pickRandom(GREETINGS), 300);
        }, 200);
      }
      return !v;
    });
    setShowBubble(false);
    lastInteractionRef.current = Date.now();
  }, [messages.length, addCompanionMessage]);

  /* ─── SVG 角色 ─── */

  const CharacterSVG = () => (
    <svg viewBox="0 0 120 180" className="hc-character" aria-hidden="true">
      {/* 背后光晕 */}
      <ellipse cx="60" cy="100" rx="52" ry="70" className="hc-aura" />

      {/* 身体/长袍 */}
      <path
        d="M60 82 C38 88 22 110 20 148 C20 160 30 170 60 170 C90 170 100 160 100 148 C98 110 82 88 60 82Z"
        className="hc-robe"
      />
      {/* 袍上叶脉纹理 */}
      <path d="M52 95 C54 108 55 120 53 135" className="hc-vein" opacity="0.25" />
      <path d="M68 95 C66 108 65 120 67 135" className="hc-vein" opacity="0.25" />
      <path d="M60 90 L58 100 M60 90 L62 100 M60 100 L56 112 M60 100 L64 112" className="hc-vein" opacity="0.15" />

      {/* 脖子 */}
      <rect x="55" y="72" width="10" height="12" rx="5" className="hc-skin" />

      {/* 头发后层（马尾） */}
      <path d="M40 42 C38 55 36 68 42 78 L48 72 C44 62 44 50 46 42Z" className="hc-hair" />
      <path d="M80 42 C82 55 84 68 78 78 L72 72 C76 62 76 50 74 42Z" className="hc-hair" />
      {/* 马尾辫 */}
      <path
        d="M72 40 C78 38 84 42 86 52 C88 62 86 72 82 80 C80 74 76 64 74 54 C72 48 72 42 72 40Z"
        className="hc-hair"
      />
      {/* 马尾扎绳 */}
      <circle cx="74" cy="42" r="2.5" className="hc-hairband" />

      {/* 头 */}
      <ellipse cx="60" cy="48" rx="20" ry="22" className="hc-skin" />

      {/* 头发前层（刘海） */}
      <path
        d="M40 42 C42 30 50 24 60 24 C70 24 78 30 80 42 C78 36 72 30 60 30 C48 30 42 36 40 42Z"
        className="hc-hair"
      />
      {/* 刘海细节 */}
      <path d="M44 40 C46 34 52 30 58 30" className="hc-hair" opacity="0.6" />
      <path d="M76 40 C74 34 68 30 62 30" className="hc-hair" opacity="0.6" />

      {/* 腮红 */}
      <ellipse cx="44" cy="55" rx="6" ry="3.5" className="hc-blush" />
      <ellipse cx="76" cy="55" rx="6" ry="3.5" className="hc-blush" />

      {/* 眼睛 */}
      <g className="hc-eyes">
        {expression === "think" ? (
          <>
            {/* 歪头思考：右眼微眯 */}
            <ellipse cx="52" cy="50" rx="2.5" ry="3" fill="#3E3028" />
            <path d="M72 48 Q74 50 72 52" stroke="#3E3028" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        ) : expression === "concern" ? (
          <>
            {/* 关心：眉毛微蹙 */}
            <ellipse cx="52" cy="50" rx="2.5" ry="3" fill="#3E3028" />
            <ellipse cx="68" cy="50" rx="2.5" ry="3" fill="#3E3028" />
            <path d="M47 43 Q52 41 57 43" stroke="#3E3028" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M63 43 Q68 41 73 43" stroke="#3E3028" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* 微笑：正常弯眉 */}
            <ellipse cx="52" cy="50" rx="2.5" ry="3" fill="#3E3028" />
            <ellipse cx="68" cy="50" rx="2.5" ry="3" fill="#3E3028" />
            <path d="M47 44 Q52 42 57 44" stroke="#3E3028" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M63 44 Q68 42 73 44" stroke="#3E3028" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </>
        )}
      </g>

      {/* 嘴巴 */}
      <path
        d={
          isSpeaking
            ? "M55 60 Q60 64 65 60" // 说话：张开
            : expression === "concern"
              ? "M55 61 Q60 59 65 61" // 关心：微抿
              : "M55 59 Q60 63 65 59" // 微笑
        }
        className="hc-mouth"
        fill="none"
        strokeLinecap="round"
      />

      {/* 手中持花 */}
      <g className="hc-flower">
        <line x1="82" y1="120" x2="88" y2="100" stroke="#6B9B7B" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="88" cy="97" r="5" className="hc-flower-petal" opacity="0.8" />
        <circle cx="88" cy="97" r="2" fill="#F4D88A" />
        {/* 小叶子 */}
        <path d="M85 106 Q82 102 84 98" stroke="#6B9B7B" strokeWidth="1" fill="none" />
      </g>

      {/* 叶形吊坠项链 */}
      <g className="hc-necklace">
        <path d="M48 78 Q54 85 60 86 Q66 85 72 78" fill="none" stroke="#A5C4A0" strokeWidth="0.8" />
        <path d="M58 85 L60 92 L62 85Z" fill="#A5C4A0" />
      </g>
    </svg>
  );

  return (
    <>
      {/* 角色浮标 */}
      <div
        className={`hc-float ${hovered ? "hc-float-hover" : ""}`}
        onMouseEnter={() => { setHovered(true); lastInteractionRef.current = Date.now(); }}
        onMouseLeave={() => setHovered(false)}
        onClick={handleCharacterClick}
      >
        {/* 对话气泡 */}
        <AnimatePresence>
          {showBubble && !chatOpen && (
            <motion.div
              className="hc-bubble"
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.35 }}
            >
              {bubbleText}
              <div className="hc-bubble-arrow" />
            </motion.div>
          )}
        </AnimatePresence>

        <CharacterSVG />
        <span className="hc-name">小愈</span>
      </div>

      {/* 聊天面板 */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            className="hc-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* 面板头 */}
            <div className="hc-panel-header">
              <div className="hc-panel-title">
                <span className="hc-panel-dot" />
                小愈 · 疗愈师
              </div>
              <button className="hc-panel-close" onClick={() => setChatOpen(false)} aria-label="关闭">
                ×
              </button>
            </div>

            {/* 消息列表 */}
            <div className="hc-messages">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`hc-msg hc-msg-${msg.role}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <p>{msg.text}</p>
                </motion.div>
              ))}
              {/* 打字指示器 */}
              {isTyping && (
                <div className="hc-msg hc-msg-companion">
                  <div className="hc-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* 快捷情绪按钮 */}
            {messages.length === 0 && (
              <div className="hc-quick-bar">
                {EMOTIONS.map((emo) => (
                  <button
                    key={emo.key}
                    className="hc-quick-btn"
                    onClick={() => handleQuickEmotion(emo)}
                  >
                    {emo.label}
                  </button>
                ))}
              </div>
            )}

            {/* 输入栏 */}
            <div className="hc-input-bar">
              <input
                className="hc-input"
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); lastInteractionRef.current = Date.now(); }}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="说说你现在的感受…"
              />
              <button
                className="hc-send-btn"
                onClick={() => handleSend()}
                disabled={!inputValue.trim()}
                aria-label="发送"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" />
                </svg>
              </button>
            </div>

            {/* 安全提示 */}
            <p className="hc-disclaimer">我是你的 AI 伙伴，不是医生。如果长期情绪低落，建议找专业咨询师。</p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* ===== 角色浮标 ===== */
        .hc-float {
          position: fixed;
          right: 28px;
          bottom: 28px;
          z-index: 80;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          -webkit-tap-highlight-color: transparent;
        }
        .hc-float-hover {
          transform: translateY(-6px) scale(1.06);
        }
        .hc-float:active {
          transform: scale(0.96);
          transition-duration: 0.1s;
        }
        .hc-character {
          width: 72px;
          height: auto;
          filter: drop-shadow(0 4px 12px rgba(46, 64, 55, 0.18));
          transition: filter 0.3s;
        }
        .hc-float-hover .hc-character {
          filter: drop-shadow(0 8px 20px rgba(46, 64, 55, 0.25));
        }
        .hc-name {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 11px;
          color: var(--text-soft);
          opacity: 0.6;
          letter-spacing: 0.1em;
        }

        /* SVG 样式 */
        .hc-aura {
          fill: rgba(122, 154, 130, 0.12);
          animation: hcAuraPulse 3s ease-in-out infinite;
        }
        @keyframes hcAuraPulse {
          0%, 100% { opacity: 0.6; rx: 52; ry: 70; }
          50% { opacity: 1; rx: 55; ry: 73; }
        }
        .hc-robe {
          fill: url(#hcRobeGrad);
          stroke: rgba(107, 155, 123, 0.3);
          strokeWidth: 0.5;
        }
        .hc-vein {
          stroke: rgba(107, 155, 123, 0.5);
          stroke-width: 0.6;
          fill: none;
        }
        .hc-skin {
          fill: #FDDCB5;
        }
        .hc-hair {
          fill: #4A3728;
        }
        .hc-hairband {
          fill: #A5C4A0;
        }
        .hc-blush {
          fill: rgba(240, 140, 130, 0.35);
        }
        .hc-mouth {
          stroke: #8B6B5A;
          strokeWidth: 1.3;
        }
        .hc-flower-petal {
          fill: #F4A6B8;
        }
        .hc-necklace {
          opacity: 0.7;
        }

        /* 说话时身体微晃 */
        ${isSpeaking ? `
        .hc-character {
          animation: hcSway 0.4s ease-in-out infinite alternate;
        }
        @keyframes hcSway {
          from { transform: rotate(-1deg); }
          to { transform: rotate(1deg); }
        }
        ` : ""}

        /* ===== 对话气泡 ===== */
        .hc-bubble {
          position: absolute;
          bottom: calc(100% + 8px);
          right: 0;
          min-width: 160px;
          max-width: 220px;
          padding: 10px 14px;
          background: var(--card-bg, #fff);
          border: 1px solid rgba(122, 154, 130, 0.2);
          border-radius: 12px 12px 4px 12px;
          box-shadow: 0 4px 16px -4px rgba(0, 0, 0, 0.1);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 12.5px;
          line-height: 1.7;
          color: var(--text);
          white-space: normal;
          pointer-events: none;
        }
        .hc-bubble-arrow {
          position: absolute;
          bottom: -5px;
          right: 16px;
          width: 10px;
          height: 10px;
          background: var(--card-bg, #fff);
          border-right: 1px solid rgba(122, 154, 130, 0.2);
          border-bottom: 1px solid rgba(122, 154, 130, 0.2);
          transform: rotate(45deg);
        }

        /* ===== 聊天面板 ===== */
        .hc-panel {
          position: fixed;
          right: 20px;
          bottom: 110px;
          width: 340px;
          max-height: 480px;
          z-index: 90;
          background: var(--card-bg, #fff);
          border: 1px solid var(--border, rgba(0,0,0,0.08));
          border-radius: 16px;
          box-shadow: 0 12px 48px -12px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .hc-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border, rgba(0,0,0,0.06));
        }
        .hc-panel-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
        }
        .hc-panel-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.8;
        }
        .hc-panel-close {
          width: 28px;
          height: 28px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: var(--text-soft);
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .hc-panel-close:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        /* 消息列表 */
        .hc-messages {
          flex: 1;
          overflow-y: auto;
          padding: 14px 14px 8px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 160px;
          max-height: 300px;
        }
        .hc-msg {
          max-width: 85%;
          padding: 9px 13px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.7;
        }
        .hc-msg p {
          margin: 0;
        }
        .hc-msg-companion {
          align-self: flex-start;
          background: rgba(122, 154, 130, 0.08);
          color: var(--text);
          border: 1px solid rgba(122, 154, 130, 0.12);
          border-radius: 12px 12px 12px 4px;
        }
        .hc-msg-user {
          align-self: flex-end;
          background: rgba(122, 154, 130, 0.18);
          color: var(--text);
          border-radius: 12px 12px 4px 12px;
        }

        /* 打字指示器 */
        .hc-typing {
          display: flex;
          gap: 4px;
          padding: 4px 0;
        }
        .hc-typing span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.4;
          animation: hcTypingDot 1.2s ease-in-out infinite;
        }
        .hc-typing span:nth-child(2) { animation-delay: 0.2s; }
        .hc-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes hcTypingDot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 0.9; transform: translateY(-3px); }
        }

        /* 快捷按钮 */
        .hc-quick-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 0 14px 10px;
        }
        .hc-quick-btn {
          padding: 5px 12px;
          font-size: 12px;
          font-family: inherit;
          border: 1px solid rgba(122, 154, 130, 0.25);
          border-radius: 999px;
          background: transparent;
          color: var(--accent);
          cursor: pointer;
          transition: all 0.2s;
        }
        .hc-quick-btn:hover {
          background: rgba(122, 154, 130, 0.1);
          border-color: var(--accent);
        }

        /* 输入栏 */
        .hc-input-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-top: 1px solid var(--border, rgba(0,0,0,0.06));
        }
        .hc-input {
          flex: 1;
          padding: 8px 12px;
          font-size: 13px;
          font-family: inherit;
          border: 1px solid var(--border, rgba(0,0,0,0.08));
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.02);
          color: var(--text);
          outline: none;
          transition: border-color 0.2s;
        }
        .hc-input:focus {
          border-color: var(--accent);
        }
        .hc-input::placeholder {
          color: var(--text-soft);
          opacity: 0.5;
        }
        .hc-send-btn {
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 50%;
          background: var(--accent);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: opacity 0.2s, transform 0.2s;
        }
        .hc-send-btn:disabled {
          opacity: 0.35;
          cursor: default;
        }
        .hc-send-btn:not(:disabled):hover {
          transform: scale(1.06);
        }

        /* 安全提示 */
        .hc-disclaimer {
          font-size: 9.5px;
          color: var(--text-soft);
          opacity: 0.4;
          text-align: center;
          padding: 6px 14px 10px;
          margin: 0;
          line-height: 1.4;
        }

        /* 响应式 */
        @media (max-width: 768px) {
          .hc-float {
            right: 16px;
            bottom: 20px;
          }
          .hc-character {
            width: 56px;
          }
          .hc-panel {
            right: 8px;
            left: 8px;
            bottom: 90px;
            width: auto;
            max-height: 55vh;
          }
        }
      `}</style>

      {/* SVG 渐变定义（隐藏） */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="hcRobeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8BB89A" />
            <stop offset="100%" stopColor="#5E8A6E" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
};

export default HealingCompanion;