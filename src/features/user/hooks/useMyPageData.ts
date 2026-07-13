"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { getAccessToken } from "@/apis/auth/tokenStorage";
import {
  approveMatching,
  getReceivedMatchings,
  getSentMatchings,
  rejectMatching,
} from "@/apis/matching";
import { getSpacePopupHistory } from "@/apis/popup";
import { deleteSpace, getMySpaces } from "@/apis/space";
import { getSpaceDetail } from "@/apis/space";
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

const enrichMatchingsWithSpaceName = async (
  matchings: MatchingListSearchResponse[],
): Promise<MatchingListSearchResponse[]> => {
  const spaceIds = Array.from(
    new Set(
      matchings
        .map((matching) => getMatchingSpaceId(matching))
        .filter((spaceId): spaceId is number => typeof spaceId === "number"),
    ),
  );

  if (spaceIds.length === 0) return matchings;

  const results = await Promise.allSettled(
    spaceIds.map(async (spaceId) => {
      const response = await getSpaceDetail(spaceId);
      return [spaceId, response.data.name] as const;
    }),
  );
  const spaceNameMap = new Map(
    results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []),
  );

  return matchings.map((matching) => ({
    ...matching,
    space_name: matching.space_name ?? (getMatchingSpaceId(matching) ? spaceNameMap.get(getMatchingSpaceId(matching) as number) : undefined),
  }));
};

type MatchingWithSpaceFields = MatchingListSearchResponse & {
  space?: {
    id?: number;
    space_id?: number;
  };
  spaceId?: number;
};

const getMatchingSpaceId = (matching?: MatchingListSearchResponse): number | undefined => {
  if (!matching) return undefined;

  const candidate = matching as MatchingWithSpaceFields;
  return candidate.space_id
    ?? candidate.spaceId
    ?? candidate.space?.space_id
    ?? candidate.space?.id;
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
  const [adminMatchings, setAdminMatchings] = useState<MatchingListSearchResponse[]>([]);
  const [popups, setPopups] = useState<MyPopupItem[]>([]);
  const [matchings, setMatchings] = useState<MatchingListSearchResponse[]>([]);
  const [sentMatchings, setSentMatchings] = useState<MatchingListSearchResponse[]>([]);
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
    if (!getAccessToken() || tab === "profile") return;
    if (tab === "admin" && profile?.role !== "ADMIN") return;

    let isActive = true;

    const loadTabData = async () => {
      setIsContentLoading(true);
      setContentError(null);

      try {
        if (tab === "admin") {
          const response = await getReceivedMatchings();
          const nextMatchings = await enrichMatchingsWithSpaceName(response.data.matchings);

          if (isActive) {
            setAdminMatchings(nextMatchings);
          }
          return;
        }

        if (tab === "matching") {
          const [receivedResponse, sentResponse] = await Promise.all([
            getReceivedMatchings(),
            getSentMatchings(),
          ]);
          const [receivedMatchings, sentMatchings] = await Promise.all([
            enrichMatchingsWithSpaceName(receivedResponse.data.matchings),
            enrichMatchingsWithSpaceName(sentResponse.data.matchings),
          ]);

          if (isActive) {
            setMatchings(receivedMatchings);
            setSentMatchings(sentMatchings);
          }
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
  }, [profile?.role, tab]);

  const saveProfile = useCallback(async (body: UserUpdateRequest) => {
    await updateMyProfile(body);
    await loadProfile(true);
  }, [loadProfile]);

  const decideMatching = useCallback(async (
    matchingId: number,
    decision: "approve" | "reject",
  ) => {
    try {
      if (decision === "approve") await approveMatching(matchingId);
      else await rejectMatching(matchingId);
    } catch (requestError) {
      const message = axios.isAxiosError<{ message?: string }>(requestError)
        ? requestError.response?.data?.message
        : undefined;
      throw new Error(message ?? "매칭 요청을 처리하지 못했습니다.");
    }

    setMatchings((current) => current.map((matching) =>
      matching.matching_id === matchingId
        ? { ...matching, status: decision === "approve" ? "APPROVED" : "REJECTED" }
        : matching,
    ));
  }, []);

  const removeSpace = useCallback(async (spaceId: number) => {
    await deleteSpace(spaceId);
    setSpaces((current) => current.filter((space) => space.space_id !== spaceId));
  }, []);

  const decideAdminSpace = useCallback(async (
    matchingId: number,
    decision: "approve" | "reject",
  ) => {
    try {
      if (decision === "approve") await approveMatching(matchingId);
      else await rejectMatching(matchingId);
    } catch (requestError) {
      const message = axios.isAxiosError<{ message?: string }>(requestError)
        ? requestError.response?.data?.message
        : undefined;
      throw new Error(message ?? "매칭 요청을 처리하지 못했습니다.");
    }

    setAdminMatchings((current) => current.map((matching) =>
      matching.matching_id === matchingId
        ? { ...matching, status: decision === "approve" ? "APPROVED" : "REJECTED" }
        : matching,
    ));
  }, []);

  return {
    adminMatchings,
    contentError,
    decideAdminSpace,
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
    removeSpace,
    saveProfile,
    sentMatchings,
    spaces,
  };
}
