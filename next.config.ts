import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  experimental: {
    // Serialize static generation to prevent Next.js workStore race condition.
    // Without this, concurrent page renders fight over the internal store,
    // causing "Expected workStore to be initialized" build failures.
    staticGenerationMaxConcurrency: 1,
    staticGenerationRetryCount: 3,
  },
};

export default withNextIntl(nextConfig);
