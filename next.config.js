/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    proxy: true,
  },
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination:
          "https://auth-backend-production-c662.up.railway.app/auth/:path*",
      },
      {
        source: "/api/:path*",
        destination:
          "https://auth-backend-production-c662.up.railway.app/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
