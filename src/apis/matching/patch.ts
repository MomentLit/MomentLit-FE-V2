import { apiClient } from "@/apis/client";

export const approveMatching = async (matchingId: string): Promise<void> => {
  await apiClient.patch(`/matchings/${encodeURIComponent(matchingId)}/approve`);
};

export const rejectMatching = async (matchingId: string): Promise<void> => {
  await apiClient.patch(`/matchings/${encodeURIComponent(matchingId)}/reject`);
};

export const cancelMatching = async (matchingId: string): Promise<void> => {
  await apiClient.patch(`/matchings/${encodeURIComponent(matchingId)}/cancel`);
};
