import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "../data/projects";
import { addProject, updateProject, pushProjects } from "../utils/projectStore";

/**
 * AddProjectModal 添加/编辑项目 Modal（Admin 彩蛋）
 *
 * 纯前端表单，支持图片上传（base64）和直接保存到 localStorage。
 */

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  initialData?: Project;
  onDelete?: () => void;
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

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  open,
  onClose,
  mode = "add",
  initialData,
  onDelete,
}) => {
  const isEdit = mode === "edit" && !!initialData;

  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [saved, setSaved] = useState(false);

  // Prefill form when editing
  useEffect(() => {
    if (isEdit && initialData) {
      setForm({
        title: initialData.title,
        tag: initialData.tag,
        painPoint: initialData.painPoint,
        description: initialData.description,
        imageUrl: initialData.imageUrl,
        videoUrl: initialData.videoUrl || "",
        link: initialData.link || "",
        liveUrl: initialData.liveUrl,
      });
      setPreview(initialData.imageUrl || null);
    } else {
      setForm(emptyForm);
      setPreview(null);
    }
    setErrors({});
    setSaved(false);
  }, [isEdit, initialData, open]);

  const update = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, imageUrl: "请选择图片文件" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setPreview(result);
        setForm((prev) => ({ ...prev, imageUrl: result }));
        setErrors((prev) => ({ ...prev, imageUrl: undefined }));
      }
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageFile(file);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.title.trim()) newErrors.title = "请输入项目名称";
    if (!form.tag.trim()) newErrors.tag = "请输入标签";
    if (!form.painPoint.trim()) newErrors.painPoint = "请输入痛点定位";
    if (!form.description.trim()) newErrors.description = "请输入描述";
    if (!form.imageUrl.trim()) newErrors.imageUrl = "请上传或输入封面图";
    if (!form.liveUrl.trim()) newErrors.liveUrl = "请输入独立部署链接";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const trimmed = {
      title: form.title.trim(),
      tag: form.tag.trim(),
      painPoint: form.painPoint.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      liveUrl: form.liveUrl.trim(),
    };

    if (isEdit && initialData) {
      const updates: Partial<Project> = {
        ...trimmed,
      };
      if (form.videoUrl.trim()) updates.videoUrl = form.videoUrl.trim();
      else updates.videoUrl = undefined;
      if (form.link.trim()) updates.link = form.link.trim();
      else updates.link = undefined;
      // Preserve tags
      updates.tags = initialData.tags;

      updateProject(initialData.id, updates);
    } else {
      const id = trimmed.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

      const newProject: Project = {
        id,
        ...trimmed,
      };
      if (form.videoUrl.trim()) newProject.videoUrl = form.videoUrl.trim();
      if (form.link.trim()) newProject.link = form.link.trim();

      addProject(newProject);
    }

    // 同步到远程服务端
    const ok = await pushProjects("ling");
    setSaved(true);

    setTimeout(() => {
      if (ok) {
        window.location.reload();
      }
    }, 600);
  };

  const handleDelete = () => {
    if (!isEdit || !initialData) return;
    if (confirm("确定删除此项目？此操作不可恢复。")) {
      onDelete?.();
    }
  };

  const handleClose = () => {
    setForm(emptyForm);
    setErrors({});
    setPreview(null);
    setSaved(false);
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

            {!saved ? (
              <>
                {/* 表单 */}
                <h2 className="apm-title">{isEdit ? "编辑项目" : "添加新项目"}</h2>
                <p className="apm-subtitle">
                  {isEdit ? "修改项目信息，保存后立即生效" : "填写项目信息，保存后直接写入存储"}
                </p>

                <div className="apm-form">
                  <label className="apm-field">
                    <span className="apm-label">项目名称 <span className="apm-required">*</span></span>
                    <input
                      className="apm-input"
                      type="text"
                      value={form.title}
                      onChange={(e) => update("title", e.target.value)}
                      placeholder="例如：智能手环商城"
                      disabled={isEdit}
                    />
                    {isEdit && <span className="apm-hint">项目名称不可修改（影响 ID）</span>}
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

                  {/* 封面图：上传 + 输入 */}
                  <div className="apm-field">
                    <span className="apm-label">封面图 <span className="apm-required">*</span></span>
                    <div
                      className={`apm-dropzone ${dragOver ? "apm-dropzone-active" : ""}`}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onFileInputChange}
                        className="apm-file-input"
                        id="apm-image-upload"
                      />
                      <label htmlFor="apm-image-upload" className="apm-file-label">
                        点击上传或拖拽图片到此处
                      </label>
                    </div>
                    {preview && (
                      <div className="apm-preview">
                        <img src={preview} alt="预览" />
                      </div>
                    )}
                    <input
                      className="apm-input"
                      type="text"
                      value={form.imageUrl}
                      onChange={(e) => {
                        update("imageUrl", e.target.value);
                        setPreview(e.target.value || null);
                      }}
                      placeholder='或输入图片 URL，如 "/images/photo.png"'
                      style={{ marginTop: 8 }}
                    />
                    {errors.imageUrl && <span className="apm-error">{errors.imageUrl}</span>}
                  </div>

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

                  <div className="apm-actions">
                    {isEdit && (
                      <button className="apm-delete" onClick={handleDelete} type="button">
                        删除项目
                      </button>
                    )}
                    <button className="apm-submit" onClick={handleSubmit}>
                      {isEdit ? "保存修改" : "添加到项目集"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="apm-title">已保存</h2>
                <p className="apm-subtitle">正在刷新页面…</p>
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
          max-width: 520px;
          max-height: 90vh;
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
        .apm-hint {
          font-size: 12px;
          color: var(--text-soft);
          opacity: 0.6;
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
        .apm-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        /* 拖拽上传区 */
        .apm-dropzone {
          position: relative;
          padding: 20px;
          border: 2px dashed var(--border);
          border-radius: 12px;
          background: rgba(255,255,255,0.3);
          text-align: center;
          transition: border-color 0.2s ease, background 0.2s ease;
          cursor: pointer;
        }
        [data-theme="night"] .apm-dropzone {
          background: rgba(30,41,59,0.3);
        }
        .apm-dropzone-active,
        .apm-dropzone:hover {
          border-color: var(--accent);
          background: rgba(122, 154, 130, 0.06);
        }
        .apm-file-input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        .apm-file-label {
          font-size: 13px;
          color: var(--text-soft);
          pointer-events: none;
        }

        /* 图片预览 */
        .apm-preview {
          margin-top: 10px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: rgba(0,0,0,0.03);
        }
        .apm-preview img {
          display: block;
          max-height: 200px;
          width: auto;
          max-width: 100%;
          margin: 0 auto;
          object-fit: contain;
        }

        .apm-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 4px;
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
        .apm-delete {
          padding: 11px 20px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid #d97757;
          border-radius: 10px;
          background: transparent;
          color: #d97757;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .apm-delete:hover {
          background: #d97757;
          color: #fff;
        }
      `}</style>
    </AnimatePresence>
  );
};

export default AddProjectModal;
