"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getAccessToken } from "@/apis/auth/tokenStorage";
import { getReceivedMatchings, getSentMatchings } from "@/apis/matching";
import type { ChatRoom } from "@/types/chat";
import type { MatchingListSearchResponse } from "@/types/matching";

const getApplicantName = (matching: MatchingListSearchResponse) =>
  matching.applicant_name?.trim()
    || matching.requester_name?.trim()
    || matching.user_name?.trim()
    || "신청자 정보 없음";

const getSpaceLabel = (matching: MatchingListSearchResponse) =>
  matching.space_name?.trim()
    || matching.desired_space_name?.trim()
    || matching.address?.trim()
    || "공간 정보 없음";

const toReceivedRoom = (matching: MatchingListSearchResponse): ChatRoom => ({
  createdAt: matching.created_at,
  direction: "received",
  matchingId: matching.matching_id,
  status: matching.status,
  subtitle: getSpaceLabel(matching),
  title: getApplicantName(matching),
});

const toSentRoom = (matching: MatchingListSearchResponse): ChatRoom => ({
  createdAt: matching.created_at,
  direction: "sent",
  matchingId: matching.matching_id,
  status: matching.status,
  subtitle: "공간 운영자에게 보낸 문의",
  title: getSpaceLabel(matching),
});

export function useChatRooms() {
  const router = useRouter();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }

    let isActive = true;

    const loadRooms = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [receivedResponse, sentResponse] = await Promise.all([
          getReceivedMatchings(),
          getSentMatchings(),
        ]);
        if (!isActive) return;

        const nextRooms = [
          ...receivedResponse.data.matchings.map(toReceivedRoom),
          ...sentResponse.data.matchings.map(toSentRoom),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setRooms(nextRooms);
      } catch {
        if (isActive) setError("메시지를 불러오지 못했습니다.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadRooms();
    return () => {
      isActive = false;
    };
  }, [router]);

  return { error, isLoading, rooms };
}
