/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '../../tests/http/': false,
    };
    return config;
  },
  // Disable app directory API routes
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: [],
  }
};

module.exports = nextConfig;