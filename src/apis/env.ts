export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
  /\/$/,
  ""
);

export const getApiBaseUrl = (): string => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  return API_BASE_URL;
};
