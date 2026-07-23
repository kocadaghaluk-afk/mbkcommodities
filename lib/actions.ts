"use server";

import { headers } from "next/headers";
import { contactFormSchema, formatZodFieldErrors, type ContactFormFieldErrors } from "./validation";
import { getRateLimiter } from "./rate-limit";
import { getEmailProvider } from "./email-provider";
import { contactPageCopy } from "@/content/contact";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: ContactFormFieldErrors;
  /** Set when the submission was handled by the demo/dev email handler rather than a real provider. */
  isDemoMode?: boolean;
}

async function getClientIdentifier(): Promise<string> {
  const headerList = await headers();
  // x-forwarded-for may contain a list; take the first (client) entry.
  const forwardedFor = headerList.get("x-forwarded-for");
  const realIp = headerList.get("x-real-ip");
  return forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    fullName: String(formData.get("fullName") ?? ""),
    company: String(formData.get("company") ?? ""),
    position: String(formData.get("position") ?? ""),
    businessEmail: String(formData.get("businessEmail") ?? ""),
    country: String(formData.get("country") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
    consent: formData.get("consent") === "on",
    companyWebsite: String(formData.get("companyWebsite") ?? ""), // honeypot
  };

  const parsed = contactFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: contactPageCopy.form.errorMessage,
      fieldErrors: formatZodFieldErrors(parsed.error),
    };
  }

  // Honeypot triggered: silently report success without processing further,
  // so automated submitters receive no useful signal.
  if (parsed.data.companyWebsite) {
    return { status: "success", message: contactPageCopy.form.successMessage };
  }

  try {
    const identifier = await getClientIdentifier();
    const rateLimiter = getRateLimiter();
    const rateLimitResult = await rateLimiter.check(identifier);

    if (!rateLimitResult.success) {
      return {
        status: "error",
        message: "Too many submissions. Please try again shortly.",
      };
    }

    const emailProvider = getEmailProvider();
    const { isDemoMode } = await emailProvider.sendEnquiry(
      {
        fullName: parsed.data.fullName,
        company: parsed.data.company,
        position: parsed.data.position,
        businessEmail: parsed.data.businessEmail,
        country: parsed.data.country,
        subject: parsed.data.subject,
        message: parsed.data.message,
      },
      { submittedAt: new Date(), ipAddress: identifier }
    );

    return {
      status: "success",
      message: contactPageCopy.form.successMessage,
      isDemoMode,
    };
  } catch (error) {
    console.error("[contact-form] submission failed:", error);
    return { status: "error", message: contactPageCopy.form.errorMessage };
  }
}
