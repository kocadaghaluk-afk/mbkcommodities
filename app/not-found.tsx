import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col justify-center py-24">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-maroon">404</p>
      <h1 className="mt-4 font-serif text-[length:var(--text-h1)] font-medium leading-[1.1] tracking-[-0.01em]">
        This page could not be found.
      </h1>
      <p className="mt-5 max-w-[520px] text-[length:var(--text-body-l)] leading-relaxed text-muted">
        The page you are looking for may have been moved or no longer exists.
      </p>
      <div className="mt-8">
        <Button href="/">Return to Home</Button>
      </div>
    </Container>
  );
}
