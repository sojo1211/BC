/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        toss: {
          bg: "#F2F4F6",         // 토스 시그니처 연회색 배경
          card: "#FFFFFF",       // 순백색 카드
          blue: "#3182F6",       // 토스 블루
          blueHover: "#1B64DA",  // 블루 호버
          blueLight: "#E8F3FF",  // 연한 블루 배경
          text: "#191F28",       // 토스 기본 볼드 블랙
          subtext: "#4E5968",    // 보조 텍스트
          muted: "#8B95A1",      // 서브 텍스트 / 그레이
          border: "#E5E8EB",     // 얇은 디바이더 라인
          red: "#F04452",        // 포인트 레드 / 감소
          green: "#00C471",      // 포인트 그린 / 증가
          greenLight: "#E6F9F1", // 연한 그린 배경
          yellow: "#FFB300",     // 포인트 옐로우 / 별
        }
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'toss': '0 4px 20px 0 rgba(0, 0, 0, 0.04)',
        'toss-hover': '0 8px 30px 0 rgba(0, 0, 0, 0.08)',
        'toss-sheet': '0 -4px 25px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
