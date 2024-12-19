const { configure: configureDom } = require('@testing-library/dom');
const { configure: configureReact } = require('@testing-library/react');

const config = {
  coverageProvider: 'v8',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/*.(t|j)s?(x)',
    '**/?(*.)+(spec|test).(t|j)s?(x)',
  ],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './coverage/test-reports',
        outputName: 'jest-junit.xml',
      },
    ],
  ],
  testPathIgnorePatterns: ['fixtures', '__tests__/utils'],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/app/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/mocks/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/mocks/styleMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 20000, // 20 seconds
};

const rtlConfig = {
  asyncUtilTimeout: 5000, // 5 seconds, used by waitFor
};

configureReact(rtlConfig);
configureDom(rtlConfig);

module.exports = config;
