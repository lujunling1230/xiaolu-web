import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * StandaloneContext — 单作品访问模式
 *
 * 场景：
 *   HR 访问：xiaoluweb.com/mickey → 全功能，能看所有作品
 *   用户访问：xiaoluweb.com/toolbox/advice?solo=1 → 仅当前作品，隐藏所有导航入口
 *
 * 用法：
 *   const { isSolo } = useSolo();
 *   {!isSolo && <Link to="/mickey">← 回到作品集</Link>}
 */

interface StandaloneContextValue {
  /** 是否为单作品独立访问模式 */
  isSolo: boolean;
  /** 生成带 solo 参数的链接（站内跳转时保持模式） */
  withSolo: (path: string) => string;
}

const StandaloneContext = createContext<StandaloneContextValue>({
  isSolo: false,
  withSolo: (p) => p,
});

export function StandaloneProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [isSolo, setIsSolo] = useState(false);

  // 从 URL 参数读取 solo 模式
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsSolo(params.get("solo") === "1");
  }, [location.search]);

  /** 在路径后附加 solo 参数（如果当前是 solo 模式） */
  const withSolo = (path: string): string => {
    if (!isSolo) return path;
    const sep = path.includes("?") ? "&" : "?";
    return `${path}${sep}solo=1`;
  };

  return (
    <StandaloneContext.Provider value={{ isSolo, withSolo }}>
      {children}
    </StandaloneContext.Provider>
  );
}

export function useSolo(): StandaloneContextValue {
  return useContext(StandaloneContext);
}
