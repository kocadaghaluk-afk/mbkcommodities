import type { NextConfig } from "next";

/**
 * Conservative production CSP. Two intentional, documented trade-offs
 * rather than silent gaps:
 *
 * - script-src includes 'unsafe-inline' solely because app/layout.tsx
 *   renders one inline <script type="application/ld+json"> block (the
 *   Organization structured data). CSP's script-src governs that tag
 *   regardless of its non-executable type, and there's no nonce/hash
 *   pipeline in place yet to allow it more precisely. A future
 *   improvement would be a per-request nonce via middleware.
 * - style-src includes 'unsafe-inline' because at least one component
 *   (the world map's marker pins) uses an inline `style` attribute for a
 *   drop-shadow filter, which CSP's style-src also governs.
 *
 * Resend and Upstash need no entry here at all: both are called from
 * server-side code (a Server Action running in Node.js), never from the
 * browser, so they're entirely outside what CSP can or needs to govern.
 * next/font self-hosts Google Fonts at build time (no runtime request to
 * fonts.googleapis.com/fonts.gstatic.com), so font-src needs only 'self'.
 *
 * Applied production-only (see headers() below) so local development —
 * where Next's dev server has its own script/eval requirements — is
 * completely unaffected.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Local placeholder assets only. Add approved remote MBK asset domains
    // here once real photography / brand files are supplied.
    formats: ["image/avif", "image/webp"],
    // Placeholder imagery and brand marks are locally-authored SVGs (see
    // content/placeholders.ts). Restricting the CSP to same-origin keeps
    // this safe; revisit once real raster photography replaces SVG
    // placeholders, at which point this can likely be removed.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    // VERCEL_ENV, not NODE_ENV: Vercel Preview builds also run with
    // NODE_ENV=production, so NODE_ENV alone can't distinguish a Preview
    // deployment from genuine Production. This mirrors the same check
    // used for the indexing guard in lib/metadata.ts.
    //
    // Known limitation: VERCEL_ENV is only ever set on Vercel's platform.
    // If this project is ever deployed to non-Vercel Node hosting, these
    // production-only headers would never activate under this check —
    // that would need a different condition at that point.
    const isVercelProduction = process.env.VERCEL_ENV === "production";

    const baseHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];

    // HSTS and CSP are production-only. HSTS specifically must never be
    // sent in development — it's a browser-cached directive that would
    // force HTTPS for the serving origin (including localhost) for the
    // duration of max-age, which would break a plain-HTTP local dev
    // server for anyone who'd loaded the site with this header present.
    // No `preload` directive — that's a separate, much harder-to-reverse
    // commitment (submission to browser preload lists) that shouldn't be
    // enabled as a side effect of a headers config change.
    const productionOnlyHeaders = isVercelProduction
      ? [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
        ]
      : [];

    return [
      {
        source: "/:path*",
        headers: [...baseHeaders, ...productionOnlyHeaders],
      },
    ];
  },
};

export default nextConfig;
