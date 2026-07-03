"use client";

import { useEffect, useMemo, useState } from "react";

import { getSchedules } from "@/apis/schedule";
import { getSpaceDetail, getSpaces } from "@/apis/space";
import type { ScheduleListSearchResponse } from "@/types/schedule";
import type { SpaceDetailSearchResponse, SpaceListSearchResponse } from "@/types/space";

export function useSpaceDetail(spaceId: number) {
  const [space, setSpace] = useState<SpaceDetailSearchResponse | null>(null);
  const [schedules, setSchedules] = useState<ScheduleListSearchResponse[]>([]);
  const [relatedSpaces, setRelatedSpaces] = useState<SpaceListSearchResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      try {
        const detailResponse = await getSpaceDetail(spaceId);
        if (!isActive) return;
        setSpace(detailResponse.data);

        const [scheduleResult, spacesResult] = await Promise.allSettled([
          getSchedules(spaceId),
          getSpaces({ category: detailResponse.data.category || undefined }),
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

  return { error, isLoading, relatedSpaces, scheduleSummary, space };
}
