import type { NextConfig } from "next";

const apiBaseUrl =
  process.env.API_BASE_URL?.replace(/\/$/, "") ??
  "https://mo-d6a1ab80847946e8b30b1bf705b196c8.ecs.ap-northeast-2.on.aws";

const nextConfig: NextConfig = {
  async rewrites() {
    if (!apiBaseUrl) return [];

    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
