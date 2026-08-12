import { Container } from "./Section";

const NODES = [
  {
    title: "Provider",
    desc: "An authorized member whose available connection is shared.",
    color: "bg-brand-100 text-brand-900 border-brand-300",
  },
  {
    title: "GoodMash",
    desc: "The platform that manages authorization and secure connectivity.",
    color: "bg-brand-800 text-white border-brand-800",
  },
  {
    title: "Authorized Connection",
    desc: "An approved, permission-controlled connection.",
    color: "bg-gold-100 text-brand-900 border-gold-500",
  },
  {
    title: "Member",
    desc: "An authorized participant using the connection as permitted.",
    color: "bg-brand-100 text-brand-900 border-brand-300",
  },
];

export function FlowDiagram() {
  return (
    <div className="rounded-3xl border border-brand-200 bg-white p-6 sm:p-10">
      <ol className="flex flex-col items-stretch gap-6 md:flex-row md:items-center md:gap-4">
        {NODES.map((node, i) => (
          <li key={node.title} className="flex flex-1 flex-col items-center gap-6 md:flex-row md:gap-4">
            <div
              className={`flex w-full flex-col items-center gap-2 rounded-2xl border px-5 py-6 text-center shadow-sm ${node.color}`}
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-sm font-extrabold ring-1 ring-current">
                {i + 1}
              </span>
              <p className="text-lg font-extrabold">{node.title}</p>
              <p className="text-xs leading-relaxed opacity-80">{node.desc}</p>
            </div>
            {i < NODES.length - 1 && (
              <span
                aria-hidden="true"
                className="hidden text-brand-500 md:block"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
                  <path
                    d="M5 12h13m0 0l-5-5m5 5l-5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-8 text-center text-xs text-ink-soft">
        Simple conceptual view. Actual connectivity is established securely and
        depends on device and network capabilities.
      </p>
    </div>
  );
}

export function DiagramSection({ children }: { children?: React.ReactNode }) {
  return (
    <Container className="mt-8">
      <FlowDiagram />
      {children}
    </Container>
  );
}
