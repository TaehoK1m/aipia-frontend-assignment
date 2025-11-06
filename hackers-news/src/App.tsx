import { Routes, Route } from "react-router-dom";

import { HomePage } from "./pages/HomePage";
import { StoryDetailPage } from "./pages/StoryDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 md:px-6 lg:py-12">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/story/:id" element={<StoryDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
