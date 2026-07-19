import { useRef, useEffect, useMemo } from "react";
import { City } from "../types";
import { useAMap } from "../hooks/useAMap";

interface MapContainerProps {
  cities: City[];
  selectedCity: City | null;
  onSelectCity: (city: City) => void;
}

export default function MapContainer({ cities, selectedCity, onSelectCity }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { map, loading, error, flyTo } = useAMap({ containerRef });

  // Mock 阶段：点击城市时调用 flyTo
  useEffect(() => {
    if (selectedCity && containerRef.current) {
      const target = containerRef.current.querySelector(`[data-city="${selectedCity.name}"]`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        target.classList.add("rg-marker-active");
      }
    }
  }, [selectedCity]);

  const manualCities = useMemo(() => cities.filter(c => c.light_source === "manual"), [cities]);
  const aiCities = useMemo(() => cities.filter(c => c.light_source === "ai_recommend"), [cities]);

  return (
    <>
      <style>{`
        .rg-map-section {
          position: relative;
          width: 100%;
          max-width: 960px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .rg-map-wrapper {
          position: relative;
          width: 100%;
          height: 480px;
          border-radius: 8px;
          overflow: hidden;
          background: var(--rg-paper);
          border: 3px solid #C8B898;
          box-shadow: var(--rg-shadow-card);
        }
        .rg-map-placeholder {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #E8E0D0 0%, #F5F0E6 40%, #EDE5D5 100%);
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 12px;
          position: relative; overflow: hidden;
        }
        /* 纸张纹理 */
        .rg-map-placeholder::before {
          content: ""; position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg, transparent 0px, transparent 20px, rgba(0,0,0,0.015) 20px, rgba(0,0,0,0.015) 21px);
          pointer-events: none;
        }
        .rg-map-placeholder-text {
          font-family: var(--rg-font-serif);
          color: var(--rg-ink-light);
          font-size: 16px;
          letter-spacing: 0.1em;
          z-index: 1;
        }
        .rg-map-placeholder-sub {
          font-size: 13px;
          color: #B0A090;
          letter-spacing: 0.06em;
        }

        /* Marker 容器（Mock 阶段：手动定位的 SVG 标记） */
        .rg-markers-overlay {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 2;
        }

        /* 手动点亮 Marker */
        .rg-marker {
          position: absolute;
          pointer-events: auto;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .rg-marker:hover { transform: scale(1.2) translateY(-2px); }
        .rg-marker-active { transform: scale(1.3) translateY(-4px); }

        .rg-marker-dot {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: var(--rg-amber-solid);
          box-shadow: 0 2px 6px rgba(196, 148, 82, 0.4);
          position: relative;
        }
        .rg-marker-dot::after {
          content: "";
          position: absolute; bottom: -6px; left: 50%;
          transform: translateX(-50%);
          width: 2px; height: 6px;
          background: var(--rg-amber-solid);
          border-radius: 0 0 1px 1px;
        }
        .rg-marker-label {
          position: absolute; top: -24px; left: 50%;
          transform: translateX(-50%);
          font-family: var(--rg-font-serif);
          font-size: 11px; color: var(--rg-ink);
          white-space: nowrap;
          background: rgba(255,255,255,0.85);
          padding: 1px 6px;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          opacity: 0; transition: opacity 0.2s;
          pointer-events: none;
        }
        .rg-marker:hover .rg-marker-label,
        .rg-marker-active .rg-marker-label { opacity: 1; }

        /* AI 推荐 Marker：发光脉冲 */
        .rg-marker.ai .rg-marker-dot {
          background: var(--rg-pine-solid);
          box-shadow: 0 0 8px rgba(93, 138, 106, 0.5);
          animation: rg-pulse 2s ease-in-out infinite;
        }
        .rg-marker.ai .rg-marker-dot::before {
          content: "";
          position: absolute; inset: -4px;
          border: 1.5px dashed var(--rg-pine-solid);
          border-radius: 50%;
          animation: rg-pulse-ring 2s ease-in-out infinite;
        }
        .rg-marker.ai .rg-marker-label {
          background: rgba(93, 138, 106, 0.15);
          border: 1px solid rgba(93, 138, 106, 0.3);
        }
        .rg-marker.ai .rg-marker-label::after {
          content: "AI";
          font-size: 9px;
          background: var(--rg-pine-solid);
          color: #fff;
          padding: 0 3px;
          border-radius: 2px;
          margin-left: 4px;
          vertical-align: middle;
          font-weight: 600;
        }

        @keyframes rg-pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(93, 138, 106, 0.4); }
          50% { box-shadow: 0 0 16px rgba(93, 138, 106, 0.7); }
        }
        @keyframes rg-pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 0.2; }
        }

        /* 加载和错误状态 */
        .rg-map-loading, .rg-map-error {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--rg-font-serif);
          color: var(--rg-ink-light);
        }

        /* 地图四角装饰图钉 */
        .rg-map-pin {
          position: absolute; width: 12px; height: 12px; z-index: 3;
          pointer-events: none;
        }
        .rg-map-pin::before {
          content: ""; position: absolute;
          top: 0; left: 0; width: 12px; height: 12px;
          background: radial-gradient(circle at 4px 4px, #D4B483 0%, #B8956A 60%, #8B7355 100%);
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .rg-map-pin::after {
          content: ""; position: absolute;
          top: 10px; left: 3px; width: 6px; height: 6px;
          background: rgba(0,0,0,0.2);
          border-radius: 50% 50% 0 0;
          transform: rotate(-45deg);
        }
        .rg-map-pin.tl { top: 8px; left: 8px; }
        .rg-map-pin.tr { top: 8px; right: 8px; }
        .rg-map-pin.bl { bottom: 8px; left: 8px; }
        .rg-map-pin.br { bottom: 8px; right: 8px; }

        @media (max-width: 640px) {
          .rg-map-wrapper { height: 320px; }
          .rg-map-section { padding: 0 12px; }
        }
      `}</style>
      <section className="rg-map-section travel-section" id="rg-map">
        <div className="rg-map-wrapper">
          {loading && <div className="rg-map-loading">地图加载中...</div>}
          {error && <div className="rg-map-error">{error}</div>}
          {!loading && !error && (
            <div className="rg-map-placeholder" ref={containerRef}>
              {/* Mock Marker 定位：使用百分比近似中国地图位置 */}
              <div className="rg-markers-overlay">
                {manualCities.map(city => (
                  <div
                    key={city.id}
                    className={`rg-marker ${selectedCity?.id === city.id ? "rg-marker-active" : ""}`}
                    data-city={city.name}
                    style={getMockPosition(city.coord)}
                    onClick={() => onSelectCity(city)}
                  >
                    <div className="rg-marker-dot" />
                    <div className="rg-marker-label">{city.name}</div>
                  </div>
                ))}
                {aiCities.map(city => (
                  <div
                    key={city.id}
                    className={`rg-marker ai ${selectedCity?.id === city.id ? "rg-marker-active" : ""}`}
                    data-city={city.name}
                    style={getMockPosition(city.coord)}
                    onClick={() => onSelectCity(city)}
                  >
                    <div className="rg-marker-dot" />
                    <div className="rg-marker-label">{city.name}</div>
                  </div>
                ))}
              </div>
              <span className="rg-map-placeholder-text">山川城郭，待君踏足</span>
              <span className="rg-map-placeholder-sub">真实地图即将接入</span>
            </div>
          )}
          {/* 四角装饰图钉 */}
          <div className="rg-map-pin tl" />
          <div className="rg-map-pin tr" />
          <div className="rg-map-pin bl" />
          <div className="rg-map-pin br" />
        </div>
      </section>
    </>
  );
}

/** Mock：将经纬度转换为容器的百分比位置（中国地图范围近似） */
function getMockPosition(coord: { lng: number; lat: number }): React.CSSProperties {
  // 中国范围：lng 73-135, lat 18-54
  const x = ((coord.lng - 73) / (135 - 73)) * 100;
  const y = (1 - (coord.lat - 18) / (54 - 18)) * 100;
  return {
    left: `${Math.max(5, Math.min(95, x))}%`,
    top: `${Math.max(5, Math.min(95, y))}%`,
    transform: "translate(-50%, -50%)",
  };
}