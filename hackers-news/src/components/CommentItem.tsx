import { useState } from "react";
import DOMPurify from "dompurify";
import { formatRelativeTime } from "../utils/formatRelativeTime";
import type { CommentNode } from "../types/hn";

interface CommentItemProps {
  comment: CommentNode;
  depth?: number;
}

export function CommentItem({ comment, depth = 0 }: CommentItemProps) {
  // 대댓글 펼침 여부 상태 관리 (기본: 닫힘)
  const [expanded, setExpanded] = useState(false);

  // 작성 시간 포맷팅 (예: "5 minutes ago")
  const createdAt = formatRelativeTime(comment.time);

  // 댓글 본문 HTML을 안전하게 렌더링
  const safeHtml = DOMPurify.sanitize(comment.text ?? "");

  return (
    <div
      className={`border-l border-slate-700/50 pl-4 ${depth > 0 ? "ml-4" : ""}`}
    >
      <div className="space-y-2 rounded-md bg-slate-800/40 p-3">
        {/* 삭제되거나 숨김 처리된 댓글 안내 */}
        {comment.deleted ? (
          <p className="text-sm italic text-slate-500">
            This comment was deleted by the author.
          </p>
        ) : comment.dead ? (
          <p className="text-sm italic text-slate-500">
            This comment was removed by a moderator.
          </p>
        ) : (
          <>
            {/* 작성자 및 작성 시간 표시 */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-brand">
                {comment.by ?? "unknown"}
              </span>
              <span>• {createdAt}</span>
            </div>

            {/* 댓글 본문 */}
            <div
              className="prose prose-invert max-w-none break-words text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          </>
        )}
      </div>

      {/* 자식 댓글 (대댓글) */}
      {comment.children?.length > 0 && (
        <div className="mt-3 space-y-3">
          {/* 대댓글이 접혀 있는 경우 */}
          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="text-xs text-slate-400 hover:text-brand transition"
            >
              View {comment.children.length}{" "}
              {comment.children.length === 1 ? "reply" : "replies"} ▼
            </button>
          ) : (
            <>
              {/* 대댓글이 펼쳐져 있는 경우 */}
              <button
                onClick={() => setExpanded(false)}
                className="text-xs text-slate-400 hover:text-brand transition"
              >
                Hide replies ▲
              </button>

              {/* 재귀적으로 대댓글 렌더링 */}
              <div className="mt-2 space-y-3">
                {comment.children.map((child) => (
                  <CommentItem
                    key={child.id}
                    comment={child}
                    depth={depth + 1}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
