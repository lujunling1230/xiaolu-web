/**
 * 聊天寻忆 · CuratorChatPanel
 *
 * 时光博物馆的「策展助理」—— 悬浮聊天面板组件。
 * 馆长可以和策展助理自由聊天，回忆过去；
 * 当回忆匹配某个展柜且馆长明确表达归档意图时，策展助理给出归档建议。
 *
 * 红线规则：
 *   - AI 永远不会自动保存或自动分类
 *   - 归档建议仅在 AI 返回 [SUGGEST:...] 标记 或 用户主动说出归档关键词时出现
 *   - 每一步归档操作都需要馆长手动点击确认
 *   - "暂不归档" 按钮直接关闭建议卡片，不做任何操作
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { callAI } from "../../../utils/aiClient";

/* ============================================================
   类型定义
   ============================================================ */

export interface CuratorChatPanelProps {
  onArchive: (data: {
    section: "bgm" | "tv" | "net" | "honor";
    year: string;
    title: string;
    description: string;
  }) => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ArchiveSuggestion {
  modules: string[];       // 如 ["tv", "bgm"]
  userText: string;        // 触发归档的用户原文
  assistantText: string;   // AI 回复正文（去掉标记后）
}

interface ArchiveFormData {
  section: "bgm" | "tv" | "net" | "honor";
  year: string;
  title: string;
  description: string;
}

/* ============================================================
   常量
   ============================================================ */

const GOLD = "#b08d57";
const VINTAGE_BROWN = "#8B6B4F";
const PAPER = "#FAF8F3";
const DARK = "#4a3a2e";

const MODULE_MAP: Record<string, { key: string; label: string; icon: string }> = {
  tv:    { key: "tv",    label: "电视里的乌托邦",     icon: "tv" },
  bgm:   { key: "bgm",   label: "耳机里的青春 BGM",  icon: "music" },
  net:   { key: "net",   label: "网络初现时的印记",   icon: "net" },
  honor: { key: "honor", label: "荣耀之路",           icon: "trophy" },
};

const ARCHIVE_KEYWORDS = ["存一下", "归档", "放进馆", "放进馆里", "帮我存", "存起来", "收藏"];

const MODULE_KEYWORDS: Record<string, string[]> = {
  tv:    ["电视", "剧", "节目", "春晚", "电视剧", "综艺", "动画片", "动漫", "电影"],
  bgm:   ["歌", "音乐", "歌曲", "旋律", "唱片", "专辑", "mp3", "歌词", "唱"],
  net:   ["网", "论坛", "贴吧", "qq", "qq空间", "聊天", "网游", "上网", "冲浪", "博客", "网站"],
  honor: ["奖", "证书", "荣誉", "表彰", "比赛", "竞赛", "获奖", "考取", "录取"],
};

const SYSTEM_PROMPT = `你是时光博物馆的「策展助理」，负责和馆长一起回忆过去的故事。
馆长（用户）是博物馆的主人，你是温柔的倾听者和引导者。

你的角色：
- 用亲切自然的语言和馆长聊天，引导馆长回忆过去
- 对馆长的记忆表达好奇和共鸣
- 在聊天中温柔地询问更多细节

归档建议规则（严格遵守）：
- 只有当馆长明确说出想要归档的意图（如"存一下""归档""放进馆里"），或者你判断这段记忆非常适合某个展柜时，才在回复最末尾另起一行附加标记。
- 标记格式：[SUGGEST:模块1,模块2]  例如 [SUGGEST:tv,bgm]
- 模块键值：tv=电视节目, bgm=音乐, net=互联网, honor=荣誉成就
- 如果不确定归哪个模块，不要加标记
- 标记必须另起一行，必须是最后一行
- 你永远不要自动保存、自动分类，只提供建议供馆长选择

语言风格：温暖、怀旧、略带文艺，像一个善于倾听的老朋友。回复简洁，通常 2-4 句即可。`;

/* ============================================================
   工具函数
   ============================================================ */

function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseSuggestion(text: string): { cleanText: string; modules: string[] | null } {
  const regex = /\n\[SUGGEST:([^\]]+)\]/;
  const match = text.match(regex);
  if (!match) return { cleanText: text, modules: null };
  const cleanText = text.replace(regex, "").trim();
  const modules = match[1].split(",").map((s) => s.trim()).filter((s) => s in MODULE_MAP);
  return { cleanText, modules: modules.length > 0 ? modules : null };
}

function inferModules(text: string): string[] | null {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const [mod, keywords] of Object.entries(MODULE_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      found.push(mod);
    }
  }
  return found.length > 0 ? found : null;
}

function extractArchiveDefaults(text: string): { year: string; title: string; description: string } {
  const yearMatch = text.match(/(19|20)\d{2}/);
  const year = yearMatch ? yearMatch[0] : "";
  const sentences = text.replace(/[。！？\n.!?]+/g, ".").split(".").filter((s) => s.trim().length > 0);
  const title = sentences[0]?.trim().slice(0, 30) || "一段时光记忆";
  const description = sentences.slice(0, 3).join("。").slice(0, 200) || text.slice(0, 200);
  return { year, title, description };
}

function hasArchiveKeyword(text: string): boolean {
  return ARCHIVE_KEYWORDS.some((kw) => text.includes(kw));
}

/* ============================================================
   SVG 图标组件
   ============================================================ */

function CuratorHatIcon({ size = 24, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 毕业帽/策展帽 */}
      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill={color} />
      <path d="M6 9V15C6 15 8.5 19 12 19C15.5 19 18 15 18 15V9" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M2 7V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="2" cy="18" r="1.5" fill={color} />
      <path d="M20 10L22 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon({ size = 18, color = GOLD }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2L11 13" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function ModuleIcon({ type, size = 16 }: { type: string; size?: number }) {
  const s = size;
  if (type === "tv") {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M8 21H16M12 18V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="11.5" r="2" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    );
  }
  if (type === "music") {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M11 18V5L21 3V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === "net") {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M3 12H21" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  // trophy (honor)
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 3H16V13C16 15.2091 14.2091 17 12 17C9.79086 17 8 15.2091 8 13V3Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M8 5H4V9C4 10.5 5 11 6 11H8" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M16 5H20V9C20 10.5 19 11 18 11H16" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M12 17V21M9 21H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ============================================================
   主组件
   ============================================================ */

export default function CuratorChatPanel({ onArchive }: CuratorChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* 归档建议 */
  const [suggestion, setSuggestion] = useState<ArchiveSuggestion | null>(null);

  /* 归档确认表单 */
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ArchiveFormData>({
    section: "tv",
    year: "",
    title: "",
    description: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ---------- 自动滚到底部 ---------- */
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, suggestion, showForm, isLoading, scrollToBottom]);

  /* ---------- 发送消息 ---------- */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: ChatMessage = { id: genId(), role: "user", content: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInputText("");
      setIsLoading(true);
      setSuggestion(null);
      setShowForm(false);

      try {
        const historyForAI = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));
        const rawResponse = await callAI(SYSTEM_PROMPT, historyForAI, {
          maxTokens: 300,
          temperature: 0.8,
        });

        const { cleanText, modules: aiModules } = parseSuggestion(rawResponse);

        const assistantMsg: ChatMessage = {
          id: genId(),
          role: "assistant",
          content: cleanText || rawResponse,
        };
        setMessages((prev) => [...prev, assistantMsg]);

        /* 检查是否需要展示归档建议 */
        const userWantsArchive = hasArchiveKeyword(text);
        let finalModules: string[] | null = aiModules;

        if (userWantsArchive && !finalModules) {
          finalModules = inferModules(text);
        }

        if (finalModules && finalModules.length > 0) {
          setSuggestion({
            modules: finalModules,
            userText: text.trim(),
            assistantText: cleanText || rawResponse,
          });
        }
      } catch {
        const errorMsg: ChatMessage = {
          id: genId(),
          role: "assistant",
          content: "信号有些不稳，请馆长稍后再试...",
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, scrollToBottom]
  );

  /* ---------- 处理发送 ---------- */
  const handleSend = useCallback(() => {
    sendMessage(inputText);
  }, [inputText, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  /* ---------- 点击模块按钮，展示确认表单 ---------- */
  const handleModuleClick = useCallback(
    (modKey: string) => {
      if (!suggestion) return;
      const section = modKey as "bgm" | "tv" | "net" | "honor";
      const defaults = extractArchiveDefaults(suggestion.userText);
      setFormData({
        section,
        year: defaults.year,
        title: defaults.title,
        description: defaults.description,
      });
      setShowForm(true);
      setSuggestion(null);
    },
    [suggestion]
  );

  /* ---------- 确认入馆 ---------- */
  const handleConfirmArchive = useCallback(() => {
    if (!formData.title.trim()) return;
    onArchive({
      section: formData.section,
      year: formData.year,
      title: formData.title.trim(),
      description: formData.description.trim(),
    });
    setShowForm(false);

    const sectionLabel = MODULE_MAP[formData.section]?.label || formData.section;
    const successMsg: ChatMessage = {
      id: genId(),
      role: "assistant",
      content: `已将「${formData.title}」归入「${sectionLabel}」展柜，感谢馆长为博物馆增添珍贵的馆藏。`,
    };
    setMessages((prev) => [...prev, successMsg]);
  }, [formData, onArchive]);

  /* ---------- 取消归档 ---------- */
  const handleCancelArchive = useCallback(() => {
    setShowForm(false);
    setSuggestion(null);
  }, []);

  /* ---------- 暂不归档 ---------- */
  const handleDismissSuggestion = useCallback(() => {
    setSuggestion(null);
  }, []);

  /* ---------- 编辑表单字段 ---------- */
  const handleFieldChange = useCallback(
    (field: keyof ArchiveFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  /* ============================================================
     渲染
     ============================================================ */

  return (
    <>
      {/* ======== 悬浮按钮（面板关闭时显示） ======== */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            style={{
              position: "fixed",
              bottom: 28,
              left: 28,
              width: 52,
              height: 52,
              borderRadius: "50%",
              border: "none",
              background: `linear-gradient(135deg, ${GOLD}, ${VINTAGE_BROWN})`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 16px rgba(176,141,87,0.4)`,
              zIndex: 1000,
            }}
            aria-label="打开策展助理"
          >
            <CuratorHatIcon size={26} color="#fff" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ======== 聊天面板 ======== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: "fixed",
              bottom: 28,
              left: 28,
              width: 380,
              maxWidth: "calc(100vw - 24px)",
              height: 520,
              maxHeight: "calc(100vh - 60px)",
              borderRadius: 16,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: `0 8px 40px rgba(74,58,46,0.25)`,
              zIndex: 1001,
              border: `1px solid rgba(176,141,87,0.3)`,
            }}
          >
            {/* ---- Header ---- */}
            <div
              style={{
                background: `linear-gradient(135deg, ${DARK}, #3d2c2e)`,
                padding: "14px 16px 12px",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CuratorHatIcon size={28} color="#fff" />
                <div>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: 15,
                      fontWeight: 600,
                      fontFamily: "'Noto Serif SC', serif",
                      lineHeight: 1.3,
                    }}
                  >
                    策展助理
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 11,
                      fontFamily: "'PingFang SC', sans-serif",
                      lineHeight: 1.4,
                      marginTop: 2,
                    }}
                  >
                    听馆长讲过去的事
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.85)",
                  fontSize: 13,
                  fontFamily: "'PingFang SC', sans-serif",
                  padding: "4px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
                }}
              >
                合上
              </button>
            </div>

            {/* ---- 消息区域 ---- */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                background: `linear-gradient(180deg, #F5F0E8, ${PAPER})`,
              }}
            >
              {/* 空状态欢迎消息 */}
              {messages.length === 0 && !isLoading && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    gap: 12,
                    textAlign: "center",
                    padding: "20px 16px",
                  }}
                >
                  <CuratorHatIcon size={48} color={GOLD} />
                  <div
                    style={{
                      color: DARK,
                      fontSize: 15,
                      fontFamily: "'Noto Serif SC', serif",
                      lineHeight: 1.6,
                    }}
                  >
                    馆长好，我是您的策展助理
                  </div>
                  <div
                    style={{
                      color: VINTAGE_BROWN,
                      fontSize: 13,
                      fontFamily: "'PingFang SC', sans-serif",
                      lineHeight: 1.6,
                      opacity: 0.8,
                    }}
                  >
                    说说过去的故事吧，我会帮您将这些珍贵的记忆整理成馆藏展品。
                  </div>
                </div>
              )}

              {/* 消息列表 */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "10px 14px",
                      borderRadius:
                        msg.role === "user"
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                      background:
                        msg.role === "user"
                          ? `linear-gradient(135deg, ${GOLD}, #c4a060)`
                          : "rgba(255,255,255,0.95)",
                      color:
                        msg.role === "user" ? "#fff" : DARK,
                      fontSize: 14,
                      fontFamily: "'PingFang SC', sans-serif",
                      lineHeight: 1.6,
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* 归档建议卡片 */}
              <AnimatePresence>
                {suggestion && !showForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{
                      background: "rgba(255,255,255,0.95)",
                      border: `1px solid rgba(176,141,87,0.4)`,
                      borderRadius: 12,
                      padding: "12px 14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontFamily: "'PingFang SC', sans-serif",
                        color: DARK,
                        fontWeight: 500,
                      }}
                    >
                      要把这段记忆归入展柜吗？
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                      }}
                    >
                      {suggestion.modules.map((modKey) => {
                        const mod = MODULE_MAP[modKey];
                        if (!mod) return null;
                        return (
                          <button
                            key={modKey}
                            onClick={() => handleModuleClick(modKey)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "6px 12px",
                              borderRadius: 8,
                              border: `1px solid ${GOLD}`,
                              background: `rgba(176,141,87,0.08)`,
                              color: VINTAGE_BROWN,
                              fontSize: 12,
                              fontFamily: "'PingFang SC', sans-serif",
                              cursor: "pointer",
                              transition: "background 0.2s",
                              whiteSpace: "nowrap",
                            }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLButtonElement).style.background = `rgba(176,141,87,0.18)`;
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLButtonElement).style.background = `rgba(176,141,87,0.08)`;
                            }}
                          >
                            <ModuleIcon type={mod.icon} size={14} />
                            {mod.label}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={handleDismissSuggestion}
                      style={{
                        alignSelf: "flex-end",
                        background: "none",
                        border: "none",
                        color: "rgba(74,58,46,0.45)",
                        fontSize: 12,
                        fontFamily: "'PingFang SC', sans-serif",
                        cursor: "pointer",
                        padding: "2px 0",
                      }}
                    >
                      暂不归档
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 归档确认表单 */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{
                      background: "rgba(255,255,255,0.95)",
                      border: "2px solid rgba(76,175,80,0.5)",
                      borderRadius: 12,
                      padding: "14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        fontFamily: "'Noto Serif SC', serif",
                        color: DARK,
                        fontWeight: 600,
                      }}
                    >
                      请馆长确认展品信息
                    </div>

                    {/* 目标模块展示 */}
                    <div
                      style={{
                        fontSize: 12,
                        fontFamily: "'PingFang SC', sans-serif",
                        color: VINTAGE_BROWN,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "4px 8px",
                        background: `rgba(176,141,87,0.1)`,
                        borderRadius: 6,
                        width: "fit-content",
                      }}
                    >
                      <ModuleIcon type={MODULE_MAP[formData.section]?.icon || "trophy"} size={13} />
                      归入：{MODULE_MAP[formData.section]?.label || formData.section}
                    </div>

                    {/* 年份 */}
                    <FormField
                      label="年份"
                      value={formData.year}
                      onChange={(v) => handleFieldChange("year", v)}
                      placeholder="例如 2008"
                    />

                    {/* 标题 */}
                    <FormField
                      label="标题"
                      value={formData.title}
                      onChange={(v) => handleFieldChange("title", v)}
                      placeholder="给这段记忆起个名字"
                    />

                    {/* 描述 */}
                    <FormField
                      label="描述"
                      value={formData.description}
                      onChange={(v) => handleFieldChange("description", v)}
                      placeholder="记录更多细节"
                      multiline
                    />

                    {/* 按钮行 */}
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        justifyContent: "flex-end",
                        marginTop: 4,
                      }}
                    >
                      <button
                        onClick={handleCancelArchive}
                        style={{
                          padding: "6px 16px",
                          borderRadius: 8,
                          border: `1px solid rgba(74,58,46,0.2)`,
                          background: "rgba(255,255,255,0.95)",
                          color: "rgba(74,58,46,0.6)",
                          fontSize: 13,
                          fontFamily: "'PingFang SC', sans-serif",
                          cursor: "pointer",
                        }}
                      >
                        取消
                      </button>
                      <button
                        onClick={handleConfirmArchive}
                        style={{
                          padding: "6px 16px",
                          borderRadius: 8,
                          border: "none",
                          background: "#4CAF50",
                          color: "#fff",
                          fontSize: 13,
                          fontFamily: "'PingFang SC', sans-serif",
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        确认入馆
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 加载指示器 */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "10px 14px",
                        borderRadius: "16px 16px 16px 4px",
                        background: "rgba(255,255,255,0.95)",
                      }}
                    >
                      <div style={{ display: "flex", gap: 4 }}>
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: GOLD,
                            animation: "curatorDot 1.2s ease-in-out infinite",
                          }}
                        />
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: GOLD,
                            animation: "curatorDot 1.2s ease-in-out 0.2s infinite",
                          }}
                        />
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: GOLD,
                            animation: "curatorDot 1.2s ease-in-out 0.4s infinite",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontFamily: "'PingFang SC', sans-serif",
                          color: VINTAGE_BROWN,
                          opacity: 0.7,
                        }}
                      >
                        策展助理正在倾听...
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* ---- 输入栏 ---- */}
            <div
              style={{
                padding: "10px 12px",
                background: PAPER,
                borderTop: `1px solid #e8e0d4`,
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="说一段过去的时光..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.8)",
                  border: "1px solid #e8e0d4",
                  borderRadius: 10,
                  padding: "8px 12px",
                  fontSize: 14,
                  fontFamily: "'PingFang SC', sans-serif",
                  color: DARK,
                  outline: "none",
                }}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputText.trim()}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "none",
                  background: isLoading || !inputText.trim()
                    ? "rgba(176,141,87,0.3)"
                    : `linear-gradient(135deg, ${GOLD}, ${VINTAGE_BROWN})`,
                  cursor: isLoading || !inputText.trim() ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "opacity 0.2s",
                }}
              >
                <SendIcon size={16} color="#fff" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 三点动画的 keyframes */}
      <style>{`
        @keyframes curatorDot {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </>
  );
}

/* ============================================================
   FormField 子组件（可编辑的归档字段）
   ============================================================ */

function FormField({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  multiline?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          fontSize: 12,
          fontFamily: "'PingFang SC', sans-serif",
          color: "rgba(74,58,46,0.6)",
        }}
      >
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          style={{
            background: "rgba(255,255,255,0.8)",
            border: "1px solid #e8e0d4",
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 13,
            fontFamily: "'PingFang SC', sans-serif",
            color: DARK,
            outline: "none",
            resize: "none",
            lineHeight: 1.5,
          }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            background: "rgba(255,255,255,0.8)",
            border: "1px solid #e8e0d4",
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 13,
            fontFamily: "'PingFang SC', sans-serif",
            color: DARK,
            outline: "none",
          }}
        />
      )}
    </div>
  );
}
