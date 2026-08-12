import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container, Section, SectionHeader, Card } from "@/components/Section";

export const metadata: Metadata = {
  title: "Security",
  description:
    "GoodMash is designed around secure authentication, authorization, encrypted communications, private groups and controlled membership.",
};

const PRINCIPLES = [
  { title: "Secure authentication", desc: "Accounts are protected with secure sign-in practices." },
  { title: "Authorization", desc: "Every connection and membership is permission-controlled." },
  { title: "Encrypted communications", desc: "Communications are designed to be protected in transit." },
  { title: "Private groups", desc: "Groups are private and only visible to authorized participants." },
  { title: "Controlled membership", desc: "Owners approve who joins and who stays." },
  { title: "Connection authorization", desc: "Sharing a connection always requires approval." },
  { title: "Session management", desc: "Sessions can be managed and ended securely." },
  { title: "Access revocation", desc: "Access can be revoked immediately when needed." },
  { title: "Payment verification", desc: "Payments are verified through the secure backend." },
  { title: "Abuse prevention", desc: "Systems are designed to limit misuse." },
  { title: "Rate limiting", desc: "Requests are throttled to prevent abuse." },
  { title: "Security monitoring", desc: "Systems are monitored for suspicious activity." },
  { title: "Auditability", desc: "Important actions are logged and reviewable." },
];

export default function Security() {
  return (
    <>
      <PageHero
        eyebrow="Security"
        title="Security by design"
        subtitle="GoodMash is built around secure authentication, authorization, encrypted communications, private groups, controlled membership and access revocation."
      />

      <Section className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="Principles"
            title="The public security principles"
            subtitle="These principles guide the platform. The technical implementation stays private."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <Card key={p.title} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-800 text-gold-400">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path
                      d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-brand-900">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                    {p.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-950 text-white">
        <Container className="max-w-4xl">
          <SectionHeader
            dark
            eyebrow="Openness with limits"
            title="What we share — and what we keep private"
          />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-brand-700 bg-brand-900/60 p-6">
              <h3 className="font-extrabold text-gold-400">Public</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-brand-100/80">
                {[
                  "GoodMash name and product purpose",
                  "General functionality and pricing",
                  "Founder information",
                  "Contact details",
                  "Supported platforms",
                  "General security principles",
                ].map((x) => (
                  <li key={x} className="flex gap-2.5">
                    <span className="text-gold-400">✓</span> {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-brand-700 bg-brand-900/60 p-6">
              <h3 className="font-extrabold text-red-400">Never public</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-brand-100/80">
                {[
                  "Source code",
                  "Private APIs and credentials",
                  "Database and service credentials",
                  "Secret keys and encryption keys",
                  "Internal server addresses",
                  "Private AI prompts and tools",
                  "Admin credentials",
                ].map((x) => (
                  <li key={x} className="flex gap-2.5">
                    <span className="text-red-400">✕</span> {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-brand-100/80">
            GoodMash.io is the public front door. The application and backend
            are the protected core.
          </p>
        </Container>
      </Section>
    </>
  );
}
