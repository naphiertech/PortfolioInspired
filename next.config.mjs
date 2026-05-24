/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bryllim.com',
      },
    ],
  },
};

export default nextConfig;

