import { useState, useCallback, useRef } from "react";
import {
  AIReverseRecommendRequest, AIReverseRecommendResponse,
  AIForwardGenerateRequest, AIForwardGenerateResponse,
  City,
} from "../types";
import { MOCK_REVERSE_RESPONSE, MOCK_FORWARD_RESPONSE } from "../constants";

/** 是否使用 Mock 数据（API 不可用时自动降级） */
const USE_MOCK = false;

interface UseAIAssistantReturn {
  recommendLoading: boolean;
  generateLoading: boolean;
  lastRecommendResult: AIReverseRecommendResponse | null;
  lastGenerateResult: AIForwardGenerateResponse | null;
  recommendError: string | null;
  generateError: string | null;
  reverseRecommend: (req: AIReverseRecommendRequest) => Promise<AIReverseRecommendResponse>;
  forwardGenerate: (req: AIForwardGenerateRequest) => Promise<AIForwardGenerateResponse>;
  adoptRecommendation: (city: AIReverseRecommendResponse["cities"][0]) => City;
}

async function callAI(action: string, payload: Record<string, unknown>) {
  try {
    const res = await fetch("/api/ai-travel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload }),
    });
    // 先检查响应体是否为空
    const text = await res.text();
    if (!text || text.trim().length === 0) {
      throw new Error("AI 服务返回为空，请稍后重试");
    }
    // 尝试解析 JSON
    const json = JSON.parse(text);
    if (!res.ok) throw new Error(json.error || "AI 服务调用失败");
    if (json.error) throw new Error(json.error);
    return json;
  } catch (e: unknown) {
    if (e instanceof SyntaxError) {
      throw new Error("AI 服务响应格式异常，请稍后重试");
    }
    throw e;
  }
}

export function useAIAssistant(
  addCity: (city: Omit<City, "id" | "created_at" | "updated_at">) => void
): UseAIAssistantReturn {
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [lastRecommendResult, setLastRecommendResult] = useState<AIReverseRecommendResponse | null>(null);
  const [lastGenerateResult, setLastGenerateResult] = useState<AIForwardGenerateResponse | null>(null);
  const [recommendError, setRecommendError] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const nextIdRef = useRef(0);

  const reverseRecommend = useCallback(async (req: AIReverseRecommendRequest): Promise<AIReverseRecommendResponse> => {
    setRecommendLoading(true);
    setRecommendError(null);
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const result = { ...MOCK_REVERSE_RESPONSE };
        setLastRecommendResult(result);
        return result;
      }

      const json = await callAI("recommend", { ...req.preferences });

      // API 返回格式异常时降级到 Mock
      if (json.raw) {
        console.warn("[useAIAssistant] AI 返回格式异常，使用 Mock 降级");
        const result = { ...MOCK_REVERSE_RESPONSE };
        setLastRecommendResult(result);
        return result;
      }

      const data = json.data as AIReverseRecommendResponse;
      const result: AIReverseRecommendResponse = {
        cities: (data.cities || []).map(c => ({
          name: c.name,
          province: c.province,
          coord: c.coord,
          reason: c.reason,
          highlights: c.highlights,
          best_season: c.best_season,
        })),
        summary: data.summary || "为你精选了几座值得一去的城市。",
      };

      setLastRecommendResult(result);
      return result;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "推荐失败，请稍后重试";
      setRecommendError(msg);
      // API 失败时降级到 Mock
      console.warn("[useAIAssistant] API 调用失败，降级到 Mock:", msg);
      await new Promise(resolve => setTimeout(resolve, 800));
      const result = { ...MOCK_REVERSE_RESPONSE };
      setLastRecommendResult(result);
      return result;
    } finally {
      setRecommendLoading(false);
    }
  }, []);

  const forwardGenerate = useCallback(async (req: AIForwardGenerateRequest): Promise<AIForwardGenerateResponse> => {
    setGenerateLoading(true);
    setGenerateError(null);
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 1800));
        const result = { ...MOCK_FORWARD_RESPONSE };
        result.plan = {
          ...result.plan,
          prompt: `${req.city_name} ${req.days || 3}天`,
          generated_at: new Date().toISOString(),
        };
        setLastGenerateResult(result);
        return result;
      }

      const json = await callAI("generate", {
        city_name: req.city_name,
        days: req.days,
        interests: req.interests,
      });

      if (json.raw) {
        console.warn("[useAIAssistant] AI 返回格式异常，使用 Mock 降级");
        const result = { ...MOCK_FORWARD_RESPONSE };
        setLastGenerateResult(result);
        return result;
      }

      const data = json.data as AIForwardGenerateResponse;
      const result: AIForwardGenerateResponse = {
        plan: {
          ...(data.plan || {}),
          generated_at: new Date().toISOString(),
          prompt: `${req.city_name} ${req.days || 3}天`,
        },
        detailed_guide: (data.detailed_guide || []).map(d => ({
          day: d.day,
          theme: d.theme,
          activities: d.activities,
          food_recommendations: d.food_recommendations,
          transport_tip: d.transport_tip,
          daily_budget: d.daily_budget,
        })),
      };

      setLastGenerateResult(result);
      return result;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "生成失败，请稍后重试";
      setGenerateError(msg);
      // API 失败时降级到 Mock
      console.warn("[useAIAssistant] API 调用失败，降级到 Mock:", msg);
      await new Promise(resolve => setTimeout(resolve, 800));
      const result = { ...MOCK_FORWARD_RESPONSE };
      result.plan = {
        ...result.plan,
        prompt: `${req.city_name} ${req.days || 3}天`,
        generated_at: new Date().toISOString(),
      };
      setLastGenerateResult(result);
      return result;
    } finally {
      setGenerateLoading(false);
    }
  }, []);

  const adoptRecommendation = useCallback((rec: AIReverseRecommendResponse["cities"][0]): City => {
    nextIdRef.current += 1;
    const now = new Date().toISOString();
    return {
      id: nextIdRef.current,
      name: rec.name,
      province: rec.province,
      coord: rec.coord,
      slogan: rec.reason.length > 20 ? rec.reason.slice(0, 20) + "..." : rec.reason,
      imageUrl: "",
      days: 3,
      play: rec.highlights.map(h => ({ name: h, rating: 4 })),
      eat: [],
      stay: "",
      tips: rec.reason,
      light_source: "ai_recommend",
      explore_count: 0,
      manual_guide: "",
      ai_plan: {
        generated_at: now,
        prompt: "AI 推荐",
        summary: rec.reason,
        days: 3,
        highlights: rec.highlights,
        budget_hint: "AI 推荐行程",
      },
      weather_tags: [{ season: rec.best_season, temp_range: "", description: rec.best_season + "适宜" }],
      created_at: now,
      updated_at: now,
    };
  }, []);

  return {
    recommendLoading, generateLoading,
    lastRecommendResult, lastGenerateResult,
    recommendError, generateError,
    reverseRecommend, forwardGenerate, adoptRecommendation,
  };
}
