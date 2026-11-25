import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// The previous config had no `files` pattern, so ESLint silently skipped every
// .ts/.tsx file. These presets include the TypeScript parser and cover them.
const config = [
  ...nextVitals,
  ...nextTs,
  {
    // Tooling config files are CommonJS by design.
    files: ["**/*.config.js"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  {
    ignores: [".next/**", ".open-next/**", "out/**", ".wrangler/**", "node_modules/**", "ideas/**", ".venv/**", "next-env.d.ts"],
  },
];

export default config;
