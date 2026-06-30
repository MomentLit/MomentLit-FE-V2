import type { ApiResponse } from "../types/common.type";
import type {
  ScheduleCreateRequest,
  ScheduleCreateResponse,
  ScheduleListSearchResponse,
  ScheduleUpdateRequest,
} from "../types/schedule.type";
import { apiClient } from "./client";

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

export const getSchedules = async (
  spaceId: number
): Promise<ApiResponse<{ schedules: ScheduleListSearchResponse[] }>> => {
  const response = await apiClient.get<
    ApiResponse<{ schedules: ScheduleListSearchResponse[] }>
  >(`/spaces/${spaceId}/schedule`);
  return response.data;
};

export const updateSchedule = async (
  spaceId: number,
  scheduleId: number,
  body: ScheduleUpdateRequest
): Promise<void> => {
  await apiClient.patch(`/spaces/${spaceId}/schedule/${scheduleId}`, body);
};

export const deleteSchedule = async (
  spaceId: number,
  scheduleId: number
): Promise<void> => {
  await apiClient.delete(`/spaces/${spaceId}/schedule/${scheduleId}`);
};
