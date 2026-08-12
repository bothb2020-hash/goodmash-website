import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container, Section, SectionHeader, Card } from "@/components/Section";
import { ButtonLink } from "@/components/Button";

export const metadata: Metadata = {
  title: "Standard Membership",
  description:
    "Standard is the default GoodMash experience: account access, group participation, authorized connection access and more at R10/month after 30 days free.",
};

const CAPABILITIES = [
  "Account access",
  "Group participation",
  "Authorized connection access",
  "Normal visibility",
  "Connection management",
  "QR invitations",
  "Maintenance management",
];

export default function Standard() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Standard"
        subtitle="Standard is the default GoodMash experience — the normal account and group functionality available to every user."
      >
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-gold-500 px-5 py-2 text-lg font-extrabold text-brand-950">
            R10 / month
          </span>
          <span className="rounded-full border border-brand-700 bg-brand-900/70 px-4 py-2 text-sm font-semibold text-brand-100">
            30 days free on new accounts
          </span>
        </div>
      </PageHero>

      <Section className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="What's included"
            title="Normal account and group functionality"
            subtitle="The R10 monthly fee is an app maintenance fee — not the price of mobile data."
          />
          <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
            {CAPABILITIES.map((c) => (
              <Card key={c} className="flex items-center gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-sm font-semibold text-brand-900">{c}</span>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-950 text-white">
        <Container className="text-center">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Start with Standard today
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-brand-100/80">
            Every new GoodMash account receives 30 days free. After that, it is
            R10 monthly app maintenance.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/download" variant="gold">
              Get GoodMash
            </ButtonLink>
            <ButtonLink
              href="/vip"
              className="border-white/40 text-white hover:bg-white hover:text-brand-900"
              variant="secondary"
            >
              Compare with VIP
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
