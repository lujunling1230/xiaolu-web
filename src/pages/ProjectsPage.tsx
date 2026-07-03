import { useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import LeafBook from "../components/LeafBook";
import { Project } from "../data/projects";
import { getProjects } from "../utils/projectStore";
import { useAdminGuard } from "../hooks/useAdminGuard";

const FOREWORD_KEY = "projects_foreword";

const DEFAULT_FOREWORD =
  "这本书里记录的，不只是代码与界面，\n" +
  "更是那些深夜里的推敲、推翻与重建。\n" +
  "每一个项目都是一次对话——\n" +
  "与用户的需求对话，与技术的边界对话，\n" +
  "也与那个不断想要做得更好的自己对话。\n\n" +
  "愿你在翻阅时，能感受到其中的温度。";

const ProjectsPage: React.FC = () => {
  // LeafBook 从封面自动翻到目录（进入后 1.2s 触发）
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

  // 作品网格：点击滚动到对应位置（或打开链接）
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const projectsList = useMemo(() => getProjects(), []);

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
      {/* 项目集标题 */}
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
          项目集
        </h2>
        <p style={{
          fontSize: "14px",
          color: "var(--text-soft)",
          margin: 0,
          lineHeight: 1.7,
        }}>
          翻开这本树叶书，每一页都是一段实践的印记。
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
          {/* 编辑按钮 */}
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

          {/* 卷首语标题 */}
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

      {/* 树叶书：封面自动翻到目录 */}
      <LeafBook
        flipTriggerRef={flipTriggerRef}
        autoFlipDelay={1200}
      />

      {/* ===== 作品页 ===== */}
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
            作品一览
          </h3>
          <p style={{
            fontSize: 13,
            color: "var(--text-soft)",
            margin: 0,
          }}>
            点击卡片可前往独立部署地址预览
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 20,
        }}>
          {projectsList.map((project: Project, index: number) => (
            <motion.a
              key={project.id}
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              whileHover={{ y: -6, boxShadow: "0 16px 40px -12px rgba(60,80,60,0.2)" }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              style={{
                display: "block",
                textDecoration: "none",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                overflow: "hidden",
                transition: "box-shadow 0.3s ease",
                cursor: "pointer",
              }}
            >
              {/* 封面图 */}
              <div style={{
                width: "100%",
                height: 160,
                overflow: "hidden",
                position: "relative",
              }}>
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                    transform: hoveredProject === project.id ? "scale(1.06)" : "scale(1)",
                  }}
                />
                <div style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  padding: "3px 10px",
                  borderRadius: 999,
                  background: "rgba(0,0,0,0.45)",
                  color: "#fff",
                  fontSize: 11,
                  letterSpacing: "0.03em",
                  backdropFilter: "blur(4px)",
                }}>
                  {project.tag}
                </div>
              </div>

              {/* 内容 */}
              <div style={{ padding: "16px 18px 18px" }}>
                <h4 style={{
                  fontFamily: '"Noto Serif SC", Georgia, serif',
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--text)",
                  margin: "0 0 6px",
                }}>
                  {project.title}
                </h4>
                <p style={{
                  fontSize: 12,
                  color: "var(--accent)",
                  margin: "0 0 10px",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}>
                  {project.painPoint}
                </p>
                <p style={{
                  fontSize: 12,
                  color: "var(--text-soft)",
                  lineHeight: 1.65,
                  margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  {project.description}
                </p>

                {/* 标签 */}
                {project.tags && project.tags.length > 0 && (
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginTop: 12,
                  }}>
                    {project.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: "rgba(122,154,130,0.08)",
                        color: "var(--text-soft)",
                        letterSpacing: "0.02em",
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* 底部留白 */}
      <div style={{ height: 80 }} />

      {/* 浮动管理员入口 🔒 */}
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
