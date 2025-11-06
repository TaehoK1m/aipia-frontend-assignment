import type {
  Comment,
  CommentNode,
  Story,
  StoryCategory,
  StoryDetail,
} from "../types/hn";

const BASE_URL = "https://hacker-news.firebaseio.com/v0";
const STORY_LIMIT = 20;

// 카테고리별 엔드포인트
const endpointForCategory: Record<StoryCategory, string> = {
  top: "topstories",
  new: "newstories",
  best: "beststories",
};

// 공용 JSON fetch 함수
async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed with ${res.status}`);
  return res.json() as Promise<T>;
}

// 개별 아이템(스토리 or 댓글)
async function fetchItem(id: number): Promise<Story | Comment | null> {
  const data = await fetchJSON<Story | Comment | null>(
    `${BASE_URL}/item/${id}.json`,
  );
  return data ?? null;
}

/* -------------------------------------------------------------------------- */
/* 🔹 댓글 관련 함수 (StoryDetail용)                                           */
/* -------------------------------------------------------------------------- */

/**
 * 댓글 노드 재귀적으로 가져오기 (깊이 제한 지원)
 * @param id 댓글 ID
 * @param depth 현재 깊이 (기본 0)
 * @param maxDepth 최대 깊이 제한 (기본 1 = 대댓글 1단계까지만)
 */
export async function fetchCommentNode(
  id: number,
  depth = 0,
  maxDepth = 1,
): Promise<CommentNode | null> {
  const data = await fetchItem(id);

  if (!data || data.type !== "comment" || data.dead || data.deleted) {
    return null;
  }

  let children: CommentNode[] = [];

  // depth 제한 적용
  if (data.kids && depth < maxDepth) {
    const childComments = await Promise.all(
      data.kids.map((childId) =>
        fetchCommentNode(childId, depth + 1, maxDepth),
      ),
    );
    children = childComments.filter(Boolean) as CommentNode[];
  }

  return { ...data, children };
}

/**
 * 스토리 상세 + 댓글 일부 가져오기
 * @param id 스토리 ID
 * @param limit 루트 댓글 개수 제한 (예: 5)
 * @param maxDepth 댓글 깊이 제한 (예: 1)
 */
export async function fetchStoryDetail(
  id: number,
  limit?: number,
  maxDepth = 1,
): Promise<StoryDetail> {
  const item = await fetchItem(id);
  if (!item || item.type !== "story") throw new Error("Story not found");

  const kids = item.kids ? (limit ? item.kids.slice(0, limit) : item.kids) : [];

  const comments = kids.length
    ? ((
        await Promise.all(
          kids.map((childId) => fetchCommentNode(childId, 0, maxDepth)),
        )
      ).filter(Boolean) as CommentNode[])
    : [];

  return { story: item, comments };
}

/* -------------------------------------------------------------------------- */
/* 🔹 뉴스 목록 관련 함수 (HomePage용)                                        */
/* -------------------------------------------------------------------------- */

/**
 * 스토리 목록 무한 스크롤 지원 API
 * @param category top/new/best
 * @param offset 이미 불러온 개수
 * @param limit 새로 불러올 개수 (기본 20)
 */
export async function fetchStories(
  category: StoryCategory,
  offset = 0,
  limit = STORY_LIMIT,
): Promise<Story[]> {
  const ids = await fetchJSON<number[]>(
    `${BASE_URL}/${endpointForCategory[category]}.json`,
  );

  const selectedIds = ids.slice(offset, offset + limit);

  const stories = await Promise.all(
    selectedIds.map(async (id) => {
      const item = await fetchItem(id);
      return item && item.type === "story" ? item : null;
    }),
  );

  return stories.filter(Boolean) as Story[];
}
