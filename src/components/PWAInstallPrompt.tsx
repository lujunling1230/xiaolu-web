/* eslint-disable */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * PWA 安装引导组件
 * - 安卓/Chrome：显示"安装到桌面"按钮，一键安装
 * - iOS Safari：显示手动添加步骤
 * - 已安装或已拒绝：自动隐藏
 */
export default function PWAInstallPrompt() {
  // PWA 安装提示已全局禁用
  return null;
}
