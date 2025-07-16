import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  matcher: ['/((?!api|_next|.*\\..*).*)'], //
  images: {
    remotePatterns: [
      new URL('img.clerk.com'),
      new URL('https://aceternity.com'),
    ],
    domains: ['img.clerk.com', 'https://aceternity.com/'],
  },
};

export default nextConfig;
