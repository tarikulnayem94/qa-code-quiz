module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png|jpg)$": "<rootDir>/src/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)",
    "<rootDir>/src/**/?(*.)(spec|test).(ts|tsx|js)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/cypress/"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.tsx",
  ],
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
};
