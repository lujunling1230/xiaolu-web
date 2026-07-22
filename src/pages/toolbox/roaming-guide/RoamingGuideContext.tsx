import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useCityData } from "./hooks/useCityData";
import { useAIAssistant } from "./hooks/useAIAssistant";
import type { City, AIForwardGenerateResponse, AIReverseRecommendResponse } from "./types";

/* 点亮音效：Web Audio API 合成短促悦耳的和弦 */
function playLightUpSound() {
  try {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    const now = ctx.currentTime;
    // 上行旋律 C5 → E5 → G5 → C6（愉快的点亮感）
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.18, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.35);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.35);
    });
    // 自动关闭
    setTimeout(() => ctx.close(), 2000);
  } catch { /* 静默处理 */ }
}

interface RoamingGuideContextValue {
  /* ---- city data ---- */
  cities: City[];
  addCity: (city: Omit<City, "id" | "created_at" | "updated_at">) => void;
  updateCity: (city: City) => void;
  deleteCity: (id: number) => void;
  toggleCityStatus: (id: number) => void;
  getCityByCoord: (lng: number, lat: number) => City | undefined;
  stats: { provinces: number; cities: number; days: number };
  editingCity: City | null;
  setEditingCity: (city: City | null) => void;
  selectedCity: City | null;
  setSelectedCity: (city: City | null) => void;
  detailOpen: boolean;
  setDetailOpen: (open: boolean) => void;
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;

  /* ---- AI data ---- */
  recommendLoading: boolean;
  generateLoading: boolean;
  lastRecommendResult: AIReverseRecommendResponse | null;
  lastGenerateResult: AIForwardGenerateResponse | null;
  recommendError: string | null;
  generateError: string | null;
  reverseRecommend: (req: import("./types").AIReverseRecommendRequest) => Promise<AIReverseRecommendResponse>;
  forwardGenerate: (req: import("./types").AIForwardGenerateRequest) => Promise<AIForwardGenerateResponse>;
  adoptRecommendation: (city: AIReverseRecommendResponse["cities"][0]) => City;

  /* ---- composed callbacks ---- */
  handleSavePlan: (city: City, result: AIForwardGenerateResponse) => void;
  handleAdoptCity: (rec: AIReverseRecommendResponse["cities"][0]) => void;
  handleSelectCity: (city: City) => void;
  handleEditCity: (city: City) => void;
  handleDeleteCity: (id: number) => void;
  handleSaveCity: (city: City) => void;
  handleAddCity: () => void;
}

const Context = createContext<RoamingGuideContextValue | null>(null);

export function RoamingGuideProvider({ children }: { children: ReactNode }) {
  const cityData = useCityData();
  const aiData = useAIAssistant(cityData.addCity);
  const navigate = useNavigate();

  const handleSavePlan = useCallback((city: City, result: AIForwardGenerateResponse) => {
    const existing = cityData.cities.find(c => c.id === city.id || c.name === city.name);
    if (existing) {
      cityData.updateCity({
        ...existing,
        ai_plan: result.plan,
        updated_at: new Date().toISOString(),
      });
    } else {
      cityData.addCity({
        ...city,
        ai_plan: result.plan,
      } as Omit<City, "id" | "created_at" | "updated_at">);
    }
  }, [cityData.cities, cityData.addCity, cityData.updateCity]);

  const handleAdoptCity = useCallback((rec: AIReverseRecommendResponse["cities"][0]) => {
    const newCity = aiData.adoptRecommendation(rec);
    cityData.addCity(newCity);
  }, [aiData.adoptRecommendation, cityData.addCity]);

  const handleSelectCity = useCallback((city: City) => {
    cityData.setSelectedCity(city);
    cityData.setDetailOpen(true);
  }, []);

  const handleEditCity = useCallback((city: City) => {
    cityData.setEditingCity(city);
    cityData.setDetailOpen(false);
    cityData.setEditOpen(true);
  }, []);

  const handleDeleteCity = useCallback((id: number) => {
    cityData.deleteCity(id);
    cityData.setDetailOpen(false);
    cityData.setSelectedCity(null);
  }, [cityData.deleteCity]);

  const handleSaveCity = useCallback((city: City) => {
    const existing = cityData.cities.find(c => c.id === city.id);
    if (existing) {
      cityData.updateCity(city);
    } else {
      cityData.addCity(city);
      // 新城市点亮：音效 + 选中 + 跳转地图
      playLightUpSound();
      cityData.setSelectedCity(city);
      navigate("map", { relative: "path" });
    }
    cityData.setEditOpen(false);
    cityData.setEditingCity(null);
  }, [cityData.cities, cityData.addCity, cityData.updateCity, navigate]);

  const handleAddCity = useCallback(() => {
    cityData.setEditingCity(null);
    cityData.setEditOpen(true);
  }, []);

  const value: RoamingGuideContextValue = {
    ...cityData,
    ...aiData,
    handleSavePlan,
    handleAdoptCity,
    handleSelectCity,
    handleEditCity,
    handleDeleteCity,
    handleSaveCity,
    handleAddCity,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useRoamingGuide(): RoamingGuideContextValue {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useRoamingGuide must be used within RoamingGuideProvider");
  return ctx;
}
