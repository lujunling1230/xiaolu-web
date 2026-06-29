import { motion } from "framer-motion";
import LeafCard from "./LeafCard";

/**
 * Projects 组件 — 森林落叶风格
 *
 * 所有项目卡片设计为"树叶"形态：
 * - LeafCard 组件：CSS clip-path 叶片形状 + 叶脉 SVG 纹理
 * - 飘落入场动画（leaf-fall keyframes），每张卡片延迟 0.2s
 * - 落地后微风浮动（leaf-breeze）
 * - Hover 生长感：上浮 12px + 旋转归零 + 背景变亮 + 叶脉清晰
 *
 * 布局：网格 + 卡片高度不一（small/medium/large）模拟叶片大小差异
 * 间距宽松（gap-12），避免叶片重叠
 *
 * 配色由 CSS 变量控制，昼夜模式自动切换
 */

// 项目数据 — variant 控制叶片大小，restRotate 控制自然散落角度
const projects = [
  {
    id: 1,
    name: "智能手环商城",
    subtitle: "Smart Band E-Commerce",
    tech: "SpringBoot",
    description:
      "基于 SpringBoot 的智能手环电商平台，覆盖商品浏览、购物车、订单、支付的电商全链路。独立撰写 PRD 文档并完成数据库表结构设计，包含用户、商品、订单、支付等核心模块。",
    tags: [
      { label: "PRD 撰写", type: "tech" as const },
      { label: "数据库设计", type: "tech" as const },
      { label: "电商全链路", type: "tech" as const },
      { label: "SpringBoot", type: "tech" as const },
    ],
    image:
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&h=400&fit=crop",
    link: "#",
    variant: "medium" as const,
    restRotate: -3,
  },
  {
    id: 2,
    name: "Mindful Corner",
    subtitle: "AI 疗愈室",
    tech: "AI · 情感化交互",
    description:
      "探索 AI 在情绪健康领域的应用，包含感恩日记、冥想引导、疗愈播客三大模块。以情感化交互设计为核心，让 AI 成为温柔的情绪陪伴者，体现 Human-Centric AI 理念。",
    tags: [
      { label: "感恩日记", type: "emotion" as const },
      { label: "冥想引导", type: "emotion" as const },
      { label: "播客", type: "emotion" as const },
      { label: "情感化 AI", type: "emotion" as const },
    ],
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop",
    link: "#lab",
    variant: "large" as const,
    restRotate: 2,
  },
];

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-24 px-6 bg-[#f5efe6]/40">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#3d3d3d] mb-2 tracking-wide">
            Projects
          </h2>
          <div className="flex items-center gap-2">
            <span className="h-px w-12 bg-[#b88c6a]" />
            <span className="text-xs text-[#b88c6a] tracking-widest">
              森林落叶 · 项目藏晶
            </span>
          </div>
        </motion.div>

        {/* 叶片卡片网格 — 间距宽松避免重叠 */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {projects.map((project, index) => (
            <LeafCard
              key={project.id}
              delay={index * 0.2}
              restRotate={project.restRotate}
              href={project.link}
              variant={project.variant}
            >
              {/* 项目截图 — 圆角内嵌，不超出叶片内容区 */}
              <div className="relative overflow-hidden h-36 mb-5 rounded-2xl">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* 底部渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                {/* 技术栈角标 */}
                <div className="absolute top-3 left-3 px-3 py-1 text-xs bg-[#faf6f0]/85 backdrop-blur-sm text-[#b88c6a] rounded-full border border-[rgba(184,140,106,0.2)]">
                  {project.tech}
                </div>
              </div>

              {/* 标题 — hover 变陶土棕 */}
              <h3 className="text-xl font-extrabold text-[#3d3d3d] mb-1 transition-colors duration-300 group-hover:text-[#b88c6a]">
                {project.name}
              </h3>
              <p className="text-xs text-[#b0b0b0] mb-4 tracking-wide">
                {project.subtitle}
              </p>

              {/* 描述 */}
              <p className="text-sm text-[#6b6b6b] leading-relaxed mb-5">
                {project.description}
              </p>

              {/* 标签 — 胶囊状，技术类蓝绿/情感类暖棕 */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag.label} className={`specimen-tag ${tag.type}`}>
                    {tag.label}
                  </span>
                ))}
              </div>
            </LeafCard>
          ))}
        </div>

        {/* 底部装饰 — 落叶飘散提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-3 mt-16"
        >
          <span className="text-xs text-[#8a8a8a] italic tracking-wide">
            每一片落叶，都是一段成长的印记
          </span>
          <span className="text-sm">🍂</span>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
