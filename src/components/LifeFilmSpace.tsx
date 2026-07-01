import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 第七卷胶片 · 手绘立体动态胶卷（猴小扑风格）
 *
 * 视觉：米黄背景 + 柯达胶卷罐 + 手绘小猫 + 立体胶卷条
 * 动态：胶卷从卷轴拉出→帧逐个展开→尽头弹回
 * 交互：悬停脉冲、点击卷入/拉出、ESC 退出
 * 音效：咔哒机械声/唰胶片声/叮确认音
 */

interface LifeFilmSpaceProps {
  onClose: () => void;
}

/* ===== 6 个生活切面（手绘复古色调） ===== */
interface Frame {
  id?: string;
  emoji: string;
  name: string;
  desc: string;
  detail: string;
  tint: string; // 复古色调
  sound: "page" | "shutter" | "vinyl" | "step" | "breathe" | "popcorn";
  isCustom?: boolean; // 是否为自定义帧
}

const FRAMES: Frame[] = [
  { emoji: "📖", name: "阅读", desc: "最近在读《思考，快与慢》，丹尼尔·卡尼曼的经典之作。", detail: "金句摘录：我们对我们所知的东西的信心，远远超过了我们所知的东西。", tint: "#C4B89A", sound: "page" },
  { emoji: "📸", name: "摄影", desc: "喜欢用镜头捕捉森林里的光影，记录转瞬即逝的自然之美。", detail: "设备：Sony A7C + 28-60mm，偏爱自然光与胶片色调。", tint: "#A8B8A0", sound: "shutter" },
  { emoji: "🎧", name: "音乐/播客", desc: "播客重度用户，最喜欢「声东击西」和「日谈公园」。", detail: "音乐偏好：后摇、古典、氛围电子。最近单曲循环坂本龙一。", tint: "#C8A8A0", sound: "vinyl" },
  { emoji: "🏃", name: "运动", desc: "每周跑步 3 次，配速 5'30\"，享受奔跑时的心流状态。", detail: "Keep 累计 300+ km，最佳半马 1:58:32。", tint: "#D4A882", sound: "step" },
  { emoji: "🧘", name: "冥想", desc: "每天 10 分钟正念冥想，已坚持 200+ 天。", detail: "使用 Headspace 引导，偏爱身体扫描与呼吸觉察。", tint: "#9AB8B0", sound: "breathe" },
  { emoji: "📺", name: "追剧", desc: "剧迷一枚，最近在追《重启人生》和《繁花》。", detail: "品味：日剧 > 韩剧 > 国剧。最爱《深夜食堂》系列。", tint: "#D4C896", sound: "popcorn" },
];

/* ===== 自定义胶片帧持久化 ===== */
const CUSTOM_FRAMES_KEY = "film_custom_frames";

function loadCustomFrames(): Frame[] {
  try {
    const raw = localStorage.getItem(CUSTOM_FRAMES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveCustomFrames(frames: Frame[]): void {
  try { localStorage.setItem(CUSTOM_FRAMES_KEY, JSON.stringify(frames)); } catch { /* noop */ }
}

const MUSIC_TRACKS = [
  { title: "《随机波动》", type: "播客", desc: "三位女性主义者的思想碰撞", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop" },
  { title: "《无人知晓》", type: "播客", desc: "和勇敢的人聊聊「不知道」", cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=100&h=100&fit=crop" },
  { title: "《Before Sunset》", type: "音乐", desc: "日落前的吉他呢喃", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop" },
  { title: "《River Flows in You》", type: "音乐", desc: "Yiruma 的钢琴，溪水流过鹅卵石", cover: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=100&h=100&fit=crop" },
];

/* ===== 阅读数据 — 可扩展，push 新对象即自动渲染 ===== */
interface BookData {
  id: number;
  title: string;
  author: string;
  cover: string;
  quotes: string[];
}

const readingData: BookData[] = [
  {
    id: 1,
    title: "成为波伏瓦",
    author: "凯特·柯克帕特里克",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=240&h=360&fit=crop",
    quotes: [
      "真正的救赎，并不是厮杀后的胜利，而是能在苦难之中找到生的力量和心的安宁。",
      "她的人生，是一场不断寻找自我的旅程。",
    ],
  },
  {
    id: 2,
    title: "悉达多",
    author: "赫尔曼·黑塞",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=240&h=360&fit=crop",
    quotes: [
      "不必行色匆匆，不必光芒四射，不必成为别人，只需做自己。",
      "智慧是无法被传授的，它只能被体验。",
    ],
  },
  {
    id: 3,
    title: "置身事内",
    author: "兰小欢",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=240&h=360&fit=crop",
    quotes: [
      "理解政府与市场的关系，是理解中国经济的起点。",
      "没有人能脱离社会独自存在。",
    ],
  },
];

/* ===== 自定义图书持久化 ===== */
const CUSTOM_BOOKS_KEY = "reading_custom_books";

function loadCustomBooks(): BookData[] {
  try {
    const raw = localStorage.getItem(CUSTOM_BOOKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomBooks(books: BookData[]): void {
  try {
    localStorage.setItem(CUSTOM_BOOKS_KEY, JSON.stringify(books));
  } catch { /* noop */ }
}

/* ===== 摄影数据 — 可扩展，push 新对象即自动渲染 ===== */
interface PhotoItem {
  type: "photo" | "video";
  url: string;
  caption: string;
  isLivePhoto?: boolean;
  userCaption?: string;  // 自定义图片描述
  userDate?: string;     // 自定义时间
  userNote?: string;     // 自定义备注
}

const photographyData: PhotoItem[] = [
  {
    type: "photo",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    caption: "2025.06 · 海边日落 · 风里有盐的味道",
    isLivePhoto: true,
  },
  {
    type: "video",
    url: "https://cdn.coverr.co/videos/coverr-rainy-night-in-the-city-1080p.mp4",
    caption: "2025.05 · 城市夜雨 · 路灯是倒流的星河",
  },
  {
    type: "photo",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop",
    caption: "2025.04 · 山间晨雾 · 世界安静得能听见心跳",
    isLivePhoto: false,
  },
  {
    type: "photo",
    url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop",
    caption: "2025.03 · 林间光斑 · 阳光穿过叶缝的瞬间",
    isLivePhoto: true,
  },
];

/* ===== 摄影自定义数据持久化 ===== */
const CUSTOM_PHOTOS_KEY = "seventh_roll_custom_photos";

function loadCustomPhotos(): PhotoItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_PHOTOS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomPhotos(photos: PhotoItem[]): void {
  try {
    localStorage.setItem(CUSTOM_PHOTOS_KEY, JSON.stringify(photos));
  } catch { /* noop */ }
}

/* ===== 照片放映内容（表单视图 / 正常视图）===== */
const PhotoProjectorContent: React.FC<{
  pendingPhotoUrl: string | null;
  pendingCaption: string;
  pendingDate: string;
  pendingNote: string;
  onCaptionChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onNoteChange: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  allPhotos: PhotoItem[];
  photoIndex: number;
  photoPaused: boolean;
  newPhotoHighlight: boolean;
  onPause: () => void;
  onResume: () => void;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}> = ({ pendingPhotoUrl, pendingCaption, pendingDate, pendingNote, onCaptionChange, onDateChange, onNoteChange, onConfirm, onCancel, allPhotos, photoIndex, photoPaused, newPhotoHighlight, onPause, onResume, onIndexChange, onClose }) => {
  if (pendingPhotoUrl) {
    return (
      <div className="lfs-photo-form-view">
        <div className="lfs-photo-form-preview">
          <img src={pendingPhotoUrl} alt="待添加" className="lfs-photo-form-img" />
        </div>
        <div className="lfs-photo-form-fields">
          <div className="lfs-form-row">
            <span className="lfs-form-icon">📝</span>
            <input className="lfs-form-input" type="text" placeholder="给照片写一句描述…" value={pendingCaption} onChange={(e) => onCaptionChange(e.target.value)} autoFocus />
          </div>
          <div className="lfs-form-row">
            <span className="lfs-form-icon">🗓️</span>
            <input className="lfs-form-input" type="text" placeholder="如 2025.07.01" value={pendingDate} onChange={(e) => onDateChange(e.target.value)} />
          </div>
          <div className="lfs-form-row">
            <span className="lfs-form-icon">✏️</span>
            <input className="lfs-form-input" type="text" placeholder="备注（地点、心情…）" value={pendingNote} onChange={(e) => onNoteChange(e.target.value)} />
          </div>
        </div>
        <div className="lfs-photo-form-actions">
          <button className="lfs-photo-btn lfs-photo-cancel" onClick={onCancel}>取消</button>
          <button className="lfs-photo-btn lfs-photo-confirm" onClick={onConfirm}>加入第七卷 ✓</button>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="lfs-photo-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={photoIndex}
            className={`lfs-photo-slide ${allPhotos[photoIndex].isLivePhoto ? "live" : ""} ${photoIndex === 0 && newPhotoHighlight ? "new-frame" : ""}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            onMouseEnter={onPause}
            onMouseLeave={onResume}
          >
            {allPhotos[photoIndex].type === "video" ? (
              <video className="lfs-photo-media" src={allPhotos[photoIndex].url} autoPlay muted loop playsInline onEnded={() => onIndexChange((photoIndex + 1) % allPhotos.length)} />
            ) : (
              <img className="lfs-photo-media" src={allPhotos[photoIndex].url} alt={allPhotos[photoIndex].caption} loading="lazy" />
            )}
            {allPhotos[photoIndex].isLivePhoto && <span className="lfs-photo-live-badge">LIVE</span>}
          </motion.div>
        </AnimatePresence>
        {photoPaused && <div className="lfs-photo-paused-hint">⏸ 已暂停 · 移开继续</div>}
      </div>
      <p className="lfs-photo-caption">{allPhotos[photoIndex].caption}</p>
      <div className="lfs-photo-dots">
        {allPhotos.map((_, i) => <span key={i} className={`lfs-photo-dot ${i === photoIndex ? "active" : ""}`} onClick={() => onIndexChange(i)} />)}
      </div>
      <div className="lfs-photo-controls">
        <button className="lfs-photo-btn" onClick={() => onIndexChange((photoIndex - 1 + allPhotos.length) % allPhotos.length)}>‹ 上一张</button>
        <button className="lfs-photo-btn lfs-photo-stop" onClick={onClose}>⏹ 停止放映</button>
        <button className="lfs-photo-btn" onClick={() => onIndexChange((photoIndex + 1) % allPhotos.length)}>下一张 ›</button>
      </div>
    </>
  );
};

const LifeFilmSpace: React.FC<LifeFilmSpaceProps> = ({ onClose }) => {
  const filmTrackRef = useRef<HTMLDivElement>(null);
  const filmSceneRef = useRef<HTMLDivElement>(null);
  const [unrolled] = useState(true);
  const [customFrames, setCustomFrames] = useState<Frame[]>(loadCustomFrames);
  const [frameFormOpen, setFrameFormOpen] = useState(false);
  const [frameFormEmoji, setFrameFormEmoji] = useState("");
  const [frameFormName, setFrameFormName] = useState("");
  const [frameFormDesc, setFrameFormDesc] = useState("");
  const [frameFormTint, setFrameFormTint] = useState("#C4B89A");
  const [lightboxFrame, setLightboxFrame] = useState<number | null>(null);
  const [showMusic, setShowMusic] = useState(false);
  const [musicActivated, setMusicActivated] = useState(false);
  const [readingOpen, setReadingOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteFade, setQuoteFade] = useState(true);
  const [customBooks, setCustomBooks] = useState<BookData[]>(loadCustomBooks);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [formCover, setFormCover] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formQuotes, setFormQuotes] = useState("");

  // 合并内置 + 自定义图书
  const allBooks = useMemo(() => [...readingData, ...customBooks], [customBooks]);

  // 摄影放映机
  const [photoOpen, setPhotoOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [photoPaused, setPhotoPaused] = useState(false);
  const photoTimerRef = useRef<number | null>(null);
  const [customPhotos, setCustomPhotos] = useState<PhotoItem[]>(loadCustomPhotos);
  const [newPhotoHighlight, setNewPhotoHighlight] = useState(false);
  // 上传中待确认的图片 + 表单数据
  const [pendingPhotoUrl, setPendingPhotoUrl] = useState<string | null>(null);
  const [pendingCaption, setPendingCaption] = useState("");
  const [pendingDate, setPendingDate] = useState(() => new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "."));
  const [pendingNote, setPendingNote] = useState("");

  // 合并：自定义照片在最前
  const allPhotos = useMemo(() => [...customPhotos, ...photographyData], [customPhotos]);

  // 合并：内置帧 + 自定义帧
  const allFrames = useMemo(() => [...FRAMES, ...customFrames], [customFrames]);

  /* ===== 添加新胶片帧 ===== */
  const handleAddFrame = () => {
    const name = frameFormName.trim();
    if (!name) { alert("请输入模块名称"); return; }
    const newFrame: Frame = {
      id: Date.now().toString(),
      emoji: frameFormEmoji || "✨",
      name,
      desc: frameFormDesc.trim() || "自定义模块",
      detail: "点击查看详情",
      tint: frameFormTint,
      sound: "popcorn",
      isCustom: true,
    };
    const next = [...customFrames, newFrame];
    setCustomFrames(next);
    saveCustomFrames(next);
    setFrameFormOpen(false);
    setFrameFormEmoji("");
    setFrameFormName("");
    setFrameFormDesc("");
    setFrameFormTint("#C4B89A");
    playDing();
    // 滚动到最右显示新帧
    setTimeout(() => {
      if (filmTrackRef.current) {
        filmTrackRef.current.scrollTo({ left: filmTrackRef.current.scrollWidth, behavior: "smooth" });
      }
    }, 100);
  };

  /* ===== 胶片条横向滚动 ===== */
  const scrollFilm = (direction: "left" | "right") => {
    if (!filmTrackRef.current) return;
    const frameWidth = 136; // 帧宽度 + gap
    filmTrackRef.current.scrollBy({
      left: direction === "right" ? frameWidth * 2 : -frameWidth * 2,
      behavior: "smooth",
    });
  };

  const [meditating] = useState(false);
  const [hovering, setHovering] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  /* ===== Web Audio ===== */
  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  // 开场抽屉声
  const playDrawerOpen = useCallback(() => {
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.5);
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.5);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.6);
    } catch { /* noop */ }
  }, [getCtx]);

  // 叮确认音
  const playDing = useCallback(() => {
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.3);
    } catch { /* noop */ }
  }, [getCtx]);

  // 关闭声
  const playClose = useCallback(() => {
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.15);
    } catch { /* noop */ }
  }, [getCtx]);

  // 悬停反馈音
  const playHoverSound = useCallback((type: Frame["sound"]) => {
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      switch (type) {
        case "shutter": osc.type = "square"; osc.frequency.value = 900; break;
        case "vinyl": osc.type = "sawtooth"; osc.frequency.value = 140; break;
        case "page": osc.type = "sawtooth"; osc.frequency.setValueAtTime(280, now); osc.frequency.exponentialRampToValueAtTime(140, now + 0.06); break;
        case "step": osc.type = "sine"; osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.05); break;
        case "breathe": osc.type = "sine"; osc.frequency.value = 320; break;
        case "popcorn": osc.type = "triangle"; osc.frequency.setValueAtTime(600, now); osc.frequency.exponentialRampToValueAtTime(300, now + 0.04); break;
      }
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.06);
    } catch { /* noop */ }
  }, [getCtx]);

  /* ===== 入场 + 自动拉出 + ESC ===== */
  useEffect(() => {
    // 进入空间后立即滚动到顶部，确保标题和胶卷在视野内
    requestAnimationFrame(() => {
      const space = document.querySelector(".lfs-space") as HTMLElement | null;
      if (space) space.scrollTop = 0;
      window.scrollTo(0, 0);
    });

    playDrawerOpen();

    const handleKey = (e: KeyboardEvent) => {
      // 弹窗打开时，ESC 只关闭弹窗，不关闭整个胶片空间
      if (e.key === "Escape" && !showMusic && lightboxFrame === null && !readingOpen && !photoOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMusic, lightboxFrame, readingOpen, photoOpen]);

  const handleClose = useCallback(() => {
    playClose();
    setTimeout(onClose, 120);
  }, [playClose, onClose]);

  const handleSelectBook = (bookId: number) => {
    playDing();
    setSelectedBook(bookId);
    setQuoteIndex(0);
    setQuoteFade(true);
  };

  // 换一句语录（随机切换，带淡入淡出）
  const handleChangeQuote = () => {
    const book = allBooks.find((b) => b.id === selectedBook);
    if (!book || book.quotes.length <= 1) return;
    setQuoteFade(false);
    setTimeout(() => {
      let next = quoteIndex;
      while (next === quoteIndex) {
        next = Math.floor(Math.random() * book.quotes.length);
      }
      setQuoteIndex(next);
      setQuoteFade(true);
    }, 250);
  };

  // 图片上传转 base64
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFormCover(reader.result as string);
    reader.readAsDataURL(file);
  };

  // 提交自定义图书
  const handleAddBook = () => {
    if (!formTitle.trim() || !formCover) return;
    const newBook: BookData = {
      id: Date.now(),
      title: formTitle.trim(),
      author: formAuthor.trim() || "佚名",
      cover: formCover,
      quotes: formQuotes.trim()
        ? formQuotes.split(/\n+/).filter(Boolean)
        : ["这一卷，留给未来的自己书写。"],
    };
    const next = [...customBooks, newBook];
    setCustomBooks(next);
    saveCustomBooks(next);
    // 重置表单
    setFormCover(""); setFormTitle(""); setFormAuthor(""); setFormQuotes("");
    setAddFormOpen(false);
    playDing();
  };

  // 删除自定义图书
  const handleDeleteBook = (bookId: number) => {
    const next = customBooks.filter((b) => b.id !== bookId);
    setCustomBooks(next);
    saveCustomBooks(next);
    setSelectedBook(null);
  };

  // 关闭摄影放映机
  const closePhoto = useCallback(() => {
    setPhotoOpen(false);
    setPhotoIndex(0);
    setPhotoPaused(false);
    if (photoTimerRef.current) {
      clearTimeout(photoTimerRef.current);
      photoTimerRef.current = null;
    }
  }, []);

  // 上传新照片到第七卷胶片（先选图，再填表单）
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPendingPhotoUrl(reader.result as string);
      setPendingCaption("");
      setPendingDate(new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "."));
      setPendingNote("");
    };
    reader.onerror = () => {
      alert("读取图片失败，请重试");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // 确认添加照片（带表单数据）
  const handleConfirmPhoto = () => {
    if (!pendingPhotoUrl) return;
    const dateStr = pendingDate.trim() || new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, ".");
    const displayCaption = pendingCaption.trim()
      ? `${dateStr} · ${pendingCaption.trim()}`
      : `${dateStr} · 第七卷新帧`;
    const newPhoto: PhotoItem = {
      type: "photo",
      url: pendingPhotoUrl,
      caption: displayCaption,
      userCaption: pendingCaption.trim(),
      userDate: dateStr,
      userNote: pendingNote.trim(),
      isLivePhoto: false,
    };
    const next = [newPhoto, ...customPhotos];
    setCustomPhotos(next);
    saveCustomPhotos(next);
    setPhotoIndex(0);
    setNewPhotoHighlight(true);
    setTimeout(() => setNewPhotoHighlight(false), 2000);
    setPendingPhotoUrl(null);
    setPendingCaption("");
    setPendingNote("");
    playDing();
  };

  // 取消添加照片
  const handleCancelPhoto = () => {
    setPendingPhotoUrl(null);
    setPendingCaption("");
    setPendingNote("");
  };

  // 摄影自动播放 — 每张停留 4 秒，循环
  useEffect(() => {
    if (!photoOpen || photoPaused) {
      if (photoTimerRef.current) {
        clearTimeout(photoTimerRef.current);
        photoTimerRef.current = null;
      }
      return;
    }
    // 视频类型不自动切换，等视频结束
    if (allPhotos[photoIndex]?.type === "video") return;

    photoTimerRef.current = window.setTimeout(() => {
      setPhotoIndex((prev) => (prev + 1) % allPhotos.length);
    }, 4000);

    return () => {
      if (photoTimerRef.current) {
        clearTimeout(photoTimerRef.current);
        photoTimerRef.current = null;
      }
    };
  }, [photoOpen, photoPaused, photoIndex, allPhotos]);

  // ESC 关闭摄影
  useEffect(() => {
    if (!photoOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePhoto();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [photoOpen, closePhoto]);

  // 尘埃粒子
  const dustParticles = useRef(
    Array.from({ length: 18 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 6,
      duration: Math.random() * 4 + 5,
    }))
  ).current;

  // 散落光斑（虚化）
  const bokehSpots = useRef(
    Array.from({ length: 7 }, (_, i) => ({
      left: 8 + Math.random() * 84,
      top: 10 + Math.random() * 80,
      size: 40 + Math.random() * 50,
      delay: Math.random() * 5,
      duration: 7 + Math.random() * 5,
      tint: ["rgba(180,210,170,0.18)", "rgba(230,215,170,0.16)", "rgba(200,220,190,0.14)", "rgba(240,220,180,0.15)"][i % 4],
    }))
  ).current;

  // 散落音符（静态固定位置）
  const floatNotes = useRef(
    Array.from({ length: 5 }, () => ({
      left: 10 + Math.random() * 80,
      top: 15 + Math.random() * 70,
      glyph: ["♪", "♫", "♩", "♬", "♭"][Math.floor(Math.random() * 5)],
    }))
  ).current;

  return (
    <>
      <motion.div
        className="lfs-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="lfs-backdrop" onClick={handleClose} />

      <motion.div
        className="lfs-space"
        initial={{ y: "100vh", opacity: 0.6 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100vh", opacity: 0.6 }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* 手绘抖动滤镜 */}
        <div dangerouslySetInnerHTML={{ __html: `<svg width="0" height="0"><filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8"/></filter></svg>` }} />

        {/* 尘埃粒子 */}
        <div className="lfs-dust">
          {dustParticles.map((d, i) => (
            <span
              key={i}
              className="lfs-dust-particle"
              style={{
                left: `${d.left}%`, top: `${d.top}%`,
                width: `${d.size}px`, height: `${d.size}px`,
                animationDelay: `${d.delay}s`, animationDuration: `${d.duration}s`,
              }}
            />
          ))}
        </div>

        {/* 胶片颗粒纹理 */}
        <div className="lfs-film-grain" aria-hidden="true" />

        {/* 静态划痕 */}
        <div className="lfs-bg-scratches" aria-hidden="true" />

        {/* 散落虚化光斑 */}
        <div className="lfs-bokeh" aria-hidden="true">
          {bokehSpots.map((b, i) => (
            <span
              key={i}
              className="lfs-bokeh-spot"
              style={{
                left: `${b.left}%`, top: `${b.top}%`,
                width: `${b.size}px`, height: `${b.size}px`,
                background: b.tint,
                animationDelay: `${b.delay}s`, animationDuration: `${b.duration}s`,
              }}
            />
          ))}
        </div>

        {/* 散落音符（静态） */}
        <div className="lfs-float-notes" aria-hidden="true">
          {floatNotes.map((n, i) => (
            <span
              key={i}
              className="lfs-float-note"
              style={{
                left: `${n.left}%`, top: `${n.top}%`,
              }}
            >
              {n.glyph}
            </span>
          ))}
        </div>

        {/* 左上角带嫩芽的树枝 */}
        <div className="lfs-branch" aria-hidden="true">
          <svg viewBox="0 0 120 90" width="120" height="90" fill="none">
            <path d="M0 10 Q30 14 60 22 Q85 28 110 38" stroke="#7a6a4a" strokeWidth="2.5" strokeLinecap="round" filter="url(#rough)" />
            <path d="M30 14 Q34 6 40 4" stroke="#7a6a4a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M60 22 Q64 14 70 12" stroke="#7a6a4a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <ellipse cx="40" cy="4" rx="5" ry="3.5" fill="#9aba8a" transform="rotate(-20 40 4)" filter="url(#rough)" />
            <ellipse cx="70" cy="12" rx="5" ry="3.5" fill="#8aaa7a" transform="rotate(-15 70 12)" filter="url(#rough)" />
            <ellipse cx="108" cy="38" rx="6" ry="4" fill="#a8ca8a" transform="rotate(20 108 38)" filter="url(#rough)" />
            <circle cx="46" cy="3" r="2" fill="#c8e0b0" />
          </svg>
        </div>

        {/* 右下角迷你小熊（治愈系，会眨眼+点头） */}
        <div className="lfs-bear" aria-hidden="true">
          <svg viewBox="0 0 80 80" width="52" height="52" fill="none">
            {/* 身体 */}
            <ellipse cx="40" cy="56" rx="20" ry="16" fill="#f5ead6" stroke="#8a7a5a" strokeWidth="1.5" filter="url(#rough)" />
            {/* 头 */}
            <circle cx="40" cy="32" r="16" fill="#f5ead6" stroke="#8a7a5a" strokeWidth="1.5" filter="url(#rough)" />
            {/* 耳朵 */}
            <circle cx="28" cy="20" r="5" fill="#d4a878" stroke="#8a7a5a" strokeWidth="1.5" filter="url(#rough)" />
            <circle cx="52" cy="20" r="5" fill="#d4a878" stroke="#8a7a5a" strokeWidth="1.5" filter="url(#rough)" />
            {/* 眼睛（眨眼） */}
            <g className="lfs-bear-eyes">
              <ellipse cx="34" cy="30" rx="1.8" ry="2.2" fill="#4a3a2a" />
              <ellipse cx="46" cy="30" rx="1.8" ry="2.2" fill="#4a3a2a" />
            </g>
            {/* 鼻子 */}
            <ellipse cx="40" cy="36" rx="2" ry="1.5" fill="#8a6a5a" />
            {/* 嘴 */}
            <path d="M40 38 Q37 41 35 39 M40 38 Q43 41 45 39" stroke="#8a7a5a" strokeWidth="1" fill="none" strokeLinecap="round" />
            {/* 腮红 */}
            <circle cx="29" cy="35" r="2.5" fill="#f0c8c0" opacity="0.5" />
            <circle cx="51" cy="35" r="2.5" fill="#f0c8c0" opacity="0.5" />
          </svg>
        </div>

        {/* 关闭按钮 */}
        <button className="lfs-close" onClick={handleClose} aria-label="合上胶卷">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {/* 标题 */}
        <header className="lfs-hero">
          <motion.h1 className="lfs-title" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            生活放映中 🎞️
          </motion.h1>
          <motion.div className="lfs-subtitle-block" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <p className="lfs-sub-line">如果把人生比作一整卷胶片：</p>
            <p className="lfs-sub-line">前六卷都在寻找光，却忘了自己是光。</p>
            <p className="lfs-sub-line">现在，终于轮到第七卷登场啦！</p>
            <p className="lfs-sub-line">这里装着我私藏的六个快乐碎片。</p>
            <p className="lfs-sub-line">别客气，随便点开看看——</p>
            <p className="lfs-sub-line">是我为自己预留的补光时刻。<span className="lfs-sparkle">✨</span></p>
          </motion.div>
        </header>

        {/* ===== 手绘立体胶卷场景（始终展开） ===== */}
        <motion.div
          ref={filmSceneRef}
          className={`lfs-film-scene unrolled ${hovering ? "hovering" : ""}`}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {/* 左滚动箭头 */}
          <button className="lfs-scroll-arrow lfs-scroll-left" onClick={(e) => { e.stopPropagation(); scrollFilm("left"); }} aria-label="向左滚动">‹</button>

          {/* 左侧胶卷罐（柯达200） */}
          <div className="lfs-canister">
            <div className="lfs-canister-top" />
            <div className="lfs-canister-body">
              <span className="lfs-kodak-label">KODAK</span>
              <span className="lfs-kodak-num">200</span>
              <span className="lfs-kodak-info">35mm · 36exp.</span>
            </div>
            <div className="lfs-canister-bottom" />
            {/* 胶片出口缝 */}
            <div className="lfs-canister-slit" />
          </div>

          {/* 胶卷条（从罐里拉出） */}
          <div className="lfs-film-track">
            <div className="lfs-film-strip">
              {/* 顶部齿孔 */}
              <div className="lfs-perfs lfs-perfs-top">
                {Array.from({ length: 30 }).map((_, i) => (
                  <span key={i} className="lfs-perf" />
                ))}
              </div>

              {/* 帧画面 */}
              <div className="lfs-frames">
                {allFrames.map((frame) => (
                  <motion.div
                    key={frame.id || frame.name}
                    className={`lfs-frame ${frame.name.includes("冥想") && meditating ? "meditate" : ""} ${readingOpen ? (frame.name.includes("阅读") ? "reading-active" : "dimmed") : ""}`}
                    style={{ "--tint": frame.tint } as React.CSSProperties}
                    onClick={(e) => { e.stopPropagation(); /* 帧只展示，不打开模块 */ }}
                    onHoverStart={() => unrolled && playHoverSound(frame.sound)}
                    whileHover={unrolled && !readingOpen ? { scale: 1.06, y: -3 } : {}}
                  >
                    {/* 帧凹陷阴影 */}
                    <div className="lfs-frame-inset" />
                    {/* 帧内容 */}
                    <span className="lfs-frame-emoji">{frame.emoji}</span>
                    <span className="lfs-frame-name">{frame.name}</span>
                    {frame.name.includes("音乐") && unrolled && (
                      <span className="lfs-frame-badge">♪</span>
                    )}
                    {frame.name.includes("冥想") && meditating && (
                      <span className="lfs-frame-badge">呼吸中</span>
                    )}
                  </motion.div>
                ))}

                {/* 添加新帧按钮 */}
                {!frameFormOpen && (
                  <motion.button
                    className="lfs-frame lfs-add-frame-btn"
                    onClick={(e) => { e.stopPropagation(); setFrameFormOpen(true); }}
                    whileHover={unrolled ? { scale: 1.06, y: -3 } : {}}
                    title="添加新胶片帧"
                  >
                    <div className="lfs-frame-inset" />
                    <span className="lfs-frame-emoji">＋</span>
                    <span className="lfs-frame-name">新帧</span>
                  </motion.button>
                )}
              </div>

              {/* 底部齿孔 */}
              <div className="lfs-perfs lfs-perfs-bottom">
                {Array.from({ length: 30 }).map((_, i) => (
                  <span key={i} className="lfs-perf" />
                ))}
              </div>

              {/* 胶卷厚度侧面（深色阴影） */}
              <div className="lfs-film-edge" />
            </div>

          {/* 右侧手绘小猫 */}
          <div className="lfs-cat">
            <svg viewBox="0 0 100 120" width="60" height="72" fill="none" className="lfs-cat-svg">
              {/* 身体 */}
              <ellipse cx="50" cy="78" rx="28" ry="22" fill="#fff" stroke="#5a4a3a" strokeWidth="2" filter="url(#rough)" />
              {/* 头 */}
              <circle cx="50" cy="42" r="20" fill="#fff" stroke="#5a4a3a" strokeWidth="2" filter="url(#rough)" />
              {/* 左耳 */}
              <path d="M34 30 L28 14 L42 26 Z" fill="#fff" stroke="#5a4a3a" strokeWidth="2" filter="url(#rough)" />
              {/* 右耳 */}
              <path d="M66 30 L72 14 L58 26 Z" fill="#fff" stroke="#5a4a3a" strokeWidth="2" filter="url(#rough)" />
              {/* 左耳内 */}
              <path d="M36 27 L33 20 L39 25 Z" fill="#f0c8c0" />
              {/* 右耳内 */}
              <path d="M64 27 L67 20 L61 25 Z" fill="#f0c8c0" />
              {/* 眼睛（睁眼椭圆 + 瞳孔）— 加眨眼动画 */}
              <g className="lfs-cat-eyes">
                <ellipse cx="43" cy="40" rx="2.5" ry="3.5" fill="#fff" stroke="#5a4a3a" strokeWidth="1" />
                <ellipse cx="57" cy="40" rx="2.5" ry="3.5" fill="#fff" stroke="#5a4a3a" strokeWidth="1" />
                <circle cx="43" cy="40" r="1.8" fill="#3a6a8a" />
                <circle cx="57" cy="40" r="1.8" fill="#3a6a8a" />
                <circle cx="43.5" cy="39" r="0.6" fill="#fff" />
                <circle cx="57.5" cy="39" r="0.6" fill="#fff" />
              </g>
              {/* 鼻子 */}
              <path d="M48 46 L50 48 L52 46 Z" fill="#e0a090" />
              {/* 嘴 */}
              <path d="M50 48 Q46 52 44 50 M50 48 Q54 52 56 50" stroke="#5a4a3a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              {/* 胡须 */}
              <line x1="30" y1="46" x2="40" y2="47" stroke="#5a4a3a" strokeWidth="0.8" />
              <line x1="30" y1="50" x2="40" y2="50" stroke="#5a4a3a" strokeWidth="0.8" />
              <line x1="70" y1="46" x2="60" y2="47" stroke="#5a4a3a" strokeWidth="0.8" />
              <line x1="70" y1="50" x2="60" y2="50" stroke="#5a4a3a" strokeWidth="0.8" />
              {/* 尾巴 */}
              <path d="M76 80 Q92 70 88 52" stroke="#5a4a3a" strokeWidth="2.5" fill="none" strokeLinecap="round" filter="url(#rough)" />
              {/* Zzz 睡眠符号 */}
              <text x="72" y="24" fontSize="10" fill="#a09a7a" fontFamily="serif" fontStyle="italic" filter="url(#rough)">z</text>
              <text x="78" y="16" fontSize="8" fill="#c0baa0" fontFamily="serif" fontStyle="italic">z</text>
            </svg>
          </div>
        </div>

        {/* 新帧表单 */}
        {frameFormOpen && (
          <motion.div
            className="lfs-frame-form"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="lfs-frame-form-title">添加新胶片帧 ✨</p>
            <div className="lfs-frame-form-row">
              <span className="lfs-frame-form-label">图标</span>
              <input className="lfs-frame-form-input" type="text" placeholder="如 📷 🎨 🎮" value={frameFormEmoji} onChange={(e) => setFrameFormEmoji(e.target.value)} maxLength={4} />
            </div>
            <div className="lfs-frame-form-row">
              <span className="lfs-frame-form-label">名称</span>
              <input className="lfs-frame-form-input" type="text" placeholder="模块名称" value={frameFormName} onChange={(e) => setFrameFormName(e.target.value)} autoFocus />
            </div>
            <div className="lfs-frame-form-row">
              <span className="lfs-frame-form-label">描述</span>
              <input className="lfs-frame-form-input" type="text" placeholder="简短描述" value={frameFormDesc} onChange={(e) => setFrameFormDesc(e.target.value)} />
            </div>
            <div className="lfs-frame-form-row">
              <span className="lfs-frame-form-label">色调</span>
              <div className="lfs-frame-form-tints">
                {["#C4B89A","#A8B8A0","#C8A8A0","#D4A882","#9AB8B0","#D4C896","#B8A0C8","#A0B8C8"].map((c) => (
                  <button key={c} className={`lfs-tint-dot ${frameFormTint === c ? "active" : ""}`} style={{ background: c }} onClick={() => setFrameFormTint(c)} />
                ))}
              </div>
            </div>
            <div className="lfs-frame-form-actions">
              <button className="lfs-frame-form-cancel" onClick={() => { setFrameFormOpen(false); }}>取消</button>
              <button className="lfs-frame-form-confirm" onClick={handleAddFrame}>确认添加 ✓</button>
            </div>
          </motion.div>
        )}

        </motion.div>

        {/* ===== 阅读书架模态框 ===== */}
        <AnimatePresence>
          {readingOpen && (
            <motion.div
              className="lfs-reading-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => { setReadingOpen(false); setSelectedBook(null); }}
            >
              <motion.div
                className="lfs-reading-modal"
                initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="lfs-reading-close" onClick={() => { setReadingOpen(false); setSelectedBook(null); }}>×</button>
                <h3 className="lfs-reading-title">近期阅读笔记 ✍️</h3>

                {/* 书架 / 详情切换 */}
                <div className="lfs-reading-body">
                  <AnimatePresence mode="wait">
                    {selectedBook === null ? (
                      /* 书架视图 */
                      <motion.div
                        key="shelf"
                        className="lfs-book-shelf"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {allBooks.map((book) => {
                          const isCustom = customBooks.some((b) => b.id === book.id);
                          return (
                            <motion.div
                              key={book.id}
                              className="lfs-book-item"
                              whileHover={{ y: -5 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              onClick={() => handleSelectBook(book.id)}
                            >
                              <div className="lfs-book-cover-wrap">
                                <img src={book.cover} alt={book.title} className="lfs-book-cover" loading="lazy" />
                                <div className="lfs-book-spine" />
                                {isCustom && <span className="lfs-book-tag-mine">我的</span>}
                              </div>
                              <p className="lfs-book-name">《{book.title}》</p>
                              <p className="lfs-book-author">{book.author}</p>
                            </motion.div>
                          );
                        })}

                        {/* 续写一卷 — 添加按钮 */}
                        <motion.div
                          className="lfs-book-item lfs-book-add"
                          whileHover={{ y: -5 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          onClick={() => setAddFormOpen(true)}
                        >
                          <div className="lfs-book-add-cover">
                            <span className="lfs-book-add-icon">＋</span>
                          </div>
                          <p className="lfs-book-name">续写一卷</p>
                          <p className="lfs-book-author">添加你的书</p>
                        </motion.div>
                      </motion.div>
                    ) : (
                      /* 详情视图 */
                      <motion.div
                        key="detail"
                        className="lfs-book-detail"
                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.35 }}
                      >
                        {(() => {
                          const book = allBooks.find((b) => b.id === selectedBook)!;
                          const isCustom = customBooks.some((b) => b.id === book.id);
                          return (
                            <>
                              <div className="lfs-detail-top">
                                <button className="lfs-book-back" onClick={() => setSelectedBook(null)}>← 返回书架</button>
                                {isCustom && (
                                  <button className="lfs-book-delete" onClick={() => handleDeleteBook(book.id)}>删除</button>
                                )}
                              </div>
                              <div className="lfs-detail-content">
                                <div className="lfs-detail-left">
                                  <img src={book.cover} alt={book.title} className="lfs-detail-cover" />
                                </div>
                                <div className="lfs-detail-right">
                                  <h4 className="lfs-detail-title">《{book.title}》</h4>
                                  <p className="lfs-detail-author">{book.author}</p>
                                  <div className="lfs-detail-quote-wrap">
                                    <span className="lfs-detail-quote-mark">❝</span>
                                    <p className={`lfs-detail-quote ${quoteFade ? "fade-in" : "fade-out"}`}>
                                      {book.quotes[quoteIndex]}
                                    </p>
                                  </div>
                                  <button className="lfs-quote-change" onClick={handleChangeQuote}>
                                    换一句 ↻
                                  </button>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== 添加图书表单 ===== */}
        <AnimatePresence>
          {addFormOpen && (
            <motion.div
              className="lfs-reading-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setAddFormOpen(false)}
            >
              <motion.div
                className="lfs-reading-modal lfs-add-modal"
                initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="lfs-reading-close" onClick={() => setAddFormOpen(false)}>×</button>
                <h3 className="lfs-reading-title">续写一卷 ✍️</h3>
                <p className="lfs-add-subtitle">把喜欢的书，留在自己的胶片里。</p>

                <div className="lfs-add-form">
                  {/* 封面上传 */}
                  <div className="lfs-add-field">
                    <label className="lfs-add-label">封面图</label>
                    <div className="lfs-add-cover-area">
                      {formCover ? (
                        <img src={formCover} alt="预览" className="lfs-add-cover-preview" />
                      ) : (
                        <div className="lfs-add-cover-placeholder">点击上传封面</div>
                      )}
                      <input type="file" accept="image/*" onChange={handleCoverUpload} className="lfs-add-file-input" />
                    </div>
                  </div>

                  {/* 书名 */}
                  <div className="lfs-add-field">
                    <label className="lfs-add-label">书名</label>
                    <input
                      type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="如：小王子" className="lfs-add-input"
                    />
                  </div>

                  {/* 作者 */}
                  <div className="lfs-add-field">
                    <label className="lfs-add-label">作者</label>
                    <input
                      type="text" value={formAuthor} onChange={(e) => setFormAuthor(e.target.value)}
                      placeholder="如：圣埃克苏佩里" className="lfs-add-input"
                    />
                  </div>

                  {/* 语录 */}
                  <div className="lfs-add-field">
                    <label className="lfs-add-label">喜欢的话 <span className="lfs-add-hint">（每行一句）</span></label>
                    <textarea
                      value={formQuotes} onChange={(e) => setFormQuotes(e.target.value)}
                      placeholder={"真正重要的东西，用眼睛是看不见的。\n用心去看才看得清楚。"}
                      className="lfs-add-textarea" rows={4}
                    />
                  </div>

                  <button
                    className="lfs-add-submit"
                    onClick={handleAddBook}
                    disabled={!formTitle.trim() || !formCover}
                  >
                    收入书架
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== 摄影放映机 ===== */}
        <AnimatePresence>
          {photoOpen && (
            <motion.div
              className="lfs-photo-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="lfs-projector-frame"
                initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                transition={{ type: "spring", stiffness: 240, damping: 26 }}
              >
                {/* 上传按钮 */}
                <label className="lfs-photo-upload" title="添加新照片到第七卷">
                  <span className="lfs-upload-plus">＋</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/heic"
                    onChange={handlePhotoUpload}
                    style={{ display: "none" }}
                  />
                </label>

                {/* 顶部齿孔 */}
                <div className="lfs-photo-perfs lfs-photo-perfs-top">
                  {Array.from({ length: 16 }).map((_, i) => <span key={i} className="lfs-photo-perf" />)}
                </div>
                {/* 底部齿孔 */}
                <div className="lfs-photo-perfs lfs-photo-perfs-bottom">
                  {Array.from({ length: 16 }).map((_, i) => <span key={i} className="lfs-photo-perf" />)}
                </div>

                {/* ===== 待填表单视图 ===== */}
                <PhotoProjectorContent
                  pendingPhotoUrl={pendingPhotoUrl}
                  pendingCaption={pendingCaption}
                  pendingDate={pendingDate}
                  pendingNote={pendingNote}
                  onCaptionChange={setPendingCaption}
                  onDateChange={setPendingDate}
                  onNoteChange={setPendingNote}
                  onConfirm={handleConfirmPhoto}
                  onCancel={handleCancelPhoto}
                  allPhotos={allPhotos}
                  photoIndex={photoIndex}
                  photoPaused={photoPaused}
                  newPhotoHighlight={newPhotoHighlight}
                  onPause={() => setPhotoPaused(true)}
                  onResume={() => setPhotoPaused(false)}
                  onIndexChange={setPhotoIndex}
                  onClose={closePhoto}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* ===== 灯箱 ===== */}
      <AnimatePresence>
        {lightboxFrame !== null && (
          <motion.div
            className="lfs-lightbox-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightboxFrame(null)}
          >
            <motion.div
              className="lfs-lightbox"
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              style={{ borderTopColor: FRAMES[lightboxFrame].tint }}
            >
              <button className="lfs-lightbox-close" onClick={() => setLightboxFrame(null)}>×</button>
              <div className="lfs-lightbox-icon">{FRAMES[lightboxFrame].emoji}</div>
              <h3 className="lfs-lightbox-name">{FRAMES[lightboxFrame].name}</h3>
              <p className="lfs-lightbox-desc">{FRAMES[lightboxFrame].desc}</p>
              <div className="lfs-lightbox-detail">
                <p className="lfs-lightbox-detail-label">更多细节</p>
                <p className="lfs-lightbox-detail-text">{FRAMES[lightboxFrame].detail}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== 枯木生歌 · 老式放映机 ===== */}
      <AnimatePresence>
        {showMusic && (
          <motion.div
            className="lfs-music-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { setShowMusic(false); setMusicActivated(false); }}
          >
            {/* 胶片颗粒 + 划痕覆盖层 */}
            <div className="lfs-grain" aria-hidden="true" />
            <div className="lfs-scratches" aria-hidden="true" />

            <motion.div
              className="lfs-projector"
              initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 40 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 四周齿孔取景框 */}
              <div className="lfs-proj-perfs lfs-proj-perfs-top">
                {Array.from({ length: 14 }).map((_, i) => <span key={i} className="lfs-proj-perf" />)}
              </div>
              <div className="lfs-proj-perfs lfs-proj-perfs-bottom">
                {Array.from({ length: 14 }).map((_, i) => <span key={i} className="lfs-proj-perf" />)}
              </div>

              {/* 关闭按钮 */}
              <button className="lfs-music-close" onClick={() => { setShowMusic(false); setMusicActivated(false); }}>×</button>

              {/* 迷你胶片计数器 */}
              <span className="lfs-counter">07</span>

              {/* 放映镜头 + 胶片卷轴 */}
              <div
                className="lfs-lens-area"
                onClick={() => { if (!musicActivated) { playDing(); setMusicActivated(true); } }}
              >
                <div className={`lfs-lens ${musicActivated ? "lit" : ""}`} />
                <motion.div
                  className="lfs-reel"
                  animate={{ rotate: musicActivated ? 360 : 0 }}
                  transition={{ duration: 14, repeat: musicActivated ? Infinity : 0, ease: "linear" }}
                >
                  <span className="lfs-reel-ring" />
                  <span className="lfs-reel-ring r2" />
                  <span className="lfs-reel-ring r3" />
                  <span className="lfs-reel-ring r4" />
                  <span className="lfs-reel-core" />
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} className="lfs-reel-dot" style={{ "--a": `${i * 45}deg` } as React.CSSProperties} />
                  ))}
                </motion.div>

                {/* 胶片碎屑（音符）从卷轴飘出 */}
                {musicActivated && [0, 1, 2, 3, 4].map((i) => (
                  <motion.span
                    key={i}
                    className="lfs-debris"
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                    animate={{
                      x: [0, (i % 2 ? 1 : -1) * (30 + i * 12)],
                      y: [-10, -60 - i * 14],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.3],
                    }}
                    transition={{ duration: 2.4, delay: i * 0.5, repeat: Infinity, repeatDelay: 1 }}
                  >
                    {["♪", "♫", "♪", "♩", "♫"][i]}
                  </motion.span>
                ))}

                {/* 未激活提示 */}
                {!musicActivated && <span className="lfs-lens-hint">点击启动放映机</span>}
              </div>

              {/* 主标题（镜头下方） */}
              <h2 className="lfs-music-title">枯木生歌</h2>
              <motion.p
                className="lfs-music-tagline"
                initial={{ opacity: 0.25 }}
                animate={{ opacity: musicActivated ? 1 : 0.25 }}
                transition={{ duration: 0.8 }}
              >
                大地的诗歌从未消亡。
              </motion.p>

              {/* 胶片字幕列表 */}
              <div className="lfs-credits">
                {MUSIC_TRACKS.map((track, i) => (
                  <motion.div
                    key={track.title}
                    className={`lfs-credit ${musicActivated ? "developed" : ""}`}
                    initial={{ opacity: 0.2, x: -16 }}
                    animate={{ opacity: musicActivated ? 1 : 0.22, x: 0 }}
                    transition={{ delay: musicActivated ? 0.3 + i * 0.12 : 0, duration: 0.5 }}
                    whileHover={musicActivated ? { scale: 1.03, x: 4 } : {}}
                  >
                    <span className="lfs-credit-no">第7卷·第{i + 1}帧</span>
                    <div className="lfs-credit-info">
                      <span className="lfs-credit-type">{track.type}</span>
                      <span className="lfs-credit-title">{track.title}</span>
                      <span className="lfs-credit-desc">{track.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="lfs-music-foot">这不是播放器，是收藏夹 · 一个人的精神角落</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .lfs-root { position: fixed; inset: 0; z-index: 500; font-family: "Noto Sans SC", system-ui, sans-serif; overflow: hidden; }
        .lfs-backdrop { position: absolute; inset: 0; background: rgba(10,10,10,0.55); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }

        /* ===== 主空间 — 浅绿+米黄手绘纸底 ===== */
        .lfs-space {
          position: absolute; inset: 0;
          height: 100vh; height: 100dvh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background:
            radial-gradient(ellipse at 30% 20%, rgba(225,240,220,0.7) 0%, transparent 55%),
            radial-gradient(ellipse at 70% 80%, rgba(240,232,210,0.7) 0%, transparent 55%),
            linear-gradient(160deg, #EFF2E8 0%, #F5F0E1 45%, #EDE8D8 100%);
          overflow: hidden;
          padding: 24px 20px;
          /* 隐藏滚动条 */
          scrollbar-width: none; -ms-overflow-style: none;
        }
        .lfs-space::-webkit-scrollbar { display: none; }

        /* ===== 尘埃粒子 ===== */
        .lfs-dust { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
        .lfs-dust-particle {
          position: absolute; border-radius: 50%;
          background: rgba(160,140,100,0.3);
          animation: lfs-float linear infinite;
        }
        @keyframes lfs-float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-60px) translateX(20px); opacity: 0; }
        }

        /* ===== 胶片颗粒纹理（静态） ===== */
        .lfs-film-grain {
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.6'/%3E%3C/svg%3E");
          opacity: 0.07; mix-blend-mode: multiply;
        }

        /* ===== 静态划痕 ===== */
        .lfs-bg-scratches {
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          background: repeating-linear-gradient(94deg,
            transparent 0, transparent 90px,
            rgba(140,120,80,0.05) 90px, rgba(140,120,80,0.05) 92px,
            transparent 92px, transparent 200px,
            rgba(140,120,80,0.03) 200px, rgba(140,120,80,0.03) 201px);
          opacity: 0.5;
        }

        /* ===== 散落虚化光斑（静态） ===== */
        .lfs-bokeh { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
        .lfs-bokeh-spot {
          position: absolute; border-radius: 50%;
          filter: blur(8px);
          opacity: 0.5;
        }

        /* ===== 散落音符（静态） ===== */
        .lfs-float-notes { position: absolute; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
        .lfs-float-note {
          position: absolute;
          font-size: 20px; color: rgba(150,170,140,0.22);
          filter: blur(0.5px);
        }

        /* ===== 左上角带嫩芽的树枝（静态） ===== */
        .lfs-branch {
          position: absolute; top: 60px; left: 0; z-index: 1;
          opacity: 0.5; pointer-events: none;
        }

        /* ===== 右下角迷你小熊（静态） ===== */
        .lfs-bear {
          position: absolute; right: 24px; bottom: 70px; z-index: 1;
          opacity: 0.42; pointer-events: none;
        }

        /* ===== 关闭按钮 ===== */
        .lfs-close {
          position: fixed; top: 20px; right: 24px; z-index: 20;
          width: 42px; height: 42px; border: none; border-radius: 50%;
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 4px 16px -4px rgba(0,0,0,0.12);
          color: #6b5a4a; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.25s ease, color 0.25s ease;
        }
        .lfs-close:hover { transform: rotate(90deg); color: #d4877a; }

        /* ===== 标题 — 纸面质感 ===== */
        .lfs-hero { text-align: center; margin-bottom: 20px; z-index: 3; position: relative; padding: 8px 0; flex-shrink: 0; }
        .lfs-hero::before {
          content: ""; position: absolute; left: 50%; bottom: 0; transform: translateX(-50%);
          width: 320px; height: 180px; pointer-events: none;
          background: radial-gradient(ellipse at center, rgba(255,220,150,0.22) 0%, transparent 70%);
          z-index: -1;
        }
        .lfs-title { font-family: "Noto Serif SC", Georgia, serif; font-size: clamp(28px,4.2vw,38px); font-weight: 700; color: #3a3a3a; margin: 0 0 18px; letter-spacing: 0.1em; }
        .lfs-subtitle-block { font-family: "Noto Serif SC", Georgia, serif; line-height: 1.7; }
        .lfs-sub-line { font-size: 14px; color: #666; margin: 0; letter-spacing: 0.02em; }
        .lfs-sparkle { display: inline-block; animation: lfs-sparkle-breathe 2s ease-in-out infinite; }
        @keyframes lfs-sparkle-breathe {
          0%, 100% { opacity: 0.4; transform: scale(0.92); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        /* ===== 胶卷场景容器 ===== */
        .lfs-film-scene {
          position: relative; z-index: 2; flex-shrink: 0;
          display: flex; align-items: center; justify-content: flex-start;
          gap: 0; width: 100%; max-width: 1200px;
          perspective: 800px;
          transition: filter 0.3s ease;
          scrollbar-width: none; -ms-overflow-style: none;
          padding-bottom: 4px;
        }
        .lfs-film-scene::-webkit-scrollbar { display: none; }
        .lfs-film-scene.hovering { filter: brightness(1.05); }

        /* 左侧淡出遮罩 — 前六卷模糊 */
        .lfs-film-scene::before {
          content: ""; position: absolute; top: 0; bottom: 8px; left: 0; width: 90px;
          background: linear-gradient(90deg, #EFF2E8 0%, rgba(239,242,232,0.6) 60%, transparent 100%);
          z-index: 5; pointer-events: none;
        }
        /* 右侧空白胶片延伸 — 未来 */
        .lfs-film-scene::after {
          content: ""; position: absolute; top: 50%; right: -40px; transform: translateY(-50%);
          width: 120px; height: 96px;
          background: repeating-linear-gradient(0deg, #1a1814 0, #1a1814 14px, #0d0b08 14px, #0d0b08 28px);
          border-radius: 2px; opacity: 0.25;
          -webkit-mask-image: linear-gradient(90deg, #000 0%, transparent 100%);
          mask-image: linear-gradient(90deg, #000 0%, transparent 100%);
          z-index: 1; pointer-events: none;
        }

        /* ===== 胶卷罐（柯达200） ===== */
        .lfs-canister {
          position: relative; flex-shrink: 0;
          width: 72px; height: 120px; z-index: 3;
          transition: transform 0.3s ease;
        }
        .lfs-film-scene.hovering .lfs-canister { transform: scale(1.03); }

        .lfs-canister-top {
          position: absolute; top: 0; left: 0; right: 0; height: 14px;
          background: linear-gradient(180deg, #3a3a3a, #1a1a1a);
          border-radius: 50% 50% 8px 8px / 60% 60% 100% 100%;
          box-shadow: inset 0 -2px 4px rgba(0,0,0,0.4);
        }
        .lfs-canister-body {
          position: absolute; top: 12px; bottom: 12px; left: 0; right: 0;
          background: linear-gradient(90deg, #d4882a 0%, #f5a623 40%, #e89818 60%, #c47a1a 100%);
          border-radius: 4px;
          box-shadow: 0 4px 16px -4px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 3px; padding: 4px;
        }
        .lfs-canister-bottom {
          position: absolute; bottom: 0; left: 0; right: 0; height: 14px;
          background: linear-gradient(180deg, #1a1a1a, #2a2a2a);
          border-radius: 8px 8px 50% 50% / 100% 100% 60% 60%;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.4);
        }
        .lfs-kodak-label { font-size: 8px; font-weight: 800; color: #1a1a1a; letter-spacing: 0.08em; font-family: Helvetica, Arial, sans-serif; }
        .lfs-kodak-num { font-size: 18px; font-weight: 900; color: #1a1a1a; font-family: Helvetica, Arial, sans-serif; line-height: 1; }
        .lfs-kodak-info { font-size: 6px; color: #3a2a1a; letter-spacing: 0.04em; }
        .lfs-canister-slit {
          position: absolute; top: 50%; right: -2px;
          width: 6px; height: 3px; transform: translateY(-50%);
          background: #1a1a1a; border-radius: 1px;
          box-shadow: inset 0 1px 1px rgba(0,0,0,0.6);
        }

        /* ===== 胶卷轨道 ===== */
        .lfs-film-track {
          overflow-x: auto; overflow-y: hidden;
          height: 120px; position: relative;
          scrollbar-width: none; -ms-overflow-style: none;
          scroll-behavior: smooth;
        }
        .lfs-film-track::-webkit-scrollbar { display: none; }

        /* ===== 胶卷条 ===== */
        .lfs-film-strip {
          position: absolute; top: 0; left: 0; height: 100%;
          display: flex; flex-direction: column;
          background: #1a1814;
          border-radius: 2px;
          box-shadow: 0 6px 20px -6px rgba(0,0,0,0.3);
          transform-origin: left center;
          transform: scaleX(0);
          transition: transform 1.4s cubic-bezier(0.25, 0.1, 0.25, 1.05);
          /* 固定宽度 = 8帧×133 + padding，确保完整显示 */
          width: 1120px;
        }
        .lfs-film-scene.unrolled .lfs-film-strip {
          transform: scaleX(1);
        }

        /* 胶卷厚度侧面 — 深色伪元素 */
        .lfs-film-edge {
          position: absolute; top: 2px; left: 0; right: 0; height: 100%;
          background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 8%, transparent 92%, rgba(0,0,0,0.4) 100%);
          border-radius: 2px; pointer-events: none;
        }

        /* 齿孔行 */
        .lfs-perfs {
          display: flex; flex-shrink: 0; height: 14px;
          align-items: center; gap: 6px; padding: 0 8px;
          background: #0d0b08;
        }
        .lfs-perfs-top { box-shadow: inset 0 -2px 3px rgba(0,0,0,0.6); }
        .lfs-perfs-bottom { box-shadow: inset 0 2px 3px rgba(0,0,0,0.6); }
        .lfs-perf {
          width: 10px; height: 6px; border-radius: 1.5px;
          background: #F5F0E1;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.5), 0 0 1px rgba(245,240,225,0.3);
        }

        /* 帧区域 */
        .lfs-frames {
          display: flex; gap: 3px; padding: 3px 8px;
          flex: 1; align-items: center;
        }
        .lfs-frame {
          flex-shrink: 0; width: 130px; height: 78px;
          border-radius: 3px;
          background: var(--tint, #C4B89A);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 3px;
          cursor: pointer; position: relative;
          box-shadow: inset 0 2px 6px rgba(0,0,0,0.4), inset 0 -1px 2px rgba(255,255,255,0.1);
          opacity: 0;
          transform: translateX(-30px);
          transition: opacity 0.4s ease, transform 0.4s ease;
          overflow: hidden;
        }
        .lfs-film-scene.unrolled .lfs-frame {
          opacity: 1; transform: translateX(0);
        }
        /* 逐帧延迟展开 */
        .lfs-film-scene.unrolled .lfs-frame:nth-child(1) { transition-delay: 0.3s; }
        .lfs-film-scene.unrolled .lfs-frame:nth-child(2) { transition-delay: 0.45s; }
        .lfs-film-scene.unrolled .lfs-frame:nth-child(3) { transition-delay: 0.6s; }
        .lfs-film-scene.unrolled .lfs-frame:nth-child(4) { transition-delay: 0.75s; }
        .lfs-film-scene.unrolled .lfs-frame:nth-child(5) { transition-delay: 0.9s; }
        .lfs-film-scene.unrolled .lfs-frame:nth-child(6) { transition-delay: 1.05s; }

        .lfs-frame-inset {
          position: absolute; inset: 0; border-radius: 3px;
          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.2);
          pointer-events: none;
        }
        .lfs-frame-emoji { font-size: 28px; filter: sepia(0.3) contrast(0.9); z-index: 1; }
        .lfs-frame-name {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 12px; font-weight: 700; color: #3a2a1a;
          letter-spacing: 0.06em; z-index: 1;
        }
        .lfs-frame-badge {
          font-size: 9px; color: #5a4a3a; z-index: 1;
          letter-spacing: 0.1em; font-weight: 600;
        }
        .lfs-frame.meditate { animation: lfs-breathe 3s ease-in-out infinite; }
        @keyframes lfs-breathe {
          0%,100% { filter: brightness(1); }
          50% { filter: brightness(1.15); }
        }

        /* ===== 添加新帧按钮 ===== */
        .lfs-add-frame-btn {
          background: rgba(255,255,255,0.25) !important;
          border: 2px dashed rgba(90,74,58,0.35) !important;
          cursor: pointer;
          font-family: inherit;
        }
        .lfs-add-frame-btn:hover {
          background: rgba(255,255,255,0.4) !important;
          border-color: rgba(90,74,58,0.6) !important;
        }
        .lfs-add-frame-btn .lfs-frame-emoji { font-size: 28px; color: #5a4a3a; filter: none; }
        .lfs-add-frame-btn .lfs-frame-name { color: #5a4a3a; font-size: 12px; }

        /* ===== 新帧表单 ===== */
        .lfs-frame-form {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          z-index: 30; width: 320px;
          background: rgba(253,247,238,0.96); border-radius: 12px;
          border: 1.5px solid rgba(90,74,58,0.25);
          box-shadow: 0 16px 48px -12px rgba(0,0,0,0.4);
          padding: 20px; display: flex; flex-direction: column; gap: 10px;
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        }
        .lfs-frame-form-title { font-family: "Noto Serif SC", serif; font-size: 15px; font-weight: 600; color: #3a2a1a; margin: 0 0 4px; text-align: center; }
        .lfs-frame-form-row { display: flex; align-items: center; gap: 8px; }
        .lfs-frame-form-label { font-size: 12px; color: #7a6a5a; width: 36px; flex-shrink: 0; }
        .lfs-frame-form-input {
          flex: 1; background: rgba(255,255,255,0.6); border: 1px solid rgba(90,74,58,0.2);
          border-radius: 6px; padding: 5px 10px; font-size: 13px; color: #3a2a1a;
          font-family: "Noto Sans SC", sans-serif; outline: none;
          transition: border-color 0.2s;
        }
        .lfs-frame-form-input:focus { border-color: rgba(90,74,58,0.5); }
        .lfs-frame-form-input::placeholder { color: #b0a090; }
        .lfs-frame-form-tints { display: flex; gap: 6px; flex-wrap: wrap; }
        .lfs-tint-dot {
          width: 20px; height: 20px; border-radius: 50%; border: 2px solid transparent;
          cursor: pointer; transition: border-color 0.2s, transform 0.2s;
        }
        .lfs-tint-dot.active { border-color: #3a2a1a; transform: scale(1.15); }
        .lfs-tint-dot:hover { transform: scale(1.1); }
        .lfs-frame-form-actions { display: flex; gap: 8px; justify-content: center; margin-top: 4px; }
        .lfs-frame-form-cancel {
          padding: 6px 16px; border-radius: 6px; border: 1px solid rgba(90,74,58,0.3);
          background: rgba(90,74,58,0.08); color: #7a6a5a; font-size: 13px; cursor: pointer;
          transition: background 0.2s;
        }
        .lfs-frame-form-cancel:hover { background: rgba(90,74,58,0.15); }
        .lfs-frame-form-confirm {
          padding: 6px 16px; border-radius: 6px; border: none;
          background: rgba(154,184,176,0.3); color: #5a7a6a; font-size: 13px; cursor: pointer;
          font-weight: 500; transition: background 0.2s;
        }
        .lfs-frame-form-confirm:hover { background: rgba(154,184,176,0.5); }

        /* ===== 右侧手绘小猫 ===== */
        .lfs-cat {
          position: absolute; right: 20px; bottom: -30px; z-index: 4;
          opacity: 0.85;
          animation: lfs-cat-breathe 3s ease-in-out infinite;
        }
        @keyframes lfs-cat-breathe {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .lfs-cat-svg { overflow: visible; }
        /* 小猫眨眼动画 — 每4秒一次，闭合0.3秒 */
        .lfs-cat-eyes {
          transform-origin: 50px 40px;
          animation: lfs-blink 4s ease-in-out infinite;
        }
        @keyframes lfs-blink {
          0%, 90% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
          100% { transform: scaleY(1); }
        }

        /* hover 脉冲 */
        .lfs-film-scene.hovering .lfs-film-strip {
          animation: lfs-pulse 2s ease-in-out infinite;
        }
        @keyframes lfs-pulse {
          0%,100% { filter: brightness(1); }
          50% { filter: brightness(1.08); }
        }

        /* ===== 胶片条滚动箭头 ===== */
        .lfs-scroll-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          z-index: 20; width: 32px; height: 32px;
          border-radius: 50%; border: 1.5px solid rgba(90,74,58,0.4);
          background: rgba(253,247,238,0.85); color: #5a4a3a;
          font-size: 18px; line-height: 1; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.3s, background 0.2s, border-color 0.2s, box-shadow 0.2s;
          backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
          opacity: 0; pointer-events: none;
        }
        .lfs-film-scene.unrolled .lfs-scroll-arrow {
          opacity: 1; pointer-events: auto;
        }
        .lfs-scroll-left { left: -16px; }
        .lfs-scroll-right { right: -16px; }
        .lfs-scroll-arrow:hover {
          background: rgba(253,247,238,1); border-color: rgba(90,74,58,0.8);
          box-shadow: 0 4px 12px -3px rgba(90,74,58,0.25);
        }
        .lfs-scroll-arrow:active {
          transform: translateY(-50%) scale(0.93);
        }

        /* ===== 帧状态：阅读展开时 ===== */
        .lfs-frame.dimmed { opacity: 0.3; filter: blur(1px); transition: opacity 0.4s ease, filter 0.4s ease; }
        .lfs-frame.reading-active {
          transform: scale(1.25) rotate(-4deg);
          z-index: 8;
          box-shadow: inset 0 2px 6px rgba(0,0,0,0.4), 0 8px 24px -6px rgba(196,184,154,0.5);
          transition: transform 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }

        /* ===== 阅读书架模态框 ===== */
        .lfs-reading-overlay {
          position: fixed; inset: 0; z-index: 530;
          display: flex; align-items: center; justify-content: center; padding: 24px;
          background: rgba(20,16,10,0.55); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          overflow: hidden;
        }
        .lfs-reading-modal {
          position: relative; width: 100%; max-width: 520px; max-height: 88vh; overflow-y: auto;
          padding: 32px 28px 24px;
          border-radius: 18px;
          background: rgba(255,250,240,0.92);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(196,184,154,0.4);
          box-shadow: 0 20px 60px -16px rgba(80,60,40,0.35);
        }
        .lfs-reading-modal::-webkit-scrollbar { width: 4px; }
        .lfs-reading-modal::-webkit-scrollbar-thumb { background: rgba(160,140,100,0.3); border-radius: 2px; }
        .lfs-reading-close {
          position: absolute; top: 14px; right: 16px; z-index: 5;
          width: 30px; height: 30px; border: none; border-radius: 50%;
          background: rgba(160,140,100,0.12); color: #8a7a5a;
          font-size: 18px; cursor: pointer; line-height: 1;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.25s ease, color 0.25s ease;
        }
        .lfs-reading-close:hover { background: rgba(160,140,100,0.25); color: #5a4a3a; }
        .lfs-reading-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 18px; font-weight: 700; color: #4a3a2a;
          margin: 0 0 20px; letter-spacing: 0.06em; text-align: center;
        }

        /* 书架视图 — 3列网格 */
        .lfs-book-shelf {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px 16px;
          padding: 4px 0 8px;
        }
        .lfs-book-item { cursor: pointer; text-align: center; }
        .lfs-book-cover-wrap {
          position: relative; width: 100%; aspect-ratio: 2/3; margin-bottom: 8px;
          border-radius: 4px; overflow: hidden;
          box-shadow: 0 4px 14px -4px rgba(80,60,40,0.3);
          transition: box-shadow 0.3s ease;
        }
        .lfs-book-item:hover .lfs-book-cover-wrap {
          box-shadow: 0 10px 24px -6px rgba(80,60,40,0.4);
        }
        .lfs-book-cover { width: 100%; height: 100%; object-fit: cover; display: block; }
        .lfs-book-spine {
          position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
          background: linear-gradient(90deg, rgba(0,0,0,0.25), transparent);
        }
        .lfs-book-name {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 12px; font-weight: 600; color: #4a3a2a; margin: 0 0 2px;
        }
        .lfs-book-author { font-size: 10px; color: #8a7a5a; margin: 0; }

        /* 详情视图 */
        .lfs-book-detail { position: relative; }
        .lfs-book-back {
          border: none; background: none; cursor: pointer;
          font-size: 12px; color: #8a7a5a; margin-bottom: 16px; padding: 4px 0;
          letter-spacing: 0.04em; transition: color 0.25s ease;
        }
        .lfs-book-back:hover { color: #5a4a3a; }
        .lfs-detail-content { display: flex; gap: 20px; align-items: flex-start; }
        .lfs-detail-left { flex-shrink: 0; width: 120px; }
        .lfs-detail-cover {
          width: 120px; height: 180px; object-fit: cover; border-radius: 4px;
          box-shadow: 0 8px 22px -6px rgba(80,60,40,0.4);
        }
        .lfs-detail-right { flex: 1; min-width: 0; }
        .lfs-detail-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 17px; font-weight: 700; color: #3a2a1a; margin: 0 0 4px;
        }
        .lfs-detail-author { font-size: 12px; color: #8a7a5a; margin: 0 0 16px; }
        .lfs-detail-quote-wrap {
          position: relative; padding: 14px 14px 14px 32px;
          background: rgba(245,240,225,0.6); border-radius: 10px; margin-bottom: 14px;
        }
        .lfs-detail-quote-mark {
          position: absolute; top: 10px; left: 10px;
          font-size: 20px; color: rgba(160,140,100,0.5); line-height: 1;
        }
        .lfs-detail-quote {
          font-family: "Noto Serif SC", Georgia, serif;
          font-style: italic; font-size: 13px; line-height: 1.8; color: #5a4a3a; margin: 0;
          transition: opacity 0.25s ease;
        }
        .lfs-detail-quote.fade-in { opacity: 1; }
        .lfs-detail-quote.fade-out { opacity: 0; }
        .lfs-quote-change {
          border: 1px solid rgba(160,140,100,0.4); background: rgba(245,240,225,0.4);
          color: #6a5a4a; font-size: 12px; padding: 6px 16px;
          border-radius: 999px; cursor: pointer; letter-spacing: 0.06em;
          transition: background 0.25s ease, color 0.25s ease;
        }
        .lfs-quote-change:hover { background: rgba(160,140,100,0.2); color: #4a3a2a; }

        /* 详情顶部 — 返回 + 删除 */
        .lfs-detail-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .lfs-book-delete {
          border: 1px solid rgba(180,100,80,0.3); background: rgba(220,180,170,0.2);
          color: #9a5a4a; font-size: 11px; padding: 4px 12px;
          border-radius: 999px; cursor: pointer; letter-spacing: 0.06em;
          transition: background 0.25s ease, color 0.25s ease;
        }
        .lfs-book-delete:hover { background: rgba(200,140,130,0.35); color: #7a3a2a; }

        /* 自定义书标记 */
        .lfs-book-tag-mine {
          position: absolute; top: 4px; right: 4px; z-index: 2;
          font-size: 8px; color: #fff; background: rgba(180,140,80,0.8);
          padding: 1px 6px; border-radius: 999px; letter-spacing: 0.05em;
        }

        /* 续写一卷 — 添加按钮 */
        .lfs-book-add { cursor: pointer; }
        .lfs-book-add-cover {
          width: 100%; aspect-ratio: 2/3; margin-bottom: 8px;
          border-radius: 4px; border: 2px dashed rgba(160,140,100,0.4);
          display: flex; align-items: center; justify-content: center;
          background: rgba(245,240,225,0.3);
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .lfs-book-add:hover .lfs-book-add-cover {
          border-color: rgba(160,140,100,0.7);
          background: rgba(245,240,225,0.5);
        }
        .lfs-book-add-icon { font-size: 32px; color: rgba(160,140,100,0.5); font-weight: 300; }

        /* 添加表单 */
        .lfs-add-subtitle { font-size: 12px; color: #8a7a5a; text-align: center; margin: 0 0 20px; letter-spacing: 0.04em; }
        .lfs-add-form { display: flex; flex-direction: column; gap: 16px; }
        .lfs-add-field { display: flex; flex-direction: column; gap: 6px; }
        .lfs-add-label { font-size: 12px; color: #6a5a4a; letter-spacing: 0.04em; font-weight: 600; }
        .lfs-add-hint { font-size: 10px; color: #a09a7a; font-weight: 400; }
        .lfs-add-cover-area { position: relative; width: 100px; height: 150px; }
        .lfs-add-cover-preview { width: 100px; height: 150px; object-fit: cover; border-radius: 4px; box-shadow: 0 4px 14px -4px rgba(80,60,40,0.3); }
        .lfs-add-cover-placeholder {
          width: 100px; height: 150px; border-radius: 4px; border: 2px dashed rgba(160,140,100,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: #a09a7a; text-align: center; padding: 8px;
          background: rgba(245,240,225,0.3); cursor: pointer;
          transition: border-color 0.25s ease;
        }
        .lfs-add-cover-placeholder:hover { border-color: rgba(160,140,100,0.7); }
        .lfs-add-file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .lfs-add-input {
          width: 100%; padding: 8px 12px; border-radius: 8px;
          border: 1px solid rgba(160,140,100,0.3); background: rgba(255,255,255,0.6);
          font-size: 13px; color: #4a3a2a; font-family: inherit; outline: none;
          transition: border-color 0.25s ease;
        }
        .lfs-add-input:focus { border-color: rgba(160,140,100,0.6); }
        .lfs-add-textarea {
          width: 100%; padding: 10px 12px; border-radius: 8px;
          border: 1px solid rgba(160,140,100,0.3); background: rgba(255,255,255,0.6);
          font-size: 13px; color: #4a3a2a; font-family: inherit; outline: none; resize: vertical;
          line-height: 1.7; transition: border-color 0.25s ease;
        }
        .lfs-add-textarea:focus { border-color: rgba(160,140,100,0.6); }
        .lfs-add-submit {
          margin-top: 4px; padding: 10px; border-radius: 999px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #c4a060, #d4a040); color: #fff;
          font-size: 14px; font-weight: 600; letter-spacing: 0.08em;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .lfs-add-submit:hover:not(:disabled) { transform: translateY(-1px); }
        .lfs-add-submit:disabled { opacity: 0.4; cursor: not-allowed; }

        @media (max-width: 480px) {
          .lfs-reading-modal { padding: 28px 18px 20px; }
          .lfs-book-shelf { grid-template-columns: repeat(3, 1fr); gap: 14px 10px; }
          .lfs-book-name { font-size: 11px; }
          .lfs-book-author { font-size: 9px; }
          .lfs-detail-content { flex-direction: column; align-items: center; }
          .lfs-detail-left { width: 100px; }
          .lfs-detail-cover { width: 100px; height: 150px; }
          .lfs-detail-right { width: 100%; }
          .lfs-detail-quote { font-size: 12px; }
        }

        /* ===== 摄影放映机 ===== */
        .lfs-photo-overlay { position: fixed; inset: 0; z-index: 540; display: flex; align-items: center; justify-content: center; padding: 24px; background: rgba(8,6,4,0.88); backdrop-filter: blur(8px); overflow: hidden; }
        .lfs-projector-frame {
          position: relative; width: 100%; max-width: 640px;
          background: #0d0a08; border-radius: 8px;
          border: 2px solid #2a2018;
          box-shadow: 0 24px 72px -16px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.5);
          padding: 24px 20px 20px;
          max-height: 88vh; overflow-y: auto;
        }

        /* 上传按钮 */
        .lfs-photo-upload {
          position: absolute; top: -14px; right: 16px; z-index: 10;
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.25s ease, border-color 0.25s ease;
        }
        .lfs-photo-upload:hover { background: rgba(255,255,255,0.35); border-color: rgba(255,255,255,0.8); }
        .lfs-upload-plus { color: rgba(255,255,255,0.7); font-size: 16px; font-weight: 300; line-height: 1; }
        .lfs-upload-spinner {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.2); border-top-color: rgba(255,255,255,0.8);
          animation: lfs-spin 0.7s linear infinite;
        }
        @keyframes lfs-spin { to { transform: rotate(360deg); } }

        /* 新帧高亮描边 */
        .lfs-photo-slide.new-frame { animation: lfs-new-glow 2s ease-out; }
        @keyframes lfs-new-glow {
          0% { box-shadow: 0 0 0 0 rgba(232,184,80,0.8), inset 0 0 20px rgba(0,0,0,0.6); }
          50% { box-shadow: 0 0 24px 6px rgba(232,184,80,0.5), inset 0 0 20px rgba(0,0,0,0.6); }
          100% { box-shadow: 0 0 0 0 rgba(232,184,80,0), inset 0 0 20px rgba(0,0,0,0.6); }
        }
        /* 齿孔 */
        .lfs-photo-perfs { display: flex; justify-content: center; gap: 8px; height: 12px; }
        .lfs-photo-perfs-top { position: absolute; top: 6px; left: 0; right: 0; }
        .lfs-photo-perfs-bottom { position: absolute; bottom: 6px; left: 0; right: 0; }
        .lfs-photo-perf { width: 10px; height: 6px; border-radius: 1.5px; background: #d4a040; opacity: 0.35; box-shadow: inset 0 1px 2px rgba(0,0,0,0.6); }

        /* 放映窗口 */
        .lfs-photo-screen { position: relative; width: 80%; margin: 16px auto 14px; aspect-ratio: 4/3; overflow: hidden; border-radius: 4px; background: #000; box-shadow: inset 0 0 20px rgba(0,0,0,0.6); }
        .lfs-photo-slide { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .lfs-photo-slide.live { animation: lfs-live-shake 3s ease-in-out infinite; }
        @keyframes lfs-live-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-1.5px) translateY(1px); }
          50% { transform: translateX(1px) translateY(-1px); }
          75% { transform: translateX(-1px) translateY(0.5px); }
        }
        .lfs-photo-slide:hover { transform: scale(1.05); transition: transform 0.3s ease; }
        .lfs-photo-media { width: 100%; height: 100%; object-fit: cover; }
        .lfs-photo-live-badge { position: absolute; top: 8px; left: 8px; font-family: "Courier New", monospace; font-size: 9px; color: #fff; background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 2px; letter-spacing: 0.1em; }
        .lfs-photo-paused-hint { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); font-size: 10px; color: rgba(255,255,255,0.6); letter-spacing: 0.1em; background: rgba(0,0,0,0.5); padding: 3px 10px; border-radius: 999px; }

        /* caption */
        .lfs-photo-caption { font-size: 12px; color: #8a7a5a; text-align: center; margin: 0 0 14px; letter-spacing: 0.04em; font-style: italic; }

        /* 进度点 */
        .lfs-photo-dots { display: flex; justify-content: center; gap: 8px; margin-bottom: 14px; }
        .lfs-photo-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(160,140,100,0.25); cursor: pointer; transition: background 0.25s ease, transform 0.25s ease; }
        .lfs-photo-dot.active { background: #d4a040; transform: scale(1.3); }
        .lfs-photo-dot:hover { background: rgba(212,160,64,0.6); }

        /* 控制按钮 */
        .lfs-photo-controls { display: flex; justify-content: center; align-items: center; gap: 12px; }
        .lfs-photo-btn { padding: 6px 16px; border-radius: 999px; border: 1px solid rgba(160,140,100,0.3); background: rgba(212,160,64,0.08); color: #8a7a5a; font-size: 12px; cursor: pointer; letter-spacing: 0.04em; transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease; }
        .lfs-photo-btn:hover { background: rgba(212,160,64,0.2); color: #d4a040; border-color: rgba(212,160,64,0.5); }
        .lfs-photo-stop { background: rgba(180,80,60,0.12); border-color: rgba(180,80,60,0.3); color: #b06050; }
        .lfs-photo-stop:hover { background: rgba(180,80,60,0.25); color: #d07060; border-color: rgba(180,80,60,0.5); }

        /* ===== 照片上传表单 ===== */
        .lfs-photo-form-view {
          width: 100%; max-width: 480px; margin: 0 auto;
          display: flex; flex-direction: column; gap: 14px;
        }
        .lfs-photo-form-preview {
          width: 100%; aspect-ratio: 4/3; overflow: hidden; border-radius: 4px;
          background: #000; box-shadow: inset 0 0 20px rgba(0,0,0,0.6);
        }
        .lfs-photo-form-img { width: 100%; height: 100%; object-fit: cover; }
        .lfs-photo-form-fields { display: flex; flex-direction: column; gap: 8px; }
        .lfs-form-row {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.05); border-radius: 6px;
          border: 1px solid rgba(212,160,64,0.18); padding: 6px 10px;
        }
        .lfs-form-icon { font-size: 14px; flex-shrink: 0; }
        .lfs-form-input {
          flex: 1; background: none; border: none; outline: none;
          color: #c8b888; font-size: 13px; font-family: "Noto Sans SC", sans-serif;
          letter-spacing: 0.03em;
        }
        .lfs-form-input::placeholder { color: rgba(200,184,136,0.4); }
        .lfs-photo-form-actions {
          display: flex; gap: 10px; justify-content: center;
        }
        .lfs-photo-cancel {
          background: rgba(100,80,80,0.15); border-color: rgba(160,120,120,0.3); color: #a08080;
        }
        .lfs-photo-cancel:hover { background: rgba(160,80,80,0.2); color: #c09090; }
        .lfs-photo-confirm {
          background: rgba(212,160,64,0.15); border-color: rgba(212,160,64,0.4); color: #d4a040;
        }
        .lfs-photo-confirm:hover { background: rgba(212,160,64,0.28); color: #e8b850; }

        /* ===== 底部提示 ===== */
        .lfs-foot { margin-top: 12px; z-index: 2; font-size: 11px; color: #a09a7a; letter-spacing: 0.1em; text-align: center; flex-shrink: 0; }

        @media (max-width: 480px) {
          .lfs-projector-frame { padding: 20px 12px 16px; }
          .lfs-photo-screen { width: 100%; }
          .lfs-photo-btn { padding: 5px 12px; font-size: 11px; }
          .lfs-photo-controls { gap: 8px; }
        }

        /* ===== 灯箱 ===== */
        .lfs-lightbox-overlay { position: fixed; inset: 0; z-index: 510; display: flex; align-items: center; justify-content: center; padding: 24px; background: rgba(0,0,0,0.35); backdrop-filter: blur(6px); overflow: hidden; }
        .lfs-lightbox { position: relative; width: 100%; max-width: 400px; max-height: 88vh; overflow-y: auto; padding: 32px; border-radius: 18px; background: #fffdf8; border-top: 4px solid var(--tint,#C4B89A); box-shadow: 0 20px 56px -12px rgba(0,0,0,0.2); text-align: center; }
        .lfs-lightbox-close { position: absolute; top: 12px; right: 12px; width: 30px; height: 30px; border: none; border-radius: 50%; background: rgba(0,0,0,0.05); color: #999; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .lfs-lightbox-close:hover { background: rgba(0,0,0,0.1); }
        .lfs-lightbox-icon { font-size: 44px; margin-bottom: 14px; }
        .lfs-lightbox-name { font-family: "Noto Serif SC", serif; font-size: 20px; font-weight: 600; color: #4a3a2a; margin-bottom: 10px; }
        .lfs-lightbox-desc { font-size: 13px; line-height: 1.7; color: #7a6a5a; margin-bottom: 18px; }
        .lfs-lightbox-detail { padding: 14px; border-radius: 10px; background: #f5f0e1; text-align: left; }
        .lfs-lightbox-detail-label { font-size: 10px; color: #8a7a5a; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 5px; }
        .lfs-lightbox-detail-text { font-size: 12px; line-height: 1.7; color: #7a6a5a; margin: 0; }

        /* ===== 枯木生歌 · 老式放映机 ===== */
        .lfs-music-overlay { position: fixed; inset: 0; z-index: 520; display: flex; align-items: center; justify-content: center; background: #0d0a08; padding: 24px; overflow: hidden; }

        /* 胶片颗粒 */
        .lfs-grain {
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
          opacity: 0.12; mix-blend-mode: overlay;
          animation: lfs-grain-shift 0.3s steps(3) infinite;
        }
        @keyframes lfs-grain-shift {
          0% { transform: translate(0,0); }
          33% { transform: translate(-4px,2px); }
          66% { transform: translate(3px,-3px); }
          100% { transform: translate(-2px,1px); }
        }
        /* 划痕 */
        .lfs-scratches {
          position: absolute; inset: 0; pointer-events: none; z-index: 2;
          background: repeating-linear-gradient(90deg, transparent 0, transparent 3px, rgba(255,240,200,0.04) 3px, rgba(255,240,200,0.04) 4px);
          opacity: 0.6;
        }

        /* 放映机取景框 */
        .lfs-projector {
          position: relative; z-index: 3;
          max-width: 420px; width: 100%; max-height: 88vh; overflow-y: auto;
          padding: 40px 30px 26px;
          border-radius: 6px;
          background: linear-gradient(180deg, #1a1410 0%, #0d0a08 100%);
          border: 2px solid #3a2a1a;
          box-shadow: 0 24px 72px -16px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.5);
          text-align: center;
        }
        .lfs-projector::-webkit-scrollbar { width: 4px; }
        .lfs-projector::-webkit-scrollbar-thumb { background: #3a2a1a; border-radius: 2px; }

        /* 取景框齿孔 */
        .lfs-proj-perfs { display: flex; justify-content: center; gap: 8px; height: 12px; padding: 0 10px; }
        .lfs-proj-perfs-top { position: absolute; top: 0; left: 0; right: 0; background: #0d0a08; }
        .lfs-proj-perfs-bottom { position: absolute; bottom: 0; left: 0; right: 0; background: #0d0a08; }
        .lfs-proj-perf { width: 10px; height: 6px; border-radius: 1.5px; background: #d4a040; opacity: 0.4; box-shadow: inset 0 1px 2px rgba(0,0,0,0.6); }

        .lfs-music-close { position: absolute; top: 14px; right: 14px; z-index: 10; width: 30px; height: 30px; border: 1px solid #4a3a2a; border-radius: 4px; background: rgba(212,160,64,0.08); color: #8a7a5a; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: monospace; }
        .lfs-music-close:hover { background: rgba(212,160,64,0.2); color: #d4a040; }

        /* 胶片计数器 */
        .lfs-counter { position: absolute; top: 14px; left: 14px; z-index: 10; font-family: "Courier New", monospace; font-size: 11px; color: #d4a040; letter-spacing: 0.15em; padding: 2px 8px; border: 1px solid #4a3a2a; border-radius: 2px; background: rgba(0,0,0,0.4); }

        /* 放映镜头 + 卷轴区域 */
        .lfs-lens-area { position: relative; width: 150px; height: 150px; margin: 8px auto 18px; cursor: pointer; }
        .lfs-lens {
          position: absolute; inset: 0; border-radius: 50%;
          background: radial-gradient(circle at 50% 50%, #1a1410 0%, #0d0a08 70%);
          border: 3px solid #3a2a1a;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.8), 0 0 0 6px #1a1410, 0 0 0 7px #3a2a1a;
          transition: all 0.6s ease;
        }
        .lfs-lens.lit {
          background: radial-gradient(circle at 50% 50%, rgba(232,184,80,0.35) 0%, rgba(212,160,64,0.12) 40%, #1a1410 75%);
          border-color: #6a5030;
          box-shadow: inset 0 0 30px rgba(232,184,80,0.2), 0 0 30px rgba(212,160,64,0.25), 0 0 0 6px #1a1410, 0 0 0 7px #5a4530;
        }

        /* 胶片卷轴（枯木桩→年轮同心圆） */
        .lfs-reel { position: absolute; top: 50%; left: 50%; width: 100px; height: 100px; margin: -50px 0 0 -50px; border-radius: 50%; }
        .lfs-reel-ring { position: absolute; top: 50%; left: 50%; border-radius: 50%; border: 1px solid rgba(212,160,64,0.25); transform: translate(-50%,-50%); width: 100px; height: 100px; }
        .lfs-reel-ring.r2 { width: 74px; height: 74px; }
        .lfs-reel-ring.r3 { width: 50px; height: 50px; }
        .lfs-reel-ring.r4 { width: 28px; height: 28px; }
        .lfs-reel-core { position: absolute; top: 50%; left: 50%; width: 12px; height: 12px; margin: -6px 0 0 -6px; border-radius: 50%; background: #3a2a1a; box-shadow: 0 0 6px rgba(212,160,64,0.3); }
        .lfs-reel-dot { position: absolute; top: 50%; left: 50%; width: 5px; height: 5px; margin: -2.5px 0 0 -2.5px; border-radius: 50%; background: rgba(212,160,64,0.4); transform: rotate(var(--a)) translateX(38px); }

        /* 胶片碎屑（音符） */
        .lfs-debris { position: absolute; top: 50%; left: 50%; font-size: 16px; color: rgba(212,160,64,0.7); text-shadow: 0 0 6px rgba(212,160,64,0.4); pointer-events: none; }

        .lfs-lens-hint { position: absolute; bottom: -22px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #6a5a4a; letter-spacing: 0.12em; white-space: nowrap; animation: lfs-hint-blink 2s ease-in-out infinite; }
        @keyframes lfs-hint-blink { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }

        /* 主标题 — 手写体+颗粒感 */
        .lfs-music-title { font-family: "Noto Serif SC", Georgia, serif; font-size: 22px; font-weight: 700; color: #e8b850; margin: 0 0 6px; letter-spacing: 0.15em; text-shadow: 0 0 12px rgba(212,160,64,0.3), 0 1px 2px rgba(0,0,0,0.5); font-style: italic; }
        .lfs-music-tagline { font-family: "Noto Serif SC", Georgia, serif; font-size: 11px; color: #8a7a5a; margin: 0 0 20px; letter-spacing: 0.1em; font-style: italic; transition: opacity 0.8s ease; }

        /* 胶片字幕列表 */
        .lfs-credits { display: flex; flex-direction: column; gap: 8px; text-align: left; margin-bottom: 16px; }
        .lfs-credit { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 4px; background: rgba(212,160,64,0.04); border: 1px solid rgba(58,42,26,0.6); border-left: 3px solid #3a2a1a; cursor: pointer; transition: border-color 0.3s ease, background 0.3s ease; }
        .lfs-credit.developed { border-left-color: #d4a040; }
        .lfs-credit:hover { background: rgba(212,160,64,0.1); border-left-color: #e8b850; }
        .lfs-credit-no { flex-shrink: 0; font-family: "Courier New", monospace; font-size: 9px; color: #6a5030; letter-spacing: 0.08em; writing-mode: vertical-rl; text-orientation: upright; line-height: 1.2; }
        .lfs-credit-info { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
        .lfs-credit-type { font-family: "Courier New", monospace; font-size: 8px; color: #d4a040; letter-spacing: 0.15em; text-transform: uppercase; }
        .lfs-credit-title { font-family: "Noto Serif SC", serif; font-size: 13px; font-weight: 600; color: #e0d0b0; font-style: italic; }
        .lfs-credit-desc { font-size: 10px; color: #6a5a4a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .lfs-music-foot { font-size: 10px; color: #4a3a2a; letter-spacing: 0.08em; margin: 0; padding-top: 12px; border-top: 1px solid rgba(58,42,26,0.6); font-style: italic; }

        @media (max-width: 480px) {
          .lfs-projector { padding: 36px 18px 20px; }
          .lfs-lens-area { width: 120px; height: 120px; }
          .lfs-reel { width: 80px; height: 80px; margin: -40px 0 0 -40px; }
          .lfs-reel-ring { width: 80px; height: 80px; }
          .lfs-reel-ring.r2 { width: 58px; height: 58px; }
          .lfs-reel-ring.r3 { width: 38px; height: 38px; }
          .lfs-reel-ring.r4 { width: 20px; height: 20px; }
          .lfs-reel-dot { transform: rotate(var(--a)) translateX(30px); }
          .lfs-music-title { font-size: 19px; }
        }

        /* ===== 移动端 ===== */
        @media (max-width: 768px) {
          .lfs-space { padding: 16px 12px; justify-content: center; }
          .lfs-hero { margin-bottom: 14px; padding: 4px 0; }
          .lfs-title { font-size: 22px; margin-bottom: 10px; }
          .lfs-sub-line { font-size: 12px; }
          .lfs-film-scene { gap: 0; }
          .lfs-film-scene::before { width: 56px; }
          .lfs-film-scene::after { display: none; }
          .lfs-canister { width: 56px; height: 100px; }
          .lfs-kodak-num { font-size: 14px; }
          .lfs-film-track { height: 100px; }
          .lfs-frame { width: 110px; height: 64px; }
          .lfs-frame-emoji { font-size: 24px; }
          .lfs-frame-name { font-size: 11px; }
          .lfs-cat { right: 8px; bottom: -20px; }
          .lfs-cat svg { width: 44px; height: 53px; }
          .lfs-bear { right: 10px; bottom: 50px; opacity: 0.35; }
          .lfs-bear svg { width: 38px; height: 38px; }
          .lfs-branch { opacity: 0.35; transform: scale(0.75); transform-origin: top left; }
          .lfs-foot { margin-top: 12px; font-size: 10px; }
        }
      `}</style>
    </motion.div>
    </>
  );
};

export default LifeFilmSpace;
