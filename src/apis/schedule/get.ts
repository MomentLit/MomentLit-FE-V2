import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";
import type { ScheduleListSearchResponse } from "@/types/schedule";

type SpaceScheduleResponse = {
  schedule_id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
};

type ScheduleResponse = ScheduleListSearchResponse | SpaceScheduleResponse;

const toDateTime = (date: string, time: string) => {
  if (time.includes("T")) return time;
  return `${date}T${time}`;
};

const isSpaceScheduleResponse = (
  schedule: ScheduleResponse,
): schedule is SpaceScheduleResponse => "schedule_id" in schedule;

const normalizeSchedules = (
  schedules: ScheduleResponse[],
): ScheduleListSearchResponse[] => {
  if (schedules.every((schedule) => !isSpaceScheduleResponse(schedule))) {
    return schedules as ScheduleListSearchResponse[];
  }

  return schedules.map((schedule) => {
    if (!isSpaceScheduleResponse(schedule)) return schedule;

    return {
      date: schedule.date,
      time_blocks: [
        {
          end_time: toDateTime(schedule.date, schedule.end_time),
          schedule_id: schedule.schedule_id,
          start_time: toDateTime(schedule.date, schedule.start_time),
          status: schedule.is_booked ? "BOOKED" : "AVAILABLE",
        },
      ],
    };
  });
};

export const getSchedules = async (
  spaceId: number
): Promise<ApiResponse<{ schedules: ScheduleListSearchResponse[] }>> => {
  const response = await apiClient.get<
    ApiResponse<{ schedules: ScheduleResponse[] }>
  >(`/spaces/${spaceId}/schedule`);
  return {
    ...response.data,
    data: {
      schedules: normalizeSchedules(response.data.data.schedules),
    },
  };
};
