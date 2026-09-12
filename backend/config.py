import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "LOCAL LOOP API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # MySQL 환경변수 기본값 (사용자 비밀번호가 있으면 변경 가능)
    MYSQL_USER: str = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "127.0.0.1")
    MYSQL_PORT: int = int(os.getenv("MYSQL_PORT", 3306))
    MYSQL_DB: str = os.getenv("MYSQL_DB", "local_loop")
    
    # 데이터베이스 URL (MySQL 기본, 없을 시 sqlite fallback)
    @property
    def mysql_url(self) -> str:
        pwd = f":{self.MYSQL_PASSWORD}" if self.MYSQL_PASSWORD else ""
        return f"mysql+pymysql://{self.MYSQL_USER}{pwd}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}?charset=utf8mb4"

    @property
    def sqlite_url(self) -> str:
        return "sqlite:///./local_loop.db"

settings = Settings()
