import { apiClient } from "@/apis/client";
import { clearAuthTokens } from "@/apis/auth/tokenStorage";
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
  try {
    await apiClient.post("/auth/signout", body);
  } finally {
    clearAuthTokens();
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
