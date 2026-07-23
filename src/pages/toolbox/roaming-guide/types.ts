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

export interface DailyBudget {
  accommodation: number;
  food: number;
  tickets: number;
  transport: number;
}

export interface BudgetBreakdown {
  total_min: number;
  total_max: number;
  details: {
    accommodation: string;
    food: string;
    transport: string;
    tickets: string;
  };
}

export interface AIPlan {
  generated_at: string;
  prompt: string;
  summary: string;
  days: number;
  highlights: string[];
  budget_hint: string;
  budget_breakdown?: BudgetBreakdown;
}

export type LightSource = "manual" | "ai_recommend";

/** 城市状态：想去 / 已去 */
export type CityStatus = "want_to_go" | "visited";

export interface City {
  id: number;
  name: string;
  province: string;
  coord: Coord;
  slogan: string;
  images: string[];
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
  status: CityStatus;
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
    play: string[];
    food: string[];
    accommodation: string;
    transport: string;
    estimated_cost: string;
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
    transport_tip?: string;
    daily_budget?: DailyBudget;
  }[];
}

export const STORAGE_KEYS = {
  CITIES: "roaming_guide_cities",
  MANUAL_VISITED: "roaming_guide_manual_visited",
  AI_RECOMMENDATIONS: "roaming_guide_ai_recos",
  MAP_CENTER: "roaming_guide_map_center",
  MAP_ZOOM: "roaming_guide_map_zoom",
} as const;
