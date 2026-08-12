import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container, Section, SectionHeader, Card } from "@/components/Section";
import { ButtonLink } from "@/components/Button";
import { Tick } from "@/components/DemoBanner";

export const metadata: Metadata = {
  title: "Groups",
  description:
    "Create private GoodMash groups for family, students, friends, community or custom use — with authorization and controlled membership.",
};

const GROUP_TYPES = [
  { name: "Family", icon: "🏠", desc: "Create a private group for your family and control who participates." },
  { name: "Students", icon: "🎓", desc: "Organize fellow students with flexible, rotating responsibility." },
  { name: "Friends", icon: "🤝", desc: "A private circle for friends where everyone is authorized." },
  { name: "Community", icon: "🌍", desc: "Build a controlled community network around a shared space." },
  { name: "Custom group", icon: "⚙️", desc: "Name it and shape it your way — authorization always applies." },
];

const ROTATION = [
  { month: "August", who: "Student A" },
  { month: "September", who: "Student B" },
  { month: "October", who: "Student C" },
  { month: "November", who: "Student D" },
];

export default function Groups() {
  return (
    <>
      <PageHero
        eyebrow="Groups"
        title="Private networks for the people you choose"
        subtitle="GoodMash groups are designed around authorization and controlled membership. The owner controls who is allowed to participate."
      />

      {/* GROUP TYPES */}
      <Section className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="Private networks"
            title="Create or join private groups"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {GROUP_TYPES.map((g) => (
              <Card key={g.name} className="text-center">
                <span className="text-3xl" aria-hidden="true">
                  {g.icon}
                </span>
                <h3 className="mt-3 font-extrabold text-brand-900">{g.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                  {g.desc}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAMILY EXAMPLE */}
      <Section id="family" className="bg-brand-50">
        <Container>
          <SectionHeader
            eyebrow="Example"
            title="A private family group"
            subtitle="The owner controls who is allowed to participate — approval is required for every member."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-7">
              <h3 className="text-lg font-extrabold text-brand-900">
                The family
              </h3>
              <ul className="mt-4 space-y-2.5">
                {["Dad", "Mom", "Child", "Child", "Child"].map((m, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-brand-100 bg-white px-4 py-3"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-800 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-brand-900">{m}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-7">
              <h3 className="text-lg font-extrabold text-brand-900">
                How authorization works
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
                <li className="flex gap-3">
                  <Tick />
                  A family creates a private GoodMash group.
                </li>
                <li className="flex gap-3">
                  <Tick />
                  The owner invites family members and approves who joins.
                </li>
                <li className="flex gap-3">
                  <Tick />
                  Members participate only as authorized.
                </li>
                <li className="flex gap-3">
                  <Tick />
                  The owner can remove or block members at any time.
                </li>
                <li className="flex gap-3">
                  <Tick />
                  One family member can maintain several family members.
                </li>
              </ul>
            </Card>
          </div>
        </Container>
      </Section>

      {/* STUDENT EXAMPLE */}
      <Section id="students" className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="Example"
            title="A student group with rotating responsibility"
            subtitle="The purpose is flexible responsibility — not one person maintaining everyone permanently."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-7">
              <h3 className="text-lg font-extrabold text-brand-900">
                Maintenance rotation
              </h3>
              <ul className="mt-4 divide-y divide-brand-100">
                {ROTATION.map((r) => (
                  <li
                    key={r.month}
                    className="flex items-center justify-between py-3"
                  >
                    <span className="font-semibold text-brand-900">
                      {r.month}
                    </span>
                    <span className="rounded-full bg-brand-800 px-3.5 py-1 text-sm font-bold text-white">
                      {r.who}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-ink-soft">
                Each student takes a month — shared responsibility, no single
                person stuck forever.
              </p>
            </Card>
            <Card className="p-7">
              <h3 className="text-lg font-extrabold text-brand-900">
                What students can do
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
                <li className="flex gap-3">
                  <Tick />
                  Create groups and organize members.
                </li>
                <li className="flex gap-3">
                  <Tick />
                  Rotate maintenance responsibility.
                </li>
                <li className="flex gap-3">
                  <Tick />
                  Manage authorized connections.
                </li>
                <li className="flex gap-3">
                  <Tick />
                  Use supported connectivity arrangements.
                </li>
                <li className="flex gap-3">
                  <Tick />
                  Participate in multiple groups where permitted.
                </li>
              </ul>
            </Card>
          </div>
        </Container>
      </Section>

      {/* ACCOUNT ARCHITECTURE */}
      <Section className="bg-brand-950 text-white">
        <Container>
          <SectionHeader
            dark
            eyebrow="Account architecture"
            title="Your account is separate from your groups"
            subtitle="Move between different social structures without destroying your underlying account."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-brand-900/60 text-white border-brand-800">
              <h3 className="text-lg font-extrabold">Your account</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-100/80">
                One account can potentially participate in a family group, a
                student group, friends, work, community and other private groups
                — where each group&apos;s owner permits it.
              </p>
            </Card>
            <Card className="bg-brand-900/60 text-white border-brand-800">
              <h3 className="text-lg font-extrabold">What users can do</h3>
              <ul className="mt-3 space-y-2 text-sm text-brand-100/80">
                {[
                  "Create groups",
                  "Join groups",
                  "Leave groups",
                  "Participate in multiple groups where permitted",
                  "Maintain their own account",
                  "Manage authorized connections",
                ].map((x) => (
                  <li key={x} className="flex items-center gap-3">
                    <Tick /> {x}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/pricing" variant="gold">
              See membership & maintenance
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
