const isGithubActions = process.env.GITHUB_ACTIONS || false;

let assetPrefix = '/';
let basePath = '';

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');
  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: assetPrefix,
  basePath: basePath
}

module.exports = nextConfig,{
  async redirects() {
    return [
      {
        source: '/(.*)',
        destination: '/404',
        permanent: false,
      },
    ];
  },
};
