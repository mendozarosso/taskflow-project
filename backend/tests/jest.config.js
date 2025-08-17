module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  testMatch: [
    '<rootDir>/*.test.js',
    '<rootDir>/**/*.test.js'
  ],
  rootDir: '.',
  testTimeout: 10000
};