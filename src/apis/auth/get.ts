import { apiClient } from "@/apis/client";
import type { OAuthGoogleCallbackResponse } from "@/types/auth";
import type { ApiResponse } from "@/types/common";

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
