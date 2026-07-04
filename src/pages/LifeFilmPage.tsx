import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { legacyLoad, legacySave, publishDrafts, pushSiteData, fetchSiteData } from "../utils/siteData";
import { useAdminGuard } from "../hooks/useAdminGuard";

/* ====== 触屏设备检测 ====== */
const _IS_TOUCH = typeof window !== "undefined"
  ? window.matchMedia("(hover: none) and (pointer: coarse)").matches
  : false;

/* ====== localStorage Keys ====== */
const LS_KEYS = {
  reading: "lf_reading",
  photos: "lf_photos",
  tracks: "lf_tracks",
  sports: "lf_sports",
  meditations: "lf_meditations",
  dramas: "lf_dramas",
  customModules: "lf_custom_modules",
} as const;
type BuiltinModuleType = "reading" | "photo" | "music" | "sport" | "meditation" | "drama";
type ModuleType = BuiltinModuleType | `custom_${string}` | "__add__" | null;

/* ====== 自定义模块 ====== */
interface CustomModuleDef {
  id: string;
  emoji: string;
  name: string;
  tint: string;
}
interface CustomModuleRecord {
  id: string;
  title: string;
  content: string;
  date: string;
}
const loadCustomModules = (): CustomModuleDef[] => {
  return legacyLoad<CustomModuleDef[]>(LS_KEYS.customModules, []) ?? [];
};
const saveCustomModules = (mods: CustomModuleDef[]) => {
  legacySave(LS_KEYS.customModules, mods);
};
const getCustomModuleRecordsKey = (id: string) => `lf_custom_records_${id}`;
const loadCustomRecords = (id: string): CustomModuleRecord[] => {
  return legacyLoad<CustomModuleRecord[]>(getCustomModuleRecordsKey(id), []) ?? [];
};
const saveCustomRecords = (id: string, records: CustomModuleRecord[]) => {
  legacySave(getCustomModuleRecordsKey(id), records);
};

/* ====== 数据模型 ====== */
interface Book { id: string; title: string; author: string; cover: string; quote: string; date: string; }
interface Photo { id: string; src: string; title: string; date: string; desc: string; }
interface Track { id: string; title: string; type: string; date: string; cover: string; }
interface Sport { id: string; icon: string; name: string; date: string; time: string; note: string; }
interface Meditation { id: string; theme: string; duration: string; date: string; insight: string; }
interface Drama { id: string; title: string; season: string; date: string; cover: string; quote: string; }

/* ====== Mock 数据 ====== */
const MOCK_BOOKS: Book[] = [
  { id: "1", title: "百年孤独", author: "加西亚·马尔克斯", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=280&fit=crop", quote: "生命从来不曾离开孤独而独立存在。", date: "2024.09 · 重读" },
  { id: "2", title: "小王子", author: "安托万·德·圣-埃克苏佩里", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=280&fit=crop", quote: "真正重要的东西，用眼睛是看不见的。", date: "2024.06 · 初读" },
  { id: "3", title: "瓦尔登湖", author: "亨利·梭罗", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=280&fit=crop", quote: "我步入丛林，因为我希望生活得有意义。", date: "2024.03 · 初读" },
  { id: "4", title: "被讨厌的勇气", author: "岸见一郎 / 古贺史健", cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=280&fit=crop", quote: "自由就是被别人讨厌。", date: "2023.11 · 初读" },
  { id: "5", title: "当下的力量", author: "埃克哈特·托利", cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=200&h=280&fit=crop", quote: "臣服不是妥协，而是接受当下的存在。", date: "2023.08 · 初读" },
  { id: "6", title: "设计心理学", author: "唐·诺曼", cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=280&fit=crop", quote: "设计不是关于物品的外观，而是关于物品如何运作。", date: "2023.05 · 初读" },
];
const MOCK_PHOTOS: Photo[] = [
  { id: "1", src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", title: "山间晨雾", date: "2025.03", desc: "凌晨五点的山间，空气里都是安静的味道" },
  { id: "2", src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800", title: "星空与雪", date: "2025.01", desc: "零下十五度的等待，换来这一刻的永恒" },
  { id: "3", src: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800", title: "日出金山", date: "2024.12", desc: "太阳出来的那一刻，世界都安静了" },
  { id: "4", src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800", title: "湖边倒影", date: "2024.10", desc: "水面是世界的另一面" },
  { id: "5", src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800", title: "草原尽头", date: "2024.08", desc: "走到草原的尽头，才发现起点在心里" },
];
const MOCK_TRACKS: Track[] = [
  { id: "1", title: "乐队的夏天 · S3E01", type: "播客", date: "2025.04 · 通勤", cover: "🎸" },
  { id: "2", title: "贝多芬：月光奏鸣曲", type: "音乐", date: "2025.04 · 夜晚", cover: "🎹" },
  { id: "3", title: "随机波动 · 那些消失的书店", type: "播客", date: "2025.03 · 睡前", cover: "📻" },
  { id: "4", title: "落日飞车 · My Jinji", type: "音乐", date: "2025.03 · 黄昏", cover: "🌅" },
  { id: "5", title: "得意事务所 · 创业者的故事", type: "播客", date: "2025.02 · 通勤", cover: "🎙️" },
  { id: "6", title: "久石让 · 天空之城", type: "音乐", date: "2025.01 · 工作", cover: "🏰" },
];
const MOCK_SPORTS: Sport[] = [
  { id: "1", icon: "🏃", name: "晨跑 5km", date: "2025.04.15", time: "06:30", note: "风很温柔，脚步很轻" },
  { id: "2", icon: "🧘", name: "正念瑜伽 30min", date: "2025.04.12", time: "20:00", note: "呼吸比思考更重要" },
  { id: "3", icon: "💪", name: "力量训练 45min", date: "2025.04.10", time: "19:00", note: "流汗的感觉很踏实" },
  { id: "4", icon: "🏃", name: "夜跑 3km", date: "2025.04.08", time: "21:30", note: "路灯下的影子很孤独也很自由" },
  { id: "5", icon: "🧘", name: "睡前拉伸 15min", date: "2025.04.05", time: "22:00", note: "身体放松了，心也安静下来" },
  { id: "6", icon: "🚴", name: "骑行 12km", date: "2025.04.02", time: "08:00", note: "穿过城市的早晨" },
];
const MOCK_MEDITATIONS: Meditation[] = [
  { id: "1", theme: "正念呼吸", duration: "15分钟", date: "2025.04.15", insight: "平静不是没有波澜，而是学会与波澜共处。" },
  { id: "2", theme: "身体扫描", duration: "20分钟", date: "2025.04.10", insight: "每一个细胞都在呼吸。身体比我以为的更聪明。" },
  { id: "3", theme: "慈心禅", duration: "10分钟", date: "2025.04.05", insight: "对自己温柔，是一切温柔的开始。" },
  { id: "4", theme: "呼吸锚定", duration: "12分钟", date: "2025.03.28", insight: "焦虑来时，只是看着它来，不评判，它就会走。" },
  { id: "5", theme: "开放觉知", duration: "18分钟", date: "2025.03.20", insight: "世界很吵，但我的内心可以很静。" },
];
const MOCK_DRAMAS: Drama[] = [
  { id: "1", title: "重启人生", season: "S1E3", date: "2025.03 · 周末", cover: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=400&fit=crop", quote: "人生没有白走的路，每一步都算数。" },
  { id: "2", title: "我的解放日志", season: "S1E8", date: "2025.02 · 深夜", cover: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=400&fit=crop", quote: "如果今天能够稍微不一样，明天会不会也跟着不一样？" },
  { id: "3", title: "俗女养成记", season: "S2E4", date: "2025.01 · 周末", cover: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=300&h=400&fit=crop", quote: "你是从什么时候开始，不再相信努力有用的？" },
  { id: "4", title: "漫长的季节", season: "S1E10", date: "2024.12 · 深夜", cover: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=400&fit=crop", quote: "这个秋天，好像比往常都长。" },
  { id: "5", title: "去有风的地方", season: "S1E6", date: "2024.11 · 周末", cover: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=400&fit=crop", quote: "慢下来，也是一种前进。" },
  { id: "6", title: "春夜", season: "S1E2", date: "2024.10 · 深夜", cover: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=400&fit=crop", quote: "有些相遇注定要发生，在恰当的时候。" },
];

/* ====== localStorage 工具函数 ====== */
function loadData<T>(key: string, fallback: T[]): T[] {
  return legacyLoad<T[]>(key, fallback) ?? fallback;
}
function saveData<T>(key: string, data: T[]): void {
  legacySave(key, data);
}
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result as string);
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
}

/* ====== Toast 组件 ====== */
const Toast: React.FC<{ message: string; onDone: () => void }> = ({ message, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{
      position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
      zIndex: 9999, background: `${HEALING_COLORS.grayGreen}ee`, color: "#fff",
      padding: "12px 28px", borderRadius: 999, fontSize: 14, fontWeight: 500,
      backdropFilter: "blur(16px)", boxShadow: `0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px ${HEALING_COLORS.woodBorder}`,
      animation: "lf-toast-in 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      letterSpacing: "0.03em",
    }}>
      {message}
      <style>{`@keyframes lf-toast-in { from { opacity:0; transform: translateX(-50%) translateY(20px) scale(0.9); } to { opacity:1; transform: translateX(-50%) translateY(0) scale(1); } }`}</style>
    </div>
  );
};

/* ====== 确认删除弹窗 ====== */
const ConfirmDialog: React.FC<{ message: string; onConfirm: () => void; onCancel: () => void }> = ({ message, onConfirm, onCancel }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
  }} onClick={onCancel}>
    <div style={{
      background: HEALING_COLORS.cream, borderRadius: 20, padding: "28px 28px 24px",
      maxWidth: 320, width: "100%", textAlign: "center",
      border: `1px solid ${HEALING_COLORS.woodBorder}`,
      boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      animation: "lf-slideup 0.3s ease",
    }} onClick={e => e.stopPropagation()}>
      <p style={{ fontFamily: "Noto Serif SC, serif", fontSize: 16, color: HEALING_COLORS.text, margin: "0 0 20px", lineHeight: 1.6 }}>{message}</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={onCancel} style={{ flex: 1, padding: "10px 0", border: `1.5px solid ${HEALING_COLORS.woodBorder}`, borderRadius: 999, background: "transparent", color: HEALING_COLORS.textLight, cursor: "pointer", fontSize: 14, transition: "all 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = HEALING_COLORS.woodLight; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>取消</button>
        <button onClick={onConfirm} style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 999, background: "#D46B4D", color: "#fff", cursor: "pointer", fontSize: 14, transition: "all 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}>确认删除</button>
      </div>
    </div>
    <style>{`@keyframes lf-slideup { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
  </div>
);

/* ====== 上传模态框 ====== */
type UploadModuleType = "reading" | "photo" | "music" | "sport" | "meditation" | "drama";

interface FieldDef { key: string; label: string; placeholder?: string; type?: string; options?: string[]; required?: boolean; isTextarea?: boolean; isFile?: boolean; icon?: string; }
const UPLOAD_FIELDS: Record<UploadModuleType, FieldDef[]> = {
  reading: [
    { key: "cover", label: "书籍封面", type: "file", isFile: true, required: true },
    { key: "title", label: "书名", placeholder: "如：百年孤独", required: true },
    { key: "author", label: "作者", placeholder: "如：加西亚·马尔克斯" },
    { key: "quote", label: "喜欢的句子", placeholder: "如：生命从来不曾离开孤独而独立存在。", isTextarea: true },
    { key: "date", label: "阅读时间", type: "date" },
  ],
  photo: [
    { key: "photos", label: "照片（可多选）", type: "file", isFile: true, required: true },
    { key: "date", label: "拍摄时间", type: "date", icon: "📅" },
    { key: "desc", label: "地点 / 描述", placeholder: "如：凌晨五点的山间，空气里都是安静的味道", isTextarea: true, icon: "📍" },
  ],
  music: [
    { key: "cover", label: "封面图", type: "file", isFile: true },
    { key: "title", label: "标题", placeholder: "如：落日飞车 · My Jinji", required: true },
    { key: "type", label: "类型", type: "select", options: ["音乐", "播客"], required: true },
    { key: "date", label: "收听时间", type: "date" },
    { key: "note", label: "备注", placeholder: "如：通勤 · 睡前 · 黄昏", isTextarea: true },
  ],
  sport: [
    { key: "icon", label: "运动类型", type: "select", options: ["🏃 跑步", "🧘 瑜伽", "💪 健身", "🚴 骑行", "🏊 游泳", "⚽ 球类"], required: true },
    { key: "name", label: "运动名称", placeholder: "如：晨跑 5km", required: true },
    { key: "date", label: "日期", type: "date", required: true },
    { key: "time", label: "时间", type: "time" },
    { key: "note", label: "感受", placeholder: "如：风很温柔，脚步很轻", isTextarea: true },
  ],
  meditation: [
    { key: "theme", label: "冥想主题", placeholder: "如：正念呼吸", required: true },
    { key: "duration", label: "时长", placeholder: "如：15分钟", required: true },
    { key: "date", label: "日期", type: "date", required: true },
    { key: "insight", label: "感悟", placeholder: "如：平静不是没有波澜，而是学会与波澜共处。", isTextarea: true },
  ],
  drama: [
    { key: "cover", label: "剧集封面", type: "file", isFile: true },
    { key: "title", label: "剧名", placeholder: "如：重启人生", required: true },
    { key: "season", label: "季数/集数", placeholder: "如：S1E3" },
    { key: "date", label: "观看时间", type: "date" },
    { key: "quote", label: "一句话评价", placeholder: "如：人生没有白走的路，每一步都算数。", isTextarea: true },
  ],
};
const UPLOAD_TITLES: Record<UploadModuleType, string> = {
  reading: "添加书籍", photo: "添加照片", music: "添加音乐/播客",
  sport: "添加运动记录", meditation: "添加冥想记录", drama: "添加追剧记录",
};

const UploadModal: React.FC<{
  moduleType: UploadModuleType;
  onSubmit: (data: Record<string, string>, files: Record<string, string[]>) => void;
  onClose: () => void;
  initialData?: Record<string, string>;
  initialFiles?: Record<string, string[]>;
  title?: string;
}> = ({ moduleType, onSubmit, onClose, initialData, initialFiles, title }) => {
  const fields = UPLOAD_FIELDS[moduleType];
  const [values, setValues] = useState<Record<string, string>>(initialData || {});
  const [filePreviews, setFilePreviews] = useState<Record<string, string[]>>(initialFiles || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileChange = async (key: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const isMulti = key === "photos";
    try {
      if (isMulti) {
        const urls = await Promise.all(Array.from(files).map(f => fileToDataUrl(f)));
        setFilePreviews(p => ({ ...p, [key]: urls }));
      } else {
        const url = await fileToDataUrl(files[0]);
        setFilePreviews(p => ({ ...p, [key]: [url] }));
      }
    } catch {}
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach(f => {
      if (f.required && !values[f.key] && filePreviews[f.key]?.length === 0) {
        newErrors[f.key] = "此项为必填";
      }
    });
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    onSubmit(values, filePreviews);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 210, background: "rgba(0,0,0,0.45)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      animation: "lf-fadein 0.3s ease",
    }} onClick={onClose}>
      <div style={{
        background: HEALING_COLORS.cream, borderRadius: 24, padding: "32px 28px 28px",
        maxWidth: 480, width: "100%", maxHeight: "88vh", overflowY: "auto",
        border: `1px solid ${HEALING_COLORS.woodBorder}`,
        boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
        animation: "lf-slideup 0.35s ease",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "Noto Serif SC, serif", fontSize: 20, fontWeight: 600, color: HEALING_COLORS.text, margin: 0, letterSpacing: "0.04em" }}>{title || UPLOAD_TITLES[moduleType]}</h3>
          <button onClick={onClose} style={{ width: 36, height: 36, border: "none", borderRadius: "50%", background: HEALING_COLORS.woodLight, color: HEALING_COLORS.textLight, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = HEALING_COLORS.woodBorder; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = HEALING_COLORS.woodLight; }}>×</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {fields.map((field) => (
            <div key={field.key}>
              {/* 摄影模块：拍摄时间和地点描述分开区块 */}
              {moduleType === "photo" && field.key === "desc" && (
                <div style={{ height: 16 }} />
              )}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                {/* 线性图标 */}
                {field.icon && (
                  <span style={{ fontSize: 18, marginTop: 10, flexShrink: 0, opacity: 0.7 }}>{field.icon}</span>
                )}
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 12, color: HEALING_COLORS.textLight, marginBottom: 8, fontWeight: 500, letterSpacing: "0.05em" }}>
                    {field.label} {field.required && <span style={{ color: "#D46B4D" }}>*</span>}
                  </label>
                  {field.isFile ? (
                    <div>
                      <label style={{
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        border: `2px dashed ${errors[field.key] ? "#D46B4D" : HEALING_COLORS.woodBorder}`,
                        borderRadius: 16, padding: "24px 16px", cursor: "pointer",
                        background: HEALING_COLORS.grayGreenLight,
                        transition: "all 0.25s",
                      }}>
                        {filePreviews[field.key]?.length ? (
                          field.key === "photos" ? (
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                              {filePreviews[field.key]!.map((url, i) => (
                                <img key={i} src={url} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />
                              ))}
                            </div>
                          ) : (
                            <img src={filePreviews[field.key]![0]} alt="" style={{ width: 80, height: 110, objectFit: "cover", borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }} />
                          )
                        ) : (
                          <>
                            <span style={{ fontSize: 32, marginBottom: 10 }}>📷</span>
                            <span style={{ fontSize: 13, color: HEALING_COLORS.textLight, fontFamily: "Noto Serif SC, serif" }}>点击上传{field.label}</span>
                            {field.key === "photos" && <span style={{ fontSize: 11, color: HEALING_COLORS.textMuted, marginTop: 4 }}>可同时选择多张</span>}
                          </>
                        )}
                        <input type="file" accept="image/*" multiple={field.key === "photos"}
                          onChange={e => handleFileChange(field.key, e.target.files)}
                          style={{ display: "none" }} />
                      </label>
                    </div>
                  ) : field.isTextarea ? (
                    <textarea
                      value={values[field.key] || ""}
                      onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      rows={3}
                      style={{
                        width: "100%", boxSizing: "border-box", padding: "10px 0",
                        border: "none", borderBottom: `2px solid ${errors[field.key] ? "#D46B4D" : HEALING_COLORS.woodBorder}`,
                        background: "transparent", color: HEALING_COLORS.text, fontSize: 14,
                        resize: "none", outline: "none", fontFamily: "Noto Serif SC, serif", lineHeight: 1.8,
                        transition: "border-color 0.2s",
                      }}
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={values[field.key] || ""}
                      onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                      style={{
                        width: "100%", boxSizing: "border-box", padding: "10px 0", border: "none",
                        borderBottom: `2px solid ${errors[field.key] ? "#D46B4D" : HEALING_COLORS.woodBorder}`,
                        background: "transparent", color: HEALING_COLORS.text, fontSize: 14,
                        outline: "none", fontFamily: "inherit", appearance: "none", cursor: "pointer",
                        transition: "border-color 0.2s",
                      }}>
                      <option value="">请选择</option>
                      {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={field.type || "text"}
                      value={values[field.key] || ""}
                      onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      style={{
                        width: "100%", boxSizing: "border-box", padding: "10px 0", border: "none",
                        borderBottom: `2px solid ${errors[field.key] ? "#D46B4D" : HEALING_COLORS.woodBorder}`,
                        background: "transparent", color: HEALING_COLORS.text, fontSize: 14,
                        outline: "none", fontFamily: "Noto Serif SC, serif",
                        transition: "border-color 0.2s",
                      }}
                    />
                  )}
                  {errors[field.key] && <p style={{ fontSize: 11, color: "#D46B4D", margin: "6px 0 0" }}>{errors[field.key]}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          style={{
            width: "100%", marginTop: 28, padding: "14px 0", border: "none",
            borderRadius: 16, background: HEALING_COLORS.grayGreen, color: "#fff",
            fontSize: 15, fontWeight: 500, cursor: "pointer",
            fontFamily: "Noto Serif SC, serif", letterSpacing: "0.06em",
            transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
            boxShadow: "0 4px 16px rgba(141,154,139,0.3)",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(141,154,139,0.4)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(141,154,139,0.3)"; }}
        >确认上传 ✨</button>
      </div>
      <style>{`
        @keyframes lf-fadein { from { opacity:0; } to { opacity:1; } }
        @keyframes lf-slideup { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
};

/* ====== 空状态组件 ====== */
const EmptyState: React.FC<{ emoji: string; text?: string }> = ({ emoji, text }) => (
  <div style={{ textAlign: "center", padding: "40px 16px" }}>
    <div style={{ fontSize: 52, marginBottom: 16, opacity: 0.5 }}>{emoji}</div>
    <p style={{ fontSize: 13, color: HEALING_COLORS.textMuted, margin: 0, lineHeight: 1.8, fontFamily: "Noto Serif SC, serif" }}>{text || "还没记录呢，点击右下角 + 号开始吧"}</p>
  </div>
);

/* ====== 疗愈系通用颜色常量 ====== */
const HEALING_COLORS = {
  wood: "#C4A77D",
  woodLight: "rgba(196,167,125,0.15)",
  woodBorder: "rgba(196,167,125,0.3)",
  grayGreen: "#8D9A8B",
  grayGreenLight: "rgba(141,154,139,0.12)",
  cream: "#FAF9F6",
  creamDark: "#F5F3EE",
  text: "#4A4038",
  textLight: "#8A7A6A",
  textMuted: "#B0A090",
  accent: "#6A8A6A",
  accentLight: "rgba(106,138,106,0.15)",
};
const ModalOverlay: React.FC<{ children: React.ReactNode; onClose: () => void; showFab?: boolean; fabOnClick?: () => void; fabColor?: string }> = ({ children, onClose, showFab, fabOnClick, fabColor }) => (
  <>
    <div style={{
      position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)",
      backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, animation: "lfm-fadein 0.35s ease",
    }} onClick={onClose}>
      <div style={{
        position: "relative", width: "100%", maxWidth: 720, maxHeight: "85vh",
        background: HEALING_COLORS.cream, borderRadius: 24,
        border: `1px solid ${HEALING_COLORS.woodBorder}`,
        boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
        padding: "32px 28px", overflowY: "auto", color: HEALING_COLORS.text,
        animation: "lfm-slideup 0.35s ease",
      }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
    {showFab && fabOnClick && (
      <button onClick={fabOnClick} title="添加记录"
        style={{
          position: "fixed", bottom: 32, right: 32, zIndex: 210, width: 60, height: 60,
          border: "none", borderRadius: "50%", background: fabColor || HEALING_COLORS.grayGreen, color: "#fff",
          fontSize: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 28px rgba(141,154,139,0.4)",
          transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.2s",
          animation: "lf-fab-appear 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1) rotate(90deg)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1) rotate(0deg)"; }}>
        +
      </button>
    )}
    <style>{`
      @keyframes lfm-fadein { from { opacity: 0; } to { opacity: 1; } }
      @keyframes lfm-slideup { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes lf-fab-appear { from { opacity:0; transform:scale(0.6); } to { opacity:1; transform:scale(1); } }
      @keyframes vinyl-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes note-float { 0% { opacity: 0.8; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-60px) scale(0.5); } }
      @keyframes branch-extend { from { width: 0; opacity: 0; } to { width: 60px; opacity: 1; } }
      @keyframes branch-retract { from { width: 60px; opacity: 1; } to { width: 0; opacity: 0; } }
    `}</style>
  </>
);

/* ====== 删除按钮（小×） ====== */
const DeleteBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={e => { e.stopPropagation(); onClick(); }}
    title="删除"
    className="lf-action-btn lf-delete-btn"
    style={{
      position: "absolute", top: 6, right: 6, width: 22, height: 22, border: "none", borderRadius: "50%",
      background: "rgba(0,0,0,0.18)", color: "rgba(255,255,255,0.85)", fontSize: 13,
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      opacity: _IS_TOUCH ? 0.55 : 0, transition: "opacity 0.2s, background 0.2s",
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(180,80,80,0.6)"; (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.18)"; (e.currentTarget as HTMLButtonElement).style.opacity = _IS_TOUCH ? "0.55" : "0"; }}
  >×</button>
);

/* ====== 阅读模块 ====== */
const ReadingModal: React.FC<{ onClose: () => void; onUpload: () => void; verifyAdmin: (cb: () => void) => void }> = ({ onClose, onUpload, verifyAdmin }) => {
  const [books, setBooks] = useState<Book[]>(() => loadData<Book>(LS_KEYS.reading, MOCK_BOOKS));
  const [selected, setSelected] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);

  const handleDelete = (id: string) => {
    const updated = books.filter(b => b.id !== id);
    setBooks(updated);
    saveData(LS_KEYS.reading, updated);
    setDeleting(null);
  };

  const handleEditSubmit = (data: Record<string, string>, files: Record<string, string[]>) => {
    if (!editing) return;
    const updated = books.map(b => b.id === editing.id ? {
      ...b,
      title: data.title || b.title,
      author: data.author || b.author,
      cover: files["cover"]?.[0] || b.cover,
      quote: data.quote || b.quote,
      date: data.date || b.date,
    } : b);
    setBooks(updated);
    saveData(LS_KEYS.reading, updated);
    setEditing(null);
    onUpload();
  };

  return (
    <>
      <ModalOverlay onClose={onClose} showFab fabOnClick={() => setShowUpload(true)}>
        <button style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, border: "none", borderRadius: "50%", background: "rgba(0,0,0,0.06)", color: "#888", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>×</button>
        <h3 style={{ fontFamily: "Noto Serif SC, serif", fontSize: 20, fontWeight: 600, color: "#4a4038", margin: "0 0 20px", textAlign: "center", letterSpacing: "0.04em" }}>📖 我的书架</h3>
        {selected ? (
          <div style={{ textAlign: "center", animation: "lfm-fadein 0.3s" }}>
            <img src={selected.cover} alt={selected.title} style={{ width: 160, height: 224, objectFit: "cover", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", margin: "0 auto 16px" }} />
            <h4 style={{ fontFamily: "Noto Serif SC, serif", fontSize: 18, color: "#4a4038", margin: "0 0 4px" }}>{selected.title}</h4>
            <p style={{ fontSize: 13, color: "#8a7a6a", margin: "0 0 12px" }}>· {selected.author}</p>
            <blockquote style={{ fontFamily: "Noto Serif SC, serif", fontSize: 14, color: "#6a8a6a", borderLeft: "3px solid #6a8a6a", paddingLeft: 12, margin: "0 0 12px", fontStyle: "italic" }}>"{selected.quote}"</blockquote>
            <p style={{ fontSize: 12, color: "#b0a090", margin: "0 0 16px" }}>{selected.date}</p>
            <button onClick={() => setSelected(null)} style={{ padding: "8px 20px", border: "1.5px solid #6a8a6a", borderRadius: 999, background: "transparent", color: "#6a8a6a", cursor: "pointer", fontSize: 13 }}>← 返回书架</button>
          </div>
        ) : books.length === 0 ? (
          <EmptyState emoji="📚" />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {books.map(book => (
              <div key={book.id} style={{ position: "relative", cursor: "pointer", textAlign: "center", transition: "transform 0.2s" }}
                onClick={() => setSelected(book)}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
                <DeleteBtn onClick={() => verifyAdmin(() => setDeleting(book.id))} />
                <button onClick={e => { e.stopPropagation(); verifyAdmin(() => setEditing(book)); }} style={{ position: "absolute", top: 6, left: 6, width: 22, height: 22, border: "none", borderRadius: "50%", background: "rgba(0,0,0,0.18)", color: "rgba(255,255,255,0.85)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: _IS_TOUCH ? 0.55 : 0, transition: "opacity 0.2s", zIndex: 2 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = _IS_TOUCH ? "0.55" : "0"; }}>✎</button>
                <img src={book.cover} alt={book.title} style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: 8 }} />
                <p style={{ fontSize: 12, color: "#5a5248", margin: 0, fontWeight: 500 }}>{book.title}</p>
                <p style={{ fontSize: 11, color: "#b0a090", margin: "2px 0 0" }}>{book.author}</p>
              </div>
            ))}
          </div>
        )}
        {deleting && <ConfirmDialog message="确定要删除这本书吗？" onConfirm={() => handleDelete(deleting)} onCancel={() => setDeleting(null)} />}
      </ModalOverlay>
      {showUpload && (
        <UploadModal moduleType="reading" onSubmit={(data, files) => {
          const newBook: Book = {
            id: genId(), title: data.title, author: data.author || "",
            cover: files["cover"]?.[0] || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=280&fit=crop",
            quote: data.quote || "", date: data.date || "",
          };
          const updated = [newBook, ...books];
          setBooks(updated); saveData(LS_KEYS.reading, updated);
          setShowUpload(false); onUpload();
        }} onClose={() => setShowUpload(false)} />
      )}
      {editing && (
        <UploadModal moduleType="reading" title="编辑书籍"
          initialData={{ title: editing.title, author: editing.author, quote: editing.quote, date: editing.date }}
          initialFiles={{ cover: [editing.cover] }}
          onSubmit={handleEditSubmit}
          onClose={() => setEditing(null)} />
      )}
    </>
  );
};

/* ====== 摄影模块（疗愈系） ====== */
const PhotoModal: React.FC<{ onClose: () => void; onUpload: () => void; verifyAdmin: (cb: () => void) => void }> = ({ onClose, onUpload, verifyAdmin }) => {
  const [photos, setPhotos] = useState<Photo[]>(() => loadData<Photo>(LS_KEYS.photos, MOCK_PHOTOS));
  const [idx, setIdx] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editing, setEditing] = useState<Photo | null>(null);

  if (photos.length > 0 && idx >= photos.length) setIdx(0);
  const p = photos[idx] || null;

  const handleDelete = (id: string) => {
    const updated = photos.filter(x => x.id !== id);
    setPhotos(updated); saveData(LS_KEYS.photos, updated);
    setDeleting(null);
  };

  const handleEditSubmit = (data: Record<string, string>, files: Record<string, string[]>) => {
    if (!editing) return;
    const updated = photos.map(ph => ph.id === editing.id ? {
      ...ph,
      src: files["photos"]?.[0] || ph.src,
      title: data.desc?.split("·")[0]?.trim() || ph.title,
      date: data.date || ph.date,
      desc: data.desc || ph.desc,
    } : ph);
    setPhotos(updated); saveData(LS_KEYS.photos, updated);
    setEditing(null); onUpload();
  };

  return (
    <>
      <ModalOverlay onClose={onClose} showFab fabOnClick={() => setShowUpload(true)} fabColor={HEALING_COLORS.wood}>
        <button style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, border: "none", borderRadius: "50%", background: HEALING_COLORS.woodLight, color: HEALING_COLORS.textLight, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
          onClick={onClose}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = HEALING_COLORS.woodBorder; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = HEALING_COLORS.woodLight; }}>×</button>
        <h3 style={{ fontFamily: "Noto Serif SC, serif", fontSize: 22, fontWeight: 600, color: HEALING_COLORS.text, margin: "0 0 24px", textAlign: "center", letterSpacing: "0.06em" }}>📷 我的摄影集</h3>
        {photos.length === 0 ? (
          <EmptyState emoji="📷" />
        ) : (
          <>
            {/* 主图 - 带阴影提升立体感 */}
            <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: HEALING_COLORS.creamDark, marginBottom: 24, boxShadow: "0 12px 48px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)" }}>
              {p && <>
                <div style={{ position: "relative" }}>
                  <img src={p.src} alt={p.title} style={{ width: "100%", height: 340, objectFit: "cover", display: "block" }} />
                  <DeleteBtn onClick={() => verifyAdmin(() => setDeleting(p.id))} />
                  <button onClick={e => { e.stopPropagation(); verifyAdmin(() => setEditing(p)); }} style={{ position: "absolute", top: 6, left: 6, width: 28, height: 28, border: "none", borderRadius: "50%", background: "rgba(0,0,0,0.25)", color: "rgba(255,255,255,0.85)", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, opacity: _IS_TOUCH ? 0.55 : 0 }}>✎</button>
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 20px 16px", background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}>
                  <p style={{ color: "#fff", fontSize: 16, margin: 0, fontWeight: 500, fontFamily: "Noto Serif SC, serif" }}>{p.title}</p>
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "6px 0 0", letterSpacing: "0.02em" }}>{p.date} · {p.desc}</p>
                </div>
                <button onClick={() => setIdx(i => (i - 1 + photos.length) % photos.length)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.35)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)"; }}>‹</button>
                <button onClick={() => setIdx(i => (i + 1) % photos.length)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.35)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)"; }}>›</button>
                <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
                  {photos.map((_, i) => <span key={i} style={{ width: i === idx ? 20 : 8, height: 8, borderRadius: 4, background: i === idx ? "#fff" : "rgba(255,255,255,0.4)", transition: "all 0.3s" }} />)}
                </div>
              </>}
            </div>
            {/* 阶梯式缩略图墙 */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, padding: "0 4px", overflowX: "auto", paddingBottom: 8 }}>
              {photos.map((ph, i) => (
                <div key={ph.id}
                  style={{
                    flexShrink: 0, cursor: "pointer", borderRadius: 10, overflow: "hidden",
                    border: i === idx ? `3px solid ${HEALING_COLORS.grayGreen}` : `3px solid transparent`,
                    transform: i === idx ? "translateY(-8px)" : i === (idx - 1 + photos.length) % photos.length || i === (idx + 1) % photos.length ? "translateY(-3px)" : "translateY(0)",
                    boxShadow: i === idx ? `0 8px 24px rgba(0,0,0,0.2)` : "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                    opacity: Math.abs(i - idx) > 2 ? 0.5 : 1,
                  }}
                  onClick={() => setIdx(i)}
                >
                  <img src={ph.src} alt={ph.title} style={{ width: 72, height: 54, objectFit: "cover", display: "block" }} />
                </div>
              ))}
              {/* 添加位 */}
              <div style={{ flexShrink: 0, width: 72, height: 54, borderRadius: 10, border: `2px dashed ${HEALING_COLORS.woodBorder}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: HEALING_COLORS.woodLight, transition: "all 0.2s" }}
                onClick={() => setShowUpload(true)}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = HEALING_COLORS.grayGreen; (e.currentTarget as HTMLDivElement).style.background = HEALING_COLORS.grayGreenLight; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = HEALING_COLORS.woodBorder; (e.currentTarget as HTMLDivElement).style.background = HEALING_COLORS.woodLight; }}>
                <span style={{ fontSize: 24, color: HEALING_COLORS.textLight }}>+</span>
              </div>
            </div>
          </>
        )}
        {deleting && <ConfirmDialog message="确定要删除这张照片吗？" onConfirm={() => handleDelete(deleting)} onCancel={() => setDeleting(null)} />}
      </ModalOverlay>
      {showUpload && (
        <UploadModal moduleType="photo" onSubmit={(data, files) => {
          const newPhotos: Photo[] = (files["photos"] || []).map((url: string, i: number) => ({
            id: genId(), src: url, title: data.desc?.split("·")[0]?.trim() || `照片 ${i + 1}`, date: data.date || new Date().toISOString().slice(0, 7), desc: data.desc || "",
          }));
          const updated = [...newPhotos, ...photos];
          setPhotos(updated); saveData(LS_KEYS.photos, updated);
          setShowUpload(false); onUpload();
        }} onClose={() => setShowUpload(false)} />
      )}
      {editing && (
        <UploadModal moduleType="photo" title="编辑照片"
          initialData={{ desc: editing.desc, date: editing.date }}
          initialFiles={{ photos: [editing.src] }}
          onSubmit={handleEditSubmit}
          onClose={() => setEditing(null)} />
      )}
    </>
  );
};

/* ====== 音乐/播客模块（疗愈系黑胶唱片） ====== */
const MusicModal: React.FC<{ onClose: () => void; onUpload: () => void; verifyAdmin: (cb: () => void) => void }> = ({ onClose, onUpload, verifyAdmin }) => {
  const [tracks, setTracks] = useState<Track[]>(() => loadData<Track>(LS_KEYS.tracks, MOCK_TRACKS));
  const [playing, setPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editing, setEditing] = useState<Track | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            if (timerRef.current) clearInterval(timerRef.current);
            setPlaying(null);
            setShowNotes(false);
            return 0;
          }
          return p + 1;
        });
      }, 300);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing]);

  const handlePlay = (id: string) => {
    if (playing === id) {
      setPlaying(null);
      setShowNotes(false);
      setProgress(0);
    } else {
      setPlaying(id);
      setShowNotes(true);
    }
  };

  const handleDelete = (id: string) => {
    const updated = tracks.filter(t => t.id !== id);
    setTracks(updated); saveData(LS_KEYS.tracks, updated);
    setDeleting(null);
  };

  const handleEditSubmit = (data: Record<string, string>, _files: Record<string, string[]>) => {
    if (!editing) return;
    const updated = tracks.map(t => t.id === editing.id ? {
      ...t,
      title: data.title || t.title,
      type: data.type?.replace(/[^音乐播客]/g, "") || t.type,
      date: data.date || t.date,
      cover: t.cover,
    } : t);
    setTracks(updated);
    saveData(LS_KEYS.tracks, updated);
    setEditing(null);
    onUpload();
  };

  const NOTE_EMOJIS = ["♪", "♫", "♬", "🎵"];
  const currentTrack = tracks.find(t => t.id === playing);

  return (
    <>
      <ModalOverlay onClose={onClose} showFab fabOnClick={() => setShowUpload(true)} fabColor={HEALING_COLORS.wood}>
        <button style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, border: "none", borderRadius: "50%", background: HEALING_COLORS.woodLight, color: HEALING_COLORS.textLight, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
          onClick={onClose}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = HEALING_COLORS.woodBorder; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = HEALING_COLORS.woodLight; }}>×</button>
        <h3 style={{ fontFamily: "Noto Serif SC, serif", fontSize: 22, fontWeight: 600, color: HEALING_COLORS.text, margin: "0 0 24px", textAlign: "center", letterSpacing: "0.06em" }}>🎧 我的收听清单</h3>
        {currentTrack ? (
          /* 播放界面 */
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0 8px" }}>
            {/* 黑胶唱片 + 树枝动画 */}
            <div style={{ position: "relative", width: 200, height: 200, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* 飘出的音符 */}
              {showNotes && NOTE_EMOJIS.slice(0, 4).map((note, i) => (
                <span key={i} style={{
                  position: "absolute", fontSize: 20, color: HEALING_COLORS.accent,
                  animation: `note-float ${2 + i * 0.3}s ease-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                  top: `${20 + i * 15}%`, right: `${10 + i * 5}%`,
                  opacity: 0,
                }}>{note}</span>
              ))}
              {/* 绿色细树枝 */}
              <div style={{
                position: "absolute", left: playing ? -60 : -10, top: "50%", transform: "translateY(-50%)",
                width: playing ? 70 : 0, height: 3,
                background: `linear-gradient(90deg, ${HEALING_COLORS.accent}, ${HEALING_COLORS.wood})`,
                borderRadius: 2, transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)",
                overflow: "hidden", zIndex: 1,
              }}>
                <div style={{ position: "absolute", right: -6, top: -5, width: 14, height: 14, background: HEALING_COLORS.accent, borderRadius: "50% 0 50% 50%", transform: "rotate(-45deg)" }} />
              </div>
              {/* 黑胶唱片 - 木纹唱片沟槽质感 */}
              <div style={{
                width: 160, height: 160, borderRadius: "50%",
                background: `linear-gradient(135deg, #3a3028 0%, #4a4038 20%, #3a3028 40%, #4a4038 60%, #3a3028 80%, #4a4038 100%)`,
                boxShadow: `0 12px 40px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.08), ${playing ? `0 0 24px rgba(106,138,106,0.4)` : "none"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: playing ? "vinyl-spin 5s linear infinite" : "none",
                transition: "box-shadow 0.5s ease",
                position: "relative", overflow: "hidden",
              }}>
                {/* 唱片沟槽纹理 */}
                <div style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", background: "repeating-radial-gradient(circle at center, transparent 0px, transparent 1px, rgba(255,255,255,0.015) 1px, rgba(255,255,255,0.015) 2px)" }} />
                {/* 唱片同心圆纹理 */}
                {[40, 55, 70, 85, 100, 115].map(r => (
                  <div key={r} style={{ position: "absolute", width: r, height: r, borderRadius: "50%", border: `1px solid rgba(255,255,255,0.03)` }} />
                ))}
                {/* 中心封面 - 40mm 黑胶唱片风格 + 木纹圆心 */}
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${HEALING_COLORS.wood} 0%, #D4B896 50%, ${HEALING_COLORS.wood} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)", zIndex: 2 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(0,0,0,0.7)", boxShadow: "inset 0 1px 2px rgba(255,255,255,0.1)" }} />
                  <span style={{ fontSize: 16, position: "absolute" }}>{currentTrack.cover}</span>
                </div>
              </div>
            </div>
            {/* 曲目信息 */}
            <h4 style={{ fontFamily: "Noto Serif SC, serif", fontSize: 18, color: HEALING_COLORS.text, margin: "0 0 4px", textAlign: "center" }}>{currentTrack.title}</h4>
            <p style={{ fontSize: 13, color: HEALING_COLORS.textLight, margin: "0 0 20px" }}>{currentTrack.type} · {currentTrack.date}</p>
            {/* 进度条 */}
            <div style={{ width: "100%", maxWidth: 300, marginBottom: 16 }}>
              <div style={{ height: 4, background: HEALING_COLORS.woodLight, borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${HEALING_COLORS.grayGreen}, ${HEALING_COLORS.accent})`, borderRadius: 2, transition: "width 0.3s" }} />
              </div>
            </div>
            {/* 控制按钮 */}
            <div style={{ display: "flex", gap: 16 }}>
              <button onClick={() => handlePlay(currentTrack.id)} style={{ padding: "12px 28px", border: `2px solid ${HEALING_COLORS.woodBorder}`, borderRadius: 16, background: "transparent", color: HEALING_COLORS.text, cursor: "pointer", fontSize: 14, fontFamily: "Noto Serif SC, serif", transition: "all 0.25s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = HEALING_COLORS.woodLight; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>暂停</button>
              <button onClick={() => setProgress(p => Math.min(p + 10, 99))} style={{ padding: "12px 28px", border: "none", borderRadius: 16, background: HEALING_COLORS.grayGreen, color: "#fff", cursor: "pointer", fontSize: 14, fontFamily: "Noto Serif SC, serif", transition: "all 0.25s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 20px rgba(141,154,139,0.4)`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}>快进 ▶▶</button>
            </div>
          </div>
        ) : tracks.length === 0 ? (
          <EmptyState emoji="🎧" />
        ) : (
          /* 卡片列表 - 米白纸纹质感 */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {tracks.map(t => (
              <div key={t.id} style={{ position: "relative", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 16, background: `linear-gradient(135deg, ${HEALING_COLORS.creamDark} 0%, ${HEALING_COLORS.cream} 50%, ${HEALING_COLORS.creamDark} 100%)`, border: `1px solid ${HEALING_COLORS.woodBorder}`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)", transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
                onClick={() => handlePlay(t.id)}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px rgba(0,0,0,0.1), 0 0 0 1px ${HEALING_COLORS.woodBorder}`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
                <button onClick={e => { e.stopPropagation(); verifyAdmin(() => setEditing(t)); }} style={{ position: "absolute", top: 6, left: 6, width: 20, height: 20, border: "none", borderRadius: "50%", background: "rgba(0,0,0,0.18)", color: "rgba(255,255,255,0.85)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: _IS_TOUCH ? 0.55 : 0, transition: "opacity 0.2s", zIndex: 2 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = _IS_TOUCH ? "0.55" : "0"; }}>✎</button>
                <button onClick={e => { e.stopPropagation(); verifyAdmin(() => setDeleting(t.id)); }} style={{ position: "absolute", top: 6, right: 6, width: 20, height: 20, border: "none", borderRadius: "50%", background: "rgba(0,0,0,0.08)", color: "rgba(0,0,0,0.3)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: _IS_TOUCH ? 0.55 : 0, transition: "opacity 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = _IS_TOUCH ? "0.55" : "0"; }}>×</button>
                {/* 黑胶唱片图标 - 木纹质感 */}
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, #4a4038 0%, #3a3028 40%, #4a4038 60%, #2a2018 100%)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.2)", flexShrink: 0, position: "relative" }}>
                  <div style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", background: "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.02) 0deg 3deg, transparent 3deg 6deg)" }} />
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: `linear-gradient(135deg, ${HEALING_COLORS.wood} 0%, #D4B896 100%)`, boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)" }} />
                  <span style={{ fontSize: 16, position: "absolute", zIndex: 1 }}>{t.cover}</span>
                </div>
                <div><p style={{ fontSize: 13, color: HEALING_COLORS.text, margin: 0, fontWeight: 500, fontFamily: "Noto Serif SC, serif" }}>{t.title}</p><p style={{ fontSize: 11, color: HEALING_COLORS.textMuted, margin: "4px 0 0" }}>{t.type} · {t.date}</p></div>
              </div>
            ))}
          </div>
        )}
        {deleting && <ConfirmDialog message="确定要删除这条记录吗？" onConfirm={() => handleDelete(deleting)} onCancel={() => setDeleting(null)} />}
      </ModalOverlay>
      {showUpload && (
        <UploadModal moduleType="music" onSubmit={(data, _files) => {
          const newTrack: Track = {
            id: genId(), title: data.title, type: data.type?.replace(/[^音乐播客]/g, "") || "音乐",
            date: data.date || "", cover: "🎵",
          };
          const updated = [newTrack, ...tracks];
          setTracks(updated); saveData(LS_KEYS.tracks, updated);
          setShowUpload(false); onUpload();
        }} onClose={() => setShowUpload(false)} />
      )}
      {editing && (
        <UploadModal moduleType="music" title="编辑音乐/播客"
          initialData={{ title: editing.title, type: editing.type + " / " + editing.type, date: editing.date }}
          initialFiles={{}}
          onSubmit={handleEditSubmit}
          onClose={() => setEditing(null)} />
      )}
    </>
  );
};

/* ====== 运动模块 ====== */
const SportModal: React.FC<{ onClose: () => void; onUpload: () => void; verifyAdmin: (cb: () => void) => void }> = ({ onClose, onUpload, verifyAdmin }) => {
  const [sports, setSports] = useState<Sport[]>(() => loadData<Sport>(LS_KEYS.sports, MOCK_SPORTS));
  const [showUpload, setShowUpload] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editing, setEditing] = useState<Sport | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    const updated = sports.filter(s => s.id !== id);
    setSports(updated); saveData(LS_KEYS.sports, updated);
    setDeleting(null);
  };

  const handleEditSubmit = (data: Record<string, string>, _files: Record<string, string[]>) => {
    if (!editing) return;
    const updated = sports.map(s => s.id === editing.id ? {
      ...s,
      icon: data.icon?.split(" ")[0] || s.icon,
      name: data.name || s.name,
      date: data.date || s.date,
      time: data.time || s.time,
      note: data.note || s.note,
    } : s);
    setSports(updated);
    saveData(LS_KEYS.sports, updated);
    setEditing(null);
    onUpload();
  };

  const totalRuns = sports.filter(s => s.icon === "🏃").length;
  const totalDist = sports.reduce((acc, s) => { const m = s.name.match(/(\d+)km/); return acc + (m ? parseInt(m[1]) : 0); }, 0);
  const totalMin = sports.reduce((acc, s) => { const m = s.name.match(/(\d+)min/); return acc + (m ? parseInt(m[1]) : 0); }, 0);

  // 情绪推断：根据关键词映射情绪图标
  const inferEmotion = (note: string): string => {
    if (/轻|柔|慢|静|舒服|温柔|自在|peaceful/.test(note)) return "😊";
    if (/夜|月|星空|晚/.test(note)) return "🌙";
    if (/热|燃|力量|汗水|挑战|突破/.test(note)) return "🔥";
    if (/林|山|自然|风|呼吸/.test(note)) return "🍃";
    if (/快|自由|飞|爽/.test(note)) return "✨";
    return "🌿";
  };

  // 波浪时间轴数据（模拟7天，真实数据从 sports 提取）
  const weekDays = [0,1,2,3,4,5,6].map(i => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const dayCounts = weekDays.map(day => sports.filter(s => s.date === day).length);
  const maxCount = Math.max(...dayCounts, 1);

  return (
    <>
      <style>{`
        @keyframes sport-wave-grow { from { transform: scaleY(0); opacity: 0; } to { transform: scaleY(1); opacity: 1; } }
        @keyframes sport-card-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sport-stat-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <ModalOverlay onClose={onClose} showFab fabOnClick={() => setShowUpload(true)}>
        <button style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, border: "none", borderRadius: "50%", background: HEALING_COLORS.woodLight, color: HEALING_COLORS.textLight, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
          onClick={onClose}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = HEALING_COLORS.woodBorder; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = HEALING_COLORS.woodLight; }}>×</button>

        <h3 style={{ fontFamily: "Noto Serif SC, serif", fontSize: 22, fontWeight: 600, color: HEALING_COLORS.text, margin: "0 0 28px", textAlign: "center", letterSpacing: "0.06em" }}>🏃 运动疗愈日记</h3>

        {/* ===== 顶部数据区：瀑布流布局 ===== */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginBottom: 28, animation: "sport-stat-in 0.5s ease" }}>
          {/* 主数据：次数 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontFamily: "DIN Alternate, Arial, sans-serif", fontSize: 52, fontWeight: 700, color: HEALING_COLORS.text, lineHeight: 1, letterSpacing: "-0.02em" }}>{totalRuns || 4}</span>
            <span style={{ fontSize: 11, color: HEALING_COLORS.textMuted, letterSpacing: "0.15em", textTransform: "uppercase" }}>次运动</span>
          </div>
          {/* 次级数据：里程 + 时长 */}
          <div style={{ display: "flex", gap: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>🏃‍♂️</span>
              <span style={{ fontFamily: "DIN Alternate, Arial, sans-serif", fontSize: 18, fontWeight: 600, color: HEALING_COLORS.textLight }}>{totalDist || 23}<span style={{ fontSize: 12, fontWeight: 400, marginLeft: 2 }}>km</span></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>⏱️</span>
              <span style={{ fontFamily: "DIN Alternate, Arial, sans-serif", fontSize: 18, fontWeight: 600, color: HEALING_COLORS.textLight }}>{totalMin > 0 ? `${Math.floor(totalMin / 60)}h${totalMin % 60}m` : "3h12m"}</span>
            </div>
          </div>
        </div>

        {/* ===== 波浪形时间轴 ===== */}
        <div style={{ marginBottom: 28, animation: "sport-wave-grow 0.6s ease 0.2s both", transformOrigin: "bottom" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 56, padding: "0 8px", position: "relative" }}>
            {/* 波浪基底 */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${HEALING_COLORS.grayGreen}22, ${HEALING_COLORS.grayGreen}44)`, borderRadius: 2 }} />
            {dayCounts.map((count, i) => {
              const height = count > 0 ? Math.max(12, (count / maxCount) * 48) : 0;
              const isToday = i === dayCounts.length - 1;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{
                    width: "100%", height, borderRadius: "4px 4px 0 0",
                    background: count === 0 ? "transparent"
                      : isToday ? `linear-gradient(180deg, #B8A8D4 0%, ${HEALING_COLORS.accent} 100%)`
                      : `linear-gradient(180deg, rgba(141,154,139,0.7) 0%, rgba(141,154,139,0.3) 100%)`,
                    transition: "height 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.3s",
                    boxShadow: isToday ? `0 0 12px rgba(184,168,212,0.5)` : "none",
                  }} />
                  {isToday && (
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#B8A8D4", boxShadow: "0 0 6px rgba(184,168,212,0.8)" }} />
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 6, padding: "0 8px", marginTop: 4 }}>
            {["一","二","三","四","五","六","日"].map((d, i) => (
              <span key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: i === 6 ? HEALING_COLORS.grayGreen : HEALING_COLORS.textMuted, fontWeight: i === 6 ? 600 : 400 }}>{d}</span>
            ))}
          </div>
        </div>

        {sports.length === 0 ? (
          <EmptyState emoji="🏃" text="还没有运动记录，开始你的第一次吧" />
        ) : (
          /* ===== 运动记录列表 ===== */
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sports.map((s, i) => (
              <div key={s.id}
                style={{
                  position: "relative", display: "flex", alignItems: "center", gap: 14,
                  padding: "16px 18px 16px 16px", borderRadius: 16,
                  background: hoveredCard === s.id ? "#F0EFED" : "#F8F8F8",
                  boxShadow: hoveredCard === s.id
                    ? `0 8px 28px rgba(0,0,0,0.1), 0 0 0 1px ${HEALING_COLORS.woodBorder}`
                    : `0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)`,
                  transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                  animation: `sport-card-in 0.4s ease ${0.3 + i * 0.06}s both`,
                  cursor: "default",
                }}
                onMouseEnter={() => setHoveredCard(s.id)}
                onMouseLeave={() => setHoveredCard(null)}>

                {/* 编辑按钮 */}
                <button onClick={e => { e.stopPropagation(); verifyAdmin(() => setEditing(s)); }}
                  style={{ position: "absolute", top: 8, left: 8, width: 20, height: 20, border: "none", borderRadius: "50%", background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.3)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: _IS_TOUCH ? 0.55 : (hoveredCard === s.id ? 1 : 0), transition: "opacity 0.2s" }}>✎</button>

                {/* 删除按钮 */}
                <button onClick={() => verifyAdmin(() => setDeleting(s.id))}
                  style={{ position: "absolute", top: 8, right: 8, width: 20, height: 20, border: "none", borderRadius: "50%", background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.3)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: _IS_TOUCH ? 0.55 : (hoveredCard === s.id ? 1 : 0), transition: "opacity 0.2s" }}>×</button>

                {/* 左侧图标 */}
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${HEALING_COLORS.grayGreen}22, ${HEALING_COLORS.grayGreen}11)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                </div>

                {/* 中间内容 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                    <p style={{ fontFamily: "Noto Serif SC, serif", fontSize: 15, fontWeight: 600, color: HEALING_COLORS.text, margin: 0, lineHeight: 1.3 }}>{s.name}</p>
                    <span style={{ fontSize: 10, color: HEALING_COLORS.textMuted, whiteSpace: "nowrap", flexShrink: 0 }}>{s.date} · {s.time}</span>
                  </div>
                  {s.note && (
                    <p style={{ fontFamily: "Noto Serif SC, serif", fontSize: 12, color: "#666", margin: 0, fontStyle: "italic", lineHeight: 1.7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>"{s.note}"</p>
                  )}
                </div>

                {/* 右侧情绪图标 */}
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${HEALING_COLORS.grayGreen}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>
                  {inferEmotion(s.note)}
                </div>
              </div>
            ))}
          </div>
        )}
        {deleting && <ConfirmDialog message="确定要删除这条运动记录吗？" onConfirm={() => handleDelete(deleting)} onCancel={() => setDeleting(null)} />}
      </ModalOverlay>
      {showUpload && (
        <UploadModal moduleType="sport" onSubmit={(data, _files) => {
          const newSport: Sport = {
            id: genId(), icon: data.icon?.split(" ")[0] || "🏃",
            name: data.name || "运动", date: data.date || new Date().toISOString().slice(0, 10),
            time: data.time || "", note: data.note || "",
          };
          const updated = [newSport, ...sports];
          setSports(updated); saveData(LS_KEYS.sports, updated);
          setShowUpload(false); onUpload();
        }} onClose={() => setShowUpload(false)} />
      )}
      {editing && (
        <UploadModal moduleType="sport" title="编辑运动记录"
          initialData={{ icon: editing.icon + " " + editing.name.split(" ")[0], name: editing.name, date: editing.date, time: editing.time, note: editing.note }}
          initialFiles={{}}
          onSubmit={handleEditSubmit}
          onClose={() => setEditing(null)} />
      )}
    </>
  );
};

/* ====== 冥想模块 ====== */
const MeditationModal: React.FC<{ onClose: () => void; onUpload: () => void; verifyAdmin: (cb: () => void) => void }> = ({ onClose, onUpload, verifyAdmin }) => {
  const [meditations, setMeditations] = useState<Meditation[]>(() => loadData<Meditation>(LS_KEYS.meditations, MOCK_MEDITATIONS));
  const [playing, setPlaying] = useState(false);
  const [p, setP] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editing, setEditing] = useState<Meditation | null>(null);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => {
        setP(v => {
          if (v >= 100) {
            if (timer.current) clearInterval(timer.current);
            setPlaying(false);
            return 0;
          }
          return v + 1;
        });
      }, 500);
    } else {
      if (timer.current) clearInterval(timer.current);
    }
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [playing]);

  const handleDelete = (id: string) => {
    const updated = meditations.filter(m => m.id !== id);
    setMeditations(updated); saveData(LS_KEYS.meditations, updated);
    setDeleting(null);
  };

  const handleEditSubmit = (data: Record<string, string>, _files: Record<string, string[]>) => {
    if (!editing) return;
    const updated = meditations.map(m => m.id === editing.id ? {
      ...m,
      theme: data.theme || m.theme,
      duration: data.duration || m.duration,
      date: data.date || m.date,
      insight: data.insight || m.insight,
    } : m);
    setMeditations(updated);
    saveData(LS_KEYS.meditations, updated);
    setEditing(null);
    onUpload();
  };

  return (
    <>
      <ModalOverlay onClose={onClose} showFab fabOnClick={() => setShowUpload(true)}>
        <button style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, border: "none", borderRadius: "50%", background: "rgba(0,0,0,0.06)", color: "#888", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>×</button>
        <h3 style={{ fontFamily: "Noto Serif SC, serif", fontSize: 20, fontWeight: 600, color: "#4a4038", margin: "0 0 20px", textAlign: "center", letterSpacing: "0.04em" }}>🧘 我的冥想日记</h3>
        <div style={{ padding: "20px", borderRadius: 16, background: "rgba(122,154,130,0.08)", textAlign: "center", marginBottom: 20 }}>
          <p style={{ fontFamily: "Noto Serif SC, serif", fontSize: 16, color: "#4a4038", margin: "0 0 8px" }}>正念呼引导</p>
          <p style={{ fontSize: 13, color: "#8a7a6a", margin: "0 0 16px" }}>15分钟 · 此刻可开始</p>
          <div style={{ height: 4, background: "rgba(0,0,0,0.06)", borderRadius: 2, marginBottom: 12 }}>
            <div style={{ height: "100%", width: `${p}%`, background: "#6a8a6a", borderRadius: 2, transition: "width 0.5s" }} />
          </div>
          <button onClick={() => setPlaying(!playing)} style={{ padding: "10px 28px", border: "none", borderRadius: 999, background: "#6a8a6a", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
            {playing ? "⏸ 暂停" : "▶ 开始冥想"}
          </button>
        </div>
        {meditations.length === 0 ? (
          <EmptyState emoji="🧘" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {meditations.map(m => (
              <div key={m.id} style={{ position: "relative", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.6)", borderLeft: "3px solid #6a8a6a" }}>
                <button onClick={e => { e.stopPropagation(); verifyAdmin(() => setEditing(m)); }} style={{ position: "absolute", top: 8, left: 8, width: 18, height: 18, border: "none", borderRadius: "50%", background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.3)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: _IS_TOUCH ? 0.55 : 0, transition: "opacity 0.2s", zIndex: 2 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = _IS_TOUCH ? "0.55" : "0"; }}>✎</button>
                <button onClick={() => verifyAdmin(() => setDeleting(m.id))} style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, border: "none", borderRadius: "50%", background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.3)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: _IS_TOUCH ? 0.55 : 0, transition: "opacity 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = _IS_TOUCH ? "0.55" : "0"; }}>×</button>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#4a4038", margin: 0 }}>{m.theme}</p>
                  <span style={{ fontSize: 11, color: "#b0a090" }}>{m.duration} · {m.date}</span>
                </div>
                <p style={{ fontSize: 12, color: "#7a7268", margin: 0, fontStyle: "italic", lineHeight: 1.6 }}>"{m.insight}"</p>
              </div>
            ))}
          </div>
        )}
        {deleting && <ConfirmDialog message="确定要删除这条冥想记录吗？" onConfirm={() => handleDelete(deleting)} onCancel={() => setDeleting(null)} />}
      </ModalOverlay>
      {showUpload && (
        <UploadModal moduleType="meditation" onSubmit={(data, _files) => {
          const newMed: Meditation = {
            id: genId(), theme: data.theme || "正念呼吸", duration: data.duration || "15分钟",
            date: data.date || new Date().toISOString().slice(0, 10), insight: data.insight || "",
          };
          const updated = [newMed, ...meditations];
          setMeditations(updated); saveData(LS_KEYS.meditations, updated);
          setShowUpload(false); onUpload();
        }} onClose={() => setShowUpload(false)} />
      )}
      {editing && (
        <UploadModal moduleType="meditation" title="编辑冥想记录"
          initialData={{ theme: editing.theme, duration: editing.duration, date: editing.date, insight: editing.insight }}
          initialFiles={{}}
          onSubmit={handleEditSubmit}
          onClose={() => setEditing(null)} />
      )}
    </>
  );
};

/* ====== 追剧模块 ====== */
const DramaModal: React.FC<{ onClose: () => void; onUpload: () => void; verifyAdmin: (cb: () => void) => void }> = ({ onClose, onUpload, verifyAdmin }) => {
  const [dramas, setDramas] = useState<Drama[]>(() => loadData<Drama>(LS_KEYS.dramas, MOCK_DRAMAS));
  const [selected, setSelected] = useState<Drama | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editing, setEditing] = useState<Drama | null>(null);

  const handleDelete = (id: string) => {
    const updated = dramas.filter(d => d.id !== id);
    setDramas(updated); saveData(LS_KEYS.dramas, updated);
    setDeleting(null);
  };

  const handleEditSubmit = (data: Record<string, string>, files: Record<string, string[]>) => {
    if (!editing) return;
    const updated = dramas.map(d => d.id === editing.id ? {
      ...d,
      title: data.title || d.title,
      season: data.season || d.season,
      date: data.date || d.date,
      cover: files["cover"]?.[0] || d.cover,
      quote: data.quote || d.quote,
    } : d);
    setDramas(updated);
    saveData(LS_KEYS.dramas, updated);
    setEditing(null);
    onUpload();
  };

  return (
    <>
      <ModalOverlay onClose={onClose} showFab fabOnClick={() => setShowUpload(true)}>
        <button style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, border: "none", borderRadius: "50%", background: "rgba(0,0,0,0.06)", color: "#888", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>×</button>
        <h3 style={{ fontFamily: "Noto Serif SC, serif", fontSize: 20, fontWeight: 600, color: "#4a4038", margin: "0 0 20px", textAlign: "center", letterSpacing: "0.04em" }}>📺 我的追剧记录</h3>
        {selected ? (
          <div style={{ textAlign: "center", animation: "lfm-fadein 0.3s" }}>
            <img src={selected.cover} alt={selected.title} style={{ width: 200, height: 260, objectFit: "cover", borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", margin: "0 auto 16px" }} />
            <h4 style={{ fontFamily: "Noto Serif SC, serif", fontSize: 18, color: "#4a4038", margin: "0 0 4px" }}>{selected.title}</h4>
            <p style={{ fontSize: 12, color: "#b0a090", margin: "0 0 12px" }}>{selected.season} · {selected.date}</p>
            <blockquote style={{ fontFamily: "Noto Serif SC, serif", fontSize: 14, color: "#6a8a6a", borderLeft: "3px solid #6a8a6a", paddingLeft: 12, margin: "0 0 16px", fontStyle: "italic" }}>"{selected.quote}"</blockquote>
            <button onClick={() => setSelected(null)} style={{ padding: "8px 20px", border: "1.5px solid #6a8a6a", borderRadius: 999, background: "transparent", color: "#6a8a6a", cursor: "pointer", fontSize: 13 }}>← 返回列表</button>
          </div>
        ) : dramas.length === 0 ? (
          <EmptyState emoji="📺" />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {dramas.map(d => (
              <div key={d.id} style={{ position: "relative", cursor: "pointer", borderRadius: 10, overflow: "hidden", background: "rgba(0,0,0,0.04)", transition: "transform 0.2s" }}
                onClick={() => setSelected(d)}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
                <button onClick={e => { e.stopPropagation(); verifyAdmin(() => setEditing(d)); }} style={{ position: "absolute", top: 6, left: 6, width: 22, height: 22, border: "none", borderRadius: "50%", background: "rgba(0,0,0,0.25)", color: "rgba(255,255,255,0.85)", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, opacity: _IS_TOUCH ? 0.55 : 0, transition: "opacity 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = _IS_TOUCH ? "0.55" : "0"; }}>✎</button>
                <button onClick={e => { e.stopPropagation(); verifyAdmin(() => setDeleting(d.id)); }} style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, border: "none", borderRadius: "50%", background: "rgba(0,0,0,0.25)", color: "rgba(255,255,255,0.85)", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, opacity: _IS_TOUCH ? 0.55 : 0, transition: "opacity 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = _IS_TOUCH ? "0.55" : "0"; }}>×</button>
                <img src={d.cover} alt={d.title} style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
                <div style={{ padding: "10px 12px" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#4a4038", margin: "0 0 2px" }}>{d.title}</p>
                  <p style={{ fontSize: 11, color: "#b0a090", margin: 0 }}>{d.season} · {d.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {deleting && <ConfirmDialog message="确定要删除这条追剧记录吗？" onConfirm={() => handleDelete(deleting)} onCancel={() => setDeleting(null)} />}
      </ModalOverlay>
      {showUpload && (
        <UploadModal moduleType="drama" onSubmit={(data, files) => {
          const newDrama: Drama = {
            id: genId(), title: data.title, season: data.season || "",
            date: data.date || "", cover: files["cover"]?.[0] || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=400&fit=crop",
            quote: data.quote || "",
          };
          const updated = [newDrama, ...dramas];
          setDramas(updated); saveData(LS_KEYS.dramas, updated);
          setShowUpload(false); onUpload();
        }} onClose={() => setShowUpload(false)} />
      )}
      {editing && (
        <UploadModal moduleType="drama" title="编辑追剧记录"
          initialData={{ title: editing.title, season: editing.season, date: editing.date, quote: editing.quote }}
          initialFiles={{ cover: [editing.cover] }}
          onSubmit={handleEditSubmit}
          onClose={() => setEditing(null)} />
      )}
    </>
  );
};

/* ====== 自定义模块弹窗 ====== */
const CustomModuleModal: React.FC<{
  moduleDef: CustomModuleDef;
  onClose: () => void;
  onUpload: () => void;
  verifyAdmin: (cb: () => void) => void;
}> = ({ moduleDef, onClose, onUpload, verifyAdmin }) => {
  const [records, setRecords] = useState<CustomModuleRecord[]>(() => loadCustomRecords(moduleDef.id));
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CustomModuleRecord | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const openAddForm = () => {
    setTitle(""); setContent(""); setDate("");
    setEditingRecord(null);
    setShowForm(true);
  };

  const openEditForm = (r: CustomModuleRecord) => {
    setTitle(r.title);
    setContent(r.content);
    setDate(r.date);
    setEditingRecord(r);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    if (editingRecord) {
      // 编辑模式
      const updated = records.map(r => r.id === editingRecord.id ? {
        ...r,
        title: title.trim(),
        content: content.trim(),
        date: date.trim() || r.date,
      } : r);
      setRecords(updated);
      saveCustomRecords(moduleDef.id, updated);
    } else {
      // 新增模式
      const newRecord: CustomModuleRecord = {
        id: genId(),
        title: title.trim(),
        content: content.trim(),
        date: date.trim() || new Date().toISOString().slice(0, 10),
      };
      const updated = [newRecord, ...records];
      setRecords(updated);
      saveCustomRecords(moduleDef.id, updated);
    }
    setTitle(""); setContent(""); setDate("");
    setShowForm(false);
    setEditingRecord(null);
    onUpload();
  };

  const handleDelete = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    saveCustomRecords(moduleDef.id, updated);
    setDeleting(null);
  };

  return (
    <ModalOverlay onClose={onClose} showFab fabOnClick={openAddForm}>
      <button style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, border: "none", borderRadius: "50%", background: "rgba(0,0,0,0.06)", color: "#888", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>×</button>
      <h3 style={{ fontFamily: "Noto Serif SC, serif", fontSize: 20, fontWeight: 600, color: "#4a4038", margin: "0 0 20px", textAlign: "center", letterSpacing: "0.04em" }}>{moduleDef.emoji} {moduleDef.name}</h3>

      {records.length === 0 ? (
        <EmptyState emoji={moduleDef.emoji} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {records.map(r => (
            <div key={r.id} style={{ position: "relative", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.6)", borderLeft: `3px solid ${moduleDef.tint}` }}>
              <button onClick={() => verifyAdmin(() => openEditForm(r))} style={{ position: "absolute", top: 8, left: 8, width: 18, height: 18, border: "none", borderRadius: "50%", background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.3)", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: _IS_TOUCH ? 0.55 : 0, transition: "opacity 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = _IS_TOUCH ? "0.55" : "0"; }}>✎</button>
              <button onClick={() => verifyAdmin(() => setDeleting(r.id))} style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, border: "none", borderRadius: "50%", background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.3)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: _IS_TOUCH ? 0.55 : 0, transition: "opacity 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = _IS_TOUCH ? "0.55" : "0"; }}>×</button>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#4a4038", margin: 0 }}>{r.title}</p>
                <span style={{ fontSize: 11, color: "#b0a090" }}>{r.date}</span>
              </div>
              {r.content && <p style={{ fontSize: 12, color: "#7a7268", margin: 0, lineHeight: 1.6 }}>{r.content}</p>}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)" }} onClick={() => { setShowForm(false); setEditingRecord(null); }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, width: "90%", maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <h4 style={{ fontFamily: "Noto Serif SC, serif", fontSize: 16, margin: "0 0 16px", color: "#4a4038" }}>{editingRecord ? "编辑记录" : "新增记录"}</h4>
            <input placeholder="标题" value={title} onChange={e => setTitle(e.target.value)} style={{ width: "100%", padding: "10px 12px", marginBottom: 10, border: "1px solid #e0ddd5", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            <textarea placeholder="内容（可选）" value={content} onChange={e => setContent(e.target.value)} rows={3} style={{ width: "100%", padding: "10px 12px", marginBottom: 10, border: "1px solid #e0ddd5", borderRadius: 8, fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
            <input placeholder="日期（可选）" type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: "100%", padding: "10px 12px", marginBottom: 16, border: "1px solid #e0ddd5", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setShowForm(false); setEditingRecord(null); }} style={{ flex: 1, padding: "10px 0", border: "1.5px solid #e0ddd5", borderRadius: 999, background: "transparent", color: "#8a7a6a", cursor: "pointer" }}>取消</button>
              <button onClick={handleSave} style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 999, background: "#6a8a6a", color: "#fff", cursor: "pointer" }}>{editingRecord ? "保存" : "添加"}</button>
            </div>
          </div>
        </div>
      )}
      {deleting && <ConfirmDialog message="确定要删除这条记录吗？" onConfirm={() => handleDelete(deleting)} onCancel={() => setDeleting(null)} />}
    </ModalOverlay>
  );
};

/* ====== 添加/编辑自定义模块弹窗 ====== */
const AddCustomModuleModal: React.FC<{ onClose: () => void; onAdd: (m: CustomModuleDef) => void; editModule?: CustomModuleDef | null }> = ({ onClose, onAdd, editModule }) => {
  const isEdit = !!editModule;
  const [emoji, setEmoji] = useState(editModule?.emoji || "📝");
  const [name, setName] = useState(editModule?.name || "");
  const [tint, setTint] = useState(editModule?.tint || "#DDD0B8");

  const TINT_OPTIONS = ["#DDD0B8", "#C8D8C0", "#DCC8C0", "#D8C8A8", "#C0D0CC", "#D0C8C0", "#E8D8C8", "#C8D0D8"];

  const handleSubmit = () => {
    if (!name.trim()) return;
    const mod: CustomModuleDef = {
      id: editModule?.id || `custom_${Date.now()}`,
      emoji: emoji.trim() || "📝",
      name: name.trim(),
      tint,
    };
    onAdd(mod);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 250, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "90%", maxWidth: 360, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
        <h4 style={{ fontFamily: "Noto Serif SC, serif", fontSize: 18, margin: "0 0 20px", color: "#4a4038", textAlign: "center" }}>{isEdit ? "编辑模块" : "新增模块"}</h4>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: "#8a7a6a", display: "block", marginBottom: 6 }}>图标</label>
          <input value={emoji} onChange={e => setEmoji(e.target.value)} style={{ width: "100%", padding: "10px 12px", border: "1px solid #e0ddd5", borderRadius: 8, fontSize: 16, textAlign: "center", outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: "#8a7a6a", display: "block", marginBottom: 6 }}>名称 *</label>
          <input placeholder="如：旅行、手账、咖啡…" value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: "10px 12px", border: "1px solid #e0ddd5", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#8a7a6a", display: "block", marginBottom: 6 }}>主题色</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {TINT_OPTIONS.map(c => (
              <button key={c} onClick={() => setTint(c)} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: tint === c ? "2px solid #4a4038" : "2px solid transparent", cursor: "pointer" }} />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px 0", border: "1.5px solid #e0ddd5", borderRadius: 999, background: "transparent", color: "#8a7a6a", cursor: "pointer" }}>取消</button>
          <button onClick={handleSubmit} disabled={!name.trim()} style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 999, background: name.trim() ? "#6a8a6a" : "#ccc", color: "#fff", cursor: name.trim() ? "pointer" : "not-allowed" }}>{isEdit ? "保存" : "创建"}</button>
        </div>
      </div>
    </div>
  );
};

/* ====== 胶片帧数据 ====== */
const BUILTIN_FRAMES = [
  { id: "reading" as ModuleType, emoji: "📖", name: "阅读", tint: "#DDD0B8" },
  { id: "photo" as ModuleType, emoji: "📷", name: "摄影", tint: "#C8D8C0" },
  { id: "music" as ModuleType, emoji: "🎧", name: "音乐/播客", tint: "#DCC8C0" },
  { id: "sport" as ModuleType, emoji: "🏃", name: "运动", tint: "#D8C8A8" },
  { id: "meditation" as ModuleType, emoji: "🧘", name: "冥想", tint: "#C0D0CC" },
  { id: "drama" as ModuleType, emoji: "📺", name: "追剧", tint: "#D0C8C0" },
];

/* ====== 拖拽胶片条 ====== */
interface FilmStripProps {
  onOpen: (m: ModuleType) => void;
  customModules: CustomModuleDef[];
  onAddModule: () => void;
  isAdmin?: boolean;
  onEditModule?: (m: CustomModuleDef) => void;
  onDeleteModule?: (m: CustomModuleDef) => void;
}
const FilmStrip: React.FC<FilmStripProps> = ({ onOpen, customModules, onAddModule, isAdmin, onEditModule, onDeleteModule }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tx, setTx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startTX = useRef(0);
  const frameW = 130; const gap = 8;

  const allFrames = [
    ...BUILTIN_FRAMES,
    ...customModules.map(m => ({ id: m.id as ModuleType, emoji: m.emoji, name: m.name, tint: m.tint })),
    { id: "__add__" as ModuleType, emoji: "+", name: "新增", tint: "#E8E0D5" },
  ];
  const totalW = allFrames.length * (frameW + gap) + gap;
  const [containerW, setContainerW] = useState(680);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerW(entry.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const minTX = Math.min(0, -(totalW - containerW));

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const snap = (v: number) => Math.round(v / (frameW + gap)) * (frameW + gap);

  useEffect(() => {
    if (!dragging) return;
    const onMM = (e: MouseEvent) => {
      const next = clamp(startTX.current + e.clientX - startX.current, minTX, 0);
      setTx(next);
      if (trackRef.current) { trackRef.current.style.transition = "none"; trackRef.current.style.transform = `translateX(${next}px)`; }
    };
    const onMU = (e: MouseEvent) => {
      setDragging(false);
      const next = clamp(snap(clamp(startTX.current + e.clientX - startX.current, minTX, 0)), minTX, 0);
      setTx(next);
      if (trackRef.current) { trackRef.current.style.transition = "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)"; trackRef.current.style.transform = `translateX(${next}px)`; }
    };
    window.addEventListener("mousemove", onMM); window.addEventListener("mouseup", onMU);
    return () => { window.removeEventListener("mousemove", onMM); window.removeEventListener("mouseup", onMU); };
  }, [dragging, minTX]);

  const onMouseDown = (e: React.MouseEvent) => { setDragging(true); startX.current = e.clientX; startTX.current = tx; };
  const onTouchStart = (e: React.TouchEvent) => { setDragging(true); startX.current = e.touches[0].clientX; startTX.current = tx; };

  useEffect(() => {
    if (!dragging) return;
    const onTM = (e: TouchEvent) => { e.preventDefault(); const next = clamp(startTX.current + e.touches[0].clientX - startX.current, minTX, 0); setTx(next); if (trackRef.current) { trackRef.current.style.transition = "none"; trackRef.current.style.transform = `translateX(${next}px)`; } };
    const onTU = () => { setDragging(false); const next = clamp(snap(tx), minTX, 0); setTx(next); if (trackRef.current) { trackRef.current.style.transition = "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)"; trackRef.current.style.transform = `translateX(${next}px)`; } };
    window.addEventListener("touchmove", onTM, { passive: false }); window.addEventListener("touchend", onTU);
    return () => { window.removeEventListener("touchmove", onTM); window.removeEventListener("touchend", onTU); };
  }, [dragging, tx, minTX]);

  const scrollBy = (dir: "left" | "right") => {
    const next = clamp(tx + (dir === "right" ? -(frameW + gap) : (frameW + gap)), minTX, 0);
    setTx(next);
    if (trackRef.current) { trackRef.current.style.transition = "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)"; trackRef.current.style.transform = `translateX(${next}px)`; }
  };

  return (
    <>
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ position: "relative", width: 74, height: 74, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #f8f4ec, #e8dcc8 60%, #d8c8b0)", boxShadow: "0 4px 12px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[0,1,2,3,4].map(i => <div key={i} style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(-50%,-50%)`, width: `${74 - i * 13}px`, height: `${74 - i * 13}px`, borderRadius: "50%", border: "1px solid rgba(180,160,120,0.25)" }} />)}
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#8a7a6a", position: "relative", zIndex: 1 }} />
        </div>
        <div style={{ fontSize: 7, letterSpacing: "0.15em", color: "#b0a090", textTransform: "uppercase" }}>KODAK 200</div>
      </div>
      <div ref={wrapRef} style={{ flex: 1, overflow: "hidden", padding: "8px 0", cursor: dragging ? "grabbing" : "grab" }}>
        <div ref={trackRef} onMouseDown={onMouseDown} onTouchStart={onTouchStart} style={{ display: "flex", flexDirection: "column", transition: "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
          <div style={{ display: "flex", gap: 6, padding: "0 4px", marginBottom: 6 }}>
            {allFrames.map((_, i) => <span key={`t-${i}`} style={{ display: "block", flexShrink: 0, width: 10, height: 8, borderRadius: 2, background: "rgba(180,160,130,0.35)", border: "1px solid rgba(160,140,110,0.25)" }} />)}
          </div>
          <div style={{ display: "flex", gap: 8, padding: "0 4px" }}>
            {allFrames.map(f => {
              const isCustomFrame = f.id.startsWith("custom_");
              const customMod = isCustomFrame ? customModules.find(cm => cm.id === f.id) : null;
              return (
                <div key={f.id} onClick={() => f.id === "__add__" ? onAddModule() : onOpen(f.id)} style={{ position: "relative", flexShrink: 0, width: 120, height: 90, borderRadius: 12, background: f.tint, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, overflow: "hidden", cursor: "pointer", transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px) scale(1.04)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 20px rgba(0,0,0,0.14)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0) scale(1)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; }}>
                  {isAdmin && customMod && (
                    <>
                      <button onClick={e => { e.stopPropagation(); onEditModule?.(customMod); }} style={{ position: "absolute", top: 4, left: 4, width: 20, height: 20, border: "none", borderRadius: "50%", background: "rgba(0,0,0,0.18)", color: "rgba(255,255,255,0.9)", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: _IS_TOUCH ? 0.55 : 0, transition: "opacity 0.2s", zIndex: 3 }}
                        onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                        onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.opacity = _IS_TOUCH ? "0.55" : "0"; }}>✎</button>
                      <button onClick={e => { e.stopPropagation(); onDeleteModule?.(customMod); }} style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, border: "none", borderRadius: "50%", background: "rgba(0,0,0,0.18)", color: "rgba(255,255,255,0.9)", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: _IS_TOUCH ? 0.55 : 0, transition: "opacity 0.2s", zIndex: 3 }}
                        onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = "rgba(180,80,80,0.6)"; (ev.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                        onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.18)"; (ev.currentTarget as HTMLButtonElement).style.opacity = _IS_TOUCH ? "0.55" : "0"; }}>×</button>
                    </>
                  )}
                  <span style={{ fontSize: f.id === "__add__" ? 32 : 28, filter: f.id === "__add__" ? "none" : "sepia(0.08) contrast(0.95)", color: f.id === "__add__" ? "#8a7a6a" : "inherit", fontWeight: f.id === "__add__" ? 300 : "normal" }}>{f.emoji}</span>
                  <span style={{ fontSize: 12, color: "rgba(60,50,40,0.75)", fontWeight: 500, letterSpacing: "0.05em" }}>{f.name}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 6, padding: "0 4px", marginTop: 6 }}>
            {allFrames.map((_, i) => <span key={`b-${i}`} style={{ display: "block", flexShrink: 0, width: 10, height: 8, borderRadius: 2, background: "rgba(180,160,130,0.35)", border: "1px solid rgba(160,140,110,0.25)" }} />)}
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "relative", width: 74, height: 74, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #f8f4ec, #e8dcc8 60%, #d8c8b0)", boxShadow: "0 4px 12px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[0,1,2,3,4].map(i => <div key={i} style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(-50%,-50%)`, width: `${74 - i * 13}px`, height: `${74 - i * 13}px`, borderRadius: "50%", border: "1px solid rgba(180,160,120,0.25)" }} />)}
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#8a7a6a", position: "relative", zIndex: 1 }} />
        </div>
        <div style={{ width: 40, height: 45, marginTop: 8, animation: "lf3-cat-breathe 3s ease-in-out infinite" }}>
          <svg viewBox="0 0 80 60" fill="none"><ellipse cx="40" cy="45" rx="30" ry="12" fill="#e8e0d0" opacity="0.95"/><circle cx="40" cy="30" r="18" fill="#e8e0d0"/><path d="M24 18 L28 30 L36 24 Z" fill="#e8e0d0"/><path d="M56 18 L52 30 L44 24 Z" fill="#e8e0d0"/><ellipse cx="34" cy="28" rx="4" ry="3" fill="#4a5a3a" opacity="0.7"/><ellipse cx="46" cy="28" rx="4" ry="3" fill="#4a5a3a" opacity="0.7"/><circle cx="33" cy="27" r="1.5" fill="#fff" opacity="0.8"/><circle cx="45" cy="27" r="1.5" fill="#fff" opacity="0.8"/><ellipse cx="40" cy="33" rx="2.5" ry="1.5" fill="#d4a0a0" opacity="0.7"/><path d="M37 36 Q40 38 43 36" stroke="#8a7a6a" strokeWidth="1" fill="none" opacity="0.5"/></svg>
        </div>
      </div>
      <button onClick={() => scrollBy("left")} style={{ position: "absolute", top: "50%", left: -16, transform: "translateY(-50%)", zIndex: 10, width: 30, height: 30, border: "1.5px solid rgba(150,130,100,0.3)", borderRadius: "50%", background: "rgba(255,252,244,0.88)", color: "#8a7a6a", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>‹</button>
      <button onClick={() => scrollBy("right")} style={{ position: "absolute", top: "50%", right: -16, transform: "translateY(-50%)", zIndex: 10, width: 30, height: 30, border: "1.5px solid rgba(150,130,100,0.3)", borderRadius: "50%", background: "rgba(255,252,244,0.88)", color: "#8a7a6a", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>›</button>
      <style>{`@keyframes lf3-cat-breathe { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }`}</style>
    </>
  );
};

/* ====== 主组件 ====== */
const LifeFilmPage: React.FC = () => {
  const navigate = useNavigate();
  const [volume, setVolume] = useState(1);
  const [openModule, setOpenModule] = useState<ModuleType>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [customModules, setCustomModules] = useState<CustomModuleDef[]>(() => loadCustomModules());
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [activeCustomModule, setActiveCustomModule] = useState<CustomModuleDef | null>(null);
  const [editingModule, setEditingModule] = useState<CustomModuleDef | null>(null);
  const [deletingModule, setDeletingModule] = useState<CustomModuleDef | null>(null);
  const { isAdmin: adminMode, verifyAdmin, AdminGuardUI } = useAdminGuard();

  useEffect(() => {
    const t = setTimeout(() => {
      try { const ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.frequency.value = 320; g.gain.value = 0.06; o.start(); o.stop(ctx.currentTime + 0.4); } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const openModuleRef = useRef<ModuleType>(null);
  openModuleRef.current = openModule;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { if (openModuleRef.current) setOpenModule(null); else navigate("/"); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const handleClose = () => { setOpenModule(null); };

  const toggleMute = () => setVolume(v => v === 0 ? 1 : 0);

  const showToast = (msg: string) => { setToast(msg); };

  const isBuiltin = (m: ModuleType): m is Exclude<BuiltinModuleType, null> =>
    m !== null && !m.startsWith("custom_") && m !== "__add__";

  const isCustom = (m: ModuleType): m is `custom_${string}` =>
    m !== null && m.startsWith("custom_");

  const handleOpenModule = (m: ModuleType) => {
    if (m === "__add__") {
      setShowAddCustom(true);
      return;
    }
    if (isCustom(m)) {
      const found = customModules.find(cm => cm.id === m);
      if (found) setActiveCustomModule(found);
      return;
    }
    setOpenModule(m);
  };

  const handleAddCustomModule = (mod: CustomModuleDef) => {
    const idx = customModules.findIndex(m => m.id === mod.id);
    if (idx >= 0) {
      // 编辑模式
      const updated = [...customModules];
      updated[idx] = mod;
      setCustomModules(updated);
      saveCustomModules(updated);
    } else {
      // 新增模式
      const updated = [...customModules, mod];
      setCustomModules(updated);
      saveCustomModules(updated);
    }
  };

  const handleDeleteCustomModule = (mod: CustomModuleDef) => {
    const updated = customModules.filter(m => m.id !== mod.id);
    setCustomModules(updated);
    saveCustomModules(updated);
    setDeletingModule(null);
  };

  const MODALS: Record<BuiltinModuleType, React.FC<{ onClose: () => void; onUpload: () => void; verifyAdmin: (cb: () => void) => void }>> = {
    reading: ReadingModal, photo: PhotoModal, music: MusicModal,
    sport: SportModal, meditation: MeditationModal, drama: DramaModal,
  };
  const ActiveModal = openModule && isBuiltin(openModule) ? MODALS[openModule] : null;

  /* 页面加载时同步远程最新数据 */
  useEffect(() => {
    let cancelled = false;
    fetchSiteData().then((remote) => {
      if (cancelled || !remote) return;
      // 将远程数据写入本地 key，确保 Modal 初始化时读取到最新内容
      Object.values(LS_KEYS).forEach((k) => {
        if (remote[k] !== undefined) {
          localStorage.setItem(k, JSON.stringify(remote[k]));
        }
        // 清理旧的 draft key，避免残留
        localStorage.removeItem(`draft_${k}`);
      });
      setCustomModules(loadCustomModules());
    });
    return () => { cancelled = true; };
  }, []);

  /* 管理员 */
  const handlePublish = async () => {
    // 先把当前本地数据复制到 draft key，确保 publishDrafts 能正确合并
    Object.values(LS_KEYS).forEach((k) => {
      const data = localStorage.getItem(k);
      if (data !== null) {
        localStorage.setItem(`draft_${k}`, data);
      }
    });
    // 自定义模块也要处理
    const customMods = localStorage.getItem(LS_KEYS.customModules);
    if (customMods !== null) {
      localStorage.setItem(`draft_${LS_KEYS.customModules}`, customMods);
    }

    const res = publishDrafts();
    if (res.success) {
      const pushed = await pushSiteData("ling");
      if (pushed) {
        alert(
          res.merged.length > 0
            ? `发布成功，访客将看到最新内容（已同步 ${res.merged.length} 项）`
            : "发布成功，访客将看到最新内容"
        );
      } else {
        alert("本地草稿已合并，但远程同步失败，请检查网络后重试");
      }
    } else {
      alert("发布失败，请确认管理员权限");
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* 背景 */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "linear-gradient(160deg, #F5EFE0 0%, #EDE4CC 40%, #E8DCC4 70%, #E0D4BC 100%)" }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", backgroundImage: "/healing-forest.jpg", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.1, filter: "blur(10px) saturate(0.6)" }} />

      {/* 关闭 */}
      <button onClick={() => navigate("/")} style={{ position: "fixed", top: 20, right: 24, zIndex: 20, width: 42, height: 42, border: "none", borderRadius: "50%", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)", boxShadow: "0 4px 16px -4px rgba(0,0,0,0.1)", color: "#7a6a5a", cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.25s ease, color 0.25s ease" }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "rotate(90deg)"; (e.currentTarget as HTMLButtonElement).style.color = "#c4877a"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "rotate(0deg)"; (e.currentTarget as HTMLButtonElement).style.color = "#7a6a5a"; }}>×</button>
      <button onClick={toggleMute} style={{ position: "fixed", top: 72, right: 24, zIndex: 20, width: 36, height: 36, border: "none", borderRadius: "50%", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{volume === 0 ? "🔇" : "🔊"}</button>

      {/* 树枝 */}
      <svg style={{ position: "fixed", top: 20, left: 0, width: 100, height: 140, zIndex: 2, pointerEvents: "none" }} viewBox="0 0 100 140" fill="none">
        <path d="M10 140 Q20 110 25 90 Q30 70 35 55 Q40 40 45 30" stroke="#9aaa8a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.45"/>
        <path d="M25 90 Q15 75 12 65" stroke="#9aaa8a" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35"/>
        <circle cx="12" cy="62" r="3.5" fill="#aab898" opacity="0.5"/>
        <circle cx="18" cy="72" r="2.5" fill="#aab898" opacity="0.4"/>
        <circle cx="35" cy="55" r="3" fill="#aab898" opacity="0.5"/>
        <path d="M35 55 Q45 45 52 42" stroke="#9aaa8a" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35"/>
        <circle cx="52" cy="40" r="3.5" fill="#aab898" opacity="0.5"/>
        <circle cx="45" cy="30" r="2.5" fill="#aab898" opacity="0.4"/>
      </svg>

      {/* 主内容 */}
      <div style={{ position: "relative", zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", gap: 28, width: "100%", maxWidth: 900, padding: "60px 24px 40px" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "Noto Serif SC, Georgia, serif", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, color: "#4a4a3a", margin: "0 0 16px", letterSpacing: "0.08em" }}>生活放映中 🎞</h1>
          <div style={{ fontFamily: "Noto Serif SC, Georgia, serif", lineHeight: 1.7 }}>
            {["如果把人生比作一整卷胶片：", "前六卷都在寻找光，却忘了自己是光。", "现在，终于轮到第七卷登场啦！", "这里装着我私藏的六个快乐碎片。", "别客气，随便点开看看——", "是我为自己预留的补光时刻。✨"].map((line, i) => (
              <p key={i} style={{ fontSize: 13.5, color: "#7a6a5a", margin: 0, letterSpacing: "0.02em" }}>{line}</p>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%", maxWidth: 760 }}>
          <FilmStrip onOpen={handleOpenModule} customModules={customModules} onAddModule={() => verifyAdmin(() => setShowAddCustom(true))} isAdmin={adminMode} onEditModule={(m) => verifyAdmin(() => setEditingModule(m))} onDeleteModule={(m) => verifyAdmin(() => setDeletingModule(m))} />
        </div>
        <p style={{ fontSize: 12, color: "rgba(120,110,100,0.5)", margin: 0, letterSpacing: "0.06em" }}>← 点击模块探索内容 · 拖动胶卷滚动 →</p>
      </div>

      {ActiveModal && <ActiveModal onClose={handleClose} onUpload={() => showToast("已记录这一刻 ✨")} verifyAdmin={verifyAdmin} />}
      {activeCustomModule && (
        <CustomModuleModal
          moduleDef={activeCustomModule}
          onClose={() => setActiveCustomModule(null)}
          onUpload={() => showToast("已记录这一刻 ✨")}
          verifyAdmin={verifyAdmin}
        />
      )}
      {showAddCustom && (
        <AddCustomModuleModal
          onClose={() => { setShowAddCustom(false); setEditingModule(null); }}
          onAdd={handleAddCustomModule}
        />
      )}
      {editingModule && (
        <AddCustomModuleModal
          onClose={() => setEditingModule(null)}
          onAdd={handleAddCustomModule}
          editModule={editingModule}
        />
      )}
      {deletingModule && <ConfirmDialog message={`确定要删除模块「${deletingModule.name}」吗？模块内的记录也将被清除。`} onConfirm={() => handleDeleteCustomModule(deletingModule)} onCancel={() => setDeletingModule(null)} />}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}



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
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(141,154,139,0.5)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = adminMode ? "rgba(141,154,139,0.3)" : "rgba(255,255,255,0.5)"; }}
      >
        {adminMode ? "⚙" : "🔒"}
      </button>

      {/* 管理员发布/退出按钮（编辑模式可见） */}
      {adminMode && (
        <div style={{ position: "fixed", bottom: 28, right: 88, zIndex: 20, display: "flex", gap: 8 }}>
          <button onClick={handlePublish} style={{ padding: "8px 16px", fontSize: 12, border: "none", borderRadius: 999, background: "#8D9A8B", color: "#fff", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            发布草稿
          </button>
        </div>
      )}

      {/* 管理员密码框 */}
      <AdminGuardUI />

      <style>{`
        @media (max-width: 600px) {
          .lf3-content { padding: 40px 12px 32px !important; gap: 20px !important; }
          .lf3-film-wrap { max-width: 100% !important; }
          .lf-action-btn { width: 32px !important; height: 32px !important; font-size: 15px !important; min-width: 32px; min-height: 32px; }
          .lf-tabs-wrap { overflow-x: auto !important; -webkit-overflow-scrolling: touch !important; scrollbar-width: none !important; -ms-overflow-style: none !important; }
          .lf-tabs-wrap::-webkit-scrollbar { display: none !important; }
          .lf-module-card { min-width: 90px !important; }
          .lf-add-module-btn { display: flex !important; visibility: visible !important; opacity: 1 !important; min-width: 90px !important; }
        }
      `}</style>
    </div>
  );
};

export default LifeFilmPage;
