import { Container } from "./container";

export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-rule">
      <Container className="py-12 sm:py-16">
        {eyebrow && <p className="mb-3 text-sm font-medium uppercase tracking-wider text-ink-muted">{eyebrow}</p>}
        <h1 className="max-w-3xl text-3xl sm:text-[2.6rem]">{title}</h1>
        {lede && <p className="mt-5 max-w-[60ch] text-lg text-ink-muted sm:text-xl">{lede}</p>}
        {children}
      </Container>
    </div>
  );
}
