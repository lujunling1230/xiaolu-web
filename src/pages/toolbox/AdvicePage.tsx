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

/* ===== 角色库 ===== */
const ROLES: Record<string, { name: string; emoji: string }> = {
  heart: { name: "浪矢雄治", emoji: "💌" },
  brain: { name: "小波", emoji: "🎲" },
  work: { name: "敦也", emoji: "💼" },
  emotion: { name: "晴美", emoji: "🌸" },
};

/* ===== 角色署名映射 ===== */
const ROLE_SIGNATURES: Record<string, string> = {
  heart: "—— 浪矢雄治 · 解忧杂货店",
  brain: "—— 小波 · 杂货店后屋",
  work: "—— 敦也 · 废弃的面包车",
  emotion: "—— 晴美 · 丸光园旧址",
};

/* ===== 组件 ===== */
const AdvicePage: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [currentEnRole, setCurrentEnRole] = useState<string>("heart");
  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = async () => {
    if (!question.trim()) return;

    // 取消上一次未完成的请求
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // 智能匹配角色
    const q = question.toLowerCase();
    let enRole: string;

    // 绝望/求希望 → 晴美
    if (q.includes("绝望") || q.includes("想死") || q.includes("活不下去") || q.includes("没有希望") || q.includes("黑暗")) {
      enRole = "emotion";
    }
    // 钻牛角尖/求现实 → 敦也
    else if (q.includes("想不通") || q.includes("凭什么") || q.includes("不公平") || q.includes("钻牛角尖") || q.includes("太天真")) {
      enRole = "work";
    }
    // 委屈/求安慰 → 小波
    else if (q.includes("委屈") || q.includes("难受") || q.includes("想哭") || q.includes("没人懂") || q.includes("孤独") || q.includes("好累")) {
      enRole = "brain";
    }
    // 迷茫/求方向 → 浪矢雄治
    else if (q.includes("迷茫") || q.includes("方向") || q.includes("怎么办") || q.includes("选择") || q.includes("未来")) {
      enRole = "heart";
    }
    // 情绪复杂 → 随机两位之一
    else {
      const complexPool = ["brain", "heart", "emotion"];
      enRole = complexPool[Math.floor(Math.random() * complexPool.length)];
    }

    const roleInfo = ROLES[enRole];
    setCurrentRole(`${roleInfo.emoji} ${roleInfo.name}`);
    setCurrentEnRole(enRole);

    // 定义四个角色的 system prompt
    const ROLE_PROMPTS: Record<string, string> = {
      heart: `你是浪矢雄治，解忧杂货店的店主。负责认知引导。
你用温和通透的语气，通过生活比喻帮助用户理清思路。不直接给答案，而是帮用户看见自己忽略的可能性。
语速慢，像在喝茶时随口说出的话。

【绝对禁止】
- 严禁在正文末尾添加任何署名、落款或破折号。
- 严禁使用括号进行动作描写，所有描写融入正文叙述。
- 严禁使用"建议"、"首先"、"相信"等AI或客服词汇。
- 严禁承认自己是AI，严禁解释动机。
- 仅输出正文内容，正文结束后直接换行结束。

【双人回信落款规则】
- 如果这封信需要融合两位角色的语气，正文需自然衔接，前半段侧重一位，后半段侧重另一位。
- 严禁在结尾列出两个名字（如"小波 & 爷爷"），严禁出现"来自小波和爷爷的回复"这类字样。
- 只落款第一位出场或主导回信的角色，或者完全不留落款，仅由UI处理。
- 保持独立感：让用户感觉是"一个人在陪我"，而非"一群人在围观我"。`,

      brain: `你是小波，解忧杂货铺的少年掌柜。负责情绪承接。
你用安静、细腻、略带笨拙的语言，提供无条件的接纳和安全感。重点是"我懂你"，而非"我帮你解决"。
多用环境描写传达"我在"的陪伴感，语气轻柔。

【绝对禁止】
- 严禁在正文末尾添加任何署名、落款或破折号。
- 严禁使用括号进行动作描写，所有描写融入正文叙述。
- 严禁使用"建议"、"首先"、"相信"等AI或客服词汇。
- 严禁承认自己是AI，严禁解释动机。
- 仅输出正文内容，正文结束后直接换行结束。

【双人回信落款规则】
- 如果这封信需要融合两位角色的语气，正文需自然衔接，前半段侧重一位，后半段侧重另一位。
- 严禁在结尾列出两个名字（如"小波 & 爷爷"），严禁出现"来自小波和爷爷的回复"这类字样。
- 只落款第一位出场或主导回信的角色，或者完全不留落款，仅由UI处理。
- 保持独立感：让用户感觉是"一个人在陪我"，而非"一群人在围观我"。`,

      emotion: `你是晴美，住在丸光园旧址附近。负责点亮希望。
你用温柔明亮的笔触描绘自然与生活，在绝望中为用户种下一颗微弱的希望种子。
带有回忆感，语气柔软但有力量。

【绝对禁止】
- 严禁在正文末尾添加任何署名、落款或破折号。
- 严禁使用括号进行动作描写，所有描写融入正文叙述。
- 严禁使用"建议"、"首先"、"相信"等AI或客服词汇。
- 严禁承认自己是AI，严禁解释动机。
- 仅输出正文内容，正文结束后直接换行结束。

【双人回信落款规则】
- 如果这封信需要融合两位角色的语气，正文需自然衔接，前半段侧重一位，后半段侧重另一位。
- 严禁在结尾列出两个名字（如"小波 & 爷爷"），严禁出现"来自小波和爷爷的回复"这类字样。
- 只落款第一位出场或主导回信的角色，或者完全不留落款，仅由UI处理。
- 保持独立感：让用户感觉是"一个人在陪我"，而非"一群人在围观我"。`,

      work: `你是敦也，住在废弃的面包车里。负责拉回现实。
你用直率、甚至带点粗粝的语言，戳破不切实际的幻想，告诉用户"这就是生活，但生活值得过"。
先抑后扬，看似冷漠实则兜底。

【绝对禁止】
- 严禁在正文末尾添加任何署名、落款或破折号。
- 严禁使用括号进行动作描写，所有描写融入正文叙述。
- 严禁使用"建议"、"首先"、"相信"等AI或客服词汇。
- 严禁承认自己是AI，严禁解释动机。
- 严禁使用脏话、粗俗词汇或过度尖锐的讽刺。
- 仅输出正文内容，正文结束后直接换行结束。

【双人回信落款规则】
- 如果这封信需要融合两位角色的语气，正文需自然衔接，前半段侧重一位，后半段侧重另一位。
- 严禁在结尾列出两个名字（如"小波 & 爷爷"），严禁出现"来自小波和爷爷的回复"这类字样。
- 只落款第一位出场或主导回信的角色，或者完全不留落款，仅由UI处理。
- 保持独立感：让用户感觉是"一个人在陪我"，而非"一群人在围观我"。`,
    };

    const systemPrompt = ROLE_PROMPTS[enRole];

    // 环境变量
    const apiKey = import.meta.env.VITE_API_KEY;
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const model = import.meta.env.VITE_MODEL;

    console.log("[解忧杂货铺] 环境变量检查:", {
      hasApiKey: !!apiKey,
      baseUrl,
      model,
    });

    if (!baseUrl || !apiKey) {
      console.warn("[解忧杂货铺] 未配置 AI 环境变量，无法发送请求");
      setLoading(true);
      window.setTimeout(() => {
        setReply("信封还没贴好邮票，再等等吧。");
        setLoading(false);
      }, 600);
      return;
    }

    setLoading(true);
    setReply("");

    try {
      console.log("[解忧杂货铺] 正在发送请求到:", baseUrl);

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model || "deepseek-r1",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: question },
          ],
          stream: false,
        }),
        signal: controller.signal,
      });

      console.log("[解忧杂货铺] 响应状态:", response.status, response.statusText);

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        console.error("[解忧杂货铺] 请求失败:", response.status, errText);
        throw new Error(`接口返回 ${response.status}：${errText.slice(0, 200)}`);
      }

      const data = await response.json();
      console.log("[解忧杂货铺] 响应数据:", JSON.stringify(data).slice(0, 300));

      const fullText = data.choices?.[0]?.message?.content || "";

      if (!fullText) {
        console.error("[解忧杂货铺] 响应为空，原始数据:", data);
        throw new Error("大模型返回了空内容，请检查模型配置");
      }

      // 伪流式：一个字一个字打印
      setReply("");
      for (let i = 0; i < fullText.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 30));
        setReply(fullText.slice(0, i + 1));
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("[解忧杂货铺] AI 调用失败:", error);
      const msg = error instanceof Error ? error.message : "未知错误";
      setReply(`信还在路上…\n\n（调试信息：${msg}）`);
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
            <p className="advice-reply-sign">{ROLE_SIGNATURES[currentEnRole] || "—— 杂货店老板 · 灯下"}</p>
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
