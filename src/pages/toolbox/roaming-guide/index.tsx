import { useCallback, useMemo } from "react";
import "./styles/variables.css";
import { useCityData } from "./hooks/useCityData";
import { useAIAssistant } from "./hooks/useAIAssistant";
import ScrollHeader from "./components/ScrollHeader";
import MapContainer from "./components/MapContainer";
import StatsBar from "./components/StatsBar";
import CityCardGallery from "./components/CityCardGallery";
import CityDetailModal from "./components/CityDetailModal";
import CityEditModal from "./components/CityEditModal";
import AIAssistantPanel from "./components/AIAssistantPanel";
import type { City, AIForwardGenerateResponse, AIReverseRecommendResponse } from "./types";

/**
 * 漫游指南 · Roaming Guide
 *
 * 真实地理坐标 + AI 智能旅行助手
 * 从"油画静态图"升级的交互系统。
 */
export default function RoamingGuidePage() {
  const {
    cities, addCity, updateCity, deleteCity,
    editingCity, setEditingCity,
    selectedCity, setSelectedCity,
    detailOpen, setDetailOpen,
    editOpen, setEditOpen,
    stats,
  } = useCityData();

  const {
    recommendLoading, generateLoading,
    lastRecommendResult, lastGenerateResult,
    recommendError, generateError,
    reverseRecommend, forwardGenerate, adoptRecommendation,
  } = useAIAssistant(addCity);

  /* 滚动到地图区域 */
  const scrollToMap = useCallback(() => {
    const el = document.getElementById("rg-map");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  /* 选中城市 → 打开详情 */
  const handleSelectCity = useCallback((city: City) => {
    setSelectedCity(city);
    setDetailOpen(true);
  }, []);

  /* 编辑城市 */
  const handleEditCity = useCallback((city: City) => {
    setEditingCity(city);
    setDetailOpen(false);
    setEditOpen(true);
  }, []);

  /* 删除城市 */
  const handleDeleteCity = useCallback((id: number) => {
    deleteCity(id);
    setDetailOpen(false);
    setSelectedCity(null);
  }, [deleteCity]);

  /* 保存城市（新增或编辑） */
  const handleSaveCity = useCallback((city: City) => {
    const existing = cities.find(c => c.id === city.id);
    if (existing) {
      updateCity(city);
    } else {
      addCity(city);
    }
    setEditOpen(false);
    setEditingCity(null);
  }, [cities, addCity, updateCity]);

  /* 打开新增弹窗 */
  const handleAddCity = useCallback(() => {
    setEditingCity(null);
    setEditOpen(true);
  }, []);

  /* AI 采纳推荐 → 点亮 */
  const handleAdoptCity = useCallback((rec: AIReverseRecommendResponse["cities"][0]) => {
    const newCity = adoptRecommendation(rec);
    addCity(newCity);
  }, [adoptRecommendation, addCity]);

  /* AI 保存攻略 */
  const handleSavePlan = useCallback((city: City, result: AIForwardGenerateResponse) => {
    const existing = cities.find(c => c.id === city.id || c.name === city.name);
    if (existing) {
      // 更新已有城市的 AI 计划
      updateCity({
        ...existing,
        ai_plan: result.plan,
        updated_at: new Date().toISOString(),
      });
    } else {
      // 新城市，自动添加
      addCity({
        ...city,
        ai_plan: result.plan,
      } as Omit<City, "id" | "created_at" | "updated_at">);
    }
  }, [cities, addCity, updateCity]);

  return (
    <div className="rg-page" style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, var(--rg-paper-deep) 0%, var(--rg-paper) 30%, var(--rg-paper-light) 100%)",
      fontFamily: "var(--rg-font-serif), serif",
    }}>
      {/* 全局布局样式 */}
      <style>{`
        /* 统计栏上方留出与卷轴的呼吸空间 */
        .rg-stats-bar {
          margin-top: 48px !important;
        }
      `}</style>

      {/* 卷轴 Hero */}
      <ScrollHeader onScrollToMap={scrollToMap} />

      {/* 统计栏 */}
      <StatsBar
        provinces={stats.provinces}
        cities={stats.cities}
        days={stats.days}
      />

      {/* 地图区域 */}
      <MapContainer
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
      />

      {/* 城市卡片画廊 */}
      <CityCardGallery
        cities={cities}
        selectedCity={selectedCity}
        onSelect={handleSelectCity}
        onAdd={handleAddCity}
      />

      {/* 页脚留白 */}
      <div style={{ height: "120px" }} />

      {/* 详情 Modal */}
      <CityDetailModal
        city={selectedCity}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onEdit={handleEditCity}
        onDelete={handleDeleteCity}
      />

      {/* 编辑/新增 Modal */}
      <CityEditModal
        city={editingCity}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveCity}
      />

      {/* AI 助手面板 */}
      <AIAssistantPanel
        cities={cities}
        recommendLoading={recommendLoading}
        generateLoading={generateLoading}
        lastRecommendResult={lastRecommendResult}
        lastGenerateResult={lastGenerateResult}
        recommendError={recommendError}
        generateError={generateError}
        onReverseRecommend={reverseRecommend}
        onForwardGenerate={forwardGenerate}
        onAdoptCity={handleAdoptCity}
        onSavePlan={handleSavePlan}
      />
    </div>
  );
}
