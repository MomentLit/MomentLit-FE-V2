import { apiClient } from "@/apis/client";
import { getApiBaseUrl } from "@/apis/env";
import type { OAuthGoogleCallbackResponse } from "@/types/auth";
import type { ApiResponse } from "@/types/common";

export const OAUTH_STATE_KEY = "momentlit_google_oauth_state";
export const OAUTH_CALLBACK_CODE_KEY = "momentlit_google_oauth_callback_code";

export const oauthGoogle = async (): Promise<void> => {
  if (typeof window === "undefined") {
    throw new Error("oauthGoogle is only available in the browser");
  }

  sessionStorage.removeItem(OAUTH_CALLBACK_CODE_KEY);

  window.location.href = `${getApiBaseUrl()}/auth/oauth/google`;
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
