module.exports = {
  transformIgnorePatterns: [
    "node_modules/(?!(axios)/)"
  ],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  setupFilesAfterEnv: [
    "<rootDir>/src/setupTests.js"
  ],
  testEnvironment: "jsdom"
};