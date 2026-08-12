import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container, Section } from "@/components/Section";
import { DemoPage } from "@/components/DemoPage";
import { ButtonLink } from "@/components/Button";

export const metadata: Metadata = {
  title: "Demo",
  description:
    "A clearly-marked DEMO of the GoodMash experience: account creation, sample family, groups, connection status, maintenance and VIP/VVIP. No real connections, no real payments.",
};

export default function Demo() {
  return (
    <>
      <PageHero
        eyebrow="Demo / Preview"
        title="Explore the GoodMash experience"
        subtitle="This interactive demo shows the look and flow of the GoodMash platform. Everything here is clearly a preview — nothing is a real connection and no real payment is made."
      >
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <ButtonLink href="/how-it-works" variant="secondary" className="border-white/40 text-white hover:bg-white hover:text-brand-900">
            How it works
          </ButtonLink>
          <ButtonLink href="/pricing" variant="gold">
            See pricing
          </ButtonLink>
        </div>
      </PageHero>

      <Section className="bg-cream">
        <Container>
          <DemoPage />
        </Container>
      </Section>
    </>
  );
}
