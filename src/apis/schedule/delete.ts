import { apiClient } from "@/apis/client";

export const deleteSchedule = async (
  spaceId: number,
  scheduleId: number
): Promise<void> => {
  await apiClient.delete(`/spaces/${spaceId}/schedule/${scheduleId}`);
};
