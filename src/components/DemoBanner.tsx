export function DemoBanner({ text }: { text?: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border-2 border-gold-500 bg-gold-100 p-4">
      <span
        aria-hidden="true"
        className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-500 text-brand-950"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path
            d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z"
            fill="currentColor"
          />
        </svg>
      </span>
      <p className="text-sm font-semibold leading-relaxed text-brand-900">
        {text ??
          "This is a DEMO / PREVIEW. Nothing shown here is a real connection and no real payment is made."}
      </p>
    </div>
  );
}

export function Tick({ cross = false }: { cross?: boolean }) {
  return cross ? (
    <span className="inline-grid h-6 w-6 shrink-0 place-items-center rounded-full bg-red-100 text-red-600">
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  ) : (
    <span className="inline-grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700">
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="M5 12.5l4.5 4.5L19 7.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
