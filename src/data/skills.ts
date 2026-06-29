// 技能数据类型定义
export interface Skill {
  name: string;
  level: number; // 1-100 百分比
}

// 技能数据列表
export const skills: Skill[] = [
  { name: "React / Next.js", level: 90 },
  { name: "TypeScript", level: 85 },
  { name: "Tailwind CSS", level: 88 },
  { name: "Node.js", level: 75 },
  { name: "Vue.js", level: 70 },
  { name: "Git / GitHub", level: 85 },
  { name: "Figma", level: 65 },
  { name: "Docker", level: 60 },
];
