import { useState, useEffect } from "react";
import AmbientSound from "./AmbientSound";
import { Link } from "react-router-dom";

/* ============================================================
 * SimpleNavbar 横向导航栏
 * 首页 / 关于我 / 作品集 / 作品说明书
 * 质感设计：极薄底栏 + 圆角胶囊指示器 + 柔和阴影
 * ============================================================ */

type Section = "home" | "about" | "projects" | "mickey";

interface SimpleNavbarProps {
  current: Section;
  onNavigate: (section: Section) => void;
  isFullMode: boolean;
}

const NAV_ITEMS = [
  { key: "home", label: "首页", href: null },
  { key: "about", label: "关于我", href: null },
  { key: "mickey", label: "作品集", href: "/mickey" },
  { key: "projects", label: "作品说明书", href: null },
] as const;

/* -----------------------------------------------------------
 * BrandLogo — 树叶图标 + 分色品牌名
 * ----------------------------------------------------------- */
const BrandLogo: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <a
    href="#home"
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className="sn-logo"
    aria-label="返回首页"
  >
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 2C7 3.5 5 7 5 11C5 15 7 19 11 19C15 19 17 15 17 11C17 7 15 3.5 11 2Z" stroke="#5d8a6a" strokeWidth="1.3" fill="rgba(93,138,106,0.08)" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="11" y1="5" x2="11" y2="18" stroke="#5d8a6a" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M11 9L8 10.5M11 9L14 10.5M11 13L7.5 15M11 13L14.5 15" stroke="#5d8a6a" strokeWidth="0.7" strokeLinecap="round" opacity="0.5" />
    </svg>
    <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: "1.15rem", fontWeight: 600, color: "#3A4F3A", letterSpacing: "0.04em" }}>路</span>
    <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: "1.15rem", fontWeight: 600, color: "#5d8a6a", letterSpacing: "0.04em" }}>俊玲</span>
  </a>
);

/* -----------------------------------------------------------
 * SimpleNavbar
 * ----------------------------------------------------------- */
const SimpleNavbar: React.FC<SimpleNavbarProps> = ({
  current,
  onNavigate,
  isFullMode,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [current]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const fullModeItems = isFullMode ? NAV_ITEMS : [];

  return (
    <>
      {/* ========== 桌面端 + 移动端通用顶部导航 ========== */}
      <nav className="sn-bar">
        <div className="sn-bar-inner">
          {/* 左侧 Logo + 白噪音 */}
          <div className="sn-bar-left">
            <BrandLogo onClick={() => onNavigate("home")} />
            <AmbientSound variant="navbar" />
          </div>

          {/* 桌面端导航项 */}
          <div className="sn-bar-center hidden md:flex">
            {fullModeItems.map((item) => (
              <NavItem
                key={item.key}
                item={item}
                active={current === item.key}
                onClick={() => {
                  if (item.href) return;
                  onNavigate(item.key as Section);
                }}
              />
            ))}
          </div>

          {/* 移动端汉堡按钮 */}
          <button
            className="sn-hamburger md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
          >
            <span className={`sn-h-line ${mobileOpen ? "is-open" : ""}`} />
            <span className={`sn-h-line ${mobileOpen ? "is-open" : ""}`} />
            <span className={`sn-h-line ${mobileOpen ? "is-open" : ""}`} />
          </button>
        </div>
      </nav>

      {/* ========== 移动端全屏菜单 ========== */}
      {mobileOpen && (
        <div className="sn-mobile-menu md:hidden">
          {fullModeItems.map((item) => (
            <MobileNavItem
              key={item.key}
              item={item}
              active={current === item.key}
              onClick={() => {
                if (!item.href) onNavigate(item.key as Section);
                setMobileOpen(false);
              }}
            />
          ))}
        </div>
      )}

      {/* ========== 样式 ========== */}
      <style>{`
        /* ---------- 导航栏容器 ---------- */
        .sn-bar {
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          width: calc(100% - 48px);
          max-width: 920px;
        }
        .sn-bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 52px;
          padding: 0 24px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(232, 226, 216, 0.4);
          border-radius: 999px;
          box-shadow:
            0 2px 8px rgba(80, 76, 66, 0.06),
            0 8px 24px rgba(80, 76, 66, 0.04);
          backdrop-filter: blur(16px) saturate(1.2);
          -webkit-backdrop-filter: blur(16px) saturate(1.2);
        }

        /* ---------- 左侧 ---------- */
        .sn-bar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .sn-logo {
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          transition: opacity 0.25s ease;
        }
        .sn-logo:hover {
          opacity: 0.8;
        }

        /* ---------- 中间导航项 ---------- */
        .sn-bar-center {
          display: flex;
          align-items: center;
          gap: 6px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        /* ---------- 单条导航 ---------- */
        .sn-link {
          position: relative;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 400;
          color: #7a7a70;
          letter-spacing: 0.06em;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 999px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
        }
        .sn-link:hover {
          color: #4a4a42;
          background: rgba(122, 154, 130, 0.06);
        }
        .sn-link.is-active {
          color: #3A4F3A;
          font-weight: 500;
          background: rgba(122, 154, 130, 0.1);
          box-shadow: 0 1px 4px rgba(93, 138, 106, 0.08);
        }

        /* ---------- 汉堡按钮 ---------- */
        .sn-hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 32px;
          height: 32px;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
        }
        .sn-h-line {
          display: block;
          width: 18px;
          height: 1.5px;
          background: #5A6B5C;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .sn-h-line.is-open:nth-child(1) {
          transform: rotate(45deg) translate(3px, 3px);
        }
        .sn-h-line.is-open:nth-child(2) {
          opacity: 0;
        }
        .sn-h-line.is-open:nth-child(3) {
          transform: rotate(-45deg) translate(3px, -3px);
        }

        /* ---------- 移动端菜单 ---------- */
        .sn-mobile-menu {
          position: fixed;
          top: 84px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 48px);
          max-width: 400px;
          z-index: 99;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(232, 226, 216, 0.4);
          border-radius: 20px;
          padding: 12px 8px;
          box-shadow: 0 12px 40px rgba(80, 76, 66, 0.12);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          gap: 2px;
          animation: snMenuIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sn-mobile-link {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 20px;
          border-radius: 14px;
          font-size: 15px;
          color: #5A6B5C;
          text-decoration: none;
          background: none;
          border: none;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s ease;
          letter-spacing: 0.05em;
        }
        .sn-mobile-link:hover,
        .sn-mobile-link.is-active {
          background: rgba(122, 154, 130, 0.08);
          color: #3A4F3A;
          font-weight: 500;
        }

        @keyframes snMenuIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }

        /* ---------- 响应式 ---------- */
        @media (max-width: 640px) {
          .sn-bar {
            width: calc(100% - 32px);
            top: 12px;
          }
          .sn-bar-inner {
            height: 48px;
            padding: 0 18px;
          }
        }
      `}</style>
    </>
  );
};

/* -----------------------------------------------------------
 * NavItem
 * ----------------------------------------------------------- */
interface NavItemProps {
  item: { key: string; label: string; href: string | null };
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, active, onClick }) => {
  if (item.href) {
    return (
      <Link
        to={item.href}
        className={`sn-link ${active ? "is-active" : ""}`}
      >
        {item.label}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={`sn-link ${active ? "is-active" : ""}`}>
      {item.label}
    </button>
  );
};

/* -----------------------------------------------------------
 * MobileNavItem
 * ----------------------------------------------------------- */
interface MobileNavItemProps {
  item: { key: string; label: string; href: string | null };
  active: boolean;
  onClick: () => void;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ item, active, onClick }) => {
  if (item.href) {
    return (
      <Link to={item.href} className={`sn-mobile-link ${active ? "is-active" : ""}`}>
        {item.label}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={`sn-mobile-link ${active ? "is-active" : ""}`}>
      {item.label}
    </button>
  );
};

export default SimpleNavbar;
