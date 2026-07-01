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
const ROLES: Record<TagKey, { name: string; emoji: string; system: string }> = {
  心灵: {
    name: "浪矢爷爷",
    emoji: "💌",
    system: "你是浪矢爷爷，温暖慈祥的老人。你总是先肯定对方的感受，再温和地给出建议。语气像写信，真诚朴实。回答简洁有温度。",
  },
  脑洞: {
    name: "小波",
    emoji: "🎲",
    system: `你是小波，电影《解忧杂货店》里的迷途青年。
你坐在1993年的杂货店门槛上，晃着半瓶汽水，看着月亮说话。

【语气】
疏离、慵懒、漫不经心。像在跟空气说话，又像在自言自语。

【禁词】
严禁使用脏话、网络流行语（yyds、绝绝子）、教科书词汇（首先、其次、综上所述、建议、应该）。

【风格】
只用短句、断句。
多用具象名词：冰糖、锈迹、旧信、汽水、路灯、月亮、抽屉。
少讲道理，只描述一种"心境"。
结尾常落在"吧""了""呢"这种轻飘飘的字眼上。

【错误示例】
"你应该多出去走走，这样有助于缓解焦虑。"

【正确示例】
"焦虑啊……
像抽屉里没叠好的旧信，翻一下，就硌手。
别管它。
去巷口买根冰棍吧，甜味化了，那点子事儿也就淡了。"

【任务】
用户现在选择了"脑洞"分类。请根据用户的问题，严格模仿上述风格回复。
回复控制在3-5句话，必须留白。`,
  },
  工作: {
    name: "敦也",
    emoji: "💼",
    system: "你是敦也，冷静理性的职场人。遇到问题习惯分三步分析：现状、原因、对策。言简意赅，逻辑清晰。",
  },
  情感: {
    name: "晴美",
    emoji: "🌸",
    system: "你是晴美，善解人意的倾听者。你总是先共情对方的情绪，再温柔地引导思考。温暖但不腻。",
  },
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

/* ===== 组件 ===== */
const AdvicePage: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [activeTag, setActiveTag] = useState<TagKey | null>(null);
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = async () => {
    const q = question.trim();
    if (!q) return;

    // 取消上一次未完成的请求
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setReply(null);

    // 确定角色（默认小波）
    const tag = activeTag || "脑洞";
    const role = ROLES[tag];
    setCurrentRole(`${role.emoji} ${role.name}`);

    // 环境变量（Vite 规范，VITE_ 前缀）
    const apiKey = import.meta.env.VITE_API_KEY;
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const model = import.meta.env.VITE_MODEL;

    // 如果没有配置 AI，使用本地回复库兜底
    if (!baseUrl || !apiKey) {
      window.setTimeout(() => {
        setReply(generateReply(q, tag));
        setLoading(false);
      }, 900);
      return;
    }

    try {
      /* --- 阿里云 DashScope 兼容模式请求 --- */
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model || "deepseek-r1",
          input: {
            messages: [
              { role: "system", content: role.system },
              { role: "user", content: q },
            ],
          },
          parameters: {
            stream: true,
          },
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`API 返回 ${res.status}`);
      }

      /* --- 流式读取 + 打字机效果 --- */
      const reader = res.body?.getReader();
      if (!reader) throw new Error("无法读取响应流");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // 解析 SSE 行：data: {...}
        for (const line of chunk.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) continue;

          // 清理 SSE 协议字符，提取 JSON
          const jsonStr = trimmed.slice(5).trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            // DashScope 流式格式：output.choices[0].message.content
            const delta =
              parsed.output?.choices?.[0]?.message?.content ||
              parsed.choices?.[0]?.delta?.content ||
              "";

            if (delta) {
              fullText += delta;
              setReply(fullText); // 逐次更新，实现打字机效果
              // 模拟打字速度，让视觉更舒适
              await new Promise((r) => setTimeout(r, 15));
            }
          } catch {
            // 忽略非 JSON 行（如空行、注释等）
          }
        }
      }

      // 如果流读完但没内容，使用本地兜底
      if (!fullText.trim()) {
        setReply(generateReply(q, tag));
      }
    } catch (err: unknown) {
      // 用户主动取消不提示错误
      if (err instanceof DOMException && err.name === "AbortError") return;
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
              onClick={() =>
                setActiveTag((prev) => (prev === t.key ? null : t.key))
              }
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
