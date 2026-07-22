import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  type UserState,
  type Recommendation,
  type Badge,
  type MoodType,
  type CompletionRecord,
  TAGGED_NODES,
  TAG_MAP,
  getRecommendations,
  loadHistory,
  saveCompletion,
  getTodayCount,
  getStreakDays,
  getBadges,
  getMoodMode,
  MOOD_MODE_MAP,
  extractPreferenceKeywords,
} from "./rechargeTags";

/**
 * 回血清单 · 微型能量站
 *
 * 四Tab架构：首页 / 清单 / 统计 / 我的
 * 延续暖白心电图设计语言，主色 #7C6A9A / 浅紫 #B8A9D9
 */

/* ============================================================
   数据
   ============================================================ */

/** 线性图标池 — 根据索引循环分配 */
const ICON_POOL = ["✉️", "📚", "🎧", "🚶", "🍪", "💍", "🏛️", "🍢", "🛒", "💆",
  "🧺", "☕", "🎁", "🏪", "🚌", "🚲", "🎭", "🐱", "🎡", "📷",
  "🎬", "💅", "💄", "🏊", "🌄", "📹", "📦", "🦒", "🐦", "🎨",
  "🎵", "📹", "📧", "📝", "🍽️", "🥗", "🛏️", "🧸", "👁️", "✏️",
  "💧", "🛍️", "👗", "🛁", "🪴", "📰", "🍜", "🧖", "🥜", "🌧️",
  "焙", "📸", "🌊", "📅", "👕", "🍳", "☀️", "🔮", "🧩", "🎞️",
  "🌬️", "🏮", "🔨", "🐶", "🚍", "💪", "🪑", "💇", "😴", "🤲",
  "外卖", "🤔", "晚餐", "🖼️", "🛁", "🏚️", "☕", "🌸", "🍦", "🎤",
  "🥬", "📞", "📸", "🚪", "📷", "🚿", "😂", "🎲", "🪟", "☀️",
  "📺", "☕", "✍️", "📚", "🗓️", "🪟", "🎶", "💅", "🎰", "☁️"];

/** 100 件回血小事 */
const TASK_TEXTS: string[] = [
  "去吃一顿自助小火锅：手机打开一部综艺，想吃多久就吃多久",
  "去书店沉浸式看一本喜欢的书：一口气看完一本感兴趣的书，和夕阳一起回家",
  "写一张明信片给3年后的自己：把你的期待和烦恼都告诉长大的自己吧",
  "随机选择陌生的街道散步30分钟：可以随机式citywalk，感觉很有趣呢",
  "做小饼干或者小蛋糕：diy一个专属于你的小甜品～",
  "做一个手工，比如戒指、陶艺、手机壳：把自己的名字刻上去！",
  "去博物馆或者美术馆：陶冶一下身心，感受博物馆的美",
  "去小吃街，把想吃的都吃一次：把没吃过的统统买下！",
  "逛超市、零食店：五花八门的小东西会让人很有幸福感",
  "做个足疗：犒劳一下辛苦的自己吧",
  "带上美食去公园野餐感受阳光的沐浴，享受美味的食物",
  "找家咖啡店写一篇随笔：戴上耳机进入自己的世界，写些最近的感受～",
  "给家人和朋友挑选小礼物：买些小巧可爱的东西送给朋友，她们一定很喜欢！",
  "探一家有趣的小店：苍蝇馆子或者高分小店都很纠结呢",
  "随机坐一辆公交车随机下车：看一看不一样的风景，探索城市中陌生的角落",
  "去湖边骑单车：戴上耳机，迎着晚风，很幸福哒",
  "去看一场音乐剧：新奇而提升品位的美妙体验",
  "猫咖撸猫撸狗：平淡的生活需要可爱的猫猫狗狗治愈呀",
  "坐摩天轮：在最高处看城市的感觉很奇妙吧",
  "找一个窗边，拍下过路的人们：形形色色的人，看看他们的状态有什么不同呢",
  "看一场电影：挑选一部最感兴趣的电影，说走就走！",
  "做一个美甲：换个新的美甲换个心情",
  "画一个新的妆容出门：尝试一个没试过的妆容，反正谁都不认识你！",
  "一个人去游泳：泡在水里，好舒服！",
  "早起去爬山看日出：一个人感受日出的浪漫，带给自己希望",
  "拍一条vlog：记录多彩的一天",
  "拆一个盲盒：生活中很需要未知和惊喜，拆盲盒是一个很不错的选择！",
  "去动物园喂小动物：让可爱的小动物给生活带来一些生机",
  "去公园喂一次鸽子或流浪猫，感受生命带来的治愈瞬间",
  "画填色画：成就感和耐心 up up！",
  "外放喜欢的歌曲：享受一下属于自己的时光",
  "看一部纪录片：每周都可以看一部做一个积累",
  "取消订阅邮件：烦心事通通都走开",
  "列购物清单：买一些自己喜欢的东西",
  "规划下周菜单：提前可以准备食材",
  "制作水果沙拉：补充一下维生素",
  "换一床舒适四件套：整个人都会心情舒畅",
  "用橡皮泥捏造型：休闲时间可以娱乐一下",
  "做眼保健操：每天都可以做的保护眼睛的",
  "修一下眉毛：让轮廓更好看",
  "清晨喝一杯温开水：利于肠道健康",
  "上网逛喜欢的店铺：可以加购到购物车",
  "挑一套新衣服：下次出门的时候可以穿哦",
  "给宠物洗澡：可以有更多时间给自己",
  "打理一下阳台植物：让植物们更加赏心悦目",
  "到书店翻翻杂志：悠闲时光来一个",
  "探索本地的美食街：可以吃到自己喜欢的小吃",
  "给自己做个小美容：比如敷个面膜",
  "准备小袋干果当零食：边看剧边吃",
  "坐在雨天的窗边看书：听着雨声很惬意",
  "烤曲奇饼干送给朋友：提升幸福感",
  "学习新的摄影技巧：可以给自己拍照",
  "独自去海边散步：听听海浪的声音",
  "为新的一周制定计划：做时间的主人",
  "把旧衣物分类处理：断舍离",
  "看看小视频学新菜：每周可以自己换换口味",
  "享受阳光午后小憩：午休或者做喜欢的事",
  "花时间思考未来目标：憧憬一下未来",
  "尝试拼接一幅拼图：很有成就感",
  "拍摄一组静物摄影：提升自己的技术",
  "在有风的傍晚骑行：感受一下大自然的力量",
  "为家增添气氛元素：可以买一些小装饰",
  "DIY一件日常用品：日常生活中也可以用到的",
  "和小猫小狗说说话：培养感情",
  "随机坐公交车漫游：看看城市的街角",
  "学习新的健身动作：提升自己的整体体态",
  "重新安排生活空间：合理布局房间结构",
  "尝试一个新的发型：从头开始",
  "睡个长长的午觉：保持充足的睡眠",
  "体验一次全身按摩：放松一下紧绷的状态",
  "点平时舍不得的外卖：偶尔犒劳一下自己",
  "进行一次自我反思：总结",
  "享用一顿丰盛晚餐：可以跟家人一起",
  "换个好看的壁纸：感觉像换了一个新手机",
  "泡个舒服的热水澡：解乏",
  "去旧货市场淘小玩意儿：买点自己喜欢的",
  "尝试做一杯手冲咖啡或特调饮品，享受香气在空气里弥漫的过程",
  "闻洗过衣服的香味：可以挑选自己喜欢的味道",
  "品尝新口味的冰淇淋：吃到美食会很开心",
  "一个人去KTV唱歌：可以不用担心五音不全",
  "去市场挑新鲜的蔬菜：烹饪一道新鲜的食物",
  "和朋友打电话聊琐事：分享一下不错的最近",
  "穿上喜欢的衣服拍照：80岁回忆录",
  "退出无用的微信群聊：一片清闲",
  "随意翻手机里的旧照片：回忆过去",
  "边洗澡边听播客：非常不错的体验",
  "看一期搞笑综艺：治愈放松",
  "玩一些简单的桌游：可以锻炼脑部",
  "擦干净房间里的窗户：房间整体整洁提升",
  "坐在阳台上晒太阳：惬意",
  "看一部动画短片：可以吃着自己点的外卖",
  "慢慢品尝一杯咖啡：享受片刻时光",
  "抄写喜欢文案的句子",
  "整理书架上的书籍",
  "思考规划下一个月",
  "打开窗户呼吸新鲜空气",
  "学习一首爱听的新歌",
  "做一次美甲",
  "买一张彩票",
  "躺在草地上或公园长椅上，单纯地发呆、看云，彻底放空大脑",
];

interface EnergyNode {
  id: number;
  text: string;
  icon: string;
}

const nodes: EnergyNode[] = TASK_TEXTS.map((text, i) => ({
  id: i + 1,
  text,
  icon: ICON_POOL[i % ICON_POOL.length],
}));

/* ============================================================
   心电图背景纹理
   ============================================================ */
const ECG_PATTERN = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" viewBox="0 0 400 120">
  <path d="M0 60 L60 60 L70 60 L75 30 L80 90 L85 45 L90 60 L150 60 L160 60 L165 35 L170 85 L175 50 L180 60 L240 60 L250 60 L255 25 L260 95 L265 40 L270 60 L330 60 L340 60 L345 30 L350 90 L355 45 L360 60 L400 60"
    stroke="rgba(160,150,140,0.06)" stroke-width="1" fill="none"/>
</svg>
`)}`;

/* ============================================================
   工具
   ============================================================ */
const DONE_KEY = "recharge_done_ids";

function loadDoneIds(): Set<number> {
  try {
    const raw = localStorage.getItem(DONE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

/* ============================================================
   Web Audio — 电流声
   ============================================================ */
let audioCtx: AudioContext | null = null;
const playZap = () => {
  try {
    if (!audioCtx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new Ctor();
    }
    const ctx = audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2000;
    filter.Q.value = 5;
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    osc.start(now); osc.stop(now + 0.15);
  } catch { /* noop */ }
};

/* ============================================================
   反馈 Toast 消息
   ============================================================ */
const MOOD_HEALING: Record<string, { emoji: string; messages: string[] }> = {
  happy:  { emoji: "☀️", messages: ["今天心情很好呢，去做件让自己更开心的事吧", "快乐加倍！挑一件喜欢的小事犒劳自己", "心情好的时候，适合去探索新的可能"] },
  calm:   { emoji: "🍃", messages: ["平静的日子，也值得被好好记住", "安静地做一件小事，享受此刻的从容", "不急不躁，按自己的节奏来"] },
  tired:  { emoji: "🌙", messages: ["辛苦了，今天对自己温柔一点吧", "累了就休息，做一件不费力气的小事", "你已经做得够好了，剩下的事交给明天"] },
  low:    { emoji: "🌧", messages: ["心情不好的时候，做一件小事就是最好的疗愈", "慢慢来，一件小事也能照亮今天", "你不需要现在就振作，一件小事就足够了"] },
  anxious:{ emoji: "☁", messages: ["焦虑的时候，做一件有确定感的小事吧", "把注意力放在眼前的小事上，会好很多", "深呼吸，选一件小事让自己安定下来"] },
  angry:  { emoji: "🔥", messages: ["有点烦躁？做一件能释放或平复的小事吧", "不如把情绪转化成行动力，去做一件事", "冷静下来之后，一件小事就能帮到你"] },
};
const DEFAULT_HEALING = { emoji: "🌸", messages: ["今天也在好好照顾自己呢", "哪怕一点点，也是在发光", "温柔地对待自己，就是最好的回血", "不必完美，只要真实", "你值得被温柔以待", "慢慢来，不着急"] };

/* ============================================================
   Tab 类型
   ============================================================ */
type TabKey = "home" | "list" | "stats" | "me";

/* ============================================================
   能量节点组件（清单Tab用）
   ============================================================ */
interface NodeProps {
  node: EnergyNode;
  index: number;
  done: boolean;
  onToggle: (id: number) => void;
}

const EnergyNodeItem: React.FC<NodeProps> = ({ node, index, done, onToggle }) => {
  const [burst, setBurst] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (!done) {
      playZap();
      setBurst(true);
      setTimeout(() => setBurst(false), 800);
    }
    onToggle(node.id);
  };

  // 粒子位置
  const particles = useMemo(
    () => Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      distance: 30 + Math.random() * 20,
      size: 3 + Math.random() * 3,
      delay: Math.random() * 0.1,
    })),
    []
  );

  return (
    <motion.div
      className={`energy-node ${done ? "charged" : ""} ${hovered ? "hovered" : ""}`}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.015, 0.3), ease: "easeOut" }}
    >
      {/* 连接线（除最后一个） */}
      {index < nodes.length - 1 && (
        <div className={`energy-line ${done ? "active" : ""}`}>
          <span className="energy-line-dot" />
        </div>
      )}

      {/* 节点胶囊 */}
      <button
        className="energy-capsule"
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* 左侧图标 */}
        <span className="energy-icon">{node.icon}</span>

        {/* 中间文字 */}
        <span className="energy-text">{node.text}</span>

        {/* 右侧电池 */}
        <span className={`energy-battery ${done ? "filled" : ""}`}>
          <span className="energy-battery-cap" />
          <span className="energy-battery-body">
            <span className="energy-battery-fill" />
          </span>
        </span>

        {/* 充能粒子爆发 */}
        <AnimatePresence>
          {burst && (
            <div className="energy-burst">
              {particles.map((p, i) => (
                <motion.span
                  key={i}
                  className="energy-particle"
                  style={{ width: p.size, height: p.size }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos(p.angle) * p.distance,
                    y: Math.sin(p.angle) * p.distance,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 0.6, delay: p.delay, ease: "easeOut" }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
};

/* ============================================================
   第101个隐藏电源弹窗 — 叶之书的微光
   ============================================================ */
const HiddenPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <motion.div
    className="hidden-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    onClick={onClose}
  >
    <motion.div
      className="hidden-popup"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={(e) => e.stopPropagation()}
    >
      <button className="hidden-close" onClick={onClose}>🌿</button>
      <h2 className="hidden-title">第101个电源</h2>
      <p className="hidden-text">允许自己永远充不满电。</p>
      <div className="hidden-deco" />
    </motion.div>
  </motion.div>
);

/* ============================================================
   小猫 SVG（睁眼 + 哈欠状态）
   ============================================================ */
const StationCat: React.FC<{ state: "sleep" | "stare" | "yawn" }> = ({ state }) => (
  <svg viewBox="0 0 100 100" width="56" height="56" fill="none" className={`station-cat cat-${state}`}>
    {/* 身体 */}
    <ellipse cx="50" cy="70" rx="26" ry="18" fill="#fff" stroke="#5a4a3a" strokeWidth="1.5" opacity="0.8" />
    {/* 头 */}
    <circle cx="50" cy="40" r="18" fill="#fff" stroke="#5a4a3a" strokeWidth="1.5" opacity="0.8" />
    {/* 左耳 */}
    <path d="M36 30 L30 16 L42 26 Z" fill="#fff" stroke="#5a4a3a" strokeWidth="1.5" />
    {/* 右耳 */}
    <path d="M64 30 L70 16 L58 26 Z" fill="#fff" stroke="#5a4a3a" strokeWidth="1.5" />
    <path d="M38 27 L35 21 L40 25 Z" fill="#f0c8c0" />
    <path d="M62 27 L65 21 L60 25 Z" fill="#f0c8c0" />

    {/* 眼睛 — sleep:弧线闭眼, stare:大圆睁眼, yawn:闭眼弧线 */}
    {state === "stare" ? (
      <g className="cat-eyes-open">
        <circle cx="43" cy="38" r="2.5" fill="#3a6a8a" />
        <circle cx="57" cy="38" r="2.5" fill="#3a6a8a" />
        <circle cx="43.5" cy="37" r="0.7" fill="#fff" />
        <circle cx="57.5" cy="37" r="0.7" fill="#fff" />
      </g>
    ) : (
      <g>
        <path d="M40 38 Q43 41 46 38" stroke="#5a4a3a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M54 38 Q57 41 60 38" stroke="#5a4a3a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
    )}

    {/* 嘴 — yawn 时张大 */}
    {state === "yawn" ? (
      <ellipse cx="50" cy="48" rx="4" ry="5" fill="#c87878" stroke="#5a4a3a" strokeWidth="1" />
    ) : (
      <path d="M50 44 Q46 48 44 46 M50 44 Q54 48 56 46" stroke="#5a4a3a" strokeWidth="1" fill="none" strokeLinecap="round" />
    )}

    {/* 鼻子 */}
    <path d="M48 42 L50 44 L52 42 Z" fill="#e0a090" />

    {/* 胡须 */}
    <line x1="32" y1="42" x2="40" y2="43" stroke="#5a4a3a" strokeWidth="0.6" />
    <line x1="68" y1="42" x2="60" y2="43" stroke="#5a4a3a" strokeWidth="0.6" />

    {/* 尾巴 */}
    <path d="M74 68 Q88 58 84 44" stroke="#5a4a3a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />

    {/* Zzz */}
    {state === "sleep" && (
      <text x="72" y="20" fontSize="9" fill="#a09a7a" fontFamily="serif" fontStyle="italic">z</text>
    )}
  </svg>
);

/* ============================================================
   心情/精力/天气 扩展映射（6种心情 + 滑块 + 4种天气）
   ============================================================ */
const MOOD_EXTENDED: { key: string; label: string; icon: string; moodType: MoodType }[] = [
  { key: "happy", label: "开心", icon: "😄", moodType: "happy" },
  { key: "calm", label: "平静", icon: "😌", moodType: "calm" },
  { key: "tired", label: "疲惫", icon: "😴", moodType: "tired" },
  { key: "low", label: "低落", icon: "😔", moodType: "low" },
  { key: "anxious", label: "焦虑", icon: "😰", moodType: "anxious" },
  { key: "angry", label: "烦躁", icon: "😡", moodType: "angry" },
];

/* ============================================================
   Tab 1 — 首页
   ============================================================ */
const HomePage: React.FC<{
  doneIds: Set<number>;
  onToggle: (id: number) => void;
  onRequestCompletion: (id: number, elapsed?: number) => void;
  onShowBadge: (badge: Badge) => void;
}> = ({ doneIds, onToggle, onRequestCompletion, onShowBadge }) => {
  const [selectedMood, setSelectedMood] = useState<string>("happy");
  const currentHealing = MOOD_HEALING[selectedMood] || DEFAULT_HEALING;
  const [healingText, setHealingText] = useState(() => currentHealing.messages[Math.floor(Math.random() * currentHealing.messages.length)]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; text: string; icon: string }[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [detailRec, setDetailRec] = useState<Recommendation | null>(null);
  const [timer, setTimer] = useState<{ active: boolean; seconds: number; recId: number } | null>(null);

  const historyKeywords = useMemo(() => {
    const history = loadHistory();
    return extractPreferenceKeywords(history);
  }, []);

  useEffect(() => {
    const tc = getTodayCount();
    const sd = getStreakDays();
    const history = loadHistory();
    setTodayCount(tc);
    setStreak(sd);
    setBadges(getBadges(history, sd, tc));
  }, [doneIds.size]);

  useEffect(() => {
    if (!timer || !timer.active) return;
    const interval = setInterval(() => {
      setTimer(prev => prev ? { ...prev, seconds: prev.seconds + 1 } : null);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer?.active]);

  const generateRecommendations = useCallback(() => {
    const moodType = MOOD_EXTENDED.find(m => m.key === selectedMood)?.moodType || "happy";
    const state: UserState = { mood: moodType, weather: "sunny", energy: "medium" };
    const recs = getRecommendations(state, doneIds, historyKeywords, 5);
    setRecommendations(recs);
    setHasGenerated(true);
  }, [selectedMood, doneIds, historyKeywords]);

  const handleDoIt = useCallback((rec: Recommendation) => {
    const elapsed = (timer && timer.recId === rec.node.id) ? timer.seconds : undefined;
    onRequestCompletion(rec.node.id, elapsed);

    // 计时器停止
    if (timer && timer.recId === rec.node.id) {
      setTimer(prev => prev ? { ...prev, active: false } : null);
    }
  }, [onRequestCompletion, timer]);

  return (
    <div className="tab-home">
      {/* 治愈文案 */}
      <div className="home-healing-card">
        <span className="home-healing-emoji">{currentHealing.emoji}</span>
        <span className="home-healing-text">{healingText}</span>
        {streak > 0 && <span className="home-streak">连续 {streak} 天</span>}
      </div>

      {/* 状态选择器 */}
      <div className="home-state-section">
        <h3 className="home-section-label">现在的你</h3>

        {/* 心情 */}
        <div className="home-state-row">
          <span className="home-state-key">心情</span>
          <div className="home-state-options">
            {MOOD_EXTENDED.map(m => (
              <button
                key={m.key}
                className={`home-mood-btn ${selectedMood === m.key ? "active" : ""}`}
                onClick={() => {
                  setSelectedMood(m.key);
                  const h = MOOD_HEALING[m.key] || DEFAULT_HEALING;
                  setHealingText(h.messages[Math.floor(Math.random() * h.messages.length)]);
                }}
              >
                <span className="home-mood-icon">{m.icon}</span>
                <span className="home-mood-label">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button className="home-recommend-btn" onClick={generateRecommendations}>
          <span className="home-recommend-btn-icon">✨</span>
          AI 帮我推荐
        </button>
        <p className="home-mode-hint">
          根据你的心情，为你匹配「{getMoodMode(MOOD_EXTENDED.find(m => m.key === selectedMood)?.moodType || "happy")}」模式的小事
        </p>
      </div>

      {/* 推荐结果卡片 */}
      <AnimatePresence mode="wait">
        {hasGenerated && (
          <motion.div
            className="home-results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <h3 className="home-section-label">为你推荐</h3>
            <p className="home-rec-header-mode">
              {getMoodMode(MOOD_EXTENDED.find(m => m.key === selectedMood)?.moodType || "happy")}模式
            </p>
            <div className="home-rec-cards">
              {recommendations.map((rec, i) => (
                <motion.div
                  key={rec.node.id}
                  className={`home-rec-card ${doneIds.has(rec.node.id) ? "done" : ""}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                >
                  <div className="home-rec-card-top">
                    <span className="home-rec-card-icon">{rec.node.icon}</span>
                    <div className="home-rec-card-content">
                      <p className="home-rec-card-name">
                        {rec.node.text}
                      </p>
                      <p className="home-rec-card-reason">{rec.reason}</p>
                      <div className="home-rec-card-tags">
                        {rec.node.tags.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className="home-rec-tag"
                            style={{ borderColor: TAG_MAP[tag].color, color: TAG_MAP[tag].color }}
                          >
                            {TAG_MAP[tag].label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="home-rec-card-actions">
                    {doneIds.has(rec.node.id) ? (
                      <button className={`home-rec-card-action done`}>
                        已完成
                      </button>
                    ) : timer && timer.recId === rec.node.id && timer.active ? (
                      <button
                        className="home-rec-card-action home-rec-card-timer-active"
                        onClick={() => handleDoIt(rec)}
                      >
                        完成 · {Math.floor(timer.seconds / 60)}:{String(timer.seconds % 60).padStart(2, "0")}
                      </button>
                    ) : (
                      <>
                        <button className="home-rec-card-action" onClick={() => handleDoIt(rec)}>
                          直接执行
                        </button>
                        <button
                          className="home-rec-card-timer-btn"
                          onClick={() => setTimer({ active: true, seconds: 0, recId: rec.node.id })}
                        >
                          ⏱ 计时执行
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <div className="home-toast-container">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              className="home-toast"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <span className="home-toast-icon">{t.icon}</span>
              <span className="home-toast-text">{t.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {detailRec && (
          <motion.div
            className="detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDetailRec(null)}
          >
            <motion.div
              className="detail-popup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="detail-close" onClick={() => setDetailRec(null)}>✕</button>
              <span className="detail-icon">{detailRec.node.icon}</span>
              <h3 className="detail-name">{detailRec.node.text}</h3>
              <p className="detail-reason">{detailRec.reason}</p>
              <div className="detail-tags">
                {detailRec.node.tags.map(tag => (
                  <span
                    key={tag}
                    className="home-rec-tag"
                    style={{ borderColor: TAG_MAP[tag].color, color: TAG_MAP[tag].color }}
                  >
                    {TAG_MAP[tag].label}
                  </span>
                ))}
              </div>
              <button className="detail-action" onClick={() => { handleDoIt(detailRec); setDetailRec(null); }}>
                执行这件事
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ============================================================
   Tab 2 — 清单
   ============================================================ */
const ListPage: React.FC<{
  doneIds: Set<number>;
  onToggle: (id: number) => void;
  hiddenFound: boolean;
  catState: "sleep" | "stare" | "yawn";
  onHiddenClick: () => void;
}> = ({ doneIds, onToggle, hiddenFound, catState, onHiddenClick }) => {
  const [activeTag, setActiveTag] = useState<EnergyTag | "all">("all");

  const filteredNodes = useMemo(() => {
    if (activeTag === "all") return nodes;
    return nodes.filter(n => {
      const tagged = TAGGED_NODES.find(tn => tn.id === n.id);
      return tagged && tagged.tags.includes(activeTag as EnergyTag);
    });
  }, [activeTag]);

  return (
    <div className="tab-list">
      {/* 标签筛选 */}
      <div className="list-filter-bar">
        <button
          className={`list-filter-btn ${activeTag === "all" ? "active" : ""}`}
          onClick={() => setActiveTag("all")}
        >全部</button>
        {(Object.keys(TAG_MAP) as EnergyTag[]).map(tag => (
          <button
            key={tag}
            className={`list-filter-btn ${activeTag === tag ? "active" : ""}`}
            onClick={() => setActiveTag(tag)}
          >
            <span>{TAG_MAP[tag].icon}</span>
            {TAG_MAP[tag].label}
          </button>
        ))}
      </div>

      {/* 列表 */}
      <div className="energy-flow">
        {filteredNodes.map((node, i) => (
          <EnergyNodeItem
            key={node.id}
            node={node}
            index={i}
            done={doneIds.has(node.id)}
            onToggle={onToggle}
          />
        ))}

        {/* 第101个隐藏电源 */}
        {activeTag === "all" && (
          <div className="hidden-node-zone">
            <button
              className={`hidden-node ${hiddenFound ? "found" : ""}`}
              onClick={onHiddenClick}
              aria-label="隐藏电源"
            />
            <div className="station-cat-wrap">
              <StationCat state={catState} />
            </div>
          </div>
        )}
        {activeTag === "all" && (
          <p className="circuit-hint">电路末端还有一个预留接口……</p>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   Tab 3 — 统计
   ============================================================ */
const StatsPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const stats = useMemo(() => {
    const history = loadHistory();
    // 按 id 去重，每件小事只保留最新一次完成记录
    const latestMap = new Map<number, CompletionRecord>();
    for (const r of history) {
      if (!latestMap.has(r.id) || r.timestamp > latestMap.get(r.id)!.timestamp) {
        latestMap.set(r.id, r);
      }
    }
    const uniqueRecords = [...latestMap.values()].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);

    // 读取感受记录
    const notesMap = new Map<number, { note: string; img: string | null; date: string }>();
    try {
      const raw = localStorage.getItem("recharge_notes");
      const notesArr: any[] = raw ? JSON.parse(raw) : [];
      for (const n of notesArr) {
        if (!notesMap.has(n.id) || n.timestamp > (notesMap.get(n.id) as any)?._ts) {
          notesMap.set(n.id, { note: n.note, img: n.img, date: n.date, _ts: n.timestamp } as any);
        }
      }
    } catch { /* ignore */ }

    const streak = getStreakDays();
    const todayCount = getTodayCount();
    const badges = getBadges(history, streak, todayCount);
    return { recentRecords: uniqueRecords, badges, notesMap };
  }, []);

  return (
    <div className="tab-stats">
      {/* 最近完成 */}
      <div className="stats-section">
        <h3 className="stats-section-label">最近完成</h3>
        <div className="stats-timeline-legend">
          <span className="stats-legend-item"><span className="stats-legend-dot pink" />有记录</span>
          <span className="stats-legend-item"><span className="stats-legend-dot purple" />无记录</span>
          <span className="stats-legend-hint">点击条目查看</span>
        </div>
        <div className="stats-timeline">
          {stats.recentRecords.length === 0 && (
            <p className="stats-timeline-empty">还没有完成记录，去清单里打卡吧</p>
          )}
          {stats.recentRecords.map((rec, i) => {
            const node = TAGGED_NODES.find(n => n.id === rec.id);
            const d = new Date(rec.timestamp);
            const timeStr = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
            const noteData = stats.notesMap.get(rec.id);
            const isExpanded = expandedId === rec.id;
            const hasNote = !!stats.notesMap.get(rec.id);
            return (
              <div key={rec.id} className={`stats-timeline-item ${isExpanded ? "expanded" : ""} ${hasNote ? "has-record" : ""}`}>
                <div className={`stats-timeline-dot ${hasNote ? "has-record" : ""}`} />
                {i < stats.recentRecords.length - 1 && <div className="stats-timeline-line" />}
                <div className="stats-timeline-content" onClick={() => setExpandedId(isExpanded ? null : rec.id)}>
                  <span className="stats-timeline-icon">{node?.icon || "📝"}</span>
                  <span className="stats-timeline-text">
                    {node ? (node.text.length > 24 ? node.text.slice(0, 24) + "…" : node.text) : `#${rec.id}`}
                  </span>
                  <span className="stats-timeline-time">{timeStr}</span>
                </div>
                {isExpanded && (
                  <div className="stats-timeline-detail">
                    {noteData?.note && (
                      <p className="stats-timeline-note">💬 {noteData.note}</p>
                    )}
                    {noteData?.img && (
                      <img src={noteData.img} alt="" className="stats-timeline-img" />
                    )}
                    {noteData?.date && (
                      <span className="stats-timeline-date">📅 {noteData.date}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 徽章墙 */}
      <div className="stats-section">
        <h3 className="stats-section-label">徽章墙</h3>
        <div className="stats-badges">
          {stats.badges.map(badge => (
            <div key={badge.id} className={`stats-badge-item ${badge.unlocked ? "unlocked" : "locked"}`} title={badge.description}>
              <span className="stats-badge-icon">{badge.unlocked ? badge.icon : "🔒"}</span>
              <span className="stats-badge-label">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   分享卡片
   ============================================================ */
const ShareCard: React.FC<{ totalCount: number; streak: number; onClose: () => void }> = ({ totalCount, streak, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  const healingLines = [
    "今天也在好好照顾自己呢",
    "哪怕一点点，也是在发光",
    "你已经做得很好了",
    "温柔地对待自己，就是最好的回血",
    "不必完美，只要真实",
    "慢慢来，不着急",
    "你值得被温柔以待",
    "今天也辛苦了，好好休息吧",
  ];
  const line = useMemo(() => healingLines[Math.floor(Math.random() * healingLines.length)], []);

  const cardData = useMemo(() => {
    const history = loadHistory();
    // 按 id 去重，每件小事只取最新一次
    const seen = new Set<number>();
    const unique = history.slice().reverse().filter(r => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
    // 取最近3件完成的小事名称 + 日期
    const recent3 = unique.slice(0, 3).map(r => {
      const node = TAGGED_NODES.find(n => n.id === r.id);
      const d = new Date(r.timestamp);
      const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
      return node ? { text: node.text, date: dateStr } : null;
    }).filter(Boolean) as { text: string; date: string }[];

    // 最近解锁的徽章
    const sd = getStreakDays();
    const tc = getTodayCount();
    const badges = getBadges(history, sd, tc);
    const unlockedBadges = badges.filter(b => b.unlocked).map(b => b.label);

    return { recent3, unlockedBadges };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = 320;
    const h = 580;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // 暖色渐变背景
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, "#FDFBF7");
    bgGrad.addColorStop(1, "#F8F4EF");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 顶部装饰 - 小叶子
    ctx.fillStyle = "rgba(124,106,154,0.08)";
    ctx.beginPath();
    ctx.ellipse(w - 60, 35, 40, 20, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(124,106,154,0.05)";
    ctx.beginPath();
    ctx.ellipse(50, 55, 30, 15, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // 顶部双线装饰
    ctx.strokeStyle = "#7C6A9A";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, 55);
    ctx.lineTo(w - 30, 55);
    ctx.stroke();
    ctx.strokeStyle = "rgba(124,106,154,0.3)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(50, 62);
    ctx.lineTo(w - 50, 62);
    ctx.stroke();

    // 标题
    ctx.fillStyle = "#3a3a3a";
    ctx.font = '700 24px "Noto Serif SC", Georgia, serif';
    ctx.textAlign = "center";
    ctx.fillText("我的回血日记", w / 2, 105);

    // 副标题
    ctx.fillStyle = "#9a8a7e";
    ctx.font = '13px "Noto Sans SC", system-ui, sans-serif';
    ctx.fillText("每天做一件滋养自己的小事", w / 2, 132);

    // 数据区域 - 圆角卡片
    const cardY = 165;
    const cardH = 120;
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.roundRect(30, cardY, w - 60, cardH, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(180,170,160,0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 左侧 - 累计完成
    ctx.fillStyle = "#7C6A9A";
    ctx.font = '700 42px "Noto Serif SC", Georgia, serif';
    ctx.textAlign = "center";
    ctx.fillText(String(totalCount), 95, cardY + 68);
    ctx.fillStyle = "#9a8a7e";
    ctx.font = '12px "Noto Sans SC", system-ui, sans-serif';
    ctx.fillText("累计完成", 95, cardY + 92);

    // 中间分隔
    ctx.strokeStyle = "rgba(180,170,160,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2, cardY + 20);
    ctx.lineTo(w / 2, cardY + cardH - 20);
    ctx.stroke();

    // 右侧 - 连续天数
    ctx.fillStyle = "#FF8FA3";
    ctx.font = '700 42px "Noto Serif SC", Georgia, serif';
    ctx.fillText(String(streak), w - 95, cardY + 68);
    ctx.fillStyle = "#9a8a7e";
    ctx.font = '12px "Noto Sans SC", system-ui, sans-serif';
    ctx.fillText("连续打卡", w - 95, cardY + 92);

    // 治愈文案区
    const quoteY = cardY + cardH + 30;
    ctx.fillStyle = "rgba(124,106,154,0.06)";
    ctx.beginPath();
    ctx.roundRect(40, quoteY, w - 80, 80, 12);
    ctx.fill();

    ctx.fillStyle = "#6b5e50";
    ctx.font = '15px "Noto Serif SC", Georgia, serif';
    ctx.textAlign = "center";
    // 左引号
    ctx.fillStyle = "rgba(124,106,154,0.2)";
    ctx.font = '28px Georgia, serif';
    ctx.fillText("\u201C", 58, quoteY + 50);
    // 右引号
    ctx.fillText("\u201D", w - 58, quoteY + 80);

    ctx.fillStyle = "#6b5e50";
    ctx.font = '14px "Noto Serif SC", Georgia, serif';
    const maxWidth = w - 120;
    const chars = line.split("");
    let currentLn = "";
    const lns: string[] = [];
    for (const c of chars) {
      const test = currentLn + c;
      if (ctx.measureText(test).width > maxWidth && currentLn.length > 0) {
        lns.push(currentLn);
        currentLn = c;
      } else {
        currentLn = test;
      }
    }
    lns.push(currentLn);
    let ty = quoteY + 45;
    for (const l of lns) {
      ctx.fillText(l, w / 2, ty);
      ty += 22;
    }

    // 最近完成的小事 — 圆角卡片背景
    if (cardData.recent3.length > 0) {
      let curY = quoteY + 105;
      const recentCardTop = curY - 18;
      const recentCardPad = 14;

      // 先计算总高度（确保字体先设置）
      ctx.font = '12px "Noto Sans SC", system-ui, sans-serif';
      let totalH = 20;
      for (const item of cardData.recent3) {
        const nameMaxW = w - 130;
        const nameChars = item.text.split("");
        let nameLine = "";
        let lineCount = 1;
        for (const ch of nameChars) {
          const test = nameLine + ch;
          if (ctx.measureText(test).width > nameMaxW && nameLine.length > 0) {
            lineCount++;
            nameLine = ch;
          } else {
            nameLine = test;
          }
        }
        totalH += lineCount * 18 + 6;
      }
      if (cardData.unlockedBadges.length > 0) {
        totalH += 18 + Math.min(cardData.unlockedBadges.length, 2) * 28 + 6;
      }

      // 绘制背景卡片
      ctx.fillStyle = "rgba(124,106,154,0.04)";
      ctx.beginPath();
      ctx.roundRect(30, recentCardTop, w - 60, totalH + recentCardPad, 14);
      ctx.fill();

      ctx.fillStyle = "#b0a090";
      ctx.font = '11px "Noto Sans SC", system-ui, sans-serif';
      ctx.textAlign = "left";
      ctx.fillText("最近完成", 44, curY);
      curY += 22;

      for (const item of cardData.recent3) {
        // 自动换行计算名称
        const nameMaxW = w - 130;
        const nameChars = item.text.split("");
        let nameLine = "";
        const nameLines: string[] = [];
        for (const ch of nameChars) {
          const test = nameLine + ch;
          if (ctx.measureText(test).width > nameMaxW && nameLine.length > 0) {
            nameLines.push(nameLine);
            nameLine = ch;
          } else {
            nameLine = test;
          }
        }
        nameLines.push(nameLine);

        // 绘制日期（第一行右侧）
        ctx.fillStyle = "#c0b0a0";
        ctx.font = '10px "Noto Sans SC", system-ui, sans-serif';
        ctx.textAlign = "right";
        ctx.fillText(item.date, w - 40, curY);

        // 绘制名称行
        ctx.textAlign = "left";
        ctx.fillStyle = "#7a6e62";
        ctx.font = '12px "Noto Sans SC", system-ui, sans-serif';
        for (const nl of nameLines) {
          ctx.fillText(nl, 50, curY);
          curY += 18;
        }
        curY += 6; // item 间距
      }

      // 最近解锁徽章
      if (cardData.unlockedBadges.length > 0) {
        ctx.fillStyle = "#c0b0a0";
        ctx.font = '11px "Noto Sans SC", system-ui, sans-serif';
        ctx.textAlign = "left";
        ctx.fillText("最近解锁", 40, curY);
        curY += 18;

        const latestBadges = cardData.unlockedBadges.slice(-2);
        for (const badgeLabel of latestBadges) {
          ctx.fillStyle = "rgba(124,106,154,0.1)";
          const badgeText = `🏅 ${badgeLabel}`;
          const badgeW = ctx.measureText(badgeText).width + 16;
          ctx.beginPath();
          ctx.roundRect(50, curY - 12, badgeW, 22, 11);
          ctx.fill();
          ctx.fillStyle = "#7C6A9A";
          ctx.font = '11px "Noto Sans SC", system-ui, sans-serif';
          ctx.fillText(badgeText, 58, curY + 2);
          curY += 28;
        }
      }
    }

    // 底部装饰线
    const bottomY = h - 48;
    ctx.strokeStyle = "rgba(124,106,154,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(90, bottomY);
    ctx.lineTo(w - 90, bottomY);
    ctx.stroke();

    ctx.fillStyle = "#c0b0a0";
    ctx.font = '10px "Noto Sans SC", system-ui, sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("回血清单 · Recharge Station", w / 2, bottomY + 22);

    // 右下角小装饰
    ctx.fillStyle = "rgba(255,143,163,0.12)";
    ctx.beginPath();
    ctx.arc(w - 42, bottomY - 10, 14, 0, Math.PI * 2);
    ctx.fill();

    setReady(true);
  }, [totalCount, streak, line, cardData]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `我的回血日记-${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
  };

  return (
    <motion.div className="share-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="share-popup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={e => e.stopPropagation()}>
        <button className="share-close" onClick={onClose}>✕</button>
        <h3 className="share-title">分享卡片</h3>
        <div className="share-canvas-wrap">
          <canvas ref={canvasRef} style={{ width: 320, height: 580, borderRadius: 12, display: ready ? "block" : "none" }} />
          {!ready && <div className="share-canvas-placeholder">生成中...</div>}
        </div>
        <button className="share-download" onClick={handleDownload}>下载卡片</button>
      </motion.div>
    </motion.div>
  );
};

/* ============================================================
   Tab 4 — 我的
   ============================================================ */
const MePage: React.FC = () => {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const userData = useMemo(() => {
    const history = loadHistory();
    const totalCount = history.length;
    const streak = getStreakDays();
    const todayCount = getTodayCount();

    // 等级
    let level = 0;
    if (totalCount >= 1) level = 1;
    if (totalCount >= 10) level = 2;
    if (totalCount >= 30) level = 3;
    if (totalCount >= 50) level = 4;
    if (totalCount >= 100) level = 5;

    // 头像
    const avatars = ["🌱", "🌿", "🍀", "🌻", "⭐", "🌟"];
    const avatar = avatars[level] || "🌱";

    // 标签偏好
    const tagFreq: Record<string, number> = {};
    for (const r of history) {
      for (const tag of r.tags) {
        tagFreq[tag] = (tagFreq[tag] || 0) + 1;
      }
    }
    const topTags = Object.entries(tagFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag);

    return { totalCount, streak, todayCount, level, avatar, topTags };
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm("确定要重置所有数据吗？这将清除所有打卡记录和历史数据，无法恢复。")) {
      localStorage.removeItem("recharge_count_ts");
      localStorage.removeItem(DONE_KEY);
      localStorage.removeItem("recharge_history");
      localStorage.removeItem("recharge_user_state");
      window.location.reload();
    }
  }, []);

  const handleShare = useCallback(() => {
    setShareOpen(true);
  }, []);

  return (
    <div className="tab-me">
      {/* 用户卡片 */}
      <div className="me-user-card">
        <div className="me-user-avatar">{userData.avatar}</div>
        <div className="me-user-info">
          <span className="me-user-name">回血达人</span>
          <span className="me-user-level">Lv.{userData.level}</span>
        </div>
        <div className="me-user-stats">
          <div className="me-user-stat">
            <span className="me-user-stat-value">{userData.totalCount}</span>
            <span className="me-user-stat-label">累计</span>
          </div>
          <div className="me-user-stat">
            <span className="me-user-stat-value">{userData.streak}</span>
            <span className="me-user-stat-label">连续</span>
          </div>
          <div className="me-user-stat">
            <span className="me-user-stat-value">{userData.todayCount}</span>
            <span className="me-user-stat-label">今日</span>
          </div>
        </div>
      </div>

      {/* 回血偏好 */}
      <div className="me-section">
        <h3 className="me-section-label">回血偏好</h3>
        <div className="me-preference-tags">
          {userData.topTags.length === 0 && (
            <span className="me-preference-empty">完成更多小事后，这里会显示你的偏好</span>
          )}
          {userData.topTags.map(tag => (
            <span key={tag} className="me-preference-tag" style={{ borderColor: TAG_MAP[tag as EnergyTag]?.color, color: TAG_MAP[tag as EnergyTag]?.color }}>
              {TAG_MAP[tag as EnergyTag]?.icon} {TAG_MAP[tag as EnergyTag]?.label}
            </span>
          ))}
        </div>
      </div>

      {/* 设置列表 */}
      <div className="me-section">
        <h3 className="me-section-label">设置</h3>
        <div className="me-settings">
          <button className="me-settings-btn" onClick={handleReset}>
            <span className="me-settings-icon">🔄</span>
            <span className="me-settings-text">重置数据</span>
            <span className="me-settings-arrow">›</span>
          </button>
          <button className="me-settings-btn" onClick={handleShare}>
            <span className="me-settings-icon">📷</span>
            <span className="me-settings-text">分享卡片</span>
            <span className="me-settings-arrow">›</span>
          </button>
          <button className="me-settings-btn" onClick={() => setAboutOpen(true)}>
            <span className="me-settings-icon">ℹ️</span>
            <span className="me-settings-text">关于</span>
            <span className="me-settings-arrow">›</span>
          </button>
        </div>
      </div>

      {/* 关于弹窗 */}
      <AnimatePresence>
        {aboutOpen && (
          <motion.div
            className="about-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAboutOpen(false)}
          >
            <motion.div
              className="about-popup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="about-close" onClick={() => setAboutOpen(false)}>✕</button>
              <h2 className="about-title">回血清单</h2>
              <p className="about-version">v2.0</p>
              <p className="about-desc">
                每天做一件滋养自己的小事，像充电一样慢慢回血。
                100件治愈小事，AI智能推荐，帮你找到最适合当下的能量补给。
              </p>
              <div className="about-deco" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 分享卡片弹窗 */}
      <AnimatePresence>
        {shareOpen && (
          <ShareCard
            totalCount={userData.totalCount}
            streak={userData.streak}
            onClose={() => setShareOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ============================================================
   底部导航
   ============================================================ */
const TAB_ITEMS: { key: TabKey; label: string; icon: string }[] = [
  { key: "home", label: "首页", icon: "🏠" },
  { key: "list", label: "清单", icon: "📋" },
  { key: "stats", label: "统计", icon: "📊" },
  { key: "me", label: "我的", icon: "👤" },
];

const BottomNav: React.FC<{ active: TabKey; onChange: (tab: TabKey) => void }> = ({ active, onChange }) => (
  <nav className="bottom-nav">
    <div className="bottom-nav-inner">
      {TAB_ITEMS.map(item => (
        <button
          key={item.key}
          className={`bottom-nav-item ${active === item.key ? "active" : ""}`}
          onClick={() => onChange(item.key)}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </button>
      ))}
    </div>
  </nav>
);

/* ============================================================
   徽章解锁弹窗
   ============================================================ */
const BadgePopup: React.FC<{ badge: Badge; onClose: () => void }> = ({ badge, onClose }) => (
  <motion.div
    className="badge-unlock-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="badge-unlock-popup"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={e => e.stopPropagation()}
    >
      <div className="badge-unlock-icon">{badge.icon}</div>
      <h3 className="badge-unlock-title">解锁新徽章</h3>
      <p className="badge-unlock-name">{badge.label}</p>
      <p className="badge-unlock-desc">{badge.description}</p>
      <button className="badge-unlock-close" onClick={onClose}>收下</button>
    </motion.div>
  </motion.div>
);

/* ============================================================
   完成弹窗
   ============================================================ */
const CompletionModal: React.FC<{
  id: number; note: string; img: string | null; date: string; elapsed?: number;
  onNoteChange: (v: string) => void; onImgChange: (v: string | null) => void; onDateChange: (v: string) => void;
  onConfirm: () => void; onCancel: () => void;
}> = ({ id, note, img, date, elapsed, onNoteChange, onImgChange, onDateChange, onConfirm, onCancel }) => {
  const thing = nodes.find(n => n.id === id);
  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onImgChange(reader.result as string);
    reader.readAsDataURL(file);
  };
  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}分${sec > 0 ? sec + "秒" : ""}` : `${sec}秒`;
  };
  return (
    <motion.div className="completion-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel}>
      <motion.div className="completion-popup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={e => e.stopPropagation()}>
        <button className="completion-close" onClick={onCancel}>✕</button>
        <span className="completion-icon">{thing?.icon}</span>
        <h3 className="completion-name">{thing?.text}</h3>
        {elapsed !== undefined && elapsed > 0 && (
          <div className="completion-elapsed">⏱ 用时 {formatElapsed(elapsed)}</div>
        )}
        <input type="date" className="completion-date" value={date} onChange={e => onDateChange(e.target.value)} />
        <textarea className="completion-note" placeholder="记录下这一刻的感受吧..." value={note} onChange={e => onNoteChange(e.target.value)} rows={3} />
        <div className="completion-img-row">
          {img ? (
            <div className="completion-img-preview">
              <img src={img} alt="" />
              <button className="completion-img-remove" onClick={() => onImgChange(null)}>✕</button>
            </div>
          ) : (
            <label className="completion-img-upload">
              <span>📷 上传照片</span>
              <input type="file" accept="image/*" onChange={handleImgUpload} style={{ display: "none" }} />
            </label>
          )}
        </div>
        <button className="completion-confirm" onClick={onConfirm}>完成</button>
      </motion.div>
    </motion.div>
  );
};

/* ============================================================
   主组件
   ============================================================ */
const RechargePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [doneIds, setDoneIds] = useState<Set<number>>(loadDoneIds);
  const [hiddenFound, setHiddenFound] = useState(false);
  const [catState, setCatState] = useState<"sleep" | "stare" | "yawn">("sleep");
  const [newBadge, setNewBadge] = useState<Badge | null>(null);
  const catTriggered = useRef(false);

  const [completionModal, setCompletionModal] = useState<{ open: boolean; id: number; elapsed?: number } | null>(null);
  const [completionNote, setCompletionNote] = useState("");
  const [completionImg, setCompletionImg] = useState<string | null>(null);
  const [completionDate, setCompletionDate] = useState(() => new Date().toISOString().slice(0, 10));

  const doneIdsRef = useRef(doneIds);
  useEffect(() => { doneIdsRef.current = doneIds; }, [doneIds]);

  const doCompleteCore = useCallback((id: number) => {
    setDoneIds((prev) => {
      if (prev.has(id)) return prev; // 防止重复记录
      const next = new Set(prev);
      next.add(id);
      saveCompletion(id);
      try {
        localStorage.setItem(DONE_KEY, JSON.stringify([...next]));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const handleToggle = useCallback((id: number) => {
    if (doneIdsRef.current.has(id)) {
      setDoneIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        try {
          localStorage.setItem(DONE_KEY, JSON.stringify([...next]));
        } catch { /* ignore */ }
        return next;
      });
    } else {
      // 先变绿，再弹窗
      doCompleteCore(id);
      setTimeout(() => setCompletionModal({ open: true, id }), 600);
    }
  }, []);

  const handleConfirmCompletion = useCallback(() => {
    if (!completionModal) return;
    const { id } = completionModal;

    try {
      const raw = localStorage.getItem("recharge_notes");
      const notes = raw ? JSON.parse(raw) : [];
      notes.push({
        id,
        note: completionNote,
        img: completionImg,
        date: completionDate,
        timestamp: Date.now(),
      });
      localStorage.setItem("recharge_notes", JSON.stringify(notes));
    } catch { /* ignore */ }

    doCompleteCore(id);

    setCompletionModal(null);
    setCompletionNote("");
    setCompletionImg(null);
    setCompletionDate(new Date().toISOString().slice(0, 10));
  }, [completionModal, completionNote, completionImg, completionDate, doCompleteCore]);

  const handleHiddenClick = () => {
    setHiddenFound(true);
    if (!catTriggered.current) {
      catTriggered.current = true;
      setCatState("stare");
      setTimeout(() => setCatState("yawn"), 2000);
      setTimeout(() => setCatState("sleep"), 3500);
    }
  };

  return (
    <div className="recharge-page">
      {/* 顶部返回 + 标题区（仅首页Tab显示） */}
      {activeTab === "home" && (
        <>
          <header className="recharge-topbar">
            <Link to="/mickey" className="recharge-back">
              ← 回到作品集
            </Link>
            <span className="recharge-topbar-meta">Recharge Station</span>
          </header>
          <section className="recharge-hero">
            <motion.h1
              className="recharge-title"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              今日充能计划
            </motion.h1>
            <motion.p
              className="recharge-subtitle"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            >
              每天拔掉一根消耗能量的线，接入一件滋养自己的小事。
            </motion.p>
          </section>
        </>
      )}

      {/* Tab 内容区 */}
      <div className="recharge-content">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              className="tab-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <HomePage doneIds={doneIds} onToggle={doCompleteCore} onRequestCompletion={(id, elapsed) => setCompletionModal({ open: true, id, elapsed })} onShowBadge={setNewBadge} />
            </motion.div>
          )}
          {activeTab === "list" && (
            <motion.div
              key="list"
              className="tab-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <ListPage
                doneIds={doneIds}
                onToggle={handleToggle}
                hiddenFound={hiddenFound}
                catState={catState}
                onHiddenClick={handleHiddenClick}
              />
            </motion.div>
          )}
          {activeTab === "stats" && (
            <motion.div
              key="stats"
              className="tab-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <StatsPage />
            </motion.div>
          )}
          {activeTab === "me" && (
            <motion.div
              key="me"
              className="tab-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <MePage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部导航 */}
      <BottomNav active={activeTab} onChange={setActiveTab} />

      {/* 第101弹窗 */}
      <AnimatePresence>
        {hiddenFound && <HiddenPopup onClose={() => setHiddenFound(false)} />}
      </AnimatePresence>

      {/* 徽章解锁弹窗 */}
      <AnimatePresence>
        {newBadge && <BadgePopup badge={newBadge} onClose={() => setNewBadge(null)} />}
      </AnimatePresence>

      {/* 完成弹窗 */}
      <AnimatePresence>
        {completionModal?.open && (
          <CompletionModal
            id={completionModal.id}
            note={completionNote}
            img={completionImg}
            date={completionDate}
            elapsed={completionModal.elapsed}
            onNoteChange={setCompletionNote}
            onImgChange={setCompletionImg}
            onDateChange={setCompletionDate}
            onConfirm={handleConfirmCompletion}
            onCancel={() => setCompletionModal(null)}
          />
        )}
      </AnimatePresence>

      <style>{`
        .recharge-page, .recharge-page * { cursor: auto; }
        .recharge-page a, .recharge-page button, .recharge-page input { cursor: pointer; }

        .recharge-page {
          min-height: 100vh;
          color: #5a5048;
          background-color: #FDFBF7;
          background-image: url(${ECG_PATTERN});
          background-size: 400px 120px;
          background-repeat: repeat;
          font-family: "Noto Sans SC", system-ui, sans-serif;
          padding: 0 24px 0;
          position: relative;
        }

        /* ===== 顶部 ===== */
        .recharge-topbar {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 720px; margin: 0 auto; padding: 24px 4px 0;
          position: relative; z-index: 2;
        }
        .recharge-back {
          font-size: 14px; color: #9a8a7e; text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease, transform 0.25s ease;
        }
        .recharge-back:hover { color: #c8924a; transform: translateX(-3px); }
        .recharge-topbar-meta {
          font-size: 11px; color: #b8aa9a; letter-spacing: 0.28em; text-transform: uppercase;
        }

        /* ===== 标题区 ===== */
        .recharge-hero {
          max-width: 720px; margin: 0 auto; padding: 36px 4px 24px; text-align: center;
          position: relative; z-index: 2;
        }
        .recharge-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(26px, 4.5vw, 36px); font-weight: 700;
          color: #3a3a3a; margin: 0 0 10px; letter-spacing: 0.06em;
        }
        .recharge-subtitle {
          font-size: 14px; color: #9a8a7e; margin: 0; letter-spacing: 0.04em; line-height: 1.6;
        }

        /* ===== Tab内容区 ===== */
        .recharge-content {
          max-width: 720px;
          margin: 0 auto;
          padding-bottom: 64px;
          position: relative;
          z-index: 2;
        }
        .tab-panel {
          min-height: 50vh;
        }

        /* ===== 底部导航 ===== */
        .bottom-nav {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
          display: flex; justify-content: center;
          background: #FFFFFF;
          border-top: 1px solid rgba(180,170,160,0.1);
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        .bottom-nav-inner {
          display: flex; align-items: center; justify-content: space-around;
          width: 100%; max-width: 720px;
          height: 48px; padding: 0 24px;
        }
        .bottom-nav-item {
          display: flex; flex-direction: column; align-items: center; gap: 1px;
          padding: 6px 12px; border-radius: 10px;
          background: none; border: none;
          font-size: 14px; line-height: 1;
          transition: all 0.25s ease;
          color: #b8aa9a;
        }
        .bottom-nav-item.active {
          color: #7C6A9A; background: #F5F0FF;
        }
        .bottom-nav-icon { font-size: 18px; }
        .bottom-nav-label { font-size: 10px; letter-spacing: 0.02em; }

        /* ===== 能量节点流 ===== */
        .energy-flow {
          max-width: 680px; margin: 0 auto; padding: 8px 4px 0;
          position: relative; z-index: 2;
        }
        .energy-node { position: relative; padding: 4px 0; }

        /* 连接线 */
        .energy-line {
          position: absolute; left: 28px; top: 100%; width: 2px; height: 8px;
          background: linear-gradient(180deg, rgba(180,170,160,0.2), rgba(180,170,160,0.05));
          overflow: hidden; z-index: 0;
        }
        .energy-line.active {
          background: linear-gradient(180deg, rgba(100,220,120,0.5), rgba(100,220,120,0.15));
        }
        .energy-line-dot {
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(180,170,160,0.3);
        }
        .energy-node.hovered .energy-line-dot {
          background: rgba(200,180,100,0.6);
          animation: flow-down 1s linear infinite;
        }
        .energy-line.active .energy-line-dot {
          background: rgba(100,220,120,0.8);
          animation: flow-down 0.8s linear infinite;
        }
        @keyframes flow-down {
          0% { top: -3px; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 8px; opacity: 0; }
        }

        /* 节点胶囊 */
        .energy-capsule {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 11px 14px;
          border: 1px solid rgba(180,170,160,0.15);
          border-radius: 12px; background: rgba(255,253,248,0.85);
          transition: all 0.3s ease;
          font-family: inherit; text-align: left;
        }
        .energy-node.hovered .energy-capsule {
          border-color: rgba(220,160,80,0.3);
          background: rgba(255,253,248,0.95);
          box-shadow: 0 4px 16px -6px rgba(220,160,80,0.15);
        }
        .energy-node.charged .energy-capsule {
          border-color: rgba(100,220,120,0.35);
          background: rgba(240,255,242,0.75);
          box-shadow: 0 2px 12px -4px rgba(100,220,120,0.15);
        }
        .energy-icon {
          flex-shrink: 0; width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; color: #8a7a6e;
          filter: grayscale(0.4);
          transition: filter 0.3s ease;
        }
        .energy-node.charged .energy-icon { filter: grayscale(0); }
        .energy-text {
          flex: 1; font-size: 13px; color: #6b5e50; line-height: 1.5;
          letter-spacing: 0.01em;
          transition: color 0.3s ease;
        }
        .energy-node.charged .energy-text { color: #4a8a5a; }

        /* 电池 */
        .energy-battery {
          flex-shrink: 0; display: flex; align-items: center; gap: 1px;
          position: relative;
        }
        .energy-battery-cap {
          width: 2px; height: 8px; border-radius: 0 1px 1px 0;
          background: rgba(180,170,160,0.3);
        }
        .energy-battery-body {
          width: 22px; height: 12px; border-radius: 3px;
          border: 1.5px solid rgba(180,170,160,0.35);
          position: relative; overflow: hidden;
          transition: border-color 0.3s ease;
        }
        .energy-battery-fill {
          position: absolute; inset: 1px; border-radius: 1px;
          width: 0; transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .energy-battery.filled .energy-battery-body { border-color: rgba(100,220,120,0.6); }
        .energy-battery.filled .energy-battery-fill {
          width: calc(100% - 2px);
          background: linear-gradient(90deg, #6adc6a, #4cba4c);
          box-shadow: 0 0 6px rgba(100,220,120,0.6);
        }

        /* 粒子爆发 */
        .energy-burst {
          position: absolute; top: 50%; right: 40px; transform: translateY(-50%);
          pointer-events: none; z-index: 5;
        }
        .energy-particle {
          position: absolute; border-radius: 50%;
          background: #6adc6a;
          box-shadow: 0 0 4px rgba(100,220,120,0.8);
        }

        /* ===== 第101个隐藏电源 ===== */
        .hidden-node-zone {
          position: relative; display: flex; align-items: center; justify-content: center;
          gap: 16px; padding: 32px 0 20px; margin-top: 8px;
        }
        .hidden-node {
          width: 6px; height: 6px; border-radius: 50%;
          border: none; padding: 0;
          background: rgba(120,130,140,0.15);
          transition: all 0.4s ease;
          position: relative;
        }
        .hidden-node:hover {
          background: rgba(255,255,255,0.7);
          box-shadow: 0 0 8px 2px rgba(255,255,255,0.4);
        }
        .hidden-node.found {
          background: rgba(255,255,255,0.5);
          box-shadow: 0 0 6px 1px rgba(255,255,255,0.3);
        }

        /* 小猫 */
        .station-cat-wrap {
          position: absolute; right: 10%; bottom: -8px;
          animation: cat-breathe 3s ease-in-out infinite;
        }
        @keyframes cat-breathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .station-cat { overflow: visible; }
        .cat-stare { animation: cat-stare-shake 0.3s ease-in-out 3; }
        @keyframes cat-stare-shake {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(1px); }
        }
        .circuit-hint {
          text-align: center; font-size: 11px; color: #5a5048;
          opacity: 0.25; letter-spacing: 0.1em; margin: 20px 0 0;
        }

        /* ===== 第101弹窗 — 叶之书的微光 ===== */
        .hidden-overlay {
          position: fixed; inset: 0; z-index: 200;
          display: flex; align-items: center; justify-content: center; padding: 24px;
          background: rgba(200, 195, 185, 0.3);
        }
        .hidden-popup {
          position: relative; max-width: 420px; width: 100%; padding: 40px 48px;
          border-radius: 20px; text-align: center;
          background: rgba(245, 250, 247, 0.95);
          border: 1px solid rgba(180, 220, 190, 0.4);
          box-shadow: 0 2px 8px rgba(160, 180, 150, 0.06), 0 8px 28px rgba(0,0,0,0.03), 0 18px 52px rgba(0,0,0,0.025), 0 0 24px rgba(180, 220, 190, 0.12);
        }
        .hidden-close {
          position: absolute; top: 16px; right: 20px;
          font-size: 13px; color: #9aaa9a; letter-spacing: 0.05em;
          background: none; border: none; padding: 4px 8px;
          cursor: pointer; transition: color 0.3s ease;
          font-family: "Noto Sans SC", system-ui, sans-serif;
        }
        .hidden-close:hover { color: #4a9a6a; }
        .hidden-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 26px; font-weight: 600; color: #3a3a3a;
          margin: 0 0 16px; letter-spacing: 0.1em;
        }
        .hidden-text {
          font-size: 15px; color: #666; margin: 0 0 8px;
          line-height: 1.8; letter-spacing: 0.08em;
        }
        .hidden-deco {
          width: 40px; height: 1px; margin: 20px auto 0;
          background: linear-gradient(90deg, transparent, rgba(180, 220, 190, 0.6), transparent);
        }

        /* ===== 徽章解锁弹窗 ===== */
        .badge-unlock-overlay {
          position: fixed; inset: 0; z-index: 200;
          display: flex; align-items: center; justify-content: center; padding: 24px;
          background: rgba(200, 195, 185, 0.3);
        }
        .badge-unlock-popup {
          text-align: center; max-width: 320px; width: 100%;
          padding: 36px 32px 28px; border-radius: 20px;
          background: rgba(245, 250, 247, 0.95);
          border: 1px solid rgba(180, 220, 190, 0.4);
          box-shadow: 0 2px 8px rgba(160, 180, 150, 0.06), 0 8px 28px rgba(0,0,0,0.03), 0 0 24px rgba(180, 220, 190, 0.12);
        }
        .badge-unlock-icon { font-size: 48px; margin-bottom: 12px; }
        .badge-unlock-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 18px; font-weight: 600; color: #3a3a3a;
          margin: 0 0 8px; letter-spacing: 0.1em;
        }
        .badge-unlock-name { font-size: 15px; color: #5a5048; margin: 0 0 6px; letter-spacing: 0.06em; }
        .badge-unlock-desc { font-size: 12px; color: #9a8a7e; margin: 0 0 20px; letter-spacing: 0.03em; }
        .badge-unlock-close {
          padding: 8px 28px; border: 1px solid rgba(100, 220, 120, 0.35);
          border-radius: 10px; background: rgba(240, 255, 242, 0.7);
          font-family: "Noto Sans SC", system-ui, sans-serif;
          font-size: 13px; color: #4a8a5a; cursor: pointer;
          transition: all 0.25s ease; letter-spacing: 0.04em;
        }
        .badge-unlock-close:hover {
          background: rgba(240, 255, 242, 0.9);
          box-shadow: 0 2px 8px rgba(100, 220, 120, 0.12);
        }

        /* ===== Tab 1 — 首页 ===== */
        .tab-home { padding: 0 4px; }
        .home-healing-card {
          padding: 16px; border-radius: 16px; margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
          background: #FFFFFF; border: 1px solid rgba(180,170,160,0.1);
          box-shadow: 0 2px 12px rgba(160,150,140,0.04);
          flex-wrap: wrap;
        }
        .home-healing-emoji { font-size: 20px; flex-shrink: 0; }
        .home-healing-text {
          flex: 1; min-width: 0;
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px; color: #5a5048; letter-spacing: 0.04em;
          line-height: 1.6;
        }
        .home-streak {
          display: inline-block; margin-top: 6px;
          font-size: 11px; color: #b8aa9a; letter-spacing: 0.04em;
        }
        .home-section-label {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px; font-weight: 600; color: #7C6A9A;
          letter-spacing: 0.06em; margin: 16px 0 10px;
        }
        .home-state-section {
          background: #FFFFFF; border-radius: 16px; padding: 16px;
          border: 1px solid rgba(180,170,160,0.1);
          box-shadow: 0 2px 12px rgba(160,150,140,0.04);
          margin-bottom: 20px;
        }
        .home-state-row {
          display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
        }
        .home-state-row:last-child { margin-bottom: 0; }
        .home-state-key {
          flex-shrink: 0; width: 32px; font-size: 12px; color: #9a8a7e;
          text-align: right; letter-spacing: 0.04em;
        }
        .home-state-options {
          display: flex; gap: 6px; flex-wrap: wrap; flex: 1;
        }
        .home-mood-btn {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          padding: 8px 10px; border: 1px solid rgba(180,170,160,0.12);
          border-radius: 10px; background: rgba(253,251,247,0.6);
          font-family: inherit; font-size: 10px; color: #9a8a7e;
          transition: all 0.25s ease; min-width: 44px;
        }
        .home-mood-btn:hover { border-color: rgba(124,106,154,0.3); background: rgba(253,251,247,0.9); }
        .home-mood-btn.active {
          border-color: rgba(124,106,154,0.5); background: rgba(184,169,217,0.15);
          box-shadow: 0 2px 8px rgba(124,106,154,0.1);
        }
        .home-mood-icon { font-size: 18px; }
        .home-mood-label { font-size: 10px; letter-spacing: 0.02em; }

        .home-recommend-btn {
          width: 100%; margin-top: 14px; padding: 12px;
          border: none; border-radius: 12px;
          background: linear-gradient(135deg, #7C6A9A, #B8A9D9);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px; font-weight: 600; color: #FFFFFF;
          letter-spacing: 0.06em;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(124,106,154,0.2);
        }
        .home-recommend-btn:hover {
          box-shadow: 0 6px 20px rgba(124,106,154,0.3);
          transform: translateY(-1px);
        }
        .home-recommend-btn-icon { margin-right: 6px; }
        .home-mode-hint {
          margin-top: 10px; text-align: center;
          font-size: 12px; color: #b8aa9a;
          letter-spacing: 0.03em; line-height: 1.5;
        }

        .home-results { padding-bottom: 8px; }
        .home-rec-cards { display: flex; flex-direction: column; gap: 10px; }
        .home-rec-card {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 14px 16px; border-radius: 14px;
          background: #FFFFFF; border: 1px solid rgba(180,170,160,0.1);
          box-shadow: 0 2px 10px rgba(160,150,140,0.04);
          transition: all 0.25s ease;
        }
        .home-rec-card:hover {
          border-color: rgba(124,106,154,0.2);
          box-shadow: 0 4px 16px rgba(124,106,154,0.08);
        }
        .home-rec-card-top {
          display: flex; align-items: flex-start; gap: 10px; flex: 1; min-width: 0;
        }
        .home-rec-card-icon {
          flex-shrink: 0; width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; background: rgba(184,169,217,0.1);
          border-radius: 8px;
        }
        .home-rec-card-content { flex: 1; min-width: 0; }
        .home-rec-card-name {
          font-size: 13px; color: #5a5048; margin: 0 0 4px; line-height: 1.4;
          letter-spacing: 0.01em;
        }
        .home-rec-card-reason {
          font-size: 11px; color: #b8aa9a; margin: 0 0 4px; letter-spacing: 0.02em;
        }
        .home-rec-header-mode {
          font-size: 11px; color: #b8aa9a; margin: 0 0 12px;
          letter-spacing: 0.04em; font-style: italic;
        }
        .home-rec-card-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .home-rec-tag {
          font-size: 10px; padding: 2px 6px; border-radius: 4px;
          border: 1px solid; opacity: 0.8; letter-spacing: 0.02em;
        }
        .home-rec-card-action {
          flex-shrink: 0; padding: 7px 16px; border-radius: 8px;
          border: 1px solid rgba(100,220,120,0.3); background: rgba(240,255,242,0.6);
          font-family: "Noto Sans SC", system-ui, sans-serif;
          font-size: 12px; color: #4a8a5a; white-space: nowrap;
          transition: all 0.25s ease;
        }
        .home-rec-card-action:hover {
          border-color: rgba(100,220,120,0.5); background: rgba(240,255,242,0.85);
          box-shadow: 0 2px 8px rgba(100,220,120,0.12);
        }
        .home-rec-card-actions {
          display: flex; align-items: center; gap: 6px; flex-shrink: 0;
        }
        .home-rec-card-detail {
          padding: 7px 12px; border-radius: 8px; white-space: nowrap;
          border: 1px solid rgba(124,106,154,0.2); background: rgba(184,169,217,0.08);
          font-family: "Noto Sans SC", system-ui, sans-serif;
          font-size: 11px; color: #7C6A9A;
          transition: all 0.25s ease;
        }
        .home-rec-card-detail:hover {
          border-color: rgba(124,106,154,0.4); background: rgba(184,169,217,0.15);
        }
        .home-rec-card-timer {
          padding: 7px 10px; border-radius: 8px; white-space: nowrap;
          border: 1px solid rgba(180,170,160,0.15); background: rgba(253,251,247,0.6);
          font-family: "Noto Sans SC", system-ui, sans-serif;
          font-size: 11px; color: #9a8a7e;
          transition: all 0.25s ease;
          min-width: 56px; text-align: center;
        }
        .home-rec-card-timer:hover {
          border-color: rgba(180,170,160,0.3); background: rgba(253,251,247,0.9);
        }
        .home-rec-card-timer-btn {
          padding: 7px 12px; border-radius: 8px; white-space: nowrap;
          border: 1px solid rgba(180,170,160,0.15); background: rgba(253,251,247,0.6);
          font-family: "Noto Sans SC", system-ui, sans-serif;
          font-size: 12px; color: #9a8a7e;
          transition: all 0.25s ease;
        }
        .home-rec-card-timer-btn:hover {
          border-color: rgba(180,170,160,0.3); background: rgba(253,251,247,0.9);
        }
        .home-rec-card-timer-active {
          padding: 7px 16px; border-radius: 8px; white-space: nowrap;
          border: 1px solid rgba(124,106,154,0.4); background: rgba(184,169,217,0.15);
          font-family: "Noto Sans SC", system-ui, sans-serif;
          font-size: 12px; color: #7C6A9A;
          transition: all 0.25s ease;
        }
        .home-rec-card-timer-active:hover {
          border-color: rgba(124,106,154,0.6); background: rgba(184,169,217,0.25);
        }
        .home-rec-card.done { opacity: 0.45; pointer-events: none; }
        .home-rec-card-action.done {
          opacity: 0.6; cursor: default;
          border-color: rgba(180,170,160,0.15); background: rgba(180,170,160,0.06);
          color: #b8aa9a;
        }

        /* 详情弹窗 */
        .detail-overlay {
          position: fixed; inset: 0; z-index: 200;
          display: flex; align-items: center; justify-content: center; padding: 24px;
          background: rgba(200, 195, 185, 0.3);
        }
        .detail-popup {
          position: relative; max-width: 400px; width: 100%;
          padding: 36px 32px 28px; border-radius: 20px; text-align: center;
          background: rgba(245, 250, 247, 0.95);
          border: 1px solid rgba(180, 220, 190, 0.4);
          box-shadow: 0 2px 8px rgba(160, 180, 150, 0.06), 0 8px 28px rgba(0,0,0,0.03), 0 0 24px rgba(180, 220, 190, 0.12);
        }
        .detail-close {
          position: absolute; top: 16px; right: 20px;
          font-size: 14px; color: #9aaa9a; background: none; border: none;
          padding: 4px 8px; cursor: pointer; transition: color 0.3s ease;
          font-family: "Noto Sans SC", system-ui, sans-serif;
        }
        .detail-close:hover { color: #5a5048; }
        .detail-icon { font-size: 36px; display: block; margin-bottom: 12px; }
        .detail-name {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 16px; font-weight: 600; color: #3a3a3a;
          margin: 0 0 8px; line-height: 1.6; letter-spacing: 0.04em;
        }
        .detail-reason {
          font-size: 13px; color: #6b5e50; margin: 0 0 12px;
          line-height: 1.6; letter-spacing: 0.03em;
        }
        .detail-tags { display: flex; justify-content: center; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
        .detail-action {
          padding: 10px 32px; border: none; border-radius: 12px;
          background: linear-gradient(135deg, #7C6A9A, #B8A9D9);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px; font-weight: 600; color: #FFFFFF;
          letter-spacing: 0.06em; cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(124,106,154,0.2);
        }
        .detail-action:hover {
          box-shadow: 0 6px 20px rgba(124,106,154,0.3);
          transform: translateY(-1px);
        }

        /* 首页 Toast */
        .home-toast-container {
          position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
          z-index: 100; display: flex; flex-direction: column-reverse;
          gap: 8px; align-items: center; pointer-events: none;
        }
        .home-toast {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 12px; background: #FFFFFF;
          border: 1px solid rgba(180,220,190,0.3);
          box-shadow: 0 4px 16px rgba(100,120,100,0.1);
          white-space: nowrap;
        }
        .home-toast-icon { font-size: 16px; }
        .home-toast-text { font-size: 13px; color: #5a5048; letter-spacing: 0.03em; }

        /* ===== Tab 2 — 清单 ===== */
        .tab-list { padding: 0 4px; }
        .list-filter-bar {
          display: flex; gap: 6px; flex-wrap: wrap; padding: 8px 0 16px;
          position: sticky; top: 0; z-index: 5;
          background: #FDFBF7;
        }
        .list-filter-btn {
          display: flex; align-items: center; gap: 3px;
          padding: 6px 12px; border-radius: 8px;
          border: 1px solid rgba(180,170,160,0.12); background: #FFFFFF;
          font-family: "Noto Sans SC", system-ui, sans-serif;
          font-size: 12px; color: #9a8a7e; transition: all 0.25s ease;
        }
        .list-filter-btn:hover { border-color: rgba(124,106,154,0.3); color: #7C6A9A; }
        .list-filter-btn.active {
          border-color: rgba(124,106,154,0.5); background: rgba(184,169,217,0.12);
          color: #7C6A9A; font-weight: 500;
        }

        /* ===== Tab 3 — 统计 ===== */
        .tab-stats { padding: 0 4px; }
        .stats-overview {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;
        }
        .stats-card {
          padding: 18px 16px; border-radius: 16px; text-align: center;
          display: flex; flex-direction: column; gap: 4px;
        }
        .stats-card-green { background: linear-gradient(135deg, rgba(76,186,76,0.12), rgba(76,186,76,0.04)); }
        .stats-card-gold { background: linear-gradient(135deg, rgba(255,217,61,0.15), rgba(255,217,61,0.04)); }
        .stats-card-purple { background: linear-gradient(135deg, rgba(124,106,154,0.15), rgba(184,169,217,0.06)); }
        .stats-card-pink { background: linear-gradient(135deg, rgba(255,143,163,0.15), rgba(255,143,163,0.04)); }
        .stats-card-value {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 28px; font-weight: 700; color: #3a3a3a;
        }
        .stats-card-label { font-size: 11px; color: #9a8a7e; letter-spacing: 0.04em; }

        .stats-section { margin-bottom: 24px; }
        .stats-section-label {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px; font-weight: 600; color: #7C6A9A;
          letter-spacing: 0.06em; margin: 0 0 8px;
        }
        .stats-timeline-legend {
          display: flex; align-items: center; gap: 14px; margin-bottom: 12px;
          font-size: 11px; color: #b8aa9a; letter-spacing: 0.03em;
        }
        .stats-legend-dot {
          display: inline-block; width: 7px; height: 7px; border-radius: 50%;
          margin-right: 4px; vertical-align: middle;
        }
        .stats-legend-dot.pink { background: #FF8FA3; }
        .stats-legend-dot.purple { background: #B8A9D9; }
        .stats-legend-hint { flex: 1; text-align: right; color: #B8A9D9; }

        /* 标签分布条形图 */
        .stats-tag-bars { display: flex; flex-direction: column; gap: 10px; }
        .stats-tag-bar-row {
          display: flex; align-items: center; gap: 10px;
        }
        .stats-tag-bar-label {
          flex-shrink: 0; width: 80px; font-size: 12px; color: #6b5e50;
          letter-spacing: 0.02em; text-align: right;
        }
        .stats-tag-bar-track {
          flex: 1; height: 8px; border-radius: 4px;
          background: rgba(180,170,160,0.1); overflow: hidden;
        }
        .stats-tag-bar-fill {
          height: 100%; border-radius: 4px;
          transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        .stats-tag-bar-count {
          flex-shrink: 0; width: 24px; font-size: 12px; color: #9a8a7e;
          text-align: left;
        }

        /* Canvas 折线图 */
        .stats-chart-wrap {
          width: 100%; height: 200px; border-radius: 12px;
          background: #FFFFFF; border: 1px solid rgba(180,170,160,0.1);
          box-shadow: 0 2px 8px rgba(160,150,140,0.04);
          padding: 8px;
        }
        .stats-chart-canvas { width: 100%; height: 100%; display: block; }

        /* 时间线 */
        .stats-timeline { position: relative; padding-left: 20px; }
        .stats-timeline-empty {
          font-size: 12px; color: #b8aa9a; text-align: center;
          padding: 20px 0; letter-spacing: 0.04em;
        }
        .stats-timeline-item {
          position: relative; padding: 8px 0;
        }
        .stats-timeline-dot {
          position: absolute; left: -20px; top: 16px;
          width: 8px; height: 8px; border-radius: 50%;
          background: #B8A9D9; border: 2px solid #FFFFFF;
          transition: background 0.25s ease;
        }
        .stats-timeline-dot.has-record {
          background: #FF8FA3;
          width: 10px; height: 10px; left: -21px; top: 15px;
          box-shadow: 0 0 0 3px rgba(255,143,163,0.2);
        }
        .stats-timeline-line {
          position: absolute; left: -17px; top: 28px;
          width: 2px; height: calc(100% - 8px);
          background: rgba(184,169,217,0.2);
        }
        .stats-timeline-content {
          display: flex; align-items: center; gap: 8px;
        }
        .stats-timeline-icon { font-size: 14px; flex-shrink: 0; }
        .stats-timeline-text {
          flex: 1; font-size: 12px; color: #6b5e50;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .stats-timeline-time {
          flex-shrink: 0; font-size: 10px; color: #b8aa9a;
          letter-spacing: 0.02em;
        }
        .stats-timeline-content { cursor: pointer; }
        .stats-timeline-detail {
          margin-top: 8px; padding: 12px 14px;
          background: rgba(245, 240, 235, 0.5); border-radius: 10px;
          animation: fadeUp 0.3s ease;
        }
        .stats-timeline-note {
          font-size: 13px; color: #5a5048; line-height: 1.6; margin: 0 0 6px;
          font-style: italic;
        }
        .stats-timeline-img {
          width: 100%; max-width: 200px; border-radius: 8px;
          margin-bottom: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .stats-timeline-date {
          font-size: 11px; color: #b8aa9a; letter-spacing: 0.02em;
        }

        /* 徽章墙 */
        .stats-badges {
          display: flex; gap: 10px; flex-wrap: wrap;
        }
        .stats-badge-item {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          width: 72px; padding: 14px 8px; border-radius: 12px;
          background: #FFFFFF; border: 1px solid rgba(180,170,160,0.1);
          box-shadow: 0 2px 8px rgba(160,150,140,0.04);
          transition: all 0.25s ease;
        }
        .stats-badge-item.unlocked {
          border-color: rgba(255,217,61,0.3);
          background: rgba(255,253,248,0.95);
        }
        .stats-badge-item.locked { opacity: 0.5; }
        .stats-badge-icon { font-size: 24px; }
        .stats-badge-label { font-size: 10px; color: #9a8a7e; letter-spacing: 0.02em; }
        .stats-badge-item.unlocked .stats-badge-label { color: #5a5048; }

        /* ===== Tab 4 — 我的 ===== */
        .tab-me { padding: 0 4px; }
        .me-user-card {
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          padding: 32px 24px 24px; border-radius: 20px; margin-bottom: 24px;
          background: linear-gradient(135deg, #3a3356, #5a4a72);
          box-shadow: 0 4px 20px rgba(60,50,80,0.2);
        }
        .me-user-avatar { font-size: 48px; }
        .me-user-info { display: flex; align-items: center; gap: 8px; }
        .me-user-name {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 18px; font-weight: 600; color: #FFFFFF;
          letter-spacing: 0.06em;
        }
        .me-user-level {
          font-size: 12px; padding: 2px 10px; border-radius: 10px;
          background: rgba(255,217,61,0.2); color: #FFD93D;
          letter-spacing: 0.04em; font-weight: 500;
        }
        .me-user-stats {
          display: flex; gap: 32px; margin-top: 8px;
        }
        .me-user-stat {
          display: flex; flex-direction: column; align-items: center; gap: 2px;
        }
        .me-user-stat-value {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 20px; font-weight: 700; color: #FFFFFF;
        }
        .me-user-stat-label {
          font-size: 10px; color: rgba(255,255,255,0.6); letter-spacing: 0.04em;
        }

        .me-section { margin-bottom: 24px; }
        .me-section-label {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px; font-weight: 600; color: #7C6A9A;
          letter-spacing: 0.06em; margin: 0 0 10px;
        }
        .me-preference-tags {
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .me-preference-empty {
          font-size: 12px; color: #b8aa9a; letter-spacing: 0.02em;
        }
        .me-preference-tag {
          font-size: 12px; padding: 5px 12px; border-radius: 8px;
          border: 1px solid; background: #FFFFFF;
          letter-spacing: 0.02em;
        }

        .me-settings { display: flex; flex-direction: column; gap: 2px; }
        .me-settings-btn {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 16px; border-radius: 12px;
          background: #FFFFFF; border: 1px solid rgba(180,170,160,0.1);
          font-family: "Noto Sans SC", system-ui, sans-serif;
          font-size: 14px; color: #5a5048; text-align: left;
          transition: all 0.25s ease; width: 100%;
        }
        .me-settings-btn:hover {
          background: rgba(253,251,247,0.8);
          border-color: rgba(180,170,160,0.2);
        }
        .me-settings-icon { font-size: 16px; }
        .me-settings-text { flex: 1; letter-spacing: 0.02em; }
        .me-settings-arrow { color: #b8aa9a; font-size: 18px; }

        /* 关于弹窗 */
        .about-overlay {
          position: fixed; inset: 0; z-index: 200;
          display: flex; align-items: center; justify-content: center; padding: 24px;
          background: rgba(200, 195, 185, 0.3);
        }
        .about-popup {
          position: relative; max-width: 380px; width: 100%;
          padding: 36px 32px 28px; border-radius: 20px; text-align: center;
          background: rgba(245, 250, 247, 0.95);
          border: 1px solid rgba(180, 220, 190, 0.4);
          box-shadow: 0 2px 8px rgba(160, 180, 150, 0.06), 0 8px 28px rgba(0,0,0,0.03), 0 0 24px rgba(180, 220, 190, 0.12);
        }
        .about-close {
          position: absolute; top: 16px; right: 20px;
          font-size: 14px; color: #9aaa9a; background: none; border: none;
          padding: 4px 8px; cursor: pointer; transition: color 0.3s ease;
          font-family: "Noto Sans SC", system-ui, sans-serif;
        }
        .about-close:hover { color: #5a5048; }
        .about-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 22px; font-weight: 600; color: #3a3a3a;
          margin: 0 0 6px; letter-spacing: 0.1em;
        }
        .about-version { font-size: 12px; color: #b8aa9a; margin: 0 0 12px; }
        .about-desc {
          font-size: 13px; color: #6b5e50; margin: 0; line-height: 1.7;
          letter-spacing: 0.03em;
        }
        .about-deco {
          width: 40px; height: 1px; margin: 20px auto 0;
          background: linear-gradient(90deg, transparent, rgba(180, 220, 190, 0.6), transparent);
        }

        /* ===== 完成弹窗 ===== */
        .completion-overlay {
          position: fixed; inset: 0; z-index: 200;
          display: flex; align-items: center; justify-content: center; padding: 24px;
          background: rgba(200, 195, 185, 0.3);
        }
        .completion-popup {
          position: relative; max-width: 400px; width: 100%;
          padding: 32px 28px 28px; border-radius: 20px; text-align: center;
          background: rgba(245, 250, 247, 0.95);
          border: 1px solid rgba(180, 220, 190, 0.4);
          box-shadow: 0 2px 8px rgba(160, 180, 150, 0.06), 0 8px 28px rgba(0,0,0,0.03), 0 0 24px rgba(180, 220, 190, 0.12);
        }
        .completion-close {
          position: absolute; top: 14px; right: 18px;
          font-size: 14px; color: #9aaa9a; background: none; border: none;
          padding: 4px 8px; cursor: pointer; transition: color 0.3s ease;
          font-family: "Noto Sans SC", system-ui, sans-serif;
        }
        .completion-close:hover { color: #5a5048; }
        .completion-icon { font-size: 36px; display: block; margin-bottom: 10px; }
        .completion-elapsed {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 14px; border-radius: 20px;
          background: rgba(255,217,61,0.12); color: #B8860B;
          font-size: 13px; font-weight: 500; margin-bottom: 12px;
        }
        .completion-name {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px; font-weight: 600; color: #3a3a3a;
          margin: 0 0 14px; line-height: 1.5; letter-spacing: 0.04em;
        }
        .completion-date {
          width: 100%; padding: 8px 10px; margin-bottom: 10px;
          border: 1px solid rgba(180,170,160,0.15); border-radius: 10px;
          background: #FFFFFF; font-family: inherit; font-size: 13px; color: #5a5048;
          text-align: left;
        }
        .completion-note {
          width: 100%; padding: 10px 12px; margin-bottom: 10px;
          border: 1px solid rgba(180,170,160,0.15); border-radius: 10px;
          background: #FFFFFF; font-family: inherit; font-size: 13px; color: #5a5048;
          line-height: 1.5; resize: none;
        }
        .completion-note:focus {
          outline: none; border-color: rgba(124,106,154,0.3);
        }
        .completion-img-row {
          display: flex; justify-content: center; margin-bottom: 16px;
        }
        .completion-img-upload {
          display: flex; align-items: center; gap: 6px;
          padding: 10px 18px; border-radius: 10px;
          border: 1px dashed rgba(180,170,160,0.3); background: rgba(253,251,247,0.6);
          font-size: 13px; color: #9a8a7e; cursor: pointer; transition: all 0.25s ease;
        }
        .completion-img-upload:hover {
          border-color: rgba(124,106,154,0.3); color: #7C6A9A;
        }
        .completion-img-preview {
          position: relative; width: 100px; height: 100px; border-radius: 10px;
          overflow: hidden; border: 1px solid rgba(180,170,160,0.15);
        }
        .completion-img-preview img { width: 100%; height: 100%; object-fit: cover; }
        .completion-img-remove {
          position: absolute; top: 4px; right: 4px;
          width: 20px; height: 20px; border-radius: 50%;
          background: rgba(0,0,0,0.4); color: #fff; border: none;
          font-size: 10px; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
        }
        .completion-confirm {
          width: 100%; padding: 11px;
          border: none; border-radius: 12px;
          background: linear-gradient(135deg, #7C6A9A, #B8A9D9);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px; font-weight: 600; color: #FFFFFF;
          letter-spacing: 0.06em; cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(124,106,154,0.2);
        }
        .completion-confirm:hover {
          box-shadow: 0 6px 20px rgba(124,106,154,0.3);
          transform: translateY(-1px);
        }

        /* ===== 分享卡片弹窗 ===== */
        .share-overlay {
          position: fixed; inset: 0; z-index: 200;
          display: flex; align-items: center; justify-content: center; padding: 24px;
          background: rgba(200, 195, 185, 0.3);
        }
        .share-popup {
          position: relative; max-width: 420px; width: 100%;
          padding: 28px 24px 24px; border-radius: 20px; text-align: center;
          background: rgba(245, 250, 247, 0.95);
          border: 1px solid rgba(180, 220, 190, 0.4);
          box-shadow: 0 2px 8px rgba(160, 180, 150, 0.06), 0 8px 28px rgba(0,0,0,0.03), 0 0 24px rgba(180, 220, 190, 0.12);
          max-height: 90vh; overflow-y: auto;
        }
        .share-close {
          position: sticky; top: 0; float: right;
          font-size: 16px; color: #9aaa9a; background: rgba(255,255,255,0.8); border: 1px solid rgba(180,170,160,0.1);
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: color 0.3s ease; z-index: 10;
          font-family: "Noto Sans SC", system-ui, sans-serif;
        }
        .share-close:hover { color: #5a5048; background: rgba(255,255,255,1); }
        .share-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 18px; font-weight: 600; color: #3a3a3a;
          margin: 0 0 16px; letter-spacing: 0.08em;
          clear: both;
        }
        .share-canvas-wrap {
          display: flex; justify-content: center; margin-bottom: 14px;
        }
        .share-canvas-wrap canvas {
          box-shadow: 0 4px 16px rgba(160,150,140,0.12);
          max-width: 100%; height: auto;
        }
        .share-canvas-placeholder {
          width: 320px; height: 580px; border-radius: 12px;
          background: #FFFFFF; border: 1px solid rgba(180,170,160,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: #b8aa9a;
        }
        .share-download {
          padding: 10px 32px; border: none; border-radius: 12px;
          background: linear-gradient(135deg, #7C6A9A, #B8A9D9);
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px; font-weight: 600; color: #FFFFFF;
          letter-spacing: 0.06em; cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(124,106,154,0.2);
        }
        .share-download:hover {
          box-shadow: 0 6px 20px rgba(124,106,154,0.3);
          transform: translateY(-1px);
        }

        /* ===== 移动端 ===== */
        @media (max-width: 640px) {
          .recharge-page { padding: 0 16px 0; }
          .energy-capsule { padding: 10px 12px; gap: 8px; }
          .energy-icon { width: 24px; font-size: 14px; }
          .energy-text { font-size: 12px; }
          .energy-battery-body { width: 18px; height: 10px; }
          .station-cat-wrap { right: 5%; }
          .bottom-nav { bottom: 12px; }
          .bottom-nav-item { padding: 4px 8px; font-size: 12px; }
          .bottom-nav-icon { font-size: 16px; }
          .bottom-nav-label { font-size: 9px; }
          .hidden-popup { padding: 32px 28px; border-radius: 16px; }
          .hidden-text { font-size: 14px; }
          .hidden-close { top: 12px; right: 14px; font-size: 12px; }
          .home-mood-btn { padding: 6px 8px; min-width: 38px; }
          .home-state-row { flex-wrap: nowrap; }
          .home-state-options { flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .home-mood-icon { font-size: 16px; }
          .home-mood-label { font-size: 9px; }
          .home-rec-card-actions { flex-direction: column; gap: 4px; }
          .list-filter-bar { flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 12px; }
          .list-filter-btn { white-space: nowrap; flex-shrink: 0; }
          .stats-card-value { font-size: 24px; }
          .stats-chart-wrap { height: 170px; }
          .stats-badge-item { width: 64px; padding: 12px 6px; }
          .me-user-card { padding: 24px 16px 20px; }
          .me-user-avatar { font-size: 40px; }
          .me-user-name { font-size: 16px; }
          .me-user-stats { gap: 24px; }
          .me-user-stat-value { font-size: 18px; }
        }
      `}</style>
    </div>
  );
};

export default RechargePage;
