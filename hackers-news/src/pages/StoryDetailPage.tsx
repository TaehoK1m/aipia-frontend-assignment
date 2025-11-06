import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Loader } from "../components/Loader";
import { ErrorState } from "../components/ErrorState";
import { useStoryDetailStore } from "../store/useStoryDetailStore";
import { CommentItem } from "../components/CommentItem";
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
    loadAllComments, // 댓글 전체보기
    reset,
  } = useStoryDetailStore();

  const [showAll, setShowAll] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(storyId)) return;

    // 로컬 상태도 초기화 (깜빡임 줄이기 + 일관성)
    setShowAll(false);
    setIsLoadingComments(false);

    fetchDetail(storyId).catch(() => {
      // 에러는 store 내부에서 처리
    });

    return () => {
      reset();
    };
  }, [storyId, fetchDetail, reset]);

  if (!Number.isFinite(storyId)) {
    return <ErrorState message="Invalid story id." />;
  }

  if (isLoading) {
    return <Loader label="Loading story" />;
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

  // URL 안전 파싱
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
      {/* 상단 네비게이션 */}
      <div className="flex items-center gap-4 text-sm text-brand">
        <Link
          to="/"
          className="rounded-full border border-brand px-4 py-2 font-semibold hover:bg-brand hover:text-slate-950 transition"
        >
          ← Back
        </Link>
        <span>{postedAt}</span>
      </div>

      {/* 본문 헤더 */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-50">{story.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
          <span>by {story.by ?? "unknown"}</span>
          <span>score: {story.score ?? 0}</span>
          <span>{story.descendants ?? 0} comments</span>
        </div>

        {story.url && (
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-full items-center gap-2 overflow-hidden break-words text-sm font-semibold text-brand hover:text-brand-dark"
            title={story.url}
          >
            <span className="truncate">{host || story.url}</span>
            <span className="shrink-0">↗</span>
          </a>
        )}

        {story.text && (
          <div
            className="prose prose-invert max-w-none text-base"
            dangerouslySetInnerHTML={{ __html: story.text }}
          />
        )}
      </header>

      {/* 댓글 섹션 */}
      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">
          Comments ({story.descendants ?? 0})
        </h2>

        {comments.length === 0 ? (
          <p className="text-slate-500">No comments available.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}

        {/* 전체 보기 버튼 + 로딩 상태 */}
        {!showAll && comments.length < (story.descendants ?? 0) && (
          <button
            onClick={async () => {
              setIsLoadingComments(true);
              await loadAllComments(storyId);
              setIsLoadingComments(false);
              setShowAll(true);
            }}
            disabled={isLoadingComments}
            className={`mt-4 rounded-full px-4 py-2 text-sm font-semibold transition ${
              isLoadingComments
                ? "bg-brand/60 text-slate-950 cursor-not-allowed"
                : "bg-brand hover:bg-brand-dark text-slate-950"
            }`}
          >
            {isLoadingComments ? "Loading comments..." : "Show all comments"}
          </button>
        )}
      </section>
    </article>
  );
}
