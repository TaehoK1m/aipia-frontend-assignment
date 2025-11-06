export type StoryCategory = "top" | "new" | "best";

export interface BaseItem {
  id: number; // 고유 ID (필수)
  by?: string; // 작성자 (story/comment 공통)
  time: number; // Unix timestamp (필수)
  type: "story" | "comment"; // 항목 타입

  // Optional fields (항목 유형별로 존재 여부가 다름)
  url?: string; // story에만 존재 (외부 링크)
  title?: string; // story에만 존재 (기사 제목)
  text?: string; // story 또는 comment의 본문 (HTML 가능)
  kids?: number[]; // 자식 댓글/스토리 ID 목록

  // story에만 존재하는 필드
  score?: number; // 추천 점수
  descendants?: number; // 전체 댓글 수
  parent?: number; // comment에만 존재 (부모 ID)
}

export interface Story extends BaseItem {
  type: "story";
}

export interface Comment extends BaseItem {
  type: "comment";
  deleted?: boolean;
  dead?: boolean;
}

export interface CommentNode extends Omit<Comment, "kids"> {
  children: CommentNode[];
}

export interface StoryDetail {
  story: Story;
  comments: CommentNode[];
}
