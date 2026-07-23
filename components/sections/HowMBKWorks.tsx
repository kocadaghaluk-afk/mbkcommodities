import type { ProcessStep } from "@/content/home";

interface HowMBKWorksProps {
  heading: string;
  intro: string;
  steps: ProcessStep[];
}

/**
 * Restrained four-step sequence. Numbering is used here deliberately
 * because the content is a genuine ordered process (Identify → Align →
 * Structure → Execute) — not a decorative device.
 *
 * The four stages share a single continuous hairline rule above the
 * whole row, rather than each stage carrying its own separate top
 * border — a small, deliberately subtle change so the sequence reads as
 * one connected process instead of four unrelated cards. No color,
 * icon, or graphic is introduced; it's the same border-line token
 * already used everywhere else on the site, just drawn once instead of
 * four times.
 */
export function HowMBKWorks({ heading, intro, steps }: HowMBKWorksProps) {
  return (
    <div>
      <h2 className="font-serif text-[length:var(--text-h2)] font-medium leading-[1.15]">
        {heading}
      </h2>
      <p className="mt-5 max-w-[640px] text-[length:var(--text-body-l)] leading-relaxed text-muted">
        {intro}
      </p>

      <div className="mt-12 border-t border-line" />
      <ol className="grid grid-cols-1 gap-8 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.id}>
            <span className="text-sm font-medium text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-4 font-serif text-xl font-medium">{step.label}</p>
            <p className="mt-2 text-[0.975rem] leading-relaxed text-muted">{step.copy}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
