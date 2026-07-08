"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { exchangeGoogleOAuthCode } from "@/apis/auth";
import { setAuthTokens } from "@/apis/auth/tokenStorage";

const getRequestErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError<{ message?: string }>(error)) {
    return "Google 로그인 처리 중 오류가 발생했습니다.";
  }

  return error.response?.data?.message
    ?? "Google 로그인 처리 중 오류가 발생했습니다.";
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
      const state = searchParams.get("state");

      if (providerError) {
        setError(providerErrorDescription ?? "Google 로그인이 취소되었거나 거부되었습니다.");
        return;
      }

      if (!code) {
        setError("Google 인증 정보가 올바르게 전달되지 않았습니다.");
        return;
      }

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
        router.replace("/main");
      } catch (requestError) {
        setError(getRequestErrorMessage(requestError));
      }
    };

    void completeGoogleLogin();
  }, [router, searchParams]);

  return { error };
}
