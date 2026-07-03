import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { callAI } from "../../utils/aiClient";
import { CHARACTERS, getCharacter, detectGroupChat, NEW_ROOMMATE, type Character } from "../../data/characters";

/**
 * 爱情公寓·元宇宙客厅
 *
 * 3601 / 3602 / 3603 —— 全员 AI 在线插科打诨
 * 第 8 位房客（你）住在 3603，随时呼叫任意房客解决人生 Bug。
 */

/* ============================================================
   类型定义
   ============================================================ */
interface ChatMessage {
  id: string;
  role: "user" | "character";
  characterId?: string;
  content: string;
  timestamp: number;
}

type ViewMode = "lobby" | "chat" | "groupchat";

/* ============================================================
   Web Audio：连线音 + 收到回复音
   ============================================================ */
let audioCtx: AudioContext | null = null;
const getCtx = () => {
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new Ctor();
  }
  return audioCtx;
};

/** 连线音：拨号/呼叫的"嘟"声 */
const playDial = () => {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now + i * 0.4);
      gain.gain.setValueAtTime(0.08, now + i * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.4 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.4);
      osc.stop(now + i * 0.4 + 0.2);
    }
  } catch { /* 静音 */ }
};

/** 接通音：清脆"叮" */
const playConnect = () => {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1318, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  } catch { /* 静音 */ }
};

/** 群聊提示音：轻快的和弦 */
const playGroupBell = () => {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.06, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.3);
    });
  } catch { /* 静音 */ }
};

/* ============================================================
   工具函数
   ============================================================ */
const uid = () => Math.random().toString(36).slice(2, 10);

/* ============================================================
   子组件：角色头像卡片
   ============================================================ */
const CharacterCard: React.FC<{
  char: Character;
  onClick: () => void;
  index: number;
}> = ({ char, onClick, index }) => (
  <motion.button
    className="apt-char-card"
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
    whileHover={{ y: -6, scale: 1.03, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    style={{
      background: char.bgColor,
      borderColor: `${char.color}30`,
    } as React.CSSProperties}
  >
    <div
      className="apt-char-emoji"
      style={{ background: `${char.color}15`, color: char.color }}
    >
      {char.emoji}
    </div>
    <div className="apt-char-info">
      <span className="apt-char-name" style={{ color: char.color }}>
        {char.name}
      </span>
      <span className="apt-char-title">{char.title}</span>
      <span className="apt-char-room">{char.room}</span>
    </div>
    <div className="apt-char-freq" style={{ color: `${char.color}80` }}>
      {char.ui.freq}
    </div>
  </motion.button>
);

/* ============================================================
   子组件：单条消息气泡
   ============================================================ */
const ChatBubble: React.FC<{
  msg: ChatMessage;
  char?: Character;
}> = ({ msg, char }) => {
  const isUser = msg.role === "user";
  return (
    <motion.div
      className={`apt-bubble ${isUser ? "apt-bubble-user" : "apt-bubble-char"}`}
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {!isUser && char && (
        <div className="apt-bubble-avatar" style={{ background: `${char.color}20`, color: char.color }}>
          {char.emoji}
        </div>
      )}
      <div
        className="apt-bubble-body"
        style={
          isUser
            ? { background: "#3a342c", color: "#e8e4dc" }
            : { background: char ? `${char.color}12` : "#2a2620", color: "#e0dcd2" }
        }
      >
        {!isUser && char && (
          <span className="apt-bubble-name" style={{ color: char.color }}>
            {char.name}
          </span>
        )}
        <div className="apt-bubble-text">
          {msg.content.split("\n").map((line, i) =>
            line.trim() ? <p key={i}>{line}</p> : <br key={i} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ============================================================
   主组件
   ============================================================ */
const SystemTuningPage: React.FC = () => {
  const [view, setView] = useState<ViewMode>("lobby");
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [groupTyping, setGroupTyping] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedChar = selectedCharId ? getCharacter(selectedCharId) : undefined;

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, []);

  /** 进入单个角色聊天 */
  const enterChat = (charId: string) => {
    playDial();
    setSelectedCharId(charId);
    setMessages([]);
    setInputText("");
    setView("chat");
    setTimeout(() => playConnect(), 400);
  };

  /** 返回客厅 */
  const backToLobby = () => {
    setView("lobby");
    setSelectedCharId(null);
    setMessages([]);
    setInputText("");
    setGroupTyping(null);
  };

  /** 发送消息（单聊或触发群聊） */
  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);
    scrollToBottom();

    // 检测是否触发群聊
    const groupChars = detectGroupChat(text);

    if (groupChars && groupChars.length > 0) {
      // ===== 群聊模式 =====
      setView("groupchat");
      playGroupBell();

      for (const charId of groupChars) {
        const char = getCharacter(charId);
        if (!char) continue;
        setGroupTyping(char.name);
        scrollToBottom();

        // 构建上下文：用户问题 + 之前的群聊回复
        const context = messages
          .filter((m) => m.role === "character")
          .slice(-2)
          .map((m) => `${getCharacter(m.characterId!)?.name}说：${m.content}`)
          .join("\n");

        const fullPrompt = context
          ? `${char.systemPrompt}\n\n当前群聊上下文：\n${context}\n\n现在轮到你了，请接上话。`
          : char.systemPrompt;

        const reply = await callAI(fullPrompt, text, { maxTokens: 180 });

        const charMsg: ChatMessage = {
          id: uid(),
          role: "character",
          characterId: charId,
          content: reply,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, charMsg]);
        playConnect();
        scrollToBottom();
        await new Promise((r) => setTimeout(r, 600)); // 角色之间停顿
      }

      setGroupTyping(null);
      setIsLoading(false);
    } else if (selectedChar) {
      // ===== 单聊模式 =====
      const reply = await callAI(selectedChar.systemPrompt, text, { maxTokens: 200 });

      const charMsg: ChatMessage = {
        id: uid(),
        role: "character",
        characterId: selectedChar.id,
        content: reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, charMsg]);
      playConnect();
      scrollToBottom();
      setIsLoading(false);
    }
  };

  return (
    <div className="apt-page">
      {/* ===== 顶部导航 ===== */}
      <header className="apt-topbar">
        <Link to="/mickey" className="apt-back">
          ← 回到妙妙工具箱
        </Link>
        {view !== "lobby" && (
          <button className="apt-back apt-back-ghost" onClick={backToLobby}>
            ← 回到客厅
          </button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {/* ===== 客厅大厅 ===== */}
        {view === "lobby" && (
          <motion.div
            key="lobby"
            className="apt-lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* 标题区 */}
            <section className="apt-hero">
              <motion.div
                className="apt-hero-badge"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                🏠 3601 · 3602 · 3603
              </motion.div>
              <motion.h1
                className="apt-hero-title"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                爱情公寓·元宇宙客厅
              </motion.h1>
              <motion.p
                className="apt-hero-sub"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
              >
                你住在 {NEW_ROOMMATE.room}，{NEW_ROOMMATE.title}。
                <br />
                点击任意房客，开始插科打诨、解决人生 Bug。
              </motion.p>
            </section>

            {/* 角色网格 */}
            <section className="apt-chars">
              {CHARACTERS.map((char, i) => (
                <CharacterCard
                  key={char.id}
                  char={char}
                  index={i}
                  onClick={() => enterChat(char.id)}
                />
              ))}
            </section>

            {/* 群聊提示 */}
            <motion.p
              className="apt-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              💡 试试输入"今晚吃什么""加班""没钱"等关键词，触发多人群聊接力
            </motion.p>
          </motion.div>
        )}

        {/* ===== 聊天界面（单聊 / 群聊共用） ===== */}
        {(view === "chat" || view === "groupchat") && selectedChar && (
          <motion.div
            key="chat"
            className="apt-chat"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {/* 聊天头部 */}
            <div
              className="apt-chat-header"
              style={{ borderBottomColor: `${selectedChar.color}25` }}
            >
              <div className="apt-chat-header-left">
                <span
                  className="apt-chat-emoji"
                  style={{ background: `${selectedChar.color}18`, color: selectedChar.color }}
                >
                  {selectedChar.emoji}
                </span>
                <div className="apt-chat-header-info">
                  <span className="apt-chat-name" style={{ color: selectedChar.color }}>
                    {view === "groupchat" ? "群聊模式" : selectedChar.ui.stationTitle}
                  </span>
                  <span className="apt-chat-meta">
                    {view === "groupchat"
                      ? "多人接力吐槽中…"
                      : `${selectedChar.name} · ${selectedChar.room} · ${selectedChar.ui.freq}`}
                  </span>
                </div>
              </div>
              <div
                className="apt-chat-status"
                style={{ color: isLoading ? "#d4a85a" : "#6a9a7a" }}
              >
                {isLoading ? "◉ 连线中…" : "● 在线"}
              </div>
            </div>

            {/* 消息列表 */}
            <div className="apt-chat-scroll" ref={scrollRef}>
              {messages.length === 0 && (
                <div className="apt-chat-empty">
                  <span className="apt-chat-empty-emoji">{selectedChar.emoji}</span>
                  <p className="apt-chat-empty-text">
                    {selectedChar.catchphrase}
                  </p>
                  <p className="apt-chat-empty-hint">
                    {selectedChar.ui.placeholder}
                  </p>
                </div>
              )}
              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  msg={msg}
                  char={msg.characterId ? getCharacter(msg.characterId) : undefined}
                />
              ))}
              {groupTyping && (
                <motion.div
                  className="apt-typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="apt-typing-dot" />
                  <span className="apt-typing-dot" />
                  <span className="apt-typing-dot" />
                  <span className="apt-typing-name">{groupTyping} 正在输入…</span>
                </motion.div>
              )}
            </div>

            {/* 输入区 */}
            <div className="apt-chat-inputbar">
              <textarea
                className="apt-chat-input"
                placeholder={selectedChar.ui.placeholder}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                rows={2}
                disabled={isLoading}
              />
              <button
                className="apt-chat-send"
                onClick={sendMessage}
                disabled={!inputText.trim() || isLoading}
                style={
                  {
                    background: selectedChar.color,
                    opacity: !inputText.trim() || isLoading ? 0.4 : 1,
                  } as React.CSSProperties
                }
              >
                {isLoading ? "发送中…" : "发送"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .apt-page {
          min-height: 100vh;
          background:
            radial-gradient(120% 80% at 50% 0%, #2a2620 0%, #1c1916 50%, #14110f 100%);
          color: #e8e4dc;
          font-family: "Noto Sans SC", system-ui, sans-serif;
          padding: 0 24px 60px;
        }
        .apt-page * { cursor: auto; }
        .apt-page a, .apt-page button { cursor: pointer; }
        .apt-page textarea { cursor: text; }

        /* ===== 顶部导航 ===== */
        .apt-topbar {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 720px; margin: 0 auto; padding: 24px 4px 0;
          gap: 12px;
        }
        .apt-back {
          font-size: 14px; color: #8a8478; text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease, transform 0.25s ease;
          background: none; border: none; padding: 0;
        }
        .apt-back:hover { color: #d4a85a; transform: translateX(-3px); }
        .apt-back-ghost { color: #6a6258; }
        .apt-back-ghost:hover { color: #9a9488; }

        /* ===== 客厅大厅 ===== */
        .apt-lobby {
          max-width: 720px; margin: 0 auto;
        }
        .apt-hero {
          text-align: center; padding: 32px 0 36px;
        }
        .apt-hero-badge {
          display: inline-block; padding: 6px 16px; border-radius: 999px;
          font-size: 13px; color: #d4a85a;
          background: rgba(212,168,90,0.08); border: 1px solid rgba(212,168,90,0.2);
          letter-spacing: 0.06em; margin-bottom: 18px;
        }
        .apt-hero-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(26px, 4.5vw, 38px); font-weight: 600;
          color: #e8e4dc; margin: 0 0 12px; letter-spacing: 0.06em;
        }
        .apt-hero-sub {
          font-size: 14px; color: #9a9488; margin: 0; line-height: 1.8;
          letter-spacing: 0.03em;
        }

        /* 角色网格 */
        .apt-chars {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }
        .apt-char-card {
          display: flex; flex-direction: column; align-items: center;
          padding: 20px 14px; border-radius: 16px;
          border: 1px solid;
          background: linear-gradient(160deg, rgba(255,255,255,0.03), transparent);
          transition: box-shadow 0.3s ease;
          text-align: center;
        }
        .apt-char-card:hover {
          box-shadow: 0 8px 24px -8px rgba(0,0,0,0.4);
        }
        .apt-char-emoji {
          width: 52px; height: 52px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; margin-bottom: 12px;
        }
        .apt-char-info {
          display: flex; flex-direction: column; gap: 3px;
        }
        .apt-char-name {
          font-size: 15px; font-weight: 600; letter-spacing: 0.03em;
        }
        .apt-char-title {
          font-size: 11px; color: #8a8478; letter-spacing: 0.04em;
        }
        .apt-char-room {
          font-size: 10px; color: #5a5448; letter-spacing: 0.08em;
          margin-top: 2px;
        }
        .apt-char-freq {
          font-size: 11px; font-family: "Courier New", monospace;
          letter-spacing: 0.06em; margin-top: 8px;
        }

        .apt-hint {
          text-align: center; font-size: 12px; color: #6a6258;
          letter-spacing: 0.03em; padding: 8px 16px;
        }

        /* ===== 聊天界面 ===== */
        .apt-chat {
          max-width: 640px; margin: 0 auto;
          display: flex; flex-direction: column;
          height: calc(100vh - 80px);
          min-height: 500px;
        }
        .apt-chat-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 4px; border-bottom: 1px solid;
          flex-shrink: 0;
        }
        .apt-chat-header-left {
          display: flex; align-items: center; gap: 12px;
        }
        .apt-chat-emoji {
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .apt-chat-header-info {
          display: flex; flex-direction: column; gap: 2px;
        }
        .apt-chat-name {
          font-size: 15px; font-weight: 600; letter-spacing: 0.03em;
        }
        .apt-chat-meta {
          font-size: 11px; color: #6a6258; letter-spacing: 0.04em;
        }
        .apt-chat-status {
          font-size: 11px; letter-spacing: 0.08em;
          font-family: "Courier New", monospace;
        }

        /* 消息滚动区 */
        .apt-chat-scroll {
          flex: 1; overflow-y: auto; padding: 20px 4px;
          display: flex; flex-direction: column; gap: 14px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.08) transparent;
        }
        .apt-chat-scroll::-webkit-scrollbar { width: 4px; }
        .apt-chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.08); border-radius: 2px;
        }

        .apt-chat-empty {
          text-align: center; padding: 40px 20px; margin: auto 0;
        }
        .apt-chat-empty-emoji { font-size: 48px; display: block; margin-bottom: 14px; }
        .apt-chat-empty-text {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 18px; color: #d4a85a; margin: 0 0 8px;
          letter-spacing: 0.04em;
        }
        .apt-chat-empty-hint {
          font-size: 13px; color: #6a6258; margin: 0; line-height: 1.6;
        }

        /* 消息气泡 */
        .apt-bubble {
          display: flex; align-items: flex-end; gap: 8px;
          max-width: 85%;
        }
        .apt-bubble-user {
          align-self: flex-end; flex-direction: row-reverse;
        }
        .apt-bubble-char {
          align-self: flex-start;
        }
        .apt-bubble-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0; margin-bottom: 4px;
        }
        .apt-bubble-body {
          padding: 12px 16px; border-radius: 16px;
          font-size: 14px; line-height: 1.75;
          word-break: break-word;
        }
        .apt-bubble-user .apt-bubble-body {
          border-bottom-right-radius: 4px;
        }
        .apt-bubble-char .apt-bubble-body {
          border-bottom-left-radius: 4px;
        }
        .apt-bubble-name {
          display: block; font-size: 11px; font-weight: 600;
          margin-bottom: 4px; letter-spacing: 0.04em;
        }
        .apt-bubble-text { margin: 0; }
        .apt-bubble-text p { margin: 0; }

        /* 输入中动画 */
        .apt-typing {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 12px; align-self: flex-start;
        }
        .apt-typing-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #6a6258; animation: apt-typing-bounce 1.2s infinite ease-in-out;
        }
        .apt-typing-dot:nth-child(2) { animation-delay: 0.15s; }
        .apt-typing-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes apt-typing-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        .apt-typing-name {
          font-size: 11px; color: #6a6258; margin-left: 4px;
          letter-spacing: 0.04em;
        }

        /* 输入区 */
        .apt-chat-inputbar {
          display: flex; gap: 10px; padding: 12px 4px 0;
          border-top: 1px solid #2a241e;
          flex-shrink: 0;
        }
        .apt-chat-input {
          flex: 1; background: #1a1714; border: 1px solid #2a241e;
          border-radius: 12px; padding: 10px 14px; color: #d8d4cc;
          font-size: 14px; line-height: 1.6; resize: none; outline: none;
          font-family: inherit;
        }
        .apt-chat-input::placeholder { color: #5a5448; }
        .apt-chat-input:focus { border-color: #3a342c; }
        .apt-chat-input:disabled { opacity: 0.5; }
        .apt-chat-send {
          padding: 10px 20px; border: none; border-radius: 12px;
          font-size: 14px; font-weight: 600; color: #1c1916;
          font-family: inherit; letter-spacing: 0.06em;
          transition: opacity 0.2s ease, transform 0.2s ease;
          flex-shrink: 0; align-self: flex-end;
        }
        .apt-chat-send:hover:not(:disabled) { transform: translateY(-1px); }
        .apt-chat-send:disabled { cursor: not-allowed; }

        /* ===== 移动端 ===== */
        @media (max-width: 520px) {
          .apt-page { padding: 0 16px 40px; }
          .apt-chars {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .apt-char-card { padding: 16px 10px; }
          .apt-char-emoji { width: 44px; height: 44px; font-size: 22px; }
          .apt-char-name { font-size: 14px; }
          .apt-chat { height: calc(100vh - 72px); min-height: 400px; }
          .apt-bubble { max-width: 92%; }
          .apt-bubble-body { padding: 10px 12px; font-size: 13px; }
          .apt-chat-inputbar { padding: 10px 0 0; }
          .apt-chat-send { padding: 8px 14px; font-size: 13px; }
        }
      `}</style>
    </div>
  );
};

export default SystemTuningPage;
