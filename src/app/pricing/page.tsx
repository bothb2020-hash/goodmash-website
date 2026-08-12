import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container, Section, SectionHeader, Card } from "@/components/Section";
import { ButtonLink } from "@/components/Button";
import { CheckoutWidget } from "@/components/CheckoutWidget";
import { Tick } from "@/components/DemoBanner";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "GoodMash maintenance: 30 days free, then R10 monthly app maintenance fee. VIP from R10 + R5, VVIP from R10 + R10. This is not the price of data.",
};

const OPTIONS = [
  { label: "Myself", desc: "Maintain my own account." },
  { label: "My family group", desc: "One family member can maintain multiple family members." },
  { label: "Selected members", desc: "Maintain only the members you choose." },
  { label: "Sponsor another member", desc: "Pay for another GoodMash user where the relationship allows it." },
  { label: "Rotating responsibility", desc: "Share the monthly responsibility across the group." },
];

export default function Pricing() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Simple monthly app maintenance"
        subtitle="Every new GoodMash account receives 30 days free. After the introductory period: R10 monthly app maintenance."
      >
        <div className="mt-7 inline-flex flex-wrap items-center gap-2 rounded-2xl border border-brand-700 bg-brand-900/70 px-5 py-3">
          <span className="text-2xl font-extrabold text-gold-400">R10</span>
          <span className="text-sm text-brand-100/80">
            App Monthly Maintenance Fee — monthly
          </span>
        </div>
      </PageHero>

      {/* NOT DATA */}
      <section className="border-b border-brand-200 bg-brand-900">
        <Container className="py-5">
          <p className="text-center text-xs leading-relaxed text-brand-100/80 sm:text-sm">
            <strong className="text-gold-400">Please note:</strong> the R10
            monthly fee is an app/platform maintenance fee. It is{" "}
            <strong>NOT</strong> the price of mobile data, and GoodMash.io does
            not sell mobile data bundles.
          </p>
        </Container>
      </section>

      {/* OPTIONS */}
      <Section className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="Maintenance options"
            title="Choose how your maintenance works"
            subtitle="GoodMash supports flexible maintenance so responsibility can be shared fairly."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {OPTIONS.map((o) => (
              <Card key={o.label} className="text-center">
                <h3 className="font-extrabold text-brand-900">{o.label}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                  {o.desc}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAMILY MAINTENANCE EXAMPLE */}
      <Section className="bg-brand-50">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-7">
              <h3 className="text-lg font-extrabold text-brand-900">
                Family maintenance
              </h3>
              <p className="mt-2 text-sm text-ink-soft">
                One family member can maintain multiple family members.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  ["Dad", true],
                  ["Mom", true],
                  ["You", true],
                  ["Child 1", true],
                  ["Child 2", false],
                ].map(([name, ok]) => (
                  <li
                    key={String(name)}
                    className="flex items-center gap-3 rounded-xl border border-brand-100 bg-white px-4 py-3"
                  >
                    <Tick cross={!ok} />
                    <span className="font-semibold text-brand-900">{name}</span>
                    <span className="ml-auto text-xs font-bold text-ink-soft">
                      {ok ? "Maintained" : "Not yet maintained"}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-ink-soft">
                GoodMash does not display public contribution statistics — no
                public &quot;Mom contributed R100&quot; leaderboards.
              </p>
            </Card>

            <Card className="p-7">
              <h3 className="text-lg font-extrabold text-brand-900">
                Sponsoring
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                A user can pay maintenance for another GoodMash user where the
                payment and account relationship allow it. This supports:
              </p>
              <ul className="mt-4 space-y-3 text-sm text-ink-soft">
                {[
                  "Parents maintaining children",
                  "Children helping maintain a family",
                  "Students rotating responsibility",
                  "Friends supporting each other",
                ].map((x) => (
                  <li key={x} className="flex gap-3">
                    <Tick /> {x}
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-xl bg-brand-900 p-4 text-sm text-brand-100">
                <span className="font-bold text-gold-400">Example:</span> &quot;I
                maintained GoodMash for my family.&quot;
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* TIERS SUMMARY */}
      <Section className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="Membership"
            title="Standard, VIP and VVIP"
            subtitle="One R10 base covers your account. VIP and VVIP add flexibility between multiple authorized groups."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Standard",
                price: "R10 / month",
                desc: "The default GoodMash experience with normal account and group functionality.",
                href: "/standard",
              },
              {
                name: "VIP",
                price: "R10 + R5 / group",
                desc: "Remain associated with an existing group while participating in another group where permitted.",
                href: "/vip",
              },
              {
                name: "VVIP",
                price: "R10 + R10 / group",
                desc: "Greater flexibility between multiple authorized groups. Owner authorization still applies.",
                href: "/vvip",
              },
            ].map((t) => (
              <Card key={t.name} className="flex flex-col p-7">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
                  {t.name}
                </p>
                <p className="mt-2 text-2xl font-extrabold text-brand-900">
                  {t.price}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                  {t.desc}
                </p>
                <ButtonLink
                  href={t.href}
                  variant="secondary"
                  size="sm"
                  className="mt-5 w-full"
                >
                  Learn more
                </ButtonLink>
              </Card>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-ink-soft">
            Example: GoodMash maintenance R10 + one additional VIP group R5 ={" "}
            <strong className="text-brand-900">R15 per month</strong>.
          </p>
        </Container>
      </Section>

      {/* CHECKOUT */}
      <Section className="bg-cream">
        <Container>
          <SectionHeader
            eyebrow="Checkout"
            title="See how maintenance checkout works"
            subtitle="An explanatory preview of the secure payment flow. No real charge is made here."
          />
          <CheckoutWidget />
          <div className="mx-auto mt-8 max-w-3xl">
            <h3 className="mb-4 text-center text-lg font-extrabold text-brand-900">
              Payment flow
            </h3>
            <div className="grid gap-2 sm:grid-cols-4">
              {["Select maintenance", "Select account / member(s)", "Payment via Ozow", "Maintenance activated"].map(
                (s, i) => (
                  <div
                    key={s}
                    className="relative rounded-2xl border border-brand-200 bg-white p-4 text-center"
                  >
                    <span className="mx-auto mb-2 grid h-8 w-8 place-items-center rounded-full bg-brand-800 text-sm font-bold text-gold-400">
                      {i + 1}
                    </span>
                    <p className="text-xs font-semibold text-brand-900">{s}</p>
                  </div>
                )
              )}
            </div>
            <p className="mt-6 text-center text-xs leading-relaxed text-ink-soft">
              Ozow is the initial payment provider. Payment verification happens
              securely through the GoodMash backend — never on the public
              website frontend. Future payment providers (e.g. PayFast, Flash)
              may be added after Ozow is operational.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
