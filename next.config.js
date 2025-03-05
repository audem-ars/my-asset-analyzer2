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
};

module.exports = nextConfig;