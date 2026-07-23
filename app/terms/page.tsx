import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { pageSeo } from "@/content/seo";
import { LegalPageShell } from "@/components/sections/LegalPageShell";

export const metadata: Metadata = buildMetadata(pageSeo.terms);

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Use">
      <p>
        These Terms of Use will govern access to and use of the MBK Holding Commodities
        website, including acceptable use, intellectual property and limitation of liability
        provisions.
      </p>
      <p>
        Final wording is pending legal review and is not yet approved for publication.
      </p>
    </LegalPageShell>
  );
}
