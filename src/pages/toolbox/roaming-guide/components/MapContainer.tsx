import { useRef, useEffect, useMemo, useCallback } from "react";
import { City } from "../types";
import { useAMap } from "../hooks/useAMap";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AMapType = any;

interface MapContainerProps {
  cities: City[];
  selectedCity: City | null;
  onSelectCity: (city: City) => void;
}

export default function MapContainer({ cities, selectedCity, onSelectCity }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { map, loading, error, flyTo, getAMap } = useAMap({ containerRef });
  const infoWindowRef = useRef<AMapType | null>(null);
  const markersRef = useRef<AMapType[]>([]);

  const manualCities = useMemo(() => cities.filter((c) => c.light_source === "manual"), [cities]);
  const aiCities = useMemo(() => cities.filter((c) => c.light_source === "ai_recommend"), [cities]);

  /* ---------- 清除旧 Marker ---------- */
  const clearMarkers = useCallback(() => {
    const AMap = getAMap();
    if (!AMap) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
  }, [getAMap]);

  /* ---------- 构建 InfoWindow HTML ---------- */
  const buildInfoContent = useCallback(
    (city: City): string => {
      const sourceLabel =
        city.light_source === "ai_recommend"
          ? `<span class="rg-info-source rg-info-source-ai">AI 推荐</span>`
          : `<span class="rg-info-source rg-info-source-manual">手动点亮</span>`;
      return `
        <div class="rg-info-window">
          <div class="rg-info-title">${city.name}</div>
          <div class="rg-info-province">${city.province}</div>
          <div class="rg-info-divider"></div>
          <div class="rg-info-slogan">${city.slogan}</div>
          <div class="rg-info-meta">
            <span class="rg-info-count">探索 ${city.explore_count} 次</span>
            ${sourceLabel}
          </div>
        </div>`;
    },
    []
  );

  /* ---------- 渲染 Marker ---------- */
  useEffect(() => {
    const AMap = getAMap();
    if (!map || !AMap) return;

    clearMarkers();

    // 创建 InfoWindow 单例
    if (!infoWindowRef.current) {
      infoWindowRef.current = new AMap.InfoWindow({
        isCustom: true,
        offset: new AMap.Pixel(0, -20),
        autoMove: true,
      });
    }

    const allCities = [...manualCities, ...aiCities];

    allCities.forEach((city) => {
      const isAI = city.light_source === "ai_recommend";
      const position = new AMap.LngLat(city.coord.lng, city.coord.lat);

      // Marker content HTML
      const markerHtml = `
        <div class="rg-marker ${isAI ? "ai" : ""}">
          <div class="rg-marker-dot"></div>
          <div class="rg-marker-label">${city.name}${isAI ? '<span class="rg-marker-ai-badge">AI</span>' : ""}</div>
        </div>`;

      const marker = new AMap.Marker({
        position,
        content: markerHtml,
        offset: new AMap.Pixel(-7, -7),
        zIndex: isAI ? 120 : 110,
      });

      marker.on("click", () => {
        onSelectCity(city);
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(buildInfoContent(city));
          infoWindowRef.current.open(map, position);
        }
      });

      marker.setMap(map);
      markersRef.current.push(marker);
    });

    // 点击地图空白关闭 InfoWindow
    map.on("click", () => {
      infoWindowRef.current?.close();
    });

    return () => {
      map.off("click");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, getAMap, manualCities, aiCities, buildInfoContent, onSelectCity, clearMarkers]);

  /* ---------- 选中城市 flyTo ---------- */
  useEffect(() => {
    if (selectedCity) {
      flyTo(selectedCity.coord.lng, selectedCity.coord.lat, 8);
    }
  }, [selectedCity, flyTo]);

  return (
    <>
      <style>{`
        /* ===== 地图外层 ===== */
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
          border: 3px solid #C8B898;
          box-shadow: 0 4px 24px rgba(139, 115, 85, 0.12), 0 1px 4px rgba(0,0,0,0.06);
        }
        .rg-map-container {
          width: 100%;
          height: 100%;
        }

        /* ===== 加载 / 错误 ===== */
        .rg-map-loading {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--rg-font-serif, "Noto Serif SC", serif);
          font-size: 16px;
          color: var(--rg-ink-light, #8B7355);
          letter-spacing: 0.15em;
          background: linear-gradient(135deg, #E8E0D0 0%, #F5F0E6 40%, #EDE5D5 100%);
        }
        .rg-map-loading::before {
          content: "";
          position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg, transparent 0px, transparent 20px, rgba(0,0,0,0.015) 20px, rgba(0,0,0,0.015) 21px);
          pointer-events: none;
        }
        .rg-map-error {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 8px;
          font-family: var(--rg-font-serif, "Noto Serif SC", serif);
          color: #A08060;
          background: linear-gradient(135deg, #E8E0D0 0%, #F5F0E6 40%, #EDE5D5 100%);
        }
        .rg-map-error-icon {
          font-size: 28px;
          line-height: 1;
        }

        /* ===== Marker 样式（通过 AMap Marker content 注入） ===== */
        .rg-marker {
          position: relative;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .rg-marker:hover {
          transform: scale(1.2) translateY(-2px);
        }

        /* 实心圆点 + 针杆 */
        .rg-marker-dot {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #C49452;
          box-shadow: 0 2px 6px rgba(196, 148, 82, 0.45);
          position: relative;
        }
        .rg-marker-dot::after {
          content: "";
          position: absolute;
          bottom: -6px; left: 50%;
          transform: translateX(-50%);
          width: 2px; height: 6px;
          background: #C49452;
          border-radius: 0 0 1px 1px;
        }

        /* 城市名标签 */
        .rg-marker-label {
          position: absolute;
          top: -24px; left: 50%;
          transform: translateX(-50%);
          font-family: var(--rg-font-serif, "Noto Serif SC", serif);
          font-size: 11px;
          color: var(--rg-ink, #3D3427);
          white-space: nowrap;
          background: rgba(255,255,255,0.88);
          padding: 1px 6px;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }
        .rg-marker:hover .rg-marker-label {
          opacity: 1;
        }

        /* ===== AI 推荐 Marker ===== */
        .rg-marker.ai .rg-marker-dot {
          background: #5D8A6A;
          box-shadow: 0 0 8px rgba(93, 138, 106, 0.5);
          animation: rg-pulse 2s ease-in-out infinite;
        }
        /* 虚线圆环 */
        .rg-marker.ai .rg-marker-dot::before {
          content: "";
          position: absolute;
          inset: -4px;
          border: 1.5px dashed #5D8A6A;
          border-radius: 50%;
          animation: rg-pulse-ring 2s ease-in-out infinite;
        }
        .rg-marker.ai .rg-marker-dot::after {
          background: #5D8A6A;
        }
        .rg-marker.ai .rg-marker-label {
          background: rgba(93, 138, 106, 0.12);
          border: 1px solid rgba(93, 138, 106, 0.25);
        }
        .rg-marker-ai-badge {
          font-size: 9px;
          background: #5D8A6A;
          color: #fff;
          padding: 0 3px;
          border-radius: 2px;
          margin-left: 4px;
          vertical-align: middle;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        /* 脉冲动画 */
        @keyframes rg-pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(93, 138, 106, 0.4); }
          50% { box-shadow: 0 0 16px rgba(93, 138, 106, 0.7); }
        }
        @keyframes rg-pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 0.2; }
        }

        /* ===== InfoWindow 古风样式 ===== */
        .rg-info-window {
          background: #F5F0E6;
          border: 2px solid #C49452;
          border-radius: 6px;
          padding: 12px 16px;
          min-width: 160px;
          max-width: 240px;
          font-family: var(--rg-font-serif, "Noto Serif SC", serif);
          box-shadow: 0 4px 16px rgba(139, 115, 85, 0.2);
        }
        .rg-info-window::after {
          content: "";
          position: absolute;
          bottom: -8px; left: 50%;
          transform: translateX(-50%);
          width: 0; height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #C49452;
        }
        .rg-info-title {
          font-size: 16px;
          font-weight: 700;
          color: #3D3427;
          letter-spacing: 0.05em;
        }
        .rg-info-province {
          font-size: 12px;
          color: #8B7355;
          margin-top: 2px;
        }
        .rg-info-divider {
          height: 1px;
          background: rgba(196, 148, 82, 0.3);
          margin: 8px 0;
        }
        .rg-info-slogan {
          font-size: 13px;
          color: #5A4A3A;
          line-height: 1.5;
        }
        .rg-info-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          flex-wrap: wrap;
        }
        .rg-info-count {
          font-size: 11px;
          color: #8B7355;
        }
        .rg-info-source {
          font-size: 10px;
          padding: 1px 6px;
          border-radius: 3px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .rg-info-source-ai {
          background: rgba(93, 138, 106, 0.15);
          color: #3D6B4A;
          border: 1px solid rgba(93, 138, 106, 0.3);
        }
        .rg-info-source-manual {
          background: rgba(196, 148, 82, 0.15);
          color: #8B6930;
          border: 1px solid rgba(196, 148, 82, 0.3);
        }

        /* ===== 四角装饰图钉 ===== */
        .rg-map-pin {
          position: absolute;
          width: 12px; height: 12px;
          z-index: 3;
          pointer-events: none;
        }
        .rg-map-pin::before {
          content: "";
          position: absolute;
          top: 0; left: 0;
          width: 12px; height: 12px;
          background: radial-gradient(circle at 4px 4px, #D4B483 0%, #B8956A 60%, #8B7355 100%);
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .rg-map-pin::after {
          content: "";
          position: absolute;
          top: 10px; left: 3px;
          width: 6px; height: 6px;
          background: rgba(0,0,0,0.2);
          border-radius: 50% 50% 0 0;
          transform: rotate(-45deg);
        }
        .rg-map-pin.tl { top: 8px; left: 8px; }
        .rg-map-pin.tr { top: 8px; right: 8px; }
        .rg-map-pin.bl { bottom: 8px; left: 8px; }
        .rg-map-pin.br { bottom: 8px; right: 8px; }

        /* ===== prefers-reduced-motion ===== */
        @media (prefers-reduced-motion: reduce) {
          .rg-marker.ai .rg-marker-dot {
            animation: none;
            box-shadow: 0 0 8px rgba(93, 138, 106, 0.5);
          }
          .rg-marker.ai .rg-marker-dot::before {
            animation: none;
            opacity: 0.5;
          }
          .rg-marker {
            transition: none;
          }
        }

        /* ===== 移动端 ===== */
        @media (max-width: 640px) {
          .rg-map-wrapper { height: 320px; }
          .rg-map-section { padding: 0 12px; }
        }
      `}</style>
      <section className="rg-map-section travel-section" id="rg-map">
        <div className="rg-map-wrapper">
          {loading && (
            <div className="rg-map-loading">山川城郭，正在展开...</div>
          )}
          {error && (
            <div className="rg-map-error">
              <span className="rg-map-error-icon">&#9888;</span>
              <span>地图加载遇到问题</span>
              <span style={{ fontSize: 12, color: "#B0A090" }}>{error}</span>
            </div>
          )}
          <div
            className="rg-map-container"
            ref={containerRef}
            style={{ display: loading || error ? "none" : "block" }}
          />
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
