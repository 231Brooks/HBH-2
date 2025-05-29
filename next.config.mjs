/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/**/*',
        'public/**/*',
        'scripts/**/*',
        'docs/**/*',
        '__tests__/**/*',
        'e2e/**/*',
        'load-tests/**/*',
        'prisma/**/*',
      ],
    },
  },
}

export default nextConfig;
