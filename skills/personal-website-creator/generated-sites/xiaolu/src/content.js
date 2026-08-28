// ============================================================================
// Hand-drawn Paper — user-facing content lives here.
// ============================================================================

export const content = {
  hero: {
    brand: "Xiao Lu",
    eyebrow: "Portfolio / Works / Story",
    name: "\u5c0f\u9e7f",
    introLine1: "\u524d\u7aef\u4ea4\u4e92\u8bbe\u8ba1\u5e08 \u00b7 \u521b\u4f5c\u8005",
    introLine2: "\u7528\u4ee3\u7801\u7ed8\u5236\u6e29\u67d4\u7684\u4e16\u754c\uff0c",
    introLine3: "\u8ba9\u6bcf\u4e00\u6b21\u4ea4\u4e92\u90fd\u6709\u6545\u4e8b\u611f",
  },

  workSection: {
    eyebrow: "Selected Work",
    title: "\u8fd9\u662f\u6211\u505a\u8fc7\u7684\u4e00\u4e9b\u4e8b\uff0c\u5173\u4e8e\u4ea4\u4e92\u3001\u8bbe\u8ba1\u4e0e\u6280\u672f\u3002",
  },

  works: [
    {
      title: "疗愈室 MORI",
      type: "Wellness App",
      year: "2026",
      description: "一个温柔的心理疗愈陪伴App，以MORI小兔子为IP，融合情绪追踪、AI陪伴聊天、成长树游戏化与情绪日记。",
      detail: "复刻自小红书@小花超炫酷的UI鉴赏设计。包含6大模块：首页仪表盘（心情打卡、每日任务、陪伴统计）、情绪分析（周趋势折线图、情绪分布甜甜圈图、情绪小记）、AI陪伴聊天（MORI智能回复、快捷操作、对话记忆）、成长树（等级进度、成长任务、奖励解锁、星星收集）、情绪日记（日历选择、心情指数滑块、照片记录）、回忆相册（分类筛选、时光网格、回忆视频）。采用薰衣草紫+薄荷绿治愈配色，3D插画风格角色，圆角卡片与柔和阴影。",
      tags: ["HTML/CSS/JS", "情绪追踪", "AI陪伴", "游戏化", "数据可视化"],
      color: "pink",
      image: "",
      link: "/works/healing-room.html",
    },
    {
      title: "求职追踪器",
      type: "Productivity Tool",
      year: "2026",
      description: "一站式求职管理工具，集成面试进展追踪、简历管理、AI助手、求职渠道汇总、入职指南与工作SOP。",
      detail: "采用森林绿治愈风格，包含面试进展甘特图、数据概览看板、30天求职作战地图、PDF/Word简历解析、localStorage本地持久化等核心功能。7大导航模块覆盖求职全流程，支持书签标记与阶段追踪。",
      tags: ["HTML/CSS/JS", "PDF解析", "localStorage", "甘特图", "数据看板"],
      color: "blue",
      image: "",
      link: "https://cdn.jsdelivr.net/gh/lujunling1230/job-tracker-pm@main/app.xhtml",
    },
    {
      title: "AI \u4ea7\u54c1\u7ecf\u7406\u8ddf\u7ec3",
      type: "Interactive Game",
      year: "2026",
      description: "\u4e00\u6b3e\u6a21\u62df AI \u4ea7\u54c1\u7ecf\u7406\u4e00\u5929\u7684\u4ea4\u4e92\u6e38\u620f\uff0c\u5305\u542b30\u4e2a\u65e5\u5e38\u5267\u672c\u548c7\u4e2a\u5b8c\u6574\u6d41\u7a0b\u3002",
      detail: "\u4ece\u63a5\u9700\u6c42\u3001\u7ade\u54c1\u5206\u6790\u3001\u5199PRD\u3001\u753b\u539f\u578b\u5230\u9700\u6c42\u8bc4\u5ba1\u3001\u8ddf\u5f00\u53d1\u3001\u4e0a\u7ebf\u590d\u76d8\uff0c\u5168\u6d41\u7a0b\u4e92\u52a8\u6a21\u62df\u3002\u5305\u542b\u80fd\u529b\u96f7\u8fbe\u56fe\u3001\u7ed3\u5c40\u7cfb\u7edf\u3001\u62d6\u62fd\u6392\u5e8f\u3001Code Review \u627eBug\u7b49\u4ea4\u4e92\u73a9\u6cd5\u3002",
      tags: ["HTML/CSS/JS", "\u4ea4\u4e92\u6e21\u6761\u56fe", "\u62d6\u62fd\u6392\u5e8f", "\u6570\u636e\u770b\u677f"],
      color: "yellow",
      image: "",
    },
    {
      title: "\u6f2b\u6e38\u6307\u5357",
      type: "Web Experience",
      year: "2026",
      description: "\u4e00\u4e2a\u4ee5\u65c5\u884c\u4e3a\u4e3b\u9898\u7684\u6c89\u6d78\u5f0f\u7f51\u7ad9\uff0c\u878d\u5408\u6c34\u5f69\u610f\u5883\u4e0e\u65e5\u5f0f\u6781\u7b80\u7f8e\u5b66\u3002",
      detail: "\u91c7\u7528 React + Vite + Tailwind CSS + framer-motion \u6784\u5efa\uff0c\u5b9e\u73b0\u6c34\u5f69\u6652\u67d3\u80cc\u666f\u3001\u4e91\u96fe\u5c71\u9014\u7a7a\u7075\u611f\u3001\u975e\u5bf9\u79f0\u5e03\u5c40\u4e0e\u6781\u81f4\u7559\u767d\u3002\u52a8\u753b\u4f7f\u7528 CSS transform \u548c opacity\uff0c\u907f\u514d\u91cd\u7ed8\uff0c\u786e\u4fdd\u6027\u80fd\u6d41\u7545\u3002",
      tags: ["React", "framer-motion", "Tailwind CSS", "\u6c34\u5f69\u98ce\u683c"],
      color: "yellow",
      image: "",
    },
    {
      title: "\u4e2a\u4eba\u4f5c\u54c1\u96c6",
      type: "Portfolio",
      year: "2026",
      description: "\u624b\u7ed8\u7eb8\u611f\u98ce\u683c\u7684\u4e2a\u4eba\u4f5c\u54c1\u96c6\u7f51\u7ad9\uff0c\u5c55\u793a\u4f5c\u54c1\u3001\u7ecf\u5386\u4e0e\u8054\u7cfb\u65b9\u5f0f\u3002",
      detail: "\u57fa\u4e8e React + Vite \u6784\u5efa\uff0c\u91c7\u7528\u5976\u6cb9\u8272\u7eb8\u5f20\u80cc\u666f\u3001\u624b\u7ed8\u6d82\u9e26\u88c5\u9970\u3001\u81ea\u5b9a\u4e49\u5149\u6807\u3001\u70b9\u51fb\u7c92\u5b50\u6548\u679c\u4e0e\u6eda\u52a8\u63ed\u793a\u52a8\u753b\uff0c\u8425\u9020\u6e29\u6696\u624b\u4f5c\u611f\u3002",
      tags: ["React", "Vite", "\u624b\u7ed8\u98ce\u683c", "\u81ea\u5b9a\u4e49\u5149\u6807"],
      color: "green",
      image: "",
    },
    {
      title: "\u524d\u7aef\u4ea4\u4e92\u63a2\u7d22",
      type: "Personal Thread",
      year: "Now",
      description: "\u6301\u7eed\u63a2\u7d22\u4ea4\u4e92\u8bbe\u8ba1\u4e0e\u524d\u7aef\u6280\u672f\u7684\u4ea4\u53c9\u70b9\u3002",
      detail: "\u5173\u6ce8\u6c89\u6d78\u5f0f\u4f53\u9a8c\u3001\u60c5\u611f\u5316\u4ea4\u4e92\u3001\u6027\u80fd\u4f18\u5316\u4e0e\u89c6\u89c9\u53d9\u4e8b\uff0c\u8bd5\u56fe\u5728\u6280\u672f\u4e0e\u8bbe\u8ba1\u4e4b\u95f4\u627e\u5230\u5e73\u8861\u3002",
      tags: ["\u4ea4\u4e92\u8bbe\u8ba1", "\u89c6\u89c9\u53d9\u4e8b"],
      color: "pink",
      image: "",
    },
  ],

  aboutSection: {
    eyebrow: "About Me",
    title: "\u5173\u4e8e\u6211\uff1a\u505a\u8fc7\u7684\u4e8b\u3001\u4f1a\u7684\u4e1c\u897f\u3001\u60f3\u53bb\u7684\u65b9\u5411\u3002",
  },

  about: {
    name: "\u5c0f\u9e7f",
    profileImage: "/about/profile-placeholder.svg",
    profileAlt: "\u5c0f\u9e7f\u7684\u5934\u50cf",
    body:
      "\u6211\u662f\u4e00\u540d\u524d\u7aef\u4ea4\u4e92\u8bbe\u8ba1\u5e08\uff0c\u70ed\u8877\u4e8e\u7528\u4ee3\u7801\u521b\u9020\u6709\u6e29\u5ea6\u7684\u4f53\u9a8c\u3002\u64c5\u957f React\u3001Vite\u3001Tailwind CSS\u3001framer-motion\uff0c\u5bf9 CSS \u52a8\u753b\u548c SVG \u6709\u6df1\u5165\u7814\u7a76\u3002\u76f8\u4fe1\u597d\u7684\u4ea4\u4e92\u8bbe\u8ba1\u80fd\u8ba9\u4eba\u611f\u53d7\u5230\u88ab\u7406\u89e3\u548c\u88ab\u5c0a\u91cd\uff0c\u6bcf\u4e00\u4e2a\u52a8\u753b\u3001\u6bcf\u4e00\u4e2a\u8fc7\u6e21\u90fd\u5728\u4f20\u9012\u60c5\u611f\u3002",
  },

  skills: [
    "React",
    "Vite",
    "Tailwind CSS",
    "framer-motion",
    "TypeScript",
    "CSS \u52a8\u753b",
    "SVG",
    "Web Audio API",
    "\u4ea4\u4e92\u8bbe\u8ba1",
    "\u54cd\u5e94\u5f0f\u5e03\u5c40",
  ],

  experiences: [
    {
      role: "\u524d\u7aef\u5f00\u53d1",
      company: "\u4ea4\u4e92\u4f53\u9a8c\u9879\u76ee",
      period: "PROJECT",
      detail: "\u4f7f\u7528 React + Vite + Tailwind CSS \u6784\u5efa\u591a\u4e2a\u4ea4\u4e92\u578b\u7f51\u9879\u76ee\uff0c\u5305\u62ec\u6e21\u6761\u56fe\u6e38\u620f\u3001\u65c5\u884c\u6307\u5357\u3001\u4f5c\u54c1\u96c6\u7b49\uff0c\u6ce8\u91cd\u6027\u80fd\u4f18\u5316\u4e0e\u7528\u6237\u4f53\u9a8c\u3002",
    },
    {
      role: "\u4ea4\u4e92\u8bbe\u8ba1",
      company: "UI/UX \u8bbe\u8ba1",
      period: "DESIGN",
      detail: "\u8bbe\u8ba1\u65e5\u5f0f\u6587\u827a\u3001\u6c34\u5f69\u96fe\u5883\u3001\u624b\u7ed8\u7eb8\u611f\u7b49\u591a\u79cd\u89c6\u89c9\u98ce\u683c\uff0c\u5173\u6ce8\u52a8\u753b\u5fae\u4ea4\u4e92\u4e0e\u60c5\u611f\u5316\u4f53\u9a8c\u3002",
    },
    {
      role: "\u6301\u7eed\u5b66\u4e60",
      company: "\u524d\u7aef\u6280\u672f",
      period: "EDU",
      detail: "\u7cbe\u901a CSS \u52a8\u753b\u3001SVG \u5236\u4f5c\u3001Web Audio API\uff0c\u6301\u7eed\u63a2\u7d22\u6280\u672f\u4e0e\u8bbe\u8ba1\u7684\u4ea4\u53c9\u70b9\u3002",
    },
  ],

  contact: {
    eyebrow: "Contact",
    title: "Contact",
    items: [
      { label: "EMAIL", value: "hello@xiaolu.design", href: "mailto:hello@xiaolu.design" },
      { label: "GITHUB", value: "github.com/xiaolu", href: "https://github.com/xiaolu" },
    ],
  },

  footer: "Made by Xiao Lu \u00b7 hand-drawn portfolio",
};
