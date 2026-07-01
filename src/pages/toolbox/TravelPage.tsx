import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * 漫游指南 · Travel Log
 *
 * 旅行足迹与攻略展示 —— 有温度的旅行记录。
 * 胶片 Hero + 简化中国地图（省份区块）+ 城市卡片横向滚动 + 详情 Modal。
 */

/* ============================================================
   数据：城市
   ============================================================ */
interface Spot {
  name: string;
  rating: number;
}
interface Eat {
  name: string;
  price: string;
  signature?: string;
}
interface City {
  id: number;
  name: string;
  province: string;
  slogan: string;
  imageUrl: string;
  days: number;
  play: Spot[];
  eat: Eat[];
  stay: string;
  tips: string;
}

const cities: City[] = [
  {
    id: 1,
    name: "大理",
    province: "云南",
    slogan: "风花雪月的慢生活",
    imageUrl:
      "https://images.unsplash.com/photo-1531219573917-2ca59e96bc0e?w=800&h=600&fit=crop",
    days: 5,
    play: [
      { name: "洱海骑行", rating: 5 },
      { name: "苍山索道", rating: 4 },
      { name: "喜洲古镇", rating: 4 },
    ],
    eat: [
      { name: "石锅鱼", price: "¥120/人", signature: "洱海弓鱼" },
      { name: "烤乳扇", price: "¥10/份" },
    ],
    stay: "古城里的白族小院，推窗见苍山。",
    tips: "环洱海建议租电动车，防晒很重要。古城晚上很热闹，但清晨最安静。",
  },
  {
    id: 2,
    name: "成都",
    province: "四川",
    slogan: "一座来了就不想走的城",
    imageUrl:
      "https://images.unsplash.com/photo-1593696954577-ab3d39317b97?w=800&h=600&fit=crop",
    days: 4,
    play: [
      { name: "大熊猫繁育基地", rating: 5 },
      { name: "宽窄巷子", rating: 4 },
      { name: "杜甫草堂", rating: 4 },
    ],
    eat: [
      { name: "小龙坎火锅", price: "¥90/人", signature: "牛油锅底" },
      { name: "陈麻婆豆腐", price: "¥40/人" },
    ],
    stay: "春熙路附近，交通方便，夜宵下楼就有。",
    tips: "熊猫基地一定要早去！8点前到能看到活跃的熊猫。茶馆发呆是必修课。",
  },
  {
    id: 3,
    name: "苏州",
    province: "江苏",
    slogan: "小桥流水人家的江南梦",
    imageUrl:
      "https://images.unsplash.com/photo-1599779019475-d5c9e7c2c1f0?w=800&h=600&fit=crop",
    days: 3,
    play: [
      { name: "拙政园", rating: 5 },
      { name: "平江路", rating: 4 },
      { name: "虎丘", rating: 4 },
    ],
    eat: [
      { name: "松鹤楼", price: "¥150/人", signature: "松鼠桂鱼" },
      { name: "哑巴生煎", price: "¥25/人" },
    ],
    stay: "平江路民宿，推门就是水巷。",
    tips: "园林建议错峰，工作日早晨人最少。评弹博物馆值得去，免费且安静。",
  },
  {
    id: 4,
    name: "厦门",
    province: "福建",
    slogan: "海风里藏着文艺的味道",
    imageUrl:
      "https://images.unsplash.com/photo-1528219089975-1c5b2c2c3c1f?w=800&h=600&fit=crop",
    days: 4,
    play: [
      { name: "鼓浪屿", rating: 5 },
      { name: "曾厝垵", rating: 4 },
      { name: "环岛路骑行", rating: 5 },
    ],
    eat: [
      { name: "沙茶面", price: "¥25/人" },
      { name: "海蛎煎", price: "¥30/人" },
    ],
    stay: "曾厝垵的文艺客栈，离海步行 5 分钟。",
    tips: "鼓浪屿船票提前买！岛上没有车，穿好走的鞋。日落去日光岩。",
  },
  {
    id: 5,
    name: "西安",
    province: "陕西",
    slogan: "一眼千年，长安如故",
    imageUrl:
      "https://images.unsplash.com/photo-1591851658485-c5f6c6b7e0e8?w=800&h=600&fit=crop",
    days: 5,
    play: [
      { name: "秦始皇兵马俑", rating: 5 },
      { name: "大唐不夜城", rating: 5 },
      { name: "城墙骑行", rating: 4 },
    ],
    eat: [
      { name: "回民街老孙家", price: "¥60/人", signature: "羊肉泡馍" },
      { name: "肉夹馍", price: "¥12/个" },
    ],
    stay: "钟楼附近，夜景绝美，去哪都方便。",
    tips: "兵马俑请讲解员！不然就是看泥人。城墙骑行选傍晚，不晒还凉快。",
  },
  {
    id: 6,
    name: "杭州",
    province: "浙江",
    slogan: "山寺月中寻桂子",
    imageUrl:
      "https://images.unsplash.com/photo-1591868050309-7d2b1e2f6c1a?w=800&h=600&fit=crop",
    days: 4,
    play: [
      { name: "西湖泛舟", rating: 5 },
      { name: "灵隐寺", rating: 5 },
      { name: "龙井村采茶", rating: 4 },
    ],
    eat: [
      { name: "楼外楼", price: "¥200/人", signature: "西湖醋鱼" },
      { name: "知味观小笼", price: "¥35/人" },
    ],
    stay: "西湖边民宿，清晨湖边散步没人打扰。",
    tips: "西湖别只逛断桥！苏堤人少景美。秋天满陇桂雨的香气会记住一辈子。",
  },
];

/* ============================================================
   数据：省份（简化区块布局，近似地理位置）
   ============================================================ */
interface ProvinceBlock {
  name: string;
  x: number; // SVG 坐标
  y: number;
  w: number;
  h: number;
  visited: boolean;
  count: number;
}

// 简化中国地图：主要省份按近似地理位置排列为圆角矩形
const provinces: ProvinceBlock[] = [
  // 东北
  { name: "黑龙江", x: 330, y: 20, w: 50, h: 35, visited: false, count: 0 },
  { name: "吉林", x: 315, y: 58, w: 38, h: 28, visited: false, count: 0 },
  { name: "辽宁", x: 300, y: 90, w: 42, h: 28, visited: false, count: 0 },
  // 华北
  { name: "内蒙古", x: 200, y: 30, w: 110, h: 35, visited: false, count: 0 },
  { name: "北京", x: 270, y: 75, w: 22, h: 18, visited: true, count: 3 },
  { name: "河北", x: 255, y: 95, w: 48, h: 32, visited: true, count: 2 },
  { name: "山西", x: 225, y: 100, w: 30, h: 35, visited: false, count: 0 },
  // 西北
  { name: "新疆", x: 60, y: 45, w: 90, h: 55, visited: false, count: 0 },
  { name: "甘肃", x: 150, y: 80, w: 48, h: 50, visited: false, count: 0 },
  { name: "陕西", x: 200, y: 110, w: 32, h: 40, visited: true, count: 1 },
  { name: "青海", x: 100, y: 130, w: 55, h: 38, visited: false, count: 0 },
  // 西南
  { name: "西藏", x: 40, y: 160, w: 80, h: 60, visited: false, count: 0 },
  { name: "四川", x: 165, y: 160, w: 50, h: 48, visited: true, count: 1 },
  { name: "重庆", x: 215, y: 175, w: 22, h: 25, visited: false, count: 0 },
  { name: "云南", x: 130, y: 220, w: 48, h: 42, visited: true, count: 1 },
  { name: "贵州", x: 185, y: 210, w: 30, h: 30, visited: false, count: 0 },
  // 华中华东
  { name: "湖北", x: 225, y: 150, w: 38, h: 32, visited: false, count: 0 },
  { name: "河南", x: 230, y: 120, w: 36, h: 28, visited: false, count: 0 },
  { name: "山东", x: 275, y: 115, w: 42, h: 28, visited: false, count: 0 },
  { name: "江苏", x: 275, y: 150, w: 36, h: 28, visited: true, count: 1 },
  { name: "安徽", x: 255, y: 150, w: 24, h: 32, visited: false, count: 0 },
  { name: "浙江", x: 285, y: 182, w: 32, h: 28, visited: true, count: 1 },
  { name: "上海", x: 305, y: 168, w: 16, h: 16, visited: true, count: 5 },
  // 华南
  { name: "江西", x: 260, y: 200, w: 32, h: 32, visited: false, count: 0 },
  { name: "湖南", x: 220, y: 195, w: 34, h: 32, visited: false, count: 0 },
  { name: "福建", x: 285, y: 215, w: 32, h: 35, visited: true, count: 1 },
  { name: "广东", x: 250, y: 235, w: 42, h: 30, visited: false, count: 0 },
  { name: "广西", x: 205, y: 235, w: 38, h: 30, visited: false, count: 0 },
  { name: "海南", x: 230, y: 275, w: 28, h: 18, visited: false, count: 0 },
];

const MAP_W = 360;
const MAP_H = 310;

/* ============================================================
   工具
   ============================================================ */
const VISITED_GREEN = "#5d8a6a";
const UNVISITED_GRAY = "#e8e2d4";

/* ============================================================
   主组件
   ============================================================ */
const TravelPage: React.FC = () => {
  const [hovered, setHovered] = useState<ProvinceBlock | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [activeCity, setActiveCity] = useState<City | null>(null);

  // 统计
  const stats = useMemo(() => {
    const visitedProvinces = provinces.filter((p) => p.visited).length;
    const totalCities = cities.length;
    const totalDays = cities.reduce((s, c) => s + c.days, 0);
    return { visitedProvinces, totalCities, totalDays };
  }, []);

  // 锁定 Modal 滚动
  useEffect(() => {
    if (activeCity) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [activeCity]);

  const handleProvinceHover = (
    p: ProvinceBlock,
    e: React.MouseEvent
  ) => {
    setHovered(p);
    const rect = (e.currentTarget as SVGElement).closest("svg")!.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="travel-page">
      {/* ===== Hero ===== */}
      <header className="travel-hero">
        <div className="travel-hero-bg" />
        <div className="travel-hero-grain" />
        <div className="travel-hero-content">
          <Link to="/mickey" className="travel-back">
            ← 回到妙妙工具箱
          </Link>
          <motion.h1
            className="travel-hero-title"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            漫游指南
          </motion.h1>
          <motion.p
            className="travel-hero-sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            走过的路，看过的云。
          </motion.p>
          <span className="travel-hero-meta">Travel Log</span>
        </div>
      </header>

      {/* ===== 足迹地图 ===== */}
      <section className="travel-section">
        <div className="travel-section-head">
          <span className="travel-stamp">足迹</span>
          <h2 className="travel-section-title">走过的土地</h2>
        </div>

        <div className="travel-map-wrap">
          <svg
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            className="travel-map"
            onMouseLeave={() => setHovered(null)}
          >
            {provinces.map((p) => (
              <g key={p.name}>
                <rect
                  x={p.x}
                  y={p.y}
                  width={p.w}
                  height={p.h}
                  rx={5}
                  fill={p.visited ? VISITED_GREEN : UNVISITED_GRAY}
                  stroke={p.visited ? "#4d7a5a" : "#d4ccbe"}
                  strokeWidth={0.6}
                  opacity={hovered?.name === p.name ? 1 : p.visited ? 0.85 : 0.6}
                  style={{ cursor: "pointer", transition: "opacity 0.2s ease" }}
                  onMouseEnter={(e) => handleProvinceHover(p, e)}
                  onMouseMove={(e) => handleProvinceHover(p, e)}
                />
                <text
                  x={p.x + p.w / 2}
                  y={p.y + p.h / 2 + 3}
                  textAnchor="middle"
                  fontSize={p.name.length > 2 ? 6.5 : 7.5}
                  fill={p.visited ? "#fff" : "#a89e8e"}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {p.name}
                </text>
              </g>
            ))}
          </svg>

          {/* Tooltip */}
          {hovered && (
            <div
              className="travel-tooltip"
              style={{ left: tooltipPos.x, top: tooltipPos.y }}
            >
              {hovered.visited ? (
                <span>{hovered.name}：去过 {hovered.count} 次</span>
              ) : (
                <span>{hovered.name}：还没去过</span>
              )}
            </div>
          )}

          {/* 图例 */}
          <div className="travel-legend">
            <span className="travel-legend-item">
              <span className="travel-legend-dot" style={{ background: VISITED_GREEN }} />
              已去过
            </span>
            <span className="travel-legend-item">
              <span className="travel-legend-dot" style={{ background: UNVISITED_GRAY }} />
              待探索
            </span>
          </div>
        </div>

        {/* 数据看板 */}
        <div className="travel-stats">
          <div className="travel-stat-pill">
            <span className="travel-stat-emoji">📍</span>
            <span className="travel-stat-num">{stats.visitedProvinces}</span>
            <span className="travel-stat-label">省</span>
          </div>
          <div className="travel-stat-pill">
            <span className="travel-stat-emoji">🏙️</span>
            <span className="travel-stat-num">{stats.totalCities}</span>
            <span className="travel-stat-label">城</span>
          </div>
          <div className="travel-stat-pill">
            <span className="travel-stat-emoji">📅</span>
            <span className="travel-stat-num">{stats.totalDays}</span>
            <span className="travel-stat-label">天</span>
          </div>
        </div>
      </section>

      {/* ===== 城市画廊 ===== */}
      <section className="travel-section">
        <div className="travel-section-head">
          <span className="travel-stamp">攻略</span>
          <h2 className="travel-section-title">城市记忆</h2>
        </div>

        <div className="travel-cards-scroll">
          <div className="travel-cards-track">
            {cities.map((c, i) => (
              <motion.button
                key={c.id}
                className="travel-city-card"
                onClick={() => setActiveCity(c)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <div className="travel-card-img-wrap">
                  <img src={c.imageUrl} alt={c.name} loading="lazy" />
                  <div className="travel-card-tape" />
                  <span className="travel-card-days">{c.days}天</span>
                </div>
                <div className="travel-card-body">
                  <h3 className="travel-card-name">{c.name}</h3>
                  <p className="travel-card-slogan">{c.slogan}</p>
                  <span className="travel-card-province">{c.province}</span>
                </div>
                <span className="travel-card-cta">查看攻略 →</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <footer className="travel-foot">
        <span>走过的路都算数，看过的云都不散。</span>
      </footer>

      {/* ===== 城市详情 Modal ===== */}
      <AnimatePresence>
        {activeCity && (
          <motion.div
            className="travel-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCity(null)}
          >
            <motion.div
              className="travel-modal"
              initial={{ scale: 0.92, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 30 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="travel-modal-close"
                onClick={() => setActiveCity(null)}
                aria-label="关闭"
              >
                ×
              </button>
              <div className="travel-modal-cover">
                <img src={activeCity.imageUrl} alt={activeCity.name} />
                <div className="travel-modal-cover-tint" />
                <div className="travel-modal-cover-text">
                  <h3 className="travel-modal-name">{activeCity.name}</h3>
                  <p className="travel-modal-slogan">{activeCity.slogan}</p>
                </div>
              </div>

              <div className="travel-modal-body">
                {/* 玩 */}
                <div className="travel-modal-section">
                  <h4 className="travel-modal-h4">🎯 玩</h4>
                  <ul className="travel-modal-list">
                    {activeCity.play.map((s) => (
                      <li key={s.name} className="travel-modal-list-item">
                        <span>{s.name}</span>
                        <span className="travel-modal-rating">
                          {"★".repeat(s.rating)}
                          <span className="travel-modal-rating-empty">
                            {"★".repeat(5 - s.rating)}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* 吃 */}
                <div className="travel-modal-section">
                  <h4 className="travel-modal-h4">🍜 吃</h4>
                  <ul className="travel-modal-list">
                    {activeCity.eat.map((s) => (
                      <li key={s.name} className="travel-modal-list-item">
                        <span>
                          {s.name}
                          {s.signature && (
                            <em className="travel-modal-signature"> · {s.signature}</em>
                          )}
                        </span>
                        <span className="travel-modal-price">{s.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* 住 */}
                <div className="travel-modal-section">
                  <h4 className="travel-modal-h4">🛏️ 住</h4>
                  <p className="travel-modal-text">{activeCity.stay}</p>
                </div>
                {/* Tips */}
                <div className="travel-modal-section travel-modal-tips">
                  <h4 className="travel-modal-h4">💡 Tips</h4>
                  <p className="travel-modal-text">{activeCity.tips}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .travel-page,
        .travel-page * { cursor: auto; }
        .travel-page a, .travel-page button { cursor: pointer; }

        .travel-page {
          min-height: 100vh; color: #4a4036;
          background: #faf6ee;
          font-family: "Noto Sans SC", system-ui, sans-serif;
        }

        /* Hero */
        .travel-hero {
          position: relative; height: 52vh; min-height: 360px;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .travel-hero-bg {
          position: absolute; inset: 0;
          background: url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&h=900&fit=crop") center/cover;
          filter: blur(3px) brightness(0.7);
          transform: scale(1.05);
        }
        .travel-hero-grain {
          position: absolute; inset: 0; opacity: 0.08; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .travel-hero-content { position: relative; z-index: 2; text-align: center; }
        .travel-back {
          position: absolute; top: 16px; left: 16px;
          font-size: 14px; color: rgba(255,255,255,0.8); text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease;
        }
        .travel-back:hover { color: #fff; }
        .travel-hero-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(36px, 6vw, 56px); font-weight: 700; color: #fff;
          margin: 0 0 12px; letter-spacing: 0.1em;
          text-shadow: 0 2px 20px rgba(0,0,0,0.4);
        }
        .travel-hero-sub {
          font-size: 16px; color: rgba(255,255,255,0.85); margin: 0;
          letter-spacing: 0.12em; font-style: italic;
        }
        .travel-hero-meta {
          display: block; margin-top: 16px; font-size: 11px;
          color: rgba(255,255,255,0.5); letter-spacing: 0.3em; text-transform: uppercase;
        }

        /* Section */
        .travel-section { max-width: 960px; margin: 0 auto; padding: 56px 24px; }
        .travel-section-head { display: flex; align-items: center; gap: 14px; margin-bottom: 32px; }
        .travel-stamp {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 3px 14px; border: 2px solid #b07832; border-radius: 4px;
          font-size: 13px; font-weight: 700; color: #b07832;
          transform: rotate(-3deg); opacity: 0.8;
        }
        .travel-section-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 26px; font-weight: 700; color: #5d8a6a; margin: 0;
        }

        /* 地图 */
        .travel-map-wrap {
          position: relative; background: #fffdf6;
          border: 1px solid #ece4d4; border-radius: 14px;
          padding: 24px; box-shadow: 0 10px 30px -14px rgba(120,100,60,0.15);
        }
        .travel-map { display: block; width: 100%; max-width: 520px; height: auto; margin: 0 auto; }
        .travel-tooltip {
          position: absolute; z-index: 10; pointer-events: none;
          padding: 6px 12px; border-radius: 6px;
          background: rgba(74,64,54,0.92); color: #fff; font-size: 12px;
          white-space: nowrap; transform: translate(-50%, -130%);
          box-shadow: 0 4px 14px -4px rgba(0,0,0,0.3);
        }
        .travel-legend {
          display: flex; justify-content: center; gap: 24px; margin-top: 16px;
        }
        .travel-legend-item {
          display: flex; align-items: center; gap: 6px; font-size: 13px; color: #9a8a7e;
        }
        .travel-legend-dot { width: 12px; height: 12px; border-radius: 3px; }

        /* 数据看板 */
        .travel-stats {
          display: flex; justify-content: center; gap: 16px; margin-top: 28px;
        }
        .travel-stat-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 10px 20px; border-radius: 999px;
          background: #fff; border: 1px solid #ece4d4;
          box-shadow: 0 4px 14px -6px rgba(120,100,60,0.12);
        }
        .travel-stat-emoji { font-size: 16px; }
        .travel-stat-num { font-size: 20px; font-weight: 700; color: #5d8a6a; }
        .travel-stat-label { font-size: 13px; color: #9a8a7e; }

        /* 城市卡片横向滚动 */
        .travel-cards-scroll {
          overflow-x: auto; scrollbar-width: thin; scrollbar-color: #c8924a transparent;
          -webkit-overflow-scrolling: touch;
        }
        .travel-cards-scroll::-webkit-scrollbar { height: 6px; }
        .travel-cards-scroll::-webkit-scrollbar-thumb { background: rgba(200,146,74,0.3); border-radius: 3px; }
        .travel-cards-track {
          display: flex; gap: 20px; padding: 8px 4px 20px;
          scroll-snap-type: x mandatory;
        }
        .travel-city-card {
          flex-shrink: 0; width: 280px; scroll-snap-align: start;
          background: #fff; border: 1px solid #ece4d4; border-radius: 12px;
          overflow: hidden; text-align: left; padding: 0;
          box-shadow: 0 10px 28px -12px rgba(120,100,60,0.18);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .travel-city-card:hover {
          border-color: rgba(93,138,106,0.4);
          box-shadow: 0 18px 40px -12px rgba(120,100,60,0.28);
        }
        @media (max-width: 640px) { .travel-city-card { width: 85vw; } }
        .travel-card-img-wrap { position: relative; height: 180px; overflow: hidden; }
        .travel-card-img-wrap img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          filter: sepia(0.1) saturate(0.9);
        }
        .travel-card-tape {
          position: absolute; top: -8px; left: 50%; transform: translateX(-50%) rotate(-2deg);
          width: 70px; height: 22px; background: rgba(255,235,180,0.7);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .travel-card-days {
          position: absolute; bottom: 8px; right: 8px;
          padding: 2px 10px; border-radius: 999px;
          font-size: 12px; color: #fff; background: rgba(93,138,106,0.85);
        }
        .travel-card-body { padding: 16px 18px 8px; }
        .travel-card-name {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 20px; font-weight: 700; color: #4a4036; margin: 0 0 4px;
        }
        .travel-card-slogan { font-size: 13px; color: #8a7a6e; margin: 0 0 8px; }
        .travel-card-province {
          font-size: 11px; color: #b07832; letter-spacing: 0.1em;
        }
        .travel-card-cta {
          display: block; padding: 12px 18px 16px; font-size: 13px;
          color: #5d8a6a; font-weight: 600; letter-spacing: 0.03em;
        }

        /* 页脚 */
        .travel-foot {
          text-align: center; padding: 32px 24px 56px;
          font-size: 13px; color: #b8aa9a; font-style: italic; letter-spacing: 0.06em;
        }

        /* Modal */
        .travel-modal-overlay {
          position: fixed; inset: 0; z-index: 200;
          display: flex; align-items: center; justify-content: center; padding: 20px;
          background: rgba(40,32,24,0.7); backdrop-filter: blur(6px);
        }
        .travel-modal {
          position: relative; width: 100%; max-width: 500px;
          background: #fffdf6; border-radius: 14px; overflow: hidden;
          box-shadow: 0 30px 80px -20px rgba(0,0,0,0.5);
          max-height: 90vh; overflow-y: auto;
        }
        .travel-modal-close {
          position: absolute; top: 12px; right: 14px; z-index: 5;
          width: 34px; height: 34px; border: none; border-radius: 50%;
          background: rgba(255,255,255,0.85); color: #4a4036; font-size: 22px;
          display: flex; align-items: center; justify-content: center;
        }
        .travel-modal-close:hover { background: #fff; }
        .travel-modal-cover { position: relative; height: 200px; overflow: hidden; }
        .travel-modal-cover img {
          width: 100%; height: 100%; object-fit: cover;
          filter: sepia(0.1) brightness(0.85);
        }
        .travel-modal-cover-tint {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.5));
        }
        .travel-modal-cover-text {
          position: absolute; bottom: 20px; left: 24px; right: 24px;
        }
        .travel-modal-name {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 28px; font-weight: 700; color: #fff; margin: 0 0 4px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }
        .travel-modal-slogan { font-size: 14px; color: rgba(255,255,255,0.9); margin: 0; font-style: italic; }
        .travel-modal-body { padding: 24px; }
        .travel-modal-section { margin-bottom: 24px; }
        .travel-modal-h4 {
          font-size: 16px; font-weight: 700; color: #5d8a6a; margin: 0 0 12px;
        }
        .travel-modal-list { list-style: none; margin: 0; padding: 0; }
        .travel-modal-list-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 0; border-bottom: 1px dashed #ece4d4; font-size: 14px; color: #4a4036;
        }
        .travel-modal-rating { color: #f5a623; font-size: 13px; letter-spacing: 1px; }
        .travel-modal-rating-empty { color: #ddd4c6; }
        .travel-modal-signature { font-style: normal; color: #b07832; font-size: 12px; }
        .travel-modal-price { color: #8a7a6e; font-size: 13px; }
        .travel-modal-text { font-size: 14px; line-height: 1.8; color: #6b5e50; margin: 0; }
        .travel-modal-tips {
          padding: 16px; border-radius: 8px; background: rgba(176,120,50,0.06);
          border-left: 3px solid #c8924a;
        }
        .travel-modal-tips .travel-modal-text { font-size: 13px; }

        @media (max-width: 640px) {
          .travel-modal-cover { height: 160px; }
          .travel-modal-body { padding: 20px; }
        }
      `}</style>
    </div>
  );
};

export default TravelPage;
