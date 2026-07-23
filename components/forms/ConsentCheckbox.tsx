import Link from "next/link";

interface ConsentCheckboxProps {
  label: string;
  linkLabel: string;
  error?: string;
}

export function ConsentCheckbox({ label, linkLabel, error }: ConsentCheckboxProps) {
  const errorId = error ? "consent-error" : undefined;

  return (
    <div>
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          id="consent"
          name="consent"
          required
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className="mt-1 h-[18px] w-[18px] shrink-0 border border-line accent-maroon"
        />
        <label htmlFor="consent" className="text-sm leading-relaxed text-muted">
          {label}{" "}
          <Link href="/privacy" className="text-teal underline underline-offset-2">
            {linkLabel}
          </Link>
          .
        </label>
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
