/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [384, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
  redirects: async () => {
    let dynamicRedirects = [];

    // Try to load dynamic redirects from generated file
    try {
      const fs = require('fs');
      const path = require('path');
      const redirectsPath = path.join(__dirname, 'redirects.json');

      if (fs.existsSync(redirectsPath)) {
        const redirectsData = fs.readFileSync(redirectsPath, 'utf8');
        dynamicRedirects = JSON.parse(redirectsData);
        console.log(`✅ Loaded ${dynamicRedirects.length} dynamic redirects from redirects.json`);
      } else {
        console.warn('⚠️  redirects.json not found. Run: node scripts/generate-redirects.js');
      }
    } catch (error) {
      console.warn('⚠️  Could not load dynamic redirects:', error.message);
    }

    return [
      ...dynamicRedirects,
      {
        source: "/about",
        destination: "/sobre",
        statusCode: 301,
      },
      {
        source: "/contact",
        destination: "/contato",
        statusCode: 301,
      },
      {
        source: "/destinos",
        destination: "/passeios",
        statusCode: 301,
      },
      {
        source: "/avaliacoes",
        destination: "/#avaliacoes",
        statusCode: 301,
      },
      {
        source: "/categoria/passeio",
        destination: "/passeios",
        statusCode: 301,
      },
      {
        source: "/categoria/transfer",
        destination: "/transfer",
        statusCode: 301,
      },
      {
        source: "/politica",
        destination: "/politica-de-privacidade",
        statusCode: 301,
      },
      {
        source: "/reservas",
        destination: "/contato",
        statusCode: 301,
      },
    ];
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;
