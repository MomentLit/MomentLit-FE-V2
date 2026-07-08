import { getApiBaseUrl } from "@/apis/env";
import type { ApiResponse } from "@/types/common";
import type {
  GoogleOAuthCallbackRequest,
  GoogleOAuthCallbackResponse,
} from "@/types/auth";

export const OAUTH_STATE_KEY = "momentlit_google_oauth_state";
export const OAUTH_CALLBACK_CODE_KEY = "momentlit_google_oauth_callback_code";

export const startGoogleOAuth = (): void => {
  if (typeof window === "undefined") {
    throw new Error("Google OAuth can only start in the browser");
  }

  const oauthState = crypto.randomUUID();
  sessionStorage.setItem(OAUTH_STATE_KEY, oauthState);
  sessionStorage.removeItem(OAUTH_CALLBACK_CODE_KEY);

  const params = new URLSearchParams({ state: oauthState });
  window.location.assign(`${getApiBaseUrl()}/auth/oauth/google?${params.toString()}`);
};

export const exchangeGoogleOAuthCode = async ({
  code,
  state,
}: GoogleOAuthCallbackRequest): Promise<ApiResponse<GoogleOAuthCallbackResponse>> => {
  const params = new URLSearchParams({ code });
  if (state) params.set("state", state);

  const response = await fetch(
    `${getApiBaseUrl()}/auth/oauth/google/callback?${params.toString()}`
  );
  const body = await response
    .json()
    .catch(() => null) as ApiResponse<GoogleOAuthCallbackResponse> | { message?: string } | null;

  if (!response.ok || !body || !("data" in body)) {
    throw new Error(body?.message ?? "Google 로그인 처리 중 오류가 발생했습니다.");
  }

  return body;
};
