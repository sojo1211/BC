from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DistrictMetricSchema(BaseModel):
    id: int
    district: str
    floating_population: float
    bc_card_consumption: float
    resident_population: float
    conversion_rate: float
    per_capita_consumption: float
    conversion_rank: Optional[int] = None
    per_capita_rank: Optional[int] = None
    is_target_candidate: bool
    note: Optional[str] = None

    class Config:
        from_attributes = True

class SubwayTransferSchema(BaseModel):
    id: int
    rank: int
    station_name: str
    weekday_transfers: float
    saturday_transfers: float
    sunday_transfers: float
    lines: Optional[str] = None
    is_dongjak_hub: bool

    class Config:
        from_attributes = True

class DongjakSectorSchema(BaseModel):
    id: int
    sector_name: str
    jan_consumption: int
    jun_consumption: int
    growth_rate: float
    is_priority_match: bool
    category: Optional[str] = None

    class Config:
        from_attributes = True

class FacilitySchema(BaseModel):
    id: int
    facility_type: str
    name: str
    lat: float
    lon: float
    distance_km: Optional[float] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True

class LocalCrewSchema(BaseModel):
    id: int
    crew_name: str
    activity_area: str
    meeting_schedule: str
    member_count: int
    level: str
    course_name: str
    distance_km: float
    description: Optional[str] = None
    tags: Optional[str] = None

    class Config:
        from_attributes = True

class LocalShopSchema(BaseModel):
    id: int
    shop_name: str
    market_zone: str
    sector_name: str
    signature_menu: Optional[str] = None
    lat: float
    lon: float
    mytag_discount: int
    min_order_amount: int
    is_priority: bool
    stamp_reward_info: Optional[str] = None

    class Config:
        from_attributes = True

class SimulatePaymentRequest(BaseModel):
    shop_id: int
    amount: int
    crew_id: Optional[int] = None
    user_nickname: str = "러너001"

class SimulatePaymentResponse(BaseModel):
    success: bool
    shop_name: str
    original_amount: int
    discount_amount: int
    final_amount: int
    current_stamps: int
    reward_earned: Optional[str] = None
    message: str

class RunningWeatherSchema(BaseModel):
    temperature: float
    apparent_temperature: float
    relative_humidity: int
    wind_speed: float
    weather_code: int
    weather_description: str
    running_score: int
    recommendation: str
    location_name: str = "서울특별시 동작구 노량진동 (한강변)"
    temp_score: Optional[int] = 38
    humidity_score: Optional[int] = 28
    wind_score: Optional[int] = 18
    weather_bonus: Optional[int] = 10
    criteria_formula: Optional[str] = "점수(100) = 기온(40) + 습도(30) + 풍속(20) + 날씨상태(10)"
