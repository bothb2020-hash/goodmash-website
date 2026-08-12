import Link from "next/link";
import { Container, Section, SectionHeader, Card } from "@/components/Section";
import { ButtonLink } from "@/components/Button";
import { FlowDiagram } from "@/components/Diagram";

const VALUES = [
  {
    title: "Connect",
    desc: "Build private networks with people you choose.",
  },
  {
    title: "Share",
    desc: "Owners share an available connection with authorized members.",
  },
  {
    title: "Authorize",
    desc: "Approval controls who can participate — every time.",
  },
  {
    title: "Manage",
    desc: "Owners manage members, access and availability.",
  },
  {
    title: "Maintain",
    desc: "Flexible maintenance — yourself, family, sponsors or rotation.",
  },
  {
    title: "Support",
    desc: "24/7 GoodMash AI Agent plus human-style support tickets.",
  },
];

const MEMBERSHIP = [
  {
    name: "Standard",
    tag: "Default experience",
    price: "R10 / month",
    desc: "The normal GoodMash account and group functionality — account access, group participation, authorized connection access, QR invitations and more.",
    href: "/standard",
  },
  {
    name: "VIP",
    tag: "Enhanced membership",
    price: "R10 + R5/group",
    desc: "Stay associated with your existing group while participating in another group where permitted.",
    href: "/vip",
  },
  {
    name: "VVIP",
    tag: "Advanced multi-group",
    price: "R10 + R10/group",
    desc: "Greater flexibility between multiple authorized groups. Group-owner authorization is never overridden.",
    href: "/vvip",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(60rem 30rem at 85% -10%, rgba(217,164,65,0.35), transparent 60%), radial-gradient(50rem 30rem at -10% 110%, rgba(47,132,89,0.5), transparent 60%)",
          }}
        />
        <Container className="relative py-24 sm:py-32">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-700 bg-brand-900/70 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-400">
              <span className="h-2 w-2 rounded-full bg-gold-400" />
              South African Connectivity Platform
            </p>
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
              GOODMASH<span className="text-gold-400">.IO</span>
            </h1>
            <p className="mt-6 text-2xl font-bold leading-snug text-balance sm:text-3xl">
              Your Connection.
              <br />
              Your People.
              <br />
              <span className="text-gold-400">Your Network.</span>
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-100/80">
              GoodMash.io is a connectivity platform designed to help people
              create private networks and connect authorized members through
              participating users&apos; existing Internet connectivity.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="/download" size="lg" variant="gold">
                Get GoodMash
              </ButtonLink>
              <ButtonLink
                href="/how-it-works"
                size="lg"
                variant="secondary"
                className="border-white/40 text-white hover:bg-white hover:text-brand-900"
              >
                How It Works
              </ButtonLink>
              <ButtonLink
                href="/contact"
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                Contact Support
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* NOT AN MNO */}
      <section className="border-b border-brand-200 bg-brand-900">
        <Container className="py-6">
          <p className="text-center text-xs leading-relaxed text-brand-100/80 sm:text-sm">
            <strong className="text-gold-400">Important:</strong> GoodMash.io is
            NOT a mobile network operator. It does not sell mobile data bundles
            and is not affiliated with MTN, Vodacom, Telkom, Cell C, Rain or any
            telecommunications company. It is a connectivity platform that
            facilitates authorized connections between participating users.
          </p>
        </Container>
      </section>

      {/* HOW IT WORKS PREVIEW */}
      <Section id="how-it-works" className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="How it works"
            title="Private, authorized connections in simple steps"
            subtitle="GoodMash helps you create private groups and connect authorized members through approved, permission-controlled connections."
          />
          <FlowDiagram />
          <div className="mt-10 text-center">
            <ButtonLink href="/how-it-works" variant="secondary" size="lg">
              See the full 6 steps
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* VALUES */}
      <Section className="bg-cream">
        <Container>
          <SectionHeader
            eyebrow="Core values"
            title="Built around connect, share, authorize, manage, maintain and support"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <Card key={v.title} className="border-l-4 border-l-gold-500">
                <h3 className="text-lg font-extrabold text-brand-900">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {v.desc}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* MEMBERSHIP */}
      <Section className="bg-brand-950 text-white">
        <Container>
          <SectionHeader
            dark
            eyebrow="Membership"
            title="Simple, flexible maintenance options"
            subtitle="30 days free on every new account, then a monthly app maintenance fee of R10. Not the price of data — platform maintenance."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {MEMBERSHIP.map((m) => (
              <Link
                key={m.name}
                href={m.href}
                className="group rounded-3xl border border-brand-800 bg-brand-900/60 p-7 transition-all hover:-translate-y-1 hover:border-gold-500/60 hover:bg-brand-900"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-gold-400">
                  {m.tag}
                </p>
                <h3 className="mt-2 text-2xl font-extrabold">{m.name}</h3>
                <p className="mt-1 text-sm font-bold text-gold-400">{m.price}</p>
                <p className="mt-4 text-sm leading-relaxed text-brand-100/80">
                  {m.desc}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-white group-hover:text-gold-400">
                  Learn more
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path
                      d="M5 12h13m0 0l-5-5m5 5l-5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAMILY & STUDENTS */}
      <Section className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="People"
            title="Made for families, students and communities"
          />
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-8">
              <h3 className="text-xl font-extrabold text-brand-900">
                For families
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                A family can create a private GoodMash group, authorize members
                and manage connections together. One family member can maintain
                multiple members, or the family can rotate maintenance
                responsibility month by month.
              </p>
              <Link
                href="/groups#family"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-900"
              >
                See the family example
                <span aria-hidden="true">→</span>
              </Link>
            </Card>
            <Card className="p-8">
              <h3 className="text-xl font-extrabold text-brand-900">
                For students
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Student groups can organize members and rotate maintenance
                responsibility — for example, a different student each month.
                Flexible responsibility, instead of one person maintaining
                everyone forever.
              </p>
              <Link
                href="/groups#students"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-900"
              >
                See the rotation example
                <span aria-hidden="true">→</span>
              </Link>
            </Card>
          </div>
        </Container>
      </Section>

      {/* SECURITY + PAYMENTS STRIP */}
      <Section className="bg-brand-50">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-brand-900 text-white">
              <h3 className="text-xl font-extrabold">Security by design</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-100/80">
                GoodMash is designed around secure authentication,
                authorization, encrypted communications, private groups,
                controlled membership and access revocation. Security
                principles are public; technical implementation stays private.
              </p>
              <ButtonLink href="/security" variant="gold" className="mt-6">
                Read the Security page
              </ButtonLink>
            </Card>
            <Card className="bg-brand-900 text-white">
              <h3 className="text-xl font-extrabold">Secure payments</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-100/80">
                Maintenance payments are processed through supported payment
                providers such as Ozow. Payment verification always happens
                through the secure backend — no payment credentials are ever
                exposed publicly.
              </p>
              <ButtonLink href="/pricing" variant="gold" className="mt-6">
                View pricing & checkout
              </ButtonLink>
            </Card>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-gold-500 text-brand-950">
        <Container className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to build your private network?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-brand-900/80 sm:text-lg">
            Get GoodMash, explore the demo, or ask the GoodMash AI Agent
            anything. Every new account starts with 30 days free.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/download" size="lg">
              Get GoodMash
            </ButtonLink>
            <ButtonLink
              href="/demo"
              size="lg"
              variant="secondary"
              className="border-brand-950 text-brand-950 hover:bg-brand-950 hover:text-white"
            >
              Explore the demo
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="ghost">
              Contact support
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
