"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { OAUTH_CALLBACK_CODE_KEY, OAUTH_STATE_KEY } from "@/apis/auth/get";
import { setAuthTokens } from "@/apis/auth/tokenStorage";
import type { OAuthGoogleCallbackResult } from "@/types/auth";

export function useGoogleOAuthCallback(result: OAuthGoogleCallbackResult) {
  const router = useRouter();

  useEffect(() => {
    if ("error" in result) {
      sessionStorage.removeItem(OAUTH_CALLBACK_CODE_KEY);
      return;
    }

    setAuthTokens(result.data.access_token, result.data.refresh_token);
    sessionStorage.removeItem(OAUTH_STATE_KEY);
    sessionStorage.removeItem(OAUTH_CALLBACK_CODE_KEY);
    document.cookie = `${OAUTH_STATE_KEY}=; path=/auth/oauth/google/callback; max-age=0; SameSite=Lax`;
    router.replace("/main");
  }, [result, router]);

  return { error: "error" in result ? result.error : null };
}
