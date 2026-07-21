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
      const isWantToGo = city.status === "want_to_go";
      const markerHtml = `
        <div class="rg-marker ${isAI ? "ai" : ""} ${city.explore_count > 0 ? "visited" : ""} ${isWantToGo ? "want-to-go" : ""}">
          <div class="rg-marker-dot"></div>
          <div class="rg-marker-label">${city.name}${isWantToGo ? '<span class="rg-marker-want-badge">想去</span>' : ""}${isAI ? '<span class="rg-marker-ai-badge">AI</span>' : ""}</div>
          ${city.explore_count > 0 && !isWantToGo ? `<div class="rg-marker-glow"></div>` : ""}
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
          max-width: 100%;
          margin: 0 auto;
          padding: 0;
        }
        .rg-map-wrapper {
          position: relative;
          width: 100%;
          height: min(520px, 60vh);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(90, 74, 58, 0.08);
          box-shadow: 0 4px 12px rgba(90, 74, 58, 0.08);
          background: #E8ECEF;
        }
        .rg-map-container {
          width: 100%;
          height: 100%;
        }

        /* ===== 加载 / 错误 ===== */
        .rg-map-loading {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Source Han Serif SC', 'Noto Serif SC', serif;
          font-size: 16px;
          color: #2C3E50;
          letter-spacing: 0.15em;
          background: #E8ECEF;
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
          font-family: 'Source Han Serif SC', 'Noto Serif SC', serif;
          color: #2C3E50;
          background: #E8ECEF;
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
          background: #7BA89E;
          box-shadow: 0 2px 6px rgba(123, 168, 158, 0.45);
          position: relative;
        }
        .rg-marker-dot::after {
          content: "";
          position: absolute;
          bottom: -6px; left: 50%;
          transform: translateX(-50%);
          width: 2px; height: 6px;
          background: #7BA89E;
          border-radius: 0 0 1px 1px;
        }

        /* 已访问城市标记 - 点亮效果 */
        .rg-marker.visited .rg-marker-dot {
          background: #F4D35E;
          box-shadow: 0 0 10px rgba(244,211,94,0.5), 0 2px 6px rgba(244,211,94,0.3);
          width: 16px;
          height: 16px;
        }
        .rg-marker-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 32px;
          height: 32px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(244,211,94,0.2) 0%, transparent 70%);
          animation: rg-marker-pulse 2s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes rg-marker-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.5; }
        }

        /* 城市名标签 */
        .rg-marker-label {
          position: absolute;
          top: -24px; left: 50%;
          transform: translateX(-50%);
          font-family: 'Source Han Serif SC', 'Noto Serif SC', serif;
          font-size: 11px;
          color: #5A4A3A;
          white-space: nowrap;
          background: rgba(245,243,238,0.9);
          padding: 1px 6px;
          border-radius: 4px;
          border: 1px solid rgba(90,74,58,0.1);
          box-shadow: 0 4px 12px rgba(90, 74, 58, 0.08);
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }
        .rg-marker:hover .rg-marker-label {
          opacity: 1;
        }

        /* ===== AI 推荐 Marker ===== */
        .rg-marker.ai .rg-marker-dot {
          background: #7BA89E;
          box-shadow: 0 0 8px rgba(123, 168, 158, 0.5);
          animation: rg-pulse 2s ease-in-out infinite;
        }
        /* 虚线圆环 */
        .rg-marker.ai .rg-marker-dot::before {
          content: "";
          position: absolute;
          inset: -4px;
          border: 1.5px dashed #7BA89E;
          border-radius: 50%;
          animation: rg-pulse-ring 2s ease-in-out infinite;
        }
        .rg-marker.ai .rg-marker-dot::after {
          background: #7BA89E;
        }
        .rg-marker.ai .rg-marker-label {
          background: rgba(123, 168, 158, 0.12);
          border: 1px solid rgba(123, 168, 158, 0.25);
        }
        .rg-marker-ai-badge {
          font-size: 9px;
          background: #7BA89E;
          color: #fff;
          padding: 0 3px;
          border-radius: 2px;
          margin-left: 4px;
          vertical-align: middle;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .rg-marker-want-badge {
          font-size: 9px;
          background: #F4D35E;
          color: #5A4A3A;
          padding: 0 4px;
          border-radius: 2px;
          margin-left: 2px;
          vertical-align: middle;
          font-weight: 600;
        }

        /* ===== 想去 Marker（青苔绿） ===== */
        .rg-marker.want-to-go .rg-marker-dot {
          background: #7BA89E;
          box-shadow: 0 0 8px rgba(123, 168, 158, 0.6);
          animation: rg-want-pulse 2s ease-in-out infinite;
        }
        .rg-marker.want-to-go .rg-marker-dot::before {
          content: "";
          position: absolute;
          inset: -5px;
          border: 1.5px dashed #7BA89E;
          border-radius: 50%;
          animation: rg-want-pulse-ring 2s ease-in-out infinite;
        }
        .rg-marker.want-to-go .rg-marker-dot::after {
          background: #7BA89E;
        }
        .rg-marker.want-to-go .rg-marker-label {
          background: rgba(123, 168, 158, 0.1);
          border: 1px solid rgba(123, 168, 158, 0.3);
          color: #5A4A3A;
        }

        @keyframes rg-want-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes rg-want-pulse-ring {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }

        /* 脉冲动画 */
        @keyframes rg-pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(123, 168, 158, 0.4); }
          50% { box-shadow: 0 0 16px rgba(123, 168, 158, 0.7); }
        }
        @keyframes rg-pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 0.2; }
        }

        /* ===== InfoWindow 温柔漫游风格 ===== */
        .rg-info-window {
          background: #F5F3EE;
          border: 1px solid rgba(90,74,58,0.1);
          border-radius: 12px;
          padding: 12px 16px;
          min-width: 160px;
          max-width: 240px;
          font-family: 'Source Han Serif SC', 'Noto Serif SC', serif;
          box-shadow: 0 4px 12px rgba(90, 74, 58, 0.08);
        }
        .rg-info-window::after {
          content: "";
          position: absolute;
          bottom: -8px; left: 50%;
          transform: translateX(-50%);
          width: 0; height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid rgba(90,74,58,0.1);
        }
        .rg-info-title {
          font-size: 16px;
          font-weight: 700;
          color: #2C3E50;
          letter-spacing: 0.05em;
        }
        .rg-info-province {
          font-size: 12px;
          color: #7A7A7A;
          margin-top: 2px;
        }
        .rg-info-divider {
          height: 1px;
          background: rgba(90,74,58,0.08);
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
          color: #7A7A7A;
        }
        .rg-info-source {
          font-size: 10px;
          padding: 1px 6px;
          border-radius: 3px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .rg-info-source-ai {
          background: rgba(123, 168, 158, 0.15);
          color: #5A8A7E;
          border: 1px solid rgba(123, 168, 158, 0.3);
        }
        .rg-info-source-manual {
          background: rgba(244, 211, 94, 0.15);
          color: #5A4A3A;
          border: 1px solid rgba(244, 211, 94, 0.3);
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
          background: radial-gradient(circle at 4px 4px, #7BA89E 0%, #5A8A7E 60%, #3A6A5E 100%);
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        .rg-map-pin::after {
          content: "";
          position: absolute;
          top: 10px; left: 3px;
          width: 6px; height: 6px;
          background: rgba(0,0,0,0.08);
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
            box-shadow: 0 0 8px rgba(123, 168, 158, 0.5);
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
              <span style={{ fontSize: 12, color: "#7A7A7A" }}>{error}</span>
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
