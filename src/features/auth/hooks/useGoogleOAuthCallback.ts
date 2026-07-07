"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { OAUTH_CALLBACK_CODE_KEY } from "@/apis/auth/get";
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
    sessionStorage.removeItem(OAUTH_CALLBACK_CODE_KEY);
    router.replace("/main");
  }, [result, router]);

  return { error: "error" in result ? result.error : null };
}
