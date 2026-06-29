// 生命之书 —— 关于"我"的六页故事数据
// 被 AboutWorld.tsx 消费，按 page.type 渲染不同布局。

export interface AboutPage {
  id: number;
  type: "cover" | "intro" | "background" | "hobbies" | "contact" | "backcover";
  title?: string;
  subtitle?: string;
  content?: string;
  // P3 背景用：成长轨迹时间轴
  timeline?: { period: string; title: string; desc: string }[];
  // P4 爱好用：五项爱好插画
  hobbies?: { name: string; icon: string; desc: string }[];
  // P5 联系用：联系方式（邮票/火漆印章）
  contacts?: {
    label: string;
    value: string;
    link: string;
    type: "email" | "github" | "linkedin";
  }[];
  // P6 封底
  ending?: string;
}

export const aboutPages: AboutPage[] = [
  {
    id: 1,
    type: "cover",
    title: "路俊玲",
    subtitle: "AI Product Manager",
    content: "Building Human-Centric AI Products",
  },
  {
    id: 2,
    type: "intro",
    content:
      "从软件工程的代码世界出发，我逐渐走向 AI 产品的舞台。曾经，我以为产品是用逻辑堆砌的工程；后来才懂，好的产品源自对人的理解——技术是手段，温柔才是底色。每一个需求背后，藏着未被言说的渴望；每一次轻触，都是人与世界的一次低语。愿以产品为舟，载着理性与温柔，驶向更有人情味的远方。",
  },
  {
    id: 3,
    type: "background",
    timeline: [
      {
        period: "2024 — 至今",
        title: "AI 产品经理（实习）",
        desc: "参与 AI 产品从 0 到 1 的构建，撰写 PRD、设计交互原型，探索大模型在情感陪伴与疗愈场景的落地。",
      },
      {
        period: "本科阶段",
        title: "河南工学院 · 软件工程",
        desc: "系统学习软件工程方法论，掌握数据结构、数据库与 Web 开发，为产品思维打下坚实的技术根基。",
      },
      {
        period: "专科阶段",
        title: "安阳职业技术学院",
        desc: "夯实计算机基础，培养工程实践能力，开启技术与产品融合的探索之旅。",
      },
    ],
  },
  {
    id: 4,
    type: "hobbies",
    hobbies: [
      { name: "阅读", icon: "book", desc: "书页中长出知识树" },
      { name: "自然", icon: "nature", desc: "蜿蜒小路通向森林深处" },
      { name: "摄影", icon: "camera", desc: "用镜头定格光影" },
      { name: "咖啡", icon: "coffee", desc: "杯中升起袅袅热气" },
      { name: "音乐", icon: "music", desc: "五线谱缠绕心弦" },
    ],
  },
  {
    id: 5,
    type: "contact",
    contacts: [
      {
        label: "Email",
        value: "junling@example.com",
        link: "mailto:junling@example.com",
        type: "email",
      },
      {
        label: "GitHub",
        value: "github.com",
        link: "https://github.com",
        type: "github",
      },
      {
        label: "LinkedIn",
        value: "linkedin.com",
        link: "https://linkedin.com",
        type: "linkedin",
      },
    ],
  },
  {
    id: 6,
    type: "backcover",
    ending: "Let's build something magical.",
  },
];
