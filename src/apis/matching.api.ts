import type { ApiResponse } from "../types/common.type";
import type {
  MatchingCreateRequest,
  MatchingCreateResponse,
  MatchingListSearchResponse,
} from "../types/matching.type";
import { apiClient } from "./client";

export const createMatching = async (
  body: MatchingCreateRequest
): Promise<ApiResponse<MatchingCreateResponse>> => {
  const response = await apiClient.post<ApiResponse<MatchingCreateResponse>>(
    "/matchings",
    body
  );
  return response.data;
};

export const getReceivedMatchings = async (): Promise<
  ApiResponse<{ matchings: MatchingListSearchResponse[] }>
> => {
  const response = await apiClient.get<
    ApiResponse<{ matchings: MatchingListSearchResponse[] }>
  >("/matchings/inbox");
  return response.data;
};

export const getSentMatchings = async (): Promise<
  ApiResponse<{ matchings: MatchingListSearchResponse[] }>
> => {
  const response = await apiClient.get<
    ApiResponse<{ matchings: MatchingListSearchResponse[] }>
  >("/matchings/me");
  return response.data;
};

export const approveMatching = async (matchingId: string): Promise<void> => {
  await apiClient.patch(`/matchings/${encodeURIComponent(matchingId)}/approve`);
};

export const rejectMatching = async (matchingId: string): Promise<void> => {
  await apiClient.patch(`/matchings/${encodeURIComponent(matchingId)}/reject`);
};

export const cancelMatching = async (matchingId: string): Promise<void> => {
  await apiClient.patch(`/matchings/${encodeURIComponent(matchingId)}/cancel`);
};
