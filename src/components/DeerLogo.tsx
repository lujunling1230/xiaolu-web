import React from "react";

/**
 * Rosy 小鹿 Logo —— 粉色跳跃小鹿（精确还原参考图姿势）
 * 使用透明背景 PNG 图片
 */
const DeerLogo: React.FC<{ size?: number; className?: string; alt?: string }> = ({
  size = 36,
  className = "",
  alt = "Rosy 小鹿",
}) => (
  <img
    src="/deer-logo.png"
    alt={alt}
    width={size}
    height={size}
    style={{
      width: size,
      height: size,
      objectFit: "contain",
      display: "block",
    }}
    className={className}
  />
);

export default DeerLogo;
