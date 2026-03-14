import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // React rules
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",

      // Typescript rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-unused-vars": "warn",

      // Code rules
      "default-case": "error",
      "default-case-last": "error",
      "dot-notation": "error",
      "eqeqeq": ["error", "always"],
      "func-style": ["error", "expression"],
      "logical-assignment-operators": ["error", "always"],
      "no-else-return": ["error"],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-duplicate-imports": "error",
      "no-inline-comments": "error",
      "no-inner-declarations": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "error",
      "no-use-before-define": "error",
      "no-useless-assignment": "error",
      "no-var": "error",
      "no-warning-comments": ["error", { location: "anywhere"} ],
      "prefer-const": "error",
      "prefer-spread": "error",
      "prefer-template": "error",
      "semi": ["error", "never"],
      "sort-vars": "error",
      "vars-on-top": "error",
      "yoda": "error",

      // Formatting rules
      "capitalized-comments": ["warn", "always"],
      "comma-dangle": ["warn", "never"],
      "consistent-return": "warn",
      "curly": ["warn", "multi-or-nest", "consistent"],
      "quotes": ["warn", "double"],
    },
  },
)
