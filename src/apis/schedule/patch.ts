import { apiClient } from "@/apis/client";
import type { ScheduleUpdateRequest } from "@/types/schedule";

export const updateSchedule = async (
  spaceId: number,
  scheduleId: number,
  body: ScheduleUpdateRequest
): Promise<void> => {
  await apiClient.patch(`/spaces/${spaceId}/schedule/${scheduleId}`, body);
};
