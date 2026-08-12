import type { ReactNode } from "react";
import { Container, Section } from "./Section";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <Section className="bg-white">
      <Container className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600">
          GoodMash.io · Legal
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-ink-soft">Last updated: {updated}</p>
        <div className="prose-legal mt-8 space-y-6 text-[15px] leading-relaxed text-ink-soft">
          {children}
        </div>
        <p className="mt-12 border-t border-brand-100 pt-6 text-xs text-ink-soft">
          Contact GoodMash.io at teenage2023bt@gmail.com or +27 69 331 3143 for
          any questions about this policy.
        </p>
      </Container>
    </Section>
  );
}

export function LegalH2({ children }: { children: ReactNode }) {
  return (
    <h2 className="pt-2 text-lg font-extrabold text-brand-900">{children}</h2>
  );
}

export function LegalP({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-gold-500">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
