import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container, Section, SectionHeader, Card } from "@/components/Section";
import { ButtonLink } from "@/components/Button";
import { Tick } from "@/components/DemoBanner";

export const metadata: Metadata = {
  title: "Support",
  description:
    "GoodMash 24/7 AI support agent: account help, group problems, maintenance, payments, device compatibility and smart troubleshooting.",
};

const LANGUAGES = [
  "English",
  "isiZulu",
  "isiXhosa",
  "Afrikaans",
  "Sepedi",
  "Setswana",
  "Sesotho",
  "siSwati",
  "Tshivenda",
  "Xitsonga",
  "isiNdebele",
];

const TOPICS = [
  "Account questions",
  "Connection questions",
  "Group problems",
  "Maintenance",
  "Payment questions",
  "Device compatibility",
  "Troubleshooting",
  "Onboarding",
  "Technical diagnostics",
];

export default function Support() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="24/7 GoodMash AI Agent"
        subtitle="The GoodMash Agent is available around the clock to help with accounts, connections, groups, maintenance, payments, device compatibility and troubleshooting."
      >
        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-700 bg-brand-900/70 px-4 py-2 text-sm font-semibold text-brand-100">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-gold-400" />
          The agent is online now — open the chat bubble on this page
        </p>
      </PageHero>

      <Section className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="What the agent helps with"
            title="Your 24/7 assistant"
          />
          <div className="flex flex-wrap justify-center gap-2.5">
            {TOPICS.map((t) => (
              <span
                key={t}
                className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800"
              >
                {t}
              </span>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-50">
        <Container>
          <SectionHeader
            eyebrow="Languages"
            title="Speaks your language"
            subtitle="The agent is designed to understand all 11 official South African languages, plus slang, kasi language, Spitori and mixed-language messages."
          />
          <div className="flex flex-wrap justify-center gap-2.5">
            {LANGUAGES.map((l) => (
              <span
                key={l}
                className="rounded-full bg-brand-800 px-4 py-2 text-sm font-semibold text-gold-400"
              >
                {l}
              </span>
            ))}
          </div>
          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-brand-200 bg-white p-5">
            <p className="text-sm italic text-ink-soft">
              &quot;Bro my GoodMash e refuse go connect mara.&quot;
            </p>
            <p className="mt-3 text-sm text-brand-900">
              The agent understands the intended meaning — it understands local
              South African expression without requiring perfect English.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-7">
              <h3 className="text-lg font-extrabold text-brand-900">
                Smart troubleshooting
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Where technically and safely possible, the agent can check your
                account, membership, authorization and connection status, then
                refresh sessions, restart supported components, reconnect and
                test the connection — reporting the verified result.
              </p>
              <div className="mt-5 space-y-2.5 text-sm text-ink-soft">
                {[
                  "Check account",
                  "Check membership",
                  "Check authorization",
                  "Check connection status",
                  "Refresh session",
                  "Reconnect & test connection",
                ].map((x) => (
                  <div key={x} className="flex gap-3">
                    <Tick /> {x}
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-7">
              <h3 className="text-lg font-extrabold text-brand-900">
                Safe, limited, auditable
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                The AI agent never has unrestricted access to your device.
                Automated actions are explicitly defined, permission-controlled,
                logged, limited, safe and auditable. The agent will never
                promise remote control of your phone.
              </p>
              <div className="mt-5 rounded-xl bg-brand-900 p-4 text-sm text-brand-100">
                <span className="font-bold text-gold-400">Escalation:</span> if
                the AI cannot safely solve an issue, it says so and creates a
                support ticket containing only the information needed.
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-950 text-white">
        <Container className="text-center">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Need a human-style follow-up?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-brand-100/80">
            Create a support ticket in the chat, or contact us directly on
            WhatsApp, email, TikTok or YouTube.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/contact" variant="gold">
              Contact page
            </ButtonLink>
            <ButtonLink
              href="/demo"
              className="border-white/40 text-white hover:bg-white hover:text-brand-900"
              variant="secondary"
            >
              Try the support demo
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
