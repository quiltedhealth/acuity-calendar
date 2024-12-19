import { configure as configureDom, Config as RTLConfig } from "@testing-library/dom";
import { configure as configureReact } from "@testing-library/react";
import type { Config } from "jest";

const config: Config = {
  coverageProvider: "v8",
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/**/*.(t|j)s?(x)", "**/?(*.)+(spec|test).(t|j)s?(x)"],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "./coverage/test-reports",
        outputName: "jest-junit.xml",
      },
    ],
  ],
  testPathIgnorePatterns: ["fixtures", "__tests__/utils"],
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/app/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/mocks/fileMock.js",
    "\\.(css|less|scss)$": "<rootDir>/mocks/styleMock.js"
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testTimeout: 20000, // 20 seconds
};

const rtlConfig: Partial<RTLConfig> = {
  asyncUtilTimeout: 5000, // 5 seconds, used by waitFor
};

configureReact(rtlConfig);
configureDom(rtlConfig);

export default config;
