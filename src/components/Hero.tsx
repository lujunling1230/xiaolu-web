import { motion } from "framer-motion";

/**
 * Hero 组件 — 首页主视觉
 *
 * 排版优化版：
 * - 头像偏左上，不与名字重叠
 * - 名字加大加粗（text-5xl → text-6xl，font-bold）
 * - Slogan 字号缩小，灰色 #666
 * - 正文左对齐，行高 1.8，段间距加大
 * - 整体紧凑，减少多余留白
 */
const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-28 pb-12 px-6"
    >
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
          {/* 左侧：头像 + 姓名 + Slogan */}
          <motion.div
            className="flex flex-col items-center md:items-start text-center md:text-left flex-shrink-0"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 圆角圆形头像 — 向左上微调 */}
            <div className="relative mb-5 md:mb-6 md:-mt-4">
              <div className="absolute inset-0 rounded-full bg-[#b88c6a]/15 blur-xl scale-110" />
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#fffdf9] shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
                  alt="路俊玲"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* 姓名 — 加大加粗 */}
            <motion.h1
              className="text-5xl md:text-6xl font-bold text-[#3d3d3d] mb-2 tracking-wide"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              路俊玲
            </motion.h1>

            {/* Slogan — 字号缩小，灰色 #666 */}
            <motion.p
              className="text-sm text-[#666] tracking-wide font-light"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Building Human-Centric AI Products
            </motion.p>
          </motion.div>

          {/* 右侧：自我介绍 — 左对齐，行高 1.8，紧凑 */}
          <motion.div
            className="flex-1 max-w-md md:pt-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* 装饰性竖线 */}
            <div className="hidden md:block w-px h-24 bg-gradient-to-b from-[#b88c6a]/40 to-transparent mb-5" />

            <p className="text-[#5a5a5a] text-base mb-5" style={{ lineHeight: 1.8 }}>
              软件工程背景出身，在代码与需求文档之间找到了真正的热爱——
              <span className="text-[#b88c6a]">成为 AI 产品经理</span>。
            </p>
            <p className="text-[#6b6b6b] text-sm mb-5" style={{ lineHeight: 1.8 }}>
              我相信好的 AI 产品不只是技术的堆砌，更应理解人的情感与需求。
              专注于情感化交互设计，探索技术如何温柔地陪伴每一个人。
            </p>
            <p className="text-[#8a8a8a] text-sm italic" style={{ lineHeight: 1.8 }}>
              "让 AI 有温度，让产品懂人心。"
            </p>

            {/* 装饰性分隔 */}
            <div className="flex items-center gap-3 mt-6">
              <span className="h-px flex-1 bg-[#e8e0d5]" />
              <span className="text-[#b88c6a] text-xs tracking-widest">风过铃鸣</span>
              <span className="h-px flex-1 bg-[#e8e0d5]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
