export interface DistrictMetric {
  id: number;
  district: string;
  floating_population: number;
  bc_card_consumption: number;
  resident_population: number;
  conversion_rate: number;
  per_capita_consumption: number;
  conversion_rank: number;
  per_capita_rank: number;
  is_target_candidate: boolean;
  note?: string;
}

export interface SubwayTransfer {
  id: number;
  rank: number;
  station_name: string;
  weekday_transfers: number;
  saturday_transfers: number;
  sunday_transfers: number;
  lines?: string;
  is_dongjak_hub: boolean;
}

export interface DongjakSector {
  id: number;
  sector_name: string;
  jan_consumption: number;
  jun_consumption: number;
  growth_rate: number;
  is_priority_match: boolean;
  category?: string;
}

export interface Facility {
  id: number;
  facility_type: string;
  name: string;
  lat: number;
  lon: number;
  distance_km?: number;
  description?: string;
}

export interface LocalCrew {
  id: number;
  crew_name: string;
  activity_area: string;
  meeting_schedule: string;
  member_count: number;
  level: string;
  course_name: string;
  distance_km: number;
  description?: string;
  tags?: string;
}

export interface LocalShop {
  id: number;
  shop_name: string;
  market_zone: string;
  sector_name: string;
  signature_menu?: string;
  lat: number;
  lon: number;
  mytag_discount: number;
  min_order_amount: number;
  is_priority: boolean;
  stamp_reward_info?: string;
}

export interface MetricsSummary {
  total_districts: number;
  total_floating_population: number;
  total_bc_consumption: number;
  avg_conversion_rate: number;
  target_district: {
    name: string;
    floating_population: number;
    bc_card_consumption: number;
    conversion_rank: number;
    per_capita_rank: number;
    conversion_rate: number;
    per_capita_consumption: number;
    reason: string;
  };
}

export interface MyTagStatus {
  user_nickname: string;
  is_mytag_active: boolean;
  active_tag_name: string;
  default_discount_desc: string;
  total_stamps: number;
  next_reward_target: number;
  total_saved_amount: number;
  recent_stamps: Array<{
    id: number;
    shop_id: number;
    original_amount: number;
    discount_amount: number;
    final_amount: number;
    created_at: string;
  }>;
}

export interface SimulatePaymentResponse {
  success: boolean;
  shop_name: string;
  original_amount: number;
  discount_amount: number;
  final_amount: number;
  current_stamps: number;
  reward_earned?: string;
  message: string;
}

export interface RunningWeather {
  temperature: number;
  apparent_temperature: number;
  relative_humidity: number;
  wind_speed: number;
  weather_code: number;
  weather_description: string;
  running_score: number;
  recommendation: string;
  location_name: string;
  temp_score?: number;
  humidity_score?: number;
  wind_score?: number;
  weather_bonus?: number;
  criteria_formula?: string;
}
