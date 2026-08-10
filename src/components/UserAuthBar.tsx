import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserAuth } from "../context/UserAuthContext";
import UserAuthModal from "./UserAuthModal";

/**
 * UserAuthBar — 顶部用户信息栏
 *
 * 已登录：显示用户名 + 退出按钮
 * 未登录：显示登录/注册入口
 *
 * 使用方式：放在各工具页面的顶部导航区域
 */

interface UserAuthBarProps {
  style?: React.CSSProperties;
  /** 紧凑暗色模式：适配深色背景页面（如通关清单） */
  compact?: boolean;
}

export default function UserAuthBar({ style, compact }: UserAuthBarProps) {
  const { isLoggedIn, username, logout } = useUserAuth();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // 紧凑模式配色（暗色背景）
  const c = compact
    ? { border: "rgba(255,255,255,0.12)", bg: "rgba(255,255,255,0.06)", text: "#d1d5db", avatarBg: "#4b5563" }
    : { border: "rgba(122,154,106,0.35)", bg: "rgba(122,154,106,0.08)", text: "#5a7a5a", avatarBg: "#7a9a7a" };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          ...style,
        }}
      >
        {isLoggedIn ? (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowDropdown((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 999,
                border: `1.5px solid ${c.border}`,
                background: c.bg,
                color: c.text,
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s ease",
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: c.avatarBg,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                {username?.charAt(0).toUpperCase()}
              </span>
              <span>{username}</span>
              <span style={{ fontSize: 10, opacity: 0.6 }}>▼</span>
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    right: 0,
                    background: "#fff",
                    borderRadius: 10,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    padding: "6px",
                    minWidth: 120,
                    zIndex: 100,
                  }}
                >
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "none",
                      borderRadius: 8,
                      background: "transparent",
                      color: "#8a6a6a",
                      fontSize: 12,
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = "#faf5f5";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = "transparent";
                    }}
                  >
                    退出登录
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 点击外部关闭下拉 */}
            {showDropdown && (
              <div
                onClick={() => setShowDropdown(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 99,
                }}
              />
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "5px 14px",
              borderRadius: 999,
              border: `1.5px solid ${c.border}`,
              background: c.bg,
              color: c.text,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
            }}
          >
            登录 / 注册
          </button>
        )}
      </div>

      <UserAuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
