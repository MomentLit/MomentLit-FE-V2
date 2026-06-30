import { apiClient } from "@/apis/client";
import type {
  RefreshRequest,
  RefreshResponse,
  SignInRequest,
  SignInResponse,
  SignOutRequest,
} from "@/types/auth";
import type { ApiResponse } from "@/types/common";

export const signIn = async (
  body: SignInRequest
): Promise<ApiResponse<SignInResponse>> => {
  const response = await apiClient.post<ApiResponse<SignInResponse>>(
    "/auth/signin",
    body
  );
  return response.data;
};

export const signOut = async (body: SignOutRequest): Promise<void> => {
  await apiClient.post("/auth/signout", body);
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};

export const refresh = async (
  body: RefreshRequest
): Promise<ApiResponse<RefreshResponse>> => {
  const response = await apiClient.post<ApiResponse<RefreshResponse>>(
    "/auth/refresh",
    body
  );
  return response.data;
};
