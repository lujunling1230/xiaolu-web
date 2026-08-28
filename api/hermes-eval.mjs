/**
 * Hermes 评测系统 API（Vercel Serverless Function）
 * POST /api/hermes-eval
 *
 * 真正调用网站各作品的 AI 接口，基于实际响应生成评测分数。
 * 评测维度：AI 能力、功能性、性能、视觉交互、情感体验
 *
 * 响应格式：SSE（Server-Sent Events），逐步推送每个作品的评测结果
 */

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.API_BASE
  ? process.env.API_BASE.replace(/\/api\/analytics$/, "")
  : "https://www.xiaoluweb.com";

/* ─── 评测用例定义 ─── */
const EVAL_CASES = [
  {
    workId: "xiaoye",
    workName: "网站助手（小叶）",
    endpoint: "/api/xiaoye",
    method: "POST",
    body: { question: "小鹿同学的作品有哪些？" },
    expectations: {
      minLength: 20,
      keywords: ["森林疗愈", "爱情公寓", "漫游指南", "物资管家", "通关清单"],
      minKeywordMatch: 1,
    },
  },
  {
    workId: "travel",
    workName: "漫游指南",
    endpoint: "/api/ai-travel",
    method: "POST",
    body: {
      action: "recommend",
      payload: { mood: "放松", budget: "2000", days: "3" },
    },
    expectations: {
      requiredFields: ["cities"],
      jsonFields: ["cities"],
      minArrayLength: 1,
    },
  },
  {
    workId: "inventory",
    workName: "物资管家",
    endpoint: "/api/ai-chat",
    method: "POST",
    body: {
      message: "我的冰箱里有什么？",
      inventoryData: [
        { name: "牛奶", category: "饮品", quantity: 2, expiryDate: "2026-08-15" },
        { name: "鸡蛋", category: "食材", quantity: 10, expiryDate: "2026-08-20" },
      ],
    },
    expectations: {
      minLength: 10,
      keywords: ["牛奶", "鸡蛋"],
      minKeywordMatch: 1,
    },
  },
  {
    workId: "apartment",
    workName: "爱情公寓",
    endpoint: "/api/ai",
    method: "POST",
    body: {
      systemPrompt:
        "你是胡一菲，性格泼辣直爽的大学辅导员。请用你的语气回复对方。",
      messages: [{ role: "user", content: "一菲姐，今天好累啊" }],
      model: "qwen-turbo",
      maxTokens: 150,
    },
    expectations: {
      minLength: 15,
    },
  },
];

/* ─── 页面可访问性检测目标 ─── */
const PAGE_CHECKS = [
  { workId: "healing", workName: "森林疗愈室", path: "/forest" },
  { workId: "quests", workName: "通关清单", path: "/toolbox/quests" },
  { workId: "recharge", workName: "回血清单", path: "/toolbox/answer" },
  { workId: "banling", workName: "伴龄", path: "/toolbox/banling" },
];

/* ─── 评分工具函数 ─── */

function clampScore(val) {
  return Math.max(0, Math.min(100, Math.round(val)));
}

function calculateAIScore(responseData, expectations, responseTime) {
  let score = 60; // 基础分

  // 响应长度检查
  const text = typeof responseData === "string"
    ? responseData
    : JSON.stringify(responseData);
  if (text.length >= (expectations.minLength || 20)) {
    score += 10;
  }

  // 关键词匹配
  if (expectations.keywords) {
    const matches = expectations.keywords.filter((k) => text.includes(k)).length;
    const ratio = matches / expectations.keywords.length;
    score += Math.round(ratio * 15);
  }

  // 必填字段检查
  if (expectations.requiredFields) {
    const fieldsMet = expectations.requiredFields.filter(
      (f) => responseData && responseData[f] !== undefined
    ).length;
    const fieldRatio = fieldsMet / expectations.requiredFields.length;
    score += Math.round(fieldRatio * 15);
  }

  // 响应时间加分（< 5s 满分，> 15s 不加分）
  if (responseTime < 5000) score += 5;
  else if (responseTime < 10000) score += 3;
  else if (responseTime < 15000) score += 1;

  return clampScore(score);
}

function calculateFunctionScore(success, validJson, hasError) {
  let score = 50;
  if (success) score += 30;
  if (validJson) score += 15;
  if (!hasError) score += 5;
  return clampScore(score);
}

function calculatePerformanceScore(responseTime) {
  // < 2s -> 95+, < 5s -> 85+, < 10s -> 70+, < 20s -> 55+, else 40
  if (responseTime < 2000) return clampScore(98 - (responseTime / 2000) * 8);
  if (responseTime < 5000) return clampScore(88 - ((responseTime - 2000) / 3000) * 10);
  if (responseTime < 10000) return clampScore(75 - ((responseTime - 5000) / 5000) * 10);
  if (responseTime < 20000) return clampScore(60 - ((responseTime - 10000) / 10000) * 10);
  return 40;
}

function calculateVisualScore(pageAccessible) {
  // 页面可访问性 + 基础分
  return clampScore(pageAccessible ? 85 : 50);
}

function calculateEmotionalScore(text, expectations) {
  let score = 70;
  if (!text) return score;

  // 情感温度词检测
  const warmWords = ["温暖", "陪伴", "加油", "没关系", "理解", "辛苦", "相信", "勇敢", "希望", "美好"];
  const warmCount = warmWords.filter((w) => text.includes(w)).length;
  score += Math.min(warmCount * 4, 16);

  // 语气检查
  if (expectations.toneCheck && text.length > 30) score += 8;

  // 回复长度适中
  if (text.length > 50 && text.length < 500) score += 6;

  return clampScore(score);
}

function calculateGrade(totalScore) {
  if (totalScore >= 90) return { grade: "S", label: "卓越" };
  if (totalScore >= 80) return { grade: "A", label: "优秀" };
  if (totalScore >= 70) return { grade: "B", label: "良好" };
  return { grade: "C", label: "待提升" };
}

function calculateTotal(dimensions) {
  const weights = {
    functionality: 0.25,
    ai_capability: 0.25,
    visual_interaction: 0.2,
    performance: 0.15,
    emotional_experience: 0.15,
  };
  let total = 0;
  for (const [key, weight] of Object.entries(weights)) {
    total += (dimensions[key] || 0) * weight;
  }
  return Math.round(total * 10) / 10;
}

/* ─── 单个 API 评测 ─── */

async function evalApiCase(apiCase) {
  const startTime = Date.now();
  let success = false;
  let validJson = false;
  let hasError = false;
  let responseData = null;
  let errorMessage = null;

  try {
    const res = await fetch(`${BASE_URL}${apiCase.endpoint}`, {
      method: apiCase.method || "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(apiCase.body),
      signal: AbortSignal.timeout(20000), // 20s 超时
    });

    const responseTime = Date.now() - startTime;

    if (res.ok) {
      success = true;
      try {
        responseData = await res.json();
        validJson = true;
      } catch {
        responseData = await res.text();
      }
    } else {
      hasError = true;
      errorMessage = `HTTP ${res.status}`;
      responseData = null;
    }

    const responseTimeFinal = Date.now() - startTime;
    const text =
      typeof responseData === "string"
        ? responseData
        : JSON.stringify(responseData);

    const dimensions = {
      functionality: calculateFunctionScore(success, validJson, hasError),
      ai_capability: success
        ? calculateAIScore(responseData, apiCase.expectations || {}, responseTimeFinal)
        : 40,
      visual_interaction: 80, // 页面视觉无法在服务端评测，给基础分
      performance: calculatePerformanceScore(responseTimeFinal),
      emotional_experience: success
        ? calculateEmotionalScore(text, apiCase.expectations || {})
        : 50,
    };

    const totalScore = calculateTotal(dimensions);
    const { grade, label } = calculateGrade(totalScore);

    return {
      workId: apiCase.workId,
      workName: apiCase.workName,
      success,
      responseTime: responseTimeFinal,
      totalScore,
      grade,
      gradeLabel: label,
      dimensions,
      strengths: generateStrengths(dimensions, success, responseTimeFinal),
      suggestions: generateSuggestions(dimensions, success, hasError, errorMessage, responseTimeFinal),
      responsePreview: text.substring(0, 200),
    };
  } catch (err) {
    const responseTime = Date.now() - startTime;
    hasError = true;
    errorMessage = err.name === "TimeoutError" ? "请求超时（20s）" : err.message;

    const dimensions = {
      functionality: 40,
      ai_capability: 40,
      visual_interaction: 50,
      performance: 30,
      emotional_experience: 50,
    };
    const totalScore = calculateTotal(dimensions);
    const { grade, label } = calculateGrade(totalScore);

    return {
      workId: apiCase.workId,
      workName: apiCase.workName,
      success: false,
      responseTime,
      totalScore,
      grade,
      gradeLabel: label,
      dimensions,
      strengths: [],
      suggestions: [`接口调用失败：${errorMessage}`],
      responsePreview: null,
    };
  }
}

/* ─── 页面可访问性检测 ─── */

async function evalPageCheck(pageCheck) {
  const startTime = Date.now();
  try {
    const res = await fetch(`${BASE_URL}${pageCheck.path}`, {
      method: "GET",
      signal: AbortSignal.timeout(10000),
      redirect: "follow",
    });
    const responseTime = Date.now() - startTime;
    const accessible = res.ok;

    const dimensions = {
      functionality: accessible ? 85 : 50,
      ai_capability: 75, // 无 AI 接口，给中等分
      visual_interaction: accessible ? 82 : 50,
      performance: calculatePerformanceScore(responseTime),
      emotional_experience: 78,
    };

    const totalScore = calculateTotal(dimensions);
    const { grade, label } = calculateGrade(totalScore);

    return {
      workId: pageCheck.workId,
      workName: pageCheck.workName,
      success: accessible,
      responseTime,
      totalScore,
      grade,
      gradeLabel: label,
      dimensions,
      strengths: accessible ? ["页面可正常访问"] : [],
      suggestions: accessible ? [] : [`页面返回 HTTP ${res.status}`],
      responsePreview: null,
    };
  } catch (err) {
    const responseTime = Date.now() - startTime;
    const dimensions = {
      functionality: 40,
      ai_capability: 50,
      visual_interaction: 40,
      performance: 30,
      emotional_experience: 50,
    };
    const totalScore = calculateTotal(dimensions);
    const { grade, label } = calculateGrade(totalScore);

    return {
      workId: pageCheck.workId,
      workName: pageCheck.workName,
      success: false,
      responseTime,
      totalScore,
      grade,
      gradeLabel: label,
      dimensions,
      strengths: [],
      suggestions: [`页面访问失败：${err.message}`],
      responsePreview: null,
    };
  }
}

/* ─── 生成亮点和建议 ─── */

function generateStrengths(dimensions, success, responseTime) {
  const strengths = [];
  if (success) strengths.push("接口响应正常，功能可用");
  if (dimensions.ai_capability >= 85) strengths.push("AI 回答质量较高");
  if (dimensions.performance >= 85) strengths.push(`响应速度快（${(responseTime / 1000).toFixed(1)}s）`);
  if (dimensions.emotional_experience >= 85) strengths.push("情感表达到位，温度感强");
  if (dimensions.functionality >= 85) strengths.push("功能完整性好");
  return strengths.length ? strengths : ["基础功能正常运行"];
}

function generateSuggestions(dimensions, success, hasError, errorMessage, responseTime) {
  const suggestions = [];
  if (!success) suggestions.push(`接口异常：${errorMessage || "未知错误"}`);
  if (dimensions.performance < 70) suggestions.push(`响应时间较长（${(responseTime / 1000).toFixed(1)}s），建议优化 API 链路`);
  if (dimensions.ai_capability < 75) suggestions.push("AI 回答质量可提升，建议优化 Prompt 或更换模型");
  if (dimensions.emotional_experience < 75) suggestions.push("情感温度可加强，增加共情文案");
  if (success && !hasError && suggestions.length === 0) suggestions.push("整体表现良好，建议持续监控稳定性");
  return suggestions;
}

/* ─── 主处理函数 ─── */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // SSE 流式推送
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    // 推送评测开始
    sendEvent("start", {
      totalCases: EVAL_CASES.length + PAGE_CHECKS.length,
      timestamp: new Date().toISOString(),
    });

    const results = [];

    // 依次评测每个 API 用例
    for (let i = 0; i < EVAL_CASES.length; i++) {
      const apiCase = EVAL_CASES[i];
      sendEvent("progress", {
        step: i + 1,
        total: EVAL_CASES.length + PAGE_CHECKS.length,
        workName: apiCase.workName,
        type: "api",
      });

      const result = await evalApiCase(apiCase);
      results.push(result);
      sendEvent("result", result);
    }

    // 依次检测页面可访问性
    for (let i = 0; i < PAGE_CHECKS.length; i++) {
      const pageCheck = PAGE_CHECKS[i];
      sendEvent("progress", {
        step: EVAL_CASES.length + i + 1,
        total: EVAL_CASES.length + PAGE_CHECKS.length,
        workName: pageCheck.workName,
        type: "page",
      });

      const result = await evalPageCheck(pageCheck);
      results.push(result);
      sendEvent("result", result);
    }

    // 汇总统计
    const summary = {
      totalWorks: results.length,
      avgScore: Math.round((results.reduce((s, r) => s + r.totalScore, 0) / results.length) * 10) / 10,
      sCount: results.filter((r) => r.grade === "S").length,
      aCount: results.filter((r) => r.grade === "A").length,
      bCount: results.filter((r) => r.grade === "B").length,
      successCount: results.filter((r) => r.success).length,
      avgResponseTime: Math.round(results.reduce((s, r) => s + r.responseTime, 0) / results.length),
      evalDate: new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }),
    };

    sendEvent("complete", { summary, results });
    res.end();
  } catch (err) {
    sendEvent("error", { message: err.message });
    res.end();
  }
}
