import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container, Section, SectionHeader, Card } from "@/components/Section";
import { ButtonLink } from "@/components/Button";
import { FlowDiagram } from "@/components/Diagram";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "The 6 simple steps of GoodMash: create an account, create or join a private group, invite people, get approved, connect, and use the authorized connection.",
};

const STEPS = [
  {
    n: 1,
    title: "Create your GoodMash account",
    desc: "Sign up and get 30 days free. Your account is yours — separate from any group.",
  },
  {
    n: 2,
    title: "Create or join a private GoodMash group",
    desc: "Start a Family, Students, Friends, Community or custom group — or request to join an existing one.",
  },
  {
    n: 3,
    title: "Invite people or request access",
    desc: "Use invitations (including QR invitations) to bring people in, or request access to a group.",
  },
  {
    n: 4,
    title: "The connection owner approves authorized members",
    desc: "GoodMash groups are built on authorization. The owner controls who is allowed to participate.",
  },
  {
    n: 5,
    title: "GoodMash establishes the authorized connection",
    desc: "Once approved, GoodMash securely establishes the authorized connection between participating users.",
  },
  {
    n: 6,
    title: "Members use the available connection",
    desc: "Members use the connection according to their permissions and supported device capabilities.",
  },
];

export default function HowItWorks() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Private, authorized connections in 6 simple steps"
        subtitle="GoodMash connects authorized members through participating users' existing Internet connectivity — with permission control at every step."
      />

      <Section className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="Simple conceptual view"
            title="Provider → GoodMash → Authorized connection → Member"
            subtitle="A simple way to understand how GoodMash fits between authorized participants."
          />
          <FlowDiagram />
        </Container>
      </Section>

      <Section className="bg-cream">
        <Container>
          <SectionHeader
            eyebrow="Step by step"
            title="Getting started with GoodMash"
          />
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n}>
                <Card className="h-full">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-800 text-lg font-extrabold text-gold-400">
                    {s.n}
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold text-brand-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {s.desc}
                  </p>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section className="bg-brand-950 text-white">
        <Container className="text-center">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Your account is built to last
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-brand-100/80">
            A GoodMash account is separate from a GoodMash group. You can create
            groups, join groups, leave groups, participate in multiple groups
            where permitted, and move between social structures without
            destroying your underlying account.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/groups" variant="gold">
              Explore groups
            </ButtonLink>
            <ButtonLink
              href="/download"
              className="border-white/40 text-white hover:bg-white hover:text-brand-900"
              variant="secondary"
            >
              Get GoodMash
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
