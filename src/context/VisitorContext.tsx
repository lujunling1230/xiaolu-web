import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

/**
 * VisitorContext — 全局访客状态
 *
 * 穿越结界后存储用户输入的名字，全站可访问。
 * 默认名字 "Explorer"。
 */

interface VisitorContextValue {
  /** 访客名字 */
  visitorName: string;
  /** 设置访客名字（穿越时调用） */
  setVisitorName: (name: string) => void;
  /** 是否已完成穿越（用于控制遮罩卸载） */
  hasEntered: boolean;
  /** 标记穿越完成 */
  markEntered: () => void;
}

const VisitorCtx = createContext<VisitorContextValue | null>(null);

export const useVisitor = (): VisitorContextValue => {
  const ctx = useContext(VisitorCtx);
  if (!ctx) throw new Error("useVisitor must be used within VisitorProvider");
  return ctx;
};

interface VisitorProviderProps {
  children: ReactNode;
}

export const VisitorProvider: React.FC<VisitorProviderProps> = ({ children }) => {
  const [visitorName, setVisitorNameState] = useState("Explorer");
  const [hasEntered, setHasEntered] = useState(false);

  const setVisitorName = useCallback((name: string) => {
    const trimmed = name.trim();
    setVisitorNameState(trimmed || "Explorer");
  }, []);

  const markEntered = useCallback(() => {
    setHasEntered(true);
  }, []);

  const value: VisitorContextValue = {
    visitorName,
    setVisitorName,
    hasEntered,
    markEntered,
  };

  return <VisitorCtx.Provider value={value}>{children}</VisitorCtx.Provider>;
};
