import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
basePath: "/roots",
assetPrefix: '/roots',
output: "export",
distDir: 'out',
trailingSlash: true
};

export default nextConfig;