import Image from "next/image";

/* Pre-launch: store URLs not live yet. Swap these in when the apps publish,
   then wire device-aware routing (iOS→App Store, Android→Play, desktop→both+QR).
   TODO(seo): add JSON-LD (MobileApplication / Organization / FAQPage) in the SEO
   pass via a hook-safe structured-data approach. */
const APP_STORE_URL = "#get";
const PLAY_STORE_URL = "#get";

const PILLARS = [
  {
    title: "It remembers, so you don't have to",
    body: "Feeds, sleep, diapers, growth and milestones — logged in two taps and quietly kept, even the side you last nursed on. Stay in the cuddle; we hold the thread.",
  },
  {
    title: "Reassurance, not a spreadsheet",
    body: "We show your baby's own rhythm against the normal range — gentle context, never an alarm-red verdict. The answer to “is my baby okay?” before you have to ask.",
  },
  {
    title: "Warm at 3am",
    body: "A genuinely warm Night-Feed mode — soft amber on deep brown, easy on sleepy eyes and easy on the baby's. The one app that doesn't blink awake like a billboard.",
  },
];

const FAQ = [
  {
    q: "Is Victoria Baby Care free?",
    a: "The core tracker is free to use. A gentle premium plan unlocks extras like keepsake growth timelines and pattern insights — no ads, ever.",
  },
  {
    q: "Does it work for twins or more?",
    a: "Yes. Track twins, triplets or quadruplets together, each with their own profile and timeline.",
  },
  {
    q: "What languages does it support?",
    a: "Twenty, so the app can speak to you in your own language — a rarity among baby trackers.",
  },
  {
    q: "Can both parents or caregivers use it?",
    a: "Yes — the family shares one synced view, so everyone caring for your baby stays on the same page.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-wall text-ink">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-cardborder/70 bg-wall/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <Image src="/luna-256.png" alt="Victoria Baby Care" width={34} height={34} priority />
            <span className="font-serif text-lg font-semibold">Victoria Baby Care</span>
          </div>
          <a
            href="#get"
            className="rounded-full bg-clay px-5 py-2 text-sm font-semibold text-cream transition-colors hover:bg-clay-deep"
          >
            Get the app
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="inline-block rounded-full bg-sage/20 px-3 py-1 text-xs font-semibold text-sage">
            For the long days and longer nights
          </span>
          <h1 className="mt-5 text-4xl leading-[1.12] md:text-5xl">
            The baby tracker that does <em className="not-italic text-clay">less</em> for you.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-secondary">
            Most apps make exhausted parents input more. Victoria remembers the feeds, naps and
            milestones for you, reassures you your baby&rsquo;s okay, and stays warm and kind at 3am.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={APP_STORE_URL} aria-label="Download on the App Store">
              <Image src="/app-store-badge.svg" alt="Download on the App Store" width={144} height={48} unoptimized />
            </a>
            <a href={PLAY_STORE_URL} aria-label="Get it on Google Play">
              <Image src="/google-play-badge.png" alt="Get it on Google Play" width={161} height={48} />
            </a>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted">Coming soon to the App Store &amp; Google Play.</span>
            <a href="#how" className="font-semibold text-clay hover:text-clay-deep">See how it helps</a>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative flex h-72 w-72 items-center justify-center rounded-full bg-[radial-gradient(circle,_#fbead9_0%,_#f6efe6_70%)] md:h-96 md:w-96">
            <Image src="/luna.png" alt="Luna, the sleeping moon" width={260} height={260} priority />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-plaster/60 py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="text-3xl">Tracking shouldn&rsquo;t cost you sleep</h2>
          <p className="mt-4 text-lg leading-relaxed text-secondary">
            The category is full of digital spreadsheets that turn a tender moment into data entry —
            and obsessive tracking can actually leave parents more anxious and more tired. We built
            the opposite: a calm companion that carries the remembering, so you can be present.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-[20px] border border-cardborder bg-cream p-7">
              <div className="mb-4 h-1 w-9 rounded-full bg-sage" />
              <h3 className="text-xl">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-secondary">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand story */}
      <section className="bg-night py-20 text-cream">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-5 text-center md:flex-row md:text-left">
          <Image src="/luna-256.png" alt="Luna" width={120} height={120} className="shrink-0" />
          <div>
            <h2 className="text-3xl text-cream">Meet Luna</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#d8cbb8]">
              Luna is the sleeping moon who keeps watch through the night — calm, warm, always there.
              She&rsquo;s the heart of Victoria Baby Care: a quiet promise that you and your baby are
              held, even at the smallest hours.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-20">
        <h2 className="text-center text-3xl">Questions, gently answered</h2>
        <div className="mt-10 space-y-4">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-cardborder bg-cream p-5">
              <summary className="cursor-pointer list-none font-serif text-lg font-semibold marker:hidden">
                {f.q}
              </summary>
              <p className="mt-3 leading-relaxed text-secondary">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section id="get" className="bg-plaster/60 py-20">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <Image src="/luna-256.png" alt="Victoria Baby Care" width={64} height={64} className="mx-auto" />
          <h2 className="mt-5 text-3xl">A softer place to land</h2>
          <p className="mt-4 text-lg text-secondary">
            Bring the calm home. Victoria Baby Care is coming soon to iPhone and Android.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href={APP_STORE_URL} aria-label="Download on the App Store">
              <Image src="/app-store-badge.svg" alt="Download on the App Store" width={144} height={48} unoptimized />
            </a>
            <a href={PLAY_STORE_URL} aria-label="Get it on Google Play">
              <Image src="/google-play-badge.png" alt="Get it on Google Play" width={161} height={48} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cardborder py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted md:flex-row">
          <span className="font-serif text-base text-secondary">Victoria Baby Care</span>
          <span>Made with love for tired, wonderful parents.</span>
        </div>
      </footer>
    </div>
  );
}
