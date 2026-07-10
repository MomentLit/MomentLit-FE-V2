import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";

type ImageUploadResponse = {
  image_url: string;
};

export const uploadImage = async (
  file: File
): Promise<ApiResponse<ImageUploadResponse>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ApiResponse<ImageUploadResponse>>(
    "/images/upload",
    formData,
  );

  return response.data;
};
