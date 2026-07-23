# MBK Holding Commodities — Corporate Website

Official corporate website for MBK Holding Commodities, built to the approved
specification in the project documentation (`01_Project_Context.md` through
`08_Claude_Handover.md`).

## Stack

- Next.js 15 (App Router), TypeScript, React 19
- Tailwind CSS v4 (CSS-first `@theme` configuration — see `styles/globals.css`)
- Zod for form validation
- No CMS, no analytics, no client-side state libraries in v1

## ⚠️ Build status note

This project was authored in a sandboxed environment **without package-registry
network access**, confirmed repeatedly including immediately before this
delivery (`npm install` returns `403 host_not_allowed` against
registry.npmjs.org). **This project has not been called "build-ready."**

What has been verified without network access:
- Every `content/*.ts` file typechecks cleanly (only the expected
  `@types/node`-pending `process` diagnostic).
- The full `app/`, `components/`, `lib/` tree typechecks against stub
  declarations with no real logic/syntax errors found.
- Every route has been visually verified via a hand-built static HTML/CSS
  reconstruction using the real approved copy, screenshotted at all six
  required viewports with a locally-cached Chromium (see
  `static-preview/screenshots/` and `HANDOVER_REPORT.md` for details and
  caveats — this is a visual stand-in, not the compiled Next.js output).

**Before deploying, run in an environment with registry access:**

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

Treat that `npm run build` as the actual verification step. See
`HANDOVER_REPORT.md` Section 1 for the full detail on what has and hasn't
been checked.

## Getting started

```bash
cp .env.example .env.local   # then fill in approved values
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Project structure

```text
app/                  Routes (App Router), one folder per page
components/
  layout/             Header, MobileNavigation, Footer, SkipLink
  sections/           Page-level building blocks (PageHero, CTASection, etc.)
  ui/                 Small reusable primitives (Button, Container, etc.)
  forms/              Contact form and its field components
content/              All editable copy, leadership data, business areas,
                       SEO metadata, and the internal placeholder registry
lib/                  Metadata helper, validation, server action, rate
                       limiting, email provider interface, JSON-LD, fonts
public/               Brand assets and placeholder imagery
styles/               Tailwind v4 entry + design tokens
```

## Content updates

Almost everything a non-developer would want to change lives in `content/*.ts`:

- **Copy**: edit the relevant file in `content/` (e.g. `content/about.ts`).
- **Leadership**: edit `content/leadership.ts`. Titles are centrally
  configurable there.
- **Business areas**: edit `content/business-areas.ts`. All five areas
  (Energy, Precious Metals, Natural Resources & Mining, Industrial
  Commodities, Chemicals & Petrochemicals) share the same data shape and
  render with equal visual weight — do not special-case one.
- **Contact details**: set `CONTACT_EMAIL`, `CONTACT_TELEPHONE`, and
  `CONTACT_LINKEDIN_URL` in your environment once approved. Until set, the
  corresponding row is **omitted** from the public site rather than shown as
  a placeholder — this is intentional (see `content/contact.ts`).
- **Images**: replace the files under `public/images/**` and
  `public/brand/**` with approved assets, keeping the same filenames (or
  update the `imagePath` fields in the relevant `content/*.ts` file if
  filenames change).

## Placeholder & approval tracking

`content/placeholders.ts` is an **internal-only** registry (never imported by
public pages) enumerating every placeholder asset and every value still
pending approval. Use `outstandingApprovals()` and `placeholderAssets()` from
that file to regenerate an up-to-date list at any time.

## Contact form — production readiness

The contact form is functional today for **development and layout review**,
but is intentionally not production-ready yet:

1. **Email delivery**: no provider is selected. `lib/email-provider.ts`
   currently uses a demo handler that logs the enquiry and returns
   `isDemoMode: true` rather than falsely claiming delivery. Implement a real
   provider there once one is approved, and set `EMAIL_PROVIDER`.
2. **Rate limiting**: `lib/rate-limit.ts` uses an in-memory limiter in
   development only. It will throw clearly in production until a real
   persistent provider is implemented and `RATE_LIMIT_PROVIDER` is set — this
   is deliberate, not a bug.
3. **Privacy Policy**: `app/privacy/page.tsx` is a placeholder pending legal
   review. **Do not publish the contact form to production until the Privacy
   Policy has been legally approved**, since the form's consent checkbox
   links to it.

## Deployment

Target: Vercel or any modern Node 20+ host.

1. Set all required environment variables from `.env.example` in your
   hosting provider's dashboard (do not commit `.env.local`).
2. Run the verification sequence above.
3. Deploy the `main` branch / production build.
4. Confirm `/sitemap.xml` and `/robots.txt` resolve correctly against the
   real `NEXT_PUBLIC_SITE_URL`.

## Outstanding approvals

See the handover report provided alongside this repository for the current
list of items awaiting MBK approval (contact details, final imagery,
leadership portraits, brand assets, legal copy).
