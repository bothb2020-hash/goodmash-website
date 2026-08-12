"use client";

import { useMemo, useState } from "react";
import { Button } from "./Button";
import { DemoBanner } from "./DemoBanner";

type Tier = "standard" | "vip" | "vvip";
type Maintain = "myself" | "family" | "selected" | "sponsor" | "rotate";

const TIERS: { id: Tier; name: string; base: number; perGroup: number; desc: string }[] = [
  { id: "standard", name: "Standard", base: 10, perGroup: 0, desc: "Default account + group functionality." },
  { id: "vip", name: "VIP", base: 10, perGroup: 5, desc: "Additional VIP group = R5 each." },
  { id: "vvip", name: "VVIP", base: 10, perGroup: 10, desc: "VVIP group = R10 each." },
];

const MAINTAIN: { id: Maintain; label: string; hint: string }[] = [
  { id: "myself", label: "Myself", hint: "Maintain my own account." },
  { id: "family", label: "My family group", hint: "Maintain multiple family members." },
  { id: "selected", label: "Selected members", hint: "Maintain chosen members." },
  { id: "sponsor", label: "Sponsor another member", hint: "Pay for another GoodMash user where the relationship allows it." },
  { id: "rotate", label: "Rotating responsibility", hint: "This month's responsibility — shared rotation." },
];

export function CheckoutWidget() {
  const [maintain, setMaintain] = useState<Maintain>("myself");
  const [tier, setTier] = useState<Tier>("standard");
  const [extraGroups, setExtraGroups] = useState(0);
  const [step, setStep] = useState<"select" | "review" | "payment">("select");

  const active = TIERS.find((t) => t.id === tier)!;
  const total = useMemo(
    () => active.base + active.perGroup * extraGroups,
    [active, extraGroups]
  );

  return (
    <div className="overflow-hidden rounded-3xl border border-brand-200 bg-white shadow-sm">
      <div className="border-b border-brand-100 bg-brand-900 px-6 py-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-white">
              GoodMash Checkout
            </h3>
            <p className="text-xs text-brand-200">
              App Monthly Maintenance Fee — R10 · Final amount always calculated
              by the backend.
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {(["select", "review", "payment"] as const).map((s, i) => (
              <span
                key={s}
                className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
                  step === s
                    ? "bg-gold-500 text-brand-950"
                    : "bg-brand-800 text-brand-200"
                }`}
              >
                {i + 1}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="mb-4">
          <DemoBanner text="This checkout is a DEMO / PREVIEW. No real payment is made and no real charge will occur." />
        </div>

        {step === "select" && (
          <div className="space-y-6">
            <fieldset>
              <legend className="mb-3 text-sm font-bold text-brand-900">
                1 · What are you maintaining?
              </legend>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {MAINTAIN.map((m) => (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                      maintain === m.id
                        ? "border-brand-600 bg-brand-50"
                        : "border-brand-200 bg-white hover:bg-brand-50/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="maintain"
                      className="mt-1 accent-brand-700"
                      checked={maintain === m.id}
                      onChange={() => setMaintain(m.id)}
                    />
                    <span>
                      <span className="block text-sm font-bold text-brand-900">
                        {m.label}
                      </span>
                      <span className="block text-xs text-ink-soft">
                        {m.hint}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-sm font-bold text-brand-900">
                2 · Choose your membership tier
              </legend>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {TIERS.map((t) => (
                  <label
                    key={t.id}
                    className={`cursor-pointer rounded-xl border px-4 py-3 transition-colors ${
                      tier === t.id
                        ? "border-brand-600 bg-brand-50"
                        : "border-brand-200 bg-white hover:bg-brand-50/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tier"
                      className="sr-only"
                      checked={tier === t.id}
                      onChange={() => {
                        setTier(t.id);
                        if (t.id === "standard") setExtraGroups(0);
                      }}
                    />
                    <span className="block text-sm font-extrabold text-brand-900">
                      {t.name}
                    </span>
                    <span className="block text-xs text-ink-soft">
                      R{t.base} base
                      {t.perGroup > 0 && ` + R${t.perGroup}/extra group`}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {tier !== "standard" && (
              <div>
                <label
                  htmlFor="groups"
                  className="mb-2 block text-sm font-bold text-brand-900"
                >
                  3 · Additional groups (in {active.name})
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    aria-label="Fewer groups"
                    onClick={() => setExtraGroups((n) => Math.max(0, n - 1))}
                    className="grid h-11 w-11 place-items-center rounded-full border border-brand-300 text-xl font-bold text-brand-800 hover:bg-brand-100"
                  >
                    −
                  </button>
                  <span className="w-16 text-center text-2xl font-extrabold text-brand-900">
                    {extraGroups}
                  </span>
                  <button
                    type="button"
                    aria-label="More groups"
                    onClick={() => setExtraGroups((n) => Math.min(10, n + 1))}
                    className="grid h-11 w-11 place-items-center rounded-full border border-brand-300 text-xl font-bold text-brand-800 hover:bg-brand-100"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-brand-50 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-ink-soft">
                  Base maintenance (30 days free, then monthly)
                </span>
                <span className="font-bold text-brand-900">R{active.base}</span>
              </div>
              {tier !== "standard" && (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink-soft">
                    {extraGroups} × {active.name} group fee (R
                    {active.perGroup})
                  </span>
                  <span className="font-bold text-brand-900">
                    +R{active.perGroup * extraGroups}
                  </span>
                </div>
              )}
              <div className="mt-3 flex items-center justify-between border-t border-brand-200 pt-3">
                <span className="font-extrabold text-brand-900">
                  Monthly total
                </span>
                <span className="text-xl font-extrabold text-brand-900">
                  R{total}
                </span>
              </div>
            </div>

            <Button onClick={() => setStep("review")} size="lg" className="w-full">
              Continue to review
            </Button>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-5">
            <h4 className="text-lg font-extrabold text-brand-900">
              Review your selection
            </h4>
            <dl className="divide-y divide-brand-100 rounded-2xl border border-brand-200">
              {[
                ["Maintaining", MAINTAIN.find((m) => m.id === maintain)!.label],
                ["Membership tier", active.name],
                ["Additional groups", String(extraGroups)],
                ["Monthly total", `R${total}`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between px-5 py-3.5">
                  <dt className="text-sm text-ink-soft">{k}</dt>
                  <dd className="text-sm font-bold text-brand-900">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="text-xs leading-relaxed text-ink-soft">
              The final amount is always calculated by the secure GoodMash
              backend. The app maintenance fee is R10 per month and is NOT the
              price of mobile data.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => setStep("select")}>
                Back
              </Button>
              <Button onClick={() => setStep("payment")} className="flex-1">
                Continue to payment
              </Button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-5">
            <h4 className="text-lg font-extrabold text-brand-900">
              Secure payment
            </h4>
            <div className="space-y-2 rounded-2xl border border-brand-200 bg-brand-50 p-5 text-sm">
              {[
                "GoodMash selection confirmed",
                "Redirecting to Ozow (secure payment provider)",
                "Ozow verification",
                "Verified payment",
                "Maintenance activated",
              ].map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-800 text-xs font-bold text-gold-400">
                    {i + 1}
                  </span>
                  <span className="text-ink-soft">{s}</span>
                  {i > 0 && (
                    <span className="ml-auto text-xs font-bold text-brand-600">
                      Secure
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="rounded-2xl border-2 border-dashed border-gold-500 bg-gold-100 p-5">
              <p className="text-sm font-semibold text-brand-900">
                DEMO — Payment redirect disabled. In production this redirects
                securely to Ozow. No payment credentials are ever stored on the
                website.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => setStep("review")}>
                Back
              </Button>
              <Button
                variant="gold"
                onClick={() => {
                  setStep("select");
                  setExtraGroups(0);
                  setMaintain("myself");
                }}
                className="flex-1"
              >
                Reset demo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
