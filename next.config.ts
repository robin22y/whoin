import type { NextConfig } from "next";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development", // Disable in dev to avoid caching confusion
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  /* 👇 ADD THIS IMAGES BLOCK 👇 */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sadwycupbggsrfxmwehy.supabase.co', // Your Supabase Project Hostname
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  /* 👆 END ADDITION 👆 */
  
  turbopack: {
    root: process.cwd(),
  },
};

export default withPWA(nextConfig);