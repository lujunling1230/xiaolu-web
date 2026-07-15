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
  painPoints: string;
  targetUsers: string;
  solutions: string;
  coreValue: string;
  useCases: string;
  highlights: string;
  futurePlans: string;
  liveUrl: string;
  tags: string;
}

const emptyForm: FormData = {
  title: "",
  tag: "",
  painPoints: "",
  targetUsers: "",
  solutions: "",
  coreValue: "",
  useCases: "",
  highlights: "",
  futurePlans: "",
  liveUrl: "",
  tags: "",
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

  const parseList = (raw: string): string[] =>
    raw.split(/\n|,/).map((s) => s.trim()).filter(Boolean);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.title.trim()) newErrors.title = "请输入产品名称";
    if (!form.tag.trim()) newErrors.tag = "请输入定位标签";
    if (!form.painPoints.trim()) newErrors.painPoints = "请输入用户痛点";
    if (!form.solutions.trim()) newErrors.solutions = "请输入解决方案";
    if (!form.coreValue.trim()) newErrors.coreValue = "请输入核心价值";
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
      painPoints: parseList(form.painPoints),
      targetUsers: parseList(form.targetUsers),
      solutions: parseList(form.solutions),
      coreValue: parseList(form.coreValue),
      useCases: parseList(form.useCases),
      highlights: parseList(form.highlights),
      liveUrl: form.liveUrl.trim(),
      tags: form.tags.trim() ? parseList(form.tags) : undefined,
    };

    if (form.futurePlans.trim()) {
      newProject.futurePlans = parseList(form.futurePlans);
    }

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

  const field = (
    label: string,
    key: keyof FormData,
    placeholder: string,
    opts?: { required?: boolean; textarea?: boolean; hint?: string }
  ) => {
    const { required, textarea, hint } = opts || {};
    return (
      <label className="apm-field" key={key}>
        <span className="apm-label">
          {label}
          {required ? <span className="apm-required"> *</span> : <span className="apm-optional">（可选）</span>}
        </span>
        {textarea ? (
          <textarea
            className="apm-input apm-textarea"
            value={form[key]}
            onChange={(e) => update(key, e.target.value)}
            placeholder={placeholder}
            rows={3}
          />
        ) : (
          <input
            className="apm-input"
            type="text"
            value={form[key]}
            onChange={(e) => update(key, e.target.value)}
            placeholder={placeholder}
          />
        )}
        {hint && <span className="apm-hint">{hint}</span>}
        {errors[key] && <span className="apm-error">{errors[key]}</span>}
      </label>
    );
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
            <button className="apm-close" onClick={handleClose} aria-label="关闭">
              <CloseIcon />
            </button>

            {!generated ? (
              <>
                <h2 className="apm-title">添加新项目</h2>
                <p className="apm-subtitle">填写产品文档信息，提交后复制 JSON 粘贴到数据文件</p>

                <div className="apm-form">
                  {field("产品名称", "title", "例如：森林疗愈室", { required: true })}
                  {field("定位标签", "tag", "例如：沉浸式疗愈网页", { required: true })}

                  <div className="apm-divider">产品文档</div>

                  {field("用户痛点", "painPoints", "每行一个痛点，如：\n高压人群缺乏低门槛的情绪出口\n传统冥想应用操作复杂", { required: true, textarea: true })}
                  {field("适合人群", "targetUsers", "每行一个人群，如：\n高强度工作的职场人士\n易焦虑人群", { textarea: true })}
                  {field("解决方案", "solutions", "每行一个方案，如：\n构建沉浸式森林场景\n内置5种白噪音", { required: true, textarea: true })}
                  {field("核心价值", "coreValue", "每行一个价值，如：\n零门槛的情绪释放\n5分钟即可获得心理修复", { required: true, textarea: true })}
                  {field("使用场景", "useCases", "每行一个场景，如：\n睡前助眠\n工作间隙的短暂休憩", { textarea: true })}
                  {field("产品亮点", "highlights", "每行一个亮点，如：\n实时流动的森林光影\n树叶交互动画", { required: true, textarea: true })}
                  {field("未来规划", "futurePlans", "每行一个规划（可选）", { textarea: true })}

                  <div className="apm-divider">基础信息</div>

                  {field("独立部署链接", "liveUrl", "如 https://xiaoluweb.com/", { required: true })}
                  {field("技术标签", "tags", "逗号或换行分隔，如：React, Framer Motion, Web Audio")}

                  <button className="apm-submit" onClick={handleSubmit}>
                    添加到项目集
                  </button>
                </div>
              </>
            ) : (
              <>
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
            }
            .apm-modal {
              position: relative;
              width: 100%;
              max-width: 520px;
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
              gap: 14px;
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
              font-size: 11px;
              color: var(--text-soft);
              opacity: 0.5;
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
              opacity: 0.4;
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
            .apm-divider {
              font-size: 12px;
              font-weight: 600;
              color: var(--accent);
              letter-spacing: 0.08em;
              padding: 8px 0 2px;
              border-bottom: 1px solid rgba(122,154,130,0.15);
              margin-top: 4px;
              font-family: "Noto Serif SC", serif;
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
              margin-top: 8px;
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddProjectModal;
