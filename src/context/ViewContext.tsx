import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

/**
 * ViewContext — 全局视图状态管理
 *
 * 管理森林世界与各子世界之间的场景切换。
 * view: "forest"（森林主世界）| "about" | "projects" | "lab"
 *
 * navigate(view) 切换视图，back() 回到森林主世界。
 */

export type View = "forest" | "about" | "projects" | "lab";

interface ViewContextValue {
  view: View;
  /** 切换到指定视图 */
  navigate: (view: View) => void;
  /** 回到森林主世界 */
  back: () => void;
}

const ViewCtx = createContext<ViewContextValue | null>(null);

export const useView = (): ViewContextValue => {
  const ctx = useContext(ViewCtx);
  if (!ctx) throw new Error("useView must be used within ViewProvider");
  return ctx;
};

interface ViewProviderProps {
  children: ReactNode;
}

export const ViewProvider: React.FC<ViewProviderProps> = ({ children }) => {
  const [view, setView] = useState<View>("forest");

  const navigate = useCallback((next: View) => {
    setView(next);
  }, []);

  const back = useCallback(() => {
    setView("forest");
  }, []);

  const value: ViewContextValue = { view, navigate, back };

  return <ViewCtx.Provider value={value}>{children}</ViewCtx.Provider>;
};
