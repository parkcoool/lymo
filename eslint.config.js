import path from "path";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import { defineConfig } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";

export default defineConfig([
  // 빌드 결과물, 모듈 디렉토리 및 설정 파일 무시
  {
    ignores: ["**/build", "**/dist", "**/lib", "**/node_modules", "**/.expo", "eslint.config.js"],
  },

  tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,

  // 공통 설정
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "import/no-named-as-default": 0,

      // import 정렬 설정
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
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
    settings: {
      "import/resolver": {
        typescript: {
          project: [
            "apps/frontend/tsconfig.json",
            "apps/functions/tsconfig.json",
            "packages/schemas/tsconfig.json",
          ],
          noWarnOnMultipleProjects: true,
          alwaysTryTypes: true,
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },

  // frontend 전용 설정
  {
    files: ["apps/frontend/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    extends: [
      {
        ...reactPlugin.configs.flat.recommended,
        settings: {
          react: {
            version: "detect",
          },
        },
      },
      expoConfig,
    ],
    languageOptions: {
      parserOptions: {
        project: "apps/frontend/tsconfig.json",
        tsconfigRootDir: path.resolve(),
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "apps/frontend/tsconfig.json",
          alwaysTryTypes: true,
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          paths: ["apps/frontend"],
        },
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },

  // functions 전용 설정
  {
    files: ["apps/functions/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "apps/functions/tsconfig.json",
        tsconfigRootDir: path.resolve(),
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "apps/functions/tsconfig.json",
          alwaysTryTypes: true,
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          paths: ["apps/functions"],
        },
      },
    },
  },
]);
