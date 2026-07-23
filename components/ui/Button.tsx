import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

/**
 * Filled primary action only. Per Brand Bible Section 9 (Buttons):
 * "One filled primary button per view maximum; secondary actions are
 * text-style links, not a second bordered button competing for
 * attention." A bordered "secondary" button variant does not exist in
 * this system — use a plain Link for any secondary action instead.
 *
 * Filled in Maroon rather than a neutral: the Brand Bible allows Maroon
 * for "rare, deliberate UI accents," and a single primary button per view
 * is exactly that — the one moment on each page where the brand's
 * signature color appears at full strength, applied consistently
 * everywhere a primary action exists.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-2 text-[length:var(--text-button)] font-medium tracking-[0.01em] transition-opacity duration-200 ease-out min-h-[44px] bg-maroon text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2";

export function Button({ href, children, className = "" }: ButtonProps) {
  return (
    <Link href={href} className={`${base} ${className}`}>
      {children}
    </Link>
  );
}
