"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const NAV = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Connectivity", href: "/connectivity" },
  { label: "Groups", href: "/groups" },
  { label: "Pricing", href: "/pricing" },
  { label: "Support", href: "/support" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-all duration-300 ${
        scrolled || open
          ? "border-brand-200/70 bg-cream/95 backdrop-blur"
          : "border-transparent bg-cream/80 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-brand-100 text-brand-900"
                        : "text-ink-soft hover:bg-brand-50 hover:text-brand-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-100"
          >
            Login
          </Link>
          <Link
            href="/download"
            className="rounded-full bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700"
          >
            Get GoodMash
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg text-brand-900 hover:bg-brand-100 lg:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-200/70 bg-cream lg:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-xl px-4 py-3 text-base font-semibold ${
                        active
                          ? "bg-brand-100 text-brand-900"
                          : "text-ink-soft hover:bg-brand-50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex flex-col gap-3 border-t border-brand-200/70 pt-4">
              <Link
                href="/download"
                onClick={() => setOpen(false)}
                className="rounded-full bg-brand-800 px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Get GoodMash
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-full border-2 border-brand-800 px-5 py-3 text-center text-sm font-semibold text-brand-900"
              >
                Login
              </Link>
              <Link
                href="/demo"
                onClick={() => setOpen(false)}
                className="rounded-full border border-brand-300 px-5 py-3 text-center text-sm font-semibold text-brand-700"
              >
                View Demo
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
