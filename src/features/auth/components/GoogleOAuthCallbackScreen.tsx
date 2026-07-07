"use client";

import Link from "next/link";

import type { OAuthGoogleCallbackResult } from "@/types/auth";

import { useGoogleOAuthCallback } from "../hooks/useGoogleOAuthCallback";

type GoogleOAuthCallbackScreenProps = {
  result: OAuthGoogleCallbackResult;
};

export default function GoogleOAuthCallbackScreen({
  result,
}: GoogleOAuthCallbackScreenProps) {
  const { error } = useGoogleOAuthCallback(result);

  return (
    <main className="grid min-h-screen place-items-center bg-[#EEEEEE] px-[24px]">
      <section className="flex w-full max-w-[420px] flex-col items-center gap-[20px] rounded-[16px] bg-white px-[32px] py-[48px] text-center">
        {error ? (
          <>
            <h1 className="text-[24px] font-semibold text-[#222831]">로그인에 실패했습니다</h1>
            <p aria-live="polite" className="text-[15px] text-[#DA294A]">
              {error}
            </p>
            <Link
              className="rounded-[12px] bg-[#00ADB5] px-[24px] py-[14px] font-semibold text-white transition-colors hover:bg-[#00979E]"
              href="/login"
            >
              로그인으로 돌아가기
            </Link>
          </>
        ) : (
          <>
            <span
              aria-hidden
              className="size-[40px] animate-spin rounded-full border-[4px] border-[#D0D3DB] border-t-[#00ADB5]"
            />
            <h1 className="text-[24px] font-semibold text-[#222831]">Google 로그인 중입니다</h1>
            <p className="text-[15px] text-[#67728A]">잠시만 기다려주세요.</p>
          </>
        )}
      </section>
    </main>
  );
}
