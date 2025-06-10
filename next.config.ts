import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  basePath: '/techblog', // use your repo name here
  assetPrefix: '/techblog',
  trailingSlash: true,
};

export default nextConfig;