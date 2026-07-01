import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";
import type { MatchingListSearchResponse } from "@/types/matching";

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
