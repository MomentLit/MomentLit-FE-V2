"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { oauthGoogleCallback } from "@/apis/auth";
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

      if (accessToken && refreshToken) {
        setAuthTokens(accessToken, refreshToken);
        router.replace("/main");
        return;
      }

      if (!code) {
        setError("Google 로그인 이후 토큰 전달 방식 확인이 필요합니다.");
        return;
      }

      try {
        const response = await oauthGoogleCallback(code, state);
        setAuthTokens(response.data.access_token, response.data.refresh_token);
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
