import type {
  OAuthGoogleCallbackResponse,
  RefreshRequest,
  RefreshResponse,
  SignInRequest,
  SignInResponse,
  SignOutRequest,
} from "../types/auth.type";
import type { ApiResponse } from "../types/common.type";
import { apiClient } from "./client";

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

export const oauthGoogle = async (state?: string): Promise<void> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }
  const params = state ? `?state=${encodeURIComponent(state)}` : "";
  window.location.href = `${baseUrl}/auth/oauth/google${params}`;
};

export const oauthGoogleCallback = async (
  code: string,
  state?: string
): Promise<ApiResponse<OAuthGoogleCallbackResponse>> => {
  const params = new URLSearchParams({ code });
  if (state) params.set("state", state);
  const response =
    await apiClient.get<ApiResponse<OAuthGoogleCallbackResponse>>(
      `/auth/oauth/google/callback?${params.toString()}`
    );
  return response.data;
};
