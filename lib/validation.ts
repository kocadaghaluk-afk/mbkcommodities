import { z } from "zod";

/**
 * Contact form validation schema — the single source of truth, enforced
 * server-side in lib/actions.ts. There is no client-side validation today
 * (the form uses noValidate and relies entirely on this server-side check
 * plus the accessible error handling in ContactForm.tsx); if client-side
 * validation is added in the future, it should import this same schema
 * rather than duplicating the rules.
 */
export const contactFormSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(160),
  company: z.string().trim().min(2, "Enter your company name.").max(160),
  position: z.string().trim().max(160).optional().or(z.literal("")),
  businessEmail: z.string().trim().email("Enter a valid business email address.").max(254),
  country: z.string().trim().min(2, "Enter your country.").max(100),
  subject: z.string().trim().min(2, "Enter a subject.").max(200),
  message: z.string().trim().min(10, "Enter a message of at least 10 characters.").max(4000),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Privacy Policy to continue." }),
  }),
  /** Honeypot — must remain empty. Not shown to real visitors via CSS/markup techniques. */
  companyWebsite: z.string().max(0, "Submission rejected.").optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export type ContactFormFieldErrors = Partial<Record<keyof ContactFormValues, string>>;

export function formatZodFieldErrors(error: z.ZodError<ContactFormValues>): ContactFormFieldErrors {
  const fieldErrors: ContactFormFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ContactFormValues | undefined;
    if (key && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}
