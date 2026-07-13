"use client";

import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getAccessToken } from "@/apis/auth/tokenStorage";
import { createChatRoom } from "@/apis/chat";
import { createMatching } from "@/apis/matching";
import { getSchedules } from "@/apis/schedule";
import { deleteSpace, getMySpaces, getSpaceDetail, getSpaces } from "@/apis/space";
import { getMyProfile } from "@/apis/user";
import type { ScheduleListSearchResponse } from "@/types/schedule";
import type { SpaceDetailSearchResponse, SpaceListSearchResponse } from "@/types/space";
import type { UserSearchResponse } from "@/types/user";

export function useSpaceDetail(spaceId: number) {
  const [space, setSpace] = useState<SpaceDetailSearchResponse | null>(null);
  const [schedules, setSchedules] = useState<ScheduleListSearchResponse[]>([]);
  const [relatedSpaces, setRelatedSpaces] = useState<SpaceListSearchResponse[]>([]);
  const [ownerProfile, setOwnerProfile] = useState<UserSearchResponse | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRequestingMatching, setIsRequestingMatching] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadSpace = async () => {
      if (!Number.isInteger(spaceId) || spaceId <= 0) {
        setError("잘못된 공간 번호입니다.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setActionError(null);
      setActionMessage(null);
      setIsOwner(false);
      setOwnerProfile(null);

      try {
        const detailResponse = await getSpaceDetail(spaceId);
        if (!isActive) return;
        setSpace(detailResponse.data);
        const hasAccessToken = Boolean(getAccessToken());

        const [scheduleResult, spacesResult, ownerResult, profileResult] = await Promise.allSettled([
          getSchedules(spaceId),
          getSpaces({ category: detailResponse.data.category || undefined }),
          hasAccessToken ? getMySpaces() : Promise.resolve(null),
          hasAccessToken ? getMyProfile() : Promise.resolve(null),
        ]);

        if (!isActive) return;
        if (scheduleResult.status === "fulfilled") {
          setSchedules(scheduleResult.value.data.schedules);
        }
        if (spacesResult.status === "fulfilled") {
          setRelatedSpaces(
            spacesResult.value.data.spaces
              .filter((item) => item.space_id !== spaceId)
              .slice(0, 4),
          );
        }
        if (ownerResult.status === "fulfilled") {
          const nextIsOwner = Boolean(ownerResult.value?.data.spaces.some((item) => item.space_id === spaceId));
          setIsOwner(nextIsOwner);

          if (nextIsOwner && profileResult.status === "fulfilled") {
            setOwnerProfile(profileResult.value?.data ?? null);
          }
        }
      } catch {
        if (isActive) setError("공간 정보를 불러오지 못했습니다.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadSpace();
    return () => {
      isActive = false;
    };
  }, [spaceId]);

  const deleteCurrentSpace = useCallback(async () => {
    if (!isOwner || isDeleting) return false;

    setIsDeleting(true);
    setActionError(null);

    try {
      await deleteSpace(spaceId);
      return true;
    } catch {
      setActionError("공간을 삭제하지 못했습니다.");
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting, isOwner, spaceId]);

  const requestMatching = useCallback(async () => {
    if (!space || isOwner || isRequestingMatching) return null;

    if (!getAccessToken()) {
      setActionError("로그인 후 공간 문의를 보낼 수 있습니다.");
      setActionMessage(null);
      return null;
    }

    const availableBlock = schedules
      .flatMap((schedule) => schedule.time_blocks)
      .filter((block) => block.status === "AVAILABLE")
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())[0];

    if (!availableBlock) {
      setActionError("예약 가능한 일정이 없어 문의를 보낼 수 없습니다.");
      setActionMessage(null);
      return null;
    }

    const startTime = new Date(availableBlock.start_time);
    const endTime = new Date(availableBlock.end_time);
    const durationHour = Math.max(1, (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
    const totalPrice = Number.isFinite(durationHour)
      ? String(Math.round(space.price_per_hour * durationHour))
      : String(space.price_per_hour);

    setIsRequestingMatching(true);
    setActionError(null);
    setActionMessage(null);

    try {
      const response = await createMatching({
        space_id: space.space_id,
        start_time: availableBlock.start_time,
        end_time: availableBlock.end_time,
        total_price: totalPrice,
      });
      setActionMessage("공간 문의를 보냈습니다.");
      return response.data.matching_id;
    } catch (requestError) {
      const message = axios.isAxiosError<{ message?: string }>(requestError)
        ? requestError.response?.data?.message
        : undefined;
      setActionError(message ?? "공간 문의를 보내지 못했습니다.");
      return null;
    } finally {
      setIsRequestingMatching(false);
    }
  }, [isOwner, isRequestingMatching, schedules, space]);

  const startChat = useCallback(async () => {
    if (!space || isOwner || isStartingChat) return null;

    setIsStartingChat(true);
    setActionError(null);

    try {
      const response = await createChatRoom({ space_id: space.space_id });
      return response.data.chat_room_id;
    } catch (requestError) {
      const message = axios.isAxiosError<{ message?: string }>(requestError)
        ? requestError.response?.data?.message
        : undefined;
      setActionError(message ?? "채팅방을 여는데 실패했습니다.");
      return null;
    } finally {
      setIsStartingChat(false);
    }
  }, [isOwner, isStartingChat, space]);

  const scheduleSummary = useMemo(() => {
    const dates = schedules
      .map((schedule) => new Date(`${schedule.date}T00:00:00`))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());
    const baseDate = dates[0] ?? new Date();
    const format = new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric" });

    return {
      year: baseDate.getFullYear(),
      month: baseDate.getMonth() + 1,
      selectedDays: dates
        .filter((date) => date.getFullYear() === baseDate.getFullYear() && date.getMonth() === baseDate.getMonth())
        .map((date) => date.getDate()),
      range: dates.length > 0
        ? `${format.format(dates[0])} - ${format.format(dates[dates.length - 1])}`
        : "일정 미등록",
    };
  }, [schedules]);

  return {
    actionError,
    actionMessage,
    deleteCurrentSpace,
    error,
    isDeleting,
    isLoading,
    isOwner,
    isRequestingMatching,
    isStartingChat,
    ownerProfile,
    relatedSpaces,
    requestMatching,
    scheduleSummary,
    space,
    startChat,
  };
}
