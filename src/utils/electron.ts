/**
 * electron.ts
 *
 * 环境检测：判断当前是否运行在 Electron 桌面端。
 * Electron 环境下隐藏浏览器导航元素（如返回按钮）。
 */

/** 判断是否为 Electron 环境 */
export function isElectron(): boolean {
  if (typeof window === "undefined") return false;
  // Electron 会注入 window.process 和 navigator.userAgent 包含 "Electron"
  return !!(window as any).process?.versions?.electron
    || navigator.userAgent.includes("Electron");
}
