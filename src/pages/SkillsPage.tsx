import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/* ============================================================
 * SkillsPage 技能独立页面
 * 参考 ONEAPPLE 风格：左侧专业技能 + 右侧个人能力
 * ============================================================ */

/** 技能数据 */
const expertSkills = [
  { name: "AI 产品", level: 5, icon: "AI" },
  { name: "Prompt", level: 5, icon: "Pr" },
  { name: "原型设计", level: 4, icon: "Ui" },
  { name: "数据分析", level: 4, icon: "Da" },
  { name: "代码实现", level: 4, icon: "Co" },
];

const abilityList = [
  { zh: "大模型应用设计", en: "LLM Application" },
  { zh: "RAG 架构", en: "RAG Architecture" },
  { zh: "需求分析", en: "Requirement Analysis" },
  { zh: "用户研究", en: "User Research" },
  { zh: "项目管理", en: "Project Management" },
  { zh: "敏捷迭代", en: "Agile Iteration" },
  { zh: "数据埋点", en: "Data Tracking" },
  { zh: "AI 工作流", en: "AI Workflow" },
  { zh: "原型设计", en: "Prototyping" },
  { zh: "跨团队沟通", en: "Cross-functional" },
];

const SkillsPage: React.FC = () => {
  return (
    <div className="sp-root">
      {/* 顶部导航栏 */}
      <nav className="sp-nav">
        <div className="sp-nav-inner">
          <Link to="/" className="sp-nav-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C7 4 4 8 4 13C4 18 8 22 12 22C16 22 20 18 20 13C20 8 17 4 12 2Z" stroke="#3A4F3A" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="6" x2="12" y2="20" stroke="#3A4F3A" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: "1.2rem", fontWeight: 600, color: "#3A4F3A" }}>路</span>
            <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: "1.2rem", fontWeight: 600, color: "#5d8a6a" }}>俊玲</span>
          </Link>
          <Link to="/" className="sp-nav-back">← 返回首页</Link>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="sp-main">
        <div className="sp-inner">
          {/* 左侧：专业技能 */}
          <motion.div
            className="sp-col"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="sp-section-title">
              专业技能
              <span className="sp-section-sub">expertise</span>
            </h2>
            <div className="sp-wave-box">
              {expertSkills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  className="sp-skill-row"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <span className="sp-skill-badge">{skill.icon}</span>
                  <div className="sp-skill-track">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span
                        key={idx}
                        className={`sp-skill-dot ${idx < skill.level ? "is-on" : ""}`}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 中间：装饰 */}
          <motion.div
            className="sp-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="sp-avatar">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="56" stroke="#7a9a82" strokeWidth="1.5" fill="rgba(122,154,130,0.08)" />
                <circle cx="60" cy="50" r="22" fill="rgba(122,154,130,0.15)" />
                <path d="M42 78C42 78 50 88 60 88C70 88 78 78 78 78" stroke="#7a9a82" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <circle cx="52" cy="48" r="4" fill="#7a9a82" opacity="0.6" />
                <circle cx="68" cy="48" r="4" fill="#7a9a82" opacity="0.6" />
                <path d="M55 58C55 58 58 62 60 62C62 62 65 58 65 58" stroke="#7a9a82" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <p className="sp-center-text">持续学习中</p>
          </motion.div>

          {/* 右侧：个人能力 */}
          <motion.div
            className="sp-col"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          >
            <h2 className="sp-section-title">
              个人能力
              <span className="sp-section-sub">ability</span>
            </h2>
            <div className="sp-wave-box">
              {abilityList.map((item, i) => (
                <motion.div
                  key={item.zh}
                  className="sp-ability-row"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <span className="sp-ability-ring" />
                  <span className="sp-ability-zh">{item.zh}</span>
                  <span className="sp-ability-en">{item.en}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <style>{`
        .sp-root {
          min-height: 100vh;
          background: #f7f5f2;
          background-image:
            radial-gradient(130% 70% at 50% -8%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 55%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          font-family: "Noto Sans SC", -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* 导航栏 */
        .sp-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }
        .sp-nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 28px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sp-nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .sp-nav-back {
          font-size: 14px;
          color: #5A6B5C;
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.25s ease;
        }
        .sp-nav-back:hover {
          color: #3A4F3A;
        }

        /* 主内容 */
        .sp-main {
          padding-top: 64px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sp-inner {
          max-width: 1100px;
          width: 100%;
          margin: 0 auto;
          padding: 60px 24px;
          display: flex;
          gap: 48px;
          align-items: flex-start;
          justify-content: center;
        }

        /* 通用栏 */
        .sp-col {
          flex: 1;
          max-width: 340px;
        }
        .sp-section-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(20px, 3vw, 26px);
          font-weight: 600;
          color: #4a4038;
          margin: 0 0 24px;
          letter-spacing: 0.06em;
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .sp-section-sub {
          font-size: 14px;
          font-weight: 400;
          color: #a8a39b;
          letter-spacing: 0.04em;
          text-transform: lowercase;
        }

        /* 波浪边框容器 */
        .sp-wave-box {
          position: relative;
          padding: 28px 24px;
          border-radius: 20px;
          background: rgba(255, 252, 245, 0.6);
          border: 1px solid rgba(200, 210, 190, 0.35);
        }
        .sp-wave-box::before {
          content: "";
          position: absolute;
          inset: -2px;
          border-radius: 22px;
          padding: 2px;
          background: linear-gradient(135deg, rgba(122,154,130,0.25), rgba(200,180,140,0.2), rgba(122,154,130,0.25));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        /* 专业技能行 */
        .sp-skill-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 0;
        }
        .sp-skill-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(122, 154, 130, 0.12);
          color: #5d8a6a;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          flex-shrink: 0;
          border: 1px solid rgba(122, 154, 130, 0.2);
        }
        .sp-skill-track {
          flex: 1;
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .sp-skill-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: rgba(200, 190, 170, 0.4);
          transition: all 0.3s ease;
        }
        .sp-skill-dot.is-on {
          background: #c17a5a;
          box-shadow: 0 0 0 3px rgba(193, 122, 90, 0.15);
        }

        /* 中间装饰 */
        .sp-center {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: 60px;
        }
        .sp-avatar {
          opacity: 0.55;
        }
        .sp-center-text {
          margin-top: 12px;
          font-size: 13px;
          color: #a8a39b;
          letter-spacing: 0.08em;
          font-family: "Noto Serif SC", serif;
        }

        /* 个人能力行 */
        .sp-ability-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
        }
        .sp-ability-ring {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid rgba(122, 154, 130, 0.5);
          flex-shrink: 0;
        }
        .sp-ability-zh {
          font-size: 14px;
          color: #4a4038;
          letter-spacing: 0.04em;
        }
        .sp-ability-en {
          font-size: 12px;
          color: #a8a39b;
          letter-spacing: 0.02em;
          margin-left: 4px;
        }

        /* 响应式 */
        @media (max-width: 900px) {
          .sp-inner {
            flex-direction: column;
            align-items: center;
            gap: 40px;
          }
          .sp-col {
            max-width: 100%;
            width: 100%;
          }
          .sp-center {
            padding-top: 0;
            order: -1;
          }
        }
      `}</style>
    </div>
  );
};

export default SkillsPage;
