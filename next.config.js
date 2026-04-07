/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "lh3.googleusercontent.com", // Google profile pictures
      },
      {
        protocol: 'https',
        hostname: "example.com", // Competition images
      },
      {
        protocol: 'https',
        hostname: "**", // Allow all external images (optional but not recommended)
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ensure Prisma Client is generated
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Generate Prisma Client on server builds
      const { execSync } = require('child_process');
      execSync('npx prisma generate');
    }
    return config;
  },
};

module.exports = nextConfig;
