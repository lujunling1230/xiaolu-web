import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ============================================================
   数据类型（与主页面保持一致）
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
  images: string[];
  days: number;
  play: Spot[];
  eat: Eat[];
  stay: string;
  tips: string;
  /** 是否为 AI 计划 */
  isAIPlan?: boolean;
  /** 天气标签 */
  weather?: string[];
  /** 经纬度 */
  lat?: number;
  lng?: number;
  /** 探索次数 */
  exploreCount?: number;
  /** AI 计划备注 */
  aiPlanNote?: string;
  /** 手动笔记/旅行日记 */
  diary?: string;
}

/* ============================================================
   城市 -> 省份映射字典
   ============================================================ */
const cityToProvince: Record<string, string> = {
  "北京": "北京", "北京市": "北京",
  "天津": "天津", "天津市": "天津",
  "上海": "上海", "上海市": "上海",
  "重庆": "重庆", "重庆市": "重庆",
  "石家庄": "河北", "唐山": "河北", "秦皇岛": "河北", "邯郸": "河北", "邢台": "河北",
  "保定": "河北", "张家口": "河北", "承德": "河北", "沧州": "河北", "廊坊": "河北", "衡水": "河北",
  "太原": "山西", "大同": "山西", "阳泉": "山西", "长治": "山西", "晋城": "山西",
  "朔州": "山西", "晋中": "山西", "运城": "山西", "忻州": "山西", "临汾": "山西", "吕梁": "山西",
  "呼和浩特": "内蒙古", "包头": "内蒙古", "乌海": "内蒙古", "赤峰": "内蒙古", "通辽": "内蒙古",
  "鄂尔多斯": "内蒙古", "呼伦贝尔": "内蒙古", "巴彦淖尔": "内蒙古", "乌兰察布": "内蒙古",
  "兴安盟": "内蒙古", "锡林郭勒盟": "内蒙古", "阿拉善盟": "内蒙古",
  "沈阳": "辽宁", "大连": "辽宁", "鞍山": "辽宁", "抚顺": "辽宁", "本溪": "辽宁",
  "丹东": "辽宁", "锦州": "辽宁", "营口": "辽宁", "阜新": "辽宁", "辽阳": "辽宁",
  "盘锦": "辽宁", "铁岭": "辽宁", "朝阳": "辽宁", "葫芦岛": "辽宁",
  "长春": "吉林", "吉林": "吉林", "四平": "吉林", "辽源": "吉林", "通化": "吉林",
  "白山": "吉林", "松原": "吉林", "白城": "吉林", "延边": "吉林", "延边朝鲜族自治州": "吉林",
  "哈尔滨": "黑龙江", "齐齐哈尔": "黑龙江", "鸡西": "黑龙江", "鹤岗": "黑龙江", "双鸭山": "黑龙江",
  "大庆": "黑龙江", "伊春": "黑龙江", "佳木斯": "黑龙江", "七台河": "黑龙江", "牡丹江": "黑龙江",
  "黑河": "黑龙江", "绥化": "黑龙江", "大兴安岭": "黑龙江", "大兴安岭地区": "黑龙江",
  "南京": "江苏", "无锡": "江苏", "徐州": "江苏", "常州": "江苏", "苏州": "江苏",
  "南通": "江苏", "连云港": "江苏", "淮安": "江苏", "盐城": "江苏", "扬州": "江苏",
  "镇江": "江苏", "泰州": "江苏", "宿迁": "江苏",
  "杭州": "浙江", "宁波": "浙江", "温州": "浙江", "嘉兴": "浙江", "湖州": "浙江",
  "绍兴": "浙江", "金华": "浙江", "衢州": "浙江", "舟山": "浙江", "台州": "浙江", "丽水": "浙江",
  "合肥": "安徽", "芜湖": "安徽", "蚌埠": "安徽", "淮南": "安徽", "马鞍山": "安徽",
  "淮北": "安徽", "铜陵": "安徽", "安庆": "安徽", "黄山": "安徽", "滁州": "安徽",
  "阜阳": "安徽", "宿州": "安徽", "六安": "安徽", "亳州": "安徽", "池州": "安徽", "宣城": "安徽",
  "福州": "福建", "厦门": "福建", "莆田": "福建", "三明": "福建", "泉州": "福建",
  "漳州": "福建", "南平": "福建", "龙岩": "福建", "宁德": "福建",
  "南昌": "江西", "景德镇": "江西", "萍乡": "江西", "九江": "江西", "新余": "江西",
  "鹰潭": "江西", "赣州": "江西", "吉安": "江西", "宜春": "江西", "抚州": "江西", "上饶": "江西",
  "济南": "山东", "青岛": "山东", "淄博": "山东", "枣庄": "山东", "东营": "山东",
  "烟台": "山东", "潍坊": "山东", "济宁": "山东", "泰安": "山东", "威海": "山东",
  "日照": "山东", "莱芜": "山东", "临沂": "山东", "德州": "山东", "聊城": "山东",
  "滨州": "山东", "菏泽": "山东",
  "郑州": "河南", "开封": "河南", "洛阳": "河南", "平顶山": "河南", "安阳": "河南",
  "鹤壁": "河南", "新乡": "河南", "焦作": "河南", "濮阳": "河南", "许昌": "河南",
  "漯河": "河南", "三门峡": "河南", "南阳": "河南", "商丘": "河南", "信阳": "河南",
  "周口": "河南", "驻马店": "河南", "济源": "河南",
  "武汉": "湖北", "黄石": "湖北", "十堰": "湖北", "宜昌": "湖北", "襄阳": "湖北",
  "鄂州": "湖北", "荆门": "湖北", "孝感": "湖北", "荆州": "湖北", "黄冈": "湖北",
  "咸宁": "湖北", "随州": "湖北", "恩施": "湖北", "恩施土家族苗族自治州": "湖北",
  "仙桃": "湖北", "潜江": "湖北", "天门": "湖北", "神农架": "湖北", "神农架林区": "湖北",
  "长沙": "湖南", "株洲": "湖南", "湘潭": "湖南", "衡阳": "湖南", "邵阳": "湖南",
  "岳阳": "湖南", "常德": "湖南", "张家界": "湖南", "益阳": "湖南", "郴州": "湖南",
  "永州": "湖南", "怀化": "湖南", "娄底": "湖南", "湘西": "湖南", "湘西土家族苗族自治州": "湖南",
  "广州": "广东", "韶关": "广东", "深圳": "广东", "珠海": "广东", "汕头": "广东",
  "佛山": "广东", "湛江": "广东", "肇庆": "广东", "江门": "广东", "茂名": "广东",
  "惠州": "广东", "梅州": "广东", "汕尾": "广东", "河源": "广东", "阳江": "广东",
  "清远": "广东", "东莞": "广东", "中山": "广东", "潮州": "广东", "揭阳": "广东", "云浮": "广东",
  "南宁": "广西", "柳州": "广西", "桂林": "广西", "梧州": "广西", "北海": "广西",
  "防城港": "广西", "钦州": "广西", "贵港": "广西", "玉林": "广西", "百色": "广西",
  "贺州": "广西", "河池": "广西", "来宾": "广西", "崇左": "广西",
  "海口": "海南", "三亚": "海南", "三沙": "海南", "儋州": "海南", "五指山": "海南",
  "琼海": "海南", "文昌": "海南", "万宁": "海南", "东方": "海南",
  "成都": "四川", "自贡": "四川", "攀枝花": "四川", "泸州": "四川", "德阳": "四川",
  "绵阳": "四川", "广元": "四川", "遂宁": "四川", "内江": "四川", "乐山": "四川",
  "南充": "四川", "眉山": "四川", "宜宾": "四川", "广安": "四川", "达州": "四川",
  "雅安": "四川", "巴中": "四川", "资阳": "四川", "阿坝": "四川", "甘孜": "四川", "凉山": "四川",
  "贵阳": "贵州", "六盘水": "贵州", "遵义": "贵州", "安顺": "贵州", "毕节": "贵州",
  "铜仁": "贵州", "黔西南": "贵州", "黔西南布依族苗族自治州": "贵州",
  "黔东南": "贵州", "黔东南苗族侗族自治州": "贵州",
  "黔南": "贵州", "黔南布依族苗族自治州": "贵州",
  "昆明": "云南", "曲靖": "云南", "玉溪": "云南", "保山": "云南", "昭通": "云南",
  "丽江": "云南", "普洱": "云南", "临沧": "云南", "楚雄": "云南",
  "红河": "云南", "文山": "云南", "西双版纳": "云南", "大理": "云南",
  "德宏": "云南", "怒江": "云南", "迪庆": "云南",
  "拉萨": "西藏", "日喀则": "西藏", "昌都": "西藏", "林芝": "西藏", "山南": "西藏",
  "那曲": "西藏", "阿里": "西藏",
  "西安": "陕西", "铜川": "陕西", "宝鸡": "陕西", "咸阳": "陕西", "渭南": "陕西",
  "延安": "陕西", "汉中": "陕西", "榆林": "陕西", "安康": "陕西", "商洛": "陕西",
  "兰州": "甘肃", "嘉峪关": "甘肃", "金昌": "甘肃", "白银": "甘肃", "天水": "甘肃",
  "武威": "甘肃", "张掖": "甘肃", "平凉": "甘肃", "酒泉": "甘肃", "庆阳": "甘肃",
  "定西": "甘肃", "陇南": "甘肃", "临夏": "甘肃", "甘南": "甘肃",
  "西宁": "青海", "海东": "青海", "海北": "青海", "黄南": "青海",
  "海南州": "青海", "海南藏族自治州": "青海",
  "果洛": "青海", "玉树": "青海", "海西": "青海",
  "银川": "宁夏", "石嘴山": "宁夏", "吴忠": "宁夏", "固原": "宁夏", "中卫": "宁夏",
  "乌鲁木齐": "新疆", "克拉玛依": "新疆", "吐鲁番": "新疆", "哈密": "新疆",
  "昌吉": "新疆", "博尔塔拉": "新疆", "巴音郭楞": "新疆", "阿克苏": "新疆", "克孜勒苏": "新疆",
  "喀什": "新疆", "和田": "新疆", "伊犁": "新疆", "塔城": "新疆", "阿勒泰": "新疆",
  "台北": "台湾", "新北": "台湾", "桃园": "台湾", "台中": "台湾", "台南": "台湾", "高雄": "台湾",
  "香港": "香港",
  "澳门": "澳门",
};

function getProvinceByCity(cityName: string): string | null {
  return cityToProvince[cityName] || null;
}

/* 常用城市坐标字典（自动填充，无需用户手动输入） */
const cityCoords: Record<string, { lng: number; lat: number }> = {
  "北京": { lng: 116.407, lat: 39.904 }, "上海": { lng: 121.473, lat: 31.230 },
  "广州": { lng: 113.264, lat: 23.129 }, "深圳": { lng: 114.057, lat: 22.543 },
  "杭州": { lng: 120.155, lat: 30.274 }, "南京": { lng: 118.796, lat: 32.060 },
  "成都": { lng: 104.066, lat: 30.572 }, "重庆": { lng: 106.504, lat: 29.533 },
  "西安": { lng: 108.939, lat: 34.341 }, "武汉": { lng: 114.305, lat: 30.592 },
  "长沙": { lng: 112.938, lat: 28.228 }, "厦门": { lng: 118.089, lat: 24.479 },
  "青岛": { lng: 120.382, lat: 36.067 }, "大连": { lng: 121.614, lat: 38.914 },
  "昆明": { lng: 102.832, lat: 24.880 }, "大理": { lng: 100.229, lat: 25.589 },
  "丽江": { lng: 100.233, lat: 26.872 }, "拉萨": { lng: 91.140, lat: 29.650 },
  "乌鲁木齐": { lng: 87.616, lat: 43.825 }, "哈尔滨": { lng: 126.534, lat: 45.803 },
  "沈阳": { lng: 123.431, lat: 41.796 }, "济南": { lng: 117.000, lat: 36.675 },
  "郑州": { lng: 113.625, lat: 34.746 }, "合肥": { lng: 117.227, lat: 31.820 },
  "南昌": { lng: 115.857, lat: 28.682 }, "福州": { lng: 119.296, lat: 26.074 },
  "贵阳": { lng: 106.630, lat: 26.647 }, "南宁": { lng: 108.366, lat: 22.817 },
  "海口": { lng: 110.349, lat: 20.044 }, "兰州": { lng: 103.834, lat: 36.061 },
  "西宁": { lng: 101.778, lat: 36.617 }, "银川": { lng: 106.230, lat: 38.487 },
  "太原": { lng: 112.548, lat: 37.870 }, "石家庄": { lng: 114.514, lat: 38.042 },
  "长春": { lng: 125.323, lat: 43.817 }, "呼和浩特": { lng: 111.749, lat: 40.841 },
  "苏州": { lng: 120.585, lat: 31.298 }, "宁波": { lng: 121.550, lat: 29.874 },
  "无锡": { lng: 120.311, lat: 31.491 }, "佛山": { lng: 113.121, lat: 23.021 },
  "东莞": { lng: 113.751, lat: 23.020 }, "珠海": { lng: 113.576, lat: 22.271 },
  "三亚": { lng: 109.512, lat: 18.252 }, "桂林": { lng: 110.179, lat: 25.234 },
  "张家界": { lng: 110.479, lat: 29.117 }, "黄山": { lng: 118.167, lat: 30.143 },
  "洛阳": { lng: 112.434, lat: 34.618 }, "开封": { lng: 114.307, lat: 34.797 },
  "扬州": { lng: 119.421, lat: 32.393 }, "镇江": { lng: 119.452, lat: 32.204 },
  "威海": { lng: 122.120, lat: 37.513 }, "烟台": { lng: 121.447, lat: 37.463 },
  "泉州": { lng: 118.675, lat: 24.874 }, "漳州": { lng: 117.661, lat: 24.511 },
  "潮州": { lng: 116.632, lat: 23.656 }, "汕头": { lng: 116.708, lat: 23.353 },
  "北海": { lng: 109.120, lat: 21.481 }, "桂林": { lng: 110.179, lat: 25.234 },
  "西双版纳": { lng: 100.796, lat: 22.009 }, "香格里拉": { lng: 99.706, lat: 27.829 },
  "敦煌": { lng: 94.661, lat: 40.142 }, "张掖": { lng: 100.449, lat: 38.925 },
  "青海湖": { lng: 100.197, lat: 36.488 }, "喀纳斯": { lng: 87.034, lat: 48.514 },
  "伊犁": { lng: 81.324, lat: 43.916 }, "呼伦贝尔": { lng: 119.765, lat: 49.215 },
  "阿尔山": { lng: 119.943, lat: 47.177 }, "漠河": { lng: 122.538, lat: 52.972 },
  "雪乡": { lng: 128.198, lat: 44.333 }, "长白山": { lng: 128.058, lat: 42.041 },
  "凤凰": { lng: 109.599, lat: 27.948 }, "婺源": { lng: 117.861, lat: 29.248 },
  "乌镇": { lng: 120.485, lat: 30.745 }, "西塘": { lng: 120.889, lat: 30.946 },
  "平遥": { lng: 112.176, lat: 37.205 }, "宏村": { lng: 117.987, lat: 30.004 },
  "周庄": { lng: 120.845, lat: 31.117 }, "同里": { lng: 120.716, lat: 31.159 },
  /* 河南 */
  "安阳": { lng: 114.393, lat: 36.099 }, "新乡": { lng: 113.926, lat: 35.304 },
  "濮阳": { lng: 115.029, lat: 35.762 }, "焦作": { lng: 113.242, lat: 35.216 },
  "许昌": { lng: 113.852, lat: 34.037 }, "漯河": { lng: 114.016, lat: 33.582 },
  "三门峡": { lng: 111.200, lat: 34.773 }, "南阳": { lng: 112.528, lat: 33.001 },
  "商丘": { lng: 115.656, lat: 34.414 }, "信阳": { lng: 114.091, lat: 32.147 },
  "周口": { lng: 114.697, lat: 33.626 }, "驻马店": { lng: 114.022, lat: 33.012 },
  "鹤壁": { lng: 114.298, lat: 35.748 }, "平顶山": { lng: 113.192, lat: 33.766 },
  /* 河北 */
  "唐山": { lng: 118.180, lat: 39.629 }, "邯郸": { lng: 114.490, lat: 36.612 },
  "保定": { lng: 115.464, lat: 38.874 }, "秦皇岛": { lng: 119.600, lat: 39.935 },
  "张家口": { lng: 114.887, lat: 40.767 }, "承德": { lng: 117.932, lat: 40.951 },
  "廊坊": { lng: 116.683, lat: 39.538 }, "沧州": { lng: 116.838, lat: 38.304 },
  "衡水": { lng: 115.686, lat: 37.739 }, "邢台": { lng: 114.504, lat: 37.066 },
  /* 山东 */
  "淄博": { lng: 118.055, lat: 36.813 }, "枣庄": { lng: 117.323, lat: 34.811 },
  "东营": { lng: 118.674, lat: 37.434 }, "潍坊": { lng: 119.161, lat: 36.707 },
  "济宁": { lng: 116.396, lat: 35.415 }, "泰安": { lng: 117.087, lat: 36.200 },
  "日照": { lng: 119.526, lat: 35.416 }, "临沂": { lng: 118.326, lat: 35.065 },
  "德州": { lng: 116.359, lat: 37.431 }, "聊城": { lng: 115.980, lat: 36.457 },
  "滨州": { lng: 117.970, lat: 37.382 }, "菏泽": { lng: 115.481, lat: 35.234 },
  /* 江苏 */
  "徐州": { lng: 117.284, lat: 34.205 }, "常州": { lng: 119.974, lat: 31.811 },
  "南通": { lng: 120.894, lat: 31.981 }, "连云港": { lng: 119.222, lat: 34.600 },
  "淮安": { lng: 119.015, lat: 33.610 }, "盐城": { lng: 120.163, lat: 33.377 },
  "扬州": { lng: 119.421, lat: 32.393 }, "镇江": { lng: 119.452, lat: 32.204 },
  "泰州": { lng: 119.923, lat: 32.455 }, "宿迁": { lng: 118.275, lat: 33.963 },
  /* 浙江 */
  "温州": { lng: 120.699, lat: 27.994 }, "嘉兴": { lng: 120.755, lat: 30.745 },
  "湖州": { lng: 120.086, lat: 30.894 }, "绍兴": { lng: 120.580, lat: 30.001 },
  "金华": { lng: 119.649, lat: 29.110 }, "衢州": { lng: 118.873, lat: 28.971 },
  "舟山": { lng: 122.207, lat: 29.985 }, "台州": { lng: 121.421, lat: 28.656 },
  "丽水": { lng: 119.922, lat: 28.468 },
  /* 广东 */
  "韶关": { lng: 113.597, lat: 24.811 }, "汕头": { lng: 116.708, lat: 23.353 },
  "江门": { lng: 113.081, lat: 22.579 }, "湛江": { lng: 110.359, lat: 21.270 },
  "茂名": { lng: 110.919, lat: 21.659 }, "肇庆": { lng: 112.465, lat: 23.047 },
  "惠州": { lng: 114.416, lat: 23.112 }, "梅州": { lng: 116.118, lat: 24.299 },
  "汕尾": { lng: 115.375, lat: 22.786 }, "河源": { lng: 114.698, lat: 23.744 },
  "阳江": { lng: 111.982, lat: 21.859 }, "清远": { lng: 113.056, lat: 23.682 },
  "中山": { lng: 113.392, lat: 22.517 }, "潮州": { lng: 116.632, lat: 23.656 },
  "揭阳": { lng: 116.373, lat: 23.550 }, "云浮": { lng: 112.044, lat: 22.915 },
  /* 福建 */
  "莆田": { lng: 119.007, lat: 25.454 }, "三明": { lng: 117.635, lat: 26.265 },
  "南平": { lng: 118.177, lat: 26.642 }, "龙岩": { lng: 117.030, lat: 25.091 },
  "宁德": { lng: 119.527, lat: 26.666 },
  /* 湖北 */
  "黄石": { lng: 115.039, lat: 30.200 }, "十堰": { lng: 110.798, lat: 32.629 },
  "宜昌": { lng: 111.286, lat: 30.692 }, "襄阳": { lng: 112.122, lat: 32.009 },
  "鄂州": { lng: 114.890, lat: 30.396 }, "荆门": { lng: 112.199, lat: 31.036 },
  "孝感": { lng: 113.910, lat: 30.927 }, "荆州": { lng: 112.238, lat: 30.335 },
  "黄冈": { lng: 114.879, lat: 30.458 }, "咸宁": { lng: 114.323, lat: 29.843 },
  "随州": { lng: 113.373, lat: 31.718 }, "恩施": { lng: 109.488, lat: 30.283 },
  /* 湖南 */
  "株洲": { lng: 113.151, lat: 27.836 }, "湘潭": { lng: 112.944, lat: 27.829 },
  "衡阳": { lng: 112.572, lat: 26.894 }, "邵阳": { lng: 111.469, lat: 27.239 },
  "岳阳": { lng: 113.129, lat: 29.357 }, "常德": { lng: 111.699, lat: 29.032 },
  "张家界": { lng: 110.479, lat: 29.117 }, "益阳": { lng: 112.355, lat: 28.570 },
  "郴州": { lng: 113.015, lat: 25.770 }, "永州": { lng: 111.613, lat: 26.421 },
  "怀化": { lng: 110.002, lat: 27.550 }, "娄底": { lng: 112.008, lat: 27.728 },
  /* 四川 */
  "自贡": { lng: 104.773, lat: 29.353 }, "攀枝花": { lng: 101.716, lat: 26.580 },
  "泸州": { lng: 105.443, lat: 28.889 }, "德阳": { lng: 104.398, lat: 31.128 },
  "绵阳": { lng: 104.682, lat: 31.467 }, "广元": { lng: 105.843, lat: 32.435 },
  "遂宁": { lng: 105.593, lat: 30.533 }, "内江": { lng: 105.066, lat: 29.587 },
  "乐山": { lng: 103.761, lat: 29.582 }, "南充": { lng: 106.110, lat: 30.837 },
  "眉山": { lng: 103.849, lat: 30.075 }, "宜宾": { lng: 104.642, lat: 28.752 },
  "广安": { lng: 106.633, lat: 30.456 }, "达州": { lng: 107.502, lat: 31.209 },
  "雅安": { lng: 103.001, lat: 29.988 }, "巴中": { lng: 106.747, lat: 31.868 },
  "资阳": { lng: 104.627, lat: 30.129 },
  /* 陕西 */
  "铜川": { lng: 108.979, lat: 34.917 }, "宝鸡": { lng: 107.237, lat: 34.363 },
  "咸阳": { lng: 108.708, lat: 34.329 }, "渭南": { lng: 109.493, lat: 34.500 },
  "延安": { lng: 109.489, lat: 36.585 }, "汉中": { lng: 107.023, lat: 33.068 },
  "榆林": { lng: 109.735, lat: 38.285 }, "安康": { lng: 109.029, lat: 32.690 },
  "商洛": { lng: 109.940, lat: 33.870 },
  /* 江西 */
  "景德镇": { lng: 117.207, lat: 29.269 }, "萍乡": { lng: 113.854, lat: 27.622 },
  "九江": { lng: 116.002, lat: 29.705 }, "新余": { lng: 115.058, lat: 27.818 },
  "鹰潭": { lng: 117.034, lat: 28.239 }, "赣州": { lng: 114.935, lat: 25.831 },
  "吉安": { lng: 114.986, lat: 27.112 }, "宜春": { lng: 114.391, lat: 27.810 },
  "抚州": { lng: 116.358, lat: 27.984 }, "上饶": { lng: 117.943, lat: 28.455 },
  /* 山西 */
  "大同": { lng: 113.300, lat: 40.077 }, "阳泉": { lng: 113.580, lat: 37.857 },
  "长治": { lng: 113.117, lat: 36.195 }, "晋城": { lng: 112.851, lat: 35.490 },
  "朔州": { lng: 112.433, lat: 39.331 }, "晋中": { lng: 112.736, lat: 37.687 },
  "运城": { lng: 111.004, lat: 35.026 }, "忻州": { lng: 112.734, lat: 38.417 },
  "临汾": { lng: 111.519, lat: 36.088 }, "吕梁": { lng: 111.143, lat: 37.518 },
  /* 安徽 */
  "芜湖": { lng: 118.433, lat: 31.353 }, "蚌埠": { lng: 117.389, lat: 32.917 },
  "淮南": { lng: 117.016, lat: 32.647 }, "马鞍山": { lng: 118.508, lat: 31.701 },
  "淮北": { lng: 116.798, lat: 33.956 }, "铜陵": { lng: 117.812, lat: 30.945 },
  "安庆": { lng: 117.063, lat: 30.543 }, "黄山": { lng: 118.167, lat: 30.143 },
  "滁州": { lng: 118.316, lat: 32.302 }, "阜阳": { lng: 115.820, lat: 32.890 },
  "宿州": { lng: 116.984, lat: 33.636 }, "六安": { lng: 116.520, lat: 31.733 },
  "亳州": { lng: 115.782, lat: 33.869 }, "池州": { lng: 117.489, lat: 30.656 },
  "宣城": { lng: 118.759, lat: 30.941 },
  /* 辽宁 */
  "鞍山": { lng: 123.000, lat: 41.108 }, "抚顺": { lng: 123.921, lat: 41.876 },
  "本溪": { lng: 123.770, lat: 41.294 }, "丹东": { lng: 124.354, lat: 40.001 },
  "锦州": { lng: 121.126, lat: 41.095 }, "营口": { lng: 122.235, lat: 40.667 },
  "阜新": { lng: 121.648, lat: 42.022 }, "辽阳": { lng: 123.237, lat: 41.268 },
  "盘锦": { lng: 122.070, lat: 41.119 }, "铁岭": { lng: 123.844, lat: 42.286 },
  "朝阳": { lng: 120.452, lat: 41.576 }, "葫芦岛": { lng: 120.836, lat: 40.711 },
  /* 广西 */
  "柳州": { lng: 109.429, lat: 24.326 }, "梧州": { lng: 111.279, lat: 23.477 },
  "北海": { lng: 109.120, lat: 21.481 }, "防城港": { lng: 108.345, lat: 21.614 },
  "钦州": { lng: 108.619, lat: 21.977 }, "贵港": { lng: 109.598, lat: 23.112 },
  "玉林": { lng: 110.154, lat: 22.631 }, "百色": { lng: 106.738, lat: 23.902 },
  "贺州": { lng: 111.567, lat: 24.405 }, "河池": { lng: 108.085, lat: 24.693 },
  "来宾": { lng: 109.230, lat: 23.734 }, "崇左": { lng: 107.365, lat: 22.377 },
  /* 吉林 */
  "吉林": { lng: 126.553, lat: 43.838 }, "四平": { lng: 124.351, lat: 43.170 },
  "辽源": { lng: 125.144, lat: 42.888 }, "通化": { lng: 125.936, lat: 41.721 },
  "白山": { lng: 126.428, lat: 41.942 }, "松原": { lng: 124.825, lat: 45.143 },
  "白城": { lng: 122.839, lat: 45.620 }, "延边": { lng: 129.508, lat: 42.908 },
  /* 黑龙江 */
  "齐齐哈尔": { lng: 123.918, lat: 47.354 }, "鸡西": { lng: 130.975, lat: 45.300 },
  "鹤岗": { lng: 130.277, lat: 47.332 }, "双鸭山": { lng: 131.157, lat: 46.643 },
  "大庆": { lng: 125.103, lat: 46.589 }, "伊春": { lng: 128.841, lat: 47.727 },
  "佳木斯": { lng: 130.361, lat: 46.809 }, "七台河": { lng: 131.016, lat: 45.771 },
  "牡丹江": { lng: 129.618, lat: 44.583 }, "黑河": { lng: 127.499, lat: 50.249 },
  "绥化": { lng: 126.993, lat: 46.637 }, "大兴安岭": { lng: 124.712, lat: 52.335 },
  /* 云南 */
  "曲靖": { lng: 103.797, lat: 25.502 }, "玉溪": { lng: 102.547, lat: 24.352 },
  "保山": { lng: 99.167, lat: 25.112 }, "昭通": { lng: 103.717, lat: 27.338 },
  "丽江": { lng: 100.233, lat: 26.872 }, "普洱": { lng: 100.972, lat: 22.777 },
  "临沧": { lng: 100.086, lat: 23.886 }, "楚雄": { lng: 101.546, lat: 25.040 },
  "红河": { lng: 103.375, lat: 23.367 }, "文山": { lng: 104.215, lat: 23.401 },
  "西双版纳": { lng: 100.796, lat: 22.009 }, "大理": { lng: 100.229, lat: 25.589 },
  "德宏": { lng: 98.578, lat: 24.433 }, "怒江": { lng: 98.854, lat: 25.852 },
  "迪庆": { lng: 99.706, lat: 27.829 },
  /* 贵州 */
  "六盘水": { lng: 104.830, lat: 26.593 }, "遵义": { lng: 106.927, lat: 27.725 },
  "安顺": { lng: 105.932, lat: 26.246 }, "毕节": { lng: 105.285, lat: 27.302 },
  "铜仁": { lng: 109.192, lat: 27.718 }, "黔西南": { lng: 104.897, lat: 25.088 },
  "黔东南": { lng: 107.978, lat: 26.584 }, "黔南": { lng: 107.522, lat: 26.254 },
  /* 海南 */
  "三亚": { lng: 109.512, lat: 18.252 }, "三沙": { lng: 112.338, lat: 16.831 },
  "儋州": { lng: 109.581, lat: 19.522 }, "五指山": { lng: 109.517, lat: 18.775 },
  "琼海": { lng: 110.467, lat: 19.246 }, "文昌": { lng: 110.754, lat: 19.613 },
  "万宁": { lng: 110.389, lat: 18.796 }, "东方": { lng: 108.654, lat: 19.096 },
  "定安": { lng: 110.349, lat: 19.681 }, "屯昌": { lng: 110.103, lat: 19.362 },
  "澄迈": { lng: 110.007, lat: 19.737 }, "临高": { lng: 109.688, lat: 19.908 },
  "白沙": { lng: 109.452, lat: 19.225 }, "昌江": { lng: 109.053, lat: 19.261 },
  "乐东": { lng: 109.175, lat: 18.748 }, "陵水": { lng: 110.037, lat: 18.506 },
  "保亭": { lng: 109.702, lat: 18.639 }, "琼中": { lng: 109.839, lat: 19.035 },
  /* 甘肃 */
  "嘉峪关": { lng: 98.277, lat: 39.786 }, "金昌": { lng: 102.188, lat: 38.520 },
  "白银": { lng: 104.139, lat: 36.545 }, "天水": { lng: 105.725, lat: 34.581 },
  "武威": { lng: 102.634, lat: 37.929 }, "张掖": { lng: 100.449, lat: 38.925 },
  "平凉": { lng: 106.665, lat: 35.543 }, "酒泉": { lng: 98.494, lat: 39.732 },
  "庆阳": { lng: 107.638, lat: 35.734 }, "定西": { lng: 104.626, lat: 35.580 },
  "陇南": { lng: 104.960, lat: 33.401 }, "临夏": { lng: 103.212, lat: 35.601 },
  "甘南": { lng: 102.911, lat: 34.986 },
  /* 青海 */
  "海东": { lng: 102.103, lat: 36.502 }, "海北": { lng: 100.901, lat: 36.954 },
  "黄南": { lng: 102.015, lat: 35.518 }, "海南州": { lng: 100.620, lat: 36.286 },
  "果洛": { lng: 100.239, lat: 34.473 }, "玉树": { lng: 97.009, lat: 33.004 },
  "海西": { lng: 97.371, lat: 37.377 },
  /* 内蒙古 */
  "包头": { lng: 109.840, lat: 40.658 }, "乌海": { lng: 106.794, lat: 39.655 },
  "赤峰": { lng: 118.887, lat: 42.258 }, "通辽": { lng: 122.244, lat: 43.653 },
  "鄂尔多斯": { lng: 109.781, lat: 39.608 }, "呼伦贝尔": { lng: 119.765, lat: 49.215 },
  "巴彦淖尔": { lng: 107.387, lat: 40.743 }, "乌兰察布": { lng: 113.115, lat: 41.034 },
  "兴安": { lng: 122.070, lat: 46.088 }, "锡林郭勒": { lng: 116.048, lat: 43.933 },
  "阿拉善": { lng: 105.706, lat: 38.847 },
  /* 新疆 */
  "克拉玛依": { lng: 84.873, lat: 45.579 }, "吐鲁番": { lng: 89.189, lat: 42.951 },
  "哈密": { lng: 93.515, lat: 42.825 }, "昌吉": { lng: 87.304, lat: 44.014 },
  "博尔塔拉": { lng: 82.067, lat: 44.905 }, "巴音郭楞": { lng: 86.151, lat: 41.768 },
  "阿克苏": { lng: 80.265, lat: 41.171 }, "克孜勒苏": { lng: 76.168, lat: 39.714 },
  "喀什": { lng: 75.989, lat: 39.467 }, "和田": { lng: 79.922, lat: 37.110 },
  "伊犁": { lng: 81.324, lat: 43.916 }, "塔城": { lng: 82.985, lat: 46.746 },
  "阿勒泰": { lng: 88.140, lat: 47.848 }, "石河子": { lng: 86.041, lat: 44.306 },
  /* 西藏 */
  "日喀则": { lng: 88.885, lat: 29.267 }, "昌都": { lng: 97.179, lat: 31.137 },
  "林芝": { lng: 94.361, lat: 29.649 }, "山南": { lng: 91.773, lat: 29.237 },
  "那曲": { lng: 92.052, lat: 31.477 }, "阿里": { lng: 80.106, lat: 32.501 },
};

function getCityCoord(cityName: string): { lng: number; lat: number } | undefined {
  return cityCoords[cityName];
}

/* 省份省会坐标（城市不在字典时的 fallback） */
const provinceCapitals: Record<string, { lng: number; lat: number }> = {
  "北京": { lng: 116.407, lat: 39.904 }, "上海": { lng: 121.473, lat: 31.230 },
  "天津": { lng: 117.200, lat: 39.084 }, "重庆": { lng: 106.504, lat: 29.533 },
  "河北": { lng: 114.514, lat: 38.042 }, "山西": { lng: 112.549, lat: 37.857 },
  "辽宁": { lng: 123.431, lat: 41.796 }, "吉林": { lng: 125.325, lat: 43.886 },
  "黑龙江": { lng: 126.642, lat: 45.756 }, "江苏": { lng: 118.796, lat: 32.060 },
  "浙江": { lng: 120.155, lat: 30.274 }, "安徽": { lng: 117.284, lat: 31.861 },
  "福建": { lng: 119.296, lat: 26.099 }, "江西": { lng: 115.857, lat: 28.682 },
  "山东": { lng: 117.000, lat: 36.675 }, "河南": { lng: 113.625, lat: 34.746 },
  "湖北": { lng: 114.305, lat: 30.592 }, "湖南": { lng: 112.982, lat: 28.194 },
  "广东": { lng: 113.264, lat: 23.129 }, "海南": { lng: 110.349, lat: 20.017 },
  "四川": { lng: 104.066, lat: 30.659 }, "贵州": { lng: 106.630, lat: 26.647 },
  "云南": { lng: 102.712, lat: 25.040 }, "陕西": { lng: 108.939, lat: 34.341 },
  "甘肃": { lng: 103.826, lat: 36.059 }, "青海": { lng: 101.778, lat: 36.623 },
  "台湾": { lng: 121.565, lat: 25.037 }, "内蒙古": { lng: 111.749, lat: 40.842 },
  "广西": { lng: 108.327, lat: 22.815 }, "西藏": { lng: 91.117, lat: 29.646 },
  "宁夏": { lng: 106.278, lat: 38.466 }, "新疆": { lng: 87.617, lat: 43.793 },
  "香港": { lng: 114.171, lat: 22.319 }, "澳门": { lng: 113.549, lat: 22.198 },
};

function getFallbackCoord(province: string): { lng: number; lat: number } {
  const p = province.replace(/省|市|自治区|壮族|回族|维吾尔|特别行政区/g, "").trim();
  return provinceCapitals[p] || provinceCapitals[province.trim()] || { lng: 110.0, lat: 35.0 };
}

/* 空城市模板 */
const BLANK_CITY = (): City => ({
  id: Date.now(),
  name: "",
  province: "",
  slogan: "",
  images: [],
  days: 3,
  play: [{ name: "", rating: 5 }],
  eat: [{ name: "", price: "" }],
  stay: "",
  tips: "",
  diary: "",
});

export interface CityEditModalProps {
  city: City | null;
  open: boolean;
  onClose: () => void;
  onSave: (city: City) => void;
}

export default function CityEditModal({
  city,
  open,
  onClose,
  onSave,
}: CityEditModalProps) {
  const isNew = useMemo(() => {
    if (!city) return true;
    return !city.name;
  }, [city]);

  const [form, setForm] = useState<City>(BLANK_CITY);

  useEffect(() => {
    if (city) {
      setForm({ ...city });
    } else {
      setForm(BLANK_CITY());
    }
  }, [city]);

  // 锁定 Modal 滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  /* 城市名变更时自动推断省份 */
  useEffect(() => {
    const trimmed = form.name.trim();
    if (trimmed) {
      const inferred = getProvinceByCity(trimmed);
      if (inferred && inferred !== form.province) {
        setForm((prev) => ({ ...prev, province: inferred }));
      }
    }
  }, [form.name]);

  /* 字段更新 */
  const updateField = <K extends keyof City>(key: K, value: City[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* 图片删除 */
  const removeImage = (idx: number) => {
    setForm((prev) => {
      const list = [...(prev.images || [])];
      list.splice(idx, 1);
      return { ...prev, images: list };
    });
  };

  /* Play 列表编辑 */
  const updatePlay = (idx: number, field: keyof Spot, value: string | number) => {
    setForm((prev) => {
      const list = [...prev.play];
      list[idx] = { ...list[idx], [field]: value } as Spot;
      return { ...prev, play: list };
    });
  };
  const addPlay = () => {
    setForm((prev) => ({
      ...prev,
      play: [...prev.play, { name: "", rating: 5 }],
    }));
  };
  const removePlay = (idx: number) => {
    setForm((prev) => {
      const list = prev.play.filter((_, i) => i !== idx);
      return { ...prev, play: list.length ? list : [{ name: "", rating: 5 }] };
    });
  };

  /* Eat 列表编辑 */
  const updateEat = (idx: number, field: keyof Eat, value: string) => {
    setForm((prev) => {
      const list = [...prev.eat];
      list[idx] = { ...list[idx], [field]: value } as Eat;
      return { ...prev, eat: list };
    });
  };
  const addEat = () => {
    setForm((prev) => ({
      ...prev,
      eat: [...prev.eat, { name: "", price: "" }],
    }));
  };
  const removeEat = (idx: number) => {
    setForm((prev) => {
      const list = prev.eat.filter((_, i) => i !== idx);
      return { ...prev, eat: list.length ? list : [{ name: "", price: "" }] };
    });
  };

  /* 保存 */
  const handleSave = () => {
    const c = form;
    if (!c.name.trim()) {
      alert("请填写城市名称");
      return;
    }

    const inferredProvince = getProvinceByCity(c.name.trim());
    let finalProvince = c.province.trim();
    if (inferredProvince) {
      finalProvince = inferredProvince;
    } else if (!finalProvince) {
      alert("暂不支持该城市，请尝试输入标准的地级市名称哦～");
      return;
    }

    // 自动填充坐标：先查城市字典，再查省份省会，最后通用 fallback
    const cityCoord = getCityCoord(c.name.trim());
    const fallbackCoord = getFallbackCoord(c.province.trim());
    const finalLng = Number(c.lng) || cityCoord?.lng || fallbackCoord.lng;
    const finalLat = Number(c.lat) || cityCoord?.lat || fallbackCoord.lat;

    // 构造符合 City 类型的输出（包含 coord 对象 + 标记字段）
    const cleaned = {
      ...c,
      name: c.name.trim(),
      province: finalProvince,
      slogan: c.slogan.trim(),
      stay: c.stay.trim(),
      tips: c.tips.trim(),
      diary: c.diary?.trim() || "",
      play: c.play
        .filter((p) => p.name.trim())
        .map((p) => ({ ...p, name: p.name.trim() })),
      eat: c.eat
        .filter((e) => e.name.trim())
        .map((e) => ({ ...e, name: e.name.trim(), price: e.price.trim() })),
      coord: { lng: finalLng, lat: finalLat },
      light_source: "manual" as const,
      status: "visited" as const,
      explore_count: 1,
      days: 1,
    };
    if (cleaned.play.length === 0) cleaned.play = [{ name: "待补充", rating: 5 }];
    if (cleaned.eat.length === 0) cleaned.eat = [{ name: "待补充", price: "" }];

    onSave(cleaned as unknown as City);
  };

  return (
    <>
    <AnimatePresence>
      {open && (
        <motion.div
          className="rg-edit-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="rg-edit-modal"
            initial={{ scale: 0.92, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 30 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button className="rg-edit-close" onClick={onClose} aria-label="关闭">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* 标题 */}
            <div className="rg-edit-header">
              <h3>{isNew ? "记录新城市" : `编辑「${form.name || "未命名"}」`}</h3>
              <p>填写你的旅行记忆，留存温度。</p>
            </div>

            {/* 表单主体 */}
            <div className="rg-edit-body">
              {/* 基本信息：城市名 + 省份 */}
              <div className="rg-edit-row rg-two-col">
                <label className="rg-edit-field">
                  <span>城市名称</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="如：大理"
                  />
                </label>
                <label className="rg-edit-field">
                  <span>所属省份</span>
                  <input
                    type="text"
                    value={form.province}
                    onChange={(e) => updateField("province", e.target.value)}
                    placeholder="如：云南"
                  />
                </label>
              </div>

              {/* 标语 */}
              <label className="rg-edit-field">
                <span>一句话标语</span>
                <input
                  type="text"
                  value={form.slogan}
                  onChange={(e) => updateField("slogan", e.target.value)}
                  placeholder="如：风花雪月的慢生活"
                />
              </label>

              {/* 图片上传 + 天数 */}
              <div className="rg-edit-row rg-two-col">
                <label className="rg-edit-field rg-image-field">
                  <span>城市照片</span>
                  <div className="rg-image-grid">
                    {(form.images || []).map((img, idx) => (
                      <div key={idx} className="rg-image-thumb">
                        <img src={img} alt={`照片 ${idx + 1}`} />
                        <button
                          className="rg-image-del"
                          onClick={() => removeImage(idx)}
                          type="button"
                          aria-label="删除"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {(form.images || []).length < 6 && (
                      <div
                        className="rg-image-upload-btn"
                        onClick={() => document.getElementById("city-image-upload")?.click()}
                      >
                        <span style={{ fontSize: 20, opacity: 0.4 }}>+</span>
                        <span style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>点击上传</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      id="city-image-upload"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length === 0) return;
                        const remainingSlots = 6 - (form.images || []).length;
                        const toProcess = files.slice(0, remainingSlots);
                        let processed = 0;
                        const newImages: string[] = [];
                        toProcess.forEach((file) => {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            newImages.push(ev.target?.result as string);
                            processed++;
                            if (processed === toProcess.length) {
                              updateField("images", [...(form.images || []), ...newImages]);
                            }
                          };
                          reader.readAsDataURL(file);
                        });
                        e.target.value = "";
                      }}
                    />
                  </div>
                </label>
                <label className="rg-edit-field">
                  <span>停留天数</span>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={form.days}
                    onChange={(e) =>
                      updateField("days", Math.max(1, parseInt(e.target.value || "1", 10)))
                    }
                  />
                </label>
              </div>

              {/* 玩 */}
              <div className="rg-edit-section">
                <h4 className="rg-edit-h4">🎯 玩</h4>
                {form.play.map((p, idx) => (
                  <div key={idx} className="rg-edit-list-row">
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => updatePlay(idx, "name", e.target.value)}
                      placeholder="景点名称"
                    />
                    <select
                      value={p.rating}
                      onChange={(e) => updatePlay(idx, "rating", parseInt(e.target.value, 10))}
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>
                          {"★".repeat(r)}
                        </option>
                      ))}
                    </select>
                    <button
                      className="rg-edit-remove"
                      onClick={() => removePlay(idx)}
                      type="button"
                      aria-label="删除"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button className="rg-edit-add" onClick={addPlay} type="button">
                  ＋ 添加景点
                </button>
              </div>

              {/* 吃 */}
              <div className="rg-edit-section">
                <h4 className="rg-edit-h4">🍜 吃</h4>
                {form.eat.map((item, idx) => (
                  <div key={idx} className="rg-edit-list-row">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateEat(idx, "name", e.target.value)}
                      placeholder="美食名称"
                    />
                    <input
                      type="text"
                      value={item.price}
                      onChange={(e) => updateEat(idx, "price", e.target.value)}
                      placeholder="价格"
                      style={{ maxWidth: 90 }}
                    />
                    <button
                      className="rg-edit-remove"
                      onClick={() => removeEat(idx)}
                      type="button"
                      aria-label="删除"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button className="rg-edit-add" onClick={addEat} type="button">
                  ＋ 添加美食
                </button>
              </div>

              {/* 住宿 */}
              <label className="rg-edit-field">
                <span>住宿推荐</span>
                <textarea
                  rows={2}
                  value={form.stay}
                  onChange={(e) => updateField("stay", e.target.value)}
                  placeholder="写下你的住宿体验..."
                />
              </label>

              {/* Tips */}
              <label className="rg-edit-field">
                <span>Tips</span>
                <textarea
                  rows={2}
                  value={form.tips}
                  onChange={(e) => updateField("tips", e.target.value)}
                  placeholder="给其他旅人的建议..."
                />
              </label>

              {/* 旅行日记 */}
              <label className="rg-edit-field rg-diary-field">
                <span>📝 旅行日记</span>
                <textarea
                  rows={4}
                  value={form.diary || ""}
                  onChange={(e) => updateField("diary", e.target.value)}
                  placeholder="记录这一天的故事与心情..."
                />
              </label>
            </div>

            {/* 底部按钮 */}
            <div className="rg-edit-footer">
              <button className="rg-edit-btn rg-btn-secondary" onClick={onClose}>
                取消
              </button>
              <button className="rg-edit-btn rg-btn-primary" onClick={handleSave}>
                {isNew ? "保存记录" : "更新记忆"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    <style>{`
      /* ===== CityEditModal - 新增/编辑城市弹窗 ===== */

      /* 遮罩层 */
      .rg-edit-overlay {
        position: fixed;
        inset: 0;
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: rgba(40, 32, 24, 0.7);
        backdrop-filter: blur(6px);
      }

      /* Modal 主体 */
      .rg-edit-modal {
        position: relative;
        width: 100%;
        max-width: 520px;
        background: #fffdf6;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.5);
        max-height: 90vh;
        overflow-y: auto;
      }

      /* 关闭按钮 */
      .rg-edit-close {
        position: absolute;
        top: 12px;
        right: 14px;
        z-index: 5;
        width: 34px;
        height: 34px;
        border: none;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.85);
        color: #4a4036;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.2s ease;
      }
      .rg-edit-close:hover {
        background: #fff;
        transform: scale(1.08);
      }

      /* 标题区 */
      .rg-edit-header {
        padding: 24px 24px 0;
      }
      .rg-edit-header h3 {
        font-family: "Noto Serif SC", Georgia, serif;
        font-size: 20px;
        font-weight: 700;
        color: #3d3830;
        margin: 0 0 4px;
      }
      .rg-edit-header p {
        font-size: 13px;
        color: #b0a594;
        margin: 0;
        font-family: "Noto Serif SC", Georgia, serif;
      }

      /* 表单主体 */
      .rg-edit-body {
        padding: 16px 24px 0;
      }

      /* 底部按钮 */
      .rg-edit-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 20px 24px 24px;
      }

      /* 表单字段 */
      .rg-edit-field {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-bottom: 14px;
      }
      .rg-edit-field span {
        font-size: 12px;
        font-weight: 600;
        color: #7a6e62;
        letter-spacing: 0.04em;
      }
      .rg-edit-field input,
      .rg-edit-field textarea,
      .rg-edit-list-row input,
      .rg-edit-list-row select {
        padding: 9px 12px;
        border-radius: 8px;
        border: 1px solid #e0d8cc;
        background: #fff;
        font-size: 14px;
        color: #4a4036;
        outline: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
        font-family: inherit;
      }
      .rg-edit-field input:focus,
      .rg-edit-field textarea:focus,
      .rg-edit-list-row input:focus,
      .rg-edit-list-row select:focus {
        border-color: #7a9e7e;
        box-shadow: 0 0 0 3px rgba(122, 158, 126, 0.1);
      }
      .rg-edit-field input::placeholder,
      .rg-edit-field textarea::placeholder {
        color: #c9c0b4;
      }
      .rg-edit-field textarea {
        resize: vertical;
        line-height: 1.6;
      }

      /* 双列布局 */
      .rg-edit-row.rg-two-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      @media (max-width: 480px) {
        .rg-edit-row.rg-two-col { grid-template-columns: 1fr; }
      }

      /* 旅行日记字段特殊样式 */
      .rg-diary-field textarea {
        min-height: 100px;
        background: rgba(245, 240, 230, 0.5);
        border: 1px dashed #d8d0c0;
      }
      .rg-diary-field textarea:focus {
        border-style: solid;
        border-color: #7a9e7e;
        background: #fff;
      }

      /* 图片上传 */
      .rg-image-upload-wrap {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .rg-image-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 90px;
        border: 2px dashed rgba(90,74,58,0.15);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.25s ease;
        background: rgba(245,243,238,0.5);
      }
      .rg-image-placeholder:hover {
        border-color: rgba(123,168,158,0.4);
        background: rgba(123,168,158,0.04);
      }
      .rg-image-preview {
        position: relative;
        height: 90px;
        border-radius: 10px;
        overflow: hidden;
        cursor: pointer;
        border: 1px solid rgba(90,74,58,0.08);
      }
      .rg-image-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .rg-image-replace {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.35);
        color: #fff;
        font-size: 12px;
        letter-spacing: 1px;
        opacity: 0;
        transition: opacity 0.25s ease;
      }
      .rg-image-preview:hover .rg-image-replace {
        opacity: 1;
      }

      /* 图片缩略图网格 — 胶片风格 */
      .rg-image-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .rg-image-thumb {
        position: relative;
        aspect-ratio: 1;
        border-radius: 4px;
        overflow: hidden;
        background: #1a1a1a;
        padding: 6px 6px 20px 6px;
        box-sizing: border-box;
      }
      .rg-image-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 2px;
      }
      /* 胶片齿孔 */
      .rg-image-thumb::before,
      .rg-image-thumb::after {
        content: '';
        position: absolute;
        left: 6px;
        right: 6px;
        height: 6px;
        background: repeating-linear-gradient(
          to right,
          transparent 0px,
          transparent 4px,
          #1a1a1a 4px,
          #1a1a1a 6px,
          transparent 6px,
          transparent 10px
        );
        z-index: 1;
      }
      .rg-image-thumb::before { top: 1px; }
      .rg-image-thumb::after { bottom: 1px; height: 6px; background: repeating-linear-gradient(to right, transparent 0px, transparent 4px, #1a1a1a 4px, #1a1a1a 6px, transparent 6px, transparent 10px); }
      .rg-image-del { position: absolute; top: 8px; right: 8px; width: 20px; height: 20px; border-radius: 50%; background: rgba(0,0,0,0.5); color: #fff; border: none; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 2; }
      .rg-image-upload-btn {
        aspect-ratio: 1;
        border: 2px dashed rgba(90,74,58,0.15);
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background: rgba(245,243,238,0.5);
      }

      /* 列表行编辑（玩/吃） */
      .rg-edit-section {
        margin-bottom: 16px;
      }
      .rg-edit-h4 {
        font-size: 14px;
        font-weight: 700;
        color: #5d8a6a;
        margin: 0 0 10px;
        font-family: "Noto Serif SC", Georgia, serif;
      }
      .rg-edit-list-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      .rg-edit-list-row input { flex: 1; min-width: 0; }
      .rg-edit-list-row select {
        padding: 9px 8px;
        min-width: 80px;
        font-size: 13px;
      }
      .rg-edit-remove {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: none;
        background: rgba(196, 69, 54, 0.08);
        color: #c44536;
        font-size: 16px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        cursor: pointer;
        transition: background 0.2s ease;
      }
      .rg-edit-remove:hover { background: rgba(196, 69, 54, 0.15); }
      .rg-edit-add {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        border-radius: 999px;
        border: 1px dashed #c9c0b4;
        background: transparent;
        color: #9a8e82;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .rg-edit-add:hover {
        border-color: #7a9e7e;
        color: #5d8a6a;
        background: rgba(122, 158, 126, 0.05);
      }

      /* 底部按钮 */
      .rg-edit-btn {
        padding: 9px 22px;
        border-radius: 999px;
        font-size: 14px;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .rg-btn-primary {
        background: #5d8a6a;
        color: #fff;
        box-shadow: 0 4px 14px -4px rgba(93, 138, 106, 0.35);
      }
      .rg-btn-primary:hover {
        background: #4d7a5a;
        box-shadow: 0 6px 18px -4px rgba(93, 138, 106, 0.45);
      }
      .rg-btn-secondary {
        background: transparent;
        color: #9a8e82;
        border: 1px solid #e0d8cc;
      }
      .rg-btn-secondary:hover {
        background: rgba(0, 0, 0, 0.03);
        color: #7a6e62;
      }

      @media (max-width: 640px) {
        .rg-edit-header { padding: 20px 20px 0; }
        .rg-edit-body { padding: 12px 20px 0; }
        .rg-edit-footer { padding: 16px 20px 20px; }
      }
    `}</style>
    </>
  );
}
