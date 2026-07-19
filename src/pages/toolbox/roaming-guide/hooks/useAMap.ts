import { useState, useEffect, useRef, useCallback } from "react";

interface UseAMapOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  center?: [number, number];
  zoom?: number;
}

interface UseAMapReturn {
  map: unknown | null;
  loading: boolean;
  error: string | null;
  flyTo: (lng: number, lat: number, zoom?: number) => void;
  setCenter: (lng: number, lat: number) => void;
}

// 暂时 Mock —— 阶段二接入高德 API 后替换
export function useAMap(_options: UseAMapOptions): UseAMapReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<unknown | null>(null);

  useEffect(() => {
    setLoading(false);
    setError(null);
    mapRef.current = null;
  }, []);

  const flyTo = useCallback((lng: number, lat: number, zoom?: number) => {
    // Mock: no-op
    console.log("[useAMap Mock] flyTo:", lng, lat, zoom);
  }, []);

  const setCenter = useCallback((lng: number, lat: number) => {
    console.log("[useAMap Mock] setCenter:", lng, lat);
  }, []);

  return { map: mapRef.current, loading, error, flyTo, setCenter };
}
