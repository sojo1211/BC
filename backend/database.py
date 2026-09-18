import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.config import settings

Base = declarative_base()

def init_engine():
    # 1. 먼저 로컬 MySQL 연결 시도
    try:
        import pymysql
        # 데이터베이스 존재 여부 확인 및 자동 생성
        conn = pymysql.connect(
            host=settings.MYSQL_HOST,
            port=settings.MYSQL_PORT,
            user=settings.MYSQL_USER,
            password=settings.MYSQL_PASSWORD,
            charset="utf8mb4",
            connect_timeout=2
        )
        with conn.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {settings.MYSQL_DB} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        conn.commit()
        conn.close()

        # SQLAlchemy MySQL 엔진 생성
        engine = create_engine(settings.mysql_url, pool_recycle=3600, pool_pre_ping=True)
        with engine.connect() as test_conn:
            print("[DB SUCCESS] 로컬 MySQL 8.0 데이터베이스에 성공적으로 연결되었습니다.")
            return engine, "mysql"
    except Exception as e:
        print(f"[DB INFO] MySQL 연결 시도 실패 ({e}). 내장 SQLite3 엔진으로 안전하게 자동 전환합니다.")
        engine = create_engine(
            settings.sqlite_url,
            connect_args={"check_same_thread": False}
        )
        return engine, "sqlite"

engine, DB_DIALECT = init_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
