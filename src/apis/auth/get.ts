import { getApiBaseUrl } from "@/apis/env";

export const OAUTH_STATE_KEY = "momentlit_google_oauth_state";

export const oauthGoogle = async (): Promise<void> => {
  if (typeof window === "undefined") {
    throw new Error("oauthGoogle is only available in the browser");
  }

  const state = crypto.randomUUID();
  sessionStorage.setItem(OAUTH_STATE_KEY, state);

  const params = new URLSearchParams({ state });
  window.location.href = `${getApiBaseUrl()}/auth/oauth/google?${params.toString()}`;
};
