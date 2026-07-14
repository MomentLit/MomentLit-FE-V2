import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";
import type { PopupCreateRequest, PopupCreateResponse } from "@/types/popup";

export const createPopup = async (
  payload: PopupCreateRequest
): Promise<ApiResponse<PopupCreateResponse>> => {
  const response = await apiClient.post<ApiResponse<PopupCreateResponse>>(
    "/popups",
    payload
  );

  return response.data;
};
