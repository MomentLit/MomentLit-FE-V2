import axios from "axios";

import { IMAGE_API_BASE_URL } from "@/apis/env";
import type { ApiResponse } from "@/types/common";

type ImageUploadResponse = {
  image_url: string;
};

const imageApiClient = axios.create({
  baseURL: IMAGE_API_BASE_URL,
});

export const uploadImage = async (
  file: File
): Promise<ApiResponse<ImageUploadResponse>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await imageApiClient.post<ApiResponse<ImageUploadResponse>>(
    "/images/upload",
    formData,
  );

  return response.data;
};
