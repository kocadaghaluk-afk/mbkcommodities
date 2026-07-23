interface EyebrowProps {
  children: string;
  className?: string;
  light?: boolean;
}

/**
 * The system's one permitted graphic flourish (Brand Bible 7.1): a 2px
 * accent rule beneath the eyebrow label. Maroon on light surfaces, Signal
 * Cyan on dark ones — the same cyan that appears in the logo's ribbon, so
 * the page echoes the mark even when the mark itself isn't in view.
 */
export function Eyebrow({ children, className = "", light = false }: EyebrowProps) {
  return (
    <div className={className}>
      <p
        className={`text-[length:var(--text-h6)] font-semibold uppercase leading-[1.4] tracking-[0.12em] ${
          light ? "text-cyan" : "text-maroon"
        }`}
      >
        {children}
      </p>
      <span
        aria-hidden="true"
        className={`mt-4 block h-[2px] w-8 ${light ? "bg-cyan" : "bg-maroon"}`}
      />
    </div>
  );
}
