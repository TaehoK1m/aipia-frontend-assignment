import { useEffect, useState, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader } from "../components/Loader";
import { ErrorState } from "../components/ErrorState";
import { CommentItem } from "../components/CommentItem";
import { useStoryDetailStore } from "../store/useStoryDetailStore";
import { formatRelativeTime } from "../utils/formatRelativeTime";

export function StoryDetailPage() {
  const params = useParams<{ id: string }>();
  const storyId = Number(params.id);

  const {
    story,
    comments,
    isLoading,
    error,
    fetchDetail,
    loadAllComments,
    reset,
  } = useStoryDetailStore();

  const [showAll, setShowAll] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(storyId)) return;
    setShowAll(false);
    setIsLoadingComments(false);
    fetchDetail(storyId).catch(() => {});
    return () => reset();
  }, [storyId, fetchDetail, reset]);

  if (!Number.isFinite(storyId)) {
    return <ErrorState message="Invalid story id." />;
  }

  if (isLoading && !story) {
    return (
      <section className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Loader label="Loading story" />
      </section>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => fetchDetail(storyId).catch(() => {})}
      />
    );
  }

  if (!story) {
    return <ErrorState message="Story unavailable." />;
  }

  const postedAt = formatRelativeTime(story.time);

  let host = "";
  try {
    if (story.url) {
      host = new URL(story.url).hostname.replace(/^www\./, "");
    }
  } catch {
    host = "";
  }

  return (
    <article className="space-y-6">
      {/* 상단 네비게이션 (돌아가기 버튼) */}
      <nav className="sticky top-0 z-10 flex items-center gap-4 bg-slate-950/90 backdrop-blur px-4 py-3 border-b border-slate-800">
        <Link
          to="/"
          className="rounded-full border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand hover:text-slate-950 transition"
        >
          ← Back
        </Link>
      </nav>

      {/* Hero Section (LCP 대상) */}
      <header className="pt-6 space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-50 leading-tight">
          {story.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <p>
            by{" "}
            <span className="font-semibold text-brand">
              {story.by ?? "unknown"}
            </span>
          </p>

          <span>•</span>

          <p>
            score:{" "}
            <span className="font-semibold text-slate-200">
              {story.score ?? 0}
            </span>
          </p>

          <span>•</span>

          <p>{postedAt}</p>
        </div>

        {story.url && (
          <p>
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline hover:text-brand-dark transition"
            >
              {host || story.url}
            </a>
          </p>
        )}
      </header>

      {/* 본문 텍스트 */}
      {story.text && (
        <div
          className="prose prose-invert max-w-none text-base"
          dangerouslySetInnerHTML={{ __html: story.text }}
        />
      )}

      {/* 댓글 섹션 */}
      <section className="mt-10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-100">
            Comments ({story.descendants ?? 0})
          </h2>
        </div>

        <Suspense fallback={<Loader label="Loading comments" />}>
          {comments.length === 0 ? (
            <p className="text-slate-500">No comments available.</p>
          ) : (
            (showAll ? comments : comments.slice(0, 5)).map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          )}
        </Suspense>
      </section>
      {!showAll && comments.length < (story.descendants ?? 0) && (
        <button
          onClick={async () => {
            setIsLoadingComments(true);
            await loadAllComments(storyId);
            setIsLoadingComments(false);
            setShowAll(true);
          }}
          disabled={isLoadingComments}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            isLoadingComments
              ? "bg-brand/60 text-slate-950 cursor-not-allowed"
              : "bg-brand hover:bg-brand-dark text-slate-950"
          }`}
        >
          {isLoadingComments ? "Loading comments..." : "Show all comments"}
        </button>
      )}
    </article>
  );
}

export default StoryDetailPage;
