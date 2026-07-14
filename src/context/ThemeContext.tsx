import { createContext, useContext, type ReactNode } from "react";

/**
 * ThemeContext — 固定日间模式（已取消夜间模式）
 */

type ThemeMode = "day";

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

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const value: ThemeContextValue = {
    mode: "day",
    toggleTheme: () => {},
    isDay: true,
    isNight: false,
  };

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
};
