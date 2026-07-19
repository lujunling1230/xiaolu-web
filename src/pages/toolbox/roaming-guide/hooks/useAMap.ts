import { useState, useEffect, useRef, useCallback } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";

const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || "";
const AMAP_SECRET = import.meta.env.VITE_AMAP_SECRET || "";

interface UseAMapOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  center?: [number, number];
  zoom?: number;
}

interface UseAMapReturn {
  map: AMap.Map | null;
  loading: boolean;
  error: string | null;
  flyTo: (lng: number, lat: number, zoom?: number) => void;
  setCenter: (lng: number, lat: number) => void;
  getAMap: () => typeof AMap | null;
}

// 安全密钥配置（JS API 2.0 必须）
(window as unknown as Record<string, unknown>)._AMapSecurityConfig = {
  securityJsCode: AMAP_SECRET,
};

export function useAMap(options: UseAMapOptions): UseAMapReturn {
  const { containerRef, center = [104.07, 35.44], zoom = 5 } = options;
  const [map, setMap] = useState<AMap.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<AMap.Map | null>(null);
  const AMapRef = useRef<typeof AMap | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;

    AMapLoader.load({
      key: AMAP_KEY,
      version: "2.0",
      plugins: ["AMap.Scale", "AMap.ToolBar"],
    }).then((AMapModule) => {
      if (destroyed) return;
      AMapRef.current = AMapModule;

      const mapInstance = new AMapModule.Map(containerRef.current, {
        center: new AMapModule.LngLat(center[0], center[1]),
        zoom,
        mapStyle: "amap://styles/whitesmoke",
        viewMode: "2D",
        resizeEnable: true,
      });

      mapRef.current = mapInstance;
      setMap(mapInstance);
      setLoading(false);

      // 低饱和度滤镜叠加 —— 进一步降低现代地图的鲜艳感
      const container = containerRef.current;
      if (container) {
        const overlay = document.createElement("div");
        overlay.style.cssText = `
          position: absolute; inset: 0; z-index: 1;
          pointer-events: none;
          background: rgba(245, 240, 230, 0.08);
          mix-blend-mode: multiply;
        `;
        container.style.position = "relative";
        container.appendChild(overlay);
      }
    }).catch((e: unknown) => {
      if (destroyed) return;
      const msg = e instanceof Error ? e.message : "地图加载失败";
      setError(msg);
      setLoading(false);
    });

    return () => {
      destroyed = true;
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
        setMap(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flyTo = useCallback((lng: number, lat: number, targetZoom?: number) => {
    if (mapRef.current && AMapRef.current) {
      mapRef.current.setZoomAndCenter(targetZoom || 8, [lng, lat], false, 600);
    }
  }, []);

  const setCenter = useCallback((lng: number, lat: number) => {
    if (mapRef.current) {
      mapRef.current.setCenter([lng, lat]);
    }
  }, []);

  const getAMap = useCallback(() => AMapRef.current, []);

  return { map, loading, error, flyTo, setCenter, getAMap };
}