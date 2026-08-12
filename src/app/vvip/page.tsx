import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container, Section, Card } from "@/components/Section";
import { ButtonLink } from "@/components/Button";

export const metadata: Metadata = {
  title: "VVIP Membership",
  description:
    "VVIP is the more advanced multi-group option: R10 base monthly maintenance plus R10 per VVIP group. Owner authorization always applies.",
};

export default function Vvip() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="VVIP"
        subtitle="VVIP is the more advanced multi-group option, designed for users who require greater flexibility between multiple authorized groups."
      >
        <div className="mt-7 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-gold-500 px-5 py-2 text-lg font-extrabold text-brand-950">
            R10 base / month
          </span>
          <span className="rounded-full border border-brand-700 bg-brand-900/70 px-4 py-2 text-sm font-semibold text-brand-100">
            + R10 per VVIP group
          </span>
        </div>
      </PageHero>

      <Section className="bg-white">
        <Container className="max-w-4xl">
          <Card className="overflow-hidden">
            <div className="bg-brand-900 px-6 py-4">
              <h3 className="font-extrabold text-white">Pricing example</h3>
            </div>
            <div className="divide-y divide-brand-100">
              {[
                ["GoodMash maintenance", "R10"],
                ["VVIP group (2 groups)", "R20"],
                ["Total", "R30"],
              ].map(([label, price], i) => (
                <div
                  key={label}
                  className={`flex items-center justify-between px-6 py-4 ${
                    i === 2 ? "bg-brand-50" : ""
                  }`}
                >
                  <span
                    className={
                      i === 2
                        ? "font-extrabold text-brand-900"
                        : "font-semibold text-ink-soft"
                    }
                  >
                    {label}
                  </span>
                  <span
                    className={
                      i === 2
                        ? "text-xl font-extrabold text-brand-900"
                        : "font-bold text-brand-900"
                    }
                  >
                    {price}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <div className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-6">
            <h3 className="text-lg font-extrabold text-brand-900">
              Important
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              VVIP does not override group-owner authorization. No matter the
              membership tier, the connection owner still approves and controls
              who participates in their group. VVIP simply provides greater
              multi-group flexibility.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/pricing" variant="primary">
              See the checkout flow
            </ButtonLink>
            <ButtonLink href="/vip" variant="secondary">
              Compare with VIP
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
