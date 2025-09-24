import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import { defineConfig } from "eslint/config";
import expoConfig from "eslint-config-expo/flat";

export default defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
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
    },
  },
]);
