/**
 * useAdminGuard.ts
 *
 * 统一管理员权限守卫 Hook。
 *
 * 所有涉及「添加 / 编辑 / 删除 / 上传」的页面/组件，
 * 在执行敏感操作前调用 verifyAdmin(callback)，
 * 若当前未登录管理员，则自动弹出密码框，验证通过后执行 callback。
 */

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isAdmin, unlockAdmin, logoutAdmin, loadAdminSession } from "../utils/siteData";

export interface AdminGuardResult {
  /** 当前是否是管理员 */
  isAdmin: boolean;
  /** 验证管理员权限，成功后执行 callback */
  verifyAdmin: (callback: () => void) => void;
  /** 退出管理员 */
  logout: () => void;
  /** 密码框 UI（需渲染在 JSX 中） */
  AdminGuardUI: React.FC;
}

export function useAdminGuard(): AdminGuardResult {
  const [admin, setAdmin] = useState(() => isAdmin());
  const [showModal, setShowModal] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  /* 页面加载时恢复会话 */
  useEffect(() => {
    loadAdminSession();
    setAdmin(isAdmin());
  }, []);

  const verifyAdmin = useCallback((callback: () => void) => {
    if (isAdmin()) {
      callback();
      return;
    }
    setPendingAction(() => callback);
    setPwInput("");
    setPwError(false);
    setShowModal(true);
  }, []);

  const handleUnlock = useCallback(() => {
    if (unlockAdmin(pwInput)) {
      setAdmin(true);
      setShowModal(false);
      setPwInput("");
      // 延迟执行 pending action，确保状态已更新
      if (pendingAction) {
        const action = pendingAction;
        setPendingAction(null);
        setTimeout(action, 0);
      }
    } else {
      setPwError(true);
    }
  }, [pwInput, pendingAction]);

  const handleLogout = useCallback(() => {
    logoutAdmin();
    setAdmin(false);
  }, []);

  const AdminGuardUI: React.FC = useCallback(() => (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0, zIndex: 999,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
          }}
          onClick={() => { setShowModal(false); setPendingAction(null); }}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 20 }}
            style={{
              background: "#fff", borderRadius: 16, padding: 32,
              width: "90%", maxWidth: 320, boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              textAlign: "center",
            }}
            onClick={e => e.stopPropagation()}
          >
            <h4 style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 16, margin: "0 0 8px", color: "#4a4038" }}>
              {admin ? "管理面板" : "管理员验证"}
            </h4>
            <p style={{ fontSize: 12, color: "#8a8a8a", margin: "0 0 20px" }}>
              {admin ? "当前已进入编辑模式" : "编辑、删除和上传功能需要管理员权限"}
            </p>
            {!admin && (
              <input
                type="password"
                value={pwInput}
                onChange={e => { setPwInput(e.target.value); setPwError(false); }}
                onKeyDown={e => { if (e.key === "Enter") handleUnlock(); }}
                placeholder="输入密码"
                style={{
                  width: "100%", padding: "10px 14px",
                  marginBottom: pwError ? 6 : 16,
                  border: `1.5px solid ${pwError ? "#e57373" : "#e0ddd5"}`,
                  borderRadius: 10, fontSize: 14, outline: "none",
                  textAlign: "center", boxSizing: "border-box",
                }}
                autoFocus
              />
            )}
            {pwError && (
              <p style={{ fontSize: 11, color: "#e57373", margin: "0 0 12px" }}>密码错误</p>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { setShowModal(false); setPendingAction(null); }}
                style={{
                  flex: 1, padding: "9px 0", border: "1.5px solid #e0ddd5",
                  borderRadius: 999, background: "transparent", color: "#8a7a6a",
                  cursor: "pointer", fontSize: 13,
                }}
              >
                取消
              </button>
              {!admin ? (
                <button
                  onClick={handleUnlock}
                  style={{
                    flex: 1, padding: "9px 0", border: "none",
                    borderRadius: 999, background: "#8D9A8B", color: "#fff",
                    cursor: "pointer", fontSize: 13,
                  }}
                >
                  确认
                </button>
              ) : (
                <button
                  onClick={() => { handleLogout(); setShowModal(false); }}
                  style={{
                    flex: 1, padding: "9px 0", border: "none",
                    borderRadius: 999, background: "#e57373", color: "#fff",
                    cursor: "pointer", fontSize: 13,
                  }}
                >
                  退出登录
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  ), [showModal, admin, pwInput, pwError, handleUnlock, handleLogout]);

  return {
    isAdmin: admin,
    verifyAdmin,
    logout: handleLogout,
    AdminGuardUI,
  };
}
