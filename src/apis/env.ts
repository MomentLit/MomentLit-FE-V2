const DEFAULT_API_BASE_URL = "/api";
const DEFAULT_IMAGE_API_BASE_URL = "/image-api";
const DEFAULT_WS_BASE_URL = "";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/$/, "");

export const IMAGE_API_BASE_URL = (
  process.env.NEXT_PUBLIC_IMAGE_API_BASE_URL ?? DEFAULT_IMAGE_API_BASE_URL
).replace(/\/$/, "");

export const WS_BASE_URL = (
  process.env.NEXT_PUBLIC_WS_BASE_URL ?? DEFAULT_WS_BASE_URL
).replace(/\/$/, "");

export const getApiBaseUrl = (): string => {
  return API_BASE_URL;
};
