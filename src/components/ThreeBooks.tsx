import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * ThreeBooks 三书陈列组件
 *
 * 嵌入现有首页，放在「关于我」和「作品说明书」之间。
 * 浅米色背景 + 极淡书架纹理，三本书 CSS 3D 陈列。
 */

interface BookDef {
  key: "zhongji" | "zhiyong" | "xianqing";
  title: string;
  subtitle: string;
  author: string;
  coverColor: string;
  spineColor: string;
  accent: string;
  path: string;
  tagline: string;
}

const BOOKS: BookDef[] = [
  {
    key: "zhongji",
    title: "筑基",
    subtitle: "数字造物论",
    author: "小鹿 · 卷一",
    coverColor: "#4a6a5a",
    spineColor: "#3a5a4a",
    accent: "#a8c090",
    path: "/zhongji/",
    tagline: "卷一 · 筑基",
  },
  {
    key: "zhiyong",
    title: "致用",
    subtitle: "薪火录",
    author: "小鹿 · 卷二",
    coverColor: "#8a3030",
    spineColor: "#6a2020",
    accent: "#e0a070",
    path: "/zhiyong/",
    tagline: "卷二 · 致用",
  },
  {
    key: "xianqing",
    title: "闲情",
    subtitle: "漫游笺",
    author: "小鹿 · 卷七",
    coverColor: "#c49a4a",
    spineColor: "#a47a2a",
    accent: "#f0d890",
    path: "/xianqing/",
    tagline: "卷七 · 闲情",
  },
];

const ThreeBooks: React.FC = () => {
  const navigate = useNavigate();
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  return (
    <section
      id="books"
      style={{
        position: "relative",
        padding: "80px 0 100px",
        background: "#fafaf9",
        overflow: "hidden",
      }}
    >
      {/* 极淡书架纹理 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.4,
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 119px,
              rgba(90, 80, 70, 0.04) 119px,
              rgba(90, 80, 70, 0.04) 120px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 39px,
              rgba(90, 80, 70, 0.02) 39px,
              rgba(90, 80, 70, 0.02) 40px
            )
          `,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 48px",
        }}
      >
        {/* 书局标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <p
            style={{
              fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif',
              fontSize: 13,
              letterSpacing: "0.3em",
              color: "#8a7a6a",
              margin: "0 0 12px",
              opacity: 0.7,
            }}
          >
            XIAOLU BOOKSTORE
          </p>
          <h2
            style={{
              fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif',
              fontSize: "clamp(26px, 4vw, 36px)",
              fontWeight: 600,
              color: "#3f3f46",
              margin: 0,
              letterSpacing: "0.12em",
              lineHeight: 1.3,
            }}
          >
            小 鹿 书 局
          </h2>
          <p
            style={{
              fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif',
              fontSize: 14,
              color: "#6b6b6b",
              marginTop: 12,
              letterSpacing: "0.06em",
            }}
          >
            三卷书，一段成长的旅程
          </p>
        </motion.div>

        {/* 三本书陈列 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 48,
            perspective: "1200px",
            flexWrap: "wrap",
            padding: "20px 0",
          }}
        >
          {BOOKS.map((book, index) => {
            const isHover = hoverKey === book.key;
            const scale = index === 1 ? 1.1 : 0.95;
            const rotateY = index === 0 ? -8 : index === 2 ? 8 : 0;
            const hoverRotateY = index === 0 ? -3 : index === 2 ? 3 : 0;

            return (
              <motion.div
                key={book.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
                onClick={() => navigate(book.path)}
                onMouseEnter={() => setHoverKey(book.key)}
                onMouseLeave={() => setHoverKey(null)}
                style={{
                  position: "relative",
                  cursor: "pointer",
                  transformStyle: "preserve-3d",
                  transform: `
                    scale(${isHover ? scale * 1.06 : scale})
                    rotateY(${isHover ? hoverRotateY : rotateY}deg)
                    rotateX(${isHover ? -4 : 0}deg)
                    translateY(${isHover ? -12 : 0}px)
                  `,
                  transition:
                    "transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  width: 160,
                  height: 230,
                }}
              >
                {/* 书本主体 */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* 封面 */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "4px 8px 8px 4px",
                      background: `linear-gradient(135deg, ${book.coverColor} 0%, ${book.spineColor} 100%)`,
                      boxShadow: isHover
                        ? `0 20px 40px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset`
                        : `0 8px 24px -8px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05) inset`,
                      transition: "box-shadow 0.5s ease",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "28px 14px 24px",
                      transform: "translateZ(12px)",
                    }}
                  >
                    {/* 顶部装饰线 */}
                    <div
                      style={{
                        width: "100%",
                        height: 1,
                        background: book.accent,
                        opacity: 0.5,
                      }}
                    />

                    {/* 书名 */}
                    <div
                      style={{
                        textAlign: "center",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily:
                            '"Noto Serif SC", "Songti SC", Georgia, serif',
                          fontSize: 32,
                          fontWeight: 700,
                          color: book.accent,
                          margin: 0,
                          letterSpacing: "0.15em",
                          textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                          lineHeight: 1.2,
                        }}
                      >
                        {book.title}
                      </h3>
                      <p
                        style={{
                          fontFamily:
                            '"Noto Serif SC", "Songti SC", Georgia, serif',
                          fontSize: 12,
                          color: "rgba(255,255,255,0.8)",
                          marginTop: 6,
                          letterSpacing: "0.1em",
                          margin: "6px 0 0",
                        }}
                      >
                        {book.subtitle}
                      </p>
                    </div>

                    {/* 底部 */}
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: 36,
                          height: 1,
                          background: book.accent,
                          margin: "0 auto 8px",
                          opacity: 0.4,
                        }}
                      />
                      <p
                        style={{
                          fontFamily:
                            '"Noto Serif SC", "Songti SC", Georgia, serif',
                          fontSize: 10,
                          color: "rgba(255,255,255,0.6)",
                          margin: 0,
                          letterSpacing: "0.15em",
                        }}
                      >
                        {book.author}
                      </p>
                    </div>
                  </div>

                  {/* 书脊 */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: 20,
                      height: "100%",
                      background: `linear-gradient(90deg, ${book.spineColor} 0%, ${book.coverColor} 100%)`,
                      borderRadius: "4px 0 0 4px",
                      transform:
                        "rotateY(-90deg) translateZ(12px) translateX(-10px)",
                      transformOrigin: "left center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "inset -2px 0 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily:
                          '"Noto Serif SC", "Songti SC", Georgia, serif',
                        fontSize: 9,
                        color: "rgba(255,255,255,0.7)",
                        writingMode: "vertical-rl",
                        letterSpacing: "0.15em",
                        textOrientation: "upright",
                      }}
                    >
                      {book.tagline}
                    </span>
                  </div>

                  {/* 书页右侧 */}
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 2,
                      width: 10,
                      height: "calc(100% - 4px)",
                      background: `repeating-linear-gradient(
                        0deg,
                        #f5f0e8 0px,
                        #f5f0e8 1px,
                        #ebe5d8 1px,
                        #ebe5d8 2px
                      )`,
                      borderRadius: "0 2px 2px 0",
                      transform:
                        "rotateY(90deg) translateZ(12px) translateX(5px)",
                      transformOrigin: "right center",
                      boxShadow: "inset 2px 0 4px rgba(0,0,0,0.1)",
                    }}
                  />

                  {/* 顶部书页 */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 10,
                      background: "#f0ebe0",
                      borderRadius: "4px 4px 0 0",
                      transform:
                        "rotateX(90deg) translateZ(12px) translateY(-5px)",
                      transformOrigin: "top center",
                    }}
                  />
                </div>

                {/* 投影 */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -16,
                    left: "50%",
                    transform: "translateX(-50%) rotateX(90deg)",
                    width: "90%",
                    height: 24,
                    background:
                      "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, transparent 70%)",
                    filter: "blur(4px)",
                    transition: "all 0.5s ease",
                    opacity: isHover ? 0.8 : 0.5,
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* 底部提示 */}
        <p
          style={{
            fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif',
            fontSize: 13,
            color: "#9a8a7a",
            marginTop: 40,
            letterSpacing: "0.08em",
            opacity: 0.6,
            textAlign: "center",
          }}
        >
          轻点书卷，开启一段阅读
        </p>
      </div>
    </section>
  );
};

export default ThreeBooks;
