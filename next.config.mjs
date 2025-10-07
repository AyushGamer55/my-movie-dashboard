/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
const { env } = await import('./src/env.mjs');

/** @type {import("next").NextConfig} */
const config = {
  output: 'standalone',
  reactStrictMode: true,

  // i18n configuration removed - not supported in App Router
  // Use next-intl or similar library for internationalization in App Router

  images: {
    unoptimized: !env.NEXT_PUBLIC_IMAGE_DOMAIN,
    domains: [env.NEXT_PUBLIC_IMAGE_DOMAIN ?? 'image.tmdb.org'],
    imageSizes: [48, 64, 96],
    deviceSizes: [128, 256, 512, 1200],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Enable parallel builds
    webpackBuildWorker: true,
  },

  // Fix for multiple lockfiles warning - explicitly set the output file tracing root
  outputFileTracingRoot: process.cwd(),
};

export default config;
