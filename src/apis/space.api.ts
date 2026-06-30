import type { ApiResponse } from "../types/common.type";
import type {
  MySpaceListSearchResponse,
  SpaceCreateRequest,
  SpaceCreateResponse,
  SpaceDetailSearchResponse,
  SpaceListSearchParams,
  SpaceListSearchResponse,
  SpaceUpdateRequest,
} from "../types/space.type";
import { apiClient } from "./client";

export const createSpace = async (
  body: SpaceCreateRequest
): Promise<ApiResponse<SpaceCreateResponse>> => {
  const response = await apiClient.post<ApiResponse<SpaceCreateResponse>>(
    "/spaces",
    body
  );
  return response.data;
};

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

export const updateSpace = async (
  spaceId: number,
  body: SpaceUpdateRequest
): Promise<void> => {
  await apiClient.patch(`/spaces/${spaceId}`, body);
};

export const deleteSpace = async (spaceId: number): Promise<void> => {
  await apiClient.delete(`/spaces/${spaceId}`);
};

export const getMySpaces = async (
  params?: SpaceListSearchParams
): Promise<ApiResponse<{ spaces: MySpaceListSearchResponse[] }>> => {
  const response = await apiClient.get<
    ApiResponse<{ spaces: MySpaceListSearchResponse[] }>
  >("/spaces/me", { params });
  return response.data;
};
