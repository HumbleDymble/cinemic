/** @jest-config-loader esbuild-register */

const config = {
  testEnvironment: "./fixed-jsdom-environment.ts",

  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        sourceMaps: true,
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: true,
          },
          transform: {
            react: {
              runtime: "automatic",
            },
          },
          target: "esnext",
          baseUrl: ".",
          paths: {
            "@/*": ["src/*"],
          },
        },
      },
    ],
  },

  extensionsToTreatAsEsm: [".ts", ".tsx"],

  transformIgnorePatterns: [
    "/node_modules/(?!msw|@mswjs/interceptors|until-async)",
    "\\.pnp\\.[^\\/]+$",
  ],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/client/$1",
    "^next/navigation$":
      "<rootDir>/src/client/shared/lib/tests/render-with-providers/nextNavigationModuleMock.ts",
  },

  setupFilesAfterEnv: ["<rootDir>/src/client/shared/config/jest/server/setup.ts"],

  verbose: true,
};

export default config;
