import { useState, useEffect } from "react";
import AmbientSound from "./AmbientSound";
import { Link } from "react-router-dom";

/**
 * SimpleNavbar 极简文字导航栏
 *
 * 固定顶部，透明背景，文字链接 hover 下划线动画。
 * 左侧白噪音开关，右侧昼夜切换按钮。
 * 移动端折叠为汉堡菜单。
 */

type Section = "home" | "about" | "projects" | "lab" | "film" | "mickey";

interface SimpleNavbarProps {
  current: Section;
  onNavigate: (section: Section) => void;
  isNight: boolean;
  onToggleTheme: () => void;
  isFullMode: boolean;
  onOpenFilmSpace?: () => void;
}

const SimpleNavbar: React.FC<SimpleNavbarProps> = ({ current, onNavigate, isNight, onToggleTheme, isFullMode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  // 导航顺序：首页 → 关于我 → 项目集 → 疗愈室 → 妙妙工具箱 → 第七卷胶片
  const navItems = isFullMode
    ? [
        { key: "home" as const, label: "首页", href: null },
        { key: "about" as const, label: "关于我", href: null },
        { key: "projects" as const, label: "项目集", href: null },
        { key: "lab" as const, label: "疗愈室", href: "/healing" },
        { key: "mickey" as const, label: "妙妙工具箱", href: "/mickey" },
        { key: "film" as const, label: "第七卷胶片", href: "/film" },
      ]
    : [
        { key: "lab" as const, label: "疗愈室", href: "/healing" },
        { key: "film" as const, label: "第七卷胶片", href: "/film" },
      ];

  useEffect(() => {
    setMobileOpen(false);
  }, [current]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-12"
      style={{
        background: "var(--bg-overlay)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* 左侧：白噪音开关 + 标题（纯净模式显示"森林疗愈室"） */}
      <div className="flex items-center gap-3">
        <AmbientSound variant="navbar" />
        {!isFullMode && (
          <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: "15px", color: "var(--text)", fontWeight: 500, letterSpacing: "0.05em" }}>
            森林疗愈室
          </span>
        )}
      </div>

      {/* 桌面端导航 */}
      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          item.href ? (
            <Link key={item.key} to={item.href} className="nav-link" style={{ color: "var(--text-soft)" }}>
              {item.label}
            </Link>
          ) : (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className="nav-link"
              style={{
                color: current === item.key ? "var(--accent)" : "var(--text-soft)",
                fontWeight: current === item.key ? 500 : 400,
              }}
            >
              {item.label}
            </button>
          )
        ))}

        {/* 昼夜切换 */}
        <button
          onClick={onToggleTheme}
          className="ml-4 px-3 py-1.5 rounded-lg text-sm transition-colors"
          style={{
            border: "1px solid var(--border)",
            color: "var(--text-soft)",
          }}
        >
          {isNight ? "日" : "夜"}
        </button>
      </div>

      {/* 移动端汉堡 */}
      <button
        className="md:hidden p-2"
        onClick={() => setMobileOpen((v) => !v)}
        style={{ color: "var(--text)" }}
        aria-label="菜单"
      >
        <div className="w-5 h-0.5 mb-1.5" style={{ background: "var(--text)" }} />
        <div className="w-5 h-0.5 mb-1.5" style={{ background: "var(--text)" }} />
        <div className="w-5 h-0.5" style={{ background: "var(--text)" }} />
      </button>

      {/* 移动端下拉 */}
      {mobileOpen && (
        <div
          className="absolute top-16 left-0 right-0 md:hidden flex flex-col py-4 px-6 gap-4"
          style={{
            background: "var(--bg-overlay)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {navItems.map((item) => (
            item.href ? (
              <Link key={item.key} to={item.href} onClick={() => setMobileOpen(false)} style={{ color: "var(--text-soft)" }}>
                {item.label}
              </Link>
            ) : (
              <button
                key={item.key}
                onClick={() => { onNavigate(item.key); setMobileOpen(false); }}
                style={{
                  color: current === item.key ? "var(--accent)" : "var(--text-soft)",
                  fontWeight: current === item.key ? 500 : 400,
                  textAlign: "left",
                }}
              >
                {item.label}
              </button>
            )
          ))}
          <button
            onClick={onToggleTheme}
            style={{ color: "var(--text-soft)", textAlign: "left" }}
          >
            切换{isNight ? "昼" : "夜"}模式
          </button>
        </div>
      )}

      <style>{`
        .nav-link {
          position: relative;
          padding-bottom: 4px;
          font-size: 15px;
          transition: color 0.25s ease;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 1.5px;
          background: var(--accent);
          transition: width 0.3s ease;
        }
        .nav-link:hover {
          color: var(--accent) !important;
        }
        .nav-link:hover::after {
          width: 100%;
        }
      `}</style>
    </nav>
  );
};

export default SimpleNavbar;
