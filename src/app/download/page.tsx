import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container, Section, SectionHeader, Card } from "@/components/Section";
import { ButtonLink } from "@/components/Button";
import { DemoBanner } from "@/components/DemoBanner";

export const metadata: Metadata = {
  title: "Download",
  description:
    "GoodMash download page. Official store links will be activated once the applications are approved and published. No fake buttons.",
};

const STORES = [
  {
    name: "Google Play",
    icon: "▶",
    platform: "Android",
    status: process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ? "Available" : "Coming soon",
    note: process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ? "Official Android download." : "Add the official Play Store URL after publication.",
    url: process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || "",
  },
  {
    name: "Huawei AppGallery",
    icon: "◈",
    platform: "Huawei / EMUI",
    status: process.env.NEXT_PUBLIC_HUAWEI_APPGALLERY_URL ? "Available" : "Coming soon",
    note: process.env.NEXT_PUBLIC_HUAWEI_APPGALLERY_URL ? "Official Huawei download." : "Add the AppGallery URL after publication.",
    url: process.env.NEXT_PUBLIC_HUAWEI_APPGALLERY_URL || "",
  },
  {
    name: "Apple App Store",
    icon: " ",
    platform: "iPhone / iOS",
    status: process.env.NEXT_PUBLIC_APP_STORE_URL ? "Available" : "Coming soon",
    note: process.env.NEXT_PUBLIC_APP_STORE_URL ? "Official iOS download." : "Add the App Store URL after publication.",
    url: process.env.NEXT_PUBLIC_APP_STORE_URL || "",
  },
];

export default function Download() {
  return (
    <>
      <PageHero
        eyebrow="Download"
        title="Get GoodMash"
        subtitle="GoodMash will be distributed through official app stores and this download page. We never publish fake download buttons — links activate only after apps are approved and published."
      />

      <Section className="bg-white">
        <Container>
          <SectionHeader
            eyebrow="Platforms"
            title="Target distribution"
            subtitle="Check back here for official store links. Meanwhile, explore the demo and learn how GoodMash works."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {STORES.map((s) => (
              <Card key={s.name} className="flex flex-col items-center p-8 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-3xl font-black text-brand-800 ring-1 ring-brand-200">
                  {s.icon.trim() ? s.icon : <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8"><path d="M12 3v10m0 0l-4-4m4 4l4-4M5 17v2a2 2 0 002 2h10a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-brand-900">
                  {s.name}
                </h3>
                <p className="text-sm text-ink-soft">{s.platform}</p>
                <span className="mt-3 rounded-full bg-gold-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-gold-700">
                  {s.status}
                </span>
                <p className="mt-3 text-xs leading-relaxed text-ink-soft">{s.note}</p>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noreferrer" className="mt-5 rounded-full bg-brand-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-800">
                    Download / Open store
                  </a>
                ) : null}
              </Card>
            ))}
          </div>

          {process.env.NEXT_PUBLIC_ANDROID_TEST_APK_URL ? (
            <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-gold-200 bg-gold-50 p-6 text-center">
              <p className="text-xs font-extrabold uppercase tracking-wider text-gold-700">Private test build</p>
              <h3 className="mt-2 text-xl font-extrabold text-brand-900">Android APK testing</h3>
              <p className="mt-2 text-sm text-ink-soft">This is for controlled testing only. It is not the official public store release.</p>
              <a href={process.env.NEXT_PUBLIC_ANDROID_TEST_APK_URL} className="mt-5 inline-flex rounded-full bg-brand-900 px-6 py-3 text-sm font-bold text-white">Download test APK</a>
            </div>
          ) : null}

          <div className="mx-auto mt-12 max-w-2xl">
            <DemoBanner text="No downloads are available yet. Store links will appear here only once the real applications are approved and published on the official stores." />
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-950 text-white">
        <Container className="text-center">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Not ready to download? Start learning
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-brand-100/80">
            Explore how GoodMash works, see the demo, or ask the GoodMash AI
            Agent any question.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/how-it-works" variant="gold">
              How It Works
            </ButtonLink>
            <ButtonLink
              href="/demo"
              className="border-white/40 text-white hover:bg-white hover:text-brand-900"
              variant="secondary"
            >
              Explore the demo
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
