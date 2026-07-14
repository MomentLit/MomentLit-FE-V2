import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";
import type {
  PopupDetailSearchResponse,
  PopupListSearchResponse,
  SpacePopupHistoryListSearchResponse,
} from "@/types/popup";

export const getSpacePopupHistory = async (
  spaceId: number
): Promise<ApiResponse<{ popups: SpacePopupHistoryListSearchResponse[] }>> => {
  const response = await apiClient.get<
    ApiResponse<{ popups: SpacePopupHistoryListSearchResponse[] }>
  >(`/spaces/${spaceId}/popups/history`);
  return response.data;
};

export const getPopups = async (): Promise<
  ApiResponse<{ popups: PopupListSearchResponse[] }>
> => {
  const response = await apiClient.get<
    ApiResponse<{ popups: PopupListSearchResponse[] }>
  >("/popups");

  return response.data;
};

export const getPopupDetail = async (
  popupId: number | string
): Promise<ApiResponse<PopupDetailSearchResponse>> => {
  const response = await apiClient.get<ApiResponse<PopupDetailSearchResponse>>(
    `/popups/${popupId}`
  );

  return response.data;
};

export const getMyPopups = async (): Promise<
  ApiResponse<{ popups: PopupListSearchResponse[] }>
> => {
  const response = await apiClient.get<
    ApiResponse<{ popups: PopupListSearchResponse[] }>
  >("/popups/me");

  return response.data;
};

export const getPopupRecommendations = async (): Promise<
  ApiResponse<{ popups: PopupListSearchResponse[] }>
> => {
  const response = await apiClient.get<
    ApiResponse<{ popups: PopupListSearchResponse[] }>
  >("/popups/recommendations");

  return response.data;
};

export const getSellerPopupHistory = async (
  userId: number | string
): Promise<ApiResponse<{ popups: PopupListSearchResponse[] }>> => {
  const response = await apiClient.get<
    ApiResponse<{ popups: PopupListSearchResponse[] }>
  >(`/users/${userId}/popups/history`);

  return response.data;
};
