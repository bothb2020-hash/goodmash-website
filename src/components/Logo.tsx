import Link from "next/link";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="GoodMash.io home"
      className="inline-flex items-center gap-2.5"
    >
      <span
        aria-hidden="true"
        className="grid h-9 w-9 place-items-center rounded-xl bg-brand-800 text-gold-400 shadow-sm ring-1 ring-brand-700"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <circle cx="12" cy="5" r="2.4" fill="currentColor" />
          <circle cx="5" cy="18" r="2.4" fill="currentColor" />
          <circle cx="19" cy="18" r="2.4" fill="currentColor" />
          <path
            d="M12 5v4.2M10.4 10.1l-3.5 5.9M13.6 10.1l3.5 5.9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span
        className={`text-lg font-extrabold tracking-tight ${
          dark ? "text-white" : "text-brand-900"
        }`}
      >
        GoodMash<span className="text-gold-500">.io</span>
      </span>
    </Link>
  );
}
