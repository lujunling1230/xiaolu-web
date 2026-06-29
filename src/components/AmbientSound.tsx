import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";

/**
 * AmbientSound 白噪音系统
 *
 * - 白天 / 浅色：/day-forest.mp3
 * - 夜晚 / 深色：/night-rain.mp3
 * - 右下角耳机图标（opacity 0.4，hover 显形）
 * - 首次播放由用户点击触发（浏览器限制）
 * - 主题切换：淡出 0.8s → 淡入 0.8s
 * - 音量 0.3，loop
 * - 开启：图标微脉动；关闭：图标变灰
 */

const VOLUME = 0.3;
const FADE_DURATION = 800; // ms

interface AmbientSoundProps {
  /**
   * "floating"（默认）：右下角固定浮动按钮
   * "navbar"：导航栏内联图标，无定位样式
   */
  variant?: "floating" | "navbar";
}

const AmbientSound: React.FC<AmbientSoundProps> = ({ variant = "floating" }) => {
  const { isNight } = useTheme();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 创建 / 切换音频源
  useEffect(() => {
    const src = isNight ? "/night-rain.mp3" : "/day-forest.mp3";

    // 如果已有音频在播放，做 cross-fade
    if (audioRef.current && playing) {
      const oldAudio = audioRef.current;
      // 淡出旧音频
      const oldVol = oldAudio.volume;
      const fadeOut = setInterval(() => {
        if (oldAudio.volume > 0.05) {
          oldAudio.volume = Math.max(0, oldAudio.volume - oldVol / (FADE_DURATION / 50));
        } else {
          clearInterval(fadeOut);
          oldAudio.pause();
        }
      }, 50);

      // 创建新音频并淡入
      const newAudio = new Audio(src);
      newAudio.loop = true;
      newAudio.volume = 0;
      audioRef.current = newAudio;
      newAudio.play().then(() => {
        const fadeIn = setInterval(() => {
          if (newAudio.volume < VOLUME - 0.02) {
            newAudio.volume = Math.min(VOLUME, newAudio.volume + VOLUME / (FADE_DURATION / 50));
          } else {
            newAudio.volume = VOLUME;
            clearInterval(fadeIn);
          }
        }, 50);
      }).catch(() => {
        // 自动播放被拦截，静默处理
        setPlaying(false);
      });

      return () => clearInterval(fadeOut);
    }

    // 非播放状态，仅更新 src 引用
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;
    audioRef.current.volume = VOLUME;
  }, [isNight]); // eslint-disable-line react-hooks/exhaustive-deps

  // 清理
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fadeRef.current) clearInterval(fadeRef.current);
    };
  }, []);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;

    if (playing) {
      // 暂停
      const audio = audioRef.current;
      const currentVol = audio.volume;
      const fade = setInterval(() => {
        if (audio.volume > 0.02) {
          audio.volume = Math.max(0, audio.volume - currentVol / 10);
        } else {
          clearInterval(fade);
          audio.pause();
          audio.volume = VOLUME;
        }
      }, 40);
      fadeRef.current = fade;
      setPlaying(false);
    } else {
      // 播放
      audioRef.current.volume = 0;
      audioRef.current.play().then(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const fade = setInterval(() => {
          if (audio.volume < VOLUME - 0.02) {
            audio.volume = Math.min(VOLUME, audio.volume + VOLUME / 10);
          } else {
            audio.volume = VOLUME;
            clearInterval(fade);
          }
        }, 40);
        fadeRef.current = fade;
      }).catch(() => {});
      setPlaying(true);
    }
  }, [playing]);

  const btnClass =
    variant === "navbar"
      ? `ambient-nav-btn ${playing ? "ambient-nav-playing" : "ambient-nav-muted"}`
      : `ambient-btn ${playing ? "ambient-playing" : "ambient-muted"}`;

  return (
    <>
      <button
        className={btnClass}
        onClick={toggle}
        aria-label={playing ? "关闭白噪音" : "开启白噪音"}
        title={playing ? (isNight ? "夜雨声" : "晨林鸟鸣") : "开启白噪音"}
      >
        <svg width={variant === "navbar" ? 18 : 22} height={variant === "navbar" ? 18 : 22} viewBox="0 0 24 24" fill="none">
          {/* 耳机图标 */}
          <path
            d="M4 14V12C4 7.58 7.58 4 12 4S20 7.58 20 12V14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <rect x="3" y="14" width="3" height="6" rx="1.5" fill="currentColor" opacity="0.8" />
          <rect x="18" y="14" width="3" height="6" rx="1.5" fill="currentColor" opacity="0.8" />
          {playing && (
            <path
              d="M9 17V15M12 18V14M15 17V15"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      <style>{`
        /* ===== 浮动模式（默认，右下角） ===== */
        .ambient-btn {
          position: fixed;
          right: 24px;
          bottom: 72px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--card-bg);
          color: var(--text-soft);
          cursor: pointer;
          opacity: 0.4;
          z-index: 50;
          box-shadow: 0 2px 12px -4px rgba(0,0,0,0.1);
          transition: opacity 0.3s ease, transform 0.3s ease, color 0.3s ease;
        }
        .ambient-btn:hover {
          opacity: 1;
          transform: translateY(-2px);
          color: var(--accent);
          box-shadow: 0 6px 20px -6px rgba(122, 154, 130, 0.3);
        }
        .ambient-playing {
          opacity: 0.7;
          color: var(--accent);
          animation: ambient-pulse 2.5s ease-in-out infinite;
        }
        .ambient-playing:hover {
          opacity: 1;
        }
        .ambient-muted {
          opacity: 0.4;
        }
        @keyframes ambient-pulse {
          0%, 100% { box-shadow: 0 2px 12px -4px rgba(122, 154, 130, 0.2); }
          50% { box-shadow: 0 2px 20px -2px rgba(122, 154, 130, 0.4); }
        }

        /* ===== 导航栏内联模式 ===== */
        .ambient-nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-soft);
          cursor: pointer;
          transition: color 0.25s ease, border-color 0.25s ease, opacity 0.25s ease;
        }
        .ambient-nav-btn:hover {
          color: var(--accent);
          border-color: var(--accent);
        }
        .ambient-nav-playing {
          color: var(--accent);
          border-color: rgba(122, 154, 130, 0.4);
        }
        .ambient-nav-muted {
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .ambient-btn {
            right: 16px;
            bottom: 64px;
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </>
  );
};

export default AmbientSound;
