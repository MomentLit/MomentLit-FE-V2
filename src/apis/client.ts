import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          if (!refreshPromise) {
            refreshPromise = axios
              .post(`${BASE_URL}/auth/refresh`, {
                refresh_token: refreshToken,
              })
              .then((res) => {
                const newAccessToken = res.data.data.access_token;
                const newRefreshToken = res.data.data.refresh_token;
                localStorage.setItem("access_token", newAccessToken);
                localStorage.setItem("refresh_token", newRefreshToken);
                return newAccessToken;
              })
              .finally(() => {
                refreshPromise = null;
              });
          }

          const newAccessToken = await refreshPromise;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }
    }

    return Promise.reject(error);
  }
);
