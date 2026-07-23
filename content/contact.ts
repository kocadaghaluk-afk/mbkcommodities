/**
 * Corporate contact details.
 *
 * IMPORTANT — public rendering rule:
 * Email, telephone and LinkedIn are approval-gated. None of these values
 * are hardcoded here. They are read from environment configuration at
 * request time. If a value has not been configured (i.e. not yet approved
 * by MBK), the corresponding row/link must be OMITTED entirely from public
 * pages — never rendered as an "[APPROVAL REQUIRED]" placeholder or any
 * other visible pending state. Approval status is only ever surfaced in
 * the internal placeholder registry (content/placeholders.ts) and the
 * handover report, never in the rendered HTML sent to visitors.
 */

export interface ContactField {
  label: string;
  value: string;
  href: string;
}

export interface ResolvedContactDetails {
  email: ContactField | null;
  telephone: ContactField | null;
  linkedin: ContactField | null;
}

/**
 * Resolves approved contact details from environment configuration.
 * Call this only from server components/actions.
 */
export function getResolvedContactDetails(): ResolvedContactDetails {
  const email = process.env.CONTACT_EMAIL?.trim();
  const telephone = process.env.CONTACT_TELEPHONE?.trim();
  const linkedin = process.env.CONTACT_LINKEDIN_URL?.trim();

  return {
    email: email
      ? { label: "Email", value: email, href: `mailto:${email}` }
      : null,
    telephone: telephone
      ? { label: "Telephone", value: telephone, href: `tel:${telephone.replace(/[^+\d]/g, "")}` }
      : null,
    linkedin: linkedin
      ? { label: "LinkedIn", value: "MBK on LinkedIn", href: linkedin }
      : null,
  };
}

export const contactPageCopy = {
  eyebrow: "Contact",
  headline: "Start a professional conversation.",
  intro:
    "We welcome enquiries from organisations seeking serious commercial engagement across selected commodity markets.",
  companyName: "MBK Holding Commodities",
  location: "Doha, State of Qatar",
  form: {
    fields: {
      fullName: "Full Name",
      company: "Company",
      position: "Position (optional)",
      businessEmail: "Business Email",
      country: "Country",
      subject: "Subject",
      message: "Message",
    },
    consentLabel: "I have read and accept the",
    consentLinkLabel: "Privacy Policy",
    submitLabel: "Send Enquiry",
    successMessage:
      "Thank you. Your enquiry has been received and will be reviewed by the appropriate MBK team.",
    errorMessage:
      "We could not send your enquiry. Please try again or contact MBK through the corporate email address.",
  },
} as const;
