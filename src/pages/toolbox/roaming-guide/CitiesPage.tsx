import { motion } from "framer-motion";
import { useRoamingGuide } from "./RoamingGuideContext";
import CityCardGallery from "./components/CityCardGallery";
import CityDetailModal from "./components/CityDetailModal";
import CityEditModal from "./components/CityEditModal";

export default function CitiesPage() {
  const {
    cities,
    selectedCity, setSelectedCity,
    detailOpen, setDetailOpen,
    editOpen, setEditOpen,
    editingCity, setEditingCity,
    handleSelectCity, handleEditCity, handleDeleteCity,
    handleSaveCity, handleAddCity,
    toggleCityStatus,
  } = useRoamingGuide();

  const visitedCities = cities.filter((c) => c.status === "visited");
  const wantToGoCities = cities.filter((c) => c.status === "want_to_go");

  return (
    <>
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px 60px" }}>
        {/* ===== 已去 ===== */}
        <CityCardGallery
          cities={visitedCities}
          selectedCity={selectedCity}
          onSelect={handleSelectCity}
          onToggleStatus={toggleCityStatus}
          title="已去"
          showAddButton={false}
        />

        {/* ===== 想去 ===== */}
        <CityCardGallery
          cities={wantToGoCities}
          selectedCity={selectedCity}
          onSelect={handleSelectCity}
          onToggleStatus={toggleCityStatus}
          title="想去"
          showAddButton={false}
        />

        {/* ===== 添加城市 ===== */}
        <section className="rg-card-section">
          <div
            className="rg-card-section-head"
            style={{ justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span className="rg-stamp">新</span>
              <h2 className="rg-card-section-title">添加城市</h2>
            </div>
          </div>
          <div className="rg-cards-scroll">
            <div className="rg-cards-track">
              <motion.button
                className="rg-city-card rg-add-card"
                onClick={handleAddCity}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="rg-add-card-inner">
                  <span className="rg-add-card-icon">+</span>
                  <span className="rg-add-card-text">添加城市</span>
                </div>
              </motion.button>
            </div>
          </div>
        </section>
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
