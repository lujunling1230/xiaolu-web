import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";

/**
 * 枯木生歌 · 音乐/播客收藏馆
 *
 * 风格：米白底 + 黑胶唱片 + 嫩芽 + 音符飘出
 * 点击黑胶 → 旋转 + Web Audio 轻音乐
 * 鼠标悬停音符 → 微微跳动
 */

/* ===== 音乐/播客数据 ===== */
interface Track {
  id: number;
  title: string;
  type: "播客" | "音乐";
  desc: string;
  cover: string;
  accent: string;
}

const tracks: Track[] = [
  {
    id: 1,
    title: "《随机波动》",
    type: "播客",
    desc: "三位女性主义者的思想碰撞，关于时代、技术与身体。",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
    accent: "#c4856a",
  },
  {
    id: 2,
    title: "《无人知晓》",
    type: "播客",
    desc: "在不确定的时代，和那些勇敢的人聊聊「不知道」。",
    cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&h=200&fit=crop",
    accent: "#7a9a82",
  },
  {
    id: 3,
    title: "《Before Sunset》",
    type: "音乐",
    desc: "日落前的吉他呢喃，适合一个人散步时听。",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop",
    accent: "#a8814a",
  },
  {
    id: 4,
    title: "《文化有限》",
    type: "播客",
    desc: "三本书三个观点，读书从未如此轻盈。",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop",
    accent: "#8a7a9a",
  },
  {
    id: 5,
    title: "《River Flows in You》",
    type: "音乐",
    desc: "Yiruma 的钢琴，像溪水流过鹅卵石。",
    cover: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=200&h=200&fit=crop",
    accent: "#5f76a0",
  },
];

/* ===== Web Audio 合成轻音乐（无需音频文件） ===== */
let audioCtx: AudioContext | null = null;
let activeNodes: { osc: OscillatorNode; gain: GainNode }[] = [];

const playGentleMusic = () => {
  try {
    if (!audioCtx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioCtx = new Ctor();
    }
    const ctx = audioCtx;
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;

    // 一段温柔的五声音阶旋律（C D E G A）
    const notes = [523.25, 587.33, 659.25, 783.99, 880, 783.99, 659.25, 587.33];
    const noteDuration = 0.6;
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const startTime = now + i * noteDuration;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + noteDuration);
      activeNodes.push({ osc, gain });
    });
    // 清理已结束的节点
    setTimeout(() => { activeNodes = []; }, notes.length * noteDuration * 1000 + 500);
  } catch {
    /* 静音处理 */
  }
};

const stopMusic = () => {
  activeNodes.forEach(({ osc }) => {
    try { osc.stop(); } catch { /* 已停止 */ }
  });
  activeNodes = [];
};

/* ===== 音符 SVG ===== */
const NoteIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
    <path d="M9 17V5l8-2v12" stroke="#b08d57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="17" r="2.5" fill="#b08d57" />
    <circle cx="15" cy="15" r="2.5" fill="#b08d57" />
  </svg>
);

const MusicPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isFromFull = searchParams.get("from") === "full";
  const backPath = isFromFull ? "/life?from=full" : "/mickey";

  const [vinylSpinning, setVinylSpinning] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);
  const [hoveredNote, setHoveredNote] = useState<number | null>(null);
  const [randomTrack, setRandomTrack] = useState<Track | null>(null);

  /** 点击黑胶 → 旋转 + 播放/停止 */
  const handleVinylClick = useCallback(() => {
    if (musicPlaying) {
      stopMusic();
      setMusicPlaying(false);
      setVinylSpinning(false);
    } else {
      playGentleMusic();
      setMusicPlaying(true);
      setVinylSpinning(true);
    }
  }, [musicPlaying]);

  /** 今日推荐：随机一首 */
  const handleSurprise = useCallback(() => {
    const random = tracks[Math.floor(Math.random() * tracks.length)];
    setRandomTrack(random);
    setShowSurprise(true);
  }, []);

  /** 清理音频 */
  useEffect(() => {
    return () => stopMusic();
  }, []);

  return (
    <div className="mp-page">
      {/* 恢复系统光标 */}
      <style>{`.mp-page, .mp-page * { cursor: auto; } .mp-page button, .mp-page a, .mp-page [role="button"] { cursor: pointer; }`}</style>

      {/* 顶部返回条 */}
      <header className="mp-topbar">
        <Link to={backPath} className="mp-back">← 回到作品集</Link>
        <span className="mp-topbar-meta">Withered Wood Sings</span>
      </header>

      {/* 主视觉：黑胶 + 嫩芽 + 音符 + 树枝落下 */}
      <section className="mp-hero">
        {/* 飘动音符 */}
        <div className="mp-notes">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="mp-note"
              style={{ left: `${20 + i * 15}%`, top: `${10 + (i % 3) * 20}%` }}
              animate={hoveredNote === i ? {
                y: [0, -8, 0],
                rotate: [0, 10, -10, 0],
              } : {
                y: [0, -6, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: hoveredNote === i ? 0.4 : 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              onMouseEnter={() => setHoveredNote(i)}
              onMouseLeave={() => setHoveredNote(null)}
            >
              <NoteIcon />
            </motion.div>
          ))}
        </div>

        {/* 树枝落下 */}
        <div className="mp-branches">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`branch-${i}`}
              className="mp-branch"
              style={{
                left: `${15 + i * 35}%`,
                width: `${60 + i * 20}px`,
                animationDelay: `${i * 1.2}s`,
              }}
              initial={{ y: -100, opacity: 0, rotate: -20 + i * 15 }}
              animate={vinylSpinning ? {
                y: [-100, 20, 0],
                opacity: [0, 0.6, 0.35],
                rotate: [-20 + i * 15, -10 + i * 10, -15 + i * 12],
              } : {
                y: -100,
                opacity: 0,
              }}
              transition={{
                duration: 2.5,
                delay: i * 0.6,
                repeat: vinylSpinning ? Infinity : 0,
                repeatDelay: 4,
                ease: "easeInOut",
              }}
            >
              <svg viewBox="0 0 80 20" fill="none" style={{ width: "100%" }}>
                <path
                  d={`M0 12 Q${20 + i * 5} 4 ${40 + i * 3} 10 T80 8`}
                  stroke="#7a6a5a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.5"
                />
                <circle cx={20 + i * 5} cy={6} r="2" fill="#8aaa7a" opacity="0.6" />
                <circle cx={50 + i * 3} cy={8} r="1.5" fill="#9aba8a" opacity="0.5" />
              </svg>
            </motion.div>
          ))}
        </div>

        {/* 黑胶唱片 + 嫩芽 */}
        <motion.div
          className="mp-vinyl-wrap"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <button
            className={`mp-vinyl ${vinylSpinning ? "mp-vinyl-spinning" : ""}`}
            onClick={handleVinylClick}
            aria-label={musicPlaying ? "停止音乐" : "播放音乐"}
          >
            {/* 唱片纹路 */}
            <span className="mp-vinyl-grooves" />
            <span className="mp-vinyl-grooves mp-vinyl-grooves-2" />
            {/* 中心标签 */}
            <span className="mp-vinyl-label">
              <span className="mp-vinyl-label-text">枯木生歌</span>
            </span>
            {/* 中心孔 */}
            <span className="mp-vinyl-hole" />
          </button>

          {/* 嫩芽从唱片中心长出 */}
          <motion.div
            className="mp-sprout"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: vinylSpinning ? 1 : 0.3, opacity: vinylSpinning ? 1 : 0.4 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <svg viewBox="0 0 40 80" width="32" height="64" fill="none">
              {/* 茎 */}
              <path d="M20 80 Q22 50 20 30 Q18 20 20 10" stroke="#7a9a6a" strokeWidth="2" strokeLinecap="round" />
              {/* 左叶 */}
              <path d="M20 40 Q10 35 6 28 Q12 32 20 40" fill="#8aaa7a" />
              {/* 右叶 */}
              <path d="M20 28 Q30 23 34 16 Q28 20 20 28" fill="#9aba8a" />
              {/* 顶芽 */}
              <ellipse cx="20" cy="8" rx="4" ry="6" fill="#a8ca8a" />
            </svg>
          </motion.div>
        </motion.div>

        {/* 标题 */}
        <motion.h1
          className="mp-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          枯木生歌
        </motion.h1>
        <motion.p
          className="mp-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          大地的诗歌从未消亡。
        </motion.p>
        <motion.p
          className="mp-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {musicPlaying ? "♪ 正在播放 · 再次点击停止" : "点击黑胶 · 听枯木唱歌"}
        </motion.p>
      </section>

      {/* 音乐/播客卡片 */}
      <section className="mp-tracks">
        <motion.h2
          className="mp-section-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          收藏夹
        </motion.h2>
        <div className="mp-track-grid">
          {tracks.map((track, i) => (
            <motion.article
              key={track.id}
              className="mp-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6 }}
              style={{ "--card-accent": track.accent } as React.CSSProperties}
            >
              <div className="mp-card-cover-wrap">
                <img src={track.cover} alt={track.title} className="mp-card-cover" loading="lazy" />
                <span className="mp-card-type">{track.type}</span>
              </div>
              <div className="mp-card-body">
                <h3 className="mp-card-title">{track.title}</h3>
                <p className="mp-card-desc">{track.desc}</p>
              </div>
              <span className="mp-card-accent-bar" />
            </motion.article>
          ))}
        </div>
      </section>

      {/* 右下角彩蛋：今日推荐 */}
      <button className="mp-surprise-btn" onClick={handleSurprise}>
        🎲 播放今日推荐
      </button>

      <AnimatePresence>
        {showSurprise && randomTrack && (
          <motion.div
            className="mp-surprise-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSurprise(false)}
          >
            <motion.div
              className="mp-surprise-card"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="mp-surprise-label">今日推荐</p>
              <img src={randomTrack.cover} alt={randomTrack.title} className="mp-surprise-cover" />
              <h3 className="mp-surprise-title">{randomTrack.title}</h3>
              <p className="mp-surprise-desc">{randomTrack.desc}</p>
              <button
                className="mp-surprise-play"
                onClick={() => {
                  if (!musicPlaying) handleVinylClick();
                  setShowSurprise(false);
                }}
              >
                ♪ 播放
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 页脚 */}
      <footer className="mp-foot">
        <span>这不是播放器，是收藏夹</span>
        <span className="mp-foot-dot">·</span>
        <span>一个人的精神角落</span>
      </footer>

      <style>{`
        /* ===== 基础 ===== */
        .mp-page {
          position: relative;
          min-height: 100vh;
          background: #FFF8F5;
          color: #3a3a3a;
          font-family: "Noto Sans SC", system-ui, -apple-system, sans-serif;
          overflow-x: hidden;
        }

        /* ===== 顶部返回条 ===== */
        .mp-topbar {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 28px;
          background: rgba(255, 248, 245, 0.8);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .mp-back {
          font-size: 13px; color: #888; text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease;
        }
        .mp-back:hover { color: #b08d57; }
        .mp-topbar-meta {
          font-size: 10px; color: #bbb; letter-spacing: 0.28em; text-transform: uppercase;
        }

        /* ===== 主视觉 ===== */
        .mp-hero {
          position: relative;
          text-align: center;
          padding: 60px 20px 50px;
          overflow: hidden;
        }

        /* 飘动音符 */
        .mp-notes {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
        }
        .mp-note {
          position: absolute; pointer-events: auto;
          opacity: 0.4;
        }

        /* 树枝落下 */
        .mp-branches {
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          overflow: hidden;
        }
        .mp-branch {
          position: absolute;
          top: 0;
          pointer-events: none;
        }

        /* 黑胶唱片 */
        .mp-vinyl-wrap {
          position: relative;
          display: inline-flex; flex-direction: column; align-items: center;
          margin-bottom: 24px; z-index: 1;
        }
        .mp-vinyl {
          position: relative;
          width: 180px; height: 180px; border-radius: 50%;
          border: none; padding: 0;
          background: radial-gradient(circle at 50% 50%, #2a2a2a 0%, #1a1a1a 30%, #0d0d0d 100%);
          box-shadow: 0 12px 36px -8px rgba(0,0,0,0.3),
                      0 0 0 1px rgba(0,0,0,0.1),
                      inset 0 0 20px rgba(0,0,0,0.4);
          transition: transform 0.3s ease;
        }
        .mp-vinyl:hover { transform: scale(1.03); }
        .mp-vinyl-spinning {
          animation: mp-vinyl-rotate 6s linear infinite;
        }
        @keyframes mp-vinyl-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* 唱片纹路 */
        .mp-vinyl-grooves {
          position: absolute; inset: 10px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.04);
        }
        .mp-vinyl-grooves-2 {
          inset: 20px;
          border: 1px solid rgba(255,255,255,0.03);
        }

        /* 中心标签 */
        .mp-vinyl-label {
          position: absolute;
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 70px; height: 70px; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #c4856a, #a06550);
          display: flex; align-items: center; justify-content: center;
          box-shadow: inset 0 0 8px rgba(0,0,0,0.2);
        }
        .mp-vinyl-label-text {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 10px; color: #fff8f0;
          letter-spacing: 0.1em; opacity: 0.9;
        }

        /* 中心孔 */
        .mp-vinyl-hole {
          position: absolute;
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 8px; height: 8px; border-radius: 50%;
          background: #FFF8F5;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.2);
        }

        /* 嫩芽 */
        .mp-sprout {
          position: absolute;
          top: -30px; left: 50%; transform: translateX(-50%);
          transform-origin: bottom center;
          z-index: 2;
          pointer-events: none;
        }

        /* 标题 */
        .mp-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(32px, 5vw, 44px); font-weight: 700;
          color: #4a3a30; margin: 0 0 12px; letter-spacing: 0.12em;
          position: relative; z-index: 1;
        }
        .mp-tagline {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px; color: #8a7a6a; margin: 0 0 10px;
          letter-spacing: 0.06em; position: relative; z-index: 1;
        }
        .mp-hint {
          font-size: 12px; color: #b09a8a; margin: 0;
          letter-spacing: 0.04em; position: relative; z-index: 1;
        }

        /* ===== 收藏夹卡片 ===== */
        .mp-tracks {
          max-width: 960px; margin: 0 auto;
          padding: 20px 24px 60px;
        }
        .mp-section-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 22px; font-weight: 600; color: #5a4a3a;
          text-align: center; margin: 0 0 32px;
          letter-spacing: 0.1em;
        }
        .mp-track-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        .mp-card {
          position: relative;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 16px -6px rgba(0,0,0,0.08);
          transition: box-shadow 0.3s ease;
        }
        .mp-card:hover {
          box-shadow: 0 8px 28px -8px rgba(0,0,0,0.12);
        }
        .mp-card-cover-wrap {
          position: relative; width: 100%; aspect-ratio: 16/10;
          overflow: hidden; background: #f0ebe5;
        }
        .mp-card-cover {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.5s ease;
        }
        .mp-card:hover .mp-card-cover { transform: scale(1.05); }
        .mp-card-type {
          position: absolute; top: 10px; left: 10px;
          padding: 3px 10px; font-size: 10px; border-radius: 999px;
          background: rgba(255,255,255,0.9); color: var(--card-accent, #888);
          backdrop-filter: blur(4px); letter-spacing: 0.06em;
        }
        .mp-card-body { padding: 16px 18px 20px; }
        .mp-card-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 16px; font-weight: 600; color: #4a3a30;
          margin: 0 0 8px; letter-spacing: 0.02em;
        }
        .mp-card-desc {
          font-size: 12px; line-height: 1.7; color: #8a7a6a; margin: 0;
        }
        .mp-card-accent-bar {
          position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
          background: var(--card-accent, #b08d57);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.3s ease;
        }
        .mp-card:hover .mp-card-accent-bar { transform: scaleX(1); }

        /* ===== 彩蛋按钮 ===== */
        .mp-surprise-btn {
          position: fixed; bottom: 24px; right: 24px; z-index: 40;
          padding: 10px 20px; font-size: 13px;
          font-family: "Noto Sans SC", sans-serif;
          color: #fff; background: #4a3a30; border: none; border-radius: 999px;
          cursor: pointer; letter-spacing: 0.04em;
          box-shadow: 0 6px 20px -4px rgba(74,58,48,0.4);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .mp-surprise-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px -4px rgba(74,58,48,0.5);
        }

        /* ===== 推荐弹窗 ===== */
        .mp-surprise-modal {
          position: fixed; inset: 0; z-index: 100;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
          padding: 20px;
        }
        .mp-surprise-card {
          background: #fff; border-radius: 20px; padding: 28px;
          max-width: 320px; text-align: center;
          box-shadow: 0 20px 60px -10px rgba(0,0,0,0.3);
        }
        .mp-surprise-label {
          font-size: 11px; color: #b08d57; letter-spacing: 0.2em;
          text-transform: uppercase; margin: 0 0 16px;
        }
        .mp-surprise-cover {
          width: 120px; height: 120px; border-radius: 50%; object-fit: cover;
          margin: 0 auto 16px; display: block;
          box-shadow: 0 8px 24px -6px rgba(0,0,0,0.2);
        }
        .mp-surprise-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 18px; font-weight: 600; color: #4a3a30;
          margin: 0 0 8px;
        }
        .mp-surprise-desc {
          font-size: 12px; color: #8a7a6a; line-height: 1.6; margin: 0 0 20px;
        }
        .mp-surprise-play {
          padding: 10px 28px; font-size: 13px;
          color: #fff; background: #4a3a30; border: none; border-radius: 999px;
          cursor: pointer; letter-spacing: 0.06em;
          transition: transform 0.2s ease;
        }
        .mp-surprise-play:hover { transform: scale(1.05); }

        /* ===== 页脚 ===== */
        .mp-foot {
          text-align: center; padding: 24px;
          font-size: 11px; color: #b0a090; letter-spacing: 0.08em;
        }
        .mp-foot-dot { margin: 0 8px; opacity: 0.5; }

        /* ===== 移动端 ===== */
        @media (max-width: 768px) {
          .mp-vinyl { width: 140px; height: 140px; }
          .mp-vinyl-label { width: 54px; height: 54px; }
          .mp-vinyl-label-text { font-size: 8px; }
          .mp-track-grid { grid-template-columns: 1fr; }
          .mp-surprise-btn { bottom: 16px; right: 16px; padding: 8px 16px; font-size: 12px; }
        }
      `}</style>
    </div>
  );
};

export default MusicPage;
