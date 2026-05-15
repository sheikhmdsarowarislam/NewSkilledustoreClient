import type { NextConfig } from "next"

const allowedOrigins = process.env.APP_URL
  ? [process.env.APP_URL, 'http://localhost:3000']
  : ['http://localhost:3000'];

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  
  // Image optimization configuration
  images: {
    remotePatterns: [
      // Cloudinary - for course thumbnails and avatars
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Allow localhost for development
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Enable image optimization
    unoptimized: false,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
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
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ]
  },

  // Compiler options
  compiler: {
    // Remove console logs in production except errors and warnings
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-label'],
    serverActions: {
    bodySizeLimit: '2mb',
    allowedOrigins: allowedOrigins,
  },
  },

  // Production optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller builds
  
  // Compression
  compress: true,
  
  // Power by header
  poweredByHeader: false, // Remove X-Powered-By header for security
}

export default nextConfig
