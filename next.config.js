/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fix for yahoo-finance2 package
    config.resolve.alias = {
      ...config.resolve.alias,
      '../../tests/http/': false,
    };
    
    return config;
  },
  // Add this if you're having API route issues
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // Tell Next.js to exclude API routes from static export
  output: 'standalone',
  experimental: {
    // Explicitly enable App Router API routes
    appDir: true
  }
};

module.exports = nextConfig;