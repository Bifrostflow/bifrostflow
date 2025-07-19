import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  matcher: ['/((?!api|_next|.*\\..*).*)'], //
  images: {
    remotePatterns: [
      new URL('img.clerk.com'),
      new URL('https://aceternity.com'),
      new URL('img.clerk.com'),
    ],
    domains: ['img.clerk.com', 'https://aceternity.com', 'img.clerk.com'],
  },
};

export default nextConfig;
