/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'avatars.githubusercontent.com',
    ],
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 客户端打包配置
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        http2: false,
        http: false,
        https: false,
        stream: false,
        util: false,
        os: false,
        url: false,
        assert: false,
        crypto: false,
        zlib: false,
        path: false,
        buffer: false,
        process: false,
        'pino-pretty': false,
        'mock-aws-s3': false,
        'aws-sdk': false,
        '@aws-sdk/client-s3': false,
        nock: false,
        'aws-crt': false,
      }
    }
    return config
  },
  headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 