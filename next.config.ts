import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Libera o Next a carregar imagens deste site (Unsplash)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;