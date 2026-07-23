import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { pageSeo } from "@/content/seo";
import { LegalPageShell } from "@/components/sections/LegalPageShell";

export const metadata: Metadata = buildMetadata(pageSeo.privacy);

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy">
      <p>
        This Privacy Policy will describe how MBK Holding Commodities collects, uses and
        protects information submitted through this website, including enquiries made via the
        contact form.
      </p>
      <p>
        Final wording — covering data collected, retention, third-party processors, user rights
        and contact details for privacy enquiries — is pending legal review and is not yet
        approved for publication.
      </p>
    </LegalPageShell>
  );
}
