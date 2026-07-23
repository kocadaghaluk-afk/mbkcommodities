import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { pageSeo } from "@/content/seo";
import { ChairmanMessagePage } from "@/components/sections/ChairmanMessagePage";

export const metadata: Metadata = buildMetadata(pageSeo.chairmansMessage);

export default function ChairmansMessageRoute() {
  return <ChairmanMessagePage />;
}
