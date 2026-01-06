import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: "build/web",
  typescript: {
    tsconfigPath: "tsconfig.json",
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ["icon-library"],
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
