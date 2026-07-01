import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * 时光博物馆 · Museum of Memories
 *
 * 个人作品集压轴篇章 —— 双展厅回忆录。
 * 展厅一「时代回响」：复古报纸风格卡片 + CRUD 操作。
 * 展厅二「荣耀之路」：垂直时间轴 + 高光时刻 + 展开复盘 + CRUD。
 * 复古胶片风：深褐底、暗金边框、尘埃飘落、胶片显影。
 */

/* ============================================================
   localStorage 工具
   ============================================================ */
const LS_KEYS = {
  bgms: "museum_bgms",
  tvs: "museum_tvs",
  nets: "museum_nets",
  honors: "museum_honors",
} as const;

function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadData<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function saveData<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/* ============================================================
   数据类型
   ============================================================ */
interface VintageCard {
  id: string;
  year: string;
  title: string;
  description: string;
}

interface HonorItem {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl: string;
  reflection?: string;
  emoji?: string;
}

/* ============================================================
   默认数据
   ============================================================ */
const DEFAULT_BGMS: VintageCard[] = [
  { id: "bgm-2002", year: "2002", title: "刀郎《2002年的第一场雪》", description: "当年大街小巷都在放的歌，是刻在 DNA 里的旋律。" },
  { id: "bgm-2003", year: "2003", title: "周杰伦《稻香》", description: `前奏的蟋蟀声一响，就仿佛回到了那个无忧无虑的夏天，相信"回家吧，回到最初的美好"。` },
  { id: "bgm-2004", year: "2004", title: "S.H.E《中国话》", description: `"全世界都在学中国话"，这首歌的旋律一响，三个女孩的身影就浮现在眼前。` },
  { id: "bgm-2005", year: "2005", title: "王心凌《那年夏天宁静的海》", description: "甜心教主的歌，总是伴随着偶像剧里又傻又可爱的画面，唱进很多人的心里。" },
  { id: "bgm-2006", year: "2006", title: "孙燕姿《我怀念的》", description: "每次听到，都会有不一样的感悟，是争吵后想要爱你的冲动，还是无话不说的从前？" },
  { id: "bgm-2007", year: "2007", title: "梁静茹《崇拜》", description: `经典的"梁式情歌"，打动了多少年轻女孩的心，纯粹又悲伤。` },
  { id: "bgm-2008", year: "2008", title: "五月天《倔强》", description: `"我和我最后的倔强，握紧双手绝对不放"，是青春里最热血的口号。` },
  { id: "bgm-2011", year: "2011", title: "陈奕迅《十年》", description: "一首歌的时间，仿佛经历了一场漫长的告别，教会我们成长。" },
];

const DEFAULT_TVS: VintageCard[] = [
  { id: "tv-1999", year: "1999", title: "《还珠格格》（重播巅峰）", description: `每年寒暑假的必备经典，小燕子的古灵精怪和"当"的歌声，是几代人的共同记忆。` },
  { id: "tv-2005a", year: "2005", title: "《武林外传》", description: "同福客栈里的点点滴滴，让我们在欢笑中懂得了江湖与人生。" },
  { id: "tv-2005b", year: "2005", title: "《仙剑奇侠传》", description: "李逍遥和赵灵儿的仙侠梦，配上《杀破狼》和《六月的雨》，是无数人的意难平。" },
  { id: "tv-2005c", year: "2005", title: "《恶作剧之吻》", description: "袁湘琴和江直树的故事，让每个女孩都幻想过自己的白马王子。" },
  { id: "tv-2014", year: "2014", title: "《来自星星的你》", description: `引爆全民追剧热潮的韩剧，都敏俊和千颂伊让"我好像爱上你了"成了流行语。` },
  { id: "tv-2005d", year: "2005", title: "《家有儿女》", description: "刘星、夏雪、夏雨一家的欢乐日常，是童年最温暖的背景音。" },
];

const DEFAULT_NETS: VintageCard[] = [
  { id: "net-1", year: "2005-2009", title: "QQ 空间与火星文", description: `每天精心挑选的 QQ 秀、非主流的伤感头像和满屏的火星文，是我们最初在网络上构建的"另一个世界"。` },
  { id: "net-2", year: "2004-2008", title: "Flash 小游戏", description: `办公室里偷偷玩的"黄金矿工"、"森林冰火人"，还有后来风靡全球的"愤怒的小鸟"和"地铁跑酷"，是青春里最摸鱼的黑历史。` },
  { id: "net-3", year: "2009-2012", title: "贴吧与论坛", description: `为了追星，在贴吧里疯狂刷帖，看同人文，分享资源，是第一批"网友"聚集地。` },
];

const DEFAULT_HONORS: HonorItem[] = [
  { id: "honor-1", year: "2021", title: "优秀学生奖学金", description: "连续两学期专业前 5%，是对自律最好的回报。", imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop", reflection: "努力不会被辜负，它只是在等一个合适的时机开花。" },
  { id: "honor-2", year: "2023", title: "首个马拉松完赛", description: "42.195 公里，是对意志力的极限测试。", imageUrl: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&h=600&fit=crop", reflection: "慢一点也没关系，只要不停下。" },
  { id: "honor-3", year: "2024", title: "AI 产品实习 Offer", description: "从软件工程转向 AI 产品，跨出的这一步，走对了。", imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop", reflection: "所有的弯路，都是为了让你在正路上走得更稳。" },
];

/* ============================================================
   工具常量
   ============================================================ */
const GOLD = "#b08d57";
const VINTAGE_BROWN = "#8B6B4F";
const VINTAGE_CREAM = "#FDF8F0";
const VINTAGE_TEXT = "#3D2C22";
const VINTAGE_TEXT_LIGHT = "#6B5A4A";

/* ============================================================
   确认对话框组件
   ============================================================ */
const ConfirmDialog: React.FC<{
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ message, onConfirm, onCancel }) => (
  <motion.div
    style={{
      position: "fixed", inset: 0, zIndex: 300,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(20,12,10,0.8)", backdropFilter: "blur(6px)",
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onCancel}
  >
    <motion.div
      style={{
        background: "#f5edd6", border: `1px solid ${GOLD}`, borderRadius: 12,
        padding: "28px 32px", maxWidth: 360, width: "90%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      onClick={e => e.stopPropagation()}
    >
      <p style={{ fontFamily: "Noto Serif SC, serif", fontSize: 15, color: VINTAGE_TEXT, margin: "0 0 24px", lineHeight: 1.7, textAlign: "center" }}>{message}</p>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onCancel} style={{ flex: 1, padding: "10px 16px", border: "1px solid rgba(176,141,87,0.4)", borderRadius: 8, background: "transparent", color: VINTAGE_TEXT_LIGHT, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(176,141,87,0.1)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>取消</button>
        <button onClick={onConfirm} style={{ flex: 1, padding: "10px 16px", border: "none", borderRadius: 8, background: "#c0392b", color: "#fff", fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#a93226"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#c0392b"; }}>确认删除</button>
      </div>
    </motion.div>
  </motion.div>
);

/* ============================================================
   上传/编辑模态框组件
   ============================================================ */
interface CardFormData {
  year: string;
  title: string;
  description: string;
}

interface HonorFormData {
  year: string;
  title: string;
  description: string;
  imageUrl: string;
  reflection: string;
}

const CardFormModal: React.FC<{
  mode: "add" | "edit";
  initialData?: VintageCard;
  onSubmit: (data: CardFormData) => void;
  onClose: () => void;
  sectionTitle: string;
}> = ({ mode, initialData, onSubmit, onClose, sectionTitle }) => {
  const [year, setYear] = useState(initialData?.year || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const canSubmit = year.trim() && title.trim() && description.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ year: year.trim(), title: title.trim(), description: description.trim() });
  };

  return (
    <motion.div
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(20,12,10,0.85)", backdropFilter: "blur(8px)",
        padding: 24,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        style={{
          background: "linear-gradient(135deg, #FDF8F0 0%, #F5ECD8 100%)",
          border: `1px solid ${VINTAGE_BROWN}80`,
          borderRadius: 12,
          padding: "32px 28px",
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
        }}
        initial={{ scale: 0.9, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 24 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "Noto Serif SC, serif", fontSize: 18, fontWeight: 600, color: VINTAGE_TEXT, margin: 0 }}>
            {mode === "add" ? "✏️ 添加记录" : "✏️ 编辑记录"}
          </h3>
          <span style={{ fontSize: 12, color: VINTAGE_TEXT_LIGHT, opacity: 0.7 }}>{sectionTitle}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: VINTAGE_TEXT_LIGHT, marginBottom: 6, fontFamily: "Noto Serif SC, serif" }}>📅 年份</label>
            <input
              type="text"
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder="例如：2005 或 2005-2010"
              style={{ width: "100%", padding: "12px 14px", border: `1px solid ${VINTAGE_BROWN}40`, borderRadius: 8, background: "#fffef8", fontSize: 14, color: VINTAGE_TEXT, outline: "none", fontFamily: "Courier New, monospace", transition: "border-color 0.2s" }}
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = VINTAGE_BROWN; }}
              onBlur={e => { (e.target as HTMLInputElement).style.borderColor = `${VINTAGE_BROWN}40`; }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, color: VINTAGE_TEXT_LIGHT, marginBottom: 6, fontFamily: "Noto Serif SC, serif" }}>📌 标题</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="例如：周杰伦《晴天》"
              style={{ width: "100%", padding: "12px 14px", border: `1px solid ${VINTAGE_BROWN}40`, borderRadius: 8, background: "#fffef8", fontSize: 14, color: VINTAGE_TEXT, outline: "none", fontFamily: "Noto Serif SC, serif", transition: "border-color 0.2s" }}
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = VINTAGE_BROWN; }}
              onBlur={e => { (e.target as HTMLInputElement).style.borderColor = `${VINTAGE_BROWN}40`; }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, color: VINTAGE_TEXT_LIGHT, marginBottom: 6, fontFamily: "Noto Serif SC, serif" }}>💬 文案描述</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="写下你的回忆..."
              rows={4}
              style={{ width: "100%", padding: "12px 14px", border: `1px solid ${VINTAGE_BROWN}40`, borderRadius: 8, background: "#fffef8", fontSize: 14, color: VINTAGE_TEXT, outline: "none", fontFamily: "Noto Serif SC, serif", lineHeight: 1.8, resize: "vertical", transition: "border-color 0.2s" }}
              onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = VINTAGE_BROWN; }}
              onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = `${VINTAGE_BROWN}40`; }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px 16px", border: `1px solid ${VINTAGE_BROWN}40`, borderRadius: 8, background: "transparent", color: VINTAGE_TEXT_LIGHT, fontSize: 14, cursor: "pointer", transition: "all 0.2s", fontFamily: "Noto Serif SC, serif" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${VINTAGE_BROWN}15`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>取消</button>
          <button onClick={handleSubmit} disabled={!canSubmit} style={{ flex: 1, padding: "12px 16px", border: "none", borderRadius: 8, background: canSubmit ? VINTAGE_BROWN : `${VINTAGE_BROWN}50`, color: "#fff", fontSize: 14, cursor: canSubmit ? "pointer" : "not-allowed", transition: "all 0.2s", fontFamily: "Noto Serif SC, serif" }}
            onMouseEnter={e => { if (canSubmit) (e.currentTarget as HTMLButtonElement).style.background = "#7a5c3f"; }}
            onMouseLeave={e => { if (canSubmit) (e.currentTarget as HTMLButtonElement).style.background = VINTAGE_BROWN; }}>{mode === "add" ? "添加" : "保存"}</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ============================================================
   荣耀之路编辑模态框
   ============================================================ */
const HonorFormModal: React.FC<{
  mode: "add" | "edit";
  initialData?: HonorItem;
  onSubmit: (data: HonorFormData) => void;
  onClose: () => void;
}> = ({ mode, initialData, onSubmit, onClose }) => {
  const [year, setYear] = useState(initialData?.year || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [reflection, setReflection] = useState(initialData?.reflection || "");

  const canSubmit = year.trim() && title.trim() && description.trim() && imageUrl.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      year: year.trim(),
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      reflection: reflection.trim(),
    });
  };

  return (
    <motion.div
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(20,12,10,0.85)", backdropFilter: "blur(8px)",
        padding: 24,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        style={{
          background: "#f5edd6",
          border: `1px solid ${GOLD}`,
          borderRadius: 12,
          padding: "32px 28px",
          maxWidth: 520,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}
        initial={{ scale: 0.9, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 24 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ fontFamily: "Playfair Display, Noto Serif SC, serif", fontSize: 20, fontWeight: 700, color: "#3d2c2e", margin: "0 0 24px" }}>
          {mode === "add" ? "🏆 添加荣耀时刻" : "🏆 编辑荣耀时刻"}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#8a7a64", marginBottom: 6, fontFamily: "Courier New, monospace", letterSpacing: "0.05em" }}>年份</label>
              <input type="text" value={year} onChange={e => setYear(e.target.value)} placeholder="2024"
                style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(176,141,87,0.4)", borderRadius: 6, background: "#fffef8", fontSize: 14, color: "#3d2c2e", outline: "none", fontFamily: "Courier New, monospace" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#8a7a64", marginBottom: 6, fontFamily: "Noto Serif SC, serif" }}>🏆 成就名称</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="首个马拉松完赛"
                style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(176,141,87,0.4)", borderRadius: 6, background: "#fffef8", fontSize: 14, color: "#3d2c2e", outline: "none", fontFamily: "Noto Serif SC, serif" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, color: "#8a7a64", marginBottom: 6, fontFamily: "Noto Serif SC, serif" }}>📝 成就描述</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="描述这段经历..."
              rows={3} style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(176,141,87,0.4)", borderRadius: 6, background: "#fffef8", fontSize: 14, color: "#3d2c2e", outline: "none", fontFamily: "Noto Serif SC, serif", lineHeight: 1.8, resize: "vertical" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, color: "#8a7a64", marginBottom: 6, fontFamily: "Noto Serif SC, serif" }}>🖼️ 图片链接</label>
            <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..."
              style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(176,141,87,0.4)", borderRadius: 6, background: "#fffef8", fontSize: 14, color: "#3d2c2e", outline: "none", fontFamily: "monospace" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, color: "#8a7a64", marginBottom: 6, fontFamily: "Noto Serif SC, serif" }}>💭 感悟反思（选填）</label>
            <textarea value={reflection} onChange={e => setReflection(e.target.value)} placeholder="写下你的感悟..."
              rows={2} style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(176,141,87,0.4)", borderRadius: 6, background: "#fffef8", fontSize: 14, color: "#3d2c2e", outline: "none", fontFamily: "Noto Serif SC, serif", lineHeight: 1.8, resize: "vertical", fontStyle: "italic" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px 16px", border: "1px solid rgba(176,141,87,0.4)", borderRadius: 8, background: "transparent", color: "#6b5a4a", fontSize: 14, cursor: "pointer", fontFamily: "Noto Serif SC, serif" }}>取消</button>
          <button onClick={handleSubmit} disabled={!canSubmit} style={{ flex: 1, padding: "11px 16px", border: "none", borderRadius: 8, background: canSubmit ? GOLD : "rgba(176,141,87,0.4)", color: "#fff", fontSize: 14, cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "Noto Serif SC, serif" }}>{mode === "add" ? "添加" : "保存"}</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ============================================================
   复古报纸卡片组件（带编辑/删除）
   ============================================================ */
const VintageCard: React.FC<{
  card: VintageCard;
  emoji: string;
  onEdit: (card: VintageCard) => void;
  onDelete: (id: string) => void;
}> = ({ card, emoji, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      className="vintage-card"
      style={{ position: "relative" }}
      whileHover={{ y: -4, rotate: 0.5 }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
    >
      {/* 年份邮票标签 */}
      <div className="vintage-year-stamp">{card.year}</div>

      {/* 操作按钮 */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: "absolute", top: 8, right: 8, zIndex: 10,
              display: "flex", gap: 6,
            }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(card); }}
              style={{
                width: 28, height: 28, border: "none", borderRadius: "50%",
                background: `${VINTAGE_BROWN}cc`, color: "#fff", fontSize: 13,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
              title="编辑"
            >✏️</button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
              style={{
                width: 28, height: 28, border: "none", borderRadius: "50%",
                background: "#c0392bcc", color: "#fff", fontSize: 13,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
              title="删除"
            >🗑️</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 内容区 */}
      <div className="vintage-card-content">
        <div className="vintage-card-icon">{emoji}</div>
        <div className="vintage-card-body">
          <h4 className="vintage-card-title">{card.title}</h4>
          <p className="vintage-card-desc">"{card.description}"</p>
        </div>
      </div>
    </motion.div>
  );
};

/* ============================================================
   横向滑动长廊组件（支持增删改）
   ============================================================ */
const VintageGallery: React.FC<{
  title: string;
  emoji: string;
  cards: VintageCard[];
  onAdd: (data: CardFormData) => void;
  onEdit: (card: VintageCard) => void;
  onDelete: (id: string) => void;
}> = ({ title, emoji, cards, onAdd, onEdit, onDelete }) => (
  <div className="vintage-section">
    <div className="vintage-section-header">
      <span className="vintage-section-emoji">{emoji}</span>
      <h3 className="vintage-section-title">{title}</h3>
      <button
        onClick={() => onAdd({ year: "", title: "", description: "" })}
        style={{
          marginLeft: "auto", padding: "6px 14px", border: `1px dashed ${VINTAGE_BROWN}60`,
          borderRadius: 20, background: "transparent", color: VINTAGE_BROWN,
          fontSize: 12, cursor: "pointer", fontFamily: "Noto Serif SC, serif",
          transition: "all 0.2s", display: "flex", alignItems: "center", gap: 4,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = `${VINTAGE_BROWN}15`;
          (e.currentTarget as HTMLButtonElement).style.borderStyle = "solid";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          (e.currentTarget as HTMLButtonElement).style.borderStyle = "dashed";
        }}
      >+ 添加</button>
    </div>
    <div className="vintage-gallery-scroll">
      <div className="vintage-gallery-track">
        {cards.map(card => (
          <VintageCard key={card.id} card={card} emoji={emoji} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   子组件：尘埃粒子
   ============================================================ */
const DustParticles: React.FC = () => {
  const dusts = useMemo(
    () =>
      Array.from({ length: 18 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: Math.random() * 10 + 14,
        size: Math.random() * 3 + 1.5,
        drift: (Math.random() - 0.5) * 60,
      })),
    []
  );

  return (
    <div className="museum-dust-layer" aria-hidden="true">
      {dusts.map((d, i) => (
        <motion.span
          key={i}
          className="museum-dust"
          style={{ left: `${d.left}%`, width: d.size, height: d.size }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: "110vh", opacity: [0, 0.6, 0.6, 0], x: d.drift }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

/* ============================================================
   子组件：胶片显影图片
   ============================================================ */
const FilmImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={className ? `museum-film-wrap ${className}` : "museum-film-wrap"}>
      {!loaded && <div className="museum-film-placeholder" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="museum-film-img"
        style={{
          opacity: loaded ? 1 : 0,
          filter: loaded ? "blur(0px)" : "blur(14px)",
          transition: "opacity 1.2s ease, filter 1.2s ease",
        }}
      />
    </div>
  );
};

/* ============================================================
   悬浮添加按钮 (FAB)
   ============================================================ */
const FAB: React.FC<{ onClick: () => void; label: string }> = ({ onClick, label }) => (
  <motion.button
    onClick={onClick}
    style={{
      position: "fixed", bottom: 32, right: 32, zIndex: 100,
      width: 56, height: 56, borderRadius: "50%", border: "none",
      background: `linear-gradient(135deg, ${GOLD} 0%, #c9a66b 100%)`,
      color: "#fff", fontSize: 24, cursor: "pointer",
      boxShadow: "0 6px 24px rgba(176,141,87,0.4), 0 2px 8px rgba(0,0,0,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    title={label}
  >
    +
  </motion.button>
);

/* ============================================================
   主组件
   ============================================================ */
const MuseumPage: React.FC = () => {
  // 状态管理
  const [bgms, setBgms] = useState<VintageCard[]>(() => loadData(LS_KEYS.bgms, DEFAULT_BGMS));
  const [tvs, setTvs] = useState<VintageCard[]>(() => loadData(LS_KEYS.tvs, DEFAULT_TVS));
  const [nets, setNets] = useState<VintageCard[]>(() => loadData(LS_KEYS.nets, DEFAULT_NETS));
  const [honors, setHonors] = useState<HonorItem[]>(() => loadData(LS_KEYS.honors, DEFAULT_HONORS));

  // 模态框状态
  const [cardModal, setCardModal] = useState<{ mode: "add" | "edit"; section: "bgm" | "tv" | "net"; data?: VintageCard } | null>(null);
  const [honorModal, setHonorModal] = useState<{ mode: "add" | "edit"; data?: HonorItem } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: "card"; id: string; section: "bgm" | "tv" | "net" } | { type: "honor"; id: string } | null>(null);

  // 持久化
  useEffect(() => { saveData(LS_KEYS.bgms, bgms); }, [bgms]);
  useEffect(() => { saveData(LS_KEYS.tvs, tvs); }, [tvs]);
  useEffect(() => { saveData(LS_KEYS.nets, nets); }, [nets]);
  useEffect(() => { saveData(LS_KEYS.honors, honors); }, [honors]);

  // 锁定背景滚动
  useEffect(() => {
    if (cardModal || honorModal || deleteConfirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [cardModal, honorModal, deleteConfirm]);

  // CRUD 操作 - 卡片
  const handleCardSubmit = (data: CardFormData) => {
    if (!cardModal) return;
    const { section, mode, data: editData } = cardModal;

    if (mode === "add") {
      const newCard: VintageCard = { id: genId(), ...data };
      if (section === "bgm") setBgms(prev => [newCard, ...prev]);
      else if (section === "tv") setTvs(prev => [newCard, ...prev]);
      else setNets(prev => [newCard, ...prev]);
    } else if (mode === "edit" && editData) {
      const updated = { ...editData, ...data };
      if (section === "bgm") setBgms(prev => prev.map(c => c.id === updated.id ? updated : c));
      else if (section === "tv") setTvs(prev => prev.map(c => c.id === updated.id ? updated : c));
      else setNets(prev => prev.map(c => c.id === updated.id ? updated : c));
    }
    setCardModal(null);
  };

  const handleCardDelete = (id: string, section: "bgm" | "tv" | "net") => {
    setDeleteConfirm({ type: "card", id, section });
  };

  const confirmCardDelete = () => {
    if (!deleteConfirm || deleteConfirm.type !== "card") return;
    const { id, section } = deleteConfirm;
    if (section === "bgm") setBgms(prev => prev.filter(c => c.id !== id));
    else if (section === "tv") setTvs(prev => prev.filter(c => c.id !== id));
    else setNets(prev => prev.filter(c => c.id !== id));
    setDeleteConfirm(null);
  };

  // CRUD 操作 - 荣耀
  const handleHonorSubmit = (data: HonorFormData) => {
    if (!honorModal) return;
    const { mode, data: editData } = honorModal;

    if (mode === "add") {
      const newHonor: HonorItem = { id: genId(), ...data };
      setHonors(prev => [...prev, newHonor]);
    } else if (mode === "edit" && editData) {
      const updated: HonorItem = { ...editData, ...data };
      setHonors(prev => prev.map(h => h.id === updated.id ? updated : h));
    }
    setHonorModal(null);
  };

  const handleHonorDelete = (id: string) => {
    setDeleteConfirm({ type: "honor", id });
  };

  const confirmHonorDelete = () => {
    if (!deleteConfirm || deleteConfirm.type !== "honor") return;
    setHonors(prev => prev.filter(h => h.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };

  // 获取 section 标题
  const getSectionTitle = (section: "bgm" | "tv" | "net") => {
    if (section === "bgm") return "🎵 耳机里的青春 BGM";
    if (section === "tv") return "📺 电视里的乌托邦";
    return "📱 网络初现时的印记";
  };

  return (
    <div className="museum-page">
      <DustParticles />

      {/* 顶部返回 */}
      <header className="museum-topbar">
        <Link to="/mickey" className="museum-back">← 回到妙妙工具箱</Link>
        <span className="museum-topbar-meta">Museum of Memories</span>
      </header>

      {/* 标题区 */}
      <section className="museum-hero">
        <motion.h1 className="museum-hero-title" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>时光博物馆</motion.h1>
        <motion.p className="museum-hero-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>每一步都算数。</motion.p>
      </section>

      {/* ===== 展厅一：时代回响 ===== */}
      <section className="museum-hall museum-era-section">
        <div className="museum-hall-head">
          <span className="museum-hall-roman">I</span>
          <div>
            <h2 className="museum-hall-title">时代回响</h2>
            <p className="museum-hall-sub">那些年，我们一起追过的流行。</p>
          </div>
        </div>

        <VintageGallery title="耳机里的青春 BGM" emoji="🎵" cards={bgms}
          onAdd={(data) => setCardModal({ mode: "add", section: "bgm", data: { id: "", ...data } })}
          onEdit={(card) => setCardModal({ mode: "edit", section: "bgm", data: card })}
          onDelete={(id) => handleCardDelete(id, "bgm")} />

        <VintageGallery title="电视里的乌托邦" emoji="📺" cards={tvs}
          onAdd={(data) => setCardModal({ mode: "add", section: "tv", data: { id: "", ...data } })}
          onEdit={(card) => setCardModal({ mode: "edit", section: "tv", data: card })}
          onDelete={(id) => handleCardDelete(id, "tv")} />

        <VintageGallery title="网络初现时的印记" emoji="📱" cards={nets}
          onAdd={(data) => setCardModal({ mode: "add", section: "net", data: { id: "", ...data } })}
          onEdit={(card) => setCardModal({ mode: "edit", section: "net", data: card })}
          onDelete={(id) => handleCardDelete(id, "net")} />
      </section>

      {/* ===== 展厅二：荣耀之路 ===== */}
      <section className="museum-hall">
        <div className="museum-hall-head">
          <span className="museum-hall-roman">II</span>
          <div>
            <h2 className="museum-hall-title">荣耀之路</h2>
            <p className="museum-hall-sub">每一步都算数。</p>
          </div>
        </div>

        {/* 垂直时间轴 */}
        <div className="museum-timeline-v">
          {honors.map((m, i) => (
            <motion.div
              key={m.id}
              className="museum-honor-row"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="museum-honor-node">
                <span className="museum-honor-dot" />
                <span className="museum-honor-year">{m.year}</span>
              </div>
              <div className="museum-honor-card" style={{ position: "relative" }}>
                {/* 编辑/删除按钮 */}
                <div style={{ position: "absolute", top: 10, right: 10, zIndex: 5, display: "flex", gap: 6, opacity: 0, transition: "opacity 0.2s" }}
                  className="honor-actions"
                >
                  <button onClick={() => setHonorModal({ mode: "edit", data: m })} style={{ width: 28, height: 28, border: "none", borderRadius: "50%", background: `${GOLD}cc`, color: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="编辑">✏️</button>
                  <button onClick={() => handleHonorDelete(m.id)} style={{ width: 28, height: 28, border: "none", borderRadius: "50%", background: "#c0392bcc", color: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="删除">🗑️</button>
                </div>
                <FilmImage src={m.imageUrl} alt={m.title} className="museum-honor-img" />
                <div className="museum-honor-body">
                  <h3 className="museum-card-title">{m.title}</h3>
                  <p className="museum-card-desc">{m.description}</p>
                  {m.reflection && (
                    <p className="museum-honor-reflection">
                      <span className="museum-reflection-mark">"</span>{m.reflection}
                    </p>
                  )}
                  <span className="museum-card-zoom-hint">🏆 荣耀时刻</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 页脚 */}
      <footer className="museum-foot"><span>时光不语，静待花开。</span></footer>

      {/* 悬浮添加按钮 */}
      <FAB onClick={() => setHonorModal({ mode: "add" })} label="添加荣耀时刻" />

      {/* 模态框 */}
      <AnimatePresence>
        {cardModal && (
          <CardFormModal
            mode={cardModal.mode}
            initialData={cardModal.data}
            onSubmit={handleCardSubmit}
            onClose={() => setCardModal(null)}
            sectionTitle={getSectionTitle(cardModal.section)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {honorModal && (
          <HonorFormModal
            mode={honorModal.mode}
            initialData={honorModal.data}
            onSubmit={handleHonorSubmit}
            onClose={() => setHonorModal(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <ConfirmDialog
            message="确定要删除这条记录吗？删除后可在刷新前撤销。"
            onConfirm={() => {
              if (deleteConfirm.type === "card") confirmCardDelete();
              else confirmHonorDelete();
            }}
            onCancel={() => setDeleteConfirm(null)}
          />
        )}
      </AnimatePresence>

      <style>{`
        .museum-page,
        .museum-page * { cursor: auto; }
        .museum-page a,
        .museum-page button,
        .museum-page .museum-card-collection,
        .museum-page .museum-honor-card { cursor: pointer; }

        .museum-page { position: relative; min-height: 100vh; overflow: hidden; color: #e8dcc8; background: radial-gradient(120% 80% at 50% 0%, #4a3a2e 0%, #3d2c2e 45%, #2a1f20 100%); font-family: "Courier New", "Noto Sans SC", monospace; padding: 0 24px 120px; }

        /* 尘埃粒子 */
        .museum-dust-layer { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .museum-dust { position: absolute; top: 0; border-radius: 50%; background: ${GOLD}; opacity: 0; }

        /* 顶部 */
        .museum-topbar { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; max-width: 960px; margin: 0 auto; padding: 26px 4px 0; }
        .museum-back { font-size: 14px; color: #a89580; text-decoration: none; letter-spacing: 0.04em; transition: color 0.25s ease, transform 0.25s ease; }
        .museum-back:hover { color: ${GOLD}; transform: translateX(-3px); }
        .museum-topbar-meta { font-size: 11px; color: #6b5a4a; letter-spacing: 0.28em; text-transform: uppercase; }

        /* 标题区 */
        .museum-hero { position: relative; z-index: 2; max-width: 960px; margin: 0 auto; padding: 56px 4px 48px; text-align: center; }
        .museum-hero-title { font-family: "Playfair Display", "Noto Serif SC", Georgia, serif; font-size: clamp(34px, 5.5vw, 54px); font-weight: 700; color: ${GOLD}; margin: 0 0 14px; letter-spacing: 0.06em; text-shadow: 0 0 30px rgba(176,141,87,0.3); }
        .museum-hero-sub { font-size: 16px; color: #b8a890; margin: 0; letter-spacing: 0.12em; font-style: italic; }

        /* 展厅 */
        .museum-hall { position: relative; z-index: 2; max-width: 960px; margin: 0 auto 72px; }
        .museum-hall-head { display: flex; align-items: center; gap: 18px; margin-bottom: 36px; padding-bottom: 18px; border-bottom: 1px solid rgba(176,141,87,0.25); }
        .museum-hall-roman { font-family: "Playfair Display", Georgia, serif; font-size: 38px; font-weight: 700; color: ${GOLD}; opacity: 0.7; line-height: 1; }
        .museum-hall-title { font-family: "Playfair Display", "Noto Serif SC", Georgia, serif; font-size: 26px; font-weight: 700; color: ${GOLD}; margin: 0 0 4px; }
        .museum-hall-sub { font-size: 13px; color: #9a8a78; margin: 0; font-style: italic; }

        /* ====== 复古报纸风格 ====== */
        .museum-era-section { background: none; }

        .vintage-section { margin-bottom: 48px; }
        .vintage-section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px dashed rgba(139,109,79,0.4); }
        .vintage-section-emoji { font-size: 24px; filter: grayscale(0.3); }
        .vintage-section-title { font-family: "Noto Serif SC", Georgia, serif; font-size: 18px; font-weight: 600; color: ${VINTAGE_BROWN}; margin: 0; letter-spacing: 0.08em; }

        /* 横向滑动 */
        .vintage-gallery-scroll { overflow-x: auto; padding-bottom: 16px; scrollbar-width: thin; scrollbar-color: ${VINTAGE_BROWN} transparent; }
        .vintage-gallery-scroll::-webkit-scrollbar { height: 6px; }
        .vintage-gallery-scroll::-webkit-scrollbar-thumb { background: rgba(139,109,79,0.4); border-radius: 3px; }
        .vintage-gallery-track { display: flex; gap: 20px; padding: 8px 4px; }

        /* 复古卡片 */
        .vintage-card { position: relative; flex-shrink: 0; width: 320px; background: linear-gradient(135deg, ${VINTAGE_CREAM} 0%, #F5ECD8 50%, #EDE4D0 100%); border: 1px solid rgba(139,109,79,0.5); border-radius: 4px; padding: 0; box-shadow: 0 8px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6); overflow: hidden; transition: all 0.3s ease; }

        .vintage-year-stamp { position: absolute; top: 12px; left: 12px; z-index: 2; padding: 4px 12px 4px 14px; background: ${VINTAGE_BROWN}; color: ${VINTAGE_CREAM}; font-family: "Courier New", monospace; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; border-radius: 2px; box-shadow: 2px 2px 0 rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.1); transform: rotate(-3deg); }
        .vintage-year-stamp::before, .vintage-year-stamp::after { content: ""; position: absolute; width: 6px; height: 6px; background: #F5ECD8; border-radius: 50%; top: 50%; transform: translateY(-50%); }
        .vintage-year-stamp::before { left: -3px; }
        .vintage-year-stamp::after { right: -3px; }

        .vintage-card-content { padding: 52px 20px 20px; display: flex; flex-direction: column; gap: 14px; }
        .vintage-card-icon { font-size: 36px; text-align: center; filter: grayscale(0.2); opacity: 0.85; }
        .vintage-card-body { border-top: 1px solid rgba(139,109,79,0.25); padding-top: 14px; }
        .vintage-card-title { font-family: "Noto Serif SC", Georgia, serif; font-size: 16px; font-weight: 700; color: ${VINTAGE_TEXT}; margin: 0 0 10px; line-height: 1.4; letter-spacing: 0.02em; }
        .vintage-card-desc { font-family: "Noto Serif SC", Georgia, serif; font-size: 13px; line-height: 1.85; color: ${VINTAGE_TEXT_LIGHT}; margin: 0; font-style: italic; text-align: justify; }

        /* 荣耀卡片悬停显示操作 */
        .museum-honor-card:hover .honor-actions { opacity: 1 !important; }

        /* 垂直时间轴 */
        .museum-timeline-v { position: relative; padding-left: 8px; }
        .museum-timeline-v::before { content: ""; position: absolute; left: 21px; top: 8px; bottom: 8px; width: 2px; background: linear-gradient(to bottom, ${GOLD}, rgba(176,141,87,0.2)); }
        .museum-honor-row { position: relative; display: flex; gap: 28px; margin-bottom: 36px; }
        .museum-honor-node { flex-shrink: 0; width: 44px; display: flex; flex-direction: column; align-items: center; padding-top: 18px; z-index: 1; }
        .museum-honor-dot { width: 14px; height: 14px; border-radius: 50%; background: ${GOLD}; border: 3px solid #3d2c2e; box-shadow: 0 0 12px rgba(176,141,87,0.6); }
        .museum-honor-year { margin-top: 8px; font-family: "Courier New", monospace; font-size: 12px; font-weight: 700; color: ${GOLD}; }
        .museum-honor-card { position: relative; flex: 1; display: flex; gap: 20px; background: #f5edd6; border: 1px solid rgba(176,141,87,0.5); border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px -12px rgba(0,0,0,0.6); transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .museum-honor-card:hover { transform: translateX(6px); box-shadow: 0 18px 40px -12px rgba(0,0,0,0.7), 0 0 0 1px ${GOLD}; }
        .museum-honor-img { width: 160px; flex-shrink: 0; height: auto; }
        .museum-honor-img .museum-film-img { height: 100%; min-height: 140px; }
        .museum-honor-body { padding: 18px 20px; flex: 1; }
        .museum-card-title { font-family: "Playfair Display", "Noto Serif SC", Georgia, serif; font-size: 16px; font-weight: 700; color: #3d2c2e; margin: 0 0 6px; }
        .museum-card-desc { font-size: 12px; line-height: 1.7; color: #6b5a4a; margin: 0; }
        .museum-honor-reflection { margin: 10px 0 0; padding-left: 14px; border-left: 2px solid ${GOLD}; font-size: 13px; line-height: 1.8; color: #8a6a4a; font-style: italic; }
        .museum-reflection-mark { font-family: "Playfair Display", Georgia, serif; font-size: 22px; color: ${GOLD}; margin-right: 2px; line-height: 0; }
        .museum-card-zoom-hint { position: absolute; bottom: 10px; right: 10px; z-index: 2; font-size: 11px; color: #8a7a64; opacity: 0; transition: opacity 0.3s ease; }
        .museum-honor-card:hover .museum-card-zoom-hint { opacity: 0.9; }

        /* 胶片显影 */
        .museum-film-wrap { position: relative; overflow: hidden; background: #2a1f20; }
        .museum-film-placeholder { position: absolute; inset: 0; background: linear-gradient(110deg, #2a1f20 30%, #3d2c2e 50%, #2a1f20 70%); background-size: 200% 100%; animation: museum-shimmer 1.5s infinite; }
        @keyframes museum-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .museum-film-img { display: block; width: 100%; height: 100%; object-fit: cover; }

        /* 页脚 */
        .museum-foot { position: relative; z-index: 2; max-width: 960px; margin: 0 auto; padding-top: 32px; text-align: center; font-size: 13px; color: #6b5a4a; font-style: italic; letter-spacing: 0.08em; }

        /* 移动端 */
        @media (max-width: 640px) {
          .vintage-card { width: 280px; }
          .vintage-section-header { gap: 10px; }
          .vintage-section-title { font-size: 16px; }
          .vintage-card-icon { font-size: 28px; }
          .museum-honor-card { flex-direction: column; }
          .museum-honor-img { width: 100%; height: 160px; }
          .museum-honor-img .museum-film-img { min-height: 160px; }
        }
      `}</style>
    </div>
  );
};

export default MuseumPage;
