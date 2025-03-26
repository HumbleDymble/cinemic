import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended",
    ],
    overrides: [
      {
        files: [".eslintrc.{js,cjs}"],
        parserOptions: {
          sourceType: "script",
          project: ["./tsconfig.json"],
        },
      },
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint"],
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/explicit-function-return-type": 0,
      "@typescript-eslint/no-unsafe-argument": 0,
      "@typescript-eslint/no-extra-non-null-assertion": 0,
      "@typescript-eslint/no-unused-expressions": 0,
      "react/prop-types": 0,
      "new-cap": [
        "error",
        {
          newIsCap: false,
        },
      ],
    },
  },
]);
