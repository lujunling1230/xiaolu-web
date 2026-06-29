import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useTheme } from "./ThemeContext";

/**
 * AudioContext — 全局音频管理 Provider（昼夜联动版 v2）
 *
 * 核心设计：
 * 1. 风铃音频：独立 Audio 实例，点击触发，800ms 防抖，不受白噪音影响
 * 2. 白噪音：单一 Audio 实例，昼夜自动切换音源
 *    - 昼模式：/day-forest.mp3（鸟鸣）
 *    - 夜模式：/night-rain.mp3（夜雨）
 *    - loop=true, volume=0.15
 *    - ❌ 不立即 play()（浏览器会拦截）
 *    - hasPlayed ref 标记是否已播放过
 * 3. 首次交互激活：
 *    - document 级 pointerdown 监听
 *    - 小鹿 hover / 风铃 click 也可激活
 *    - hasPlayed===false 时 play() + 标记 true
 * 4. 昼夜切换：
 *    - 销毁旧 Audio 实例
 *    - 新建对应 Audio，volume 0.15，loop true
 *    - hasPlayed===true 则立即 play()
 *
 * 依赖 ThemeProvider（需在 ThemeProvider 内部使用）
 */

const AMBIENT_VOLUME = 0.15;
const CHIME_VOLUME = 0.25;

/** 根据主题模式获取白噪音文件路径 */
const getAmbientSrc = (mode: "day" | "night"): string =>
  mode === "day" ? "/day-forest.mp3" : "/night-rain.mp3";

/** 根据主题模式获取白噪音显示名称 */
const getAmbientLabel = (mode: "day" | "night"): string =>
  mode === "day" ? "晨林鸟鸣" : "夜雨";

interface AudioContextValue {
  /** 播放风铃声（带 800ms 防抖，独立 Audio 实例） */
  playChime: () => void;
  /** 白噪音是否正在播放 */
  ambientPlaying: boolean;
  /** 切换白噪音播放/暂停 */
  toggleAmbient: () => void;
  /** 用户是否已交互（用于首次激活提示） */
  hasInteracted: boolean;
  /** 尝试激活白噪音（首次交互时调用，hasPlayed 为 true 后不再触发） */
  tryActivateAmbient: () => void;
  /** 当前白噪音显示名称 */
  ambientLabel: string;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export const useAudio = (): AudioContextValue => {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const { mode } = useTheme();

  // 风铃音频实例（独立，不受白噪音影响）
  const chimeAudioRef = useRef<HTMLAudioElement | null>(null);
  // 白噪音音频实例（单一，切换时销毁重建）
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  // 风铃防抖标记
  const lastChimeTimeRef = useRef(0);
  // 🔑 核心：标记白噪音是否已播放过（首次交互后置 true，永不重置）
  const hasPlayedRef = useRef(false);

  const [hasInteracted, setHasInteracted] = useState(false);
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const [ambientLabel, setAmbientLabel] = useState(getAmbientLabel(mode));

  // 初始化风铃音频（仅一次，独立于白噪音）
  useEffect(() => {
    chimeAudioRef.current = new Audio("/windchime.mp3");
    chimeAudioRef.current.preload = "none";
    chimeAudioRef.current.volume = CHIME_VOLUME;

    return () => {
      chimeAudioRef.current?.pause();
      chimeAudioRef.current = null;
    };
  }, []);

  // 🎵 白噪音实例：随昼夜模式创建/销毁重建
  useEffect(() => {
    const newSrc = getAmbientSrc(mode);

    // 创建新实例
    const audio = new Audio(newSrc);
    audio.loop = true;
    audio.volume = AMBIENT_VOLUME;
    audio.preload = "auto";
    ambientAudioRef.current = audio;

    setAmbientLabel(getAmbientLabel(mode));

    // 若已播放过（用户已交互），立即播放新音源
    if (hasPlayedRef.current) {
      audio
        .play()
        .then(() => {
          setAmbientPlaying(true);
        })
        .catch(() => {
          /* 浏览器拦截或文件缺失，静默处理 */
        });
    }

    // 清理：销毁当前实例（mode 变化或卸载时触发）
    return () => {
      audio.pause();
      audio.src = "";
      audio.load(); // 释放资源
      // 若 ref 仍指向自己才清空（避免清掉新实例）
      if (ambientAudioRef.current === audio) {
        ambientAudioRef.current = null;
      }
    };
  }, [mode]);

  // 🖱️ document 级首次交互监听：任意 pointerdown 激活白噪音
  useEffect(() => {
    const handlePointerDown = () => {
      // 已播放过则不再处理
      if (hasPlayedRef.current) return;

      const audio = ambientAudioRef.current;
      if (!audio) return;

      // 首次激活：play + 标记
      hasPlayedRef.current = true;
      setHasInteracted(true);

      audio
        .play()
        .then(() => {
          setAmbientPlaying(true);
        })
        .catch(() => {
          /* iOS 拦截或文件缺失，静默处理，不抛错 */
        });
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  // 风铃：点击触发（800ms 防抖，独立 Audio 实例）
  const playChime = useCallback(() => {
    const now = Date.now();
    if (now - lastChimeTimeRef.current < 800) return;
    lastChimeTimeRef.current = now;

    const audio = chimeAudioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {
      /* 浏览器拦截或文件缺失，静默处理 */
    });
  }, []);

  // 尝试激活白噪音（小鹿 hover / 风铃 click 调用）
  // hasPlayed 为 true 后不再触发，与 document 监听逻辑一致
  const tryActivateAmbient = useCallback(() => {
    if (hasPlayedRef.current) return;

    const audio = ambientAudioRef.current;
    if (!audio) return;

    hasPlayedRef.current = true;
    setHasInteracted(true);

    audio
      .play()
      .then(() => {
        setAmbientPlaying(true);
      })
      .catch(() => {
        /* 静默处理 */
      });
  }, []);

  // 切换白噪音播放/暂停（小鹿 click / 状态文字 click 调用）
  const toggleAmbient = useCallback(() => {
    const audio = ambientAudioRef.current;
    if (!audio) return;

    setHasInteracted(true);

    if (ambientPlaying) {
      // 暂停
      audio.pause();
      setAmbientPlaying(false);
    } else {
      // 播放：标记 hasPlayed，后续昼夜切换时自动播放
      hasPlayedRef.current = true;
      audio
        .play()
        .then(() => {
          setAmbientPlaying(true);
        })
        .catch(() => {
          /* 静默处理 */
        });
    }
  }, [ambientPlaying]);

  const value: AudioContextValue = {
    playChime,
    ambientPlaying,
    toggleAmbient,
    hasInteracted,
    tryActivateAmbient,
    ambientLabel,
  };

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}
