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
  basePath: basePath,
  redirects: () => {
    return [
      {
        source: '/docs/(.\.md.*)',
        destination: '/docs/$0',
        permanent: true,
      }
    ]
  }
}

module.exports = nextConfig
