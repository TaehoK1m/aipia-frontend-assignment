import { useEffect, useRef, useState } from "react";
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

  //  초기 1회 로드
  useEffect(() => {
    if (stories.length === 0) {
      fetchMore(activeCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, fetchMore]);

  //  무한 스크롤 (안정 버전)
  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    let observing = true;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && observing) {
          observing = false; // 중복 호출 방지
          fetchMore(activeCategory).finally(() => {
            // fetch 완료 후 다시 감시 시작
            observing = true;
          });
        }
      },
      {
        threshold: 0.5, // 1픽셀이라도 보이면 감지
      },
    );

    // observer 등록을 약간 늦춰서 DOM 업데이트 이후 확실히 잡도록 함
    const timer = setTimeout(() => {
      if (target) observer.observe(target);
    }, 100);

    // cleanup
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [activeCategory, fetchMore, stories.length]);

  //  새로고침 핸들러
  const handleRefresh = (category: "top" | "new" | "best") => {
    resetCategory(category);
    fetchMore(category);
  };

  return (
    <section className="space-y-6">
      <StoryTabs
        activeCategory={activeCategory}
        onChange={setActiveCategory}
        onRefresh={handleRefresh}
      />

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
    </section>
  );
}
