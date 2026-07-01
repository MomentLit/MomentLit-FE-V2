import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";
import type { SignUpRequest, SignUpResponse } from "@/types/user";

export const signUp = async (
  body: SignUpRequest
): Promise<ApiResponse<SignUpResponse>> => {
  const response = await apiClient.post<ApiResponse<SignUpResponse>>(
    "/users/signup",
    body
  );
  return response.data;
};
