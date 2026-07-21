import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";

/**
 * 徽章墙页面
 *
 * 统一展示四个游戏的全部徽章收集进度。
 * 路由：/toolbox/games/badges/:game
 *  game 参数：match3 | fruitslice | towerdefense | zombiejuice
 */

/* ============================================================
   数据
   ============================================================ */

const GAME_CONFIGS: Record<string, {
  name: string;
  subtitle: string;
  icon: string;
  total: number;
  saveKey: string;
  getBadges: (data: unknown) => number[];
  badgeList: { name: string; color: string; level: number }[];
}> = {
  match3: {
    name: "消散",
    subtitle: "三消归零，万念俱散",
    icon: "\u2728",
    total: 20,
    saveKey: "match3_badges",
    getBadges: (data) => {
      try {
        if (typeof data === "object" && data !== null && "badges" in data) {
          return (data as { badges: number[] }).badges;
        }
      } catch { /* ignore */ }
      return [];
    },
    badgeList: [
      "初入消界", "碎石破障", "渐入佳境", "破冰而行",
      "中流击水", "双障齐克", "势如破竹", "无坚不摧",
      "炉火纯青", "登峰造极", "神之一手", "石破天惊",
      "冰雪消融", "双管齐下", "行云流水", "一石二鸟",
      "冰消瓦解", "坚壁清野", "纵横捭阖", "万物归零",
    ].map((name, i) => ({
      name,
      color: ["#a8d8a8", "#b8d8a8", "#c8d8a8", "#d4c8a0", "#d4b8a0", "#d0c0a0", "#c8b8a0", "#a0b8d4", "#b0c0d4", "#c8a8d8", "#d0b0d8", "#FFD700", "#e8c8a0", "#d4c8a0", "#c8c8b0", "#a8c8d8", "#b0d0e0", "#d8a8a0", "#e0b0a0", "#E8B923"][i],
      level: i + 1,
    })),
  },
  fruitslice: {
    name: "切水果",
    subtitle: "一刀两断，万念皆空",
    icon: "\u{1F349}",
    total: 20,
    saveKey: "fruit_slice_save",
    getBadges: (data) => {
      try {
        if (typeof data === "object" && data !== null && "badges" in data) {
          return (data as { badges: number[] }).badges;
        }
      } catch { /* ignore */ }
      return [];
    },
    badgeList: [
      "初入刀道", "刀锋渐利", "果雨初降", "一刀两断",
      "连锁反应", "快刀手", "旋风刀", "万剑归宗",
      "炸弹专家", "你已超脱凡尘", "刀气纵横", "千刀万剐",
      "果海无涯", "影刀无形", "刀王降临", "破空斩",
      "万物皆斩", "刀神附体", "修罗刀域", "无上刀圣",
    ].map((name, i) => ({
      name,
      color: ["#a8d8a8", "#b8d8a8", "#c8d8a8", "#d4c8a0", "#d4b8a0", "#d0c0a0", "#c8b8a0", "#a0b8d4", "#b0c0d4", "#c8a8d8", "#d0b0d8", "#FFD700", "#e8c8a0", "#d4c8a0", "#c8c8b0", "#a8c8d8", "#b0d0e0", "#d8a8a0", "#e0b0a0", "#E8B923"][i],
      level: i + 1,
    })),
  },
  towerdefense: {
    name: "守卫小萝卜",
    subtitle: "筑塔守卫，寸步不让",
    icon: "\u{1F955}",
    total: 20,
    saveKey: "tower_defense_save",
    getBadges: (data) => {
      try {
        if (typeof data === "object" && data !== null && "badges" in data) {
          return (data as { badges: number[] }).badges;
        }
      } catch { /* ignore */ }
      return [];
    },
    badgeList: [
      "初入战阵", "小试牛刀", "渐入佳境", "稳扎稳打",
      "小有成就", "步步为营", "智勇双全", "百折不挠",
      "进退自如", "固若金汤", "坚不可摧", "萝卜守护神",
      "千锤百炼", "铜墙铁壁", "兵来将挡", "万夫莫开",
      "龙城飞将", "战神附体", "一夫当关", "萝卜传说",
    ].map((name, i) => ({
      name,
      color: ["#a8d8a8", "#b8d8a8", "#c8d8a8", "#d4c8a0", "#d4b8a0", "#d0c0a0", "#c8b8a0", "#a0b8d4", "#b0c0d4", "#c8a8d8", "#d0b0d8", "#FFD700", "#e8c8a0", "#d4c8a0", "#c8c8b0", "#a8c8d8", "#b0d0e0", "#d8a8a0", "#e0b0a0", "#E8B923"][i],
      level: i + 1,
    })),
  },
  zombiejuice: {
    name: "僵尸榨汁",
    subtitle: "榨干烦恼，只剩快乐",
    icon: "\u{1F9DF}",
    total: 20,
    saveKey: "zombie_juice_save",
    getBadges: (data) => {
      try {
        if (typeof data === "object" && data !== null && "badges" in data) {
          return (data as { badges: number[] }).badges;
        }
      } catch { /* ignore */ }
      return [];
    },
    badgeList: [
      "新手榨工", "雷电使者", "疾风猎手", "天网恢恢",
      "闪避大师", "小鬼克星", "爆破专家", "破甲勇士",
      "隐形猎手", "终极榨神", "钢铁粉碎者", "疾风迅雷",
      "鹰眼射手", "幻影猎杀者", "逆流勇士", "瞬影捕手",
      "万物制衡", "分裂终结者", "虚空行者", "不灭传说",
    ].map((name, i) => ({
      name,
      color: ["#a8d8a8", "#b8d8a8", "#c8d8a8", "#d4c8a0", "#d4b8a0", "#d0c0a0", "#c8b8a0", "#a0b8d4", "#b0c0d4", "#c8a8d8", "#d0b0d8", "#FFD700", "#e8c8a0", "#d4c8a0", "#c8c8b0", "#a8c8d8", "#b0d0e0", "#d8a8a0", "#e0b0a0", "#E8B923"][i],
      level: i + 1,
    })),
  },
};

/* ============================================================
   Component
   ============================================================ */
const BadgeWallPage: React.FC = () => {
  const { game } = useParams<{ game: string }>();
  const config = game ? GAME_CONFIGS[game] : null;

  const [earned, setEarned] = useState<number[]>([]);

  useEffect(() => {
    if (!config) return;
    try {
      const raw = localStorage.getItem(config.saveKey);
      if (raw) {
        const data = JSON.parse(raw);
        setEarned(config.getBadges(data));
      }
    } catch {
      setEarned([]);
    }
  }, [config]);

  if (!config) {
    return (
      <div className="bw-wrapper">
        <div className="bw-empty">
          <p className="bw-empty-text">未找到该游戏的徽章数据</p>
          <Link to="/toolbox/games" className="bw-back-btn">返回解压馆</Link>
        </div>
      </div>
    );
  }

  const total = config.total;
  const collected = earned.length;
  const progress = Math.round((collected / total) * 100);

  return (
    <div className="bw-wrapper">
      {/* Header */}
      <div className="bw-header">
        <Link to="/toolbox/games" className="bw-close">×</Link>
        <Link to="/toolbox/games" className="bw-back">← 返回解压馆</Link>
        <h1 className="bw-title">
          <span className="bw-icon">{config.icon}</span>
          {config.name} · 徽章墙
        </h1>
        <p className="bw-subtitle">{config.subtitle}</p>

        {/* Progress bar */}
        <div className="bw-progress-wrap">
          <div className="bw-progress-bar">
            <div
              className="bw-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="bw-progress-text">
            {collected} / {total} · {progress}%
          </span>
        </div>

      </div>

      {/* Badge grid */}
      <div className="bw-grid">
        {config.badgeList.map((badge, i) => {
          const isEarned = earned.includes(badge.level);
          return (
            <motion.div
              key={i}
              className={`bw-card ${isEarned ? "earned" : "locked"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              whileHover={{ y: -4, scale: 1.03 }}
            >
              <div
                className="bw-card-icon"
                style={{
                  background: isEarned ? badge.color : "#e0e0e0",
                  boxShadow: isEarned
                    ? `0 4px 12px ${badge.color}40`
                    : "0 2px 6px rgba(0,0,0,0.06)",
                }}
              >
                {isEarned ? "\u2605" : "\u{1F512}"}
              </div>
              <span className="bw-card-name" style={{ color: isEarned ? badge.color : "#aaa" }}>
                {badge.name}
              </span>
              <span className="bw-card-level">
                {isEarned ? `第${badge.level}关` : "未解锁"}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Footer hint */}
      <p className="bw-footer">
        {collected === total
          ? "\u{1F3C6} 恭喜！你已收集全部徽章！"
          : "继续挑战关卡，解锁更多徽章吧 \u2728"}
      </p>

      {/* Styles */}
      <style>{`
        .bw-wrapper {
          min-height: 100vh;
          background: linear-gradient(180deg, #f8f6f2 0%, #f0ece4 100%);
          padding: 24px 16px 40px;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }
        .bw-header {
          max-width: 720px;
          margin: 0 auto 28px;
          text-align: center;
          position: relative;
        }
        .bw-back {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: #a898a0;
          text-decoration: none;
          margin-bottom: 12px;
          transition: color 0.2s;
        }
        .bw-back:hover { color: #8a6a7a; }
        .bw-close {
          position: absolute;
          top: 24px;
          right: 20px;
          font-size: 22px;
          color: #a898a0;
          text-decoration: none;
          line-height: 1;
          transition: color 0.2s;
        }
        .bw-close:hover { color: #8a6a7a; }
        .bw-title {
          font-size: 24px;
          font-weight: 700;
          color: #5a4a52;
          margin: 0 0 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .bw-icon { font-size: 28px; }
        .bw-subtitle {
          font-size: 13px;
          color: #a898a0;
          margin: 0 0 16px;
        }
        .bw-progress-wrap {
          max-width: 400px;
          margin: 0 auto 16px;
        }
        .bw-progress-bar {
          height: 8px;
          background: rgba(180,160,170,0.15);
          border-radius: 4px;
          overflow: hidden;
        }
        .bw-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #c8a8b8, #d4b8c8);
          border-radius: 4px;
          transition: width 0.6s ease;
        }
        .bw-progress-text {
          display: block;
          font-size: 12px;
          color: #a898a0;
          margin-top: 6px;
          font-weight: 600;
        }
        .bw-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          max-width: 720px;
          margin: 0 auto;
        }
        @media (max-width: 600px) {
          .bw-grid { grid-template-columns: repeat(3, 1fr); gap: 10px; }
        }
        @media (max-width: 400px) {
          .bw-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
        }
        .bw-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 16px 8px;
          background: rgba(255,255,255,0.7);
          border-radius: 14px;
          border: 1px solid rgba(180,160,170,0.1);
          transition: all 0.2s;
          cursor: default;
        }
        .bw-card.earned {
          background: rgba(255,255,255,0.9);
          border-color: rgba(180,160,170,0.15);
        }
        .bw-card.locked {
          opacity: 0.55;
        }
        .bw-card-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #fff;
          font-weight: 700;
          transition: all 0.3s;
        }
        .bw-card-name {
          font-size: 12px;
          font-weight: 700;
          text-align: center;
          line-height: 1.3;
        }
        .bw-card-level {
          font-size: 10px;
          color: #bbb;
        }
        .bw-footer {
          text-align: center;
          font-size: 13px;
          color: #a898a0;
          margin-top: 28px;
        }
        .bw-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 16px;
        }
        .bw-empty-text { font-size: 15px; color: #a898a0; }
        .bw-back-btn {
          padding: 8px 20px;
          background: #c8a8b8;
          color: #fff;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .bw-back-btn:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
};

export default BadgeWallPage;
