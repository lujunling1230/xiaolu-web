/**
 * 作品项目数据 —— AI 产品经理视角项目文档
 *
 * 每个项目以"产品需求文档"的思维呈现：
 * 痛点 → 方案 → 价值 → 场景 → 亮点
 */

export interface Project {
  id: string;              // 唯一标识符
  title: string;           // 产品名称
  tag: string;             // 产品定位/分类

  // 7 大模块（AI 产品经理视角）
  painPoints: string[];    // 用户痛点
  targetUsers: string[];   // 适合人群
  solutions: string[];      // 解决方案
  coreValue: string[];     // 核心价值
  useCases: string[];      // 使用场景
  highlights: string[];    // 产品亮点
  futurePlans?: string[];  // 未来规划（可选）

  // 基础信息
  liveUrl: string;         // 独立部署链接
  tags?: string[];         // 技术标签
}

export const projects: Project[] = [
  {
    id: "forest-healing",
    title: "森林疗愈室",
    tag: "沉浸式疗愈网页",
    painPoints: [
      "高压人群缺乏低门槛的情绪出口",
      "传统冥想应用门槛高，操作复杂",
      "用户在疲惫时需要「零决策」的放空体验",
    ],
    targetUsers: [
      "高强度工作的职场人士",
      "易焦虑人群",
      "追求内心平静的 i 人",
    ],
    solutions: [
      "构建沉浸式森林场景，模拟真实自然环境",
      "内置 5 种白噪音，支持音量调节和音效交互",
      "点击树叶触发掉落动画与自然音效",
    ],
    coreValue: [
      '"零门槛"的情绪释放 —— 用户无需做任何决策',
      "低能耗回血：5 分钟即可获得心理修复",
      "纯粹的感官体验，无社交压力",
    ],
    useCases: [
      "睡前助眠",
      "工作间隙的短暂休憩",
      "焦虑发作时的即时安抚",
    ],
    highlights: [
      "实时流动的森林光影，随时间变化",
      "树叶交互：点击触发掉落动画",
      "白噪音混音系统",
    ],
    futurePlans: [
      "多场景切换（海边、雨林）",
      "用户自定义音效组合",
    ],
    liveUrl: "https://xiaoluweb.com/",
    tags: ["React", "Framer Motion", "Web Audio", "Tailwind", "沉浸式设计"],
  },
  {
    id: "system-tuning",
    title: "爱情公寓 · AI 朋友圈",
    tag: "AI 角色扮演 · 社交模拟",
    painPoints: [
      "用户渴望与喜欢的角色深度互动",
      "传统 AI 对话缺乏真实社交场景",
      "角色扮演类产品沉浸感不足",
    ],
    targetUsers: [
      "剧集/动漫爱好者",
      "喜欢角色扮演的用户",
      "寻求情感陪伴的年轻人",
    ],
    solutions: [
      "完整还原微信社交产品形态",
      "AI 角色具备记忆系统和性格还原",
      "支持用户发布动态，AI 角色会点赞评论",
    ],
    coreValue: [
      "让 AI 角色「活」在朋友圈里",
      "高度还原的角色性格与互动逻辑",
      "沉浸式社交体验：单聊、群聊、朋友圈全覆盖",
    ],
    useCases: [
      "角色扮演娱乐",
      "情感陪伴",
      "创意故事创作",
    ],
    highlights: [
      "完整微信 UI 还原",
      "AI 角色智能回复系统",
      "动态评论与角色联动",
    ],
    futurePlans: [
      "多剧集角色库",
      "用户自定义角色创建",
    ],
    liveUrl: "https://xiaoluweb.com/toolbox/answer",
    tags: ["React", "TypeScript", "AI 生成", "LLM 角色扮演", "WebSocket 对话", "数据持久化"],
  },
  {
    id: "quest-log",
    title: "通关清单",
    tag: "游戏化 To-Do 管理",
    painPoints: [
      "日常任务缺乏激励感，难以坚持",
      "传统待办应用枯燥无味",
      "用户需要可视化的成长反馈",
    ],
    targetUsers: [
      "游戏玩家",
      "需要任务管理的用户",
      "追求成长感的年轻人",
    ],
    solutions: [
      "将生活任务转化为 RPG 游戏任务",
      "任务完成获取经验值，升级解锁成就",
      "丰富的成就系统与等级视觉反馈",
    ],
    coreValue: [
      "把人生变成一场 RPG",
      "平凡日常也有闯关打怪的乐趣",
      "即时反馈系统保持前进动力",
    ],
    useCases: [
      "每日习惯养成",
      "学习任务管理",
      "工作事项追踪",
    ],
    highlights: [
      "经验值与等级系统",
      "成就徽章收集",
      "任务分类与优先级",
    ],
    liveUrl: "https://xiaoluweb.com/toolbox/quests",
    tags: ["React", "Framer Motion", "游戏化设计", "LocalStorage", "成就系统"],
  },
  {
    id: "inventory",
    title: "物资管家",
    tag: "个人库存管理应用",
    painPoints: [
      "家中物资杂乱，保质期难以追踪",
      "食品过期造成浪费",
      "急需某物时找不到",
    ],
    targetUsers: [
      "独居人士",
      "需要管理家庭物资的用户",
      "注重生活品质的群体",
    ],
    solutions: [
      "记录物资购买日期与保质期",
      "临近过期自动提醒",
      "分类管理与智能搜索",
    ],
    coreValue: [
      "家里囤了什么东西，保质期一目了然",
      "避免过期浪费，保持生活井然有序",
      "极简设计，开箱即用",
    ],
    useCases: [
      "食品保质期管理",
      "家庭药品整理",
      "日用品库存盘点",
    ],
    highlights: [
      "保质期倒计时提醒",
      "智能分类系统",
      "快速搜索筛选",
    ],
    liveUrl: "https://xiaoluweb.com/toolbox/supplies",
    tags: ["React", "TypeScript", "LocalStorage", "分类搜索", "提醒机制"],
  },
  {
    id: "advice-shop",
    title: "解忧杂货店",
    tag: "治愈系问答空间",
    painPoints: [
      "用户需要即时的情感慰藉",
      "传统心理咨询门槛高、费用高",
      "深夜独处时无人倾诉",
    ],
    targetUsers: [
      "情绪低落的年轻人",
      "寻求心灵慰藉的用户",
      "喜欢随机惊喜的人群",
    ],
    solutions: [
      "收录 100+ 治愈句子",
      "点击随机翻牌机制",
      "轻量、安静、温柔的界面设计",
    ],
    coreValue: [
      "总有一句话，能解开你的心结",
      "即时的情感共鸣",
      "零压力的使用体验",
    ],
    useCases: [
      "心情不好时的即时安慰",
      "深夜独处的温暖陪伴",
      "选择困难时的随机指引",
    ],
    highlights: [
      "翻牌动画与惊喜感",
      "治愈文案库",
      "极简交互设计",
    ],
    liveUrl: "https://xiaoluweb.com/toolbox/advice",
    tags: ["React", "Framer Motion", "情感化设计", "LocalStorage"],
  },
  {
    id: "travel-guide",
    title: "漫游指南",
    tag: "旅行足迹与攻略",
    painPoints: [
      "旅行照片散落各处，难以整理",
      "走过的地方难以形成系统记忆",
      "传统游记编辑成本高",
    ],
    targetUsers: [
      "旅行爱好者",
      "喜欢记录生活的人",
      "地理探索者",
    ],
    solutions: [
      "手绘风格中国地图 SVG 实现",
      "标注走过的城市，一目了然",
      "点击城市查看游记与照片",
    ],
    coreValue: [
      "走过的路，看过的云",
      "用视觉化方式记录旅行足迹",
      "每一段旅程都有专属记忆",
    ],
    useCases: [
      "旅行打卡记录",
      "行程规划参考",
      "回忆收藏",
    ],
    highlights: [
      "手绘地图风格",
      "SVG 路径呼吸动画",
      "城市详情页",
    ],
    liveUrl: "https://xiaoluweb.com/toolbox/travel",
    tags: ["SVG", "Framer Motion", "胶片美学", "交互地图"],
  },
  {
    id: "recharge-list",
    title: "回血清单",
    tag: "i 人低能耗回血",
    painPoints: [
      "情绪耗竭时不知从何恢复",
      "大型自我疗愈方案难以执行",
      "需要「最小行动」快速回血",
    ],
    targetUsers: [
      "高敏感人群",
      "易情绪耗竭的用户",
      "追求低能耗自我修复的 i 人",
    ],
    solutions: [
      "收集 50+ 极小行动（不超过 5 分钟）",
      "点击标记完成，记录回血历史",
      "3D Transform 立体交互",
    ],
    coreValue: [
      "允许一切崩塌，只做一件极小的事",
      "微小也是力量",
      "量化回血进度，增强掌控感",
    ],
    useCases: [
      "情绪崩溃后的快速修复",
      "日常微休息",
      "能量补给站",
    ],
    highlights: [
      "极小行动库（5 分钟内）",
      "3D 卡片翻转交互",
      "回血历史记录",
    ],
    liveUrl: "https://xiaoluweb.com/toolbox/recharge",
    tags: ["3D Transform", "Framer Motion", "LocalStorage", "情绪疗愈"],
  },
  {
    id: "stress-relief",
    title: "解压馆",
    tag: "交互式解压小游戏",
    painPoints: [
      "高压人群需要快速释放压力",
      "传统解压方式门槛高或效果有限",
      "紧张间隙缺乏即时的解压工具",
    ],
    targetUsers: [
      "高压职场人士",
      "学生群体",
      "任何需要释放压力的用户",
    ],
    solutions: [
      "三款独立解压小游戏",
      "消散：三消归零，万念俱散",
      "斩断：一刀两断，万物可裂",
      "吞噬：画下的都会落下",
    ],
    coreValue: [
      "允许一切失控，除了你的心跳",
      "即时的压力释放",
      "沉浸式交互体验",
    ],
    useCases: [
      "工作间隙的短暂放松",
      "考试前的压力释放",
      "睡前放松",
    ],
    highlights: [
      "Canvas 物理效果",
      "SVG 交互动画",
      "关卡进度保存",
    ],
    liveUrl: "https://xiaoluweb.com/toolbox/games",
    tags: ["Canvas", "SVG", "Web Audio", "游戏开发", "三消算法"],
  },
  {
    id: "memory-museum",
    title: "时光博物馆",
    tag: "双展厅回忆录",
    painPoints: [
      "成长记忆散落各处",
      "旧物难以保留原始情感",
      "需要仪式感来纪念过去",
    ],
    targetUsers: [
      "怀旧人群",
      "喜欢记录成长的人",
      "珍视回忆的用户",
    ],
    solutions: [
      "双展厅设计：成长展厅 + 藏品展厅",
      "复古胶片风格呈现",
      "每个藏品都有故事和照片",
    ],
    coreValue: [
      "每一步都算数",
      "用数字化方式保留珍贵记忆",
      "时光流转中的情感锚点",
    ],
    useCases: [
      "成长记录",
      "怀旧收藏展示",
      "家庭回忆整理",
    ],
    highlights: [
      "双展厅叙事结构",
      "复古胶片滤镜",
      "Lightbox 藏品展示",
    ],
    liveUrl: "https://xiaoluweb.com/toolbox/memories",
    tags: ["Framer Motion", "Lightbox", "复古胶片", "叙事设计"],
  },
];
