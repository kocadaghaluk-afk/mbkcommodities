# Sprint — Executive Presence — Summary

Guiding question for every change below: would an executive from a major bank, producer, sovereign fund, or trading house immediately read this as institutional, or would some detail still read as a marketing site?

## Business Areas — removed the "feature card" pattern
The bordered, boxed card (image + padded box + rounded corners) was the single biggest offender — it's the exact pattern SaaS marketing sites use for feature grids. Replaced with an editorial block: image, generous whitespace, a hairline rule, then heading and copy — closer to an illustrated section in a report than a tile in a grid. No border, no box background, no rounded card shape. Grid gaps roughly doubled (24px → 56px/64px) for real breathing room between sectors. Image aspect ratio changed from 4:3 (a "product shot" ratio) to 3:2 (documentary/editorial photography's classic ratio).

## Leadership — full monochrome portraits, no card boxing
Two changes doing most of the work here:
- **Portraits are now fully monochrome**, not lightly desaturated. This is a deliberate, well-established device — board and leadership pages at serious institutions use black-and-white photography; color headshots read as "team page." It immediately separates "who leads this company" from "who works here."
- **Removed the bordered card** on the full Leadership page (it already wasn't boxed on the Home preview) — same hairline-rule-plus-whitespace treatment as Business Areas, for one consistent editorial language across both.

Governance order is still expressed only through page sequence, per the Brand Bible's Portrait Rules — nothing here changes card size or treatment between the Chairman and the COO.

## Markets & Partnerships — editorial index instead of a bulleted checklist
The small cyan dot-bullet list read as a decorative UI checklist, not a considered presentation of where MBK operates. Replaced with a serif, hairline-divided index — the same device an annual report uses to list markets or holdings. No dots, no icons, no map graphics; regions and counterparty categories are presented as a typographic list, not a decorated one.

## Editorial image treatment (site-wide)
Added a shared, quiet color grade (`EditorialImage`, new `grade` prop, on by default) — a small desaturation and contrast lift applied to every photograph except leadership portraits (which get the stronger monochrome treatment above) and the Home hero (which already had its own Teal color-grade from the prior sprint). The point: when real photography replaces these placeholders, it inherits this same grade automatically and the whole site reads as one coherent, considered photographic set — nobody has to remember to apply it per page.

## A genuine Bible violation found and fixed
While reviewing these three pages I found two components (About's "Our Approach" columns, Home's "How MBK Works" steps) using a 2px neutral divider rule. The Brand Bible reserves 2px borders exclusively for the one eyebrow accent flourish — everywhere else is 1px. Fixed both to hairline, which is also simply quieter, consistent with this sprint's direction. Also reduced the contact form's success-state top rule from 2px to 1px for the same reason.

## What stayed exactly as approved
No copy changed anywhere. No sections added or removed. No change to navigation, header, buttons, or color tokens — this sprint was about how existing photography and content are presented, not what exists. Business Areas and Leadership still show the same five sectors and four profiles in the same order.

## Files modified
`components/sections/BusinessAreaBlock.tsx`, `components/sections/LeadershipProfile.tsx`, `components/sections/RegionList.tsx`, `components/ui/EditorialImage.tsx`, `app/markets-partnerships/page.tsx`, `app/about/page.tsx` (border-width fix only), `components/sections/HowMBKWorks.tsx` (border-width fix only), `components/forms/ContactForm.tsx` (border-width fix only).

## Technical notes
- Structural typecheck: clean (only the same pre-existing stub-limitation noise seen in every prior pass).
- `npm install`/build: still blocked in this sandbox — same standing limitation, not new.
- Verification: pixel-sampled the rendered screenshots — confirmed leadership portraits are ~92% true grayscale in the sampled region, confirmed the cyan decorative dots are gone from the Markets page. Same caveat as every prior round: my image-preview tool isn't rendering visuals back to me this session, so this was a programmatic check, not a look. Screenshots (desktop + mobile, all three focus pages) are attached for direct review.

Stopping here for review, as instructed.
