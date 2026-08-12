import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container, Section, Card } from "@/components/Section";
import { ButtonLink } from "@/components/Button";

export const metadata: Metadata = {
  title: "VIP Membership",
  description:
    "VIP is an optional enhanced group-membership capability: R10 base monthly maintenance plus R5 for each additional VIP group.",
};

export default function Vip() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="VIP"
        subtitle="VIP is an optional enhanced group-membership capability. It allows a user to remain associated with an existing group while participating in another group where permitted."
      >
        <div className="mt-7 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-gold-500 px-5 py-2 text-lg font-extrabold text-brand-950">
            R10 base / month
          </span>
          <span className="rounded-full border border-brand-700 bg-brand-900/70 px-4 py-2 text-sm font-semibold text-brand-100">
            + R5 per additional VIP group
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
                ["Additional VIP group", "R5"],
                ["Total", "R15"],
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
              How VIP works
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
              <li>
                • VIP builds on your existing Standard account maintenance of
                R10.
              </li>
              <li>
                • Each additional VIP group you participate in adds R5 to the
                monthly amount.
              </li>
              <li>
                • VIP lets you stay connected to your original group while
                taking part in another group where the other group&apos;s owner
                permits it.
              </li>
              <li>
                • The final amount is always calculated by the secure GoodMash
                backend.
              </li>
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/pricing" variant="primary">
              See the checkout flow
            </ButtonLink>
            <ButtonLink href="/vvip" variant="secondary">
              Compare with VVIP
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
