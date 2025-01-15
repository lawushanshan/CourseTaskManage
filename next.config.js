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

    // 添加对 .md 文件的支持
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader'
    })

    return config
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date' },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/teacher/courses',
        destination: '/courses/teacher',
      },
      {
        source: '/teacher/courses/:path*',
        destination: '/courses/teacher/:path*',
      },
    ]
  },
}

module.exports = nextConfig 