"use client";

import { useState } from "react";
import { DemoBanner, Tick } from "./DemoBanner";
import { Button } from "./Button";

const TABS = [
  { id: "account", label: "Account" },
  { id: "family", label: "Family" },
  { id: "group", label: "Group" },
  { id: "connection", label: "Connection" },
  { id: "maintenance", label: "Maintenance" },
  { id: "tiers", label: "VIP / VVIP" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function DemoPage() {
  const [tab, setTab] = useState<TabId>("account");

  return (
    <div>
      <div className="mb-6">
        <DemoBanner text="DEMO / PREVIEW MODE — This page simulates the GoodMash experience. No connection here is real, no account is created and no payment is made. Real features may vary by device and platform." />
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              tab === t.id
                ? "bg-brand-800 text-white"
                : "border border-brand-300 bg-white text-brand-800 hover:bg-brand-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "account" && <AccountPanel />}
        {tab === "family" && <FamilyPanel />}
        {tab === "group" && <GroupPanel />}
        {tab === "connection" && <ConnectionPanel />}
        {tab === "maintenance" && <MaintenancePanel />}
        {tab === "tiers" && <TiersPanel />}
      </div>
    </div>
  );
}

function PanelShell({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-brand-200 bg-white shadow-sm">
      <div className="border-b border-brand-100 bg-brand-900 px-6 py-4">
        <h2 className="text-lg font-extrabold text-white">{title}</h2>
        <p className="text-xs text-brand-200">{desc}</p>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  );
}

function AccountPanel() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  return (
    <PanelShell
      title="Account creation"
      desc="Simulated preview of the sign-up flow."
    >
      {done ? (
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-100 text-brand-700">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
              <path
                d="M5 12.5l4.5 4.5L19 7.5"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h3 className="mt-4 text-xl font-extrabold text-brand-900">
            Welcome, {name || "Mashifane"}!
          </h3>
          <p className="mt-2 text-sm text-ink-soft">
            Your demo account is ready with <strong>30 days free</strong>. A
            real account would be verified securely by the GoodMash backend.
          </p>
          <button
            type="button"
            onClick={() => {
              setDone(false);
              setName("");
              setPhone("");
            }}
            className="mt-6 rounded-full border border-brand-300 px-5 py-2.5 text-sm font-semibold text-brand-800 hover:bg-brand-50"
          >
            Reset demo
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
          className="mx-auto max-w-md space-y-4"
        >
          <div>
            <label htmlFor="d-name" className="mb-2 block text-sm font-semibold text-brand-900">
              Full name
            </label>
            <input
              id="d-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bohlale Mashifane"
              className="h-12 w-full rounded-xl border border-brand-300 bg-white px-4 text-sm text-brand-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label htmlFor="d-phone" className="mb-2 block text-sm font-semibold text-brand-900">
              Phone number
            </label>
            <input
              id="d-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+27 ..."
              className="h-12 w-full rounded-xl border border-brand-300 bg-white px-4 text-sm text-brand-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <Button type="submit" className="w-full">
            Create demo account
          </Button>
          <p className="text-center text-[11px] text-ink-soft">
            DEMO — no account is created and no data is stored.
          </p>
        </form>
      )}
    </PanelShell>
  );
}

const FAMILY = [
  { name: "Dad", status: "Authorized" },
  { name: "Mom", status: "Authorized" },
  { name: "Child 1", status: "Authorized" },
  { name: "Child 2", status: "Authorized" },
  { name: "Child 3", status: "Pending approval" },
  { name: "Uncle (blocked)", status: "Blocked" },
];

function FamilyPanel() {
  return (
    <PanelShell
      title="Sample family group"
      desc="A private group where the owner controls who participates."
    >
      <ul className="mx-auto max-w-xl space-y-2.5">
        {FAMILY.map((m) => {
          const pending = m.status === "Pending approval";
          const blocked = m.status === "Blocked";
          return (
            <li
              key={m.name}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                blocked
                  ? "border-red-200 bg-red-50"
                  : pending
                  ? "border-gold-300 bg-gold-100"
                  : "border-brand-200 bg-white"
              }`}
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-800 text-sm font-bold text-white">
                {m.name.charAt(0)}
              </span>
              <span className="font-semibold text-brand-900">{m.name}</span>
              <span
                className={`ml-auto rounded-full px-3 py-1 text-xs font-bold ${
                  blocked
                    ? "bg-red-100 text-red-600"
                    : pending
                    ? "bg-gold-400 text-brand-950"
                    : "bg-brand-100 text-brand-700"
                }`}
              >
                {m.status}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-center text-xs text-ink-soft">
        Demo — the owner approves, rejects, removes or blocks members. No
        public contribution leaderboards are shown.
      </p>
    </PanelShell>
  );
}

function GroupPanel() {
  const [members, setMembers] = useState<
    { name: string; status: "Authorized" | "Pending" | "Removed" }[]
  >([
    { name: "Thabo", status: "Authorized" },
    { name: "Lerato", status: "Authorized" },
    { name: "Sipho", status: "Pending" },
    { name: "Naledi", status: "Pending" },
  ]);

  const update = (name: string, status: "Authorized" | "Pending" | "Removed") =>
    setMembers((m) =>
      m.map((x) => (x.name === name ? { ...x, status } : x))
    );

  return (
    <PanelShell
      title="Group management"
      desc="The group owner approves or removes authorized members."
    >
      <ul className="mx-auto max-w-xl space-y-2.5">
        {members.map((m) => (
          <li
            key={m.name}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-brand-200 bg-white px-4 py-3"
          >
            <Tick cross={m.status === "Removed"} />
            <span className="font-semibold text-brand-900">{m.name}</span>
            {m.status === "Pending" && (
              <span className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => update(m.name, "Authorized")}
                  className="rounded-full bg-brand-800 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-brand-700"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => update(m.name, "Removed")}
                  className="rounded-full border border-red-300 px-3.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                >
                  Reject
                </button>
              </span>
            )}
            {m.status === "Authorized" && (
              <span className="ml-auto text-xs font-bold text-brand-600">
                ✓ Authorized
              </span>
            )}
            {m.status === "Removed" && (
              <span className="ml-auto text-xs font-bold text-red-500">
                Removed
              </span>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-center text-xs text-ink-soft">
        Demo — approval is required before anyone can participate.
      </p>
    </PanelShell>
  );
}

const CONN_STATES = [
  { id: "excellent", label: "Excellent", color: "bg-brand-500", note: "Strong available connection." },
  { id: "good", label: "Good", color: "bg-brand-400", note: "Solid connection." },
  { id: "fair", label: "Fair", color: "bg-gold-500", note: "Reduced performance." },
  { id: "unavailable", label: "Unavailable", color: "bg-red-500", note: "No authorized connection." },
] as const;

function ConnectionPanel() {
  const [state, setState] = useState<(typeof CONN_STATES)[number]["id"]>("good");

  const current = CONN_STATES.find((c) => c.id === state)!;

  return (
    <PanelShell
      title="Connection screen"
      desc="Simulated connection status screen — NOT a real Internet tunnel."
    >
      <div className="mx-auto max-w-md rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className={`h-4 w-4 rounded-full ${current.color} animate-pulse`} />
          <p className="text-2xl font-extrabold text-brand-900">{current.label}</p>
        </div>
        <p className="mt-2 text-sm text-ink-soft">{current.note}</p>
        <p className="mt-4 rounded-xl bg-white px-4 py-3 text-xs text-ink-soft">
          Simulated demo status. A real UI status is not proof of
          connectivity — the real app is physically tested on devices.
        </p>
      </div>
      <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-2">
        {CONN_STATES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setState(c.id)}
            className={`rounded-xl border px-4 py-3 text-sm font-bold transition-colors ${
              state === c.id
                ? "border-brand-700 bg-brand-800 text-white"
                : "border-brand-200 bg-white text-brand-800 hover:bg-brand-50"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </PanelShell>
  );
}

function MaintenancePanel() {
  const [option, setOption] = useState("Myself");
  const [tier, setTier] = useState("Standard");
  const price =
    tier === "Standard" ? "R10" : tier === "VIP" ? "R15" : "R20";

  return (
    <PanelShell
      title="Maintenance screen"
      desc="Flexible maintenance options with a simulated total."
    >
      <div className="mx-auto grid max-w-2xl gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold text-brand-900">
            I want to maintain
          </label>
          <div className="space-y-2">
            {["Myself", "My family group", "Selected members", "Sponsor another member", "Rotating responsibility"].map(
              (o) => (
                <label
                  key={o}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                    option === o
                      ? "border-brand-700 bg-brand-50 text-brand-900"
                      : "border-brand-200 bg-white text-ink-soft"
                  }`}
                >
                  <input
                    type="radio"
                    name="maintain-demo"
                    checked={option === o}
                    onChange={() => setOption(o)}
                    className="accent-brand-700"
                  />
                  {o}
                </label>
              )
            )}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-brand-900">
            Membership tier
          </label>
          <div className="space-y-2">
            {["Standard", "VIP", "VVIP"].map((t) => (
              <label
                key={t}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                  tier === t
                    ? "border-brand-700 bg-brand-50 text-brand-900"
                    : "border-brand-200 bg-white text-ink-soft"
                }`}
              >
                <input
                  type="radio"
                  name="tier-demo"
                  checked={tier === t}
                  onChange={() => setTier(t)}
                  className="accent-brand-700"
                />
                {t}
              </label>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-brand-900 p-5 text-white">
            <p className="text-xs text-brand-200">Monthly total (demo)</p>
            <p className="text-3xl font-extrabold text-gold-400">{price}</p>
            <p className="mt-1 text-xs text-brand-200">
              {option} · {tier} · 30 days free then R10 app maintenance
            </p>
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

function TiersPanel() {
  const [groupCount, setGroupCount] = useState(1);

  const vip = 10 + 5 * groupCount;
  const vvip = 10 + 10 * groupCount;

  return (
    <PanelShell
      title="VIP / VVIP concept"
      desc="Compare membership flexibility and totals."
    >
      <div className="mx-auto max-w-xl">
        <div className="mb-5 flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-5 py-4">
          <span className="text-sm font-semibold text-brand-900">
            Additional groups (demo)
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Fewer"
              onClick={() => setGroupCount((n) => Math.max(0, n - 1))}
              className="grid h-9 w-9 place-items-center rounded-full border border-brand-300 font-bold text-brand-800 hover:bg-brand-100"
            >
              −
            </button>
            <span className="w-10 text-center text-xl font-extrabold text-brand-900">
              {groupCount}
            </span>
            <button
              type="button"
              aria-label="More"
              onClick={() => setGroupCount((n) => Math.min(10, n + 1))}
              className="grid h-9 w-9 place-items-center rounded-full border border-brand-300 font-bold text-brand-800 hover:bg-brand-100"
            >
              +
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-brand-200 bg-white p-6">
            <h3 className="font-extrabold text-brand-900">VIP</h3>
            <p className="mt-1 text-xs text-ink-soft">
              R10 base + R5 per additional VIP group
            </p>
            <p className="mt-4 text-3xl font-extrabold text-brand-900">
              R{vip}
              <span className="text-sm font-semibold text-ink-soft">/mo</span>
            </p>
            <p className="mt-3 text-xs text-ink-soft">
              Stay in your existing group while participating in another where
              permitted.
            </p>
          </div>
          <div className="rounded-2xl border-2 border-gold-500 bg-gold-100 p-6">
            <h3 className="font-extrabold text-brand-900">VVIP</h3>
            <p className="mt-1 text-xs text-brand-900/70">
              R10 base + R10 per VVIP group
            </p>
            <p className="mt-4 text-3xl font-extrabold text-brand-900">
              R{vvip}
              <span className="text-sm font-semibold text-brand-900/70">/mo</span>
            </p>
            <p className="mt-3 text-xs text-brand-900/70">
              Greater multi-group flexibility. Owner authorization still
              applies.
            </p>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-ink-soft">
          Demo — the final amount is always calculated by the secure GoodMash
          backend.
        </p>
      </div>
    </PanelShell>
  );
}
