import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"
import prettier from "eslint-config-prettier" // Prettier 통합
import pluginPrettier from "eslint-plugin-prettier" // Prettier 플러그인

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect", // React 버전을 자동으로 감지
      },
    },
  },
  prettier, // Prettier 설정 추가
  {
    plugins: {
      prettier: pluginPrettier, // Prettier 플러그인 활성화
    },
    rules: {
      semi: ["error", "never"], // 세미콜론 사용 금지
      // ✅ _로 시작하는 unused 변수 무시
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "prettier/prettier": "error", // Prettier 규칙을 ESLint에서 에러로 표시
    },
  },
]
