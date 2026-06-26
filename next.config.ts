import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid double-mounting WebGL canvases in dev (React Strict Mode exhausts GPU contexts).
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Keep dev pages warm longer — reduces Windows HMR cache churn (#91797)
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  ...(process.env.NEXT_WEBPACK_DEV === "1"
    ? {
        webpack: (config, { dev }) => {
          if (dev) {
            // Filesystem webpack cache corrupts on Windows during hot reload.
            config.cache = { type: "memory" };
          }
          return config;
        },
      }
    : {}),
};

export default nextConfig;
