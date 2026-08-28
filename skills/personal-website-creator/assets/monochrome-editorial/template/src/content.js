// ============================================================================
// Monochrome Editorial — 全部用户内容都在这一个文件里。
// 生成网站时：只改本文件 + 把图片放进 public/ 即可，组件与样式不要动。
// ============================================================================

export const content = {
  // 首屏
  hero: {
    brand: "Your Name", // 顶栏品牌（点击回首页）
    stamp: "PORTFOLIO / CREATIVE / PERSONAL", // 首屏 kicker（大写英文短语）
    name: "Your Name", // 首屏巨型标题
    introLine1: "一句简短说明你的职业、身份或创作方向。",
    introLine2: "一句补充说明你的理念、兴趣或正在探索的主题。",
    location: "City, CN",
    availability: "Available for work & projects",
  },

  // 跑马灯关键词（也是技能标签）
  marquee: ["关键词一", "关键词二", "能力三", "方向四", "特色五"],

  // 作品集
  works: [
    {
      id: "01",
      title: "作品项目一",
      desc: "用一到两句话介绍这个作品解决的问题、特色或成果。",
      category: "作品类型",
      tags: ["标签一", "标签二"],
      image: "", // 留空则显示单色封面；填 "/works/work-01.png" 显示图片（自动灰度）
      year: "",
      href: "#", // 外链填 "https://…"；无链接填 "#"
    },
    {
      id: "02",
      title: "作品项目二",
      desc: "在这里填写第二个作品的简短介绍。",
      category: "Project",
      tags: ["tag-a", "tag-b"],
      image: "",
      year: "20XX",
      href: "#",
    },
    {
      id: "03",
      title: "作品项目三",
      desc: "在这里填写第三个作品的简短介绍。",
      category: "Writing",
      tags: ["tag-c"],
      image: "",
      year: "",
      href: "#",
    },
  ],

  // 关于我
  about: {
    profileName: "Your Name",
    profileImage: "/about/profile-placeholder.svg", // 头像，放进 public/about/
    postcardImage: "/about/postcard-placeholder.svg", // 明信片图，放进 public/about/
    fromLabel: "Your Name",
    toLabel: "Your Audience",
    greeting: "Hello, nice to meet you.",
    body: "用一段自然的第一人称文字介绍你是谁、你关注什么、你希望别人通过这个网站了解什么。",
  },

  // 个人经历（竖向时间线，从上到下）
  experiences: [
    {
      year: "20XX",
      period: "实习 · Internship",
      role: "职位或身份",
      company: "公司或组织",
      tags: ["标签一", "标签二"],
      desc: "概括这段经历中的职责、贡献、成果或能力沉淀。",
    },
    {
      year: "20XX",
      period: "教育 · Education",
      role: "学历或身份",
      company: "学校或组织",
      tags: ["标签一"],
      desc: "概括这段经历中的学习、项目、研究方向或成长。",
    },
  ],

  // 联系我
  contact: {
    lead: "如果你想聊项目、实习机会、内容创作，或者只是交换一个好用的效率工具，欢迎联系我。",
    phoneHref: "tel:00000000000",
    phoneText: "000-0000-0000",
    emailHref: "mailto:hello@example.com",
    emailText: "hello@example.com",
  },
};
