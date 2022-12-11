/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: './test/environment.js',
  setupFilesAfterEnv: ["./test/setup.js"],
  collectCoverageFrom: ['src/**/*.ts*'],
  coverageReporters: ["html", "text", "text-summary", "cobertura"],
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/test/__mocks__/styleMock.js"
  }
};
