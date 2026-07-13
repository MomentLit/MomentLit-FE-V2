import type { ChatRoomListSearchResponse } from "@/types/chat";

export type ResolvedChatRoom = {
  chatRoomId: number;
  spaceName: string;
  counterpartName: string;
  myParticipantId: string | null;
  createdAt: string;
};

export const resolveChatRoom = (
  room: ChatRoomListSearchResponse,
  myId: string | null,
): ResolvedChatRoom => {
  const isMeHost = myId !== null && room.host.id === myId;
  const isMeSeller = myId !== null && room.seller.id === myId;

  return {
    chatRoomId: room.chat_room_id,
    counterpartName: isMeHost ? room.seller.name : room.host.name,
    createdAt: room.created_at,
    myParticipantId: isMeHost ? room.host.id : isMeSeller ? room.seller.id : null,
    spaceName: room.space.name,
  };
};
