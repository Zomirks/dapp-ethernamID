import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  	serverExternalPackages: ["pino", "thread-stream", "pino-pretty"],
};

export default nextConfig;
