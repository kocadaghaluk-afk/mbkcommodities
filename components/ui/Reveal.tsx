"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Applies the image-scale-in treatment instead of the vertical fade. */
  variant?: "fade-up" | "image-scale";
  /** Optional delay in ms, kept small and used sparingly. */
  delayMs?: number;
}

/**
 * Minimal scroll-reveal wrapper. Triggers once per section (does not
 * re-trigger on re-entry), respects prefers-reduced-motion via the CSS
 * rules in globals.css, and avoids pulling in a motion library for a
 * single fade/translate effect.
 */
export function Reveal({ children, className = "", variant = "fade-up", delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            timer = setTimeout(() => setRevealed(true), delayMs);
            observer.disconnect();
            return;
          }
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [delayMs]);

  const motionClass = variant === "image-scale" ? "image-scale-in" : "reveal";

  return (
    <div ref={ref} data-revealed={revealed} className={`${motionClass} ${className}`}>
      {children}
    </div>
  );
}
