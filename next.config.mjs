import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone para Docker (genera servidor auto-contenido)
  output: 'standalone',
  serverExternalPackages: ['@libsql/client', 'libsql', 'better-sqlite3'],
  webpack: (webpackConfig, { isServer }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    };

    // Handle native modules for libsql
    if (isServer) {
      webpackConfig.externals = webpackConfig.externals || [];
      webpackConfig.externals.push({
        '@libsql/client': '@libsql/client',
        libsql: 'commonjs libsql',
        'better-sqlite3': 'commonjs better-sqlite3',
      });
    }

    return webpackConfig;
  },
};

export default withPayload(nextConfig);
