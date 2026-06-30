import type { ApiResponse } from "../types/common.type";
import type {
  SignUpRequest,
  SignUpResponse,
  UserSearchResponse,
  UserUpdateRequest,
} from "../types/user.type";
import { apiClient } from "./client";

export const signUp = async (
  body: SignUpRequest
): Promise<ApiResponse<SignUpResponse>> => {
  const response = await apiClient.post<ApiResponse<SignUpResponse>>(
    "/users/signup",
    body
  );
  return response.data;
};

export const getMyProfile = async (): Promise<
  ApiResponse<UserSearchResponse>
> => {
  const response =
    await apiClient.get<ApiResponse<UserSearchResponse>>("/users/me");
  return response.data;
};

export const updateMyProfile = async (
  body: UserUpdateRequest
): Promise<void> => {
  await apiClient.patch("/users/me", body);
};

export const deleteMyAccount = async (): Promise<void> => {
  await apiClient.delete("/users/me");
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};
