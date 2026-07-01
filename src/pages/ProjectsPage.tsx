import { useRef } from "react";
import LeafBook from "../components/LeafBook";

const ProjectsPage: React.FC = () => {
  // LeafBook 从封面自动翻到目录（进入后 1.2s 触发）
  const flipTriggerRef = useRef<(() => void) | null>(null);

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
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

      {/* 树叶书：封面自动翻到目录 */}
      <LeafBook
        flipTriggerRef={flipTriggerRef}
        autoFlipDelay={1200}
      />
    </div>
  );
};

export default ProjectsPage;
