import { useState, useEffect, useCallback, useMemo } from "react";
import { City, Coord, STORAGE_KEYS } from "../types";
import { DEFAULT_CITIES, cityToProvince } from "../constants";

interface UseCityDataReturn {
  cities: City[];
  addCity: (city: Omit<City, "id" | "created_at" | "updated_at">) => void;
  updateCity: (city: City) => void;
  deleteCity: (id: number) => void;
  toggleCityStatus: (id: number) => void;
  getCityByCoord: (lng: number, lat: number) => City | undefined;
  stats: { provinces: number; cities: number; days: number };
  editingCity: City | null;
  setEditingCity: (city: City | null) => void;
  selectedCity: City | null;
  setSelectedCity: (city: City | null) => void;
  detailOpen: boolean;
  setDetailOpen: (open: boolean) => void;
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
}

export function useCityData(): UseCityDataReturn {
  const [cities, setCities] = useState<City[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CITIES);
      if (raw) {
        const parsed = JSON.parse(raw);
        // 兼容旧数据：没有 status 字段的默认为 visited（已去）
        return parsed.map((c: City) => ({
          ...c,
          status: c.status || "visited",
        }));
      }
    } catch { /* ignore */ }
    return DEFAULT_CITIES.map(c => ({
      ...c,
      status: "visited" as const,
      created_at: c.created_at || new Date().toISOString(),
      updated_at: c.updated_at || new Date().toISOString(),
    }));
  });

  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // 持久化
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.CITIES, JSON.stringify(cities)); } catch { /* ignore */ }
  }, [cities]);

  const addCity = useCallback((partial: Omit<City, "id" | "created_at" | "updated_at">) => {
    setCities(prev => {
      const maxId = prev.reduce((m, c) => Math.max(m, c.id), 0);
      const now = new Date().toISOString();
      const newCity: City = {
        ...partial,
        id: maxId + 1,
        created_at: now,
        updated_at: now,
      };
      return [...prev, newCity];
    });
  }, []);

  const updateCity = useCallback((city: City) => {
    setCities(prev => prev.map(c => c.id === city.id ? { ...city, updated_at: new Date().toISOString() } : c));
  }, []);

  const deleteCity = useCallback((id: number) => {
    setCities(prev => prev.filter(c => c.id !== id));
  }, []);

  const toggleCityStatus = useCallback((id: number) => {
    setCities(prev => prev.map(c => {
      if (c.id !== id) return c;
      const newStatus: "want_to_go" | "visited" = c.status === "want_to_go" ? "visited" : "want_to_go";
      return { ...c, status: newStatus, updated_at: new Date().toISOString() };
    }));
  }, []);

  const getCityByCoord = useCallback((lng: number, lat: number) => {
    // 在 0.5 度范围内查找最近城市
    return cities.find(c =>
      Math.abs(c.coord.lng - lng) < 0.5 && Math.abs(c.coord.lat - lat) < 0.5
    );
  }, [cities]);

  const stats = useMemo(() => {
    const provinceSet = new Set(cities.map(c => c.province));
    return {
      provinces: provinceSet.size,
      cities: cities.length,
      days: cities.reduce((s, c) => s + c.days, 0),
    };
  }, [cities]);

  return {
    cities, addCity, updateCity, deleteCity, toggleCityStatus, getCityByCoord, stats,
    editingCity, setEditingCity,
    selectedCity, setSelectedCity,
    detailOpen, setDetailOpen,
    editOpen, setEditOpen,
  };
}
