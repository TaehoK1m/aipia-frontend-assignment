import { create } from "zustand";

import { fetchStoryDetail } from "../api/hnApi";
import type { CommentNode, Story } from "../types/hn";

interface StoryDetailState {
  story: Story | null;
  comments: CommentNode[];
  isLoading: boolean;
  error: string | null;
  fetchDetail: (id: number) => Promise<void>;
  loadAllComments: (id: number) => Promise<void>;
  reset: () => void;
}

const defaultState: Omit<
  StoryDetailState,
  "fetchDetail" | "loadAllComments" | "reset"
> = {
  story: null,
  comments: [],
  isLoading: false,
  error: null,
};

const COMMENTS_LIMIT = 5;

export const useStoryDetailStore = create<StoryDetailState>((set, get) => ({
  ...defaultState,

  // 5개만 선로딩
  async fetchDetail(id: number) {
    set({ isLoading: true, error: null });
    try {
      const detail = await fetchStoryDetail(id, COMMENTS_LIMIT);
      set({
        story: detail.story,
        comments: detail.comments,
        isLoading: false,
      });
    } catch (error) {
      set({
        story: null,
        comments: [],
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },

  // 전체 댓글 로딩
  async loadAllComments(id: number) {
    try {
      const story = get().story;
      const detail = await fetchStoryDetail(id); // 전체 로드
      const alreadyLoaded = get().comments.map((c) => c.id);

      // 기존 댓글 제외한 새 댓글만 필터링
      const newOnes = detail.comments.filter(
        (c) => !alreadyLoaded.includes(c.id),
      );

      // 이어붙이기
      set({
        story: story ?? detail.story,
        comments: [...get().comments, ...newOnes],
      });
    } catch {
      // 에러 처리
    }
  },

  reset() {
    set(defaultState);
  },
}));
