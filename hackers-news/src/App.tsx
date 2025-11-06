import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader } from "./components/Loader";

// ✅ 각 페이지를 lazy load로 분리 (code splitting)
const HomePage = lazy(() => import("./pages/HomePage"));
const StoryDetailPage = lazy(() => import("./pages/StoryDetailPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 md:px-6 lg:py-12">
        {/* ✅ lazy로딩 대기 중일 때 Loader 표시 */}
        <Suspense fallback={<Loader label="Loading page" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/story/:id" element={<StoryDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
