# Stage 1 — Local Build Verification & Engineering Hardening — Summary

## 1. Real build verification — actual results

I re-attempted `npm install` at the start of this stage, as instructed. Same result as every prior attempt in this project:

```
$ npm install
npm error code E403
npm error 403 403 Forbidden - GET https://registry.npmjs.org/@eslint%2feslintrc
npm error 403 In most cases, you or one of your dependencies are requesting
npm error 403 a package version that is forbidden by your security policy, or
npm error 403 on a server you do not have access to.

$ curl -sI https://registry.npmjs.org
HTTP/2 403
x-deny-reason: host_not_allowed
```

**This sandbox has no package-registry access — that has not changed, and I'm not able to make it change.** `npm run typecheck`, `npm run lint`, and `npm run build` were consequently not run for real either, since none of them can execute without `npm install` completing first.

**What I did instead**, to get as close to real verification as this environment allows:
- Ran my structural typecheck harness (stub type declarations standing in for the packages that can't be installed) against every file touched this stage, including with `noUnusedLocals`/`noUnusedParameters` enabled to match the project's real `tsconfig.json` strictness. Zero new errors — only the same pre-existing stub-limitation noise documented in every prior round.
- Verified `HTMLElement.inert` (used in the new focus-management code) is a real, typed DOM property by checking a locally available `lib.dom.d.ts` directly — confirmed present.
- Verified `eslint.config.mjs` is syntactically valid ES module JavaScript (import attempt fails only on the expected missing package, not a syntax error).
- Re-ran the static HTML/CSS visual reconstruction used throughout this project and confirmed zero horizontal overflow on any of the 6 main pages at mobile width — this catches layout regressions but **cannot** exercise the new React-specific behavior (focus trap, live region, inert), since that reconstruction is hand-built static markup, not the real component code.

**I am not claiming this build is verified.** The install/typecheck/lint/build results above are the honest, current state — the first real task for whoever has registry access is to run those four commands for real and treat the results as new information.

## 2. ESLint

Added `eslint.config.mjs` — genuinely new, since no ESLint configuration existed in this repository at all before this stage (confirmed by direct file search; `package.json` referenced a `lint` script and `eslint-config-next` dependency, but no config file backed it).

**Approach:** used the `FlatCompat` bridge (`compat.extends("next/core-web-vitals", "next/typescript")`), which requires a new `@eslint/eslintrc` devDependency (added to `package.json`). I looked this up against current Next.js documentation before writing it — Next.js's own docs now show a newer pattern (`import nextVitals from 'eslint-config-next/core-web-vitals'` directly, no compatibility layer needed), but that direct-subpath-export capability was added to `eslint-config-next` partway through the 15.x release cycle, and I can't confirm whether the exact pinned version (`15.1.6`, from earlier in this project) supports it without a real install to check. FlatCompat is documented to work reliably across the entire Next 15.x/ESLint 9.x generation regardless of that detail, so I used it as the safe choice rather than gamble on an import that might not resolve. **This is a deliberate, documented tradeoff, not an oversight** — if a real install confirms the newer direct-export pattern works with the installed version, switching to it and dropping the FlatCompat layer is a safe, optional simplification, not a requirement.

I could not run `npm run lint` for real (see §1), so **"resolve all genuine errors and warnings" is not something I can claim to have done** — only that a config now exists where none did before, and it's built on a currently-documented, non-deprecated pattern.

## 3. Mobile navigation accessibility

`components/layout/MobileNavigation.tsx` (plus one small addition to `components/layout/Header.tsx`):

- **Focus trap**: Tab/Shift+Tab now cycle within the dialog's own focusable elements (queried fresh on every keypress, so it stays correct even though the set of focusable elements is static in practice). Previously, Tab could move focus out of the open dialog into content behind it.
- **Escape-to-close**: unchanged — this already worked correctly.
- **Return focus to trigger**: fixed a real gap — previously, only the Escape key returned focus to the hamburger button; the drawer's own "Close" (X) button did not. Both paths now correctly return focus.
- **Background inert**: `<main>`, `<footer>`, and the header's logo link (the one element outside the drawer that remains focusable/perceivable at mobile viewport widths — the desktop nav and CTA button are already `display:none` at that width and were never reachable) are marked `inert` while the drawer is open, and restored on close. This addresses the second confirmed gap from the audit: screen-reader users navigating by virtual cursor (not just Tab) could previously still reach content visually hidden behind the drawer.
- Fixed a real sequencing bug I introduced while building the fix above and caught before finishing: calling `.focus()` on the trigger button immediately after `setIsOpen(false)` would silently fail if the button was still marked `inert` at that exact moment (React's effect cleanup — which un-inerts it — runs after the synchronous handler code, not before). Fixed by explicitly clearing `inert` on the button right before focusing it, in both the Escape handler and the Close button's handler, rather than relying on the effect cleanup's timing.
- No visual/CSS change of any kind — same markup, same classes, same rendered appearance in both open and closed states.

**Not verified by a real browser or screen reader** — this is behavioral JavaScript logic that needs an actual keyboard-only pass and a screen reader (VoiceOver/NVDA) pass once a real environment is available. I traced the logic by hand for correctness (documented above) but that is not a substitute for testing it.

## 4. Contact form accessibility

`components/forms/ContactForm.tsx`:

- Added a visually-hidden (`sr-only`) `aria-live="polite"` region that announces "Your enquiry could not be sent. Please review the highlighted fields below." when a field-validation failure occurs — this fills the gap where individual field errors were only ever discoverable by tabbing back to that specific field.
- Added programmatic focus movement: after a failed submission, focus moves to the first invalid field (in visual/tab order), or to the form-level error message (now given `tabIndex={-1}` so it's programmatically focusable) if the failure has no specific field errors.
- The pre-existing `role="alert"` on the form-level error message was left as-is (it already announces correctly on its own) — the new live region only covers the field-errors case, to avoid two overlapping announcements for the same event.
- **Zero visual change and zero copy change** — the live region is invisible by design (`sr-only`), and no visible text, label, or layout was touched.

Same caveat as §3: this needs a real screen-reader pass to confirm the announcement timing and content are heard as intended — I've implemented and reasoned through the standard pattern, not observed it running.

## 5. Responsive image loading

Added an explicit, context-accurate `sizes` value to all 8 `EditorialImage` call sites (previously all 8 used the same `100vw` default regardless of actual rendered width):

| Context | Value | Files |
|---|---|---|
| Full-bleed hero (About/interior pages) | `100vw` | `components/sections/PageHero.tsx` |
| Half-width editorial split (Home hero, Home/Markets/About text+image sections) | `(min-width: 1024px) 50vw, 100vw` | `components/sections/HomeHero.tsx`, `app/page.tsx`, `app/markets-partnerships/page.tsx`, `app/about/page.tsx` |
| Business Areas grid (3-col desktop / 2-col tablet / 1-col mobile) | `(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw` | `components/sections/BusinessAreaBlock.tsx` |
| Leadership grid (4-col desktop / 2-col tablet / 1-col mobile, both variants) | `(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw` | `components/sections/LeadershipProfile.tsx` (both the home and full variants) |

No change to any crop, composition, focal point, or aspect ratio — `sizes` only affects which image resolution the browser requests, not what's displayed.

## 6. Low-risk confirmed fixes

- **`Reveal.tsx`**: fixed the `IntersectionObserver` cleanup bug — the callback was returning a cleanup function that the browser API silently discards (that's a `useEffect` pattern, not something `IntersectionObserver` callbacks support). Moved the timer into a variable captured by the effect's own (real) cleanup function. Zero behavior change today since `delayMs` is never used with a non-zero value anywhere in the app; this only matters if it is in the future.
- **`lib/rate-limit.ts`**: replaced the non-null assertion (`existing[0]!`) with an explicit fallback (`oldestAttempt ?? now`). Previously safe only because `maxAttempts` happens to be hardcoded to 5 today; now safe regardless of that constant ever changing. No behavior change under the current configuration.
- **`components/forms/HoneypotField.tsx`**: corrected the doc comment, which incorrectly claimed the field was "not aria-hidden" when the code has always correctly used `aria-hidden="true"` (the right choice for a honeypot — the comment was simply wrong).
- **`lib/validation.ts`**: corrected the doc comment claiming the shared Zod schema is used client-side — it never has been (verified: no import of it exists anywhere in `components/`). The comment now accurately describes server-side-only validation as the current, intentional design. **No client-side validation was added** — per your instruction, this stage only corrected the false claim, it didn't implement what the claim described.

## 7. Security configuration review

No changes made to `next.config.ts`. The existing headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) are unchanged. No HSTS, no site-wide CSP added, per your explicit instruction.

**Documented for the later deployment stage** (not implemented now):
- `Strict-Transport-Security` — should be added once the production domain and hosting platform are confirmed; several hosts (e.g. Vercel) add this automatically, which is worth checking before assuming manual configuration is needed.
- A real site-wide `Content-Security-Policy` — the existing `contentSecurityPolicy` value in `next.config.ts` is scoped only to Next's image-optimization endpoint, not the whole site. Worth a deliberate, separate pass once the actual script/style/font sources for production are finalized (analytics, if ever added, would need to be reflected here).
- The `x-forwarded-for` trust-boundary question flagged in the original audit (rate-limit identifier spoofing risk) is a hosting-configuration decision, not a header — still outstanding, tracked below.

## 8. Verification performed (and its limits)

Done:
- Structural typecheck (stub-based, strict flags matched) — clean.
- `eslint.config.mjs` syntax validity — confirmed.
- `HTMLElement.inert` type availability — confirmed against a real `lib.dom.d.ts`.
- Static HTML/CSS reconstruction re-rendered and re-screenshotted — zero horizontal overflow on any of the 6 main pages at mobile width.
- Manual, careful trace-through of the mobile-drawer and contact-form logic for correctness (documented in §3/§4).
- Confirmed via diff/review that no approved copy, layout, color token, or typography value was touched anywhere in this stage.

**Not done, because this sandbox cannot do them:**
- Real `npm install`/`typecheck`/`lint`/`build`
- Running the site locally in a real browser
- Testing all routes in an actual running app
- Real keyboard-only navigation testing
- Real invalid-contact-form-submission testing
- Real screen-reader testing

These are the same category of gap flagged in the original audit and in every prior phase of this project — not new limitations introduced by this stage.

## Modified Files

`eslint.config.mjs` (new), `package.json`, `components/layout/Header.tsx`, `components/layout/MobileNavigation.tsx`, `components/forms/ContactForm.tsx`, `components/ui/Reveal.tsx`, `lib/rate-limit.ts`, `components/forms/HoneypotField.tsx`, `lib/validation.ts`, `app/page.tsx`, `app/about/page.tsx`, `app/markets-partnerships/page.tsx`, `components/sections/HomeHero.tsx`, `components/sections/PageHero.tsx`, `components/sections/BusinessAreaBlock.tsx`, `components/sections/LeadershipProfile.tsx`.

## Remaining Production Blockers (unchanged from the original audit — none of these were in Stage 1's scope)

- Contact form cannot deliver email or enforce rate limiting in production — no real provider implemented for either (Stage 2, per your direction).
- `NEXT_PUBLIC_SITE_URL` fallback is an unconfirmed placeholder domain, not a verified production domain.
- The `x-forwarded-for` trust boundary depends on the real hosting platform, not yet chosen/confirmed.
- Real `npm install`/`build` has still never been run for this codebase.
- All approval-dependent content (contact details, photography, logo variants, legal copy, analytics) — unchanged, tracked in `content/placeholders.ts`.

## Confirmation

- **Frozen design**: unchanged. No color, typography, spacing, layout, or component-personality value was touched anywhere in this stage — every change was either invisible (accessibility/behavioral logic, image-loading hints) or a corrected code comment.
- **Approved copy**: unchanged. No content file (`content/*.ts`) was touched in this stage.
- **Information architecture**: unchanged. No route, page, or navigation structure was added, removed, or reordered.
- **No features added**: confirmed — every change in this stage is a fix to something already built (a missing config, a missing accessibility behavior, an inaccurate comment, a missing loading hint), not new functionality.

Stopping here for review, as instructed.
