/**
 * 时光放映厅 · Time Theater
 *
 * 时光博物馆的怀旧放映厅 —— 复古 TCL 银灰 CRT 电视 + 白色 MP3 播放器 + 遥控器。
 * 设计理念：走进 2000 年代中国家庭客厅，电视是主角，MP3 是可爱配角。
 *
 * 视觉元素：
 *   - TCL 品牌银灰 CRT 电视（侧面音箱格栅、底部控制面板、弧面屏幕）
 *   - 白色 MP3 播放器（圆形点按轮盘、彩色 LCD 屏幕显示歌词）
 *   - 虚拟遥控器（频道/音量/菜单按钮）
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ============================================================
   Types
   ============================================================ */

export interface TimeTheaterProps {
  tvCards: Array<{
    id: string;
    year: string;
    title: string;
    description: string;
    imageUrl?: string;
    musicLink?: string;
  }>;
  bgmCards: Array<{
    id: string;
    year: string;
    title: string;
    description: string;
    imageUrl?: string;
    musicLink?: string;
  }>;
  onEdit?: (card: any, type: "tv" | "bgm") => void;
}

/* ============================================================
   Helpers
   ============================================================ */

/** Deterministic pseudo-random from string seed (0..1) */
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }
  return Math.abs(Math.sin(hash + 1)) % 1;
}

/** Play a low-frequency boot-up hum */
function playBootSound(): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 1.5);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.5);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
    osc.onended = () => ctx.close();
  } catch { /* silent */ }
}

/** Play a brief "beep" sound for volume/button feedback */
function playBeepSound(): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
    osc.onended = () => ctx.close();
  } catch { /* silent */ }
}

/** Play a brief "click" sound using Web Audio API */
function playClickSound(): void {
  try {
    const ctx = new AudioContext();
    const duration = 0.05;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    source.onended = () => {
      ctx.close();
    };
  } catch {
    // Web Audio API 不可用时静默失败
  }
}

/* ============================================================
   Component
   ============================================================ */

const TimeTheater: React.FC<TimeTheaterProps> = ({ tvCards, bgmCards, onEdit }) => {
  /* ---- state ---- */
  const [tvOn, setTvOn] = useState(true);
  const [bootPhase, setBootPhase] = useState<"off" | "warming" | "static" | "ready">("off");
  const [currentChannel, setCurrentChannel] = useState(0);
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchDirection, setSwitchDirection] = useState<1 | -1>(1);
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  const switchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- derived ---- */
  const totalChannels = tvCards.length;
  const safeChannel = totalChannels > 0 ? currentChannel % totalChannels : 0;
  const currentCard = totalChannels > 0 ? tvCards[safeChannel] : null;
  const currentBgm = bgmCards.length > 0 ? bgmCards[currentSong % bgmCards.length] : null;
  const formatType = currentCard ? (seededRandom(currentCard.id) > 0.5 ? "VCD" : "DVD") : "VCD";

  /* ---- boot-up sequence (runs once on mount) ---- */
  useEffect(() => {
    const t1 = setTimeout(() => setBootPhase("warming"), 500);
    const t2 = setTimeout(() => {
      setBootPhase("static");
      playBootSound();
    }, 500 + 800);
    const t3 = setTimeout(() => setBootPhase("ready"), 500 + 800 + 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  /* ---- cleanup timer on unmount ---- */
  useEffect(() => {
    return () => {
      if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
    };
  }, []);

  /* ---- channel switch ---- */
  const switchChannel = useCallback(
    (direction: 1 | -1) => {
      if (!tvOn || isSwitching || totalChannels === 0) return;
      playClickSound();
      setSwitchDirection(direction);
      setIsSwitching(true);

      if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
      switchTimerRef.current = setTimeout(() => {
        setCurrentChannel((prev) => {
          let next = prev + direction;
          if (next < 0) next = totalChannels - 1;
          if (next >= totalChannels) next = 0;
          return next;
        });
        setIsSwitching(false);
      }, 800);
    },
    [tvOn, isSwitching, totalChannels]
  );

  /* ---- song control ---- */
  const prevSong = useCallback(() => {
    setCurrentSong((prev) => {
      const len = bgmCards.length;
      if (len === 0) return 0;
      return (prev - 1 + len) % len;
    });
  }, [bgmCards.length]);

  const nextSong = useCallback(() => {
    setCurrentSong((prev) => {
      const len = bgmCards.length;
      if (len === 0) return 0;
      return (prev + 1) % len;
    });
  }, [bgmCards.length]);

  const togglePlay = useCallback(() => {
    if (bgmCards.length === 0) return;
    setIsPlaying((prev) => !prev);
    setShowLyrics(true);
    // 如果有音乐链接且要播放，则打开
    const song = bgmCards[currentSong % bgmCards.length];
    if (song?.musicLink && !isPlaying) {
      window.open(song.musicLink, "_blank", "noopener,noreferrer");
    }
  }, [bgmCards, currentSong, isPlaying]);

  /* ============================================================
     Render
     ============================================================ */

  return (
    <div className="time-theater">
      <style>{CSS}</style>

      {/* ======== Title ======== */}
      <h2 className="tt-title">时光放映厅</h2>

      {/* ======== TV + MP3 Layout ======== */}
      <div className="tt-stage">
        {/* ======== CRT TV ======== */}
        <div className={`tt-tv-shell${tvOn ? " tv-on" : ""}`}>
          {/* Scratch / wear texture overlay */}
          <div className="tt-tv-texture" />

          {/* Left speaker grille */}
          <div className="tt-tv-speaker tt-tv-speaker-left" />

          {/* Center: screen + controls */}
          <div className="tt-tv-center">
            {/* Screen */}
            <div className={`tt-tv-screen ${tvOn ? "" : "tt-tv-off"}`}>
              {/* CRT curvature overlay */}
              <div className="tt-crt-curve" />

              {/* Scanline overlay */}
              <div className="tt-scanlines" />

              {/* Boot phase: off (black screen) */}
              {bootPhase === "off" && <div style={{ position: "absolute", inset: 0, zIndex: 20, background: "#000" }} />}

              {/* Boot phase: warming glow */}
              {bootPhase === "warming" && <div className="tt-screen-warming" />}

              {/* Boot phase: static/snow */}
              {bootPhase === "static" && (
                <div className="tt-static" style={{ animationDuration: "0.15s" }} />
              )}

              {/* Normal content (only when ready) */}
              {tvOn && bootPhase === "ready" && (
                <>
                  {/* Channel indicator */}
                  {!isSwitching && (
                    <div className="tt-ch-indicator">
                      CH-{String(safeChannel + 1).padStart(2, "0")} / {String(totalChannels).padStart(2, "0")}
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {isSwitching ? (
                      <motion.div
                        key="static"
                        className="tt-static"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "linear" }}
                      />
                    ) : currentCard ? (
                      <motion.div
                        key={currentCard.id}
                        className="tt-card"
                        initial={{ opacity: 0, x: switchDirection * 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        {/* VCD/DVD badge */}
                        <span className={`tt-format-badge ${formatType === "DVD" ? "tt-badge-dvd" : "tt-badge-vcd"}`}>
                          {formatType}
                        </span>

                        {/* Year */}
                        <span className="tt-card-year">{currentCard.year}</span>

                        {/* Image */}
                        {currentCard.imageUrl && (
                          <div className="tt-card-image-wrap">
                            <img src={currentCard.imageUrl} alt={currentCard.title} className="tt-card-image" />
                            <div className="tt-card-image-lines" />
                          </div>
                        )}

                        {/* Title */}
                        <div className="tt-card-title">{currentCard.title}</div>

                        {/* Description / quote */}
                        <div className="tt-card-desc">{currentCard.description}</div>

                        {/* Edit button */}
                        {onEdit && (
                          <button
                            className="tt-card-edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(currentCard, "tv");
                            }}
                          >
                            编辑此频道
                          </button>
                        )}
                      </motion.div>
                    ) : (
                      <div className="tt-no-signal">暂无频道信号</div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* TV off state */}
              {!tvOn && <div className="tt-off-reflection" />}
            </div>

            {/* Bottom control strip */}
            <div className="tt-tv-controls">
              <div className="tt-tv-btn tt-tv-btn-power" />
              <div className="tt-tv-btn" />
              <div className="tt-tv-btn" />
              <div className="tt-tv-brand">TCL</div>
            </div>
          </div>

          {/* Right speaker grille */}
          <div className="tt-tv-speaker tt-tv-speaker-right" />

          {/* ======== MP3 Player (overlapping bottom-right) ======== */}
          <div className="tt-mp3">
            {/* MP3 label */}
            <div className="tt-mp3-label">随身听里的旋律</div>
            {/* MP3 screen */}
            <div className="tt-mp3-screen">
              {currentBgm ? (
                <>
                  <div className="tt-mp3-song-title">{currentBgm.title}</div>
                  <div className="tt-mp3-song-meta">{currentBgm.year}</div>

                  {/* Equalizer bars */}
                  {isPlaying && (
                    <div className="tt-mp3-eq">
                      <div className="tt-eq-bar" style={{ animationDelay: "0s" }} />
                      <div className="tt-eq-bar" style={{ animationDelay: "0.15s" }} />
                      <div className="tt-eq-bar" style={{ animationDelay: "0.3s" }} />
                    </div>
                  )}

                  {/* Lyrics */}
                  <AnimatePresence>
                    {showLyrics && isPlaying && currentBgm.description && (
                      <motion.div
                        className="tt-mp3-lyrics"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="tt-lyrics-scroll">{currentBgm.description}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Progress bar */}
                  <div className="tt-mp3-progress">
                    <div className={`tt-mp3-progress-fill ${isPlaying ? "tt-progress-playing" : ""}`} />
                  </div>
                </>
              ) : (
                <div className="tt-mp3-no-song">暂无曲目</div>
              )}
            </div>

            {/* Click wheel */}
            <div className="tt-mp3-wheel">
              {/* Top: menu */}
              <button className="tt-wheel-zone tt-wheel-top" title="菜单" onClick={() => setShowLyrics((p) => !p)} />
              {/* Bottom: vol placeholder */}
              <button className="tt-wheel-zone tt-wheel-bottom" title="音量" />
              {/* Left: prev */}
              <button className="tt-wheel-zone tt-wheel-left" title="上一首" onClick={prevSong} />
              {/* Right: next */}
              <button className="tt-wheel-zone tt-wheel-right" title="下一首" onClick={nextSong} />
              {/* Center: play/pause */}
              <button className="tt-wheel-center" onClick={togglePlay} title={isPlaying ? "暂停" : "播放"}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#555">
                  {isPlaying ? (
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                  ) : (
                    <polygon points="8,4 20,12 8,20" />
                  )}
                </svg>
              </button>
            </div>

            {/* Earphone jack */}
            <div className="tt-mp3-jack" />

            {/* White wired earphone */}
            <svg className="tt-mp3-earphone" width="60" height="80" viewBox="0 0 60 80" fill="none">
              {/* Wire from jack */}
              <path d="M10 0 C10 20, 8 35, 15 45 C22 55, 12 65, 18 75" stroke="#ddd" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* Left earbud */}
              <ellipse cx="16" cy="77" rx="3" ry="4" fill="#e8e8e8" />
              {/* Right earbud (branching off) */}
              <path d="M18 55 C18 60, 25 62, 30 58 C35 54, 38 60, 38 75" stroke="#ddd" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <ellipse cx="36" cy="77" rx="3" ry="4" fill="#e8e8e8" />
            </svg>

            {/* Edit BGM button */}
            {onEdit && currentBgm && (
              <button
                className="tt-mp3-edit"
                onClick={() => onEdit(currentBgm, "bgm")}
              >
                编辑曲目
              </button>
            )}
          </div>
        </div>

        {/* ======== Remote Control ======== */}
        <div className="tt-remote">
          {/* Power */}
          <button
            className={`tt-rem-btn tt-rem-power ${!tvOn ? "tt-rem-power-glow" : ""}`}
            onClick={() => setTvOn((p) => !p)}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
          >
            <span className="tt-rem-power-dot" />
          </button>

          {/* Channel */}
          <div className="tt-rem-row">
            <button
              className="tt-rem-btn tt-rem-ch"
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
              onClick={() => switchChannel(-1)}
            >
              CH-
            </button>
            <button
              className="tt-rem-btn tt-rem-ch"
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
              onClick={() => switchChannel(1)}
            >
              CH+
            </button>
          </div>

          {/* Volume */}
          <div className="tt-rem-row">
            <button
              className="tt-rem-btn tt-rem-vol"
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.95)";
                playBeepSound();
              }}
              onMouseUp={(e) => (e.currentTarget.style.transform = "")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
            >
              VOL-
            </button>
            <button
              className="tt-rem-btn tt-rem-vol"
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.95)";
                playBeepSound();
              }}
              onMouseUp={(e) => (e.currentTarget.style.transform = "")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
            >
              VOL+
            </button>
          </div>

          {/* Menu / Curator */}
          <button
            className="tt-rem-btn tt-rem-menu"
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
            onClick={() => {
              if (onEdit && currentCard) {
                onEdit(currentCard, "tv");
              }
            }}
          >
            馆长解说
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeTheater;

/* ============================================================
   CSS (inject via <style>)
   ============================================================ */

const CSS = `
/* ---- Reset & Base ---- */
.time-theater {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px 48px;
  position: relative;
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  /* Wood grain wall */
  background-color: #2c2318;
  background-image:
    /* Wood grain texture */
    repeating-linear-gradient(
      87deg,
      transparent,
      transparent 12px,
      rgba(60,45,30,0.3) 12px,
      rgba(60,45,30,0.3) 14px
    ),
    /* Subtle noise overlay */
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(0,0,0,0.02) 3px,
      rgba(0,0,0,0.02) 4px
    ),
    /* Warmer center glow */
    radial-gradient(ellipse at 50% 40%, rgba(80,60,35,0.3) 0%, transparent 60%);
  /* Dark vignette edges */
  box-shadow: inset 0 0 150px rgba(0,0,0,0.4);
}

.tt-title {
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #d4a84a;
  margin: 0 0 28px;
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  letter-spacing: 4px;
}

/* ---- Stage Layout ---- */
.tt-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
}

/* ============================================================
   TV Shell
   ============================================================ */
.tt-tv-shell {
  position: relative;
  width: min(700px, 90vw);
  background: linear-gradient(175deg, #c8c8c8 0%, #b0b0b0 40%, #a0a0a0 100%);
  border-radius: 20px;
  padding: 16px 0 12px;
  box-shadow:
    0 12px 40px rgba(0,0,0,0.5),
    0 2px 8px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.25);
  display: flex;
  align-items: stretch;
}
/* TV screen as light source glow */
.tt-tv-shell::after {
  content: "";
  position: absolute;
  inset: -30px;
  border-radius: 40px;
  background: radial-gradient(ellipse at center, rgba(255,220,150,0.06) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.8s;
}
.tt-tv-shell.tv-on::after {
  opacity: 1;
}

/* Scratch / wear texture */
.tt-tv-texture {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  pointer-events: none;
  z-index: 2;
  opacity: 0.04;
  background-image:
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.3) 2px,
      rgba(0,0,0,0.3) 3px
    );
}

/* ============================================================
   Speaker Grilles
   ============================================================ */
.tt-tv-speaker {
  width: 60px;
  min-width: 60px;
  margin: 0 8px;
  border-radius: 8px;
  background:
    repeating-linear-gradient(
      0deg,
      #909090 0px,
      #909090 2px,
      #a0a0a0 2px,
      #a0a0a0 5px
    );
  box-shadow:
    inset 0 2px 6px rgba(0,0,0,0.25),
    inset 0 -1px 3px rgba(255,255,255,0.1);
  position: relative;
  z-index: 1;
}

/* ============================================================
   TV Center (screen + controls)
   ============================================================ */
.tt-tv-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
  z-index: 1;
}

/* ============================================================
   TV Screen
   ============================================================ */
.tt-tv-screen {
  position: relative;
  min-height: 320px;
  background: #0a0a12;
  border-radius: 12px;
  overflow: hidden;
  perspective: 600px;
  box-shadow:
    inset 0 0 30px rgba(0,0,0,0.8),
    inset 0 0 4px rgba(255,220,150,0.15);
  animation: tt-glow 4s ease-in-out infinite;
}

.tt-tv-off {
  background: #050508;
  animation: none;
}

/* CRT curvature overlay */
.tt-crt-curve {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  pointer-events: none;
  z-index: 5;
  background: radial-gradient(
    ellipse at center,
    transparent 60%,
    rgba(0,0,0,0.25) 100%
  );
}

/* Scanlines */
.tt-scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 6;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.08) 2px,
    rgba(0,0,0,0.08) 4px
  );
  opacity: 0.5;
}

/* Channel indicator */
.tt-ch-indicator {
  position: absolute;
  top: 8px;
  left: 12px;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 12px;
  color: #33ff33;
  z-index: 8;
  text-shadow: 0 0 6px rgba(51,255,51,0.4);
  letter-spacing: 1px;
}

/* ============================================================
   Static / Snow Effect
   ============================================================ */
.tt-static {
  position: absolute;
  inset: 0;
  z-index: 10;
  background:
    repeating-conic-gradient(
      #fff 0.0001%,
      transparent 0.0002%,
      transparent 0.0004%,
      #fff 0.0005%
    );
  background-size: 4px 4px;
  opacity: 1;
  animation: tt-static 0.15s steps(8) infinite;
}

/* ============================================================
   TV Card (VCD/DVD cover style)
   ============================================================ */
.tt-card {
  position: absolute;
  inset: 0;
  z-index: 7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 28px;
  background:
    linear-gradient(160deg, #1a1520 0%, #12101a 50%, #1a1520 100%);
  color: #f0e8d8;
  text-align: center;
  overflow: hidden;
}

/* Format badge */
.tt-format-badge {
  position: absolute;
  top: 10px;
  left: 12px;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  letter-spacing: 1px;
  z-index: 9;
}
.tt-badge-vcd {
  background: #cc3333;
  color: #fff;
}
.tt-badge-dvd {
  background: #3355cc;
  color: #fff;
}

/* Card year */
.tt-card-year {
  position: absolute;
  top: 10px;
  right: 12px;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 11px;
  color: rgba(255,255,255,0.45);
  z-index: 9;
}

/* Card image */
.tt-card-image-wrap {
  width: 100%;
  max-width: 240px;
  margin: 0 auto 12px;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}
.tt-card-image {
  width: 100%;
  display: block;
  filter: sepia(0.2) contrast(1.05);
  object-fit: cover;
  max-height: 160px;
}
.tt-card-image-lines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0,0,0,0.06) 3px,
    rgba(0,0,0,0.06) 6px
  );
  pointer-events: none;
}

/* Card title */
.tt-card-title {
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  line-height: 1.4;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

/* Card description / quote */
.tt-card-desc {
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  font-size: 14px;
  font-style: italic;
  color: rgba(240,232,216,0.7);
  line-height: 1.6;
  max-width: 320px;
  word-break: break-word;
}

/* Card edit button */
.tt-card-edit {
  position: absolute;
  bottom: 10px;
  right: 12px;
  font-size: 11px;
  font-family: 'Noto Serif SC', serif;
  color: rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px;
  padding: 3px 8px;
  cursor: pointer;
  z-index: 9;
  transition: color 0.2s, border-color 0.2s;
}
.tt-card-edit:hover {
  color: rgba(255,255,255,0.7);
  border-color: rgba(255,255,255,0.3);
}

/* Card hover 3D pop-out + disc back text */
.tt-card:hover {
  transform: perspective(600px) rotateY(-3deg) translateZ(8px);
  box-shadow: 8px 8px 24px rgba(0,0,0,0.6);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.tt-card:hover::after {
  content: "那是我们一起追过的剧，也是再也回不去的夏天。";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: rgba(0,0,0,0.75);
  color: rgba(200,192,176,0.9);
  font-size: 13px;
  font-style: italic;
  font-family: 'Noto Serif SC', serif;
  text-align: center;
  line-height: 1.6;
  border-top: 1px solid rgba(176,141,87,0.3);
}

/* No signal */
.tt-no-signal {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #33ff33;
  z-index: 7;
  text-shadow: 0 0 8px rgba(51,255,51,0.3);
  animation: tt-blink 1.2s ease-in-out infinite;
}

/* TV off reflection */
.tt-off-reflection {
  position: absolute;
  inset: 0;
  z-index: 7;
  background: radial-gradient(
    ellipse at 35% 30%,
    rgba(255,255,255,0.03) 0%,
    transparent 50%
  );
  border-radius: 12px;
}

/* ============================================================
   TV Bottom Controls
   ============================================================ */
.tt-tv-controls {
  display: flex;
  align-items: center;
  padding: 8px 16px 4px;
  gap: 10px;
  position: relative;
}
.tt-tv-btn {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #666;
  border: 1px solid #888;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.4);
}
.tt-tv-btn-power {
  background: #883333;
  border-color: #aa5555;
}
.tt-tv-brand {
  margin-left: auto;
  font-family: 'Arial', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #555;
  letter-spacing: 2px;
}

/* ============================================================
   MP3 Player
   ============================================================ */
.tt-mp3 {
  position: absolute;
  bottom: -10px;
  right: -30px;
  width: 140px;
  background: linear-gradient(180deg, #f8f8f8 0%, #eeeeee 100%);
  border-radius: 12px;
  box-shadow:
    0 4px 16px rgba(0,0,0,0.3),
    0 1px 3px rgba(0,0,0,0.15);
  transform: rotate(-5deg);
  z-index: 10;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* MP3 screen */
.tt-mp3-screen {
  width: 100%;
  height: 130px;
  background: #1a1a2e;
  padding: 10px 10px 8px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.tt-mp3-song-title {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #fff;
  text-align: center;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tt-mp3-song-meta {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  color: rgba(255,255,255,0.45);
  text-align: center;
  margin-bottom: 8px;
}

/* Equalizer bars */
.tt-mp3-eq {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  height: 20px;
  margin-bottom: 6px;
}
.tt-eq-bar {
  width: 4px;
  height: 4px;
  background: #33ff88;
  border-radius: 1px;
  animation: tt-eq-bar 0.6s ease-in-out infinite;
}

/* Lyrics */
.tt-mp3-lyrics {
  flex: 1;
  overflow: hidden;
  position: relative;
}
.tt-lyrics-scroll {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: rgba(255,255,255,0.85);
  line-height: 1.5;
  text-align: center;
  white-space: pre-wrap;
  word-break: break-word;
  animation: tt-lyrics-scroll 12s linear infinite;
}

/* Progress bar */
.tt-mp3-progress {
  width: 100%;
  height: 3px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  margin-top: auto;
  overflow: hidden;
}
.tt-mp3-progress-fill {
  width: 0%;
  height: 100%;
  background: #3388ff;
  border-radius: 2px;
  transition: width 0.3s;
}
.tt-progress-playing {
  animation: tt-progress-move 30s linear infinite;
}

/* No song */
.tt-mp3-no-song {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: rgba(255,255,255,0.3);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* Click wheel */
.tt-mp3-wheel {
  width: 80px;
  height: 80px;
  margin: 12px auto 8px;
  border-radius: 50%;
  background: linear-gradient(180deg, #eaeaea 0%, #ddd 100%);
  border: 2px solid #ccc;
  box-shadow:
    0 1px 4px rgba(0,0,0,0.15),
    inset 0 1px 0 rgba(255,255,255,0.6);
  position: relative;
}

/* Wheel touch zones */
.tt-wheel-zone {
  position: absolute;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  outline: none;
}
.tt-wheel-zone:active {
  background: rgba(0,0,0,0.05);
  border-radius: 50%;
}
.tt-wheel-top {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 20px;
}
.tt-wheel-bottom {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 20px;
}
.tt-wheel-left {
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 28px;
}
.tt-wheel-right {
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 28px;
}

/* Wheel center button */
.tt-wheel-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(180deg, #f5f5f5 0%, #e0e0e0 100%);
  border: 1px solid #bbb;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  outline: none;
  transition: box-shadow 0.15s;
}
.tt-wheel-center:active {
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
}

/* Earphone jack */
.tt-mp3-jack {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #555;
  margin: 4px auto 8px;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);
}

/* MP3 label */
.tt-mp3-label {
  position: absolute;
  top: -28px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
  color: #8a7a6a;
  font-family: 'Noto Serif SC', serif;
  letter-spacing: 2px;
  white-space: nowrap;
}

/* White wired earphone */
.tt-mp3-earphone {
  position: absolute;
  bottom: -78px;
  left: 8px;
  z-index: -1;
  opacity: 0.7;
  animation: tt-earphone-sway 4s ease-in-out infinite;
  transform-origin: top center;
}

/* CRT warm-up glow animation */
.tt-screen-warming {
  position: absolute;
  inset: 0;
  z-index: 15;
  background: radial-gradient(
    circle at center,
    rgba(255,220,150,0.4) 0%,
    rgba(255,200,100,0.2) 30%,
    transparent 60%
  );
  animation: tt-warmup 0.8s ease-out forwards;
}

/* MP3 edit button */
.tt-mp3-edit {
  display: block;
  width: calc(100% - 16px);
  margin: 0 auto 8px;
  font-size: 10px;
  font-family: 'Noto Serif SC', serif;
  color: rgba(0,0,0,0.3);
  background: rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 4px;
  padding: 2px 0;
  cursor: pointer;
  text-align: center;
  transition: color 0.2s;
}
.tt-mp3-edit:hover {
  color: rgba(0,0,0,0.6);
}

/* ============================================================
   Remote Control
   ============================================================ */
.tt-remote {
  width: 180px;
  background: rgba(40,40,50,0.85);
  border: 1px solid rgba(80,80,90,0.5);
  border-radius: 16px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}

.tt-rem-btn {
  background: #2a2a35;
  color: #c8c8d0;
  border: 1px solid rgba(100,100,110,0.4);
  border-radius: 6px;
  font-size: 12px;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  padding: 6px 0;
  outline: none;
  transition: box-shadow 0.15s;
  width: 100%;
}
.tt-rem-btn:active {
  transform: scale(0.95);
}

/* Power button */
.tt-rem-power {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2a2a35;
}
.tt-rem-power:active {
  box-shadow: 0 0 8px rgba(204,51,51,0.4);
}
.tt-rem-power-glow {
  box-shadow: 0 0 10px rgba(204,51,51,0.5);
}
.tt-rem-power-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #cc3333;
  box-shadow: 0 0 6px rgba(204,51,51,0.6);
  display: block;
}

/* Channel buttons */
.tt-rem-row {
  display: flex;
  gap: 6px;
  width: 100%;
}
.tt-rem-row .tt-rem-btn {
  flex: 1;
}
.tt-rem-ch:active {
  box-shadow: 0 0 8px rgba(51,255,51,0.3);
}

/* Volume buttons */
.tt-rem-vol:active {
  box-shadow: 0 0 8px rgba(212,168,74,0.3);
}

/* Menu button */
.tt-rem-menu {
  font-family: 'Noto Serif SC', serif;
  font-size: 12px;
  letter-spacing: 1px;
}
.tt-rem-menu:active {
  box-shadow: 0 0 8px rgba(212,168,74,0.3);
}

/* ============================================================
   Animations
   ============================================================ */
@keyframes tt-static {
  0%   { opacity: 1; }
  25%  { opacity: 0.7; }
  50%  { opacity: 1; }
  75%  { opacity: 0.85; }
  100% { opacity: 1; }
}

@keyframes tt-scanline {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes tt-eq-bar {
  0%, 100% { height: 4px; }
  50%      { height: 16px; }
}

@keyframes tt-glow {
  0%, 100% { box-shadow: inset 0 0 30px rgba(0,0,0,0.8), inset 0 0 4px rgba(255,220,150,0.15); }
  50%      { box-shadow: inset 0 0 30px rgba(0,0,0,0.8), inset 0 0 8px rgba(255,220,150,0.25); }
}

@keyframes tt-blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.3; }
}

@keyframes tt-lyrics-scroll {
  0%   { transform: translateY(100%); }
  100% { transform: translateY(-100%); }
}

@keyframes tt-progress-move {
  0%   { width: 0%; }
  100% { width: 100%; }
}

@keyframes tt-warmup {
  0% { opacity: 0; transform: scale(0.3); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes tt-earphone-sway {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(2deg); }
}
`;