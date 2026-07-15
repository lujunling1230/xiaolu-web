import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * XianqingPage 闲情书页 · 卷七
 * DIGITAL ATELIER · VOL.VII
 * 人生第七卷胶片馆
 *
 * 暖灰纹理纸感背景 + 6个胶片卡片 + 悬停放大阴影交互
 */

/* ====== 胶片卡片数据 ====== */
const FILM_CARDS = [
  {
    id: "reading",
    no: "01",
    title: "阅读",
    subtitle: "READING",
    desc: "书页间的旅行，文字构筑的避难所",
    date: "2024 - 至今",
    color: "#DDD0B8",
    textColor: "#8a7a5a",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    link: "/film",
  },
  {
    id: "photo",
    no: "02",
    title: "摄影",
    subtitle: "PHOTOGRAPHY",
    desc: "定格的瞬间，是时光留给未来的信",
    date: "2024 - 至今",
    color: "#C8D8C0",
    textColor: "#5a6a4a",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
    link: "/film",
  },
  {
    id: "music",
    no: "03",
    title: "音乐",
    subtitle: "MUSIC",
    desc: "旋律是时间的形状，治愈每一个夜晚",
    date: "2024 - 至今",
    color: "#DCC8C0",
    textColor: "#7a5a4a",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    link: "/film",
  },
  {
    id: "sport",
    no: "04",
    title: "运动",
    subtitle: "SPORTS",
    desc: "身体在奔跑，灵魂在散步",
    date: "2025 - 至今",
    color: "#D8C8A8",
    textColor: "#6a5a3a",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M4 17l3.2-2.8L10 16l3-6 3.5 3.5L20 12" />
        <path d="M10 22l2-6 2 6" />
      </svg>
    ),
    link: "/film",
  },
  {
    id: "meditation",
    no: "05",
    title: "冥想",
    subtitle: "MEDITATION",
    desc: "平静不是没有波澜，是学会与波澜共处",
    date: "2025 - 至今",
    color: "#C0D0CC",
    textColor: "#4a5a5a",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
        <path d="M8 16c1.5 1 6.5 1 8 0" />
      </svg>
    ),
    link: "/film",
  },
  {
    id: "drama",
    no: "06",
    title: "追剧",
    subtitle: "DRAMA",
    desc: "在别人的故事里，借一段自己的月光",
    date: "2025 - 至今",
    color: "#D0C8C0",
    textColor: "#5a4a4a",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 18v3" />
        <polygon points="10,8 16,11 10,14" fill="currentColor" stroke="none" />
      </svg>
    ),
    link: "/film",
  },
];

/* ====== 胶片齿孔组件 ====== */
const SprocketHoles: React.FC<{ position: "top" | "bottom" }> = ({ position }) => (
  <div style={{
    position: "absolute",
    [position]: 8,
    left: 14,
    right: 14,
    height: 5,
    display: "flex",
    gap: 5,
  }}>
    {Array.from({ length: 18 }).map((_, idx) => (
      <div key={idx} style={{
        flex: 1,
        height: "100%",
        background: "#f0ece4",
        borderRadius: 1,
        opacity: 0.6,
      }} />
    ))}
  </div>
);

/* ====== 播放按钮 ====== */
const PlayButton: React.FC<{ hovered: boolean; color: string }> = ({ hovered, color }) => (
  <div style={{
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
    transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
    transform: hovered ? "scale(1.1)" : "scale(1)",
    backdropFilter: "blur(4px)",
  }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill={color} stroke="none">
      <polygon points="8,5 20,12 8,19" />
    </svg>
  </div>
);

const XianqingPage: React.FC = () => {
  const [hoverCard, setHoverCard] = useState<string | null>(null);

  return (
    <div style={{
      minHeight: "100vh",
      position: "relative",
      /* 暖灰纹理纸感背景 */
      background: `
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 80px,
          rgba(180,170,155,0.03) 80px,
          rgba(180,170,155,0.03) 81px
        ),
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 80px,
          rgba(180,170,155,0.02) 80px,
          rgba(180,170,155,0.02) 81px
        ),
        radial-gradient(ellipse at 20% 0%, rgba(210,195,170,0.15) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 100%, rgba(200,190,175,0.1) 0%, transparent 50%),
        linear-gradient(180deg, #f5f0e8 0%, #ede8df 30%, #e8e3da 60%, #f0ebe2 100%)
      `,
    }}>
      {/* 返回主站 */}
      <Link
        to="/"
        style={{
          position: "fixed",
          top: 24,
          left: 24,
          zIndex: 95,
          display: "flex",
          alignItems: "center",
          gap: 6,
          textDecoration: "none",
          fontFamily: '"Noto Serif SC", serif',
          fontSize: 13,
          color: "#a08a5a",
          opacity: 0.65,
          transition: "all 0.3s ease",
          letterSpacing: "0.05em",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = "#8a6a3a"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.65"; e.currentTarget.style.color = "#a08a5a"; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        返回主站
      </Link>

      <main style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "140px 48px 100px",
        position: "relative",
        zIndex: 1,
      }}>

        {/* ====== 标题区 ====== */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          {/* 顶部英文标识 */}
          <p style={{
            fontFamily: '"Courier New", "Noto Serif SC", Georgia, monospace',
            fontSize: 11,
            letterSpacing: "0.35em",
            color: "#b0a080",
            margin: "0 0 20px",
            opacity: 0.55,
            textTransform: "uppercase",
          }}>
            DIGITAL ATELIER &middot; VOL.VII
          </p>

          {/* 主标题 */}
          <h1 style={{
            fontFamily: '"Noto Serif SC", "Songti SC", "STKaiti", Georgia, serif',
            fontSize: "clamp(38px, 7vw, 64px)",
            fontWeight: 700,
            color: "#5a4a3a",
            margin: 0,
            letterSpacing: "0.2em",
            lineHeight: 1.3,
            textShadow: "0 2px 12px rgba(90,74,58,0.08)",
          }}>
            闲情 &middot; 漫游笔 &middot; 第七卷胶片
          </h1>

          {/* 装饰分隔线 */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            margin: "28px auto 0",
            maxWidth: 320,
          }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(180,160,120,0.35))" }} />
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <circle cx="4" cy="4" r="2.5" fill="rgba(180,160,120,0.3)" />
            </svg>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(180,160,120,0.35), transparent)" }} />
          </div>

          {/* 引言 */}
          <div style={{
            marginTop: 36,
            maxWidth: 540,
            margin: "36px auto 0",
          }}>
            <p style={{
              fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif',
              fontSize: 15,
              color: "#8a7a6a",
              lineHeight: 2.1,
              letterSpacing: "0.06em",
              margin: 0,
              fontStyle: "italic",
            }}>
              如果把人生比作一整卷胶片——
              <br />
              前六卷都在寻找光，却忘了自己是光。
              <br />
              第七卷，终于轮到自己登场。
              <br />
              这里装着私藏的六个快乐碎片，
              <br />
              是为自己预留的补光时刻。
            </p>
          </div>
        </div>

        {/* ====== 6个胶片卡片 ====== */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 28,
          marginBottom: 56,
          maxWidth: 960,
          margin: "0 auto 56px",
        }} className="xianqing-cards">
          {FILM_CARDS.map((card) => {
            const isHovered = hoverCard === card.id;
            return (
              <Link
                key={card.id}
                to={card.link}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    position: "relative",
                    cursor: "pointer",
                    transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.45s ease",
                    transform: isHovered ? "translateY(-8px) scale(1.03)" : "translateY(0) scale(1)",
                    /* 胶片外壳：深色底 */
                    background: "linear-gradient(180deg, #2a2824 0%, #1e1c1a 100%)",
                    borderRadius: 6,
                    padding: "20px 16px 16px",
                    boxShadow: isHovered
                      ? "0 24px 48px -12px rgba(40,36,30,0.4), 0 8px 20px -8px rgba(40,36,30,0.25)"
                      : "0 12px 32px -8px rgba(40,36,30,0.2)",
                  }}
                  onMouseEnter={() => setHoverCard(card.id)}
                  onMouseLeave={() => setHoverCard(null)}
                >
                  {/* 胶片齿孔 */}
                  <SprocketHoles position="top" />

                  {/* 画面区域 */}
                  <div style={{
                    height: 180,
                    background: `linear-gradient(145deg, ${card.color} 0%, ${card.color}cc 60%, ${card.color}99 100%)`,
                    borderRadius: 3,
                    margin: "10px 0",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {/* 光晕效果 */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: `radial-gradient(ellipse at 35% 35%, rgba(255,255,255,0.25) 0%, transparent 55%)`,
                    }} />
                    {/* 噪点纹理 */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: `repeating-conic-gradient(rgba(0,0,0,0.015) 0deg 3deg, transparent 3deg 6deg)`,
                      opacity: 0.5,
                    }} />
                    {/* 图标 + 播放按钮 */}
                    <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                      <div style={{
                        color: card.textColor,
                        opacity: 0.75,
                        transition: "opacity 0.3s, transform 0.4s",
                        transform: isHovered ? "scale(1.05)" : "scale(1)",
                      }}>
                        {card.icon}
                      </div>
                      <PlayButton hovered={isHovered} color={card.textColor} />
                    </div>
                  </div>

                  {/* 胶片齿孔 */}
                  <SprocketHoles position="bottom" />

                  {/* 文字信息 */}
                  <div style={{
                    position: "relative",
                    zIndex: 2,
                    padding: "4px 4px 0",
                    textAlign: "center",
                  }}>
                    <p style={{
                      fontFamily: '"Courier New", monospace',
                      fontSize: 9,
                      color: "rgba(220,210,195,0.35)",
                      letterSpacing: "0.25em",
                      margin: "6px 0 0",
                    }}>
                      NO. {card.no}
                    </p>
                  </div>
                </div>

                {/* 卡片下方标题区（在胶片框外） */}
                <div style={{
                  textAlign: "center",
                  marginTop: 16,
                  transition: "transform 0.3s ease",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                }}>
                  <h3 style={{
                    fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif',
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#4a3a2a",
                    margin: "0 0 4px",
                    letterSpacing: "0.12em",
                  }}>
                    {card.title}
                  </h3>
                  <p style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: 9,
                    color: "#b0a090",
                    letterSpacing: "0.2em",
                    margin: "0 0 6px",
                    textTransform: "uppercase",
                  }}>
                    {card.subtitle}
                  </p>
                  <p style={{
                    fontFamily: '"Noto Serif SC", Georgia, serif',
                    fontSize: 12,
                    color: "#8a7a6a",
                    margin: "0 0 4px",
                    lineHeight: 1.6,
                    letterSpacing: "0.02em",
                  }}>
                    {card.desc}
                  </p>
                  <p style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: 10,
                    color: "#c0b0a0",
                    letterSpacing: "0.15em",
                    margin: 0,
                  }}>
                    {card.date}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ====== 进入完整胶片空间 ====== */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link
            to="/film"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 36px",
              background: "rgba(180,160,120,0.08)",
              border: "1px solid rgba(180,160,120,0.25)",
              borderRadius: 28,
              color: "#8a7a5a",
              fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif',
              fontSize: 14,
              letterSpacing: "0.12em",
              textDecoration: "none",
              transition: "all 0.35s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(180,160,120,0.16)";
              e.currentTarget.style.borderColor = "rgba(180,160,120,0.45)";
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(180,160,120,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(180,160,120,0.08)";
              e.currentTarget.style.borderColor = "rgba(180,160,120,0.25)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            进入人生放映厅
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* ====== 底部装饰 ====== */}
        <div style={{ textAlign: "center", marginTop: 72 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 16,
          }}>
            <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(180,160,120,0.2))" }} />
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <circle cx="3" cy="3" r="2" fill="rgba(180,160,120,0.2)" />
            </svg>
            <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, rgba(180,160,120,0.2), transparent)" }} />
          </div>
          <p style={{
            fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif',
            fontSize: 13,
            color: "#a09080",
            letterSpacing: "0.18em",
            opacity: 0.5,
            fontStyle: "italic",
          }}>
            「 胶片会褪色，但记忆不会 」
          </p>
        </div>
      </main>

      {/* ====== 响应式样式 ====== */}
      <style>{`
        @media (max-width: 900px) {
          .xianqing-cards {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 22px !important;
          }
        }
        @media (max-width: 560px) {
          .xianqing-cards {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default XianqingPage;
