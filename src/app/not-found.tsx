import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <Container className="py-24">
      <h1 className="text-3xl">Page not found</h1>
      <p className="mt-4 text-ink-muted">
        The page may have moved, or the record may not be published. <Link href="/">Return home</Link>
      </p>
    </Container>
  );
}
