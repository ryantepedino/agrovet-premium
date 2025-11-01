/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Desativa completamente o Turbopack
  experimental: {
    turbo: false,
  },

  // ✅ Força compilação do recharts como client-side
  transpilePackages: ['recharts'],

  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    }
    return config
  },
}

export default nextConfig
