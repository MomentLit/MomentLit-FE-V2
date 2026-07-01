import { apiClient } from "@/apis/client";

export const approveMatching = async (matchingId: number): Promise<void> => {
  await apiClient.patch(`/matchings/${matchingId}/approve`);
};

export const rejectMatching = async (matchingId: number): Promise<void> => {
  await apiClient.patch(`/matchings/${matchingId}/reject`);
};

export const cancelMatching = async (matchingId: number): Promise<void> => {
  await apiClient.patch(`/matchings/${matchingId}/cancel`);
};
