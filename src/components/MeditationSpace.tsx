import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * MeditationSpace 冥想空间组件
 *
 * 功能：
 * - 选择时长（3 / 5 / 10 分钟）
 * - 倒计时冥想 + 进度环
 * - 随时间轮换的引导语
 * - 人声引导开关（SpeechSynthesis）
 * - 完成后给予温柔反馈
 *
 * 注：本组件已移除 Web Audio API 自动生成的环境音与钟声。
 * 如需背景音乐，可将音频文件（如 meditation-bell.mp3、meditation-bg.mp3）
 * 放入 public/ 目录，并使用 HTMLAudioElement 引入播放。
 */

// 时长选项（秒）
const durationOptions = [
  { label: "3 分钟", value: 180 },
  { label: "5 分钟", value: 300 },
  { label: "10 分钟", value: 600 },
];

// 冥想引导语 — 随进度轮换
const guidanceTexts = [
  "轻轻闭上眼睛，感受此刻的呼吸……",
  "吸气，感受空气充满胸腔……",
  "呼气，让所有疲惫随呼吸流出……",
  "不必评判，只是观察自己的感受……",
  "每一次呼吸，都让你更加放松……",
  "思绪来来去去，你只是静静地看着它们……",
  "感受身体的重量，交给脚下的地面……",
  "此刻，你只需要存在于这里……",
  "温柔地对待自己，如同对待挚友……",
  "带着这份宁静，慢慢回到当下……",
];

// 格式化时间 mm:ss
const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const MeditationSpace: React.FC = () => {
  const [duration, setDuration] = useState(300);
  const [remaining, setRemaining] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [guidanceIndex, setGuidanceIndex] = useState(0);
  // 人声引导开关（默认开启）
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // 缓存中文女声
  const femaleVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // 初始化：查找中文女声
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // 优先选择中文女声
      const cnFemale =
        voices.find((v) => /zh[-_]CN/i.test(v.lang) && /female|女/i.test(v.name)) ||
        voices.find((v) => /zh[-_]CN/i.test(v.lang)) ||
        voices.find((v) => /^zh/i.test(v.lang));
      if (cnFemale) femaleVoiceRef.current = cnFemale;
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  // 朗读引导语（轻柔女声）
  const speakGuidance = useCallback(
    (text: string) => {
      if (!voiceEnabled || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel(); // 取消上一句
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "zh-CN";
      if (femaleVoiceRef.current) utter.voice = femaleVoiceRef.current;
      utter.rate = 0.7;   // 慢速，轻柔
      utter.pitch = 1.15; // 略高音调，更温柔
      utter.volume = 0.6; // 轻柔音量
      window.speechSynthesis.speak(utter);
    },
    [voiceEnabled]
  );

  // 开始/暂停
  const toggleRunning = () => {
    if (isFinished) return;
    setIsRunning((prev) => !prev);
  };

  // 选择时长
  const selectDuration = (value: number) => {
    setIsRunning(false);
    setIsFinished(false);
    setDuration(value);
    setRemaining(value);
    setGuidanceIndex(0);
    window.speechSynthesis?.cancel();
  };

  // 倒计时逻辑
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          // 冥想结束
          setIsRunning(false);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  // 引导语轮换 + 人声朗读
  useEffect(() => {
    if (!isRunning) return;

    // 开始时朗读第一句
    speakGuidance(guidanceTexts[0]);

    const guidanceTimer = setInterval(() => {
      setGuidanceIndex((prev) => {
        const next = (prev + 1) % guidanceTexts.length;
        speakGuidance(guidanceTexts[next]);
        return next;
      });
    }, 15000); // 每 15 秒换一句并朗读
    return () => clearInterval(guidanceTimer);
  }, [isRunning, speakGuidance]);

  // 暂停或结束时停止语音
  useEffect(() => {
    if (!isRunning && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (isFinished && voiceEnabled && "speechSynthesis" in window) {
      // 结束时朗读结束语
      setTimeout(() => {
        const utter = new SpeechSynthesisUtterance("冥想完成，愿你带着这份平静继续前行");
        utter.lang = "zh-CN";
        if (femaleVoiceRef.current) utter.voice = femaleVoiceRef.current;
        utter.rate = 0.65;
        utter.pitch = 1.15;
        utter.volume = 0.6;
        window.speechSynthesis.speak(utter);
      }, 1200);
    }
  }, [isRunning, isFinished, voiceEnabled]);

  // 进度百分比
  const progress = duration > 0 ? ((duration - remaining) / duration) * 100 : 0;

  return (
    <div className="flex flex-col items-center">
      {/* 人声引导开关 */}
      <div className="absolute top-0 right-0">
        <button
          onClick={() => {
            setVoiceEnabled((prev) => {
              if (prev) window.speechSynthesis?.cancel();
              return !prev;
            });
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-all duration-300 ${
            voiceEnabled
              ? "border-[#b88c6a] text-[#b88c6a] bg-[#b88c6a]/5"
              : "border-[#e8e0d5] text-[#b0b0b0]"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 8a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v1a2 2 0 01-2 2M7 8v8a2 2 0 002 2h6a2 2 0 002-2V8m-5 4h.01" />
          </svg>
          {voiceEnabled ? "人声" : "无声"}
        </button>
      </div>

      {/* 冥想状态区域 */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-6 mt-4">
        {/* 外层呼吸光晕 */}
        <motion.div
          className="absolute rounded-full bg-[#b88c6a]"
          animate={{
            scale: isRunning ? [1, 1.15, 1] : 1,
            opacity: isRunning ? [0.08, 0.2, 0.08] : 0.1,
          }}
          transition={{
            duration: 8,
            repeat: isRunning ? Infinity : 0,
            ease: "easeInOut",
          }}
          style={{ width: "100%", height: "100%", filter: "blur(30px)" }}
        />

        {/* 进度环 */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#e8e0d5" strokeWidth="3" />
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#b88c6a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 90}
            animate={{
              strokeDashoffset: 2 * Math.PI * 90 * (1 - progress / 100),
            }}
            transition={{ duration: 0.5, ease: "linear" }}
          />
        </svg>

        {/* 中心内容 */}
        <div className="relative z-10 text-center">
          {isFinished ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-3xl mb-2">🎐</p>
              <p className="text-sm text-[#b88c6a]" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                冥想完成
              </p>
              <p className="text-xs text-[#b0b0b0] mt-1">愿你带着这份平静继续前行</p>
            </motion.div>
          ) : (
            <>
              <p className="text-3xl font-medium text-[#3d3d3d]" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                {formatTime(remaining)}
              </p>
              <p className="text-xs text-[#b0b0b0] mt-2">
                {isRunning ? "冥想中……" : "准备开始"}
              </p>
            </>
          )}
        </div>
      </div>

      {/* 引导语 */}
      <AnimatePresence mode="wait">
        {(isRunning || isFinished) && (
          <motion.p
            key={guidanceIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-[#8a8a8a] text-center mb-6 min-h-[2.5rem] max-w-xs leading-relaxed italic"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            {isFinished ? "你已回到当下，带着觉察继续这一天。" : guidanceTexts[guidanceIndex]}
          </motion.p>
        )}
      </AnimatePresence>

      {/* 时长选择 */}
      {!isRunning && !isFinished && (
        <div className="flex gap-2 mb-6">
          {durationOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => selectDuration(opt.value)}
              className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${
                duration === opt.value
                  ? "bg-[#b88c6a] text-[#fffdf9] border-[#b88c6a]"
                  : "bg-transparent text-[#8a8a8a] border-[#e8e0d5] hover:border-[#b88c6a]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* 控制按钮 */}
      <div className="flex gap-3">
        {!isFinished && (
          <motion.button
            onClick={toggleRunning}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-2.5 bg-[#b88c6a] text-[#fffdf9] rounded-full text-sm font-medium hover:bg-[#9c7355] transition-colors duration-300"
          >
            {isRunning ? "暂停" : "开始冥想"}
          </motion.button>
        )}
        {isFinished && (
          <motion.button
            onClick={() => selectDuration(duration)}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-2.5 bg-[#b88c6a] text-[#fffdf9] rounded-full text-sm font-medium hover:bg-[#9c7355] transition-colors duration-300"
          >
            再来一次
          </motion.button>
        )}
        {(isRunning || remaining < duration) && !isFinished && (
          <button
            onClick={() => selectDuration(duration)}
            className="px-5 py-2.5 border border-[#e8e0d5] text-[#8a8a8a] rounded-full text-sm hover:border-[#b88c6a] hover:text-[#b88c6a] transition-colors duration-300"
          >
            重新开始
          </button>
        )}
      </div>

      {/* 说明 */}
      {!isRunning && !isFinished && (
        <p className="text-xs text-[#b0b0b0] text-center mt-6 leading-relaxed max-w-xs">
          找一个舒适的姿势坐下，轻轻闭上眼睛。
          {voiceEnabled && "温柔的女声将每隔片刻为你送上引导。"}
          让身心沉入这段宁静时光。
        </p>
      )}
    </div>
  );
};

export default MeditationSpace;
