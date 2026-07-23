import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

interface LegalPageShellProps {
  title: string;
  children: ReactNode;
}

/**
 * Consistent shell for the Privacy and Terms placeholder pages. Both are
 * explicitly not final legal copy — see the in-page notice and
 * content/placeholders.ts (ids: legal-privacy, legal-terms).
 *
 * Deliberately renders no #hero-sentinel: these pages have no hero image,
 * so the global Header should default straight to its solid state rather
 * than briefly rendering light text against a light background.
 */
export function LegalPageShell({ title, children }: LegalPageShellProps) {
  return (
    <Container narrow className="py-32 md:py-40">
      <h1 className="font-serif text-[length:var(--text-h1)] font-medium leading-[1.1] tracking-[-0.01em]">{title}</h1>

      <div className="mt-8 border border-line bg-white/50 p-6 text-sm text-muted">
        This page is a placeholder shell prepared for structural and layout review only.
        Final legal wording is pending review and must be approved before publication.
      </div>

      <div className="mt-10 text-[0.975rem] leading-relaxed text-muted">
        {children}
      </div>
    </Container>
  );
}
