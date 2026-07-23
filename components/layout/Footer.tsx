import Link from "next/link";
import { siteConfig, copyrightLine } from "@/content/site";
import { getResolvedContactDetails } from "@/content/contact";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const contact = getResolvedContactDetails();
  const hasAnyContactDetail = contact.email || contact.telephone || contact.linkedin;

  // The grid always renders exactly as many equal-width columns as there are
  // populated groups (3 when Contact has no approved details yet, 4 once it
  // does), rather than leaving an empty fourth track.
  const gridColumnsClass = hasAnyContactDetail ? "md:grid-cols-4" : "md:grid-cols-3";

  return (
    <footer className="border-t border-line bg-teal-tint">
      <Container className={`grid grid-cols-1 gap-8 py-10 md:py-16 ${gridColumnsClass}`}>
        <div>
          <p className="font-serif text-lg font-medium">{siteConfig.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{siteConfig.footer.companyDescription}</p>
          <p className="mt-2 text-sm text-muted">{siteConfig.footer.location}</p>
        </div>

        <div>
          <p className="text-sm font-medium">Navigation</p>
          <ul className="mt-2 space-y-2">
            {siteConfig.footer.navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-muted transition-colors hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact group only renders if at least one approved detail exists. */}
        {hasAnyContactDetail && (
          <div>
            <p className="text-sm font-medium">Contact</p>
            <ul className="mt-2 space-y-2">
              {contact.email && (
                <li>
                  <a href={contact.email.href} className="text-sm text-muted transition-colors hover:text-ink">
                    {contact.email.value}
                  </a>
                </li>
              )}
              {contact.telephone && (
                <li>
                  <a href={contact.telephone.href} className="text-sm text-muted transition-colors hover:text-ink">
                    {contact.telephone.value}
                  </a>
                </li>
              )}
              {contact.linkedin && (
                <li>
                  <a
                    href={contact.linkedin.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {contact.linkedin.value}
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}

        <div>
          <p className="text-sm font-medium">Legal</p>
          <ul className="mt-2 space-y-2">
            {siteConfig.footer.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-muted transition-colors hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="border-t border-line py-5">
        <p className="text-xs text-muted">{copyrightLine()}</p>
      </Container>
    </footer>
  );
}
