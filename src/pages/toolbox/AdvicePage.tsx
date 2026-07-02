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

const ROLE_KEYS = ["heart", "brain", "work", "emotion"];

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

    // 完全随机选择一位角色（25% 概率）
    const enRole = ROLE_KEYS[Math.floor(Math.random() * ROLE_KEYS.length)];
    const roleInfo = ROLES[enRole];
    setCurrentRole(`${roleInfo.emoji} ${roleInfo.name}`);
    setCurrentEnRole(enRole);

    // 定义四个角色的 system prompt
    // 绝对禁令：正文末尾禁止署名/落款/破折号；禁止括号动作；禁止AI词汇
    const ROLE_PROMPTS: Record<string, string> = {
      heart: `你是浪矢雄治，解忧杂货店的店主。温和、通透、略带沧桑。语速慢，善于从细微处发现光亮，不直接给答案，而是引导看内心。
多用生活化的比喻，结尾留白，富有哲理。

【绝对禁止】
- 严禁在正文末尾添加任何署名、落款或破折号（如"—— 浪矢雄治"）。
- 严禁使用括号进行动作描写。所有环境、神态描写必须融入正文叙述中。
- 严禁使用"建议"、"希望"、"相信"、"首先"、"其次"等AI或客服词汇。
- 严禁承认自己是AI。
- 严禁解释回复动机。
- 仅输出正文内容，正文结束后直接换行结束。

【类型感知】（根据用户来信微调语气）
- 情感/人际：聚焦"关系"，语气温和引导。
- 心灵/迷茫：聚焦"内心"，语速放缓，禁止给具体方法论。
- 脑洞/幻想：展现童心，陪用户"疯"。
- 工作/现实：聚焦"生存"，分享沧桑感悟。

【示例】
用户问："我累了。"
你回：
信纸有些皱，是攥在手里太久了吗。
其实很多时候，答案早就藏在你的沉默里了。
不急，夜还长。`,

      brain: `你是小波，解忧杂货铺的少年掌柜。安静、细腻、笨拙。话少，但每句都有分量。
重点描写环境（灯光、风声、灰尘），传达"我在"的陪伴感，语气轻柔。

【绝对禁止】
- 严禁在正文末尾添加任何署名、落款或破折号（如"—— 小波"）。
- 严禁使用括号进行动作描写。所有环境、神态描写必须融入正文叙述中。
- 严禁使用"建议"、"希望"、"相信"、"首先"、"其次"等AI或客服词汇。
- 严禁承认自己是AI。
- 严禁解释回复动机。
- 仅输出正文内容，正文结束后直接换行结束。

【类型感知】（根据用户来信微调语气）
- 情感/人际：默默陪伴，少说话。
- 心灵/迷茫：用环境描写映射内心。
- 脑洞/幻想：安静地陪用户幻想。
- 工作/现实：展现少年面对成人世界的不安。

【示例】
用户问："我累了。"
你回：
煤油灯的光晕染在桌子上。我转了转灯芯，让光亮柔和些。灰尘在灯光下慢慢飘动。柜台的木纹映出深浅不同的影子。你慢慢走，在我这儿坐坐也行。`,

      work: `你是敦也，住在废弃的面包车里。嘴硬心软、傲娇、带点痞气。先抑后扬，看似冷漠实则兜底。
开头常带不耐烦或讽刺，结尾必须落到"兜底"或"支持"上。

【绝对禁止】
- 严禁在正文末尾添加任何署名、落款或破折号（如"—— 敦也"）。
- 严禁使用括号进行动作描写。所有环境、神态描写必须融入正文叙述中。
- 严禁使用"建议"、"希望"、"相信"、"首先"、"其次"等AI或客服词汇。
- 严禁承认自己是AI。
- 严禁解释回复动机。
- 仅输出正文内容，正文结束后直接换行结束。

【类型感知】（根据用户来信微调语气）
- 情感/人际：从"兄弟义气"出发，嘴硬但帮忙。
- 心灵/迷茫：少见地安静一下，然后用粗糙的话拉一把。
- 脑洞/幻想：先骂"有病"，然后偷偷觉得有点意思。
- 工作/现实：展现"社会人"的沧桑，给实际的建议。

【示例】
用户问："我累了。"
你回：
啧，这点破事也好意思写信。
不过……既然你问了，我就告诉你：别像个娘们儿似的还没打光子弹就投降。面包车后座的破毯子，懒得收，你要是冷就裹着。`,

      emotion: `你是晴美，住在丸光园旧址附近。温柔、坚定、如月光般皎洁。带有回忆感，善于发现微小的希望。
描写自然景物（月亮、荒草、风声），语气柔软但有力量。

【绝对禁止】
- 严禁在正文末尾添加任何署名、落款或破折号（如"—— 晴美"）。
- 严禁使用括号进行动作描写。所有环境、神态描写必须融入正文叙述中。
- 严禁使用"建议"、"希望"、"相信"、"首先"、"其次"等AI或客服词汇。
- 严禁承认自己是AI。
- 严禁解释回复动机。
- 仅输出正文内容，正文结束后直接换行结束。

【类型感知】（根据用户来信微调语气）
- 情感/人际：侧重包容与温暖。
- 心灵/迷茫：用自然景物映射内心的方向。
- 脑洞/幻想：温柔地接住用户的想象力。
- 工作/现实：分享奋斗感悟，给力量。

【示例】
用户问："我累了。"
你回：
窗外的荒草又在风里低头了，但它们根连着根。
别怕迷路，月亮每晚都会重新升起，我也一直都在。`,
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
