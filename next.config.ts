import type { NextConfig } from "next";

const apiBaseUrl = process.env.API_BASE_URL?.replace(/\/$/, "");
const imageApiBaseUrl = process.env.IMAGE_API_BASE_URL?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    const rewrites = [];

    if (apiBaseUrl) {
      rewrites.push({
        source: "/api/:path*",
        destination: `${apiBaseUrl}/:path*`,
      });
    }

    if (imageApiBaseUrl) {
      rewrites.push({
        source: "/image-api/:path*",
        destination: `${imageApiBaseUrl}/:path*`,
      });
    }

    return rewrites;
  },
};

export default nextConfig;
