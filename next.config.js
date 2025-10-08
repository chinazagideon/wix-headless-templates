/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
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
    unoptimized: true, // Required for static export
  },
};

module.exports = nextConfig;
