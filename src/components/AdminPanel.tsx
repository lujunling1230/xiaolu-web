import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logoutAdmin, siteLoad, saveDraft, publishDrafts, getSeedData } from "../utils/siteData";

/* ============================================================
 * AdminPanel 组件
 * 滑出式管理员面板：模块列表、可视化/JSON 编辑、发布草稿
 * ============================================================ */

/** 模块定义 */
interface ModuleDef {
  key: string;
  name: string;
  icon: string;
  description: string;
}

const MODULES: ModuleDef[] = [
  { key: "lf_reading", name: "阅读", icon: "📖", description: "阅读记录与书单" },
  { key: "lf_photos", name: "摄影", icon: "📷", description: "摄影作品与瞬间" },
  { key: "lf_tracks", name: "音乐", icon: "🎵", description: "音乐收藏与心情" },
  { key: "footprints", name: "步履纪事", icon: "🗺️", description: "足迹与旅行记忆" },
  { key: "museum_nets", name: "时代回响 · 网络", icon: "🌐", description: "网络初现时的印记" },
  { key: "museum_tvs", name: "时代回响 · 影视", icon: "📺", description: "屏幕里的时光机" },
  { key: "museum_honors", name: "荣耀之路", icon: "🏆", description: "荣誉与成长印记" },
];

/* -----------------------------------------------------------
 * ModuleEditor 子组件
 * ----------------------------------------------------------- */
interface ModuleEditorProps {
  module: ModuleDef;
  onClose: () => void;
}

const ModuleEditor: React.FC<ModuleEditorProps> = ({ module, onClose }) => {
  const [data, setData] = useState<unknown>(null);
  const [jsonText, setJsonText] = useState("");
  const [tab, setTab] = useState<"visual" | "json">("visual");
  const [saved, setSaved] = useState(false);

  /* 加载模块数据 */
  useEffect(() => {
    const loaded = siteLoad(module.key, null);
    if (loaded !== null) {
      setData(loaded);
      setJsonText(JSON.stringify(loaded, null, 2));
    } else {
      const seed = getSeedData(module.key, null);
      if (seed !== null) {
        setData(seed);
        setJsonText(JSON.stringify(seed, null, 2));
      } else {
        setData([]);
        setJsonText("[]");
      }
    }
  }, [module.key]);

  /** 保存到 draft */
  const handleSave = useCallback(() => {
    try {
      const toSave = tab === "json" ? JSON.parse(jsonText) : data;
      saveDraft(module.key, toSave);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("JSON 格式错误，请检查后重试");
    }
  }, [tab, jsonText, data, module.key]);

  /** JSON 变更同步 */
  const handleJsonChange = useCallback((val: string) => {
    setJsonText(val);
    try {
      setData(JSON.parse(val));
    } catch {
      // 输入过程中允许暂时解析失败
    }
  }, []);

  /** 可视化数组编辑器 */
  const renderArrayEditor = () => {
    if (!Array.isArray(data)) {
      return (
        <p style={{ fontSize: 13, color: "#a8a39b", textAlign: "center", padding: 24 }}>
          该模块数据格式不支持可视化编辑，请切换到 JSON 模式
        </p>
      );
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.map((item: any, idx: number) => (
          <div
            key={item.id || `item-${idx}`}
            style={{
              background: "#FAF9F6",
              border: "1px solid #E8E6E1",
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <input
                type="text"
                value={item.title || item.name || ""}
                onChange={(e) => {
                  const newData = [...data];
                  const key = "title" in item ? "title" : "name";
                  newData[idx] = { ...newData[idx], [key]: e.target.value };
                  setData(newData);
                  setJsonText(JSON.stringify(newData, null, 2));
                }}
                placeholder="标题"
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  border: "1px solid #E8E6E1",
                  borderRadius: 8,
                  fontSize: 13,
                  outline: "none",
                  color: "#4a4038",
                }}
              />
              <button
                onClick={() => {
                  const newData = data.filter((_: any, i: number) => i !== idx);
                  setData(newData);
                  setJsonText(JSON.stringify(newData, null, 2));
                }}
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: 8,
                  background: "#f5f0eb",
                  color: "#c44",
                  cursor: "pointer",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              >
                删除
              </button>
            </div>
            <textarea
              value={item.description || item.note || item.reflection || ""}
              onChange={(e) => {
                const newData = [...data];
                const key =
                  "description" in item
                    ? "description"
                    : "note" in item
                    ? "note"
                    : "reflection";
                newData[idx] = { ...newData[idx], [key]: e.target.value };
                setData(newData);
                setJsonText(JSON.stringify(newData, null, 2));
              }}
              placeholder="描述"
              rows={2}
              style={{
                width: "100%",
                padding: "8px 10px",
                border: "1px solid #E8E6E1",
                borderRadius: 8,
                fontSize: 12,
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
                color: "#5a5248",
                lineHeight: 1.6,
              }}
            />
            <input
              type="text"
              value={item.imageUrl || item.cover || ""}
              onChange={(e) => {
                const newData = [...data];
                const key = "imageUrl" in item ? "imageUrl" : "cover";
                newData[idx] = { ...newData[idx], [key]: e.target.value };
                setData(newData);
                setJsonText(JSON.stringify(newData, null, 2));
              }}
              placeholder="图片 URL（可选）"
              style={{
                width: "100%",
                marginTop: 8,
                padding: "8px 10px",
                border: "1px solid #E8E6E1",
                borderRadius: 8,
                fontSize: 12,
                outline: "none",
                boxSizing: "border-box",
                color: "#5a5248",
              }}
            />
          </div>
        ))}

        <button
          onClick={() => {
            const newItem: any = {
              id: `new-${Date.now()}`,
              title: "",
              description: "",
            };
            if (module.key.startsWith("museum_")) {
              newItem.year = "";
              newItem.imageUrl = "";
            }
            if (module.key === "museum_honors") {
              newItem.reflection = "";
            }
            const newData = [...(data as any[]), newItem];
            setData(newData);
            setJsonText(JSON.stringify(newData, null, 2));
          }}
          style={{
            padding: "10px",
            border: "1.5px dashed #c8c1b4",
            borderRadius: 10,
            background: "transparent",
            color: "#8D9A8B",
            cursor: "pointer",
            fontSize: 13,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#8D9A8B";
            e.currentTarget.style.background = "rgba(141,154,139,0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#c8c1b4";
            e.currentTarget.style.background = "transparent";
          }}
        >
          + 添加条目
        </button>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10001,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{
          background: "#fff",
          borderRadius: 18,
          width: "100%",
          maxWidth: 560,
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #E8E6E1",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <h4
              style={{
                margin: 0,
                fontFamily: '"Noto Serif SC", serif',
                fontSize: 16,
                color: "#4a4038",
              }}
            >
              {module.icon} {module.name}
            </h4>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#a8a39b" }}>
              {module.description}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setTab("visual")}
              style={{
                padding: "5px 12px",
                borderRadius: 999,
                border: "none",
                fontSize: 12,
                cursor: "pointer",
                background: tab === "visual" ? "#8D9A8B" : "#f0ece6",
                color: tab === "visual" ? "#fff" : "#7a7268",
                transition: "all 0.25s ease",
              }}
            >
              可视化
            </button>
            <button
              onClick={() => setTab("json")}
              style={{
                padding: "5px 12px",
                borderRadius: 999,
                border: "none",
                fontSize: 12,
                cursor: "pointer",
                background: tab === "json" ? "#8D9A8B" : "#f0ece6",
                color: tab === "json" ? "#fff" : "#7a7268",
                transition: "all 0.25s ease",
              }}
            >
              JSON
            </button>
          </div>
        </div>

        {/* 内容区 */}
        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
          {tab === "visual" ? (
            renderArrayEditor()
          ) : (
            <textarea
              value={jsonText}
              onChange={(e) => handleJsonChange(e.target.value)}
              spellCheck={false}
              style={{
                width: "100%",
                height: "100%",
                minHeight: 320,
                padding: 12,
                border: "1px solid #E8E6E1",
                borderRadius: 10,
                fontSize: 12,
                fontFamily: '"SF Mono", Monaco, "Cascadia Code", monospace',
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
                lineHeight: 1.6,
                color: "#4a4038",
              }}
            />
          )}
        </div>

        {/* 底部操作 */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid #E8E6E1",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: saved ? "#5d8a6a" : "#a8a39b",
              transition: "color 0.3s ease",
            }}
          >
            {saved ? "✓ 已保存到草稿" : "修改将保存为本地草稿"}
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                padding: "8px 18px",
                border: "1.5px solid #E8E6E1",
                borderRadius: 999,
                background: "transparent",
                color: "#7a7268",
                cursor: "pointer",
                fontSize: 13,
                transition: "all 0.25s ease",
              }}
            >
              关闭
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: "8px 18px",
                border: "none",
                borderRadius: 999,
                background: "#8D9A8B",
                color: "#fff",
                cursor: "pointer",
                fontSize: 13,
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#7a8a7a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#8D9A8B")
              }
            >
              保存草稿
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* -----------------------------------------------------------
 * AdminPanel 主组件
 * ----------------------------------------------------------- */
interface AdminPanelProps {
  onClose: () => void;
  onLogout?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onLogout }) => {
  const [editingModule, setEditingModule] = useState<ModuleDef | null>(null);
  const [publishStatus, setPublishStatus] = useState("");

  /** 发布草稿到主站 */
  const handlePublish = useCallback(() => {
    const res = publishDrafts();
    if (res.success) {
      setPublishStatus(
        res.merged.length > 0
          ? `已发布 ${res.merged.length} 项草稿到主站`
          : "没有待发布的草稿"
      );
    } else {
      setPublishStatus("发布失败，请确认管理员权限");
    }
    setTimeout(() => setPublishStatus(""), 3000);
  }, []);

  /** 退出管理员 */
  const handleLogout = useCallback(() => {
    logoutAdmin();
    if (onLogout) onLogout();
    onClose();
  }, [onClose, onLogout]);

  return (
    <>
      {/* 遮罩层 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(0,0,0,0.2)",
        }}
        onClick={onClose}
      />

      {/* 滑出面板 */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: 420,
          zIndex: 9999,
          background: "rgba(255,253,249,0.96)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "-8px 0 40px rgba(80,76,66,0.12)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 面板头部 */}
        <div
          style={{
            padding: "28px 28px 20px",
            borderBottom: "1px solid #E8E6E1",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontFamily: '"Noto Serif SC", Georgia, serif',
                fontSize: 18,
                color: "#4a4038",
                letterSpacing: "0.06em",
              }}
            >
              ✦ 管理员模式 ✦
            </h3>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#a8a39b",
                fontSize: 22,
                padding: 4,
                lineHeight: 1,
                transition: "color 0.25s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#8D9A8B")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#a8a39b")}
            >
              ×
            </button>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "#a8a39b" }}>
            管理作品集各模块数据，发布后全站可见
          </p>
        </div>

        {/* 模块列表 */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "20px 28px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {MODULES.map((mod) => (
              <div
                key={mod.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  background: "#FAF9F6",
                  border: "1px solid #E8E6E1",
                  borderRadius: 12,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(141,154,139,0.4)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(141,154,139,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E8E6E1";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <span style={{ fontSize: 22 }}>{mod.icon}</span>
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#4a4038",
                      }}
                    >
                      {mod.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#a8a39b",
                        marginTop: 2,
                      }}
                    >
                      {mod.description}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setEditingModule(mod)}
                  style={{
                    padding: "6px 14px",
                    border: "1px solid #d5cfc4",
                    borderRadius: 999,
                    background: "transparent",
                    color: "#7a7268",
                    cursor: "pointer",
                    fontSize: 12,
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#8D9A8B";
                    e.currentTarget.style.color = "#5d8a6a";
                    e.currentTarget.style.background =
                      "rgba(141,154,139,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d5cfc4";
                    e.currentTarget.style.color = "#7a7268";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  ✎ 编辑
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 底部操作区 */}
        <div
          style={{
            padding: "18px 28px",
            borderTop: "1px solid #E8E6E1",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <AnimatePresence>
            {publishStatus && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "#5d8a6a",
                  textAlign: "center",
                }}
              >
                {publishStatus}
              </motion.p>
            )}
          </AnimatePresence>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleLogout}
              style={{
                flex: 1,
                padding: "10px 0",
                border: "1.5px solid #E8E6E1",
                borderRadius: 999,
                background: "transparent",
                color: "#7a7268",
                cursor: "pointer",
                fontSize: 13,
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#c44";
                e.currentTarget.style.color = "#c44";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E8E6E1";
                e.currentTarget.style.color = "#7a7268";
              }}
            >
              退出登录
            </button>
            <button
              onClick={handlePublish}
              style={{
                flex: 2,
                padding: "10px 0",
                border: "none",
                borderRadius: 999,
                background: "#8D9A8B",
                color: "#fff",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.04em",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#7a8a7a";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 14px rgba(141,154,139,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#8D9A8B";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              📤 发布到网站
            </button>
          </div>
        </div>
      </motion.div>

      {/* 模块编辑器弹窗 */}
      <AnimatePresence>
        {editingModule && (
          <ModuleEditor
            module={editingModule}
            onClose={() => setEditingModule(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminPanel;
