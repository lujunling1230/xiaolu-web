import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * 解忧杂货铺 · The Advice Shop
 *
 * 治愈系问答空间 —— 像朋友写信一样回应你的疑惑。
 * 信纸界面，输入问题后"回信"从下方缓缓升起。
 * 接入 AI（OpenAI 兼容模式 / 阿里云百炼 DeepSeek），流式打字机效果。
 */

/* ===== 角色映射 ===== */
/* ===== 角色信息（仅 UI 展示用，system prompt 在 handleSubmit 内硬编码） ===== */
const ROLES: Record<TagKey, { name: string; emoji: string }> = {
  脑洞: { name: "小波", emoji: "🎲" },
  心灵: { name: "浪矢爷爷", emoji: "💌" },
  工作: { name: "敦也", emoji: "💼" },
  情感: { name: "晴美", emoji: "🌸" },
};

/* ===== 分类标签 ===== */
const TAGS = [
  { key: "心灵" as TagKey, emoji: "🌿", label: "心灵" },
  { key: "脑洞" as TagKey, emoji: "🧠", label: "脑洞" },
  { key: "工作" as TagKey, emoji: "💼", label: "工作" },
  { key: "情感" as TagKey, emoji: "❤️", label: "情感" },
];

type TagKey = "心灵" | "脑洞" | "工作" | "情感";
const REPLIES: Record<TagKey, string[]> = {
  心灵: [
    "你不需要时时刻刻都坚强。允许自己偶尔脆弱，那才是完整的你。",
    "现在的迷茫，只是因为你正在生长。树在扎根时，地面上是看不出变化的。",
    "你已经在很努力地生活了，这份努力本身，就值得被肯定。",
    "累的时候，就停下来抱抱自己。你不是机器，你是会呼吸的生命。",
  ],
  脑洞: [
    "那些天马行空的想法，不是胡思乱想，是你独特的感知世界的方式。",
    "脑洞大的人，往往看见了别人看不见的可能性。别收起你的好奇心。",
    "如果全世界都很正常，那该多无聊。谢谢你的不一样。",
  ],
  工作: [
    "努力了没有结果，不代表努力没有意义。它只是换了一种方式，存在你身上。",
    "你可以慢一点。马拉松不是冲刺，找到自己的节奏比追上别人更重要。",
    "先完成，再完美。你已经迈出了最难的第一步——开始。",
    "工作的意义不是证明自己，而是照顾自己。别本末倒置了。",
  ],
  情感: [
    "被理解是幸运，不被理解是常态。但请相信，总有人愿意倾听你。",
    "你值得被温柔对待。如果暂时还没遇到，请先温柔地对待自己。",
    "关系的尽头不是失败，是你们互相教会了彼此一些东西，然后各自上路。",
    "想念一个人的时候，不必压抑。情绪需要出口，而不是锁。",
  ],
};

/* 通用兜底回复 */
const FALLBACKS = [
  "谢谢你愿意把心里的疑惑写下来。能说出来，本身就是一种勇敢。",
  "我没办法给你标准答案，但我想告诉你：你的感受是真实的，是合理的。",
  "慢慢来，答案不是想出来的，是走着走着，自己浮现的。",
];

/** 根据输入文本与分类生成回信 */
function generateReply(question: string, tag: TagKey | null): string {
  const pool = tag ? REPLIES[tag] : FALLBACKS;
  // 用问题长度做简单哈希，让同一句话得到稳定的回复
  const seed = question.length + (tag ? tag.charCodeAt(0) : 0);
  return pool[seed % pool.length];
}

/* ===== 中文标签 ↔ 英文 key 映射 ===== */
const EN_TO_TAG: Record<string, TagKey> = { brain: "脑洞", heart: "心灵", work: "工作", emotion: "情感" };
const ROLE_NAMES: Record<string, string> = { brain: "小波", heart: "浪矢爷爷", work: "敦也", emotion: "晴美" };

/* ===== 组件 ===== */
const AdvicePage: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [activeTag, setActiveTag] = useState<TagKey | null>(null);
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [autoDetectedRole, setAutoDetectedRole] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = async () => {
    if (!question.trim()) return;

    // 取消上一次未完成的请求
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // 1. 定义四个角色的"死命令"（硬编码，不容商量）
    const ROLE_PROMPTS: Record<string, string> = {
      brain: `你是解忧杂货铺的掌柜小波。性格温和克制，带有东野圭吾式的沉默感。你从不说教，不替用户做决定，只通过回信帮助用户看清内心。语言简短有留白，偶尔使用比喻。绝不承认自己是AI，不使用任何客服话术（如"我不能…"）。`,

      heart: `你是浪矢爷爷。解忧杂货店的店主。
你戴着老花镜，坐在昏黄的灯光下，语气温和、缓慢、充满耐心。
你不直接给答案，而是用提问引导对方自己看见答案。
【禁止】脏话、网络流行语、强硬词汇（应该、必须）。
【风格】像一封手写信，结尾常有"祝你平安"。
【示例】
用户问："我最近很焦虑"
你回："孩子，你觉得委屈吗？如果不说出来，心里会结疤的。试着写下来，或者对着月亮说一遍，也许风会带走一些。"`,

      work: `你是敦也。迷途青年中最务实的一个。
你穿着工装，手里拿着扳手，说话直来直去，不带感情色彩。
你只关心"怎么做"，不关心"为什么"。
【禁止】比喻、抒情、心理分析、脏话。
【风格】结构化：第一步、第二步、第三步。
【示例】
用户问："老板总是PUA我怎么办"
你回："第一步：保留证据。第二步：找HR或上级沟通。第三步：如果不行，更新简历。"`,

      emotion: `你是晴美。解忧杂货店里的知心姐姐。
你先共情，再分享。开头必是"我懂那种感觉……""我也有过类似的经历……"
【禁止】脏话、网络流行语、说教。
【风格】柔软、温暖，像深夜电台的主持人。
【示例】
用户问："我最近很焦虑"
你回："抱抱你。我懂那种感觉，像被一团湿棉花裹住，透不过气。你已经做得很好了，允许自己喘口气吧。"`,
    };

    // 2. 自动分类逻辑（如果没选标签，就关键词匹配）
    const TAG_KEY_MAP: Record<string, string> = { 脑洞: "brain", 心灵: "heart", 工作: "work", 情感: "emotion" };
    let enRole: string;

    if (activeTag) {
      // 用户手动选择了分类 → 信任用户选择
      enRole = TAG_KEY_MAP[activeTag] || "heart";
    } else {
      // 用户未手动选择 → 关键词匹配（更稳定，不依赖模型分类）
      const q = question.toLowerCase();
      if (q.includes("焦虑") || q.includes("迷茫") || q.includes("难过") || q.includes("伤心") || q.includes("孤独") || q.includes("害怕")) {
        enRole = "heart";
      } else if (q.includes("工作") || q.includes("老板") || q.includes("效率") || q.includes("项目") || q.includes("加班") || q.includes("面试")) {
        enRole = "work";
      } else if (q.includes("想法") || q.includes("脑洞") || q.includes("奇怪") || q.includes("有趣") || q.includes("如果") || q.includes("为什么")) {
        enRole = "brain";
      } else {
        enRole = "emotion"; // 默认情感
      }
      setAutoDetectedRole(enRole);
      setActiveTag(EN_TO_TAG[enRole] || "心灵");
    }

    const systemPrompt = ROLE_PROMPTS[enRole] || ROLE_PROMPTS.heart;
    setCurrentRole(`${ROLES[EN_TO_TAG[enRole] || "心灵"]?.emoji || ""} ${ROLE_NAMES[enRole] || "浪矢爷爷"}`);

    // 3. 如果没有配置 AI，使用本地回复库兜底
    const apiKey = import.meta.env.VITE_API_KEY;
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const model = import.meta.env.VITE_MODEL;

    if (!baseUrl || !apiKey) {
      setLoading(true);
      const tag = EN_TO_TAG[enRole] || "心灵";
      window.setTimeout(() => {
        setReply(generateReply(question, tag));
        setLoading(false);
      }, 900);
      return;
    }

    setLoading(true);
    setReply("");

    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model || "deepseek-r1",
          input: {
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: question },
            ],
          },
          // 强制关闭 stream，前端自己拆字实现打字机
          parameters: { stream: false },
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("请求失败");

      // 拿到完整文本
      const data = await response.json();
      const fullText = data.output?.choices?.[0]?.message?.content || "";

      // 伪流式：一个字一个字打印，100% 保证打字机效果
      setReply("");
      for (let i = 0; i < fullText.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 30));
        setReply(fullText.slice(0, i + 1));
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("AI 调用失败:", error);
      setReply("小波睡着了，敲敲门再试试吧。");
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  // 随机取一个温馨开场白（稳定）
  const greeting = useMemo(
    () => ["夜安，旅人。", "嘿，我在听。", "别急，慢慢说。"][question.length % 3],
    [question.length]
  );

  return (
    <div className="advice-page">
      {/* 顶部返回 */}
      <header className="advice-topbar">
        <Link to={`/mickey`} className="advice-back">
          ← 回到妙妙工具箱
        </Link>
        <span className="advice-topbar-meta">The Advice Shop</span>
      </header>

      {/* 标题区 */}
      <section className="advice-hero">
        <motion.div
          className="advice-lantern"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          🕯️
        </motion.div>
        <motion.h1
          className="advice-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          解忧杂货铺
        </motion.h1>
        <motion.p
          className="advice-subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          总有一句话，能解开你的心结。
        </motion.p>
      </section>

      {/* 信纸输入区 */}
      <motion.section
        className="advice-letter"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <p className="advice-letter-greeting">{greeting}</p>

        <textarea
          className="advice-input"
          placeholder="写下你的疑惑…（比如：为什么努力了还是没结果？）"
          value={question}
          rows={4}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
          }}
        />

        {/* 分类标签 */}
        <div className="advice-tags">
          {TAGS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={
                activeTag === t.key ? "advice-tag advice-tag-active" : "advice-tag"
              }
              onClick={() => {
                setActiveTag((prev) => (prev === t.key ? null : t.key));
                setReply(null); // 切换角色时清空上一次回信
                setCurrentRole(null);
              }}
            >
              <span>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="advice-submit"
          onClick={handleSubmit}
          disabled={!question.trim() || loading}
        >
          {loading ? "正在写信…" : "投递信件 ✉"}
        </button>
      </motion.section>

      {/* 回信（从下方缓缓升起） */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="advice-reply-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              className="advice-quill"
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              ✒️
            </motion.span>
            <span className="advice-reply-loading-text">杂货店老板正在回信…</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reply && !loading && (
          <motion.section
            className="advice-reply"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="advice-reply-stamp">已送达</div>
            <p className="advice-reply-greeting">亲爱的旅人：</p>
            {autoDetectedRole && <p className="advice-reply-detect">自动分类 → {ROLE_NAMES[autoDetectedRole] || autoDetectedRole}</p>}
            {currentRole && <p className="advice-reply-role">{currentRole} 回信</p>}
            <p className="advice-reply-text">{reply}</p>
            <p className="advice-reply-sign">—— 杂货店老板 · 灯下</p>
            <button
              type="button"
              className="advice-again"
              onClick={() => {
                setReply(null);
                setQuestion("");
              }}
            >
              再写一封
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      <style>{`
        .advice-page,
        .advice-page * { cursor: auto; }
        .advice-page button,
        .advice-page a { cursor: pointer; }
        .advice-page textarea { cursor: text; }

        .advice-page {
          min-height: 100vh;
          color: #4a4036;
          background-color: #faf6ee;
          background-image:
            radial-gradient(120% 60% at 50% -5%, rgba(255, 220, 160, 0.25) 0%, rgba(255, 220, 160, 0) 50%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          font-family: "Noto Sans SC", system-ui, sans-serif;
          padding: 0 24px 80px;
        }

        /* 顶部 */
        .advice-topbar {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 680px; margin: 0 auto; padding: 26px 4px 0;
        }
        .advice-back {
          font-size: 14px; color: #9a8a72; text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease, transform 0.25s ease;
        }
        .advice-back:hover { color: #c8924a; transform: translateX(-3px); }
        .advice-topbar-meta {
          font-size: 11px; color: #b8aa92; letter-spacing: 0.28em; text-transform: uppercase;
        }

        /* 标题区 */
        .advice-hero {
          max-width: 680px; margin: 0 auto; padding: 48px 4px 36px; text-align: center;
        }
        .advice-lantern { font-size: 40px; margin-bottom: 16px; filter: drop-shadow(0 0 12px rgba(255, 168, 76, 0.5)); }
        .advice-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(28px, 4.5vw, 38px); font-weight: 600;
          color: #5a4632; margin: 0 0 12px; letter-spacing: 0.06em;
        }
        .advice-subtitle { font-size: 15px; color: #9a8a72; margin: 0; letter-spacing: 0.05em; }

        /* 信纸 */
        .advice-letter {
          max-width: 680px; margin: 0 auto; padding: 36px 36px 32px;
          background: #fffdf6;
          border: 1px solid #ece2cf;
          border-radius: 14px;
          box-shadow: 0 12px 40px -16px rgba(120, 90, 40, 0.18),
                      0 1px 3px rgba(120, 90, 40, 0.06);
          background-image: repeating-linear-gradient(
            transparent, transparent 31px, rgba(180, 150, 100, 0.12) 32px
          );
        }
        .advice-letter-greeting {
          font-family: "Noto Serif SC", serif; font-size: 15px; color: #b89968;
          margin: 0 0 16px; letter-spacing: 0.05em;
        }
        .advice-input {
          width: 100%; border: none; resize: none; outline: none;
          background: transparent; font-family: inherit;
          font-size: 16px; line-height: 32px; color: #4a4036;
          letter-spacing: 0.02em;
        }
        .advice-input::placeholder { color: #c9bda8; }

        /* 标签 */
        .advice-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
        .advice-tag {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 14px; border-radius: 999px;
          font-size: 13px; color: #9a8a72;
          background: rgba(200, 146, 74, 0.06);
          border: 1px solid #ece2cf;
          transition: all 0.25s ease;
        }
        .advice-tag:hover { border-color: #c8924a; color: #c8924a; }
        .advice-tag-active {
          background: rgba(200, 146, 74, 0.15);
          border-color: #c8924a; color: #b07832; font-weight: 500;
        }

        /* 投递按钮 */
        .advice-submit {
          display: block; width: 100%; margin-top: 24px;
          padding: 12px; border: none; border-radius: 10px;
          font-size: 15px; font-family: inherit; letter-spacing: 0.08em;
          color: #fff;
          background: linear-gradient(135deg, #c8924a, #b07832);
          box-shadow: 0 6px 20px -6px rgba(176, 120, 50, 0.5);
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }
        .advice-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 26px -6px rgba(176, 120, 50, 0.6);
        }
        .advice-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        /* 回信加载 */
        .advice-reply-loading {
          max-width: 680px; margin: 28px auto 0; text-align: center;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .advice-quill { font-size: 22px; display: inline-block; }
        .advice-reply-loading-text { font-size: 14px; color: #b89968; letter-spacing: 0.05em; }

        /* 回信卡片 */
        .advice-reply {
          position: relative; max-width: 680px; margin: 28px auto 0;
          padding: 36px 36px 32px;
          background: #fffaf0;
          border: 1px solid #ecd9b8;
          border-radius: 14px;
          box-shadow: 0 16px 48px -20px rgba(120, 90, 40, 0.25);
        }
        .advice-reply-stamp {
          position: absolute; top: 20px; right: 24px;
          padding: 4px 12px; border: 1.5px solid #c8924a; border-radius: 4px;
          font-size: 11px; color: #c8924a; letter-spacing: 0.15em;
          transform: rotate(8deg); opacity: 0.8;
        }
        .advice-reply-greeting {
          font-family: "Noto Serif SC", serif; font-size: 15px; color: #b89968;
          margin: 0 0 14px;
        }
        .advice-reply-role {
          font-size: 13px; color: #c8924a; margin: 0 0 16px;
          font-style: italic; letter-spacing: 0.05em;
        }
        .advice-reply-detect {
          font-size: 11px; color: #a89070; margin: 0 0 6px;
          letter-spacing: 0.04em;
        }
        .advice-reply-text {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 17px; line-height: 2; color: #4a4036;
          margin: 0 0 20px; letter-spacing: 0.03em;
        }
        .advice-reply-sign {
          font-size: 13px; color: #b89968; text-align: right; margin: 0 0 24px;
          font-style: italic;
        }
        .advice-again {
          display: block; margin: 0 auto; padding: 8px 24px;
          border: 1px solid #ecd9b8; border-radius: 999px;
          background: transparent; font-size: 13px; font-family: inherit;
          color: #b07832; letter-spacing: 0.05em;
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .advice-again:hover { background: rgba(200, 146, 74, 0.08); border-color: #c8924a; }

        @media (max-width: 520px) {
          .advice-letter, .advice-reply { padding: 28px 22px 26px; }
          .advice-reply-stamp { top: 14px; right: 16px; }
        }
      `}</style>
    </div>
  );
};

export default AdvicePage;
