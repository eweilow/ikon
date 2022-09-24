module.exports = {
  transform: {
    "^.+\\.(ts|js)x?$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.test.json",
        isolatedModules: true
      }
    ]
  }
};
