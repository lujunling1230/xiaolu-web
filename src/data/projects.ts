/**
 * 项目数据源 — Project Data Source
 *
 * 所有项目数据集中在此文件管理，方便后续扩展和修改。
 * 新增项目：复制一个对象，修改字段，粘贴到数组末尾即可。
 *
 * 字段说明：
 * - title       作品名称
 * - painPoint   痛点定位（一行醒目 Slogan）
 * - description 作品简介
 * - imageUrl    作品截图
 * - liveUrl     独立部署链接（点击作品视觉区在新标签打开）
 * - tag / link / tags  兼容其他展示组件（PortfolioGallery 等）
 */

export interface Project {
  id: string;
  title: string;        // 作品名称
  tag: string;          // 定位/分类（兼容其他组件）
  painPoint: string;    // 痛点定位 — 一行醒目 Slogan
  description: string;  // 作品简介
  imageUrl: string;     // 作品截图路径
  videoUrl?: string;    // 可选 演示视频
  link?: string;        // 可选 外链（兼容其他组件）
  liveUrl: string;      // 独立部署链接
  tags?: string[];      // 可选 技术标签
}

export const projects: Project[] = [
  {
    id: "forest-healing",
    title: "森林疗愈室",
    tag: "沉浸式疗愈网页",
    painPoint: "专为 i 人设计的低能耗回血方案",
    description:
      "融合自然白噪音、呼吸引导与感恩日记的沉浸式疗愈网页，依昼夜节律切换森林光影与萤火粒子，为社交耗竭后的你留一处安静的角落。",
    imageUrl:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=600&fit=crop",
    liveUrl: "https://xiaolu-web.vercel.app/",
    link: "https://xiaolu-web.vercel.app/",
    tags: ["React", "Framer Motion", "Web Audio"],
  },
  {
    id: "system-tuning",
    title: "系统调频",
    tag: "认知调频工具",
    painPoint: "校准频率，让信号重新清晰",
    description:
      "基于李松蔚《5%的改变》的认知调频工具。以收音机调频为隐喻：描述困扰 → 旋钮扫频 → 信号清晰 → 输出 5% 微改变。与解忧杂货铺形成情绪/认知双轨。",
    imageUrl:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop",
    liveUrl: "https://xiaolu-web.vercel.app/toolbox/answer",
    link: "https://xiaolu-web.vercel.app/toolbox/answer",
    tags: ["React", "Web Audio", "认知行为"],
  },
  {
    id: "quest-log",
    title: "通关清单",
    tag: "游戏化 To-Do",
    painPoint: "把人生变成一场 RPG",
    description:
      "游戏化任务清单，支持智能任务拆解（5分钟倒计时 / 60点低难度 / 直接挑战），完成时有粒子爆炸与经验值增长动画，把启动阻力降到最低。",
    imageUrl:
      "https://images.unsplash.com/photo-1612404730960-5c71577fca11?w=800&h=600&fit=crop",
    liveUrl: "https://xiaolu-web.vercel.app/toolbox/quests",
    link: "https://xiaolu-web.vercel.app/toolbox/quests",
    tags: ["React", "Framer Motion", "游戏化"],
  },
  {
    id: "inventory",
    title: "物资管家",
    tag: "库存管理应用",
    painPoint: "库存与保质期，一目了然",
    description:
      "SaaS 风格的库存管理应用，左侧表单右侧列表，支持分类统计、保质期预警与删除动画，数据持久化于 localStorage，生活物资尽在掌握。",
    imageUrl:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=600&fit=crop",
    liveUrl: "https://xiaolu-web.vercel.app/toolbox/inventory",
    link: "https://xiaolu-web.vercel.app/toolbox/inventory",
    tags: ["React", "TypeScript", "LocalStorage"],
  },
  {
    id: "advice-shop",
    title: "解忧杂货铺",
    tag: "治愈系问答空间",
    painPoint: "总有一句话，能解开你的心结",
    description:
      "烛光摇曳的信纸式问答空间，写下烦恼，选择心灵/脑洞/工作/情感分类，一封回信缓缓升起。情绪轨治愈，与系统调频的认知轨互补。",
    imageUrl:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop",
    liveUrl: "https://xiaolu-web.vercel.app/toolbox/advice",
    link: "https://xiaolu-web.vercel.app/toolbox/advice",
    tags: ["React", "Framer Motion", "情感化交互"],
  },
  {
    id: "travel-guide",
    title: "漫游指南",
    tag: "旅行足迹与攻略",
    painPoint: "走过的路，看过的云",
    description:
      "胶片质感的旅行足迹记录，简化版中国地图按省份着色，横向城市卡片滚动浏览，点击展开吃住玩攻略详情，把每一次出发都收进胶卷。",
    imageUrl:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    liveUrl: "https://xiaolu-web.vercel.app/toolbox/travel",
    link: "https://xiaolu-web.vercel.app/toolbox/travel",
    tags: ["SVG", "Framer Motion", "胶片美学"],
  },
  {
    id: "recharge-list",
    title: "回血清单",
    tag: "i 人低能耗回血",
    painPoint: "允许一切崩塌，只做一件极小的事",
    description:
      "拍立得式 3D 翻转卡片随机抽取低能耗小事，瀑布流展示全部任务，点击「今天做了」记录每周能量值，社交耗竭后用最小动作回血。",
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",
    liveUrl: "https://xiaolu-web.vercel.app/toolbox/recharge",
    link: "https://xiaolu-web.vercel.app/toolbox/recharge",
    tags: ["3D Transform", "Framer Motion", "LocalStorage"],
  },
  {
    id: "stress-relief",
    title: "解压馆",
    tag: "交互式解压游戏",
    painPoint: "允许一切崩塌",
    description:
      "三款解压游戏集合：无限捏泡泡（SVG 网格爆裂）、禅意切割（拖拽切片动画）、重力涂鸦（Canvas 物理重力绘画），马龙配色，60fps 纯 CSS/Canvas 实现。",
    imageUrl:
      "https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=800&h=600&fit=crop",
    liveUrl: "https://xiaolu-web.vercel.app/toolbox/games",
    link: "https://xiaolu-web.vercel.app/toolbox/games",
    tags: ["Canvas", "SVG", "Web Audio"],
  },
  {
    id: "memory-museum",
    title: "时光博物馆",
    tag: "双展厅回忆录",
    painPoint: "每一步都算数",
    description:
      "复古胶片质感博物馆，时代回响厅横向时间轴陈列怀旧藏品，荣耀之路厅纵向时间轴展示成就里程碑，点击展品进入灯箱放大，尘埃粒子缓缓飘落。",
    imageUrl:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=600&fit=crop",
    liveUrl: "https://xiaolu-web.vercel.app/toolbox/memories",
    link: "https://xiaolu-web.vercel.app/toolbox/memories",
    tags: ["Framer Motion", "Lightbox", "复古胶片"],
  },
  {
    id: "life-slices",
    title: "第七卷胶片",
    tag: "胶卷音乐馆",
    painPoint: "一卷胶片，六个画面",
    description:
      "暗房感胶卷布局，6 个生活片段以画框交错排列在胶卷两侧。点击「音乐/播客」进入枯木生歌子页：黑胶唱片旋转、嫩芽生长、音符飘动，收藏夹式氛围展示。",
    imageUrl:
      "https://images.unsplash.com/photo-1483412468200-72182a8a3232?w=800&h=600&fit=crop",
    liveUrl: "https://xiaolu-web.vercel.app/life",
    link: "https://xiaolu-web.vercel.app/life",
    tags: ["Framer Motion", "Web Audio", "胶卷美学"],
  },
];
