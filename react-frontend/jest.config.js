module.exports = {
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
    },
    transformIgnorePatterns: [
      "/node_modules/(?!axios)/" // Transpile ES modules from axios
    ],
    moduleNameMapper: {
      '\\.(css|scss)$': 'identity-obj-proxy' // This is to handle CSS imports in React components
    }
  };
  