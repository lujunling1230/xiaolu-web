import { motion } from "framer-motion";

/**
 * Resume 组件 — 简历概览
 *
 * 简要展示经历与技能，提供联系方式入口
 */

// 经历数据
const experiences = [
  {
    title: "AI 产品经理（方向）",
    org: "情感化交互 · Human-Centric AI",
    desc: "专注于 AI 在情绪健康与情感化交互领域的应用，主导 Mindful Corner 疗愈室产品设计与迭代。",
    tags: ["Prompt Engineering", "用户洞察", "情感化设计"],
  },
  {
    title: "智能手环商城 · 全栈实践",
    org: "SpringBoot 电商项目",
    desc: "独立完成 PRD 撰写、数据库表结构设计与全链路开发，涵盖用户、商品、订单、支付模块。",
    tags: ["SpringBoot", "SQL", "PRD", "原型设计"],
  },
  {
    title: "软件工程专业学习",
    org: "河南工学院 / 安阳职业技术学院",
    desc: "系统学习软件工程核心课程，打下扎实的编程基础与工程思维，为产品工作提供技术理解力支撑。",
    tags: ["软件工程", "数据结构", "数据库"],
  },
];

const Resume: React.FC = () => {
  return (
    <section id="resume" className="py-24 px-6 bg-[#f5efe6]/40">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-medium text-[#3d3d3d] mb-2 tracking-wide">
            Resume
          </h2>
          <div className="flex items-center gap-2">
            <span className="h-px w-12 bg-[#b88c6a]" />
            <span className="text-xs text-[#b88c6a] tracking-widest">个人简历</span>
          </div>
        </motion.div>

        {/* 经历列表 */}
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="glass-card rounded-2xl p-6 md:p-8 border border-[#e8e0d5] card-shadow card-lift"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* 左侧序号 */}
                <div className="flex-shrink-0">
                  <span
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#b88c6a]/10 text-[#b88c6a] font-medium text-sm"
                    style={{ fontFamily: '"Noto Serif SC", serif' }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* 右侧内容 */}
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-[#3d3d3d] mb-1">
                    {exp.title}
                  </h3>
                  <p className="text-sm text-[#b88c6a] mb-3 tracking-wide">
                    {exp.org}
                  </p>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed mb-4">
                    {exp.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs text-[#8a8a8a] bg-[#faf6f0] rounded-full border border-[#e8e0d5]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 底部联系引导 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-[#8a8a8a] mb-4">想了解更多？</p>
          <a
            href="#footer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#b88c6a] text-[#fffdf9] rounded-full text-sm hover:bg-[#9c7355] transition-colors duration-300"
          >
            联系我
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Resume;
