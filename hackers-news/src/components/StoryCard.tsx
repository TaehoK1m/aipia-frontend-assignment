import { Link } from "react-router-dom";
import { formatRelativeTime } from "../utils/formatRelativeTime";
import type { Story } from "../types/hn";

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const meta = formatRelativeTime(story.time);
  const thumbnail = `https://picsum.photos/seed/${story.id}/80/80?lock=${story.id}`;

  return (
    <Link
      to={`/story/${story.id}`}
      className="flex gap-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4 hover:border-brand transition"
    >
      {/* 썸네일 - 세로 중앙 고정 */}
      <div className="flex-shrink-0 flex items-center">
        <img
          src={thumbnail}
          alt=""
          className="h-16 w-16 rounded-md object-cover flex-shrink-0"
        />
      </div>

      {/* 텍스트 영역 - 상단 정렬 */}
      <div className="flex flex-col flex-1 justify-start">
        <h2 className="text-base font-semibold leading-snug text-slate-100">
          {story.title}
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          by <strong className="text-slate-200">{story.by}</strong> · {meta}
        </p>
      </div>
    </Link>
  );
}
