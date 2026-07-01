import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";
import type {
  ScheduleCreateRequest,
  ScheduleCreateResponse,
} from "@/types/schedule";

export const createSchedule = async (
  spaceId: number,
  body: ScheduleCreateRequest
): Promise<ApiResponse<ScheduleCreateResponse>> => {
  const response = await apiClient.post<ApiResponse<ScheduleCreateResponse>>(
    `/spaces/${spaceId}/schedule`,
    body
  );
  return response.data;
};
