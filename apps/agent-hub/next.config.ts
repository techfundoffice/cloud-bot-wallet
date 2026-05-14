import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The CDP SDK uses Node.js APIs; mark it server-only
  serverExternalPackages: ["@coinbase/cdp-sdk"],
};

export default nextConfig;
