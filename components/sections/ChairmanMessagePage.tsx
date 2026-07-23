import { Eyebrow } from "@/components/ui/Eyebrow";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { chairmansMessage } from "@/content/chairmans-message";

/**
 * Standalone /chairmans-message page layout.
 *
 * Deliberately its own dedicated composition rather than the site's usual
 * PageHero + contained section pattern — approved specifically to give
 * this institutional statement real visual presence, while still reusing
 * the same design tokens (color, type, spacing) as everywhere else.
 *
 * DOM order is portrait-first, text-second (mobile requirement) — but at
 * the lg breakpoint the text panel is reordered to the left and the
 * portrait to the right via CSS `order`, matching the approved
 * text-left/portrait-right desktop composition without needing separate
 * mobile/desktop markup. This is the same responsive-image-sizing
 * technique already established in HomeHero.tsx (fixed aspect ratio on
 * mobile, full computed height at desktop) — not a new pattern.
 *
 * The portrait intentionally keeps its natural color here — unlike the
 * Leadership page/preview, which remain grayscale and untouched.
 */
export function ChairmanMessagePage() {
  const { eyebrow, heading, paragraphs, signature, imagePath, imageAlt } = chairmansMessage;

  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-2">
        <div className="order-2 flex flex-col justify-center px-6 py-16 sm:px-10 sm:py-20 lg:order-1 lg:px-16 lg:py-24">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 font-serif text-[length:var(--text-h1)] font-medium leading-[1.1] tracking-[-0.01em]">
            {heading}
          </h1>
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="mt-5 max-w-[60ch] text-[length:var(--text-body-l)] leading-relaxed text-muted"
            >
              {paragraph}
            </p>
          ))}
          <p className="mt-8 font-serif text-lg font-medium">{signature.name}</p>
          <p className="mt-1 text-sm text-muted">
            {signature.title}, {signature.company}
          </p>
        </div>

        <div className="order-1 aspect-[4/5] lg:order-2 lg:aspect-auto lg:h-[85vh]">
          <EditorialImage
            src={imagePath}
            alt={imageAlt}
            aspectRatio="auto"
            className="h-full w-full"
            focalPoint="center 20%"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
