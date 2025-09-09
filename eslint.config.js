import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    // Ignore generated files and directories
    ignores: ["build/**", ".react-router/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  importPlugin.flatConfigs.recommended,
  // import ordering rules
  {
    files: ["app/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "react/react-in-jsx-scope": "off", // Not needed for React 17+ with new JSX transform
      "@typescript-eslint/no-empty-object-type": "off", // Disable if {} is intentionally used
      "@typescript-eslint/no-namespace": "off", // Disable if namespaces are intentionally used
      "@typescript-eslint/no-explicit-any": "error", // Re-enable after initial noise reduction
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ], // Warn for unused vars, ignore args starting with _
      "import/no-unresolved": "error", // Re-enable after initial noise reduction
    },
  },
]);
