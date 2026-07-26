import { useState, useEffect, useRef, useCallback } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";

/* 高德地图前端 Key（域名限制，公开安全） */
const AMAP_KEY = "3a18d55697edc2bf5db895a6422b43ec";
const AMAP_SECRET = "108294ca57363662e04d25c27d5a4685";

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
if (typeof window !== "undefined" && AMAP_SECRET) {
  (window as unknown as Record<string, unknown>)._AMapSecurityConfig = {
    securityJsCode: AMAP_SECRET,
  };
}

export function useAMap(options: UseAMapOptions): UseAMapReturn {
  const { containerRef, center = [104.07, 35.44], zoom = 5 } = options;
  const [map, setMap] = useState<AMap.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<AMap.Map | null>(null);
  const AMapRef = useRef<typeof AMap | null>(null);
  const initedRef = useRef(false);

  useEffect(() => {
    if (initedRef.current) return;

    const container = containerRef.current;
    if (!container) {
      setError("地图容器未找到");
      setLoading(false);
      return;
    }

    initedRef.current = true;
    let destroyed = false;
    let retryCount = 0;
    const MAX_RETRIES = 10;

    // 尝试初始化地图，容器尺寸为 0 时自动重试（解决移动端布局延迟问题）
    const tryInit = () => {
      if (destroyed) return;

      const container = containerRef.current;
      if (!container) {
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          requestAnimationFrame(tryInit);
          return;
        }
        setError("地图容器未找到");
        setLoading(false);
        return;
      }

      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        // 容器尚未布局完成，延迟重试
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          setTimeout(tryInit, 100);
          return;
        }
        setError("地图容器尺寸为 0，请刷新页面重试");
        setLoading(false);
        return;
      }

      AMapLoader.load({
        key: AMAP_KEY,
        version: "2.0",
      }).then((AMapModule) => {
        if (destroyed) return;
        AMapRef.current = AMapModule;

        try {
          const mapInstance = new AMapModule.Map(container, {
            center: [center[0], center[1]],
            zoom,
            viewMode: "2D",
            resizeEnable: true,
          });

          mapRef.current = mapInstance;
          setMap(mapInstance);
          setLoading(false);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "地图初始化失败";
          console.error("[AMap] 初始化失败:", msg);
          setError(msg);
          setLoading(false);
        }
      }).catch((e: unknown) => {
        if (destroyed) return;
        const msg = e instanceof Error ? e.message : "地图脚本加载失败";
        console.error("[AMap] 加载失败:", msg);
        setError(msg);
        setLoading(false);
      });
    };

    // 延迟一帧确保容器已渲染
    requestAnimationFrame(tryInit);

    return () => {
      destroyed = true;
      initedRef.current = false;
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
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