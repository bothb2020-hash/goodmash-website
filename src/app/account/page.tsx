"use client";

import { useEffect, useState } from "react";
import { Container, Section, Card } from "@/components/Section";
import { clearSession, getCurrentUserProfile, getSession } from "@/lib/goodmashWebAuth";

export default function AccountPage() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getSession()) {
      window.location.href = "/login";
      return;
    }
    getCurrentUserProfile().then(setProfile).catch((e) => setError(e.message));
  }, []);

  if (error) return <Section><Container><Card><p className="text-red-700">{error}</p></Card></Container></Section>;
  if (!profile) return <Section><Container><Card><p>Loading your GoodMash account…</p></Card></Container></Section>;

  const subscription = profile.subscription || {};
  const owned = profile.ownedNetworkIds || [];
  const joined = profile.joinedNetworkIds || [];

  return (
    <Section className="bg-brand-50">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm font-bold uppercase tracking-wider text-brand-700">GoodMash account</p><h1 className="mt-1 text-3xl font-extrabold text-brand-950">Welcome, {profile.displayName || "GoodMash member"}</h1><p className="mt-1 text-ink-soft">{profile.email}</p></div>
          <button onClick={() => { clearSession(); window.location.href = "/login"; }} className="rounded-full border border-brand-200 bg-white px-5 py-2.5 text-sm font-bold text-brand-900">Log out</button>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card><p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Maintenance</p><p className="mt-2 text-2xl font-extrabold text-brand-900">{subscription.status || "trial"}</p><p className="mt-2 text-sm text-ink-soft">The mobile app reads the same account record.</p></Card>
          <Card><p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Membership</p><p className="mt-2 text-2xl font-extrabold text-brand-900">{subscription.membershipTier || "standard"}</p><p className="mt-2 text-sm text-ink-soft">Standard, VIP and VVIP state is stored with the account.</p></Card>
          <Card><p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Groups</p><p className="mt-2 text-2xl font-extrabold text-brand-900">{owned.length + joined.length}</p><p className="mt-2 text-sm text-ink-soft">Owned: {owned.length} · Joined: {joined.length}</p></Card>
        </div>
        <div className="mt-8 rounded-3xl bg-brand-950 p-7 text-white">
          <h2 className="text-xl font-extrabold">One GoodMash identity</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-100/80">This account is stored in the GoodMash Firebase project used by the mobile application. Website and app account identity can therefore stay synchronized while the connection engine remains inside the app.</p>
        </div>
      </Container>
    </Section>
  );
}
