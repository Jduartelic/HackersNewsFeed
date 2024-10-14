module.exports = {
  preset: 'react-native',
  setupFiles: [
    '<rootDir>/jest/setup.ts',
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/example/node_modules',
    '<rootDir>/lib/',
  ],
  collectCoverageFrom: ['src/**'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'jest-runner',
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation|@kichiyaki/react-native-barcode-generator|jsbarcode)',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/assetsTransformer.js',
    '\\.(css|less)$': '<rootDir>/assetsTransformer.js',
  },
  coverageReporters: ['json-summary', 'html', 'lcov', 'text'],
};
