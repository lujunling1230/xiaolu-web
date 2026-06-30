import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * 回血清单 · Recharge List
 *
 * 专为 i 人设计的低能耗回血工具。
 * 拍立得抽卡：点击中央卡片 3D 翻转，抽取一件极小的回血小事。
 * 瀑布流查看全部 + 能量计数（localStorage 持久化）。
 */

/* ============================================================
   数据
   ============================================================ */
interface RechargeTask {
  id: number;
  text: string;
  imageUrl: string;
  tags: string[];
}

const tasks: RechargeTask[] = [
  {
    id: 1,
    text: "一个人去便利店闻面包香",
    imageUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=750&fit=crop",
    tags: ["低能耗", "感官"],
  },
  {
    id: 2,
    text: "整理手机相册里的一张截图",
    imageUrl:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=750&fit=crop",
    tags: ["低能耗", "秩序"],
  },
  {
    id: 3,
    text: "听一首小时候的歌",
    imageUrl:
      "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=600&h=750&fit=crop",
    tags: ["怀旧", "独处"],
  },
  {
    id: 4,
    text: "给窗台的植物浇一次水",
    imageUrl:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=750&fit=crop",
    tags: ["生命感", "低能耗"],
  },
  {
    id: 5,
    text: "泡一杯热茶，只看热气上升",
    imageUrl:
      "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=600&h=750&fit=crop",
    tags: ["感官", "独处"],
  },
  {
    id: 6,
    text: "把窗帘拉上，让房间暗五分钟",
    imageUrl:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=750&fit=crop",
    tags: ["低能耗", "安静"],
  },
  {
    id: 7,
    text: "写下一句今天不想做的事",
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=750&fit=crop",
    tags: ["释放", "独处"],
  },
  {
    id: 8,
    text: "去阳台吹一分钟风",
    imageUrl:
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=750&fit=crop",
    tags: ["感官", "低能耗"],
  },
  {
    id: 9,
    text: "用手摸一下毛衣的纹理",
    imageUrl:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=750&fit=crop",
    tags: ["感官", "独处"],
  },
  {
    id: 10,
    text: "关掉所有通知，安静地喝口水",
    imageUrl:
      "https://images.unsplash.com/photo-1548839140-29a749b1a4d2?w=600&h=750&fit=crop",
    tags: ["低能耗", "秩序"],
  },
  {
    id: 11,
    text: "看窗外发呆，数三朵云",
    imageUrl:
      "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=600&h=750&fit=crop",
    tags: ["低能耗", "感官"],
  },
  {
    id: 12,
    text: "把一首歌单曲循环三遍",
    imageUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=750&fit=crop",
    tags: ["怀旧", "独处"],
  },
];

/* ============================================================
   工具
   ============================================================ */
const STORAGE_KEY = "recharge_count";

function loadCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? Math.max(0, Number(raw) || 0) : 0;
  } catch {
    return 0;
  }
}

/** 判断 localStorage 中某 key 是否属于本周（周一为起点） */
function isThisWeek(): boolean {
  try {
    const ts = Number(localStorage.getItem("recharge_count_ts") || 0);
    if (!ts) return false;
    const now = new Date();
    const then = new Date(ts);
    const day = now.getDay() || 7; // 周日=7
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() - (day - 1));
    return then >= monday;
  } catch {
    return false;
  }
}

function getWeekStartCount(): number {
  return isThisWeek() ? loadCount() : 0;
}

/* ============================================================
   主组件
   ============================================================ */
const RechargePage: React.FC = () => {
  const [current, setCurrent] = useState<RechargeTask | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [lightbox, setLightbox] = useState<RechargeTask | null>(null);
  const [weekCount, setWeekCount] = useState<number>(getWeekStartCount);
  const [countBump, setCountBump] = useState(0);

  const pickRandom = useCallback((): RechargeTask => {
    const pool = current
      ? tasks.filter((t) => t.id !== current.id)
      : tasks;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [current]);

  const handleDraw = () => {
    if (flipping) return;
    setFlipping(true);
    setFlipped(false);
    // 翻转过半时切换内容
    window.setTimeout(() => {
      setCurrent(pickRandom());
      setFlipped(true);
    }, 350);
    window.setTimeout(() => setFlipping(false), 700);
  };

  const handleDone = () => {
    const next = weekCount + 1;
    setWeekCount(next);
    setCountBump((n) => n + 1);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
      localStorage.setItem("recharge_count_ts", String(Date.now()));
    } catch {
      /* ignore */
    }
  };

  // 锁定 lightbox 滚动
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [lightbox]);

  const randomTasks = useMemo(() => {
    // 瀑布流展示顺序随机
    return [...tasks].sort(() => Math.random() - 0.5);
  }, [showAll]);

  return (
    <div className="recharge-page">
      {/* 顶部返回 */}
      <header className="recharge-topbar">
        <Link to="/mickey" className="recharge-back">
          ← 回到妙妙屋
        </Link>
        <span className="recharge-topbar-meta">Recharge List</span>
      </header>

      {/* 标题区 */}
      <section className="recharge-hero">
        <motion.h1
          className="recharge-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          回血清单
        </motion.h1>
        <motion.p
          className="recharge-subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        >
          社交耗尽后，只做一件极小的事。
        </motion.p>
      </section>

      {/* 中央拍立得卡片 */}
      <section className="recharge-card-zone">
        <motion.div
          className="recharge-polaroid"
          onClick={handleDraw}
          style={{ perspective: 1200 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="recharge-polaroid-inner"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* 背面（初始） */}
            <div
              className="recharge-polaroid-face recharge-polaroid-back"
              style={{ backfaceVisibility: "hidden" }}
            >
              <span className="recharge-draw-icon">🔋</span>
              <p className="recharge-draw-text">
                {flipping ? "正在抽取…" : "点击抽取今日回血任务"}
              </p>
              <span className="recharge-draw-hint">轻轻一点</span>
            </div>

            {/* 正面（结果） */}
            <div
              className="recharge-polaroid-face recharge-polaroid-front"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <AnimatePresence mode="wait">
                {current && (
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="recharge-card-content"
                  >
                    <div className="recharge-card-img-wrap">
                      <img
                        src={current.imageUrl}
                        alt={current.text}
                        className="recharge-card-img"
                        loading="lazy"
                      />
                      <div className="recharge-card-img-tint" />
                    </div>
                    <p className="recharge-card-text">{current.text}</p>
                    <div className="recharge-card-tags">
                      {current.tags.map((t) => (
                        <span key={t} className="recharge-tag">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* 完成按钮 + 提示 */}
        <div className="recharge-card-actions">
          <p className="recharge-card-tip">
            {current ? "做了这件小事？标记一下。" : "抽到后，可以标记完成。"}
          </p>
          <button
            type="button"
            className="recharge-done-btn"
            onClick={handleDone}
            disabled={!current}
          >
            今天做了 ✅
          </button>
        </div>
      </section>

      {/* 查看全部 */}
      <section className="recharge-all-section">
        <button
          type="button"
          className="recharge-toggle-all"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? "收起小事" : "查看所有小事"}
        </button>

        <AnimatePresence>
          {showAll && (
            <motion.div
              className="recharge-masonry"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {randomTasks.map((t, i) => (
                <motion.button
                  key={t.id}
                  className="recharge-thumb"
                  onClick={() => setLightbox(t)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <img src={t.imageUrl} alt={t.text} loading="lazy" />
                  <span className="recharge-thumb-text">{t.text}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 能量计数（固定角） */}
      <motion.div
        className="recharge-counter"
        key={countBump}
        initial={{ scale: 0.9, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
      >
        <span className="recharge-counter-emoji">✨</span>
        <span className="recharge-counter-text">
          本周已回血 <b>{weekCount}</b> 次
        </span>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="recharge-lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="recharge-lightbox"
              initial={{ scale: 0.9, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 24 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="recharge-lightbox-close"
                onClick={() => setLightbox(null)}
                aria-label="关闭"
              >
                ×
              </button>
              <img
                src={lightbox.imageUrl}
                alt={lightbox.text}
                className="recharge-lightbox-img"
              />
              <div className="recharge-lightbox-body">
                <p className="recharge-lightbox-text">{lightbox.text}</p>
                <div className="recharge-card-tags">
                  {lightbox.tags.map((t) => (
                    <span key={t} className="recharge-tag">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .recharge-page,
        .recharge-page * { cursor: auto; }
        .recharge-page a, .recharge-page button,
        .recharge-page .recharge-polaroid { cursor: pointer; }

        .recharge-page {
          min-height: 100vh;
          color: #5a5048;
          background:
            radial-gradient(120% 80% at 50% 0%, #fffdf8 0%, #faf7f2 50%, #f4efe7 100%);
          font-family: "Noto Sans SC", system-ui, sans-serif;
          padding: 0 24px 120px;
        }

        /* 顶部 */
        .recharge-topbar {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 720px; margin: 0 auto; padding: 24px 4px 0;
        }
        .recharge-back {
          font-size: 14px; color: #9a8a7e; text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease, transform 0.25s ease;
        }
        .recharge-back:hover { color: #c8924a; transform: translateX(-3px); }
        .recharge-topbar-meta {
          font-size: 11px; color: #b8aa9a; letter-spacing: 0.28em; text-transform: uppercase;
        }

        /* 标题区 */
        .recharge-hero {
          max-width: 720px; margin: 0 auto; padding: 40px 4px 28px; text-align: center;
        }
        .recharge-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(28px, 5vw, 40px); font-weight: 600;
          color: #5a5048; margin: 0 0 10px; letter-spacing: 0.06em;
        }
        .recharge-subtitle {
          font-size: 15px; color: #9a8a7e; margin: 0; letter-spacing: 0.06em;
        }

        /* 卡片区 */
        .recharge-card-zone {
          max-width: 720px; margin: 0 auto; padding: 20px 4px 0;
          display: flex; flex-direction: column; align-items: center;
        }

        /* 拍立得卡片 */
        .recharge-polaroid {
          width: 280px; height: 380px; position: relative;
          background: #fff; padding: 16px 16px 24px;
          border-radius: 6px;
          box-shadow: 0 16px 40px -16px rgba(120, 100, 80, 0.3),
                      0 2px 6px rgba(120, 100, 80, 0.1);
        }
        .recharge-polaroid-inner {
          position: relative; width: 100%; height: 100%;
          transform-style: preserve-3d;
        }
        .recharge-polaroid-face {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          border-radius: 4px; overflow: hidden;
        }

        /* 背面 */
        .recharge-polaroid-back {
          background: linear-gradient(160deg, #fffdf8, #f7f1e8);
          gap: 14px;
        }
        .recharge-draw-icon { font-size: 56px; animation: recharge-pulse 2.4s ease-in-out infinite; }
        @keyframes recharge-pulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.12); opacity: 1; }
        }
        .recharge-draw-text {
          font-family: "Noto Serif SC", serif; font-size: 16px;
          color: #6b5e50; margin: 0; text-align: center; line-height: 1.7;
        }
        .recharge-draw-hint { font-size: 12px; color: #b8aa9a; letter-spacing: 0.1em; }

        /* 正面 */
        .recharge-polaroid-front {
          background: #fff;
        }
        .recharge-card-content {
          width: 100%; height: 100%; display: flex; flex-direction: column;
        }
        .recharge-card-img-wrap {
          position: relative; flex: 1; overflow: hidden; border-radius: 2px;
        }
        .recharge-card-img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          filter: sepia(0.15) saturate(0.85) brightness(0.96);
        }
        .recharge-card-img-tint {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(250, 247, 242, 0.4));
        }
        .recharge-card-text {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 17px; font-weight: 600; color: #5a5048;
          margin: 14px 0 8px; text-align: center; line-height: 1.5; padding: 0 6px;
        }
        .recharge-card-tags {
          display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;
          padding: 0 6px 4px;
        }
        .recharge-tag {
          font-size: 11px; color: #b89968; letter-spacing: 0.04em;
        }

        /* 操作 */
        .recharge-card-actions {
          margin-top: 26px; display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .recharge-card-tip { font-size: 13px; color: #b8aa9a; margin: 0; }
        .recharge-done-btn {
          padding: 11px 28px; border: none; border-radius: 999px;
          font-size: 14px; font-family: inherit; font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #c8924a, #b07832);
          box-shadow: 0 6px 18px -6px rgba(176, 120, 50, 0.5);
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .recharge-done-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .recharge-done-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* 查看全部 */
        .recharge-all-section { max-width: 720px; margin: 48px auto 0; text-align: center; }
        .recharge-toggle-all {
          font-size: 14px; color: #b07832; background: none; border: none;
          font-family: inherit; padding: 8px 20px;
          border-bottom: 1px solid rgba(176, 120, 50, 0.3);
          transition: color 0.25s ease, border-color 0.25s ease;
        }
        .recharge-toggle-all:hover { color: #c8924a; border-color: #c8924a; }

        /* 瀑布流 */
        .recharge-masonry {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
          margin-top: 28px; overflow: hidden;
        }
        @media (max-width: 640px) { .recharge-masonry { grid-template-columns: 1fr; } }
        .recharge-thumb {
          display: block; padding: 0; border: 1px solid #ece4dc; border-radius: 8px;
          overflow: hidden; background: #fff; text-align: left;
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .recharge-thumb:hover {
          border-color: rgba(200, 146, 74, 0.4);
          box-shadow: 0 12px 28px -12px rgba(120, 100, 80, 0.25);
        }
        .recharge-thumb img {
          width: 100%; height: 200px; object-fit: cover; display: block;
          filter: sepia(0.12) saturate(0.85);
        }
        .recharge-thumb-text {
          display: block; padding: 10px 12px; font-size: 13px; color: #6b5e50; line-height: 1.5;
        }

        /* 能量计数（固定右下角） */
        .recharge-counter {
          position: fixed; bottom: 24px; right: 24px; z-index: 40;
          display: flex; align-items: center; gap: 8px;
          padding: 10px 18px; border-radius: 999px;
          background: rgba(255, 253, 248, 0.92);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(200, 146, 74, 0.25);
          box-shadow: 0 8px 24px -10px rgba(120, 100, 80, 0.3);
        }
        .recharge-counter-emoji { font-size: 16px; }
        .recharge-counter-text { font-size: 13px; color: #6b5e50; letter-spacing: 0.03em; }
        .recharge-counter-text b { color: #b07832; font-size: 15px; }

        /* Lightbox */
        .recharge-lightbox-overlay {
          position: fixed; inset: 0; z-index: 200;
          display: flex; align-items: center; justify-content: center; padding: 24px;
          background: rgba(40, 30, 20, 0.75); backdrop-filter: blur(6px);
        }
        .recharge-lightbox {
          position: relative; width: 100%; max-width: 420px;
          background: #fff; border-radius: 8px; overflow: hidden;
          box-shadow: 0 30px 80px -20px rgba(0,0,0,0.5);
          max-height: 90vh; overflow-y: auto;
        }
        .recharge-lightbox-close {
          position: absolute; top: 10px; right: 12px; z-index: 3;
          width: 32px; height: 32px; border: none; border-radius: 50%;
          background: rgba(255,255,255,0.85); color: #5a5048; font-size: 20px;
          display: flex; align-items: center; justify-content: center;
        }
        .recharge-lightbox-img {
          width: 100%; height: 320px; object-fit: cover; display: block;
          filter: sepia(0.15) saturate(0.85) brightness(0.96);
        }
        .recharge-lightbox-body { padding: 22px 24px 26px; }
        .recharge-lightbox-text {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 18px; font-weight: 600; color: #5a5048; margin: 0 0 14px;
          line-height: 1.6;
        }

        @media (max-width: 520px) {
          .recharge-polaroid { width: 90vw; max-width: 300px; }
          .recharge-counter { bottom: 16px; right: 16px; padding: 8px 14px; }
        }
      `}</style>
    </div>
  );
};

export default RechargePage;
