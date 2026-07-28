import { useState, useEffect } from "react";

/**
 * 微信内置浏览器检测 + 引导提示
 * 微信扫一扫打开网页时，PWA 安装功能不可用，
 * 需要引导用户点击右上角"在浏览器中打开"。
 */
export default function WeChatGuide() {
  const [isWeChat, setIsWeChat] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const wx = /micromessenger/.test(ua);
    setIsWeChat(wx);
    if (!wx) return;

    // 检查是否已关闭过
    const closed = sessionStorage.getItem("wx_guide_dismissed");
    if (closed === "1") setDismissed(true);
  }, []);

  if (!isWeChat || dismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.75)",
        color: "#fff",
        padding: "16px 20px",
        fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
        fontSize: 14,
        lineHeight: 1.7,
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        backdropFilter: "blur(4px)",
      }}
    >
      <span style={{ fontSize: 20 }}>👆</span>
      <span>
        点击右上角 <strong>···</strong> 菜单，选择<strong>"在浏览器中打开"</strong>，即可添加到桌面
      </span>
      <button
        onClick={() => {
          setDismissed(true);
          sessionStorage.setItem("wx_guide_dismissed", "1");
        }}
        style={{
          background: "rgba(255,255,255,0.2)",
          border: "none",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: "14px",
          fontSize: 13,
          cursor: "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        知道了
      </button>
    </div>
  );
}