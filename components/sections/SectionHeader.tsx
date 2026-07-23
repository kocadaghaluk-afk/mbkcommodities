import { Eyebrow } from "@/components/ui/Eyebrow";

interface SectionHeaderProps {
  eyebrow?: string;
  heading: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  heading,
  intro,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`max-w-[640px] ${align === "center" ? "mx-auto text-center" : ""} ${className}`}
    >
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <h2 className="font-serif text-[length:var(--text-h2)] font-medium leading-[1.15]">
        {heading}
      </h2>
      {intro && <p className="mt-5 text-[length:var(--text-body-l)] leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}
