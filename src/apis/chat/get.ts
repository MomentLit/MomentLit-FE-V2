import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";
import type {
  ChatMessageHistorySearchResponse,
  ChatRoomListSearchResponse,
} from "@/types/chat";

export const getMyChatRooms = async (): Promise<
  ApiResponse<{ chat_rooms: ChatRoomListSearchResponse[] }>
> => {
  const response = await apiClient.get<
    ApiResponse<{ chat_rooms: ChatRoomListSearchResponse[] }>
  >("/chat");
  return response.data;
};

export const getChatMessages = async (
  chatRoomId: number
): Promise<
  ApiResponse<{ chat_room_id: number; messages: ChatMessageHistorySearchResponse[] }>
> => {
  const response = await apiClient.get<
    ApiResponse<{ chat_room_id: number; messages: ChatMessageHistorySearchResponse[] }>
  >(`/chat/${chatRoomId}/messages`);
  return response.data;
};
