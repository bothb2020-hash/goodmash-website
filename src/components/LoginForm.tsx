"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, signUp } from "@/lib/goodmashWebAuth";

export function LoginForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "register") {
        await signUp(email.trim(), password, displayName.trim());
      } else {
        await signIn(email.trim(), password);
      }
      window.location.href = "/account";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-3xl border border-brand-800 bg-brand-900/60 p-7 shadow-xl">
      <div className="mb-6 grid grid-cols-2 rounded-xl bg-brand-950 p-1">
        <button type="button" onClick={() => setMode("login")} className={`rounded-lg px-3 py-2 text-sm font-bold ${mode === "login" ? "bg-gold-500 text-brand-950" : "text-brand-200"}`}>Login</button>
        <button type="button" onClick={() => setMode("register")} className={`rounded-lg px-3 py-2 text-sm font-bold ${mode === "register" ? "bg-gold-500 text-brand-950" : "text-brand-200"}`}>Create account</button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label htmlFor="displayName" className="mb-2 block text-sm font-semibold text-brand-100">Display name</label>
            <input id="displayName" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="GoodMash member" className="h-12 w-full rounded-xl border border-brand-700 bg-brand-950 px-4 text-sm text-white placeholder:text-brand-400 focus:border-gold-400 focus:outline-none" />
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-brand-100">Email address</label>
          <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 w-full rounded-xl border border-brand-700 bg-brand-950 px-4 text-sm text-white placeholder:text-brand-400 focus:border-gold-400 focus:outline-none" />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-semibold text-brand-100">Password</label>
          <input id="password" type="password" required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 w-full rounded-xl border border-brand-700 bg-brand-950 px-4 text-sm text-white placeholder:text-brand-400 focus:border-gold-400 focus:outline-none" />
        </div>
        {error && <p role="alert" className="rounded-xl border border-red-400/40 bg-red-950/30 px-4 py-3 text-sm text-red-200">{error}</p>}
        <button disabled={busy} type="submit" className="h-12 w-full rounded-xl bg-gold-500 font-bold text-brand-950 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60">
          {busy ? "Please wait…" : mode === "login" ? "Login to GoodMash" : "Create GoodMash account"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs leading-relaxed text-brand-200/60">
        The website and mobile app use the same GoodMash Firebase account system. Your password is sent only to Firebase Authentication and is not stored by the website.
      </p>
      <div className="mt-5 border-t border-brand-800 pt-5 text-center text-xs text-brand-200/60">
        <Link href="/download" className="font-bold text-gold-400">Get the mobile app</Link>{" · "}
        <Link href="/support" className="font-bold text-gold-400">Support</Link>
      </div>
    </div>
  );
}
