import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tsEslint from "typescript-eslint";
import globals from "globals";

export default defineConfig([
  {
    ignores: ["**/node_modules/**", "**/build/**", "**/*.config.ts", "**/public/**"],
  },
  js.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  ...tsEslint.configs.stylisticTypeChecked,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: { project: ["tsconfig.json", "tsconfig.node.json"] },
    },
    plugins: { "@typescript-eslint": tsEslint.plugin },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^@mui/[^/]+$",
              message: "Import from a deep path, e.g. @mui/material/Button",
            },
          ],
        },
      ],
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/prefer-nullish-coalescing": [
        "error",
        {
          ignorePrimitives: {
            boolean: true,
          },
        },
      ],
    },
  },
  {
    files: ["**/*.test.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    files: ["src/server/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
        process: "readonly",
        console: "readonly",
      },
    },
  },
]);
