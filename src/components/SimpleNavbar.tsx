import AmbientSound from "./AmbientSound";
import { Link } from "react-router-dom";

/* ============================================================
 * SimpleNavbar 横向导航栏（全宽版）
 * 首页 / 关于我 / 作品集 / 作品说明书 / 联系我
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
 * BrandLogo — 小鹿 + luro
 * ----------------------------------------------------------- */
const BrandLogo: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <a
    href="#home"
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className="sn-logo"
    aria-label="返回首页"
  >
    {/* 小鹿 SVG */}
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 鹿角 */}
      <path d="M8 6C6 4 4 4 3 5C2 6 3 8 5 9" stroke="#5d8a6a" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 6C18 4 20 4 21 5C22 6 21 8 19 9" stroke="#5d8a6a" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* 鹿头 */}
      <ellipse cx="12" cy="12" rx="5" ry="6" fill="rgba(93,138,106,0.1)" stroke="#5d8a6a" strokeWidth="1.2" />
      {/* 耳朵 */}
      <ellipse cx="8" cy="9" rx="2" ry="3" fill="rgba(93,138,106,0.08)" stroke="#5d8a6a" strokeWidth="1" transform="rotate(-20 8 9)" />
      <ellipse cx="16" cy="9" rx="2" ry="3" fill="rgba(93,138,106,0.08)" stroke="#5d8a6a" strokeWidth="1" transform="rotate(20 16 9)" />
      {/* 眼睛 */}
      <circle cx="10" cy="11" r="1" fill="#5d8a6a" />
      <circle cx="14" cy="11" r="1" fill="#5d8a6a" />
      {/* 鼻子 */}
      <circle cx="12" cy="15" r="1.2" fill="#5d8a6a" opacity="0.6" />
    </svg>
    <span className="sn-brand">luro</span>
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
          {/* 左侧 Logo */}
          <div className="sn-bar-left">
            <BrandLogo onClick={() => onNavigate("home")} />
          </div>

          {/* 中间导航项 */}
          <div className="sn-bar-center">
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

          {/* 右侧：白噪音 + 联系我 */}
          <div className="sn-bar-right">
            <AmbientSound variant="navbar" />
            <Link to="/contact" className="sn-link sn-link--contact">
              联系我
            </Link>
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

        /* ---------- 左侧 Logo ---------- */
        .sn-bar-left {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          min-width: 80px;
        }
        .sn-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: opacity 0.25s ease;
        }
        .sn-logo:hover {
          opacity: 0.8;
        }
        .sn-brand {
          font-family: "Noto Sans SC", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #3A4F3A;
          letter-spacing: 0.06em;
          line-height: 1;
        }

        /* ---------- 中间导航 ---------- */
        .sn-bar-center {
          display: flex;
          align-items: center;
          gap: 2px;
          flex: 1;
          justify-content: center;
        }

        /* ---------- 右侧 ---------- */
        .sn-bar-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          min-width: 80px;
          justify-content: flex-end;
        }

        /* ---------- 单条导航 ---------- */
        .sn-link {
          position: relative;
          padding: 8px 16px;
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
        .sn-link--contact {
          padding: 7px 16px;
          border: 1px solid rgba(122, 154, 130, 0.25);
          color: #5d8a6a;
          font-size: 13px;
        }
        .sn-link--contact:hover {
          background: rgba(93, 138, 106, 0.1);
          border-color: rgba(93, 138, 106, 0.4);
          color: #3A4F3A;
        }

        /* ---------- 响应式 ---------- */
        @media (max-width: 640px) {
          .sn-bar-inner {
            height: 52px;
            padding: 0 16px;
          }
          .sn-brand {
            font-size: 1rem;
          }
          .sn-link {
            padding: 6px 10px;
            font-size: 12px;
          }
          .sn-link--contact {
            padding: 5px 10px;
            font-size: 11px;
          }
          .sn-bar-center {
            gap: 0;
          }
          .sn-bar-right {
            gap: 6px;
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
