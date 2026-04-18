import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  experimental: {
    // Workaround for Next.js 16 Turbopack workStore race condition
    // during concurrent static page generation
    staticGenerationRetryCount: 5,
  },
};

export default nextConfig;
