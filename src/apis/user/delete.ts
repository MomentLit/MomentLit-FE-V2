import { apiClient } from "@/apis/client";

export const deleteMyAccount = async (): Promise<void> => {
  await apiClient.delete("/users/me");
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};
