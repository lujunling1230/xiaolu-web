import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

/**
 * ThemeContext — 昼夜模式管理
 *
 * 逻辑：
 * 1. 进入网站时读取本地时间，06:00-18:00 昼模式，18:00-06:00 夜模式
 * 2. 用户手动切换后写入 localStorage，下次优先读取
 * 3. 所有页面通过 CSS 变量同步切换
 */

type ThemeMode = "day" | "night";

interface ThemeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
  isDay: boolean;
  isNight: boolean;
}

const ThemeCtx = createContext<ThemeContextValue | null>(null);

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

// 根据时间判断默认模式
const getModeByTime = (): ThemeMode => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? "day" : "night";
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>("day");

  // 初始化：优先读 localStorage，否则按时间判断
  useEffect(() => {
    const stored = localStorage.getItem("theme-mode") as ThemeMode | null;
    if (stored === "day" || stored === "night") {
      setMode(stored);
    } else {
      setMode(getModeByTime());
    }
  }, []);

  // 模式变化时更新 CSS 变量 + body class
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "night") {
      root.setAttribute("data-theme", "night");
    } else {
      root.setAttribute("data-theme", "day");
    }
  }, [mode]);

  // 手动切换
  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === "day" ? "night" : "day";
      localStorage.setItem("theme-mode", next);
      return next;
    });
  }, []);

  const value: ThemeContextValue = {
    mode,
    toggleTheme,
    isDay: mode === "day",
    isNight: mode === "night",
  };

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
};
