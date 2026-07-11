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

// 基于水彩中国地图实际经纬度生成的精准省份轮廓（520×360 viewBox）
const PROVINCE_PATHS: Omit<ProvinceArea, "visited" | "count">[] = [
  /* ---- 东北 ---- */
  { name: "黑龙江", path: "M 494.6 69.7 Q 502.8 79.3 479.8 81.3 Q 456.8 83.3 461.4 99.7 Q 466.0 116.1 454.3 104.7 Q 442.6 93.2 431.8 93.4 Q 421.1 93.6 412.6 86.5 Q 404.2 79.3 421.2 76.6 Q 438.3 73.8 434.7 57.2 Q 431.2 40.6 442.0 55.8 Q 452.8 70.9 469.6 65.5 Q 486.4 60.1 494.6 69.7 Z" },
  { name: "吉林",   path: "M 465.3 112.9 Q 469.2 119.1 468.2 127.0 Q 467.3 135.0 459.1 139.6 Q 450.9 144.3 441.7 142.4 Q 432.6 140.5 427.3 135.6 Q 422.0 130.6 418.9 124.8 Q 415.9 119.1 416.3 111.7 Q 416.6 104.4 423.7 98.7 Q 430.8 93.1 440.6 94.1 Q 450.4 95.1 455.9 100.9 Q 461.5 106.8 465.3 112.9 Z" },
  { name: "辽宁",   path: "M 445.3 130.7 Q 449.2 136.9 448.2 144.8 Q 447.3 152.8 439.1 157.4 Q 430.9 162.1 421.7 160.2 Q 412.6 158.3 407.3 153.4 Q 402.0 148.4 398.9 142.6 Q 395.9 136.9 396.3 129.5 Q 396.6 122.2 403.7 116.5 Q 410.8 110.9 420.6 111.9 Q 430.4 112.9 435.9 118.7 Q 441.5 124.6 445.3 130.7 Z" },

  /* ---- 华北 ---- */
  { name: "内蒙古", path: "M 209.0 114.7 Q 209.0 92.6 222.3 94.8 Q 235.7 97.1 249.0 99.1 Q 262.3 101.1 275.7 102.6 Q 289.0 104.1 302.3 104.9 Q 315.7 105.6 329.0 105.6 Q 342.3 105.6 355.7 104.9 Q 369.0 104.1 382.3 102.6 Q 395.7 101.1 409.0 99.1 Q 422.3 97.1 435.7 94.8 Q 449.0 92.6 449.0 114.7 Q 449.0 136.8 435.7 139.9 Q 422.3 142.9 409.0 145.6 Q 395.7 148.2 382.3 150.2 Q 369.0 152.2 355.7 153.2 Q 342.3 154.3 329.0 154.3 Q 315.7 154.3 302.3 153.2 Q 289.0 152.2 275.7 150.2 Q 262.3 148.2 249.0 145.6 Q 235.7 142.9 222.3 139.9 Q 209.0 136.8 209.0 114.7 Z" },
  { name: "北京",   path: "M 374.1 146.9 Q 375.6 150.1 374.1 153.3 Q 372.5 156.5 368.8 157.8 Q 365.0 159.1 361.2 157.8 Q 357.5 156.5 355.9 153.3 Q 354.4 150.1 355.9 146.9 Q 357.5 143.7 361.2 142.4 Q 365.0 141.1 368.8 142.4 Q 372.5 143.7 374.1 146.9 Z" },
  { name: "天津",   path: "M 382.1 154.0 Q 383.6 157.2 382.1 160.4 Q 380.5 163.6 376.8 164.9 Q 373.0 166.2 369.2 164.9 Q 365.5 163.6 363.9 160.4 Q 362.4 157.2 363.9 154.0 Q 365.5 150.8 369.2 149.5 Q 373.0 148.2 376.8 149.5 Q 380.5 150.8 382.1 154.0 Z" },
  { name: "河北",   path: "M 374.3 157.2 Q 377.6 163.4 376.8 171.3 Q 376.0 179.3 368.8 183.9 Q 361.6 188.6 353.6 186.7 Q 345.7 184.8 341.0 179.9 Q 336.4 174.9 333.7 169.1 Q 331.0 163.4 331.3 156.0 Q 331.7 148.7 337.9 143.0 Q 344.1 137.4 352.6 138.4 Q 361.2 139.4 366.1 145.2 Q 370.9 151.1 374.3 157.2 Z" },
  { name: "山西",   path: "M 347.2 165.1 Q 350.1 172.3 349.4 181.5 Q 348.7 190.8 342.6 196.3 Q 336.4 201.7 329.6 199.5 Q 322.7 197.3 318.7 191.5 Q 314.7 185.7 312.5 179.0 Q 310.2 172.3 310.4 163.7 Q 310.7 155.1 316.0 148.5 Q 321.4 141.9 328.7 143.1 Q 336.0 144.3 340.2 151.1 Q 344.3 157.9 347.2 165.1 Z" },
  { name: "山东",   path: "M 405.3 174.9 Q 409.2 181.1 408.2 189.0 Q 407.3 197.0 399.1 201.6 Q 390.9 206.3 381.7 204.4 Q 372.6 202.5 367.3 197.6 Q 362.0 192.6 358.9 186.8 Q 355.9 181.1 356.3 173.7 Q 356.6 166.4 363.7 160.7 Q 370.8 155.1 380.6 156.1 Q 390.4 157.1 395.9 162.9 Q 401.5 168.8 405.3 174.9 Z" },

  /* ---- 西北 ---- */
  { name: "新疆",   path: "M 201.3 114.7 Q 194.6 132.4 197.5 148.7 Q 200.4 165.0 184.3 179.5 Q 168.1 194.1 140.6 197.1 Q 113.0 200.1 91.1 190.7 Q 69.3 181.3 62.1 167.7 Q 55.0 154.0 56.9 143.2 Q 58.9 132.4 61.9 123.5 Q 65.0 114.5 71.5 103.8 Q 77.9 93.1 95.5 83.4 Q 113.0 73.7 139.7 73.2 Q 166.4 72.7 187.2 84.8 Q 208.0 97.0 201.3 114.7 Z" },
  { name: "甘肃",   path: "M 229.0 183.8 Q 226.6 175.0 236.2 167.9 Q 245.8 160.8 255.4 164.3 Q 265.0 167.9 279.4 173.2 Q 293.8 178.5 301.0 185.6 Q 308.2 192.7 303.4 198.0 Q 298.6 203.3 286.6 205.1 Q 274.6 206.9 262.6 205.1 Q 250.6 203.3 241.0 198.0 Q 231.4 192.7 229.0 183.8 Z" },
  { name: "青海",   path: "M 237.5 172.9 Q 243.2 181.1 241.8 191.7 Q 240.4 202.2 228.1 208.5 Q 215.8 214.7 202.1 212.2 Q 188.4 209.7 180.5 203.0 Q 172.5 196.4 167.9 188.7 Q 163.3 181.1 163.9 171.3 Q 164.4 161.5 175.1 153.9 Q 185.7 146.4 200.4 147.8 Q 215.1 149.1 223.4 156.9 Q 231.7 164.6 237.5 172.9 Z" },
  { name: "宁夏",   path: "M 294.7 163.1 Q 297.0 167.9 294.7 172.7 Q 292.3 177.5 286.7 179.5 Q 281.0 181.5 275.3 179.5 Q 269.7 177.5 267.3 172.7 Q 265.0 167.9 267.3 163.1 Q 269.7 158.3 275.3 156.3 Q 281.0 154.3 286.7 156.3 Q 292.3 158.3 294.7 163.1 Z" },
  { name: "陕西",   path: "M 326.3 195.1 Q 329.6 203.3 328.8 213.9 Q 328.0 224.4 320.8 230.7 Q 313.6 236.9 305.6 234.4 Q 297.7 231.9 293.0 225.2 Q 288.4 218.6 285.7 210.9 Q 283.0 203.3 283.3 193.5 Q 283.7 183.7 289.9 176.1 Q 296.1 168.6 304.6 170.0 Q 313.2 171.3 318.1 179.1 Q 322.9 186.8 326.3 195.1 Z" },

  /* ---- 西南 ---- */
  { name: "西藏",   path: "M 210.6 227.9 Q 205.0 243.1 207.4 257.1 Q 209.8 271.0 196.4 283.5 Q 182.9 296.0 160.0 298.5 Q 137.0 301.1 118.8 293.1 Q 100.6 285.0 94.6 273.3 Q 88.6 261.6 90.3 252.4 Q 91.9 243.1 94.4 235.4 Q 97.0 227.8 102.4 218.6 Q 107.8 209.4 122.4 201.1 Q 137.0 192.8 159.2 192.4 Q 181.5 191.9 198.8 202.3 Q 216.1 212.7 210.6 227.9 Z" },
  { name: "四川",   path: "M 287.4 226.1 Q 292.2 234.3 291.0 244.9 Q 289.8 255.4 279.6 261.7 Q 269.3 267.9 257.9 265.4 Q 246.5 262.9 239.9 256.2 Q 233.2 249.6 229.4 241.9 Q 225.6 234.3 226.1 224.5 Q 226.5 214.7 235.4 207.1 Q 244.3 199.6 256.5 201.0 Q 268.7 202.3 275.6 210.1 Q 282.6 217.8 287.4 226.1 Z" },
  { name: "重庆",   path: "M 300.1 237.8 Q 302.7 243.1 300.1 248.4 Q 297.5 253.7 291.3 256.0 Q 285.0 258.2 278.7 256.0 Q 272.5 253.7 269.9 248.4 Q 267.3 243.1 269.9 237.8 Q 272.5 232.5 278.7 230.2 Q 285.0 228.0 291.3 230.2 Q 297.5 232.5 300.1 237.8 Z" },
  { name: "云南",   path: "M 269.3 274.8 Q 273.2 283.0 272.2 293.6 Q 271.3 304.1 263.1 310.4 Q 254.9 316.6 245.7 314.1 Q 236.6 311.6 231.3 304.9 Q 226.0 298.3 222.9 290.6 Q 219.9 283.0 220.3 273.2 Q 220.6 263.4 227.7 255.8 Q 234.8 248.3 244.6 249.7 Q 254.4 251.0 259.9 258.8 Q 265.5 266.5 269.3 274.8 Z" },
  { name: "贵州",   path: "M 303.2 263.5 Q 306.1 269.7 305.4 277.6 Q 304.7 285.6 298.6 290.2 Q 292.4 294.9 285.6 293.0 Q 278.7 291.1 274.7 286.2 Q 270.7 281.2 268.5 275.4 Q 266.2 269.7 266.4 262.3 Q 266.7 255.0 272.0 249.3 Q 277.4 243.7 284.7 244.7 Q 292.0 245.7 296.2 251.5 Q 300.3 257.4 303.2 263.5 Z" },

  /* ---- 华中 ---- */
  { name: "河南",   path: "M 362.3 197.1 Q 365.6 203.3 364.8 211.2 Q 364.0 219.2 356.8 223.8 Q 349.6 228.5 341.6 226.6 Q 333.7 224.7 329.0 219.8 Q 324.4 214.8 321.7 209.0 Q 319.0 203.3 319.3 195.9 Q 319.7 188.6 325.9 182.9 Q 332.1 177.3 340.6 178.3 Q 349.2 179.3 354.1 185.1 Q 358.9 191.0 362.3 197.1 Z" },
  { name: "湖北",   path: "M 353.3 227.1 Q 357.2 234.3 356.2 243.5 Q 355.3 252.8 347.1 258.3 Q 338.9 263.7 329.7 261.5 Q 320.6 259.3 315.3 253.5 Q 310.0 247.7 306.9 241.0 Q 303.9 234.3 304.3 225.7 Q 304.6 217.1 311.7 210.5 Q 318.8 203.9 328.6 205.1 Q 338.4 206.3 343.9 213.1 Q 349.5 219.9 353.3 227.1 Z" },
  { name: "湖南",   path: "M 350.3 253.7 Q 353.6 260.9 352.8 270.1 Q 352.0 279.4 344.8 284.9 Q 337.6 290.3 329.6 288.1 Q 321.7 285.9 317.0 280.1 Q 312.4 274.3 309.7 267.6 Q 307.0 260.9 307.3 252.3 Q 307.7 243.7 313.9 237.1 Q 320.1 230.5 328.6 231.7 Q 337.2 232.9 342.1 239.7 Q 346.9 246.5 350.3 253.7 Z" },
  { name: "江西",   path: "M 375.2 253.7 Q 378.1 260.9 377.4 270.1 Q 376.7 279.4 370.6 284.9 Q 364.4 290.3 357.6 288.1 Q 350.7 285.9 346.7 280.1 Q 342.7 274.3 340.5 267.6 Q 338.2 260.9 338.4 252.3 Q 338.7 243.7 344.0 237.1 Q 349.4 230.5 356.7 231.7 Q 364.0 232.9 368.2 239.7 Q 372.3 246.5 375.2 253.7 Z" },

  /* ---- 华东 ---- */
  { name: "江苏",   path: "M 410.3 210.4 Q 413.6 216.6 412.8 224.5 Q 412.0 232.5 404.8 237.1 Q 397.6 241.8 389.6 239.9 Q 381.7 238.0 377.0 233.1 Q 372.4 228.1 369.7 222.3 Q 367.0 216.6 367.3 209.2 Q 367.7 201.9 373.9 196.2 Q 380.1 190.6 388.6 191.6 Q 397.2 192.6 402.1 198.4 Q 406.9 204.3 410.3 210.4 Z" },
  { name: "安徽",   path: "M 387.2 219.2 Q 390.1 225.4 389.4 233.3 Q 388.7 241.3 382.6 245.9 Q 376.4 250.6 369.6 248.7 Q 362.7 246.8 358.7 241.9 Q 354.7 236.9 352.5 231.1 Q 350.2 225.4 350.4 218.0 Q 350.7 210.7 356.0 205.0 Q 361.4 199.4 368.7 200.4 Q 376.0 201.4 380.2 207.2 Q 384.3 213.1 387.2 219.2 Z" },
  { name: "浙江",   path: "M 411.2 241.4 Q 414.1 247.6 413.4 255.5 Q 412.7 263.5 406.6 268.1 Q 400.4 272.8 393.6 270.9 Q 386.7 269.0 382.7 264.1 Q 378.7 259.1 376.5 253.3 Q 374.2 247.6 374.4 240.2 Q 374.7 232.9 380.0 227.2 Q 385.4 221.6 392.7 222.6 Q 400.0 223.6 404.2 229.4 Q 408.3 235.3 411.2 241.4 Z" },
  { name: "上海",   path: "M 414.1 226.7 Q 415.6 229.9 414.1 233.1 Q 412.5 236.3 408.8 237.6 Q 405.0 238.9 401.2 237.6 Q 397.5 236.3 395.9 233.1 Q 394.4 229.9 395.9 226.7 Q 397.5 223.5 401.2 222.2 Q 405.0 220.9 408.8 222.2 Q 412.5 223.5 414.1 226.7 Z" },
  { name: "福建",   path: "M 395.2 267.9 Q 398.1 274.1 397.4 282.0 Q 396.7 290.0 390.6 294.6 Q 384.4 299.3 377.6 297.4 Q 370.7 295.5 366.7 290.6 Q 362.7 285.6 360.5 279.8 Q 358.2 274.1 358.4 266.7 Q 358.7 259.4 364.0 253.7 Q 369.4 248.1 376.7 249.1 Q 384.0 250.1 388.2 255.9 Q 392.3 261.8 395.2 267.9 Z" },

  /* ---- 华南 ---- */
  { name: "广东",   path: "M 365.3 290.1 Q 369.2 296.3 368.2 304.2 Q 367.3 312.2 359.1 316.8 Q 350.9 321.5 341.7 319.6 Q 332.6 317.7 327.3 312.8 Q 322.0 307.8 318.9 302.0 Q 315.9 296.3 316.3 288.9 Q 316.6 281.6 323.7 275.9 Q 330.8 270.3 340.6 271.3 Q 350.4 272.3 355.9 278.1 Q 361.5 284.0 365.3 290.1 Z" },
  { name: "广西",   path: "M 322.3 294.5 Q 325.6 300.7 324.8 308.6 Q 324.0 316.6 316.8 321.2 Q 309.6 325.9 301.6 324.0 Q 293.7 322.1 289.0 317.2 Q 284.4 312.2 281.7 306.4 Q 279.0 300.7 279.3 293.3 Q 279.7 286.0 285.9 280.3 Q 292.1 274.7 300.6 275.7 Q 309.2 276.7 314.1 282.5 Q 318.9 288.4 322.3 294.5 Z" },
  { name: "海南",   path: "M 326.6 326.9 Q 328.9 331.7 326.6 336.5 Q 324.3 341.3 318.6 343.3 Q 313.0 345.3 307.4 343.3 Q 301.7 341.3 299.4 336.5 Q 297.1 331.7 299.4 326.9 Q 301.7 322.1 307.4 320.1 Q 313.0 318.1 318.6 320.1 Q 324.3 322.1 326.6 326.9 Z" },

  /* ---- 港澳台 ---- */
  { name: "台湾",   path: "M 411.9 285.7 Q 413.7 291.9 413.2 299.8 Q 412.8 307.8 409.1 312.4 Q 405.4 317.1 401.3 315.2 Q 397.2 313.3 394.8 308.4 Q 392.4 303.4 391.1 297.6 Q 389.7 291.9 389.9 284.5 Q 390.0 277.2 393.2 271.5 Q 396.4 265.9 400.8 266.9 Q 405.2 267.9 407.7 273.7 Q 410.2 279.6 411.9 285.7 Z" },
  { name: "香港",   path: "M 351.9 305.3 Q 352.7 306.9 351.9 308.5 Q 351.2 310.1 349.3 310.8 Q 347.4 311.4 345.5 310.8 Q 343.6 310.1 342.9 308.5 Q 342.1 306.9 342.9 305.3 Q 343.6 303.7 345.5 303.0 Q 347.4 302.4 349.3 303.0 Q 351.2 303.7 351.9 305.3 Z" },
  { name: "澳门",   path: "M 344.8 306.5 Q 345.4 307.8 344.8 309.1 Q 344.1 310.5 342.6 311.0 Q 341.0 311.6 339.4 311.0 Q 337.9 310.5 337.2 309.1 Q 336.6 307.8 337.2 306.5 Q 337.9 305.1 339.4 304.6 Q 341.0 304.0 342.6 304.6 Q 344.1 305.1 344.8 306.5 Z" },
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

const MAP_VIEWBOX_W = 520;
const MAP_VIEWBOX_H = 360;

/* 已访问省份：透明填充 + 暖琥珀色描边 + 中心图章标记（不再用绿色填充） */
const VISITED_FILL = "transparent";
const UNVISITED_FILL = "transparent";
const VISITED_STROKE = "rgba(168, 130, 78, 0.55)";
const UNVISITED_STROKE = "rgba(180, 170, 160, 0.4)";

/** 从 SVG path 字符串估算中心坐标（用于放置图章标记） */
function getProvinceCenter(path: string): { x: number; y: number } {
  const nums = path.match(/-?\d+\.?\d*/g)?.map(Number) || [];
  let sx = 0, sy = 0, n = 0;
  for (let i = 0; i < nums.length - 1; i += 2) {
    sx += nums[i];
    sy += nums[i + 1];
    n++;
  }
  return n > 0 ? { x: sx / n, y: sy / n } : { x: 260, y: 180 };
}

/** 省级行政区全称映射（用于 data-name） */
const PROVINCE_FULL_NAME: Record<string, string> = {
  "北京": "北京市", "天津": "天津市", "上海": "上海市", "重庆": "重庆市",
  "河北": "河北省", "山西": "山西省", "辽宁": "辽宁省", "吉林": "吉林省",
  "黑龙江": "黑龙江省", "江苏": "江苏省", "浙江": "浙江省", "安徽": "安徽省",
  "福建": "福建省", "江西": "江西省", "山东": "山东省", "河南": "河南省",
  "湖北": "湖北省", "湖南": "湖南省", "广东": "广东省", "海南": "海南省",
  "四川": "四川省", "贵州": "贵州省", "云南": "云南省", "陕西": "陕西省",
  "甘肃": "甘肃省", "青海": "青海省", "台湾": "台湾省",
  "内蒙古": "内蒙古自治区", "广西": "广西壮族自治区", "西藏": "西藏自治区",
  "宁夏": "宁夏回族自治区", "新疆": "新疆维吾尔自治区",
  "香港": "香港特别行政区", "澳门": "澳门特别行政区",
};

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
      {/* ===== Hero 羊皮纸卷轴 ===== */}
      <header className="travel-hero">
        <div className="travel-hero-scroll-bar left" />
        <div className="travel-hero-scroll-bar right" />
        <div className="travel-hero-scroll-knob left" />
        <div className="travel-hero-scroll-knob right" />
        <Link to="/mickey" className="travel-back">
          ← 返回妙妙工具箱
        </Link>
        <div className="travel-hero-content">
          <h1 className="travel-hero-title">漫游指南</h1>
          <p className="travel-hero-sub">走过的路，看过的云。</p>
          <button className="travel-hero-stamp" onClick={() => window.scrollTo({ top: document.querySelector('.travel-section')?.getBoundingClientRect().top + window.scrollY - 20, behavior: 'smooth' })}>
            开启<br/>旅程
          </button>
        </div>
      </header>

      {/* ===== 足迹地图 ===== */}
      <section className="travel-section">
        <div className="travel-section-head">
          <span className="travel-stamp">足迹</span>
          <h2 className="travel-section-title">走过的土地</h2>
        </div>

        <div className="travel-map-wrap">
          {/* 地图钉装饰 */}
          <div className="travel-map-pin tl" />
          <div className="travel-map-pin tr" />
          <div className="travel-map-pin bl" />
          <div className="travel-map-pin br" />

          <div className="travel-map-bg" style={{ backgroundImage: "url('/china-map-watercolor.jpg')" }}>
            <svg
              viewBox={`0 0 ${MAP_VIEWBOX_W} ${MAP_VIEWBOX_H}`}
              className="travel-map-overlay"
              onMouseLeave={() => setHovered(null)}
            >
              {provinceBlocks.map((p) => {
                const isHovered = hovered?.name === p.name;
                const isVisited = p.visited;
                const center = getProvinceCenter(p.path);
                return (
                  <g key={p.name}>
                    <path
                      d={p.path}
                      data-name={PROVINCE_FULL_NAME[p.name] || p.name}
                      fill={isVisited ? VISITED_FILL : UNVISITED_FILL}
                      stroke={isVisited ? VISITED_STROKE : UNVISITED_STROKE}
                      strokeWidth={isHovered ? 2.0 : isVisited ? 1.2 : 0.7}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={isHovered ? 1 : isVisited ? 0.85 : 0.6}
                      className="travel-province-area"
                      onMouseEnter={(e) => handleProvinceHover(p, e)}
                      onMouseMove={(e) => handleProvinceHover(p, e)}
                      onClick={() => handleProvinceClick(p)}
                    />
                    {isVisited && (
                      <g
                        className="travel-visited-mark"
                        style={{ pointerEvents: "none", cursor: "pointer" }}
                        onClick={() => handleProvinceClick(p)}
                      >
                        {/* 外圈：淡琥珀色光环 */}
                        <circle
                          cx={center.x}
                          cy={center.y}
                          r={3.5}
                          fill="rgba(196, 148, 82, 0.12)"
                          stroke="none"
                        />
                        {/* 中圈：琥珀色描边 */}
                        <circle
                          cx={center.x}
                          cy={center.y}
                          r={2.2}
                          fill="none"
                          stroke="rgba(168, 130, 78, 0.6)"
                          strokeWidth="0.8"
                        />
                        {/* 内核：实心琥珀圆点 */}
                        <circle
                          cx={center.x}
                          cy={center.y}
                          r={1.3}
                          fill="rgba(168, 130, 78, 0.85)"
                        />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* 迷你放大镜 */}
          <div className="travel-mini-map">
            <svg viewBox="0 0 100 72">
              <circle cx="50" cy="36" r="28" fill="none" stroke="#C8B898" strokeWidth="1" opacity="0.5" />
              <path d="M72 58 L85 70" stroke="#C8B898" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>

          {hovered && (
            <div
              className="travel-tooltip"
              style={{ left: tooltipPos.x, top: tooltipPos.y }}
            >
              {hovered.visited ? (
                <span>{hovered.name}：已探索 {hovered.count} 天</span>
              ) : (
                <span>{hovered.name}：待探索</span>
              )}
            </div>
          )}

          <div className="travel-legend">
            <span className="travel-legend-item">
              <span className="travel-legend-dot" style={{ background: "rgba(168,130,78,0.85)", border: "1px solid rgba(168,130,78,0.6)", boxShadow: "0 0 0 2px rgba(196,148,82,0.12)" }} />
              已探索
            </span>
            <span className="travel-legend-item">
              <span className="travel-legend-dot" style={{ background: "transparent", border: "1px solid rgba(180,170,160,0.4)" }} />
              待探索
            </span>
            <span className="travel-legend-tip">点击省份标记足迹</span>
          </div>
        </div>

        {/* 木质告示牌 + 地球小伙伴 */}
        <div className="travel-wood-sign">
          <span className="travel-wood-sign-text">已探索</span>
          <span className="travel-wood-sign-num">{stats.visitedProvinces} / 34</span>
          <div className="travel-wood-sign-divider" />
          <div className="travel-earth-pal">
            <div className="travel-earth-pal-face">
              <div className="travel-earth-pal-eyes">
                <div className="travel-earth-pal-eye" />
                <div className="travel-earth-pal-eye" />
              </div>
              <div className="travel-earth-pal-smile" />
              <div className="travel-earth-pal-blush left" />
              <div className="travel-earth-pal-blush right" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 城市画廊 — 冒险家的笔记 ===== */}
      <section className="travel-section">
        <div className="travel-section-head" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span className="travel-stamp">攻略</span>
            <h2 className="travel-section-title">城市记忆</h2>
          </div>
        </div>

        <div className="travel-cards-scroll">
          <div className="travel-cards-track">
            {cities.map((c, i) => {
              const avgRating = c.play.length > 0
                ? Math.round(c.play.reduce((s, x) => s + x.rating, 0) / c.play.length)
                : 3;
              return (
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
                      <div className="travel-card-meta">
                        <div className="travel-card-mood">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <span key={idx} className={idx < avgRating ? "travel-card-mood-star" : "travel-card-mood-star empty"}>★</span>
                          ))}
                        </div>
                        <span className="travel-card-province">{c.province}</span>
                      </div>
                    </div>
                    <span className="travel-card-cta">查看攻略 →</span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAB 魔法笔 */}
      <button className="travel-fab" onClick={handleAdd} aria-label="记录新城市">
        ✎
      </button>

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
        /* ===== CSS Variables - 童话冒险手账主题 ===== */
        :root {
          /* 纸张与基调 */
          --paper-bg: #F5F0E6;
          --paper-texture: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.96 0 0 0 0 0.94 0 0 0 0 0.90 0 0 0 0.03 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          --paper-shadow: 0 2px 8px rgba(60,40,20,0.08);

          /* 主色调 */
          --ink-blue: #2C3E50;
          --pine-green: #2E8B57;
          --pine-green-light: #3DA76B;
          --pine-green-dark: #1E6B3F;
          --gold-accent: #C8924A;
          --warm-brown: #5D4E37;
          --soft-cream: #FDF8F0;

          /* 字体 */
          --font-hand: "Ma Shan Zheng", "ZCOOL XiaoWei", "STKaiti", cursive;
          --font-serif: "Noto Serif SC", Georgia, "STSong", serif;
          --font-body: "Noto Sans SC", system-ui, sans-serif;

          /* 动画 */
          --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
          --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
        }

        .travel-page,
        .travel-page * { cursor: auto; }
        .travel-page a, .travel-page button { cursor: pointer; }

        .travel-page {
          min-height: 100vh;
          color: var(--warm-brown);
          background: var(--paper-bg);
          background-image: var(--paper-texture);
          font-family: var(--font-body);
          position: relative;
          overflow-x: hidden;
        }

        /* ===== Hero 羊皮纸卷轴 ===== */
        .travel-hero {
          position: relative; height: 48vh; min-height: 340px;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          background: linear-gradient(180deg, #E0D8C8 0%, #EDE5D5 25%, #F5F0E6 60%, #F5F0E6 100%);
          border-bottom: 2px solid #D4C8B0;
        }
        .travel-hero-scroll-bar {
          position: absolute; top: 0; width: 32px; height: 100%;
          background: linear-gradient(90deg, #7A6655 0%, #9A8570 40%, #8A7560 60%, #7A6655 100%);
          z-index: 5;
          box-shadow: inset 0 0 8px rgba(0,0,0,0.3), 2px 0 10px rgba(0,0,0,0.15);
        }
        .travel-hero-scroll-bar.left {
          left: 0; border-radius: 0 6px 6px 0;
        }
        .travel-hero-scroll-bar.right {
          right: 0; border-radius: 6px 0 0 6px;
          box-shadow: inset 0 0 8px rgba(0,0,0,0.3), -2px 0 10px rgba(0,0,0,0.15);
        }
        .travel-hero-scroll-knob {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 42px; height: 90px; z-index: 6;
          background: linear-gradient(180deg, #6B5344 0%, #8B6F5C 30%, #A08060 50%, #8B6F5C 70%, #6B5344 100%);
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.15);
        }
        .travel-hero-scroll-knob.left { left: -5px; }
        .travel-hero-scroll-knob.right { right: -5px; }
        .travel-hero-content {
          position: relative; z-index: 2; text-align: center;
          padding: 0 60px;
        }
        .travel-back {
          position: absolute; top: 20px; left: 48px; z-index: 10;
          font-size: 14px; color: var(--warm-brown); text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease;
          font-family: var(--font-serif);
        }
        .travel-back:hover { color: var(--ink-blue); }
        .travel-hero-title {
          font-family: var(--font-hand);
          font-size: clamp(40px, 7vw, 64px); font-weight: 400;
          color: var(--ink-blue); margin: 0 0 14px;
          letter-spacing: 0.18em;
          text-shadow: 2px 2px 0 rgba(200,180,140,0.35), 0 4px 16px rgba(60,40,20,0.12);
          animation: heroTitleIn 1.2s var(--ease-smooth) both;
        }
        @keyframes heroTitleIn {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .travel-hero-sub {
          font-family: var(--font-serif);
          font-size: 16px; color: #8B7D6B; margin: 0;
          letter-spacing: 0.15em;
          animation: heroSubIn 1s 0.3s var(--ease-smooth) both;
        }
        @keyframes heroSubIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .travel-hero-stamp {
          display: inline-flex; align-items: center; justify-content: center;
          margin-top: 28px; width: 80px; height: 80px;
          border-radius: 50%; border: 3px solid var(--gold-accent);
          background: linear-gradient(145deg, #F5E6D0 0%, #E8D5BE 100%);
          color: var(--pine-green);
          font-family: var(--font-hand); font-size: 14px;
          letter-spacing: 0.06em; line-height: 1.3;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(200,146,74,0.25), inset 0 1px 2px rgba(255,255,255,0.5);
          transition: transform 0.35s var(--ease-bounce), box-shadow 0.3s ease;
          animation: stampAppear 0.8s 0.6s var(--ease-bounce) both;
          position: relative;
        }
        .travel-hero-stamp::before {
          content: ""; position: absolute; inset: -7px;
          border-radius: 50%; border: 1px dashed var(--gold-accent);
          opacity: 0.35;
        }
        .travel-hero-stamp:hover {
          transform: scale(1.1) rotate(-5deg);
          box-shadow: 0 8px 24px rgba(200,146,74,0.35);
        }
        @keyframes stampAppear {
          from { opacity: 0; transform: scale(0.4) rotate(20deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        /* ===== Section 标题 ===== */
        .travel-section { max-width: 960px; margin: 0 auto; padding: 56px 24px; }
        .travel-section-head { display: flex; align-items: center; gap: 14px; margin-bottom: 32px; }
        .travel-stamp {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 3px 14px; border: 2px solid var(--gold-accent); border-radius: 4px;
          font-size: 13px; font-weight: 700; color: var(--gold-accent);
          font-family: var(--font-hand);
          transform: rotate(-3deg); opacity: 0.85;
          letter-spacing: 0.06em;
        }
        .travel-section-title {
          font-family: var(--font-hand);
          font-size: 30px; font-weight: 400; color: var(--ink-blue); margin: 0;
          letter-spacing: 0.1em;
        }

        /* ===== 地图 — 被施法的藏宝图 ===== */
        .travel-map-wrap {
          position: relative;
          background: linear-gradient(145deg, #F8F4EC 0%, #F0EBE0 100%);
          border: 3px solid #C8B898;
          border-radius: 8px;
          padding: 12px;
          box-shadow:
            0 12px 40px -8px rgba(60,40,20,0.25),
            0 2px 6px rgba(60,40,20,0.1),
            inset 0 0 60px rgba(200,180,140,0.15);
          transform: perspective(800px) rotateX(1deg);
          animation: mapUnroll 1.4s var(--ease-smooth) both;
        }
        @keyframes mapUnroll {
          from { opacity: 0; transform: perspective(800px) rotateX(8deg) scaleY(0.7); }
          to { opacity: 1; transform: perspective(800px) rotateX(1deg) scaleY(1); }
        }
        /* 地图钉装饰 */
        .travel-map-pin {
          position: absolute; width: 14px; height: 14px; z-index: 5;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #D4A85A, #A07840);
          box-shadow: 0 2px 4px rgba(0,0,0,0.25), inset 0 -1px 2px rgba(0,0,0,0.15);
        }
        .travel-map-pin.tl { top: 6px; left: 6px; }
        .travel-map-pin.tr { top: 6px; right: 6px; }
        .travel-map-pin.bl { bottom: 6px; left: 6px; }
        .travel-map-pin.br { bottom: 6px; right: 6px; }
        .travel-map-pin::after {
          content: ""; position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(255,255,255,0.5);
        }
        .travel-map-bg {
          position: relative; width: 100%;
          padding-top: 69.23%;
          background-size: cover; background-position: center;
          background-repeat: no-repeat;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: inset 0 0 20px rgba(100,80,50,0.1);
        }
        .travel-map-overlay {
          position: absolute; inset: 0; width: 100%; height: 100%;
          display: block;
        }
        .travel-province-area {
          cursor: pointer;
          transition: stroke-width 0.25s ease, filter 0.3s ease, fill 0.3s ease;
          touch-action: manipulation;
        }
        .travel-province-area:hover {
          filter: drop-shadow(0 0 6px rgba(168,130,78,0.5)) brightness(1.05);
          stroke-width: 2.2 !important;
        }
        /* 省份描线描绘动画 */
        @keyframes provinceDraw {
          from { stroke-dashoffset: 800; }
          to { stroke-dashoffset: 0; }
        }
        .travel-map-overlay path {
          stroke-dasharray: 800;
          stroke-dashoffset: 800;
          animation: provinceDraw 2s var(--ease-smooth) forwards;
        }
        /* 已访问省份图章标记：轻微呼吸动画 */
        @keyframes visitedPulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .travel-visited-mark circle:first-child {
          transform-origin: center;
          transform-box: fill-box;
          animation: visitedPulse 3s var(--ease-smooth) infinite;
        }
        .travel-tooltip {
          position: absolute; z-index: 20; pointer-events: none;
          padding: 8px 14px; border-radius: 8px;
          background: var(--ink-blue); color: var(--soft-cream);
          font-family: var(--font-serif); font-size: 13px;
          white-space: nowrap; transform: translate(-50%, -140%);
          box-shadow: 0 6px 20px -4px rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .travel-tooltip::after {
          content: ""; position: absolute; bottom: -5px; left: 50%;
          transform: translateX(-50%);
          width: 0; height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid var(--ink-blue);
        }

        /* 迷你放大镜（南海诸岛） */
        .travel-mini-map {
          position: absolute; bottom: 20px; right: 20px;
          width: 100px; height: 72px;
          background: rgba(255,252,245,0.92);
          border: 2px solid #C8B898;
          border-radius: 50%;
          box-shadow: 0 4px 16px rgba(60,40,20,0.2), inset 0 0 20px rgba(200,180,140,0.1);
          display: flex; align-items: center; justify-content: center;
          z-index: 5;
          overflow: hidden;
        }
        .travel-mini-map::before {
          content: "🔍";
          font-size: 20px;
          opacity: 0.3;
          position: absolute;
        }
        .travel-mini-map svg {
          width: 80%; height: 80%;
          opacity: 0.7;
        }

        .travel-legend {
          display: flex; justify-content: center; gap: 24px; margin-top: 16px;
        }
        .travel-legend-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; color: #8B7D6B;
          font-family: var(--font-serif);
        }
        .travel-legend-tip {
          font-size: 11px; color: #B8A898; font-style: italic;
          letter-spacing: 0.04em; font-family: var(--font-serif);
        }
        .travel-legend-dot { width: 12px; height: 12px; border-radius: 3px; }

        /* ===== 木质告示牌统计 ===== */
        .travel-wood-sign {
          position: relative;
          max-width: 480px; margin: 28px auto 0;
          padding: 20px 32px;
          background: linear-gradient(180deg, #8B6914 0%, #7A5C10 50%, #6B4F0C 100%);
          border-radius: 8px;
          box-shadow:
            0 6px 20px -4px rgba(60,40,10,0.35),
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -2px 0 rgba(0,0,0,0.2);
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
          animation: signAppear 1s 0.8s var(--ease-smooth) both;
        }
        .travel-wood-sign::before {
          content: ""; position: absolute; top: -6px; left: 24px;
          width: 8px; height: 14px;
          background: linear-gradient(180deg, #A08060, #6B5344);
          border-radius: 2px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .travel-wood-sign::after {
          content: ""; position: absolute; top: -6px; right: 24px;
          width: 8px; height: 14px;
          background: linear-gradient(180deg, #A08060, #6B5344);
          border-radius: 2px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        @keyframes signAppear {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .travel-wood-sign-text {
          font-family: var(--font-hand);
          font-size: 20px; color: #F5E6D0;
          letter-spacing: 0.1em;
          text-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }
        .travel-wood-sign-num {
          font-family: var(--font-hand);
          font-size: 36px; color: #FFE4A0;
          text-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .travel-wood-sign-divider {
          width: 1px; height: 36px;
          background: rgba(255,255,255,0.15);
        }

        /* ===== 地球小伙伴 ===== */
        .travel-earth-pal {
          width: 56px; height: 56px;
          position: relative;
          animation: earthFloat 3s ease-in-out infinite;
        }
        @keyframes earthFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(3deg); }
        }
        .travel-earth-pal-face {
          position: absolute; inset: 0;
          border-radius: 50%;
          background: linear-gradient(145deg, #4A90D9 0%, #2E8B57 40%, #4A90D9 100%);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(0,0,0,0.15);
          overflow: hidden;
        }
        .travel-earth-pal-face::before {
          content: "";
          position: absolute; top: 20%; left: 15%;
          width: 70%; height: 40%;
          background: linear-gradient(180deg, rgba(255,255,255,0.15), transparent);
          border-radius: 50%;
        }
        .travel-earth-pal-eyes {
          position: absolute; top: 38%; left: 50%; transform: translateX(-50%);
          display: flex; gap: 10px;
        }
        .travel-earth-pal-eye {
          width: 7px; height: 9px;
          background: #2C3E50;
          border-radius: 50%;
          animation: earthBlink 4s ease-in-out infinite;
        }
        @keyframes earthBlink {
          0%, 96%, 100% { transform: scaleY(1); }
          98% { transform: scaleY(0.1); }
        }
        .travel-earth-pal-smile {
          position: absolute; bottom: 28%; left: 50%; transform: translateX(-50%);
          width: 14px; height: 6px;
          border-bottom: 2px solid #2C3E50;
          border-radius: 0 0 14px 14px;
        }
        .travel-earth-pal-blush {
          position: absolute; top: 48%; width: 8px; height: 5px;
          background: rgba(255,150,150,0.35);
          border-radius: 50%;
        }
        .travel-earth-pal-blush.left { left: 18%; }
        .travel-earth-pal-blush.right { right: 18%; }

        /* ===== FAB 魔法笔按钮 ===== */
        .travel-fab {
          position: fixed; bottom: 28px; right: 28px; z-index: 100;
          width: 56px; height: 56px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(145deg, var(--pine-green) 0%, var(--pine-green-dark) 100%);
          color: #fff;
          font-size: 24px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(46,139,87,0.4), 0 2px 6px rgba(0,0,0,0.15);
          transition: transform 0.3s var(--ease-bounce), box-shadow 0.3s ease;
        }
        .travel-fab:hover {
          transform: scale(1.12) rotate(-8deg);
          box-shadow: 0 10px 30px rgba(46,139,87,0.5);
        }
        .travel-fab:active { transform: scale(0.95); }
        @media (max-width: 640px) {
          .travel-fab { bottom: 20px; right: 20px; width: 50px; height: 50px; font-size: 20px; }
        }

        /* ===== 城市卡片 — 冒险家的拍立得笔记 ===== */
        .travel-cards-scroll {
          overflow-x: auto; scrollbar-width: thin; scrollbar-color: var(--gold-accent) transparent;
          -webkit-overflow-scrolling: touch;
        }
        .travel-cards-scroll::-webkit-scrollbar { height: 6px; }
        .travel-cards-scroll::-webkit-scrollbar-thumb { background: rgba(200,146,74,0.35); border-radius: 3px; }
        .travel-cards-track {
          display: flex; gap: 24px; padding: 12px 4px 28px;
          scroll-snap-type: x mandatory;
        }
        .travel-city-card {
          position: relative;
          flex-shrink: 0; width: 260px; scroll-snap-align: start;
          background: #fff;
          padding: 12px 12px 16px;
          box-shadow: 0 8px 24px -6px rgba(60,40,20,0.18);
          transition: transform 0.35s var(--ease-bounce), box-shadow 0.3s ease;
          animation: cardFlyIn 0.7s var(--ease-smooth) both;
          /* 拍立得微微旋转 */
          transform: rotate(-1deg);
        }
        .travel-city-card:nth-child(even) { transform: rotate(1.5deg); animation-delay: 0.1s; }
        .travel-city-card:nth-child(3n) { animation-delay: 0.2s; }
        @keyframes cardFlyIn {
          from { opacity: 0; transform: translateY(30px) rotate(-4deg) scale(0.92); }
          to { opacity: 1; transform: translateY(0) rotate(-1deg) scale(1); }
        }
        .travel-city-card:hover {
          transform: rotate(0deg) translateY(-6px) scale(1.02);
          box-shadow: 0 16px 40px -8px rgba(60,40,20,0.28);
          z-index: 2;
        }
        .travel-city-card:nth-child(even):hover {
          transform: rotate(0deg) translateY(-6px) scale(1.02);
        }
        @media (max-width: 640px) { .travel-city-card { width: 78vw; } }

        .travel-card-main {
          width: 100%; border: none; background: none; padding: 0;
          text-align: left; display: block;
        }
        /* 撕纸边缘效果 */
        .travel-card-img-wrap {
          position: relative; height: 170px; overflow: hidden;
          background: #f0ebe0;
          clip-path: polygon(
            0% 2%, 3% 0%, 7% 1%, 12% 0%, 18% 2%, 25% 0%, 32% 1%, 40% 0%,
            48% 2%, 55% 0%, 62% 1%, 70% 0%, 78% 2%, 85% 0%, 92% 1%, 100% 0%,
            100% 98%, 96% 100%, 90% 99%, 83% 100%, 75% 98%, 68% 100%, 60% 99%,
            52% 100%, 45% 98%, 38% 100%, 30% 99%, 22% 100%, 15% 98%, 8% 100%, 0% 99%
          );
        }
        .travel-card-img-wrap img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          filter: sepia(0.08) saturate(0.92) contrast(1.02);
        }
        /* 胶带装饰 */
        .travel-card-tape {
          position: absolute; top: -6px; left: 50%; transform: translateX(-50%) rotate(-3deg);
          width: 64px; height: 20px;
          background: rgba(255,235,180,0.65);
          box-shadow: 0 1px 4px rgba(0,0,0,0.12);
          border: 1px dashed rgba(200,170,100,0.3);
        }
        .travel-card-days {
          position: absolute; bottom: 10px; right: 10px;
          padding: 3px 10px;
          font-size: 11px; color: #fff;
          background: var(--pine-green);
          font-family: var(--font-hand);
          letter-spacing: 0.06em;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .travel-card-body { padding: 14px 4px 6px; }
        .travel-card-name {
          font-family: var(--font-hand);
          font-size: 22px; font-weight: 400; color: var(--ink-blue); margin: 0 0 4px;
          letter-spacing: 0.06em;
        }
        .travel-card-slogan {
          font-family: var(--font-serif);
          font-size: 12px; color: #8B7D6B; margin: 0 0 10px;
          font-style: italic;
        }
        .travel-card-meta {
          display: flex; align-items: center; justify-content: space-between;
          border-top: 1px dashed #D8D0C0;
          padding-top: 8px; margin-top: 6px;
        }
        .travel-card-mood {
          display: flex; gap: 2px; font-size: 13px;
        }
        .travel-card-mood-star { color: #D4A85A; }
        .travel-card-mood-star.empty { color: #DDD4C6; }
        .travel-card-province {
          font-size: 10px; color: var(--gold-accent);
          letter-spacing: 0.12em; font-family: var(--font-serif);
        }
        .travel-card-cta {
          display: block; padding: 10px 4px 4px;
          font-size: 12px; color: var(--pine-green);
          font-weight: 600; letter-spacing: 0.04em;
          font-family: var(--font-serif);
          transition: color 0.2s ease;
        }
        .travel-card-cta:hover { color: var(--pine-green-dark); }

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

        /* ===== 页脚 ===== */
        .travel-foot {
          text-align: center; padding: 32px 24px 80px;
          font-size: 13px; color: #B0A090;
          font-family: var(--font-serif);
          font-style: italic; letter-spacing: 0.08em;
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
