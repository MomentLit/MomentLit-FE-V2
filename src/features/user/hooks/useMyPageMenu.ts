"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { signOut } from "@/apis/auth";
import {
  clearAuthTokens,
  getRefreshToken,
} from "@/apis/auth/tokenStorage";
import { getMyProfile } from "@/apis/user";
import type { UserSearchResponse } from "@/types/user";

export function useMyPageMenu() {
  const router = useRouter();
  const isRequestingRef = useRef(false);
  const [profile, setProfile] = useState<UserSearchResponse | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const loadProfile = useCallback(async () => {
    if (profile || isRequestingRef.current) return;

    isRequestingRef.current = true;
    setIsProfileLoading(true);
    setProfileError(null);

    try {
      const response = await getMyProfile();
      setProfile(response.data);
    } catch {
      setProfileError("프로필 정보를 불러오지 못했습니다.");
    } finally {
      isRequestingRef.current = false;
      setIsProfileLoading(false);
    }
  }, [profile]);

  const handleSignOut = useCallback(async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    const refreshToken = getRefreshToken();

    try {
      if (refreshToken) {
        await signOut({ refresh_token: refreshToken });
      } else {
        clearAuthTokens();
      }
    } catch {
      clearAuthTokens();
    } finally {
      router.push("/main");
      router.refresh();
      setIsSigningOut(false);
    }
  }, [isSigningOut, router]);

  return {
    handleSignOut,
    isProfileLoading,
    isSigningOut,
    loadProfile,
    profile,
    profileError,
  };
}
