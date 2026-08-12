import type { ReactNode } from "react";
import { Container } from "./Section";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-brand-950 text-white">
      <Container className="py-16 sm:py-24">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
          {eyebrow}
        </p>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-100/80">
            {subtitle}
          </p>
        )}
        {children}
      </Container>
    </section>
  );
}
