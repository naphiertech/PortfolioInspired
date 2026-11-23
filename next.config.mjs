import path from 'path';
import { fileURLToPath } from 'url';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Isolate dev server artifacts (.next-dev) from production builds (.next)
 * so running `npm run build` never corrupts a live `next dev` server.
 *
 * @param {string} phase
 * @returns {import('next').NextConfig}
 */
export default function createNextConfig(phase) {
  return {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    htmlLimitedBots: /.*/,
    serverExternalPackages: ['ably'],
    outputFileTracingRoot: __dirname,
    outputFileTracingIncludes: {
      '/components/[slug]': [
        './src/components/ReadingShelf.tsx',
        './src/components/ReadingShelf.module.css',
        './src/components/BookSpine.tsx',
        './src/lib/readingShelfData.ts',
        './src/components/ContributionTruck.tsx',
        './src/components/ContributionTruck.module.css',
        './src/components/FloatingTerrain.tsx',
        './src/components/FloatingTerrain.module.css',
        './src/lib/motion.ts',
        './src/components/showcase/ThanosGauntletSandbox.tsx',
        './src/components/GauntletTrigger.module.css',
        './src/components/showcase/AICompanionWidget.tsx',
        './src/components/RocketMountain.tsx',
        './src/components/RocketMountain.module.css',
      ],
    },
    experimental: {
      inlineCss: true,
      optimizePackageImports: [
        'lucide-react',
        'react-icons',
        '@radix-ui/react-avatar',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-tooltip',
      ],
    },
    env: {
      NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    },
    images: {
      formats: ['image/avif', 'image/webp'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'www.naphierawalie.tech',
        },
        {
          protocol: 'https',
          hostname: 'naphierawalie.tech',
        },
        {
          protocol: 'https',
          hostname: 'naphiernode.vercel.app',
        },
        {
          protocol: 'https',
          hostname: 'm.media-amazon.com',
        },
      ],
    },
    async redirects() {
      return [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'naphiernode.vercel.app',
            },
          ],
          destination: 'https://www.naphierawalie.tech/:path*',
          permanent: true,
        },
      ];
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN',
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), geolocation=(), microphone=(self)',
            },
          ],
        },
      ];
    },
  };
}
