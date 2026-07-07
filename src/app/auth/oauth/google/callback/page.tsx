import { cookies } from "next/headers";
import { Suspense } from "react";

import { OAUTH_STATE_KEY } from "@/apis/auth/get";
import GoogleOAuthCallbackScreen from "@/features/auth/components/GoogleOAuthCallbackScreen";
import type { OAuthGoogleCallbackResponse } from "@/types/auth";
import type { OAuthGoogleCallbackResult } from "@/types/auth";
import type { ApiResponse } from "@/types/common";

type GoogleOAuthCallbackPageProps = {
  searchParams: Promise<{
    code?: string;
    state?: string;
  }>;
};

const getBackendApiBaseUrl = (): string | null =>
  process.env.API_BASE_URL?.replace(/\/$/, "") ?? null;

const exchangeGoogleCode = async (
  code: string | undefined,
  state: string | undefined
): Promise<OAuthGoogleCallbackResult> => {
  if (!code) {
    return { error: "Google 로그인 이후 인증 코드가 전달되지 않았습니다." };
  }

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(OAUTH_STATE_KEY)?.value;
  if (expectedState && state !== expectedState) {
    return { error: "Google 로그인 요청을 확인할 수 없습니다. 다시 시도해주세요." };
  }

  const apiBaseUrl = getBackendApiBaseUrl();
  if (!apiBaseUrl) {
    return { error: "API 서버 주소가 설정되지 않았습니다." };
  }

  const params = new URLSearchParams({ code });
  if (state) params.set("state", state);

  try {
    const response = await fetch(
      `${apiBaseUrl}/auth/oauth/google/callback?${params.toString()}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );
    const body = await response
      .json()
      .catch(() => null) as ApiResponse<OAuthGoogleCallbackResponse> | null;

    if (!response.ok || !body?.data) {
      return {
        error: body?.message ?? "Google 로그인 처리 중 오류가 발생했습니다.",
      };
    }

    return { data: body.data };
  } catch {
    return { error: "Google 로그인 처리 중 오류가 발생했습니다." };
  }
};

export default async function GoogleOAuthCallbackPage({
  searchParams,
}: GoogleOAuthCallbackPageProps) {
  const params = await searchParams;
  const result = await exchangeGoogleCode(params.code, params.state);

  return (
    <Suspense fallback={null}>
      <GoogleOAuthCallbackScreen result={result} />
    </Suspense>
  );
}
