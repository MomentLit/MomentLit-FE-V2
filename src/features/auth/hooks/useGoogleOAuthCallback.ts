"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { oauthGoogleCallback } from "@/apis/auth";
import { OAUTH_STATE_KEY } from "@/apis/auth/get";
import { setAuthTokens } from "@/apis/auth/tokenStorage";

export function useGoogleOAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRequested = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    const completeLogin = async () => {
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");
      const code = searchParams.get("code");
      const state = searchParams.get("state") ?? undefined;
      const expectedState = sessionStorage.getItem(OAUTH_STATE_KEY);

      if (accessToken && refreshToken) {
        setAuthTokens(accessToken, refreshToken);
        sessionStorage.removeItem(OAUTH_STATE_KEY);
        router.replace("/main");
        return;
      }

      if (!code) {
        setError("Google 로그인 이후 토큰 전달 방식 확인이 필요합니다.");
        return;
      }

      if (expectedState && state !== expectedState) {
        setError("Google 로그인 요청을 확인할 수 없습니다. 다시 시도해주세요.");
        return;
      }

      try {
        const response = await oauthGoogleCallback(code, state);
        setAuthTokens(response.data.access_token, response.data.refresh_token);
        sessionStorage.removeItem(OAUTH_STATE_KEY);
        router.replace("/main");
      } catch (requestError) {
        const message = axios.isAxiosError<{ message?: string }>(requestError)
          ? requestError.response?.data?.message
          : undefined;
        setError(message ?? "Google 로그인 처리 중 오류가 발생했습니다.");
      }
    };

    void completeLogin();
  }, [router, searchParams]);

  return { error };
}
