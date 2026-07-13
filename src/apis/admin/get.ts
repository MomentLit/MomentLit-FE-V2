import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";
import type { MySpaceListSearchResponse } from "@/types/space";

export const getAdminSpaces = async (): Promise<ApiResponse<{ spaces: MySpaceListSearchResponse[] }>> => {
  const response = await apiClient.get<ApiResponse<{ spaces: MySpaceListSearchResponse[] }>>(
    "/spaces/me",
  );
  return response.data;
};
