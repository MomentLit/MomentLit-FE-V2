import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";
import type { ChatRoomCreateRequest, ChatRoomCreateResponse } from "@/types/chat";

export const createChatRoom = async (
  body: ChatRoomCreateRequest
): Promise<ApiResponse<ChatRoomCreateResponse>> => {
  const response = await apiClient.post<ApiResponse<ChatRoomCreateResponse>>(
    "/chat",
    body
  );
  return response.data;
};
