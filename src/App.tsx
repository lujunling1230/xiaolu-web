import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import SimpleNavbar from "./components/SimpleNavbar";
import LeafBook from "./components/LeafBook";
import Lab from "./components/Lab";
import DynamicBackground from "./components/DynamicBackground";
import ButterflyCursor from "./components/ButterflyCursor";

type Section = "home" | "about" | "projects" | "lab";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

/* ===== 关于我 - 生活切面数据 ===== */
const HOBBIES = [
  { emoji: "📖", name: "阅读", desc: "最近在读《思考，快与慢》，丹尼尔·卡尼曼的经典之作。", detail: "金句摘录：我们对我们所知的东西的信心，远远超过了我们所知的东西。" },
  { emoji: "📸", name: "摄影", desc: "喜欢用镜头捕捉森林里的光影，记录转瞬即逝的自然之美。", detail: "设备：Sony A7C + 28-60mm，偏爱自然光与胶片色调。" },
  { emoji: "🎧", name: "音乐/播客", desc: "播客重度用户，最喜欢「声东击西」和「日谈公园」。", detail: "音乐偏好：后摇、古典、氛围电子。最近单曲循环坂本龙一。" },
  { emoji: "🏃", name: "运动", desc: "每周跑步 3 次，配速 5'30\"，享受奔跑时的心流状态。", detail: "Keep 累计 300+ km，最佳半马 1:58:32。" },
  { emoji: "🧘", name: "冥想", desc: "每天 10 分钟正念冥想，已坚持 200+ 天。", detail: "使用 Headspace 引导，偏爱身体扫描与呼吸觉察。" },
  { emoji: "📺", name: "追剧", desc: "剧迷一枚，最近在追《重启人生》和《繁花》。", detail: "品味：日剧 > 韩剧 > 国剧。最爱《深夜食堂》系列。" },
];

const SKILLS = ["产品规划", "用户研究", "需求分析", "原型设计", "数据分析", "AI 应用", "项目管理", "跨部门协作", "竞品分析", "增长策略"];

const AppContent: React.FC = () => {
  const { isNight, toggleTheme } = useTheme();
  const [current, setCurrent] = useState<Section>("home");
  const [isFullMode, setIsFullMode] = useState(false);
  const openBookRef = useRef<(() => void) | null>(null);
  const [lightboxHobby, setLightboxHobby] = useState<number | null>(null);

  const registerOpenBook = useCallback((fn: () => void) => {
    openBookRef.current = fn;
  }, []);

  // 解析 URL 参数 ?mode=full — 控制纯净版/完整版
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const full = params.get("mode") === "full";
    setIsFullMode(full);
    document.title = full ? "路俊玲 | AI 产品经理作品集" : "森林疗愈室";
  }, []);

  // 滚动监听 — 完整模式监听全部区块，纯净模式仅监听 home + lab
  useEffect(() => {
    const sections = isFullMode
      ? ["home", "about", "projects", "lab"]
      : ["home", "lab"];
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

  const handleNavigate = (section: Section) => {
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // "翻阅我的作品" → 滚动到项目集 + 自动翻书
  const handleOpenBook = () => {
    const projectsEl = document.getElementById("projects");
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: "smooth" });
      // 等滚动完成后触发翻书动画
      setTimeout(() => openBookRef.current?.(), 800);
    }
  };

  return (
    <div className="page-overlay">
      <DynamicBackground />
      <ButterflyCursor />
      <SimpleNavbar
        current={current}
        onNavigate={handleNavigate}
        isNight={isNight}
        onToggleTheme={toggleTheme}
        isFullMode={isFullMode}
      />

      {/* ========== 首页 Hero ========== */}
      <section
        id="home"
        className="hero-section min-h-screen flex flex-col justify-center px-6 md:px-24 max-w-4xl mx-auto"
      >
        <div className="hero-overlay" />
        <motion.div {...fadeUp} className="hero-content">
          {isFullMode ? (
            <>
              <p className="text-sm mb-4 tracking-widest uppercase" style={{ color: "var(--accent)" }}>
                AI Product Manager
              </p>
              <h1 className="hero-title text-5xl md:text-6xl mb-6" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                路俊玲
              </h1>
              <p className="hero-sub text-xl md:text-2xl mb-4" style={{ maxWidth: "520px" }}>
                Building Human-Centric AI Products
              </p>
              <p className="hero-body text-base max-w-xl leading-relaxed mb-10">
                从软件工程的代码世界出发，逐渐走向 AI 产品的舞台。
                相信好的产品源自对人的理解——技术是手段，温柔才是底色。
              </p>
              <div className="hero-buttons">
                <button
                  onClick={() => handleNavigate("about")}
                  className="hero-btn hero-btn-primary"
                >
                  了解更多
                </button>
                <button
                  onClick={handleOpenBook}
                  className="hero-btn hero-btn-outline"
                >
                  翻阅我的作品 📖
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm mb-4 tracking-widest uppercase" style={{ color: "var(--accent)" }}>
                Forest Healing Room
              </p>
              <h1 className="hero-title text-5xl md:text-6xl mb-6" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                森林疗愈室
              </h1>
              <p className="hero-sub text-xl md:text-2xl mb-4" style={{ maxWidth: "520px" }}>
                在这里，每一次呼吸都有人同在
              </p>
              <p className="hero-body text-base max-w-xl leading-relaxed mb-6">
                一个安静的角落，为你准备了呼吸引导、冥想空间和感恩日记。
              </p>
              {/* 社交认同 — 传递"你并不孤单" */}
              <div className="social-proof">
                <p className="social-proof-main">
                  已陪伴 <span className="social-proof-num">1000+</span> 位朋友找到平静
                </p>
                <p className="social-proof-sub">每一次呼吸，都有人同在。</p>
              </div>
              <div className="hero-buttons">
                <button
                  onClick={() => handleNavigate("lab")}
                  className="hero-btn hero-btn-primary"
                >
                  进入疗愈室
                </button>
              </div>
            </>
          )}
        </motion.div>

        <style>{`
          .hero-section { position: relative; }
          .hero-overlay {
            position: absolute; inset: 0; z-index: 0; pointer-events: none;
            background: linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.65) 100%);
            border-radius: 16px;
          }
          [data-theme="night"] .hero-overlay {
            background: linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.75) 100%);
          }
          .hero-content { position: relative; z-index: 1; }
          .hero-title {
            color: #ffffff;
            text-shadow: 0 2px 8px rgba(0,0,0,0.7), 0 0 24px rgba(0,0,0,0.4);
          }
          .hero-sub, .hero-body {
            color: #ffffff;
            text-shadow: 0 2px 8px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.5);
          }
          .hero-buttons { display: flex; gap: 16px; flex-wrap: wrap; }
          .hero-btn {
            padding: 12px 28px; font-size: 14px; font-weight: 500; border-radius: 10px;
            border: none; cursor: pointer;
            transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
          }
          .hero-btn:hover { transform: translateY(-2px); }
          .hero-btn-primary {
            background: var(--accent); color: #fff;
            box-shadow: 0 4px 16px -4px rgba(122,154,130,0.4);
          }
          .hero-btn-primary:hover { background: var(--accent-hover); box-shadow: 0 8px 24px -4px rgba(122,154,130,0.5); }
          .hero-btn-outline {
            background: rgba(255,255,255,0.2); color: #fff;
            border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(4px);
            box-shadow: 0 2px 12px -4px rgba(0,0,0,0.2);
          }
          .hero-btn-outline:hover { background: rgba(255,255,255,0.3); border-color: var(--accent); }
          /* 社交认同 */
          .social-proof {
            margin-bottom: 24px; padding: 14px 20px; border-radius: 12px;
            background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.15);
            backdrop-filter: blur(8px);
            display: inline-block;
          }
          .social-proof-main {
            font-size: 14px; color: #fff; margin: 0 0 4px;
          }
          .social-proof-num {
            font-family: "Noto Serif SC", serif; font-weight: 600;
            color: #C8E6C9; font-size: 16px;
          }
          .social-proof-sub {
            font-size: 12px; color: rgba(255,255,255,0.7); margin: 0;
          }
        `}</style>
      </section>

      {/* ========== 关于我 + 项目集（仅完整模式显示） ========== */}
      {isFullMode && (
      <>
      <section
        id="about"
        className="min-h-screen px-6 md:px-24 max-w-5xl mx-auto py-24"
      >
        {/* 模块 A：专业能力 */}
        <motion.div {...fadeUp} className="about-module">
          <div className="about-module-inner about-pro">
            <div className="about-pro-left">
              <h2 className="about-section-title">我的专业能力</h2>
              <p className="about-pro-intro">
                专注于 AI 产品落地与人性化设计。从需求洞察到产品上线，
                擅长将复杂技术转化为用户可感知的价值。
              </p>
              <div className="about-edu">
                <div className="about-edu-item">
                  <p className="about-edu-school">河南工学院</p>
                  <p className="about-edu-detail">本科 · 软件工程</p>
                </div>
              </div>
            </div>
            <div className="about-pro-right">
              <p className="about-label">核心技能</p>
              <div className="about-skill-cloud">
                {SKILLS.map((skill) => (
                  <motion.span
                    key={skill}
                    className="about-skill-tag"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.2 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 模块 B：生活切面 */}
        <motion.div {...fadeUp} className="about-module" style={{ marginTop: 48 }}>
          <h3 className="about-section-title" style={{ marginBottom: 20 }}>生活切面</h3>
          <div className="about-hobby-grid">
            {HOBBIES.map((hobby, idx) => (
              <motion.div
                key={hobby.name}
                className="about-hobby-card"
                whileHover={{ y: -4, boxShadow: "0 12px 32px -8px rgba(60,80,60,0.2)" }}
                transition={{ duration: 0.25 }}
                onClick={() => setLightboxHobby(idx)}
              >
                <div className="about-hobby-emoji">{hobby.emoji}</div>
                <div className="about-hobby-label">{hobby.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 灯箱 Modal */}
        <AnimatePresence>
          {lightboxHobby !== null && (
            <motion.div
              className="about-lightbox-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxHobby(null)}
            >
              <motion.div
                className="about-lightbox"
                initial={{ scale: 0.92, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 30 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="about-lightbox-close" onClick={() => setLightboxHobby(null)}>×</button>
                <div className="about-lightbox-icon">{HOBBIES[lightboxHobby].emoji}</div>
                <h3 className="about-lightbox-name">{HOBBIES[lightboxHobby].name}</h3>
                <p className="about-lightbox-desc">{HOBBIES[lightboxHobby].desc}</p>
                <div className="about-lightbox-detail">
                  <p className="about-lightbox-detail-label">更多细节</p>
                  <p className="about-lightbox-detail-text">{HOBBIES[lightboxHobby].detail}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          .about-module-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
          .about-section-title {
            font-family: "Noto Serif SC", Georgia, serif;
            font-size: 28px; font-weight: 600; color: var(--text);
            margin-bottom: 20px; letter-spacing: 0.02em;
          }
          .about-pro-intro { font-size: 15px; line-height: 1.8; color: var(--text-soft); margin-bottom: 24px; }
          .about-edu { display: flex; flex-direction: column; gap: 12px; }
          .about-edu-item { padding-left: 16px; border-left: 2px solid var(--border); }
          .about-edu-school { font-size: 15px; font-weight: 500; color: var(--text); margin: 0 0 2px; }
          .about-edu-detail { font-size: 13px; color: var(--text-soft); margin: 0; }
          .about-label { font-size: 13px; color: var(--text-soft); margin-bottom: 12px; letter-spacing: 0.05em; }
          .about-skill-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
          .about-skill-tag {
            padding: 6px 16px; font-size: 13px; border-radius: 999px;
            background: rgba(122,154,130,0.1); color: var(--accent);
            cursor: default; transition: transform 0.2s ease;
          }
          /* 爱好网格 */
          .about-hobby-grid {
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
          }
          .about-hobby-card {
            position: relative; padding: 32px 16px; border-radius: 16px;
            background: var(--card-bg); border: 1px solid var(--border);
            text-align: center; cursor: pointer;
            box-shadow: 0 4px 16px -6px rgba(60,80,60,0.08);
            transition: transform 0.25s ease, box-shadow 0.25s ease;
            overflow: hidden;
          }
          .about-hobby-card::after {
            content: ""; position: absolute; inset: 0;
            background: linear-gradient(to top, rgba(122,154,130,0.06) 0%, transparent 60%);
            pointer-events: none;
          }
          .about-hobby-emoji { font-size: 32px; margin-bottom: 10px; position: relative; z-index: 1; }
          .about-hobby-label {
            font-family: "Noto Serif SC", Georgia, serif;
            font-size: 14px; font-weight: 500; color: var(--text);
            position: relative; z-index: 1;
          }
          /* 灯箱 */
          .about-lightbox-overlay {
            position: fixed; inset: 0; z-index: 200; display: flex;
            align-items: center; justify-content: center; padding: 24px;
            background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
          }
          .about-lightbox {
            position: relative; width: 100%; max-width: 480px; padding: 36px;
            border-radius: 20px; background: var(--card-bg);
            border: 1px solid var(--border);
            box-shadow: 0 24px 64px -16px rgba(0,0,0,0.3); text-align: center;
          }
          .about-lightbox-close {
            position: absolute; top: 14px; right: 14px; width: 32px; height: 32px;
            border: none; border-radius: 50%; background: rgba(255,255,255,0.9);
            color: var(--text-soft); font-size: 18px; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: background 0.2s ease;
          }
          .about-lightbox-close:hover { background: #fff; }
          .about-lightbox-icon { font-size: 48px; margin-bottom: 16px; }
          .about-lightbox-name {
            font-family: "Noto Serif SC", Georgia, serif;
            font-size: 22px; font-weight: 600; color: var(--text); margin-bottom: 12px;
          }
          .about-lightbox-desc {
            font-size: 14px; line-height: 1.7; color: var(--text-soft); margin-bottom: 20px;
          }
          .about-lightbox-detail {
            padding: 16px; border-radius: 12px;
            background: rgba(122,154,130,0.06); text-align: left;
          }
          .about-lightbox-detail-label {
            font-size: 11px; color: var(--accent); letter-spacing: 0.1em;
            text-transform: uppercase; margin-bottom: 6px;
          }
          .about-lightbox-detail-text { font-size: 13px; line-height: 1.7; color: var(--text-soft); margin: 0; }

          @media (max-width: 768px) {
            .about-module-inner { grid-template-columns: 1fr; gap: 24px; }
            .about-hobby-grid { grid-template-columns: repeat(2, 1fr); }
            .about-section-title { font-size: 24px; }
          }
        `}</style>
      </section>

      {/* ========== 项目集 — 树叶书 ========== */}
      <section
        id="projects"
        className="min-h-screen px-6 md:px-24 max-w-5xl mx-auto py-24"
      >
        <motion.div {...fadeUp}>
          <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            项目集
          </h2>
          <p className="text-base mb-2 max-w-xl" style={{ color: "var(--text-soft)" }}>
            翻开这本树叶书，每一页都是一段实践的印记。
          </p>
        </motion.div>
        <LeafBook registerOpenBook={registerOpenBook} />
      </section>
      </>
      )}

      {/* ========== 疗愈室 ========== */}
      <section
        id="lab"
        className="min-h-screen px-6 md:px-24 max-w-5xl mx-auto py-24"
      >
        <motion.div {...fadeUp}>
          <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            疗愈室
          </h2>
          <p className="text-base mb-2 max-w-xl" style={{ color: "var(--text-soft)" }}>
            四个实验性的自我疗愈工具，在快节奏的产品工作中保持内心的平静。
          </p>
        </motion.div>
        <Lab />
      </section>

      {/* 页脚 */}
      <footer className="py-12 px-6 text-center" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-sm" style={{ color: "var(--text-soft)" }}>
          © 2026 路俊玲 · Building Human-Centric AI Products
        </p>
        <p className="text-xs mt-2" style={{ color: "var(--text-soft)" }}>
          junling@example.com
        </p>
      </footer>
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
