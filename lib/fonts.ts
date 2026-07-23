import { Newsreader, Inter } from "next/font/google";

// Note: these expose --font-newsreader / --font-inter (raw font-stack
// variables from next/font), which globals.css then composes into the
// design system's --font-serif / --font-sans tokens. Keeping the names
// distinct avoids any cascade ambiguity between next/font's injected
// class-scoped variables and Tailwind's @theme-registered root tokens.
export const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});
