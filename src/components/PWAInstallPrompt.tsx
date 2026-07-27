import { useState, useEffect } from "react";

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
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 检查是否已以 standalone 模式运行（已安装）
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
    if (standalone) return;

    // 检测 iOS Safari
    const ua = navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua) && !/crios|fxios/.test(ua);
    setIsIOS(ios);

    // 检测是否已安装（通过 localStorage 标记）
    const dismissed = localStorage.getItem("pwa_install_dismissed");
    if (dismissed === "1") return;

    // 捕获 beforeinstallprompt 事件（Chrome/Edge/安卓）
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS Safari 没有 beforeinstallprompt，直接显示提示
    if (ios && !standalone) {
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("pwa_install_dismissed", "1");
  };

  if (!isVisible || isStandalone) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        padding: "16px 20px",
        maxWidth: "340px",
        width: "90%",
        textAlign: "center",
        fontFamily: "'Microsoft YaHei', sans-serif",
        border: "1px solid #eee",
      }}
    >
      <button
        onClick={handleDismiss}
        style={{
          position: "absolute",
          top: "8px",
          right: "12px",
          background: "none",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
          color: "#999",
        }}
      >
        &times;
      </button>

      {deferredPrompt ? (
        <>
          <p style={{ margin: "0 0 12px", fontSize: "14px", color: "#333" }}>
            将此应用安装到桌面，像原生 App 一样使用
          </p>
          <button
            onClick={handleInstall}
            style={{
              background: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "24px",
              padding: "10px 28px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            安装到桌面
          </button>
        </>
      ) : isIOS ? (
        <>
          <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#333" }}>
            添加到主屏幕，像 App 一样使用
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "#666", lineHeight: 1.6 }}>
            1. 点击 Safari 底部
            <span style={{ margin: "0 2px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" style={{ verticalAlign: "middle" }}>
                <path d="M12 5v14M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            分享按钮
            <br />
            2. 选择"添加到主屏幕"
          </p>
        </>
      ) : null}
    </div>
  );
}
