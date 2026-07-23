"use client";

import { useActionState, useEffect, useRef, type RefObject } from "react";
import { useFormStatus } from "react-dom";
import { submitContactForm, type ContactFormState } from "@/lib/actions";
import { contactPageCopy } from "@/content/contact";
import { FormField } from "./FormField";
import { ConsentCheckbox } from "./ConsentCheckbox";
import { HoneypotField } from "./HoneypotField";

const initialState: ContactFormState = { status: "idle" };

// Visual/tab order of fields — used to find the first invalid one to move
// focus to after a failed submission. Must stay in sync with the fields
// rendered below and with lib/validation.ts's schema keys.
const FIELD_ORDER = [
  "fullName",
  "company",
  "position",
  "businessEmail",
  "country",
  "subject",
  "message",
  "consent",
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[44px] items-center justify-center rounded-sm bg-maroon px-8 py-2 text-[length:var(--text-button)] font-medium text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Sending…" : contactPageCopy.form.submitLabel}
    </button>
  );
}

/**
 * `useFormStatus` only works in a component rendered *inside* the `<form>`
 * it reports on — not in the component that defines the form itself. This
 * small helper is that descendant: it reflects the pending state onto the
 * form element via a shared ref, so assistive technology focused anywhere
 * in the form is told it's busy while a submission is in flight.
 */
function FormBusyState({ formRef }: { formRef: RefObject<HTMLFormElement | null> }) {
  const { pending } = useFormStatus();
  useEffect(() => {
    formRef.current?.setAttribute("aria-busy", pending ? "true" : "false");
  }, [pending, formRef]);
  return null;
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const { fields } = contactPageCopy.form;
  const formRef = useRef<HTMLFormElement>(null);
  const formErrorRef = useRef<HTMLParagraphElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // After a submission resolves: on failure, move focus to the first
  // invalid field (or the form-level error message if there are no
  // field-specific errors) and announce via a visually-hidden live region.
  // On success, move focus to the confirmation message so it's reliably
  // discovered rather than depending solely on a live-region announcement,
  // which isn't guaranteed to fire for a freshly-mounted region in every
  // browser/assistive-technology combination.
  useEffect(() => {
    if (state.status === "success") {
      successRef.current?.focus();
      return;
    }

    if (state.status !== "error") return;

    if (state.fieldErrors) {
      const firstInvalidField = FIELD_ORDER.find((name) => state.fieldErrors?.[name]);
      const target = firstInvalidField ? document.getElementById(firstInvalidField) : null;
      target?.focus();

      if (liveRegionRef.current) {
        liveRegionRef.current.textContent =
          "Your enquiry could not be sent. Please review the highlighted fields below.";
      }
    } else {
      formErrorRef.current?.focus();
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="border border-line border-t-success bg-white p-8"
      >
        <p className="text-[1.05rem] leading-relaxed">{state.message}</p>
        {state.isDemoMode && (
          <p className="mt-4 text-sm text-muted">
            Development preview: this submission was handled by a demo handler and was not
            delivered to a live email provider. See the handover notes for production readiness
            requirements.
          </p>
        )}
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-6">
      <FormBusyState formRef={formRef} />

      {/*
        Visually hidden — announces submission failure to screen readers
        without altering the approved visual design in any way.
      */}
      <div ref={liveRegionRef} aria-live="polite" role="status" className="sr-only" />

      <HoneypotField />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label={fields.fullName} name="fullName" required autoComplete="name" error={state.fieldErrors?.fullName} />
        <FormField label={fields.company} name="company" required autoComplete="organization" error={state.fieldErrors?.company} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label={fields.position} name="position" autoComplete="organization-title" error={state.fieldErrors?.position} />
        <FormField label={fields.businessEmail} name="businessEmail" type="email" required autoComplete="email" error={state.fieldErrors?.businessEmail} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label={fields.country} name="country" required autoComplete="country-name" error={state.fieldErrors?.country} />
        <FormField label={fields.subject} name="subject" required error={state.fieldErrors?.subject} />
      </div>

      <FormField label={fields.message} name="message" type="textarea" required rows={6} error={state.fieldErrors?.message} />

      <ConsentCheckbox
        label={contactPageCopy.form.consentLabel}
        linkLabel={contactPageCopy.form.consentLinkLabel}
        error={state.fieldErrors?.consent}
      />

      {state.status === "error" && !state.fieldErrors && (
        <p ref={formErrorRef} role="alert" tabIndex={-1} className="text-sm text-error">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
