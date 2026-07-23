# Stage 2A — Accessibility Hardening — Summary

## Exact command results

I re-ran `npm install` in this sandbox before starting, as I do at the start of every stage. Same result as every prior attempt:

```
$ npm install
npm error code E403
npm error 403 403 Forbidden - GET https://registry.npmjs.org/@eslint%2feslintrc
```

**This sandbox still has no package-registry access.** I could not run `npm run typecheck`, `npm run lint`, or `npm run build` for real, and I am not representing otherwise. Everything below marked "verified" was verified by source review, isolated logic tracing, and a structural typecheck harness (stub type declarations standing in for packages that can't be installed) — not by the real toolchain. Where you report the real toolchain already passed (install/typecheck/lint/build all green), that's the authoritative result; this stage's job was to find and fix things a green build doesn't catch, since type-safety and accessibility are different concerns.

## 1. Mobile navigation — verified and hardened

Reviewed the Stage 1 implementation line by line against every item in your checklist:

| Requirement | Status | Detail |
|---|---|---|
| Focus moves into drawer on open | Already correct | Confirmed in the effect — queries the first focusable element and focuses it |
| Tab/Shift+Tab trapped inside | Already correct | Re-queries focusable elements fresh on every keypress, doesn't rely on a stale cached list |
| Escape closes | Already correct | — |
| Close button closes | Already correct | — |
| Focus returns to trigger | Already correct (fixed in Stage 1) | Both the Escape path and the Close-button path explicitly clear the trigger's `inert` flag *before* calling `.focus()` — calling focus on a still-inert element silently fails, which was a real sequencing bug caught and fixed last stage |
| Background inert while open | Already correct | `<main>`, `<footer>`, and the header's logo link (the one element outside the drawer still reachable at mobile widths) |
| Inert restored on close/unmount | Already correct | Handled by the effect's cleanup, which runs on both the isOpen→false transition and true unmount |
| Body scroll locked and restored | **Hardened this stage** | Previously cleared `overflow` to an empty string unconditionally on close. Now captures whatever the value was *before* locking and restores exactly that, so a future change elsewhere that sets body overflow for another reason can't be silently clobbered |
| Current-page indication in the drawer | **Fixed this stage — real gap found** | The desktop nav has had `aria-current="page"` since Phase 1; the mobile drawer's nav links never did. Added `usePathname()` + `aria-current` to the drawer nav — no visual change, since the underlying defect (missing programmatic indication) doesn't need one to fix |

**Repeated open/close cycles**: traced through the state machine by hand — each open freshly re-queries the DOM and re-attaches everything; nothing persists across cycles that could accumulate or leak (confirmed no stale listeners, no orphaned inert flags).

**Route navigation from inside the drawer**: clicking a nav link closes the drawer (via its own `onClick`) and lets Next.js's client-side navigation proceed. I did not add explicit focus-restoration for this path — a full page/route change is happening, and Next.js's App Router has its own built-in route-change focus/announcement behavior for exactly this case, so layering a second, possibly-conflicting focus management scheme on top isn't appropriate. This is a judgment call, not an oversight — flagged as something to specifically verify with a real screen reader (see §6).

## 2. Contact form accessibility — verified and hardened

| Requirement | Status | Detail |
|---|---|---|
| Invalid submission announced | Already correct (Stage 1) | Visually-hidden live region |
| Focus to first invalid field / error summary | Already correct (Stage 1) | — |
| Field errors connected via aria-describedby | Already correct | Pre-existing, confirmed still intact |
| Form-level failure uses alert/live-region | Already correct | `role="alert"` on the form-level message |
| **Successful submission feedback announced** | **Hardened this stage** | The success message used `role="status"` (implicit `aria-live="polite"`), but a live region that's *newly mounted* (replacing the whole form) isn't guaranteed to be announced by every screen reader/browser combination the same way a text update to an *already-present* region is. Added explicit focus movement to the success message (`tabIndex={-1}` + focus on the success-state transition) so it's reliably discovered regardless of that nuance — the same technique already used for the error case |
| **Loading/submitting state via aria-busy** | **Added this stage** | `useFormStatus()` can only be read inside a component rendered *inside* the `<form>` — not in the component that defines the form. Added a small internal helper component (`FormBusyState`) that reads `pending` correctly (as a form descendant) and reflects it onto the `<form>` element itself via a shared ref, since the state has to be read from inside but applied to an ancestor |
| Submit cannot create duplicate submissions | Verified, no change needed | The submit button is `disabled` while `pending`. Per HTML spec, an implicit submit (pressing Enter in a text field) targets the form's default button — if that button is disabled, the implicit submit doesn't fire, so this is covered by native browser behavior, not something that needs custom JS |
| Keyboard order logical | Verified | Matches visual/tab order: name → company → position → email → country → subject → message → consent → submit |
| Consent-checkbox errors announced | Verified | Already wired via `aria-describedby`, and `consent` is included in the first-invalid-field focus logic added in Stage 1 |

**No copy changed** — every addition here is either invisible (`sr-only` regions, `aria-busy`, `aria-current`) or purely behavioral (focus movement). I checked this by diffing every visible string in the component against the previous version.

## 3. Keyboard-only review

Performed as a **source-level trace**, not a real keyboard session (no browser available here). Reviewed every route's rendered structure:

- **Skip link**: visually hidden until focus, jumps to `#main-content` — confirmed present in the root layout, applies to all 8 routes.
- **Header navigation**: all links and the CTA button use native `<a>`/`<button>` elements (never a `<div onClick>` masquerading as one), so native keyboard operability is guaranteed rather than reconstructed.
- **Mobile navigation**: covered in §1.
- **Buttons and text links**: the shared `Button` component and all inline text links use real `<a>`/`<button>` elements with the site-wide `:focus-visible` outline (Signal Cyan Muted, verified in an earlier phase as accessible on both light and dark backgrounds) — never suppressed anywhere in the codebase (confirmed via a full-project search for `outline: none` / `outline-style: none`, found none).
- **Contact form**: standard tab order through native form controls, confirmed above.
- **Privacy/Terms links**: plain `<Link>` components in the footer and the consent checkbox — no custom interaction logic to audit.
- **Footer navigation**: plain link lists inside the `<footer>` landmark — fully keyboard-operable by default, nothing custom to break.

**No keyboard traps found** other than the intentional modal trap in the mobile drawer. **No unreachable controls found** — every interactive element is a native focusable element or has a correct explicit role. **No unexpected focus loss found** by trace, though this is exactly the category of finding that benefits most from real device testing (see §6) — a source review can confirm the code *intends* correct focus behavior, not that every browser executes it identically.

## 4. Semantic and ARIA review

- **Landmarks**: exactly one `<header>`, one `<main>`, one `<footer>` per page (all in the root layout — can't accidentally duplicate per-page). Two `<nav>` elements can exist (`aria-label="Primary"` desktop, `aria-label="Mobile"` in the drawer), each uniquely labeled and never both present in the accessible tree simultaneously in a confusing way (the mobile nav only exists in the DOM while the drawer is open).
- **Heading hierarchy**: traced every route. Every page has exactly one `<h1>` (via `HomeHero`, `PageHero`, or `LegalPageShell`), followed by `<h2>` section headings, followed by `<h3>` card-level headings where applicable — confirmed no skipped levels anywhere (h1→h3 without an intervening h2 does not occur on any route).
- **Navigation labels**: confirmed distinct, descriptive labels on both nav landmarks.
- **Dialog labeling**: `role="dialog"` + `aria-modal="true"` + `aria-label="Site navigation"` on the mobile drawer — correct, complete pattern.
- **Form labels**: every field has an associated, visible, persistent `<label>` (never placeholder-only) — confirmed in `FormField.tsx`/`ConsentCheckbox.tsx`.
- **Image alt text**: every image's alt text flows through the content layer (`imageAlt`/`portraitAlt` fields) — spot-checked several, all descriptive and honestly labeled as placeholders rather than implying real photography exists.
- **Decorative image treatment**: 14 confirmed `aria-hidden` usages across icons, the eyebrow accent rule, hero sentinel divs, and SVG icons — none of these carry meaning that would need to reach assistive technology.
- **Current-page indication**: fixed the mobile-drawer gap (§1); desktop was already correct.
- **Duplicate/unnecessary ARIA**: searched the whole project for redundant roles (`role="button"` on a `<button>`, `role="navigation"` on a `<nav>`, etc.) — found none. Native semantic HTML is used throughout rather than reconstructed via ARIA, consistent with your stated preference.
- **Footer link groups**: deliberately *not* wrapped in additional `<nav>` landmarks. The footer's link lists are plain `<ul>`s inside the `<footer>` (contentinfo) landmark — this is correct, common practice; wrapping every link group in its own `nav` would create landmark clutter (a user navigating by landmark would encounter five or six navigation regions instead of two) without a real accessibility benefit. Reviewed and confirmed as correct-as-is, not changed.

## 5. Reduced motion — verified, no code change needed

Traced the CSS cascade carefully rather than assuming: `.reveal`/`.image-scale-in`'s base (hidden) and `[data-revealed="true"]` (visible) states are declared inside `@layer utilities`. The `@media (prefers-reduced-motion: reduce)` override block is **not** wrapped in any `@layer` — under the CSS cascading-layers specification, unlayered rules always win over layered ones regardless of specificity or source order. That means the reduced-motion override reliably wins in every case: before JavaScript has run, after it's run, regardless of the `data-revealed` attribute's value. Confirmed:
- Reveal animations disabled: yes, unconditionally.
- Image-scale settling prevented: yes, same mechanism.
- Content immediately visible: yes — the override doesn't depend on the IntersectionObserver having fired at all.
- Focus/interaction feedback unaffected: the reduced-motion block only forces `animation-duration`/`transition-duration` near-zero and doesn't touch `:focus-visible` outlines or disable hover/focus state changes themselves — only the animated transition *between* states is shortened, not the states.

## 6. Real testing — what I could and couldn't do here

**Could not perform in this sandbox** (no real browser, no real device, no screen reader, no registry access): desktop keyboard testing in an actual browser, mobile-width keyboard testing on a real viewport, Safari VoiceOver testing, real invalid/successful form-state testing against a running dev server, real repeated-drawer-cycle testing in a browser, and the real `npm run typecheck`/`lint`/`build` commands.

**What I did instead**: full structural typecheck with the project's actual strict settings (`strict: true`, `noUncheckedIndexedAccess: true`, `noUnusedLocals`, `noUnusedParameters`) against stub type declarations — clean, no new errors from anything in this stage. Manual, careful trace-through of every stateful interaction (documented in §1–§5). Re-ran the static HTML/CSS visual reconstruction used throughout this project to confirm zero layout regression on all 6 main pages at mobile width.

Since you've reported the real toolchain now passes install/typecheck/lint/build in your environment, the highest-value next step is exactly the real-device/browser/screen-reader testing listed above — that's genuinely outside what I can verify from here, and I want to be direct about that rather than imply otherwise.

## Modified files

`components/layout/MobileNavigation.tsx` (body-overflow restoration hardening, `aria-current` fix), `components/forms/ContactForm.tsx` (success-state focus management, `aria-busy` via a new small `FormBusyState` helper component).

That's the complete list — two files. Everything else in this stage was verification that confirmed the Stage 1 work already met the requirement, documented above rather than re-implemented.

## Remaining accessibility risks, by severity

| Severity | Risk | Why it remains |
|---|---|---|
| Medium | Screen-reader behavior for the drawer's focus trap, inert background, and the contact form's live regions is unverified against a real screen reader | Requires real VoiceOver/NVDA testing — the single most valuable next test given how much of this stage's work is screen-reader-specific |
| Medium | Focus behavior after client-side route navigation from inside the mobile drawer relies on Next.js's built-in route-focus handling, which I have not observed running | Requires a real browser + keyboard test across an actual route change |
| Low | `aria-controls="mobile-nav-panel"` on the toggle button references an element that doesn't exist in the DOM while the drawer is closed (a pre-existing pattern, not introduced this stage) | Common, generally tolerated pattern since `aria-expanded` already conveys state; flagged for awareness, not fixed, since it wasn't a confirmed defect and fixing it would mean always rendering the (visually hidden) panel markup — a structural change beyond this stage's scope |
| Low | Footer's link groups aren't individually labeled as `nav` landmarks | Deliberate, reviewed choice (§4), not a defect |
| Informational | Color contrast was previously verified analytically (Brand Bible figures) and via the design tokens; a real axe DevTools / browser contrast check against actual rendered pixels is still worth doing once real photography replaces placeholder illustrations, since photography behind text overlays is the one place contrast could shift in ways token math doesn't predict | Requires real photography (out of scope for this stage) and a real browser tool |

Stopping here for review, as instructed.
