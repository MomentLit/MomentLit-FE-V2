"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { signIn } from "@/apis/auth";
import { setAuthTokens } from "@/apis/auth/tokenStorage";
import type { SignInRequest } from "@/types/auth";

export function useLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (body: SignInRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await signIn(body);
      setAuthTokens(response.data.access_token, response.data.refresh_token);
      router.push("/main");
    } catch (requestError) {
      const status = axios.isAxiosError(requestError)
        ? requestError.response?.status
        : undefined;
      setError(
        status === 401
          ? "이메일 또는 비밀번호를 확인해주세요."
          : "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, login };
}
