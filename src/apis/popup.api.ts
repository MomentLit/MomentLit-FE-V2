import type { ApiResponse } from "../types/common.type";
import type { SpacePopupHistoryListSearchResponse } from "../types/popup.type";
import { apiClient } from "./client";

export const getSpacePopupHistory = async (
  spaceId: number
): Promise<ApiResponse<{ popups: SpacePopupHistoryListSearchResponse[] }>> => {
  const response = await apiClient.get<
    ApiResponse<{ popups: SpacePopupHistoryListSearchResponse[] }>
  >(`/spaces/${spaceId}/popups/history`);
  return response.data;
};
