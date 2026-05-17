import { defineConfig, globalIgnores } from "eslint/config";
import importX from "eslint-plugin-import-x";

export default defineConfig([globalIgnores(["**/coverage/"]), {
  plugins: {
    "import-x": importX,
  },

  rules: {
    "arrow-body-style": 0,
    "arrow-parens": 0,
    "comma-dangle": 0,
    "func-names": 0,
    "function-paren-newline": 0,

    "no-console": [1, {
      allow: ["info", "warn", "error"],
    }],

    "object-curly-newline": 0,
    "operator-linebreak": 0,
    "prefer-arrow-callback": 0,
    "space-before-function-paren": 0,
    "import-x/no-dynamic-require": 0,
  },
}]);
