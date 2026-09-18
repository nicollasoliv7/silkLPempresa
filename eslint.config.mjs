import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";

import quality from "./eslint-rules/index.cjs";

export default defineConfig([
  js.configs.recommended,
  {
    files: ["dist/**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        document: "readonly",
        window: "readonly",
        IntersectionObserver: "readonly",
      },
    },
    plugins: { quality },
    rules: {
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-var": "error",
      "prefer-const": "error",
      "quality/max-lines": ["error", { max: 350 }],
      "quality/no-direct-console": [
        "error",
        { logger: "the project logging helper" },
      ],
    },
  },
  {
    files: ["eslint-rules/**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { module: "readonly", require: "readonly" },
    },
  },
  {
    files: ["verify.mjs"],
    languageOptions: {
      globals: { console: "readonly", process: "readonly" },
    },
  },
  globalIgnores([
    "node_modules/**",
    "coverage/**",
    "package-lock.json",
  ]),
]);
