/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // Перехоплює /auth/login, /auth/register і шле на Railway
        source: "/auth/:path*",
        destination:
          "https://auth-backend-production-c662.up.railway.app/auth/:path*",
      },
      {
        // Перехоплює запити до нотаток
        source: "/api/:path*",
        destination:
          "https://auth-backend-production-c662.up.railway.app/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
