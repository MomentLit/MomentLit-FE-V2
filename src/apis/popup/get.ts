import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";
import type { SpacePopupHistoryListSearchResponse } from "@/types/popup";

export const getSpacePopupHistory = async (
  spaceId: number
): Promise<ApiResponse<{ popups: SpacePopupHistoryListSearchResponse[] }>> => {
  const response = await apiClient.get<
    ApiResponse<{ popups: SpacePopupHistoryListSearchResponse[] }>
  >(`/spaces/${spaceId}/popups/history`);
  return response.data;
};
