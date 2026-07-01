import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";
import type { UserSearchResponse } from "@/types/user";

export const getMyProfile = async (): Promise<
  ApiResponse<UserSearchResponse>
> => {
  const response =
    await apiClient.get<ApiResponse<UserSearchResponse>>("/users/me");
  return response.data;
};
