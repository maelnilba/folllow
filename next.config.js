/** @type {import('next').NextConfig} */
//   reactStrictMode: false __ Framer Motion Reorder issues when set to true, use false when testing
const nextConfig = {
  reactStrictMode: true,
  experimental: { images: { allowFutureImage: true } },
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
};

module.exports = nextConfig;
