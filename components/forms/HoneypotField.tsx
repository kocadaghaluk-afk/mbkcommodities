/**
 * Accessible-hidden honeypot field. Off-screen and aria-hidden so real
 * visitors and assistive tech never encounter it, while still behaving
 * like a normal field to naive bots that fill in every input they find in
 * the raw DOM regardless of ARIA/CSS. Any non-empty value causes the
 * server action to silently drop the submission while still reporting
 * success.
 */
export function HoneypotField() {
  return (
    <div
      style={{
        position: "absolute",
        left: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <label htmlFor="companyWebsite">Company Website</label>
      <input
        type="text"
        id="companyWebsite"
        name="companyWebsite"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
