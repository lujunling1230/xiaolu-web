import { useState, useCallback, useRef } from "react";
import {
  AIReverseRecommendRequest, AIReverseRecommendResponse,
  AIForwardGenerateRequest, AIForwardGenerateResponse,
  City, STORAGE_KEYS,
} from "../types";
import { MOCK_REVERSE_RESPONSE, MOCK_FORWARD_RESPONSE } from "../constants";

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
      // Mock: 模拟 1.5s AI 延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = { ...MOCK_REVERSE_RESPONSE, summary: `根据你选择的"${req.preferences.season || "不限"}"季节、"${req.preferences.budget || "不限"}"预算，为你推荐以下城市。` };
      setLastRecommendResult(result);
      return result;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "推荐失败";
      setRecommendError(msg);
      throw e;
    } finally {
      setRecommendLoading(false);
    }
  }, []);

  const forwardGenerate = useCallback(async (req: AIForwardGenerateRequest): Promise<AIForwardGenerateResponse> => {
    setGenerateLoading(true);
    setGenerateError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1800));
      const result = { ...MOCK_FORWARD_RESPONSE };
      result.plan = {
        ...result.plan,
        prompt: `${req.city_name} ${req.days || 3}天`,
        generated_at: new Date().toISOString(),
      };
      setLastGenerateResult(result);
      return result;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "生成失败";
      setGenerateError(msg);
      throw e;
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
      slogan: rec.reason.slice(0, 20),
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
