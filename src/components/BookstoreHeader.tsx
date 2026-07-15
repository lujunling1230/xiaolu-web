import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * BookstoreHeader 小鹿书局导航栏
 *
 * 顶部固定导航，浅米白底 + 极细分割线。
 * 左侧 Logo：小鹿书局（衬线体 + 鹿印）
 * 中间三导航：筑基 | 致用 | 闲情
 * 悬停下划线颜色随主题变化：筑基-墨绿 / 致用-朱砂红 / 闲情-胶片黄
 */

type BookKey = "zhongji" | "zhiyong" | "xianqing";

interface NavItem {
  key: BookKey;
  label: string;
  accent: string; // 悬停下划线色
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: "zhongji", label: "筑基", accent: "#4a7a5a", path: "/zhongji/" },
  { key: "zhiyong",  label: "致用", accent: "#c04040", path: "/zhiyong/"  },
  { key: "xianqing", label: "闲情", accent: "#d4a853", path: "/xianqing/" },
];

const BookstoreHeader: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hoverKey, setHoverKey] = useState<BookKey | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 根据当前路径判断哪个导航项激活
  const activeKey: BookKey | null = (() => {
    const p = location.pathname;
    if (p.startsWith("/zhongji")) return "zhongji";
    if (p.startsWith("/zhiyong"))  return "zhiyong";
    if (p.startsWith("/xianqing")) return "xianqing";
    return null;
  })();

  return (
    <header
      className="bs-header"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        background: scrolled
          ? "rgba(250, 250, 249, 0.92)"
          : "rgba(250, 250, 249, 0)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(90, 80, 70, 0.08)"
          : "1px solid transparent",
        transition: "all 0.4s ease",
      }}
    >
      {/* 左侧 Logo */}
      <Link
        to="/"
        className="bs-logo"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
          color: "#3f3f46",
          fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif',
        }}
      >
        {/* 鹿印 SVG */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          style={{ opacity: 0.85 }}
        >
          <circle cx="14" cy="14" r="13" stroke="#4a7a5a" strokeWidth="1" fill="none" />
          <path
            d="M10 16c0-3.5 2-6 4-6s4 2.5 4 6"
            stroke="#4a7a5a"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="13" cy="14" r="0.8" fill="#4a7a5a" />
          <circle cx="15" cy="14" r="0.8" fill="#4a7a5a" />
          <path d="M12 17c0 0 0.5 1 2 1s2-1 2-1" stroke="#4a7a5a" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          <path d="M11 9l-1-4M13 8l-0.5-3.5M17 9l1-4M15 8l0.5-3.5" stroke="#4a7a5a" strokeWidth="0.8" strokeLinecap="round" />
        </svg>
        <span
          style={{
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "0.08em",
          }}
        >
          小鹿书局
        </span>
      </Link>

      {/* 中间导航 */}
      <nav
        className="bs-nav"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 48,
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeKey === item.key;
          const isHover = hoverKey === item.key;
          const showLine = isActive || isHover;
          return (
            <Link
              key={item.key}
              to={item.path}
              onMouseEnter={() => setHoverKey(item.key)}
              onMouseLeave={() => setHoverKey(null)}
              style={{
                position: "relative",
                fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif',
                fontSize: 18,
                letterSpacing: "2px",
                color: "#3f3f46",
                textDecoration: "none",
                padding: "6px 2px",
                transition: "color 0.3s ease",
              }}
            >
              {item.label}
              {/* 悬停/激活下划线 */}
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: 0,
                  width: isHover ? "100%" : isActive ? "70%" : "0%",
                  height: 1.5,
                  background: item.accent,
                  transform: "translateX(-50%)",
                  transition: "width 0.3s ease",
                  borderRadius: 1,
                }}
              />
              {/* 激活态：颜色随书色 */}
              <style>{`
                .bs-nav a:hover { color: ${item.accent} !important; }
              `}</style>
            </Link>
          );
        })}
      </nav>

      {/* 右侧占位（保持对称） */}
      <div style={{ width: 80 }} />
    </header>
  );
};

export default BookstoreHeader;
