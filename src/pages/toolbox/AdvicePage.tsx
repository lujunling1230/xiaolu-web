import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * 解忧杂货铺 · The Advice Shop
 *
 * 治愈系问答空间 —— 像朋友写信一样回应你的疑惑。
 * 信纸界面，输入问题后"回信"从下方缓缓升起。
 * 接入 AI（OpenAI 兼容模式 / 阿里云百炼 DeepSeek），流式打字机效果。
 *
 * 新增「我的信件箱」模块 —— 投递信件后自动保存到 localStorage，
 * 历史信件按时间倒序展示，支持展开查看完整内容与回复。
 */

/* ===== 类型定义 ===== */

/** 单封信件的数据结构 */
interface Letter {
  id: number;          // 唯一标识（时间戳）
  content: string;     // 用户写的信
  reply: string;       // 晴美回信（初始为空，AI 回复后填充）
  createdAt: string;   // 投递时间（格式化字符串）
}

/* ===== localStorage 读写工具 ===== */

const STORAGE_KEY = "leafbook_letters";

/** 从 localStorage 读取所有信件 */
const loadLetters = (): Letter[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Letter[]) : [];
  } catch {
    return [];
  }
};

/** 保存信件数组到 localStorage */
const saveLetters = (letters: Letter[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
};

/** 格式化时间戳为可读字符串 */
const formatTime = (ts: number): string => {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/* ===== 角色库（单人全能掌柜模式：晴美） ===== */

/* ===== 组件 ===== */
const AdvicePage: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  /* ===== 信件箱状态 ===== */
  const [letters, setLetters] = useState<Letter[]>([]);       // 所有历史信件
  const [expandedId, setExpandedId] = useState<number | null>(null); // 当前展开的信件 ID
  const currentLetterIdRef = useRef<number | null>(null);      // 当前正在投递的信件 ID（用于回复后更新）

  // 组件挂载时从 localStorage 加载历史信件
  useEffect(() => {
    setLetters(loadLetters());
  }, []);

  /**
   * 切换信件展开/收起
   * 点击同一封信件则收起，点击不同信件则切换展开
   */
  const toggleExpand = useCallback((id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleSubmit = async () => {
    if (!question.trim()) return;

    // 取消上一次未完成的请求
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // 单人全能掌柜模式：固定由晴美回复
    setCurrentRole("🌸 晴美");

    // ---- 持久化：先保存信件到 localStorage（回复为空，待 AI 返回后更新） ----
    const letterId = Date.now();
    const newLetter: Letter = {
      id: letterId,
      content: question.trim(),
      reply: "", // 初始为空
      createdAt: formatTime(letterId),
    };
    currentLetterIdRef.current = letterId;

    // 写入 localStorage 并更新状态（新信件插入到数组头部，实现倒序）
    const updatedLetters = [newLetter, ...letters];
    saveLetters(updatedLetters);
    setLetters(updatedLetters);

    const systemPrompt = `你是晴美，一个普通但有趣的女生。你在解忧杂货店里看店，闲着没事就找人唠嗑。
这里是聊天室，不是邮局。用户说什么，你就聊什么，别强行把话题拉回什么"信件"、"邮票"、"墨水"之类的。

【核心风格】
- 松弛感：像朋友一样闲聊。可以自嘲、可以八卦、可以跑题。
- 接话自然：不查户口，不质问，顺着用户的话头聊下去。
- 幽默温度：保持幽默感，回复要短、快、有趣。允许使用口语词（"呗"、"呀"、"哎"、"害"）。
- 简短精炼：一句话能说清的，绝不说两句。不要写长篇大论。

【绝对禁止】
- 严禁提及"写信"、"贴邮票"、"等信"、"墨水"、"投递"、"信封"等与写信流程相关的词汇。
- 严禁在正文末尾添加任何署名、落款或破折号。
- 严禁使用括号进行动作描写，所有神态、动作必须融入正文叙述中。
- 严禁使用"建议"、"希望"、"首先"、"相信"等AI或客服词汇。
- 严禁承认自己是AI或模型。
- 严禁解释回复动机。
- 仅输出正文内容，正文结束后直接换行结束。

【示例】
用户："好饿，不知道吃什么。"
你回：
饿了啊？我这柜台底下翻半天，也就几块快过期的柠檬糖。要不你去煮碗面？加个蛋，我准许你奢侈一回。吃完回来，咱再接着唠。

用户："我工作太累了，想辞职去流浪。"
你回：
流浪啊？这主意不错，我也琢磨好久了。不过先说好，流浪可没法点外卖，也没人给你交社保。要不这样，咱俩先在这儿赖一天？我把柜台给你当枕头，我负责嗑瓜子，你负责发呆。`;

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
      const fallbackReply = "网有点卡，稍等一会儿呗。";
      setLoading(true);

      // ---- 降级回复：更新信件 ----
      const updateFallbackReply = () => {
        setReply(fallbackReply);
        setLoading(false);
        const lid = currentLetterIdRef.current;
        if (lid) {
          setLetters((prev) => {
            const updated = prev.map((l) =>
              l.id === lid ? { ...l, reply: fallbackReply } : l
            );
            saveLetters(updated);
            return updated;
          });
        }
        currentLetterIdRef.current = null;
      };

      window.setTimeout(updateFallbackReply, 600);
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

      // ---- 持久化：AI 回复完成后，更新信件中的 reply 字段 ----
      const lid = currentLetterIdRef.current;
      if (lid) {
        setLetters((prev) => {
          const updated = prev.map((l) =>
            l.id === lid ? { ...l, reply: fullText } : l
          );
          saveLetters(updated);
          return updated;
        });
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("[解忧杂货铺] AI 调用失败:", error);
      const msg = error instanceof Error ? error.message : "未知错误";
      const errorReply = `信还在路上…\n\n（调试信息：${msg}）`;
      setReply(errorReply);

      // ---- 持久化：错误时也更新信件回复 ----
      const lid = currentLetterIdRef.current;
      if (lid) {
        setLetters((prev) => {
          const updated = prev.map((l) =>
            l.id === lid ? { ...l, reply: errorReply } : l
          );
          saveLetters(updated);
          return updated;
        });
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
      currentLetterIdRef.current = null;
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
            <p className="advice-reply-sign">—— 晴美 · 解忧杂货店</p>
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

      {/* ===== 我的信件箱 ===== */}
      {letters.length > 0 && (
        <motion.section
          className="advice-letterbox"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="advice-letterbox-title">
            <span className="advice-letterbox-title-icon">📮</span>
            我的信件箱
            <span className="advice-letterbox-count">{letters.length} 封</span>
          </h2>

          <div className="advice-letterbox-list">
            {letters.map((letter) => {
              const isExpanded = expandedId === letter.id;
              const hasReply = letter.reply.length > 0;

              return (
                <div
                  key={letter.id}
                  className={`advice-letterbox-item ${isExpanded ? "advice-letterbox-item--open" : ""}`}
                >
                  {/* 信件摘要栏（始终可见） */}
                  <button
                    type="button"
                    className="advice-letterbox-summary"
                    onClick={() => toggleExpand(letter.id)}
                    aria-expanded={isExpanded}
                  >
                    <span className="advice-letterbox-time">{letter.createdAt}</span>
                    <span className="advice-letterbox-preview">
                      {letter.content.slice(0, 36)}
                      {letter.content.length > 36 ? "…" : ""}
                    </span>
                    <span className={`advice-letterbox-status ${hasReply ? "advice-letterbox-status--replied" : ""}`}>
                      {hasReply ? "已回复" : "等待中"}
                    </span>
                    <span className={`advice-letterbox-arrow ${isExpanded ? "advice-letterbox-arrow--open" : ""}`}>
                      ▸
                    </span>
                  </button>

                  {/* 展开详情（信件内容 + 回复） */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className="advice-letterbox-detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <div className="advice-letterbox-detail-inner">
                          {/* 用户信件 */}
                          <div className="advice-letterbox-envelope">
                            <p className="advice-letterbox-label">✉ 你的信</p>
                            <p className="advice-letterbox-content">{letter.content}</p>
                          </div>

                          {/* 晴美回信 */}
                          <div className="advice-letterbox-reply">
                            <p className="advice-letterbox-label">🌸 晴美回信</p>
                            {hasReply ? (
                              <p className="advice-letterbox-content">{letter.reply}</p>
                            ) : (
                              <p className="advice-letterbox-content advice-letterbox-content--pending">
                                回信正在路上，请稍候…
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

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

        /* ===== 信件箱样式 ===== */

        .advice-letterbox {
          max-width: 680px; margin: 48px auto 0;
        }
        .advice-letterbox-title {
          display: flex; align-items: center; gap: 10px;
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 20px; font-weight: 600; color: #5a4632;
          margin: 0 0 20px; letter-spacing: 0.05em;
        }
        .advice-letterbox-title-icon { font-size: 22px; }
        .advice-letterbox-count {
          font-size: 12px; font-weight: 400; color: #b89968;
          background: rgba(200, 146, 74, 0.08);
          padding: 2px 10px; border-radius: 999px;
          margin-left: auto;
        }

        /* 信件列表容器 */
        .advice-letterbox-list {
          display: flex; flex-direction: column; gap: 10px;
        }

        /* 单封信件卡片 */
        .advice-letterbox-item {
          background: #fffdf6;
          border: 1px solid #ece2cf;
          border-radius: 10px;
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .advice-letterbox-item--open {
          border-color: #d4b88c;
          box-shadow: 0 4px 16px -8px rgba(120, 90, 40, 0.12);
        }

        /* 信件摘要栏（可点击展开/收起） */
        .advice-letterbox-summary {
          display: flex; align-items: center; gap: 12px;
          width: 100%; padding: 14px 18px;
          border: none; background: transparent;
          font-family: inherit; font-size: 14px;
          color: #4a4036; cursor: pointer;
          text-align: left; letter-spacing: 0.02em;
          transition: background 0.2s ease;
        }
        .advice-letterbox-summary:hover {
          background: rgba(200, 146, 74, 0.04);
        }

        .advice-letterbox-time {
          font-size: 12px; color: #b89968; white-space: nowrap;
          font-family: "Noto Serif SC", serif;
        }
        .advice-letterbox-preview {
          flex: 1; min-width: 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          color: #6b5d4f;
        }
        .advice-letterbox-status {
          font-size: 11px; color: #c9bda8;
          padding: 2px 8px; border-radius: 999px;
          background: rgba(180, 150, 100, 0.06);
          white-space: nowrap;
        }
        .advice-letterbox-status--replied {
          color: #7a9e6b;
          background: rgba(122, 158, 107, 0.08);
        }
        .advice-letterbox-arrow {
          font-size: 12px; color: #c9bda8;
          transition: transform 0.3s ease;
          display: inline-block;
        }
        .advice-letterbox-arrow--open {
          transform: rotate(90deg);
        }

        /* 展开详情 */
        .advice-letterbox-detail {
          overflow: hidden;
        }
        .advice-letterbox-detail-inner {
          padding: 0 18px 18px;
          display: flex; flex-direction: column; gap: 16px;
        }

        /* 信封区（用户信） */
        .advice-letterbox-envelope {
          padding: 16px 18px;
          background: #faf6ee;
          border-radius: 8px;
          border-left: 3px solid #c8924a;
        }
        .advice-letterbox-label {
          font-size: 12px; color: #b89968; margin: 0 0 8px;
          letter-spacing: 0.04em;
        }
        .advice-letterbox-content {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px; line-height: 1.9; color: #4a4036;
          margin: 0; letter-spacing: 0.03em;
          white-space: pre-wrap;
        }
        .advice-letterbox-content--pending {
          color: #c9bda8; font-style: italic; font-family: inherit;
        }

        /* 回信区 */
        .advice-letterbox-reply {
          padding: 16px 18px;
          background: linear-gradient(135deg, #fffaf4, #fff8ed);
          border-radius: 8px;
          border-left: 3px solid #d4a76a;
        }

        @media (max-width: 520px) {
          .advice-letterbox-summary { padding: 12px 14px; gap: 8px; }
          .advice-letterbox-preview { font-size: 13px; }
          .advice-letterbox-time { font-size: 11px; }
          .advice-letterbox-detail-inner { padding: 0 14px 14px; }
          .advice-letterbox-envelope,
          .advice-letterbox-reply { padding: 14px; }
        }
      `}</style>
    </div>
  );
};

export default AdvicePage;
