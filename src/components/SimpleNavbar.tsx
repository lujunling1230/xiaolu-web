import { useState, useEffect } from "react";
import AmbientSound from "./AmbientSound";
import { Link } from "react-router-dom";

/* ============================================================
 * SimpleNavbar 导航栏
 * 森林晨雾风格：柔和背景融合、当前项高亮、悬停动效、
 * Logo 强化、主次分明、移动端汉堡菜单
 * ============================================================ */

type Section = "home" | "about" | "projects" | "mickey";

interface SimpleNavbarProps {
  current: Section;
  onNavigate: (section: Section) => void;
  isFullMode: boolean;
  onOpenFilmSpace?: () => void;
}

/** 主 / 次导航拆分 */
const PRIMARY_KEYS = ["home", "about", "projects"] as const;
const SECONDARY_KEYS = ["mickey"] as const;

const LABEL_MAP: Record<string, { label: string; icon?: string; href: string | null }> = {
  home:    { label: "首页",    href: null },
  about:   { label: "关于我",  href: null },
  projects:{ label: "作品说明书",  icon: "🍃", href: null },
  mickey:  { label: "作品集", href: "/mickey" },
};

const SimpleNavbar: React.FC<SimpleNavbarProps> = ({
  current,
  onNavigate,
  isFullMode,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  /* 切换页面时关闭移动端菜单 */
  useEffect(() => {
    setMobileOpen(false);
  }, [current]);

  /* 移动端打开时禁止底层滚动 */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const allKeys = isFullMode
    ? ([...PRIMARY_KEYS, ...SECONDARY_KEYS] as Section[])
    : (["film"] as Section[]);

  const primaryItems = isFullMode
    ? PRIMARY_KEYS.map((k) => ({ key: k, ...LABEL_MAP[k] }))
    : [];
  const secondaryItems = isFullMode
    ? SECONDARY_KEYS.map((k) => ({ key: k, ...LABEL_MAP[k] }))
    : [];
  const mobileItems = allKeys.map((k) => ({ key: k, ...LABEL_MAP[k] }));

  const isActive = (key: string) => current === key;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          height: 72,
          padding: "0 28px",
          background: "rgba(255, 255, 255, 0.82)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        {/* ---------- 左侧：白噪音 + Logo ---------- */}
        <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
          <AmbientSound variant="navbar" />

          {isFullMode ? (
            <div className="hidden md:flex items-baseline gap-2" style={{ minWidth: 0 }}>
              <span
                style={{
                  fontFamily: '"Noto Serif SC", Georgia, serif',
                  fontSize: "2.4rem",
                  fontWeight: 600,
                  color: "#3A4F3A",
                  letterSpacing: "0.06em",
                  textShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  lineHeight: 1,
                }}
              >
                路俊玲
              </span>
              <span
                className="hidden lg:inline"
                style={{
                  fontSize: "0.9rem",
                  color: "#666",
                  letterSpacing: "0.04em",
                  fontWeight: 400,
                  whiteSpace: "nowrap",
                }}
              >
                AI Product Manager · Digital Atelier
              </span>
            </div>
          ) : (
            <span
              className="hidden md:inline"
              style={{
                fontFamily: '"Noto Serif SC", serif',
                fontSize: 15,
                color: "#3A4F3A",
                fontWeight: 500,
                letterSpacing: "0.05em",
              }}
            >
              森林疗愈室
            </span>
          )}
        </div>

        {/* ---------- 桌面端导航 ---------- */}
        <div className="hidden md:flex items-center" style={{ gap: "1.5rem", flex: 1, justifyContent: "flex-end" }}>
          {/* 主要导航 */}
          {primaryItems.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              active={isActive(item.key)}
              onNavigate={onNavigate}
            />
          ))}

          {/* 次要导航 — 用 margin 与主区分 */}
          {secondaryItems.length > 0 && (
            <div className="flex items-center" style={{ gap: "1.5rem", marginLeft: 20 }}>
              <div
                style={{
                  width: 1,
                  height: 18,
                  background: "rgba(90,107,92,0.15)",
                  borderRadius: 1,
                }}
              />
              {secondaryItems.map((item) => (
                <NavItem
                  key={item.key}
                  item={item}
                  active={isActive(item.key)}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}

        </div>

        {/* ---------- 移动端汉堡按钮 ---------- */}
        <button
          className="md:hidden flex flex-col justify-center items-center"
          onClick={() => setMobileOpen((v) => !v)}
          style={{
            width: 36,
            height: 36,
            gap: 5,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
          aria-label="菜单"
        >
          <span
            className="hamburger-line"
            style={{
              display: "block",
              width: 22,
              height: 2,
              background: mobileOpen ? "#8D9A8B" : "#5A6B5C",
              borderRadius: 2,
              transition: "all 0.3s ease",
              transform: mobileOpen ? "rotate(45deg) translateY(7px)" : "none",
            }}
          />
          <span
            className="hamburger-line"
            style={{
              display: "block",
              width: 22,
              height: 2,
              background: mobileOpen ? "#8D9A8B" : "#5A6B5C",
              borderRadius: 2,
              transition: "all 0.3s ease",
              opacity: mobileOpen ? 0 : 1,
            }}
          />
          <span
            className="hamburger-line"
            style={{
              display: "block",
              width: 22,
              height: 2,
              background: mobileOpen ? "#8D9A8B" : "#5A6B5C",
              borderRadius: 2,
              transition: "all 0.3s ease",
              transform: mobileOpen ? "rotate(-45deg) translateY(-7px)" : "none",
            }}
          />
        </button>
      </nav>

      {/* ---------- 移动端全屏菜单 ---------- */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 flex flex-col"
          style={{
            top: 72,
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: "24px 28px",
            gap: 6,
            animation: "snFadeIn 0.25s ease",
          }}
        >
          {mobileItems.map((item) => (
            <MobileNavItem
              key={item.key}
              item={item}
              active={isActive(item.key)}
              onNavigate={(key) => {
                onNavigate(key as Section);
                setMobileOpen(false);
              }}
            />
          ))}
        </div>
      )}

      {/* 全局样式 */}
      <style>{`
        /* 桌面导航项 */
        .sn-nav-link {
          position: relative;
          padding: 12px 0;
          font-size: 15px;
          letter-spacing: 0.02em;
          transition: color 0.25s ease;
          background: none;
          border: none;
          cursor: pointer;
          white-space: nowrap;
        }
        .sn-nav-link::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 6px;
          width: 0;
          height: 2px;
          background: #7cb342;
          border-radius: 1px;
          transform: translateX(-50%);
          transition: width 0.3s ease;
        }
        .sn-nav-link:hover {
          color: #2E403E !important;
        }
        .sn-nav-link:hover::after {
          width: 100%;
        }

        /* 当前项 — 始终显示下划线 */
        .sn-nav-link.is-active {
          color: #3A4F3A !important;
          font-weight: 600;
        }
        .sn-nav-link.is-active::after {
          width: 100%;
        }
        .sn-nav-link.is-active:hover::after {
          width: 110%;
        }

        /* 移动端淡入 */
        @keyframes snFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

/* -----------------------------------------------------------
 * NavItem — 桌面端单条导航
 * ----------------------------------------------------------- */
interface NavItemProps {
  item: { key: string; label: string; icon?: string; href: string | null };
  active: boolean;
  onNavigate: (section: Section) => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, active, onNavigate }) => {
  const baseColor = active ? "#3A4F3A" : "#5A6B5C";

  if (item.href) {
    return (
      <Link
        to={item.href}
        className={`sn-nav-link ${active ? "is-active" : ""}`}
        style={{ color: baseColor, textDecoration: "none" }}
      >
        {item.label}
        {item.icon && (
          <span style={{ marginLeft: 4, fontSize: 13, opacity: 0.7 }}>{item.icon}</span>
        )}
      </Link>
    );
  }

  return (
    <button
      onClick={() => onNavigate(item.key as Section)}
      className={`sn-nav-link ${active ? "is-active" : ""}`}
      style={{ color: baseColor }}
    >
      {item.label}
      {item.icon && (
        <span style={{ marginLeft: 4, fontSize: 13, opacity: 0.7 }}>{item.icon}</span>
      )}
    </button>
  );
};

/* -----------------------------------------------------------
 * MobileNavItem — 移动端单条导航
 * ----------------------------------------------------------- */
interface MobileNavItemProps {
  item: { key: string; label: string; icon?: string; href: string | null };
  active: boolean;
  onNavigate: (key: string) => void;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ item, active, onNavigate }) => {
  if (item.href) {
    return (
      <Link
        to={item.href}
        onClick={() => onNavigate(item.key)}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 12px",
          borderRadius: 10,
          fontSize: 16,
          color: active ? "#3A4F3A" : "#5A6B5C",
          fontWeight: active ? 600 : 400,
          background: active ? "rgba(124,179,66,0.08)" : "transparent",
          textDecoration: "none",
          letterSpacing: "0.04em",
          transition: "all 0.2s ease",
        }}
      >
        {item.label}
        {item.icon && <span style={{ marginLeft: 6, fontSize: 14 }}>{item.icon}</span>}
        {active && (
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#81C784" }}>●</span>
        )}
      </Link>
    );
  }

  return (
    <button
      onClick={() => onNavigate(item.key)}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "10px 12px",
        borderRadius: 10,
        fontSize: 16,
        color: active ? "#3A4F3A" : "#5A6B5C",
        fontWeight: active ? 600 : 400,
        background: active ? "rgba(129,199,132,0.08)" : "transparent",
        border: "none",
        textAlign: "left",
        cursor: "pointer",
        letterSpacing: "0.04em",
        transition: "all 0.2s ease",
      }}
    >
      {item.label}
      {item.icon && <span style={{ marginLeft: 6, fontSize: 14 }}>{item.icon}</span>}
      {active && (
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#81C784" }}>●</span>
      )}
    </button>
  );
};

export default SimpleNavbar;
