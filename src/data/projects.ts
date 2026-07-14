/**
 * 作品项目数据 —— LeafBook 翻页展示 + 作品集网格展示
 */

export interface Project {
  id: string;          // 唯一标识符
  title: string;       // 作品名称
  tag: string;         // 定位/分类标签
  painPoint: string;   // 痛点定位 —— 一行醒目 Slogan
  description: string; // 作品简介
  imageUrl: string;    // 作品截图
  videoUrl?: string;   // 可选 —— 演示视频
  link?: string;       // 可选 —— 外链
  liveUrl: string;     // 独立部署链接
  tags?: string[];     // 技术标签数组
}

export const projects: Project[] = [
  {
    id: "forest-healing",
    title: "森林疗愈室",
    tag: "沉浸式疗愈网页",
    painPoint: "专为 i 人设计的低能耗回血方案",
    description: "一片流动的森林，随时间变化光影，内置五种白噪音，可以调节音量，点击树叶会掉落并播放音效，帮助你安静放空。这是一个纯粹的情绪出口，在这里你不需要做任何决策。",
    imageUrl: "/projects/0-forest-healing.png",
    liveUrl: "https://xiaoluweb.com/",
    tags: ["React", "Framer Motion", "Web Audio", "Tailwind", "沉浸式设计"],
  },
  {
    id: "system-tuning",
    title: "爱情公寓 · AI 朋友圈",
    tag: "AI 角色扮演 · 社交模拟",
    painPoint: "让 AI 角色在朋友圈里活起来",
    description: "完整还原微信社交产品形态，支持单聊、群聊、发现、朋友圈、通讯录。每条朋友圈支持用户评论，对应角色会自动 AI 回复，高度还原每个角色性格。支持用户发布动态，AI 角色会点赞评论，完全沉浸互动体验。",
    imageUrl: "/projects/1-system-tuning.png",
    liveUrl: "https://xiaoluweb.com/toolbox/answer",
    tags: ["React", "TypeScript", "AI 生成", "LLM 角色扮演", "WebSocket 对话", "数据持久化"],
  },
  {
    id: "quest-log",
    title: "通关清单",
    tag: "游戏化 To-Do 管理",
    painPoint: "把人生变成一场 RPG",
    description: "将生活任务转化为游戏任务，每个任务完成可以获得经验值，升级后解锁成就，让平凡日常也有闯关打怪的乐趣。支持任务分类、等级系统、成就系统，帮助你保持前进动力。",
    imageUrl: "/projects/2-quest-log.png",
    liveUrl: "https://xiaoluweb.com/toolbox/quests",
    tags: ["React", "Framer Motion", "游戏化设计", "LocalStorage", "成就系统"],
  },
  {
    id: "inventory",
    title: "物资管家",
    tag: "个人库存管理应用",
    painPoint: "家里囤了什么东西，保质期一目了然",
    description: "记录家中物资、食品、药品的购买日期和保质期，临近过期会提醒。分类管理，搜索筛选，帮助你避免过期浪费，保持生活井然有序。极简设计，开箱即用。",
    imageUrl: "/projects/3-inventory.png",
    liveUrl: "https://xiaoluweb.com/toolbox/supplies",
    tags: ["React", "TypeScript", "LocalStorage", "分类搜索", "提醒机制"],
  },
  {
    id: "advice-shop",
    title: "解忧杂货铺",
    tag: "治愈系问答空间",
    painPoint: "总有一句话，能解开你的心结",
    description: "收录了 100+ 治愈句子，点击随机翻牌，每次翻开都是惊喜。心情不好的时候来抽一张，说不定就能得到你想要的答案。轻量、安静、温柔。",
    imageUrl: "/projects/4-advice-shop.png",
    liveUrl: "https://xiaoluweb.com/toolbox/advice",
    tags: ["React", "Framer Motion", "情感化设计", "LocalStorage"],
  },
  {
    id: "travel-guide",
    title: "漫游指南",
    tag: "旅行足迹与攻略",
    painPoint: "走过的路，看过的云",
    description: "手绘风格中国地图，标注走过的城市，点击可以查看旅行游记和照片。用 SVG 路径绘制，点击有呼吸动画，记录每一段旅程的风景与心情。",
    imageUrl: "/projects/5-travel-guide.png",
    liveUrl: "https://xiaoluweb.com/toolbox/travel",
    tags: ["SVG", "Framer Motion", "胶片美学", "交互地图"],
  },
  {
    id: "recharge-list",
    title: "回血清单",
    tag: "i 人低能耗回血",
    painPoint: "允许一切崩塌，只做一件极小的事",
    description: "收集了 50+ 极小行动，帮你在情绪耗竭的时候快速回血。每一个行动都不超过 5 分钟，点击标记完成，可以看到自己回血的历史。微小也是力量。",
    imageUrl: "/projects/6-recharge-list.png",
    liveUrl: "https://xiaoluweb.com/toolbox/recharge",
    tags: ["3D Transform", "Framer Motion", "LocalStorage", "情绪疗愈"],
  },
  {
    id: "stress-relief",
    title: "解压馆",
    tag: "交互式解压小游戏",
    painPoint: "允许一切失控，除了你的心跳",
    description: "收集三款解压小游戏：消散（三消归零，万念俱散）、斩断（一刀两断，万物可裂）、吞噬（画下的都会落下）。每个游戏都是独立完整实现，支持关卡进度保存，帮助你在紧张间隙释放压力。",
    imageUrl: "/projects/7-stress-relief.png",
    liveUrl: "https://xiaoluweb.com/toolbox/games",
    tags: ["Canvas", "SVG", "Web Audio", "游戏开发", "三消算法"],
  },
  {
    id: "memory-museum",
    title: "时光博物馆",
    tag: "双展厅回忆录",
    painPoint: "每一步都算数",
    description: "两个展厅：「成长展厅」记录成长关键节点，「藏品展厅」展示怀旧数码产品。用复古胶片风格，每个藏品都有故事和照片，带我们回到那个充满期待的年代。",
    imageUrl: "/projects/8-memory-museum.png",
    liveUrl: "https://xiaoluweb.com/toolbox/memories",
    tags: ["Framer Motion", "Lightbox", "复古胶片", "叙事设计"],
  },
  {
    id: "life-slices",
    title: "第七卷胶片",
    tag: "生活切面音乐馆",
    painPoint: "一卷胶片，六个画面",
    description: "把生活切成六片：阅读、摄影、音乐、运动、冥想、追剧。每个切面都可以记录你喜欢的东西，比如正在读的书、拍的照片、常听的歌。用立体手绘胶卷动画展开，充满生活质感。",
    imageUrl: "/projects/9-life-slices.png",
    liveUrl: "https://xiaoluweb.com/film",
    tags: ["Framer Motion", "Web Audio", "胶卷美学", "CRUD", "数据持久化"],
  },
];
