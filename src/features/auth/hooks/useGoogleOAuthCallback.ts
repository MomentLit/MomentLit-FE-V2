"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  OAUTH_CALLBACK_CODE_KEY,
  OAUTH_STATE_KEY,
  oauthGoogleCallback,
} from "@/apis/auth/get";
import { getAccessToken, setAuthTokens } from "@/apis/auth/tokenStorage";

export function useGoogleOAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRequested = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    const completeLogin = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state") ?? undefined;
      const expectedState = sessionStorage.getItem(OAUTH_STATE_KEY);

      if (!code) {
        setError("Google 인증 코드가 전달되지 않았습니다.");
        return;
      }

      if (expectedState && state !== expectedState) {
        setError("Google 로그인 요청을 확인할 수 없습니다. 다시 시도해주세요.");
        return;
      }

      if (sessionStorage.getItem(OAUTH_CALLBACK_CODE_KEY) === code) {
        if (getAccessToken()) router.replace("/main");
        return;
      }
      sessionStorage.setItem(OAUTH_CALLBACK_CODE_KEY, code);

      try {
        const response = await oauthGoogleCallback(code, state);
        setAuthTokens(response.data.access_token, response.data.refresh_token);
        sessionStorage.removeItem(OAUTH_STATE_KEY);
        router.replace("/main");
      } catch (requestError) {
        const message = requestError instanceof Error
          ? requestError.message
          : undefined;
        sessionStorage.removeItem(OAUTH_CALLBACK_CODE_KEY);
        setError(message ?? "Google 로그인 처리 중 오류가 발생했습니다.");
      }
    };

    void completeLogin();
  }, [router, searchParams]);

  return { error };
}
