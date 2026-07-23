"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { MobileNavigation } from "./MobileNavigation";

/**
 * Sticky header that starts transparent/overlaid on the page hero and
 * becomes solid once the hero has scrolled past. Implemented with a single
 * IntersectionObserver watching a sentinel element rendered at the base of
 * every PageHero (id="hero-sentinel") — deliberately avoiding a scroll
 * event listener, per the simplest-maintainable-implementation direction.
 *
 * Header height and logo scale are held constant across breakpoints as a
 * default (Brand Bible, Premium Details) — only navigation disclosure
 * (full nav vs. menu button) changes.
 */
export function Header() {
  const [isSolid, setIsSolid] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Default safely to solid at the start of every route evaluation —
    // if the new page has no hero sentinel below, this is the correct
    // final state; if it does, the observer below will correct it. This
    // also matters because Header lives in the root layout and never
    // unmounts between pages: without resetting here, a client-side
    // navigation from a page with a hero to one without could otherwise
    // leave the header stuck showing white text on a light background.
    setIsSolid(true);

    const sentinel = document.getElementById("hero-sentinel");

    // No hero image on this page — stay in the solid state set above.
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSolid(!entry?.isIntersecting);
      },
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ease-out ${
        isSolid
          ? "bg-paper/95 backdrop-blur-sm border-b border-line text-ink"
          : "bg-transparent text-white"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-8 px-6 md:px-10 lg:px-14">
        <Link href="/" id="header-logo-link" aria-label={`${siteConfig.name} — Home`} className="shrink-0">
          {/*
            Only the full-color lockup is approved (Brand Bible 4.4). Over
            a dark hero, a soft drop-shadow glow keeps it legible without a
            reversed/light version, which does not exist yet.
          */}
          <Logo onDark={!isSolid} className="h-9" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.slice(1).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`border-b pb-2 pt-2 text-[length:var(--text-nav)] font-medium transition-opacity hover:opacity-70 ${
                  isActive ? "border-maroon" : "border-transparent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href={siteConfig.primaryCTA.href}
            className={`inline-flex min-h-[44px] items-center rounded-sm px-6 py-2 text-[length:var(--text-button)] font-medium transition-opacity duration-200 ${
              isSolid
                ? "bg-maroon text-white hover:opacity-90"
                : "border border-white/60 text-white hover:opacity-80"
            }`}
          >
            {siteConfig.primaryCTA.label}
          </Link>
        </div>

        <MobileNavigation isSolid={isSolid} />
      </div>
    </header>
  );
}
