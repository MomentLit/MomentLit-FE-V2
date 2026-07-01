import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";
import type {
  MatchingCreateRequest,
  MatchingCreateResponse,
} from "@/types/matching";

export const createMatching = async (
  body: MatchingCreateRequest
): Promise<ApiResponse<MatchingCreateResponse>> => {
  const response = await apiClient.post<ApiResponse<MatchingCreateResponse>>(
    "/matchings",
    body
  );
  return response.data;
};
