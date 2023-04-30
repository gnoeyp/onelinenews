/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
