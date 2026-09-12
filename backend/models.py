from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from backend.database import Base

class DistrictMetric(Base):
    __tablename__ = "district_metrics"

    id = Column(Integer, primary_key=True, index=True)
    district = Column(String(50), unique=True, index=True, nullable=False, comment="자치구명")
    floating_population = Column(Float, nullable=False, comment="유동인구 (2026 2분기)")
    bc_card_consumption = Column(Float, nullable=False, comment="BC카드 소비건수")
    resident_population = Column(Float, nullable=False, comment="주민등록 거주인구")
    conversion_rate = Column(Float, nullable=False, comment="유동인구 대비 전환율 (소비건수/유동인구)")
    per_capita_consumption = Column(Float, nullable=False, comment="거주인구 1인당 소비건수 (소비건수/인구)")
    conversion_rank = Column(Integer, nullable=True, comment="전환율 순위")
    per_capita_rank = Column(Integer, nullable=True, comment="1인당 소비 순위")
    is_target_candidate = Column(Boolean, default=False, comment="공모전 타깃 후보지 여부")
    note = Column(String(255), nullable=True, comment="상권 특성 메모")

class SubwayTransfer(Base):
    __tablename__ = "subway_transfers"

    id = Column(Integer, primary_key=True, index=True)
    rank = Column(Integer, nullable=False, comment="순위")
    station_name = Column(String(50), nullable=False, comment="환승역명")
    weekday_transfers = Column(Float, nullable=False, comment="평일 환승인원")
    saturday_transfers = Column(Float, nullable=False, comment="토요일 환승인원")
    sunday_transfers = Column(Float, nullable=False, comment="일요일 환승인원")
    lines = Column(String(50), nullable=True, comment="환승 호선")
    is_dongjak_hub = Column(Boolean, default=False, comment="동작구 사당역 거점 여부")

class DongjakSector(Base):
    __tablename__ = "dongjak_sectors"

    id = Column(Integer, primary_key=True, index=True)
    sector_name = Column(String(50), nullable=False, comment="업종명")
    jan_consumption = Column(Integer, nullable=False, comment="1월 소비건수")
    jun_consumption = Column(Integer, nullable=False, comment="6월 소비건수")
    growth_rate = Column(Float, nullable=False, comment="소비건수 증감률(%)")
    is_priority_match = Column(Boolean, default=False, comment="우선 매칭 지원 대상 여부 (감소 업종)")
    category = Column(String(50), nullable=True, comment="업종 분류")

class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    facility_type = Column(String(50), nullable=False, comment="시설구분 (하천이용시설/공원/S-DoT센서)")
    name = Column(String(100), nullable=False, comment="시설명")
    lat = Column(Float, nullable=False, comment="위도")
    lon = Column(Float, nullable=False, comment="경도")
    distance_km = Column(Float, nullable=True, comment="노량진역 기준 거리(km)")
    description = Column(String(255), nullable=True, comment="시설 상세")

class LocalCrew(Base):
    __tablename__ = "local_crews"

    id = Column(Integer, primary_key=True, index=True)
    crew_name = Column(String(100), nullable=False, comment="러닝 크루명")
    activity_area = Column(String(100), nullable=False, comment="주 활동 구역")
    meeting_schedule = Column(String(100), nullable=False, comment="정기 모임 일정")
    member_count = Column(Integer, default=1, comment="회원 수")
    level = Column(String(50), default="누구나", comment="난이도 (입문/중급/전체)")
    course_name = Column(String(100), nullable=False, comment="대표 러닝 코스")
    distance_km = Column(Float, default=5.0, comment="코스 거리(km)")
    description = Column(Text, nullable=True, comment="크루 소개")
    tags = Column(String(200), nullable=True, comment="해시태그")

class LocalShop(Base):
    __tablename__ = "local_shops"

    id = Column(Integer, primary_key=True, index=True)
    shop_name = Column(String(100), nullable=False, comment="가맹점명")
    market_zone = Column(String(100), nullable=False, comment="소속 상권")
    sector_name = Column(String(50), nullable=False, comment="업종")
    signature_menu = Column(String(100), nullable=True, comment="대표 메뉴/상품")
    lat = Column(Float, nullable=False, comment="위도")
    lon = Column(Float, nullable=False, comment="경도")
    mytag_discount = Column(Integer, default=7000, comment="MyTag 기본 할인액(원)")
    min_order_amount = Column(Integer, default=20000, comment="할인 적용 최소 결제액(원)")
    is_priority = Column(Boolean, default=False, comment="소비감소업종 우선노출 가맹점 여부")
    stamp_reward_info = Column(String(255), default="3회 방문 시 음료 1잔 무료 쿠폰", comment="스탬프 보너스")

class UserMissionStamp(Base):
    __tablename__ = "user_mission_stamps"

    id = Column(Integer, primary_key=True, index=True)
    user_nickname = Column(String(50), default="러너001", comment="사용자 닉네임")
    crew_id = Column(Integer, ForeignKey("local_crews.id"), nullable=True)
    shop_id = Column(Integer, ForeignKey("local_shops.id"), nullable=False)
    original_amount = Column(Integer, nullable=False, comment="결제 원금액")
    discount_amount = Column(Integer, nullable=False, comment="MyTag 할인 적용액")
    final_amount = Column(Integer, nullable=False, comment="실제 결제 금액")
    stamp_count = Column(Integer, default=1, comment="적립된 누적 스탬프")
    created_at = Column(DateTime, default=func.now(), comment="결제 및 적립 일시")
