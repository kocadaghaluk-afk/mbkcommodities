import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { pageSeo } from "@/content/seo";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { contactPageCopy, getResolvedContactDetails } from "@/content/contact";

export const metadata: Metadata = buildMetadata(pageSeo.contact);

export default function ContactPage() {
  const { eyebrow, headline, intro, companyName, location } = contactPageCopy;
  const contact = getResolvedContactDetails();
  const hasAnyContactDetail = contact.email || contact.telephone || contact.linkedin;

  return (
    <>
      <PageHero eyebrow={eyebrow} headline={headline} intro={intro} />

      <section className="py-16 md:py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[380px_1fr] lg:gap-16">
            {/* Location / contact details panel — renders professionally with
                only location + form if no contact details are yet approved. */}
            <div>
              <h2 className="font-sans text-[length:var(--text-h4)] font-semibold leading-[1.3]">{companyName}</h2>
              <p className="mt-2 text-[0.975rem] text-muted">{location}</p>

              {hasAnyContactDetail && (
                <ul className="mt-8 space-y-4 border-t border-line pt-6">
                  {contact.email && (
                    <li>
                      <p className="text-[length:var(--text-caption)] font-medium uppercase tracking-[0.05em] text-muted">{contact.email.label}</p>
                      <a href={contact.email.href} className="text-[0.975rem] text-teal underline underline-offset-2">
                        {contact.email.value}
                      </a>
                    </li>
                  )}
                  {contact.telephone && (
                    <li>
                      <p className="text-[length:var(--text-caption)] font-medium uppercase tracking-[0.05em] text-muted">{contact.telephone.label}</p>
                      <a href={contact.telephone.href} className="text-[0.975rem] text-teal underline underline-offset-2">
                        {contact.telephone.value}
                      </a>
                    </li>
                  )}
                  {contact.linkedin && (
                    <li>
                      <p className="text-[length:var(--text-caption)] font-medium uppercase tracking-[0.05em] text-muted">{contact.linkedin.label}</p>
                      <a
                        href={contact.linkedin.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.975rem] text-teal underline underline-offset-2"
                      >
                        {contact.linkedin.value}
                      </a>
                    </li>
                  )}
                </ul>
              )}
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
