import type { ContactFormValues } from "./validation";
import { getSiteUrlForSitemap } from "./metadata";

/**
 * Provider-independent email delivery interface for the contact form.
 *
 * Resend is implemented below (see ResendEmailProvider) and selected via
 * EMAIL_PROVIDER=resend. It was chosen because its API is a plain HTTPS
 * REST endpoint — no SDK/client library is required, which keeps this
 * integration dependency-free. Add further providers (SendGrid, SES, SMTP)
 * against the same EmailProvider interface if needed later.
 *
 * Production Sprint 3.2 (Contact Workflow): each successful submission now
 * sends TWO emails in sequence — an internal notification to MBK's
 * reviewing team, then an automatic acknowledgement to the visitor. The
 * auto-response is only attempted after the internal notification
 * succeeds; if either step fails, this throws (the caller in
 * lib/actions.ts already catches this, logs it, and shows the user a
 * generic error) rather than reporting a false partial success.
 */

export interface EnquiryMetadata {
  submittedAt: Date;
  /** Best-effort client identifier (e.g. IP) — "unavailable" if none could be determined. */
  ipAddress: string;
}

export interface EmailDeliveryResult {
  /** True only if the enquiry was actually handed to a real delivery provider. */
  delivered: boolean;
  /** True when running against the development/demo handler rather than a real provider. */
  isDemoMode: boolean;
}

export interface EmailProvider {
  sendEnquiry(
    values: Omit<ContactFormValues, "consent" | "companyWebsite">,
    metadata: EnquiryMetadata
  ): Promise<EmailDeliveryResult>;
}

/** Minimal HTML-escaping for values interpolated into the email templates below — this is user-submitted form data. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatTimestamp(date: Date): string {
  return date.toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "UTC",
  }) + " UTC";
}

/**
 * Internal notification — sent to MBK's reviewing team. Restrained,
 * professional HTML (a single bordered card, no images, no multi-column
 * promotional layout) using the site's approved brand colors.
 */
function buildInternalNotificationHtml(
  values: Omit<ContactFormValues, "consent" | "companyWebsite">,
  metadata: EnquiryMetadata,
  siteUrl: string
): string {
  const positionRow = values.position
    ? `<strong>Position:</strong> ${escapeHtml(values.position)}<br/>`
    : "";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#F5F3EE;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F3EE;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border:1px solid rgba(16,22,27,0.16);">
            <tr>
              <td style="background-color:#10161B;padding:28px 32px;">
                <p style="margin:0;color:#FFFFFF;font-family:Georgia,'Times New Roman',serif;font-size:20px;letter-spacing:0.02em;">MBK HOLDING COMMODITIES</p>
                <p style="margin:8px 0 0;color:#6D2B3D;background-color:#FFFFFF;display:inline-block;padding:2px 8px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;">Website Enquiry</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 4px;font-family:Arial,sans-serif;font-size:13px;color:#6E7478;">
                Submitted from: <a href="${siteUrl}" style="color:#00546C;">${siteUrl}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(16,22,27,0.16);border-bottom:1px solid rgba(16,22,27,0.16);">
                  <tr>
                    <td style="padding:16px 0 12px;">
                      <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;color:#6D2B3D;">New Website Enquiry</p>
                      <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:1.8;color:#10161B;">
                        <strong>Name:</strong> ${escapeHtml(values.fullName)}<br/>
                        <strong>Company:</strong> ${escapeHtml(values.company)}<br/>
                        ${positionRow}<strong>Email:</strong> ${escapeHtml(values.businessEmail)}<br/>
                        <strong>Country:</strong> ${escapeHtml(values.country)}<br/>
                        <strong>Submitted:</strong> ${formatTimestamp(metadata.submittedAt)}<br/>
                        <strong>IP:</strong> ${escapeHtml(metadata.ipAddress)}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 32px;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#10161B;">
                <p style="margin:0 0 12px;"><strong>Subject:</strong> ${escapeHtml(values.subject)}</p>
                <p style="margin:0;white-space:pre-wrap;">${escapeHtml(values.message)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Auto-response — sent to the visitor after the internal notification
 * succeeds. Deliberately plain: the exact approved copy, restrained
 * styling consistent with the site, no marketing/newsletter elements.
 */
function buildAutoResponseHtml(fullName: string, siteUrl: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#F5F3EE;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F3EE;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border:1px solid rgba(16,22,27,0.16);">
            <tr>
              <td style="padding:40px;font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:#10161B;">
                <p style="margin:0 0 20px;">Dear ${escapeHtml(fullName)},</p>
                <p style="margin:0 0 20px;">Thank you for contacting MBK Holding Commodities.</p>
                <p style="margin:0 0 20px;">We have successfully received your enquiry.</p>
                <p style="margin:0 0 20px;">Your message has been forwarded to the appropriate members of our team and will be reviewed as soon as possible.</p>
                <p style="margin:0 0 28px;">We appreciate your interest in MBK Holding Commodities and look forward to speaking with you.</p>
                <p style="margin:0;">Kind regards,</p>
                <p style="margin:4px 0 0;font-family:Georgia,'Times New Roman',serif;font-weight:bold;">MBK Holding Commodities</p>
                <p style="margin:2px 0 0;color:#6E7478;font-size:13px;">Doha, State of Qatar</p>
                <p style="margin:12px 0 0;"><a href="${siteUrl}" style="color:#00546C;">${siteUrl}</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
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
    values: Omit<ContactFormValues, "consent" | "companyWebsite">,
    metadata: EnquiryMetadata
  ): Promise<EmailDeliveryResult> {
    console.log("[contact-form:demo-mode] Enquiry received (not delivered to a real provider):", {
      ...values,
      submittedAt: metadata.submittedAt.toISOString(),
      ipAddress: metadata.ipAddress,
    });
    return { delivered: false, isDemoMode: true };
  }
}

/**
 * Production email delivery via Resend (https://resend.com), called
 * directly over HTTPS with `fetch` — no SDK dependency. Sends the
 * internal notification first; only on its success does it send the
 * visitor auto-response. Throws on any failure (network error, non-2xx
 * response) rather than silently swallowing it — the caller (lib/actions.ts)
 * already catches this, logs the real cause server-side, and shows the
 * user a generic, honest error state.
 */
class ResendEmailProvider implements EmailProvider {
  constructor(
    private readonly apiKey: string,
    private readonly internalRecipients: string[],
    private readonly fromAddress: string
  ) {}

  private async send(payload: {
    to: string[];
    subject: string;
    html: string;
    replyTo?: string;
  }): Promise<void> {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: this.fromAddress,
        to: payload.to,
        ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
        subject: payload.subject,
        html: payload.html,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "<no response body>");
      throw new Error(`Resend API error (status ${response.status}): ${errorBody}`);
    }
  }

  async sendEnquiry(
    values: Omit<ContactFormValues, "consent" | "companyWebsite">,
    metadata: EnquiryMetadata
  ): Promise<EmailDeliveryResult> {
    const siteUrl = getSiteUrlForSitemap();

    // Step 1: internal notification to MBK's reviewing team. Thrown
    // errors here propagate as-is — no auto-response is attempted if
    // this fails.
    try {
      await this.send({
        to: this.internalRecipients,
        subject: "New Contact Enquiry | MBK Holding Commodities",
        html: buildInternalNotificationHtml(values, metadata, siteUrl),
        replyTo: values.businessEmail,
      });
    } catch (error) {
      console.error("[contact-form] internal notification failed:", error);
      throw error;
    }

    // Step 2: auto-response to the visitor, only attempted after step 1
    // succeeds. A failure here is still a failure of the overall
    // workflow (the visitor is left without acknowledgement), so it
    // throws too rather than reporting a false success.
    try {
      await this.send({
        to: [values.businessEmail],
        subject: "Thank you for contacting MBK Holding Commodities",
        html: buildAutoResponseHtml(values.fullName, siteUrl),
      });
    } catch (error) {
      console.error("[contact-form] visitor auto-response failed (internal notification had already succeeded):", error);
      throw error;
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
    const fromAddress = process.env.RESEND_FROM_EMAIL?.trim();
    const internalRecipientsRaw =
      process.env.CONTACT_INTERNAL_NOTIFICATION_EMAILS?.trim() ||
      "haluk@mbkholding.qa,tariq@mbkholding.qa";
    const internalRecipients = internalRecipientsRaw
      .split(",")
      .map((address) => address.trim())
      .filter(Boolean);

    if (!apiKey || !fromAddress || internalRecipients.length === 0) {
      throw new Error(
        "EMAIL_PROVIDER=resend requires RESEND_API_KEY, RESEND_FROM_EMAIL, and " +
          "CONTACT_INTERNAL_NOTIFICATION_EMAILS (or the built-in default) to be set. See .env.example."
      );
    }

    cachedProvider = new ResendEmailProvider(apiKey, internalRecipients, fromAddress);
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
