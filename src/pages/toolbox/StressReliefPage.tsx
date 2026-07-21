import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Match3Game from "./games/Match3Game";
import FruitSliceGame from "./games/FruitSliceGame";
import ZombieJuiceGame from "./games/ZombieJuiceGame";
import TowerDefenseGame from "./games/TowerDefenseGame";

/**
 * 解压馆 · Stress Relief Room
 *
 * 四个解压小游戏，即点即玩。
 * 1. 消散 Match3 —— 三消归零
 * 2. 切水果 Fruit Slice —— 极简水墨风，划过切割得分
 * 3. 僵尸榨汁 Zombie Juice —— 美漫扁平风，点击僵尸飞入榨汁机
 * 4. 守卫小萝卜 Tower Defense —— 塔防守卫，放置防御塔击退怪物
 */

/* ============================================================
   主页面
   ============================================================ */
type GameKey = "match3" | "fruitslice" | "zombiejuice" | "towerdefense";

const GAMES: {
  key: GameKey;
  name: string;
  desc: string;
  icon: string;
  gradient: string;
  totalLevels: number;
  totalBadges: number;
  saveKey: string;
  gameCode: string;
}[] = [
  {
    key: "match3",
    name: "消散",
    desc: "三消归零，万念俱散。",
    icon: "✨",
    gradient: "linear-gradient(135deg, #F4C2C2, #C2D4F4)",
    totalLevels: 20,
    totalBadges: 20,
    saveKey: "match3_badges",
    gameCode: "match3",
  },
  {
    key: "fruitslice",
    name: "切水果",
    desc: "一刀两断，万念皆空。",
    icon: "🍉",
    gradient: "linear-gradient(135deg, #e8e0d0, #d0d8d4)",
    totalLevels: 20,
    totalBadges: 20,
    saveKey: "fruit_slice_save",
    gameCode: "fruitslice",
  },
  {
    key: "zombiejuice",
    name: "僵尸榨汁",
    desc: "榨干烦恼，只剩快乐。",
    icon: "🧟",
    gradient: "linear-gradient(135deg, #c8e6c8, #d4e8c8)",
    totalLevels: 20,
    totalBadges: 20,
    saveKey: "zombie_juice_save",
    gameCode: "zombiejuice",
  },
  {
    key: "towerdefense",
    name: "守卫小萝卜",
    desc: "筑塔守卫，寸步不让。",
    icon: "🥕",
    gradient: "linear-gradient(135deg, #f5e1b8, #c8e6c8)",
    totalLevels: 20,
    totalBadges: 10,
    saveKey: "tower_defense_save",
    gameCode: "towerdefense",
  },
];

const StressReliefPage: React.FC = () => {
  const [active, setActive] = useState<GameKey | null>(null);

  // 游戏进度数据
  const [gameProgress, setGameProgress] = useState<Record<string, { level: number; badges: number }>>({});

  const loadProgress = useCallback(() => {
    const progress: Record<string, { level: number; badges: number }> = {};
    for (const g of GAMES) {
      try {
        const raw = localStorage.getItem(g.saveKey);
        if (raw) {
          const data = JSON.parse(raw);
          if (g.gameCode === "towerdefense") {
            progress[g.gameCode] = {
              level: data.highestWave || 0,
              badges: (data.badges || []).length,
            };
          } else if (g.gameCode === "zombiejuice") {
            progress[g.gameCode] = {
              level: data.highestLevel || 0,
              badges: (data.badges || []).length,
            };
          } else if (g.gameCode === "fruitslice") {
            progress[g.gameCode] = {
              level: data.highestLevel || 0,
              badges: (data.badges || []).length,
            };
          } else if (g.gameCode === "match3") {
            progress[g.gameCode] = {
              level: data.highestLevel || 0,
              badges: (data.badges || []).length,
            };
          }
        } else {
          progress[g.gameCode] = { level: 0, badges: 0 };
        }
      } catch {
        progress[g.gameCode] = { level: 0, badges: 0 };
      }
    }
    setGameProgress(progress);
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // 从游戏返回时刷新进度
  const handleBack = useCallback(() => {
    setActive(null);
    setTimeout(loadProgress, 100);
  }, [loadProgress]);

  return (
    <div className="sr-page">
      {/* 顶部返回 */}
      <header className="sr-topbar">
        <Link to="/mickey" className="sr-back">
          ← 回到作品集
        </Link>
        <span className="sr-topbar-meta">Stress Relief Room</span>
      </header>

      {/* 标题区 */}
      <section className="sr-hero">
        <motion.h1
          className="sr-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          解压馆
        </motion.h1>
        <motion.p
          className="sr-subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          允许一切失控，除了你的心跳。
        </motion.p>
      </section>

      {/* 内容区 */}
      <section className="sr-content">
        <AnimatePresence mode="wait">
          {active === null ? (
            <motion.div
              key="cards"
              className="sr-cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {GAMES.map((g) => {
                const pg = gameProgress[g.gameCode] || { level: 0, badges: 0 };
                const totalLevels = g.totalLevels;
                const totalBadges = g.totalBadges;
                return (
                  <motion.button
                    key={g.key}
                    className="sr-card"
                    onClick={() => setActive(g.key)}
                    whileHover={{ y: -6 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="sr-card-icon" style={{ background: g.gradient }}>
                      {g.icon}
                    </div>
                    <h3 className="sr-card-name">{g.name}</h3>
                    <p className="sr-card-desc">{g.desc}</p>
                    <div className="sr-card-progress">
                      <div className="sr-card-progress-item">
                        <span className="sr-card-progress-label">关卡</span>
                        <span className="sr-card-progress-value">{pg.level}/{totalLevels}</span>
                      </div>
                      <div className="sr-card-progress-item">
                        <span className="sr-card-progress-label">徽章</span>
                        <span className="sr-card-progress-value">{pg.badges}/{totalBadges}</span>
                      </div>
                    </div>
                    <span className="sr-card-play">开始</span>
                    <Link
                      to={`/toolbox/games/badges/${g.gameCode}`}
                      className="sr-card-badge-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      徽章墙
                    </Link>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="game"
              className="sr-game-view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <button className="sr-game-back" onClick={handleBack}>
                ← 换一个
              </button>
              {active === "match3" && <Match3Game />}
              {active === "fruitslice" && <FruitSliceGame />}
              {active === "zombiejuice" && <ZombieJuiceGame />}
              {active === "towerdefense" && <TowerDefenseGame />}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <style>{`
        .sr-page,
        .sr-page * { cursor: auto; }
        .sr-page a, .sr-page button { cursor: pointer; }

        .sr-page {
          min-height: 100vh;
          color: #5a4a52;
          background:
            radial-gradient(120% 80% at 50% 0%, #fdf6f8 0%, #f7f3f5 50%, #f0eaef 100%);
          font-family: "Noto Sans SC", system-ui, sans-serif;
          padding: 0 24px 80px;
        }

        /* 顶部 */
        .sr-topbar {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 860px; margin: 0 auto; padding: 24px 4px 0;
        }
        .sr-back {
          font-size: 14px; color: #9a8a92; text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease, transform 0.25s ease;
        }
        .sr-back:hover { color: #d48a9a; transform: translateX(-3px); }
        .sr-topbar-meta {
          font-size: 11px; color: #b8a8b0; letter-spacing: 0.28em; text-transform: uppercase;
        }

        /* 标题区 */
        .sr-hero {
          max-width: 860px; margin: 0 auto; padding: 44px 4px 32px; text-align: center;
        }
        .sr-title {
          font-size: clamp(30px, 5vw, 44px); font-weight: 800; color: #6b5560;
          margin: 0 0 10px; letter-spacing: 0.06em;
        }
        .sr-subtitle {
          font-size: 15px; color: #a898a0; margin: 0; letter-spacing: 0.08em;
        }

        /* 内容区 */
        .sr-content { max-width: 860px; margin: 0 auto; }

        /* 卡片列表（横向滚动，移动端纵向） */
        .sr-cards {
          display: flex; gap: 20px; padding: 8px 4px;
          overflow-x: auto; scrollbar-width: thin;
        }
        .sr-cards::-webkit-scrollbar { height: 6px; }
        .sr-cards::-webkit-scrollbar-thumb { background: rgba(180,140,160,0.3); border-radius: 3px; }
        @media (max-width: 640px) {
          .sr-cards { flex-direction: column; }
        }

        .sr-card {
          flex-shrink: 0; width: 240px; text-align: left; padding: 28px 24px;
          background: #fff; border: 1px solid #ece4e8; border-radius: 18px;
          box-shadow: 0 10px 30px -14px rgba(150,120,140,0.2);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .sr-card:hover {
          border-color: rgba(212,138,154,0.4);
          box-shadow: 0 18px 40px -14px rgba(150,120,140,0.3);
        }
        @media (max-width: 640px) { .sr-card { width: 100%; } }
        .sr-card-icon {
          width: 56px; height: 56px; border-radius: 16px; display: flex;
          align-items: center; justify-content: center; font-size: 28px; margin-bottom: 18px;
          box-shadow: inset 0 -4px 10px rgba(255,255,255,0.4);
        }
        .sr-card-name { font-size: 17px; font-weight: 700; color: #5a4a52; margin: 0 0 6px; }
        .sr-card-desc { font-size: 13px; color: #a898a0; margin: 0 0 12px; line-height: 1.6; }
        .sr-card-progress {
          display: flex; gap: 16px; margin: 0 0 14px; padding: 8px 12px;
          background: rgba(180,140,160,0.06); border-radius: 10px;
        }
        .sr-card-progress-item {
          display: flex; flex-direction: column; gap: 2px;
        }
        .sr-card-progress-label { font-size: 10px; color: #b8a8b0; letter-spacing: 0.04em; }
        .sr-card-progress-value { font-size: 14px; font-weight: 700; color: #8a6a7a; }
        .sr-card-play { font-size: 13px; color: #d48a9a; font-weight: 600; letter-spacing: 0.04em; }
        .sr-card-badge-link {
          display: inline-block;
          margin-top: 8px;
          font-size: 11px;
          color: #a898a0;
          text-decoration: none;
          letter-spacing: 0.04em;
          padding: 4px 10px;
          border-radius: 10px;
          background: rgba(180,160,170,0.06);
          transition: all 0.2s;
        }
        .sr-card-badge-link:hover {
          color: #8a6a7a;
          background: rgba(180,160,170,0.12);
        }

        /* 游戏视图 */
        .sr-game-view { position: relative; padding: 8px 4px; }
        .sr-game-back {
          font-size: 13px; color: #9a8a92; background: none; border: none;
          padding: 0 0 16px; font-family: inherit; transition: color 0.2s ease;
        }
        .sr-game-back:hover { color: #d48a9a; }

        .sr-game-stage {
          display: flex; flex-direction: column; align-items: center;
          background: #fff; border: 1px solid #ece4e8; border-radius: 18px;
          padding: 32px 24px; min-height: 420px;
          box-shadow: 0 10px 30px -14px rgba(150,120,140,0.15);
        }
        .sr-game-tip { margin: 20px 0 0; font-size: 13px; color: #b8a8b0; letter-spacing: 0.05em; }
      `}</style>
    </div>
  );
};

export default StressReliefPage;
