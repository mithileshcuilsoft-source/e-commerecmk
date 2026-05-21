import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // This reduces image size significantly
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;