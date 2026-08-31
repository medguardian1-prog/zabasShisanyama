import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // EVERY `quality` value used with next/image must be listed here. An
    // undeclared value builds fine and then throws a client-side exception at
    // runtime, so it is only caught by loading the page in a browser.
    // Lower values are for secondary imagery to keep the mobile payload down;
    // the hero and feature images use the higher end.
    qualities: [62, 64, 65, 75, 78, 80, 82],
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
