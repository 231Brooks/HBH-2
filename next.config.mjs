/** @type {import('next').NextConfig} */
const nextConfig = {
  // Core Next.js settings
  reactStrictMode: true,
  
  // Build and performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // ESLint and TypeScript settings
  eslint: {
    ignoreDuringBuilds: true, // Temporarily ignore during build
    dirs: ['app', 'components', 'lib', 'hooks'],
  },
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore during build
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
    domains: ['placeholder.svg'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Bundle optimization
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'date-fns',
      'react',
      'react-dom'
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
}

export default nextConfig;
