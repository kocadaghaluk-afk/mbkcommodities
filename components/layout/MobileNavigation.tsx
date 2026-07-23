"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/content/site";
import { Logo } from "@/components/ui/Logo";

interface MobileNavigationProps {
  isSolid: boolean;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNavigation({ isSolid }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Background content becomes inert while the dialog is open: it can't
    // be focused (keyboard) and is removed from the accessibility tree
    // (screen-reader virtual cursor), not just visually covered. The
    // drawer itself is rendered inline within the header rather than in a
    // portal, so these are targeted individually rather than via a single
    // "everything outside the dialog" toggle.
    const main = document.getElementById("main-content");
    const footer = document.querySelector("footer");
    const headerLogoLink = document.getElementById("header-logo-link");
    const inertTargets = [main, footer, headerLogoLink, buttonRef.current].filter(
      (el): el is HTMLElement => el !== null
    );
    inertTargets.forEach((el) => {
      el.inert = true;
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (buttonRef.current) buttonRef.current.inert = false;
        setIsOpen(false);
        buttonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      // Cycle Tab/Shift+Tab within the dialog rather than letting focus
      // escape into (now-inert, but defensively handled anyway) content
      // outside it.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    // Move focus into the panel on open.
    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    firstFocusable?.focus();

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      inertTargets.forEach((el) => {
        el.inert = false;
      });
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((open) => !open)}
        className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sm ${
          isSolid ? "text-ink" : "text-white"
        }`}
      >
        <MenuIcon open={isOpen} />
      </button>

      {isOpen && (
        <div
          id="mobile-nav-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-50 flex h-dvh w-full flex-col bg-ink px-6 pt-6 text-white"
        >
          <div className="flex items-center justify-between">
            <Logo onDark className="h-8" />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => {
                if (buttonRef.current) buttonRef.current.inert = false;
                setIsOpen(false);
                buttonRef.current?.focus();
              }}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center"
            >
              <MenuIcon open={true} />
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-12 flex flex-1 flex-col gap-2">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setIsOpen(false)}
                className="min-h-[44px] border-b border-line-dark py-4 font-serif text-2xl"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href={siteConfig.primaryCTA.href}
            onClick={() => setIsOpen(false)}
            className="mb-10 flex min-h-[44px] items-center justify-center rounded-sm bg-maroon py-2 text-center text-[length:var(--text-button)] font-medium text-white transition-opacity hover:opacity-90"
          >
            {siteConfig.primaryCTA.label}
          </Link>
        </div>
      )}
    </div>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
