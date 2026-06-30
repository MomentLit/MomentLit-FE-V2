import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";
import type { ScheduleListSearchResponse } from "@/types/schedule";

export const getSchedules = async (
  spaceId: number
): Promise<ApiResponse<{ schedules: ScheduleListSearchResponse[] }>> => {
  const response = await apiClient.get<
    ApiResponse<{ schedules: ScheduleListSearchResponse[] }>
  >(`/spaces/${spaceId}/schedule`);
  return response.data;
};
