import { formatDistanceToNow } from "date-fns";

/** Unix timestamp(초 단위)를 "x hours ago" 같은 상대시간으로 변환 */
export function formatRelativeTime(unixTime: number): string {
  if (!unixTime || Number.isNaN(unixTime)) return "";
  return formatDistanceToNow(new Date(unixTime * 1000), { addSuffix: true });
}
