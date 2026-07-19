/**
 * 回血清单 · 智能推荐标签数据 & 推荐引擎
 *
 * 每件小事附带情绪标签、能量等级、适用天气/心情/精力，
 * 推荐引擎根据用户当前状态 + 历史偏好 + 场景预设做加权筛选。
 */

/* ============================================================
   类型定义
   ============================================================ */

/** 情绪标签 — 每件小事可拥有多个 */
export type EnergyTag =
  | "boost"      // 提升能量
  | "calm"       // 平复情绪
  | "create"     // 创造治愈
  | "rest";      // 休息恢复

/** 天气类型 */
export type WeatherType = "sunny" | "rainy" | "cloudy" | "snowy";

/** 心情类型 */
export type MoodType = "happy" | "tired" | "anxious" | "low";

/** 精力等级 */
export type EnergyLevel = "high" | "medium" | "low";

/** 用户当前状态 */
export interface UserState {
  mood: MoodType;
  weather: WeatherType;
  energy: EnergyLevel;
}

/** 场景预设 */
export interface ScenePreset {
  id: string;
  label: string;
  icon: string;
  state: UserState;
  description: string;
}

/** 标注后的能量节点 */
export interface TaggedNode {
  id: number;
  text: string;
  icon: string;
  tags: EnergyTag[];
  /** 所需精力等级 */
  effort: EnergyLevel;
  /** 适用天气（空数组 = 任何天气都行） */
  weather: WeatherType[];
  /** 适用心情（空数组 = 任何心情都行） */
  moods: MoodType[];
  /** 场景关键词（用于个性化排序） */
  keywords: string[];
}

/** 推荐结果 */
export interface Recommendation {
  node: TaggedNode;
  score: number;       // 匹配分 0-100
  reason: string;      // 推荐理由
}

/* ============================================================
   天气/心情/精力/标签的中文映射 & 配色
   ============================================================ */

export const WEATHER_MAP: Record<WeatherType, { label: string; icon: string }> = {
  sunny:  { label: "晴天", icon: "☀" },
  rainy:  { label: "雨天", icon: "🌧" },
  cloudy: { label: "阴天", icon: "☁" },
  snowy:  { label: "雪天", icon: "❄" },
};

export const MOOD_MAP: Record<MoodType, { label: string; icon: string }> = {
  happy:   { label: "开心", icon: "☀" },
  tired:   { label: "疲惫", icon: "🌙" },
  anxious: { label: "焦虑", icon: "⚡" },
  low:     { label: "低落", icon: "🌧" },
};

export const ENERGY_MAP: Record<EnergyLevel, { label: string; bars: number; icon: string }> = {
  high:   { label: "充沛", bars: 3, icon: "⚡" },
  medium: { label: "中等", bars: 2, icon: "⚡" },
  low:    { label: "低落", bars: 1, icon: "⚡" },
};

export const TAG_MAP: Record<EnergyTag, { label: string; icon: string; color: string }> = {
  boost:  { label: "提升能量", icon: "🌞", color: "#e8a838" },
  calm:   { label: "平复情绪", icon: "🧘", color: "#6aaa8a" },
  create: { label: "创造治愈", icon: "🎨", color: "#b088c8" },
  rest:   { label: "休息恢复", icon: "🛋", color: "#8ab8d8" },
};

/* ============================================================
   场景预设
   ============================================================ */

export const SCENE_PRESETS: ScenePreset[] = [
  {
    id: "rainy",
    label: "雨天模式",
    icon: "🌧",
    state: { mood: "low", weather: "rainy", energy: "low" },
    description: "窝在家，听雨声，做些温暖的小事",
  },
  {
    id: "sunny",
    label: "晴天模式",
    icon: "☀",
    state: { mood: "happy", weather: "sunny", energy: "high" },
    description: "出去走走，感受阳光和新鲜空气",
  },
  {
    id: "monday",
    label: "周一模式",
    icon: "📅",
    state: { mood: "anxious", weather: "cloudy", energy: "medium" },
    description: "整理规划，为这一周积蓄力量",
  },
  {
    id: "night",
    label: "深夜模式",
    icon: "🌙",
    state: { mood: "tired", weather: "cloudy", energy: "low" },
    description: "安静地做一件柔软的小事",
  },
];

/* ============================================================
   100 件小事标签数据
   ============================================================ */

/**
 * 手工标注说明：
 * - tags: 核心情绪标签（1-3个）
 * - effort: 执行所需的精力等级
 * - weather: 适用天气（[] = 不限天气）
 * - moods: 最适合的心情的（[] = 不限心情）
 * - keywords: 用于个性化推荐的场景关键词
 */
export const TAGGED_NODES: TaggedNode[] = [
  // 1
  { id: 1, text: "去吃一顿自助小火锅：手机打开一部综艺，想吃多久就吃多久", icon: "🍢", tags: ["boost", "rest"], effort: "medium", weather: ["rainy", "cloudy"], moods: ["happy", "low"], keywords: ["美食", "火锅", "综艺"] },
  // 2
  { id: 2, text: "去书店沉浸式看一本喜欢的书：一口气看完一本感兴趣的书，和夕阳一起回家", icon: "📚", tags: ["calm", "rest"], effort: "low", weather: ["rainy", "cloudy", "sunny"], moods: ["happy", "tired"], keywords: ["阅读", "书店", "安静"] },
  // 3
  { id: 3, text: "写一张明信片给3年后的自己：把你的期待和烦恼都告诉长大的自己吧", icon: "✉️", tags: ["calm", "create"], effort: "low", weather: [], moods: ["anxious", "low"], keywords: ["写作", "明信片", "自我对话"] },
  // 4
  { id: 4, text: "随机选择陌生的街道散步30分钟：可以随机式citywalk，感觉很有趣呢", icon: "🚶", tags: ["boost", "calm"], effort: "medium", weather: ["sunny", "cloudy"], moods: ["happy", "tired"], keywords: ["散步", "户外", "探索"] },
  // 5
  { id: 5, text: "做小饼干或者小蛋糕：diy一个专属于你的小甜品～", icon: "🍪", tags: ["create", "boost"], effort: "medium", weather: ["rainy", "cloudy"], moods: ["happy", "low"], keywords: ["烘焙", "甜品", "手工"] },
  // 6
  { id: 6, text: "做一个手工，比如戒指、陶艺、手机壳：把自己的名字刻上去！", icon: "💍", tags: ["create", "calm"], effort: "medium", weather: ["rainy", "cloudy"], moods: ["anxious", "happy"], keywords: ["手工", "陶艺", "创造"] },
  // 7
  { id: 7, text: "去博物馆或者美术馆：陶冶一下身心，感受博物馆的美", icon: "🏛️", tags: ["calm", "boost"], effort: "medium", weather: ["sunny", "cloudy"], moods: ["happy", "tired"], keywords: ["博物馆", "美术", "文艺"] },
  // 8
  { id: 8, text: "去小吃街，把想吃的都吃一次：把没吃过的统统买下！", icon: "🍢", tags: ["boost", "rest"], effort: "high", weather: ["sunny", "cloudy"], moods: ["happy"], keywords: ["美食", "小吃", "逛街"] },
  // 9
  { id: 9, text: "逛超市、零食店：五花八门的小东西会让人很有幸福感", icon: "🛒", tags: ["boost", "rest"], effort: "low", weather: ["rainy", "cloudy", "sunny"], moods: ["happy", "low", "tired"], keywords: ["超市", "零食", "逛街"] },
  // 10
  { id: 10, text: "做个足疗：犒劳一下辛苦的自己吧", icon: "💆", tags: ["rest", "calm"], effort: "low", weather: [], moods: ["tired", "anxious"], keywords: ["足疗", "放松", "身体"] },
  // 11
  { id: 11, text: "带上美食去公园野餐感受阳光的沐浴，享受美味的食物", icon: "🧺", tags: ["boost", "rest"], effort: "medium", weather: ["sunny"], moods: ["happy"], keywords: ["野餐", "公园", "阳光"] },
  // 12
  { id: 12, text: "找家咖啡店写一篇随笔：戴上耳机进入自己的世界，写些最近的感受～", icon: "☕", tags: ["calm", "create"], effort: "low", weather: ["rainy", "cloudy"], moods: ["anxious", "tired", "low"], keywords: ["咖啡", "写作", "独处"] },
  // 13
  { id: 13, text: "给家人和朋友挑选小礼物：买些小巧可爱的东西送给朋友，她们一定很喜欢！", icon: "🎁", tags: ["boost", "create"], effort: "low", weather: ["sunny", "cloudy"], moods: ["happy"], keywords: ["礼物", "朋友", "分享"] },
  // 14
  { id: 14, text: "探一家有趣的小店：苍蝇馆子或者高分小店都很纠结呢", icon: "🏪", tags: ["boost"], effort: "medium", weather: ["sunny", "cloudy"], moods: ["happy", "tired"], keywords: ["探索", "美食", "小店"] },
  // 15
  { id: 15, text: "随机坐一辆公交车随机下车：看一看不一样的风景，探索城市中陌生的角落", icon: "🚌", tags: ["boost", "calm"], effort: "low", weather: ["sunny", "cloudy"], moods: ["happy", "tired"], keywords: ["公交", "探索", "城市"] },
  // 16
  { id: 16, text: "去湖边骑单车：戴上耳机，迎着晚风，很幸福哒", icon: "🚲", tags: ["boost"], effort: "high", weather: ["sunny"], moods: ["happy"], keywords: ["骑行", "户外", "湖边"] },
  // 17
  { id: 17, text: "去看一场音乐剧：新奇而提升品位的美妙体验", icon: "🎭", tags: ["boost", "create"], effort: "high", weather: ["rainy", "cloudy"], moods: ["happy"], keywords: ["音乐剧", "文艺", "表演"] },
  // 18
  { id: 18, text: "猫咖撸猫撸狗：平淡的生活需要可爱的猫猫狗狗治愈呀", icon: "🐱", tags: ["calm", "rest", "boost"], effort: "low", weather: ["rainy", "cloudy", "sunny"], moods: ["happy", "tired", "low"], keywords: ["猫咖", "宠物", "治愈"] },
  // 19
  { id: 19, text: "坐摩天轮：在最高处看城市的感觉很奇妙吧", icon: "🎡", tags: ["boost"], effort: "high", weather: ["sunny", "cloudy"], moods: ["happy"], keywords: ["摩天轮", "浪漫", "高处"] },
  // 20
  { id: 20, text: "找一个窗边，拍下过路的人们：形形色色的人，看看他们的状态有什么不同呢", icon: "📷", tags: ["calm", "create"], effort: "low", weather: ["sunny", "cloudy"], moods: ["happy", "tired"], keywords: ["摄影", "观察", "窗边"] },
  // 21
  { id: 21, text: "看一场电影：挑选一部最感兴趣的电影，说走就走！", icon: "🎬", tags: ["rest", "boost"], effort: "low", weather: ["rainy", "cloudy"], moods: ["happy", "tired", "anxious"], keywords: ["电影", "娱乐", "放松"] },
  // 22
  { id: 22, text: "做一个美甲：换个新的美甲换个心情", icon: "💅", tags: ["boost", "create"], effort: "low", weather: ["rainy", "cloudy"], moods: ["happy", "low"], keywords: ["美甲", "打扮", "心情"] },
  // 23
  { id: 23, text: "画一个新的妆容出门：尝试一个没试过的妆容，反正谁都不认识你！", icon: "💄", tags: ["boost", "create"], effort: "medium", weather: ["sunny", "cloudy"], moods: ["happy"], keywords: ["化妆", "打扮", "出门"] },
  // 24
  { id: 24, text: "一个人去游泳：泡在水里，好舒服！", icon: "🏊", tags: ["boost", "rest"], effort: "high", weather: ["sunny"], moods: ["happy", "tired"], keywords: ["游泳", "运动", "水"] },
  // 25
  { id: 25, text: "早起去爬山看日出：一个人感受日出的浪漫，带给自己希望", icon: "🌄", tags: ["boost"], effort: "high", weather: ["sunny"], moods: ["happy", "low"], keywords: ["爬山", "日出", "户外"] },
  // 26
  { id: 26, text: "拍一条vlog：记录多彩的一天", icon: "📹", tags: ["create", "boost"], effort: "medium", weather: ["sunny", "cloudy"], moods: ["happy"], keywords: ["vlog", "记录", "视频"] },
  // 27
  { id: 27, text: "拆一个盲盒：生活中很需要未知和惊喜，拆盲盒是一个很不错的选择！", icon: "📦", tags: ["boost"], effort: "low", weather: [], moods: ["happy", "low", "tired"], keywords: ["盲盒", "惊喜", "购物"] },
  // 28
  { id: 28, text: "去动物园喂小动物：让可爱的小动物给生活带来一些生机", icon: "🦒", tags: ["boost", "calm"], effort: "medium", weather: ["sunny", "cloudy"], moods: ["happy", "tired"], keywords: ["动物园", "动物", "治愈"] },
  // 29
  { id: 29, text: "去公园喂一次鸽子或流浪猫，感受生命带来的治愈瞬间", icon: "🐦", tags: ["calm", "boost"], effort: "low", weather: ["sunny", "cloudy"], moods: ["happy", "tired", "low"], keywords: ["公园", "动物", "治愈"] },
  // 30
  { id: 30, text: "画填色画：成就感和耐心 up up！", icon: "🎨", tags: ["calm", "create"], effort: "low", weather: ["rainy", "cloudy"], moods: ["anxious", "tired"], keywords: ["画画", "填色", "耐心"] },
  // 31
  { id: 31, text: "外放喜欢的歌曲：享受一下属于自己的时光", icon: "🎵", tags: ["boost", "rest"], effort: "low", weather: [], moods: ["happy", "tired", "low"], keywords: ["音乐", "放松", "独处"] },
  // 32
  { id: 32, text: "看一部纪录片：每周都可以看一部做一个积累", icon: "📹", tags: ["calm", "rest"], effort: "low", weather: ["rainy", "cloudy"], moods: ["happy", "tired"], keywords: ["纪录片", "学习", "安静"] },
  // 33
  { id: 33, text: "取消订阅邮件：烦心事通通都走开", icon: "📧", tags: ["calm"], effort: "low", weather: [], moods: ["anxious", "tired"], keywords: ["整理", "断舍离", "清净"] },
  // 34
  { id: 34, text: "列购物清单：买一些自己喜欢的东西", icon: "📝", tags: ["calm"], effort: "low", weather: [], moods: ["anxious", "happy"], keywords: ["清单", "购物", "规划"] },
  // 35
  { id: 35, text: "规划下周菜单：提前可以准备食材", icon: "🍽️", tags: ["calm", "create"], effort: "low", weather: [], moods: ["anxious", "happy"], keywords: ["规划", "菜单", "美食"] },
  // 36
  { id: 36, text: "制作水果沙拉：补充一下维生素", icon: "🥗", tags: ["create", "boost"], effort: "low", weather: [], moods: ["happy", "tired"], keywords: ["水果", "健康", "美食"] },
  // 37
  { id: 37, text: "换一床舒适四件套：整个人都会心情舒畅", icon: "🛏️", tags: ["rest", "boost"], effort: "low", weather: [], moods: ["tired", "low"], keywords: ["床品", "舒适", "家"] },
  // 38
  { id: 38, text: "用橡皮泥捏造型：休闲时间可以娱乐一下", icon: "🧸", tags: ["create", "calm"], effort: "low", weather: ["rainy", "cloudy"], moods: ["anxious", "tired"], keywords: ["手工", "橡皮泥", "创造"] },
  // 39
  { id: 39, text: "做眼保健操：每天都可以做的保护眼睛的", icon: "👁️", tags: ["rest", "calm"], effort: "low", weather: [], moods: ["tired"], keywords: ["眼睛", "健康", "休息"] },
  // 40
  { id: 40, text: "修一下眉毛：让轮廓更好看", icon: "✏️", tags: ["boost"], effort: "low", weather: [], moods: ["happy", "low"], keywords: ["打扮", "眉毛", "自己"] },
  // 41
  { id: 41, text: "清晨喝一杯温开水：利于肠道健康", icon: "💧", tags: ["rest", "boost"], effort: "low", weather: [], moods: ["tired", "low"], keywords: ["水", "健康", "早晨"] },
  // 42
  { id: 42, text: "上网逛喜欢的店铺：可以加购到购物车", icon: "🛍️", tags: ["rest", "boost"], effort: "low", weather: ["rainy", "cloudy"], moods: ["happy", "tired", "low"], keywords: ["网购", "浏览", "轻松"] },
  // 43
  { id: 43, text: "挑一套新衣服：下次出门的时候可以穿哦", icon: "👗", tags: ["boost", "create"], effort: "low", weather: ["sunny", "cloudy"], moods: ["happy"], keywords: ["穿搭", "衣服", "打扮"] },
  // 44
  { id: 44, text: "给宠物洗澡：可以有更多时间给自己", icon: "🛁", tags: ["calm", "rest"], effort: "medium", weather: [], moods: ["happy", "tired"], keywords: ["宠物", "洗澡", "治愈"] },
  // 45
  { id: 45, text: "打理一下阳台植物：让植物们更加赏心悦目", icon: "🪴", tags: ["calm", "rest"], effort: "low", weather: ["sunny", "cloudy"], moods: ["happy", "tired", "anxious"], keywords: ["植物", "阳台", "绿色"] },
  // 46
  { id: 46, text: "到书店翻翻杂志：悠闲时光来一个", icon: "📰", tags: ["calm", "rest"], effort: "low", weather: ["rainy", "cloudy"], moods: ["happy", "tired"], keywords: ["杂志", "书店", "悠闲"] },
  // 47
  { id: 47, text: "探索本地的美食街：可以吃到自己喜欢的小吃", icon: "🍜", tags: ["boost"], effort: "medium", weather: ["sunny", "cloudy"], moods: ["happy"], keywords: ["美食", "小吃", "探索"] },
  // 48
  { id: 48, text: "给自己做个小美容：比如敷个面膜", icon: "🧖", tags: ["rest", "calm"], effort: "low", weather: [], moods: ["tired", "low"], keywords: ["面膜", "美容", "自己"] },
  // 49
  { id: 49, text: "准备小袋干果当零食：边看剧边吃", icon: "🥜", tags: ["rest"], effort: "low", weather: [], moods: ["happy", "tired"], keywords: ["零食", "干果", "轻松"] },
  // 50
  { id: 50, text: "坐在雨天的窗边看书：听着雨声很惬意", icon: "🌧️", tags: ["calm", "rest"], effort: "low", weather: ["rainy"], moods: ["happy", "tired", "anxious", "low"], keywords: ["雨天", "窗边", "阅读"] },
  // 51
  { id: 51, text: "烤曲奇饼干送给朋友：提升幸福感", icon: "焙", tags: ["create", "boost"], effort: "medium", weather: ["rainy", "cloudy"], moods: ["happy"], keywords: ["烘焙", "饼干", "分享"] },
  // 52
  { id: 52, text: "学习新的摄影技巧：可以给自己拍照", icon: "📸", tags: ["create", "boost"], effort: "medium", weather: ["sunny", "cloudy"], moods: ["happy"], keywords: ["摄影", "学习", "技能"] },
  // 53
  { id: 53, text: "独自去海边散步：听听海浪的声音", icon: "🌊", tags: ["calm", "boost"], effort: "medium", weather: ["sunny", "cloudy"], moods: ["happy", "tired", "anxious", "low"], keywords: ["海边", "散步", "自然"] },
  // 54
  { id: 54, text: "为新的一周制定计划：做时间的主人", icon: "📅", tags: ["calm", "create"], effort: "low", weather: [], moods: ["anxious"], keywords: ["规划", "计划", "新一周"] },
  // 55
  { id: 55, text: "把旧衣物分类处理：断舍离", icon: "👕", tags: ["calm"], effort: "medium", weather: [], moods: ["anxious", "tired"], keywords: ["整理", "断舍离", "旧物"] },
  // 56
  { id: 56, text: "看看小视频学新菜：每周可以自己换换口味", icon: "🍳", tags: ["create", "boost"], effort: "medium", weather: [], moods: ["happy", "tired"], keywords: ["烹饪", "学习", "美食"] },
  // 57
  { id: 57, text: "享受阳光午后小憩：午休或者做喜欢的事", icon: "☀️", tags: ["rest"], effort: "low", weather: ["sunny"], moods: ["tired", "low", "happy"], keywords: ["午睡", "阳光", "休息"] },
  // 58
  { id: 58, text: "花时间思考未来目标：憧憬一下未来", icon: "🔮", tags: ["calm", "create"], effort: "low", weather: [], moods: ["anxious", "happy"], keywords: ["思考", "未来", "规划"] },
  // 59
  { id: 59, text: "尝试拼接一幅拼图：很有成就感", icon: "🧩", tags: ["calm", "create"], effort: "low", weather: ["rainy", "cloudy"], moods: ["anxious", "tired", "low"], keywords: ["拼图", "专注", "安静"] },
  // 60
  { id: 60, text: "拍摄一组静物摄影：提升自己的技术", icon: "📷", tags: ["create", "calm"], effort: "medium", weather: ["sunny", "cloudy"], moods: ["happy", "tired"], keywords: ["摄影", "静物", "创造"] },
  // 61
  { id: 61, text: "在有风的傍晚骑行：感受一下大自然的力量", icon: "🌬️", tags: ["boost"], effort: "high", weather: ["sunny", "cloudy"], moods: ["happy", "tired"], keywords: ["骑行", "户外", "傍晚"] },
  // 62
  { id: 62, text: "为家增添气氛元素：可以买一些小装饰", icon: "🏮", tags: ["create", "boost"], effort: "low", weather: ["rainy", "cloudy", "sunny"], moods: ["happy", "low"], keywords: ["装饰", "家", "氛围"] },
  // 63
  { id: 63, text: "DIY一件日常用品：日常生活中也可以用到的", icon: "🔨", tags: ["create"], effort: "medium", weather: ["rainy", "cloudy"], moods: ["happy", "anxious"], keywords: ["DIY", "手工", "创造"] },
  // 64
  { id: 64, text: "和小猫小狗说说话：培养感情", icon: "🐶", tags: ["calm", "rest"], effort: "low", weather: [], moods: ["happy", "tired", "low"], keywords: ["宠物", "对话", "治愈"] },
  // 65
  { id: 65, text: "随机坐公交车漫游：看看城市的街角", icon: "🚍", tags: ["boost", "calm"], effort: "low", weather: ["sunny", "cloudy"], moods: ["happy", "tired"], keywords: ["公交", "漫游", "城市"] },
  // 66
  { id: 66, text: "学习新的健身动作：提升自己的整体体态", icon: "💪", tags: ["boost"], effort: "high", weather: [], moods: ["happy"], keywords: ["健身", "运动", "力量"] },
  // 67
  { id: 67, text: "重新安排生活空间：合理布局房间结构", icon: "🪑", tags: ["calm", "create"], effort: "high", weather: [], moods: ["anxious", "tired"], keywords: ["整理", "空间", "家"] },
  // 68
  { id: 68, text: "尝试一个新的发型：从头开始", icon: "💇", tags: ["boost"], effort: "medium", weather: [], moods: ["happy", "low"], keywords: ["发型", "改变", "打扮"] },
  // 69
  { id: 69, text: "睡个长长的午觉：保持充足的睡眠", icon: "😴", tags: ["rest"], effort: "low", weather: [], moods: ["tired", "low"], keywords: ["睡觉", "午觉", "恢复"] },
  // 70
  { id: 70, text: "体验一次全身按摩：放松一下紧绷的状态", icon: "🤲", tags: ["rest", "calm"], effort: "low", weather: [], moods: ["tired", "anxious"], keywords: ["按摩", "放松", "身体"] },
  // 71
  { id: 71, text: "点平时舍不得的外卖：偶尔犒劳一下自己", icon: "外卖", tags: ["boost", "rest"], effort: "low", weather: [], moods: ["tired", "low", "happy"], keywords: ["外卖", "美食", "犒劳"] },
  // 72
  { id: 72, text: "进行一次自我反思：总结", icon: "🤔", tags: ["calm"], effort: "low", weather: [], moods: ["anxious", "tired"], keywords: ["反思", "总结", "自我"] },
  // 73
  { id: 73, text: "享用一顿丰盛晚餐：可以跟家人一起", icon: "晚餐", tags: ["boost", "rest"], effort: "low", weather: [], moods: ["happy", "tired"], keywords: ["晚餐", "美食", "家人"] },
  // 74
  { id: 74, text: "换个好看的壁纸：感觉像换了一个新手机", icon: "🖼️", tags: ["boost"], effort: "low", weather: [], moods: ["happy", "low"], keywords: ["壁纸", "手机", "新鲜感"] },
  // 75
  { id: 75, text: "泡个舒服的热水澡：解乏", icon: "🛁", tags: ["rest", "calm"], effort: "low", weather: ["rainy", "snowy", "cloudy"], moods: ["tired", "anxious", "low"], keywords: ["泡澡", "热水", "放松"] },
  // 76
  { id: 76, text: "去旧货市场淘小玩意儿：买点自己喜欢的", icon: "🏚️", tags: ["boost", "create"], effort: "medium", weather: ["sunny", "cloudy"], moods: ["happy"], keywords: ["旧货", "淘货", "探索"] },
  // 77
  { id: 77, text: "尝试做一杯手冲咖啡或特调饮品，享受香气在空气里弥漫的过程", icon: "☕", tags: ["calm", "create"], effort: "low", weather: ["rainy", "cloudy"], moods: ["happy", "tired", "anxious"], keywords: ["咖啡", "手冲", "香气"] },
  // 78
  { id: 78, text: "闻洗过衣服的香味：可以挑选自己喜欢的味道", icon: "🌸", tags: ["calm", "rest"], effort: "low", weather: ["sunny"], moods: ["happy", "tired", "low"], keywords: ["洗衣", "香味", "日常"] },
  // 79
  { id: 79, text: "品尝新口味的冰淇淋：吃到美食会很开心", icon: "🍦", tags: ["boost", "rest"], effort: "low", weather: ["sunny", "hot"], moods: ["happy", "low"], keywords: ["冰淇淋", "甜品", "美食"] },
  // 80
  { id: 80, text: "一个人去KTV唱歌：可以不用担心五音不全", icon: "🎤", tags: ["boost"], effort: "medium", weather: [], moods: ["happy", "anxious", "low"], keywords: ["唱歌", "KTV", "释放"] },
  // 81
  { id: 81, text: "去市场挑新鲜的蔬菜：烹饪一道新鲜的食物", icon: "🥬", tags: ["boost", "calm"], effort: "low", weather: ["sunny", "cloudy"], moods: ["happy", "tired"], keywords: ["菜市场", "蔬菜", "新鲜"] },
  // 82
  { id: 82, text: "和朋友打电话聊琐事：分享一下不错的最近", icon: "📞", tags: ["boost", "calm"], effort: "low", weather: [], moods: ["happy", "tired", "low"], keywords: ["朋友", "聊天", "分享"] },
  // 83
  { id: 83, text: "穿上喜欢的衣服拍照：80岁回忆录", icon: "📸", tags: ["boost", "create"], effort: "low", weather: ["sunny"], moods: ["happy"], keywords: ["拍照", "穿搭", "记录"] },
  // 84
  { id: 84, text: "退出无用的微信群聊：一片清闲", icon: "🚪", tags: ["calm"], effort: "low", weather: [], moods: ["anxious", "tired"], keywords: ["微信群", "整理", "清净"] },
  // 85
  { id: 85, text: "随意翻手机里的旧照片：回忆过去", icon: "📷", tags: ["calm", "rest"], effort: "low", weather: ["rainy", "cloudy"], moods: ["happy", "tired", "low"], keywords: ["照片", "回忆", "怀旧"] },
  // 86
  { id: 86, text: "边洗澡边听播客：非常不错的体验", icon: "🚿", tags: ["rest", "calm"], effort: "low", weather: [], moods: ["tired", "anxious"], keywords: ["洗澡", "播客", "放松"] },
  // 87
  { id: 87, text: "看一期搞笑综艺：治愈放松", icon: "😂", tags: ["rest", "boost"], effort: "low", weather: ["rainy", "cloudy"], moods: ["happy", "tired", "low"], keywords: ["综艺", "搞笑", "娱乐"] },
  // 88
  { id: 88, text: "玩一些简单的桌游：可以锻炼脑部", icon: "🎲", tags: ["create", "boost"], effort: "medium", weather: ["rainy", "cloudy"], moods: ["happy"], keywords: ["桌游", "游戏", "思考"] },
  // 89
  { id: 89, text: "擦干净房间里的窗户：房间整体整洁提升", icon: "🪟", tags: ["calm"], effort: "medium", weather: ["sunny", "cloudy"], moods: ["anxious", "tired"], keywords: ["清洁", "窗户", "家"] },
  // 90
  { id: 90, text: "坐在阳台上晒太阳：惬意", icon: "☀️", tags: ["rest", "boost"], effort: "low", weather: ["sunny"], moods: ["happy", "tired", "low"], keywords: ["阳台", "晒太阳", "惬意"] },
  // 91
  { id: 91, text: "看一部动画短片：可以吃着自己点的外卖", icon: "📺", tags: ["rest"], effort: "low", weather: ["rainy", "cloudy"], moods: ["happy", "tired"], keywords: ["动画", "短片", "放松"] },
  // 92
  { id: 92, text: "慢慢品尝一杯咖啡：享受片刻时光", icon: "☕", tags: ["calm", "rest"], effort: "low", weather: ["rainy", "cloudy", "sunny"], moods: ["happy", "tired", "anxious"], keywords: ["咖啡", "慢生活", "独处"] },
  // 93
  { id: 93, text: "抄写喜欢文案的句子", icon: "✍️", tags: ["calm", "create"], effort: "low", weather: ["rainy", "cloudy"], moods: ["anxious", "tired", "low"], keywords: ["抄写", "文字", "安静"] },
  // 94
  { id: 94, text: "整理书架上的书籍", icon: "📚", tags: ["calm"], effort: "medium", weather: [], moods: ["anxious", "tired"], keywords: ["整理", "书籍", "书架"] },
  // 95
  { id: 95, text: "思考规划下一个月", icon: "🗓️", tags: ["calm", "create"], effort: "low", weather: [], moods: ["anxious", "happy"], keywords: ["规划", "月计划", "目标"] },
  // 96
  { id: 96, text: "打开窗户呼吸新鲜空气", icon: "🪟", tags: ["calm", "rest", "boost"], effort: "low", weather: ["sunny", "cloudy"], moods: ["tired", "anxious"], keywords: ["新鲜空气", "窗户", "自然"] },
  // 97
  { id: 97, text: "学习一首爱听的新歌", icon: "🎶", tags: ["boost", "create"], effort: "low", weather: [], moods: ["happy", "tired"], keywords: ["音乐", "新歌", "学习"] },
  // 98
  { id: 98, text: "做一次美甲", icon: "💅", tags: ["boost"], effort: "low", weather: [], moods: ["happy", "low"], keywords: ["美甲", "打扮", "自己"] },
  // 99
  { id: 99, text: "买一张彩票", icon: "🎰", tags: ["boost"], effort: "low", weather: ["sunny", "cloudy"], moods: ["happy"], keywords: ["彩票", "惊喜", "运气"] },
  // 100
  { id: 100, text: "躺在草地上或公园长椅上，单纯地发呆、看云，彻底放空大脑", icon: "☁️", tags: ["calm", "rest"], effort: "low", weather: ["sunny", "cloudy"], moods: ["tired", "anxious", "low", "happy"], keywords: ["发呆", "草地", "放空"] },
];

/* ============================================================
   推荐引擎
   ============================================================ */

/** 精力等级的数值映射 */
const EFFORT_SCORE: Record<EnergyLevel, number> = { high: 3, medium: 2, low: 1 };

/** 心情 → 推荐标签偏好权重 */
const MOOD_TAG_WEIGHTS: Record<MoodType, Record<EnergyTag, number>> = {
  happy:   { boost: 3, create: 2, calm: 1, rest: 1 },
  tired:   { rest: 4, calm: 3, boost: 1, create: 1 },
  anxious: { calm: 4, rest: 2, create: 2, boost: 0 },
  low:     { boost: 3, rest: 3, calm: 2, create: 1 },
};

/**
 * 推荐算法 — 加权评分
 *
 * 评分维度：
 * 1. 情绪标签匹配（40分）— 心情偏好 × 标签命中
 * 2. 精力匹配（25分）— 用户精力 >= 任务所需精力时满分
 * 3. 天气匹配（20分）— 适用天气包含当前天气
 * 4. 心情匹配（15分）— 适用心情包含当前心情
 * 5. 个性化加成（0-10分）— 历史偏好关键词命中
 */
export function getRecommendations(
  state: UserState,
  doneIds: Set<number>,
  historyKeywords: string[] = [],
  count: number = 5,
): Recommendation[] {
  const moodWeights = MOOD_TAG_WEIGHTS[state.mood];
  const userEffort = EFFORT_SCORE[state.energy];

  const scored = TAGGED_NODES
    .filter((node) => !doneIds.has(node.id))
    .map((node) => {
      let score = 0;
      const reasons: string[] = [];

      // 1) 情绪标签匹配 (0-40)
      let tagScore = 0;
      for (const tag of node.tags) {
        tagScore += moodWeights[tag] || 0;
      }
      const maxTagScore = Math.max(1, node.tags.reduce((s, t) => s + (moodWeights[t] || 0), 0));
      const tagNormalized = (tagScore / maxTagScore) * 40;
      score += tagNormalized;
      if (tagNormalized >= 30) {
        const bestTag = node.tags.reduce((a, b) => (moodWeights[a] >= moodWeights[b] ? a : b));
        reasons.push(TAG_MAP[bestTag].label + "匹配");
      }

      // 2) 精力匹配 (0-25)
      const nodeEffort = EFFORT_SCORE[node.effort];
      if (userEffort >= nodeEffort) {
        score += 25;
      } else if (userEffort === nodeEffort - 1) {
        score += 12;
        reasons.push("稍微需要一点力气");
      }
      // 精力不足的不加此维度分

      // 3) 天气匹配 (0-20)
      if (node.weather.length === 0 || node.weather.includes(state.weather)) {
        score += 20;
      }

      // 4) 心情匹配 (0-15)
      if (node.moods.length === 0 || node.moods.includes(state.mood)) {
        score += 15;
        if (node.moods.length > 0) {
          reasons.push("很适合现在的心情");
        }
      }

      // 5) 个性化加成 (0-10)
      if (historyKeywords.length > 0) {
        const hitCount = node.keywords.filter((k) => historyKeywords.includes(k)).length;
        score += Math.min(hitCount * 3, 10);
        if (hitCount > 0) {
          reasons.push("你可能会喜欢");
        }
      }

      // 随机扰动 ±3 分，避免每次结果完全一样
      score += (Math.random() - 0.5) * 6;

      const primaryReason = reasons.length > 0
        ? reasons[0]
        : "适合现在做的小事";

      return { node, score: Math.round(Math.max(0, Math.min(100, score))), reason: primaryReason };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, count);
}

/* ============================================================
   持久化工具
   ============================================================ */

const HISTORY_KEY = "recharge_history";
const STATE_KEY = "recharge_user_state";

/** 历史完成记录 */
export interface CompletionRecord {
  id: number;
  keywords: string[];
  tags: EnergyTag[];
  timestamp: number;
}

/** 加载历史记录 */
export function loadHistory(): CompletionRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** 保存一条完成记录 */
export function saveCompletion(id: number): CompletionRecord | null {
  const node = TAGGED_NODES.find((n) => n.id === id);
  if (!node) return null;
  const record: CompletionRecord = {
    id,
    keywords: node.keywords,
    tags: node.tags,
    timestamp: Date.now(),
  };
  const history = loadHistory();
  history.push(record);
  // 只保留最近 200 条
  if (history.length > 200) history.splice(0, history.length - 200);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // noop
  }
  return record;
}

/** 提取历史偏好关键词（高频关键词） */
export function extractPreferenceKeywords(history: CompletionRecord[]): string[] {
  const freq = new Map<string, number>();
  for (const r of history) {
    for (const kw of r.keywords) {
      freq.set(kw, (freq.get(kw) || 0) + 1);
    }
  }
  // 取出现 >= 2 次的关键词
  return [...freq.entries()]
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([kw]) => kw);
}

/** 加载上次用户状态 */
export function loadUserState(): UserState | null {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** 保存用户状态 */
export function saveUserState(state: UserState): void {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    // noop
  }
}

/** 计算今日完成数 */
export function getTodayCount(): number {
  const history = loadHistory();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return history.filter((r) => r.timestamp >= todayStart.getTime()).length;
}

/** 计算连续天数 */
export function getStreakDays(): number {
  const history = loadHistory();
  if (history.length === 0) return 0;

  // 获取所有有记录的日期集合
  const days = new Set<string>();
  for (const r of history) {
    const d = new Date(r.timestamp);
    days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  }

  let streak = 0;
  const now = new Date();
  // 从今天开始往前数
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (days.has(key)) {
      streak++;
    } else {
      // 如果今天还没做，不中断连续（从昨天开始算）
      if (i === 0) continue;
      break;
    }
  }
  return streak;
}

/* ============================================================
   徽章系统
   ============================================================ */

export interface Badge {
  id: string;
  label: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export function getBadges(history: CompletionRecord[], streak: number, todayCount: number): Badge[] {
  const totalCount = history.length;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayItems = history.filter((r) => r.timestamp >= todayStart.getTime());
  const todayTags = new Set(todayItems.flatMap((r) => r.tags));

  return [
    {
      id: "first",
      label: "初回血",
      icon: "🌱",
      description: "完成第一件回血小事",
      unlocked: totalCount >= 1,
    },
    {
      id: "ten",
      label: "元气小太阳",
      icon: "☀",
      description: "累计完成10件小事",
      unlocked: totalCount >= 10,
    },
    {
      id: "fifty",
      label: "能量大师",
      icon: "⚡",
      description: "累计完成50件小事",
      unlocked: totalCount >= 50,
    },
    {
      id: "streak3",
      label: "三日不辍",
      icon: "🔥",
      description: "连续3天完成小事",
      unlocked: streak >= 3,
    },
    {
      id: "streak7",
      label: "七日之约",
      icon: "🌟",
      description: "连续7天完成小事",
      unlocked: streak >= 7,
    },
    {
      id: "five_today",
      label: "今日五连",
      icon: "💎",
      description: "一天完成5件小事",
      unlocked: todayCount >= 5,
    },
    {
      id: "balanced",
      label: "四维平衡",
      icon: "🌈",
      description: "一天内完成4种不同类型的小事",
      unlocked: todayTags.size >= 4,
    },
  ];
}
