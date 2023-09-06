/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverActions: true,
    // serverComponentsExternalPackages: ['mongoose'],
  },
};

module.exports = nextConfig;
