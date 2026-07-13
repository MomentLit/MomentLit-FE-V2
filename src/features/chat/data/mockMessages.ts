// Mock 데이터: 채팅 메시지 API가 아직 없어 대화방 진입 시 보여줄 임시 시작 메시지만 구성한다.
// 채팅 메시지 API가 준비되면 이 파일과 useChatThread의 seed 로직을 실제 API 연동으로 교체한다.
import type { ChatMessage, ChatRoom } from "@/types/chat";

const formatTime = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit" }).format(new Date(value));

export const buildMockThread = (room: ChatRoom): ChatMessage[] => {
  const greeting = room.direction === "received"
    ? `안녕하세요! "${room.subtitle}" 공간 문의 드립니다.`
    : `안녕하세요! "${room.title}" 문의 확인 부탁드립니다.`;

  return [
    {
      id: `seed-${room.matchingId}`,
      sender: "counterpart",
      content: greeting,
      time: formatTime(room.createdAt),
    },
  ];
};
