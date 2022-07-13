/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: { images: { allowFutureImage: true } },
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
};

module.exports = nextConfig;
