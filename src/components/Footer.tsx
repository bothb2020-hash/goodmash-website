import Link from "next/link";
import { Logo } from "./Logo";

const PLATFORM = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Connectivity", href: "/connectivity" },
  { label: "Groups", href: "/groups" },
  { label: "Pricing", href: "/pricing" },
  { label: "Demo", href: "/demo" },
  { label: "Download", href: "/download" },
];

const MEMBERSHIP = [
  { label: "Standard", href: "/standard" },
  { label: "VIP", href: "/vip" },
  { label: "VVIP", href: "/vvip" },
  { label: "Security", href: "/security" },
  { label: "Support", href: "/support" },
  { label: "Login", href: "/login" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Connection Sharing Policy", href: "/connection-sharing-policy" },
  { label: "Acceptable Use Policy", href: "/acceptable-use" },
  { label: "Payment Terms", href: "/payment-terms" },
  { label: "Refund & Cancellation", href: "/refunds" },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-900 bg-brand-950 text-brand-100">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <Logo dark />
            <p className="max-w-xs text-sm leading-relaxed text-brand-200/70">
              Your Connection. Your People. Your Network. A South African
              connectivity platform for private, authorized GoodMash groups.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold-400">
              Platform
            </h3>
            <ul className="space-y-2.5">
              {PLATFORM.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-brand-200/80 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold-400">
              Membership
            </h3>
            <ul className="space-y-2.5">
              {MEMBERSHIP.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-brand-200/80 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold-400">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm text-brand-200/80">
              <li>
                <a href="tel:+27693313143" className="hover:text-white">
                  WhatsApp / Calls: +27 69 331 3143
                </a>
              </li>
              <li>
                <a
                  href="mailto:teenage2023bt@gmail.com"
                  className="hover:text-white"
                >
                  teenage2023bt@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@teenage910"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  TikTok: @teenage910
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@DJTeenage-Virus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  YouTube: DJTeenage-Virus
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-brand-800 pt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-xs text-brand-200/60 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-brand-200/50">
            © {new Date().getFullYear()} GoodMash.io · Founded by Bohlale Tufela
            Mashifane (TEENAGE). GoodMash.io is a connectivity platform and is
            not a mobile network operator. It does not sell mobile data bundles
            and is not affiliated with MTN, Vodacom, Telkom, Cell C, Rain or any
            telecommunications company.
          </p>
        </div>
      </div>
    </footer>
  );
}
