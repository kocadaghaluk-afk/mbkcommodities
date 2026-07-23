import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

interface CTAButton {
  label: string;
  href: string;
}

interface CTASectionProps {
  heading: string;
  copy?: string;
  button?: CTAButton;
  buttons?: CTAButton[];
  children?: ReactNode;
}

/**
 * One filled primary action per section, per Brand Bible Section 9
 * (Buttons): "One filled primary button per view maximum; secondary
 * actions are text-style links, not a second bordered button competing
 * for attention." Any additional entries in `buttons` render as
 * understated text links, not a second Button.
 */
export function CTASection({ heading, copy, button, buttons, children }: CTASectionProps) {
  const actionButtons = buttons ?? (button ? [button] : []);
  const [primaryAction, ...secondaryActions] = actionButtons;

  return (
    <section className="border-t border-line-dark bg-teal-deep text-white">
      <Container className="py-16 md:py-24 lg:py-32">
        <div className="max-w-[640px]">
          <h2 className="font-serif text-[length:var(--text-h2)] font-medium leading-[1.15]">
            {heading}
          </h2>
          {copy && <p className="mt-5 text-[length:var(--text-body-l)] leading-relaxed text-white/80">{copy}</p>}
          {children}
          {actionButtons.length > 0 && (
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              {primaryAction && (
                <Button href={primaryAction.href} className="!bg-white !text-ink">
                  {primaryAction.label}
                </Button>
              )}
              {secondaryActions.map((btn) => (
                <Link
                  key={btn.href}
                  href={btn.href}
                  className="text-[length:var(--text-button)] font-medium text-white/75 transition-colors hover:text-white"
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
