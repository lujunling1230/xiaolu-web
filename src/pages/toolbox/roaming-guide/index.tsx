import { useCallback, useEffect } from "react";
import "./styles/variables.css";
import { useCityData } from "./hooks/useCityData";
import { useAIAssistant } from "./hooks/useAIAssistant";
import { track } from "../../../utils/track";
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
      {/* 欢迎语 */}
      <header style={{
        textAlign: "center",
        padding: "48px 20px 32px",
        maxWidth: 600,
        margin: "0 auto",
      }}>
        <h1 style={{
          fontSize: 28,
          fontFamily: "var(--rg-font-serif, 'Noto Serif SC', serif)",
          color: "var(--rg-ink, #5c3a21)",
          fontWeight: 600,
          letterSpacing: "6px",
          margin: "0 0 12px",
        }}>漫游指南</h1>
        <p style={{
          fontSize: 13,
          color: "var(--rg-ink-light, #8B7D6B)",
          letterSpacing: "2px",
          margin: "0 0 24px",
        }}>丙午年 · 启程</p>
        <div style={{
          fontSize: 14,
          lineHeight: 2,
          color: "var(--rg-ink, #5c3a21)",
          fontFamily: "var(--rg-font-serif, 'Noto Serif SC', serif)",
          opacity: 0.85,
        }}>
          <p style={{ margin: "0 0 6px" }}>世界是一张未折叠的地图，亦是无数条待踏足的路径。</p>
          <p style={{ margin: "0 0 6px" }}>每至一城，必察其街巷肌理，尝其市井烟火，录其食宿交通。</p>
          <p style={{ margin: 0 }}>积岁累月，汇为此卷，愿后来者少走弯路，多遇良辰。</p>
        </div>
      </header>

      {/* 导航栏 */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(250,248,243,0.92)",
        borderBottom: "1px solid var(--rg-ink-border, #C8B898)",
        padding: "8px 20px",
        display: "flex",
        justifyContent: "center",
        gap: 8,
        maxWidth: 1200,
        margin: "0 auto 24px",
        flexWrap: "wrap",
      }}>
        {[
          { key: "map", label: "足迹地图" },
          { key: "cards", label: "城市记忆" },
          { key: "ai", label: "漫游向导" },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => {
              if (item.key === "map") {
                document.getElementById("rg-map")?.scrollIntoView({ behavior: "smooth" });
              } else if (item.key === "cards") {
                document.getElementById("rg-cards")?.scrollIntoView({ behavior: "smooth" });
              } else if (item.key === "ai") {
                // Trigger the AI panel open by dispatching a custom event
                window.dispatchEvent(new CustomEvent("rg-open-ai"));
              }
            }}
            style={{
              background: "none",
              border: "1px solid var(--rg-ink-border, #C8B898)",
              borderRadius: 20,
              padding: "4px 14px",
              color: "var(--rg-ink-light, #8B7D6B)",
              fontSize: 12,
              fontFamily: "var(--rg-font-serif, 'Noto Serif SC', serif)",
              letterSpacing: "1px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#8B7355"; e.currentTarget.style.color = "#5c3a21"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--rg-ink-border, #C8B898)"; e.currentTarget.style.color = "var(--rg-ink-light, #8B7D6B)"; }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* 主内容区：左右布局 */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 20px",
        display: "flex",
        gap: 24,
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}>
        {/* 左栏：地图 + 统计 */}
        <div style={{ flex: "1 1 500px", minWidth: 0 }}>
          <MapContainer
            cities={cities}
            selectedCity={selectedCity}
            onSelectCity={handleSelectCity}
          />
          <StatsBar
            provinces={stats.provinces}
            cities={stats.cities}
            days={stats.days}
          />
        </div>
        {/* 右栏：城市卡片 */}
        <div id="rg-cards" style={{ flex: "1 1 500px", minWidth: 0 }}>
          <CityCardGallery
            cities={cities}
            selectedCity={selectedCity}
            onSelect={handleSelectCity}
            onAdd={handleAddCity}
          />
        </div>
      </div>

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
