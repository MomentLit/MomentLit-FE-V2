import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";
import type {
  MySpaceListSearchResponse,
  SpaceDetailSearchResponse,
  SpaceListSearchParams,
  SpaceListSearchResponse,
} from "@/types/space";

export const getSpaces = async (
  params?: SpaceListSearchParams
): Promise<ApiResponse<{ spaces: SpaceListSearchResponse[] }>> => {
  const response = await apiClient.get<
    ApiResponse<{ spaces: SpaceListSearchResponse[] }>
  >("/spaces", { params });
  return response.data;
};

export const getSpaceDetail = async (
  spaceId: number
): Promise<ApiResponse<SpaceDetailSearchResponse>> => {
  const response = await apiClient.get<ApiResponse<SpaceDetailSearchResponse>>(
    `/spaces/${spaceId}`
  );
  return response.data;
};

export const getMySpaces = async (
  params?: SpaceListSearchParams
): Promise<ApiResponse<{ spaces: MySpaceListSearchResponse[] }>> => {
  const response = await apiClient.get<
    ApiResponse<{ spaces: MySpaceListSearchResponse[] }>
  >("/spaces/me", { params });
  return response.data;
};
