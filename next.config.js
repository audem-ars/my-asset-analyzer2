/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    unoptimized: true
  },
  experimental: {
    appDir: true  // Add this for Next.js 13.4.1
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        net: false,
        tls: false,
        "node:buffer": false,
        "node:util": false,
        "node:stream": false,
        "node:events": false
      },
      alias: {
        '@': '.'
      }
    };
    return config;
  }
};

module.exports = nextConfig;