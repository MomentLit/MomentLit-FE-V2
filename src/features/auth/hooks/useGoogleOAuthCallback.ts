"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
      const state = searchParams.get("state") ?? undefined;
      const expectedState = sessionStorage.getItem(OAUTH_STATE_KEY);

      if (expectedState && state !== expectedState) {
        setError("Google 로그인 요청을 확인할 수 없습니다. 다시 시도해주세요.");
        return;
      }

      if (!accessToken || !refreshToken) {
        setError("Google 로그인 이후 토큰 전달 방식 확인이 필요합니다.");
        return;
      }

      setAuthTokens(accessToken, refreshToken);
      sessionStorage.removeItem(OAUTH_STATE_KEY);
      router.replace("/main");
    };

    void completeLogin();
  }, [router, searchParams]);

  return { error };
}
