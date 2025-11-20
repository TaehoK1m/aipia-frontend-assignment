# 📰 Hacker News Viewer

React + Vite 기반의 Hacker News 클라이언트입니다.  
공식 Hacker News API를 사용해 실시간 뉴스 목록과 댓글 트리를 제공합니다.

---

### 🔗 배포 URL
[Hacker News Viewer](https://aipia-frontend-assignment-mu.vercel.app/)

---
 
## 🚀 주요 기술 스택

| 구분 | 기술 |
|------|------|
| **Frontend Framework** | React 18 + TypeScript |
| **Bundler** | Vite 5 |
| **State Management** | Zustand |
| **Styling** | Tailwind CSS |
| **Data Fetching** | Fetch API (REST) |
| **PWA** | vite-plugin-pwa |
| **Etc.** | DOMPurify, date-fns |

---

## 📂 프로젝트 구조

```
src/
 ├── api/                # Hacker News API 호출 함수
 ├── components/         # 공통 UI 컴포넌트 (StoryCard, CommentItem 등)
 ├── pages/              # 주요 페이지 (HomePage, StoryDetailPage)
 ├── store/              # Zustand 전역 상태 관리
 ├── utils/              # 공통 유틸리티 함수 (시간 포맷 등)
 ├── styles.css          # Tailwind 기반 스타일
 ├── main.tsx            # React 진입점
 └── App.tsx             # 라우팅 및 전체 레이아웃
```

---

## 💡 주요 기능

### 🏠 1. 기사 목록 (HomePage)
- Hacker News API의 $top$, $new$, $best$ 스토리 탭 제공  
- **무한 스크롤(Infinite Scroll)** 기반 자동 로드  
- Zustand 전역 캐싱을 통한 중복 요청 방지  
- 네트워크 에러 시 $ErrorState$ 컴포넌트로 재시도 버튼 표시

### 📰 2. 기사 상세 (StoryDetailPage)
- 제목, 작성자, 작성 시간, 댓글 수 표시  
- **댓글 트리 구조** 재귀 렌더링 ($CommentItem$)  
- 초기 5개의 루트 댓글만 표시, “Show all comments”로 전체 보기  
- 각 대댓글은 “View replies / Hide replies”로 토글 가능  
- HTML 댓글 본문을 $DOMPurify$로 안전하게 렌더링

### ⚡ 3. 성능 최적화
- 코드 스플리팅 ($manualChunks$)  
- Brotli + gzip 압축  
- Critical CSS 인라인 및 JS defer 처리  
- React.memo, Suspense로 렌더링 최소화  

### 📱 4. PWA 지원
- $vite-plugin-pwa$ 기반 서비스워커 자동 등록  
- 홈 화면 추가 가능 (Add to Home Screen)  
- 오프라인 캐시 일부 지원

---

## 🧪 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 로컬 서버 실행 (빌드 확인용)
npx serve dist -l 5173
```

접속: [http://localhost:5173](http://localhost:5173)

---

## 🧭 Lighthouse 성능 결과

- 코드 스플리팅 및 리소스 압축으로 초기 로드 최적화  
- React.memo, lazy loading, JS defer 처리로 렌더링 지연 최소화  
- LCP 1초 이하 유지 (Desktop 100점, Mobile 약 90점 수준)

---

## 🧱 기술적 포인트 요약

- React 18의 Suspense 활용한 로딩 분리
- Zustand로 전역 상태 최소화 및 캐싱
- 댓글 5개만 초기 렌더 → 성능 향상
- Vite PWA 자동 등록으로 정적 리소스 캐싱 및 오프라인 접근 지원
- Tailwind Utility Class로 일관된 반응형 레이아웃

---
