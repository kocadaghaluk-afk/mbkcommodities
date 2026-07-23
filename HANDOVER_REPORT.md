# MBK Holding Commodities Website — Handover Report (v2, post-verification)

This supersedes the previous handover report. It corrects the placeholder
count, documents the footer fix, reports the actual result of running the
requested build/verification commands, and adds a genuine visual QA pass
with screenshots.

## 1. Build verification — actual results

**Requested:** run `npm install`, `npm run typecheck`, `npm run lint`,
`npm run build` in an environment with registry access, and only call the
project build-ready once they succeed.

**Actual result:** this sandboxed environment has no package-registry
network access (confirmed again immediately before this delivery). Every
attempt returns the same error:

```
$ npm install
npm error code E403
npm error 403 403 Forbidden - GET https://registry.npmjs.org/@tailwindcss%2fpostcss
npm error 403 In most cases, you or one of your dependencies are requesting
npm error 403 a package version that is forbidden by your security policy, or
npm error 403 on a server you do not have access to.
```

```
$ curl -sI https://registry.npmjs.org
HTTP/2 403
x-deny-reason: host_not_allowed
```

**I am not calling this project "build-ready" or "build-verified."** That
would misrepresent what has actually been checked. What I did instead, to
get as close to real verification as this environment allows:

1. **Static/logic verification**: every `content/*.ts` file (plain
   TypeScript, no JSX, no Next-specific APIs) was typechecked directly with
   the TypeScript compiler available locally, with zero errors beyond the
   expected `Cannot find name 'process'` (resolves once `@types/node` is
   installed, exactly as declared in `package.json`).
2. **Structural verification**: the entire `app/`, `components/`, and
   `lib/` tree was typechecked against hand-written ambient stub
   declarations for `next`, `react`, `react-dom`, and `zod`, to catch real
   syntax and logic errors independent of the missing packages. After this
   round of fixes, the only remaining diagnostics are stub-fidelity
   artifacts with no bearing on the real build (documented below) — no new
   real bugs.
3. **Genuine rendered visual verification**: since the actual Next.js
   toolchain cannot be installed, I hand-built a static HTML/CSS
   reconstruction of every route — using the exact approved copy
   transcribed from `content/*.ts` and the real placeholder SVGs — and
   rendered it with a locally-cached Chromium via Playwright at all six
   required viewports. This is **not** the compiled Next.js/Tailwind
   output, but it does let me show you real rendered layouts rather than a
   description of them, and it did catch and let me confirm real behaviour
   (grid balancing, footer rebalancing, mobile drawer, form layout). See
   Section 4.

**What you still need to do, in an environment with registry access:**

```bash
npm install
npm run typecheck
npm run lint
npm run build
npm run dev     # or: npm run start, after build
```

Then click through all 8 routes in a real browser. Given the depth of the
static/logic verification above, I'd expect this to succeed with at most
minor Next 15 / React 19 patch-version API adjustments (e.g. exact
`useActionState` behaviour, async `headers()`) — but that expectation is
not a substitute for actually running it, and I am flagging that
explicitly rather than asserting it.

## 2. Corrected placeholder inventory

The previous report said 12 placeholder SVG assets; the actual file count
is **15**, matching your count exactly:

| Category | Count | Files |
|---|---|---|
| Brand assets | 3 | `logo-primary.svg`, `logo-light.svg`, `favicon.svg` |
| Home | 1 | `placeholder-home-hero-port.svg` |
| About | 1 | `placeholder-about-doha-industrial.svg` |
| Business Areas | 5 | one per area (energy, precious-metals, mining, industrial, chemicals) |
| Leadership portraits | 4 | one per profile (chairman, general director, CEO, COO) |
| Markets & Partnerships | 1 | `placeholder-markets-logistics.svg` |
| **Total** | **15** | |

The root cause of the earlier miscount: `content/placeholders.ts` had
bundled the 5 business-area images and 4 leadership portraits into two
summary registry entries instead of one entry per file. This has been
corrected — the registry now contains one entry per actual asset (15
`placeholder-asset` entries total), so `placeholderAssets().length` matches
the real file count going forward. Verified directly against the
filesystem:

```
$ find public/brand public/images -type f | wc -l
15
$ grep -c 'status: "placeholder-asset"' content/placeholders.ts
15
```

## 3. Footer rebalancing fix

`components/layout/Footer.tsx` now selects between a 3-column and 4-column
grid based on whether any contact detail is approved:

```ts
const gridColumnsClass = hasAnyContactDetail ? "md:grid-cols-4" : "md:grid-cols-3";
```

When Contact is absent, the grid renders exactly 3 equal columns (Company /
Navigation / Legal) with no empty fourth track. When contact details are
approved, it renders 4 equal columns. Confirmed visually — see
`qa_footer_3col.png` and `qa_footer_4col.png` in the screenshots package,
described in Section 4.

## 4. Visual QA — real rendered screenshots

Because the real Next.js/Tailwind toolchain cannot be installed here, I
built a static HTML/CSS reconstruction of every route (`static-preview/` in
the delivery package) using the verbatim approved copy and the real
placeholder SVGs, and rendered it with a locally-available Chromium via
Playwright. **This is a faithful visual stand-in for layout/spacing/
typography/responsive QA — it is not the compiled Next.js output**, so
treat it as strong evidence the design decisions work, not as proof the
Next.js build itself is error-free (that still requires the commands in
Section 1).

Screenshots taken:
- **Every one of the 8 routes**, desktop (1440×900) and mobile (390×844) — 16 images.
- **A representative responsive matrix** (Home, Business Areas, Leadership, Contact) across all six required viewports (375×812, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080) — 24 images.
- **Targeted QA states**: mobile navigation drawer open, footer with 3 columns, footer with 4 columns, contact-form success/demo-mode acknowledgement, keyboard focus-visible state, reduced-motion emulation — 6 images.

**Findings, all confirmed good:**
- Five-item Business Areas grid balances as 3+2 at desktop/wide, 2+2+1 at
  tablet, single column at mobile — no visual imbalance, Chemicals &
  Petrochemicals matches the other four exactly.
- Four-profile Leadership grid renders identical card treatment for all
  profiles at every breakpoint — governance order communicated by sequence
  only, as required.
- Footer rebalances correctly in both the 3- and 4-column states (Section 3).
- Mobile drawer: full-height, large touch targets, no nested navigation.
- Contact form: fields stack cleanly on mobile, labels/required markers
  legible, success/demo-mode acknowledgement copy displays correctly.
- Focus-visible outline renders on interactive elements (confirmed via
  keyboard Tab emulation).
- Wide viewport (1920×1080): content stays capped at the 1240px container
  rather than stretching awkwardly.
- No text overflow, clipping, or broken wrapping observed at any tested
  viewport on any page.

All 46 screenshots are included in the delivery package under
`static-preview/screenshots/`.

## 5. Working preview URL

Not available. This sandbox has no outbound network access and no
deployment target reachable from here, so I cannot stand up a live URL.
Once you run `npm install && npm run build` in an environment with
registry/deployment access (e.g. Vercel), a preview URL becomes a normal
`vercel deploy` or equivalent step — happy to help with that configuration
once you're in an environment that supports it.

## 6. What was explicitly NOT changed (per your instruction)

No changes were made to strategy, page structure, approved copy, leadership
hierarchy, or business areas. The two fixes in this pass were narrowly
scoped:
1. `content/placeholders.ts` — registry granularity corrected (no copy or
   content changed, only the internal bookkeeping structure).
2. `components/layout/Footer.tsx` — grid column count now responds to
   content presence (no copy, links, or grouping changed).

## 7. Outstanding approvals (unchanged since previous report)

| Item | Status | Where |
|---|---|---|
| Corporate email address | Pending | `CONTACT_EMAIL` env var |
| Corporate telephone number | Pending | `CONTACT_TELEPHONE` env var |
| Corporate LinkedIn URL | Pending | `CONTACT_LINKEDIN_URL` env var |
| Privacy Policy final wording | Pending legal review | `app/privacy/page.tsx` |
| Terms of Use final wording | Pending legal review | `app/terms/page.tsx` |
| Contact form production readiness | Blocked on the above plus an approved email provider and a production rate-limit provider | `lib/actions.ts`, `lib/email-provider.ts`, `lib/rate-limit.ts` |
| Real brand logo (primary, light, favicon) | Placeholder art in place | `public/brand/*.svg` (3 files) |
| Real leadership portraits (4) | Placeholder silhouettes in place | `public/images/leadership/*.svg` |
| Approved photography (hero, about, 5× business areas, markets) | Placeholder illustrations in place | `public/images/**/*.svg` (8 files) |
| **A real `npm install && npm run build` in an environment with registry access** | **Required before production deployment** | See Section 1 |

Programmatic source of truth: `outstandingApprovals()` and
`placeholderAssets()` in `content/placeholders.ts` (now returns exactly 15
placeholder-asset entries and 4 pending-approval / 2 pending-legal-review
entries).

## 8. Compliance check against non-negotiable rules

- No invented facts, statistics, offices, certifications, or awards: ✅
- No "new/emerging/early-stage" language: ✅
- No banned marketing language: ✅
- No partner-logo strips, testimonials, counters, fake news, investor or
  careers sections, animated globes: ✅
- `[APPROVAL REQUIRED]` / placeholder text never rendered publicly: ✅
  (re-verified via repository-wide search; only appears in
  `content/placeholders.ts` and a code comment in `content/contact.ts`)
- Strategy, page structure, approved copy, leadership hierarchy, and
  business areas unchanged from the prior approved delivery: ✅
