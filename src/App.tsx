import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import SimpleNavbar from "./components/SimpleNavbar";
import LeafBook from "./components/LeafBook";
import DynamicBackground from "./components/DynamicBackground";
import ButterflyCursor from "./components/ButterflyCursor";
import Footer from "./components/Footer";
import { initSiteData, loadAdminSession, fetchSiteData } from "./utils/siteData";
import { isElectron } from "./utils/electron";

type Section = "home" | "about" | "projects" | "lab" | "film" | "mickey";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const AppContent: React.FC = () => {
  const { isNight, toggleTheme } = useTheme();
  const electron = isElectron();
  const [current, setCurrent] = useState<Section>("home");
  const [isFullMode, setIsFullMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const openBookRef = useRef<(() => void) | null>(null);

  /* 初始化站点数据 + 恢复管理员会话 + 异步拉取远程最新数据 */
  useEffect(() => {
    initSiteData();
    loadAdminSession();
    // 启动时静默拉取服务端最新数据，更新本地缓存
    fetchSiteData().catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pure = params.get("mode") === "pure";
    setIsFullMode(!pure);
    document.title = pure ? "森林疗愈室" : "路俊玲 · AI 产品经理作品集";
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 300);
    return () => clearTimeout(timer);
  }, [isFullMode]);

  useEffect(() => {
    const sections = isFullMode ? ["home", "about", "projects"] : ["home"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(entry.target.id as Section);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isFullMode]);

  const handleNavigate = (section: Section, openBook = false) => {
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    // 作品说明书：仅当明确要求时才翻开树叶书（如"翻阅我的作品"按钮）
    if (section === "projects" && openBook) {
      setTimeout(() => { if (openBookRef.current) openBookRef.current(); }, 700);
    }
  };

  const registerOpenBook = (fn: () => void) => {
    openBookRef.current = fn;
  };

  return (
    <div className="po-root">
      <DynamicBackground />
      <ButterflyCursor />

      {/* 导航栏（滚动后毛玻璃） */}
      <div className={`po-nav-wrap ${scrolled ? "po-nav-scrolled" : ""}`}>
        <SimpleNavbar
          current={current}
          onNavigate={handleNavigate}
          isFullMode={isFullMode}
        />
      </div>

      {/* ==================== 首页 Hero ==================== */}
      <section id="home" className="po-hero">
        <motion.div
          className="po-hero-inner"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {isFullMode ? (
            <>
              <p className="po-eyebrow">AI Product Manager</p>
              <h1 className="po-name">路俊玲</h1>
              <p className="po-tagline">AI 产品经理 | 软件工程背景 | Digital Atelier</p>
              <p className="po-bio">
                从技术底座走向产品价值。具备扎实的软件工程思维与代码实现能力，
                擅长在技术与人性之间寻找平衡点。我致力于将复杂的技术能力，
                转化为可触达用户的 AI 原型与产品——相信好的产品不仅懂需求，
                更懂背后的逻辑与温度。
              </p>
              <div className="po-hero-btns">
                <button onClick={() => handleNavigate("about")} className="po-btn po-btn-primary">
                  了解更多
                </button>
                <button onClick={() => handleNavigate("projects", true)} className="po-btn po-btn-ghost">
                  翻阅我的作品 📖
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="po-eyebrow" style={{ color: "var(--accent)" }}>Forest Healing Room</p>
              <h1 className="po-name">森林疗愈室</h1>
              <p className="po-tagline">在这里，每一次呼吸都有人同在</p>
              <p className="po-bio">
                一个安静的角落，为你准备了呼吸引导、冥想空间和感恩日记。
              </p>
              <div className="po-hero-btns">
                <button onClick={() => handleNavigate("lab")} className="po-btn po-btn-primary">
                  进入疗愈室
                </button>
              </div>
            </>
          )}
        </motion.div>
      </section>

      {/* ==================== 关于我 ==================== */}
      {isFullMode && (
        <>
          <section id="about" className="po-section">
            <div className="po-section-inner">
              <motion.h2 {...fadeUp} className="po-section-heading">关于我</motion.h2>

              {/* 左：专业能力 + 核心技能 */}
              <div className="po-about-left">
                <motion.div {...fadeUp} className="po-text-block">
                  <h3 className="po-block-title">我的专业能力</h3>
                  <p className="po-block-meta">AI 产品实践者 | 软件工程背景</p>
                  <p className="po-block-body">
                    专注 AI 产品落地与人性化设计。依托软件工程的专业底色，
                    我将技术逻辑转化为清晰的产品路径。擅长从真实场景洞察需求，
                    通过工程化思维推动 AI 产品从 0 到 1 的落地，创造可感知的用户价值。
                  </p>
                  <p className="po-block-meta">AI 产品探索者 · 持续实践中</p>
                </motion.div>

                <motion.div {...fadeUp} className="po-text-block">
                  <h3 className="po-block-title">核心技能</h3>
                  <div className="po-skill-groups">
                    <div className="po-skill-group">
                      <span className="po-skill-group-label">AI & 算法</span>
                      <div className="po-skill-cloud">
                        {["大模型应用设计", "Prompt 工程", "RAG 架构", "AI 工作流设计"].map(s => (
                          <span key={s} className="po-skill-tag po-skill-tag--ai">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="po-skill-group">
                      <span className="po-skill-group-label">产品能力</span>
                      <div className="po-skill-cloud">
                        {["需求分析", "原型设计", "项目管理", "数据分析", "用户研究"].map(s => (
                          <span key={s} className="po-skill-tag">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="po-skill-group">
                      <span className="po-skill-group-label">工程优势</span>
                      <div className="po-skill-cloud">
                        {["软件开发", "敏捷迭代", "数据埋点", "代码实现"].map(s => (
                          <span key={s} className="po-skill-tag po-skill-tag--eng">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* 右：教育背景 + 个人宣言 */}
              <div className="po-about-right">
                <motion.div {...fadeUp} className="po-text-block">
                  <h3 className="po-block-title">教育背景</h3>
                  <div className="po-edu-item">
                    <span className="po-edu-school">河南工学院</span>
                    <span className="po-edu-degree">本科 · 软件工程</span>
                  </div>
                </motion.div>

                <motion.div {...fadeUp} className="po-text-block">
                  <blockquote className="po-quote">"这是我的第一个数字造物场。"</blockquote>
                  <p className="po-block-body">
                    过去习惯于在文档里定义需求和逻辑；现在，想用代码和 AI 去直接构建解决方案。
                  </p>
                  <p className="po-block-body">
                    我相信，最好的产品不是功能的堆砌，而是对真实痛点的温柔回应。
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ==================== 作品说明书 ==================== */}
          <section id="projects" className="po-section po-section-last po-section-projects">
            <div className="po-section-inner">
              <motion.h2 {...fadeUp} className="po-section-heading">作品说明书</motion.h2>

              {/* 叶子书 */}
              <motion.div {...fadeUp} className="po-leafbook-wrap">
                <LeafBook registerOpenBook={registerOpenBook} />
              </motion.div>
            </div>
          </section>
        </>
      )}

      {/* 页脚 */}
      <Footer isFullMode={isFullMode} />



      <style>{`
        /* ===== 全局根 ===== */
        .po-root {
          position: relative; min-height: 100vh;
        }

        /* 导航栏 */
        .po-nav-wrap {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          pointer-events: none;
          transition: background 0.3s ease;
        }

        /* ===== Hero 首屏 ===== */
        .po-hero {
          position: relative;
          min-height: 100vh;
          display: flex; align-items: flex-start; justify-content: center;
          padding-top: 22vh;
          overflow: hidden;
        }
        .po-hero::after {
          content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.04) 30%, rgba(0,0,0,0.12) 70%, rgba(0,0,0,0.22) 100%);
        }

        /* 漂浮文字块（无卡片边框，无底部遮罩） */
        .po-hero-inner {
          position: relative; z-index: 2;
          max-width: 680px; width: calc(100% - 48px);
          text-align: center;
          display: flex; flex-direction: column; align-items: center;
        }

        .po-eyebrow {
          font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(200,220,200,0.88); margin: 0 0 14px; font-weight: 500;
        }
        .po-name {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(52px, 10vw, 80px); font-weight: 700;
          color: #fff; margin: 0 0 16px; line-height: 1.05;
          letter-spacing: 0.04em;
          text-shadow: 0 4px 20px rgba(0,0,0,0.35);
          /* 微渐变下划线 */
          background: linear-gradient(90deg, transparent 0%, rgba(200,220,200,0.6) 50%, transparent 100%);
          background-size: 100% 3px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          padding-bottom: 8px;
        }
        .po-tagline {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(15px, 2.5vw, 18px);
          color: rgba(255,255,255,0.85); margin: 0 0 28px;
          font-weight: 400; letter-spacing: 0.04em;
          text-shadow: 0 2px 12px rgba(0,0,0,0.35);
        }
        .po-bio {
          font-size: 14px; line-height: 1.8; color: rgba(255,255,255,0.72);
          margin: 0 0 40px; max-width: 560px;
          text-shadow: 0 2px 12px rgba(0,0,0,0.35);
          letter-spacing: 0.02em;
        }
        .po-hero-btns { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; position: relative; z-index: 1; }

        /* ===== 幽灵按钮 ===== */
        .po-btn {
          padding: 11px 28px; font-size: 14px; font-weight: 500;
          border-radius: 999px; cursor: pointer;
          transition: all 0.3s ease; font-family: inherit;
          letter-spacing: 0.03em;
        }
        .po-btn-primary {
          border: 1.5px solid transparent;
          background: #4a7a5a; color: #fff;  /* 深森林绿 */
          box-shadow: 0 4px 16px -4px rgba(74,122,90,0.45);
        }
        .po-btn-primary:hover {
          background: #3a6a4a;
          transform: scale(1.05);
          box-shadow: 0 8px 24px -4px rgba(74,122,90,0.55);
        }
        .po-btn-ghost {
          border: 1.5px solid rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.88);
          backdrop-filter: blur(8px);
        }
        .po-btn-ghost:hover {
          border-color: rgba(255,255,255,0.6);
          background: rgba(255,255,255,0.18);
          transform: scale(1.05);
        }

        /* ===== 各模块通用 ===== */
        .po-section {
          padding: 40px 0 100px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .po-section-last { border-bottom: 1px solid rgba(255,255,255,0.08); }

        /* 作品说明书模块：紧凑上移 */}
        .po-section-projects { padding-top: 0; }
        .po-section-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 48px;
        }
        .po-section-heading {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(28px, 4vw, 36px); font-weight: 600;
          color: #4a4038; margin: 0 0 80px;
          letter-spacing: 0.06em;
          text-shadow: 0 1px 4px rgba(255,255,255,0.5);
        }

        /* ===== 关于我：纯文字左右布局 ===== */
        .po-about-left {
          display: flex; flex-direction: column; gap: 48px;
          margin-bottom: 60px;
        }
        .po-about-right {
          display: flex; flex-direction: column; gap: 48px;
        }
        @media (min-width: 768px) {
          .po-section-inner > .po-about-left,
          .po-section-inner > .po-about-right {
            flex-direction: row; gap: 80px;
          }
          .po-about-left > * { flex: 1; }
          .po-about-right > * { flex: 1; }
        }

        /* 漂浮文字块：极简毛玻璃，弱化卡片感 */
        .po-text-block {
          position: relative;
          padding: 28px 24px;
          background: rgba(255, 252, 245, 0.15);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .po-text-block::after {
          display: none;
        }

        /* 标题：浅米色，更强阴影 */
        .po-block-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(17px, 2.2vw, 20px); font-weight: 600;
          color: #4a4038; margin: 0 0 14px;
          letter-spacing: 0.04em;
          text-shadow: 0 1px 4px rgba(255,255,255,0.6);
        }
        /* 正文：深橄榄绿，清晰可读 */
        .po-block-body {
          font-size: 13px; line-height: 1.8; color: #3a4a2c;
          margin: 0 0 12px;
          text-shadow: 0 1px 3px rgba(255,255,255,0.5);
          letter-spacing: 0.02em;
        }
        .po-block-meta {
          font-size: 12px; color: #7a9a6a; margin: 0;
          letter-spacing: 0.05em;
        }
        .po-edu-item {
          display: flex; flex-direction: column; gap: 4px;
          padding-left: 16px;
          border-left: 2px solid rgba(122,154,130,0.5);
        }
        .po-edu-school { font-size: 15px; font-weight: 500; color: #4a4038; }
        .po-edu-degree { font-size: 13px; color: #7a7268; }

        /* 技能分组 */
        .po-skill-groups { display: flex; flex-direction: column; gap: 16px; }
        .po-skill-group { display: flex; flex-direction: column; gap: 8px; }
        .po-skill-group-label {
          font-size: 12px; font-weight: 600;
          color: #5a6a4c; letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* 技能标签：淡黄绿填充 */
        .po-skill-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
        .po-skill-tag {
          padding: 5px 12px; font-size: 12px;
          border-radius: 999px;
          background: rgba(168, 190, 120, 0.2);
          border: 1px solid rgba(168, 190, 120, 0.45);
          color: #3a4a2c;
          cursor: default;
          text-shadow: 0 1px 3px rgba(255,255,255,0.6);
          transition: all 0.2s ease;
        }
        .po-skill-tag:hover {
          background: rgba(168, 190, 120, 0.3);
          border-color: rgba(168, 190, 120, 0.6);
        }
        .po-skill-tag--ai {
          background: rgba(93, 138, 106, 0.12);
          border-color: rgba(93, 138, 106, 0.35);
          color: #4a6a4a;
        }
        .po-skill-tag--ai:hover {
          background: rgba(93, 138, 106, 0.22);
          border-color: rgba(93, 138, 106, 0.5);
        }
        .po-skill-tag--eng {
          background: rgba(176, 120, 50, 0.1);
          border-color: rgba(176, 120, 50, 0.3);
          color: #6a4a2a;
        }
        .po-skill-tag--eng:hover {
          background: rgba(176, 120, 50, 0.18);
          border-color: rgba(176, 120, 50, 0.45);
        }

        /* 宣言引言：数字造物场 — 背景水印风格 */
        .po-quote {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(20px, 2.5vw, 26px); font-weight: 700;
          color: #6a8a6a; margin: 0 0 16px;
          line-height: 1.45; letter-spacing: 0.03em;
          opacity: 0.75;
          text-shadow: 0 2px 8px rgba(255,255,255,0.7);
        }

        /* ===== 作品说明书 ===== */
        .po-leafbook-wrap {
          margin-bottom: 80px;
          margin-top: 16px;
          display: flex; flex-direction: column; align-items: center;
        }
        /* 作品说明书副标题：居中引言风格 */
        .po-projects-sub {
          font-size: 16px;
          color: #888;
          font-style: italic;
          text-align: center;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto 20px;
          padding: 20px 0;
          letter-spacing: 0.02em;
        }
        .po-mickey-wrap {
          display: flex; flex-direction: column; align-items: center;
          gap: 16px; text-align: center;
          padding-bottom: 32px;
          position: relative;
        }
        .po-mickey-wrap::after {
          display: none;
        }
        .po-mickey-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(20px, 3vw, 26px); font-weight: 600;
          color: #4a4038; margin: 0;
          letter-spacing: 0.05em;
          text-shadow: 0 1px 4px rgba(255,255,255,0.6);
        }

        /* 幽灵按钮：投影 + hover变色 */
        .po-btn-ghost {
          border: 1.5px solid rgba(122,154,130,0.4);
          background: rgba(255,255,255,0.15);
          color: #6a8a6a;
          backdrop-filter: blur(8px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .po-btn-ghost:hover {
          border-color: rgba(122,154,130,0.7);
          background: rgba(122,154,130,0.18);
          color: #4a6a4a;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }

        /* ===== 响应式 ===== */
        @media (max-width: 768px) {
          .po-section { padding: 32px 0 70px; }
          .po-section-projects { padding-top: 0; }
          .po-section-inner { padding: 0 24px; }
          .po-section-heading { margin-bottom: 32px; }
          .po-about-left { gap: 32px; margin-bottom: 40px; }
          .po-about-right { gap: 32px; }
          .po-leafbook-wrap { margin-bottom: 60px; }
          .po-text-block { padding: 20px 18px; }
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
