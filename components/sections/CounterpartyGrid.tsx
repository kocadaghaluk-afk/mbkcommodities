import { Ship, Truck, Factory, Handshake, Landmark, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CounterpartyCardContent } from "@/content/markets";

const ICONS: Record<string, LucideIcon> = {
  producers: Ship,
  suppliers: Truck,
  "industrial-buyers": Factory,
  "strategic-partners": Handshake,
  "government-state-related-entities": Landmark,
  "financial-institutions": Building2,
};

interface CounterpartyGridProps {
  items: CounterpartyCardContent[];
}

/**
 * Restrained line-icon cards — one restrained outline library (Lucide),
 * consistent stroke, no colour tiles, no oversized icons, per Design
 * Direction's Icons section. Same architectural card treatment (hairline
 * border only, no shadow) already established for Business Area and
 * Leadership cards — no new card style introduced.
 */
export function CounterpartyGrid({ items }: CounterpartyGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const Icon = ICONS[item.id];
        return (
          <article key={item.id} className="border border-line p-6">
            {Icon && <Icon aria-hidden="true" className="h-6 w-6 text-maroon" strokeWidth={1.5} />}
            <h3 className="mt-5 font-serif text-[length:var(--text-h3)] font-medium leading-[1.2]">
              {item.title}
            </h3>
            <p className="mt-4 text-[0.975rem] leading-relaxed text-muted">{item.description}</p>
          </article>
        );
      })}
    </div>
  );
}
