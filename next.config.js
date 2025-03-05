/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  // This tells Next.js to export the app as static HTML/CSS/JS
  output: 'export',
  // Images need to be unoptimized for static export
  images: {
    unoptimized: true,
  },
  // Fix for yahoo-finance2 package
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '../../tests/http/': false,
    };
    
    return config;
  }
  // Remove the rewrites section, it's not compatible with static export
};

module.exports = nextConfig;