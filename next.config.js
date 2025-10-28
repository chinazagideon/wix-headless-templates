/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/catalog/services',
        destination: 'https://www.wixapis.com/bookings/v1/catalog/services',
      },
    ];
  },
  env: {},
  reactStrictMode: true,
  swcMinify: true,
  experimental: {},
  eslint: {
    dirs: ['app', 'src'],
  },
  images: {
    domains: ['fakeimg.pl', 'static.wixstatic.com', 'fonts.cdnfonts.com', 'lh3.googleusercontent.com'],
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
};

module.exports = nextConfig;
