import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container, Section, SectionHeader, Card } from "@/components/Section";

export const metadata: Metadata = {
  title: "Connectivity",
  description:
    "How GoodMash handles connection control, smart connection states, failover, cross-platform support and device compatibility.",
};

const CONTROLS = [
  "Approve members",
  "Reject requests",
  "Pause sharing",
  "Stop sharing",
  "Remove members",
  "Block members",
  "Manage availability",
];

const STATES = [
  { name: "Excellent", color: "bg-brand-500", note: "Strong, stable available connection." },
  { name: "Good", color: "bg-brand-400", note: "Solid connection with normal performance." },
  { name: "Fair", color: "bg-gold-500", note: "Working connection with reduced performance." },
  { name: "Unavailable", color: "bg-red-500", note: "No authorized connection available right now." },
];

const DEVICES = [
  "Samsung",
  "Google",
  "Xiaomi",
  "Redmi",
  "POCO",
  "OPPO",
  "OnePlus",
  "vivo",
  "realme",
  "Motorola",
  "Nokia",
  "Sony",
  "TECNO",
  "Infinix",
  "Hisense",
  "ZTE",
];

const LIMITS = [
  "Background networking",
  "VPN functionality",
  "Packet forwarding",
  "Battery usage",
  "Hotspot / network sharing",
  "App Store capabilities",
  "Huawei-specific services",
];

const MATRIX = [
  ["Android → Android", "Planned / testing"],
  ["Android → iPhone", "Planned / testing"],
  ["iPhone → Android", "Planned / testing"],
  ["iPhone → iPhone", "Planned / testing"],
  ["Huawei → Android", "Planned / testing"],
  ["Android → Huawei", "Planned / testing"],
  ["Huawei → iPhone", "Planned / testing"],
  ["iPhone → Huawei", "Planned / testing"],
];

export default function Connectivity() {
  return (
    <>
      <PageHero
        eyebrow="Connectivity"
        title="Authorized connections, intelligently managed"
        subtitle="GoodMash is designed to help users manage authorized available connections intelligently — with the connection owner always in control."
      />

      {/* OWNER CONTROL */}
      <Section className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="Owner control"
            title="Connection owners stay in control"
            subtitle="The connection owner controls authorized access to their available connection, at all times."
          />
          <ul className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
            {CONTROLS.map((c) => (
              <li
                key={c}
                className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-5 py-3.5"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-700 text-white">
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
                <span className="text-sm font-semibold text-brand-900">{c}</span>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-ink-soft">
            GoodMash groups are designed around authorization and controlled
            membership — no one is connected without approval.
          </p>
        </Container>
      </Section>

      {/* SMART CONNECTIONS */}
      <Section className="bg-cream">
        <Container>
          <SectionHeader
            eyebrow="Smart connections"
            title="Clear connection states"
            subtitle="Where technically supported, GoodMash can help users choose an available authorized connection and show its state clearly."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STATES.map((s) => (
              <Card key={s.name} className="text-center">
                <span
                  className={`mx-auto block h-4 w-24 rounded-full ${s.color}`}
                  aria-hidden="true"
                />
                <h3 className="mt-4 text-lg font-extrabold text-brand-900">
                  {s.name}
                </h3>
                <p className="mt-2 text-sm text-ink-soft">{s.note}</p>
              </Card>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card className="p-7">
              <h3 className="text-lg font-extrabold text-brand-900">
                Automatic failover
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Where technically supported, automatic failover can move a
                session to another authorized connection when the current
                connection becomes unavailable.
              </p>
            </Card>
            <Card className="p-7">
              <h3 className="text-lg font-extrabold text-brand-900">
                Honest status
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                A UI status is not proof of connectivity. GoodMash is committed
                to physically testing real devices and documenting which
                features are supported by each device and platform.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* PLATFORMS */}
      <Section className="bg-brand-950 text-white">
        <Container>
          <SectionHeader
            dark
            eyebrow="Cross-platform"
            title="Built for multiple device ecosystems"
            subtitle="GoodMash.io targets Android, iPhone / iOS, and Huawei / EMUI device ecosystems."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Android",
                desc: "A broad range of Android devices from Samsung to ZTE and more.",
              },
              {
                name: "iPhone / iOS",
                desc: "Apple devices use the appropriate supported iOS networking capabilities.",
              },
              {
                name: "Huawei / EMUI",
                desc: "Huawei devices are considered separately where Google services are unavailable.",
              },
            ].map((p) => (
              <Card key={p.name} className="bg-brand-900/60 text-white border-brand-800">
                <h3 className="text-xl font-extrabold">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-100/80">
                  {p.desc}
                </p>
              </Card>
            ))}
          </div>
          <p className="mt-10 text-center text-sm font-semibold text-gold-400">
            Actual features can vary according to operating-system and device
            capabilities.
          </p>
        </Container>
      </Section>

      {/* DEVICE SUPPORT */}
      <Section className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="Device support"
            title="Target Android manufacturers"
            subtitle="GoodMash aims to support these and other compatible devices — verified, not assumed."
          />
          <div className="flex flex-wrap justify-center gap-2.5">
            {DEVICES.map((d) => (
              <span
                key={d}
                className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800"
              >
                {d}
              </span>
            ))}
            <span className="rounded-full border border-gold-400 bg-gold-100 px-4 py-2 text-sm font-semibold text-brand-900">
              and other compatible devices
            </span>
          </div>
        </Container>
      </Section>

      {/* LIMITATIONS + TESTING */}
      <Section className="bg-cream">
        <Container>
          <SectionHeader
            eyebrow="Real-world reality"
            title="Operating systems have limits"
            subtitle="No feature is advertised as universally available until it has been technically verified."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-7">
              <h3 className="text-lg font-extrabold text-brand-900">
                Things systems may restrict
              </h3>
              <ul className="mt-4 grid gap-2.5">
                {LIMITS.map((l) => (
                  <li key={l} className="flex items-center gap-3 text-sm text-ink-soft">
                    <span className="h-2 w-2 rounded-full bg-gold-500" />
                    {l}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                GoodMash adapts to these constraints rather than falsely
                claiming that every phone works identically.
              </p>
            </Card>
            <Card className="p-7">
              <h3 className="text-lg font-extrabold text-brand-900">
                Cross-device testing program
              </h3>
              <ul className="mt-4 grid gap-2.5">
                {MATRIX.map(([pair, status]) => (
                  <li
                    key={pair}
                    className="flex items-center justify-between gap-3 rounded-lg border border-brand-100 bg-brand-50 px-4 py-2.5 text-sm"
                  >
                    <span className="font-semibold text-brand-900">{pair}</span>
                    <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-bold text-gold-700">
                      {status}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                Every pair is physically tested with real devices before
                features are claimed. We document what works per device and
                platform.
              </p>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
