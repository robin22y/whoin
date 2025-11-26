import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // Disable in dev mode
});

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Set root to current directory to avoid lockfile warning
    root: process.cwd(),
  },
};

export default withPWA(nextConfig);