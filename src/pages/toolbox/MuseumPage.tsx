import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * 时光博物馆 · Museum of Memories
 *
 * 个人作品集压轴篇章 —— 双展厅回忆录。
 * 展厅一「时代回响」：横向时间轴 + 收藏品卡片 + Lightbox。
 * 展厅二「荣耀之路」：垂直时间轴 + 高光时刻 + 展开复盘。
 * 复古胶片风：深褐底、暗金边框、尘埃飘落、胶片显影。
 */

/* ============================================================
   数据类型与硬编码数据
   ============================================================ */
type Category = "collection" | "honor";

interface Memory {
  id: number;
  year: string;
  title: string;
  category: Category;
  description: string;
  imageUrl: string;
  reflection?: string;
  emoji?: string;
}

const memories: Memory[] = [
  {
    id: 1,
    year: "2005",
    title: "小浣熊水浒卡",
    category: "collection",
    description: "为了凑齐一百单八将，吃了整整一个夏天的干脆面。",
    imageUrl:
      "https://images.unsplash.com/photo-1606187996762-c39bb1c97a02?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    year: "2008",
    title: "Nokia 3310",
    category: "collection",
    description: "那台摔不坏的手机，装着整个青春的短信和贪吃蛇记录。",
    imageUrl:
      "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    year: "2010",
    title: "iPod Classic",
    category: "collection",
    description: "160G 的音乐宇宙，转盘一滑，就是一整个下午。",
    imageUrl:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    year: "2012",
    title: "磁带与随身听",
    category: "collection",
    description: "用铅笔倒带的日子，A 面听完翻 B 面，每首歌都得来不易。",
    imageUrl:
      "https://images.unsplash.com/photo-1605659822928-d2c78ce4c693?w=800&h=600&fit=crop",
  },
  {
    id: 5,
    year: "2021",
    title: "优秀学生奖学金",
    category: "honor",
    description: "连续两学期专业前 5%，是对自律最好的回报。",
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
    reflection: "努力不会被辜负，它只是在等一个合适的时机开花。",
  },
  {
    id: 6,
    year: "2023",
    title: "首个马拉松完赛",
    category: "honor",
    description: "42.195 公里，是对意志力的极限测试。",
    imageUrl:
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&h=600&fit=crop",
    reflection: "慢一点也没关系，只要不停下。",
  },
  {
    id: 7,
    year: "2024",
    title: "AI 产品实习 Offer",
    category: "honor",
    description: "从软件工程转向 AI 产品，跨出的这一步，走对了。",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
    reflection: "所有的弯路，都是为了让你在正路上走得更稳。",
  },
];

/* ============================================================
   复古报纸风格数据
   ============================================================ */
interface VintageCard {
  id: string;
  year: string;
  title: string;
  description: string;
}

const BGM_CARDS: VintageCard[] = [
  { id: "bgm-2002", year: "2002", title: "刀郎《2002年的第一场雪》", description: "当年大街小巷都在放的歌，是刻在 DNA 里的旋律。" },
  { id: "bgm-2003", year: "2003", title: "周杰伦《稻香》", description: `前奏的蟋蟀声一响，就仿佛回到了那个无忧无虑的夏天，相信"回家吧，回到最初的美好"。` },
  { id: "bgm-2004", year: "2004", title: "S.H.E《中国话》", description: `"全世界都在学中国话"，这首歌的旋律一响，三个女孩的身影就浮现在眼前。` },
  { id: "bgm-2005", year: "2005", title: "王心凌《那年夏天宁静的海》", description: "甜心教主的歌，总是伴随着偶像剧里又傻又可爱的画面，唱进很多人的心里。" },
  { id: "bgm-2006", year: "2006", title: "孙燕姿《我怀念的》", description: "每次听到，都会有不一样的感悟，是争吵后想要爱你的冲动，还是无话不说的从前？" },
  { id: "bgm-2007", year: "2007", title: "梁静茹《崇拜》", description: `经典的"梁式情歌"，打动了多少年轻女孩的心，纯粹又悲伤。` },
  { id: "bgm-2008", year: "2008", title: "五月天《倔强》", description: `"我和我最后的倔强，握紧双手绝对不放"，是青春里最热血的口号。` },
  { id: "bgm-2011", year: "2011", title: "陈奕迅《十年》", description: "一首歌的时间，仿佛经历了一场漫长的告别，教会我们成长。" },
];

const TV_CARDS: VintageCard[] = [
  { id: "tv-1999", year: "1999", title: "《还珠格格》（重播巅峰）", description: `每年寒暑假的必备经典，小燕子的古灵精怪和"当"的歌声，是几代人的共同记忆。` },
  { id: "tv-2005a", year: "2005", title: "《武林外传》", description: "同福客栈里的点点滴滴，让我们在欢笑中懂得了江湖与人生。" },
  { id: "tv-2005b", year: "2005", title: "《仙剑奇侠传》", description: "李逍遥和赵灵儿的仙侠梦，配上《杀破狼》和《六月的雨》，是无数人的意难平。" },
  { id: "tv-2005c", year: "2005", title: "《恶作剧之吻》", description: "袁湘琴和江直树的故事，让每个女孩都幻想过自己的白马王子。" },
  { id: "tv-2014", year: "2014", title: "《来自星星的你》", description: `引爆全民追剧热潮的韩剧，都敏俊和千颂伊让"我好像爱上你了"成了流行语。` },
  { id: "tv-2005d", year: "2005", title: "《家有儿女》", description: "刘星、夏雪、夏雨一家的欢乐日常，是童年最温暖的背景音。" },
];

const NET_CARDS: VintageCard[] = [
  { id: "net-1", year: "2005-2009", title: "QQ 空间与火星文", description: `每天精心挑选的 QQ 秀、非主流的伤感头像和满屏的火星文，是我们最初在网络上构建的"另一个世界"。` },
  { id: "net-2", year: "2004-2008", title: "Flash 小游戏", description: `办公室里偷偷玩的"黄金矿工"、"森林冰火人"，还有后来风靡全球的"愤怒的小鸟"和"地铁跑酷"，是青春里最摸鱼的黑历史。` },
  { id: "net-3", year: "2009-2012", title: "贴吧与论坛", description: `为了追星，在贴吧里疯狂刷帖，看同人文，分享资源，是第一批"网友"聚集地。` },
];

/* ============================================================
   复古报纸卡片组件
   ============================================================ */
const VintageCard: React.FC<{ card: VintageCard; emoji: string }> = ({ card, emoji }) => (
  <div className="vintage-card">
    {/* 年份邮票标签 */}
    <div className="vintage-year-stamp">{card.year}</div>
    {/* 内容区 */}
    <div className="vintage-card-content">
      <div className="vintage-card-icon">{emoji}</div>
      <div className="vintage-card-body">
        <h4 className="vintage-card-title">{card.title}</h4>
        <p className="vintage-card-desc">"{card.description}"</p>
      </div>
    </div>
  </div>
);

/* ============================================================
   横向滑动长廊组件
   ============================================================ */
const VintageGallery: React.FC<{
  title: string;
  emoji: string;
  cards: VintageCard[];
}> = ({ title, emoji, cards }) => (
  <div className="vintage-section">
    <div className="vintage-section-header">
      <span className="vintage-section-emoji">{emoji}</span>
      <h3 className="vintage-section-title">{title}</h3>
    </div>
    <div className="vintage-gallery-scroll">
      <div className="vintage-gallery-track">
        {cards.map(card => (
          <VintageCard key={card.id} card={card} emoji={emoji} />
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   工具
   ============================================================ */
const GOLD = "#b08d57";

/* ============================================================
   子组件：尘埃粒子（缓慢飘落）
   ============================================================ */
const DustParticles: React.FC = () => {
  const dusts = useMemo(
    () =>
      Array.from({ length: 18 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: Math.random() * 10 + 14,
        size: Math.random() * 3 + 1.5,
        drift: (Math.random() - 0.5) * 60,
      })),
    []
  );

  return (
    <div className="museum-dust-layer" aria-hidden="true">
      {dusts.map((d, i) => (
        <motion.span
          key={i}
          className="museum-dust"
          style={{ left: `${d.left}%`, width: d.size, height: d.size }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: "110vh", opacity: [0, 0.6, 0.6, 0], x: d.drift }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

/* ============================================================
   子组件：胶片显影图片
   ============================================================ */
const FilmImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={className ? `museum-film-wrap ${className}` : "museum-film-wrap"}>
      {!loaded && <div className="museum-film-placeholder" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="museum-film-img"
        style={{
          opacity: loaded ? 1 : 0,
          filter: loaded ? "blur(0px)" : "blur(14px)",
          transition: "opacity 1.2s ease, filter 1.2s ease",
        }}
      />
    </div>
  );
};

/* ============================================================
   子组件：Lightbox 灯箱
   ============================================================ */
const Lightbox: React.FC<{
  memory: Memory;
  onClose: () => void;
}> = ({ memory, onClose }) => (
  <motion.div
    className="museum-lightbox-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="museum-lightbox"
      initial={{ scale: 0.92, y: 24 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.92, y: 24 }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
      onClick={(e) => e.stopPropagation()}
    >
      <button className="museum-lightbox-close" onClick={onClose} aria-label="关闭">
        ×
      </button>
      <FilmImage src={memory.imageUrl} alt={memory.title} />
      <div className="museum-lightbox-body">
        <span className="museum-lightbox-year">{memory.year}</span>
        <h3 className="museum-lightbox-title">{memory.title}</h3>
        <p className="museum-lightbox-desc">{memory.description}</p>
        {memory.reflection && (
          <p className="museum-lightbox-reflection">
            <span className="museum-reflection-mark">"</span>
            {memory.reflection}
          </p>
        )}
      </div>
    </motion.div>
  </motion.div>
);

/* ============================================================
   主组件
   ============================================================ */
const MuseumPage: React.FC = () => {
  const [active, setActive] = useState<Memory | null>(null);

  const honors = useMemo(
    () => memories.filter((m) => m.category === "honor"),
    []
  );

  // 锁定背景滚动
  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [active]);

  return (
    <div className="museum-page">
      <DustParticles />

      {/* 顶部返回 */}
      <header className="museum-topbar">
        <Link to="/mickey" className="museum-back">
          ← 回到妙妙工具箱
        </Link>
        <span className="museum-topbar-meta">Museum of Memories</span>
      </header>

      {/* 标题区 */}
      <section className="museum-hero">
        <motion.h1
          className="museum-hero-title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          时光博物馆
        </motion.h1>
        <motion.p
          className="museum-hero-sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          每一步都算数。
        </motion.p>
      </section>

      {/* ===== 展厅一：时代回响（复古报纸风格）===== */}
      <section className="museum-hall museum-era-section">
        <div className="museum-hall-head">
          <span className="museum-hall-roman">I</span>
          <div>
            <h2 className="museum-hall-title">时代回响</h2>
            <p className="museum-hall-sub">那些年，我们一起追过的流行。</p>
          </div>
        </div>

        {/* 🎵 耳机里的青春 BGM */}
        <VintageGallery title="耳机里的青春 BGM" emoji="🎵" cards={BGM_CARDS} />

        {/* 📺 电视里的乌托邦 */}
        <VintageGallery title="电视里的乌托邦" emoji="📺" cards={TV_CARDS} />

        {/* 📱 网络初现时的印记 */}
        <VintageGallery title="网络初现时的印记" emoji="📱" cards={NET_CARDS} />
      </section>

      {/* ===== 展厅二：荣耀之路 ===== */}
      <section className="museum-hall">
        <div className="museum-hall-head">
          <span className="museum-hall-roman">II</span>
          <div>
            <h2 className="museum-hall-title">荣耀之路</h2>
            <p className="museum-hall-sub">每一步都算数。</p>
          </div>
        </div>

        {/* 垂直时间轴 */}
        <div className="museum-timeline-v">
          {honors.map((m, i) => (
            <motion.div
              key={m.id}
              className="museum-honor-row"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="museum-honor-node">
                <span className="museum-honor-dot" />
                <span className="museum-honor-year">{m.year}</span>
              </div>
              <div className="museum-honor-card" onClick={() => setActive(m)}>
                <FilmImage
                  src={m.imageUrl}
                  alt={m.title}
                  className="museum-honor-img"
                />
                <div className="museum-honor-body">
                  <h3 className="museum-card-title">{m.title}</h3>
                  <p className="museum-card-desc">{m.description}</p>
                  {m.reflection && (
                    <p className="museum-honor-reflection">
                      <span className="museum-reflection-mark">"</span>
                      {m.reflection}
                    </p>
                  )}
                  <span className="museum-card-zoom-hint">查看详情</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 页脚 */}
      <footer className="museum-foot">
        <span>时光不语，静待花开。</span>
      </footer>

      {/* Lightbox */}
      <AnimatePresence>
        {active && <Lightbox memory={active} onClose={() => setActive(null)} />}
      </AnimatePresence>

      <style>{`
        .museum-page,
        .museum-page * { cursor: auto; }
        .museum-page a,
        .museum-page button,
        .museum-page .museum-card-collection,
        .museum-page .museum-honor-card { cursor: pointer; }

        .museum-page {
          position: relative; min-height: 100vh; overflow: hidden;
          color: #e8dcc8;
          background:
            radial-gradient(120% 80% at 50% 0%, #4a3a2e 0%, #3d2c2e 45%, #2a1f20 100%);
          font-family: "Courier New", "Noto Sans SC", monospace;
          padding: 0 24px 80px;
        }

        /* 尘埃粒子 */
        .museum-dust-layer {
          position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
        }
        .museum-dust {
          position: absolute; top: 0; border-radius: 50%;
          background: ${GOLD}; opacity: 0;
        }

        /* 顶部 */
        .museum-topbar {
          position: relative; z-index: 2;
          display: flex; align-items: center; justify-content: space-between;
          max-width: 960px; margin: 0 auto; padding: 26px 4px 0;
        }
        .museum-back {
          font-size: 14px; color: #a89580; text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease, transform 0.25s ease;
        }
        .museum-back:hover { color: ${GOLD}; transform: translateX(-3px); }
        .museum-topbar-meta {
          font-size: 11px; color: #6b5a4a; letter-spacing: 0.28em; text-transform: uppercase;
        }

        /* 标题区 */
        .museum-hero {
          position: relative; z-index: 2;
          max-width: 960px; margin: 0 auto; padding: 56px 4px 48px; text-align: center;
        }
        .museum-hero-title {
          font-family: "Playfair Display", "Noto Serif SC", Georgia, serif;
          font-size: clamp(34px, 5.5vw, 54px); font-weight: 700;
          color: ${GOLD}; margin: 0 0 14px; letter-spacing: 0.06em;
          text-shadow: 0 0 30px rgba(176, 141, 87, 0.3);
        }
        .museum-hero-sub {
          font-size: 16px; color: #b8a890; margin: 0; letter-spacing: 0.12em; font-style: italic;
        }

        /* 展厅 */
        .museum-hall {
          position: relative; z-index: 2;
          max-width: 960px; margin: 0 auto 72px;
        }
        .museum-hall-head {
          display: flex; align-items: center; gap: 18px; margin-bottom: 36px;
          padding-bottom: 18px; border-bottom: 1px solid rgba(176, 141, 87, 0.25);
        }
        .museum-hall-roman {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 38px; font-weight: 700; color: ${GOLD};
          opacity: 0.7; line-height: 1;
        }
        .museum-hall-title {
          font-family: "Playfair Display", "Noto Serif SC", Georgia, serif;
          font-size: 26px; font-weight: 700; color: ${GOLD}; margin: 0 0 4px;
        }
        .museum-hall-sub {
          font-size: 13px; color: #9a8a78; margin: 0; font-style: italic;
        }

        /* ====== 复古报纸风格时代回响 ====== */
        .museum-era-section {
          background: none;
        }

        /* 复古长廊区块 */
        .vintage-section {
          margin-bottom: 48px;
        }
        .vintage-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px dashed rgba(139, 109, 79, 0.4);
        }
        .vintage-section-emoji {
          font-size: 24px;
          filter: grayscale(0.3);
        }
        .vintage-section-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 18px;
          font-weight: 600;
          color: #8B6B4F;
          margin: 0;
          letter-spacing: 0.08em;
        }

        /* 横向滑动长廊 */
        .vintage-gallery-scroll {
          overflow-x: auto;
          padding-bottom: 16px;
          scrollbar-width: thin;
          scrollbar-color: #8B6B4F transparent;
        }
        .vintage-gallery-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .vintage-gallery-scroll::-webkit-scrollbar-thumb {
          background: rgba(139, 109, 79, 0.4);
          border-radius: 3px;
        }
        .vintage-gallery-track {
          display: flex;
          gap: 20px;
          padding: 8px 4px;
        }

        /* 复古报纸卡片 */
        .vintage-card {
          position: relative;
          flex-shrink: 0;
          width: 320px;
          background: linear-gradient(135deg, #FDF8F0 0%, #F5ECD8 50%, #EDE4D0 100%);
          border: 1px solid rgba(139, 109, 79, 0.5);
          border-radius: 4px;
          padding: 0;
          box-shadow:
            0 8px 24px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.6);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .vintage-card:hover {
          transform: translateY(-4px) rotate(0.5deg);
          box-shadow:
            0 16px 40px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.6);
        }

        /* 年份邮票标签 */
        .vintage-year-stamp {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
          padding: 4px 12px 4px 14px;
          background: #8B6B4F;
          color: #FDF8F0;
          font-family: "Courier New", monospace;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          border-radius: 2px;
          box-shadow:
            2px 2px 0 rgba(0,0,0,0.2),
            inset 0 0 0 1px rgba(255,255,255,0.1);
          transform: rotate(-3deg);
        }
        .vintage-year-stamp::before,
        .vintage-year-stamp::after {
          content: "";
          position: absolute;
          width: 6px;
          height: 6px;
          background: #F5ECD8;
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
        }
        .vintage-year-stamp::before { left: -3px; }
        .vintage-year-stamp::after { right: -3px; }

        /* 卡片内容区 */
        .vintage-card-content {
          padding: 52px 20px 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .vintage-card-icon {
          font-size: 36px;
          text-align: center;
          filter: grayscale(0.2);
          opacity: 0.85;
        }
        .vintage-card-body {
          border-top: 1px solid rgba(139, 109, 79, 0.25);
          padding-top: 14px;
        }
        .vintage-card-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 16px;
          font-weight: 700;
          color: #3D2C22;
          margin: 0 0 10px;
          line-height: 1.4;
          letter-spacing: 0.02em;
        }
        .vintage-card-desc {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 13px;
          line-height: 1.85;
          color: #6B5A4A;
          margin: 0;
          font-style: italic;
          text-align: justify;
        }

        /* 移动端 */
        @media (max-width: 640px) {
          .vintage-card { width: 280px; }
          .vintage-section-header { gap: 10px; }
          .vintage-section-title { font-size: 16px; }
          .vintage-card-icon { font-size: 28px; }
        }

        /* 横向时间轴 */
        .museum-timeline-h {
          overflow-x: auto; padding-bottom: 16px;
          scrollbar-width: thin; scrollbar-color: ${GOLD} transparent;
        }
        .museum-timeline-h::-webkit-scrollbar { height: 6px; }
        .museum-timeline-h::-webkit-scrollbar-thumb { background: rgba(176,141,87,0.4); border-radius: 3px; }
        .museum-timeline-h-track {
          display: flex; gap: 24px; padding: 8px 4px 0;
        }

        /* 收藏品卡片 */
        .museum-card-collection {
          position: relative; flex-shrink: 0; width: 260px;
          background: #f5edd6;
          border: 1px solid rgba(176, 141, 87, 0.5);
          border-radius: 6px;
          box-shadow: 0 10px 30px -12px rgba(0,0,0,0.6);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .museum-card-collection:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 40px -12px rgba(0,0,0,0.7), 0 0 0 1px ${GOLD};
        }
        .museum-card-year-tag {
          position: absolute; top: 10px; left: 10px; z-index: 2;
          padding: 2px 10px; border-radius: 4px;
          font-family: "Courier New", monospace; font-size: 12px; font-weight: 700;
          color: #3d2c2e; background: rgba(245, 237, 214, 0.9);
          border: 1px solid ${GOLD};
        }
        .museum-card-zoom-hint {
          position: absolute; bottom: 10px; right: 10px; z-index: 2;
          font-size: 11px; color: #8a7a64; opacity: 0;
          transition: opacity 0.3s ease;
        }
        .museum-card-collection:hover .museum-card-zoom-hint,
        .museum-honor-card:hover .museum-card-zoom-hint { opacity: 0.9; }

        /* 胶片显影 */
        .museum-film-wrap {
          position: relative; overflow: hidden; background: #2a1f20;
        }
        .museum-film-placeholder {
          position: absolute; inset: 0;
          background: linear-gradient(110deg, #2a1f20 30%, #3d2c2e 50%, #2a1f20 70%);
          background-size: 200% 100%; animation: museum-shimmer 1.5s infinite;
        }
        @keyframes museum-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .museum-film-img { display: block; width: 100%; height: 100%; object-fit: cover; }

        .museum-card-collection .museum-film-wrap { height: 170px; }

        .museum-card-info { padding: 14px 16px 16px; }
        .museum-card-title {
          font-family: "Playfair Display", "Noto Serif SC", Georgia, serif;
          font-size: 16px; font-weight: 700; color: #3d2c2e; margin: 0 0 6px;
        }
        .museum-card-desc {
          font-size: 12px; line-height: 1.7; color: #6b5a4a; margin: 0;
        }

        /* 垂直时间轴 */
        .museum-timeline-v { position: relative; padding-left: 8px; }
        .museum-timeline-v::before {
          content: ""; position: absolute; left: 21px; top: 8px; bottom: 8px;
          width: 2px; background: linear-gradient(to bottom, ${GOLD}, rgba(176,141,87,0.2));
        }
        .museum-honor-row {
          position: relative; display: flex; gap: 28px; margin-bottom: 36px;
        }
        .museum-honor-node {
          flex-shrink: 0; width: 44px; display: flex; flex-direction: column;
          align-items: center; padding-top: 18px; z-index: 1;
        }
        .museum-honor-dot {
          width: 14px; height: 14px; border-radius: 50%;
          background: ${GOLD}; border: 3px solid #3d2c2e;
          box-shadow: 0 0 12px rgba(176,141,87,0.6);
        }
        .museum-honor-year {
          margin-top: 8px; font-family: "Courier New", monospace;
          font-size: 12px; font-weight: 700; color: ${GOLD};
        }
        .museum-honor-card {
          position: relative; flex: 1; display: flex; gap: 20px;
          background: #f5edd6; border: 1px solid rgba(176, 141, 87, 0.5);
          border-radius: 8px; overflow: hidden;
          box-shadow: 0 10px 30px -12px rgba(0,0,0,0.6);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .museum-honor-card:hover {
          transform: translateX(6px);
          box-shadow: 0 18px 40px -12px rgba(0,0,0,0.7), 0 0 0 1px ${GOLD};
        }
        .museum-honor-img { width: 160px; flex-shrink: 0; height: auto; }
        .museum-honor-img .museum-film-img { height: 100%; min-height: 140px; }
        .museum-honor-body { padding: 18px 20px; flex: 1; }
        .museum-honor-reflection {
          margin: 10px 0 0; padding-left: 14px; border-left: 2px solid ${GOLD};
          font-size: 13px; line-height: 1.8; color: #8a6a4a; font-style: italic;
        }
        .museum-reflection-mark {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 22px; color: ${GOLD}; margin-right: 2px; line-height: 0;
        }

        /* Lightbox */
        .museum-lightbox-overlay {
          position: fixed; inset: 0; z-index: 200;
          display: flex; align-items: center; justify-content: center; padding: 24px;
          background: rgba(20, 12, 10, 0.88); backdrop-filter: blur(6px);
        }
        .museum-lightbox {
          position: relative; width: 100%; max-width: 560px;
          background: #f5edd6; border: 1px solid ${GOLD}; border-radius: 10px;
          box-shadow: 0 30px 80px -20px rgba(0,0,0,0.8);
          max-height: 90vh; overflow-y: auto;
        }
        .museum-lightbox-close {
          position: absolute; top: 12px; right: 14px; z-index: 3;
          width: 34px; height: 34px; border: none; border-radius: 50%;
          background: rgba(255,255,255,0.85); color: #3d2c2e; font-size: 22px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s ease;
        }
        .museum-lightbox-close:hover { background: #fff; }
        .museum-lightbox .museum-film-wrap { height: 300px; border-radius: 10px 10px 0 0; }
        .museum-lightbox-body { padding: 24px 28px 28px; }
        .museum-lightbox-year {
          font-family: "Courier New", monospace; font-size: 13px; font-weight: 700;
          color: ${GOLD}; letter-spacing: 0.1em;
        }
        .museum-lightbox-title {
          font-family: "Playfair Display", "Noto Serif SC", Georgia, serif;
          font-size: 22px; font-weight: 700; color: #3d2c2e; margin: 6px 0 12px;
        }
        .museum-lightbox-desc {
          font-size: 14px; line-height: 1.9; color: #6b5a4a; margin: 0 0 16px;
        }
        .museum-lightbox-reflection {
          padding: 14px 16px; border-radius: 8px;
          background: rgba(176, 141, 87, 0.1);
          font-size: 14px; line-height: 1.9; color: #8a6a4a; font-style: italic;
          margin: 0;
        }

        /* 页脚 */
        .museum-foot {
          position: relative; z-index: 2;
          max-width: 960px; margin: 0 auto; padding-top: 32px;
          text-align: center; font-size: 13px; color: #6b5a4a; font-style: italic;
          letter-spacing: 0.08em;
        }

        /* 移动端 */
        @media (max-width: 640px) {
          .museum-hall-head { gap: 14px; }
          .museum-hall-roman { font-size: 30px; }
          .museum-hall-title { font-size: 22px; }
          .museum-honor-card { flex-direction: column; }
          .museum-honor-img { width: 100%; height: 160px; }
          .museum-honor-img .museum-film-img { min-height: 160px; }
          .museum-lightbox .museum-film-wrap { height: 200px; }
          .museum-lightbox-body { padding: 20px; }
        }
      `}</style>
    </div>
  );
};

export default MuseumPage;
