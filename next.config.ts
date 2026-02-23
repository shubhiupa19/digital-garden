import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/digital-garden",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
