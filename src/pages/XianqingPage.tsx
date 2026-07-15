import { useState, useRef } from "react";
import { Link } from "react-router-dom";

/**
 * XianqingPage 闲情书页 · 卷七
 * DIGITAL ATELIER · VOL.VII
 * 人生第七卷胶片馆
 *
 * 暖灰纹理纸感背景 + 水平拼接胶片条（默认卷起，点击展开）
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
    emoji: "📖",
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
    emoji: "📷",
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
    emoji: "🎧",
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
    emoji: "🏃",
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
    emoji: "🧘",
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
    emoji: "📺",
  },
];

/* ====== 胶片齿孔组件 ====== */
const SprocketHoles: React.FC<{ position: "top" | "bottom" }> = ({ position }) => (
  <div style={{
    position: "absolute",
    [position]: 6,
    left: 10,
    right: 10,
    height: 4,
    display: "flex",
    gap: 4,
    pointerEvents: "none",
  }}>
    {Array.from({ length: 16 }).map((_, idx) => (
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

const XianqingPage: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  /* 拖拽滚动 */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.clientX;
    scrollStart.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const dx = e.clientX - startX.current;
    scrollRef.current.scrollLeft = scrollStart.current - dx;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
    }
  };

  const handleFrameClick = (e: React.MouseEvent, moduleId: string) => {
    /* 如果拖拽距离很小才跳转 */
    if (!isDragging.current) {
      window.location.href = `/film?module=${moduleId}`;
    }
  };

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

        {/* ====== 水平胶片条 ====== */}
        <div style={{
          maxWidth: 960,
          margin: "0 auto",
        }}>
          {/* 胶片外壳 */}
          <div
            style={{
              background: "linear-gradient(180deg, #2a2824, #1e1c1a)",
              borderRadius: 6,
              overflow: "hidden",
              height: expanded ? 240 : 80,
              transition: "height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "grab",
            }}
            onClick={() => setExpanded(!expanded)}
          >
            {/* 胶片滚动区域 */}
            <div
              ref={scrollRef}
              style={{
                display: "flex",
                overflowX: "auto",
                height: "100%",
                /* 隐藏滚动条 */
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {FILM_CARDS.map((card, index) => (
                <div
                  key={card.id}
                  className="xianqing-film-frame"
                  onClick={(e) => handleFrameClick(e, card.id)}
                  style={{
                    position: "relative",
                    width: 180,
                    flexShrink: 0,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    /* 帧之间的分隔线 */
                    borderRight: index < FILM_CARDS.length - 1
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "none",
                    userSelect: "none",
                  }}
                >
                  {/* 顶部齿孔 */}
                  <SprocketHoles position="top" />

                  {/* 画面区域 */}
                  <div style={{
                    width: "calc(100% - 20px)",
                    flex: 1,
                    margin: "12px 0",
                    background: `linear-gradient(145deg, ${card.color} 0%, ${card.color}cc 60%, ${card.color}99 100%)`,
                    borderRadius: 3,
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    transition: "opacity 0.3s ease",
                    opacity: expanded ? 1 : 0.35,
                  }}>
                    {/* 光晕效果 */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: `radial-gradient(ellipse at 35% 35%, rgba(255,255,255,0.25) 0%, transparent 55%)`,
                    }} />
                    {/* 内容 */}
                    <div style={{
                      position: "relative",
                      zIndex: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      transition: "opacity 0.4s ease, transform 0.4s ease",
                      opacity: expanded ? 1 : 0,
                      transform: expanded ? "translateY(0)" : "translateY(8px)",
                    }}>
                      <span style={{ fontSize: 24, lineHeight: 1 }}>{card.emoji}</span>
                      <h4 style={{
                        fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif',
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#4a3a2a",
                        margin: 0,
                        letterSpacing: "0.08em",
                      }}>
                        {card.title}
                      </h4>
                      <p style={{
                        fontFamily: '"Noto Serif SC", Georgia, serif',
                        fontSize: 11,
                        color: "#8a7a6a",
                        margin: 0,
                        lineHeight: 1.5,
                        textAlign: "center",
                        padding: "0 12px",
                      }}>
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  {/* 底部齿孔 */}
                  <SprocketHoles position="bottom" />
                </div>
              ))}
            </div>
          </div>

          {/* 展开/收起提示 */}
          <div
            style={{
              textAlign: "center",
              marginTop: 12,
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => setExpanded(!expanded)}
          >
            <p style={{
              fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif',
              fontSize: 12,
              color: "#a09080",
              letterSpacing: "0.12em",
              opacity: 0.6,
              margin: 0,
              transition: "opacity 0.3s ease",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.6"; }}
            >
              {expanded ? "↑ 收起胶片" : "↓ 展开胶片"}
            </p>
          </div>
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
        .xianqing-film-scroll::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 768px) {
          .xianqing-film-frame {
            width: 140px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default XianqingPage;
