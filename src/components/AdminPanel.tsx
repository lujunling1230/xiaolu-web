import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logoutAdmin } from "../utils/siteData";
import AnalyticsDashboard from "./AnalyticsDashboard";

/* ============================================================
 * AdminPanel 组件（精简版）
 * 仅保留：数据分析看板 + 退出登录
 * ============================================================ */

interface AdminPanelProps {
  onClose: () => void;
  onLogout?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onLogout }) => {
  const [showAnalytics, setShowAnalytics] = useState(false);

  /** 退出管理员 */
  const handleLogout = useCallback(() => {
    logoutAdmin();
    if (onLogout) onLogout();
    onClose();
  }, [onClose, onLogout]);

  return (
    <>
      {/* 遮罩层 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(0,0,0,0.2)",
        }}
        onClick={onClose}
      />

      {/* 滑出面板 */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: 420,
          zIndex: 9999,
          background: "rgba(255,253,249,0.96)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "-8px 0 40px rgba(80,76,66,0.12)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 面板头部 */}
        <div
          style={{
            padding: "28px 28px 20px",
            borderBottom: "1px solid #E8E6E1",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontFamily: '"Noto Serif SC", Georgia, serif',
                fontSize: 18,
                color: "#4a4038",
                letterSpacing: "0.06em",
              }}
            >
              ✦ 管理员模式 ✦
            </h3>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#a8a39b",
                fontSize: 22,
                padding: 4,
                lineHeight: 1,
                transition: "color 0.25s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#8D9A8B")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#a8a39b")}
            >
              ×
            </button>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "#a8a39b" }}>
            查看全站埋点数据与访客分析
          </p>
        </div>

        {/* 功能列表 */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "20px 28px",
          }}
        >
          {/* 数据分析入口 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 18px",
              background: "#FAF9F6",
              border: "1px solid #E8E6E1",
              borderRadius: 12,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(232,133,58,0.4)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(232,133,58,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E8E6E1";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>📊</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 500, color: "#4a4038" }}>
                  数据分析
                </div>
                <div style={{ fontSize: 11, color: "#a8a39b", marginTop: 2 }}>
                  PV / UV / 访客数 / 漏斗 / 趋势
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAnalytics(true)}
              style={{
                padding: "7px 16px",
                border: "1px solid #d5cfc4",
                borderRadius: 999,
                background: "transparent",
                color: "#7a7268",
                cursor: "pointer",
                fontSize: 12,
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#E8853A";
                e.currentTarget.style.color = "#C06A2E";
                e.currentTarget.style.background = "rgba(232,133,58,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#d5cfc4";
                e.currentTarget.style.color = "#7a7268";
                e.currentTarget.style.background = "transparent";
              }}
            >
              查看
            </button>
          </div>
        </div>

        {/* 底部操作区 */}
        <div
          style={{
            padding: "18px 28px",
            borderTop: "1px solid #E8E6E1",
            display: "flex",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              flex: 1,
              padding: "10px 0",
              border: "1.5px solid #E8E6E1",
              borderRadius: 999,
              background: "transparent",
              color: "#7a7268",
              cursor: "pointer",
              fontSize: 13,
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#c44";
              e.currentTarget.style.color = "#c44";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E8E6E1";
              e.currentTarget.style.color = "#7a7268";
            }}
          >
            退出登录
          </button>
        </div>
      </motion.div>

      {/* 数据分析看板弹窗 */}
      <AnimatePresence>
        {showAnalytics && (
          <AnalyticsModal onClose={() => setShowAnalytics(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

/* -----------------------------------------------------------
 * AnalyticsModal 数据分析全屏弹窗
 * ----------------------------------------------------------- */
const AnalyticsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 10001,
      background: "rgba(0,0,0,0.35)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    }}
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.92, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.92, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      style={{
        background: "#fff",
        borderRadius: 18,
        width: "100%",
        maxWidth: 900,
        maxHeight: "90vh",
        overflow: "auto",
        boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <AnalyticsDashboard />
    </motion.div>
  </motion.div>
);

export default AdminPanel;
