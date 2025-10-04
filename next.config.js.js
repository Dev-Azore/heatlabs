// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress specific source map warnings in development
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Optional: Disable TypeScript errors during build if you want to deploy while fixing
  // typescript: {
  //   ignoreBuildErrors: false, // Set to true temporarily if needed, but fix properly
  // },
  // Optional: Disable ESLint during build
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
}

module.exports = nextConfig