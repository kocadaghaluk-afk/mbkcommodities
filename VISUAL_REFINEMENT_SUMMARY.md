# Visual Refinement Pass — Summary

Responding to: "the logo feels pasted on" and "this reads as generic dark corporate, not MBK."

## 1. Logo integration
Replaced the boxed light scrim with a soft drop-shadow glow (`filter: drop-shadow(...)` applied directly to the PNG, three stacked shadows for a soft halo). Because `drop-shadow` respects the image's alpha channel, the glow hugs the actual letterforms and ribbon — there's no visible rectangle, no hard edge, no "sticker." It reads as the mark catching light against the dark hero rather than a label placed on top of it. Same contrast-guarantee purpose the Brand Bible names in 4.6, just without the boxed execution that prompted the feedback.

## 2. Brand color presence
The system was technically correct but under-expressed. Changes, in order of impact:

- **Every primary button on the site is now filled Maroon**, not Ink. This is the single biggest change — it means "Contact MBK," every business-areas CTA, the contact form's submit button, and the mobile menu's CTA all carry the brand's signature color. (Buttons that sit directly on the dark hero photo stay white-filled — the Brand Bible's own contrast table flags Maroon-on-Ink as too low-contrast to use there, so that exception is intentional, not an oversight.)
- **Eyebrow labels now carry the logo's own Signal Cyan** on dark surfaces (was a washed-out white) and gained a small 2px accent rule beneath them — the "one permitted graphic flourish" the Bible describes but that hadn't actually been built yet. This appears on every hero and section header site-wide.
- **Inline text links** ("About MBK," "Explore Our Business Areas," etc.) are now Teal, matching the Bible's explicit "link color on light backgrounds" — previously they were plain ink+underline with no brand color at all.
- **The Home hero photograph now carries a quiet Teal Deep color-grade** (a multiply-blend cast), rather than a neutral ink tint — a restrained nod to the Bible's own photography direction ("the Maroon/Teal family pulled forward in accents").
- **The footer now sits on a pale Teal Tint** rather than plain neutral Paper — a subtle, consistent brand touch on every single page, at the one point where a page always closes.
- **Recolored every placeholder illustration** (hero, all five business-area images, all four leadership portraits, markets, about) — they still had the old retired gold-accent color baked in from before the Brand Bible existed. Same shapes, no new illustrations — just brought current.
- **Favicon background changed to Maroon** — a small but real touchpoint (browser tab, bookmarks).

## What I deliberately did NOT do
- No colored borders on Business Area or Leadership cards. The Brand Bible caps the "accent rule" flourish at one per view — a card grid showing five or four of them at once would be the overuse you asked me to avoid.
- No color change to the Home hero's own background (still Ink) or the dark mobile drawer panel — neutrals need to keep carrying the majority of every view; the color now shows up in the deliberate, smaller places (buttons, labels, links, footer, photography) rather than as a wash across large surfaces.
- Didn't touch copy, layout, or add any new component structure — this was a color/detail pass only.

## Verification
Same honest caveat as before: my image-preview tool isn't rendering visuals back to me this session, so I verified every change by sampling actual pixel colors from the rendered screenshots (confirmed Maroon in buttons/logo, Cyan in eyebrows, Teal in links, Teal Deep in the hero image cast and footer) rather than by eye. One real bug did turn up this way and got fixed before delivery: the static preview's footer color wasn't actually applying because of a missing CSS variable — worth mentioning since it's exactly the kind of thing that's easy to miss without this kind of check.

Screenshots are attached — please give them a real look before we move on.
