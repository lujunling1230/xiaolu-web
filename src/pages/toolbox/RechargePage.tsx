import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * 回血清单 · 微型能量站
 *
 * 核心隐喻：补充生命能量 / 充电。
 * 垂直能量节点流：每件小事是一个胶囊电池节点，点击接通电量。
 * 第101个隐藏电源：哲学节点，允许自己永远充不满电。
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
const STORAGE_KEY = "recharge_count";
const DONE_KEY = "recharge_done_ids";

function loadCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? Math.max(0, Number(raw) || 0) : 0;
  } catch {
    return 0;
  }
}

function loadDoneIds(): Set<number> {
  try {
    const raw = localStorage.getItem(DONE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function isThisWeek(): boolean {
  try {
    const ts = Number(localStorage.getItem("recharge_count_ts") || 0);
    if (!ts) return false;
    const now = new Date();
    const then = new Date(ts);
    const day = now.getDay() || 7;
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() - (day - 1));
    return then >= monday;
  } catch {
    return false;
  }
}

function getWeekStartCount(): number {
  return isThisWeek() ? loadCount() : 0;
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
   能量节点组件
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
   主组件
   ============================================================ */
const RechargePage: React.FC = () => {
  const [doneIds, setDoneIds] = useState<Set<number>>(loadDoneIds);
  const [weekCount, setWeekCount] = useState<number>(getWeekStartCount);
  const [countBump, setCountBump] = useState(0);
  const [hiddenFound, setHiddenFound] = useState(false);
  const [catState, setCatState] = useState<"sleep" | "stare" | "yawn">("sleep");
  const catTriggered = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback((id: number) => {
    setDoneIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // 增加计数
        setWeekCount((c) => {
          const nc = c + 1;
          try {
            localStorage.setItem(STORAGE_KEY, String(nc));
            localStorage.setItem("recharge_count_ts", String(Date.now()));
          } catch { /* ignore */ }
          return nc;
        });
        setCountBump((n) => n + 1);
      }
      try {
        localStorage.setItem(DONE_KEY, JSON.stringify([...next]));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  // 加载时心电图跳动
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.classList.add("ecg-pulse");
    const t = setTimeout(() => el.classList.remove("ecg-pulse"), 1200);
    return () => clearTimeout(t);
  }, []);

  // 第101个节点点击 → 小猫联动
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
    <div className="recharge-page" ref={scrollRef}>
      {/* 顶部返回 */}
      <header className="recharge-topbar">
        <Link to="/mickey" className="recharge-back">
          ← 回到妙妙工具箱
        </Link>
        <span className="recharge-topbar-meta">Recharge Station</span>
      </header>

      {/* 标题区 */}
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

      {/* 能量节点流 */}
      <section className="energy-flow">
        {nodes.map((node, i) => (
          <EnergyNodeItem
            key={node.id}
            node={node}
            index={i}
            done={doneIds.has(node.id)}
            onToggle={handleToggle}
          />
        ))}

        {/* 第101个隐藏电源 */}
        <div className="hidden-node-zone">
          <button
            className={`hidden-node ${hiddenFound ? "found" : ""}`}
            onClick={handleHiddenClick}
            aria-label="隐藏电源"
          />
          {/* 小猫 */}
          <div className="station-cat-wrap">
            <StationCat state={catState} />
          </div>
        </div>

        {/* 底部暗示文字 */}
        <p className="circuit-hint">电路末端还有一个预留接口……</p>
      </section>

      {/* 能量计数（固定右下角，毛玻璃） */}
      <motion.div
        className="recharge-counter"
        key={countBump}
        initial={{ scale: 0.9, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
      >
        <span className="recharge-counter-emoji">⚡️</span>
        <span className="recharge-counter-text">
          本周已回血 <b>{weekCount}</b> 次
        </span>
      </motion.div>

      {/* 第101弹窗 */}
      <AnimatePresence>
        {hiddenFound && <HiddenPopup onClose={() => setHiddenFound(false)} />}
      </AnimatePresence>

      <style>{`
        .recharge-page, .recharge-page * { cursor: auto; }
        .recharge-page a, .recharge-page button { cursor: pointer; }

        .recharge-page {
          min-height: 100vh;
          color: #5a5048;
          background-color: #FDFBF7;
          background-image: url(${ECG_PATTERN});
          background-size: 400px 120px;
          background-repeat: repeat;
          font-family: "Noto Sans SC", system-ui, sans-serif;
          padding: 0 24px 100px;
          position: relative;
        }
        /* 心电图加载跳动 */
        .recharge-page.ecg-pulse::before {
          content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background: url(${ECG_PATTERN});
          background-size: 400px 120px;
          animation: ecg-flash 1.2s ease-out;
        }
        @keyframes ecg-flash {
          0% { opacity: 0; }
          20% { opacity: 0.4; }
          100% { opacity: 0; }
        }

        /* 顶部 */
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

        /* 标题区 */
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

        /* ===== 能量节点流 ===== */
        .energy-flow {
          max-width: 680px; margin: 0 auto; padding: 8px 4px 0;
          position: relative; z-index: 2;
        }

        .energy-node {
          position: relative; padding: 4px 0;
        }

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
          border-radius: 12px; background: rgba(255,253,248,0.6);
          backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
          transition: all 0.3s ease;
          font-family: inherit; text-align: left;
        }
        .energy-node.hovered .energy-capsule {
          border-color: rgba(220,160,80,0.3);
          background: rgba(255,253,248,0.85);
          box-shadow: 0 4px 16px -6px rgba(220,160,80,0.15);
        }
        .energy-node.charged .energy-capsule {
          border-color: rgba(100,220,120,0.35);
          background: rgba(240,255,242,0.7);
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
        .energy-battery.filled .energy-battery-body {
          border-color: rgba(100,220,120,0.6);
        }
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

        /* 底部暗示 */
        .circuit-hint {
          text-align: center; font-size: 11px; color: #5a5048;
          opacity: 0.25; letter-spacing: 0.1em; margin: 20px 0 0;
        }

        /* ===== 能量计数 ===== */
        .recharge-counter {
          position: fixed; bottom: 24px; right: 24px; z-index: 40;
          display: flex; align-items: center; gap: 8px;
          padding: 10px 18px; border-radius: 999px;
          background: rgba(255,253,248,0.7);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(180,170,160,0.2);
          box-shadow: 0 8px 24px -10px rgba(120,100,80,0.2);
        }
        .recharge-counter-emoji { font-size: 14px; }
        .recharge-counter-text { font-size: 13px; color: #6b5e50; letter-spacing: 0.03em; }
        .recharge-counter-text b { color: #4cba4c; font-size: 15px; }

        /* ===== 第101弹窗 — 叶之书的微光 ===== */
        .hidden-overlay {
          position: fixed; inset: 0; z-index: 200;
          display: flex; align-items: center; justify-content: center; padding: 24px;
          background: rgba(200, 195, 185, 0.25);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
        }
        .hidden-popup {
          position: relative; max-width: 420px; width: 100%; padding: 40px 48px;
          border-radius: 20px; text-align: center;
          background: rgba(245, 250, 247, 0.85);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
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

        /* ===== 移动端 ===== */
        @media (max-width: 640px) {
          .recharge-page { padding: 0 16px 80px; }
          .energy-capsule { padding: 10px 12px; gap: 8px; }
          .energy-icon { width: 24px; font-size: 14px; }
          .energy-text { font-size: 12px; }
          .energy-battery-body { width: 18px; height: 10px; }
          .station-cat-wrap { right: 5%; }
          .recharge-counter { bottom: 16px; right: 16px; padding: 8px 14px; }
          .hidden-popup { padding: 32px 28px; border-radius: 16px; }
          .hidden-title { font-size: 22px; letter-spacing: 0.08em; }
          .hidden-text { font-size: 14px; line-height: 1.8; }
          .hidden-close { top: 12px; right: 14px; font-size: 12px; }
        }
      `}</style>
    </div>
  );
};

export default RechargePage;
