/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify is no longer a valid option in Next.js 15+ and will be ignored.
  // Remove or comment out the line below to avoid warnings.
  // swcMinify: true, 
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // If you are using the /app directory for routing, you must enable this:
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
