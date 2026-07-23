# Production Build Fix — Root Cause Report

## Issue 1 — `pageSeo` possibly undefined

**Root cause**: `content/seo.ts` declared `pageSeo: Record<string, PageSeo>`. That type is exactly an index signature. This project's real `tsconfig.json` has `"noUncheckedIndexedAccess": true` — which makes TypeScript widen *any* access through an index signature type to `T | undefined`, including plain dot-notation access like `pageSeo.home`. The type `Record<string, PageSeo>` only tells the compiler "some string key maps to a `PageSeo`" — it doesn't encode that `home`, `about`, etc. specifically are guaranteed to exist, so every one of the 8 `buildMetadata(pageSeo.xxx)` call sites failed with "Argument of type `PageSeo | undefined` is not assignable to parameter of type `PageSeo`."

This is exactly the gap I flagged in the original audit: my sandbox verification harness never enabled `noUncheckedIndexedAccess`, so this never surfaced until a real compiler ran against the real `tsconfig.json`.

**Fix**: changed the declaration from a `Record<string, PageSeo>` type annotation to a `satisfies Record<string, PageSeo>` assertion. `satisfies` validates every value against the `PageSeo` shape while preserving the object's literal, named-key structure — so `pageSeo.home` (and the other 7) type as definite `PageSeo`, matching exactly what every call site already expected. No call site changed.

**Verified**: built an isolated minimal reproduction with the exact same pattern, compiled it under `noUncheckedIndexedAccess: true` — confirmed the old pattern produces the exact reported error, and the new pattern produces zero errors. Re-ran the full project typecheck with `strict: true` and `noUncheckedIndexedAccess: true` genuinely enabled this time (correcting the gap in my own process) — clean, and confirmed no other instance of this pattern exists anywhere else in the codebase.

## Issue 2 — `Missing field 'negated' on ScannerOptions.sources`

**Root cause**: this is a documented upstream Tailwind CSS bug, not something specific to this codebase. `package.json` pinned `"tailwindcss": "4.0.0"` and `"@tailwindcss/postcss": "4.0.0"` exactly — but `@tailwindcss/postcss@4.0.0`'s *own* `package.json` declares its dependency on `@tailwindcss/node` as `"^4.0.0"`, a caret range rather than an exact pin. Even with our top-level exact pin, npm resolves that internal transitive dependency according to its own range — which permits installing `@tailwindcss/node@4.1.0`. The native Rust scanner's config structure gained a required `negated` field on each source entry between those two versions, so `@tailwindcss/postcss@4.0.0`'s JS code (built for the older shape) fails to construct valid config for the newer binary — producing exactly this error. Tailwind's own team acknowledged this as a brittle-dependency-pinning bug in their `4.0.0` release and corrected it in later versions.

**Fix**: bumped both `tailwindcss` and `@tailwindcss/postcss` from `4.0.0` to `4.1.3` in `package.json` — a version confirmed past the point where Tailwind fixed the internal pinning. No changes were needed to `postcss.config.mjs` or `styles/globals.css`: the `@import "tailwindcss"` + `@theme {}` CSS-first configuration pattern was introduced in 4.0.0 and is unchanged through the 4.1.x line — this is a dependency-version fix only, not a configuration migration.

**Not verified by an actual build** (still no registry access in this sandbox) — this diagnosis is based on a documented, confirmed upstream issue report matching our exact version pins, not a guess, but the real resolution can only be confirmed by an actual `npm install && npm run build` in a connected environment.

## Files changed

- `content/seo.ts` — type declaration only, no content/copy change
- `package.json` — two version numbers

## What did not change

No design, copy, layout, or component logic was touched. No refactoring beyond these two fixes. Everything else flagged in the original audit (email/rate-limit providers, production domain, contact details, etc.) remains exactly as documented — out of scope for this fix pass.
