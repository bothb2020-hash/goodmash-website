import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container, Section, SectionHeader, Card } from "@/components/Section";
import { ButtonLink } from "@/components/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "About GoodMash.io and its creator Bohlale Tufela Mashifane (TEENAGE) — self-taught developer, horticulture graduate and DJTeenage-Virus.",
};

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="About GoodMash.io"
        subtitle="A South African connectivity platform built on a simple idea: your connection, your people, your network — private, authorized and simple."
      />

      {/* THE PLATFORM */}
      <Section className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="The platform"
            title="Connect people through private, authorized GoodMash networks"
          />
          <p className="mx-auto max-w-3xl text-center leading-relaxed text-ink-soft">
            GoodMash.io helps people create private networks and connect
            authorized members through participating users&apos; existing
            Internet connectivity. It is not a mobile network operator and does
            not sell mobile data bundles. It is a connectivity platform
            designed around authorization, controlled membership and shared
            responsibility.
          </p>
        </Container>
      </Section>

      {/* FOUNDER */}
      <Section className="bg-brand-50">
        <Container>
          <SectionHeader eyebrow="Founder" title="About the creator" />
          <div className="mx-auto max-w-3xl">
            <Card className="p-8 sm:p-10">
              <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                <span className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-brand-800 text-4xl font-black text-gold-400 ring-4 ring-gold-300/40">
                  BT
                </span>
                <div>
                  <h3 className="text-2xl font-extrabold text-brand-900">
                    Bohlale Tufela Mashifane
                  </h3>
                  <p className="mt-1 font-semibold text-brand-600">
                    also known as TEENAGE
                  </p>
                  <p className="mt-2 text-sm text-ink-soft">
                    Self-taught developer and creator of GoodMash.io.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-brand-600">
                    Education
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-brand-900">
                    Diploma in Horticultural Sciences
                    <br />
                    <span className="text-ink-soft">
                      Tshwane University of Technology
                    </span>
                  </p>
                </div>
                <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-brand-600">
                    Creative work
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-brand-900">
                    DJTeenage-Virus
                    <br />
                    <span className="text-ink-soft">
                      Music and creative content under the TEENAGE brand.
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-brand-100 pt-6">
                <h4 className="text-sm font-extrabold text-brand-900">
                  The founder story
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  GoodMash started with a practical problem: people need to stay
                  connected with the people who matter — family, students,
                  friends and communities — without a complicated system and
                  without one person carrying everything forever. Bohlale,
                  working as a self-taught developer, set out to build a
                  platform that puts authorization, privacy and shared
                  responsibility first, designed from South Africa for the way
                  South Africans actually live and communicate.
                </p>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* VALUES */}
      <Section className="bg-brand-950 text-white">
        <Container>
          <SectionHeader
            dark
            eyebrow="What we prioritize"
            title="Real functionality, honestly built"
          />
          <ul className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
            {[
              "Real functionality",
              "Security",
              "Privacy",
              "Honest product claims",
              "Cross-platform compatibility",
              "Simple user experience",
              "Reliable payments",
              "Real connection testing",
              "Flexible groups",
              "Family support",
              "Student support",
              "AI support & long-term scalability",
            ].map((v) => (
              <li
                key={v}
                className="flex items-center gap-3 rounded-xl border border-brand-800 bg-brand-900/60 px-5 py-3"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-500 text-brand-950">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-sm font-semibold">{v}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <ButtonLink href="/contact" variant="gold">
              Get in touch
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
