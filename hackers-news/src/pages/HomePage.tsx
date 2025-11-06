import { useEffect, useRef, useState, Suspense } from "react";
import { useStoriesStore } from "../store/useStoriesStore";
import { StoryCard } from "../components/StoryCard";
import { StoryTabs } from "../components/StoryTabs";
import { ErrorState } from "../components/ErrorState";
import { Loader } from "../components/Loader";

export function HomePage() {
  const [activeCategory, setActiveCategory] = useState<"top" | "new" | "best">(
    "top",
  );

  const {
    storiesByCategory,
    fetchMore,
    isLoading,
    hasMore,
    resetCategory,
    error,
  } = useStoriesStore();

  const observerRef = useRef<HTMLDivElement | null>(null);
  const stories = storiesByCategory[activeCategory] ?? [];

  //  초기 1회 로드 (LCP에 영향 최소화)
  useEffect(() => {
    if (stories.length === 0) {
      fetchMore(activeCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, fetchMore]);

  //  무한 스크롤 (중복 방지 안정 버전)
  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    let observing = true;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && observing) {
          observing = false;
          fetchMore(activeCategory).finally(() => {
            observing = true;
          });
        }
      },
      { threshold: 0.5 },
    );

    const timer = setTimeout(() => {
      if (target) observer.observe(target);
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [activeCategory, fetchMore, stories.length]);

  const handleRefresh = (category: "top" | "new" | "best") => {
    resetCategory(category);
    fetchMore(category);
  };

  return (
    <section className="space-y-6">
      {/* Hero Section (LCP 대상) */}
      <header className="text-center pt-10">
        <h1 className="text-4xl font-bold text-slate-50 tracking-tight">
          Hacker News
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Top tech headlines — updated live
        </p>
      </header>

      {/* Sticky 헤더 (탭 + 제목) */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur border-b border-slate-800 h-[56px] flex items-center justify-between px-4">
        <StoryTabs
          activeCategory={activeCategory}
          onChange={setActiveCategory}
          onRefresh={handleRefresh}
        />
        <h2 className="hidden sm:block text-lg font-semibold text-slate-50">
          {activeCategory.toUpperCase()} Stories
        </h2>
      </div>

      {/* ⚡ 메인 콘텐츠 */}
      <Suspense fallback={<Loader label="Loading stories" />}>
        {/* 에러 상태 */}
        {error && (
          <ErrorState
            message={error}
            onRetry={() => {
              resetCategory(activeCategory);
              fetchMore(activeCategory);
            }}
          />
        )}

        {/* 초기 로딩 */}
        {isLoading && stories.length === 0 && (
          <div className="h-40 flex items-center justify-center">
            <Loader label="Loading stories" />
          </div>
        )}

        {/* 스토리 목록 */}
        {stories.length > 0 && (
          <div className="flex flex-col gap-4">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}

        {/* 추가 로딩 표시 */}
        {isLoading && stories.length > 0 && (
          <div className="py-6">
            <Loader label="Loading more" />
          </div>
        )}

        {/* 감시 div */}
        {hasMore[activeCategory] && <div ref={observerRef} className="h-8" />}
      </Suspense>
    </section>
  );
}

export default HomePage;
