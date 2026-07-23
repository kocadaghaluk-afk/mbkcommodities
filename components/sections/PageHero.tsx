import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EditorialImage } from "@/components/ui/EditorialImage";

interface PageHeroProps {
  eyebrow: string;
  headline: string;
  intro?: string;
  imagePath?: string;
  imageAlt?: string;
  actions?: ReactNode;
  /**
   * CSS object-position for the hero image. Defaults to an upward bias
   * because the text panel always sits at the bottom of this hero — the
   * upper two-thirds of the frame is what actually stays visible, so the
   * crop should favor whatever the photograph's real subject is up there
   * rather than centering blindly.
   */
  imageFocalPoint?: string;
}

/**
 * Renders a #hero-sentinel element at its base so the global Header can
 * observe when the hero has scrolled past and switch from transparent to
 * solid, without a scroll event listener.
 *
 * Used for all interior page heroes (About, Business Areas, Leadership,
 * Markets & Partnerships, Contact). The Home page uses HomeHero instead.
 */
export function PageHero({
  eyebrow,
  headline,
  intro,
  imagePath,
  imageAlt,
  actions,
  imageFocalPoint = "center 25%",
}: PageHeroProps) {
  return (
    <section className="relative min-h-[60vh] flex items-end">
      {imagePath && (
        <div className="absolute inset-0">
          <EditorialImage
            src={imagePath}
            alt={imageAlt ?? ""}
            aspectRatio="auto"
            className="h-full w-full"
            priority
            overlay
            animate={false}
            focalPoint={imageFocalPoint}
            sizes="100vw"
          />
          {/* Same quiet Teal Deep color-grade cast used on the Home hero
              (Brand Bible, Section 5: Photography Direction) — every
              full-bleed photographic hero on the site now shares one
              consistent grade rather than each having its own treatment. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-teal-deep/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-ink/35" aria-hidden="true" />
        </div>
      )}

      <Container
        className={`relative z-10 pb-16 pt-40 md:pb-20 ${
          imagePath ? "text-white" : "text-ink"
        }`}
      >
        <Eyebrow light={Boolean(imagePath)}>{eyebrow}</Eyebrow>
        {/*
          Headline width is governed by the container, not a rigid
          character clamp (Brand Bible 3.1: Display/H1 are controlled by
          word count, manual line breaks, and container width).
        */}
        <h1 className="mt-5 max-w-[720px] font-serif text-[length:var(--text-h1)] font-medium leading-[1.1] tracking-[-0.01em]">
          {headline}
        </h1>
        {intro && (
          <p className={`mt-6 max-w-[60ch] text-[length:var(--text-body-l)] leading-relaxed ${
            imagePath ? "text-white/85" : "text-muted"
          }`}>
            {intro}
          </p>
        )}
        {actions && <div className="mt-9 flex flex-wrap gap-4">{actions}</div>}
      </Container>

      {imagePath && (
        <div id="hero-sentinel" aria-hidden="true" className="absolute bottom-0 h-px w-full" />
      )}
    </section>
  );
}
