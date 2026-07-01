"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { signUp } from "@/apis/user";
import type { SignUpRequest } from "@/types/user";

export function useSignup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (body: SignUpRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      await signUp(body);
      router.push("/login");
    } catch {
      setError("회원가입에 실패했습니다. 입력 정보를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, signup };
}
