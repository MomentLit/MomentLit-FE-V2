import { getApiBaseUrl } from "@/apis/env";
import type { OAuthGoogleCallbackResponse } from "@/types/auth";
import type { ApiResponse } from "@/types/common";

export const OAUTH_STATE_KEY = "momentlit_google_oauth_state";

export const oauthGoogle = async (state?: string): Promise<void> => {
  if (typeof window === "undefined") {
    throw new Error("oauthGoogle is only available in the browser");
  }

  const oauthState = state ?? crypto.randomUUID();
  sessionStorage.setItem(OAUTH_STATE_KEY, oauthState);

  const params = new URLSearchParams({ state: oauthState });
  window.location.href = `${getApiBaseUrl()}/auth/oauth/google?${params.toString()}`;
};

export const oauthGoogleCallback = async (
  code: string,
  state?: string
): Promise<ApiResponse<OAuthGoogleCallbackResponse>> => {
  const params = new URLSearchParams({ code });
  if (state) params.set("state", state);

  const response = await fetch(
    `${getApiBaseUrl()}/auth/oauth/google/callback?${params.toString()}`
  );
  const body = await response
    .json()
    .catch(() => null) as ApiResponse<OAuthGoogleCallbackResponse> | { message?: string } | null;

  if (!response.ok || !body || !("data" in body)) {
    throw new Error(body?.message ?? "Google 로그인 처리 중 오류가 발생했습니다.");
  }

  return body;
};
