const isGithubActions = process.env.GITHUB_ACTIONS || false;
const path = require('path');

let assetPrefix = '/';
let basePath = '';

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');
  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  assetPrefix: assetPrefix,
  basePath: basePath,
  webpack(config, { isServer, webpack }) {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      const fallback = config.resolve.fallback || {};
      Object.assign(fallback, {
        url: require.resolve('url/'),
        fs: false,
        module: false,
        repl: false,
        console: false,
      });
      config.resolve.fallback = fallback;
    }
    // config.plugins = [
    //   new webpack.NormalModuleReplacementPlugin(
    //     /modelina\/lib\/cjs\/processors\/TypeScriptInputProcessor\.js/,
    //     require.resolve(path.resolve(__dirname, 'src/TypeScriptInputProcessor.js'))
    //   ),
    // ];
    return config;
  },
}

module.exports = nextConfig
