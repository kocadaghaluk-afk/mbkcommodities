interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "textarea";
  required?: boolean;
  error?: string;
  rows?: number;
  autoComplete?: string;
}

export function FormField({
  label,
  name,
  type = "text",
  required = false,
  error,
  rows = 5,
  autoComplete,
}: FormFieldProps) {
  const errorId = error ? `${name}-error` : undefined;

  const sharedProps = {
    id: name,
    name,
    required,
    autoComplete,
    "aria-invalid": Boolean(error),
    "aria-describedby": errorId,
    className: `min-h-[44px] w-full border bg-white px-4 py-2 text-[length:var(--text-body)] text-ink placeholder:text-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 ${
      error ? "border-error" : "border-line"
    }`,
  };

  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <div className="mt-2">
        {type === "textarea" ? (
          <textarea rows={rows} {...sharedProps} />
        ) : (
          <input type={type} {...sharedProps} />
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
