import AmbientSound from "./AmbientSound";
import { Link } from "react-router-dom";

/* ============================================================
 * SimpleNavbar 横向导航栏（全宽版）
 * 首页 / 关于我 / 作品集 / 作品说明书
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
 * BrandLogo
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
  const fullModeItems = isFullMode ? NAV_ITEMS : [];

  return (
    <>
      <nav className="sn-bar">
        <div className="sn-bar-inner">
          {/* 左侧 Logo + 白噪音 */}
          <div className="sn-bar-left">
            <BrandLogo onClick={() => onNavigate("home")} />
            <AmbientSound variant="navbar" />
          </div>

          {/* 右侧导航项 */}
          <div className="sn-bar-right">
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
        </div>
      </nav>

      <style>{`
        /* ---------- 导航栏容器 ---------- */
        .sn-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          width: 100%;
          background: rgba(255, 255, 255, 0.82);
          border-bottom: 1px solid rgba(232, 226, 216, 0.5);
          backdrop-filter: blur(16px) saturate(1.2);
          -webkit-backdrop-filter: blur(16px) saturate(1.2);
          box-shadow: 0 2px 12px rgba(80, 76, 66, 0.06);
        }
        .sn-bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* ---------- 左侧 ---------- */
        .sn-bar-left {
          display: flex;
          align-items: center;
          gap: 14px;
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

        /* ---------- 右侧导航项 ---------- */
        .sn-bar-right {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* ---------- 单条导航 ---------- */
        .sn-link {
          position: relative;
          padding: 8px 18px;
          font-size: 14px;
          font-weight: 400;
          color: #6a7066;
          letter-spacing: 0.05em;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 999px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
        }
        .sn-link:hover {
          color: #3A4F3A;
          background: rgba(122, 154, 130, 0.08);
        }
        .sn-link.is-active {
          color: #3A4F3A;
          font-weight: 500;
          background: rgba(122, 154, 130, 0.12);
          box-shadow: 0 1px 4px rgba(93, 138, 106, 0.08);
        }

        /* ---------- 响应式 ---------- */
        @media (max-width: 640px) {
          .sn-bar-inner {
            height: 52px;
            padding: 0 16px;
          }
          .sn-link {
            padding: 6px 10px;
            font-size: 12px;
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

export default SimpleNavbar;
