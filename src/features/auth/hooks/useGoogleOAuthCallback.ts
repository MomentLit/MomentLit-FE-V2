"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  OAUTH_CALLBACK_CODE_KEY,
  OAUTH_STATE_KEY,
  exchangeGoogleOAuthCode,
} from "@/apis/auth";
import { getAccessToken, setAuthTokens } from "@/apis/auth/tokenStorage";

const getRequestErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message
      ?? "Google 로그인 처리 중 오류가 발생했습니다.";
  }

  return error instanceof Error
    ? error.message
    : "Google 로그인 처리 중 오류가 발생했습니다.";
};

export function useGoogleOAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasStarted = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const completeGoogleLogin = async () => {
      const providerError = searchParams.get("error");
      const providerErrorDescription = searchParams.get("error_description");
      const code = searchParams.get("code");
      const state = searchParams.get("state") ?? undefined;
      const expectedState = sessionStorage.getItem(OAUTH_STATE_KEY);

      if (providerError) {
        setError(providerErrorDescription ?? "Google 로그인이 취소되었거나 거부되었습니다.");
        return;
      }

      if (!code) {
        setError("Google 인증 정보가 올바르게 전달되지 않았습니다.");
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
        const response = await exchangeGoogleOAuthCode({
          code,
          state: state ?? undefined,
        });
        const { access_token: accessToken, refresh_token: refreshToken } = response.data;

        if (!accessToken || !refreshToken) {
          throw new Error("OAuth token response is incomplete");
        }

        setAuthTokens(accessToken, refreshToken);
        sessionStorage.removeItem(OAUTH_STATE_KEY);
        router.replace("/main");
      } catch (requestError) {
        sessionStorage.removeItem(OAUTH_CALLBACK_CODE_KEY);
        setError(getRequestErrorMessage(requestError));
      }
    };

    void completeGoogleLogin();
  }, [router, searchParams]);

  return { error };
}
