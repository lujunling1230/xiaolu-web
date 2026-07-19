/** 地理坐标 */
export interface Coord {
  lng: number;
  lat: number;
}

export interface Spot {
  name: string;
  rating: number;
}

export interface Eat {
  name: string;
  price: string;
  signature?: string;
}

export interface WeatherTag {
  season: string;
  temp_range: string;
  description: string;
}

export interface AIPlan {
  generated_at: string;
  prompt: string;
  summary: string;
  days: number;
  highlights: string[];
  budget_hint: string;
}

export type LightSource = "manual" | "ai_recommend";

export interface City {
  id: number;
  name: string;
  province: string;
  coord: Coord;
  slogan: string;
  imageUrl: string;
  days: number;
  play: Spot[];
  eat: Eat[];
  stay: string;
  tips: string;
  light_source: LightSource;
  explore_count: number;
  manual_guide: string;
  ai_plan: AIPlan | null;
  weather_tags: WeatherTag[];
  created_at: string;
  updated_at: string;
}

export interface ProvinceArea {
  name: string;
  path: string;
  visited: boolean;
  count: number;
}

export interface AIReverseRecommendRequest {
  preferences: {
    season?: string;
    budget?: string;
    pace?: string;
    interests: string[];
    region?: string;
  };
}

export interface AIReverseRecommendResponse {
  cities: {
    name: string;
    province: string;
    coord: Coord;
    reason: string;
    highlights: string[];
    best_season: string;
  }[];
  summary: string;
}

export interface AIForwardGenerateRequest {
  city_name: string;
  days?: number;
  interests?: string[];
}

export interface AIForwardGenerateResponse {
  plan: AIPlan;
  detailed_guide: {
    day: number;
    theme: string;
    activities: string[];
    food_recommendations: string[];
  }[];
}

export const STORAGE_KEYS = {
  CITIES: "roaming_guide_cities",
  MANUAL_VISITED: "roaming_guide_manual_visited",
  AI_RECOMMENDATIONS: "roaming_guide_ai_recos",
  MAP_CENTER: "roaming_guide_map_center",
  MAP_ZOOM: "roaming_guide_map_zoom",
} as const;
