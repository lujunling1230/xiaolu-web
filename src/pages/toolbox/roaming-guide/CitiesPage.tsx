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

  return (
    <>
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px 60px" }}>
        <CityCardGallery
          cities={cities}
          selectedCity={selectedCity}
          onSelect={handleSelectCity}
          onAdd={handleAddCity}
          onToggleStatus={toggleCityStatus}
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
