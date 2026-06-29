import { useTheme } from "../context/ThemeContext";

/**
 * ThemeToggle 昼夜模式切换按钮
 *
 * - 固定右上角（避开导航栏居中区域）
 * - ☀️ 昼模式 / 🌙 夜模式
 * - 点击强制切换并写入 localStorage
 * - CSS transition 平滑过渡图标旋转
 * - 玻璃拟态风格与导航栏统一
 */
const ThemeToggle: React.FC = () => {
  const { isDay, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={isDay ? "切换到夜间模式" : "切换到日间模式"}
      title={isDay ? "切换到夜间模式" : "切换到日间模式"}
      data-clickable
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb">
          <span className="theme-toggle-icon">
            {isDay ? "☀️" : "🌙"}
          </span>
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
