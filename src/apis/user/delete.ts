import { apiClient } from "@/apis/client";
import { clearAuthTokens } from "@/apis/auth/tokenStorage";

export const deleteMyAccount = async (): Promise<void> => {
  await apiClient.delete("/users/me");
  clearAuthTokens();
};
