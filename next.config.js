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
    return [
      {
        source: "/pacote/van-fortaleza",
        destination: "/pacote/van-em-fortaleza-com-motorista",
        statusCode: 301,
      },
      {
        source: "/pacote/transfer-carmel-taiba",
        destination: "/pacote/transfer-carmel-taiba-exclusive-resort",
        statusCode: 301,
      },
      {
        source: "/pacote/transfer-aeroporto-fortaleza",
        destination: "/pacote/transfer-aeroporto-de-fortaleza-hoteis",
        statusCode: 301,
      },
      {
        source: "/pacote/transfer-parque-das-fontes",
        destination: "/pacote/transfer-hotel-parque-das-fontes",
        statusCode: 301,
      },
      {
        source: "/pacote/transfer-trairi-mundau--flecheiras--guajiru",
        destination: "/pacote/transfer-trairi-mundau-flecheiras-e-guajiru",
        statusCode: 301,
      },
      {
        source: "/pacote/transfer-coliseum-hotel",
        destination: "/pacote/transfer-coliseum-beach-hotel",
        statusCode: 301,
      },
      {
        source: "/pacote/passeio-jeri-1dia",
        destination: "/pacote/passeio-jericoacoara-em-1-dia",
        statusCode: 301,
      },
      {
        source: "/pacote/passeio-3-praias-1-dia-com-canoa-quebrada",
        destination: "/pacote/passeio-3-praias-morro-branco-fontes-e-canoa-quebrada",
        statusCode: 301,
      },
      {
        source: "/pacote/passeio-city-tour-fortaleza",
        destination: "/pacote/passeio-city-tour-em-fortaleza-4h",
        statusCode: 301,
      },
      {
        source: "/pacote/3-praias-morro-branco-praia-das-fontes-barra-nova",
        destination: "/pacote/passeio-3-praias-morro-branco-praia-das-fontes-barra-nova",
        statusCode: 301,
      },
      {
        source: "/passeios/:id",
        destination: "/pacote/:id",
        statusCode: 301,
      },
      {
        source: "/transfer/:id",
        destination: "/pacote/:id",
        statusCode: 301,
      },
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
        source: "/pacotes",
        destination: "/passeios",
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
