import os
import sys
import webbrowser
import subprocess
import time

def main():
    print("=" * 65)
    print("🚀 [LOCAL LOOP] 풀스택 서비스 통합 런처")
    print("   BC카드 AI금융빅데이터 공모전: Paybooc Local Community")
    print("=" * 65)

    # 1. DB 시딩 실행 확인
    print("\n[1/3] 데이터베이스 검사 및 실데이터 시딩...")
    from backend.services.data_seeder import seed_all_data
    seed_all_data()

    # 2. 브라우저 자동 오픈 준비
    url = "http://127.0.0.1:8000"
    print(f"\n[2/3] 웹 서비스 주소: {url}")
    print("   - API 문서(Swagger UI): http://127.0.0.1:8000/docs")

    # 3. Uvicorn 서버 실행
    print("\n[3/3] FastAPI & React 대시보드 서버를 시작합니다...")
    print("   서버를 종료하려면 콘솔에서 Ctrl + C를 누르세요.\n")

    # 1.5초 후 브라우저 오픈
    def open_browser():
        time.sleep(1.5)
        webbrowser.open(url)

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=False)

if __name__ == "__main__":
    main()
