import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
          onAdd={handleAddCity}
          title="已去"
          showAddButton={true}
        />

        {/* ===== 想去 ===== */}
        <div style={{ marginTop: -32 }}>
          <CityCardGallery
            cities={wantToGoCities}
            selectedCity={selectedCity}
            onSelect={handleSelectCity}
            onToggleStatus={toggleCityStatus}
            title="想去"
            showAddButton={false}
          />
        </div>

        {/* ===== 添加想去城市的两种途径 ===== */}
        <section className="rg-card-section" style={{ marginTop: -32 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}>
            {/* 途径一：地图点亮 */}
            <Link to="/toolbox/travel/map" style={{ textDecoration: "none" }}>
              <motion.div
                className="rg-hint-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(90,74,58,0.1)" }}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "24px 20px",
                  boxShadow: "0 4px 12px rgba(90,74,58,0.08)",
                  border: "1px solid rgba(90,74,58,0.06)",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 28, display: "block", marginBottom: 10 }}>🗺️</span>
                <h3 style={{
                  fontFamily: "'Source Han Serif SC', 'Noto Serif SC', serif",
                  fontSize: 15,
                  color: "#2C3E50",
                  margin: "0 0 6px",
                  letterSpacing: 1,
                }}>
                  在地图上点亮
                </h3>
                <p style={{
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: "#9A9A9A",
                  margin: 0,
                }}>
                  点击地图上的位置，手动标记想去或已去的城市
                </p>
                <span style={{
                  display: "inline-flex",
                  marginTop: 12,
                  padding: "5px 14px",
                  background: "rgba(244,211,94,0.12)",
                  borderRadius: 20,
                  fontSize: 11,
                  color: "#F4D35E",
                  letterSpacing: 1,
                }}>
                  去地图 →
                </span>
              </motion.div>
            </Link>

            {/* 途径二：漫游向导推荐 */}
            <Link to="/toolbox/travel/plan" style={{ textDecoration: "none" }}>
              <motion.div
                className="rg-hint-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(90,74,58,0.1)" }}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "24px 20px",
                  boxShadow: "0 4px 12px rgba(90,74,58,0.08)",
                  border: "1px solid rgba(90,74,58,0.06)",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 28, display: "block", marginBottom: 10 }}>🧭</span>
                <h3 style={{
                  fontFamily: "'Source Han Serif SC', 'Noto Serif SC', serif",
                  fontSize: 15,
                  color: "#2C3E50",
                  margin: "0 0 6px",
                  letterSpacing: 1,
                }}>
                  让 AI 推荐
                </h3>
                <p style={{
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: "#9A9A9A",
                  margin: 0,
                }}>
                  告诉向导你的偏好，AI 为你推荐宝藏城市
                </p>
                <span style={{
                  display: "inline-flex",
                  marginTop: 12,
                  padding: "5px 14px",
                  background: "rgba(123,168,158,0.1)",
                  borderRadius: 20,
                  fontSize: 11,
                  color: "#7BA89E",
                  letterSpacing: 1,
                }}>
                  去向导 →
                </span>
              </motion.div>
            </Link>
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
