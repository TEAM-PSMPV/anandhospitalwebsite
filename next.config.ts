import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    imageSizes: [16, 32, 48, 64, 96, 120, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
