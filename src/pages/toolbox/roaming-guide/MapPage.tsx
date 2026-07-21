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
          border: 1px solid rgba(90, 74, 58, 0.08);
          background: rgba(245,243,238,0.8);
          color: #5A4A3A;
          font-size: 13px;
          font-family: 'PingFang SC', system-ui, sans-serif;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(8px);
        }
        .rg-map-action-btn:hover {
          border-color: rgba(90, 74, 58, 0.15);
          background: rgba(245,243,238,0.95);
          box-shadow: 0 4px 12px rgba(90, 74, 58, 0.08);
        }
        .rg-map-action-btn--primary {
          background: #F4D35E;
          border-color: #F4D35E;
          color: #5A4A3A;
        }
        .rg-map-action-btn--primary:hover {
          background: #e8c74e;
          border-color: #e8c74e;
        }
      `}</style>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px 60px", background: "#F5F3EE", fontFamily: "'PingFang SC', system-ui, sans-serif", minHeight: "100vh" }}>
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
