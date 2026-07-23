import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// FlatCompat bridges eslint-config-next's shareable config into ESLint 9's
// flat-config format. This is the documented, version-safe approach for
// the Next.js 15.x / ESLint 9.x generation — it works regardless of
// whether the exact pinned eslint-config-next version has added the newer
// direct flat-config subpath exports (`eslint-config-next/core-web-vitals`,
// `eslint-config-next/typescript`), which were introduced partway through
// the Next.js 15.x cycle. If a real `npm install` confirms the installed
// version supports those subpath imports directly, switching to them and
// dropping this compatibility layer is a safe, optional future
// simplification — not required for this to work correctly today.
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
    ],
  },
];

export default eslintConfig;
