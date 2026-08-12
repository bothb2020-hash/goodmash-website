import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container, Section, SectionHeader, Card } from "@/components/Section";
import { ButtonLink } from "@/components/Button";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact GoodMash.io: WhatsApp / calls +27 69 331 3143, email teenage2023bt@gmail.com, TikTok @teenage910, YouTube DJTeenage-Virus.",
};

const CHANNELS = [
  {
    label: "WhatsApp / Calls",
    value: "+27 69 331 3143",
    href: "tel:+27693313143",
    note: "Best for quick support",
  },
  {
    label: "Email",
    value: "teenage2023bt@gmail.com",
    href: "mailto:teenage2023bt@gmail.com",
    note: "For detailed enquiries",
  },
  {
    label: "TikTok",
    value: "@teenage910 · GoodMash.io",
    href: "https://www.tiktok.com/@teenage910",
    note: "Updates and community",
  },
  {
    label: "YouTube",
    value: "DJTeenage-Virus",
    href: "https://www.youtube.com/@DJTeenage-Virus",
    note: "Creative brand of the founder",
  },
];

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact GoodMash.io"
        subtitle="We're here to help. Reach us on WhatsApp, email, TikTok or YouTube — or ask the GoodMash AI Agent right here on the site."
      />

      <Section className="bg-white">
        <Container>
          <SectionHeader eyebrow="Get in touch" title="Contact channels" />
          <div className="grid gap-5 sm:grid-cols-2">
            {CHANNELS.map((c) => (
              <Card key={c.label} className="p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-600">
                  {c.label}
                </h3>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    c.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="mt-2 block text-lg font-extrabold text-brand-900 hover:text-brand-600"
                >
                  {c.value}
                </a>
                <p className="mt-1 text-sm text-ink-soft">{c.note}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-cream">
        <Container className="max-w-3xl">
          <Card className="bg-brand-900 text-white">
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-extrabold">
                Questions? Ask the 24/7 GoodMash AI Agent
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-100/80">
                The GoodMash AI Agent is available around the clock for account
                questions, connection problems, maintenance, payments, device
                compatibility and troubleshooting — in English and South African
                languages. Open the chat bubble (bottom-right) or escalate to a
                support ticket from there.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/support" variant="gold">
                  Visit the support page
                </ButtonLink>
                <ButtonLink
                  href="/demo"
                  className="border-white/40 text-white hover:bg-white hover:text-brand-900"
                  variant="secondary"
                >
                  Explore the demo
                </ButtonLink>
              </div>
            </div>
          </Card>
          <p className="mt-6 text-center text-xs text-ink-soft">
            GoodMash.io does not display a fake office address. Official contact
            channels are listed above.
          </p>
        </Container>
      </Section>
    </>
  );
}
