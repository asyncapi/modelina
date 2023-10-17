const nextJest = require('next/jest')

const createNextJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

async function createCustomJestConfig() {
  // Add any custom config to be passed to Jest
  /** @type {import('jest').Config} */
  const customJestConfig = {
    moduleNameMapper: {
      // Handle module aliases (this will be automatically configured for you soon)
      '^@/components/(.*)$': '<rootDir>/components/$1',
      '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
      '^@/styles/(.*)$': '<rootDir>/src/styles/$1'
    },
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
  };
  /**
   * NextJest adds and overwrite a lot of configurations
   */
  let fullConfig = await createNextJestConfig(customJestConfig)();

  // We have to configure Jest to transform a specific 
  fullConfig.transformIgnorePatterns = [
    '^.+\\.module\\.(css|sass|scss)$',
    // Ignore all but this
    '../../../node_modules/@stoplight/spectral-core/node_modules/(!?jsonpath-plus)',
  ];

  return fullConfig;
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createCustomJestConfig;