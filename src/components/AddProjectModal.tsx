import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "../data/projects";

/**
 * AddProjectModal 添加新项目 Modal（Admin 彩蛋）
 *
 * 纯前端表单，提交后生成格式化 JSON，提示用户复制粘贴到 src/data/projects.ts。
 * 不涉及任何后端或文件写入。
 */

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  title: string;
  tag: string;
  painPoint: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  link: string;
  liveUrl: string;
}

const emptyForm: FormData = {
  title: "",
  tag: "",
  painPoint: "",
  description: "",
  imageUrl: "",
  videoUrl: "",
  link: "",
  liveUrl: "",
};

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="13" y1="3" x2="3" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const AddProjectModal: React.FC<AddProjectModalProps> = ({ open, onClose }) => {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [generated, setGenerated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const update = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.title.trim()) newErrors.title = "请输入项目名称";
    if (!form.tag.trim()) newErrors.tag = "请输入标签";
    if (!form.painPoint.trim()) newErrors.painPoint = "请输入痛点定位";
    if (!form.description.trim()) newErrors.description = "请输入描述";
    if (!form.imageUrl.trim()) newErrors.imageUrl = "请输入封面图路径";
    if (!form.liveUrl.trim()) newErrors.liveUrl = "请输入独立部署链接";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const id = form.title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    const newProject: Project = {
      id,
      title: form.title.trim(),
      tag: form.tag.trim(),
      painPoint: form.painPoint.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      liveUrl: form.liveUrl.trim(),
    };
    if (form.videoUrl.trim()) newProject.videoUrl = form.videoUrl.trim();
    if (form.link.trim()) newProject.link = form.link.trim();

    // 生成格式化 JSON（与 projects.ts 中的对象格式一致）
    const json = JSON.stringify(newProject, null, 2);
    setGenerated(json);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 降级方案
      const textarea = document.createElement("textarea");
      textarea.value = generated;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setForm(emptyForm);
    setErrors({});
    setGenerated(null);
    setCopied(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="apm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
        >
          <motion.div
            className="apm-modal"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button className="apm-close" onClick={handleClose} aria-label="关闭">
              <CloseIcon />
            </button>

            {!generated ? (
              <>
                {/* 表单 */}
                <h2 className="apm-title">添加新项目</h2>
                <p className="apm-subtitle">填写项目信息，提交后复制 JSON 粘贴到数据文件</p>

                <div className="apm-form">
                  <label className="apm-field">
                    <span className="apm-label">项目名称 <span className="apm-required">*</span></span>
                    <input
                      className="apm-input"
                      type="text"
                      value={form.title}
                      onChange={(e) => update("title", e.target.value)}
                      placeholder="例如：智能手环商城"
                    />
                    {errors.title && <span className="apm-error">{errors.title}</span>}
                  </label>

                  <label className="apm-field">
                    <span className="apm-label">标签 <span className="apm-required">*</span></span>
                    <input
                      className="apm-input"
                      type="text"
                      value={form.tag}
                      onChange={(e) => update("tag", e.target.value)}
                      placeholder="例如：AI 产品设计"
                    />
                    {errors.tag && <span className="apm-error">{errors.tag}</span>}
                  </label>

                  <label className="apm-field">
                    <span className="apm-label">痛点定位 <span className="apm-required">*</span></span>
                    <input
                      className="apm-input"
                      type="text"
                      value={form.painPoint}
                      onChange={(e) => update("painPoint", e.target.value)}
                      placeholder="一行醒目 Slogan，例如：专为 i 人设计的低能耗回血方案"
                    />
                    {errors.painPoint && <span className="apm-error">{errors.painPoint}</span>}
                  </label>

                  <label className="apm-field">
                    <span className="apm-label">描述 <span className="apm-required">*</span></span>
                    <textarea
                      className="apm-input apm-textarea"
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                      placeholder="简短描述项目内容和亮点"
                      rows={3}
                    />
                    {errors.description && <span className="apm-error">{errors.description}</span>}
                  </label>

                  <label className="apm-field">
                    <span className="apm-label">封面图路径 <span className="apm-required">*</span></span>
                    <input
                      className="apm-input"
                      type="text"
                      value={form.imageUrl}
                      onChange={(e) => update("imageUrl", e.target.value)}
                      placeholder='传图到 /public/images/ 后填 "/images/文件名.png"'
                    />
                    {errors.imageUrl && <span className="apm-error">{errors.imageUrl}</span>}
                  </label>

                  <label className="apm-field">
                    <span className="apm-label">视频路径 <span className="apm-optional">（可选）</span></span>
                    <input
                      className="apm-input"
                      type="text"
                      value={form.videoUrl}
                      onChange={(e) => update("videoUrl", e.target.value)}
                      placeholder="留空则不显示视频"
                    />
                  </label>

                  <label className="apm-field">
                    <span className="apm-label">外链 <span className="apm-optional">（可选）</span></span>
                    <input
                      className="apm-input"
                      type="text"
                      value={form.link}
                      onChange={(e) => update("link", e.target.value)}
                      placeholder="如 GitHub 仓库地址"
                    />
                  </label>

                  <label className="apm-field">
                    <span className="apm-label">独立部署链接 <span className="apm-required">*</span></span>
                    <input
                      className="apm-input"
                      type="text"
                      value={form.liveUrl}
                      onChange={(e) => update("liveUrl", e.target.value)}
                      placeholder="如 https://forest-healing.vercel.app"
                    />
                    {errors.liveUrl && <span className="apm-error">{errors.liveUrl}</span>}
                  </label>

                  <button className="apm-submit" onClick={handleSubmit}>
                    添加到项目集
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* 生成结果 */}
                <h2 className="apm-title">项目已生成</h2>
                <p className="apm-subtitle">复制此对象，粘贴进 <code className="apm-code-inline">src/data/projects.ts</code> 的数组即可</p>

                <pre className="apm-pre">{generated}</pre>

                <div className="apm-result-actions">
                  <button className="apm-submit" onClick={handleCopy}>
                    {copied ? "已复制 ✓" : "复制 JSON"}
                  </button>
                  <button className="apm-secondary" onClick={handleClose}>
                    完成
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}

      <style>{`
        .apm-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .apm-modal {
          position: relative;
          width: 100%;
          max-width: 480px;
          max-height: 85vh;
          overflow-y: auto;
          border-radius: 20px;
          padding: 32px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          box-shadow: 0 24px 64px -16px rgba(0,0,0,0.2);
        }
        .apm-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--text-soft);
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .apm-close:hover {
          background: rgba(0,0,0,0.05);
        }
        .apm-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 6px;
        }
        .apm-subtitle {
          font-size: 13px;
          color: var(--text-soft);
          margin-bottom: 24px;
          line-height: 1.6;
        }
        .apm-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .apm-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .apm-label {
          font-size: 13px;
          color: var(--text-soft);
          font-weight: 500;
        }
        .apm-required {
          color: #d97757;
        }
        .apm-optional {
          color: var(--text-soft);
          opacity: 0.6;
          font-weight: 300;
        }
        .apm-input {
          padding: 10px 14px;
          font-size: 14px;
          font-family: inherit;
          border: 1px solid var(--border);
          border-radius: 10px;
          background: rgba(255,255,255,0.5);
          color: var(--text);
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        [data-theme="night"] .apm-input {
          background: rgba(30,41,59,0.5);
        }
        .apm-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(122, 154, 130, 0.12);
        }
        .apm-input::placeholder {
          color: var(--text-soft);
          opacity: 0.5;
        }
        .apm-textarea {
          resize: vertical;
          min-height: 70px;
          line-height: 1.6;
        }
        .apm-error {
          font-size: 12px;
          color: #d97757;
        }
        .apm-submit {
          padding: 11px 24px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          border-radius: 10px;
          background: var(--accent);
          color: #fff;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .apm-submit:hover {
          background: var(--accent-hover);
          transform: scale(1.02);
        }
        .apm-secondary {
          padding: 11px 24px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid var(--border);
          border-radius: 10px;
          background: transparent;
          color: var(--text-soft);
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .apm-secondary:hover {
          background: rgba(0,0,0,0.04);
        }
        .apm-code-inline {
          font-family: "Courier New", monospace;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(122, 154, 130, 0.1);
          color: var(--accent);
        }
        .apm-pre {
          margin: 0 0 20px;
          padding: 16px;
          font-family: "Courier New", monospace;
          font-size: 13px;
          line-height: 1.7;
          background: rgba(0,0,0,0.04);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text);
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-all;
        }
        [data-theme="night"] .apm-pre {
          background: rgba(0,0,0,0.2);
        }
        .apm-result-actions {
          display: flex;
          gap: 12px;
        }
      `}</style>
    </AnimatePresence>
  );
};

export default AddProjectModal;
