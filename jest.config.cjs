// eslint-disable-next-line no-undef
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'CommonJS',
          moduleResolution: 'Node',
          jsx: 'react-jsx',
          esModuleInterop: true,
          verbatimModuleSyntax: false,
        },
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/src/test/styleMock.cjs',
  },
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  clearMocks: true,
};