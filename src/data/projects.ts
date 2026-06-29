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
    imageUrl: "/forest-bg.jpg",
    liveUrl: "https://forest-healing.vercel.app",
    link: "https://forest-healing.vercel.app",
    tags: ["React", "Framer Motion", "Web Audio"],
  },
  {
    id: "answer-book",
    title: "5%答案书",
    tag: "轻决策小程序",
    painPoint: "给选择困难症的一颗轻量解药",
    description:
      "当你被选项淹没、迟迟无法下决定时，它不替你做主，只递给你一句刚好够用的提示——把纠结的能耗，悄悄降回 5%。",
    imageUrl: "/project-mindful.jpg",
    liveUrl: "https://answer-book.vercel.app",
    link: "https://answer-book.vercel.app",
    tags: ["React", "TypeScript", "轻交互"],
  },
  {
    id: "breathing-forest",
    title: "呼吸之森",
    tag: "正念呼吸引导器",
    painPoint: "三分钟，按下焦虑的暂停键",
    description:
      "以 4-7-8 呼吸法为节律的 SVG 引导器，叶脉随呼吸张合，配合环境音，让紧绷的神经在三个呼吸里慢慢松开。",
    imageUrl: "/healing-breathing.jpg",
    liveUrl: "https://breathing-forest.vercel.app",
    link: "https://breathing-forest.vercel.app",
    tags: ["SVG 动画", "CSS Transform", "正念"],
  },
  {
    id: "meditation-space",
    title: "冥想空间",
    tag: "可定时冥想工具",
    painPoint: "把五分钟，安静地还给自己",
    description:
      "内置四种自然声景与温柔语音提示的冥想计时器。不必专注，只需坐下，让声音替你保管时间。",
    imageUrl: "/healing-meditation.jpg",
    liveUrl: "https://meditation-space.vercel.app",
    link: "https://meditation-space.vercel.app",
    tags: ["Web Audio", "SpeechSynthesis", "计时器"],
  },
  {
    id: "gratitude-journal",
    title: "感恩手账",
    tag: "翻页式情绪日记",
    painPoint: "每天一句，把无处安放的情绪接住",
    description:
      "十二个月封面的翻页式手账，记录每天一件值得感谢的小事。年末翻回，会看见一整年悄悄发着光的自己。",
    imageUrl: "/healing-gratitude.jpg",
    liveUrl: "https://gratitude-journal.vercel.app",
    link: "https://gratitude-journal.vercel.app",
    tags: ["Framer Motion", "LocalStorage", "日记"],
  },
];
