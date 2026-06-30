import { apiClient } from "./client";

export const adminApproveSpace = async (id: string): Promise<void> => {
  await apiClient.patch(`/admin/spaces/${id}/approve`);
};

export const adminRejectSpace = async (id: string): Promise<void> => {
  await apiClient.patch(`/admin/spaces/${id}/reject`);
};
