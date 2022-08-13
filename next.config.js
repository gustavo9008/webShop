/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  httpAgentOptions: {
    keepAlive: false,
  },
  images: {
    domains: ["cdn.shopify.com"],
  },
}

module.exports = nextConfig
