import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeafBook from "../components/LeafBook";
import { projects, Project } from "../data/projects";
import { useAdminGuard } from "../hooks/useAdminGuard";

const FOREWORD_KEY = "projects_foreword";

const DEFAULT_FOREWORD =
  "这不是一份普通的作品集，\n" +
  "而是一组以\"产品思维\"构建的实践文档。\n\n" +
  "每一个项目都从\"用户痛点\"出发，\n" +
  "经过\"方案设计\"与\"价值验证\"，\n" +
  "最终落地为可交互的产品原型。\n\n" +
  "翻页阅读，你会看到一名 AI 产品经理\n" +
  "对用户需求的理解、对设计决策的思考，\n" +
  "以及对商业价值的持续探索。";

/** 模块 SVG 图标 */
const ModuleIcons: Record<string, React.FC<{ size?: number }>> = {
  painPoints: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  targetUsers: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  solutions: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  coreValue: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  useCases: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
  ),
  highlights: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5H18l-3.7 2.7 1.4 4.3L12 12l-3.7 2.5 1.4-4.3L6 7.5h4.5z"/><path d="M5 19l1 3 3-1-2-2z"/>
    </svg>
  ),
  futurePlans: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

const MODULE_CONFIG: { key: keyof Project; label: string; isInline?: boolean; isHighlight?: boolean }[] = [
  { key: "painPoints", label: "用户痛点" },
  { key: "targetUsers", label: "适合人群", isInline: true },
  { key: "solutions", label: "解决方案" },
  { key: "coreValue", label: "核心价值", isHighlight: true },
  { key: "useCases", label: "使用场景", isInline: true },
  { key: "highlights", label: "产品亮点" },
];

const ProjectsPage: React.FC = () => {
  const flipTriggerRef = useRef<(() => void) | null>(null);

  // 卷首语
  const [foreword, setForeword] = useState(() => {
    try {
      return localStorage.getItem(FOREWORD_KEY) || DEFAULT_FOREWORD;
    } catch {
      return DEFAULT_FOREWORD;
    }
  });
  const [editingFw, setEditingFw] = useState(false);
  const [fwDraft, setFwDraft] = useState(foreword);

  const saveForeword = () => {
    setForeword(fwDraft);
    try {
      localStorage.setItem(FOREWORD_KEY, fwDraft);
    } catch {}
    setEditingFw(false);
  };

  // 展开/收起项目详情
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { isAdmin: adminMode, verifyAdmin, AdminGuardUI } = useAdminGuard();

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "80px 24px 48px",
    }}>
      {/* 页面标题 */}
      <div style={{
        textAlign: "center",
        marginBottom: "40px",
        maxWidth: "700px",
      }}>
        <h2 style={{
          fontFamily: '"Noto Serif SC", Georgia, serif',
          fontSize: "clamp(24px, 4vw, 36px)",
          fontWeight: 600,
          color: "var(--text)",
          margin: "0 0 12px",
          letterSpacing: "0.05em",
        }}>
          作品说明书
        </h2>
        <p style={{
          fontSize: "14px",
          color: "var(--text-soft)",
          margin: 0,
          lineHeight: 1.7,
        }}>
          AI 产品经理视角下的产品实践文档
        </p>
      </div>

      {/* ===== 卷首语 ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "100%",
          maxWidth: 640,
          marginBottom: 40,
          position: "relative",
        }}
      >
        <div
          style={{
            background: "rgba(122,154,130,0.04)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "28px 32px",
            position: "relative",
          }}
        >
          <button
            onClick={() => {
              if (editingFw) {
                verifyAdmin(() => saveForeword());
              } else {
                verifyAdmin(() => {
                  setFwDraft(foreword);
                  setEditingFw(true);
                });
              }
            }}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              fontSize: 12,
              color: "var(--text-soft)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              opacity: 0.5,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.5"; }}
          >
            {editingFw ? "保存" : "编辑"}
          </button>

          <p style={{
            fontFamily: '"Noto Serif SC", Georgia, serif',
            fontSize: 13,
            color: "var(--accent)",
            letterSpacing: "0.15em",
            margin: "0 0 16px",
            textAlign: "center",
          }}>
            — 卷首语 —
          </p>

          {editingFw ? (
            <textarea
              value={fwDraft}
              onChange={e => setFwDraft(e.target.value)}
              style={{
                width: "100%",
                minHeight: 160,
                fontFamily: '"Noto Serif SC", Georgia, serif',
                fontSize: 14,
                lineHeight: 1.9,
                color: "var(--text)",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: 14,
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          ) : (
            <div style={{
              fontFamily: '"Noto Serif SC", Georgia, serif',
              fontSize: 14,
              lineHeight: 1.9,
              color: "var(--text-soft)",
              textAlign: "center",
              whiteSpace: "pre-line",
            }}>
              {foreword}
            </div>
          )}
        </div>
      </motion.div>

      {/* 树叶书 */}
      <LeafBook
        flipTriggerRef={flipTriggerRef}
        autoFlipDelay={1200}
      />

      {/* ===== 产品文档卡片 ===== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        style={{
          width: "100%",
          maxWidth: 960,
          marginTop: 64,
        }}
      >
        <div style={{
          textAlign: "center",
          marginBottom: 32,
        }}>
          <h3 style={{
            fontFamily: '"Noto Serif SC", Georgia, serif',
            fontSize: "clamp(18px, 3vw, 24px)",
            fontWeight: 600,
            color: "var(--text)",
            margin: "0 0 8px",
            letterSpacing: "0.04em",
          }}>
            产品实践一览
          </h3>
          <p style={{
            fontSize: 13,
            color: "var(--text-soft)",
            margin: 0,
          }}>
            点击卡片展开完整产品文档 · 点击"打开作品"预览
          </p>
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
          {projects.map((project: Project, index: number) => {
            const isExpanded = expandedId === project.id;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  overflow: "hidden",
                  transition: "box-shadow 0.3s ease",
                }}
              >
                {/* 卡片头部：始终可见 */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : project.id)}
                  style={{
                    padding: "20px 24px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 6,
                      flexWrap: "wrap",
                    }}>
                      <span style={{
                        fontSize: 11,
                        fontFamily: '"Noto Serif SC", serif',
                        color: "var(--accent)",
                        opacity: 0.7,
                        letterSpacing: "0.06em",
                      }}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h4 style={{
                        fontFamily: '"Noto Serif SC", Georgia, serif',
                        fontSize: 16,
                        fontWeight: 600,
                        color: "var(--text)",
                        margin: 0,
                      }}>
                        {project.title}
                      </h4>
                      <span style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: "rgba(122,154,130,0.08)",
                        color: "var(--text-soft)",
                        whiteSpace: "nowrap",
                      }}>
                        {project.tag}
                      </span>
                    </div>
                    <p style={{
                      fontSize: 12,
                      color: "var(--text-soft)",
                      margin: 0,
                      lineHeight: 1.6,
                      opacity: 0.8,
                    }}>
                      {project.painPoints[0]}
                    </p>
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flexShrink: 0,
                  }}>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        fontSize: 12,
                        color: "var(--accent)",
                        textDecoration: "none",
                        padding: "5px 12px",
                        border: "1px solid rgba(122,154,130,0.3)",
                        borderRadius: 999,
                        transition: "background 0.2s ease",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(122,154,130,0.08)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                    >
                      打开作品
                    </a>
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        color: "var(--text-soft)",
                        opacity: 0.5,
                        fontSize: 14,
                      }}
                    >
                      ▼
                    </motion.span>
                  </div>
                </div>

                {/* 展开的内容：产品文档 */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{
                        padding: "0 24px 24px",
                        borderTop: "1px solid var(--border)",
                      }}>
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                          gap: 12,
                          paddingTop: 16,
                        }}>
                          {MODULE_CONFIG.map(({ key, label, isInline, isHighlight }) => {
                            const items = project[key] as string[];
                            const Icon = ModuleIcons[key];
                            if (!items || items.length === 0) return null;
                            return (
                              <div
                                key={key}
                                style={{
                                  padding: "14px 16px",
                                  borderRadius: 10,
                                  background: isHighlight
                                    ? "rgba(122,154,130,0.05)"
                                    : "rgba(0,0,0,0.02)",
                                  border: isHighlight
                                    ? "1px solid rgba(122,154,130,0.12)"
                                    : "1px solid var(--border)",
                                }}
                              >
                                <div style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  marginBottom: 10,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: isHighlight ? "var(--accent)" : "var(--text)",
                                  letterSpacing: "0.03em",
                                  fontFamily: '"Noto Sans SC", sans-serif',
                                }}>
                                  <Icon size={14} />
                                  {label}
                                </div>
                                {isInline ? (
                                  <div style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 6,
                                  }}>
                                    {items.map((item, i) => (
                                      <span
                                        key={i}
                                        style={{
                                          fontSize: 11,
                                          padding: "3px 10px",
                                          borderRadius: 999,
                                          background: "rgba(122,154,130,0.08)",
                                          color: "var(--text-soft)",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <ul style={{
                                    margin: 0,
                                    padding: 0,
                                    listStyle: "none",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 5,
                                  }}>
                                    {items.map((item, i) => (
                                      <li
                                        key={i}
                                        style={{
                                          fontSize: 12,
                                          lineHeight: 1.6,
                                          color: "var(--text-soft)",
                                          paddingLeft: 14,
                                          position: "relative",
                                        }}
                                      >
                                        <span style={{
                                          position: "absolute",
                                          left: 0,
                                          top: 7,
                                          width: 5,
                                          height: 5,
                                          borderRadius: "50%",
                                          background: isHighlight
                                            ? "rgba(122,154,130,0.5)"
                                            : "rgba(0,0,0,0.15)",
                                        }} />
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            );
                          })}

                          {/* 未来规划（可选） */}
                          {project.futurePlans && project.futurePlans.length > 0 && (
                            <div
                              style={{
                                padding: "14px 16px",
                                borderRadius: 10,
                                background: "rgba(184,140,106,0.03)",
                                border: "1px dashed rgba(184,140,106,0.2)",
                              }}
                            >
                              <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                marginBottom: 10,
                                fontSize: 12,
                                fontWeight: 600,
                                color: "var(--text-soft)",
                                letterSpacing: "0.03em",
                                fontFamily: '"Noto Sans SC", sans-serif',
                              }}>
                                <ModuleIcons.futurePlans size={14} />
                                未来规划
                              </div>
                              <ul style={{
                                margin: 0,
                                padding: 0,
                                listStyle: "none",
                                display: "flex",
                                flexDirection: "column",
                                gap: 5,
                              }}>
                                {project.futurePlans.map((item, i) => (
                                  <li
                                    key={i}
                                    style={{
                                      fontSize: 11,
                                      lineHeight: 1.6,
                                      color: "var(--text-soft)",
                                      opacity: 0.8,
                                      paddingLeft: 14,
                                      position: "relative",
                                    }}
                                  >
                                    <span style={{
                                      position: "absolute",
                                      left: 0,
                                      top: 7,
                                      width: 4,
                                      height: 4,
                                      borderRadius: "50%",
                                      background: "rgba(184,140,106,0.4)",
                                    }} />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* 技术标签 */}
                        {project.tags && project.tags.length > 0 && (
                          <div style={{
                            marginTop: 16,
                            paddingTop: 14,
                            borderTop: "1px dashed rgba(0,0,0,0.06)",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 6,
                          }}>
                            {project.tags.map(tag => (
                              <span key={tag} style={{
                                fontSize: 10,
                                padding: "2px 8px",
                                borderRadius: 4,
                                background: "rgba(122,154,130,0.06)",
                                color: "var(--text-soft)",
                                opacity: 0.7,
                              }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 底部留白 */}
      <div style={{ height: 80 }} />

      {/* 浮动管理员入口 */}
      <button
        onClick={() => verifyAdmin(() => {})}
        title={adminMode ? "管理面板" : "管理员登录"}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 20,
          width: 44, height: 44, border: "none", borderRadius: "50%",
          background: adminMode ? "rgba(141,154,139,0.3)" : "rgba(255,255,255,0.5)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          cursor: "pointer", fontSize: 18,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.25s ease",
        }}
      >
        {adminMode ? "⚙" : "🔒"}
      </button>

      <AdminGuardUI />
    </div>
  );
};

export default ProjectsPage;
