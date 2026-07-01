import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";
import type { SpaceCreateRequest, SpaceCreateResponse } from "@/types/space";

export const createSpace = async (
  body: SpaceCreateRequest
): Promise<ApiResponse<SpaceCreateResponse>> => {
  const response = await apiClient.post<ApiResponse<SpaceCreateResponse>>(
    "/spaces",
    body
  );
  return response.data;
};
