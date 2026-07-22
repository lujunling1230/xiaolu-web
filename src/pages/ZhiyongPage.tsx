import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LeafBook from "../components/LeafBook";

/**
 * ZhiyongPage 致用 · 薪火录
 *
 * 单页滚动，四区块 + 左侧侧边导航：
 *   ① 玄关（Hero）— 致用薪火录
 *   ② 作品说明书（Projects）— LeafBook 作品陈列
 *   ③ 造物利器 — 作品集入口
 *   ④ 书房（Heritage）— 非遗实验场
 */

/* ========== 常量 ========== */
const SERIF = '"Noto Serif SC", "Songti SC", Georgia, serif';
const SANS  = '"Noto Sans SC", "PingFang SC", -apple-system, sans-serif';

/* ---------- 侧边导航 ---------- */
const NAV_ITEMS = [
  { id: "hero",     label: "首页", sub: "致用薪火录" },
  { id: "projects", label: "作品说明书", sub: "LeafBook" },
  { id: "tools",    label: "造物利器", sub: "作品集", isExternal: true },
  { id: "heritage", label: "薪火", sub: "非遗实验场" },
];

/* ---------- 作品说明书 ---------- */
const PROJECTS = [
  { name: "物资管家", path: "/toolbox/inventory", tag: "已交付", desc: "库存与保质期管理" },
  { name: "解忧杂货店", path: "/toolbox/advice", tag: "自研", desc: "治愈系问答空间" },
  { name: "通关清单", path: "/toolbox/quests", tag: "自研", desc: "游戏化 To-Do" },
  { name: "回血清单", path: "/toolbox/recharge", tag: "自研", desc: "i 人低能耗回血" },
  { name: "漫游指南", path: "/toolbox/travel", tag: "自研", desc: "旅行足迹与攻略" },
  { name: "系统调频", path: "/toolbox/answer", tag: "自研", desc: "5% 微改变认知" },
  { name: "作品集", path: "/toolbox", tag: "总览", desc: "九维作品全景图" },
];

/* ---------- 作品集 ---------- */
const TOOLS = [
  { name: "物资管家", icon: "📦", desc: "库存与保质期管理", path: "/toolbox/inventory" },
  { name: "解忧杂货店", icon: "🏮", desc: "治愈系问答空间", path: "/toolbox/advice" },
  { name: "通关清单", icon: "🎮", desc: "游戏化 To-Do", path: "/toolbox/quests" },
  { name: "回血清单", icon: "🔋", desc: "i 人低能耗回血", path: "/toolbox/recharge" },
  { name: "漫游指南", icon: "🧳", desc: "旅行足迹与攻略", path: "/toolbox/travel" },
  { name: "系统调频", icon: "📡", desc: "5% 微改变认知", path: "/toolbox/answer" },
  { name: "项目总览", icon: "🍃", desc: "九维作品全景图", path: "/toolbox" },
];

/* ---------- 非遗实验 ---------- */
const HERITAGE_ITEMS = [
  { name: "宣纸制作", dynasty: "唐", desc: "纸寿千年，墨韵万变" },
  { name: "活字印刷", dynasty: "宋", desc: "一字一世界，一板一乾坤" },
  { name: "苏绣技艺", dynasty: "宋", desc: "针脚如画，丝线生花" },
  { name: "紫砂壶", dynasty: "明", desc: "一壶一世界，一茶一人生" },
  { name: "景泰蓝", dynasty: "明", desc: "铜胎掐丝，点蓝成金" },
  { name: "榫卯结构", dynasty: "春秋", desc: "不用一钉，千年不倒" },
];

const ZhiyongPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [leafAutoFlip, setLeafAutoFlip] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  // 检测 URL 参数：是否从首页"翻阅我的作品"跳转而来
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("openBook") === "1") {
      setLeafAutoFlip(800);
      // 滚动到作品说明书区域
      setTimeout(() => {
        const el = document.getElementById("projects");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, []);

  // 滚动监听，更新当前激活的导航项
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i].id);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", position: "relative" }}>
      {/* 返回主站 */}
      <Link
        to="/"
        style={{
          position: "fixed",
          top: 24,
          left: 24,
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "#8b5e3c",
          fontFamily: SANS,
          fontSize: 13,
          letterSpacing: "0.05em",
          textDecoration: "none",
          transition: "opacity 0.3s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#8b5e3c" strokeWidth="1.5">
          <path d="M10 3L5 8l5 5" />
        </svg>
        返回主站
      </Link>

      {/* =============================================
          左侧侧边导航栏
          ============================================= */}
      <nav style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: 160,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 120,
        gap: 8,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
        borderRight: "1px solid rgba(0,0,0,0.05)",
      }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if ((item as any).isExternal) {
                  navigate("/mickey");
                } else {
                  scrollTo(item.id);
                }
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                padding: "10px 0",
                background: "none",
                border: "none",
                borderBottom: isActive ? "2px solid #8b5e3c" : "2px solid transparent",
                transition: "all 0.3s ease",
                width: "80%",
              }}
            >
              <span style={{
                fontFamily: SERIF,
                fontSize: 14,
                color: isActive ? "#8b5e3c" : "#555",
                letterSpacing: "0.08em",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}>
                {item.label}
              </span>
              <span style={{
                fontFamily: SANS,
                fontSize: 10,
                color: isActive ? "#8b5e3c" : "#999",
                letterSpacing: "0.05em",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
                opacity: isActive ? 1 : 0.7,
              }}>
                {item.sub}
              </span>
            </button>
          );
        })}
      </nav>

      <main style={{ position: "relative", zIndex: 1 }}>
        {/* =============================================
            ① 玄关 Hero
            ============================================= */}
        <section
          id="hero"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "120px 48px 80px",
            position: "relative",
            background: "#ffffff",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 640 }}>
            <p style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: "0.35em",
              color: "#999",
              margin: "0 0 16px",
              textTransform: "uppercase",
            }}>
              VOLUME II · 致用
            </p>

            <h1 style={{
              fontFamily: SERIF,
              fontSize: "clamp(40px, 7vw, 64px)",
              fontWeight: 700,
              color: "#8b5e3c",
              margin: 0,
              letterSpacing: "0.1em",
              lineHeight: 1.2,
            }}>
              薪 火 录
            </h1>

            <div style={{
              width: 80,
              height: 2,
              background: "#8b5e3c",
              margin: "32px auto",
              opacity: 0.15,
            }} />

            <p style={{
              fontFamily: SERIF,
              fontSize: 15,
              color: "#888",
              lineHeight: 2,
              margin: 0,
              fontStyle: "italic",
              letterSpacing: "0.02em",
            }}>
              本卷收录三类实践：已落地之项目、日常所用之工具、开放命题之实验。
              <br />
              三者未必互为因果，然皆为"致用"二字之注脚。
            </p>
          </div>

          {/* 滚动提示 */}
          <div style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: 0.3,
          }}>
            <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.25em", color: "#999" }}>
              SCROLL
            </span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#999" strokeWidth="1.2">
              <path d="M3 5l4 4 4-4" />
            </svg>
          </div>
        </section>

        {/* =============================================
            ② 作品说明书 Projects
            ============================================= */}
        <section id="projects" style={{ padding: "100px 48px 100px 208px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: "0.3em",
              color: "#bbb",
              margin: "0 0 12px",
              textTransform: "uppercase",
            }}>
              壹 · PROJECTS
            </p>
            <h2 style={{
              fontFamily: SERIF,
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 700,
              color: "#8b5e3c",
              margin: 0,
              letterSpacing: "0.08em",
            }}>
              作品说明书
            </h2>
            <p style={{
              fontFamily: SANS,
              fontSize: 13,
              color: "#8b5e3c",
              marginTop: 12,
              letterSpacing: "0.02em",
              margin: "12px 0 0",
            }}>
              九个维度的数字造物，从工具到艺术
            </p>
          </div>

          <div style={{ marginTop: 40, marginBottom: 40 }}>
            <LeafBook autoFlipDelay={leafAutoFlip} />
          </div>
        </section>

        {/* =============================================
            ③ 工具间 Tools
            ============================================= */}
        <section id="tools" style={{ padding: "100px 48px 100px 208px", maxWidth: 1100, margin: "0 auto", background: "#fafafa" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: "0.3em",
              color: "#bbb",
              margin: "0 0 12px",
              textTransform: "uppercase",
            }}>
              贰 · <span style={{ color: "#e07a8a" }}>TOOLS</span>
            </p>
            <h2 style={{
              fontFamily: SERIF,
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 700,
              color: "#8b5e3c",
              margin: 0,
              letterSpacing: "0.08em",
            }}>
              造物利器
            </h2>
            <p style={{
              fontFamily: SANS,
              fontSize: 13,
              color: "#999",
              marginTop: 12,
              letterSpacing: "0.02em",
              margin: "12px 0 0",
            }}>
              此乃吾平日造物之器具。相关能力亦沉淀于 AI 增效模块中。
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link
              to="/mickey"
              style={{
                display: "block",
                maxWidth: 520,
                width: "100%",
                padding: "48px 40px",
                background: "#ffffff",
                border: "1px solid #eee",
                borderRadius: 12,
                textDecoration: "none",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(-6px)";
                el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.08)";
                el.style.borderColor = "#ddd";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
                el.style.borderColor = "#eee";
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16, lineHeight: 1 }}>🍃</div>
              <h3 style={{
                fontFamily: SERIF,
                fontSize: 22,
                fontWeight: 700,
                color: "#8b5e3c",
                margin: "0 0 12px",
                letterSpacing: "0.06em",
              }}>
                进入作品集
              </h3>
              <p style={{
                fontFamily: SANS,
                fontSize: 13,
                color: "#888",
                lineHeight: 1.8,
                margin: "0 0 20px",
                letterSpacing: "0.02em",
              }}>
                森林疗愈室 · 爱情公寓 · 通关清单 · 物资管家 · 解忧杂货店 · 漫游指南 · 回血清单 · 第七卷胶片
              </p>
              <span style={{
                fontFamily: SANS,
                fontSize: 14,
                color: "#c04040",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}>
                立即探索 →
              </span>
            </Link>
          </div>
        </section>

        {/* =============================================
            ④ 书房 Heritage（非遗实验场）
            ============================================= */}
        <section id="heritage" style={{ padding: "100px 48px 100px 208px", maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: "0.3em",
              color: "#bbb",
              margin: "0 0 12px",
              textTransform: "uppercase",
            }}>
              叁 · <span style={{ color: "#e07a8a" }}>HERITAGE LAB</span>
            </p>
            <h2 style={{
              fontFamily: SERIF,
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 700,
              color: "#8b5e3c",
              margin: 0,
              letterSpacing: "0.08em",
            }}>
              薪火 · 实验场
            </h2>
            <p style={{
              fontFamily: SERIF,
              fontSize: 14,
              color: "#999",
              marginTop: 16,
              lineHeight: 1.9,
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
              fontStyle: "italic",
            }}>
              以 AI 为砚、代码为墨，录其形、溯其意、限其界。故曰实验，不曰复原。
            </p>
          </div>

          <HeritageContent />
        </section>
      </main>
    </div>
  );
};

export default ZhiyongPage;

/* ============================================================
 * HeritageContent 非遗实验内容
 * ============================================================ */
const HeritageContent: React.FC = () => {
  const RED = "#c04040";
  const TEXT = "#333";
  const MUTED = "#666";
  const HSERIF = '"Noto Serif SC", "Songti SC", Georgia, serif';
  const HSANS = '"Noto Sans SC", "PingFang SC", -apple-system, sans-serif';

  return (
    <div style={{ position: "relative" }}>
      {/* 宣纸底纹 */}
      <div style={{
        position: "absolute", inset: -20, pointerEvents: "none", opacity: 0.18, borderRadius: 12,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.52 0 0 0 0 0.48 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* 卷首语 */}
        <div style={{
          background: "linear-gradient(135deg, rgba(250,245,235,0.7) 0%, rgba(248,242,230,0.5) 100%)",
          border: "1px solid rgba(180,140,90,0.18)", borderRadius: 10, padding: "32px 36px", marginTop: 36, position: "relative",
          boxShadow: "0 4px 20px -8px rgba(120,90,60,0.1), inset 0 1px 0 rgba(255,255,255,0.6)",
        }}>
          <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", width: 40, height: 2, background: "linear-gradient(90deg, transparent, rgba(180,140,90,0.3), transparent)", borderRadius: 1 }} />
          <p style={{ fontFamily: HSERIF, fontSize: 11, letterSpacing: "0.3em", color: RED, margin: "0 0 14px", opacity: 0.5, textAlign: "center" }}>卷 首 语</p>
          <h3 style={{ fontFamily: HSERIF, fontSize: 20, fontWeight: 700, color: TEXT, margin: "0 0 16px", letterSpacing: "0.12em", textAlign: "center" }}>第八卷 · 所涉非遗实验对象（部分）</h3>
          <p style={{ fontFamily: HSANS, fontSize: 14, color: MUTED, lineHeight: 2, margin: 0, letterSpacing: "0.03em", textAlign: "center", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            所选非遗，非为博古之全，乃为设问之需。于此数端，试以 AI 为砚、代码为墨，录其形、溯其意、限其界，故曰实验，不曰复原。
          </p>
        </div>

        {/* 第一章 */}
        <div style={{ marginTop: 56 }}>
          <ChapterHeader number="01" title="选题与痛点" subtitle="WHY & WHAT" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 28 }}>
            <PainCard name="蔚县剪纸" region="河北" pain="纹样同质化严重，年轻传承人缺乏创新素材；手工设计耗时" entry="风格迁移与纹样生成：利用 LoRA 微调，快速生成符合剪纸「阴刻/阳刻」逻辑的新图案" />
            <PainCard name="华县皮影" region="陕西" pain="剧本流失，角色造型固化；关节制作工艺复杂，难以普及" entry="角色设计与叙事辅助：生成多样化脸谱，辅助生成简易皮影剧本片段" />
            <PainCard name="壮锦/苏绣" region="广西/江苏" pain="传统纹样与现代审美脱节；织造成本高，难以量产" entry="纹理提取与再设计：从高清扫描图中提取矢量纹理，映射到现代产品" />
          </div>
        </div>

        <SectionDivider />

        {/* 第二章 */}
        <div style={{ marginTop: 48 }}>
          <ChapterHeader number="02" title="路径与技术栈" subtitle="HOW" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 28 }}>
            <TechCard step="01" title="RAG 知识库" desc="建立非遗图谱：收集各地区剪纸/皮影的符号寓意（如「蝙蝠=福」、「莲花=连」）。防止 AI 胡编乱造，确保生成内容「形准意对」" />
            <TechCard step="02" title="LoRA 微调" desc="针对剪纸的「镂空感」和皮影的「轮廓感」进行针对性训练。约束条件：保持对称、线条粗细均匀" />
            <TechCard step="03" title="前端原型" desc="Web 端展示：图片生成 + 简单的「拖拽查看关节联动」交互（针对皮影）。输出格式：SVG/PNG" />
          </div>

          {/* 架构示意 */}
          <div style={{ marginTop: 32, padding: "28px 32px", background: "linear-gradient(180deg, rgba(250,245,235,0.6) 0%, rgba(248,242,230,0.3) 100%)", border: "1px solid rgba(180,140,90,0.15)", borderRadius: 10, textAlign: "center", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)" }}>
            <p style={{ fontFamily: HSANS, fontSize: 11, color: "#a09080", margin: "0 0 16px", letterSpacing: "0.18em" }}>系 统 架 构 示 意</p>
            <svg width="100%" height="64" viewBox="0 0 600 64" fill="none" style={{ maxWidth: 520, margin: "0 auto" }}>
              <rect x="0" y="12" width="140" height="40" rx="6" fill="rgba(180,140,90,0.08)" stroke="rgba(180,140,90,0.25)" strokeWidth="1" />
              <text x="70" y="36" textAnchor="middle" fontSize="12" fill="#8a7a5a">非遗知识库</text>
              <path d="M150 32 L170 32" stroke="rgba(180,140,90,0.25)" strokeWidth="1" />
              <path d="M168 28 L172 32 L168 36" fill="none" stroke="rgba(180,140,90,0.25)" strokeWidth="1" />
              <rect x="180" y="12" width="140" height="40" rx="6" fill="rgba(74,106,90,0.08)" stroke="rgba(74,106,90,0.25)" strokeWidth="1" />
              <text x="250" y="36" textAnchor="middle" fontSize="12" fill="#5a6a5a">LoRA 生成模型</text>
              <path d="M330 32 L350 32" stroke="rgba(180,140,90,0.25)" strokeWidth="1" />
              <path d="M348 28 L352 32 L348 36" fill="none" stroke="rgba(180,140,90,0.25)" strokeWidth="1" />
              <rect x="360" y="12" width="140" height="40" rx="6" fill="rgba(192,64,64,0.06)" stroke="rgba(192,64,64,0.25)" strokeWidth="1" />
              <text x="430" y="36" textAnchor="middle" fontSize="12" fill="#8a4040">前端交互原型</text>
              <path d="M430 12 L430 2 L250 2 L250 12" stroke="rgba(180,140,90,0.12)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
              <path d="M248 10 L252 12 L248 14" fill="none" stroke="rgba(180,140,90,0.12)" strokeWidth="1" />
            </svg>
            <p style={{ fontFamily: HSANS, fontSize: 10, color: "#b0a090", margin: "10px 0 0", letterSpacing: "0.08em" }}>数据驱动设计 → 模型约束生成 → 原型验证 → 反馈迭代</p>
          </div>
        </div>

        <SectionDivider />

        {/* 第三章 */}
        <div style={{ marginTop: 48 }}>
          <ChapterHeader number="03" title="过程与复盘" subtitle="THE PROCESS" />
          <div style={{ marginTop: 28 }}>
            <ExperimentTitle num="3.1" name="蔚县剪纸实验记录" />
            <CompareRow label="失败案例" desc="初期生成的图案过于写实（像照片），失去了剪纸的「平面装饰感」和「刀味」" status="fail" />
            <CompareRow label="解决方案" desc="加入 ControlNet 控制线条走向，强制模型输出矢量感强的线稿" status="success" />
            <Annotation text="此处曾尝试 ControlNet，效果不佳" />
          </div>
          <div style={{ marginTop: 32 }}>
            <ExperimentTitle num="3.2" name="华县皮影实验记录" />
            <CompareRow label="失败案例" desc="生成的脸谱表情僵硬，缺乏皮影特有的「侧面示人」的夸张感" status="fail" />
            <CompareRow label="解决方案" desc="Prompt 中强化「侧面轮廓」、「戏剧妆容」、「镂空雕刻感」等关键词" status="success" />
            <Annotation text="意外发现：AI 生成的某些抽象纹理，竟与传统皮影的「云纹」有异曲同工之妙" />
          </div>
          <div style={{ marginTop: 32 }}>
            <ExperimentTitle num="3.3" name="壮锦/苏绣实验记录" />
            <CompareRow label="失败案例" desc="颜色过于艳丽，丢失了传统织锦的「古朴感」" status="fail" />
            <CompareRow label="解决方案" desc="对训练数据进行「去饱和」处理，或在生成后手动调整色相" status="success" />
            <Annotation text="AI 能生成纹理，但很难理解「丝线的光泽」和「织造的张力」" />
          </div>
        </div>

        <SectionDivider />

        {/* 第四章 结论与展望 */}
        <div style={{ marginTop: 48 }}>
          <ChapterHeader number="04" title="结论与展望" subtitle="CONCLUSION" />
          <div style={{ maxWidth: 640, margin: "28px auto 0", padding: "36px 40px", background: "linear-gradient(135deg, rgba(250,245,235,0.6) 0%, rgba(248,242,230,0.4) 100%)", border: "1px solid rgba(180,140,90,0.15)", borderRadius: 10, position: "relative", boxShadow: "0 4px 20px -8px rgba(120,90,60,0.08)" }}>
            {/* 四角装饰 */}
            <div style={{ position: "absolute", top: 12, left: 12, width: 16, height: 16, borderTop: "1px solid rgba(180,140,90,0.2)", borderLeft: "1px solid rgba(180,140,90,0.2)" }} />
            <div style={{ position: "absolute", top: 12, right: 12, width: 16, height: 16, borderTop: "1px solid rgba(180,140,90,0.2)", borderRight: "1px solid rgba(180,140,90,0.2)" }} />
            <div style={{ position: "absolute", bottom: 12, left: 12, width: 16, height: 16, borderBottom: "1px solid rgba(180,140,90,0.2)", borderLeft: "1px solid rgba(180,140,90,0.2)" }} />
            <div style={{ position: "absolute", bottom: 12, right: 12, width: 16, height: 16, borderBottom: "1px solid rgba(180,140,90,0.2)", borderRight: "1px solid rgba(180,140,90,0.2)" }} />

            <p style={{ fontFamily: HSERIF, fontSize: 15, color: TEXT, lineHeight: 2.2, margin: 0, letterSpacing: "0.04em", textAlign: "center" }}>
              AI 目前最适合的角色是
              <span style={{ background: "rgba(192,64,64,0.08)", padding: "2px 6px", borderRadius: 3, fontWeight: 600 }}>「初级助理」</span>和
              <span style={{ background: "rgba(74,106,90,0.08)", padding: "2px 6px", borderRadius: 3, fontWeight: 600 }}>「灵感激发器」</span>。
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, margin: "24px 0" }}>
              <div style={{ width: 48, height: 1, background: "linear-gradient(90deg, transparent, rgba(180,140,90,0.25))" }} />
              <span style={{ fontFamily: HSANS, fontSize: 11, color: "#b0a090", letterSpacing: "0.2em" }}>能 力 边 界</span>
              <div style={{ width: 48, height: 1, background: "linear-gradient(270deg, transparent, rgba(180,140,90,0.25))" }} />
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              <p style={{ fontFamily: HSANS, fontSize: 13, color: "#6a5a4a", lineHeight: 1.9, margin: 0 }}>
                <span style={{ color: "#4a7a5a", fontWeight: 600 }}>能解决 60%：</span>基础纹样生成、草稿变体、素材灵感
              </p>
              <p style={{ fontFamily: HSANS, fontSize: 13, color: "#6a5a4a", lineHeight: 1.9, margin: 0 }}>
                <span style={{ color: RED, fontWeight: 600 }}>仍需人力 40%：</span>情感、文化深度、手工温度、伦理判断
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, margin: "24px 0" }}>
              <div style={{ width: 48, height: 1, background: "linear-gradient(90deg, transparent, rgba(180,140,90,0.25))" }} />
              <span style={{ fontFamily: HSANS, fontSize: 11, color: "#b0a090", letterSpacing: "0.2em" }}>未 来 展 望</span>
              <div style={{ width: 48, height: 1, background: "linear-gradient(270deg, transparent, rgba(180,140,90,0.25))" }} />
            </div>
            <p style={{ fontFamily: HSANS, fontSize: 13, color: "#6a5a4a", lineHeight: 1.9, margin: 0 }}>
              计划接入 3D 打印，实现从「平面纹样」到「立体文创」的跨越。探索与线下工坊合作，形成「AI 设计 → 手工精修 → 量产销售」的闭环。
            </p>
          </div>
        </div>

        {/* 页脚 */}
        <div style={{ textAlign: "center", marginTop: 56, paddingTop: 28, borderTop: "1px solid rgba(180,140,90,0.12)" }}>
          <p style={{ fontFamily: HSERIF, fontSize: 12, color: "#b0a090", letterSpacing: "0.12em", lineHeight: 1.8 }}>
            实验周期：丙午年 · 仲夏至霜降 ｜ 状态：进行中
          </p>
        </div>
      </div>

      {/* 右下角红色印章 */}
      <div style={{
        position: "absolute", right: 8, bottom: 48, width: 56, height: 56, borderRadius: 6,
        border: "2.5px solid #c04040", display: "flex", alignItems: "center", justifyContent: "center",
        transform: "rotate(-10deg)", opacity: 0.22, zIndex: 2, boxShadow: "inset 0 0 8px rgba(192,64,64,0.1)",
      }}>
        <span style={{ fontFamily: HSERIF, fontSize: 18, color: "#c04040", fontWeight: 700, letterSpacing: "0.15em" }}>实验</span>
      </div>
    </div>
  );
};

/* ====== 辅助组件 ====== */

const SectionDivider: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, margin: "40px 0", opacity: 0.35 }}>
    <div style={{ width: 64, height: 1, background: "linear-gradient(90deg, transparent, rgba(180,140,90,0.4))" }} />
    <div style={{ width: 5, height: 5, border: "1px solid rgba(180,140,90,0.4)", transform: "rotate(45deg)" }} />
    <div style={{ width: 5, height: 5, background: "rgba(180,140,90,0.3)", transform: "rotate(45deg)" }} />
    <div style={{ width: 5, height: 5, border: "1px solid rgba(180,140,90,0.4)", transform: "rotate(45deg)" }} />
    <div style={{ width: 64, height: 1, background: "linear-gradient(270deg, transparent, rgba(180,140,90,0.4))" }} />
  </div>
);

const ExperimentTitle: React.FC<{ num: string; name: string }> = ({ num, name }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "0 0 16px", paddingBottom: 8, borderBottom: "1px solid rgba(180,140,90,0.1)" }}>
    <span style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: 11, color: "#b0a090", fontWeight: 600, letterSpacing: "0.05em" }}>{num}</span>
    <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 15, fontWeight: 600, color: "#5a3a2a", letterSpacing: "0.06em" }}>{name}</span>
  </div>
);

const ChapterHeader: React.FC<{ number: string; title: string; subtitle: string }> = ({ number, title, subtitle }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
    <span style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: 11, color: "#c04040", fontWeight: 600, letterSpacing: "0.15em", opacity: 0.7 }}>第 {number} 章</span>
    <h3 style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 22, fontWeight: 700, color: "#3f3f46", margin: 0, letterSpacing: "0.1em" }}>{title}</h3>
    <span style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: 10, color: "#a09888", letterSpacing: "0.12em", opacity: 0.6 }}>{subtitle}</span>
  </div>
);

const PainCard: React.FC<{ name: string; region: string; pain: string; entry: string }> = ({ name, region, pain, entry }) => (
  <div style={{ padding: "22px 24px", background: "linear-gradient(135deg, rgba(255,250,240,0.6) 0%, rgba(252,248,238,0.4) 100%)", border: "1px solid rgba(180,140,90,0.15)", borderRadius: 8, transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: "0 2px 8px -4px rgba(120,90,60,0.06)" }}
    onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,250,240,0.85) 0%, rgba(252,248,238,0.6) 100%)"; e.currentTarget.style.borderColor = "rgba(180,140,90,0.35)"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px -8px rgba(120,90,60,0.15)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,250,240,0.6) 0%, rgba(252,248,238,0.4) 100%)"; e.currentTarget.style.borderColor = "rgba(180,140,90,0.15)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px -4px rgba(120,90,60,0.06)"; }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
      <h4 style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 16, fontWeight: 600, color: "#5a3a2a", margin: 0, letterSpacing: "0.06em" }}>{name}</h4>
      <span style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: 10, color: "#a09888", letterSpacing: "0.08em" }}>{region}</span>
    </div>
    <p style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: 12, color: "#8a7a6a", lineHeight: 1.8, margin: "0 0 10px" }}>
      <span style={{ fontWeight: 600, color: "#a04040" }}>痛点：</span>{pain}
    </p>
    <p style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: 12, color: "#5a6a4a", lineHeight: 1.8, margin: 0 }}>
      <span style={{ fontWeight: 600, color: "#4a7a5a" }}>切入点：</span>{entry}
    </p>
  </div>
);

const TechCard: React.FC<{ step: string; title: string; desc: string }> = ({ step, title, desc }) => (
  <div style={{ padding: "22px 24px", background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(250,250,255,0.4) 100%)", border: "1px solid rgba(120,160,200,0.15)", borderRadius: 8, transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: "0 2px 8px -4px rgba(60,90,120,0.06)" }}
    onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,250,255,0.7) 100%)"; e.currentTarget.style.borderColor = "rgba(120,160,200,0.3)"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px -8px rgba(60,90,120,0.12)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(250,250,255,0.4) 100%)"; e.currentTarget.style.borderColor = "rgba(120,160,200,0.15)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px -4px rgba(60,90,120,0.06)"; }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: "rgba(120,160,200,0.1)", marginBottom: 10 }}>
      <span style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: 11, color: "#7a9aba", fontWeight: 600, letterSpacing: "0.05em" }}>{step}</span>
    </div>
    <h4 style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: 14, fontWeight: 600, color: "#3a5a7a", margin: "0 0 8px", letterSpacing: "0.03em" }}>{title}</h4>
    <p style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: 12, color: "#6a7a8a", lineHeight: 1.8, margin: 0 }}>{desc}</p>
  </div>
);

const CompareRow: React.FC<{ label: string; desc: string; status: "fail" | "success" }> = ({ label, desc, status }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px", marginBottom: 10, background: status === "fail" ? "rgba(192,64,64,0.03)" : "rgba(74,122,90,0.03)", border: "1px solid " + (status === "fail" ? "rgba(192,64,64,0.12)" : "rgba(74,122,90,0.12)"), borderRadius: 6, borderLeft: "3px solid " + (status === "fail" ? "rgba(192,64,64,0.5)" : "rgba(74,122,90,0.5)"), transition: "all 0.3s ease" }}
    onMouseEnter={(e) => { e.currentTarget.style.background = status === "fail" ? "rgba(192,64,64,0.05)" : "rgba(74,122,90,0.05)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = status === "fail" ? "rgba(192,64,64,0.03)" : "rgba(74,122,90,0.03)"; }}>
    <span style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: 12, fontWeight: 600, color: status === "fail" ? "rgba(192,64,64,0.7)" : "rgba(74,122,90,0.7)", whiteSpace: "nowrap", minWidth: 56, marginTop: 1 }}>{label}</span>
    <p style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: 13, color: "#6a5a4a", lineHeight: 1.8, margin: 0 }}>{desc}</p>
  </div>
);

const Annotation: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, margin: "8px 0 0 22px" }}>
    <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 12, color: "rgba(180,140,90,0.4)", lineHeight: 1.6 }}>※</span>
    <p style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 11, color: "#b0a090", fontStyle: "italic", margin: 0, letterSpacing: "0.02em", lineHeight: 1.7, opacity: 0.75 }}>{text}</p>
  </div>
);
