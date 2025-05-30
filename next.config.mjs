/** @type {import('next').NextConfig} */
const nextConfig = {
  // Core Next.js settings
  reactStrictMode: true,
  swcMinify: true,
  
  // Build and performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // ESLint and TypeScript settings
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['app', 'components', 'lib', 'hooks'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.stripe.com https://res.cloudinary.com https://*.supabase.co wss://*.supabase.co https://*.pusher.com wss://*.pusher.com; frame-src https://js.stripe.com https://hooks.stripe.com;"
          }
        ],
      },
    ]
  },
  
  // Redirects for SEO and user experience
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/profile',
        permanent: false,
      },
    ]
  },
  
  // Bundle optimization
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'date-fns',
    ],
    outputFileTracingExcludes: {
      '*': [
        // Node.js native modules that shouldn't be bundled
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
        'node_modules/sharp/vendor',
        'node_modules/canvas/build',
        'node_modules/puppeteer/.local-chromium',
        
        // Development and testing files
        'scripts/**',
        'docs/**',
        '__tests__/**',
        'e2e/**',
        'load-tests/**',
        '.github/**',
        'jest.config.js',
        'jest.setup.js',
        'playwright.config.ts',
        
        // Large assets that aren't needed in production
        'public/letter-*.png',
        'public/diverse-property-showcase.png',
        'prisma/migrations/**',
        
        // Source maps and development files
        '**/*.map',
        '**/*.d.ts.map',
        'node_modules/**/*.md',
        'node_modules/**/README*',
        'node_modules/**/CHANGELOG*',
        'node_modules/**/LICENSE*',
      ],
    },
  },
  
  // Webpack customization for bundle optimization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle size for production
    if (!dev && !isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        util: false,
      };
      
      // Code splitting optimization
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }
    
    // Ignore certain modules to reduce bundle size
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
      })
    );
    
    return config;
  },
  
  // Logging for debugging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig;
