# Visual Refinement Pass 1 — Summary

Scope: Home hero, header/brand mark, leadership section (Home preview +
Leadership page), footer height, CTA hierarchy. No changes to information
architecture, approved copy, business areas, leadership order, or routes.

## Modified / added files

**New:**
- `components/sections/HomeHero.tsx` — two-column Home hero (text left, media right)
- `components/ui/Logo.tsx` — configurable logo (full / monogram × dark / light)
- `public/brand/logo-mark.svg`, `public/brand/logo-mark-light.svg` — monogram placeholders
- `public/images/home/placeholder-home-hero-terminal.svg` — redesigned hero illustration (replaces `placeholder-home-hero-port.svg`, which was removed)

**Edited:**
- `app/page.tsx` — uses `HomeHero`; Home leadership grid now uses `variant="home"`
- `app/leadership/page.tsx` — explicit `variant="full"` on the leadership grid
- `components/layout/Header.tsx` — uses `Logo`; refined horizontal spacing (`gap-6`, `lg:px-14`, `gap-9` nav)
- `components/layout/MobileNavigation.tsx` — drawer header uses `Logo` monogram instead of plain text
- `components/layout/Footer.tsx` — tightened vertical spacing (~20% desktop, ~29% mobile reduction in grid padding); 3/4-column rebalancing logic unchanged
- `components/sections/LeadershipProfile.tsx` — added `variant` ("home"/"full"); home variant is a compact portrait-forward card (portrait, name, title, one sentence); full-page grid now uses `items-start` so cards size to their own content instead of stretching to the tallest
- `content/home.ts` — CTA roles swapped (Contact MBK now primary/button; Explore Our Business Areas now secondary/text-style); hero image path updated
- `content/leadership.ts` — added `homeOneLiner` field (verbatim first sentence of each profile's approved copy — no new claims)
- `content/placeholders.ts` — registry updated for the 2 new monogram assets and the renamed hero image (17 placeholder-asset entries now, up from 15, matching the 2 new files added)

**Unchanged (explicitly, per scope):** `components/sections/PageHero.tsx` (still used by About/Business Areas/Leadership/Markets/Contact hero — Home no longer uses it), `components/sections/BusinessAreaBlock.tsx`, all approved copy in `content/*.ts` other than the two noted fields, all 8 routes, business area order/count, leadership order.

## Verification performed

- **Typecheck**: content layer + full app/components/lib tree re-checked against stub declarations. No new logic/syntax errors from this pass's changes (only the same pre-existing stub-fidelity artifacts documented in the prior handover report — `react/jsx-runtime`, `key` prop, `process`, `z` namespace — none of which reflect real bugs).
- **`npm install` / `npm run build`**: still blocked in this sandbox (confirmed again immediately before this delivery — `403 host_not_allowed` against registry.npmjs.org). Not claiming build-ready; see `HANDOVER_REPORT.md` Section 1 for the full explanation and the exact commands to run yourself.
- **Visual QA**: re-rendered the static HTML/CSS reconstruction with the new hero, header, leadership, and footer markup, and re-screenshotted it. Confirmed structurally via pixel/statistical sampling (image rendering in my own tool output wasn't available this session, so I verified programmatically instead of by eye):
  - Home hero: left panel is a uniform ink (#101820) background as expected; right panel shows real illustrated variation (cranes/containers/vessel), not a flat rectangle; hero height resolves to exactly 86% of viewport height as specified.
  - Mobile: hero stacks text above the image panel (source-order based, no JS/ordering hacks needed).
  - Footer: spacing values reduced per the plan above.
- You should still do a direct visual pass yourself once you open the screenshots/HTML — I'm flagging that my own confirmation this round was numerical/structural rather than a first-hand look, in the interest of not overstating certainty.
