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
  imageUrl: string;
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
};

function getCityCoord(cityName: string): { lng: number; lat: number } | undefined {
  return cityCoords[cityName];
}

/* 空城市模板 */
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

    // 自动填充坐标（如果用户没有手动输入）
    const cityCoord = getCityCoord(c.name.trim());
    const finalLng = Number(c.lng) || cityCoord?.lng || 116.4;
    const finalLat = Number(c.lat) || cityCoord?.lat || 39.9;

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

              {/* 图片 + 天数 */}
              <div className="rg-edit-row rg-two-col">
                <label className="rg-edit-field">
                  <span>图片链接</span>
                  <input
                    type="text"
                    value={form.imageUrl}
                    onChange={(e) => updateField("imageUrl", e.target.value)}
                    placeholder="https://..."
                  />
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

              {/* 坐标（经度/纬度） */}
              <div className="rg-edit-row rg-two-col">
                <label className="rg-edit-field">
                  <span>经度 (lng)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={form.lng ?? ""}
                    onChange={(e) =>
                      updateField("lng", e.target.value ? parseFloat(e.target.value) : undefined)
                    }
                    placeholder="如：100.23"
                  />
                </label>
                <label className="rg-edit-field">
                  <span>纬度 (lat)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={form.lat ?? ""}
                    onChange={(e) =>
                      updateField("lat", e.target.value ? parseFloat(e.target.value) : undefined)
                    }
                    placeholder="如：25.59"
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
