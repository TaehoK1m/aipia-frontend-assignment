interface StoryTabsProps {
  activeCategory: "top" | "new" | "best";
  onChange: (category: "top" | "new" | "best") => void;
  onRefresh: (category: "top" | "new" | "best") => void; // 새로고침 핸들러 추가
  isRefreshing?: boolean; // 로딩 상태 표시용
}

export function StoryTabs({
  activeCategory,
  onChange,
  onRefresh,
  isRefreshing = false,
}: StoryTabsProps) {
  const tabs: ("top" | "new" | "best")[] = ["top", "new", "best"];

  return (
    <div className="flex items-center gap-3">
      {/* 새로고침 버튼 */}
      <button
        onClick={() => onRefresh(activeCategory)}
        disabled={isRefreshing}
        className={`rounded-full bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-300 transition
          ${isRefreshing ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-700"}
        `}
        title="새로고침"
      >
        ↻
      </button>

      {/* 카테고리 탭 */}
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            activeCategory === tab
              ? "bg-brand text-slate-950"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
