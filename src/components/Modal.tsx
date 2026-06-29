import { motion, AnimatePresence } from "framer-motion";

/**
 * Modal 通用模态框组件
 *
 * 用于承载 Lab 三个跟练模块的交互界面
 * 点击遮罩或关闭按钮可关闭，ESC 键也可关闭
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, subtitle, children }) => {
  // ESC 键关闭
  if (typeof window !== "undefined") {
    window.onkeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 遮罩层 */}
          <div
            className="absolute inset-0 bg-[#3d3d3d]/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 模态框主体 */}
          <motion.div
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#fffdf9] rounded-2xl border border-[#e8e0d5] shadow-2xl"
            initial={{ scale: 0.92, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* 头部 */}
            <div className="sticky top-0 bg-[#fffdf9]/95 backdrop-blur-sm px-6 py-5 border-b border-[#e8e0d5] flex items-center justify-between z-10">
              <div>
                <h3 className="text-xl font-medium text-[#3d3d3d]" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-[#b88c6a] tracking-wide mt-1">{subtitle}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[#8a8a8a] hover:text-[#3d3d3d] hover:bg-[#faf6f0] rounded-full transition-all duration-200"
                aria-label="关闭"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 内容区 */}
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
