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
  // Increase timeout for API calls in development
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  // Configure allowed development origins for Next.js 15
  allowedDevOrigins: ['localhost', '127.0.0.1', '10.80.162.246'],
  // Enable React strict mode for better development experience
  reactStrictMode: true,
}

module.exports = nextConfig