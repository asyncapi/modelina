// eslint-disable-next-line no-undef
module.exports = {
  coverageReporters: ['json-summary', 'lcov', 'text'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest'
  },
  // The root of your source code, typically /src
  // `<rootDir>` is a token Jest substitutes
  roots: ['<rootDir>'],

  // Test spec file resolution pattern
  // Matches parent folder `__tests__` and filename
  // should contain `test` or `spec`.
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testTimeout: 10000,
  moduleNameMapper: {
    '^nimma/legacy$': '<rootDir>/node_modules/nimma/dist/legacy/cjs/index.js',
    '^nimma/(.*)': '<rootDir>/node_modules/nimma/dist/cjs/$1'
  }
};
