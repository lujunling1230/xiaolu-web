/**
 * defaultData.js
 *
 * 站点默认数据。
 * 页面加载时，优先读取 localStorage 中的 life_film_site_seed。
 * 若该 Key 不存在，则用此 defaultData 进行初始化。
 *
 * 安全红线：
 * - 严禁在页面加载时用 defaultData 覆盖已有的 life_film_site_seed。
 * - 代码中不得包含任何自动清空 localStorage 的逻辑。
 */

const defaultData = {
  /* ====== 时光博物馆 ====== */
  museum_bgms: [
    { id: "bgm-2002", year: "2002", title: "刀郎《2002年的第一场雪》", description: "当年大街小巷都在放的歌，是刻在 DNA 里的旋律。", imageUrl: "/images/bgm-2002-daolang.jpg" },
    { id: "bgm-2003", year: "2003", title: "周杰伦《稻香》", description: "前奏的蟋蟀声一响，就仿佛回到了那个无忧无虑的夏天，相信\"回家吧，回到最初的美好\"。", imageUrl: "/images/bgm-2003-jay.jpg" },
    { id: "bgm-2004", year: "2004", title: "S.H.E《中国话》", description: "\"全世界都在学中国话\"，这首歌的旋律一响，三个女孩的身影就浮现在眼前。", imageUrl: "/images/bgm-2004-she.jpg" },
    { id: "bgm-2005", year: "2005", title: "王心凌《那年夏天宁静的海》", description: "甜心教主的歌，总是伴随着偶像剧里又傻又可爱的画面，唱进很多人的心里。", imageUrl: "/images/bgm-2005-cyndi.jpg" },
    { id: "bgm-2006a", year: "2006", title: "孙燕姿《我怀念的》", description: "每次听到，都会有不一样的感悟，是争吵后想要爱你的冲动，还是无话不说的从前？", imageUrl: "/images/bgm-2006-stefanie.jpg" },
    { id: "bgm-2006b", year: "2006", title: "沈建祥《形容》", description: "像是那灰色天空中的小雨，下下停停，不动声色淋湿土地。有些情绪不必言说，全在眼神与长发里，那是青春最细腻的注脚。", imageUrl: "/images/bgm-2006b-shenjianxiang.jpg" },
    { id: "bgm-2007", year: "2007", title: "梁静茹《崇拜》", description: "经典的\"梁式情歌\"，打动了多少年轻女孩的心，纯粹又悲伤。", imageUrl: "/images/bgm-2007-fishleong.jpg" },
    { id: "bgm-2008", year: "2008", title: "五月天《倔强》", description: "\"我和我最后的倔强，握紧双手绝对不放\"，是青春里最热血的口号。", imageUrl: "/images/bgm-2008-mayday.jpg" },
    { id: "bgm-2011a", year: "2011", title: "陈奕迅《十年》", description: "一首歌的时间，仿佛经历了一场漫长的告别，教会我们成长。", imageUrl: "/images/bgm-2011a-eason.jpg" },
    { id: "bgm-2011b", year: "2011", title: "林宥嘉《想自由》", description: "就像被困住的野兽，在摩天大楼里渴求自由。一路嗅着追着美梦，哪怕跌得再重，也不觉得痛，只觉得空。", imageUrl: "/images/bgm-2011b-yoga.jpg" },
    { id: "bgm-2015", year: "2015", title: "陈楚生《那个远方》", description: "萦绕着发烫的梦想，就奋不顾身撑起手掌。那个叫做流浪的远方，到不了也念念不忘，是青春里最倔强的冲锋号。", imageUrl: "/images/bgm-2015-chenchusheng.jpg" },
    { id: "bgm-2022", year: "2022", title: "吴宇恒《失重旅行》", description: "关掉无用的思考，摆脱手机的烦扰。在月光与微风中摇啊摇，这是一场没有重力、也没有束缚的都市夜游。", imageUrl: "/images/bgm-2022-wuyuheng.jpg" },
  ],

  museum_honors: [
    { id: "honor-1", year: "2021", title: "国家励志奖学金", description: "2021-2022 学年获得国家励志奖学金，是对努力学习的最好回报。", imageUrl: "", reflection: "努力不会被辜负，它只是在等一个合适的时机开花。" },
    { id: "honor-2", year: "2022", title: "优秀志愿者", description: "获得优秀志愿者荣誉证书，用行动温暖他人。", imageUrl: "", reflection: "奉献的每一份力量，都算数。" },
    { id: "honor-3", year: "2023", title: "数据库管理系统职业技能等级证书", description: "获得数据库管理系统职业技能等级证书，掌握数据核心技术。", imageUrl: "", reflection: "每项技能的积累，都是未来最扎实的底气。" },
    { id: "honor-4", year: "2024", title: "网络与信息安全管理员职业技能等级证书", description: "获得网络与信息安全管理员职业技能等级证书，守护网络安全。", imageUrl: "", reflection: "技术越深入，越明白责任有多重。" },
    { id: "honor-5", year: "2025", title: "英语四级证书", description: "通过大学英语四级考试（CET-4），语言能力迈上新台阶。", imageUrl: "", reflection: "语言是通向更大世界的桥梁。" },
  ],

  museum_nets: [
    { id: "net-2", year: "2004-2008", title: "Flash 小游戏", description: "键盘是船，浏览器是海，我们在\"黄金矿工\"里淘金，在\"地铁跑酷\"里逃亡。那些被定义为\"摸鱼\"的时光，其实是青春偷偷埋下的彩蛋。", imageUrl: "/images/net-2005-goldminer.jpg" },
    { id: "net-3", year: "2009-2012", title: "贴吧与论坛", description: "为了追星，在贴吧里疯狂刷帖，看同人文，分享资源，是第一批\"网友\"聚集地。", imageUrl: "/images/net-2009-tieba.jpg" },
  ],

  museum_tvs: [
    { id: "tv-1999", year: "1999", title: "《还珠格格》（重播巅峰）", description: "每年寒暑假的必备经典，小燕子的古灵精怪和\"当\"的歌声，是几代人的共同记忆。", imageUrl: "/images/tv-1999-huanzhugege.jpg" },
    { id: "tv-2005a", year: "2005", title: "《家有儿女》", description: "刘星、夏雪、夏雨一家的欢乐日常，是童年最温暖的背景音。", imageUrl: "/images/tv-2005-jiayouernv.jpg" },
    { id: "tv-2005b", year: "2005", title: "《仙剑奇侠传》", description: "李逍遥和赵灵儿的仙侠梦，配上《杀破狼》和《六月的雨》，是无数人的意难平。", imageUrl: "/images/tv-2005-xianjian.jpg" },
    { id: "tv-2006", year: "2006", title: "《武林外传》", description: "同福客栈的屋顶，藏着江湖最柔软的角落。一群不靠谱的人，说着最扎心的话，成了我们青春里最治愈的避风港。", imageUrl: "/images/tv-2006-wulin.jpg" },
    { id: "tv-2010", year: "2010", title: "《新三国演义》", description: "烽火连天的不仅是赤壁的火，还有那些英雄辈出的梦。桃园结义的酒，至今还在历史的风烟里温热。", imageUrl: "/images/tv-2010-sanguo.jpg" },
    { id: "tv-2013", year: "2013", title: "《咱们结婚吧》", description: "大龄未婚的焦虑，被一碗热汤和一句'咱们结婚吧'悄悄融化。爱情或许会迟到，但绝不会缺席。", imageUrl: "/images/tv-2013-marry.jpg" },
    { id: "tv-2014", year: "2014", title: "《来自星星的你》", description: "引爆全民追剧热潮的韩剧，都敏俊和千颂伊让\"我好像爱上你了\"成了流行语。", imageUrl: "/images/tv-2014-star.jpg" },
    { id: "tv-2016", year: "2016", title: "《欢乐颂》", description: "五个女孩，五种颜色，在城市的钢筋水泥里互相取暖。原来孤独的灵魂，也能找到共振的频率。", imageUrl: "/images/tv-2016-ode.jpg" },
    { id: "tv-2019", year: "2019", title: "《都挺好》", description: "原生家庭的刺，扎在每个成年人心里。苏家的故事，是一面镜子，照见我们自己与亲情的复杂和解。", imageUrl: "/images/tv-2019-doujiahao.jpg" },
    { id: "tv-2022", year: "2022", title: "《人世间》", description: "五十年光阴流转，周家三代人的悲欢离合，就是一部中国老百姓的史诗。最平凡的烟火，往往最动人。", imageUrl: "/images/tv-2022-renshijian.jpg" },
    { id: "tv-2025", year: "2025", title: "《生万物》", description: "从泥土里长出的希望，是乡村振兴最美的画卷。杨幂的转型，让我们看到了女性在时代浪潮中的坚韧与温柔。", imageUrl: "/images/tv-2025-shengwanwu.jpg" },
  ],

  /* ====== 通关清单 ====== */
  quest_log_data: [
    { id: "q1", text: "读完 10 页书", difficulty: "easy", completed: false },
    { id: "q2", text: "搞定周报初稿", difficulty: "hard", completed: false },
    { id: "q3", text: "喝一杯水", difficulty: "easy", completed: true },
  ],

  quest_log_xp: "0",

  /* ====== 生活放映中 ====== */
  lf_reading: [
    {
      id: "r1",
      title: "被讨厌的勇气",
      author: "岸见一郎 / 古贺史健",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      quote: "所谓自由，就是被别人讨厌。",
      date: "2025-03",
    },
    {
      id: "r2",
      title: "小王子",
      author: "安托万·德·圣埃克苏佩里",
      cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      quote: "真正重要的东西，用眼睛是看不见的。",
      date: "2025-01",
    },
    {
      id: "r3",
      title: "认知觉醒",
      author: "周岭",
      cover: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=400&h=600&fit=crop",
      quote: "焦虑的根源是想同时做很多事，又想立刻看到效果。",
      date: "2025-06",
    },
    {
      id: "r4",
      title: "非暴力沟通",
      author: "马歇尔·卢森堡",
      cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop",
      quote: "当我们用心倾听他人，就能触及彼此心中的柔软。",
      date: "2025-04",
    },
    {
      id: "r5",
      title: "人类简史",
      author: "尤瓦尔·赫拉利",
      cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      quote: "想象的现实并非谎言，而是让数百万人协作的黏合剂。",
      date: "2025-08",
    },
  ],
  lf_photos: [
    {
      id: "p1",
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      title: "苍山脚下",
      date: "2024-01",
      desc: "云南大理，苍山洱海间的第一缕晨光",
    },
    {
      id: "p2",
      src: "https://images.unsplash.com/photo-1531219573917-2ca59e96bc0e?w=600&h=400&fit=crop",
      title: "西湖秋色",
      date: "2022-09",
      desc: "杭州西湖，桂花飘香的午后",
    },
    {
      id: "p3",
      src: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=400&fit=crop",
      title: "银杏大道",
      date: "2024-11",
      desc: "深秋时节的校园小路",
    },
    {
      id: "p4",
      src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
      title: "鼓浪屿日落",
      date: "2023-12",
      desc: "厦门鼓浪屿，海天一线的金色黄昏",
    },
    {
      id: "p5",
      src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop",
      title: "森林小径",
      date: "2025-04",
      desc: "春日散步时偶遇的绿色隧道",
    },
  ],
  lf_tracks: [
    {
      id: "t1",
      title: "晴天",
      type: "华语",
      date: "2025-05",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    },
    {
      id: "t2",
      title: "River Flows in You",
      type: "纯音乐",
      date: "2025-03",
      cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop",
    },
    {
      id: "t3",
      title: "安河桥",
      type: "民谣",
      date: "2025-01",
      cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
    },
    {
      id: "t4",
      title: "Nuvole Bianche",
      type: "纯音乐",
      date: "2024-12",
      cover: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=400&fit=crop",
    },
    {
      id: "t5",
      title: "后来",
      type: "华语",
      date: "2025-07",
      cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    },
  ],
  lf_sports: [
    {
      id: "s1",
      icon: "🏃",
      name: "晨跑 5km",
      date: "2025-06-15",
      time: "32 分钟",
      note: "清晨空气好，跑完一整天精神满满",
    },
    {
      id: "s2",
      icon: "🧘",
      name: "瑜伽拉伸",
      date: "2025-06-14",
      time: "40 分钟",
      note: "配合冥想，身体柔韧度在慢慢进步",
    },
    {
      id: "s3",
      icon: "🚴",
      name: "环湖骑行",
      date: "2025-05-20",
      time: "60 分钟",
      note: "西湖边骑了一圈，风景太好了",
    },
    {
      id: "s4",
      icon: "🧗",
      name: "爬山",
      date: "2025-04-10",
      time: "2 小时",
      note: "灵隐寺后山，虽然累但山顶的风景值了",
    },
    {
      id: "s5",
      icon: "🏃",
      name: "夜跑 3km",
      date: "2025-07-01",
      time: "20 分钟",
      note: "夏夜晚风中的慢跑，是最好的独处时光",
    },
  ],
  lf_meditations: [
    {
      id: "m1",
      theme: "身体扫描",
      duration: "15 分钟",
      date: "2025-07-01",
      insight: "慢慢放松每个部位，发现肩膀一直紧绷着没有察觉",
    },
    {
      id: "m2",
      theme: "呼吸觉察",
      duration: "10 分钟",
      date: "2025-06-28",
      insight: "专注呼吸的时候，杂念反而变得像云一样飘走了",
    },
    {
      id: "m3",
      theme: "感恩冥想",
      duration: "12 分钟",
      date: "2025-06-25",
      insight: "想感谢的人和事太多了，心里变得很柔软",
    },
    {
      id: "m4",
      theme: "行走冥想",
      duration: "20 分钟",
      date: "2025-06-20",
      insight: "在公园里慢慢走，每一步都感受脚底与地面的接触",
    },
    {
      id: "m5",
      theme: "睡前放松",
      duration: "8 分钟",
      date: "2025-06-18",
      insight: "入睡比平时快了很多，以后要坚持",
    },
  ],
  lf_dramas: [
    {
      id: "d1",
      title: "电视机里的乌托邦",
      season: "第一季",
      date: "2025-06",
      cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop",
      quote: "每家每户的电视机里，都藏着一个平行世界——那里的人们过着他们理想中的生活。而主角发现，自己家的电视机，连接着一个不存在的乌托邦小镇。",
    },
    {
      id: "d2",
      title: "我的解放日记",
      season: "全季",
      date: "2025-04",
      cover: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
      quote: "不逃离，也不妥协，只是安静地记录自己被解放的每一个瞬间。",
    },
    {
      id: "d3",
      title: "去有风的地方",
      season: "全季",
      date: "2025-02",
      cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
      quote: "人总要往前走，但偶尔停下来吹吹风，也是可以的。",
    },
    {
      id: "d4",
      title: "重启人生",
      season: "全季",
      date: "2025-01",
      cover: "https://images.unsplash.com/photo-1518676590747-1e3dcf5a4e32?w=400&h=600&fit=crop",
      quote: "如果能重来一次，你会做什么不同的选择？答案可能只是——对身边的人更好一点。",
    },
    {
      id: "d5",
      title: "我的天才女友",
      season: "第一季~第四季",
      date: "2024-10",
      cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      quote: "友谊是一场漫长的角力，而我们在彼此的映照中，看到了自己最真实的模样。",
    },
  ],

  /* ====== 第七卷胶片 ====== */
  reading_custom_books: [],

  /* ====== 回血清单 ====== */
  recharge_count: "3",

  /* ====== 库存管理 ====== */
  inventory_items: [],

  /* ====== 走过的土地（中国地图足迹） ====== */
  footprints: {
    provinces: [
      { id: "bj", name: "北京", visited: true, date: "2023-05", days: 3, cities: ["故宫", "长城", "天坛"], note: "胡同里的老北京味道，至今难忘。" },
      { id: "sh", name: "上海", visited: true, date: "2023-10", days: 5, cities: ["外滩", "豫园", "田子坊"], note: "外滩的夜色，是城市最温柔的一面。" },
      { id: "zj", name: "浙江", visited: true, date: "2022-09", days: 4, cities: ["西湖", "灵隐寺", "龙井村"], note: "西湖的秋天，桂花香气会记住一辈子。" },
      { id: "js", name: "江苏", visited: true, date: "2022-04", days: 3, cities: ["拙政园", "平江路", "虎丘"], note: "园林里的每一扇窗，都是一幅画。" },
      { id: "sc", name: "四川", visited: true, date: "2023-08", days: 4, cities: ["大熊猫基地", "宽窄巷子", "杜甫草堂"], note: "一座来了就不想走的城。" },
      { id: "yn", name: "云南", visited: true, date: "2024-01", days: 5, cities: ["洱海", "苍山", "喜洲古镇"], note: "风花雪月的慢生活。" },
      { id: "sn", name: "陕西", visited: true, date: "2024-06", days: 5, cities: ["兵马俑", "大唐不夜城", "城墙"], note: "一眼千年，长安如故。" },
      { id: "fj", name: "福建", visited: true, date: "2023-12", days: 4, cities: ["鼓浪屿", "曾厝垵", "环岛路"], note: "海风里藏着文艺的味道。" },
      { id: "hb", name: "河北", visited: true, date: "2023-05", days: 2, cities: ["承德避暑山庄"], note: "" },
      { id: "hlj", name: "黑龙江", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "jl", name: "吉林", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "ln", name: "辽宁", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "nm", name: "内蒙古", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "sx", name: "山西", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "tj", name: "天津", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "sd", name: "山东", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "hn", name: "河南", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "ah", name: "安徽", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "jx", name: "江西", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "hn2", name: "湖南", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "hb2", name: "湖北", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "cq", name: "重庆", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "gz", name: "贵州", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "gx", name: "广西", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "gd", name: "广东", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "hn3", name: "海南", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "tw", name: "台湾", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "xg", name: "香港", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "am", name: "澳门", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "xz", name: "西藏", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "qh", name: "青海", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "gs", name: "甘肃", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "nx", name: "宁夏", visited: false, date: "", days: 0, cities: [], note: "" },
      { id: "xj", name: "新疆", visited: false, date: "", days: 0, cities: [], note: "" },
    ]
  },

  /* ====== 自定义模块（生活放映中） ====== */
  lf_custom_modules: [],
};

export default defaultData;
