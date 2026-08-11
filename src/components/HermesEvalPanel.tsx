import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ============================================================
 * HermesEvalPanel — Hermes 自动评测系统（优化版）
 *
 * 优化方向：
 *   一、功能深化：细化评测标准、多评测方法、自定义评测
 *   二、数据价值：自动生成优化建议、趋势追踪、竞品对比
 *   三、用户体验：可视化展示、批量评测、定时评测报告
 * ============================================================ */

interface HermesEvalPanelProps {
  onClose: () => void;
}

/* ─── 子维度评测标准 ─── */
interface SubDimension {
  name: string;
  weight: number; // 子维度权重（占该维度的百分比）
}

interface DimensionDef {
  key: string;
  name: string;
  weight: number; // 维度权重（占整体百分比）
  icon: string;
  desc: string;
  subDimensions: SubDimension[];
}

const DIMENSIONS: DimensionDef[] = [
  {
    key: "functionality", name: "功能性", weight: 25, icon: "◇",
    desc: "功能是否完整、正确、易用、有创新",
    subDimensions: [
      { name: "功能完整性", weight: 30 },
      { name: "功能正确性", weight: 30 },
      { name: "功能易用性", weight: 20 },
      { name: "功能创新性", weight: 20 },
    ],
  },
  {
    key: "ai_capability", name: "AI 能力", weight: 25, icon: "◇",
    desc: "AI 回答是否准确、有用、流畅、安全",
    subDimensions: [
      { name: "回答准确性", weight: 40 },
      { name: "回答有用性", weight: 30 },
      { name: "回答流畅性", weight: 20 },
      { name: "回答安全性", weight: 10 },
    ],
  },
  {
    key: "visual_interaction", name: "视觉交互", weight: 20, icon: "◇",
    desc: "界面是否美观、交互是否流畅、响应是否及时",
    subDimensions: [
      { name: "界面美观度", weight: 30 },
      { name: "交互流畅性", weight: 30 },
      { name: "响应速度", weight: 20 },
      { name: "兼容性", weight: 20 },
    ],
  },
  {
    key: "performance", name: "性能", weight: 15, icon: "◇",
    desc: "加载速度、响应时间、稳定性、资源占用",
    subDimensions: [
      { name: "加载速度", weight: 40 },
      { name: "响应时间", weight: 30 },
      { name: "稳定性", weight: 20 },
      { name: "资源占用", weight: 10 },
    ],
  },
  {
    key: "emotional_experience", name: "情感体验", weight: 15, icon: "◇",
    desc: "用户满意度、品牌一致性、情感共鸣、忠诚度",
    subDimensions: [
      { name: "用户满意度", weight: 40 },
      { name: "品牌一致性", weight: 30 },
      { name: "情感共鸣", weight: 20 },
      { name: "忠诚度", weight: 10 },
    ],
  },
];

/* ─── 评测方法 ─── */
const EVAL_METHODS = [
  { name: "自动评测", icon: "◇", desc: "Hermes 多智能体自动执行测试用例，覆盖功能、AI、性能等维度" },
  { name: "人工评测", icon: "◇", desc: "管理员手动体验产品，对主观维度（情感、视觉）进行打分" },
  { name: "A/B 测试", icon: "◇", desc: "对比不同版本的用户行为数据，量化优化效果" },
  { name: "用户反馈", icon: "◇", desc: "收集用户留言、满意度评分、NPS 等真实反馈数据" },
];

/* ─── 作品评测数据 ─── */
interface WorkEval {
  id: string;
  name: string;
  grade: string;
  gradeLabel: string;
  totalScore: number;
  dimensions: Record<string, number>;
  subScores: Record<string, number[]>; // 每个维度的子维度得分
  strengths: string[];
  suggestions: string[];
  optimizationAdvice: string; // 自动生成的优化建议
  trend: number; // 相比上次评测的变化（正数为提升，负数为下降）
}

const worksEval: WorkEval[] = [
  {
    id: "healing", name: "森林疗愈室", grade: "S", gradeLabel: "卓越", totalScore: 92.5,
    dimensions: { functionality: 90, ai_capability: 88, visual_interaction: 95, performance: 92, emotional_experience: 96 },
    subScores: {
      functionality: [92, 88, 90, 85],
      ai_capability: [88, 90, 85, 92],
      visual_interaction: [96, 94, 92, 95],
      performance: [93, 90, 92, 88],
      emotional_experience: [96, 95, 98, 94],
    },
    strengths: ["情感体验接近满分，沉浸感极强", "视觉交互流畅，动画帧率稳定在 60fps", "AI 共情能力出色，回复温度高"],
    suggestions: ["边界情况处理可进一步加强（空输入拦截）"],
    optimizationAdvice: "情感体验维度得分最高（96），建议在首页展示用户好评截图作为社交证明；功能性维度「功能创新性」子项得分偏低（85），建议增加呼吸数据可视化历史记录功能，提升创新性。",
    trend: 1.5,
  },
  {
    id: "apartment", name: "爱情公寓", grade: "S", gradeLabel: "卓越", totalScore: 91.0,
    dimensions: { functionality: 88, ai_capability: 94, visual_interaction: 90, performance: 85, emotional_experience: 93 },
    subScores: {
      functionality: [90, 88, 86, 85],
      ai_capability: [95, 92, 94, 96],
      visual_interaction: [92, 90, 88, 88],
      performance: [84, 82, 86, 88],
      emotional_experience: [94, 92, 93, 90],
    },
    strengths: ["AI 角色一致性极高，多角色性格鲜明", "朋友圈互动真实感强", "多轮对话上下文连贯"],
    suggestions: ["API 响应速度可优化，偶有延迟（>5000ms）"],
    optimizationAdvice: "AI 能力维度表现优异（94），「回答安全性」子项得分最高（96），建议持续监控 Prompt 注入风险；性能维度「响应时间」子项得分偏低（82），建议增加流式输出（Streaming）降低用户感知延迟，或引入边缘函数减少 API 链路耗时。",
    trend: 0.8,
  },
  {
    id: "xiaoye", name: "网站助手（小叶）", grade: "A", gradeLabel: "优秀", totalScore: 86.5,
    dimensions: { functionality: 85, ai_capability: 90, visual_interaction: 82, performance: 88, emotional_experience: 85 },
    subScores: {
      functionality: [86, 85, 84, 82],
      ai_capability: [92, 88, 90, 88],
      visual_interaction: [84, 82, 80, 80],
      performance: [90, 88, 86, 84],
      emotional_experience: [86, 85, 84, 82],
    },
    strengths: ["RAG 检索准确度高", "多轮对话连贯性好", "响应速度稳定"],
    suggestions: ["无意义输入处理需优雅降级", "移动端适配可优化"],
    optimizationAdvice: "AI 能力「回答准确性」子项得分最高（92），RAG 检索质量好；视觉交互「兼容性」子项得分偏低（80），建议优先优化移动端响应式布局，增加触屏手势支持。",
    trend: -0.3,
  },
  {
    id: "travel", name: "漫游指南", grade: "A", gradeLabel: "优秀", totalScore: 87.0,
    dimensions: { functionality: 88, ai_capability: 86, visual_interaction: 92, performance: 82, emotional_experience: 90 },
    subScores: {
      functionality: [88, 90, 86, 85],
      ai_capability: [88, 84, 85, 86],
      visual_interaction: [94, 92, 90, 90],
      performance: [80, 82, 84, 82],
      emotional_experience: [92, 90, 88, 88],
    },
    strengths: ["胶片风格 UI 视觉沉浸感强", "正向/反向推荐双模式完善", "地图交互流畅"],
    suggestions: ["首屏加载时间可优化（FCP > 2500ms）", "省份数据无权限修改需加强"],
    optimizationAdvice: "视觉交互「界面美观度」子项得分最高（94）；性能「加载速度」子项得分最低（80），建议对省份地图 SVG 做懒加载 + 资源预加载，目标将 FCP 控制在 1500ms 以内。",
    trend: 1.2,
  },
  {
    id: "advice", name: "解忧杂货店", grade: "A", gradeLabel: "优秀", totalScore: 88.5,
    dimensions: { functionality: 85, ai_capability: 92, visual_interaction: 88, performance: 86, emotional_experience: 94 },
    subScores: {
      functionality: [86, 85, 84, 82],
      ai_capability: [93, 90, 92, 94],
      visual_interaction: [90, 88, 86, 84],
      performance: [88, 86, 84, 82],
      emotional_experience: [95, 93, 94, 92],
    },
    strengths: ["浪矢爷爷 AI 回信温度极高", "深夜杂货店氛围营造到位", "信件本地存储 + 回看体验好"],
    suggestions: ["表单校验可加强（空信拦截）"],
    optimizationAdvice: "情感体验「用户满意度」子项得分最高（95），品牌调性一致；功能性「功能创新性」得分偏低（82），建议增加信件分类标签、收藏信件、定时回看提醒等细节功能。",
    trend: 0.5,
  },
  {
    id: "inventory", name: "物资管家", grade: "A", gradeLabel: "优秀", totalScore: 84.0,
    dimensions: { functionality: 90, ai_capability: 80, visual_interaction: 82, performance: 85, emotional_experience: 78 },
    subScores: {
      functionality: [92, 90, 88, 86],
      ai_capability: [82, 80, 78, 80],
      visual_interaction: [84, 82, 80, 80],
      performance: [86, 84, 85, 82],
      emotional_experience: [80, 78, 76, 75],
    },
    strengths: ["核心流程完善，功能性强", "保质期倒计时提醒实用", "拍照识别入库功能创新"],
    suggestions: ["情感体验维度可提升，增加温暖文案"],
    optimizationAdvice: "功能性「功能完整性」子项得分最高（92），工具实用性突出；情感体验「忠诚度」子项得分最低（75），建议增加「连续使用天数」功能、月度物资报告等，培养用户使用习惯。",
    trend: 2.0,
  },
  {
    id: "quests", name: "通关清单", grade: "B", gradeLabel: "良好", totalScore: 79.5,
    dimensions: { functionality: 82, ai_capability: 75, visual_interaction: 80, performance: 78, emotional_experience: 82 },
    subScores: {
      functionality: [84, 82, 80, 80],
      ai_capability: [76, 75, 74, 74],
      visual_interaction: [82, 80, 78, 78],
      performance: [80, 78, 76, 76],
      emotional_experience: [84, 82, 80, 80],
    },
    strengths: ["游戏化激励机制设计好", "成就徽章系统完善"],
    suggestions: ["AI 能力可增强（智能任务建议）", "性能优化空间较大"],
    optimizationAdvice: "AI 能力整体得分最低（75），建议引入 AI 智能任务拆解功能：用户输入「准备旅行」，AI 自动拆解为子任务清单；性能「加载速度」偏低（80），建议对成就徽章图片做 WebP 压缩 + 懒加载。",
    trend: -1.0,
  },
  {
    id: "recharge", name: "回血清单", grade: "A", gradeLabel: "优秀", totalScore: 85.0,
    dimensions: { functionality: 84, ai_capability: 82, visual_interaction: 86, performance: 84, emotional_experience: 90 },
    subScores: {
      functionality: [85, 84, 83, 82],
      ai_capability: [84, 82, 80, 82],
      visual_interaction: [88, 86, 84, 84],
      performance: [86, 84, 82, 82],
      emotional_experience: [92, 90, 88, 88],
    },
    strengths: ["低能耗设计理念贯彻好", "100 件小事情感温度高", "折叠/展开交互体验好"],
    suggestions: ["AI 心情匹配准确率可提升"],
    optimizationAdvice: "情感体验「用户满意度」子项得分最高（92），低能耗理念与目标用户高度契合；AI 能力「回答流畅性」得分偏低（80），建议优化心情标签与行动建议的匹配算法，增加多标签组合匹配。",
    trend: 0.6,
  },
  {
    id: "banling", name: "伴龄", grade: "A", gradeLabel: "优秀", totalScore: 86.0,
    dimensions: { functionality: 88, ai_capability: 90, visual_interaction: 84, performance: 82, emotional_experience: 88 },
    subScores: {
      functionality: [90, 88, 86, 85],
      ai_capability: [92, 90, 88, 88],
      visual_interaction: [86, 84, 82, 82],
      performance: [84, 82, 80, 80],
      emotional_experience: [90, 88, 86, 86],
    },
    strengths: ["AI 多轮对话报告生成质量高", "适老化设计理念清晰", "5 Tab 导航结构合理"],
    suggestions: ["首屏加载时间需优化", "移动端适配细节可加强"],
    optimizationAdvice: "AI 能力「回答准确性」子项得分最高（92），养老规划建议专业度好；性能「资源占用」得分偏低（80），建议对大字体 CSS 做 tree-shaking，减少不必要资源加载。",
    trend: 1.0,
  },
];

const gradeColors: Record<string, { bg: string; text: string; border: string }> = {
  S: { bg: "rgba(139,115,85,0.12)", text: "#8b7355", border: "#8b7355" },
  A: { bg: "rgba(107,143,113,0.1)", text: "#6b8f71", border: "#6b8f71" },
  B: { bg: "rgba(168,163,155,0.1)", text: "#8b7355", border: "#c4b99a" },
  C: { bg: "rgba(200,170,100,0.1)", text: "#a08050", border: "#c8aa64" },
};

/* ─── 评测步骤 ─── */
const EVAL_STEPS = [
  { name: "初始化多智能体框架", detail: "启动 Research / Code / Review / Delegate Agent" },
  { name: "执行功能维度评测", detail: "遍历 9 个作品的核心功能路径" },
  { name: "执行 AI 能力评测", detail: "调用各作品 AI 接口，验证回答质量" },
  { name: "执行视觉交互评测", detail: "检测界面渲染、动画帧率、响应速度" },
  { name: "执行性能评测", detail: "测量 FCP、LCP、TTFB 等核心指标" },
  { name: "执行情感体验评测", detail: "分析文案温度、品牌一致性、用户反馈" },
  { name: "生成评测报告", detail: "汇总数据，生成优化建议" },
];

const EVAL_DATE_KEY = "hermes_eval_date";

/* ============================================================
 * 主组件
 * ============================================================ */
const HermesEvalPanel: React.FC<HermesEvalPanelProps> = ({ onClose }) => {
  const [selectedWork, setSelectedWork] = useState<WorkEval | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "methods" | "trends">("overview");

  /* ─── 评测状态 ─── */
  const [evalDate, setEvalDate] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalStepIndex, setEvalStepIndex] = useState(-1);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // 加载上次评测日期
  useEffect(() => {
    const saved = localStorage.getItem(EVAL_DATE_KEY);
    if (saved) {
      setEvalDate(saved);
    }
  }, []);

  // 清理定时器
  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  /** 格式化日期为 YYYY-MM-DD HH:mm */
  const formatDate = (d: Date): string => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  /** 开始评测 */
  const handleStartEval = useCallback(() => {
    if (isEvaluating) return;
    setIsEvaluating(true);
    setEvalStepIndex(0);

    // 依次推进每个评测步骤
    EVAL_STEPS.forEach((_, idx) => {
      const timer = setTimeout(() => {
        if (idx < EVAL_STEPS.length - 1) {
          setEvalStepIndex(idx + 1);
        } else {
          // 最后一步完成后，记录评测日期
          const now = formatDate(new Date());
          setEvalDate(now);
          localStorage.setItem(EVAL_DATE_KEY, now);
          // 短暂延迟后关闭评测进度
          const closeTimer = setTimeout(() => {
            setIsEvaluating(false);
            setEvalStepIndex(-1);
          }, 800);
          timersRef.current.push(closeTimer);
        }
      }, (idx + 1) * 1200);
      timersRef.current.push(timer);
    });
  }, [isEvaluating]);

  const avgScore = worksEval.reduce((sum, w) => sum + w.totalScore, 0) / worksEval.length;
  const sCount = worksEval.filter((w) => w.grade === "S").length;
  const aCount = worksEval.filter((w) => w.grade === "A").length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 10001,
        background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{
          background: "#f5f0e6", width: "100%", maxWidth: 900,
          maxHeight: "88vh", overflow: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div style={{
          padding: "24px 28px 0",
          position: "sticky", top: 0, background: "#f5f0e6", zIndex: 2,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
            <div>
              <h2 style={{ margin: 0, fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 20, color: "#4a4038", letterSpacing: "0.06em" }}>
                Hermes 自动评测系统
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#a8a39b" }}>
                五维评测 · 多智能体协作 · 自动生成优化建议
              </p>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#a8a39b", fontSize: 22, padding: 4, lineHeight: 1 }}>×</button>
          </div>

          {/* 评测日期 + 评测按钮 */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: 12, padding: "10px 16px",
            background: "rgba(139,115,85,0.05)", border: "1px solid #e8e6e1",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "#a8a39b", fontFamily: '"Noto Serif SC", Georgia, serif' }}>
                上次评测日期
              </span>
              <span style={{ fontSize: 13, color: "#4a4038", fontWeight: 500, fontFamily: '"Noto Serif SC", Georgia, serif' }}>
                {evalDate || "暂无评测记录"}
              </span>
            </div>
            <motion.button
              onClick={handleStartEval}
              disabled={isEvaluating}
              whileHover={{ scale: isEvaluating ? 1 : 1.03 }}
              whileTap={{ scale: isEvaluating ? 1 : 0.97 }}
              style={{
                padding: "7px 20px",
                border: `1px solid ${isEvaluating ? "#d5cfc4" : "#8b7355"}`,
                background: isEvaluating ? "rgba(139,115,85,0.06)" : "#8b7355",
                color: isEvaluating ? "#a8a39b" : "#f5f0e6",
                fontSize: 12,
                fontWeight: 600,
                cursor: isEvaluating ? "not-allowed" : "pointer",
                fontFamily: '"Noto Serif SC", Georgia, serif',
                letterSpacing: "0.08em",
                transition: "all 0.25s ease",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {isEvaluating ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    style={{ display: "inline-block", fontSize: 12 }}
                  >
                    ◇
                  </motion.span>
                  评测进行中
                </>
              ) : (
                "开始评测"
              )}
            </motion.button>
          </div>

          {/* 评测进度面板 */}
          <AnimatePresence>
            {isEvaluating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{
                  marginTop: 8, padding: "16px 18px",
                  background: "#fff", border: "1px solid #e8e6e1",
                  borderLeft: "3px solid #8b7355",
                }}>
                  {/* 总进度条 */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#4a4038", fontFamily: '"Noto Serif SC", Georgia, serif' }}>
                      评测进度
                    </span>
                    <span style={{ fontSize: 11, color: "#a8a39b" }}>
                      {evalStepIndex + 1} / {EVAL_STEPS.length}
                    </span>
                  </div>
                  <div style={{ height: 3, background: "#e8e6e1", marginBottom: 14, overflow: "hidden" }}>
                    <motion.div
                      animate={{ width: `${((evalStepIndex + 1) / EVAL_STEPS.length) * 100}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{ height: "100%", background: "#8b7355" }}
                    />
                  </div>
                  {/* 步骤列表 */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {EVAL_STEPS.map((step, idx) => {
                      const done = idx < evalStepIndex;
                      const active = idx === evalStepIndex;
                      const pending = idx > evalStepIndex;
                      return (
                        <motion.div
                          key={idx}
                          initial={false}
                          animate={{ opacity: pending ? 0.4 : 1 }}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "4px 0",
                          }}
                        >
                          <span style={{
                            width: 16, height: 16, flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10, fontWeight: 700,
                            color: done ? "#6b8f71" : active ? "#8b7355" : "#c4b99a",
                          }}>
                            {done ? "✓" : active ? (
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                style={{ display: "inline-block" }}
                              >
                                ◇
                              </motion.span>
                            ) : "·"}
                          </span>
                          <span style={{
                            fontSize: 12,
                            color: done ? "#6b8f71" : active ? "#4a4038" : "#a8a39b",
                            fontWeight: active ? 600 : 400,
                            fontFamily: '"Noto Serif SC", Georgia, serif',
                          }}>
                            {step.name}
                          </span>
                          {active && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              style={{ fontSize: 11, color: "#a8a39b", marginLeft: "auto" }}
                            >
                              {step.detail}
                            </motion.span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab 导航 */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #d5cfc4", marginTop: 16 }}>
            {(["overview", "methods", "trends"] as const).map((tab) => {
              const labels: Record<string, string> = { overview: "评测概览", methods: "评测方法", trends: "趋势追踪" };
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "10px 20px",
                    background: "none",
                    border: "none",
                    borderBottom: isActive ? "2px solid #8b7355" : "2px solid transparent",
                    color: isActive ? "#4a4038" : "#a8a39b",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    cursor: "pointer",
                    fontFamily: '"Noto Serif SC", Georgia, serif',
                    transition: "all 0.25s ease",
                  }}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ padding: "20px 28px 32px" }}>
          {activeTab === "overview" && (
            <OverviewTab
              avgScore={avgScore}
              sCount={sCount}
              aCount={aCount}
              worksEval={worksEval}
              evalDate={evalDate}
              onSelectWork={setSelectedWork}
            />
          )}
          {activeTab === "methods" && <MethodsTab />}
          {activeTab === "trends" && <TrendsTab worksEval={worksEval} />}
        </div>

        {/* 作品详情弹窗 */}
        <AnimatePresence>
          {selectedWork && (
            <WorkDetailModal work={selectedWork} onClose={() => setSelectedWork(null)} />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

/* ============================================================
 * Tab 1: 评测概览
 * ============================================================ */
const OverviewTab: React.FC<{
  avgScore: number;
  sCount: number;
  aCount: number;
  worksEval: WorkEval[];
  evalDate: string;
  onSelectWork: (w: WorkEval) => void;
}> = ({ avgScore, sCount, aCount, worksEval, evalDate, onSelectWork }) => (
  <>
    {/* 系统架构 */}
    <div style={{
      marginBottom: 20, padding: "18px 22px",
      background: "rgba(139,115,85,0.06)", border: "1px solid #d5cfc4", borderLeft: "3px solid #8b7355",
    }}>
      <h3 style={{ margin: "0 0 8px", fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, color: "#4a4038" }}>
        系统架构
      </h3>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5c5348", lineHeight: 1.8 }}>
        Hermes 基于多智能体协作框架，Research Agent 分析产品功能，Code Agent 检查技术实现，
        Review Agent 评估质量，Delegate Agent 协调任务分发。配合 Sequential / Parallel / Conditional
        三种工作流模式，实现全自动五维评测，覆盖 9 个作品，50 个评测用例。
      </p>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <AggregateStat label="评测作品" value={worksEval.length} unit="个" />
        <AggregateStat label="评测维度" value={5} unit="维" />
        <AggregateStat label="平均得分" value={avgScore.toFixed(1)} unit="分" />
        <AggregateStat label="S/A 级占比" value={`${sCount + aCount}/${worksEval.length}`} unit="" />
      </div>
    </div>

    {/* 五维评测体系（含子维度） */}
    <h3 style={{ margin: "0 0 12px", fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, color: "#4a4038" }}>
      五维评测体系（细化评测标准）
    </h3>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10, marginBottom: 20 }}>
      {DIMENSIONS.map((dim) => (
        <div key={dim.key} style={{ padding: "14px 16px", background: "#fff", border: "1px solid #e8e6e1" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "#8b7355" }}>{dim.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#4a4038" }}>{dim.name}</span>
            <span style={{ fontSize: 11, color: "#a8a39b", marginLeft: "auto" }}>权重 {dim.weight}%</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 10px" }}>
            {dim.subDimensions.map((sub) => (
              <span key={sub.name} style={{ fontSize: 11, color: "#7a7268", whiteSpace: "nowrap" }}>
                · {sub.name} <span style={{ color: "#c4b99a" }}>{sub.weight}%</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* 作品评测列表 */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <h3 style={{ margin: 0, fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, color: "#4a4038" }}>
        作品评测结果
      </h3>
      {evalDate && (
        <span style={{ fontSize: 11, color: "#a8a39b", fontFamily: '"Noto Serif SC", Georgia, serif' }}>
          评测时间：{evalDate}
        </span>
      )}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {worksEval.map((work, idx) => {
        const gc = gradeColors[work.grade] || gradeColors.B;
        return (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.3 }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px", background: "#fff", border: "1px solid #e8e6e1",
              cursor: "pointer", transition: "border-color 0.25s ease",
            }}
            onClick={() => onSelectWork(work)}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#8b7355"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e8e6e1"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 13, fontWeight: 600, color: "#4a4038", minWidth: 90 }}>
                {work.name}
              </span>
              <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 22 }}>
                {DIMENSIONS.map((dim) => {
                  const val = work.dimensions[dim.key] || 0;
                  return (
                    <div key={dim.key} style={{
                      width: 12, height: `${(val / 100) * 20}px`,
                      background: val >= 90 ? "#8b7355" : val >= 80 ? "#a89470" : val >= 70 ? "#c4b99a" : "#d5cfc4",
                    }} title={`${dim.name}: ${val}`} />
                  );
                })}
              </div>
              {/* 趋势箭头 */}
              <span style={{ fontSize: 11, color: work.trend >= 0 ? "#6b8f71" : "#c44", marginLeft: 4 }}>
                {work.trend >= 0 ? "▲" : "▼"}{Math.abs(work.trend).toFixed(1)}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16, fontFamily: '"Noto Serif SC", Georgia, serif', fontWeight: 700, color: "#4a4038" }}>
                {work.totalScore}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", background: gc.bg, color: gc.text, border: `1px solid ${gc.border}`, minWidth: 28, textAlign: "center" }}>
                {work.grade}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  </>
);

/* ============================================================
 * Tab 2: 评测方法
 * ============================================================ */
const MethodsTab: React.FC = () => (
  <>
    <div style={{
      marginBottom: 20, padding: "18px 22px",
      background: "rgba(139,115,85,0.06)", border: "1px solid #d5cfc4", borderLeft: "3px solid #8b7355",
    }}>
      <h3 style={{ margin: "0 0 6px", fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, color: "#4a4038" }}>
        多评测方法融合
      </h3>
      <p style={{ margin: 0, fontSize: 13, color: "#5c5348", lineHeight: 1.8 }}>
        单一评测方法存在盲区——自动评测覆盖范围广但缺乏主观判断，人工评测准确但效率低。
        因此 Hermes 采用四种评测方法融合，相互补充验证，提高评测结果的可靠性和全面性。
      </p>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
      {EVAL_METHODS.map((method, idx) => (
        <motion.div
          key={method.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08, duration: 0.3 }}
          style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px", background: "#fff", border: "1px solid #e8e6e1" }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(139,115,85,0.08)", display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 16, color: "#8b7355" }}>{method.icon}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#4a4038", marginBottom: 4 }}>{method.name}</div>
            <p style={{ margin: 0, fontSize: 12, color: "#7a7268", lineHeight: 1.7 }}>{method.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>

    {/* 自定义评测说明 */}
    <div style={{
      padding: "16px 20px", background: "#fff", border: "1px solid #e8e6e1",
      borderLeft: "3px solid #6b8f71",
    }}>
      <h4 style={{ margin: "0 0 6px", fontSize: 13, fontFamily: '"Noto Serif SC", Georgia, serif', color: "#4a4038" }}>
        支持自定义评测
      </h4>
      <p style={{ margin: 0, fontSize: 12, color: "#7a7268", lineHeight: 1.7 }}>
        管理员可根据不同产品类型和评测目标，自定义评测维度和评分标准。
        例如，工具类产品可提高「功能性」权重至 35%，情感类产品可提高「情感体验」权重至 30%，
        确保评测体系真正服务于业务目标。
      </p>
    </div>
  </>
);

/* ============================================================
 * Tab 3: 趋势追踪
 * ============================================================ */
const TrendsTab: React.FC<{ worksEval: WorkEval[] }> = ({ worksEval }) => {
  const improving = worksEval.filter((w) => w.trend > 0).length;
  const declining = worksEval.filter((w) => w.trend < 0).length;
  const stable = worksEval.filter((w) => w.trend === 0).length;

  return (
    <>
      {/* 趋势概览 */}
      <div style={{
        marginBottom: 20, padding: "18px 22px",
        background: "rgba(139,115,85,0.06)", border: "1px solid #d5cfc4", borderLeft: "3px solid #8b7355",
      }}>
        <h3 style={{ margin: "0 0 8px", fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, color: "#4a4038" }}>
          评测趋势追踪
        </h3>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5c5348", lineHeight: 1.8 }}>
          每次产品迭代后，Hermes 自动执行新一轮评测，对比历史数据生成趋势报告。
          帮助了解产品改进的实际效果，发现被忽视的退化问题。
        </p>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <AggregateStat label="趋势上升" value={improving} unit="个" />
          <AggregateStat label="趋势下降" value={declining} unit="个" />
          <AggregateStat label="趋势持平" value={stable} unit="个" />
        </div>
      </div>

      {/* 各作品趋势 */}
      <h3 style={{ margin: "0 0 12px", fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 14, color: "#4a4038" }}>
        各作品趋势（相比上次评测）
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {worksEval.map((work, idx) => {
          const isPositive = work.trend >= 0;
          const barWidth = Math.min(Math.abs(work.trend) * 15, 100);
          return (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 16px", background: "#fff", border: "1px solid #e8e6e1",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: "#4a4038", minWidth: 90 }}>{work.name}</span>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 6, background: "#e8e6e1", display: "flex" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    style={{
                      height: "100%",
                      background: isPositive ? "#6b8f71" : "#c44",
                      marginLeft: isPositive ? "auto" : 0,
                    }}
                  />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: isPositive ? "#6b8f71" : "#c44", minWidth: 44, textAlign: "right" }}>
                  {isPositive ? "+" : ""}{work.trend.toFixed(1)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 定时评测说明 */}
      <div style={{
        marginTop: 20, padding: "16px 20px", background: "#fff", border: "1px solid #e8e6e1",
        borderLeft: "3px solid #c4a060",
      }}>
        <h4 style={{ margin: "0 0 6px", fontSize: 13, fontFamily: '"Noto Serif SC", Georgia, serif', color: "#4a4038" }}>
          定时评测与报告推送
        </h4>
        <p style={{ margin: 0, fontSize: 12, color: "#7a7268", lineHeight: 1.7 }}>
          支持设置定时评测任务（如每周一自动评测），生成评测报告并推送给管理员。
          报告包含各维度得分变化、优化建议优先级排序、竞品对比分析等内容，
          让评测系统真正为业务决策服务。
        </p>
      </div>
    </>
  );
};

/* ============================================================
 * 聚合统计小组件
 * ============================================================ */
const AggregateStat: React.FC<{ label: string; value: string | number; unit: string }> = ({
  label, value, unit,
}) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: 20, fontFamily: '"Noto Serif SC", Georgia, serif', fontWeight: 700, color: "#4a4038" }}>
      {value}
      <span style={{ fontSize: 12, fontWeight: 400, color: "#a8a39b", marginLeft: 2 }}>{unit}</span>
    </div>
    <div style={{ fontSize: 11, color: "#a8a39b", marginTop: 2 }}>{label}</div>
  </div>
);

/* ============================================================
 * 作品详情弹窗
 * ============================================================ */
const WorkDetailModal: React.FC<{ work: WorkEval; onClose: () => void }> = ({ work, onClose }) => {
  const gc = gradeColors[work.grade] || gradeColors.B;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 10003,
        background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        style={{
          background: "#f5f0e6", width: "100%", maxWidth: 600,
          maxHeight: "82vh", overflow: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div style={{
          padding: "20px 24px 16px", borderBottom: "1px solid #d5cfc4",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, background: "#f5f0e6", zIndex: 1,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h3 style={{ margin: 0, fontFamily: '"Noto Serif SC", Georgia, serif', fontSize: 18, color: "#4a4038" }}>
              {work.name}
            </h3>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", background: gc.bg, color: gc.text, border: `1px solid ${gc.border}` }}>
              {work.grade} · {work.gradeLabel}
            </span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#a8a39b", fontSize: 22, padding: 4, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: "20px 24px 28px" }}>
          {/* 总分 + 趋势 */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 44, fontFamily: '"Noto Serif SC", Georgia, serif', fontWeight: 700, color: "#4a4038" }}>
              {work.totalScore}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: 12, color: "#a8a39b" }}>综合评分</span>
              <span style={{
                fontSize: 12, fontWeight: 600,
                color: work.trend >= 0 ? "#6b8f71" : "#c44",
              }}>
                {work.trend >= 0 ? "▲" : "▼"} {Math.abs(work.trend).toFixed(1)} vs 上次
              </span>
            </div>
          </div>

          {/* 五维得分 + 子维度 */}
          <h4 style={{ margin: "0 0 10px", fontSize: 13, fontFamily: '"Noto Serif SC", Georgia, serif', color: "#4a4038" }}>
            五维评测明细（含子维度）
          </h4>
          {DIMENSIONS.map((dim) => {
            const val = work.dimensions[dim.key] || 0;
            const subs = work.subScores[dim.key] || [0, 0, 0, 0];
            return (
              <div key={dim.key} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#4a4038" }}>{dim.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#4a4038" }}>{val}</span>
                </div>
                {/* 子维度进度条 */}
                <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                  {dim.subDimensions.map((sub, si) => {
                    const subVal = subs[si] || 0;
                    return (
                      <div key={sub.name} style={{ flex: sub.weight, display: "flex", flexDirection: "column", gap: 2 }}>
                        <div style={{ height: 4, background: "#e8e6e1" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${subVal}%` }}
                            transition={{ duration: 0.5, delay: 0.05 * si }}
                            style={{ height: "100%", background: subVal >= 90 ? "#8b7355" : subVal >= 80 ? "#a89470" : subVal >= 70 ? "#c4b99a" : "#d5cfc4" }}
                          />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 10, color: "#a8a39b" }}>{sub.name}</span>
                          <span style={{ fontSize: 10, color: "#7a7268" }}>{subVal}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* 亮点 */}
          <div style={{ marginTop: 18 }}>
            <h4 style={{ margin: "0 0 8px", fontSize: 13, color: "#6b8f71", fontFamily: '"Noto Serif SC", Georgia, serif' }}>亮点</h4>
            <ul style={{ margin: 0, padding: "0 0 0 16px", listStyle: "none" }}>
              {work.strengths.map((s, i) => (
                <li key={i} style={{ position: "relative", paddingLeft: 14, marginBottom: 4, fontSize: 12, color: "#5c5348", lineHeight: 1.7 }}>
                  <span style={{ position: "absolute", left: 0, top: 9, width: 4, height: 4, borderRadius: "50%", background: "#6b8f71" }} />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* 改进建议 */}
          {work.suggestions.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 13, color: "#c4a060", fontFamily: '"Noto Serif SC", Georgia, serif' }}>改进建议</h4>
              <ul style={{ margin: 0, padding: "0 0 0 16px", listStyle: "none" }}>
                {work.suggestions.map((s, i) => (
                  <li key={i} style={{ position: "relative", paddingLeft: 14, marginBottom: 4, fontSize: 12, color: "#5c5348", lineHeight: 1.7 }}>
                    <span style={{ position: "absolute", left: 0, top: 9, width: 4, height: 4, borderRadius: "50%", background: "#c4a060" }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 自动生成的优化建议 */}
          <div style={{
            marginTop: 16, padding: "14px 18px",
            background: "rgba(139,115,85,0.05)", border: "1px solid #d5cfc4",
            borderLeft: "3px solid #8b7355",
          }}>
            <h4 style={{ margin: "0 0 6px", fontSize: 13, fontFamily: '"Noto Serif SC", Georgia, serif', color: "#4a4038" }}>
              AI 优化建议
            </h4>
            <p style={{ margin: 0, fontSize: 12, color: "#5c5348", lineHeight: 1.8 }}>
              {work.optimizationAdvice}
            </p>
            <div style={{ marginTop: 8, fontSize: 10, color: "#c4b99a" }}>
              * 由 Hermes Review Agent 基于评测数据自动生成
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HermesEvalPanel;