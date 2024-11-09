const path = require('path');

module.exports = {
  webpack: {
    // Any webpack configurations you might need
  },
  jest: {
    configure: (jestConfig) => {
      console.log('Custom Jest configuration is loaded');

      // Modify the Jest configuration to include your custom settings
      jestConfig.transformIgnorePatterns = [
        '/node_modules/(?!(axios)/)',
      ];

      jestConfig.transform = {
        '^.+\\.(js|jsx)$': 'babel-jest',
      };

      return jestConfig;
    },
  },
};
