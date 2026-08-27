import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Non-hero imagery is served at lower quality to keep the mobile payload
    // down; the hero banner keeps the higher setting.
    qualities: [62, 64, 65, 75, 82],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
