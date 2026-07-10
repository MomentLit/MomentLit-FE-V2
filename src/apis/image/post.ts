import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";

type ImageUploadResponse = {
  image_url: string;
};

export const uploadImage = async (
  file: File
): Promise<ApiResponse<ImageUploadResponse>> => {
  const response = await apiClient.postForm<ApiResponse<ImageUploadResponse>>(
    "/images/upload",
    { file },
  );

  return response.data;
};
