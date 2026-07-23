import type { BusinessArea } from "@/content/business-areas";
import { EditorialImage } from "@/components/ui/EditorialImage";

interface BusinessAreaBlockProps {
  area: BusinessArea;
  /** "home" uses the short homeCopy; "full" uses the longer fullCopy plus optional taxonomy. */
  variant?: "home" | "full";
}

/**
 * Editorial treatment rather than a feature-card pattern: image, then a
 * hairline rule and generous whitespace, then heading and copy — closer
 * to a report's illustrated section than a marketing tile. Photography
 * and typography carry the distinction between sectors; there is
 * deliberately no icon, colored tile, or bounding box.
 */
export function BusinessAreaBlock({ area, variant = "home" }: BusinessAreaBlockProps) {
  const copy = variant === "home" ? area.homeCopy : area.fullCopy;

  return (
    <article className="flex flex-col">
      <EditorialImage
        src={area.imagePath}
        alt={area.imageAlt}
        aspectRatio="3/2"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex flex-col border-t border-line pt-6 mt-6">
        <h3 className="font-serif text-[length:var(--text-h3)] font-medium leading-[1.2]">
          {area.name}
        </h3>
        <p
          className={`mt-4 text-[0.975rem] leading-relaxed text-muted ${
            variant === "home" ? "sm:min-h-28" : ""
          }`}
        >
          {copy}
        </p>
        {variant === "full" && area.taxonomy && area.taxonomy.length > 0 && (
          <p className="mt-4 text-sm text-muted/80">
            {area.taxonomy.join(" / ")}
          </p>
        )}
      </div>
    </article>
  );
}

interface BusinessAreaGridProps {
  areas: BusinessArea[];
  variant?: "home" | "full";
}

/**
 * Balanced editorial grid for all five business areas. Uses an equal-weight
 * responsive grid (1 col mobile, 2 col tablet, 3 col desktop wrapping to a
 * second row of two) so the fifth area (Chemicals & Petrochemicals) receives
 * the same visual treatment as the other four rather than trailing as an
 * afterthought.
 *
 * items-start keeps each card sized to its own content — on the "full"
 * variant, Energy's extra taxonomy line would otherwise stretch every card
 * in its row to match (the same issue fixed for Leadership cards).
 */
export function BusinessAreaGrid({ areas, variant = "home" }: BusinessAreaGridProps) {
  return (
    <div className="grid grid-cols-1 items-start gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-16">
      {areas.map((area) => (
        <BusinessAreaBlock key={area.slug} area={area} variant={variant} />
      ))}
    </div>
  );
}
