import { apiClient } from "@/apis/client";
import type { OAuthGoogleCallbackResponse } from "@/types/auth";
import type { ApiResponse } from "@/types/common";

export const OAUTH_STATE_KEY = "momentlit_google_oauth_state";

export const oauthGoogle = async (state?: string): Promise<void> => {
  if (typeof window === "undefined") {
    throw new Error("oauthGoogle is only available in the browser");
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

  const oauthState = state ?? crypto.randomUUID();
  sessionStorage.setItem(OAUTH_STATE_KEY, oauthState);

  const params = new URLSearchParams({ state: oauthState });
  const query = params.toString();
  window.location.href = `${baseUrl}/auth/oauth/google${query ? `?${query}` : ""}`;
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
