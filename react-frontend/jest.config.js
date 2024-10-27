module.exports = {
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
    },
    transformIgnorePatterns: [
      "/node_modules/(?!axios)/", // Transpile ES modules from axios
    ],
    moduleNameMapper: {
      '\\.(css|scss)$': 'identity-obj-proxy', // Handle CSS imports in React components
    },
    testEnvironment: "jsdom", // Ensure tests run in a browser-like environment
  };
  