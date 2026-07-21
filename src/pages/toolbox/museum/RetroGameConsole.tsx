import { useState, useCallback, useRef, useEffect } from "react";

/* ============================================================
   4399 童年游戏机 - Retro Game Console
   ============================================================ */

const GAMES = [
  { id: "mota", name: "魔塔", year: "2004", genre: "RPG", color: "#4A6B8A", bg: "#2A3B4A", url: "https://www.4399.com/flash/7368.htm" },
  { id: "tank", name: "坦克大战", year: "2005", genre: "射击", color: "#5A8A4A", bg: "#2A4A2A", url: "https://www.4399.com/flash/2872.htm" },
  { id: "mario", name: "超级玛丽", year: "2005", genre: "冒险", color: "#C84A3A", bg: "#4A2A1A", url: "https://www.4399.com/flash/373.htm" },
  { id: "zuma", name: "祖玛", year: "2004", genre: "益智", color: "#8A6A3A", bg: "#3A2A1A", url: "https://www.4399.com/flash/674.htm" },
  { id: "diner", name: "美女餐厅", year: "2006", genre: "经营", color: "#C87A5A", bg: "#4A2A1A", url: "https://www.4399.com/flash/1799.htm" },
  { id: "plant", name: "植物大战僵尸", year: "2009", genre: "策略", color: "#4A8A3A", bg: "#1A3A1A", url: "https://www.4399.com/flash/11260.htm" },
  { id: "goldminer", name: "黄金矿工", year: "2005", genre: "益智", color: "#B89A3A", bg: "#3A3218", url: "https://www.4399.com/flash/543.htm" },
  { id: "chicken", name: "小鸡快跑", year: "2006", genre: "休闲", color: "#D4A84A", bg: "#3A3018", url: "https://www.4399.com/flash/1485.htm" },
  { id: "bao", name: "暴打小朋友", year: "2007", genre: "格斗", color: "#8A3A3A", bg: "#3A1A1A", url: "https://www.4399.com/flash/3192.htm" },
  { id: "box", name: "闪翼拳皇", year: "2008", genre: "格斗", color: "#5A5A8A", bg: "#2A2A3A", url: "https://www.4399.com/flash/4191.htm" },
] as const;

/** CSS-only thumbnail background for each game */
function getThumbnailStyle(game: (typeof GAMES)[number]): React.CSSProperties {
  const base: React.CSSProperties = {
    width: 80,
    height: 60,
    borderRadius: 4,
    flexShrink: 0,
  };

  switch (game.id) {
    case "mota":
      return {
        ...base,
        background: `
          linear-gradient(135deg, #2A3B6A 0%, #4A3B8A 50%, #2A3B6A 100%),
          repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(100,120,180,0.3) 8px, rgba(100,120,180,0.3) 9px),
          repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(100,120,180,0.3) 8px, rgba(100,120,180,0.3) 9px)
        `,
        backgroundColor: "#2A3B4A",
      };
    case "tank":
      return {
        ...base,
        background: `
          linear-gradient(45deg, rgba(80,120,60,0.4) 25%, transparent 25%, transparent 75%, rgba(80,120,60,0.4) 75%),
          linear-gradient(45deg, rgba(80,120,60,0.4) 25%, transparent 25%, transparent 75%, rgba(80,120,60,0.4) 75%)
        `,
        backgroundColor: "#2A4A2A",
        backgroundSize: "12px 12px",
        backgroundPosition: "0 0, 6px 6px",
      };
    case "mario":
      return {
        ...base,
        background: `
          radial-gradient(circle at 20% 30%, #87CEEB 0%, transparent 30%),
          radial-gradient(circle at 60% 20%, #87CEEB 0%, transparent 25%),
          radial-gradient(circle at 85% 35%, #87CEEB 0%, transparent 20%),
          linear-gradient(180deg, #6B8EC0 0%, #6B8EC0 40%, #C84A3A 40%, #C84A3A 55%, #4A8A3A 55%, #4A8A3A 100%)
        `,
      };
    case "zuma":
      return {
        ...base,
        background: `
          conic-gradient(from 45deg at 50% 50%,
            #8A6A3A, #C89A3A, #D4AA4A, #8A6A3A, #C89A3A, #8A6A3A),
          radial-gradient(circle at 50% 50%, transparent 15%, rgba(58,42,26,0.6) 16%, transparent 30%),
          radial-gradient(circle at 50% 50%, transparent 35%, rgba(58,42,26,0.4) 36%, transparent 50%)
        `,
      };
    case "diner":
      return {
        ...base,
        background: `
          repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(200,122,90,0.4) 6px, rgba(200,122,90,0.4) 12px),
          linear-gradient(135deg, #F5E6D3 0%, #E8C8B0 50%, #C87A5A 100%)
        `,
      };
    case "plant":
      return {
        ...base,
        background: `
          radial-gradient(circle at 20% 40%, rgba(100,180,60,0.8) 0%, transparent 25%),
          radial-gradient(circle at 50% 25%, rgba(80,160,50,0.7) 0%, transparent 20%),
          radial-gradient(circle at 70% 50%, rgba(120,200,80,0.6) 0%, transparent 22%),
          radial-gradient(circle at 35% 65%, rgba(90,170,55,0.7) 0%, transparent 18%),
          radial-gradient(circle at 80% 75%, rgba(110,190,65,0.6) 0%, transparent 20%),
          linear-gradient(180deg, #87CEEB 0%, #87CEEB 30%, #4A8A3A 30%, #3A6A2A 100%)
        `,
      };
    case "goldminer":
      return {
        ...base,
        background: `
          linear-gradient(135deg, #B89A3A 0%, #D4AA4A 30%, #8A6A2A 100%),
          repeating-conic-gradient(from 0deg at 50% 50%, rgba(58,50,24,0.6) 0deg 30deg, transparent 30deg 60deg)
        `,
        backgroundColor: "#3A3218",
      };
    case "chicken":
      return {
        ...base,
        background: `
          radial-gradient(circle at 30% 50%, #FFF8DC 0%, transparent 15%),
          radial-gradient(circle at 60% 40%, #FFF8DC 0%, transparent 12%),
          radial-gradient(circle at 45% 70%, #FFF8DC 0%, transparent 10%),
          radial-gradient(circle at 75% 60%, #FFD700 0%, transparent 18%),
          linear-gradient(180deg, #87CEEB 0%, #87CEEB 35%, #D4A84A 35%, #B8943A 100%)
        `,
      };
    case "bao":
      return {
        ...base,
        background: `
          repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(138,58,58,0.6) 4px, rgba(138,58,58,0.6) 8px),
          linear-gradient(0deg, #8A3A3A 0%, #4A1A1A 100%)
        `,
      };
    case "box":
      return {
        ...base,
        background: `
          repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(100,100,180,0.5) 3px, rgba(100,100,180,0.5) 4px),
          linear-gradient(180deg, #2A2A5A 0%, #5A3A8A 50%, #3A2A5A 100%)
        `,
      };
    default:
      return { ...base, backgroundColor: game.bg };
  }
}

/** Play a short beep via Web Audio API */
function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 880;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.stop(ctx.currentTime + 0.1);
  } catch {
    /* silent fail */
  }
}

const RetroGameConsole: React.FC = () => {
  const [gameIndex, setGameIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const transitioning = useRef(false);

  const navigate = useCallback(
    (dir: "left" | "right") => {
      if (transitioning.current) return;
      transitioning.current = true;
      setFading(true);
      playBeep();
      setTimeout(() => {
        setGameIndex((prev) => {
          const next = dir === "left"
            ? (prev - 1 + GAMES.length) % GAMES.length
            : (prev + 1) % GAMES.length;
          return next;
        });
        setFading(false);
        transitioning.current = false;
      }, 180);
    },
    []
  );

  const openGame = useCallback(() => {
    window.open(GAMES[gameIndex].url, "_blank", "noopener");
  }, [gameIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") navigate("left");
      else if (e.key === "ArrowRight") navigate("right");
      else if (e.key === "Enter") openGame();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, openGame]);

  const currentGame = GAMES[gameIndex];

  // Compute visible game indices for the carousel (show 3 at a time)
  const visibleIndices = [
    (gameIndex - 1 + GAMES.length) % GAMES.length,
    gameIndex,
    (gameIndex + 1) % GAMES.length,
  ];

  return (
    <>
      <style>{`
        /* ============ Retro Game Console ============ */
        .rgc-console {
          width: 480px;
          max-width: 100%;
          margin: 0 auto;
          background: linear-gradient(180deg, #E8D8C8 0%, #D8C8B8 100%);
          border-radius: 20px;
          padding: 20px 24px 24px;
          box-shadow:
            0 8px 24px rgba(0,0,0,0.35),
            0 2px 6px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.5),
            inset 0 -1px 0 rgba(0,0,0,0.1);
          font-family: "Courier New", "SimHei", monospace;
          user-select: none;
          position: relative;
        }

        /* Screen area */
        .rgc-screen-wrap {
          background: #1A1A1A;
          border: 4px solid #333;
          border-radius: 8px;
          width: 100%;
          max-width: 380px;
          height: 260px;
          margin: 0 auto 18px;
          position: relative;
          overflow: hidden;
          box-shadow:
            inset 0 2px 8px rgba(0,0,0,0.6),
            inset 0 0 20px rgba(0,0,0,0.3);
        }

        /* CRT scanlines */
        .rgc-screen-wrap::after {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.15) 2px,
            rgba(0,0,0,0.15) 3px
          );
          pointer-events: none;
          z-index: 2;
        }

        /* Watermark */
        .rgc-watermark {
          position: absolute;
          top: 6px;
          right: 8px;
          font-size: 10px;
          color: rgba(255,255,255,0.2);
          z-index: 3;
          letter-spacing: 1px;
        }

        /* Screen content */
        .rgc-screen-content {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
          box-sizing: border-box;
        }

        /* Game carousel */
        .rgc-carousel {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        /* Navigation arrows */
        .rgc-arrow {
          color: rgba(255,255,255,0.4);
          font-size: 20px;
          cursor: pointer;
          transition: color 0.15s;
          flex-shrink: 0;
          line-height: 1;
          user-select: none;
        }
        .rgc-arrow:hover {
          color: rgba(255,255,255,0.8);
        }

        /* Thumbnail strip */
        .rgc-thumb-strip {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        /* Thumbnail item */
        .rgc-thumb-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          cursor: pointer;
          opacity: 0.45;
          transition: opacity 0.2s, transform 0.2s;
        }
        .rgc-thumb-item:hover {
          opacity: 0.75;
        }
        .rgc-thumb-item.rgc-thumb-active {
          opacity: 1;
          transform: scale(1.08);
        }

        /* Thumbnail border highlight */
        .rgc-thumb-border {
          border: 2px solid transparent;
          border-radius: 6px;
          padding: 2px;
          transition: border-color 0.2s;
        }
        .rgc-thumb-item.rgc-thumb-active .rgc-thumb-border {
          border-color: #FFD700;
          box-shadow: 0 0 8px rgba(255,215,0,0.5);
        }

        /* Thumbnail label */
        .rgc-thumb-label {
          font-size: 9px;
          color: rgba(255,255,255,0.6);
          max-width: 84px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }
        .rgc-thumb-item.rgc-thumb-active .rgc-thumb-label {
          color: rgba(255,255,255,0.9);
        }

        /* Game info area */
        .rgc-game-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          flex: 1;
          justify-content: center;
        }

        .rgc-game-name {
          font-size: 22px;
          font-weight: bold;
          color: #FFD700;
          text-shadow: 0 0 10px rgba(255,215,0,0.4);
          letter-spacing: 2px;
        }

        .rgc-game-meta {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .rgc-game-year {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
        }

        .rgc-game-genre {
          font-size: 11px;
          padding: 1px 8px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 3px;
          color: rgba(255,255,255,0.6);
        }

        /* Fade transition */
        .rgc-screen-fade {
          transition: opacity 0.15s ease;
        }
        .rgc-screen-fade.rgc-fading {
          opacity: 0;
        }

        /* Controls area */
        .rgc-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          margin-top: 6px;
        }

        /* D-Pad */
        .rgc-dpad {
          position: relative;
          width: 64px;
          height: 64px;
        }

        .rgc-dpad-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          background: #C0C0C0;
          border-radius: 50%;
          z-index: 1;
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.5);
        }

        .rgc-dpad-h,
        .rgc-dpad-v {
          position: absolute;
          background: #B0B0B0;
          border-radius: 4px;
          box-shadow:
            0 2px 4px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.4);
        }

        .rgc-dpad-h {
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 100%;
          height: 22px;
          cursor: pointer;
        }

        .rgc-dpad-v {
          left: 50%;
          top: 0;
          transform: translateX(-50%);
          width: 22px;
          height: 100%;
          cursor: pointer;
        }

        .rgc-dpad-h:hover,
        .rgc-dpad-v:hover {
          background: #C8C8C8;
        }

        .rgc-dpad-h:active,
        .rgc-dpad-v:active {
          background: #A0A0A0;
          box-shadow:
            inset 0 2px 4px rgba(0,0,0,0.3),
            0 1px 0 rgba(255,255,255,0.2);
        }

        /* D-pad arrow indicators */
        .rgc-dpad-arrow {
          position: absolute;
          color: rgba(0,0,0,0.35);
          font-size: 12px;
          z-index: 2;
          pointer-events: none;
        }
        .rgc-dpad-arrow-left {
          left: 5px;
          top: 50%;
          transform: translateY(-50%);
        }
        .rgc-dpad-arrow-right {
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
        }

        /* AB Buttons */
        .rgc-buttons {
          display: flex;
          gap: 16px;
          align-items: center;
          transform: rotate(-15deg);
        }

        .rgc-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          color: rgba(255,255,255,0.9);
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
          box-shadow:
            0 3px 6px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.3),
            inset 0 -2px 4px rgba(0,0,0,0.2);
          transition: transform 0.1s, box-shadow 0.1s;
          font-family: "Courier New", monospace;
        }

        .rgc-btn:hover {
          transform: scale(1.05);
        }

        .rgc-btn:active {
          transform: scale(0.95);
          box-shadow:
            0 1px 2px rgba(0,0,0,0.3),
            inset 0 2px 6px rgba(0,0,0,0.3);
        }

        .rgc-btn-a {
          background: radial-gradient(circle at 35% 35%, #E05050, #C04040, #A03030);
        }

        .rgc-btn-b {
          background: radial-gradient(circle at 35% 35%, #5050E0, #4040C0, #3030A0);
        }

        /* Bottom bar */
        .rgc-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 14px;
          padding: 0 8px;
        }

        .rgc-brand {
          font-size: 10px;
          color: rgba(0,0,0,0.35);
          letter-spacing: 1px;
        }

        /* Speaker grille */
        .rgc-speaker {
          display: grid;
          grid-template-columns: repeat(6, 4px);
          grid-template-rows: repeat(3, 4px);
          gap: 3px;
        }

        .rgc-speaker-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(0,0,0,0.15);
        }

        /* Screen click cursor */
        .rgc-screen-wrap {
          cursor: pointer;
        }
      `}</style>

      <div className="rgc-console">
        {/* Screen */}
        <div
          className="rgc-screen-wrap"
          onClick={openGame}
          title="点击打开游戏"
        >
          <span className="rgc-watermark">4399</span>
          <div className={`rgc-screen-content rgc-screen-fade${fading ? " rgc-fading" : ""}`}>
            {/* Carousel */}
            <div className="rgc-carousel">
              <span
                className="rgc-arrow"
                onClick={(e) => { e.stopPropagation(); navigate("left"); }}
                role="button"
                aria-label="上一个"
              >
                &lt;
              </span>

              <div className="rgc-thumb-strip">
                {visibleIndices.map((idx) => {
                  const g = GAMES[idx];
                  const isActive = idx === gameIndex;
                  return (
                    <div
                      key={g.id}
                      className={`rgc-thumb-item${isActive ? " rgc-thumb-active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isActive) {
                          navigate(idx === (gameIndex - 1 + GAMES.length) % GAMES.length ? "left" : "right");
                        } else {
                          openGame();
                        }
                      }}
                    >
                      <div className="rgc-thumb-border">
                        <div style={getThumbnailStyle(g)} />
                      </div>
                      <span className="rgc-thumb-label">{g.name}</span>
                    </div>
                  );
                })}
              </div>

              <span
                className="rgc-arrow"
                onClick={(e) => { e.stopPropagation(); navigate("right"); }}
                role="button"
                aria-label="下一个"
              >
                &gt;
              </span>
            </div>

            {/* Game info */}
            <div className="rgc-game-info">
              <span className="rgc-game-name">{currentGame.name}</span>
              <div className="rgc-game-meta">
                <span className="rgc-game-year">{currentGame.year}</span>
                <span className="rgc-game-genre">{currentGame.genre}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="rgc-controls">
          {/* D-Pad */}
          <div className="rgc-dpad">
            <div
              className="rgc-dpad-h"
              style={{ position: "relative" }}
            >
              <span className="rgc-dpad-arrow rgc-dpad-arrow-left">&lsaquo;</span>
              <span
                className="rgc-dpad-arrow rgc-dpad-arrow-right"
                style={{ right: 5, left: "auto" }}
              >&rsaquo;</span>
              {/* Left half click */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "50%",
                  height: "100%",
                  cursor: "pointer",
                  zIndex: 3,
                }}
                onClick={() => navigate("left")}
              />
              {/* Right half click */}
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  width: "50%",
                  height: "100%",
                  cursor: "pointer",
                  zIndex: 3,
                }}
                onClick={() => navigate("right")}
              />
            </div>
            <div className="rgc-dpad-v" />
            <div className="rgc-dpad-center" />
          </div>

          {/* A/B Buttons */}
          <div className="rgc-buttons">
            <button className="rgc-btn rgc-btn-b" title="B">B</button>
            <button className="rgc-btn rgc-btn-a" onClick={openGame} title="开始游戏">A</button>
          </div>
        </div>

        {/* Bottom */}
        <div className="rgc-bottom">
          <span className="rgc-brand">4399 / 童年游戏机</span>
          <div className="rgc-speaker">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="rgc-speaker-dot" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RetroGameConsole;
