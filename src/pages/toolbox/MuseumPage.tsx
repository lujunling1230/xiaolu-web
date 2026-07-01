import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * 时光博物馆 · Museum of Memories
 *
 * 个人作品集压轴篇章 —— 双展厅回忆录。
 * 展厅一「时代回响」：复古报纸风格卡片 + CRUD 操作。
 * 展厅二「荣耀之路」：垂直时间轴 + 高光时刻 + 展开复盘 + CRUD。
 * 复古胶片风：深褐底，暗金边框、尘埃飘落、胶片显影。
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
  musicLink?: string;
  imageUrl?: string; // 图片 Base64/URL
}

interface HonorItem {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl: string;
  reflection?: string;
}

/* ============================================================
   默认数据
   ============================================================ */
const DEFAULT_BGMS: VintageCard[] = [
  { id: "bgm-2002", year: "2002", title: "刀郎《2002年的第一场雪》", description: "当年大街小巷都在放的歌，是刻在 DNA 里的旋律。", imageUrl: "/images/bgm-2002-daolang.jpg" },
  { id: "bgm-2003", year: "2003", title: "周杰伦《稻香》", description: `前奏的蟋蟀声一响，就仿佛回到了那个无忧无虑的夏天，相信"回家吧，回到最初的美好"。`, imageUrl: "/images/bgm-2003-jay.jpg" },
  { id: "bgm-2004", year: "2004", title: "S.H.E《中国话》", description: `"全世界都在学中国话"，这首歌的旋律一响，三个女孩的身影就浮现在眼前。` },
  { id: "bgm-2005", year: "2005", title: "王心凌《那年夏天宁静的海》", description: "甜心教主的歌，总是伴随着偶像剧里又傻又可爱的画面，唱进很多人的心里。" },
  { id: "bgm-2006a", year: "2006", title: "孙燕姿《我怀念的》", description: "每次听到，都会有不一样的感悟，是争吵后想要爱你的冲动，还是无话不说的从前？", imageUrl: "/images/bgm-2006-stefanie.jpg" },
  { id: "bgm-2006b", year: "2006", title: "沈建祥《形容》", description: "像是那灰色天空中的小雨，下下停停，不动声色淋湿土地。有些情绪不必言说，全在眼神与长发里，那是青春最细腻的注脚。" },
  { id: "bgm-2007", year: "2007", title: "梁静茹《崇拜》", description: `经典的"梁式情歌"，打动了多少年轻女孩的心，纯粹又悲伤。` },
  { id: "bgm-2008", year: "2008", title: "五月天《倔强》", description: `"我和我最后的倔强，握紧双手绝对不放"，是青春里最热血的口号。` },
  { id: "bgm-2011a", year: "2011", title: "陈奕迅《十年》", description: "一首歌的时间，仿佛经历了一场漫长的告别，教会我们成长。" },
  { id: "bgm-2011b", year: "2011", title: "林宥嘉《想自由》", description: "就像被困住的野兽，在摩天大楼里渴求自由。一路嗅着追着美梦，哪怕跌得再重，也不觉得痛，只觉得空。" },
  { id: "bgm-2015", year: "2015", title: "陈楚生《那个远方》", description: "萦绕着发烫的梦想，就奋不顾身撑起手掌。那个叫做流浪的远方，到不了也念念不忘，是青春里最倔强的冲锋号。" },
  { id: "bgm-2022", year: "2022", title: "吴宇恒《失重旅行》", description: "关掉无用的思考，摆脱手机的烦扰。在月光与微风中摇啊摇，这是一场没有重力、也没有束缚的都市夜游。" },
];

const DEFAULT_TVS: VintageCard[] = [
  { id: "tv-1999", year: "1999", title: "《还珠格格》（重播巅峰）", description: `每年寒暑假的必备经典，小燕子的古灵精怪和"当"的歌声，是几代人的共同记忆。`, imageUrl: "/images/tv-1999-huanzhugege.jpg" },
  { id: "tv-2005a", year: "2005", title: "《家有儿女》", description: "刘星、夏雪、夏雨一家的欢乐日常，是童年最温暖的背景音。" },
  { id: "tv-2005b", year: "2005", title: "《仙剑奇侠传》", description: "李逍遥和赵灵儿的仙侠梦，配上《杀破狼》和《六月的雨》，是无数人的意难平。" },
  { id: "tv-2005c", year: "2005", title: "《恶作剧之吻》", description: "袁湘琴和江直树的故事，让每个女孩都幻想过自己的白马王子。" },
  { id: "tv-2006", year: "2006", title: "《武林外传》", description: "同福客栈的屋顶，藏着江湖最柔软的角落。一群不靠谱的人，说着最扎心的话，成了我们青春里最治愈的避风港。" },
  { id: "tv-2010", year: "2010", title: "《新三国演义》", description: "烽火连天的不仅是赤壁的火，还有那些英雄辈出的梦。桃园结义的酒，至今还在历史的风烟里温热。" },
  { id: "tv-2013", year: "2013", title: "《咱们结婚吧》", description: "大龄未婚的焦虑，被一碗热汤和一句'咱们结婚吧'悄悄融化。爱情或许会迟到，但绝不会缺席。" },
  { id: "tv-2014", year: "2014", title: "《来自星星的你》", description: `引爆全民追剧热潮的韩剧，都敏俊和千颂伊让"我好像爱上你了"成了流行语。` },
  { id: "tv-2016", year: "2016", title: "《欢乐颂》", description: "五个女孩，五种颜色，在城市的钢筋水泥里互相取暖。原来孤独的灵魂，也能找到共振的频率。" },
  { id: "tv-2019", year: "2019", title: "《都挺好》", description: "原生家庭的刺，扎在每个成年人心里。苏家的故事，是一面镜子，照见我们自己与亲情的复杂和解。" },
  { id: "tv-2022", year: "2022", title: "《人世间》", description: "五十年光阴流转，周家三代人的悲欢离合，就是一部中国老百姓的史诗。最平凡的烟火，往往最动人。" },
  { id: "tv-2025", year: "2025", title: "《生万物》", description: "从泥土里长出的希望，是乡村振兴最美的画卷。杨幂的转型，让我们看到了女性在时代浪潮中的坚韧与温柔。" },
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
const VINTAGE_TEXT_LIGHT = "#6B5A4A";
const VINTAGE_DEEP = "#5c4033"; // 深棕 - 标题
const VINTAGE_LINK = "#8B7355"; // 链接棕
const VINTAGE_ORANGE = "#D2691E"; // 橙棕 - 编辑hover
const VINTAGE_DELETE = "#C0392B"; // 删除红
const VINTAGE_DELETE_HOVER = "#8B4513"; // 删除hover

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
      position: "fixed", inset: 0, zIndex: 400,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(20,12,10,0.85)", backdropFilter: "blur(8px)",
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onCancel}
  >
    <motion.div
      style={{
        background: "#f9f5f0", border: `1px solid ${VINTAGE_BROWN}40`, borderRadius: 12,
        padding: "28px 32px", maxWidth: 380, width: "90%",
        boxShadow: "0 4px 16px rgba(92,64,51,0.15)",
      }}
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onClick={e => e.stopPropagation()}
    >
      <p style={{ fontFamily: "Noto Serif SC, serif", fontSize: 15, color: VINTAGE_DEEP, margin: "0 0 24px", lineHeight: 1.7, textAlign: "center" }}>{message}</p>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onCancel} style={{ flex: 1, padding: "10px 16px", border: `1px solid ${VINTAGE_BROWN}40`, borderRadius: 8, background: "transparent", color: VINTAGE_TEXT_LIGHT, fontSize: 14, cursor: "pointer", transition: "all 0.2s", fontFamily: "Noto Serif SC, serif" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${VINTAGE_BROWN}15`; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>取消</button>
        <button onClick={onConfirm} style={{ flex: 1, padding: "10px 16px", border: "none", borderRadius: 8, background: VINTAGE_DELETE, color: "#fff", fontSize: 14, cursor: "pointer", transition: "all 0.2s", fontFamily: "Noto Serif SC, serif" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#a02020"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = VINTAGE_DELETE; }}>确定删除</button>
      </div>
    </motion.div>
  </motion.div>
);

/* ============================================================
   迷你播放器组件
   ============================================================ */
const MiniPlayer: React.FC<{ link: string; onClose: () => void }> = ({ link, onClose }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      style={{
        position: "absolute", top: -70, right: 0, zIndex: 50,
        width: 200, height: 70,
        background: "rgba(255,255,255,0.95)", borderRadius: 8,
        boxShadow: "0 4px 20px rgba(92,64,51,0.2), 0 0 0 1px rgba(139,107,79,0.2)",
        overflow: "hidden", backdropFilter: "blur(8px)",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 4, right: 4, zIndex: 51,
          width: 20, height: 20, border: "none", borderRadius: "50%",
          background: `${VINTAGE_BROWN}30`, color: VINTAGE_BROWN, fontSize: 12,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >×</button>
      {link.includes("music.163.com") || link.includes("y.qq.com") || link.includes("spotify") || link.includes("song") ? (
        <iframe
          ref={iframeRef}
          src={`https://music.163.com/outchain/player?type=2&id=${link.match(/\d+/)?.[0] || ""}&auto=0&height=66`}
          width={200} height={70}
          style={{ border: "none", display: "block" }}
        />
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 24 }}>🎵</span>
          <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: VINTAGE_LINK, fontFamily: "Noto Serif SC, serif" }}>在浏览器打开</a>
        </div>
      )}
    </motion.div>
  );
};

/* ============================================================
   时代回响卡片表单（支持图片上传/音乐链接）
   ============================================================ */
interface CardFormData {
  year: string;
  title: string;
  description: string;
  musicLink?: string;
  imageUrl?: string;
}

const CardFormModal: React.FC<{
  mode: "add" | "edit";
  initialData?: VintageCard;
  onSubmit: (data: CardFormData) => void;
  onClose: () => void;
  sectionTitle: string;
  emoji: string;
}> = ({ mode, initialData, onSubmit, onClose, sectionTitle, emoji }) => {
  // 主题化 Placeholder 映射
  const placeholders = {
    "🎵": {
      title: "🎧 耳机里的青春 BGM",
      desc: "那年夏天循环播放的旋律，是刻在DNA里的歌。",
      imgIcon: "🎵",
    },
    "📺": {
      title: "📺 电视里的乌托邦",
      desc: "全家围坐追过的经典剧集，是童年最暖的光。",
      imgIcon: "📺",
    },
    "📱": {
      title: "🌐 网络初现时的印记",
      desc: "拨号上网时的第一个网页，是探索世界的起点。",
      imgIcon: "🌐",
    },
  };
  const ph = placeholders[emoji as keyof typeof placeholders] || {
    title: sectionTitle,
    desc: "写下你的回忆...",
    imgIcon: "🖼️",
  };

  const [year, setYear] = useState(initialData?.year || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [musicLink, setMusicLink] = useState(initialData?.musicLink || "");
  const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = year.trim() && title.trim() && description.trim();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("图片大小不能超过 2MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      alert("只支持 JPG/PNG 格式");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      year: year.trim(),
      title: title.trim(),
      description: description.trim(),
      musicLink: musicLink.trim() || undefined,
      imageUrl: imagePreview || undefined,
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
          background: "#f9f5f0", border: `1px solid ${VINTAGE_BROWN}30`,
          borderRadius: 12, padding: "28px 24px", maxWidth: 480, width: "100%",
          boxShadow: "0 2px 8px rgba(92,64,51,0.1)",
        }}
        initial={{ scale: 0.9, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 24 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "Noto Serif SC, serif", fontSize: 17, fontWeight: 600, color: VINTAGE_DEEP, margin: 0 }}>
            {ph.title}
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: VINTAGE_TEXT_LIGHT, marginBottom: 5, fontFamily: "Noto Serif SC, serif" }}>📅 年份</label>
            <input type="text" value={year} onChange={e => setYear(e.target.value)} placeholder="例如：2005 或 2005-2010"
              style={{ width: "100%", padding: "10px 12px", border: `1px solid ${VINTAGE_BROWN}30`, borderRadius: 6, background: "#fffef8", fontSize: 14, color: VINTAGE_DEEP, outline: "none", fontFamily: "Courier New, monospace", transition: "border-color 0.2s" }}
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = VINTAGE_BROWN; }}
              onBlur={e => { (e.target as HTMLInputElement).style.borderColor = `${VINTAGE_BROWN}30`; }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, color: VINTAGE_TEXT_LIGHT, marginBottom: 5, fontFamily: "Noto Serif SC, serif" }}>📌 标题</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="例如：周杰伦《晴天》"
              style={{ width: "100%", padding: "10px 12px", border: `1px solid ${VINTAGE_BROWN}30`, borderRadius: 6, background: "#fffef8", fontSize: 14, color: VINTAGE_DEEP, outline: "none", fontFamily: "Noto Serif SC, serif", transition: "border-color 0.2s" }}
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = VINTAGE_BROWN; }}
              onBlur={e => { (e.target as HTMLInputElement).style.borderColor = `${VINTAGE_BROWN}30`; }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, color: VINTAGE_TEXT_LIGHT, marginBottom: 5, fontFamily: "Noto Serif SC, serif" }}>💬 文案描述</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={ph.desc} rows={3} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${VINTAGE_BROWN}30`, borderRadius: 6, background: "#fffef8", fontSize: 14, color: VINTAGE_DEEP, outline: "none", fontFamily: "Noto Serif SC, serif", lineHeight: 1.7, resize: "vertical", transition: "border-color 0.2s" }}
              onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = VINTAGE_BROWN; }}
              onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = `${VINTAGE_BROWN}30`; }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, color: VINTAGE_TEXT_LIGHT, marginBottom: 5, fontFamily: "Noto Serif SC, serif" }}>🎵 音乐链接（选填）</label>
            <input type="text" value={musicLink} onChange={e => setMusicLink(e.target.value)} placeholder="网易云/QQ音乐/Spotify 链接"
              style={{ width: "100%", padding: "10px 12px", border: `1px solid ${VINTAGE_BROWN}30`, borderRadius: 6, background: "#fffef8", fontSize: 14, color: VINTAGE_DEEP, outline: "none", fontFamily: "monospace", transition: "border-color 0.2s" }}
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = VINTAGE_BROWN; }}
              onBlur={e => { (e.target as HTMLInputElement).style.borderColor = `${VINTAGE_BROWN}30`; }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, color: VINTAGE_TEXT_LIGHT, marginBottom: 5, fontFamily: "Noto Serif SC, serif" }}>🖼️ 图片（选填，JPG/PNG ≤2MB）</label>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleImageUpload} style={{ display: "none" }} />

            {/* 大图预览区 */}
            <div
              className="modal-image-preview"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "100%", height: 160,
                borderRadius: 8,
                border: `2px dashed ${VINTAGE_LINK}`,
                background: "#f5f0e5",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => {
                if (imagePreview) {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 2px ${VINTAGE_LINK}40`;
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="预览" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {/* hover 更换提示 */}
                  <div className="modal-image-preview-hover">
                    点击更换图片
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8 }}>
                  <span style={{ fontSize: 32, opacity: 0.5 }}>{ph.imgIcon}</span>
                  <span style={{ fontSize: 13, color: VINTAGE_TEXT_LIGHT, fontFamily: "Noto Serif SC, serif" }}>+ 上传图片</span>
                </div>
              )}
            </div>
            {imagePreview && (
              <button onClick={() => setImagePreview("")} style={{ marginTop: 6, padding: "2px 8px", border: "none", borderRadius: 4, background: `${VINTAGE_DELETE}15`, color: VINTAGE_DELETE, fontSize: 11, cursor: "pointer", fontFamily: "Noto Serif SC, serif" }}>
                移除图片
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px 14px", border: `1px solid ${VINTAGE_BROWN}30`, borderRadius: 8, background: "transparent", color: VINTAGE_TEXT_LIGHT, fontSize: 14, cursor: "pointer", transition: "all 0.2s", fontFamily: "Noto Serif SC, serif" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${VINTAGE_BROWN}10`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>取消</button>
          <button onClick={handleSubmit} disabled={!canSubmit} style={{ flex: 1, padding: "10px 14px", border: "none", borderRadius: 8, background: canSubmit ? VINTAGE_BROWN : `${VINTAGE_BROWN}50`, color: "#fff", fontSize: 14, cursor: canSubmit ? "pointer" : "not-allowed", transition: "all 0.2s", fontFamily: "Noto Serif SC, serif" }}
            onMouseEnter={e => { if (canSubmit) (e.currentTarget as HTMLButtonElement).style.background = "#7a5c3f"; }}
            onMouseLeave={e => { if (canSubmit) (e.currentTarget as HTMLButtonElement).style.background = VINTAGE_BROWN; }}>{mode === "add" ? "添加" : "保存"}</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ============================================================
   荣耀之路表单（支持图片上传）
   ============================================================ */
interface HonorFormData {
  year: string;
  title: string;
  description: string;
  imageUrl: string;
  reflection: string;
}

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
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = year.trim() && title.trim() && description.trim();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("图片大小不能超过 2MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      alert("只支持 JPG/PNG 格式");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImagePreview(result);
      setImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      year: year.trim(),
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim() || imagePreview,
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
          background: "#f9f5f0", border: `1px solid ${VINTAGE_BROWN}30`,
          borderRadius: 12, padding: "28px 24px", maxWidth: 520, width: "100%",
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 4px 16px rgba(92,64,51,0.15)",
        }}
        initial={{ scale: 0.9, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 24 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ fontFamily: "Noto Serif SC, serif", fontSize: 18, fontWeight: 700, color: VINTAGE_DEEP, margin: "0 0 20px" }}>
          {mode === "add" ? "🏆 添加荣耀时刻" : "🏆 编辑荣耀时刻"}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: VINTAGE_TEXT_LIGHT, marginBottom: 5, fontFamily: "Courier New, monospace", letterSpacing: "0.05em" }}>年份</label>
              <input type="text" value={year} onChange={e => setYear(e.target.value)} placeholder="2024"
                style={{ width: "100%", padding: "10px 12px", border: `1px solid ${VINTAGE_BROWN}30`, borderRadius: 6, background: "#fffef8", fontSize: 14, color: VINTAGE_DEEP, outline: "none", fontFamily: "Courier New, monospace" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: VINTAGE_TEXT_LIGHT, marginBottom: 5, fontFamily: "Noto Serif SC, serif" }}>🏆 成就名称</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="首个马拉松完赛"
                style={{ width: "100%", padding: "10px 12px", border: `1px solid ${VINTAGE_BROWN}30`, borderRadius: 6, background: "#fffef8", fontSize: 14, color: VINTAGE_DEEP, outline: "none", fontFamily: "Noto Serif SC, serif" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, color: VINTAGE_TEXT_LIGHT, marginBottom: 5, fontFamily: "Noto Serif SC, serif" }}>📝 成就描述</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="描述这段经历..."
              rows={3} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${VINTAGE_BROWN}30`, borderRadius: 6, background: "#fffef8", fontSize: 14, color: VINTAGE_DEEP, outline: "none", fontFamily: "Noto Serif SC, serif", lineHeight: 1.7, resize: "vertical" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, color: VINTAGE_TEXT_LIGHT, marginBottom: 5, fontFamily: "Noto Serif SC, serif" }}>💭 感悟反思（选填）</label>
            <textarea value={reflection} onChange={e => setReflection(e.target.value)} placeholder="写下你的感悟..."
              rows={2} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${VINTAGE_BROWN}30`, borderRadius: 6, background: "#fffef8", fontSize: 14, color: VINTAGE_DEEP, outline: "none", fontFamily: "Noto Serif SC, serif", lineHeight: 1.7, resize: "vertical", fontStyle: "italic" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, color: VINTAGE_TEXT_LIGHT, marginBottom: 5, fontFamily: "Noto Serif SC, serif" }}>🖼️ 图片上传（JPG/PNG ≤2MB，4:3）</label>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleImageUpload}
              style={{ display: "none" }} />
            <button onClick={() => fileInputRef.current?.click()}
              style={{ padding: "8px 14px", border: `1px dashed ${VINTAGE_BROWN}40`, borderRadius: 6, background: "transparent", color: VINTAGE_LINK, fontSize: 13, cursor: "pointer", fontFamily: "Noto Serif SC, serif", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${VINTAGE_BROWN}10`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>+ 上传图片</button>
            {imagePreview && (
              <div style={{ marginTop: 10 }}>
                <img src={imagePreview} alt="预览" style={{ width: 160, height: 120, objectFit: "cover", borderRadius: 6, border: `1px solid ${VINTAGE_BROWN}30` }} />
                <button onClick={() => { setImagePreview(""); setImageUrl(""); }} style={{ marginLeft: 8, padding: "2px 8px", border: "none", borderRadius: 4, background: `${VINTAGE_DELETE}20`, color: VINTAGE_DELETE, fontSize: 11, cursor: "pointer" }}>移除</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px 14px", border: `1px solid ${VINTAGE_BROWN}30`, borderRadius: 8, background: "transparent", color: VINTAGE_TEXT_LIGHT, fontSize: 14, cursor: "pointer", fontFamily: "Noto Serif SC, serif" }}>取消</button>
          <button onClick={handleSubmit} disabled={!canSubmit} style={{ flex: 1, padding: "10px 14px", border: "none", borderRadius: 8, background: canSubmit ? GOLD : `${GOLD}80`, color: "#fff", fontSize: 14, cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "Noto Serif SC, serif" }}>{mode === "add" ? "添加" : "保存"}</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ============================================================
   复古 SVG 占位图（时代回响卡片用）
   ============================================================ */
// 留声机 - BGM
const SVG_MUSIC_PLACEHOLDER = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2Y1ZjBlNSIgcnJ4PSIxMCIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjI4IiBmaWxsPSIjZTZlNmU2Ii8+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMTYiIGZpbGw9IiNlOGU4ZTgiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSI4IiBmaWxsPSIjZDRhZjM3Ii8+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNCIgZmlsbD0iI2Y1ZjBlNSIvPjxwYXRoIGQ9Ik00MCA0MGwzMiAtMzIiIHN0cm9rZT0iI2Q0YWYzNyIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+PC9zdmc+`;
// 老式电视 - TV
const SVG_TV_PLACEHOLDER = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB4PSI4IiB5PSIxMCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjQ2IiBmaWxsPSIjZTZlNmU2IiByeD0iNCIvPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjM0IiBmaWxsPSIjZDZkOGQ4IiByeD0iMiIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNjQiIHI9IjgiIGZpbGw9IiNkNGFmMzciLz48bGluZSB4MT0iNDAiIHkxPSI2NSIgeDI9IjQwIiB5Mj0iNzUiIHN0cm9rZT0iI2Q0YWYzNyIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+`;
// 诺基亚手机 - Internet
const SVG_PHONE_PLACEHOLDER = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB4PSIyNCIgeT0iOCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjY0IiBmaWxsPSIjZTZlNmU2IiByeD0iNCIvPjxyZWN0IHg9IjI4IiB5PSIxNiIgd2lkdGg9IjI0IiBoZWlnaHQ9IjQwIiBmaWxsPSIjZDZkOGQ4IiByeD0iMiIvPjxiaW5kIGN4PSI0MCIgY3k9IjU4IiByPSIzIiBmaWxsPSIjZDRhZjM3Ii8+PC9zdmc+`;

function getPlaceholderSvg(emoji: string): string {
  if (emoji === "🎵") return SVG_MUSIC_PLACEHOLDER;
  if (emoji === "📺") return SVG_TV_PLACEHOLDER;
  return SVG_PHONE_PLACEHOLDER;
}

/* ============================================================
   图片预览弹窗
   ============================================================ */
const ImagePreviewModal: React.FC<{
  src: string;
  title: string;
  onClose: () => void;
  onDelete?: () => void;
}> = ({ src, title, onClose, onDelete }) => (
  <motion.div
    style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,12,10,0.92)", backdropFilter: "blur(8px)" }}
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      style={{ background: "#f9f5f0", border: `2px solid ${VINTAGE_BROWN}60`, borderRadius: 12, padding: 24, maxWidth: 420, width: "90%", boxShadow: "0 8px 32px rgba(92,64,51,0.3)" }}
      initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onClick={e => e.stopPropagation()}
    >
      <p style={{ fontFamily: "Noto Serif SC, serif", fontSize: 13, color: VINTAGE_TEXT_LIGHT, margin: "0 0 12px", textAlign: "center" }}>{title}</p>
      <img src={src} alt={title} style={{ width: "100%", maxHeight: 300, objectFit: "contain", borderRadius: 8, border: `2px solid ${VINTAGE_LINK}`, filter: "sepia(0.15) contrast(1.05)" }} />
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "8px 14px", border: `1px solid ${VINTAGE_BROWN}40`, borderRadius: 8, background: "transparent", color: VINTAGE_TEXT_LIGHT, fontSize: 13, cursor: "pointer", fontFamily: "Noto Serif SC, serif" }}>关闭</button>
        {onDelete && (
          <button onClick={() => { onDelete(); onClose(); }} style={{ flex: 1, padding: "8px 14px", border: "none", borderRadius: 8, background: VINTAGE_DELETE, color: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "Noto Serif SC, serif" }}>删除图片</button>
        )}
      </div>
    </motion.div>
  </motion.div>
);

/* ============================================================
   复古报纸卡片组件（增强版 - 含图片上传）
   ============================================================ */
const VintageCard: React.FC<{
  card: VintageCard;
  emoji: string;
  onEdit: (card: VintageCard) => void;
  onDelete: (id: string) => void;
  onImageUpload?: (id: string, imageUrl: string) => void;
  onImageDelete?: (id: string) => void;
}> = ({ card, emoji, onEdit, onDelete, onImageUpload, onImageDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreviewModal, setImagePreviewModal] = useState<string | null>(null);
  const [imageDeleteConfirm, setImageDeleteConfirm] = useState(false);
  const imageUploadRef = useRef<HTMLInputElement>(null);

  const hasImage = !!card.imageUrl;

  const handleFileSelect = (file: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("图片大小不能超过 2MB"); return; }
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) { alert("只支持 JPG/PNG 格式"); return; }
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setIsUploading(false);
      onImageUpload?.(card.id, result);
    };
    reader.onerror = () => { setIsUploading(false); alert("图片上传失败，请重试"); };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; if (file) handleFileSelect(file); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleImageDelete = () => { setImageDeleteConfirm(false); onImageDelete?.(card.id); };

  return (
    <motion.div
      className="vintage-card"
      style={{
        position: "relative",
        border: isDragging ? `2px dashed #D4AF37` : undefined,
        boxShadow: isDragging ? "0 0 16px rgba(212,175,55,0.5)" : undefined,
        transition: "border 0.2s, box-shadow 0.2s",
        overflow: "hidden",
      }}
      whileHover={{ y: -4, rotate: 0.3 }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => { if (!deleteConfirm) setShowActions(false); }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 大图区域 - 顶部封面 */}
      <div
        className="vintage-card-hero"
        onClick={() => {
          if (hasImage) {
            setImagePreviewModal(card.imageUrl!);
          } else {
            imageUploadRef.current?.click();
          }
        }}
        style={{ cursor: hasImage ? "pointer" : "pointer" }}
      >
        {/* 已上传图片 */}
        {hasImage && (
          <img
            src={card.imageUrl}
            alt={card.title}
            className="vintage-card-hero-img"
          />
        )}

        {/* 兜底牛皮纸占位图 */}
        {!hasImage && (
          <div className="vintage-card-hero-placeholder">
            <img
              src={getPlaceholderSvg(emoji)}
              alt="placeholder"
              style={{ width: 60, height: 60, objectFit: "contain" }}
            />
          </div>
        )}

        {/* 上传中 */}
        {isUploading && (
          <div className="vintage-card-hero-loading">
            <span className="vintage-spin">🎵</span>
          </div>
        )}

        {/* 拖拽指示 */}
        {isDragging && (
          <div className="vintage-card-hero-drag">
            <span>🖼️</span>
            <span style={{ fontSize: 12, marginTop: 4 }}>放置上传</span>
          </div>
        )}

        {/* 渐变遮罩 - 覆盖图片下半部分 */}
        <div className="vintage-card-hero-gradient" />

        {/* 年份邮票标签（浮在图片上） */}
        <div className="vintage-year-stamp-overlay">{card.year}</div>

        {/* 图片右上角小徽章 */}
        {hasImage && (
          <div className="vintage-card-hero-badge" title="点击预览">
            🔍
          </div>
        )}

        {/* 无图片时显示上传提示 */}
        {!hasImage && !isUploading && (
          <div className="vintage-card-hero-upload-hint">
            点击上传图片
          </div>
        )}
      </div>

      {/* 操作按钮组 */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{ position: "absolute", top: 8, right: 8, zIndex: 20, display: "flex", gap: 5 }}
          >
            <button onClick={(e) => { e.stopPropagation(); onEdit(card); }} className="museum-edit-btn" title="编辑">✏️</button>
            <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(true); }} className="museum-delete-btn" title="删除">🗑️</button>
            <button onClick={(e) => { e.stopPropagation(); imageUploadRef.current?.click(); }} className="museum-upload-btn" title="上传图片" style={{ background: isUploading ? `${VINTAGE_LINK}80` : undefined }}>
              {isUploading ? "⏳" : "🖼️"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 删除确认 */}
      <AnimatePresence>
        {deleteConfirm && (
          <ConfirmDialog message="确定删除？不可恢复。" onConfirm={() => { onDelete(card.id); setDeleteConfirm(false); setShowActions(false); }} onCancel={() => setDeleteConfirm(false)} />
        )}
      </AnimatePresence>

      {/* 迷你播放器 */}
      <AnimatePresence>
        {showPlayer && card.musicLink && (
          <MiniPlayer link={card.musicLink} onClose={() => setShowPlayer(false)} />
        )}
      </AnimatePresence>

      {/* 图片预览弹窗 */}
      <AnimatePresence>
        {imagePreviewModal && (
          <ImagePreviewModal src={imagePreviewModal} title={card.title} onClose={() => setImagePreviewModal(null)} onDelete={hasImage ? () => { setImageDeleteConfirm(true); } : undefined} />
        )}
        {imageDeleteConfirm && (
          <ConfirmDialog message="确定删除图片？" onConfirm={handleImageDelete} onCancel={() => setImageDeleteConfirm(false)} />
        )}
      </AnimatePresence>

      {/* 文字内容区 */}
      <div className="vintage-card-body">
        <h4 className="vintage-card-title">{card.title}</h4>
        <div className="vintage-card-divider" />
        <p className="vintage-card-quote">{card.description}</p>
      </div>

      {/* 隐藏的文件输入 */}
      <input ref={imageUploadRef} type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleFileInput} style={{ display: "none" }} />
    </motion.div>
  );
};

/* ============================================================
   横向滑动长廊组件
   ============================================================ */
const VintageGallery: React.FC<{
  title: string;
  emoji: string;
  cards: VintageCard[];
  onAdd: (data: CardFormData) => void;
  onEdit: (card: VintageCard) => void;
  onDelete: (id: string) => void;
  onImageUpload?: (id: string, imageUrl: string) => void;
  onImageDelete?: (id: string) => void;
}> = ({ title, emoji, cards, onAdd, onEdit, onDelete, onImageUpload, onImageDelete }) => (
  <div className="vintage-section">
    <div className="vintage-section-header">
      <span className="vintage-section-emoji">{emoji}</span>
      <h3 className="vintage-section-title">{title}</h3>
      <button
        onClick={() => onAdd({ year: "", title: "", description: "" })}
        className="museum-add-btn"
      >+ 添加</button>
    </div>
    <div className="vintage-gallery-scroll">
      <div className="vintage-gallery-track">
        <AnimatePresence mode="popLayout">
          {cards.map(card => (
            <motion.div key={card.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>
              <VintageCard card={card} emoji={emoji} onEdit={onEdit} onDelete={onDelete} onImageUpload={onImageUpload} onImageDelete={onImageDelete} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  </div>
);

/* ============================================================
   荣耀成就卡片组件（增强版 - 含图片上传）
   ============================================================ */
const HonorCard: React.FC<{
  item: HonorItem;
  onEdit: (item: HonorItem) => void;
  onDelete: (id: string) => void;
  onImageUpload?: (id: string, imageUrl: string) => void;
  onImageDelete?: (id: string) => void;
}> = ({ item, onEdit, onDelete, onImageUpload, onImageDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreviewModal, setImagePreviewModal] = useState<string | null>(null);
  const [imageDeleteConfirm, setImageDeleteConfirm] = useState(false);
  const imageUploadRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("图片大小不能超过 2MB"); return; }
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) { alert("只支持 JPG/PNG 格式"); return; }
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setIsUploading(false);
      onImageUpload?.(item.id, result);
    };
    reader.onerror = () => { setIsUploading(false); alert("图片上传失败，请重试"); };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    e.target.value = "";
  };

  const handleImageDelete = () => { setImageDeleteConfirm(false); onImageDelete?.(item.id); };

  return (
    <>
      <motion.div
        className="museum-honor-card museum-honor-card-enhanced"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.4 }}
        onHoverStart={() => setShowActions(true)}
        onHoverEnd={() => { if (!deleteConfirm) setShowActions(false); }}
      >
        {/* 操作按钮组 */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ position: "absolute", top: 8, right: 8, zIndex: 20, display: "flex", gap: 6 }}
            >
              <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="honor-edit-btn" title="编辑">✏️</button>
              <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(true); }} className="honor-delete-btn" title="删除">🗑️</button>
              <button onClick={(e) => { e.stopPropagation(); imageUploadRef.current?.click(); }} className="honor-upload-btn" title="上传图片" style={{ background: isUploading ? `${VINTAGE_LINK}80` : undefined }}>
                {isUploading ? "⏳" : "🖼️"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 删除确认 */}
        <AnimatePresence>
          {deleteConfirm && (
            <ConfirmDialog message="确定删除这条记录？不可恢复。" onConfirm={() => { onDelete(item.id); setDeleteConfirm(false); setShowActions(false); }} onCancel={() => setDeleteConfirm(false)} />
          )}
        </AnimatePresence>

        {/* 图片预览弹窗 */}
        <AnimatePresence>
          {imagePreviewModal && (
            <ImagePreviewModal src={imagePreviewModal} title={item.title} onClose={() => setImagePreviewModal(null)} onDelete={() => { setImageDeleteConfirm(true); }} />
          )}
          {imageDeleteConfirm && (
            <ConfirmDialog message="确定删除图片？" onConfirm={handleImageDelete} onCancel={() => setImageDeleteConfirm(false)} />
          )}
        </AnimatePresence>

        {/* 图片（48x48 圆角，带棕色边框） */}
        <div style={{ flexShrink: 0, alignSelf: "flex-start", paddingTop: 16, paddingLeft: 16 }}>
          {item.imageUrl ? (
            <motion.img
              src={item.imageUrl}
              alt={item.title}
              className="honor-card-img"
              onClick={(e) => { e.stopPropagation(); setImagePreviewModal(item.imageUrl); }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <div className="honor-card-placeholder">🏆</div>
          )}
        </div>

        {/* 内容 */}
        <div className="museum-honor-body">
          <h3 className="museum-card-title">{item.title}</h3>
          <p className="museum-card-desc">{item.description}</p>
          {item.reflection && (
            <p className="museum-honor-reflection">
              <span className="museum-reflection-mark">"</span>{item.reflection}
            </p>
          )}
          <span className="museum-card-zoom-hint">🏆 荣耀时刻</span>
        </div>
      </motion.div>

      {/* 隐藏的文件输入 */}
      <input ref={imageUploadRef} type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleFileInput} style={{ display: "none" }} />
    </>
  );
};

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
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
};

/* ============================================================
   悬浮添加按钮 (FAB)
   ============================================================ */
const FAB: React.FC<{ onClick: () => void }> = ({ onClick }) => (
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
    title="添加荣耀时刻"
  >+</motion.button>
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

  // 时代回响强制升序排列（年份小的在前）
  const sortedBgms = useMemo(() => [...bgms].sort((a, b) => (parseInt(a.year) || 0) - (parseInt(b.year) || 0)), [bgms]);
  const sortedTvs = useMemo(() => [...tvs].sort((a, b) => (parseInt(a.year) || 0) - (parseInt(b.year) || 0)), [tvs]);
  const sortedNets = useMemo(() => [...nets].sort((a, b) => (parseInt(a.year) || 0) - (parseInt(b.year) || 0)), [nets]);

  // 荣耀之路强制降序排列（年份大的在前，最新成就在最顶部）
  const sortedHonors = useMemo(() => {
    const sorted = [...honors].sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
    // eslint-disable-next-line no-console
    console.log("[荣耀之路] 排序后年份:", sorted.map(h => h.year));
    return sorted;
  }, [honors]);

  // 模态框状态
  const [cardModal, setCardModal] = useState<{ mode: "add" | "edit"; section: "bgm" | "tv" | "net"; data?: VintageCard } | null>(null);
  const [honorModal, setHonorModal] = useState<{ mode: "add" | "edit"; data?: HonorItem } | null>(null);

  // 持久化
  useEffect(() => { saveData(LS_KEYS.bgms, bgms); }, [bgms]);
  useEffect(() => { saveData(LS_KEYS.tvs, tvs); }, [tvs]);
  useEffect(() => { saveData(LS_KEYS.nets, nets); }, [nets]);
  useEffect(() => { saveData(LS_KEYS.honors, honors); }, [honors]);

  // 锁定背景滚动
  useEffect(() => {
    if (cardModal || honorModal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [cardModal, honorModal]);

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
    if (section === "bgm") setBgms(prev => prev.filter(c => c.id !== id));
    else if (section === "tv") setTvs(prev => prev.filter(c => c.id !== id));
    else setNets(prev => prev.filter(c => c.id !== id));
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
    setHonors(prev => prev.filter(h => h.id !== id));
  };

  // 荣耀图片上传/删除
  const handleHonorImageUpload = (id: string, imageUrl: string) => {
    setHonors(prev => prev.map(h => h.id === id ? { ...h, imageUrl } : h));
  };

  const handleHonorImageDelete = (id: string) => {
    setHonors(prev => prev.map(h => h.id === id ? { ...h, imageUrl: "" } : h));
  };

  // 图片上传/删除处理（时代回响）
  const handleImageUpload = (id: string, imageUrl: string, section: "bgm" | "tv" | "net") => {
    if (section === "bgm") setBgms(prev => prev.map(c => c.id === id ? { ...c, imageUrl } : c));
    else if (section === "tv") setTvs(prev => prev.map(c => c.id === id ? { ...c, imageUrl } : c));
    else setNets(prev => prev.map(c => c.id === id ? { ...c, imageUrl } : c));
  };

  const handleImageDelete = (id: string, section: "bgm" | "tv" | "net") => {
    if (section === "bgm") setBgms(prev => prev.map(c => c.id === id ? { ...c, imageUrl: undefined } : c));
    else if (section === "tv") setTvs(prev => prev.map(c => c.id === id ? { ...c, imageUrl: undefined } : c));
    else setNets(prev => prev.map(c => c.id === id ? { ...c, imageUrl: undefined } : c));
  };

  // 获取 section 标题和 emoji
  const getSectionTitle = (section: "bgm" | "tv" | "net") => {
    if (section === "bgm") return "🎵 耳机里的青春 BGM";
    if (section === "tv") return "📺 电视里的乌托邦";
    return "📱 网络初现时的印记";
  };
  const getSectionEmoji = (section: "bgm" | "tv" | "net") => {
    if (section === "bgm") return "🎵";
    if (section === "tv") return "📺";
    return "📱";
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

        <VintageGallery title="耳机里的青春 BGM" emoji="🎵" cards={sortedBgms}
          onAdd={(data) => setCardModal({ mode: "add", section: "bgm", data: { ...data, id: "", year: data.year || String(new Date().getFullYear()) } })}
          onEdit={(card) => setCardModal({ mode: "edit", section: "bgm", data: card })}
          onDelete={(id) => handleCardDelete(id, "bgm")}
          onImageUpload={(id, url) => handleImageUpload(id, url, "bgm")}
          onImageDelete={(id) => handleImageDelete(id, "bgm")} />

        <VintageGallery title="电视里的乌托邦" emoji="📺" cards={sortedTvs}
          onAdd={(data) => setCardModal({ mode: "add", section: "tv", data: { ...data, id: "", year: data.year || String(new Date().getFullYear()) } })}
          onEdit={(card) => setCardModal({ mode: "edit", section: "tv", data: card })}
          onDelete={(id) => handleCardDelete(id, "tv")}
          onImageUpload={(id, url) => handleImageUpload(id, url, "tv")}
          onImageDelete={(id) => handleImageDelete(id, "tv")} />

        <VintageGallery title="网络初现时的印记" emoji="📱" cards={sortedNets}
          onAdd={(data) => setCardModal({ mode: "add", section: "net", data: { ...data, id: "", year: data.year || String(new Date().getFullYear()) } })}
          onEdit={(card) => setCardModal({ mode: "edit", section: "net", data: card })}
          onDelete={(id) => handleCardDelete(id, "net")}
          onImageUpload={(id, url) => handleImageUpload(id, url, "net")}
          onImageDelete={(id) => handleImageDelete(id, "net")} />
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
          {sortedHonors.map((m, i) => (
            <motion.div
              key={m.id}
              className="museum-honor-row"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div className="museum-honor-node">
                <span className="museum-honor-dot" />
                <span className="museum-honor-year">{m.year}</span>
              </div>
              <HonorCard
                item={m}
                onEdit={(item) => setHonorModal({ mode: "edit", data: item })}
                onDelete={handleHonorDelete}
                onImageUpload={handleHonorImageUpload}
                onImageDelete={handleHonorImageDelete}
              />
            </motion.div>
          ))}
          {/* 起点标注 */}
          <div className="museum-timeline-start">
            <span className="museum-honor-dot museum-honor-dot-start" />
            <span className="museum-timeline-start-label">🏁 起点</span>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="museum-foot"><span>时光不语，静待花开。</span></footer>

      {/* 悬浮添加按钮 */}
      <FAB onClick={() => setHonorModal({ mode: "add" })} />

      {/* 模态框 */}
      <AnimatePresence>
        {cardModal && (
          <CardFormModal
            mode={cardModal.mode}
            initialData={cardModal.data}
            onSubmit={handleCardSubmit}
            onClose={() => setCardModal(null)}
            sectionTitle={getSectionTitle(cardModal.section)}
            emoji={getSectionEmoji(cardModal.section)}
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

      <style>{`
        .museum-page,
        .museum-page * { cursor: auto; }
        .museum-page a,
        .museum-page button,
        .museum-page .museum-card-collection,
        .museum-page .museum-honor-card { cursor: pointer; }

        .museum-page { position: relative; min-height: 100vh; overflow: hidden; color: #e8dcc8; background: radial-gradient(120% 80% at 50% 0%, #4a3a2e 0%, #3d2c2e 45%, #2a1f20 100%); font-family: "Noto Sans SC", system-ui, sans-serif; padding: 0 24px 120px; }

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
        .museum-hero-title { font-family: "Noto Serif SC", Georgia, serif; font-size: clamp(34px, 5.5vw, 54px); font-weight: 700; color: ${GOLD}; margin: 0 0 14px; letter-spacing: 0.06em; text-shadow: 0 0 30px rgba(176,141,87,0.3); }
        .museum-hero-sub { font-size: 16px; color: #b8a890; margin: 0; letter-spacing: 0.12em; font-style: italic; }

        /* 展厅 */
        .museum-hall { position: relative; z-index: 2; max-width: 960px; margin: 0 auto 72px; }
        .museum-hall-head { display: flex; align-items: center; gap: 18px; margin-bottom: 36px; padding-bottom: 18px; border-bottom: 1px solid rgba(176,141,87,0.25); }
        .museum-hall-roman { font-family: "Noto Serif SC", Georgia, serif; font-size: 38px; font-weight: 700; color: ${GOLD}; opacity: 0.7; line-height: 1; }
        .museum-hall-title { font-family: "Noto Serif SC", Georgia, serif; font-size: 26px; font-weight: 700; color: ${GOLD}; margin: 0 0 4px; }
        .museum-hall-sub { font-size: 13px; color: #9a8a78; margin: 0; font-style: italic; }

        /* ====== 复古报纸风格 ====== */
        .museum-era-section { background: none; }
        .vintage-section { margin-bottom: 48px; }
        .vintage-section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px dashed rgba(139,109,79,0.4); }
        .vintage-section-emoji { font-size: 24px; filter: grayscale(0.3); }
        .vintage-section-title { font-family: "Noto Serif SC", Georgia, serif; font-size: 18px; font-weight: 600; color: ${VINTAGE_BROWN}; margin: 0; letter-spacing: 0.08em; }

        /* 添加按钮 */
        .museum-add-btn {
          margin-left: auto; padding: 6px 14px; border: 1px dashed ${VINTAGE_BROWN}60;
          border-radius: 20px; background: transparent; color: ${VINTAGE_BROWN};
          font-size: 12px; cursor: pointer; font-family: "Noto Serif SC", serif;
          transition: all 0.2s; display: flex; align-items: center; gap: 4px;
        }
        .museum-add-btn:hover { background: ${VINTAGE_BROWN}15; border-style: solid; }

        /* 横向滑动 */
        .vintage-gallery-scroll { overflow-x: auto; padding-bottom: 16px; scrollbar-width: thin; scrollbar-color: ${VINTAGE_BROWN} transparent; }
        .vintage-gallery-scroll::-webkit-scrollbar { height: 6px; }
        .vintage-gallery-scroll::-webkit-scrollbar-thumb { background: rgba(139,109,79,0.4); border-radius: 3px; }
        .vintage-gallery-track { display: flex; gap: 20px; padding: 8px 4px; }

        /* 时代回响卡片（杂志风：图片50% + 文字50%） */
        .vintage-card {
          position: relative; flex-shrink: 0; width: 280px;
          height: 320px; /* 固定高度：160px 图片 + 160px 文字 */
          background: #FAF8F3;
          border: 1px solid #D7CCC8; border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: all 0.3s ease; overflow: hidden;
          display: flex; flex-direction: column;
        }

        /* 图片区域（50% = 160px） */
        .vintage-card-hero { position: relative; width: 100%; height: 160px; flex-shrink: 0; overflow: hidden; border-radius: 12px 12px 0 0; }
        .vintage-card-hero-img { width: 100%; height: 100%; object-fit: cover; filter: sepia(0.1) contrast(1.02) brightness(0.98); transition: transform 0.3s ease; }
        .vintage-card-hero:hover .vintage-card-hero-img { transform: scale(1.04); }
        .vintage-card-hero-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #F5EDD8 0%, #E8D8C0 100%); background-image: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,107,79,0.04) 3px, rgba(139,107,79,0.04) 6px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(139,107,79,0.04) 3px, rgba(139,107,79,0.04) 6px); display: flex; align-items: center; justify-content: center; }
        .vintage-card-hero-loading { position: absolute; inset: 0; background: rgba(250,248,243,0.9); display: flex; align-items: center; justify-content: center; }
        .vintage-card-hero-drag { position: absolute; inset: 0; background: rgba(212,175,55,0.15); border: 3px dashed #D4AF37; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px; color: #6B5A4A; font-family: "Noto Serif SC, serif"; }
        .vintage-card-hero-gradient { position: absolute; left: 0; right: 0; bottom: 0; height: 50%; background: linear-gradient(to bottom, transparent 0%, rgba(62,39,35,0.5) 100%); pointer-events: none; }
        .vintage-card-hero-badge { position: absolute; top: 8px; right: 8px; z-index: 5; width: 24px; height: 24px; border-radius: 50%; background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); border: 1px solid rgba(139,107,79,0.3); font-size: 12px; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
        .vintage-card-hero:hover .vintage-card-hero-badge { opacity: 1; }
        .vintage-card-hero-upload-hint { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); z-index: 5; font-size: 11px; color: rgba(250,248,243,0.9); font-family: "Noto Serif SC, serif"; text-shadow: 0 1px 3px rgba(0,0,0,0.4); white-space: nowrap; }

        /* 年份邮票标签（浮在图片左上角） */
        .vintage-year-stamp-overlay { position: absolute; top: 8px; left: 8px; z-index: 5; padding: 4px 8px; background: #8B7355; color: #fff; font-family: "Courier New", monospace; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; border-radius: 2px; box-shadow: 2px 2px 0 rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.15); transform: rotate(-3deg); }

        /* 文字区域（紧凑杂志排版） */
        .vintage-card-body {
          height: 160px; padding: 12px 16px 12px;
          flex-shrink: 0; display: flex; flex-direction: column;
        }
        .vintage-card-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 16px; font-weight: 600; color: #3E2723;
          margin: 0 0 6px; line-height: 1.4;
          flex-shrink: 0;
        }
        /* 标题下方分隔线 */
        .vintage-card-divider {
          width: 60px; height: 1px; background: #E0D6D0;
          margin: 0 0 8px; flex-shrink: 0;
        }
        .vintage-card-desc {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 13px; line-height: 1.5; color: #5D4037;
          margin: 0; flex: 1; overflow: hidden;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }
        /* 引用（带前缀符号） */
        .vintage-card-quote {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 13px; line-height: 1.5; color: #795548;
          margin: 6px 0 0; font-style: italic; flex-shrink: 0;
        }
        .vintage-card-quote::before { content: "❝ "; }
        .vintage-card-quote::after { content: " ❞"; }

        /* 编辑/删除/上传按钮 */
        .museum-edit-btn, .museum-delete-btn {
          width: 26px; height: 26px; border: none; border-radius: 50%;
          font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25); transition: all 0.2s ease;
        }
        .museum-edit-btn { background: ${VINTAGE_LINK}; color: #fff; }
        .museum-edit-btn:hover { background: ${VINTAGE_ORANGE}; transform: scale(1.1); }
        .museum-delete-btn { background: ${VINTAGE_DELETE_HOVER}; color: #fff; }
        .museum-delete-btn:hover { background: ${VINTAGE_DELETE}; animation: shake 0.3s ease-in-out; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2px) rotate(-5deg); } 75% { transform: translateX(2px) rotate(5deg); } }

        /* 上传按钮 */
        .museum-upload-btn {
          width: 26px; height: 26px; border: none; border-radius: 50%;
          font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25); transition: all 0.2s ease;
          background: ${VINTAGE_LINK}; color: #fff;
        }
        .museum-upload-btn:hover { background: ${VINTAGE_BROWN}; transform: scale(1.1); }

        /* 上传中旋转动画 */
        .vintage-spin {
          font-size: 28px; display: inline-block;
          animation: vintage-spin 1s linear infinite;
        }
        @keyframes vintage-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* 弹窗大图预览 hover */
        .modal-image-preview-hover { position: absolute; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; color: #fff; font-family: "Noto Serif SC, serif"; font-size: 14px; opacity: 0; transition: opacity 0.2s; }
        .modal-image-preview:hover .modal-image-preview-hover { opacity: 1; }

        /* 垂直时间轴 */
        .museum-timeline-v { position: relative; padding-left: 8px; }
        .museum-timeline-v::before { content: ""; position: absolute; left: 21px; top: 8px; bottom: 8px; width: 2px; background: linear-gradient(to bottom, ${GOLD}, rgba(176,141,87,0.2)); }
        .museum-honor-row { position: relative; display: flex; gap: 28px; margin-bottom: 36px; }
        .museum-honor-node { flex-shrink: 0; width: 44px; display: flex; flex-direction: column; align-items: center; padding-top: 18px; z-index: 1; }
        .museum-honor-dot { width: 14px; height: 14px; border-radius: 50%; background: ${GOLD}; border: 3px solid #3d2c2e; box-shadow: 0 0 12px rgba(176,141,87,0.6); }
        .museum-honor-year { margin-top: 8px; font-family: "Courier New", monospace; font-size: 12px; font-weight: 700; color: ${GOLD}; }
        .museum-honor-card { position: relative; flex: 1; display: flex; gap: 20px; background: #f5edd6; border: 1px solid rgba(176,141,87,0.5); border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px -12px rgba(0,0,0,0.6); transition: transform 0.3s ease, box-shadow 0.3s ease; }

        /* 荣耀编辑/删除按钮 */
        .honor-edit-btn, .honor-delete-btn {
          width: 28px; height: 28px; border: none; border-radius: 50%;
          font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: all 0.2s ease;
        }
        .honor-edit-btn { background: ${VINTAGE_DEEP}; color: #fff; }
        .honor-edit-btn:hover { transform: scale(1.1); }
        .honor-delete-btn { background: ${VINTAGE_DELETE_HOVER}; color: #fff; }
        .honor-delete-btn:hover { background: ${VINTAGE_DELETE}; animation: shake 0.3s ease-in-out; }

        /* 荣耀上传按钮 */
        .honor-upload-btn {
          width: 28px; height: 28px; border: none; border-radius: 50%;
          font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: all 0.2s ease;
          background: ${VINTAGE_LINK}; color: #fff;
        }
        .honor-upload-btn:hover { background: ${VINTAGE_BROWN}; transform: scale(1.1); }

        /* 荣耀卡片图片（48x48 圆角） */
        .honor-card-img {
          width: 48px; height: 48px; object-fit: cover; border-radius: 8px;
          border: 2px solid ${VINTAGE_LINK};
          background: #f5f0e5;
          filter: sepia(0.1) contrast(1.05);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .honor-card-placeholder {
          width: 48px; height: 48px; border-radius: 8px;
          background: rgba(245,240,229,0.9); border: 2px dashed ${VINTAGE_LINK}60;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
        }

        /* 起点标注 */
        .museum-timeline-start {
          display: flex; align-items: center; gap: 10px;
          margin-top: 8px; padding-left: 0;
        }
        .museum-honor-dot-start {
          width: 10px; height: 10px; background: ${GOLD}; opacity: 0.5;
          box-shadow: none;
        }
        .museum-timeline-start-label {
          font-family: "Noto Serif SC", serif; font-size: 12px;
          color: rgba(176,141,87,0.5); font-style: italic; letter-spacing: 0.08em;
        }

        .museum-honor-img { width: 160px; flex-shrink: 0; height: auto; }
        .museum-honor-img .museum-film-img { height: 100%; min-height: 140px; }
        .museum-honor-body { padding: 18px 20px; flex: 1; }
        .museum-card-title { font-family: "Noto Serif SC", Georgia, serif; font-size: 16px; font-weight: 700; color: #3d2c2e; margin: 0 0 6px; }
        .museum-card-desc { font-size: 12px; line-height: 1.7; color: #6b5a4a; margin: 0; }
        .museum-honor-reflection { margin: 10px 0 0; padding-left: 14px; border-left: 2px solid ${GOLD}; font-size: 13px; line-height: 1.8; color: #8a6a4a; font-style: italic; }
        .museum-reflection-mark { font-family: "Noto Serif SC", Georgia, serif; font-size: 22px; color: ${GOLD}; margin-right: 2px; line-height: 0; }
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
          .vintage-card { width: 100%; max-width: 320px; height: 320px; }
          .vintage-card-hero { height: 160px; }
          .vintage-card-body { height: 160px; padding: 12px; }
          .vintage-section-header { gap: 10px; }
          .vintage-section-title { font-size: 16px; }
          .museum-honor-card { flex-direction: column; }
          .museum-honor-img { width: 100%; height: 160px; }
          .museum-honor-img .museum-film-img { min-height: 160px; }
        }
      `}</style>
    </div>
  );
};

export default MuseumPage;
