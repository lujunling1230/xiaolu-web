import { useCallback } from "react";
import { useRoamingGuide } from "./RoamingGuideContext";
import MapContainer from "./components/MapContainer";
import StatsBar from "./components/StatsBar";
import CityDetailModal from "./components/CityDetailModal";
import CityEditModal from "./components/CityEditModal";

export default function MapPage() {
  const {
    cities, stats,
    selectedCity, setSelectedCity,
    detailOpen, setDetailOpen,
    editOpen, setEditOpen,
    editingCity, setEditingCity,
    handleSelectCity, handleEditCity, handleDeleteCity,
    handleSaveCity, handleAddCity,
  } = useRoamingGuide();

  const scrollToMap = useCallback(() => {
    const el = document.getElementById("rg-map");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <style>{`
        .rg-stats-bar {
          margin-top: 48px !important;
        }
        .rg-map-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 16px;
          padding: 0 20px;
        }
        .rg-map-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 20px;
          border: 1px solid var(--rg-ink-border, #C8B898);
          background: rgba(255,255,255,0.7);
          color: var(--rg-ink, #5c3a21);
          font-size: 13px;
          font-family: var(--rg-font-serif, 'Noto Serif SC', serif);
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .rg-map-action-btn:hover {
          border-color: #8B7355;
          background: rgba(255,255,255,0.9);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .rg-map-action-btn--primary {
          background: rgba(92,58,33,0.06);
          border-color: #5c3a21;
        }
        .rg-map-action-btn--primary:hover {
          background: rgba(92,58,33,0.1);
        }
      `}</style>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px 60px" }}>
        <MapContainer
          cities={cities}
          selectedCity={selectedCity}
          onSelectCity={handleSelectCity}
        />

        {/* 点亮按钮 */}
        <div className="rg-map-actions">
          <button
            className="rg-map-action-btn rg-map-action-btn--primary"
            onClick={handleAddCity}
          >
            <span style={{ fontSize: 14 }}>&#x2605;</span>
            <span>点亮</span>
          </button>
        </div>

        <StatsBar
          provinces={stats.provinces}
          cities={stats.cities}
          days={stats.days}
        />
      </main>

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
        onClose={() => { setEditOpen(false); setEditingCity(null); }}
        onSave={handleSaveCity}
      />
    </>
  );
}
