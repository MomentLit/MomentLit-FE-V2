import { apiClient } from "@/apis/client";
import type { SpaceUpdateRequest } from "@/types/space";

export const updateSpace = async (
  spaceId: number,
  body: SpaceUpdateRequest
): Promise<void> => {
  await apiClient.patch(`/spaces/${spaceId}`, body);
};
