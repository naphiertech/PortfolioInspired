import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  serverExternalPackages: ['ably'],
  outputFileTracingRoot: __dirname,
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

export default nextConfig;
