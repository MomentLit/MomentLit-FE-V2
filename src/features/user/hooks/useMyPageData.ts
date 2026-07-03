"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getAccessToken } from "@/apis/auth/tokenStorage";
import {
  approveMatching,
  getReceivedMatchings,
  rejectMatching,
} from "@/apis/matching";
import { getSpacePopupHistory } from "@/apis/popup";
import { getMySpaces } from "@/apis/space";
import { updateMyProfile } from "@/apis/user";
import type { MatchingListSearchResponse } from "@/types/matching";
import type { SpacePopupHistoryListSearchResponse } from "@/types/popup";
import type { MySpaceListSearchResponse } from "@/types/space";
import type { UserUpdateRequest } from "@/types/user";

import { useMyPageMenu } from "./useMyPageMenu";

export type MyPageTab = "profile" | "spaces" | "matching" | "admin";

export type MyPopupItem = SpacePopupHistoryListSearchResponse & {
  address: string;
  spaceName: string;
};

export function useMyPageData(tab: MyPageTab) {
  const router = useRouter();
  const {
    handleSignOut,
    isProfileLoading,
    isSigningOut,
    loadProfile,
    profile,
    profileError,
  } = useMyPageMenu();
  const [spaces, setSpaces] = useState<MySpaceListSearchResponse[]>([]);
  const [popups, setPopups] = useState<MyPopupItem[]>([]);
  const [matchings, setMatchings] = useState<MatchingListSearchResponse[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }
    void loadProfile();
  }, [loadProfile, router]);

  useEffect(() => {
    if (tab === "admin" && profile && profile.role !== "ADMIN") {
      router.replace("/my");
    }
  }, [profile, router, tab]);

  useEffect(() => {
    if (!getAccessToken() || tab === "profile" || tab === "admin") return;

    let isActive = true;

    const loadTabData = async () => {
      setIsContentLoading(true);
      setContentError(null);

      try {
        if (tab === "matching") {
          const response = await getReceivedMatchings();
          if (isActive) setMatchings(response.data.matchings);
          return;
        }

        const [spaceResponse, matchingResponse] = await Promise.all([
          getMySpaces(),
          getReceivedMatchings(),
        ]);
        const nextSpaces = spaceResponse.data.spaces;
        const popupResults = await Promise.allSettled(
          nextSpaces.map(async (space) => {
            const response = await getSpacePopupHistory(space.space_id);
            return response.data.popups.map((popup) => ({
              ...popup,
              address: space.address.road_address,
              spaceName: space.name,
            }));
          }),
        );

        if (isActive) {
          setSpaces(nextSpaces);
          setMatchings(matchingResponse.data.matchings);
          setPopups(
            popupResults.flatMap((result) =>
              result.status === "fulfilled" ? result.value : [],
            ),
          );
        }
      } catch {
        if (isActive) setContentError("마이페이지 정보를 불러오지 못했습니다.");
      } finally {
        if (isActive) setIsContentLoading(false);
      }
    };

    void loadTabData();
    return () => {
      isActive = false;
    };
  }, [tab]);

  const saveProfile = useCallback(async (body: UserUpdateRequest) => {
    await updateMyProfile(body);
    await loadProfile(true);
  }, [loadProfile]);

  const decideMatching = useCallback(async (
    matchingId: number,
    decision: "approve" | "reject",
  ) => {
    if (decision === "approve") await approveMatching(matchingId);
    else await rejectMatching(matchingId);

    setMatchings((current) => current.map((matching) =>
      matching.matching_id === matchingId
        ? { ...matching, status: decision === "approve" ? "APPROVED" : "REJECTED" }
        : matching,
    ));
  }, []);

  return {
    contentError,
    decideMatching,
    handleSignOut,
    isContentLoading,
    isProfileLoading,
    isSigningOut,
    loadProfile,
    matchings,
    popups,
    profile,
    profileError,
    saveProfile,
    spaces,
  };
}
