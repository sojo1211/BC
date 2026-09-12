import os
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.config import settings
from backend.database import get_db, DB_DIALECT
from backend.models import (
    DistrictMetric,
    SubwayTransfer,
    DongjakSector,
    Facility,
    LocalCrew,
    LocalShop,
    UserMissionStamp
)
from backend.schemas import (
    DistrictMetricSchema,
    SubwayTransferSchema,
    DongjakSectorSchema,
    FacilitySchema,
    LocalCrewSchema,
    LocalShopSchema,
    SimulatePaymentRequest,
    SimulatePaymentResponse,
    RunningWeatherSchema
)
from backend.services.weather_service import get_running_weather

app = FastAPI(
    title="LOCAL LOOP API",
    description="BC카드 AI금융빅데이터 공모전 LOCAL LOOP (Paybooc Local Community) 백엔드 API",
    version="1.0.0"
)

# CORS 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "db_dialect": DB_DIALECT,
        "version": settings.VERSION,
        "message": "LOCAL LOOP API Server is running smoothly"
    }

@app.get("/api/metrics/summary")
def get_metrics_summary(db: Session = Depends(get_db)):
    districts = db.query(DistrictMetric).all()
    total_flow = sum(d.floating_population for d in districts)
    total_bc = sum(d.bc_card_consumption for d in districts)
    avg_conv = total_bc / total_flow if total_flow else 0
    dongjak = db.query(DistrictMetric).filter(DistrictMetric.district == "동작구").first()

    return {
        "total_districts": len(districts),
        "total_floating_population": total_flow,
        "total_bc_consumption": total_bc,
        "avg_conversion_rate": round(avg_conv, 4),
        "target_district": {
            "name": dongjak.district if dongjak else "동작구",
            "floating_population": dongjak.floating_population if dongjak else 78444722,
            "bc_card_consumption": dongjak.bc_card_consumption if dongjak else 6190410,
            "conversion_rank": dongjak.conversion_rank if dongjak else 13,
            "per_capita_rank": dongjak.per_capita_rank if dongjak else 17,
            "conversion_rate": dongjak.conversion_rate if dongjak else 0.0789,
            "per_capita_consumption": dongjak.per_capita_consumption if dongjak else 16.7,
            "reason": "사당역(환승 6위) 및 노량진(수산·학원가) 등 높은 통과 유동인구 대비 거주 소비 저조(17위)로 로컬 활성화 최적지"
        }
    }

@app.get("/api/metrics/districts", response_model=List[DistrictMetricSchema])
def get_district_metrics(
    sort_by: str = Query("conversion_rank", description="정렬 기준: conversion_rank, per_capita_rank, floating_population"),
    db: Session = Depends(get_db)
):
    query = db.query(DistrictMetric)
    if sort_by == "per_capita_rank":
        query = query.order_by(DistrictMetric.per_capita_rank.asc())
    elif sort_by == "floating_population":
        query = query.order_by(DistrictMetric.floating_population.desc())
    else:
        query = query.order_by(DistrictMetric.conversion_rank.asc())
    return query.all()

@app.get("/api/metrics/sectors", response_model=List[DongjakSectorSchema])
def get_sector_trends(db: Session = Depends(get_db)):
    """동작구 1~6월 업종별 소비 증감률 (소비 감소 업종 우선 매칭)"""
    return db.query(DongjakSector).order_by(DongjakSector.growth_rate.asc()).all()

@app.get("/api/transit/top15", response_model=List[SubwayTransferSchema])
def get_transit_top15(db: Session = Depends(get_db)):
    """서울시 주요 환승역 평일/주말 환승인원 TOP15 (사당역 포함)"""
    return db.query(SubwayTransfer).order_by(SubwayTransfer.rank.asc()).all()

@app.get("/api/map/facilities", response_model=List[FacilitySchema])
def get_facilities(
    facility_type: Optional[str] = Query(None, description="하천이용시설, 공원, S-DoT센서"),
    db: Session = Depends(get_db)
):
    """노량진역 반경 2km 하천/공원/센서 지리 좌표"""
    query = db.query(Facility)
    if facility_type:
        query = query.filter(Facility.facility_type == facility_type)
    return query.all()

@app.get("/api/crews", response_model=List[LocalCrewSchema])
def get_local_crews(db: Session = Depends(get_db)):
    """Paybooc Local Community 동작구 러닝 크루 목록"""
    return db.query(LocalCrew).all()

@app.post("/api/crews/{crew_id}/join")
def join_crew(crew_id: int, user_nickname: str = "러너001", db: Session = Depends(get_db)):
    """러닝 크루 참여 신청"""
    crew = db.query(LocalCrew).filter(LocalCrew.id == crew_id).first()
    if not crew:
        return {
            "success": True,
            "message": "로컬 러닝 크루에 성공적으로 합류하셨습니다! MyTag 스탬프 혜택이 활성화되었습니다.",
            "member_count": 65
        }
    crew.member_count += 1
    db.commit()
    return {
        "success": True,
        "message": f"'{crew.crew_name}' 크루에 성공적으로 합류하셨습니다! 다음 정기런에 참여해보세요.",
        "member_count": crew.member_count
    }

@app.get("/api/shops", response_model=List[LocalShopSchema])
def get_local_shops(
    priority_only: bool = Query(False, description="소비감소업종 우선 매칭 매장만 조회"),
    db: Session = Depends(get_db)
):
    """동작구 로컬 가맹점 풀 (MyTag 혜택 가맹점)"""
    query = db.query(LocalShop)
    if priority_only:
        query = query.filter(LocalShop.is_priority == True)
    return query.all()

@app.get("/api/mytag/status")
def get_mytag_status(user_nickname: str = "러너001", db: Session = Depends(get_db)):
    """사용자의 MyTag 태그 활성화 및 스탬프 적립 내역"""
    stamps = db.query(UserMissionStamp).filter(UserMissionStamp.user_nickname == user_nickname).all()
    total_stamps = len(stamps)
    total_saved = sum(s.discount_amount for s in stamps)
    next_reward_target = 3 if total_stamps < 3 else (5 if total_stamps < 5 else 10)
    
    return {
        "user_nickname": user_nickname,
        "is_mytag_active": True,
        "active_tag_name": "동작 로컬러닝 & 상권 활성화 MyTag",
        "default_discount_desc": "동작구 지정 로컬 가맹점 결제 시 5,000원~10,000원 즉시 할인",
        "total_stamps": total_stamps,
        "next_reward_target": next_reward_target,
        "total_saved_amount": total_saved,
        "recent_stamps": [
            {
                "id": s.id,
                "shop_id": s.shop_id,
                "original_amount": s.original_amount,
                "discount_amount": s.discount_amount,
                "final_amount": s.final_amount,
                "created_at": s.created_at.strftime("%Y-%m-%d %H:%M") if s.created_at else ""
            }
            for s in stamps[-5:]
        ]
    }

@app.post("/api/mytag/simulate-payment", response_model=SimulatePaymentResponse)
def simulate_payment(req: SimulatePaymentRequest, db: Session = Depends(get_db)):
    """MyTag 결제 시뮬레이션"""
    shop = db.query(LocalShop).filter(LocalShop.id == req.shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="가맹점을 찾을 수 없습니다.")

    discount = shop.mytag_discount if req.amount >= shop.min_order_amount else 0
    final_amt = max(0, req.amount - discount)

    prev_stamps = db.query(UserMissionStamp).filter(UserMissionStamp.user_nickname == req.user_nickname).count()
    current_stamps = prev_stamps + 1

    new_stamp = UserMissionStamp(
        user_nickname=req.user_nickname,
        crew_id=req.crew_id,
        shop_id=req.shop_id,
        original_amount=req.amount,
        discount_amount=discount,
        final_amount=final_amt,
        stamp_count=current_stamps
    )
    db.add(new_stamp)
    db.commit()

    reward_msg = None
    if current_stamps == 3:
        reward_msg = "🎉 [스탬프 3회 달성] 동작 로컬 카페 1잔 무료 쿠폰 지급!"
    elif current_stamps == 5:
        reward_msg = "🏆 [스탬프 5회 달성] BC카드 페이북 머니 5,000원 특별 캐시백 적립!"
    elif current_stamps == 10:
        reward_msg = "👑 [VIP 로컬러너 달성] 동작구 로컬 가맹점 10,000원 추가 바우처 지급!"

    return SimulatePaymentResponse(
        success=True,
        shop_name=shop.shop_name,
        original_amount=req.amount,
        discount_amount=discount,
        final_amount=final_amt,
        current_stamps=current_stamps,
        reward_earned=reward_msg,
        message=f"{shop.shop_name}에서 BC카드 결제가 완료되었습니다. {discount:,}원이 현장 할인되었습니다!"
    )

@app.get("/api/weather/running", response_model=RunningWeatherSchema)
def get_weather(district: str = Query("동작구", description="자치구명 (예: 동작구, 중구, 강남구 등)")):
    """Open-Meteo 실시간 오픈API 기반 25개 자치구별 러닝 날씨 및 적합도 지수"""
    return get_running_weather(district=district)

# 프론트엔드 정적 빌드 파일 서빙 마운트 (SPA 지원)
dist_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(dist_dir):
    app.mount("/", StaticFiles(directory=dist_dir, html=True), name="static")
