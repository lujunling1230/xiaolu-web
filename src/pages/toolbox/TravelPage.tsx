import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * 漫游指南 · Travel Log
 *
 * 旅行足迹与攻略展示 —— 有温度的旅行记录。
 * 胶片 Hero + 简化中国地图（省份区块）+ 城市卡片横向滚动 + 详情 Modal。
 * 支持城市卡片的增删改，数据持久化到 localStorage。
 */

/* ============================================================
   数据类型
   ============================================================ */
interface Spot {
  name: string;
  rating: number;
}
interface Eat {
  name: string;
  price: string;
  signature?: string;
}
interface City {
  id: number;
  name: string;
  province: string;
  slogan: string;
  imageUrl: string;
  days: number;
  play: Spot[];
  eat: Eat[];
  stay: string;
  tips: string;
}

/* ============================================================
   默认城市数据（首次访问时写入 localStorage）
   ============================================================ */
const STORAGE_KEY = "travel_cities";

const DEFAULT_CITIES: City[] = [
  {
    id: 1,
    name: "大理",
    province: "云南",
    slogan: "风花雪月的慢生活",
    imageUrl:
      "https://images.unsplash.com/photo-1531219573917-2ca59e96bc0e?w=800&h=600&fit=crop",
    days: 5,
    play: [
      { name: "洱海骑行", rating: 5 },
      { name: "苍山索道", rating: 4 },
      { name: "喜洲古镇", rating: 4 },
    ],
    eat: [
      { name: "石锅鱼", price: "¥120/人", signature: "洱海弓鱼" },
      { name: "烤乳扇", price: "¥10/份" },
    ],
    stay: "古城里的白族小院，推窗见苍山。",
    tips: "环洱海建议租电动车，防晒很重要。古城晚上很热闹，但清晨最安静。",
  },
  {
    id: 2,
    name: "成都",
    province: "四川",
    slogan: "一座来了就不想走的城",
    imageUrl:
      "https://images.unsplash.com/photo-1593696954577-ab3d39317b97?w=800&h=600&fit=crop",
    days: 4,
    play: [
      { name: "大熊猫繁育基地", rating: 5 },
      { name: "宽窄巷子", rating: 4 },
      { name: "杜甫草堂", rating: 4 },
    ],
    eat: [
      { name: "小龙坎火锅", price: "¥90/人", signature: "牛油锅底" },
      { name: "陈麻婆豆腐", price: "¥40/人" },
    ],
    stay: "春熙路附近，交通方便，夜宵下楼就有。",
    tips: "熊猫基地一定要早去！8点前到能看到活跃的熊猫。茶馆发呆是必修课。",
  },
  {
    id: 3,
    name: "苏州",
    province: "江苏",
    slogan: "小桥流水人家的江南梦",
    imageUrl:
      "https://images.unsplash.com/photo-1599779019475-d5c9e7c2c1f0?w=800&h=600&fit=crop",
    days: 3,
    play: [
      { name: "拙政园", rating: 5 },
      { name: "平江路", rating: 4 },
      { name: "虎丘", rating: 4 },
    ],
    eat: [
      { name: "松鹤楼", price: "¥150/人", signature: "松鼠桂鱼" },
      { name: "哑巴生煎", price: "¥25/人" },
    ],
    stay: "平江路民宿，推门就是水巷。",
    tips: "园林建议错峰，工作日早晨人最少。评弹博物馆值得去，免费且安静。",
  },
  {
    id: 4,
    name: "厦门",
    province: "福建",
    slogan: "海风里藏着文艺的味道",
    imageUrl:
      "https://images.unsplash.com/photo-1528219089975-1c5b2c2c3c1f?w=800&h=600&fit=crop",
    days: 4,
    play: [
      { name: "鼓浪屿", rating: 5 },
      { name: "曾厝垵", rating: 4 },
      { name: "环岛路骑行", rating: 5 },
    ],
    eat: [
      { name: "沙茶面", price: "¥25/人" },
      { name: "海蛎煎", price: "¥30/人" },
    ],
    stay: "曾厝垵的文艺客栈，离海步行 5 分钟。",
    tips: "鼓浪屿船票提前买！岛上没有车，穿好走的鞋。日落去日光岩。",
  },
  {
    id: 5,
    name: "西安",
    province: "陕西",
    slogan: "一眼千年，长安如故",
    imageUrl:
      "https://images.unsplash.com/photo-1591851658485-c5f6c6b7e0e8?w=800&h=600&fit=crop",
    days: 5,
    play: [
      { name: "秦始皇兵马俑", rating: 5 },
      { name: "大唐不夜城", rating: 5 },
      { name: "城墙骑行", rating: 4 },
    ],
    eat: [
      { name: "回民街老孙家", price: "¥60/人", signature: "羊肉泡馍" },
      { name: "肉夹馍", price: "¥12/个" },
    ],
    stay: "钟楼附近，夜景绝美，去哪都方便。",
    tips: "兵马俑请讲解员！不然就是看泥人。城墙骑行选傍晚，不晒还凉快。",
  },
  {
    id: 6,
    name: "杭州",
    province: "浙江",
    slogan: "山寺月中寻桂子",
    imageUrl:
      "https://images.unsplash.com/photo-1591868050309-7d2b1e2f6c1a?w=800&h=600&fit=crop",
    days: 4,
    play: [
      { name: "西湖泛舟", rating: 5 },
      { name: "灵隐寺", rating: 5 },
      { name: "龙井村采茶", rating: 4 },
    ],
    eat: [
      { name: "楼外楼", price: "¥200/人", signature: "西湖醋鱼" },
      { name: "知味观小笼", price: "¥35/人" },
    ],
    stay: "西湖边民宿，清晨湖边散步没人打扰。",
    tips: "西湖别只逛断桥！苏堤人少景美。秋天满陇桂雨的香气会记住一辈子。",
  },
];

function loadCities(): City[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [...DEFAULT_CITIES];
}

function saveCities(list: City[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

/* ============================================================
   城市 → 省份映射字典（34 个省级行政区全覆盖）
   ============================================================ */
const cityToProvince: Record<string, string> = {
  /* 直辖市 */
  "北京": "北京", "北京市": "北京",
  "天津": "天津", "天津市": "天津",
  "上海": "上海", "上海市": "上海",
  "重庆": "重庆", "重庆市": "重庆",
  /* 河北 */
  "石家庄": "河北", "唐山": "河北", "秦皇岛": "河北", "邯郸": "河北", "邢台": "河北",
  "保定": "河北", "张家口": "河北", "承德": "河北", "沧州": "河北", "廊坊": "河北", "衡水": "河北",
  /* 山西 */
  "太原": "山西", "大同": "山西", "阳泉": "山西", "长治": "山西", "晋城": "山西",
  "朔州": "山西", "晋中": "山西", "运城": "山西", "忻州": "山西", "临汾": "山西", "吕梁": "山西",
  /* 内蒙古 */
  "呼和浩特": "内蒙古", "包头": "内蒙古", "乌海": "内蒙古", "赤峰": "内蒙古", "通辽": "内蒙古",
  "鄂尔多斯": "内蒙古", "呼伦贝尔": "内蒙古", "巴彦淖尔": "内蒙古", "乌兰察布": "内蒙古",
  "兴安盟": "内蒙古", "锡林郭勒盟": "内蒙古", "阿拉善盟": "内蒙古",
  /* 辽宁 */
  "沈阳": "辽宁", "大连": "辽宁", "鞍山": "辽宁", "抚顺": "辽宁", "本溪": "辽宁",
  "丹东": "辽宁", "锦州": "辽宁", "营口": "辽宁", "阜新": "辽宁", "辽阳": "辽宁",
  "盘锦": "辽宁", "铁岭": "辽宁", "朝阳": "辽宁", "葫芦岛": "辽宁",
  /* 吉林 */
  "长春": "吉林", "吉林": "吉林", "四平": "吉林", "辽源": "吉林", "通化": "吉林",
  "白山": "吉林", "松原": "吉林", "白城": "吉林", "延边": "吉林", "延边朝鲜族自治州": "吉林",
  /* 黑龙江 */
  "哈尔滨": "黑龙江", "齐齐哈尔": "黑龙江", "鸡西": "黑龙江", "鹤岗": "黑龙江", "双鸭山": "黑龙江",
  "大庆": "黑龙江", "伊春": "黑龙江", "佳木斯": "黑龙江", "七台河": "黑龙江", "牡丹江": "黑龙江",
  "黑河": "黑龙江", "绥化": "黑龙江", "大兴安岭": "黑龙江", "大兴安岭地区": "黑龙江",
  /* 江苏 */
  "南京": "江苏", "无锡": "江苏", "徐州": "江苏", "常州": "江苏", "苏州": "江苏",
  "南通": "江苏", "连云港": "江苏", "淮安": "江苏", "盐城": "江苏", "扬州": "江苏",
  "镇江": "江苏", "泰州": "江苏", "宿迁": "江苏",
  /* 浙江 */
  "杭州": "浙江", "宁波": "浙江", "温州": "浙江", "嘉兴": "浙江", "湖州": "浙江",
  "绍兴": "浙江", "金华": "浙江", "衢州": "浙江", "舟山": "浙江", "台州": "浙江", "丽水": "浙江",
  /* 安徽 */
  "合肥": "安徽", "芜湖": "安徽", "蚌埠": "安徽", "淮南": "安徽", "马鞍山": "安徽",
  "淮北": "安徽", "铜陵": "安徽", "安庆": "安徽", "黄山": "安徽", "滁州": "安徽",
  "阜阳": "安徽", "宿州": "安徽", "六安": "安徽", "亳州": "安徽", "池州": "安徽", "宣城": "安徽",
  /* 福建 */
  "福州": "福建", "厦门": "福建", "莆田": "福建", "三明": "福建", "泉州": "福建",
  "漳州": "福建", "南平": "福建", "龙岩": "福建", "宁德": "福建",
  /* 江西 */
  "南昌": "江西", "景德镇": "江西", "萍乡": "江西", "九江": "江西", "新余": "江西",
  "鹰潭": "江西", "赣州": "江西", "吉安": "江西", "宜春": "江西", "抚州": "江西", "上饶": "江西",
  /* 山东 */
  "济南": "山东", "青岛": "山东", "淄博": "山东", "枣庄": "山东", "东营": "山东",
  "烟台": "山东", "潍坊": "山东", "济宁": "山东", "泰安": "山东", "威海": "山东",
  "日照": "山东", "莱芜": "山东", "临沂": "山东", "德州": "山东", "聊城": "山东",
  "滨州": "山东", "菏泽": "山东",
  /* 河南 */
  "郑州": "河南", "开封": "河南", "洛阳": "河南", "平顶山": "河南", "安阳": "河南",
  "鹤壁": "河南", "新乡": "河南", "焦作": "河南", "濮阳": "河南", "许昌": "河南",
  "漯河": "河南", "三门峡": "河南", "南阳": "河南", "商丘": "河南", "信阳": "河南",
  "周口": "河南", "驻马店": "河南", "济源": "河南",
  /* 湖北 */
  "武汉": "湖北", "黄石": "湖北", "十堰": "湖北", "宜昌": "湖北", "襄阳": "湖北",
  "鄂州": "湖北", "荆门": "湖北", "孝感": "湖北", "荆州": "湖北", "黄冈": "湖北",
  "咸宁": "湖北", "随州": "湖北", "恩施": "湖北", "恩施土家族苗族自治州": "湖北",
  "仙桃": "湖北", "潜江": "湖北", "天门": "湖北", "神农架": "湖北", "神农架林区": "湖北",
  /* 湖南 */
  "长沙": "湖南", "株洲": "湖南", "湘潭": "湖南", "衡阳": "湖南", "邵阳": "湖南",
  "岳阳": "湖南", "常德": "湖南", "张家界": "湖南", "益阳": "湖南", "郴州": "湖南",
  "永州": "湖南", "怀化": "湖南", "娄底": "湖南", "湘西": "湖南", "湘西土家族苗族自治州": "湖南",
  /* 广东 */
  "广州": "广东", "韶关": "广东", "深圳": "广东", "珠海": "广东", "汕头": "广东",
  "佛山": "广东", "湛江": "广东", "肇庆": "广东", "江门": "广东", "茂名": "广东",
  "惠州": "广东", "梅州": "广东", "汕尾": "广东", "河源": "广东", "阳江": "广东",
  "清远": "广东", "东莞": "广东", "中山": "广东", "潮州": "广东", "揭阳": "广东", "云浮": "广东",
  /* 广西 */
  "南宁": "广西", "柳州": "广西", "桂林": "广西", "梧州": "广西", "北海": "广西",
  "防城港": "广西", "钦州": "广西", "贵港": "广西", "玉林": "广西", "百色": "广西",
  "贺州": "广西", "河池": "广西", "来宾": "广西", "崇左": "广西",
  /* 海南 */
  "海口": "海南", "三亚": "海南", "三沙": "海南", "儋州": "海南", "五指山": "海南",
  "琼海": "海南", "文昌": "海南", "万宁": "海南", "东方": "海南", "定安": "海南",
  "屯昌": "海南", "澄迈": "海南", "临高": "海南", "白沙": "海南", "白沙黎族自治县": "海南",
  "昌江": "海南", "昌江黎族自治县": "海南", "乐东": "海南", "乐东黎族自治县": "海南",
  "陵水": "海南", "陵水黎族自治县": "海南", "保亭": "海南", "保亭黎族苗族自治县": "海南",
  "琼中": "海南", "琼中黎族苗族自治县": "海南",
  /* 四川 */
  "成都": "四川", "自贡": "四川", "攀枝花": "四川", "泸州": "四川", "德阳": "四川",
  "绵阳": "四川", "广元": "四川", "遂宁": "四川", "内江": "四川", "乐山": "四川",
  "南充": "四川", "眉山": "四川", "宜宾": "四川", "广安": "四川", "达州": "四川",
  "雅安": "四川", "巴中": "四川", "资阳": "四川", "阿坝": "四川", "阿坝藏族羌族自治州": "四川",
  "甘孜": "四川", "甘孜藏族自治州": "四川", "凉山": "四川", "凉山彝族自治州": "四川",
  /* 贵州 */
  "贵阳": "贵州", "六盘水": "贵州", "遵义": "贵州", "安顺": "贵州", "毕节": "贵州",
  "铜仁": "贵州", "黔西南": "贵州", "黔西南布依族苗族自治州": "贵州",
  "黔东南": "贵州", "黔东南苗族侗族自治州": "贵州",
  "黔南": "贵州", "黔南布依族苗族自治州": "贵州",
  /* 云南 */
  "昆明": "云南", "曲靖": "云南", "玉溪": "云南", "保山": "云南", "昭通": "云南",
  "丽江": "云南", "普洱": "云南", "临沧": "云南", "楚雄": "云南", "楚雄彝族自治州": "云南",
  "红河": "云南", "红河哈尼族彝族自治州": "云南", "文山": "云南", "文山壮族苗族自治州": "云南",
  "西双版纳": "云南", "西双版纳傣族自治州": "云南", "大理": "云南", "大理白族自治州": "云南",
  "德宏": "云南", "德宏傣族景颇族自治州": "云南", "怒江": "云南", "怒江傈僳族自治州": "云南",
  "迪庆": "云南", "迪庆藏族自治州": "云南",
  /* 西藏 */
  "拉萨": "西藏", "日喀则": "西藏", "昌都": "西藏", "林芝": "西藏", "山南": "西藏",
  "那曲": "西藏", "阿里": "西藏",
  /* 陕西 */
  "西安": "陕西", "铜川": "陕西", "宝鸡": "陕西", "咸阳": "陕西", "渭南": "陕西",
  "延安": "陕西", "汉中": "陕西", "榆林": "陕西", "安康": "陕西", "商洛": "陕西",
  /* 甘肃 */
  "兰州": "甘肃", "嘉峪关": "甘肃", "金昌": "甘肃", "白银": "甘肃", "天水": "甘肃",
  "武威": "甘肃", "张掖": "甘肃", "平凉": "甘肃", "酒泉": "甘肃", "庆阳": "甘肃",
  "定西": "甘肃", "陇南": "甘肃", "临夏": "甘肃", "临夏回族自治州": "甘肃",
  "甘南": "甘肃", "甘南藏族自治州": "甘肃",
  /* 青海 */
  "西宁": "青海", "海东": "青海", "海北": "青海", "海北藏族自治州": "青海",
  "黄南": "青海", "黄南藏族自治州": "青海", "海南州": "青海", "海南藏族自治州": "青海",
  "果洛": "青海", "果洛藏族自治州": "青海", "玉树": "青海", "玉树藏族自治州": "青海",
  "海西": "青海", "海西蒙古族藏族自治州": "青海",
  /* 宁夏 */
  "银川": "宁夏", "石嘴山": "宁夏", "吴忠": "宁夏", "固原": "宁夏", "中卫": "宁夏",
  /* 新疆 */
  "乌鲁木齐": "新疆", "克拉玛依": "新疆", "吐鲁番": "新疆", "哈密": "新疆",
  "昌吉": "新疆", "昌吉回族自治州": "新疆", "博尔塔拉": "新疆", "博尔塔拉蒙古自治州": "新疆",
  "巴音郭楞": "新疆", "巴音郭楞蒙古自治州": "新疆", "阿克苏": "新疆", "克孜勒苏": "新疆",
  "克孜勒苏柯尔克孜自治州": "新疆", "喀什": "新疆", "和田": "新疆", "伊犁": "新疆",
  "伊犁哈萨克自治州": "新疆", "塔城": "新疆", "阿勒泰": "新疆",
  "石河子": "新疆", "阿拉尔": "新疆", "图木舒克": "新疆", "五家渠": "新疆",
  "北屯": "新疆", "铁门关": "新疆", "双河": "新疆", "可克达拉": "新疆",
  "昆玉": "新疆", "胡杨河": "新疆",
  /* 台湾 */
  "台北": "台湾", "新北": "台湾", "桃园": "台湾", "台中": "台湾", "台南": "台湾",
  "高雄": "台湾", "基隆": "台湾", "新竹市": "台湾", "新竹县": "台湾", "嘉义市": "台湾",
  "嘉义县": "台湾", "宜兰": "台湾", "苗栗": "台湾", "彰化": "台湾", "南投": "台湾",
  "云林": "台湾", "屏东": "台湾", "台东": "台湾", "花莲": "台湾", "澎湖": "台湾",
  /* 香港 */
  "香港": "香港",
  /* 澳门 */
  "澳门": "澳门",
};

function getProvinceByCity(cityName: string): string | null {
  return cityToProvince[cityName] || null;
}

/* ============================================================
   交互式中国地图（基于手绘水彩背景 + SVG 多边形点击区域）
   ============================================================ */
interface ProvinceArea {
  name: string;
  /** SVG 多边形路径坐标 */
  path: string;
  /** 是否去过（根据有记录的城市判断） */
  visited: boolean;
  /** 去过的城市数量 */
  count: number;
}

// 基于水彩中国地图实际位置手动提取的省份轮廓区域
const PROVINCE_PATHS: Omit<ProvinceArea, "visited" | "count">[] = [
  /* ---- 东北 ---- */
  { name: "黑龙江", path: "M 300 10 L 340 5 L 395 12 L 400 50 L 380 60 L 350 58 L 330 48 L 315 35 Z" },
  { name: "吉林",   path: "M 305 52 L 345 55 L 355 80 L 340 95 L 310 90 L 302 75 Z" },
  { name: "辽宁",   path: "M 295 88 L 335 90 L 348 118 L 325 130 L 290 120 L 285 105 Z" },

  /* ---- 华北 ---- */
  { name: "内蒙古", path: "M 178 22 L 230 18 L 290 22 L 315 28 L 320 55 L 312 78 L 290 82 L 250 78 L 220 75 L 190 72 L 172 60 L 168 40 Z" },
  { name: "北京",   path: "M 262 72 L 278 74 L 280 84 L 264 86 Z" },
  { name: "天津",   path: "M 280 80 L 292 82 L 294 92 L 282 90 Z" },
  { name: "河北",   path: "M 248 85 L 278 88 L 295 92 L 298 118 L 288 125 L 260 122 L 248 115 L 242 98 Z" },
  { name: "山西",   path: "M 220 90 L 245 92 L 252 118 L 245 132 L 222 128 L 215 110 Z" },
  { name: "山东",   path: "M 280 100 L 312 102 L 328 110 L 325 135 L 300 142 L 282 138 L 278 120 Z" },

  /* ---- 西北 ---- */
  { name: "新疆",   path: "M 32 28 L 80 20 L 132 32 L 138 55 L 130 88 L 115 95 L 80 92 L 50 88 L 28 80 L 22 55 Z" },
  { name: "甘肃",   path: "M 125 68 L 170 72 L 175 95 L 168 118 L 148 125 L 128 120 L 118 100 L 120 82 Z" },
  { name: "青海",   path: "M 100 115 L 148 122 L 152 145 L 145 165 L 115 162 L 95 152 L 92 132 Z" },
  { name: "宁夏",   path: "M 162 100 L 185 102 L 188 122 L 170 125 L 158 118 Z" },
  { name: "陕西",   path: "M 188 100 L 228 102 L 232 130 L 225 148 L 200 145 L 188 135 L 182 118 Z" },

  /* ---- 西南 ---- */
  { name: "西藏",   path: "M 28 145 L 70 140 L 110 148 L 118 170 L 115 210 L 108 230 L 78 235 L 42 228 L 25 215 L 20 180 Z" },
  { name: "四川",   path: "M 138 142 L 195 148 L 202 175 L 200 205 L 185 212 L 155 208 L 140 198 L 132 172 Z" },
  { name: "重庆",   path: "M 198 168 L 215 170 L 218 188 L 208 195 L 195 190 L 192 178 Z" },
  { name: "云南",   path: "M 118 200 L 165 205 L 172 228 L 170 255 L 155 262 L 128 258 L 115 240 L 112 218 Z" },
  { name: "贵州",   path: "M 172 195 L 208 198 L 212 220 L 205 235 L 180 232 L 168 222 L 168 208 Z" },

  /* ---- 华中 ---- */
  { name: "河南",   path: "M 218 118 L 258 120 L 262 142 L 255 158 L 228 155 L 218 145 L 215 130 Z" },
  { name: "湖北",   path: "M 215 152 L 258 155 L 260 175 L 255 192 L 230 190 L 215 182 L 212 165 Z" },
  { name: "湖南",   path: "M 212 188 L 255 190 L 258 215 L 252 228 L 225 225 L 210 218 L 208 200 Z" },
  { name: "江西",   path: "M 248 182 L 288 185 L 290 210 L 282 228 L 258 225 L 248 215 L 245 198 Z" },

  /* ---- 华东 ---- */
  { name: "江苏",   path: "M 268 132 L 308 135 L 312 158 L 305 172 L 285 170 L 270 165 L 265 150 Z" },
  { name: "安徽",   path: "M 242 138 L 268 140 L 272 162 L 268 178 L 248 175 L 240 165 L 238 150 Z" },
  { name: "浙江",   path: "M 268 170 L 310 172 L 312 192 L 305 208 L 282 205 L 268 198 L 265 182 Z" },
  { name: "上海",   path: "M 298 162 L 312 164 L 314 176 L 300 178 Z" },
  { name: "福建",   path: "M 268 208 L 308 210 L 310 232 L 302 246 L 278 242 L 268 232 L 265 220 Z" },

  /* ---- 华南 ---- */
  { name: "广东",   path: "M 240 220 L 280 222 L 298 228 L 302 248 L 295 262 L 278 265 L 252 260 L 240 250 L 235 235 Z" },
  { name: "广西",   path: "M 198 222 L 240 225 L 248 240 L 245 258 L 228 262 L 205 258 L 195 245 L 192 232 Z" },
  { name: "海南",   path: "M 228 262 L 258 264 L 262 280 L 255 288 L 235 286 L 228 278 Z" },

  /* ---- 港澳台 ---- */
  { name: "台湾",   path: "M 315 208 L 335 205 L 342 218 L 340 238 L 332 248 L 320 245 L 312 232 L 312 218 Z" },
  { name: "香港",   path: "M 285 248 L 295 246 L 298 254 L 288 256 Z" },
  { name: "澳门",   path: "M 278 250 L 285 248 L 288 256 L 278 258 Z" },
];

/** 根据 cities 动态计算每个省份的 visited 和 count */
function computeProvinceStats(cities: City[]): ProvinceArea[] {
  const counts: Record<string, number> = {};
  for (const c of cities) {
    const prov = c.province?.trim();
    if (!prov) continue;
    counts[prov] = (counts[prov] || 0) + 1;
  }
  return PROVINCE_PATHS.map((p) => ({
    ...p,
    visited: (counts[p.name] || 0) > 0,
    count: counts[p.name] || 0,
  }));
}

const MAP_VIEWBOX_W = 420;
const MAP_VIEWBOX_H = 300;

const VISITED_OVERLAY = "rgba(93, 138, 106, 0.85)";
const UNVISITED_OVERLAY = "rgba(232, 226, 212, 0.45)";
const VISITED_STROKE = "#4d7a5a";
const UNVISITED_STROKE = "#d4ccbe";

/* ============================================================
   空城市模板（用于新增）
   ============================================================ */
const BLANK_CITY = (): City => ({
  id: Date.now(),
  name: "",
  province: "",
  slogan: "",
  imageUrl: "",
  days: 3,
  play: [{ name: "", rating: 5 }],
  eat: [{ name: "", price: "" }],
  stay: "",
  tips: "",
});

/* ============================================================
   主组件
   ============================================================ */
const TravelPage: React.FC = () => {
  const [cities, setCities] = useState<City[]>(loadCities);
  const [hovered, setHovered] = useState<ProvinceArea | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [activeCity, setActiveCity] = useState<City | null>(null);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [hoverCardId, setHoverCardId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  /* 手动标记去过/未去过的省份（点击切换），持久化到 localStorage */
  const [manualVisited, setManualVisited] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem("travel_manual_visited");
      return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
    } catch { return new Set<string>(); }
  });

  const isNew = useMemo(() => editingCity ? !cities.some((c) => c.id === editingCity.id) : false, [editingCity, cities]);

  // 保存到 localStorage
  useEffect(() => { saveCities(cities); }, [cities]);

  ///* 保存手动标记到 localStorage */
  useEffect(() => {
    try { localStorage.setItem("travel_manual_visited", JSON.stringify([...manualVisited])); } catch { /* ignore */ }
  }, [manualVisited]);

  /* 动态计算省份状态（合并手动标记） */
  const provinceBlocks = useMemo(() => {
    const auto = computeProvinceStats(cities);
    return auto.map((p) => ({
      ...p,
      visited: p.visited || manualVisited.has(p.name),
      count: p.count,
    }));
  }, [cities, manualVisited]);

  // 统计
  const stats = useMemo(() => {
    const visitedProvinces = provinceBlocks.filter((p) => p.visited).length;
    const totalCities = cities.length;
    const totalDays = cities.reduce((s, c) => s + c.days, 0);
    return { visitedProvinces, totalCities, totalDays };
  }, [cities, provinceBlocks]);

  // 锁定 Modal 滚动
  useEffect(() => {
    if (activeCity || editingCity) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [activeCity, editingCity]);

  const handleProvinceHover = (p: ProvinceArea, e: React.MouseEvent) => {
    setHovered(p);
    const rect = (e.currentTarget as SVGElement).closest("svg")!.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const handleProvinceClick = (p: ProvinceArea) => {
    setManualVisited((prev) => {
      const next = new Set(prev);
      if (next.has(p.name)) next.delete(p.name); else next.add(p.name);
      return next;
    });
  };

  /* ---- 新增 ---- */
  const handleAdd = () => { setEditingCity(BLANK_CITY()); };

  /* ---- 编辑 ---- */
  const handleEdit = (city: City) => { setEditingCity({ ...city }); };

  /* ---- 删除 ---- */
  const handleDelete = (city: City) => {
    if (!window.confirm(`确定要删除「${city.name}」的城市记忆吗？`)) return;
    setCities((prev) => prev.filter((c) => c.id !== city.id));
    setToast(`「${city.name}」的城市记忆已删除`);
    setTimeout(() => setToast(null), 2200);
  };

  /* ---- 保存编辑 ---- */
  const handleSave = () => {
    if (!editingCity) return;
    const c = editingCity;
    if (!c.name.trim()) {
      alert("请填写城市名称");
      return;
    }

    // 自动推断省份
    const inferredProvince = getProvinceByCity(c.name.trim());
    let finalProvince = c.province.trim();

    if (inferredProvince) {
      // 字典中有该城市，自动覆盖省份（以字典为准）
      finalProvince = inferredProvince;
    } else if (!finalProvince) {
      // 字典中无该城市，且用户未手动填写省份
      alert("暂不支持该城市，请尝试输入标准的地级市名称哦～");
      return;
    }

    const cleaned: City = {
      ...c,
      name: c.name.trim(),
      province: finalProvince,
      slogan: c.slogan.trim(),
      stay: c.stay.trim(),
      tips: c.tips.trim(),
      play: c.play.filter((p) => p.name.trim()).map((p) => ({ ...p, name: p.name.trim() })),
      eat: c.eat.filter((e) => e.name.trim()).map((e) => ({ ...e, name: e.name.trim(), price: e.price.trim() })),
    };
    if (cleaned.play.length === 0) cleaned.play = [{ name: "待补充", rating: 5 }];
    if (cleaned.eat.length === 0) cleaned.eat = [{ name: "待补充", price: "" }];

    setCities((prev) => {
      const exists = prev.find((x) => x.id === cleaned.id);
      if (exists) return prev.map((x) => (x.id === cleaned.id ? cleaned : x));
      return [...prev, cleaned];
    });
    setEditingCity(null);
    setToast(isNew ? `「${cleaned.name}」已添加` : `「${cleaned.name}」已更新`);
    setTimeout(() => setToast(null), 2200);
  };

  /* ---- 表单字段更新 ---- */
  const updateField = <K extends keyof City>(key: K, value: City[K]) => {
    setEditingCity((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  /* ---- Play 列表编辑 ---- */
  const updatePlay = (idx: number, field: keyof Spot, value: string | number) => {
    setEditingCity((prev) => {
      if (!prev) return prev;
      const list = [...prev.play];
      list[idx] = { ...list[idx], [field]: value } as Spot;
      return { ...prev, play: list };
    });
  };
  const addPlay = () => {
    setEditingCity((prev) => (prev ? { ...prev, play: [...prev.play, { name: "", rating: 5 }] } : prev));
  };
  const removePlay = (idx: number) => {
    setEditingCity((prev) => {
      if (!prev) return prev;
      const list = prev.play.filter((_, i) => i !== idx);
      return { ...prev, play: list.length ? list : [{ name: "", rating: 5 }] };
    });
  };

  /* ---- Eat 列表编辑 ---- */
  const updateEat = (idx: number, field: keyof Eat, value: string) => {
    setEditingCity((prev) => {
      if (!prev) return prev;
      const list = [...prev.eat];
      list[idx] = { ...list[idx], [field]: value } as Eat;
      return { ...prev, eat: list };
    });
  };
  const addEat = () => {
    setEditingCity((prev) => (prev ? { ...prev, eat: [...prev.eat, { name: "", price: "" }] } : prev));
  };
  const removeEat = (idx: number) => {
    setEditingCity((prev) => {
      if (!prev) return prev;
      const list = prev.eat.filter((_, i) => i !== idx);
      return { ...prev, eat: list.length ? list : [{ name: "", price: "" }] };
    });
  };

  return (
    <div className="travel-page">
      {/* ===== Hero ===== */}
      <header className="travel-hero">
        <div className="travel-hero-bg" />
        <div className="travel-hero-grain" />
        <Link to="/mickey" className="travel-back">
          ← 返回妙妙工具箱
        </Link>
        <div className="travel-hero-content">
          <motion.h1
            className="travel-hero-title"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            漫游指南
          </motion.h1>
          <motion.p
            className="travel-hero-sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            走过的路，看过的云。
          </motion.p>
          <span className="travel-hero-meta">Travel Log</span>
        </div>
      </header>

      {/* ===== 足迹地图 ===== */}
      <section className="travel-section">
        <div className="travel-section-head">
          <span className="travel-stamp">足迹</span>
          <h2 className="travel-section-title">走过的土地</h2>
        </div>

        <div className="travel-map-wrap">
          <div className="travel-map-bg" style={{ backgroundImage: "url('/china-map-bg.jpg')" }}>
            <svg
              viewBox={`0 0 ${MAP_VIEWBOX_W} ${MAP_VIEWBOX_H}`}
              className="travel-map-overlay"
              onMouseLeave={() => setHovered(null)}
            >
              {provinceBlocks.map((p) => {
                const isHovered = hovered?.name === p.name;
                const isVisited = p.visited;
                return (
                  <g key={p.name}>
                    <path
                      d={p.path}
                      fill={isVisited ? VISITED_OVERLAY : UNVISITED_OVERLAY}
                      stroke={isVisited ? VISITED_STROKE : UNVISITED_STROKE}
                      strokeWidth={isHovered ? 1.5 : 0.8}
                      opacity={isHovered ? 1 : isVisited ? 0.75 : 0.5}
                      className="travel-province-area"
                      onMouseEnter={(e) => handleProvinceHover(p, e)}
                      onMouseMove={(e) => handleProvinceHover(p, e)}
                      onClick={() => handleProvinceClick(p)}
                    />
                    {isVisited && (
                      <circle
                        cx={parseFloat(p.path.match(/M\s*(\d+)/)?.[1] || "0") + 8}
                        cy={parseFloat(p.path.match(/\s+(\d+)/)?.[1] || "0") + 8}
                        r="4"
                        fill="#fff"
                        opacity="0.7"
                        style={{ pointerEvents: "none" }}
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {hovered && (
            <div
              className="travel-tooltip"
              style={{ left: tooltipPos.x, top: tooltipPos.y }}
            >
              {hovered.visited ? (
                <span>{hovered.name}：去过 {hovered.count} 次</span>
              ) : (
                <span>{hovered.name}：还没去过</span>
              )}
            </div>
          )}

          <div className="travel-legend">
            <span className="travel-legend-item">
              <span className="travel-legend-dot" style={{ background: "#5d8a6a" }} />
              已去过
            </span>
            <span className="travel-legend-item">
              <span className="travel-legend-dot" style={{ background: "#e8e2d4" }} />
              待探索
            </span>
            <span className="travel-legend-tip">点击省份切换</span>
          </div>
        </div>

        <div className="travel-stats">
          <div className="travel-stat-pill">
            <span className="travel-stat-emoji">📍</span>
            <span className="travel-stat-num">{stats.visitedProvinces}</span>
            <span className="travel-stat-label">省</span>
          </div>
          <div className="travel-stat-pill">
            <span className="travel-stat-emoji">🏙️</span>
            <span className="travel-stat-num">{stats.totalCities}</span>
            <span className="travel-stat-label">城</span>
          </div>
          <div className="travel-stat-pill">
            <span className="travel-stat-emoji">📅</span>
            <span className="travel-stat-num">{stats.totalDays}</span>
            <span className="travel-stat-label">天</span>
          </div>
        </div>
      </section>

      {/* ===== 城市画廊 ===== */}
      <section className="travel-section">
        <div className="travel-section-head" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span className="travel-stamp">攻略</span>
            <h2 className="travel-section-title">城市记忆</h2>
          </div>
          <button className="travel-add-btn" onClick={handleAdd}>
            <span>＋</span>
            <span>记录新城市</span>
          </button>
        </div>

        <div className="travel-cards-scroll">
          <div className="travel-cards-track">
            {cities.map((c, i) => (
              <motion.div
                key={c.id}
                className="travel-city-card"
                onMouseEnter={() => setHoverCardId(c.id)}
                onMouseLeave={() => setHoverCardId(null)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                {/* 操作按钮 */}
                <div className={`travel-card-actions ${hoverCardId === c.id ? "visible" : ""}`}>
                  <button className="travel-card-action-btn" onClick={() => handleEdit(c)} title="编辑" aria-label="编辑">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                  </button>
                  <button className="travel-card-action-btn delete" onClick={() => handleDelete(c)} title="删除" aria-label="删除">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>

                <button className="travel-card-main" onClick={() => setActiveCity(c)}>
                  <div className="travel-card-img-wrap">
                    <img src={c.imageUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop"} alt={c.name} loading="lazy" />
                    <div className="travel-card-tape" />
                    <span className="travel-card-days">{c.days}天</span>
                  </div>
                  <div className="travel-card-body">
                    <h3 className="travel-card-name">{c.name}</h3>
                    <p className="travel-card-slogan">{c.slogan}</p>
                    <span className="travel-card-province">{c.province}</span>
                  </div>
                  <span className="travel-card-cta">查看攻略 →</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="travel-foot">
        <span>走过的路都算数，看过的云都不散。</span>
      </footer>

      {/* ===== 城市详情 Modal ===== */}
      <AnimatePresence>
        {activeCity && (
          <motion.div
            className="travel-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCity(null)}
          >
            <motion.div
              className="travel-modal"
              initial={{ scale: 0.92, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 30 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="travel-modal-close" onClick={() => setActiveCity(null)} aria-label="关闭">×</button>
              <div className="travel-modal-cover">
                <img src={activeCity.imageUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop"} alt={activeCity.name} />
                <div className="travel-modal-cover-tint" />
                <div className="travel-modal-cover-text">
                  <h3 className="travel-modal-name">{activeCity.name}</h3>
                  <p className="travel-modal-slogan">{activeCity.slogan}</p>
                </div>
              </div>

              <div className="travel-modal-body">
                <div className="travel-modal-section">
                  <h4 className="travel-modal-h4">🎯 玩</h4>
                  <ul className="travel-modal-list">
                    {activeCity.play.map((s) => (
                      <li key={s.name} className="travel-modal-list-item">
                        <span>{s.name}</span>
                        <span className="travel-modal-rating">
                          {"★".repeat(s.rating)}
                          <span className="travel-modal-rating-empty">{"★".repeat(5 - s.rating)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="travel-modal-section">
                  <h4 className="travel-modal-h4">🍜 吃</h4>
                  <ul className="travel-modal-list">
                    {activeCity.eat.map((s) => (
                      <li key={s.name} className="travel-modal-list-item">
                        <span>{s.name}{s.signature && <em className="travel-modal-signature"> · {s.signature}</em>}</span>
                        <span className="travel-modal-price">{s.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="travel-modal-section">
                  <h4 className="travel-modal-h4">🛏️ 住</h4>
                  <p className="travel-modal-text">{activeCity.stay}</p>
                </div>
                <div className="travel-modal-section travel-modal-tips">
                  <h4 className="travel-modal-h4">💡 Tips</h4>
                  <p className="travel-modal-text">{activeCity.tips}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== 编辑/新增 Modal ===== */}
      <AnimatePresence>
        {editingCity && (
          <motion.div
            className="travel-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditingCity(null)}
          >
            <motion.div
              className="travel-modal travel-edit-modal"
              initial={{ scale: 0.92, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 30 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="travel-modal-close" onClick={() => setEditingCity(null)} aria-label="关闭">×</button>

              <div className="travel-edit-header">
                <h3>{isNew ? "记录新城市" : `编辑「${editingCity.name}」`}</h3>
                <p>填写你的旅行记忆，留存温度。</p>
              </div>

              <div className="travel-edit-body">
                {/* 基本信息 */}
                <div className="travel-edit-row two-col">
                  <label className="travel-edit-field">
                    <span>城市名称</span>
                    <input type="text" value={editingCity.name} onChange={(e) => updateField("name", e.target.value)} placeholder="如：大理" />
                  </label>
                  <label className="travel-edit-field">
                    <span>所属省份</span>
                    <input type="text" value={editingCity.province} onChange={(e) => updateField("province", e.target.value)} placeholder="如：云南" />
                  </label>
                </div>

                <label className="travel-edit-field">
                  <span>一句话标语</span>
                  <input type="text" value={editingCity.slogan} onChange={(e) => updateField("slogan", e.target.value)} placeholder="如：风花雪月的慢生活" />
                </label>

                <div className="travel-edit-row two-col">
                  <label className="travel-edit-field">
                    <span>图片链接</span>
                    <input type="text" value={editingCity.imageUrl} onChange={(e) => updateField("imageUrl", e.target.value)} placeholder="https://..." />
                  </label>
                  <label className="travel-edit-field">
                    <span>停留天数</span>
                    <input type="number" min={1} max={99} value={editingCity.days} onChange={(e) => updateField("days", Math.max(1, parseInt(e.target.value || "1", 10)))} />
                  </label>
                </div>

                {/* 玩 */}
                <div className="travel-edit-section">
                  <h4 className="travel-edit-h4">🎯 玩</h4>
                  {editingCity.play.map((p, idx) => (
                    <div key={idx} className="travel-edit-list-row">
                      <input type="text" value={p.name} onChange={(e) => updatePlay(idx, "name", e.target.value)} placeholder="景点名称" />
                      <select value={p.rating} onChange={(e) => updatePlay(idx, "rating", parseInt(e.target.value, 10))}>
                        {[5,4,3,2,1].map((r) => (<option key={r} value={r}>{"★".repeat(r)}</option>))}
                      </select>
                      <button className="travel-edit-remove" onClick={() => removePlay(idx)} type="button" aria-label="删除">×</button>
                    </div>
                  ))}
                  <button className="travel-edit-add" onClick={addPlay} type="button">＋ 添加景点</button>
                </div>

                {/* 吃 */}
                <div className="travel-edit-section">
                  <h4 className="travel-edit-h4">🍜 吃</h4>
                  {editingCity.eat.map((item, idx) => (
                    <div key={idx} className="travel-edit-list-row">
                      <input type="text" value={item.name} onChange={(e) => updateEat(idx, "name", e.target.value)} placeholder="美食名称" />
                      <input type="text" value={item.price} onChange={(e) => updateEat(idx, "price", e.target.value)} placeholder="价格" style={{ maxWidth: 90 }} />
                      <button className="travel-edit-remove" onClick={() => removeEat(idx)} type="button" aria-label="删除">×</button>
                    </div>
                  ))}
                  <button className="travel-edit-add" onClick={addEat} type="button">＋ 添加美食</button>
                </div>

                <label className="travel-edit-field">
                  <span>住宿推荐</span>
                  <textarea rows={2} value={editingCity.stay} onChange={(e) => updateField("stay", e.target.value)} placeholder="写下你的住宿体验..." />
                </label>

                <label className="travel-edit-field">
                  <span>Tips</span>
                  <textarea rows={2} value={editingCity.tips} onChange={(e) => updateField("tips", e.target.value)} placeholder="给其他旅人的建议..." />
                </label>
              </div>

              <div className="travel-edit-footer">
                <button className="travel-edit-btn secondary" onClick={() => setEditingCity(null)}>取消</button>
                <button className="travel-edit-btn primary" onClick={handleSave}>{isNew ? "保存记录" : "更新记忆"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="travel-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .travel-page,
        .travel-page * { cursor: auto; }
        .travel-page a, .travel-page button { cursor: pointer; }

        .travel-page {
          min-height: 100vh; color: #4a4036;
          background: #faf6ee;
          font-family: "Noto Sans SC", system-ui, sans-serif;
        }

        /* Hero */
        .travel-hero {
          position: relative; height: 52vh; min-height: 360px;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .travel-hero-bg {
          position: absolute; inset: 0;
          background: url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&h=900&fit=crop") center/cover;
          filter: blur(3px) brightness(0.7);
          transform: scale(1.05);
        }
        .travel-hero-grain {
          position: absolute; inset: 0; opacity: 0.08; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .travel-hero-content { position: relative; z-index: 2; text-align: center; }
        .travel-back {
          position: absolute; top: 24px; left: 24px; z-index: 3;
          font-size: 14px; color: rgba(255,255,255,0.8); text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease;
        }
        .travel-back:hover { color: #fff; }
        .travel-hero-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(36px, 6vw, 56px); font-weight: 700; color: #fff;
          margin: 0 0 12px; letter-spacing: 0.1em;
          text-shadow: 0 2px 20px rgba(0,0,0,0.4);
        }
        .travel-hero-sub {
          font-size: 16px; color: rgba(255,255,255,0.85); margin: 0;
          letter-spacing: 0.12em; font-style: italic;
        }
        .travel-hero-meta {
          display: block; margin-top: 16px; font-size: 11px;
          color: rgba(255,255,255,0.5); letter-spacing: 0.3em; text-transform: uppercase;
        }

        /* Section */
        .travel-section { max-width: 960px; margin: 0 auto; padding: 56px 24px; }
        .travel-section-head { display: flex; align-items: center; gap: 14px; margin-bottom: 32px; }
        .travel-stamp {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 3px 14px; border: 2px solid #b07832; border-radius: 4px;
          font-size: 13px; font-weight: 700; color: #b07832;
          transform: rotate(-3deg); opacity: 0.8;
        }
        .travel-section-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 26px; font-weight: 700; color: #5d8a6a; margin: 0;
        }

        /* 新增按钮 */
        .travel-add-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 999px;
          border: 1.5px solid #7a9e7e;
          background: transparent; color: #5d8a6a;
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.03em;
          transition: all 0.25s ease;
        }
        .travel-add-btn:hover {
          background: #7a9e7e; color: #fff;
          box-shadow: 0 4px 14px -4px rgba(93,138,106,0.3);
        }

        /* 地图 */
        .travel-map-wrap {
          position: relative; background: #fffdf6;
          border: 1px solid #ece4d4; border-radius: 14px;
          padding: 0; overflow: hidden;
          box-shadow: 0 10px 30px -14px rgba(120,100,60,0.15);
        }
        .travel-map-bg {
          position: relative; width: 100%;
          padding-top: 66.67%; /* 3:2 aspect ratio */
          background-size: cover; background-position: center;
          background-repeat: no-repeat;
        }
        .travel-map-overlay {
          position: absolute; inset: 0; width: 100%; height: 100%;
          display: block;
        }
        .travel-province-area {
          cursor: pointer;
          transition: opacity 0.2s ease, stroke-width 0.2s ease;
        }
        .travel-province-area:hover {
          filter: drop-shadow(0 0 4px rgba(0,0,0,0.2));
        }
        .travel-tooltip {
          position: absolute; z-index: 10; pointer-events: none;
          padding: 6px 12px; border-radius: 6px;
          background: rgba(74,64,54,0.92); color: #fff; font-size: 12px;
          white-space: nowrap; transform: translate(-50%, -130%);
          box-shadow: 0 4px 14px -4px rgba(0,0,0,0.3);
        }
        .travel-legend {
          display: flex; justify-content: center; gap: 24px; margin-top: 16px;
        }
        .travel-legend-item {
          display: flex; align-items: center; gap: 6px; font-size: 13px; color: #9a8a7e;
        }
        .travel-legend-tip {
          font-size: 11px; color: #c4b8a8; font-style: italic; letter-spacing: 0.04em;
        }
        .travel-legend-dot { width: 12px; height: 12px; border-radius: 3px; }

        /* 数据看板 */
        .travel-stats {
          display: flex; justify-content: center; gap: 16px; margin-top: 28px;
        }
        .travel-stat-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 10px 20px; border-radius: 999px;
          background: #fff; border: 1px solid #ece4d4;
          box-shadow: 0 4px 14px -6px rgba(120,100,60,0.12);
        }
        .travel-stat-emoji { font-size: 16px; }
        .travel-stat-num { font-size: 20px; font-weight: 700; color: #5d8a6a; }
        .travel-stat-label { font-size: 13px; color: #9a8a7e; }

        /* 城市卡片横向滚动 */
        .travel-cards-scroll {
          overflow-x: auto; scrollbar-width: thin; scrollbar-color: #c8924a transparent;
          -webkit-overflow-scrolling: touch;
        }
        .travel-cards-scroll::-webkit-scrollbar { height: 6px; }
        .travel-cards-scroll::-webkit-scrollbar-thumb { background: rgba(200,146,74,0.3); border-radius: 3px; }
        .travel-cards-track {
          display: flex; gap: 20px; padding: 8px 4px 20px;
          scroll-snap-type: x mandatory;
        }
        .travel-city-card {
          position: relative;
          flex-shrink: 0; width: 280px; scroll-snap-align: start;
          background: #fff; border: 1px solid #ece4d4; border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 28px -12px rgba(120,100,60,0.18);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .travel-city-card:hover {
          border-color: rgba(93,138,106,0.4);
          box-shadow: 0 18px 40px -12px rgba(120,100,60,0.28);
        }
        @media (max-width: 640px) { .travel-city-card { width: 85vw; } }

        .travel-card-main {
          width: 100%; border: none; background: none; padding: 0;
          text-align: left; display: block;
        }
        .travel-card-img-wrap { position: relative; height: 180px; overflow: hidden; }
        .travel-card-img-wrap img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          filter: sepia(0.1) saturate(0.9);
        }
        .travel-card-tape {
          position: absolute; top: -8px; left: 50%; transform: translateX(-50%) rotate(-2deg);
          width: 70px; height: 22px; background: rgba(255,235,180,0.7);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .travel-card-days {
          position: absolute; bottom: 8px; right: 8px;
          padding: 2px 10px; border-radius: 999px;
          font-size: 12px; color: #fff; background: rgba(93,138,106,0.85);
        }
        .travel-card-body { padding: 16px 18px 8px; }
        .travel-card-name {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 20px; font-weight: 700; color: #4a4036; margin: 0 0 4px;
        }
        .travel-card-slogan { font-size: 13px; color: #8a7a6e; margin: 0 0 8px; }
        .travel-card-province {
          font-size: 11px; color: #b07832; letter-spacing: 0.1em;
        }
        .travel-card-cta {
          display: block; padding: 12px 18px 16px; font-size: 13px;
          color: #5d8a6a; font-weight: 600; letter-spacing: 0.03em;
        }

        /* 卡片操作按钮 */
        .travel-card-actions {
          position: absolute; top: 8px; right: 8px; z-index: 5;
          display: flex; gap: 6px;
          opacity: 0;
          transform: translateY(-4px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .travel-card-actions.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .travel-card-action-btn {
          width: 30px; height: 30px; border-radius: 50%;
          border: none; background: rgba(255,255,255,0.9);
          color: #5d8a6a; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          transition: background 0.2s ease, color 0.2s ease;
        }
        .travel-card-action-btn:hover { background: #5d8a6a; color: #fff; }
        .travel-card-action-btn.delete:hover { background: #c44536; }

        /* 页脚 */
        .travel-foot {
          text-align: center; padding: 32px 24px 56px;
          font-size: 13px; color: #b8aa9a; font-style: italic; letter-spacing: 0.06em;
        }

        /* Modal */
        .travel-modal-overlay {
          position: fixed; inset: 0; z-index: 200;
          display: flex; align-items: center; justify-content: center; padding: 20px;
          background: rgba(40,32,24,0.7); backdrop-filter: blur(6px);
        }
        .travel-modal {
          position: relative; width: 100%; max-width: 500px;
          background: #fffdf6; border-radius: 14px; overflow: hidden;
          box-shadow: 0 30px 80px -20px rgba(0,0,0,0.5);
          max-height: 90vh; overflow-y: auto;
        }
        .travel-modal-close {
          position: absolute; top: 12px; right: 14px; z-index: 5;
          width: 34px; height: 34px; border: none; border-radius: 50%;
          background: rgba(255,255,255,0.85); color: #4a4036; font-size: 22px;
          display: flex; align-items: center; justify-content: center;
        }
        .travel-modal-close:hover { background: #fff; }
        .travel-modal-cover { position: relative; height: 200px; overflow: hidden; }
        .travel-modal-cover img {
          width: 100%; height: 100%; object-fit: cover;
          filter: sepia(0.1) brightness(0.85);
        }
        .travel-modal-cover-tint {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.5));
        }
        .travel-modal-cover-text {
          position: absolute; bottom: 20px; left: 24px; right: 24px;
        }
        .travel-modal-name {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 28px; font-weight: 700; color: #fff; margin: 0 0 4px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }
        .travel-modal-slogan { font-size: 14px; color: rgba(255,255,255,0.9); margin: 0; font-style: italic; }
        .travel-modal-body { padding: 24px; }
        .travel-modal-section { margin-bottom: 24px; }
        .travel-modal-h4 {
          font-size: 16px; font-weight: 700; color: #5d8a6a; margin: 0 0 12px;
        }
        .travel-modal-list { list-style: none; margin: 0; padding: 0; }
        .travel-modal-list-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 0; border-bottom: 1px dashed #ece4d4; font-size: 14px; color: #4a4036;
        }
        .travel-modal-rating { color: #f5a623; font-size: 13px; letter-spacing: 1px; }
        .travel-modal-rating-empty { color: #ddd4c6; }
        .travel-modal-signature { font-style: normal; color: #b07832; font-size: 12px; }
        .travel-modal-price { color: #8a7a6e; font-size: 13px; }
        .travel-modal-text { font-size: 14px; line-height: 1.8; color: #6b5e50; margin: 0; }
        .travel-modal-tips {
          padding: 16px; border-radius: 8px; background: rgba(176,120,50,0.06);
          border-left: 3px solid #c8924a;
        }
        .travel-modal-tips .travel-modal-text { font-size: 13px; }

        /* 编辑 Modal 扩展 */
        .travel-edit-modal { max-width: 520px; }
        .travel-edit-header {
          padding: 24px 24px 0;
        }
        .travel-edit-header h3 {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 20px; font-weight: 700; color: #3d3830;
          margin: 0 0 4px;
        }
        .travel-edit-header p {
          font-size: 13px; color: #b0a594; margin: 0;
        }
        .travel-edit-body {
          padding: 16px 24px 0;
        }
        .travel-edit-footer {
          display: flex; justify-content: flex-end; gap: 12px;
          padding: 20px 24px 24px;
        }

        /* 表单字段 */
        .travel-edit-field {
          display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px;
        }
        .travel-edit-field span {
          font-size: 12px; font-weight: 600; color: #7a6e62; letter-spacing: 0.04em;
        }
        .travel-edit-field input,
        .travel-edit-field textarea,
        .travel-edit-list-row input,
        .travel-edit-list-row select {
          padding: 9px 12px; border-radius: 8px;
          border: 1px solid #e0d8cc; background: #fff;
          font-size: 14px; color: #4a4036;
          outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease;
          font-family: inherit;
        }
        .travel-edit-field input:focus,
        .travel-edit-field textarea:focus,
        .travel-edit-list-row input:focus,
        .travel-edit-list-row select:focus {
          border-color: #7a9e7e;
          box-shadow: 0 0 0 3px rgba(122,158,126,0.1);
        }
        .travel-edit-field input::placeholder,
        .travel-edit-field textarea::placeholder {
          color: #c9c0b4;
        }
        .travel-edit-field textarea {
          resize: vertical;
          line-height: 1.6;
        }
        .travel-edit-row.two-col {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
        }
        @media (max-width: 480px) {
          .travel-edit-row.two-col { grid-template-columns: 1fr; }
        }

        /* 列表行编辑 */
        .travel-edit-section { margin-bottom: 16px; }
        .travel-edit-h4 {
          font-size: 14px; font-weight: 700; color: #5d8a6a;
          margin: 0 0 10px;
        }
        .travel-edit-list-row {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 8px;
        }
        .travel-edit-list-row input { flex: 1; min-width: 0; }
        .travel-edit-list-row select {
          padding: 9px 8px; min-width: 80px;
          font-size: 13px;
        }
        .travel-edit-remove {
          width: 28px; height: 28px; border-radius: 50%;
          border: none; background: rgba(196,69,54,0.08); color: #c44536;
          font-size: 16px; line-height: 1;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s ease;
        }
        .travel-edit-remove:hover { background: rgba(196,69,54,0.15); }
        .travel-edit-add {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 6px 12px; border-radius: 999px;
          border: 1px dashed #c9c0b4; background: transparent;
          color: #9a8e82; font-size: 12px;
          transition: all 0.2s ease;
        }
        .travel-edit-add:hover {
          border-color: #7a9e7e; color: #5d8a6a;
          background: rgba(122,158,126,0.05);
        }

        /* 底部按钮 */
        .travel-edit-btn {
          padding: 9px 22px; border-radius: 999px;
          font-size: 14px; font-weight: 600;
          border: none; cursor: pointer;
          transition: all 0.2s ease;
        }
        .travel-edit-btn.primary {
          background: #5d8a6a; color: #fff;
          box-shadow: 0 4px 14px -4px rgba(93,138,106,0.35);
        }
        .travel-edit-btn.primary:hover {
          background: #4d7a5a;
          box-shadow: 0 6px 18px -4px rgba(93,138,106,0.45);
        }
        .travel-edit-btn.secondary {
          background: transparent; color: #9a8e82;
          border: 1px solid #e0d8cc;
        }
        .travel-edit-btn.secondary:hover {
          background: rgba(0,0,0,0.03); color: #7a6e62;
        }

        /* Toast */
        .travel-toast {
          position: fixed; bottom: 32px; left: 50%;
          transform: translateX(-50%);
          z-index: 300;
          padding: 10px 24px;
          border-radius: 999px;
          background: rgba(74,64,54,0.88);
          color: #fff;
          font-size: 13px;
          letter-spacing: 0.03em;
          box-shadow: 0 4px 20px -4px rgba(0,0,0,0.25);
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .travel-modal-cover { height: 160px; }
          .travel-modal-body { padding: 20px; }
          .travel-edit-header { padding: 20px 20px 0; }
          .travel-edit-body { padding: 12px 20px 0; }
          .travel-edit-footer { padding: 16px 20px 20px; }
        }
      `}</style>
    </div>
  );
};

export default TravelPage;
