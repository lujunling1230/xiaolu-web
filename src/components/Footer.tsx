/**
 * Footer 组件 — 最终版页脚
 *
 * 胶片风视觉：淡米背景 + 细边框 + 衬线字体
 * 包含：版权信息 / 邮箱复制 / 简历下载 / 社交图标 / Slogan / 回到顶部
 */

import { useState, useCallback } from "react";

interface FooterProps {
  /** 双击 Logo 唤出管理员密码框 */
  onAdminTap?: () => void;
  /** 是否处于管理员模式 */
  adminMode?: boolean;
  /** 发布草稿 */
  onPublish?: () => void;
  /** 退出编辑 */
  onLogout?: () => void;
}

const Footer: React.FC<FooterProps> = ({
  onAdminTap,
  adminMode = false,
  onPublish,
  onLogout,
}) => {
  const [copied, setCopied] = useState(false);

  /* ---------- 邮箱复制 ---------- */
  const copyEmail = useCallback(async () => {
    const realEmail = "15294705967@163.com";
    try {
      await navigator.clipboard.writeText(realEmail);
    } catch {
      // 降级方案
      const input = document.createElement("input");
      input.value = realEmail;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  /* ---------- 回到顶部 ---------- */
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <footer
      id="footer"
      className="relative py-12 px-6 border-t border-[rgba(255,255,255,0.4)] backdrop-blur-[8px]"
      style={{
        fontFamily: '"Noto Serif SC", "DIN Alternate", Georgia, serif',
        backgroundColor: "rgba(255, 255, 255, 0.65)",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.02)",
      }}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-5 text-[13px] text-[#5A6B5C]">
        {/* ═════ 第一行：版权 ═════ */}
        <p
          className="text-center cursor-default select-none"
          onClick={onAdminTap}
        >
          🌿 © 2026 路俊玲 · AI 产品经理作品集
        </p>

        {/* ═════ 第二行：邮箱 + 简历 ═════ */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {/* 邮箱 — 点击复制 */}
          <button
            onClick={copyEmail}
            className="group relative flex items-center gap-1.5 hover:text-[#8D9A8B] transition-colors duration-300 cursor-pointer bg-transparent border-none"
            style={{ fontFamily: "inherit" }}
            title="点击复制邮箱"
          >
            <span>邮箱：lujunling[at]163.com</span>
            {/* 已复制提示 */}
            {copied && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#8D9A8B] text-white text-[11px] rounded whitespace-nowrap">
                ✓ 已复制
              </span>
            )}
          </button>

          {/* 下载简历 */}
          <a
            href="/resume.pdf"
            download
            className="flex items-center gap-1.5 hover:text-[#8D9A8B] transition-colors duration-300"
          >
            <span>📄</span>
            <span className="hidden sm:inline">下载简历 PDF</span>
          </a>
        </div>

        {/* ═════ 第三行：社交媒体图标（细线 SVG） ═════ */}
        <div className="flex items-center gap-5 mt-1">
          {/* GitHub */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5A6B5C] hover:text-[#8D9A8B] transition-colors duration-300"
            aria-label="GitHub"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>

          {/* 知乎 */}
          <a
            href="https://www.zhihu.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5A6B5C] hover:text-[#8D9A8B] transition-colors duration-300"
            aria-label="知乎"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M9 10h6M9 14h4" />
            </svg>
          </a>

          {/* 小红书 */}
          <a
            href="https://www.xiaohongshu.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5A6B5C] hover:text-[#8D9A8B] transition-colors duration-300"
            aria-label="小红书"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5A6B5C] hover:text-[#8D9A8B] transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" rx="1" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        </div>

        {/* ═════ 第四行：Slogan ═════ */}
        <p
          className="text-[#666] text-[13px] tracking-wide mt-1"
          style={{ fontFamily: '"Noto Serif SC", serif' }}
        >
          用理性架构世界，用感性记录光阴
        </p>

        {/* ═════ 第五行：回到顶部 ═════ */}
        <button
          onClick={scrollToTop}
          className="mt-2 flex items-center gap-1 text-[#5A6B5C] hover:text-[#8D9A8B] transition-colors duration-300 cursor-pointer bg-transparent border-none"
          style={{ fontFamily: "inherit" }}
        >
          <span>↑</span>
          <span>回到顶部</span>
        </button>

        {/* ═════ 管理员入口提示 ═════ */}
        <p
          className="text-[11px] text-[#c0c0c0] cursor-default select-none"
          style={{ fontFamily: "inherit" }}
        >
          双击唤出管理面板
        </p>

        {/* ═════ 管理员操作按钮 ═════ */}
        {adminMode && onPublish && onLogout && (
          <div className="flex gap-2.5 justify-center">
            <button
              onClick={onPublish}
              className="px-4 py-1.5 text-xs rounded-full bg-[#8D9A8B] text-white cursor-pointer border-none hover:bg-[#7a8a7a] transition-colors"
            >
              发布草稿
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-1.5 text-xs rounded-full bg-transparent text-[#5A6B5C] cursor-pointer border border-[rgba(90,107,92,0.25)] hover:border-[#8D9A8B] hover:text-[#8D9A8B] transition-colors"
            >
              退出编辑
            </button>
          </div>
        )}
      </div>

      {/* ═════ 右下角点缀 ═════ */}
      <span
        className="hidden sm:block absolute bottom-4 right-6 text-[12px] text-[#777] select-none"
        style={{ fontFamily: '"Dancing Script", "Pacifico", "Brush Script MT", cursive' }}
      >
        have a nice day ~ ling
      </span>
    </footer>
  );
};

export default Footer;
