import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserAuth } from "../context/UserAuthContext";

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
}

export default function UserAuthModal({ isOpen, onClose, defaultMode = "login" }: UserAuthModalProps) {
  const { login, register } = useUserAuth();
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setUsername("");
    setPassword("");
    setConfirmPw("");
    setError("");
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const switchMode = (m: "login" | "register") => {
    setMode(m);
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    if (!username.trim() || !password) {
      setError("请填写完整信息");
      return;
    }
    if (mode === "register" && password !== confirmPw) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);
    const result = mode === "login"
      ? login(username.trim(), password)
      : register(username.trim(), password);
    setLoading(false);

    if (result.success) {
      reset();
      onClose();
    } else {
      setError(result.error || "操作失败");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(30, 30, 30, 0.45)",
          }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 24, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              background: "#faf8f5",
              borderRadius: 16,
              padding: "32px 28px",
              width: "90%",
              maxWidth: 340,
              boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#9a9a9a",
                fontSize: 18,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="关闭"
            >
              ×
            </button>

            {/* 标题 */}
            <h3
              style={{
                fontFamily: '"Noto Serif SC", Georgia, serif',
                fontSize: 18,
                fontWeight: 600,
                color: "#4a4038",
                margin: "0 0 6px",
                textAlign: "center",
                letterSpacing: "0.04em",
              }}
            >
              {mode === "login" ? "欢迎回来" : "创建账号"}
            </h3>
            <p
              style={{
                fontSize: 12,
                color: "#9a8a7a",
                margin: "0 0 24px",
                textAlign: "center",
              }}
            >
              {mode === "login" ? "登录后查看你的专属数据" : "注册后数据将与你绑定"}
            </p>

            {/* 表单 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder="用户名"
                maxLength={20}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1.5px solid #e0ddd5",
                  borderRadius: 10,
                  fontSize: 14,
                  outline: "none",
                  background: "#fff",
                  color: "#4a4038",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                autoFocus
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder="密码"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1.5px solid #e0ddd5",
                  borderRadius: 10,
                  fontSize: 14,
                  outline: "none",
                  background: "#fff",
                  color: "#4a4038",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
              {mode === "register" && (
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                  placeholder="确认密码"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1.5px solid #e0ddd5",
                    borderRadius: 10,
                    fontSize: 14,
                    outline: "none",
                    background: "#fff",
                    color: "#4a4038",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              )}
            </div>

            {error && (
              <p
                style={{
                  fontSize: 12,
                  color: "#c06060",
                  margin: "10px 0 0",
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}

            {/* 提交按钮 */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: 20,
                padding: "11px 0",
                border: "none",
                borderRadius: 999,
                background: "#7a9a7a",
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "all 0.2s ease",
                fontFamily: "inherit",
              }}
            >
              {loading ? "请稍候..." : mode === "login" ? "登录" : "注册"}
            </button>

            {/* 切换模式 */}
            <p
              style={{
                fontSize: 12,
                color: "#9a8a7a",
                margin: "14px 0 0",
                textAlign: "center",
              }}
            >
              {mode === "login" ? (
                <>
                  还没有账号？{" "}
                  <button
                    onClick={() => switchMode("register")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#5a7a5a",
                      cursor: "pointer",
                      fontSize: 12,
                      textDecoration: "underline",
                      padding: 0,
                      fontFamily: "inherit",
                    }}
                  >
                    立即注册
                  </button>
                </>
              ) : (
                <>
                  已有账号？{" "}
                  <button
                    onClick={() => switchMode("login")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#5a7a5a",
                      cursor: "pointer",
                      fontSize: 12,
                      textDecoration: "underline",
                      padding: 0,
                      fontFamily: "inherit",
                    }}
                  >
                    直接登录
                  </button>
                </>
              )}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
