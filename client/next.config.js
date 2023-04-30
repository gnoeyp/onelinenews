/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://${process.env.SERVER_HOST}:3000/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
