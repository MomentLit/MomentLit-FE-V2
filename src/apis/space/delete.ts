import { apiClient } from "@/apis/client";

export const deleteSpace = async (spaceId: number): Promise<void> => {
  await apiClient.delete(`/spaces/${spaceId}`);
};
