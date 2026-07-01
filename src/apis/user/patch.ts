import { apiClient } from "@/apis/client";
import type { UserUpdateRequest } from "@/types/user";

export const updateMyProfile = async (
  body: UserUpdateRequest
): Promise<void> => {
  await apiClient.patch("/users/me", body);
};
