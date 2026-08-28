// ============================================================================
// Hand-drawn Paper — user-facing content lives here.
// When generating a site, replace this file and public assets; keep components
// and styles unchanged unless a local text-fit adjustment is required.
// ============================================================================

export const content = {
  hero: {
    brand: "Your Name",
    eyebrow: "Portfolio / Work / Story",
    name: "Your Name",
    introLine1: "在这里填写你的身份简介。",
    introLine2: "在这里填写一句个人理念",
    introLine3: "让访问者快速记住你的方向与价值",
  },

  workSection: {
    eyebrow: "Selected Work",
    title: "展示你的代表作品，让别人先看见你做过什么。",
  },

  works: [
    {
      title: "作品项目一",
      type: "Project Type",
      year: "20XX",
      description: "在这里填写第一个作品的简短介绍。",
      detail: "在这里填写更完整的作品说明，例如目标用户、设计过程、技术实现或结果数据。",
      tags: ["标签一", "标签二", "标签三"],
      color: "blue",
      image: "",
    },
    {
      title: "作品项目二",
      type: "Project Type",
      year: "20XX",
      description: "在这里填写第二个作品的简短介绍。",
      detail: "在这里填写作品的背景、亮点和你希望访问者记住的成果。",
      tags: ["标签一", "标签二", "标签三"],
      color: "yellow",
      image: "",
    },
    {
      title: "作品项目三",
      type: "Project Type",
      year: "20XX",
      description: "在这里填写第三个作品的简短介绍。",
      detail: "如果用户只提供两个作品，可以删除这一项并保持布局自适应。",
      tags: ["标签一", "标签二"],
      color: "green",
      image: "",
    },
    {
      title: "长期方向",
      type: "Personal Thread",
      year: "Now",
      description: "在这里填写你的长期关注方向或个人主题。",
      detail: "这一项适合放持续创作、长期研究或职业主线。",
      tags: ["方向一", "方向二"],
      color: "pink",
      image: "",
    },
  ],

  aboutSection: {
    eyebrow: "About Me",
    title: "关于我：经历、能力和长期关注的方向。",
  },

  about: {
    name: "Your Name",
    profileImage: "/about/profile-placeholder.svg",
    profileAlt: "Profile placeholder",
    body:
      "在这里填写你的个人介绍。可以说明你的职业身份、擅长方向、正在做的事，以及希望别人通过这个网站了解你的重点。",
  },

  skills: ["能力标签", "作品方向", "行业关键词", "工具方法", "个人特色"],

  experiences: [
    {
      role: "教育经历",
      company: "学校或专业",
      period: "EDU",
      detail: "在这里填写教育经历、研究方向、社团活动或代表成果。",
    },
    {
      role: "项目经历",
      company: "项目或团队",
      period: "PROJECT",
      detail: "在这里填写项目职责、工作方法和关键结果。",
    },
    {
      role: "工作经历",
      company: "公司或组织",
      period: "WORK",
      detail: "在这里填写工作内容、协作范围、业务影响或沉淀经验。",
    },
  ],

  contact: {
    eyebrow: "Contact",
    title: "Contact",
    items: [
      { label: "PHONE", value: "000-0000-0000", href: "tel:00000000000" },
      { label: "EMAIL", value: "hello@example.com", href: "mailto:hello@example.com" },
    ],
  },

  footer: "Made by Your Name · hand-drawn portfolio",
};
