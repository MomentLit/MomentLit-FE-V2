import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";
import type {
  GoogleOAuthCallbackRequest,
  GoogleOAuthCallbackResponse,
} from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export const startGoogleOAuth = (): void => {
  if (typeof window === "undefined") {
    throw new Error("Google OAuth can only start in the browser");
  }

  window.location.assign(`${API_BASE_URL}/auth/oauth/google`);
};

export const exchangeGoogleOAuthCode = async ({
  code,
  state,
}: GoogleOAuthCallbackRequest): Promise<ApiResponse<GoogleOAuthCallbackResponse>> => {
  const params = new URLSearchParams({ code });
  if (state) params.set("state", state);

  const response = await apiClient.get<ApiResponse<GoogleOAuthCallbackResponse>>(
    `/auth/oauth/google/callback?${params.toString()}`,
  );

  return response.data;
};
