import type { ContactFormValues } from "./validation";

/**
 * Provider-independent email delivery interface for the contact form.
 *
 * Resend is implemented below (see ResendEmailProvider) and selected via
 * EMAIL_PROVIDER=resend. It was chosen because its API is a plain HTTPS
 * REST endpoint — no SDK/client library is required, which keeps this
 * integration dependency-free. Add further providers (SendGrid, SES, SMTP)
 * against the same EmailProvider interface if needed later.
 */

export interface EmailDeliveryResult {
  /** True only if the enquiry was actually handed to a real delivery provider. */
  delivered: boolean;
  /** True when running against the development/demo handler rather than a real provider. */
  isDemoMode: boolean;
}

export interface EmailProvider {
  sendEnquiry(values: Omit<ContactFormValues, "consent" | "companyWebsite">): Promise<EmailDeliveryResult>;
}

/**
 * Controlled development/demo handler.
 *
 * This does NOT send a real email and does NOT claim a real submission has
 * been delivered to MBK. It logs the enquiry server-side (for local/dev
 * inspection only) and reports isDemoMode: true so calling code can show
 * an honest, clearly-labelled non-production acknowledgement rather than a
 * false "delivered" success state.
 */
class DemoEmailProvider implements EmailProvider {
  async sendEnquiry(
    values: Omit<ContactFormValues, "consent" | "companyWebsite">
  ): Promise<EmailDeliveryResult> {
    console.log("[contact-form:demo-mode] Enquiry received (not delivered to a real provider):", {
      ...values,
      businessEmail: values.businessEmail, // retained for local debugging only
    });
    return { delivered: false, isDemoMode: true };
  }
}

/**
 * Production email delivery via Resend (https://resend.com), called
 * directly over HTTPS with `fetch` — no SDK dependency. Throws on any
 * failure (network error, non-2xx response) rather than silently
 * swallowing it; the caller (lib/actions.ts) already catches this and
 * shows the user an honest error state while logging the real cause
 * server-side.
 */
class ResendEmailProvider implements EmailProvider {
  constructor(
    private readonly apiKey: string,
    private readonly recipientEmail: string,
    private readonly fromAddress: string
  ) {}

  async sendEnquiry(
    values: Omit<ContactFormValues, "consent" | "companyWebsite">
  ): Promise<EmailDeliveryResult> {
    const textBody = [
      "New enquiry from the MBK Holding Commodities website contact form.",
      "",
      `Name: ${values.fullName}`,
      `Company: ${values.company}`,
      values.position ? `Position: ${values.position}` : null,
      `Business email: ${values.businessEmail}`,
      `Country: ${values.country}`,
      `Subject: ${values.subject}`,
      "",
      "Message:",
      values.message,
    ]
      .filter((line) => line !== null)
      .join("\n");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: this.fromAddress,
        to: [this.recipientEmail],
        reply_to: values.businessEmail,
        subject: `New enquiry: ${values.subject}`,
        text: textBody,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "<no response body>");
      throw new Error(`Resend API error (status ${response.status}): ${errorBody}`);
    }

    return { delivered: true, isDemoMode: false };
  }
}

let cachedProvider: EmailProvider | null = null;

export function getEmailProvider(): EmailProvider {
  if (cachedProvider) return cachedProvider;

  const provider = process.env.EMAIL_PROVIDER?.trim();

  if (provider === "resend") {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL?.trim() || process.env.CONTACT_EMAIL?.trim();
    const fromAddress = process.env.RESEND_FROM_EMAIL?.trim();

    if (!apiKey || !recipientEmail || !fromAddress) {
      throw new Error(
        "EMAIL_PROVIDER=resend requires RESEND_API_KEY, RESEND_FROM_EMAIL, and either " +
          "CONTACT_RECIPIENT_EMAIL or CONTACT_EMAIL to be set. See .env.example."
      );
    }

    cachedProvider = new ResendEmailProvider(apiKey, recipientEmail, fromAddress);
    return cachedProvider;
  }

  if (provider) {
    throw new Error(
      `EMAIL_PROVIDER="${provider}" is not a recognized provider. Supported: "resend". ` +
        "Add further integrations in lib/email-provider.ts if needed."
    );
  }

  cachedProvider = new DemoEmailProvider();
  return cachedProvider;
}
