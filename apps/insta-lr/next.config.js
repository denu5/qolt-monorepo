const { withContentlayer } = require('next-contentlayer')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        scrollRestoration: true,
    },
    eslint: {
        ignoreDuringBuilds: false,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'photos.adobe.io',
            },
        ],
    },
    // when deploying to vercel, transpilePackages needed, otherwhise possible Error:
    // Running "install" command: `npm install --prefix=`...
    // https://stackoverflow.com/a/77686714
    transpilePackages: ['@qolt/app-contentlayer', '@qolt/app-components', '@qolt/data-lightroom'],
}

module.exports = withContentlayer(nextConfig)
