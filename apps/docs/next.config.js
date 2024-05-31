const { withContentlayer } = require('next-contentlayer')
const packageJson = require('./package.json')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        scrollRestoration: true,
    },
    generateBuildId: async () => {
        const { name, version } = packageJson
        return `${name}:${version}`
    },
}

module.exports = withContentlayer(nextConfig)
