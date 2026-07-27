import { useEffect } from "react";

/**
 * 动态注入 PWA manifest 链接，用于每个作品独立的 PWA 配置。
 * 当用户访问作品页面时，浏览器会识别到对应的 manifest，
 * 从而允许用户将该作品作为独立应用"安装"到桌面。
 */
export function useAppManifest(manifestUrl: string) {
  useEffect(() => {
    if (!manifestUrl) return;

    // 移除之前的 manifest（如果有）
    const existing = document.querySelector('link[rel="manifest"]');
    if (existing) {
      existing.setAttribute("href", manifestUrl);
      return;
    }

    // 创建新的 manifest link
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = manifestUrl;
    document.head.appendChild(link);

    // 不做清理，保持当前作品的 manifest
  }, [manifestUrl]);
}
