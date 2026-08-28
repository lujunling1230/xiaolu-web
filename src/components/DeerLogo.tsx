import React from "react";

/**
 * Rosy 小鹿 Logo —— 粉色跳跃小鹿
 * 简化自参考图，适配导航栏小尺寸
 */
const DeerLogo: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* 鹿角 - 左 */}
    <path
      d="M26 12 C24 8, 22 6, 20 4 C18 6, 20 8, 22 10 C20 12, 18 14, 16 16 C18 18, 22 16, 24 14"
      stroke="#A0522D"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* 鹿角 - 右 */}
    <path
      d="M34 10 C34 6, 32 4, 30 2 C32 4, 34 6, 36 8 C34 10, 32 12, 30 14 C32 16, 36 14, 38 12"
      stroke="#A0522D"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* 耳朵 */}
    <ellipse cx="22" cy="18" rx="3" ry="5" fill="#FFB6C1" stroke="#DB7093" strokeWidth="1.2" transform="rotate(-20 22 18)" />
    <ellipse cx="36" cy="18" rx="3" ry="5" fill="#FFB6C1" stroke="#DB7093" strokeWidth="1.2" transform="rotate(15 36 18)" />
    
    {/* 头部 */}
    <ellipse cx="28" cy="22" rx="9" ry="8" fill="#FFB6C1" stroke="#DB7093" strokeWidth="1.5" />
    
    {/* 鼻子 */}
    <ellipse cx="20" cy="22" rx="2.5" ry="2" fill="#A0522D" />
    
    {/* 眼睛 */}
    <circle cx="26" cy="20" r="2" fill="#8B4513" />
    <circle cx="25.3" cy="19.3" r="0.7" fill="#fff" />
    
    {/* 微笑 */}
    <path d="M19 24 Q21 26, 23 25" stroke="#8B4513" strokeWidth="1" strokeLinecap="round" fill="none" />
    
    {/* 脸颊红晕 */}
    <circle cx="23" cy="25" r="1.5" fill="#FF9999" opacity="0.5" />
    
    {/* 脖子 */}
    <path d="M33 24 Q36 28, 36 34 L32 34 Q32 30, 30 26 Z" fill="#FFB6C1" stroke="#DB7093" strokeWidth="1.2" />
    
    {/* 身体 */}
    <ellipse cx="42" cy="36" rx="14" ry="10" fill="#FFB6C1" stroke="#DB7093" strokeWidth="1.5" />
    
    {/* 前腿 - 上（抬起） */}
    <path
      d="M34 38 Q28 36, 24 34 Q20 32, 18 34"
      stroke="#FFB6C1"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M34 38 Q28 36, 24 34 Q20 32, 18 34"
      stroke="#DB7093"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />
    {/* 前腿 - 下（抬起） */}
    <path
      d="M24 40 Q22 44, 20 46 Q18 48, 16 47"
      stroke="#FFB6C1"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M24 40 Q22 44, 20 46 Q18 48, 16 47"
      stroke="#DB7093"
      strokeWidth="1"
      strokeLinecap="round"
      fill="none"
    />
    {/* 前蹄 */}
    <ellipse cx="15.5" cy="47" rx="2" ry="1.5" fill="#A0522D" transform="rotate(-10 15.5 47)" />
    
    {/* 后腿 - 上 */}
    <path
      d="M48 42 Q50 48, 52 52 Q54 56, 56 56"
      stroke="#FFB6C1"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M48 42 Q50 48, 52 52 Q54 56, 56 56"
      stroke="#DB7093"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />
    {/* 后腿 - 下 */}
    <path
      d="M52 50 Q55 54, 57 56 Q59 58, 58 59"
      stroke="#FFB6C1"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M52 50 Q55 54, 57 56 Q59 58, 58 59"
      stroke="#DB7093"
      strokeWidth="1"
      strokeLinecap="round"
      fill="none"
    />
    {/* 后蹄 */}
    <ellipse cx="57.5" cy="59.5" rx="2" ry="1.5" fill="#A0522D" transform="rotate(5 57.5 59.5)" />
    
    {/* 另一条后腿（背景） */}
    <path
      d="M46 44 Q47 50, 48 54 Q49 57, 51 58"
      stroke="#F5A0AD"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      opacity="0.7"
    />
    <ellipse cx="51" cy="58.5" rx="1.8" ry="1.3" fill="#8B4513" opacity="0.7" />
    
    {/* 尾巴 */}
    <ellipse cx="55" cy="30" rx="3" ry="4" fill="#FFB6C1" stroke="#DB7093" strokeWidth="1.2" transform="rotate(30 55 30)" />
  </svg>
);

export default DeerLogo;
