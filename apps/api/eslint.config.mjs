import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig([
  {
    ignores: ["dist/**"],
  },
]);

export default eslintConfig;
