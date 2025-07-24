import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs}"], // Removed `jsx` extension for clarity
    languageOptions: {
      globals: globals.node, // Include Node.js globals
    },
  },
  pluginJs.configs.recommended, // Use recommended JS rules
  {
    files: ["**/*.test.{js,mjs,cjs}", "**/*.spec.{js,mjs,cjs}"], // Test files pattern
    plugins: {
      jest: pluginJest, // Add Jest plugin
    },
    languageOptions: {
      globals: {
        ...globals.jest, // Add Jest globals
      },
    },
    rules: {
      ...pluginJest.configs.recommended.rules, // Use recommended Jest rules
    },
  },
];
