import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

/**
 * 导航链接数据
 */
const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Lab", href: "#lab" },
  { label: "Resume", href: "#resume" },
];

/**
 * 极简树叶 Logo 图标 — 单色线条，颜色继承 currentColor
 */
const LeafLogo = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="navbar-logo"
  >
    {/* 叶片轮廓 */}
    <path
      d="M14 3 C8 5 5 10 5 15 C5 21 9 25 14 25 C19 25 23 21 23 15 C23 10 20 5 14 3 Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
    {/* 主叶脉 */}
    <line x1="14" y1="6" x2="14" y2="24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    {/* 侧脉 */}
    <path
      d="M14 11 L9 13 M14 11 L19 13 M14 15 L8 18 M14 15 L20 18 M14 19 L10 22 M14 19 L18 22"
      stroke="currentColor"
      strokeWidth="0.7"
      strokeLinecap="round"
      opacity="0.7"
    />
  </svg>
);

/**
 * Navbar 导航栏组件
 *
 * Glassmorphism 风格：
 * - bg-white/30 + backdrop-blur 玻璃拟态
 * - 悬浮于顶部，不贴死边缘（top-3 居中圆角）
 * - 左侧：极简树叶 Logo（替换原姓名文字）
 * - 右侧：导航链接 + 昼夜切换 + 汉堡菜单
 * - 滚动检测当前 section，选中项下方显示 2px 实线（#C9B99A）
 *
 * 风铃已改为全局 fixed 定位，不再嵌入导航栏
 */
const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  // 滚动检测当前所在 section（scroll spy）
  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.href.slice(1));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      {
        // 顶部留出导航栏高度的偏移
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.3, 0.5],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl">
      <nav className="bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg shadow-[#5a6e5a]/10 px-5 py-2.5 flex items-center justify-between">
        {/* 左侧：极简树叶 Logo */}
        <a
          href="#hero"
          className="text-[#3d3d3d] transition-colors duration-300 hover:text-[#b88c6a]"
          aria-label="返回首页"
        >
          <LeafLogo />
        </a>

        {/* 右侧：导航 + 昼夜切换 + 汉堡 */}
        <div className="flex items-center gap-4">
          {/* 桌面端导航 */}
          <ul className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <li key={link.href} className="group relative">
                  <a
                    href={link.href}
                    className={`relative text-sm font-medium tracking-wide transition-colors duration-300 ${
                      isActive
                        ? "text-[#3d3d3d]"
                        : "text-[#6b6b6b] group-hover:text-[#b88c6a]"
                    }`}
                  >
                    {link.label}
                    {/* 选中状态：2px 实线（#C9B99A） */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-line"
                        className="absolute -bottom-1.5 left-0 w-full h-0.5 rounded-full"
                        style={{ backgroundColor: "#C9B99A" }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    {/* hover 滑出指示线（非选中时） */}
                    {!isActive && (
                      <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[#b88c6a] rounded-full transition-all duration-300 group-hover:w-full" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* 昼夜模式切换 */}
          <ThemeToggle />

          {/* 移动端汉堡按钮 */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="切换菜单"
          >
            <motion.span
              className="block w-5 h-0.5 bg-[#3d3d3d]"
              animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-5 h-0.5 bg-[#3d3d3d]"
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-5 h-0.5 bg-[#3d3d3d]"
              animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </nav>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg overflow-hidden"
          >
            <ul className="flex flex-col items-center gap-5 py-6">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={`relative text-base font-medium transition-colors duration-300 ${
                        isActive ? "text-[#3d3d3d]" : "text-[#6b6b6b] hover:text-[#b88c6a]"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                      {isActive && (
                        <span
                          className="absolute -bottom-1.5 left-0 w-full h-0.5 rounded-full"
                          style={{ backgroundColor: "#C9B99A" }}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
