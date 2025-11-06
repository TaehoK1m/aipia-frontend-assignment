import { create } from "zustand";
import { fetchStories } from "../api/hnApi";
import type { Story, StoryCategory } from "../types/hn";

/**
 * Zustand 상태 정의
 */
interface StoriesState {
  storiesByCategory: Record<StoryCategory, Story[]>; // 카테고리별 스토리 목록
  fetchedIds: Record<StoryCategory, Set<number>>; // 이미 불러온 기사 ID 추적
  hasMore: Record<StoryCategory, boolean>; // 추가 로드 가능 여부
  isLoading: boolean; // 로딩 중 여부
  error: string | null; // 에러 메시지 (UI에서 ErrorState로 표시)
  fetchMore: (category: StoryCategory) => Promise<void>;
  resetCategory: (category: StoryCategory) => void;
}

const PAGE_SIZE = 20;

/**
 * Hacker News API 기반 무한 스크롤 Zustand Store
 */
export const useStoriesStore = create<StoriesState>((set, get) => ({
  storiesByCategory: { top: [], new: [], best: [] },
  fetchedIds: { top: new Set(), new: new Set(), best: new Set() },
  hasMore: { top: true, new: true, best: true },
  isLoading: false,
  error: null,

  /**
   * 카테고리별 스토리 추가 로딩 (무한 스크롤)
   */
  async fetchMore(category) {
    const { storiesByCategory, fetchedIds, isLoading, hasMore } = get();

    // 중복 호출 방지 및 더 이상 데이터가 없을 경우 반환
    if (isLoading || !hasMore[category]) return;

    set({ isLoading: true, error: null });
    const offset = storiesByCategory[category].length;

    try {
      const newStories = await fetchStories(category, offset, PAGE_SIZE);

      // 중복 ID 필터링
      const filtered = newStories.filter(
        (story) => !fetchedIds[category].has(story.id),
      );

      // 새 ID 추가
      const updatedIds = new Set(fetchedIds[category]);
      filtered.forEach((s) => updatedIds.add(s.id));

      // 상태 업데이트
      set({
        storiesByCategory: {
          ...storiesByCategory,
          [category]: [...storiesByCategory[category], ...filtered],
        },
        fetchedIds: {
          ...fetchedIds,
          [category]: updatedIds,
        },
        hasMore: {
          ...hasMore,
          [category]: filtered.length === PAGE_SIZE, // 페이지 크기 미만이면 더 이상 로드 불가
        },
        isLoading: false,
        error: null,
      });
    } catch (e) {
      // 에러 발생 시 ErrorState에서 표시할 수 있도록 메시지 저장
      set({
        isLoading: false,
        error: "Failed to fetch stories. Please try again.",
      });
    }
  },

  /**
   * 카테고리 초기화 (탭 전환 시 초기 상태로 복원)
   */
  resetCategory(category) {
    set((state) => ({
      storiesByCategory: { ...state.storiesByCategory, [category]: [] },
      fetchedIds: { ...state.fetchedIds, [category]: new Set() },
      hasMore: { ...state.hasMore, [category]: true },
      error: null,
    }));
  },
}));
