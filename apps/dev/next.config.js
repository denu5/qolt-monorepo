const { withContentlayer } = require('next-contentlayer')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        scrollRestoration: true,
    }
}

module.exports = withContentlayer(nextConfig)
