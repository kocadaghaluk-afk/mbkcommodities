import type { LeadershipProfile as LeadershipProfileType } from "@/content/leadership";
import { EditorialImage } from "@/components/ui/EditorialImage";

interface LeadershipProfileProps {
  profile: LeadershipProfileType;
  /**
   * "home" — compact editorial preview (portrait, name, title, one
   * sentence). "full" — complete approved profile copy, used on the
   * Leadership page.
   */
  variant?: "home" | "full";
}

/**
 * Identical treatment for every profile within a given variant —
 * governance order is communicated through page sequence only, never
 * through size, image treatment or decorative emphasis
 * (05_Page_Specifications > Leadership > Portrait Rules).
 *
 * Portraits are fully monochrome rather than lightly desaturated — the
 * same device used for board/leadership photography at established
 * institutions, distinct from the site's lighter "editorial grade" used
 * on infrastructure photography. No card border: a hairline rule and
 * generous whitespace separate portrait from copy, closer to a governance
 * page in an annual report than a "meet the team" grid.
 */
export function LeadershipProfile({ profile, variant = "full" }: LeadershipProfileProps) {
  if (variant === "home") {
    return (
      <article className="flex flex-col">
        <EditorialImage
          src={profile.portraitPath}
          alt={profile.portraitAlt}
          aspectRatio="3/4"
          focalPoint="center 20%"
          grade={false}
          className="grayscale"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="flex flex-col border-t border-line pt-6 mt-6">
          <h3 className="font-serif text-lg font-medium leading-[1.2]">{profile.name}</h3>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-maroon">
            {profile.title}
          </p>
          <p className="mt-4 text-[0.9rem] leading-relaxed text-muted">{profile.homeOneLiner}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col">
      <EditorialImage
        src={profile.portraitPath}
        alt={profile.portraitAlt}
        aspectRatio="4/5"
        focalPoint="center 20%"
        grade={false}
        className="grayscale"
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex flex-col border-t border-line pt-6 mt-6">
        <h3 className="font-serif text-[length:var(--text-h3)] font-medium leading-[1.2]">{profile.name}</h3>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.08em] text-maroon">
          {profile.title}
        </p>
        <p className="mt-4 text-[0.975rem] leading-relaxed text-muted">{profile.copy}</p>
      </div>
    </article>
  );
}

interface LeadershipGridProps {
  profiles: LeadershipProfileType[];
  variant?: "home" | "full";
}

export function LeadershipGrid({ profiles, variant = "full" }: LeadershipGridProps) {
  const ordered = [...profiles].sort((a, b) => a.order - b.order);

  return (
    <div
      className={`grid grid-cols-1 items-start gap-x-8 gap-y-12 lg:gap-y-16 ${
        // "full" cards can vary in copy length (e.g. the General Director's
        // longer paragraph); items-start stops the grid from stretching
        // every card to match the tallest one, which previously left large
        // empty areas at the bottom of the shorter cards.
        variant === "full" ? "lg:gap-x-10" : ""
      } sm:grid-cols-2 lg:grid-cols-4`}
    >
      {ordered.map((profile) => (
        <LeadershipProfile key={profile.name} profile={profile} variant={variant} />
      ))}
    </div>
  );
}
