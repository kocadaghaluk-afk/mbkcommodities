import type { ContactFormValues } from "./validation";
import { getSiteUrlForSitemap } from "./metadata";

/**
 * Minimal, direct Resend integration for the contact form.
 *
 * Production Recovery: this replaces a previous provider-abstraction
 * design (a swappable EmailProvider interface with a demo/dev fallback)
 * with a single, direct path — Resend only, no abstraction layer, no
 * demo mode. If Resend isn't configured, this throws immediately rather
 * than silently degrading; there is no non-production fallback anymore.
 * Called via plain HTTPS `fetch` — no SDK dependency.
 */

export interface EnquiryMetadata {
  submittedAt: Date;
  /** Best-effort client identifier (e.g. IP) — "unknown" if none could be determined. */
  ipAddress: string;
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
  return date.toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: "UTC" }) + " UTC";
}

/**
 * Internal notification — sent to MBK's reviewing team. Restrained,
 * professional HTML (a single bordered card, no images) using the site's
 * approved brand colors.
 */
function buildInternalNotificationHtml(
  values: Omit<ContactFormValues, "consent" | "companyWebsite">,
  metadata: EnquiryMetadata,
  siteUrl: string
): string {
  const positionRow = values.position ? `<strong>Position:</strong> ${escapeHtml(values.position)}<br/>` : "";

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
 * succeeds. Plain, restrained styling, no marketing/newsletter elements.
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

async function sendResendEmail(payload: { to: string[]; subject: string; html: string; replyTo?: string }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromAddress = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !fromAddress) {
    throw new Error("RESEND_API_KEY and RESEND_FROM_EMAIL must be set. See .env.example.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress,
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

/**
 * Sends the internal notification first; only on its success does it
 * send the visitor auto-response. Throws on any failure — the caller
 * (lib/actions.ts) catches this, logs the real cause server-side, and
 * shows the user a generic, honest error state.
 */
export async function sendContactEnquiry(
  values: Omit<ContactFormValues, "consent" | "companyWebsite">,
  metadata: EnquiryMetadata
): Promise<void> {
  const siteUrl = getSiteUrlForSitemap();
  const internalRecipientsRaw =
    process.env.CONTACT_INTERNAL_NOTIFICATION_EMAILS?.trim() || "haluk@mbkholding.qa,tariq@mbkholding.qa";
  const internalRecipients = internalRecipientsRaw
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  try {
    await sendResendEmail({
      to: internalRecipients,
      subject: "New Contact Enquiry | MBK Holding Commodities",
      html: buildInternalNotificationHtml(values, metadata, siteUrl),
      replyTo: values.businessEmail,
    });
  } catch (error) {
    console.error("[contact-form] internal notification failed:", error);
    throw error;
  }

  try {
    await sendResendEmail({
      to: [values.businessEmail],
      subject: "Thank you for contacting MBK Holding Commodities",
      html: buildAutoResponseHtml(values.fullName, siteUrl),
    });
  } catch (error) {
    console.error("[contact-form] visitor auto-response failed (internal notification had already succeeded):", error);
    throw error;
  }
}
