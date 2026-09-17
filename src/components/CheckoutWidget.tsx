"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "./Button";
import { getSession } from "@/lib/goodmashWebAuth";

type Tier = "standard" | "vip" | "vvip";
type Maintain = "myself" | "family" | "selected" | "sponsor" | "rotate";

const TIERS = [
  { id: "standard" as const, name: "Standard", base: 10, perGroup: 0, desc: "Default account + group functionality." },
  { id: "vip" as const, name: "VIP", base: 10, perGroup: 5, desc: "Additional VIP group = R5 each." },
  { id: "vvip" as const, name: "VVIP", base: 10, perGroup: 10, desc: "VVIP group = R10 each." },
];

const MAINTAIN: { id: Maintain; label: string; hint: string }[] = [
  { id: "myself", label: "Myself", hint: "Maintain my own account." },
  { id: "family", label: "My family group", hint: "Maintain multiple family members." },
  { id: "selected", label: "Selected members", hint: "Maintain chosen members." },
  { id: "sponsor", label: "Sponsor another member", hint: "Pay for another GoodMash user where the relationship allows it." },
  { id: "rotate", label: "Rotating responsibility", hint: "This month's responsibility — shared rotation." },
];

const PAYMENT_METHODS = [
  { id: "payfast", name: "PayFast", status: "available" as const, note: "Real PayFast checkout path — Sandbox while testing." },
  { id: "ozow", name: "Ozow", status: "coming" as const, note: "Coming soon." },
  { id: "flashpay", name: "FlashPay", status: "coming" as const, note: "Coming soon." },
  { id: "yoco", name: "Yoco", status: "coming" as const, note: "Coming soon." },
];

function submitPayFast(action: string, fields: Record<string, string>) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

export function CheckoutWidget() {
  const [maintain, setMaintain] = useState<Maintain>("myself");
  const [tier, setTier] = useState<Tier>("standard");
  const [extraGroups, setExtraGroups] = useState(0);
  const [step, setStep] = useState<"select" | "review" | "payment">("select");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const active = TIERS.find((t) => t.id === tier)!;
  const total = useMemo(() => active.base + active.perGroup * extraGroups, [active, extraGroups]);

  async function startPayFast(event?: FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const session = getSession();
      if (!session) throw new Error("Please sign in to start a real GoodMash maintenance payment.");
      if (maintain !== "myself") throw new Error("PayFast account maintenance is enabled first for your own account. Family, selected-member and sponsorship payment authorization will be connected after the group-payment backend is enabled.");

      const response = await fetch("/api/payfast/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.idToken}` },
        body: JSON.stringify({ tier, extraGroups }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Could not start PayFast checkout.");
      submitPayFast(data.action, data.fields);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start payment.");
      setLoading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-brand-200 bg-white shadow-sm">
      <div className="border-b border-brand-100 bg-brand-900 px-6 py-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h3 className="text-lg font-extrabold text-white">GoodMash Checkout</h3><p className="text-xs text-brand-200">App Monthly Maintenance Fee — R10 · PayFast payment is verified server-side before maintenance is activated.</p></div>
          <div className="flex items-center gap-1.5">{(["select", "review", "payment"] as const).map((s, i) => <span key={s} className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${step === s ? "bg-gold-500 text-brand-950" : "bg-brand-800 text-brand-200"}`}>{i + 1}</span>)}</div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {step === "select" && <div className="space-y-6">
          <fieldset><legend className="mb-3 text-sm font-bold text-brand-900">1 · What are you maintaining?</legend><div className="grid gap-2.5 sm:grid-cols-2">{MAINTAIN.map((m) => <label key={m.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${maintain === m.id ? "border-brand-600 bg-brand-50" : "border-brand-200 bg-white hover:bg-brand-50/50"}`}><input type="radio" name="maintain" className="mt-1 accent-brand-700" checked={maintain === m.id} onChange={() => setMaintain(m.id)} /><span><span className="block text-sm font-bold text-brand-900">{m.label}</span><span className="block text-xs text-ink-soft">{m.hint}</span></span></label>)}</div></fieldset>
          <fieldset><legend className="mb-3 text-sm font-bold text-brand-900">2 · Choose your membership tier</legend><div className="grid gap-2.5 sm:grid-cols-3">{TIERS.map((t) => <label key={t.id} className={`cursor-pointer rounded-xl border px-4 py-3 transition-colors ${tier === t.id ? "border-brand-600 bg-brand-50" : "border-brand-200 bg-white hover:bg-brand-50/50"}`}><input type="radio" name="tier" className="sr-only" checked={tier === t.id} onChange={() => { setTier(t.id); if (t.id === "standard") setExtraGroups(0); }} /><span className="block text-sm font-extrabold text-brand-900">{t.name}</span><span className="block text-xs text-ink-soft">R{t.base} base{t.perGroup > 0 && ` + R${t.perGroup}/extra group`}</span></label>)}</div></fieldset>
          {tier !== "standard" && <div><label htmlFor="groups" className="mb-2 block text-sm font-bold text-brand-900">3 · Additional groups (in {active.name})</label><div className="flex items-center gap-4"><button type="button" aria-label="Fewer groups" onClick={() => setExtraGroups((n) => Math.max(0, n - 1))} className="grid h-11 w-11 place-items-center rounded-full border border-brand-300 text-xl font-bold text-brand-800 hover:bg-brand-100">−</button><span className="w-16 text-center text-2xl font-extrabold text-brand-900">{extraGroups}</span><button type="button" aria-label="More groups" onClick={() => setExtraGroups((n) => Math.min(10, n + 1))} className="grid h-11 w-11 place-items-center rounded-full border border-brand-300 text-xl font-bold text-brand-800 hover:bg-brand-100">+</button></div></div>}
          <div className="rounded-2xl bg-brand-50 p-5"><div className="flex items-center justify-between text-sm"><span className="font-semibold text-ink-soft">Base maintenance (30 days free, then monthly)</span><span className="font-bold text-brand-900">R{active.base}</span></div>{tier !== "standard" && <div className="mt-2 flex items-center justify-between text-sm"><span className="font-semibold text-ink-soft">{extraGroups} × {active.name} group fee (R{active.perGroup})</span><span className="font-bold text-brand-900">+R{active.perGroup * extraGroups}</span></div>}<div className="mt-3 flex items-center justify-between border-t border-brand-200 pt-3"><span className="font-extrabold text-brand-900">Monthly total</span><span className="text-xl font-extrabold text-brand-900">R{total}</span></div></div>
          <Button onClick={() => setStep("review")} size="lg" className="w-full">Continue to review</Button>
        </div>}

        {step === "review" && <div className="space-y-5"><h4 className="text-lg font-extrabold text-brand-900">Review your selection</h4><dl className="divide-y divide-brand-100 rounded-2xl border border-brand-200">{[["Maintaining", MAINTAIN.find((m) => m.id === maintain)!.label],["Membership tier", active.name],["Additional groups", String(extraGroups)],["Monthly total", `R${total}`]].map(([k, v]) => <div key={k} className="flex items-center justify-between px-5 py-3.5"><dt className="text-sm text-ink-soft">{k}</dt><dd className="text-sm font-bold text-brand-900">{v}</dd></div>)}</dl><p className="text-xs leading-relaxed text-ink-soft">The final amount is calculated by the GoodMash backend. The R10 maintenance fee is for the GoodMash platform and is not the price of mobile data.</p><div className="flex flex-wrap gap-3"><Button variant="secondary" onClick={() => setStep("select")}>Back</Button><Button onClick={() => setStep("payment")} className="flex-1">Choose payment method</Button></div></div>}

        {step === "payment" && <form onSubmit={startPayFast} className="space-y-5"><h4 className="text-lg font-extrabold text-brand-900">Choose payment method</h4><div className="grid gap-3 sm:grid-cols-2">{PAYMENT_METHODS.map((method) => <div key={method.id} className={`rounded-2xl border p-5 ${method.status === "available" ? "border-brand-300 bg-brand-50" : "border-brand-200 bg-white opacity-70"}`}><div className="flex items-center justify-between"><span className="font-extrabold text-brand-900">{method.name}</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${method.status === "available" ? "bg-green-100 text-green-800" : "bg-brand-100 text-ink-soft"}`}>{method.status === "available" ? "AVAILABLE" : "COMING SOON"}</span></div><p className="mt-2 text-xs text-ink-soft">{method.note}</p>{method.id === "payfast" && <Button type="submit" variant="gold" disabled={loading} className="mt-4 w-full">{loading ? "Opening PayFast…" : `Pay R${total} with PayFast`}</Button>}</div>)}</div>{error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">{error}</div>}<div className="rounded-2xl border border-brand-200 bg-brand-50 p-5 text-sm text-ink-soft">PayFast opens its secure hosted checkout. GoodMash does not collect or store your card/payment credentials. Returning to the website does not activate maintenance by itself; activation occurs only after server-side PayFast verification.</div><Button type="button" variant="secondary" onClick={() => setStep("review")}>Back</Button></form>}
      </div>
    </div>
  );
}
