import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  matcher: ['/((?!api|_next|.*\\..*).*)'], //
};

export default nextConfig;
