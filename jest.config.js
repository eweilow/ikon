const ignorePaths = [
  "examples/",
  "/node_modules/",
  "/\\.ts-node/",
  "\\.snap",
  "integration/",
  "/\\.cache-loader/",
  "/\\.excitare/",
  "/\\.next/",
  ".*\\/dist\\/.*",
  "dist"
];

module.exports = {
  cacheDirectory: "<rootDir>/.jest",
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.test.json",
      isolatedModules: true
    }
  },
  transform: {
    "^.+\\.tsx?$": "@eweilow/ts-jest-fork",
    "^.+\\.jsx?$": "@eweilow/ts-jest-fork"
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  testMatch: ["**/__tests__/*.test.ts", "**/__tests__/*.test.tsx"],
  rootDir: "./",
  testEnvironment: "node",
  setupFiles: [],
  modulePathIgnorePatterns: [...ignorePaths],
  coveragePathIgnorePatterns: [...ignorePaths],
  watchPathIgnorePatterns: [...ignorePaths],
  testPathIgnorePatterns: [...ignorePaths]
};
