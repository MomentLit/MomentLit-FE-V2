import axios from "axios";

import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "@/apis/auth/tokenStorage";
import { API_BASE_URL } from "@/apis/env";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const PUBLIC_ENDPOINTS = [
  "/auth/signin",
  "/auth/oauth/google",
  "/users/signup",
];

const isPublicEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some((endpoint) => url.startsWith(endpoint));
};

apiClient.interceptors.request.use((config) => {
  if (isPublicEndpoint(config.url)) return config;

  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

const forceLogout = (): void => {
  clearAuthTokens();
  if (typeof window === "undefined") return;
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      typeof window === "undefined" ||
      isPublicEndpoint(originalRequest?.url)
    ) {
      return Promise.reject(error);
    }

    // Access token was already refreshed once for this request and still
    // got a 401 back — the session is truly expired, log the user out.
    if (originalRequest._retry) {
      forceLogout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      forceLogout();
      return Promise.reject(error);
    }

    try {
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          })
          .then((res) => {
            const newAccessToken = res.data.data.access_token;
            const newRefreshToken = res.data.data.refresh_token;
            setAuthTokens(newAccessToken, newRefreshToken);
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
      // Refresh token itself is invalid/expired — log the user out.
      forceLogout();
      return Promise.reject(error);
    }
  }
);
